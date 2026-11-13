"""Act on a creator approval from the TikTok approval page.

The page (yashwanth-kumar-kotla.github.io/tiktok/post) opens a pre-filled GitHub issue titled
"[tiktok-post] <video id> <nonce>" whose body holds the creator's choices as JSON. The tiktok-approve workflow runs this
only for issues opened by the repo owner. Everything is validated against TikTok's current creator_info before posting.

when = "now":  posts the video to TikTok right away with exactly those settings, waits for TikTok's status, reports.
when = "slot": saves the approval; the hourly publisher posts it at the channel's next TikTok slot (Direct mode).
Result goes back as an issue comment (the page shows it), then the issue is closed.
"""
from __future__ import annotations

import json
import os
import re
import tempfile
import time

import requests

from . import state, stock, tiktok
from .publish import download

REPO = os.environ.get("GITHUB_REPOSITORY", "Yashwanth-Kumar-Kotla/Youtube_Automation")
PRIVACY = {"PUBLIC_TO_EVERYONE", "MUTUAL_FOLLOW_FRIENDS", "FOLLOWER_OF_CREATOR", "SELF_ONLY"}


def gh(method: str, path: str, **kw):
    r = requests.request(method, f"https://api.github.com/repos/{REPO}{path}", timeout=30,
                         headers={"Authorization": f"Bearer {os.environ['GH_TOKEN']}",
                                  "Accept": "application/vnd.github+json"}, **kw)
    r.raise_for_status()
    return r.json() if r.text else {}


def parse(body: str) -> dict:
    m = re.search(r"```json\s*(\{.*?\})\s*```", body or "", re.S)
    if not m:
        raise ValueError("no approval JSON in the issue")
    return json.loads(m.group(1))


def validate(a: dict, info: dict, video: dict) -> dict:
    """Return TikTok post_info built only from the creator's own choices, or raise ValueError."""
    if info.get("error"):
        raise ValueError(f"TikTok says this account can't post right now: {info['error']} {info.get('message', '')}")
    if a.get("consent") is not True:
        raise ValueError("the Music Usage / Branded Content confirmation was not accepted")
    privacy = a.get("privacy")
    if privacy not in PRIVACY or privacy not in info.get("privacy_level_options", []):
        raise ValueError(f"privacy '{privacy}' is not one of this account's options {info.get('privacy_level_options')}")
    your_brand, branded = bool(a.get("your_brand")), bool(a.get("branded_content"))
    if a.get("disclose") and not (your_brand or branded):
        raise ValueError("content disclosure is on but neither 'Your brand' nor 'Branded content' was chosen")
    if not a.get("disclose"):
        your_brand = branded = False
    if branded and privacy == "SELF_ONLY":
        raise ValueError("branded content can't be posted as 'Only me'")
    cap = str(a.get("caption", ""))[:2200]
    max_len = info.get("max_video_post_duration_sec")
    if max_len and (video.get("length") or 0) > max_len:
        raise ValueError(f"video is {video.get('length')} s; this account can post up to {max_len} s")
    return {"title": cap, "privacy_level": privacy,
            "disable_comment": info.get("comment_disabled", False) or not a.get("allow_comment", False),
            "disable_duet": info.get("duet_disabled", False) or not a.get("allow_duet", False),
            "disable_stitch": info.get("stitch_disabled", False) or not a.get("allow_stitch", False),
            "brand_organic_toggle": your_brand, "brand_content_toggle": branded}


def post_now(vid: str, video: dict, post_info: dict) -> str:
    with tempfile.TemporaryDirectory() as tmp:
        download(video["branch"], tmp)
        pid = tiktok.upload("body", os.path.join(tmp, f"{vid}.mp4"), post_info["title"], "direct",
                            post_info["privacy_level"], post_info)
    for _ in range(36):                      # TikTok processes the upload asynchronously; wait up to ~6 min
        time.sleep(10)
        d = tiktok.status("body", pid).get("data", {})
        if d.get("status") in ("PUBLISH_COMPLETE", "FAILED"):
            if d["status"] == "FAILED":
                raise RuntimeError(f"TikTok processing failed: {d.get('fail_reason')}")
            return pid
    return pid                              # still processing; it will appear shortly


def main() -> int:
    ev = json.load(open(os.environ["GITHUB_EVENT_PATH"]))
    issue = ev["issue"]
    n = issue["number"]
    app = os.environ.get("TIKTOK_APP", "prod")
    try:
        a = parse(issue.get("body", ""))
        vid = a.get("id", "")
        if vid not in issue["title"]:
            raise ValueError("video id in the title and body don't match")
        video = stock.load("body")["videos"].get(vid)
        if not video or not video.get("branch") or video.get("status") not in ("ready", "scheduled"):
            raise ValueError(f"{vid} is not a stocked video")
        info = tiktok.creator_info("body")
        post_info = validate(a, info, video)
        if a.get("when") == "slot" and app == "prod":
            approved = state.load("tiktok/approved.json", {})
            approved[vid] = {**post_info, "approved_at": issue["created_at"], "issue": n}
            state.save("tiktok/approved.json", approved)
            msg = (f"✅ Approved. **{video['title']}** will be posted to TikTok at the next posting slot "
                   f"with privacy **{post_info['privacy_level']}**.")
        else:
            pid = post_now(vid, video, post_info)
            if app == "prod":
                sent = state.load("tiktok_drafts.json", {})
                sent[vid] = pid
                state.save("tiktok_drafts.json", sent)
            msg = (f"✅ Posted to TikTok ({app}). **{video['title']}** with privacy **{post_info['privacy_level']}**. "
                   f"It may take a few minutes to process before it shows on the profile. (publish id `{pid}`)")
        rc = 0
    except Exception as e:
        msg, rc = f"❌ Not posted: {e}", 1
    print(msg)
    gh("POST", f"/issues/{n}/comments", json={"body": msg})
    gh("PATCH", f"/issues/{n}", json={"state": "closed"})
    return rc


if __name__ == "__main__":
    raise SystemExit(main())
