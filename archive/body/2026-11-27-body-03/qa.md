PASS

Round 2 re-check (frames 17.6, 17.9, 27.5, 28.9, 33.22; check = CHECK OK, 33.25 s):
- S13 calendar now 3 -> 3+ DAYS, no 5/7, no ring: fixed.
- S08 lens right edge ~x930 at 17.9 (margin >140 px): fixed.
- S13 clinic eave ~x1020, check ~x1005, ~75 px clear of the calendar: fixed (margins >=55 px).
- End card NEXT pill at y235 clear of the finger; last frame still matches frame 0 apart from the allowed badges.

Round 1 report follows (superseded):


# QA: What Happens When You Get a Paper Cut? (body-3, inside-out)
Checked: contact sheet (66 frames, 0.5 s), full-size frames at 0.0, 0.5, 4.4, 7.5, 10.9, 12.9, 17.6, 22.9, 24.0, 24.9, 28.9, 29.4, 31.4, 33.22, `capture.mjs check` (CHECK OK), words.txt, script.json, meta.json.

## Passes
- Length 33.25 s (target 33.25). check = CHECK OK.
- Frame 1 carries the hook (fingertip on paper edge, cyan nerve map, red cut, "2-3 DAYS TO HEAL", A GLITCH / B GUARD pills). Caption "WHAT HAPPENS" is up at 0.35 s. Finger moves from 0.0, so nothing static.
- Line 2 has a number ("two to three days"), tag and calendar on screen at that moment.
- Loop: frame 33.22 vs frame 0.00: same finger pose, scale, red line, tag and pills; no black; only the allowed end-card badges (BODY FILES, FOLLOW, NEXT) added. PASS.
- Captions match the voice; every chunk has exactly one yellow word; spelling OK; chunk starts sit on spoken words (zero-length "It" 2.46 -> IT HEALS at 2.41, "why" 30.64 -> WHY SORENESS at 30.59, "tiny" -> cut at 17.95). No caption runs past a cut.
- Reveals land on words: calendar 2 on "two", 3 on "three"; check on B GUARD on "guard" (23.82-24.16); sting zap on "sting"; diabetes pill on "diabetes"; clinic check on "checked"; tease starts at 29.21 ("Next" 29.26), not before.
- COMMENT A OR B: about 24.2 to 25.6 s (>1 s), 48 px text, 107 px above the caption. OK. S11 at 1.02 s is readable: shield snap is clear.
- Nothing within 80 px of caption zone (lowest items: COMMENT pill y1138, S05 fine print y~1020, S09 tag y~1090). No tag/arrow overlaps. HAIRLINE and BACK labels are unobstructed.
- S04 x-ray finger running behind the caption: acceptable. Key action (nerve dots, yellow nerves) is above y1250; caption has a heavy outline and stays legible.
- Cyan nerve map on a skin finger (S01/S15): reads fine, requested by meta. S06 grey silhouette: acceptable (reads as a figure; "BACK" tag does the work).
- No gore: thin red line, three schematic dots, zigzag pain marks only.
- Facts match Ohio State and Cleveland Clinic sources (nerve density, "less about size, more about the spot", capillaries bleed more, heals 2-3 days, pain protective, diabetes -> doctor, DOMS tease). Exception below.

## FAIL items (fix list)
1. S13, 26.05-29.21 (seen at 27.25-29.2): the calendar flips to "7 DAYS" with a red ring. Ohio State gives no number of days for "doesn't improve"; "7" reads as a medical threshold (advice beyond "see a doctor"). Change the flip in S13 (`n = k<0.01 ? '3' : k<0.5 ? '5' : '7'`) to show no specific day count, e.g. flip '3' -> '3+' (or '?') and keep the ring; update the shot note. Do not show 5 or 7.
2. S08, 17.2-17.95 (K.lens at CUT[0], CUT[1]-230, r grows to ~170+): the lens ring touches the right frame edge (ring right edge x~1078 of 1080 at 17.6, still growing at 17.75). Needs >=30 px margin at max push. Fix: move the lens centre left by ~90 px (e.g. CUT[0]-90) and cap its grown radius so the ring's right edge is <=1040 at 17.95; check the ring still clears y=0 and the caption (top y1245).
3. S13, 28.3-29.2 (frame 28.90): clinic roof eave ends at x~1065 (15 px margin) and the green check circle at x~1055 (25 px margin). Move the clinic (DX) left ~40 px, or reduce scale 0.85 -> 0.78, so the eave is <=1040 and the check <=1040. Keep the calendar clear (calendar right edge x~470, clinic left x~545 now; stay >=40 px apart).
4. Minor, optional: end card at 32.25-33.25, NEXT pill right edge x~1002 with the finger edge ~30 px below it at x=1000 (y~305 vs pill bottom 273). Not a fail; if you touch the end card, nudge the NEXT badge up ~15 px.

## Re-check after fixes
Re-run `node tools/capture.mjs check`, cues and mix, then confirm frames at 17.6, 17.9, 27.5, 28.9 (S08/S13). No other change needed; do not move cuts.
