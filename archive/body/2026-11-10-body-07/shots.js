// WHAT HAPPENS IF YOU KNOCK OUT A TOOTH?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Tone: calm first-aid explainer, curious and reassuring. NOTHING bloody: the "knock out" is only a cartoon tooth popping
// out of a gum diagram with a comic POP! star; the hero is never hit. The tooth (K.toothX) is the star: gum diagram
// (K.gumBed), cutaway with the root's fine fibers, pinching fingers (K.pinchHand), milk glass (K.milkDunk), small cup,
// dentist badge. Tease: ear-to-throat cutaway lens (K.earCut) with a glowing tube + airplane + NEXT; the hero only watches.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, bigText, line, TAU } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i) - 0.08;                       // a mid-line cut just before word w
  const plain = () => { ctx.fillStyle = C.bg; ctx.fillRect(-300, -300, W + 600, H + 600); };
  const pop = (lt, a, d = 0.3) => (lt > a ? eob(seg(lt, a, a + d)) : 0);
  const out = (lt, a, d = 0.25) => 1 - eio(seg(lt, a, a + d));
  const alpha = (a, fn) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); fn(); ctx.restore(); };
  const pointer = (x0, y0, x1, y1, a = 1) => alpha(a, () => { line([[x0, y0], [x1, y1]], C.ink, 10); ctx.beginPath(); ctx.arc(x1, y1, 12, 0, TAU); ctx.fillStyle = C.ink; ctx.fill(); });

  // ── 1 · HOOK: hero beside a gum-diagram lens; on "knock out" the tooth POPs out (comic star), hero shocked ──
  {
    const kn = Wd('knock', 0), th = Wd('tooth', 0), LX = 800, LY = 960, LR = 190, BS = 0.5;
    const END = [520, 720];
    add({ id: 'S01', at: 0, cam: [600, 860], zoom: 0.08, note: 'room: hero (curious) beside a round lens showing a gum diagram with a smiling tooth that wiggles (pops in by 0.3 s); on "knock" the tooth POPs up out of its socket with a yellow POP! star and arcs to the left of the lens, face "wow"; hero wide-eyed "o" on "knock", shock lines; no face injury, no blood',
      draw(lt, d, t) {
        K.home();
        const wow = lt > kn;
        const hp = Wd('happens', 0), lean = lt > hp ? eo(seg(lt, hp, hp + 0.3)) : 0;
        K.man({ x: 270 + 14 * lean, y: 1000 - 6 * lean, s: 1, look: 1, eyes: wow ? 'wide' : 'n', mouth: wow ? 'o' : 'smile', brow: wow ? 1 : lerp(0.4, 0.9, lean) });
        K.shockLines(270, 640, 150, wow ? clamp((lt - kn) * 5) * out(lt, kn + 0.6, 0.25) : 0);
        const lp = pop(lt, 0.02, 0.3), fly = seg(lt, kn, kn + 0.45);
        K.lens(LX, LY, LR, lp, () => K.gumBed(0, 10, BS, { inner: () => { if (lt <= kn) K.toothX(0, 0, 1, { face: 'smile', rot: Math.sin(lt * 14) * 0.06 * seg(lt, 0.3, 0.6) }); } }));
        if (lt > kn) {
          const e = eo(fly), x = lerp(LX, END[0], e), y = lerp(LY + 10, END[1], e) - Math.sin(Math.PI * e) * 160;
          K.toothX(x, y, lerp(BS * lp, 0.62, e), { face: 'wow', rot: lerp(0, -TAU - 0.25, e), t: lt > kn + 0.45 ? t : 0, bob: 5 });
          K.popStar(LX, LY - 50, 0.5, pop(lt, kn, 0.2) * out(lt, kn + 0.55, 0.25), t);
        }
      } });
    cue(0.02, 'whoosh', { gain: 0.5 }); cue(0.08, 'pop', { gain: 0.5 }); cue(kn, 'pop', { gain: 0.9 }); cue(kn + 0.05, 'zip', { gain: 0.5 }); cue(th, 'boing', { gain: 0.4 });
  }

  // ── 2 · Put it back within five minutes, it'll likely survive ──
  {
    const st = cut(1), bk = Wd('back', 1) - st, fv = Wd('five', 1) - st, sv = Wd('survive', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 780], zoom: 0.07, note: 'gum diagram: the tooth slides back into its socket on "back"; a 5 MIN countdown pops above on "five" and its red wedge starts emptying; green check + tooth winks on "survive"',
      draw(lt, d, t) {
        plain();
        const lift = 260 * (1 - eio(seg(lt, bk - 0.2, bk + 0.3)));
        K.gumBed(540, 990, 0.6, { inner: () => K.toothX(0, -lift, 1, { face: lt > sv ? 'wink' : 'smile' }) });
        if (lt < bk + 0.3) K.flowArrow(540, 990 - 0.6 * (lift + 230), 120, Math.PI / 2, out(lt, bk + 0.1, 0.2), C.yellow, 20, C.ink);
        K.countdown(540, 560, 0.75, 1 - 0.3 * seg(lt, fv + 0.2, d), '5', pop(lt, fv), 'MIN');
        K.checkMark(870, 840, 1.2, pop(lt, sv));
      } });
    cue(st, 'whoosh'); cue(st + bk - 0.2, 'slide', { dur: 0.5, gain: 0.5 }); cue(st + bk + 0.3, 'thud', { gain: 0.5 }); cue(st + fv, 'pop'); cue(st + fv + 0.3, 'tock', { gain: 0.5 }); cue(st + sv, 'sparkle', { dur: 0.5, gain: 0.6 });
  }

  // ── 3 · And the backup plan is sitting in your fridge ──
  {
    const st = cut(2), bu = Wd('backup', 2) - st, fr = Wd('fridge', 2) - st;
    add({ id: 'S03', at: st, cam: [560, 720], zoom: 0.08, note: 'the cartoon tooth (left) looks at a fridge (right); BACKUP PLAN pill on "backup"; the fridge door swings open on "fridge": a milk carton inside, sparkles',
      draw(lt, d, t) {
        plain();
        K.toothX(190, 780, 0.75, { face: 'smile', t, bob: 6, sc: pop(lt, 0.02, 0.3) });
        const op = eio(seg(lt, fr, fr + 0.35));
        K.fridge(700, 720, 0.95, op, () => {
          K.milkCarton(-20, 150 - 168 * 0.85, 0.85);
          rr2(-150, 250, 90, 110, C.yellow); rr2(80, 270, 80, 90, C.pinkLight);
        });
        K.pill('BACKUP PLAN', 540, 240, 60, C.shirt, C.white, pop(lt, bu));
        if (lt > fr + 0.3) [[560, 520], [860, 560], [600, 860]].forEach(([x, y], i) => K.sparkle4(x, y, 34, pop(lt, fr + 0.3 + i * 0.07, 0.25) * (0.85 + 0.15 * Math.sin(t * 8 + i)), t + i));
      } });
    cue(st, 'whoosh'); cue(st + bu, 'pop'); cue(st + fr, 'slide', { dur: 0.35, gain: 0.5 }); cue(st + fr + 0.3, 'sparkle', { dur: 0.5, gain: 0.5 });
  }
  function rr2(x, y, w, h, col) { ctx.beginPath(); ctx.roundRect(x, y - h, w, h, 18); ctx.fillStyle = col; ctx.fill(); ctx.beginPath(); ctx.roundRect(x + 6, y - h - 20, w - 12, 26, 8); ctx.fillStyle = '#C9C2B5'; ctx.fill(); }

  // ── 4 · Its root has tiny fibers it needs to heal ──
  {
    const st = cut(3), ro = Wd('root', 3) - st, tf = Wd('tiny', 3) - st, fi = Wd('fibers', 3) - st, he = Wd('heal', 3) - st;
    const X = 540, Y = 640, SC = 2.2;
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.08, note: 'big tooth cutaway (white crown, cream root, pink pulp); yellow ring round the root + ROOT tag on "root"; fine pink fiber strands grow out of the root from "tiny" + FIBERS tag on "fibers"; fibers glow yellow + sparkles on "heal"',
      draw(lt, d, t) {
        plain();
        const fb = eio(seg(lt, tf, fi + 0.25)), gl = lt > he ? eo(seg(lt, he, he + 0.3)) : 0;
        K.toothX(X, Y, SC, { cut: 1, fibers: fb, glow: gl, t, hiRoot: lt > ro ? eo(seg(lt, ro, ro + 0.2)) * out(lt, tf, 0.3) : 0 });
        K.tag('ROOT', 880, 1110, X + 70 * SC, Y + 125 * SC, 60, pop(lt, ro));
        K.tag('FIBERS', 210, 1110, X - 112 * SC, Y + 70 * SC, 60, pop(lt, fi));
        if (gl > 0) [[X - 165 * SC, Y + 10 * SC], [X + 160 * SC, Y + 30 * SC], [X, Y + 205 * SC]].forEach(([x, y], i) => K.sparkle4(x, y, 34, pop(lt, he + i * 0.07, 0.25) * (0.85 + 0.15 * Math.sin(t * 8 + i)), t + i));
      } });
    cue(st, 'whoosh'); cue(st + ro, 'pop'); cue(st + tf, 'sparkle', { dur: fi - tf + 0.3, gain: 0.4 }); cue(st + fi, 'pop'); cue(st + he, 'sparkle', { dur: 0.6, gain: 0.6 });
  }

  // ── 5a · so grab it by the crown ──
  {
    const st = cut(4), gr = Wd('grab', 4) - st, cr = Wd('crown', 4) - st, TS = 1.3, TY = 840;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.06, note: 'cartoon fingers come down from the top and pinch the tooth by its crown on "grab", lift it a little; green check on "crown"',
      draw(lt, d, t) {
        plain();
        const lift = 70 * eio(seg(lt, gr + 0.15, gr + 0.6)), ty = TY - lift;
        K.toothX(540, ty, TS, { face: 'smile' });
        const hy = lerp(-560, ty - 75 * TS, eo(seg(lt, 0, gr + 0.02)));
        K.pinchHand(540, hy, 1, { gap: 220 * TS + 6 });
        K.checkMark(850, 620, 1.4, pop(lt, cr));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 0.25, gain: 0.4 }); cue(st + gr, 'pop', { gain: 0.5 }); cue(st + cr, 'sparkle', { dur: 0.4, gain: 0.6 });
  }
  // ── 5b · not the root, no scrubbing ──
  {
    const st = at('not', 4), ro = Wd('root', 4) - st, no = T.words.find((w) => w.line === 4 && /^no\W*$/i.test(w.w)).s - st, sc = Wd('scrubbing', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.05, note: 'two panels: left, fingers pinch an upside-down tooth by its roots, red X on "root"; right, a scrub brush pops in on "no" and scrubs the root, red X on "scrubbing"',
      draw(lt, d, t) {
        plain();
        const TS = 0.95;
        K.toothX(290, 790, TS, { rot: Math.PI });
        K.pinchHand(290, lerp(-520, 790 - 110 * TS, eo(seg(lt, 0, 0.3))), 0.8, { gap: 190 * TS / 0.8 });
        K.redX(290, 720, 0.6, pop(lt, ro, 0.2), 0.55);
        K.toothX(780, 760, TS, {});
        const bp = pop(lt, no, 0.25), sy = 760 + 95 * TS + Math.sin(lt * 26) * 28 * clamp((lt - no - 0.15) * 4);
        if (bp > 0) K.scrubBrush(780 + 80 * TS + 68, sy, 0.95 * bp, Math.PI / 2);
        K.redX(800, 760, 0.6, pop(lt, sc, 0.2), 0.55);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 0.25, gain: 0.4 }); cue(st + ro, 'slam', { gain: 0.7 }); cue(st + no, 'pop', { gain: 0.5 }); cue(st + no + 0.15, 'bubbles', { dur: 0.5, gain: 0.3 }); cue(st + sc, 'slam', { gain: 0.8 });
  }

  // ── 6 · Adult tooth? Gently push it back in place ──
  const BED = [540, 880];
  {
    const st = cut(5), ad = Wd('adult', 5) - st, ge = Wd('gently', 5) - st, pu = Wd('push', 5) - st, pl = Wd('place', 5) - st;
    add({ id: 'S07', at: st, cam: [540, 720], zoom: 0.07, note: 'gum diagram with an empty socket, the tooth hovering above; blue ADULT TOOTH stamp on "adult"; fingers come down and hold the crown on "gently", slowly push it into the socket from "push" to "place"; green check on "place", the hand lifts away off the top',
      draw(lt, d, t) {
        plain();
        const lift = 300 * (1 - eio(seg(lt, pu, pl + 0.05)));
        K.gumBed(BED[0], BED[1], 1, { inner: () => K.toothX(0, -lift, 1, {}) });
        const grip = BED[1] - lift - 80, hy = lt < pl + 0.15 ? lerp(-560, grip, eo(seg(lt, ge - 0.1, ge + 0.3))) : lerp(grip, -620, eio(seg(lt, pl + 0.15, pl + 0.55)));
        K.pinchHand(BED[0], hy, 1, { gap: lt < pl + 0.15 ? 226 : lerp(226, 300, seg(lt, pl + 0.15, pl + 0.3)) });
        K.stamp('ADULT\nTOOTH', 200, 360, 58, -0.12, pop(lt, ad, 0.25), C.shirt);
        K.checkMark(860, 600, 1.3, pop(lt, pl));
      } });
    cue(st, 'whoosh'); cue(st + ad, 'thud', { gain: 0.5 }); cue(st + ge - 0.1, 'slide', { dur: 0.4, gain: 0.4 }); cue(st + pu, 'slide', { dur: pl - pu, gain: 0.5 }); cue(st + pl, 'sparkle', { dur: 0.4, gain: 0.6 }); cue(st + pl + 0.2, 'zip', { gain: 0.4 });
  }

  // ── 7a · Won't fit? ──
  {
    const st = cut(6), fi = Wd('fit', 6) - st;
    add({ id: 'S08', at: st, cam: [540, 720], zoom: 0.06, note: 'same gum diagram: the tooth drops toward the socket, bonks on the rim on "fit" and bounces up tilted; yellow "?"',
      draw(lt, d, t) {
        plain();
        const fall = eio(seg(lt, 0, fi)), bo = lt > fi ? Math.sin(seg(lt, fi, fi + 0.4) * Math.PI) : 0;
        const lift = lerp(300, 70, fall) + 60 * bo, rot = lt > fi ? 0.18 * eo(seg(lt, fi, fi + 0.3)) : 0;
        K.gumBed(BED[0], BED[1], 1, { inner: () => K.toothX(0, -lift, 1, { rot }) });
        if (lt > fi) K.burst(BED[0], BED[1] - 40, 1.2, 1 - seg(lt, fi + 0.15, fi + 0.5));
        bigText('?', 830, 560, 200, C.yellow, 0.15, pop(lt, fi + 0.05, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + fi, 'boing', { gain: 0.7 });
  }
  // ── 7b · Skip the water, it can harm the root cells ──
  {
    const st = at('water', 6), wa = 0.25, it = Wd('it', 6) - st, ha = Wd('harm', 6) - st, ce = Wd('cells', 6) - st;
    const TX = 300, TY = 820, LX = 780, LY = 690, LR = 200;
    add({ id: 'S09', at: st, cam: [540, 720], zoom: 0.06, note: 'tap pours water toward the tooth; red X slams over tap + stream on "water", the stream fades; a lens on the root pops on "it" with round root cells; on "harm" the cells swell with water + red warning; ROOT CELLS tag on "cells"',
      draw(lt, d, t) {
        plain();
        K.toothX(TX, TY, 0.8, {});
        ctx.save(); ctx.globalAlpha = 1 - 0.85 * seg(lt, wa + 0.1, wa + 0.4);
        K.tap(TX, 300, 0.9, eo(seg(lt, 0, 0.15)) * (lt > wa + 0.1 ? 1 - seg(lt, wa + 0.1, wa + 0.4) : 1), t, 400);
        ctx.restore();
        K.redX(TX, 470, 0.55, pop(lt, wa, 0.2), 0.8);
        const lp = pop(lt, it, 0.3), sw = eio(seg(lt, ha, ha + 0.5));
        pointer(LX - 0.8 * (LR + 20), LY + 0.6 * (LR + 20), TX + 70 * 0.8, TY + 100 * 0.8, clamp(lp));
        K.lens(LX, LY, LR, lp, () => {
          [[-90, -40, 58], [55, -70, 50], [10, 80, 56], [-110, 110, 40], [130, 70, 44]].forEach(([x, y, r], i) => K.cell(x, y, r, { swell: sw, t, wob: sw }));
        }, '#EFE6CF');
        if (lt > ha) K.warning(560, 450, 0.36 * pop(lt, ha, 0.25));
        K.pill('ROOT CELLS', LX, 1010, 56, C.ink, C.white, pop(lt, ce));
      } });
    cue(st, 'whoosh'); cue(st + 0.02, 'bubbles', { dur: 0.35, gain: 0.4 }); cue(st + wa, 'slam'); cue(st + it, 'pop', { gain: 0.5 }); cue(st + ha, 'alarm', { dur: 0.8, gain: 0.4 }); cue(st + ce, 'pop');
  }

  // ── 8 · Instead, cover it in milk, which helps protect those fibers ──
  {
    const st = cut(7), co = Wd('cover', 7) - st, mi = Wd('milk', 7) - st, pr = Wd('protect', 7) - st, fi = Wd('fibers', 7) - st;
    const GX = 540, GY = 700, GS = 2.2, IN = 20, TS = 0.48;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.07, note: 'a big glass of milk; the smiling tooth hovers above, drops in from "cover" and PLOPS into the milk on "milk" (white splash drops); a MILK carton pops beside the glass on "milk"; green shield pops on "protect"; the fibers on its root glow yellow + FIBERS tag on "fibers"',
      draw(lt, d, t) {
        plain();
        const f = seg(lt, co, mi), inMilk = lt > mi;
        const glow = lt > fi ? eo(seg(lt, fi, fi + 0.3)) : 0;
        K.milkDunk(GX, GY, GS, 0.8, t, inMilk ? () => K.toothX(0, IN + 8 * Math.sin(seg(lt, mi, mi + 0.6) * Math.PI) * (1 - seg(lt, mi, mi + 0.6)), TS, { face: 'smile', fibers: 1, glow, t }) : null, 0.4);
        if (!inMilk) {
          const y = lerp(260, GY + (IN - 40) * GS, f * f);
          K.toothX(GX, y, TS * GS, { face: f > 0 ? 'wow' : 'smile', fibers: 1, t: lt < co ? t : 0, bob: lt < co ? 6 : 0 });
        }
        if (inMilk) for (let i = 0; i < 6; i++) {
          const k = seg(lt, mi, mi + 0.5), an = -Math.PI / 2 + (i - 2.5) * 0.35, r = 40 + 170 * eo(k);
          const x = GX + Math.cos(an) * r, y = GY - 58 * GS + Math.sin(an) * r * 0.9 + 200 * k * k;
          if (k < 1) { ctx.save(); ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.arc(x, y, 16, 0, TAU); ctx.fillStyle = C.gumEdge; ctx.fill(); ctx.beginPath(); ctx.arc(x, y, 12, 0, TAU); ctx.fillStyle = C.white; ctx.fill(); ctx.restore(); }
        }
        if (lt > mi) K.milkCarton(190, 760, 0.75 * pop(lt, mi), Math.sin(t * 2) * 0.03);
        K.shieldBadge(870, 520, 0.6, pop(lt, pr));
        K.tag('FIBERS', 220, 1080, GX - 95 * TS * GS, GY + (IN + 95) * TS * GS, 60, pop(lt, fi));
      } });
    cue(st, 'whoosh'); cue(st + co, 'slide', { dur: mi - co, gain: 0.4 }); cue(st + mi, 'plop'); cue(st + pr, 'pop'); cue(st + fi, 'sparkle', { dur: 0.5, gain: 0.6 });
  }

  // ── 9a · or your own spit ──
  {
    const st = cut(8), or = Wd('or', 8) - st, ow = Wd('own', 8) - st, sp = Wd('spit', 8) - st;
    add({ id: 'S11', at: st, cam: [540, 720], zoom: 0.06, note: 'two options: the milk glass with the tooth (left, green check) and an OR pill on "or"; a small plain cup with the tooth in it pops right on "own", green check on "spit"',
      draw(lt, d, t) {
        plain();
        K.milkDunk(280, 760, 1.6, 0.8, t, () => K.toothX(0, 20, 0.48, { face: 'smile', fibers: 1, t }), 0.4);
        K.checkMark(280, 440, 0.9, pop(lt, or + 0.1));
        K.pill('OR', 540, 720, 64, C.ink, C.white, pop(lt, or));
        K.smallCup(800, 830, 1.55, pop(lt, ow), () => K.toothX(0, -60, 0.5, { face: 'smile', fibers: 1, t }));
        K.checkMark(800, 470, 0.9, pop(lt, sp));
      } });
    cue(st, 'whoosh'); cue(st + or, 'pop', { gain: 0.5 }); cue(st + ow, 'pop'); cue(st + sp, 'sparkle', { dur: 0.4, gain: 0.5 });
  }
  // ── 9b · then see a dentist right away ──
  {
    const st = at('see', 8), de = Wd('dentist', 8) - st, aw = Wd('away', 8) - st;
    add({ id: 'S12', at: st, cam: [540, 820], zoom: 0.06, note: 'room: hero smiles and points his finger straight at the badge; the dentist badge (smiling tooth + red cross) pops right on "dentist"; on "away" the badge bounces with sparkles, hero grins',
      draw(lt, d, t) {
        K.home();
        const pt = eio(seg(lt, 0.05, 0.4)), AIM = { e: [215, -40], h: [250, -140] };
        K.man({ x: 270, y: 1000, s: 1, arm: K.armPose(K.ARM.down, AIM, pt), finger: pt > 0.6 ? Math.PI / 2 : null, look: 1, mouth: lt > aw ? 'grin' : 'smile', brow: 0.4 });
        const bo = lt > aw ? Math.sin(seg(lt, aw, aw + 0.4) * Math.PI) * 0.1 : 0;
        K.dentistBadge(810, 850, 1.0 * (1 + bo), pop(lt, de));
        if (lt > aw) [[960, 700], [985, 930], [680, 1030]].forEach(([x, y], i) => K.sparkle4(x, y, 32, pop(lt, aw + i * 0.07, 0.25) * (0.85 + 0.15 * Math.sin(t * 8 + i)), t + i));
      } });
    cue(st, 'whoosh'); cue(st + de, 'pop', { gain: 0.7 }); cue(st + aw, 'boing', { gain: 0.4 }); cue(st + aw + 0.05, 'sparkle', { dur: 0.4, gain: 0.5 });
  }

  // ── 10-11 · TEASE + END CARD (room): hero stands right and only watches; ear-to-throat lens left, airplane, NEXT ──
  const HERO = { x: 800, y: 1150, s: 0.8 }, EL = [320, 800, 200], PLANE = [270, 450], NEXTP = [320, 1110];
  const hero = (o) => K.man({ ...HERO, ...o });
  {
    const st = cut(9), nx = Wd('next', 9) - st, wh = Wd('what', 9) - st, ea = Wd('ears', 9) - st, po = Wd('pop', 9) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.05, note: 'room: BODY FILES badge (series name only) pops on "Next"; hero (right) waves with his left arm, warm smile; an airplane flies in from the left on "what"; on "ears" the ear-to-throat lens + NEXT pill pop in; on "pop" a small POP! star and the ear gets a yellow ring; hero watches, curious',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 150, 60, pop(lt, nx));
        const wv = eio(seg(lt, 0.05, 0.4)) * (1 - eio(seg(lt, ea - 0.4, ea)));
        hero({ armL: K.armPose(K.ARM.down, K.ARM.wave, wv), look: lt > wh ? -1 : 0, mouth: 'smile', brow: lt > po ? 0.8 : 0.5 });
        const fl = eo(seg(lt, wh, wh + 0.6));
        if (lt > wh) K.airplane(lerp(-300, PLANE[0], fl) , PLANE[1] + Math.sin(t * 3) * 6, 0.6, -0.08 + 0.05 * Math.sin(t * 2));
        K.earCut(EL[0], EL[1], EL[2], { sc: pop(lt, ea), ear: lt > po ? eo(seg(lt, po, po + 0.2)) : 0, t });
        K.pill('NEXT', NEXTP[0], NEXTP[1], 60, C.yellow, C.ink, pop(lt, ea + 0.1));
        K.popStar(500, 560, 0.32, pop(lt, po, 0.2) * out(lt, po + 0.45, 0.2), t);
      } });
    cue(st, 'whoosh'); cue(st + nx, 'thud', { gain: 0.6 }); cue(st + wh, 'zip', { gain: 0.5 }); cue(st + ea, 'pop', { gain: 0.6 }); cue(st + po, 'pop', { gain: 0.8 });
  }
  {
    const st = cut(10), hi = Wd('hidden', 10) - st, tu = Wd('tube', 10) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.05, note: 'tease: lens stays; on "tube" the thin tube from the ear to the throat glows yellow and little air bubbles run along it; airplane + NEXT stay; hero watches, brows up',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 150, 60, 1);
        hero({ look: -1, mouth: 'smile', brow: lt > hi ? 0.9 : 0.6 });
        K.airplane(PLANE[0], PLANE[1] + Math.sin(t * 3) * 6, 0.6, -0.08 + 0.05 * Math.sin(t * 2));
        const tb = lt > tu ? eo(seg(lt, tu, tu + 0.25)) : 0;
        K.earCut(EL[0], EL[1], EL[2], { tube: tb, flow: lt > tu ? (lt - tu) * 1.2 : -1, t });
        K.pill('NEXT', NEXTP[0], NEXTP[1], 60, C.yellow, C.ink, 1);
      } });
    cue(st, 'whoosh'); cue(st + tu, 'sparkle', { dur: 0.6, gain: 0.5 }); cue(st + tu + 0.1, 'bubbles', { dur: 0.6, gain: 0.3 });
  }
  {
    const st = at('ears', 10), ea = Wd('ears', 10) - st, th = Wd('throat', 10) - st;
    add({ id: 'S15', at: st, cam: [540, 760], zoom: 0.04, note: 'END CARD (room): BODY FILES badge; lens: tube keeps glowing, yellow ring on the ear on "ears", on the throat on "throat"; airplane + NEXT; + FOLLOW pill pops after "throat"; hero turns to camera with a warm grin',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 150, 60, 1);
        const cam = lt > th + 0.2;
        hero({ look: cam ? 0 : -1, mouth: cam ? 'grin' : 'smile', brow: 0.5 });
        K.airplane(PLANE[0], PLANE[1] + Math.sin(t * 3) * 6, 0.6, -0.08 + 0.05 * Math.sin(t * 2));
        K.earCut(EL[0], EL[1], EL[2], { tube: 1, flow: t * 1.2, ear: lt > ea ? eo(seg(lt, ea, ea + 0.2)) * out(lt, th, 0.2) : 0, throat: lt > th ? eo(seg(lt, th, th + 0.2)) : 0, t });
        K.pill('NEXT', NEXTP[0], NEXTP[1], 60, C.yellow, C.ink, 1);
        K.followPill(330, 300, pop(lt, th + 0.3), t, 54);
      } });
    cue(st, 'whoosh'); cue(st + ea, 'pop', { gain: 0.5 }); cue(st + th, 'pop', { gain: 0.6 }); cue(st + th + 0.3, 'pop', { gain: 0.7 });
  }

  // tidy ids (S01..): sorted by time
  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES };
}
