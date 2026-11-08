"""Weekly raw trend data for the scout agent (runs in GitHub Actions, needs no AI).

YouTube: for each channel's scout_queries, Shorts published in the last 7 days sorted by views, with
views/hour and the uploader's subscriber count (outliers = views >> subscribers = a format worth studying).
Reddit: top posts of the week in each channel's reddit_subs.

  python -m pipeline.scout_data   → data/trends/<date>/{youtube,reddit}_<channel>.json
"""
from __future__ import annotations

import json
import os
from datetime import datetime, timedelta, timezone

import requests
import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = "autoshorts-scout/1.0 (personal research script)"


def yt_client(cfg):
    from googleapiclient.discovery import build
    if os.environ.get("YT_API_KEY"):
        return build("youtube", "v3", developerKey=os.environ["YT_API_KEY"], cache_discovery=False)
    from . import youtube
    for ch in cfg["channels"]:
        if youtube.has_token(ch):
            return youtube.service(ch)
    return None


def youtube_trends(yt, queries: list[str]) -> list[dict]:
    since = (datetime.now(timezone.utc) - timedelta(days=7)).strftime("%Y-%m-%dT%H:%M:%SZ")
    ids: dict[str, str] = {}
    for q in queries:
        r = yt.search().list(part="id", q=q, type="video", videoDuration="short", order="viewCount",
                             publishedAfter=since, maxResults=25, relevanceLanguage="en").execute()
        for it in r.get("items", []):
            ids[it["id"]["videoId"]] = q
    vids = []
    idl = list(ids)
    for i in range(0, len(idl), 50):
        vids += yt.videos().list(part="snippet,statistics,contentDetails", id=",".join(idl[i:i + 50])).execute()["items"]
    chans = {}
    cl = list({v["snippet"]["channelId"] for v in vids})
    for i in range(0, len(cl), 50):
        for c in yt.channels().list(part="statistics", id=",".join(cl[i:i + 50])).execute()["items"]:
            chans[c["id"]] = int(c["statistics"].get("subscriberCount", 0) or 0)
    now = datetime.now(timezone.utc)
    out = []
    for v in vids:
        sn, st = v["snippet"], v["statistics"]
        age_h = max(1.0, (now - datetime.fromisoformat(sn["publishedAt"].replace("Z", "+00:00"))).total_seconds() / 3600)
        views = int(st.get("viewCount", 0))
        subs = chans.get(sn["channelId"], 0)
        out.append({"title": sn["title"], "channel": sn["channelTitle"], "url": f"https://youtube.com/shorts/{v['id']}",
                    "views": views, "views_per_hour": round(views / age_h), "likes": int(st.get("likeCount", 0)),
                    "comments": int(st.get("commentCount", 0)), "channel_subs": subs,
                    "outlier_ratio": round(views / max(subs, 1000), 1), "duration": v["contentDetails"]["duration"],
                    "query": ids[v["id"]], "published": sn["publishedAt"]})
    return sorted(out, key=lambda x: -x["views_per_hour"])[:60]


def reddit_token():
    cid, sec = os.environ.get("REDDIT_CLIENT_ID"), os.environ.get("REDDIT_CLIENT_SECRET")
    if not (cid and sec):
        return None
    r = requests.post("https://www.reddit.com/api/v1/access_token", auth=(cid, sec),
                      data={"grant_type": "client_credentials"}, headers={"User-Agent": UA}, timeout=30)
    return r.json().get("access_token")


def reddit_top(subs: list[str], tok) -> list[dict]:
    out = []
    base = "https://oauth.reddit.com" if tok else "https://www.reddit.com"
    h = {"User-Agent": UA, **({"Authorization": f"bearer {tok}"} if tok else {})}
    for s in subs:
        try:
            r = requests.get(f"{base}/r/{s}/top.json?t=week&limit=25", headers=h, timeout=30).json()
            for p in r["data"]["children"]:
                d = p["data"]
                out.append({"sub": s, "title": d["title"], "score": d["score"], "comments": d["num_comments"],
                            "url": "https://reddit.com" + d["permalink"]})
        except Exception as e:
            out.append({"sub": s, "error": str(e)[:200]})
    return out


def main():
    cfg = yaml.safe_load(open(os.path.join(ROOT, "config.yaml")))
    day = datetime.now().strftime("%Y-%m-%d")
    d = os.path.join(ROOT, "data", "trends", day)
    os.makedirs(d, exist_ok=True)
    yt = yt_client(cfg)
    tok = reddit_token()
    for ch, c in cfg["channels"].items():
        if not c.get("enabled"):
            continue
        if yt and c.get("scout_queries"):
            try:
                json.dump(youtube_trends(yt, c["scout_queries"]), open(f"{d}/youtube_{ch}.json", "w"), indent=1)
            except Exception as e:
                print(f"{ch} youtube: {e}")
        if c.get("reddit_subs"):
            json.dump(reddit_top(c["reddit_subs"], tok), open(f"{d}/reddit_{ch}.json", "w"), indent=1)
        print(f"{ch}: done")


if __name__ == "__main__":
    main()
