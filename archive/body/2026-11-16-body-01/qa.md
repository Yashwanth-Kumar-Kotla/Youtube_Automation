PASS

# QA round 3 (final): 2026-11-16-body-1 "What happens when you lose your voice?"

The round-2 S13 patch is applied and verified:
- `src/shots.js` is byte-identical to the patch I tested.
- `capture.mjs check`: CHECK OK. S12 runs 27.03-29.91 (2.88 s, within the 1-3 s cut rhythm). S13 runs 29.91-32.28 and its cut
  is on "Still" (29.96).
- 29.75 and 29.88: hero with the glass and the WATER pill under "AND SIP WATER".
- 29.95: the 1 WEEK calendar pops in under "STILL HOARSE".
- 30.10: the hoarse bubble is in on "hoarse" (30.04).
- No blank frame, and nothing appears before its cause.
- What else the patch could touch: S13's other beats are tied to word times (Wd), so their absolute times are unchanged:
  2 WEEKS on "two" (30.58, frame 30.7), and doctor plus badge on "See"/"doctor" (frame 31.8). All checked.
- Cues (76) were regenerated: the whoosh is at 29.91 (the cut) and the calendar pop is at 29.96.
- mix.wav is fresh, 38.09 s. That is the 37.99 s duration plus mix.py's fixed 0.1 s tail.

All 6 round-1 fixes still hold (see round 2 below). Engagement beats, facts, captions and no-gore all pass.
Open note for the owner, not blocking: the engine-wide 0.25 s fade from black at frame 0 (see round 1).

---

# QA round 2: 2026-11-16-body-1 "What happens when you lose your voice?"

**FAIL** (one regression, a 2-line fix; I tested it in a scratch copy and it renders clean)

Re-checked: the code for all 6 fixes, the refreshed review/all.jpg, `capture.mjs check` (CHECK OK), and full frames
0.5, 16.9, 24.5, 26.2, 26.6, 28.4, 29.85 and 37.3 (review/qa2/).

## Round-1 fixes
1. Check badge (abPill): **OK.** It sits fully right of the pill, the "K" of BARELY TALK is clear (28.4 s, 37.3 s), and it is
   inside the frame.
2. Croak marks: **OK.** They are white, visible on the navy and fully in frame (0.5 s, 37.3 s).
3. Mouth: **OK.** It holds 'wavy' in S01/S16 and in S07, with no flicker.
4. S11 lens slide: **OK.** The lens is centred from 23.8 s and slides left on "like", so the "=" and SHOUT lens land cleanly
   (24.5 s, 26.6 s).
5. Pills up: **OK.** The B pill no longer covers the lens ring (it just touches it in S16, which is fine), and it is clear of
   BODY FILES.
6. S13 calendar on "Still": **REGRESSION.** The calendar now waits for "Still" (29.96), but the S13 cut is still at 29.71. From
   29.71 to about 30.0 the frame is completely blank: an empty cream screen under the "AND SIP WATER" caption (review/qa2/t29.85.jpg).

## Fix (required)
1. **S13, 29.71-30.0, empty frame.** Move the cut onto the word, so S12 holds until "Still". In the S13 block of
   `src/shots.js`, line ~287:
   - `const st = cut(10)` → `const st = Wd('still', 10) - 0.05`
   - calendar `pop(lt, sl, 0.3)` → `pop(lt, 0, 0.3)` (it pops at the cut, which is now on "Still")

   Leave the `cue(st + sl, 'pop', …)` as is. I tested this in a scratch copy: CHECK OK, S12 runs 27.03-29.91 and S13
   29.91-32.28. At 29.88 s the frame shows the hero with the glass and the WATER pill under "AND SIP WATER". At 29.95 s the
   calendar is popping under "STILL HOARSE". There is no blank frame and nothing appears before its cause.
   Then redo cues and the mix.

## No other regressions
Everything else matches round 1:
- hook and frame 1
- guess answer at 27.52 s (72%)
- re-hook at 20.1 s
- loop end card
- one yellow word per caption
- facts and sources
- no gore

---

# QA: 2026-11-16-body-1 "What happens when you lose your voice?" (round 1)

**FAIL** (small fixes only. Story, timing, facts and captions are good. Re-run QA after the fixes.)

Checked: contact sheet review/all.jpg (0.5 s step) and full frames 0.10, 0.50, 1.00, 16.90, 20.50, 22.90, 24.50, 27.60, 28.40,
32.00, 37.30, 37.95 (review/qa/). Also checked `capture.mjs check` (CHECK OK), words.json, script sources, the STYLE.md QA pitfalls,
and the PLAYBOOK Engagement and Baseline sections.

## Fixes (numbered, all required)
1. **S12 27.52-29.71 and S16 36.06-37.99: the green check covers the "K" of BARELY TALK** (a label overlap).
   In `src/core/kit.js` `abPill`, change `checkMark(w / 2 - 6, -h / 2 + 6, size / 70, ...)` to
   `checkMark(w / 2 + size * 0.55, 0, size / 70, ...)`. The badge then sits fully right of the pill, centred on it vertically,
   and stays inside x 1040. Check 28.4 s and 37.3 s again.
