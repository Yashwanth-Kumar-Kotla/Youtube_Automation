// WHAT HAPPENS IF YOU HOLD YOUR BREATH TOO LONG?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1, the answer and the loop ending): x-ray film, the x-ray hero (left) holding his breath with puffed
// cheeks, grey CO2 dots building in his chest (K.torsoCO2) and in a cyan blood lens (right, K.bloodLens), a dark red alarm
// bulb on the brainstem (neck top) with the tiny "sensors: acid (pH)" label, a small O2 dial (top left) that barely moves
// (rewatch detail), and the guess pills "A LOW OXYGEN" / "B TOO MUCH CO2" at the top. Countdown: ALARM 1 (one siren) →
// ALARM 2 (two sirens + red edge pulse). Re-hook (line 5) = zoom into the chest → inside the blood (new scene).
// Safety: hero always on dry land; the water danger is a schematic pool icon only; no timers, no challenge.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, line, bigText } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i) - 0.08;
  const plain = () => { ctx.fillStyle = C.bg; ctx.fillRect(-300, -300, W + 600, H + 600); };
  const pop = (lt, a, d = 0.3) => (lt > a ? eob(seg(lt, a, a + d)) : 0);
  const out = (lt, a, d = 0.25) => 1 - eio(seg(lt, a, a + d));
  const blip = (lt, a, d = 0.35) => (lt > a ? Math.sin(Math.PI * seg(lt, a, a + d)) : 0);   // 0 → 1 → 0
  const scaled = (x, y, k, fn) => { if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); fn(); ctx.restore(); };
  const xtag = (text, x, y, tx, ty, size, sc, bg = C.white, fg = C.ink) => { if (sc <= 0) return; ctx.save(); ctx.globalAlpha = clamp(sc); line([[x, y], [tx, ty]], C.cyan, 6); ctx.restore(); K.pill(text, x, y, size, bg, fg, sc); };
  const redEdge = (a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.strokeStyle = C.red; ctx.lineWidth = 60; ctx.strokeRect(-280, -280, W + 560, H + 560); ctx.lineWidth = 36; ctx.strokeRect(0, 0, W, H); ctx.restore(); };

  // ── the HOOK framing ──
  const HERO = { x: 300, y: 1040, s: 1.0 };
  const NECK = [HERO.x, HERO.y - 206 * HERO.s];              // brainstem alarm bulb (top of the x-ray neck, under the chin)
  const CHEST = [HERO.x + 60, HERO.y - 70 * HERO.s];
  const BL = [790, 790, 165];                                   // blood lens
  const GA = [120, 540, 0.42];                                  // small O2 dial (top left)
  const LBL = [790, 1018];                                      // "sensors: acid (pH)" label
  const PA = [540, 250], PB = [540, 392], PS = 58;
  const hookScene = (lt, t, { co2 = 0.4, o2 = 0.93, bulb = 0, mouth = 'puff', puff = 1, eyes = 'n', brow = 0.6, sweat = 0, bubble = 0, gumPop = 0, lensSc = 1, label = 1, look = 0 } = {}) => {
    K.xray(t);
    K.o2Gauge(GA[0], GA[1], GA[2], o2);
    K.man({ ...HERO, xray: true, lungs: 0, arm: K.ARM.down, mouth, puff, eyes, brow, sweat, look, gumPop });
    K.torsoCO2(HERO.x, HERO.y, HERO.s, co2, t);
    // pointer chest → blood lens
    const dx = CHEST[0] - BL[0], dy = CHEST[1] - BL[1], dl = Math.hypot(dx, dy);
    if (lensSc > 0) { ctx.save(); ctx.globalAlpha = clamp(lensSc); line([CHEST, [BL[0] + dx / dl * (BL[2] + 22), BL[1] + dy / dl * (BL[2] + 22)]], C.cyan, 7); ctx.restore(); }
    K.bloodLens(BL[0], BL[1], BL[2], { co2, t, sc: lensSc });
    // brainstem bulb + tiny label (rewatch detail)
    if (label > 0) { ctx.save(); ctx.globalAlpha = clamp(label) * 0.8; line([[NECK[0] + 20, NECK[1] + 6], [LBL[0] - 150, LBL[1]]], C.cyan, 4); ctx.restore(); K.pill('sensors: acid (pH)', LBL[0], LBL[1], 26, C.cyan, C.xnavy, clamp(label)); }
    K.alarmBulb(NECK[0], NECK[1], 16, bulb, t);
    if (bubble > 0) K.gumBubble(HERO.x, HERO.y + (-350 + 80) * HERO.s, bubble * HERO.s);   // over the bulb, like the real head order
  };
  const pills = ({ scA = 1, scB = 1, hiA = 0, hiB = 0, check = 0, dim = 0 } = {}) => {
    K.abPill('A', 'LOW OXYGEN', PA[0], PA[1], PS, { sc: scA, hi: hiA, dim });
    K.abPill('B', 'TOO MUCH CO2', PB[0], PB[1], PS, { sc: scB, hi: hiB, check });
  };

  // ── 1 · HOOK "What happens if you hold your breath too long?" ──
  {
    const ho = Wd('hold', 0), br = Wd('breath', 0), lo = Wd('long', 0), end = cut(1);
    add({ id: 'S01', at: 0, cam: [540, 700], zoom: 0.06, note: 'FRAME 1 = premise + guess: x-ray hero holding his breath (cheeks puffed), grey CO2 dots building in his chest and in the blood lens (right), dark alarm bulb on the brainstem with tiny "sensors: acid (pH)" label, small O2 dial top left barely moving; A LOW OXYGEN / B TOO MUCH CO2 pills at the top from frame 1; cheeks bulge more on "hold", lens bumps on "breath", eyes go wide + sweat on "long"',
      draw(lt, d, t) {
        const k = lt < 0.25 ? lerp(0.85, 1, eob(seg(lt, 0, 0.25))) : 1;
        hookScene(lt, t, { co2: lerp(0.28, 0.48, seg(t, 0, end)), o2: lerp(0.94, 0.93, seg(t, 0, end)), puff: lt > ho ? lerp(0.75, 1, eob(seg(lt, ho, ho + 0.25))) : 0.75,
          eyes: lt > lo ? 'wide' : 'n', brow: lt > lo ? 1 : 0.6, sweat: lt > lo ? eo(seg(lt, lo, lo + 0.3)) : 0, lensSc: 1 + 0.06 * blip(lt, br) });
        pills({ scA: k, scB: k });
      } });
    cue(0.05, 'whoosh', { gain: 0.5 }); cue(0.1, 'pop', { gain: 0.45 }); cue(ho, 'boing', { gain: 0.35 }); cue(br, 'bubbles', { dur: 0.6, gain: 0.25 }); cue(lo, 'pop', { gain: 0.5 });
  }

  // ── 2a · "That desperate urge:" close-up, cheeks about to burst ──
  {
    const st = cut(1), de = Wd('desperate', 1) - st, ur = Wd('urge', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.12, note: 'close-up (room): hero face, cheeks puffed, sweat on "desperate", on "urge" eyes wide, face shakes, red-tinged blush + shock lines',
      draw(lt, d, t) {
        K.room();
        const shake = lt > ur ? Math.sin(lt * 60) * 9 : 0;
        K.heroHead(540 + shake, 760, 2.3, { mouth: 'puff', puff: 1, eyes: lt > ur ? 'wide' : 'n', brow: lt > de ? 1 : 0.6, frown: lt < de, sweat: lt > de ? eo(seg(lt, de, de + 0.3)) : 0, blush: lt > ur ? 0.8 : 0.2 });
        K.shockLines(540, 760, 380, lt > ur ? clamp((lt - ur) * 5) : 0);
      } });
    cue(st, 'whoosh'); cue(st + de, 'pop', { gain: 0.4 }); cue(st + ur, 'boing', { gain: 0.5 });
  }

  // ── 2b · "low oxygen, or too much carbon dioxide? Guess." ──
  {
    const st = at('low', 1), lo = Wd('low', 1) - st, ca = Wd('carbon', 1) - st, gu = Wd('guess', 1) - st;
    const CA = [290, 640], CB = [790, 640], CW = 420, CH = 520;
    const card = (x, y, sc, fn) => scaled(x, y, sc, () => {
      ctx.beginPath(); ctx.roundRect(x - CW / 2 - 10, y - CH / 2 - 10, CW + 20, CH + 20, 46); ctx.fillStyle = C.ink; ctx.fill();
      ctx.beginPath(); ctx.roundRect(x - CW / 2, y - CH / 2, CW, CH, 38); ctx.fillStyle = C.xnavy; ctx.fill(); fn();
    });
    add({ id: 'S03', at: st, cam: [540, 720], zoom: 0.05, note: 'guess: two x-ray cards; on "low" card A shows O2 bubbles draining away (red down arrow) and pill A LOW OXYGEN pops; on "carbon" card B fills with grey CO2 dots (red up arrow) and pill B TOO MUCH CO2 pops; on "Guess" a big yellow "?" bounces between and both pills flash',
      draw(lt, d, t) {
        plain();
        const g = blip(lt, gu, 0.4);
        card(CA[0], CA[1], pop(lt, 0, 0.3), () => {
          const drain = lt > lo ? eio(seg(lt, lo, lo + 1.2)) : 0;
          for (let i = 0; i < 6; i++) { const fade = i < 2 ? 0.45 * drain : clamp(drain * 6 - i - 2); K.o2Bubble(CA[0] - 110 + (i % 3) * 110, CA[1] - 120 + Math.floor(i / 3) * 140 + Math.sin(t * 2 + i) * 6, 0.8 * (1 - 0.6 * fade), 1 - fade); }
          if (lt > lo) K.flowArrow(CA[0], CA[1] + 170, 150, Math.PI / 2, pop(lt, lo + 0.2), C.red, 24);
        });
        card(CB[0], CB[1], pop(lt, 0.06, 0.3), () => {
          const fill = lt > ca ? eo(seg(lt, ca, ca + 1.0)) : 0, n = fill * 14;
          for (let i = 0; i < Math.ceil(n); i++) K.co2Dot(CB[0] - 150 + (i * 97 % 300), CB[1] + 150 - Math.floor(i / 4) * 80 + ((i * 37) % 30), 30 * Math.min(1, n - i), 1);
          if (lt > ca) K.flowArrow(CB[0], CB[1] - 190, 150, -Math.PI / 2, pop(lt, ca + 0.2), C.red, 24);
        });
        if (lt < lo) { bigText('?', CA[0], CA[1], 200, C.white, 0, pop(lt, 0, 0.3)); }
        if (lt < ca) { bigText('?', CB[0], CB[1], 200, C.white, 0, pop(lt, 0.06, 0.3)); }
        K.abPill('A', 'LOW OXYGEN', CA[0], 1010, 38, { sc: pop(lt, lo), hi: g });
        K.abPill('B', 'TOO MUCH CO2', CB[0], 1010, 38, { sc: pop(lt, ca), hi: g });
        if (lt > gu) { ctx.save(); ctx.translate(540, 640); ctx.rotate(Math.sin(t * 7) * 0.08); bigText('?', 0, 0, 260, C.yellow, 0, eob(seg(lt, gu, gu + 0.3))); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + lo, 'pop', { gain: 0.6 }); cue(st + ca, 'pop', { gain: 0.6 }); cue(st + gu, 'boing', { gain: 0.55 });
  }

  // ── 3a · "Alarm one: deep in your brainstem," ──
  const SK = [560, 760, 1.05];
  const STEM = [SK[0] + 48 * 0.92 * SK[2], SK[1] + 150 * 0.92 * SK[2]];
  {
    const st = cut(2), on = Wd('one', 2) - st, de = Wd('deep', 2) - st, bs = Wd('brainstem', 2) - st;
    add({ id: 'S04', at: st, cam: [STEM[0], STEM[1] - 60], zoom: 0.16, note: 'ALARM 1: x-ray skull side view with the brain; "ALARM 1" pill + one siren at the top, siren lights on "one"; camera pushes toward the brainstem from "deep"; yellow ring + BRAINSTEM tag + red bulb on the stem on "brainstem"',
      draw(lt, d, t) {
        K.xray(t);
        K.skull(SK[0], SK[1], SK[2]); K.brain(SK[0], SK[1], 0.92 * SK[2], { t });
        K.siren(300, 300, 0.45, { on: lt > on ? 1 : 0, t, sc: pop(lt, 0, 0.3) });
        K.pill('ALARM 1', 640, 250, 64, C.red, C.white, pop(lt, 0.05, 0.3) * (1 + 0.08 * blip(lt, on)));
        K.hiRing(STEM[0], STEM[1], 70, 120, lt > bs ? eo(seg(lt, bs, bs + 0.25)) : 0);
        K.alarmBulb(STEM[0], STEM[1] + 10, 18, lt > bs ? 1 : 0, t);
        xtag('BRAINSTEM', 850, 1180, STEM[0] + 40, STEM[1] + 80, 52, pop(lt, bs + 0.1));
      } });
    cue(st, 'whoosh'); cue(st + on, 'alarm', { dur: 0.6, gain: 0.3 }); cue(st + de, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + bs, 'pop', { gain: 0.6 });
  }

  // ── 3b · "sensors detect rising acid." ──
  {
    const st = at('sensors', 2), se = Wd('sensors', 2) - st, dt = Wd('detect', 2) - st, ri = Wd('rising', 2) - st, ac = Wd('acid', 2) - st;
    add({ id: 'S05', at: st, cam: [540, 720], zoom: 0.08, note: 'x-ray lens on the brainstem: three round sensors on the stem; tiny label "sensors: acid (pH)" pops on "sensors"; sensors flash red with ring pulses on "detect"; yellow acid dots multiply and rise from "rising"; ALARM 1 pill + siren stay lit at the top',
      draw(lt, d, t) {
        K.xray(t);
        const acid = lerp(0.15, 1, eio(seg(lt, ri, ac + 0.4)));
        K.stemLens(540, 720, 360, { acid, detect: lt > dt ? eo(seg(lt, dt, dt + 0.2)) : 0, co2: 1, label: pop(lt, se), t, sc: lerp(0.8, 1, eob(seg(lt, 0, 0.3))) });
        K.siren(170, 240, 0.32, { on: 1, t });
        K.pill('ALARM 1', 420, 220, 50, C.red, C.white, 1);
        if (lt > ac) K.flowArrow(960, 700, 180, -Math.PI / 2, pop(lt, ac), C.yellow, 26, C.ink);
      } });
    cue(st, 'whoosh'); cue(st + se, 'pop', { gain: 0.5 }); cue(st + dt, 'alarm', { dur: 0.5, gain: 0.25 }); cue(st + ri, 'bubbles', { dur: 0.9, gain: 0.3 }); cue(st + ac, 'sizzle', { dur: 0.5, gain: 0.3 });
  }

  // ── 4a · "Alarm two: your diaphragm twitches," ──
  const DH = { x: 540, y: 1020, s: 1.4 };
  const twitch = (t, a) => a * (0.45 + 0.55 * Math.abs(Math.sin(t * 13)) * (Math.sin(t * 5.3) > -0.2 ? 1 : 0.3));
  {
    const st = cut(3), tw2 = Wd('two', 3) - st, di = Wd('diaphragm', 3) - st, tw = Wd('twitches', 3) - st;
    add({ id: 'S06', at: st, cam: [540, 900], zoom: 0.07, note: 'ALARM 2 (escalation): "ALARM 2" pill + TWO sirens blazing, red edge pulse on "two"; x-ray hero torso with lungs + diaphragm, cheeks puffed; diaphragm glows yellow + DIAPHRAGM tag on "diaphragm"; it jerks up on "twitches"',
      draw(lt, d, t) {
        K.xray(t);
        const j = lt > tw ? twitch(t, 1) : 0;
        K.man({ ...DH, y: DH.y - j * 6, xray: true, dia: j, diaHi: lt > di ? 0.6 + 0.4 * Math.sin(t * 8) : 0, mouth: 'puff', eyes: lt > tw ? 'closed' : 'n', brow: 0.9, sweat: 1 });
        K.siren(170, 230, 0.36, { on: lt > tw2 ? 1 : 0, t, sc: pop(lt, 0, 0.25) });
        K.siren(910, 230, 0.36, { on: lt > tw2 ? 1 : 0, t: t + 0.2, sc: pop(lt, tw2, 0.25) });
        K.pill('ALARM 2', 540, 200, 64, C.red, C.white, pop(lt, 0.05, 0.3) * (1 + 0.08 * blip(lt, tw2)));
        xtag('DIAPHRAGM', 830, 1190, DH.x + 120, DH.y + 90, 46, pop(lt, di + 0.05));
        redEdge(lt > tw2 ? 0.5 * (0.5 + 0.5 * Math.sin(t * 12)) : 0);
      } });
    cue(st, 'whoosh'); cue(st + tw2, 'alarm', { dur: 1.2, gain: 0.35 }); cue(st + di, 'pop', { gain: 0.5 }); cue(st + tw, 'thud', { gain: 0.5 }); cue(st + tw + 0.3, 'thud', { gain: 0.4 });
  }

  // ── 4b · "trying to breathe without you." ──
  {
    const st = at('trying', 3), br = Wd('breathe', 3) - st, wi = Wd('without', 3) - st;
    const H2 = { x: 540, y: 1130, s: 1.1 };
    const MO = [H2.x, H2.y - 272 * H2.s];
    add({ id: 'S07', at: st, cam: [540, 820], zoom: 0.1, note: 'x-ray hero full: diaphragm keeps jerking (shake lines at the belly), lips stay sealed; on "breathe" cyan air arrows flicker toward his mouth and bounce off; on "without" his eyes go wide and he looks down at his own chest; two sirens + red edge keep pulsing',
      draw(lt, d, t) {
        K.xray(t);
        const j = twitch(t, 1);
        K.man({ ...H2, y: H2.y - j * 5, xray: true, dia: j, diaHi: 0.5, mouth: 'puff', eyes: lt > wi ? 'wide' : 'closed', brow: 1, sweat: 1, lookY: lt > wi ? 1 : 0 });
        K.shakeLines(H2.x, H2.y + 60 * H2.s, 230 * H2.s, 90, t, j);
        if (lt > br) for (const sd of [-1, 1]) { const ph = (t * 2.5) % 1; K.flowArrow(MO[0] + sd * lerp(260, 150, ph), MO[1] + 20, 110, sd > 0 ? Math.PI : 0, Math.min(1, ph * 4, (1 - ph) * 3) * 0.9, C.cyan, 20); }
        K.siren(170, 230, 0.36, { on: 1, t }); K.siren(910, 230, 0.36, { on: 1, t: t + 0.2 });
        K.pill('ALARM 2', 540, 200, 64, C.red, C.white, 1);
        redEdge(0.5 * (0.5 + 0.5 * Math.sin(t * 12)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'thud', { gain: 0.35 }); cue(st + br, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + wi, 'boing', { gain: 0.5 });
  }

  // ── 5 · RELATABLE "Ever had a doctor's 'deep breath, hold it' feel endless?" ──
  {
    const st = cut(4), dc = Wd('doctor', 4) - st, de = Wd('deep', 4) - st, ho = Wd('hold', 4) - st, en = Wd('endless', 4) - st;
    add({ id: 'S08', at: st, cam: [540, 600], zoom: 0.06, note: 'room: the doctor (left, lab coat, stethoscope) pops in on "doctor"; bubble "DEEP BREATH" on "deep", it changes to "HOLD IT" on "hold" and the hero (right) puffs his cheeks; on "endless" dots keep piling onto "HOLD IT..." and the hero sweats, flushed, eyes darting',
      draw(lt, d, t) {
        K.room();
        K.doctor({ x: 290, y: 950, s: 0.95, arm: K.ARM.point, finger: -0.2, mouth: lt > de && Math.sin(t * 14) > 0 ? 'o' : 'smile', look: 0.6, sc: 1 });
        const held = lt > ho;
        K.man({ x: 790, y: 950, s: 0.95, mouth: held ? 'puff' : 'o', puff: held ? lerp(0.6, 1, eo(seg(lt, ho, ho + 0.3))) : 0, eyes: lt > en ? 'wide' : 'n', look: lt > en ? Math.sin(t * 6) : -0.6, brow: lt > en ? 1 : 0.4, sweats: lt > en ? 1 : 0, ct: t, blush: lt > en ? 0.6 : 0 });
        const dots = lt > en ? Math.min(6, 1 + Math.floor((lt - en) * 5)) : 0;
        const txt = held ? 'HOLD IT' + '.'.repeat(dots) : 'DEEP BREATH';
        K.textBubble(txt, 420, 230, lt > en ? 560 : 480, 150, 330, 430, pop(lt, de - 0.05) * (1 + 0.06 * blip(lt, ho)), 60);
      } });
    cue(st, 'whoosh'); cue(st + dc, 'pop', { gain: 0.5 }); cue(st + de, 'pop', { gain: 0.45 }); cue(st + ho, 'boing', { gain: 0.45 }); cue(st + en, 'tock', { gain: 0.4 }); cue(st + en + 0.4, 'tock', { gain: 0.35 });
  }

  // ── 6a · RE-HOOK "But here's the weird part:" zoom into the chest ──
  const cuP = Wd('culprit', 5);
  {
    const st = L(5) - 0.2, we = Wd('weird', 5) - st;
    add({ id: 'S09', at: st, cam: [CHEST[0] - 40, CHEST[1] + 30], zoom: 0.55, note: 'RE-HOOK visual change: back on the x-ray hero, a yellow lens ring opens on his chest and the camera dives in hard; on "weird" a yellow "?!" pops',
      draw(lt, d, t) {
        hookScene(lt, t, { co2: 0.6, label: 0, lensSc: 0, eyes: 'wide', brow: 1 });
        const r = lerp(40, 220, eio(seg(lt, 0.1, d)));
        K.hiRing(CHEST[0] - 40, CHEST[1] + 30, r, r);
        bigText('?!', CHEST[0] + 260, CHEST[1] - 200, 180, C.yellow, 0.12, pop(lt, we));
      } });
    cue(st, 'whoosh'); cue(st + 0.15, 'slide', { dur: 0.9, gain: 0.4 }); cue(st + we, 'boing', { gain: 0.5 });
  }

  // ── 6b · "the culprit is your own exhaust." inside the blood ──
  {
    const st = cuP - 0.32, cu = cuP - st, ex = Wd('exhaust', 5) - st, ow = Wd('own', 5) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.08, note: 'NEW SCENE inside the blood (macro): on "culprit" a grumpy grey CO2 molecule slides in, red ring + CO2 tag; on "own" a body cell pops in (left), on "exhaust" its little tailpipe puffs grey CO2 dots out toward the molecule',
      draw(lt, d, t) {
        K.insideBlood(t);
        const mx = lt > cu ? lerp(1300, 700, eo(seg(lt, cu, cu + 0.35))) : 1300;
        K.co2Molecule(mx, 560, 1.1, { t, face: true });
        if (lt > cu + 0.3) K.hiRing(mx, 560, 290, 140, eo(seg(lt, cu + 0.3, cu + 0.5)));
        K.pill('CO2', mx, 760, 56, C.ink, C.white, pop(lt, cu + 0.35));
        K.exhaustCell(280, 960, 130, { t, puff: lt > ex ? 1 : 0, sc: pop(lt, ow - 0.1), rate: 3, reach: 300 });
      } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + 0.05, 'bubbles', { dur: 0.8, gain: 0.25 }); cue(st + cu, 'zip', { gain: 0.5 }); cue(st + cu + 0.35, 'slam', { gain: 0.5 }); cue(st + ow, 'pop', { gain: 0.45 }); cue(st + ex, 'bubbles', { dur: 0.6, gain: 0.3 });
  }

  // ── 7a · "Your cells make it nonstop," ──
  {
    const st = cut(6), ce = Wd('cells', 6) - st, no = Wd('nonstop', 6) - st;
    const CELLS = [[230, 420, 105], [700, 360, 95], [380, 820, 120], [800, 760, 100], [240, 1130, 90], [690, 1140, 95]];
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.08, note: 'inside the blood: six cells pop in one after another from "cells", each puffing grey CO2 dots from its tailpipe; on "nonstop" every tailpipe puffs twice as fast',
      draw(lt, d, t) {
        K.insideBlood(t);
        const fast = lt > no ? 2.2 : 1;
        CELLS.forEach(([x, y, r], i) => K.exhaustCell(x, y + Math.sin(t * 2 + i) * 6, r, { t: t * fast, puff: 1, sc: pop(lt, ce + i * 0.09, 0.25), rate: 2.4, reach: 220 }));
      } });
    cue(st, 'whoosh'); cue(st + ce, 'pop', { gain: 0.5 }); cue(st + ce + 0.27, 'pop', { gain: 0.4 }); cue(st + no, 'bubbles', { dur: 0.9, gain: 0.35 });
  }

  // ── 7b · "and with no exhale, it just piles up." back to the hero ──
  {
    const st = at('and', 6), ex = Wd('exhale', 6) - st, pi = Wd('piles', 6) - st;
    const MO = [HERO.x, HERO.y - 272 * HERO.s];
    add({ id: 'S12', at: st, cam: [440, 860], zoom: 0.08, note: 'back to the hook framing (no pills): on "exhale" an exhale arrow at his sealed lips gets a red X; on "piles" the grey CO2 dots in his chest and the blood lens pile up fast; the O2 dial top left barely moves (rewatch)',
      draw(lt, d, t) {
        const co2 = lerp(0.6, 1, eio(seg(lt, pi - 0.1, pi + 0.6)));
        hookScene(lt, t, { co2, o2: 0.9, eyes: lt > pi ? 'wide' : 'n', brow: 0.9, sweat: 1 });
        const ax = MO[0] + 235, ay = MO[1] + 10;
        if (lt > ex - 0.1) { K.flowArrow(ax, ay, 130, 0, pop(lt, ex - 0.1, 0.2), C.cyan, 24); K.redX(ax, ay, lerp(0.4, 0.2, eo(seg(lt, ex, ex + 0.2))), lt > ex ? 1 : 0); }
      } });
    cue(st, 'whoosh'); cue(st + ex, 'slam', { gain: 0.5 }); cue(st + pi, 'bubbles', { dur: 0.8, gain: 0.4 });
  }

  // ── 8a · ANSWER "So it's B: carbon dioxide." ──
  {
    const st = cut(7), bb = Wd('b', 7) - st, ca = Wd('carbon', 7) - st;
    add({ id: 'S13', at: st, cam: [540, 600], zoom: 0.05, note: 'answer on the hook framing: on "B" a green check pops on pill B, B flashes, A dims; "COMMENT A OR B" pill for ~1 s after (not voiced); the brainstem bulb lights red; on "carbon" the blood lens bumps with a yellow ring (CO2 dots)',
      draw(lt, d, t) {
        hookScene(lt, t, { co2: 0.8, o2: 0.9, bulb: lt > bb ? 1 : 0, lensSc: 1 + 0.07 * blip(lt, ca) });
        if (lt > ca) K.hiRing(BL[0], BL[1], BL[2] + 26, BL[2] + 26, eo(seg(lt, ca, ca + 0.2)) * out(lt, ca + 1.2));
        pills({ check: lt > bb ? eob(seg(lt, bb, bb + 0.3)) : 0, hiB: blip(lt, bb, 0.45), dim: lt > bb ? eio(seg(lt, bb + 0.1, bb + 0.4)) : 0 });
        K.pill('COMMENT A OR B', 540, 500, 38, C.ink, C.yellow, pop(lt, bb + 0.35, 0.25) * out(lt, bb + 1.3, 0.2));
      } });
    cue(st, 'whoosh'); cue(st + bb, 'slam', { gain: 0.55 }); cue(st + bb + 0.05, 'sparkle', { dur: 0.5, gain: 0.3 }); cue(st + bb + 0.35, 'pop', { gain: 0.35 }); cue(st + ca, 'alarm', { dur: 0.6, gain: 0.25 });
  }

  // ── 8b · "Oxygen barely sounds the alarm." ──
  {
    const st = at('oxygen', 7), ox = Wd('oxygen', 7) - st, ba = Wd('barely', 7) - st, al = Wd('alarm', 7) - st;
    add({ id: 'S14', at: st, cam: [540, 700], zoom: 0.06, note: 'two alarms side by side: left CO2 siren blazing (grey CO2 pill), right O2 siren dark (sky O2 pill + the small O2 dial, needle high); yellow ring on the O2 side on "Oxygen"; on "barely" it gives one weak flicker; on "alarm" the CO2 siren bumps bigger',
      draw(lt, d, t) {
        plain();
        const big = 1 + 0.1 * blip(lt, al, 0.4);
        K.siren(290, 720, 0.9 * big, { on: 1, t, sc: pop(lt, 0, 0.3) });
        K.pill('CO2', 290, 860, 64, C.gumEdge, C.ink, pop(lt, 0, 0.3));
        const flick = lt > ba ? 0.35 * blip(lt, ba + 0.1, 0.25) : 0;
        K.siren(790, 720, 0.9, { on: flick, t, sc: pop(lt, ox - 0.1, 0.3) });
        { ctx.save(); ctx.globalAlpha = (0.55 - flick) * clamp(pop(lt, ox - 0.1)); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(790 - 77, 720); ctx.lineTo(790 - 77, 720 - 72); ctx.arc(790, 720 - 72, 77, Math.PI, Math.PI * 2); ctx.lineTo(790 + 77, 720); ctx.closePath(); ctx.fill(); ctx.restore(); }
        K.pill('O2', 790, 860, 64, C.sky, C.ink, pop(lt, ox - 0.1, 0.3));
        K.o2Gauge(790, 1080, 0.55, 0.88 - 0.02 * seg(lt, 0, d), pop(lt, ox, 0.3));
        K.hiRing(790, 740, 200, 200, lt > ox ? eo(seg(lt, ox, ox + 0.2)) * out(lt, ba + 0.4) : 0);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'alarm', { dur: 1.6, gain: 0.25 }); cue(st + ox, 'pop', { gain: 0.5 }); cue(st + ba + 0.1, 'tock', { gain: 0.4 }); cue(st + al, 'boing', { gain: 0.35 });
  }

  // ── 9a · "Underwater, that's the danger:" schematic pool, no people ──
  {
    const st = cut(8), un = Wd('underwater', 8) - st, da = Wd('danger', 8) - st;
    add({ id: 'S15', at: st, cam: [540, 720], zoom: 0.06, note: 'schematic pool icon (cross-section, no people) slides up on "Underwater"; red warning triangle slams in top right on "danger"',
      draw(lt, d, t) {
        plain();
        K.poolIcon(540, lerp(1000, 800, eo(seg(lt, un - 0.1, un + 0.3))), 1.25, { t, sc: pop(lt, un - 0.1, 0.3) });
        K.warning(850, 400, lt > da ? lerp(1.4, 0.75, eo(seg(lt, da, da + 0.2))) : 0);
      } });
    cue(st, 'whoosh'); cue(st + un, 'plop', { gain: 0.5 }); cue(st + da, 'slam', { gain: 0.6 });
  }

  // ── 9b · "you can black out without warning." ──
  {
    const st = at('you', 8), bl = Wd('black', 8) - st, wa = Wd('warning', 8) - st;
    add({ id: 'S16', at: st, cam: [540, 760], zoom: 0.07, note: 'graphic: big O2 dial, needle sinking into the red; on "black" the screen dims to near black for a beat; the brainstem alarm (siren) stays dark the whole time and gets a red X on "warning"',
      draw(lt, d, t) {
        plain();
        K.o2Gauge(540, 640, 1.6, lerp(0.62, 0.1, eio(seg(lt, 0.1, bl + 0.4))), pop(lt, 0, 0.3));
        K.siren(540, 1130, 0.75, { on: 0, t, sc: pop(lt, 0.08, 0.3) });
        ctx.save(); ctx.globalAlpha = 0.45 * pop(lt, 0.08); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(540 - 64, 1130); ctx.lineTo(540 - 64, 1070); ctx.arc(540, 1070, 64, Math.PI, Math.PI * 2); ctx.lineTo(540 + 64, 1130); ctx.closePath(); ctx.fill(); ctx.restore();
        if (lt > wa) K.redX(540, 1060, lerp(1.2, 0.6, eo(seg(lt, wa, wa + 0.2))), 1);
        const dim = lt > bl ? 0.82 * Math.min(eo(seg(lt, bl, bl + 0.15)), 1 - eio(seg(lt, bl + 0.45, wa - 0.05))) : 0;
        if (dim > 0) { ctx.save(); ctx.globalAlpha = dim; ctx.fillStyle = C.ink; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + 0.15, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + bl, 'thud', { gain: 0.6 }); cue(st + wa, 'slam', { gain: 0.6 });
  }

  // ── 10a · TEASE "Next Body File:" ──
  const badge = (sc, x = 540) => K.filesBadge('BODY FILES', x, 105, 50, sc);
  {
    const st = cut(9), nx = Wd('next', 9) - st, bo = Wd('body', 9) - st;
    add({ id: 'S17', at: st, cam: [540, 760], zoom: 0.06, note: 'room: hero (right, normal breathing, smiling) waves; NEXT pill pops on "Next", BODY FILES badge on "Body"; a stick of gum sits on the left (he never holds it)',
      draw(lt, d, t) {
        K.room();
        badge(pop(lt, bo));
        const wv = eio(seg(lt, 0.05, 0.4));
        K.man({ x: 770, y: 940, s: 0.95, armL: K.armPose(K.ARM.down, K.ARM.wave, wv), look: -0.6, mouth: 'smile', brow: 0.5 });
        K.gum(300, 820 + 8 * Math.sin(t * 4), 2.6, -0.15);
        K.pill('NEXT', 300, 1010, 64, C.yellow, C.ink, pop(lt, nx));
      } });
    cue(st, 'whoosh'); cue(st + nx, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.6 });
  }

  // ── 10b · LOOP END CARD "swallowing gum, which your gut can't break down." = frame-1 framing + gum bubble ──
  {
    const st = at('gum', 9), gu = Wd('gum', 9) - st, gt = Wd('gut', 9) - st, dn = Wd('down', 9) - st;
    add({ id: 'S18', at: st, cam: [540, 700], zoom: 0.04, note: 'END CARD = frame-1 framing for the loop: x-ray hero chewing, blows a pink gum bubble on "gum" (it grows), the bubble pops on "down" and he is back to the frame-1 puffed-cheek breath hold; A/B pills with the check on B (A dimmed); BODY FILES badge top left, + FOLLOW top right after "gut"; gum piece + yellow NEXT pill bottom right',
      draw(lt, d, t) {
        const grow = lt > gu ? eo(seg(lt, gu, gu + 0.8)) : 0, popped = lt > dn;
        const mouth = popped ? (lt > dn + 0.3 ? 'puff' : 'flat') : (lt > gu ? 'flat' : 'chew');
        hookScene(lt, t, { co2: 0.45, o2: 0.93, mouth, puff: popped ? eo(seg(lt, dn + 0.3, dn + 0.55)) * 0.75 : 1, bubble: popped ? 0 : 72 * grow + 3 * Math.sin(t * 5) * grow, gumPop: popped ? seg(lt, dn, dn + 0.35) : 0, eyes: 'n', brow: 0.6 });
        badge(1, 330);
        K.followPill(850, 105, pop(lt, gt + 0.1), t, 46);
        pills({ check: 1, dim: 1 });
        K.gum(930, 1140 - 12 * blip(lt, gu, 0.3), 1.3, -0.2);
        K.pill('NEXT', 760, 1140, 50, C.yellow, C.ink, pop(lt, 0.05, 0.3));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.45 }); cue(st + gu, 'slide', { dur: 0.8, gain: 0.3 }); cue(st + gt + 0.1, 'pop', { gain: 0.7 }); cue(st + dn, 'pop', { gain: 0.8 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES };
}
