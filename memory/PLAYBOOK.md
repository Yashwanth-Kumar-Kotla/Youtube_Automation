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
