"""Daily stats: YouTube (Data + Analytics API) and TikTok (Display API) for every video in each LEDGER.

  python -m pipeline.stats      → data/stats/<date>/<channel>.json
"""
from __future__ import annotations

import json
import os
import re
from datetime import date

import requests
import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def ledger_ids(ch: str) -> tuple[list[str], list[str]]:
    p = os.path.join(ROOT, "memory", "channels", ch, "LEDGER.md")
    yt, tt = [], []
    if os.path.exists(p):
        for line in open(p):
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if len(cells) >= 5 and re.match(r"\d{4}-\d{2}-\d{2}", cells[0]):
                if cells[3]:
                    yt.append(cells[3])
                if cells[4]:
                    tt.append(cells[4])
    return yt, tt


def tiktok_stats(ch: str) -> list[dict]:
    from .tiktok import _token
    tok = _token(ch)
    r = requests.post("https://open.tiktokapis.com/v2/video/list/?fields=id,title,create_time,view_count,like_count,"
                      "comment_count,share_count,duration", headers={"Authorization": f"Bearer {tok}"},
                      json={"max_count": 20}, timeout=30).json()
    return r.get("data", {}).get("videos", [])


def main():
    cfg = yaml.safe_load(open(os.path.join(ROOT, "config.yaml")))
    today = date.today().isoformat()
    out_dir = os.path.join(ROOT, "data", "stats", today)
    os.makedirs(out_dir, exist_ok=True)
    for ch in cfg["channels"]:
        res: dict = {"date": today}
        yt_ids, _ = ledger_ids(ch)
        from . import youtube
        if youtube.has_token(ch):
            try:
                res["youtube"] = youtube.video_stats(ch, yt_ids, "2026-01-01", today)
                info = youtube.service(ch).channels().list(part="statistics", mine=True).execute()["items"][0]["statistics"]
                res["youtube_channel"] = info
            except Exception as e:
                res["youtube_error"] = str(e)
        if os.environ.get(f"TIKTOK_{ch.upper()}_REFRESH_TOKEN"):
            try:
                res["tiktok"] = tiktok_stats(ch)
            except Exception as e:
                res["tiktok_error"] = str(e)
        if len(res) > 1:
            json.dump(res, open(os.path.join(out_dir, f"{ch}.json"), "w"), indent=1)
            print(f"{ch}: saved")


if __name__ == "__main__":
    main()
