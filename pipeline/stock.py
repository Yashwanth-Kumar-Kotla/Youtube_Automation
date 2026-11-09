"""Versioned video stock with confidence scoring.

Every finished video goes into stock (not straight to posting). Each one records what it was built on
(playbook version, research file, hook pattern, format...). The weekly analyst re-scores the stock against new findings,
and the publisher always posts the highest-confidence video that's still fresh.

Source of truth: state/stock/<channel>.json  (rendered for humans to memory/channels/<channel>/STOCK.md;
every confidence change is appended to memory/channels/<channel>/STOCK_LOG.md).
Video files: one git branch per video, stock/<channel>/<id> (mp4 + json + jpg), deleted once posted or retired.

CLI (used by the daily session and the analyst):
  python -m pipeline.stock status  <ch>                 counts, room left, clusters, rework list
  python -m pipeline.stock add     <ch> <project_dir>   package + push branch + register (exit 4 if cap/cluster full)
  python -m pipeline.stock rescore <ch> <id> <0..1> "<reason>"
  python -m pipeline.stock rework  <ch> <id> "<reason>"
  python -m pipeline.stock ready   <ch> <id> <project_dir> "<what changed>"   (after a rework: replaces the files)
  python -m pipeline.stock retire  <ch> <id> "<reason>"
  python -m pipeline.stock expire                       retire everything older than max_age_days (all channels)
  python -m pipeline.stock render  <ch>
"""
from __future__ import annotations

import glob
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CFG = yaml.safe_load(open(os.path.join(ROOT, "config.yaml")))
S = {"cap": 30, "max_per_cluster": 2, "threshold": 0.4, "start_confidence": 0.7, "max_age_days": 42, **CFG.get("stock", {})}
TZ = ZoneInfo(CFG.get("timezone", "America/Chicago"))


def now() -> datetime:
    return datetime.now(TZ)


def _path(ch: str) -> str:
    return os.path.join(ROOT, "state", "stock", f"{ch}.json")


def load(ch: str) -> dict:
    p = _path(ch)
    return json.load(open(p)) if os.path.exists(p) else {"videos": {}}


def save(ch: str, data: dict) -> None:
    os.makedirs(os.path.dirname(_path(ch)), exist_ok=True)
    json.dump(data, open(_path(ch), "w"), indent=1, ensure_ascii=False)
    render(ch, data)


def log(ch: str, line: str) -> None:
    p = os.path.join(ROOT, "memory", "channels", ch, "STOCK_LOG.md")
    if not os.path.exists(p):
        open(p, "w").write(f"# STOCK_LOG: {ch} (every confidence / status change, newest last)\n\n")
    with open(p, "a") as f:
        f.write(f"- {now():%Y-%m-%d %H:%M} · {line}\n")


def live(data: dict, statuses=("ready", "rework")) -> dict:
    return {k: v for k, v in data["videos"].items() if v["status"] in statuses}


def playbook_version() -> str:
    p = os.path.join(ROOT, "memory", "PLAYBOOK.md")
    return "pb-" + hashlib.sha1(open(p, "rb").read()).hexdigest()[:8] if os.path.exists(p) else "pb-none"


def latest_research() -> str:
    files = sorted(f for f in glob.glob(os.path.join(ROOT, "memory", "research", "*.md")) if not f.endswith("README.md"))
    return os.path.relpath(files[-1], os.path.join(ROOT, "memory")) if files else "none"


def duration(mp4: str) -> float:
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4]).strip())


def push_branch(branch: str, files: list[str]) -> None:
    url = subprocess.check_output(["git", "-C", ROOT, "remote", "get-url", "origin"], text=True).strip()
    t = tempfile.mkdtemp()
    try:
        for f in files:
            shutil.copy(f, t)
        g = ["git", "-C", t]
        subprocess.run(g + ["init", "-q"], check=True)
        subprocess.run(g + ["checkout", "-q", "-b", branch], check=True)
        subprocess.run(g + ["add", "-A"], check=True)
        subprocess.run(g + ["-c", "user.name=autoshorts-bot", "-c", "user.email=autoshorts-bot@users.noreply.github.com",
                            "commit", "-qm", branch], check=True)
        for i in range(4):
            if subprocess.run(g + ["push", "-qf", url, branch]).returncode == 0:
                return
            import time
            time.sleep(2 ** (i + 1))
        raise RuntimeError(f"push of {branch} failed")
    finally:
        shutil.rmtree(t, ignore_errors=True)


def delete_branch(branch: str) -> None:
    subprocess.run(["git", "-C", ROOT, "push", "-q", "origin", "--delete", branch], capture_output=True)


