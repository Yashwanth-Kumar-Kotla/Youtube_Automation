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
  const draw = () => {
    const path = () => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (const q of pts) ctx.lineTo(q[0], q[1]); };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
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
  line([sh, [lerp(sh[0], e[0], 0.55), lerp(sh[1], e[1], 0.55)]], C.shirt, 72);       // short sleeve
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
  ell(0, -34, 116, 94, C.hair);
  for (const sd of [-1, 1]) { ell(sd * 104, 14, 22, 28, C.skin); ell(sd * 106, 14, 10, 15, C.skinShade); }
  ell(0, 12, 102, 112, C.skin);
  // fringe with side part
  ctx.beginPath(); ctx.moveTo(-104, -6); ctx.quadraticCurveTo(-118, -112, -14, -124); ctx.quadraticCurveTo(96, -132, 112, -26);
  ctx.quadraticCurveTo(92, -70, 40, -74); ctx.quadraticCurveTo(-20, -76, -58, -50); ctx.quadraticCurveTo(-86, -34, -104, -6); ctx.closePath();
  ctx.fillStyle = C.hair; ctx.fill(); rr(-106, -40, 18, 46, 8); ctx.fill(); rr(88, -40, 18, 46, 8); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-60, -98); ctx.quadraticCurveTo(0, -118, 62, -96); ctx.strokeStyle = C.hairHi; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.stroke();
  // brows: brow 0..1 raises them; smirk tilts
  const br = (o.brow || 0) * 16, tl = o.smirk ? 1 : 0, fr = o.frown ? 1 : 0;
  ctx.strokeStyle = C.hair; ctx.lineWidth = 12;
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
export function man(o) {
  const s = o.s || 1, XR = !!o.xray;
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
  }
  head(o);
  const ra = o.arm || ARM.down;
  arm(1, ra, o.finger ?? null, XR);
  if (o.holding) o.holding(ra.h[0] - 34, ra.h[1] - 14);
  if (o.inside) gum(o.inside[0], o.inside[1], 0.5, o.inside[2] || 0);
  ctx.restore();
}
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
export function handSkin(x, y, s, { puff = 0, bruise = 0, splint = 0, rot = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * (1 + puff * 0.18), s * (1 + puff * 0.08));
  const fw = 64 + puff * 26;
  const tone = bruise > 0 ? C.pinkLight : C.skin;
  ctx.lineCap = 'round';
  // wrist + sleeve
  line([[0, 160], [0, 420]], C.skin, 210); rr(-125, 330, 250, 200, 30); ctx.fillStyle = C.shirt; ctx.fill();
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
