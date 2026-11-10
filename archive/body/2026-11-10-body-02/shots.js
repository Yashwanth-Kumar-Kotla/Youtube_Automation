// WHAT HAPPENS TO YOUR BODY IN SPACE WITHOUT A SUIT?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Tone: calm, curious myth-bust. The space part uses a friendly test FIGURE (off-white mannequin, never the hero) in deep
// space: nothing bursts, nothing bleeds; fizz = tiny white bubbles, puff = gentle swell, black-out = eyes close peacefully.
// The 1966 story: a steel vacuum chamber, a tester in a white test suit (no logos), the hose pops loose (a white air puff),
// spit boiling = a bubbling droplet in a thought bubble, he wakes and goes home for lunch. The hero only appears in K.home()
// for the tease (hiccup badge + HIC! + 68 YEARS + NEXT) and ends with a curious smile.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, bigText } from './core/lib.js';
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
  const out = (lt, a, d = 0.25) => 1 - eio(seg(lt, a, a + d));
  const float = (t, k = 0) => Math.sin(t * 1.3 + k) * 14;     // slow zero-g bob
  const HERO = { x: 330, y: 1000, s: 1.2 };                    // the hero's spot in the room (left of the window)
  const hero = (o) => K.man({ ...HERO, ...o });
  const FACE = { x: 540, y: 1330, s: 1.55, spread: 1 };        // test-figure close-up (arms float out of frame)

  // ── 1 · HOOK: the test figure floats in deep space from frame 0; ? on "happens"; helmet crossed out on "suit" ──
  {
    const st = 0, hp = Wd('happens', 0), bo = Wd('body', 0), sp = Wd('space', 0), su = Wd('suit', 0);
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.08, note: 'deep space + planet from frame 0: the test figure (off-white mannequin, not the hero) drifts and turns slowly, curious face; yellow ? on "happens"; figure glances around on "space"; helmet badge pops on "suit" with a thin red X (no suit)',
      draw(lt, d, t) {
        K.spaceBg(t);
        K.dummy({ x: 500 + lt * 12, y: 700 + float(t), s: 0.84, rot: -0.12 + lt * 0.05, t, spread: 0.55, eyes: lt > sp ? 'wide' : 'n', look: lt > sp ? 1 : 0,
          mouth: lt > su ? 'o' : 'smile', brow: lt > bo ? 0.8 : 0.4 });
        bigText('?', 190, 430, 170, C.yellow, -0.15, pop(lt, hp, 0.25) * (1 + 0.05 * Math.sin(lt * 6)));
        const hs = pop(lt, su, 0.3);
        K.helmetBadge(850, 360, 0.72, hs, t, 0);
        K.redX(850, 360, 0.36 * hs, 1, 0.6);
      } });
    cue(0.1, 'whoosh', { gain: 0.5 }); cue(0.15, 'sparkle', { dur: 1.2, gain: 0.25 }); cue(hp, 'pop', { gain: 0.5 }); cue(su, 'pop', { gain: 0.6 }); cue(su + 0.15, 'slam', { gain: 0.5 });
  }

  // ── 2 · Spoiler: BOOM pops, red X on "explode"; "Your skin's too tough": calm outline + green shield on "tough" ──
  {
    const st = cut(1), spo = Wd('spoiler', 1) - st, ex = Wd('explode', 1) - st, yo = Wd('your', 1) - st, sk = Wd('skin', 1) - st, tg = Wd('tough', 1) - st;
    const BX = 760, BY = 430;
    add({ id: 'S02', at: st, cam: [560, 700], zoom: 0.06, note: 'space: figure at left; cartoon BOOM pops on "Spoiler", red X slams on "explode", both shrink away on "Your"; calm light-blue outline glows round the figure on "skin\'s"; green shield + tick pops on "tough"; figure smiles',
      draw(lt, d, t) {
        K.spaceBg(t);
        K.dummy({ x: 320, y: 740 + float(t), s: 0.7, t, spread: 0.3, glow: lt > sk ? eo(seg(lt, sk, sk + 0.35)) : 0,
          eyes: lt > ex && lt < yo ? 'wide' : 'n', mouth: lt > ex ? 'smile' : 'o', brow: lt > tg ? 0.5 : 0.8, look: lt < yo ? 1 : 0 });
        const gone = out(lt, yo, 0.25);
        K.boom(BX, BY, 0.75, pop(lt, spo, 0.3) * gone, t);
        if (lt > ex) K.redX(BX, BY, lerp(1.4, 0.72, eo(seg(lt, ex, ex + 0.18))) * gone, 1);
        K.shieldBadge(780, 600, 0.95, pop(lt, tg, 0.3));
      } });
    cue(st, 'whoosh'); cue(st + spo, 'pop', { gain: 0.6 }); cue(st + ex, 'slam'); cue(st + yo, 'zip', { gain: 0.5 }); cue(st + sk, 'sparkle', { dur: 0.6, gain: 0.4 }); cue(st + tg, 'thud', { gain: 0.6 });
  }

  // ── 3 · But the weird part starts in your mouth: close-up of the figure; ? on "weird", mouth opens + ring on "mouth" ──
  {
    const st = cut(2), we = Wd('weird', 2) - st, mo = Wd('mouth', 2) - st;
    const [mx, my] = K.dummyMouth(FACE.x, FACE.y, FACE.s);
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.1, note: 'space close-up of the figure (arms float out of frame); brows up + yellow ? on "weird"; mouth opens and a yellow ring circles it on "mouth"',
      draw(lt, d, t) {
        K.spaceBg(t, { planet: 0 });
        K.dummy({ ...FACE, y: FACE.y + float(t) * 0.5, t, eyes: lt > we ? 'wide' : 'n', brow: lt > we ? 1 : 0.4, mouth: lt > mo ? 'o' : 'smile', look: lt > we && lt < mo ? -1 : 0 });
        bigText('?', 850, 430, 150, C.yellow, 0.12, pop(lt, we, 0.25));
        if (lt > mo) {
          const k = eo(seg(lt, mo, mo + 0.3));
          ctx.save(); ctx.beginPath(); ctx.ellipse(mx, my + 8 + float(t) * 0.5, 80, 66, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k);
          ctx.strokeStyle = C.ink; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.stroke(); ctx.strokeStyle = C.yellow; ctx.lineWidth = 12; ctx.stroke(); ctx.restore();
        }
      } });
    cue(st, 'whoosh'); cue(st + we, 'boing', { gain: 0.5 }); cue(st + mo, 'pop', { gain: 0.6 });
  }

  // ── 4a · With almost no pressure: big pressure dial, needle falls to the red 0 zone on "pressure" ─────────────
  {
    const st = cut(3), al = Wd('almost', 3) - st, pr = Wd('pressure', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 640], zoom: 0.08, note: 'space: big pressure dial; needle starts falling on "almost" and settles on the red 0 zone on "pressure"; NEAR ZERO pill',
      draw(lt, d, t) {
        K.spaceBg(t);
        const lv = lerp(1, 0.04, eio(seg(lt, al, pr + 0.3))) + (lt > pr + 0.3 ? Math.sin(lt * 18) * 0.01 : 0);
        K.pressureGauge(540, 620, 1.6, lv, eob(seg(lt, 0, 0.3)));
        K.pill('NEAR ZERO', 540, 1040, 56, C.red, C.white, pop(lt, pr + 0.1));
      } });
    cue(st, 'whoosh'); cue(st + al, 'slide', { dur: pr + 0.3 - al, gain: 0.5 }); cue(st + pr + 0.1, 'pop', { gain: 0.6 });
  }
  // ── 4b · water boils at body temperature: a water drop bubbles on "boils"; thermometer rises on "body" ───
  {
    const st = at('water', 3), wa = Wd('water', 3) - st, bo = Wd('boils', 3) - st, by = Wd('body', 3) - st, te = Wd('temperature', 3) - st;
    add({ id: 'S04b', at: st, cam: [540, 640], zoom: 0.06, note: 'space: a big water drop pops in on "water" and bubbles (boils) from "boils"; thermometer rises to body temp on "body"; small dial stays near 0 (top right)',
      draw(lt, d, t) {
        K.spaceBg(t);
        K.pressureGauge(940, 240, 0.42, 0.04);
        K.thermometer(290, 640, 0.6, lt > by ? lerp(0.15, 0.55, eio(seg(lt, by, te + 0.2))) : 0.15);
        const ds = pop(lt, wa, 0.3);
        K.drop(720, 760, 3.2 * ds, 0, 1);
        if (lt > bo) {
          const k = eo(seg(lt, bo, bo + 0.3));
          K.fizz(720, 720, 2.2, t, k, { n: 9, spread: 60, rise: 150, seed: 3 });
          K.fizz(720, 820, 1.2, t, k, { n: 5, spread: 80, rise: 60, seed: 11 });
        }
      } });
    cue(st, 'whoosh'); cue(st + wa, 'plop', { gain: 0.6 }); cue(st + bo, 'bubbles', { dur: d4b(), gain: 0.6 }); cue(st + by, 'slide', { dur: 0.6, gain: 0.4 });
    function d4b() { return Math.max(0.6, (L(4) - 0.08) - (st + bo)); }
  }

  // ── 5 · so your eyes and tongue start to fizz: close-up, bubbles at the eyes on "eyes", tongue out + bubbles ──
  {
    const st = cut(4), ey = Wd('eyes', 4) - st, to = Wd('tongue', 4) - st, fz = Wd('fizz', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 720], zoom: 0.12, note: 'space close-up: tiny white bubbles rise from the eyes on "eyes", tongue pokes out with bubbles on "tongue", more fizz on "fizz"; surprised-amused face, no injury',
      draw(lt, d, t) {
        K.spaceBg(t, { planet: 0 });
        const more = lt > fz ? 1 + 0.4 * eo(seg(lt, fz, fz + 0.3)) : 1;
        K.dummy({ ...FACE, y: FACE.y + float(t) * 0.5, t, eyes: 'n', brow: lt > ey ? 1 : 0.5, mouth: lt > to ? 'tongue' : 'smile',
          fizzEyes: lt > ey ? eo(seg(lt, ey, ey + 0.3)) * Math.min(1, more) : 0, fizzTongue: lt > to ? eo(seg(lt, to, to + 0.3)) : 0 });
        if (lt > fz) { const [fx, fy] = K.dummyFace(FACE.x, FACE.y + float(t) * 0.5, FACE.s); for (const sd of [-1, 1]) K.fizz(fx + sd * 230, fy + 60, 1.6, t, eo(seg(lt, fz, fz + 0.3)), { n: 6, spread: 60, rise: 160, seed: 40 + sd }); }
      } });
    cue(st, 'whoosh'); cue(st + ey, 'bubbles', { dur: 0.7, gain: 0.5 }); cue(st + to, 'bubbles', { dur: 1.0, gain: 0.55 }); cue(st + fz, 'sparkle', { dur: 0.5, gain: 0.4 });
  }

  // ── 6 · and your skin puffs up: the figure swells gently like a balloon on "puffs" (never bursts) ──────────────
  {
    const st = cut(5), sk = Wd('skin', 5) - st, pu = Wd('puffs', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 700], zoom: 0.06, note: 'space medium: figure floats; puffs up gently (wider limbs, white swell marks) from "puffs" with a boing; surprised "o" then a small smile; never bursts',
      draw(lt, d, t) {
        K.spaceBg(t);
        const pf = lt > pu ? eob(seg(lt, pu, pu + 0.45)) * 0.9 : 0;
        K.dummy({ x: 540, y: 700 + float(t), s: 0.72, t, spread: 0.5 + pf * 0.15, puff: pf, eyes: lt > pu && lt < pu + 0.5 ? 'wide' : 'n', mouth: lt > pu + 0.5 ? 'smile' : lt > sk ? 'o' : 'smile', brow: lt > sk ? 0.9 : 0.4 });
      } });
    cue(st, 'whoosh'); cue(st + pu, 'boing', { gain: 0.6 }); cue(st + pu + 0.05, 'slide', { dur: 0.4, gain: 0.3 });
  }

  // ── 7a · With no oxygen: O2 bubbles drift away from the figure and fade on "oxygen" ───────────────────────────
  {
    const st = cut(6), no = Wd('no', 6) - st, ox = Wd('oxygen', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.06, note: 'space: three O2 bubbles float round the figure\'s head, drift off to the right and fade out from "no"/"oxygen"; figure watches them go (calm)',
      draw(lt, d, t) {
        K.spaceBg(t);
        K.dummy({ x: 340, y: 760 + float(t), s: 0.6, t, spread: 0.35, eyes: 'n', look: 1, mouth: lt > ox ? 'flat' : 'smile', brow: lt > ox ? 0.7 : 0.3 });
        [[560, 330], [640, 480], [520, 600]].forEach(([bx, by], i) => {
          const go = seg(lt, no + i * 0.1, ox + 0.55 + i * 0.1), k = eio(go);
          K.o2Bubble(bx + k * 380 + Math.sin(t * 2 + i) * 8, by - k * 120 + Math.cos(t * 2 + i) * 8, 1.15, 1 - seg(go, 0.45, 1));
        });
      } });
    cue(st, 'whoosh'); cue(st + no, 'slide', { dur: 0.8, gain: 0.4 }); cue(st + ox, 'pop', { gain: 0.4 });
  }
  // ── 7b · you black out in about twelve seconds: 12 SEC countdown; it empties, the eyes close peacefully ───────
  {
    const st = at('black', 6), bl = Wd('black', 6) - st, tw = Wd('twelve', 6) - st;
    add({ id: 'S07b', at: st, cam: [540, 700], zoom: 0.08, note: 'space: countdown timer pops on "black" showing 12 SEC; on "twelve" the number bounces and the red wedge starts emptying; the figure gets sleepy and its eyes close peacefully as it runs out (soft smile)',
      draw(lt, d, t) {
        K.spaceBg(t);
        const f = lt > tw ? 1 - eio(seg(lt, tw, d - 0.15)) : 1;
        K.dummy({ x: 280, y: 820 + float(t), s: 0.52, t, spread: 0.3, eyes: f < 0.15 ? 'closed' : f < 0.6 ? 'sleepy' : 'n', mouth: f < 0.15 ? 'smile' : 'flat', brow: 0.2 });
        const nb = lt > tw ? 1 + 0.18 * Math.sin(seg(lt, tw, tw + 0.3) * Math.PI) : 1;
        K.countdown(760, 560, 0.62 * nb, f, lt > tw ? '12' : '', pop(lt, bl, 0.3));
      } });
    cue(st, 'whoosh'); cue(st + bl, 'pop', { gain: 0.6 }); cue(st + tw, 'thud', { gain: 0.5 });
    for (let i = 0; i < 4; i++) cue(st + tw + 0.2 + i * 0.2, 'tock', { gain: 0.35 });
  }

  // ── 8a · In 1966: a steel vacuum chamber in a lab, the tester visible through the porthole; DEC 1966 pill ─────
  const peek = (lt, t, o = {}) => () => K.suitTester({ x: 0, y: 130, s: 0.5, t, arm: K.ARM.down, eyes: 'n', mouth: 'smile', ...o });
  {
    const st = cut(7), ni = Wd('nineteen', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 640], zoom: 0.08, note: 'plain lab: big steel vacuum chamber slides up, the suit tester (white suit, clear visor, no logos) seen through the porthole; DEC 1966 pill pops on "nineteen"',
      draw(lt, d, t) {
        plain();
        ctx.fillStyle = C.floor; ctx.fillRect(-300, 1150, W + 600, 800);
        K.chamber(540, lerp(760, 700, eo(seg(lt, 0, 0.5))), 0.88, { level: 1, inside: peek(lt, t) });
        K.pill('DEC 1966', 540, 175, 58, C.ink, C.white, pop(lt, ni));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'thud', { gain: 0.5 }); cue(st + ni, 'pop', { gain: 0.6 });
  }
  // ── 8b · a NASA tester's suit hose came loose: inside the chamber; hose glows on "hose", pops off on "loose" ───
  const TX = { x: 600, y: 900, s: 0.74 };
  {
    const st = at('nasa', 7), te = Wd('tester', 7) - st, ho = Wd('hose', 7) - st, lo = Wd('loose', 7) - st;
    add({ id: 'S08b', at: st, cam: [480, 760], zoom: 0.08, note: 'inside the chamber: tester in the suit, hose from the wall port to his chest; he waves on "tester\'s"; the hose glows yellow on "hose"; it pops off his chest on "loose" (white air puff, no injury), the wall dial drops, he goes "o"',
      draw(lt, d, t) {
        const loose = lt > lo ? seg(lt, lo, lo + 0.6) : 0;
        K.chamberRoom(t, lerp(1, 0.08, eio(seg(lt, lo + 0.1, lo + 0.5))));
        const wv = lt > te ? eio(seg(lt, te, te + 0.3)) * (1 - eio(seg(lt, ho - 0.2, ho + 0.1))) : 0;
        K.suitTester({ ...TX, t, port: K.chamberPort, loose, hoseHi: lt > ho && lt < lo + 0.1 ? 0.6 + 0.4 * Math.sin(lt * 14) : 0,
          arm: K.armPose(K.ARM.down, K.ARM.wave, wv), eyes: lt > lo ? 'wide' : 'n', mouth: lt > lo ? 'o' : 'smile', brow: lt > lo ? 1 : 0.4 });
      } });
    cue(st, 'whoosh'); cue(st + te, 'pop', { gain: 0.4 }); cue(st + ho, 'sparkle', { dur: 0.4, gain: 0.35 }); cue(st + lo, 'pop', { gain: 0.8 }); cue(st + lo + 0.02, 'zip', { gain: 0.6 });
  }

  // ── 9 · inside a vacuum chamber in Houston: air pulled out through the pipe, dial to 0; pin + TEXAS ──────────
  {
    const st = cut(8), va = Wd('vacuum', 8) - st, hu = Wd('houston', 8) - st;
    const CX = 600, CY = 700, CS = 0.8, [px, py] = K.chamberPipe(CX, CY, CS);
    add({ id: 'S09', at: st, cam: [560, 640], zoom: 0.08, note: 'outside the chamber again: on "vacuum" blue air arrows rush out along the pump pipe and the tank\'s dial falls to 0; tester inside (hose loose, surprised); map pin + TEXAS pill pop on "Houston"',
      draw(lt, d, t) {
        plain();
        ctx.fillStyle = C.floor; ctx.fillRect(-300, 1150, W + 600, 800);
        const k = lt > va ? eio(seg(lt, va, va + 0.6)) : 0;
        K.chamber(CX, CY, CS, { level: lerp(0.4, 0, k), inside: () => K.suitTester({ x: 0, y: 130, s: 0.5, t, eyes: 'wide', mouth: 'o', brow: 1 }) });
        if (lt > va) for (let i = 0; i < 3; i++) {
          const ph = ((lt - va) * 1.6 + i / 3) % 1, a = Math.sin(ph * Math.PI) * (1 - seg(lt, va + 1.0, va + 1.3));
          K.flowArrow(px - 260 * CS + ph * 220, py, 110, 0, a, C.sky, 20);
        }
        K.mapPin(170, 340, 0.7, pop(lt, hu));
        K.pill('TEXAS', 170, 430, 50, C.ink, C.white, pop(lt, hu + 0.08));
      } });
    cue(st, 'whoosh'); cue(st + va, 'slide', { dur: 1.0, gain: 0.5 }); cue(st + hu, 'pop', { gain: 0.6 });
  }

  // ── 10 · His last memory? Spit boiling off his tongue: helmet close-up, thought bubble with a bubbling droplet ──
  {
    const st = cut(9), me = Wd('memory', 9) - st, sp = Wd('spit', 9) - st, bo = Wd('boiling', 9) - st, to = Wd('tongue', 9) - st;
    const BX = 820, BY = 370;
    add({ id: 'S10', at: st, cam: [520, 640], zoom: 0.1, note: 'chamber close-up of the tester\'s face in the helmet; thought bubble pops on "memory"; a water droplet appears in it on "Spit"; it fizzes (boils) on "boiling"; his eyes close peacefully on "tongue" (no injury)',
      draw(lt, d, t) {
        K.chamberRoom(t, 0);
        K.suitTester({ x: 380, y: 1260, s: 1.5, t, arm: K.ARM.chest, armL: K.ARM.chest, eyes: lt > to + 0.1 ? 'closed' : lt > sp ? 'wide' : 'n',
          mouth: lt > to + 0.1 ? 'flat' : lt > sp ? 'o' : 'flat', brow: lt > sp && lt < to ? 1 : 0.5, look: lt > me && lt < to ? 1 : 0 });
        const bs = pop(lt, me, 0.3);
        K.bubble(BX, BY, 380, 300, 640, 580, bs);
        if (bs > 0) {
          K.drop(BX, BY + 50, 2.0 * pop(lt, sp, 0.3), 0, 1);
          if (lt > bo) K.fizz(BX, BY + 10, 1.5, t, eo(seg(lt, bo, bo + 0.3)), { n: 7, spread: 70, rise: 90, seed: 5 });
        }
      } });
    cue(st, 'whoosh'); cue(st + me, 'pop', { gain: 0.5 }); cue(st + sp, 'plop', { gain: 0.5 }); cue(st + bo, 'bubbles', { dur: 1.1, gain: 0.6 }); cue(st + to + 0.1, 'tock', { gain: 0.4 });
  }

  // ── 11 · The air came back, he woke up, and went home for lunch ────────────────────────────────────────────────
  {
    const st = cut(10), ai = Wd('air', 10) - st, ba = Wd('back', 10) - st, wo = Wd('woke', 10) - st, ho = Wd('home', 10) - st, lu = Wd('lunch', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.06, note: 'inside the chamber: blue air arrows rush in from the right on "air", wall dial climbs back on "back"; tester\'s eyes open + smile on "woke"; home badge pops on "home", lunchbox opens with a sandwich on "lunch"; he grins',
      draw(lt, d, t) {
        K.chamberRoom(t, lt > ba ? eio(seg(lt, ba - 0.1, ba + 0.4)) : 0);
        K.suitTester({ x: 420, y: 900, s: 0.74, t, port: K.chamberPort, loose: 1, eyes: lt > wo ? 'n' : 'closed', mouth: lt > lu ? 'grin' : lt > wo ? 'smile' : 'flat', brow: lt > wo ? 0.7 : 0.3, look: lt > ho ? 1 : 0 });
        if (lt > ai) for (let i = 0; i < 4; i++) {
          const ph = ((lt - ai) * 1.5 + i / 4) % 1, a = Math.sin(ph * Math.PI) * (1 - seg(lt, wo - 0.2, wo + 0.1));
          K.flowArrow(1120 - ph * 380, 520 + i * 150, 130, Math.PI, a, C.sky, 22);
        }
        K.homeBadge(830, 520, 0.72, pop(lt, ho));
        K.lunchbox(830, 900, 0.62, lt > lu ? eo(seg(lt, lu, lu + 0.35)) : 0, pop(lt, lu - 0.05));
      } });
    cue(st, 'whoosh'); cue(st + ai, 'slide', { dur: 0.9, gain: 0.5 }); cue(st + ba, 'tock', { gain: 0.4 }); cue(st + wo, 'boing', { gain: 0.5 }); cue(st + ho, 'pop', { gain: 0.6 }); cue(st + lu, 'pop', { gain: 0.6 });
  }

  // ── 12 · No explosion, just a twelve second countdown: BOOM crossed out; 12 SEC timer runs on "countdown" ──────
  {
    const st = cut(11), ex = Wd('explosion', 11) - st, tw = Wd('twelve', 11) - st, cd = Wd('countdown', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 660], zoom: 0.06, note: 'space: BOOM pops (left), big red X slams on "explosion"; 12 SEC countdown pops on "twelve" (right), its red wedge runs down from "countdown"',
      draw(lt, d, t) {
        K.spaceBg(t);
        K.boom(320, 470, 0.72, eob(seg(lt, 0, 0.3)), t);
        if (lt > ex) K.redX(320, 470, lerp(1.4, 0.72, eo(seg(lt, ex, ex + 0.18))), 1);
        K.countdown(760, 830, 0.58, lt > cd ? 1 - 0.7 * eio(seg(lt, cd, d)) : 1, '12', pop(lt, tw));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.4 }); cue(st + ex, 'slam'); cue(st + tw, 'pop', { gain: 0.6 });
    for (let i = 0; i < 4; i++) cue(st + cd + i * 0.25, 'tock', { gain: 0.35 });
  }

  // ── 13a · Next Body File: the hero waves in the room; BODY FILES badge (name only) on "next" ──────────────────
  const HB = [810, 520];
  {
    const st = cut(12), nx = Wd('next', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 640], zoom: 0.05, note: 'room: BODY FILES badge (series name only) on "Next"; the hero waves with a smile',
      draw(lt) {
        K.home();
        K.filesBadge('BODY FILES', 540, 130, 52, pop(lt, nx));
        hero({ arm: K.armPose(K.ARM.down, K.ARM.wave, eio(seg(lt, 0.05, 0.4))), mouth: 'smile', brow: 0.5 });
      } });
    cue(st, 'whoosh'); cue(st + nx, 'thud', { gain: 0.6 });
  }
  // ── 13b · ...what happens if your hiccups won't stop: hiccup badge + NEXT on "hiccups", HIC! jolts ─────────────
  const hicAt = (lt, beats) => { let j = 0, b = -1; beats.forEach((h, i) => { if (lt > h) { j = Math.max(j, 1 - seg(lt, h + 0.08, h + 0.35)); b = i; } }); return { j: Math.max(0, j), b }; };
  {
    const st = at('happens', 12), hi = Wd('hiccups', 12) - st, wo = Wd('won', 12) - st, sp = Wd('stop', 12) - st;
    const beats = [hi + 0.15, sp];
    add({ id: 'S13b', at: st, cam: [560, 640], zoom: 0.05, note: 'room: hero lowers the wave and looks right, curious; hiccup badge (lungs over the dome diaphragm) + NEXT pop on "hiccups"; the diaphragm jolts with a HIC! bubble on "hiccups" and again on "stop"; ? on "won\'t"',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 130, 52, 1);
        const lw = 1 - eio(seg(lt, 0, 0.35));
        hero({ arm: K.armPose(K.ARM.down, K.ARM.wave, lw), look: 1, brow: lt > wo ? 0.9 : 0.6, mouth: lt > wo && lt < sp ? 'o' : 'smile' });
        const { j, b } = hicAt(lt, beats);
        K.hiccupBadge(HB[0], HB[1], 0.62, pop(lt, hi), j);
        K.pill('NEXT', HB[0], 300, 60, C.yellow, C.ink, pop(lt, hi + 0.05));
        if (b >= 0) { const h = beats[b]; K.hicBubble(600, 520 + (b % 2 ? 60 : -40), 0.8, pop(lt, h, 0.2), 1 - seg(lt, h + 0.45, h + 0.65), b % 2 ? 0.12 : -0.12); }
        bigText('?', 800, 840, 110, C.yellow, 0.12, pop(lt, wo, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + hi, 'pop', { gain: 0.6 }); cue(st + hi + 0.15, 'boing', { gain: 0.5 }); cue(st + wo, 'pop', { gain: 0.4 }); cue(st + sp, 'boing', { gain: 0.5 });
  }

  // ── 14 · END CARD: ...and the man who hiccuped for sixty-eight years: 68 YEARS calendar, NEXT, FOLLOW ─────────
  {
    const st = cut(13), hc = Wd('hiccuped', 13) - st, sx = Wd('sixty', 13) - st, ye = Wd('years', 13) - st;
    const beats = [0.35, hc + 0.1, ye + 0.5, ye + 1.4];
    add({ id: 'S14', at: st, cam: [600, 640], zoom: 0.04, note: 'end card: BODY FILES badge, hiccup badge + NEXT stay; diaphragm jolts with HIC! bubbles (incl. "hiccuped"); calendar 68 YEARS drops on "sixty"; FOLLOW pill after "years"; hero looks to camera with a curious smile',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 130, 52, 1);
        hero({ look: lt > ye + 0.3 ? 0 : 1, brow: 0.7, mouth: 'smile' });
        const { j, b } = hicAt(lt, beats);
        K.hiccupBadge(HB[0], HB[1], 0.62, 1, j);
        K.pill('NEXT', HB[0], 300, 60, C.yellow, C.ink, 1);
        if (b >= 0) { const h = beats[b]; K.hicBubble(600, 520 + (b % 2 ? 60 : -40), 0.8, pop(lt, h, 0.2), 1 - seg(lt, h + 0.45, h + 0.65), b % 2 ? 0.12 : -0.12); }
        if (lt > sx - 0.3) { const p = eob(seg(lt, sx - 0.3, sx + 0.1)); K.calendar(HB[0], lerp(-400, 930, p), 0.66, '68', 'YEARS', lerp(-0.3, 0.05, p)); }
        K.followPill(330, 270, pop(lt, ye + 0.3), t, 60);
      } });
    cue(st, 'whoosh'); cue(st + 0.35, 'boing', { gain: 0.45 }); cue(st + hc + 0.1, 'boing', { gain: 0.45 }); cue(st + sx + 0.1, 'thud');
    cue(st + ye + 0.3, 'pop', { gain: 0.6 }); cue(st + ye + 0.5, 'boing', { gain: 0.4 }); cue(st + ye + 1.4, 'boing', { gain: 0.35 });
  }

  return { shots: S, cues: CUES };
}
