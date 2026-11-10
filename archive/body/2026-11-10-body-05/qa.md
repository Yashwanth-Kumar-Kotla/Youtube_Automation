PASS

Round 2: the blocking fix is in. script.json line 10 caps are now `NEXT *BODY FILE | WHAT *HAPPENS WHEN | YOUR *FOOT FALLS | *ASLEEP`.
Captions: "YOUR *FOOT FALLS" runs 28.59-29.29 s (0.70 s) and "*ASLEEP" runs 29.29-30.15 s (0.86 s). Every chunk is now at least 0.4 s and has exactly one yellow word.
Full frames at 28.80 s and 29.60 s look right: FOOT is yellow while the foot pops in, and on ASLEEP the Zzz is there and the NEXT pill sits clear of the window.
Render safety: `check` is OK, and a dense pass that draws a frame every 1/120 s over the whole video found no errors.
Nothing else changed. Optional items 2-4 below are still open and do not block.

## Round 1 report (for reference)

QA: 2026-11-10-body-5 (goosebumps, inside-out), 33.22 s, 13 shots. Contact sheet regenerated (review/all.jpg, 66 frames at 0.5 s).
Full-size frames checked: 0.50, 2.25, 8.30, 14.75, 19.30, 20.80, 21.40, 23.60, 25.80, 28.80, 31.00, 33.20 (review/full/).

Round 1 found one blocking issue (item 1). It is now fixed.

## Fix list (blocking)
1. S12, 28.59-28.95 s: caption chunk "YOUR *FOOT" is o## Fix list (round 1 blocking, now FIXED) s (minimum is 0.4 s). In script.json line 10, change
   "caps" from `NEXT *BODY FILE | WHAT *HAPPENS WHEN | YOUR *FOOT | FALLS *ASLEEP`
   to `NEXT *BODY FILE | WHAT *HAPPENS WHEN | YOUR *FOOT FALLS | *ASLEEP`
   (that gives about 0.70 s for "YOUR FOOT FALLS" and 0.86 s for "ASLEEP", still one yellow word per chunk, and FOOT still lands with the foot pop at 28.76).
   Then run `node tools/capture.mjs check` again and make sure every chunk is at least 0.4 s. Don't use "WHAT *HAPPENS | WHEN YOUR *FOOT": "WHAT HAPPENS" would come out at about 0.36 s.

## Optional polish (not blocking)
2. S10, 24.68-25.40 s: the new hair grows only about 15 px from the old one and looks like one doubled line. Start it about 40 px to the side of the old hair (its own lane out of the bulb) so "new hair" clearly reads as a second hair.
3. S08, 21.24-21.70 s: falling snowflakes pass over the mouse's eye and ear. Keep the snow out of the mouse's head area, for example by skipping flakes within about 90 px of the head centre.
4. S06, 14.58-15.14 s: the "hissing" mouth is very small at phone size. Make the open hiss mouth bigger (about 2x) so "HISSING CAT" shows a hiss before the puff.

## What passed
- Hook: at 0.25 s the hero is holding up his forearm, with a skin lens of lying hairs and a pointer. The caption is on from 0.35 s. On "goosebumps" (1.42 s) the bumps pop and the hero goes wide-eyed. Nothing is static or empty.
- Sync: JOB 1/JOB 2 pills land on "two"/"jobs", and JOB 2 turns yellow on "job two". The switch flips on "flips", with the FIGHT-OR-FLIGHT pill on its word. The MUSCLE ring and tag land on "muscle", and the muscle squeezes on "squeezes". Hairs stand on "stand" and bumps pop on "bumps". The cat puffs on "puffs", with arrows on "bigger". The warm layer shows on "trap"/"heat". The JOB 2 pill comes on "Job" and the mouse on "mice". Frost shows on "cold", the nerve on "goosebump", cells wake on "woke", the STEM CELLS tag on "stem", and the 2 WEEKS calendar on "two". In the tease, the ? comes on "happens", the foot on "foot", Zzz on "asleep" and pins/needles on their words. Nothing shows up before its cause.
- Captions: every chunk has exactly one yellow word, and spelling is correct. Key action is above the caption zone. Labels (MUSCLE, STEM CELLS, IN MICE, NEXT, BODY FILES, + FOLLOW) don't overlap the caption or each other.
- Hand-corrected words.json, checked against the narration.wav energy envelope:
  - Line 1, the second "two": the "t" burst starts at 4.12 s after silence at 4.08-4.10. The 4.10 timing is correct.
  - Line 7, "Job": energy from 19.16 s to about 19.40 s. Correct.
  - Line 7, "two?": silence at 19.48 s, then onset at 19.50. Correct.
  - Line 7, "In": starts at 20.30 s. The caption "IN MICE LEFT" starts at 20.29 s. Correct.
- Facts (script.json sources):
  - Cleveland Clinic covers fight-or-flight, the tiny muscle at the base of each hair, hairs standing and bumps forming, the hissing cat looking bigger, and humans mostly conserving heat.
  - NIH covers "might" have two roles, cold-exposed mice making new hair from stem cells in under two weeks, and the nerve plus muscle bridge.
  - The mice part is clearly marked as mice: the IN MICE pill sits under the box in S08, and an IN MICE header with a mouse icon stays on through all of S09-S10.
  - On-screen extras (JOB 1/JOB 2, FIGHT-OR-FLIGHT, MUSCLE, IN MICE, STEM CELLS, 2 WEEKS) all match the script and sources.
  - meta.json: every claim in the description is in the sources (piloerection, sympathetic/fight-or-flight, arrector pili, triggers including music/movies, cat, heat, 2020 Harvard mouse study, nerve bridged by the muscle, under two weeks). No medical advice.
- Tone: no gore and no lab cruelty (the mouse is smiling and shivers only slightly). The hero ends with a warm grin at the camera.
- End card: sleepy foot, pins and needles, and the NEXT pill sit below and clear of the window, with BODY FILES and + FOLLOW at the top. It's uncluttered.
- Render safety: I ran a dense pass that drew every 1/120 s over the whole 33.22 s (about 3,990 frames, 4x the 30 fps render): no exceptions, CHECK OK.
- Mix: -15.1 LUFS integrated, -1.0 dB peak.