def room(ch: str, cluster: str | None = None) -> tuple[int, str]:
    data = load(ch)
    ready = live(data)
    left = S["cap"] - len(ready)
    if left <= 0:
        return 0, f"stock full ({len(ready)}/{S['cap']})"
    if cluster:
        n = sum(1 for v in ready.values() if v.get("topic_cluster") == cluster)
        if n >= S["max_per_cluster"]:
            return 0, f"cluster '{cluster}' already has {n} in stock"
    return left, "ok"


def _files(d: str, ch: str, vid: str) -> list[str]:
    """Render the final video in project dir d and return [mp4, json, jpg] named <id>.*"""
    mp4 = os.path.join(d, "renders", f"{vid}.mp4")
    if not os.path.exists(mp4):
        subprocess.run(["node", "tools/capture.mjs", "video", f"renders/{vid}.mp4"], cwd=d, check=True)
    jpg = os.path.join(d, "renders", f"{vid}.jpg")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", "0.9", "-i", mp4, "-frames:v", "1", "-q:v", "2", jpg], check=True)
    return [mp4, jpg]


def add(ch: str, d: str) -> str:
    meta = json.load(open(os.path.join(d, "meta.json")))
    ok, why = room(ch, meta.get("topic_cluster"))
    if not ok:
        print(f"NOT ADDED: {why}")
        sys.exit(4)
    data = load(ch)
    day = now().strftime("%Y-%m-%d")
    n = 1 + sum(1 for k in data["videos"] if k.startswith(f"{day}-{ch}-"))
    vid = f"{day}-{ch}-{n:02d}"
    mp4, jpg = _files(d, ch, vid)
    meta.update({
        "id": vid, "channel": ch, "made_at": now().isoformat(timespec="minutes"),
        "made_week": now().strftime("%G-W%V"), "playbook_version": playbook_version(),
        "research_file": latest_research(), "length": round(duration(mp4), 1),
        "confidence": S["start_confidence"], "status": "ready", "branch": f"stock/{ch}/{vid}", "history": [],
    })
    mj = os.path.join(d, "renders", f"{vid}.json")
    json.dump(meta, open(mj, "w"), indent=1, ensure_ascii=False)
    push_branch(meta["branch"], [mp4, mj, jpg])
    data["videos"][vid] = {k: v for k, v in meta.items() if k not in ("description",)}
    data["videos"][vid]["description"] = meta.get("description", "")
    save(ch, data)
    log(ch, f"{vid} added · conf {S['start_confidence']} · {meta.get('hook_pattern', '?')} · {meta.get('topic', '')}")
    print(vid)
    return vid


def set_conf(ch: str, vid: str, new: float, reason: str) -> None:
    data = load(ch)
    v = data["videos"][vid]
    old = v["confidence"]
    v["confidence"] = round(max(0.0, min(1.0, float(new))), 2)
    v["history"].append({"at": now().isoformat(timespec="minutes"), "from": old, "to": v["confidence"], "why": reason})
    msg = f"{vid} conf {old} → {v['confidence']} · {reason}"
    if v["status"] == "ready" and v["confidence"] < S["threshold"]:
        v["status"] = "rework"
        msg += f" · below {S['threshold']}: moved to rework"
    save(ch, data)
    log(ch, msg)


def set_status(ch: str, vid: str, status: str, reason: str) -> None:
    data = load(ch)
    v = data["videos"][vid]
    old = v["status"]
    v["status"] = status
    v["history"].append({"at": now().isoformat(timespec="minutes"), "status": f"{old}->{status}", "why": reason})
    save(ch, data)
    log(ch, f"{vid} {old} → {status} · {reason}")
    if status in ("retired",):
        delete_branch(v["branch"])


def ready_again(ch: str, vid: str, d: str, what: str) -> None:
    """After a rework: re-render from project dir d, replace the branch files, refresh tags, confidence back to start."""
    if not open(os.path.join(d, "qa.md")).read().startswith("PASS"):
        print("NOT READY: qa.md is not PASS")
        sys.exit(3)
    data = load(ch)
    v = data["videos"][vid]
    meta = json.load(open(os.path.join(d, "meta.json")))
    for p in glob.glob(os.path.join(d, "renders", f"{vid}.*")):
        os.remove(p)
    mp4, jpg = _files(d, ch, vid)
    keep = {k: v[k] for k in ("id", "channel", "made_at", "branch", "history")}
    meta.update(keep)
    meta.update({"made_week": now().strftime("%G-W%V"), "playbook_version": playbook_version(),
                 "research_file": latest_research(), "length": round(duration(mp4), 1),
                 "confidence": S["start_confidence"], "status": "ready", "reworked": what})
    mj = os.path.join(d, "renders", f"{vid}.json")
    json.dump(meta, open(mj, "w"), indent=1, ensure_ascii=False)
    push_branch(v["branch"], [mp4, mj, jpg])
    meta["history"].append({"at": now().isoformat(timespec="minutes"), "status": "rework->ready", "why": what})
    data["videos"][vid] = meta
    save(ch, data)
    log(ch, f"{vid} reworked → ready · conf {S['start_confidence']} · {what}")


