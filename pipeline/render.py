"""Whiteboard-sketch animator.

Each scene's strokes are drawn progressively by an on-screen pencil while the narrator speaks,
closed shapes get colored in like a marker, word-by-word karaoke captions run underneath,
and a pencil-scratch sound plays while drawing. Output: H.264 MP4 with AAC audio.
"""
from __future__ import annotations

import math
import os
import random
import subprocess
from dataclasses import dataclass, field

import numpy as np
from PIL import Image, ImageDraw, ImageFont

from .models import Stroke, VideoScript
from .tts import Word

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT_DIR = os.path.join(ROOT, "assets", "fonts")
FONT_BOLD = os.path.join(FONT_DIR, "InterDisplay-Black.otf")
FONT_HAND = os.path.join(FONT_DIR, "ComicNeue-Bold.otf")

INK = {"ink": (34, 34, 40), "red": (230, 57, 70), "blue": (36, 113, 163), "green": (42, 157, 143),
       "orange": (231, 111, 81), "purple": (123, 44, 191), "gray": (120, 130, 145)}
FILL = {"skin": (246, 201, 168), "red": (242, 132, 130), "blue": (142, 202, 230), "green": (149, 213, 178),
        "yellow": (255, 224, 102), "orange": (255, 184, 112), "purple": (205, 180, 219), "gray": (217, 217, 217),
        "pink": (255, 200, 221), "white": (255, 255, 255)}
WIDTH = {"thin": 5, "normal": 8, "bold": 12}  # at 1000px logical canvas
SS = 2  # supersampling factor for anti-aliased ink


def hex_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


# ----------------------------------------------------------------------------- geometry
def _catmull(pts: list[tuple[float, float]], per_seg: int = 14) -> list[tuple[float, float]]:
    if len(pts) < 3:
        return pts
    closed = pts[0] == pts[-1]
    p = [pts[-2]] + pts + [pts[1]] if closed else [pts[0]] + pts + [pts[-1]]
    out = []
    for i in range(1, len(p) - 2):
        p0, p1, p2, p3 = p[i - 1], p[i], p[i + 1], p[i + 2]
        for t in np.linspace(0, 1, per_seg, endpoint=False):
            t2, t3 = t * t, t * t * t
            out.append(tuple(0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2
                                    + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3) for k in (0, 1)))
    out.append(pts[-1])
    return out


def _resample(pts: list[tuple[float, float]], step: float = 4.0) -> np.ndarray:
    a = np.asarray(pts, dtype=float)
    if len(a) < 2:
        return a
    seg = np.hypot(*np.diff(a, axis=0).T)
    cum = np.concatenate([[0], np.cumsum(seg)])
    if cum[-1] == 0:
        return a[:1]
    s = np.linspace(0, cum[-1], max(2, int(cum[-1] / step)))
    return np.stack([np.interp(s, cum, a[:, 0]), np.interp(s, cum, a[:, 1])], axis=1)


def _wobble(a: np.ndarray, rng: random.Random, amp: float = 2.2) -> np.ndarray:
    if len(a) < 3:
        return a
    t = np.linspace(0, 1, len(a))
    d = np.gradient(a, axis=0)
    n = np.stack([-d[:, 1], d[:, 0]], axis=1)
    n /= np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-6)
    off = sum(amp / (k + 1) * np.sin(2 * math.pi * (k + 1) * (1.5 * t) + rng.uniform(0, 6.28)) for k in range(3))
    return a + n * off[:, None]


def _ellipse(x0, y0, x1, y1, n=90, start=None):
    cx, cy, rx, ry = (x0 + x1) / 2, (y0 + y1) / 2, abs(x1 - x0) / 2, abs(y1 - y0) / 2
    st = start if start is not None else -math.pi * 0.6
    ang = np.linspace(st, st + 2 * math.pi * 1.04, n)  # slight overlap like a real hand-drawn circle
    return list(zip(cx + rx * np.cos(ang), cy + ry * np.sin(ang)))


@dataclass
class Prim:
    path: np.ndarray            # drawable points (logical 0-1000 coords), with wobble
    width: float
    color: tuple
    fill: tuple | None = None
    fill_poly: list | None = None
    text: str = ""
    anchor: tuple = (0, 0)
    length: float = 0.0
    is_text: bool = False


