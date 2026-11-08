"""YouTube Data API v3 upload with scheduled publishing.

Per channel env vars (CH = KIDS / MATURE / VIRAL):
  YT_CLIENT_ID, YT_CLIENT_SECRET            (one Google Cloud OAuth client for all channels)
  YT_<CH>_REFRESH_TOKEN                     (from scripts/youtube_auth.py, one per channel)

Quota: 10,000 units/day per Google Cloud project; one upload ~1,600 units, so about 6 uploads/day per project.
Until the project passes YouTube's API audit, API uploads are locked to PRIVATE. Apply for the audit on day 1.
"""
from __future__ import annotations

import os
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SCOPES = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube"]


def _service(channel: str):
    tok = os.environ.get(f"YT_{channel.upper()}_REFRESH_TOKEN")
    cid, sec = os.environ.get("YT_CLIENT_ID"), os.environ.get("YT_CLIENT_SECRET")
    if not (tok and cid and sec):
        raise RuntimeError(f"Missing YouTube credentials for channel '{channel}'")
    creds = Credentials(None, refresh_token=tok, client_id=cid, client_secret=sec,
                        token_uri="https://oauth2.googleapis.com/token", scopes=SCOPES)
    return build("youtube", "v3", credentials=creds, cache_discovery=False)


def next_slot(hour_local: int, tz: str) -> datetime | None:
    now = datetime.now(ZoneInfo(tz))
    slot = now.replace(hour=hour_local, minute=0, second=0, microsecond=0)
    if slot - now < timedelta(minutes=20):
        slot += timedelta(days=1)
    return slot


def upload(channel: str, mp4: str, title: str, description: str, tags: list[str], yt_cfg: dict, tz: str,
           thumb: str | None = None) -> str:
    yt = _service(channel)
    publish_at = next_slot(yt_cfg.get("publish_hour_local", 17), tz)
    body = {
        "snippet": {"title": title[:100], "description": description[:4900], "tags": tags[:15],
                    "categoryId": yt_cfg.get("category_id", "27"), "defaultLanguage": "en",
                    "defaultAudioLanguage": "en"},
        "status": {
            "privacyStatus": "private",                    # becomes public at publishAt
            "publishAt": publish_at.isoformat(),
            "selfDeclaredMadeForKids": bool(yt_cfg.get("made_for_kids", False)),
            "containsSyntheticMedia": False,               # cartoon sketches are not 'realistic' synthetic media
            "embeddable": True,
        },
    }
    req = yt.videos().insert(part="snippet,status", body=body,
                             media_body=MediaFileUpload(mp4, mimetype="video/mp4", chunksize=8 * 1024 * 1024,
                                                        resumable=True))
    resp = None
    while resp is None:
        _, resp = req.next_chunk()
    vid = resp["id"]
    if thumb:
        try:  # custom thumbnails need a verified channel; Shorts mostly ignore them anyway
            yt.thumbnails().set(videoId=vid, media_body=MediaFileUpload(thumb)).execute()
        except Exception:
            pass
    return vid
