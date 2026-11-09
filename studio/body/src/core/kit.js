// Inside Out engine: the COMPONENT ZOO. Every reusable thing on screen lives here.
// All functions draw immediately with the shared ctx, in 1080x1920 canvas pixels unless a scale is given.
import { ctx, C, W, H, TAU, lerp, clamp, rnd, rr, circle, ell, line, fillAll } from './lib.js';

// ═════════════════════════ PROPS ═════════════════════════
/** a piece of gum (pill shape). s = scale (1 = 80x52 px) */
export function gum(x, y, s, rot = 0, sx = 1, sy = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * sx, s * sy);
  rr(-40, -26, 80, 52, 24); ctx.fillStyle = C.gum; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.gumEdge; ctx.stroke();
  ell(-14, -11, 14, 6, C.white, -0.3);
  circle(14, 8, 4, '#E2DCD0'); circle(24, -4, 3, '#E2DCD0'); circle(-4, 10, 3, '#E2DCD0');
  ctx.restore();
}

/** the J-shaped stomach (flat, pink, highlight). s = scale; pulse 0..1 swells it */
function stomachPath() {
  ctx.beginPath(); ctx.moveTo(-30, -110);
  ctx.bezierCurveTo(-30, -40, -120, -20, -100, 50);
  ctx.bezierCurveTo(-80, 120, 40, 120, 90, 60);
  ctx.bezierCurveTo(120, 25, 110, -10, 95, -20);
}
export function stomach(x, y, s, pulse = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  stomachPath(); ctx.strokeStyle = C.pinkDark; ctx.lineWidth = 92 + pulse * 14; ctx.stroke();
  stomachPath(); ctx.strokeStyle = C.pink; ctx.lineWidth = 80 + pulse * 14; ctx.stroke();
  ctx.save(); ctx.translate(-8, -8); stomachPath(); ctx.strokeStyle = C.pinkLight; ctx.globalAlpha = 0.7; ctx.lineWidth = 22; ctx.stroke(); ctx.restore();
  ctx.restore();
}
/** the stomach's top opening in local units (where the esophagus joins), for a stomach drawn at (x, y, s) */
export const stomachTop = (x, y, s) => [x - 30 * s, y - 110 * s];

/** flat heart icon. beat 0..1 scales it up */
export function heart(x, y, s, beat = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 + beat * 0.12), s * (1 + beat * 0.12));
  const p = () => { ctx.beginPath(); ctx.moveTo(0, 70); ctx.bezierCurveTo(-150, -20, -90, -130, 0, -60); ctx.bezierCurveTo(90, -130, 150, -20, 0, 70); };
  p(); ctx.fillStyle = C.pinkDark; ctx.fill(); ctx.save(); ctx.translate(-6, -6); ctx.scale(0.92, 0.92); p(); ctx.fillStyle = C.red; ctx.fill(); ctx.restore();
  ell(-48, -52, 22, 12, C.pinkLight, -0.6);
  ctx.restore();
}

/** stopwatch. ang = hand angle in radians */
export function stopwatch(x, y, s, ang) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-40, -330, 80, 60, 14); ctx.fillStyle = C.watch; ctx.fill();
  ctx.save(); ctx.rotate(0.75); rr(-22, -300, 44, 46, 10); ctx.fill(); ctx.restore();
  circle(0, 0, 280, C.watch); circle(0, 0, 240, C.white);
  for (let i = 0; i < 12; i++) { ctx.save(); ctx.rotate(i * Math.PI / 6); rr(-6, -226, 12, i % 3 === 0 ? 44 : 26, 6); ctx.fillStyle = C.watch; ctx.fill(); ctx.restore(); }
  ctx.save(); ctx.rotate(ang); rr(-9, -200, 18, 220, 9); ctx.fillStyle = C.red; ctx.fill(); ctx.restore();
  circle(0, 0, 24, C.watch);
  ctx.restore();
}

/** tear-off calendar card: big number + word under it. Card is 600x680 at s = 1 */
export function calendar(x, y, s, big, small, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-300, -340, 600, 680, 46); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-300, -340, 600, 170, [46, 46, 0, 0]); ctx.fillStyle = C.red; ctx.fill(); ctx.lineWidth = 10; ctx.stroke();
  for (const bx of [-150, 150]) { rr(bx - 18, -390, 36, 100, 18); ctx.fillStyle = C.ink; ctx.fill(); }
  ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.font = '900 330px Inter'; ctx.fillText(big, 0, 170);
  ctx.font = '900 92px Inter'; ctx.letterSpacing = '4px'; ctx.fillText(small, 0, 285); ctx.letterSpacing = '0px';
  ctx.restore();
}

// ═════════════════════════ GRAPHICS ═════════════════════════
/** dark rounded label ("GUM BASE"). sc animates the pop */
export function pill(text, x, y, size, bg = C.ink, fg = C.white, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.font = `900 ${size}px Inter`; ctx.letterSpacing = '2px';
  const w = ctx.measureText(text).width + size * 1.1, h = size * 1.6;
  rr(-w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill();
  ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, size * 0.05);
  ctx.letterSpacing = '0px'; ctx.restore();
}
/** label with a pointer line down to a target point */
export function tag(text, x, y, tx, ty, size = 60, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(sc); line([[x, y], [tx, ty]], C.ink, 8); ctx.restore();
  pill(text, x, y, size, C.ink, C.white, sc);
}
/** the danger X (red, ink outline). a = alpha, thin = stroke width multiplier (0.5 = thinner X, shows what's under it) */
export function redX(x, y, s, a = 1, thin = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = a; ctx.lineCap = 'round';
  for (const [w, c] of [[96 * thin, C.ink], [72 * thin, C.red]]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(-230, -230); ctx.lineTo(230, 230); ctx.moveTo(230, -230); ctx.lineTo(-230, 230); ctx.stroke(); }
  ctx.restore();
}
/** flat red arrow pointing along ang (radians). len in px */
export function arrow(x, y, len, ang = 0, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.globalAlpha = a;
  ctx.beginPath(); ctx.moveTo(-len / 2, -28); ctx.lineTo(len / 2 - 110, -28); ctx.lineTo(len / 2 - 110, -80); ctx.lineTo(len / 2, 0);
  ctx.lineTo(len / 2 - 110, 80); ctx.lineTo(len / 2 - 110, 28); ctx.lineTo(-len / 2, 28); ctx.closePath(); ctx.fillStyle = C.red; ctx.fill();
  ctx.restore();
}
/** red warning triangle with "!" */
export function warning(x, y, s) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, -130); ctx.lineTo(140, 110); ctx.lineTo(-140, 110); ctx.closePath();
  ctx.lineJoin = 'round'; ctx.lineWidth = 40; ctx.strokeStyle = C.red; ctx.stroke(); ctx.fillStyle = C.red; ctx.fill();
  rr(-14, -60, 28, 110, 14); ctx.fillStyle = C.white; ctx.fill(); circle(0, 82, 17, C.white);
  ctx.restore();
}
/** "enzyme" chomper: pink pac-man. open = mouth angle (rad), flip = face left */
export function chomper(x, y, r, open, flip) {
  ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1, 1);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, open, TAU - open); ctx.closePath(); ctx.fillStyle = C.pink; ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = C.pinkDark; ctx.stroke(); circle(r * 0.15, -r * 0.5, r * 0.13, C.ink);
  ctx.restore();
}
/** impact burst (yellow rays) */
export function burst(x, y, s, a) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.globalAlpha = a; ctx.strokeStyle = C.yellow; ctx.lineCap = 'round'; ctx.lineWidth = 12;
  for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(Math.cos(an) * 30 * s, Math.sin(an) * 30 * s); ctx.lineTo(Math.cos(an) * 80 * s, Math.sin(an) * 80 * s); ctx.stroke(); }
  ctx.restore();
}
/** horizontal speed lines trailing left of (x, y) */
export function speedLines(x, y, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; for (let i = 0; i < 5; i++) line([[x - 80 - i * 20, y - 60 + i * 30], [x - 260 - i * 40, y - 60 + i * 30]], C.ink, 10); ctx.restore();
}
/** three "shock" strokes around a point (head reaction) */
export function shockLines(x, y, r, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  for (const an of [-2.4, -Math.PI / 2, -0.75]) line([[x + Math.cos(an) * r, y + Math.sin(an) * r], [x + Math.cos(an) * (r + 70), y + Math.sin(an) * (r + 70)]], C.ink, 14);
  ctx.restore();
}