def build_prims(strokes: list[Stroke], seed: int) -> list[Prim]:
    rng = random.Random(seed)
    prims: list[Prim] = []
    for s in strokes:
        pts = [(min(max(p.x, 0), 1000), min(max(p.y, 0), 1000)) for p in s.points]
        if not pts:
            continue
        color, width = INK.get(s.color, INK["ink"]), WIDTH.get(s.width, 8)
        fill = FILL.get(s.fill) if s.fill != "none" else None
        if s.kind == "text":
            prims.append(Prim(np.array([pts[0]]), width, color, text=s.text[:28], anchor=pts[0],
                              length=max(60, 26 * len(s.text)), is_text=True))
            continue
        fill_poly = None
        if s.kind in ("circle", "ellipse", "rect") and len(pts) >= 2:
            (x0, y0), (x1, y1) = pts[0], pts[1]
            if s.kind == "circle":
                r = max(abs(x1 - x0), abs(y1 - y0)) / 2
                cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
                x0, y0, x1, y1 = cx - r, cy - r, cx + r, cy + r
            if s.kind == "rect":
                raw = [(x0, y0), (x1, y0), (x1, y1), (x0, y1), (x0, y0)]
                fill_poly = raw[:-1]
            else:
                raw = _ellipse(x0, y0, x1, y1, start=rng.uniform(-2.5, -1.2))
                fill_poly = _ellipse(x0, y0, x1, y1, n=60, start=0)[:60]
        elif s.kind == "curve":
            raw = _catmull(pts)
            if len(pts) >= 3 and pts[0] == pts[-1]:
                fill_poly = raw
        else:  # line / arrow
            raw = pts if len(pts) > 1 else pts * 2
            if s.kind == "line" and len(pts) >= 3 and pts[0] == pts[-1]:
                fill_poly = raw
        path = _wobble(_resample(raw), rng, amp=1.6 if s.kind == "text" else 2.2)
        segs = [path]
        if s.kind == "arrow" and len(path) >= 2:
            tip = path[-1]
            back = path[max(0, len(path) - 6)]
            ang = math.atan2(tip[1] - back[1], tip[0] - back[0])
            hl = 34
            h1 = (tip[0] - hl * math.cos(ang - 0.5), tip[1] - hl * math.sin(ang - 0.5))
            h2 = (tip[0] - hl * math.cos(ang + 0.5), tip[1] - hl * math.sin(ang + 0.5))
            segs.append(_resample([h1, tuple(tip), h2]))
        for i, sg in enumerate(segs):
            ln = float(np.hypot(*np.diff(sg, axis=0).T).sum()) if len(sg) > 1 else 1.0
            prims.append(Prim(sg, width, color, fill if i == 0 else None, fill_poly if i == 0 else None, length=ln))
    return prims


# ----------------------------------------------------------------------------- layout
@dataclass
class Layout:
    W: int
    H: int
    draw_box: tuple          # x, y, size of the square drawing area
    title_box: tuple         # x, y, w, h
    caption_y: int
    caption_size: int
    title_size: int


def make_layout(fmt: str, caption_scale: float = 1.0) -> Layout:
    if fmt == "long":
        return Layout(1920, 1080, (480, 130, 800), (60, 20, 1800, 100), 960, int(64 * caption_scale), 58)
    return Layout(1080, 1920, (40, 470, 1000), (60, 150, 960, 290), 1560, int(84 * caption_scale), 84)


def _paper(W: int, H: int) -> Image.Image:
    rng = np.random.default_rng(7)
    base = np.full((H, W, 3), (251, 248, 241), dtype=np.float32)
    base += rng.normal(0, 3.0, (H, W, 1))
    yy, xx = np.mgrid[0:H, 0:W]
    v = ((xx - W / 2) / W) ** 2 + ((yy - H / 2) / H) ** 2
    base *= (1 - 0.18 * v)[..., None]
    return Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))


def _wrap(text: str, font: ImageFont.FreeTypeFont, max_w: int) -> list[str]:
    lines, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if font.getlength(t) <= max_w or not cur:
            cur = t
        else:
            lines.append(cur)
            cur = w
    return lines + ([cur] if cur else [])


def _fit_title(text: str, lay: Layout) -> tuple[ImageFont.FreeTypeFont, list[str]]:
    x, y, w, h = lay.title_box
    size = lay.title_size
    while size > 30:
        f = ImageFont.truetype(FONT_BOLD, size)
        lines = _wrap(text, f, w)
        if len(lines) * size * 1.12 <= h:
            return f, lines
        size -= 4
    f = ImageFont.truetype(FONT_BOLD, size)
    return f, _wrap(text, f, w)


