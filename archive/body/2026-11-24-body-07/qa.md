PASS

Round 2: all 7 round-1 fixes verified (check table + frames 2.5, 9.05, 11.7, 14.5, 21.3, 23.6, 26.9, 33.57). CHECK OK, 33.57 s.
- S10: vessel ends ~y1100, clear of caption (top ~1245); label leader on the vessel.
- S11: finger bottom ~y935/vessel tail ~970, clear of pills (top ~1015).
- Captions now start on their words: TWELVE PERCENT 11.61 (pill 11.66); every cut is within 0.03 s of the caption change (S02 2.56 vs 2.61 caption, S05 8.99/9.01, S12 26.85/26.87).
- S07: '=' no longer hidden (arrow tip grazes its bottom edge at 14.5, cosmetic only).
- Loop seam, hook, facts unchanged from round 1 (all pass).

Previous round 1 notes below (superseded):

Round 1. Checked: sheet (0.5 s step), full frames at 0.0, 0.5, 11.7, 14.8, 20.77, 21.3, 23.6, 26.75, 33.57, `capture.mjs check` caption table, shots.js, meta/script sources.

## PASS items
- Hook: frame 0 and 0.5 show pruned hand, 5 MIN timer, duck, A/B pills; caption "WHAT HAPPENS" is on by 0.35 s. Meta engagement.first_frame matches (STOP 8). Line 2 has "5 MINUTES".
- Length 33.57 s. CHECK OK.
- Loop: t=33.57 vs t=0.0 hand, timer, duck position, water and camera scale match (only planned swaps: pills -> BODY FILES/+FOLLOW, duck flipped, NEXT stitch badge). No black.
- Tease starts exactly on "Next" (28.94); nothing earlier. Pills/badges in S01, S03, S13, S14 sit >=95 px above caption top.
- One yellow word per chunk everywhere; captions spell-correct and match the voice (except item 3).
- Facts match sources: five minutes (Conversation), 12% marbles (Newcastle 2013), "OTHER STUDY: NO DIFFERENCE" (Haseleu 2014), same pattern 24 h+ later (Binghamton 2025), cut nerves = replanted/denervated fingers (Hsieh 2006, Tindall 2006). S12 nerve-cut icon is schematic, no gore. No medical advice. Wd() word matches OK (no hour/hours issue); reveals in S02/S03/S05/S08-S13 land on their words.

## FIX LIST (all required)
1. S10, 20.74-23.14 (shot start 20.74 onward, whole shot). The red vessel tail (y ~1245) touches the top of the caption ("THE BLOOD VESSELS", top ~y1245), and the yellow glow at 21.3 reaches it. Change TIP = [540, 640, 0.78] to roughly [540, 560, 0.70] (tail then ends <= y 1150), keep the "blood vessel"/"SAME SPOT" label positions clear of the outline (label at 830,300 sits on the right outline bar; move it to x ~870 or shorten leader so it ends on the red vessel, not the nerve).
2. S11, 23.14-26.68 (seen at 23.6). X-ray finger outline bottom (y ~1020) touches the top of the B NERVES pill, and the nerve/vessel tails run down to y ~1055 beside the pills. Raise the finger: change bathTipXray(540, 560, 0.66, ...) to (540, 500, 0.62, ...) so the whole body ends >= 40 px above the pills (pills top ~1015). Keep the "nerve" label (820,420) clear.
3. S06, 11.66 (+12% pill) vs caption. Voice says "twelve" at 11.66 and the +12% pill pops at 11.66, but caption "*12% FASTER" only starts at 11.95 ("MOVED WET MARBLES" is still shown, 0.29 s late; the 12% token is matching "percent" at 12.00 instead of "twelve"). Fix the caps so the chunk begins on "twelve": e.g. caps "...MOVED WET *MARBLES | *TWELVE PERCENT | FASTER" is too long, so use "ONE *STUDY | *WRINKLY FINGERS | MOVED WET *MARBLES | *12% FASTER" only if the aligner maps "12%" to "twelve"; otherwise write the caption word as "TWELVE%" or spell "TWELVE PERCENT *FASTER" in the caps field. After the change `capture.mjs check` must list that chunk starting <= 11.66. Alternatively delay the +12% pill to the caption start (Wd('percent')) but the caption fix is preferred.
4. S01->S02 cut, 2.42. Previous chunk "IN THE BATH?" lingers to 2.61 = 0.19 s over the new S02 scene (limit 0.1). Also S03->S04? no. Fix: start S02 at the first caption start instead of L(1)-0.08, i.e. const st = Wd('about', 1) - 0.1 (about 2.56) in S02, and keep the S02 fv/mi/pr offsets (they are relative to st). Check S01 then runs 2.56 (the hand just keeps rising, fine).
5. S04->S05 cut, 8.90. "AROUND THE TUB?" lingers to 9.01 = 0.11 s past the cut. Same fix: S05 st = cut(3) -> Wd('one', 3) - 0.07 (about 8.99) or shorten the S04 outro by delaying that cut to 8.98 (sd/wr offsets are relative).
6. S11->S12 cut, 26.68. "AND SKIN BUCKLES" lingers to 26.87 = 0.19 s over the two-hands scene (visible in the 26.75 frame: caption about buckling over "NERVE OK/CUT" hands). Fix: S12 st = Wd('fingers', 8) - 0.07 (about 26.85) instead of cut(8), or hold S11 until 26.85 (the buckle burst finishes by then). Keep S12's fi/cu/sm offsets relative.
7. S07, 13.9-14.8 (seen at 14.8 and in the sheet at 14.25/14.75). The flow arrow on the left of the tyre (x ~560-600, y 600) sits on top of the yellow "=" (545, 610) and hides half of it (overlapping tags hiding content). Fix: in the arrow loop skip the left arrows of the tyre (x0 === 790 && dir === -1), or move "=" up to y 420 between the two objects.

## Notes (not blocking)
- S02 resets wrinkles on purpose, accepted: the sheet shows the timer counting 0 -> 5 MIN on "five/minutes", wrinkles back on "prune".
- 20.77 shows a grey washed mid-fade into the x-ray scene; accepted as the film transition, but with fix 1 it should not coincide with the caption top contact.
- COMMENT A OR B pill (S11, top y150) is clear of the caption; okay.
- After fixes: re-run `node tools/capture.mjs check` (must say CHECK OK, duration still ~33.5) and cues/mix, then re-QA 2.4-2.7, 8.9-9.1, 11.6-12.0, 14.2-14.8, 20.8-23.6, 26.6-27.0.
