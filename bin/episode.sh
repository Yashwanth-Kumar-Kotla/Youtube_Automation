#!/bin/bash
# Episode helper for the daily Claude session.
#   bin/episode.sh setup                    one-time per container: faceless-shorts env (Kokoro voice, Whisper)
#   bin/episode.sh new <channel>            copy studio/<channel> → work/<date>-<channel>, prints the folder
#   bin/episode.sh voice <dir>              Kokoro voice + Whisper word timings for <dir>/script.json
#   bin/episode.sh finish <channel> <dir>   render, cover, package to out/<date>/, keep kit + archive script/shots
#   bin/episode.sh release [date]           push out/<date>/* to branch media/<date> (the publisher takes it from there)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; SKILL="$ROOT/vendor/faceless-shorts"; PY="$SKILL/scripts/py"
DATE="${EPISODE_DATE:-$(TZ=America/Chicago date +%F)}"
case "${1:-}" in
  setup) bash "$SKILL/scripts/setup.sh" ;;
  new)
    ch="${2:?channel}"; d="$ROOT/work/$DATE-$ch"
    [ -d "$ROOT/studio/$ch" ] || { echo "no studio/$ch" >&2; exit 2; }
    rm -rf "$d"; mkdir -p "$ROOT/work"; cp -R "$ROOT/studio/$ch" "$d"; mkdir -p "$d/renders" "$d/review"
    rm -f "$d/data/narration.wav" "$d/data/mix.wav" "$d/meta.json" "$d/qa.md"; echo "$d" ;;
  voice)
    d="${2:?dir}"; "$PY" "$SKILL/scripts/voice.py" "$d" && "$PY" "$SKILL/scripts/words.py" "$d" ;;
  finish)
    ch="${2:?channel}"; d="${3:?dir}"; o="$ROOT/out/$DATE"; mkdir -p "$o"
    [ -f "$d/meta.json" ] || { echo "missing $d/meta.json (writer step)" >&2; exit 2; }
    grep -q "^PASS" "$d/qa.md" 2>/dev/null || { echo "qa.md is not PASS: refusing to package" >&2; exit 3; }
    (cd "$d" && node tools/capture.mjs video "renders/$ch.mp4")
    cp "$d/renders/$ch.mp4" "$o/$ch.mp4"; cp "$d/meta.json" "$o/$ch.json"
    ffmpeg -y -loglevel error -ss 0.9 -i "$o/$ch.mp4" -frames:v 1 -q:v 2 "$o/$ch.jpg"
    cp "$d/src/core/kit.js" "$ROOT/studio/$ch/src/core/kit.js"            # new components stay for next time
    a="$ROOT/archive/$ch/$DATE"; mkdir -p "$a"; cp "$d/script.json" "$d/meta.json" "$d/src/shots.js" "$d/qa.md" "$a/"
    ls -la "$o" ;;
  release)
    # Hands today's videos to the publisher: a one-commit branch media/<date> (no GraphQL/gh needed; plain git push).
    day="${2:-$DATE}"; o="$ROOT/out/$day"; ls "$o"/*.mp4 >/dev/null
    t="$(mktemp -d)"; cp "$o"/* "$t/"; url="$(git -C "$ROOT" remote get-url origin)"
    ( cd "$t" && git init -q && git checkout -q -b "media/$day" && git add -A && \
      git -c user.name=autoshorts-bot -c user.email=autoshorts-bot@users.noreply.github.com commit -qm "media $day" && \
      for i in 1 2 3 4; do git push -qf "$url" "media/$day" && exit 0; sleep $((2**i)); done; exit 1 )
    rm -rf "$t"; echo "pushed media/$day" ;;
  *) sed -n 2,8p "$0"; exit 2 ;;
esac
