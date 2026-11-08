# Autopilot: how the system runs itself

## The shape
```
                        ┌──────────────── memory/ (markdown, in git) ───────────────┐
                        │ PLAYBOOK.md · channels/<ch>/BIBLE.md, BACKLOG.md, LEDGER.md │
                        │ research/<week>.md · reviews/<week>.md · EXPERIMENTS.md    │
                        └───────▲───────────────────────▲──────────────────▲────────┘
                                │ read/write            │ read/write       │ read
 DAILY  03:40 CT  Claude Code scheduled session = SHOWRUNNER
   for each channel ─► writer agent ─► director agent ─► render ─► qa agent ─(fail: fix x2, then sketch fallback)
                     ─► branch media/<date> with MP4s + meta.json
 DAILY  on push    GitHub Action = PUBLISHER (holds all secrets, no AI)
                     ─► YouTube upload, scheduled to the channel's best hour
                     ─► TikTok upload (draft until audited, then direct)
                     ─► appends IDs to LEDGER.md
 DAILY  23:00 CT  GitHub Action = STATS: YouTube Analytics + TikTok stats → data/stats/<date>.json
 WEEKLY Sat       GitHub Action = SCOUT DATA: YouTube top videos per niche (last 7 days), Reddit threads → data/trends/
 WEEKLY Sun 10:00 Claude Code scheduled session = ANALYST
                     ─► scout agent (web: Reddit, X, TikTok Creative Center, YouTube) + data/trends
                     ─► reviews/<week>.md: what worked, what flopped, why; updates PLAYBOOK, BIBLEs, BACKLOGs,
                        EXPERIMENTS; queues next week's topics; kills losing formats
```
Why this split: AI decides and makes things, plain code holds the passwords and posts.
Your YouTube/TikTok tokens never enter an AI context, and the publisher can't do anything creative or surprising.

## The agents (`.claude/agents/`)
| agent | job | reads | writes |
|---|---|---|---|
| showrunner (main session) | runs the day, one channel at a time, keeps its own context small | PLAYBOOK, EXPERIMENTS | releases, LEDGER rows |
| writer | topic pick, hook, script, captions, subscribe beat | BIBLE, BACKLOG, PLAYBOOK, latest research | script.json, BACKLOG (mark used) |
| director | shots.js on the style's kit, new components when needed | script.json, STYLE.md, kit | src/ |
| qa | looks at the contact sheet + key frames, rejects anything confusing or wrong | STYLE.md QA list | qa.md (pass/fail + fixes) |
| scout | what's working THIS week for each niche on YouTube, TikTok, Reddit, X | data/trends, web | research/<week>.md |
| analyst | weekly review of our own numbers vs the research | LEDGER, data/stats, research | reviews/<week>.md, PLAYBOOK, BIBLEs, BACKLOGs, EXPERIMENTS |

Each agent starts with a fresh context and only the files listed. That's the "manage contexts" part: nothing
piles up, and memory lives in markdown files a human can read and edit.

## What "attention" is engineered from (writer's rules, refined weekly in PLAYBOOK.md)
- **Second 0-1 (the hook):** the first frame is already mid-action plus the question on screen, with no logo or intro.
  The voice starts within 0.4 s. The hook names a concrete, visual, slightly scary or absurd premise.
- **Every 2-3 s:** a new picture (cut, zoom, reveal) landing on a spoken word.
- **Open loop:** promise a payoff early ("the third one is the worst"), and pay it off in the last 20%.
- **Loop ending:** the last line flows back into the first, so re-watches count.
- **Subscribe engineering (what actually makes people follow):**
  1. **Series identity:** a recurring named format ("Body Files #12", "Would You Survive? Ep. 7"). People follow series.
  2. **Next-episode tease** in the final second: "Tomorrow: what happens if you never sleep." Specific, never "like and subscribe".
  3. A small animated **follow pill** during the payoff, not at the start (an early CTA kills retention).
  4. A **pinned comment** with a question that invites answers, since comments boost distribution.
- **Measured every week:** % viewed vs swiped away, average % watched, subscribers gained per 1k views,
  shares. The analyst promotes what wins and kills what doesn't.

## Research sources: what's possible, what it costs
| source | how | cost / limits |
|---|---|---|
| YouTube | Data API: search per niche keyword, last 7 days, sorted by views + view velocity → top 50 | free, ~100 quota units per search |
| Own channels | YouTube Analytics API (retention, subs gained, swipe-away) + TikTok Display API (views, likes, shares) | free |
| Reddit | official API (script app): r/NewTubers, r/PartneredYoutube, r/TikTokhelp, niche subs (r/AskDocs, r/todayilearned, r/UnsolvedMysteries...) for hot topics and what creators report working | free for personal use, rate-limited |
| TikTok | TikTok Creative Center trend pages + web search by the scout agent. TikTok has no public trends API for commercial use. | free; optional paid scrapers (e.g. Apify, ~$30-50/mo) for more depth |
| X | web search by the scout agent. The official API needs a paid tier. | free via search; the API is optional and expensive |

