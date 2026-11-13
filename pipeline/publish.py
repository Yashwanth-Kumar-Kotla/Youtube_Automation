"""Publisher: fills each channel's daily posting slots from its stock, highest confidence first. Runs hourly in GitHub Actions.

For every enabled channel and every slot in config `slots` (max 3 per day):
  * YouTube: uploaded ahead of time with publishAt = the slot's YouTube hour (YouTube flips it public on time).
  * TikTok: TikTok's API can't schedule, so it's sent during the hour window after the slot's TikTok hour.
The video for a slot is chosen once (the best 'ready' one, confidence >= threshold, not older than max_age_days) and
then used on both platforms. The episode number is assigned at posting time and appended to the title.

  python -m pipeline.publish            # normal hourly run
  python -m pipeline.publish --dry-run  # show what would be posted now, change nothing
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
import traceback
from datetime import datetime, timedelta

from . import state, stock

ROOT = stock.ROOT
CFG = stock.CFG
MAX_SLOTS = 3


def download(branch: str, dest: str) -> None:
    subprocess.run(["git", "fetch", "-q", "--depth", "1", "origin", branch], check=True, cwd=ROOT)
    subprocess.run(["git", f"--work-tree={dest}", "checkout", "FETCH_HEAD", "--", "."], check=True, cwd=ROOT)
    subprocess.run(["git", "reset", "-q"], cwd=ROOT)


def ledger_path(ch: str) -> str:
    return os.path.join(ROOT, "memory", "channels", ch, "LEDGER.md")


def ledger_rows(ch: str) -> list[list[str]]:
    rows = []
    if os.path.exists(ledger_path(ch)):
        for line in open(ledger_path(ch)):
            c = [x.strip() for x in line.strip().strip("|").split("|")]
            if len(c) >= 5 and re.match(r"\d{4}-\d{2}-\d{2}", c[0]):
                rows.append(c)
    return rows


def next_episode(ch: str) -> int:
    eps = [int(r[1]) for r in ledger_rows(ch) if r[1].isdigit()]
    return (max(eps) if eps else 0) + 1


def ledger_upsert(ch: str, v: dict, rec: dict) -> None:
    """One row per posted video; the TikTok id is filled into the same row later."""
    p = ledger_path(ch)
    if not os.path.exists(p):
        return
    lines = open(p).read().split("\n")
    row = [rec["date"], str(rec["episode"]), v.get("topic", v.get("title", "")), rec.get("youtube", ""), rec.get("tiktok", ""),
           v.get("experiment_arm", ""), "", "", "", "", "", v["id"], v.get("playbook_version", ""), v.get("hook_pattern", "")]
    new = "| " + " | ".join(row) + " |"
    for i, l in enumerate(lines):
        if f"| {v['id']} |" in l:
            cells = [x.strip() for x in l.strip().strip("|").split("|")]
            cells[3] = cells[3] or rec.get("youtube", "")
            cells[4] = cells[4] or rec.get("tiktok", "")
            lines[i] = "| " + " | ".join(cells) + " |"
            break
    else:  # insert after the last table row
        last = max((i for i, l in enumerate(lines) if l.startswith("|")), default=len(lines) - 1)
        lines.insert(last + 1, new)
    open(p, "w").write("\n".join(lines))


def tt_connected(ch: str) -> bool:
    return bool(os.environ.get(f"TIKTOK_{ch.upper()}_REFRESH_TOKEN") and os.environ.get("TIKTOK_CLIENT_KEY"))


def run(dry: bool = False) -> int:
    from . import youtube
    fails = 0
    if not dry:
        stock.expire()
    posts = state.load("posts.json", {})
    n = stock.now()
    today = n.strftime("%Y-%m-%d")
    if not dry:  # a slot from an earlier day that never got posted anywhere: its video goes back to stock
        for d, chans in posts.items():
            if d >= today:
                continue
            for ch, recs in chans.items():
                for r in recs:
                    if not r.get("youtube") and not r.get("tiktok") and not r.get("released"):
                        v = stock.load(ch)["videos"].get(r["id"])
                        if v and v["status"] == "scheduled":
                            stock.set_status(ch, r["id"], "ready", f"slot on {d} missed its window")
                        r["released"] = True
    tz = CFG.get("timezone", "America/Chicago")
    if not dry:  # manual mode: keep looking for the owner's upload of the last 3 days' videos
        for d in sorted(posts)[-4:]:
            if d >= today:
                continue
            for ch, recs in posts[d].items():
                c = CFG["channels"].get(ch, {})
                if not (c.get("youtube", {}).get("mode") == "manual" and youtube.has_token(ch)):
                    continue
                for r in recs:
                    if r.get("manual") and not r.get("youtube"):
                        v = stock.load(ch)["videos"].get(r["id"])
                        if not v:
                            continue
                        hit = next((u for u in youtube.recent_uploads(ch) if u["title"].lower().startswith(v["title"].lower()[:40])), None)
                        if hit:
                            r["youtube"] = hit["id"]
                            ledger_upsert(ch, v, r)
                            print(f"[{ch}] found the owner's upload {hit['id']} for {v['id']} (from {d})")
                            if v.get("pinned_comment") and hit["privacy"] == "public":
                                try:
                                    youtube.comment(ch, hit["id"], v["pinned_comment"]); r["commented"] = True
                                except Exception as e:
                                    print(f"[{ch}] comment later: {str(e)[:100]}")
        state.save("posts.json", posts)
    for ch, c in CFG["channels"].items():
        if not c.get("enabled"):
            continue
        yt_ok = c.get("youtube", {}).get("enabled") and youtube.has_token(ch)
        manual = yt_ok and c["youtube"].get("mode", "api") == "manual"   # audit period: owner uploads, we detect it
        yt_on = yt_ok and not manual
        tt_on = c.get("tiktok", {}).get("enabled") and tt_connected(ch)
        if not (yt_on or tt_on or manual):
            continue
        uploads = None
        slots = (c.get("slots") or [])[:MAX_SLOTS]
        day = posts.setdefault(today, {}).setdefault(ch, [])
        for i, sl in enumerate(slots):
            rec = next((r for r in day if r["slot"] == i), None)
            yt_t = n.replace(hour=int(sl["youtube"]), minute=0, second=0, microsecond=0)
            tt_t = n.replace(hour=int(sl["tiktok"]), minute=0, second=0, microsecond=0)
            need_yt = yt_on and not (rec or {}).get("youtube") and n < yt_t - timedelta(minutes=20)
            if manual:
                if rec is None and n < yt_t + timedelta(hours=3):  # hand today's video to the owner (POST_TODAY.md)
                    v = stock.pick(ch)
                    if not v:
                        print(f"::warning::[{ch}] slot {i}: stock is empty. Nothing to post today.")
                        continue
                    if dry:
                        print(f"[{ch}] slot {i} would hand {v['id']} to the owner for manual upload")
                        continue
                    rec = {"slot": i, "id": v["id"], "date": today, "episode": next_episode(ch), "manual": True}
                    day.append(rec)
                    stock.set_status(ch, v["id"], "scheduled", f"slot {i} on {today}, episode {rec['episode']}, manual upload")
                    state.save("posts.json", posts)
                if rec and rec.get("manual") and not dry:
                    v = stock.load(ch)["videos"][rec["id"]]
                    if not rec.get("youtube"):
                        uploads = uploads if uploads is not None else youtube.recent_uploads(ch)
                        want = v["title"].lower()[:40]
                        hit = next((u for u in uploads if u["title"].lower().startswith(want)), None)
                        if hit:
                            rec["youtube"] = hit["id"]
                            print(f"[{ch}] found the owner's upload {hit['id']} ({hit['privacy']}) for {v['id']}")
                            ledger_upsert(ch, v, rec)
                    if rec.get("youtube") and not rec.get("commented") and v.get("pinned_comment"):
                        try:
                            youtube.comment(ch, rec["youtube"], v["pinned_comment"])
                            rec["commented"] = True
                            print(f"[{ch}] creator comment posted on {rec['youtube']} (pin it in the app)")
                        except Exception as e:
                            print(f"[{ch}] comment not possible yet (video not public?): {str(e)[:120]}")
                    state.save("posts.json", posts)
                    if not (tt_on and not rec.get("tiktok")):
                        if rec.get("youtube") and v["status"] != "posted":
                            stock.mark_posted(ch, v["id"], {"posted": today, "episode": rec["episode"], "youtube": rec["youtube"], "manual": True})
                            stock.delete_branch(v["branch"])
                        continue
            need_tt = tt_on and not (rec or {}).get("tiktok") and tt_t <= n < tt_t + timedelta(hours=4)
            if not (need_yt or need_tt):
                continue
            if rec is None:
                v = stock.pick(ch)
                if not v:
                    print(f"::warning::[{ch}] slot {i}: stock has nothing above the threshold. Nothing posted.")
                    continue
                if dry:
                    print(f"[{ch}] slot {i} would post {v['id']} (conf {v['confidence']}): {v.get('title')}")
                    continue
                rec = {"slot": i, "id": v["id"], "date": today, "episode": next_episode(ch)}
                day.append(rec)
                stock.set_status(ch, v["id"], "scheduled", f"slot {i} on {today}, episode {rec['episode']}")
                state.save("posts.json", posts)
            if dry:
                continue
            v = stock.load(ch)["videos"][rec["id"]]
            with tempfile.TemporaryDirectory() as tmp:
                try:
                    download(v["branch"], tmp)
                except Exception:
                    traceback.print_exc()
                    fails += 1
                    continue
                mp4 = os.path.join(tmp, f"{v['id']}.mp4")
                series = c.get("series", "")
                title = f"{v['title']} | {series} #{rec['episode']}" if series else v["title"]
                if len(title) > 100:
                    title = v["title"][:100]
                tags = [h.lstrip("#").replace(" ", "") for h in v.get("hashtags", [])]
                if need_yt:
                    try:
                        desc = v.get("description", "")
                        if "#shorts" not in desc.lower():
                            desc += "\n\n#shorts"
                        r = youtube.upload(ch, mp4, title, desc, tags, {**c["youtube"], "publish_hour_local": sl["youtube"]}, tz)
                        rec["youtube"] = r["id"]
                        print(f"[{ch}] YouTube {r['id']} ← {v['id']} (conf {v['confidence']}) public at {r['publish_at']}")
                        if v.get("pinned_comment"):
                            try:
                                youtube.comment(ch, r["id"], v["pinned_comment"])
                            except Exception as e:
                                print(f"[{ch}] comment failed (non-fatal; private videos can't take comments): {str(e)[:160]}")
                    except Exception:
                        fails += 1
                        traceback.print_exc()
                if need_tt:
                    try:
                        from . import tiktok
                        cap = f"{v['title']} " + " ".join(f"#{t}" for t in tags[:6])
                        pre = state.load("tiktok_drafts.json", {}).get(v["id"])  # already sent by tiktok_bulk
                        rec["tiktok"] = pre or tiktok.upload(ch, mp4, cap, c["tiktok"].get("mode", "draft"))
                        print(f"[{ch}] TikTok {c['tiktok'].get('mode', 'draft')} {rec['tiktok']} ← {v['id']}")
                    except Exception:
                        fails += 1
                        traceback.print_exc()
            if rec.get("youtube") or rec.get("tiktok"):
                ledger_upsert(ch, v, rec)
            # manual YouTube counts too: never mark posted (or delete the file) before the owner's upload is found
            done = (not (yt_on or manual) or rec.get("youtube")) and (not tt_on or rec.get("tiktok"))
            if done:
                stock.mark_posted(ch, v["id"], {"posted": today, "episode": rec["episode"],
                                                "youtube": rec.get("youtube", ""), "tiktok": rec.get("tiktok", "")})
                stock.delete_branch(v["branch"])
            state.save("posts.json", posts)
    if not dry:
        write_post_today(posts)
    return fails


def write_post_today(posts: dict) -> None:
    """Manual-mode handoff: what the owner should upload, ready to copy-paste. Lives at the repo root."""
    repo = "Yashwanth-Kumar-Kotla/Youtube_Automation"
    out = ["# POST TODAY", "_Updated hourly by the publisher. Upload each video below in YouTube Studio (now, or scheduled for the time shown)._",
           "_The publisher finds your upload by its title within the hour, records it, and posts the pinned comment once it's public._", ""]
    pending = 0
    for d in sorted(posts)[-3:]:
        for ch, recs in posts[d].items():
            c = CFG["channels"].get(ch, {})
            for r in recs:
                if not r.get("manual") or r.get("youtube") or r.get("released"):
                    continue
                v = stock.load(ch)["videos"].get(r["id"])
                if not v:
                    continue
                pending += 1
                sl = (c.get("slots") or [{}])[r["slot"]]
                title = f"{v['title']} | {c.get('series', '')} #{r['episode']}".strip(" |#")
                tags = ", ".join(h.lstrip("#") for h in v.get("hashtags", []))
                out += [f"## {ch}: {title}", "",
                        f"- **Download:** https://github.com/{repo}/raw/{v['branch']}/{v['id']}.mp4 (cover frame: `{v['id']}.jpg` on the same branch)",
                        f"- **Best time:** {sl.get('youtube', 17)}:00 Central (schedule it in Studio, or post now). TikTok: {sl.get('tiktok', 19)}:00.",
                        "- **Settings:** Not made for kids · Altered content: No · Category: Education · Comments on", "",
                        "**Title** (paste exactly; the publisher matches on it)", "```", title, "```",
                        "**Description**", "```", v.get("description", "") + ("\n\n#shorts" if "#shorts" not in v.get("description", "").lower() else ""), "```",
                        "**Tags**", "```", tags, "```",
                        "**TikTok caption**", "```", f"{v['title']} " + " ".join("#" + h.lstrip("#") for h in v.get("hashtags", [])[:5]) + " #fyp", "```",
                        "**Pinned comment** (the publisher posts it for you on YouTube; on TikTok paste it yourself)", "```", v.get("pinned_comment", ""), "```", ""]
    if not pending:
        out.append("Nothing to upload right now.")
    open(os.path.join(ROOT, "POST_TODAY.md"), "w").write("\n".join(out) + "\n")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    fails = run(a.dry_run)
    if not a.dry_run:
        stock.sweep()
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
