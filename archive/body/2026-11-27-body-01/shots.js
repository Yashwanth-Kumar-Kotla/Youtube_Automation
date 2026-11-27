// WHAT HAPPENS WHEN YOU HIT SNOOZE?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): dark bedroom, the hero propped up in bed, eyes shut, his hand mid-slap over a phone on
// the nightstand whose big SNOOZE button glows (lock screen note "Snoozed x3" = rewatch detail, paid off on line 4),
// a yellow "56% OF NIGHTS" pill up top, pills A GROGGIER / B SHARPER on the bed front. No title card.
// Cuts sit on caption-chunk starts (word start - 0.05) so no caption runs past a cut.
// Guess (S04): groggy head vs sharp head, A / B pop on "Groggier" / "sharper". Re-hook (S09): new scene, the night's sleep
// strip, hard push toward morning. Answer (S12): same heads, check on B on "sharper", COMMENT A OR B ~1.2 s across S12-S13.
// Tease (S15, from "Next"): hangry hero + growling stomach + NEXT. Loop (S16 "Still in bed?"): back to the exact frame-1
// picture (scene clock wraps so the last frame = frame 0), end-card badges on top.
import { ctx, C, W, H, TAU, clamp, lerp, seg, eo, eio, eob, line, bigText, rr, circle } from './core/lib.js';
import { T, Wd } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const at = (w, i) => Wd(w, i) - 0.05;          // cut = the caption chunk's start
  const plain = (col = C.bg) => { ctx.fillStyle = col; ctx.fillRect(-300, -300, W + 600, H + 600); };
  const pop = (lt, a, d = 0.3) => (lt > a ? eob(seg(lt, a, a + d)) : 0);
  const out = (lt, a, d = 0.25) => 1 - eio(seg(lt, a, a + d));
  const blip = (lt, a, d = 0.35) => (lt > a ? Math.sin(Math.PI * seg(lt, a, a + d)) : 0);
  const enter = (lt) => lerp(0.86, 1, eob(seg(lt, 0, 0.25)));
  const T_LAST = (Math.ceil(T.dur * 30 - 1e-6) - 1) / 30;   // time of the film's last rendered frame

  // ── the hook set: night bedroom, hero propped up in bed, phone on the nightstand (frame 1 + loop) ──
  const BX = 470, BY = 900, BS = 0.8, HOOK_CAM = [540, 760];
  const HERO = { x: 520, y: 700, s: 0.78 };
  const FLOOR = BY + 330 * BS;
  const PH = [900, 950 - 280 * 0.55], PH_S = 0.55;
  const HOVER = { e: [260, -40], h: [345, 95] }, SLAP = { e: [330, 0], h: [487, 168] }, REST = { e: [250, 40], h: [330, 160] };
  const hookBed = (tl, { arm = HOVER, press = 0, ring = 1, glow = 1, face = {}, motion = 1 } = {}) => {
    K.nightHome();
    ctx.fillStyle = '#3B4253'; ctx.fillRect(-300, FLOOR, W + 600, 900);
    K.nightstand(PH[0], 950, 0.85);
    K.szPhone(PH[0], PH[1], PH_S, { press, glow, ring, t: tl });
    K.hbBedBack(BX, BY, BS, { books: 0, pillows: 2, t: tl });
    ctx.save(); ctx.beginPath(); ctx.rect(-300, -300, W + 600, BY - 40 + 300); ctx.clip();
    K.man({ ...HERO, arm, eyes: 'closed', mouth: 'flat', brow: 0.2, tired: 1, look: 0.4, ...face });
    ctx.restore();
    K.hbBedFront(BX, BY, BS);
    if (motion > 0) {   // slap motion lines above the hovering hand
      const hx = HERO.x + arm.h[0] * HERO.s, hy = HERO.y + arm.h[1] * HERO.s;
      ctx.save(); ctx.globalAlpha = clamp(motion);
      for (const k of [-1, 0, 1]) line([[hx - 40 + k * 26, hy - 50 - k * 26], [hx - 78 + k * 26, hy - 88 - k * 26]], C.white, 9);
      ctx.restore();
    }
  };
  const PA = [290, 1100], PB = [790, 1100], PS = 40;
  const hookPills = (sc, o = {}) => { K.abPill('A', 'GROGGIER', PA[0], PA[1], PS, { sc, ...o.a }); K.abPill('B', 'SHARPER', PB[0], PB[1], PS, { sc, ...o.b }); };
  const hookTag = (sc, hi = 0) => K.pill('56% OF NIGHTS', 470, 190, 52, C.yellow, C.ink, sc * (1 + 0.08 * hi));

  // ── 1 · HOOK "What happens when you hit snooze?" ──
  {
    const hi = Wd('hit', 0), sn = Wd('snooze', 0);
    add({ id: 'S01', at: 0, cam: HOOK_CAM, zoom: 0.05, note: 'FRAME 1 = hook: dark bedroom, hero propped up in bed (eyes shut), hand mid-slap over the phone on the nightstand, its SNOOZE button glowing, phone ringing; "56% OF NIGHTS" pill + A GROGGIER / B SHARPER pills, all from frame 0 (rewatch: lock screen "Snoozed x3"); the hand slaps the button on "hit" (ringing stops), burst + pill bounce on "snooze"',
      draw(lt, d, t) {
        const k = eio(seg(lt, hi - 0.12, hi)), pr = lt > hi - 0.02 ? 1 : 0;
        hookBed(t, { arm: K.armPose(HOVER, SLAP, k), press: pr, ring: lt < hi ? 1 : 0, motion: 1 - seg(lt, hi - 0.1, hi) });
        K.burst(PH[0], PH[1] + 40, 0.9, blip(lt, sn, 0.45));
        hookTag(1, blip(lt, sn, 0.4));
        hookPills(1);
      } });
    cue(0.0, 'alarm', { dur: 1.0, gain: 0.25 }); cue(hi, 'thud', { gain: 0.6 }); cue(sn, 'pop', { gain: 0.45 });
  }

  // ── 2a · "In one app study, fifty-six percent of nights" ──
  {
    const st = at('in', 1), ap = Wd('app', 1) - st, sy = Wd('study', 1) - st, fs = Wd('fifty', 1) - st, pc = Wd('percent', 1) - st, ni = Wd('nights', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 640], zoom: 0.08, note: 'sleep-app card with 25 night tiles (moons) on screen at the cut; card bounces on "app", "APP STUDY" pill on "study"; from "fifty-six" 14 of 25 tiles light up yellow with bells while a counter climbs to 56%, big yellow 56% on "percent"; the tiles pulse + "OF NIGHTS" pill on "nights"',
      draw(lt, d, t) {
        plain();
        const hiN = 14 * eio(seg(lt, fs, pc + 0.35));
        K.szNightGrid(540, 660, 620, { hi: hiN, sc: enter(lt) * (1 + 0.05 * blip(lt, ap, 0.35)), pulse: blip(lt, ni, 0.4) });
        K.pill('APP STUDY', 540, 215, 50, C.ink, C.white, pop(lt, sy) * out(lt, fs - 0.1, 0.15));
        if (lt > fs - 0.1) K.pill(`${Math.round(56 * eio(seg(lt, fs, pc + 0.35)))}%`, 540, 215, 84 * (1 + 0.15 * blip(lt, pc, 0.4)), C.yellow, C.ink, pop(lt, fs - 0.1, 0.2));
        K.pill('OF NIGHTS', 540, 1110, 52, C.ink, C.white, pop(lt, ni));
      } });
    cue(st, 'whoosh'); cue(st + ap, 'boing', { gain: 0.3 }); cue(st + sy, 'pop', { gain: 0.45 }); cue(st + fs, 'tock', { gain: 0.3 }); cue(st + fs + 0.4, 'tock', { gain: 0.3 });
    cue(st + pc, 'pop', { gain: 0.6 }); cue(st + ni, 'pop', { gain: 0.45 });
  }

  // ── 2b · "ended in snooze." ──
  {
    const st = at('ended', 1), sn = Wd('snooze', 1) - st;
    const PX = 520, PY = 730, PSZ = 1.2;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.06, note: 'phone close-up, ringing, a hand hovering over its glowing SNOOZE button (on screen at the cut), "56%" pill on top; the hand slaps the button on "snooze" (ringing stops, burst, motion lines)',
      draw(lt, d, t) {
        plain('#2A3346');
        const k = eio(seg(lt, sn - 0.14, sn)), pr = lt > sn - 0.02 ? 1 : 0;
        K.szPhone(PX, PY, PSZ * enter(lt), { press: pr, ring: lt < sn ? 1 : 0, t });
        K.burst(PX, PY + 84, 1.3, blip(lt, sn, 0.45));
        const hx = lerp(800, 600, k), hy = lerp(670, 830, k);
        if (k < 1) { ctx.save(); ctx.globalAlpha = 1 - k; for (const q of [-1, 0, 1]) line([[hx + 70 + q * 40, hy - 50 + q * 40], [hx + 130 + q * 40, hy - 110 + q * 40]], C.white, 12); ctx.restore(); }
        K.reachArm(1250, 1060, hx, hy, 1.6);
        K.pill('56%', 520, 180, 80, C.yellow, C.ink, 1);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'alarm', { dur: sn - 0.05, gain: 0.22 }); cue(st + sn, 'thud', { gain: 0.6 }); cue(st + sn + 0.03, 'pop', { gain: 0.4 });
  }

  // ── guess / answer heads (S04, S12) ──
  const GA = [290, 600], GB = [790, 600], GPA = [290, 960], GPB = [790, 960], GPS = 44;
  const heads = (t, lt, { bA = 0, bB = 0, dimA = 0 } = {}) => {
    plain();
    ctx.save(); ctx.globalAlpha = 1 - 0.45 * dimA;
    K.heroHead(GA[0], GA[1] - 30 * bA, 1.35, { eyes: 'n', tired: 1, mouth: 'flat', brow: 0.1 });
    K.zzz(GA[0] + 90, GA[1] - 170, t, 1, 70);
    ctx.restore();
    K.burst(GB[0], GB[1] - 10, 1.6, 0.9);
    K.heroHead(GB[0], GB[1] - 30 * bB, 1.35, { eyes: 'wide', mouth: 'grin', brow: 0.9 });
  };

  // ── 2c · GUESS "Groggier, or sharper?" ──
  {
    const st = at('groggier', 1), gr = Wd('groggier', 1) - st, sh = Wd('sharper', 1) - st;
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.07, note: 'GUESS: two hero heads on screen at the cut, groggy (heavy lids, Zzz) left vs sharp (wide eyes, grin, yellow burst) right; A GROGGIER pops under the left one on "Groggier" (head bobs), B SHARPER under the right one on "sharper"',
      draw(lt, d, t) {
        heads(t, lt, { bA: blip(lt, gr, 0.35), bB: blip(lt, sh, 0.35) });
        bigText('?', 540, 620, 130, C.yellow, 0.1, enter(lt));
        K.abPill('A', 'GROGGIER', GPA[0], GPA[1], GPS, { sc: pop(lt, gr), hi: blip(lt, gr, 0.4) });
        K.abPill('B', 'SHARPER', GPB[0], GPB[1], GPS, { sc: pop(lt, sh), hi: blip(lt, sh, 0.4) });
      } });
    cue(st, 'whoosh'); cue(st + gr, 'pop', { gain: 0.65 }); cue(st + sh, 'pop', { gain: 0.65 });
  }

  // ── the head cutaway (S05, S06) ──
  const HX = 470, HY = 960, HS = 1.05, BR = [HX + K.HC.brain[0] * HS, HY + K.HC.brain[1] * HS], BRS = 0.56 * HS;

  // ── 3 · "The alarm hits, but your brain isn't fully awake." ──
  {
    const st = at('the', 2), al = Wd('alarm', 2) - st, hi = Wd('hits', 2) - st, br = Wd('brain', 2) - st, aw = Wd('awake', 2) - st;
    add({ id: 'S05', at: st, cam: [500, 640], zoom: 0.1, note: 'cutaway head (skull open, brain inside) + a phone top right, on screen at the cut; the phone rings on "alarm", shock lines + burst at the head on "hits"; on "brain" a yellow ring + grey fog puffs settle over the back half; on "awake" yellow sparks light only the front half + "HALF AWAKE" pill',
      draw(lt, d, t) {
        plain();
        K.headCut(HX, HY, HS, { t, brainHi: blip(lt, br, 0.6) });
        K.szBrainFog(BR[0], BR[1], BRS, { fog: eo(seg(lt, br, br + 0.5)), lit: pop(lt, aw), t });
        const ring = lt > al ? 1 : 0;
        K.szPhone(860, 330, 0.48 * enter(lt), { ring, t, glow: 1 });
        K.shockLines(BR[0], BR[1], 260, blip(lt, hi, 0.5));
        K.pill('HALF AWAKE', 470, 450, 54, C.ink, C.white, pop(lt, aw + 0.05));
      } });
    cue(st, 'whoosh'); cue(st + al, 'alarm', { dur: hi - al + 0.3, gain: 0.3 }); cue(st + hi, 'slam', { gain: 0.4 }); cue(st + br, 'pop', { gain: 0.4 });
    cue(st + br + 0.1, 'sparkle', { dur: 0.4, gain: 0.15 }); cue(st + aw, 'pop', { gain: 0.55 });
  }

  // ── 4a · "That fog is sleep inertia," ──
  {
    const st = at('that', 3), fo = Wd('fog', 3) - st, sl = Wd('sleep', 3) - st, ie = Wd('inertia', 3) - st;
    add({ id: 'S06', at: st, cam: [BR[0], BR[1]], zoom: 0.22, note: 'closer on the cutaway brain (half fogged, on screen at the cut); on "fog" the fog rolls over the whole brain and the sparks fade; "SLEEP INERTIA" tag drops onto the brain on "inertia" (bounces on "sleep")',
      draw(lt, d, t) {
        plain();
        K.headCut(HX, HY, HS, { t });
        K.szBrainFog(BR[0], BR[1], BRS, { fog: 1, all: eo(seg(lt, fo - 0.05, fo + 0.6)), lit: 1 - seg(lt, fo, fo + 0.3), t });
        K.tag('SLEEP INERTIA', 520, 330, BR[0] + 40, BR[1] - 120, 54, pop(lt, ie));
      } });
    cue(st, 'whoosh'); cue(st + fo, 'sparkle', { dur: 0.6, gain: 0.25 }); cue(st + ie, 'pop', { gain: 0.6 });
  }

  // ── 4b · "and it can last up to an hour." ──
  {
    const st = at('and', 3), la = Wd('last', 3) - st, ho = Wd('hour', 3) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.08, note: 'fog gauge 0-60 MIN (on screen at the cut) under a small groggy hero head; from "last" the needle sweeps and grey fog fills the dial up to 60 on "hour" (yellow halo on the 60 end) + "UP TO 1 HOUR" pill',
      draw(lt, d, t) {
        plain();
        const m = 60 * eio(seg(lt, la, ho + 0.1));
        K.heroHead(540, 380, 0.9, { eyes: 'n', tired: 1, mouth: 'flat', brow: 0.1 });
        K.szFogGauge(540, 860, 1.25, { mins: m, sc: enter(lt), hi: pop(lt, ho, 0.3) });
        K.pill('UP TO 1 HOUR', 540, 1060, 56, C.ink, C.white, pop(lt, ho + 0.05));
      } });
    cue(st, 'whoosh'); cue(st + la, 'slide', { dur: ho - la + 0.1, gain: 0.3 }); cue(st + ho, 'pop', { gain: 0.6 });
  }

  // ── 5 · RELATABLE "Ever hit snooze without remembering it?" ──
  {
    const st = at('ever', 4), sn = Wd('snooze', 4) - st, re = Wd('remembering', 4) - st;
    add({ id: 'S08', at: st, cam: [540, 640], zoom: 0.1, note: 'RELATABLE + rewatch payoff: the hero\'s head (left) looking at his phone (right), lock screen note now big: "Snoozed x3" (on screen at the cut); the note gets a yellow highlight + bounce on "snooze"; on "remembering" his eyes go wide, brows up and a big "?" pops over his head',
      draw(lt, d, t) {
        plain();
        const sur = lt > re;
        K.heroHead(300, 660, 1.45, { eyes: sur ? 'wide' : 'n', look: sur ? 0 : 1, lookY: sur ? 0 : 0.6, tired: sur ? 0 : 0.8, mouth: sur ? 'o' : 'flat', brow: sur ? 1 : 0.2 });
        bigText('?', 300, 300, 170, C.yellow, -0.12, pop(lt, re));
        K.szPhone(790, 670, 0.95 * enter(lt) * (1 + 0.04 * blip(lt, sn, 0.4)), { glow: 0.6, t, noteSize: 40, noteHi: pop(lt, sn, 0.25) });
      } });
    cue(st, 'whoosh'); cue(st + sn, 'pop', { gain: 0.55 }); cue(st + re, 'boing', { gain: 0.45 });
  }

  // ── sleep strip helpers ──
  const moon = (x, y, s) => { circle(x, y, 66 * s, C.navy); circle(x - 4 * s, y + 4 * s, 40 * s, C.gum); circle(x + 14 * s, y - 8 * s, 36 * s, C.navy); };

  // ── 6a · RE-HOOK "But here's the twist:" (new scene: the whole night as a sleep strip, hard push to morning) ──
  {
    const st = at('but', 5), he = Wd('here', 5) - st, tw = Wd('twist', 5) - st;
    add({ id: 'S09', at: st, cam: [880, 640], zoom: 0.3, note: 'RE-HOOK, new scene: the whole night as a sleep strip (deep navy, light pale, REM purple bars) from a moon (left) to a sun (right), big purple REM block near morning, on screen at the cut; hard push toward the morning end; "YOUR NIGHT" pill on "here\'s"; a red ringing alarm bell drops onto the morning end + yellow burst on "twist"',
      draw(lt, d, t) {
        plain();
        moon(230, 400, 1); K.sun(940, 400, 0.4, t);
        K.szSleepStrip(100, 560, 880, 320, { sc: 1 });
        K.pill('YOUR NIGHT', 560, 260, 50, C.ink, C.white, pop(lt, he));
        const b = pop(lt, tw);
        K.burst(880, 520, 1.1, blip(lt, tw, 0.5));
        if (lt > tw) K.szBell(880, lerp(380, 500, eo(seg(lt, tw, tw + 0.25))) + Math.sin(t * 40) * 3, 1.3 * b, C.red);
      } });
    cue(st, 'whoosh'); cue(st + he, 'pop', { gain: 0.4 }); cue(st + tw, 'slam', { gain: 0.5 }); cue(st + tw + 0.05, 'alarm', { dur: 0.5, gain: 0.25 });
  }

  // ── 6b · "snooze sleep is only light sleep," (zoomed on the morning end) ──
  {
    const st = at('snooze', 5), sn = Wd('snooze', 5) - st, li = Wd('light', 5) - st;
    const W0 = 3143, X0 = 100 - 0.72 * W0;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.08, note: 'zoomed on the morning end of the strip: the big purple REM block (on screen at the cut); on "snooze" three red alarm bells drop in and three pale short light-sleep bands carve into the block under them; yellow outline on the bands + "LIGHT SLEEP" tag on "light"',
      draw(lt, d, t) {
        plain();
        const ch = eo(seg(lt, sn, sn + 0.5));
        K.sun(940, 300, 0.4, t);
        const s = K.szSleepStrip(X0, 560, W0, 420, { chop: ch, bells: seg(lt, sn, sn + 0.45), lightHi: pop(lt, li, 0.25) });
        K.tag('LIGHT SLEEP', 400, 1100, s.bands[0], 980 - 0.42 * 420 + 40, 54, pop(lt, li));
      } });
    cue(st, 'whoosh'); cue(st + sn, 'alarm', { dur: 0.45, gain: 0.25 }); cue(st + sn + 0.1, 'thud', { gain: 0.3 }); cue(st + sn + 0.25, 'thud', { gain: 0.3 }); cue(st + sn + 0.4, 'thud', { gain: 0.3 }); cue(st + li, 'pop', { gain: 0.6 });
  }

  // ── 7 · "and it breaks up the dream-rich sleep you get near morning." ──
  {
    const st = at('and', 6), bk = Wd('breaks', 6) - st, dr = Wd('dream', 6) - st, mo = Wd('morning', 6) - st;
    const W0 = 1500, X0 = 90 - 0.4 * W0;
    add({ id: 'S11', at: st, cam: [640, 640], zoom: 0.08, note: 'wider strip (last part of the night) with the snooze bands already in the REM block (on screen at the cut); on "breaks" red crack marks flash at the bands + the block shakes; "DREAM-RICH" tag + tiny "NIH: MOST DREAMING" note + yellow outline on the REM pieces on "dream-rich"; the sun rises over the morning end on "morning"',
      draw(lt, d, t) {
        plain();
        const sy = lerp(620, 330, eo(seg(lt, mo - 0.1, mo + 0.4)));
        if (lt > mo - 0.1) K.sun(870, sy, 0.45, t);
        const sh = blip(lt, bk, 0.4) * Math.sin(t * 60) * 8;
        ctx.save(); ctx.translate(sh, 0);
        const s = K.szSleepStrip(X0, 600, W0, 380, { chop: 1, bells: 1, remHi: pop(lt, dr, 0.25) });
        ctx.restore();
        const cr = blip(lt, bk, 0.6);
        if (cr > 0) for (const bx of s.bands) for (const sd of [-1, 1]) {
          const x = bx + sd * 46, P = [[x, 700], [x + 16 * sd, 760], [x - 6 * sd, 820], [x + 14 * sd, 880]];
          ctx.save(); ctx.globalAlpha = cr; line(P, C.ink, 16); line(P, C.red, 8); ctx.restore();
        }
        K.tag('DREAM-RICH', 380, 330, s.rem[0] + 60, s.rem[2] - 20, 56, pop(lt, dr));
        K.pill('NIH: MOST DREAMING', 380, 420, 26, C.white, C.ink, pop(lt, dr + 0.1));
      } });
    cue(st, 'whoosh'); cue(st + bk, 'slam', { gain: 0.45 }); cue(st + dr, 'pop', { gain: 0.55 }); cue(st + mo, 'sparkle', { dur: 0.5, gain: 0.25 });
  }

  // ── 8a · ANSWER "Answer: sharper," ──
  const COMMENT = [540, 1110];
  {
    const st = at('answer', 7), sh = Wd('sharper', 7) - st;
    add({ id: 'S12', at: st, cam: [540, 700], zoom: 0.06, note: 'ANSWER: the guess heads + both pills in the same spots (on screen at the cut); on "sharper" the check lands on B SHARPER, A dims, the sharp head bounces; COMMENT A OR B pill pops 0.25 s later and stays into the next shot (~1.2 s total, not voiced)',
      draw(lt, d, t) {
        heads(t, lt, { bB: blip(lt, sh, 0.35), dimA: seg(lt, sh, sh + 0.3) });
        K.abPill('A', 'GROGGIER', GPA[0], GPA[1], GPS, { sc: 1, dim: seg(lt, sh, sh + 0.3) });
        K.abPill('B', 'SHARPER', GPB[0], GPB[1], GPS, { sc: 1, check: pop(lt, sh, 0.3), hi: blip(lt, sh, 0.45) });
        K.pill('COMMENT A OR B', COMMENT[0], COMMENT[1], 46, C.ink, C.yellow, pop(lt, sh + 0.25, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + sh, 'pop', { gain: 0.8 }); cue(st + sh + 0.25, 'pop', { gain: 0.3 });
  }

  // ── 8b · "in a lab test of regular snoozers." ──
  {
    const st = at('in', 7), la = Wd('lab', 7) - st, te = Wd('test', 7) - st, re = Wd('regular', 7) - st, sn = Wd('snoozers', 7) - st;
    add({ id: 'S13', at: st, cam: [540, 640], zoom: 0.07, note: 'lab-test card (two score bars NO SNOOZE vs SNOOZE, fine print "31 REGULAR SNOOZERS · 30 MIN") on screen at the cut, B SHARPER + check pill above, COMMENT A OR B pill carried over until ~0.65 s; card bounces on "lab", the SNOOZE bar ticks up + arrow on "test"; yellow ring on the fine print on "regular"; "REGULAR SNOOZERS" pill on "snoozers"',
      draw(lt, d, t) {
        plain();
        K.abPill('B', 'SHARPER', 540, 200, 44, { sc: 1, check: 1 });
        K.szLabCard(540, 650, 1.0 * enter(lt) * (1 + 0.04 * blip(lt, la, 0.35)), { up: eo(seg(lt, te, te + 0.5)) });
        K.hiRing(540, 940, 215, 24, pop(lt, re, 0.25));
        K.pill('COMMENT A OR B', COMMENT[0], COMMENT[1], 46, C.ink, C.yellow, out(lt, 0.6, 0.15));
        K.pill('REGULAR SNOOZERS', COMMENT[0], COMMENT[1], 46, C.ink, C.white, pop(lt, sn));
      } });
    cue(st, 'whoosh'); cue(st + la, 'boing', { gain: 0.3 }); cue(st + te, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + re, 'pop', { gain: 0.4 }); cue(st + sn, 'pop', { gain: 0.5 });
  }

  // ── 9 · "Experts still say: get up on the first alarm." ──
  {
    const st = at('experts', 8), ex = Wd('experts', 8) - st, ge = Wd('get', 8) - st, up = Wd('up', 8) - st, fi = Wd('first', 8) - st, al = Wd('alarm', 8) - st;
    const DX = 300, DY = 730, DS = 0.66, AX = 790, AY = 560;
    add({ id: 'S14', at: st, cam: [540, 640], zoom: 0.07, note: 'doctor (left, finger raised) + a ringing alarm clock (right), on screen at the cut; "EXPERTS" pill on "Experts"; "GET UP" pill with up arrow on "get"/"up" (doctor\'s finger wags); "1ST ALARM" yellow pill on "first", green check on the clock on "alarm"',
      draw(lt, d, t) {
        plain();
        ctx.fillStyle = C.floor; ctx.fillRect(-300, DY + 620 * DS - 20, W + 600, 900);
        K.doctor({ x: DX, y: DY, s: DS, arm: K.ARM.point, finger: lt > up ? Math.sin(lt * 11) * 0.35 : 0, mouth: 'smile', brow: 0.5, look: 0.5 });
        K.pill('EXPERTS', DX, 320, 48, C.ink, C.white, pop(lt, ex));
        K.dhAlarmClock(AX, AY, 0.95 * enter(lt), { ring: lt < al ? 1 : 0, t, hour: 7 });
        K.pill('GET UP', AX, 860, 56, C.ink, C.white, pop(lt, ge));
        if (lt > up) K.flowArrow(AX + 170, 880, 110, -Math.PI / 2, pop(lt, up, 0.25), C.yellow, 22);
        K.pill('1ST ALARM', AX, 990, 52, C.yellow, C.ink, pop(lt, fi));
        K.checkMark(AX + 150, AY - 120, 1.1, pop(lt, al, 0.3));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'alarm', { dur: 1.9, gain: 0.18 }); cue(st + ex, 'pop', { gain: 0.45 }); cue(st + ge, 'pop', { gain: 0.5 }); cue(st + up, 'zip', { gain: 0.35 }); cue(st + fi, 'pop', { gain: 0.5 }); cue(st + al, 'pop', { gain: 0.7 });
  }

  // ── 10a · TEASE "Next Body File: is hangry real?" (starts on "Next") ──
  const badge = (x, y, sc, size = 44) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = at('next', 9), bo = Wd('body', 9) - st, ha = Wd('hangry', 9) - st, re = Wd('real', 9) - st;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.08, note: 'tease (cut on "Next"): NEXT pill + the hero (arms down, grumpy) beside a big growling stomach, on screen at the cut; BODY FILES badge on "Body"; on "hangry" the stomach growls + a red anger mark pops by his head (frown); a yellow "?" bounces on "real"',
      draw(lt, d, t) {
        plain();
        const mad = lt > ha;
        K.man({ x: 330, y: 760, s: 0.6, arm: K.ARM.hip, eyes: 'n', mouth: 'flat', brow: mad ? 0 : 0.3, frown: mad, look: 0.6 });
        K.szAnger(430, 470, 0.9, pop(lt, ha));
        K.growlStomach(745, 700, 0.95, { t, growl: lt > ha ? 1 : 0.15, sc: enter(lt) });
        bigText('?', 800, 470, 140, C.yellow, 0.1, pop(lt, re));
        K.pill('NEXT', 540, 190, 64, C.yellow, C.ink, pop(lt, 0.03, 0.25));
        badge(540, 310, pop(lt, bo));
      } });
    cue(st, 'whoosh'); cue(st + 0.03, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.4 }); cue(st + ha, 'boing', { gain: 0.4 }); cue(st + ha + 0.05, 'bubbles', { dur: 0.5, gain: 0.3 }); cue(st + re, 'pop', { gain: 0.5 });
  }

  // ── 10b · LOOP "Still in bed?" (back to the exact frame-1 picture) ──
  {
    const st = at('still', 9), sl = Wd('still', 9) - st, bd = Wd('bed', 9) - st, Z = 0;
    add({ id: 'S16', at: st, cam: HOOK_CAM, zoom: Z, note: 'LOOP + END CARD: the frame-1 bedroom (phone ringing, SNOOZE glowing, 56% pill, A / B pills; on screen at the cut, scene clock wrapped so the last frame = frame 0); his hand rises from the blanket to hover over the SNOOZE button by ~1.3 s (the frame-1 pose, motion lines back on); yellow pulse on the button on "bed"; end card from ~0.5 s: BODY FILES + FOLLOW (left), hangry badge + NEXT (top right)',
      draw(lt, d, t) {
        const tl = t - T_LAST;
        const k = eio(seg(lt, sl, 1.3));
        hookBed(tl, { arm: K.armPose(REST, HOVER, k), motion: seg(lt, 1.1, 1.35) });
        K.hiRing(PH[0], PH[1] + 70 * PH_S, 90, 56, blip(lt, bd, 0.5));
        hookTag(1);
        hookPills(1);
        badge(230, 330, pop(lt, 0.5, 0.3), 32);
        K.followPill(230, 410, pop(lt, 0.7), t, 36);
        K.szHangryBadge(960, 110, 0.36, pop(lt, 0.5, 0.3), t);
        K.pill('NEXT', 960, 205, 30, C.yellow, C.ink, pop(lt, 0.55, 0.3));
      } });
    cue(st, 'whoosh'); cue(st + sl, 'alarm', { dur: 1.2, gain: 0.2 }); cue(st + bd, 'pop', { gain: 0.4 }); cue(st + 0.5, 'pop', { gain: 0.4 }); cue(st + 0.7, 'pop', { gain: 0.5 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES, loop: true };
}
