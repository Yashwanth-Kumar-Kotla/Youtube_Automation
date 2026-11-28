// WHAT HAPPENS WHEN YOUR NOSE RUNS IN THE COLD?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): close-up of the hero's face in falling snow (beanie, scarf), red nose tip with one clear
// drip hanging, breath fog curling out (with tiny droplets drifting BACK toward the nose = rewatch detail), a "96% DRIPPED" card
// and the A WINS WATER BACK / B LOSES IT pills, all from frame 0. Scene clock: the last shot draws with t - T_LAST, so the last
// frame = frame 0 (snow, fog, drip wobble) apart from the end-card badges (snow is kept clear of the badge spots in every frame).
// Cuts sit on caption-chunk starts (word start - 0.05) so no caption runs past a cut.
// Guess (S03): profile breathing out + A / B pills. Re-hook (S06): new scene, zoom into the nose lining, nerve tripwire.
// Answer (S09): exhale beads into drops on the lining, check on A, 1/3 gauge. Rewatch: fog droplets drift back (S01) and the
// tiny "UP TO 1/3 WATER BACK" label in the x-ray (S04). Tease (S11, from "Next"): pizza + tongue. Loop (S12, from "that").
import { ctx, C, W, H, TAU, clamp, lerp, seg, eo, eio, eob, line, bigText, rr, circle } from './core/lib.js';
import { T, Wd } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const at = (w, i) => Wd(w, i) - 0.05;          // cut = the caption chunk's start
  const plain = (col = C.bg) => { ctx.fillStyle = col; ctx.fillRect(-300, -300, W + 600, H + 600); };
  const pop = (lt, a, d = 0.3) => (lt > a ? eob(seg(lt, a, a + d)) : 0);
  const out = (lt, a, d = 0.25) => 1 - eio(seg(lt, a, a + d));
  const blip = (lt, a, d = 0.35) => (lt > a ? Math.sin(Math.PI * seg(lt, a, a + d)) : 0);
  const enter = (lt) => lerp(0.86, 1, eob(seg(lt, 0, 0.25)));
  const T_LAST = (Math.ceil(T.dur * 30 - 1e-6) - 1) / 30;   // time of the film's last rendered frame

  // ── the hook set: cold face close-up in the snow + 96% card + A / B pills (frame 1 + loop) ──
  const HOOK_CAM = [540, 1000];   // push anchored low so the pills never drift toward the caption
  const SKIP = [[40, 60, 440, 250], [790, 60, 1040, 310]];          // end-card badge spots: no snowflakes there, ever
  const FACE = [540, 700], FS = 1.05;
  const HA = [330, 1118], HB = [830, 1118], HS = 40;
  const hookScene = (t, { bump = 0, ring = 0, run = -1, shiver = 0 } = {}) => {
    K.rnWinterBg(2400);
    K.rnSnow(t, { skip: SKIP, gust: 0 });
    const f = K.rnColdFace(FACE[0], FACE[1] - 16 * bump, FS, { t, drip: 0.85, fall: run, shake: Math.sin(t * 70) * 7 * shiver,
      mouth: shiver > 0.3 ? 'shiver' : 'flat', brow: 0.3 + 0.4 * bump, eyes: bump > 0.3 ? 'wide' : 'n' });
    K.rnFog(f.mouth[0] + 34, f.mouth[1] - 22, 1, t, { ang: -0.15, len: 340, back: 1 });
    K.hiRing(f.nose[0], f.nose[1] + 4, 104, 90, ring);
    K.rnStatCard(148, 560, 0.9);
    return f;
  };
  const hookPills = () => { K.abPill('A', 'WINS WATER BACK', HA[0], HA[1], HS); K.abPill('B', 'LOSES IT', HB[0], HB[1], HS); };

  // ── 1 · HOOK "What happens when your nose runs in the cold?" ──
  {
    const ha = Wd('happens', 0), no = Wd('nose', 0), ru = Wd('runs', 0), co = Wd('cold', 0);
    add({ id: 'S01', at: 0, cam: HOOK_CAM, zoom: 0.03, note: 'FRAME 1 = hook: the hero\'s face close-up in falling snow (beanie, scarf), red nose tip with a clear drip, breath fog (tiny droplets drift back toward the nose), 96% DRIPPED card, A WINS WATER BACK / B LOSES IT pills, all from frame 0; face bounces + eyes widen on "happens"; yellow ring on the nose on "nose"; a clear drop falls from the drip on "runs"; shiver on "cold"',
      draw(lt, d, t) {
        hookScene(t, { bump: blip(lt, ha, 0.35), ring: blip(lt, no, 0.55), run: lt > ru && lt < ru + 0.6 ? seg(lt, ru, ru + 0.6) : -1, shiver: blip(lt, co, 0.4) });
        hookPills();
      } });
    cue(0.0, 'sparkle', { dur: 0.5, gain: 0.15 }); cue(ha, 'boing', { gain: 0.3 }); cue(no, 'pop', { gain: 0.5 }); cue(ru, 'plop', { gain: 0.35 }); cue(co, 'zip', { gain: 0.25 });
  }

  // ── 2a · "In one ski study, ninety-six percent dripped." (25 skiers, 24 drip) ──
  {
    const st = at('in', 1), sk = Wd('ski', 1) - st, sd = Wd('study', 1) - st, ni = Wd('ninety', 1) - st, dr = Wd('dripped', 1) - st;
    const DRY = 13;
    add({ id: 'S02', at: st, cam: [540, 900], zoom: 0.06, note: 'ski study: 25 mini skiers in beanies (5 x 5) on the snow, on screen at the cut; SKI STUDY pill on "ski", bounce on "study"; yellow 96% pill on "ninety-six"; clear drips appear under 24 of the 25 noses on "dripped" (one stays dry)',
      draw(lt, d, t) {
        K.rnWinterBg(560);
        K.rnSnow(t, { n: 30 });
        const e = enter(lt);
        for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
          const i = r * 5 + c, x = 170 + c * 180 + (r % 2) * 40, y = 352 + r * 148;
          const dp = i === DRY ? 0 : eo(seg(lt, dr + (r + c) * 0.035, dr + (r + c) * 0.035 + 0.25));
          K.rnMiniSkier(x, y, 0.56 * e, { drip: dp, col: (r + c) % 2 ? '#3D4F6E' : '#5A6E8C', colD: (r + c) % 2 ? '#2B3A55' : '#46597A', bob: 10 * blip(lt, sd + c * 0.03, 0.3) });
        }
        K.pill('SKI STUDY', 540, 215, 55, C.ink, C.white, pop(lt, sk));
        K.pill('96%', 540, 1095, 62, C.yellow, C.ink, pop(lt, ni));
      } });
    cue(st, 'whoosh'); cue(st + sk, 'pop', { gain: 0.5 }); cue(st + sd, 'boing', { gain: 0.25 }); cue(st + ni, 'pop', { gain: 0.7 }); cue(st + dr, 'bubbles', { dur: 0.5, gain: 0.3 });
  }

  // ── 2b · GUESS "Breathing out, does your nose win water back, or lose it?" ──
  const curveArrow = (P0, P1, P2, p, col = C.sky, edge = '#7EC3E0') => {   // quadratic arrow drawn to p 0..1
    if (p <= 0) return;
    const pts = []; for (let i = 0; i <= 20; i++) { const u = i / 20 * p; pts.push([(1 - u) * (1 - u) * P0[0] + 2 * u * (1 - u) * P1[0] + u * u * P2[0], (1 - u) * (1 - u) * P0[1] + 2 * u * (1 - u) * P1[1] + u * u * P2[1]]); }
    line(pts, edge, 30); line(pts, col, 18);
    const a = pts[pts.length - 1], b = pts[pts.length - 2], an = Math.atan2(a[1] - b[1], a[0] - b[0]);
    ctx.save(); ctx.translate(a[0], a[1]); ctx.rotate(an); ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(-18, -26); ctx.lineTo(-18, 26); ctx.closePath();
    ctx.lineJoin = 'round'; ctx.lineWidth = 10; ctx.strokeStyle = edge; ctx.stroke(); ctx.fillStyle = col; ctx.fill(); ctx.restore();
  };
  const GA = [540, 1005], GB = [540, 1095], GS = 38;
  {
    const st = at('breathing', 1), br = Wd('breathing', 1) - st, ou = Wd('out', 1) - st, no = Wd('nose', 1) - st, wi = Wd('win', 1) - st,
      wa = Wd('water', 1) - st, ba = Wd('back', 1) - st, lo = Wd('lose', 1) - st;
    add({ id: 'S03', at: st, cam: [560, 900], zoom: 0.07, note: 'GUESS: side profile of the hero (beanie, scarf, red nose) on the winter sky, on screen at the cut; breath fog streams out of the nose from "Breathing", grows on "out"; yellow ring on the nose on "nose"; A WINS WATER BACK pops on "win"; three clear drops glint in the fog on "water"; a blue arrow curls from the fog back into the nose on "back"; B LOSES IT pops on "lose" and one drop flies off to the right',
      draw(lt, d, t) {
        K.rnWinterBg(2400);
        K.rnSnow(t, { n: 30 });
        const f = K.rnProfile(420, 540, 0.9 * enter(lt), { t, ring: blip(lt, no, 0.55), mouth: 'flat' });
        const fa = seg(lt, br - 0.05, br + 0.2) * (0.6 + 0.4 * seg(lt, ou, ou + 0.3));
        K.rnFog(f.nostril[0] + 20, f.nostril[1] + 4, 1.1, t, { ang: 0.12, len: 220, a: fa });
        [[810, 640], [880, 690], [770, 705]].forEach(([x, y], i) => K.drop(x, y, 0.42 * pop(lt, wa + i * 0.06, 0.25), 0, 1));
        curveArrow([880, 600], [810, 470], [730, 600], eio(seg(lt, ba - 0.05, ba + 0.3)));
        if (lt > lo) { const u = eio(seg(lt, lo, lo + 0.45)); K.drop(lerp(860, 940, u), lerp(770, 830, u), 0.42, Math.PI / 2 + 0.3, 1 - 0.3 * u); }
        K.abPill('A', 'WINS WATER BACK', GA[0], GA[1], GS, { sc: pop(lt, wi), hi: blip(lt, wi, 0.4) });
        K.abPill('B', 'LOSES IT', GB[0], GB[1], GS, { sc: pop(lt, lo), hi: blip(lt, lo, 0.4) });
      } });
    cue(st, 'whoosh'); cue(st + br, 'slide', { dur: 0.6, gain: 0.2 }); cue(st + no, 'pop', { gain: 0.4 }); cue(st + wi, 'pop', { gain: 0.65 });
    cue(st + wa, 'plop', { gain: 0.3 }); cue(st + ba, 'slide', { dur: 0.3, gain: 0.3 }); cue(st + lo, 'pop', { gain: 0.65 }); cue(st + lo + 0.05, 'zip', { gain: 0.3 });
  }

  // ── 3 · "Your nose is a built-in heater for every breath." (x-ray: radiator fins warm the air) ──
  {
    const st = at('your', 2), no = Wd('nose', 2) - st, bu = Wd('built', 2) - st, he = Wd('heater', 2) - st, ev = Wd('every', 2) - st, br = Wd('breath', 2) - st;
    const X = 430, Y = 600, XS = 0.95;
    add({ id: 'S04', at: st, cam: [580, 760], zoom: 0.1, note: 'x-ray film: cyan profile of the head with the pink nasal cavity and three radiator-fin turbinates (on screen at the cut), cold snowflake breath dots stream in at the nostril; yellow ring round the cavity on "nose"; fins pop on "built-in"; fins glow yellow + heat waves on "heater" (HEATER pill), dots turn yellow (warmed) past the fins on their way down the throat; flow speeds up on "every"/"breath". Rewatch: tiny UP TO 1/3 WATER BACK label bottom right',
      draw(lt, d, t) {
        K.xray(t);
        const sp = lt < ev ? 0.45 : 0.45 + 0.5 * seg(lt, ev, br + 0.2);
        const flow = ((t * 0.45) + Math.max(0, lt - ev) * (sp - 0.45)) % 1;
        K.rnNoseXray(X, Y, XS * enter(lt), { t, flow, n: 7, ring: blip(lt, no, 0.55), fins: lt < bu ? 1 : 1 + 0.25 * blip(lt, bu, 0.35), heat: eo(seg(lt, he - 0.05, he + 0.3)) });
        K.pill('HEATER', 800, 330, 56, C.yellow, C.ink, pop(lt, he));
        K.pill('UP TO 1/3 WATER BACK', 760, 1060, 28, C.ink, C.white, 1);
      } });
    cue(st, 'whoosh'); cue(st + no, 'pop', { gain: 0.4 }); cue(st + bu, 'pop', { gain: 0.5 }); cue(st + he, 'sizzle', { dur: 0.5, gain: 0.2 }); cue(st + he + 0.05, 'pop', { gain: 0.55 }); cue(st + br, 'slide', { dur: 0.35, gain: 0.3 });
  }

  // ── 4 · RELATABLE "Ever stepped outside and felt that first drip?" ──
  {
    const st = at('ever', 3), sp = Wd('stepped', 3) - st, ou = Wd('outside', 3) - st, fe = Wd('felt', 3) - st, dr = Wd('drip', 3) - st;
    const S1 = 0.75, GROUND = 1080, Y = GROUND + 20 - 620 * S1;
    add({ id: 'S05', at: st, cam: [540, 800], zoom: 0.08, note: 'the hero (beanie) on the snowy ground, on screen at the cut, steps forward on "stepped"; snow gust + shiver lines on "outside"; eyes wide + brows up on "felt"; a clear drop forms under his nose + yellow ring on "drip"',
      draw(lt, d, t) {
        K.rnWinterBg(GROUND);
        const g = seg(lt, ou, ou + 0.3);
        K.rnSnow(t, { n: 40, gust: 160 * g, y1: GROUND });
        const X = lerp(400, 520, eio(seg(lt, sp - 0.05, sp + 0.45))), bob = Math.abs(Math.sin(seg(lt, sp - 0.05, sp + 0.45) * Math.PI * 2)) * 14;
        const shake = Math.sin(t * 60) * 5 * blip(lt, ou, 0.5);
        const fw = lt > fe;
        K.man({ x: X + shake, y: Y - bob, s: S1, arm: K.ARM.down, eyes: fw ? 'wide' : 'n', mouth: fw ? 'flat' : 'smile', brow: fw ? 0.9 : 0.3, stuffy: 1 });
        const hx = X + shake, hy = Y - bob - 338 * S1;
        rnBeanie(hx, hy, S1);
        rr(hx - 70 * S1, hy + 112 * S1, 140 * S1, 40 * S1, 20 * S1); ctx.fillStyle = C.shirtShade; ctx.fill(); rr(hx - 70 * S1, hy + 112 * S1, 140 * S1, 32 * S1, 16 * S1); ctx.fillStyle = C.shirt; ctx.fill();
        K.shockLines(hx, hy - 150 * S1, 120 * S1 + 40, blip(lt, ou, 0.5));
        K.drop(hx + 2 * S1, hy + (54 + 10 * eo(seg(lt, dr, dr + 0.3))) * S1, 0.4 * pop(lt, dr, 0.25), 0, 1);
        K.hiRing(hx + 2 * S1, hy + 60 * S1, 46, 44, blip(lt, dr + 0.05, 0.6));
      } });
    cue(st, 'whoosh'); cue(st + sp, 'thud', { gain: 0.3 }); cue(st + ou, 'zip', { gain: 0.35 }); cue(st + fe, 'boing', { gain: 0.3 }); cue(st + dr, 'plop', { gain: 0.5 });
  }
  // beanie on the man() / heroHead head: (x, y) = face centre, s = the man's scale
  function rnBeanie(x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.save(); ctx.beginPath(); ctx.rect(-200, -400, 400, 300); ctx.clip();
    ctx.beginPath(); ctx.ellipse(0, -104, 134, 120, 0, 0, TAU); ctx.fillStyle = C.shirtShade; ctx.fill();
    ctx.beginPath(); ctx.ellipse(-4, -108, 128, 114, 0, 0, TAU); ctx.fillStyle = C.shirt; ctx.fill(); ctx.restore();
    rr(-140, -122, 280, 46, 23); ctx.fillStyle = C.shirtShade; ctx.fill(); rr(-140, -122, 280, 38, 19); ctx.fillStyle = '#4A8BE0'; ctx.fill();
    circle(0, -232, 30, '#D5E6EF'); circle(-3, -235, 26, C.white);
    ctx.restore();
  }

  // ── 5 · RE-HOOK "But here's the twist: cold air trips a nerve reflex." (new scene: inside the nose lining) ──
  {
    const st = at('but', 4), tw = Wd('twist', 4) - st, co = Wd('cold', 4) - st, tr = Wd('trips', 4) - st, ne = Wd('nerve', 4) - st, re = Wd('reflex', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 700], zoom: 0.2, note: 'RE-HOOK, new scene with a strong push: macro of the nose lining (pale airway, moist pink surface, glands, a cream nerve with two branches ending under the surface), on screen at the cut; yellow burst on "twist"; snowflake cold air streams through the airway from "cold"; yellow sparks at both nerve endings on "trips" (the tripwire); NERVE tag (top, pointing down to the right nerve ending) on "nerve"; yellow signal blips race along the nerve on "reflex"',
      draw(lt, d, t) {
        const sig = lt > re ? ((lt - re) * 1.3) % 1 : -1;
        K.rnLining(t, { cold: eo(seg(lt, co - 0.05, co + 0.3)), sig });
        K.burst(540, 360, 2.2, blip(lt, tw, 0.4));
        K.RN_LIN.ends.forEach(([ex, ey], i) => { const sp = lt > tr ? 0.7 + 0.3 * Math.sin(t * 20 + i) : 0; K.sparkle4(ex, ey - 20, 34 * sp, 1); K.burst(ex, ey - 10, 0.9, blip(lt, tr + i * 0.05, 0.4)); });
        K.tag('NERVE', 700, 190, 700, 630, 50, pop(lt, ne));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.4 }); cue(st + co, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + tr, 'zip', { gain: 0.5 }); cue(st + tr + 0.05, 'pop', { gain: 0.5 }); cue(st + ne, 'pop', { gain: 0.55 }); cue(st + re, 'slide', { dur: 0.4, gain: 0.3 });
  }

  // ── 6 · "Same one that waters your mouth before a meal." (split: cold → nose drips · meal → mouth waters) ──
  {
    const st = at('same', 5), sa = Wd('same', 5) - st, wa = Wd('waters', 5) - st, mo = Wd('mouth', 5) - st, me = Wd('meal', 5) - st;
    const LX = 300, RX = 780, LY = 560, R = 190;
    add({ id: 'S07', at: st, cam: [540, 640], zoom: 0.06, note: 'split frame, on screen at the cut: left lens = the hero\'s red nose with its drip, a frost badge below (cold); right lens = the hero\'s face, a burger plate below (meal); yellow "=" and identical yellow sparks in both lenses + SAME REFLEX pill on "Same"; a clear drool drop forms at his mouth on "waters"; yellow ring on the mouth on "mouth"; burger bounces on "meal"',
      draw(lt, d, t) {
        plain();
        const e = enter(lt);
        K.lens(LX, LY, R * e, 1, () => { K.rnColdFace(0, -86, 0.9, { t, drip: 0.6 + 0.4 * seg(lt, wa, wa + 0.4) }); }, C.sky);
        K.lens(RX, LY, R * e, 1, () => {
          K.heroHead(0, -50, 1.35, { eyes: 'n', mouth: lt > wa ? 'o' : 'smile', brow: 0.5, drool: eo(seg(lt, wa, wa + 0.4)) });
          K.hiRing(6, 48, 60, 44, blip(lt, mo, 0.6));
        }, '#FFF1E0');
        const zs = blip(lt, sa, 0.6);
        K.sparkle4(LX + 110, LY - 110, 40 * zs, 1); K.sparkle4(RX + 110, LY - 110, 40 * zs, 1);
        bigText('=', 540, LY, 130 * pop(lt, sa), C.yellow);
        K.frostBadge(LX, 960, 0.9 * e, 1, t);
        K.mealPlate(RX, 970, 0.5 * e * (1 + 0.15 * blip(lt, me, 0.35)), {});
        K.flowArrow(LX, 815, 70, -Math.PI / 2, 1, C.yellow, 16, C.ink); K.flowArrow(RX, 815, 70, -Math.PI / 2, 1, C.yellow, 16, C.ink);
        K.pill('SAME REFLEX', 540, 200, 56, C.ink, C.yellow, pop(lt, sa));
      } });
    cue(st, 'whoosh'); cue(st + sa, 'pop', { gain: 0.6 }); cue(st + sa + 0.05, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + wa, 'plop', { gain: 0.4 }); cue(st + mo, 'pop', { gain: 0.4 }); cue(st + me, 'boing', { gain: 0.35 });
  }

  // ── 7 · "Glands pour out extra mucus." (lining macro: glands pump clear drops onto the surface) ──
  {
    const st = at('glands', 6), gl = Wd('glands', 6) - st, po = Wd('pour', 6) - st, ex = Wd('extra', 6) - st, mu = Wd('mucus', 6) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.08, note: 'the lining macro again (on screen at the cut); yellow rings on the three glands on "Glands"; glands pulse and clear drops rise up the ducts from "pour"; clear drops bead along the surface from "out", more on "extra"; MUCUS tag pointing at the beads on "mucus"',
      draw(lt, d, t) {
        K.rnLining(t, { glands: blip(lt, gl, 0.6), pump: seg(lt, po - 0.05, po + 0.2), mucus: 0.55 * seg(lt, po + 0.15, ex) + 0.45 * seg(lt, ex, mu + 0.2) });
        K.tag('MUCUS', 540, 340, 600, 590, 54, pop(lt, mu));
      } });
    cue(st, 'whoosh'); cue(st + gl, 'pop', { gain: 0.5 }); cue(st + po, 'bubbles', { dur: 0.9, gain: 0.35 }); cue(st + ex, 'plop', { gain: 0.35 }); cue(st + mu, 'pop', { gain: 0.6 });
  }

  // ── 8 · ANSWER "Answer: it wins back up to a third." (exhale condenses on the cool lining) ──
  {
    const st = at('answer', 7), an = Wd('answer', 7) - st, wi = Wd('wins', 7) - st, up = Wd('up', 7) - st, th = Wd('third', 7) - st;
    add({ id: 'S09', at: st, cam: [540, 1000], zoom: 0.05, note: 'ANSWER: lining macro with warm moist breath puffs drifting out along the airway + A / B pills (on screen at the cut); A pill flashes on "Answer"; check lands on A on "wins", B dims, drops condense on the lining and stay (the water won back); COMMENT A OR B pill (not voiced, ~1.3 s); a 1/3 gauge pops on "up" and fills to one third on "third"',
      draw(lt, d, t) {
        K.rnLining(t, { exhale: 1, mucus: 0.3, bead: seg(lt, wi, th + 0.2) });
        K.abPill('A', 'WINS WATER BACK', GA[0], GA[1], GS, { check: pop(lt, wi, 0.3), hi: blip(lt, an, 0.35) + blip(lt, wi, 0.45) });
        K.abPill('B', 'LOSES IT', GB[0], GB[1], GS, { dim: seg(lt, wi, wi + 0.3) });
        K.rnThirdGauge(890, 285, 80, eio(seg(lt, up, th + 0.15)), pop(lt, up, 0.25));
        K.pill('COMMENT A OR B', 400, 165, 48, C.ink, C.yellow, pop(lt, wi + 0.08, 0.25) * out(lt, d - 0.12, 0.1));
      } });
    cue(st, 'whoosh'); cue(st + an, 'tock', { gain: 0.4 }); cue(st + wi, 'pop', { gain: 0.8 }); cue(st + wi + 0.1, 'pop', { gain: 0.3 }); cue(st + up, 'pop', { gain: 0.45 }); cue(st + th, 'sparkle', { dur: 0.4, gain: 0.35 });
  }

  // ── 9 · SAFETY "Over three weeks, or a fever? See a doctor." ──
  {
    const st = at('over', 8), th = Wd('three', 8) - st, we = Wd('weeks', 8) - st, fe = Wd('fever', 8) - st, se = Wd('see', 8) - st, dc = Wd('doctor', 8) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.05, note: 'calm card: a calendar "3 WEEKS" on screen at the cut; bounce on "three", yellow ring on "weeks"; a thermometer (no numbers) pops and rises on "fever"; doctor badge pops on "See", bounces on "doctor"',
      draw(lt, d, t) {
        plain();
        K.calendar(310, 560, 0.6 * pop(lt, 0.03, 0.25) * (1 + 0.08 * blip(lt, th, 0.3)), '3', 'WEEKS');
        K.hiRing(310, 560, 220, 245, blip(lt, we, 0.6));
        const ts = pop(lt, fe, 0.25);
        if (ts > 0) { ctx.save(); ctx.translate(790, 560); ctx.scale(ts, ts); K.thermometer(0, 0, 0.5, lerp(0.3, 0.85, eo(seg(lt, fe, fe + 0.5)))); ctx.restore(); }
        K.doctorBadge(540, 975, 0.95 * (1 + 0.1 * blip(lt, dc, 0.3)), pop(lt, se));
      } });
    cue(st, 'whoosh'); cue(st + th, 'tock', { gain: 0.4 }); cue(st + we, 'pop', { gain: 0.4 }); cue(st + fe, 'pop', { gain: 0.5 }); cue(st + se, 'pop', { gain: 0.6 }); cue(st + dc, 'boing', { gain: 0.25 });
  }

  // ── 10a · TEASE "Next Body File: burned tongue, taste buds" (starts on "Next") ──
  const badge = (x, y, sc, size = 44) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = at('next', 9), bo = Wd('body', 9) - st, bu = Wd('burned', 9) - st, to = Wd('tongue', 9) - st, ta = Wd('taste', 9) - st, bd = Wd('buds', 9) - st;
    add({ id: 'S11', at: st, cam: [540, 660], zoom: 0.07, note: 'tease (cut on "Next"): a steaming pizza slice (left) and a pink tongue with taste buds (right), on screen at the cut, yellow NEXT pill at lt 0.03; BODY FILES badge on "Body"; steam flares + the front buds go pale on "burned"; tongue bounces on "tongue"; buds glow yellow on "taste", ring on "buds"',
      draw(lt, d, t) {
        plain();
        const e = enter(lt);
        K.rnPizza(290, 730, 0.85 * e, { t, steam: 0.7 + 0.3 * seg(lt, bu, bu + 0.2) });
        K.rnTongue(790, 740, 0.9 * e * (1 + 0.08 * blip(lt, to, 0.3)), { t, burn: seg(lt, bu, bu + 0.3), glow: lt > ta ? 0.6 + 0.4 * blip(lt, ta, 0.4) : 0 });
        K.hiRing(790, 740, 190, 210, blip(lt, bd, 0.6));
        K.pill('NEXT', 540, 200, 64, C.yellow, C.ink, pop(lt, 0.03, 0.25));
        badge(540, 320, pop(lt, bo));
      } });
    cue(st, 'whoosh'); cue(st + 0.03, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.4 }); cue(st + bu, 'sizzle', { dur: 0.4, gain: 0.3 }); cue(st + to, 'boing', { gain: 0.3 }); cue(st + ta, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + bd, 'pop', { gain: 0.45 });
  }

  // ── 10b · LOOP "that regrow." (back to the exact frame-1 picture) + end card ──
  {
    const st = at('that', 9), rg = Wd('regrow', 9) - st, Z = 0;
    add({ id: 'S12', at: st, cam: HOOK_CAM, zoom: Z, note: 'LOOP + END CARD: the frame-1 picture (face in the snow, drip, fog, 96% card, A / B pills; scene clock t - T_LAST so the last frame = frame 1, no push, main.js punch-in cancelled so the cut lands on the exact frame-1 view); end card from ~0.1 s: BODY FILES + FOLLOW top left, burned-tongue badge + NEXT top right (snow kept clear of both spots in every frame); buds in the badge pop back on "regrow"',
      draw(lt, d, t) {
        const tl = Math.max(0, t - T_LAST);
        const k = (1 + 0.13 * (1 - eo(clamp(lt / 0.32)))) * (1 + Z * eio(clamp(lt / d)));   // cancel main.js's punch: the cut lands on the exact frame-1 view
        ctx.save(); ctx.translate(HOOK_CAM[0], HOOK_CAM[1]); ctx.scale(1 / k, 1 / k); ctx.translate(-HOOK_CAM[0], -HOOK_CAM[1]);
        hookScene(tl); hookPills();
        K.rnTongueBadge(915, 150, 0.52, pop(lt, 0.1, 0.3), t, lt < rg ? 0 : eo(seg(lt, rg, rg + 0.5)));
        K.pill('NEXT', 915, 262, 34, C.yellow, C.ink, pop(lt, 0.18, 0.3));
        badge(240, 110, pop(lt, 0.1, 0.3), 34);
        K.followPill(240, 200, pop(lt, 0.3), t, 36);
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.4 }); cue(st + 0.3, 'pop', { gain: 0.5 }); cue(st + rg, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES, loop: true };
}
