PASS

## QA round 2 · 2026-11-17 · PASS
- **Files:** `src/shots.js` and `script.json` are byte-identical to the scratch copy I tested in round 1, so all six fixes are in.
- **Check:** `capture.mjs check` gives CHECK OK. Shot boundaries are unchanged: S13 runs 29.58-32.50 and S15 runs 34.58-38.09.
- **Cues:** data/cues.json has 75 cues. The S13 kid pop is now at 29.63 (cut + 0.05), and the S11 'plop' stays at 26.13.
- **Mix:** mix.wav is 38.19 s, which is DUR plus mix.py's built-in 0.1 s tail. OK.
- **Sheet:** the refreshed review/all.jpg was made with 9 columns instead of 10. Its content matches the sheet I tested.

### The six fixes, re-checked full size (review/r2/)
1. **S13:** the kid is popping in at 29.61, just after the cut, and fully in by 29.75. Its pop sound now lands at the cut, so the empty frame is gone.
2. **S07, at 18.3:** the STUCK? stamp and red X now sit above the tube. They are clear of the caption, the wad and the ~40 h tag.
3. **Line-2 caps, 8.2 and 8.9:** the captions read "NO ENZYME / IN YOU" and then "BREAKS IT". Each chunk has one yellow word.
4. **S15, 35.5 and 37.6:** the tease eye and NEXT pill are fully on screen and clear of the ear.
5. **S11, at 26.35:** the toilet now shows sky-blue droplets only, with no yellow burst.
6. **S04:** the "gum base: no enzyme" label is now 34 px and readable. It does not touch the chompers or the J wall.

### Regression and cut scan
I checked a frame 0.03 s after every cut, at 2.46, 5.39, 7.73, 9.39, 12.63, 15.88, 18.5, 21.06, 23.09, 24.99, 27.86, 29.61, 32.53 and 34.61. Apart from the normal white cut flash, none is blank, and nothing waits on a later word.
- S02 and S12 still build in within about 0.1-0.3 s, the same as round 1. OK.

### Other checks
- **Hook frame (0.5 s):** unchanged and passes.
- **Last frame (38.05 s):** shows the frame-1 framing for the loop, through the engine's fade.
- **Answer timing:** the round-1 non-blocking note still applies. The answer lands at 66.4%, which is a script-level nit.

---
Round 1 verdict: FAIL (fixed in round 2)

QA round 1 · body · 2026-11-16-body-4 "swallowing gum" · 38.09 s · 15 shots · CHECK OK
Sheet: review/all.jpg (76 frames). Full-size frames: review/qa/ (0.03, 0.5, 1.0, every cut, 8.9, 13.6, 17.0 twist, 18.25, 25.6, 26.2 CTA/answer, 29.61, 29.9, 31.5, 32.7, 37.6, 38.05 last).
Note: data/words.txt is stale (older alignment). The engine uses data/words.json, and all timings below come from words.json.

I tested all the fixes below together in a scratch copy: CHECK OK, a new sheet, and full-size frames at 8.2, 8.9, 18.3, 26.35, 29.65, 29.9, 35.5 and 37.6.
Shot starts do not move. Because fix 6 moves a cue, re-run `capture.mjs cues` and `tools/mix.py` afterwards.

## Fixes (in order)
1. **S13, 29.58-30.05 s: empty frame right after the cut.** This is the same bug as the two earlier videos today. For about 0.5 s the frame is blank cream with only the small "1 PIECE" pill and the M-S letters. The kid waits for "kids" (30.10) while the caption already says MOSTLY KIDS.
   In src/shots.js:
   `K.ageIcon(250, 1130, 0.86, { kid: true, sc: pop(lt, ki - 0.05) });` → `K.ageIcon(250, 1130, 0.86, { kid: true, sc: pop(lt, 0.05) });`
   Also move its sound to match:
   `cue(st + ki, 'pop', { gain: 0.6 });` → `cue(st + 0.05, 'pop', { gain: 0.6 });`
   Tested: the kid is fully in by 29.9.
2. **S07, 18.13-18.47 s: the STUCK? stamp and its red X sit on the caption zone.** The X's lower tips reach y ≈ 1245 and touch the top of the "MEAN STUCK" caption. The stamp also floats outside the tube, away from the wad.
   `K.stamp('STUCK?', 540, 1120, 62, ...` → `K.stamp('STUCK?', 540, 230, 62, ...`
   `K.redX(540, 1120, 0.42, 1, 0.6)` → `K.redX(540, 230, 0.42, 1, 0.6)`
   Tested: the stamp and X now sit in the empty band above the tube (about y 105-355). They are clear of the wall, the wad, the tag and the caption.