def _pencil(draw: ImageDraw.ImageDraw, tip: tuple[float, float], s: float = 1.0):
    a = math.radians(32)
    u = (math.sin(a), -math.cos(a))          # along the pencil, away from the tip
    v = (math.cos(a), math.sin(a))           # across
    def P(along, across):
        return (tip[0] + (u[0] * along + v[0] * across) * s, tip[1] + (u[1] * along + v[1] * across) * s)
    hw = 17
    sh = 10  # shadow offset
    shadow = [(px + sh, py + sh) for px, py in [P(40, -hw), P(330, -hw), P(330, hw), P(40, hw)]]
    draw.polygon(shadow, fill=(0, 0, 0, 40))
    draw.polygon([P(0, 0), P(40, -hw), P(40, hw)], fill=(233, 196, 140))       # wood cone
    draw.polygon([P(0, 0), P(13, -5.5), P(13, 5.5)], fill=(50, 50, 55))        # graphite
    draw.polygon([P(40, -hw), P(270, -hw), P(270, hw), P(40, hw)], fill=(255, 196, 0))
    draw.polygon([P(40, -hw / 3), P(270, -hw / 3), P(270, hw / 3), P(40, hw / 3)], fill=(255, 214, 60))
    draw.polygon([P(270, -hw), P(296, -hw), P(296, hw), P(270, hw)], fill=(190, 190, 200))
    draw.polygon([P(296, -hw), P(330, -hw), P(330, hw), P(296, hw)], fill=(244, 140, 160))


# ----------------------------------------------------------------------------- timeline
@dataclass
class SceneTiming:
    start: float
    dur: float
    audio_dur: float
    words: list[Word] = field(default_factory=list)


def _caption_chunks(words: list[Word], offset: float, max_words: int = 3):
    chunks, cur = [], []
    for w in words:
        cur.append(w)
        if len(cur) >= max_words or w.text[-1:] in ".,!?;:":
            chunks.append(cur)
            cur = []
    if cur:
        chunks.append(cur)
    out = []
    for c in chunks:
        out.append(([(w.text, w.start + offset, w.end + offset) for w in c], c[0].start + offset, c[-1].end + offset))
    return out


