// WHAT HAPPENS WHEN YOU CRY?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Tone: curious, a little playful (cartoon tear fountains, never sad-gory). Blue = tears only. Diagrams: K.glandEye (front eye,
// the gland behind the upper outside corner) and K.tearCut (side cutaway: eye → tear duct → nose → back of nose → throat).
// The hero lives in K.home(). Tease (blushing): K.blushLens (rosy cheeks, red spreading down to the chest) + NEXT; hero watches.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, bigText } from './core/lib.js';
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
  // THE room, framed wider (camera pulled back): floor line at floorY, everything scaled k around x 540
  const roomAt = (floorY, k) => {
    ctx.fillStyle = C.floor; ctx.fillRect(-300, -300, W + 600, H + 600);
    ctx.save(); ctx.translate(540, floorY); ctx.scale(k, k); ctx.translate(-540, -1560); K.home(); ctx.restore();
  };
  const LOW = { e: [172, 70], h: [182, 300] };                // arms hanging, hands far below the frame in close-ups
  const EYE = { e: [235, -110], h: [92, -330] };              // hand dabbing the (screen-right) eye
  const headPt = (x, y, s, lx, ly) => [x + lx * s, y + (ly - 350) * s];   // man() head-local point → screen

  // ── 1 · HOOK: close-up, eyes welling from frame 1; on "cry" cartoon tear fountains burst out ──
  {
    const cr = Wd('cry', 0);
    add({ id: 'S01', at: 0, cam: [540, 680], zoom: 0.08, note: 'room close-up: hero\'s eyes well up and tears run down his cheeks from frame 1 (sad brows, wobbly mouth); on "cry" he bawls and two cartoon tear fountains arc out of his eyes',
      draw(lt, d, t) {
        K.home();
        const b = lt > cr, g = b ? eo(seg(lt, cr, cr + 0.35)) : 0;
        K.man({ x: 540, y: 1530, s: 2.5, arm: LOW, armL: LOW, eyes: b ? 'squeeze' : 'n', mouth: b ? 'bawl' : 'sad', sad: 1, brow: 0.3,
          cry: lerp(0.35, 1, eo(seg(lt, 0, 0.6))), ct: t, gush: g, gushTo: [200, 300] });
      } });
    cue(0.15, 'whoosh', { gain: 0.5 }); cue(0.3, 'plop', { gain: 0.35 }); cue(cr, 'boing', { gain: 0.5 }); cue(cr + 0.05, 'bubbles', { dur: 0.6, gain: 0.35 });
  }

  // ── 2 · Your eyes flood, but the weirdest part happens in your nose. ──
  {
    const st = cut(1), fl = Wd('flood', 1) - st, bu = Wd('but', 1) - st, we = Wd('weirdest', 1) - st, no = Wd('nose', 1) - st;
    const X = 540, Y = 1450, s = 2.0, [nx, ny] = headPt(X, Y, s, 8, 34);
    add({ id: 'S02', at: st, cam: [nx, ny - 40], zoom: 0.16, note: 'room close-up: tear fountains pour out of both eyes, bigger on "flood"; on "but" they dry up to small streams and he goes curious; yellow "?" on "weirdest"; on "nose" a yellow ring circles his nose and he looks down at it',
      draw(lt, d, t) {
        K.home();
        const big = eo(seg(lt, fl, fl + 0.3)), g = out(lt, bu, 0.35), cur = lt > bu;
        K.man({ x: X, y: Y, s, arm: LOW, armL: LOW, eyes: cur ? 'n' : 'squeeze', mouth: lt > no ? 'o' : cur ? 'flat' : 'bawl', sad: cur ? 0 : 1, brow: cur ? 0.9 : 0.3,
          look: 0, cry: cur ? 0.6 : 1, ct: t, gush: g, gushTo: [lerp(150, 230, big), lerp(220, 330, big)] });
        if (lt > we) bigText('?', 230, 360, 200, C.yellow, -0.12, eob(seg(lt, we, we + 0.25)) * (1 + 0.04 * Math.sin(lt * 6)));
        K.hiRing(nx, ny, 66, 54, lt > no ? eo(seg(lt, no, no + 0.2)) : 0);
      } });
    cue(st, 'whoosh'); cue(st + fl, 'bubbles', { dur: 0.6, gain: 0.4 }); cue(st + bu, 'zip', { gain: 0.3 }); cue(st + we, 'boing', { gain: 0.45 }); cue(st + no, 'pop', { gain: 0.6 });
  }

  // ── 3a · Tears come from glands behind the… (front eye diagram, gland revealed on "glands") ──
  {
    const st = cut(2), gl = Wd('glands', 2) - st, EX = 540, EY = 760, ES = 1.0;
    const G = [EX + K.GLAND_EYE.gland[0] * ES, EY + K.GLAND_EYE.gland[1] * ES];
    add({ id: 'S03', at: st, cam: [G[0] - 60, G[1] + 80], zoom: 0.12, note: 'big eye diagram (nose side left, temple right): tear drops trickle in from the upper outside corner and run across the eye; on "glands" the pink tear gland (dashed = behind the skin) pops in at that corner with a yellow ring and a GLANDS tag',
      draw(lt, d, t) {
        plain();
        K.glandEye(EX, EY, ES, { gland: pop(lt, gl, 0.3), ring: lt > gl + 0.1 ? eo(seg(lt, gl + 0.1, gl + 0.3)) : 0, flow: t, t });
        K.tag('GLANDS', 760, 250, G[0], G[1] - 80 * ES, 60, pop(lt, gl + 0.15));
      } });
    cue(st, 'whoosh'); cue(st + 0.2, 'plop', { gain: 0.3 }); cue(st + gl, 'pop', { gain: 0.6 }); cue(st + gl + 0.15, 'pop', { gain: 0.45 });
  }

  // ── 3b · …the upper outside corner of each eye (face close-up, a gland lights up at each eye) ──
  {
    const st = at('upper', 2), ou = Wd('outside', 2) - st, ea = Wd('each', 2) - st;
    const X = 540, Y = 1640, s = 2.8, GL = [-1, 1].map((sd) => headPt(X, Y, s, sd * 66, -8));
    add({ id: 'S04', at: st, cam: [540, 650], zoom: 0.07, note: 'room close-up of the hero\'s face (curious, small tear streams): on "outside" a pink gland (dashed, behind the skin) + yellow ring appear at the upper outside corner of his screen-left eye; on "each" the same at the other eye',
      draw(lt, d, t) {
        K.home();
        K.man({ x: X, y: Y, s, arm: LOW, armL: LOW, eyes: 'n', mouth: 'smile', brow: 0.8, cry: 0.5, ct: t });
        GL.forEach(([gx, gy], i) => {
          const w = i ? ea : ou, sd = i ? 1 : -1;
          K.glandIcon(gx, gy, 0.62, sd * 0.35, pop(lt, w, 0.3));
          K.hiRing(gx, gy + 4, 112, 80, lt > w + 0.08 ? eo(seg(lt, w + 0.08, w + 0.28)) : 0, sd * 0.35);
        });
      } });
    cue(st, 'whoosh'); cue(st + ou, 'pop', { gain: 0.6 }); cue(st + ea, 'pop', { gain: 0.6 });
  }

  // ── 4 · Strong feelings like sadness or joy open the floodgates ──
  {
    const st = cut(3), sa = Wd('sadness', 3) - st, jo = Wd('joy', 3) - st, op = Wd('open', 3) - st;
    const A = [540, 420], B = [540, 930], R = 225;
    add({ id: 'S05', at: st, cam: [540, 660], zoom: 0.07, note: 'two faces in round frames stacked (pale blue top, pale yellow bottom), both calm at first, glancing at each other; on "sadness" the top one turns sad and teary; on "joy" the bottom one squeezes its eyes in a happy grin with tears; on "open" both burst into tear fountains',
      draw(lt, d, t) {
        plain();
        for (const [[x, y], col] of [[A, '#DCEFF7'], [B, '#FFF1B8']]) { K.lens(x, y, R, 1, null, col); }
        const g = lt > op ? eo(seg(lt, op, op + 0.35)) : 0, sad = lt > sa, joy = lt > jo;
        K.heroHead(A[0] + Math.sin(lt * 3) * 4, A[1] + 20, 1.5, { eyes: 'n', look: sad ? 0 : 0.6, sad: sad ? 1 : 0, mouth: sad ? 'sad' : 'flat', brow: sad ? 0.3 : 0.4,
          cry: sad ? eo(seg(lt, sa, sa + 0.4)) : 0, ct: t, gush: g, gushTo: [150, 130] });
        K.heroHead(B[0] + Math.sin(lt * 3 + 1) * 4, B[1] + 20, 1.5, { eyes: joy ? 'squeeze' : 'n', look: joy ? 0 : -0.6, mouth: joy ? 'grin' : 'flat', brow: joy ? 0.8 : 0.4,
          cry: joy ? eo(seg(lt, jo, jo + 0.4)) : 0, ct: t + 0.3, gush: g, gushTo: [150, 130] });
      } });
    cue(st, 'whoosh'); cue(st + sa, 'plop', { gain: 0.45 }); cue(st + jo, 'sparkle', { dur: 0.4, gain: 0.4 }); cue(st + op, 'bubbles', { dur: 0.8, gain: 0.45 });
  }

  // ── 5a · and those emotional tears carry… (a tear falls and gets magnified) ──
  {
    const st = cut(4), te = Wd('emotional', 4) - st, ca = Wd('carry', 4) - st;
    const HX = 540, HY = 420, HS = 2.0, D0 = [HX - 52 * HS, HY + 110 * HS], LZ = [436, 925, 220];
    add({ id: 'S06', at: st, cam: [500, 700], zoom: 0.08, note: 'the hero\'s face, teary and sad; a tear rolls off his cheek and falls; on "emotional" a magnifier lens pops round it and the drop swells big; on "carry" two tiny molecules appear inside the drop',
      draw(lt, d, t) {
        plain();
        K.heroHead(HX, HY, HS, { eyes: 'n', sad: 1, mouth: 'sad', brow: 0.3, cry: 1, ct: t });
        const f = eio(seg(lt, 0.2, te));
        if (lt < te + 0.05) K.drop(D0[0], lerp(D0[1], LZ[1], f), 0.6, 0, 1);
        const z = pop(lt, te, 0.35);
        K.lens(LZ[0], LZ[1], LZ[2], z, () => {
          K.drop(0, 0, lerp(0.6, 3.6, clamp(z)), 0, 1);
          K.tearMolecule('stress', -34, 0, 0.5, pop(lt, ca, 0.3), 0, t);
          K.tearMolecule('calm', 30, 90, 0.5, pop(lt, ca + 0.1, 0.3), -0.2, t);
        }, '#DCEFF7');
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + te, 'pop', { gain: 0.6 }); cue(st + ca, 'sparkle', { dur: 0.4, gain: 0.4 });
  }

  // ── 5b · …extra stress hormones and natural painkillers (labelled icons inside the magnified drop) ──
  {
    const st = at('extra', 4), ex = Wd('extra', 4) - st, sr = Wd('stress', 4) - st, pk = Wd('painkillers', 4) - st;
    const LX = 540, LY = 680, LR = 300, SM = [LX - 50, LY + 10], PM = [LX + 50, LY + 150];
    add({ id: 'S07', at: st, cam: [540, 690], zoom: 0.07, note: 'magnified tear drop in a lens with the two molecules bobbing; the drop swells a little on "extra"; on "stress" the red jittery molecule bounces and a STRESS HORMONES tag pops above; on "painkillers" the green molecule bounces and a NATURAL PAINKILLERS tag pops below',
      draw(lt, d, t) {
        plain();
        const sw = 1 + 0.05 * Math.sin(Math.PI * seg(lt, ex, ex + 0.4));
        const bS = 1 + 0.35 * Math.sin(Math.PI * seg(lt, sr, sr + 0.35)), bP = 1 + 0.35 * Math.sin(Math.PI * seg(lt, pk, pk + 0.35));
        K.lens(LX, LY, LR, 1, () => {
          K.drop(0, 0, 5.2 * sw, 0, 1);
          K.tearMolecule('stress', SM[0] - LX, SM[1] - LY + Math.sin(t * 2) * 6, 0.85 * bS, 1, 0, t);
          K.tearMolecule('calm', PM[0] - LX, PM[1] - LY + Math.sin(t * 2 + 1) * 6, 0.85 * bP, 1, -0.2, t);
        }, '#DCEFF7');
        K.tag('STRESS HORMONES', 540, 262, SM[0], SM[1] - 50, 54, pop(lt, sr + 0.05));
        K.tag('NATURAL PAINKILLERS', 540, 1092, PM[0], PM[1] + 40, 50, pop(lt, pk + 0.05));
      } });
    cue(st, 'whoosh'); cue(st + sr, 'pop', { gain: 0.6 }); cue(st + pk, 'pop', { gain: 0.6 });
  }

  // ── 6a · Normally, every blink… (eye diagram: a blink sweeps tears to the drain hole at the inner corner) ──
  {
    const st = cut(5), bl = Wd('blink', 5) - st, dr = Wd('drains', 5) - st;
    add({ id: 'S08', at: st, cam: [440, 760], zoom: 0.08, note: 'the eye diagram again, calm: tear drops trickle from the gland across the eye; on "blink" the lid shuts and opens; on "drains" a yellow ring marks the little drain hole at the inner corner where the drops go',
      draw(lt, d, t) {
        plain();
        const lid = lt > bl ? Math.sin(Math.PI * seg(lt, bl, bl + 0.3)) : 0;
        K.glandEye(540, 760, 1.0, { gland: 1, flow: t * (lt > dr ? 1.6 : 1), lid, punct: lt > dr ? eo(seg(lt, dr, dr + 0.2)) : 0, t });
      } });
    cue(st, 'whoosh'); cue(st + bl, 'tock', { gain: 0.45 }); cue(st + dr, 'pop', { gain: 0.5 });
  }

  // side cutaway lens shared by the next shots
  const TX = 540, TY = 760, TR = 360;
  const P = (p) => K.tcPt(TX, TY, TR, p);

  // ── 6b · …drains used tears into your tear ducts ──
  {
    const st = at('used', 5), te = Wd('tears', 5) - st, du = Wd('ducts', 5) - st - 0.2;
    const DP = P(K.TC.duct);
    add({ id: 'S09', at: st, cam: [DP[0] - 60, DP[1]], zoom: 0.1, note: 'side cutaway of the head (eye, pink tear duct running down into the nose): he blinks; on "tears" drops leave the eye and slide down the duct; on "tear ducts" the duct lights up yellow and a TEAR DUCT tag pops',
      draw(lt, d, t) {
        plain();
        const lid = Math.sin(Math.PI * seg(lt, 0.25, 0.5));
        K.tearCut(TX, TY, TR, { lid, flow: lt > te ? t - te - st : -1, n: 3, reach: K.TC_U.ductEnd + 0.04, duct: lt > du ? eo(seg(lt, du, du + 0.25)) : 0, t });
        K.tag('TEAR DUCT', 800, 250, DP[0] + 20, DP[1] + 15, 60, pop(lt, du + 0.1));
      } });
    cue(st, 'whoosh'); cue(st + 0.25, 'tock', { gain: 0.35 }); cue(st + te, 'slide', { dur: 0.8, gain: 0.3 }); cue(st + du + 0.1, 'pop', { gain: 0.6 });
  }

  // ── 7 · which empty into the back of your nose ──
  {
    const st = cut(6), em = Wd('empty', 6) - st, ba = Wd('back', 6) - st, no = Wd('nose', 6) - st;
    const BP = P(K.TC.back);
    add({ id: 'S10', at: st, cam: [BP[0] + 40, BP[1] - 20], zoom: 0.14, note: 'same cutaway: drops run eye → duct → into the nose; on "empty" a blue arrow points them back along the nose; on "back" a yellow ring marks the back of the nose; on "nose" a BACK OF NOSE tag pops',
      draw(lt, d, t) {
        plain();
        K.tearCut(TX, TY, TR, { flow: t, n: 4, reach: K.TC_U.back, duct: 0.35, back: lt > ba ? eo(seg(lt, ba, ba + 0.2)) : 0, t });
        const [ax, ay] = P([128, -42]);
        K.flowArrow(ax, ay + 70, 120, Math.PI + 0.15, lt > em ? eo(seg(lt, em, em + 0.25)) : 0);
        K.tag('BACK OF NOSE', 520, 250, BP[0], BP[1] - 60, 60, pop(lt, no));
      } });
    cue(st, 'whoosh'); cue(st + 0.2, 'slide', { dur: 0.8, gain: 0.3 }); cue(st + em, 'zip', { gain: 0.35 }); cue(st + ba, 'pop', { gain: 0.55 }); cue(st + no, 'pop', { gain: 0.55 });
  }

  // ── 8 · Cry, and tears rush in faster than usual ──
  {
    const st = cut(7), ru = Wd('rush', 7) - st, fa = Wd('faster', 7) - st;
    add({ id: 'S11', at: st, cam: [600, 640], zoom: 0.08, note: 'same cutaway, now crying (eye shut, tear on the cheek, sad mouth): drops already trickle; on "rush" many more drops race down the duct with blue arrows and a speed gauge pops on top at "usual"; on "faster" the needle swings into the red',
      draw(lt, d, t) {
        plain();
        const r = lt > ru;
        K.tearCut(TX, TY, TR, { cry: 1, flow: t, n: r ? 8 : 3, speed: r ? 2.4 : 1, reach: K.TC_U.back, t });
        const a = r ? eo(seg(lt, ru, ru + 0.25)) : 0;
        const [d1x, d1y] = P([196, -50]), [d2x, d2y] = P([150, -48]);
        K.flowArrow(d1x + 90, d1y, 110, Math.PI / 2 + 0.2, a);
        
        K.speedGauge(540, 250, 0.7, lerp(0.3, 0.92, eob(seg(lt, fa, fa + 0.35))) + (lt > fa + 0.35 ? Math.sin(t * 30) * 0.015 : 0), pop(lt, ru));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'plop', { gain: 0.35 }); cue(st + ru, 'bubbles', { dur: 1.2, gain: 0.45 }); cue(st + ru, 'pop', { gain: 0.45 }); cue(st + fa, 'zip', { gain: 0.5 });
  }

  // ── 9 · then drain down into your throat ──
  {
    const st = cut(8), dr = Wd('drain', 8) - st, th = Wd('throat', 8) - st;
    const TP = P(K.TC.throat);
    add({ id: 'S12', at: st, cam: [TP[0], TP[1] - 120], zoom: 0.1, note: 'same cutaway, still crying: on "drain" the drops keep going past the back of the nose and down the throat, with a blue down-arrow beside it; on "throat" the throat lights up yellow and a THROAT tag pops',
      draw(lt, d, t) {
        plain();
        const reach = lerp(K.TC_U.back, 0.97, eio(seg(lt, dr, dr + 0.6)));
        K.tearCut(TX, TY, TR, { cry: 0.8, flow: t, n: 8, speed: 1.8, reach, throat: lt > th ? eo(seg(lt, th, th + 0.2)) : 0, t });
        const [ax, ay] = P([-10, 150]);
        K.flowArrow(ax, ay, 170, Math.PI / 2, lt > dr ? eo(seg(lt, dr + 0.1, dr + 0.35)) : 0);
        K.tag('THROAT', 860, 1150, TP[0] + 5, TP[1] + 95, 60, pop(lt, th));
      } });
    cue(st, 'whoosh'); cue(st + dr, 'slide', { dur: 0.7, gain: 0.35 }); cue(st + dr + 0.4, 'gulp', { gain: 0.45 }); cue(st + th, 'pop', { gain: 0.6 });
  }

  // ── 10 · That's why a good cry leaves you feeling stuffy. ──
  {
    const st = cut(9), le = Wd('leaves', 9) - st, fe = Wd('feeling', 9) - st, su = Wd('stuffy', 9) - st;
    const X = 540, Y = 1540, s = 2.3;
    add({ id: 'S13', at: st, cam: [560, 700], zoom: 0.09, note: 'room close-up: hero dabs a teary eye with a tissue; on "leaves" the tears dry up; on "feeling" he moves the tissue to his nose; on "stuffy" his nose goes rosy, eyes droop, flat mouth (stuffy)',
      draw(lt, d, t) {
        K.home();
        const dab = Math.sin(lt * 9) * 0.06 * (lt < fe ? 1 : 0), mv = eio(seg(lt, fe, fe + 0.3));
        const arm = K.armPose({ e: [EYE.e[0], EYE.e[1]], h: [EYE.h[0] + dab * 100, EYE.h[1] + dab * 60] }, K.ARM.nose, mv);
        const sf = lt > su ? eo(seg(lt, su, su + 0.3)) : 0;
        K.man({ x: X, y: Y, s, arm, armL: LOW, eyes: 'n', look: -0.5, mouth: lt > su ? 'flat' : 'sad', sad: 0.6, brow: 0.3, tired: 0.6 * sf, stuffy: sf,
          cry: 0.7 * out(lt, le, 0.5), ct: t, holding: (hx, hy) => K.tissue(hx + 10, hy - 6, 0.7, -0.2) });
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'boing', { gain: 0.25 }); cue(st + fe, 'slide', { dur: 0.3, gain: 0.3 }); cue(st + su, 'boing', { gain: 0.45 });
  }

  // ── 11-12 · TEASE + END CARD (room, camera pulled back): blush lens left, NEXT, BODY FILES; hero right only watches ──
  const HERO = { x: 830, y: 681, s: 0.78 }, BL = [310, 760, 200], NX = [310, 1060];
  const hero = (o) => K.man({ ...HERO, ...o });
  {
    const st = cut(10), nx = Wd('next', 10) - st, wh = Wd('what', 10) - st, bl = Wd('blush', 10) - st;
    add({ id: 'S14', at: st, cam: [540, 700], zoom: 0.05, note: 'room (wider): BODY FILES badge pops on "Next" while the hero (right) waves; on "what" a lens with a cartoon face + neck + chest and a yellow NEXT pill pop at left, hero turns to look; on "blush" her cheeks go rosy',
      draw(lt, d, t) {
        roomAt(1165, 0.7);
        K.filesBadge('BODY FILES', 540, 130, 60, pop(lt, nx));
        const wv = eio(seg(lt, 0.05, 0.4)) * out(lt, wh - 0.4, 0.35);
        hero({ armL: K.armPose(K.ARM.down, K.ARM.wave, wv), look: lt > wh ? -1 : 0, mouth: 'smile', brow: lt > bl ? 0.8 : 0.5 });
        K.blushLens(BL[0], BL[1], BL[2], { sc: pop(lt, wh), blush: lt > bl ? eo(seg(lt, bl, bl + 0.35)) : 0, t });
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, pop(lt, wh + 0.1));
      } });
    cue(st, 'whoosh'); cue(st + nx, 'thud', { gain: 0.6 }); cue(st + wh, 'pop', { gain: 0.6 }); cue(st + wh + 0.1, 'pop', { gain: 0.5 }); cue(st + bl, 'sparkle', { dur: 0.4, gain: 0.4 });
  }
  {
    const st = cut(11), re = Wd('red', 11) - st, sp = Wd('spread', 11) - st, ch = Wd('chest', 11) - st, cam = ch + 0.35;
    add({ id: 'S15', at: st, cam: [420, 760], zoom: 0.06, note: 'END CARD (room): BODY FILES badge; cheeks glow a bit redder on "red"; from "spread" the red fills down the neck and reaches the upper chest on "chest" (flat bands, lighter lower down, gently pulsing); NEXT stays; hero watches, then turns to camera with a warm grin and + FOLLOW pops',
      draw(lt, d, t) {
        roomAt(1165, 0.7);
        K.filesBadge('BODY FILES', 540, 130, 60, 1);
        const toCam = lt > cam;
        hero({ look: toCam ? 0 : -1, mouth: toCam ? 'grin' : 'smile', brow: toCam ? 0.5 : 0.8 });
        K.blushLens(BL[0], BL[1], BL[2], { blush: 1 + 0.15 * Math.sin(Math.PI * seg(lt, re, re + 0.4)), spread: eio(seg(lt, sp, ch + 0.2)), t });
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, 1);
        K.followPill(BL[0], 440, pop(lt, cam), t, 54);
      } });
    cue(st, 'whoosh'); cue(st + re, 'pop', { gain: 0.4 }); cue(st + sp, 'sparkle', { dur: 0.9, gain: 0.35 }); cue(st + cam, 'pop', { gain: 0.7 });
  }

  // tidy ids (S01..): sorted by time
  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES };
}
