PASS

QA round 2 · 2026-11-10-body-1 · "What Happens If You Sneeze With Your Eyes Open?" · 38.97 s · 15 shots · CHECK OK
I regenerated the sheet at review/all.jpg (0.5 s step). Full frames are in review/qa2/ (2.75, 6.95, 10.5, 11.3, 12.2, 24.5, 28.0, 37.5, 38.9).

## Round-1 fixes: all 7 verified
1. S02, 2.75 s: the newspaper is already large (~770 px wide, mid fade-in) while YOUR EYES OPEN? is on screen. The near-empty frame is gone.
2. S02b, 6.95 s: the first red underline now sits just under the SNEEZE BURSTS baseline with clear space above WOMAN'S. The second underline sits under WOMAN'S EYE!. Both read as underlines.
3. S04, 10.5 / 11.3 s: a real sneeze face (> < eyes, scrunched brows, open mouth, no smile) holds through "involuntary". The CAN'T STOP IT pill at (800,720) is clear of the hero, the window and the caption.
4. S08, 24.5 s: the 6 MUSCLES pill (bottom ~y 1070) has a gap of ~175 px to the caption and sits clear below the diagram.
5. S09b, 28.0 s: the stamp (bottom ~y 1150) has a gap of ~95 px to the caption. The diagram moved up and the eyeball stays put.
6. S04b, 12.2 s: the air arrow exits at the mouth, and the spray rises from the mouth corner and cheek, attached to the face. Accepted.
7. S12, 37.5 s: the droplet (~65 px) and bubbles in the helmet badge are readable. There is no person in the helmet, and nobody is in danger.

## Regression scan (full sheet)
- No new overlaps. Each caption still has exactly one yellow word, and the spelling is unchanged and correct.
- The hook is intact. The caption is up at 0.35 s, and ACHOO! with eyes open lands on "sneeze".
- Line-2 caption timing is unchanged (IN 1882 2.77-4.17, A NEWSPAPER CLAIMED 4.17-5.07). It matches the narration pauses verified in round 1.
- Facts, meta.json description and sources are unchanged and still match. No gore, nothing leaves a socket, and there is no medical advice.
- The hero ends warm (smile at 38.25-38.9). The end card has BODY FILES, the helmet badge with NEXT, ?, the droplet on "boil" and FOLLOW.

## Fix list
None blocking.
