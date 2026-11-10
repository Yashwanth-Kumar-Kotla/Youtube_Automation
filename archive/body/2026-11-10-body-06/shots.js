// WHAT HAPPENS WHEN YOUR FOOT FALLS ASLEEP?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Tone: curious, playful, accurate. The hero sits cross-legged on a sofa in K.home(); his screen-right foot (its shin under
// the other one) falls asleep. A sleepy cartoon foot (K.sleepyFoot) is the star; a leg cutaway lens (K.nerveLens) shows the
// nerve squashed by the other shin, yellow signal blips blocked, then released. Pins and needles = icons beside the foot,
// three feeling badges (tingling / prickling / burning symbol). Timer for "a minute or two", calm doctor badge.
// Tease: a smiling cartoon tooth + a glass of milk + NEXT; the hero only watches and grins.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, bigText, line, TAU } from './core/lib.js';
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
  const out = (lt, a, d = 0.25) => 1 - eio(seg(lt, a, a + d));
  const alpha = (a, fn) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); fn(); ctx.restore(); };
  const pointer = (x0, y0, x1, y1, a = 1) => alpha(a, () => { line([[x0, y0], [x1, y1]], C.ink, 10); ctx.beginPath(); ctx.arc(x1, y1, 12, 0, TAU); ctx.fillStyle = C.ink; ctx.fill(); });
  const rug = (x, y, rx = 360) => { ctx.fillStyle = C.floor; ctx.beginPath(); ctx.ellipse(x, y, rx, 56, 0, 0, TAU); ctx.fill(); };

  // the sofa scene, drawn in "world" coords shifted up so the crossed legs sit above the caption zone
  const OX = 40, OY = -240, SOFA = [400, 1360], HX = 360, HY = 1360 - K.CROSS.seat;   // hero chest (world) when sitting
  const scene = (fn) => { ctx.save(); ctx.translate(OX, OY); K.home(); K.sofa(SOFA[0], SOFA[1], 1); fn(); ctx.restore(); };
  const SX = (wx) => wx + OX, SY = (wy) => wy + OY;                                   // world -> screen
  const PINCH = [SX(HX + K.CROSS.pinch[0]), SY(HY + K.CROSS.pinch[1])];
  const FOOTP = [SX(HX + K.CROSS.foot[0] + 30), SY(HY + K.CROSS.foot[1] - 20)];

  // end-card layout
  const HERO = { x: 230, y: 1000, s: 1.0 };
  const hero = (o) => K.man({ ...HERO, ...o });
  const TOOTH = [680, 960, 0.75], GLASSP = [925, 1000, 0.8], NEXTP = [805, 760];

  // ── 1 · HOOK: hero cross-legged on the sofa looks at his foot; a lens shows the foot's sleepy face; Zzz on "asleep" ──
  {
    const ft = Wd('foot', 0), as = Wd('asleep', 0);
    const LX = 850, LY = 640, LR = 165;
    add({ id: 'S01', at: 0, cam: [620, 820], zoom: 0.08, note: 'room + sofa: hero sits cross-legged, sways, looks down at his right foot; a round lens pops by 0.35 s (pointer to that foot) with the sleepy cartoon foot (closed eyes) inside; foot in the lens wiggles on "foot"; Z z z rise from it on "asleep", hero raises brows, "o" mouth',
      draw(lt, d, t) {
        const sway = Math.sin(lt * 2.4) * 6, wow = lt > as;
        scene(() => K.man({ x: HX + sway, y: HY, s: 1, cross: true, arm: K.ARM.knee, armL: K.ARM.knee, look: 1,
          eyes: wow ? 'wide' : 'n', mouth: wow ? 'o' : lt > ft ? 'flat' : 'smile', brow: wow ? 1 : 0.4 }));
        const lp = pop(lt, 0.05, 0.3);
        pointer(LX - 0.6 * (LR + 20), LY + 0.8 * (LR + 20), FOOTP[0] - 10, FOOTP[1] - 10, clamp(lp));
        if (lp > 0) {
          ctx.save(); ctx.translate(LX, LY); ctx.scale(lp, lp);
          ctx.beginPath(); ctx.arc(0, 0, LR + 14, 0, TAU); ctx.fillStyle = C.ink; ctx.fill();
          ctx.beginPath(); ctx.arc(0, 0, LR, 0, TAU); ctx.fillStyle = C.white; ctx.fill(); ctx.clip();
          const wig = lt > ft ? Math.sin((lt - ft) * 20) * 0.08 * Math.max(0, 1 - (lt - ft) * 2) : 0;
          ctx.translate(-30, 55); ctx.rotate(wig); K.sleepyFoot(0, 0, 0.62, { t });
          ctx.restore();
        }
        K.zzzStill(LX + 40, LY - 70, t, lt > as ? eo(seg(lt, as, as + 0.3)) : 0, 52);
        K.shockLines(SX(HX), SY(HY) - 345, 215, wow ? clamp((lt - as) * 5) * out(lt, as + 0.4, 0.25) : 0);
      } });
    cue(0.02, 'whoosh', { gain: 0.5 }); cue(0.1, 'pop', { gain: 0.5 }); cue(ft, 'boing', { gain: 0.35 }); cue(as, 'sparkle', { dur: 0.4, gain: 0.4 });
  }

  // ── 2a · Your foot isn't sleeping: big sleepy foot + Zzz; red X slams over the Zzz on "isn't" ──
  {
    const st = cut(1), is = Wd('isn', 1) - st, sl = Wd('sleeping', 1) - st;
    add({ id: 'S02', at: st, cam: [600, 720], zoom: 0.07, note: 'plain + rug: the big sleepy foot (closed eyes) with Z z z at its toes; red X slams over the Z z z on "isn\'t"; Zzz fade on "sleeping"',
      draw(lt, d, t) {
        plain(); rug(560, 930, 400);
        K.sleepyFoot(450, 800, 1.6, { t, sc: lerp(0.85, 1, eob(seg(lt, 0, 0.3))) });
        K.zzzStill(800, 330, t, out(lt, sl + 0.1, 0.3), 90);
        K.redX(870, 260, lerp(0.75, 0.38, eo(seg(lt, is, is + 0.2))), lt > is ? 1 : 0);
      } });
    cue(st, 'whoosh'); cue(st + is, 'slam', { gain: 0.6 });
  }

  // ── 2b · it's lost touch with your brain: brain buddy top-left, a nerve line down to the foot; the line snaps on "lost" ──
  {
    const st = at('it', 1), lo = Wd('lost', 1) - st, to = Wd('touch', 1) - st, br = Wd('brain', 1) - st;
    const PTS = [[366, 515], [385, 610], [450, 690], [560, 730], [680, 730], [752, 775]];
    add({ id: 'S03', at: st, cam: [560, 700], zoom: 0.07, note: 'plain: brain buddy (smiling) top-left, sleepy foot bottom-right, a pink nerve line between them with a yellow blip running down; on "lost" the line snaps in the middle (ends recoil, red X in the gap, blip gone); on "touch" brain goes wide-eyed; yellow ? pops by the brain on "brain"',
      draw(lt, d, t) {
        plain();
        const snap = lt > lo, rc = snap ? eob(seg(lt, lo, lo + 0.3)) : 0;
        const A = PTS.slice(0, 3).concat([[lerp(560, 515, rc), lerp(730, 715, rc)]]);
        const B = [[lerp(560, 615, rc), lerp(730, 738, rc)]].concat(PTS.slice(4));
        if (!snap) K.nerve(PTS, (lt * 1.6) % 1);
        else { K.nerve(A); K.nerve(B); K.redX(565, 730, 0.22 * eob(seg(lt, lo, lo + 0.25)), 1); }
        K.sleepyFoot(760, 1000, 0.9, { t });
        K.brainBuddy(330, 380, 0.75, { t, look: snap ? 1 : 0.4, mouth: lt > to ? 'o' : 'smile' });
        bigText('?', 660, 270, 160, C.yellow, 0.12, pop(lt, br, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 0.3, gain: 0.3 }); cue(st + lo, 'zip', { gain: 0.6 }); cue(st + lo + 0.05, 'pop', { gain: 0.5 }); cue(st + br, 'boing', { gain: 0.45 });
  }

  // ── 3 · and the wake-up is even weirder: foot pops its eyes open on "wake-up"; pins & needles icons burst on "weirder" ──
  {
    const st = cut(2), wk = Wd('wake', 2) - st, wd = Wd('weirder', 2) - st;
    add({ id: 'S04', at: st, cam: [560, 720], zoom: 0.1, note: 'plain + rug: sleepy foot with Z z z; on "wake-up" Zzz vanish, eyes pop WIDE open, shock lines; on "weirder" pins, needles and sparkles pop round it (own lanes, never touching), foot jiggles with a wavy mouth',
      draw(lt, d, t) {
        plain(); rug(560, 950, 400);
        const awake = lt > wk, wr = lt > wd;
        const jig = wr ? Math.sin(lt * 40) * 6 : 0;
        K.sleepyFoot(450 + jig, 830, 1.5, { t, wake: awake ? 1 : 0, wide: awake, mouth: wr ? 'wavy' : awake ? 'o' : null });
        K.zzzStill(800, 380, t, out(lt, wk - 0.05, 0.15), 86);
        K.shockLines(600, 560, 300, awake ? clamp((lt - wk) * 5) * out(lt, wk + 0.5, 0.25) : 0);
        const P = pop(lt, wd, 0.25), N = pop(lt, wd + 0.12, 0.25);
        K.tingles([[150, 470, 'pin', -0.4, P], [900, 330, 'pin', 0.4, P], [110, 760, 'needle', 0.35, N], [960, 600, 'needle', -0.35, N],
          [380, 300, 'spark', 0, P], [960, 900, 'spark', 0, N]], t, 1.2);
      } });
    cue(st, 'whoosh'); cue(st + wk, 'boing', { gain: 0.6 }); cue(st + wd, 'sparkle', { dur: 0.5, gain: 0.6 }); cue(st + wd + 0.12, 'pop', { gain: 0.5 });
  }

  // ── 4 · Sit cross-legged too long, and you squash a nerve: hero plops down cross-legged; stopwatch on "long"; pinch on "squash"; NERVE tag ──
  {
    const st = cut(3), lg = Wd('long', 3) - st, sq = Wd('squash', 3) - st, nv = Wd('nerve', 3) - st;
    add({ id: 'S05', at: st, cam: [500, 860], zoom: 0.1, note: 'room + sofa: hero bounces down onto the sofa cross-legged by 0.3 s, relaxed smile; small stopwatch pops beside his head on "long" (hand whizzing); on "squash" the top shin presses (shake) and a red pinch icon squeezes at the crossing, hero "o"; NERVE tag points at the pinch on "nerve"',
      draw(lt, d, t) {
        const drop = lt < 0.3 ? -70 * (1 - eob(seg(lt, 0, 0.3))) : 0, sqz = lt > sq;
        const shake = sqz ? Math.sin(lt * 60) * 5 * Math.max(0, 1 - (lt - sq) * 3) : 0;
        scene(() => K.man({ x: HX + shake, y: HY + drop, s: 1, cross: true, arm: K.ARM.knee, armL: K.ARM.knee, look: sqz ? 1 : 0,
          eyes: sqz ? 'wide' : 'n', mouth: sqz ? 'o' : 'smile', brow: sqz ? 0.9 : 0.3 }));
        const sw = pop(lt, lg, 0.3);
        if (sw > 0) K.stopwatch(170, 330, 0.3 * sw, (lt - lg) * 9);
        K.pinchIcon(PINCH[0], PINCH[1], 0.55, sqz ? eio(seg(lt, sq, sq + 0.3)) : 0, pop(lt, sq, 0.25));
        K.tag('NERVE', 770, 870, PINCH[0] + 70, PINCH[1] - 10, 52, pop(lt, nv, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + 0.28, 'thud', { gain: 0.5 }); cue(st + lg, 'tock', { gain: 0.6 }); cue(st + lg + 0.35, 'tock', { gain: 0.5 });
    cue(st + sq, 'slam', { gain: 0.55 }); cue(st + nv, 'pop', { gain: 0.6 });
  }

  // ── 5 · Under that pressure, its messages stop getting through: leg cutaway lens; squash on "pressure", blips on "messages", blocked on "stop" ──
  {
    const st = cut(4), pr = Wd('pressure', 4) - st, ms = Wd('messages', 4) - st, sp = Wd('stop', 4) - st;
    const LX = 540, LY = 700, LR = 360;
    add({ id: 'S06', at: st, cam: [440, 720], zoom: 0.1, note: 'plain: big round cutaway lens of the lower leg: pink nerve across it, the other shin (navy) above; the shin presses down and flattens the nerve on "pressure"; yellow signal blips run along from the left on "messages"; on "stop" they pile up and fizzle at the pinch, red X pops above the pinch',
      draw(lt, d, t) {
        plain();
        const squash = lt < pr - 0.25 ? 0.15 * eio(seg(lt, 0.1, pr - 0.25)) : lerp(0.15, 1, eob(seg(lt, pr - 0.25, pr + 0.15)));
        const o = K.nerveLens(LX, LY, LR, { squash, flow: lt > ms ? (lt - ms) * 1.1 : -1, block: lt > sp ? eo(seg(lt, sp - 0.1, sp + 0.15)) : 0, sc: eob(seg(lt, 0, 0.3)), t });
        K.redX(LX - 200, LY - 30, 0.22 * eob(seg(lt, sp, sp + 0.25)), lt > sp ? 1 : 0);
        void o;
      } });
    cue(st, 'whoosh'); cue(st + pr - 0.2, 'slide', { dur: 0.35, gain: 0.4 }); cue(st + pr + 0.1, 'thud', { gain: 0.6 }); cue(st + ms, 'sparkle', { dur: 0.4, gain: 0.35 }); cue(st + sp, 'slam', { gain: 0.5 });
  }

  // ── 6 · so your foot goes numb and hard to move: a finger pokes the foot (no reaction) on "numb", it goes pale; it flops on "hard to move" ──
  {
    const st = cut(5), ft = Wd('foot', 5) - st, nb = Wd('numb', 5) - st, hd = Wd('hard', 5) - st, mv = Wd('move', 5) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.08, note: 'plain + rug: sleepy foot (eyes shut); on "numb" it fades pale and a finger reaches in from the left and pokes its heel: no reaction (Zzz bob on); on "hard" it tries to lift and flops floppy like jelly, on "move" it slumps back with a wavy mouth',
      draw(lt, d, t) {
        plain(); rug(580, 960, 400);
        const pale = lt > nb ? eo(seg(lt, nb, nb + 0.35)) : 0;
        const pk = lt > nb - 0.1 && lt < nb + 0.9 ? Math.sin(Math.PI * seg(lt, nb - 0.1, nb + 0.9)) : 0;
        const flop = lt > hd ? Math.sin((lt - hd) * 13) * 0.16 * Math.max(0, 1 - (lt - hd) * 0.9) : 0;
        ctx.save(); ctx.translate(380, 960); ctx.rotate(-Math.abs(flop) * 1.2 + flop * 0.4); ctx.translate(-380, -960);
        K.sleepyFoot(500, 830, 1.5, { t, pale, mouth: lt > mv ? 'wavy' : null, sc: lerp(0.9, 1, eob(seg(lt, 0, 0.25))) });
        ctx.restore();
        if (pk > 0.01) K.reachArm(-260, 900, lerp(-140, 290, pk), 860, 1.1);
        K.zzzStill(850, 390, t, 1, 86);
        void ft;
      } });
    cue(st, 'whoosh'); cue(st + nb, 'pop', { gain: 0.4 }); cue(st + hd, 'boing', { gain: 0.6 }); cue(st + mv, 'boing', { gain: 0.4 });
  }

  // ── 7 · Then you stand up, the pressure lets go: hero unfolds and stands on "stand"; lens: the press lifts off the nerve on "lets go" ──
  {
    const st = cut(6), sd = Wd('stand', 6) - st, pr = Wd('pressure', 6) - st, go = Wd('lets', 6) - st;
    const LX = 850, LY = 650, LR = 160;
    add({ id: 'S08', at: st, cam: [560, 760], zoom: 0.07, note: 'room + sofa: hero sits cross-legged, on "stand" he hops up and stands in front of the sofa (burst), smiling; small leg cutaway lens pops right (below the window) on "pressure" with the shin pressing; on "lets go" the shin lifts off, the nerve springs back round, yellow up-arrow',
      draw(lt, d, t) {
        const up = lt > sd + 0.05, hop = up ? Math.sin(Math.PI * seg(lt, sd + 0.05, sd + 0.35)) * 40 : 0;
        scene(() => {
          if (!up) K.man({ x: HX, y: HY - eio(seg(lt, sd - 0.25, sd + 0.05)) * 25, s: 1, cross: true, arm: K.ARM.knee, armL: K.ARM.knee, look: 1, mouth: 'flat', brow: 0.5 });
          else K.man({ x: HX, y: 1560 - 620 - hop, s: 1, arm: K.ARM.down, look: lt > go ? 1 : 0, mouth: 'smile', brow: 0.6 });
        });
        if (up) K.burst(SX(HX), SY(1560) - 40, 1.2, 1 - seg(lt, sd + 0.2, sd + 0.55));
        const lift = lt > go ? eob(seg(lt, go, go + 0.35)) : 0;
        K.nerveLens(LX, LY, LR, { squash: 1 - lift, flow: lift > 0.5 ? (lt - go) * 1.2 : -1, sc: pop(lt, pr - 0.05), t });
        K.flowArrow(LX, LY - LR - 40, 110, -Math.PI / 2, lt > go ? eo(seg(lt, go, go + 0.25)) * out(lt, go + 0.6, 0.2) : 0, C.yellow, 20, C.ink);
      } });
    cue(st, 'whoosh'); cue(st + sd, 'boing', { gain: 0.5 }); cue(st + pr - 0.05, 'pop', { gain: 0.5 }); cue(st + go, 'zip', { gain: 0.5 });
  }

  // ── 8 · and your nerve wakes back up: big lens, nerve glows on "nerve", blips flood + sparkles on "wakes" ──
  {
    const st = cut(7), nv = Wd('nerve', 7) - st, wk = Wd('wakes', 7) - st;
    const LX = 540, LY = 700, LR = 360;
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.1, note: 'plain: big leg cutaway lens, no press; the nerve lights up yellow-edged on "nerve"; on "wakes" yellow blips rush along it and sparkles pop round the lens',
      draw(lt, d, t) {
        plain();
        const g = lt > nv ? eo(seg(lt, nv, nv + 0.3)) : 0;
        K.nerveLens(LX, LY, LR, { squash: 0, glow: g, flow: lt > wk ? (lt - wk) * 2.2 : -1, sc: eob(seg(lt, 0, 0.3)), t });
        if (lt > wk) [[190, 340], [890, 330], [930, 1010], [160, 1000]].forEach(([x, y], i) => K.sparkle4(x, y, 46, pop(lt, wk + i * 0.08, 0.25), t + i));
      } });
    cue(st, 'whoosh'); cue(st + nv, 'sparkle', { dur: 0.3, gain: 0.4 }); cue(st + wk, 'sparkle', { dur: 0.6, gain: 0.6 }); cue(st + wk + 0.4, 'boing', { gain: 0.4 });
  }

  // ── 9a · That's the pins and needles: hero (room) watches his awake foot icon; pins on "pins", needles on "needles" ──
  const FOOT9 = [770, 960, 0.9];
  {
    const st = cut(8), pn = Wd('pins', 8) - st, nd = Wd('needles', 8) - st;
    add({ id: 'S10', at: st, cam: [600, 800], zoom: 0.06, note: 'room: hero standing left, looking right at the big awake foot (wide eyes, wavy mouth, jiggling); on "pins" pin icons pop on both sides of the foot, on "needles" needle icons; hero wide-eyed "o" then a grin',
      draw(lt, d, t) {
        K.home();
        hero({ x: 260, look: 1, eyes: lt > pn ? 'wide' : 'n', mouth: lt > nd + 0.3 ? 'grin' : lt > pn ? 'o' : 'smile', brow: 0.8 });
        const jig = lt > pn ? Math.sin(lt * 40) * 4 : 0;
        K.sleepyFoot(FOOT9[0] + jig, FOOT9[1], FOOT9[2], { t, wake: 1, wide: true, mouth: lt > pn ? 'wavy' : 'o', sc: eob(seg(lt, 0, 0.25)) });
        const P = pop(lt, pn, 0.25), N = pop(lt, nd, 0.25);
        K.tingles([[590, 820, 'pin', -0.35, P], [1010, 790, 'pin', 0.35, P], [580, 1040, 'needle', 0.3, N], [1010, 1040, 'needle', -0.3, N]], t, 1.0);
      } });
    cue(st, 'whoosh'); cue(st + pn, 'sparkle', { dur: 0.35, gain: 0.5 }); cue(st + nd, 'sparkle', { dur: 0.35, gain: 0.5 });
  }

  // ── 9b · tingling, prickling, even burning: three feeling badges pop one per word, labelled; foot jiggles below ──
  {
    const st = at('tingling', 8), tg = Wd('tingling', 8) - st, pk = Wd('prickling', 8) - st, bn = Wd('burning', 8) - st;
    const B = [[190, 'tingle', 'TINGLING', tg], [540, 'prickle', 'PRICKLING', pk], [890, 'burn', 'BURNING', bn]];
    add({ id: 'S11', at: st, cam: [540, 640], zoom: 0.07, note: 'plain: three round feeling badges pop left to right, one on each word: sparkles TINGLING, pins PRICKLING, a flame symbol BURNING (a symbol only, no skin); the awake foot jiggles under them with a wavy mouth',
      draw(lt, d, t) {
        plain();
        for (const [x, kind, label, w] of B) { const p = pop(lt, w, 0.28); K.feelBadge(kind, x, 470, 0.95, p, t); K.pill(label, x, 715, 46, C.ink, C.white, p); }
        K.sleepyFoot(470 + Math.sin(lt * 38) * 4, 1010, 0.85, { t, wake: 1, wide: true, mouth: 'wavy' });
      } });
    cue(st, 'whoosh', { gain: 0.6 }); for (const [, , , w] of B) cue(st + w, 'pop', { gain: 0.6 }); cue(st + bn, 'sizzle', { dur: 0.3, gain: 0.2 });
  }

  // ── 10 · That feeling fades in a minute or two: tingles fade round the foot on "fades"; stopwatch; 1-2 MIN pill on "two" ──
  {
    const st = cut(9), fd = Wd('fades', 9) - st, mn = Wd('minute', 9) - st, tw = Wd('two', 9) - st;
    add({ id: 'S12', at: st, cam: [560, 700], zoom: 0.07, note: 'plain: awake foot on the left with pins/needles/sparkles round it; on "fades" they shrink and fade away and the foot relaxes into a smile; stopwatch pops on the right on "fades", hand sweeps; "1-2 MIN" pill pops under it on "two"',
      draw(lt, d, t) {
        plain(); rug(360, 990, 300);
        const f = lt > fd ? eio(seg(lt, fd, fd + 1.0)) : 0;
        K.sleepyFoot(320, 880, 0.95, { t, wake: 1, wide: f < 0.5, mouth: f > 0.6 ? null : 'wavy' });
        const k = 1 - f;
        K.tingles([[150, 540, 'pin', -0.35, k], [480, 500, 'needle', 0.3, k], [110, 880, 'spark', 0, k], [600, 980, 'spark', 0, k]], t, 1.0);
        const sw = pop(lt, fd, 0.3);
        if (sw > 0) K.stopwatch(800, 560, 0.6 * sw, lt > fd ? (lt - fd) * 3.2 : 0);
        K.pill('1-2 MIN', 800, 850, 62, C.yellow, C.ink, pop(lt, tw, 0.25));
        void mn;
      } });
    cue(st, 'whoosh'); cue(st + fd, 'sparkle', { dur: 0.9, gain: 0.35 }); cue(st + fd + 0.05, 'pop', { gain: 0.5 }); cue(st + mn, 'tock', { gain: 0.6 }); cue(st + tw, 'thud', { gain: 0.6 });
  }

  // ── 11 · If it happens often or won't go away, see a doctor: pins stack up (often), calm doctor badge on "doctor" ──
  {
    const st = cut(10), hp = Wd('happens', 10) - st, of = Wd('often', 10) - st, aw = Wd('away', 10) - st, se = Wd('see', 10) - st, dc = Wd('doctor', 10) - st;
    add({ id: 'S13', at: st, cam: [560, 820], zoom: 0.06, note: 'room: hero standing left, calm smile; one pin icon pops right on "happens", two more on "often" (it keeps happening), they jiggle on "away"; on "see" they shrink away; calm doctor badge pops on "doctor", hero points a finger up and smiles warmly',
      draw(lt, d, t) {
        K.home();
        const dp = pop(lt, dc, 0.3), pt = eio(seg(lt, dc - 0.35, dc));
        hero({ x: 260, arm: K.armPose(K.ARM.down, K.ARM.point, pt), finger: pt > 0.6 ? 0 : null, look: 1, mouth: lt > dc ? 'grin' : 'smile', brow: 0.4 });
        const gone = out(lt, dc - 0.15, 0.2), jg = lt > aw ? 1 : 0;
        const P = [[680, 820, hp], [810, 820, of], [940, 820, of + 0.12]];
        K.tingles(P.map(([x, y, w], i) => [x, y, 'pin', [-0.3, 0, 0.3][i] * (jg ? 1 : 0.4), pop(lt, w, 0.25) * gone]), t, 1.4);
        K.doctorBadge(800, 880, 0.95, dp);
      } });
    cue(st, 'whoosh'); cue(st + hp, 'pop', { gain: 0.5 }); cue(st + of, 'pop', { gain: 0.5 }); cue(st + of + 0.12, 'pop', { gain: 0.5 }); cue(st + dc, 'pop', { gain: 0.7 });
  }

  // ── 12a · Next Body File: hero waves; BODY FILES badge (series name only) on "Next" ──
  {
    const st = cut(11), nx = Wd('next', 11) - st;
    add({ id: 'S14', at: st, cam: [540, 640], zoom: 0.05, note: 'room: BODY FILES badge (series name only) pops on "Next"; hero waves with a warm smile',
      draw(lt) {
        K.home();
        K.filesBadge('BODY FILES', 540, 140, 60, pop(lt, nx));
        hero({ arm: K.armPose(K.ARM.down, K.ARM.wave, eio(seg(lt, 0.05, 0.4))), mouth: 'smile', brow: 0.5 });
      } });
    cue(st, 'whoosh'); cue(st + nx, 'thud', { gain: 0.6 });
  }
  // ── 12b · what happens if you knock out a tooth: ? on "happens"; smiling cartoon tooth + NEXT on "tooth" ──
  {
    const st = at('what', 11), hp = Wd('happens', 11) - st, th = Wd('tooth', 11) - st;
    add({ id: 'S15', at: st, cam: [560, 800], zoom: 0.05, note: 'room: hero lowers his wave and looks right, curious; yellow ? on "happens"; on "tooth" the ? shrinks away and a smiling cartoon tooth (clean white, no blood) pops in + yellow NEXT pill',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 140, 60, 1);
        hero({ arm: K.armPose(K.ARM.down, K.ARM.wave, 1 - eio(seg(lt, 0, 0.35))), look: 1, brow: lt > th ? 0.8 : 0.6, mouth: lt > th ? 'smirk' : 'smile', smirk: lt > th });
        bigText('?', TOOTH[0], TOOTH[1] - 40, 170, C.yellow, 0.12, pop(lt, hp, 0.25) * out(lt, th - 0.05, 0.15));
        K.tooth(TOOTH[0], TOOTH[1], TOOTH[2], { t, sc: pop(lt, th) });
        K.pill('NEXT', NEXTP[0], NEXTP[1], 60, C.yellow, C.ink, pop(lt, th + 0.05));
      } });
    cue(st, 'whoosh'); cue(st + hp, 'pop', { gain: 0.5 }); cue(st + th, 'pop', { gain: 0.6 }); cue(st + th + 0.05, 'thud', { gain: 0.5 });
  }

  // ── 13 · END CARD: and why a glass of milk might save it: milk glass on "milk", sparkles + tooth winks on "save"; FOLLOW; hero grins ──
  {
    const st = cut(12), wy = Wd('why', 12) - st, mk = Wd('milk', 12) - st, sv = Wd('save', 12) - st;
    add({ id: 'S16', at: st, cam: [560, 780], zoom: 0.04, note: 'end card (room): BODY FILES badge; tooth + NEXT stay; hero tilts his head curious on "why"; a glass of milk pops beside the tooth on "milk"; on "save" sparkles pop round tooth and glass, the tooth winks; hero grins at camera; + FOLLOW pill top-left',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 140, 60, 1);
        const sav = lt > sv;
        hero({ look: sav ? 0 : 1, brow: lt > wy ? 0.8 : 0.5, mouth: sav ? 'grin' : 'smile' });
        K.tooth(TOOTH[0], TOOTH[1], TOOTH[2], { t, wink: sav && lt < sv + 0.9 });
        K.pill('NEXT', NEXTP[0], NEXTP[1], 60, C.yellow, C.ink, 1);
        if (lt > mk) K.milkGlass(GLASSP[0], GLASSP[1], GLASSP[2] * pop(lt, mk), 0.78, t);
        if (sav) [[560, 870], [800, 1080], [1010, 880]].forEach(([x, y], i) => K.sparkle4(x, y, 30, pop(lt, sv + i * 0.08, 0.25) * (0.85 + 0.15 * Math.sin(t * 8 + i)), t + i));
        K.followPill(300, 330, pop(lt, sv + 0.2), t, 54);
      } });
    cue(st, 'whoosh'); cue(st + mk, 'plop', { gain: 0.5 }); cue(st + sv, 'sparkle', { dur: 0.5, gain: 0.5 }); cue(st + sv + 0.2, 'pop', { gain: 0.6 });
  }

  // tidy ids (S01..): sorted by time
  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES };
}
