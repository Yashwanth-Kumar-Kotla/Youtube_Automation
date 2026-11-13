# TikTok Direct Post: what to do for the review

The app (AutoShortss) posts through **yashwanth-kumar-kotla.github.io/tiktok/post**, the approval page. TikTok's review
needs a working posting screen and a demo video. Everything below is ready except the parts only you can do.

## How it works
1. `tiktok-page-data` (GitHub Actions, every 3 h) asks TikTok for the creator's info (nickname, avatar, privacy options,
   comment/duet/stitch limits) and lists the ready videos. It writes `state/tiktok/creator_<app>.json` and `queue.json` (no secrets).
2. The page shows that. You pick a video, edit the caption, choose who can view it (no default), choose comment/duet/stitch
   (off by default), optionally disclose commercial content, see the Music Usage Confirmation, and tap **Post**.
3. Post opens a pre-filled GitHub issue `[tiktok-post] <id> <nonce>`; submitting it is your confirmation.
   `tiktok-approve` (runs only for issues opened by you) checks every choice against TikTok's current creator info,
   then either posts now with exactly those settings or saves the approval for the 7 PM slot. The result is commented on
   the issue and shown on the page.
4. In `direct` mode the hourly publisher posts **only** videos you approved, with your settings.

## You: test account (5 min)
1. TikTok app → Profile → ☰ → Add account → Sign up (new email or phone), e.g. `whathappensif_test`.
2. On that account: Settings and privacy → Privacy → **Private account ON**.
3. developers.tiktok.com → AutoShortss → **Sandbox → Target users** → add it. Apply changes.
4. Connect it to the sandbox app: open yashwanth-kumar-kotla.github.io/tiktok/callback, paste the **Sandbox** client key,
   Authorize while logged in as the **test** account, then run the exchange (see below) and update the GitHub secret
   `TIKTOK_SANDBOX_REFRESH_TOKEN` with the new token.
5. Run the `tiktok-page-data` workflow (GitHub → Actions → tiktok-page-data → Run workflow) so the page shows the test account.

## You: demo video (screen recording, 1–2 min)
Record on your Mac (Cmd+Shift+5) or phone:
1. Open yashwanth-kumar-kotla.github.io/tiktok/callback → paste the Sandbox client key → **Authorize with TikTok** → the
   TikTok consent screen (test account) → back on the page with the code. (Shows Login Kit + scopes.)
2. Open yashwanth-kumar-kotla.github.io/tiktok/post?app=sandbox. Show the **nickname and avatar**.
3. Pick a video, play the preview a second, edit the caption a little.
4. Open **Who can view this video** (show it starts on "Select…"), choose **Only me**.
5. Show the Comment/Duet/Stitch checkboxes, tick Comment.
6. Turn **Disclose video content** on, tick "Your brand", show the "Promotional content" label; tick "Branded content",
   show "Paid partnership", that Only me becomes unavailable, and the Branded Content Policy text. Turn disclosure off again,
   pick **Only me**.
7. Show the **Music Usage Confirmation** line, tap **Post**, submit the confirmation, wait for "✅ Posted".
8. Open TikTok on the test account → Profile → show the new private video.

## You: Production tab (then ask Claude before you press Submit)
- Products: **Login Kit**, **Content Posting API** with **Direct Post ON**.
- Scopes: `user.info.basic`, `video.upload`, `video.publish`.
- Platform: Web. Website URL: `https://yashwanth-kumar-kotla.github.io/`
- Redirect URI: `https://yashwanth-kumar-kotla.github.io/tiktok/callback`
- Terms of Service: `https://yashwanth-kumar-kotla.github.io/terms` · Privacy Policy: `https://yashwanth-kumar-kotla.github.io/privacy`
- App icon 1024×1024, the demo video.
- **Description** (paste):

> AutoShorts lets a single creator review, approve and publish their own original short educational videos to their own
> TikTok account. On the posting page the creator sees their TikTok nickname and avatar, previews the video, edits the
> caption, chooses who can view it (there is no default), sets whether others may comment, duet or stitch, and can
> disclose promotional or branded content. They confirm with a Post button after the Music Usage Confirmation (and the
> Branded Content Policy when it applies). The video is then published right away or at the time the creator picked.
> The app is used only by its owner; it does not access other users' accounts or data.

- **Explain how each scope is used** (if asked):
  - `user.info.basic`: show the creator's nickname and avatar on the posting page.
  - `video.upload`: send a video to the creator's TikTok inbox as a draft to finish in the app.
  - `video.publish`: publish the creator's approved video with the settings they chose on the posting page.

## After approval
1. Connect your **main** account on the callback page with the **Production** client key, run the exchange, and save the token as
   `TIKTOK_BODY_REFRESH_TOKEN` (replaces the old one).
2. Tell Claude; it sets `tiktok.mode: direct` in config.yaml. From then on: approve videos on the page (Post now or
   "At my next posting time"), and the publisher posts approved ones publicly at 7 PM.

## Code exchange (Terminal, on your Mac)
`python3 scripts/tiktok_exchange.py` in this repo, or the standalone copy `~/tiktok_exchange.py`. It asks for the client key,
client secret (hidden) and the code, and prints the refresh token. Paste it into the GitHub secret, never into chat.
