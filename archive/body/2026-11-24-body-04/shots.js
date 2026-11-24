// WHAT HAPPENS WHEN YOU HIT YOUR FUNNY BONE?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): x-ray hero, forearm across his chest, elbow smacking a white door casing on the right,
// a yellow flash racing down the pink ulnar nerve to his hand, "2 FINGERS" tag + A THUMB SIDE (thumb edge) / B PINKY SIDE
// (pinky edge) pills. No black fade in or out (loop: true), so frame 1 is the hook.
// Guess (line 1b): same big x-ray hand, A / B pills under it. Re-hook (line 5): new scene, the elbow cross-section.
// Answer (line 7): check on B in the same pill spot, the pinky + exactly half the ring finger light up (rewatch: dashed midline).
// Rewatch label on the cross-section: "ulnar nerve: just under the skin (Cleveland Clinic)".
// Tease (line 9a): doorway + thought "?" + NEXT on "Next"; "Mind your elbow..." snaps back to the frame-1 framing, elbow about
// to hit the casing (+ small doorway badge, BODY FILES badge, + FOLLOW).
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, line, bigText } from './core/lib.js';
import { L, Wd, lineWords } from './core/timing.js';
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
  const blip = (lt, a, d = 0.35) => (lt > a ? Math.sin(Math.PI * seg(lt, a, a + d)) : 0);
  const enter = (lt) => lerp(0.86, 1, eob(seg(lt, 0, 0.25)));
  const zig = (x0, y0, x1, y1, n, amp, col = C.yellow, w = 10, a = 1) => {
    if (a <= 0) return; const P = [];
    for (let i = 0; i <= n; i++) { const u = i / n, px = lerp(x0, x1, u), py = lerp(y0, y1, u), nx = -(y1 - y0), ny = x1 - x0, l = Math.hypot(nx, ny) || 1, o = (i % 2 ? 1 : -1) * amp * (i && i < n ? 1 : 0); P.push([px + nx / l * o, py + ny / l * o]); }
    ctx.save(); ctx.globalAlpha = clamp(a); line(P, C.ink, w + 8); line(P, col, w); ctx.restore();
  };

  // ── the HOOK framing (frame 1 + loop ending) ──
  const HM = { x: 190, y: 1110, s: 1.35 }, HOOK_CAM = [560, 860];
  const hookArm = (dx) => ({ S: [HM.x + 140 * HM.s + dx, HM.y - 170 * HM.s], E: [770 + dx, 1070], Wr: [690 + dx, 710], w: 100, hs: 0.56 });
  const JAMB = 842;
  const hookScene = (t, { dx = 0, hit = 0, sig = -1, face = 1, knobRing = 0, pills = 1, tagA = 1 } = {}) => {
    plain();
    K.fbJamb(JAMB, { shake: Math.sin(t * 90) * 7 * hit });
    const A = hookArm(dx), loc = (p) => [(p[0] - HM.x - dx) / HM.s, (p[1] - HM.y) / HM.s];
    K.man({ x: HM.x + dx, y: HM.y, s: HM.s, xray: true, arm: { e: loc(A.E), h: loc(A.Wr) }, eyes: face ? 'wide' : 'n', mouth: face ? 'o' : 'smile', brow: face ? 1 : 0.2, look: 0.3 });
    const o = K.fbArm({ ...A, nerve: sig, t, knobRing, buzz: sig >= 0 ? 1 : 0 });
    if (hit > 0) { K.burst(o.knob[0] + 50, o.knob[1] + 20, 1.6, hit); K.shockLines(HM.x + dx, HM.y - 338 * HM.s - 70, 170, hit); }
    if (sig >= 0) { zig(o.pinkyTip[0] + 70, o.pinkyTip[1] - 20, o.pinkyTip[0] + 190, o.pinkyTip[1] - 40, 6, 14, C.yellow, 9, 0.9); zig(o.pinkyTip[0] + 80, o.pinkyTip[1] + 60, o.pinkyTip[0] + 200, o.pinkyTip[1] + 70, 6, 14, C.yellow, 9, 0.9); }
    if (pills > 0) {
      K.pill('2 FINGERS', 560, 260, 50, C.yellow, C.ink, tagA * pills);
      K.abPill('A', 'THUMB SIDE', 320, 410, 36, { sc: pills });
      K.abPill('B', 'PINKY SIDE', 850, 650, 32, { sc: pills });
      ctx.save(); ctx.globalAlpha = clamp(pills); line([[390, 450], [o.thumbTip[0] - 20, o.thumbTip[1] - 10]], C.ink, 6); line([[860, 610], [o.pinkyTip[0] + 34, o.pinkyTip[1] + 150]], C.ink, 6); ctx.restore();
    }
    return o;
  };
  const sigLoop = (t, per = 0.9, from = 0.42) => { const u = (t % per) / per; return u < 0.6 ? lerp(from, 1, u / 0.6) : -1; };

  // ── 1 · HOOK "What happens when you hit your funny bone?" ──
  {
    const hi = Wd('hit', 0), fu = Wd('funny', 0);
    add({ id: 'S01', at: 0, cam: HOOK_CAM, zoom: 0.06, note: 'FRAME 1 = hook: x-ray hero, elbow smacking the white door casing (burst + shake from frame 0), yellow flash racing down the pink ulnar nerve to his hand (looping), "2 FINGERS" tag + A THUMB SIDE / B PINKY SIDE pills on the two edges of the hand; second bump on "hit"; yellow ring on the elbow knob on "funny"',
      draw(lt, d, t) {
        const h = Math.max(1 - seg(lt, 0, 0.45), blip(lt, hi, 0.4));
        hookScene(t, { hit: h, sig: sigLoop(lt), knobRing: eo(seg(lt, fu, fu + 0.25)) });
      } });
    cue(0.0, 'thud', { gain: 0.6 }); cue(0.03, 'zip', { gain: 0.35 }); cue(hi, 'thud', { gain: 0.5 }); cue(fu, 'pop', { gain: 0.5 });
  }

  // ── big x-ray hand (S02, S03 guess, S10 answer: same spot) ──
  const HAND = { S: [180, 1900], E: [560, 1560], Wr: [540, 870], w: 150, hs: 0.82 };
  const PA = [285, 1040], PB = [750, 1040], PS = 40;
  const pills = ({ scA = 1, scB = 1, hiA = 0, hiB = 0, check = 0, dim = 0 } = {}) => {
    K.abPill('A', 'THUMB SIDE', PA[0], PA[1], PS, { sc: scA, hi: hiA, dim });
    K.abPill('B', 'PINKY SIDE', PB[0], PB[1], PS, { sc: scB, hi: hiB, check });
  };

  // ── 2a · "One bump, and two fingers buzz." ──
  {
    const st = cut(1), bu = Wd('bump', 1) - st, tw = Wd('two', 1) - st, bz = Wd('buzz', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 650], zoom: 0.08, note: 'x-ray close-up of the hand + forearm (on screen at the cut); on "bump" a yellow flash shoots up the nerve from the elbow into the hand; "2 FINGERS" tag on "two"; on "buzz" the hand jitters with yellow zigzags on BOTH edges + a "?" on each side (the answer stays hidden)',
      draw(lt, d, t) {
        K.xray(t);
        const sg = lt > bu ? lerp(0.25, 1, seg(lt, bu, bu + 0.55)) : -1;
        const o = K.fbArm({ ...HAND, nerve: sg < 1 ? sg : -1, t, buzz: lt > bz ? 1 : 0 });
        const za = eo(seg(lt, bz, bz + 0.2));
        if (za > 0) { zig(o.thumbTip[0] - 30, o.thumbTip[1] - 40, o.thumbTip[0] - 120, o.thumbTip[1] - 160, 6, 16, C.yellow, 10, za); zig(o.pinkyTip[0] + 60, o.pinkyTip[1] + 20, o.pinkyTip[0] + 170, o.pinkyTip[1] - 80, 6, 16, C.yellow, 10, za);
          bigText('?', 150, 600, 130 * pop(lt, bz), C.yellow); bigText('?', 930, 600, 130 * pop(lt, bz + 0.08), C.yellow); }
        K.pill('2 FINGERS', 540, 200, 60, C.yellow, C.ink, pop(lt, tw));
      } });
    cue(st, 'whoosh'); cue(st + bu, 'zip', { gain: 0.5 }); cue(st + tw, 'pop', { gain: 0.6 }); cue(st + bz, 'sparkle', { dur: 0.6, gain: 0.4 });
  }

  // ── 2b · GUESS "Thumb side, or pinky side?" ──
  {
    const st = at('thumb', 1), th = Wd('thumb', 1) - st, pk = Wd('pinky', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.05, note: 'GUESS: same x-ray hand (on screen at the cut); on "Thumb" the thumb half washes yellow + pill A THUMB SIDE pops under it; on "pinky" the wash moves to the pinky half + pill B PINKY SIDE pops',
      draw(lt, d, t) {
        K.xray(t);
        const toP = seg(lt, pk - 0.05, pk + 0.15);
        K.fbArm({ ...HAND, t, halfT: eo(seg(lt, th, th + 0.2)) * (1 - toP), halfP: toP });
        pills({ scA: pop(lt, th), scB: pop(lt, pk), hiA: blip(lt, th, 0.4), hiB: blip(lt, pk, 0.4) });
      } });
    cue(st, 'whoosh'); cue(st + th, 'pop', { gain: 0.6 }); cue(st + pk, 'pop', { gain: 0.6 });
  }

  // ── 3 · "First, it's not a bone at all. It's a nerve." ──
  {
    const st = cut(2), no = Wd('not', 2) - st, bo = Wd('bone', 2) - st, ne = Wd('nerve', 2) - st;
    const ARMX = { S: [-220, 860], E: [640, 880], Wr: [380, 250], w: 170, hs: 0.8 };
    add({ id: 'S04', at: st, cam: [600, 820], zoom: 0.1, note: 'x-ray elbow close-up with a cartoon bone sitting on the elbow knob (both on screen at the cut); red "NOT A BONE" stamp slams on "not"; the bone gets knocked off on "bone"; on "nerve" the pink ulnar nerve glows yellow with a signal running + NERVE tag',
      draw(lt, d, t) {
        K.xray(t);
        const o = K.fbArm({ ...ARMX, t, lit: eo(seg(lt, ne, ne + 0.25)), nerve: lt > ne ? (((lt - ne) * 0.9) % 1) : -1, knobRing: blip(lt, ne, 0.5) });
        const fly = seg(lt, bo, bo + 0.5);
        if (fly < 1) K.fbBone(o.knob[0] + 60 + fly * 600, o.knob[1] + 20 - fly * 500 + fly * fly * 300, 1.05, -0.3 + fly * 5, enter(lt));
        K.stamp('NOT A BONE', 540, 330, 84, -0.1, lt > no ? lerp(1.6, 1, eo(seg(lt, no, no + 0.18))) : 0);
        K.tag('NERVE', 800, 1030, o.knob[0] + 40, o.knob[1] + 70, 58, pop(lt, ne));
      } });
    cue(st, 'whoosh'); cue(st + no, 'slam', { gain: 0.7 }); cue(st + bo, 'boing', { gain: 0.45 }); cue(st + ne, 'sparkle', { dur: 0.6, gain: 0.4 }); cue(st + ne, 'pop', { gain: 0.5 });
  }

  // ── 4 · "It runs from your neck all the way down to your hand." ──
  {
    const st = cut(3), ru = Wd('runs', 3) - st, nk = Wd('neck', 3) - st, ha = Wd('hand', 3) - st;
    const M = { x: 420, y: 880, s: 1.45 };
    const NL = [[34, -222], [70, -206], [128, -184], [156, -120], [182, -20], [186, 70], [184, 160]].map(([a, b]) => [M.x + a * M.s, M.y + b * M.s]);
    add({ id: 'S05', at: st, cam: [560, 760], zoom: 0.1, note: 'x-ray hero, full body (on screen at the cut); the pink ulnar nerve draws itself from the neck down the arm to the hand from "runs" to "hand", a yellow signal riding its tip; NECK pill + ring on "neck", HAND pill + ring on "hand"',
      draw(lt, d, t) {
        K.xray(t);
        K.man({ x: M.x, y: M.y, s: M.s, xray: true, eyes: 'n', mouth: 'smile', look: 0.6, brow: 0.3 });
        const dr = lerp(0.04, 1, eio(seg(lt, ru, ha + 0.1)));
        K.nerve(NL, dr < 1 ? dr : -1, dr);
        const ring = (p, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.beginPath(); ctx.arc(p[0], p[1], 56, 0, Math.PI * 2); ctx.lineWidth = 16; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = C.yellow; ctx.stroke(); ctx.restore(); };
        ring(NL[0], eo(seg(lt, nk, nk + 0.2))); ring(NL[NL.length - 1], eo(seg(lt, ha, ha + 0.2)));
        K.tag('NECK', 220, 420, NL[0][0] - 40, NL[0][1] - 20, 54, pop(lt, nk));
        K.tag('HAND', 860, 1000, NL[NL.length - 1][0] + 40, NL[NL.length - 1][1] + 10, 54, pop(lt, ha));
      } });
    cue(st, 'whoosh'); cue(st + ru, 'slide', { dur: ha - ru, gain: 0.35 }); cue(st + nk, 'pop', { gain: 0.55 }); cue(st + ha, 'pop', { gain: 0.6 });
  }

  // ── 5 · RELATABLE "Ever smacked your elbow on a door frame and just froze?" ──
  {
    const st = cut(4), sm = Wd('smacked', 4) - st, el = Wd('elbow', 4) - st, dr = Wd('door', 4) - st, fr = Wd('froze', 4) - st;
    const DS = 1.15, DX = 830, FLOOR = 1560, MS = 0.95, MY = 1000;
    const casingL = DX - 210 * DS - 70 * DS, X1 = casingL - 252 * MS;
    add({ id: 'S06', at: st, cam: [560, 900], zoom: 0.07, note: 'real world: the room with a doorway (on screen at the cut), the hero walking right with his elbow out; on "smacked" the elbow clips the door casing (burst, he jolts); yellow ring on the elbow on "elbow"; the door frame flashes yellow outline on "door"; on "froze" he locks up wide-eyed (shake lines, tingle zigzags on the arm)',
      draw(lt, d, t) {
        plain();
        ctx.fillStyle = C.floor; ctx.fillRect(-300, FLOOR, W + 600, 700);
        const dw = K.fbDoorway(DX, FLOOR, DS, { open: 0.75, glow: blip(lt, dr, 0.5) * 0.9 });
        const p = eio(seg(lt, 0, sm)), bounce = lt > sm ? -26 * Math.sin(Math.PI * seg(lt, sm, sm + 0.25)) : 0;
        const x = lerp(X1 - 170, X1, p) + bounce, hitA = blip(lt, sm, 0.45), frz = lt > fr ? 1 : 0;
        const shake = frz ? Math.sin(t * 80) * 4 : 0;
        K.man({ x: x + shake, y: MY, s: MS, arm: K.ARM.hip, eyes: lt > sm ? 'wide' : 'n', mouth: lt > sm ? (frz ? 'flat' : 'o') : 'smile', brow: lt > sm ? 1 : 0.2, look: 0.7 });
        const ex = x + 250 * MS, ey = MY + 20 * MS;
        K.burst(ex + 20, ey, 1.4, hitA);
        if (lt > el) { ctx.save(); ctx.globalAlpha = clamp(eo(seg(lt, el, el + 0.2))); ctx.beginPath(); ctx.arc(ex, ey, 62, 0, Math.PI * 2); ctx.lineWidth = 16; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = C.yellow; ctx.stroke(); ctx.restore(); }
        if (frz) { K.shakeLines(x, MY - 100, 230, 420, t, 1, 12); zig(ex - 20, ey + 40, x + 150 * MS, MY + 140 * MS, 5, 12, C.yellow, 9, eo(seg(lt, fr, fr + 0.15))); K.shockLines(x, MY - 338 * MS - 30, 120, 1); }
        void dw;
      } });
    cue(st, 'whoosh'); cue(st + sm, 'thud', { gain: 0.75 }); cue(st + sm + 0.02, 'boing', { gain: 0.3 }); cue(st + el, 'pop', { gain: 0.45 }); cue(st + dr, 'pop', { gain: 0.4 }); cue(st + fr, 'alarm', { dur: 0.5, gain: 0.25 });
  }

  // ── elbow cross-section (S07 re-hook, S08, S09) ──
  const CX = 540, CY = 900, CS = 1;
  // ── 6 · RE-HOOK "But here's the weird part: your elbow barely protects it." (new scene: inside the elbow) ──
  {
    const st = cut(5), we = Wd('weird', 5) - st, el = Wd('elbow', 5) - st, ba = Wd('barely', 5) - st, pr = Wd('protects', 5) - st;
    add({ id: 'S07', at: st, cam: [CX, CY - 120], zoom: 0.15, note: 'RE-HOOK, new scene: cutaway INSIDE the elbow (skin band, thin pink tissue, the nerve cross-section on the bony bump; on screen at the cut, zooming in); "?" burst on "weird"; ELBOW tag on the bone on "elbow"; on "barely" a yellow bracket marks the thin layer over the nerve + small "only a little tissue" label (Cleveland Clinic); small shield with a red X on "protects"',
      draw(lt, d, t) {
        plain();
        const o = K.fbElbowCut(CX, CY, CS, { t, sc: lt < 0.3 ? lerp(0.7, 1, eo(seg(lt, 0, 0.3))) : 1 });
        bigText('?', 830, 520, 170 * pop(lt, we), C.yellow, 0.15);
        K.tag('ELBOW', 830, 1000, 650, 990, 52, pop(lt, el));
        const bA = eo(seg(lt, ba, ba + 0.25));
        if (bA > 0) {
          const gx = o.gap[0], gy0 = o.gap[1] + 2, gy1 = o.nerve[1] - 96 - 2;
          ctx.save(); ctx.globalAlpha = bA;
          for (const [c, w] of [[C.ink, 18], [C.yellow, 9]]) { line([[gx, gy0], [gx, gy1]], c, w); line([[gx - 34, gy0], [gx + 34, gy0]], c, w); line([[gx - 34, gy1], [gx + 34, gy1]], c, w); }
          ctx.restore();
          K.tag('only a little tissue', 380, 400, gx - 40, gy0 + 10, 38, pop(lt, ba + 0.05));
        }
        const sh = pop(lt, pr);
        if (sh > 0) { K.shieldBadge(800, 330, 0.5, sh); K.redX(800, 330, 0.3 * sh, 1, 0.8); }
      } });
    cue(st, 'whoosh'); cue(st + we, 'boing', { gain: 0.45 }); cue(st + el, 'pop', { gain: 0.5 }); cue(st + ba, 'pop', { gain: 0.55 }); cue(st + pr, 'slam', { gain: 0.45 });
  }

  // ── 7a · "It sits right under your skin," ──
  {
    const st = cut(6), un = Wd('under', 6) - st, sk = Wd('skin', 6) - st;
    add({ id: 'S08', at: st, cam: [CX, CY - 120], zoom: 0.16, note: 'closer on the cross-section (on screen at the cut), the nerve gently pulsing; NERVE tag on "under" with a down arrow from the skin; SKIN tag on "skin" + the rewatch label "ulnar nerve: just under the skin (Cleveland Clinic)"',
      draw(lt, d, t) {
        plain();
        const o = K.fbElbowCut(CX, CY, CS, { t, zap: 0 });
        const na = pop(lt, un);
        K.tag('NERVE', 830, 430, o.nerve[0] + 60, o.nerve[1] - 40, 54, na);
        K.tag('SKIN', 230, 430, o.skin[0], o.skin[1], 54, pop(lt, sk));
        K.pill('ulnar nerve: just under the skin', 540, 1030, 36, C.ink, C.white, pop(lt, sk + 0.15));
        K.pill('(Cleveland Clinic)', 540, 1105, 28, C.ink, C.white, pop(lt, sk + 0.2));
      } });
    cue(st, 'whoosh'); cue(st + un, 'pop', { gain: 0.55 }); cue(st + sk, 'pop', { gain: 0.55 }); cue(st + sk + 0.15, 'pop', { gain: 0.3 });
  }

  // ── 7b · "so one bump pins it against bone." ──
  {
    const st = at('so', 6), bu = Wd('bump', 6) - st, pi = Wd('pins', 6) - st, bo = Wd('bone', 6) - st;
    add({ id: 'S09', at: st, cam: [CX, CY - 120], zoom: 0.12, note: 'the cross-section with a wood door-frame edge already dropping in from the top (on screen at the cut); it lands on the skin on "bump"; on "pins" it dents the skin and squashes the nerve flat against the bone (yellow zap ring); BONE tag on "bone"',
      draw(lt, d, t) {
        plain();
        const edge = lerp(0.25, 1, eo(seg(lt, 0, bu))), press = eob(seg(lt, pi - 0.04, pi + 0.16));
        const o = K.fbElbowCut(CX, CY, CS, { t, edge, press: clamp(press, 0, 1.1), zap: lt > pi ? 1 - 0.4 * seg(lt, pi + 0.5, pi + 1) : 0 });
        K.tag('BONE', 830, 1020, 650, 1000, 54, pop(lt, bo));
        K.pill('DOOR FRAME', 540, 300, 44, C.ink, C.white, pop(lt, bu));
      } });
    cue(st, 'whoosh'); cue(st + bu, 'thud', { gain: 0.6 }); cue(st + pi, 'slam', { gain: 0.6 }); cue(st + pi + 0.05, 'zip', { gain: 0.4 }); cue(st + bo, 'pop', { gain: 0.5 });
  }

  // ── 8 · ANSWER "Pinky side. It wires your pinky and half your ring finger." ──
  {
    const st = cut(7), pk = Wd('pinky', 7) - st, wi = Wd('wires', 7) - st, ha = Wd('half', 7) - st;
    const pinky2 = lineWords(7).filter((w) => /^pinky/i.test(w.w))[1].s - st;   // the 2nd "pinky" in the line
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.05, note: 'ANSWER: the x-ray hand + A / B pills in the guess spot (on screen at the cut); on "Pinky" a check pops on B, B flashes, A dims; COMMENT A OR B pill for ~1 s (not voiced); on "wires" the nerve lights and a signal runs into the hand; the pinky lights yellow on the 2nd "pinky", exactly half the ring finger on "half" (dashed midline = rewatch detail)',
      draw(lt, d, t) {
        K.xray(t);
        K.fbArm({ ...HAND, t, lit: eo(seg(lt, wi, wi + 0.3)), nerve: lt > wi && lt < wi + 0.7 ? lerp(0.3, 1, seg(lt, wi, wi + 0.6)) : -1, zone: eo(seg(lt, pinky2, pinky2 + 0.2)), zoneR: eo(seg(lt, ha, ha + 0.2)) });
        pills({ scA: enter(lt), scB: enter(lt), check: pop(lt, pk, 0.3), dim: seg(lt, pk, pk + 0.3), hiB: blip(lt, pk, 0.45) });
        K.pill('COMMENT A OR B', 540, 1150, 40, C.ink, C.yellow, pop(lt, pk + 0.3, 0.25) * out(lt, pk + 1.3, 0.2));
      } });
    cue(st, 'whoosh'); cue(st + pk, 'pop', { gain: 0.8 }); cue(st + pk + 0.3, 'pop', { gain: 0.3 }); cue(st + wi, 'zip', { gain: 0.4 }); cue(st + pinky2, 'sparkle', { dur: 0.4, gain: 0.4 }); cue(st + ha, 'pop', { gain: 0.5 });
  }

  // ── 9 · "Still tingling after six weeks? See a doctor." ──
  {
    const st = cut(8), ti = Wd('tingling', 8) - st, si = Wd('six', 8) - st, dc = Wd('doctor', 8) - st;
    add({ id: 'S11', at: st, cam: [540, 740], zoom: 0.05, note: 'calm: the hero\'s hand (skin) on the left (on screen at the cut), soft yellow tingle zigzags on its pinky side from "tingling"; a 6 WEEKS calendar pops right on "six"; doctor badge pops below it on "doctor" with an arrow from the hand',
      draw(lt, d, t) {
        plain();
        K.handSkin(320, 720, 0.72 * enter(lt));
        const ta = eo(seg(lt, ti, ti + 0.2)) * (0.75 + 0.25 * Math.sin(t * 12));
        zig(440, 400, 520, 310, 5, 14, C.yellow, 10, ta); zig(460, 560, 570, 520, 5, 14, C.yellow, 10, ta);
        K.calendar(790, 520, 0.5 * pop(lt, si), '6', 'WEEKS', 0.05);
        K.doctorBadge(790, 1000, 0.95, pop(lt, dc));
        const aa = eo(seg(lt, dc, dc + 0.3)); K.arrow(500, 1000, 200 * aa, 0, aa);
      } });
    cue(st, 'whoosh'); cue(st + ti, 'sparkle', { dur: 0.5, gain: 0.3 }); cue(st + si, 'pop', { gain: 0.6 }); cue(st + dc, 'pop', { gain: 0.6 });
  }

  // ── 10a · TEASE "Next Body File: the doorway that makes you forget." ──
  const badge = (x, y, sc, size = 50) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = Wd('next', 9) - 0.02, nx = Wd('next', 9) - st, bo = Wd('body', 9) - st, dw = Wd('doorway', 9) - st, fo = Wd('forget', 9) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.08, note: 'tease: a doorway with the hero stepping through it (on screen at the cut, no fade); yellow NEXT pill on "Next"; BODY FILES badge on "Body"; the doorway outline flashes yellow on "doorway"; a thought cloud with a big "?" pops over his head on "forget" (he looks puzzled; nothing dangerous)',
      draw(lt, d, t) {
        plain();
        ctx.fillStyle = C.floor; ctx.fillRect(-300, 1180, W + 600, 900);
        K.fbDoorway(540, 1180, 0.82 * enter(lt), { open: 0.8, glow: eo(seg(lt, dw, dw + 0.2)) });
        const fz = lt > fo;
        K.man({ x: 500, y: 830, s: 0.55 * enter(lt), eyes: 'n', mouth: fz ? 'flat' : 'smile', brow: fz ? 0.9 : 0.2, look: fz ? 0.8 : 0.3, frown: false });
        K.fbThought(760, 420, 1, { sc: pop(lt, fo), t, tx: 580, ty: 560 });
        K.pill('NEXT', 540, 250, 64, C.yellow, C.ink, pop(lt, nx));
        badge(540, 1110, pop(lt, bo));
      } });
    cue(st, 'whoosh'); cue(st + nx, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.5 }); cue(st + dw, 'pop', { gain: 0.45 }); cue(st + fo, 'boing', { gain: 0.45 });
  }
  // ── 10b · LOOP "Mind your elbow..." (snap back to the frame-1 framing; end card held still against the camera push) ──
  {
    const st = at('mind', 9), el = Wd('elbow', 9) - st, Z = 0.13;
    add({ id: 'S13', at: st, cam: HOOK_CAM, zoom: Z, note: 'LOOP + END CARD: snap back to the frame-1 framing (same x-ray hero, casing, arm across the chest), the elbow sliding toward the casing and stopping a hair short (frame 1 is the hit); camera ends at frame 1\'s punch scale; knob ring on "elbow"; small doorway badge + NEXT top right, BODY FILES badge + FOLLOW top left (where the frame-1 guess pills sit, far from the caption)',
      draw(lt, d, t) {
        const dx = lerp(-90, 0, eio(seg(lt, 0, d - 0.12)));
        hookScene(t, { dx, face: 0, pills: 0, knobRing: eo(seg(lt, el, el + 0.25)) });
        const k = (1 + 0.13 * (1 - eo(clamp(lt / 0.32)))) * (1 + Z * eio(clamp(lt / d)));
        ctx.save(); ctx.translate(HOOK_CAM[0], HOOK_CAM[1]); ctx.scale(1 / k, 1 / k); ctx.translate(-HOOK_CAM[0], -HOOK_CAM[1]);
        K.fbDoorBadge(880, 320, 0.84, pop(lt, 0.04, 0.3), t);
        K.pill('NEXT', 880, 505, 38, C.yellow, C.ink, pop(lt, 0.1, 0.3));
        badge(300, 270, pop(lt, 0.04, 0.3), 40);
        K.followPill(300, 380, pop(lt, 0.35), t, 42);
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + 0.35, 'pop', { gain: 0.6 }); cue(st + el, 'pop', { gain: 0.35 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES, loop: true };
}
