// WHAT HAPPENS WHEN YOU GET A PAPER CUT?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): extreme close-up of a big fingertip sliding along the top edge of a white paper card,
// a cyan nerve map glowing through the pad, a thin red line just appearing, "2-3 DAYS TO HEAL" tag + A GLITCH / B GUARD pills.
// Scene clock: hookScene(tl) with tl = 0 at frame 0; the loop shot uses tl = t - T_LAST so the last frame = frame 0.
// Cuts sit on caption-chunk starts (word start - 0.05) so no caption runs past a cut.
// Guess (S03) A GLITCH / B GUARD pop on "glitch" / "guard". Re-hook (S08): hard zoom into the cut (new place: under the skin).
// Answer (S11): same layout as the guess, check on B on "guard", COMMENT A OR B ~1.2 s across S11-S12.
// Tease (S14, from "Next"): sore hero + NEXT. Loop (S15 "to hit"): back to the frame-1 fingertip + end-card badges.
import { ctx, C, W, H, TAU, clamp, lerp, seg, eo, eio, eob, line, bigText, rr, circle, ell } from './core/lib.js';
import { T, Wd } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const at = (w, i) => Wd(w, i) - 0.05;          // cut = the caption chunk's start
  const plain = (col = C.bg) => { ctx.fillStyle = col; ctx.fillRect(-300, -300, W + 600, H + 600); };
  const pop = (lt, a, d = 0.3) => (lt > a ? eob(seg(lt, a, a + d)) : 0);
  const out = (lt, a, d = 0.25) => 1 - eio(seg(lt, a, a + d));
  const blip = (lt, a, d = 0.35) => (lt > a ? Math.sin(Math.PI * seg(lt, a, a + d)) : 0);
  const enter = (lt) => lerp(0.86, 1, eob(seg(lt, 0, 0.25)));
  const T_LAST = (Math.ceil(T.dur * 30 - 1e-6) - 1) / 30;   // time of the film's last rendered frame
  const smallText = (txt, x, y, size, col = C.ink, a = 1) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.font = `900 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(txt, x, y); ctx.restore(); };

  // ── the hook set: fingertip on the paper edge (frame 1 + loop) ──
  const PX0 = 70, PYL = 760, PX1 = 1010, PYR = 720, ANG = -0.45, FS = 1, R = 105;
  const edgeY = (x) => lerp(PYL, PYR, (x - PX0) / (PX1 - PX0));
  // tip x along the edge: linear through tl = 0 (x 560), eases to a stop at x 380 by tl 1.2
  const slideX = (tl) => (tl <= 0.6 ? 560 - 200 * tl : 440 - 60 * (1 - Math.pow(1 - seg(tl, 0.6, 1.2), 2)));
  const lift = (tl) => 70 * (1 - eo(seg(tl, -1.45, -0.95)));          // finger lowered onto the edge before the slide
  const cutLen = (tl) => clamp((tl + 0.4) / 1.6);                      // 0.25 at frame 0 ("just appearing")
  const HOOK_CAM = [540, 700];
  const PA = [290, 1020], PB = [790, 1020], PSZ = 40;
  const hookPills = (o = {}) => { K.abPill('A', 'GLITCH', PA[0], PA[1], PSZ, o.a || {}); K.abPill('B', 'GUARD', PB[0], PB[1], PSZ, o.b || {}); };
  const hookTag = (hi = 0) => K.pill('2-3 DAYS TO HEAL', 380, 300, 46, C.yellow, C.ink, 1 + 0.08 * hi);
  const hookScene = (tl, { zing = 0, zap = 0 } = {}) => {
    plain();
    K.pcPaper(PX0, PYL, PX1, PYR, 340);
    const x = slideX(tl), cy = edgeY(x) - R * FS + 6 - lift(tl);
    const moving = tl > -0.95 && tl < 1.0 ? 1 - seg(tl, 0.7, 1.0) : 0;
    if (moving > 0) {   // slide lines trailing behind the fingertip (to its right, along the edge)
      ctx.save(); ctx.globalAlpha = moving;
      for (const k of [0, 1, 2]) line([[x + 150 + k * 20, cy + 20 + k * 34], [x + 250 + k * 40, cy + 20 + k * 34]], C.ink, 9);
      ctx.restore();
    }
    K.pcFinger(x, cy, FS, ANG, { nerves: 1, zing, cut: cutLen(tl), t: tl });
    K.painZap(x - 40, cy + R + 10, 0.8, zap, tl);
    return [x, cy];
  };

  // ── 1 · HOOK "What happens when you get a paper cut?" ──
  {
    const pa = Wd('paper', 0), cu = Wd('cut', 0);
    add({ id: 'S01', at: 0, cam: HOOK_CAM, zoom: 0.05, note: 'FRAME 1 = hook: extreme close-up, big fingertip sliding left along the top edge of a white paper card, cyan nerve map glowing through the pad, thin red cut line just appearing, "2-3 DAYS TO HEAL" tag + A GLITCH / B GUARD pills, all from frame 0; slide stops ~1.2 s; on "cut" the nerve endings flash yellow + a red pain zap pops at the contact',
      draw(lt, d, t) {
        hookScene(lt, { zing: blip(lt, cu, 0.5), zap: pop(lt, cu, 0.25) * (1 - seg(lt, cu + 0.45, cu + 0.6)) });
        hookTag(blip(lt, pa, 0.35));
        hookPills();
      } });
    cue(0.0, 'slide', { dur: 1.1, gain: 0.3 }); cue(pa, 'pop', { gain: 0.35 }); cue(cu, 'zip', { gain: 0.45 }); cue(cu + 0.05, 'slam', { gain: 0.35 });
  }

  // ── 2a · "It heals in two to three days." ──
  {
    const st = at('it', 1), he = Wd('heals', 1) - st, tw = Wd('two', 1) - st, th = Wd('three', 1) - st, da = Wd('days', 1) - st;
    const FX = 420, FY = 720;
    add({ id: 'S02', at: st, cam: [600, 680], zoom: 0.07, note: 'fingertip lying flat (pad up, thin red cut on top) + tear-off calendar "1 DAY", on screen at the cut; green sparkle on the cut on "heals"; calendar flips to 2 on "two", 3 on "three"; the cut line fades out, a green check + "2-3 DAYS" pill on "days"',
      draw(lt, d, t) {
        plain();
        const heal = eio(seg(lt, tw, da + 0.15));
        K.pcFinger(FX, FY, 1.05, Math.PI, { cut: 1 - heal, len: 1300 });
        K.sparkle4(FX - 20, FY - 150, 60, blip(lt, he, 0.6));
        const n = lt < tw ? '1' : lt < th ? '2' : '3';
        const flip = Math.max(blip(lt, tw, 0.25), blip(lt, th, 0.25));
        K.calendar(800, 600, 0.52 * enter(lt) * (1 + 0.05 * flip), n, n === '1' ? 'DAY' : 'DAYS', 0.06);
        K.checkMark(FX - 30, FY - 210, 1, pop(lt, da, 0.3));
        K.pill('2-3 DAYS', 540, 1040, 56, C.yellow, C.ink, pop(lt, da + 0.05));
      } });
    cue(st, 'whoosh'); cue(st + he, 'sparkle', { dur: 0.5, gain: 0.25 }); cue(st + tw, 'tock', { gain: 0.4 }); cue(st + th, 'tock', { gain: 0.4 }); cue(st + da, 'pop', { gain: 0.6 });
  }

  // ── guess / answer layout (S03, S11) ──
  const GL = [290, 610], GR = [790, 610], GPA = [290, 930], GPB = [790, 930], GPS = 44;

  // ── 2b · GUESS "Is that pain a glitch, or a guard?" ──
  {
    const st = at('is', 1), pn = Wd('pain', 1) - st, gl = Wd('glitch', 1) - st, gu = Wd('guard', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 640], zoom: 0.07, note: 'GUESS: a jittering red "glitch" warning sign (left) vs a blue shield (right), on screen at the cut; "PAIN?" pill with a red pain zap on "pain"; A GLITCH pops under the left one on "glitch" (sign jitters hard), B GUARD under the right one on "guard" (shield bounces)',
      draw(lt, d, t) {
        plain();
        K.pcGlitch(GL[0], GL[1], 0.95 * enter(lt) * (1 + 0.06 * blip(lt, gl, 0.35)), { t, amt: 0.4 + 0.6 * blip(lt, gl, 0.6) });
        K.pcShield(GR[0], GR[1] - 30 * blip(lt, gu, 0.35), 1.0, { sc: enter(lt) });
        bigText('?', 540, 600, 120, C.yellow, 0.1, enter(lt));
        K.painZap(420, 290, 0.6, pop(lt, pn), t);
        K.pill('PAIN?', 600, 290, 56, C.ink, C.white, pop(lt, pn));
        K.abPill('A', 'GLITCH', GPA[0], GPA[1], GPS, { sc: pop(lt, gl), hi: blip(lt, gl, 0.4) });
        K.abPill('B', 'GUARD', GPB[0], GPB[1], GPS, { sc: pop(lt, gu), hi: blip(lt, gu, 0.4) });
      } });
    cue(st, 'whoosh'); cue(st + pn, 'pop', { gain: 0.45 }); cue(st + gl, 'pop', { gain: 0.65 }); cue(st + gu, 'pop', { gain: 0.65 });
  }

  // ── 3 · "Fingertips scream because they're packed with nerves," (x-ray fingertip, dense nerve map) ──
  {
    const st = at('fingertips', 2), sc = Wd('scream', 2) - st, pk = Wd('packed', 2) - st, nv = Wd('nerves', 2) - st;
    const TX = 540, TY = 420;
    add({ id: 'S04', at: st, cam: [540, 450], zoom: 0.14, note: 'x-ray film: a big x-ray fingertip pointing up (cyan bones, two nerve cords, a first web of branches + endings), on screen at the cut; on "scream" the endings flash yellow, signals race down the cords + shock lines; on "packed" many more branches and endings fill the tip (dense map); "NERVES" tag on "nerves"',
      draw(lt, d, t) {
        K.xray(t);
        const lit = Math.max(blip(lt, sc, 0.7), 0.6 * seg(lt, nv, nv + 0.2));
        K.pcFingerX(TX, TY, 1.2, Math.PI / 2, { packed: eio(seg(lt, pk, pk + 0.45)), lit, t, len: 1400 });
        K.shockLines(TX, TY, 190, blip(lt, sc, 0.5));
        K.tag('NERVES', 830, 640, TX + 90, TY + 60, 48, pop(lt, nv));
      } });
    cue(st, 'whoosh'); cue(st + sc, 'slam', { gain: 0.35 }); cue(st + sc + 0.05, 'zip', { gain: 0.35 }); cue(st + pk, 'sparkle', { dur: 0.5, gain: 0.25 }); cue(st + nv, 'pop', { gain: 0.6 });
  }

  // ── nerve-map panels (S05) ──
  const MAPL = [285, 700], MAPR = [795, 700], MW = 400, MH = 520, SL = 300;

  // ── 4a · "so one slice hits way more nerve endings" (split screen) ──
  {
    const st = at('so', 3), sl = Wd('slice', 3) - st, mo = Wd('more', 3) - st, en = Wd('endings', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 680], zoom: 0.07, note: 'x-ray split screen, on screen at the cut: FINGERTIP nerve map (dense, fine print "RICHLY INNERVATED") vs BACK nerve map (sparse); on "slice" one identical yellow slice draws across both; on "more" the endings it hits light up yellow (many vs one); hit counters pop on "endings"',
      draw(lt, d, t) {
        K.xray(t);
        const o = { slice: eo(seg(lt, sl, sl + 0.3)), lit: pop(lt, mo, 0.25), sliceLen: SL, t };
        const hA = K.pcNerveMap(MAPL[0], MAPL[1], MW, MH, { ...o, step: 54, seed: 3, sc: enter(lt) });
        const hB = K.pcNerveMap(MAPR[0], MAPR[1], MW, MH, { ...o, step: 175, seed: 5, sc: enter(lt) });
        K.pill('FINGERTIP', MAPL[0], 360, 42, C.white, C.ink, 1);
        K.pill('BACK', MAPR[0], 360, 42, C.white, C.ink, 1);
        smallText('RICHLY INNERVATED', MAPL[0], 993, 20, C.cyan);
        K.pill(`${hA} HIT`, MAPL[0], 1070, 50, C.yellow, C.ink, pop(lt, en));
        K.pill(`${hB} HIT`, MAPR[0], 1070, 50, C.white, C.ink, pop(lt, en + 0.08));
      } });
    cue(st, 'whoosh'); cue(st + sl, 'zip', { gain: 0.45 }); cue(st + mo, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + en, 'pop', { gain: 0.55 }); cue(st + en + 0.08, 'pop', { gain: 0.4 });
  }

  // ── 4b · "than the same cut on your back." (body map: where the back is) ──
  {
    const st = at('than', 3), sa = Wd('same', 3) - st, cu = Wd('cut', 3) - st, bk = Wd('back', 3) - st;
    const SX = 300, SY = 600, SS = 0.74, BACK = [SX + 40, SY - 90], LZ = [790, 560], LR = 200;
    add({ id: 'S06', at: st, cam: [560, 640], zoom: 0.08, note: 'grey body silhouette seen from behind (left) + an x-ray lens on its back showing the sparse BACK nerve map (right), on screen at the cut; on "same" the same yellow slice draws in the lens (and a small yellow mark on the silhouette\'s back); on "cut" its one ending lights up; "BACK" tag on "back"',
      draw(lt, d, t) {
        plain();
        K.silhouette(SX, SY, SS, {});
        ctx.save(); ctx.globalAlpha = 0.9; line([[BACK[0], BACK[1]], [LZ[0] - LR, LZ[1] + 20]], C.ink, 8); ctx.restore();
        const sl = eo(seg(lt, sa, sa + 0.3));
        if (sl > 0) { line([[BACK[0] - 40, BACK[1]], [BACK[0] - 40 + 80 * sl, BACK[1]]], C.ink, 16); line([[BACK[0] - 40, BACK[1]], [BACK[0] - 40 + 80 * sl, BACK[1]]], C.yellow, 8); }
        K.lens(LZ[0], LZ[1], LR, enter(lt), () => { K.pcNerveMap(0, 0, 2 * LR + 40, 2 * LR + 40, { step: 175, seed: 5, slice: sl, lit: pop(lt, cu, 0.25), sliceLen: SL, t }); }, C.xnavy);
        K.tag('BACK', 790, 900, 790, LZ[1] + LR + 10, 52, pop(lt, bk));
      } });
    cue(st, 'whoosh'); cue(st + sa, 'zip', { gain: 0.4 }); cue(st + cu, 'pop', { gain: 0.35 }); cue(st + bk, 'pop', { gain: 0.6 });
  }

  // ── 5 · "It's less about the cut's size, more about the spot." (same size, different spot) ──
  {
    const st = at("it's", 4), le = Wd('less', 4) - st, sz = Wd('size', 4) - st, mo = Wd('more', 4) - st, sp = Wd('spot', 4) - st;
    const TPX = 290, BPX = 790, PY = 560, CL = 240;
    add({ id: 'S07', at: st, cam: [540, 620], zoom: 0.07, note: 'two skin swatches with the same thin red cut, on screen at the cut: FINGERTIP (fingerprint whorl) vs BACK (spine groove); on "size" a ruler slides under each (same length) + "=" + "SAME SIZE" pill; on "more" the back swatch dims and the fingertip bounces; a red map pin drops onto the fingertip cut on "spot"',
      draw(lt, d, t) {
        plain();
        const dim = seg(lt, mo, mo + 0.3);
        K.pcSkinPanel(TPX, PY, 400, 420, 'tip', { cut: 1, sliceLen: CL, sc: enter(lt) * (1 + 0.05 * blip(lt, mo, 0.35)) });
        ctx.save(); ctx.globalAlpha = 1 - 0.5 * dim; K.pcSkinPanel(BPX, PY, 400, 420, 'back', { cut: 1, sliceLen: CL, sc: enter(lt) }); ctx.restore();
        K.pill('FINGERTIP', TPX, 300, 40, C.ink, C.white, 1);
        K.pill('BACK', BPX, 300, 40, C.ink, C.white, 1);
        const ru = eo(seg(lt, sz - 0.05, sz + 0.3));
        if (ru > 0) { K.pcRuler(lerp(-200, TPX, ru), 860, CL, 1); K.pcRuler(lerp(1280, BPX, ru), 860, CL, 1); }
        bigText('=', 540, 860, 110, C.yellow, 0, pop(lt, sz + 0.15));
        K.pill('SAME SIZE', 540, 1040, 54, C.yellow, C.ink, pop(lt, sz + 0.1) * out(lt, sp - 0.1, 0.15));
        if (lt > sp - 0.05) K.mapPin(TPX, lerp(300, PY - 10, eo(seg(lt, sp - 0.05, sp + 0.2))), 0.75, 1);
        K.pill('THE SPOT', 540, 1040, 54, C.yellow, C.ink, pop(lt, sp + 0.05));
      } });
    cue(st, 'whoosh'); cue(st + sz, 'slide', { dur: 0.35, gain: 0.3 }); cue(st + sz + 0.15, 'pop', { gain: 0.5 }); cue(st + mo, 'boing', { gain: 0.3 }); cue(st + sp + 0.15, 'thud', { gain: 0.6 });
  }

  // ── 6a · RE-HOOK "But here's the weird part:" (hard zoom into the cut, a lens opens under the skin) ──
  const SEC = (x, y, w, h, o) => K.pcSkinSection(x, y, w, h, o);
  {
    const st = at('but', 5), he = Wd('here', 5) - st, we = Wd('weird', 5) - st, pa = Wd('part', 5) - st;
    const FX = 760, FY = 800, CUT = [FX - 70 * 1.25 + 95, FY - 90];
    add({ id: 'S08', at: st, cam: [CUT[0], CUT[1] - 40], zoom: 0.45, note: 'RE-HOOK, new place: huge fingertip lying flat (pad up, thin red cut on top), on screen at the cut, camera pushes hard into the cut; yellow ring on the cut on "here\'s"; on "weird" a lens opens on the cut showing what is under the skin (tiny red capillary loops), it grows on "part"',
      draw(lt, d, t) {
        plain();
        K.pcFinger(FX, FY, 1.25, Math.PI, { cut: 1, len: 1500 });
        K.hiRing(CUT[0], CUT[1] + 6, 150, 56, blip(lt, he, 0.5));
        const lz = pop(lt, we, 0.3) * (1 + 0.08 * eo(seg(lt, pa, pa + 0.35)));
        K.lens(CUT[0] - 90, CUT[1] - 230, 170, lz, () => { SEC(0, 40, 520, 520, { crowd: 0.3, cut: 0.6, t }); }, C.bg);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'zip', { gain: 0.4 }); cue(st + he, 'pop', { gain: 0.4 }); cue(st + we, 'boing', { gain: 0.4 }); cue(st + pa, 'pop', { gain: 0.45 });
  }

  // ── 6b · "tiny vessels crowd under that skin, so it bleeds more." (skin cross-section) ──
  {
    const st = at('tiny', 5), ve = Wd('vessels', 5) - st, cr = Wd('crowd', 5) - st, sk = Wd('skin', 5) - st, so = Wd('so', 5) - st, bl = Wd('bleeds', 5) - st, mo = Wd('more', 5) - st;
    const SCX = 540, SCY = 640, SW = 920, SH = 720;
    add({ id: 'S09', at: st, cam: [540, 560], zoom: 0.07, note: 'under the skin, on screen at the cut: skin cross-section (skin layer, pink layer below, a few tiny red capillary loops); "TINY VESSELS" tag on "vessels"; on "crowd" many more loops pop up under the surface; yellow ring on the skin layer on "skin"; on "so" a thin ink slice cuts down into the loops; three schematic red dots pop on the surface on "bleeds"; "BLEEDS MORE" pill on "more"',
      draw(lt, d, t) {
        plain();
        const g = SEC(SCX, SCY, SW, SH, { crowd: lerp(0.25, 1, eo(seg(lt, cr, cr + 0.5))), cut: eio(seg(lt, so, bl)), cutX: 60, dots: 3 * seg(lt, bl, bl + 0.35), t });
        K.hiRing(SCX, (g.surf + g.loops) / 2 - 10, 440, 70, blip(lt, sk, 0.5));
        K.tag('TINY VESSELS', 540, 1100, 540 - 140, g.loops + 120, 48, pop(lt, ve) * out(lt, mo - 0.1, 0.12));
        K.pill('BLEEDS MORE', 540, 1100, 54, C.yellow, C.ink, pop(lt, mo));
      } });
    cue(st, 'whoosh'); cue(st + ve, 'pop', { gain: 0.5 }); cue(st + cr, 'bubbles', { dur: 0.5, gain: 0.3 }); cue(st + sk, 'pop', { gain: 0.35 });
    cue(st + so, 'zip', { gain: 0.35 }); cue(st + bl, 'plop', { gain: 0.4 }); cue(st + bl + 0.12, 'plop', { gain: 0.35 }); cue(st + bl + 0.24, 'plop', { gain: 0.3 }); cue(st + mo, 'pop', { gain: 0.6 });
  }

  // ── 7 · RELATABLE "Ever bled loads from a cut you could barely see?" (giant bandage, hairline cut) ──
  {
    const st = at('ever', 6), bd = Wd('bled', 6) - st, lo = Wd('loads', 6) - st, cu = Wd('cut', 6) - st, ba = Wd('barely', 6) - st, se = Wd('see', 6) - st;
    const MX = 360, MY = 600, MS = 0.75, HND = [MX + 205 * MS, MY - 300 * MS], BAND = [HND[0], HND[1] - 46 * MS], LZ = [835, 330], LR = 135;
    add({ id: 'S10', at: st, cam: [560, 560], zoom: 0.08, note: 'RELATABLE + rewatch: the hero holds up his finger wrapped in a comically huge bandage, looking at it (on screen at the cut); three red dots soak into the bandage pad on "bled"/"loads"; on "cut" a lens pops top right; inside it the real cut, a hairline, gets a yellow ring on "barely"; on "see" he squints, brows up, "?" pops',
      draw(lt, d, t) {
        plain();
        ell(MX, MY + 620 * MS, 190, 26, C.floor);
        const sq = lt > se;
        K.man({ x: MX, y: MY, s: MS, arm: K.ARM.point, finger: 0, eyes: sq ? 'closed' : 'wide', mouth: sq ? 'flat' : 'o', brow: sq ? 1 : 0.6, look: 1 });
        const bw = 92 * MS * (1 + 0.06 * blip(lt, lo, 0.35)), bh = 175 * MS;
        K.pcBandage(BAND[0], BAND[1], bw * 1.45, bh * 1.25, 0, enter(lt));
        for (let k = 0; k < 3; k++) { const a = seg(lt, bd + k * 0.12, bd + k * 0.12 + 0.2); if (a > 0) circle(BAND[0] - 16 + k * 16, BAND[1] - 8 + (k % 2) * 16, 9 * a, C.red); }
        ctx.save(); ctx.globalAlpha = clamp(pop(lt, cu)); line([[BAND[0] + 60, BAND[1] - 40], [LZ[0] - LR - 4, LZ[1] + 30]], C.ink, 8); ctx.restore();
        K.lens(LZ[0], LZ[1], LR, pop(lt, cu), () => {
          ctx.fillStyle = C.skin; ctx.fillRect(-LR, -LR, 2 * LR, 2 * LR);
          for (let k = 1; k < 8; k++) { ctx.beginPath(); ctx.ellipse(0, 40, k * 22, k * 26, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.strokeStyle = C.skinShade; ctx.lineWidth = 6; ctx.stroke(); }
          line([[-50, -6], [50, 4]], C.red, 3);
          K.hiRing(0, 0, 80, 34, pop(lt, ba, 0.25));
        });
        smallText('HAIRLINE', LZ[0], LZ[1] + LR + 44, 26, C.ink, pop(lt, ba));
        bigText('?', MX - 170, MY - 380, 120, C.yellow, -0.12, pop(lt, se));
      } });
    cue(st, 'whoosh'); cue(st + bd, 'plop', { gain: 0.35 }); cue(st + lo, 'boing', { gain: 0.4 }); cue(st + cu, 'pop', { gain: 0.45 }); cue(st + ba, 'pop', { gain: 0.45 }); cue(st + se, 'boing', { gain: 0.35 });
  }

  // ── 8a · ANSWER "Answer: guard." ──
  const COMMENT = [540, 1100];
  {
    const st = at('answer', 7), gu = Wd('guard', 7) - st;
    add({ id: 'S11', at: st, cam: [540, 640], zoom: 0.06, note: 'ANSWER: the guess layout + both pills in the same spots (on screen at the cut); on "guard" the shield snaps big with "GUARD" on it, the check lands on B GUARD, A + the glitch sign dim; COMMENT A OR B pill pops 0.2 s later and stays into the next shot (~1.2 s, not voiced)',
      draw(lt, d, t) {
        plain();
        const dm = seg(lt, gu, gu + 0.3);
        ctx.save(); ctx.globalAlpha = 1 - 0.55 * dm; K.pcGlitch(GL[0], GL[1], 0.95, { t, amt: 0.4 * (1 - dm) }); ctx.restore();
        const sn = lt > gu ? lerp(1.5, 1.15, eo(seg(lt, gu, gu + 0.22))) : 1;
        K.pcShield(GR[0], GR[1], sn, { label: lt > gu ? 'GUARD' : '' });
        bigText('?', 540, 600, 120, C.yellow, 0.1, 1 - dm);
        K.abPill('A', 'GLITCH', GPA[0], GPA[1], GPS, { dim: dm });
        K.abPill('B', 'GUARD', GPB[0], GPB[1], GPS, { check: pop(lt, gu, 0.3), hi: blip(lt, gu, 0.45) });
        K.pill('COMMENT A OR B', COMMENT[0], COMMENT[1], 46, C.ink, C.yellow, pop(lt, gu + 0.2, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + gu, 'slam', { gain: 0.45 }); cue(st + gu + 0.05, 'pop', { gain: 0.7 }); cue(st + gu + 0.2, 'pop', { gain: 0.3 });
  }

  // ── 8b · "The sting makes you baby it." (hero at his desk, finger held away from the laptop) ──
  {
    const st = at('the', 7), sg = Wd('sting', 7) - st, ba = Wd('baby', 7) - st;
    const MX = 300, MY = 660, MS = 0.7;
    add({ id: 'S12', at: st, cam: [540, 620], zoom: 0.07, note: 'hero at his desk behind a laptop, holding his small-bandaged finger up and away from it (on screen at the cut), B GUARD + check pill at top, COMMENT A OR B carried over until ~0.7 s; red pain zap at the fingertip on "sting" (wince); on "baby" a yellow ring + small shield on the finger, he smiles',
      draw(lt, d, t) {
        plain();
        const up = eo(seg(lt, sg, sg + 0.3)), happy = lt > ba;
        const pose = K.armPose(K.ARM.point, { e: [250, -140], h: [250, -360] }, up);
        K.man({ x: MX, y: MY, s: MS, arm: pose, finger: 0.15, eyes: lt > sg && !happy ? 'closed' : 'n', mouth: happy ? 'smile' : lt > sg ? 'flat' : 'o', brow: 0.5, look: 1 });
        const F = 0.15, hx = MX + pose.h[0] * MS, hy = MY + pose.h[1] * MS, tip = [hx + Math.sin(F) * 86 * MS, hy - Math.cos(F) * 86 * MS];
        K.pcBandage(hx + Math.sin(F) * 52 * MS, hy - Math.cos(F) * 52 * MS, 44, 28, F, 1);
        // desk (front panel ends at y 1110) + open laptop seen from behind
        rr(120, 880, 840, 30, 10); ctx.fillStyle = C.gumEdge; ctx.fill();
        rr(150, 905, 780, 205, 10); ctx.fillStyle = C.floor; ctx.fill();
        rr(470, 980, 140, 22, 11); ctx.fillStyle = C.gumEdge; ctx.fill();
        rr(500, 650, 330, 225, 18); ctx.fillStyle = '#9A9A9F'; ctx.fill(); rr(510, 660, 310, 205, 12); ctx.fillStyle = '#B9B9BE'; ctx.fill(); circle(665, 762, 18, C.white);
        rr(480, 868, 370, 16, 6); ctx.fillStyle = '#9A9A9F'; ctx.fill();
        K.painZap(tip[0], tip[1] - 30, 0.55, pop(lt, sg) * out(lt, ba - 0.15, 0.15), t);
        K.hiRing(tip[0], tip[1] + 30, 62, 62, pop(lt, ba, 0.25));
        K.pcShield(tip[0] + 110, tip[1] - 70, 0.3, { sc: pop(lt, ba + 0.05) });
        K.abPill('B', 'GUARD', 470, 200, 40, { check: 1 });
        K.pill('COMMENT A OR B', COMMENT[0], COMMENT[1], 46, C.ink, C.yellow, out(lt, 0.7, 0.15));
      } });
    cue(st, 'whoosh'); cue(st + sg, 'zip', { gain: 0.4 }); cue(st + sg + 0.03, 'pop', { gain: 0.35 }); cue(st + ba, 'sparkle', { dur: 0.4, gain: 0.25 });
  }

  // ── 9 · "Won't heal, especially with diabetes? Get it checked." (calm clinic) ──
  {
    const st = at('won', 8), he = Wd('heal', 8) - st, di = Wd('diabetes', 8) - st, ge = Wd('get', 8) - st, ch = Wd('checked', 8) - st;
    const CX = 300, CY = 580, DX = 770, DY = 640;
    add({ id: 'S13', at: st, cam: [540, 620], zoom: 0.06, note: 'tear-off calendar at "3 DAYS" (left) + a calm clinic with a red-cross sign (right), on screen at the cut; on "heal" the calendar flips to "3+" DAYS; "DIABETES?" pill on "diabetes"; the clinic door swings open (yellow light) on "get", green check on "checked"',
      draw(lt, d, t) {
        plain();
        const k = seg(lt, he, he + 0.3), n = k < 0.01 ? '3' : '3+';
        K.calendar(CX, CY, 0.55 * enter(lt) * (1 + 0.06 * blip(lt, he, 0.3)), n, 'DAYS', -0.05);
        K.pill('DIABETES?', CX, 900, 52, C.ink, C.white, pop(lt, di));
        K.pcClinic(DX, DY, 0.78, { open: eo(seg(lt, ge, ge + 0.35)), sc: enter(lt) });
        K.checkMark(DX + 150, DY - 215, 1.0, pop(lt, ch, 0.3));
      } });
    cue(st, 'whoosh'); cue(st + he, 'tock', { gain: 0.35 }); cue(st + he + 0.3, 'tock', { gain: 0.35 }); cue(st + di, 'pop', { gain: 0.5 }); cue(st + ge, 'slide', { dur: 0.35, gain: 0.3 }); cue(st + ch, 'pop', { gain: 0.7 });
  }

  // ── 10a · TEASE "Next Body File: why soreness waits days to" (starts on "Next") ──
  const badge = (x, y, sc, size = 44) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = at('next', 9), bo = Wd('body', 9) - st, so = Wd('soreness', 9) - st, wa = Wd('waits', 9) - st, da = Wd('days', 9) - st;
    const MX = 370, MY = 680, MS = 0.62;
    add({ id: 'S14', at: st, cam: [540, 640], zoom: 0.08, note: 'tease (cut on "Next"): NEXT pill + the hero (arms down) next to a dumbbell, on screen at the cut; BODY FILES badge on "Body"; on "soreness" red pain zaps pop on his arm and thigh (he winces); on "waits" a small calendar pops "DAY 1", flips to "DAY 2" on "days"',
      draw(lt, d, t) {
        plain();
        ell(MX, MY + 620 * MS, 170, 22, C.floor);
        const sore = lt > so;
        K.man({ x: MX, y: MY, s: MS, arm: sore ? K.ARM.hip : K.ARM.down, eyes: sore ? 'closed' : 'n', mouth: sore ? 'flat' : 'smile', brow: sore ? 0.1 : 0.4, frown: sore, look: 0.5 });
        K.sitDumbbell(MX + 260, MY + 560 * MS, 0.7, 0, enter(lt));
        K.painZap(MX - 150 * MS, MY - 80 * MS, 0.5, pop(lt, so), t);
        K.painZap(MX + 70 * MS, MY + 330 * MS, 0.5, pop(lt, so + 0.1), t);
        const day = lt < da ? '1' : '2';
        K.calendar(810, 640, 0.36 * pop(lt, wa) * (1 + 0.06 * blip(lt, da, 0.3)), day, day === '1' ? 'DAY' : 'DAYS', 0.08);
        K.pill('NEXT', 540, 190, 64, C.yellow, C.ink, pop(lt, 0.03, 0.25));
        badge(540, 310, pop(lt, bo));
      } });
    cue(st, 'whoosh'); cue(st + 0.03, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.4 }); cue(st + so, 'zip', { gain: 0.35 }); cue(st + so + 0.05, 'pop', { gain: 0.4 }); cue(st + wa, 'pop', { gain: 0.45 }); cue(st + da, 'tock', { gain: 0.45 });
  }

  // ── 10b · LOOP "to hit." (back to the exact frame-1 picture + end card) ──
  {
    const st = at('to', 9), hi = Wd('hit', 9) - st;
    add({ id: 'S15', at: st, cam: HOOK_CAM, zoom: 0, note: 'LOOP + END CARD: the frame-1 fingertip over the paper edge (scene clock wrapped so the last frame = frame 0): the finger lowers onto the edge and slides into the frame-1 pose, the red line just appearing at the very end; same tag + A / B pills; end card from ~0.35 s: BODY FILES + FOLLOW (left), sore-arm badge + NEXT (top right)',
      draw(lt, d, t) {
        const tl = t - T_LAST;
        hookScene(tl);
        hookTag(blip(lt, hi, 0.35));
        hookPills();
        badge(230, 440, pop(lt, 0.35, 0.3), 32);
        K.followPill(230, 520, pop(lt, 0.55), t, 36);
        K.pcSoreBadge(940, 150, 0.4, pop(lt, 0.35, 0.3), t);
        K.pill('NEXT', 940, 235, 30, C.yellow, C.ink, pop(lt, 0.4, 0.3));
      } });
    cue(st, 'whoosh'); cue(st + 0.35, 'pop', { gain: 0.4 }); cue(st + 0.55, 'pop', { gain: 0.5 }); cue(T_LAST - 0.9, 'slide', { dur: 0.9, gain: 0.25 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES, loop: true };
}
