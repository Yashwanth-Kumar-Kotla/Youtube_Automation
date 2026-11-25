// WHAT HAPPENS IF YOU DON'T BRUSH YOUR TEETH FOR A WEEK?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): the bathroom mirror, the hero close-up with his mouth wide open, the dusty toothbrush
// (cobweb) in its cup on the counter, a "7 DAYS" calendar on the wall (+ tiny "study: 28 people, 10 days" label = rewatch), the
// dog sitting in the doorway behind him (rewatch: it yawns on "breath" in S08 = the tease), A TWO WEEKS / B DENTIST pills.
// Cuts sit on caption-chunk starts (word start - 0.05) so no caption runs past a cut.
// Diary spine: calendar DAY 8 (S02) → DAY 1 (S04) → DAY 4 (S07) → DAY 7 (S08). Re-hook (line 4): new scene, big lens + hard push
// into the gum line where plaque hardens into grey tartar. Answer (line 7): check on A TWO WEEKS; B gets a half check on "pro"
// (tartar needs a dental pro). Tease (from "Next"): the dog catches the hero's yawn. Loop ("Open wide."): the exact frame-1 picture.
import { ctx, C, W, H, TAU, clamp, lerp, seg, eo, eio, eob, bigText } from './core/lib.js';
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
  // draw fn in SCREEN coords (undo main.js camera: punch-in + drift), so labels near the caption stay put
  const hud = (lt, d, cam, zoom, fn, first = false) => {
    const k = (first ? 1 : 1 + 0.13 * (1 - eo(clamp(lt / 0.32)))) * (1 + zoom * eio(clamp(lt / d)));
    ctx.save(); ctx.translate(cam[0], cam[1]); ctx.scale(1 / k, 1 / k); ctx.translate(-cam[0], -cam[1]); fn(); ctx.restore();
  };

  // ── the hook set: bathroom mirror (frame 1, S08, loop) ──
  const MF = [40, 100, 1040, 1000], COUNTER = 990, HX = 560, HY = 1225, HS = 1.85, HOOK_CAM = [540, 700];
  const MOUTH_XY = [HX, HY + (-350 + 88) * HS];               // the hero's mouth on screen (~560, 740)
  const DOG = [180, 815, 0.8], CAL = [880, 465, 0.24], CUP = [905, 1004, 1.3];
  const T_LAST = (Math.ceil(T.dur * 30 - 1e-6) - 1) / 30;     // time of the film's last rendered frame
  const mirrorSet = (t, { face = {}, dogYawn = 0, calHi = 0, calK = 1, cup = {}, extra = null } = {}) => {
    K.thTiles();
    ctx.save(); ctx.beginPath(); ctx.roundRect(MF[0], MF[1], MF[2] - MF[0], MF[3] - MF[1], 30); ctx.clip();
    K.thTiles();
    K.thDoorway(60, 330, 240, 700);
    K.thDog(DOG[0], DOG[1], DOG[2], { yawn: dogYawn, t, look: 0.6 });
    ctx.save(); ctx.translate(CAL[0], CAL[1]); ctx.scale(calK, calK); K.calendar(0, 0, CAL[2], '7', 'DAYS'); ctx.restore();
    K.hiRing(CAL[0], CAL[1] - 6, 100, 110, calHi);
    K.man({ x: HX, y: HY, s: HS, mouth: 'wide', eyes: 'n', brow: 0.5, ...face });
    K.pill('study: 28 · 10 days', 905, CAL[1] + 122, 16, C.ink, C.white);   // rewatch label, fully right of the head (x ≥ 800), drawn over everything
    if (extra) extra();
    ctx.restore();
    K.thMirrorFrame(MF[0], MF[1], MF[2], MF[3]);
    K.thCounter(COUNTER);
    K.thBrushCup(CUP[0], CUP[1], CUP[2], { dust: 1, web: 1, t, ...cup });
  };
  const PA = [300, 1085], PB = [790, 1085], PS = 40;
  const hookPills = (sc, o = {}) => { K.abPill('A', 'TWO WEEKS', PA[0], PA[1], PS, { sc, ...o.a }); K.abPill('B', 'DENTIST', PB[0], PB[1], PS, { sc, ...o.b }); };

  // ── 1 · HOOK "What happens if you don't brush your teeth for a week?" ──
  {
    const br = Wd('brush', 0), te = Wd('teeth', 0), we = Wd('week?', 0);
    add({ id: 'S01', at: 0, cam: HOOK_CAM, zoom: 0.05, note: 'FRAME 1 = hook: bathroom mirror close-up, hero with his mouth wide open, dusty toothbrush with a cobweb in its cup, "7 DAYS" calendar (+ tiny study label), dog in the doorway, A TWO WEEKS / B DENTIST pills, all from frame 0; dust puff + ring on the cup on "brush"; ring on the mouth on "teeth"; calendar bounce + ring on "week"',
      draw(lt, d, t) {
        mirrorSet(t, { calHi: pop(lt, we, 0.25) * out(lt, we + 0.5), calK: 1 + 0.15 * blip(lt, we, 0.35), cup: { puff: seg(lt, br, br + 0.7) } });
        K.hiRing(CUP[0], CUP[1] - 150, 95, 150, pop(lt, br, 0.25) * out(lt, br + 0.45));
        K.hiRing(MOUTH_XY[0], MOUTH_XY[1], 115, 125, pop(lt, te, 0.25) * out(lt, te + 0.45));
        hud(lt, d, HOOK_CAM, 0.05, () => hookPills(1), true);
      } });
    cue(0.0, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(br, 'pop', { gain: 0.5 }); cue(br + 0.05, 'bubbles', { dur: 0.3, gain: 0.15 }); cue(te, 'pop', { gain: 0.5 }); cue(we, 'tock', { gain: 0.5 });
  }

  // ── 2a · "Day eight, brush again." ──
  {
    const st = at('day', 1), ei = Wd('eight', 1) - st, br = Wd('brush', 1) - st, ag = Wd('again', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 650], zoom: 0.06, note: 'big tear-off calendar "7 DAY" on screen at the cut; it flips to "8" on "eight"; a clean toothbrush slides in under it on "brush" and scrubs with sparkles + green check on the calendar on "again"',
      draw(lt, d, t) {
        plain();
        const u = seg(lt, ei - 0.12, ei + 0.12), k = Math.abs(Math.cos(Math.PI * u)), cy = 610;
        ctx.save(); ctx.translate(540, cy - 330); ctx.scale(enter(lt), Math.max(0.02, k) * enter(lt)); ctx.translate(-540, -(cy - 330));
        K.calendar(540, cy, 0.9, u < 0.5 ? '7' : '8', 'DAY'); ctx.restore();
        K.checkMark(800, 330, 0.9, pop(lt, ag, 0.25));
        const bx = lerp(1400, 540, eio(seg(lt, br - 0.1, br + 0.2))) + (lt > ag ? Math.sin(lt * 40) * 22 : 0);
        K.stToothbrush(bx, 1050, 1.0, 0);
        if (lt > ag) { ctx.save(); ctx.globalAlpha = seg(lt, ag, ag + 0.1); K.thSparkle(bx + 150, 960, 26 * (0.8 + 0.2 * Math.sin(t * 9))); K.thSparkle(bx + 230, 1000, 16); K.thSparkle(bx + 90, 1000, 14); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + ei, 'tock', { gain: 0.55 }); cue(st + br, 'slide', { dur: 0.3, gain: 0.3 }); cue(st + ag, 'sparkle', { dur: 0.35, gain: 0.35 }); cue(st + ag, 'pop', { gain: 0.4 });
  }

  // ── 2b · GUESS "Gums heal in two weeks, or need a dentist?" ──
  const GA = [540, 960], GB = [540, 1075], GS = 42, GCAM = [540, 640];
  {
    const st = at('gums', 1), gu = Wd('gums', 1) - st, he = Wd('heal', 1) - st, tw = Wd('two', 1) - st, or = Wd('or', 1) - st, ne = Wd('need', 1) - st, de = Wd('dentist', 1) - st;
    add({ id: 'S03', at: st, cam: GCAM, zoom: 0.07, note: 'GUESS: open-mouth macro with red puffy gums on screen at the cut; yellow ring on the upper gum on "gums"; A TWO WEEKS pops on "heal" (flash on "two"); yellow "?" on "or"; B DENTIST pops on "need" (flash on "dentist")',
      draw(lt, d, t) {
        plain();
        K.thMouthMacro(540, 560, 0.9, { inflame: 0.85, film: 0.25, t, sc: enter(lt), ring: pop(lt, gu, 0.25) * out(lt, gu + 0.55) });
        hud(lt, d, GCAM, 0.07, () => {
          bigText('?', 540, 200, 150 * pop(lt, or), C.yellow, 0.1);
          K.abPill('A', 'TWO WEEKS', GA[0], GA[1], GS, { sc: pop(lt, he), hi: blip(lt, tw, 0.45) });
          K.abPill('B', 'DENTIST', GB[0], GB[1], GS, { sc: pop(lt, ne), hi: blip(lt, de, 0.45) });
        });
      } });
    cue(st, 'whoosh'); cue(st + gu, 'pop', { gain: 0.4 }); cue(st + he, 'pop', { gain: 0.65 }); cue(st + or, 'boing', { gain: 0.35 }); cue(st + ne, 'pop', { gain: 0.65 }); cue(st + de, 'tock', { gain: 0.35 });
  }

  // corner diary calendar (macro shots)
  const diary = (lt, num, hiAt) => { const k = 1 + 0.18 * blip(lt, hiAt, 0.35); ctx.save(); ctx.translate(905, 235); ctx.scale(k, k); K.calendar(0, 0, 0.22, num, 'DAY'); ctx.restore(); };

  // ── 3 · "Day one: a sticky bacteria film coats them." ──
  {
    const st = at('day', 2), on = Wd('one', 2) - st, sti = Wd('sticky', 2) - st, fi = Wd('film', 2) - st, co = Wd('coats', 2) - st, CAM = [540, 650];
    add({ id: 'S04', at: st, cam: CAM, zoom: 0.08, note: 'clean open-mouth macro + corner calendar "1 DAY" on screen at the cut; calendar bounces on "one"; smiling bacteria pop onto the teeth one by one from "sticky"; a yellow plaque film spreads over the teeth from "film" to "coats"; PLAQUE pill on "coats"',
      draw(lt, d, t) {
        plain();
        const germs = lerp(0, 8, seg(lt, sti, fi + 0.1));
        K.thMouthMacro(540, 650, 0.95, { germs, film: eio(seg(lt, fi - 0.05, co + 0.3)), t, sc: enter(lt) });
        diary(lt, '1', on);
        hud(lt, d, CAM, 0.08, () => K.pill('PLAQUE', 540, 1090, 46, C.yellow, C.ink, pop(lt, co)));
      } });
    cue(st, 'whoosh'); cue(st + on, 'tock', { gain: 0.45 });
    for (let k = 0; k < 4; k++) cue(st + sti + k * (fi - sti) / 4, 'pop', { gain: 0.3 });
    cue(st + fi, 'bubbles', { dur: 0.7, gain: 0.25 }); cue(st + co, 'pop', { gain: 0.6 });
  }

  // ── 4 · RELATABLE "Ever woken up with fuzzy teeth? That's it." ──
  {
    const st = at('ever', 3), wo = Wd('woken', 3) - st, fu = Wd('fuzzy', 3) - st, th = Wd("that's", 3) - st, it = Wd('it.', 3) - st, CAM = [540, 650];
    add({ id: 'S05', at: st, cam: CAM, zoom: 0.08, note: 'bedroom: the hero asleep in bed (Z z z) on screen at the cut; he wakes on "woken" (eyes open, tired); a lens pops on "fuzzy" showing fuzzy plaque on his teeth, he frowns; PLAQUE tag on the lens on "That\'s", ring on "it"',
      draw(lt, d, t) {
        plain();
        const awake = lt > wo, fz = lt > fu;
        K.bed(540, 870, 1.15, { sleeper: { eyes: awake ? 'n' : 'closed', tired: awake ? 0.6 : 0, mouth: fz ? 'flat' : (awake ? 'o' : 'smile'), brow: fz ? 0.8 : 0.3, frown: fz }, breathe: 0.5 + 0.5 * Math.sin(t * 3) });
        K.zzz(400, 650, t, out(lt, wo, 0.2), 70);
        K.lens(760, 410, 200, pop(lt, fu, 0.3), () => K.thMouthMacro(40, 200, 1.05, { film: 1, fuzz: eo(seg(lt, fu, fu + 0.4)), t }), C.mouth);
        K.hiRing(760, 410, 230, 230, pop(lt, it, 0.2) * out(lt, it + 0.5));
        K.tag('PLAQUE', 330, 300, 570, 380, 44, pop(lt, th));
      } });
    cue(st, 'whoosh'); cue(st + wo, 'boing', { gain: 0.35 }); cue(st + fu, 'pop', { gain: 0.6 }); cue(st + fu + 0.05, 'bubbles', { dur: 0.4, gain: 0.2 }); cue(st + th, 'pop', { gain: 0.55 }); cue(st + it, 'tock', { gain: 0.4 });
  }

  // ── 5 · RE-HOOK "But here's the twist: after a day, it hardens like cement." (new scene: big lens, hard push into the gum line) ──
  {
    const st = at('but', 4), tw = Wd('twist', 4) - st, af = Wd('after', 4) - st, dy = Wd('day,', 4) - st, ha = Wd('hardens', 4) - st, ce = Wd('cement', 4) - st;
    const CAM = [540, 660], Z = 0.3, LX = 540, LY = 620, LR = 380;
    add({ id: 'S06', at: st, cam: CAM, zoom: Z, note: 'RE-HOOK, new scene: a big lens on the gum line (dark mouth, a huge molar coated in soft yellow plaque with bacteria, pink gum) on screen at the cut, camera pushing hard in; shock lines on "twist"; a wall clock spins a full day from "after" + "24 HOURS" pill on "day"; the plaque hardens grey from "hardens" (bacteria fade, tooth goes wide-eyed); thud + red TARTAR stamp on "cement"',
      draw(lt, d, t) {
        plain();
        const cem = eio(seg(lt, ha - 0.05, ce + 0.1));
        K.lens(LX, LY, LR, enter(lt), () => {
          ctx.fillStyle = C.mouth; ctx.fillRect(-LR - 10, -LR - 10, 2 * LR + 20, 2 * LR + 20);
          K.stPlaqueTooth(0, -40, 1.9, { plaque: 1, cement: cem, face: lt > ce ? 'wow' : 'smile', t });
          ctx.beginPath(); ctx.ellipse(0, 340, 520, 260, 0, 0, TAU); ctx.fillStyle = C.pinkDark; ctx.fill();
          ctx.beginPath(); ctx.ellipse(0, 348, 512, 250, 0, 0, TAU); ctx.fillStyle = C.pink; ctx.fill();
          K.hiRing(-160, 140, 90, 18, 0);
          for (const [bx, by, r] of [[-120, 40, 0.3], [40, 66, -0.2], [150, 30, 0.2]]) K.bacterium(bx, by + Math.sin(t * 5 + bx) * 3, 0.45, r, t, 1 - cem);
        }, C.mouth);
        K.shockLines(LX, LY, LR + 40, blip(lt, tw, 0.5));
        if (lt > ce) K.burst(LX, LY + 40, 3, blip(lt, ce, 0.4));
        hud(lt, d, CAM, Z, () => {
          K.wallClock(150, 210, 70, { hour: lerp(0, 24, eio(seg(lt, af, dy + 0.25))), from: 0, sc: pop(lt, af, 0.25) });
          K.pill('24 HOURS', 830, 210, 44, C.ink, C.white, pop(lt, dy));
          K.stamp('TARTAR', 540, 1090, 52, -0.08, pop(lt, ce, 0.22) * lerp(1.6, 1, eo(seg(lt, ce, ce + 0.2))));
        });
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.5 }); cue(st + af, 'tock', { gain: 0.4 }); cue(st + af + 0.3, 'tock', { gain: 0.3 }); cue(st + dy, 'pop', { gain: 0.5 }); cue(st + ha, 'slide', { dur: ce - ha + 0.1, gain: 0.3 }); cue(st + ce, 'thud', { gain: 0.75 }); cue(st + ce + 0.03, 'slam', { gain: 0.4 });
  }

  // ── 6 · "Day four: your gums are already inflamed." ──
  {
    const st = at('day', 5), fo = Wd('four', 5) - st, gu = Wd('gums', 5) - st, al = Wd('already', 5) - st, inf = Wd('inflamed', 5) - st, CAM = [540, 650];
    add({ id: 'S07', at: st, cam: CAM, zoom: 0.08, note: 'open-mouth macro coated in plaque with bacteria and grey tartar at the gum line + corner calendar "4 DAY" on screen at the cut; calendar bounces on "four"; ring on the upper gum on "gums"; from "already" to "inflamed" the gums turn red and puff up, red "!" on "inflamed"',
      draw(lt, d, t) {
        plain();
        K.thMouthMacro(540, 650, 0.95, { film: 1, germs: 8, cement: 0.7, inflame: eio(seg(lt, al, inf + 0.3)), t, sc: enter(lt), ring: pop(lt, gu, 0.25) * out(lt, gu + 0.5) });
        diary(lt, '4', fo);
        bigText('!', 150, 300, 170 * pop(lt, inf), C.red, -0.12);
      } });
    cue(st, 'whoosh'); cue(st + fo, 'tock', { gain: 0.45 }); cue(st + gu, 'pop', { gain: 0.5 }); cue(st + al, 'alarm', { dur: 0.8, gain: 0.25 }); cue(st + inf, 'boing', { gain: 0.45 });
  }

  // ── 7 · "Day seven: puffy gums, maybe bleeding, stinky breath." (back at the mirror; the dog yawns = rewatch) ──
  {
    const st = at('day', 6), se = Wd('seven', 6) - st, pu = Wd('puffy', 6) - st, bl = Wd('bleeding', 6) - st, sk = Wd('stinky', 6) - st, br = Wd('breath', 6) - st;
    const LX = 850, LY = 815, LR = 160;
    add({ id: 'S08', at: st, cam: [600, 720], zoom: 0.1, note: 'back at the mirror (hero frowning, calendar "7 DAYS", dusty brush, dog in the doorway) on screen at the cut; ring on the calendar on "seven"; a lens pops by his mouth on "puffy" with swollen red gums; a small red drop on the gum in the lens on "bleeding"; green stink lines float from his mouth toward the dog on "stinky"; the dog yawns on "breath" (rewatch: next video)',
      draw(lt, d, t) {
        const stink = lt > sk;
        mirrorSet(t, { face: { mouth: stink ? 'o' : 'flat', brow: 0.8, frown: true, look: stink ? -0.6 : 0 }, calHi: pop(lt, se, 0.25) * out(lt, se + 0.5), dogYawn: eio(seg(lt, br - 0.05, br + 0.25)),
          extra: () => K.thStink(390, 820, 0.85, seg(lt, sk - 0.05, sk + 0.3), t, -1) });
        K.lens(LX, LY, LR, pop(lt, pu, 0.3), () => K.thMouthMacro(0, 120, 0.85, { film: 1, cement: 0.8, germs: 8, inflame: eo(seg(lt, pu, pu + 0.35)), bleed: pop(lt, bl, 0.25), t }), C.mouth);
      } });
    cue(st, 'whoosh'); cue(st + se, 'tock', { gain: 0.5 }); cue(st + pu, 'pop', { gain: 0.6 }); cue(st + pu + 0.05, 'boing', { gain: 0.3 }); cue(st + bl, 'plop', { gain: 0.35 }); cue(st + sk, 'bubbles', { dur: 0.5, gain: 0.25 }); cue(st + br, 'zip', { gain: 0.25 });
  }

  // ── 8 · ANSWER "Two weeks! One study: gums back to normal." ──
  {
    const st = at('two', 7), tw = Wd('two', 7) - st, on = Wd('one', 7) - st, stu = Wd('study', 7) - st, gu = Wd('gums', 7) - st, no = Wd('normal', 7) - st, CAM = [540, 640];
    add({ id: 'S09', at: st, cam: CAM, zoom: 0.07, note: 'ANSWER: mouth macro with red puffy gums + the A / B pills on screen at the cut; check on A TWO WEEKS on "Two" (B dims); "1 STUDY: 28 PEOPLE" pill on "study"; the gums fade back to healthy pink from "gums" to "normal" + sparkles on "normal"; COMMENT A OR B pill ~1 s (not voiced)',
      draw(lt, d, t) {
        plain();
        K.thMouthMacro(540, 500, 0.82, { inflame: 1 - eio(seg(lt, gu - 0.05, no + 0.2)), shine: pop(lt, no, 0.3), t, sc: enter(lt) });
        hud(lt, d, CAM, 0.07, () => {
          K.pill('1 STUDY: 28 PEOPLE', 540, 165, 38, C.ink, C.yellow, pop(lt, on - 0.03, 0.2));
          K.abPill('A', 'TWO WEEKS', GA[0], 880, GS, { sc: 1, check: pop(lt, tw, 0.3), hi: blip(lt, tw, 0.45) });
          K.abPill('B', 'DENTIST', GB[0], 990, GS, { sc: 1, dim: seg(lt, tw, tw + 0.3) });
          K.pill('COMMENT A OR B', 540, 1090, 40, C.ink, C.yellow, pop(lt, tw + 0.4, 0.18) * out(lt, tw + 1.5, 0.2));
        });
        void on;
      } });
    cue(st, 'whoosh'); cue(st + tw, 'pop', { gain: 0.8 }); cue(st + tw + 0.05, 'sparkle', { dur: 0.3, gain: 0.3 }); cue(st + tw + 0.4, 'pop', { gain: 0.3 }); cue(st + on, 'pop', { gain: 0.45 }); cue(st + gu, 'slide', { dur: 0.8, gain: 0.2 }); cue(st + no, 'sparkle', { dur: 0.5, gain: 0.4 });
  }

  // ── 9 · "The cement? Only a dental pro." (B gets a half check: tartar needs a pro) ──
  {
    const st = at('the', 8), ce = Wd('cement', 8) - st, on = Wd('only', 8) - st, de = Wd('dental', 8) - st, pr = Wd('pro', 8) - st, CAM = [540, 640];
    add({ id: 'S10', at: st, cam: CAM, zoom: 0.07, note: 'a big molar with a grey tartar band + a toothbrush scrubbing at it on screen at the cut; the brush bounces off on "cement" (ring on the band); red X over the brush on "Only"; dentist badge pops on "dental"; B DENTIST pill with a half check + "ONLY FOR TARTAR" on "pro"',
      draw(lt, d, t) {
        plain();
        K.stPlaqueTooth(330, 560, 1.35, { plaque: 1, cement: 1, face: 'wow', t, sc: enter(lt) });
        K.hiRing(330, 590, 175, 60, pop(lt, ce, 0.25) * out(lt, ce + 0.6));
        const bounce = lt > ce ? 60 * Math.sin(Math.PI * seg(lt, ce, ce + 0.3)) : 0, scrub = lt < ce ? Math.sin(lt * 38) * 14 : 0;
        ctx.save(); ctx.translate(560 + bounce, 760 + scrub); ctx.rotate(-Math.PI / 2); K.stToothbrush(0, 0, 0.8); ctx.restore();
        if (lt > on) K.redX(570 + bounce, 640, lerp(0.42, 0.26, eo(seg(lt, on, on + 0.2))), 1, 0.8);
        K.dentistBadge(820, 470, 0.72, pop(lt, de), t);
        hud(lt, d, CAM, 0.07, () => {
          const w = K.abPill('B', 'DENTIST', 500, 1000, GS, { sc: pop(lt, pr - 0.05, 0.25) });
          K.thHalfCheck(500 + w / 2 + 50, 1000, 0.75, pop(lt, pr, 0.3));
          K.pill('ONLY FOR TARTAR', 540, 1100, 28, C.ink, C.white, pop(lt, pr + 0.15));
        });
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: ce, gain: 0.2 }); cue(st + ce, 'boing', { gain: 0.55 }); cue(st + on, 'slam', { gain: 0.5 }); cue(st + de, 'pop', { gain: 0.6 }); cue(st + pr, 'pop', { gain: 0.7 }); cue(st + pr + 0.15, 'pop', { gain: 0.3 });
  }

  // ── 10a · TEASE "Next Body File: yawns your dog might catch." (starts on "Next") ──
  const badge = (x, y, sc, size = 44) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = at('next', 9), bo = Wd('body', 9) - st, ya = Wd('yawns', 9) - st, dg = Wd('dog', 9) - st, ca = Wd('catch', 9) - st;
    add({ id: 'S11', at: st, cam: [540, 640], zoom: 0.08, note: 'tease (cut on "Next"): the hero\'s head (left) and the dog (right) on screen at the cut, yellow NEXT pill pops at once; BODY FILES badge on "Body"; the hero yawns on "yawns"; ring on the dog on "dog"; the dog catches the yawn on "catch"',
      draw(lt, d, t) {
        plain();
        const hy = eio(seg(lt, ya - 0.05, ya + 0.2)) * out(lt, ca + 0.35, 0.3);
        K.heroHead(300, 700, 1.05, { mouth: hy > 0.5 ? 'yawn' : 'smile', eyes: hy > 0.5 ? 'closed' : 'n', brow: hy > 0.5 ? 0.9 : 0.3, look: 0.6 }, 0.12 * hy - 0.05);
        K.thDog(770, 780, 1.25, { yawn: eio(seg(lt, ca - 0.05, ca + 0.3)), t, look: -1, sc: enter(lt) });
        K.hiRing(770, 620, 190, 175, pop(lt, dg, 0.25) * out(lt, dg + 0.4));
        K.pill('NEXT', 540, 170, 64, C.yellow, C.ink, pop(lt, 0.03, 0.25));
        badge(540, 290, pop(lt, bo));
      } });
    cue(st, 'whoosh'); cue(st + 0.03, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.4 }); cue(st + ya, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + dg, 'pop', { gain: 0.5 }); cue(st + ca, 'boing', { gain: 0.45 });
  }

  // ── 10b · LOOP "Open wide." (back to the exact frame-1 picture) ──
  {
    const st = at('open', 9), op = Wd('open', 9) - st, wi = Wd('wide', 9) - st, Z = 0;
    add({ id: 'S12', at: st, cam: HOOK_CAM, zoom: Z, note: 'LOOP + END CARD: the frame-1 mirror set (same camera, scene clock) on screen at the cut, mouth "o" opening wide on "Open"; ring on the mouth on "wide"; the A / B pills pop back after "wide" so the last frame = frame 1; end card from 0.4 s: BODY FILES + FOLLOW top left, yawning-dog badge + NEXT top right',
      draw(lt, d, t) {
        const tl = t - T_LAST;                                  // scene clock: the last frame draws exactly like frame 0
        mirrorSet(tl, { face: { mouth: lt > op ? 'wide' : 'o' } });
        K.hiRing(MOUTH_XY[0], MOUTH_XY[1], 115, 125, pop(lt, wi, 0.2) * out(lt, wi + 0.35, 0.2));
        hud(lt, d, HOOK_CAM, Z, () => {
          hookPills(pop(lt, wi + 0.5, 0.3));
          K.thDogBadge(900, 188, 0.5, pop(lt, 0.4, 0.3), t);
          K.pill('NEXT', 900, 298, 34, C.yellow, C.ink, pop(lt, 0.45, 0.3));
          badge(230, 175, pop(lt, 0.4, 0.3), 34);
          K.followPill(230, 270, pop(lt, 0.6), t, 38);
        });
      } });
    cue(st, 'whoosh'); cue(st + 0.4, 'pop', { gain: 0.4 }); cue(st + 0.6, 'pop', { gain: 0.5 }); cue(st + wi, 'pop', { gain: 0.45 }); cue(st + wi + 0.5, 'pop', { gain: 0.35 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES, loop: true };
}
