// kit-extras for the inside-out style. Paste the blocks you need into src/core/kit.js (they use kit.js internals:
// ctx, C, lib helpers, room(), pill(), and head() from the CHARACTER section).
//
// 1) PATCH for head(o) in kit.js: adds `tired` 0..1 to man()/heroHead() (heavy lids + eye bags).
//    Insert just before the nose line `ctx.beginPath(); ctx.moveTo(4, 26); ...` inside head():
/*
  if (o.tired > 0) {
    const td = clamp(o.tired);
    for (const sd of [-1, 1]) {
      ctx.save(); ctx.globalAlpha = 0.35 + 0.65 * td; ctx.lineCap = 'round'; ctx.strokeStyle = C.skinShade; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.arc(sd * 40, 12, 20, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
      if (td > 0.5) { ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(sd * 40, 16, 24, 0.28 * Math.PI, 0.72 * Math.PI); ctx.stroke(); }
      ctx.restore();
      if (o.eyes !== 'closed') {
        const top = o.eyes === 'wide' ? -24 : -12, h = (o.eyes === 'wide' ? 12 : 6) + td * (o.eyes === 'wide' ? 16 : 10);
        rr(sd * 40 - 28, top - 6, 56, h + 6, 6); ctx.fillStyle = C.skin; ctx.fill();
        line([[sd * 40 - 20, top + h], [sd * 40 + 20, top + h]], C.ink, 6);
      }
    }
  }
*/
// 1b) PATCH for redX in kit.js: optional 5th arg `thin` (stroke width multiplier) so the object under the X stays readable:
//   export function redX(x, y, s, a = 1, thin = 1) { ... [[96 * thin, C.ink], [72 * thin, C.red]] ... }
//
// 2) Components (append to the end of kit.js). First used in 2026-11-08 body "11 days without sleep".
// heroHead · bed · zzz · nightRoom · brain · fuelGauge · fumes · battery · ghost · bubble · tangle · magnet · filesBadge · followPill

// ═════════════════════════ SLEEP SET (2026-11-08 "11 days without sleep") ═════════════════════════
const WOOD = '#B5653F', WOOD_D = '#9A5333', BLANKET = '#BFE3F2', BLANKET_D = '#9DCBE0', RED_D = '#A81E2D', SMOKE = '#C9C2B5';

/** just the hero's head (same drawing as man()), face centre at (x, y). rot tilts it (-PI/2 = lying, top to the left).
 *  o = the man() face options: eyes, mouth, brow, smirk, frown, look, tired */
export function heroHead(x, y, s, o = {}, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.translate(0, 338); head(o); ctx.restore();
}

/** side-view bed: headboard on the left, pillow, blanket. Origin = mattress top centre, ~800 px wide at s = 1.
 *  sleeper: face options for the hero lying in it (null = empty bed). breathe 0..1 lifts the blanket */
export function bed(x, y, s, { sleeper = null, breathe = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const lx of [-380, 350]) { rr(lx, 60, 30, 130, 8); ctx.fillStyle = WOOD_D; ctx.fill(); }
  rr(-420, -300, 60, 490, 22); ctx.fillStyle = WOOD; ctx.fill(); rr(-420, -300, 22, 490, [22, 0, 0, 22]); ctx.fillStyle = WOOD_D; ctx.fill();
  rr(370, -90, 40, 280, 16); ctx.fillStyle = WOOD; ctx.fill();
  rr(-370, -10, 760, 100, 24); ctx.fillStyle = C.white; ctx.fill(); rr(-370, 60, 760, 30, [0, 0, 24, 24]); ctx.fillStyle = C.gumEdge; ctx.fill();
  rr(-355, -95, 200, 90, 40); ctx.fillStyle = C.white; ctx.fill(); ell(-280, -70, 60, 16, C.gum);
  if (sleeper) heroHead(-215, -95, 0.62, sleeper, -Math.PI / 2 + 0.12);
  const b = breathe * 14;
  ctx.beginPath(); ctx.moveTo(-170, 40); ctx.lineTo(-170, -40); ctx.bezierCurveTo(-120, -120 - b, 120, -120 - b, 200, -60); ctx.bezierCurveTo(300, -50, 370, -40, 395, -20); ctx.lineTo(395, 60); ctx.closePath();
  ctx.fillStyle = BLANKET; ctx.fill();
  rr(-170, -48, 60, 108, [20, 0, 0, 20]); ctx.fillStyle = C.white; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-110, 60); ctx.lineTo(395, 60); ctx.lineTo(395, 30); ctx.lineTo(-110, 30); ctx.closePath(); ctx.fillStyle = BLANKET_D; ctx.fill();
  ctx.restore();
}

