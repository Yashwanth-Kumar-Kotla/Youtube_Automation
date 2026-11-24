PASS

Round 2 re-check (frames 0.0, 8.6, 11.8, 17.6, 19.7, 21.9, 33.64 in review/r2): all 5 blocking label fixes verified (ELBOW y1000, NERVE y1030, HAND y1000, BONE y1020, source pills y1030/1105 all >=100 px above caption). S01 zigzags and B pill clear and inside frame; S13 last frame matches frame 1 camera, elbow, hand and door exactly, no black; end-card pills far from caption; doorway badge ~250 px. One yellow word per caption, spelling right.

--- Round 1 notes (resolved) ---

Reviewed: sheet (0.5 s step), full-size frames 0.00, 0.50, 8.60, 14.60, 17.60, 19.70, 22.50, 28.85, 32.30, 33.64. `capture.mjs check` = CHECK OK.

## What passes
- Hook: at 0.5 s the hero's elbow hits the door, x-ray nerve, "2 FINGERS" tag and A/B pills are on screen; caption "WHAT HAPPENS" is up by 0.75 s. Frame 1 carries the premise. Pink stomach does not steal focus (the hand and pills dominate); no change needed.
- Line 2 has the number ("2 FINGERS"). The "2 FINGERS" pill is a pill, not a duplicate of an unrelated caption; it does fit the caption at 2.95 s, so it is acceptable.
- Loop: last frame (33.64) uses the same camera, hero, door casing and hand as frame 0, no black, no fade. Drift is about 30 px in elbow/face x (elbow x 800 vs 830, face 130 vs 140). Acceptable, but see optional fix 6.
- End card: BODY FILES and FOLLOW pills sit at y 240-410, caption starts about y 1250, so the gap is far above 80 px. The tease "NEXT" pill appears at about 28.7 s, on the word "Next" (28.66), not before it. Doorway shot is a doorway on screen for "doorway".
- Answer "Pinky side." starts at 22.33 s, word 76 of 105 (71%): OK. The B pill check lands at 22.4-22.5 s on the word. S10 length is fine.
- One yellow word per caption, spelling right (checked all caps strings in script.json). Facts match the Cleveland Clinic / AAOS sources. Safety line is only "see a doctor" after 6 weeks. No gore.
- Length is about 33.7 s, correct for the control arm.

## Why FAIL: labels touch the caption zone (caption top is about y 1250 on two-line captions)
1. S07, 17.1-18.5 s (ELBOW tag, `K.tag('ELBOW', 820, 1150, ...)` at about line 170): the tag bottom is at y 1250 and touches the top of "PROTECTS". Move the tag to y 1000 and shift the leader end so it still points at the bone edge. Also stagger it so it never sits right of caption line 1.
2. S08, 19.2-20.2 s (pill 'ulnar nerve: just under the skin (Cleveland Clinic)', line 195, y 1160 at size 28): it sits at y 1195-1245, directly above the caption. It is also tiny (28 px), unreadable on a phone. Move to y 1060 (inside the white band under the cross-section) and raise the size to 36, or keep it as a rewatch detail but shorten to "just under the skin (Cleveland Clinic)".
3. S04, about 8.5-9.0 s (NERVE tag, `K.tag('NERVE', 800, 1150, ...)` at line 113): the tag bottom is at about y 1235, with only about 15 px to the caption "IT'S A NERVE". Move to y 1030 (leader still ends at the elbow ring).
4. S05 HAND tag (line 132, y 1140, about 11.6-11.9 s) and NECK tag are fine for NECK; the HAND tag at y 1140 is close (the sheet shows about 60 px). Move it to y 1000.
5. S09 BONE tag (line 208, y 1150, about 21.7-22.3 s): same problem, tag bottom about y 1210, 40 px from the caption. Move to y 1020.

## Minor (fix if cheap, not blocking)
6. S13 vs S01: the hero face x differs by about 10 px and the elbow by about 30 px (frame 0 vs 33.64). Set S13 `zoom` and camera so they equal S01 at t=0, or set S01's drift to 0 in its first 0.1 s, to make the loop seam invisible.
7. S01, 0.0-1.0 s: the zigzag at the right of the "2 FINGERS" pill and the one under the "PINKY SIDE" pill are clipped by the pills. Shift the zigzag marks about 60 px right/down so they do not hide behind the pills. The B pill also covers the pinky fingertip; move the B pill about 40 px right or lower it to y 380.
8. S06, 12.2-15.1 s: the white door casing on the cream wall is low contrast (only a thin tan outline). Darken the casing outline (stroke 6 px #b9ad98) or tint the wall a bit darker.
9. S12/S13 doorway badge: the end-card badge is about 190 px. It reads, but is small; enlarge to about 250 px (keep it clear of the right edge pill NEXT).

After fixes 1-5, re-run `node tools/capture.mjs check` and re-check frames at 17.6, 19.7, 8.6, 11.8, 21.9. If those are clean this should PASS.
