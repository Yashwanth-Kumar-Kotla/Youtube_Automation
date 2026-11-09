"""Credential check: proves each saved secret works without revealing it. Writes state/verify.json.

  python -m pipeline.verify
"""
from __future__ import annotations

import json
import os
from datetime import datetime, timezone

import requests
import yaml

from . import state, youtube

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main():
    cfg = yaml.safe_load(open(os.path.join(ROOT, "config.yaml")))
    out = {"checked_at": datetime.now(timezone.utc).isoformat(timespec="seconds"), "channels": {}}
    out["secrets_present"] = {k: bool(os.environ.get(k)) for k in
                              ["YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_API_KEY"] +
                              [f"YT_{c.upper()}_REFRESH_TOKEN" for c in cfg["channels"]] +
                              ["TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET"]}
    for ch in cfg["channels"]:
        if not youtube.has_token(ch):
            continue
        r: dict = {}
        try:
            c = youtube.creds(ch)
            c.refresh(__import__("google.auth.transport.requests", fromlist=["Request"]).Request())
            info = requests.get("https://oauth2.googleapis.com/tokeninfo", params={"access_token": c.token}, timeout=20).json()
            r["scopes"] = sorted(s.rsplit("/", 1)[-1] for s in info.get("scope", "").split())
            me = youtube.service(ch).channels().list(part="snippet,statistics,status", mine=True).execute().get("items", [])
            if me:
                r["channel_title"] = me[0]["snippet"]["title"]
                r["channel_id"] = me[0]["id"]
                r["subscribers"] = me[0]["statistics"].get("subscriberCount")
                r["videos"] = me[0]["statistics"].get("videoCount")
                r["long_uploads_status"] = me[0].get("status", {}).get("longUploadsStatus")
            else:
                r["error"] = "token works but no YouTube channel on this login (pick the channel, not just the Google account)"
            try:
                youtube.analytics(ch).reports().query(ids="channel==MINE", startDate="2026-01-01",
                                                      endDate=datetime.now().strftime("%Y-%m-%d"), metrics="views").execute()
                r["analytics"] = "ok"
            except Exception as e:
                r["analytics"] = f"FAILED: {str(e)[:200]}"
            need = {"youtube.upload", "youtube.force-ssl", "youtube.readonly", "yt-analytics.readonly"}
            r["missing_scopes"] = sorted(need - set(r["scopes"]))
        except Exception as e:
            r["error"] = f"{type(e).__name__}: {str(e)[:300]}"
        out["channels"][ch] = r
    for ch in cfg["channels"]:
        if not os.environ.get(f"TIKTOK_{ch.upper()}_REFRESH_TOKEN"):
            continue
        t: dict = {}
        try:
            from . import tiktok
            tok = tiktok._token(ch)
            u = requests.get("https://open.tiktokapis.com/v2/user/info/", timeout=20,
                             params={"fields": "open_id,display_name,follower_count,video_count"},
                             headers={"Authorization": f"Bearer {tok}"}).json()
            d = u.get("data", {}).get("user", {})
            t = {"display_name": d.get("display_name"), "followers": d.get("follower_count"),
                 "videos": d.get("video_count"), "error": u.get("error", {}).get("code")}
            ci = requests.post("https://open.tiktokapis.com/v2/post/publish/creator_info/query/", timeout=20,
                               headers={"Authorization": f"Bearer {tok}", "Content-Type": "application/json; charset=UTF-8"}).json()
            t["creator_info"] = {"privacy_options": ci.get("data", {}).get("privacy_level_options"),
                                 "max_video_seconds": ci.get("data", {}).get("max_video_post_duration_sec"),
                                 "error": ci.get("error", {}).get("code")}
        except Exception as e:
            t["error"] = f"{type(e).__name__}: {str(e)[:300]}"
        out.setdefault("tiktok", {})[ch] = t
    key = os.environ.get("YT_API_KEY")
    if key:
        j = requests.get("https://www.googleapis.com/youtube/v3/search", timeout=20,
                         params={"part": "id", "q": "what happens if", "maxResults": 1, "type": "video", "key": key}).json()
        out["api_key"] = "ok" if "items" in j else f"FAILED: {json.dumps(j.get('error', j))[:300]}"
    state.save("verify.json", out)
    print(json.dumps(out, indent=1))


if __name__ == "__main__":
    main()
