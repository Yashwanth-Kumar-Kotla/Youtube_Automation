PASS

QA of 2026-11-28-body-1 (channel body, style inside-out), round 1. Checked on the 0.5 s contact sheet, the full-size frames at 0.0, 0.5, 11.6, 24.6, 29.6, 32.9 and 34.63, and the cut/edge/loop captures. `capture.mjs check` printed CHECK OK.

PERFORMANCE_REVIEW section 7
- Frame 1 carries the hook: PASS. The phone voice note, the hero cringing and the A BETTER / B WORSE pills are on screen from t=0. The caption "WHAT HAPPENS" is up at 0.5 s. The first spoken word starts at 0.4 s, so nothing is empty in the first second.
- Line 2 has a number: PASS. "Eighty people" (caption "EIGHTY PEOPLE"), plus the "80" pill.
- Loop: PASS. The frame at 0.0 and the frame at 34.63 have the same phone, face and pill positions and scale, and there is no black. The final fade goes to the loop frame, not to black. The end-card badges (BODY FILES, FOLLOW, NEXT) are on in the last frame, as the channel convention allows.
- Length: PASS. 34.637 s (lines.json and cues.json), matching the 34.64 s target.

Round-1 checklist
- Caption zone: PASS. The lowest scenery is the people row at 32.9 s, which ends at y 1130, about 115 px above the caption top at y 1245. The A/B pills at the answer reveal end at y 1130 (A BETTER ends about y 1132 in the 24.6 s frame). The AIR pill is above y 1140.
- Reveals on their word: PASS.
  - The B WORSE pill pops on "worse".
  - The red X on the skull lands on "no skull", and the X on the speaker lands on "no bass".
  - The up arrow lands on "high".
  - The A BETTER check lands on "better" (23.81).
  - The hero ring lands on "them".
  - The déjà echo lands at 30.44 ("déjà" is 30.44-31.07).
  - The tease cuts in at about 29.45, the word "Next" (29.473). The NEXT badge follows it, not before.
- Labels and arrows: PASS. No tag overlaps another tag or an arrow. The BASS pill at 13.96 touches the top of the skull outline but hides nothing.
- Edge clipping at max push: PASS. The smallest margin seen is about 120 px, on the left person at 21.74 s and the dashed air path at 13.96 s.
- Captions and cuts: PASS. Each chunk starts within 0.05 s of a scene cut. None runs past a cut.
- Yellow words: PASS. Every chunk has exactly one yellow word (the `*` markers). Spelling is right, including DÉJÀ VU and HERE'S, and the caption text matches the voice.
- COMMENT A OR B: PASS, borderline. It is on screen from about 23.91 to 25.03 (about 1.1 s) with letters about 40 px tall. See advisory 1.
- Facts: PASS.
  - 80 people, secret clips of their own voice and "better" match Hughes & Harrison via ScienceDaily.
  - "may be how others hear you" keeps Bhatt's hedge.
  - "most likely never knew" keeps the hedge.
  - Skull path and bass match Scientific American and The Conversation.
  - "Nearly everyone" matches Cleveland Clinic (97%).
  - There are no gore frames and no medical advice.
- Singular/plural: PASS. No errors found.

Advisories (non-blocking, fix only if cheap)
1. S10 (answer, 23.43-25.06), COMMENT A OR B pill. Raise the font from 46 to about 56 and keep it up until `end` (25.06), by changing `out(lt, end - 0.23, 0.2)` to `out(lt, end - 0.1, 0.1)`. That adds margin over the 1 s and 40 px thresholds.
2. S02 grid (3.0-7.0 and 23.4-25.0). The "80" pill sits over 80 clip cards. The source says 80 people, with three clips each. Changing the pill text to "80 PEOPLE" removes the ambiguity. The "80" label is still the only number, but the number is in the sources.
3. S02 rewatch detail, the 3 hero-rimmed cards. They are small, but they pass the blue rim and "?" test at 24.6 s. Optionally use a thicker rim from the first frame of the grid.
4. S13 (tease, 29.57-33.1, 3.5 s). It stays alive through the brain echo, the glitch and the people row, so it passes. No change needed.
5. The warning-triangle glitch icon at 32.9 s (right of the brain) renders as a garbled red shape. Optionally make it cleaner or drop it. It is not an overlap and not a fail.
6. The cyan SKULL pill at 11.25 s sits on the x-ray film without clashing. It is fine.
- 2026-11-28 after PASS: '80' pill changed to '80 PEOPLE' (advisory 2); CHECK OK.
