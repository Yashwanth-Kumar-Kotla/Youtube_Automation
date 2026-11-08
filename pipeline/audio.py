"""Voice track assembly, synthesized pencil-scratch SFX and optional background music."""
from __future__ import annotations

import glob
import os
import random
import subprocess
import wave

import numpy as np

SR = 44100


def decode(path: str) -> np.ndarray:
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", path, "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"])
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768


def pencil_sfx(n: int, intervals: list[tuple[float, float]], seed: int = 3) -> np.ndarray:
    rng = np.random.default_rng(seed)
    out = np.zeros(n, dtype=np.float32)
    for a, b in intervals:
        i0, i1 = int(a * SR), min(n, int(b * SR))
        if i1 <= i0:
            continue
        m = i1 - i0
        noise = rng.normal(0, 1, m).astype(np.float32)
        # crude band-pass: high-pass (diff) then smooth
        noise = np.diff(noise, prepend=0)
        noise = np.convolve(noise, np.ones(6) / 6, mode="same")
        t = np.arange(m) / SR
        strokes = 0.55 + 0.45 * np.abs(np.sin(2 * np.pi * 2.3 * t + rng.uniform(0, 6)))  # back-and-forth scribble
        env = np.minimum(1, np.minimum(t / 0.05, (m / SR - t) / 0.08))
        out[i0:i1] += noise * strokes * env * 0.05
    return out


def mix(voice_paths: list[str], starts: list[float], total: float, draw_intervals, out_wav: str,
        music_dir: str | None = None, music_db: float = -24.0, sfx: bool = True) -> None:
    n = int(total * SR) + SR // 2
    track = np.zeros(n, dtype=np.float32)
    for p, s in zip(voice_paths, starts):
        v = decode(p)
        i = int(s * SR)
        track[i:i + len(v)] += v[: n - i]
    voice_env = np.convolve(np.abs(track), np.ones(SR // 10) / (SR // 10), mode="same")
    if sfx:
        track += pencil_sfx(n, draw_intervals)
    tracks = sorted(glob.glob(os.path.join(music_dir, "*.mp3"))) if music_dir and os.path.isdir(music_dir) else []
    if tracks:
        m = decode(random.choice(tracks))
        if len(m):
            m = np.tile(m, int(np.ceil(n / len(m))))[:n]
            duck = 1 - 0.5 * np.clip(voice_env / (voice_env.max() + 1e-6) * 3, 0, 1)  # sidechain-ish ducking
            fade = np.minimum(1, np.minimum(np.arange(n) / SR / 0.5, (n - np.arange(n)) / SR / 1.0))
            track += m * (10 ** (music_db / 20)) * duck * fade
    peak = np.abs(track).max()
    if peak > 0.98:
        track *= 0.98 / peak
    with wave.open(out_wav, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((track * 32767).astype(np.int16).tobytes())
