PASS
# QA: 2026-11-24-body-1 (body, inside-out, held-in sneeze), 28.43 s

CHECK OK from capture.mjs. Sheet and full frames at 0.5, 10.8, 20.4, 20.9, 26.3, 27.0, 28.2, 28.42 reviewed. One blocker, plus advisory fixes.

## Blockers (must fix)
1. main.js `draw()`, last 0.35 s (t 28.08-28.43). The end fade-out to black is still active. At 28.42 the frame is almost fully black with the caption "NOW YOU KNOW..." still bright on top, so the loop to frame 1 cuts through black. This breaks TEST 10 and the seamless loop.
   Exact change: delete `const fade = clamp((T.dur - t) / 0.35);` and the `if (fade < 1) {...}` block (same as loop:true in the earlier video). The last frame must be the full-bright hook framing with the stamp and the trapped blast. Re-run `capture.mjs check` and re-read t28.42.
2. S14 end card, bottom pills, t 26.3-28.4. The BODY FILES pill (y about 1150-1225) and the "+ FOLLOW" pill (y about 1170-1240) sit about 10 px above the "NOW YOU" caption top (about 1250). They nearly touch, and during the punch-in at 26.3 BODY FILES sits closer still. Pills must clear the caption zone.
   Exact change: in shots.js S14, move badge(290,1185,...) and the FOLLOW pill up to y about 1120 or less. The neck and shoulder lines are free there. Keep both above y 1180 including the punch-in scale.

## Advisory (fix in the same pass, cheap)
3. S14 stand-up badge, t 26.13-26.5. At 26.3 the circle's right edge is at about x 1020 of 1080 and the NEXT pill at about 1005. This is inside the frame, but the punch-in (1.13x about cam 540,640) pushes it to the edge in the first frames. Shift the badge and NEXT pill left by about 30 px (x about 830 instead of about 860) so there is at least 40 px margin at peak punch.
4. Shot for "Torn, then healed" (t 20.25-21.23): "TORN" is on screen only 0.26 s (20.25-20.51) with a "COMMENT A OR B" pill beside it. Readable but fast. Optional: start the shot 0.1 s earlier, or accept it. The pill is small (about 22 px cap height at the 1080 render) and the A/B pills are gone by then, so "A OR B" has no visible referent. Make the pill 1.3x, or drop it from this shot and show it only on the "OR THROAT?" shot, where the A/B pills are visible. The pill is clear of the caption zone (y about 1195 vs caption top about 1320) and OK across the cut.
5. Rewatch text (wristband "BMJ Case Reports 2018", "pharynx", "7 DAYS" corner tag) is tiny at 1080x1920 (about 14-16 px). It is a rewatch easter egg and not needed for comprehension, so acceptable. Optional: raise it about 25%.
6. Answer shot (19.29-20.25, "HIS THROAT", 0.95 s) is short but works: the THROAT pill check lands on the word. Acceptable as is.
7. Safety note. At 6.68-10.75 the hero's mouth and nose are covered by red schematic bars. There is no hand, no pinching, no gore, and the bars read as "blocked" while the line says "blocked his nose and mouth". This passes meta "safety". Do not add anything more literal.

## Checks passed
- Hook (STOP 8, meta first_frame): at 0.5 s the frame shows the x-ray hero with lips clamped, cheeks puffed, trapped blast glowing, the red "MYTH: HARMLESS" stamp, and the caption "WHAT HAPPENS" (one yellow word). Caption first appears about 0.4 s. Nothing static or empty. Frame 1 carries the hook visually.
- Line 2 has a concrete number ("one man spent 7 days in hospital"; caption "7 DAYS"; wristband "7 DAYS"). Matches the BMJ/ScienceDaily source (discharged after seven days).
- Length 28.43 s, inside the 25-30 s target (TEST 9).
- Reveals land on their words: MYTH stamp and HARMLESS strike-through, FACT, 7 DAYS, EARS then THROAT pills, check on THROAT, chest bubbles stopping at the ribcage on "ribs" (sourced), tear shown as a small cyan crack, elbow sneeze on "let it out". Nothing appears before its cause.
- Facts vs script.json sources: 34-year-old (not shown, fine), crackling to ribs, air in the chest, torn pharynx, healed, let it out into an elbow or tissue. All consistent. No medical advice beyond "doctors say let it out". No gore.
- Captions: one yellow word per chunk throughout. Spelling is right. No label overlaps the caption zone except as in item 2.
- All-x-ray head in the hook, guess, answer and end shots is consistent with the meta exception. The chest shots use the full x-ray body (STYLE pitfall 1 OK).
- End loop content matches frame 1 (same head, same stamp, same framing). Once the fade is removed, the loop is seamless.

## Re-check after fixes (t26.3, 27.0, 28.2, 28.42)
- Blocker 1 fixed: the end fade is gone from main.js. The 28.42 frame is full-bright and matches frame 1 (same head, stamp and framing), so the loop is seamless. The blast is mid-bounce, which is fine.
- Blocker 2 fixed: the BODY FILES and FOLLOW pills sit at about y 1095-1165, about 90 px clear of the caption (top about 1250). Nothing collides with a label or the caption.
- Fix 3 done: the stand-up badge right edge is at about x 985 and the NEXT pill at about 985, a margin of about 95 px. No clipping at 26.3 or later.
- Advisory 4 and 5 (the small "COMMENT A OR B" pill and the rewatch text) are accepted as is. Verdict is PASS.
