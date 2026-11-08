# The money plan (read this before turning anything on)

## 1. The math nobody tells you
| Revenue source | Rough payout | Views needed for $100k/month |
|---|---|---|
| YouTube **Shorts** ad share | ~$0.03-0.10 per 1,000 views (US-heavy can reach ~$0.15) | **1-3 BILLION views/month** |
| TikTok **Creator Rewards** (videos must be **> 1 min**, 10k followers, US) | ~$0.40-1.00 per 1,000 qualified views | 100-250M qualified views/month |
| YouTube **long-form**, 40+ health/aging/money niche | **$8-20 per 1,000 views** | **5-12M views/month** |
| Made-for-Kids long-form | ~$0.50-2 per 1,000 views | not a realistic path |

**Conclusion:** Shorts are the **ad**, not the **product**. Channels at $100k/month use Shorts and TikTok
for reach, then make money from (a) long-form on a high-RPM niche, (b) TikTok Creator Rewards on 61-75 s
videos, and (c) affiliate links, digital products and sponsors. This pipeline already renders
16:9 long-form (`--format long`). Long-form scripts are the next build step.

## 2. Ranking your three niches by money
1. **40+ health/aging (`mature`)**: highest RPM of the three. Advertisers pay a lot for this audience
   (insurance, supplements, Medicare, finance). The best upgrade path is to also make 8-12 min long-form versions.
   Affiliate fit: walking pads, blood-pressure monitors, sleep gear, books. Keep claims accurate:
   YouTube's health-misinformation policy demonetizes or removes channels.
2. **Viral "what happens if" (`viral`)**: the biggest view counts and the fastest way to followers.
   Use it to reach TikTok's 10k followers, then switch to 61-75 s videos for Creator Rewards.
   Reference ceiling: Zack D. Films-style channels get billions of views. You compete on format and topic, never by copying.
3. **Kids 5-13 (`kids`)**: the worst money of the three, for legal reasons.
   - Content **directed at children must be marked Made for Kids** (COPPA; the FTC fined YouTube $170M over this).
     MFK means no comments, no personalized ads (much lower RPM), no notification bell, and the Shorts feed pushes it less.
   - TikTok requires users to be 13+, so kid-directed content doesn't belong there (disabled in config).
   - **The money move:** make it a *general-audience* "body science" channel. Family-friendly, simple, fun,
     but written for everyone ("you" = any curious person) instead of "for kids". That's how the big
     body-explainer channels work. Only do this if the content really is general-audience. Titles like
     "explained for kids" or cartoon-for-toddlers make it kid-directed no matter what you tick.

## 3. Rules that decide whether you get paid at all
- **YouTube "inauthentic content" policy (July 2025):** mass-produced or templated videos with little variation get
  demonetized at the channel level. Defenses already built in: original scripts every time, a fact-check gate,
  a new drawing per scene, and three distinct channels. Your job: watch the videos for 15 min per week,
  kill weak formats, and keep it to 1-3 posts per day per channel. 20 per day of the same template is how channels get flagged.
- **AI labels:** TikTok requires labelling AI-generated content (the uploader sets `is_aigc` in direct mode;
  toggle "AI-generated" when posting drafts). YouTube's disclosure covers *realistic* synthetic media; cartoon
  sketches don't need it.
- **API audits (do these on DAY 1, they take 1-4 weeks):**
  - YouTube: API uploads from an unaudited Google Cloud project are **locked to private**.
    Submit the YouTube API Services audit/quota form.
  - TikTok: unaudited apps can only direct-post as **private (SELF_ONLY)**. Until then use `mode: draft`.
    Drafts land in your TikTok inbox, you add a **trending sound** (a real reach boost) and tap post. About 20 sec per day.
- **Quota:** 10,000 units/day per Google project, and an upload costs ~1,600, so ~6 uploads/day. Enough for 3 channels.

## 4. The growth loop (what operators actually do)
1. Weeks 1-2: post daily on all channels. Expect 0-500 views. The algorithm is testing you. Don't change anything yet.
2. Weeks 3-6: look at the numbers (YouTube Studio: **"viewed vs swiped away"** and **average % viewed**).
   Shorts that keep > 70% "viewed" get pushed. Find the 2-3 topic *patterns* that won and put 30 more in that
   channel's `seed_topics`.
3. When one video breaks out (100k+), immediately make 5 follow-ups on the same premise (sequels outperform).
4. At 10k TikTok followers: change `target_seconds` to `[62, 75]` for TikTok channels (Creator Rewards needs > 1 min).
5. At YPP (1k subs + 10M Shorts views in 90 days, or 4k watch hours): start long-form on `mature`.
6. Add income: a pinned comment with affiliate links (40+), a cheap digital product (e.g. a "30-day walking plan" PDF).

## 5. Costs (to start)
| Item | Cost |
|---|---|
| Claude API (script + fact-check + topics) | ~$0.10-0.20/video → **~$10-20/month** for 3/day |
| Voice (Edge neural TTS) | free |
| Rendering + scheduling (GitHub Actions) | free (public repo) or ~650 of the 2,000 free min/month (private) |
| Music | free. Drop royalty-free MP3s into `assets/music/` (YouTube Audio Library). Never use copyrighted songs. |

## 6. Upgrades, by expected ROI
1. **Long-form 40+ (biggest $):** 8-12 min scripts, 16:9, chapters, same engine.
2. **Analytics feedback loop:** pull YouTube Analytics daily and feed the top performers into topic brainstorming.
3. **Premium visuals:** the `faceless-shorts` skill's Deep Dive 3D / Inside Out styles look closer to the
   top channels. Use them for hand-made "hero" videos on topics that already proved themselves with sketches.
4. **Hindi/Spanish dubs** of winners (Edge TTS has hi-IN and es-MX voices). Same video, new market, near-zero cost.
