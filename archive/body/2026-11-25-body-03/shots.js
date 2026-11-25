// WHAT HAPPENS WHEN YOU GET HEARTBURN?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): night bedroom, the hero propped up on a tall wobbly pillow stack, x-ray body (head normal),
// hand on his chest, the food pipe burning with yellow acid near the top, A EXTRA PILLOWS / B RAISE BED 4-8 IN pills up from frame 0.
// Rewatch details from frame 1: the headboard posts already stand on book stacks ("10-20 CM"), the bedside clock reads 11:00 PM
// next to an empty plate, a tiny "LES" tag on the valve.
// Cuts sit on caption-chunk starts (word start - 0.05) so no caption runs past a cut.
// Guess (line 1): side-view bed A (pillow stack) then A vs B panels (B bed rises onto books). Re-hook (line 5): x-ray film, hard
// push into the stomach. Answer (line 8): same panels, check on B. Tease (line 10a, from "Next"): water glass + pee colour card.
// Loop (10b "Still burning?"): back to the exact frame-1 picture.
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
  const enter = (lt) => lerp(0.86, 1, eob(seg(lt, 0, 0.25)));

  // ── the hook set: night bedroom, hero propped on a pillow stack (frame 1 + loop) ──
  const BX = 600, BY = 860, BS = 0.9, HOOK_CAM = [540, 700];
  const HERO = { x: BX, y: 690, s: 0.8 };
  const T_LAST = (Math.ceil(T.dur * 30 - 1e-6) - 1) / 30;   // time of the film's last rendered frame
  const bedside = (clockSc = 1, plateSc = 1, ringC = 0, ringP = 0) => {
    K.nightstand(120, 900, 0.85);
    K.hbClock(75, 850, 0.42, { sc: clockSc });
    K.mealPlate(172, 868, 0.2, { eaten: 1, sc: plateSc });
    K.hiRing(75, 850, 70, 50, ringC); K.hiRing(172, 866, 62, 36, ringP);
  };
  const hookBed = (t, hero) => {
    K.nightHome();
    ctx.fillStyle = '#3B4253'; ctx.fillRect(-300, BY + 297, W + 600, 800);
    bedside();
    K.hbBedBack(BX, BY, BS, { books: 1, pillows: 4, wob: 0.6, t });
    ctx.save(); ctx.beginPath(); ctx.rect(-300, -300, W + 600, BY - 40 + 300); ctx.clip(); hero(); ctx.restore();
    K.hbBedFront(BX, BY, BS);
  };
  const hookHero = (t, { flare = 0, ring = 0, face = {} } = {}) => {
    const o = { ...HERO, xray: true, arm: K.ARM.chest, eyes: 'n', mouth: 'flat', brow: 0.8, frown: true, look: 0.15, ...face };
    let p;
    hookBed(t, () => { K.man(o); p = K.hbPipeXray(o, { acid: 0.78 + 0.08 * flare, burn: 1, t }); });
    K.hiRing(p.acidTop[0], p.acidTop[1] + 20, 48, 70, ring);
    return p;
  };
  const PILL_A = [540, 150], PILL_B = [540, 262], PS = 46;
  const hookPills = (sc, o = {}) => { K.abPill('A', 'EXTRA PILLOWS', PILL_A[0], PILL_A[1], PS, { sc, ...o.a }); K.abPill('B', 'RAISE BED 4-8 IN', PILL_B[0], PILL_B[1], PS, { sc, ...o.b }); };
  const hookTags = (p, sc) => {
    K.tag('LES', 370, 600, p.valve[0] - 14, p.valve[1], 26, sc);
    K.pill('10-20 CM', 948, 1022, 22, C.ink, C.yellow, sc);
  };

  // ── 1 · HOOK "What happens when you get heartburn?" ──
  {
    const hb = Wd('heartburn', 0);
    add({ id: 'S01', at: 0, cam: HOOK_CAM, zoom: 0.05, note: 'FRAME 1 = hook: night bedroom, the hero propped up on a tall wobbly 4-pillow stack, x-ray body (head normal), hand on chest, yellow acid burning near the top of his food pipe, A EXTRA PILLOWS / B RAISE BED 4-8 IN pills, all from frame 0; rewatch: headboard posts on books "10-20 CM", clock 11:00 PM + empty plate, tiny LES tag; acid flares + yellow ring on "heartburn"',
      draw(lt, d, t) {
        const p = hookHero(t, { flare: blip(lt, hb, 0.5), ring: blip(lt, hb, 0.7), face: lt > hb && lt < hb + 0.5 ? { eyes: 'squeeze' } : {} });
        hookTags(p, 1); hookPills(1);
      } });
    cue(0.0, 'sizzle', { dur: 0.6, gain: 0.2 }); cue(hb, 'sizzle', { dur: 0.5, gain: 0.4 }); cue(hb + 0.05, 'pop', { gain: 0.4 });
  }

  // side-view bed helpers (guess / answer / pillows)
  const sideRoom = (floor) => { plain(); ctx.fillStyle = C.floor; ctx.fillRect(-300, floor, W + 600, 900); };
  const ouch = { eyes: 'n', mouth: 'flat', brow: 0.7, frown: true };
  const calm = { eyes: 'closed', mouth: 'smile', brow: 0.2 };

  // ── 2a · "Night fix: extra pillows," (pillow stack bed, side view) ──
  {
    const st = at('night', 1), ex = Wd('extra', 1) - st, pi = Wd('pillows', 1) - st;
    add({ id: 'S02', at: st, cam: [580, 760], zoom: 0.1, note: 'side view at night: the hero lying in bed on ONE pillow (on screen at the cut); a 2nd pillow pops under him on "extra", a 3rd on "pillows" (he bends up each time); pill A EXTRA PILLOWS pops on "extra"',
      draw(lt, d, t) {
        sideRoom(1060);
        K.wallClock(880, 420, 80, { hour: 11 });
        const n = 1 + (lt > ex ? 1 : 0) + (lt > pi ? 1 : 0);
        K.hbSideBed(620, 1060, 1.0, { stack: n, face: n > 1 ? ouch : calm, t });
        K.abPill('A', 'EXTRA PILLOWS', 540, 200, 52, { sc: pop(lt, ex), hi: blip(lt, ex, 0.4) });
      } });
    cue(st, 'whoosh'); cue(st + ex, 'boing', { gain: 0.45 }); cue(st + ex + 0.03, 'pop', { gain: 0.6 }); cue(st + pi, 'boing', { gain: 0.45 });
  }

  // ── the guess / answer panels (S03, S13) ──
  const PY0 = 360, PY1 = 900, GA = [290, 990], GB = [790, 990], GS = 38;
  const panel = (x0, x1, fn) => {
    ctx.save(); rr(x0, PY0, x1 - x0, PY1 - PY0, 30); ctx.clip(); fn(); ctx.restore();
    rr(x0, PY0, x1 - x0, PY1 - PY0, 30); ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.stroke();
  };
  const panels = (t, { tilt = 0.14, dimA = 0, hiB = 0, faceB = calm } = {}) => {
    plain();
    panel(50, 530, () => {
      ctx.fillStyle = C.bg; ctx.fillRect(50, PY0, 480, PY1 - PY0); ctx.fillStyle = C.floor; ctx.fillRect(50, 820, 480, 100);
      K.hbSideBed(300, 820, 0.5, { stack: 3, face: ouch, squeeze: 0.6, t });
      if (dimA > 0) { ctx.save(); ctx.globalAlpha = 0.4 * clamp(dimA); ctx.fillStyle = C.bg; ctx.fillRect(50, PY0, 480, PY1 - PY0); ctx.restore(); }
    });
    let pb;
    panel(550, 1030, () => {
      ctx.fillStyle = C.bg; ctx.fillRect(550, PY0, 480, PY1 - PY0); ctx.fillStyle = C.floor; ctx.fillRect(550, 820, 480, 100);
      pb = K.hbSideBed(790, 820, 0.5, { stack: 1, tilt, face: faceB, t });
      if (hiB > 0) { ctx.save(); ctx.globalAlpha = 0.3 * clamp(hiB); ctx.fillStyle = C.yellow; ctx.fillRect(550, PY0, 480, PY1 - PY0); ctx.restore(); }
    });
    return pb;
  };

  // ── 2b · GUESS "or raising your bed four to eight inches?" ──
  {
    const st = at('or', 1), ra = Wd('raising', 1) - st, be = Wd('bed', 1) - st, fo = Wd('four', 1) - st, ei = Wd('eight', 1) - st, inch = Wd('inches', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.07, note: 'GUESS: two panels on screen at the cut, left = bed with the 3-pillow stack (A pill already up), right = flat bed with one pillow; on "raising" the right bed\'s head end lifts onto a book stack (done by "bed"), B RAISE BED pill pops; "4-8 IN" pill on the floor right of the books on "four", bounces on "eight"',
      draw(lt, d, t) {
        const tl = 0.14 * eio(seg(lt, ra - 0.05, be + 0.1));
        const pb = panels(t, { tilt: tl });
        K.abPill('A', 'EXTRA PILLOWS', GA[0], GA[1], GS, { sc: 1 });
        K.abPill('B', 'RAISE BED', GB[0], GB[1], GS, { sc: pop(lt, ra), hi: blip(lt, ra, 0.4) });
        K.pill('4-8 IN', Math.max(640, pb.books[0] + 95), 862, 32, C.yellow, C.ink, pop(lt, fo) * (1 + 0.12 * blip(lt, ei, 0.3)));
        void inch;
      } });
    cue(st, 'whoosh'); cue(st + ra, 'pop', { gain: 0.6 }); cue(st + ra + 0.05, 'slide', { dur: be - ra + 0.1, gain: 0.3 }); cue(st + be + 0.1, 'thud', { gain: 0.45 }); cue(st + fo, 'pop', { gain: 0.5 }); cue(st + ei, 'tock', { gain: 0.35 });
  }

  // ── 3a · "Not your heart." (x-ray chest: heart gets a red X, the food pipe is the one burning) ──
  {
    const st = at('not', 2), he = Wd('heart', 2) - st;
    const o = { x: 540, y: 980, s: 1.45, xray: true, eyes: 'n', mouth: 'flat', brow: 0.5, look: 0.2 };
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.12, note: 'x-ray film, the hero\'s x-ray chest big (on screen at the cut) with a red heart beating next to his burning food pipe; on "heart" a red X slams on the heart, then a yellow ring circles the food pipe',
      draw(lt, d, t) {
        K.xray(t);
        K.man({ ...o, arm: K.ARM.down });
        const p = K.hbPipeXray(o, { acid: 0.8, burn: 1, t });
        const hx = o.x + 92 * o.s, hy = o.y - 150 * o.s;
        K.heart(hx, hy, 0.48, Math.max(0, Math.sin(t * 8)) * 0.6);
        if (lt > he) K.redX(hx, hy, lerp(0.6, 0.3, eo(seg(lt, he, he + 0.2))), 1, 0.8);
        K.hiRing(p.acidTop[0], p.acidTop[1] + 30, 60, 110, pop(lt, he + 0.3, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'tock', { gain: 0.3 }); cue(st + he, 'slam', { gain: 0.6 }); cue(st + he + 0.3, 'pop', { gain: 0.45 });
  }

  // ── 3b · "A muscle valve above your stomach relaxes," (junction close-up) ──
  {
    const st = at('a', 2), mu = Wd('muscle', 2) - st, va = Wd('valve', 2) - st, so = Wd('stomach', 2) - st, re = Wd('relaxes', 2) - st;
    const X = 430, Y = 640, SC = 0.85;
    add({ id: 'S05', at: st, cam: [480, 720], zoom: 0.1, note: 'x-ray film, big pink schematic: food pipe coming down into the stomach sack (yellow acid pool inside), muscle valve ring squeezed shut at the join (all on screen at the cut); valve ring flashes yellow on "muscle", VALVE tag on "valve", STOMACH tag + ring on "stomach"; on "relaxes" the valve ring loosens and the opening widens',
      draw(lt, d, t) {
        K.xray(t);
        const op = eio(seg(lt, re, re + 0.5));
        const p = K.hbJunction(X, Y, SC, { open: op, acid: 0.45, t });
        K.hiRing(p.valve[0], p.valve[1], 150, 70, blip(lt, mu, 0.6) + pop(lt, re, 0.2) * out(lt, re + 0.6));
        K.tag('VALVE', 820, 420, p.valve[0] + 110, p.valve[1] - 10, 44, pop(lt, va));
        K.tag('STOMACH', 300, 1110, p.stomach[0] - 40, p.stomach[1] + 60, 44, pop(lt, so));
      } });
    cue(st, 'whoosh'); cue(st + mu, 'pop', { gain: 0.4 }); cue(st + va, 'pop', { gain: 0.55 }); cue(st + so, 'pop', { gain: 0.5 }); cue(st + re, 'slide', { dur: 0.5, gain: 0.35 });
  }

  // ── 4 · "and acid sneaks up your food pipe." ──
  {
    const st = at('and', 3), ac = Wd('acid', 3) - st, sn = Wd('sneaks', 3) - st, fo = Wd('food', 3) - st, pi = Wd('pipe', 3) - st;
    const X = 400, Y = 820, SC = 0.72;
    add({ id: 'S06', at: st, cam: [480, 640], zoom: 0.14, note: 'same schematic, wider: valve open, acid pool in the stomach (on screen at the cut); the pool sloshes up on "acid"; from "sneaks" a yellow acid tongue creeps up the food pipe leaving red sore patches; FOOD PIPE tag on "food"',
      draw(lt, d, t) {
        K.xray(t);
        const cl = eio(seg(lt, sn, pi + 0.4)) * 0.85;
        const p = K.hbJunction(X, Y, SC, { open: 1, acid: 0.5 + 0.12 * blip(lt, ac, 0.6), climb: cl, burn: seg(lt, sn + 0.3, pi + 0.3), t });
        K.tag('FOOD PIPE', 800, 330, p.pipe[0] + 70, p.pipe[1] - 120, 44, pop(lt, fo));
        K.hiRing(p.climbTop[0], p.climbTop[1] + 20, 80, 80, blip(lt, pi, 0.5));
      } });
    cue(st, 'whoosh'); cue(st + ac, 'plop', { gain: 0.4 }); cue(st + sn, 'slide', { dur: pi - sn + 0.4, gain: 0.3 }); cue(st + sn + 0.3, 'sizzle', { dur: 1.0, gain: 0.3 }); cue(st + fo, 'pop', { gain: 0.5 });
  }

  // ── 5 · RELATABLE "Ever get a sour taste after a late dinner?" (real world, the bedroom) ──
  {
    const st = at('ever', 4), so = Wd('sour', 4) - st, ta = Wd('taste', 4) - st, la = Wd('late', 4) - st, di = Wd('dinner', 4) - st;
    add({ id: 'S07', at: st, cam: [0, 700], zoom: 0.05, note: 'the bedroom for real (no x-ray): hero sitting up in bed on his pillow stack, hand at his throat, bedside clock + empty plate on the nightstand (on screen at the cut); sour pucker face (squeezed eyes, wavy mouth, green tinge) on "sour" to "taste"; clock 11:00 PM gets a yellow ring + bounce on "late", the empty plate on "dinner"',
      draw(lt, d, t) {
        const sour = seg(lt, so - 0.05, so + 0.2);
        hookBed(t, () => K.man({ ...HERO, arm: K.ARM.throat, eyes: sour > 0.5 ? 'squeeze' : 'n', mouth: sour > 0.5 ? 'wavy' : 'flat', green: 0.6 * sour, brow: 0.8, frown: true, look: -0.3 }));
        ctx.save(); ctx.translate(0, 0);
        K.hiRing(75, 850, 64, 46, pop(lt, la, 0.25) * out(lt, di - 0.12, 0.12)); K.hiRing(185, 866, 52, 34, pop(lt, di, 0.25));
        ctx.restore();
        if (lt > ta) bigText('SOUR!', HERO.x + 150, 380, 70 * pop(lt, ta, 0.25), C.yellow, 0.12);
      } });
    cue(st, 'whoosh'); cue(st + so, 'boing', { gain: 0.35 }); cue(st + ta, 'pop', { gain: 0.45 }); cue(st + la, 'tock', { gain: 0.5 }); cue(st + di, 'pop', { gain: 0.5 });
  }

  // ── 6a · RE-HOOK "But here's the twist:" (new scene: x-ray film, hard push into the stomach) ──
  {
    const st = at('but', 5), he = Wd("here's", 5) - st, tw = Wd('twist', 5) - st;
    const o = { x: 540, y: 820, s: 1.05, xray: true, look: 0.4 };
    add({ id: 'S08', at: st, cam: [560, 840], zoom: 0.45, note: 'RE-HOOK, new scene: x-ray film, the whole x-ray hero (head normal) on screen at the cut, the camera pushing hard into his stomach; brows up on "here\'s"; shock lines + yellow ring on the stomach and eyes wide on "twist"',
      draw(lt, d, t) {
        K.xray(t);
        const sur = lt > tw;
        K.man({ ...o, eyes: sur ? 'wide' : 'n', mouth: sur ? 'o' : 'smile', brow: lt > he ? 1 : 0.3 });
        K.hbPipeXray(o, { acid: 0.3, burn: 0, t });
        K.shockLines(o.x, o.y - 360 * o.s, 170, blip(lt, tw, 0.7));
        K.hiRing(o.x + 20 * o.s, o.y + 20 * o.s, 120, 110, pop(lt, tw, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + he, 'tock', { gain: 0.3 }); cue(st + tw, 'slam', { gain: 0.55 }); cue(st + 0.1, 'slide', { dur: 1.1, gain: 0.25 });
  }

  // ── 6b · "your stomach has a mucus shield." (stomach wall lens) ──
  {
    const st = at('your', 5), so = Wd('stomach', 5) - st, mu = Wd('mucus', 5) - st, sh = Wd('shield', 5) - st;
    add({ id: 'S09', at: st, cam: [540, 680], zoom: 0.1, note: 'macro lens on the stomach wall (pink wall + falling yellow acid drops, on screen at the cut) + STOMACH WALL pill; a pale-green mucus layer grows over the wall on "mucus" (drops now land on it harmlessly); green shield badge pops on "shield"',
      draw(lt, d, t) {
        plain();
        const m = eo(seg(lt, mu - 0.1, mu + 0.35));
        K.hbWallLens(540, 680, 380, { shield: 0.25 + 0.75 * m, t, sc: enter(lt) });
        K.pill('STOMACH WALL', 540, 210, 46, C.ink, C.white, enter(lt) * (1 + 0.1 * blip(lt, so, 0.3)));
        K.shieldBadge(880, 960, 0.6, pop(lt, sh));
      } });
    cue(st, 'whoosh'); cue(st + so, 'pop', { gain: 0.4 }); cue(st + mu, 'bubbles', { dur: 0.5, gain: 0.3 }); cue(st + sh, 'pop', { gain: 0.7 });
  }

  // ── 7 · "Your food pipe doesn't, so it burns." (food pipe wall lens) ──
  {
    const st = at('your', 6), fo = Wd('food', 6) - st, dn = Wd("doesn't", 6) - st, bu = Wd('burns', 6) - st;
    add({ id: 'S10', at: st, cam: [540, 680], zoom: 0.1, note: 'macro lens on the bare food pipe wall (no mucus layer), acid drops falling (on screen at the cut) + FOOD PIPE WALL pill; on "doesn\'t" a grey ghost shield badge gets a red X; on "burns" red sore spots spread, sizzle wisps, red pain zap',
      draw(lt, d, t) {
        plain();
        K.hbWallLens(540, 680, 380, { shield: 0, burn: eo(seg(lt, bu - 0.05, bu + 0.3)) + 0.15 * seg(lt, 0, bu), t, sc: enter(lt) });
        K.pill('FOOD PIPE WALL', 540, 210, 46, C.ink, C.white, enter(lt) * (1 + 0.1 * blip(lt, fo, 0.3)));
        if (lt > dn) { ctx.save(); ctx.globalAlpha = 0.45; K.shieldBadge(880, 960, 0.6, pop(lt, dn, 0.2)); ctx.restore(); K.redX(880, 960, lerp(0.6, 0.32, eo(seg(lt, dn, dn + 0.2))), 1, 0.8); }
        K.painZap(300, 760, 0.9, pop(lt, bu, 0.25), t);
      } });
    cue(st, 'whoosh'); cue(st + fo, 'pop', { gain: 0.35 }); cue(st + dn, 'slam', { gain: 0.5 }); cue(st + bu, 'sizzle', { dur: 0.7, gain: 0.5 });
  }

  // ── 8a · SAFETY "Chest pain spreading to your arm or jaw?" (calm) ──
  {
    const st = at('chest', 7), pa = Wd('pain', 7) - st, sp = Wd('spreading', 7) - st, ar = Wd('arm', 7) - st, ja = Wd('jaw', 7) - st;
    const o = { x: 540, y: 760, s: 0.95 };
    const CH = [o.x - 30 * o.s, o.y - 90 * o.s], ARMP = [o.x - 172 * o.s, o.y + 20 * o.s], JAW = [o.x + 50 * o.s, o.y - 255 * o.s];
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.08, note: 'calm safety card: plain room, the hero standing, calm face (on screen at the cut) with a soft red dot on his chest from "pain"; dotted red lines spread from the chest on "spreading"; yellow ring on his left arm on "arm", on his jaw on "jaw". No scare imagery',
      draw(lt, d, t) {
        plain();
        K.man({ ...o, eyes: 'n', mouth: 'flat', brow: 0.5, look: 0 });
        const a = pop(lt, pa, 0.25);
        if (a > 0) { ctx.save(); ctx.globalAlpha = clamp(a); ctx.beginPath(); ctx.arc(CH[0], CH[1], 34 + 6 * Math.sin(t * 6), 0, TAU); ctx.fillStyle = C.red; ctx.fill(); ctx.restore(); }
        const spr = eio(seg(lt, sp, ja + 0.2));
        if (spr > 0) {
          ctx.save(); ctx.setLineDash([18, 16]);
          for (const tgt of [ARMP, JAW]) line([CH, [lerp(CH[0], tgt[0], spr), lerp(CH[1], tgt[1], spr)]], C.red, 10);
          ctx.restore();
        }
        K.hiRing(ARMP[0], ARMP[1], 70, 90, pop(lt, ar, 0.25));
        K.hiRing(JAW[0], JAW[1], 90, 55, pop(lt, ja, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + pa, 'pop', { gain: 0.4 }); cue(st + sp, 'slide', { dur: 0.8, gain: 0.25 }); cue(st + ar, 'pop', { gain: 0.45 }); cue(st + ja, 'pop', { gain: 0.45 });
  }

  // ── 8b · "Call emergency services." ──
  {
    const st = at('call', 7), em = Wd('emergency', 7) - st, se = Wd('services', 7) - st;
    add({ id: 'S12', at: st, cam: [540, 680], zoom: 0.08, note: 'calm: a big phone with a red medical cross on its screen and the green call button (on screen at the cut), gentle ring lines on "Call"; yellow ring on the call button on "services"',
      draw(lt, d, t) {
        plain();
        const sc = enter(lt), ring = clamp(seg(lt, 0.05, 0.25)) * 0.6;
        ctx.save(); ctx.translate(540, 680); ctx.scale(sc, sc); ctx.translate(-540, -680);
        K.phone(540, 680, 1.2, '', ring, t);
        rr(540 - 26, 680 - 1.2 * 80 - 80, 52, 160, 10); ctx.fillStyle = C.red; ctx.fill(); rr(540 - 80, 680 - 1.2 * 80 - 26, 160, 52, 10); ctx.fill();
        ctx.restore();
        K.hiRing(540, 680 + 110 * 1.2, 100, 100, pop(lt, se, 0.25));
        void em;
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.35 }); cue(st + se, 'pop', { gain: 0.45 });
  }

  // ── 9 · ANSWER "Answer: raise the bed." ──
  {
    const st = at('answer', 8), an = Wd('answer', 8) - st, ra = Wd('raise', 8) - st, be = Wd('bed', 8) - st;
    add({ id: 'S13', at: st, cam: [540, 700], zoom: 0.07, note: 'ANSWER: the guess panels + A / B pills in the same spots (on screen at the cut); on "raise" the check lands on B RAISE BED, A dims, the raised-bed panel glows yellow; "4-8 IN" pill stays by the books; COMMENT A OR B pill from "raise" (+0.02 s) to the cut (not voiced)',
      draw(lt, d, t) {
        const pb = panels(t, { dimA: seg(lt, ra, ra + 0.3), hiB: blip(lt, ra, 0.6) });
        K.pill('4-8 IN', Math.max(640, pb.books[0] + 95), 862, 32, C.yellow, C.ink, 1);
        K.abPill('A', 'EXTRA PILLOWS', GA[0], GA[1], GS, { sc: 1, dim: seg(lt, ra, ra + 0.3) });
        K.abPill('B', 'RAISE BED', GB[0], GB[1], GS, { sc: 1, check: pop(lt, ra, 0.3), hi: blip(lt, ra, 0.45) });
        K.pill('COMMENT A OR B', 540, 240, 40, C.ink, C.yellow, pop(lt, ra + 0.02, 0.15));
        void an; void be;
      } });
    cue(st, 'whoosh'); cue(st + ra, 'pop', { gain: 0.8 }); cue(st + ra + 0.05, 'sparkle', { dur: 0.5, gain: 0.3 }); cue(st + ra + 0.02, 'pop', { gain: 0.3 });
  }

  // ── 10 · "Extra pillows can squeeze your belly and make it worse." ──
  {
    const st = at('extra', 9), sq = Wd('squeeze', 9) - st, bl = Wd('belly', 9) - st, ma = Wd('make', 9) - st, wo = Wd('worse', 9) - st;
    const LX = 770, LY = 390, LR = 200;
    add({ id: 'S14', at: st, cam: [480, 760], zoom: 0.1, note: 'side view: the hero folded up on the 3-pillow stack (on screen at the cut) + x-ray lens top right showing his stomach and valve; on "squeeze" he bends more, red arrows press in on his belly + creases; yellow ring on the belly on "belly"; in the lens the squeezed stomach pushes acid up through the valve from "make" to "worse", he winces and red sore patches show in the pipe on "worse"',
      draw(lt, d, t) {
        sideRoom(1080);
        const s = eio(seg(lt, sq - 0.05, sq + 0.3));
        const p = K.hbSideBed(500, 1080, 1.0, { stack: 3, bend: 0.12 * s, squeeze: s, face: lt > wo ? { eyes: 'squeeze', mouth: 'flat', brow: 0.9, frown: true } : ouch, t });
        for (const [dx, dy, an] of [[-150, -60, 0.35], [-40, -170, 1.2]]) K.flowArrow(p.belly[0] + dx * 0.9, p.belly[1] + dy * 0.6, 110, an, s * (0.7 + 0.3 * Math.sin(t * 10)), C.red, 18);
        K.hiRing(p.belly[0], p.belly[1] + 20, 120, 90, pop(lt, bl, 0.25) * out(lt, bl + 0.8));
        K.lens(LX, LY, LR, enter(lt), () => {
          ctx.fillStyle = C.navy; ctx.fillRect(-LR - 10, -LR - 10, 2 * LR + 20, 2 * LR + 20);
          ctx.save(); ctx.scale(1 - 0.1 * s, 1 + 0.04 * s);
          K.hbJunction(-60, -20, 0.42, { open: 0.6 + 0.4 * s, acid: 0.4 + 0.25 * s, climb: 0.6 * eio(seg(lt, ma - 0.1, wo + 0.3)), burn: seg(lt, wo, wo + 0.3), t, len: 600 });
          ctx.restore();
          K.flowArrow(LR - 70, 110, 90, Math.PI, s, C.red, 16);
        }, C.navy);
      } });
    cue(st, 'whoosh'); cue(st + sq, 'boing', { gain: 0.4 }); cue(st + sq + 0.05, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + bl, 'pop', { gain: 0.5 }); cue(st + ma, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + wo, 'sizzle', { dur: 0.5, gain: 0.45 });
  }

  // ── 11a · TEASE "Next Body File: too little water, and dark pee." (starts on "Next") ──
  const badge = (x, y, sc, size = 44) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = at('next', 10), bo = Wd('body', 10) - st, li = Wd('little', 10) - st, wa = Wd('water', 10) - st, da = Wd('dark', 10) - st, pe = Wd('pee', 10) - st;
    add({ id: 'S15', at: st, cam: [540, 640], zoom: 0.08, note: 'tease (cut on "Next"): a big glass of water + yellow NEXT pill on screen at the cut; BODY FILES badge on "Body"; the water drains to a low puddle from "little" to "water"; pee colour card (pale to dark yellow) pops on "dark", red pointer + ring on the darkest swatch on "pee"',
      draw(lt, d, t) {
        plain();
        const f = lerp(0.8, 0.12, eio(seg(lt, li - 0.05, wa + 0.3)));
        K.outlinedGlass(540, 620, 1.5 * enter(lt), f, t);
        K.pill('NEXT', 540, 170, 64, C.yellow, C.ink, pop(lt, 0.03, 0.25));
        badge(540, 290, pop(lt, bo));
        K.hbPeeCard(540, 1000, 1, { pick: pop(lt, pe, 0.25), sc: pop(lt, da, 0.3) });
      } });
    cue(st, 'whoosh'); cue(st + 0.03, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.4 }); cue(st + li, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + da, 'pop', { gain: 0.5 }); cue(st + pe, 'pop', { gain: 0.6 });
  }

  // ── 11b · LOOP "Still burning?" (back to the exact frame-1 picture) ──
  {
    const st = at('still', 10), bu = Wd('burning', 10) - st, Z = 0;
    add({ id: 'S16', at: st, cam: HOOK_CAM, zoom: Z, note: 'LOOP + END CARD: the frame-1 bedroom, x-ray hero on the pillow stack, hand on chest, acid in the food pipe (on screen at the cut, scene clock lands on frame 1 at the last frame); acid flares + yellow ring on "burning"; A / B pills + LES / 10-20 CM tags pop back after "burning" so the last frame = frame 1 (same camera, no push); end card from ~0.7 s: water glass mini + NEXT top right, BODY FILES + FOLLOW top left',
      draw(lt, d, t) {
        const tl = t - T_LAST;                                  // scene clock: the last frame draws exactly like frame 0
        const p = hookHero(tl, { flare: blip(lt, bu, 0.5), ring: blip(lt, bu, 0.7), face: lt > bu && lt < bu + 0.5 ? { eyes: 'squeeze' } : {} });
        const back = pop(lt, bu + 0.35, 0.3);
        hookTags(p, back); hookPills(back);
        const k = (1 + 0.13 * (1 - eo(clamp(lt / 0.32)))) * (1 + Z * eio(clamp(lt / d)));
        ctx.save(); ctx.translate(HOOK_CAM[0], HOOK_CAM[1]); ctx.scale(1 / k, 1 / k); ctx.translate(-HOOK_CAM[0], -HOOK_CAM[1]);
        badge(200, 400, pop(lt, 0.7, 0.3), 30);
        K.followPill(200, 480, pop(lt, 0.9), t, 34);
        K.outlinedGlass(910, 410, 0.42 * pop(lt, 0.7, 0.3), 0.15, t);
        K.pill('NEXT', 910, 500, 30, C.yellow, C.ink, pop(lt, 0.75, 0.3));
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + 0.7, 'pop', { gain: 0.4 }); cue(st + 0.9, 'pop', { gain: 0.5 }); cue(st + bu, 'sizzle', { dur: 0.5, gain: 0.4 }); cue(st + bu + 0.35, 'pop', { gain: 0.35 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES, loop: true };
}