// ═════════════════════════ BACKGROUNDS ═════════════════════════
/** (A) real world: a simple room with a window, framed picture, plant and floor */
export function room() {
  fillAll(C.bg);
  ctx.fillStyle = C.floor; ctx.fillRect(-300, 1560, W + 600, 700);
  rr(600, 230, 360, 440, 22); ctx.fillStyle = C.white; ctx.fill();
  rr(622, 252, 316, 396, 12); ctx.fillStyle = C.sky; ctx.fill();
  ell(720, 360, 70, 30, C.white); ell(770, 345, 50, 34, C.white);
  ctx.fillStyle = C.white; ctx.fillRect(772, 252, 14, 396); ctx.fillRect(622, 442, 316, 14);
  rr(110, 330, 200, 150, 10); ctx.fillStyle = C.ink; ctx.fill(); rr(124, 344, 172, 122, 4); ctx.fillStyle = '#F7D88A'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(124, 466); ctx.lineTo(190, 390); ctx.lineTo(240, 440); ctx.lineTo(270, 410); ctx.lineTo(296, 466); ctx.fillStyle = '#E0956B'; ctx.fill();
  for (const [x, y, r] of [[130, 1170, -0.5], [170, 1140, 0], [210, 1170, 0.5], [150, 1110, -0.2], [195, 1105, 0.25]]) ell(x, y, 26, 62, C.leaf, r);
  rr(110, 1200, 120, 130, 14); ctx.fillStyle = C.pot; ctx.fill();
}
/** (B) x-ray: navy film with a cyan grid and a sweeping scan line */
export function xray(t) {
  fillAll(C.navy);
  ctx.strokeStyle = C.cyan; ctx.globalAlpha = 0.07; ctx.lineWidth = 2;
  for (let x = 0; x <= W; x += 90) { ctx.beginPath(); ctx.moveTo(x, -300); ctx.lineTo(x, H + 300); ctx.stroke(); }
  for (let y = 0; y <= H; y += 90) { ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(W + 300, y); ctx.stroke(); }
  const sy = ((t * 700) % (H + 400)) - 200;
  ctx.globalAlpha = 0.1; ctx.fillStyle = C.cyan; ctx.fillRect(-300, sy, W + 600, 70);
  ctx.globalAlpha = 0.25; ctx.fillRect(-300, sy + 66, W + 600, 6); ctx.globalAlpha = 1;
}
/** (C) inside the stomach: wobbling pink wall, folds, acid pool (acid = 0..1 strength), rising bubbles */
export function insideStomach(t, acid = 1) {
  fillAll(C.stomachBg);
  for (let i = 0; i < 7; i++) circle(rnd(i) * W + Math.sin(t + i) * 20, rnd(i + 9) * H + Math.cos(t * 0.8 + i) * 20, 120 + rnd(i + 3) * 140, C.stomachBgDark);
  ctx.beginPath();
  for (let a = 0; a <= TAU + 0.01; a += 0.05) {
    const r = 1 + 0.035 * Math.sin(3 * a + t * 2) + 0.02 * Math.sin(5 * a - t * 3);
    const x = 540 + 480 * r * Math.cos(a), y = 880 + 660 * r * Math.sin(a); a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath(); ctx.fillStyle = C.pink; ctx.fill();
  ctx.save(); ctx.clip();
  ctx.strokeStyle = C.stomachFold; ctx.lineWidth = 20; ctx.lineCap = 'round';
  for (let i = 0; i < 5; i++) { const y0 = 360 + i * 120; ctx.beginPath(); for (let x = 80; x <= 1000; x += 20) { const y = y0 + Math.sin(x * 0.012 + t * 1.5 + i) * 26; x === 80 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
  if (acid > 0) {
    ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, 1180 + Math.sin(x * 0.015 + t * 3) * 18); ctx.lineTo(W, H); ctx.closePath();
    ctx.fillStyle = C.yellow; ctx.globalAlpha = 0.55 * acid; ctx.fill(); ctx.globalAlpha = 1;
    for (let i = 0; i < 16; i++) {
      const ph = (t * 0.6 + rnd(i)) % 1; ctx.globalAlpha = 0.85 * (1 - ph) * acid;
      ctx.beginPath(); ctx.arc(120 + rnd(i + 20) * 840 + Math.sin(t * 3 + i) * 12, 1400 - ph * 700, 10 + rnd(i + 5) * 18, 0, TAU);
      ctx.strokeStyle = C.yellow; ctx.lineWidth = 6; ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

// ═════════════════════════ INTESTINE ═════════════════════════
/** serpentine gut path (5 rows) filling the upper screen; returns { pts, at(u) -> [x, y, angle], draw() } */
export function makeGut({ L = 210, R = 870, r = 100, y0 = 320, rows = 5 } = {}) {
  const pts = [];
  for (let y = y0 - 260; y < y0; y += 8) pts.push([L, y]);
  for (let row = 0; row < rows; row++) {
    const y = y0 + row * 2 * r, ltr = row % 2 === 0;
    for (let i = 0; i <= 60; i++) pts.push([ltr ? lerp(L, R, i / 60) : lerp(R, L, i / 60), y]);
    if (row < rows - 1) { const cy = y + r; for (let i = 1; i <= 24; i++) { const k = i / 24, a = ltr ? -Math.PI / 2 + k * Math.PI : -Math.PI / 2 - k * Math.PI; pts.push([(ltr ? R : L) + r * Math.cos(a), cy + r * Math.sin(a)]); } }
  }
  const last = pts[pts.length - 1]; for (let x = last[0]; x < 1250; x += 10) pts.push([x, last[1]]);
  const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const len = cum[cum.length - 1];
  const at = (u) => { const d = clamp(u) * len; let i = 1; while (i < cum.length - 1 && cum[i] < d) i++; const a = pts[i - 1], b = pts[i], k = (d - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1); return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), Math.atan2(b[1] - a[1], b[0] - a[0])]; };
  const draw = ({ ghost = 0 } = {}) => {
    const path = () => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (const q of pts) ctx.lineTo(q[0], q[1]); };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (ghost > 0) {      // x-ray film version: faint cyan tube only (soft tissue on a film)
      ctx.save(); ctx.globalAlpha = 0.22 * ghost; path(); ctx.strokeStyle = C.cyan; ctx.lineWidth = 92; ctx.stroke();
      ctx.globalAlpha = 0.5 * ghost; path(); ctx.strokeStyle = C.xnavy; ctx.lineWidth = 60; ctx.stroke(); ctx.restore(); return;
    }
    path(); ctx.strokeStyle = C.cyan; ctx.globalAlpha = 0.25; ctx.lineWidth = 112; ctx.stroke(); ctx.globalAlpha = 1;
    path(); ctx.strokeStyle = C.pinkDark; ctx.lineWidth = 92; ctx.stroke();
    path(); ctx.strokeStyle = C.pink; ctx.lineWidth = 76; ctx.stroke();
    path(); ctx.strokeStyle = C.pinkLight; ctx.globalAlpha = 0.6; ctx.lineWidth = 22; ctx.stroke(); ctx.globalAlpha = 1;
  };
  return { pts, at, draw };
}
/** a straight gut segment across the screen at y (close-up). Returns nothing; draw blockages on top */
export function gutTube(y, t = 0, width = 300) {
  const tube = () => { ctx.beginPath(); for (let x = -150; x <= 1230; x += 20) { const yy = y + Math.sin(x * 0.006 + t * 0.5) * 20; x === -150 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } };
  ctx.lineCap = 'round';
  tube(); ctx.strokeStyle = C.pinkDark; ctx.lineWidth = width + 30; ctx.stroke();
  tube(); ctx.strokeStyle = C.pink; ctx.lineWidth = width; ctx.stroke();
  tube(); ctx.strokeStyle = C.pinkLight; ctx.globalAlpha = 0.5; ctx.lineWidth = width * 0.2; ctx.stroke(); ctx.globalAlpha = 1;
}

// ═════════════════════════ CHARACTER ═════════════════════════
// One hero: flat man, blue tee, navy pants. Origin = chest centre; at s = 1 he is ~950 px tall (head top -480, feet +620).
// Arm poses are elbow/hand points for the RIGHT arm (the left mirrors). Blend them with armPose(a, b, t).
export const ARM = {
  down: { e: [172, 0], h: [176, 138] },
  mouth: { e: [220, -50], h: [58, -262] },     // hand at the mouth (eating, gasp)
  point: { e: [240, -90], h: [205, -300] },    // index finger up (pass finger: angle)
  wave: { e: [250, -120], h: [300, -330] },
  hip: { e: [250, 20], h: [150, 110] },
};
export const armPose = (a, b, t) => ({ e: [lerp(a.e[0], b.e[0], t), lerp(a.e[1], b.e[1], t)], h: [lerp(a.h[0], b.h[0], t), lerp(a.h[1], b.h[1], t)] });
/** mouth position in the man's local coords (for things going in / out of the mouth) */
export const MOUTH = [0, -272];
/** points along the food path in local coords: mouth -> throat -> stomach top -> inside stomach */
export const FOOD_PATH = [[0, -262], [0, -200], [-4, -80], [-12, 58]];

function arm(side, pose, finger, xr) {
  const sx = side, sh = [140 * sx, -170], e = [pose.e[0] * sx, pose.e[1]], h = [pose.h[0] * sx, pose.h[1]];
  const ang = Math.atan2(h[1] - e[1], h[0] - e[0]);
  if (xr) {
    line([sh, e], C.cyan, 58); line([e, h], C.cyan, 52);
    ctx.save(); ctx.translate(h[0], h[1]); ctx.rotate(ang); ell(6, 0, 38, 32, C.cyan); ctx.restore();
    if (finger != null) { ctx.save(); ctx.translate(h[0], h[1]); ctx.rotate(finger); rr(-15, -90, 30, 88, 15); ctx.fillStyle = C.cyan; ctx.fill(); rr(-10, -85, 20, 78, 10); ctx.fillStyle = C.xnavy; ctx.fill(); line([[0, -76], [0, -10]], C.cyan, 6); ctx.restore(); }
    line([sh, e], C.xnavy, 48); line([e, h], C.xnavy, 42);
    ctx.save(); ctx.translate(h[0], h[1]); ctx.rotate(ang); ell(6, 0, 33, 27, C.xnavy); for (const k of [-12, 0, 12]) line([[-10, k * 0.8], [28, k]], C.cyan, 6); ctx.restore();
    line([sh, e], C.cyan, 13); circle(e[0], e[1], 11, C.cyan);
    const nx = -(h[1] - e[1]), ny = h[0] - e[0], nl = Math.hypot(nx, ny) || 1, ox = nx / nl * 7, oy = ny / nl * 7;
    line([[e[0] + ox, e[1] + oy], [h[0] + ox, h[1] + oy]], C.cyan, 7); line([[e[0] - ox, e[1] - oy], [h[0] - ox, h[1] - oy]], C.cyan, 7);
    return;
  }
  line([sh, e], C.skin, 50); line([e, h], C.skin, 44);
  if (_coat) { const wr = [lerp(e[0], h[0], 0.7), lerp(e[1], h[1], 0.7)]; line([sh, e, wr], COAT_D, 70); line([sh, e, wr], C.white, 60); }   // long lab-coat sleeve
  else line([sh, [lerp(sh[0], e[0], 0.55), lerp(sh[1], e[1], 0.55)]], C.shirt, 72);       // short sleeve
  if (finger != null) { ctx.save(); ctx.translate(h[0], h[1]); ctx.rotate(finger); rr(-11, -86, 22, 80, 11); ctx.fillStyle = C.skin; ctx.fill(); ctx.restore(); }
  ctx.save(); ctx.translate(h[0], h[1]); ctx.rotate(ang); ell(6, 0, 34, 28, C.skin); ell(-2, -sx * 22, 15, 10, C.skin, -0.5 * sx); ctx.restore();
}
function torsoPath() {
  ctx.beginPath(); ctx.moveTo(-50, -214);
  ctx.bezierCurveTo(-130, -214, -162, -196, -164, -120); ctx.lineTo(-140, 192); ctx.quadraticCurveTo(-138, 210, -120, 210);
  ctx.lineTo(120, 210); ctx.quadraticCurveTo(138, 210, 140, 192); ctx.lineTo(164, -120); ctx.bezierCurveTo(162, -196, 130, -214, 50, -214); ctx.closePath();
}
function skeletonTorso(pulse) {
  ctx.save(); torsoPath(); ctx.clip();
  ctx.fillStyle = C.xnavy; ctx.fillRect(-170, -220, 340, 440);
  for (let y = -192; y < 200; y += 32) { rr(-14, y, 28, 24, 7); ctx.fillStyle = C.cyan; ctx.globalAlpha = 0.9; ctx.fill(); }
  ctx.globalAlpha = 1; ctx.strokeStyle = C.cyan; ctx.lineCap = 'round';
  for (const sd of [-1, 1]) {
    ctx.lineWidth = 13; ctx.beginPath(); ctx.moveTo(sd * 22, -186); ctx.quadraticCurveTo(sd * 80, -202, sd * 146, -180); ctx.stroke();
    for (let i = 0; i < 6; i++) { const y = -150 + i * 37; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(sd * 18, y); ctx.quadraticCurveTo(sd * 152, y - 26, sd * 116, y + 56); ctx.stroke(); }
    ctx.lineWidth = 12; ctx.beginPath(); ctx.ellipse(sd * 72, 232, 74, 46, 0, Math.PI, TAU); ctx.stroke();
  }
  line([[0, -205], [-4, -80]], C.pink, 22);
  stomach(20, 10, 0.8, pulse);
  ctx.restore();
  ctx.save(); ctx.globalAlpha = 0.8; torsoPath(); ctx.strokeStyle = C.cyan; ctx.lineWidth = 7; ctx.stroke(); ctx.restore();
}
function head(o) {
  ctx.save(); ctx.translate(0, -350);
  const HC = o.hairCol || C.hair;
  ell(0, -34, 116, 94, HC);
  for (const sd of [-1, 1]) { ell(sd * 104, 14, 22, 28, C.skin); ell(sd * 106, 14, 10, 15, C.skinShade); }
  ell(0, 12, 102, 112, C.skin);
  // fringe with side part
  ctx.beginPath(); ctx.moveTo(-104, -6); ctx.quadraticCurveTo(-118, -112, -14, -124); ctx.quadraticCurveTo(96, -132, 112, -26);
  ctx.quadraticCurveTo(92, -70, 40, -74); ctx.quadraticCurveTo(-20, -76, -58, -50); ctx.quadraticCurveTo(-86, -34, -104, -6); ctx.closePath();
  ctx.fillStyle = HC; ctx.fill(); rr(-106, -40, 18, 46, 8); ctx.fill(); rr(88, -40, 18, 46, 8); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-60, -98); ctx.quadraticCurveTo(0, -118, 62, -96); ctx.strokeStyle = o.hairCol ? C.white + '88' : C.hairHi; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.stroke();
  // brows: brow 0..1 raises them; smirk tilts
  const br = (o.brow || 0) * 16, tl = o.smirk ? 1 : 0, fr = o.frown ? 1 : 0;
  ctx.strokeStyle = o.hairCol ? '#8E877B' : C.hair; ctx.lineWidth = 12;
  ctx.beginPath(); ctx.moveTo(-66, -26 - br - fr * 6); ctx.quadraticCurveTo(-44, -40 - br - tl * 4, -20, -32 - br + tl * 6 + fr * 12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(20, -32 - br - tl * 8 + fr * 12); ctx.quadraticCurveTo(44, -42 - br - tl * 10, 66, -28 - br - tl * 6 - fr * 6); ctx.stroke();
  // eyes: 'n' | 'wide' | 'closed'
  if (o.eyes === 'wide') {
    for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * 40, 6, 24, 27, 0, 0, TAU); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke(); circle(sd * 40, 8, 12, C.ink); circle(sd * 40 + 4, 3, 4, C.white); }
  } else if (o.eyes === 'closed') {
    for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * 40, 2, 13, 0.15 * Math.PI, 0.85 * Math.PI); ctx.strokeStyle = C.ink; ctx.lineWidth = 7; ctx.stroke(); }
  } else {
    const look = o.look || 0;
    for (const sd of [-1, 1]) { ell(sd * 40 + look * 6, 6, 11, 14, C.ink); circle(sd * 40 + 4 + look * 6, 1, 4, C.white); }
  }
  // tired 0..1: heavy lids + eye bags (sleep loss)
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
  if (o.glasses) { ctx.strokeStyle = C.ink; ctx.lineWidth = 6; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * 40, 6, 28, 0, TAU); ctx.stroke(); } line([[-12, 2], [12, 2]], C.ink, 6); }
  ctx.beginPath(); ctx.moveTo(4, 26); ctx.quadraticCurveTo(16, 44, 0, 48); ctx.strokeStyle = C.skinShade; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.stroke();
  ctx.globalAlpha = 0.3; for (const sd of [-1, 1]) ell(sd * 62, 46, 20, 12, C.pink); ctx.globalAlpha = 1;
  // mouth: 'smile' | 'smirk' | 'chew' | 'o' | 'flat' | 'grin'
  const m = o.mouth || 'smile'; ctx.lineCap = 'round'; ctx.strokeStyle = C.mouth; ctx.lineWidth = 8;
  if (m === 'smile') { ctx.beginPath(); ctx.moveTo(-24, 70); ctx.quadraticCurveTo(0, 90, 24, 70); ctx.stroke(); }
  if (m === 'smirk') { ctx.beginPath(); ctx.moveTo(-22, 74); ctx.quadraticCurveTo(8, 88, 32, 64); ctx.stroke(); }
  if (m === 'flat') { ctx.beginPath(); ctx.moveTo(-20, 76); ctx.lineTo(20, 76); ctx.stroke(); }
  if (m === 'chew') ell(0, 76, 18, 4 + 8 * (o.chew || 0), C.mouth);
  if (m === 'o') { ell(0, 80, 20, 27, C.mouth); ell(0, 96, 13, 8, C.pink); }
  if (m === 'grin') { ctx.beginPath(); ctx.moveTo(-34, 66); ctx.quadraticCurveTo(0, 112, 34, 66); ctx.closePath(); ctx.fillStyle = C.mouth; ctx.fill(); rr(-26, 66, 52, 12, 4); ctx.fillStyle = C.white; ctx.fill(); }
  ctx.restore();
}
/**
 * The hero. o = { x, y, s, arm (pose), finger (rad or null), eyes, mouth, chew, brow, smirk, frown, look (-1..1),
 *   xray (bool: whole body becomes x-ray, head stays normal), pulse (stomach swell 0..1),
 *   holding: [drawFn(x, y)] drawn at the right hand, inside: [x, y, rot] a gum drawn inside the body (local coords) }
 */
let _coat = false;
const COAT_D = '#DCD6CB';
export function man(o) {
  const s = o.s || 1, XR = !!o.xray; _coat = !!o.coat && !XR;
  ctx.save(); ctx.translate(o.x, o.y); ctx.scale(s, s);
  if (XR) {
    for (const x of [-128, 6]) {
      rr(x, 180, 122, 440, 40); ctx.fillStyle = C.xnavy; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.cyan; ctx.stroke();
      const cx = x + 61; line([[cx, 200], [cx, 380]], C.cyan, 16); circle(cx, 400, 20, C.cyan); line([[cx - 9, 420], [cx - 9, 600]], C.cyan, 8); line([[cx + 9, 420], [cx + 9, 600]], C.cyan, 8);
    }
    rr(-36, -250, 72, 60, 20); ctx.fillStyle = C.xnavy; ctx.fill();
    for (let y = -246; y < -200; y += 22) { rr(-13, y, 26, 16, 6); ctx.fillStyle = C.cyan; ctx.fill(); }
  } else {
    rr(-128, 180, 122, 440, 40); ctx.fillStyle = C.pants; ctx.fill(); rr(6, 180, 122, 440, 40); ctx.fill();
    rr(6, 180, 40, 440, [0, 0, 0, 30]); ctx.fillStyle = C.pantsShade; ctx.fill();
    rr(-36, -250, 72, 60, 20); ctx.fillStyle = C.skin; ctx.fill();
  }
  arm(-1, o.armL || ARM.down, null, XR);
  if (XR) skeletonTorso(o.pulse || 0);
  else {
    torsoPath(); ctx.fillStyle = C.shirt; ctx.fill();
    ctx.save(); torsoPath(); ctx.clip(); ctx.beginPath(); ctx.moveTo(95, -220); ctx.quadraticCurveTo(70, 0, 100, 220); ctx.lineTo(200, 220); ctx.lineTo(200, -220); ctx.closePath(); ctx.fillStyle = C.shirtShade; ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.ellipse(0, -214, 46, 26, 0, 0, Math.PI); ctx.fillStyle = C.skin; ctx.fill(); ctx.strokeStyle = C.shirtShade; ctx.lineWidth = 12; ctx.stroke();
    if (_coat) labCoat();
  }
  head(o);
  const ra = o.arm || ARM.down;
  arm(1, ra, o.finger ?? null, XR);
  if (o.holding) o.holding(ra.h[0] - 34, ra.h[1] - 14);
  if (o.inside) gum(o.inside[0], o.inside[1], 0.5, o.inside[2] || 0);
  ctx.restore(); _coat = false;
}
/** white lab coat over the torso (open V showing the blue tee), lapels, pocket + pen, ink stethoscope */
function labCoat() {
  ctx.save(); torsoPath(); ctx.clip();
  torsoPath(); ctx.fillStyle = C.white; ctx.fill();
  ctx.beginPath(); ctx.moveTo(105, -220); ctx.quadraticCurveTo(80, 0, 110, 220); ctx.lineTo(200, 220); ctx.lineTo(200, -220); ctx.closePath(); ctx.fillStyle = COAT_D; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-58, -220); ctx.lineTo(0, -40); ctx.lineTo(58, -220); ctx.closePath(); ctx.fillStyle = C.shirt; ctx.fill();
  ctx.restore();
  ctx.beginPath(); ctx.ellipse(0, -214, 46, 26, 0, 0, Math.PI); ctx.fillStyle = C.skin; ctx.fill();
  line([[-58, -214], [-8, -50], [-14, 210]], COAT_D, 9); line([[58, -214], [8, -50]], COAT_D, 9);
  for (const by of [-10, 70, 150]) circle(14, by, 8, COAT_D);
  rr(-130, -90, 74, 16, 6); ctx.fillStyle = COAT_D; ctx.fill(); rr(-112, -126, 12, 44, 6); ctx.fillStyle = C.red; ctx.fill();
  ctx.lineCap = 'round'; ctx.strokeStyle = C.ink; ctx.lineWidth = 9;
  ctx.beginPath(); ctx.moveTo(-50, -205); ctx.quadraticCurveTo(-78, -90, -38, -60); ctx.moveTo(50, -205); ctx.quadraticCurveTo(78, -90, 38, -60); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-38, -60); ctx.quadraticCurveTo(0, -30, 38, -60); ctx.moveTo(38, -60); ctx.quadraticCurveTo(60, 10, 40, 50); ctx.stroke();
  circle(40, 62, 20, C.ink); circle(40, 62, 13, C.gumEdge);
}
/** the doctor of the knuckle story: a man() in a white lab coat with grey hair + round glasses (not the hero) */
export function doctor(o) { man({ hairCol: '#B9B2A6', glasses: true, ...o, coat: true }); }
/** follow FOOD_PATH: u 0..1 → [x, y] in the man's local coords */
export function foodAt(u) {
  const P = FOOD_PATH, n = P.length - 1, k = clamp(u) * n, i = Math.min(n - 1, Math.floor(k)), f = k - i;
  return [lerp(P[i][0], P[i + 1][0], f), lerp(P[i][1], P[i + 1][1], f)];
}

