"""Send several stocked videos to the creator's TikTok inbox as drafts, in one go (owner request).

Reads video ids (one per line, '#' comments allowed) from .github/tiktok-drafts-request, downloads each from its
stock branch and calls tiktok.upload(..., mode="draft"). Each publish_id is recorded in state/tiktok_drafts.json so
the hourly publisher reuses it instead of sending the same video again when its slot comes up.
Stops at the first TikTok error (e.g. too many pending inbox drafts) and keeps what was sent; re-run later for the rest.
Runs only in GitHub Actions (tokens live in GitHub Secrets).
"""
from __future__ import annotations

import os
import sys
import tempfile
import traceback

from . import state, stock, tiktok
from .publish import ROOT, download

REQ = os.path.join(ROOT, ".github", "tiktok-drafts-request")


def main() -> int:
    ch = "body"
    ids = [l.split("#")[0].strip() for l in open(REQ)] if os.path.exists(REQ) else []
    ids = [i for i in ids if i]
    sent = state.load("tiktok_drafts.json", {})
    posts = state.load("posts.json", {})
    already = {r["id"] for d in posts.values() for r in d.get(ch, []) if r.get("tiktok")}
    vids = stock.load(ch)["videos"]
    fails = 0
    for vid in ids:
        if vid in sent or vid in already:
            print(f"skip {vid}: already in the TikTok inbox")
            continue
        v = vids.get(vid)
        if not v or not v.get("branch"):
            print(f"skip {vid}: not in stock (no branch)")
            continue
        try:
            with tempfile.TemporaryDirectory() as tmp:
                download(v["branch"], tmp)
                pid = tiktok.upload(ch, os.path.join(tmp, f"{vid}.mp4"), v.get("title", ""), "draft")
            sent[vid] = pid
            state.save("tiktok_drafts.json", sent)
            print(f"draft sent {vid} -> {pid}  ({v.get('title', '')})")
        except Exception:
            traceback.print_exc()
            print(f"stopped at {vid}; the rest can be sent by re-running")
            fails = 1
            break
    print(f"{len(sent)} drafts recorded in state/tiktok_drafts.json")
    return fails


if __name__ == "__main__":
    sys.exit(main())
