#!/bin/bash
# Episode helper for the daily Claude session.
#   bin/episode.sh setup                    one-time per container: faceless-shorts env (Kokoro voice, Whisper)
#   bin/episode.sh new <channel>            copy studio/<channel> → work/<date>-<channel>, prints the folder
#   bin/episode.sh voice <dir>              Kokoro voice + Whisper word timings for <dir>/script.json
#   bin/episode.sh room <channel>           stock status: room left, full topic clusters, rework list
#   bin/episode.sh finish <channel> <dir>   (QA PASS required) render → add to stock → keep kit + archive script/shots
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; SKILL="$ROOT/vendor/faceless-shorts"; PY="$SKILL/scripts/py"
DATE="${EPISODE_DATE:-$(TZ=America/Chicago date +%F)}"
case "${1:-}" in
  setup) bash "$SKILL/scripts/setup.sh" ;;
  new)
    ch="${2:?channel}"; [ -d "$ROOT/studio/$ch" ] || { echo "no studio/$ch" >&2; exit 2; }
    n=1; while [ -e "$ROOT/work/$DATE-$ch-$n" ]; do n=$((n+1)); done; d="$ROOT/work/$DATE-$ch-$n"
    mkdir -p "$ROOT/work"; cp -R "$ROOT/studio/$ch" "$d"; mkdir -p "$d/renders" "$d/review"
    rm -f "$d/data/narration.wav" "$d/data/mix.wav" "$d/meta.json" "$d/qa.md"
    cp "$d/src/core/kit.js" "$d/.kit.base.js"; echo "$d" ;;   # merge base for finish
  voice)
    d="${2:?dir}"; "$PY" "$SKILL/scripts/voice.py" "$d" && "$PY" "$SKILL/scripts/words.py" "$d" ;;
  finish)
    # QA must have passed. Renders, adds the video to the channel's stock (branch stock/<ch>/<id> + state/stock/<ch>.json),
    # keeps new kit components in studio/<ch>, archives the script. Exit 4 = stock/cluster full (not an error).
    ch="${2:?channel}"; d="${3:?dir}"
    [ -f "$d/meta.json" ] || { echo "missing $d/meta.json (writer step)" >&2; exit 2; }
    grep -q "^PASS" "$d/qa.md" 2>/dev/null || { echo "qa.md is not PASS: refusing to stock" >&2; exit 3; }
    vid=$(cd "$ROOT" && python3 -m pipeline.stock add "$ch" "$d" | tail -1) || exit $?
    sk="$ROOT/studio/$ch/src/core/kit.js"                                  # new components stay for next time:
    if [ -f "$d/.kit.base.js" ]; then                                      # 3-way merge, so videos made in parallel keep each other's pieces
      git merge-file -q "$sk" "$d/.kit.base.js" "$d/src/core/kit.js" || { echo "kit merge conflict in $sk: resolve by hand" >&2; exit 5; }
    else cp "$d/src/core/kit.js" "$sk"; fi
    a="$ROOT/archive/$ch/$vid"; mkdir -p "$a"; cp "$d/script.json" "$d/meta.json" "$d/src/shots.js" "$d/qa.md" "$a/"
    echo "stocked $vid" ;;
  room)
    (cd "$ROOT" && python3 -m pipeline.stock status "${2:?channel}") ;;
  *) sed -n 2,8p "$0"; exit 2 ;;
esac
