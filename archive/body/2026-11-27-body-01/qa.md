PASS

Round 2: fixes 1-3 verified in full-size frames (review/v2). Round-1 notes follow for the record.
- 10.25 s: HALF AWAKE pill now y~385-478, caption top ~1248. It is clear of the skull (top ~540) and the phone (left edge 817 vs pill right edge 711).
- 26.5 s: feet end ~1138, caption top 1248 (gap 110 px). 28.3 s: feet ~1170, caption top ~1320.
- 28.3 s: arrow no longer touches the 1ST ALARM pill and is inside the frame (right edge ~1032). Its left tip is within ~10 px of the GET UP pill's right edge; this reads as attached, not a collision, so it is accepted. Optional nudge: AX+185.
- 17.3 s: the moon is still partly off the left edge. This is the push's natural exit during the last ~0.5 s of S09, decorative only, so it is accepted (not blocking).


Round 1. Three small, cheap geometry fixes. Everything else passes.

## Fix list (exact)
1. S05, 10.1-10.8 s (src/shots.js ~line 141): `K.pill('HALF AWAKE', 470, 1110, 54, ...)` has its bottom at ~y1205, caption top ~y1248 (about 43 px gap, rule is 80). Move it above the skull: y 1110 -> 450 (x 470 stays). Brain/head top is ~y540, so it is free there.
2. S14, 26.2-28.7 s: doctor's feet end ~y1190 at 26.5 s (caption top ~1248, gap ~58 px; ~1225 at 28.3 s). Raise the doctor: DY 780 -> 730 (floor rect follows DY). EXPERTS pill is fixed at y320, still clear of the head.
3. S14, 28.0-28.7 s: the yellow up arrow (flowArrow at AX+200, 900) overlaps the corner of the "1ST ALARM" pill and its right edge reaches x~1065 of 1080. Move the arrow to AX+170, y 880 (and/or move the 1ST ALARM pill y 990 -> 1020).
4. Optional, S09, 17.12-17.5 s: the moon is clipped by the left edge in the push (visible in the 17.25 s sheet frame). Move `moon(140, 400, 1)` to `moon(230, 400, 1)`.

## Checks passed
- Hook: frame 1 (0.5 s) shows the hero mid-slap on SNOOZE, the "56% OF NIGHTS" tag, A GROGGIER / B SHARPER pills and the caption "WHAT HAPPENS". Nothing is empty in the first second (the caption starts with the voice at 0.4 s, and the picture is complete from 0.0 s). Phone is small but readable, "Snoozed x3" fine print is intentional. The arm is stretched but reads as a slap, no fix needed.
- Line 2 has a number (fifty-six percent), with 2% -> 52% -> 56% counters synced to the spoken words.
- Loop: last frame (33.0 s) matches frame 1 exactly (same bed, window, phone, tag and pill positions and scale, no black). The end-card badges (BODY FILES, FOLLOW, NEXT and the hangry badge) are the channel convention. Length 33.019 s, as required.
- Audio spot-check of data/narration.wav (silence_end markers) against the corrected words.json: In 2.16 (silence ends 2.160), Groggier 5.98 (5.973), snooze 17.70 (17.697), Answer 22.92 (22.923), "in" 24.04 (24.064; sharper ends ~23.73), Experts 26.20 (26.214), Next 29.04 (29.047), Still 31.06 (31.067). All land within ~20 ms. The director's corrected timings are right. The original ones were late/zero length.
- Reveals land on their words: check on B at "sharper" 23.26, bell and burst on "twist", LIGHT SLEEP on "light", DREAM-RICH on "dream-rich", 1ST ALARM on "first", NEXT pill at 29.07 (starts on "Next", not before).
- COMMENT A OR B is on screen from ~23.5 to ~24.8 s (about 1.3 s).
- Captions: exactly one yellow word per chunk, spelling right, text matches the voice. Chunk boundaries sit on word starts (check output CHECK OK). No caption runs past a cut.
- Other tags and pills (YOUR NIGHT, LIGHT SLEEP, DREAM-RICH, UP TO 1 HOUR, SLEEP INERTIA, the A/B pills) clear the caption zone by 90 px or more. No label hidden behind an object.
- Facts match script.json sources: sleep inertia 15-60 min (visual "UP TO 1 HOUR", voice "up to an hour"), ~56% of nights (Robbins 2025), 31 regular snoozers / 30 min / "a lab test of regular snoozers" hedged (Sundelin 2023), "NIH: MOST DREAMING" (NINDS). Advice is attributed to "experts", with no medical advice. No gore.

After fixes 1-3 (and 4), re-run `node tools/capture.mjs check`, cues and mix, then I'll re-check the three frames (10.25, 26.5, 28.3 s).
