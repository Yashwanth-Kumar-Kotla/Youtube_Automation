PASS

# QA round 3 (final): 2026-11-16-body-2 "What happens when you drink an energy drink?"

The round-2 S12 patch is applied and verified.

- **Files:** `src/shots.js` is byte-identical to the patch I tested (scratchpad b2r2). `src/core/kit.js` is unchanged from the
  round-1 tested copy.
- **Check:** `capture.mjs check` gives CHECK OK at 38.03 s. The shot boundaries are unchanged: S11 runs 21.98-24.20, S12
  24.20-27.53 and S13 from 27.53, so there is no gap.
- **Cues:** 76. In S12 they fall at:
  - whoosh 24.199 (the cut)
  - adult pop 24.229
  - slam 25.50 on "FDA"
  - thud 26.42 on "four"
  - boing 27.08 on "day"
- **Mix:** mix.wav is 38.13 s, which is the 38.03 s duration plus mix.py's fixed 0.1 s tail.

## Window 24.1-24.7 (review/qa3/)
- **24.15:** S11 is intact. The jittery hero, the three cans and the heart badge sit under "A RACING HEART".
- **24.25:** just after the cut flash, the adult icon is already popping in under "MOST ADULTS?".
- **24.35 and 24.6:** the adult is fully in, under "MOST ADULTS?". "Adults" is spoken at 24.52.
- **Result:** the 24.20-24.42 blank frame is gone. Nothing appears before its cause, because the line opens on "Most adults".

## What else the patch could touch
The patch only changes the adult's pop time and its cue. The other S12 beats are tied to words, so they did not move:
- the FDA stamp on "FDA"
- the 400 card sliding in from the right on "four", which stays clear of the stamp (round-2 frames 26.25, 26.4 and 26.6)
- the wiggle on "day" (27.0)

## Still holding
- **Round-1 fixes:** all 8 still hold (see the round-2 re-verification below).
- **Engagement beats:**
  - Hook frame and caption are in by 0.5 s.
  - The A/B guess pills pop on "quarter" and "half".
  - The clock jumps to 0:15, 0:45 and 5:00 on the spoken times.
  - The re-hook is at 19.56 s (51%).
  - The answer check lands at 28.18 s (74%).
  - The loop ends with the can back at his lips.
- **Captions:** exactly one starred word in each of the 43 chunks.
- **Facts:** FDA 54-328 mg per 16 fl oz, the "400 mg" wording, and "Experts say skip them" for kids and teens all match the
  sources.
- **Description:** the AHA caveats are present.
- **Safety:** no brands, no gore, and no kid or teen drinking. Nothing encourages teens to drink energy drinks.

## Notes (not blocking)
- The S04 and S12 shot-note strings still describe the old tag and the "drop" animation. Update them when you next edit the
  file; they do not affect the render.
- Owner note: the engine-wide 0.35 s fade to black at the end (main.js) slightly softens the loop. This is the same as on
  body-1.

---


# QA round 2: 2026-11-16-body-2 "What happens when you drink an energy drink?"

**FAIL.** One blank frame needs a 2-line fix. I tested it in a scratch copy and it renders clean.
All 8 round-1 fixes are applied and verified, and there are no regressions from them.

The blank frame is not new: it is the same in the round-1 renders, and I missed it in round 1.

What I checked:
- `src/core/kit.js` is byte-identical to my tested scratch copy. `src/shots.js` differs only in two comment/note strings.
- `capture.mjs check`: CHECK OK, 38.03 s. The shot boundaries are unchanged from round 1, with no gaps.
- cues.json has 76 cues. mix.wav is 38.13 s, which is the 38.03 s duration plus mix.py's 0.1 s tail.
- The refreshed review/all.jpg.
- Full frames in review/qa2/: 0.5, 6.70, 6.75, 7.4, 9.9, 13.0, 13.4, 13.8, 24.22, 24.3, 24.38, 26.25, 26.4, 26.6, 27.0,
  28.5, 29.0, 29.5, 30.0, 30.3, 32.3, 32.66, 36.5, 37.3.

