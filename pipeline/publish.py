"""Publisher: turns branches media/YYYY-MM-DD into YouTube/TikTok posts. Runs in GitHub Actions only.

Files on the branch, per channel: <channel>.mp4, <channel>.json (meta), optional <channel>.jpg.
Meta (written by the writer agent): title, description, hashtags[], pinned_comment, series, episode, topic, experiment_arm.

  python -m pipeline.publish --pending      # every media/* branch (last 3 days) not yet in state/published.json
  python -m pipeline.publish --tag daily-2026-11-10
Idempotent: each (tag, channel, platform) is recorded and never posted twice.
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
import traceback

import yaml

from . import state

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def releases() -> list[str]:
    """daily-<date> for every media/<date> branch on origin."""
    out = subprocess.check_output(["git", "ls-remote", "--heads", "origin", "media/*"], text=True, cwd=ROOT)
    return sorted("daily-" + l.split("refs/heads/media/")[1] for l in out.splitlines() if "refs/heads/media/" in l)


def download(tag: str, dest: str) -> None:
    br = "media/" + tag[6:]
    subprocess.run(["git", "fetch", "-q", "--depth", "1", "origin", br], check=True, cwd=ROOT)
    subprocess.run(["git", f"--work-tree={dest}", "checkout", "FETCH_HEAD", "--", "."], check=True, cwd=ROOT)
    subprocess.run(["git", "reset", "-q"], cwd=ROOT)


def cleanup(keep_days: int = 7) -> None:
    from datetime import date, timedelta
    old = f"daily-{date.today() - timedelta(days=keep_days):%Y-%m-%d}"
    for t in releases():
        if t < old:
            subprocess.run(["git", "push", "-q", "origin", "--delete", "media/" + t[6:]], cwd=ROOT)


def tiktok_hour_reached(ttc: dict, cfg: dict) -> bool:
    """TikTok's API has no scheduling, so the hourly publisher holds each post until the channel's best hour."""
    from datetime import datetime
    from zoneinfo import ZoneInfo
    h = ttc.get("post_hour_local")
    return h is None or datetime.now(ZoneInfo(cfg.get("timezone", "America/Chicago"))).hour >= int(h)


def ledger_row(ch: str, row: list[str]) -> None:
    p = os.path.join(ROOT, "memory", "channels", ch, "LEDGER.md")
    if not os.path.exists(p):
        return
    with open(p, "a") as f:
        f.write("| " + " | ".join(row) + " |\n")


def publish_tag(tag: str, cfg: dict, done: dict) -> int:
    failures = 0
    with tempfile.TemporaryDirectory() as tmp:
        download(tag, tmp)
        for fn in sorted(os.listdir(tmp)):
            if not fn.endswith(".json"):
                continue
            ch = fn[:-5]
            chc = cfg["channels"].get(ch)
            mp4 = os.path.join(tmp, ch + ".mp4")
            if not chc or not os.path.exists(mp4):
                print(f"skip {fn}: unknown channel or missing mp4")
                continue
            meta = json.load(open(os.path.join(tmp, fn)))
            tags = [h.lstrip("#").replace(" ", "") for h in meta.get("hashtags", [])]
            rec = done.setdefault(tag, {}).setdefault(ch, {})
            yt_id = rec.get("youtube", "")
            tt_id = rec.get("tiktok", "")

            ytc = chc.get("youtube", {})
            if ytc.get("enabled") and not yt_id:
                from . import youtube
                if youtube.has_token(ch):
                    try:
                        desc = meta.get("description", "")
                        if "#shorts" not in desc.lower():
                            desc += "\n\n#shorts"
                        r = youtube.upload(ch, mp4, meta["title"], desc, tags, ytc, cfg.get("timezone", "America/Chicago"))
                        yt_id = rec["youtube"] = r["id"]
                        print(f"[{ch}] YouTube {r['id']} scheduled {r['publish_at']}")
                        if meta.get("pinned_comment"):
                            try:
                                youtube.comment(ch, yt_id, meta["pinned_comment"])
                            except Exception as e:
                                print(f"[{ch}] comment failed (non-fatal): {e}")
                    except Exception:
                        failures += 1
                        traceback.print_exc()
                else:
                    print(f"::warning::[{ch}] YouTube enabled but YT_{ch.upper()}_REFRESH_TOKEN missing")

            ttc = chc.get("tiktok", {})
            if ttc.get("enabled") and not tt_id and not tiktok_hour_reached(ttc, cfg):
                print(f"[{ch}] TikTok waits for {ttc.get('post_hour_local')}:00 local (TikTok can't schedule via API)")
            elif ttc.get("enabled") and not tt_id:
                from . import tiktok
                if os.environ.get(f"TIKTOK_{ch.upper()}_REFRESH_TOKEN") and os.environ.get("TIKTOK_CLIENT_KEY"):
                    try:
                        cap = f"{meta['title']} " + " ".join(f"#{t}" for t in tags[:6])
                        tt_id = rec["tiktok"] = tiktok.upload(ch, mp4, cap, ttc.get("mode", "draft"))
                        print(f"[{ch}] TikTok {ttc.get('mode', 'draft')} {tt_id}")
                    except Exception:
                        failures += 1
                        traceback.print_exc()
                else:
                    print(f"::notice::[{ch}] TikTok not connected yet; post {ch}.mp4 from release {tag} by hand")

            if (yt_id or tt_id) and not rec.get("ledger"):
                ledger_row(ch, [tag[6:], str(meta.get("episode", "")), meta.get("topic", meta["title"]), yt_id, tt_id,
                                meta.get("experiment_arm", ""), "", "", "", "", ""])
                rec["ledger"] = True
            state.save("published.json", done)
    return failures


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tag")
    ap.add_argument("--pending", action="store_true")
    a = ap.parse_args()
    cfg = yaml.safe_load(open(os.path.join(ROOT, "config.yaml")))
    done = state.load("published.json", {})
    from datetime import date, timedelta
    cutoff = f"daily-{date.today() - timedelta(days=3):%Y-%m-%d}"   # never post anything older than 3 days
    tags = [a.tag] if a.tag else [t for t in releases() if t >= cutoff and (t not in done or not all(
        v.get("ledger") for v in done[t].values()))]
    fails = 0
    for t in tags:
        print(f"== {t}")
        fails += publish_tag(t, cfg, done)
    cleanup()
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