// ═════════════════════════ HAND (knuckle video) ═════════════════════════
// Back of a RIGHT hand, fingers up, pinky on the right. Origin = palm centre; at s = 1 the hand is ~620 px tall.
const FINGERS = [ // [knuckle x, knuckle y, length, wrist x]  index → pinky
  [-105, -100, 270, -58], [-35, -112, 300, -20], [35, -104, 280, 20], [105, -80, 215, 58]];
const WRIST_Y = 200;
const fingerPts = (f) => { const [kx, ky, len] = f; return [[kx, ky], [kx * 1.06, ky - len * 0.45], [kx * 1.1, ky - len * 0.75], [kx * 1.12, ky - len]]; };
/** knuckle (metacarpal head) position of finger i (0 index .. 3 pinky) in the hand's local coords */
export const knuckleAt = (i) => [FINGERS[i][0], FINGERS[i][1]];

/** flat skin hand. puff 0..1 swells it (balloon), bruise 0..1 reddens it, splint 0..1 slides a splint on (pinky side) */
export function handSkin(x, y, s, { puff = 0, bruise = 0, splint = 0, rot = 0, sleeve = C.shirt } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * (1 + puff * 0.18), s * (1 + puff * 0.08));
  const fw = 64 + puff * 26;
  const tone = bruise > 0 ? C.pinkLight : C.skin;
  ctx.lineCap = 'round';
  // wrist + sleeve
  line([[0, 160], [0, 420]], C.skin, 210); rr(-125, 330, 250, 200, 30); ctx.fillStyle = sleeve; ctx.fill();
  if (sleeve !== C.shirt) { rr(75, 330, 50, 200, [0, 30, 30, 0]); ctx.fillStyle = sleeve === C.white ? COAT_D : C.shirtShade; ctx.fill(); }
  // thumb
  line([[-120, 150], [-205, 30], [-245, -60]], C.skin, fw + 8);
  // palm
  rr(-155 - puff * 30, -125, 310 + puff * 60, 330, 90 + puff * 30); ctx.fillStyle = C.skin; ctx.fill();
  for (const f of FINGERS) { const p = fingerPts(f); line([p[0], p[3]], C.skin, fw); }
  // shade strip on the pinky side + finger creases
  ctx.save(); ctx.globalAlpha = 0.9; line([[150 + puff * 26, -60], [150 + puff * 26, 180]], C.skinShade, 26); ctx.restore();
  for (const f of FINGERS) { const p = fingerPts(f); line([[p[1][0] - 16, p[1][1]], [p[1][0] + 16, p[1][1]]], C.skinShade, 6); line([[p[2][0] - 13, p[2][1]], [p[2][0] + 13, p[2][1]]], C.skinShade, 6); }
  // bruise: soft red patches around the pinky knuckle
  if (bruise > 0) { ctx.save(); ctx.globalAlpha = 0.55 * bruise; ell(95, -40, 110 + puff * 40, 120 + puff * 30, C.pinkDark); ctx.globalAlpha = 0.45 * bruise; ell(70, 40, 80, 70, C.pink); ctx.restore(); }
  // knuckle highlights
  for (const f of FINGERS) ell(f[0], f[1] + 10, 22, 12, C.white + '55');
  // splint: a white board strapped along the ring + pinky side
  if (splint > 0) {
    ctx.save(); ctx.globalAlpha = clamp(splint * 3); const sy = lerp(260, 0, splint);
    rr(40, -330 + sy, 150, 560, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.gumEdge; ctx.stroke();
    for (const yy of [-220, -40, 140]) { rr(-170, yy + sy, 380, 44, 14); ctx.fillStyle = C.shirt; ctx.fill(); rr(-170, yy + sy + 30, 380, 14, 7); ctx.fillStyle = C.shirtShade; ctx.fill(); }
    ctx.restore();
  }
  ctx.restore();
}

/** x-ray hand bones (cyan on navy). glow 0..1 lights the knuckles yellow, crack 0..1 draws the pinky break,
 *  heal 0..1 grows new bone (callus) over the crack, hot 0..1 pulses a red ring on the pinky knuckle */
export function handBones(x, y, s, { glow = 0, crack = 0, heal = 0, hot = 0, t = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round';
  // faint flesh outline
  ctx.save(); ctx.globalAlpha = 0.18; rr(-170, -140, 340, 360, 100); ctx.fillStyle = C.cyan; ctx.fill();
  for (const f of FINGERS) { const p = fingerPts(f); line([p[0], p[3]], C.cyan, 84); } line([[-120, 150], [-205, 30], [-245, -60]], C.cyan, 86); ctx.restore();
  const bone = (a, b, w) => { line([a, b], C.cyan, w); line([a, b], C.xnavy, w * 0.42); circle(a[0], a[1], w * 0.62, C.cyan); circle(b[0], b[1], w * 0.62, C.cyan); };
  // carpals
  for (let i = 0; i < 6; i++) circle(-70 + (i % 3) * 70, WRIST_Y + 20 + Math.floor(i / 3) * 50, 30, C.cyan);
  // thumb
  bone([-95, 175], [-185, 45], 30); bone([-195, 25], [-230, -40], 26); bone([-238, -58], [-252, -110], 22);
  FINGERS.forEach((f, i) => {
    const [kx, ky, , wx] = f, p = fingerPts(f);
    bone([wx, WRIST_Y - 10], [kx, ky + 20], 32);                       // metacarpal (the knuckle is its top end)
    bone([p[0][0], p[0][1] - 30], [p[1][0], p[1][1]], 26); bone([p[1][0], p[1][1] - 18], [p[2][0], p[2][1]], 22); bone([p[2][0], p[2][1] - 16], [p[3][0], p[3][1] + 10], 19);
    if (glow > 0) { ctx.save(); ctx.globalAlpha = glow; circle(kx, ky + 20, 30, C.yellow); ctx.restore(); }
  });
  // pinky metacarpal neck = boxer's fracture
  const [kx, ky, , wx] = FINGERS[3], cx = lerp(wx, kx, 0.72), cy = lerp(WRIST_Y, ky, 0.72);
  if (hot > 0) { ctx.save(); ctx.globalAlpha = 0.35 + 0.5 * hot; ctx.beginPath(); ctx.arc(cx, cy, 70 + hot * 14, 0, TAU); ctx.strokeStyle = C.red; ctx.lineWidth = 12; ctx.stroke(); ctx.restore(); }
  if (crack > 0) {
    const pts = [[cx - 30, cy - 8], [cx - 12, cy + 8], [cx + 2, cy - 10], [cx + 18, cy + 6], [cx + 32, cy - 6]];
    const n = Math.max(2, Math.round(pts.length * clamp(crack)));
    line(pts.slice(0, n), C.red, 10);
  }
  if (heal > 0) {
    ctx.save(); ctx.globalAlpha = clamp(heal * 1.4);
    ell(cx, cy, 34 + heal * 14, 26 + heal * 6, C.white); ell(cx, cy, 24 + heal * 10, 16 + heal * 4, C.cyan);
    ctx.restore();
    for (let i = 0; i < 10; i++) {               // bone-building specks flying in
      const ph = (t * 0.9 + rnd(i)) % 1, an = rnd(i + 3) * TAU, d = (1 - ph) * 140;
      ctx.save(); ctx.globalAlpha = clamp(heal * 2) * (1 - ph) * (heal < 1 ? 1 : 0); circle(cx + Math.cos(an) * d, cy + Math.sin(an) * d, 7, C.white); ctx.restore();
    }
  }
  ctx.restore();
}
/** where the boxer's fracture sits, in canvas coords, for a handBones drawn at (x, y, s) */
export const fractureAt = (x, y, s) => { const [kx, ky, , wx] = FINGERS[3]; return [x + lerp(wx, kx, 0.72) * s, y + lerp(WRIST_Y, ky, 0.72) * s]; };

/** a fist seen from the knuckle side: four knuckle bumps on top. sink 0..1 drops the pinky knuckle out of sight.
 *  rot rotates the whole fist (e.g. -PI/2 = knuckles facing right, for a punch) */
export function fistSide(x, y, s, { sink = 0, rot = 0, squash = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * (1 - squash * 0.12), s * (1 + squash * 0.1));
  const kx = [-195, -65, 65, 195];
  kx.forEach((k, i) => { const dy = i === 3 ? sink * 80 : 0, r = i === 3 ? 66 - sink * 18 : 66; circle(k, -40 + dy, r, C.skinShade); circle(k, -48 + dy, r - 6, C.skin); });
  rr(-265, -40, 530, 270, 90); ctx.fillStyle = C.skin; ctx.fill();
  rr(150, -40, 115, 270, [0, 90, 90, 0]); ctx.fillStyle = C.skinShade; ctx.fill();
  for (const k of [-130, 0, 130]) line([[k, 10], [k, 90]], C.skinShade, 8);       // finger gaps
  line([[-240, 150], [200, 150]], C.skinShade, 8);                               // fold
  kx.forEach((k, i) => { if (i < 3 || sink < 0.5) ell(k - 14, -78 + (i === 3 ? sink * 80 : 0), 20, 10, C.white + '66'); });
  ctx.restore();
}

/** brick wall (flat). face 0..1 fades in a smug little face */
export function brickWall(x, y, w, h, face = 0) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = C.floor; ctx.fillRect(x, y, w, h);
  const bw = 200, bh = 90;
  for (let r = 0; r * bh < h + bh; r++) for (let c = -1; c * bw < w + bw; c++) {
    const bx = x + c * bw + (r % 2 ? bw / 2 : 0), by = y + r * bh;
    rr(bx + 8, by + 8, bw - 16, bh - 16, 10); ctx.fillStyle = (r + c) % 3 ? C.pot : '#B5653F'; ctx.fill();
  }
  ctx.restore();
  if (face > 0) {
    ctx.save(); ctx.globalAlpha = clamp(face); const fx = x + Math.min(w / 2, Math.max(140, (1080 - x) / 2)), fy = y + h * 0.42;
    for (const sd of [-1, 1]) { ell(fx + sd * 60, fy, 30, 34, C.white); circle(fx + sd * 60 - 10, fy + 6, 14, C.ink); }
    ctx.beginPath(); ctx.moveTo(fx - 50, fy + 100); ctx.quadraticCurveTo(fx + 10, fy + 135, fx + 70, fy + 85); ctx.strokeStyle = C.ink; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.stroke();
    ctx.restore();
  }
}
/** extra arm pose for the hero: straight punch to the right */
ARM.punch = { e: [300, -150], h: [470, -160] };

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

/** series end-card badge: ink pill with a yellow folder icon + text (series name only: "BODY FILES") */
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

// ═════════════════════════ MAGNET SET (2026-11-08 "swallow a magnet") ═════════════════════════
/** hand on the belly (rubbing a sore tummy), for the RIGHT arm */
ARM.belly = { e: [205, 30], h: [70, 95] };

/** small bar magnet: red N half + silver S half, ink-free flat look. ~140x60 px at s = 1.
 *  face: { look (-1..1), mad (bool) } adds dot eyes on the red half (the "hunting" magnets). xr = x-ray film look (white).
 *  flip: S|N instead of N|S (letters stay upright). Stack a flipped one under a normal one so opposite poles touch. */
export function barMagnet(x, y, s, rot = 0, { face = null, xr = false, flip = false } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (flip) ctx.scale(-1, 1);
  if (xr) { ctx.globalAlpha = 0.35; rr(-80, -40, 160, 80, 26); ctx.fillStyle = C.cyan; ctx.fill(); ctx.globalAlpha = 1; rr(-70, -30, 140, 60, 18); ctx.fillStyle = C.white; ctx.fill(); ctx.restore(); return; }
  rr(-70, -30, 140, 60, 18); ctx.fillStyle = '#A81E2D'; ctx.fill();
  rr(-70, -30, 70, 54, [18, 0, 0, 18]); ctx.fillStyle = C.red; ctx.fill();
  rr(0, -30, 70, 60, [0, 18, 18, 0]); ctx.fillStyle = C.gumEdge; ctx.fill();
  rr(0, -30, 70, 52, [0, 18, 18, 0]); ctx.fillStyle = C.gum; ctx.fill();
  ell(-40, -16, 18, 6, C.pinkLight, -0.15); ell(30, -16, 18, 6, C.white, -0.15);
  if (face) {
    const lk = (face.look || 0) * 4;
    for (const ex of [-52, -22]) { circle(ex, -2, 10, C.white); circle(ex + lk, -1, 6, C.ink); }
    if (face.mad) { ctx.strokeStyle = C.ink; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-62, -20); ctx.lineTo(-44, -14); ctx.moveTo(-12, -20); ctx.lineTo(-30, -14); ctx.stroke(); }
  } else {
    if (flip) ctx.scale(-1, 1);     // letters stay readable; positions mirror with the halves
    const k = flip ? -1 : 1;
    ctx.fillStyle = C.white; ctx.font = '900 34px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('N', -35 * k, 0);
    ctx.fillStyle = C.gumEdge; ctx.fillText('S', 35 * k, 0);
  }
  ctx.restore();
}

/** close-up of two neighbouring gut loops (horizontal tubes at yA, yB, width w). pull 0..1 drags both walls toward
 *  each other around x = cx until they touch in the middle (the magnet pinch). Returns { a(x), b(x) } = tube centre ys. */
