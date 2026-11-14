// WHAT HAPPENS WHEN YOU GET A CHARLEY HORSE?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Tone: calm, curious explainer. The calf cutaway lens (K.calfLens: pink calf muscle, red knot icon when it cramps) carries
// the story; the hero lives in K.home() (night version for the bed scene). Red only marks the cramp (knot, pain zaps, red
// arrows), blue only water/tears. No injury, no gore. Tease (crying): an eye + tear-duct-to-nose lens, NEXT pill; hero watches.
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
  // helper arm for close-ups: blue sleeve up to the wrist, skin hand with a darker rim so it reads against skin
  const helpArm = (fx, fy, hx, hy, s) => {
    const an = Math.atan2(hy - fy, hx - fx), wx = hx - Math.cos(an) * 70 * s, wy = hy - Math.sin(an) * 70 * s;
    line([[fx, fy], [hx, hy]], C.skinShade, 62 * s); line([[fx, fy], [hx, hy]], C.skin, 52 * s); line([[fx, fy], [wx, wy]], C.shirtShade, 80 * s); line([[fx, fy], [wx - Math.cos(an) * 6, wy - Math.sin(an) * 6]], C.shirt, 70 * s);
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(an); ctx.beginPath(); ctx.ellipse(0, 0, 50 * s, 38 * s, 0, 0, TAU); ctx.fillStyle = C.skinShade; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 0, 44 * s, 32 * s, 0, 0, TAU); ctx.fillStyle = C.skin; ctx.fill(); ctx.restore();
  };
  const alpha = (a, fn) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); fn(); ctx.restore(); };

  // side lens used in the room shots: right of the hero, below the window
  const SL = [800, 965, 175];
  const muscleAt = (x, y, r, c) => K.calfLens(x, y, r, { clench: c, sc: 0 }).muscle;

  // ── 1 · HOOK: hero (hand on chin, curious) + calf lens; the muscle clenches on "charley", "?" on "horse" ──
  {
    const ch = Wd('charley', 0), ho = Wd('horse', 0);
    add({ id: 'S01', at: 0, cam: [560, 860], zoom: 0.08, note: 'room: hero raises a hand to his chin, looking at the calf lens that pops in at right by 0.3 s; on "charley" the calf muscle bunches up, foot points down, a red knot cinches on it; on "horse" a yellow "?" and the hero goes wide-eyed "o"',
      draw(lt, d, t) {
        K.home();
        const wow = lt > ho, up = eio(seg(lt, 0, 0.45));
        K.man({ x: 330, y: 1060, s: 1, arm: K.armPose(K.ARM.down, K.ARM.chin, up), look: 1, eyes: wow ? 'wide' : 'n', mouth: wow ? 'o' : 'smile', brow: wow ? 1 : lerp(0.2, 0.7, up) });
        const c = lt > ch ? eio(seg(lt, ch, ch + 0.3)) : 0;
        K.calfLens(SL[0], SL[1], SL[2], { sc: pop(lt, 0.03, 0.3), clench: c, t });
        const [kx, ky] = muscleAt(SL[0], SL[1], SL[2], c);
        K.knotIcon(kx, ky, 0.3, c, pop(lt, ch + 0.1, 0.25));
        bigText('?', 540, 470, 130, C.yellow, 0.12, pop(lt, ho, 0.25));
        K.shockLines(330, 690, 150, wow ? clamp((lt - ho) * 5) : 0);
      } });
    cue(0.03, 'whoosh', { gain: 0.5 }); cue(0.1, 'pop', { gain: 0.5 }); cue(ch, 'slam', { gain: 0.5 }); cue(ch + 0.1, 'pop', { gain: 0.4 }); cue(ho, 'boing', { gain: 0.5 });
  }

  // ── 2a · Your calf clenches tight by itself ──
  {
    const st = cut(1), ca = Wd('calf', 1) - st, cl = Wd('clenches', 1) - st, ti = Wd('tight', 1) - st, it = Wd('itself', 1) - st;
    const X = 540, Y = 700, R = 360;
    add({ id: 'S02', at: st, cam: [470, 640], zoom: 0.1, note: 'big calf cutaway lens: yellow ring + CALF MUSCLE pill on "calf"; the muscle bunches up on "clenches" (foot points down); red knot pops on "tight" and cinches harder on "itself" (the muscle twitches on its own)',
      draw(lt, d, t) {
        plain();
        const c = lt > cl ? eio(seg(lt, cl, cl + 0.35)) : 0;
        K.calfLens(X, Y, R, { clench: c, ring: lt > ca ? eo(seg(lt, ca, ca + 0.2)) * out(lt, ti, 0.25) : 0, t });
        const [kx, ky] = muscleAt(X, Y, R, c);
        K.knotIcon(kx, ky, 0.55, lt > it ? lerp(0.5, 1, eo(seg(lt, it, it + 0.3))) : 0.5, pop(lt, ti, 0.25));
        K.pill('CALF MUSCLE', 540, 235, 56, C.ink, C.white, pop(lt, ca));
      } });
    cue(st, 'whoosh'); cue(st + ca, 'pop', { gain: 0.6 }); cue(st + cl, 'slide', { dur: 0.35, gain: 0.4 }); cue(st + ti, 'slam', { gain: 0.5 }); cue(st + it, 'thud', { gain: 0.4 });
  }

  // ── 2b · sometimes for ten minutes ──
  {
    const st = at('sometimes', 1), tn = Wd('ten', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 680], zoom: 0.08, note: 'stopwatch ticks; on "ten" its hand whizzes round and a 10 MIN pill pops under it; a small red knot pulses at top right (still cramped)',
      draw(lt, d, t) {
        plain();
        const ang = lt * 1.6 + (lt > tn ? eio(seg(lt, tn, tn + 0.7)) * TAU : 0);
        K.stopwatch(540, 660, 0.9, ang);
        K.knotIcon(860, 330, 0.42, 0.7 + 0.3 * Math.sin(t * 9), pop(lt, 0.05, 0.3));
        K.pill('10 MIN', 540, 1040, 72, C.ink, C.white, pop(lt, tn, 0.3));
      } });
    cue(st, 'whoosh'); cue(st + 0.15, 'tock', { gain: 0.5 }); cue(st + tn, 'slide', { dur: 0.7, gain: 0.4 }); cue(st + tn + 0.05, 'pop', { gain: 0.6 });
  }

  // ── 3 · The muscle squeezes on its own and just can't relax ──
  {
    const st = cut(2), mu = Wd('muscle', 2) - st, sq = Wd('squeezes', 2) - st, rl = Wd('relax', 2) - st;
    const X = 540, Y = 690, Wd2 = 800;
    add({ id: 'S04', at: st, cam: [540, 690], zoom: 0.07, note: 'muscle close-up between two bone anchors: CALF MUSCLE pill on "muscle"; on "squeezes" the bundle shortens and fattens, stripes bunch, red arrows squeeze in from both sides; on "relax" yellow out-arrows try to stretch it (it wobbles) and a red X slams on them',
      draw(lt, d, t) {
        plain();
        const tryR = lt > rl ? Math.sin(Math.PI * seg(lt, rl, rl + 0.45)) * 0.25 : 0;
        const q = lt > sq ? eio(seg(lt, sq, sq + 0.45)) - tryR : 0;
        K.fiberBundle(X, Y, Wd2, q, t);
        K.pill('CALF MUSCLE', 540, 300, 56, C.ink, C.white, pop(lt, mu));
        const ia = lt > sq ? eo(seg(lt, sq, sq + 0.25)) : 0, sl = Math.sin(lt * 10) * 8;
        K.flowArrow(270 + sl, 425, 170, 0, ia, C.red, 24, C.ink); K.flowArrow(810 - sl, 425, 170, Math.PI, ia, C.red, 24, C.ink);
        const oa = lt > rl ? eo(seg(lt, rl, rl + 0.2)) : 0, ow = Math.sin(lt * 14) * 6;
        K.flowArrow(400 - ow, 975, 160, Math.PI, oa, C.yellow, 24, C.ink); K.flowArrow(680 + ow, 975, 160, 0, oa, C.yellow, 24, C.ink);
        if (lt > rl + 0.3) K.redX(540, 975, lerp(0.75, 0.42, eo(seg(lt, rl + 0.3, rl + 0.5))), 1);
      } });
    cue(st, 'whoosh'); cue(st + mu, 'pop', { gain: 0.5 }); cue(st + sq, 'slide', { dur: 0.45, gain: 0.5 }); cue(st + rl, 'boing', { gain: 0.4 }); cue(st + rl + 0.3, 'slam', { gain: 0.6 });
  }

  // ── 4 · and the sudden pain can make it hard to move ──
  {
    const st = cut(3), su = Wd('sudden', 3) - st, pn = Wd('pain', 3) - st, mv = Wd('move', 3) - st, hd = Wd('hard', 3) - st;
    add({ id: 'S05', at: st, cam: [520, 860], zoom: 0.07, note: 'room: hero with the cramped calf lens at right (knot on); red pain zaps burst on the muscle on "sudden"; hero winces (eyes squeezed, frown) on "pain"; on "hard" he tries to step, wobbles with arms out, can\'t; worried flat mouth',
      draw(lt, d, t) {
        K.home();
        const wince = lt > pn && lt < hd, tryM = lt > hd ? Math.sin(Math.PI * seg(lt, hd, mv + 0.3)) : 0;
        const wob = Math.sin(lt * 18) * 10 * tryM;
        K.man({ x: 330 + wob, y: 1060, s: 1, arm: K.armPose(K.ARM.down, K.ARM.side, tryM * 0.8), armL: K.armPose(K.ARM.down, K.ARM.side, tryM * 0.8),
          look: wince ? 0 : 1, eyes: wince ? 'squeeze' : lt > su ? 'wide' : 'n', mouth: lt > su ? (wince ? 'flat' : 'o') : 'flat', frown: lt > pn, brow: lt > su && !wince ? 0.9 : 0.4 });
        K.calfLens(SL[0], SL[1], SL[2], { clench: 1, t });
        const [kx, ky] = muscleAt(SL[0], SL[1], SL[2], 1);
        K.knotIcon(kx, ky, 0.3, 1, 1);
        K.painZap(kx, ky, 0.9, pop(lt, su, 0.2), t);
        K.shockLines(330 + wob, 690, 150, lt > pn ? eo(seg(lt, pn, pn + 0.2)) : 0);
      } });
    cue(st, 'whoosh'); cue(st + su, 'slam', { gain: 0.5 }); cue(st + su + 0.05, 'alarm', { dur: 0.6, gain: 0.3 }); cue(st + hd, 'boing', { gain: 0.4 });
  }

  // ── 5 · Tired muscles and dehydration can trigger it ──
  {
    const st = cut(4), ti = Wd('tired', 4) - st, de = Wd('dehydration', 4) - st, tr = Wd('trigger', 4) - st;
    const LX = 540, LY = 930, LR = 200;
    add({ id: 'S06', at: st, cam: [540, 700], zoom: 0.07, note: 'battery drains to red + TIRED MUSCLES pill on "tired" (left); glass of water empties + DEHYDRATION pill on "dehydration" (right); calf lens below (relaxed); on "trigger" red arrows from both into the lens, the muscle clenches and the knot pops',
      draw(lt, d, t) {
        plain();
        K.battery(290, 520, 0.8, lerp(0.75, 0.15, eio(seg(lt, ti, ti + 0.6))));
        K.pill('TIRED MUSCLES', 290, 300, 44, C.ink, C.white, pop(lt, ti));
        K.glass(790, 520, 1.1, lerp(0.65, 0.04, eio(seg(lt, de, de + 0.6))), t);
        K.pill('DEHYDRATION', 790, 300, 44, C.ink, C.white, pop(lt, de));
        const c = lt > tr ? eio(seg(lt, tr + 0.1, tr + 0.4)) : 0;
        K.calfLens(LX, LY, LR, { clench: c, sc: pop(lt, 0.05), t });
        const [kx, ky] = muscleAt(LX, LY, LR, c);
        K.knotIcon(kx, ky, 0.32, c, pop(lt, tr + 0.2, 0.25));
        const aa = lt > tr ? eo(seg(lt, tr, tr + 0.2)) : 0;
        K.flowArrow(340, 680, 130, 0.95, aa, C.red, 22, C.ink); K.flowArrow(740, 680, 130, Math.PI - 0.95, aa, C.red, 22, C.ink);
      } });
    cue(st, 'whoosh'); cue(st + ti, 'pop', { gain: 0.5 }); cue(st + ti + 0.1, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + de, 'pop', { gain: 0.5 }); cue(st + tr, 'zip', { gain: 0.5 }); cue(st + tr + 0.2, 'slam', { gain: 0.5 });
  }

  // ── 6 · Weirdly, most people get them at night, or while resting ──
  {
    const st = cut(5), wd = Wd('weirdly', 5) - st, gt = Wd('get', 5) - st, rs = Wd('resting', 5) - st;
    const BX = 540, BY = 1010, BS = 1.05;
    const CALF = [BX + 230 * BS, BY - 70 * BS];
    add({ id: 'S07', at: st, cam: [540, 860], zoom: 0.07, note: 'night room (moon in the window): hero asleep in bed, Z z z; yellow "?" on "Weirdly"; on "get" his eyes pop open ("o") and red pain zaps flash over his calf under the blanket; on "resting" the zaps calm down and he blinks, still awake',
      draw(lt, d, t) {
        K.nightHome();
        const awake = lt > gt;
        const sleeper = awake ? { eyes: 'wide', mouth: 'o', brow: 1 } : { eyes: 'closed', mouth: 'smile', brow: 0.2 };
        K.bed(BX, BY, BS, { sleeper, breathe: awake ? 0 : 0.5 + 0.5 * Math.sin(t * 3) });
        K.zzz(BX - 140, BY - 230, t, out(lt, gt, 0.2));
        bigText('?', 210, 480, 130, C.yellow, -0.12, pop(lt, wd, 0.25) * out(lt, gt, 0.25));
        K.painZap(CALF[0], CALF[1], 0.75 * (lt > rs ? lerp(1, 0.7, eo(seg(lt, rs, rs + 0.3))) : 1), pop(lt, gt + 0.05, 0.2), t);
      } });
    cue(st, 'whoosh'); cue(st + wd, 'boing', { gain: 0.4 }); cue(st + gt, 'slam', { gain: 0.5 }); cue(st + gt + 0.05, 'alarm', { dur: 0.6, gain: 0.3 });
  }

  // ── 7 · To fight back, stretch and massage the calf ──
  {
    const st = cut(6), sr = Wd('stretch', 6) - st, ms = Wd('massage', 6) - st, ca = Wd('calf', 6) - st;
    const X = 560, Y = 740, Sc = 1;
    add({ id: 'S08', at: st, cam: [540, 640], zoom: 0.07, note: 'close-up of the lower leg (cramped: foot pointed, knot on the calf); a hand reaches in from the right and on "stretch" pulls the toes up (yellow arrow), the cramp lets go; on "massage" two hands come in from the left and rub the calf, the knot fades; green check on "calf"',
      draw(lt, d, t) {
        plain();
        const fl = eio(seg(lt, sr, sr + 0.45)), c = 1 - fl;
        const leg = K.legClose(X, Y, Sc, { flex: fl, clench: c, t });
        // massage hands from the left edge (start and stay rooted off-screen)
        const mi = eio(seg(lt, ms - 0.3, ms + 0.05)), rub = Math.sin(lt * 13) * 26 * mi;
        const [cx, cy] = leg.calf;
        K.knotIcon(cx - 10, cy + 10, 0.42, c, pop(lt, 0.05, 0.25) * out(lt, ms, 0.3));
        if (mi > 0) {
          helpArm(-760, 200, lerp(-200, cx + 10, mi), cy - 70 + rub, 1.35);
          helpArm(-760, 1060, lerp(-200, cx + 30, mi), cy + 110 - rub, 1.35);
        }
        // stretch hand from the right edge: reaches the toes before "stretch", then pulls with them
        const hi = eio(seg(lt, 0.2, sr - 0.05)), [tx, ty] = leg.toes;
        helpArm(1500, 560, lerp(1420, tx + 24, hi), lerp(860, ty - 6, hi), 1.35);
        K.flowArrow(905, 790, 150, -Math.PI / 2 - 0.5, lt > sr ? eo(seg(lt, sr, sr + 0.2)) * out(lt, ms + 0.2, 0.25) : 0, C.yellow, 22, C.ink);
        K.checkMark(860, 330, 1.25, pop(lt, ca));
      } });
    cue(st, 'whoosh'); cue(st + 0.25, 'slide', { dur: sr - 0.3, gain: 0.3 }); cue(st + sr, 'zip', { gain: 0.5 }); cue(st + ms - 0.2, 'slide', { dur: 0.8, gain: 0.35 }); cue(st + ca, 'sparkle', { dur: 0.5, gain: 0.5 }); cue(st + ca + 0.02, 'pop', { gain: 0.5 });
  }

  // ── 8 · or stand up and put your weight on that leg ──
  {
    const st = cut(7), sd = Wd('stand', 7) - st, wg = Wd('weight', 7) - st, lg = Wd('leg', 7) - st;
    // the room scene drawn at 0.8 so the standing hero's feet (world floor y 1560) land at screen y 1170, 80 px above the caption
    const SC = 0.8, OX = 100, OY = 1170 - 1560 * SC, SOFA = [400, 1360], HX = 360;
    const SX = (wx) => OX + wx * SC, SY = (wy) => OY + wy * SC;
    add({ id: 'S09', at: st, cam: [540, 800], zoom: 0.07, note: 'room + sofa (scene at 0.8, feet above the caption): hero sits; on "stand" he hops up in front of the sofa (burst at his feet); on "weight" he leans and tilts onto his screen-right leg and a yellow down-arrow runs down that leg to the foot; green check on "leg", hero smiles',
      draw(lt, d, t) {
        const up = lt > sd + 0.05, hop = up ? Math.sin(Math.PI * seg(lt, sd + 0.05, sd + 0.35)) * 40 : 0;
        const lean = lt > wg ? eio(seg(lt, wg - 0.05, wg + 0.25)) : 0;
        plain(); ctx.fillStyle = C.floor; ctx.fillRect(-300, SY(1560), W + 600, H);
        ctx.save(); ctx.translate(OX, OY); ctx.scale(SC, SC); K.home(); K.sofa(SOFA[0], SOFA[1], 1);
        if (!up) K.man({ x: HX, y: 1120 - eio(seg(lt, 0, sd + 0.05)) * 25, s: 1, sit: true, arm: K.ARM.knee, armL: K.ARM.knee, look: 0, mouth: 'flat', brow: 0.6 });
        else {
          const fx = HX + 67 + lean * 50;                          // the screen-right foot: the pivot of the lean
          ctx.save(); ctx.translate(fx, 1560); ctx.rotate(0.07 * lean); ctx.translate(-fx, -1560);
          K.man({ x: HX + lean * 50, y: 940 - hop, s: 1, arm: K.ARM.hip, armL: K.ARM.down, look: lean > 0.5 ? 1 : 0, mouth: lt > lg ? 'grin' : 'smile', brow: 0.6 });
          ctx.restore();
        }
        ctx.restore();
        if (up) K.burst(SX(HX), SY(1560) - 30, 1.1, 1 - seg(lt, sd + 0.2, sd + 0.55));
        const ax = SX(HX + 67 + lean * 50) + 6, ab = SY(1560) - 10, aTop = 950 + Math.sin(lt * 9) * 6 * lean;
        K.flowArrow(ax, (aTop + ab) / 2, ab - aTop, Math.PI / 2, lean, C.yellow, 24, C.ink);
        K.checkMark(900, 740, 1.2, pop(lt, lg));
      } });
    cue(st, 'whoosh'); cue(st + sd, 'boing', { gain: 0.5 }); cue(st + wg, 'thud', { gain: 0.6 }); cue(st + lg, 'pop', { gain: 0.6 });
  }

  // ── 9 · The calf might stay sore for a day or two ──
  {
    const st = cut(8), ca = Wd('calf', 8) - st, so = Wd('sore', 8) - st, dy = Wd('day', 8) - st, tw = Wd('two', 8) - st;
    add({ id: 'S10', at: st, cam: [540, 820], zoom: 0.06, note: 'room: hero looks at the calf lens at right (muscle relaxed); yellow ring on the muscle on "calf"; a small red ache zap on it on "sore", hero mildly frowns; a small calendar "1-2 DAYS" drops in top-left on "day"; on "two" hero smiles, zap fades',
      draw(lt, d, t) {
        K.home();
        K.man({ x: 300, y: 1060, s: 1, arm: K.ARM.down, look: 1, mouth: lt > tw ? 'smile' : 'flat', frown: lt > so && lt < tw, brow: lt > so && lt < tw ? 0.3 : 0.5 });
        K.calfLens(SL[0], SL[1], SL[2], { clench: 0, ring: lt > ca ? eo(seg(lt, ca, ca + 0.2)) * out(lt, so, 0.2) : 0, t });
        const [kx, ky] = muscleAt(SL[0], SL[1], SL[2], 0);
        K.painZap(kx, ky, 0.55, pop(lt, so, 0.2) * out(lt, tw + 0.1, 0.3), t, [-2.5, -1.57, -0.64]);
        if (lt > dy) { const p = eob(seg(lt, dy, dy + 0.35)); K.calendar(300, lerp(-300, 330, clamp(p)), 0.36, '1-2', 'DAYS', lerp(-0.25, -0.06, clamp(p))); }
      } });
    cue(st, 'whoosh'); cue(st + ca, 'pop', { gain: 0.4 }); cue(st + so, 'pop', { gain: 0.4 }); cue(st + dy, 'slide', { dur: 0.3, gain: 0.3 }); cue(st + dy + 0.3, 'thud', { gain: 0.5 }); cue(st + tw, 'tock', { gain: 0.5 });
  }

  // ── 10 · Frequent cramps, swelling or numbness? See a doctor. ──
  {
    const st = cut(9), fr = Wd('frequent', 9) - st, sw = Wd('swelling', 9) - st, nu = Wd('numbness', 9) - st, se = Wd('see', 9) - st, dr = Wd('doctor', 9) - st;
    const BXc = 270;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.06, note: 'room: hero (right) looks left at three badges popping in a column: repeat-arrow knot on "frequent", puffy leg on "swelling", pale dashed leg on "numbness"; on "see" they shrink away and the see-a-doctor badge pops on "doctor"; hero presents it with an open hand, calm smile',
      draw(lt, d, t) {
        K.home();
        const pr = eio(seg(lt, se - 0.05, se + 0.3));
        K.man({ x: 830, y: 1100, s: 0.95, armL: K.armPose(K.ARM.down, K.ARM.side, pr), look: -1, mouth: lt > se ? 'smile' : 'flat', brow: lt > se ? 0.5 : 0.75 });
        const go = out(lt, se, 0.25);
        K.crampBadge('often', BXc, 320, 0.85, pop(lt, fr) * go, t);
        K.crampBadge('swell', BXc, 610, 0.85, pop(lt, sw) * go, t);
        K.crampBadge('numb', BXc, 900, 0.85, pop(lt, nu) * go, t);
        K.doctorBadge(280, 610, 1.05, pop(lt, dr));
      } });
    cue(st, 'whoosh'); cue(st + fr, 'pop', { gain: 0.5 }); cue(st + sw, 'pop', { gain: 0.5 }); cue(st + nu, 'pop', { gain: 0.5 }); cue(st + se, 'zip', { gain: 0.4 }); cue(st + dr, 'pop', { gain: 0.7 });
  }

  // ── 11-12 · TEASE + END CARD (room): hero stands right and only watches; eye/tear-duct lens left, NEXT, BODY FILES ──
  const HERO = { x: 800, y: 1150, s: 0.8 }, TL = [320, 790, 210], NEXTP = [320, 1100];
  const hero = (o) => K.man({ ...HERO, ...o });
  {
    const st = cut(10), nx = Wd('next', 10) - st, wh = Wd('what', 10) - st, cr = Wd('cry', 10) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.05, note: 'room: BODY FILES badge (series name only) pops on "Next" while the hero (right) waves; he lowers the wave and on "what" an eye close-up lens (eye, nose, the pink tear duct) + yellow NEXT pill pop at left; hero turns to look at it; on "cry" a pale-blue tear wells up on the lower lid',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 150, 60, pop(lt, nx));
        const wv = eio(seg(lt, 0.05, 0.4)) * out(lt, wh - 0.45, 0.35);
        hero({ armL: K.armPose(K.ARM.down, K.ARM.wave, wv), look: lt > wh ? -1 : 0, mouth: 'smile', brow: lt > cr ? 0.8 : 0.5 });
        K.tearLens(TL[0], TL[1], TL[2], { sc: pop(lt, wh), tear: lt > cr ? 0.5 * eo(seg(lt, cr, cr + 0.4)) : 0, t });
        K.pill('NEXT', NEXTP[0], NEXTP[1], 60, C.yellow, C.ink, pop(lt, wh + 0.1));
      } });
    cue(st, 'whoosh'); cue(st + nx, 'thud', { gain: 0.6 }); cue(st + wh, 'pop', { gain: 0.6 }); cue(st + wh + 0.1, 'pop', { gain: 0.5 }); cue(st + cr, 'plop', { gain: 0.4 });
  }
  {
    const st = at('extra', 11), ex = Wd('extra', 11) - st, te = Wd('tears', 11) - st, no = Wd('nose', 11) - st;
    add({ id: 'S13', at: st, cam: [420, 800], zoom: 0.07, note: 'END CARD (room): BODY FILES badge; tears keep welling and rolling down the cheek from "extra"; on "tears" pale-blue drops run down the tear duct into the nose; yellow ring on the nose on "nose"; NEXT stays; hero watches, then turns to camera with a warm grin and + FOLLOW pops',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 150, 60, 1);
        const camL = lt > no + 0.35;
        hero({ look: camL ? 0 : -1, mouth: camL ? 'grin' : 'smile', brow: camL ? 0.5 : 0.8 });
        const tear = lt > ex ? 0.3 + 0.7 * (((lt - ex) * 0.85 + 0.3) % 1) : 0.5;
        K.tearLens(TL[0], TL[1], TL[2], { tear, flow: lt > te ? (lt - te) * 1.1 : -1, nose: lt > no ? eo(seg(lt, no, no + 0.2)) : 0, t });
        K.pill('NEXT', NEXTP[0], NEXTP[1], 60, C.yellow, C.ink, 1);
        K.followPill(TL[0], 470, pop(lt, no + 0.35), t, 54);
      } });
    cue(st, 'whoosh'); cue(st + te, 'bubbles', { dur: 1.0, gain: 0.3 }); cue(st + no, 'pop', { gain: 0.6 }); cue(st + no + 0.35, 'pop', { gain: 0.7 });
  }

  // tidy ids (S01..): sorted by time
  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES };
}
