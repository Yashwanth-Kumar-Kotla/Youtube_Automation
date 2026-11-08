// WHAT HAPPENS IF YOU SKIP SLEEP FOR 11 DAYS?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, bigText, rr } from './core/lib.js';
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
  const HOLD = { e: [230, 60], h: [234, -63] };              // hand at chest height, out to the right
  const FACE = (x, y, s) => [x, y - 338 * s];                 // hero face centre for a man at (x, y, s)

  // ── 1 · HOOK: tired Randy, "11 DAYS" calendar drops, NO SLEEP ─────────────
  {
    const st = cut(0), dy = Wd('days', 0) - st, sl = Wd('sleep', 0) - st, wh = Wd('what', 0) - st;
    add({ id: 'S01', at: st, cam: [560, 760], note: 'tired hero next to a bed from 0 s, 11 DAYS calendar lands by 0.4 s, red X on bed on "sleep", shock on "what"',
      draw(lt, d, t) {
        K.room();
        const shocked = lt > wh, sway = Math.sin(lt * 2.2) * 0.03;
        ctx.save(); ctx.translate(360, 1250); ctx.rotate(sway); ctx.translate(-360, -1250);
        K.man({ x: 360, y: 1250, s: 1.45, eyes: shocked ? 'wide' : 'n', mouth: shocked ? 'o' : 'flat', brow: shocked ? 1 : 0, tired: shocked ? 0.5 : 1 });
        ctx.restore();
        { const p = eob(seg(lt, 0.02, 0.38)); K.calendar(800, lerp(-300, 520, p), 0.48, '11', 'DAYS', lerp(-0.3, 0.08, p)); }
        K.bed(808, 1005, 0.4);
        if (lt > sl) K.redX(808, 980, 0.36 * lerp(1.8, 1, eo(seg(lt, sl, sl + 0.2))), 1, 0.55);
        const [fx, fy] = FACE(360, 1250, 1.45);
        K.shockLines(fx, fy, 200, shocked ? clamp((lt - wh) * 5) : 0);
      } });
    cue(st + 0.2, 'whoosh', { gain: 0.5 }); cue(st + 0.38, 'thud'); cue(st + sl, 'slam', { gain: 0.7 }); cue(st + wh, 'boing', { gain: 0.5 });
  }

  // ── 2a · January 1964 ──────────────────────────────────────────────────
  {
    const st = cut(1), yr = Wd('sixty', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.1, note: 'calendar JAN 1964 drops, year pill pops on "sixty-four"',
      draw(lt) {
        plain();
        const p = eob(seg(lt, 0, 0.4));
        K.calendar(540, lerp(-300, 700, p), 0.9, "'64", 'JANUARY', lerp(-0.25, -0.04, p));
        K.pill('1964', 540, 1170, 80, C.ink, C.white, pop(lt, yr));
      } });
    cue(st, 'whoosh'); cue(st + 0.35, 'thud', { gain: 0.6 }); cue(st + yr, 'pop');
  }
  // ── 2b · Randy, 17, actually tried it ──────────────────────────────────
  {
    const st = at('a', 1), ag = Wd('seventeen', 1) - st, rn = Wd('randy', 1) - st, tr = Wd('tried', 1) - st;
    add({ id: 'S02b', at: st, cam: [480, 760], zoom: 0.08, note: 'Randy waves: AGE 17 on "seventeen", RANDY tag on "Randy", grin on "tried"',
      draw(lt) {
        K.room();
        const w = eio(seg(lt, rn - 0.2, rn + 0.15)) * (1 - eio(seg(lt, tr + 0.4, tr + 0.8)));
        K.man({ x: 430, y: 1200, s: 1.45, arm: K.armPose(K.ARM.down, K.ARM.wave, w), mouth: lt > tr ? 'grin' : 'smile', brow: lt > tr ? 0.6 : 0.2, smirk: lt > tr });
        K.pill('AGE 17', 830, 560, 70, C.ink, C.white, pop(lt, ag));
        const [fx, fy] = FACE(430, 1200, 1.45);
        K.tag('RANDY', 830, 330, fx + 120, fy - 80, 70, pop(lt, rn));
      } });
    cue(st, 'whoosh'); cue(st + ag, 'pop'); cue(st + rn, 'pop', { gain: 0.7 }); cue(st + tr, 'boing', { gain: 0.4 });
  }

  // ── 3 · the weird part: how fast he bounced back (battery refills) ───────
  {
    const st = cut(2), we = Wd('weirdest', 2) - st, fa = Wd('fast', 2) - st, bo = Wd('bounced', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.1, note: 'battery drains to red, "?!" on "weirdest", refills on "fast", BOING bounce on "bounced"',
      draw(lt) {
        plain();
        const lv = lt < fa ? lerp(1, 0.08, eio(seg(lt, 0, we + 0.4))) : lerp(0.08, 1, eo(seg(lt, fa, bo)));
        const bounce = lt > bo ? Math.abs(Math.sin((lt - bo) * 9)) * 90 * Math.max(0, 1 - (lt - bo) * 1.6) : 0;
        K.battery(540, 760 - bounce, 1.5, lv);
        if (lt > we && lt < fa) bigText('?!', 540, 430, 150, C.yellow, -0.1, pop(lt, we, 0.2));
        if (lt > bo) K.burst(540, 760 - bounce, 4.2, 1 - seg(lt, bo + 0.3, bo + 0.8));
      } });
    cue(st, 'whoosh'); cue(st + we, 'pop'); cue(st + fa, 'sparkle', { dur: bo - fa, gain: 0.6 }); cue(st + bo, 'boing');
  }

  // ── 4 · day 2: tongue twisters come out tangled ─────────────────────────
  {
    const st = cut(3), d2 = Wd('two', 3) - st, sy = Wd('say', 3) - st, tw = Wd('twisters', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.08, note: 'DAY 2 card, speech bubble opens on "say", scribble tangles until "twisters", small red X',
      draw(lt) {
        K.room();
        K.man({ x: 330, y: 1300, s: 1.6, mouth: lt > sy ? 'o' : 'flat', tired: 0.35, brow: lt > tw ? 0.9 : 0.3, frown: lt > tw });
        K.calendar(430, 320, 0.28, '2', 'DAY', -0.08 + (1 - pop(lt, d2)) * 0.6);
        const [fx, fy] = FACE(330, 1300, 1.6);
        K.bubble(760, 520, 520, 300, fx + 140, fy + 40, pop(lt, sy - 0.1));
        if (lt > sy) K.tangle(760, 520, 1.05, seg(lt, sy, tw + 0.2));
        if (lt > tw) K.redX(950, 380, 0.22 * lerp(1.8, 1, eo(seg(lt, tw, tw + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + d2, 'tock'); cue(st + sy, 'pop', { gain: 0.6 }); cue(st + tw, 'boing', { gain: 0.5 });
  }

  // ── 5a · microsleeps kick in: eyes shut, head drops, snap awake ─────────
  {
    const st = cut(4), ms = Wd('microsleeps', 4) - st, ki = Wd('kick', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 640], zoom: 0.12, note: 'close-up: head nods off on "microsleeps", snaps awake on "kick", MICROSLEEP pill',
      draw(lt, d, t) {
        K.room();
        const asleep = lt > ms && lt < ki + 0.05, nod = asleep ? eio(seg(lt, ms, ms + 0.5)) : 0;
        const snap = lt > ki ? Math.sin((lt - ki) * 40) * 10 * Math.max(0, 1 - (lt - ki) * 3) : 0;
        ctx.save(); ctx.translate(540, 1100); ctx.rotate(nod * 0.22); ctx.translate(-540 + snap, -1100 + nod * 40);
        K.man({ x: 540, y: 1340, s: 1.9, eyes: asleep ? 'closed' : (lt > ki ? 'wide' : 'n'), mouth: asleep ? 'flat' : (lt > ki ? 'o' : 'flat'), tired: 0.7, brow: lt > ki ? 1 : 0 });
        ctx.restore();
        K.zzz(760, 400, t, asleep ? clamp((lt - ms) * 4) : 0);
        K.shockLines(540, 700, 230, lt > ki ? 1 - seg(lt, ki + 0.4, ki + 0.8) : 0);
        K.pill('MICROSLEEP', 540, 1170, 64, C.ink, C.white, pop(lt, ms));
      } });
    cue(st, 'whoosh'); cue(st + ms, 'slide', { dur: 0.5, gain: 0.4 }); cue(st + ki, 'boing', { gain: 0.6 });
  }
  // ── 5b · tiny naps lasting just seconds ─────────────────────────────────
  {
    const st = at('tiny', 4), np = Wd('naps', 4) - st, la = Wd('lasting', 4) - st, sc = Wd('seconds', 4) - st;
    add({ id: 'S05b', at: st, cam: [540, 700], zoom: 0.1, note: 'stopwatch: Zs on "naps", hand flicks a few ticks from "lasting", pill on "seconds"',
      draw(lt, d, t) {
        plain();
        K.stopwatch(540, 720, 0.95, eio(seg(lt, la, sc)) * 0.55);
        K.zzz(800, 380, t, lt > np ? clamp((lt - np) * 4) : 0, 80);
        K.pill('SECONDS', 540, 1150, 66, C.red, C.white, pop(lt, sc));
      } });
    cue(st, 'whoosh'); cue(st + la, 'tock'); cue(st + la + 0.3, 'tock'); cue(st + sc, 'pop');
  }

  // ── 6 · day 5: seeing things that weren't there ─────────────────────────
  {
    const st = cut(5), d5 = Wd('five', 5) - st, se = Wd('seeing', 5) - st, th = Wd('things', 5) - st, we = Wd('weren', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 700], zoom: 0.1, note: 'DAY 5 card on "five", eyes widen on "seeing", faint ghosts drift in on "things", flicker on "weren\'t"',
      draw(lt, d, t) {
        K.room();
        K.calendar(430, 320, 0.28, '5', 'DAY', -0.08 + (1 - pop(lt, d5)) * 0.6);
        K.man({ x: 330, y: 1300, s: 1.5, eyes: lt > se ? 'wide' : 'n', mouth: lt > se ? 'o' : 'flat', tired: 0.85, brow: lt > se ? 1 : 0, look: 1 });
        const ga = lt > th ? eo(seg(lt, th, th + 0.4)) * (lt > we ? 0.55 + 0.45 * Math.abs(Math.sin(lt * 14)) : 1) : 0;
        K.ghost(790, 830, 1.1, ga * 0.7, t); K.ghost(950, 1100, 0.75, ga * 0.55, t + 1); K.ghost(570, 640, 0.6, ga * 0.5, t + 2);
      } });
    cue(st, 'whoosh'); cue(st + d5, 'tock'); cue(st + th, 'sparkle', { dur: 1.0, gain: 0.5 });
  }

  // ── 7 · by the end: brain running on fumes ──────────────────────────────
  {
    const st = cut(6), en = Wd('end', 6) - st, br = Wd('brain', 6) - st, ba = Wd('basically', 6) - st, fu = Wd('fumes', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.12, note: 'x-ray brain, DAY 11 pill on "end", fuel needle drops from "basically" to E on "fumes", fumes rise',
      draw(lt, d, t) {
        K.xray(t);
        K.brain(540, 620, 1.25, { t, wob: lt > fu ? 1 : 0 });
        K.pill('DAY 11', 540, 300, 60, C.red, C.white, pop(lt, en));
        K.fuelGauge(540, 1080, 1, lt < ba ? 0.35 : lerp(0.35, 0.02, eio(seg(lt, ba, fu))) + (lt > fu ? Math.sin(lt * 30) * 0.01 : 0));
        K.fumes(330, 470, t, lt > fu ? eo(seg(lt, fu, fu + 0.4)) : 0);
        if (lt > br) K.tag('BRAIN', 880, 420, 720, 520, 52, pop(lt, br));
      } });
    cue(st, 'whoosh'); cue(st + en, 'pop'); cue(st + ba, 'slide', { dur: fu - ba, gain: 0.4 }); cue(st + fu, 'alarm', { dur: 0.8, gain: 0.4 });
  }

  // ── 8 · finally slept ~14 hours ─────────────────────────────────────────
  {
    const st = cut(7), sl = Wd('slept', 7) - st, ft = Wd('fourteen', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 800], zoom: 0.1, note: 'night: Randy flops into bed, Zs on "slept", calendar 14 HOURS drops on "fourteen"',
      draw(lt, d, t) {
        K.nightRoom();
        K.bed(560, 1080, 1.05, { sleeper: { eyes: 'closed', mouth: lt > sl ? 'o' : 'smile', tired: lt > sl ? 0 : 0.8 }, breathe: 0.5 + 0.5 * Math.sin(lt * 3) });
        K.zzz(450, 820, t, lt > sl ? clamp((lt - sl) * 4) : 0, 100);
        if (lt > ft - 0.25) { const p = eob(seg(lt, ft - 0.25, ft + 0.1)); K.calendar(790, lerp(-300, 480, p), 0.45, '14', 'HOURS', lerp(-0.3, 0.07, p)); }
      } });
    cue(st, 'whoosh'); cue(st + sl, 'thud', { gain: 0.5 }); cue(st + ft, 'thud'); cue(st + ft + 0.3, 'tock', { gain: 0.5 });
  }

  // ── 9 · woke up: no groggier than normal (battery full again) ───────────
  {
    const st = cut(8), wk = Wd('woke', 8) - st, gr = Wd('groggier', 8) - st, nm = Wd('normal', 8) - st;
    add({ id: 'S09', at: st, cam: [480, 760], zoom: 0.08, note: 'morning: hero stretches on "woke", NO GROGGIER / THAN NORMAL label + battery fills from "groggier", full + burst on "normal"',
      draw(lt) {
        K.room();
        const str = eio(seg(lt, wk, wk + 0.4)) * (1 - eio(seg(lt, wk + 1.0, wk + 1.4)));
        const arm = K.armPose(K.ARM.down, K.ARM.wave, str);
        K.man({ x: 360, y: 1250, s: 1.45, arm, armL: arm, eyes: lt > wk + 0.5 ? 'n' : 'closed', mouth: lt > nm ? 'grin' : (lt > wk ? 'o' : 'smile'), brow: 0.4 });
        const lv = lt < gr ? 0.25 : lerp(0.25, 1, eo(seg(lt, gr, nm)));
        K.battery(820, 560, 0.75, lv);
        if (lt > nm) K.burst(820, 560, 2.6, 1 - seg(lt, nm + 0.3, nm + 0.8));
        K.pill('NO GROGGIER', 800, 800, 44, C.ink, C.white, pop(lt, gr)); K.pill('THAN NORMAL', 800, 880, 44, C.ink, C.white, pop(lt, gr + 0.1));
      } });
    cue(st, 'whoosh'); cue(st + wk, 'slide', { dur: 0.4, gain: 0.4 }); cue(st + gr, 'sparkle', { dur: nm - gr, gain: 0.5 }); cue(st + nm, 'pop');
  }

  // ── 10a · years later: insomnia ─────────────────────────────────────────
  {
    const st = cut(9), yr = Wd('years', 9) - st, in_ = Wd('insomnia', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 800], zoom: 0.1, note: 'night bed, eyes wide open, YEARS LATER pill on "years", red INSOMNIA pill + spinning stopwatch on "insomnia"',
      draw(lt, d, t) {
        K.nightRoom();
        K.bed(560, 1080, 1.05, { sleeper: { eyes: 'wide', mouth: 'flat', tired: 1, frown: true } });
        K.pill('YEARS LATER', 540, 160, 56, C.ink, C.white, pop(lt, yr));
        K.stopwatch(820, 620, 0.32 * pop(lt, in_), (lt - in_) * 6);
        K.pill('INSOMNIA', 540, 800, 66, C.red, C.white, pop(lt, in_));
      } });
    cue(st, 'whoosh'); cue(st + yr, 'pop', { gain: 0.6 }); cue(st + in_, 'alarm', { dur: 0.9, gain: 0.4 });
  }
  // ── 10b · he blamed the stunt ───────────────────────────────────────────
  {
    const st = at('and', 9), bl = Wd('blamed', 9) - st, su = Wd('stunt', 9) - st;
    add({ id: 'S10b', at: st, cam: [600, 760], zoom: 0.08, note: 'hero points at 11 DAYS calendar on "blamed", red X slams on "stunt"',
      draw(lt) {
        K.room();
        const p = eio(seg(lt, 0.05, bl + 0.1));
        K.man({ x: 330, y: 1280, s: 1.45, arm: K.armPose(K.ARM.down, { e: [250, -150], h: [420, -260] }, p), finger: lt > bl ? Math.PI / 2 : null, frown: true, tired: 0.6, mouth: 'flat', look: 1 });
        K.calendar(800, 600, 0.55, '11', 'DAYS', 0.06);
        if (lt > su) K.redX(800, 600, 0.6 * lerp(1.8, 1, eo(seg(lt, su, su + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + bl, 'pop', { gain: 0.5 }); cue(st + su, 'slam');
  }

  // ── 11 · so 11 days awake? Hard pass. ───────────────────────────────────
  {
    const st = cut(10), aw = Wd('awake', 10) - st, hp = Wd('hard', 10) - st;
    add({ id: 'S11', at: st, cam: [640, 860], note: 'hero to camera, raised brow on "awake", finger wag + grin on "hard pass", whole bed at right',
      draw(lt) {
        K.room(); K.bed(890, 1010, 0.4);
        const p = eio(seg(lt, hp - 0.35, hp));
        K.man({ x: 290, y: 1290, s: 1.55, arm: K.armPose(K.ARM.down, K.ARM.point, p), finger: lt > hp - 0.1 ? Math.sin(lt * 11) * 0.35 : null,
          mouth: lt > hp ? 'grin' : 'smirk', brow: lt > aw ? 1 : 0.3, smirk: true });
        if (lt > hp) K.burst(290 + K.ARM.point.h[0] * 1.55, 1290 + (K.ARM.point.h[1] - 90) * 1.55, 1.4, 1 - seg(lt, hp + 0.3, hp + 0.8));
      } });
    cue(st, 'whoosh'); cue(st + aw, 'pop', { gain: 0.5 }); cue(st + hp, 'boing', { gain: 0.6 });
  }

  // ── 12a · next Body File: BODY FILES #2, a magnet drops in ──────────────
  {
    const st = cut(11), bf = Wd('next', 11) - st, ha = Wd('happens', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 700], zoom: 0.1, note: 'room, BODY FILES #2 badge lands at shot start, magnet slides in from the right below it + "?" on "happens"',
      draw(lt) {
        K.room();
        K.filesBadge('BODY FILES #2', 540, 130, 44, pop(lt, bf));
        if (lt > ha - 0.35) { const p = eo(seg(lt, ha - 0.35, ha + 0.05)); K.magnet(lerp(1400, 540, p), 760, 1.3, lerp(0.9, 0.12, p)); }
        bigText('?', 850, 520, 200, C.yellow, 0.15, pop(lt, ha + 0.2));
      } });
    cue(st, 'whoosh'); cue(st + bf, 'thud'); cue(st + ha - 0.35, 'slide', { dur: 0.4, gain: 0.5 }); cue(st + ha + 0.05, 'thud', { gain: 0.6 }); cue(st + ha + 0.2, 'pop', { gain: 0.5 });
  }
  // ── 12b · ...swallow a magnet? + FOLLOW ─────────────────────────────────
  {
    const st = at('swallow', 11), mg = Wd('magnet', 11) - st;
    add({ id: 'S12b', at: st, cam: [540, 700], zoom: 0.05, note: 'hero holds the magnet at chest height and eyes it suspiciously, "?" + MAGNET tag on "magnet", FOLLOW pill pulses',
      draw(lt, d, t) {
        K.room();
        const p = eio(seg(lt, 0, 0.5));
        K.man({ x: 360, y: 1150, s: 1.4, arm: K.armPose(K.ARM.down, HOLD, p), look: 1, eyes: 'n', tired: 0.45, smirk: true, brow: 0.2, mouth: 'flat',
          holding: (x, y) => K.magnet(x + 20, y - 30, 0.32, 0) });
        bigText('?', 640, 470, 170, C.yellow, 0.15, pop(lt, mg));
        K.filesBadge('BODY FILES #2', 540, 130, 44, 1);
        K.tag('MAGNET', 790, 800, 690, 960, 54, pop(lt, mg));
        K.followPill(800, 630, pop(lt, 0.5), t);
      } });
    cue(st, 'whoosh'); cue(st + 0.5, 'pop', { gain: 0.5 }); cue(st + mg, 'boing', { gain: 0.5 });
  }

  return { shots: S, cues: CUES };
}
