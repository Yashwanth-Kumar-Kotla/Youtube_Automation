// WHAT HAPPENS WHEN YOU GET A NOSEBLEED?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Tone: calm first aid, never gory: blood is only ever ONE small clean red drop. Real world = THE room (K.home, framed wider
// via roomAt) with the hero at right and a lens at left. Inside views: K.noseSideLens (side cutaway, vessels in the lining,
// front patch), K.liningLens (cross-section: surface over vessels, dries + cracks). First aid: K.sideSitter (side view on a
// chair: sit up, lean forward, pinch), pinch close-up (cartoonNose + pinchHand), countdown "10–15 MIN".
// Tease (fever): lens with a thermometer + K.blanketBuddy shivering + NEXT; the hero only watches.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, bigText } from './core/lib.js';
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
  const LENS = [310, 730, 220], LBG = '#FFF1E0';
  const noseLens = (sc, inner) => K.lens(LENS[0], LENS[1], LENS[2], sc, inner, LBG);
  const qMark = (a, t) => { if (a > 0) bigText('?', 0, 0, 230, C.white, -0.08, a * (1 + 0.05 * Math.sin(t * 6))); };
  const tissueAt = (x, y) => K.tissue(x + 30, y + 10, 0.42, 0.2);
  const NOSE_HOLD = { e: [215, -90], h: [44, -262] };   // tissue held just under his nose

  // ── 1 · HOOK: hero holds a tissue to his nose; the lens shows his nose with one small red drop ──
  {
    const nb = Wd('nosebleed', 0);
    add({ id: 'S01', at: 0, cam: [540, 760], zoom: 0.08, note: 'room: hero (right) lifts a tissue to his nose, brows up; lens (left) shows a cartoon nose, one small clean red drop grows under a nostril by 0.5 s; yellow ring round the drop on "nosebleed"',
      draw(lt, d, t) {
        roomAt();
        const up = eio(seg(lt, 0, 0.35)), sur = lt > nb;
        hero({ arm: K.armPose(K.ARM.down, NOSE_HOLD, up), holding: up > 0.8 ? tissueAt : null, look: -1, eyes: sur ? 'wide' : 'n', mouth: sur ? 'o' : 'flat', brow: sur ? 1 : 0.6 });
        noseLens(pop(lt, 0.02), () => {
          K.cartoonNose(0, -30, 1.15, { bleed: eo(seg(lt, 0.12, 0.5)), t });
          K.hiRing(-46, 112, 52, 62, ringIn(lt, nb) * out(lt, d - 0.25, 0.2));
        });
      } });
    cue(0.1, 'whoosh', { gain: 0.5 }); cue(0.05, 'pop', { gain: 0.4 }); cue(0.3, 'plop', { gain: 0.4 }); cue(nb, 'pop', { gain: 0.5 });
  }

  // ── 2a · It looks scary, but the top cause? ──
  {
    const st = cut(1), sc = Wd('scary', 1) - st, ca = Wd('cause', 1) - st;
    add({ id: 'S02', at: st, cam: [600, 760], zoom: 0.07, note: 'room: on "scary" the hero jolts wide-eyed with shock lines (lens: the nose + drop); on "cause" the nose in the lens swaps for a big "?" and he puts a hand to his chin, curious',
      draw(lt, d, t) {
        roomAt();
        const sh = lt > sc && lt < ca ? Math.sin(t * 60) * 5 * Math.max(0, 1 - (lt - sc) * 2.5) : 0, curious = lt > ca;
        hero({ x: HERO.x + sh, arm: curious ? K.armPose(NOSE_HOLD, K.ARM.chin, eio(seg(lt, ca, ca + 0.3))) : NOSE_HOLD, holding: curious ? null : tissueAt,
          look: -1, eyes: lt > sc && !curious ? 'wide' : 'n', mouth: curious ? 'flat' : lt > sc ? 'o' : 'flat', brow: curious ? 0.8 : lt > sc ? 1 : 0.6, smirk: curious });
        K.shockLines(HERO.x, HERO.y - 400 * HERO.s, 120, lt > sc ? eo(seg(lt, sc, sc + 0.15)) * out(lt, ca - 0.2, 0.2) : 0);
        noseLens(1, () => {
          const sw = lt > ca ? eio(seg(lt, ca, ca + 0.2)) : 0;
          if (sw < 1) K.cartoonNose(0, -30, 1.15, { bleed: 1, t, sc: 1 - sw });
          qMark(pop(lt, ca + 0.1), t);
        });
      } });
    cue(st, 'whoosh'); cue(st + sc, 'boing', { gain: 0.45 }); cue(st + ca, 'pop', { gain: 0.55 });
  }
  // ── 2b · Plain old dry air. ──
  {
    const st = at('plain', 1), dr = Wd('dry', 1) - st, ai = Wd('air', 1) - st;
    add({ id: 'S03', at: st, cam: [420, 760], zoom: 0.08, note: 'room: the "?" in the lens swaps for a little heater on "dry"; warm wavy air lines rise from it on "air"; hero surprised (brows up, "o") on "dry", then a small smile',
      draw(lt, d, t) {
        roomAt();
        const sur = lt > dr;
        hero({ arm: K.ARM.chin, look: -1, eyes: sur && lt < ai + 0.35 ? 'wide' : 'n', mouth: sur ? (lt > ai + 0.35 ? 'smile' : 'o') : 'flat', brow: sur ? 1 : 0.7, smirk: !sur });
        noseLens(1, () => {
          qMark(lt < dr ? 1 : out(lt, dr, 0.12), t);
          K.heater(0, 70, 1.2, { heat: lt > ai ? eo(seg(lt, ai, ai + 0.25)) : 0, t, sc: pop(lt, dr), edge: true });
        });
      } });
    cue(st, 'whoosh'); cue(st + dr, 'pop', { gain: 0.6 }); cue(st + ai, 'sizzle', { dur: 0.7, gain: 0.25 });
  }

  // ── 3a · Your nose is packed with tiny blood vessels ──
  const NL = [540, 720, 400];
  {
    const st = cut(2), pa = Wd('packed', 2) - st, ve = Wd('vessels', 2) - st;
    add({ id: 'S04', at: st, cam: [600, 720], zoom: 0.08, note: 'big side-view lens of the nose cut open (pink cavity); fine red blood vessels draw in along the lining from "packed" to "vessels"',
      draw(lt, d, t) {
        plain();
        K.noseSideLens(NL[0], NL[1], NL[2], { vessels: eio(seg(lt, pa, ve + 0.3)), sc: pop(lt, 0.02, 0.35), t });
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + pa, 'sparkle', { dur: ve - pa + 0.3, gain: 0.35 });
  }
  // ── 3b · near the surface ──
  const LL = [540, 750, 370];
  const surfPt = (xu) => [LL[0] + xu * LL[2] / 300, LL[1] + (K.NB_SURF(xu) - 16) * LL[2] / 300];
  {
    const st = at('near', 2), su = Wd('surface', 2) - st;
    const [sx, sy] = surfPt(-60);
    add({ id: 'S05', at: st, cam: [540, 720], zoom: 0.08, note: 'cross-section lens of the lining: moist surface on top, red vessels just under it (cells drifting); on "surface" a SURFACE tag points down onto the surface line',
      draw(lt, d, t) {
        plain();
        K.liningLens(LL[0], LL[1], LL[2], { t });
        K.tag('SURFACE', 540, 250, sx, sy, 56, pop(lt, su));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.8, gain: 0.2 }); cue(st + su, 'pop', { gain: 0.6 });
  }

  // ── 4a · and dry, heated rooms ──
  {
    const st = cut(3), ro = Wd('rooms', 3) - st;
    add({ id: 'S06', at: st, cam: [480, 820], zoom: 0.08, note: 'room: a heater on the floor at left pumps warm wavy air up; the hero (right) rubs his nose, frowning a little; the warm air gets stronger on "rooms"',
      draw(lt, d, t) {
        roomAt();
        const h = lerp(0.6, 1, eo(seg(lt, ro, ro + 0.3))) * eo(seg(lt, 0, 0.2));
        K.heater(300, 990, 1.3, { heat: h, t, edge: true });
        hero({ arm: K.armPose(K.ARM.down, K.ARM.nose, eio(seg(lt, 0.1, 0.45))), look: -1, mouth: 'flat', frown: true, brow: 0.2 });
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'sizzle', { dur: 1.2, gain: 0.25 });
  }
  // ── 4b · leave that surface crusty and cracked ──
  {
    const st = at('crusty', 3), cr = Wd('crusty', 3) - st + 0.08, ck = Wd('cracked', 3) - st;
    add({ id: 'S07', at: st, cam: [540, 720], zoom: 0.1, note: 'same cross-section lens: the moist surface dries to a tan crust with flakes from "crusty"; three little cracks open on "cracked"',
      draw(lt, d, t) {
        plain();
        K.liningLens(LL[0], LL[1], LL[2], { t, dry: eio(seg(lt, cr - 0.05, cr + 0.4)), crack: eo(seg(lt, ck, ck + 0.3)) });
      } });
    cue(st, 'whoosh'); cue(st + cr, 'sizzle', { dur: 0.5, gain: 0.3 }); cue(st + ck, 'thud', { gain: 0.45 });
  }

  // ── 5 · so one pick, rub or hard blow, and it bleeds ──
  {
    const st = at('pick', 4), pk = Wd('pick', 4) - st, ru = Wd('rub', 4) - st, bl = Wd('blow', 4) - st, bd = Wd('bleeds', 4) - st;
    const IX = [200, 540, 880], IY = 420;
    const scene = (lt, t) => {
        plain();
        const acts = [pk, ru, bl];
        acts.forEach((a, i) => K.causeIcon(['pick', 'rub', 'blow'][i], IX[i], IY, 1.0, { act: lt > a ? eo(seg(lt, a, a + 0.3)) : 0, sc: pop(lt, a), t }));
        const tw = acts.reduce((m, a) => m + (lt > a ? Math.max(0, 1 - (lt - a) * 4) : 0), 0);
        K.cartoonNose(540 + Math.sin(t * 50) * 6 * tw, 950, 1.4, { bleed: eo(seg(lt, bd, bd + 0.35)), t });
    };
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.03, note: 'three icons pop in a row on their words: finger pick, rub, tissue blow; the big nose below twitches at each',
      draw(lt, d, t) { scene(lt, t); } });
    const s2 = at('and', 4) - st;
    add({ id: 'S08b', at: st + s2, cam: [540, 900], zoom: 0.05, note: 'same layout, camera pushes toward the nose: on "bleeds" one small clean red drop forms under a nostril',
      draw(lt, d, t) { scene(lt + s2, t); } });
    cue(st, 'whoosh'); cue(st + pk, 'pop', { gain: 0.55 }); cue(st + ru, 'pop', { gain: 0.55 }); cue(st + bl, 'pop', { gain: 0.55 }); cue(st + bl + 0.1, 'whoosh', { gain: 0.25 }); cue(st + bd, 'plop', { gain: 0.5 });
  }

  // ── 6 · Most start up front and usually aren't serious ──
  {
    const st = cut(5), fr = Wd('front', 5) - st, se = Wd('serious', 5) - st;
    const [fx, fy] = K.NOSE_FRONT.map((v) => v * LENS[2] / 300);
    add({ id: 'S09', at: st, cam: [440, 760], zoom: 0.07, note: 'room: lens (left) with the side cutaway of the nose; yellow ring round the front patch on "front"; on "serious" a green check pops above the lens and the calm hero smiles and nods',
      draw(lt, d, t) {
        roomAt();
        const nod = lt > se && lt < se + 0.5 ? Math.sin((lt - se) / 0.5 * Math.PI * 2) * 8 : 0;
        hero({ y: HERO.y + Math.max(0, nod), look: -1, mouth: lt > se ? 'grin' : 'smile', brow: 0.4 });
        K.noseSideLens(LENS[0], LENS[1], LENS[2], { vessels: 1, front: ringIn(lt, fr), t });
        K.checkMark(LENS[0], 400, 1.1, pop(lt, se));
      } });
    cue(st, 'whoosh'); cue(st + fr, 'pop', { gain: 0.6 }); cue(st + se, 'pop', { gain: 0.7 }); cue(st + se + 0.05, 'sparkle', { dur: 0.5, gain: 0.35 });
  }

  // ── 7 · To stop one, sit up and lean slightly forward ──
  const SIT = { x: 420, s: 0.85 }, sitY = (s) => 1120 - 330 * s;
  {
    const st = cut(6), si = Wd('sit', 6) - st, le = Wd('lean', 6) - st, fw = Wd('forward', 6) - st;
    add({ id: 'S10', at: st, cam: [520, 760], zoom: 0.07, note: 'room, side view: hero sits on a chair slumped slightly forward (head level, never tipped back); on "sit up" he straightens; from "lean" he leans slightly forward (head forward, NOT tipped back); white arrow points forward and a green check pops on "forward"',
      draw(lt, d, t) {
        roomAt();
        const lean = lt < le ? lerp(0.1, 0, eio(seg(lt, si, si + 0.3))) : lerp(0, 0.3, eio(seg(lt, le, fw + 0.15)));   // never tipped back
        K.sideSitter(SIT.x, sitY(SIT.s), SIT.s, { lean, eyes: 'n', mouth: lt > fw ? 'smile' : 'flat', brow: 0.3, t });
        K.flowArrow(840, 640, 220, 0, eo(seg(lt, fw, fw + 0.25)), C.white, 34, C.ink);
        K.checkMark(840, 820, 1.1, pop(lt, fw + 0.15));
      } });
    cue(st, 'whoosh'); cue(st + si, 'slide', { dur: 0.3, gain: 0.35 }); cue(st + le, 'slide', { dur: fw - le + 0.15, gain: 0.35 }); cue(st + fw, 'whoosh', { gain: 0.35 }); cue(st + fw + 0.15, 'pop', { gain: 0.6 });
  }

  // ── 8a · then pinch the soft part above your nostrils ──
  {
    const st = cut(7), pi = Wd('pinch', 7) - st, so = Wd('soft', 7) - st, no = Wd('nostrils', 7) - st;
    const PL = [540, 760, 330], NS = 1.7;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.08, note: 'close-up lens: front nose; only a thumb + index slide in from the lower corners on "pinch" and rest on the soft wings just above the nostrils; yellow ring round the soft part on "soft"; on "nostrils" they press the wings in (nostrils narrow); under the nostrils stays clear',
      draw(lt, d, t) {
        plain();
        K.lens(PL[0], PL[1], PL[2], 1, () => {
          const press = eio(seg(lt, no - 0.05, no + 0.25));
          K.cartoonNose(0, 0, NS, { squeeze: press });
          const ring = ringIn(lt, so) * out(lt, no - 0.15, 0.15);
          K.hiRing(0, 22 * NS, 142 * NS, 62 * NS, ring);
          const land = eio(seg(lt, pi - 0.25, pi + 0.2)), gap = lerp(lerp(760, 400, land), 230, press);
          if (lt > pi - 0.25) K.pinchFingers(0, 22 * NS + (1 - land) * 160, 1, { gap });
        }, LBG);
      } });
    cue(st, 'whoosh'); cue(st + pi - 0.25, 'slide', { dur: 0.4, gain: 0.4 }); cue(st + so, 'pop', { gain: 0.6 }); cue(st + no, 'thud', { gain: 0.45 });
  }
  // ── 8b · for ten to fifteen minutes ──
  const TM = [270, 610, 0.56];
  const timer = (frac, txt, unit, sc) => K.countdown(TM[0], TM[1], TM[2], frac, txt, sc, unit, 86);
  const SIT2 = { x: 600, s: 0.82 };
  {
    const st = at('for', 7), te = Wd('ten', 7) - st, fi = Wd('fifteen', 7) - st, mi = Wd('minutes', 7) - st;
    add({ id: 'S12', at: st, cam: [480, 700], zoom: 0.07, note: 'room, side view: hero sits leaning forward, pinching his nose; timer (left) pops with "10" on "ten", becomes "10–15" on "fifteen", MIN on "minutes", then its red wedge runs down (time passing)',
      draw(lt, d, t) {
        roomAt();
        K.sideSitter(SIT2.x, sitY(SIT2.s), SIT2.s, { lean: 0.3, pinch: 1, eyes: 'n', mouth: 'flat', brow: 0.2, t });
        const txt = lt > fi ? '10–15' : '10';
        timer(lt > mi ? 1 - 0.85 * eio(seg(lt, mi + 0.1, d)) : 1, txt, lt > mi ? 'MIN' : '', pop(lt, te));
      } });
    cue(st, 'whoosh'); cue(st + te, 'pop', { gain: 0.6 }); cue(st + fi, 'pop', { gain: 0.5 }); cue(st + mi + 0.1, 'tock', { gain: 0.5 }); cue(st + mi + 0.6, 'tock', { gain: 0.45 }); cue(st + mi + 1.1, 'tock', { gain: 0.4 });
  }

  // ── 9a · Still bleeding after that? ──
  {
    const st = cut(8), bl = Wd('bleeding', 8) - st, th = Wd('that', 8) - st;
    add({ id: 'S13', at: st, cam: [540, 700], zoom: 0.07, note: 'same room: timer has run out (empty, 10–15 MIN); on "bleeding" a small lens under the timer shows his nose with one small clean red drop still forming; worried face on "that?", a red ring round the empty timer',
      draw(lt, d, t) {
        roomAt();
        const worried = lt > th;
        K.sideSitter(SIT2.x, sitY(SIT2.s), SIT2.s, { lean: 0.3, pinch: 1, eyes: worried ? 'wide' : 'n', mouth: worried ? 'sad' : 'flat', brow: worried ? 1 : 0.4, t });
        timer(lerp(0.15, 0, eio(seg(lt, 0, 0.4))), '10–15', 'MIN', 1);
        K.lens(TM[0], 975, 125, pop(lt, bl), () => K.cartoonNose(0, -30, 0.62, { bleed: eo(seg(lt, bl + 0.15, bl + 0.45)), t }), LBG);
        if (worried) { ctx.save(); ctx.globalAlpha = eo(seg(lt, th, th + 0.2)); ctx.beginPath(); ctx.arc(TM[0], TM[1], 172, 0, Math.PI * 2); ctx.lineWidth = 26; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 14; ctx.strokeStyle = C.red; ctx.stroke(); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + 0.35, 'tock', { gain: 0.6 }); cue(st + bl, 'plop', { gain: 0.4 }); cue(st + th, 'alarm', { dur: 0.5, gain: 0.35 });
  }
  // ── 9b · Get emergency help. ──
  {
    const st = at('get', 8), em = Wd('emergency', 8) - st;
    add({ id: 'S14', at: st, cam: [540, 720], zoom: 0.08, note: 'plain: big phone pops in with an emergency beacon light on its screen; on "emergency" the beacon blinks red and the phone rings',
      draw(lt, d, t) {
        plain();
        const r = lt > em ? eo(seg(lt, em, em + 0.2)) : 0, ps = pop(lt, 0.02, 0.3);
        if (ps > 0) {
          ctx.save(); ctx.translate(540, 760); ctx.scale(ps, ps); ctx.translate(-540, -760);
          K.phone(540, 760, 1.05, '', r, t);
          K.siren(540 + Math.sin(t * 38) * 0.07 * r * 0, 700, 0.7, { on: r, t });
          ctx.restore();
        }
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.5 }); cue(st + em, 'alarm', { dur: 0.8, gain: 0.45 });
  }
  // ── 9c · Don't drive yourself. ──
  {
    const st = at('don', 8), dr = Wd('drive', 8) - st;
    add({ id: 'S15', at: st, cam: [540, 760], zoom: 0.07, note: 'plain: the phone with the blinking beacon moves up small; a car rolls in below; a big red X slams over the car on "drive"',
      draw(lt, d, t) {
        plain();
        const mv = eio(seg(lt, 0, 0.35));
        K.phone(lerp(540, 540, mv), lerp(760, 420, mv), lerp(1.05, 0.5, mv), '', 0, t);
        K.siren(540, lerp(700, 391, mv), lerp(0.7, 0.33, mv), { on: 1, t });
        const cx = lerp(-500, 540, eo(seg(lt, 0.05, 0.6)));
        K.carBody(cx, 960, 0.5, { t, handles: false });
        K.redX(540, 880, 0.75, lt > dr ? 1 : 0);
        if (lt > dr) K.redX(540, 880, lerp(1.4, 0.75, eo(seg(lt, dr, dr + 0.2))), 1 - seg(lt, dr, dr + 0.2));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 0.55, gain: 0.4 }); cue(st + dr, 'slam', { gain: 0.75 });
  }

  // ── 10-11 · TEASE + END CARD (room): lens with the fever topic at left, NEXT, BODY FILES; hero watches ──
  const TL = LENS, NX = [310, 1062];
  const teaseLens = (sc, { q = 0, th = 0, lvl = 0.3, bud = 0, shiver = 0, t = 0 } = {}) => {
    K.lens(TL[0], TL[1], TL[2], sc, () => {
      qMark(q, t);
      if (th > 0) { ctx.save(); ctx.scale(th, th); K.thermometer(bud > 0 ? lerp(0, -110, eio(clamp(bud))) : 0, -8, 0.24, lvl); ctx.restore(); }
      if (bud > 0) K.blanketBuddy(70, 140, 0.56, { shiver, t, sc: bud });
    }, LBG);
  };
  const badge = (sc) => K.filesBadge('BODY FILES', 540, 110, 54, sc);
  {
    const st = cut(9), nx = Wd('next', 9) - st, bo = Wd('body', 9) - st;
    add({ id: 'S16', at: st, cam: [540, 760], zoom: 0.05, note: 'room: hero (right) waves; a lens with a "?" pops at left; NEXT pill pops on "Next", BODY FILES badge on "Body"',
      draw(lt, d, t) {
        roomAt();
        badge(pop(lt, bo));
        const wv = eio(seg(lt, 0.05, 0.4)) * out(lt, d - 0.35, 0.3);
        hero({ armL: K.armPose(K.ARM.down, K.ARM.wave, wv), look: 0, mouth: 'smile', brow: 0.5 });
        teaseLens(pop(lt, 0.05), { q: 1, t });
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, pop(lt, nx));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.5 }); cue(st + nx, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.6 });
  }
  {
    const st = at('what', 9), fe = Wd('fever', 9) - st;
    add({ id: 'S17', at: st, cam: [420, 760], zoom: 0.06, note: 'same room: hero turns to the lens, curious; on "fever" the "?" swaps for a thermometer whose red line climbs',
      draw(lt, d, t) {
        roomAt(); badge(1);
        hero({ look: -1, mouth: lt > fe ? 'o' : 'smile', brow: lt > fe ? 0.9 : 0.6 });
        teaseLens(1, { q: lt < fe ? 1 : out(lt, fe, 0.12), th: pop(lt, fe), lvl: lerp(0.25, 0.75, eio(seg(lt, fe + 0.1, fe + 0.6))), t });
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, 1);
      } });
    cue(st, 'whoosh'); cue(st + fe, 'pop', { gain: 0.6 }); cue(st + fe + 0.1, 'slide', { dur: 0.5, gain: 0.3 });
  }
  {
    const st = cut(10), wh = Wd('why', 10) - st, mu = Wd('muscles', 10) - st;
    add({ id: 'S18', at: st, cam: [400, 760], zoom: 0.06, note: 'same room: on "why" the thermometer slides left and a figure bundled in a blanket pops in beside it (still); hero watches, brows up on "muscles"',
      draw(lt, d, t) {
        roomAt(); badge(1);
        hero({ look: -1, mouth: 'smile', brow: lt > mu ? 1 : 0.7 });
        teaseLens(1, { th: 1, lvl: 0.75, bud: pop(lt, wh), t });
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, 1);
      } });
    cue(st, 'whoosh'); cue(st + wh, 'pop', { gain: 0.6 });
  }
  {
    const st = at('shaking', 10), sh = Wd('shaking', 10) - st + 0.08, he = Wd('heat', 10) - st, cam = Wd('up', 10) - st + 0.2;
    add({ id: 'S19', at: st, cam: [540, 760], zoom: 0.05, note: 'END CARD (room): BODY FILES badge, lens with thermometer + blanket figure that starts shivering (shake lines) on "shaking", thermometer line rises on "heat", NEXT pill; after "up" the hero turns to camera with a warm grin and + FOLLOW pops above the lens',
      draw(lt, d, t) {
        roomAt(); badge(1);
        const toCam = lt > cam;
        hero({ look: toCam ? 0 : -1, mouth: toCam ? 'grin' : 'smile', brow: toCam ? 0.5 : 0.8 });
        teaseLens(1, { th: 1, lvl: lerp(0.75, 0.88, eio(seg(lt, he, he + 0.5))), bud: 1, shiver: lt > sh ? eo(seg(lt, sh, sh + 0.2)) : 0, t });
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, 1);
        K.followPill(TL[0], 400, pop(lt, cam), t, 60);
      } });
    cue(st, 'whoosh'); cue(st + sh, 'boing', { gain: 0.35 }); cue(st + sh + 0.05, 'alarm', { dur: 0.6, gain: 0.2 }); cue(st + he, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + cam, 'pop', { gain: 0.7 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES };
}
