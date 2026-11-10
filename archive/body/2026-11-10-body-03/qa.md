PASS

QA 2026-11-10 · body · 2026-11-10-body-3 · "What Happens If Your Hiccups Won't Stop?" (41.80 s, 20 shots, CHECK OK)
Contact sheet regenerated fresh (review/all.jpg, 84 frames every 0.5 s). Full-size frames checked: 0.5, 1.0 (hook), 3.8, 13.5,
17.9, 18.9, 20.95, 21.8, 22.3, 22.4, 22.5, 22.65, 24.9, 25.45, 26.45, 27.6, 28.3, 29.0, 30.9 (twist), 33.72, 33.78, 34.5,
38.5, 41.0 (CTA), 41.75 (last frame).

## Gate checks
- Hook: 0.4 s speech start; by 0.5 s the hero is jolting with a HIC! bubble and the "WHAT HAPPENS" caption is up; by 1.0 s
  it's "IF YOUR HICCUPS" with a wide-eyed hiccup jolt. Nothing static or empty.
- Picture matches narration, and reveals land on their word: 68 calendar on "sixty-eight" (3.72), diaphragm glow, lung ring,
  spasm, air arrows on "rushes", folds snap on "snap", HIC! burst on "Hic!" (13.44), 2 DAYS on "two", doctor badge on
  "doctors", stamp on "persistent", JUNE 1922 on "nineteen", hog scooped on "picked", the fall on "fell" (sits by about
  22.43, soft dust, no injury), dial 20 / 20-40 / PER MIN on its words, rings on "married", x2 on "twice", kids from "eight",
  calendar lands on 1990 on "ninety", bubble shrinks on "stopped", ? on "why", grey-haired grin (warm). Nothing shows up
  before its cause.
- Captions: exactly one yellow word in each of the 41 chunks. Spelling is right (HICCUPED / HICCUPING used the same way
  throughout). No prop, label or moving object enters the caption zone. All key action stays above y 1250.
- STYLE "QA pitfalls": no partial x-ray (S04/S05 show the whole body x-rayed). The hog is drawn over his hands while carried
  (no floating prop). The dial and HIC! bubbles have their own lanes. No early captions. Nothing hidden under the caption.
- Safety: no gore, the fall is comic, no hiccup home cures, and the only advice is "See a doctor". The tease's "tongue trick"
  comes from the Cleveland Clinic brain-freeze source and is only promised (no instructions are given).
- End card: BODY FILES badge, slushie, frosty brain, yellow NEXT pill, then +FOLLOW. Fades to dark at 41.75 with the last
  caption still readable.

## Facts vs script.json sources
- Diaphragm spasm, air rushing in, vocal cords / glottis snapping shut: Cleveland Clinic Hiccups and Diaphragm. OK.
- "Most bouts fade within minutes": NHS ("should only last a few minutes"). OK.
- "Past two days = persistent", 2 DAYS calendar, PERSISTENT stamp: Cleveland Clinic (>48 h = persistent; call a provider
  after two days) and NHS (GP after 48 h). OK.
- JUNE 1922: SOURCED. Smithsonian gives the accident date as June 13, 1922. Keep it.
- Picked up a hog, fell: Smithsonian quote "I picked it up and then I fell down". OK.
- 20-40 PER MIN: Smithsonian. OK.  x2 (married twice), 8 kids: Guinness and Smithsonian. OK.
- 68 YEARS, stopped in 1990, nobody knows why: Smithsonian (headline "68 Years Straight"; "for reasons unknown ... stopped
  in 1990"); Guinness (until February 1990). OK.
- "One man": no on-screen text calls him a farmer. The flat cap, overalls and farm are setting only, which fits the hog
  story. OK.

## Rulings asked for
- S07 PERSISTENT and S12b 68 YEARS repeat the caption word for word. ACCEPTED as props. The stamp is an action (it slams
  down like a diagnosis), not a text label. The S12b calendar calls back to the S02 68-YEARS calendar, so it's a recurring
  object rather than a duplicate caption. No change.
- S11 is short (1.22 s). ACCEPTED. It's a single fast flip-counter beat (1922 -> 1990) that lands on "ninety" (28.89) and
  holds about 0.35 s before S11b. It reads clearly at full size.
- data/words.txt is stale. HARMLESS. Only vendor/faceless-shorts/scripts/words.py writes it, as a debug dump. Nothing reads
  it: src/core/timing.js (captions, shots, check, cues, render) reads data/words.json only. I checked the hand-corrected
  words.json times against the narration.wav energy envelope:
  - "sixty-eight" starts at 3.72 after the "for" dip at 3.68.
  - "shut" starts at 12.60 (onset 12.62).
  - "Hic!" bursts at 13.44-13.54 after about 0.6 s of silence. The old 13.60 was late.
  - "twenty" starts at 24.00-24.02 after silence.
  All are correct. cues.json (10:38) was built after words.json (10:26), and every caption chunk in the check output
  starts on its spoken word.

## Fix list
Blocking: none.
Optional polish (do not re-run QA for these):
1. data/words.txt, no shot: regenerate it from words.json (same format as words.py line 50) so the debug dump matches the
   corrected times. It has no effect on the render.
2. S13b/S14, 37.7-41.8 s: the frosty brain, snowflake badge and NEXT pill are all stacked on the room window, which looks
   busy. If you touch it again, move the window off-frame for the end card or shift the brain 60 px down and right so the
   snowflake badge clears the window frame. It's legible as is.