## Fix (required)
1. **S12, 24.20-24.42: the frame is empty.** It shows only the cream background under "MOST ADULTS?"
   (review/qa2/t24.30.jpg; the sheet frame at 24.25 too).
   - Cause: the adult icon waits for "adults" (24.52 - 0.1), but the S12 cut is at 24.20, on "Most".
   - Fix: pop the icon at the cut. In `src/shots.js` S12:
     - line 290: `scaled(250, 1150, pop(lt, ad - 0.1), ...)` → `scaled(250, 1150, pop(lt, 0.03), ...)`
     - line 297: `cue(st + ad - 0.1, 'pop', { gain: 0.6 })` → `cue(st + 0.03, 'pop', { gain: 0.6 })`
   - The `ad` const stays: nothing else uses it, and keeping it is harmless.
   - Tested in /tmp/claude-0/-home-user/5ed22e54-194a-5da0-b251-cc297b3797c5/scratchpad/b2r2: CHECK OK, 76 cues, 38.03 s.
     At 24.30 s the adult is already in. The FDA stamp ("FDA" 25.50) and the 400 card ("four" 26.42) are unchanged.
   - Then regenerate the cues and the mix.

## Round-1 fixes, re-verified
1. **Dots: OK.** They now go to the left arm and upper chest.
   - 13.4 s: every dot is above y 1250, and none are under "MINUTE 45".
   - 28.5 s: all 12 answer dots are visible above "HALF IS".
   - 36.5/37.3 s: same in S16.
2. **400 card: OK.** It slides in from the right at y 800 and never touches the FDA stamp (26.25, 26.4). It has landed by
   "hundred" (26.6) and wiggles on "day" (27.0).
3. **Tag pill: OK.** It is gone. At 9.9 s the cans' own "per 16 fl oz · FDA" labels read clearly and nothing touches
   "OTHERS: 328".
4. **S14: OK.** At 32.3 s the whole X is inside the frame, and the green-shirt teen is clearly different from the kid and from
   the S12 adult. No one holds the can.
5. **COMMENT A OR B: OK.** It sits under the clock (29.0, 29.5), clear of the A/B pills, the check, the head and the frame edge.
   It is on screen for about 0.9 s from "still".
6. **Hero can: OK.** There is no unreadable label speck (0.5 s, 28.5 s).
7. **meta.json: OK.** `first_frame` and `rewatch_detail` now match the video. "Every other dot" is true: even-index dots stay.
8. **script.json: OK.** The AHA source is appended (6 sources) and the JSON is valid.

## Regression and timing scan
- **Cut flashes (6.70, 30.0, 32.66):** these are normal partial-white frames from the cut flash, not blanks.
  - 6.68-6.75: the S04 cans start dropping in about 0.07 s after the cut. That is 2 frames, which is fine.
  - 30.0-30.18: S14 shows the can alone until the kid pops on "Kids". That is not blank, and it is fine.
- **Other blanks:** apart from S12 above, there are no blank frames, and every shot has content within 0.1 s of its cut.
- **Engagement beats are unchanged:**
  - The hook frame is in at 0.5 s.
  - The guess pills pop on "quarter" and "half".
  - The clock jumps to 0:15, 0:45 and 5:00 on "fifteen", "forty" and "five".
  - The re-hook is at 19.56 s (51%).
  - The answer check lands at 28.18 s (74%).
  - The loop ends with the can back at his lips.
- **Captions, facts and safety:** unchanged from round 1, and all OK.
- **Non-blocking, cosmetic:** the S04 note still says "small tag under them", and the S12 note says "drops on four". They no longer
  match the code, so update the note strings when you are next in the file. They do not affect the render.

---


# QA round 1: 2026-11-16-body-2 "What happens when you drink an energy drink?"

The story, timing, captions and facts are good. Six small visual fixes and two meta/source text fixes are needed.
All code fixes are tested in a scratch copy (see the end). They render clean and CHECK OK.

