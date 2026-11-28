// WHAT HAPPENS WHEN YOU SWEAT?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): a round macro lens on forearm skin with ONE fresh sweat drop, a side-on cartoon nose
// sniffing it from the right, faint bacteria specks round the drop (rewatch), "UP TO 4 MILLION GLANDS" pill on top,
// A STINKS / B SMELLS LIKE NOTHING pills below. Cuts sit on caption-chunk starts (word start - 0.05).
// Guess (line 1b): same set, pills pop on "stink" / "nothing". Re-hook (line 6): new scene, x-ray lens pushing into the armpit.
// Answer (line 9): same set, check on B on "nothing"; bacteria grow + stink lines on "stink". Rewatch: "99% WATER" tag + specks.
// Tease (line 11a, from "Next"): hero in the cold, breath fog, runny nose. Loop (11b "a built-in heater"): exact frame-1 picture.
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
  const T_LAST = (Math.ceil(T.dur * 30 - 1e-6) - 1) / 30;   // time of the film's last rendered frame

  // ── the hook set: skin lens + drop + sniffing nose (frame 1, guess, answer, loop) ──
  const LX = 400, LY = 660, LR = 260, DX = 420, DY = 670, NX = 865, NY = 640, NS = 0.92, HOOK_CAM = [540, 880];
  const PA = [540, 1012], PB = [540, 1102], PS = 40, BTXT = 'SMELLS LIKE NOTHING';
  const hookTag = (sc) => K.pill('UP TO 4 MILLION GLANDS', 540, 322, 38, C.ink, C.white, sc);
  const pills = (o = {}) => {
    K.abPill('A', 'STINKS', PA[0], PA[1], PS, { sc: 1, ...o.a });
    K.abPill('B', BTXT, PB[0], PB[1], PS, { sc: 1, ...o.b });
  };
  const dropScene = (t, { glint = 0, grow = 0, close = 0, bite = 0, stink = 0, wrinkle = 0, sniff = 1, dropSc = 1 } = {}) => {
    plain();
    K.lens(LX, LY, LR, 1, () => {
      K.swSkinMacro(LR);
      K.drop(DX - LX, DY - LY, 2.5 * dropSc, 0.15, 1);
      if (glint > 0) K.sparkle4(DX - LX - 30, DY - LY - 60, 34, glint);
      if (bite > 0) { ctx.save(); ctx.globalCompositeOperation = 'source-over'; for (const [bx, by, k] of [[46, 10, 0], [-44, 40, 0.4]]) if (bite > k) circle(DX - LX + bx, DY - LY + by, 20 * clamp((bite - k) * 3), C.skin); ctx.restore(); }
      K.swSpecks(DX - LX, DY - LY + 10, 1, 1, t, grow, close);
    }, C.skin);
    K.thStink(DX + 30, DY - 90, 0.8, stink, t, 1);
    K.swSniff(DX + 110, DY - 20, NX - 75, NY + 26, t, 0.8 * clamp(sniff), C.ink);
    const wr = wrinkle > 0.3;
    K.heroHead(NX, NY, NS, { eyes: wr ? 'squeeze' : 'closed', mouth: wr ? 'flat' : 'smile', brow: wr ? 0.9 : 0.5, frown: wr }, -0.28);
    if (wrinkle > 0) K.shockLines(NX - 10, NY - 20, 95, 0.8 * wrinkle);
  };

  // ── 1 · HOOK "What happens when you sweat?" ──
  {
    const sw = Wd('sweat', 0), ha = Wd('happens', 0);
    add({ id: 'S01', at: 0, cam: HOOK_CAM, zoom: 0.04, note: 'FRAME 1 = hook: macro skin lens with one fresh sweat drop, a side-on cartoon nose sniffing it (inhale lines), faint bacteria specks round the drop, "UP TO 4 MILLION GLANDS" pill, A STINKS / B SMELLS LIKE NOTHING pills, all from frame 0; nose sniff on "happens"; drop glints on "sweat"',
      draw(lt, d, t) {
        dropScene(t, { glint: blip(lt, sw, 0.5) });
        hookTag(1); pills();
        void ha;
      } });
    cue(0.0, 'sparkle', { dur: 0.4, gain: 0.2 }); cue(ha, 'slide', { dur: 0.35, gain: 0.25 }); cue(sw, 'plop', { gain: 0.45 });
  }

  // ── hero body map (S02, S06) ──
  const BX = 540, BY = 600, BS = 0.8;

  // ── 2a · "Up to four million sweat glands." ──
  {
    const st = at('up', 1), fo = Wd('four', 1) - st, mi = Wd('million', 1) - st, gl = Wd('glands', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 880], zoom: 0.06, note: 'the hero standing on plain paper (on screen at the cut), a few yellow gland dots on him; dots multiply all over his skin from "four" to "million"; "UP TO 4 MILLION GLANDS" pill pops on "four"; dots pulse on "glands"',
      draw(lt, d, t) {
        plain();
        K.man({ x: BX, y: BY, s: BS, eyes: lt > fo ? 'wide' : 'n', mouth: lt > fo ? 'o' : 'smile', brow: lt > fo ? 0.9 : 0.3, look: -0.2 });
        const n = lerp(0.08, 1, eio(seg(lt, fo - 0.1, mi + 0.35)));
        ctx.save(); const k = 1 + 0.12 * blip(lt, gl, 0.4); K.swGlandDots(BX, BY, BS, { n }); ctx.restore(); void k;
        if (lt > gl) K.burst(BX, BY - 50, 3.6, 0.8 * blip(lt, gl, 0.5));
        K.pill('UP TO 4 MILLION GLANDS', 540, 170, 44, C.yellow, C.ink, pop(lt, fo));
      } });
    cue(st, 'whoosh'); cue(st + fo, 'pop', { gain: 0.6 }); cue(st + fo + 0.05, 'sparkle', { dur: 0.6, gain: 0.25 }); cue(st + gl, 'pop', { gain: 0.4 });
  }

  // ── 2b · GUESS "Fresh sweat: does it stink, or smell like nothing?" ──
  {
    const st = at('fresh', 1), fr = Wd('fresh', 1) - st, sk = Wd('stink', 1) - st, sm = Wd('smell', 1) - st, no = Wd('nothing', 1) - st;
    add({ id: 'S03', at: st, cam: [560, 900], zoom: 0.06, note: 'GUESS: the hook set again (lens + fresh drop + sniffing nose, on screen at the cut), camera pushing toward the drop; drop glints on "Fresh"; big sniff on "smell"; pill A STINKS pops on "stink", B SMELLS LIKE NOTHING on "nothing"; yellow "?" above',
      draw(lt, d, t) {
        dropScene(t, { glint: blip(lt, fr, 0.5), sniff: 1 + blip(lt, sm, 0.5) });
        bigText('?', 540, 330, 150 * pop(lt, sk - 0.3), C.yellow, 0.1);
        K.abPill('A', 'STINKS', PA[0], PA[1], PS, { sc: Math.min(1.05, pop(lt, sk) * (1 + 0.05 * blip(lt, sk, 0.4))) });
        K.abPill('B', BTXT, PB[0], PB[1], PS, { sc: Math.min(1.05, pop(lt, no) * (1 + 0.05 * blip(lt, no, 0.4))) });
      } });
    cue(st, 'whoosh'); cue(st + fr, 'sparkle', { dur: 0.3, gain: 0.2 }); cue(st + sk - 0.3, 'boing', { gain: 0.35 }); cue(st + sk, 'pop', { gain: 0.65 }); cue(st + sm, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + no, 'pop', { gain: 0.65 });
  }

  // ── 3 · "Most of them pour out salty water." (x-ray skin section, eccrine gland) ──
  {
    const st = at('most', 2), po = Wd('pour', 2) - st, ou = Wd('out', 2) - st, sa = Wd('salty', 2) - st, wa = Wd('water', 2) - st;
    const SX = 540, SY = 640, SR = 400;
    add({ id: 'S04', at: st, cam: [540, 640], zoom: 0.08, note: 'x-ray skin cross-section lens (on screen at the cut): cream air on top, skin band, navy dermis with a cyan coiled sweat gland + straight duct, gland pumping; from "pour" a pale-blue drop runs up the duct and beads out of the pore on "out"; white salt grains pop in it on "salty"; "99% WATER" tag on "water" (rewatch detail)',
      draw(lt, d, t) {
        plain();
        const rise = eio(seg(lt, po - 0.1, ou + 0.25));
        const o = K.swSection(SX, SY, SR, { kind: 'eccrine', rise, salt: pop(lt, sa, 0.25), pump: seg(lt, 0, po + 0.3), t });
        K.tag('99% WATER', 820, 330, o.pore[0] + 50, o.pore[1] - 50, 40, pop(lt, wa));
        K.pill('SWEAT GLAND', 540, 1000, 36, C.ink, C.white, 1);
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'bubbles', { dur: 0.6, gain: 0.15 }); cue(st + po, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + ou, 'plop', { gain: 0.5 }); cue(st + sa, 'pop', { gain: 0.4 }); cue(st + wa, 'pop', { gain: 0.55 });
  }

  // ── 4 · "It evaporates, and that cools you down." ──
  {
    const st = at('it', 3), ev = Wd('evaporates', 3) - st, co = Wd('cools', 3) - st, dn = Wd('down', 3) - st;
    const SX = 420, SY = 640, SR = 330;
    add({ id: 'S05', at: st, cam: [540, 640], zoom: 0.08, note: 'the same skin section, smaller, with the bead on the pore (on screen at the cut) + a thermometer on the right running warm; from "evaporates" the bead shrinks into pale-blue vapour wisps; the thermometer drops on "cools"; pale-blue arrow down beside it on "down"',
      draw(lt, d, t) {
        plain();
        K.swSection(SX, SY, SR, { kind: 'eccrine', rise: 1, salt: 1, evap: eio(seg(lt, ev - 0.05, ev + 0.9)), t });
        const lvl = lerp(0.78, 0.4, eio(seg(lt, co - 0.05, dn + 0.2)));
        K.thermometer(880, 620, 0.5, lvl);
        K.flowArrow(985, 640, 200, Math.PI / 2, pop(lt, dn), C.sky, 22);
      } });
    cue(st, 'whoosh'); cue(st + ev, 'sparkle', { dur: 0.8, gain: 0.25 }); cue(st + co, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + dn, 'pop', { gain: 0.5 });
  }

  // ── 5 · "They're packed tightest on palms and feet." ──
  {
    const st = at("they're", 4), pk = Wd('packed', 4) - st, pa = Wd('palms', 4) - st, fe = Wd('feet', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.07, note: 'body map: the hero covered in yellow gland dots (on screen at the cut); dots pulse on "packed"; dense dot clusters + yellow rings on both hands on "palms" and on both feet on "feet"',
      draw(lt, d, t) {
        plain();
        K.man({ x: BX, y: BY, s: BS, eyes: 'n', mouth: 'smile', brow: 0.4 });
        K.swGlandDots(BX, BY, BS, { n: 1, palms: eo(seg(lt, pa - 0.05, pa + 0.3)), soles: eo(seg(lt, fe - 0.05, fe + 0.3)) });
        for (const sd of [-1, 1]) {
          K.hiRing(BX + sd * 176 * BS, BY + 140 * BS, 70, 62, pop(lt, pa, 0.25));
          K.hiRing(BX + sd * 67 * BS, BY + 600 * BS, 78, 34, pop(lt, fe, 0.25));
        }
        K.burst(BX, BY - 100, 3.2, 0.6 * blip(lt, pk, 0.4));
      } });
    cue(st, 'whoosh'); cue(st + pk, 'pop', { gain: 0.35 }); cue(st + pa, 'pop', { gain: 0.6 }); cue(st + fe, 'pop', { gain: 0.6 });
  }

  // ── 6 · RELATABLE "Ever had sweaty palms before a big moment?" ──
  {
    const st = at('ever', 5), sw = Wd('sweaty', 5) - st, pa = Wd('palms', 5) - st, bi = Wd('big', 5) - st, mo = Wd('moment', 5) - st;
    const X = 540, Y = 600, SC = 0.95;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.05, note: 'the hero seated at a desk, palms up in front of him, wall clock behind (on screen at the cut); sweat drops pop on his palms from "sweaty" to "palms" (shine); on "big" his eyes go wide + shock lines; on "moment" the clock jumps a tick and his hands shake',
      draw(lt, d, t) {
        plain();
        const hr = 9.9 + (lt > mo ? 0.1 : 0) + 0.02 * lt;
        K.wallClock(860, 250, 90, { hour: hr });
        const big = lt > bi, sh = lt > mo ? Math.sin(t * 50) * 4 : 0;
        ctx.save(); ctx.beginPath(); ctx.rect(-300, -300, W + 600, 820 + 300); ctx.clip();
        K.man({ x: X, y: Y, s: SC, sit: true, arm: K.ARM.swPalms, armL: K.ARM.swPalms, eyes: big ? 'wide' : 'n', mouth: big ? 'o' : 'flat', brow: big ? 1 : 0.6, lookY: big ? 0 : 1, sweat: lt > sw ? 1 : 0 });
        ctx.restore();
        for (const sd of [-1, 1]) {
          const hx = X + sd * 120 * SC + sh, hy = Y - 110 * SC;
          [[-14, -30, 0], [16, -20, 0.12], [0, 6, 0.24]].forEach(([dx, dy, k]) => K.drop(hx + dx * sd, hy + dy, 0.5 * pop(lt, sw + k * (pa - sw + 0.2) / 0.24 * 0.24, 0.25), 0, 1));
          K.sparkle4(hx + sd * 36, hy - 46, 26, blip(lt, pa, 0.5));
        }
        K.hgDesk(X, 820, 1, 900);
        ctx.fillStyle = C.bg; ctx.fillRect(-300, 1120, W + 600, 900);
        K.shockLines(X, Y - 350 * SC, 110, blip(lt, bi, 0.6));
        if (lt > mo) K.shakeLines(X, Y - 110 * SC, 190, 60, t, out(lt, mo + 0.5));
      } });
    cue(st, 'whoosh'); cue(st + sw, 'plop', { gain: 0.4 }); cue(st + pa, 'sparkle', { dur: 0.3, gain: 0.25 }); cue(st + bi, 'boing', { gain: 0.4 }); cue(st + mo, 'tock', { gain: 0.5 });
  }

  // ── 7 · RE-HOOK "But here's the twist: stress wakes other glands." (new scene: x-ray lens pushing into the armpit) ──
  {
    const st = at('but', 6), tw = Wd('twist', 6) - st, sr = Wd('stress', 6) - st, wk = Wd('wakes', 6) - st, ot = Wd('other', 6) - st;
    const LCX = 540, LCY = 640, LRR = 450, MX = 470, MY = 700, MS = 0.62;
    const AP = [MX + 118 * MS, MY - 100 * MS];          // armpit (canvas, before the push)
    add({ id: 'S08', at: st, cam: [540, 640], zoom: 0.04, note: 'RE-HOOK, new scene: a big round x-ray lens, the hero inside it in full x-ray with his right arm raised (on screen at the cut); shock lines on "twist", then the view pushes hard into his armpit; cold-sweat drops on his face on "stress"; a sleeping pink gland in the armpit opens its eyes on "wakes" and swells; "STRESS GLANDS" pill on "other"',
      draw(lt, d, t) {
        plain();
        const push = eio(seg(lt, tw, sr + 0.1)), z = lerp(1, 2.6, push);
        const fx = lerp(MX, AP[0], push), fy = lerp(MY - 60, AP[1], push);
        K.lens(LCX, LCY, LRR, 1, () => {
          ctx.translate(-LCX, -LCY);
          K.xray(t);
          ctx.save(); ctx.translate(LCX, LCY); ctx.scale(z, z); ctx.translate(-fx, -fy);
          const sur = lt > tw;
          K.man({ x: MX, y: MY, s: MS, xray: true, lungs: 0, arm: K.ARM.wave, eyes: sur ? 'wide' : 'n', mouth: sur ? 'o' : 'smile', brow: sur ? 1 : 0.3, look: 0.4, sweats: seg(lt, sr - 0.05, sr + 0.2), ct: t });
          K.swGland(AP[0] + 4, AP[1] + 8, 0.32 * (1 + 0.15 * pop(lt, wk, 0.3)), lerp(0, 1, seg(lt, wk - 0.05, wk + 0.25)), seg(lt, tw + 0.3, sr));
          ctx.restore();
        }, C.navy);
        K.shockLines(LCX, LCY - 350, 120, blip(lt, tw, 0.5));
        K.pill('STRESS GLANDS', 540, 1098, 40, C.ink, C.yellow, pop(lt, ot));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.5 }); cue(st + tw + 0.05, 'zip', { gain: 0.4 }); cue(st + sr, 'zip', { gain: 0.35 }); cue(st + wk, 'boing', { gain: 0.5 }); cue(st + ot, 'pop', { gain: 0.55 });
  }

  // ── 8 · "In your armpits, they make thicker, stickier stress sweat." (apocrine section) ──
  {
    const st = at('in', 7), ar = Wd('armpits', 7) - st, th = Wd('thicker', 7) - st, sk = Wd('stickier', 7) - st, sw = Wd('sweat', 7) - st;
    const SX = 540, SY = 640, SR = 400;
    add({ id: 'S09', at: st, cam: [560, 560], zoom: 0.1, note: 'x-ray skin section of the armpit (on screen at the cut): the big awake pink gland deep down, its duct into a hair follicle, a hair sticking out of the skin; gland pumps on "armpits"; a thick creamy drop oozes out by the hair from "thicker"; sticky strings stretch on "stickier"; yellow ring round it on "sweat"',
      draw(lt, d, t) {
        plain();
        const o = K.swSection(SX, SY, SR, { kind: 'apocrine', wake: 1, pump: seg(lt, ar - 0.1, th + 0.4), ooze: eo(seg(lt, th - 0.05, th + 0.45)), stretch: eo(seg(lt, sk - 0.05, sk + 0.3)), t });
        K.hiRing(SX + 10, SY - 144 - 78, 110, 125, pop(lt, sw, 0.25));
        K.pill('ARMPIT', 540, 1000, 36, C.ink, C.white, 1);
      } });
    cue(st, 'whoosh'); cue(st + ar, 'bubbles', { dur: 0.6, gain: 0.2 }); cue(st + th, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + sk, 'boing', { gain: 0.3 }); cue(st + sw, 'pop', { gain: 0.55 });
  }

  // ── 9 · "Skin bacteria break it down." (macro lens on the sticky drop) ──
  {
    const st = at('skin', 8), ba = Wd('bacteria', 8) - st, br = Wd('break', 8) - st, dn = Wd('down', 8) - st;
    const MX = 540, MY = 640, MR = 400;
    add({ id: 'S10', at: st, cam: [540, 600], zoom: 0.08, note: 'macro skin lens with the thick creamy stress-sweat drop in the middle and the faint specks round it (on screen at the cut); on "bacteria" the specks grow into grinning green bacteria; they close in and take bites from "break"; light green stink lines rise on "down"',
      draw(lt, d, t) {
        plain();
        const g = eo(seg(lt, ba - 0.05, ba + 0.35)), c = eio(seg(lt, br - 0.1, br + 0.3));
        K.lens(MX, MY, MR, 1, () => {
          K.swSkinMacro(MR);
          K.swStickyDrop(0, 20, 2.6, { bite: eio(seg(lt, br, dn + 0.2)) });
          K.swSpecks(0, 40, 1.5, 1, t, g, c);
        }, C.skin);
        K.thStink(MX - 20, MY - 160, 0.9, eo(seg(lt, dn, dn + 0.4)), t, 1);
      } });
    cue(st, 'whoosh'); cue(st + ba, 'pop', { gain: 0.5 }); cue(st + ba + 0.15, 'pop', { gain: 0.35 }); cue(st + br, 'sizzle', { dur: 0.5, gain: 0.25 }); cue(st + dn, 'boing', { gain: 0.3 });
  }

  // ── 10a · ANSWER "Answer: fresh sweat smells like nothing." ──
  const cmt = (t) => { const a = Wd('nothing', 9) + 0.3, b = 27.19; return (t > a ? eob(seg(t, a, a + 0.25)) : 0) * (1 - eio(seg(t, b, b + 0.1))); };
  const COMMENT = (t) => K.pill('COMMENT A OR B', 540, 322, 42, C.ink, C.yellow, cmt(t));
  {
    const st = at('answer', 9), an = Wd('answer', 9) - st, fr = Wd('fresh', 9) - st, no = Wd('nothing', 9) - st;
    add({ id: 'S11', at: st, cam: [540, 900], zoom: 0.05, note: 'ANSWER: the hook set with both A / B pills (on screen at the cut); pills bounce on "Answer"; drop glints on "fresh"; on "nothing" the check lands on B SMELLS LIKE NOTHING and A dims; COMMENT A OR B pill (not voiced) from 0.3 s after "nothing", held ~1.2 s into the next shot',
      draw(lt, d, t) {
        dropScene(t, { glint: blip(lt, fr, 0.5) });
        pills({ a: { sc: 1 + 0.05 * blip(lt, an, 0.35), dim: seg(lt, no, no + 0.3) }, b: { sc: 1 + 0.05 * Math.min(1, blip(lt, an, 0.35) + blip(lt, no, 0.45)), check: pop(lt, no, 0.3) } });
        COMMENT(t);
      } });
    cue(st, 'whoosh'); cue(st + an, 'boing', { gain: 0.35 }); cue(st + no, 'pop', { gain: 0.8 }); cue(st + no + 0.05, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + no + 0.3, 'pop', { gain: 0.3 });
  }

  // ── 10b · "Bacteria make the stink." ──
  {
    const st = at('bacteria', 9), ba = Wd('bacteria', 9) - st, ma = Wd('make', 9) - st, sk = Wd('stink', 9) - st;
    add({ id: 'S12', at: st, cam: [520, 900], zoom: 0.06, note: 'the same set, B checked (on screen at the cut), COMMENT A OR B pill still up; on "Bacteria" the specks grow into green bacteria, they close in on the drop on "make"; light green stink lines rise toward the nose on "stink" and the nose scrunches',
      draw(lt, d, t) {
        dropScene(t, { grow: eo(seg(lt, ba - 0.05, ba + 0.3)), close: eio(seg(lt, ma - 0.05, ma + 0.35)), bite: seg(lt, ma + 0.1, sk), stink: eo(seg(lt, sk - 0.05, sk + 0.35)), wrinkle: eo(seg(lt, sk + 0.05, sk + 0.3)) });
        pills({ a: { dim: 1 }, b: { check: 1 } });
        COMMENT(t);
      } });
    cue(st, 'whoosh'); cue(st + ba, 'pop', { gain: 0.5 }); cue(st + ma, 'slide', { dur: 0.3, gain: 0.3 }); cue(st + sk, 'boing', { gain: 0.4 });
  }

  // ── 11a · SAFETY "Hot, dry skin and confused?" (calm) ──
  {
    const st = at('hot', 10), ho = Wd('hot', 10) - st, dr = Wd('dry', 10) - st, co = Wd('confused', 10) - st;
    const X = 420, Y = 600, SC = 0.78;
    add({ id: 'S13', at: st, cam: [540, 700], zoom: 0.06, note: 'calm: the hero standing in the sun with a thermometer beside him (on screen at the cut); thermometer rises + his skin flushes on "Hot"; on "dry" a sweat-drop icon gets a red X (no sweat); on "confused" his eyes turn to slow spirals with a "?"; HEATSTROKE pill',
      draw(lt, d, t) {
        plain();
        K.sun(860, 230, 0.55, t);
        const hot = eo(seg(lt, ho - 0.05, ho + 0.4));
        K.thermometer(880, 690, 0.45, lerp(0.5, 0.92, hot));
        const cf = lt > co;
        K.man({ x: X, y: Y, s: SC, burn: 0.6 * hot, eyes: cf ? 'spiral' : 'n', spin: t * 0.3, mouth: 'flat', brow: 0.5 });
        const ix = 680, iy = 330;
        K.drop(ix, iy, 1.3 * pop(lt, dr - 0.1, 0.25), 0, 1);
        if (lt > dr) K.redX(ix, iy + 10, lerp(0.4, 0.24, eo(seg(lt, dr, dr + 0.2))), 1, 0.8);
        bigText('?', X + 150, Y - 470 * SC, 110 * pop(lt, co, 0.3), C.yellow, 0.15);
        K.pill('HEATSTROKE', 680, 1060, 40, C.red, C.white, pop(lt, co + 0.15));
      } });
    cue(st, 'whoosh'); cue(st + ho, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + dr, 'slam', { gain: 0.35 }); cue(st + co, 'boing', { gain: 0.25 }); cue(st + co + 0.15, 'pop', { gain: 0.4 });
  }

  // ── 11b · "Call emergency services." ──
  {
    const st = at('call', 10), ca = Wd('call', 10) - st, em = Wd('emergency', 10) - st, se = Wd('services', 10) - st;
    add({ id: 'S14', at: st, cam: [540, 640], zoom: 0.05, note: 'a phone (on screen at the cut, blank screen, no digits) starts ringing on "Call"; yellow ring round its green call button on "emergency"; a red emergency beacon pops up and blinks beside it on "services"',
      draw(lt, d, t) {
        plain();
        K.phone(470, 640, 1.05, '', pop(lt, ca, 0.2) * 0.8, t);
        K.hiRing(470, 640 + 110 * 1.05, 95, 95, pop(lt, em, 0.25));
        K.siren(830, 900, 0.8, { on: lt > se ? 1 : 0, t, sc: pop(lt, se) });
      } });
    cue(st, 'whoosh'); cue(st + ca, 'alarm', { dur: 0.8, gain: 0.2 }); cue(st + em, 'pop', { gain: 0.5 }); cue(st + se, 'pop', { gain: 0.5 });
  }

  // ── 12a · TEASE "Next Body File: cold air, runny nose," (starts on "Next") ──
  const badge = (x, y, sc, size = 44) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = at('next', 11), bo = Wd('body', 11) - st, co = Wd('cold', 11) - st, ru = Wd('runny', 11) - st, no = Wd('nose', 11) - st;
    const X = 540, Y = 660, SC = 0.7;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.08, note: 'tease (cut on "Next"): the hero outdoors in the snow with breath fog, NEXT pill at 0.03 s; BODY FILES badge on "Body"; snow thickens, he shivers + blushes cold on "cold"; a pale-blue drip runs from his nose tip on "runny" and wobbles on "nose"',
      draw(lt, d, t) {
        const cold = eo(seg(lt, co - 0.05, co + 0.4));
        K.swColdBg(t, 1110, lerp(0.35, 1, cold));
        const jit = Math.sin(t * 40) * 4 * cold;
        K.man({ x: X + jit, y: Y, s: SC, arm: K.ARM.hip, armL: K.ARM.hip, eyes: 'n', mouth: 'flat', brow: 0.6, blush: 0.6 * cold });
        K.swFog(X + jit + 30, Y - 268 * SC, 0.8, t, 0.9, 1);
        if (cold > 0) K.shakeLines(X, Y - 350 * SC, 140 * SC * 1.1, 110 * SC, t, cold * out(lt, co + 0.8));
        const dp = eo(seg(lt, ru - 0.05, ru + 0.35));
        K.drop(X + jit + 12, Y - 252 + 8 * dp + 4 * blip(lt, no, 0.4), 0.3 * dp, 0, 1);
        K.pill('NEXT', 540, 150, 60, C.yellow, C.ink, pop(lt, 0.03, 0.25));
        badge(540, 262, pop(lt, bo), 38);
      } });
    cue(st, 'whoosh'); cue(st + 0.03, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.4 }); cue(st + co, 'sparkle', { dur: 0.5, gain: 0.25 }); cue(st + ru, 'plop', { gain: 0.45 });
  }

  // ── 12b · LOOP "a built-in heater." (back to the exact frame-1 picture) + end card ──
  {
    const st = T.words.find((w) => w.line === 11 && w.w.toLowerCase() === 'a').s - 0.05, bu = Wd('built-in', 11) - st, he = Wd('heater', 11) - st;
    add({ id: 'S16', at: st, cam: HOOK_CAM, zoom: 0, note: 'LOOP + END CARD: the exact frame-1 picture (lens, fresh drop, sniffing nose, specks, 4 MILLION pill, A / B pills; same scene clock so the last frame = frame 0); end card: runny-nose + heater badge with NEXT top right (badge on "built-in", NEXT on "heater"), BODY FILES + FOLLOW top left',
      draw(lt, d, t) {
        const tl = t - T_LAST;                                  // scene clock: the last frame draws exactly like frame 0
        dropScene(tl);
        hookTag(1); pills();
        const k = (1 + 0.13 * (1 - eo(clamp(lt / 0.32))));    // keep the end card steady through the cut punch
        ctx.save(); ctx.translate(HOOK_CAM[0], HOOK_CAM[1]); ctx.scale(1 / k, 1 / k); ctx.translate(-HOOK_CAM[0], -HOOK_CAM[1]);
        K.swNoseBadge(900, 150, 0.55, pop(lt, bu, 0.3), t);
        K.pill('NEXT', 745, 150, 36, C.yellow, C.ink, pop(lt, he, 0.3));
        badge(220, 140, pop(lt, 0.35, 0.3), 32);
        K.followPill(220, 228, pop(lt, 0.55), t, 36);
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + 0.35, 'pop', { gain: 0.4 }); cue(st + 0.55, 'pop', { gain: 0.45 }); cue(st + bu, 'pop', { gain: 0.5 }); cue(st + he, 'pop', { gain: 0.5 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES, loop: true };
}
