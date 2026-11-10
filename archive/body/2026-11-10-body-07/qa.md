PASS

QA round 2, body-7 "What Happens If You Knock Out a Tooth?" (33.13 s, 15 shots). Fresh sheet: review/all.jpg. Full-size frames are in review/full/.

## Round-1 fixes verified at full size
1. S10 milk (20.95, 22.6 s): the milk is now opaque cream-white under a neutral #EEEAE2 empty band. The MILK carton pops in on "milk" (20.88) and stays clear of the FIBERS tag and the caption. The milk reads as milk, not water. OK.
2. S11 spit cup (23.95 s): pink band, frothy off-white liquid with bubbles. It no longer reads as water. The checks land on "or" and "spit". OK.
3. S12 (25.3 s): the hero points level right at the dentist badge (810, 850). The badge stays clear of the window and above the caption. OK.
4. S03 (7.3 s): the fridge side-wall strip and hinge nubs are in place, and the open door reads as attached. OK.
5. S01 (1.0 s): a curious head tilt and brow raise on "happens". The premise, the gum lens and the caption are on screen by 0.5 s. OK.

## Regression scan
- `capture.mjs check`: CHECK OK. The dense pass (dense7, every 1/120 s, about 3,980 draws) found 0 errors and 0 console errors.
- Captions: unchanged. All 38 chunks are at least 0.4 s (the shortest is 0.41 s), each has exactly one yellow word, the spelling is right, and the timing is on the spoken words.
- The whole sheet matches round 1 apart from the five fixes: every reveal is on its word, nothing appears before its cause, and nothing overlaps the caption zone or a label.
- Facts match the script.json sources, including the meta.json "Baby teeth are not put back" (Cleveland Clinic: "Baby teeth aren't re-implanted"). There is no gore and no face injury, and the hero is never hit. The only advice is the sourced first aid plus "see a dentist".
- End card: the ears-pop tease (ear-to-throat tube, airplane, NEXT, +FOLLOW) is not cluttered and is clear of the window. The hero ends with a warm grin.

## Fix list
None.
