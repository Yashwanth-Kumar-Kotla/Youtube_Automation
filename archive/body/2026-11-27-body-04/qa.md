PASS

QA of work/2026-11-27-body-1 (body / inside-out, sore muscles days later). Sheet at 0.5 s plus full-size frames at 0.5, 4.3, 6.9, 9.5, 12.9, 14.9, 16.9, 18.9, 23.9, 25.0, 26.9, 28.8, 32.8. `capture.mjs check` = CHECK OK. No blocking defects.

Section 7 checks
- Frame 1 carries the hook: x-ray hero mid-curl, "1-3 DAYS" fuse tag, A LIFTING / B LOWERING pills; caption "WHAT HAPPENS" is up at 0.5 s (voice lead 0.4 s). OK.
- Line 2 has a concrete number ("one to three days"). OK.
- Length 32.876 s (32.88). OK.
- Loop: last frame (32.8) matches frame 1 in hero, dumbbell, fuse, tag and pill positions (1-3 DAYS about 7 px higher, invisible). No black. End-card badges are convention. OK.

Round-1 checklist
- Caption zone: nothing within 80 px of the caption top (~1245). Closest are the zoomed muscle at 16.9 (bottom ~y1225, but it is a full-bleed fibre texture over a dark panel and clean of text) and the S06 stairs (bottom y1188, about 60 px above the caption). Acceptable.
- Reveals vs words: X on LACTIC ACID, drain at "gone" (8.26), "~1 HOUR" pill at "hour", B check on "lowering" (22.53), lunge on "Lunges", runner on "downhill" (about 24.2), calendar on "week". All land on or just after their word. Tease starts at "Next" (28.35); NEXT pill follows. OK.
- Yellow words: every caption chunk has exactly one yellow word (checked on crops; the sheet looks off only because the highlight lands as the word is spoken). Spelling and text match the voice.
- COMMENT A OR B: 44 px font, top at y160, visible about 22.83 to 24.1 (about 1.2 s, fully opaque about 0.9 s). Passes, but see optional fix 1.
- Labels and tags: no overlaps with arrows or objects. "Houston Methodist" is legible but small (see optional 2).
- Edge margins at max push: no clipped content seen.
- Facts: 1-3 days, lowering/lunges/downhill, more than a week, dark pee, lactic acid gone in about an hour, tiny tears, inflammation, ache builds over hours. All in the sources. "7 DAYS" calendar is the accepted "more than a week" icon. No gore (schematic nicks), advice is only "get help". Tease matches Scientific American (voice, skull bass).

Director's flags
- "~1 HOUR" pill: 54 px, clear. "Houston Methodist" fine print is about 28 px white on black at y1060. Readable but the smallest text in the video. Optional.
- Whole-body x-ray in hook: reads fine, head normal, skeleton plus pink gut "?" shape. OK.
- S06 handrail: sits high, runs behind his neck at head height, and at 14.9 the hand grips it at shoulder level. Looks slightly odd but reads as "needs the rail". Not blocking.
- S04 red X: about 160 px, clearly readable on the cap. OK.
- "1-3 DAYS" vs NEXT pill in the last frame: no overlap, gap only about 30 px (NEXT bottom y~300, tag top y~330). Tight but not a fail.

Optional polish (not required for PASS)
1. S10, ~22.83-24.1: change `out(lt, lo + 1.45, 0.2)` to `out(lt, lo + 1.7, 0.2)` so the COMMENT A OR B pill holds about 1.2 s fully visible.
2. S04, ~9.25-10: raise "Houston Methodist" fine print from ~28 px to 32-34 px.
3. Last frame: move the mic + NEXT badge up ~20 px (or the end-card tag only) to widen the gap to the 1-3 DAYS pill; keep the tag where frame 1 has it.
4. S02 calendar at 3.25 shows "1 DAYS"; ideally "1 DAY" (cosmetic).
- 2026-11-27 fix after PASS: S02 calendar now reads '1 DAY' (was '1 DAYS'); CHECK OK. Visual text only.
