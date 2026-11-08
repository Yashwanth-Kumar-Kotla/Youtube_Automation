"""Free neural TTS (Microsoft Edge voices) with per-word timestamps for karaoke captions."""
from __future__ import annotations

import asyncio
import os
import ssl
import subprocess
from dataclasses import dataclass

import edge_tts
import edge_tts.communicate as _comm

# Behind a TLS-intercepting proxy (e.g. this cloud box) edge-tts needs the proxy CA.
_ca = os.environ.get("SSL_CERT_FILE") or "/root/.ccr/ca-bundle.crt"
if os.path.exists(_ca):
    _comm._SSL_CTX = ssl.create_default_context(cafile=_ca)


@dataclass
class Word:
    text: str
    start: float  # seconds, relative to the scene's audio
    end: float


async def _synth(text: str, voice: str, rate: str, pitch: str, path: str) -> list[Word]:
    com = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, boundary="WordBoundary")
    words: list[Word] = []
    with open(path, "wb") as f:
        async for ch in com.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                s = ch["offset"] / 1e7
                words.append(Word(ch["text"], s, s + ch["duration"] / 1e7))
    return words


def synth(text: str, voice: str, rate: str, pitch: str, mp3_path: str, retries: int = 3) -> tuple[list[Word], float]:
    for attempt in range(retries):
        try:
            words = asyncio.run(_synth(text, voice, rate, pitch, mp3_path))
            break
        except Exception:
            if attempt == retries - 1:
                raise
    dur = float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3_path]).strip())
    return words, dur
