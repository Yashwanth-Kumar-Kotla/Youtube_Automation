PASS

Round 2 re-check (frames in review/y): all round-1 blocking fixes verified. 5.30 caption WHAT CANCELS THAT?, no pill; 5.50 TWENTY MINUTES with pill A; 7.20 only A; 7.75 B popped on hour-plus; S09 dumbbell/X bottom ~y1060 (clear of caption); metabolism (NIH) and MAYO pills larger and legible, >100 px above caption; COMMENT A OR B at top; 24.4 S11 starts at the cut, LIKE SMOKING no longer overruns; end badges bottom ~y1140 vs caption top ~y1250; frame 35.62 matches frame 0.0 (same camera, clock 9, pills, no black). Length 35.63 accepted. CHECK OK.

Round 1 notes (resolved) follow.


QA of 2026-11-24-body-5 (body / inside-out, "What happens if you sit all day?"). Sheet at review/all.jpg, full frames in review/full, review/seam, review/x. `capture.mjs check` = CHECK OK, length 35.63 s (accepted).

## Blocking defects (fix these, then re-check)
1. S03 -> S04, ~6.97-7.10 s: pill "B HOUR+" is already on screen at 7.10 s. The voice says "or" at 7.02, "an" at 7.40, "hour-plus" at 7.58 (words.json). The reveal lands about 0.5 s before its word. Change: pop pill B on Wd('hour-plus') (7.58 s), or at the earliest on 'an' (7.40). Keep the "?" pulse and the scale wobble on the same word.
2. Caption "*20 MINUTES" (check output 5.95-6.97) starts about 0.6 s after the voice says "twenty" (5.36 s). From 5.36 to 5.95 the screen shows "WHAT CANCELS IT?" while the pill A 20 MIN has already popped (frame 5.70 confirms). Change: the chunk boundary must fall on "twenty", i.e. the "*20 MINUTES" chunk starts at 5.36 s. Re-check the line 2 `caps` token count against the words (What/cancels/that: = 3 tokens, then twenty/minutes), and re-run check until it prints `5.36-... *20 MINUTES`. Optional: the voice says "that", the caption says "IT?". Use "THAT?" or accept it.
3. S09, 21.5-22.5 s ("no exercise"): the dumbbell plus the red X sits on the floor at bottom left. Its bottom edge is about y1230, which is only about 15 px above the caption top (~y1245). Frame 21.80 shows it. Change: move the dumbbell and X up to a bottom edge of y1150 or higher (for example on the floor line at about y1100) or shrink them. Rule: 80 px clearance.

## Fix soon (small, not blocking on their own)
4. S11, 25.2-26.2 s: the "COMMENT A OR B" pill sits directly on top of the A/B pills (about 0-5 px gap). Tags touching. Move it up about 40 px, or drop it (it is not voiced). Frame 25.60.
5. Rewatch text is too small on a phone. "metabolism (NIH)" in S08 is about 12 px tall, and "MAYO CLINIC · 13 STUDIES" in S10 is about 14 px. The sticky note (about 25 px) is legible at full size only. If the text is kept, make the NIH and Mayo tags about 1.5x bigger. They must not come within 80 px of the caption.
6. End card (S15, 33.9-35.63 s): the BODY FILES and FOLLOW badges have their bottom edge at about y1165 and the caption top at ~y1245, so clearance is about 80 px. This is borderline-pass. Move both up about 20 px (y1115) to be safe. They also cover the hero's knees and the chair caster, which is cosmetic.
7. 24.0-24.3 s: the caption "LIKE SMOKING" runs about 0.2 s over the cut into the S11 scale. Minor. End the chunk at the cut, or cut at 24.29.

## Passes
- Hook: frame 0.0 and 0.5 are not empty. Hero in the office chair, clock whipping, "7+ HOURS", A/B pills and the caption "WHAT HAPPENS" (by 0.54 s) are all on screen. Frame 1 carries the premise (STOP 8 OK). Line 2 has numbers (seven-plus, twenty minutes). First caption at 0.4 s, nothing black.
- Loop: frame 35.60 and frame 0.00 use the same camera. Scale, hero pose, clock at 9, A/B pills and sticky note are in the same positions. No black at the end. Only the monitor content and the end badges differ (intended).
- Tease: nothing from the tease before "Next" (30.20 s). The S13 cut is at 30.14 and the last S12 frame (29.75) is still the office.
- Reveals on their word: "THE END" and rust (12.7 and 13.25 against "movie" 12.64 and "rusted" 13.22), metabolism tag (16.25 against 15.98), BURN FEWER (17.75 against 17.54), 8+ HOURS (20.25 against 20.10), RISK, "≈" and the cigarette on "risk", "like", "smoking", the 60-75 pill (26.25 against "seventy-five" 25.98), the Mayo pill, STAND (28.75 against 28.54).
- One yellow word per caption chunk; spelling right; all captions checked on the sheet.
- Facts match script.json sources: NHS >7 h and the 150 min/week to about 21 min/day option A (the "~" is fine), "silent killer" attributed to UK DHSC, Mayo 13 studies / 8+ h no exercise similar to obesity and smoking, 60-75 min offsets it, stand every 30 min (Mayo), NIH metabolism slows. "A death risk like smoking" leaves out "obesity", which is accurate but partial. The description carries the full sentence. This is acceptable. For extra safety, change the voice to "like obesity and smoking" only if the length stays under ~36 s.
- No gore, no medical advice beyond "talk to a doctor" in the description. S10 cigarette: a flat schematic icon in a circle, no smoke, no illness imagery, with a neutral "≈" comparison. Not alarming. OK. S14 (1.38 s) and S10 (1.77 s) are readable at their length.
- Office set reused in S01/S09/S12/S15 is fine and is the intended loop.
