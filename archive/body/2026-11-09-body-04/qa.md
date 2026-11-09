PASS

QA round 2 for 2026-11-09-body-4 (body, inside-out, "What Happens If You Crack Your Knuckles Every Day?", 43.00 s, 18 shots).
I regenerated the contact sheet at review/all.jpg (86 frames, 0.5 s step) and read these frames full size: 12.0, 12.3, 12.8, 16.2, 16.4,
16.55, 16.8 and 17.1. `capture.mjs check` prints CHECK OK.

## Round-1 fixes, verified
1. **S07 cork (was frozen in mid-air from 16.59 to 17.25 s): fixed.** The cork pops on "uncorking", then flies up and to the right
   at about (520, 720) at 16.4 and (570, 700) at 16.55, fading as it goes. It is gone at 16.8 and 17.1. It never stops, and it stays
   below the capsule (bottom edge at y ≈ 605). The bottle and the "A BOTTLE" caption are clean through the cut at 17.25.
2. **S06 "*PULL" caption (was up for only 0.20 s): fixed.** The chunks are now `*PULL THE JOINT` 11.93–12.53, `*APART` 12.53–13.11
   and `THE SPACE *WIDENS` 13.11–14.22. Each starts on a real spoken word ("Pull" 11.98, "apart" 12.58, "the" voiced from about 13.06),
   each has one yellow word, and each stays up long enough to read. The pull arrows on "pull" match the caption.

## Regression scan
Every other frame on the sheet matches round 1. The hook, all reveal timings, LEFT/RIGHT consistency across S11–S13, captions
(one yellow word each, spelling right, nothing in the caption band), facts vs sources and meta.json, the no-gore rule, and the end
card (face mid-sneeze with eyes shut, "?", NEXT, hero ends warm) are unchanged and still OK. Cues and mix are unchanged, so the
round-1 audio checks stand, including the verified "Everyone" 3.06 and "Next" 36.14 corrections.

## Fix list
None.