What I checked:
- `capture.mjs sheet` → review/all.jpg (0.5 s step, 76 frames).
- `capture.mjs check`: CHECK OK, 38.03 s.
- Full frames 0.0, 0.5, 1.0, 3.6, 6.4, 9.9, 11.0, 13.4, 15.0, 17.95, 20.3 (twist), 21.6, 23.9, 26.2, 27.0, 28.5, 29.0,
  29.6, 31.0, 32.3, 33.5 (CTA), 36.5, 37.3, 37.95/38.0 (last), in review/qa/.
- words.json, the STYLE.md QA pitfalls, and the PLAYBOOK "Engagement" and "Baseline to beat" sections.
- I fetched the live FDA and AHA pages to check the facts.

## Fixes (all required)

1. **S07 12.46-13.82, S13 27.53-29.98 and S16 34.68-38.03: the caffeine dots sit under the caption.** This was director flag 2.
   Dots 16-23 move "into the thighs", which is local y 230-430, about world y 1263-1483. That is the caption zone.
   - At 13.4 s they are hidden behind "MINUTE 45".
   - At 28.5 s, about a third of the "half still in you" answer dots are behind "HALF IS".
   Fix: move those dots into the left arm and upper chest, so they stay above y 1250. In `src/shots.js`, line 39:
   `DL.push([(i % 2 ? -67 : 67) + (rnd(i + 81) - 0.5) * 60, lerp(230, 430, rnd(i + 91))]);`
   →
   `DL.push(i % 2 ? [-186 + (rnd(i + 81) - 0.5) * 16, lerp(-140, 110, rnd(i + 91))] : [lerp(-120, 120, rnd(i + 81)), lerp(-175, -130, rnd(i + 91))]);`
   Also update the comment on line 34: "later out into the left arm and upper chest".
2. **S12 26.22-26.57: the 400 card drops straight through the FDA stamp.** This was director flag 3, and it is visible in
   the sheet at 26.25. The card falls from y -400 down the x 720 lane, which is the stamp's lane.
   Fix: slide it in from the right on its own lane. In the S12 draw, line 295:
   `K.calendar(720, lerp(-400, 800, p), 0.72, '400', 'MG A DAY', lerp(-0.25, 0.04, p) + wg);`
   →
   `K.calendar(lerp(1500, 720, p), 800, 0.72, '400', 'MG A DAY', lerp(0.25, 0.04, p) + wg);`
   Tested at 26.3 s: the card is mid-slide at the right and well clear of the stamp. At 27.0 s it has landed, as before.
3. **S04/S05 6.68-10.24: the extra "per 16 fl oz · FDA" pill under the cans touches the caption.** At 9.9 s its bottom edge is
   on the outline of "OTHERS:". Both cans already carry the same readable label, so the pill isn't needed.
   Fix: delete line 144, `K.pill('per 16 fl oz · FDA', 540, 1150, 42, C.white, C.ink, tag);`. The `tag` arg becomes unused,
   which is harmless.
4. **S14 29.98-32.63: the red X on "skip" runs off the right edge, and the "teen" is the adult icon.** The X arms are cut at
   x 1080 (32.3 s). The teen is the same blue-shirt `ageIcon` that was the "adult" in S12 three seconds earlier, so it reads
   as an adult (director flag 4).
   Fix, in `src/shots.js` S14:
   - `scaled(420, 1150, pop(lt, te - 0.05), () => K.ageIcon(420, 1150, 0.68, {}));`
     → `scaled(410, 1150, pop(lt, te - 0.05), () => K.ageIcon(410, 1150, 0.7, { shirt: ['#4E9A5E', '#3E7E4C'] }));`
   - `K.energyCan(800, 820, 1.1, { label: true });` → `K.energyCan(770, 820, 1.1, { label: true });`
   - `K.doctorBadge(800, 330, 0.85, pop(lt, ex));` → `K.doctorBadge(770, 330, 0.85, pop(lt, ex));`
   - `K.redX(800, 820, lerp(1.8, 1, eo(...)), 1)` → `K.redX(770, 820, 0.8 * lerp(1.8, 1, eo(seg(lt, sk, sk + 0.2))), 1)`

   And in `src/core/kit.js` `ageIcon` (line 4030), add the `shirt` option:
   - signature `{ kid = false, queasy = 0, t = 0, sc = 1 }` → `{ kid = false, queasy = 0, t = 0, sc = 1, shirt = null }`
   - line 4034: `const [legH, ...` → `let [legH, ...`, and add right after it: `  if (shirt) [col, colD] = shirt;`

   Tested at 32.3 s: the whole X is inside the frame, and the green-shirt teen is clearly different from the kid and the adult.
   No one holds or drinks the can.
