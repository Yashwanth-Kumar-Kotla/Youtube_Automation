# QA round 2: 2026-11-09-body-3, "What Happens If You Drink Too Much Water?" (body / inside-out, 39.52 s)

PASS

I regenerated the sheet with `capture.mjs sheet review/all.jpg 0.5 10` (79 frames) and looked at these full-size frames in review/full/: 0.15, 0.50, 1.00, 6.80, 7.10, 7.70, 8.40, 26.90, 33.00, 35.30, 36.20, 38.10, 38.60, 39.25 and 39.50. `capture.mjs check` printed CHECK OK. Cues and mix were regenerated after the shots.js edit.

## Round-1 fixes, verified
1. **S01 hook: fixed.** Glasses pop onto the tower from 0.1 s (one is already up at 0.15 s; at 0.50 s the second row is forming). The last one lands on "water" (1.92 s). The 6 pop cues use the same `ga(k)` schedule as the visuals. The first second now moves and shows the premise with its caption.
2. **S04 reveal: fixed.** A grey silhouette shows from 6.65 s and the "?" pops on "secret" (7.02 s). The real white shaker, its tilt, the grains and the burst all come on "salt" (7.58 s). Nothing gives the answer away early.
3. **S11 RARE pill: fixed.** The pill now sits at y about 140-235, clear of the first-row heads (top about 300).
4. **S14 end card: fixed.** The lens ring top (about 340) sits about 40 px below the NEXT pill. "POP!" no longer touches the lens or the window, sits above the caption zone and is clear of the right edge.
5. **Warm ending: fixed.** The shock beat on "knuckles" lasts 0.28 s. From "every day" the hero has a curious smile (frame 36.20). The "huh" on "pop" is brief, and the hold under FOLLOW to the last frame is a smile (39.25).

## Regression pass (whole video)
- **Captions.** Unchanged and on their words. The hand-corrected words.json entries are still in place: Chug 2.59-2.76, Sodium 8.22-8.62, Next 32.86-33.12. They match where the voice starts in narration.wav (about 2.58, 8.21 and 32.84 s). Every caption has exactly one yellow word, the spelling is right, and nothing enters the caption zone.
- **S02-S13b.** The same as in round 1, with every reveal still on its word. The hero never chugs: S12 is one calm sip with a heart. No gore, and no advice beyond "drink when you're thirsty".
- **Facts.** The script and the meta.json description still match the sources; neither changed this round.

## Non-blocking notes (no re-render needed)
- In S14 the "P" of POP! touches the pinky fingertip at about x 845-860 (y about 720-780). A 10-15 px nudge to the right would give it air, but it is not a label collision.