def render_video(script: VideoScript, timings: list[SceneTiming], audio_wav: str, out_mp4: str,
                 fmt: str = "shorts", fps: int = 30, accent: str = "#FF6B35", caption_scale: float = 1.0,
                 seed: int = 1) -> list[tuple[float, float]]:
    """Render frames to ffmpeg. Returns the list of (start, end) drawing intervals (for pencil SFX)."""
    lay = make_layout(fmt, caption_scale)
    W, H = lay.W, lay.H
    acc = hex_rgb(accent)
    paper = _paper(W, H)

    # static layer: hook title
    static = paper.copy()
    sd = ImageDraw.Draw(static)
    tf, tlines = _fit_title(script.hook_title.upper(), lay)
    tx, ty, tw, th = lay.title_box
    lh = tf.size * 1.12
    y0 = ty + (th - lh * len(tlines)) / 2
    for i, line in enumerate(tlines):
        lw = tf.getlength(line)
        x = tx + (tw - lw) / 2
        y = y0 + i * lh
        if i == len(tlines) - 1:  # marker highlight behind last line
            sd.rounded_rectangle([x - 14, y + tf.size * 0.45, x + lw + 14, y + tf.size * 1.08], 10,
                                 fill=tuple(int(c * 0.35 + 255 * 0.65) for c in acc))
        sd.text((x, y), line, font=tf, fill=INK["ink"])

    cap_font = ImageFont.truetype(FONT_BOLD, lay.caption_size)
    hand_font = ImageFont.truetype(FONT_HAND, 68 * SS)
    tag_font = ImageFont.truetype(FONT_BOLD, 40 if fmt == "shorts" else 34)
    dx, dy, dsize = lay.draw_box
    total = timings[-1].start + timings[-1].dur
    n_frames = int(math.ceil(total * fps))

    ff = subprocess.Popen(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
         "-r", str(fps), "-i", "-", "-i", audio_wav, "-c:v", "libx264", "-preset", "veryfast", "-crf", "19",
         "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", out_mp4],
        stdin=subprocess.PIPE)

    draw_intervals = []
    frame = 0
    big = 1000 * SS
    for si, (scene, tm) in enumerate(zip(script.scenes, timings)):
        prims = build_prims(scene.strokes, seed * 100 + si)
        total_len = sum(p.length for p in prims) or 1.0
        draw_t = min(max(0.62 * tm.dur, 1.4), tm.dur - 0.5)
        draw_intervals.append((tm.start + 0.05, tm.start + draw_t))
        # cumulative schedule (time at which each prim starts/ends)
        sched, acc_len = [], 0.0
        for p in prims:
            t0 = tm.start + 0.05 + draw_t * acc_len / total_len
            acc_len += p.length
            t1 = tm.start + 0.05 + draw_t * acc_len / total_len
            sched.append((t0, t1))
        ink = Image.new("RGBA", (big, big), (0, 0, 0, 0))
        fills = Image.new("RGBA", (big, big), (0, 0, 0, 0))
        idraw, fdraw = ImageDraw.Draw(ink), ImageDraw.Draw(fills)
        drawn_idx = [0] * len(prims)          # how many path points already inked
        fill_done = [False] * len(prims)
        text_done = [False] * len(prims)
        chunks = _caption_chunks(tm.words, tm.start)
        scene_end = tm.start + tm.dur

        while frame < n_frames and frame / fps < scene_end - 1e-9:
            t = frame / fps
            tip = None
            for pi, (p, (t0, t1)) in enumerate(zip(prims, sched)):
                if t < t0:
                    break
                prog = 1.0 if t >= t1 else (t - t0) / max(t1 - t0, 1e-6)
                if p.is_text:
                    if not text_done[pi] and prog >= 0.999:
                        ax, ay = p.anchor
                        idraw.text((ax * SS, ay * SS), p.text, font=hand_font, fill=p.color, anchor="mm")
                        text_done[pi] = True
                    if prog < 1:
                        w = hand_font.getlength(p.text) / SS
                        tip = (p.anchor[0] - w / 2 + w * prog, p.anchor[1] + 18)
                    continue
                n_target = max(1, int(round(prog * len(p.path))))
                if n_target > drawn_idx[pi]:
                    a = max(0, drawn_idx[pi] - 1)
                    seg = [(float(x) * SS, float(y) * SS) for x, y in p.path[a:n_target]]
                    w = int(p.width * SS)
                    if len(seg) > 1:
                        idraw.line(seg, fill=p.color, width=w, joint="curve")
                    r = w / 2
                    for (x, y) in seg[::2] + seg[-1:]:
                        idraw.ellipse([x - r, y - r, x + r, y + r], fill=p.color)
                    drawn_idx[pi] = n_target
                if prog < 1:
                    tip = tuple(p.path[min(n_target, len(p.path)) - 1])
                if prog >= 1 and p.fill and p.fill_poly and not fill_done[pi]:
                    off = 5 * SS
                    fdraw.polygon([(x * SS + off, y * SS + off) for x, y in p.fill_poly], fill=p.fill + (235,))
                    fill_done[pi] = True

            # compose drawing area
            layer = Image.alpha_composite(fills, ink).reduce(SS)
            hold_start = sched[-1][1] if sched else tm.start
            z = 1.0 + (0.035 * min(1, (t - hold_start) / max(scene_end - hold_start, 0.1)) if t > hold_start else 0)
            fade = 1.0
            if si < len(timings) - 1 and t > scene_end - 0.22:
                fade = max(0.0, (scene_end - t) / 0.22)
            img = static.copy()
            if z > 1.0:
                zs = int(dsize * z)
                lay_img = layer.resize((zs, zs), Image.BILINEAR)
                ox = (zs - dsize) // 2
                lay_img = lay_img.crop((ox, ox, ox + dsize, ox + dsize))
            else:
                lay_img = layer.resize((dsize, dsize), Image.BILINEAR) if dsize != 1000 else layer
            if fade < 1:
                al = lay_img.getchannel("A").point(lambda v: int(v * fade))
                lay_img.putalpha(al)
            img.paste(lay_img, (dx, dy), lay_img)
            d = ImageDraw.Draw(img, "RGBA")

            if scene.on_screen_title:
                tag = scene.on_screen_title.upper()[:30]
                tw_ = tag_font.getlength(tag)
                tx0 = (W - tw_) / 2
                ty0 = dy + 14
                d.rounded_rectangle([tx0 - 22, ty0 - 10, tx0 + tw_ + 22, ty0 + tag_font.size + 14], 18, fill=acc)
                d.text((tx0, ty0), tag, font=tag_font, fill=(255, 255, 255))

            if tip is not None:
                sc = dsize / 1000
                _pencil(d, (dx + tip[0] * sc, dy + tip[1] * sc), s=1.0 if fmt == "shorts" else 0.8)

            # karaoke captions
            for cwords, c0, c1 in chunks:
                if c0 - 0.05 <= t <= c1 + 0.15:
                    texts = [w[0].upper() for w in cwords]
                    space = cap_font.getlength(" ")
                    widths = [cap_font.getlength(x) for x in texts]
                    tot = sum(widths) + space * (len(texts) - 1)
                    scale_lines = tot > W - 80
                    x = (W - min(tot, W - 80)) / 2
                    y = lay.caption_y
                    for (txt, ws, we), wd in zip(cwords, widths):
                        active = ws <= t + 0.03
                        col = acc if (ws <= t < we + 0.08) else (INK["ink"] if active else (120, 120, 128))
                        if scale_lines and x + wd > W - 40:
                            x, y = 40, y + cap_font.size * 1.1
                        d.text((x, y), txt.upper(), font=cap_font, fill=col,
                               stroke_width=max(4, cap_font.size // 12), stroke_fill=(255, 255, 255))
                        x += wd + space
                    break

            # progress bar
            d.rectangle([0, H - 14, int(W * t / total), H], fill=acc)
            ff.stdin.write(img.tobytes())
            frame += 1
    ff.stdin.close()
    if ff.wait() != 0:
        raise RuntimeError("ffmpeg failed")
    return draw_intervals
