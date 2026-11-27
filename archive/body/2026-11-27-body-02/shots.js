// WHAT HAPPENS WHEN YOU GET HANGRY?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): the hero at his office desk glaring at a stalled laptop (loading spinner), an empty
// open lunchbox, red anger steam over his head, "37% OF IRRITABILITY" tag + A EVERYTHING / B ONLY BAD MOMENTS pills.
// Rewatch: the desk clock already reads 2:47 PM (paid off on "lunch"); CORTISOL / ADRENALINE dart labels; "400+ US ADULTS".
// Cuts sit on caption-chunk starts (word start - 0.05) so no caption runs past a cut.
// Guess (1b) + answer (7): two option rows (storm photo + mug photo, each with a mood face). Re-hook (5): new scene, white lab.
// Tease (9a, from "Next"): fingertip + paper. Loop (9b "Still hungry?"): back to the exact frame-1 picture (scene clock t - T_LAST).
import { ctx, C, W, H, TAU, clamp, lerp, seg, eo, eio, eob, line, bigText, rr } from './core/lib.js';
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
  const ptr = (x0, x1, y, a = 1) => {   // small ink-edged red arrow from x0 to x1 (pointing right)
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a);
    line([[x0, y], [x1 - 30, y]], C.ink, 24); line([[x0, y], [x1 - 30, y]], C.red, 12);
    ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x1 - 44, y - 30); ctx.lineTo(x1 - 44, y + 30); ctx.closePath(); ctx.fillStyle = C.red; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.restore();
  };
  const enter = (lt) => lerp(0.86, 1, eob(seg(lt, 0, 0.25)));

  // ── the hook set: office desk (frame 1 + loop) ──
  const HX = 380, HS = 0.85, HY = 820, DT = HY + 212 * HS, HOOK_CAM = [540, 760];
  const HEAD_TOP = HY - 480 * HS;
  const T_LAST = (Math.ceil(T.dur * 30 - 1e-6) - 1) / 30;   // time of the film's last rendered frame
  const desk = (t, { steam = 1, look = 0.75, eyes = 'n', mouth = 'flat', hop = 0, coworker = null, arm = K.ARM.down } = {}) => {
    K.sitOffice(1180);
    if (coworker) K.callPerson(890, 600, 400, { shirt: C.leaf, o: { hairCol: '#B9B2A6', look: -0.8, ...coworker } });
    K.man({ x: HX, y: HY, s: HS, sit: true, look, eyes, mouth, brow: 0.95, frown: true, arm, armL: K.ARM.down });
    K.hgSteam(HX, HEAD_TOP + 10, 0.9, t, steam);
    K.hgDesk(540, DT, 1, 900);
    K.hbClock(140, DT - 40, 0.5, { text: '2:47', pm: 'PM' });
    K.hgLaptop(700, DT, 0.9, { t });
    K.hgLunchbox(925, DT, 0.42, { hop });
  };
  const hookTag = (sc) => K.tag('37% OF IRRITABILITY', 740, 420, HX + 60, HEAD_TOP + 10, 38, sc);
  const hookPills = (sc, o = {}) => { K.abPill('A', 'EVERYTHING', 690, 530, 34, { sc, ...o.a }); K.abPill('B', 'ONLY BAD MOMENTS', 750, 625, 34, { sc, ...o.b }); };

  // ── 1 · HOOK "What happens when you get hangry?" ──
  {
    const ha = Wd('hangry', 0);
    add({ id: 'S01', at: 0, cam: HOOK_CAM, zoom: 0.05, note: 'FRAME 1 = hook: hero at his office desk glaring at a stalled laptop (loading spinner), empty open red lunchbox, desk clock 2:47 PM, red anger steam over his head, "37% OF IRRITABILITY" tag + A EVERYTHING / B ONLY BAD MOMENTS pills, all from frame 0; on "hangry" the steam flares, eyes squeeze + "GRR!"',
      draw(lt, d, t) {
        const f = blip(lt, ha, 0.7);
        desk(t, { steam: 1 + 0.7 * f, eyes: lt > ha && lt < ha + 0.6 ? 'squeeze' : 'n' });
        hookTag(1); hookPills(1);
        bigText('GRR!', 200, 470, 70, C.yellow, -0.15, pop(lt, ha, 0.25) * out(lt, ha + 0.6));
      } });
    cue(0.0, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(ha, 'sizzle', { dur: 0.5, gain: 0.35 }); cue(ha, 'pop', { gain: 0.5 });
  }

  // ── 2a · "One study: hunger tracked" (survey phone) ──
  {
    const st = at('one', 1), su = Wd('study', 1) - st, hu = Wd('hunger', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 680], zoom: 0.1, note: 'study: a phone with a CHECK-IN survey (HUNGRY? / GRUMPY? sliders) on screen at the cut, "64 ADULTS · 21 DAYS" pill on "study"; on "hunger" the HUNGRY slider fills and the GRUMPY slider follows it',
      draw(lt, d, t) {
        plain();
        const h = eio(seg(lt, hu - 0.05, hu + 0.35)), g = eio(seg(lt, hu + 0.05, hu + 0.45));
        K.hgSurveyPhone(540, 650, 0.85, { hunger: 0.15 + 0.7 * h, grump: 0.1 + 0.6 * g, sc: enter(lt), ping: blip(lt, 0.05, 0.3) });
        K.pill('64 ADULTS · 21 DAYS', 540, 1080, 44, C.ink, C.white, pop(lt, su));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + hu, 'slide', { dur: 0.4, gain: 0.3 });
  }

  // ── 2b · "thirty-seven percent of grumpiness." (donut) ──
  {
    const st = at('thirty', 1), th = Wd('thirty', 1) - st, pe = Wd('percent', 1) - st, gr = Wd('grumpiness', 1) - st;
    const R = 290, X = 540, Y = 640, mid = -Math.PI / 2 + TAU * 0.37 / 2;
    add({ id: 'S03', at: st, cam: [540, 640], zoom: 0.08, note: 'grumpiness donut (on screen at the cut): a red slice grows to 37% on "thirty-seven" while the number counts up in the hole; "LINKED TO HUNGER" tag on the slice on "percent"; a red grumpy face pops on the slice + "GRUMPINESS" pill on "grumpiness"',
      draw(lt, d, t) {
        plain();
        const f = 0.37 * eio(seg(lt, th, pe - 0.05));
        K.hgDonut(X, Y, R, f, { sc: enter(lt), inner: () => bigText(Math.round(f * 100) + '%', 0, 0, 120, lt > pe ? C.yellow : C.white, 0, 1 + 0.15 * blip(lt, pe, 0.3)) });
        K.tag('LINKED TO HUNGER', 330, 260, X + Math.cos(mid) * R * 0.8 - 60, Y + Math.sin(mid) * R * 0.8 - 80, 38, pop(lt, pe));
        K.hgMood(X + Math.cos(mid) * R * 0.8, Y + Math.sin(mid) * R * 0.8, 62, 'bad', pop(lt, gr));
        K.pill('GRUMPINESS', 540, 1080, 48, C.red, C.white, pop(lt, gr));
      } });
    cue(st, 'whoosh'); cue(st + th, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + pe, 'pop', { gain: 0.6 }); cue(st + gr, 'boing', { gain: 0.4 });
  }

  // ── option rows (guess S04 + answer S12): A = everything soured, B = only the bad moment ──
  const RA = 520, RB = 900, ROW_H = 250;
  const row = (y, moods, { mA = 1, mB = 1, dim = 0, hi = 0, ring = 0, cardHi = 0, t = 0 } = {}) => {
    rr(70, y - ROW_H / 2, 940, ROW_H, 30); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
    if (hi > 0) { ctx.save(); ctx.globalAlpha = 0.35 * clamp(hi); rr(70, y - ROW_H / 2, 940, ROW_H, 30); ctx.fillStyle = C.yellow; ctx.fill(); ctx.restore(); }
    K.hgCard(240, y, 0.66, 'storm', { t, hi: cardHi });
    K.hgMood(420, y, 52, moods[0], mA);
    K.hgCard(680, y, 0.66, 'mug');
    K.hgMood(860, y, 52, moods[1], mB);
    if (ring > 0) K.hiRing(240, y, 140, 120, ring);
    if (dim > 0) { ctx.save(); ctx.globalAlpha = 0.5 * clamp(dim); rr(60, y - ROW_H / 2 - 10, 960, ROW_H + 20, 34); ctx.fillStyle = C.bg; ctx.fill(); ctx.restore(); }
  };
  const PILL_A = [300, RA - ROW_H / 2 - 60], PILL_B = [360, RB - ROW_H / 2 - 60];

  // ── 2c · GUESS "Does it sour everything, or only bad moments?" ──
  {
    const st = at('does', 1), so = Wd('sour', 1) - st, ev = Wd('everything', 1) - st, on = Wd('only', 1) - st, ba = Wd('bad', 1) - st;
    add({ id: 'S04', at: st, cam: [540, 650], zoom: 0.07, note: 'GUESS: two option rows on screen at the cut, each = a mild storm-cloud photo + a plain mug photo with empty mood slots; yellow "?" on "sour"; pill A EVERYTHING + red grumpy faces under BOTH photos in row A on "everything"; pill B ONLY BAD MOMENTS on "only" + row B gets a red face only after the storm photo, a grey neutral face after the mug; storm card in B flashes on "bad"',
      draw(lt, d, t) {
        plain();
        bigText('?', 960, 200, 150 * pop(lt, so), C.yellow, 0.12);
        row(RA, ['bad', 'bad'], { mA: pop(lt, ev), mB: pop(lt, ev + 0.12), t });
        row(RB, ['bad', 'flat'], { mA: pop(lt, on), mB: pop(lt, on + 0.12), cardHi: blip(lt, ba, 0.4), t });
        K.abPill('A', 'EVERYTHING', PILL_A[0], PILL_A[1], 40, { sc: pop(lt, ev), hi: blip(lt, ev, 0.4) });
        K.abPill('B', 'ONLY BAD MOMENTS', PILL_B[0], PILL_B[1], 40, { sc: pop(lt, on), hi: blip(lt, on, 0.4) });
      } });
    cue(st, 'whoosh'); cue(st + so, 'boing', { gain: 0.4 }); cue(st + ev, 'pop', { gain: 0.65 }); cue(st + on, 'pop', { gain: 0.65 }); cue(st + ba, 'tock', { gain: 0.3 });
  }

  // ── 3 · "Skip a meal, and blood sugar dips," ──
  {
    const st = at('skip', 2), me = Wd('meal', 2) - st, bl = Wd('blood', 2) - st, di = Wd('dips', 2) - st;
    add({ id: 'S05', at: st, cam: [540, 640], zoom: 0.1, note: 'an empty plate with crumbs (left) and a BLOOD SUGAR tube full of red blood + sugar cubes (right), both on screen at the cut; red X over the plate on "meal"; BLOOD SUGAR pill on "blood"; the level drains below the dashed line with a red down arrow on "dips"',
      draw(lt, d, t) {
        plain();
        K.mealPlate(290, 700, 0.85, { eaten: 1, sc: enter(lt) });
        if (lt > me) K.redX(290, 690, lerp(0.9, 0.6, eo(seg(lt, me, me + 0.2))), 1, 0.8);
        const lv = lerp(0.85, 0.3, eio(seg(lt, di - 0.05, di + 0.4)));
        K.hgSugarTube(740, 620, 0.95, lv, t, enter(lt));
        K.pill('BLOOD SUGAR', 740, 1040, 42, C.ink, C.white, pop(lt, bl));
        if (lt > di) K.arrow(905, 520, 200, Math.PI / 2, pop(lt, di, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + me, 'slam', { gain: 0.5 }); cue(st + bl, 'pop', { gain: 0.5 }); cue(st + di, 'slide', { dur: 0.4, gain: 0.35 });
  }

  // ── 4a · "so stress hormones surge," (x-ray kidneys + adrenal darts) ──
  {
    const st = at('so', 3), sr = Wd('stress', 3) - st, ho = Wd('hormones', 3) - st, su = Wd('surge', 3) - st;
    const KX = [360, 720], KY = 840, KS = 0.85;
    add({ id: 'S06', at: st, cam: [540, 620], zoom: 0.12, note: 'x-ray film: two kidneys with yellow adrenal glands on top (on screen at the cut); glands glow on "stress"; two red hormone darts shoot up out of them on "hormones" (labels CORTISOL / ADRENALINE = rewatch detail); speed lines + darts hit the top on "surge"',
      draw(lt, d, t) {
        K.xray(t);
        K.kidney(KX[0], KY, KS, false); K.kidney(KX[1], KY, KS, true);
        const gl = eo(seg(lt, sr - 0.05, sr + 0.2));
        K.hgAdrenal(KX[0] + 10, KY - 165 * KS, 0.95, gl + 0.3 * blip(lt, ho, 0.3), -0.15);
        K.hgAdrenal(KX[1] - 10, KY - 165 * KS, 0.95, gl + 0.3 * blip(lt, ho, 0.3), 0.15);
        const fl = eio(seg(lt, ho, su));
        if (lt > ho) for (let i = 0; i < 2; i++) {
          const x = KX[i] + (i ? -10 : 10), y = lerp(KY - 230 * KS, 330, fl);
          K.hgDart(x, y, 1, -Math.PI / 2, pop(lt, ho, 0.15));
          if (fl < 1) K.speedLines(x, y + 120, 1 - fl * 0.5);
          K.pill(i ? 'ADRENALINE' : 'CORTISOL', x + (i ? 40 : -40), y + 150, 36, C.ink, C.white, pop(lt, ho + 0.15, 0.25));
        }
        K.burst(540, 300, 1.3, blip(lt, su, 0.45));
      } });
    cue(st, 'whoosh'); cue(st + sr, 'pop', { gain: 0.4 }); cue(st + ho, 'zip', { gain: 0.6 }); cue(st + su, 'slam', { gain: 0.5 });
  }

  // ── 4b · "and impulse control slips." (brain brake) ──
  {
    const st = at('and', 3), im = Wd('impulse', 3) - st, co = Wd('control', 3) - st, sl = Wd('slips', 3) - st;
    const BX = 560, BY = 520, BS = 1.0, PX = 360, PY = 640;
    add({ id: 'S07', at: st, cam: [520, 640], zoom: 0.1, note: 'a pink brain with a brake pedal hanging from its front (on screen at the cut); "IMPULSE CONTROL" tag on "impulse"; yellow ring round the pedal on "control"; the pedal swings loose (bolt pops out, red "!") + brain wobble on "slips"',
      draw(lt, d, t) {
        plain();
        const slip = eob(seg(lt, sl - 0.05, sl + 0.35));
        K.brain(BX, BY, BS * enter(lt), { t, wob: blip(lt, sl, 0.6) });
        K.hgPedal(PX, PY, 1.05, slip, t);
        K.hiRing(PX + 20, PY + 210, 150, 130, pop(lt, co, 0.25) * (lt < sl ? 1 : out(lt, sl, 0.2)));
        const pa = 0.15 + 0.55 * clamp(slip), padX = PX + 1.05 * (10 * clamp(slip) + 10 * Math.cos(pa) - 220 * Math.sin(pa)), padY = PY + 1.05 * (110 * clamp(slip) + 10 * Math.sin(pa) + 220 * Math.cos(pa));
        K.tag('IMPULSE CONTROL', 700, 1080, padX + 60, padY + 20, 42, pop(lt, im));
        bigText('!', 170, 720, 140 * pop(lt, sl + 0.1), C.red, -0.1);
      } });
    cue(st, 'whoosh'); cue(st + im, 'pop', { gain: 0.5 }); cue(st + co, 'tock', { gain: 0.4 }); cue(st + sl, 'boing', { gain: 0.5 }); cue(st + sl + 0.1, 'thud', { gain: 0.4 });
  }

  // ── 5 · RELATABLE "Ever snapped, then realized you skipped lunch?" (office, coworker) ──
  {
    const st = at('ever', 4), sn = Wd('snapped', 4) - st, re = Wd('realized', 4) - st, lu = Wd('lunch', 4) - st;
    add({ id: 'S08', at: st, cam: [480, 640], zoom: 0.12, note: 'office desk (frame-1 set, no tag/pills) with a coworker peeking in at the right (on screen at the cut); on "snapped" the hero turns and huffs a scribble speech bubble, steam flares, coworker goes wide-eyed; on "realized" he goes wide-eyed and looks at the desk clock 2:47 PM (yellow ring); empty lunchbox hops + yellow ring on "lunch"',
      draw(lt, d, t) {
        const snap = lt > sn && lt < re, real = lt > re;
        desk(t, { steam: snap ? 1.6 : (real ? 0.7 : 1), look: real ? -0.9 : 0.8, eyes: real ? 'wide' : 'n', mouth: snap ? 'grin' : (real ? 'o' : 'flat'), hop: blip(lt, lu, 0.4),
          coworker: { eyes: lt > sn ? 'wide' : 'n', mouth: lt > sn ? 'o' : 'smile', brow: lt > sn ? 1 : 0.3 } });
        K.textBubble('#scribble', 640, 330, 300, 180, HX + 90, HEAD_TOP + 120, pop(lt, sn, 0.2) * out(lt, re - 0.1, 0.15));
        K.hiRing(140, DT - 40, 90, 60, pop(lt, re + 0.1, 0.25));
        K.hiRing(925, DT - 60, 110, 90, pop(lt, lu, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + sn, 'boing', { gain: 0.45 }); cue(st + sn, 'sizzle', { dur: 0.4, gain: 0.3 }); cue(st + re, 'pop', { gain: 0.45 }); cue(st + lu, 'pop', { gain: 0.55 });
  }

  // ── 6 · RE-HOOK "But here's the twist: hunger alone isn't enough." (new scene: white lab, hard push) ──
  {
    const st = at('but', 5), tw = Wd('twist', 5) - st, hu = Wd('hunger', 5) - st, al = Wd('alone', 5) - st, is = Wd("isn't", 5) - st, en = Wd('enough', 5) - st;
    const MX = 300, MS = 0.62, MY = 660;
    add({ id: 'S09', at: st, cam: [600, 640], zoom: 0.2, note: 'RE-HOOK, new scene: a white lab, the hero standing at the left (on screen at the cut), camera pushing hard; shock lines + wide eyes on "twist"; a cartoon stomach with a HUNGER pill pops on "hunger" and growls on "alone"; "+ ?" pops beside it on "isn\'t"; red NOT ENOUGH stamp on "enough"',
      draw(lt, d, t) {
        K.hgLab(960);
        const sur = lt > tw;
        K.man({ x: MX, y: MY, s: MS, look: 0.6, eyes: sur ? 'wide' : 'n', mouth: sur ? 'o' : 'flat', brow: sur ? 1 : 0.4 });
        K.shockLines(MX, MY - 330 * MS, 130, blip(lt, tw, 0.6));
        K.growlStomach(570, 560, 0.62, { t, growl: blip(lt, al, 0.6), sc: pop(lt, hu, 0.3), mood: 'mad' });
        K.pill('HUNGER', 570, 760, 44, C.ink, C.white, pop(lt, hu + 0.05));
        bigText('+', 775, 560, 110 * pop(lt, is), C.ink);
        bigText('?', 900, 560, 170 * pop(lt, is + 0.08), C.yellow, 0.1);
        K.stamp('NOT ENOUGH', 680, 900, 56, -0.08, pop(lt, en, 0.2) * lerp(1.5, 1, eo(seg(lt, en, en + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.5 }); cue(st + hu, 'pop', { gain: 0.5 }); cue(st + al, 'bubbles', { dur: 0.4, gain: 0.3 }); cue(st + is, 'pop', { gain: 0.45 }); cue(st + en, 'thud', { gain: 0.6 });
  }

  // ── lab screen (S10, S11) ──
  const screen = (x0, y0, x1, y1) => {
    rr(x0 - 16, y0 - 16, x1 - x0 + 32, y1 - y0 + 32, 26); ctx.fillStyle = C.ink; ctx.fill();
    rr(x0, y0, x1 - x0, y1 - y0, 14); ctx.fillStyle = '#F7F4EE'; ctx.fill();
  };

  // ── 7a · "Hungry people rated symbols after nasty" ──
  {
    const st = at('hungry', 6), pe = Wd('people', 6) - st, ra = Wd('rated', 6) - st, sy = Wd('symbols', 6) - st, na = Wd('nasty', 6) - st;
    add({ id: 'S10', at: st, cam: [540, 600], zoom: 0.1, note: 'lab: a wall screen + a hungry hero (growling stomach badge) watching it from the lower left (on screen at the cut); "400+ US ADULTS" pill on "people"; three mood buttons pop under the screen on "rated"; the squiggle symbol card is on the screen from the cut and flashes yellow + bounces on "symbols"; a mild storm-cloud photo slides in before it on "nasty" and the red mood button lights',
      draw(lt, d, t) {
        K.hgLab(960);
        screen(110, 280, 970, 650);
        K.pill('400+ US ADULTS', 540, 200, 40, C.ink, C.white, pop(lt, pe));
        K.hgCard(330, 465, 0.85, 'storm', { sc: pop(lt, na, 0.25), t });
        ptr(490, 600, 465, pop(lt, na + 0.1, 0.2));
        K.hgCard(lerp(540, 750, eio(seg(lt, na - 0.05, na + 0.2))), 465, 0.85, 'glyph', { sc: pop(lt, 0.04, 0.25) * (1 + 0.12 * blip(lt, sy, 0.35)), hi: blip(lt, sy, 0.45) });
        const lit = pop(lt, na + 0.15, 0.25);
        K.hgMood(620, 790, 54 * (1 + 0.15 * lit), 'bad', pop(lt, ra));
        K.hgMood(760, 790, 54, 'flat', pop(lt, ra + 0.06));
        K.hgMood(900, 790, 54, 'calm', pop(lt, ra + 0.12));
        if (lit > 0) K.hiRing(620, 790, 80, 80, lit);
        K.man({ x: 300, y: 830, s: 0.45, look: 0.7, eyes: 'n', mouth: 'flat', brow: 0.6, frown: true });
        K.growlStomach(440, 850, 0.3, { t, growl: 0.5 + 0.5 * Math.sin(t * 3), rings: true });
      } });
    cue(st, 'whoosh'); cue(st + pe, 'pop', { gain: 0.4 }); cue(st + ra, 'pop', { gain: 0.35 }); cue(st + sy, 'pop', { gain: 0.55 }); cue(st + na, 'slide', { dur: 0.25, gain: 0.35 });
  }

  // ── 7b · "or neutral photos." ──
  {
    const st = at('or', 6), ne = Wd('neutral', 6) - st, ph = Wd('photos', 6) - st;
    const R1 = 450, R2 = 740;
    add({ id: 'S11', at: st, cam: [540, 600], zoom: 0.08, note: 'lab screen with two rows (row 1 on screen at the cut: storm photo -> same squiggle -> red face); row 2 on "neutral": a plain mug photo -> the same squiggle -> grey neutral face; both photo cards flash yellow on "photos"',
      draw(lt, d, t) {
        K.hgLab(1080);
        screen(90, 300, 990, 890);
        const flash = blip(lt, ph, 0.45);
        K.hgCard(230, R1, 0.62, 'storm', { t, hi: flash }); ptr(345, 445, R1, 1); K.hgCard(560, R1, 0.62, 'glyph'); K.hgMood(830, R1, 56, 'bad', 1);
        const s2 = pop(lt, ne, 0.25);
        K.hgCard(230, R2, 0.62, 'mug', { sc: s2, hi: flash }); ptr(345, 445, R2, clamp(s2)); K.hgCard(560, R2, 0.62, 'glyph', { sc: s2 }); K.hgMood(830, R2, 56, 'flat', pop(lt, ne + 0.2));
        K.pill('SAME SYMBOL', 560, 1000, 40, C.ink, C.white, pop(lt, ph + 0.05));
      } });
    cue(st, 'whoosh'); cue(st + ne, 'pop', { gain: 0.55 }); cue(st + ne + 0.2, 'tock', { gain: 0.3 }); cue(st + ph, 'pop', { gain: 0.45 });
  }

  // ── 8 · ANSWER "Answer: only bad moments, after nasty photos." ──
  {
    const st = at('answer', 7), an = Wd('answer', 7) - st, on = Wd('only', 7) - st, mo = Wd('moments', 7) - st, ph = Wd('photos', 7) - st;
    add({ id: 'S12', at: st, cam: [540, 650], zoom: 0.07, note: 'ANSWER: the guess rows + A / B pills in the same spots (on screen at the cut); "?" bounces on "Answer"; on "only" the check lands on B ONLY BAD MOMENTS, row A dims, row B glows; ring on row B\'s storm photo on "moments"; storm photo flashes on "photos"; COMMENT A OR B pill ~1.2 s (not voiced)',
      draw(lt, d, t) {
        plain();
        bigText('?', 960, 200, 150 * (lt < on ? 1 : out(lt, on, 0.2)) * (1 + 0.2 * blip(lt, an, 0.3)), C.yellow, 0.12);
        const dm = seg(lt, on, on + 0.3);
        row(RA, ['bad', 'bad'], { dim: dm, t });
        row(RB, ['bad', 'flat'], { hi: blip(lt, on, 0.7), ring: pop(lt, mo, 0.25), cardHi: blip(lt, ph, 0.45), t });
        K.abPill('A', 'EVERYTHING', PILL_A[0], PILL_A[1], 40, { dim: dm });
        K.abPill('B', 'ONLY BAD MOMENTS', PILL_B[0], PILL_B[1], 40, { check: pop(lt, on, 0.3), hi: blip(lt, on, 0.45) });
        K.pill('COMMENT A OR B', 540, 1105, 44, C.ink, C.yellow, pop(lt, on + 0.4, 0.25) * out(lt, on + 1.6, 0.2));
      } });
    cue(st, 'whoosh'); cue(st + an, 'tock', { gain: 0.35 }); cue(st + on, 'pop', { gain: 0.8 }); cue(st + mo, 'pop', { gain: 0.4 }); cue(st + on + 0.4, 'pop', { gain: 0.3 }); cue(st + ph, 'tock', { gain: 0.3 });
  }

  // ── 9 · "People who noticed their feelings didn't get hangry." ──
  {
    const st = at('people', 8), no = Wd('noticed', 8) - st, fe = Wd('feelings', 8) - st, ha = Wd('hangry', 8) - st;
    const MX = 470, MY = 1000, MS = 1.0, NOTE_ARM = { e: [250, -30], h: [290, -170] };
    add({ id: 'S13', at: st, cam: [520, 700], zoom: 0.1, note: 'lab: the hero close (on screen at the cut) with red steam over his head; a sticky note pops into his hand on "noticed" and he looks at it; it reads "I\'M HUNGRY" on "feelings"; on "hangry" the steam fades, brows relax, calm smile + sparkle',
      draw(lt, d, t) {
        K.hgLab(1080);
        const calm = eio(seg(lt, ha - 0.05, ha + 0.4)), hand = eo(seg(lt, no - 0.15, no + 0.15));
        K.man({ x: MX, y: MY, s: MS, look: lt > no ? 0.5 : 0.1, lookY: lt > no ? 0.4 : 0, eyes: 'n', mouth: calm > 0.5 ? 'smile' : 'flat', brow: lerp(0.95, 0.2, calm), frown: calm < 0.5,
          arm: K.armPose(K.ARM.down, NOTE_ARM, hand),
          holding: (x, y) => K.stickyNote(x + 10, y - 80, 1.5, lt > fe ? ["I'M", 'HUNGRY'] : [''], 0.06, pop(lt, no - 0.05, 0.25)) });
        K.hgSteam(MX, MY - 480 * MS + 10, 1.1, t, 1 - calm);
        K.sparkle4(MX + 260, MY - 470, 55, blip(lt, ha + 0.1, 0.6));
      } });
    cue(st, 'whoosh'); cue(st + no, 'pop', { gain: 0.5 }); cue(st + fe, 'slide', { dur: 0.3, gain: 0.25 }); cue(st + ha, 'sparkle', { dur: 0.6, gain: 0.35 });
  }

  // ── 10a · TEASE "Next Body File: paper cuts, and screaming fingertips." (starts on "Next") ──
  const badge = (x, y, sc, size = 44) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = at('next', 9), bo = Wd('body', 9) - st, pa = Wd('paper', 9) - st, cu = Wd('cuts', 9) - st, sc = Wd('screaming', 9) - st, fi = Wd('fingertips', 9) - st;
    const FX = 400, FY = 720;
    add({ id: 'S14', at: st, cam: [540, 640], zoom: 0.08, note: 'tease (cut on "Next"): a big fingertip + yellow NEXT pill on screen at the cut; BODY FILES badge on "Body"; a sheet of paper slides in to touch its side on "paper"; yellow burst + small red zap on "cuts" (no wound shown); the nerve endings inside light up with zaps on "screaming"; yellow ring + "PACKED WITH NERVES" pill on "fingertips"',
      draw(lt, d, t) {
        plain();
        const px = lerp(1350, 700, eio(seg(lt, pa - 0.05, pa + 0.3)));
        K.hgPaper(px, 620, 0.95, -0.25);
        K.hgFingertip(FX, FY, 1.0, { zap: lt < sc ? 0.35 * pop(lt, cu, 0.25) : 0.35 + 0.65 * eo(seg(lt, sc, sc + 0.35)), t, sc: enter(lt) });
        K.burst(530, 600, 1.4, blip(lt, cu, 0.4));
        K.hiRing(FX, FY - 50, 170, 170, pop(lt, fi, 0.25));
        K.pill('NEXT', 540, 170, 64, C.yellow, C.ink, pop(lt, 0.03, 0.25));
        badge(540, 290, pop(lt, bo));
        K.pill('PACKED WITH NERVES', 600, 1100, 40, C.ink, C.white, pop(lt, fi + 0.05));
      } });
    cue(st, 'whoosh'); cue(st + 0.03, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.4 }); cue(st + pa, 'slide', { dur: 0.3, gain: 0.35 }); cue(st + cu, 'zip', { gain: 0.5 });
    cue(st + sc, 'sizzle', { dur: 0.4, gain: 0.3 }); cue(st + fi, 'pop', { gain: 0.55 });
  }

  // ── 10b · LOOP "Still hungry?" (back to the exact frame-1 picture) ──
  {
    const st = at('still', 9), hu = Wd('hungry', 9) - st, Z = 0;
    add({ id: 'S15', at: st, cam: HOOK_CAM, zoom: Z, note: 'LOOP + END CARD: the frame-1 desk (on screen at the cut, scene clock wrapped so the last frame = frame 0: steam, spinner); steam flares + lunchbox hops on "hungry"; tag + A / B pills pop back after "hungry" so the last frame = frame 1 (same camera, no push); end card from ~0.5 s: paper-cut badge + NEXT top right, BODY FILES + FOLLOW side by side top left',
      draw(lt, d, t) {
        const tl = t - T_LAST;
        desk(tl, { steam: 1 + 0.7 * blip(lt, hu, 0.5), hop: blip(lt, hu, 0.4) });
        const back = pop(lt, hu + 0.35, 0.3);
        hookTag(back); hookPills(back);
        const k = (1 + 0.13 * (1 - eo(clamp(lt / 0.32)))) * (1 + Z * eio(clamp(lt / d)));
        ctx.save(); ctx.translate(HOOK_CAM[0], HOOK_CAM[1]); ctx.scale(1 / k, 1 / k); ctx.translate(-HOOK_CAM[0], -HOOK_CAM[1]);
        K.hgPaperBadge(890, 165, 0.5, pop(lt, 0.5, 0.3), t);
        K.pill('NEXT', 890, 285, 36, C.yellow, C.ink, pop(lt, 0.55, 0.3));
        badge(205, 120, pop(lt, 0.5, 0.3), 34);
        K.followPill(500, 120, pop(lt, 0.7), t, 38);
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + 0.5, 'pop', { gain: 0.4 }); cue(st + 0.7, 'pop', { gain: 0.5 }); cue(st + hu, 'sizzle', { dur: 0.4, gain: 0.3 }); cue(st + hu + 0.35, 'pop', { gain: 0.35 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES, loop: true };
}
