"""Tiny JSON state: topic queue + publish history per channel (committed back to git by the workflow)."""
from __future__ import annotations

import json
import os
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATE = os.path.join(ROOT, "state")


def _path(name: str) -> str:
    p = os.path.join(STATE, name)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    return p


def load(name: str, default):
    p = _path(name)
    if os.path.exists(p):
        with open(p) as f:
            return json.load(f)
    return default


def save(name: str, data) -> None:
    with open(_path(name), "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def _norm(t: str) -> str:
    return "".join(c for c in t.lower() if c.isalnum())


def used_topics(channel: str) -> list[str]:
    return [h["topic"] for h in load(f"history_{channel}.json", [])]


def next_topic(channel: str, seeds: list[str]) -> str | None:
    used = {_norm(t) for t in used_topics(channel)}
    queue = load(f"queue_{channel}.json", [])
    for t in seeds + queue:
        if _norm(t) not in used:
            return t
    return None


def queue_size(channel: str, seeds: list[str]) -> int:
    used = {_norm(t) for t in used_topics(channel)}
    return sum(1 for t in seeds + load(f"queue_{channel}.json", []) if _norm(t) not in used)


def add_to_queue(channel: str, topics: list[str]) -> None:
    q = load(f"queue_{channel}.json", [])
    have = {_norm(t) for t in q}
    q += [t for t in topics if _norm(t) not in have]
    save(f"queue_{channel}.json", q)


def record(channel: str, entry: dict) -> None:
    h = load(f"history_{channel}.json", [])
    entry["at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    h.append(entry)
    save(f"history_{channel}.json", h)
