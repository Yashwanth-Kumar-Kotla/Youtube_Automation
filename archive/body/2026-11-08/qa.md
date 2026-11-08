PASS

Round 3 (supervisor): applied round-2 fixes 1,2,4,5,6 (badge y130/size44 + pops on 'Next', FOLLOW moved to (800,630) clear of arm and edge, MAGNET tag moved left, S12b camera drift reduced, DAY slot x430). Fix 3 (room plant) left as the style's stock room. Verified frames 11.3, 37.8, 38.9, 40.2, 41.6.

--- round 2 report ---

QA round 2: 2026-11-08-body ("What Happens If You Skip Sleep for 11 Days?"), 41.69 s, style inside-out.
I re-ran `capture.mjs check` (OK) and made a new review/all.jpg at a 0.5 s step. Full frames checked: 0.4, 1.0, 1.8, 11.35, 11.5, 12.2, 19.5, 30.6, 31.6, 32.6, 35.6, 37.55, 37.6, 38.6, 39.2, 40.6 and 41.6. Word times come from data/words.txt.

## Round-1 fixes: verified
- S12b: the magnet is held at chest height, the hero eyes it with a suspicious face, a "?" pops, and there is no warning triangle and no magnet near the mouth. The imitation risk is gone.
- S12: the room background is now behind the CTA, so the frame is no longer empty.
- S12: the magnet slides in from the right below the badge and no longer crosses it.
- S09: the label reads "NO GROGGIER / THAN NORMAL" and matches the NPR quote.
- S06: the DAY 5 card sits clear of the framed picture once it has landed. S04 has a small leftover issue (fix 6).
- S10: the YEARS LATER pill is at the top, clear of the picture. The stopwatch and INSOMNIA pill land at about 33.0 s, on "insomnia" (32.98 s).
- S11: the bed is fully in frame (x 720-1055, y 890-1085) and reads as a bed.
- S01: the calendar has landed by 0.4 s and the bed is visible from 0 s. At 1.0 s the frame shows the 11 DAYS calendar, the bed, a tired face and the ELEVEN DAYS caption, and the X slams on "sleep". The hook passes.

## Fixes (new problems, mostly from the S12/S12b rework)

1. S12, 37.53-39.56 s: the BODY FILES #2 badge (`K.filesBadge(..., 540, 330, 66, ...)`) covers the top of the framed picture and the top of the window (t38.60, t39.20).
   Change: move it to y 130 at size 44, so it sits above both. The window top is about y 200 and the picture top about y 300.
   In S12b (39.56-41.69 s) the badge at (540, 260, 44) still overlaps the window's top-left corner (t40.60). Move it to y 130 too, so the badge sits in the same place across both shots.

2. S12, 37.53 to about 37.72 s: the badge pops at shot start, while the "HARD PASS" caption is still on screen and before "Next" is spoken (37.72 s, see t37.55). It appears before its cause.
   Change: pop the badge on Wd('Next') (37.72) instead of lt 0.02. Keep the room background from shot start.

3. S12, 37.53-39.56 s: a potted plant floats mid-wall. The pot bottom is at about y 1390 while the floor line is at about y 1640. It also sits behind the "H" of the "HARD PASS" caption (t37.60) and right next to the "NEXT BODY FILE" caption.
   Change: remove the plant from S12. If you keep it, stand it on the floor at x 900-1030 with its base at the floor line, clear of the caption box (x 100-980, y 1250-1550).

4. S12b, 39.56-41.69 s: the "+ FOLLOW" pill (about x 665-1000, y 1160-1240) sits on top of the hero's forearm (t40.60).
   Change: move the pill to x 780-1050 y 1140, right of the arm, or above the MAGNET tag at y 690, so no part of the arm touches it.

5. S12b, about 41.0-41.69 s (last frame): the MAGNET tag drifts right with the camera and is cut off by the frame edge at 41.6 s ("MAGNET" ends at x 1080).
   Change: move the tag anchor left so the pill spans about x 680-1000, or stop the camera drift for the last 0.7 s. The whole tag must stay inside x 40-1040 through 41.69 s.

6. S04, 11.19 to about 11.4 s (minor): during its swing-in, the DAY 2 card's lower-left corner brushes the framed picture's top-right corner (t11.35). Once it has landed (t12.20) it is clear.
   Change: move the shared DAY-card slot to x 430 (from 410), or swing the card in from the right, so it never touches the picture. Apply the same slot to S06.

## Checked and OK
- Captions: spelled right, one yellow word each, check OK.
- Facts match the script.json sources.
- No gore and no medical advice.
- S12's magnet overlaps the window graphic at 39.2 s, but it is a foreground prop in front of scenery, not a label. Optional: lower it 60 px.
