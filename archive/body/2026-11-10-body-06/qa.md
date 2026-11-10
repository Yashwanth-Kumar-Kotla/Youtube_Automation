PASS

Round 2 · body · 2026-11-10-body-6 · foot falls asleep (explainer) · 34.91 s, 16 shots

## Fix list
None. The round-1 fix is verified:
1. S07 (src/shots.js lines 152 and 157): pk is now gated to lt < nb + 0.9, the arm only draws when pk > 0.01, and its tip runs lerp(-140, 290). Frames checked:
   - 14.3 s: no arm.
   - 14.4 s: the fingertip is sliding in from the left edge (motion, not a stub).
   - 14.6 s: the finger touches the heel as the foot goes pale.
   - 15.3 and 15.7 s: no skin at the left edge.
   Fresh contact sheet, regression scan: unchanged everywhere else.

## Checked and OK
- Hook: at 0.5 s the hero sits cross-legged, the lens shows the sleepy foot and the caption "WHAT HAPPENS" is up (0.35 s). At 1.0 s "WHEN YOUR FOOT" is up and the foot wiggles. Nothing is static or empty.
- Sync (checked against data/words.json): the X lands on "isn't", the nerve snaps on "lost", the "?" appears on "brain", eyes pop on "wake-up", the pinch and NERVE tag come on "squash"/"nerve", the signal is blocked on "stop", the hero stands on "stand", the shin lifts on "lets go", the nerve lights on "nerve"/"wakes", pins on "pins", the three badges each land on their word, the stopwatch on "fades" with "1-2 MIN" on "two", the doctor badge on "doctor", the tooth and NEXT on "tooth", milk on "milk", sparkles and wink on "save". Nothing appears before its cause.
- Captions: 41 chunks. Every one is at least 0.4 s; the shortest are THAT *FEELING (0.46), WHAT *HAPPENS (0.48) and THEN YOU *STAND (0.48). Each has exactly one yellow word. The regrouped line 11 checks out: NEXT *BODY FILE 1.26 / WHAT *HAPPENS IF 0.58 / YOU KNOCK *OUT 0.54 / A *TOOTH 0.73. Spelling is right ("LETS GO" is the verb, correct without an apostrophe). Captions match the spoken words.
- Collisions: the NERVE tag (S05), the feeling badges and labels (S11), the 1-2 MIN pill (S12), the doctor badge (S13), the BODY FILES / + FOLLOW / NEXT pills (S14-S16), and the S08 lens with its arrow are all clear of the caption zone (y about 1250-1540) and of each other. NEXT, the tooth and the milk glass sit below the window frame and don't touch it.
- Facts against sources: pressure squashes a nerve (NINDS, CC, The Conversation); lost touch with the brain, numb and hard to move (The Conversation: "lose feeling and control"); release, the nerve wakes, pins and needles (The Conversation, CC); tingling/prickling/burning (CC, NINDS); "a minute or two" / 1-2 MIN (The Conversation); see a doctor if often or won't go away (CC). Every meta.json description claim is sourced: blood flow (CC), no permanent damage (The Conversation), temporary paresthesia (NINDS/CC). No medical advice beyond "see a doctor".
- Safety: burning is shown only as a flame symbol in a badge, never on skin. No injury imagery. The tooth is clean and white, no blood. The end card is uncluttered. The hero ends on a warm grin (34.0 s) before the fade.
- Render safety: dense pass (OP.draw at every 1/120 s, 0-34.91 s, about 4190 frames) gave **0 exceptions, 0 console errors, CHECK OK**.