2. **S01 0-2.28 (frame 1) and S16: the croak marks can't be seen.** They are drawn in ink on the navy x-ray background, and they
   reach x of about -3, so they get cut off at the left edge. This is the "mid-croak" premise cue, so it has to show.
   In `kit.js` `croakLines`, add a last parameter `col = C.ink` and use `line(P, col, 10)`. In `hookScene`, call
   `K.croakLines(MOUTH[0] - 130 * XR.s, MOUTH[1] + 4, 0.8, t, croak, -1, C.white)`, which draws them white at 0.8 scale so they
   stay between x 25 and 115.
3. **S01 and S16: the mouth flickers (director flag 6).** `hookScene` switches between 'wavy' and 'o' every ~0.35 s
   (`Math.sin(t*9)`). At t=0 and 0.5 s it shows 'o', which reads as "shocked", not "croaking". Use
   `mouth: croak > 0.5 ? 'wavy' : 'flat'` and drop `talk`, so the croak marks' jitter carries the motion. Do the same in S07
   (line ~173): `mouth: c ? 'wavy' : 'flat'`.
4. **S11 23.80-26.36: the right half is empty for 2.5 s (director flag 3).** Start the whisper lens centred and slide it left on
   "like": `const lx = lerp(540, LA[0], eio(seg(lt, li - 0.3, li)));` Use `lx` instead of `LA[0]` for `throatLens`, the "shh"
   bubble (x `lx + 150`, tail `lx + 40`) and the WHISPER pill. The "=" (on "like") and the SHOUT lens (on "shouting") are
   unchanged.
5. **S01, S12 and S16: the B pill covers the top of the lens ring (about 10 px).** Move both pills up:
   `PA = [540, 240], PB = [540, 388]`. The A pill top (~179) stays clear of the BODY FILES badge (bottom ~150) in S16, and
   COMMENT A OR B at y 545 is unaffected.
6. **S13 29.71-29.96: the 1 WEEK calendar shows while the caption still reads "AND SIP WATER"** (it appears before its cause).
   Pop the calendar on "Still": `pop(lt, Wd('still', 10) - st, 0.3)` instead of `pop(lt, 0, 0.3)`.

## Director flags: verdicts
1. Frame 1 busy: **OK.** It shows the hero, the lens and the A/B pills, which is exactly what the PLAYBOOK asks for (premise and
   guess options), and it reads in one glance. Fixes 2, 3 and 5 are the only frame-1 changes.
2. "HUNDREDS OF BUZZES/SEC" at 24 px: **OK, keep it.** It is the rewatch detail, so it is meant to be small. It reads at full
   size, it is sourced (Cleveland Clinic, "hundreds of times per second"), and it doesn't collide with anything.
3. Right side empty 23.8-26.36: **fix 4.**
4. "AT *WORK THE": **keep as is.** No valid regroup exists. "AT WORK" would show for 0.32 s (16.73-17.05) and "WORK THE" for
   0.38 s, both under the 0.4 s minimum. "THEN CROAKED AT WORK" is 4 words, over the 1-3 word limit.
5. S12 pill readability: **readable.** The dimmed A is still legible and B is highlighted. The only problem is the check
   covering the K, which is fix 1.
6. Croak mouth flicker: **fix 3.**

## Passed checks
- Hook: frame 1 has the premise and the A/B pills. The caption is in at 0.35 s, and the croak jitter, the "lose" boing and the
  "voice" eyes and lens bump keep it moving through the first second.
- Words and picture match, and reveals land on their word: 100s on "hundreds" (6.6), virus on "cold", SWOLLEN on "swells",
  red X on "cleanly", wave dies on "vanishes", screaming on "screamed", clock on "morning", yelling head on "yelling",
  dive-in by "part", the cords close on "whispering", NHS SAYS on "NHS", SHOUT on "shouting", check on "B" (27.52), glass on
  "sip", WATER on "water", 2 WEEKS on "two", doctor on "See", can on "energy", 6x on "six".
- Captions: exactly one starred word per chunk, all words spelled right. (Engine note: the apostrophe in "HERE'S" renders with
  a wide gap at 20.5 s. It is cosmetic and not for this video.)
- Engagement:
  - Guess: A/B pills in frame 1, and the answer at 27.52 s is 72% in, inside the last 30%.
  - Relatable beat: the concert and work lines (14.2-19.7).
  - Re-hook: line 7 at 20.1 s (53%) has a clear visual change, the zoom into the neck.
  - Rewatch detail: the label, the puffy cords in frame 1, and the cords still closing on "whispering".
  - Loop: S16 matches the frame-1 framing with B checked, and the tease stays last.
  - COMMENT A OR B shows for about 1 s at 27.9 s, is not voiced, and is not in the first 3 s.
- Facts match the sources:
  - Cleveland Clinic: vocal cords vibrate hundreds of times per second; swelling distorts the vibration.
  - NHS and Cleveland Clinic: a cold or yelling can cause it.
  - NHS: "do not talk loudly or whisper – both strain your voice", "speak as little as possible", drink fluids, see a GP
    after 2 weeks.
  - FDA: energy drinks range from 54 to 328 mg (about 6x).
- Medical advice: "barely talk, and sip water" is NHS self-care advice taken from the sources, with no drugs or doses, and the
  only other advice is "see a doctor". Acceptable.
- No gore.
- Key action stays above y 1250. Only the legs and lower bodies pass behind the caption.

## Note for the owner/template (not part of this video's fixes)
`src/main.js` fades in from black over 0.25 s, so the true frame 0 is black and the frame at 0.1 s is still about 70% dark.
The PLAYBOOK wants frame 1 to show the premise. Consider shortening this fade to about 0.08 s, or removing it, in the engine
for every channel.
