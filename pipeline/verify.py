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
    key = os.environ.get("YT_API_KEY")
    if key:
        j = requests.get("https://www.googleapis.com/youtube/v3/search", timeout=20,
                         params={"part": "id", "q": "what happens if", "maxResults": 1, "type": "video", "key": key}).json()
        out["api_key"] = "ok" if "items" in j else f"FAILED: {json.dumps(j.get('error', j))[:300]}"
    state.save("verify.json", out)
    print(json.dumps(out, indent=1))


if __name__ == "__main__":
    main()
