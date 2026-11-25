PASS

Round 2: re-checked frames 9.4, 9.7, 20.9, 31.5, 32.6, 35.6 and 13.9 after the director's fixes; CHECK OK, 35.67 s.
- Fix 1 (S14): NEXT and BODY FILES now sit left of the window, no overlap. OK.
- Fix 2 (S09): glass reads empty (white interior), ring around it. OK (a slightly lighter strip on its right side is cosmetic only).
- Fix 3 (S04): tube ring gone by 9.7, only the ADH ring remains. OK.
- Fix 4 (S09): dry-mouth cracks now visible. OK.
- Fix 5: NHS: AIM PALE label is larger and still clear of the glass top (about 15 px). OK.
- Last frame 35.6 matches frame 0 apart from the accepted end-card badges; +FOLLOW is about 55 px from the tally title.

Round 1 report follows for the record.

Reviewed: sheet 0.5 s, full frames 0.5, 1.0, 9.5, 13.9, 20.9, 24.5, 26.7, 30.6, 32.6, 35.6. `capture.mjs check` = CHECK OK, 35.67 s (accepted).

## Passes
- Frame 1 carries the hook (mug + water glass, 6-8 tally, A/B pills, strip); frame 0 has no caption by design, first chunk 0.35. Line 2 has "Six to eight". Hook is not empty in the first second.
- Loop: 35.6 s matches 0.5 s (same positions and scale; only end-card badges added, accepted).
- Captions: one yellow word per chunk; text matches the voice and the script. Wd() matches are all per-line (water L1, count L1/L9, strong L4), no false hits.
- Reveals land on their words (check lands on "coffee" at 26.3, +1 GLASS on "counts", tease cut on "Next" at 30.5). COMMENT A OR B is visible about 1.0 s with fades (y1135, about 110 px above the caption), acceptable.
- Nothing within 80 px of the caption zone. No edge clipping seen. Pee chart is schematic and tasteful, safety card calm, no gore. Facts match the sources. "Call emergency services" is the only advice given.

## Fix list
1. S14, 31.0-33.5 s (shot at 30.54): the BODY FILES badge (`badge(540, 310, ...)`) sits on top of the night window (x628-750 overlaps) and almost touches the NEXT pill (gap about 35 px). Move the window out from behind it, or move the badge to the left, e.g. `badge(330, 310, ...)` with the window staying at x>=628, and check that the left end stays inside 40 px of the frame edge. Alternative: put the badge at y 330 and shift NEXT up to y 150.
2. S09, 19.22-21.69 s: the "empty" glass (`K.glass(220, ..., 0.75, 0, t)`) renders with a pale blue body, so it reads as a full glass while the line is about dry mouth. Make the interior white or transparent (no blue tint) when the level is 0, so it clearly reads empty. The yellow ring around it should then sit centred on the glass (it is slightly off, left and low).
3. S04, 8.9-9.8 s: the yellow ring from "short" is still on the water tube while a second yellow ring sits on the ADH messenger, so two rings compete. Fade the tube ring out by about "sends" (st+se).
4. S09, 20.9 s: the dry-mouth crack lines are very small (two tiny zigzags). Scale them about 1.6x, or add 2 more lines, so they read at phone size.
5. S01/S06/S13/S15: the "NHS: AIM PALE" label is about 22 px high (about 28 px wide per letter group at the bottom of the frame). Raise the font to about 30 px in all four places (the label is currently legible but small; the S06 one at 13.9 s, where it is the only label, is the most important). Keep it clear of the glass top (about y700) in S01/S15.
6. Optional: the +FOLLOW pill (bottom y252) and the tally title (top y296) are 44 px apart in S15. It reads fine, but if the badges are being moved anyway, shift the pill up 10 px.
