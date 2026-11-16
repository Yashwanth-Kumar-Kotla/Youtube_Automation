# PLAYBOOK: rules every video follows (the analyst edits this weekly; humans may too)
_Last updated: 2026-11-15 (W46 review: own data still thin, 4 YouTube Shorts with views, 1 with retention; changes come from research/2026-W46 policy findings, not from our stats)_

## Hook (0-1.5 s): decides 70% of the outcome
- Frame 1 is already mid-action and shows the premise. No intro, no logo, no "hey guys".
- Voice starts by 0.4 s. The first line is the question in under 8 words, concrete and visual ("What happens if you break your knuckle?").
- Prefer premises with a body, danger, money or time stake. Numbers beat adjectives ("11 days without sleep").
- Premise lead (W46, weak evidence): "push past the limit" ("hold X too long", "won't stop", "never") and "swallowed the unexpected"
  premises are preferred when the backlog allows. Evidence: our only YouTube video still growing after day 1 (hold your pee) plus the scout's
  outliers (hold your breath 47.4x, hold your pee 49.1x, swallow-X frame). Water ("too much") had the same pattern and didn't grow, so it isn't a rule yet.
- Log the first frame: meta.json gets `first_frame` (e.g. `hero-mid-action`, `xray-organ`, `object-closeup`, `diagram`) so the analyst can compare.

## Retention
- A new visual every 2-3 s, timed to a spoken word. Camera always moving.
- Open a loop in line 2 or 3 ("but the weirdest part is what your body does next") and pay it off in the last 20%.
- Every line adds a new fact; cut any line that only repeats.
- 30-45 s target. The last line loops back to the first.
- Captions: 1-3 words, one highlighted keyword.

## Baseline to beat (YouTube Studio, 28 days to 2026-11-15, reviews/2026-11-15-studio-snapshot.md)
- Stayed to watch 56.2% / swiped away 43.8%. Target ≥65% stayed: frame 1 must show the premise AND the guess options or the strangest
  visual, never an empty room or a slow pan. Likes ~1.7% of views; 99% of viewers are new, so every video must work for a stranger.
- Audience: US 75%; ages 35–44 (30%), 13–17 (28%), 25–34 (24%). Relatable beats should fit adults (work, travel, parenting, gym)
  without excluding teens. 37% of watch time is on tablet/TV.

## Engagement (owner, 2026-11-16: several Shorts reach ~1k views, then stall → they need comments, rewatches and full watches)
Every video has all five beats. They cost no extra length (target stays 30-40 s; aim under 40).
1. **Guess beat (first 4 s):** line 2 makes the viewer commit to an answer before the reveal. Two concrete options, e.g. "Is it
   your stomach or your brain? Guess." On screen: two pills "A ..." / "B ..." pop on the options. The answer lands in the last 30%
   with the right pill getting a check. The guess question is the video's main open loop.
2. **Relatable beat:** one "you've felt this" line in the middle ("Ever had your stomach growl in a silent room?"). Specific, not generic.
3. **Re-hook at ~50%:** a line starting with a turn ("But here's the weird part...", "And that's not even the strangest bit")
   plus a clear visual change (new scene or a zoom into a new place). Never let 2 calm lines run back to back.
4. **Rewatch detail:** one small on-screen detail that rewards a second look (a tiny sourced label, a background gag, a hidden
   object that matters later). Only sourced facts in text.
5. **Loop ending:** the final image cuts back toward frame 1 (same framing/object), so the replay feels seamless. The tease line stays last.
- **Comments:** the pinned comment is the guess question with its two options ("A or B? Answer before you rewatch"), or an
  "which one are you" question. One on-screen "COMMENT A OR B" pill may appear for ~1 s during the reveal, never voiced, never in the
  first 3 s. Never "like and subscribe", never "comment below for part 2", never fake urgency (YouTube treats that as engagement bait).
- **Shares:** the description's first line may be a share prompt tied to the topic ("Send this to the friend who never drinks water").
- Log in meta.json: `engagement: {guess: "A vs B", relatable: "...", rehook_line: <n>, rewatch_detail: "...", loop: "..."}`.

## Subscribe beat
- The series name is on the end card and in the title (the publisher appends "| Body Files #N" when it posts).
- Ending hook (config `ending`): `tease_next` = the final line teases the NEXT video with one vivid detail ("Next Body File: what
  happens if you swallow a magnet") and stock posts in order (`stock.order: fifo`), so every tease comes true the next day.
  `series_cta` = "Follow for a new Body File every day". Never an episode number in the video. Never a generic "like and subscribe".
- `tease_next` stays on (E4 undecided in W46: 0 series_cta videos made, subs data on 1 video). The stocked chain must be posted in order.
- A follow pill animates in during the payoff, never in the first 70% of the video.
- Pinned comment = a question viewers want to answer ("Have you ever broken a bone? Which one?").

## Titles and descriptions
- Title = the hook question + an optional bracket ("(it's not what you think)"). Under 60 characters.
- Description: 1 line of extra fact, 1 line next-episode tease, 3-5 hashtags, then sources.

## Originality and policy (W46, from YouTube's 2026-07 monetization clarifications, research/2026-W46)
- The narrator is a curious friend, never a doctor, nurse or "expert". No "as a doctor", no white coat on the narrator, no personal medical
  advice ("you should take..."). For anything health-related, point viewers to NHS/CDC/Cleveland Clinic-type sources ("see a doctor if...").
- Vary more than the topic: each episode needs its own structure (true story, myth-bust, countdown, timeline, thought experiment...), its
  own set of scenes and its own visual idea. Don't open with the same room shot or use the same beat order several episodes in a row.
  One recurring hero and style is fine. A topic-swapped template is what YouTube calls "mass produced".
- No realistic disaster or crash footage, and no shock clips without a story (freefall, infection topics: schematic only).
- Titles must deliver what the video shows.
- TikTok caption = the meta hook line + the meta hashtags. No tool or brand tags, and never more than one post per slot.

## Never
- Copy another creator's script, visuals or exact title. Unsourced health claims. Gore. Kid-directed framing.
- Post the same video on two of our channels. More than 2 videos/day per channel.
