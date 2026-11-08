#!/usr/bin/env python3
"""AutoShorts daily runner.

  python run.py --channel all                      # full daily run (script -> voice -> render -> upload)
  python run.py --channel kids --no-upload         # make the video, don't post
  python run.py --channel kids --script samples/kids.json --no-upload   # no API key needed
  python run.py --channel mature --topic "What happens if you walk 10,000 steps a day?"
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import traceback
from datetime import datetime

import yaml

from pipeline import audio, state
from pipeline.models import VideoScript
from pipeline.render import SceneTiming, render_video
from pipeline.tts import synth

ROOT = os.path.dirname(os.path.abspath(__file__))
GAP = 0.28        # silence between scenes (s)
LEAD_IN = 0.15


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:50]


def make_script(name: str, ch: dict, cfg: dict, topic: str) -> VideoScript:
    from pipeline import llm
    model, effort = cfg["llm"]["model"], cfg["llm"].get("effort", "medium")
    feedback = ""
    for attempt in range(3):
        sc = llm.write_script(ch, topic, model, effort, feedback)
        if not ch.get("fact_check", True):
            return sc
        rv = llm.review_script(ch, sc, model)
        print(f"  review attempt {attempt + 1}: approved={rv.approved} issues={rv.accuracy_issues + rv.safety_issues}")
        if rv.approved:
            return sc
        feedback = "\n".join(f"- {x}" for x in rv.accuracy_issues + rv.safety_issues + rv.retention_notes)
    raise RuntimeError("Script failed fact-check 3 times; skipping this topic")


def produce(name: str, ch: dict, cfg: dict, args) -> dict:
    out_dir = os.path.join(ROOT, "out", f"{datetime.now():%Y-%m-%d}_{name}")
    os.makedirs(out_dir, exist_ok=True)

    # 1. topic + script
    if args.script:
        script = VideoScript.model_validate(json.load(open(args.script)))
        topic = script.topic
    else:
        if not args.topic and state.queue_size(name, ch.get("seed_topics", [])) < 5:
            from pipeline import llm
            new = llm.brainstorm_topics(ch, state.used_topics(name), cfg["llm"]["model"])
            state.add_to_queue(name, new)
            print(f"  topic queue refilled with {len(new)} ideas")
        topic = args.topic or state.next_topic(name, ch.get("seed_topics", []))
        if not topic:
            raise RuntimeError("No topics left")
        print(f"  topic: {topic}")
        script = make_script(name, ch, cfg, topic)
    with open(os.path.join(out_dir, "script.json"), "w") as f:
        f.write(script.model_dump_json(indent=1))

    # 2. voice
    timings, voice_files, t = [], [], LEAD_IN
    for i, sc in enumerate(script.scenes):
        mp3 = os.path.join(out_dir, f"vo_{i:02d}.mp3")
        words, dur = synth(sc.narration, ch["voice"], ch.get("rate", "+0%"), ch.get("pitch", "+0Hz"), mp3)
        scene_dur = dur + GAP + (0.6 if i == len(script.scenes) - 1 else 0)
        timings.append(SceneTiming(t, scene_dur if i else scene_dur + LEAD_IN, dur, words))
        voice_files.append(mp3)
        t += scene_dur if i else scene_dur + LEAD_IN
        if i == 0:
            timings[0].start = 0.0
    # voice for scene 0 starts at LEAD_IN, others at their scene start
    starts = [LEAD_IN] + [tm.start for tm in timings[1:]]
    for w in timings[0].words:
        w.start += LEAD_IN
        w.end += LEAD_IN
    total = timings[-1].start + timings[-1].dur
    print(f"  narration: {total:.1f}s across {len(script.scenes)} scenes")

    # 3. render
    fmt = args.format or cfg["render"].get("format", "shorts")
    mp4 = os.path.join(out_dir, f"{slug(script.topic)}.mp4")
    wav = os.path.join(out_dir, "mix.wav")
    from pipeline.render import build_prims
    # draw intervals are needed for SFX before rendering: compute same as renderer
    intervals = [(tm.start + 0.05, tm.start + min(max(0.62 * tm.dur, 1.4), tm.dur - 0.5)) for tm in timings]
    audio.mix(voice_files, starts, total, intervals, wav, music_dir=os.path.join(ROOT, "assets", "music"))
    render_video(script, timings, wav, mp4, fmt=fmt, fps=cfg["render"].get("fps", 30), accent=ch.get("accent", "#FF6B35"),
                 caption_scale=ch.get("caption_scale", 1.0), seed=abs(hash(script.topic)) % 10000)
    thumb = os.path.join(out_dir, "cover.jpg")
    cover_t = timings[0].start + min(max(0.62 * timings[0].dur, 1.4), timings[0].dur - 0.5) + 0.3
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{cover_t:.2f}", "-i", mp4, "-frames:v", "1",
                    "-q:v", "2", thumb], check=True)

    # 4. QA gates
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                         "-of", "csv=p=0", mp4]).strip())
    if fmt == "shorts" and dur > 179:
        raise RuntimeError(f"Video is {dur:.0f}s, over the 3-min Shorts limit")
    print(f"  rendered {mp4} ({dur:.1f}s, {os.path.getsize(mp4) / 1e6:.1f} MB)")

    tags = [h.lstrip("#").replace(" ", "") for h in script.hashtags]
    meta = {"topic": script.topic, "title": script.youtube_title, "file": os.path.relpath(mp4, ROOT),
            "seconds": round(dur, 1)}

    # 5. publish
    if not args.no_upload:
        tz = cfg.get("timezone", "America/Chicago")
        if ch.get("youtube", {}).get("enabled"):
            from pipeline import youtube
            desc = f"{script.description}\n\n" + " ".join(f"#{x}" for x in tags[:5]) + " #shorts"
            meta["youtube_id"] = youtube.upload(name, mp4, script.youtube_title, desc, tags, ch["youtube"], tz, thumb)
            print(f"  YouTube scheduled: https://youtu.be/{meta['youtube_id']}")
        if ch.get("tiktok", {}).get("enabled"):
            from pipeline import tiktok
            cap = f"{script.hook_title} " + " ".join(f"#{x}" for x in tags[:6]) + " #fyp #learnontiktok"
            meta["tiktok_publish_id"] = tiktok.upload(name, mp4, cap, ch["tiktok"].get("mode", "draft"))
            print(f"  TikTok {ch['tiktok'].get('mode', 'draft')} upload id: {meta['tiktok_publish_id']}")
    if not args.script:
        state.record(name, meta)
    with open(os.path.join(out_dir, "meta.json"), "w") as f:
        json.dump(meta, f, indent=2)
    return meta


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--channel", default="all")
    ap.add_argument("--topic")
    ap.add_argument("--script", help="use a ready script JSON instead of the LLM")
    ap.add_argument("--format", choices=["shorts", "long"])
    ap.add_argument("--no-upload", action="store_true")
    ap.add_argument("--config", default=os.path.join(ROOT, "config.yaml"))
    args = ap.parse_args()
    cfg = yaml.safe_load(open(args.config))
    names = [n for n, c in cfg["channels"].items() if c.get("enabled")] if args.channel == "all" else args.channel.split(",")
    failures = 0
    for n in names:
        print(f"== {n}")
        try:
            produce(n, cfg["channels"][n], cfg, args)
        except Exception:
            failures += 1
            traceback.print_exc()
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
