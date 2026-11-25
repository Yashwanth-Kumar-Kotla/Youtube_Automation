// WHAT HAPPENS WHEN YOU DON'T DRINK ENOUGH WATER?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): desk close-up, steaming coffee mug (left) + glass of water (right), "6-8 GLASSES A DAY"
// tally card above (3 water glasses drunk, the coffee mug only a faint pencil sketch = rewatch), small pee-colour strip on the
// wall with the marker on dark-ish (rewatch: he's behind on water), pills A COFFEE COUNTS / B ONLY WATER on the desk front.
// Cuts sit on caption-chunk starts (word start - 0.05) so no caption runs past a cut.
// Guess (1b): mug panel vs glass panel, A / B pills pop on "coffee" / "water". Re-hook (5a): new scene, outdoors in the sun,
// hard push. Answer (8): same panels, check on A on "coffee". Tease (10a, from "Next"): alarm clock + snooze + groggy fog.
// Loop (10b "Thirsty yet?"): back to the exact frame-1 picture (scene clock wraps so the last frame = frame 0).
import { ctx, C, W, H, TAU, clamp, lerp, seg, eo, eio, eob, line, bigText, rr, circle } from './core/lib.js';
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

  // ── the hook set: desk close-up (frame 1 + loop) ──
  const DESK = 1000, MUG = [290, DESK - 66 * 2.2], MUG_S = 2.2, GL = [790, DESK - 128 * 1.2], GL_S = 1.2, HOOK_CAM = [540, 760];
  const T_LAST = (Math.ceil(T.dur * 30 - 1e-6) - 1) / 30;   // time of the film's last rendered frame
  const STRIP = [790, 618, 250];
  const tallySlots = (o = {}) => [
    { k: 'glass', f: 1 }, { k: 'glass', f: 1 }, { k: 'glass', f: 1 },
    { k: 'mug', pencil: 1 - (o.mug || 0), check: o.mugCheck || 0, hi: o.mugHi || 0 },
    o.tea ? { k: 'tea', check: o.tea, hi: o.teaHi || 0 } : { k: 'glass', f: 0 },
    o.milk ? { k: 'milk', check: o.milk, hi: o.milkHi || 0 } : { k: 'glass', f: 0 },
    { k: 'glass', f: 0 }, { k: 'glass', f: 0 },
  ];
  const deskScene = (tl, { mugB = 0, glB = 0, glRing = 0 } = {}) => {
    plain();
    rr(-300, DESK, W + 600, 46, 0); ctx.fillStyle = '#B5653F'; ctx.fill();
    ctx.fillStyle = '#9A5333'; ctx.fillRect(-300, DESK + 46, W + 600, 900);
    ctx.fillStyle = '#A85E3A'; ctx.fillRect(-300, DESK + 46, W + 600, 16);
    K.dhPeeStrip(STRIP[0], STRIP[1], STRIP[2], { marker: 0.75, label: 1, labSize: 30 });
    K.hiRing(GL[0], GL[1], 150, 190, glRing);
    K.dwMug(MUG[0], MUG[1] - 60 * mugB, MUG_S, tl);
    K.outlinedGlass(GL[0], GL[1] - 50 * glB, GL_S, 0.72, tl);
    K.glass(GL[0], GL[1] - 50 * glB, GL_S, 0.72, tl);
  };
  const hookTally = (sc, tl) => K.dhTally(540, 430, 1, tallySlots(), { sc, t: tl });
  const PA = [290, 1100], PB = [790, 1100], PS = 34;
  const hookPills = (sc, o = {}) => { K.abPill('A', 'COFFEE COUNTS', PA[0], PA[1], PS, { sc, ...o.a }); K.abPill('B', 'ONLY WATER', PB[0], PB[1], PS, { sc, ...o.b }); };

  // ── 1 · HOOK "What happens when you don't drink enough water?" ──
  {
    const dr = Wd('drink', 0), en = Wd('enough', 0), wa = Wd('water', 0);
    add({ id: 'S01', at: 0, cam: HOOK_CAM, zoom: 0.05, note: 'FRAME 1 = hook: desk close-up, steaming coffee mug + glass of water, "6-8 GLASSES A DAY" tally card (3 water drunk, coffee mug only in faint pencil), wall pee-colour strip (marker on dark-ish, "NHS: AIM PALE"), A COFFEE COUNTS / B ONLY WATER pills, all from frame 0; the mug hops on "drink", the empty tally slots blink on "enough", yellow ring + hop on the glass on "water"',
      draw(lt, d, t) {
        deskScene(t, { mugB: blip(lt, dr, 0.3), glB: blip(lt, wa, 0.35), glRing: blip(lt, wa, 0.5) });
        hookTally(1, t);
        if (lt > en && lt < en + 0.5) { ctx.save(); ctx.globalAlpha = 0.6 * blip(lt, en, 0.5); for (let i = 4; i < 8; i++) circle(540 - 385 + i * 110, 448, 52, C.yellow); ctx.restore(); }
        hookPills(1);
      } });
    cue(0.0, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(dr, 'boing', { gain: 0.3 }); cue(en, 'tock', { gain: 0.35 }); cue(wa, 'plop', { gain: 0.5 });
  }

  // ── 2a · "Six to eight glasses a day." ──
  {
    const st = at('six', 1), ei = Wd('eight', 1) - st, gl = Wd('glasses', 1) - st, da = Wd('day', 1) - st;
    const XS = [195, 415, 635, 855], YS = [560, 880], GS = 2.4;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.08, note: 'eight glasses in two rows (on screen at the cut): six full of water, two dashed "still to drink"; on "eight" glasses 7-8 fill + yellow "6-8" pill; the row hops in a wave on "glasses"; a sun arcs over a "A DAY" pill on "day"',
      draw(lt, d, t) {
        plain();
        for (let i = 0; i < 8; i++) {
          const x = XS[i % 4], y = YS[i >> 2], hop = 30 * blip(lt, gl + i * 0.04, 0.3);
          const f = i < 6 ? 1 : eo(seg(lt, ei - 0.02 + (i - 6) * 0.1, ei + 0.3 + (i - 6) * 0.1));
          if (i >= 6) K.hiRing(x, y, 110, 140, blip(lt, ei, 0.6));
          K.dhMini('glass', x, y - hop, GS * (i < 6 ? enter(lt) : 1), { f: f > 0.02 ? f : 0, t });
        }
        K.pill('6-8', 540, 300, 96, C.yellow, C.ink, pop(lt, ei));
        const sp = eio(seg(lt, da - 0.05, da + 0.6));
        if (lt > da - 0.05) { const a = lerp(Math.PI * 1.05, Math.PI * 1.95, sp); K.sun(540 + Math.cos(a) * 330, 1260 + Math.sin(a) * 200, 0.38, t); }
        K.pill('A DAY', 540, 1110, 50, C.ink, C.white, pop(lt, da));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.3 }); cue(st + ei, 'plop', { gain: 0.5 }); cue(st + ei + 0.1, 'pop', { gain: 0.55 }); cue(st + gl, 'boing', { gain: 0.3 }); cue(st + da, 'pop', { gain: 0.45 });
  }

  // ── the guess / answer panels (S03, S12) ──
  const GA = [290, 1030], GB = [790, 1030], GS = 40, PY0 = 330, PY1 = 930;
  const panels = (t, { dimB = 0, hiA = 0, mugB = 0, glB = 0 } = {}) => {
    plain();
    K.dhPanel(50, PY0, 480, PY1 - PY0, () => {
      ctx.fillStyle = '#B5653F'; ctx.fillRect(50, 800, 480, 140); ctx.fillStyle = '#9A5333'; ctx.fillRect(50, 830, 480, 110);
      K.dwMug(285, 800 - 66 * 2.3 - 50 * mugB, 2.3, t);
    }, { hi: hiA });
    K.dhPanel(550, PY0, 480, PY1 - PY0, () => {
      ctx.fillStyle = '#B5653F'; ctx.fillRect(550, 800, 480, 140); ctx.fillStyle = '#9A5333'; ctx.fillRect(550, 830, 480, 110);
      K.outlinedGlass(790, 800 - 128 * 1.35 - 50 * glB, 1.35, 0.72, t); K.glass(790, 800 - 128 * 1.35 - 50 * glB, 1.35, 0.72, t);
    }, { dim: dimB });
  };

  // ── 2b · GUESS "Does coffee count, or just water?" ──
  {
    const st = at('does', 1), co = Wd('coffee', 1) - st, cn = Wd('count', 1) - st, wa = Wd('water', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 680], zoom: 0.07, note: 'GUESS: two panels on screen at the cut, coffee mug on a desk (left) vs glass of water (right); mug hops + pill A COFFEE COUNTS pops on "coffee"; big yellow "?" bounces on "count"; glass hops + B ONLY WATER pops on "water"',
      draw(lt, d, t) {
        panels(t, { mugB: blip(lt, co, 0.35), glB: blip(lt, wa, 0.35) });
        bigText('?', 540, 230, 150 * pop(lt, cn), C.yellow, 0.1);
        K.abPill('A', 'COFFEE COUNTS', GA[0], GA[1], GS, { sc: pop(lt, co), hi: blip(lt, co, 0.4) });
        K.abPill('B', 'ONLY WATER', GB[0], GB[1], GS, { sc: pop(lt, wa), hi: blip(lt, wa, 0.4) });
      } });
    cue(st, 'whoosh'); cue(st + co, 'pop', { gain: 0.65 }); cue(st + cn, 'boing', { gain: 0.4 }); cue(st + wa, 'pop', { gain: 0.65 });
  }

  // ── 3 · "Fall short, and your brain sends a water-saving hormone." ──
  {
    const st = at('fall', 2), sh = Wd('short', 2) - st, br = Wd('brain', 2) - st, se = Wd('sends', 2) - st, ho = Wd('hormone', 2) - st;
    const TX = 210, TY = 700, BX = 700, BY = 460;
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.1, note: 'BODY WATER tube (left) + brain buddy (top right) on screen at the cut; the water drops below the dashed line, red ring + "LOW" pill on "short"; brain eyes go wide + wobble on "brain"; on "sends" a little messenger buddy carrying an envelope with a water drop runs down from the brain; "ADH" tag + yellow ring on it on "hormone"',
      draw(lt, d, t) {
        plain();
        const lv = lerp(0.5, 0.26, eio(seg(lt, 0.03, sh + 0.2)));
        K.pill('BODY WATER', TX, 300, 34, C.ink, C.white, enter(lt));
        K.levelTube(TX, TY, 0.9, { level: lv, mark: 0.45, t });
        K.hiRing(TX, TY + 150, 120, 140, pop(lt, sh, 0.25) * out(lt, se - 0.25, 0.2));
        K.pill('LOW', TX, 1100, 44, C.red, C.white, pop(lt, sh + 0.05));
        const al = lt > br;
        K.brainBuddy(BX, BY, 0.62, { t, wob: blip(lt, br, 0.5) + 0.1, eyes: 'n', look: al ? -0.6 : 0, mouth: al ? 'o' : 'smirk', point: 0 });
        K.shockLines(BX, BY - 40, 200, blip(lt, br, 0.5));
        const u = eio(seg(lt, se - 0.05, se + 0.7)), mx = lerp(BX, 640, u), my = lerp(BY + 120, 900, u);
        if (lt > se - 0.05) {
          K.hiRing(mx + 20, my + 10, 120, 110, pop(lt, ho, 0.25));
          K.messenger(mx, my, 1.25, { t, sc: pop(lt, se - 0.05, 0.25) });
          K.drop(mx + 72, my + 26, 0.42, 0, pop(lt, se, 0.25));
          K.tag('ADH', 900, 760, mx + 50, my - 40, 46, pop(lt, ho));
        }
      } });
    cue(st, 'whoosh'); cue(st + sh, 'alarm', { dur: 0.5, gain: 0.25 }); cue(st + sh + 0.05, 'pop', { gain: 0.5 }); cue(st + br, 'boing', { gain: 0.35 });
    cue(st + se, 'slide', { dur: 0.6, gain: 0.35 }); cue(st + ho, 'pop', { gain: 0.6 });
  }

  // ── 4 · "Your kidneys pull water back into your blood," ──
  {
    const st = at('your', 3), ki = Wd('kidneys', 3) - st, pu = Wd('pull', 3) - st, ba = Wd('back', 3) - st, bl = Wd('blood', 3) - st;
    const KL = [300, 620], KR = [780, 620], KS = 0.8, VX = 540;
    add({ id: 'S05', at: st, cam: [540, 660], zoom: 0.1, note: 'inside view (x-ray film): two kidneys either side of a big blood vessel (on screen at the cut), the messenger with its envelope drops in between; kidneys pulse + KIDNEYS tag on "kidneys"; blue water drops travel from both kidneys into the vessel from "pull", blue arrows on "back"; the vessel swells + BLOOD tag on "blood"',
      draw(lt, d, t) {
        K.xray(t);
        const sw = eo(seg(lt, bl - 0.05, bl + 0.3));
        ctx.save(); rr(VX - 70 - 12 * sw, 230, 140 + 24 * sw, 900, 70); ctx.fillStyle = '#A3304A'; ctx.fill(); rr(VX - 54 - 12 * sw, 230, 108 + 24 * sw, 900, 54); ctx.fillStyle = '#B83A55'; ctx.fill(); ctx.restore();
        for (let i = 0; i < 6; i++) { const y = 260 + ((t * 120 + i * 150) % 860); circle(VX + Math.sin(i * 2) * 20, y, 22, '#D62839'); circle(VX + Math.sin(i * 2) * 20, y, 10, '#A81E2D'); }
        const kp = 1 + 0.06 * blip(lt, ki, 0.4);
        K.kidney(KL[0], KL[1], KS * kp, false); K.kidney(KR[0], KR[1], KS * kp, true);
        K.tag('KIDNEYS', 250, 300, KL[0] - 20, KL[1] - 120, 42, pop(lt, ki));
        // water drops from each kidney into the vessel
        if (lt > pu - 0.05) for (let k = 0; k < 6; k++) {
          const u = ((lt - pu) * 1.4 + k / 6) % 1, sd = k % 2 ? 1 : -1, kx = sd < 0 ? KL[0] + 40 : KR[0] - 40;
          const x = lerp(kx, VX + sd * 20, u), y = KL[1] + (k % 3 - 1) * 60 - Math.sin(u * Math.PI) * 50;
          K.drop(x, y, 0.55, sd * 1.57, Math.min(1, u * 6, (1 - u) * 5) * seg(lt, pu - 0.05, pu + 0.15));
        }
        for (const sd of [-1, 1]) K.flowArrow(VX + sd * 140, 900, 150, sd < 0 ? 0 : Math.PI, pop(lt, ba, 0.25));
        // the hormone messenger arrives between the kidneys
        const u = eo(seg(lt, 0, 0.45)); K.messenger(VX, lerp(250, 430, u), 0.95, { t, sc: 1 * out(lt, pu + 0.3, 0.3) });
        K.tag('BLOOD', 830, 1040, VX + 60, 960, 44, pop(lt, bl));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + ki, 'pop', { gain: 0.55 }); cue(st + pu, 'bubbles', { dur: 0.9, gain: 0.25 }); cue(st + ba, 'slide', { dur: 0.3, gain: 0.3 }); cue(st + bl, 'pop', { gain: 0.55 });
  }

  // ── 5 · "so your pee turns dark yellow and strong-smelling." ──
  {
    const st = at('so', 4), pe = Wd('pee', 4) - st, tu = Wd('turns', 4) - st, dk = Wd('dark', 4) - st, ye = Wd('yellow', 4) - st, sm = Wd('strong', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 680], zoom: 0.08, note: 'schematic pee colour: a big drop + a 5-step colour strip ("NHS: AIM PALE" under the pale end) on screen at the cut; the drop hops on "pee"; from "turns" to "yellow" the marker slides pale -> dark and the drop darkens with it, yellow ring on the dark end on "dark"; soft green stink lines rise from the drop on "strong-smelling"',
      draw(lt, d, t) {
        plain();
        const k = eio(seg(lt, tu, ye + 0.3)), hop = 40 * blip(lt, pe, 0.35);
        const cols = K.dhPeeCol(k);
        K.thStink(540, 380, 0.9, seg(lt, sm - 0.05, sm + 0.3), t, 0);
        K.drop(540, 560 - hop, 4.2 * enter(lt), 0, 1, cols);
        K.dhPeeStrip(540, 960, 760, { marker: k, label: 1, sc: enter(lt) });
        K.hiRing(540 + 2 * (152 + 4), 960, 100, 90, pop(lt, dk, 0.25) * out(lt, sm, 0.3));
      } });
    cue(st, 'whoosh'); cue(st + pe, 'plop', { gain: 0.5 }); cue(st + tu, 'slide', { dur: ye - tu + 0.3, gain: 0.3 }); cue(st + dk, 'pop', { gain: 0.5 }); cue(st + sm, 'sparkle', { dur: 0.5, gain: 0.2 });
  }

  // ── 6a · RE-HOOK "But here's the sneaky part:" (new scene: outdoors in the sun, hard push in) ──
  {
    const st = at('but', 5), sn = Wd('sneaky', 5) - st, pa = Wd('part', 5) - st;
    const HX = 540, HY = 820, HS = 0.62;
    add({ id: 'S07', at: st, cam: [540, 560], zoom: 0.34, note: 'RE-HOOK, new scene: outdoors on a hot day (sky, big sun, path), the hero standing in the sun (on screen at the cut), camera pushing hard toward his face; on "sneaky" his eyes go wide + shock lines; heat rings swell round the sun on "part"',
      draw(lt, d, t) {
        plain('#BFE3F2');
        ctx.fillStyle = '#E4DCCB'; ctx.fillRect(-300, 1060, W + 600, 900); ctx.fillStyle = '#D8CFBC'; ctx.fillRect(-300, 1060, W + 600, 18);
        K.heatRings(880, 230, 0.4 + 0.6 * eo(seg(lt, pa - 0.1, pa + 0.4)), t, 0.8);
        K.sun(880, 230, 0.9, t);
        const sur = lt > sn;
        K.man({ x: HX, y: HY, s: HS, eyes: sur ? 'wide' : 'n', mouth: sur ? 'o' : 'smile', brow: sur ? 1 : 0.3, look: 0.4, sweat: 1, arm: K.ARM.down });
        K.shockLines(HX, HY - 300 * HS, 150, blip(lt, sn, 0.5));
      } });
    cue(st, 'whoosh'); cue(st + sn, 'slam', { gain: 0.45 }); cue(st + pa, 'sizzle', { dur: 0.5, gain: 0.2 });
  }

  // ── 6b · "sweat, heat or fever drain you faster." ──
  {
    const st = at('sweat', 5), sw = Wd('sweat', 5) - st, he = Wd('heat', 5) - st, fe = Wd('fever', 5) - st, dr = Wd('drain', 5) - st, fa = Wd('faster', 5) - st;
    const CX = [200, 540, 880], CY = 360, TX = 540, TY = 820;
    const disc = (x, y, sc, fn) => { if (sc <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); circle(0, 0, 150, C.ink); circle(0, 0, 134, C.white); ctx.beginPath(); ctx.arc(0, 0, 134, 0, TAU); ctx.clip(); fn(); ctx.restore(); };
    add({ id: 'S08', at: st, cam: [540, 640], zoom: 0.08, note: 'the BODY WATER tube (on screen at the cut) with three cause discs popping over it on the words: SWEAT (the hero\'s head with sweat drops), HEAT (sun + heat rings), FEVER (thermometer); from "drain" the water level falls fast (drops falling out the bottom, red down arrows), speed lines + red ring on "faster"',
      draw(lt, d, t) {
        plain();
        const lv = lerp(0.55, 0.12, eio(seg(lt, dr - 0.05, fa + 0.35)));
        K.levelTube(TX, TY, 0.8, { level: lv, mark: 0.45, t, sc: enter(lt) });
        for (const sd of [-1, 1]) K.flowArrow(TX + sd * 170, TY + 40, 170, Math.PI / 2, pop(lt, dr, 0.25), C.red, 22);
        K.speedLines(TX, TY, blip(lt, fa, 0.6));
        K.hiRing(TX, TY + 180, 110, 90, pop(lt, fa, 0.25));
        disc(CX[0], CY, pop(lt, sw), () => { K.heroHead(0, -10, 0.8, { eyes: 'n', mouth: 'flat', brow: 0.6, sweats: 1, ct: t }); });
        disc(CX[1], CY, pop(lt, he), () => { K.heatRings(0, 0, 0.6, t, 0.9); K.sun(0, 0, 0.55, t); });
        disc(CX[2], CY, pop(lt, fe), () => { ctx.rotate(0.5); K.thermometer(0, 0, 0.27, 0.8); });
        const lab = (txt, x, a) => K.pill(txt, x, CY + 175, 34, C.ink, C.white, a);
        lab('SWEAT', CX[0], pop(lt, sw + 0.05)); lab('HEAT', CX[1], pop(lt, he + 0.05)); lab('FEVER', CX[2], pop(lt, fe + 0.05));
      } });
    cue(st, 'whoosh'); cue(st + sw, 'pop', { gain: 0.55 }); cue(st + he, 'pop', { gain: 0.55 }); cue(st + fe, 'pop', { gain: 0.55 });
    cue(st + dr, 'slide', { dur: 0.8, gain: 0.35 }); cue(st + fa, 'zip', { gain: 0.5 });
  }

  // ── 7 · RELATABLE "Ever get a headache and dry mouth at work?" ──
  {
    const st = at('ever', 6), he = Wd('headache', 6) - st, dr = Wd('dry', 6) - st, mo = Wd('mouth', 6) - st, wo = Wd('work', 6) - st;
    const HX = 470, HY = 720, HS = 0.85;
    add({ id: 'S09', at: st, cam: [470, 560], zoom: 0.12, note: 'office: the hero at his desk behind a laptop, coffee mug on the desk, an EMPTY water glass (white inside) at the left end of the desk (on screen at the cut); on "headache" his hand goes to his temple + red pain zap; on "dry" little dry crack lines at his mouth + yellow ring on the empty glass on "mouth"; a "9 TO 5" sticky note pops on the wall on "work"',
      draw(lt, d, t) {
        K.sitOffice(1180);
        const ach = lt > he, hand = eo(seg(lt, he - 0.05, he + 0.2));
        K.man({ x: HX, y: HY, s: HS, sit: true, arm: K.armPose(K.ARM.down, K.ARM.ear, hand), eyes: ach ? 'squeeze' : 'n', mouth: lt > dr ? 'flat' : 'smile', brow: ach ? 0.8 : 0.2, frown: ach, tired: 0.3 });
        K.painZap(HX + 120 * HS, HY - 440 * HS, 0.8, pop(lt, he, 0.25), t);
        if (lt > dr) {   // dry mouth: little ink crack ticks round the lips (1.6x)
          const a = pop(lt, dr, 0.25), Z = 1.6 * HS, mx = HX, my = HY - 276 * HS;
          ctx.save(); ctx.globalAlpha = clamp(a);
          for (const sd of [-1, 1]) {
            line([[mx + sd * 30 * Z, my - 6 * Z], [mx + sd * 38 * Z, my + 4 * Z], [mx + sd * 32 * Z, my + 12 * Z], [mx + sd * 40 * Z, my + 22 * Z]], C.ink, 6);
            line([[mx + sd * 10 * Z, my - 12 * Z], [mx + sd * 14 * Z, my - 4 * Z], [mx + sd * 8 * Z, my + 2 * Z]], C.ink, 5);
          }
          ctx.restore();
        }
        K.workDesk(560, 900, 1, { t });
        K.hiRing(220, 900 - 96, 100, 125, pop(lt, mo, 0.25));
        K.dhEmptyGlass(220, 900 - 128 * 0.75, 0.75);
        K.stickyNote(880, 360, 1.1, ['9 TO 5'], 0.08, pop(lt, wo));
      } });
    cue(st, 'whoosh'); cue(st + he, 'zip', { gain: 0.45 }); cue(st + mo, 'pop', { gain: 0.45 }); cue(st + wo, 'pop', { gain: 0.45 });
  }

  // ── 8a · SAFETY "Blotchy, grey skin or confusion?" (calm) ──
  {
    const st = at('blotchy', 7), bl = Wd('blotchy', 7) - st, gr = Wd('grey', 7) - st, sk = Wd('skin', 7) - st, cf = Wd('confusion', 7) - st;
    add({ id: 'S10', at: st, cam: [540, 640], zoom: 0.06, note: 'calm safety card: a skin swatch disc (on screen at the cut) that turns blotchy from "blotchy" and grey on "grey", GREY SKIN pill on "skin"; a confused-face badge pops on "confusion" with a CONFUSED pill; no scare imagery',
      draw(lt, d, t) {
        plain('#EAF4F7');
        const g = 0.25 + 0.75 * eio(seg(lt, bl, gr + 0.3));
        K.dhSkinSwatch(300, 620, 190, { grey: lt > 0.03 ? g * seg(lt, 0.03, 0.2) : 0, sc: enter(lt) });
        K.pill('GREY SKIN', 300, 900, 40, C.ink, C.white, pop(lt, sk));
        K.symptom('confused', 780, 620, 1.2, pop(lt, cf), t);
        K.pill('CONFUSED', 780, 900, 40, C.ink, C.white, pop(lt, cf + 0.05));
      } });
    cue(st, 'whoosh'); cue(st + bl, 'tock', { gain: 0.35 }); cue(st + sk, 'pop', { gain: 0.45 }); cue(st + cf, 'pop', { gain: 0.5 });
  }

  // ── 8b · "Call emergency services." ──
  {
    const st = at('call', 7), ca = Wd('call', 7) - st, em = Wd('emergency', 7) - st, se = Wd('services', 7) - st;
    add({ id: 'S11', at: st, cam: [540, 640], zoom: 0.06, note: 'calm: a phone with a green call button and a red medical cross on the screen (on screen at the cut); soft ring arcs on "Call"; the call button glows on "emergency"; an ink "GET HELP" pill on "services"',
      draw(lt, d, t) {
        plain('#EAF4F7');
        K.phone(540, 650, 0.95 * enter(lt), ' ', blip(lt, ca, 0.9) * 0.8, t);
        ctx.save(); ctx.translate(540, 650 - 80 * 0.95); const cs = 0.95;
        ctx.fillStyle = C.red; rr(-22 * cs, -70 * cs, 44 * cs, 140 * cs, 8); ctx.fill(); rr(-70 * cs, -22 * cs, 140 * cs, 44 * cs, 8); ctx.fill(); ctx.restore();
        K.hiRing(540, 650 + 110 * 0.95, 85, 85, blip(lt, em, 0.6));
        K.pill('GET HELP', 540, 1090, 50, C.ink, C.white, pop(lt, se));
      } });
    cue(st, 'whoosh'); cue(st + ca, 'pop', { gain: 0.4 }); cue(st + em, 'tock', { gain: 0.35 }); cue(st + se, 'pop', { gain: 0.45 });
  }

  // ── 9 · ANSWER "Answer: coffee counts." ──
  {
    const st = at('answer', 8), co = Wd('coffee', 8) - st, cn = Wd('counts', 8) - st;
    add({ id: 'S12', at: st, cam: [540, 680], zoom: 0.07, note: 'ANSWER: the guess panels + A / B pills in the same spots (on screen at the cut); on "coffee" the check lands on A COFFEE COUNTS, B dims, the mug panel glows and the mug hops; "+1 GLASS" yellow pill on the mug panel on "counts"; COMMENT A OR B pill ~1 s (not voiced)',
      draw(lt, d, t) {
        panels(t, { dimB: seg(lt, co, co + 0.3), hiA: blip(lt, co, 0.6), mugB: blip(lt, co, 0.35) });
        K.pill('+1 GLASS', 290, 420, 50, C.yellow, C.ink, pop(lt, cn));
        K.abPill('A', 'COFFEE COUNTS', GA[0], GA[1], GS, { sc: 1, check: pop(lt, co, 0.3), hi: blip(lt, co, 0.45) });
        K.abPill('B', 'ONLY WATER', GB[0], GB[1], GS, { sc: 1, dim: seg(lt, co, co + 0.3) });
        K.pill('COMMENT A OR B', 540, 1118, 40, C.ink, C.yellow, pop(lt, co + 0.35, 0.25) * out(lt, co + 1.3, 0.2));
      } });
    cue(st, 'whoosh'); cue(st + co, 'pop', { gain: 0.8 }); cue(st + cn, 'plop', { gain: 0.5 }); cue(st + co + 0.35, 'pop', { gain: 0.3 });
  }

  // ── 10 · "Tea and milk count too. Aim for pale yellow pee." ──
  {
    const st = at('tea', 9), te = Wd('tea', 9) - st, mi = Wd('milk', 9) - st, cn = Wd('count', 9) - st, ai = Wd('aim', 9) - st, pa = Wd('pale', 9) - st, pe = Wd('pee', 9) - st;
    add({ id: 'S13', at: st, cam: [540, 640], zoom: 0.07, note: 'the 6-8 tally card (on screen at the cut) with the coffee mug now solid + checked; a big tea cup pops on "tea" and a glass of milk on "milk", then they fill tally slots 5-6 with checks on "count"; on "Aim" the cups fade and the pee colour strip pops; marker slides to the pale end + check on "pale"; yellow ring round the pale swatch on "pee"',
      draw(lt, d, t) {
        plain();
        const fill = seg(lt, cn, cn + 0.2);
        K.dhTally(540, 380, 1, tallySlots({ mug: 1, mugCheck: 1, tea: fill > 0 ? pop(lt, cn, 0.3) : 0, milk: fill > 0 ? pop(lt, cn + 0.1, 0.3) : 0 }), { t, sc: enter(lt) });
        const gone = out(lt, ai - 0.05, 0.25);
        K.dhMini('tea', 330, 720, 2.6 * pop(lt, te) * gone, { t });
        K.dhMini('milk', 760, 720, 2.6 * pop(lt, mi) * gone, { t });
        const k = 0.75 * (1 - eio(seg(lt, pa - 0.1, pa + 0.35)));
        K.dhPeeStrip(540, 820, 760, { marker: k, label: 1, check: pop(lt, pa + 0.1, 0.3), sc: pop(lt, ai, 0.3) });
        K.hiRing(540 - 2 * (152 + 4), 820, 100, 90, pop(lt, pe, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + te, 'pop', { gain: 0.5 }); cue(st + mi, 'pop', { gain: 0.5 }); cue(st + cn, 'plop', { gain: 0.45 }); cue(st + ai, 'pop', { gain: 0.45 });
    cue(st + pa - 0.1, 'slide', { dur: 0.45, gain: 0.3 }); cue(st + pa + 0.1, 'pop', { gain: 0.6 });
  }

  // ── 11a · TEASE "Next Body File: hitting snooze, and that groggy fog." (starts on "Next") ──
  const badge = (x, y, sc, size = 44) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = at('next', 10), bo = Wd('body', 10) - st, hi = Wd('hitting', 10) - st, sn = Wd('snooze', 10) - st, gr = Wd('groggy', 10) - st, fo = Wd('fog', 10) - st;
    add({ id: 'S14', at: st, cam: [540, 700], zoom: 0.08, note: 'tease (cut on "Next"): bedroom at night, the hero asleep in bed, a red alarm clock ringing on the nightstand + yellow NEXT pill, all on screen at the cut; BODY FILES badge on "Body"; his arm reaches out on "hitting" and presses the snooze bar on "snooze" (ringing stops, SNOOZE pill); on "groggy" he half-opens heavy eyes, grey fog rolls in on "fog"',
      draw(lt, d, t) {
        plain(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1160, W + 600, 900);
        rr(600, 230, 360, 440, 22); ctx.fillStyle = C.white; ctx.fill();
        ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = C.navy; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
        rr(622, 252, 316, 396, 12); ctx.fillStyle = C.navy; ctx.fill();
        circle(860, 340, 44, C.gum); circle(880, 326, 40, C.navy);
        for (const [sx, sy] of [[680, 300], [720, 560], [880, 520], [660, 470]]) circle(sx, sy, 5, C.gum);
        ctx.fillStyle = '#6E7A86'; ctx.fillRect(772, 252, 14, 396); ctx.fillRect(622, 442, 316, 14);
        const press = eo(seg(lt, sn - 0.1, sn + 0.05));
        K.bed(640, 930, 0.9, { sleeper: lt > gr ? { eyes: 'n', tired: 1, mouth: 'flat' } : { eyes: 'closed', mouth: 'smile' }, breathe: Math.sin(t * 2) * 0.5 + 0.5 });
        K.nightstand(140, 930, 0.95);
        const ring = lt < sn ? 1 : 0;
        K.dhAlarmClock(140, 840, 0.55, { ring, press: lt > sn - 0.1 ? press * out(lt, sn + 0.5, 0.2) : 0, t });
        if (lt > hi - 0.1) { const u = eio(seg(lt, hi - 0.1, sn)); K.reachArm(380, 840, lerp(330, 150, u), lerp(840, 740, u), 0.9); }
        K.pill('SNOOZE', 300, 1100, 46, C.yellow, C.ink, pop(lt, sn));
        K.hrFog(eo(seg(lt, fo - 0.1, fo + 0.5)) * 0.8, t);
        K.pill('NEXT', 300, 170, 64, C.yellow, C.ink, pop(lt, 0.03, 0.25));
        badge(300, 320, pop(lt, bo));
      } });
    cue(st, 'whoosh'); cue(st + 0.03, 'pop', { gain: 0.6 }); cue(st + 0.05, 'alarm', { dur: 0.9, gain: 0.25 }); cue(st + bo, 'thud', { gain: 0.4 });
    cue(st + hi, 'slide', { dur: 0.3, gain: 0.3 }); cue(st + sn, 'thud', { gain: 0.55 }); cue(st + fo, 'sparkle', { dur: 0.5, gain: 0.2 });
  }

  // ── 11b · LOOP "Thirsty yet?" (back to the exact frame-1 picture) ──
  {
    const st = at('thirsty', 10), th = Wd('thirsty', 10) - st, Z = 0;
    add({ id: 'S15', at: st, cam: HOOK_CAM, zoom: Z, note: 'LOOP + END CARD: the frame-1 desk close-up (mug, glass, tally, wall strip, A/B pills; on screen at the cut, scene clock wrapped so the last frame = frame 0); the glass hops + yellow ring on "Thirsty"; end card from ~0.5 s: NEXT pill + alarm-clock badge top right, BODY FILES + FOLLOW top left',
      draw(lt, d, t) {
        const tl = t - T_LAST;                                  // scene clock: the last frame draws exactly like frame 0 (steam, water)
        deskScene(tl, { glB: blip(lt, th, 0.35), glRing: blip(lt, th, 0.5) });
        hookTally(1, tl);
        hookPills(1);
        const k = (1 + 0.13 * (1 - eo(clamp(lt / 0.32)))) * (1 + Z * eio(clamp(lt / d)));
        ctx.save(); ctx.translate(HOOK_CAM[0], HOOK_CAM[1]); ctx.scale(1 / k, 1 / k); ctx.translate(-HOOK_CAM[0], -HOOK_CAM[1]);
        K.dhAlarmBadge(920, 160, 0.45, pop(lt, 0.5, 0.3), t);
        K.pill('NEXT', 760, 160, 40, C.yellow, C.ink, pop(lt, 0.55, 0.3));
        badge(210, 130, pop(lt, 0.5, 0.3), 34);
        K.followPill(210, 210, pop(lt, 0.7), t, 38);
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + th, 'plop', { gain: 0.45 }); cue(st + 0.5, 'pop', { gain: 0.4 }); cue(st + 0.7, 'pop', { gain: 0.5 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES, loop: true };
}
