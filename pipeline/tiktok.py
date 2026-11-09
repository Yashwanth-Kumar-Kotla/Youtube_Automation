"""TikTok Content Posting API (v2).

Env vars: TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_<CH>_REFRESH_TOKEN (from scripts/tiktok_auth.py).

Modes:
  draft  -> /inbox/video/init/ : video lands in the creator's TikTok inbox; you tap it, add a TRENDING SOUND, post.
            Works before app audit and is the higher-reach option (trending audio is a big ranking signal).
  direct -> /video/init/      : posts automatically. Until TikTok audits your app, posts are forced to SELF_ONLY.
Tokens live only in GitHub Secrets; nothing is written to disk.
"""
from __future__ import annotations

import math
import os

import requests

from . import state

API = "https://open.tiktokapis.com/v2"


def _token(channel: str) -> str:
    rt = os.environ.get(f"TIKTOK_{channel.upper()}_REFRESH_TOKEN")
    if not rt:
        raise RuntimeError(f"Missing TikTok refresh token for '{channel}'")
    r = requests.post(f"{API}/oauth/token/", timeout=30, data={
        "client_key": os.environ["TIKTOK_CLIENT_KEY"], "client_secret": os.environ["TIKTOK_CLIENT_SECRET"],
        "grant_type": "refresh_token", "refresh_token": rt})
    r.raise_for_status()
    j = r.json()
    if "access_token" not in j:
        raise RuntimeError(f"TikTok token refresh failed: {j}")
    # The token is never written to disk or git. TikTok refresh tokens last 365 days; if TikTok ever issues a new one,
    # flag it so the owner re-runs the 2-minute connect step (the value itself is never printed).
    if j.get("refresh_token") and j["refresh_token"] != rt:
        print(f"::warning::TikTok issued a new refresh token for {channel}; re-run the TikTok connect step within 365 days")
    return j["access_token"]


def _put_file(upload_url: str, mp4: str, size: int, chunk: int):
    n = max(1, math.floor(size / chunk))
    with open(mp4, "rb") as f:
        for i in range(n):
            start = i * chunk
            end = size - 1 if i == n - 1 else start + chunk - 1
            f.seek(start)
            data = f.read(end - start + 1)
            r = requests.put(upload_url, data=data, timeout=300, headers={
                "Content-Type": "video/mp4", "Content-Length": str(len(data)),
                "Content-Range": f"bytes {start}-{end}/{size}"})
            if r.status_code not in (200, 201, 206):
                raise RuntimeError(f"TikTok chunk upload failed {r.status_code}: {r.text[:300]}")


def upload(channel: str, mp4: str, caption: str, mode: str = "draft") -> str:
    tok = _token(channel)
    h = {"Authorization": f"Bearer {tok}", "Content-Type": "application/json; charset=UTF-8"}
    size = os.path.getsize(mp4)
    chunk = size if size <= 64 * 1024 * 1024 else 10 * 1024 * 1024
    src = {"source": "FILE_UPLOAD", "video_size": size, "chunk_size": chunk,
           "total_chunk_count": max(1, math.floor(size / chunk))}
    if mode == "direct":
        info = requests.post(f"{API}/post/publish/creator_info/query/", headers=h, timeout=30).json()
        levels = info.get("data", {}).get("privacy_level_options", ["SELF_ONLY"])
        privacy = "PUBLIC_TO_EVERYONE" if "PUBLIC_TO_EVERYONE" in levels else levels[0]
        body = {"post_info": {"title": caption[:2200], "privacy_level": privacy, "disable_duet": False,
                              "disable_comment": False, "disable_stitch": False, "video_cover_timestamp_ms": 1500,
                              "is_aigc": True},
                "source_info": src}
        url = f"{API}/post/publish/video/init/"
    else:
        body = {"source_info": src}
        url = f"{API}/post/publish/inbox/video/init/"
    r = requests.post(url, headers=h, json=body, timeout=60)
    j = r.json()
    if j.get("error", {}).get("code") not in (None, "ok"):
        raise RuntimeError(f"TikTok init failed: {j}")
    _put_file(j["data"]["upload_url"], mp4, size, chunk)
    return j["data"]["publish_id"]
