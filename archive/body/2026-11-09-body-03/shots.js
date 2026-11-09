// WHAT HAPPENS IF YOU DRINK TOO MUCH WATER?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Tone: diagrams, not drama. The hero never chugs on screen (the gallon drains from a jug on its own); symptoms are
// icon badges; the only drinking is one normal glass "when you're thirsty". Knuckle tease: hand + joint lens + gas
// bubble + NEXT pill, the hero only looks (no cracking on screen).
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, line, rr } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i) - 0.08;                       // a mid-line cut just before word w
  const plain = () => { ctx.fillStyle = C.bg; ctx.fillRect(-300, -300, W + 600, H + 600); };
  const pop = (lt, a, d = 0.3) => (lt > a ? eob(seg(lt, a, a + d)) : 0);
  const HERO = { x: 330, y: 1000, s: 1.2 };                    // the hero's spot in the room (left, clear of the window)
  const hero = (o) => K.man({ ...HERO, ...o });

  // salt grains for the blood shots: fixed spots around the frame centre (kept out of the caption band)
  const GR = []; for (let i = 0; i < 26; i++) GR.push([140 + rnd(i + 3) * 800, 290 + rnd(i + 17) * 880, rnd(i + 29) * 3]);
  const grains = (t, { spread = 0, fade = 0, keep = () => true, a = 1 } = {}) => GR.forEach(([x, y, r], i) => {
    if (!keep(x, y)) return;
    const k = 1 + spread * (0.6 + rnd(i + 41) * 0.6), gx = 540 + (x - 540) * k, gy = 720 + (y - 720) * k;
    K.saltGrain(gx + Math.sin(t * 1.3 + i) * 10, gy + Math.cos(t * 1.1 + i) * 10, 1.15, r + t * 0.4, a * (i % 2 ? 1 - fade : 1));
  });

  // ── 1 · HOOK: hero beside a growing tower of water glasses; it wobbles on "water" ─────────────────
  const TOWER = [[640, 935], [745, 935], [850, 935], [955, 935], [692, 808], [797, 808], [902, 808], [745, 681], [850, 681], [797, 554]];
  const tower = (n, t, wob = 0, sc = () => 1) => TOWER.slice(0, n).forEach(([x, y], i) => K.glass(x + Math.sin(t * 16 + i) * wob * (12 - y / 100), y, 0.55 * sc(i), 0.85, t + i));
  const table = () => { rr(590, 1000, 440, 40, 14); ctx.fillStyle = '#B5653F'; ctx.fill(); rr(630, 1040, 30, 240, 10); ctx.fillStyle = '#9A5333'; ctx.fill(); rr(960, 1040, 30, 240, 10); ctx.fill(); };
  {
    const st = cut(0), dr = 0.1, mu = Wd('much', 0) - st, wa = Wd('water', 0) - st;
    add({ id: 'S01', at: st, cam: [620, 800], zoom: 0.1, note: 'room: hero holds a glass next to a row of 4 glasses from frame 0; 6 more glasses stack on, one pop each, from 0.1 s to "water", tower wobbles + hero wide-eyed on "water"',
      draw(lt, d, t) {
        K.home(); table();
        const ga = (k) => dr + k * (wa - dr) / 5;                   // glass k (0..5) of the stack lands at ga(k); the last on "water"
        tower(10, t, lt > wa ? Math.max(0, 1 - (lt - wa) * 1.5) : 0, (i) => (i < 4 ? 1 : pop(lt, ga(i - 4), 0.2)));
        const wide = lt > wa;
        hero({ look: 1, eyes: wide ? 'wide' : 'n', mouth: wide ? 'o' : 'flat', frown: !wide && lt > mu, brow: wide ? 1 : 0.3,
          arm: { e: [205, 20], h: [150, -30] }, holding: (x, y) => K.glass(x + 10, y - 20, 0.5, 0.85, t) });
        K.shockLines(HERO.x, HERO.y - 350 * HERO.s, 170, wide ? clamp((lt - wa) * 5) : 0);
      } });
    for (let i = 0; i < 6; i++) cue(st + dr + i * (wa - dr) / 5, 'pop', { gain: 0.3 + i * 0.05 });
    cue(st + wa, 'boing', { gain: 0.6 });
  }

  // ── 2 · about a gallon (jug drains) in an hour or two (stopwatch) ─────────────────────────────────
  {
    const st = cut(1), ch = Wd('chug', 1) - st, ga = Wd('gallon', 1) - st, ho = Wd('hour', 1) - st, tw = Wd('two', 1, 'e') - st;
    add({ id: 'S02', at: st, cam: [540, 720], zoom: 0.08, note: 'big jug drops in on "chug" + GLUG, GALLON tag on "gallon"; stopwatch pops on "hour" and turns twice by "two"; the jug drains as it turns',
      draw(lt, d, t) {
        plain();
        const jp = pop(lt, ch - 0.15, 0.3);
        const fill = lt < ho ? 0.95 : lerp(0.95, 0.15, eio(seg(lt, ho, tw + 0.2)));
        if (jp > 0) K.waterJug(330, lerp(300, 720, Math.min(1, jp)), 1.3, fill, t);
        bigText('GLUG', 330, 1100, 96, C.yellow, -0.08, pop(lt, ch, 0.2) * (1 - seg(lt, ga - 0.1, ga + 0.05)));
        K.tag('GALLON', 330, 330, 330, 450, 56, pop(lt, ga));
        const sp = pop(lt, ho - 0.1);
        if (sp > 0) K.stopwatch(820, 560, 0.42 * sp, lt < ho ? 0 : Math.PI * 4 * eio(seg(lt, ho, tw + 0.2)));
      } });
    cue(st, 'whoosh'); cue(st + ch - 0.15, 'thud', { gain: 0.5 }); cue(st + ch, 'gulp', { gain: 0.5 }); cue(st + ga, 'pop', { gain: 0.5 });
    cue(st + ho - 0.1, 'pop', { gain: 0.4 }); cue(st + ho + 0.2, 'tock', { gain: 0.5 }); cue(st + tw - 0.1, 'tock', { gain: 0.5 });
  }

  // ── 3 · your brain can actually swell ────────────────────────────────────────────────────────────
  {
    const st = cut(2), br = Wd('brain', 2) - st, ac = Wd('actually', 2) - st, sw = Wd('swell', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.1, note: 'brain bounces in under "your brain", jiggles on "actually", puffs up + shock lines on "swell"',
      draw(lt, d, t) {
        plain();
        const sv = lt > sw ? eob(seg(lt, sw, sw + 0.35)) : 0;
        const bp = pop(lt, 0.05, 0.3);
        if (bp > 0) K.brain(540, 720, 1.05 * bp * (1 + 0.24 * sv), { t, wob: lt > ac ? 1 : 0 });
        K.shockLines(540, 700, 380, lt > sw ? clamp((lt - sw) * 5) : 0);
        K.pinchRing(540, 700, 420, 380, (t * 2) % 1, lt > sw ? 0.8 * eo(seg(lt, sw, sw + 0.2)) : 0);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + ac, 'boing', { gain: 0.35 }); cue(st + sw, 'boing', { gain: 0.7 });
  }

  // ── 4 · the secret is salt: salt shaker shakes ───────────────────────────────────────────────────
  {
    const st = Wd('swell', 2, 'e') + 0.1, se = Wd('secret', 3) - st, sa = Wd('salt', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 640], zoom: 0.1, note: 'grey mystery silhouette, yellow "?" on "secret"; the real white salt shaker pops in, shakes and salt grains rain down + burst on "salt"',
      draw(lt, d, t) {
        plain();
        const shake = lt > sa ? Math.sin((lt - sa) * 30) * 0.35 : 0;
        if (lt < sa) { const sp = pop(lt, 0.05); if (sp > 0) K.saltShaker(540, 640, 1.25 * sp, 0, '#8C8579'); }   // mystery silhouette
        else { const rp = eob(seg(lt, sa, sa + 0.25)); K.saltShaker(540, 640, 1.25 * lerp(0.8, 1, rp), lerp(0, Math.PI * 0.85, eo(seg(lt, sa, sa + 0.2))) + shake); }
        if (lt > sa) for (let i = 0; i < 14; i++) { const ph = ((lt - sa) * 1.6 + rnd(i)) % 1; K.saltGrain(540 + (rnd(i + 5) - 0.5) * 160, 860 + ph * 320, 1, i, 1 - ph); }
        bigText('?', 760, 420, 170, C.yellow, 0.12, pop(lt, se, 0.25) * (1 - seg(lt, sa - 0.05, sa + 0.1)));
        K.burst(540, 830, 2.2, lt > sa ? 1 - seg(lt, sa + 0.2, sa + 0.6) : 0);
      } });
    cue(st, 'whoosh'); cue(st + se, 'pop', { gain: 0.5 }); cue(st + sa, 'pop', { gain: 0.6 }); cue(st + sa, 'sparkle', { dur: 0.6, gain: 0.5 }); cue(st + sa, 'thud', { gain: 0.4 });
  }

  // ── 5a · sodium in your blood: grains in a blood vessel; it balances (scale) ─────────────────────
  const outsideScale = (x, y) => !(x > 230 && x < 850 && y > 420 && y < 920);
  {
    const st = at('sodium', 4), so = Wd('sodium', 4) - st, bl = Wd('blood', 4) - st, ba = Wd('balances', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.08, note: 'inside blood: red cells drift; salt grains pop on "sodium" + SODIUM tag; balance scale (salt vs water drop) pops on "balances" and settles level',
      draw(lt, d, t) {
        K.insideBlood(t);
        if (lt > so) grains(t, { a: clamp((lt - so) * 6), keep: lt > ba ? outsideScale : () => true });
        K.tag('SODIUM', 790, 300, 140 + rnd(3) * 800 + 0, 290 + rnd(17) * 880, 52, pop(lt, so) * (1 - seg(lt, ba - 0.1, ba + 0.05)));
        const bp = pop(lt, ba, 0.3);
        if (bp > 0) { ctx.save(); ctx.translate(540, 560); ctx.scale(bp, bp); K.balance(0, 0, 1, 0.3 * Math.sin((lt - ba) * 9) * Math.max(0, 1 - (lt - ba) * 1.6)); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + so, 'sparkle', { dur: 0.4, gain: 0.4 }); cue(st + so + 0.05, 'pop', { gain: 0.4 }); cue(st + ba, 'thud', { gain: 0.5 }); cue(st + ba + 0.3, 'boing', { gain: 0.3 });
  }
  // ── 5b · water in and around your cells ──────────────────────────────────────────────────────────
  const CX = 540, CY = 720;
  {
    const st = Wd('water', 4, 'e') - 0.04, ar = Wd('around', 4) - st, ce = Wd('cells', 4) - st;   // cut at the end of "water", before "in and around"
    add({ id: 'S05b', at: st, cam: [CX, CY], zoom: 0.08, note: 'one cell in blood with salt grains around; water arrows in AND out (balanced) from the cut, drops circle "around" it, CELL tag on "cells"',
      draw(lt, d, t) {
        K.insideBlood(t);
        grains(t, { keep: (x, y) => Math.hypot(x - CX, y - CY) > 330 });
        K.cell(CX, CY, 190, { t });
        const ap = eo(seg(lt, 0.05, 0.3));
        for (const [an, inw] of [[Math.PI, 1], [0, 0], [-Math.PI / 2, 0], [Math.PI / 2, 1]]) {
          const r = 300, x = CX + Math.cos(an) * r, y = CY + Math.sin(an) * r;
          K.flowArrow(x, y, 120, inw ? an + Math.PI : an, ap);
        }
        if (lt > ar) for (let i = 0; i < 6; i++) { const an = i / 6 * Math.PI * 2 + (lt - ar) * 2.2; K.drop(CX + Math.cos(an) * 270, CY + Math.sin(an) * 270, 0.8, an + Math.PI, eo(seg(lt, ar, ar + 0.2))); }
        K.tag('CELL', 860, 330, CX + 140, CY - 140, 56, pop(lt, ce));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 0.4, gain: 0.35 }); cue(st + ar, 'bubbles', { dur: 0.6, gain: 0.35 }); cue(st + ce, 'pop', { gain: 0.5 });
  }

  // ── 6 · kidneys flush the extra, but only so fast (gauge pins red) ───────────────────────────────
  {
    const st = cut(5), ki = Wd('kidneys', 5) - st, fl = Wd('flush', 5) - st, on = Wd('only', 5) - st, fa = Wd('fast', 5) - st;
    const KS = 0.85, KL = [300, 560], KR = [780, 560], BX = 540, BY = 1060, BS = 0.62;
    const hl = K.kidneyHilum(KL[0], KL[1], KS), hr = K.kidneyHilum(KR[0], KR[1], KS, true);
    const tl = [BX - 220 * BS, BY - 360 * BS], tr = [BX + 220 * BS, BY - 360 * BS];
    const pathL = [hl, [hl[0] + 30, 700], tl], pathR = [hr, [hr[0] - 30, 700], tr];
    const along = (P, u) => { const k = u * 2, i = Math.min(1, Math.floor(k)), f = k - i; return [lerp(P[i][0], P[i + 1][0], f), lerp(P[i][1], P[i + 1][1], f)]; };
    add({ id: 'S06', at: st, cam: [540, 640], zoom: 0.08, note: 'two kidneys pop on "kidneys", drops drip down the ureters into the bladder from "flush" at a steady rate; speed gauge pops on "only", needle hits the red end on "fast" and stays pinned',
      draw(lt, d, t) {
        plain();
        const kp = pop(lt, ki - 0.1);
        for (const P of [pathL, pathR]) { line(P, C.pinkDark, 30); line(P, C.pink, 18); }
        K.bladder(BX, BY, BS, lerp(0.15, 0.6, eio(seg(lt, fl, d))), { t });
        if (kp > 0) { ctx.save(); ctx.translate(KL[0], KL[1]); ctx.scale(kp, kp); K.kidney(0, 0, KS); ctx.restore(); ctx.save(); ctx.translate(KR[0], KR[1]); ctx.scale(kp, kp); K.kidney(0, 0, KS, true); ctx.restore(); }
        if (lt > fl) for (const P of [pathL, pathR]) for (let i = 0; i < 3; i++) { const u = ((lt - fl) * 0.9 + i / 3) % 1; const [x, y] = along(P, u); K.drop(x, y, 0.45, Math.PI, clamp((lt - fl) * 4)); }
        const g = pop(lt, on - 0.05);
        const lv = lt < on ? 0.3 : lt < fa ? lerp(0.3, 0.97, eio(seg(lt, on, fa))) : 0.97 + Math.sin(lt * 40) * 0.015;
        K.speedGauge(540, 330, 0.75, lv, g);
        K.pinchRing(540, 300, 180, 140, (t * 2) % 1, lt > fa ? 0.8 * eo(seg(lt, fa, fa + 0.2)) : 0);
      } });
    cue(st, 'whoosh'); cue(st + ki - 0.1, 'pop', { gain: 0.5 }); cue(st + fl, 'bubbles', { dur: 1.0, gain: 0.35 }); cue(st + on - 0.05, 'pop', { gain: 0.4 });
    cue(st + on, 'slide', { dur: fa - on, gain: 0.4 }); cue(st + fa, 'alarm', { dur: 0.6, gain: 0.3 });
  }

  // ── 7 · outrun them: water floods the blood, the salt gets diluted ───────────────────────────────
  {
    const st = cut(6), ou = Wd('outrun', 6) - st, wa = Wd('water', 6) - st, di = Wd('dilutes', 6) - st, so = Wd('sodium', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.08, note: 'blood with salt grains, small gauge pinned red top right; a rain of water drops pours in from "outrun" (heavier on "water"); grains spread out + half fade on "dilutes"; SODIUM pill + red down arrow on "sodium"',
      draw(lt, d, t) {
        K.insideBlood(t);
        const dl = eio(seg(lt, di, so + 0.2));
        grains(t, { spread: dl * 0.9, fade: dl });
        if (lt > ou) {
          const n = lt < wa ? 10 : 22;
          for (let i = 0; i < n; i++) { const ph = ((lt - ou) * (0.8 + rnd(i + 7) * 0.5) + rnd(i)) % 1; K.drop(80 + rnd(i + 11) * 920, lerp(150, 1200, ph), 0.9, Math.PI, Math.min(1, ph * 6, (1 - ph) * 6)); }
        }
        K.speedGauge(880, 300, 0.4, 0.97 + Math.sin(lt * 40) * 0.015, 1);
        const sp = pop(lt, so);
        K.pill('SODIUM', 500, 660, 70, C.ink, C.white, sp);
        K.flowArrow(790, 660, 170, Math.PI / 2, sp > 0 ? clamp(sp) : 0, C.red, 30);
      } });
    cue(st, 'whoosh'); cue(st + ou, 'bubbles', { dur: 1.2, gain: 0.45 }); cue(st + wa, 'plop', { gain: 0.5 }); cue(st + di, 'sparkle', { dur: 0.6, gain: 0.35 }); cue(st + so, 'thud', { gain: 0.6 });
  }

  // ── 8 · water floods into your cells, and they swell ─────────────────────────────────────────────
  {
    const st = cut(7), fl = Wd('floods', 7) - st, ce = Wd('cells', 7) - st, sw = Wd('swell', 7) - st;
    add({ id: 'S08', at: st, cam: [CX, CY], zoom: 0.1, note: 'one cell, few grains (diluted); water arrows pop pointing IN on "floods" and drops stream inward; CELL tag on "cells"; the cell puffs up + wobbles + shock lines on "swell"',
      draw(lt, d, t) {
        K.insideBlood(t);
        grains(t, { spread: 0.9, fade: 1, keep: (x, y) => Math.hypot(x - CX, y - CY) > 300 });
        const sv = lt < fl ? 0 : lt < sw ? 0.3 * eio(seg(lt, fl, sw)) : lerp(0.3, 1, eob(seg(lt, sw, sw + 0.4)));
        const R = K.cell(CX, CY, 170, { swell: sv, t, wob: lt > sw ? 1 : 0 });
        const aa = lt > fl ? eo(seg(lt, fl, fl + 0.2)) * (1 - seg(lt, sw, sw + 0.25)) : 0;
        for (let i = 0; i < 6; i++) { const an = i / 6 * Math.PI * 2 + 0.3, r = R + 120; K.flowArrow(CX + Math.cos(an) * r, CY + Math.sin(an) * r, 130, an + Math.PI, aa); }
        if (lt > fl && lt < sw + 0.2) for (let i = 0; i < 8; i++) { const an = i / 8 * Math.PI * 2, ph = ((lt - fl) * 1.4 + rnd(i)) % 1, r = lerp(R + 240, R - 20, ph); K.drop(CX + Math.cos(an) * r, CY + Math.sin(an) * r, 0.6, an - Math.PI / 2, Math.min(1, (1 - ph) * 4) * (1 - seg(lt, sw, sw + 0.2))); }
        K.tag('CELL', 860, 300, CX + R * 0.62, CY - R * 0.78, 56, pop(lt, ce));
        K.shockLines(CX, CY - 40, R + 60, lt > sw ? clamp((lt - sw) * 5) : 0);
      } });
    cue(st, 'whoosh'); cue(st + fl, 'bubbles', { dur: sw - fl, gain: 0.45 }); cue(st + ce, 'pop', { gain: 0.5 }); cue(st + sw, 'boing', { gain: 0.7 });
  }

  // ── 9 · in your brain, that swelling builds pressure (x-ray skull) ───────────────────────────────
  {
    const st = cut(8), br = Wd('brain', 8) - st, sw = Wd('swelling', 8) - st, pr = Wd('pressure', 8) - st;
    const SX = 540, SY = 720;
    add({ id: 'S09', at: st, cam: [SX, SY], zoom: 0.1, note: 'x-ray film: skull outline with the brain inside; small yellow burst above it on "brain"; brain swells to fill the skull from "swelling"; red pressure arrows push out + warning on "pressure"',
      draw(lt, d, t) {
        K.xray(t);
        K.skull(SX, SY, 1);
        const sv = lt < sw ? 0 : eio(seg(lt, sw, pr));
        K.brain(SX - 10, SY - 20, lerp(0.8, 0.93, sv), { t, wob: lt > pr ? 1 : 0 });
        if (lt > br) K.burst(SX - 10, SY - 330, 1.2, 1 - seg(lt, br + 0.3, br + 0.7));
        K.pressureArrows(SX - 10, SY - 40, 300, 270, lt > pr ? eo(seg(lt, pr, pr + 0.25)) : 0, t);
        K.warning(880, 1110, pop(lt, pr) * 0.5);
      } });
    cue(st, 'whoosh'); cue(st + br, 'sparkle', { dur: 0.4, gain: 0.35 }); cue(st + sw, 'slide', { dur: pr - sw, gain: 0.4 }); cue(st + pr, 'alarm', { dur: 0.7, gain: 0.35 }); cue(st + pr, 'thud', { gain: 0.5 });
  }

  // ── 10 · symptoms: icon badges around the swollen brain ──────────────────────────────────────────
  const SYM = [['head', 260, 430, 'HEADACHE', 'headaches'], ['sick', 820, 430, 'NAUSEA', 'nausea'], ['confused', 260, 950, 'CONFUSION', 'confusion'], ['seizure', 820, 950, 'SEIZURES', 'seizures']];
  const symShot = (lt, t, st, line9, first) => {
    plain();
    K.brain(540, 700, 0.42, { t, wob: 1 });
    K.pinchRing(540, 690, 150, 130, (t * 2) % 1, 0.7);
    SYM.forEach(([k, x, y, lab, w], i) => {
      const a = Wd(w, line9) - st, sc = i < first ? 1 : pop(lt, a);
      if (sc <= 0) return;
      ctx.save(); ctx.globalAlpha = clamp(sc); line([[540 + (x - 540) * 0.32, 700 + (y - 700) * 0.4], [540 + (x - 540) * 0.62, 700 + (y - 700) * 0.62]], C.ink, 8); ctx.restore();
      K.symptom(k, x, y, 0.8, sc, t);
      K.pill(lab, x, y + 172, 40, C.ink, C.white, sc);
    });
  };
  {
    const st = cut(9), he = Wd('headaches', 9) - st, na = Wd('nausea', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.06, note: 'swollen brain icon in the middle; HEADACHE badge pops on "headaches", NAUSEA badge on "nausea"',
      draw(lt, d, t) { symShot(lt, t, st, 9, 0); } });
    cue(st, 'whoosh'); cue(st + he, 'pop', { gain: 0.5 }); cue(st + na, 'pop', { gain: 0.5 });
  }
  {
    const st = at('even', 9), co = Wd('confusion', 9) - st, se = Wd('seizures', 9) - st;
    add({ id: 'S10b', at: st, cam: [540, 760], zoom: 0.06, note: 'same board; CONFUSION badge pops on "confusion", SEIZURES badge on "seizures"',
      draw(lt, d, t) { symShot(lt, t, st, 9, 2); } });
    cue(st, 'whoosh', { gain: 0.7 }); cue(st + co, 'pop', { gain: 0.5 }); cue(st + se, 'pop', { gain: 0.6 }); cue(st + se, 'alarm', { dur: 0.5, gain: 0.25 });
  }

  // ── 11a · it's rare, but endurance athletes... ───────────────────────────────────────────────────
  const CROWD = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) CROWD.push([220 + c * 160, 420 + r * 300]);
  {
    const st = cut(10), ra = Wd('rare', 10) - st, en = Wd('endurance', 10) - st, ath = Wd('athletes', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.07, note: '15 person icons pop in; a green check + RARE pill on "rare"; on "endurance" the others fade and the middle one becomes an athlete (headband + bib) and grows',
      draw(lt, d, t) {
        plain();
        const g = eio(seg(lt, en, ath));
        CROWD.forEach(([x, y], i) => { if (i === 7) return; ctx.save(); ctx.globalAlpha = 1 - 0.75 * g; K.personIcon(x, y, 0.9, C.shirt, pop(lt, i * 0.02)); ctx.restore(); });
        const [mx, my] = CROWD[7];
        if (lt < en) K.personIcon(mx, my, 0.9, C.shirt, pop(lt, 0.14));
        else K.athleteIcon(mx, my, lerp(0.9, 1.6, g), 1);
        K.pill('RARE', 540, 195, 60, C.leaf, C.white, pop(lt, ra) * (1 - seg(lt, en - 0.05, en + 0.1)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.3 }); cue(st + ra, 'pop', { gain: 0.5 }); cue(st + en, 'sparkle', { dur: 0.5, gain: 0.4 });
  }
  // ── 11b · ...who overdo it are at risk: cups pile up next to the athlete, warning ───────────────────
  const CUPS = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) CUPS.push([640 + c * 130, 1020 - r * 160]);
  {
    const st = at('who', 10), ov = Wd('overdo', 10) - st, ri = Wd('risk', 10) - st;
    add({ id: 'S11b', at: st, cam: [540, 700], zoom: 0.08, note: 'athlete big on the left; on "overdo" water cups pile up fast beside him; warning triangle + red ring on "risk"',
      draw(lt, d, t) {
        plain();
        K.athleteIcon(310, 780, 2.2, 1);
        const n = lt < ov ? 1 : Math.min(9, 1 + Math.floor((lt - ov) / ((ri - ov) / 8)));
        CUPS.slice(0, n).forEach(([x, y], i) => K.glass(x, y, 0.55, 0.8, t + i));
        K.warning(770, 400, pop(lt, ri) * 0.75);
        K.pinchRing(310, 760, 260, 330, (t * 2) % 1, lt > ri ? 0.8 * eo(seg(lt, ri, ri + 0.2)) : 0);
      } });
    cue(st, 'whoosh'); for (let i = 1; i < 9; i++) cue(st + ov + i * (Wd('risk', 10) - Wd('overdo', 10)) / 8, 'pop', { gain: 0.25 }); cue(st + ri, 'alarm', { dur: 0.5, gain: 0.3 }); cue(st + ri, 'thud', { gain: 0.5 });
  }

  // ── 12 · so don't fear water: hero sips one normal glass when thirsty, smiles ─────────────────────
  {
    const st = cut(11), fe = Wd('fear', 11) - st, wa = Wd('water', 11) - st, dr = Wd('drink', 11) - st, th = Wd('thirsty', 11) - st;
    const HOLD = { e: [205, 20], h: [150, -30] }, SIP = { e: [235, -70], h: [112, -248] };
    add({ id: 'S12', at: st, cam: [480, 760], zoom: 0.08, note: 'room: hero relaxed with one glass; heart pops by the glass on "water"; he takes a normal sip on "drink" and lowers it, content smile + sparkle on "thirsty"',
      draw(lt, d, t) {
        K.home();
        const up = eio(seg(lt, dr - 0.2, dr + 0.15)) * (1 - eio(seg(lt, th - 0.1, th + 0.25)));
        const sipping = up > 0.6;
        hero({ look: lt < th ? 0.6 : 0, eyes: sipping ? 'closed' : 'n', mouth: sipping ? 'flat' : 'smile', brow: 0.4,
          arm: K.armPose(HOLD, SIP, up), holding: (x, y) => K.glass(x + 10, y - 20, 0.5, lerp(0.85, 0.6, seg(lt, dr, th)), t, -0.9 * up) });
        const hp = pop(lt, wa);
        if (hp > 0) K.heart(640, 760, 0.45 * hp, Math.max(0, Math.sin(lt * 9)));
        K.burst(HERO.x + 60, HERO.y - 600, 2.2, lt > th ? 1 - seg(lt, th + 0.3, th + 0.7) : 0);
      } });
    cue(st, 'whoosh'); cue(st + fe, 'pop', { gain: 0.3 }); cue(st + wa, 'pop', { gain: 0.5 }); cue(st + dr, 'gulp', { gain: 0.5 }); cue(st + th, 'sparkle', { dur: 0.5, gain: 0.5 });
  }

  // ── 13a · NEXT: series badge on "next" (name only, no number) ────────────────────────────────────
  {
    const st = cut(12), nx = Wd('next', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 700], zoom: 0.05, note: 'room, BODY FILES badge on "next"; hero (glass set down) looks to camera',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 130, 44, pop(lt, nx));
        hero({ look: 0, eyes: 'n', brow: 0.5, mouth: 'smile' });
      } });
    cue(st, 'whoosh'); cue(st + nx, 'thud', { gain: 0.6 });
  }
  // ── 13b · ...crack your knuckles every day: a hand pops in, knuckles glow, NEXT pill (hero only looks) ──
  const HX = 770, HY = 860, HS = 0.55;
  const knuckles = (a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; for (let i = 0; i < 4; i++) { const [kx, ky] = K.knuckleAt(i); ctx.beginPath(); ctx.arc(HX + kx * HS, HY + (ky + 10) * HS, 20, 0, Math.PI * 2); ctx.fillStyle = C.yellow; ctx.fill(); } ctx.restore(); };
  {
    const st = at('what', 12), cr = Wd('crack', 12) - st, kn = Wd('knuckles', 12) - st, ev = Wd('every', 12) - st;
    add({ id: 'S13b', at: st, cam: [600, 760], zoom: 0.06, note: 'hand (back of the hand, fingers up) pops in at the right on "crack"; knuckles ring yellow + NEXT pill on "knuckles", rings pulse on "every day"; hero only looks',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 130, 44, 1);
        const shock = lt > kn && lt < kn + 0.28;                     // brief surprise on "knuckles", then a curious smile
        hero({ look: lt > cr ? 1 : 0, eyes: shock ? 'wide' : 'n', brow: shock ? 1 : lt > cr ? 0.7 : 0.5, mouth: shock ? 'o' : lt > kn ? 'smile' : 'flat' });
        const hp = pop(lt, cr - 0.1);
        if (hp > 0) { ctx.save(); ctx.translate(HX, HY); ctx.scale(hp, hp); K.handSkin(0, 0, HS); ctx.restore(); }
        knuckles(lt > kn ? eo(seg(lt, kn, kn + 0.2)) * (lt > ev ? 0.6 + 0.4 * Math.sin((lt - ev) * 12) : 1) : 0);
        K.pill('NEXT', HX, 270, 52, C.yellow, C.ink, pop(lt, kn));
      } });
    cue(st, 'whoosh'); cue(st + cr - 0.1, 'pop', { gain: 0.5 }); cue(st + kn, 'pop', { gain: 0.5 }); cue(st + ev, 'tock', { gain: 0.4 });
  }
  // ── 14 · ...and what's really making that pop: joint lens with a gas bubble, POP!, FOLLOW ───────────
  {
    const st = cut(13), re = Wd('really', 13) - st, ma = Wd('making', 13) - st, po = Wd('pop', 13) - st;
    const [kx, ky] = K.knuckleAt(1), KX = HX + kx * HS, KY = HY + (ky + 10) * HS;
    add({ id: 'S14', at: st, cam: [620, 700], zoom: 0.05, note: 'end card: badge, hand + NEXT stay; joint lens pops above the index knuckle on "really", gas bubble grows from "making", bursts with POP! on "pop"; FOLLOW pill after "pop"; hero looks to camera',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 130, 44, 1);
        const huh = lt > po && lt < po + 0.28;                        // quick raised-brow "huh!" on "pop", back to smiling
        hero({ look: lt > po + 0.3 ? 0 : 1, eyes: 'n', brow: huh ? 1 : 0.6, mouth: huh ? 'o' : 'smile' });
        K.handSkin(HX, HY, HS);
        knuckles(0.6);
        K.pill('NEXT', HX, 270, 52, C.yellow, C.ink, 1);
        const lp = pop(lt, re);
        if (lp > 0) { ctx.save(); ctx.globalAlpha = clamp(lp); ctx.setLineDash([18, 14]); line([[KX, KY - 30], [760, 650]], C.ink, 8); ctx.restore(); }
        K.jointLens(760, 500, 125, { bubble: lt < ma ? 0 : eob(seg(lt, ma, po)), pop: lt > po ? seg(lt, po, po + 0.15) : 0, t }, lp);
        K.burst(775, 500, 1.6, lt > po ? 1 - seg(lt, po + 0.25, po + 0.7) : 0);
        bigText('POP!', 945, 765, 78, C.yellow, -0.12, pop(lt, po, 0.2));
        K.followPill(330, 270, pop(lt, po + 0.35), t);
      } });
    cue(st, 'whoosh'); cue(st + re, 'pop', { gain: 0.5 }); cue(st + ma, 'bubbles', { dur: po - ma, gain: 0.4 }); cue(st + po, 'pop', { gain: 0.8 }); cue(st + po + 0.35, 'pop', { gain: 0.5 });
  }

  return { shots: S, cues: CUES };
}
