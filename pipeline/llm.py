"""Script writing, topic brainstorming and fact-check review via the Claude API."""
from __future__ import annotations

import json
import anthropic

from .models import Review, TopicIdeas, VideoScript

_client: anthropic.Anthropic | None = None


def client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic(max_retries=4)
    return _client


DRAWING_GUIDE = """
DRAWING RULES (each scene's `strokes` is a whiteboard doodle on a 1000x1000 canvas):
- Simple, iconic, readable at phone size. Think explainer-video doodle, not art.
- One clear subject per scene, centered roughly in x 150-850, y 150-850.
- Build it in drawing order: main outline first, then details, then labels/arrows last.
- Use `curve` with 4-12 points for organic shapes (hands, bones, organs, faces), `circle`/`ellipse` for round things,
  `arrow` to point at the important part, `text` for 1-3 word labels (max 3 labels per scene).
- Use `fill` on closed shapes (circle/ellipse/rect, or a curve whose last point equals its first) to color them in.
  Use fills on 2-5 shapes per scene so the frame is colorful, not just lines.
- Stick figures and cartoon faces are great: head = circle with fill "skin", eyes = small filled circles.
- 8-30 strokes per scene. Never put text in the top 120px or bottom 80px.
- Use red/orange only for the problem area (pain, break, danger), blue/green for healthy/solution.
"""


def write_script(ch: dict, topic: str, model: str, effort: str, feedback: str = "") -> VideoScript:
    lo, hi = ch["scenes"]
    slo, shi = ch["target_seconds"]
    words = int(slo * 2.6), int(shi * 2.6)
    system = f"""You are the head writer of a faceless YouTube Shorts / TikTok channel that gets tens of millions of views
with hand-drawn whiteboard-sketch explainer videos.
Niche: {ch['niche']}
Audience: {ch['audience']}
Tone: {ch['tone']}

RETENTION RULES (non-negotiable, this is what makes money):
1. Scene 1 narration = the hook. Restate the question in a vivid, specific way in under 2 seconds of speech, then open a loop
   ("...and the third thing is the weirdest"). No "Hey guys", no "In this video", no greetings.
2. Every scene must reveal something new and concrete (a number, a mechanism, a surprising fact). No filler, no repetition.
3. Escalate: each scene a bit more surprising than the last. Use "but", "then", "here's the crazy part" to chain scenes.
4. Final scene: payoff + one practical takeaway, ending on a line that loops naturally back to the start of the video.
5. Spoken English only: short sentences, contractions, numbers spelled as a narrator would say them.
6. Total narration {words[0]}-{words[1]} words across {lo}-{hi} scenes.
7. Every fact must be true and mainstream-medically accurate. If something is uncertain, don't say it.
   For injuries/health: include "a doctor" or "a grown-up" where a real person should get help. Never give dosages.
{DRAWING_GUIDE}"""
    user = f"Write the video: {topic}"
    if feedback:
        user += f"\n\nA reviewer rejected the previous draft. Fix these problems:\n{feedback}"
    resp = client().messages.parse(
        model=model,
        max_tokens=16000,
        system=system,
        output_config={"effort": effort},
        messages=[{"role": "user", "content": user}],
        output_format=VideoScript,
    )
    if resp.stop_reason == "refusal" or resp.parsed_output is None:
        raise RuntimeError(f"Script generation failed: stop_reason={resp.stop_reason}")
    return resp.parsed_output


def review_script(ch: dict, script: VideoScript, model: str) -> Review:
    narration = "\n".join(f"{i+1}. {s.narration}" for i, s in enumerate(script.scenes))
    resp = client().messages.parse(
        model=model,
        max_tokens=8000,
        system=(
            "You are a strict fact-checker and content-safety reviewer for a health/science short-video channel. "
            f"Audience: {ch['audience']}. Reject (approved=false) for ANY factual error, misleading health claim, "
            "dangerous advice, gore or fear unsuitable for the audience, or medical claims stated more strongly than "
            "the evidence supports. Minor style issues go in retention_notes and do not cause rejection."
        ),
        output_config={"effort": "medium"},
        messages=[{"role": "user", "content": f"Title: {script.youtube_title}\n\nNarration:\n{narration}"}],
        output_format=Review,
    )
    if resp.parsed_output is None:
        raise RuntimeError(f"Review failed: stop_reason={resp.stop_reason}")
    return resp.parsed_output


def brainstorm_topics(ch: dict, used: list[str], model: str, n: int = 30) -> list[str]:
    resp = client().messages.parse(
        model=model,
        max_tokens=8000,
        system=(
            "You generate video topics for a faceless short-video channel. Pick topics with proven viral demand: "
            "the format 'What happens if/when/to...' with a concrete, visual, slightly shocking premise. "
            "Prefer topics people actually search for. No duplicates or near-duplicates of the used list."
        ),
        output_config={"effort": "medium"},
        messages=[{
            "role": "user",
            "content": f"Niche: {ch['niche']}\nAudience: {ch['audience']}\n"
                       f"Already used (avoid): {json.dumps(used[-200:])}\n\nGive {n} new topics.",
        }],
        output_format=TopicIdeas,
    )
    return resp.parsed_output.topics if resp.parsed_output else []
