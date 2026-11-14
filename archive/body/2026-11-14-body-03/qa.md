PASS

QA round 2. Fix 1 below is applied: the NERVE tag x went from 150 to 215 (src/shots.js line 127). The NERVE pill now keeps at least 53 px from the left edge (61 px at 10.0, 54 px at 10.3, 53 px at 10.55), and it stays clear of the nerve and its leader line. The re-run every-frame check says CHECK OK, and a scan of the fresh contact sheet shows no other changes. The optional items are not required.

QA for 2026-11-14-body-3 ("What Happens When You Blush?", body, inside-out, 35.42 s, 17 shots)

What I checked
- Ran a fresh contact sheet (review/all.jpg, 71 frames) and looked at 35 full-size frames in review/qa/ (0.5, 1.6, 2.7, 3.1, 3.3, 4.3, 5.0, 5.3, 6.6, 9.4-10.55, 11.1, 12.3, 14.8, 21.0, 22.3, 23.4, 24.4, 25.1, 28.2, 31.0, 32.7, 33.9, 35.0, 35.4).
- Re-ran the dense every-frame check myself (scratchpad dense_b3.mjs, ROOT = this folder, 1/120 s steps): CHECK OK, no errors.
- Captions: all 37 chunks are at least 0.40 s long. The shortest is "IT CAN LOOK" (23.71-24.11, exactly 0.40 s). Every chunk has exactly one yellow word, every chunk starts on a spoken word, and the spelling is right.
- Hook: the hero is already blushing with a sweat drop from frame 1, the caption is on at 0.35 s, and the yellow cheek rings land on "blush". Passes.
- Reveals land on their words: 1/2/3 numbers (hit/three/places), the collar opens on "hides" with its ring on "shirt", the meter on "strong", the heart on "affection", NERVE on "nerves" (9.32), BLOOD VESSEL on "vessels" (10.32), the face ring on "face", the vessel widens on "open/wide", DARKER on "darker" (24.16), RED on "red" (24.92), the check on "own", the saliva drop on "watering". Passes.
- Facts match both sources: three places (cheeks, neck, upper chest); embarrassment or affection; nerves make the vessels open wide and flood the skin, involuntarily; in some people it spreads down the neck to the upper chest; on darker skin it can look darker, not red; it fades once you relax. Every claim in the meta.json description is in the sources, and so is the tease (excess saliva). No gore and no medical advice.
- Taste: S03 is a separate diagram figure, and the collar opens only to a small V at collarbone level. S11 shows only a scoop neckline. Both are appropriate. The S12 skin-tone faces are equal in size and both smile in matching lenses, with neutral DARKER/RED pills. That is respectful.
- Director's notes are acceptable. In S04 the shock lines sit below the window and touch nothing. In S14-S17 the hero's head overlaps the window edge, which matches earlier end cards.
- End: the hero gives a warm grin and + FOLLOW pops in at 35.0. The end card is uncluttered: boat, queasy face, saliva drop, no vomit, and NEXT.

Fix list (blocking, round 1; resolved in round 2)
1. S06, 9.95 s to 10.56 s: the NERVE pill drifts past the left edge of the frame as the camera zooms (zoom 0.08). From about 10.0 s its rounded left end is cut off (the pill's dark pixels start at x=0). In src/shots.js line 127, change `K.tag('NERVE', 150, 790, 318, 615, 54, pop(lt, ne));` to `K.tag('NERVE', 215, 790, 318, 615, 54, pop(lt, ne));` (or reduce S06's zoom) so the pill keeps at least 24 px of margin through the end of the shot. Re-check frames 10.3 and 10.55.

Optional polish (non-blocking, do it in the same pass if it's cheap)
2. S11, 20.9-21.3 s: the yellow neck ring's top edge covers the diagram woman's mouth. Move the ring centre about 25 px down, or make it slightly smaller, so the mouth stays visible.
3. S03, 4.5-5.4 s: the opened lapels draw semi-transparent, so the V edge of the shirt shows through them. Draw the lapels opaque, above the red V.