export function gutPair(yA, yB, t, pull = 0, { cx = 540, w = 250 } = {}) {
  const meet = (yA + yB) / 2, need = (yB - yA) / 2 - w / 2 - 15;
  const off = (x) => pull * need * Math.exp(-Math.pow((x - cx) / 190, 2));
  const a = (x) => yA + Math.sin(x * 0.006 + t * 0.5) * 14 * (1 - pull) + off(x);
  const b = (x) => yB + Math.sin(x * 0.006 + t * 0.5 + 2) * 14 * (1 - pull) - off(x);
  for (const f of [a, b]) {
    const tube = () => { ctx.beginPath(); for (let x = -200; x <= 1280; x += 16) x === -200 ? ctx.moveTo(x, f(x)) : ctx.lineTo(x, f(x)); };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    tube(); ctx.strokeStyle = C.pinkDark; ctx.lineWidth = w + 30; ctx.stroke();
    tube(); ctx.strokeStyle = C.pink; ctx.lineWidth = w; ctx.stroke();
    ctx.save(); ctx.translate(0, -w * 0.22); tube(); ctx.strokeStyle = C.pinkLight; ctx.globalAlpha = 0.5; ctx.lineWidth = w * 0.16; ctx.stroke(); ctx.restore();
  }
  return { a, b, meet };
}

/** red "pinch" ring at a point (flat outline, pulses with p 0..1). Danger marker, no gore */
export function pinchRing(x, y, rx, ry, p, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.ellipse(x, y, rx * (1 + p * 0.1), ry * (1 + p * 0.1), 0, 0, TAU);
  ctx.setLineDash([34, 20]); ctx.lineDashOffset = -p * 60; ctx.strokeStyle = C.red; ctx.lineWidth = 14; ctx.stroke(); ctx.setLineDash([]); ctx.restore();
}

/** belly-ache swirls (three little ink spirals around a point). a = alpha, t = film time */
export function ache(x, y, t, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.ink; ctx.lineWidth = 9; ctx.lineCap = 'round';
  for (const [dx, dy, k] of [[-150, -40, 0], [150, -70, 1], [130, 90, 2]]) {
    ctx.beginPath();
    for (let i = 0; i <= 30; i++) { const an = i / 30 * TAU * 1.6 + t * 5 + k, r = 4 + i * 1.2; const px = x + dx + Math.cos(an) * r, py = y + dy + Math.sin(an) * r; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.stroke();
  }
  ctx.restore();
}

/** doctor's clipboard with a red medical cross. Board ~420x560 at s = 1. p 0..1 writes the lines */
export function clipboard(x, y, s, p = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-210, -280, 420, 560, 30); ctx.fillStyle = '#9A5333'; ctx.fill(); rr(-210, -280, 404, 552, 30); ctx.fillStyle = '#B5653F'; ctx.fill();
  rr(-170, -220, 340, 460, 14); ctx.fillStyle = C.white; ctx.fill();
  rr(-80, -310, 160, 70, 18); ctx.fillStyle = C.gumEdge; ctx.fill(); rr(-80, -310, 160, 26, [18, 18, 0, 0]); ctx.fillStyle = C.gum; ctx.fill();
  rr(-30, -170, 60, 150, 10); ctx.fillStyle = C.red; ctx.fill(); rr(-75, -125, 150, 60, 10); ctx.fill();
  for (let i = 0; i < 4; i++) { const f = clamp(p * 4 - i); if (f > 0) { rr(-120, 30 + i * 52, 240 * f * (i === 3 ? 0.6 : 1), 16, 8); ctx.fillStyle = C.gumEdge; ctx.fill(); } }
  ctx.restore();
}

/** lightbox with an x-ray film: ink frame, navy film clipped inside; inner(t) draws the film contents */
export function lightbox(x, y, w, h, t, inner) {
  rr(x, y, w, h, 40); ctx.fillStyle = C.ink; ctx.fill();
  ctx.save(); rr(x + 28, y + 28, w - 56, h - 56, 24); ctx.clip(); xray(t); if (inner) inner(); ctx.restore();
}

/** cartoon bladder balloon: pink balloon with two thin tubes (ureters) on top, a short neck below, yellow fill inside.
 *  fill 0..1 = how full (it also grows), wob = jiggle 0..1, t = film time. ~360 px tall at fill 0.5, s = 1 */
export function bladder(x, y, s, fill = 0.5, { t = 0, wob = 0 } = {}) {
  const g = lerp(0.7, 1.25, clamp(fill)), j = Math.sin(t * 14) * 0.04 * wob;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.lineCap = 'round';
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 70 * g, -120 * g); ctx.bezierCurveTo(sd * 120 * g, -220 * g, sd * 200, -260, sd * 220, -360); ctx.strokeStyle = C.pinkDark; ctx.lineWidth = 34; ctx.stroke(); ctx.strokeStyle = C.pink; ctx.lineWidth = 22; ctx.stroke(); }
  ctx.save(); ctx.scale(g * (1 + j), g * (1 - j));
  const B = () => { ctx.beginPath(); ctx.moveTo(0, 170); ctx.bezierCurveTo(-60, 150, -190, 90, -180, -30); ctx.bezierCurveTo(-170, -150, -60, -180, 0, -175); ctx.bezierCurveTo(60, -180, 170, -150, 180, -30); ctx.bezierCurveTo(190, 90, 60, 150, 0, 170); ctx.closePath(); };
  rr(-30, 150, 60, 80, 20); ctx.fillStyle = C.pinkDark; ctx.fill();
  B(); ctx.fillStyle = C.pinkDark; ctx.fill();
  ctx.save(); ctx.scale(0.92, 0.92); ctx.translate(-4, -6); B(); ctx.fillStyle = C.pink; ctx.fill();
  B(); ctx.clip(); const lv = lerp(150, -150, clamp(fill));
  ctx.beginPath(); ctx.moveTo(-220, 220); for (let xx = -220; xx <= 220; xx += 20) ctx.lineTo(xx, lv + Math.sin(xx * 0.03 + t * 4) * 8); ctx.lineTo(220, 220); ctx.closePath();
  ctx.globalAlpha = 0.75; ctx.fillStyle = C.yellow; ctx.fill(); ctx.globalAlpha = 1;
  ctx.restore();
  ell(-90, -95, 44, 22, C.pinkLight, -0.6); ell(-128, -40, 12, 18, C.pinkLight, -0.3);
  ctx.restore();
  ctx.restore();
}

// ═════════════════════════ BLADDER SET (2026-11-09 "hold your pee too long") ═════════════════════════
const MUSCLE_D = '#A8445A', GERM = C.leaf, GERM_D = '#468F55', GERM_L = '#8ED19A', STORM = '#6E7A86', STORM_D = '#5A6573';

/** glass measuring cup (front view, handle on the right, pour spout top-left, red scale marks + "1 CUP" line).
 *  Pale water inside up to fill 0..1 (liq = liquid colour). ~300x320 px at s = 1 */
export function measuringCup(x, y, s, fill = 1, t = 0, liq = C.sky) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(112, -10, 72, -Math.PI / 2, Math.PI / 2); ctx.strokeStyle = C.gumEdge; ctx.lineWidth = 34; ctx.stroke();
  const body = () => { ctx.beginPath(); ctx.moveTo(-160, -170); ctx.lineTo(-120, -150); ctx.lineTo(130, -150); ctx.lineTo(104, 140); ctx.quadraticCurveTo(102, 160, 82, 160); ctx.lineTo(-82, 160); ctx.quadraticCurveTo(-102, 160, -104, 140); ctx.lineTo(-124, -120); ctx.closePath(); };
  body(); ctx.fillStyle = C.gumEdge; ctx.fill();
  ctx.save(); ctx.scale(0.9, 0.92); body(); ctx.fillStyle = C.white; ctx.fill(); body(); ctx.clip();
  if (fill > 0) {
    const lv = lerp(170, -110, clamp(fill));
    ctx.beginPath(); ctx.moveTo(-180, 200); for (let xx = -180; xx <= 150; xx += 15) ctx.lineTo(xx, lv + Math.sin(xx * 0.04 + t * 4) * 6); ctx.lineTo(150, 200); ctx.closePath();
    ctx.fillStyle = liq; ctx.fill();
  }
  rr(-100, -110, 20, 220, 10); ctx.fillStyle = C.white; ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1;
  ctx.restore();
  for (let i = 0; i < 4; i++) line([[20, -100 + i * 60], [i % 2 ? 50 : 70, -100 + i * 60]], C.red, 8);
  ctx.fillStyle = C.red; ctx.font = '900 40px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('1 CUP', -60, -100 + 40);
  ctx.restore();
}

/** the room() window turned stormy: grey sky, a storm cloud and (bolt 0..1 alpha) a small lightning bolt, all OUTSIDE
 *  behind the glass. Call right after room(). t = film time */
export function stormWindow(t, bolt = 0, flash = 0) {
  ctx.save(); rr(622, 252, 316, 396, 12); ctx.clip();
  ctx.fillStyle = flash > 0 ? '#5A6678' : '#34405A'; ctx.fillRect(622, 252, 316, 396);
  ctx.fillStyle = '#26314A'; ctx.fillRect(622, 570, 316, 78);
  stormCloud(780, 330, 0.5, t);
  lightningBolt(770, 370, 0.4, bolt);
  ctx.restore();
  ctx.fillStyle = C.white; ctx.fillRect(772, 252, 14, 396); ctx.fillRect(622, 442, 316, 14);
}

/** "pause" badge (white disc, ink ring, two ink bars). sc = pop-in */
export function pauseIcon(x, y, s, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  circle(0, 0, 130, C.ink); circle(0, 0, 112, C.white);
  rr(-52, -60, 34, 120, 10); ctx.fillStyle = C.ink; ctx.fill(); rr(18, -60, 34, 120, 10); ctx.fill();
  ctx.restore();
}

/** a nerve: pink cord along pts (canvas coords), with a yellow signal blip at p 0..1 (p outside 0..1 = no blip).
 *  draw = how much of the cord is drawn 0..1 */
export function nerve(pts, p = -1, drawn = 1) {
  const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const len = cum[cum.length - 1];
  const at = (u) => { const d = clamp(u) * len; let i = 1; while (i < cum.length - 1 && cum[i] < d) i++; const a = pts[i - 1], b = pts[i], k = (d - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1); return [lerp(a[0], b[0], k), lerp(a[1], b[1], k)]; };
  if (drawn <= 0) return at;
  const part = []; const n = 60; for (let i = 0; i <= n * clamp(drawn); i++) part.push(at(i / n));
  if (part.length > 1) { line(part, C.pinkDark, 22); line(part, C.pinkLight, 9); }
  if (p >= 0 && p <= 1) {
    for (let k = 3; k >= 1; k--) { const q = at(clamp(p - k * 0.035)); ctx.save(); ctx.globalAlpha = 0.25 * (4 - k); circle(q[0], q[1], 14 + (3 - k) * 4, C.yellow); ctx.restore(); }
    const q = at(p); circle(q[0], q[1], 30, C.ink); circle(q[0], q[1], 23, C.yellow);
  }
  return at;
}

/** bladder neck close-up: a pink tube going DOWN from (x, y), len px, with two sphincter ring muscles.
 *  sq 0..1 = the rings clamp the tube shut; a = ring alpha (pop them in); flow 0..1 = yellow pee in the channel */
