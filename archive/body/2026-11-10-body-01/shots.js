// WHAT HAPPENS IF YOU SNEEZE WITH YOUR EYES OPEN?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Tone: a calm myth-bust. Real-world shots in K.home(); diagrams on plain paper (eye front view with lids, side-view
// eyeball held by six muscles, x-ray lungs). The 1882 claim is only a newspaper headline. NOTHING leaves a socket,
// ever: the eyeball diagram never moves. Tease: a helmet badge in a starry disc + a small bubbling droplet + NEXT;
// the hero only looks.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, bigText, line } from './core/lib.js';
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
  const fadeText = (txt, x, y, size, col, rot, sc, a) => { if (a <= 0 || sc <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); bigText(txt, x, y, size, col, rot, sc); ctx.restore(); };
  const HERO = { x: 330, y: 1000, s: 1.2 };                    // medium: the hero's spot in the room (left of the window)
  const hero = (o) => K.man({ ...HERO, ...o });
  const CLOSE = { x: 480, y: 1220, s: 1.55, arm: K.ARM.chest, armL: K.ARM.chest };   // close-up, hands high at the chest
  const close = (o) => K.man({ ...CLOSE, ...o });
  const nose = (x, y, s) => [x + 8 * s, y - 312 * s];          // the hero's nose (canvas) for man(x, y, s)
  const EYE = [540, 720, 1.15];                                // eyeFront position (S05, S06)
  const EM = [420, 600, 1.05];                                 // eyeMuscles position (S08, S09b)

  // ── 1 · HOOK: close-up, the hero winds up a sneeze with his eyes held WIDE open; ACHOO on "sneeze", ? on "open" ──
  {
    const st = 0, sn = Wd('sneeze', 0), ey = Wd('eyes', 0), op = Wd('open', 0);
    add({ id: 'S01', at: st, cam: [520, 760], zoom: 0.08, note: 'room close-up from frame 0: hero leans back "AH..." with eyes wide open; ACHOO! + spray on "sneeze" (eyes stay open); EYES OPEN tag on "eyes"; yellow ? on "open"',
      draw(lt) {
        K.home();
        const back = eio(seg(lt, 0, sn)), fwd = lt > sn ? Math.sin(seg(lt, sn, sn + 0.5) * Math.PI) : 0;
        const lean = -0.05 * back * (1 - seg(lt, sn, sn + 0.12)) + 0.05 * fwd;
        ctx.save(); ctx.translate(CLOSE.x, 1750); ctx.rotate(lean); ctx.translate(-CLOSE.x, -1750);
        close({ eyes: 'wide', mouth: lt < sn + 0.35 ? 'o' : 'flat', brow: lt < sn ? 0.4 + 0.6 * back : 1 });
        ctx.restore();
        const [nx, ny] = nose(CLOSE.x, CLOSE.y, CLOSE.s);
        K.sneezeSpray(nx + 30, ny + 10, 1.1, seg(lt, sn, sn + 0.9), 1);
        fadeText('AH...', 800, 330, 96, C.white, -0.08, eob(seg(lt, 0.08, 0.35)) * (0.9 + 0.25 * back), lt < sn ? 1 : 0);
        fadeText('ACHOO!', 730, 330, 100, C.yellow, -0.1, lt > sn ? eob(seg(lt, sn, sn + 0.2)) : 0, 1 - seg(lt, sn + 0.5, sn + 0.65));
        K.tag('EYES OPEN', 830, 520, 600, 690, 48, pop(lt, ey));
        bigText('?', 210, 430, 150, C.yellow, -0.15, pop(lt, op, 0.25) * (1 + 0.05 * Math.sin(lt * 6)));
      } });
    cue(st + 0.1, 'whoosh', { gain: 0.5 }); cue(st + 0.1, 'pop', { gain: 0.4 }); cue(st + sn, 'zip', { gain: 0.6 }); cue(st + sn + 0.02, 'thud', { gain: 0.5 });
    cue(st + ey, 'pop', { gain: 0.5 }); cue(st + op, 'boing', { gain: 0.5 });
  }

  // ── 2a · 1882: an old newspaper spins in; 1882 marked on "eighty"; headline stamps in on "claimed" ──────────
  {
    const st = cut(1), ein = Wd('in', 1) - st, ei = Wd('eighty', 1) - st, np = Wd('newspaper', 1) - st, cl = Wd('claimed', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 600], zoom: 0.08, note: 'old newspaper (THE DAILY GAZETTE) spins in on "In"; 1882 in the date line marked yellow on "eighty"; rustle bump on "newspaper"; headline SNEEZE BURSTS WOMAN\'S EYE! pops in on "claimed" (text only)',
      draw(lt) {
        plain();
        const e = seg(lt, 0, 0.8), bump = lt > np ? 0.04 * Math.sin(seg(lt, np, np + 0.3) * Math.PI) : 0;
        K.newspaper(540, 720, 0.95 * (1 + bump), { rot: lerp(-2 * Math.PI, -0.04, eo(e)), sc: lerp(0.8, 1, eob(e)), head: lt > cl ? eob(seg(lt, cl, cl + 0.3)) : 0, year: lt > ei ? eo(seg(lt, ei, ei + 0.25)) : 0 });
      } });
    cue(st, 'whoosh'); cue(st + ein, 'slide', { dur: 0.7, gain: 0.5 }); cue(st + ein + 0.75, 'thud', { gain: 0.6 }); cue(st + ei, 'pop', { gain: 0.5 });
    cue(st + np, 'tock', { gain: 0.4 }); cue(st + cl, 'slam', { gain: 0.6 });
  }
  // ── 2b · push in: the engraving lady sneezes on "sneeze"; red underlines on "burst" and "eye" ─────────────────
  {
    const st = at('sneeze', 1), sn = Wd('sneeze', 1) - st, bu = Wd('burst', 1) - st, ey = Wd('eye', 1) - st;
    const PX = 540, PY = 690, PS = 1.18;
    add({ id: 'S02b', at: st, cam: [540, 600], zoom: 0.1, note: 'closer on the same paper: the engraving of a lady on a street car sneezes (eyes shut) on "sneeze"; red underline draws under SNEEZE BURSTS on "burst", under WOMAN\'S EYE! on "eye"',
      draw(lt) {
        plain();
        K.newspaper(PX, PY, PS, { rot: -0.04, head: 1, year: 1, lady: lt < sn ? 0.3 * seg(lt, 0, sn) : 0.3 + 0.7 * seg(lt, sn, sn + 1.0) });
        ctx.save(); ctx.translate(PX, PY); ctx.rotate(-0.04); ctx.scale(PS, PS);
        const u1 = lt > bu ? eo(seg(lt, bu, bu + 0.3)) : 0, u2 = lt > ey ? eo(seg(lt, ey, ey + 0.25)) : 0;
        if (u1 > 0) line([[-270, -183], [lerp(-270, 270, u1), -183]], C.red, 8);
        if (u2 > 0) line([[-240, -80], [lerp(-240, 240, u2), -80]], C.red, 9);
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + sn + 0.3, 'pop', { gain: 0.4 }); cue(st + bu, 'zip', { gain: 0.5 }); cue(st + ey, 'zip', { gain: 0.5 });
  }

  // ── 3 · So could YOURS pop out? Hero gasps on "pop"; thinks on "first"; WHY? on "why"; blink-shut on "shut" ──
  {
    const st = cut(2), yo = Wd('yours', 2) - st, po = Wd('pop', 2) - st, fi = Wd('first', 2) - st, wy = Wd('why', 2) - st, sh = Wd('shut', 2) - st;
    add({ id: 'S03', at: st, cam: [500, 760], zoom: 0.08, note: 'room close-up: brows up on "yours"; gasp (hands to mouth, eyes wide, shock lines) on "pop"; calms + finger on chin on "first"; WHY? pill on "why"; eyes close on "shut"',
      draw(lt) {
        K.home();
        const g = eio(seg(lt, po - 0.1, po + 0.15)) * (1 - eio(seg(lt, fi - 0.25, fi + 0.1)));
        const th = eio(seg(lt, fi - 0.1, fi + 0.3));
        const armR = K.armPose(K.armPose(K.ARM.chest, K.ARM.mouth, g), K.ARM.chin, th), armL = K.armPose(K.ARM.chest, K.ARM.mouth, g);
        const gasp = lt > po && lt < fi;
        close({ arm: armR, armL, finger: th > 0.6 ? -0.2 : null, eyes: lt > sh ? 'closed' : gasp ? 'wide' : 'n', mouth: gasp ? 'o' : lt > sh ? 'flat' : 'smile',
          brow: lt > yo ? (gasp ? 1 : 0.6) : 0.2, look: th > 0.5 ? -0.6 : 0 });
        K.shockLines(CLOSE.x, CLOSE.y - 360 * CLOSE.s, 210, lt > po ? clamp((lt - po) * 5) * (1 - seg(lt, fi - 0.3, fi)) : 0);
        K.pill('WHY?', 830, 400, 64, C.yellow, C.ink, pop(lt, wy));
      } });
    cue(st, 'whoosh'); cue(st + yo, 'pop', { gain: 0.4 }); cue(st + po, 'boing', { gain: 0.6 }); cue(st + wy, 'pop', { gain: 0.6 }); cue(st + sh, 'tock', { gain: 0.5 });
  }

  // ── 4a · A sneeze is involuntary: the hero sneezes for real (eyes shut), CAN'T STOP IT on "involuntary" ──────
  {
    const st = cut(3), sn = Wd('sneeze', 3) - st, iv = Wd('involuntary', 3) - st;
    const HX = 380;
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.08, note: 'room medium: hero sneezes on "sneeze" and holds the sneeze face (eyes squeezed > <, mouth open, no smile) to the end, spray, ACHOO!; CAN\'T STOP IT pill on "involuntary"',
      draw(lt) {
        K.home();
        const fwd = lt > sn ? Math.sin(seg(lt, sn, sn + 0.45) * Math.PI) : 0;
        ctx.save(); ctx.translate(HX, 1740); ctx.rotate(0.05 * fwd - 0.04 * eio(seg(lt, 0, sn)) * (lt < sn ? 1 : 0)); ctx.translate(-HX, -1740);
        hero({ x: HX, arm: K.ARM.chest, armL: K.ARM.chest, eyes: lt > sn - 0.05 ? 'squeeze' : 'n', mouth: 'o', brow: lt < sn ? 0.8 : 1, frown: lt > sn - 0.05 });
        ctx.restore();
        const [nx, ny] = nose(HX, HERO.y, HERO.s);
        K.sneezeSpray(nx + 24, ny + 8, 1, seg(lt, sn, sn + 0.85), 1);
        fadeText('ACHOO!', 750, 330, 100, C.yellow, -0.1, lt > sn ? eob(seg(lt, sn, sn + 0.2)) : 0, 1 - seg(lt, iv + 0.25, iv + 0.4));
        K.pill("CAN'T STOP IT", 800, 720, 40, C.ink, C.white, pop(lt, iv));
      } });
    cue(st, 'whoosh'); cue(st + sn, 'zip', { gain: 0.6 }); cue(st + sn + 0.02, 'thud', { gain: 0.5 }); cue(st + iv, 'pop', { gain: 0.6 });
  }
  // ── 4b · x-ray: the lungs squeeze and blast air up and out on "blast"; LUNGS tag on "lungs" ─────────────────
  {
    const st = Wd('blast', 3) - 0.04, bl = Wd('blast', 3) - st, lu = Wd('lungs', 3) - st;
    const X = 540, Y = 1050, SC = 1.3, WIDE = { e: [235, -10], h: [215, 95] };
    add({ id: 'S04b', at: st, cam: [540, 820], zoom: 0.1, note: 'x-ray hero (whole body x-ray, head normal, eyes shut): pink lungs squeeze on "blast", blue air arrows rush up the windpipe and spray out of the mouth; LUNGS tag on "lungs"',
      draw(lt, d, t) {
        K.xray(t);
        const sq = lt > bl ? eo(seg(lt, bl, bl + 0.3)) * (1 - 0.6 * eio(seg(lt, bl + 0.9, d))) : 0;
        K.man({ x: X, y: Y, s: SC, xray: true, lungs: sq, arm: WIDE, armL: WIDE, eyes: 'closed', mouth: lt > bl && lt < bl + 1.0 ? 'o' : 'flat', brow: 0.5 });
        if (lt > bl) for (let i = 0; i < 3; i++) {
          const ph = (seg(lt, bl, bl + 1.0) * 2.2 + i / 3) % 1, a = (1 - seg(lt, bl + 0.8, bl + 1.1)) * Math.sin(ph * Math.PI);
          K.flowArrow(X, Y + lerp(-140, -250, ph) * SC, 90, -Math.PI / 2, a, C.sky, 18);
        }
        K.sneezeSpray(X, Y - 272 * SC, 1, seg(lt, bl + 0.05, bl + 1.0), 1, { d0: 10, reach: 300, ang: -0.3 });
        K.tag('LUNGS', 230, 560, X - 95 * SC, Y - 60 * SC, 56, pop(lt, lu));
      } });
    cue(st, 'whoosh'); cue(st + bl, 'zip', { gain: 0.7 }); cue(st + bl + 0.05, 'slide', { dur: 0.8, gain: 0.4 }); cue(st + lu, 'pop', { gain: 0.6 });
  }

  // ── 5 · eye diagram: the lids snap shut on "shutting", open, snap shut again on "reflex"; AUTOMATIC pill ─────
  {
    const st = cut(4), sh = Wd('shutting', 4) - st, is = Wd('is', 4) - st, au = Wd('automatic', 4) - st, rf = Wd('reflex', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.08, note: 'front view eye in a skin disc: lid snaps shut on "shutting", reopens on "is", AUTOMATIC pill on "automatic", lid snaps shut again on "reflex" and reopens',
      draw(lt) {
        plain();
        const lid = Math.max(seg(lt, sh, sh + 0.12) * (1 - seg(lt, is + 0.1, is + 0.3)), seg(lt, rf, rf + 0.1) * (1 - seg(lt, rf + 0.6, rf + 0.8)));
        K.eyeFront(EYE[0], EYE[1], EYE[2], { lid });
        K.pill('AUTOMATIC', 540, 220, 56, C.yellow, C.ink, pop(lt, au));
        if (lt > rf) K.burst(EYE[0], K.eyeLidY(EYE[1], EYE[2], 1), 2.2, 1 - seg(lt, rf + 0.15, rf + 0.5));
      } });
    cue(st, 'whoosh'); cue(st + sh, 'pop', { gain: 0.5 }); cue(st + au, 'pop', { gain: 0.6 }); cue(st + rf, 'thud', { gain: 0.5 });
  }

  // ── 6 · doctors think it keeps irritants out: doctor badge on "doctors", lid shuts on "helps", dust bounces off ─
  {
    const st = cut(5), dc = Wd('doctors', 5) - st, hp = Wd('helps', 5) - st, ir = Wd('irritants', 5) - st;
    add({ id: 'S06', at: st, cam: [600, 700], zoom: 0.08, note: 'same eye: doctor badge pops on "doctors"; lid shuts on "helps"; dust specks fly in on "irritants" and bounce off the shut lid, then fade',
      draw(lt, d, t) {
        plain();
        K.eyeFront(EYE[0], EYE[1], EYE[2], { lid: eio(seg(lt, hp, hp + 0.2)) });
        K.doctorBadge(190, 250, 0.68, pop(lt, dc));
        if (lt > ir) for (let i = 0; i < 5; i++) {
          const t0 = ir + i * 0.07, th = t0 + 0.28;
          if (lt < t0) continue;
          const hx = EYE[0] + (-130 + i * 65) * EYE[2], hy = K.eyeLidY(EYE[1], EYE[2], 1) - 6;
          const sx = 1160 + i * 30, sy = 330 + i * 70;
          let x, y, a = 1;
          if (lt < th) { const u = eio(seg(lt, t0, th)); x = lerp(sx, hx, u); y = lerp(sy, hy, u); }
          else { const u = seg(lt, th, th + 0.6); x = hx + u * (260 + i * 30); y = hy - Math.sin(u * Math.PI * 0.8) * (220 - i * 20); a = 1 - seg(u, 0.5, 1); }
          K.dust(x, y, 1.2, lt * 4 + i, a);
          if (lt > th) K.burst(hx, hy, 0.6, 1 - seg(lt, th + 0.05, th + 0.3));
        }
      } });
    cue(st, 'whoosh'); cue(st + dc, 'pop', { gain: 0.6 }); cue(st + hp, 'tock', { gain: 0.4 }); cue(st + ir, 'slide', { dur: 0.3, gain: 0.4 });
    for (let i = 0; i < 3; i++) cue(st + ir + 0.28 + i * 0.14, 'boing', { gain: 0.35 });
  }

  // ── 7 · but focus hard: hero strains (frown, sweat), sneezes on "can" with eyes WIDE; green check on "open" ───
  {
    const st = cut(6), fo = Wd('focus', 6) - st, cn = Wd('can', 6) - st, op = Wd('open', 6) - st;
    add({ id: 'S07', at: st, cam: [500, 760], zoom: 0.08, note: 'room close-up: concentration from "focus" (frown, fists shake, sweat drop, strain lines); ACHOO with eyes still WIDE on "can"; green check on "open", proud grin',
      draw(lt, d, t) {
        K.home();
        const str = lt > fo && lt < op + 0.1, shake = str ? Math.sin(lt * 60) * 4 : 0;
        close({ x: CLOSE.x + shake, eyes: lt > fo ? 'wide' : 'n', frown: str, brow: str ? 0 : 0.6, mouth: lt > op + 0.1 ? 'grin' : lt > cn && lt < cn + 0.4 ? 'o' : 'flat' });
        const hy = CLOSE.y - 350 * CLOSE.s;
        if (lt > fo) {
          const ph = ((lt - fo) * 1.4) % 1;
          K.drop(CLOSE.x + 150, hy - 60 + ph * 90, 0.8, Math.PI, (1 - ph) * (1 - seg(lt, op, op + 0.2)));
          K.shockLines(CLOSE.x, hy, 200, clamp((lt - fo) * 5) * (1 - seg(lt, op, op + 0.2)));
        }
        const [nx, ny] = nose(CLOSE.x, CLOSE.y, CLOSE.s);
        K.sneezeSpray(nx + 30, ny + 10, 1.1, seg(lt, cn, cn + 0.8), 1);
        fadeText('ACHOO!', 720, 300, 100, C.yellow, -0.1, lt > cn ? eob(seg(lt, cn, cn + 0.2)) : 0, 1 - seg(lt, op - 0.15, op));
        K.checkMark(870, 490, 1.1, pop(lt, op));
      } });
    cue(st, 'whoosh'); cue(st + fo, 'alarm', { dur: 0.9, gain: 0.25 }); cue(st + cn, 'zip', { gain: 0.6 }); cue(st + op, 'pop', { gain: 0.7 });
  }

  // ── 8 · the eyeball: side diagram pops in on "And"; six muscles grow in from "attached"; 6 MUSCLES on "six" ───
  {
    const st = cut(7), an = Wd('and', 7) - st, at_ = Wd('attached', 7) - st, sx = Wd('six', 7) - st;
    add({ id: 'S08', at: st, cam: [480, 640], zoom: 0.08, note: 'clean side-view eyeball (cornea left, optic nerve right) pops in on "And/eyeballs"; the six eye muscles grow in one by one from "attached" to "six"; 6 MUSCLES pill on "six". The ball never moves',
      draw(lt, d, t) {
        plain();
        const sc = pop(lt, an, 0.35);
        if (sc > 0) {
          ctx.save(); ctx.translate(EM[0], EM[1]); ctx.scale(sc, sc); ctx.translate(-EM[0], -EM[1]);
          K.eyeMuscles(EM[0], EM[1], EM[2], { n: lt > at_ ? 6 * seg(lt, at_, sx + 0.25) : 0, t });
          ctx.restore();
        }
        K.pill('6 MUSCLES', 540, 1000, 52, C.pink, C.white, pop(lt, sx));
      } });
    cue(st, 'whoosh'); cue(st + an, 'pop', { gain: 0.6 });
    for (let i = 0; i < 6; i++) cue(st + at_ + (sx + 0.25 - at_) * (i + 0.5) / 6, 'tock', { gain: 0.35 });
    cue(st + sx, 'thud', { gain: 0.6 });
  }

  // ── 9a · an allergist says: doctor in the room, ALLERGIST pill on "allergist"; sneeze badge in a bubble on "sneeze" ─
  {
    const st = cut(8), al = Wd('allergist', 8) - st, sy = Wd('says', 8) - st, sn = Wd('sneeze', 8) - st;
    const BX = 760, BY = 560;
    add({ id: 'S09', at: st, cam: [540, 640], zoom: 0.06, note: 'room: the allergist (lab coat, grey hair, glasses) at left; ALLERGIST pill on "allergist"; speech bubble on "says"; sneeze badge (eyes squeezed shut) inside it on "sneeze"',
      draw(lt, d, t) {
        K.home();
        const talk = lt > sy && Math.sin(lt * 20) > 0;
        K.doctor({ ...HERO, arm: K.ARM.hip, mouth: talk ? 'o' : 'smile', brow: 0.4 });
        K.pill('ALLERGIST', 330, 340, 52, C.ink, C.white, pop(lt, al));
        K.bubble(BX, BY, 400, 340, 520, 700, pop(lt, sy));
        K.sneezeBadge(BX, BY, 0.85, lt > sn + 0.35 ? eo(seg(lt, sn + 0.35, sn + 0.75)) : 0, t, pop(lt, sn));
      } });
    cue(st, 'whoosh'); cue(st + al, 'pop', { gain: 0.6 }); cue(st + sy, 'pop', { gain: 0.4 }); cue(st + sn + 0.35, 'zip', { gain: 0.4 });
  }
  // ── 9b · extremely unlikely: sneeze pressure arrows push, the muscles hold, the ball stays; stamp on "unlikely" ──
  {
    const st = at('extremely', 8), ex = Wd('extremely', 8) - st, un = Wd('unlikely', 8) - st, po = Wd('pop', 8) - st;
    add({ id: 'S09b', at: st, cam: [480, 700], zoom: 0.08, note: 'eyeball diagram: red pressure arrows push in on "extremely", the muscles flex and the ball stays exactly in place; EXTREMELY UNLIKELY red stamp slams on "unlikely"; arrows fade out; muscles relax on "pop"',
      draw(lt, d, t) {
        plain();
        const pr = lt > ex ? eo(seg(lt, ex, ex + 0.25)) * (1 - seg(lt, po - 0.3, po)) : 0;
        K.eyeMuscles(EM[0], EM[1] - 40, EM[2], { n: 6, tug: pr, t });
        for (const [dy, k] of [[-90, 0], [0, 1], [90, 2]]) {
          const wob = Math.sin(lt * 14 + k) * 8;
          K.flowArrow(EM[0] - 290 + wob, EM[1] - 40 + dy * 0.8, 110, 0, pr, C.red, 20);
        }
        const s = lt > un ? lerp(1.8, 1, eo(seg(lt, un, un + 0.18))) : 0;
        K.stamp('EXTREMELY\nUNLIKELY', 540, 1030, 64, -0.08, s, C.red);
      } });
    cue(st, 'whoosh'); cue(st + ex, 'alarm', { dur: 0.7, gain: 0.3 }); cue(st + un, 'slam', { gain: 0.8 }); cue(st + po, 'tock', { gain: 0.4 });
  }

  // ── 10 · eyes open or shut, they're staying put: blink demo, lock badge on "staying", locks on "put" ────────
  {
    const st = cut(9), op = Wd('open', 9) - st, sh = Wd('shut', 9) - st, sy = Wd('staying', 9) - st, pu = Wd('put', 9) - st;
    add({ id: 'S10', at: st, cam: [560, 760], zoom: 0.06, note: 'room close-up (hero left): eyes wide on "open", shut on "shut", open again with a warm smile; eye + padlock badge pops on "staying", shackle clicks shut on "put"',
      draw(lt) {
        K.home();
        const ey = lt > sh && lt < sh + 0.45 ? 'closed' : lt > op && lt < sh ? 'wide' : 'n';
        close({ x: 400, eyes: ey, mouth: lt > sh + 0.45 ? 'smile' : 'flat', brow: lt > op && lt < sh ? 0.9 : 0.4 });
        K.lockBadge(830, 470, 0.85, pop(lt, sy), lt > pu ? eob(seg(lt, pu, pu + 0.2)) : 0);
      } });
    cue(st, 'whoosh'); cue(st + op, 'pop', { gain: 0.4 }); cue(st + sh, 'tock', { gain: 0.5 }); cue(st + sy, 'pop', { gain: 0.6 }); cue(st + pu, 'thud', { gain: 0.7 });
  }

  // ── 11 · NEXT body file: badge on "next", hero waves, looks right; helmet badge + NEXT on "space"; ? on "suit" ──
  const HB = [760, 620];
  {
    const st = cut(10), nx = Wd('next', 10) - st, wh = Wd('what', 10) - st, sp = Wd('space', 10) - st, su = Wd('suit', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 640], zoom: 0.05, note: 'room, BODY FILES badge (name only) on "next"; hero waves, then looks right with a curious smile on "what"; starry helmet badge + NEXT pill pop on "space"; yellow ? on "suit". Nobody is in danger',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 130, 44, pop(lt, nx));
        const wv = eio(seg(lt, 0.05, 0.4)) * (1 - eio(seg(lt, wh - 0.35, wh - 0.05)));
        hero({ arm: K.armPose(K.ARM.down, K.ARM.wave, wv), look: lt > wh ? 1 : 0, brow: lt > wh ? 0.7 : 0.4, mouth: 'smile' });
        K.helmetBadge(HB[0], HB[1], 1, pop(lt, sp), t, 0);
        K.pill('NEXT', HB[0], 380, 52, C.yellow, C.ink, pop(lt, sp + 0.05));
        bigText('?', 960, 420, 110, C.yellow, 0.12, pop(lt, su, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + nx, 'thud', { gain: 0.6 }); cue(st + sp, 'pop', { gain: 0.6 }); cue(st + su, 'boing', { gain: 0.5 });
  }

  // ── 12 · END CARD: ...the NASA tester who felt his spit boil: droplet bubbles in the badge on "boil"; FOLLOW ──
  {
    const st = cut(11), na = Wd('nasa', 11) - st, bo = Wd('boil', 11) - st;
    add({ id: 'S12', at: st, cam: [600, 640], zoom: 0.05, note: 'end card: BODY FILES badge, helmet badge + NEXT stay; ? bounces on "NASA"; a small water droplet with rising bubbles appears in the badge on "boil"; FOLLOW pill after "boil"; hero looks to camera with a curious smile',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 130, 44, 1);
        const huh = lt > bo && lt < bo + 0.35;
        hero({ look: lt > bo + 0.45 ? 0 : 1, brow: huh ? 1 : 0.7, mouth: huh ? 'o' : 'smile' });
        K.helmetBadge(HB[0], HB[1], 1, 1, t, lt > bo ? eob(seg(lt, bo, bo + 0.3)) : 0);
        K.pill('NEXT', HB[0], 380, 52, C.yellow, C.ink, 1);
        const qb = lt > na ? 1 + 0.3 * Math.sin(seg(lt, na, na + 0.4) * Math.PI) : 1 + 0.04 * Math.sin(lt * 5);
        bigText('?', 960, 420, 110, C.yellow, 0.12, qb);
        K.followPill(330, 270, pop(lt, bo + 0.35), t);
      } });
    cue(st, 'whoosh'); cue(st + na, 'boing', { gain: 0.5 }); cue(st + bo, 'bubbles', { dur: 1.0, gain: 0.5 }); cue(st + bo + 0.35, 'pop', { gain: 0.6 });
  }

  return { shots: S, cues: CUES };
}