3. **Captions, line 2 (7.73-9.41 s): "YOU *BREAKS IT" reads as broken grammar.** This is regrouping only. In script.json:
   `"*GULP | GUM *BASE | IS MOSTLY *SYNTHETIC | NO *ENZYME IN | YOU *BREAKS IT"` →
   `"*GULP | GUM *BASE | IS MOSTLY *SYNTHETIC | NO *ENZYME IN YOU | *BREAKS IT"`
   Tested:
   - "NO ENZYME IN YOU" runs 7.73-8.73 (1.00 s) and wraps cleanly as "NO ENZYME / IN YOU". "BREAKS IT" runs 8.73-9.41 (0.68 s).
   - Every spoken word is still there, in order. Each chunk has one star.
   - It is the only 4-word chunk; the same pattern passed in body-4 on 11-14.
   - No 3-word grouping works here, because "IN YOU" would last only 0.34 s.
4. **S15, 34.58-38.09 s (end card): the small tease eye and the NEXT pill are clipped by the right edge.** The eye disc and pill run to x ≈ 1078 after the camera push.
   `K.twitchEye(980, 560, 0.24, ...` → `K.twitchEye(950, 560, 0.24, ...`
   `K.pill('NEXT', 980, 700, 38, ...` → `K.pill('NEXT', 950, 700, 38, ...`
   Tested: both are fully on screen and still clear of the ear.
5. **S11, 26.13-26.6 s: the yellow impact burst in the toilet bowl on "poop".** Yellow rays in toilet water can read as pee. The toilet should stay a plain icon.
   Replace
   `else K.burst(A1[0] - 20, A1[1] + 30, 0.9, 1 - seg(lt, po + 0.05, po + 0.5));`
   with a small water splash, three sky-blue droplets:
   `else { const a = 1 - seg(lt, po + 0.25, po + 0.5), k = eo(seg(lt, po + 0.05, po + 0.3)); if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = C.sky; ctx.strokeStyle = C.ink; ctx.lineWidth = 4; for (const [dx, dy, r] of [[-70, -30, 13], [0, -60, 16], [70, -30, 13]]) { ctx.beginPath(); ctx.arc(A1[0] - 20 + dx * k, A1[1] + 40 + dy * k, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); } ctx.restore(); } }`
   The 'plop' cue stays as it is. Tested at 26.35.
6. **S04, 8.0-9.36 s: the rewatch label "gum base: no enzyme" is set at 26 px.** That is too small to read on a phone, and 37% of watch time is on tablet or TV.
   `K.pill('gum base: no enzyme', WX, WY - 128, 26, ...` → `K.pill('gum base: no enzyme', WX, WY - 132, 34, ...`
   Tested: it is readable and does not touch the J wall, the chompers or the tag.

## Director flags
1. **Tooth dents read as a face:** yes, they read as a sleepy smiling face. OK, not blocking. It suits the "traveler" idea and stays family-safe, with no gore. The chompers bounce off; they never hurt it.
2. **Unvoiced "1 PIECE: USUALLY FINE" pill:** allowed. It is a sourced fact (Cleveland Clinic: "Swallowing one piece of gum probably won't hurt you"), small, unvoiced, and it balances the blockage line. It is not medical advice. Keep it. After fix 1 the frame is no longer empty around it.
3. **Caption "NO *ENZYME IN | YOU *BREAKS IT":** fix 3.
4. **Shot lengths:**
   - S04 is 1.66 s, which is OK (≥1.5).
   - S15 is 3.51 s. It is only 0.01 s over, and about 1.3 s of it is the outro and fade, so OK.
   - S15 cuts in at 34.58, 0.04 s before "twitches" ends. That is inaudible, so OK.
5. **Small text:** only the S04 label was too small (fix 6). The other small labels are 36-50 px and readable: COMMENT A OR B 36, 1 PIECE 38, NEXT 38, GUM BASE 44, DUKE HEALTH 46, GUM WADS SEEN 50.
6. **STUCK? stamp at y≈1120:** fix 2.
7. **Faceless coworkers:** OK. They read as simple background people, and the hero's face carries the beat.