export function sphincters(x, y, s, sq = 0, { a = 1, len = 600, flow = 1 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const RY = [len * 0.33, len * 0.66];
  const half = (yy) => { let w = 78; for (const ry of RY) w -= 52 * sq * Math.exp(-Math.pow((yy - ry) / 60, 2)); return w; };
  const tube = (k) => { ctx.beginPath(); for (let yy = 0; yy <= len; yy += 10) ctx.lineTo(-half(yy) * k, yy); for (let yy = len; yy >= 0; yy -= 10) ctx.lineTo(half(yy) * k, yy); ctx.closePath(); };
  tube(1.25); ctx.fillStyle = C.pinkDark; ctx.fill(); tube(1.05); ctx.fillStyle = C.pink; ctx.fill();
  if (flow > 0) {
    ctx.save(); tube(0.42); ctx.clip(); const stop = lerp(len, RY[0] - 40, clamp(sq * 1.2));
    ctx.fillStyle = C.yellow; ctx.globalAlpha = 0.8 * flow; ctx.fillRect(-100, -10, 200, stop + 10); ctx.restore();
  }
  ctx.beginPath(); for (let yy = 10; yy <= len - 10; yy += 10) ctx.lineTo(-half(yy) * 0.72, yy); ctx.strokeStyle = C.pinkLight; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.stroke();
  if (a > 0) {
    ctx.save(); ctx.globalAlpha = clamp(a);
    for (const ry of RY) {
      const hw = half(ry) * 1.25 + 40, sc = clamp(a) < 1 ? lerp(1.4, 1, clamp(a)) : 1;
      ctx.save(); ctx.translate(0, ry); ctx.scale(sc, sc);
      rr(-hw, -46, hw * 2, 92, 40); ctx.fillStyle = MUSCLE_D; ctx.fill();
      rr(-hw + 6, -46, hw * 2 - 12, 80, 36); ctx.fillStyle = C.pinkDark; ctx.fill();
      for (const k of [-18, 8]) line([[-hw + 26, k], [hw - 26, k]], MUSCLE_D, 7);
      ell(-hw * 0.45, -30, hw * 0.3, 7, C.pinkLight);
      ctx.restore();
    }
    ctx.restore();
  }
  ctx.restore();
}
/** canvas y of sphincter ring i (0 upper, 1 lower) for sphincters drawn at (y, s, len) */
export const sphincterY = (y, s, i, len = 600) => y + len * (i ? 0.66 : 0.33) * s;

/** a friendly-mischievous bacterium: green capsule, wiggly tails, dot eyes, grin. ~130x60 px at s = 1 */
export function bacterium(x, y, s, rot = 0, t = 0, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * sc, s * sc);
  ctx.strokeStyle = GERM_D; ctx.lineWidth = 6; ctx.lineCap = 'round';
  for (const k of [-16, 0, 16]) { ctx.beginPath(); for (let i = 0; i <= 12; i++) { const px = -64 - i * 6, py = k * (1 + i * 0.06) + Math.sin(i * 0.9 - t * 12 + k) * 7; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
  rr(-66, -32, 132, 64, 32); ctx.fillStyle = GERM_D; ctx.fill();
  rr(-62, -32, 124, 58, 29); ctx.fillStyle = GERM; ctx.fill();
  ell(-30, -18, 22, 7, GERM_L, -0.1);
  for (const ex of [18, 42]) { circle(ex, -4, 9, C.white); circle(ex + 2, -3, 5.5, C.ink); }
  ctx.beginPath(); ctx.moveTo(18, 12); ctx.quadraticCurveTo(32, 22, 48, 10); ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.stroke();
  ctx.restore();
}

/** (D) inside the bladder: deep pink, a wobbling lighter wall, soft wall folds, a yellow pee pool from y = level */
export function insideBladder(t, level = 1100) {
  fillAll(C.stomachBg);
  for (let i = 0; i < 6; i++) circle(rnd(i + 40) * W, rnd(i + 50) * H, 120 + rnd(i + 60) * 140, C.stomachBgDark);
  ctx.beginPath();
  for (let a = 0; a <= TAU + 0.01; a += 0.05) {
    const r = 1 + 0.03 * Math.sin(3 * a + t * 1.6) + 0.015 * Math.sin(6 * a - t * 2);
    const x = 540 + 500 * r * Math.cos(a), y = 820 + 640 * r * Math.sin(a); a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath(); ctx.fillStyle = C.pink; ctx.fill();
  ctx.save(); ctx.clip();
  ctx.strokeStyle = C.stomachFold; ctx.lineWidth = 16; ctx.lineCap = 'round';
  for (let i = 0; i < 4; i++) { const y0 = 330 + i * 150; ctx.beginPath(); for (let x = 100; x <= 980; x += 20) { const y = y0 + Math.sin(x * 0.01 + t * 1.2 + i * 2) * 22; x === 100 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(-300, H + 300); for (let x = -300; x <= W + 300; x += 20) ctx.lineTo(x, level + Math.sin(x * 0.012 + t * 2.2) * 14); ctx.lineTo(W + 300, H + 300); ctx.closePath();
  ctx.fillStyle = C.yellow; ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1;
  ctx.beginPath(); for (let x = 60; x <= 1020; x += 20) ctx.lineTo(x, level + 26 + Math.sin(x * 0.012 + t * 2.2) * 14); ctx.strokeStyle = C.white; ctx.globalAlpha = 0.35; ctx.lineWidth = 8; ctx.stroke(); ctx.globalAlpha = 1;
  ctx.restore();
}

/** white toilet, front view (tank, seat, bowl, base). Origin = seat centre; ~420 px tall at s = 1 */
export function toilet(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-80, 110, 160, 110, 20); ctx.fillStyle = C.gumEdge; ctx.fill(); rr(-80, 110, 120, 104, 20); ctx.fillStyle = C.gum; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-175, -20); ctx.bezierCurveTo(-170, 110, -80, 150, 0, 150); ctx.bezierCurveTo(80, 150, 170, 110, 175, -20); ctx.closePath(); ctx.fillStyle = C.gumEdge; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-175, -20); ctx.bezierCurveTo(-170, 100, -80, 136, 0, 136); ctx.bezierCurveTo(60, 136, 110, 110, 130, 60); ctx.lineTo(130, -20); ctx.closePath(); ctx.fillStyle = C.white; ctx.fill();
  rr(-150, -290, 300, 200, 26); ctx.fillStyle = C.gumEdge; ctx.fill(); rr(-150, -290, 260, 192, 26); ctx.fillStyle = C.white; ctx.fill();
  rr(-170, -312, 340, 40, 16); ctx.fillStyle = C.gumEdge; ctx.fill(); rr(-170, -312, 340, 30, 16); ctx.fillStyle = C.white; ctx.fill();
  rr(70, -250, 54, 18, 9); ctx.fillStyle = C.gumEdge; ctx.fill();
  ell(0, -30, 190, 52, C.gumEdge); ell(0, -36, 184, 46, C.white); ell(0, -30, 130, 28, C.sky);
  ell(-60, -200, 50, 12, C.gum, -0.1);
  ctx.restore();
}

/** flat storm cloud (grey, darker belly). ~520x260 px at s = 1 */
export function stormCloud(x, y, s, t = 0) {
  ctx.save(); ctx.translate(x + Math.sin(t * 1.3) * 8, y); ctx.scale(s, s);
  const B = [[-170, 30, 95], [-60, -40, 125], [70, -20, 110], [175, 35, 90], [0, 50, 110]];
  for (const [bx, by, r] of B) circle(bx, by + 14, r, STORM_D);
  for (const [bx, by, r] of B) circle(bx, by, r, STORM);
  rr(-250, 40, 500, 90, 45); ctx.fillStyle = STORM_D; ctx.fill(); rr(-250, 30, 500, 84, 42); ctx.fillStyle = STORM; ctx.fill();
  ell(-80, -110, 60, 18, '#8A95A0', -0.15);
  ctx.restore();
}

/** yellow lightning bolt with an ink outline (graphic). Top at (x, y), ~520 px long at s = 1. a = alpha */
export function lightningBolt(x, y, s, a = 1, rot = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha = a;
  const P = () => { ctx.beginPath(); ctx.moveTo(40, 0); ctx.lineTo(-70, 230); ctx.lineTo(10, 230); ctx.lineTo(-60, 520); ctx.lineTo(110, 180); ctx.lineTo(25, 180); ctx.lineTo(110, 0); ctx.closePath(); };
  ctx.lineJoin = 'round'; P(); ctx.lineWidth = 22; ctx.strokeStyle = C.ink; ctx.stroke(); P(); ctx.fillStyle = C.yellow; ctx.fill();
  ctx.beginPath(); ctx.moveTo(50, 20); ctx.lineTo(-30, 200); ctx.strokeStyle = C.white; ctx.globalAlpha = a * 0.7; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.stroke();
  ctx.restore();
}

/** round skin patch (magnifier view) with a branching fern-like Lichtenberg pattern drawn in pink. p 0..1 grows it.
 *  r = patch radius. Not a burn, not a wound: a soft pink pattern on skin */
export function fernPatch(x, y, r, p = 1) {
  ctx.save(); ctx.translate(x, y);
  circle(0, 0, r + 18, C.ink); circle(0, 0, r, C.skin);
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.clip();
  ell(r * 0.5, r * 0.55, r * 0.7, r * 0.5, C.skinShade);
  ctx.lineCap = 'round';
  const br = (bx, by, ang, len, w, depth, seed, t0) => {
    const k = clamp((p - t0) / 0.3); if (k <= 0 || depth > 3 || len < 8) return;
    const ex = bx + Math.cos(ang) * len * k, ey = by + Math.sin(ang) * len * k;
    line([[bx, by], [ex, ey]], C.pinkDark, w); if (w > 6) line([[bx, by], [ex, ey]], C.pink, w * 0.5);
    if (k < 1) return;
    const n = 3;
    for (let i = 1; i <= n; i++) {
      const u = i / (n + 1), px = bx + Math.cos(ang) * len * u, py = by + Math.sin(ang) * len * u;
      for (const sd of [-1, 1]) br(px, py, ang + sd * (0.75 + rnd(seed + i * 7 + sd) * 0.35), len * (0.42 - u * 0.12), w * 0.6, depth + 1, seed * 3 + i * 11 + sd, t0 + 0.12);
    }
    br(ex, ey, ang + (rnd(seed) - 0.5) * 0.4, len * 0.55, w * 0.75, depth + 1, seed + 5, t0 + 0.1);
  };
  br(-r * 0.9, r * 0.75, -0.75, r * 0.95, 20, 0, 1, 0);
  ctx.restore();
  ctx.beginPath(); ctx.arc(0, 0, r - 14, Math.PI * 1.1, Math.PI * 1.45); ctx.strokeStyle = C.white; ctx.globalAlpha = 0.6; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.stroke(); ctx.globalAlpha = 1;
  ctx.restore();
}

// ═════════════════════════ LIGHTNING SET (2026-11-09 "struck by lightning") ═════════════════════════
const SKY = '#34405A', SKY_D = '#26314A', SLATE = '#2B3A55', SLATE_L = '#3D4F6E', SUN_D = '#F2B807', GLASS = '#DCEFF7';

/** THE room for every real-world shot of the channel: room() with the plant and the picture painted out (they sat
 *  behind the hero). Window stays at x 600-960, y 230-670. Add stormWindow(t, ...) after it for bad weather */
export function home() {
  room(); ctx.fillStyle = C.bg; ctx.fillRect(80, 1040, 200, 320); ctx.fillRect(90, 310, 240, 190);
}

/** (E) outdoor storm: slate sky, darker ground from y = ground. flash 0..1 lightens it (the strike) */
export function skyBg(t, flash = 0, ground = 1160) {
  fillAll(SKY);
  ctx.fillStyle = SKY_D; ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, ground + 30);
  ctx.quadraticCurveTo(540, ground - 50, W + 300, ground + 30); ctx.lineTo(W + 300, H + 300); ctx.closePath(); ctx.fill();
  if (flash > 0) { ctx.save(); ctx.globalAlpha = 0.45 * clamp(flash); fillAll(C.white); ctx.restore(); }
}

/** wavy heat rings around a point (the air heating up). p 0..1 = how far they spread, t = film time */
export function heatRings(x, y, p, t, a = 1) {
  if (p <= 0 || a <= 0) return;
  ctx.save(); ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const k = clamp(p * 1.4 - i * 0.2), r = 90 + k * (150 + i * 90);
    if (k <= 0) continue;
    ctx.globalAlpha = a * (0.95 - i * 0.22); ctx.beginPath();
    for (let an = 0; an <= TAU + 0.01; an += 0.08) { const rr2 = r + Math.sin(an * 9 + t * 8 + i) * 10; const px = x + Math.cos(an) * rr2 * 0.8, py = y + Math.sin(an) * rr2 * 1.25; an ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.closePath(); ctx.strokeStyle = i === 1 ? C.red : C.yellow; ctx.lineWidth = 12; ctx.stroke();
  }
  ctx.restore();
}

/** flat sun (yellow disc, darker ring, rotating rays). ~300 px wide at s = 1 */
export function sun(x, y, s, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(t * 0.6);
  for (let i = 0; i < 10; i++) { ctx.save(); ctx.rotate(i * TAU / 10); ctx.beginPath(); ctx.moveTo(-22, -120); ctx.lineTo(0, -160); ctx.lineTo(22, -120); ctx.closePath(); ctx.fillStyle = SUN_D; ctx.fill(); ctx.restore(); }
  ctx.rotate(-t * 0.6);
  circle(0, 0, 110, SUN_D); circle(-4, -4, 98, C.yellow); ell(-40, -44, 30, 14, C.white + '99', -0.6);
  ctx.restore();
}

/** big thermometer (graphic: white tube, ink outline, red bulb + mercury). level 0..1. ~880 px tall at s = 1 */
export function thermometer(x, y, s, level = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(0, 400, 102, C.ink); rr(-62, -432, 124, 800, 62); ctx.fill();
  rr(-50, -420, 100, 780, 50); ctx.fillStyle = C.white; ctx.fill(); circle(0, 400, 90, C.red);
  const top = lerp(340, -400, clamp(level));
  rr(-26, top, 52, 400 - top, 26); ctx.fillStyle = C.red; ctx.fill();
  for (let i = 0; i < 9; i++) line([[60, 300 - i * 80], [i % 2 ? 90 : 110, 300 - i * 80]], C.ink, 8);
  ell(-24, 370, 22, 30, C.pinkLight, -0.4); rr(-36, -390, 14, 200, 7); ctx.fillStyle = C.gum; ctx.fill();
  ctx.restore();
}
/** canvas y of a thermometer level, for a thermometer drawn at (y, s) */
export const thermoY = (y, s, level) => y + lerp(340, -400, clamp(level)) * s;

/** gift box (blue, yellow ribbon + bow). open 0..1 lifts and tips the lid off. ~340x330 px at s = 1. wob jiggles */
export function giftBox(x, y, s, open = 0, t = 0, wob = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 22) * 0.06 * wob);
  rr(-150, -40, 300, 220, 18); ctx.fillStyle = C.shirtShade; ctx.fill(); rr(-150, -40, 250, 220, [18, 0, 0, 18]); ctx.fillStyle = C.shirt; ctx.fill();
  rr(-24, -40, 48, 220, 4); ctx.fillStyle = C.yellow; ctx.fill(); rr(10, -40, 14, 220, 4); ctx.fillStyle = SUN_D; ctx.fill();
  ctx.save(); const o = clamp(open); ctx.translate(-170 * o * 0.4, -o * 150); ctx.rotate(-o * 0.55);
  rr(-170, -110, 340, 80, 16); ctx.fillStyle = C.shirtShade; ctx.fill(); rr(-170, -110, 340, 64, 16); ctx.fillStyle = C.shirt; ctx.fill();
  rr(-24, -110, 48, 80, 4); ctx.fillStyle = C.yellow; ctx.fill();
  for (const sd of [-1, 1]) { ell(sd * 52, -140, 56, 34, SUN_D, sd * 0.5); ell(sd * 50, -144, 44, 24, C.yellow, sd * 0.5); }
  circle(0, -130, 24, SUN_D);
  ctx.restore();
  ctx.restore();
}

/** simple person icon (head + rounded body), ~110x240 px at s = 1. col = body/head fill */
export function personIcon(x, y, s, col = C.shirt, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  circle(0, -80, 46, col); rr(-58, -20, 116, 140, [52, 52, 14, 14]); ctx.fillStyle = col; ctx.fill();
  ell(-16, -98, 14, 8, C.white + '55', -0.5);
  ctx.restore();
}

/** heartbeat trace across width w centred at (x, y). flat 0..1 flattens it; col = line colour; t = film time */
export function ecg(x, y, w, t, flat = 0, col = C.cyan) {
  const pts = [], amp = 1 - clamp(flat), per = 300;
  for (let i = 0; i <= w; i += 6) {
    const ph = ((i + t * 360) % per) / per;
    let v = 0;
    if (ph > 0.40 && ph < 0.46) v = -lerp(0, 1, (ph - 0.40) / 0.06);
    else if (ph >= 0.46 && ph < 0.52) v = lerp(-1, 0.55, (ph - 0.46) / 0.06);
    else if (ph >= 0.52 && ph < 0.56) v = lerp(0.55, 0, (ph - 0.52) / 0.04);
    else if (ph > 0.7 && ph < 0.82) v = -0.18 * Math.sin((ph - 0.7) / 0.12 * Math.PI);
    pts.push([x - w / 2 + i, y + v * 120 * amp]);
  }
  line(pts, C.ink, 22); line(pts, col, 12);
}

// flat person SILHOUETTE (a generic "someone", not the hero), A-pose. Origin = chest centre; head top -470, feet +640.
// right-side SKIN contour, ~10 px outside the shape: head arc → neck → shoulder → outside of the arm → round the hand →
// inside of the arm → armpit → hip → outside of the leg → foot (mirrored for the left side)
const SIL_L = (() => { const P = []; for (let a = -90; a <= 55; a += 12) P.push([108 * Math.cos(a * Math.PI / 180), -380 + 102 * Math.sin(a * Math.PI / 180)]);
  P.push([50, -262], [110, -250], [179, -224], [254, -14], [277, 144]);
  for (let a = 10; a <= 190; a += 30) P.push([238 + 46 * Math.cos(a * Math.PI / 180), 165 + 46 * Math.sin(a * Math.PI / 180)]);
  P.push([195, 156], [176, 14], [160, -30], [160, 190], [138, 215], [138, 612], [124, 648], [100, 650]); return P; })();
/** silhouette. trace 0..1 runs a glowing current over the SKIN outline from the head to the feet (both sides),
 *  glow 0..1 keeps the whole outline lit. Shoulder point for a helping hand: silShoulder() */
