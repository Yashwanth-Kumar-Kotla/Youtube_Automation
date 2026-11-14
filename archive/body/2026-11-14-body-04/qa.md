PASS

QA round 2 for 2026-11-14-body-4 ("What Happens When You Get Motion Sickness?", body, inside-out, 34.83 s, 15 shots)

Round-1 blocking fixes 1-3 are resolved. Optional items 4-6 from round 1 are also done.

What I checked
- Made a fresh contact sheet (review/all.jpg, 70 frames). Looked at 15 full-size frames in review/q2/: 0.5, 1.5, 2.4, 3.6, 4.8, 5.6, 8.75, 9.1, 9.5, 23.4, 24.4, 25.2, 26.0, 26.3 and 27.6.
- `capture.mjs check`: CHECK OK. I re-ran the dense every-frame pass (scratchpad dense_b4.mjs, 1/120 s steps): CHECK OK, no errors.
- Captions: there are 41 chunks. Every chunk has exactly one yellow word. A script check confirms that each line's caps contain every spoken word in order (2/12 for "two"/"twelve" are the only substitutions). Every chunk lasts at least 0.40 s. Three chunks are exactly 0.40 s: "YOUR *MOUTH" (16.07-16.47), "WAY *MORE" (17.57-17.97) and "KIDS *AGED" (20.09-20.49). The same exact-0.40 s length passed in body-3. Six chunks still have 4 words; they were kept so that every spoken word stays on screen. None of them shrinks badly.
- Round-1 fix 2 (S05): the ear is mirrored, so its raised white-gloved hand now goes up on the open left side over the dark seat. There is no glass in S04/S05. At 9.1 and 9.5 the hand is fully visible, clean, and nothing covers it. It rises on "swears" (8.60).
- Round-1 fix 3 (S12): the sun is drawn behind the trees, which now sit lower. At 26.0, 26.3 and 27.6 the trees pass in front of the sun, and the ring (on "horizon") and the dashed sight line both hit the sun.
- Optional items done: the door handles are gone in the close-ups (0.5, 1.5, 9.1), so the captions sit on a clean orange door and read well. The lane dashes are gone in S11/S12, and the road band behind the captions is plain grey and readable. The S06 ear signal line is now orange.
- White gloves on every buddy in S02/S03 (3.6, 5.6): consistent and clean, and nothing overlaps the captions or the speech bubbles.
- Everything checked in round 1 still holds: the hook, reveal timing, facts against Cleveland Clinic and NHS, the meta description, no gore and no medical advice, and the end card (stomach, GRRR, NEXT, FOLLOW, warm grin).

Fix list (blocking)
None.

Optional polish (non-blocking)
1. S05, 8.7-10.0 s: the raised hand's "finger" capsule continues along the line of the arm, beyond the glove, so it reads a bit like a stick or wand rather than an open hand. In kit.js senseBuddy limb(), change `ctx.rotate(an + Math.PI / 2)` to `ctx.rotate(0)` so the finger points straight up (an "I swear" hand).
2. S12, 27.2-27.9 s: the wind lines cross the lowered tree trunk at x ~120. Nudge the wind lines right by about 60 px, toward the open window.
