# EXPERIMENTS (max one running per channel; the analyst opens and closes these)
| id | channel | question | arm A | arm B | started | videos A/B | result |
|---|---|---|---|---|---|---|---|
| E1 | body | Does a number in the hook raise % viewed? | hook with a number | hook without | 2026-11-09 | posted 4/3 (with YouTube views: 3/1; with % viewed: 0/0) | running. W46: not enough data. % viewed vs swiped isn't in our API pull, so the owner reads it from Studio (OWNER_TODO). Interim proxy: views at ~24h + avg % watched. Decide at 5+ per arm with % viewed |
| E2 | mature | Calm vs urgent hook tone | calm "doctor-friend" | urgent "stop doing this" | 2026-11-09 | 0/0 | running |
| E3 | survival | Does a choice question raise comments? | ends "What would YOU do?" | ends with series tease only | 2026-11-09 | 0/0 | running |
| E4 | all | Does a next-episode tease ending raise subs/1k and returning viewers vs. a generic series CTA? | tease_next (all videos so far) | series_cta (baseline) | 2026-11-09 | 7/0 (subs data on 1 A video) | running. W46: undecided, arm B has 0 videos. The 15 stocked videos are a FIFO tease chain, so arm B can start only at a chain break (earliest ~15 days at 1/day). Re-check in W47/W48 |

Note (W46): mature (E2) and survival (E3) are disabled, so they have no data. E4 is the channel-wide `ending` setting test; E1 is body's one content experiment.
