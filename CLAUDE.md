# AutoShorts: instructions for Claude sessions in this repo
Memory lives in `memory/` (markdown). How the system works: `docs/AUTOPILOT.md`. Machine settings: `config.yaml`.
Styles + engine: `vendor/faceless-shorts/` (read `styles/<style>/STYLE.md` before directing).
Each channel's living template (with every component built so far): `studio/<channel>/`.

## Daily run ("make today's videos")
0. `bin/episode.sh setup` once per container (until it prints "All set").
1. For each channel with `enabled: true` in config.yaml, one at a time:
   a. `d=$(bin/episode.sh new <channel>)`
   b. **writer** agent (pass the channel name + $d) → `$d/script.json` + `$d/meta.json`, topic marked used in BACKLOG.
      Set script.json "voice"/"speed" from config `kokoro_voice`/`kokoro_speed`.
   c. `bin/episode.sh voice $d`
   d. **director** agent → `$d/src/shots.js` (+ kit components) until `node tools/capture.mjs check` says CHECK OK; then cues + mix.
   e. **qa** agent → `$d/qa.md`. On FAIL: director fixes, qa again (max 2 rounds).
      Still failing → fallback: `python run.py --channel <channel> --no-upload` (sketch renderer), copy its MP4 to
      `out/<date>/<channel>.mp4`, write `<channel>.json` meta, and note it in the channel's LEDGER notes.
   f. `bin/episode.sh finish <channel> $d` (renders, packages to out/<date>/, keeps new kit components in studio/).
2. `bin/episode.sh release` (pushes branch media/<date>; the GitHub `publish` workflow posts it. **Never upload directly.**)
3. Commit `memory/ studio/ archive/` to main and push. Report one line per channel: topic, hook, PASS/fallback.

## Weekly run ("weekly review", Sundays)
**scout** agent → `memory/research/<YYYY>-W<ww>.md`, then **analyst** agent → `memory/reviews/<YYYY>-W<ww>.md` + edits to
PLAYBOOK/BIBLEs/BACKLOGs/EXPERIMENTS. Commit and push. Then report a 5-line summary for the owner.

## Rules
- Never put secrets in memory/, code or commits. Uploading and tokens live only in GitHub Actions.
- Never delete LEDGER rows. Max 2 videos per channel per day. Every video original (no reposting across channels).
- Keep each agent's context to the files it lists; pass paths, not file contents.
- If something needs the owner (expired token, policy warning, repeated failures), open `memory/OWNER_TODO.md` and add a dated line.
