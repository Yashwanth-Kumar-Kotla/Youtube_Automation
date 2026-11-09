"""YouTube Data API v3 upload (scheduled publish) + comment, and YouTube Analytics stats.

Env vars (GitHub Secrets): YT_CLIENT_ID, YT_CLIENT_SECRET, YT_<CHANNEL>_REFRESH_TOKEN (e.g. YT_BODY_REFRESH_TOKEN).
Get the refresh token in the browser with Google's OAuth Playground (docs/SETUP_CHECKLIST.md). No terminal needed.

Quota: 10,000 units/day per Google Cloud project. Upload ~1,600, comment 50, search 100, list 1.
Until the project passes YouTube's API audit, API uploads are locked to PRIVATE.
"""
from __future__ import annotations

import os
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl",
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/yt-analytics.readonly",
]


def has_token(channel: str) -> bool:
    return bool(os.environ.get(f"YT_{channel.upper()}_REFRESH_TOKEN") and os.environ.get("YT_CLIENT_ID"))


def creds(channel: str) -> Credentials:
    tok = os.environ.get(f"YT_{channel.upper()}_REFRESH_TOKEN")
    cid, sec = os.environ.get("YT_CLIENT_ID"), os.environ.get("YT_CLIENT_SECRET")
    if not (tok and cid and sec):
        raise RuntimeError(f"Missing YouTube credentials for channel '{channel}'")
    return Credentials(None, refresh_token=tok, client_id=cid, client_secret=sec,
                       token_uri="https://oauth2.googleapis.com/token")


def service(channel: str):
    return build("youtube", "v3", credentials=creds(channel), cache_discovery=False)


def analytics(channel: str):
    return build("youtubeAnalytics", "v2", credentials=creds(channel), cache_discovery=False)


def next_slot(hour_local: int, tz: str) -> datetime:
    now = datetime.now(ZoneInfo(tz))
    slot = now.replace(hour=hour_local, minute=0, second=0, microsecond=0)
    if slot - now < timedelta(minutes=20):
        slot += timedelta(days=1)
    return slot


def upload(channel: str, mp4: str, title: str, description: str, tags: list[str], yt_cfg: dict, tz: str) -> dict:
    yt = service(channel)
    publish_at = next_slot(yt_cfg.get("publish_hour_local", 17), tz)
    body = {
        "snippet": {"title": title[:100], "description": description[:4900], "tags": tags[:15],
                    "categoryId": yt_cfg.get("category_id", "27"), "defaultLanguage": "en",
                    "defaultAudioLanguage": "en"},
        "status": {
            "privacyStatus": "private",                    # flips to public at publishAt
            "publishAt": publish_at.isoformat(),
            "selfDeclaredMadeForKids": bool(yt_cfg.get("made_for_kids", False)),
            "containsSyntheticMedia": False,               # cartoons aren't realistic synthetic media
            "embeddable": True,
        },
    }
    print(f"videos.insert part=snippet,status file={os.path.basename(mp4)} ({os.path.getsize(mp4)/1e6:.1f} MB)")
    print(f"  snippet.title={body['snippet']['title']!r} categoryId={body['snippet']['categoryId']} tags={len(tags)}")
    print(f"  status.privacyStatus=private publishAt={body['status']['publishAt']} "
          f"selfDeclaredMadeForKids={body['status']['selfDeclaredMadeForKids']}")
    req = yt.videos().insert(part="snippet,status", body=body,
                             media_body=MediaFileUpload(mp4, mimetype="video/mp4", chunksize=8 * 1024 * 1024,
                                                        resumable=True))
    resp = None
    while resp is None:
        _, resp = req.next_chunk()
    st = resp.get("status", {})
    print(f"  -> 200 OK video id={resp['id']} uploadStatus={st.get('uploadStatus')} privacyStatus={st.get('privacyStatus')}")
    return {"id": resp["id"], "publish_at": publish_at.isoformat()}


def comment(channel: str, video_id: str, text: str) -> None:
    """Posts the creator comment. The API can't pin it; pin it in the YouTube app if you like (optional)."""
    print(f"commentThreads.insert part=snippet videoId={video_id} text={text[:80]!r}")
    r = service(channel).commentThreads().insert(part="snippet", body={
        "snippet": {"videoId": video_id, "topLevelComment": {"snippet": {"textOriginal": text[:9000]}}}}).execute()
    print(f"  -> 200 OK comment thread id={r.get('id')} author={r['snippet']['topLevelComment']['snippet'].get('authorDisplayName')}")


def video_stats(channel: str, ids: list[str], start: str, end: str) -> dict:
    """Per-video analytics (retention, subs, shares) + public counters. Returns {video_id: {...}}."""
    out: dict = {}
    if not ids:
        return out
    yt = service(channel)
    for i in range(0, len(ids), 50):
        chunk = ids[i:i + 50]
        for v in yt.videos().list(part="statistics,snippet", id=",".join(chunk)).execute().get("items", []):
            s = v["statistics"]
            out[v["id"]] = {"title": v["snippet"]["title"], "published": v["snippet"]["publishedAt"],
                            "views": int(s.get("viewCount", 0)), "likes": int(s.get("likeCount", 0)),
                            "comments": int(s.get("commentCount", 0))}
    ya = analytics(channel)
    metrics = "views,averageViewPercentage,averageViewDuration,subscribersGained,shares,likes,comments"
    for i in range(0, len(ids), 50):
        chunk = ids[i:i + 50]
        try:
            r = ya.reports().query(ids="channel==MINE", startDate=start, endDate=end, metrics=metrics,
                                   dimensions="video", filters="video==" + ",".join(chunk), maxResults=200).execute()
        except Exception as e:  # analytics lag ~48h for new videos; never fail the whole run
            print(f"analytics query failed: {e}")
            continue
        cols = [h["name"] for h in r.get("columnHeaders", [])]
        for row in r.get("rows", []):
            d = dict(zip(cols, row))
            out.setdefault(d["video"], {}).update({k: d[k] for k in cols if k != "video"})
    return out


def recent_uploads(channel: str, n: int = 15) -> list[dict]:
    """The channel's latest uploads (any visibility the owner can see): [{id, title, privacy, publishAt}]. ~3 quota units."""
    yt = service(channel)
    up = yt.channels().list(part="contentDetails", mine=True).execute()["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
    items = yt.playlistItems().list(part="contentDetails", playlistId=up, maxResults=n).execute().get("items", [])
    ids = [i["contentDetails"]["videoId"] for i in items]
    if not ids:
        return []
    vs = yt.videos().list(part="snippet,status", id=",".join(ids)).execute().get("items", [])
    return [{"id": v["id"], "title": v["snippet"]["title"], "privacy": v["status"]["privacyStatus"],
             "publishAt": v["status"].get("publishAt")} for v in vs]