export function silhouette(x, y, s, { trace = 0, glow = 0, t = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const sd of [-1, 1]) { line([[sd * 140, -210], [sd * 215, 0], [sd * 236, 150]], SLATE, 62); circle(sd * 238, 165, 36, SLATE); }
  rr(-128, 170, 116, 470, 40); ctx.fillStyle = SLATE; ctx.fill(); rr(12, 170, 116, 470, 40); ctx.fill();
  rr(-150, -240, 300, 440, [90, 90, 30, 30]); ctx.fill();
  rr(-40, -320, 80, 100, 20); ctx.fill(); ell(0, -380, 98, 92, SLATE);
  ell(-36, -420, 30, 16, SLATE_L, -0.5); rr(-120, -200, 40, 160, 20); ctx.fillStyle = SLATE_L; ctx.fill();
  const k = Math.max(clamp(trace), clamp(glow));
  if (k > 0) {
    const cum = [0]; for (let i = 1; i < SIL_L.length; i++) cum.push(cum[i - 1] + Math.hypot(SIL_L[i][0] - SIL_L[i - 1][0], SIL_L[i][1] - SIL_L[i - 1][1]));
    const len = cum[cum.length - 1], dd = k * len, part = [SIL_L[0]];
    for (let i = 1; i < SIL_L.length; i++) { if (cum[i] <= dd) part.push(SIL_L[i]); else { const f = (dd - cum[i - 1]) / (cum[i] - cum[i - 1]); part.push([lerp(SIL_L[i - 1][0], SIL_L[i][0], f), lerp(SIL_L[i - 1][1], SIL_L[i][1], f)]); break; } }
    for (const sd of [-1, 1]) {
      const P = part.map(([px, py]) => [px * sd, py]);
      line(P, C.ink, 30); line(P, C.yellow, 18); line(P, C.white, 6);
      if (trace > 0 && trace < 1) { const [hx, hy] = P[P.length - 1]; circle(hx, hy, 30 + Math.sin(t * 40) * 6, C.ink); circle(hx, hy, 23, C.yellow); circle(hx, hy, 10, C.white); }
    }
  }
  ctx.restore();
}
/** canvas point of the silhouette's right shoulder (screen right), for silhouette(x, y, s) */
export const silShoulder = (x, y, s) => [x + 150 * s, y - 225 * s];

/** a fern-like Lichtenberg branch pattern (soft red lines, NOT a burn) from (x0, y0) along ang, len px. p 0..1 grows */
export function fernTree(x0, y0, ang, len, w, p = 1, seed = 1) {
  ctx.save(); ctx.lineCap = 'round';
  const br = (bx, by, a, l, ww, depth, sd0, t0) => {
    const k = clamp((p - t0) / 0.3); if (k <= 0 || depth > 3 || l < 8) return;
    const ex = bx + Math.cos(a) * l * k, ey = by + Math.sin(a) * l * k;
    line([[bx, by], [ex, ey]], C.pinkDark, ww); if (ww > 6) line([[bx, by], [ex, ey]], C.red, ww * 0.45);
    if (k < 1) return;
    for (let i = 1; i <= 3; i++) {
      const u = i / 4, px = bx + Math.cos(a) * l * u, py = by + Math.sin(a) * l * u;
      for (const sd of [-1, 1]) br(px, py, a + sd * (0.75 + rnd(sd0 + i * 7 + sd) * 0.35), l * (0.42 - u * 0.12), ww * 0.6, depth + 1, sd0 * 3 + i * 11 + sd, t0 + 0.12);
    }
    br(ex, ey, a + (rnd(sd0) - 0.5) * 0.4, l * 0.55, ww * 0.75, depth + 1, sd0 + 5, t0 + 0.1);
  };
  br(x0, y0, ang, len, w, 0, seed, 0);
  ctx.restore();
}

/** a bare forearm reaching right (sleeve at the left, hand at the right), skin with a soft underside shade.
 *  fern 0..1 grows a red Lichtenberg fern on the skin, fade 0..1 fades it away. Hand fingertips at x + 600 s */
export function forearm(x, y, s, { fern = 0, fade = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const arm = () => { ctx.beginPath(); ctx.moveTo(-700, -125); ctx.quadraticCurveTo(0, -140, 330, -85); ctx.lineTo(330, 85); ctx.quadraticCurveTo(0, 130, -700, 125); ctx.closePath(); };
  arm(); ctx.fillStyle = C.skin; ctx.fill();
  ctx.save(); arm(); ctx.clip(); ell(-180, 140, 620, 70, C.skinShade);
  if (fern > 0 && fade < 1) { ctx.globalAlpha = 1 - clamp(fade); fernTree(-330, 50, -0.12, 370, 16, fern, 3); fernTree(-120, 70, -0.55, 200, 10, clamp(fern * 1.3 - 0.3), 9); }
  ctx.restore();
  for (const [fy, fl] of [[-62, 230], [-20, 260], [22, 250], [62, 210]]) line([[360, fy], [360 + fl, fy * 1.15]], C.skin, 46);
  for (const [fy, fl] of [[-62, 230], [-20, 260], [22, 250], [62, 210]]) line([[360 + fl * 0.55, fy * 1.1 - 18], [360 + fl * 0.55, fy * 1.1 + 18]], C.skinShade, 5);
  ell(390, 0, 130, 110, C.skin); line([[340, -80], [420, -150], [500, -160]], C.skin, 50);
  ell(380, 70, 90, 30, C.skinShade);
  rr(-760, -165, 220, 330, 30); ctx.fillStyle = C.shirt; ctx.fill(); rr(-560, -165, 20, 330, 10); ctx.fillStyle = C.shirtShade; ctx.fill();
  ell(-200, -95, 160, 14, C.white + '55', -0.02);
  ctx.restore();
}

/** a helping arm reaching in from (fromX, fromY) to the hand point (hx, hy): blue sleeve + skin forearm + hand */
export function reachArm(fromX, fromY, hx, hy, s = 1) {
  const mx = lerp(fromX, hx, 0.45), my = lerp(fromY, hy, 0.45);
  line([[fromX, fromY], [hx, hy]], C.skin, 60 * s); line([[fromX, fromY], [mx, my]], C.shirt, 84 * s);
  ell(hx, hy, 46 * s, 34 * s, C.skin, Math.atan2(hy - fromY, hx - fromX)); ell(hx + 6 * s, hy + 16 * s, 26 * s, 10 * s, C.skinShade, 0.2);
}

/** smartphone (ink body, white screen, big number, green call button). text = shown digits, ring 0..1 wiggles + rings */
export function phone(x, y, s, text = '911', ring = 0, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 38) * 0.07 * ring); ctx.scale(s, s);
  rr(-150, -280, 300, 560, 48); ctx.fillStyle = C.ink; ctx.fill();
  rr(-126, -240, 252, 460, 26); ctx.fillStyle = C.white; ctx.fill(); rr(-40, -262, 80, 12, 6); ctx.fillStyle = '#3A3A42'; ctx.fill();
  ctx.fillStyle = C.ink; ctx.font = '900 112px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, -80);
  circle(0, 110, 62, C.leaf);
  ctx.save(); ctx.translate(0, 110); ctx.rotate(-0.7); rr(-32, -11, 64, 22, 11); ctx.fillStyle = C.white; ctx.fill(); rr(-36, -11, 18, 34, 8); ctx.fill(); rr(18, -11, 18, 34, 8); ctx.fill(); ctx.restore();
  ctx.restore();
  if (ring > 0) {
    ctx.save(); ctx.globalAlpha = clamp(ring); ctx.strokeStyle = C.ink; ctx.lineWidth = 12; ctx.lineCap = 'round';
    for (const sd of [-1, 1]) for (const r of [200, 250]) { ctx.beginPath(); ctx.arc(x, y - 120 * s, r * s, sd < 0 ? Math.PI * 1.05 : -Math.PI * 0.35, sd < 0 ? Math.PI * 1.35 : -Math.PI * 0.05); ctx.stroke(); }
    ctx.restore();
  }
}

/** CPR icon: a heart with two stacked hands pressing on it. press 0..1 pushes the hands down and squashes the heart */
export function cprIcon(x, y, s, press = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const p = clamp(press);
  ctx.save(); ctx.translate(0, 60); ctx.scale(1 + p * 0.08, 1 - p * 0.12); heart(0, 0, 1.25); ctx.restore();
  const dy = p * 26;
  for (const sd of [-1, 1]) { line([[sd * 230, -330 + dy], [sd * 40, -80 + dy]], C.skin, 56); line([[sd * 300, -420 + dy], [sd * 190, -276 + dy]], C.shirt, 80); }
  ell(0, -40 + dy, 110, 44, C.skinShade); ell(0, -50 + dy, 104, 40, C.skin);
  ell(0, -96 + dy, 96, 40, C.skinShade); ell(0, -104 + dy, 92, 36, C.skin);
  line([[-60, -104 + dy], [60, -104 + dy]], C.skinShade, 6);
  for (const sd of [-1, 1]) K_arrowDown(sd * 190, -40 + dy * 0.5, p);
  ctx.restore();
}
function K_arrowDown(x, y, a) {
  ctx.save(); ctx.globalAlpha = 0.35 + 0.65 * a; ctx.translate(x, y);
  ctx.beginPath(); ctx.moveTo(-18, -60); ctx.lineTo(18, -60); ctx.lineTo(18, 0); ctx.lineTo(42, 0); ctx.lineTo(0, 50); ctx.lineTo(-42, 0); ctx.lineTo(-18, 0); ctx.closePath(); ctx.fillStyle = C.red; ctx.fill();
  ctx.restore();
}

/** tall glass water jug / pitcher (handle right, spout top-left), pale blue water up to fill 0..1. ~330x400 px at s = 1.
 *  Origin = jug centre. Next-episode tease prop: nobody drinks from it on screen */
export function waterJug(x, y, s, fill = 0.8, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(110, -130); ctx.bezierCurveTo(230, -130, 230, 90, 110, 100); ctx.strokeStyle = C.gumEdge; ctx.lineWidth = 36; ctx.stroke();
  const body = () => { ctx.beginPath(); ctx.moveTo(-170, -200); ctx.lineTo(-120, -175); ctx.lineTo(120, -175); ctx.quadraticCurveTo(140, -120, 135, 160); ctx.quadraticCurveTo(132, 200, 95, 200); ctx.lineTo(-95, 200); ctx.quadraticCurveTo(-132, 200, -135, 160); ctx.quadraticCurveTo(-140, -80, -128, -150); ctx.closePath(); };
  body(); ctx.fillStyle = C.gumEdge; ctx.fill();
  ctx.save(); ctx.scale(0.92, 0.94); body(); ctx.fillStyle = GLASS; ctx.fill(); body(); ctx.clip();
  if (fill > 0) {
    const lv = lerp(210, -150, clamp(fill));
    ctx.beginPath(); ctx.moveTo(-200, 260); for (let xx = -200; xx <= 160; xx += 15) ctx.lineTo(xx, lv + Math.sin(xx * 0.04 + t * 4) * 7); ctx.lineTo(160, 260); ctx.closePath();
    ctx.fillStyle = C.sky; ctx.fill();
    ctx.beginPath(); for (let xx = -200; xx <= 160; xx += 15) ctx.lineTo(xx, lv + 10 + Math.sin(xx * 0.04 + t * 4) * 7); ctx.strokeStyle = C.white; ctx.globalAlpha = 0.6; ctx.lineWidth = 8; ctx.stroke(); ctx.globalAlpha = 1;
  }
  rr(-104, -120, 24, 270, 12); ctx.fillStyle = C.white; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1;
  ctx.restore();
  ctx.restore();
}

// ═════════════════════════ WATER SET (2026-11-09 "drink too much water") ═════════════════════════
const BLOOD = '#B83A55', BLOOD_D = '#A3304A', RBC = '#D62839', RBC_D = '#A81E2D', WATER_D = '#7EC3E0', BONE = '#F7F4EE', BONE_D = '#DCD3C3';

/** plain drinking glass (tumbler, no text), pale blue water up to fill 0..1. Origin = glass centre, ~170x230 px at s = 1.
 *  rot tilts it (drinking). Safe to put in the hero's hand with man({ holding }) */
export function glass(x, y, s, fill = 0.7, t = 0, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const body = () => { ctx.beginPath(); ctx.moveTo(-85, -115); ctx.lineTo(85, -115); ctx.lineTo(68, 105); ctx.quadraticCurveTo(66, 118, 52, 118); ctx.lineTo(-52, 118); ctx.quadraticCurveTo(-66, 118, -68, 105); ctx.closePath(); };
  body(); ctx.fillStyle = C.gumEdge; ctx.fill();
  ctx.save(); ctx.scale(0.88, 0.92); body(); ctx.fillStyle = GLASS; ctx.fill(); body(); ctx.clip();
  if (fill > 0) {
    ctx.rotate(-rot);                                        // the water surface stays level when the glass tips
    const lv = lerp(130, -110, clamp(fill));
    ctx.beginPath(); ctx.moveTo(-200, 260); for (let xx = -200; xx <= 200; xx += 16) ctx.lineTo(xx, lv + Math.sin(xx * 0.05 + t * 4) * 5); ctx.lineTo(200, 260); ctx.closePath();
    ctx.fillStyle = C.sky; ctx.fill();
    ctx.rotate(rot);
  }
  rr(-58, -90, 18, 180, 9); ctx.fillStyle = C.white; ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1;
  ctx.restore();
  ctx.restore();
}

/** salt shaker (white body, grey shade, silver cap with holes). Origin = body centre, ~200x330 px at s = 1. rot tilts it.
 *  sil = a colour draws it as a flat silhouette instead (mystery beat before the reveal) */
export function saltShaker(x, y, s, rot = 0, sil = null) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (sil) {                                                 // flat one-colour silhouette (the "what is it?" beat)
    rr(-90, -90, 180, 250, 50); ctx.fillStyle = sil; ctx.fill();
    ctx.beginPath(); ctx.moveTo(-80, -90); ctx.quadraticCurveTo(-80, -170, 0, -170); ctx.quadraticCurveTo(80, -170, 80, -90); ctx.closePath(); ctx.fill();
    rr(-90, -100, 180, 26, 12); ctx.fill(); ctx.restore(); return;
  }
  rr(-90, -90, 180, 250, 50); ctx.fillStyle = BONE_D; ctx.fill(); rr(-90, -90, 160, 250, 50); ctx.fillStyle = C.white; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-80, -90); ctx.quadraticCurveTo(-80, -170, 0, -170); ctx.quadraticCurveTo(80, -170, 80, -90); ctx.closePath(); ctx.fillStyle = C.gumEdge; ctx.fill();
  rr(-90, -100, 180, 26, 12); ctx.fillStyle = '#B3AA9A'; ctx.fill();
  for (const [hx, hy] of [[-30, -135], [0, -148], [30, -135], [-14, -118], [16, -118]]) circle(hx, hy, 7, C.ink);
  ell(-52, -20, 12, 40, C.gum, 0); ctx.restore();
}

/** one salt (sodium) grain: little white cube with a shaded side. ~30 px at s = 1. a = alpha */
export function saltGrain(x, y, s = 1, rot = 0, a = 1) {
  if (a <= 0 || s <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-15, -15, 30, 30, 6); ctx.fillStyle = BONE_D; ctx.fill(); rr(-15, -15, 24, 24, 6); ctx.fillStyle = C.white; ctx.fill();
  ctx.restore();
}

