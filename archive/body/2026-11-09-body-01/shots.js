// WHAT HAPPENS IF YOU HOLD YOUR PEE TOO LONG?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Clean, non-gory: the bladder is a cartoon balloon, bacteria are cartoon germs. The lightning tease stays far away in a
// storm cloud: the hero only watches it, he is never struck.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, bigText, line } from './core/lib.js';
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
  const BELLY_L = { e: [205, 30], h: [70, 95] };               // both hands pressed on the lower belly (the "gotta go" pose)
  const home = () => { K.room(); ctx.fillStyle = C.bg; ctx.fillRect(80, 1040, 200, 320); ctx.fillRect(90, 310, 240, 190); };   // the one room for every real-world shot (plant + picture painted out: they sat behind the hero)

  // ── 1 · HOOK: hero squirms, thinks of a toilet on "pee", eyes wide on "long" ────────
  {
    const st = cut(0), pe = Wd('pee', 0) - st, lo = Wd('long', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 800], note: 'room, hero squirms with both hands on belly from frame 0 (frown), toilet thought bubble pops at 0.3 s, toilet bounces on "pee", wide eyes + shock lines on "long"',
      draw(lt, d, t) {
        home();
        const bounce = Math.abs(Math.sin(lt * 9)) * 18, sway = Math.sin(lt * 9) * 10;
        const wide = lt > lo;
        K.man({ x: 300 + sway, y: 1000 - bounce, s: 1.2, arm: K.ARM.belly, armL: BELLY_L,
          eyes: wide ? 'wide' : 'n', mouth: wide ? 'o' : 'flat', frown: !wide, brow: wide ? 1 : 0.4, look: 1 });
        const b = pop(lt, 0.3), hop = lt > pe ? Math.abs(Math.sin((lt - pe) * 10)) * 40 * (1 - seg(lt, pe, pe + 0.35)) : 0;
        K.bubble(790, 880, 360, 320, 470, 700, b);
        if (b > 0) { ctx.save(); ctx.translate(790, 900 - hop); ctx.scale(b, b); K.toilet(0, 0, 0.5); ctx.restore(); }
        K.shockLines(300 + sway, 1000 - bounce - 350 * 1.2, 170, wide ? clamp((lt - lo) * 5) : 0);
      } });
    cue(st + 0.1, 'whoosh', { gain: 0.5 }); cue(st + 0.3, 'pop', { gain: 0.6 }); cue(st + pe, 'boing', { gain: 0.4 }); cue(st + lo, 'boing', { gain: 0.5 });
  }

  // ── 2 · the bladder is a stretchy balloon that holds about two cups ─────────────────
  {
    const st = cut(1), sr = Wd('stretchy', 1) - st, bl = Wd('bladder', 1) - st, tw = Wd('two', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.08, note: 'bladder balloon stretches from "stretchy", BLADDER tag on "bladder", two measuring cups drop in on "two"',
      draw(lt, d, t) {
        plain();
        const fill = lerp(0.15, 0.85, eio(seg(lt, sr, tw)));
        const mv = eio(seg(lt, tw - 0.35, tw + 0.05));
        K.bladder(lerp(540, 380, mv), 720, lerp(1.15, 0.95, mv), fill, { t, wob: lt > sr && lt < bl + 0.6 ? 1 : 0.2 });
        K.tag('BLADDER', 300, 300, lerp(540, 380, mv) - 80, 560, 56, pop(lt, bl));
        for (const [i, cx] of [[0, 680], [1, 880]]) {
          const a = tw + i * 0.15;
          if (lt > a - 0.25) { const q = eob(seg(lt, a - 0.25, a + 0.1)); K.measuringCup(cx, lerp(-300, 960, q), 0.55, 0.85, t); }
        }
      } });
    cue(st, 'whoosh'); cue(st + sr, 'slide', { dur: 0.6, gain: 0.45 }); cue(st + bl, 'pop', { gain: 0.5 });
    cue(st + tw + 0.1, 'thud', { gain: 0.6 }); cue(st + tw + 0.25, 'thud', { gain: 0.5 }); 
  }

  // ── 3 · can it pop? ... PAUSE ─────────────────────────────────────────────────────
  {
    const st = cut(2), po = Wd('pop', 2) - st, ho = Wd('hold', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.12, note: 'bladder swells and jiggles, "POP?" on "pop", everything freezes + pause badge on "hold"',
      draw(lt, d, t) {
        plain();
        const tt = Math.min(lt, ho), frozen = lt > ho;
        const fill = lerp(0.7, 1, eio(seg(tt, 0, po)));
        K.bladder(540, 830, 1.15, fill, { t: st + tt, wob: frozen ? 0 : seg(tt, 0.2, po) });
        bigText('POP?', 540, 300, 150, C.yellow, -0.08, pop(lt, po));
        if (frozen) { ctx.save(); ctx.globalAlpha = 0.35 * eo(seg(lt, ho, ho + 0.2)); ctx.fillStyle = C.bg; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); }
        K.pauseIcon(540, 830, 1.1, pop(lt, ho));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.8, gain: 0.4 }); cue(st + po, 'boing', { gain: 0.6 }); cue(st + ho, 'tock');
  }

  // ── 4 · at one cup, nerves in the wall ping the brain ─────────────────────────────
  const NERVE = [[360, 900], [480, 860], [560, 740], [520, 600], [600, 480], [680, 400]];   // starts on the bladder wall
  {
    const st = cut(3), on = Wd('one', 3) - st, ne = Wd('nerves', 3) - st, pi = Wd('ping', 3) - st, br = Wd('brain', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 650], zoom: 0.08, note: '1 CUP pill on "one", nerve cord grows from the bladder wall on "nerves", signal runs on "ping", brain jiggles + PING! on "brain"',
      draw(lt, d, t) {
        plain();
        K.bladder(300, 960, 0.62, 0.5, { t });
        K.pill('1 CUP', 500, 1000, 50, C.ink, C.white, pop(lt, on));
        const grow = eio(seg(lt, ne, ne + 0.45));
        K.nerve(NERVE, lt > pi - 0.1 && lt < br + 0.1 ? seg(lt, pi - 0.1, br + 0.1) : -1, grow);
        const hit = lt > br;
        K.brain(800, 330, 0.75, { t, wob: hit ? 1 - seg(lt, br + 0.4, br + 0.9) : 0 });
        K.burst(800, 330, 2.2, hit ? 1 - seg(lt, br + 0.3, br + 0.7) : 0);
        bigText('PING!', 800, 590, 96, C.yellow, -0.1, pop(lt, br));
      } });
    cue(st, 'whoosh'); cue(st + on, 'pop', { gain: 0.5 }); cue(st + ne, 'slide', { dur: 0.45, gain: 0.4 });
    cue(st + pi - 0.1, 'zip', { gain: 0.5 }); cue(st + br, 'sparkle', { dur: 0.4, gain: 0.6 });
  }

  // ── 5 · two ring muscles clamp the exit shut ──────────────────────────────────────
  {
    const st = cut(4), tw = Wd('two', 4) - st, cl = Wd('clamp', 4) - st, sh = Wd('shut', 4) - st;
    const by = 380, ty = 470, len = 640;
    add({ id: 'S05', at: st, cam: [540, 820], zoom: 0.1, note: 'bladder neck close-up, two sphincter rings pop on "two", squeeze shut from "clamp" to "shut"',
      draw(lt, d, t) {
        plain();
        const sq = eio(seg(lt, cl, sh + 0.1));
        K.sphincters(540, ty, 1, sq, { a: lt > tw ? eob(seg(lt, tw, tw + 0.3)) : 0, len });
        K.bladder(540, by, 0.85, 0.75, { t });
        const p = pop(lt, tw + 0.25);
        K.tag('RING MUSCLES', 840, 460, 640, K.sphincterY(ty, 1, 0, len), 46, p);
        if (lt > sh) { K.burst(540, K.sphincterY(ty, 1, 1, len), 1.5, 1 - seg(lt, sh + 0.2, sh + 0.6)); }
        K.pill('SHUT', 250, 1000, 56, C.ink, C.white, pop(lt, sh));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'pop', { gain: 0.5 }); cue(st + tw + 0.15, 'pop', { gain: 0.45 }); cue(st + cl, 'slide', { dur: sh - cl, gain: 0.4 }); cue(st + sh, 'thud');
  }

  // ── 6a · hold it all the time ─────────────────────────────────────────────────────
  {
    const st = cut(5), ti = Wd('time', 5) - st;
    add({ id: 'S06', at: st, cam: [480, 820], zoom: 0.1, note: 'hero squirms with hands on belly, stopwatch hand spins fast from "time"',
      draw(lt, d, t) {
        home();
        const bounce = Math.abs(Math.sin(lt * 10)) * 14;
        K.man({ x: 300, y: 1000 - bounce, s: 1.2, arm: K.ARM.belly, armL: BELLY_L, eyes: 'n', frown: true, mouth: 'flat', brow: 0.4, look: 1 });
        const sp = lt < ti ? lt * 2 : ti * 2 + (lt - ti) * 14;
        K.stopwatch(800, 880, lerp(0, 0.5, eob(seg(lt, 0.05, 0.35))), sp);
      } });
    cue(st, 'whoosh'); cue(st + ti, 'tock', { gain: 0.6 }); cue(st + ti + 0.3, 'tock', { gain: 0.5 });
  }
  // ── 6b · inside: bacteria multiply in the waiting pee ─────────────────────────────
  const GERMS = [[540, 900, 0.1], [380, 1000, -0.3], [700, 1020, 0.4], [260, 880, 0.2], [820, 870, -0.2], [460, 1110, 0.5], [640, 1140, -0.4], [180, 1060, 0.1]];
  {
    const st = at('and', 5), ba = Wd('bacteria', 5) - st, gr = Wd('grow', 5) - st, wa = Wd('waiting', 5) - st;
    add({ id: 'S06b', at: st, cam: [540, 950], zoom: 0.12, note: 'inside the bladder: one germ swims in on "bacteria", they multiply on "grow", pool sloshes on "waiting"',
      draw(lt, d, t) {
        K.insideBladder(t, 800);
        GERMS.forEach(([gx, gy, r], i) => {
          const a = i === 0 ? ba : gr + (i - 1) * 0.12;
          if (lt < a - 0.2) return;
          const sw = i === 0 ? lerp(-200, 0, eo(seg(lt, a - 0.2, a + 0.3))) : 0;
          K.bacterium(gx + sw + Math.sin(t * 2 + i) * 10, gy + Math.cos(t * 2.4 + i) * 8, 1.1, r + Math.sin(t * 3 + i) * 0.1, t + i, i === 0 ? 1 : eob(seg(lt, a, a + 0.25)));
        });
        K.pill('BACTERIA', 540, 420, 58, C.ink, C.white, pop(lt, ba + 0.2));
      } });
    cue(st, 'whoosh'); cue(st + 0.2, 'bubbles', { dur: 0.8, gain: 0.35 }); cue(st + ba, 'slide', { dur: 0.4, gain: 0.4 });
    for (let i = 1; i < GERMS.length; i++) cue(st + gr + (i - 1) * 0.12, 'pop', { gain: 0.35 });
    cue(st + wa, 'plop', { gain: 0.5 });
  }

  // ── 7 · raising the risk of a UTI ─────────────────────────────────────────────────
  {
    const st = cut(6), ra = Wd('raising', 6) - st, ri = Wd('risk', 6) - st, inf = Wd('infection', 6) - st;
    add({ id: 'S07', at: st, cam: [480, 760], zoom: 0.08, note: 'bladder with germs inside, red arrow up on "raising", warning on "risk", red UTI pill on "infection"',
      draw(lt, d, t) {
        plain();
        K.bladder(420, 780, 1.05, 0.6, { t });
        for (let i = 0; i < 5; i++) K.bacterium(330 + (i % 3) * 90 + Math.sin(t * 2 + i) * 6, 820 + Math.floor(i / 3) * 70 + Math.cos(t * 2 + i) * 5, 0.5, Math.sin(t + i) * 0.3, t + i);
        K.pinchRing(420, 800, 230, 200, (t * 2) % 1, lt > ri ? eo(seg(lt, ri, ri + 0.3)) : 0);
        K.arrow(880, lerp(960, 770, eo(seg(lt, ra, ra + 0.4))), 300, -Math.PI / 2, eo(seg(lt, ra, ra + 0.2)));
        K.warning(880, 330, pop(lt, ri));
        K.pill('UTI', 880, 1040, 64, C.red, C.white, pop(lt, inf));
      } });
    cue(st, 'whoosh'); cue(st + ra, 'zip', { gain: 0.5 }); cue(st + ri, 'alarm', { dur: 0.9, gain: 0.4 }); cue(st + inf, 'slam', { gain: 0.6 });
  }

  // ── 8a · over time the muscle overstretches ───────────────────────────────────────
  {
    const st = cut(7), ti = Wd('time', 7) - st, ov = Wd('overstretched', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.1, note: 'stopwatch spins on "time", bladder balloons huge with stretch arrows on "overstretched"',
      draw(lt, d, t) {
        plain();
        const big = eio(seg(lt, ov, ov + 0.5));
        K.bladder(540, 800, lerp(0.85, 1.15, big), lerp(0.6, 1, big), { t, wob: big > 0 && big < 1 ? 1 : 0.3 });
        const ar = eo(seg(lt, ov + 0.2, ov + 0.45));
        K.arrow(lerp(250, 200, ar), 820, 160, Math.PI, ar); K.arrow(lerp(830, 880, ar), 820, 160, 0, ar);
        K.stopwatch(860, 270, 0.3 * pop(lt, ti - 0.15), lt < ti ? 0 : (lt - ti) * 12);
      } });
    cue(st, 'whoosh'); cue(st + ti, 'tock'); cue(st + ov, 'slide', { dur: 0.5, gain: 0.5 }); cue(st + ov + 0.5, 'boing', { gain: 0.5 });
  }
  // ── 8b · weakens and struggles to empty ───────────────────────────────────────────
  {
    const st = at('weaken', 7), we = Wd('weaken', 7) - st, su = Wd('struggle', 7) - st, em = Wd('empty', 7) - st;
    add({ id: 'S08b', at: st, cam: [480, 780], zoom: 0.08, note: 'battery drains red on "weaken", bladder squeezes but only drains halfway on "struggle", LEFTOVER tag on "empty"',
      draw(lt, d, t) {
        plain();
        const dr = eio(seg(lt, su, em));
        const sq = su < lt && lt < em + 0.3 ? Math.sin((lt - su) * 14) * 0.5 + 0.5 : 0;
        K.bladder(430, 760, 1.15 - sq * 0.03, lerp(0.95, 0.5, dr), { t, wob: sq });
        K.battery(830, 360, 0.75, lerp(1, 0.2, eio(seg(lt, we, we + 0.5))));
        K.pill('MUSCLE', 830, 230, 44, C.ink, C.white, pop(lt, we));
        K.tag('LEFTOVER', 820, 1120, 520, 980, 54, pop(lt, em));
      } });
    cue(st, 'whoosh'); cue(st + we, 'slide', { dur: 0.5, gain: 0.4 }); cue(st + su, 'boing', { gain: 0.4 }); cue(st + em, 'pop', { gain: 0.5 });
  }

  // ── 9 · so, can it pop? In a healthy bladder: incredibly rare (red X on POP) ──────
  {
    const st = cut(8), po = Wd('pop', 8) - st, he = Wd('healthy', 8) - st, ra = Wd('rare', 8) - st;
    const f = (lt, t) => {
        plain();
        K.bladder(540, 820, 1.1, 0.8, { t, wob: lt < ra ? 0.6 : 0 });
        bigText('POP?', 540, 300, 150, C.yellow, -0.08, pop(lt, po));
        K.pill('HEALTHY', 540, 1130, 58, C.ink, C.white, pop(lt, he));
        if (lt > ra) K.redX(540, 300, lerp(1.0, 0.5, eo(seg(lt, ra, ra + 0.2))), 1);
    };
    const s2 = at('in', 8), o2 = s2 - st;
    add({ id: 'S09', at: st, cam: [540, 600], zoom: 0.08, note: 'big bladder, "POP?" on "pop"', draw: (lt, d, t) => f(lt, t) });
    add({ id: 'S09b', at: s2, cam: [540, 760], zoom: 0.1, note: 'HEALTHY pill on "healthy", red X slams over POP? on "rare"', draw: (lt, d, t) => f(lt + o2, t) });
    cue(st, 'whoosh'); cue(st + po, 'boing', { gain: 0.5 }); cue(st + he, 'pop', { gain: 0.5 }); cue(s2, 'whoosh', { gain: 0.6 }); cue(st + ra + 0.05, 'slam');
  }

  // ── 10 · the urge is so intense you sprint for the toilet first ───────────────────
  {
    const st = cut(9), ur = Wd('urge', 9) - st, it = Wd('intense', 9) - st, sp = Wd('sprint', 9) - st, to = Wd('toilet', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 820], zoom: 0.06, note: 'hero jitters on "urge", shakes on "intense", sprints right to the toilet on "sprint", toilet bounces on "toilet"',
      draw(lt, d, t) {
        home();
        const run = eio(seg(lt, sp, to + 0.1));
        const shake = lt > it && lt < sp ? Math.sin(lt * 70) * 9 : 0;
        const hx = lerp(260, 520, run) + shake;
        K.toilet(900, 1000 - (lt > to ? Math.abs(Math.sin((lt - to) * 12)) * 30 * (1 - seg(lt, to, to + 0.6)) : 0), 0.75);
        K.man({ x: hx, y: 1000, s: 1.2, arm: lt > ur ? K.ARM.belly : K.ARM.down, armL: lt > ur ? BELLY_L : K.ARM.down,
          eyes: lt > it ? 'wide' : 'n', mouth: lt > it ? 'o' : 'flat', brow: lt > it ? 1 : 0.3, frown: lt > ur && lt < it, look: 1 });
        if (run > 0.05 && run < 0.98) K.speedLines(hx - 80, 800, 0.8);
        K.shockLines(hx, 1000 - 350 * 1.2, 170, lt > it && lt < sp ? 1 : 0);
      } });
    cue(st, 'whoosh'); cue(st + it, 'alarm', { dur: 0.5, gain: 0.3 }); cue(st + sp, 'zip', { gain: 0.6 }); cue(st + to, 'boing', { gain: 0.5 });
  }

  // ── 11 · can't pee at all? see a doctor fast ──────────────────────────────────────
  {
    const st = cut(10), ca = Wd('can', 10) - st, al = Wd('all', 10) - st, dr = Wd('doctor', 10) - st, fa = Wd('fast', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.08, note: 'bladder with the exit ringed red on "all", clipboard slides in on "doctor", FAST pill on "fast"',
      draw(lt, d, t) {
        plain();
        K.bladder(330, 720, 0.9, 0.9, { t });
        K.pinchRing(330, 920, 80, 60, (t * 2) % 1, lt > al ? 1 : 0);
        bigText('?', 330, 300, 150, C.yellow, 0.12, pop(lt, ca + 0.1));
        if (lt > dr - 0.3) { const p = eob(seg(lt, dr - 0.3, dr + 0.1)); K.clipboard(lerp(1400, 790, p), 720, 0.8, seg(lt, dr, fa + 0.4), lerp(0.4, 0.06, p)); }
        K.pill('FAST', 790, 1120, 62, C.red, C.white, pop(lt, fa));
      } });
    cue(st, 'whoosh'); cue(st + al, 'alarm', { dur: 0.7, gain: 0.35 }); cue(st + dr - 0.3, 'slide', { dur: 0.4, gain: 0.5 }); cue(st + dr + 0.1, 'thud', { gain: 0.6 }); cue(st + fa, 'pop');
  }

  // ── 12 · NEXT: badge on "next", the storm is OUTSIDE the window; the hero (far left) only watches ─────
  // Safety: the bolt stays small, inside the window frame, far from the hero. He is never struck.
  {
    const st = cut(11), nx = Wd('next', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 700], zoom: 0.06, note: 'room, BODY FILES badge (no number) on "next", storm cloud gathers behind the window glass; hero at x 200 looks at it',
      draw(lt, d, t) {
        home(); K.stormWindow(t, 0);
        K.filesBadge('BODY FILES', 540, 130, 44, pop(lt, nx));
        K.man({ x: 200, y: 1250, s: 1.2, look: 1, eyes: 'n', brow: 0.4, mouth: 'flat' });
      } });
    cue(st, 'whoosh'); cue(st + nx, 'thud', { gain: 0.6 });
  }
  {
    const st = at('what', 11), sk = Wd('struck', 11) - st, li = Wd('lightning', 11) - st;
    add({ id: 'S12b', at: st, cam: [700, 600], zoom: 0.1, note: 'push toward the window: small bolt flashes outside, under the cloud, on "struck"; NEXT pill on "lightning"; hero at far left just reacts',
      draw(lt, d, t) {
        home();
        const on = lt > sk, fl = on ? 1 - 0.6 * Math.max(0, Math.sin((lt - sk) * 30)) * (1 - seg(lt, sk, sk + 0.5)) : 0;
        K.stormWindow(t, fl, on && lt < sk + 0.15 ? 1 : 0);
        K.filesBadge('BODY FILES', 540, 130, 44, 1);
        K.man({ x: 200, y: 1250, s: 1.2, look: 1, eyes: on ? 'wide' : 'n', brow: on ? 1 : 0.4, mouth: on ? 'o' : 'flat' });
        K.pill('NEXT', 780, 760, 60, C.yellow, C.ink, pop(lt, li));
      } });
    cue(st, 'whoosh'); cue(st + sk, 'slam', { gain: 0.6 }); cue(st + li, 'pop', { gain: 0.5 });
  }
  // ── 12c · ...and why it can paint a fern on your skin + NEXT + FOLLOW ───────────
  {
    const st = cut(12), pa = Wd('paint', 12) - st, fe = Wd('fern', 12) - st, sk = Wd('skin', 12) - st;
    add({ id: 'S12c', at: st, cam: [600, 760], zoom: 0.05, note: 'storm stays outside the window, a skin patch grows a fern pattern from "paint", FERN tag on "fern", NEXT + FOLLOW pills; hero just looks',
      draw(lt, d, t) {
        home(); K.stormWindow(t, 1);
        K.filesBadge('BODY FILES', 540, 130, 44, 1);
        K.man({ x: 200, y: 1250, s: 1.2, look: 1, eyes: 'n', brow: lt > fe ? 1 : 0.5, mouth: lt > fe ? 'o' : 'flat', smirk: lt > sk });
        const pr = pop(lt, 0.05);
        if (pr > 0) { ctx.save(); ctx.translate(720, 880); ctx.scale(pr, pr); K.fernPatch(0, 0, 170, seg(lt, pa, pa + 1.1)); ctx.restore(); }
        K.tag('FERN', 470, 620, 610, 800, 52, pop(lt, fe));
        K.pill('NEXT', 560, 1110, 52, C.yellow, C.ink, 1);
        K.followPill(860, 1110, pop(lt, sk), t);
      } });
    cue(st, 'whoosh'); cue(st + pa, 'sparkle', { dur: 1.0, gain: 0.5 }); cue(st + fe, 'pop', { gain: 0.5 }); cue(st + sk, 'pop', { gain: 0.5 });
  }

  return { shots: S, cues: CUES };
}
