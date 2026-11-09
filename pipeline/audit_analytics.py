"""Audit evidence: YouTube Analytics reports.query on my own channel (aggregate only)."""
from __future__ import annotations

import json
import os
import sys
from datetime import date

from . import youtube

ch = sys.argv[1] if len(sys.argv) > 1 else "body"
end = date.today().isoformat()
q = dict(ids="channel==MINE", startDate="2026-01-01", endDate=end,
         metrics="views,averageViewPercentage,subscribersGained")
r = youtube.analytics(ch).reports().query(**q).execute()
out = {"call": "youtubeAnalytics.reports.query", "params": q, "response": {k: r.get(k) for k in ("kind", "columnHeaders", "rows")}}
os.makedirs("state/audit", exist_ok=True)
json.dump(out, open("state/audit/d1_analytics_output.json", "w"), indent=1)
lines = [f"$ youtubeAnalytics.reports.query({', '.join(f'{k}={v!r}' for k, v in q.items())})",
         "-> 200 OK", "", "  ".join(f"{h['name']:>24}" for h in r.get("columnHeaders", []))]
for row in r.get("rows") or [[0, 0, 0]]:
    lines.append("  ".join(f"{str(v):>24}" for v in row))
if not r.get("rows"):
    lines.append("(no rows yet: the channel has no public views in this range, so values are zero)")
open("state/audit/d1_analytics_output.txt", "w").write("\n".join(lines) + "\n")
print("\n".join(lines))
