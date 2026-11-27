PASS

Round 2 re-check, 2026-11-27: all five round-1 fixes verified on full frames (12.0, 19.0, 20.5, 22.0, 34.6, plus frame 0). `capture.mjs check` is CHECK OK, 34.68 s.
1. S09/S10: floor raised, feet end at about y1115, clear of the caption (top ~1245). Fixed.
2. S09: hero at x~100-390, margin of 90 px or more on the left. Fixed.
3. hgGlyph is now a tilted loop with a dot, a zig-zag tail and a loose dot. It is abstract and does not read as a Chinese character. Fixed. (Small on the card, but the "SAME SYMBOL" tag and the rows still tell the story.)
4. End card: BODY FILES (205,120) and FOLLOW (500,120) sit side by side, and the steam puff no longer touches FOLLOW. Last frame equals frame 0 (hero, laptop, clock, lunchbox, tag, pills in the same positions and scale; badges, caption and steam phase differ, which is allowed). No black.
5. S06: the burst sits between the darts and touches neither. Fixed.

Round 1 findings below are kept for the record; all are resolved.

---

QA round 1, 2026-11-27. Checked: sheet (every 0.5 s), full frames at 0.5, 1.0, 10.0, 10.5, 12.0, 13.5, 18.0, 19.0, 20.5, 25.0, 28.0, 34.6, `capture.mjs check` (CHECK OK, 34.68 s).

PASSES
- Length 34.68 s. Line 2 has the number ("thirty-seven percent"). Frame 1 (0.5 s) shows hero, 37% tag, A/B pills, caption WHAT HAPPENS; nothing empty in the first second.
- Loop: frame at 34.6 matches frame 0.5 (hero, laptop, clock, lunchbox, tag, pills in identical positions/scale; only steam phase differs). No black. End-card badges allowed.
- Every caption chunk has exactly one yellow word; caption text matches the script/voice. Reveals follow word timings (pill B at "only" 7.42, check at "only" 24.34, tease from "Next" 29.78). COMMENT A OR B is on screen about 1.2 s at 44 px (ok).
- Facts match sources (37% "tracked", cortisol/adrenaline, negative-photo-only, noticed feelings). No gore, no medical advice.
- A/B pills at 34-40 px are readable. S07 pedal slip reads (pedal swings off, bolt dot, red "!"). S06 burst top margin is 58 px (ok).

FIXES (all required)
1. S10 (19.91-21.89, worst at ~20.5) and S09 (16.71-19.91, ~19.0): hero's legs/feet run into the caption zone. S10 feet end y~1335 and touch the "R" of RATED; S09 feet end y~1258 against caption top ~1245. Raise the hero (and the floor line/baseboard with him) by about 120 px in both shots, or shorten the legs so feet end above y 1160. Keep the stomach badge and the mood faces in the same relative spots.
2. S09 (~19.0): the hero is clipped at the left edge (sleeve and hand at x 0 at full push). Move the hero right by about 70 px, or lower the push so he keeps at least a 30 px margin, and keep the hero fixed in the same place between S09 and S10.
3. S10-S12 (21.0-23.9), hgGlyph in src/core/kit.js line ~8639: the symbol reads as the real Chinese character 方 (it looks like a mangled one), which the brief forbids. Redraw it as a clearly abstract shape, with no horizontal bar plus a vertical stroke plus a hooked tail. For example a closed loop with a dot inside and a zig-zag, or a spiral with a bar through it. Keep the ~120 px size and the single line colour. The "SAME SYMBOL" tag and the 400+ US ADULTS pill stay.
4. S15 (last frame, 33.6-34.68): the pale steam puff at about (310, 295) touches the bottom edge of the + FOLLOW pill (puff top y~245, pill bottom y~250). Move the FOLLOW pill up or left by about 40 px, or move the puff start x right by about 80 px. The change must also apply at S01 frame 0 so the loop still matches. If the puff is moved in S01, it must stay out of the 37% tag.
5. S06 (11.73-12.13, "surge"): the yellow burst lines cross the two darts (a horizontal line runs through each dart at y~262). Shift the burst to the centre between the darts, or shorten the horizontal rays so they do not touch the darts.

ADVISORY (not blocking)
- S09 16.71-18.12: the right side is empty until "hunger". The shock lines carry it, and I accept it. Optionally pop the lab wall tiles or a faint "?" earlier.
- S06: the CORTISOL/ADRENALINE tags are small (~40 px) on dark. Accept as rewatch detail.

After the fixes, re-run check, cues, mix, then the same QA agent re-checks frames at 19.0, 20.5, 22.0, 12.0, 34.6 and 0.5.
