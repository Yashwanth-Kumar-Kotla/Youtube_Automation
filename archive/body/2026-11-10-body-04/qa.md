PASS

QA round 2. 2026-11-10-body-4 (body, inside-out), brain freeze explainer, 35.37 s, 17 shots.
Fresh sheet: review/all.jpg (every 0.5 s). Round-2 frames: review/qa2/t{2.00,6.00,22.50,23.20,23.60,25.70}.jpg.
Round-1 frames: review/qa/. `capture.mjs check`: CHECK OK.

## Round-1 fixes (all 5 confirmed)
1. **S11:** `*WANT IT GONE` now shows 23.47-23.95 (0.48 s) and `*FASTER?` 23.95-24.79. Both are readable, with one yellow word each (23.6 s frame).
2. **S12:** `PRESS YOUR *TONGUE` 24.79-25.45, `TO THE *ROOF` 25.45-25.99, `OF YOUR *MOUTH` 25.99-26.87. At 25.7 s the tongue is rising
   with the arrow and the TONGUE tag is clear of the caption.
3. **S03:** `ICE *CREAM` 5.25-5.79, `CHILLS THE *ROOF` 5.79-6.65. At 6.0 s the icy palate and the scoop on the tongue match "chills the roof".
4. **S10:** the stopwatch is on the empty wall at (800, 870), fully clear of the window. The check shrinks away on "gone" (gone by 22.5 s), and the 2 MINUTES pill
   sits at y 1070, above the caption zone, and pops on "two" (on screen at 23.2 s). There is only one object at a time.
5. **S01:** the frost badge is at (150, 780), clear of the cone and the face, and pops on "freeze". The flakes and shock lines are unchanged (2.0 s frame).

## Regression scan (full sheet, 0.25-35.25 s)
- Every other shot matches round 1 frame for frame. The shortest caption chunk is now 0.44 s ("STARTS IN"). Every chunk has 1-3 words with exactly one yellow word,
  and spelling is correct.
- The hand-corrected words.json still holds. TO *LET IN starts at 12.17 and WARM *BLOOD at 12.89, both on the spoken words, and S06 still cuts at 12.14.
- Everything I checked in round 1 still holds:
  - Hook: the bite plus a caption by 0.35 s.
  - Every reveal lands on its word.
  - Facts and on-screen extras match the Cleveland Clinic and Houston Methodist sources, and every meta.json description claim is sourced.
  - No gore. The hero ends warm and grinning, and the cat is cute and puffed.
  - The end card (skin patch + cat + NEXT) is uncluttered and clear of the window.

## Fix list
None.
