// WHAT HAPPENS WHEN YOU GET BRAIN FREEZE?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Tone: curious, playful, accurate. Hook: the hero bites an ice cream cone in K.home() and grimaces (comic). The mechanism
// lives in one side cutaway of his head (K.headCut: brain, palate, tongue) + a blood-vessel close-up (K.vessel). The
// "blame" beat is a cartoon brain (K.brainBuddy) pointing at a red zap on his forehead. Fix: the tongue presses the palate,
// warm rings, the frost melts. Tease (goosebumps): a skin patch with raised goosebumps + a cute puffed cat + NEXT; the hero
// only watches.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, bigText, TAU } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i) - 0.08;                       // a mid-line cut just before word w
  const plain = () => { ctx.fillStyle = C.bg; ctx.fillRect(-300, -300, W + 600, H + 600); };
  const pop = (lt, a, d = 0.3) => (lt > a ? eob(seg(lt, a, a + d)) : 0);
  const out = (lt, a, d = 0.25) => 1 - eio(seg(lt, a, a + d));
  const ICE = '#9DCBE0';
  const flake = (x, y, r, a = 1, rot = 0) => { if (a <= 0 || r <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); K.snowflake(x, y, r, ICE, 14, rot); K.snowflake(x, y, r, C.sky, 7, rot); ctx.restore(); };
  const ring = (x, y, rx, ry, k, a = 1) => {                 // yellow highlight ring drawn on over k 0..1
    if (k <= 0 || a <= 0) return;
    ctx.save(); ctx.globalAlpha = clamp(a); ctx.beginPath(); ctx.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), 0, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(k));
    ctx.strokeStyle = C.ink; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.stroke(); ctx.strokeStyle = C.yellow; ctx.lineWidth = 12; ctx.stroke(); ctx.restore();
  };
  const warmRings = (x, y, p, t, a = 1, sc = 0.5) => { if (p <= 0 || a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); K.heatRings(0, 0, p, t, a); ctx.restore(); };

  // the head cutaway: one place for every inside shot
  const HX = 470, HY = 800, HS = 1.1;
  const P = (k) => K.hcPt(HX, HY, HS, k);
  const [PX, PY] = P('palate');
  const TAGY = 1125;                                            // labels under the chin (≥80 px above the caption zone)
  // the end-card layout (shared by the tease shots)
  const HERO = { x: 270, y: 1000, s: 1.1 };
  const hero = (o) => K.man({ ...HERO, ...o });
  const PATCH = [900, 1010, 95], CAT = [640, 990, 0.48], NEXTP = [780, 760];

  // ── 1 · HOOK: hero bites an ice cream cone (frame 0), happy chew; grimace + shiver on "brain", frost flakes on "freeze" ──
  {
    const st = 0, bn = Wd('brain', 0), fz = Wd('freeze', 0);
    const AWAY = { e: [250, -30], h: [250, -170] }, BITE = { e: [235, -60], h: [130, -250] };
    add({ id: 'S01', at: st, cam: [480, 700], zoom: 0.1, note: 'room: hero brings an ice cream cone to his mouth and bites (0.3 s), chews happily; on "brain" he squeezes his eyes, frowns and shivers (comic grimace); on "freeze" icy snowflakes burst round his head + frost badge on the left wall (clear of the cone)',
      draw(lt, d, t) {
        K.home();
        const toMouth = eio(seg(lt, 0, 0.3)) * (1 - eio(seg(lt, 0.55, 0.85)));
        const pose = K.armPose(AWAY, BITE, toMouth), bit = lt > 0.3 ? 1 : 0, frozen = lt > bn;
        const shake = frozen ? Math.sin(lt * 60) * 8 * (0.4 + 0.6 * (1 - seg(lt, bn, bn + 0.8))) : 0;
        K.man({ x: 440 + shake, y: 1180, s: 1.5, arm: pose, holding: (x, y) => K.iceCone(x + 34, y + 14, 0.85, -1.2 * lerp(0.6, 1, toMouth), bit),
          eyes: frozen ? 'squeeze' : lt > 0.35 ? 'closed' : 'n', mouth: frozen ? 'flat' : lt > 0.35 && lt < 1.2 ? 'chew' : 'smile', chew: Math.abs(Math.sin(lt * 12)),
          frown: frozen, brow: frozen ? 0 : 0.5 });
        if (lt > fz) {
          const k = eob(seg(lt, fz, fz + 0.3));
          [[-1.0, 300], [-0.2, 290], [0.6, 280], [2.6, 290], [3.4, 300]].forEach(([an, r], i) => flake(440 + Math.cos(an - Math.PI / 2) * r * k, 655 + Math.sin(an - Math.PI / 2) * r * k, 34, k, t * 0.6 + i));
          K.shockLines(440, 640, 250, clamp((lt - fz) * 5) * out(lt, fz + 0.45, 0.3));
        }
        K.frostBadge(150, 780, 0.7, pop(lt, fz), t);
      } });
    cue(0.02, 'whoosh', { gain: 0.5 }); cue(0.3, 'gulp', { gain: 0.5 }); cue(bn, 'boing', { gain: 0.5 }); cue(fz, 'sparkle', { dur: 0.6, gain: 0.6 });
  }

  // ── 2 · Spoiler: it starts in your mouth, not your brain: cutaway; yellow ring round the mouth on "mouth", red X on the brain on "brain" ──
  {
    const st = cut(1), sp = Wd('spoiler', 1) - st, mo = Wd('mouth', 1) - st, nt = Wd('not', 1) - st, bn = Wd('brain', 1) - st;
    const [BX, BY] = P('brain');
    add({ id: 'S02', at: st, cam: [520, 760], zoom: 0.08, note: 'side cutaway of the hero\'s head (brain, palate, tongue), wincing; yellow ring draws round the mouth on "mouth"; on "not your brain" the brain gets a yellow ring then a red X slams on it on "brain"',
      draw(lt, d, t) {
        plain();
        K.headCut(HX, HY, HS, { t, eyes: 'squeeze', brainHi: lt > nt ? eo(seg(lt, nt, nt + 0.2)) * out(lt, bn, 0.2) : 0 });
        ring(PX + 10, PY + 50, 175, 105, lt > mo ? eo(seg(lt, mo, mo + 0.3)) : 0, 1);
        if (lt > bn) K.redX(BX, BY + 10, lerp(0.9, 0.5, eo(seg(lt, bn, bn + 0.18))), 1);
        bigText('?', 860, 380, 130, C.yellow, 0.12, pop(lt, sp, 0.25) * out(lt, mo, 0.2));
      } });
    cue(st, 'whoosh'); cue(st + sp, 'pop', { gain: 0.4 }); cue(st + mo, 'pop', { gain: 0.6 }); cue(st + bn + 0.05, 'slam', { gain: 0.7 });
  }

  // ── 3 · Ice cream chills the roof of your mouth: a spoon brings a scoop in, the palate turns icy blue on "chills", ROOF tag on "roof" ──
  {
    const st = cut(2), ic = Wd('ice', 2) - st, ch = Wd('chills', 2) - st, rf = Wd('roof', 2) - st;
    const [LX, LY] = P('lips');
    add({ id: 'S03', at: st, cam: [600, 820], zoom: 0.1, note: 'cutaway: a spoon slides a pink scoop into the mouth on "Ice cream" and leaves it on the tongue; on "chills" the palate turns icy blue with icicles + flakes, he squeezes his eyes; ROOF tag points at the palate on "roof"',
      draw(lt, d, t) {
        plain();
        const sin = eio(seg(lt, ic - 0.05, ic + 0.3)), sout = eio(seg(lt, ic + 0.45, ic + 0.75)), dropped = lt > ic + 0.35;
        const chill = lt > ch ? eo(seg(lt, ch, ch + 0.5)) : 0;
        K.headCut(HX, HY, HS, { t, chill, eyes: lt > ch + 0.15 ? 'squeeze' : 'n', brow: lt > ch ? 0 : 0.4, scoop: [200, 62, dropped ? 1 : 0] });
        if (sin > 0 && sout < 1) K.scoopSpoon(lerp(1250, LX - 60, sin) + sout * 700, LY + 4, 1, dropped ? 0 : 1);
        if (chill > 0) for (let i = 0; i < 3; i++) { const ph = (lt * 0.9 + i / 3) % 1; flake(PX - 90 + i * 90, PY - 40 - ph * 60, 20, chill * Math.sin(ph * Math.PI), t + i); }
        K.tag('ROOF', 800, TAGY, PX + 20, PY + 16, 56, pop(lt, rf));
      } });
    cue(st, 'whoosh'); cue(st + ic, 'slide', { dur: 0.35, gain: 0.4 }); cue(st + ic + 0.35, 'plop', { gain: 0.4 }); cue(st + ch, 'sparkle', { dur: 0.7, gain: 0.5 }); cue(st + rf, 'pop', { gain: 0.6 });
  }

  // ── 4 · and your body rushes to warm it back up: red flow arrows rush up the neck to the palate; warm rings on "warm" ──
  {
    const st = cut(3), bo = Wd('body', 3) - st, ru = Wd('rushes', 3) - st, wa = Wd('warm', 3) - st;
    const PATH = [[-10, 330], [-10, 170], [40, 80], [150, 46]].map(([x, y]) => [HX + x * HS, HY + y * HS]);
    const along = (u) => { const n = PATH.length - 1, k = clamp(u) * n, i = Math.min(n - 1, Math.floor(k)), f = k - i; const a = PATH[i], b = PATH[i + 1]; return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), Math.atan2(b[1] - a[1], b[0] - a[0])]; };
    add({ id: 'S04', at: st, cam: [520, 800], zoom: 0.08, note: 'cutaway, palate icy: on "rushes" red flow arrows race up the neck to the roof of the mouth; on "warm" yellow/red warm rings pulse round the palate; eyes go from squeezed to open',
      draw(lt, d, t) {
        plain();
        K.headCut(HX, HY, HS, { t, chill: 1 - 0.25 * seg(lt, wa, wa + 0.8), eyes: lt > wa ? 'n' : 'squeeze', brow: lt > bo ? 0.5 : 0, scoop: [200, 62, out(lt, 0.2, 0.6)] });
        if (lt > ru) {
          const a0 = eo(seg(lt, ru, ru + 0.15));
          for (let i = 0; i < 3; i++) { const ph = ((lt - ru) * 1.4 + i / 3) % 1, [x, y, an] = along(ph); K.flowArrow(x, y, 120, an, a0 * Math.sin(ph * Math.PI), C.red, 22); }
        }
        warmRings(PX, PY + 10, lt > wa ? seg(lt, wa, wa + 0.6) : 0, t, 0.9, 0.42);
      } });
    cue(st, 'whoosh'); cue(st + ru, 'slide', { dur: 0.6, gain: 0.5 }); cue(st + wa, 'sparkle', { dur: 0.5, gain: 0.4 });
  }

  // ── 5 · Blood vessels in your head narrow, then widen: tube close-up; head badge on "head"; squeeze on "narrow", wide on "widen" ──
  const VY = 780;
  const vr = (lt, nr, wi) => lerp(lerp(190, 105, eio(seg(lt, nr, nr + 0.3))), 250, eob(seg(lt, wi, wi + 0.35)));
  {
    const st = cut(4), hd = Wd('head', 4) - st, nr = Wd('narrow', 4) - st, wi = Wd('widen', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 800], zoom: 0.07, note: 'blood vessel close-up (tube across the frame, red cells drifting); small hero-head badge pops top-left on "head"; on "narrow" the tube squeezes thin with pale-blue arrows pressing in; on "widen" it opens wide with pink arrows pushing out',
      draw(lt, d, t) {
        plain();
        const r = vr(lt, nr, wi);
        K.vessel(VY, r, t, lt > nr && lt < wi ? 0.4 : 1);
        const sq = lt > nr ? eo(seg(lt, nr, nr + 0.2)) * out(lt, wi - 0.05, 0.15) : 0;
        for (const x of [330, 750]) for (const sd of [-1, 1]) K.flowArrow(x, VY + sd * (r + 115), 100, sd < 0 ? Math.PI / 2 : -Math.PI / 2, sq, C.sky, 22);
        const wd = lt > wi ? eo(seg(lt, wi, wi + 0.2)) : 0;
        for (const x of [330, 750]) for (const sd of [-1, 1]) K.flowArrow(x, VY + sd * (r + 75), 80, sd < 0 ? -Math.PI / 2 : Math.PI / 2, wd, C.pinkLight, 20, C.pinkDark);
        const hb = pop(lt, hd);
        if (hb > 0) { ctx.save(); ctx.translate(540, 250); ctx.scale(hb, hb); ctx.beginPath(); ctx.arc(0, 0, 120, 0, TAU); ctx.fillStyle = C.ink; ctx.fill(); ctx.beginPath(); ctx.arc(0, 0, 106, 0, TAU); ctx.fillStyle = C.white; ctx.fill();
          ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 106, 0, TAU); ctx.clip(); K.heroHead(0, 10, 0.66, { eyes: 'squeeze', mouth: 'flat', frown: true }); ctx.restore(); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'bubbles', { dur: 1.0, gain: 0.25 }); cue(st + hd, 'pop', { gain: 0.5 }); cue(st + nr, 'slide', { dur: 0.3, gain: 0.5 }); cue(st + wi, 'boing', { gain: 0.5 });
  }

  // ── 6 · to let in warm blood: the wide tube, red flow arrows rush through; warm rings on "warm" ──
  {
    const st = at('to', 5), le = Wd('let', 5) - st, wa = Wd('warm', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 820], zoom: 0.1, note: 'same wide vessel, cells speed up; red flow arrows stream along it on "let in"; warm yellow/red rings pulse on "warm"',
      draw(lt, d, t) {
        plain();
        K.vessel(VY, 250, t * 1.8, 1.6);
        const a0 = lt > le - 0.05 ? eo(seg(lt, le - 0.05, le + 0.15)) : 0;
        for (let i = 0; i < 3; i++) { const ph = (lt * 0.9 + i / 3) % 1; K.flowArrow(lerp(-80, 1160, ph), VY + [-70, 40, -10][i], 200, 0, a0 * Math.sin(ph * Math.PI), C.red, 26); }
        warmRings(540, VY, lt > wa ? seg(lt, wa, wa + 0.5) : 0, t, 0.85, 0.55);
      } });
    cue(st, 'whoosh'); cue(st + le, 'slide', { dur: 0.6, gain: 0.5 }); cue(st + wa, 'sparkle', { dur: 0.4, gain: 0.4 });
  }

  // ── 7 · That triggers your trigeminal nerve: cutaway; the nerve draws from the face to the brain with a yellow signal; pill on "trigeminal" ──
  {
    const st = cut(6), tr = Wd('triggers', 6) - st, tg = Wd('trigeminal', 6) - st;
    const NP = K.hcPath(HX, HY, HS, 'nerve'), NF = K.hcPath(HX, HY, HS, 'nerveF');
    add({ id: 'S07', at: st, cam: [560, 700], zoom: 0.1, note: 'cutaway (palate icy): on "triggers" a pink nerve draws from the cheek and forehead back to the brain, yellow signal blips run along it; TRIGEMINAL NERVE pill on "trigeminal"',
      draw(lt, d, t) {
        plain();
        K.headCut(HX, HY, HS, { t, chill: 0.8, eyes: lt > tr ? 'wide' : 'n', brow: lt > tr ? 0.9 : 0.3 });
        const dr = lt > tr - 0.05 ? eo(seg(lt, tr - 0.05, tr + 0.4)) : 0;
        const bp = lt > tr + 0.3 ? ((lt - tr - 0.3) * 1.5) % 1 : -1;
        if (dr > 0) { K.nerve(NF, bp, dr); K.nerve(NP, bp, dr); }
        K.pill('TRIGEMINAL NERVE', 540, 250, 52, C.ink, C.white, pop(lt, tg));
      } });
    cue(st, 'whoosh'); cue(st + tr, 'slide', { dur: 0.4, gain: 0.4 }); cue(st + tr + 0.3, 'sparkle', { dur: 0.6, gain: 0.35 }); cue(st + tg, 'pop', { gain: 0.6 });
  }

  // ── 8 · which senses pain in your face: big face close-up; red pain zaps on the cheeks on "pain", red dashed ring on "face" ──
  {
    const st = cut(7), pn = Wd('pain', 7) - st, fc = Wd('face', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.08, note: 'room: big hero face; on "pain" he squeezes his eyes and red pain zaps flicker on both cheeks; on "face" a red dashed ring circles his face',
      draw(lt, d, t) {
        K.home();
        const hurt = lt > pn;
        K.heroHead(540, 780, 2.1, { eyes: hurt ? 'squeeze' : 'n', mouth: hurt ? 'flat' : 'o', frown: hurt, brow: hurt ? 0 : 0.7 });
        for (const sd of [-1, 1]) K.painZap(540 + sd * 140, 860, 0.8, pop(lt, pn + (sd > 0 ? 0.06 : 0), 0.25), t, sd < 0 ? [-2.6, -3.3, 2.5] : [-0.55, 0.15, 0.65]);
        K.pinchRing(540, 790, 320, 360, seg(lt, fc, d), lt > fc ? eo(seg(lt, fc, fc + 0.2)) : 0);
      } });
    cue(st, 'whoosh'); cue(st + pn, 'slam', { gain: 0.5 }); cue(st + fc, 'pop', { gain: 0.5 });
  }

  // ── 9 · so your brain blames your forehead instead: a cartoon brain pops on "brain", points on "blames", red zap on the forehead on "forehead" ──
  {
    const st = cut(8), bn = Wd('brain', 8) - st, bl = Wd('blames', 8) - st, fh = Wd('forehead', 8) - st, ins = Wd('instead', 8) - st;
    const FH = [350, 672], BB = [800, 880, 0.6];
    add({ id: 'S09', at: st, cam: [560, 780], zoom: 0.08, note: 'room: hero face (left) wincing; a cartoon brain with eyes pops on the right on "brain"; on "blames" it smirks and points its little arm at his forehead; red pain zap on his forehead on "forehead"; hero rubs nothing, just winces, brows up on "instead"',
      draw(lt, d, t) {
        K.home();
        K.heroHead(330, 760, 1.9, { eyes: lt > fh ? 'squeeze' : 'n', mouth: 'flat', frown: lt > fh, brow: lt > ins ? 1 : 0.4, look: 1 });
        const bs = pop(lt, bn);
        if (bs > 0) { ctx.save(); ctx.translate(BB[0], BB[1]); ctx.scale(bs, bs); K.brainBuddy(0, 0, BB[2], { t, point: lt > bl ? eob(seg(lt, bl, bl + 0.3)) : 0, ang: Math.atan2(FH[1] - BB[1], FH[0] - BB[0]), look: -1, mouth: lt > bl ? 'smirk' : 'smile' }); ctx.restore(); }
        K.painZap(FH[0], FH[1], 0.75, pop(lt, fh, 0.25), t, [-2.6, -1.57, -0.55]);
      } });
    cue(st, 'whoosh'); cue(st + bn, 'pop', { gain: 0.6 }); cue(st + bl, 'slide', { dur: 0.25, gain: 0.4 }); cue(st + fh, 'slam', { gain: 0.6 }); cue(st + ins, 'boing', { gain: 0.3 });
  }

  // ── 10 · It's not serious, and usually gone within two minutes: calm check on "serious", stopwatch on "gone", 2 MINUTES on "two" ──
  {
    const st = cut(9), nt = Wd('not', 9) - st, se = Wd('serious', 9) - st, gn = Wd('gone', 9) - st, tw = Wd('two', 9) - st;
    add({ id: 'S10', at: st, cam: [560, 720], zoom: 0.06, note: 'room: hero wincing with icy flakes round his head, relaxes into a calm smile on "not serious"; green check pops on "serious" and shrinks away on "gone" as the stopwatch (sweeping hand) pops into the same spot below the window; flakes fade on "gone"; 2 MINUTES pill under it on "two"',
      draw(lt, d, t) {
        K.home();
        const calm = lt > nt;
        hero({ x: 300, eyes: calm ? 'n' : 'squeeze', mouth: calm ? 'smile' : 'flat', frown: !calm, brow: calm ? 0.4 : 0 });
        const fa = out(lt, gn, 0.4);
        [[-0.9, 240], [0.1, 250], [0.9, 240]].forEach(([an, r], i) => flake(300 + Math.cos(an - Math.PI / 2) * r, 615 + Math.sin(an - Math.PI / 2) * r, 28, fa, t * 0.5 + i));
        K.checkMark(800, 880, 1.3, pop(lt, se) * (1 - eio(seg(lt, gn - 0.05, gn + 0.15))));
        const sw = pop(lt, gn);
        if (sw > 0) K.stopwatch(800, 870, 0.4 * sw, (lt - gn) * 4);
        K.pill('2 MINUTES', 800, 1070, 50, C.ink, C.white, pop(lt, tw));
      } });
    cue(st, 'whoosh'); cue(st + se, 'pop', { gain: 0.6 }); cue(st + gn, 'pop', { gain: 0.5 }); cue(st + gn + 0.3, 'tock', { gain: 0.35 }); cue(st + tw, 'pop', { gain: 0.6 }); cue(st + tw + 0.3, 'tock', { gain: 0.35 });
  }

  // ── 11 · Want it gone faster?: close-up, hero raises a finger with a smirk; yellow ? on "faster" ──
  {
    const st = cut(10), wn = Wd('want', 10) - st, fs = Wd('faster', 10) - st;
    add({ id: 'S11', at: st, cam: [520, 700], zoom: 0.08, note: 'room close-up: hero raises his index finger with a knowing smirk on "Want"; speed lines + yellow ? on "faster"',
      draw(lt, d, t) {
        K.home();
        K.man({ x: 400, y: 1260, s: 1.6, arm: K.armPose(K.ARM.down, K.ARM.point, eio(seg(lt, 0, wn + 0.2))), finger: 0, eyes: 'n', mouth: 'smirk', smirk: true, brow: lt > fs ? 0.8 : 0.4 });
        bigText('?', 830, 560, 170, C.yellow, 0.12, pop(lt, fs, 0.25));
        K.speedLines(830, 560, lt > fs ? eo(seg(lt, fs, fs + 0.2)) : 0);
      } });
    cue(st, 'whoosh'); cue(st + wn, 'pop', { gain: 0.4 }); cue(st + fs, 'zip', { gain: 0.5 });
  }

  // ── 12 · Press your tongue to the roof of your mouth: cutaway; the tongue rises from "Press", TONGUE tag on "tongue", ring on "roof" ──
  {
    const st = cut(11), pr = Wd('press', 11) - st, tg = Wd('tongue', 11) - st, rf = Wd('roof', 11) - st;
    const [TX, TY] = P('tongue');
    add({ id: 'S12', at: st, cam: [600, 820], zoom: 0.1, note: 'cutaway (palate icy): on "Press" the tongue rises and presses flat against the roof by "roof"; yellow arrow pushes up under it; TONGUE tag on "tongue"; yellow ring round the palate on "roof"',
      draw(lt, d, t) {
        plain();
        const up = eio(seg(lt, pr, rf + 0.1));
        K.headCut(HX, HY, HS, { t, chill: 1, tongue: up, eyes: 'n', brow: 0.6 });
        K.flowArrow(TX + 10, TY + 120 - up * 30, 110, -Math.PI / 2, lt > pr ? eo(seg(lt, pr, pr + 0.2)) * out(lt, rf + 0.3, 0.3) : 0, C.yellow, 22, C.ink);
        K.tag('TONGUE', 800, TAGY, TX + 30, TY + 40 - up * 40, 56, pop(lt, tg));
        ring(PX, PY + 6, 135, 55, lt > rf ? eo(seg(lt, rf, rf + 0.25)) : 0, out(lt, rf + 0.6, 0.3));
      } });
    cue(st, 'whoosh'); cue(st + pr, 'slide', { dur: 0.6, gain: 0.4 }); cue(st + tg, 'pop', { gain: 0.6 }); cue(st + rf + 0.1, 'thud', { gain: 0.5 });
  }

  // ── 13 · Its warmth thaws the freeze: warm rings from the tongue on "warmth"; the icy palate melts back to pink on "thaws"; happy eyes ──
  {
    const st = cut(12), wa = Wd('warmth', 12) - st, th = Wd('thaws', 12) - st, fz = Wd('freeze', 12) - st;
    add({ id: 'S13', at: st, cam: [620, 820], zoom: 0.1, note: 'cutaway, tongue pressed up: warm yellow/red rings pulse from the tongue on "warmth"; on "thaws" the blue palate fades back to pink, icicles shrink, drops fall; happy closed eyes + check on "freeze"',
      draw(lt, d, t) {
        plain();
        const melt = lt > th ? eio(seg(lt, th, th + 0.5)) : 0;
        K.headCut(HX, HY, HS, { t, chill: 1 - melt, tongue: 1, eyes: lt > th ? 'closed' : 'n', brow: 0.5 });
        warmRings(PX, PY + 20, lt > wa ? seg(lt, wa, wa + 0.6) : 0, t, out(lt, fz + 0.3, 0.3), 0.42);
        if (melt > 0) for (let i = 0; i < 3; i++) { const ph = ((lt - th) * 1.4 + i / 3) % 1; K.drop(PX - 80 + i * 70, PY + 30 + ph * 50, 0.45, 0, Math.sin(ph * Math.PI) * out(lt, th + 1.0, 0.3)); }
        K.checkMark(860, 420, 1.1, pop(lt, fz));
      } });
    cue(st, 'whoosh'); cue(st + wa, 'sparkle', { dur: 0.5, gain: 0.4 }); cue(st + th, 'bubbles', { dur: 0.5, gain: 0.35 }); cue(st + fz, 'pop', { gain: 0.6 });
  }

  // ── 14a · Next Body File: hero waves; BODY FILES badge (series name only) on "Next" ──
  {
    const st = cut(13), nx = Wd('next', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 640], zoom: 0.05, note: 'room: BODY FILES badge (series name only) pops on "Next"; hero waves with a warm smile',
      draw(lt) {
        K.home();
        K.filesBadge('BODY FILES', 540, 150, 60, pop(lt, nx));
        hero({ arm: K.armPose(K.ARM.down, K.ARM.wave, eio(seg(lt, 0.05, 0.4))), mouth: 'smile', brow: 0.5 });
      } });
    cue(st, 'whoosh'); cue(st + nx, 'thud', { gain: 0.6 });
  }
  // ── 14b · what happens when you get goosebumps: ? on "happens"; skin patch with goosebumps rising + NEXT on "goosebumps" ──
  {
    const st = at('what', 13), hp = Wd('happens', 13) - st, gb = Wd('goosebumps', 13) - st;
    add({ id: 'S15', at: st, cam: [600, 760], zoom: 0.05, note: 'room: hero lowers his wave and looks right, curious; yellow ? on "happens"; on "goosebumps" the ? shrinks away and a round skin patch pops with goosebumps rising + hairs standing, yellow NEXT pill',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 150, 60, 1);
        hero({ arm: K.armPose(K.ARM.down, K.ARM.wave, 1 - eio(seg(lt, 0, 0.35))), look: 1, brow: lt > gb ? 0.9 : 0.6, mouth: lt > gb ? 'o' : 'smile' });
        bigText('?', PATCH[0] - 60, PATCH[1] - 40, 160, C.yellow, 0.12, pop(lt, hp, 0.25) * out(lt, gb - 0.05, 0.15));
        K.skinPatch(PATCH[0], PATCH[1], PATCH[2], { bumps: lt > gb ? eo(seg(lt, gb + 0.1, gb + 0.6)) : 0, t, sc: pop(lt, gb) });
        K.pill('NEXT', NEXTP[0], NEXTP[1], 60, C.yellow, C.ink, pop(lt, gb + 0.05));
      } });
    cue(st, 'whoosh'); cue(st + hp, 'pop', { gain: 0.5 }); cue(st + gb, 'pop', { gain: 0.6 }); cue(st + gb + 0.1, 'sparkle', { dur: 0.5, gain: 0.4 }); cue(st + gb + 0.05, 'thud', { gain: 0.5 });
  }

  // ── 15a · the same reaction: close-up of the skin patch, the bumps rise in a wave on "reaction" ──
  {
    const st = cut(14), re = Wd('reaction', 14) - st;
    add({ id: 'S16', at: st, cam: [540, 720], zoom: 0.08, note: 'close-up of the round skin patch: hairs lying flat, small bumps; on "reaction" the goosebumps swell up and the hairs stand on end with a slight shiver',
      draw(lt, d, t) {
        plain();
        K.skinPatch(540, 720, 360, { bumps: lerp(0.25, 1, lt > re ? eob(seg(lt, re, re + 0.4)) : 0), t: lt > re ? t : 0 });
      } });
    cue(st, 'whoosh'); cue(st + re, 'sparkle', { dur: 0.5, gain: 0.5 });
  }
  // ── 15b · END CARD: that puffs up a hissing cat: cute cat pops + puffs on "puffs", hiss mouth on "hissing"; patch + NEXT; FOLLOW; hero grins ──
  {
    const st = at('puffs', 14), pf = Wd('puffs', 14) - st, hs = Wd('hissing', 14) - st, ct = Wd('cat', 14) - st;
    add({ id: 'S17', at: st, cam: [560, 700], zoom: 0.04, note: 'end card (room): BODY FILES badge; skin patch with goosebumps + NEXT pill stay; a cute orange cat pops in on "puffs" and its fur puffs up (spiky outline, bushy tail, big eyes); tiny "o" hiss mouth on "hissing"; hero looks at it, then grins at camera on "cat"; + FOLLOW pill after "cat"',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 150, 60, 1);
        hero({ look: lt > ct ? 0 : 1, brow: 0.6, mouth: lt > ct ? 'grin' : 'smile', eyes: lt > pf && lt < ct ? 'wide' : 'n' });
        K.skinPatch(PATCH[0], PATCH[1], PATCH[2], { bumps: 1, t });
        K.pill('NEXT', NEXTP[0], NEXTP[1], 60, C.yellow, C.ink, 1);
        const pu = lt > pf ? clamp(eob(seg(lt, pf + 0.1, pf + 0.45))) : 0;
        K.cat(CAT[0], CAT[1], CAT[2] * (1 + 0.03 * Math.sin(lt * 8) * pu), { puff: pu, t, sc: pop(lt, pf - 0.02, 0.25) });
        K.followPill(300, 330, pop(lt, ct + 0.3), t, 54);
      } });
    cue(st, 'whoosh'); cue(st + pf, 'pop', { gain: 0.5 }); cue(st + pf + 0.1, 'boing', { gain: 0.5 }); cue(st + hs, 'sizzle', { dur: 0.35, gain: 0.25 }); cue(st + ct + 0.3, 'pop', { gain: 0.6 });
  }

  return { shots: S, cues: CUES };
}
