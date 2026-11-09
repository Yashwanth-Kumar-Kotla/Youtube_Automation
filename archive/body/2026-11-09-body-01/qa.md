PASS

QA round 2 · 2026-11-09-body-1 "What Happens If You Hold Your Pee Too Long?" · inside-out · 40.05 s, 17 shots
What I checked: capture check (CHECK OK), a fresh contact sheet review/all.jpg (one frame every 0.5 s, the whole video re-checked), and full-size frames in review/qa/ at 0.5, 1.0, 4.6, 9.6, 13.4, 19.8, 21.9, 26.4, 27.4 (twist), 30.4, 34.0, 35.75, 36.6, 38.9 (CTA) and 39.95 (last frame).

## Round 1 fixes, verified
1. **S01 hook.** The hero is at y 1000 / s 1.2, frowning and squirming with both hands on his belly from frame 0, and the hands are clear of the caption. The toilet thought bubble is up by 0.5 s and the caption is on by 0.75 s, so the premise and a caption are both showing before 1.0 s. Wide eyes and shock lines land on "long".
2. **S12/S12b.** The storm is now outside the window (stormWindow). The bolt is small, sits fully inside the window glass and flashes on "struck". It is about 400 px from the hero, who stays at the far left and only reacts. He is never struck or near the bolt. Splitting S12 also fixed the 3.59 s shot length.
3. **S12c end card.**
   - NEXT and FOLLOW sit at y 1110, clear of the hero's arm and the caption.
   - Accepted deviation: the FERN tag at (470, 620) is fully in frame. It sits between the hero's head and the window, touching neither, and its leader line hits the patch cleanly.
   - Accepted deviation: the fern patch at (720, 880) is clear of the window and the pills.
4. **S06 and S10.** The hero is at y 1000 and the hands-on-belly pose is clearly above the caption.
5. **S04.** The "1 CUP" pill at (500, 1000) is clear of the caption, and the nerve now grows out of the bladder wall.
6. **S07.** The arrow and warning no longer collide (gap of about 170 px), and the UTI pill (y 1040) is clear of the caption.
7. **S08.** The stretch arrows are fully in frame. A stopwatch replaced the calendar, so there is no made-up timeline and nothing covers the ureters.
8. **S02.** The measuring cups are fully in frame and hold blue water with "1 CUP" marks, so they no longer read as beer. The duplicate 2 CUPS pill is gone.
9. **Non-blocking items from round 1 are all done.** home() gives one room everywhere, with the plant and picture removed. meta.json no longer has the "two inches to six" claim.

## Whole-video regression scan
- **Reveals on their words:**
  - S03: POP? on "pop", pause on "hold".
  - S05: rings on "two", squeeze on "clamp", SHUT on "shut".
  - S06b: germs on "bacteria"/"grow".
  - S09/S09b: HEALTHY on "healthy", red X on "rare".
  - S11: ring on "all", clipboard on "doctor", FAST on "fast".
- **Collisions:** nothing intrudes into the caption zone (y 1250-1550), and no labels collide.
- **Captions:** every chunk has exactly one yellow word, and the spelling is right.
- **Facts:** two cups, about one cup for the first signal (200-350 mL), two sphincters, UTI risk, overstretching/weakening/incomplete emptying, and bursting being rare all match the script.json sources. The tease (fern pattern on the skin) matches the PMC source.
- **Safety:** no gore. The only medical advice is "see a doctor fast" for when you can't pee at all.
- **Last frame:** a clean fade, with the end card readable.

## Optional polish (not blocking)
1. **S07, 19.4-20.0 s.** As the camera pushes in, the warning triangle's right corner gets cut by the frame edge (about 15 px). The triangle and its "!" stay fully readable. If the shot gets touched again, move K.warning to (850, 330).
