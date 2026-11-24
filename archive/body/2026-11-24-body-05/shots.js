// WHAT HAPPENS WHEN YOU WALK INTO A ROOM AND FORGET WHY?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): cutaway of two rooms split by a white door jamb; the hero frozen mid-step across it,
// his thought cloud (a coffee mug) wiped to blank exactly where it crosses the jamb line; "55 ROOMS" tag on the room-1 wall,
// "ROOM 2 / 55" sign on the room-2 wall (rewatch), A YES / B NO pills in the room. No black fade in or out (loop: true).
// Guess (line 1b): same rooms, A / B pills in the frame-1 spot. Re-hook (line 4): new scene, zoom into a big doorway.
// Answer (line 6): hero walks BACK into room 1, the cloud stays blank, check on B NO in the same pill spot.
// Rewatch: "ROOM 2 / 55" sign; the filing cabinet label "event boundary (Radvansky, 2011)".
// Tease (line 8a, from the word "Next"): office chair + NEXT + BODY FILES. Loop (8b "Now get up... wait, why?"): the hero
// springs out of the chair, walks into the frame-1 doorway, the mug cloud wipes at the jamb: last frame = frame 1.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, line, bigText, rr } from './core/lib.js';
import { L, Wd } from './core/timing.js';
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
  const blip = (lt, a, d = 0.35) => (lt > a ? Math.sin(Math.PI * seg(lt, a, a + d)) : 0);
  const enter = (lt) => lerp(0.86, 1, eob(seg(lt, 0, 0.25)));
  const ring = (x, y, r, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.lineWidth = 16; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = C.yellow; ctx.stroke(); ctx.restore(); };
  const curveArrow = (x0, x1, y, lift, p, a = 1) => {     // yellow curved arrow (ink rim) from x0 to x1, drawn to fraction p
    if (p <= 0 || a <= 0) return; const P = []; for (let i = 0; i <= 30 * p; i++) { const u = i / 30; P.push([lerp(x0, x1, u), y - Math.sin(Math.PI * u) * lift]); }
    if (P.length < 2) return; ctx.save(); ctx.globalAlpha = clamp(a); line(P, C.ink, 30); line(P, C.yellow, 16);
    const [ex, ey] = P[P.length - 1], [px, py] = P[P.length - 2], an = Math.atan2(ey - py, ex - px);
    ctx.translate(ex, ey); ctx.rotate(an); ctx.beginPath(); ctx.moveTo(34, 0); ctx.lineTo(-16, -30); ctx.lineTo(-16, 30); ctx.closePath(); ctx.fillStyle = C.ink; ctx.fill();
    ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(-8, -18); ctx.lineTo(-8, 18); ctx.closePath(); ctx.fillStyle = C.yellow; ctx.fill(); ctx.restore();
  };

  // ── the two-room set (hook, guess, carry, answer, loop) ──
  const JX = 520, WIPE = JX + 48, FLOOR = 1380, HOOK_CAM = [540, 820];
  const HERO = { x: 560, y: 860, s: 0.85 }, CLOUD = { dx: -20, y: 330, s: 0.95 }, STEP = 0.32;
  const PA = [270, 1000], PB = [810, 1000], PS = 46;
  const rooms = ({ jambGlow = 0, sign2 = 1, sign1 = 0, sign1Hi = 0 } = {}) => {
    plain();
    ctx.fillStyle = C.floor; ctx.fillRect(-300, FLOOR, JX + 300, 900);
    K.fbJamb(JX, { bot: FLOOR });
    ctx.fillStyle = '#D6CCB8'; ctx.fillRect(JX + 110, FLOOR, W, 900); ctx.fillStyle = '#DCD6CB'; ctx.fillRect(JX, FLOOR, 110, 900);
    if (jambGlow > 0) { ctx.save(); ctx.globalAlpha = clamp(jambGlow); rr(JX - 12, -300, 120, FLOOR + 300, 10); ctx.lineWidth = 30; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 16; ctx.strokeStyle = C.yellow; ctx.stroke(); ctx.restore(); }
    K.dwSign('ROOM 2 / 55', 860, 450, 30, sign2);
    K.dwSign('ROOM 1', 110, 600, 30, sign1, sign1Hi);
  };
  const hero = (x, o = {}) => K.man({ x, y: HERO.y + (o.dy || 0), s: HERO.s, step: o.step ?? STEP, look: o.look ?? 0.6, eyes: o.eyes || 'n', mouth: o.mouth || 'flat', brow: o.brow ?? 0.8,
    armL: o.armL || { e: [190, 20], h: [150, 150] }, arm: o.arm || { e: [200, -10], h: [230, 120] }, sit: o.sit });
  const cloud = (hx, { sc = 1, t = 0, icon = 'mug', ghost = 0, wipe = WIPE, dy = 0 } = {}) =>
    K.dwThought(hx + CLOUD.dx, CLOUD.y + dy, CLOUD.s, { sc, t, tx: hx, ty: HERO.y - 400 * HERO.s, wipeX: wipe, icon, ghost });
  const hookPills = (a = 1, { tag = 1 } = {}) => {
    K.pill('55 ROOMS', 250, 600, 52, C.yellow, C.ink, tag * a);
    K.abPill('A', 'YES', PA[0], PA[1], PS, { sc: a }); K.abPill('B', 'NO', PB[0], PB[1], PS, { sc: a });
  };
  // the exact frame-1 picture (also the loop's last frame)
  const hookScene = (t, { pills = 1, glow = 0 } = {}) => { rooms({ jambGlow: glow }); hero(HERO.x); cloud(HERO.x, { t }); hookPills(pills); };

  // ── 1 · HOOK "What happens when you walk into a room and forget why?" ──
  {
    const wa = Wd('walk', 0), ro = Wd('room', 0), fo = Wd('forget', 0);
    add({ id: 'S01', at: 0, cam: HOOK_CAM, zoom: 0.06, note: 'FRAME 1 = hook: two rooms split by a white door jamb, hero frozen mid-step across it, his thought cloud (coffee mug) wiped to blank where it crosses the jamb line (paper bits peeling off), "55 ROOMS" tag, ROOM 2 / 55 sign, A YES / B NO pills, all from frame 0; small step bob on "walk"; jamb flashes yellow on "room"; on "forget" the rest of the mug slides past the line (cloud blank) + shock lines',
      draw(lt, d, t) {
        rooms({ jambGlow: blip(lt, ro, 0.5) });
        const bob = -14 * blip(lt, wa, 0.3);
        K.man({ x: HERO.x, y: HERO.y + bob, s: HERO.s, step: STEP, look: 0.6, eyes: lt > fo ? 'wide' : 'n', mouth: lt > fo ? 'o' : 'flat', brow: lt > fo ? 1 : 0.8, armL: { e: [190, 20], h: [150, 150] }, arm: { e: [200, -10], h: [230, 120] } });
        const slide = eio(seg(lt, fo - 0.1, fo + 0.35)) * 130;
        K.dwThought(HERO.x + CLOUD.dx, CLOUD.y, CLOUD.s, { t, tx: HERO.x, ty: HERO.y - 400 * HERO.s, wipeX: WIPE - slide, icon: 'mug' });
        if (lt > fo) K.shakeLines(HERO.x, HERO.y - 350 * HERO.s + 20, 112, 50, t, out(lt, fo + 0.5, 0.3), 10);
        hookPills(1);
      } });
    cue(0.0, 'sparkle', { dur: 0.5, gain: 0.3 }); cue(wa, 'tock', { gain: 0.4 }); cue(ro, 'pop', { gain: 0.4 }); cue(fo, 'zip', { gain: 0.45 });
  }

  // ── 2a · "Scientists built fifty-five virtual rooms to test it." ──
  {
    const st = 3.52, bu = Wd('built', 1) - st, ff = Wd('fifty', 1) - st, vi = Wd('virtual', 1) - st, ro = Wd('rooms', 1) - st, te = Wd('test', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.1, note: 'a monitor with a top-down map of little rooms (first rooms already there at the cut) building in one by one from "built" to "rooms" (55 rooms, door gaps in yellow, a table in each); "55 ROOMS" pill on "fifty-five"; VIRTUAL tag on "virtual"; on "test" a hero dot starts walking the room path',
      draw(lt, d, t) {
        plain();
        const p = lerp(0.45, 1, eio(seg(lt, bu, ro + 0.3)));
        const walk = lt > te ? 0.02 + 0.2 * seg(lt, te, d) : null;
        K.dwRoomMap(540, 640, 780, 800, { p, walk, t });
        K.pill('55 ROOMS', 540, 175, 62, C.yellow, C.ink, pop(lt, ff));
        K.tag('VIRTUAL', 860, 1120, 880, 1000, 46, pop(lt, vi));
      } });
    cue(st, 'whoosh'); cue(st + bu, 'slide', { dur: ro - bu, gain: 0.3 }); cue(st + ff, 'pop', { gain: 0.65 }); cue(st + vi, 'pop', { gain: 0.45 }); cue(st + te, 'tock', { gain: 0.4 });
  }

  // ── 2b · GUESS "Does going back help? Yes or no?" ──
  {
    const st = at('does', 1), ba = Wd('back', 1) - st, he = Wd('help', 1) - st, ye = Wd('yes', 1) - st, no = Wd('no', 1) - st;
    const HX = 800;
    add({ id: 'S03', at: st, cam: [540, 800], zoom: 0.06, note: 'GUESS: same two rooms, the hero already in room 2 (on screen at the cut) with a blank cloud, looking back at the jamb; ROOM 1 sign; on "back" a yellow arrow curves back into room 1; "?" on "help"; pill A YES pops on "Yes", pill B NO on "no" (frame-1 pill spots)',
      draw(lt, d, t) {
        rooms({ sign1: 1, sign2: 0 });
        hero(HX, { step: 0, look: -0.7, brow: 0.6, mouth: 'flat' });
        cloud(HX, { t, icon: null, dx: 0 });
        curveArrow(660, 330, 880, 120, eio(seg(lt, ba - 0.05, ba + 0.35)));
        bigText('?', 500, 650, 150 * pop(lt, he), C.yellow, 0.12);
        K.abPill('A', 'YES', PA[0], PA[1], PS, { sc: pop(lt, ye), hi: blip(lt, ye, 0.4) });
        K.abPill('B', 'NO', PB[0], PB[1], PS, { sc: pop(lt, no), hi: blip(lt, no, 0.4) });
      } });
    cue(st, 'whoosh'); cue(st + ba, 'slide', { dur: 0.4, gain: 0.35 }); cue(st + he, 'boing', { gain: 0.35 }); cue(st + ye, 'pop', { gain: 0.65 }); cue(st + no, 'pop', { gain: 0.65 });
  }

  // ── carrying a box ──
  const HOLD = { e: [175, 40], h: [80, 40] };
  const carrier = (x, y, s, step, o = {}) => {
    K.man({ x, y, s, step, look: o.look ?? 0.6, eyes: 'n', mouth: 'smile', brow: 0.2, arm: HOLD, armL: HOLD });
    K.dwBox(x, y + 40 * s + (o.boxDy || 0), s * 1.05);
  };
  const stride = (u, n) => 0.3 * (0.5 - 0.5 * Math.cos(u * Math.PI * 2 * n));

  // ── 3a · "People carried objects through a doorway," ──
  {
    const st = cut(2), ca = Wd('carried', 2) - st, ob = Wd('objects', 2) - st, dw = Wd('doorway', 2) - st;
    add({ id: 'S04', at: st, cam: [560, 820], zoom: 0.08, note: 'the two rooms: the hero carrying a cardboard box (on screen at the cut) walks from room 1 across the jamb into room 2; box hop + OBJECT tag on "objects"; jamb flashes yellow + DOORWAY tag on "doorway"',
      draw(lt, d, t) {
        rooms();
        const u = seg(lt, 0, d), x = lerp(260, 820, u);
        carrier(x, HERO.y - Math.abs(Math.sin(u * Math.PI * 4)) * 10, HERO.s, stride(u, 2), { boxDy: -26 * blip(lt, ob, 0.3) });
        K.tag('OBJECT', 300, 470, x - 40, HERO.y - 20, 46, pop(lt, ob));
        if (lt > dw) { ctx.save(); ctx.globalAlpha = clamp(blip(lt, dw, 0.7) + 0.4 * seg(lt, dw + 0.35, dw + 0.4)); rr(JX - 12, -300, 120, FLOOR + 300, 10); ctx.lineWidth = 30; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 16; ctx.strokeStyle = C.yellow; ctx.stroke(); ctx.restore(); }
        K.tag('DOORWAY', 760, 330, JX + 70, 420, 50, pop(lt, dw));
      } });
    cue(st, 'whoosh'); cue(st + ca, 'slide', { dur: 1.2, gain: 0.25 }); cue(st + ob, 'boing', { gain: 0.4 }); cue(st + dw, 'pop', { gain: 0.55 });
  }

  // ── 3b · "or the same distance in one room." (split screen) ──
  {
    const st = at('or', 2), sa = Wd('same', 2) - st, di = Wd('distance', 2) - st, on = Wd('one', 2) - st;
    const P1 = [300, 700], P2 = [790, 1140], X0 = 120, X1 = 960, MS = 0.28;
    const panel = (y0, y1, door, fn) => {
      ctx.save(); rr(70, y0, 940, y1 - y0, 30); ctx.clip();
      ctx.fillStyle = C.bg; ctx.fillRect(70, y0, 940, y1 - y0);
      ctx.fillStyle = C.floor; ctx.fillRect(70, y1 - 30, 940, 30);
      if (door) { ctx.save(); ctx.translate(0, 0); K.fbJamb(520, { top: y0, bot: y1 - 30 }); ctx.restore(); ctx.fillStyle = '#D6CCB8'; ctx.fillRect(630, y1 - 30, 400, 30); }
      fn(); ctx.restore();
      rr(70, y0, 940, y1 - y0, 30); ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.stroke();
    };
    const dist = (y, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); const x1 = lerp(X0 + 60, X1 - 60, clamp(a));
      line([[X0 + 60, y], [x1, y]], C.ink, 20); line([[X0 + 60, y], [x1, y]], C.yellow, 9); for (const xx of [X0 + 60, x1]) { line([[xx, y - 22], [xx, y + 22]], C.ink, 14); } ctx.restore(); };
    add({ id: 'S05', at: st, cam: [540, 720], zoom: 0.06, note: 'split screen (both panels + walkers on screen at the cut): top DOORWAY lane (two rooms + jamb), bottom ONE ROOM lane (one long room), the same small hero carrying the same box walking in sync; yellow distance bars draw along both floors on "same"/"distance"; ONE ROOM label flashes on "one"',
      draw(lt, d, t) {
        plain();
        const u = seg(lt, 0, d), x = lerp(X0 + 110, X1 - 110, u), sp = stride(u, 3), bob = Math.abs(Math.sin(u * Math.PI * 6)) * 4;
        panel(P1[0], P1[1], true, () => { dist(P1[1] - 15, seg(lt, sa, di + 0.3)); carrier(x, P1[1] - 12 - 640 * MS - bob, MS, sp); });
        panel(P2[0], P2[1], false, () => { dist(P2[1] - 15, seg(lt, sa, di + 0.3)); carrier(x, P2[1] - 12 - 640 * MS - bob, MS, sp); });
        K.pill('DOORWAY', 540, 250, 40, C.ink, C.white, enter(lt));
        K.pill('ONE ROOM', 540, 745, 40, blip(lt, on, 0.5) > 0.05 ? C.yellow : C.ink, blip(lt, on, 0.5) > 0.05 ? C.ink : C.white, enter(lt) * (1 + 0.12 * blip(lt, on, 0.5)));
      } });
    cue(st, 'whoosh'); cue(st + sa, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + on, 'pop', { gain: 0.55 });
  }

  // ── 4 · RELATABLE "Ever stood at the open fridge, totally blank?" ──
  {
    const st = cut(3), sto = Wd('stood', 3) - st, op = Wd('open', 3) - st, fr = Wd('fridge', 3) - st, bl = Wd('blank', 3) - st;
    const FX = 770, FY = 760, MX = 300;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.08, note: 'kitchen: the hero facing a closed fridge (both on screen at the cut); he plants his feet on "stood"; the fridge door swings open on "open" (milk inside); on "blank" an empty thought cloud pops over him, face goes blank, three dots',
      draw(lt, d, t) {
        plain(); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1330, W + 600, 900);
        K.fridge(FX, FY, 1.12, eo(seg(lt, op, op + 0.35)), () => K.milkCarton(-40, 60, 0.6));
        const blank = lt > bl;
        K.man({ x: MX, y: 880 - 12 * blip(lt, sto, 0.3), s: 0.8, step: lt > sto ? 0 : 0.18, look: 0.75, eyes: blank ? 'n' : 'n', mouth: blank ? 'flat' : 'smile', brow: blank ? 0.9 : 0.2, arm: K.ARM.down, armL: K.ARM.down });
        K.fbThought(MX + 10, 330, 0.95, { sc: pop(lt, bl), t, tx: MX, ty: 880 - 330, text: '' });
        if (blank) { const k = pop(lt, bl + 0.1); for (let i = 0; i < 3; i++) { const a = clamp((lt - bl - 0.15 - i * 0.12) * 6); ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(MX - 50 + i * 60, 335, 14 * k, 0, 7); ctx.fillStyle = C.gumEdge; ctx.fill(); ctx.restore(); } }
        void fr;
      } });
    cue(st, 'whoosh'); cue(st + sto, 'thud', { gain: 0.35 }); cue(st + op, 'slide', { dur: 0.35, gain: 0.35 }); cue(st + bl, 'pop', { gain: 0.6 });
  }

  // ── 5 · RE-HOOK "But here's the twist: the doorway made them forget more." (new scene: zoom into a big doorway) ──
  {
    const st = cut(4), tw = Wd('twist', 4) - st, dw = Wd('doorway', 4) - st, fo = Wd('forget', 4) - st, mo = Wd('more', 4) - st;
    const DS = 1.0, DY = 1200;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.3, note: 'RE-HOOK, new scene: a big doorway straight on, the camera pushing hard into it; the hero (small) stepping through the opening with the box, a thought cloud showing the box (all on screen at the cut); doorway outline flashes yellow + shock lines on "twist"; DOORWAY tag on "doorway"; on "forget" the box in the cloud wipes away to blank; red FORGOT MORE pill on "more"',
      draw(lt, d, t) {
        plain(); ctx.fillStyle = C.floor; ctx.fillRect(-300, DY, W + 600, 900);
        K.fbDoorway(540, DY, DS, { open: 0.85, glow: Math.max(blip(lt, tw, 0.6), 0.5 * seg(lt, tw + 0.3, tw + 0.4)) });
        const hx = 520, hy = 880;
        K.man({ x: hx, y: hy, s: 0.48, step: 0.25, look: 0.1, eyes: lt > fo ? 'wide' : 'n', mouth: lt > fo ? 'o' : 'smile', brow: lt > fo ? 1 : 0.3, arm: HOLD, armL: HOLD });
        K.dwBox(hx, hy + 40 * 0.48, 0.5);
        const wipe = lerp(760, 360, eio(seg(lt, fo - 0.05, fo + 0.35)));
        K.dwThought(790, 440, 0.85, { t, tx: hx + 40, ty: hy - 200, wipeX: wipe, icon: 'box' });
        K.shockLines(540, 230, 160, blip(lt, tw, 0.6));
        K.tag('DOORWAY', 250, 360, 330, 520, 46, pop(lt, dw));
        K.pill('FORGOT MORE', 540, 1080, 54, C.red, C.white, pop(lt, mo));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.55 }); cue(st + dw, 'pop', { gain: 0.5 }); cue(st + fo, 'zip', { gain: 0.45 }); cue(st + mo, 'thud', { gain: 0.6 });
  }

  // ── thought lens inside the head (S08, S09) ──
  const LX = 600, LY = 600, LR = 360;
  const headLens = (lt, inner, t, { sc = 1 } = {}) => {
    K.heroHead(220, 1020, 1.05, { eyes: 'n', mouth: 'flat', brow: 0.7, look: 0.6 });
    for (const [u, r] of [[0.42, 24], [0.62, 34]]) { const px = lerp(300, LX - 260, u), py = lerp(880, LY + 260, u); K.lens(px, py, r * sc, 1, null); }
    K.lens(LX, LY, LR, sc, inner, '#FFF1E0');
  };

  // ── 6a · "A doorway is an event boundary:" ──
  {
    const st = cut(5), dw = Wd('doorway', 5) - st, ev = Wd('event', 5) - st, bo = Wd('boundary', 5) - st;
    add({ id: 'S08', at: st, cam: [560, 700], zoom: 0.12, note: 'inside the head: the hero\'s head bottom-left with a thought lens (on screen at the cut, ROOM 1 folder on the left, ROOM 2 folder on the right, a mini doorway between them); the mini doorway glows on "doorway"; yellow boundary line drops through it + EVENT BOUNDARY tag on "event"; the door swings shut with a thud on "boundary"',
      draw(lt, d, t) {
        plain();
        const shut = eio(seg(lt, bo - 0.05, bo + 0.2));
        headLens(lt, () => {
          ctx.fillStyle = C.floor; ctx.fillRect(-LR, 230, 2 * LR, 200);
          const bl = eo(seg(lt, ev - 0.05, ev + 0.3));
          if (bl > 0) { line([[0, -LR], [0, lerp(-LR, LR, bl)]], C.ink, 24); line([[0, -LR], [0, lerp(-LR, LR, bl)]], C.yellow, 12); }
          K.fbDoorway(0, 230, 0.42, { open: lerp(0.85, 0, shut), glow: blip(lt, dw, 0.6) });
          K.dwFolder(-200, 90, 0.62, 'ROOM 1', { rot: -0.08 });
          K.dwFolder(200, 90, 0.62, 'ROOM 2', { rot: 0.08 });
        }, t, { sc: enter(lt) });
        K.tag('EVENT BOUNDARY', 600, 1120, LX, LY + LR - 20, 46, pop(lt, ev));
      } });
    cue(st, 'whoosh'); cue(st + dw, 'pop', { gain: 0.5 }); cue(st + ev, 'slide', { dur: 0.3, gain: 0.35 }); cue(st + ev + 0.05, 'pop', { gain: 0.5 }); cue(st + bo, 'slam', { gain: 0.55 });
  }

  // ── 6b · "new chapter, old one filed away." ──
  {
    const st = at('new', 5), ne = Wd('new', 5) - st, ch = Wd('chapter', 5) - st, ol = Wd('old', 5) - st, fi = Wd('filed', 5) - st, aw = Wd('away', 5) - st;
    add({ id: 'S09', at: st, cam: [600, 640], zoom: 0.12, note: 'closer in the lens (on screen at the cut: filing cabinet with its drawer open on the left, ROOM 1 folder above it, shut mini door on the right); ROOM 2 folder pops bright yellow and opens on "new"/"chapter"; ROOM 1 folder wobbles on "old", drops into the drawer on "filed", drawer slams shut on "away"; cabinet label "event boundary (Radvansky, 2011)" (rewatch)',
      draw(lt, d, t) {
        plain();
        headLens(lt, () => {
          ctx.fillStyle = C.floor; ctx.fillRect(-LR, 250, 2 * LR, 200);
          K.fbDoorway(220, 250, 0.4, { open: 0 });
          const shut = eio(seg(lt, aw, aw + 0.18));
          const slot = K.dwCabinet(-170, 60, 0.62, { open: 1 - shut, label: 'event boundary\n(Radvansky, 2011)' });
          const drop = eio(seg(lt, fi - 0.05, fi + 0.3));
          if (drop < 1) K.dwFolder(lerp(-150, slot[0] - LX + 0, drop), lerp(-200, slot[1] - LY + 70, drop) + Math.sin(lt * 30) * 6 * blip(lt, ol, 0.4), 0.55, 'ROOM 1', { rot: lerp(-0.1, 0, drop), sc: lerp(1, 0.7, drop) });
          K.dwFolder(200, -120, 0.62, 'ROOM 2', { rot: 0.06, sc: lt > ne ? 1 + 0.15 * blip(lt, ne, 0.4) : 1, col: lt > ne ? C.yellow : undefined, open: eo(seg(lt, ch, ch + 0.3)) });
        }, t);
        K.pill('NEW', 830, 330, 40, C.yellow, C.ink, pop(lt, ne));
        K.pill('event boundary (Radvansky, 2011)', 670, 1060, 30, C.ink, C.white, enter(lt));
      } });
    cue(st, 'whoosh'); cue(st + ne, 'pop', { gain: 0.6 }); cue(st + ch, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + fi, 'slide', { dur: 0.3, gain: 0.35 }); cue(st + aw, 'slam', { gain: 0.6 });
  }

  // ── 7 · ANSWER "Going back? Nope, the first room didn't help." ──
  {
    const st = cut(6), go = Wd('going', 6) - st, np = Wd('nope', 6) - st, fr = Wd('first', 6) - st, he = Wd('help', 6) - st;
    add({ id: 'S10', at: st, cam: [540, 800], zoom: 0.06, note: 'ANSWER: the two rooms + A YES / B NO pills in the frame-1 spot (on screen at the cut); the hero walks BACK from room 2 across the jamb into room 1 with his blank cloud; check on B NO + A dims on "Nope"; COMMENT A OR B pill ~1 s (not voiced); ROOM 1 sign flashes yellow on "first room"; on "help" a dashed ghost of the mug in the cloud gets a red X: it does not come back',
      draw(lt, d, t) {
        rooms({ sign1: 1, sign1Hi: blip(lt, fr, 0.6) > 0.05 ? 1 : 0 });
        const u = eio(seg(lt, 0, np + 0.2)), x = lerp(800, 330, u);
        hero(x, { step: stride(u, 1.5), look: -0.6, brow: lt > he ? 0.9 : 0.6 });
        cloud(x, { t, icon: null, ghost: eo(seg(lt, he - 0.1, he + 0.2)) });
        if (lt > he) K.redX(x - 20, CLOUD.y, 0.17 * pop(lt, he, 0.25), 1, 0.7);
        K.abPill('A', 'YES', PA[0], PA[1], PS, { sc: enter(lt), dim: seg(lt, np, np + 0.3) });
        K.abPill('B', 'NO', PB[0], PB[1], PS, { sc: enter(lt), check: pop(lt, np, 0.3), hi: blip(lt, np, 0.45) });
        K.pill('COMMENT A OR B', 540, 1105, 34, C.ink, C.yellow, pop(lt, np + 0.3, 0.25) * out(lt, np + 1.3, 0.2));
        void go;
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.7, gain: 0.25 }); cue(st + np, 'pop', { gain: 0.8 }); cue(st + np + 0.3, 'pop', { gain: 0.3 }); cue(st + fr, 'pop', { gain: 0.4 }); cue(st + he, 'slam', { gain: 0.4 });
  }

  // ── 8 · "Same result in real rooms." ──
  {
    const st = cut(7), sa = Wd('same', 7) - st, re = Wd('result', 7) - st, rl = Wd('real', 7) - st;
    add({ id: 'S11', at: st, cam: [540, 820], zoom: 0.08, note: 'a real room (window, picture, plant) with a door frame on the left and a table of cardboard boxes on the right; the hero with a box walking in (all on screen at the cut); his thought cloud (box) pops and wipes blank on "same"; check + SAME RESULT tag on "result"; REAL ROOM tag on the window on "real"',
      draw(lt, d, t) {
        K.room();
        ctx.fillStyle = C.floor; ctx.fillRect(-300, 1330, W + 600, 900);
        K.fbJamb(20, { side: -1, bot: 1330 });
        rr(600, 1010, 380, 30, 8); ctx.fillStyle = '#B5653F'; ctx.fill(); for (const lx of [620, 940]) { rr(lx, 1030, 22, 300, 6); ctx.fillStyle = '#9A5333'; ctx.fill(); }
        K.dwBox(700, 935, 0.7); K.dwBox(870, 935, 0.7, 0, eo(seg(lt, re, re + 0.3)));
        const u = seg(lt, 0, d), x = lerp(260, 400, u);
        carrier(x, 900, 0.75, stride(u, 1.5));
        K.dwThought(x + 20, 360, 0.85, { sc: pop(lt, 0.03, 0.25), t, tx: x, ty: 900 - 300, wipeX: lerp(x + 180, x - 140, eio(seg(lt, sa, sa + 0.4))), icon: 'box' });
        K.tag('REAL ROOM', 780, 520, 780, 430, 44, pop(lt, rl));
        if (lt > re) K.checkMark(870, 780, 0.9, pop(lt, re));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + sa, 'zip', { gain: 0.4 }); cue(st + re, 'pop', { gain: 0.6 }); cue(st + rl, 'pop', { gain: 0.45 });
  }

  // ── 9a · TEASE "Next Body File: sitting all day, the 'silent killer.'" (starts ON the word "Next") ──
  const badge = (x, y, sc, size = 50) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = Wd('next', 8), nx = 0.03, bo = Wd('body', 8) - st, si = Wd('sitting', 8) - st, al = Wd('all', 8) - st, sl = Wd("'silent", 8) - st;
    add({ id: 'S12', at: st, cam: [540, 720], zoom: 0.08, note: 'tease (cut ON "Next", nothing of it before): an empty office chair (on screen at the cut) + yellow NEXT pill; BODY FILES badge on "Body"; chair bounces on "sitting"; wall clock hands race on "all day"; ink quote pill \'silent killer\' (NHS) on "silent" (no fear visuals, no hero in the chair)',
      draw(lt, d, t) {
        plain(); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1200, W + 600, 900);
        K.dwChair(560, 860 - 24 * blip(lt, si, 0.3), 1.15);
        const hr = 9 + (lt > al ? Math.min(8, (lt - al) * 6) : 0);
        K.wallClock(220, 560, 90, { hour: hr, from: lt > al ? 9 : -1, sc: enter(lt) });
        K.pill('ALL DAY', 220, 720, 40, C.ink, C.white, pop(lt, al));
        K.pill('NEXT', 540, 220, 64, C.yellow, C.ink, pop(lt, nx, 0.25));
        badge(540, 340, pop(lt, bo), 44);
        K.pill('‘silent killer’ (NHS)', 600, 1100, 40, C.ink, C.white, pop(lt, sl));
      } });
    cue(st, 'whoosh'); cue(st + nx, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.45 }); cue(st + si, 'boing', { gain: 0.35 }); cue(st + al, 'tock', { gain: 0.45 }); cue(st + sl, 'pop', { gain: 0.45 });
  }

  // ── 9b · LOOP "Now get up... wait, why?" (back into the frame-1 set; ends exactly on frame 1) ──
  {
    const st = at('now', 8), ge = Wd('get', 8) - st, up = Wd('up', 8) - st, wa = Wd('wait', 8) - st, wh = Wd('why', 8) - st, Z = 0;
    const CHX = 250, SEAT = FLOOR - 0.85 * 250 + 40;
    add({ id: 'S13', at: st, cam: HOOK_CAM, zoom: Z, note: 'LOOP + END CARD: the frame-1 rooms, the hero sitting in the office chair in room 1 (on screen at the cut); he springs up on "get" (the chair rolls off left), his mug cloud pops on "up", he walks into the jamb and freezes mid-step by "wait"; the mug wipes blank as the cloud crosses the jamb line; shock lines on "why"; 55 ROOMS tag + YES / NO pills pop back in after "why" so the last frame = frame 1 (same camera scale and positions); the camera tilts down from a raised start (chair above the caption) to the exact frame-1 view (no punch on frame 1, no push in S13, so the last frame = frame 1); end card from ~32.45 s: small chair badge + NEXT top right, BODY FILES + FOLLOW top left',
      draw(lt, d, t) {
        const tilt = -230 * (1 - eio(seg(lt, ge, wa + 0.3)));   // starts tilted up (chair above the caption), tilts down to the exact frame-1 view
        ctx.save(); ctx.translate(0, tilt);
        rooms();
        const upT = seg(lt, ge, ge + 0.2), walkU = eio(seg(lt, ge + 0.25, wa));
        const cx = lerp(CHX, -400, eio(seg(lt, ge + 0.05, ge + 0.6)));
        if (cx > -350) K.dwChair(cx, SEAT, 0.85, -0.2 * seg(lt, ge, ge + 0.6));
        if (lt < ge) K.man({ x: CHX, y: SEAT - 0.85 * 200, s: 0.85, sit: true, look: 0.3, eyes: 'n', mouth: 'smile', brow: 0.2, arm: K.ARM.down, armL: K.ARM.down });
        else {
          const x = lerp(CHX, HERO.x, walkU), hop = -40 * Math.sin(Math.PI * upT);
          const frz = lt > wa;
          hero(x, { dy: hop, step: STEP * (0.5 - 0.5 * Math.cos(walkU * Math.PI * 3)), eyes: lt > wh && lt < wh + 0.6 ? 'wide' : 'n', mouth: frz ? (lt > wh && lt < wh + 0.6 ? 'o' : 'flat') : 'smile', brow: frz ? 0.8 : 0.3 });
          if (lt > up) cloud(x, { t, sc: pop(lt, up, 0.25) });
          if (lt > wh) K.shakeLines(x, HERO.y - 350 * HERO.s + 20, 112, 50, t, blip(lt, wh, 0.6), 10);
        }
        hookPills(pop(lt, wh + 0.35, 0.3));
        ctx.restore();
        const k = (1 + 0.13 * (1 - eo(clamp(lt / 0.32)))) * (1 + Z * eio(clamp(lt / d)));
        ctx.save(); ctx.translate(HOOK_CAM[0], HOOK_CAM[1]); ctx.scale(1 / k, 1 / k); ctx.translate(-HOOK_CAM[0], -HOOK_CAM[1]);
        K.dwChairBadge(890, 190, 0.55, pop(lt, 1.5, 0.3), t);
        K.pill('NEXT', 890, 315, 36, C.yellow, C.ink, pop(lt, 1.55, 0.3));
        badge(200, 150, pop(lt, 1.5, 0.3), 34);
        K.followPill(200, 245, pop(lt, 1.7), t, 38);
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + 1.5, 'pop', { gain: 0.4 }); cue(st + 1.7, 'pop', { gain: 0.5 }); cue(st + ge, 'boing', { gain: 0.45 }); cue(st + ge + 0.1, 'zip', { gain: 0.35 });
    cue(st + up, 'pop', { gain: 0.45 }); cue(st + wa, 'tock', { gain: 0.45 }); cue(st + wh, 'zip', { gain: 0.4 }); cue(st + wh + 0.35, 'pop', { gain: 0.35 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES, loop: true };
}
