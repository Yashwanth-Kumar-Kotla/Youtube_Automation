// WHAT HAPPENS WHEN YOU BLUSH?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Tone: curious, a little playful. Red = the blush (blood) only. The hero lives in K.home() and blushes via man({ blush }).
// The three places + the spread to the chest are shown on the "diagram person" (K.blushBust / K.blushLens), never on the hero.
// Tease (motion sickness): K.seaBoat + K.queasyFace (a drop of saliva) in a lens + NEXT; the hero only watches.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, bigText, line } from './core/lib.js';
import { L, Wd, T, lineWords } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i) - 0.08;                       // a mid-line cut just before word w
  const nth = (w, i, n) => lineWords(i).filter((x) => x.w.toLowerCase().replace(/[^a-z']/g, '').startsWith(w))[n].s;   // n-th occurrence
  const plain = () => { ctx.fillStyle = C.bg; ctx.fillRect(-300, -300, W + 600, H + 600); };
  const pop = (lt, a, d = 0.3) => (lt > a ? eob(seg(lt, a, a + d)) : 0);
  const out = (lt, a, d = 0.25) => 1 - eio(seg(lt, a, a + d));
  const ringIn = (lt, a, d = 0.2) => (lt > a ? eo(seg(lt, a, a + d)) : 0);
  // THE room, framed wider (camera pulled back): floor line at floorY, everything scaled k around x 540
  const roomAt = (floorY, k) => {
    ctx.fillStyle = C.floor; ctx.fillRect(-300, -300, W + 600, H + 600);
    ctx.save(); ctx.translate(540, floorY); ctx.scale(k, k); ctx.translate(-540, -1560); K.home(); ctx.restore();
  };
  const LOW = { e: [172, 70], h: [182, 300] };                // arms hanging, hands far below the frame in close-ups
  const SCRATCH = { e: [250, -150], h: [150, -330] };         // awkward hand at the back of the head (= K.ARM.ear)
  const CHEEKS = { e: [225, -40], h: [122, -246] };           // hands on the jaw, under the cheeks
  const headPt = (x, y, s, lx, ly) => [x + lx * s, y + (ly - 350) * s];   // man() head-local point → screen
  const BP = (x, y, s, k) => [x + K.BUST[k][0] * s, y + K.BUST[k][1] * s];

  // ── 1 · HOOK: close-up, the hero is already going red (awkward, hand at the back of his head); on "blush" it peaks ──
  {
    const bl = Wd('blush', 0);
    const X = 540, Y = 1500, s = 2.3, CK = [-1, 1].map((sd) => headPt(X, Y, s, sd * 60, 46));
    add({ id: 'S01', at: 0, cam: [540, 760], zoom: 0.08, note: 'room close-up: from frame 1 the hero blushes (cheeks reddening, sweat drop), awkwardly scratching the back of his head and glancing aside; on "blush" the red peaks with a pulse and yellow rings circle both cheeks',
      draw(lt, d, t) {
        K.home();
        const b = lerp(0.3, 0.8, eo(seg(lt, 0, 0.5))), pk = lt > bl ? 0.2 * eo(seg(lt, bl, bl + 0.25)) + 0.04 * Math.sin(t * 6) : 0;
        const arm = K.armPose(LOW, SCRATCH, eio(seg(lt, 0, 0.45)));
        const sc = Math.sin(lt * 14) * 0.04 * (lt < bl ? 1 : 0);
        K.man({ x: X, y: Y, s, arm: { e: arm.e, h: [arm.h[0] + sc * 200, arm.h[1]] }, armL: LOW, eyes: lt > bl ? 'wide' : 'n', look: lt > bl ? 0 : -1,
          mouth: lt > bl ? 'o' : 'flat', brow: lt > bl ? 1 : 0.6, blush: clamp(b + pk), sweat: eo(seg(lt, 0.1, 0.4)) });
        CK.forEach(([cx, cy]) => K.hiRing(cx, cy, 92, 64, ringIn(lt, bl + 0.05)));
      } });
    cue(0.15, 'whoosh', { gain: 0.5 }); cue(0.3, 'sparkle', { dur: 0.6, gain: 0.3 }); cue(bl, 'boing', { gain: 0.5 }); cue(bl + 0.05, 'pop', { gain: 0.6 });
  }

  // the diagram person for the three places
  const BX = 540, BY = 760, BS = 1.2;
  const [ckx, cky] = BP(BX, BY, BS, 'cheek'), [nkx, nky] = BP(BX, BY, BS, 'neck'), [chx, chy] = BP(BX, BY, BS, 'chest');

  // ── 2a · Blushing can hit three places… (1 cheeks, 2 neck, 3 = "?" under the shirt) ──
  {
    const st = cut(1), bu = Wd('blushing', 1) - st, hi = Wd('hit', 1) - st, th = Wd('three', 1) - st, pl = Wd('places', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.06, note: 'diagram person (brown bob, green collared shirt, NOT the hero) front bust: cheeks redden on "Blushing"; on "hit" a ring + yellow 1 on the cheek; on "three" the neck reddens with a ring + 2; on "places" a yellow 3 and a "?" pop on the buttoned shirt over the chest',
      draw(lt, d, t) {
        plain();
        K.blushBust(BX, BY, BS, { cheek: eo(seg(lt, bu, bu + 0.4)), neck: eo(seg(lt, th, th + 0.3)), t, look: 0 });
        K.hiRing(ckx, cky, 74, 56, ringIn(lt, hi)); K.pill('1', 810, cky - 10, 56, C.yellow, C.ink, pop(lt, hi));
        K.hiRing(nkx, nky, 100, 90, ringIn(lt, th)); K.pill('2', 760, nky, 56, C.yellow, C.ink, pop(lt, th));
        K.pill('3', 780, chy + 60, 56, C.yellow, C.ink, pop(lt, pl));
        if (lt > pl) bigText('?', chx - 150, chy + 80, 130, C.yellow, -0.12, eob(seg(lt, pl, pl + 0.25)) * (1 + 0.04 * Math.sin(lt * 6)));
      } });
    cue(st, 'whoosh'); cue(st + bu, 'sparkle', { dur: 0.4, gain: 0.35 }); cue(st + hi, 'pop', { gain: 0.6 }); cue(st + th, 'pop', { gain: 0.6 }); cue(st + pl, 'boing', { gain: 0.45 });
  }

  // ── 2b · …and one hides under your shirt (the collar peeks open: red on the upper chest) ──
  {
    const st = at('and', 1), hd = Wd('hides', 1) - st, un = Wd('under', 1) - st, sh = Wd('shirt', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 860], zoom: 0.2, note: 'same bust (cheeks + neck red), camera pushes down to the buttoned collar with the yellow 3; on "hides" the collar peeks open a little and the upper chest under it is red too; on "shirt" a yellow ring circles the open collar',
      draw(lt, d, t) {
        plain();
        const pk = eio(seg(lt, hd, un + 0.3));
        K.blushBust(BX, BY, BS, { cheek: 1, neck: 1, chest: 1, peek: pk, t, look: lt > hd ? 0.6 : 0, mouth: lt > hd ? 'o' : 'smile' });
        K.pill('3', 780, chy + 60, 56, C.yellow, C.ink, 1);
        K.hiRing(chx, chy + 20, 140, 104, ringIn(lt, sh));
      } });
    cue(st, 'whoosh'); cue(st + hd, 'slide', { dur: 0.5, gain: 0.35 }); cue(st + hd + 0.4, 'sparkle', { dur: 0.4, gain: 0.35 }); cue(st + sh, 'pop', { gain: 0.6 });
  }

  // ── 3a · It starts with a strong feeling (feeling meter swings into the red) ──
  {
    const st = cut(2), sa = Wd('starts', 2) - st, sg = Wd('strong', 2) - st, fe = Wd('feeling', 2) - st;
    const X = 690, Y = 1500, s = 1.45;
    add({ id: 'S04', at: st, cam: [520, 760], zoom: 0.07, note: 'room: hero (right) calm; a feeling meter at left with a FEELING pill under it; on "starts" its needle starts to rise, on "strong" it swings hard into the red and the hero\'s eyes go wide with shock lines, cheeks starting to warm',
      draw(lt, d, t) {
        K.home();
        const sh = lt > sg;
        K.man({ x: X, y: Y, s, arm: LOW, armL: LOW, eyes: sh ? 'wide' : 'n', look: -1, mouth: sh ? 'o' : 'smile', brow: sh ? 1 : 0.4, blush: sh ? 0.35 * eo(seg(lt, fe, fe + 0.4)) : 0 });
        K.shockLines(X, Y - 338 * s, 225, sh ? clamp((lt - sg) * 5) : 0);
        const lev = lt < sa ? 0.12 : lt < sg ? lerp(0.12, 0.4, eio(seg(lt, sa, sg))) : lerp(0.4, 0.95, eob(seg(lt, sg, sg + 0.35)));
        K.speedGauge(290, 560, 1.0, lev + (sh ? Math.sin(t * 30) * 0.012 : 0), eob(seg(lt, 0, 0.3)));
        K.pill('FEELING', 290, 720, 54, C.ink, C.white, eob(seg(lt, 0.1, 0.4)));
      } });
    cue(st, 'whoosh'); cue(st + sa, 'slide', { dur: sg - sa, gain: 0.3 }); cue(st + sg, 'zip', { gain: 0.55 }); cue(st + sg + 0.05, 'boing', { gain: 0.45 });
  }

  // ── 3b · like embarrassment or affection (awkward → a heart pops, shy smile) ──
  {
    const st = at('like', 2), em = Wd('embarrassment', 2) - st, af = Wd('affection', 2) - st;
    const X = 620, Y = 1460, s = 2.1;
    add({ id: 'S05', at: st, cam: [560, 720], zoom: 0.08, note: 'room close-up: on "embarrassment" the hero goes awkward (scratches the back of his head, glances aside, sweat drop, flat mouth, cheeks pink); on "affection" his hand drops, a red love heart pops at left, he looks at it with a shy smile and his cheeks go redder',
      draw(lt, d, t) {
        K.home();
        const aw = lt > em && lt < af, lv = lt > af;
        const arm = K.armPose(LOW, SCRATCH, eio(seg(lt, em, em + 0.3)) * out(lt, af, 0.3));
        const wig = aw ? Math.sin(lt * 14) * 8 : 0;
        K.man({ x: X, y: Y, s, arm: { e: arm.e, h: [arm.h[0] + wig, arm.h[1]] }, armL: LOW, eyes: 'n', look: -1, mouth: lv ? 'smile' : aw ? 'flat' : 'smile', brow: aw ? 0.7 : 0.4,
          blush: lv ? lerp(0.55, 0.9, eo(seg(lt, af, af + 0.4))) : aw ? 0.55 * eo(seg(lt, em, em + 0.4)) : 0.15, sweat: aw ? eo(seg(lt, em, em + 0.3)) : 0 });
        K.loveHeart(220, 470, 0.75, pop(lt, af, 0.35), Math.max(0, Math.sin(t * 7)) * (lv ? 1 : 0), -0.15);
      } });
    cue(st, 'whoosh'); cue(st + em, 'boing', { gain: 0.4 }); cue(st + af, 'pop', { gain: 0.6 }); cue(st + af + 0.1, 'sparkle', { dur: 0.5, gain: 0.35 });
  }

  // ── 4a · Your nerves tell the blood vessels… (a signal runs from the brain along a nerve to a vessel) ──
  const VL = [640, 930, 230];                                 // vessel lens
  const NV = [[350, 470], [300, 580], [380, 670], [478, 772]];
  {
    const st = cut(3), ne = Wd('nerves', 3) - st, te = Wd('tell', 3) - st, ve = Wd('vessels', 3) - st;
    add({ id: 'S06', at: st, cam: [520, 700], zoom: 0.08, note: 'diagram: small brain top-left, a nerve draws down from it on "nerves" (NERVE tag) into a round lens showing a thin blood vessel under the skin; on "tell" a yellow signal runs along the nerve, reaching the lens on "vessels" where a BLOOD VESSEL tag pops',
      draw(lt, d, t) {
        plain();
        K.brain(300, 390, 0.48, { t, wob: lt > te ? 1 : 0 });
        K.lens(VL[0], VL[1], VL[2], eob(seg(lt, 0, 0.3)), () => { K.vessel(0, 46, t, 1); }, '#F6D2BE');
        K.nerve(NV, lt > te ? lerp(0, 1, seg(lt, te, ve)) : -1, eo(seg(lt, 0.05, ne + 0.25)));
        K.tag('NERVE', 215, 790, 318, 615, 54, pop(lt, ne));
        K.tag('BLOOD VESSEL', 720, 560, 690, VL[1] - 50, 48, pop(lt, ve));
      } });
    cue(st, 'whoosh'); cue(st + ne, 'pop', { gain: 0.5 }); cue(st + te, 'zip', { gain: 0.4 }); cue(st + ve, 'pop', { gain: 0.6 });
  }

  // ── 4b · …in your face to open wide (the vessel widens) ──
  {
    const st = at('in', 3), fa = Wd('face', 3) - st, op = Wd('open', 3) - st, wi = Wd('wide', 3) - st;
    const LX = 600, LY = 830, LR = 300, HX = 250, HY = 370, HS = 0.9, CK = [HX + 60 * HS, HY + 34 * HS];
    add({ id: 'S07', at: st, cam: [600, 800], zoom: 0.1, note: 'big lens with the blood vessel (thin, cells drifting); on "face" a small hero head pops top-left with a yellow ring on his cheek and a line linking it to the lens; on "open" the vessel widens to "wide", red arrows pushing outward, cells rush faster',
      draw(lt, d, t) {
        plain();
        const w = eio(seg(lt, op, wi + 0.3));
        K.lens(LX, LY, LR, 1, () => {
          K.vessel(0, lerp(46, 150, w), t * (1 + w), 1 + w);
          for (const sd of [-1, 1]) K.flowArrow(sd * 0 + 0, sd * (lerp(46, 150, w) + 70), 90, sd * Math.PI / 2, lt > op ? eo(seg(lt, op, op + 0.2)) * out(lt, wi + 0.45, 0.3) : 0, C.red, 20);
        }, '#F6D2BE');
        const hp = pop(lt, fa);
        if (hp > 0) {
          ctx.save(); ctx.globalAlpha = clamp(hp); line([[CK[0] + 30, CK[1] + 30], [LX - LR * 0.62, LY - LR * 0.78]], C.ink, 8); ctx.restore();
          ctx.save(); ctx.translate(HX, HY); ctx.scale(hp, hp); K.heroHead(0, 0, HS, { eyes: 'n', look: 1, mouth: 'smile', brow: 0.5, blush: 0.4 }); ctx.restore();
          K.hiRing(CK[0], CK[1], 44, 34, ringIn(lt, fa + 0.1));
        }
      } });
    cue(st, 'whoosh'); cue(st + fa, 'pop', { gain: 0.6 }); cue(st + op, 'slide', { dur: wi - op + 0.3, gain: 0.4 }); cue(st + wi, 'boing', { gain: 0.45 });
  }

  // ── 5 · flooding the skin with blood, no permission needed ──
  {
    const st = cut(4), fl = Wd('flooding', 4) - st, bl = Wd('blood', 4) - st, no = Wd('no', 4) - st, pe = Wd('permission', 4) - st;
    const X = 560, Y = 1470, s = 2.05, CK = [-1, 1].map((sd) => headPt(X, Y, s, sd * 60, 46));
    add({ id: 'S08', at: st, cam: [560, 760], zoom: 0.08, note: 'room close-up: on "flooding" red arrows rise from the neck toward both cheeks and the red floods in (full by "blood"); on "no" he throws both hands up in a startled whoa, eyes wide, but on "permission" it pulses even redder anyway',
      draw(lt, d, t) {
        K.home();
        const hands = eio(seg(lt, no - 0.1, no + 0.25));
        const b = lt < fl ? 0.2 : lerp(0.2, 0.85, eio(seg(lt, fl, bl + 0.2))), pk = lt > pe ? 0.15 * eo(seg(lt, pe, pe + 0.25)) + 0.05 * Math.sin(t * 7) : 0;
        K.man({ x: X, y: Y, s, arm: K.armPose(LOW, CHEEKS, hands), armL: K.armPose(LOW, CHEEKS, hands), eyes: lt > no ? 'wide' : 'n', look: lt > no ? 0 : -0.6,
          mouth: lt > no ? 'o' : 'flat', brow: lt > no ? 1 : 0.5, blush: clamp(b + pk) });
        const fa = lt > fl ? eo(seg(lt, fl, fl + 0.25)) * out(lt, no - 0.15, 0.25) : 0;
        CK.forEach(([cx, cy], i) => { const sd = i ? 1 : -1, u = (t * 1.6) % 1; K.flowArrow(cx + sd * 175, cy + 190 - u * 30, 150, -Math.PI / 2 - sd * 0.55, fa, C.red, 22); });
      } });
    cue(st, 'whoosh'); cue(st + fl, 'bubbles', { dur: 0.9, gain: 0.35 }); cue(st + no, 'zip', { gain: 0.4 }); cue(st + pe, 'boing', { gain: 0.5 });
  }

  // ── 6 · That's the red that lights up your cheeks ──
  {
    const st = cut(5), re = Wd('red', 5) - st, li = Wd('lights', 5) - st, ch = Wd('cheeks', 5) - st;
    const X = 540, Y = 1540, s = 2.4, CK = [-1, 1].map((sd) => headPt(X, Y, s, sd * 60, 46));
    add({ id: 'S09', at: st, cam: [540, 740], zoom: 0.1, note: 'room close-up, frontal: shy smile at camera, cheeks red; on "red" they pulse brighter, on "lights" yellow sparkles flash beside them, on "cheeks" yellow rings circle both cheeks',
      draw(lt, d, t) {
        K.home();
        const pk = lt > re ? 0.1 + 0.06 * Math.sin(t * 6) : 0;
        K.man({ x: X, y: Y, s, arm: LOW, armL: LOW, eyes: 'n', look: 0, mouth: 'smile', brow: 0.5, blush: clamp(0.85 + pk) });
        const sp = pop(lt, li, 0.3) * out(lt, ch + 0.3, 0.3);
        CK.forEach(([cx, cy], i) => { const sd = i ? 1 : -1; K.sparkle4(cx + sd * 175, cy - 90, 34, sp, t); K.sparkle4(cx + sd * 150, cy + 60, 22, sp, -t); });
        CK.forEach(([cx, cy]) => K.hiRing(cx, cy, 96, 66, ringIn(lt, ch)));
      } });
    cue(st, 'whoosh'); cue(st + re, 'pop', { gain: 0.4 }); cue(st + li, 'sparkle', { dur: 0.5, gain: 0.45 }); cue(st + ch, 'pop', { gain: 0.6 });
  }

  // the diagram person again, in a lens: the red runs down the neck onto the upper chest
  const BL = [500, 700, 320], LK = BL[2] / 300;
  const blP = (lx, ly) => [BL[0] + lx * LK, BL[1] + ly * LK];
  const lensRing = (lx, ly, rx, ry, a) => { if (a <= 0) return; ctx.save(); ctx.beginPath(); ctx.arc(BL[0], BL[1], BL[2] - 8, 0, Math.PI * 2); ctx.clip(); const [x, y] = blP(lx, ly); K.hiRing(x, y, rx, ry, a); ctx.restore(); };
  const downArrow = (u, a) => K.flowArrow(BL[0] + BL[2] + 110, lerp(BL[1] - 140, BL[1] + 60, u), 200, Math.PI / 2, a, C.red, 24);

  // ── 7 · In some people, the blood rush keeps going ──
  {
    const st = cut(6), so = Wd('some', 6) - st, ru = Wd('rush', 6) - st, go = Wd('going', 6) - st;
    add({ id: 'S10', at: st, cam: [540, 640], zoom: 0.07, note: 'three person icons top (the middle one turns red on "some"); below, the diagram person in a lens with red cheeks; on "rush" a red arrow beside the lens points down and the red starts down the top of her neck, still going on "going"',
      draw(lt, d, t) {
        plain();
        [[340, C.shirt], [540, C.red], [740, C.shirt]].forEach(([x, col], i) => K.personIcon(x, 230, 0.62, i === 1 && lt > so ? col : C.shirt, i === 1 && lt > so ? 1 + 0.15 * Math.sin(Math.PI * seg(lt, so, so + 0.3)) : eob(seg(lt, 0.05 * i, 0.3 + 0.05 * i))));
        K.blushLens(BL[0], BL[1], BL[2], { blush: 1, spread: lt > ru ? lerp(0, 0.3, eio(seg(lt, ru, go + 0.3))) : 0, t, sc: eob(seg(lt, 0, 0.3)) });
        downArrow(lt > ru ? eio(seg(lt, ru, go + 0.4)) : 0, lt > ru ? eo(seg(lt, ru, ru + 0.2)) : 0);
      } });
    cue(st, 'whoosh'); cue(st + so, 'pop', { gain: 0.5 }); cue(st + ru, 'slide', { dur: go - ru + 0.3, gain: 0.4 });
  }

  // ── 8 · down the neck and right onto the upper chest ──
  {
    const st = cut(7), ne = Wd('neck', 7) - st, ri = Wd('right', 7) - st, up = Wd('upper', 7) - st, ch = Wd('chest', 7) - st;
    add({ id: 'S11', at: st, cam: [500, 820], zoom: 0.1, note: 'same lens, camera drifts down: the red fills down the neck (yellow ring on the neck on "neck"), then on "right onto" it reaches the upper chest (ring on the chest on "upper"); the red arrow beside the lens follows it down',
      draw(lt, d, t) {
        plain();
        const sp = lt < ri ? lerp(0.3, 0.6, eio(seg(lt, 0, ri))) : lerp(0.6, 1, eio(seg(lt, ri, ch + 0.2)));
        K.blushLens(BL[0], BL[1], BL[2], { blush: 1, spread: sp, t });
        lensRing(0, 100, 90, 92, ringIn(lt, ne) * out(lt, up - 0.1, 0.2));
        lensRing(0, 212, 150, 60, ringIn(lt, up));
        downArrow(lerp(0.55, 1, eio(seg(lt, 0, ch))), out(lt, ch + 0.3, 0.3));
      } });
    cue(st, 'whoosh'); cue(st + ne, 'pop', { gain: 0.5 }); cue(st + ri, 'slide', { dur: ch - ri, gain: 0.35 }); cue(st + up, 'pop', { gain: 0.6 });
  }

  // ── 9 · On darker skin, it can look darker, not red ──
  {
    const st = cut(8), sk = Wd('skin', 8) - st, lo = Wd('look', 8) - st, dk = nth('darker', 8, 1) - st, re = Wd('red', 8) - st;
    const D = [300, 640], Lt = [780, 640], R = 205;
    add({ id: 'S12', at: st, cam: [540, 700], zoom: 0.07, note: 'two equal faces side by side in lenses: deep brown skin (left), lighter skin (right, already blushing red). On "look" the deep-skinned face blushes: its cheeks turn a deeper, darker shade, not red; DARKER pill pops under it on "darker", RED pill under the other on "red"',
      draw(lt, d, t) {
        plain();
        K.toneFace(D[0], D[1], R, { tone: 'deep', flush: lt > lo ? eio(seg(lt, lo, dk + 0.3)) : 0, look: 0.6, t, sc: eob(seg(lt, 0, 0.3)) * (1 + 0.04 * Math.sin(Math.PI * seg(lt, sk, sk + 0.3))), bg: '#FFF1B8' });
        K.toneFace(Lt[0], Lt[1], R, { tone: 'light', flush: 0.9, look: -0.6, t, sc: eob(seg(lt, 0.08, 0.38)), bg: '#DCEFF7' });
        K.pill('DARKER', D[0], 950, 58, C.ink, C.white, pop(lt, dk));
        K.pill('RED', Lt[0], 950, 58, C.red, C.white, pop(lt, re));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.4 }); cue(st + lo, 'sparkle', { dur: 0.5, gain: 0.35 }); cue(st + dk, 'pop', { gain: 0.6 }); cue(st + re, 'pop', { gain: 0.55 });
  }

  // ── 10 · Once you relax, it usually fades on its own ──
  {
    const st = cut(9), rl = Wd('relax', 9) - st, fa = Wd('fades', 9) - st, ow = Wd('own', 9) - st;
    const X = 600, Y = 1440, s = 1.9;
    add({ id: 'S13', at: st, cam: [560, 760], zoom: 0.08, note: 'room close-up: hero still red and a bit tense; on "relax" he closes his eyes, smiles and his shoulders settle (slow breath); from "fades" the red fades away by "own", and a green check pops at left on "own"; he ends calm and warm',
      draw(lt, d, t) {
        K.home();
        const rx = lt > rl, br = rx ? Math.sin(Math.PI * seg(lt, rl, rl + 0.9)) * 12 : 0;
        K.man({ x: X, y: Y + br, s, arm: LOW, armL: LOW, eyes: rx ? 'closed' : 'n', look: -0.6, mouth: rx ? 'smile' : 'flat', brow: rx ? 0.3 : 0.7,
          blush: 0.9 * (1 - eio(seg(lt, fa, ow + 0.25))), sweat: out(lt, rl, 0.3) });
        K.checkMark(250, 520, 1.6, pop(lt, ow, 0.3));
      } });
    cue(st, 'whoosh'); cue(st + rl, 'slide', { dur: 0.8, gain: 0.25 }); cue(st + fa, 'sparkle', { dur: ow - fa + 0.3, gain: 0.35 }); cue(st + ow, 'pop', { gain: 0.6 });
  }

  // ── 11-12 · TEASE + END CARD (room, camera pulled back): lens with a boat + queasy face at left, NEXT, BODY FILES; hero watches ──
  const HERO = { x: 830, y: 681, s: 0.78 }, TL = [310, 760, 215], NX = [310, 1072];
  const hero = (o) => K.man({ ...HERO, ...o });
  const teaseLens = (sc, { boat = 0, face = 0, drool = 0, ring = 0, jolt = 0, t = 0, q = 0 } = {}) => {
    K.lens(TL[0], TL[1], TL[2], sc, () => {
      if (q > 0) bigText('?', 0, 0, 220, C.yellow, -0.08, q);
      if (boat > 0) K.seaBoat(0, 105, 0.55, { t, sc: boat });
      if (face > 0) K.queasyFace(jolt, -98, 0.58, { t, drool, sc: face });
      if (ring > 0) K.hiRing(jolt + 6, -98 + 38, 50, 36, ring);
    }, '#DCEFF7');
  };
  {
    const st = cut(10), nx = Wd('next', 10) - st, wh = Wd('what', 10) - st;
    add({ id: 'S14', at: st, cam: [540, 700], zoom: 0.05, note: 'room (wider): BODY FILES badge pops on "Next" while the hero (right) waves; on "what" a lens with a yellow "?" and a yellow NEXT pill pop at left, the hero turns to look at it',
      draw(lt, d, t) {
        roomAt(1165, 0.7);
        K.filesBadge('BODY FILES', 540, 130, 60, pop(lt, nx));
        const wv = eio(seg(lt, 0.05, 0.4)) * out(lt, wh - 0.4, 0.35);
        hero({ armL: K.armPose(K.ARM.down, K.ARM.wave, wv), look: lt > wh ? -1 : 0, mouth: 'smile', brow: lt > wh ? 0.8 : 0.5 });
        teaseLens(pop(lt, wh), { q: 1 + 0.05 * Math.sin(t * 6) });
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, pop(lt, wh + 0.1));
      } });
    cue(st, 'whoosh'); cue(st + nx, 'thud', { gain: 0.6 }); cue(st + wh, 'pop', { gain: 0.6 }); cue(st + wh + 0.1, 'pop', { gain: 0.5 });
  }
  {
    const st = at('motion', 10), mo = Wd('motion', 10) - st, si = Wd('sickness', 10) - st, hi = Wd('hits', 10) - st;
    add({ id: 'S15', at: st, cam: [420, 760], zoom: 0.06, note: 'same room: in the lens the "?" swaps for a little boat rocking on waves on "motion"; on "sickness" a queasy cartoon face (pale green tinge, woozy eyes, wobbly mouth; NOT the hero) pops above it; on "hits" it jolts; hero watches, curious',
      draw(lt, d, t) {
        roomAt(1165, 0.7);
        K.filesBadge('BODY FILES', 540, 130, 60, 1);
        hero({ look: -1, mouth: 'smile', brow: lt > hi ? 1 : 0.8 });
        const j = lt > hi ? Math.sin(lt * 50) * 10 * Math.max(0, 1 - (lt - hi) * 3) : 0;
        teaseLens(1, { q: out(lt, 0, 0.12), boat: pop(lt, mo, 0.3), face: pop(lt, si, 0.3), jolt: j, t });
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, 1);
      } });
    cue(st, 'whoosh'); cue(st + mo, 'plop', { gain: 0.45 }); cue(st + si, 'pop', { gain: 0.6 }); cue(st + hi, 'boing', { gain: 0.45 });
  }
  {
    const st = cut(11), mo = Wd('mouth', 11) - st, su = Wd('suddenly', 11) - st;
    add({ id: 'S16', at: st, cam: [380, 700], zoom: 0.07, note: 'same room, camera eases toward the lens: on "mouth" a yellow ring circles the queasy face\'s mouth, on "suddenly" the face jolts; boat keeps rocking; hero watches',
      draw(lt, d, t) {
        roomAt(1165, 0.7);
        K.filesBadge('BODY FILES', 540, 130, 60, 1);
        hero({ look: -1, mouth: 'smile', brow: 0.8 });
        const j = lt > su ? Math.sin(lt * 50) * 10 * Math.max(0, 1 - (lt - su) * 3) : 0;
        teaseLens(1, { boat: 1, face: 1, ring: ringIn(lt, mo), jolt: j, t });
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, 1);
      } });
    cue(st, 'whoosh'); cue(st + mo, 'pop', { gain: 0.55 }); cue(st + su, 'boing', { gain: 0.4 });
  }
  {
    const st = at('starts', 11), wa = Wd('watering', 11) - st, cam = wa + 0.55;
    add({ id: 'S17', at: st, cam: [540, 700], zoom: 0.05, note: 'END CARD (room): BODY FILES badge, lens with the rocking boat and the queasy face; on "watering" a drop of saliva forms at the corner of its mouth and slides a little; NEXT stays; then the hero turns to camera with a warm grin and + FOLLOW pops above the lens',
      draw(lt, d, t) {
        roomAt(1165, 0.7);
        K.filesBadge('BODY FILES', 540, 130, 60, 1);
        const toCam = lt > cam;
        hero({ look: toCam ? 0 : -1, mouth: toCam ? 'grin' : 'smile', brow: toCam ? 0.5 : 0.8 });
        teaseLens(1, { boat: 1, face: 1, ring: out(lt, 0, 0.25), drool: lt > wa ? eo(seg(lt, wa, wa + 0.5)) : 0, t });
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, 1);
        K.followPill(TL[0], 440, pop(lt, cam), t, 54);
      } });
    cue(st, 'whoosh'); cue(st + wa, 'plop', { gain: 0.4 }); cue(st + cam, 'pop', { gain: 0.7 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES };
}
