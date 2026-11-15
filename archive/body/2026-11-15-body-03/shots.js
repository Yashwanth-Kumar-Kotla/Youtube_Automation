// WHAT HAPPENS WHEN YOU GET A FEVER?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Real world = THE room (K.home, framed wider via roomAt, floor at y 1120) with the hero at right. Graphics on the plain
// cream background: big thermometer with the 100.4°F line, shield vs cartoon germs, K.brainBuddy at K.thermostatDial,
// muscle close-up (K.fiberBundle) shaking / squeezing / warming, phone + doctor badge, calendar 1 → 3–4 DAYS.
// Shivering = K.blanketHero (the hero wrapped in a blanket). Tease (sunburn): K.sunSkinLens (sun over a skin patch that
// turns pink, then a few clean cartoon flakes lift) + NEXT; the hero only watches.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, bigText, line } from './core/lib.js';
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
  const ringIn = (lt, a, d = 0.2) => (lt > a ? eo(seg(lt, a, a + d)) : 0);
  // THE room, framed wider (camera pulled back): floor line at floorY, everything scaled k around x 540
  const roomAt = (floorY = 1120, k = 0.7) => {
    ctx.fillStyle = C.floor; ctx.fillRect(-300, -300, W + 600, H + 600);
    ctx.save(); ctx.translate(540, floorY); ctx.scale(k, k); ctx.translate(-540, -1560); K.home(); ctx.restore();
  };
  const HERO = { x: 830, y: 636, s: 0.78 };
  const hero = (o) => K.man({ ...HERO, ...o });
  const wrapped = (o, w) => K.blanketHero({ ...HERO, ...o }, w);
  const LBG = '#FFF1E0';
  const qMark = (a, t) => { if (a > 0) bigText('?', 0, 0, 230, C.white, -0.08, a * (1 + 0.05 * Math.sin(t * 6))); };
  const flake = (x, y, r, a, rot = 0) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.scale(a, a); K.snowflake(0, 0, r, C.ink, 22, rot); K.snowflake(0, 0, r, '#7EC3E0', 11, rot); ctx.restore(); };
  const TH = { x: 290, y: 690, s: 0.6 };   // the room thermometer (left of the hero)
  const LINE = 0.62, HIGH = 0.88;          // thermometer levels: the 100.4°F line, 103°F

  // ── 1 · HOOK: hot, sweaty hero; the room thermometer's red line shoots up ──
  {
    const fe = Wd('fever', 0);
    add({ id: 'S01', at: 0, cam: [560, 700], zoom: 0.07, note: 'room: thermometer (left) pops and its red line shoots up by 0.5 s; hero (right) sweating with warm wavy air rising off his head; on "fever" the line jumps higher and he goes wide-eyed "o"',
      draw(lt, d, t) {
        roomAt();
        const lvl = lerp(0.2, 0.7, eo(seg(lt, 0.05, 0.5))) + 0.12 * eio(seg(lt, fe, fe + 0.35));
        ctx.save(); const ps = pop(lt, 0, 0.25); ctx.translate(TH.x, TH.y); ctx.scale(ps, ps); ctx.translate(-TH.x, -TH.y); K.thermometer(TH.x, TH.y, TH.s, lvl); ctx.restore();
        const sur = lt > fe;
        hero({ look: -1, sweats: eo(seg(lt, 0.05, 0.35)), ct: t, eyes: sur ? 'wide' : 'n', mouth: sur ? 'o' : 'flat', brow: sur ? 1 : 0.6, sad: sur ? 0 : 0.6 });
        K.warmWaves(HERO.x, 240, 220, t, eo(seg(lt, 0.1, 0.4)), { n: 3, h: 140 });
      } });
    cue(0.08, 'whoosh', { gain: 0.5 }); cue(0.03, 'pop', { gain: 0.45 }); cue(0.08, 'slide', { dur: 0.45, gain: 0.35 }); cue(fe, 'boing', { gain: 0.45 }); cue(fe + 0.02, 'slide', { dur: 0.3, gain: 0.3 });
  }

  // ── 2a · Most doctors draw the line ──
  {
    const st = cut(1), dr = Wd('draw', 1) - st, li = Wd('line', 1) - st;
    add({ id: 'S02', at: st, cam: [480, 700], zoom: 0.07, note: 'room: a doctor (white coat, glasses) stands at right and points at the thermometer (red line at a normal level); on "draw" a dashed ink line draws across the tube, done on "line"',
      draw(lt, d, t) {
        roomAt();
        K.thermometer(TH.x, TH.y, TH.s, 0.4);
        K.thermoMark(TH.x, TH.y, TH.s, LINE, lt > dr ? eio(seg(lt, dr, li + 0.15)) : 0);
        const p = eio(seg(lt, 0.05, 0.4));
        K.doctor({ ...HERO, armL: K.armPose(K.ARM.down, K.ARM.side, p), look: -1, mouth: 'smile', brow: 0.4 });
      } });
    cue(st, 'whoosh'); cue(st + dr, 'slide', { dur: li + 0.15 - dr, gain: 0.35 }); cue(st + li + 0.15, 'pop', { gain: 0.5 });
  }
  // ── 2b · at one hundred point four degrees ──
  {
    const st = at('one', 1), on = Wd('one', 1) - st, fo = Wd('four', 1) - st, de = Wd('degrees', 1) - st;
    const T3 = { x: 400, y: 700, s: 0.9 }, ly = K.thermoY(T3.y, T3.s, LINE);
    add({ id: 'S03', at: st, cam: [560, 620], zoom: 0.07, note: 'big thermometer with the dashed line; "100.4°F" tag pops on "one", pointing at the line; the red climbs to touch the line by "four"; yellow ring round the spot on "degrees"',
      draw(lt, d, t) {
        plain();
        K.thermometer(T3.x, T3.y, T3.s, lerp(0.4, LINE, eio(seg(lt, on, fo + 0.2))));
        K.thermoMark(T3.x, T3.y, T3.s, LINE, 1);
        K.tag('100.4°F', 765, ly, T3.x + 140 * T3.s, ly, 72, pop(lt, on));
        K.hiRing(T3.x, ly, 120, 64, ringIn(lt, de) * out(lt, d - 0.25, 0.2));
      } });
    cue(st, 'whoosh'); cue(st + on, 'pop', { gain: 0.6 }); cue(st + on + 0.1, 'slide', { dur: fo - on + 0.1, gain: 0.3 }); cue(st + de, 'pop', { gain: 0.5 });
  }

  // ── 3 · so why are you shivering like you're freezing? ──
  {
    const st = cut(2), sv = Wd('shivering', 2) - st, fr = Wd('freezing', 2) - st;
    const WX = 760;
    add({ id: 'S04', at: st, cam: [640, 680], zoom: 0.06, note: 'room: the hero wrapped in a blanket, worried; small thermometer at left still reads high; he shakes hard with shake lines + chattering teeth on "shivering"; ice-blue snowflakes pop round him on "freezing"',
      draw(lt, d, t) {
        roomAt();
        K.thermometer(240, 720, 0.5, 0.74);
        const sh = lt > sv ? lerp(0.25, 1, eo(seg(lt, sv, sv + 0.2))) : 0.25 * eo(seg(lt, 0, 0.3));
        wrapped({ x: WX, look: -1, sad: 0.9, brow: 0.5, mouth: 'flat', eyes: lt > fr ? 'wide' : 'n' }, { shiver: sh, chatter: lt > sv ? 1 : 0, t });
        flake(470, 300, 44, pop(lt, fr), t * 0.8);
        flake(985, 250, 36, pop(lt, fr + 0.08), -t * 0.8);
        flake(445, 520, 34, pop(lt, fr + 0.16), t);
      } });
    cue(st, 'whoosh'); cue(st + sv, 'boing', { gain: 0.35 }); cue(st + sv + 0.05, 'alarm', { dur: 0.6, gain: 0.15 }); cue(st + fr, 'sparkle', { dur: 0.6, gain: 0.5 });
  }

  // ── 4 · When you're fighting off an infection ──
  {
    const st = cut(3), fi = Wd('fighting', 3) - st, inf = Wd('infection', 3) - st;
    const SH = [400, 700], GY = [540, 680, 820];
    const germX = (lt, i) => lt < fi ? lerp(1250, 730 + i * 30, eo(seg(lt, i * 0.06, fi))) : 730 + i * 30 + 70 * Math.abs(Math.sin((lt - fi) * 5.5 + i * 1.1));
    add({ id: 'S05', at: st, cam: [560, 680], zoom: 0.06, note: 'cartoon green germs swim in from the right toward a green immune shield; from "fighting" they bump off it (yellow bursts, shield jolts); on "infection" an INFECTION tag points at the top germ',
      draw(lt, d, t) {
        plain();
        const jolt = lt > fi ? Math.sin((lt - fi) * 11) * 6 : 0;
        K.shieldBadge(SH[0] + jolt, SH[1], 1.3, pop(lt, 0, 0.3));
        GY.forEach((gy, i) => {
          const gx = germX(lt, i);
          ctx.save(); ctx.translate(gx, gy + Math.sin(t * 5 + i) * 8); ctx.scale(-1, 1); K.bacterium(0, 0, 1.15, 0, t + i); ctx.restore();
          if (lt > fi) { const ph = ((lt - fi) * 5.5 + i * 1.1) / Math.PI, f = ph - Math.floor(ph); K.burst(660, gy, 0.9, f < 0.25 ? 1 - f * 4 : 0); }
        });
        K.tag('INFECTION', 780, 330, germX(lt, 0) + 20, GY[0] - 40 + Math.sin(t * 5) * 8, 56, pop(lt, inf));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.45 }); cue(st + 0.1, 'slide', { dur: fi - 0.1, gain: 0.3 }); cue(st + fi, 'thud', { gain: 0.55 }); cue(st + fi + 0.55, 'thud', { gain: 0.4 }); cue(st + inf, 'pop', { gain: 0.6 });
  }

  // ── 5 · your brain's thermostat resets to a higher temperature ──
  {
    const st = cut(4), th = Wd('thermostat', 4) - st, re = Wd('resets', 4) - st, hi = Wd('higher', 4) - st, te = Wd('temperature', 4) - st;
    const BR = [330, 700, 0.8], DI = [790, 700, 0.9];
    add({ id: 'S06', at: st, cam: [560, 680], zoom: 0.08, note: 'brain buddy (left) pops in; a thermostat dial pops on "thermostat" and the brain reaches its knob; from "resets" the knob turns from the blue zone into the red; red up arrow above the dial on "higher"; brain grins on "temperature"',
      draw(lt, d, t) {
        plain();
        const reach = lt > th ? eio(seg(lt, th + 0.1, th + 0.4)) * 0.84 : 0;
        K.brainBuddy(BR[0], BR[1], BR[2] * pop(lt, 0, 0.3), { t, point: reach, ang: 0.04, look: lt > th ? 1 : 0, mouth: lt > te ? 'smile' : 'smirk' });
        K.thermostatDial(DI[0], DI[1], DI[2], { level: lerp(0.32, 0.86, eio(seg(lt, re, hi + 0.3))), sc: pop(lt, th) });
        K.flowArrow(DI[0], 380, 150, -Math.PI / 2, lt > hi ? eo(seg(lt, hi, hi + 0.2)) : 0, C.red, 30, C.ink);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.45 }); cue(st + th, 'pop', { gain: 0.6 }); cue(st + re, 'slide', { dur: hi + 0.3 - re, gain: 0.4 }); cue(st + hi, 'pop', { gain: 0.55 });
  }

  // ── 6 · Your body has to catch up ──
  {
    const st = cut(5), ca = Wd('catch', 5) - st;
    const SET = 0.82, sy = K.thermoY(TH.y, TH.s, SET);
    add({ id: 'S07', at: st, cam: [520, 700], zoom: 0.06, note: 'room: thermometer with a new dashed line up high (little thermostat dial icon beside it = the new setting); the red sits well below it and starts climbing; white up arrow beside the tube on "catch"; hero wrapped in the blanket, shivering a little',
      draw(lt, d, t) {
        roomAt();
        K.thermometer(TH.x, TH.y, TH.s, lerp(0.42, 0.62, eio(seg(lt, ca - 0.2, d))));
        K.thermoMark(TH.x, TH.y, TH.s, SET, eio(seg(lt, 0.05, 0.35)));
        K.thermostatDial(120, sy, 0.27, { level: 0.86, sc: pop(lt, 0.05) });
        K.flowArrow(TH.x + 115, TH.y - 40, 150, -Math.PI / 2, lt > ca ? eo(seg(lt, ca, ca + 0.2)) : 0, C.white, 30, C.ink);
        wrapped({ look: -1, sad: 0.8, brow: 0.4, mouth: 'flat' }, { shiver: 0.35, chatter: 1, t });
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 0.3, gain: 0.3 }); cue(st + ca, 'pop', { gain: 0.5 }); cue(st + ca + 0.05, 'slide', { dur: 0.6, gain: 0.3 });
  }

  // ── 7-9 · the muscle close-up ──
  const MU = [540, 700], MW = 700;
  const muscle = (sq, t, jit = 0) => {
    ctx.save(); ctx.translate(jit, 0);
    const hl = K.fiberBundle(MU[0], MU[1], MW, sq, t);
    ctx.restore(); return hl;
  };
  const vShake = (hw, hh, t, a) => {   // flickering ink ticks above and below the bundle
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = clamp(a);
    for (const sd of [-1, 1]) for (const k of [-1, 0, 1]) { const ph = (Math.sin(t * 22 + k * 1.7 + sd) + 1) / 2, x = MU[0] + k * hw * 0.55;
      line([[x - 16, MU[1] + sd * (hh + 46)], [x + 16, MU[1] + sd * (hh + 84 + ph * 12)]], C.ink, 13); }
    ctx.restore();
  };
  {
    const st = cut(6), mu = Wd('muscles', 6) - st, sk = Wd('shaking', 6) - st;
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.07, note: 'muscle close-up (pink fibre bundle between two white tendon anchors) pops in; yellow ring round it on "muscles"; on "shaking" it shakes hard with ink shake ticks above and below',
      draw(lt, d, t) {
        plain();
        const ps = pop(lt, 0, 0.3), sh = lt > sk ? eo(seg(lt, sk, sk + 0.15)) : 0;
        ctx.save(); ctx.translate(MU[0], MU[1]); ctx.scale(ps, ps); ctx.translate(-MU[0], -MU[1]);
        const hl = muscle(0.3, t, Math.sin(t * 62) * 9 * sh);
        ctx.restore();
        K.hiRing(MU[0], MU[1], hl + 60, 190, ringIn(lt, mu) * out(lt, sk - 0.15, 0.15));
        vShake(hl, lerp(118, 158, 0.3), t, sh);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.45 }); cue(st + mu, 'pop', { gain: 0.55 }); cue(st + sk, 'boing', { gain: 0.35 }); cue(st + sk + 0.05, 'alarm', { dur: 0.5, gain: 0.15 });
  }
  {
    const st = cut(7), ti = Wd('tighten', 7) - st, rl = Wd('relax', 7) - st, ov = Wd('over', 7) - st;
    const P = 0.5;
    const sqAt = (lt) => lt < ti ? 0.2 : lt < rl ? lerp(0.2, 1, eio(seg(lt, ti, rl - 0.05))) : lt < ov ? lerp(1, 0, eio(seg(lt, rl, ov - 0.02))) : 0.5 - 0.5 * Math.cos((lt - ov) / P * Math.PI * 2);
    add({ id: 'S09', at: st, cam: [540, 680], zoom: 0.06, note: 'same muscle: squeezes short and fat on "tighten" (white arrows above point inward), stretches back on "relax" (arrows point out), then squeeze-relax-squeeze over and over',
      draw(lt, d, t) {
        plain();
        const sq = sqAt(lt), dv = (sqAt(lt + 0.02) - sqAt(lt)) / 0.02;
        muscle(sq, t);
        const a = clamp(Math.abs(dv) * 0.6), inw = dv > 0;
        const ay = MU[1] - 158 - 120;
        for (const sd of [-1, 1]) K.flowArrow(MU[0] + sd * 190, ay, 150, inw ? (sd < 0 ? 0 : Math.PI) : (sd < 0 ? Math.PI : 0), a, C.white, 28, C.ink);
      } });
    cue(st, 'whoosh'); cue(st + ti, 'slide', { dur: rl - ti, gain: 0.35 }); cue(st + rl, 'slide', { dur: ov - rl, gain: 0.3 });
    for (let k = 0; k < 4; k++) { const tt = ov + P / 2 + k * P; if (st + tt < cut(8) - 0.05) cue(st + tt, 'tock', { gain: 0.45 }); }
  }
  // ── 9 · and that movement is what warms you up (room: hero in the blanket + lens on the muscle) ──
  {
    const st = cut(8), mv = Wd('movement', 8) - st, wa = Wd('warms', 8) - st;
    const LX = 330, LY = 740, LR = 200;
    add({ id: 'S10', at: st, cam: [420, 720], zoom: 0.06, note: 'room: lens (left) shows the muscle squeezing and relaxing fast (ring on "movement"); on "warms" orange warm wavy air rises off the lens and the shivering hero (right) calms down and smiles, cheeks rosy',
      draw(lt, d, t) {
        roomAt();
        const warm = lt > wa ? eo(seg(lt, wa, wa + 0.5)) : 0;
        wrapped({ look: -1, sad: lerp(0.7, 0, warm), brow: 0.4, mouth: warm > 0.5 ? 'smile' : 'flat' }, { shiver: lerp(0.3, 0, warm), chatter: warm > 0.5 ? 0 : 1, t });
        K.lens(LX, LY, LR, pop(lt, 0, 0.3), () => {
          ctx.save(); ctx.scale(0.56, 0.56); K.fiberBundle(0, 0, 560, 0.5 - 0.5 * Math.cos(lt / 0.42 * Math.PI * 2), t); ctx.restore();
        }, C.bg);
        K.warmWaves(LX, LY - LR - 40, 280, t, warm, { n: 4, h: 200 });
        if (lt > mv && lt < wa + 0.2) K.hiRing(LX, LY, 140, 92, ringIn(lt, mv) * out(lt, wa - 0.1, 0.2));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.45 }); cue(st + mv, 'pop', { gain: 0.5 }); cue(st + wa, 'sizzle', { dur: 0.9, gain: 0.25 }); cue(st + wa + 0.1, 'sparkle', { dur: 0.5, gain: 0.35 });
  }

  // ── 10 · Rest up and drink plenty of water ──
  {
    const st = cut(9), rs = Wd('rest', 9) - st, wa = Wd('water', 9) - st;
    const BD = { x: 430, s: 0.78 }, by = 1120 - 190 * BD.s, NS = { x: 900, s: 0.8 }, ny = 1120 - 260 * NS.s, GL = [NS.x, ny - 128 * 0.7];
    add({ id: 'S11', at: st, cam: [600, 820], zoom: 0.06, note: 'room: the hero tucked up in bed, eyes closed, smiling; Z z z float up on "rest"; a glass of water pops onto the bedside table on "water" with a yellow ring',
      draw(lt, d, t) {
        roomAt();
        K.bed(BD.x, by, BD.s, { sleeper: { eyes: 'closed', mouth: 'smile', brow: 0.2 }, breathe: 0.5 + 0.5 * Math.sin(t * 3) });
        K.nightstand(NS.x, ny, NS.s);
        K.zzz(BD.x - 150, by - 140, t, lt > rs ? eo(seg(lt, rs, rs + 0.3)) : 0, 80);
        const gs = pop(lt, wa - 0.05);
        if (gs > 0) { ctx.save(); ctx.translate(GL[0], ny); ctx.scale(gs, gs); ctx.translate(-GL[0], -ny); K.outlinedGlass(GL[0], GL[1], 0.7, 0.75, t); ctx.restore(); }
        K.hiRing(GL[0], GL[1], 110, 120, ringIn(lt, wa + 0.15) * out(lt, d - 0.25, 0.2));
      } });
    cue(st, 'whoosh'); cue(st + rs, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + wa - 0.05, 'pop', { gain: 0.55 }); cue(st + wa + 0.15, 'plop', { gain: 0.4 });
  }

  // ── 11 · and call a doctor if it tops one hundred and three ──
  const PH = [820, 700, 0.8];
  const phoneDoc = (x, y, s, ring, bs, t) => {
    K.phone(x, y, s, '', ring, t);
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 38) * 0.07 * ring); K.doctorBadge(0, -80 * s, 0.75 * s, bs); ctx.restore();
  };
  {
    const st = cut(10), ca = Wd('call', 10) - st, dc = Wd('doctor', 10) - st, tp = Wd('tops', 10) - st, th = Wd('three', 10) - st;
    const T = { x: 260, y: 700, s: 0.85 }, hy = K.thermoY(T.y, T.s, HIGH);
    add({ id: 'S12', at: st, cam: [540, 640], zoom: 0.06, note: 'thermometer (left) with the 100.4 dashed line, red at the line; phone (right) pops and rings on "call", doctor badge on its screen on "doctor"; from "tops" the red climbs past the line; red "103°F" pill beside the top on "three"',
      draw(lt, d, t) {
        plain();
        K.thermometer(T.x, T.y, T.s, lerp(LINE, HIGH, eio(seg(lt, tp, th + 0.3))));
        K.thermoMark(T.x, T.y, T.s, LINE, 1);
        const ring = lt > ca ? eo(seg(lt, ca, ca + 0.15)) * out(lt, ca + 0.9, 0.3) : 0;
        ctx.save(); const ps = pop(lt, 0.02, 0.3); ctx.translate(PH[0], PH[1]); ctx.scale(ps, ps); ctx.translate(-PH[0], -PH[1]);
        phoneDoc(PH[0], PH[1], PH[2], ring, pop(lt, dc), t); ctx.restore();
        K.pill('103°F', 500, hy, 64, C.red, C.white, pop(lt, th));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.45 }); cue(st + ca, 'alarm', { dur: 0.7, gain: 0.3 }); cue(st + dc, 'pop', { gain: 0.6 }); cue(st + tp, 'slide', { dur: th + 0.3 - tp, gain: 0.35 }); cue(st + th, 'thud', { gain: 0.55 });
  }

  // ── 12 · or drags on past three or four days ──
  {
    const st = cut(11), dr = Wd('drags', 11) - st, th = Wd('three', 11) - st, fo = Wd('four', 11) - st, dy = Wd('days', 11) - st;
    const CA = [370, 700, 0.75], flips = [[0, '1', 'DAY'], [dr + 0.1, '2', 'DAYS'], [th, '3', 'DAYS'], [fo, '3–4', 'DAYS']];
    add({ id: 'S13', at: st, cam: [540, 680], zoom: 0.06, note: 'calendar (left) flips days: 1 DAY, 2 DAYS on "drags", 3 on "three", 3–4 DAYS on "four"; the phone with the doctor badge (right) rings on "days"',
      draw(lt, d, t) {
        plain();
        let k = 0; for (let i = 0; i < flips.length; i++) if (lt > flips[i][0]) k = i;
        const fl = k > 0 ? seg(lt, flips[k][0], flips[k][0] + 0.22) : 1, bump = k > 0 ? Math.sin(fl * Math.PI) : 0;
        ctx.save(); const ps = pop(lt, 0, 0.3); ctx.translate(CA[0], CA[1]); ctx.scale(ps * (1 + 0.06 * bump), ps * (1 - 0.1 * bump)); ctx.translate(-CA[0], -CA[1]);
        K.calendar(CA[0], CA[1], CA[2], flips[k][1], flips[k][2], -0.03 * bump); ctx.restore();
        const ring = lt > dy ? eo(seg(lt, dy, dy + 0.15)) : 0;
        phoneDoc(830, 660, 0.62, ring, 1, t);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); for (const f of flips.slice(1)) cue(st + f[0], 'tock', { gain: 0.55 }); cue(st + fo + 0.05, 'pop', { gain: 0.5 }); cue(st + dy, 'alarm', { dur: 0.6, gain: 0.3 });
  }

  // ── 13-14 · TEASE + END CARD (room): sunburn lens at left, NEXT, BODY FILES; the hero only watches ──
  const TL = [310, 730, 220], NX = [310, 1062];
  const badge = (sc) => K.filesBadge('BODY FILES', 540, 110, 54, sc);
  {
    const st = cut(12), nx = Wd('next', 12) - st, bo = Wd('body', 12) - st, wh = Wd('what', 12) - st, sb = Wd('sunburn', 12) - st;
    add({ id: 'S14', at: st, cam: [540, 720], zoom: 0.06, note: 'room: hero (right) waves; a lens with a "?" pops at left; NEXT pill on "Next", BODY FILES badge on "Body"; hero turns to the lens on "what"; on "sunburn" the "?" swaps for a sun over a skin patch that turns pink',
      draw(lt, d, t) {
        roomAt();
        badge(pop(lt, bo));
        const wv = eio(seg(lt, 0.05, 0.4)) * out(lt, wh - 0.3, 0.3);
        hero({ armL: K.armPose(K.ARM.down, K.ARM.wave, wv), look: lt > wh ? -1 : 0, mouth: lt > sb ? 'o' : 'smile', brow: lt > sb ? 0.9 : 0.5 });
        if (lt < sb) K.lens(TL[0], TL[1], TL[2], pop(lt, 0.03), () => qMark(1, t), LBG);
        else K.sunSkinLens(TL[0], TL[1], TL[2], { sun: pop(lt, sb, 0.3), burn: eio(seg(lt, sb + 0.1, sb + 0.6)), t });
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, pop(lt, nx));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.5 }); cue(st + nx, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.6 }); cue(st + sb, 'pop', { gain: 0.6 }); cue(st + sb + 0.1, 'sizzle', { dur: 0.5, gain: 0.25 });
  }
  {
    const st = cut(13), sk = Wd('skin', 13) - st, pe = Wd('peels', 13) - st, la = Wd('later', 13, 'e') - st;
    add({ id: 'S15', at: st, cam: [540, 720], zoom: 0.05, note: 'END CARD (room): BODY FILES badge, lens with the sun over pink skin; on "peels" a few clean pale flakes curl up and two drift off; NEXT pill; hero watches (brows up on "skin"), then after "later" turns to camera with a warm grin and + FOLLOW pops above the lens',
      draw(lt, d, t) {
        roomAt(); badge(1);
        const toCam = lt > la;
        hero({ look: toCam ? 0 : -1, mouth: toCam ? 'grin' : 'smile', brow: toCam ? 0.5 : lt > sk ? 0.9 : 0.6 });
        K.sunSkinLens(TL[0], TL[1], TL[2], { sun: 1, burn: 1, peel: lt > pe ? eio(seg(lt, pe, pe + 1.1)) : 0, t });
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, 1);
        K.followPill(TL[0], 400, pop(lt, la), t, 60);
      } });
    cue(st, 'whoosh'); cue(st + sk, 'pop', { gain: 0.4 }); cue(st + pe, 'sparkle', { dur: 0.8, gain: 0.35 }); cue(st + la, 'pop', { gain: 0.7 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES };
}
