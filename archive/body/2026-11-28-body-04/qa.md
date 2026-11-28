PASS
# QA body-4 "What Happens When Your Nose Runs in the Cold?" (31.54 s, inside-out)
Reviewed: sheet 0.5 s, full frames 0.5/1.0/8.3/10.3/12.4/16.8/21.9/23.3-24.25/27.2/31.5, check output, words.json, script/meta sources.
One blocking defect (two unreadable caption chunks). Everything else passes.

## Fix list
1. script.json line 0, caps: chunk "*RUNS" is on screen 1.53-1.81 = 0.28 s (<0.3 s, unreadable).
   Change caps to: `WHAT *HAPPENS | WHEN YOUR NOSE *RUNS | IN THE *COLD?` (chunk 0.81-1.81, one yellow word).
   S01 yellow ring on "nose" and drop on "runs" are driven by word times, not caps, so no shot change needed.
2. script.json line 2, caps: chunk "*HEATER" is on screen 10.17-10.43 = 0.26 s (<0.3 s).
   Change caps to: `YOUR *NOSE | IS A BUILT-IN *HEATER | FOR EVERY *BREATH` (chunk 9.41-10.43, one yellow word).
   S04 HEATER pill / fin glow stay on the word "heater" (shots.js unchanged).
   After both edits re-run `node tools/capture.mjs check` (expect CHECK OK, every chunk >= 0.3 s), then cues and mix.

## Checks that PASS
- Hook: frame 1 (0.5 s) = close-up red nose, drip, breath fog, 96% DRIPPED card, A/B pills; caption "WHAT HAPPENS" from 0.35 s. Nothing empty. STOP 8 satisfied; matches meta first_frame.
- Line 2 has a number: "ninety-six percent". On-screen 96% matches Northwestern. S02 shows 24 of 25 dripping (= 96%).
- Loop: last frame (31.5) matches frame 1 in scale and positions, no black, no push. End-card badges (BODY FILES, FOLLOW, tongue badge + NEXT) are clear of the face, the 96% card and the pills.
- Length 31.54 s accepted.
- Exactly one yellow word in every caption chunk; spelling right ("BURNED" matches the voice); caption text matches the voice.
- Chunk lengths otherwise >= 0.33 s. No caption runs past a cut (chunks end on the shot cuts).
- Caption zone: lowest pills clear it. S01 pills bottom ~y1158 (caption top ~1245, 87 px, ok); S09 B pill bottom ~y1140 (105 px); S03 A pill ~y1060.
- Reveals land on their words: B pill on "lose" (words.json lo ~8.3), A check on "wins" 22.82, gauge 1/3 reached by "third" 23.72-23.94, NERVE tag after "nerve", calendar/thermometer/doctor on three/fever/See, NEXT pill at "Next" (cut 27.11 vs word 27.16, 0.05 s, within the normal chunk lead).
- COMMENT A OR B: full size about 22.9-24.15 = ~1.2 s (checked at 23.3, 23.45, 23.9, 24.0, 24.15; shrinks only at 24.25). It does not touch the gauge, the A/B pills or the caption.
- Facts vs sources: 96% (Northwestern), nerve reflex + mouth watering (Smithsonian/Grayson), up to a third (Baraniuk), see a doctor after 3 weeks or with fever (Cleveland Clinic), tease burned tongue / taste buds regrow (Cleveland Clinic). "3 WEEKS" is in Cleveland Clinic. No other numbers or text on screen except the allowed 96% and 1/3. "WEEKS" plural with 3 is correct, "96% DRIPPED" is fine. No gore, no medical advice beyond "see a doctor".
- Director flags reviewed:
  - S12 no punch-in: fine, it is what makes the loop exact.
  - S05 hero in a T-shirt in the snow: factually harmless, visually a little off for "cold". Accepted (kit bug), advisory only.
  - S04 small label "UP TO 1/3 WATER BACK": legible on pause, clear of caption (bottom ~y1080), accepted.
  - S06 NERVE pointer: line ends ~y620 just above the right nerve ending and brushes one snowflake near y390. Not covering a label. Accepted.
  - S03 fog puffs near the right edge: inside frame, margin ok (arrow/fog reach x~950 of 1080).
  - S09 A pill over the nerve line: pill is on top and legible, nothing hidden. Accepted.

## Round 2 (after caps fixes)
Fixes 1 and 2 applied. Check table re-read: all 41 chunks are >= 0.32 s (shortest: BUT HERE'S 0.32, GLANDS 0.33, STUDY 0.36), each with one yellow word, chunk ends coincide with shot cuts, duration 31.54 s, CHECK OK.
Frame 1.5: "WHEN YOUR NOSE *RUNS" legible, one yellow word, clear of pills (87 px). Frame 10.2: "IS A BUILT-IN *HEATER" legible, one yellow word, HEATER pill follows on the word. Verdict: PASS.
