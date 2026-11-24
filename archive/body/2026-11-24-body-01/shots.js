// WHAT HAPPENS WHEN YOUR EYELID WON'T STOP TWITCHING?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): extreme close-up of the hero's eye in a round skin window, the LOWER lid flickering
// with yellow motion ticks, an "8/sec" rate counter above it. No black fade in or out (loop: true), so frame 1 is the hook.
// Rewatch detail: tiny "orbicularis oculi" + "3-8 Hz" labels in the x-ray shot (AAO EyeWiki), and a "lower lid" sticky note
// on Thursday in the week planner (Cleveland Clinic). Guess (line 1): A WEEKS / B MONTHS. Re-hook (line 4): new scene, the
// week planner. Answer (line 6): check on A in the same pill spot. Tease (line 8): held-in sneeze badge + NEXT, then
// "But first..." snaps back to the frame-1 eye (+ small NEXT sneeze badge, BODY FILES badge, + FOLLOW).
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, line, bigText } from './core/lib.js';
import { L, Wd } from './core/timing.js';
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
  const blip = (lt, a, d = 0.35) => (lt > a ? Math.sin(Math.PI * seg(lt, a, a + d)) : 0);   // 0 → 1 → 0
  const enter = (lt) => lerp(0.86, 1, eob(seg(lt, 0, 0.25)));                                  // on screen from frame 1 of the shot
  const scaled = (x, y, k, fn) => { if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); fn(); ctx.restore(); };
  const beat8 = (t) => Math.max(0, 1 - ((t * 8) % 1) * 3);                                     // one kick per 1/8 s

  // ── the HOOK framing (frame 1 + loop ending) ──
  const EYE = { x: 540, y: 770, s: 1.32 }, CNT = [540, 222], HOOK_CAM = [540, 770];
  const hookScene = (t, { ring = 0, kick = 0 } = {}) => {
    plain();
    K.twitchEye(EYE.x, EYE.y, EYE.s, { twitch: 1, t, ring, yellow: true });
    K.rateCounter(CNT[0], CNT[1], 1, '8', '/sec', { bump: 0.5 * beat8(t) + kick });
  };

  // ── 1 · HOOK "What happens when your eyelid won't stop twitching?" ──
  {
    const ey = Wd('eyelid', 0), tw = Wd('twitching', 0);
    add({ id: 'S01', at: 0, cam: HOOK_CAM, zoom: 0.06, note: 'FRAME 1 = hook: extreme close-up of the eye, lower lid flickering with yellow ticks, 8/sec counter kicking 8x a second (all from frame 0, no fade); yellow ring on the lower lid on "eyelid"; counter big kick on "twitching"',
      draw(lt, d, t) {
        hookScene(t, { ring: eo(seg(lt, ey, ey + 0.25)), kick: blip(lt, tw, 0.35) });
      } });
    cue(0.02, 'tock', { gain: 0.35 }); cue(ey, 'pop', { gain: 0.5 }); cue(tw, 'boing', { gain: 0.4 });
  }

  // ── 2a · "Its muscle can fire up to eight times a second." (x-ray lid muscle) ──
  {
    const st = cut(1), mu = Wd('muscle', 1) - st, fi = Wd('fire', 1) - st, ei = Wd('eight', 1) - st, se = Wd('second', 1) - st;
    const X = 540, Y = 700, SS = 1.05;
    add({ id: 'S02', at: st, cam: [X, Y + 120], zoom: 0.12, note: 'x-ray film: the eye in x-ray with the pink orbicularis oculi ring (on screen at the cut); yellow ring + tiny "orbicularis oculi" label on "muscle" (rewatch); the lower fibres start firing on "fire" (spark beats 8/s down the pink nerve); counter ticks 0→8, lands with a kick on "eight"; "3-8 Hz" label on "second"',
      draw(lt, d, t) {
        K.xray(t);
        const o = K.lidXray(X, Y, SS, { t, fire: seg(lt, fi - 0.05, fi + 0.15), hi: eo(seg(lt, mu, mu + 0.25)) * out(lt, fi + 0.4, 0.3), sc: enter(lt) });
        const n = lt < fi ? 0 : Math.min(8, Math.floor(1 + 7 * seg(lt, fi, ei)));
        K.rateCounter(270, 1140, 0.9, String(n), '/sec', { sc: enter(lt), bump: blip(lt, ei, 0.35) + (lt > ei ? 0.4 * beat8(t) : 0) });
        K.pill('orbicularis oculi', X, 250, 34, C.cyan, C.xnavy, pop(lt, mu));
        K.pill('3-8 Hz', 880, 870, 34, C.cyan, C.xnavy, pop(lt, se));
        if (lt > se) { ctx.save(); ctx.globalAlpha = clamp(pop(lt, se)); line([[880, 900], [o.nerve[0] + 20, o.nerve[1] - 10]], C.cyan, 6); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + mu, 'pop', { gain: 0.5 }); cue(st + fi, 'sparkle', { dur: ei - fi + 0.4, gain: 0.4 }); cue(st + ei, 'thud', { gain: 0.6 }); cue(st + se, 'pop', { gain: 0.45 });
  }

  // ── guess cards (S03) + pills (S03, S08 answer: same spot) ──
  const CA = [290, 640], CB = [790, 640], CW = 420, CH = 520, PY = 1050, PS = 46;
  const pills = ({ scA = 1, scB = 1, hiA = 0, hiB = 0, check = 0, dim = 0 } = {}) => {
    K.abPill('A', 'WEEKS', CA[0], PY, PS, { sc: scA, hi: hiA, check });
    K.abPill('B', 'MONTHS', CB[0], PY, PS, { sc: scB, hi: hiB, dim });
  };

  // ── 2b · GUESS "Gone in weeks, or months?" ──
  {
    const st = at('gone', 1), wk = Wd('weeks', 1) - st, mo = Wd('months', 1) - st;
    const card = (x, y, sc, fn) => scaled(x, y, sc, () => {
      ctx.beginPath(); ctx.roundRect(x - CW / 2 - 10, y - CH / 2 - 10, CW + 20, CH + 20, 46); ctx.fillStyle = C.ink; ctx.fill();
      ctx.beginPath(); ctx.roundRect(x - CW / 2, y - CH / 2, CW, CH, 38); ctx.fillStyle = C.white; ctx.fill(); fn();
    });
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.05, note: 'guess: two white cards with "?" (on screen at the cut), small twitching eye between them on top; on "weeks" card A flips to a WEEKS calendar + pill A WEEKS; on "months" card B flips to a MONTHS calendar + pill B MONTHS',
      draw(lt, d, t) {
        plain();
        K.twitchEye(540, 300, 0.22, { twitch: 1, t, sc: enter(lt), yellow: true });
        card(CA[0], CA[1], enter(lt), () => {
          if (lt < wk) { bigText('?', CA[0], CA[1], 200, C.yellow); return; }
          scaled(CA[0], CA[1], pop(lt, wk, 0.25), () => K.calendar(CA[0], CA[1], 0.55, 'WEEKS', '', -0.04));
        });
        card(CB[0], CB[1], enter(lt), () => {
          if (lt < mo) { bigText('?', CB[0], CB[1], 200, C.yellow); return; }
          scaled(CB[0], CB[1], pop(lt, mo, 0.25), () => K.calendar(CB[0], CB[1], 0.55, 'MONTHS', '', 0.04));
        });
        pills({ scA: pop(lt, wk), scB: pop(lt, mo) });
      } });
    cue(st, 'whoosh'); cue(st + wk, 'pop', { gain: 0.6 }); cue(st + mo, 'pop', { gain: 0.6 });
  }

  // ── 3 · "Usually it's the lower lid, and the glitch is in your nerves." ──
  {
    const st = cut(2), lo = Wd('lower', 2) - st, gl = Wd('glitch', 2) - st, ne = Wd('nerves', 2) - st;
    const HX = 420, HY = 1460, HS = 1.9, EX = HX + 40 * HS, EY = HY - 344 * HS;
    const LX = 800, LY = 430, LR = 180;
    add({ id: 'S04', at: st, cam: [560, 760], zoom: 0.08, note: 'close-up of the hero (on screen at the cut), his lower lid twitching; yellow ring + LOWER LID tag on "lower"; on "glitch" a lens pops top right: a pink nerve with yellow signals firing out of rhythm + a red zigzag glitch, pointer to his eye; signals burst on "nerves"',
      draw(lt, d, t) {
        plain();
        K.man({ x: HX, y: HY, s: HS, eyes: 'n', mouth: 'flat', brow: 0.35, twitch: 1, ct: t, look: 0.4 });
        const rg = eo(seg(lt, lo, lo + 0.25));
        lidRing(EX, EY + 26, 46, 14, rg, 10);
        K.tag('LOWER LID', 840, 1000, EX + 40, EY + 36, 46, pop(lt, lo));
        const ls = pop(lt, gl, 0.3);
        if (ls > 0) { ctx.save(); ctx.globalAlpha = clamp(ls); ctx.setLineDash([16, 14]); line([[LX - LR * 0.6, LY + LR * 0.8], [EX + 40, EY - 10]], C.ink, 8); ctx.restore(); }
        K.lens(LX, LY, LR, ls, () => {
          const P = []; for (let i = 0; i <= 30; i++) { const x = lerp(-LR - 20, LR + 20, i / 30); P.push([x, Math.sin(x * 0.02) * 30]); }
          line(P, C.pinkDark, 46); line(P, C.pink, 34); line(P.map(([a, b]) => [a, b - 8]), C.pinkLight, 8);
          const burstA = blip(lt, ne, 0.5);
          for (let k = 0; k < 4; k++) {
            const u = ((t * (1.1 + k * 0.37) + k * 0.29) % 1), x = lerp(-LR, LR, u), y = Math.sin(x * 0.02) * 30;
            const r = 17 * (1 + 0.6 * burstA); circle2(x, y, r + 6, C.ink); circle2(x, y, r, C.yellow);
          }
          const Z = [[-60, -80], [-20, -30], [-50, -10], [10, 50], [-10, 60], [40, 110]];
          line(Z, C.red, 12);
        }, '#FFF1E0');
      } });
    cue(st, 'whoosh'); cue(st + lo, 'pop', { gain: 0.6 }); cue(st + gl, 'pop', { gain: 0.5 }); cue(st + gl + 0.05, 'zip', { gain: 0.35 }); cue(st + ne, 'sparkle', { dur: 0.5, gain: 0.4 });
  }
  function lidRing(x, y, rx, ry, a, w) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.lineWidth = w * 1.9; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = w; ctx.strokeStyle = C.yellow; ctx.stroke(); ctx.restore(); }
  function circle2(x, y, r, col) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); }

  // ── 4 · RELATABLE "Ever had it flicker through a whole video call?" ──
  {
    const st = cut(3), fl = Wd('flicker', 3) - st, wh = Wd('whole', 3) - st, vi = Wd('video', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.07, note: 'laptop on a video call (on screen at the cut): 3 coworkers + the hero (YOU tile) whose lower lid flickers; on "flicker" his tile gets a yellow border + ring on the lid; on "whole" the call timer races 0:03 → 0:58; on "video" the coworker top right goes wide-eyed',
      draw(lt, d, t) {
        plain();
        const mins = lt < wh ? 3 : lerp(3, 58, eio(seg(lt, wh, wh + 0.9)));
        const timer = `${Math.floor(mins)}:${String(Math.floor((mins * 60) % 60)).padStart(2, '0')}`;
        let heroEye = null;
        const tiles = K.videoCall(540, 680, 0.96, { you: 3, timer, hi: { i: 3, a: eo(seg(lt, fl, fl + 0.2)) }, sc: enter(lt),
          inner: (i, cx, cy, w, h) => {
            if (i === 0) K.callPerson(cx, cy + 10, h, { shirt: C.pot, o: { hairCol: '#B9B2A6', glasses: true, mouth: 'smile' } });
            if (i === 1) K.callPerson(cx, cy + 10, h, { shirt: C.leaf, o: { mouth: lt > vi ? 'o' : 'smile', eyes: lt > vi ? 'wide' : 'n', brow: lt > vi ? 1 : 0.2 } });
            if (i === 2) K.callPerson(cx, cy + 10, h, { shirt: '#5A6B8C', o: { hairCol: C.hairHi, mouth: 'smile' } });
            if (i === 3) { K.callPerson(cx, cy + 10, h, { shirt: C.shirt, o: { mouth: 'flat', brow: 0.4, twitch: 1, ct: t } }); heroEye = [cx, cy, h]; }
          } });
        if (heroEye) {
          const [cx, cy, h] = heroEye, s = h / 300, k = 0.62 * s, ex = cx + 40 * k, ey = cy + 10 * s - 20 * s - 6 * k;
          lidRing(ex, ey + 22 * k, 20 * k, 6 * k, eo(seg(lt, fl, fl + 0.25)), 3.5);
        }
        void tiles;
      } });
    cue(st, 'whoosh'); cue(st + fl, 'pop', { gain: 0.6 }); cue(st + wh, 'tock', { gain: 0.4 }); cue(st + wh + 0.45, 'tock', { gain: 0.35 }); cue(st + vi, 'boing', { gain: 0.4 });
  }

  // ── 5 · RE-HOOK "Here's the twist: the trigger is usually your week." (new scene: the week planner) ──
  const NOTE_ON = Wd('week', 4);
  {
    const st = cut(4), tw = Wd('twist', 4) - st, tr = Wd('trigger', 4) - st, yo = Wd('your', 4) - st, wk = NOTE_ON - st;
    add({ id: 'S06', at: st, cam: [540, 700], zoom: 0.1, note: 'RE-HOOK, new scene: a big THIS WEEK planner slams in (on screen at the cut); on "twist" it twists (wobble) + yellow burst; red TRIGGER? pill on "trigger"; on "your week" the days light up yellow left to right, a red ring circles Thursday and a yellow "lower lid" sticky note slaps onto it (rewatch)',
      draw(lt, d, t) {
        plain();
        const wob = lt > tw ? Math.sin((lt - tw) * 18) * 0.12 * Math.max(0, 1 - (lt - tw) * 2) : 0;
        const lit = [0, 1, 2, 3, 4, 5, 6].map((i) => eo(seg(lt, yo + i * 0.06, yo + i * 0.06 + 0.2)) * 0.55);
        ctx.save(); ctx.translate(540, 720); ctx.rotate(wob); ctx.translate(-540, -720);
        K.weekBoard(540, 720, 960, 700, { lit, note: seg(lt, wk, wk + 0.3), circle: seg(lt, wk - 0.1, wk + 0.3), sc: lt < 0.28 ? lerp(1.25, 1, eo(seg(lt, 0, 0.28))) : 1 });
        ctx.restore();
        K.burst(540, 720, 3.2, lt > tw ? 1 - seg(lt, tw + 0.15, tw + 0.6) : 0);
        K.pill('TRIGGER?', 540, 260, 58, C.red, C.white, pop(lt, tr));
      } });
    cue(st, 'whoosh'); cue(st + 0.2, 'thud', { gain: 0.6 }); cue(st + tw, 'boing', { gain: 0.5 }); cue(st + tr, 'pop', { gain: 0.6 }); cue(st + yo, 'slide', { dur: 0.45, gain: 0.35 }); cue(st + wk + 0.1, 'thud', { gain: 0.5 });
  }

  // ── 6 · TRIGGERS "Short sleep, extra coffee, stress, screens." ──
  {
    const st = cut(5);
    const T4 = [['sleep', Wd('sleep', 5) - st, [0, 1], 300, 790], ['coffee', Wd('coffee', 5) - st, [2], 780, 790], ['stress', Wd('stress', 5) - st, [3], 300, 1080], ['screen', Wd('screens', 5) - st, [4, 5, 6], 780, 1080]];
    add({ id: 'S07', at: st, cam: [540, 740], zoom: 0.06, note: 'the planner moves up into a strip (still circled Thursday + "lower lid" note); four trigger badges pop below on their words: moon on "sleep", mug on "coffee", frowning face on "stress", glowing phone on "screens"; their days light up yellow',
      draw(lt, d, t) {
        plain();
        const mv = eio(seg(lt, 0, 0.3)), lit = [0, 0, 0, 0, 0, 0, 0];
        for (const [, w0, days] of T4) for (const di of days) lit[di] = Math.max(lit[di], eo(seg(lt, w0, w0 + 0.2)));
        K.weekBoard(540, lerp(560, 400, mv), 960, lerp(560, 320, mv), { lit, note: 1, circle: 1 });
        for (const [kind, w0, , x, y] of T4) K.triggerIcon(kind, x, y, 0.88, { sc: pop(lt, w0, 0.28), t });
      } });
    cue(st, 'whoosh'); for (const [, w0] of T4) cue(st + w0, 'pop', { gain: 0.6 });
  }

  // ── 7 · ANSWER "Weeks. Most fade on their own." ──
  {
    const st = cut(6), wk = Wd('weeks', 6) - st, fa = Wd('fade', 6) - st;
    add({ id: 'S08', at: st, cam: [540, 740], zoom: 0.05, note: 'ANSWER: the A/B pills in the guess spot (on screen at the cut) + the twitching eye big above them; on "Weeks" a green check pops on A, A flashes, B dims; COMMENT A OR B pill for ~1 s (not voiced); on "fade" the lid flicker calms to still + sparkles',
      draw(lt, d, t) {
        plain();
        const calm = eio(seg(lt, fa, fa + 0.6));
        K.twitchEye(540, 640, 0.82, { twitch: 1 - calm, t, sc: enter(lt), yellow: true });
        if (calm > 0) for (const [dx, dy, r] of [[-300, -200, 36], [290, -170, 28], [310, 210, 30], [-290, 230, 24]]) K.sparkle4(540 + dx, 640 + dy, r, Math.sin(Math.PI * calm), t);
        pills({ scA: enter(lt), scB: enter(lt), check: pop(lt, wk, 0.3), dim: seg(lt, wk, wk + 0.3), hiA: blip(lt, wk, 0.45) });
        K.pill('COMMENT A OR B', 540, 1170, 34, C.ink, C.yellow, pop(lt, wk + 0.3, 0.25) * out(lt, wk + 1.3, 0.2));
      } });
    cue(st, 'whoosh'); cue(st + wk, 'pop', { gain: 0.8 }); cue(st + wk + 0.3, 'pop', { gain: 0.3 }); cue(st + fa, 'sparkle', { dur: 0.7, gain: 0.4 });
  }

  // ── 8 · "Spreading? Lingering? Eye doctor." ──
  {
    const st = cut(7), sp = Wd('spreading', 7) - st, li = Wd('lingering', 7) - st, dc = Wd('doctor', 7) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.05, note: 'calm: eye doctor (lab coat, glasses) beside an eye chart (on screen at the cut); on "Spreading?" a small hero head with dashed ink arrows spreading from the eye across the face; on "Lingering?" a FEW WEEKS+ calendar; on "doctor" the doctor waves and ink arrows point from both to him',
      draw(lt, d, t) {
        plain();
        ctx.fillStyle = C.floor; ctx.fillRect(-300, 1180, W + 600, 900);
        K.eyeChart(890, 520, 0.85, enter(lt));
        K.doctor({ x: 720, y: 900, s: 0.55 * enter(lt), arm: lt > dc ? K.armPose(K.ARM.down, K.ARM.wave, eo(seg(lt, dc, dc + 0.25))) : K.ARM.down, mouth: 'smile', look: -0.6 });
        const hs = pop(lt, sp);
        if (hs > 0) {
          K.heroHead(250, 450, 0.75 * hs, { mouth: 'flat', brow: 0.4, twitch: 1, ct: t });
          const ex = 250 + 40 * 0.75, ey = 450 - 6 * 0.75, a = eo(seg(lt, sp + 0.1, sp + 0.5));
          ctx.save(); ctx.globalAlpha = a; ctx.setLineDash([12, 12]);
          for (const an of [0.5, 1.4, 2.6]) line([[ex + Math.cos(an) * 40, ey + Math.sin(an) * 40], [ex + Math.cos(an) * (40 + 90 * a), ey + Math.sin(an) * (40 + 90 * a)]], C.ink, 8);
          ctx.restore();
        }
        K.calendar(250, 900, 0.38 * pop(lt, li), 'FEW', 'WEEKS+', -0.05);
        const aa = eo(seg(lt, dc, dc + 0.3));
        K.arrow(440, 520, 140 * aa, 0.35, aa); K.arrow(440, 880, 140 * aa, -0.1, aa);
      } });
    cue(st, 'whoosh'); cue(st + sp, 'pop', { gain: 0.5 }); cue(st + li, 'pop', { gain: 0.5 }); cue(st + dc, 'boing', { gain: 0.45 });
  }

  // ── 9a · TEASE "Next Body File: the held-in sneeze that tore a man's throat." ──
  const badge = (x, y, sc, size = 50) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = Wd('next', 8) - 0.02, nx = Wd('next', 8) - st, bo = Wd('body', 8) - st, sn = Wd('sneeze', 8) - st, to = Wd('tore', 8) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.08, note: 'tease: the held-in sneeze face badge (eyes squeezed, "ah-") big in the centre (on screen at the cut); yellow NEXT pill on "Next", BODY FILES badge on "Body"; badge shudders on "sneeze"; small red warning sign on "tore" (no injury shown, nobody copies it)',
      draw(lt, d, t) {
        plain();
        const sh = lt > sn ? Math.sin(lt * 60) * 8 * Math.max(0, 1 - (lt - sn) * 2) : 0;
        K.sneezeBadge(540 + sh, 700, 1.75, 0, t, enter(lt));
        K.pill('NEXT', 540, 250, 64, C.yellow, C.ink, pop(lt, nx));
        badge(540, 1130, pop(lt, bo));
        K.warning(850, 470, 0.45 * pop(lt, to));
      } });
    cue(st, 'whoosh'); cue(st + nx, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.5 }); cue(st + sn, 'boing', { gain: 0.4 }); cue(st + to, 'pop', { gain: 0.6 });
  }
  // ── 9b · LOOP "But first..." (snap back to the frame-1 eye; end card stays put while the camera pushes to frame 1's scale) ──
  {
    const st = at('but', 8), Z = 0.13;
    add({ id: 'S11', at: st, cam: HOOK_CAM, zoom: Z, note: 'LOOP + END CARD: snap back to the frame-1 extreme close-up (same eye, ticks, 8/sec counter); camera ends at frame 1\'s punch scale so the replay cuts in seamlessly; small sneeze badge + yellow NEXT top right, BODY FILES badge bottom left, + FOLLOW bottom right (overlay held still against the camera push)',
      draw(lt, d, t) {
        hookScene(t);
        const k = (1 + 0.13 * (1 - eo(clamp(lt / 0.32)))) * (1 + Z * eio(clamp(lt / d)));   // undo main.js camera for the overlay
        ctx.save(); ctx.translate(HOOK_CAM[0], HOOK_CAM[1]); ctx.scale(1 / k, 1 / k); ctx.translate(-HOOK_CAM[0], -HOOK_CAM[1]);
        K.sneezeBadge(925, 250, 0.4, 0, t, pop(lt, 0.05, 0.3));
        K.pill('NEXT', 925, 360, 30, C.yellow, C.ink, pop(lt, 0.1, 0.3));
        badge(290, 1140, pop(lt, 0.05, 0.3), 38);
        K.followPill(820, 1140, pop(lt, 0.35), t, 40);
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + 0.35, 'pop', { gain: 0.6 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES, loop: true };
}
