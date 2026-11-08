# Owner checklist: only the steps that need YOUR login
Everything else is automated. No terminal needed for any of this.

## A. Google Cloud (once, ~15 min) · console.cloud.google.com
- [ ] Top bar → project menu → **New project** → name `autoshorts` → Create → make sure it's selected.
- [ ] **APIs & Services → Library**: enable **YouTube Data API v3** and **YouTube Analytics API**.
- [ ] **APIs & Services → OAuth consent screen** (may be called "Google Auth Platform"):
  - Audience/User type **External** · App name `AutoShorts` · support + developer email = your Gmail.
  - **Data access / Scopes** → add `youtube.upload`, `youtube.force-ssl`, `youtube.readonly`, `yt-analytics.readonly`.
  - **Publish app** → status **In production**. (In "Testing", the connection dies after 7 days.)
- [ ] **APIs & Services → Credentials → Create credentials → OAuth client ID**:
  - Application type **Web application** · name `autoshorts`
  - **Authorized redirect URIs** → add exactly `https://developers.google.com/oauthplayground`
  - Create → keep the **Client ID** and **Client secret** open in a tab.
- [ ] **Credentials → Create credentials → API key** → copy it (used for trend research; read-only).
- [ ] Submit the **YouTube API Services audit / quota form** (search "YouTube API Services audit and quota extension form").
  Say: "Personal tool that uploads my own original animated videos to my own channels and reads my own analytics."
  Until approved, uploads are forced to private. That's fine for testing.

## B. Connect each YouTube channel (~3 min per channel) · developers.google.com/oauthplayground
- [ ] Click the **gear icon** (top right) → tick **Use your own OAuth credentials** → paste Client ID + Client secret → Close.
- [ ] Left panel, box **"Input your own scopes"** → paste this one line → **Authorize APIs**:
  `https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly`
- [ ] Pick your Google account → **pick the channel** → "Google hasn't verified this app" → **Advanced → Go to AutoShorts** → Allow.
- [ ] **Step 2** → **Exchange authorization code for tokens** → copy the **Refresh token** (starts with `1//`).
- [ ] Repeat these 4 steps for each new channel (pick that channel on the account screen).

## C. Save the keys · GitHub repo → Settings → Secrets and variables → Actions → New repository secret
| name | value |
|---|---|
| `YT_CLIENT_ID` | Client ID from A |
| `YT_CLIENT_SECRET` | Client secret from A |
| `YT_API_KEY` | API key from A |
| `YT_BODY_REFRESH_TOKEN` | refresh token of the "what happens if" body-science channel |
| `YT_MATURE_REFRESH_TOKEN` | (later) the After 40 channel |
| `YT_SURVIVAL_REFRESH_TOKEN` | (later) the Would You Survive channel |
Also: **Settings → General → Danger zone** → make sure the repo is **Private**.

## D. TikTok
- **Weeks 1-2:** post by hand. Each day the video is on GitHub: open the repo → **branches → media/<date>** → `body.mp4`
  → download, or ask Claude to send it to you. In TikTok: upload, add a **trending sound at low volume**,
  turn ON "AI-generated content", paste the title + hashtags from `body.json`. Hand-posting in the first weeks also makes
  the new account look normal to TikTok.
- **Week 2+ (optional automation):** developers.tiktok.com → Manage apps → Connect an app → products
  **Login Kit (Desktop), Content Posting API, Display API** → it asks for Terms + Privacy URLs: paste `docs/legal/terms.md`
  and `docs/legal/privacy.md` into two Notion pages → Share → **Publish to web** → use those links → submit for review.
  Then tell Claude, and it walks you through the 2-minute connect step.

## E. Tell Claude "connected"
It then turns the channel on, runs one private test upload you can check in YouTube Studio, and starts the daily schedule.
