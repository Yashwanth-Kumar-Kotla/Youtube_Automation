"""Data contracts between the LLM, the TTS step and the renderer."""
from typing import List, Literal
from pydantic import BaseModel, Field


class Point(BaseModel):
    x: int = Field(description="0-1000, left to right")
    y: int = Field(description="0-1000, top to bottom")


class Stroke(BaseModel):
    kind: Literal["line", "curve", "circle", "ellipse", "rect", "arrow", "text"] = Field(
        description=(
            "line/curve: polyline or smooth curve through `points` (curve = hand-drawn smooth). "
            "circle/ellipse/rect: points[0]=top-left, points[1]=bottom-right of bounding box. "
            "arrow: from points[0] to points[-1] (may bend through middle points). "
            "text: hand-lettered label anchored at points[0] (center)."
        )
    )
    points: List[Point]
    text: str = Field(description="Label for kind=text, else empty string")
    color: Literal["ink", "red", "blue", "green", "orange", "purple", "gray"] = "ink"
    fill: Literal["none", "skin", "red", "blue", "green", "yellow", "orange", "purple", "gray", "pink", "white"] = "none"
    width: Literal["thin", "normal", "bold"] = "normal"


class Scene(BaseModel):
    narration: str = Field(description="Exactly what the voice says in this scene (1-3 short sentences)")
    on_screen_title: str = Field(description="2-5 word punchy label shown above the drawing, or empty")
    strokes: List[Stroke] = Field(description="8-30 strokes forming a simple whiteboard doodle, drawn in order")


class VideoScript(BaseModel):
    topic: str
    hook_title: str = Field(description="Big text shown the whole video, <= 45 chars, curiosity-driven")
    youtube_title: str = Field(description="<= 90 chars, includes main keyword")
    description: str = Field(description="2-4 sentences + call to action, no hashtags")
    hashtags: List[str] = Field(description="5-8 hashtags without #")
    scenes: List[Scene]


class Review(BaseModel):
    approved: bool
    accuracy_issues: List[str]
    safety_issues: List[str]
    retention_notes: List[str] = Field(description="Where viewers would likely swipe away and why")


class TopicIdeas(BaseModel):
    topics: List[str]