## Checked and OK
- **Hook:** the engine's 0.25 s fade-in still applies (frame 0 is dark). From 0.25 s the frame shows the x-ray hero mid-gulp, the gum wad in his throat and the A 7 YEARS / B DAYS pills. The caption is on at 0.35 s. On "swallow" the wad drops with gulp arcs. Nothing is static.
- **Guess beat:**
  - Line 2 gives two concrete options. In S02 the A pill and calendar pop on "Seven", B on "gone"/"days", and the "?" on "Guess".
  - The pinned comment is the A/B question.
- **Answer (not blocking, script level):** "B" lands at 25.28 s, which is 66.4% of 38.09 (68.7% of the spoken audio). "forty hours" lands at 26.52 s, which is 69.6%.
  - Both are short of the strict last-30% mark (26.66 s). This repeats the nit that was accepted on body-3 (68.4%).
  - It can't be fixed by timing alone: line gaps would need about 4.6 s more. The writer should note it for next time.
  - At the answer, the check and the dimmed A land on "B". COMMENT A OR B shows for about 1.2 s, unvoiced and well after the first 3 s.
- **Re-hook:** at 15.96 s (42%), "But here's the twist" plus a hard zoom into a new place (inside the intestine tube). No two calm lines run back to back.
- **Relatable beat:** S06, the meeting room. GULP lands on "gulped", the parent bubble on "parent's" and 7 YEARS! on "warning". The beat fits adults.
- **Rewatch detail:** the "~40 h" luggage tag in S07/S08, before the reveal, plus the enzyme label. Both are sourced. The tag on frame 1 shows only a clock.
- **Loop ending:** S15 uses the exact frame-1 framing: same hero, same wad in the throat, same pill spot. The B check stays on and the lower lid flickers. The tease line is last, and FOLLOW pops at 97%.
  - Engine note (template level, same on every channel): main.js fades to black over the last 0.35 s, so the loop seam passes through black.
- **Reveals on their words:** the wad drop on "swallow", GULP!, GUM BASE on "base", the flask on "synthetic", the enzyme label on "enzyme", the chomp-bounce on "breaks", the route on "trip", the spin on "twist", the wall bounce on "cling", food on "rides"/"food", DUKE HEALTH on "Duke", the monitor on "stomach", GUM WADS SEEN: 0 on "one", the check on "B", the slide on "out"→"poop", the clock and 40 HOURS on "forty", RARE on "Rare", the clump and ring on "blockages", wads on "swallowing"/"lots", the underline on "daily", NEXT/BODY FILES on "Next"/"Body", the lid flicker on "twitches"/"quit" and the ring on "lower".
- **Blank or empty frames at cuts:** I scanned every cut at +0.03 s. The only real gap was S13 (fix 1). Three brief build-ins are fine:
  - S02, 2.43-2.52: one "?" card, then card A pops on "Seven".
  - S12, 27.83-28.0: the tube pops in over 0.3 s and RARE lands on "Rare" at 27.92.
  - S10/S11: the scene is already populated at the cut.
- **Captions:**
  - Spelling is correct. Each chunk has one yellow word. A script check confirmed every spoken word is present, in order, with "40" for "forty".
  - The shortest chunks are *GULP (0.41 s) and IT *DOESN'T (0.41 s).
  - Nothing overlaps the caption zone after fix 2. The BODY FILES and FOLLOW pills end at y ≈ 1240, which is clear.
- **Safety and taste:**
  - The blockage beat is calm. S12 is a schematic tube with no person; S13 shows a smiling kid icon and a week strip. There is no distressed kid.
  - The toilet is an icon only, and becomes a plain water splash after fix 5. No poop is shown.
  - The doctor in S09 is the Duke source, not the narrator.
  - No gore. The only medical advice is the description's "see a doctor" line. Family-safe.
- **Facts against the sources:**
  - "mostly synthetic" matches CC "largely synthetic".
  - "no enzyme in you breaks it" matches Duke: "do not possess digestive enzymes to specifically break down gum base".
  - "stays whole / never breaking down" matches CC: "isn't able to be digested … doesn't break down".
  - "Duke doctor reviewing stomach scopes hasn't seen one gum wad" matches Duke: endoscopies, "I have yet to see a wad of gum lying around in the stomach".
  - "out in your poop, about forty hours later" matches CC: "about 40 hours later in your stool".
  - "gone in days" vs 7 years matches CC: "not … seven years or even seven days".
  - Blockages "mostly kids swallowing lots of gum daily" matches Pediatrics 1998 (Milov, three children who habitually swallowed gum) and CC (daily or a mega-wad).
  - The eyelid tease, "mostly the lower lid", matches CC Eye Twitching (myokymia is most often in the lower lid).