/** water drop (pale blue teardrop, darker edge, white glint). ~50x70 px at s = 1, tip points along rot (0 = up) */
export function drop(x, y, s = 1, rot = 0, a = 1) {
  if (a <= 0 || s <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const p = (k) => { ctx.beginPath(); ctx.moveTo(0, -40 * k); ctx.bezierCurveTo(14 * k, -18 * k, 26 * k, 0, 26 * k, 14 * k); ctx.arc(0, 14 * k, 26 * k, 0, Math.PI); ctx.bezierCurveTo(-26 * k, 0, -14 * k, -18 * k, 0, -40 * k); };
  p(1.12); ctx.fillStyle = WATER_D; ctx.fill(); p(1); ctx.fillStyle = C.sky; ctx.fill();
  ell(-9, 12, 6, 10, C.white, 0.3);
  ctx.restore();
}

/** slim flat arrow in any colour (water flow = C.sky, pressure = C.red). len px, w = shaft width */
export function flowArrow(x, y, len, ang = 0, a = 1, col = C.sky, w = 22, edge = null) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.globalAlpha = clamp(a);
  const hl = w * 2.2, hw = w * 1.7;
  const p = () => { ctx.beginPath(); ctx.moveTo(-len / 2, -w / 2); ctx.lineTo(len / 2 - hl, -w / 2); ctx.lineTo(len / 2 - hl, -hw); ctx.lineTo(len / 2, 0); ctx.lineTo(len / 2 - hl, hw); ctx.lineTo(len / 2 - hl, w / 2); ctx.lineTo(-len / 2, w / 2); ctx.closePath(); };
  ctx.lineJoin = 'round'; p(); ctx.lineWidth = 10; ctx.strokeStyle = edge || (col === C.sky ? WATER_D : RBC_D); ctx.stroke(); ctx.fillStyle = col; ctx.fill();
  ctx.restore();
}

/** (F) inside a blood vessel, macro: deep pink-red with soft darker blobs and drifting red blood cells. t = film time */
export function insideBlood(t) {
  fillAll(BLOOD);
  for (let i = 0; i < 7; i++) circle(rnd(i + 40) * W + Math.sin(t * 0.7 + i) * 24, rnd(i + 50) * H + Math.cos(t * 0.6 + i) * 24, 130 + rnd(i + 60) * 120, BLOOD_D);
  for (let i = 0; i < 9; i++) {
    const x = ((rnd(i + 70) * (W + 300) + t * (30 + rnd(i) * 30)) % (W + 300)) - 150, y = rnd(i + 80) * H;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rnd(i + 90) * 3); ctx.globalAlpha = 0.55;
    ell(0, 0, 54, 40, RBC); ell(0, 0, 26, 18, RBC_D); ctx.restore();
  }
}

/** a round body cell (soft pink, light rim, nucleus, glint). r = radius px. swell 0..1 puffs it up (+45%), stretches the
 *  rim and shows blue water inside. Returns the drawn radius */
export function cell(x, y, r, { swell = 0, t = 0, wob = 0 } = {}) {
  const R = r * (1 + 0.45 * clamp(swell)), j = Math.sin(t * 12) * 0.03 * wob;
  ctx.save(); ctx.translate(x, y); ctx.scale(1 + j, 1 - j);
  circle(0, 0, R + 16, C.gum); circle(0, 0, R, C.pinkLight);
  if (swell > 0) { ctx.save(); ctx.globalAlpha = 0.55 * clamp(swell); circle(0, R * 0.12, R * 0.82, C.sky); ctx.restore(); }
  circle(R * 0.12, R * 0.1, r * 0.3 + 10, C.pinkDark); circle(R * 0.12, R * 0.1, r * 0.3, C.pink);
  ell(-R * 0.45, -R * 0.5, R * 0.2, R * 0.09, C.white, -0.7);
  if (swell > 0.6) { ctx.save(); ctx.globalAlpha = (swell - 0.6) / 0.4; ctx.strokeStyle = C.white; ctx.lineWidth = 8; ctx.lineCap = 'round';
    for (const an of [0.3, 1.9, 3.6, 5.0]) { ctx.beginPath(); ctx.arc(0, 0, R + 34, an, an + 0.35); ctx.stroke(); } ctx.restore(); }
  ctx.restore();
  return R;
}

/** balance scale (ink graphic): post, beam, two pans. Left pan holds salt grains, right pan a water drop.
 *  tilt in rad (+ = right side down). ~520x420 px at s = 1, origin = beam pivot */
export function balance(x, y, s, tilt = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round';
  rr(-14, 0, 28, 300, 10); ctx.fillStyle = C.ink; ctx.fill(); rr(-110, 290, 220, 34, 16); ctx.fill();
  ctx.save(); ctx.rotate(tilt); line([[-230, 0], [230, 0]], C.ink, 18); ctx.restore();
  circle(0, 0, 24, C.yellow);
  for (const sd of [-1, 1]) {
    const px = Math.cos(tilt) * 230 * sd, py = Math.sin(tilt) * 230 * sd;
    line([[px, py], [px - 80, py + 140]], C.ink, 6); line([[px, py], [px + 80, py + 140]], C.ink, 6);
    ctx.beginPath(); ctx.moveTo(px - 110, py + 140); ctx.quadraticCurveTo(px, py + 210, px + 110, py + 140); ctx.closePath(); ctx.fillStyle = C.ink; ctx.fill();
    if (sd < 0) { for (const [gx, gy] of [[-40, 118], [0, 112], [40, 118], [-20, 92], [20, 92], [0, 70]]) saltGrain(px + gx, py + gy, 1.1, gx * 0.01); }
    else drop(px, py + 90, 1.2);
  }
  ctx.restore();
}

/** kidney (deep red bean, darker rim, pink highlight, ureter leaving the inner notch). flip = mirror (notch on the left).
 *  ~260x380 px at s = 1. kidneyHilum gives the notch point in canvas coords */
export function kidney(x, y, s, flip = false) {
  ctx.save(); ctx.translate(x, y); ctx.scale(flip ? -s : s, s);
  const B = () => { ctx.beginPath(); ctx.moveTo(60, -40); ctx.bezierCurveTo(130, -100, 120, -200, 10, -190); ctx.bezierCurveTo(-140, -180, -150, 180, 10, 190);
    ctx.bezierCurveTo(120, 200, 130, 100, 60, 40); ctx.quadraticCurveTo(40, 0, 60, -40); ctx.closePath(); };
  B(); ctx.lineWidth = 22; ctx.strokeStyle = RBC_D; ctx.lineJoin = 'round'; ctx.stroke(); ctx.fillStyle = BLOOD; ctx.fill();
  ctx.save(); ctx.translate(-10, -8); ctx.scale(0.86, 0.88); ctx.globalAlpha = 0.6; B(); ctx.fillStyle = C.pinkDark; ctx.fill(); ctx.restore();
  ell(-50, -110, 34, 16, C.pinkLight, -0.9);
  ctx.restore();
}
export const kidneyHilum = (x, y, s, flip = false) => [x + (flip ? -1 : 1) * 52 * s, y];

/** speed gauge (graphic, no numbers): ink dial, green → yellow → red arc, red needle. level 0..1 (1 = red end). */
export function speedGauge(x, y, s, level = 0, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  ctx.beginPath(); ctx.arc(0, 0, 180, Math.PI, TAU); ctx.lineTo(180, 50); ctx.lineTo(-180, 50); ctx.closePath(); ctx.fillStyle = C.ink; ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0, 154, Math.PI, TAU); ctx.lineTo(154, 30); ctx.lineTo(-154, 30); ctx.closePath(); ctx.fillStyle = C.white; ctx.fill();
  const band = (a0, a1, col) => { ctx.beginPath(); ctx.arc(0, 0, 122, Math.PI + a0 * Math.PI, Math.PI + a1 * Math.PI); ctx.strokeStyle = col; ctx.lineWidth = 30; ctx.lineCap = 'butt'; ctx.stroke(); };
  band(0, 0.5, C.leaf); band(0.5, 0.75, C.yellow); band(0.75, 1, C.red);
  ctx.save(); ctx.rotate(Math.PI + clamp(level) * Math.PI); rr(-10, -11, 135, 22, 11); ctx.fillStyle = C.red; ctx.fill(); ctx.restore();
  circle(0, 0, 24, C.ink);
  ctx.restore();
}

/** side-view skull outline for the x-ray film (cyan outline on dark film, face on the LEFT to match brain()).
 *  Holds brain(x, y, s * 0.92) with room to swell. ~760x700 px at s = 1 */
export function skull(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const P = () => { ctx.beginPath(); ctx.moveTo(-300, 140);
    ctx.bezierCurveTo(-400, -60, -280, -330, 0, -330); ctx.bezierCurveTo(260, -330, 380, -160, 360, 40);
    ctx.bezierCurveTo(350, 170, 300, 240, 200, 270); ctx.lineTo(120, 280); ctx.lineTo(80, 380); ctx.lineTo(-220, 380);
    ctx.quadraticCurveTo(-270, 380, -280, 340); ctx.lineTo(-330, 300); ctx.lineTo(-320, 250); ctx.lineTo(-360, 230); ctx.quadraticCurveTo(-340, 180, -300, 140); ctx.closePath(); };
  P(); ctx.fillStyle = C.xnavy; ctx.fill();
  P(); ctx.strokeStyle = C.cyan; ctx.lineWidth = 26; ctx.stroke();
  ctx.save(); ctx.globalAlpha = 0.45; ctx.beginPath(); ctx.ellipse(-250, 140, 52, 46, 0, 0, TAU); ctx.strokeStyle = C.cyan; ctx.lineWidth = 12; ctx.stroke();
  for (let i = 0; i < 6; i++) rr(-250 + i * 34, 330, 22, 40, 8), ctx.fillStyle = C.cyan, ctx.fill();
  ctx.restore();
  ctx.restore();
}

/** red pressure arrows pushing OUT from inside an ellipse (rx, ry) toward its rim. p 0..1 = strength (alpha + push), t pulses */
export function pressureArrows(x, y, rx, ry, p, t = 0, angs = [-2.6, -1.57, -0.55, 0.25, -3.4]) {
  if (p <= 0) return;
  const k = 0.5 + 0.5 * Math.sin(t * 10);
  for (const an of angs) {
    const d = 0.62 + 0.1 * p * k;
    flowArrow(x + Math.cos(an) * rx * d, y + Math.sin(an) * ry * d, 120, an, clamp(p * 1.4), C.red, 20);
  }
}

/** symptom badge: white disc with an ink ring and a simple icon. kind 'head' (red ache zigzags) | 'sick' (green queasy face)
 *  | 'confused' (swirl + ?) | 'seizure' (brain with yellow spark lines). ~300 px wide at s = 1. sc = pop-in */
export function symptom(kind, x, y, s, sc = 1, t = 0) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  circle(0, 0, 150, C.ink); circle(0, 0, 134, C.white); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const face = (col, eyes = 'n') => { circle(0, 6, 82, col); if (eyes === 'n') { ell(-28, -4, 9, 12, C.ink); ell(28, -4, 9, 12, C.ink); } };
  if (kind === 'head') {
    face(C.skin); line([[-26, 40], [26, 40]], C.mouth, 8);
    line([[-24, -34], [-6, -26]], C.hair, 8); line([[24, -34], [6, -26]], C.hair, 8);
    for (const sd of [-1, 1]) { const w = Math.sin(t * 14) * 4; line([[sd * 60, -88 + w], [sd * 78, -104], [sd * 70, -118], [sd * 92, -130 + w]], C.red, 10); }
  } else if (kind === 'sick') {
    face('#A8D8A0'); ctx.beginPath(); for (let i = 0; i <= 8; i++) ctx.lineTo(-30 + i * 7.5, 42 + (i % 2 ? -7 : 7)); ctx.strokeStyle = '#2F6B3A'; ctx.lineWidth = 7; ctx.stroke();
    ell(-30, 34, 12, 7, C.leaf); ell(30, 34, 12, 7, C.leaf);
  } else if (kind === 'confused') {
    face(C.skin, 'x');
    for (const sd of [-1, 1]) { ctx.beginPath(); for (let i = 0; i <= 24; i++) { const an = i / 24 * TAU * 1.5 + t * 6 * sd, r = 2 + i * 0.6; ctx.lineTo(sd * 30 + Math.cos(an) * r, -4 + Math.sin(an) * r); } ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(-20, 44); ctx.quadraticCurveTo(0, 34, 20, 46); ctx.strokeStyle = C.mouth; ctx.lineWidth = 7; ctx.stroke();
    ctx.font = '900 70px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.strokeText('?', 78, -84); ctx.fillStyle = C.yellow; ctx.fillText('?', 78, -84);
  } else if (kind === 'seizure') {
    brain(0, 14, 0.36, { t, wob: 1 });
    for (const [dx, dy, r] of [[-96, -70, -0.6], [96, -70, 0.6], [0, -112, 0]]) { ctx.save(); ctx.translate(dx, dy); ctx.rotate(r); line([[-8, 18], [8, 2], [-6, -6], [8, -22]], C.yellow, 9); ctx.restore(); }
  }
  ctx.restore();
}

/** endurance athlete icon: personIcon with a red headband and a white race bib (no number). sc = pop-in */
export function athleteIcon(x, y, s, sc = 1, col = C.shirt) {
  if (sc <= 0) return;
  personIcon(x, y, s, col, sc);
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-48, -104, 96, 18, 9); ctx.fillStyle = C.red; ctx.fill();
  rr(-36, 14, 72, 58, 10); ctx.fillStyle = C.white; ctx.fill(); rr(-26, 30, 52, 10, 5); ctx.fillStyle = C.red; ctx.fill(); rr(-26, 48, 34, 8, 4); ctx.fillStyle = C.gumEdge; ctx.fill();
  ctx.restore();
}

/** knuckle joint magnifier (graphic): ink lens ring + handle, inside two rounded bone ends with a pale fluid gap and a gas
 *  bubble forming. bubble 0..1 grows it, pop 0..1 bursts it. r = lens radius. sc = pop-in */
export function jointLens(x, y, r, { bubble = 0, pop = 0, t = 0 } = {}, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.save(); ctx.rotate(0.75); rr(r - 10, -26, r * 0.75, 52, 24); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore();
  circle(0, 0, r + 22, C.ink); circle(0, 0, r, C.pinkLight);
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.clip();
  ell(0, 0, r * 0.95, r * 0.36, '#F7E7A8');                               // joint fluid
  rr(-r * 0.5, -r * 1.3, r, r * 1.05, r * 0.5); ctx.fillStyle = BONE_D; ctx.fill(); rr(-r * 0.5, -r * 1.3, r * 0.86, r * 1.03, r * 0.45); ctx.fillStyle = BONE; ctx.fill();
  rr(-r * 0.5, r * 0.25, r, r * 1.05, r * 0.5); ctx.fillStyle = BONE_D; ctx.fill(); rr(-r * 0.5, r * 0.25, r * 0.86, r * 1.03, r * 0.45); ctx.fillStyle = BONE; ctx.fill();
  if (bubble > 0 && pop < 1) {
    const br = Math.max(0, r * 0.2 * clamp(bubble) * (1 + pop * 0.6) + Math.sin(t * 8) * 2);
    if (br > 0.5) { ctx.save(); ctx.globalAlpha = 1 - pop; circle(r * 0.12, 0, br + 6, WATER_D); circle(r * 0.12, 0, br, C.white); ell(r * 0.12 - br * 0.35, -br * 0.35, br * 0.25, br * 0.15, C.sky, -0.6); ctx.restore(); }
  }
  ctx.restore();
  ell(-r * 0.5, -r * 0.55, r * 0.18, r * 0.08, C.white + '88', -0.7);
  ctx.restore();
}

