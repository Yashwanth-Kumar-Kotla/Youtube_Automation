// WHAT HAPPENS WHEN YOUR STOMACH GROWLS?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Tone: curious, friendly, never gross. Real world = THE room (K.home, framed wider via roomAt) with the hero at right and a
// lens at left showing his stomach (K.growlStomach). Inside views are flat diagrams: K.gutCut (gut close-up, squeeze waves
// pushing gas / fluid / food), K.bellyGut (stomach + intestines map). The hunger hormone is a little messenger (K.messenger).
// Tease (nosebleed): lens with K.cartoonNose (one small clean red drop) + K.heater (dry air) + NEXT; the hero only watches.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, bigText, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
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
  const ringIn = (lt, a, d = 0.2) => (lt > a ? eo(seg(lt, a, a + d)) : 0);
  // THE room, framed wider (camera pulled back): floor line at floorY, everything scaled k around x 540
  const roomAt = (floorY = 1120, k = 0.7) => {
    ctx.fillStyle = C.floor; ctx.fillRect(-300, -300, W + 600, H + 600);
    ctx.save(); ctx.translate(540, floorY); ctx.scale(k, k); ctx.translate(-540, -1560); K.home(); ctx.restore();
  };
  const HERO = { x: 830, y: 636, s: 0.78 };
  const hero = (o) => K.man({ ...HERO, ...o });
  const LENS = [310, 700, 225];
  const bellyLens = (sc, inner) => K.lens(LENS[0], LENS[1], LENS[2], sc, inner, '#FFF1E0');
  const grrr = (x, y, a, t, size = 110) => { if (a > 0) bigText('GRRR', x, y, size, C.white, -0.08, a * (1 + 0.04 * Math.sin(t * 20))); };
  const rumbleArcs = (x, y, r, a, t) => {   // ink rumble arcs left + right of a point
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.strokeStyle = C.ink; ctx.lineCap = 'round';
    for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) { const rr2 = r + k * 44, a0 = sd > 0 ? -0.5 : Math.PI - 0.5, w = Math.sin(t * 20 + k) * 0.06;
      ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(x, y, Math.max(0, rr2), a0 + w, a0 + 1 + w); ctx.stroke(); }
    ctx.restore();
  };

  // ── 1 · HOOK: hero in the room, hand on his belly; lens shows his stomach; on "growls" it GROWLS ──
  {
    const so = Wd('stomach', 0), gr = Wd('growls', 0);
    add({ id: 'S01', at: 0, cam: [540, 760], zoom: 0.08, note: 'room: hero (right) puts a hand on his belly and looks at a lens (left) showing his stomach; ring flicks on "stomach"; on "growls" the stomach shakes with rumble lines + GRRR, hero jolts wide-eyed',
      draw(lt, d, t) {
        roomAt();
        const g = lt > gr ? eo(seg(lt, gr, gr + 0.15)) : 0, sh = g ? Math.sin(t * 60) * 5 * Math.max(0, 1 - (lt - gr) * 2) : 0;
        hero({ x: HERO.x + sh, arm: K.armPose(K.ARM.down, K.ARM.belly, eio(seg(lt, 0, 0.35))), look: -1, eyes: g ? 'wide' : 'n', mouth: g ? 'o' : 'flat', brow: g ? 1 : 0.5 });
        bellyLens(pop(lt, 0.02), () => K.growlStomach(-6, -14, 0.82, { t, growl: g, mood: 'n' }));
        grrr(LENS[0], 370, pop(lt, gr, 0.25), t);
        if (lt > so && lt < gr + 0.1) K.hiRing(HERO.x + 30, HERO.y + 80, 95, 70, ringIn(lt, so) * out(lt, gr - 0.1, 0.15));
      } });
    cue(0.1, 'whoosh', { gain: 0.5 }); cue(0.05, 'pop', { gain: 0.4 }); cue(so, 'pop', { gain: 0.35 }); cue(gr, 'bubbles', { dur: 0.7, gain: 0.55 }); cue(gr + 0.05, 'thud', { gain: 0.5 });
  }

  // ── 2a · Hunger can kick in just two hours after you eat ──
  {
    const st = cut(1), tw = Wd('two', 1) - st, hr = Wd('hours', 1) - st, af = Wd('after', 1) - st, ea = Wd('eat', 1) - st;
    const CL = [540, 480, 230], PL = [300, 1000], ST = [790, 960];
    add({ id: 'S02', at: st, cam: [540, 900], zoom: 0.06, note: 'plain: burger on a plate gets eaten in bites; wall clock spins two hours on "two hours" (pale wedge = time passed); the stomach buddy goes from happy to hungry (small growl) on "after"; ring round the empty plate on "eat"',
      draw(lt, d, t) {
        plain();
        const spin = eio(seg(lt, tw, hr + 0.45));
        K.wallClock(CL[0], CL[1], CL[2], { hour: 2 * spin, from: 0, sc: pop(lt, 0.02) });
        K.mealPlate(PL[0], PL[1], 1.0, { eaten: eio(seg(lt, 0.15, tw - 0.1)), sc: pop(lt, 0.05) });
        const hungry = lt > af;
        K.growlStomach(ST[0], ST[1], 0.66, { t, mood: hungry ? 'hungry' : 'happy', growl: hungry ? 0.45 * eo(seg(lt, af, af + 0.2)) : 0, sc: pop(lt, 0.1) });
        K.hiRing(PL[0], PL[1] + 10, 258, 96, ringIn(lt, ea) * out(lt, d - 0.25, 0.2));
      } });
    cue(st, 'whoosh'); cue(st + 0.35, 'pop', { gain: 0.3 }); cue(st + 0.75, 'pop', { gain: 0.3 }); cue(st + 1.05, 'pop', { gain: 0.3 });
    cue(st + tw, 'slide', { dur: hr + 0.45 - tw, gain: 0.35 }); cue(st + hr + 0.45, 'tock', { gain: 0.6 }); cue(st + af, 'bubbles', { dur: 0.5, gain: 0.4 }); cue(st + ea, 'pop', { gain: 0.5 });
  }
  // ── 2b · …but the growl isn't always hunger ──
  {
    const st = at('but', 1), gr = Wd('growl', 1) - st, is = Wd('isn', 1) - st, al = Wd('always', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 900], zoom: 0.07, note: 'plain: big stomach buddy; on "growl" it shakes, rumble lines + GRRR; on "isn\'t" GRRR fades and a thought bubble with a burger pops above it; a "?" pops in the bubble on "always"',
      draw(lt, d, t) {
        plain();
        const g = lt > gr ? lerp(1, 0.35, eio(seg(lt, is, is + 0.4))) * eo(seg(lt, gr, gr + 0.15)) : 0;
        K.growlStomach(540, 760, 1.2, { t, growl: g, mood: 'n' });
        grrr(540, 330, pop(lt, gr, 0.25) * out(lt, is - 0.1, 0.2), t, 130);
        const b = pop(lt, is);
        if (b > 0) {
          K.bubble(540, 300, 560, 250, 610, 500, b);
          ctx.save(); ctx.translate(540, 300); ctx.scale(b, b);
          K.mealPlate(-90, 40, 0.5, {});
          bigText('?', 150, 0, 150, C.white, 0.12, pop(lt, al, 0.25) * (1 + 0.05 * Math.sin(t * 7)));
          ctx.restore();
        }
      } });
    cue(st, 'whoosh'); cue(st + gr, 'bubbles', { dur: 0.8, gain: 0.5 }); cue(st + gr + 0.05, 'thud', { gain: 0.45 }); cue(st + is, 'pop', { gain: 0.55 }); cue(st + al, 'boing', { gain: 0.4 });
  }

  // ── 3 · That sound is gas and fluid on the move ──
  {
    const st = cut(2), so = Wd('sound', 2) - st, ga = Wd('gas', 2) - st, fl = Wd('fluid', 2) - st, mv = Wd('move', 2) - st;
    const phase = (lt) => 0.35 * lt + 0.9 * Math.max(0, lt - (mv - 0.15));
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.07, note: 'gut close-up (cutaway tube): sound waves rise from it on "sound"; gas bubbles appear on "gas" (GAS pill), pale-blue fluid on "fluid" (FLUID pill); on "move" the squeeze waves speed up and a white arrow shows the direction',
      draw(lt, d, t) {
        plain();
        K.gutCut(720, phase(lt) + 3, { w: 470, squeeze: 1, gas: eo(seg(lt, ga, ga + 0.25)), fluid: eo(seg(lt, fl, fl + 0.3)) });
        K.soundWaves(540, 470, -Math.PI / 2, t, eo(seg(lt, so, so + 0.2)) * out(lt, mv - 0.35, 0.3), 0, 1.0);
        K.flowArrow(540, 330, 380, 0, eo(seg(lt, mv, mv + 0.25)), C.white, 34, C.ink);
        const gp = pop(lt, ga), fp = pop(lt, fl);
        if (gp > 0) { K.gasBubble(250, 1040, 30 * gp); K.pill('GAS', 380, 1040, 56, C.ink, C.white, gp); }
        if (fp > 0) { K.drop(650, 1040, 0.85 * fp); K.pill('FLUID', 810, 1040, 56, C.ink, C.white, fp); }
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 1.2, gain: 0.25 }); cue(st + so, 'pop', { gain: 0.4 }); cue(st + ga, 'bubbles', { dur: 0.6, gain: 0.5 }); cue(st + ga + 0.05, 'pop', { gain: 0.45 });
    cue(st + fl, 'plop', { gain: 0.5 }); cue(st + mv, 'slide', { dur: 0.5, gain: 0.45 });
  }

  // ── 4 · pushed by the muscles of your stomach and intestines ──
  const GM = [540, 725, 0.74];
  {
    const st = cut(3), mu = Wd('muscles', 3) - st, so = Wd('stomach', 3) - st, it = Wd('intestines', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 900], zoom: 0.06, note: 'gut map (stomach on top, intestines below) with gas bubbles riding along; squeeze bands start on "pushed" and get strong on "muscles"; yellow ring round the stomach on "stomach", round the intestines on "intestines"',
      draw(lt, d, t) {
        plain();
        const q = lerp(0.45, 1, eo(seg(lt, mu, mu + 0.25))) * eo(seg(lt, 0, 0.2));
        const P = K.bellyGut(GM[0], GM[1], GM[2], { t, squeeze: q, bubbles: 1 });
        K.hiRing(P.stomach[0] - 8, P.stomach[1] - 30, 205, 165, ringIn(lt, so) * out(lt, it - 0.1, 0.15));
        K.hiRing(P.low[0], P.low[1] + 20, 255, 230, ringIn(lt, it) * out(lt, d - 0.2, 0.2));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + mu, 'bubbles', { dur: 0.7, gain: 0.4 }); cue(st + so, 'pop', { gain: 0.55 }); cue(st + it, 'pop', { gain: 0.55 });
  }

  // ── 5 · An empty stomach sets off a hunger hormone ──
  {
    const st = cut(4), em = Wd('empty', 4) - st, se = Wd('sets', 4) - st, hu = Wd('hunger', 4) - st, ho = Wd('hormone', 4) - st;
    const A = [400, 760], B = [720, 650], CP = [640, 880], arrive = ho + 0.3;
    const qb = (u) => [lerp(lerp(A[0], CP[0], u), lerp(CP[0], B[0], u), u), lerp(lerp(A[1], CP[1], u), lerp(CP[1], B[1], u), u)];
    add({ id: 'S06', at: st, cam: [540, 660], zoom: 0.06, note: 'plain: fuel gauge (top left) drops to E on "empty" and the stomach buddy (bottom left) turns hungry; on "sets" a little orange messenger with an envelope pops out of the stomach and travels along a dashed path up to the brain buddy (top right), arriving just after "hormone"; the brain looks and its eyes go wide',
      draw(lt, d, t) {
        plain();
        K.fuelGauge(260, 400, 0.95, lerp(0.7, 0, eio(seg(lt, em, em + 0.4))));
        const hungry = lt > em + 0.1;
        K.growlStomach(290, 930, 0.9, { t, mood: hungry ? 'hungry' : 'n', sc: 1 });
        const u = eio(seg(lt, se, arrive));
        if (lt > se) { const pts = []; for (let i = 0; i <= 30; i++) pts.push(qb(i / 30)); ctx.save(); ctx.setLineDash([22, 18]); ctx.globalAlpha = 0.55 * eo(seg(lt, se, se + 0.2)) * out(lt, arrive + 0.1, 0.3); line(pts, C.ink, 9); ctx.setLineDash([]); ctx.restore(); }
        const got = lt > arrive;
        K.brainBuddy(770, 400, 0.75, { t, look: got ? -0.6 : -1, mouth: got ? 'smile' : 'smirk', eyes: 'n' });
        if (got) K.shockLines(770, 380, 230, eo(seg(lt, arrive, arrive + 0.15)) * out(lt, arrive + 0.45, 0.25));
        if (lt > se && u < 1) { const [mx, my] = qb(u); K.messenger(mx, my, 1.0, { t, sc: pop(lt, se, 0.25) * (1 - seg(u, 0.9, 1)) }); }
      } });
    cue(st, 'whoosh'); cue(st + em, 'slide', { dur: 0.4, gain: 0.35 }); cue(st + se, 'pop', { gain: 0.6 }); cue(st + se + 0.1, 'slide', { dur: arrive - se - 0.1, gain: 0.35 }); cue(st + arrive, 'boing', { gain: 0.45 });
  }

  // ── 6 · and those squeezes become hunger pangs ──
  {
    const st = cut(5), sq = Wd('squeezes', 5) - st, pa = Wd('pangs', 5) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.07, note: 'room: hero (right) with a hand on his belly; in the lens his hungry stomach squeezes in pulses from "squeezes"; on "pangs" he winces (eyes squeezed, wavy mouth) and ache swirls spin in the lens',
      draw(lt, d, t) {
        roomAt();
        const pang = lt > pa;
        hero({ arm: K.ARM.belly, look: -1, eyes: pang ? 'squeeze' : 'n', mouth: pang ? 'wavy' : 'flat', brow: pang ? 0.7 : 0.4, sad: pang ? 0.7 : 0.2 });
        const q = eo(seg(lt, sq, sq + 0.2));
        bellyLens(1, () => { K.growlStomach(-6, -14, 0.82, { t, mood: 'hungry', squeeze: q, growl: pang ? 0.35 : 0, rings: false }); K.ache(-6, 10, t, eo(seg(lt, pa, pa + 0.2))); });
      } });
    cue(st, 'whoosh'); cue(st + sq, 'bubbles', { dur: 0.9, gain: 0.4 }); cue(st + sq + 0.3, 'thud', { gain: 0.3 }); cue(st + pa, 'boing', { gain: 0.4 });
  }

  // ── 7 · But it can rumble at any time ──
  {
    const st = cut(6), ru = Wd('rumble', 6) - st, an = Wd('any', 6) - st;
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.07, note: 'plain: stomach buddy (left) growls on "rumble" (rumble lines + GRRR); wall clock (right) ticks, then its hands whizz round from "any"',
      draw(lt, d, t) {
        plain();
        const g = lt > ru ? eo(seg(lt, ru, ru + 0.15)) : 0;
        K.growlStomach(330, 840, 0.92, { t, growl: g, mood: 'n' });
        grrr(330, 470, pop(lt, ru, 0.25), t);
        const hr = 3 + 0.05 * lt + 7 * Math.max(0, lt - an) ** 1.2;
        K.wallClock(800, 600, 165, { hour: hr });
      } });
    cue(st, 'whoosh'); cue(st + ru, 'bubbles', { dur: 0.7, gain: 0.5 }); cue(st + ru + 0.05, 'thud', { gain: 0.4 }); cue(st + an, 'slide', { dur: 0.6, gain: 0.4 });
  }

  // ── 8 · Swallowed air or fizzy drinks do it too ──
  {
    const st = cut(7), sw = Wd('swallowed', 7) - st, ai = Wd('air', 7) - st, fz = Wd('fizzy', 7) - st, dr = Wd('drinks', 7) - st, to = Wd('too', 7) - st;
    const HD = [280, 450], CN = [800, 560], STM = [540, 945];
    const lane = (p0, p1, n, sp, a, lt) => { for (let k = 0; k < n; k++) { const u = (lt * sp + k / n) % 1; K.gasBubble(lerp(p0[0], p1[0], u), lerp(p0[1], p1[1], u), 13, a * Math.min(1, u * 6, (1 - u) * 6)); } };
    add({ id: 'S09', at: st, cam: [540, 900], zoom: 0.06, note: 'plain: hero head (left) gulps (mouth "o") on "swallowed", white air puffs drift into his mouth on "air"; soda can (right) pops on "fizzy" and fizzes on "drinks"; bubble lanes run from both down into the stomach buddy (bottom), which rumbles on "too"',
      draw(lt, d, t) {
        plain();
        const gulp = lt > sw;
        K.heroHead(HD[0], HD[1], 1.4, { eyes: 'n', mouth: gulp ? 'o' : 'smile', brow: gulp ? 0.6 : 0.3, look: 0.5 });
        const pa = eo(seg(lt, ai, ai + 0.2)) * out(lt, to + 0.1, 0.3);
        if (pa > 0) { ctx.save(); ctx.globalAlpha = pa; ctx.lineCap = 'round';
          for (let k = 0; k < 3; k++) { const u = (lt * 1.1 + k / 3) % 1, x0 = lerp(40, 180, u), y0 = HD[1] + 100 + (k - 1) * 40; ctx.globalAlpha = pa * Math.min(1, u * 5, (1 - u) * 5);
            ctx.beginPath(); for (let j = 0; j <= 10; j++) { const px = x0 - 70 + j * 7, py = y0 + Math.sin(j * 0.9 + t * 8 + k) * 7; j ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
            ctx.strokeStyle = C.ink; ctx.lineWidth = 16; ctx.stroke(); ctx.strokeStyle = C.white; ctx.lineWidth = 8; ctx.stroke(); }
          ctx.restore(); }
        K.sodaCan(CN[0], CN[1], 1.25, { t, fizz: eo(seg(lt, dr, dr + 0.2)), sc: pop(lt, fz) });
        if (lt > ai + 0.2) lane([HD[0] + 50, HD[1] + 230], [STM[0] - 90, STM[1] - 110], 4, 0.9, eo(seg(lt, ai + 0.2, ai + 0.4)), lt);
        if (lt > dr + 0.1) lane([CN[0] - 40, CN[1] + 230], [STM[0] + 90, STM[1] - 110], 4, 0.9, eo(seg(lt, dr + 0.1, dr + 0.3)), lt);
        const g = lt > to ? eo(seg(lt, to, to + 0.15)) : 0;
        K.growlStomach(STM[0], STM[1], 0.7, { t, growl: g, mood: 'n' });
      } });
    cue(st, 'whoosh'); cue(st + sw, 'gulp', { gain: 0.5 }); cue(st + ai, 'whoosh', { gain: 0.3 }); cue(st + fz, 'pop', { gain: 0.6 }); cue(st + dr, 'bubbles', { dur: 0.8, gain: 0.5 }); cue(st + to, 'thud', { gain: 0.45 });
  }

  // ── 9a · A rumble down low? ──
  {
    const st = cut(8), ru = Wd('rumble', 8) - st, lo = Wd('low', 8) - st;
    add({ id: 'S10', at: st, cam: [540, 1000], zoom: 0.14, note: 'gut map again, camera pushing toward the intestines: on "rumble" the lower gut shakes with rumble lines; yellow ring round the intestines on "low"',
      draw(lt, d, t) {
        plain();
        const r = lt > ru ? eo(seg(lt, ru, ru + 0.15)) : 0;
        const P = K.bellyGut(GM[0], GM[1], GM[2], { t, squeeze: 0.6, bubbles: 0.6, shakeLow: r });
        rumbleArcs(P.low[0], P.low[1] + 20, 300, r * out(lt, lo, 0.25), t);
        K.hiRing(P.low[0], P.low[1] + 20, 255, 230, ringIn(lt, lo));
      } });
    cue(st, 'whoosh'); cue(st + ru, 'bubbles', { dur: 0.8, gain: 0.5 }); cue(st + ru + 0.05, 'thud', { gain: 0.4 }); cue(st + lo, 'pop', { gain: 0.55 });
  }
  // ── 9b · Maybe just food passing through your intestines ──
  {
    const st = at('maybe', 8), fo = Wd('food', 8) - st, pa = Wd('passing', 8) - st, it = Wd('intestines', 8) - st;
    const phase = (lt) => 0.3 * lt + 0.75 * Math.max(0, lt - (pa - 0.1));
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.07, note: 'gut close-up (cutaway tube): brown food bits appear on "food", squeeze waves push them along faster from "passing"; on "intestines" a small lens (top right) pops with the gut map, intestines ringed',
      draw(lt, d, t) {
        plain();
        K.gutCut(800, phase(lt) + 7, { w: 380, squeeze: 1, gas: 0.35, food: eo(seg(lt, fo, fo + 0.25)) });
        const lp = pop(lt, it);
        K.lens(810, 360, 180, lp, () => { const P = K.bellyGut(0, -10, 0.24, { t, squeeze: 0.8, food: 1 }); K.hiRing(P.low[0], P.low[1] + 5, 74, 68, ringIn(lt, it + 0.15)); }, C.white);
      } });
    cue(st, 'whoosh'); cue(st + fo, 'pop', { gain: 0.5 }); cue(st + pa, 'slide', { dur: 0.8, gain: 0.4 }); cue(st + it, 'pop', { gain: 0.6 });
  }

  // ── 10 · Most of the time, it just means your gut's working ──
  {
    const st = cut(9), me = Wd('means', 9) - st, wo = Wd('working', 9) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.06, note: 'room: hero relaxed, hand on belly, smiling; lens shows a happy stomach rumbling softly; on "means" he nods; a green check pops above the lens on "working" and he grins',
      draw(lt, d, t) {
        roomAt();
        const nod = lt > me && lt < me + 0.5 ? Math.sin((lt - me) / 0.5 * Math.PI * 2) * 8 : 0;
        hero({ y: HERO.y + Math.max(0, nod), arm: K.ARM.belly, look: lt > wo ? 0 : -1, mouth: lt > wo ? 'grin' : 'smile', brow: 0.4 });
        bellyLens(1, () => K.growlStomach(-6, -14, 0.82, { t, mood: 'happy', growl: 0.22 + 0.08 * Math.sin(t * 3) }));
        K.checkMark(LENS[0], 330, 1.25, pop(lt, wo));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'bubbles', { dur: 0.8, gain: 0.25 }); cue(st + me, 'boing', { gain: 0.3 }); cue(st + wo, 'pop', { gain: 0.7 }); cue(st + wo + 0.05, 'sparkle', { dur: 0.5, gain: 0.35 });
  }

  // ── 11-15 · TEASE + END CARD (room): lens with the nose at left, NEXT, BODY FILES; hero watches ──
  const TL = [310, 745, 215], NX = [310, 1052];
  const teaseLens = (sc, { q = 0, nose = 0, bleed = 0, heat = -1, t = 0 } = {}) => {
    K.lens(TL[0], TL[1], TL[2], sc, () => {
      if (q > 0) bigText('?', 0, 0, 220, C.white, -0.08, q);
      if (nose > 0) K.cartoonNose(78, -14, 0.8, { bleed, sc: nose, t });
      if (heat >= 0) K.heater(-112, 92, 0.54, { heat, t, sc: 1 });
    }, '#FFF1E0');
  };
  const badge = (sc) => K.filesBadge('BODY FILES', 540, 130, 60, sc);
  {
    const st = cut(10), nx = Wd('next', 10) - st, bo = Wd('body', 10) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.05, note: 'room: hero (right) waves; a lens with a "?" pops at left; NEXT pill pops on "Next", BODY FILES badge on "Body"',
      draw(lt, d, t) {
        roomAt();
        badge(pop(lt, bo));
        const wv = eio(seg(lt, 0.05, 0.4)) * out(lt, d - 0.35, 0.3);
        hero({ armL: K.armPose(K.ARM.down, K.ARM.wave, wv), look: 0, mouth: 'smile', brow: 0.5 });
        teaseLens(pop(lt, 0.05), { q: 1 + 0.05 * Math.sin(t * 6) });
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, pop(lt, nx));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.5 }); cue(st + nx, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.6 });
  }
  {
    const st = at('what', 10), nb = Wd('nosebleed', 10) - st;
    add({ id: 'S14', at: st, cam: [420, 760], zoom: 0.06, note: 'same room: hero turns to the lens, curious; on "nosebleed" the "?" swaps for a cartoon nose and one small clean red drop grows under a nostril',
      draw(lt, d, t) {
        roomAt(); badge(1);
        hero({ look: -1, mouth: lt > nb ? 'o' : 'smile', brow: lt > nb ? 0.9 : 0.6 });
        teaseLens(1, { q: lt < nb ? 1 + 0.05 * Math.sin(t * 6) : out(lt, nb, 0.12), nose: pop(lt, nb), bleed: eo(seg(lt, nb + 0.25, nb + 0.7)), t });
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, 1);
      } });
    cue(st, 'whoosh'); cue(st + nb, 'pop', { gain: 0.6 }); cue(st + nb + 0.3, 'plop', { gain: 0.35 });
  }
  {
    const st = cut(11), dr = Wd('dry', 11) - st, ai = Wd('air', 11) - st;
    add({ id: 'S15', at: st, cam: [400, 760], zoom: 0.06, note: 'same room: in the lens a little heater pops beside the nose on "dry", warm wavy air lines rise from it on "air"; hero watches, brows up',
      draw(lt, d, t) {
        roomAt(); badge(1);
        hero({ look: -1, mouth: 'smile', brow: lt > dr ? 0.9 : 0.6 });
        const hp = pop(lt, dr);
        teaseLens(1, { nose: 1, bleed: 1, t, heat: hp > 0 ? eo(seg(lt, ai, ai + 0.2)) : -1 });
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, 1);
      } });
    cue(st, 'whoosh'); cue(st + dr, 'pop', { gain: 0.6 }); cue(st + ai, 'sizzle', { dur: 0.6, gain: 0.25 });
  }
  {
    const st = at('is', 11), ca = Wd('cause', 11) - st, cam = ca + 0.15;
    add({ id: 'S16', at: st, cam: [540, 760], zoom: 0.05, note: 'END CARD (room): BODY FILES badge, lens with the nose + heater (warm air keeps rising), NEXT pill; on "cause" the hero turns to camera with a warm grin and + FOLLOW pops above the lens',
      draw(lt, d, t) {
        roomAt(); badge(1);
        const toCam = lt > cam;
        hero({ look: toCam ? 0 : -1, mouth: toCam ? 'grin' : 'smile', brow: toCam ? 0.5 : 0.8 });
        teaseLens(1, { nose: 1, bleed: 1, heat: 1, t });
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, 1);
        K.followPill(TL[0], 420, pop(lt, cam), t, 60);
      } });
    cue(st, 'whoosh'); cue(st + cam, 'pop', { gain: 0.7 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES };
}
