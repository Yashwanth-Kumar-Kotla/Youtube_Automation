PASS
# QA round 3: body 2026-11-28-body-2 (deja vu), 35.25 s

All fixes verified, CHECK OK.
- Caption re-chunks (round 1): SCIENTISTS *TRIGGERED IT (18.0), BED *PILLOW (21.0), SWEAT *UP TO (32.3) are readable, one yellow word each.
- Pills (round 2/3): at 0.5 and 35.23 the A pill is back at y1005, clear of the scene floor line (y960), plant pot and shoe, and the two frames match (loop OK, only end-card badges differ, which is the channel convention). At 8.5 the raised A pill (ring) and B pill have a clear ~15 px gap, no overlap. At 24.5 the pills sit in the same spots as the hook, caption top 1300+.
- Only a cosmetic note, not blocking: the scan bar still passes behind the pills at 8.5 s and 24.5 s.

## What I checked and PASS
- Hook: frame 0.5 shows hero frozen mid-step in the cafe doorway, rerun film strip, x-ray brain with A MEMORY / B DECISION-MAKER pills, and the caption "WHAT HAPPENS". Caption starts at 0.35 s. Nothing empty in the first second. STOP 8 / meta first_frame matches.
- Line 2 has a concrete number: "Ninety-seven percent", 97% pill pops at 2.75 on the word, 100 icons with 3 grey (97 of 100, correct).
- Loop: last frame (35.2) is the same doorway scene, same camera, scale and pill positions as frame 1 (pixel diff of the scene band is zero apart from the end-card badges, caption and strip scroll). No black. End-card badges kept per channel convention. Sweat drop gone by then.
- Length 35.25 s (accepted).
- Tease cut lands on "Next" (30.91 s, S14 starts there); NEXT pill is on screen at the cut. Not before "Next".
- COMMENT A OR B: 44 px text, visible about 1.4 s (25.25-26.4), clear of brain (pill bottom y~178, brain top y~205). PASS.
- Pills vs caption: pills bottom ~y1160 at the lowest (frame 8.50, 25.8), caption top 1245+ (2-line) or 1300+ (1-line). Gap >=80 px. PASS. Frame 1 pills bottom y1140 vs caption top y1245.
- Edge margin at max push: S08 monitor right edge x1026 (54 px margin), S07/S10 icons >=50 px from edges. PASS.
- Captions do not run past cuts (check output: every chunk ends on the cut time). Exactly one yellow word in each chunk in the check list. Captions match the voice text. Spelling OK ("DEJA VU" has no accents in caps, consistent with the font set; title/meta carry the accents).
- Singular/plural: "16 OF 21", "UP TO 4 MILLION" (glands, plural), "97%". OK.
- Facts: 97% (Cleveland Clinic); "lasts over a few seconds or brings confusion, see a doctor" matches Cleveland Clinic and gives no other medical advice; 21 participants, 16 felt it, frontal decision areas lit and memory areas did not (O'Connor/Urquhart, ScienceAlert); up to 4 million glands (Cleveland Clinic, tease). NIGHT is in the ScienceAlert word list (bed, pillow, night, dream). No gore, no seizure visuals.
- Reveals on their words: 97% on "Ninety-seven", RERUN stamp on "rerun", NOW on "now", question mark on "thought", 16 of 21 on "sixteen"/"twenty-one", B check on "decision-maker", magnifier on "fact-checking", wedge on "few", doctor wave on "doctor".

## Director flags, verdicts
- PILLOW 0.14 s, SCIENTISTS 0.18 s, SWEAT 0.16 s: unreadable, fixed by items 1-3.
- Unspoken NIGHT card (lands on "and") and faint "S" card: acceptable. NIGHT is a source word; "S" is a quiet rewatch detail and does not clash with a label. No change.
- Film strip covers the cafe awning in S01 and S15: the awning scallops still read below the strip, frame 1 and last frame match, so it is also loop-safe. No change.
- Scan line behind pills: see item 5, optional.
- S02 100-icon grid: icons ~35 px wide, legible at phone size, "97%" pill above it carries the number. No change.
- kit.js merged with studio rv block: no visual or check problem seen (check prints CHECK OK). Nothing to do.
