PASS
# QA: 2026-11-23-body-1 (Body Files, inside-out) - PASS (re-checked after fixes)

Checked: regenerated sheet (review/all.jpg, 57 frames) + full frames at 0, 0.5, 13.75, 19.25, 22.75, 27.5, 28.29. `capture.mjs check` = CHECK OK, duration 28.30 s.

## Passes
- PERF s7: first frame carries the hook (eye close-up, ink pill with yellow 8 /sec, lid ticks); meta engagement.first_frame matches; STOP 8 ok.
- Line 2 has a concrete number ("up to eight times a second", caption 8). TEST 9: 28.3 s (25-30). TEST 10: S11 returns to the same eye/counter, replay reads "...But first, what happens...".
- loop:true works: frame 0 is cream, not black; last frame (28.29) matches frame 0 almost pixel for pixel (same eye/pill/ticks), clean cut. Only differences are the NEXT chip + end-card pills, which is acceptable.
- Hook by 1.0 s: premise + "WHAT HAPPENS / WHEN YOUR EYELID" captions on screen. Frame 0-0.4 s has no caption (lead 0.4 s, voice starts 0.40) but is not empty or static.
- Reveals land on words: counter 0->8 with "up to eight", WEEKS/MONTHS tiles with their words, "THE TWIST" calendar, TRIGGER? pill, moon/coffee/stress/screens, A WEEKS tick on "Weeks.", doctor on "Spreading/Lingering".
- One yellow word per caption chunk; lines 4 and 6 captions correct (*WEEKS. MOST, *FADE ON, *HAD IT, *FLICKER THROUGH); spelling right. Pill is ink with yellow 8 (no cyan).
- Facts match script.json sources (3-8 Hz, lower lid, nerves, weeks, see a doctor if spreading/lingering). No gore, no medical advice beyond eye doctor. S05 tile lid ring tiny: fine.

## Fix list
1. S11, 26.75-28.30 (must fix): the "BODY FILES" and "+ FOLLOW" pills (y about 1190-1253 at 1080x1920) touch/overlap the top edge of the caption stroke ("BUT" top about y 1245, x 380-705 reaches both pills' inner ends) and sit on the hero circle's bottom rim. In src/shots.js S11 change badge(290, 1222, ...) and K.followPill(820, 1222, ...) to y 1140 (about 80 px higher; the 8/sec pill, NEXT chip and eye are clear above). Keep them out of the key zone of the eye (iris/lower lid).
2. S09 -> S10 cut, 22.75-22.85 (small): the S10 sneeze badge is already fading in (washed, grey, no doctor) while "EYE DOCTOR" is still being spoken (word ends 22.85); the doctor shot disappears before the CTA word finishes. Move the S10 `at` to 22.85 (the "Next" word start) and hold S09 until then, or make sure the doctor is still visible at 22.75. Re-run check.
3. S01/S11 counter (small, optional): pill reads "8 /sec" flat while the script says "up to eight"; AAO range is 3-8 Hz. Prefer "up to 8 /sec" or "3-8 /sec" if it still fits the pill, otherwise leave (hook number is the experiment arm).

Re-run QA after fix 1 (only S11 frames 26.75, 27.5, 28.29 need re-checking).

## Re-check after fixes (final: PASS)
1. S11 pills now at y about 1108-1172, clear of caption (starts y 1245) at 26.75, 27.5, 28.29; last frame still matches frame 0. Fixed.
2. S09 doctor scene holds at 22.7 with "EYE DOCTOR"; sneeze badge fades in at 22.9 on "NEXT BODY FILE". Fixed.
3. Counter left as "8 /sec" by decision (experiment arm). Accepted.
CHECK OK, 28.30 s.
