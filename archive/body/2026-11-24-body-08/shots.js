// WHAT HAPPENS WHEN YOU GET A STITCH IN YOUR SIDE?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): the hero jogging along a pool deck, bent toward his right side with a hand pressed under
// his ribs (red pain zap), "~7 IN 10 RUNNERS" tag, A RUNNERS / B SWIMMERS pills, pool + lane ropes below (rewatch: the answer).
// Cuts sit on caption-chunk starts (word start - 0.05) so no caption runs past a cut.
// Guess (line 1b): two panels, runner vs swimmer, A / B pills. Re-hook (line 5): new scene, x-ray film + hard push into the shoulder.
// Answer (line 7): same two panels, check on B SWIMMERS, 75% vs 69%. Rewatch: cyan "phrenic nerve" + "14% felt it" labels.
// Tease (line 9a, from "Next"): plaque tooth hardening grey. Loop (9b "Still got that stitch?"): back to the exact frame-1 picture.
import { ctx, C, W, H, TAU, clamp, lerp, seg, eo, eio, eob, line, bigText, rr } from './core/lib.js';
import { T, L, Wd } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const at = (w, i) => Wd(w, i) - 0.05;          // cut = the caption chunk's start
  const plain = () => { ctx.fillStyle = C.bg; ctx.fillRect(-300, -300, W + 600, H + 600); };
  const pop = (lt, a, d = 0.3) => (lt > a ? eob(seg(lt, a, a + d)) : 0);
  const out = (lt, a, d = 0.25) => 1 - eio(seg(lt, a, a + d));
  const blip = (lt, a, d = 0.35) => (lt > a ? Math.sin(Math.PI * seg(lt, a, a + d)) : 0);
  const enter = (lt) => lerp(0.86, 1, eob(seg(lt, 0, 0.25)));

  // ── the hook set: jogging hero on a pool deck (frame 1 + loop) ──
  const DECK = 1150, HX = 330, HS = 0.72, HY = DECK - 625 * HS, LEAN = 0.06, HOOK_CAM = [540, 760];
  const T_LAST = (Math.ceil(T.dur * 30 - 1e-6) - 1) / 30;   // time of the film's last rendered frame
  const JF = 54 / T_LAST;                                   // jog cycles fit the film exactly: the loop seam keeps the stride phase
  const jog = (t) => { const ph = TAU * JF * t; return { bob: -Math.abs(Math.sin(ph)) * 16, step: 0.1 + 0.16 * Math.abs(Math.cos(ph)), arm: Math.sin(ph) }; };
  const ZAP_ANGS = [-1.0, -0.35, 0.3, 0.95];
  const jogger = (t, { eyes = 'n', mouth = 'flat', zap = 1, flare = 0, ring = 0 } = {}) => {
    const j = jog(t);
    ctx.save(); ctx.translate(HX, DECK); ctx.rotate(LEAN); ctx.translate(-HX, -DECK);
    K.man({ x: HX, y: HY + j.bob, s: HS, step: j.step, armL: K.stJogArm(j.arm), arm: K.ARM.stitch, eyes, mouth, brow: 0.9, frown: true, look: -0.2, sweat: 1 });
    const zx = HX + 175 * HS, zy = HY + j.bob + 40 * HS;
    K.painZap(zx, zy, 0.75 * (1 + 0.35 * flare), zap, t, ZAP_ANGS);
    K.hiRing(HX + 125 * HS, zy, 95, 70, ring);
    ctx.restore();
  };
  const PA = [770, 820], PB = [770, 960], PS = 44;
  const hookTag = (sc) => K.tag('~7 IN 10 RUNNERS', 770, 450, 545, 640, 40, sc);
  const hookPills = (sc, o = {}) => { K.abPill('A', 'RUNNERS', PA[0], PA[1], PS, { sc, ...o.a }); K.abPill('B', 'SWIMMERS', PB[0], PB[1], PS, { sc, ...o.b }); };

  // ── 1 · HOOK "What happens when you get a stitch in your side?" ──
  {
    const stt = Wd('stitch', 0), si = Wd('side', 0);
    add({ id: 'S01', at: 0, cam: HOOK_CAM, zoom: 0.05, note: 'FRAME 1 = hook: hero mid-jog on a pool deck, leaning into his right side with a hand pressed under the ribs (red pain zap), "~7 IN 10 RUNNERS" tag, A RUNNERS / B SWIMMERS pills, pool with lane ropes below (answer hint), all from frame 0; zap flares on "stitch"; yellow ring on his side on "side"',
      draw(lt, d, t) {
        K.stPoolside(DECK, t);
        jogger(t, { flare: blip(lt, stt, 0.4), ring: pop(lt, si, 0.25), eyes: lt > stt && lt < stt + 0.45 ? 'squeeze' : 'n' });
        hookTag(1); hookPills(1);
      } });
    cue(0.0, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(stt, 'zip', { gain: 0.45 }); cue(si, 'pop', { gain: 0.5 });
  }

  // ── 2a · "Nearly seven in ten runners get one." ──
  {
    const st = at('nearly', 1), se = Wd('seven', 1) - st, te = Wd('ten', 1) - st, ru = Wd('runners', 1) - st, on = Wd('one.', 1) - st;
    const XS = [140, 340, 540, 740, 940], ROWS = [600, 950], IS = 1.05;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.08, note: 'ten runner icons (red headbands, race bibs) jogging on two track strips (all on screen at the cut); from "seven" to "ten" seven of them get a red pain zap at the side one by one and tilt; "~7 IN 10" yellow pill on "ten"; RUNNERS row flash on "runners"; red STITCH stamp on "one"',
      draw(lt, d, t) {
        plain();
        for (const ry of ROWS) K.stTrack(40, 1040, ry + 110, 70);
        const order = [0, 2, 3, 5, 6, 8, 9];
        XS.forEach((x, c) => ROWS.forEach((ry, r) => {
          const i = r * 5 + c, k = order.indexOf(i), hit = k >= 0 ? pop(lt, se + k * ((te - se + 0.25) / 7), 0.25) : 0;
          const y = ry - Math.abs(Math.sin(t * 9 + i * 1.3)) * 12;
          ctx.save(); ctx.translate(x, y + 120 * IS); ctx.rotate(0.12 * clamp(hit)); ctx.translate(-x, -(y + 120 * IS));
          K.athleteIcon(x, y, IS, 1, C.shirt);
          if (hit > 0) K.painZap(x + 62 * IS, y + 30 * IS, 0.42, hit, t, ZAP_ANGS);
          ctx.restore();
        }));
        K.pill('~7 IN 10', 540, 250, 70, C.yellow, C.ink, pop(lt, te));
        if (lt > ru) { ctx.save(); ctx.globalAlpha = 0.5 * blip(lt, ru, 0.5); for (const ry of ROWS) { rr(40, ry + 110, 1000, 70, 18); ctx.fillStyle = C.yellow; ctx.fill(); } ctx.restore(); }
        K.stamp('STITCH!', 540, 1085, 54, -0.08, pop(lt, on, 0.22) * lerp(1.6, 1, eo(seg(lt, on, on + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + se, 'pop', { gain: 0.35 }); cue(st + se + 0.35, 'pop', { gain: 0.3 }); cue(st + te, 'pop', { gain: 0.65 }); cue(st + ru, 'tock', { gain: 0.35 }); cue(st + on, 'slam', { gain: 0.5 });
  }

  // ── the guess / answer panels (S03, S12) ──
  const GA = [290, 1000], GB = [790, 1000], GS = 40, PY0 = 360, PY1 = 900;
  const panel = (x0, x1, fn) => {
    ctx.save(); rr(x0, PY0, x1 - x0, PY1 - PY0, 30); ctx.clip(); fn(); ctx.restore();
    rr(x0, PY0, x1 - x0, PY1 - PY0, 30); ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.stroke();
  };
  const panels = (t, { dimA = 0, hiB = 0 } = {}) => {
    plain();
    panel(50, 530, () => {
      ctx.fillStyle = C.bg; ctx.fillRect(50, PY0, 480, PY1 - PY0); K.stTrack(30, 550, 760, 150);
      const y = 640 - Math.abs(Math.sin(t * 9)) * 22;
      ctx.save(); ctx.translate(290, y + 140); ctx.rotate(0.08); ctx.translate(-290, -(y + 140)); K.athleteIcon(290, y, 1.3); ctx.restore();
      for (const k of [0, 1, 2]) line([[120 + k * 0, 560 + k * 50], [190, 560 + k * 50]], C.gumEdge, 10);
      if (dimA > 0) { ctx.save(); ctx.globalAlpha = 0.35 * clamp(dimA); ctx.fillStyle = C.bg; ctx.fillRect(50, PY0, 480, PY1 - PY0); ctx.restore(); }
    });
    panel(550, 1030, () => {
      ctx.fillStyle = C.bg; ctx.fillRect(550, PY0, 480, PY1 - PY0);
      ctx.fillStyle = C.sky; ctx.fillRect(550, 620, 480, 400); ctx.fillStyle = '#7EC3E0'; ctx.fillRect(550, 820, 480, 200);
      K.stLaneRope(780, t, 13, 550, 1040);
      K.stSwimmer(860, 625, 0.72, { t });
      if (hiB > 0) { ctx.save(); ctx.globalAlpha = 0.3 * clamp(hiB); ctx.fillStyle = C.yellow; ctx.fillRect(550, PY0, 480, PY1 - PY0); ctx.restore(); }
    });
  };

  // ── 2b · GUESS "Who gets more, runners or swimmers?" ──
  {
    const st = at('who', 1), mo = Wd('more', 1) - st, ru = Wd('runners', 1, 's') - st, sw = Wd('swimmers', 1) - st;
    const ru2 = T.words.filter((w) => w.line === 1 && /^runners/i.test(w.w))[1].s - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.07, note: 'GUESS: two panels on screen at the cut, a runner bobbing on a track (left) and a swimmer gliding through a lane (right); big yellow "?" bounces on "more"; pill A RUNNERS pops on "runners", B SWIMMERS on "swimmers" (under their panels)',
      draw(lt, d, t) {
        panels(t);
        bigText('?', 540, 250, 170 * pop(lt, mo), C.yellow, 0.1);
        K.abPill('A', 'RUNNERS', GA[0], GA[1], GS, { sc: pop(lt, ru2), hi: blip(lt, ru2, 0.4) });
        K.abPill('B', 'SWIMMERS', GB[0], GB[1], GS, { sc: pop(lt, sw), hi: blip(lt, sw, 0.4) });
        void ru;
      } });
    cue(st, 'whoosh'); cue(st + mo, 'boing', { gain: 0.4 }); cue(st + ru2, 'pop', { gain: 0.65 }); cue(st + sw, 'pop', { gain: 0.65 }); cue(st + 0.1, 'bubbles', { dur: 1.2, gain: 0.15 });
  }

  // ── lineup helpers ──
  const FLOOR = 1080, SX = [210, 540, 870];
  const shadow = (x, s, a = 1) => { ctx.save(); ctx.globalAlpha = a; K.personIcon(x, FLOOR - 120 * s, s, '#5A6573'); ctx.restore(); };
  const pedestal = (x, w = 260, h = 150) => { rr(x - w / 2, FLOOR - h, w, h, 14); ctx.fillStyle = '#9A5333'; ctx.fill(); rr(x - w / 2, FLOOR - h, w, h - 14, 14); ctx.fillStyle = '#B5653F'; ctx.fill(); };
  const burgerFace = (x, y, s, look = 0) => { for (const sd of [-1, 1]) { ctx.save(); ctx.translate(x + (sd * 36 + look * 6) * s, y); ctx.scale(s, s); ctx.beginPath(); ctx.ellipse(0, 0, 11, 14, 0, 0, TAU); ctx.fillStyle = C.ink; ctx.fill(); ctx.beginPath(); ctx.arc(4, -5, 4, 0, TAU); ctx.fillStyle = C.white; ctx.fill(); ctx.restore(); } };
  // suspect 1: burger on a pedestal (plate bottom on the pedestal)
  const sus1 = (x, s, { hop = 0, eaten = 0 } = {}) => {
    pedestal(x, 280 * s, 170 * s);
    const py = FLOOR - 170 * s - 80 * s - hop;
    K.mealPlate(x, py, s, { eaten }); burgerFace(x, py - 120 * s, s);
  };
  const sus2 = (x, s, t, { ext = null, face = { look: 0, mood: 'worried' }, rot = 0 } = {}) => K.stSpringLiver(x, FLOOR - 4, s, { ext: ext ?? 0.5 + 0.5 * Math.sin(t * 10), face, rot });
  const sus3 = (x, s, t, o = {}) => K.stLiningSheet(x, FLOOR - 170 * s, s, { t, ...o });

  // ── 3 · "Nobody's sure why. Three suspects." ──
  {
    const st = at("nobody's", 2), su = Wd('sure', 2) - st, wh = Wd('why', 2) - st, th = Wd('three', 2) - st, sp = Wd('suspects', 2) - st;
    add({ id: 'S04', at: st, cam: [540, 720], zoom: 0.08, note: 'police lineup wall with height lines, three grey shadow suspects standing at it (on screen at the cut); white "?" pops on each from "sure" to "why"; on "Three" number plates 1-2-3 pop; spotlights snap on over all three on "suspects"',
      draw(lt, d, t) {
        K.stLineup(FLOOR);
        SX.forEach((x, i) => K.stSpot(x, FLOOR, pop(lt, sp + i * 0.08, 0.2), 150));
        SX.forEach((x, i) => {
          shadow(x, 2.1);
          bigText('?', x, FLOOR - 120 * 2.1 - 80 * 2.1, 120 * pop(lt, su + i * ((wh - su + 0.2) / 3), 0.25), C.white, 0);
          K.stPlate(i + 1, x, FLOOR - 120 * 2.1 + 30, pop(lt, th + i * 0.1, 0.25));
        });
      } });
    cue(st, 'whoosh'); cue(st + su, 'pop', { gain: 0.35 }); cue(st + wh, 'pop', { gain: 0.35 }); cue(st + th, 'tock', { gain: 0.45 }); cue(st + sp, 'thud', { gain: 0.55 });
  }

  // ── 4a · "Suspect one: food." ──
  {
    const st = at('suspect', 3), on = Wd('one:', 3) - st, fo = Wd('food', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.12, note: 'lineup close-up: suspect 1 = a burger with eyes on a plate on a wooden pedestal under a spotlight (on screen at the cut); plate "1" turns yellow on "one"; on "food" a camera-flash mug shot (white flash + yellow burst) and the burger hops',
      draw(lt, d, t) {
        K.stLineup(FLOOR);
        K.stSpot(540, FLOOR, 1, 240);
        sus1(540, 1.55, { hop: 40 * blip(lt, fo, 0.35) });
        K.stPlate(1, 540, FLOOR - 60, 1, seg(lt, on, on + 0.15));
        K.burst(540, 560, 2.6, blip(lt, fo, 0.4));
        if (lt > fo && lt < fo + 0.15) { ctx.save(); ctx.globalAlpha = 0.6 * (1 - (lt - fo) / 0.15); ctx.fillStyle = C.white; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + on, 'tock', { gain: 0.45 }); cue(st + fo, 'pop', { gain: 0.7 }); cue(st + fo + 0.05, 'boing', { gain: 0.3 });
  }

  // ── 4b · RELATABLE "Ever jogged after a big lunch?" (x-ray) ──
  {
    const st = at('ever', 3), jo = Wd('jogged', 3) - st, bi = Wd('big', 3) - st, lu = Wd('lunch', 3) - st;
    const X = 540, Y = 700, SC = 0.85;
    add({ id: 'S06', at: st, cam: [540, 700], zoom: 0.1, note: 'x-ray film: the hero (whole body x-ray, head normal) on screen at the cut; he starts jogging (bob + arm swing) on "jogged"; his stomach swells with burger chunks on "big"; red pain zap at his side + wince on "lunch"',
      draw(lt, d, t) {
        K.xray(t);
        const run = seg(lt, jo - 0.1, jo + 0.1), ph = (lt - jo) * 10, bob = -Math.abs(Math.sin(ph)) * 18 * run;
        const sw = eo(seg(lt, bi - 0.05, lu + 0.1));
        const hurt = lt > lu;
        K.man({ x: X, y: Y + bob, s: SC, xray: true, pulse: sw, armL: K.armPose(K.ARM.down, K.stJogArm(Math.sin(ph)), run), arm: hurt ? K.armPose(K.ARM.down, K.ARM.stitch, eo(seg(lt, lu, lu + 0.2))) : K.armPose(K.ARM.down, K.stJogArm(-Math.sin(ph)), run),
          eyes: hurt ? 'squeeze' : 'n', mouth: hurt ? 'flat' : 'smile', brow: hurt ? 0.9 : 0.3, frown: hurt });
        for (const [dx, dy, k] of [[0, 0, 'bread'], [40, 20, 'pea'], [-30, 30, 'carrot'], [20, 50, 'bread']]) K.foodBit(k, X + (20 + dx) * SC, Y + bob + (10 + dy) * SC, 0.7 * pop(lt, bi + 0.05, 0.25), dx * 0.02);
        K.painZap(X + 180 * SC, Y + bob + 40 * SC, 0.8, pop(lt, lu, 0.25), t, ZAP_ANGS);
      } });
    cue(st, 'whoosh'); cue(st + jo, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + bi, 'gulp', { gain: 0.5 }); cue(st + lu, 'zip', { gain: 0.5 });
  }

  // ── 5a · "Suspect two:" ──
  {
    const st = at('suspect', 4), tw = Wd('two:', 4) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.12, note: 'lineup close-up: suspect 2 = a worried liver bouncing on a coil spring under the spotlight (on screen at the cut); plate "2" turns yellow on "two"',
      draw(lt, d, t) {
        K.stLineup(FLOOR);
        K.stSpot(540, FLOOR, 1, 240);
        sus2(540, 1.6, t);
        K.stPlate(2, 540, FLOOR + 20, 1, seg(lt, tw, tw + 0.15));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'boing', { gain: 0.3 }); cue(st + tw, 'tock', { gain: 0.45 }); cue(st + 0.9, 'boing', { gain: 0.25 });
  }

  // ── 5b · "bouncing organs tugging your diaphragm." (x-ray torso in a lens) ──
  {
    const st = at('bouncing', 4), bo = Wd('bouncing', 4) - st, tu = Wd('tugging', 4) - st, di = Wd('diaphragm', 4) - st;
    const LX = 540, LY = 640, LR = 400, MS = 1.5, MY = -70;   // man origin in lens coords: (0, MY)
    const domeY = (x, j) => { const u = (x + 158) / 316, cy = lerp(16, 118, j); return (1 - u) * (1 - u) * 150 + 2 * u * (1 - u) * cy + u * u * 150; };
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.1, note: 'x-ray lens on plain paper: the hero\'s x-ray chest (lungs, pink diaphragm dome, liver + stomach under it) on screen at the cut; organs bounce from "bouncing"; pink cords from the liver pull the diaphragm dome down from "tugging"; dome glows yellow + DIAPHRAGM tag on "diaphragm"',
      draw(lt, d, t) {
        plain();
        const ph = t * 13, b = Math.abs(Math.sin(ph)), tug = seg(lt, tu - 0.05, tu + 0.2), jit = tug * (0.12 + 0.3 * (1 - b));
        K.lens(LX, LY, LR, 1, () => {
          ctx.fillStyle = C.navy; ctx.fillRect(-LR - 10, -LR - 10, 2 * LR + 20, 2 * LR + 20);
          K.man({ x: 0, y: MY, s: MS, xray: true, dia: jit, diaHi: pop(lt, di, 0.25) * 0.9 });
          ctx.save(); ctx.translate(0, MY); ctx.scale(MS, MS);
          const dy = -16 * b * seg(lt, 0, 0.1);
          K.stomach(-62, 150 + dy * 0.7, 0.42);
          const lx = 62, ly = 172 + dy;
          if (tug > 0) for (const ox of [-30, 30]) { const top = domeY(lx + ox, jit) + 8; ctx.save(); ctx.globalAlpha = tug; line([[lx + ox, ly - 30], [lx + ox, top]], C.pinkDark, 9); line([[lx + ox, ly - 30], [lx + ox, top]], C.pinkLight, 4); ctx.restore(); }
          K.stLiver(lx, ly, 0.48, 0.12);
          ctx.restore();
        }, C.navy);
        K.tag('DIAPHRAGM', 800, 1110, LX + 40, LY + MY + 95 * MS, 40, pop(lt, di));
      } });
    cue(st, 'whoosh'); cue(st + bo, 'boing', { gain: 0.4 }); cue(st + bo + 0.3, 'boing', { gain: 0.3 }); cue(st + tu, 'slide', { dur: 0.4, gain: 0.35 }); cue(st + di, 'pop', { gain: 0.6 });
  }

  // ── 6 · RE-HOOK "But here's the weird part: it can hit your shoulder." (new scene: x-ray film, push into the shoulder) ──
  {
    const st = at('but', 5), we = Wd('weird', 5) - st, pa = Wd('part', 5) - st, hi = Wd('hit', 5) - st, sh = Wd('shoulder', 5) - st;
    const X = 440, Y = 880, SC = 1.25;
    const P = (lx, ly) => [X + lx * SC, Y + ly * SC];
    const NERVE = [P(70, 110), P(60, 20), P(42, -90), P(30, -200), P(34, -236), P(80, -214), P(140, -186)];
    add({ id: 'S09', at: st, cam: [600, 700], zoom: 0.32, note: 'RE-HOOK, new scene: x-ray film, the hero\'s x-ray upper body big and off-centre (on screen at the cut), the camera pushing hard toward his shoulder; shock lines on "weird"; an x-ray-cyan nerve line draws from the diaphragm up the neck to the shoulder tip from "part" to "hit" with a yellow blip running up; red zap + yellow ring on the shoulder tip on "shoulder"; small labels "phrenic nerve" (on "hit") and "14% felt it" (on "shoulder") = rewatch detail',
      draw(lt, d, t) {
        K.xray(t);
        const sur = lt > we;
        K.man({ x: X, y: Y, s: SC, xray: true, dia: 0, diaHi: 0.6 * blip(lt, pa, 0.5), eyes: sur ? 'wide' : 'n', mouth: lt > sh ? 'o' : (sur ? 'flat' : 'smile'), brow: sur ? 1 : 0.3, look: 0.5 });
        K.shockLines(X, Y - 350 * SC, 160, blip(lt, we, 0.6));
        const dr = eio(seg(lt, pa - 0.1, hi + 0.15));
        if (dr > 0) {
          const cum = [0]; for (let i = 1; i < NERVE.length; i++) cum.push(cum[i - 1] + Math.hypot(NERVE[i][0] - NERVE[i - 1][0], NERVE[i][1] - NERVE[i - 1][1]));
          const len = cum[cum.length - 1], part = [NERVE[0]];
          for (let i = 1; i < NERVE.length; i++) { if (cum[i] <= dr * len) part.push(NERVE[i]); else { const f = (dr * len - cum[i - 1]) / (cum[i] - cum[i - 1]); part.push([lerp(NERVE[i - 1][0], NERVE[i][0], f), lerp(NERVE[i - 1][1], NERVE[i][1], f)]); break; } }
          line(part, C.xnavy, 16); line(part, C.cyan, 7);
          if (dr < 1 || lt < sh + 0.3) { const [bx, by] = part[part.length - 1]; ctx.beginPath(); ctx.arc(bx, by, 22, 0, TAU); ctx.fillStyle = C.ink; ctx.fill(); ctx.beginPath(); ctx.arc(bx, by, 15, 0, TAU); ctx.fillStyle = C.yellow; ctx.fill(); }
        }
        const [sx, sy] = P(150, -190);
        K.hiRing(sx, sy, 70, 70, pop(lt, sh, 0.25));
        K.painZap(sx + 10, sy - 10, 0.8, pop(lt, sh, 0.25), t, [-2.2, -1.5, -0.8, -0.1]);
        K.tag('phrenic nerve', 290, 560, P(36, -150)[0], P(36, -150)[1], 30, pop(lt, hi));
        K.pill('14% felt it', 810, 500, 32, C.ink, C.yellow, pop(lt, sh + 0.1));
      } });
    cue(st, 'whoosh'); cue(st + we, 'slam', { gain: 0.5 }); cue(st + pa, 'slide', { dur: hi - pa + 0.15, gain: 0.3 }); cue(st + hi, 'pop', { gain: 0.45 }); cue(st + sh, 'zip', { gain: 0.5 }); cue(st + sh + 0.1, 'pop', { gain: 0.45 });
  }

  // ── 7a · "Suspect three: your belly's lining," ──
  {
    const st = at('suspect', 6), th = Wd('three:', 6) - st, li = Wd('lining', 6) - st, be = Wd("belly's", 6) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.12, note: 'lineup close-up: suspect 3 = the belly lining as a wavy pale-pink sheet with a face under the spotlight (on screen at the cut); plate "3" turns yellow on "three"; the sheet ripples + yellow ring on "lining"',
      draw(lt, d, t) {
        K.stLineup(FLOOR);
        K.stSpot(540, FLOOR, 1, 240);
        sus3(540, 1.5, t, { wob: blip(lt, li, 0.6) + 0.15 });
        K.hiRing(540, FLOOR - 170 * 1.5, 250, 300, pop(lt, li, 0.25) * out(lt, li + 0.9));
        K.stPlate(3, 540, FLOOR + 20, 1, seg(lt, th, th + 0.15));
        void be;
      } });
    cue(st, 'whoosh'); cue(st + th, 'tock', { gain: 0.45 }); cue(st + li, 'pop', { gain: 0.55 });
  }

  // ── 7b · "rubbing and getting irritated." (lining lens) ──
  {
    const st = at('rubbing', 6), ru = Wd('rubbing', 6) - st, ir = Wd('irritated', 6) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.12, note: 'close-up lens (on screen at the cut): belly wall muscle on top, its smooth lining, a thin gap, gut loops below; from "rubbing" the lining and the gut slide back and forth past each other with white friction ticks; on "irritated" the lining turns red with yellow zaps; BELLY WALL / LINING / GUT labels',
      draw(lt, d, t) {
        plain();
        K.stLiningLens(540, 690, 360, { rub: seg(lt, ru - 0.05, ru + 0.2), irritate: eo(seg(lt, ir - 0.05, ir + 0.3)), t: lt, sc: enter(lt) });
        K.pill('BELLY WALL', 540, 250, 40, C.ink, C.white, enter(lt));
        K.tag('LINING', 900, 330, 800, 612, 38, enter(lt));
        K.pill('GUT', 540, 1108, 38, C.ink, C.white, enter(lt));
      } });
    cue(st, 'whoosh'); cue(st + ru, 'slide', { dur: 0.7, gain: 0.35 }); cue(st + ir, 'sizzle', { dur: 0.6, gain: 0.35 }); cue(st + ir, 'pop', { gain: 0.5 });
  }

  // ── 8 · ANSWER "Swimmers! Seventy-five percent." ──
  {
    const st = at('swimmers', 7), sw = Wd('swimmers', 7) - st, se = Wd('seventy', 7) - st, pe = Wd('percent', 7) - st;
    add({ id: 'S12', at: st, cam: [540, 700], zoom: 0.07, note: 'ANSWER: the guess panels + A / B pills in the same spots (on screen at the cut); on "Swimmers" the check lands on B SWIMMERS, A dims, the swimmer panel glows; big yellow 75% on the swimmer panel on "Seventy-five", small 69% on the runner panel on "percent"; COMMENT A OR B pill ~1 s (not voiced)',
      draw(lt, d, t) {
        panels(t, { dimA: seg(lt, sw, sw + 0.3), hiB: blip(lt, sw, 0.6) });
        K.pill('75%', 790, 460, 84, C.yellow, C.ink, pop(lt, se));
        K.pill('69%', 290, 460, 50, C.ink, C.white, pop(lt, pe));
        K.abPill('A', 'RUNNERS', GA[0], GA[1], GS, { sc: 1, dim: seg(lt, sw, sw + 0.3) });
        K.abPill('B', 'SWIMMERS', GB[0], GB[1], GS, { sc: 1, check: pop(lt, sw, 0.3), hi: blip(lt, sw, 0.45) });
        K.pill('COMMENT A OR B', 540, 1110, 32, C.ink, C.yellow, pop(lt, sw + 0.35, 0.25) * out(lt, sw + 1.3, 0.2));
      } });
    cue(st, 'whoosh'); cue(st + sw, 'pop', { gain: 0.8 }); cue(st + se, 'slam', { gain: 0.5 }); cue(st + pe, 'pop', { gain: 0.4 }); cue(st + sw + 0.35, 'pop', { gain: 0.3 });
  }

  // ── 9 · "No bouncing there, so maybe it's the lining." (the full lineup) ──
  {
    const st = at('no', 8), bo = Wd('bouncing', 8) - st, ma = Wd('maybe', 8) - st, li = Wd('lining', 8) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.08, note: 'the full lineup (all three suspects on screen at the cut: burger, spring liver, lining sheet) with plates; a red X slams over suspect 2 on "bouncing" (its spring freezes); the spotlight swings to suspect 3 on "maybe"; yellow ring + "best fit (2015 review)" pill on "lining"',
      draw(lt, d, t) {
        K.stLineup(FLOOR);
        const sw = eio(seg(lt, ma - 0.05, ma + 0.35));
        K.stSpot(lerp(540, SX[2], sw), FLOOR, 1, 160);
        sus1(SX[0], 0.8);
        sus2(SX[1], 0.9, t, lt > bo ? { ext: 0.3, face: { look: 0, mood: 'worried' } } : {});
        sus3(SX[2], 0.95, t, { wob: blip(lt, li, 0.6) + 0.1 });
        SX.forEach((x, i) => K.stPlate(i + 1, x, FLOOR + 36, 0.8, i === 2 ? seg(lt, ma, ma + 0.2) : 0));
        if (lt > bo) K.redX(SX[1], 820, lerp(0.75, 0.48, eo(seg(lt, bo, bo + 0.2))), 1, 0.8);
        K.hiRing(SX[2], FLOOR - 175, 160, 185, pop(lt, li, 0.25));
        K.pill('best fit (2015 review)', 700, 400, 42, C.ink, C.white, pop(lt, li + 0.05));
      } });
    cue(st, 'whoosh'); cue(st + bo, 'slam', { gain: 0.6 }); cue(st + ma, 'slide', { dur: 0.35, gain: 0.3 }); cue(st + li, 'pop', { gain: 0.6 });
  }

  // ── 10a · TEASE "Next Body File: skip brushing, plaque sets like cement." (starts on "Next") ──
  const badge = (x, y, sc, size = 44) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = at('next', 9), bo = Wd('body', 9) - st, sk = Wd('skip', 9) - st, br = Wd('brushing', 9) - st, pl = Wd('plaque', 9) - st, se = Wd('sets', 9) - st, ce = Wd('cement', 9) - st;
    add({ id: 'S14', at: st, cam: [540, 640], zoom: 0.08, note: 'tease (cut on "Next"): a big smiling cartoon molar + yellow NEXT pill on screen at the cut; BODY FILES badge on "Body"; a toothbrush slides in on "skip" and gets a red X on "brushing"; a soft yellow plaque film grows along the tooth on "plaque"; it hardens grey and crusty from "sets" to "cement" (tooth goes wide-eyed, thud) + TARTAR pill',
      draw(lt, d, t) {
        plain();
        const hard = eio(seg(lt, se, ce + 0.15));
        if (lt > ce) K.burst(470, 700, 3.4, blip(lt, ce, 0.4));
        K.stPlaqueTooth(470, 700, 1.55, { plaque: eo(seg(lt, pl - 0.05, pl + 0.4)), cement: hard, face: lt > ce ? 'wow' : 'smile', t, sc: enter(lt) });
        const bx = lerp(1300, 860, eio(seg(lt, sk - 0.05, sk + 0.3)));
        K.stToothbrush(bx, 760, 0.85, -1.35);
        if (lt > br) K.redX(860, 760, lerp(0.7, 0.4, eo(seg(lt, br, br + 0.2))), 1, 0.8);
        K.pill('NEXT', 540, 170, 64, C.yellow, C.ink, pop(lt, 0.03, 0.25));
        badge(540, 290, pop(lt, bo));
        K.pill('TARTAR', 470, 1035, 44, C.ink, C.white, pop(lt, ce + 0.05));
      } });
    cue(st, 'whoosh'); cue(st + 0.03, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.4 }); cue(st + sk, 'slide', { dur: 0.3, gain: 0.35 }); cue(st + br, 'slam', { gain: 0.5 });
    cue(st + pl, 'bubbles', { dur: 0.4, gain: 0.25 }); cue(st + ce, 'thud', { gain: 0.7 }); cue(st + ce + 0.05, 'pop', { gain: 0.4 });
  }

  // ── 10b · LOOP "Still got that stitch?" (back to the exact frame-1 picture) ──
  {
    const st = at('still', 9), sti = Wd('stitch', 9) - st, Z = 0;
    add({ id: 'S15', at: st, cam: HOOK_CAM, zoom: Z, note: 'LOOP + END CARD: the frame-1 pool deck, the hero jogging and clutching his side (on screen at the cut, same stride phase clock as frame 1); zap flares + yellow ring on his side on "stitch"; ~7 IN 10 tag + A / B pills pop back in after "stitch" so the last frame = frame 1 (same camera, no push); end card from ~0.9 s: tooth badge + NEXT top right, BODY FILES + FOLLOW top left',
      draw(lt, d, t) {
        const tl = t - T_LAST;                                  // scene clock: the last frame draws exactly like frame 0 (stride, water, zap)
        K.stPoolside(DECK, tl);
        jogger(tl, { flare: blip(lt, sti, 0.4), ring: lt > sti ? pop(lt, sti, 0.25) * out(lt, sti + 0.6) : 0, eyes: lt > sti && lt < sti + 0.45 ? 'squeeze' : 'n' });
        const back = pop(lt, sti + 0.4, 0.3);
        hookTag(back); hookPills(back);
        const k = (1 + 0.13 * (1 - eo(clamp(lt / 0.32)))) * (1 + Z * eio(clamp(lt / d)));
        ctx.save(); ctx.translate(HOOK_CAM[0], HOOK_CAM[1]); ctx.scale(1 / k, 1 / k); ctx.translate(-HOOK_CAM[0], -HOOK_CAM[1]);
        K.stToothBadge(900, 175, 0.5, pop(lt, 0.9, 0.3), t);
        K.pill('NEXT', 900, 300, 36, C.yellow, C.ink, pop(lt, 0.95, 0.3));
        badge(210, 150, pop(lt, 0.9, 0.3), 34);
        K.followPill(210, 245, pop(lt, 1.1), t, 38);
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + 0.9, 'pop', { gain: 0.4 }); cue(st + 1.1, 'pop', { gain: 0.5 }); cue(st + sti, 'zip', { gain: 0.45 }); cue(st + sti + 0.4, 'pop', { gain: 0.35 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES, loop: true };
}