def pick(ch: str) -> dict | None:
    """Highest-confidence fresh 'ready' video (ties: older first, so stock doesn't go stale)."""
    data = load(ch)
    cutoff = now() - timedelta(days=S["max_age_days"])
    c = [v for v in live(data, ("ready",)).values()
         if v["confidence"] >= S["threshold"] and datetime.fromisoformat(v["made_at"]) > cutoff]
    return sorted(c, key=lambda v: (-v["confidence"], v["made_at"]))[0] if c else None


def mark_posted(ch: str, vid: str, info: dict) -> None:
    data = load(ch)
    v = data["videos"][vid]
    v.update(info)
    if v["status"] != "posted":
        v["status"] = "posted"
        v["history"].append({"at": now().isoformat(timespec="minutes"), "status": "ready->posted", "why": "publisher"})
        log(ch, f"{vid} posted · conf {v['confidence']} · {info}")
    save(ch, data)


def expire() -> None:
    cutoff = now() - timedelta(days=S["max_age_days"])
    for ch in CFG["channels"]:
        for vid, v in live(load(ch)).items():
            if datetime.fromisoformat(v["made_at"]) < cutoff:
                set_status(ch, vid, "retired", f"older than {S['max_age_days']} days")


def render(ch: str, data: dict | None = None) -> None:
    data = data or load(ch)
    rows = sorted(live(data).values(), key=lambda v: (v["status"] != "ready", -v["confidence"]))
    clusters: dict[str, int] = {}
    for v in live(data, ("ready",)).values():
        clusters[v.get("topic_cluster", "?")] = clusters.get(v.get("topic_cluster", "?"), 0) + 1
    out = [f"# STOCK: {ch} (generated from state/stock/{ch}.json; change it with `python -m pipeline.stock`)",
           f"_Updated {now():%Y-%m-%d %H:%M} · ready {sum(1 for v in rows if v['status']=='ready')}/{S['cap']} · "
           f"threshold {S['threshold']} · max age {S['max_age_days']} d_", "",
           "| id | status | conf | topic | cluster | hook pattern | format | length | made | playbook | research |",
           "|---|---|---|---|---|---|---|---|---|---|---|"]
    for v in rows:
        out.append(f"| {v['id']} | {v['status']} | {v['confidence']} | {v.get('topic','')} | {v.get('topic_cluster','')} | "
                   f"{v.get('hook_pattern','')} | {v.get('format','')} | {v.get('length','')}s | {v.get('made_week','')} | "
                   f"{v.get('playbook_version','')} | {v.get('research_file','')} |")
    out += ["", "Clusters in stock: " + (", ".join(f"{k} ×{n}" for k, n in sorted(clusters.items())) or "none")]
    p = os.path.join(ROOT, "memory", "channels", ch, "STOCK.md")
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, "w").write("\n".join(out) + "\n")


def status(ch: str) -> None:
    data = load(ch)
    ready = live(data, ("ready",))
    rework = live(data, ("rework",))
    left, why = room(ch)
    clusters: dict[str, int] = {}
    for v in ready.values():
        clusters[v.get("topic_cluster", "?")] = clusters.get(v.get("topic_cluster", "?"), 0) + 1
    full = [k for k, n in clusters.items() if n >= S["max_per_cluster"]]
    print(json.dumps({"channel": ch, "ready": len(ready), "cap": S["cap"], "room_left": left, "room_reason": why,
                      "rework": sorted(rework), "full_clusters": full,
                      "next_to_post": (pick(ch) or {}).get("id")}, indent=1))


if __name__ == "__main__":
    a = sys.argv[1:]
    cmd = a[0] if a else ""
    if cmd == "status":
        status(a[1])
    elif cmd == "add":
        add(a[1], a[2])
    elif cmd == "rescore":
        set_conf(a[1], a[2], float(a[3]), a[4])
    elif cmd == "rework":
        set_status(a[1], a[2], "rework", a[3])
    elif cmd == "ready":
        ready_again(a[1], a[2], a[3], a[4])
    elif cmd == "retire":
        set_status(a[1], a[2], "retired", a[3])
    elif cmd == "expire":
        expire()
    elif cmd == "render":
        render(a[1])
    else:
        print(__doc__)
        sys.exit(2)
