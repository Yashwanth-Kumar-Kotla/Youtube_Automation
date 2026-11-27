// WHAT HAPPENS WHEN YOUR MUSCLES GET SORE DAYS LATER?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): x-ray film, the x-ray hero frozen mid-curl (rope-fibre biceps), a lit fuse from the
// dumbbell up to a "1-3 DAYS" tag, A LIFTING / B LOWERING pills. Scene clock: the last shot draws with t - T_LAST, so the last
// frame = frame 0 (breathing, spark flicker) apart from the end-card badges.
// Cuts sit on caption-chunk starts (word start - 0.05) so no caption runs past a cut.
// Guess (S03): two panels (curl up vs lower down) + A / B pills. Re-hook (S07): new scene, full-screen fibre macro, hard push
// into a nick. Answer (S10): same panels, check on B LOWERING, lunge + downhill icons. Rewatch: "~1 HOUR" + source fine print.
// Tease (S12, from "Next"): recorded voice on a phone + skull bass lens. Loop (S13, from "bass"): back to the frame-1 picture.
import { ctx, C, W, H, TAU, clamp, lerp, seg, eo, eio, eob, line, bigText, rr, circle } from './core/lib.js';
import { T, Wd } from './core/timing.js';
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
  const T_LAST = (Math.ceil(T.dur * 30 - 1e-6) - 1) / 30;   // time of the film's last rendered frame

  // curl poses (right arm): bottom / mid (forearm out) / top
  const CURL = { bot: { e: [176, 4], h: [186, 150] }, mid: { e: [182, 4], h: [325, -30] }, top: { e: [186, 0], h: [228, -142] } };
  const curlAt = (u) => (u < 0.5 ? K.armPose(CURL.bot, CURL.mid, u * 2) : K.armPose(CURL.mid, CURL.top, (u - 0.5) * 2));
  const handAng = (p) => Math.atan2(p.h[1] - p.e[1], p.h[0] - p.e[0]);
  // a man() with a dumbbell in the right hand (dumbbell across the fist, perpendicular to the forearm). Returns the
  // dumbbell's top end in screen px (fuse anchor)
  const curler = (o, pose, { light = false, ds = 0.62 } = {}) => {
    K.man({ ...o, arm: pose });
    const s = o.s, hx = o.x + pose.h[0] * s, hy = o.y + pose.h[1] * s, rot = handAng(pose) - Math.PI / 2;
    return K.smDumbbell(hx, hy, ds * s / 0.74, { rot, light });
  };

  // ── the hook set: x-ray hero mid-curl, lit fuse, pills (frame 1 + loop) ──
  const HX = 380, HY = 690, HS = 0.74, HOOK_CAM = [540, 760];
  const PA = [800, 900], PB = [800, 1010], PS = 42;
  const hookScene = (t, { ring = 0, zap = 0, flare = 0, eyes = 'n' } = {}) => {
    K.xray(t);
    const br = Math.sin(t * 2.4) * 5;
    const pose = CURL.mid;
    const top = curler({ x: HX, y: HY + br, s: HS, xray: true, eyes, mouth: 'flat', brow: 0.5, look: 0.6, armL: K.ARM.down }, pose, { light: true });
    const sh = [HX + 140 * HS, HY + br - 170 * HS], el = [HX + pose.e[0] * HS, HY + br + pose.e[1] * HS];
    K.smBicep(sh[0], sh[1], el[0], el[1], { w: 92, bulge: 0.9 });
    K.hiRing(lerp(sh[0], el[0], 0.5) + 4, lerp(sh[1], el[1], 0.5), 62, 80, ring);
    K.painZap(lerp(sh[0], el[0], 0.5) + 40, lerp(sh[1], el[1], 0.5) - 20, 0.6, zap, t, [-1.9, -1.0, -0.2, 0.6]);
    const fuse = []; for (let i = 0; i <= 18; i++) { const u = i / 18; fuse.push([top[0] + 200 * u, top[1] - 105 * Math.sin(u * Math.PI * 0.5) + 28 * Math.sin(u * Math.PI * 2)]); }
    K.smFuse(fuse, t, { spark: 1 + 0.6 * flare });
    return fuse[fuse.length - 1];
  };
  const hookTags = (sp, sc) => {
    K.pill('1-3 DAYS', sp[0] + 30, sp[1] - 95, 46, C.ink, C.yellow, sc);
  };
  const hookPills = (sc) => { K.abPill('A', 'LIFTING', PA[0], PA[1], PS, { sc }); K.abPill('B', 'LOWERING', PB[0], PB[1], PS, { sc }); };

  // ── 1 · HOOK "What happens when your muscles get sore days later?" ──
  {
    const mu = Wd('muscles', 0), so = Wd('sore', 0), la = Wd('later', 0);
    add({ id: 'S01', at: 0, cam: HOOK_CAM, zoom: 0.05, note: 'FRAME 1 = hook: x-ray film, the x-ray hero frozen mid-curl (rope-fibre cyan biceps), dumbbell with a lit fuse up to a "1-3 DAYS" tag, A LIFTING / B LOWERING pills, all from frame 0; yellow ring on the biceps on "muscles"; red pain zap on "sore"; spark flares on "later"',
      draw(lt, d, t) {
        const sp = hookScene(t, { ring: blip(lt, mu, 0.5), zap: blip(lt, so, 0.5), flare: blip(lt, la, 0.4), eyes: lt > so && lt < so + 0.45 ? 'squeeze' : 'n' });
        hookTags(sp, 1); hookPills(1);
      } });
    cue(0.0, 'sizzle', { dur: 0.6, gain: 0.2 }); cue(mu, 'pop', { gain: 0.45 }); cue(so, 'zip', { gain: 0.45 }); cue(la, 'sizzle', { dur: 0.4, gain: 0.3 });
  }

  // ── 2a · "It hits one to three days in." (calendar + fuse burning along the top) ──
  {
    const st = at('it', 1), hi = Wd('hits', 1) - st, on = Wd('one', 1) - st, to = Wd('to', 1) - st, th = Wd('three', 1) - st, da = Wd('days', 1) - st, inn = Wd('in.', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.08, note: 'calendar card "1 DAYS"→"2"→"3" (on screen at the cut) with a lit fuse burning along above it; number bounces on "one", flips to 2 on "to", 3 on "three"; yellow "1-3 DAYS" pill on "days"; red pain zap + ring on the card on "in"',
      draw(lt, d, t) {
        plain();
        const big = lt > th ? '3' : lt > to ? '2' : '1';
        const bo = 1 + 0.08 * (blip(lt, on, 0.25) + blip(lt, to, 0.25) + blip(lt, th, 0.25));
        ctx.save(); ctx.translate(540, 700); ctx.scale(bo * enter(lt), bo * enter(lt)); K.calendar(0, 0, 0.8, big, big === '1' ? 'DAY' : 'DAYS'); ctx.restore();
        const sx = lerp(900, 200, eio(seg(lt, 0, d)));
        K.smFuse([[150, 300], [sx, 300]], t, { spark: 1 });
        K.pill('1-3 DAYS', 540, 1105, 52, C.yellow, C.ink, pop(lt, da));
        K.hiRing(540, 760, 250, 200, pop(lt, inn, 0.25) * 0.9);
        K.painZap(800, 480, 0.9, pop(lt, inn, 0.2), t);
        void hi;
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'sizzle', { dur: 1.2, gain: 0.2 }); cue(st + on, 'tock', { gain: 0.45 }); cue(st + to, 'tock', { gain: 0.45 }); cue(st + th, 'tock', { gain: 0.5 }); cue(st + da, 'pop', { gain: 0.55 }); cue(st + inn, 'zip', { gain: 0.5 });
  }

  // ── guess / answer panels (S03, S10) ──
  const PY0 = 250, PY1 = 700, GA = [310, 790], GB = [770, 790], GS = 40;
  const panel = (x0, x1, fn) => {
    ctx.save(); rr(x0, PY0, x1 - x0, PY1 - PY0, 30); ctx.clip(); fn(); ctx.restore();
    rr(x0, PY0, x1 - x0, PY1 - PY0, 30); ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.stroke();
  };
  const bigArrow = (x, y, dir, a = 1) => {   // yellow arrow (ink edge), dir -1 = up, 1 = down
    if (a <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(1, -dir); ctx.globalAlpha = clamp(a);
    const P = [[-22, 70], [-22, -10], [-52, -10], [0, -76], [52, -10], [22, -10], [22, 70]];
    ctx.beginPath(); P.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.closePath();
    ctx.lineJoin = 'round'; ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.fillStyle = C.yellow; ctx.fill();
    ctx.restore();
  };
  const panels = (t, { dimA = 0, hiB = 0, slowB = 0 } = {}) => {
    plain();
    panel(90, 530, () => {
      ctx.fillStyle = '#E9E3D6'; ctx.fillRect(90, PY0, 440, PY1 - PY0);
      const u = (t * 0.9) % 1, k = u < 0.4 ? eio(u / 0.4) : 1 - eio((u - 0.4) / 0.6);   // quick lift, slow return
      curler({ x: 255, y: 560, s: 0.46, mouth: 'flat', brow: 0.4, look: 0.5 }, curlAt(k), { ds: 0.62 });
      bigArrow(460, 470, -1, 1 - 0.6 * clamp(dimA));
      if (dimA > 0) { ctx.save(); ctx.globalAlpha = 0.4 * clamp(dimA); ctx.fillStyle = C.bg; ctx.fillRect(90, PY0, 440, PY1 - PY0); ctx.restore(); }
    });
    panel(550, 990, () => {
      ctx.fillStyle = '#E9E3D6'; ctx.fillRect(550, PY0, 440, PY1 - PY0);
      const u = (t * (0.6 - 0.25 * clamp(slowB))) % 1, k = u < 0.25 ? eio(u / 0.25) : 1 - eio((u - 0.25) / 0.75);   // quick lift, long slow lowering
      curler({ x: 715, y: 560, s: 0.46, mouth: 'flat', brow: 0.6, look: 0.5, frown: true }, curlAt(k), { ds: 0.62 });
      bigArrow(920, 470, 1, 1);
      if (hiB > 0) { ctx.save(); ctx.globalAlpha = 0.3 * clamp(hiB); ctx.fillStyle = C.yellow; ctx.fillRect(550, PY0, 440, PY1 - PY0); ctx.restore(); }
    });
  };

  // ── 2b · GUESS "Blame lifting, or lowering?" ──
  {
    const st = at('blame', 1), bl = Wd('blame', 1) - st, li = Wd('lifting', 1) - st, lo = Wd('lowering', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 600], zoom: 0.07, note: 'GUESS: two panels on screen at the cut, the hero curling a dumbbell up fast (yellow up arrow, left) and lowering it slowly (down arrow, right); big yellow "?" on "Blame"; pill A LIFTING pops on "lifting", B LOWERING on "lowering" (under their panels)',
      draw(lt, d, t) {
        panels(t);
        bigText('?', 540, 1010, 190 * pop(lt, bl), C.yellow, 0.1);
        K.abPill('A', 'LIFTING', GA[0], GA[1], GS, { sc: pop(lt, li), hi: blip(lt, li, 0.4) });
        K.abPill('B', 'LOWERING', GB[0], GB[1], GS, { sc: pop(lt, lo), hi: blip(lt, lo, 0.4) });
      } });
    cue(st, 'whoosh'); cue(st + bl, 'boing', { gain: 0.4 }); cue(st + li, 'pop', { gain: 0.65 }); cue(st + lo, 'pop', { gain: 0.65 });
  }

  // ── 3 · "Forget lactic acid. It's gone in about an hour." (myth busted, the bottle drains, stopwatch) ──
  {
    const st = at('forget', 2), fo = Wd('forget', 2) - st, ac = Wd('acid', 2) - st, go = Wd('gone', 2) - st, ho = Wd('hour', 2) - st;
    add({ id: 'S04', at: st, cam: [540, 660], zoom: 0.08, note: 'a lab bottle labelled LACTIC ACID (on screen at the cut) + stopwatch; red X slams over the bottle on "Forget" (fades on "gone"); bottle bounces on "acid"; from "gone" the liquid drains while the stopwatch hand sweeps a full turn, landing on "hour" with a yellow "~1 HOUR" pill + fine print "Houston Methodist" (rewatch detail)',
      draw(lt, d, t) {
        plain();
        const lv = 1 - eio(seg(lt, go, ho + 0.3));
        K.smAcidBottle(320, 690, 1.05 * (1 + 0.06 * blip(lt, ac, 0.3)), { level: lv, t, sc: enter(lt) });
        if (lt > fo) K.redX(455, 420, lerp(0.6, 0.3, eo(seg(lt, fo, fo + 0.2))), out(lt, go, 0.3), 0.9);
        K.stopwatch(800, 640, 0.6 * enter(lt), TAU * eio(seg(lt, go, ho + 0.1)));
        K.pill('~1 HOUR', 800, 940, 54, C.yellow, C.ink, pop(lt, ho));
        K.pill('Houston Methodist', 800, 1030, 26, C.ink, C.white, pop(lt, ho + 0.15));
      } });
    cue(st, 'whoosh'); cue(st + fo, 'slam', { gain: 0.55 }); cue(st + ac, 'boing', { gain: 0.3 }); cue(st + go, 'bubbles', { dur: ho - go + 0.3, gain: 0.25 }); cue(st + go, 'tock', { gain: 0.3 }); cue(st + ho, 'pop', { gain: 0.65 });
  }

  // ── 4 · "The real culprit? Tiny tears in your muscle fibers." (x-ray lens on the fibres) ──
  {
    const st = at('the', 3), cu = Wd('culprit', 3) - st, ti = Wd('tiny', 3) - st, te = Wd('tears', 3) - st, mu = Wd('muscle', 3) - st, fi = Wd('fibers', 3) - st;
    const LX = 540, LY = 650, LR = 380, NICKS = [[0.32, 1], [0.64, 2], [0.45, 3]];
    add({ id: 'S05', at: st, cam: [540, 650], zoom: 0.12, note: 'x-ray lens on plain paper: rope-like cyan muscle fibres (on screen at the cut); lens jolts + shock lines on "culprit"; three tiny schematic nicks open on "Tiny" (no gore); yellow rings on the nicks on "tears"; MUSCLE pill on "muscle"; strands flash + FIBERS tag on "fibers"',
      draw(lt, d, t) {
        plain();
        const jx = Math.sin(lt * 60) * 8 * blip(lt, cu, 0.3);
        K.lens(LX + jx, LY, LR, enter(lt), () => {
          ctx.fillStyle = C.navy; ctx.fillRect(-LR - 10, -LR - 10, 2 * LR + 20, 2 * LR + 20);
          K.smFibers(0, 0, 820, 720, { n: 5, nicks: NICKS, tear: eob(seg(lt, ti - 0.05, ti + 0.25)), ring: pop(lt, te, 0.25), t });
          if (lt > fi) { ctx.save(); ctx.globalAlpha = 0.35 * blip(lt, fi, 0.5); ctx.fillStyle = C.cyan; ctx.fillRect(-LR, -LR, 2 * LR, 2 * LR); ctx.restore(); }
        }, C.navy);
        K.shockLines(LX, LY - LR - 30, 120, blip(lt, cu, 0.5));
        K.pill('MUSCLE', 540, 175, 48, C.ink, C.white, pop(lt, mu));
        K.tag('FIBERS', 830, 1110, 760, 860, 44, pop(lt, fi));
      } });
    cue(st, 'whoosh'); cue(st + cu, 'slam', { gain: 0.4 }); cue(st + ti, 'zip', { gain: 0.4 }); cue(st + te, 'pop', { gain: 0.6 }); cue(st + mu, 'pop', { gain: 0.4 }); cue(st + fi, 'pop', { gain: 0.5 });
  }

  // ── 5 · RELATABLE "Ever needed the handrail after leg day?" (hero gripping the stair rail) ──
  {
    const st = at('ever', 4), ne = Wd('needed', 4) - st, ha = Wd('handrail', 4) - st, le = Wd('leg', 4) - st, da = Wd('day', 4) - st;
    const X = 405, S1 = 0.62, TREAD = 850, Y = TREAD - 620 * S1;
    add({ id: 'S06', at: st, cam: [440, 700], zoom: 0.06, note: 'side-view staircase with a wooden handrail, the hero standing on a step (on screen at the cut); on "needed" he grabs the rail; rail flashes yellow on "handrail"; red pain zaps on both thighs + wince on "leg"; knees wobble from "leg"; sweat drop on "day"',
      draw(lt, d, t) {
        plain();
        const sts = K.smStairs(60, 760, 230, 90, 4, 1160, { railH: 507, hi: blip(lt, ha, 0.5) });
        const g = eio(seg(lt, ne - 0.1, ne + 0.2));
        const hx = 595, hy = sts.rail(hx) - 14;
        const grab = { e: [250, -110], h: [(hx - X) / S1 + 34, (hy - Y) / S1 + 14] };
        const wob = lt > le ? Math.sin(lt * 34) * 5 : 0, hurt = lt > le;
        K.man({ x: X + wob, y: Y, s: S1, arm: K.armPose(K.ARM.down, grab, g), eyes: hurt ? 'squeeze' : 'n', mouth: hurt ? 'flat' : 'smile', brow: hurt ? 0.9 : 0.3, frown: hurt, sweat: pop(lt, da, 0.25) });
        for (const sd of [-1, 1]) K.painZap(X + wob + sd * 70 * S1, Y + 320 * S1, 0.55, pop(lt, le, 0.25), t, sd < 0 ? [-2.6, -3.3, 2.6] : [-0.5, 0.2, 0.9]);
      } });
    cue(st, 'whoosh'); cue(st + ne, 'thud', { gain: 0.4 }); cue(st + ha, 'pop', { gain: 0.5 }); cue(st + le, 'zip', { gain: 0.5 }); cue(st + da, 'boing', { gain: 0.3 });
  }

  // ── 6a · RE-HOOK "But here's the twist: the tears get inflamed," (new scene: full-screen fibre macro, hard push) ──
  {
    const st = at('but', 5), tw = Wd('twist', 5) - st, te = Wd('tears', 5) - st, inf = Wd('inflamed', 5) - st;
    const NICKS = [[0.5, 1], [0.38, 2], [0.66, 2]];
    add({ id: 'S07', at: st, cam: [560, 640], zoom: 0.28, note: 'RE-HOOK, new scene: the fibres macro fills the screen (huge cyan rope strands with the nicks, on screen at the cut), camera pushing hard into the nicks; strands jolt + shock lines on "twist"; yellow rings on the nicks on "tears"; flat red/pink swelling blobs bloom round every nick from "inflamed"',
      draw(lt, d, t) {
        ctx.fillStyle = C.navy; ctx.fillRect(-300, -300, W + 600, H + 600);
        const jo = Math.sin(lt * 50) * 10 * blip(lt, tw, 0.35);
        K.smFibers(540, 640 + jo, 1500, 1000, { n: 4, nicks: NICKS, tear: 1, ring: pop(lt, te, 0.25) * out(lt, inf + 0.3), inflame: eo(seg(lt, inf - 0.05, d)), t });
        K.shockLines(560, 640, 330, blip(lt, tw, 0.5));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.55 }); cue(st + te, 'pop', { gain: 0.5 }); cue(st + inf, 'sizzle', { dur: at('and', 5) - st - inf, gain: 0.3 });
  }

  // ── 6b · "and the ache builds for hours." (clock spins hours, ache meter fills) ──
  {
    const st = at('and', 5), ac = Wd('ache', 5) - st, bu = Wd('builds', 5) - st, ho = Wd('hours', 5) - st;
    add({ id: 'S08', at: st, cam: [540, 650], zoom: 0.08, note: 'wall clock + ache meter (both on screen at the cut); the meter bounces on "ache"; from "builds" the clock hands spin hours forward (blue wedge = time passed) while the red ACHE bar fills; clock bounces + yellow ring on "hours"',
      draw(lt, d, t) {
        plain();
        const sp = eio(seg(lt, bu - 0.1, d));
        K.wallClock(540, 560, 250, { hour: lerp(0, 10, sp), from: 0, sc: enter(lt) * (1 + 0.06 * blip(lt, ho, 0.3)) });
        K.hiRing(540, 560, 300, 300, pop(lt, ho, 0.25) * 0.9);
        K.smAcheMeter(600, 1000, 560, lerp(0.08, 0.92, sp), enter(lt) * (1 + 0.08 * blip(lt, ac, 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + ac, 'pop', { gain: 0.4 }); cue(st + bu, 'slide', { dur: at("it's", 6) - st - bu, gain: 0.3 }); cue(st + bu + 0.2, 'tock', { gain: 0.3 }); cue(st + bu + 0.6, 'tock', { gain: 0.3 }); cue(st + ho, 'pop', { gain: 0.55 });
  }

  // ── 7 · "It's usually a new workout, or a harder one." (NEW sticker, heavier plates) ──
  {
    const st = at("it's", 6), us = Wd('usually', 6) - st, nw = Wd('new', 6) - st, ha = Wd('harder', 6) - st;
    const X = 280, S1 = 0.62, Y = 1150 - 620 * S1;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.08, note: 'the hero standing beside a big dumbbell on the floor (both on screen at the cut); he points at it on "usually"; yellow NEW star slaps on above it on "new"; on "harder" a bigger plate slams onto each end (burst, thud) and the hero goes wide-eyed',
      draw(lt, d, t) {
        plain();
        ctx.fillStyle = C.floor; ctx.fillRect(-300, 1150, W + 600, 10);
        const ex = eob(seg(lt, ha, ha + 0.25)), hard = lt > ha;
        K.burst(770, 1060, 2.2, blip(lt, ha + 0.1, 0.4));
        K.smDumbbell(770, 1082, 1.15, { plates: hard ? 2 : 1, extra: ex });
        K.popStar(770, 820, 0.55, pop(lt, nw, 0.3), t, 'NEW');
        const p = eio(seg(lt, us - 0.1, us + 0.2));
        K.man({ x: X, y: Y, s: S1, arm: K.armPose(K.ARM.down, { e: [250, -30], h: [400, -60] }, p), finger: p > 0.5 ? 1.4 : null, eyes: hard ? 'wide' : 'n', mouth: hard ? 'o' : 'smile', brow: hard ? 1 : 0.3, look: 0.7 });
      } });
    cue(st, 'whoosh'); cue(st + us, 'slide', { dur: 0.25, gain: 0.25 }); cue(st + nw, 'pop', { gain: 0.65 }); cue(st + ha, 'slam', { gain: 0.55 }); cue(st + ha + 0.1, 'thud', { gain: 0.6 });
  }

  // ── 8 · ANSWER "Answer: lowering. Lunges and downhill runs too." ──
  {
    const st = at('answer', 7), an = Wd('answer', 7) - st, lo = Wd('lowering', 7) - st, lu = Wd('lunges', 7) - st, dh = Wd('downhill', 7) - st, ru = Wd('runs', 7) - st;
    add({ id: 'S10', at: st, cam: [540, 650], zoom: 0.06, note: 'ANSWER: the guess panels + A / B pills in the same spots (on screen at the cut); B panel glows on "Answer"; on "lowering" the check lands on B LOWERING, A dims, the B curl slows; COMMENT A OR B pill ~1.1 s (not voiced, top); lunge icon pops on "Lunges", downhill runner on "downhill"',
      draw(lt, d, t) {
        panels(t, { dimA: seg(lt, lo, lo + 0.3), hiB: blip(lt, an, 0.4) + blip(lt, lo, 0.5), slowB: seg(lt, lo, lo + 0.3) });
        K.abPill('A', 'LIFTING', GA[0], GA[1], GS, { sc: 1, dim: seg(lt, lo, lo + 0.3) });
        K.abPill('B', 'LOWERING', GB[0], GB[1], GS, { sc: 1, check: pop(lt, lo, 0.3), hi: blip(lt, lo, 0.45) });
        K.pill('COMMENT A OR B', 540, 160, 44, C.ink, C.yellow, pop(lt, lo + 0.3, 0.25) * out(lt, lo + 1.45, 0.2));
        K.smLungeIcon(300, 1150, 0.62, { dip: 0.5 + 0.5 * Math.sin(t * 5), sc: pop(lt, lu) });
        K.smDownhill(780, 1060, 0.62, { t, sc: pop(lt, dh) });
        void ru;
      } });
    cue(st, 'whoosh'); cue(st + an, 'tock', { gain: 0.4 }); cue(st + lo, 'pop', { gain: 0.8 }); cue(st + lo + 0.3, 'pop', { gain: 0.3 }); cue(st + lu, 'pop', { gain: 0.5 }); cue(st + dh, 'pop', { gain: 0.5 }); cue(st + dh + 0.1, 'slide', { dur: 0.5, gain: 0.25 });
  }

  // ── 9 · SAFETY "Dark pee, or sore past a week? Get help fast." (calm) ──
  {
    const st = at('dark', 8), dk = Wd('dark', 8) - st, so = Wd('sore', 8) - st, pa = Wd('past', 8) - st, wk = Wd('week', 8) - st, he = Wd('help', 8) - st, fa = Wd('fast', 8) - st;
    add({ id: 'S11', at: st, cam: [540, 660], zoom: 0.06, note: 'calm safety card: pee-colour chart (on screen at the cut), red pointer + ring on the darkest swatch on "Dark"; a 7 DAYS calendar page pops on "past", bounces on "week"; doctor badge pops on "help", small bounce on "fast"',
      draw(lt, d, t) {
        plain();
        K.hbPeeCard(540, 420, 1.15 * enter(lt), { pick: eo(seg(lt, dk, dk + 0.3)) });
        const cs = pop(lt, pa) * (1 + 0.06 * blip(lt, wk, 0.3));
        if (cs > 0) K.calendar(300, 860, 0.42 * cs, '7', 'DAYS');
        K.doctorBadge(780, 860, 1.0, pop(lt, he) * (1 + 0.08 * blip(lt, fa, 0.3)));
        void so;
      } });
    cue(st, 'whoosh'); cue(st + dk, 'pop', { gain: 0.45 }); cue(st + pa, 'tock', { gain: 0.4 }); cue(st + he, 'pop', { gain: 0.55 });
  }

  // ── 10a · TEASE "Next Body File: your recorded voice and your skull's" (starts on "Next") ──
  const badge = (x, y, sc, size = 44) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = at('next', 9), bo = Wd('body', 9) - st, re = Wd('recorded', 9) - st, vo = Wd('voice', 9) - st, sk = Wd("skull's", 9) - st;
    add({ id: 'S12', at: st, cam: [540, 640], zoom: 0.08, note: 'tease (cut on "Next"): the hero\'s head + a phone, yellow NEXT pill at lt 0.03; BODY FILES badge on "Body"; red REC dot + sound waves from the phone on "recorded"; the hero cringes on "voice"; an x-ray lens with a skull and deep bass waves pops on "skull\'s"',
      draw(lt, d, t) {
        plain();
        const cr = lt > vo;
        K.heroHead(300, 720, 1.1 * enter(lt), { eyes: cr ? 'squeeze' : 'n', mouth: cr ? 'wavy' : 'smile', brow: cr ? 0.9 : 0.3, frown: cr, look: 1 });
        K.phoneSmall(760, 560, 0.6 * enter(lt), -0.1);
        if (lt > re) { circle(838, 395, 22 * pop(lt, re, 0.2) * (0.85 + 0.15 * Math.sin(t * 9)), C.red); }
        K.soundWaves(640, 600, Math.PI, t, seg(lt, re, re + 0.2), 0, 1);
        K.lens(740, 975, 150, pop(lt, sk), () => {
          ctx.fillStyle = C.navy; ctx.fillRect(-170, -170, 340, 340);
          K.skull(15, 0, 0.36);
          for (let k = 0; k < 3; k++) { const u = (t * 1.2 + k / 3) % 1; ctx.save(); ctx.globalAlpha = 0.6 * (1 - u); ctx.beginPath(); ctx.arc(10, 10, 40 + u * 110, 0, TAU); ctx.strokeStyle = C.cyan; ctx.lineWidth = 8; ctx.stroke(); ctx.restore(); }
        }, C.navy);
        K.pill('NEXT', 540, 170, 64, C.yellow, C.ink, pop(lt, 0.03, 0.25));
        badge(540, 290, pop(lt, bo));
      } });
    cue(st, 'whoosh'); cue(st + 0.03, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.4 }); cue(st + re, 'pop', { gain: 0.45 }); cue(st + vo, 'boing', { gain: 0.35 }); cue(st + sk, 'pop', { gain: 0.55 }); cue(st + sk + 0.1, 'thud', { gain: 0.35 });
  }

  // ── 10b · LOOP "bass." (back to the exact frame-1 picture) + end card ──
  {
    const st = at('bass', 9), Z = 0;
    add({ id: 'S13', at: st, cam: HOOK_CAM, zoom: Z, note: 'LOOP + END CARD: the frame-1 x-ray curl (hero, fuse, 1-3 DAYS tag, A / B pills all on screen at the cut, scene clock t - T_LAST so the last frame = frame 1, no push); end card from ~0.35 s: voice badge + NEXT top right, BODY FILES + FOLLOW top left',
      draw(lt, d, t) {
        const tl = t - T_LAST;
        const sp = hookScene(tl);
        hookTags(sp, 1); hookPills(1);
        const k = (1 + 0.13 * (1 - eo(clamp(lt / 0.32)))) * (1 + Z * eio(clamp(lt / d)));
        ctx.save(); ctx.translate(HOOK_CAM[0], HOOK_CAM[1]); ctx.scale(1 / k, 1 / k); ctx.translate(-HOOK_CAM[0], -HOOK_CAM[1]);
        K.smVoiceBadge(900, 150, 0.52, pop(lt, 0.35, 0.3));
        K.pill('NEXT', 900, 272, 36, C.yellow, C.ink, pop(lt, 0.4, 0.3));
        badge(220, 140, pop(lt, 0.35, 0.3), 34);
        K.followPill(220, 235, pop(lt, 0.55), t, 38);
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + 0.35, 'pop', { gain: 0.4 }); cue(st + 0.55, 'pop', { gain: 0.5 }); cue(st + 0.1, 'sizzle', { dur: 0.6, gain: 0.2 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES, loop: true };
}
