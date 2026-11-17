PASS

## QA round 2 · 2026-11-17 · PASS
- src/shots.js and script.json are byte-identical to the tested scratch copy, so all six round-1 fixes are in. `capture.mjs check`: CHECK OK.
  - S08 3.08 s · S09 1.55 s · S17 1.86 s · S18 3.02 s.
  - Every shot is between 1.5 and 3.5 s except S02 (1.32 s). S02 was already that length in round 1 and is not touched by this round.
  - The line-6 caps read YOUR *CELLS | MAKE IT *NONSTOP | AND WITH *NO | *EXHALE, IT | JUST *PILES UP. Every chunk lasts at least 0.42 s.
- data/cues.json has 78 cues and its duration is 38.844. The whooshes are on the moved cuts: 18.325 (S09), 19.88 (S10), 35.82 (S18).
  data/mix.wav is 38.944 s, which is DUR plus the built-in 0.1 s tail in tools/mix.py. OK.
- Re-checked full size in review/r2/ (0.5, 18.34, 19.85, 25.5, 27.6, 35.84, 38.3 s). The refreshed review/all.jpg matches the tested sheet.
  - Fix 1 holds: the torso and all CO2 dots are above the caption in S01, S12, S13 and S18.
  - Fix 2 holds: the "?!" is fully on screen.
  - Fix 5 holds: the ring stays clear of the label.
- Cut frames 18.28–18.40 and 35.78–35.90 (scratchpad cuts.jpg plus my own frames): no blank or black frames, only the normal white cut flash and punch-in.
  - S09's ring grows from frame 1. "FEEL ENDLESS?" stays up for the first 0.16 s of S09; no word is spoken then and the next caption takes over on "But". OK.
- Nothing waits for a later word after the moved cuts.
  - S09 starts 0.12 s earlier, in silence. The ring grows at once, and the "?!" still pops on "weird" (19.08), so it is still correct.
  - S18 now starts 0.08 s before "gum". The bubble grows on "gum" and the NEXT pill pops at +0.05 s.
  - "swallowing" now plays over S17, which already shows the gum piece on the left, so picture and word still match.
- No new regressions. The round-1 non-blocking notes still apply: one label-line crossing near the right lung, the answer at 68.4%, and the engine's fade-in and fade-out.

---
Round 1 verdict: FAIL (fixed in round 2)

QA round 1 · body · 2026-11-16-body-3 "hold your breath" · 38.84 s · 18 shots · CHECK OK
I tested every fix below together in a scratch copy: CHECK OK, and I re-checked the frames at full size (0.5, 19.0, 19.85, 25.5, 27.6, 36.6 s plus a new sheet).
Five quick fixes, all in src/shots.js and the script.json caps. No re-voice. Re-run `capture.mjs check`, then `cues` + mix, because shot starts move.

## Fixes (in order)
1. **S01/S09/S12/S13/S18 (hook framing), 0.0-2.56 s and 18.3-28.2 s and 35.8-38.8 s: the CO2 pile-up sits under the caption.**
   The lower torso and its grey CO2 dots (the "it piles up" payoff and the frame-1 clue) run from y 1250 to 1420, under the caption.
   That breaks STYLE §7 "keep key action above y 1250". Move and shrink the hero; everything else (NECK, CHEST, mouth, bubble, S09 cam) follows from HERO:
   `const HERO = { x: 300, y: 1180, s: 1.15 };` → `const HERO = { x: 300, y: 1040, s: 1.0 };`
   `const GA = [140, 600, 0.42];` → `const GA = [120, 540, 0.42];` (keeps the O2 dial clear of the head)
   Tested: the torso bottom is now at about y 1240 and every CO2 dot is visible. Only the legs go under the caption.
2. **S09, 19.1-19.88 s (re-hook): the "?!" is cut off at the right edge.** With zoom 0.55 the text at x 820 is pushed off-screen; only half of "?" shows.
   `bigText('?!', 820, 560, 180, C.yellow, 0.12, pop(lt, we));` → `bigText('?!', CHEST[0] + 260, CHEST[1] - 200, 180, C.yellow, 0.12, pop(lt, we));`
   Tested: fully on screen to the right of the head (about x 650-930, y 500-750).
3. **S09 runs 1.43 s, under the 1.5 s minimum (STYLE §2).** Start it earlier, in the silence after "endless?" (line 4 ends at 18.285), so S10 still cuts in the "part: / the" pause:
   `const st = cut(5), we = Wd('weird', 5) - st;` → `const st = L(5) - 0.2, we = Wd('weird', 5) - st;`
   Result: S08 is 3.08 s, S09 is 1.55 s, and S10 is unchanged.
