PASS

QA for 2026-11-15-body-1 (body, inside-out), "What Happens When Your Stomach Growls?", 36.08 s, 16 shots. Date 2026-11-15.

Checks run
- I regenerated the contact sheet: `node tools/capture.mjs sheet review/all.jpg 0.5 10` (72 frames).
- Dense pass: dense_b4.mjs pointed at this folder drew every 1/120 s, 0 to 36.08. CHECK OK, no exceptions.
- Full-size frames (review/qa/) at 0.5 (hook), 6.75 (twist), 12.75, 15.25, 20.0, 24.0, 29.25 (CTA), 31.9, 33.4, 34.4, 36.05 (last).
- Cut frames (review/cuts.jpg): each of the 15 cuts at -0.03, +0.04 and +0.2 s.
- Hook motion: frame-to-frame PSNR over 0 to 1.2 s, top 1100 px, is 18 to 28 dB, so the picture is not static (camera push and arm move).
- "Hunger" correction (2.44 to 2.70) checked against the narration.wav envelope: silence runs 2.16 to 2.40 and the word's energy runs 2.42 to 2.72. The timing is correct. The caption "*HUNGER CAN KICK" starts at 2.39.

Hook: OK. By 0.5 s the frame shows the hero, the stomach lens and the caption "WHAT HAPPENS WHEN". GRRR, the shake and the wide eyes all land on "growls" (1.6 s).

Sync: OK. Every reveal lands on its word, and nothing appears before its cause:
- Clock wedge 0 to 2 h on "two hours". Empty plate ring on "eat".
- GAS pill at 8.04, FLUID pill at 8.64, arrow on "move".
- Squeeze bands on "pushed" and "muscles". Rings on "stomach" and "intestines".
- Gauge drops to E on "empty". Messenger leaves on "sets" and reaches the brain after "hormone".
- Wince and swirls on "pangs". Clock whizz on "any".
- Puffs on "air", can pops on "fizzy", buddy rumbles on "too". Lower-gut ring on "low".
- Brown bits on "food". Mini-lens on "intestines" (25.18). Check pops on "working".
- Nose and drop on "nosebleed". Heater on "dry", warm lines on "air". Grin and + FOLLOW on "cause".

Captions: OK.
- 35 chunks. All spoken words appear in order. "2" for "two" is the planned E1-A numeral.
- Exactly one yellow word per chunk. Shortest chunk is 0.50 s (SWALLOWED AIR). No spelling errors.
- No action and no labels in the caption zone. Key action stays above y 1250. Room floor is at 1120.

Labels: OK. GAS, FLUID, E/F gauge and the 2-hour clock match the narration.

Facts: OK. Script and meta.json description checked against the sources:
- Cleveland Clinic: 2 h, gas and fluid, muscle contractions, ghrelin when empty, any time, swallowed air and fizzy drinks, lower abdomen means food in the intestines, dry air is the most common nosebleed cause.
- MedlinePlus: normal digestion, "the GI tract is working".
- No medical advice.

Tone: OK. No gore. Food bits are clean brown ovals, and the nosebleed is one small clean drop. The hero ends with a warm grin to camera. The end card shows only badge, lens (nose + drop + heater), NEXT and + FOLLOW.

STYLE.md QA pitfalls: no partial x-ray. No floating props: the burger is on the plate and the can stands on its own. No moving thing crosses a label (GAS/FLUID pills sit below the tube, the messenger has its own dashed lane). No caption lands early.

Fix list (blocking): none.

Optional polish (non-blocking, do not hold the video):
1. S15 / S16, 33.20 to 36.08: the white radiator heater reads faint on the cream lens. If touched again, use a warm orange or grey body so "heater" reads at a glance.
2. S09, 19.9 to 20.5: the leftmost air puff starts slightly off the left edge (x < 0). If touched again, start the puffs at x ≥ 40.