5. **S13 28.56-29.6: the unvoiced "COMMENT A OR B" pill covers the hero's left shoulder and touches the left edge** (x 8).
   Fix, line 315:
   `K.pill('COMMENT A OR B', 230, 760, 38, C.red, C.white, cm);` → `K.pill('COMMENT A OR B', 825, 330, 38, C.red, C.white, cm);`
   Tested at 29.0 s and 29.5 s: it sits in the empty space under the clock. It is clear of the A pill, the B pill and its check,
   the head, and the edge.
6. **Hero can in S01-S03, S06, S07, S13 and S16, including frame 1: the "per 16 fl oz · FDA" label is unreadable.** At scale
   0.42 it is about 60 px of 8 px text, so it shows as a white speck (director flag 1). It is not a readable rewatch detail.
   The sourced label already reads clearly on the big cans in S04/S05/S14.
   Fix, line 32: `K.energyCan(cx, cy, 0.42, { rot, label: true })` → `K.energyCan(cx, cy, 0.42, { rot })`.
7. **meta.json does not match the video.**
   - `first_frame` says the A/B pills pop in at frame 1. They don't, and they shouldn't: the options are spoken at 4.1-5.8 s.
     Change it to: `"hero-mid-action (hero mid-sip of a plain unbranded can, x-ray cyan body with yellow caffeine dots pouring in, wall clock at 0:00; A A QUARTER / B HALF pills pop on the spoken options at 4.2 s / 5.5 s)"`.
   - `engagement.rewatch_detail`: replace the clause `"...and in frame 1 the can already shows that label."` with
     `"...and the 5:00 answer frame keeps exactly every other dot of frame 1."`.
8. **script.json `sources` lacks the AHA abstract that the description cites.** QA checks facts against script.json. Append
   this entry (I verified it on the live page):
   `"American Heart Association newsroom, 'Energy drinks, stimulant products linked to cardiac arrest, heart attack in young adults' (Scientific Sessions 2026, Abstract MDP0323, Nov. 2, 2026; FDA adverse-event reports 2017-2025: caffeinated energy drinks and stimulant supplements appeared disproportionately more often in reports of serious cardiovascular events; 'research abstract... not peer-reviewed... preliminary'; an outside expert: 'the study does not prove that caffeine products cause these events'): https://newsroom.heart.org/news/energy-drinks-stimulant-products-linked-to-cardiac-arrest-heart-attack-in-young-adults"`

After the fixes: `capture.mjs check`, then cues and the mix again. In my scratch run no cue times moved (76 cues, 38.03 s), but
regenerate them anyway. Then send it back to QA.

## Checked and OK (no change)
- **Hook / frame 1:**
  - At 0.0-0.5 s: x-ray hero mid-sip, dots streaming in, clock 0:00. "WHAT HAPPENS" is on screen from 0.35 s.
  - Frame 1 shows the premise plus the strangest visual, which meets the Baseline rule.
  - The pills are not in frame 1, correctly: putting them there would show the options before they are spoken. Only the meta
    text needs fixing (item 7).
  - Nothing is static: there is a gulp bob on "drink" and wide eyes on "energy".
