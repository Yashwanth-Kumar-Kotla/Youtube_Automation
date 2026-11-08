// WHAT HAPPENS IF YOU BREAK YOUR KNUCKLE?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const plain = () => { ctx.fillStyle = C.bg; ctx.fillRect(-300, -300, W + 600, H + 600); };
  const LOOK = { e: [230, -60], h: [250, -260] };   // hero holds his fist up next to his face

  // ── 1 · HOOK: he looks at his fist, CRACK on "break" ───────────────────
  {
    const st = cut(0), br = Wd('break', 0) - st, kn = Wd('knuckle', 0) - st;
    add({ id: 'S01', at: st, cam: [600, 800], note: 'hero raises fist, CRACK! on "break", shock on "knuckle"',
      draw(lt) {
        K.room();
        const arm = K.armPose(K.ARM.down, LOOK, eio(seg(lt, 0, 0.45)));
        const shocked = lt > kn, shake = lt > br ? Math.sin(lt * 70) * 7 * Math.max(0, 1 - (lt - br) * 2.5) : 0;
        K.man({ x: 520 + shake, y: 1180, s: 1.6, arm, look: 1, eyes: shocked ? 'wide' : 'n', mouth: shocked ? 'o' : 'flat', brow: shocked ? 1 : 0.2 });
        const hx = 520 + LOOK.h[0] * 1.6, hy = 1180 + LOOK.h[1] * 1.6;
        if (lt > br) { K.burst(hx, hy, 1.6, 1 - seg(lt, br + 0.3, br + 0.8)); bigText('CRACK!', 790, 300, 110, C.yellow, -0.15, eob(seg(lt, br, br + 0.18))); }
        K.shockLines(520, 620, 290, shocked ? clamp((lt - kn) * 5) : 0);
      } });
    cue(st + 0.2, 'whoosh', { gain: 0.5 }); cue(st + br, 'slam', { gain: 0.8 }); cue(st + kn, 'boing', { gain: 0.5 });
  }

  // ── 2 · he winds up and punches the wall ───────────────────────────────
  {
    const st = cut(1), hit = Wd('punch', 1) - st + 0.12;
    add({ id: 'S02', at: st, cam: [640, 900], zoom: 0.1, note: 'wide: hero winds up, punch lands on "punch"',
      draw(lt) {
        K.room(); K.brickWall(830, 240, 600, 1320);
        const wind = eio(seg(lt, 0.2, hit - 0.25)), go = eo(seg(lt, hit - 0.2, hit));
        const arm = lt < hit - 0.2 ? K.armPose(K.ARM.down, K.ARM.hip, wind) : K.armPose(K.ARM.hip, K.ARM.punch, go);
        const recoil = lt > hit ? Math.sin(lt * 60) * 6 * Math.max(0, 1 - (lt - hit) * 3) : 0;
        K.man({ x: 330 + recoil, y: 1160, s: 1.25, arm, frown: lt < hit + 0.3, brow: lt > hit + 0.3 ? 1 : 0, eyes: lt > hit + 0.3 ? 'wide' : 'n', mouth: lt > hit + 0.3 ? 'o' : 'flat' });
        if (lt > hit - 0.2 && lt < hit) K.speedLines(330 + 460 * 1.25, 1160 - 160 * 1.25, 0.8);
        if (lt > hit) K.burst(830, 960, 1.4, 1 - seg(lt, hit + 0.25, hit + 0.7));
      } });
    cue(st, 'whoosh'); cue(st + hit - 0.2, 'zip', { gain: 0.6 }); cue(st + hit, 'thud');
  }

  // ── 3 · close-up: fist vs wall. BONK. The wall smirks. ──────────────────
  {
    const st = cut(2), hit = Wd('wall', 2) - st - 0.05, wins = Wd('wins', 2) - st;
    add({ id: 'S03', at: st, cam: [620, 800], zoom: 0.08, note: 'fist slams wall on "wall", wall smirks on "wins"',
      draw(lt) {
        plain();
        const shake = lt > hit ? Math.sin(lt * 90) * 16 * Math.max(0, 1 - (lt - hit) * 3) : 0;
        ctx.save(); ctx.translate(shake, 0);
        K.brickWall(700, 220, 700, 1060, lt > wins ? eo(seg(lt, wins, wins + 0.3)) : 0);
        const fx = lt < hit ? lerp(-260, 560, eio(seg(lt, 0, hit))) : lerp(560, 470, eo(seg(lt, wins, wins + 0.5)));
        const sq = lt > hit ? Math.max(0, 1 - (lt - hit) * 3) : 0;
        line([[-300, 820], [fx - 150, 800]], C.skin, 210); line([[-300, 820], [fx - 330, 810]], C.shirt, 250);
        K.fistSide(fx, 800, 1.1, { rot: Math.PI / 2, squash: sq });
        ctx.restore();
        if (lt > hit) { K.burst(705, 800, 1.8, 1 - seg(lt, hit + 0.3, hit + 0.8)); bigText('BONK!', 540, 440, 120, C.yellow, -0.12, eob(seg(lt, hit, hit + 0.18)) * (1 - seg(lt, wins - 0.1, wins + 0.1))); }
      } });
    cue(st, 'whoosh'); cue(st + hit, 'slam'); cue(st + wins, 'pop', { gain: 0.6 });
  }

  // ── 4 · x-ray: knuckles = the ends of your hand bones ───────────────────
  {
    const st = cut(3), kn = Wd('knuckles', 3) - st, bones = Wd('bones', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.08, note: 'x-ray hand, knuckles glow yellow on "knuckles", tag on "bones"',
      draw(lt, d, t) {
        K.xray(t);
        K.handBones(540, 780, 1.45, { glow: lt > kn ? eo(seg(lt, kn, kn + 0.3)) * (0.75 + 0.25 * Math.sin(lt * 8)) : 0 });
        const [kx, ky] = K.knuckleAt(1);
        K.tag('KNUCKLES', 300, 1150, 540 + kx * 1.45, 780 + (ky + 20) * 1.45, 64, lt > kn ? eob(seg(lt, kn, kn + 0.3)) : 0);
        K.pill('HAND BONES', 790, 1150, 48, C.cyan, C.navy, lt > bones ? eob(seg(lt, bones, bones + 0.3)) : 0);
      } });
    cue(st, 'whoosh'); cue(st + kn, 'sparkle', { dur: 0.6, gain: 0.6 }); cue(st + bones, 'pop');
  }

  // ── 5a · the pinky one cracks ───────────────────────────────────────────
  const [fxp, fyp] = K.fractureAt(540, 780, 1.45);
  {
    const st = cut(4), cr = Wd('cracks', 4) - st;
    add({ id: 'S05', at: st, cam: [fxp, fyp], zoom: 0.35, note: 'push into pinky, red crack draws on "cracks"',
      draw(lt, d, t) {
        K.xray(t);
        K.handBones(540, 780, 1.45, { crack: seg(lt, cr, cr + 0.35), hot: lt > cr ? 0.5 + 0.5 * Math.sin(lt * 9) : 0 });
        K.tag('PINKY', fxp + 170, fyp - 380, fxp + 40, fyp - 150, 50, eob(seg(lt, 0.15, 0.45)));
      } });
    cue(st, 'whoosh'); cue(st + cr, 'slam', { gain: 0.7 }); cue(st + cr + 0.1, 'alarm', { dur: 1.0, gain: 0.4 });
  }
  // ── 5b · "boxer's fracture" ─────────────────────────────────────────────
  {
    const st = Wd('doctors', 4) - 0.08, bx = Wd('boxer', 4) - st;
    add({ id: 'S05b', at: st, cam: [fxp, fyp - 60], zoom: 0.12, note: 'BOXER\'S FRACTURE pill slams in on "boxer\'s"',
      draw(lt, d, t) {
        K.xray(t);
        K.handBones(540, 780, 1.45, { crack: 1, hot: 0.5 + 0.5 * Math.sin(lt * 9) });
        K.pill("BOXER'S FRACTURE", 540, 300, 66, C.red, C.white, lt > bx ? eob(seg(lt, bx, bx + 0.3)) : 0);
      } });
    cue(st, 'whoosh'); cue(st + bx, 'thud');
  }

  // ── 6 · it swells like a balloon ───────────────────────────────────────
  {
    const st = cut(5), sw = Wd('swells', 5) - st, bal = Wd('balloon', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.08, note: 'hand puffs up from "swells", boing on "balloon"',
      draw(lt) {
        plain();
        const puff = lt < sw ? 0 : lt < bal ? 0.6 * eio(seg(lt, sw, bal)) : lerp(0.6, 1, eob(seg(lt, bal, bal + 0.35)));
        K.handSkin(540, 760, 1.1, { puff, bruise: clamp(puff * 1.3) });
        K.stopwatch(170, 330, 0.3, lt * 10);
      } });
    cue(st, 'whoosh'); cue(st + sw, 'slide', { dur: bal - sw, gain: 0.5 }); cue(st + bal, 'boing');
  }

  // ── 7 · the knuckle sinks in and disappears ─────────────────────────────
  {
    const st = cut(6), sk = Wd('sink', 6) - st, gone = Wd('disappear', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.12, note: 'fist from the knuckle side, pinky knuckle sinks on "sink"',
      draw(lt) {
        plain();
        K.fistSide(540, 820, 1.3, { sink: eio(seg(lt, sk, gone + 0.2)) });
        const kx = 540 + 195 * 1.3;
        K.arrow(kx, 470 + Math.sin(lt * 8) * 10, 260, Math.PI / 2, eo(seg(lt, 0.2, 0.5)));
        K.pill('MISSING!', 540, 1150, 62, C.red, C.white, lt > gone ? eob(seg(lt, gone, gone + 0.3)) : 0);
      } });
    cue(st, 'whoosh'); cue(st + sk, 'slide', { dur: 0.7, gain: 0.5 }); cue(st + gone, 'pop');
  }

  // ── 8 · the X-ray shows the crack ───────────────────────────────────────
  {
    const st = cut(7), cr = Wd('crack', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.1, note: 'x-ray film on a lightbox, crack flashes red on "crack"',
      draw(lt, d, t) {
        plain();
        rr(110, 180, 860, 1080, 40); ctx.fillStyle = C.ink; ctx.fill();
        ctx.save(); rr(140, 210, 800, 1020, 24); ctx.clip(); K.xray(t); K.handBones(540, 760, 1.15, { crack: 1, hot: lt > cr ? 0.5 + 0.5 * Math.sin(lt * 10) : 0 }); ctx.restore();
        K.pill('X-RAY', 540, 170, 56, C.ink, C.white, eob(seg(lt, 0.05, 0.35)));
      } });
    cue(st, 'whoosh'); cue(st + 0.15, 'tock'); cue(st + cr, 'alarm', { dur: 0.8, gain: 0.4 });
  }

  // ── 9 · splint + six weeks ──────────────────────────────────────────────
  {
    const st = cut(8), sp = Wd('splint', 8) - st, wk = Wd('weeks', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.08, note: 'splint slides on at "splint", calendar 6 WEEKS drops on "weeks"',
      draw(lt) {
        plain();
        const mv = eio(seg(lt, wk - 0.6, wk - 0.1));
        K.handSkin(lerp(540, 330, mv), lerp(760, 820, mv), lerp(1.05, 0.8, mv), { puff: 0.25, bruise: 0.4, splint: eo(seg(lt, sp, sp + 0.45)) });
        if (lt > wk - 0.3) { const p = eob(seg(lt, wk - 0.3, wk + 0.1)); K.calendar(790, lerp(-300, 640, p), 0.5, '6', 'WEEKS', lerp(-0.3, 0.06, p)); }
      } });
    cue(st, 'whoosh'); cue(st + sp, 'slide', { dur: 0.45 }); cue(st + sp + 0.45, 'thud', { gain: 0.6 }); cue(st + wk, 'thud');
  }

  // ── 10 · your body builds new bone over the break ───────────────────────
  {
    const st = cut(9), bu = Wd('builds', 9) - st, br = Wd('break', 9) - st;
    const sc = 2.6, hx = 540 - (fxp - 540) / 1.45 * sc, hy = 720 - (fyp - 780) / 1.45 * sc;
    add({ id: 'S10', at: st, cam: [540, 720], zoom: 0.15, note: 'close-up of the break, new bone grows in from "builds" to "break"',
      draw(lt, d, t) {
        K.xray(t);
        const heal = eio(seg(lt, bu, br + 0.2));
        K.handBones(hx, hy, sc, { crack: 1 - heal, heal, t });
        K.pill('NEW BONE', 540, 1120, 60, C.cyan, C.navy, lt > br - 0.4 ? eob(seg(lt, br - 0.4, br - 0.1)) : 0);
      } });
    cue(st, 'whoosh'); cue(st + bu, 'sparkle', { dur: br - bu + 0.3 });
  }

  // ── 11 · so next time... maybe don't ────────────────────────────────────
  {
    const st = cut(10), dn = Wd('don', 10) - st, wl = Wd('wall', 10) - st;
    add({ id: 'S11', at: st, cam: [480, 760], note: 'hero wags his finger, wall smirks back',
      draw(lt) {
        K.room(); K.brickWall(860, 240, 600, 1320, lt > wl ? eo(seg(lt, wl, wl + 0.3)) : 0);
        const p = eio(seg(lt, 0, 0.5));
        K.man({ x: 430, y: 1290, s: 1.9, arm: K.armPose(K.ARM.down, K.ARM.point, p), finger: lt > 0.35 ? Math.sin(lt * 11) * 0.35 : 0,
          mouth: lt > dn ? 'grin' : 'smirk', brow: 0.3, smirk: true });
      } });
    cue(st, 'whoosh'); cue(st + wl, 'pop', { gain: 0.5 }); cue(st + dn, 'boing', { gain: 0.6 });
  }

  return { shots: S, cues: CUES };
}
