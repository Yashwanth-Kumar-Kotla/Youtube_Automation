"""Audit evidence: commentThreads.insert from my channel on one of my own public videos."""
from __future__ import annotations

import json
import os
import sys

from . import youtube

ch, vid = sys.argv[1], sys.argv[2]
meta = json.load(open(sys.argv[3])) if len(sys.argv) > 3 else {}
text = meta.get("pinned_comment") or "What's the longest you've ever stayed awake? 👀"
v = youtube.service(ch).videos().list(part="status,snippet", id=vid).execute()["items"][0]
print(f"videos.list id={vid} -> title={v['snippet']['title']!r} privacyStatus={v['status']['privacyStatus']}")
youtube.comment(ch, vid, text)
