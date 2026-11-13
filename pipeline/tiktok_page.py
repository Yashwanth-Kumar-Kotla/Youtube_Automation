"""Data for the TikTok approval page (yashwanth-kumar-kotla.github.io/tiktok/post).

Writes two public JSON files the page reads (no secrets in them):
  state/tiktok/creator_<app>.json  what TikTok says this creator can post right now (creator_info)
  state/tiktok/queue.json          stocked videos the creator can approve (title, caption, cover, length)
<app> is "prod" or "sandbox" (env TIKTOK_APP). Runs only in GitHub Actions (tokens live in GitHub Secrets).
"""
from __future__ import annotations

import os
from datetime import datetime, timezone

from . import state, stock, tiktok

REPO = "Yashwanth-Kumar-Kotla/Youtube_Automation"
RAW = f"https://raw.githubusercontent.com/{REPO}"


def caption(v: dict) -> str:
    tags = [h.lstrip("#").replace(" ", "") for h in v.get("hashtags", [])][:6]
    return f"{v.get('title', '')} " + " ".join(f"#{t}" for t in tags)


def main() -> int:
    app = os.environ.get("TIKTOK_APP", "prod")
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    info = tiktok.creator_info("body")
    keep = ("creator_nickname", "creator_username", "creator_avatar_url", "privacy_level_options",
            "comment_disabled", "duet_disabled", "stitch_disabled", "max_video_post_duration_sec", "error", "message")
    state.save(f"tiktok/creator_{app}.json", {"updated": now, "app": app, **{k: info[k] for k in keep if k in info}})
    print(f"[{app}] creator: {info.get('creator_nickname') or info.get('error')}")

    approved = state.load("tiktok/approved.json", {})
    vids = stock.load("body")["videos"]
    queue = []
    for vid, v in sorted(vids.items()):
        if v.get("status") not in ("ready", "scheduled") or not v.get("branch"):
            continue
        queue.append({"id": vid, "title": v.get("title", ""), "caption": caption(v), "length": v.get("length"),
                      "status": v["status"], "cover": f"{RAW}/{v['branch']}/{vid}.jpg",
                      "video": f"{RAW}/{v['branch']}/{vid}.mp4", "approved": vid in approved})
    state.save("tiktok/queue.json", {"updated": now, "videos": queue})
    print(f"queue: {len(queue)} videos")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