Rule: copy **formats, topics and hook patterns**, never anyone's script, footage or drawings.

## Accounts: how to connect each (one time)
### YouTube (all channels under ONE Google account)
1. Create each channel as a **Brand Account** (YouTube → Settings → Add or manage channels → Create a channel).
   One login, many channels, one refresh token each.
2. console.cloud.google.com → new project `autoshorts` → enable **YouTube Data API v3** and **YouTube Analytics API**.
3. OAuth consent screen: External → add scopes `youtube.upload`, `youtube.readonly`, `yt-analytics.readonly`
   → **Publish app** (Testing mode tokens die after 7 days).
4. Credentials → OAuth client ID → Desktop app → download `client_secret.json`.
5. On your laptop: `python scripts/youtube_auth.py client_secret.json`, once per channel (pick the channel in the
   Google screen). Each run prints a refresh token.
6. **Submit the YouTube API audit form the same day.** Until it passes, every upload is private.
   Then request a quota increase (the default 10k units/day is ~6 uploads/day).
### TikTok (one developer app, many accounts)
1. developers.tiktok.com → create an app → products: **Login Kit, Content Posting API, Display API**.
2. Scopes: `user.info.basic`, `user.info.stats`, `video.list`, `video.upload`, `video.publish`.
   Redirect URI `http://localhost:8765/callback`.
3. Submit for review with a short screen recording of the flow. Until it's approved, use **draft** mode
   (videos land in your TikTok inbox: add a trending sound, tap post, about 20 s each).
4. Per TikTok account: `python scripts/tiktok_auth.py` → refresh token.
5. Use **personal/creator** accounts (Creator Rewards needs them), 18+, US. One account per niche, made on a phone.
   Post a few things by hand in week 1 so the account looks normal.
### Reddit (research)
reddit.com/prefs/apps → create app → type **script** → note the client id + secret.
### Where the keys go
GitHub repo → Settings → Secrets → Actions. **Never** into memory/ files, prompts or chat.
`ANTHROPIC_API_KEY` (only if the brain runs in Actions instead of Claude Code), `YT_CLIENT_ID`, `YT_CLIENT_SECRET`,
`YT_<CH>_REFRESH_TOKEN`, `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, `TIKTOK_<CH>_REFRESH_TOKEN`,
`REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`.

## Launch lineup (start with 3, add more after 30 days of data)
| channel | style | audience | why |
|---|---|---|---|
| `body`: "what happens if…" body/science | Inside Out | 13-35, general | huge proven demand, fast to make |
| `mature`: health after 40 | Inside Out, calmer pace | 40-70 | highest ad pay; long-form upgrade later |
| `survival`: "would you survive…?" | Stick Story | 13-30 | very high share and comment rates |
| later: `history` | Paper Atlas | 25-55 male | good pay, evergreen |
| later: `mysteries` | Night File 3D | 18-40 | huge watch time; needs a GPU or slow renders |

More channels = more chances to win, but also more weak videos and more review noise. 3 channels × 1-2 videos per day is the sweet spot until one breaks out.

## Your job after setup (the minimal-intervention part)
| when | what | time |
|---|---|---|
| daily, until TikTok approves the app | open the TikTok inbox, add a trending sound, post | 1-2 min |
| weekly (optional) | read `reviews/<week>.md`; veto anything you dislike by editing the md | 5 min |
| when the bot opens an issue | renew a token / answer a question | rare |
Everything else (topics, scripts, visuals, QA, posting times, weekly strategy changes) runs without you.

## Things that will get the channels killed (the system enforces these)
- **Mass-produced or repetitive** videos → YouTube demonetizes the whole channel (July 2025 policy).
  "Slop is fine" works for views, but every video needs a distinct script and visuals. Caps: 2/day per channel.
- The **same video on several of your own channels** → duplicate-content flags. Each channel gets original videos.
- **Medical misinformation** → strikes. The writer cites sources and qa checks claims.
- **Kid-directed content** without Made for Kids → FTC/COPPA risk. Channels are general-audience by design.
- Bought views/subs, follow-for-follow, engagement pods → shadow-bans. Never.
- **AI labels:** TikTok's AI-generated toggle is always on (`is_aigc`).
