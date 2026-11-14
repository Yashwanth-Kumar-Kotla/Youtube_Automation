// WHAT HAPPENS WHEN YOU GET MOTION SICKNESS?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Tone: curious, a little playful. The hero rides in the back seat of a car (side cutaway, K.carInside / K.carBody over
// K.roadScene, scenery always scrolling). The senses are little characters (K.senseBuddy). Queasy = pale green tinge, never vomit.
// Tease (stomach growls): K.growlStomach in a lens + GRRR + NEXT in the room (K.home); the hero only watches.
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
  const bob = (t) => Math.sin(t * 9) * 4 + Math.sin(t * 5.3) * 3;
  const talk = (t, k = 0) => 0.5 + 0.5 * Math.sin(t * 19 + k);
  const PHONE = { e: [205, 60], h: [70, -118] };        // phone up in front of the chest (inside the window)
  const LOW = { e: [172, 70], h: [182, 300] };          // arms hanging (hidden by the door)
  const holdPhone = (x, y) => K.phoneSmall(x + 10, y - 40, 0.27);
  // a car shot: scenery, seats, who (passenger draw fn, gets the seat {x, y, s}), body. V = { cx, cy, cs, hz, road }
  const inCar = (t, V, who, { seat = 'back', glassF = 1, glassB = 1, speed = 1 } = {}) => {
    K.roadScene(t, { horizon: V.hz, road: V.road, speed, dashes: V.cs > 2 });
    ctx.save(); ctx.translate(0, bob(t) * V.cs * 0.6);
    K.carInside(V.cx, V.cy, V.cs);
    who(K.carSeat(V.cx, V.cy, V.cs, seat));
    K.carBody(V.cx, V.cy, V.cs, { t, glassF, glassB, handles: V.cs < 2 });
    ctx.restore();
  };
  // THE room, framed wider (camera pulled back): floor line at floorY, everything scaled k around x 540
  const roomAt = (floorY, k) => {
    ctx.fillStyle = C.floor; ctx.fillRect(-300, -300, W + 600, H + 600);
    ctx.save(); ctx.translate(540, floorY); ctx.scale(k, k); ctx.translate(-540, -1560); K.home(); ctx.restore();
  };
  // views (car origin x, y, scale; horizon + road y)
  const HOOK = { cx: 80, cy: 1765, cs: 2.4, hz: 520, road: 2000 };
  const CU = { cx: -11, cy: 1820, cs: 2.9, hz: 470, road: 2100 };
  const XCU = { cx: -144, cy: 2081, cs: 3.6, hz: 400, road: 2400 };
  const WD = { cx: 600, cy: 980, cs: 1.3, hz: 560, road: 1125 };
  const V2 = { cx: 650, cy: 1010, cs: 1.15, hz: 470, road: 1150 };
  const faceY = (seat, V) => seat.y - 350 * seat.s + bob(0) * 0;   // face centre of a seated man (before bob)

  // ── 1 · HOOK: back seat of a moving car, hero glued to his phone; on "motion" the car sways, on "sickness" he turns green ──
  {
    const mo = Wd('motion', 0), si = Wd('sickness', 0);
    add({ id: 'S01', at: 0, cam: [540, 820], zoom: 0.08, note: 'car close-up (side cutaway): scenery whizzing by, hero in the back seat watching a video on his phone; on "motion" the car sways harder and he glances up; on "sickness" he goes pale green, wavy mouth, sweat drop',
      draw(lt, d, t) {
        const sw = lt > mo ? Math.sin((lt - mo) * 14) * 0.012 * Math.max(0, 1 - (lt - mo) * 0.8) : 0;
        ctx.save(); ctx.translate(540, 1200); ctx.rotate(sw); ctx.translate(-540, -1200);
        const sick = lt > si ? eo(seg(lt, si, si + 0.35)) : 0;
        inCar(t, HOOK, (P) => K.man({ ...P, sit: true, arm: PHONE, holding: holdPhone, lookY: lt > mo ? 0 : 1, look: 0,
          eyes: lt > si ? 'wide' : 'n', mouth: lt > si ? 'wavy' : 'smile', brow: lt > si ? 0.9 : 0.2, sad: sick * 0.6, green: sick, sweat: sick }), { speed: 1.2 });
        ctx.restore();
      } });
    cue(0.12, 'whoosh', { gain: 0.5 }); cue(0.2, 'slide', { dur: 1.2, gain: 0.25 }); cue(mo, 'boing', { gain: 0.45 }); cue(si, 'pop', { gain: 0.55 });
  }

  // the arguing senses: eye (left) vs inner ear (right)
  const EYE0 = [300, 730], EAR0 = [780, 730], EYE1 = [230, 730], EAR1 = [860, 730], BS2 = 0.92;
  // ── 2a · Your senses start arguing ──
  {
    const st = cut(1), se = Wd('senses', 1) - st, ar = Wd('arguing', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 600], zoom: 0.06, note: 'eye character (left) and ear character (right) pop in on "senses" and glare at each other; on "arguing" both shake and yell: speech bubbles with angry scribbles + red "!"',
      draw(lt, d, t) {
        plain();
        const arg = lt > ar, sh = arg ? 1 : 0;
        K.senseBuddy('eye', EYE0[0], EYE0[1], BS2, { t, look: 1, mood: lt > se ? 'mad' : 'n', talk: arg ? talk(t) : 0, shake: sh, sc: pop(lt, 0.02) });
        K.senseBuddy('ear', EAR0[0], EAR0[1], BS2, { t, look: -1, mood: lt > se ? 'mad' : 'n', talk: arg ? talk(t, 2) : 0, shake: sh, sc: pop(lt, 0.1) });
        K.textBubble('#scribble', EYE0[0] + 10, 330, 380, 190, EYE0[0] + 40, 545, pop(lt, ar));
        K.textBubble('#scribble', EAR0[0] - 10, 330, 380, 190, EAR0[0] - 40, 545, pop(lt, ar + 0.12));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + ar, 'boing', { gain: 0.5 }); cue(st + ar + 0.12, 'pop', { gain: 0.5 });
  }
  // ── 2b · …and your mouth gets dragged into it ──
  {
    const st = at('mouth', 1), mo = Wd('mouth', 1) - st, dr = Wd('dragged', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 620], zoom: 0.05, note: 'same argument; on "mouth" a lips character pops in small at the bottom, worried; on "dragged" it is yanked up between them (zip, streaks) while eye and ear step apart, still yelling',
      draw(lt, d, t) {
        plain();
        const sp = eio(seg(lt, dr - 0.1, dr + 0.25));
        const ex = lerp(EYE0[0], EYE1[0], sp), rx = lerp(EAR0[0], EAR1[0], sp);
        K.senseBuddy('eye', ex, EYE0[1], BS2, { t, look: lt > dr ? 0.6 : 1, mood: 'mad', talk: talk(t), shake: 0.6 });
        K.senseBuddy('ear', rx, EAR0[1], BS2, { t, look: lt > dr ? -0.6 : -1, mood: 'mad', talk: talk(t, 2), shake: 0.6 });
        K.textBubble('#scribble', ex + 40, 330, 300, 170, ex + 40, 545, 1);
        K.textBubble('#scribble', rx - 40, 330, 300, 170, rx - 40, 545, 1);
        const up = eio(seg(lt, dr, dr + 0.3)), my = lerp(1010, 760, up), ms = lerp(0.45, 0.56, up);
        if (lt > dr && lt < dr + 0.45) { ctx.save(); ctx.globalAlpha = out(lt, dr + 0.25, 0.2); for (const dx of [-60, 0, 60]) line([[540 + dx, my + 140], [540 + dx, my + 260]], C.ink, 10); ctx.restore(); }
        K.senseBuddy('mouth', 540, my, ms, { t, mood: 'shock', look: lt > dr + 0.3 ? Math.sin(t * 6) : 0, sc: pop(lt, mo) });
      } });
    cue(st, 'whoosh'); cue(st + mo, 'pop', { gain: 0.55 }); cue(st + dr, 'zip', { gain: 0.6 }); cue(st + dr + 0.3, 'boing', { gain: 0.4 });
  }

  // ── 3 · Your eyes sense movement (the eye rides in the back seat, scenery racing past: MOVING!) ──
  {
    const st = cut(2), ey = Wd('eyes', 2) - st, mv = Wd('movement', 2) - st;
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.08, note: 'car close-up: the eye character sits in the back seat, scenery racing past behind it; on "eyes" it looks back and forth fast; on "movement" a bubble "MOVING!" pops above the car',
      draw(lt, d, t) {
        inCar(t, CU, (P) => K.senseBuddy('eye', P.x, P.y - 170 * P.s * 1.4, 1.45, { t, look: lt > ey ? Math.sin(t * 9) : 0.8, mood: lt > mv ? 'shock' : 'n', talk: lt > mv ? talk(t) : 0 }), { speed: 1.6, glassB: 0 });
        K.textBubble('MOVING!', 540, 220, 520, 190, 600, 400, pop(lt, mv), 90);
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 1.2, gain: 0.3 }); cue(st + mv, 'pop', { gain: 0.7 });
  }

  // ── 4 · but your inner ear swears you're sitting still (calm, hand up: STILL!) ──
  {
    const st = cut(3), inn = Wd('inner', 3) - st, sw = Wd('swears', 3) - st, sti = Wd('still', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.08, note: 'same car close-up, scenery still racing: the ear character sits in the back seat, eyes closed, smug; "INNER EAR" pill pops on "inner"; it raises a hand on "swears"; bubble "STILL!" pops on "still"',
      draw(lt, d, t) {
        inCar(t, CU, (P) => { ctx.save(); ctx.translate(P.x, 0); ctx.scale(-1, 1);   // mirrored: the raised hand goes up on the open left side, clear of the window pillar
          K.senseBuddy('ear', 0, P.y - 170 * P.s * 1.4, 1.5, { t, mood: 'calm', arm: eio(seg(lt, sw, sw + 0.3)), talk: lt > sti ? talk(t) * 0.7 : 0 }); ctx.restore(); }, { speed: 1.6, glassB: 0 });
        K.pill('INNER EAR', 290, 215, 54, C.ink, C.white, pop(lt, inn));
        K.textBubble('STILL!', 745, 215, 380, 170, 640, 420, pop(lt, sti), 90);
      } });
    cue(st, 'whoosh'); cue(st + inn, 'pop', { gain: 0.5 }); cue(st + sw, 'slide', { dur: 0.3, gain: 0.3 }); cue(st + sti, 'thud', { gain: 0.6 });
  }

  // ── 5 · Your brain can't sort out the mixed signals ──
  {
    const st = cut(4), br = Wd('brain', 4) - st, ca = Wd('can', 4) - st, mx = Wd('mixed', 4) - st, sg = Wd('signals', 4) - st;
    const BX = 540, BY = 560, BS = 1.05;
    const E = [215, 1020], R = [865, 1020];
    const sig = (A, B, p, tang, col, k) => {   // a signal path from A to B, drawn up to p, with loops of size tang
      const pts = [], n = 60, dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l, tx = dx / l, ty = dy / l;
      for (let i = 0; i <= n * clamp(p); i++) {
        const u = i / n, env = Math.sin(Math.PI * u), a = u * Math.PI * 2 * 3 + k;
        const off = tang * 46 * env * Math.sin(a), along = tang * 34 * env * Math.cos(a);
        pts.push([A[0] + dx * u + nx * (off + 26 * Math.sin(u * Math.PI) * (k ? 1 : -1)) + tx * along, A[1] + dy * u + ny * off + ty * along]);
      }
      if (pts.length < 2) return;
      line(pts, C.ink, 26); line(pts, col, 14);
      if (p >= 1) { const [x1, y1] = pts[pts.length - 1], [x0, y0] = pts[pts.length - 4], an = Math.atan2(y1 - y0, x1 - x0);
        ctx.save(); ctx.translate(x1, y1); ctx.rotate(an); ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-38, -28); ctx.lineTo(-38, 28); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore(); }
    };
    add({ id: 'S06', at: st, cam: [540, 640], zoom: 0.07, note: 'brain character on top; small eye (bottom left) and ear (bottom right) each send a signal line up to it (blue from the eye, orange from the ear) that cross; on "can\'t" yellow "?"s pop and the brain frowns wavy; on "mixed" the lines tangle into loops; on "signals" the brain wobbles with spiral eyes',
      draw(lt, d, t) {
        plain();
        const tang = eio(seg(lt, mx, mx + 0.4));
        K.senseBuddy('eye', E[0], E[1], 0.52, { t, look: 0.6, mood: 'mad', talk: talk(t) * 0.8 });
        K.senseBuddy('ear', R[0], R[1], 0.52, { t, look: -0.6, mood: 'calm', talk: talk(t, 2) * 0.8 });
        const g = eo(seg(lt, 0.1, br + 0.35));
        sig([E[0] + 40, E[1] - 100], [BX + 120, BY + 196], g, tang, C.shirt, 0);
        sig([R[0] - 40, R[1] - 100], [BX - 120, BY + 196], g, tang, '#E0956B', 1.3);
        const wob = lt > sg ? 1 : 0;
        K.brainBuddy(BX + (wob ? Math.sin(t * 30) * 6 : 0), BY, BS, { t, look: lt > ca ? Math.sin(t * 5) : 0, mouth: lt > ca ? 'wavy' : 'smile', eyes: lt > sg ? 'spiral' : 'n', wob });
        if (lt > ca) { bigText('?', 210, 380, 140, C.yellow, -0.15, eob(seg(lt, ca, ca + 0.25)) * (1 + 0.05 * Math.sin(t * 7))); bigText('?', 880, 330, 120, C.yellow, 0.18, eob(seg(lt, ca + 0.12, ca + 0.37))); }
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: br + 0.25, gain: 0.35 }); cue(st + ca, 'boing', { gain: 0.45 }); cue(st + mx, 'sparkle', { dur: 0.45, gain: 0.3 }); cue(st + sg, 'boing', { gain: 0.35 });
  }

  // ── 6 · so you get dizzy, sweaty, and queasy (hero close-up in the car) ──
  {
    const st = cut(5), dz = Wd('dizzy', 5) - st, sw = Wd('sweaty', 5) - st, qu = Wd('queasy', 5) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.1, note: 'car close-up, hero in the back seat (phone lowered): on "dizzy" his eyes become spinning spirals and he sways; on "sweaty" sweat drops pop; on "queasy" his face turns pale green, mouth wavy',
      draw(lt, d, t) {
        const sway = lt > dz ? Math.sin(t * 4.5) * 14 : 0, g = lerp(0.25, 1, eo(seg(lt, qu, qu + 0.35)));
        inCar(t, CU, (P) => K.man({ ...P, x: P.x + sway, sit: true, arm: LOW, eyes: lt > dz ? 'spiral' : 'n', spin: t, mouth: lt > qu ? 'wavy' : 'flat',
          brow: 0.5, sad: lt > qu ? 0.8 : 0.3, green: g, sweats: lt > sw ? eob(seg(lt, sw, sw + 0.3)) : 0, ct: t }));
      } });
    cue(st, 'whoosh'); cue(st + dz, 'sparkle', { dur: 0.6, gain: 0.3 }); cue(st + sw, 'pop', { gain: 0.5 }); cue(st + qu, 'boing', { gain: 0.4 });
  }

  // ── 7 · Then the weird one: your mouth starts watering ──
  {
    const st = cut(6), we = Wd('weird', 6) - st, mo = Wd('mouth', 6) - st, wa = Wd('watering', 6) - st;
    add({ id: 'S08', at: st, cam: [540, 820], zoom: 0.1, note: 'tighter car close-up on the queasy (green) hero: on "weird" his eyes go wide and a yellow "?" pops; on "mouth" a yellow ring circles his mouth; on "watering" a drop of saliva swells at the corner of his mouth and a second one drips',
      draw(lt, d, t) {
        let ring = [0, 0];
        inCar(t, XCU, (P) => {
          const wide = lt > we && lt < wa;
          K.man({ ...P, sit: true, arm: LOW, eyes: wide ? 'wide' : 'n', mouth: lt > we && lt < mo ? 'o' : 'wavy', brow: wide ? 1 : 0.5, sad: lt > wa ? 0.8 : 0.3, green: 1,
            drool: lt > wa ? eo(seg(lt, wa, wa + 0.45)) : 0, sweats: 1, ct: t });
          ring = [P.x + 4 * P.s, P.y + (76 - 350 + 6) * P.s];
          K.hiRing(ring[0], ring[1], 58 * P.s, 34 * P.s, ringIn(lt, mo) * out(lt, wa - 0.1, 0.2));
          if (lt > wa + 0.4) { const u = ((lt - wa - 0.4) * 0.9) % 1; K.drop(P.x + 30 * P.s, P.y + (-350 + 130 + u * 110) * P.s, 0.32 * P.s, 0, Math.min(1, u * 6, (1 - u) * 4)); }
        });
        bigText('?', 860, 520, 150, C.yellow, 0.15, pop(lt, we, 0.25) * out(lt, wa, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + we, 'boing', { gain: 0.45 }); cue(st + mo, 'pop', { gain: 0.55 }); cue(st + wa, 'plop', { gain: 0.5 });
  }

  // ── 8 · way more than usual, plus a cold sweat ──
  {
    const st = cut(7), wy = Wd('way', 7) - st, us = Wd('usual', 7) - st, co = Wd('cold', 7) - st, sw = Wd('sweat', 7) - st;
    add({ id: 'S09', at: st, cam: [540, 640], zoom: 0.06, note: 'a tall level tube (left) with a dashed mark: from "way" the pale-blue level rises far past the mark (red up arrow); "USUAL" pill points at the mark on "usual"; right: the hero\'s head (green, drooling); on "cold" a snowflake pops and he shivers; on "sweat" sweat drops pop',
      draw(lt, d, t) {
        plain();
        const lv = lerp(0.22, 0.9, eio(seg(lt, wy, us + 0.1)));
        const my = K.levelTube(230, 690, 1, { level: lv, mark: 0.22, t });
        K.flowArrow(410, 560, 220, -Math.PI / 2, eo(seg(lt, wy, wy + 0.3)) * out(lt, co, 0.3), C.red, 24);
        K.pill('USUAL', 525, my, 56, C.ink, C.white, pop(lt, us));
        line([[365, my], [400, my]], C.ink, 9);
        const shiv = lt > co ? Math.sin(t * 60) * 5 : 0;
        K.heroHead(810 + shiv, 590, 1.3, { eyes: 'n', mouth: 'wavy', brow: 0.5, sad: 0.8, green: 1, drool: 1, sweats: lt > sw ? eob(seg(lt, sw, sw + 0.3)) : 0, ct: t });
        if (lt > co) { const p = eob(seg(lt, co, co + 0.3)); ctx.save(); ctx.translate(950, 330); ctx.scale(p, p); K.snowflake(0, 0, 62, C.ink, 28, t * 0.8); K.snowflake(0, 0, 62, C.sky, 14, t * 0.8); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + wy, 'bubbles', { dur: 0.7, gain: 0.4 }); cue(st + us, 'pop', { gain: 0.6 }); cue(st + co, 'sparkle', { dur: 0.4, gain: 0.35 }); cue(st + sw, 'pop', { gain: 0.5 });
  }

  // ── 9 · Kids aged two to twelve get it more than adults ──
  {
    const st = cut(8), ki = Wd('kids', 8) - st, tw = Wd('twelve', 8) - st, mo = Wd('more', 8) - st, ad = Wd('adults', 8) - st;
    add({ id: 'S10', at: st, cam: [540, 720], zoom: 0.06, note: 'plain: a kid icon (big head, orange tee) pops centre on "Kids"; yellow "2–12" pill above it on "twelve"; on "more" the kid turns queasy (green, wavy eyes, wobble marks); just before "adults" it slides left and a taller adult icon pops at right, calm and smiling',
      draw(lt, d, t) {
        plain();
        const sl = eio(seg(lt, ad - 0.35, ad)), kx = lerp(540, 320, sl), q = eo(seg(lt, mo, mo + 0.35));
        K.ageIcon(kx, 1125, 1, { kid: true, queasy: q, t, sc: pop(lt, ki - 0.05) });
        const top = K.ageIconTop(1125, 1, true);
        K.pill('2–12', kx, top - 70, 70, C.yellow, C.ink, pop(lt, tw));
        if (q > 0) { ctx.save(); ctx.globalAlpha = q; for (const sd of [-1, 1]) line([[kx + sd * 170, 600], [kx + sd * 184, 630], [kx + sd * 170, 660], [kx + sd * 184, 690], [kx + sd * 170, 720]], C.ink, 10); ctx.restore(); }
        K.ageIcon(780, 1125, 0.95, { kid: false, t, sc: pop(lt, ad) });
      } });
    cue(st, 'whoosh'); cue(st + ki, 'pop', { gain: 0.5 }); cue(st + tw, 'pop', { gain: 0.6 }); cue(st + mo, 'boing', { gain: 0.4 }); cue(st + ad - 0.3, 'slide', { dur: 0.3, gain: 0.3 }); cue(st + ad, 'pop', { gain: 0.5 });
  }

  // the four tip cards across the top (they pop + get a check when said)
  const CARDS = ['phone', 'front', 'horizon', 'window'], CX = [165, 395, 625, 855], CY = 205, CS = 0.85;
  const cards = (lt, t, shown) => CARDS.forEach((k, i) => { const [s, dn] = shown[i]; K.fixCard(k, CX[i], CY, CS, { sc: s, done: dn, t }); });
  // ── 10 · The fix? Put the phone away, sit up front ──
  {
    const st = cut(9), fx = Wd('fix', 9) - st, ph = Wd('phone', 9) - st, aw = Wd('away', 9) - st, si = Wd('sit', 9) - st, fr = Wd('front', 9) - st;
    add({ id: 'S11', at: st, cam: [540, 600], zoom: 0.03, note: 'wider car (side cutaway, both windows): queasy hero in the back with his phone; on "fix" he looks up; on "phone" a ring circles the phone + phone card pops; on "away" he lowers it out of sight, check; on "sit" he slides forward into the front seat, front-seat card pops, check on "front"',
      draw(lt, d, t) {
        const mvF = eio(seg(lt, si, si + 0.32)), hop = Math.sin(Math.PI * mvF) * 30;
        const awP = eio(seg(lt, aw, aw + 0.3)), arm = K.armPose(PHONE, LOW, awP);
        let ph0 = [0, 0];
        inCar(t, WD, (P) => {
          const F = K.carSeat(WD.cx, WD.cy, WD.cs, 'front');
          const x = lerp(P.x, F.x, mvF);
          K.man({ ...P, x, y: P.y - hop, sit: true, arm, holding: awP < 1 ? holdPhone : null, lookY: lt > fx ? 0 : 1, look: mvF > 0 && mvF < 1 ? -1 : 0, eyes: 'n',
            mouth: lt > fr ? 'smile' : 'flat', brow: lt > fx ? 0.8 : 0.3, sad: 0.5 * (1 - eio(seg(lt, fr, fr + 0.5))), green: lerp(0.8, 0.45, eio(seg(lt, aw, fr + 0.4))) });
          ph0 = [x + (PHONE.h[0] - 24) * P.s, P.y + (PHONE.h[1] - 54) * P.s];
        });
        K.hiRing(ph0[0], ph0[1] + bob(t) * WD.cs * 0.6, 74, 90, ringIn(lt, ph) * out(lt, aw, 0.2));
        cards(lt, t, [[pop(lt, ph), pop(lt, aw + 0.1, 0.3)], [pop(lt, si), pop(lt, fr + 0.1, 0.3)], [0, 0], [0, 0]]);
      } });
    cue(st, 'whoosh'); cue(st + fx, 'pop', { gain: 0.3 }); cue(st + ph, 'pop', { gain: 0.55 }); cue(st + aw, 'zip', { gain: 0.45 }); cue(st + aw + 0.1, 'pop', { gain: 0.5 });
    cue(st + si, 'slide', { dur: 0.32, gain: 0.4 }); cue(st + fr + 0.1, 'pop', { gain: 0.5 });
  }
  // ── 11 · stare at the horizon, and open a window ──
  {
    const st = cut(10), sa = Wd('stare', 10) - st, ho = Wd('horizon', 10) - st, op = Wd('open', 10) - st, wi = Wd('window', 10) - st;
    const SUN = [190, 470];
    add({ id: 'S12', at: st, cam: [540, 600], zoom: 0.04, note: 'car pulled back, hero in the front seat: on "stare" he looks ahead and a dashed sight line runs from his eye to the sun sitting on the horizon; on "horizon" a ring circles it + horizon card with check; on "open" his window glass slides down, wind lines blow in, the green leaves his face and he smiles; window card + check on "window"',
      draw(lt, d, t) {
        K.roadScene(t, { horizon: V2.hz, road: V2.road, dashes: false, treeDrop: 110,
          beforeTrees: () => { ctx.save(); ctx.beginPath(); ctx.rect(-300, -300, W + 600, V2.hz + 300); ctx.clip(); K.sun(SUN[0], SUN[1] + 20, 0.62, t); ctx.restore(); } });
        ctx.save(); ctx.translate(0, bob(t) * 0.6 * V2.cs);
        K.carInside(V2.cx, V2.cy, V2.cs);
        const P = K.carSeat(V2.cx, V2.cy, V2.cs, 'front'), gl = 1 - eio(seg(lt, op, op + 0.45)), fresh = eio(seg(lt, op + 0.2, wi + 0.3));
        K.man({ ...P, sit: true, arm: LOW, look: lt > sa ? -1 : 0, eyes: 'n', mouth: lt > op + 0.2 ? 'grin' : 'smile', brow: lt > sa ? 0.5 : 0.3, green: 0.4 * (1 - fresh) });
        K.carBody(V2.cx, V2.cy, V2.cs, { t, glassF: gl });
        const eye = [P.x - 40 * P.s - 10, P.y - 344 * P.s];
        if (lt > op + 0.15) { ctx.save(); ctx.globalAlpha = eo(seg(lt, op + 0.15, op + 0.4)); ctx.strokeStyle = C.white; ctx.lineCap = 'round'; ctx.lineWidth = 10;
          for (const [k, wy] of [[0, -320], [1, -270]]) { const x0 = V2.cx + (-520 + ((t * 260 + k * 60) % 90)) * V2.cs; ctx.beginPath(); for (let j = 0; j <= 6; j++) { const px = x0 + j * 14, py = V2.cy + wy * V2.cs + Math.sin(j * 0.9 + t * 12 + k) * 8; j ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
          ctx.restore(); }
        ctx.restore();
        const sl = eo(seg(lt, sa, sa + 0.4)) * out(lt, op, 0.25);
        if (sl > 0) { const ex = eye[0], ey = eye[1] + bob(t) * 0.6 * V2.cs, tx = lerp(ex, SUN[0] + 90, sl), ty = lerp(ey, SUN[1] + 30, sl); ctx.save(); ctx.setLineDash([18, 16]); line([[ex - 20, ey], [tx, ty]], C.ink, 8); ctx.setLineDash([]); ctx.restore(); }
        K.hiRing(SUN[0], SUN[1] - 10, 118, 82, ringIn(lt, ho) * out(lt, op + 0.3, 0.25));
        cards(lt, t, [[1, 1], [1, 1], [pop(lt, ho), pop(lt, ho + 0.2, 0.3)], [pop(lt, wi - 0.05), pop(lt, wi + 0.15, 0.3)]]);
      } });
    cue(st, 'whoosh'); cue(st + sa, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + ho, 'pop', { gain: 0.6 }); cue(st + ho + 0.2, 'pop', { gain: 0.45 });
    cue(st + op, 'slide', { dur: 0.45, gain: 0.4 }); cue(st + op + 0.2, 'whoosh', { gain: 0.35 }); cue(st + wi + 0.15, 'pop', { gain: 0.55 });
  }

  // ── 12-14 · TEASE + END CARD (room, camera pulled back): lens with the growling stomach at left, NEXT, BODY FILES; hero watches ──
  const HERO = { x: 830, y: 681, s: 0.78 }, TL = [310, 770, 215], NX = [310, 1080];
  const hero = (o) => K.man({ ...HERO, ...o });
  const teaseLens = (sc, { stom = 0, growl = 0, q = 0, t = 0 } = {}) => {
    K.lens(TL[0], TL[1], TL[2], sc, () => {
      if (q > 0) bigText('?', 0, 0, 220, C.yellow, -0.08, q);
      if (stom > 0) K.growlStomach(-6, -10, 0.78, { t, growl, sc: stom });
    }, '#FFF1E0');
  };
  {
    const st = cut(11), nx = Wd('next', 11) - st, bo = Wd('body', 11) - st, wh = Wd('what', 11) - st;
    add({ id: 'S13', at: st, cam: [540, 700], zoom: 0.05, note: 'room (wider): hero (right, back to normal, smiling) waves; a lens with a yellow "?" pops at left right away; NEXT pill pops on "Next", BODY FILES badge on "Body"; on "what" he turns to look at the lens',
      draw(lt, d, t) {
        roomAt(1165, 0.7);
        K.filesBadge('BODY FILES', 540, 130, 60, pop(lt, bo));
        const wv = eio(seg(lt, 0.05, 0.4)) * out(lt, wh - 0.4, 0.35);
        hero({ armL: K.armPose(K.ARM.down, K.ARM.wave, wv), look: lt > wh ? -1 : 0, mouth: 'smile', brow: lt > wh ? 0.8 : 0.5 });
        teaseLens(pop(lt, 0.05), { q: 1 + 0.05 * Math.sin(t * 6) });
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, pop(lt, nx));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.5 }); cue(st + nx, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.6 });
  }
  {
    const st = at('happens', 11), so = Wd('stomach', 11) - st, gr = Wd('growls', 11) - st;
    add({ id: 'S14', at: st, cam: [420, 760], zoom: 0.06, note: 'same room: in the lens the "?" swaps for a cartoon stomach with a face on "stomach"; on "growls" it shakes, rumble lines + a yellow "GRRR" pop above the lens; hero watches, curious',
      draw(lt, d, t) {
        roomAt(1165, 0.7);
        K.filesBadge('BODY FILES', 540, 130, 60, 1);
        hero({ look: -1, mouth: lt > gr ? 'o' : 'smile', brow: lt > gr ? 1 : 0.8 });
        const g = lt > gr ? eo(seg(lt, gr, gr + 0.2)) : 0;
        teaseLens(1, { q: lt < so ? 1 + 0.05 * Math.sin(t * 6) : out(lt, so, 0.12), stom: pop(lt, so), growl: g, t });
        bigText('GRRR', TL[0], 445, 110, C.yellow, -0.08, pop(lt, gr, 0.25) * (1 + 0.04 * Math.sin(t * 20)));
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, 1);
      } });
    cue(st, 'whoosh'); cue(st + so, 'pop', { gain: 0.6 }); cue(st + gr, 'bubbles', { dur: 0.8, gain: 0.5 }); cue(st + gr + 0.05, 'thud', { gain: 0.45 });
  }
  {
    const st = at('rumbles', 12), ru = Wd('rumbles', 12) - st, hu = Wd('hungry', 12) - st, cam = hu + 0.3;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.05, note: 'END CARD (room): BODY FILES badge, lens with the stomach rumbling again on "rumbles" (GRRR, rumble lines), NEXT pill; GRRR fades on "not"; on "hungry" the hero turns to camera with a warm grin and + FOLLOW pops above the lens',
      draw(lt, d, t) {
        roomAt(1165, 0.7);
        K.filesBadge('BODY FILES', 540, 130, 60, 1);
        const toCam = lt > cam;
        hero({ look: toCam ? 0 : -1, mouth: toCam ? 'grin' : 'smile', brow: toCam ? 0.5 : 0.9 });
        const g = Math.min(eo(seg(lt, ru, ru + 0.2)), out(lt, hu - 0.2, 0.4)) ;
        teaseLens(1, { stom: 1, growl: Math.max(0.15, g), t });
        bigText('GRRR', TL[0], 445, 110, C.yellow, -0.08, (lt > ru ? eob(seg(lt, ru, ru + 0.25)) : 0) * out(lt, hu - 0.3, 0.25));
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, 1);
        K.followPill(TL[0], 440, pop(lt, cam), t, 60);
      } });
    cue(st, 'whoosh'); cue(st + ru, 'bubbles', { dur: 0.9, gain: 0.5 }); cue(st + ru + 0.05, 'thud', { gain: 0.4 }); cue(st + cam, 'pop', { gain: 0.7 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES };
}
