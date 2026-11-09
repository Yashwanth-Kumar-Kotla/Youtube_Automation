// WHAT HAPPENS IF YOU CRACK YOUR KNUCKLES EVERY DAY?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Tone: a calm diagram. The joint is a clean sideways cutaway on x-ray film (two bone ends, pink capsule, pale fluid,
// tiny gas dots → one gas cavity → pop). The doctor (lab coat, grey hair, glasses) is not the hero. Sneeze tease: a
// cartoon face in a badge with its eyes squeezed SHUT + "?" + NEXT pill; nothing leaves any socket, the hero only looks.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, bigText, line } from './core/lib.js';
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
  const CLOSE = { x: 540, y: 1150, s: 1.5 };                   // close-up of the hero (hands at his chest)
  const LACE = { e: [215, -20], h: [40, -95] };                // both hands meet at the chest, fingers laced
  const JX = 540, JY = 700, JS = 0.9;                          // the joint cutaway, full size
  const SX = 540, SY = 470, SS = 0.6;                          // the joint cutaway, small (top half)

  // ── 1 · HOOK: hero laces his fingers, CRACK! on "crack", a day calendar starts flipping on "every day" ────────
  {
    const st = 0, cr = Wd('crack', 0) - st, ev = Wd('every', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 820], zoom: 0.1, note: 'room close-up: hero raises + laces his hands from frame 0; CRACK! + burst at the hands on "crack" (eyes shut, satisfied grin); DAY calendar pops on "every" and flips',
      draw(lt) {
        K.home();
        const up = eio(seg(lt, 0, 0.45)), jolt = lt > cr ? Math.max(0, 1 - (lt - cr) * 4) : 0;
        const a = K.armPose(K.ARM.down, LACE, up), arm = { e: a.e, h: [a.h[0], a.h[1] - 22 * jolt] };
        const sat = lt > cr && lt < cr + 0.4;
        K.man({ ...CLOSE, arm, armL: arm, eyes: sat ? 'closed' : 'n', mouth: sat ? 'grin' : lt > cr ? 'smile' : 'smirk', smirk: lt < cr, brow: 0.5 });
        K.burst(540, CLOSE.y + (LACE.h[1] - 10) * CLOSE.s, 1.4, lt > cr ? 1 - seg(lt, cr + 0.3, cr + 0.7) : 0);
        bigText('CRACK!', 830, 740, 84, C.yellow, -0.12, pop(lt, cr, 0.2));
        const cp = pop(lt, ev - 0.05);
        if (cp > 0) K.calendar(200, 420, 0.36 * cp, String(1 + Math.min(29, Math.floor(Math.max(0, lt - ev) * 9))), 'DAY', -0.06);
      } });
    cue(st + 0.15, 'whoosh', { gain: 0.5 }); cue(st + cr, 'pop', { gain: 0.9 }); cue(st + cr + 0.03, 'slam', { gain: 0.4 });
    cue(st + ev, 'thud', { gain: 0.5 }); for (let k = 1; k < 6; k++) cue(st + ev + k * 0.11, 'tock', { gain: 0.25 });
  }

  // ── 2 · everyone warns you about arthritis ───────────────────────────────────────────────────────────
  {
    const st = cut(1), ev = Wd('everyone', 1) - st, wa = Wd('warns', 1) - st, ar = Wd('arthritis', 1) - st;
    const PPL = [[680, 1010, C.pink], [810, 990, C.leaf], [940, 1010, C.pot]];
    add({ id: 'S02', at: st, cam: [600, 800], zoom: 0.08, note: 'room: three people icons pop in on "everyone"; a speech bubble with a warning sign on "warns"; red ARTHRITIS pill on "arthritis"; hero, hands on hips, frowns',
      draw(lt) {
        K.home();
        hero({ arm: K.ARM.hip, armL: K.ARM.hip, look: 1, frown: lt > wa, brow: lt > ar ? 0.8 : 0.3, mouth: lt > ar ? 'flat' : 'smirk' });
        PPL.forEach(([x, y, c], i) => K.personIcon(x, y, 1.0, c, pop(lt, Math.max(0.02, ev - 0.06) + i * 0.08, 0.25)));
        const bp = pop(lt, wa);
        if (bp > 0) { K.bubble(810, 650, 380, 230, 810, 860, bp); K.warning(810, 655, 0.55 * bp); }
        K.pill('ARTHRITIS', 810, 420, 54, C.red, C.white, pop(lt, ar));
      } });
    cue(st, 'whoosh'); for (let i = 0; i < 3; i++) cue(st + Math.max(0.02, ev - 0.06) + i * 0.08, 'pop', { gain: 0.35 });
    cue(st + wa, 'pop', { gain: 0.6 }); cue(st + ar, 'thud', { gain: 0.7 });
  }

  // ── 3 · but what's actually making that pop? (x-ray hand) ──────────────────────────────────────────
  const KI = K.knuckleAt(1), KNX = 540 + KI[0] * 1.2, KNY = 800 + (KI[1] + 20) * 1.2;
  {
    const st = cut(2), wh = Wd("what's", 2) - st, po = Wd('pop', 2) - st;
    add({ id: 'S03', at: st, cam: [KNX, KNY], zoom: 0.15, note: 'x-ray hand, push toward the index knuckle; big ? on "what\'s"; knuckle rings yellow + burst on "pop"',
      draw(lt, d, t) {
        K.xray(t);
        K.handBones(540, 800, 1.2, { glow: lt > po ? eo(seg(lt, po, po + 0.15)) * (0.7 + 0.3 * Math.sin(lt * 10)) : 0.15 + 0.1 * Math.sin(lt * 4) });
        bigText('?', 870, 400, 170, C.yellow, 0.1, pop(lt, wh, 0.25) * (lt > po ? 1 + 0.12 * Math.max(0, 1 - (lt - po) * 4) : 1));
        K.burst(KNX, KNY, 1.3, lt > po ? 1 - seg(lt, po + 0.25, po + 0.6) : 0);
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + wh, 'boing', { gain: 0.45 }); cue(st + po, 'pop', { gain: 0.8 });
  }

  // ── 4 · knuckles sit in slippery joint fluid: the cutaway ─────────────────────────────────────────────
  {
    const st = cut(3), kn = Wd('knuckles', 3) - st, sl = Wd('slippery', 3) - st, fl = Wd('fluid', 3) - st;
    add({ id: 'S04', at: st, cam: [JX, JY], zoom: 0.08, note: 'x-ray film: sideways joint cutaway (bone head | cup, pink capsule, pale fluid); KNUCKLE tag on "knuckles"; glints slide + bones jiggle on "slippery"; JOINT FLUID tag on "fluid"',
      draw(lt, d, t) {
        K.xray(t);
        const jig = lt > sl ? Math.sin((lt - sl) * 14) * 6 * Math.max(0, 1 - (lt - sl) * 1.2) : 0;
        ctx.save(); ctx.translate(jig, 0);
        K.jointCutaway(JX, JY, JS, { shine: lt > sl ? eo(seg(lt, sl, sl + 0.3)) : 0, t });
        ctx.restore();
        K.tag('KNUCKLE', JX, 330, JX, JY - 230 * JS - 6, 56, pop(lt, kn));
        K.tag('JOINT FLUID', JX, 1110, JX + 60 * JS, JY + 160 * JS, 56, pop(lt, fl));
      } });
    cue(st, 'whoosh'); cue(st + kn, 'pop', { gain: 0.5 }); cue(st + sl, 'slide', { dur: 0.5, gain: 0.4 }); cue(st + fl, 'plop', { gain: 0.6 });
  }

  // ── 5 · and that fluid holds gas ─────────────────────────────────────────────────────────────────
  {
    const st = cut(4), fl = Wd('fluid', 4) - st, ga = Wd('gas', 4) - st;
    add({ id: 'S05', at: st, cam: [JX, JY - 60], zoom: 0.1, note: 'same cutaway; fluid glints on "fluid"; tiny gas dots fade in + GAS tag on "gas"',
      draw(lt, d, t) {
        K.xray(t);
        K.jointCutaway(JX, JY, JS, { shine: lt > fl ? 1 : 0, gas: lt > ga ? eo(seg(lt, ga, ga + 0.35)) : 0, t });
        K.tag('JOINT FLUID', JX, 1110, JX + 60 * JS, JY + 160 * JS, 56, 1);
        K.tag('GAS', JX, 330, JX + 60 * JS, JY - 168 * JS, 60, pop(lt, ga));
      } });
    cue(st, 'whoosh'); cue(st + ga, 'bubbles', { dur: 0.6, gain: 0.5 }); cue(st + ga, 'pop', { gain: 0.5 });
  }

  // ── 6 · pull the joint apart, the space widens (gas gathers into one bubble) ───────────────────────────
  {
    const st = cut(5), pu = Wd('pull', 5) - st, ap = Wd('apart', 5) - st, sp = Wd('space', 5) - st, wi = Wd('widens', 5) - st;
    add({ id: 'S06', at: st, cam: [JX, JY], zoom: 0.06, note: 'yellow pull arrows on "pull"; bones slide apart from "apart" to "widens"; gas dots drift into the gap and form one bubble; SPACE tag on "space"',
      draw(lt, d, t) {
        K.xray(t);
        const gap = eio(seg(lt, ap - 0.1, wi + 0.35));
        K.jointCutaway(JX, JY, JS, { gap, gas: 1, gather: seg(lt, ap, wi + 0.3), bubble: seg(lt, ap + 0.25, wi + 0.4), t });
        const aa = lt > pu ? eo(seg(lt, pu, pu + 0.2)) : 0, push = Math.sin(lt * 9) * 8 + gap * 30;
        K.flowArrow(JX - 250 - push, 400, 220, Math.PI, aa, C.yellow, 30, C.ink);
        K.flowArrow(JX + 250 + push, 400, 220, 0, aa, C.yellow, 30, C.ink);
        K.tag('SPACE', JX, 1110, JX, JY + 30, 60, pop(lt, sp));
      } });
    cue(st, 'whoosh'); cue(st + pu, 'zip', { gain: 0.5 }); cue(st + ap, 'slide', { dur: wi - ap + 0.3, gain: 0.5 }); cue(st + sp, 'pop', { gain: 0.5 });
  }

  // ── 7 · the gas goes POP, like uncorking a bottle ────────────────────────────────────────────────────
  {
    const st = cut(6), ga = Wd('gas', 6) - st, po = Wd('pop', 6) - st, li = Wd('like', 6) - st, un = Wd('uncorking', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 640], zoom: 0.06, note: 'bubble wobbles on "gas", bursts with POP! on "pop"; on "like" the cutaway shrinks to the top half and a corked bottle pops in below; cork flies on "uncorking" and fades out in flight (gone by +0.58 s, never stops, stays below the capsule)',
      draw(lt, d, t) {
        K.xray(t);
        const mv = eio(seg(lt, li - 0.3, li + 0.05));
        const wob = lt > ga && lt < po ? Math.sin(lt * 30) * 0.08 : 0;
        K.jointCutaway(lerp(JX, SX, mv), lerp(JY, SY, mv), lerp(JS, SS, mv), { gap: 1, bubble: lt < po ? 1 + wob : 1, pop: lt > po ? seg(lt, po, po + 0.3) : 0, t });
        K.burst(JX, JY, 1.6, lt > po ? 1 - seg(lt, po + 0.25, po + 0.6) : 0);
        bigText('POP!', JX, 330, 110, C.yellow, -0.1, pop(lt, po, 0.2) * (1 - seg(lt, li - 0.4, li - 0.2)));
        const bp = pop(lt, li - 0.05, 0.3), cp = lt > un ? seg(lt, un, un + 0.6) : 0, ca = 1 - seg(lt, un + 0.42, un + 0.58);   // cork keeps moving until it has faded out
        if (bp > 0) { ctx.save(); ctx.translate(430, 1010); ctx.scale(bp, bp); K.bottle(0, 0, 0.62, cp, ca); ctx.restore(); }
        K.burst(430, 1010 - 330 * 0.62, 1.0, lt > un ? 1 - seg(lt, un + 0.2, un + 0.6) : 0);
      } });
    cue(st, 'whoosh'); cue(st + ga, 'bubbles', { dur: po - ga, gain: 0.4 }); cue(st + po, 'pop', { gain: 1.0 }); cue(st + po + 0.02, 'slam', { gain: 0.35 });
    cue(st + li - 0.05, 'thud', { gain: 0.5 }); cue(st + un, 'pop', { gain: 0.8 }); cue(st + un + 0.05, 'zip', { gain: 0.4 });
  }

  // ── 8 · that gas needs time to build back up (stopwatch + refilling GAS battery) ──────────────────────
  {
    const st = cut(7), ti = Wd('time', 7) - st, bu = Wd('build', 7) - st, up = Wd('up', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.06, note: 'small cutaway (no bubble) on top; empty GAS battery pops at the start; stopwatch pops + spins on "time"; battery fills and gas dots return from "build" to "up"',
      draw(lt, d, t) {
        K.xray(t);
        const fill = lt > bu ? eio(seg(lt, bu, up + 0.25)) : 0;
        K.jointCutaway(SX, SY, SS, { gap: lerp(1, 0.3, eio(seg(lt, 0, 0.5))), gas: fill, t });
        const sp = pop(lt, ti - 0.05);
        if (sp > 0) K.stopwatch(330, 1010, 0.33 * sp, lt > ti ? (lt - ti) * 7 : 0);
        const ba = pop(lt, 0.12);
        if (ba > 0) { ctx.save(); ctx.translate(750, 1010); ctx.scale(ba, ba); K.battery(0, 0, 0.7, fill); ctx.restore(); }
        K.pill('GAS', 750, 880, 44, C.cyan, C.navy, ba);
      } });
    cue(st, 'whoosh'); cue(st + 0.12, 'pop', { gain: 0.4 }); cue(st + ti, 'tock', { gain: 0.6 }); cue(st + ti + 0.35, 'tock', { gain: 0.5 });
    cue(st + bu, 'sparkle', { dur: up - bu + 0.3, gain: 0.5 });
  }

  // ── 9 · so you can't crack it again right away ──────────────────────────────────────────────────────
  {
    const st = cut(8), ca = Wd("can't", 8) - st, cr = Wd('crack', 8) - st, ri = Wd('right', 8) - st;
    add({ id: 'S09', at: st, cam: [600, 800], zoom: 0.06, note: 'room close-up: hero\'s hands laced; low red GAS battery + NOT YET pill on "can\'t"; on "crack" his hands strain, no pop; shrug-smirk on "right away"',
      draw(lt) {
        K.home();
        const strain = lt > cr && lt < cr + 0.5 ? Math.sin(lt * 50) * 5 : 0;
        const arm = { e: LACE.e, h: [LACE.h[0], LACE.h[1] + strain] };
        K.man({ ...CLOSE, arm, armL: arm, frown: lt > cr && lt < ri, brow: lt > ri ? 0.6 : 0.3, mouth: lt > ri ? 'smirk' : lt > cr ? 'flat' : 'smile', smirk: lt > ri, look: lt > ca && lt < ri ? 1 : 0 });
        const bp = pop(lt, ca);
        if (bp > 0) { ctx.save(); ctx.translate(880, 360); ctx.scale(bp, bp); K.battery(0, 0, 0.45, 0.2 + 0.05 * Math.sin(lt * 8)); ctx.restore(); }
        K.pill('NOT YET', 880, 470, 40, C.ink, C.white, pop(lt, ca + 0.15));
      } });
    cue(st, 'whoosh'); cue(st + ca, 'pop', { gain: 0.5 }); cue(st + cr, 'boing', { gain: 0.35 });
  }

  // ── 10 · so, arthritis? one doctor tested it on himself ────────────────────────────────────────────
  {
    const st = cut(9), ar = Wd('arthritis', 9) - st, dc = Wd('doctor', 9) - st, te = Wd('tested', 9) - st, hi = Wd('himself', 9) - st;
    const HOLD = { e: [170, 10], h: [100, -110] };
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.08, note: 'room: ARTHRITIS? pill on "arthritis", hero shrugs; the doctor (lab coat, grey hair, glasses) slides in from the right on "doctor" holding a clipboard; clipboard lines write on "tested"; brows up + nod on "himself"',
      draw(lt) {
        K.home();
        K.pill('ARTHRITIS?', 540, 300, 60, C.red, C.white, pop(lt, ar));
        K.man({ x: 280, y: 1000, s: 1.05, arm: K.ARM.down, armL: K.ARM.down, look: lt > dc ? 1 : 0, brow: lt > ar ? 0.9 : 0.4, mouth: lt > dc + 0.2 ? 'smile' : 'flat' });
        if (lt > dc - 0.3) {
          const dx = lerp(1350, 790, eo(seg(lt, dc - 0.3, dc + 0.15))), nod = lt > hi ? Math.sin(seg(lt, hi, hi + 0.4) * Math.PI) * 10 : 0;
          K.doctor({ x: dx, y: 1000 + nod, s: 1.05, arm: HOLD, armL: K.ARM.down,
            look: -1, mouth: 'smile', brow: lt > hi ? 0.7 : 0.4, holding: (x, y) => K.clipboard(x + 10, y, 0.26, lt > te ? seg(lt, te, te + 0.5) : 0, 0.1) });
        }
      } });
    cue(st, 'whoosh'); cue(st + ar, 'thud', { gain: 0.6 }); cue(st + dc - 0.3, 'slide', { dur: 0.45, gain: 0.5 }); cue(st + te, 'pop', { gain: 0.4 }); cue(st + hi, 'boing', { gain: 0.4 });
  }

  // the doctor's two hands, seen from his own eyes (backs of the hands, white coat sleeves): LEFT on screen left
  const LH = [290, 820], RH = [790, 820], HS = 0.62;
  const hands = () => {
    ctx.save(); ctx.translate(LH[0], LH[1]); ctx.scale(-1, 1); K.handSkin(0, 0, HS, { sleeve: C.white }); ctx.restore();
    K.handSkin(RH[0], RH[1], HS, { sleeve: C.white });
  };
  const leftKn = (i) => { const [kx, ky] = K.knuckleAt(i); return [LH[0] - kx * HS, LH[1] + (ky + 10) * HS]; };
  const pops = (lt, a) => { if (lt <= a) return; for (let i = 0; i < 4; i++) { const [x, y] = leftKn(i), k = lt - a - i * 0.05; if (k > 0) K.burst(x, y, 0.75, 1 - seg(k, 0.2, 0.45)); } };

  // ── 11 · for fifty years he cracked his left hand ────────────────────────────────────────────────────
  {
    const st = cut(10), fi = Wd('fifty', 10) - st, cr = Wd('cracked', 10) - st, le = Wd('left', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.06, note: 'his two hands (white coat sleeves); YEARS calendar counts up to 50 from "fifty"; yellow pops on the LEFT hand\'s knuckles on "cracked"; LEFT pill on "left"',
      draw(lt) {
        plain(); hands();
        const cp = pop(lt, fi - 0.05);
        if (cp > 0) K.calendar(540, 360, 0.32 * cp, String(Math.max(1, Math.min(50, Math.round(lerp(1, 50, eo(seg(lt, fi, fi + 0.6))))))), 'YEARS');
        pops(lt, cr);
        K.pill('LEFT', LH[0], 470, 50, C.ink, C.white, pop(lt, le));
      } });
    cue(st, 'whoosh'); cue(st + fi, 'thud', { gain: 0.5 }); cue(st + fi + 0.1, 'sparkle', { dur: 0.5, gain: 0.3 });
    for (let i = 0; i < 4; i++) cue(st + cr + i * 0.05, 'pop', { gain: 0.45 }); cue(st + le, 'pop', { gain: 0.4 });
  }

  // ── 12 · at least twice a day, and never his right ─────────────────────────────────────────────────
  {
    const st = cut(11), tw = Wd('twice', 11) - st, da = Wd('day', 11) - st, ne = Wd('never', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 700], zoom: 0.06, note: 'same hands, LEFT pill stays; 2x A DAY pill + left knuckles pop on "twice" and again on "day"; NEVER pill over the right hand on "never" (right hand stays still)',
      draw(lt) {
        plain(); hands();
        K.pill('LEFT', LH[0], 470, 50, C.ink, C.white, 1);
        K.pill('2× A DAY', 540, 330, 52, C.yellow, C.ink, pop(lt, tw));
        pops(lt, tw); if (lt > da) pops(lt, da);
        K.pill('NEVER', RH[0], 470, 50, C.ink, C.white, pop(lt, ne));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'pop', { gain: 0.6 }); cue(st + da, 'pop', { gain: 0.6 }); cue(st + ne, 'thud', { gain: 0.5 });
  }

  // ── 13a · result: no arthritis in either hand (two x-ray hands on a lightbox, green checks) ─────────────
  {
    const st = cut(12), no = Wd('no', 12) - st, ei = Wd('either', 12) - st, ha = Wd('hand', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 640], zoom: 0.06, note: 'lightbox drops in: left + right x-ray hands (L / R); NO ARTHRITIS green pill on "no"; green check under the left hand on "either", under the right on "hand"',
      draw(lt, d, t) {
        plain();
        const dp = eob(seg(lt, 0, 0.3));
        ctx.save(); ctx.translate(0, (1 - dp) * -900);
        K.lightbox(120, 220, 840, 800, t, () => {
          ctx.save(); ctx.translate(330, 640); ctx.scale(-1, 1); K.handBones(0, 0, 0.55); ctx.restore();
          K.handBones(750, 640, 0.55);
          K.pill('L', 330, 312, 40, C.cyan, C.navy, 1); K.pill('R', 750, 312, 40, C.cyan, C.navy, 1);
        });
        ctx.restore();
        K.checkMark(330, 900, 1, pop(lt, ei));
        K.checkMark(750, 900, 1, pop(lt, ha));
        K.pill('NO ARTHRITIS', 540, 1120, 56, C.leaf, C.white, pop(lt, no));
      } });
    cue(st, 'whoosh'); cue(st + 0.25, 'thud', { gain: 0.5 }); cue(st + no, 'sparkle', { dur: 0.5, gain: 0.5 }); cue(st + ei, 'pop', { gain: 0.6 }); cue(st + ha, 'pop', { gain: 0.6 });
  }
  // ── 13b · and bigger studies agree ───────────────────────────────────────────────────────────────
  {
    const st = Wd('and', 12) - 0.2, bi = Wd('bigger', 12) - st, su = Wd('studies', 12) - st, ag = Wd('agree', 12) - st;
    add({ id: 'S13b', at: st, cam: [540, 700], zoom: 0.08, note: 'a crowd of people icons pops in along the bottom from the start; three study clipboards deal in from "bigger" to "studies"; big green check stamps on "agree"',
      draw(lt) {
        plain();
        for (let i = 0; i < 7; i++) K.personIcon(180 + i * 120, 1090, 0.42, [C.shirt, C.pink, C.leaf, C.pot][i % 4], pop(lt, 0.03 + i * 0.05, 0.2));
        K.studyStack(540, 620, 0.72, lt > bi ? seg(lt, bi, su + 0.15) : 0);
        K.checkMark(730, 800, 1.3, pop(lt, ag, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + bi, 'slide', { dur: su - bi + 0.15, gain: 0.4 }); cue(st + su, 'thud', { gain: 0.5 }); cue(st + ag, 'slam', { gain: 0.6 });
  }

  // ── 14 · if it hurts or swells, see a doctor ─────────────────────────────────────────────────────────
  {
    const st = cut(13), hu = Wd('hurts', 13) - st, sw = Wd('swells', 13) - st, se = Wd('see', 13) - st, dc = Wd('doctor', 13) - st;
    add({ id: 'S14', at: st, cam: [560, 720], zoom: 0.06, note: 'calm: a hand; soft ache swirls on "hurts"; it puffs a little on "swells"; yellow arrow on "see"; doctor badge pops on "doctor"',
      draw(lt, d, t) {
        plain();
        K.handSkin(320, 760, 0.75, { puff: lt > sw ? 0.3 * eio(seg(lt, sw, sw + 0.35)) : 0 });
        K.ache(320, 560, t, lt > hu ? 0.8 * eo(seg(lt, hu, hu + 0.25)) : 0);
        K.flowArrow(580, 720, 130, 0, lt > se ? eo(seg(lt, se, se + 0.2)) : 0, C.yellow, 26, C.ink);
        K.doctorBadge(820, 720, 0.9, pop(lt, dc));
      } });
    cue(st, 'whoosh'); cue(st + hu, 'pop', { gain: 0.3 }); cue(st + sw, 'boing', { gain: 0.35 }); cue(st + se, 'zip', { gain: 0.4 }); cue(st + dc, 'pop', { gain: 0.6 });
  }

  // ── 15a · NEXT body file: badge on "next", the hero waves, looks right on "what" ──────────────────────
  {
    const st = cut(14), nx = Wd('next', 14) - st, wh = Wd('what', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.05, note: 'room, BODY FILES badge (name only) on "next"; hero waves, then looks right with a curious smile on "what"',
      draw(lt) {
        K.home();
        K.filesBadge('BODY FILES', 540, 130, 44, pop(lt, nx));
        const wv = eio(seg(lt, 0.05, 0.4)) * (1 - eio(seg(lt, wh - 0.3, wh)));
        hero({ arm: K.armPose(K.ARM.down, K.ARM.wave, wv), look: lt > wh ? 1 : 0, brow: lt > wh ? 0.7 : 0.4, mouth: 'smile' });
      } });
    cue(st, 'whoosh'); cue(st + nx, 'thud', { gain: 0.6 });
  }
  // ── 15b · ...if you sneeze with your eyes open: sneeze badge (eyes shut) + NEXT on "sneeze", ? on "open" ──
  const SB = [760, 620];
  {
    const st = at('sneeze', 14), sn = Wd('sneeze', 14) - st, op = Wd('open', 14) - st;
    add({ id: 'S15b', at: st, cam: [620, 700], zoom: 0.05, note: 'sneeze badge (cartoon face, eyes squeezed shut) + NEXT pill pop on "sneeze"; "ah-" then "-choo" puffs; yellow ? on "open"; hero only looks, curious smile',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 130, 44, 1);
        hero({ look: 1, brow: 0.8, mouth: 'smile' });
        K.sneezeBadge(SB[0], SB[1], 1, lt > sn + 0.45 ? eo(seg(lt, sn + 0.45, sn + 0.75)) : 0, t, pop(lt, sn - 0.02));
        K.pill('NEXT', SB[0], 330, 52, C.yellow, C.ink, pop(lt, sn));
        bigText('?', 950, 400, 110, C.yellow, 0.12, pop(lt, op, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + sn, 'pop', { gain: 0.6 }); cue(st + sn + 0.45, 'zip', { gain: 0.4 }); cue(st + op, 'boing', { gain: 0.5 });
  }

  // ── 16 · ...could your eyeballs really pop out? END CARD: ? bounces on "pop", FOLLOW after it ───────────
  {
    const st = cut(15), eb = Wd('eyeballs', 15) - st, po = Wd('pop', 15) - st;
    add({ id: 'S16', at: st, cam: [600, 700], zoom: 0.05, note: 'end card: badge, sneeze badge (eyes shut) + NEXT stay; hero raises brows on "eyeballs"; ? bounces bigger on "pop"; FOLLOW pill after "pop"; hero looks to camera with a curious smile',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 130, 44, 1);
        const huh = lt > eb && lt < eb + 0.3;
        hero({ look: lt > po + 0.3 ? 0 : 1, brow: huh ? 1 : 0.7, mouth: huh ? 'o' : 'smile' });
        K.sneezeBadge(SB[0], SB[1], 1, 1, t, 1);
        K.pill('NEXT', SB[0], 330, 52, C.yellow, C.ink, 1);
        const qb = lt > po ? 1 + 0.35 * Math.sin(seg(lt, po, po + 0.4) * Math.PI) : 1 + 0.04 * Math.sin(lt * 5);
        bigText('?', 950, 400, 110, C.yellow, 0.12, qb);
        K.followPill(330, 270, pop(lt, po + 0.35), t);
      } });
    cue(st, 'whoosh'); cue(st + eb, 'pop', { gain: 0.4 }); cue(st + po, 'boing', { gain: 0.7 }); cue(st + po + 0.35, 'pop', { gain: 0.5 });
  }

  return { shots: S, cues: CUES };
}
