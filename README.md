# AutoShorts: daily whiteboard-sketch Shorts/TikToks on autopilot

Each run, for every channel in `config.yaml`:

```
topic queue ──► Claude writes script + doodle instructions ──► Claude fact-checks (rewrites if rejected)
   ──► neural voice + word timings (free) ──► pencil draws each scene, marker fills, karaoke captions,
       pencil SFX, optional music ──► MP4 + cover ──► YouTube (scheduled publish) + TikTok (draft/direct)
   ──► history saved so a topic never repeats; topics auto-refill when the queue runs low
```

Read **STRATEGY.md** for which niches make money and the rules that decide whether you get paid.

## Try it now (no keys needed)
```bash
pip install -r requirements.txt     # also needs ffmpeg
python run.py --channel kids --script samples/kids.json --no-upload
```
The video lands in `out/<date>_kids/`.

## With AI scripts
```bash
export ANTHROPIC_API_KEY=sk-ant-...
python run.py --channel viral --no-upload                 # next topic from the queue
python run.py --channel mature --topic "What happens if you walk after every meal?" --no-upload
python run.py --channel mature --format long --no-upload  # 16:9 layout
```

## Going live (one-time setup, ~1 hour + audit wait)
1. **GitHub**: create a repo (public = unlimited free Actions minutes), push this folder.
2. **Anthropic**: create an API key, add the secret `ANTHROPIC_API_KEY`.
3. **YouTube** (Google Cloud Console):
   - New project → enable **YouTube Data API v3** → OAuth consent screen (External, **publish to Production**)
     → Credentials → OAuth client ID → **Desktop app** → download `client_secret.json`.
   - On your computer: `python scripts/youtube_auth.py client_secret.json`, once per channel (pick the channel
     when Google asks). Save the secrets `YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_KIDS_REFRESH_TOKEN`,
     `YT_MATURE_REFRESH_TOKEN`, `YT_VIRAL_REFRESH_TOKEN`.
   - **Submit the API audit form right away.** Until it passes, uploads stay private.
4. **TikTok** (developers.tiktok.com): create an app → add Login Kit + Content Posting API → scopes
   `video.upload`, `video.publish` → redirect URI `http://localhost:8765/callback`.
   Run `TIKTOK_CLIENT_KEY=.. TIKTOK_CLIENT_SECRET=.. python scripts/tiktok_auth.py` per account.
   Save `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, `TIKTOK_MATURE_REFRESH_TOKEN`, `TIKTOK_VIRAL_REFRESH_TOKEN`.
   Submit the app for audit if you want fully automatic public posting (`mode: direct`).
5. **Test**: Actions → daily-shorts → Run workflow → `no_upload: true`. Download the videos from the run page and watch them.
6. **Go**: run again with uploads on. From then on it runs daily at 09:17 UTC. YouTube publishes each video
   at that channel's `publish_hour_local` (timezone: `timezone` in config, default America/Chicago).

## Tuning
- `config.yaml`: niches, tone, voice (`edge-tts --list-voices`), speed, length, colors, publish hour, seed topics.
- `assets/music/*.mp3`: royalty-free beds, mixed at -24 dB with ducking under the voice.
- `pipeline/llm.py`: the script prompt (hook/retention rules) and the doodle guide.

## Layout
| file | job |
|---|---|
| `run.py` | orchestrator + CLI |
| `pipeline/llm.py` | topics, script, fact-check (Claude, structured JSON) |
| `pipeline/tts.py` | Edge neural voice + per-word timestamps |
| `pipeline/render.py` | whiteboard animator → ffmpeg |
| `pipeline/audio.py` | voice assembly, pencil SFX, music ducking |
| `pipeline/youtube.py` / `tiktok.py` | uploaders |
| `state/` | topic queue + history (committed by the workflow) |
