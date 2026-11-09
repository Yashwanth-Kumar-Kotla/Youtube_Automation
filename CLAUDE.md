# AutoShorts: instructions for Claude sessions in this repo
Memory lives in `memory/` (markdown). How the system works: `docs/AUTOPILOT.md`. Machine settings: `config.yaml`.
Styles + engine: `vendor/faceless-shorts/` (read `styles/<style>/STYLE.md` before directing).
Each channel's living template (with every component built so far): `studio/<channel>/`.

## Production run ("make videos"; scheduled twice a day)
Videos go into a per-channel **stock**, not straight to posting. The hourly `publish` workflow posts the best one per slot.
0. `bin/episode.sh setup` once per container (until it prints "All set"). `git pull` first.
1. **Rework first.** For each enabled channel, `bin/episode.sh room <ch>` lists `rework` ids. For each (they count toward the run limit):
   `d=$(bin/episode.sh new <ch>)`, copy `archive/<ch>/<id>/{script.json,meta.json,shots.js}` into `$d` (shots.js → `$d/src/`), then
   **writer** rewrites the hook (lines 1-2), the closing line and meta per the reason in STOCK_LOG.md and the latest review, `bin/episode.sh voice $d`,
   **director** re-times the shots, **qa**, then `python -m pipeline.stock ready <ch> <id> $d "<what changed>"`. If it can't be saved:
   `python -m pipeline.stock retire <ch> <id> "<why>"`.
2. **New videos**, until `production.max_videos_per_run` is reached or every enabled channel's stock is full:
   pick the enabled channel with the fewest ready videos that still has room (`bin/episode.sh room <ch>`), then
   a. `d=$(bin/episode.sh new <ch>)`
   b. **writer** agent (channel + $d) → `$d/script.json` + `$d/meta.json` (with stock tags), topic marked used in BACKLOG.
      If `room` shows `next_topic_must_be`, tell the writer: that topic is mandatory (a posted or stocked video promised it).
      Set script.json "voice"/"speed" from config `kokoro_voice`/`kokoro_speed`.
   c. `bin/episode.sh voice $d`
   d. **director** agent → `$d/src/shots.js` (+ kit components) until `node tools/capture.mjs check` says CHECK OK; then cues + mix.
   e. **qa** agent → `$d/qa.md`. On FAIL: director fixes, qa again (max 2 rounds). Never stock a video that didn't PASS.
      Still failing: in `tease_next` mode the promised topic can't be skipped, so start it over once from scratch with a simpler
      visual approach; if that fails too, stop the run and add an OWNER_TODO line (the chain is blocked). Otherwise skip the topic
      (put it back in BACKLOG "Up next" with a note) and move on.
   f. `bin/episode.sh finish <ch> $d` (exit 4 = stock or topic cluster full → pick another topic/channel).
   g. **Commit and push after every video** (`state/ memory/ studio/ archive/`), so nothing is lost if the run stops early.
3. If every enabled channel is full, add a dated line to memory/OWNER_TODO.md suggesting a new channel (it needs the owner to create it).
4. Report one line per video: channel · id · topic · hook pattern · PASS / reworked / skipped. **Never upload directly.**

## Weekly run ("weekly review", Sundays)
**scout** agent → `memory/research/<YYYY>-W<ww>.md`, then **analyst** agent → `memory/reviews/<YYYY>-W<ww>.md` + edits to
PLAYBOOK/BIBLEs/BACKLOGs/EXPERIMENTS + **re-scores every stocked video** (`python -m pipeline.stock rescore|retire`, see analyst.md).
Commit and push. Then report a 5-line summary for the owner.

## Rules
- Never put secrets in memory/, code or commits. Uploading and tokens live only in GitHub Actions.
- Never delete LEDGER rows. Posting is capped by `slots` (max 3 per channel per day, whatever the stock size). Every video original
  (no reposting across channels). Never edit state/stock/*.json or STOCK.md by hand: use `python -m pipeline.stock`.
- Keep each agent's context to the files it lists; pass paths, not file contents.
- If something needs the owner (expired token, policy warning, repeated failures), open `memory/OWNER_TODO.md` and add a dated line.