4. **S17 runs 1.20 s, under the minimum.** Start the end card on "gum" instead of "swallowing" (the S18 bubble grows on "gum" anyway):
   `const st = at('swallowing', 9), gu = ...` → `const st = at('gum', 9), gu = ...`
   Result: S17 is 1.86 s (33.96-35.82) and S18 is 3.02 s. The loop end and the bubble pop on "down" are unchanged.
5. **S13, 27.0-28.2 s: the yellow ring around the blood lens crosses the "sensors: acid (pH)" label.** At 27.6 s the ring strikes through "sensors: acid", which breaks "nothing overlaps a label".
   `K.hiRing(BL[0], BL[1], BL[2] + 50, BL[2] + 50, ...` → `K.hiRing(BL[0], BL[1], BL[2] + 26, BL[2] + 26, ...`
   Tested: the ring stays clear of the label.
6. **Captions, line 6 (22.05-26.08 s): the spoken words "and" and "just" are missing from the caps.** Regroup only (all words in order, each chunk ≥0.4 s, one * each, 1-3 words). In script.json:
   `"YOUR *CELLS | MAKE IT *NONSTOP | WITH NO *EXHALE | IT *PILES UP"` →
   `"YOUR *CELLS | MAKE IT *NONSTOP | AND WITH *NO | *EXHALE, IT | JUST *PILES UP"`
   Tested timings: 22.05-22.47 / 22.47-23.85 / 23.85-24.35 (0.50 s) / 24.35-25.07 (0.72 s) / 25.07-26.08 (1.01 s).

## Checked and OK
- Hook: from the first frame after the engine's 0.25 s fade-in, the x-ray hero has puffed cheeks, CO2 dots, a dark alarm bulb, the O2 dial and the A/B pills. The caption starts at 0.35 s and something moves on every word. Nothing is static.
- Guess beat: S03 pops pill A on "low", pill B on "carbon" and a "?" on "Guess". The pinned comment is the A/B question.
- Answer: "B" at 26.56 s (68.4%) and "carbon dioxide" at 27.02-27.96 s (it crosses 70% at 27.19 s). The check and the dimmed A land on "B", and "COMMENT A OR B" shows for about 1 s (not voiced, not in the first 3 s).
  This is about 0.6 s before the strict last-30% mark. It's a script-level nit and not blocking: moving it would need a re-voice and would cut into the safety line.
- Re-hook at 47%: "But here's the weird part" with a dive into the chest, then a new macro scene inside the blood. No two calm lines run back to back.
- Relatable beat: the doctor's "DEEP BREATH → HOLD IT..." bubble lands on its words.
- Rewatch detail: CO2 dots in the frame-1 chest, the O2 dial that barely moves, the "sensors: acid (pH)" label and tiny "CO2" tags on the exhaust dots. All are sourced. The small size is intended (director flag 3: OK).
- Loop ending: S18 returns to the frame-1 framing. The gum bubble pops on "down" and the hero is back to puffed cheeks. Director flag 1, the gum bubble: OK. It is the tease visual, it's family-safe and it pops before the loop. The tease line stays last.
- Director flag 5: the "CO2"/"O2" text labels are consistent and readable. The side x-ray skull is a clean outline with no gore: OK.
- Director flag 2, the leader line crossing the shoulder: a callout leader over an x-ray outline is acceptable. After fix 1 the label leader and the chest→lens pointer still cross once near the right lung. Cosmetic, not blocking.
- Every caption chunk has exactly one yellow word. Spelling is correct and no chunk is under 0.4 s.
- SAFETY: no challenge framing, no timer, no target time, no technique. The O2 dial is a level gauge, not a clock. The hero is always on dry land. The water is a schematic pool with no person in it (S15). The blackout is shown as a dial plus a screen dim (S16). Family-safe.
- Facts against meta/script sources:
  - CO2 drives the urge: HPRC/USU ("The urge to breathe is driven by a buildup of CO2") and StatPearls (arterial CO2 is the chief determinant; O2 drives breathing only in severe hypoxemia).
  - The brainstem sensors detect acid: StatPearls chemoreceptors (ventral medulla, CSF pH).
  - The diaphragm twitching: Frontiers 2021 (involuntary breathing movements).
  - Shallow water blackout "without warning": HPRC ("no panic or sense of urgency") and StatPearls SWB.
  - Gum tease: Cleveland Clinic.
  - The only medical advice is "See a doctor" in the description. OK.
- Not for this video (engine/template note): main.js fades from black for 0.25 s and to black for the last 0.35 s, so frame 0 is black and the loop seam goes through black. It's the same on every channel. Raise it at template level if frame-1 retention matters.
