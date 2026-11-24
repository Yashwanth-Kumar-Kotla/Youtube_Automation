// WHAT HAPPENS IF YOU SIT ALL DAY?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): office, the hero sinking into a slate office chair, wall clock top left whipping
// 9 → 5 with a red "7+ HOURS" pill, the guess pills A 20 MIN / B HOUR+ top right, desk + monitor right with the rewatch
// sticky note "150 MIN/WK = ~21/DAY (NHS)". No black fade in or out (loop: true), so frame 1 is the hook.
// Guess (line 1): balance scale, a day in the chair vs "?", A/B pills pop on "twenty" / "hour". Re-hook (line 4): x-ray
// legs pull back to the whole body, a metabolism furnace dims. Answer (line 6): same scale, check on B on "hour", the
// 60-75 MIN hourglass levels the scale. Tease (line 8, from "Next"): bath fingers, then a fingertip grip lens. Loop: "Still
// sitting?" drops the hero back into the frame-1 chair; the clock comes round to 9, camera ends at frame 1's scale.
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
  const enter = (lt) => lerp(0.86, 1, eob(seg(lt, 0, 0.25)));                                  // on screen from frame 1 of the shot
  const scaled = (x, y, k, fn) => { if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); fn(); ctx.restore(); };
  const shake = (lt, a, d = 0.5, amp = 8) => (lt > a ? Math.sin((lt - a) * 60) * amp * Math.max(0, 1 - (lt - a) / d) : 0);

  // ── the HOOK framing (frame 1 + loop ending) ──
  const FLOOR = 1180, HX = 500, HS = 0.78, DESK = [860, 0.78], CLK = [235, 330, 118], HOOK_CAM = [540, 800];
  const PA = [845, 250], PB = [845, 372], PSZ = 40;
  const NOTE = ['150 MIN/WK', '= ~21/DAY', '(NHS)'];
  const FACE0 = { eyes: 'n', mouth: 'flat', brow: 0.15 };
  const hookScene = (t, { rise = 0.35, hour = 9, from = 9, pills = 1, tag7 = 1, tagBump = 0, sink = 0, face = FACE0, screen = null, arm = null, extra = null } = {}) => {
    K.sitOffice(FLOOR);
    K.wallClock(CLK[0], CLK[1], CLK[2], { hour, from });
    if (tag7 > 0) K.pill('7+ HOURS', CLK[0], CLK[1] + 200, 46, C.red, C.white, tag7 * (1 + 0.15 * tagBump));
    K.sitDesk(DESK[0], FLOOR, DESK[1], { note: NOTE, screen });
    if (extra) extra();
    K.sitOfficeChair(HX, FLOOR, HS, { sink });
    K.hrRiser(HX, FLOOR, HS, { rise, ...face, ...(arm ? { arm, armL: arm } : {}) });
    if (pills > 0) { K.abPill('A', '20 MIN', PA[0], PA[1], PSZ, { sc: pills }); K.abPill('B', 'HOUR+', PB[0], PB[1], PSZ, { sc: pills }); }
  };

  // ── 1 · HOOK "What happens if you sit all day?" ──
  {
    const si = Wd('sit', 0), da = Wd('day', 0);
    add({ id: 'S01', at: 0, cam: HOOK_CAM, zoom: 0.06, note: 'FRAME 1 = hook (no fade): office, hero sinking into the office chair, wall clock whipping 9 → 5 with the red 7+ HOURS pill, A 20 MIN / B HOUR+ pills top right, desk + monitor with the NHS sticky note (rewatch); 7+ HOURS pill bumps on "sit" and "day"',
      draw(lt, d, t) {
        const land = eio(seg(lt, 0, 0.8));
        hookScene(t, { rise: lerp(0.35, 0, land), hour: 9 + 8 * eio(seg(lt, 0, 1.75)), sink: blip(lt, 0.6, 0.4), tagBump: blip(lt, si, 0.3) + blip(lt, da, 0.3),
          face: lt < 1.2 ? FACE0 : { eyes: 'n', mouth: 'flat', brow: 0.15 + 0.35 * eo(seg(lt, 1.2, 1.5)) } });
      } });
    cue(0.02, 'tock', { gain: 0.35 }); cue(0.6, 'thud', { gain: 0.4 }); for (const k of [0.5, 0.95, 1.4]) cue(k, 'tock', { gain: 0.3 });
    cue(si, 'pop', { gain: 0.4 }); cue(da, 'pop', { gain: 0.45 });
  }

  // ── 2 · "Many of us sit seven-plus hours." (crowd of sitters under a big clock) ──
  {
    const st = cut(1), ma = Wd('many', 1) - st, se = Wd('seven', 1) - st, ho = Wd('hours', 1) - st;
    const cols = [C.shirt, C.pot, C.leaf, '#5A6B8C', C.pinkDark];
    add({ id: 'S02', at: st, cam: [540, 640], zoom: 0.07, note: 'big wall clock (on screen at the cut) + a row of five mini people in office chairs popping in one by one (first at the cut, rest from "Many"); on "seven-plus" the clock sweeps a sky wedge 9 → 4:30, red 7+ HOURS pill slams on "hours"; the sitters slump',
      draw(lt, d, t) {
        plain();
        ctx.fillStyle = C.floor; ctx.fillRect(-300, 1120, W + 600, 900);
        const sw = eio(seg(lt, se, ho + 0.3));
        K.wallClock(540, 420, 200, { hour: 9 + 7.5 * sw, from: 9, sc: enter(lt) });
        K.pill('7+ HOURS', 540, 700, 64, C.red, C.white, pop(lt, ho, 0.3));
        cols.forEach((c, i) => K.sitMini(140 + i * 200, 980, 0.62, c, i === 0 ? enter(lt) : pop(lt, ma + (i - 1) * 0.09, 0.25), seg(lt, ho, ho + 0.4)));
      } });
    cue(st, 'whoosh'); cue(st + ma, 'pop', { gain: 0.4 }); cue(st + ma + 0.18, 'pop', { gain: 0.35 }); cue(st + se, 'slide', { dur: ho - se + 0.3, gain: 0.35 }); cue(st + ho, 'slam', { gain: 0.6 });
  }

  // ── guess / answer scale (S03a, S03b, S08: same spot) ──
  const SC = [540, 470], SCS = 1.15, PY = 1075;
  const chairLoad = () => { K.sitChairIcon(0, -88, 0.7); K.pill('7+ H', 0, -255, 34, C.red, C.white); };
  const qLoad = (k = 1) => () => bigText('?', 0, -90, 150, C.yellow, 0, k);
  const pills2 = ({ scA = 1, scB = 1, check = 0, dim = 0, hiB = 0 } = {}) => {
    K.abPill('A', '20 MIN', 290, PY, 46, { sc: scA, dim });
    K.abPill('B', 'HOUR+', 790, PY, 46, { sc: scB, check, hi: hiB });
  };

  // ── 3a · GUESS "What cancels that: twenty minutes of exercise," ──
  {
    const st = at('what', 1), ca = Wd('cancels', 1) - st, tw = Wd('twenty', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.06, note: 'guess: balance scale (on screen at the cut), left pan = a day in the chair (chair icon + red 7+ H) tipped down, right pan = yellow "?"; the "?" bounces on "cancels"; pill A 20 MIN pops on "twenty" and the scale wobbles (no answer given)',
      draw(lt, d, t) {
        plain();
        const wob = lt > tw ? Math.sin((lt - tw) * 9) * 0.08 * Math.max(0, 1 - (lt - tw) / 1.4) : 0;
        K.sitScale(SC[0], SC[1], SCS, -0.26 + wob, { left: chairLoad, right: qLoad(1 + 0.3 * blip(lt, ca, 0.4)), sc: enter(lt) });
        pills2({ scA: pop(lt, tw), scB: 0 });
      } });
    cue(st, 'whoosh'); cue(st + ca, 'boing', { gain: 0.4 }); cue(st + tw, 'pop', { gain: 0.6 });
  }
  // ── 3b · GUESS "or an hour-plus?" ──
  {
    const st = at('or', 1), ho = Wd('hour-plus', 1) - st;
    add({ id: 'S04', at: st, cam: [540, 820], zoom: 0.1, note: 'same scale, punched in lower (on screen at the cut, pill A still there); pill B HOUR+ pops on "hour-plus" and the "?" pulses; scale wobbles again',
      draw(lt, d, t) {
        plain();
        const wob = lt > ho ? Math.sin((lt - ho) * 9) * 0.08 * Math.max(0, 1 - (lt - ho) / 1.2) : 0;
        K.sitScale(SC[0], SC[1], SCS, -0.26 + wob, { left: chairLoad, right: qLoad(1 + 0.3 * blip(lt, ho, 0.4)) });
        pills2({ scA: 1, scB: pop(lt, ho) });
      } });
    cue(st, 'whoosh'); cue(st + ho, 'pop', { gain: 0.6 });
  }

  // ── 4 · "Sit down, and your muscle contractions go way down." (x-ray: hero in the chair, thigh-muscle lens) ──
  {
    const st = cut(2), mu = Wd('muscle', 2) - st, co = Wd('contractions', 2) - st, wa = Wd('way', 2) - st;
    const X = 320, S2 = 0.74, LX = 790, LY = 560, LR = 230;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.08, note: 'x-ray film: whole-body x-ray hero dropping into an x-ray office chair (on screen at the cut, seated by "down"); on "muscle" a lens pops with a pink thigh-muscle bundle (dashed pointer to the thigh); it squeezes in quick pulses on "contractions"; on "way down" the pulses fade out, the bundle dims and a CONTRACTIONS down-arrow pill pops',
      draw(lt, d, t) {
        K.xray(t);
        const rise = lerp(0.45, 0, eio(seg(lt, 0, 0.35)));
        K.sitOfficeChair(X, FLOOR, S2, { xr: true, sink: blip(lt, 0.3, 0.35) });
        const o = K.hrRiser(X, FLOOR, S2, { xray: true, rise, eyes: 'n', mouth: 'flat' });
        const ls = pop(lt, mu, 0.3);
        if (ls > 0) { ctx.save(); ctx.globalAlpha = clamp(ls); ctx.setLineDash([16, 14]); line([[LX - LR * 0.75, LY + LR * 0.7], [o.knee[0] - 10, o.knee[1] - 40]], C.cyan, 8); ctx.restore();
          ctx.save(); ctx.globalAlpha = clamp(ls); ctx.beginPath(); ctx.ellipse(o.knee[0] - 30, o.knee[1] - 40, 70, 48, 0, 0, Math.PI * 2); ctx.lineWidth = 10; ctx.strokeStyle = C.yellow; ctx.stroke(); ctx.restore(); }
        const amp = lt < co ? 0.25 : lerp(0.75, 0.04, eio(seg(lt, wa, wa + 0.6)));
        const sq = amp * Math.max(0, Math.sin((lt - co) * Math.PI * 2 * 2.2));
        K.lens(LX, LY, LR, ls, () => {
          ctx.save(); ctx.scale(0.62, 0.62); K.fiberBundle(0, 0, 640, sq, t); ctx.restore();
          const dim = eio(seg(lt, wa, wa + 0.6)) * 0.45;
          if (dim > 0) { ctx.save(); ctx.globalAlpha = dim; ctx.fillStyle = C.xnavy; ctx.fillRect(-LR, -LR, LR * 2, LR * 2); ctx.restore(); }
        }, C.xnavy);
        K.hrArrowPill('CONTRACTIONS', LX - 20, 1110, 44, 1, pop(lt, wa, 0.3));
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'thud', { gain: 0.5 }); cue(st + mu, 'pop', { gain: 0.6 }); cue(st + co, 'boing', { gain: 0.25 }); cue(st + wa, 'slide', { dur: 0.5, gain: 0.35 });
  }

  // ── 5 · RELATABLE "Ever stood up after a movie, rusted to the seat?" ──
  {
    const st = cut(3), sto = Wd('stood', 3) - st, mo = Wd('movie', 3) - st, ru = Wd('rusted', 3) - st, se = Wd('seat', 3) - st;
    const X = 540, S2 = 0.8;
    add({ id: 'S06', at: st, cam: [540, 820], zoom: 0.08, note: 'cinema: hero in a velvet cinema seat (on screen at the cut); on "stood" he tries to rise (stiff, jerky); THE END fades onto the screen on "movie"; on "rusted" rust flakes + creak ticks at his hips/knees and he freezes half up, eyes wide; on "seat" he sags back a little',
      draw(lt, d, t) {
        K.sitCinema(t, { end: eo(seg(lt, mo, mo + 0.3)) });
        K.sitCinemaSeat(X, FLOOR, S2, 'back');
        const up = 0.32 * eio(seg(lt, sto, sto + 0.5)) - 0.12 * eio(seg(lt, se, se + 0.35));
        const jit = lt > ru ? Math.sin(lt * 50) * 0.012 : 0;
        const o = K.hrRiser(X + shake(lt, ru, 0.6, 6), FLOOR, S2, { rise: clamp(up + jit), eyes: lt > ru ? 'wide' : 'n', mouth: lt > ru ? 'o' : 'flat', brow: lt > sto ? 0.6 : 0.1 });
        K.sitCinemaSeat(X, FLOOR, S2, 'cup');
        if (lt > ru) { const a = eo(seg(lt, ru, ru + 0.2)); K.sitRust(o.knee[0], o.knee[1] - 30, t, a, 0.9); K.sitRust(2 * X - o.knee[0], o.knee[1] - 30, t + 0.4, a, 0.9); }
        K.pill('CREAK', 830, 760, 46, C.pot, C.white, pop(lt, ru + 0.1, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + sto, 'slide', { dur: 0.45, gain: 0.3 }); cue(st + mo, 'pop', { gain: 0.4 }); cue(st + ru, 'boing', { gain: 0.5 }); cue(st + ru + 0.1, 'pop', { gain: 0.4 }); cue(st + se, 'thud', { gain: 0.4 });
  }

  // ── 6a · RE-HOOK "But it's not just legs:" (x-ray legs close-up pulls back to the whole body, a furnace in the belly) ──
  const XB = { x: 540, s: 0.8 };
  const bellyAt = (x, floor, s) => [x, floor - (180 + 250) * s + 110 * s];
  {
    const st = cut(4), bu = Wd('but', 4) - st, le = Wd('legs', 4) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.05, note: 'RE-HOOK, new scene: x-ray close-up of the seated legs (on screen at the cut, legs ringed yellow); on "legs" the view pulls back to the whole x-ray body in the chair and a small furnace glows in the belly with a "?" pill',
      draw(lt, d, t) {
        const k = lerp(2.3, 1, eio(seg(lt, le - 0.15, le + 0.45)));
        const fy = lerp(FLOOR - 150, 820, eio(seg(lt, le - 0.15, le + 0.45)));
        K.xray(t);
        ctx.save(); ctx.translate(540, 760); ctx.scale(k, k); ctx.translate(-540, -fy);
        K.sitOfficeChair(XB.x, FLOOR, XB.s, { xr: true });
        const o = K.hrRiser(XB.x, FLOOR, XB.s, { xray: true, rise: 0, eyes: 'n', mouth: 'flat' });
        const ra = blip(lt, bu, 0.6) * (1 - seg(lt, le, le + 0.2));
        if (ra > 0) { ctx.save(); ctx.globalAlpha = ra; ctx.beginPath(); ctx.ellipse(XB.x, o.knee[1] + 20, 190, 110, 0, 0, Math.PI * 2); ctx.lineWidth = 12; ctx.strokeStyle = C.yellow; ctx.stroke(); ctx.restore(); }
        const [bx, by] = bellyAt(XB.x, FLOOR, XB.s);
        K.sitFurnace(bx, by, 0.3, { heat: 1, t, xr: true, sc: pop(lt, le + 0.2, 0.3) });
        ctx.restore();
        K.pill('?', 760, 640, 60, C.yellow, C.ink, pop(lt, le + 0.35, 0.3));
      } });
    cue(st, 'whoosh'); cue(st + bu, 'pop', { gain: 0.35 }); cue(st + le - 0.1, 'zip', { gain: 0.45 }); cue(st + le + 0.3, 'pop', { gain: 0.5 });
  }
  // ── 6b · "your metabolism slows, so you burn fewer calories." (close-up: the furnace dims) ──
  {
    const st = at('your', 4), me = Wd('metabolism', 4) - st, sl = Wd('slows', 4) - st, bu = Wd('burn', 4) - st, fe = Wd('fewer', 4) - st;
    const S3 = 1.5, F3 = 700 + 430 * S3 - 0;   // chest at y 700
    add({ id: 'S08', at: st, cam: [540, 800], zoom: 0.08, note: 'close-up x-ray torso (on screen at the cut) with a big furnace in the belly, flame high and sparks out of its chimney; tag "metabolism (NIH)" on "metabolism" (rewatch); on "slows" the flame shrinks and the sparks thin out; on "burn fewer" a BURN FEWER down-arrow pill',
      draw(lt, d, t) {
        K.xray(t);
        K.hrRiser(540, F3, S3, { xray: true, rise: 0, eyes: 'n', mouth: 'flat', brow: lt > sl ? 0.3 : 0 });
        const heat = lerp(1, 0.15, eio(seg(lt, sl, sl + 0.8)));
        K.sitFurnace(540, 850, 0.72, { heat, t, xr: true, sc: enter(lt) });
        K.tag('metabolism (NIH)', 330, 1060, 450, 930, 52, pop(lt, me, 0.3));
        K.hrArrowPill('BURN FEWER', 800, 980, 42, 1, pop(lt, fe - 0.1, 0.3));
      } });
    cue(st, 'whoosh'); cue(st + me, 'pop', { gain: 0.55 }); cue(st + sl, 'slide', { dur: 0.7, gain: 0.3 }); cue(st + fe - 0.1, 'pop', { gain: 0.5 }); void bu;
  }

  // ── 7a · "The silent killer part? Eight-plus hours, no exercise:" (back in the office, push in on the clock) ──
  {
    const st = cut(5), si = Wd('silent', 5) - st, ei = Wd('eight', 5) - st, no = Wd('no', 5) - st, ex = Wd('exercise', 5) - st;
    add({ id: 'S09', at: st, cam: [380, 640], zoom: 0.1, note: 'office again (on screen at the cut), hero seated, calm smile, unaware; on "silent" a red "SILENT KILLER" quote pill with a small DHSC source pill; on "Eight-plus" the clock sweeps a sky wedge 9 → 5:30 and the hours pill reads 8+ HOURS; on "no" a dumbbell drops on the floor, red X on "exercise"',
      draw(lt, d, t) {
        const sw = eio(seg(lt, ei, ei + 0.7));
        hookScene(t, { rise: 0, hour: 9 + 8.5 * sw, from: 9, pills: 0, tag7: 0, face: { eyes: 'n', mouth: 'smile', brow: 0.1 } });
        K.pill('8+ HOURS', CLK[0], CLK[1] + 200, 46, C.red, C.white, pop(lt, ei, 0.3));
        K.pill('"SILENT KILLER"', 640, 250, 48, C.red, C.white, pop(lt, si, 0.3));
        K.pill('UK DHSC', 640, 350, 30, C.ink, C.white, pop(lt, si + 0.15, 0.3));
        const dy = lerp(640, 960, eo(seg(lt, no, no + 0.3)));
        if (lt > no) K.sitDumbbell(190, dy, 0.5, -0.1);
        K.redX(190, 955, 0.26, eo(seg(lt, ex, ex + 0.2)));
      } });
    cue(st, 'whoosh'); cue(st + si, 'pop', { gain: 0.6 }); cue(st + ei, 'slide', { dur: 0.7, gain: 0.3 }); cue(st + ei + 0.1, 'pop', { gain: 0.45 }); cue(st + no + 0.3, 'thud', { gain: 0.55 }); cue(st + ex, 'slam', { gain: 0.55 });
  }
  // ── 7b · "a death risk like smoking." (schematic comparison cards, no scare imagery) ──
  {
    const st = at('a', 5), ri = Wd('risk', 5) - st, li = Wd('like', 5) - st, sm = Wd('smoking', 5) - st;
    const card = (x, y, sc, fn) => scaled(x, y, sc, () => {
      ctx.beginPath(); ctx.roundRect(x - 220, y - 270, 440, 540, 46); ctx.fillStyle = C.ink; ctx.fill();
      ctx.beginPath(); ctx.roundRect(x - 210, y - 260, 420, 520, 38); ctx.fillStyle = C.white; ctx.fill(); fn();
    });
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.06, note: 'two cards: left = chair icon + "8+ H, NO EXERCISE" (on screen at the cut); RISK up-arrow pill on "risk"; yellow "≈" slams between the cards on "like"; right card with a schematic cigarette icon (no smoke) pops on "smoking"; small MAYO CLINIC · 13 STUDIES source pill (rewatch)',
      draw(lt, d, t) {
        plain();
        card(285, 700, enter(lt), () => { K.sitChairIcon(285, 690, 0.95); K.pill('8+ H', 285, 520, 40, C.red, C.white); K.pill('NO EXERCISE', 285, 900, 30, C.ink, C.white); });
        card(795, 700, pop(lt, sm - 0.05, 0.3), () => { K.sitCigIcon(795, 680, 1.05); K.pill('SMOKING', 795, 900, 34, C.ink, C.white); });
        bigText('≈', 540, 700, 170, C.yellow, 0, pop(lt, li, 0.3));
        K.hrArrowPill('RISK', 540, 300, 56, -1, pop(lt, ri - 0.05, 0.3));
        K.pill('MAYO CLINIC · 13 STUDIES', 540, 1060, 46, C.ink, C.white, pop(lt, sm + 0.25, 0.3));
      } });
    cue(st, 'whoosh'); cue(st + ri - 0.05, 'pop', { gain: 0.55 }); cue(st + li, 'thud', { gain: 0.5 }); cue(st + sm - 0.05, 'pop', { gain: 0.6 }); cue(st + sm + 0.25, 'pop', { gain: 0.3 });
  }

  // ── 8 · ANSWER "An hour-plus: sixty to seventy-five minutes a day." ──
  {
    const st = Wd('an', 6) - 0.05, ho = Wd('hour-plus', 6) - st, si = Wd('sixty', 6) - st, se = Wd('seventy', 6) - st, mi = Wd('minutes', 6) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.06, note: 'ANSWER: the guess scale + A/B pills in the same spot (on screen at the cut); on "hour-plus" green check on B, A dims, an hourglass drops on the right pan and the scale levels out; COMMENT A OR B pill for ~1 s (not voiced, top of frame); sand runs on "sixty", 60-75 MIN pill on "seventy-five", MAYO CLINIC pill on "minutes"',
      draw(lt, d, t) {
        plain();
        const lv = eob(seg(lt, ho + 0.1, ho + 0.55));
        const hg = () => { if (lt > ho) { const dy = lerp(-500, 0, eo(seg(lt, ho, ho + 0.25))); K.sitHourglass(0, -100 + dy, 0.5, { fill: 0.15 + 0.7 * eio(seg(lt, si, d)), t }); } else qLoad(1)(); };
        K.sitScale(SC[0], SC[1], SCS, lerp(-0.26, 0, lv), { left: chairLoad, right: hg });
        pills2({ check: pop(lt, ho, 0.3), dim: seg(lt, ho, ho + 0.3), hiB: blip(lt, ho, 0.5) });
        K.pill('COMMENT A OR B', 540, 260, 34, C.ink, C.yellow, pop(lt, ho + 0.35, 0.25) * out(lt, ho + 1.35, 0.2));
        K.pill('60-75 MIN', 790, 260, 52, C.yellow, C.ink, pop(lt, se, 0.3));
        K.pill('MAYO CLINIC', 290, 260, 32, C.ink, C.white, pop(lt, mi, 0.3));
      } });
    cue(st, 'whoosh'); cue(st + ho, 'pop', { gain: 0.8 }); cue(st + ho + 0.25, 'thud', { gain: 0.5 }); cue(st + ho + 0.35, 'pop', { gain: 0.3 }); cue(st + si, 'sparkle', { dur: 1.0, gain: 0.3 }); cue(st + se, 'pop', { gain: 0.55 }); cue(st + mi, 'pop', { gain: 0.35 });
  }

  // ── 9 · "Mayo's tip: stand every thirty minutes." (office: he stands, a 30 MIN timer pings) ──
  {
    const st = cut(7), ma = Wd('mayo', 7) - st, sa = Wd('stand', 7) - st, th = Wd('thirty', 7) - st;
    const TX = 190, TY = 990;
    add({ id: 'S12', at: st, cam: [560, 760], zoom: 0.08, note: 'office (on screen at the cut), hero seated; MAYO\'S TIP pill on "Mayo\'s"; on "stand" he stands up out of the chair (smile) + yellow STAND up-arrow pill; a 30 MIN desk timer pings (rings) on "thirty"',
      draw(lt, d, t) {
        const up = eio(seg(lt, sa - 0.05, sa + 0.45));
        hookScene(t, { rise: up, hour: 13, from: -1, pills: 0, tag7: 0, face: { eyes: 'n', mouth: lt > sa ? 'smile' : 'flat', brow: 0.2 },
          });
        K.countdown(TX, TY, 0.28, 0.25, '30', pop(lt, th - 0.1, 0.3) * (1 + 0.1 * blip(lt, th, 0.3)), 'MIN', 150);
        K.sitPing(TX, TY, 90, seg(lt, th, th + 0.5)); K.sitPing(TX, TY, 90, seg(lt, th + 0.45, th + 0.95));
        K.pill("MAYO'S TIP", 560, 250, 52, C.ink, C.yellow, pop(lt, ma, 0.3));
        K.hrArrowPill('STAND', 200, 760, 46, -1, pop(lt, sa, 0.3));
      } });
    cue(st, 'whoosh'); cue(st + ma, 'pop', { gain: 0.55 }); cue(st + sa, 'slide', { dur: 0.4, gain: 0.35 }); cue(st + sa + 0.05, 'pop', { gain: 0.4 }); cue(st + th, 'pop', { gain: 0.6 }); cue(st + th + 0.45, 'pop', { gain: 0.4 });
  }

  // ── 10a · TEASE "Next Body File: wrinkly bath fingers," ──
  const badge = (x, y, sc, size = 46) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = Wd('next', 8) - 0.02, nx = Wd('next', 8) - st, bo = Wd('body', 8) - st, wr = Wd('wrinkly', 8) - st, ba = Wd('bath', 8) - st;
    add({ id: 'S13', at: st, cam: [540, 700], zoom: 0.07, note: 'tease (cut on "Next"): bath tub with bubbles, the hero\'s hand rising out of the water (on screen at the cut); yellow NEXT pill on "Next", BODY FILES badge on "Body"; fingertip wrinkles draw in on "wrinkly"; drops fall off on "bath"',
      draw(lt, d, t) {
        plain();
        ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 6; for (let x = 0; x <= W; x += 120) { ctx.beginPath(); ctx.moveTo(x, -300); ctx.lineTo(x, 960); ctx.stroke(); } for (let y = 0; y <= 960; y += 120) { ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(W + 300, y); ctx.stroke(); } ctx.restore();
        const tip = K.sitBathHand(540, 960, 0.95, { rise: lerp(0.55, 1, eo(seg(lt, 0, 0.6))), wrinkle: eio(seg(lt, wr, wr + 0.5)), t });
        if (lt > ba) for (let k = 0; k < 3; k++) { const u = ((lt - ba) * 1.4 + k / 3) % 1; K.drop(tip[0] - 90 + k * 70, tip[1] + 80 + u * 260, 0.45, Math.PI, 1 - u); }
        K.pill('NEXT', 540, 250, 64, C.yellow, C.ink, pop(lt, nx));
        badge(540, 1120, pop(lt, bo));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'bubbles', { dur: 0.8, gain: 0.3 }); cue(st + nx, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.45 }); cue(st + wr, 'sparkle', { dur: 0.5, gain: 0.35 }); cue(st + ba, 'plop', { gain: 0.4 });
  }
  // ── 10b · TEASE "your nerves' grip trick." (zoom into the fingertip) ──
  {
    const st = at('your', 8), ne = Wd('nerves', 8) - st, gr = Wd('grip', 8) - st, tr = Wd('trick', 8) - st;
    add({ id: 'S14', at: st, cam: [540, 660], zoom: 0.1, note: 'zoom into a new place: big lens on the wrinkly fingertip (on screen at the cut), NEXT pill + BODY FILES badge stay; a yellow signal runs along a pink nerve on "nerves\'"; a wet marble slides into the grooved pad on "grip"; yellow "?" on "trick" (keeps the answer for next time)',
      draw(lt, d, t) {
        plain();
        K.lens(540, 680, 290, enter(lt), () => K.sitGripLens(290, { wrinkle: 1, sig: lt > ne ? seg(lt, ne, ne + 0.6) : -1, grip: eo(seg(lt, gr, gr + 0.35)), t }), C.sky);
        K.pill('NEXT', 540, 250, 64, C.yellow, C.ink, 1);
        bigText('?', 860, 460, 140, C.yellow, 0.15, pop(lt, tr, 0.3));
        badge(540, 1120, 1);
      } });
    cue(st, 'whoosh'); cue(st + ne, 'zip', { gain: 0.4 }); cue(st + gr, 'slide', { dur: 0.35, gain: 0.35 }); cue(st + tr, 'boing', { gain: 0.4 });
  }

  // ── 11 · LOOP "Still sitting?" (drop back into the frame-1 chair; end card held still against the camera push) ──
  {
    const st = at('still', 8), Z = 0.13;
    add({ id: 'S15', at: st, cam: HOOK_CAM, zoom: Z, note: 'LOOP + END CARD: snap back to the frame-1 office (clock, 7+ HOURS, A/B pills, sticky note); hero drops from standing back into the chair and the clock comes round to 9, so the last frame = frame 1 (same camera scale); the monitor shows the next topic (wrinkly finger badge + NEXT pill); BODY FILES badge bottom left + FOLLOW bottom right (overlay held still)',
      draw(lt, d, t) {
        const dn = eo(seg(lt, 0, d));
        hookScene(t, { rise: lerp(1, 0.35, dn), hour: 17 + 4 * eio(seg(lt, 0, d)), from: -1,
          screen: (cx, cy, w, h) => { K.sitFingerBadge(cx - 72, cy + 4, 0.5, pop(lt, 0.05, 0.3)); K.pill('NEXT', cx + 76, cy, 28, C.yellow, C.ink, pop(lt, 0.12, 0.3)); } });
        const k = (1 + 0.13 * (1 - eo(clamp(lt / 0.32)))) * (1 + Z * eio(clamp(lt / d)));   // undo main.js camera for the overlay
        ctx.save(); ctx.translate(HOOK_CAM[0], HOOK_CAM[1]); ctx.scale(1 / k, 1 / k); ctx.translate(-HOOK_CAM[0], -HOOK_CAM[1]);
        badge(265, 1115, pop(lt, 0.05, 0.3), 36);
        K.followPill(835, 1115, pop(lt, 0.3), t, 40);
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + 0.3, 'pop', { gain: 0.55 }); cue(st + 1.0, 'thud', { gain: 0.35 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES, loop: true };
}