/** floating "Z z z" (sleep). a = alpha, t = film time */
export function zzz(x, y, t, a = 1, size = 90) {
  if (a <= 0) return;
  for (let i = 0; i < 3; i++) {
    const ph = (t * 0.7 + i / 3) % 1;
    ctx.save(); ctx.globalAlpha = a * Math.sin(ph * Math.PI);
    ctx.font = `900 ${size * (0.55 + ph * 0.5)}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    ctx.lineWidth = size * 0.14; ctx.strokeStyle = C.ink; ctx.strokeText('Z', x + ph * 90, y - ph * 200); ctx.fillStyle = C.white; ctx.fillText('Z', x + ph * 90, y - ph * 200);
    ctx.restore();
  }
}

/** night version of room(): dimmed walls, dark window with a moon */
export function nightRoom() {
  room();
  ctx.save(); ctx.globalAlpha = 0.55; fillAll(C.navy); ctx.restore();
  rr(622, 252, 316, 396, 12); ctx.fillStyle = C.navy; ctx.fill();
  circle(860, 340, 44, C.gum); circle(880, 326, 40, C.navy);
  for (const [sx, sy] of [[680, 300], [720, 560], [880, 520], [660, 470]]) circle(sx, sy, 5, C.gum);
  ctx.fillStyle = '#6E7A86'; ctx.fillRect(772, 252, 14, 396); ctx.fillRect(622, 442, 316, 14);
}

/** flat side-view brain (pink, darker rim, folds, highlight). wob 0..1 = jiggle, t = film time */
export function brain(x, y, s, { t = 0, wob = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 + Math.sin(t * 9) * 0.02 * wob), s * (1 - Math.sin(t * 9) * 0.02 * wob));
  rr(20, 70, 56, 170, 26); ctx.fillStyle = C.pinkDark; ctx.fill();
  ell(150, 120, 90, 58, C.pinkDark); ell(146, 112, 80, 48, C.pink);
  const B = [[-170, -10, 110], [-90, -110, 120], [40, -130, 125], [160, -50, 115], [120, 50, 105], [0, 40, 120], [-130, 60, 100]];
  for (const [bx, by, r] of B) circle(bx, by, r + 12, C.pinkDark);
  for (const [bx, by, r] of B) circle(bx, by, r, C.pink);
  ctx.strokeStyle = C.pinkDark; ctx.lineWidth = 11; ctx.lineCap = 'round';
  const sq = (pts) => { ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 4) ctx.quadraticCurveTo(pts[i], pts[i + 1], pts[i + 2], pts[i + 3]); ctx.stroke(); };
  sq([-200, -20, -170, -70, -120, -40, -80, -10, -40, -60]);
  sq([-90, -170, -60, -120, -20, -150, 20, -180, 60, -130]);
  sq([60, -70, 110, -40, 150, -90, 190, -130, 220, -60]);
  sq([-150, 60, -110, 20, -60, 70, -20, 110, 30, 60]);
  sq([60, 20, 100, 60, 150, 20, 180, 0, 200, 40]);
  for (let k = 0; k < 3; k++) line([[125 + k * 18, 92], [125 + k * 18, 145]], C.pinkDark, 6);
  ell(-90, -150, 50, 22, C.pinkLight, -0.3); ell(30, -190, 34, 14, C.pinkLight, -0.1);
  ctx.restore();
}

/** fuel gauge dial (graphic: white face, ink rim). level 0 (E, red zone) .. 1 (F) */
export function fuelGauge(x, y, s, level) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.arc(0, 0, 170, Math.PI, TAU); ctx.lineTo(170, 40); ctx.lineTo(-170, 40); ctx.closePath(); ctx.fillStyle = C.ink; ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0, 145, Math.PI, TAU); ctx.lineTo(145, 20); ctx.lineTo(-145, 20); ctx.closePath(); ctx.fillStyle = C.white; ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0, 118, Math.PI, Math.PI * 1.28); ctx.strokeStyle = C.red; ctx.lineWidth = 26; ctx.lineCap = 'butt'; ctx.stroke();
  for (let i = 0; i <= 4; i++) { const a = Math.PI + i * Math.PI / 4; line([[Math.cos(a) * 100, Math.sin(a) * 100], [Math.cos(a) * 132, Math.sin(a) * 132]], C.ink, 9); }
  ctx.fillStyle = C.ink; ctx.font = '900 50px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('E', -98, -14); ctx.fillText('F', 98, -14);
  ctx.save(); ctx.rotate(Math.PI + clamp(level) * Math.PI); rr(-8, -9, 125, 18, 9); ctx.fillStyle = C.red; ctx.fill(); ctx.restore();
  circle(0, 0, 20, C.ink);
  ctx.restore();
}

/** grey fume puffs rising from (x, y). a = alpha */
export function fumes(x, y, t, a = 1) {
  if (a <= 0) return;
  for (let i = 0; i < 6; i++) {
    const ph = (t * 0.55 + i / 6) % 1;
    ctx.save(); ctx.globalAlpha = a * (1 - ph) * 0.9;
    circle(x + Math.sin(ph * 5 + i) * 40 + (rnd(i) - 0.5) * 120, y - ph * 320, 26 + ph * 50, SMOKE);
    ctx.restore();
  }
}

/** battery (graphic). level 0..1: cells fill yellow, red when low */
export function battery(x, y, s, level) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-170, -90, 340, 180, 30); ctx.fillStyle = C.ink; ctx.fill(); rr(170, -40, 34, 80, [0, 14, 14, 0]); ctx.fill();
  rr(-148, -68, 296, 136, 16); ctx.fillStyle = C.white; ctx.fill();
  const lv = clamp(level), col = lv < 0.26 ? C.red : C.yellow;
  for (let i = 0; i < 4; i++) { const f = clamp(lv * 4 - i); if (f > 0) { rr(-134 + i * 69, -54, 60 * f, 108, 10); ctx.fillStyle = col; ctx.fill(); } }
  ctx.restore();
}

/** faint hallucination "ghost": wobbly white blob with dot eyes. a = alpha (keep it faint, 0.3-0.6) */
export function ghost(x, y, s, a, t = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y + Math.sin(t * 2.4 + x) * 14); ctx.scale(s, s); ctx.rotate(Math.sin(t * 1.7 + y) * 0.08);
  const path = () => { ctx.beginPath(); ctx.arc(0, -40, 90, Math.PI, TAU); ctx.lineTo(90, 90);
    for (let i = 0; i < 4; i++) { const x0 = 90 - i * 45; ctx.quadraticCurveTo(x0 - 22, 90 + 26 * Math.sin(t * 6 + i * 1.7), x0 - 45, 90); } ctx.closePath(); };
  ctx.globalAlpha = a * 0.75; path(); ctx.fillStyle = C.white; ctx.fill();
  ctx.globalAlpha = a; ctx.setLineDash([18, 16]); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; path(); ctx.stroke(); ctx.setLineDash([]);
  ell(-30, -40, 12, 18, C.ink); ell(30, -40, 12, 18, C.ink); ell(0, 10, 14, 18, C.ink);
  ctx.restore();
}

/** white speech bubble (graphic), tail toward (tx, ty) */
export function bubble(x, y, w, h, tx, ty, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  const shape = () => { rr(-w / 2, -h / 2, w, h, 60); };
  const tail = () => { ctx.beginPath(); ctx.moveTo(-50, h / 2 - 10); ctx.lineTo((tx - x) / sc, (ty - y) / sc); ctx.lineTo(30, h / 2 - 10); ctx.closePath(); };
  ctx.lineJoin = 'round'; ctx.lineWidth = 20; ctx.strokeStyle = C.ink; shape(); ctx.stroke(); tail(); ctx.stroke();
  ctx.fillStyle = C.white; shape(); ctx.fill(); tail(); ctx.fill();
  ctx.restore();
}
/** tangled scribble (a "tongue twister" knot). p 0..1 = how much of it is drawn */
export function tangle(x, y, s, p, col = C.ink) {
  if (p <= 0) return;
  const pts = [], n = 120;
  for (let i = 0; i <= n * clamp(p); i++) { const u = i / n; pts.push([x + s * (lerp(-170, 170, u) + 55 * Math.cos(u * TAU * 4.5)), y + s * (48 * Math.sin(u * TAU * 4.5) + 18 * Math.sin(u * TAU * 1.3))]); }
  if (pts.length > 1) line(pts, col, 13 * s);
}

/** horseshoe magnet (red, darker shade, silver tips). Opening points up at rot = 0 */
export function magnet(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.lineCap = 'butt';
  const U = () => { ctx.beginPath(); ctx.moveTo(-110, -110); ctx.lineTo(-110, 0); ctx.arc(0, 0, 110, Math.PI, 0, true); ctx.lineTo(110, -110); };
  U(); ctx.strokeStyle = RED_D; ctx.lineWidth = 104; ctx.stroke();
  U(); ctx.strokeStyle = C.red; ctx.lineWidth = 84; ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, 128, Math.PI * 0.62, Math.PI * 0.9); ctx.strokeStyle = C.pinkLight; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.stroke();
  for (const sd of [-1, 1]) { rr(sd * 110 - 52, -210, 104, 96, 8); ctx.fillStyle = C.gumEdge; ctx.fill(); rr(sd * 110 - 52, -210, 104, 30, [8, 8, 0, 0]); ctx.fillStyle = C.white; ctx.fill(); }
  ctx.restore();
}

/** series end-card badge: ink pill with a yellow folder icon + text ("BODY FILES #2") */
export function filesBadge(text, x, y, size, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.font = `900 ${size}px Inter`; ctx.letterSpacing = '2px';
  const tw = ctx.measureText(text).width, ic = size * 1.1, w = tw + ic + size * 1.6, h = size * 1.7;
  rr(-w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = C.ink; ctx.fill();
  const fx = -w / 2 + size * 0.6, fy = -ic * 0.38;
  rr(fx, fy - ic * 0.16, ic * 0.45, ic * 0.3, 6); ctx.fillStyle = C.yellow; ctx.fill();
  rr(fx, fy, ic, ic * 0.76, 8); ctx.fill();
  ctx.fillStyle = C.white; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(text, fx + ic + size * 0.4, size * 0.05);
  ctx.letterSpacing = '0px'; ctx.restore();
}
/** small pulsing red "+ FOLLOW" pill. sc = pop-in, t = film time */
export function followPill(x, y, sc, t, size = 46) {
  if (sc <= 0) return;
  pill('+ FOLLOW', x, y, size, C.red, C.white, sc * (1 + 0.06 * Math.max(0, Math.sin(t * 7))));
}
