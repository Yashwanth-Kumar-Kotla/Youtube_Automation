# QA: 2026-11-10-body-8 (body, inside-out), "What Happens When Your Ears Pop?" (36.37 s)

PASS

## Checks run
- Fresh contact sheet: `node tools/capture.mjs sheet review/all.jpg 0.5 10` (73 frames, every 0.5 s).
- Dense render-safety pass: scratchpad dense8.mjs (copy of dense7 pointed at body-8), check mode drew every 1/120 s frame 0 to 36.37 s. 0 errors, no console logs, CHECK OK.
- Full-size frames in review/full: 0.5, 1.0, 1.6 (hook); 3.8 (hidden tube); 9.3; 12.0; 13.4; 16.3 (can't move); 20.2; 23.0 (the twist: pop); 24.3; 25.1; 27.6; 28.6 (CTA: see a doctor); 32.76, 33.2, 33.76, 34.3, 35.6 (end card); 36.36 (last frame).

## Hook
- At 0.5 s the hero has his hand to his ear and the ear-to-throat lens is up. Caption "WHAT HAPPENS WHEN" starts at 0.35 s. At 1.6 s you see the POP! star, the wide-eyed hero, the yellow ring on the ear, and "YOUR EARS POP?". Nothing is static or empty in the first second.

## Captions
- 41 chunks, each with exactly one yellow word. The shortest is "CHEWING GUM" (24.75 to 25.23 s, 0.48 s), then "LINKED TO YOUR" (0.49 s). Every chunk is at least 0.4 s. The regrouped lines 4-5 (index 3-4) are fine. Each chunk starts on or just before its first spoken word.
- Spelling is correct throughout. On-screen labels: HIDDEN TUBE, EARDRUM, POCKET OF AIR, THROAT, TUBE, SHUT, CAN'T MOVE, ? DAYS, CALF MUSCLE, NEXT, BODY FILES, + FOLLOW. All sit above y 1250 and none overlap the caption or each other.

## Timing (reveals land on their word)
- POP! star appears after "pop" (2.38). HIDDEN TUBE label on "tube" (3.06). Glow and bubbles on "opening" (3.52). EARDRUM on 5.98. POCKET OF AIR on 6.78 (not yet visible at 6.75). THROAT on 8.42. TUBE on 9.18. SHUT on 10.78.
- Plane on "plane". Pressure arrows on "pressure". CAN'T MOVE on 16.06. Muffled "?" on "muffled". Yawn on 20.14. Air bubbles on "air". POP! and the eardrum snapping flat on "pop" (22.88). Equal arrows and check on "evens".
- Ache marks on "sore". Calendar on "days". Doctor badge on "doctor". Calf lens and NEXT on "charley". Knot on "strikes". CALF MUSCLE on "calf". Nothing appears before its cause.

## Facts (script.json sources)
- Every spoken claim is covered by the sources: the tube opening makes the pop (Indiana); air-filled middle ear behind the eardrum linked to the throat (Mayo, Cleveland); the tube is normally shut (Cleveland, Indiana); pressure changes faster than the tube can adjust (Mayo); the eardrum can't move as usual, so hearing is muffled (Mayo, Cleveland ETD); swallowing or yawning opens the tube and air enters to equalise (Mayo); gum works (Mayo, Cleveland); see a doctor if it lasts a few days (Mayo).
- meta.json description: every claim is in the sources, including "stays shut until you swallow, yawn or chew" (Cleveland) and "more than a few days, or is severe" (Mayo). The tease, "sudden cramp that grabs your calf", matches Mayo Muscle cramp.
- The only medical advice is "see a doctor". No gore: the calf knot is an icon and the muscle is a clean diagram.

## End card
- BODY FILES badge, calf lens with the knot, NEXT pill and + FOLLOW are on the left/top. The window is on the right and nothing covers it. The hero only watches (brows up, no pain face) and ends on a warm grin (35.6 s). The layout is uncluttered.
- The last frame (36.36 s) is the engine's standard fade to black under the final caption. That is expected.

## Fix list
None blocking.

Optional polish (do not re-run QA for these):
1. S15-S17, 31.3 to 36.4 s: the calf muscle oval sits on a thin white stick (the tendon), so the lens reads a bit like a lollipop. If you touch the kit, make the tendon skin-toned or thinner where it meets the heel.
2. S10, about 20.15 s: for a few frames the hero's arms pass through a short "stub" T-pose before they stretch up into the yawn. Starting the arm raise from the elbows, or shortening the in-between, would hide it.