- **Guess beat:**
  - "A A QUARTER" pops on "quarter" (4.20) and "B HALF" on "half" (5.54). Line 2 is a real either/or with a number.
  - "A A QUARTER" is the badge letter plus the option's wording. It reads fine.
- **Answer in the last 30%:**
  - The clock jumps to 5:00 on "five" (27.88), and the B check and dimmed A come on "half" (28.18), at 74% of 38.03 s.
  - The B bump lands on "B" (29.54).
  - The COMMENT pill shows for about 0.9 s, unvoiced and after 3 s.
- **Re-hook at line 6:** "But here's the twist" at 19.56 s (51%) is a hard cut to a new place, the red inside-the-blood macro.
  The red "!" lands on "twist" and the gauge needle drops on "slowly".
- **Clock jumps on the spoken times:**
  - 0:15 on "fifteen" (10.54, the frame at 10.75 shows 0:15 flashing).
  - 0:45 on "forty" (12.86).
  - 5:00 on "five" (27.88).
  - The clock holds 0:45 through S08 and S10.
- **Loop:** S16 returns to the frame-1 framing, and in the last 0.8 s the hero lifts the same can back to his lips, the
  frame-1 pose. The tease line is last.
  - Owner note, not blocking: as on body-1, the engine-wide 0.35 s fade to black (main.js line 28) slightly softens the loop.
- **Other reveals on their word:**
  - cans drop on "cans"; 54 MG on "fifty-four"; 328 MG + 12 dots on "three"
  - wide eyes on "feel"; ADENOSINE tag on "adenosine"; Zzz on "sleepy"
  - nightstand can on "one", bubble on "late", awake on "awake"
  - shake on "Jitters", heart on "racing"
  - stamp on "FDA"
  - doctor badge on "Experts", X on "skip"
  - NEXT, BODY FILES and "?" on their words
- **Captions:** exactly one starred word in each of the 43 chunks (checked by script). Every spoken word is in order and the
  spelling is right. The shortest chunk is "ON A *LATE" at 0.42 s. No caption changes are needed.
- **Facts** (FDA page fetched today):
  - "Generally, 'energy drinks' have 54 to 328 milligrams of caffeine per 16 fluid ounces." This matches line 3 and the can
    labels.
  - "For most adults, the FDA has cited 400 milligrams a day... as an amount not generally associated with negative effects."
    The line "The FDA cites four hundred a day" is accurate.
  - "Medical experts advise against energy drinks for children and teens." "Experts say skip them" is accurate.
  - 15 min to feel it and a 5 h half-life match Cleveland Clinic. About 45 min absorption and adenosine match Harvard.
- **Description:**
  - The AHA caveats are present and match the release: preliminary, not peer-reviewed, an association, not proof, and not your
    personal risk. It ends with "See a doctor".
  - There is no other medical advice. The FDA wording is right.
  - Optional: "The FDA cites 400 mg a day for most adults" could add "as an amount not generally linked to negative effects".
- **Safety:**
  - No brands: plain navy can with a yellow stripe and no logo.
  - No gore.
  - No child or teen drinks or holds a can: in S14 the can stands apart with a red X.
  - Nothing encourages teens to drink energy drinks: the only drinker is the adult hero, and line 11 says to skip them.
- **Director flags I am not requiring:**
  - Flag 5, the car with no steering wheel: the car is about 270 px wide inside the bubble and the driver is visible, so it
    reads fine.
  - Flag 6, the "5 HOURS?" pill in S02: it pops on "later" and echoes the spoken "Five hours later". It is not an unvoiced
    claim.

## Scratch test
- Copy: /tmp/claude-0/-home-user/5ed22e54-194a-5da0-b251-cc297b3797c5/scratchpad/b2. It has fixes 1-6 applied in
  src/shots.js and src/core/kit.js.
- Results: CHECK OK, 38.03 s, 76 cues. The sheet is review/all.jpg there.
- Frames checked: review/t/ (13.4, 26.3, 29.0, 32.3), review/t2/ (9.9, 29.4) and review/t3/ (29.5).
- `diff` against the project shows only the lines above.
