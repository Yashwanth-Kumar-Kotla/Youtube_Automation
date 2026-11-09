# PLAYBOOK: rules every video follows (the analyst edits this weekly; humans may too)
_Last updated: 2026-11-08 (initial version, from known best practice; no own data yet)_

## Hook (0-1.5 s): decides 70% of the outcome
- Frame 1 is already mid-action and shows the premise. No intro, no logo, no "hey guys".
- Voice starts by 0.4 s. The first line is the question in under 8 words, concrete and visual ("What happens if you break your knuckle?").
- Prefer premises with a body, danger, money or time stake. Numbers beat adjectives ("11 days without sleep").

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
- Week of 2026-11-09: every channel uses `tease_next` (experiment E4). The review decides whether to keep it.
- A follow pill animates in during the payoff, never in the first 70% of the video.
- Pinned comment = a question viewers want to answer ("Have you ever broken a bone? Which one?").

## Titles and descriptions
- Title = the hook question + an optional bracket ("(it's not what you think)"). Under 60 characters.
- Description: 1 line of extra fact, 1 line next-episode tease, 3-5 hashtags, then sources.

## Never
- Copy another creator's script, visuals or exact title. Unsourced health claims. Gore. Kid-directed framing.
- Post the same video on two of our channels. More than 2 videos/day per channel.
