// WHAT HAPPENS WHEN YOU GET GOOSEBUMPS?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Tone: curious, playful, accurate. Hook: the hero looks at his forearm in K.home(), a skin lens shows goosebumps rising.
// "Two jobs" = two pills. Mechanism: a chill (frost badge) or scare (BOO sign) flips a cartoon toggle; a skin cutaway
// lens (K.follicleLens) shows the tiny muscle squeezing a hair upright; a side skin lens (K.skinSideLens) shows hairs
// standing, bumps popping and warm air trapped. Cat puffs (K.cat). Job two: a cute lab mouse in a cold box ("IN MICE"),
// the nerve wakes sleepy stem cells, a new hair grows, 2 WEEKS calendar. Tease: a sleepy cartoon foot (Zzz) + pins and
// needles icons + NEXT; the hero only watches and grins at the end.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, bigText, line, TAU } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i) - 0.08;                       // a mid-line cut just before word w
  const nth = (w, i, k) => {                                   // start of the k-th (0-based) word w in line i
    const hits = T.words.filter((x) => x.line === i && x.w.toLowerCase().replace(/[^a-z0-9']+/g, '').startsWith(w));
    if (!hits[k]) throw new Error(`word "${w}" #${k} not found in line ${i}`); return hits[k].s;
  };
  const plain = () => { ctx.fillStyle = C.bg; ctx.fillRect(-300, -300, W + 600, H + 600); };
  const pop = (lt, a, d = 0.3) => (lt > a ? eob(seg(lt, a, a + d)) : 0);
  const out = (lt, a, d = 0.25) => 1 - eio(seg(lt, a, a + d));
  const alpha = (a, fn) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); fn(); ctx.restore(); };
  const ICE = '#9DCBE0';
  const flake = (x, y, r, a = 1, rot = 0) => { if (a <= 0 || r <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); K.snowflake(x, y, r, ICE, 14, rot); K.snowflake(x, y, r, C.sky, 7, rot); ctx.restore(); };
  const pointer = (x0, y0, x1, y1, a = 1) => alpha(a, () => { line([[x0, y0], [x1, y1]], C.ink, 10); ctx.beginPath(); ctx.arc(x1, y1, 12, 0, TAU); ctx.fillStyle = C.ink; ctx.fill(); });
  // "IN MICE" header (job two shots): a tiny lab mouse + ink pill
  const miceHeader = (sc, t) => { K.labMouse(300, 262, 0.3, { t, sc }); K.pill('IN MICE', 545, 250, 50, C.ink, C.white, sc); };

  // the end-card layout (shared by the tease shots)
  const HERO = { x: 230, y: 1000, s: 1.0 };
  const hero = (o) => K.man({ ...HERO, ...o });
  const FOOT = [720, 1060, 0.75], NEXTP = [700, 760], ZZ = [915, 925];

  // ── 1 · HOOK: hero raises his forearm and looks at it; a skin lens shows the hairs lifting; goosebumps pop on "goosebumps" ──
  {
    const gb = Wd('goosebumps', 0), hp = Wd('happens', 0);
    const LX = 840, LY = 900, LR = 160;
    add({ id: 'S01', at: 0, cam: [620, 860], zoom: 0.08, note: 'room: hero lifts his forearm and looks at it (shivering slightly); a round skin lens pops by 0.3 s with a pointer to his forearm, hairs start lifting; on "goosebumps" bumps pop up + hairs stand, hero goes wide-eyed "o", shock lines',
      draw(lt, d, t) {
        K.home();
        const up = eio(seg(lt, 0, 0.35)), wow = lt > gb;
        const sh = Math.sin(lt * 55) * (wow ? 6 : 3);
        K.man({ x: 400 + sh, y: 1180, s: 1.5, arm: K.armPose(K.ARM.down, K.ARM.look, up), look: 1,
          eyes: wow ? 'wide' : 'n', mouth: wow ? 'o' : lt > hp ? 'flat' : 'smile', brow: wow ? 1 : 0.5 });
        const lp = pop(lt, 0.05, 0.3);
        pointer(LX - 0.715 * (LR + 20), LY + 0.699 * (LR + 20), 600 + sh, 1132, clamp(lp));
        const bumps = lt < gb ? 0.3 * eio(seg(lt, 0.3, gb)) : lerp(0.3, 1, eob(seg(lt, gb, gb + 0.4)));
        K.skinPatch(LX, LY, LR, { bumps, t: wow ? t : 0, sc: lp });
        K.shockLines(400, 640, 230, wow ? clamp((lt - gb) * 5) * out(lt, gb + 0.5, 0.25) : 0);
      } });
    cue(0.02, 'whoosh', { gain: 0.5 }); cue(0.08, 'pop', { gain: 0.5 }); cue(gb, 'sparkle', { dur: 0.5, gain: 0.6 }); cue(gb + 0.05, 'boing', { gain: 0.5 });
  }

  // ── 2 · They might have two jobs, and job two is wild: JOB 1 / JOB 2 pills; JOB 2 grows yellow; burst on "wild" ──
  {
    const st = cut(1), tw = nth('two', 1, 0) - st, jb = Wd('jobs', 1) - st, j2 = nth('two', 1, 1) - st, wl = Wd('wild', 1) - st;
    add({ id: 'S02', at: st, cam: [560, 820], zoom: 0.06, note: 'room: hero raises one finger on "two"; JOB 1 pill pops on "two", JOB 2 on "jobs"; on "job two" JOB 1 dims and JOB 2 grows + turns yellow; on "wild" yellow burst behind it, hero wide-eyed "o" with shock lines',
      draw(lt, d, t) {
        K.home();
        const big = lt > j2 ? eob(seg(lt, j2, j2 + 0.3)) : 0, wild = lt > wl;
        const arm = K.armPose(K.ARM.down, K.ARM.point, eio(seg(lt, tw - 0.3, tw)));
        hero({ x: 300, y: 1000, s: 1.1, arm, finger: lt > tw - 0.15 ? 0 : null, look: 1, eyes: wild ? 'wide' : 'n', mouth: wild ? 'o' : 'smile', brow: wild ? 1 : 0.5 });
        K.shockLines(300, 615, 190, wild ? clamp((lt - wl) * 5) * out(lt, wl + 0.45, 0.25) : 0);
        alpha(1 - 0.55 * big, () => K.pill('JOB 1', 790, 820, 64, C.ink, C.white, pop(lt, tw)));
        if (wild) K.burst(790, 1010, 2.0, 1 - seg(lt, wl + 0.3, wl + 0.7));
        const sk = wild ? Math.sin(lt * 50) * 6 * Math.max(0, 1 - (lt - wl) * 2.5) : 0;
        K.pill('JOB 2', 790 + sk, 1010, 64, big > 0.5 ? C.yellow : C.ink, big > 0.5 ? C.ink : C.white, pop(lt, jb) * (1 + 0.22 * big));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'pop', { gain: 0.6 }); cue(st + jb, 'pop', { gain: 0.6 }); cue(st + j2, 'boing', { gain: 0.5 }); cue(st + wl, 'slam', { gain: 0.6 });
  }

  // ── 3 · A chill or scare flips your fight-or-flight switch: frost badge on "chill", BOO sign on "scare", lever flips ON on "flips" ──
  {
    const st = cut(2), ch = Wd('chill', 2) - st, sc = Wd('scare', 2) - st, fl = Wd('flips', 2) - st, ff = Wd('fight', 2) - st;
    const TX = 540, TY = 800, TS = 0.85;
    add({ id: 'S04x', at: st, cam: [540, 700], zoom: 0.08, note: 'plain: cartoon toggle switch (OFF) centre; frost badge pops top-left on "chill", spooky-cute BOO! sign (peeking ghost) top-right on "scare"; arrows from both to the switch and the lever flips to ON (red) with a burst on "flips"; FIGHT-OR-FLIGHT pill under it on "fight-or-flight"',
      draw(lt, d, t) {
        plain();
        const on = lt > fl ? eio(seg(lt, fl, fl + 0.22)) : 0;
        const shake = lt > fl + 0.22 ? Math.sin(lt * 60) * 5 * Math.max(0, 1 - (lt - fl - 0.22) * 3) : 0;
        K.toggleSwitch(TX + shake, TY, TS, { on, sc: lerp(0.7, 1, eob(seg(lt, 0, 0.3))) });
        K.frostBadge(230, 330, 1.0, pop(lt, ch), t);
        K.booSign(850, 330, 0.7, pop(lt, sc), t);
        const ar = lt > fl - 0.15 ? eo(seg(lt, fl - 0.15, fl + 0.1)) : 0;
        K.flowArrow(345, 520, 120, 0.8, ar, C.yellow, 20, C.ink);
        K.flowArrow(735, 535, 110, Math.PI - 0.8, ar, C.yellow, 20, C.ink);
        if (lt > fl + 0.15) K.burst(TX, TY - 95, 1.7, 1 - seg(lt, fl + 0.4, fl + 0.8));
        K.pill('FIGHT-OR-FLIGHT', 540, 1105, 52, C.red, C.white, pop(lt, ff));
      } });
    cue(st, 'whoosh'); cue(st + ch, 'sparkle', { dur: 0.4, gain: 0.5 }); cue(st + sc, 'pop', { gain: 0.6 }); cue(st + fl + 0.15, 'slam', { gain: 0.6 });
    cue(st + ff, 'alarm', { dur: 0.9, gain: 0.35 });
  }

  // ── 4 · and a tiny muscle at the base of each hair squeezes: skin cutaway lens, muscle ringed on "muscle", squeezes on "squeezes" ──
  {
    const st = cut(3), mu = Wd('muscle', 3) - st, sq = Wd('squeezes', 3) - st;
    const FX = 540, FY = 740, FR = 395;
    add({ id: 'S05x', at: st, cam: [540, 700], zoom: 0.08, note: 'skin cutaway lens: one hair lying in its follicle, a tiny pink muscle from the follicle to under the skin top; yellow ring + MUSCLE tag on "muscle"; on "squeezes" the muscle bulges and shortens, the hair swings upright and a bump rises round it',
      draw(lt, d, t) {
        plain();
        const pull = eio(seg(lt, sq - 0.05, sq + 0.4));
        const P = K.follicleLens(FX, FY, FR, { pull, t, sc: eob(seg(lt, 0, 0.3)), hi: lt > mu ? eo(seg(lt, mu, mu + 0.3)) * out(lt, sq + 0.1, 0.25) : 0 });
        K.tag('MUSCLE', 790, 960, P.muscle[0] + 20, P.muscle[1] + 30, 50, pop(lt, mu + 0.1));
      } });
    cue(st, 'whoosh'); cue(st + mu, 'pop', { gain: 0.6 }); cue(st + sq, 'slide', { dur: 0.35, gain: 0.5 }); cue(st + sq + 0.35, 'boing', { gain: 0.5 });
  }

  // ── 5 · Your hairs stand on end, and bumps pop up: side skin lens, hairs rise on "stand"…"end", bumps pop on "bumps"/"pop" ──
  {
    const st = cut(4), sd = Wd('stand', 4) - st, en = Wd('end', 4) - st, bu = Wd('bumps', 4) - st, pp = Wd('pop', 4) - st;
    const LX = 540, LY = 740, LR = 395;
    add({ id: 'S06x', at: st, cam: [540, 720], zoom: 0.08, note: 'side-view skin lens with a row of hairs lying flat; on "stand" they swing upright (done by "end") with a shiver; on "bumps" the skin pops up into round goosebumps round each hair, little yellow bursts on "pop"',
      draw(lt, d, t) {
        plain();
        const stand = lt > sd ? eob(seg(lt, sd, en + 0.2)) : 0, bumps = lt > bu ? eob(seg(lt, bu, pp + 0.15)) : 0;
        const o = K.skinSideLens(LX, LY, LR, { stand, bumps, t, sc: eob(seg(lt, 0, 0.3)) });
        if (lt > pp) for (const hx of [-200, 0, 200]) K.burst(LX + hx * LR / 400, o.surfY - 75, 0.55, 1 - seg(lt, pp + 0.25, pp + 0.6));
      } });
    cue(st, 'whoosh'); cue(st + sd, 'slide', { dur: en - sd + 0.2, gain: 0.4 }); cue(st + bu, 'pop', { gain: 0.6 }); cue(st + pp, 'pop', { gain: 0.7 });
  }

  // ── 6 · That's how a hissing cat puffs up to look bigger: cute cat on a rug; hiss face on "hissing", puffs on "puffs", grows on "bigger" ──
  {
    const st = cut(5), hs = Wd('hissing', 5) - st, pf = Wd('puffs', 5) - st, bg = Wd('bigger', 5) - st;
    add({ id: 'S07x', at: st, cam: [540, 800], zoom: 0.06, note: 'plain + rug: cute orange cat sitting calm; on "hissing" a little hiss mouth + slight fluff; on "puffs" the fur puffs up (spiky outline, bushy tail, big eyes); on "bigger" it swells a bit more and yellow arrows push out on both sides',
      draw(lt, d, t) {
        plain();
        ctx.fillStyle = C.floor; ctx.beginPath(); ctx.ellipse(540, 1070, 360, 56, 0, 0, TAU); ctx.fill();
        const puff = (lt > hs ? 0.35 * eo(seg(lt, hs, hs + 0.2)) : 0) + (lt > pf ? 0.65 * eob(seg(lt, pf, pf + 0.35)) : 0);
        const grow = lt > bg ? eob(seg(lt, bg, bg + 0.3)) : 0, s = 1.3 * (1 + 0.1 * grow);
        K.cat(540, 1050 - 160 * s, s * (1 + 0.02 * Math.sin(lt * 9) * clamp(puff)), { puff, t, sc: eob(seg(lt, 0, 0.3)) });
        K.flowArrow(140, 860, 130, Math.PI, grow, C.yellow, 22, C.ink);
        K.flowArrow(960, 860, 130, 0, grow, C.yellow, 22, C.ink);
      } });
    cue(st, 'whoosh'); cue(st + hs, 'sizzle', { dur: 0.35, gain: 0.25 }); cue(st + pf, 'boing', { gain: 0.6 }); cue(st + bg, 'pop', { gain: 0.6 });
  }

  // ── 7 · On you, it mostly just helps trap a little heat: hero (forearm up) + side skin lens; warm shimmer trapped on "trap", glow on "heat" ──
  {
    const st = cut(6), yu = Wd('you', 6) - st, mo = Wd('mostly', 6) - st, tr = Wd('trap', 6) - st, ht = Wd('heat', 6) - st;
    const LX = 790, LY = 940, LR = 190;
    add({ id: 'S08x', at: st, cam: [560, 860], zoom: 0.06, note: 'room: hero holds his forearm up (goosebumps) and smiles; side skin lens on the right with a pointer to his arm, hairs standing; on "mostly" a half-shrug smirk; on "trap" small warm shimmer strokes appear between the hairs and stay there; on "heat" the warm layer tints yellow and the hero closes his eyes, cosy',
      draw(lt, d, t) {
        K.home();
        const cosy = lt > ht;
        hero({ x: 290, y: 1000, s: 1.1, arm: K.ARM.look, look: cosy ? 0 : 1, eyes: cosy ? 'closed' : 'n',
          mouth: cosy ? 'smile' : lt > mo ? 'smirk' : 'smile', smirk: lt > mo && !cosy, brow: lt > yu ? 0.6 : 0.3 });
        const lp = eob(seg(lt, 0, 0.3));
        pointer(LX - LR - 18, 975, 440, 985, clamp(lp));
        K.skinSideLens(LX, LY, LR, { stand: 1, bumps: 1, heat: lt > tr ? eo(seg(lt, tr, tr + 0.35)) : 0, trap: lt > ht ? eo(seg(lt, ht, ht + 0.3)) : 0, t, sc: lp });
      } });
    cue(st, 'whoosh'); cue(st + mo, 'boing', { gain: 0.3 }); cue(st + tr, 'sparkle', { dur: 0.5, gain: 0.4 }); cue(st + ht, 'pop', { gain: 0.5 });
  }

  // ── 8 · Job two? In mice left in the cold: JOB 2 pill + ?; a cute lab mouse pops up in a clear box on "mice"; IN MICE; snow on "cold" ──
  {
    const st = cut(7), jb = Wd('job', 7) - st, mi = Wd('mice', 7) - st, cd = Wd('cold', 7) - st;
    add({ id: 'S09x', at: st, cam: [540, 700], zoom: 0.07, note: 'plain: an empty clear lab box with bedding; yellow JOB 2 pill slams in at the top on "Job" with a ?; on "mice" the ? goes, a cute white mouse pops up from the bedding and IN MICE pill pops under the box; on "cold" frost grows on the box and snow falls inside, the mouse shivers a little but stays smiling',
      draw(lt, d, t) {
        plain();
        const cold = lt > cd ? eo(seg(lt, cd, cd + 0.4)) : 0;
        K.coldBox(540, 720, 0.95, { t, frost: cold, snow: cold, inner: () => K.labMouse(525, 825, 0.95, { t, shiver: cold * 0.6, sc: pop(lt, mi, 0.35) }) });
        K.pill('JOB 2', 540, 255, 70, C.yellow, C.ink, pop(lt, jb - 0.05));
        bigText('?', 790, 250, 120, C.yellow, 0.12, pop(lt, jb + 0.3, 0.25) * out(lt, mi - 0.1, 0.15));
        K.pill('IN MICE', 540, 1090, 60, C.ink, C.white, pop(lt, mi + 0.05));
      } });
    cue(st, 'whoosh'); cue(st + jb, 'thud', { gain: 0.6 }); cue(st + mi, 'boing', { gain: 0.5 }); cue(st + mi + 0.05, 'pop', { gain: 0.6 }); cue(st + cd, 'sparkle', { dur: 0.6, gain: 0.5 });
  }

  // ── 9 · those goosebump nerves woke up hair stem cells: cutaway (raised hair); nerve draws on "goosebump", signal on "nerves", cells wake on "woke" ──
  {
    const st = cut(8), gb = Wd('goosebump', 8) - st, nv = Wd('nerves', 8) - st, wk = Wd('woke', 8) - st, sm = Wd('stem', 8) - st;
    const FX = 540, FY = 765, FR = 375;
    add({ id: 'S10x', at: st, cam: [540, 760], zoom: 0.08, note: 'IN MICE header + skin cutaway lens, hair standing, three sleepy stem cells (closed eyes, z z) at the follicle bulge; the nerve draws in from the lower right on "goosebump"; yellow signal runs along it on "nerves"; on "woke" the cells open their eyes and smile with sparkles; STEM CELLS tag on "stem"',
      draw(lt, d, t) {
        plain();
        miceHeader(1, t);
        const awake = lt > wk ? eo(seg(lt, wk, wk + 0.35)) : 0;
        const blip = lt > nv ? ((lt - nv) * 1.4) % 1 : -1;
        const P = K.follicleLens(FX, FY, FR, { pull: 1, t, sc: eob(seg(lt, 0, 0.3)), cells: 1, awake, nerve: lt > gb ? eo(seg(lt, gb, gb + 0.45)) : 0, blip });
        const [cx, cy] = P.cells[2];
        K.zzzStill(cx - 95, cy - 45, t, out(lt, wk - 0.05, 0.2), 40);
        if (lt > wk) P.cells.forEach(([x, y], i) => K.sparkle4(x + [44, 40, -44][i], y - 34, 16, pop(lt, wk + i * 0.08, 0.25) * out(lt, wk + 0.9, 0.3), t + i));
        K.tag('STEM CELLS', 300, 1020, P.cells[2][0] - 20, P.cells[2][1] + 20, 46, pop(lt, sm));
      } });
    cue(st, 'whoosh'); cue(st + gb, 'slide', { dur: 0.45, gain: 0.4 }); cue(st + nv, 'sparkle', { dur: 0.4, gain: 0.4 }); cue(st + wk, 'sparkle', { dur: 0.6, gain: 0.6 }); cue(st + sm, 'pop', { gain: 0.6 });
  }

  // ── 10 · and new hair grew in under two weeks: smaller cutaway left, a new hair grows up from "new"; 2 WEEKS calendar drops on "two" ──
  {
    const st = cut(9), nw = Wd('new', 9) - st, gr = Wd('grew', 9) - st, tw = Wd('two', 9) - st;
    const FX = 370, FY = 760, FR = 290;
    add({ id: 'S11x', at: st, cam: [540, 740], zoom: 0.07, note: 'IN MICE header; cutaway lens on the left (awake cells, nerve signal): a second, new hair grows up out of the bulb and out of the skin from "new" through "grew", sparkle at its tip; 2 WEEKS calendar drops in on the right on "two"',
      draw(lt, d, t) {
        plain();
        miceHeader(1, t);
        const nh = lt > nw ? eio(seg(lt, nw, gr + 0.5)) : 0;
        const P = K.follicleLens(FX, FY, FR, { pull: 1, t, sc: eob(seg(lt, 0, 0.3)), cells: 1, awake: 1, nerve: 1, blip: (lt * 1.4) % 1, newHair: nh });
        if (nh > 0.05) K.sparkle4(P.newTip[0], P.newTip[1], 20, out(lt, gr + 0.7, 0.3) * (0.8 + 0.2 * Math.sin(t * 10)), t);
        if (lt > tw - 0.25) { const p = eob(seg(lt, tw - 0.25, tw + 0.1)); K.calendar(850, lerp(-300, 720, p), 0.42, '2', 'WEEKS', lerp(-0.3, 0.06, p)); }
      } });
    cue(st, 'whoosh'); cue(st + nw, 'slide', { dur: gr - nw + 0.5, gain: 0.4 }); cue(st + gr, 'sparkle', { dur: 0.5, gain: 0.5 }); cue(st + tw + 0.1, 'thud', { gain: 0.7 });
  }

  // ── 11a · Next Body File: hero waves; BODY FILES badge (series name only) on "Next" ──
  {
    const st = cut(10), nx = Wd('next', 10) - st;
    add({ id: 'S12x', at: st, cam: [540, 640], zoom: 0.05, note: 'room: BODY FILES badge (series name only) pops on "Next"; hero waves with a warm smile',
      draw(lt) {
        K.home();
        K.filesBadge('BODY FILES', 540, 150, 60, pop(lt, nx));
        hero({ arm: K.armPose(K.ARM.down, K.ARM.wave, eio(seg(lt, 0.05, 0.4))), mouth: 'smile', brow: 0.5 });
      } });
    cue(st, 'whoosh'); cue(st + nx, 'thud', { gain: 0.6 });
  }
  // ── 11b · what happens when your foot falls asleep: ? on "happens"; sleepy foot + NEXT on "foot"; Zzz on "asleep" ──
  {
    const st = at('what', 10), hp = Wd('happens', 10) - st, ft = Wd('foot', 10) - st, as = Wd('asleep', 10) - st;
    add({ id: 'S13x', at: st, cam: [560, 800], zoom: 0.05, note: 'room: hero lowers his wave and looks right, curious; yellow ? on "happens"; on "foot" the ? shrinks away and a cartoon bare foot (trouser cuff, sleepy closed-eye face) pops in + yellow NEXT pill above it; Z z z floats by its toes on "asleep"',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 150, 60, 1);
        hero({ arm: K.armPose(K.ARM.down, K.ARM.wave, 1 - eio(seg(lt, 0, 0.35))), look: 1, brow: lt > ft ? 0.8 : 0.6, mouth: lt > as ? 'smirk' : 'smile', smirk: lt > as });
        bigText('?', FOOT[0], FOOT[1] - 90, 170, C.yellow, 0.12, pop(lt, hp, 0.25) * out(lt, ft - 0.05, 0.15));
        K.sleepyFoot(FOOT[0], FOOT[1], FOOT[2], { t, sc: pop(lt, ft) });
        K.pill('NEXT', NEXTP[0], NEXTP[1], 60, C.yellow, C.ink, pop(lt, ft + 0.05));
        K.zzzStill(ZZ[0], ZZ[1], t, lt > as ? eo(seg(lt, as, as + 0.3)) : 0, 64);
      } });
    cue(st, 'whoosh'); cue(st + hp, 'pop', { gain: 0.5 }); cue(st + ft, 'pop', { gain: 0.6 }); cue(st + ft + 0.05, 'thud', { gain: 0.5 }); cue(st + as, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 12 · END CARD: and the pins and needles once it wakes: pin icons on "pins", needles on "needles", foot wakes on "wakes"; FOLLOW; hero grins ──
  {
    const st = cut(11), pn = Wd('pins', 11) - st, nd = Wd('needles', 11) - st, wk = Wd('wakes', 11) - st;
    add({ id: 'S14x', at: st, cam: [560, 780], zoom: 0.04, note: 'end card (room): BODY FILES badge; sleepy foot + NEXT + Z z z stay; on "pins" two pin icons pop beside the foot (left + right lanes, never touching it) with sparkles, on "needles" two needle icons; they tingle-jiggle; Zzz fades and the foot opens its eyes on "wakes"; hero watches, then grins at camera; + FOLLOW pill top-left',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 150, 60, 1);
        const wake = lt > wk;
        hero({ look: wake ? 0 : 1, brow: 0.6, mouth: wake ? 'grin' : lt > pn ? 'o' : 'smile', eyes: lt > pn && !wake ? 'wide' : 'n' });
        K.sleepyFoot(FOOT[0], FOOT[1], FOOT[2], { t, wake: wake ? 1 : 0 });
        K.pill('NEXT', NEXTP[0], NEXTP[1], 60, C.yellow, C.ink, 1);
        K.zzzStill(ZZ[0], ZZ[1], t, out(lt, pn - 0.05, 0.2), 64);
        const P = pop(lt, pn, 0.25), N = pop(lt, nd, 0.25);
        K.tingles([[525, 870, 'pin', -0.35, P], [945, 870, 'pin', 0.35, P], [535, 1040, 'needle', 0.3, N], [955, 1035, 'needle', -0.3, N],
          [500, 960, 'spark', 0, Math.max(P, N) * 0.6], [985, 955, 'spark', 0, Math.max(P, N) * 0.6]], t, 0.7);
        K.followPill(300, 330, pop(lt, wk + 0.2), t, 54);
      } });
    cue(st, 'whoosh'); cue(st + pn, 'sparkle', { dur: 0.4, gain: 0.5 }); cue(st + nd, 'sparkle', { dur: 0.4, gain: 0.5 }); cue(st + wk, 'boing', { gain: 0.5 }); cue(st + wk + 0.2, 'pop', { gain: 0.6 });
  }

  // tidy ids (S01..): sorted by time
  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES };
}
