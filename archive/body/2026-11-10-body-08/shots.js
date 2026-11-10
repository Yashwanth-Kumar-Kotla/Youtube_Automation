// WHAT HAPPENS WHEN YOUR EARS POP?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Tone: calm, curious explainer. Two diagrams carry it: the small ear-to-throat head lens (K.earCut, also the hook) and
// the middle-ear close-up (K.earZoom: canal, eardrum, pocket of air, the tube to the throat). Air is always pale blue,
// red only marks the problem (pressure arrows, the shut tube). Tease: calf-muscle lens that knots up + NEXT; hero watches.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, bigText, line, TAU } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
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
  const alpha = (a, fn) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); fn(); ctx.restore(); };
  const pointer = (x0, y0, x1, y1, a = 1) => alpha(a, () => { line([[x0, y0], [x1, y1]], C.ink, 10); ctx.beginPath(); ctx.arc(x1, y1, 13, 0, TAU); ctx.fillStyle = C.ink; ctx.fill(); });
  const label = (text, x, y, tx, ty, sc, size = 56, bg = C.ink, fg = C.white) => { if (sc <= 0) return; pointer(x, y, tx, ty, clamp(sc)); K.pill(text, x, y, size, bg, fg, sc); };

  // side lens used in the room shots (hook, yawn): right of the hero, below the window
  const SL = [800, 965, 175];

  // ── 1 · HOOK: hero cups his ear, the ear-to-throat lens pops beside him; POP! on "pop" ──
  {
    const ea = Wd('ears', 0), po = Wd('pop', 0);
    add({ id: 'S01', at: 0, cam: [560, 860], zoom: 0.08, note: 'room: hero raises a hand to his ear (curious) while the ear-to-throat lens pops in at right by 0.3 s; yellow ring on the ear in the lens on "ears"; on "pop" a POP! star by his head, hero wide-eyed "o"',
      draw(lt, d, t) {
        K.home();
        const wow = lt > po, up = eio(seg(lt, 0, 0.45));
        K.man({ x: 330, y: 1060, s: 1, arm: K.armPose(K.ARM.down, K.ARM.ear, up), look: 1, eyes: wow ? 'wide' : 'n', mouth: wow ? 'o' : 'smile', brow: wow ? 1 : lerp(0.2, 0.7, up) });
        K.earCut(SL[0], SL[1], SL[2], { sc: pop(lt, 0.03, 0.3), ear: lt > ea ? eo(seg(lt, ea, ea + 0.2)) : 0, t });
        K.popStar(450, 450, 0.4, pop(lt, po, 0.2), t);
        K.shockLines(330, 690, 150, wow ? clamp((lt - po) * 5) : 0);
      } });
    cue(0.03, 'whoosh', { gain: 0.5 }); cue(0.1, 'pop', { gain: 0.5 }); cue(ea, 'pop', { gain: 0.4 }); cue(po, 'pop', { gain: 0.9 });
  }

  // ── 2 · That pop is a hidden tube opening inside your head ──
  {
    const st = cut(1), po = Wd('pop', 1) - st, tu = Wd('tube', 1) - st, opn = Wd('opening', 1) - st;
    const X = 540, Y = 760, R = 360, k = R / 300, TM = [X + 36 * k, Y + 4 * k];
    add({ id: 'S02', at: st, cam: [560, 760], zoom: 0.08, note: 'big ear-to-throat lens; POP! star top-left on "pop" (fades); HIDDEN TUBE label points at the tube on "tube"; the tube glows yellow + air bubbles run along it on "opening"',
      draw(lt, d, t) {
        plain();
        K.earCut(X, Y, R, { sc: lerp(0.75, 1, eo(seg(lt, 0, 0.3))), tube: lt > opn ? eo(seg(lt, opn, opn + 0.25)) : 0, flow: lt > opn ? (lt - opn) * 1.2 : -1, t });
        K.popStar(200, 320, 0.45, pop(lt, po, 0.2) * out(lt, po + 0.4, 0.2), t);
        label('HIDDEN TUBE', 540, 280, TM[0], TM[1], pop(lt, tu));
      } });
    cue(st, 'whoosh'); cue(st + po, 'pop', { gain: 0.7 }); cue(st + tu, 'pop', { gain: 0.5 }); cue(st + opn, 'sparkle', { dur: 0.6, gain: 0.5 }); cue(st + opn + 0.1, 'bubbles', { dur: 0.8, gain: 0.3 });
  }

  // middle-ear close-up layout for lines 3-4
  const ZX = 540, ZY = 800, ZR = 330;
  // ── 3 · Behind each eardrum sits a pocket of air ──
  {
    const st = cut(2), ed = Wd('eardrum', 2) - st, pk = Wd('pocket', 2) - st, ai = Wd('air', 2) - st;
    const P = K.earZoom(ZX, ZY, ZR, { sc: 0 });
    add({ id: 'S03', at: st, cam: [520, 780], zoom: 0.07, note: 'middle-ear close-up lens: on "eardrum" the eardrum glows yellow + EARDRUM label; on "pocket" the air pocket behind it gets a yellow ring + POCKET OF AIR label (EARDRUM label fades first)',
      draw(lt, d, t) {
        plain();
        K.earZoom(ZX, ZY, ZR, { sc: lerp(0.8, 1, eo(seg(lt, 0, 0.3))), drum: lt > ed ? eo(seg(lt, ed, ed + 0.2)) * out(lt, pk, 0.2) : 0, pocket: lt > pk ? eo(seg(lt, pk, pk + 0.2)) : 0, t });
        label('EARDRUM', 540, 300, P.drum[0], P.drum[1] - 60, pop(lt, ed) * out(lt, pk - 0.15, 0.15));
        label('POCKET OF AIR', 540, 300, P.pocket[0], P.pocket[1] - 60, pop(lt, pk));
      } });
    cue(st, 'whoosh'); cue(st + ed, 'pop', { gain: 0.6 }); cue(st + pk, 'pop', { gain: 0.6 }); cue(st + ai, 'sparkle', { dur: 0.4, gain: 0.4 });
  }

  // ── 4a · linked to your throat by that tube ──
  {
    const st = cut(3), th = Wd('throat', 3) - st, tu = Wd('tube', 3) - st;
    const P = K.earZoom(ZX, ZY, ZR, { sc: 0 });
    add({ id: 'S04', at: st, cam: [620, 880], zoom: 0.1, note: 'same lens, camera drifts down-right: throat gets a yellow ring + THROAT label on "throat"; the tube from the pocket to the throat glows yellow on "tube" (THROAT label swaps to TUBE)',
      draw(lt, d, t) {
        plain();
        K.earZoom(ZX, ZY, ZR, { throat: lt > th ? eo(seg(lt, th, th + 0.2)) * out(lt, tu, 0.2) : 0, tube: lt > tu ? eo(seg(lt, tu, tu + 0.2)) : 0, t });
        label('THROAT', 540, 300, P.throat[0], P.throat[1], pop(lt, th) * out(lt, tu - 0.15, 0.15));
        label('TUBE', 540, 300, P.tube[0], P.tube[1], pop(lt, tu));
      } });
    cue(st, 'whoosh'); cue(st + th, 'pop', { gain: 0.6 }); cue(st + tu, 'sparkle', { dur: 0.4, gain: 0.5 });
  }
  // ── 4b · which usually stays shut ──
  {
    const st = at('which', 3), sh = Wd('shut', 3) - st;
    const P = K.earZoom(ZX, ZY, ZR, { sc: 0 });
    add({ id: 'S05', at: st, cam: [P.tube[0], P.tube[1] - 60], zoom: 0.18, note: 'push into the tube: it is a closed seam (no air channel); on "shut" red pinch arrows squeeze it + SHUT pill',
      draw(lt, d, t) {
        plain();
        K.earZoom(ZX, ZY, ZR, { tube: 0.35, t });
        K.pinchIcon(P.tube[0], P.tube[1], 0.55, lt > sh ? eio(seg(lt, sh, sh + 0.25)) : 0, pop(lt, sh, 0.25));
        K.pill('SHUT', 540, 330, 60, C.red, C.white, pop(lt, sh));
      } });
    cue(st, 'whoosh'); cue(st + sh, 'thud', { gain: 0.6 });
  }

  // ── 5a · On a plane ──
  {
    const st = cut(4), pl = Wd('plane', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.1, note: 'sky: an airliner climbs across from lower left (in by 0.3 s), clouds drift',
      draw(lt, d, t) {
        K.planeSky(t);
        const p = eo(seg(lt, 0, 0.9));
        K.airplane(lerp(120, 600, p), lerp(980, 700, p), 1.15, -0.22, 1);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'zip', { gain: 0.5 }); cue(st + pl, 'slide', { dur: 0.6, gain: 0.3 });
  }
  // ── 5b · air pressure changes faster than the tube can adjust ──
  {
    const st = at('air', 4), pr = Wd('pressure', 4) - st, ch = Wd('changes', 4) - st, fa = Wd('faster', 4) - st, tu = Wd('tube', 4) - st, ad = Wd('adjust', 4) - st;
    const X = 540, Y = 840, R = 290;
    const P = K.earZoom(X, Y, R, { sc: 0 });
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.06, note: 'top: small plane (left) + pressure dial (right); ear close-up below. Red pressure arrows push into the ear canal on "pressure"; the dial needle swings from "changes", faster on "faster"; eardrum bends in; the tube glows on "tube" but stays shut: red pinch on "adjust"',
      draw(lt, d, t) {
        plain();
        K.airplane(240, 330 + Math.sin(t * 3) * 6, 0.5, 0.12, pop(lt, 0.02));
        const sw = lt > ch ? (lt > fa ? Math.sin((lt - fa) * 16) : Math.sin((lt - ch) * 7)) : 0;
        K.pressureGauge(850, 330, 0.5, lt > ch ? 0.62 + 0.3 * sw * seg(lt, ch, ch + 0.2) : 0.62, pop(lt, 0.08));
        const ps = lt > pr ? eo(seg(lt, pr, pr + 0.3)) : 0;
        K.earZoom(X, Y, R, { press: ps, bow: 0.8 * eio(seg(lt, ch, fa + 0.3)), tube: lt > tu ? eo(seg(lt, tu, tu + 0.2)) * 0.8 : 0, t });
        K.pinchIcon(P.tube[0], P.tube[1], 0.5, lt > ad ? eio(seg(lt, ad, ad + 0.25)) : 0, pop(lt, ad, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + pr, 'slide', { dur: 0.5, gain: 0.4 }); cue(st + ch, 'tock', { gain: 0.5 }); cue(st + fa, 'tock', { gain: 0.6 }); cue(st + fa + 0.25, 'tock', { gain: 0.6 }); cue(st + tu, 'pop', { gain: 0.4 }); cue(st + ad, 'thud', { gain: 0.6 });
  }

  // ── 6a · so your eardrum can't move right ──
  {
    const st = cut(5), ed = Wd('eardrum', 5) - st, ca = Wd("can't", 5) - st;
    const X = 600, Y = 790, R = 350;
    const P = K.earZoom(X, Y, R, { bow: 0.8, sc: 0 });
    add({ id: 'S08', at: st, cam: [P.drum[0], 760], zoom: 0.12, note: 'close on the eardrum, bent inward by the red pressure arrows; sound waves roll down the canal; eardrum glows on "eardrum"; red CAN\'T MOVE pill on "can\'t", the eardrum only strains (tiny jitter)',
      draw(lt, d, t) {
        plain();
        const jit = lt > ca ? Math.sin(lt * 50) * 0.03 : 0;
        K.earZoom(X, Y, R, { bow: 0.8 + jit, press: 0.8, wave: t, drum: lt > ed ? eo(seg(lt, ed, ed + 0.2)) * 0.8 : 0, t });
        K.pill("CAN'T MOVE", 540, 330, 60, C.red, C.white, pop(lt, ca));
      } });
    cue(st, 'whoosh'); cue(st + ed, 'pop', { gain: 0.5 }); cue(st + ca, 'thud', { gain: 0.6 });
  }
  // ── 6b · and everything sounds muffled ──
  {
    const st = at('and', 5), ev = Wd('everything', 5) - st, so = Wd('sounds', 5) - st, mu = Wd('muffled', 5) - st;
    add({ id: 'S09', at: st, cam: [520, 860], zoom: 0.08, note: 'room: a speaker (right, below the window) plays; its sound waves reach the hero\'s ear grey and wobbly (muffled from the start, more on "muffled"); hero cups his ear on "sounds", puzzled brows + flat mouth; yellow "?" by his head on "muffled"',
      draw(lt, d, t) {
        K.home();
        const cup = eio(seg(lt, so - 0.15, so + 0.25));
        K.man({ x: 330, y: 1080, s: 1.05, arm: K.armPose(K.ARM.down, K.ARM.ear, cup), look: 1, mouth: 'flat', brow: lt > mu ? 1 : 0.6, frown: lt > mu });
        K.speaker(850, 990, 0.8, pop(lt, 0.02), Math.max(0, Math.sin(t * 9)));
        K.soundWaves(780, 935, -2.55, t, eo(seg(lt, 0.1, 0.4)), lerp(0.55, 1, eio(seg(lt, ev, mu))), 0.95);
        bigText('?', 210, 520, 120, C.yellow, -0.1, pop(lt, mu, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + so, 'slide', { dur: 0.3, gain: 0.3 }); cue(st + mu, 'boing', { gain: 0.4 });
  }

  // ── 7 · Then you swallow or yawn, the tube opens ──
  {
    const st = cut(6), sw = Wd('swallow', 6) - st, ya = Wd('yawn', 6) - st, tu = Wd('tube', 6) - st, op = Wd('opens', 6) - st;
    add({ id: 'S10', at: st, cam: [560, 860], zoom: 0.07, note: 'room: hero swallows on "swallow" (mouth shut, head dips), big yawn on "yawn" (eyes shut, arms stretch up), relaxes; the ear-to-throat lens at right: the tube glows on "tube" and air bubbles run through it on "opens"',
      draw(lt, d, t) {
        K.home();
        const gl = lt > sw && lt < ya ? Math.sin(clamp((lt - sw) / 0.35) * Math.PI) : 0;
        const yw = eio(seg(lt, ya - 0.1, ya + 0.25)) * out(lt, op + 0.15, 0.35), yawning = yw > 0.4;
        const arm = K.armPose(K.ARM.down, K.ARM.stretch, yw);
        K.man({ x: 300, y: 1080 + gl * 10, s: 1, arm, armL: arm, look: 1, eyes: yawning ? 'closed' : 'n', mouth: yawning ? 'yawn' : lt > sw && lt < ya ? 'flat' : 'smile', brow: yawning ? 0.9 : 0.4 });
        K.earCut(SL[0], SL[1], SL[2], { sc: pop(lt, 0.05), tube: lt > tu ? eo(seg(lt, tu, tu + 0.2)) : 0, flow: lt > op ? (lt - op) * 1.3 : -1, t });
      } });
    cue(st, 'whoosh'); cue(st + sw, 'gulp', { gain: 0.7 }); cue(st + ya, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + tu, 'sparkle', { dur: 0.5, gain: 0.4 }); cue(st + op, 'bubbles', { dur: 0.6, gain: 0.35 });
  }

  // ── 8 · air slips in, and pop, the pressure evens out ──
  {
    const st = cut(7), ai = Wd('air', 7) - st + 0.05, po = Wd('pop', 7) - st, ev = Wd('evens', 7) - st;
    const X = 540, Y = 800, R = 340;
    add({ id: 'S11', at: st, cam: [520, 780], zoom: 0.07, note: 'ear close-up, tube OPEN (blue air channel): air bubbles run up the tube into the pocket from "air"; on "pop" a POP! star (top-left) and the bent eardrum snaps flat, red arrows gone; on "evens" two equal blue arrows either side of the eardrum + green check (top-right)',
      draw(lt, d, t) {
        plain();
        const snap = lt > po ? eob(seg(lt, po, po + 0.3)) : 0;
        K.earZoom(X, Y, R, { open: 1, tube: 0.5, flow: lt > ai ? (lt - ai) * 1.4 : -1, air: out(lt, ev, 0.3), bow: lerp(0.8, 0, snap), press: 0.8 * out(lt, po, 0.2),
          even: lt > ev ? eo(seg(lt, ev, ev + 0.25)) : 0, t });
        K.popStar(200, 350, 0.45, pop(lt, po, 0.2) * out(lt, po + 0.5, 0.2), t);
        K.checkMark(880, 350, 1.2, pop(lt, ev));
      } });
    cue(st, 'whoosh'); cue(st + ai, 'bubbles', { dur: 1.0, gain: 0.4 }); cue(st + po, 'pop', { gain: 1.0 }); cue(st + ev, 'sparkle', { dur: 0.5, gain: 0.5 }); cue(st + ev + 0.05, 'pop', { gain: 0.5 });
  }

  // ── 9 · Chewing gum works too ──
  {
    const st = cut(8), gu = Wd('gum', 8) - st, wk = Wd('works', 8) - st;
    const SHOW = { e: [240, -60], h: [250, -200] };
    add({ id: 'S12', at: st, cam: [520, 860], zoom: 0.06, note: 'room: hero chews happily from the start, holding up a stick of gum (raised on "gum"); green check right of him on "works"',
      draw(lt, d, t) {
        K.home();
        const up = eio(seg(lt, gu - 0.25, gu + 0.1));
        K.man({ x: 360, y: 1070, s: 1.05, arm: K.armPose(K.ARM.down, SHOW, up), mouth: 'chew', chew: Math.abs(Math.sin(lt * 9)), brow: 0.5, look: 0.5,
          holding: up > 0.05 ? (hx, hy) => K.gum(hx + 30, hy - 40, 1.3, -0.3) : null });
        K.checkMark(800, 900, 1.3, pop(lt, wk));
      } });
    cue(st, 'whoosh'); cue(st + gu, 'pop', { gain: 0.5 }); cue(st + wk, 'sparkle', { dur: 0.4, gain: 0.5 });
  }

  // ── 10 · Still sore or muffled days later? See a doctor. ──
  {
    const st = cut(9), so = Wd('sore', 9) - st, mu = Wd('muffled', 9) - st, dy = Wd('days', 9) - st, dr = Wd('doctor', 9) - st, se = Wd('see', 9) - st;
    add({ id: 'S13', at: st, cam: [540, 880], zoom: 0.06, note: 'room: hero holds his ear, mildly concerned; small red ache marks by the ear on "sore", grey muffled waves on "muffled"; a calendar "? DAYS" drops in on "days"; on "doctor" the calendar slides out and the see-a-doctor badge pops; hero points at it, calm smile',
      draw(lt, d, t) {
        K.home();
        const pt = eio(seg(lt, se - 0.1, se + 0.25));
        const arm = lt < se - 0.1 ? K.ARM.ear : K.armPose(K.ARM.ear, K.ARM.side, pt);
        K.man({ x: 260, y: 1080, s: 1, arm, finger: pt > 0.6 ? Math.PI / 2 - 0.35 : null, look: 1, mouth: lt > dr ? 'smile' : 'flat', brow: lt > dr ? 0.4 : 0.7 });
        K.painZap(420, 640, 0.45, pop(lt, so, 0.25) * out(lt, mu, 0.2), t, [-1.1, -0.4, 0.3]);
        K.soundWaves(560, 780, Math.PI, t, lt > mu ? eo(seg(lt, mu, mu + 0.2)) * out(lt, se - 0.2, 0.2) : 0, 1, 0.6);
        const cin = lt > dy ? eob(seg(lt, dy, dy + 0.35)) : 0, cout = eio(seg(lt, dr - 0.1, dr + 0.15));
        if (lt > dy && cout < 1) K.calendar(lerp(830, 1300, cout), lerp(560, 930, clamp(cin)), 0.32, '?', 'DAYS', lerp(-0.2, 0.06, clamp(cin)));
        K.doctorBadge(830, 930, 0.8, pop(lt, dr));
      } });
    cue(st, 'whoosh'); cue(st + so, 'pop', { gain: 0.4 }); cue(st + dy, 'thud', { gain: 0.5 }); cue(st + dy + 0.3, 'tock', { gain: 0.5 }); cue(st + dr - 0.1, 'zip', { gain: 0.4 }); cue(st + dr, 'pop', { gain: 0.7 });
  }

  // ── 11-12 · TEASE + END CARD (room): hero stands right and only watches; calf lens left, NEXT, BODY FILES ──
  const HERO = { x: 800, y: 1150, s: 0.8 }, CL = [320, 820, 195], NEXTP = [320, 1110];
  const hero = (o) => K.man({ ...HERO, ...o });
  const knotAt = (c) => { const m = K.calfLens(CL[0], CL[1], CL[2], { clench: c, sc: 0 }).muscle; return [m[0], m[1]]; };
  {
    const st = cut(10), nx = Wd('next', 10) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.05, note: 'room: BODY FILES badge (series name only) pops on "Next"; hero (right) waves with his left arm, warm smile',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 150, 60, pop(lt, nx));
        const wv = eio(seg(lt, 0.05, 0.4));
        hero({ armL: K.armPose(K.ARM.down, K.ARM.wave, wv), mouth: 'smile', brow: 0.5 });
      } });
    cue(st, 'whoosh'); cue(st + nx, 'thud', { gain: 0.6 });
  }
  {
    const st = at('what', 10), ch = Wd('charley', 10) - st, sk = Wd('strikes', 10) - st;
    add({ id: 'S15', at: st, cam: [480, 800], zoom: 0.06, note: 'tease: hero lowers his wave and turns to look left; on "charley" a lower-leg lens (calf muscle in pink) + yellow NEXT pill pop in; on "strikes" the calf muscle bunches up, the foot points down and a red knot icon cinches on it; hero watches, brows up (no pain face)',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 150, 60, 1);
        const wv = 1 - eio(seg(lt, 0, 0.35));
        hero({ armL: K.armPose(K.ARM.down, K.ARM.wave, wv), look: lt > 0.3 ? -1 : 0, mouth: lt > sk ? 'o' : 'smile', brow: lt > sk ? 0.9 : 0.5 });
        const c = lt > sk ? eio(seg(lt, sk, sk + 0.3)) : 0;
        K.calfLens(CL[0], CL[1], CL[2], { sc: pop(lt, ch), clench: c, t });
        K.pill('NEXT', NEXTP[0], NEXTP[1], 60, C.yellow, C.ink, pop(lt, ch + 0.1));
        const [kx, ky] = knotAt(c);
        K.knotIcon(kx, ky, 0.36, c, pop(lt, sk + 0.1, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + ch, 'pop', { gain: 0.6 }); cue(st + ch + 0.1, 'pop', { gain: 0.5 }); cue(st + sk, 'slam', { gain: 0.5 });
  }
  {
    const st = cut(11), ca = Wd('calf', 11) - st;
    add({ id: 'S16', at: st, cam: [420, 760], zoom: 0.06, note: 'the muscle relaxes back (knot fades) and gets a yellow ring + CALF MUSCLE label on "calf"; NEXT stays; hero watches',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 150, 60, 1);
        hero({ look: -1, mouth: 'smile', brow: 0.7 });
        const c = 1 - eio(seg(lt, 0, 0.35));
        K.calfLens(CL[0], CL[1], CL[2], { clench: c, ring: lt > ca ? eo(seg(lt, ca, ca + 0.2)) : 0, t });
        const [kx, ky] = knotAt(c);
        K.knotIcon(kx, ky, 0.36, c, out(lt, 0, 0.3));
        K.pill('NEXT', NEXTP[0], NEXTP[1], 60, C.yellow, C.ink, 1);
        K.pill('CALF MUSCLE', CL[0], 500, 50, C.ink, C.white, pop(lt, ca));
      } });
    cue(st, 'whoosh'); cue(st + ca, 'pop', { gain: 0.6 });
  }
  {
    const st = at('clenches', 11), cl = Wd('clenches', 11) - st, ti = Wd('tight', 11) - st, it = Wd('itself', 11) - st;
    add({ id: 'S17', at: st, cam: [540, 760], zoom: 0.04, note: 'END CARD (room): BODY FILES badge; the calf muscle clenches on "clenches", the knot cinches on "tight"; small yellow "?" on "itself"; NEXT stays; CALF MUSCLE label fades, + FOLLOW pill pops after "itself"; hero turns to camera with a warm grin',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 150, 60, 1);
        const cam = lt > it + 0.3;
        hero({ look: cam ? 0 : -1, mouth: cam ? 'grin' : 'smile', brow: cam ? 0.5 : 0.8 });
        const c = lt > cl ? eio(seg(lt, cl, cl + 0.3)) : 0;
        K.calfLens(CL[0], CL[1], CL[2], { clench: c, ring: out(lt, 0, 0.3), t });
        const [kx, ky] = knotAt(c);
        K.knotIcon(kx, ky, 0.36, lt > ti ? lerp(0.4, 1, eo(seg(lt, ti, ti + 0.25))) : 0.4 * c, pop(lt, cl + 0.05, 0.25));
        K.pill('NEXT', NEXTP[0], NEXTP[1], 60, C.yellow, C.ink, 1);
        K.pill('CALF MUSCLE', CL[0], 500, 50, C.ink, C.white, out(lt, 0, 0.25));
        bigText('?', 110, 600, 100, C.yellow, -0.1, pop(lt, it, 0.25));
        K.followPill(CL[0], 470, pop(lt, it + 0.3), t, 54);
      } });
    cue(st, 'whoosh'); cue(st + cl, 'slam', { gain: 0.45 }); cue(st + ti, 'thud', { gain: 0.5 }); cue(st + it, 'boing', { gain: 0.4 }); cue(st + it + 0.3, 'pop', { gain: 0.7 });
  }

  // tidy ids (S01..): sorted by time
  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES };
}
