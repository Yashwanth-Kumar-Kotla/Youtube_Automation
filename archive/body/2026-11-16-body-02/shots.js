// WHAT HAPPENS WHEN YOU DRINK AN ENERGY DRINK?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Timeline format. THE frame (frame 1 + answer + loop end): x-ray hero on the x-ray film holding a plain unbranded can
// (K.energyCan, tiny "per 16 fl oz · FDA" label), 24 yellow caffeine dots (K.caffeineDot) in his body, the corner clock
// (K.elapsedClock) top right that jumps 0:00 → 0:15 → 0:45 → 5:00 exactly on the spoken times, and the guess pills
// (K.optionPill "A A QUARTER" / "B HALF"). Other scenes: two cans 54 vs 328 mg (plain), K.receptorLens (adenosine blocked),
// night bedroom + thought bubble of a late drive, inside the blood (re-hook), jittery hero in THE room, FDA 400 mg card,
// kids & teens + can with a red X (nobody drinks), tease K.breathBadge (hero never holds his breath).
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, line, rr } from './core/lib.js';
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
  const scaled = (x, y, k, fn) => { if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); fn(); ctx.restore(); };

  // ── THE frame: hero, can, dots, clock, pills ──
  const HERO = { x: 560, y: 1010, s: 1.1 };
  const SIP = { e: [230, -40], h: [80, -250] };     // can tipped to the mouth (mid-sip)
  const HOLD = { e: [215, 30], h: [170, -40] };     // can held upright at chest height
  /** x-ray hero; sip 0..1 (1 = can at the mouth) */
  const hero = (sip, o = {}) => {
    const p = 1 - clamp(sip), arm = K.armPose(SIP, HOLD, p);
    const cx = arm.h[0] + lerp(-10, -4, p), cy = arm.h[1] + lerp(13, -40, p), rot = lerp(-1.1, 0, p);
    K.man({ ...HERO, xray: true, arm, holding: () => K.energyCan(cx, cy, 0.42, { rot }), ...o });
  };
  // dot destinations (hero local coords): 0-15 torso, 16-23 first in the belly, later out into the left arm and upper chest
  const DT = [], DB = [], DL = [];
  for (let i = 0; i < 24; i++) {
    DT.push([lerp(-108, 108, rnd(i + 1)), lerp(-150, 170, rnd(i + 31))]);
    DB.push([lerp(-80, 90, rnd(i + 61)), lerp(-10, 150, rnd(i + 71))]);
    DL.push(i % 2 ? [-186 + (rnd(i + 81) - 0.5) * 16, lerp(-140, 110, rnd(i + 91))] : [lerp(-120, 120, rnd(i + 81)), lerp(-175, -130, rnd(i + 91))]);
  }
  const dest = (i, legs) => (i < 16 ? DT[i] : [lerp(DB[i][0], DL[i][0], legs), lerp(DB[i][1], DL[i][1], legs)]);
  const PATH = [[0, -262], [0, -200], [14, 20]];
  const dotLocal = (i, u, legs) => {
    const P = [...PATH, dest(i, legs)], wts = [0.15, 0.35, 0.5];
    let k = clamp(u), j = 0;
    while (j < 2 && k > wts[j]) { k -= wts[j]; j++; }
    const f = clamp(k / wts[j]);
    return [lerp(P[j][0], P[j + 1][0], f), lerp(P[j][1], P[j + 1][1], f)];
  };
  /** draw the dots. u(i) = travel 0..1 (mouth → spot), a(i) = alpha, legs 0..1 = dots 16-23 moved out to the thighs */
  const dots = (t, u, a = () => 1, legs = 0) => {
    for (let i = 0; i < 24; i++) {
      const ui = u(i); if (ui <= 0) continue;
      const [lx, ly] = dotLocal(i, ui, legs), wob = ui >= 1 ? 1 : 0;
      K.caffeineDot(HERO.x + (lx + Math.sin(t * 2.2 + i) * 6 * wob) * HERO.s, HERO.y + (ly + Math.cos(t * 1.9 + i * 1.7) * 6 * wob) * HERO.s, 15 * HERO.s, a(i));
    }
  };
  const CLK = [870, 130, 0.85];
  const clock = (lt, from, to, jump) => {
    const on = lt > jump;
    K.elapsedClock(CLK[0], CLK[1], CLK[2], on ? to : from, { flash: on ? 1 - seg(lt, jump + 0.25, jump + 0.7) : 0 });
  };
  const PA = [110, 250], PB = [110, 392], PS = 60;
  const pills = ({ a = 1, b = 1, check = 0, dimA = 0, bumpB = 1 } = {}) => {
    K.optionPill('A', 'A QUARTER', PA[0], PA[1], PS, { sc: a, dim: dimA, left: true });
    K.optionPill('B', 'HALF', PB[0], PB[1], PS, { sc: b * bumpB, check, left: true });
  };
  const ffwd = (x, y, a) => {   // fast-forward chevrons (yellow, ink rim)
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = clamp(a); ctx.lineJoin = 'round';
    for (const dx of [0, 52]) { ctx.beginPath(); ctx.moveTo(x + dx, y - 40); ctx.lineTo(x + dx + 50, y); ctx.lineTo(x + dx, y + 40); ctx.closePath();
      ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.fillStyle = C.yellow; ctx.fill(); }
    ctx.restore();
  };
  const headAt = () => [HERO.x, HERO.y - 350 * HERO.s];

  // ── 1 · HOOK: mid-sip, caffeine dots pour into the x-ray body; clock 0:00 ──
  {
    const st = cut(0), dr = Wd('drink', 0) - st, en = Wd('energy', 0) - st;
    add({ id: 'S01', at: st, cam: [560, 760], zoom: 0.07, note: 'FRAME 1: x-ray hero mid-sip of a plain navy can (no logo), yellow caffeine dots stream from the mouth down the throat and spread through the torso; clock 0:00 top right; gulp bob on "drink"; eyes snap wide + shock lines on "energy"',
      draw(lt, d, t) {
        K.xray(t);
        const gulp = lt > dr ? Math.sin(seg(lt, dr, dr + 0.3) * Math.PI) * 10 : 0;
        ctx.save(); ctx.translate(0, gulp);
        hero(1, { eyes: lt > en ? 'wide' : 'closed', mouth: 'o', brow: lt > en ? 1 : 0.4 });
        ctx.restore();
        dots(t, (i) => (lt + 1.1 - i * 0.075) / 1.0);
        const [hx, hy] = headAt();
        K.shockLines(hx, hy - 20, 200, lt > en ? clamp((lt - en) * 5) : 0);
        K.elapsedClock(CLK[0], CLK[1], CLK[2], 0);
      } });
    cue(st + 0.05, 'gulp', { gain: 0.4 }); cue(st + 0.3, 'slide', { dur: 1.2, gain: 0.3 }); cue(st + dr, 'gulp', { gain: 0.6 }); cue(st + en, 'pop', { gain: 0.6 });
  }

  // ── 2 · "Five hours later": can comes down, fast-forward chevrons by the clock ──
  {
    const st = cut(1), fv = Wd('five', 1) - st, la = Wd('later', 1) - st;
    add({ id: 'S02', at: st, cam: [760, 420], zoom: 0.12, note: 'x-ray hero lowers the can; on "Five" yellow fast-forward chevrons pop next to the clock (still 0:00) and the clock hands spin; hero looks up at it on "later"',
      draw(lt, d, t) {
        K.xray(t);
        hero(1 - eio(seg(lt, 0, 0.4)), { look: lt > la ? 1 : 0, brow: lt > la ? 0.8 : 0.3, mouth: 'flat' });
        dots(t, () => 1);
        K.elapsedClock(CLK[0], CLK[1], CLK[2], 0, { flash: 0 });
        ffwd(CLK[0] - 150, CLK[1] + 130, pop(lt, fv, 0.25) * (0.75 + 0.25 * Math.sin(lt * 14)));
        K.pill('5 HOURS?', CLK[0] - 30, CLK[1] + 250, 50, C.yellow, C.ink, pop(lt, la));
      } });
    cue(st, 'whoosh'); cue(st + fv, 'tock', { gain: 0.6 }); cue(st + fv + 0.2, 'tock', { gain: 0.5 }); cue(st + la, 'pop', { gain: 0.5 });
  }

  // ── 3 · the guess: A A QUARTER / B HALF ──
  {
    const st = at('a', 1), qu = Wd('quarter', 1) - st, ha = Wd('half', 1) - st, gu = Wd('guess', 1) - st;
    add({ id: 'S03', at: st, cam: [480, 560], zoom: 0.06, note: 'same x-ray frame; pill "A A QUARTER" pops on "quarter", "B HALF" on "half"; on "Guess" both pills wiggle and a "?" pops over the hero, he shrugs a brow',
      draw(lt, d, t) {
        K.xray(t);
        hero(0, { look: lt > qu ? -1 : 0, brow: lt > gu ? 1 : 0.5, mouth: lt > gu ? 'smirk' : 'flat', smirk: lt > gu });
        dots(t, () => 1);
        K.elapsedClock(CLK[0], CLK[1], CLK[2], 0);
        const wig = lt > gu ? Math.sin((lt - gu) * 18) * 0.04 * out(lt, gu + 0.4, 0.2) : 0;
        pills({ a: pop(lt, qu) * (1 + wig), b: pop(lt, ha) * (1 - wig) });
        bigText('?', 800, 560, 170, C.yellow, 0.12, pop(lt, gu, 0.25) * (1 + 0.05 * Math.sin(t * 6)));
      } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + qu, 'pop', { gain: 0.7 }); cue(st + ha, 'pop', { gain: 0.7 }); cue(st + gu, 'boing', { gain: 0.5 });
  }

  // ── 4-5 · two cans: 54 mg vs 328 mg per 16 fl oz (FDA) ──
  const CL = [290, 830], CR = [790, 830], CS = 1.2;
  const mgDots = (cx, n, p, t) => {   // a cloud of n dots above a can, popping in with p 0..1
    for (let i = 0; i < n; i++) {
      const k = clamp(p * n * 0.5 - i * 0.5 + 0.5); if (k <= 0) continue;
      const row = Math.floor(i / 4), col = i % 4, w = Math.min(4, n - row * 4);
      const x = cx + (col - (w - 1) / 2) * 62 + (row % 2) * 10, y = 400 - row * 60 + Math.sin(t * 3 + i) * 4;
      K.caffeineDot(x, y, 24 * eob(k));
    }
  };
  const cansScene = (lt, t, { drop = 1, l = 0, r = 0, tag = 1 }) => {
    plain();
    const dp = (k) => lerp(-500, 0, eob(clamp(k)));
    K.energyCan(CL[0], CL[1] + dp(drop), CS, { label: true });
    K.energyCan(CR[0], CR[1] + dp(drop * 1.15 - 0.15), CS, { label: true });
    mgDots(CL[0], 2, l, t); mgDots(CR[0], 12, r, t);
    K.pill('54 MG', CL[0], 560, 64, C.ink, C.yellow, eob(clamp(l * 3)));
    K.pill('328 MG', CR[0], 560, 64, C.ink, C.yellow, eob(clamp(r * 3)));
  };
  {
    const st = cut(2), ca = Wd('cans', 2) - st, ff = Wd('fifty', 2) - st;
    add({ id: 'S04', at: st, cam: [420, 720], zoom: 0.05, note: 'two identical plain navy cans drop in on "cans"; small "per 16 fl oz · FDA" tag under them; on "fifty-four" the left can gets "54 MG" and 2 dots',
      draw(lt, d, t) {
        cansScene(lt, t, { drop: seg(lt, ca - 0.25, ca + 0.15), l: seg(lt, ff, ff + 0.5), r: 0, tag: pop(lt, ca + 0.2) });
        bigText('?', CR[0], 520, 150, C.yellow, 0.1, pop(lt, ff + 0.2) * (1 + 0.05 * Math.sin(t * 6)));
      } });
    cue(st, 'whoosh'); cue(st + ca + 0.1, 'thud', { gain: 0.6 }); cue(st + ca + 0.25, 'thud', { gain: 0.5 }); cue(st + ca + 0.3, 'pop', { gain: 0.4 }); cue(st + ff, 'pop', { gain: 0.7 });
  }
  {
    const st = at('others', 2), th = Wd('three', 2) - st;
    add({ id: 'S05', at: st, cam: [790, 640], zoom: 0.14, note: 'push toward the right can; on "three twenty-eight" "328 MG" slams in and 12 dots burst out above it (left can keeps its 54 MG and 2 dots)',
      draw(lt, d, t) {
        cansScene(lt, t, { l: 1, r: seg(lt, th, th + 0.6) });
        if (lt > th) K.burst(CR[0], 420, 1.2, 1 - seg(lt, th + 0.2, th + 0.6));
      } });
    cue(st, 'whoosh'); cue(st + th, 'slam', { gain: 0.7 }); cue(st + th + 0.05, 'sparkle', { dur: 0.6, gain: 0.4 });
  }

  // ── 6 · minute 15: clock jumps to 0:15, he feels it ──
  {
    const st = cut(3), fi = Wd('fifteen', 3) - st, fe = Wd('feel', 3) - st;
    add({ id: 'S06', at: st, cam: [600, 600], zoom: 0.1, note: 'back in the x-ray frame; clock jumps 0:00 → 0:15 on "fifteen" (yellow flash); dots pulse; on "feel" eyes go wide + shock lines around his head',
      draw(lt, d, t) {
        K.xray(t);
        const fl = lt > fe;
        hero(0, { eyes: fl ? 'wide' : 'n', mouth: fl ? 'o' : 'flat', brow: fl ? 1 : 0.3, look: lt > fi && !fl ? 1 : 0 });
        const pulse = 1 + (fl ? 0.25 * Math.max(0, Math.sin((lt - fe) * 12)) : 0);
        dots(t, () => 1);
        if (fl) for (let i = 0; i < 24; i += 3) { const [lx, ly] = dotLocal(i, 1, 0); ctx.save(); ctx.globalAlpha = 0.5 * (pulse - 1) * 4; K.caffeineDot(HERO.x + lx * HERO.s, HERO.y + ly * HERO.s, 22 * HERO.s); ctx.restore(); }
        const [hx, hy] = headAt();
        K.shockLines(hx, hy - 20, 200, fl ? clamp((lt - fe) * 5) : 0);
        clock(lt, 0, 15, fi);
      } });
    cue(st, 'whoosh'); cue(st + fi, 'tock', { gain: 0.9 }); cue(st + fe, 'boing', { gain: 0.5 });
  }

  // ── 7 · minute 45: clock 0:45, dots spread out into the legs ──
  {
    const st = cut(4), fo = Wd('forty', 4) - st;
    add({ id: 'S07', at: st, cam: [560, 900], zoom: 0.08, note: 'x-ray frame; clock jumps 0:15 → 0:45 on "forty-five"; the belly dots slide out into the left arm and upper chest (absorbed everywhere)',
      draw(lt, d, t) {
        K.xray(t);
        hero(0, { look: lt > fo ? 1 : 0, brow: 0.5, mouth: 'flat' });
        dots(t, () => 1, () => 1, eio(seg(lt, fo, fo + 0.7)));
        clock(lt, 15, 45, fo);
      } });
    cue(st, 'whoosh'); cue(st + fo, 'tock', { gain: 0.9 }); cue(st + fo + 0.1, 'slide', { dur: 0.6, gain: 0.35 });
  }

  // ── 8 · blocking adenosine (receptor lens) ──
  {
    const st = at("it's", 4), bl = Wd('blocking', 4) - st, ad = Wd('adenosine', 4) - st, sl = Wd('sleepy', 4) - st;
    const LX = 540, LY = 740, LR = 360;
    add({ id: 'S08', at: st, cam: [540, 740], zoom: 0.1, note: 'zoom into a brain cell: sleepy blue blobs drift down to three cups; on "blocking" yellow caffeine dots drop into the cups one by one and bump the blobs back; "ADENOSINE" tag on "adenosine", Z z z on "sleepy"; clock 0:45 stays in the corner',
      draw(lt, d, t) {
        plain();
        K.receptorLens(LX, LY, LR, { block: seg(lt, bl, bl + 0.8), dock: lerp(0.2, 0.75, eio(seg(lt, 0, bl))), t, sc: pop(lt, 0, 0.3) });
        K.pill('CAFFEINE', LX, 1170, 48, C.yellow, C.ink, pop(lt, bl + 0.15));
        K.tag('ADENOSINE', LX - 60, 240, LX - 10, 500, 52, pop(lt, ad));
        K.zzz(LX + 170, 470, t, lt > sl ? clamp((lt - sl) * 4) : 0, 70);
        K.elapsedClock(CLK[0], CLK[1], CLK[2], 45);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); for (let k = 0; k < 3; k++) cue(st + bl + 0.12 + k * 0.27, 'thud', { gain: 0.45 }); cue(st + ad, 'pop', { gain: 0.6 }); cue(st + sl, 'sparkle', { dur: 0.6, gain: 0.25 });
  }

  // ── 9 · relatable: late drive, then awake in bed ──
  {
    const st = cut(5), on = Wd('one', 5) - st, la = Wd('late', 5) - st, aw = Wd('awake', 5) - st;
    const BX = 620, BY = 1040, BS = 0.9;
    add({ id: 'S09', at: st, cam: [480, 800], zoom: 0.08, note: 'night bedroom: hero in bed, eyes open; on "one" a can pops on the nightstand; on "late" a thought bubble shows his car on a dark night road; on "awake" the bubble pops away and his eyes go wide (tired lids) with shake lines',
      draw(lt, d, t) {
        K.nightHome();
        K.nightstand(130, 980, 0.8);
        K.energyCan(130, 980 - 160 * 0.55, 0.55, { sc: pop(lt, on) });
        const wide = lt > aw;
        K.bed(BX, BY, BS, { sleeper: { eyes: wide ? 'wide' : 'n', mouth: wide ? 'o' : 'flat', brow: wide ? 1 : 0.2, tired: wide ? 0.6 : 0.3 } });
        const hx = BX - 215 * BS, hy = BY - 95 * BS - 120;
        const bs = pop(lt, la - 0.05) * out(lt, aw - 0.05, 0.2);
        if (bs > 0) {
          const bx = 600, by = 470, bw = 640, bh = 420;
          K.bubble(bx, by, bw, bh, hx + 40, hy - 10, bs);
          ctx.save(); ctx.translate(bx, by); ctx.scale(bs, bs); rr(-bw / 2 + 12, -bh / 2 + 12, bw - 24, bh - 24, 50); ctx.clip();
          ctx.translate(-bw / 2, -bh / 2); ctx.scale(bw / 1080, bw / 1080);
          K.roadScene(t, { horizon: 380, road: 640, speed: 1.4, dashes: true });
          ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = C.navy; ctx.fillRect(-300, -300, 1700, 1200); ctx.restore();
          ctx.fillStyle = C.gum; ctx.beginPath(); ctx.arc(900, 140, 50, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#41506A'; ctx.beginPath(); ctx.arc(922, 124, 46, 0, Math.PI * 2); ctx.fill();
          const cs = 0.62, cx = 560, cy = 650 + Math.sin(t * 9) * 3;
          K.carInside(cx, cy, cs); K.man({ ...K.carSeat(cx, cy, cs, 'front'), sit: true, eyes: 'n', brow: 0.3, mouth: 'flat', arm: { e: [-60, 40], h: [-200, -40] } }); K.carBody(cx, cy, cs, { t, handles: false });
          ctx.restore();
        }
        if (wide) K.shakeLines(hx, hy, 130, 90, t, clamp((lt - aw) * 5), 10);
      } });
    cue(st, 'whoosh'); cue(st + on, 'pop', { gain: 0.6 }); cue(st + la, 'pop', { gain: 0.5 }); cue(st + la + 0.1, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + aw, 'boing', { gain: 0.6 });
  }

  // ── 10 · RE-HOOK: inside the blood, the dots leave slowly ──
  {
    const st = cut(6), tw = Wd('twist', 6) - st, le = Wd('leaves', 6) - st, sl = Wd('slowly', 6) - st;
    add({ id: 'S10', at: st, cam: [540, 640], zoom: 0.16, note: 'hard cut INSIDE the blood (red macro, big zoom): caffeine dots drift by; on "twist" a red "!" burst slams; on "leaves" a speed gauge pops, needle drops to slow on "slowly", dots crawl; clock 0:45 in the corner',
      draw(lt, d, t) {
        K.insideBlood(t);
        const sp = lt < sl ? 1 : lerp(1, 0.15, eio(seg(lt, sl, sl + 0.4)));
        for (let i = 0; i < 14; i++) {
          const x = ((rnd(i + 200) * 1400 + (lt * 60 * sp + (lt > sl ? 0 : 0)) * (0.7 + rnd(i + 210) * 0.6)) % 1400) - 160;
          const y = 260 + rnd(i + 220) * 760 + Math.sin(t * 1.5 + i) * 14;
          K.caffeineDot(x, y, 30 + rnd(i + 230) * 14);
        }
        if (lt > tw) { K.burst(540, 560, 1.6, 1 - seg(lt, tw + 0.25, tw + 0.6)); bigText('!', 540, 560, 260, C.red, 0, eob(seg(lt, tw, tw + 0.2)) * out(lt, le - 0.1, 0.2)); }
        const lvl = lt < sl ? 0.85 : lerp(0.85, 0.08, eio(seg(lt, sl, sl + 0.45)));
        K.speedGauge(540, 1080, 1.1, lvl, pop(lt, le - 0.1));
        K.elapsedClock(800, 200, 0.75, 45);   // pulled in a little: this shot pushes in harder
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.8 }); cue(st + le - 0.1, 'pop', { gain: 0.6 }); cue(st + sl, 'slide', { dur: 0.5, gain: 0.4 });
  }

  // ── 11 · too much: jitters + racing heart (THE room) ──
  {
    const st = cut(7), mu = Wd('much', 7) - st, ji = Wd('jitters', 7) - st, ra = Wd('racing', 7) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.08, note: 'room: three cans pop on a side table on "Too much"; on "Jitters" the hero shakes (shake lines, wide eyes, gritted flat mouth); on "racing heart" a heart badge pumps fast at top left with a quick heartbeat line',
      draw(lt, d, t) {
        K.home();
        K.nightstand(200, 1060, 1);
        for (let k = 0; k < 3; k++) K.energyCan(130 + k * 70, 1060 - 92, 0.45, { sc: pop(lt, 0.05 + k * 0.12) });
        const jt = lt > ji ? 1 : 0, jx = jt ? Math.sin(t * 60) * 8 : 0;
        K.man({ x: 660 + jx, y: 1000, s: 0.95, eyes: jt ? 'wide' : 'n', mouth: jt ? 'flat' : 'smirk', brow: jt ? 1 : 0.4, look: lt < ji ? -1 : 0 });
        K.shakeLines(660, 700, 150, 120, t, jt ? clamp((lt - ji) * 5) : 0);
        const hp = pop(lt, ra);
        if (hp > 0) {
          ctx.save(); ctx.translate(250, 420); ctx.scale(hp, hp);
          ctx.beginPath(); ctx.arc(0, 0, 170, 0, Math.PI * 2); ctx.fillStyle = C.ink; ctx.fill(); ctx.beginPath(); ctx.arc(0, 0, 154, 0, Math.PI * 2); ctx.fillStyle = C.white; ctx.fill();
          K.heart(0, -20, 0.95, Math.max(0, Math.sin(t * 16)));
          ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 154, 0, Math.PI * 2); ctx.clip(); ctx.scale(0.5, 0.5); K.ecg(0, 200, 520, t * 2.4, 0, C.red); ctx.restore();
          ctx.restore();
        }
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + 0.17, 'pop', { gain: 0.4 }); cue(st + 0.29, 'pop', { gain: 0.4 }); cue(st + ji, 'alarm', { dur: 0.6, gain: 0.2 }); cue(st + ra, 'pop', { gain: 0.6 }); cue(st + ra + 0.1, 'thud', { gain: 0.35 }); cue(st + ra + 0.3, 'thud', { gain: 0.35 });
  }

  // ── 12 · most adults: FDA cites 400 mg a day ──
  {
    const st = cut(8), ad = Wd('adults', 8) - st, fd = Wd('fda', 8) - st, fo = Wd('four', 8) - st, dy = Wd('day', 8) - st;
    add({ id: 'S12', at: st, cam: [600, 720], zoom: 0.06, note: 'plain: an adult icon pops at left on "adults"; "FDA" stamp slams at top right on "FDA"; a day card "400 / MG A DAY" drops on "four" and wiggles on "day"',
      draw(lt, d, t) {
        plain();
        scaled(250, 1150, pop(lt, 0.03), () => K.ageIcon(250, 1150, 0.78, {}));
        K.stamp('FDA', 720, 300, 96, -0.1, lt > fd ? lerp(1.8, 1, eo(seg(lt, fd, fd + 0.18))) : 0);
        if (lt > fo - 0.2) {
          const p = eob(seg(lt, fo - 0.2, fo + 0.15)), wg = lt > dy ? Math.sin((lt - dy) * 16) * 0.05 * out(lt, dy + 0.3, 0.3) : 0;
          K.calendar(lerp(1500, 720, p), 800, 0.72, '400', 'MG A DAY', lerp(0.25, 0.04, p) + wg);
        }
      } });
    cue(st, 'whoosh'); cue(st + 0.03, 'pop', { gain: 0.6 }); cue(st + fd, 'slam', { gain: 0.7 }); cue(st + fo, 'thud', { gain: 0.7 }); cue(st + dy, 'boing', { gain: 0.4 });
  }

  // ── 13 · ANSWER: hour five, half the dots are still in you. It's B ──
  {
    const st = cut(9), fv = Wd('five', 9) - st, ha = Wd('half', 9) - st, sti = Wd('still', 9) - st, bb = Wd('b', 9) - st;
    add({ id: 'S13', at: st, cam: [480, 620], zoom: 0.05, note: 'THE frame again; clock jumps 0:45 → 5:00 on "five"; every other dot sparkles away by "half" (12 of 24 stay); on "half" B gets a green check and A dims; "COMMENT A OR B" pill (not voiced) from "still" for ~0.9 s; B pill bounces on "B"',
      draw(lt, d, t) {
        K.xray(t);
        hero(0, { look: lt > ha ? -1 : 0, brow: lt > ha ? 0.9 : 0.4, mouth: lt > bb ? 'grin' : 'o' });
        const go = (i) => (i % 2 ? clamp((lt - fv - (i % 6) * 0.03) / 0.28) : 0);
        dots(t, () => 1, (i) => 1 - go(i), 1);
        for (let i = 1; i < 24; i += 2) { const g = go(i); if (g > 0 && g < 1) { const [lx, ly] = dotLocal(i, 1, 1); K.sparkle4(HERO.x + lx * HERO.s, HERO.y + ly * HERO.s - 30 * g, 26 * (1 - g) + 6, 1); } }
        clock(lt, 45, 300, fv);
        const bump = lt > bb ? 1 + 0.15 * Math.sin(seg(lt, bb, bb + 0.35) * Math.PI) : 1;
        pills({ check: lt > ha ? seg(lt, ha, ha + 0.3) : 0, dimA: seg(lt, ha, ha + 0.3), bumpB: bump });
        const cm = pop(lt, sti - 0.05, 0.25) * out(lt, sti + 0.85, 0.15);
        K.pill('COMMENT A OR B', 825, 330, 38, C.red, C.white, cm);
      } });
    cue(st, 'whoosh'); cue(st + fv, 'tock', { gain: 0.9 }); cue(st + fv + 0.05, 'sparkle', { dur: 0.4, gain: 0.4 }); cue(st + ha, 'pop', { gain: 0.8 }); cue(st + sti, 'pop', { gain: 0.35 }); cue(st + bb, 'boing', { gain: 0.5 });
  }

  // ── 14 · kids and teens: experts say skip them (nobody drinks) ──
  {
    const st = cut(10), ki = Wd('kids', 10) - st, te = Wd('teens', 10) - st, ex = Wd('experts', 10) - st, sk = Wd('skip', 10) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.06, note: 'plain: a kid icon pops on "Kids", a teen on "teens" (both just standing, neutral); a closed can stands at right; doctor badge on "Experts"; big red X over the can on "skip"',
      draw(lt, d, t) {
        plain();
        scaled(180, 1150, pop(lt, ki - 0.05), () => K.ageIcon(180, 1150, 0.82, { kid: true }));
        scaled(410, 1150, pop(lt, te - 0.05), () => K.ageIcon(410, 1150, 0.7, { shirt: ['#4E9A5E', '#3E7E4C'] }));
        K.energyCan(770, 820, 1.1, { label: true });
        K.doctorBadge(770, 330, 0.85, pop(lt, ex));
        if (lt > sk) K.redX(770, 820, 0.8 * lerp(1.8, 1, eo(seg(lt, sk, sk + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + ki, 'pop', { gain: 0.5 }); cue(st + te, 'pop', { gain: 0.5 }); cue(st + ex, 'pop', { gain: 0.6 }); cue(st + sk + 0.05, 'slam', { gain: 0.7 });
  }

  // ── 15-16 · TEASE + END CARD ──
  const badge = (sc) => K.filesBadge('BODY FILES', 400, 110, 50, sc);
  {
    const st = cut(11), nx = Wd('next', 11) - st, bo = Wd('body', 11) - st, br = Wd('breath', 11) - st;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.06, note: 'plain: tease badge (lungs + O2 bubble) pops big in the centre; NEXT pill on "Next", BODY FILES badge on "Body"; yellow "?" pops on "breath" (no one holds their breath)',
      draw(lt, d, t) {
        plain();
        K.breathBadge(540, 660, 1.55, pop(lt, 0.05), t, pop(lt, br));
        K.pill('NEXT', 540, 1040, 70, C.yellow, C.ink, pop(lt, nx));
        badge(pop(lt, bo));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.5 }); cue(st + nx, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.6 }); cue(st + br, 'pop', { gain: 0.5 });
  }
  {
    const st = at('and', 11), ur = Wd('urge', 11) - st, ox = Wd('oxygen', 11) - st, oe = Wd('oxygen', 11, 'e') - st;
    const TB = [180, 770, 0.68];
    add({ id: 'S16', at: st, cam: [560, 700], zoom: 0.05, note: 'LOOP END: cut back to the frame-1 framing: x-ray hero with the can under the 5:00 clock, A dimmed / B checked, 12 dots left; small tease badge + NEXT at left, BODY FILES badge top; "?" bounces on "urge", small red X on the O2 bubble on "oxygen"; + FOLLOW pops; in the last 0.8 s he raises the can back to his lips (lands on frame 1)',
      draw(lt, d, t) {
        K.xray(t);
        const sip = eio(seg(lt, d - 0.85, d - 0.3)), toCam = lt > oe + 0.05;
        hero(sip, { look: toCam ? 0 : -1, eyes: sip > 0.8 ? 'closed' : 'n', mouth: sip > 0.5 ? 'o' : toCam ? 'grin' : 'smile', brow: 0.5 });
        dots(t, () => 1, (i) => (i % 2 ? 0 : 1), 1);
        K.elapsedClock(CLK[0], CLK[1], CLK[2], 300);
        pills({ check: 1, dimA: 1 });
        badge(1);
        const qb = lt > ur ? 1 + 0.25 * Math.sin(seg(lt, ur, ur + 0.3) * Math.PI) : 1;
        K.breathBadge(TB[0], TB[1], TB[2], pop(lt, 0, 0.25), t, qb);
        if (lt > ox) K.redX(TB[0] + 78 * TB[2], TB[1] - 70 * TB[2], 0.17 * lerp(1.8, 1, eo(seg(lt, ox, ox + 0.2))), 1);
        K.pill('NEXT', TB[0], TB[1] + 150, 50, C.yellow, C.ink, pop(lt, 0.05));
        K.followPill(TB[0], TB[1] + 270, pop(lt, oe + 0.15), t, 44);
      } });
    cue(st, 'whoosh'); cue(st + ur, 'boing', { gain: 0.4 }); cue(st + ox, 'slam', { gain: 0.5 }); cue(st + oe + 0.15, 'pop', { gain: 0.7 }); cue(st + 3.0, 'gulp', { gain: 0.3 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES };
}