// ═════════════════════════ KNUCKLE SET (2026-11-09 "crack your knuckles every day") ═════════════════════════
const FLUID = '#F7E7A8', FLUID_D = '#E9D488', CYAN_D = '#3BB2CA', GLASS_G = '#5BAE6A', GLASS_GD = '#468F55', CORK = '#C8734A', CORK_D = '#A85E3A';

/** clean knuckle-joint cutaway for the x-ray film, lying SIDEWAYS: hand bone (round head) from the left, finger bone
 *  (shallow cup) from the right, white cartilage caps, a pink capsule full of pale joint fluid.
 *  gap 0..1 pulls the bones apart (0 → 130 px at s = 1), gas 0..1 shows tiny dissolved gas dots in the fluid,
 *  gather 0..1 drifts those dots into the gap, bubble 0..1 grows one gas cavity in the gap, pop 0..1 bursts it,
 *  shine 0..1 slides white "slippery" glints through the fluid. Width ~890 px at gap 1, height ~470 px. Origin = joint centre */
export function jointCutaway(x, y, s, { gap = 0, gas = 0, gather = 0, bubble = 0, pop = 0, shine = 0, t = 0 } = {}) {
  const g = 130 * clamp(gap), hg = g / 2, LEN = 330;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // capsule + fluid
  const cap = () => rr(-hg - 215, -230, 430 + g, 460, 150);
  cap(); ctx.fillStyle = C.pinkDark; ctx.fill();
  ctx.save(); ctx.translate(0, 0); rr(-hg - 199, -214, 398 + g, 428, 136); ctx.fillStyle = C.pink; ctx.fill(); ctx.restore();
  rr(-hg - 181, -196, 362 + g, 392, 120); ctx.fillStyle = FLUID; ctx.fill();
  ctx.save(); ctx.globalAlpha = 0.5; ell(0, 150, 150 + hg, 26, FLUID_D); ctx.restore();
  if (shine > 0) {
    ctx.save(); ctx.globalAlpha = 0.85 * clamp(shine); ctx.strokeStyle = C.white; ctx.lineWidth = 10;
    for (const [yy, k] of [[-160, 0], [165, 0.5]]) { const sx = lerp(-150, 150, (t * 0.7 + k) % 1); ctx.beginPath(); ctx.moveTo(sx - 40, yy + 4); ctx.quadraticCurveTo(sx, yy - 6, sx + 40, yy + 4); ctx.stroke(); }
    ctx.restore();
  }
  // bones: the hand bone (left, round head) and the finger bone (right, cup)
  const boneL = () => { ctx.beginPath(); ctx.moveTo(-hg - LEN - 40, -70); ctx.lineTo(-hg - 120, -78); ctx.bezierCurveTo(-hg - 60, -140, -hg + 4, -90, -hg + 4, 0);
    ctx.bezierCurveTo(-hg + 4, 90, -hg - 60, 140, -hg - 120, 78); ctx.lineTo(-hg - LEN - 40, 70); ctx.closePath(); };
  const boneR = () => { ctx.beginPath(); ctx.moveTo(hg + 8, -112); ctx.quadraticCurveTo(hg + 56, 0, hg + 8, 112); ctx.lineTo(hg + 70, 104); ctx.lineTo(hg + 140, 66);
    ctx.lineTo(hg + LEN + 40, 60); ctx.lineTo(hg + LEN + 40, -60); ctx.lineTo(hg + 140, -66); ctx.lineTo(hg + 70, -104); ctx.closePath(); };
  for (const [B, kx] of [[boneL, -1], [boneR, 1]]) {
    B(); ctx.fillStyle = CYAN_D; ctx.fill();
    ctx.save(); ctx.translate(0, -8); B(); ctx.fillStyle = C.cyan; ctx.fill(); ctx.restore();
    const ex = kx * (hg + LEN + 40);                                       // the far end: a rounded knob
    ell(ex, 0, 64, 92, CYAN_D); ell(ex, -6, 60, 86, C.cyan);
    ell(kx * (hg + LEN * 0.55), -40, 80, 10, C.white + '77');
  }
  // cartilage caps (white) on the two joint faces
  ctx.strokeStyle = C.white; ctx.lineWidth = 14;
  ctx.beginPath(); ctx.moveTo(-hg - 44, -110); ctx.bezierCurveTo(-hg - 6, -84, -hg - 6, 84, -hg - 44, 110); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(hg + 16, -100); ctx.quadraticCurveTo(hg + 62, 0, hg + 16, 100); ctx.stroke();
  // dissolved gas dots: in the fluid pockets above/below the bones, drifting to the gap with gather
  const GD = [[-120, -165, 9], [-40, -175, 7], [60, -168, 10], [140, -160, 7], [-90, 168, 8], [10, 175, 10], [110, 165, 8], [-160, 150, 6], [170, -140, 6], [180, 150, 7]];
  if (gas > 0) {
    GD.forEach(([gx, gy, r], i) => {
      const k = eioK(clamp(gather * 1.2 - i * 0.02)), px = lerp(gx + Math.sin(t * 2 + i) * 6, 0, k), py = lerp(gy + Math.cos(t * 1.7 + i) * 4, 0, k);
      ctx.save(); ctx.globalAlpha = clamp(gas) * (1 - k * 0.9); circle(px, py, r + 3, WATER_D_K); circle(px, py, r, C.white); ctx.restore();
    });
  }
  // the gas cavity in the gap, and its burst
  if (bubble > 0 && pop < 1) {
    const br = Math.max(0, 52 * clamp(bubble) * (1 + 0.5 * clamp(pop)) + Math.sin(t * 7) * 2);
    if (br > 0.5) { ctx.save(); ctx.globalAlpha = 1 - clamp(pop); ell(0, 0, br * 1.25 + 6, br + 6, WATER_D_K); ell(0, 0, br * 1.25, br, C.white); ell(-br * 0.4, -br * 0.4, br * 0.3, br * 0.16, C.sky, -0.5); ctx.restore(); }
  }
  if (pop > 0 && pop < 1) {
    ctx.save(); ctx.globalAlpha = 1 - pop; ctx.strokeStyle = C.white; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.ellipse(0, 0, Math.max(0, 70 + pop * 120), Math.max(0, 56 + pop * 100), 0, 0, TAU); ctx.stroke();
    for (let i = 0; i < 6; i++) { const an = i * TAU / 6 + 0.3, d = 60 + pop * 140; circle(Math.cos(an) * d, Math.sin(an) * d * 0.8, Math.max(0, 9 * (1 - pop)), C.white); }
    ctx.restore();
  }
  ctx.restore();
}
const WATER_D_K = '#7EC3E0';
const eioK = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** canvas half-width of the jointCutaway at (s, gap): handy to keep the bone ends inside the frame */
export const jointHalfW = (s, gap = 0) => (65 * clamp(gap) + 330 + 40 + 64) * s;

/** green bottle with a cork (flat, darker shade, white glint). pop 0..1 shoots the cork up-right, spinning.
 *  corkA 0..1 = cork alpha (fade it out while it is still flying so it never hangs mid-air).
 *  Origin = body centre; ~150x520 px at s = 1 (cork top at -370) */
export function bottle(x, y, s, pop = 0, corkA = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const body = () => { ctx.beginPath(); ctx.moveTo(-34, -300); ctx.lineTo(34, -300); ctx.lineTo(34, -190); ctx.bezierCurveTo(34, -150, 95, -150, 95, -90);
    ctx.lineTo(95, 150); ctx.quadraticCurveTo(95, 170, 75, 170); ctx.lineTo(-75, 170); ctx.quadraticCurveTo(-95, 170, -95, 150); ctx.lineTo(-95, -90); ctx.bezierCurveTo(-95, -150, -34, -150, -34, -190); ctx.closePath(); };
  body(); ctx.fillStyle = GLASS_GD; ctx.fill();
  ctx.save(); ctx.translate(-8, 0); ctx.scale(0.9, 1); body(); ctx.fillStyle = GLASS_G; ctx.fill(); ctx.restore();
  rr(-95, -40, 190, 120, 6); ctx.fillStyle = C.white; ctx.fill(); rr(-95, -40, 190, 18, 4); ctx.fillStyle = C.gumEdge; ctx.fill();
  rr(-64, -110, 16, 60, 8); ctx.fillStyle = C.white + '99'; ctx.fill();
  rr(-40, -312, 80, 22, 10); ctx.fillStyle = GLASS_GD; ctx.fill();
  const p = clamp(pop);
  ctx.save(); ctx.globalAlpha = clamp(corkA); ctx.translate(p * 260, -330 - p * 300 + p * p * 120); ctx.rotate(p * 4.2);
  rr(-30, -40, 60, 80, 12); ctx.fillStyle = CORK_D; ctx.fill(); rr(-30, -40, 48, 80, [12, 0, 0, 12]); ctx.fillStyle = CORK; ctx.fill();
  circle(-10, -14, 5, CORK_D); circle(6, 14, 4, CORK_D);
  ctx.restore();
  if (p > 0 && p < 1) { ctx.save(); ctx.globalAlpha = 1 - p; for (let i = 0; i < 5; i++) circle(-30 + i * 15 + Math.sin(i * 2) * 10, -330 - p * 90 - (i % 2) * 24, Math.max(0, 14 + p * 16 - i * 2), C.white); ctx.restore(); }
  ctx.restore();
}
/** where the cork is (canvas) for bottle(x, y, s, pop) */
export const corkAt = (x, y, s, pop = 0) => { const p = clamp(pop); return [x + p * 260 * s, y + (-330 - p * 300 + p * p * 120) * s]; };

/** green check badge (ink ring, green disc, white tick). sc = pop-in. ~120 px wide at s = 1 */
export function checkMark(x, y, s = 1, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  circle(0, 0, 60, C.ink); circle(0, 0, 50, GLASS_G); ell(-18, -24, 16, 8, C.white + '66', -0.6);
  line([[-24, 2], [-6, 22], [26, -18]], C.white, 14);
  ctx.restore();
}

/** a stack of three fanned study clipboards (bigger studies). p 0..1 deals them in one by one */
export function studyStack(x, y, s, p = 1) {
  [[-0.16, -70, 20], [0.12, 70, 10], [0, 0, 0]].forEach(([rot, dx, dy], i) => {
    const k = clamp(p * 3 - i); if (k <= 0) return;
    clipboard(x + dx * s, y + dy * s + (1 - eoK(k)) * -260 * s, s, 1, rot);
  });
}
const eoK = (t) => 1 - Math.pow(1 - t, 3);

/** "see a doctor" badge: white disc, ink ring, a person icon with a white coat collar and a red cross. sc = pop-in */
export function doctorBadge(x, y, s = 1, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  circle(0, 0, 150, C.ink); circle(0, 0, 134, C.white);
  personIcon(0, 30, 0.9, C.shirt);
  ctx.beginPath(); ctx.moveTo(-52, 20); ctx.lineTo(0, 70); ctx.lineTo(52, 20); ctx.lineTo(52, 100); ctx.lineTo(-52, 100); ctx.closePath(); ctx.fillStyle = C.white; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1;
  rr(-10, 46, 20, 50, 4); ctx.fillStyle = C.red; ctx.fill(); rr(-25, 61, 50, 20, 4); ctx.fill();
  ctx.restore();
}

/** next-episode tease: a cartoon face mid-sneeze in a white badge. Eyes stay squeezed SHUT (the reflex).
 *  p 0..1: 0 = "ah-" (head back, mouth open), 1 = "-choo" (head forward, soft white puffs out to the right). sc = pop-in */
export function sneezeBadge(x, y, s = 1, p = 0, t = 0, sc = 1) {
  if (sc <= 0) return;
  const k = clamp(p);
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  circle(0, 0, 150, C.ink); circle(0, 0, 134, C.white);
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 134, 0, TAU); ctx.clip();
  ctx.save(); ctx.translate(-14, 10); ctx.rotate(lerp(-0.18, 0.14, k));
  ell(0, -46, 92, 66, C.hair); ell(0, 6, 84, 92, C.skin); ell(-86, 8, 16, 22, C.skin);
  ctx.beginPath(); ctx.moveTo(-84, -20); ctx.quadraticCurveTo(-70, -96, 10, -96); ctx.quadraticCurveTo(80, -98, 90, -30); ctx.quadraticCurveTo(50, -64, -10, -58); ctx.quadraticCurveTo(-56, -50, -84, -20); ctx.closePath(); ctx.fillStyle = C.hair; ctx.fill();
  ctx.strokeStyle = C.ink; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 30 - 16, -18); ctx.lineTo(sd * 30 + sd * 6, -8); ctx.lineTo(sd * 30 - 16, 2); ctx.stroke(); }   // > < squeezed shut
  ctx.strokeStyle = C.hair; ctx.lineWidth = 8;
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 48, -40); ctx.quadraticCurveTo(sd * 30, -48 + k * 6, sd * 12, -36 + k * 6); ctx.stroke(); }
  ctx.strokeStyle = C.skinShade; ctx.lineWidth = 5; for (const dy of [-2, 8]) { ctx.beginPath(); ctx.moveTo(-6, dy); ctx.lineTo(6, dy); ctx.stroke(); }   // scrunched nose
  ell(0, 20, 12, 10, C.skinShade);
  ell(0, 58, lerp(18, 28, k), lerp(20, 14, k), C.mouth);
  ctx.globalAlpha = 0.35; for (const sd of [-1, 1]) ell(sd * 56, 34, 16, 10, C.pink); ctx.globalAlpha = 1;
  ctx.restore();
  ctx.restore();
  if (k > 0) {
    for (let i = 0; i < 5; i++) {
      const ph = clamp(k * 1.6 - i * 0.12), an = -0.5 + i * 0.25, d = 80 + ph * 110;
      if (ph <= 0) continue;
      ctx.save(); ctx.globalAlpha = 0.9 * (1 - ph * 0.5); circle(30 + Math.cos(an) * d, 64 + Math.sin(an) * d * 0.6, Math.max(0, 16 - i * 2), C.sky); ctx.restore();
    }
    ctx.save(); ctx.globalAlpha = clamp(k * 2); ctx.strokeStyle = C.ink; ctx.lineWidth = 8; ctx.lineCap = 'round';
    for (const an of [-0.5, 0, 0.5]) line([[150 * Math.cos(an) + 14, 60 + 120 * Math.sin(an)], [190 * Math.cos(an) + 14, 60 + 150 * Math.sin(an)]], C.ink, 8);
    ctx.restore();
  }
  ctx.restore();
}
