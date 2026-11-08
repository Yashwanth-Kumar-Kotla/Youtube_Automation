# AutoShorts: instructions for Claude sessions in this repo
Memory lives in `memory/` (markdown). Read `docs/AUTOPILOT.md` for how the system works.
- **Daily run** ("make today's videos"): for each enabled channel in config.yaml, run the writer → director → qa agents
  (max 2 qa fix rounds; if still failing, fall back to `python run.py --channel <ch>` sketch renderer), then render with
  `node tools/capture.mjs video`, then create the GitHub release `daily-<date>` with the MP4s + meta.json. Never upload directly.
- **Weekly run** ("weekly review"): scout agent, then analyst agent, then commit memory/ and push.
- Never put secrets in memory/ or commit them. Never delete LEDGER rows. Keep each agent's context to the files it lists.
