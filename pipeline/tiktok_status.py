"""Ask TikTok what happened to each draft upload (publish_id) recorded in state/tiktok_drafts.json and posts.json.
Runs only in GitHub Actions (tokens live in GitHub Secrets). Read-only: uploads nothing."""
from __future__ import annotations

import requests

from . import state, tiktok


def main() -> int:
    ids = dict(state.load("tiktok_drafts.json", {}))
    for d in state.load("posts.json", {}).values():
        for r in d.get("body", []):
            if r.get("tiktok"):
                ids.setdefault(r["id"], r["tiktok"])
    tok = tiktok._token("body")
    h = {"Authorization": f"Bearer {tok}", "Content-Type": "application/json; charset=UTF-8"}
    try:
        u = requests.get("https://open.tiktokapis.com/v2/user/info/?fields=display_name,username",
                         headers=h, timeout=30).json()
        print("connected TikTok account:", u.get("data", {}).get("user"), u.get("error", {}).get("code"))
    except Exception as e:
        print("user info failed:", e)
    ci = requests.post("https://open.tiktokapis.com/v2/post/publish/creator_info/query/", headers=h, timeout=30).json()
    print("creator_info privacy options:", ci.get("data", {}).get("privacy_level_options"),
          "nickname:", ci.get("data", {}).get("creator_nickname"), "err:", ci.get("error", {}).get("code"),
          ci.get("error", {}).get("message", "")[:200])
    for vid, pid in ids.items():
        j = requests.post("https://open.tiktokapis.com/v2/post/publish/status/fetch/", headers=h, timeout=30,
                          json={"publish_id": pid}).json()
        d = j.get("data", {})
        print(f"{vid}: status={d.get('status')} fail_reason={d.get('fail_reason')} err={j.get('error', {}).get('code')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
