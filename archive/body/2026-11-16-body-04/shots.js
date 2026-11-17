// WHAT HAPPENS IF YOU SWALLOW CHEWING GUM?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// A journey: follow ONE pink gum wad (K.gumWad, with a tiny luggage tag + trip clock) down the x-ray gut.
// HOOK framing (frame 1 + loop ending): x-ray film, extreme close-up of the x-ray hero mid-gulp (head normal), the pink wad
// already dropping down his throat, guess pills "A 7 YEARS" / "B DAYS" at the top. Rewatch detail: the wad's tag reads "~40 h"
// in the intestine shots (before the answer), and a tiny "gum base: no enzyme" label floats on it in the stomach.
// Re-hook (line 5) = a hard zoom from the gut map into the intestine tube. Answer (line 8) = check on B in the same pill spot.
// Last shot = the frame-1 framing again with B checked, the lower eyelid flickering (next: eyelid twitch) + NEXT + BODY FILES + FOLLOW.
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
  const scaled = (x, y, k, fn) => { if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); fn(); ctx.restore(); };
  // x-ray tag: white pill + cyan pointer (readable on the navy film)
  const xtag = (text, x, y, tx, ty, size, sc) => { if (sc <= 0) return; ctx.save(); ctx.globalAlpha = clamp(sc); line([[x, y], [tx, ty]], C.cyan, 7); ctx.restore(); K.pill(text, x, y, size, C.white, C.ink, sc); };

  // ── the HOOK framing (frame 1 + loop ending) ──
  const HERO = { x: 540, y: 1560, s: 2.5 };
  const hp = (lx, ly) => [HERO.x + lx * HERO.s, HERO.y + ly * HERO.s];
  const PA = [540, 150], PB = [540, 288], PS = 62;
  const EYE = hp(40, -344);                       // the hero's screen-right eye (head-local (40, 6))
  const hookScene = (t, { u = 0, twitch = 0, ring = 0, gulp = 0 } = {}) => {
    K.xray(t);
    K.man({ ...HERO, xray: true, eyes: 'wide', mouth: 'flat', brow: 0.8, twitch, ct: t });
    const [wx, wy] = hp(-2, lerp(-200, -160, u));
    if (gulp > 0) { ctx.save(); ctx.globalAlpha = clamp(gulp); for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(wx, wy, 135, sd > 0 ? -0.5 : Math.PI - 0.5 + 1, sd > 0 ? 0.5 : Math.PI + 0.5); ctx.strokeStyle = C.cyan; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.stroke(); } ctx.restore(); }
    K.gumWad(wx, wy, 1.3, { t, rot: -0.1 + 0.05 * Math.sin(t * 2) });
    if (ring > 0) K.hiRing(EYE[0], EYE[1] + 34, 62, 30, ring);
  };
  const pills = ({ scA = 1, scB = 1, hiA = 0, hiB = 0, check = 0, dim = 0 } = {}) => {
    K.abPill('A', '7 YEARS', PA[0], PA[1], PS, { sc: scA, hi: hiA, dim });
    K.abPill('B', 'DAYS', PB[0], PB[1], PS, { sc: scB, hi: hiB, check });
  };

  // ── 1 · HOOK "What happens if you swallow chewing gum?" ──
  {
    const sw = Wd('swallow', 0), gm = Wd('gum', 0);
    add({ id: 'S01', at: 0, cam: [540, 640], zoom: 0.06, note: 'FRAME 1 = premise + guess: x-ray film, extreme close-up of the x-ray hero mid-gulp (wide eyes, lips pressed), the pink gum wad with its tiny luggage tag already in his throat, A 7 YEARS / B DAYS pills at the top (in from frame 1); on "swallow" the wad drops lower with cyan gulp arcs; on "gum" the wad bounces',
      draw(lt, d, t) {
        const u = 0.25 * eo(clamp(lt / 1.1)) + 0.75 * eob(seg(lt, sw, sw + 0.45));
        hookScene(t, { u: clamp(u, 0, 1.05), gulp: blip(lt, sw - 0.05, 0.5) });
        const k = lt < 0.25 ? lerp(0.9, 1, eob(seg(lt, 0, 0.25))) : 1 + 0.06 * blip(lt, gm, 0.3);
        pills({ scA: k, scB: k });
      } });
    cue(0.05, 'whoosh', { gain: 0.45 }); cue(0.1, 'pop', { gain: 0.4 }); cue(sw, 'gulp', { gain: 0.8 }); cue(gm, 'boing', { gain: 0.35 });
  }

  // ── 2 · GUESS "Seven years inside you, or gone in days? Guess." ──
  {
    const st = cut(1), se = Wd('seven', 1) - st, go = Wd('gone', 1) - st, da = Wd('days', 1) - st, gu = Wd('guess', 1) - st;
    const CA = [290, 700], CB = [790, 700], CW = 420, CH = 560;
    const card = (x, y, sc, fn) => scaled(x, y, sc, () => {
      ctx.beginPath(); ctx.roundRect(x - CW / 2 - 10, y - CH / 2 - 10, CW + 20, CH + 20, 46); ctx.fillStyle = C.ink; ctx.fill();
      ctx.beginPath(); ctx.roundRect(x - CW / 2, y - CH / 2, CW, CH, 38); ctx.fillStyle = C.white; ctx.fill(); fn();
    });
    add({ id: 'S02', at: st, cam: [540, 720], zoom: 0.05, note: 'guess: two white cards; on "Seven" card A shows a 7 YEARS calendar with the wad parked under it + pill A 7 YEARS; on "gone" card B shows a DAYS calendar with the wad sliding away right, pill B DAYS on "days"; on "Guess" a yellow "?" bounces between them and both pills flash',
      draw(lt, d, t) {
        plain();
        const g = blip(lt, gu, 0.4);
        card(CA[0], CA[1], pop(lt, 0, 0.25), () => {
          if (lt < se) { bigText('?', CA[0], CA[1], 200, C.white); return; }
          scaled(CA[0], CA[1], pop(lt, se, 0.25), () => {
            K.calendar(CA[0], CA[1] - 70, 0.5, '7', 'YEARS', -0.04);
            K.gumWad(CA[0] - 20, CA[1] + 190, 1.05, { tag: false, t, sq: 0.15 + 0.05 * Math.sin(t * 3) });
          });
        });
        card(CB[0], CB[1], pop(lt, 0.06, 0.25), () => {
          if (lt < go) { bigText('?', CB[0], CB[1], 200, C.white); return; }
          scaled(CB[0], CB[1], pop(lt, go, 0.25), () => {
            K.calendar(CB[0], CB[1] - 70, 0.5, 'DAYS', '', 0.04);
            const u = ((lt - go) * 0.9) % 1;
            ctx.save(); ctx.beginPath(); ctx.roundRect(CB[0] - CW / 2, CB[1] + 100, CW, 170, [0, 0, 38, 38]); ctx.clip();
            K.gumWad(lerp(CB[0] - 120, CB[0] + 260, eio(u)), CB[1] + 190, 1.05, { tag: false, t, rot: u * 2 });
            ctx.restore();
          });
        });
        K.abPill('A', '7 YEARS', CA[0], 1080, 44, { sc: pop(lt, se), hi: g });
        K.abPill('B', 'DAYS', CB[0], 1080, 44, { sc: pop(lt, da), hi: g });
        if (lt > gu) { ctx.save(); ctx.translate(540, 700); ctx.rotate(Math.sin(t * 7) * 0.08); bigText('?', 0, 0, 240, C.yellow, 0, eob(seg(lt, gu, gu + 0.3))); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + se, 'pop', { gain: 0.6 }); cue(st + go, 'zip', { gain: 0.4 }); cue(st + da, 'pop', { gain: 0.6 }); cue(st + gu, 'boing', { gain: 0.55 });
  }

  // ── 3a · "Gulp. Gum base is mostly synthetic." ──
  {
    const st = cut(2), gp = Wd('gulp', 2) - st, ba = Wd('base', 2) - st, sy = Wd('synthetic', 2) - st;
    const XT = { x: 540, y: 1000, s: 1.6 };
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.07, note: 'x-ray torso: GULP! on "Gulp", the wad slides down the throat into the stomach (lands on "synthetic"); GUM BASE tag (pointer follows the wad) on "base"; a small green lab flask pops on "synthetic"',
      draw(lt, d, t) {
        K.xray(t);
        K.man({ ...XT, xray: true, eyes: 'closed', mouth: 'flat', brow: 0.4 });
        const u = lerp(0.12, 1, eio(seg(lt, gp, sy + 0.35)));
        const [fx, fy] = K.foodAt(u), wx = XT.x + fx * XT.s, wy = XT.y + fy * XT.s;
        K.gumWad(wx, wy, 0.72, { t, tag: true, rot: 0.2 * Math.sin(t * 4) });
        if (lt > sy + 0.3) K.burst(wx, wy, 0.9, 1 - seg(lt, sy + 0.3, sy + 0.7));
        bigText('GULP!', 870, 230, 92, C.yellow, -0.12, pop(lt, gp, 0.2) * out(lt, ba + 0.2, 0.2));
        xtag('GUM BASE', 220, 700, wx - 40, wy, 44, pop(lt, ba));
        K.flask(880, 760, 1.35, pop(lt, sy, 0.3), t);
      } });
    cue(st, 'whoosh'); cue(st + gp, 'gulp', { gain: 0.9 }); cue(st + gp + 0.1, 'slide', { dur: sy - gp, gain: 0.4 }); cue(st + ba, 'pop', { gain: 0.6 }); cue(st + sy, 'pop', { gain: 0.5 }); cue(st + sy + 0.35, 'plop', { gain: 0.6 });
  }
  // ── 3b · "No enzyme in you breaks it." (rewatch label: gum base: no enzyme) ──
  {
    const st = at('no', 2), en = Wd('enzyme', 2) - st, br = Wd('breaks', 2) - st;
    const SX = 560, SY = 600, SS = 3.4, WX = 506, WY = 952;
    add({ id: 'S04', at: st, cam: [WX, WY - 60], zoom: 0.1, note: 'x-ray stomach close-up: the wad at the bottom of the J; tiny cyan "gum base: no enzyme" label pops on "enzyme" (rewatch detail); two pink enzyme chompers nibble at it and on "breaks" both chomp at once and bounce off, the wad stays whole',
      draw(lt, d, t) {
        K.xray(t);
        K.xrayStomach(SX, SY, SS, { t, churn: 1 });
        const hit = blip(lt, br, 0.35);
        K.gumWad(WX, WY, 1.7, { t, tag: true, sq: 0.12 * hit, rot: 0.05 * Math.sin(t * 3) });
        for (const sd of [-1, 1]) {
          const approach = eo(seg(lt, 0, 0.4)), nib = lt < br ? 0.5 + 0.5 * Math.sin(lt * 14 + sd) : 1;
          const bounce = lt > br ? Math.sin(Math.PI * seg(lt, br + 0.12, br + 0.6)) * 70 : 0;
          const cx = WX + sd * (lerp(300, 150, approach) - (lt < br ? 0 : 0) + bounce - (lt > br && lt < br + 0.12 ? 30 : 0));
          K.chomper(cx, WY + 10, 62, lerp(0.05, 0.6, nib), sd > 0);
        }
        if (lt > br + 0.1) { K.burst(WX - 110, WY, 0.7, 1 - seg(lt, br + 0.15, br + 0.55)); K.burst(WX + 110, WY, 0.7, 1 - seg(lt, br + 0.15, br + 0.55)); }
        K.pill('gum base: no enzyme', WX, WY - 132, 34, C.cyan, C.xnavy, pop(lt, en, 0.3));
      } });
    cue(st, 'whoosh'); cue(st + 0.25, 'bubbles', { dur: 1.2, gain: 0.3 }); cue(st + en, 'pop', { gain: 0.5 }); cue(st + br + 0.1, 'boing', { gain: 0.6 });
  }

  // ── the gut map (S05) + its zoom (S07 re-hook) ──
  const G = K.makeGut({ L: 210, R: 870, r: 85, y0: 420, rows: 5 });
  let uEnd = 1; while (uEnd > 0.5 && G.at(uEnd)[0] > 880) uEnd -= 0.002;
  const U0 = 0.03, U1 = 0.46;
  const gutMap = (t, u, { route = 0, sq = 0, spark = 0 } = {}) => {
    K.xray(t);
    G.draw({ ghost: 1 });
    ctx.save(); ctx.globalAlpha = 0.55; ctx.setLineDash([6, 22]); ctx.lineDashOffset = -t * 40; ctx.beginPath(); G.pts.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.strokeStyle = C.cyan; ctx.lineWidth = 5; ctx.stroke(); ctx.restore();
    if (route > 0) {
      const P = []; const ue = lerp(u, uEnd, clamp(route)); for (let v = u; v <= ue; v += 0.004) { const [a, b] = G.at(v); P.push([a, b]); }
      if (P.length > 1) { ctx.save(); ctx.setLineDash([18, 16]); line(P, C.white, 9); ctx.restore(); }
      const [px, py] = G.at(uEnd); K.mapPin(px, py - 10, 0.55, eob(seg(route, 0.85, 1)));
    }
    const [wx, wy] = G.at(u);
    K.gumWad(wx, wy, 0.85, { t, tag: true, sq });
    if (spark > 0) for (const [dx, dy, r] of [[-70, -60, 22], [74, -40, 16], [-40, 64, 14]]) K.sparkle4(wx + dx, wy + dy, r, clamp(spark), t);
  };

  // ── 4 · "It stays whole the entire trip, never breaking down." ──
  {
    const st = cut(3), wh = Wd('whole', 3) - st, tr = Wd('trip', 3) - st, nv = Wd('never', 3) - st, dn = Wd('down', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.06, note: 'x-ray gut map (ghost serpentine intestine): the wad rides along it; sparkles on "whole"; on "trip" a white dashed route draws ahead to a red map pin at the exit; on "never breaking down" the wad squashes at a bend and pops back whole',
      draw(lt, d, t) {
        const u = lerp(U0, U1, eio(seg(lt, 0, d)));
        gutMap(t, u, { route: eio(seg(lt, tr, tr + 0.7)), sq: 0.5 * blip(lt, nv, 0.35) - 0.2 * blip(lt, nv + 0.35, 0.3), spark: blip(lt, wh, 0.7) });
        K.pill('WHOLE', ...((([a, b]) => [a, b - 120])(G.at(u))), 40, C.white, C.ink, pop(lt, dn - 0.1, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 2.6, gain: 0.3 }); cue(st + wh, 'sparkle', { dur: 0.6, gain: 0.4 }); cue(st + tr, 'pop', { gain: 0.5 }); cue(st + nv + 0.1, 'boing', { gain: 0.5 }); cue(st + dn, 'pop', { gain: 0.45 });
  }

  // ── 5 · RELATABLE "Ever gulped yours mid-meeting and heard a parent's warning?" (meeting table) ──
  {
    const st = cut(4), gl = Wd('gulped', 4) - st, mm = Wd('mid', 4) - st, pa = Wd('parent', 4) - st, wa = Wd('warning', 4) - st;
    add({ id: 'S06', at: st, cam: [560, 640], zoom: 0.07, note: 'meeting room: hero at the meeting table chewing, coworkers either side, chart on the wall screen; on "gulped" he gulps (wide eyes, GULP), a sweat drop on "mid-meeting"; on "parent\'s" a speech bubble with a grey-haired parent (glasses, frown) pops, finger wags + "7 YEARS!" on "warning"',
      draw(lt, d, t) {
        K.meetingRoom();
        K.personIcon(165, 880, 1.35, '#5A6B8C');
        K.personIcon(915, 880, 1.35, C.pot);
        const g = lt > gl;
        K.man({ x: 540, y: 880, s: 0.95, sit: true, mouth: g ? 'flat' : 'chew', chew: 0.5 + 0.5 * Math.sin(lt * 14), eyes: g ? 'wide' : 'n', brow: g ? 0.9 : 0.2, sweat: seg(lt, mm, mm + 0.3), look: lt > pa ? 0.6 : 0 });
        K.meetingTable(540, 1010, 1);
        bigText('GULP!', 330, 560, 70, C.yellow, -0.12, pop(lt, gl, 0.2) * out(lt, pa - 0.3, 0.2));
        const bs = pop(lt, pa - 0.05, 0.3);
        K.bubble(770, 280, 470, 250, 650, 450, bs);
        scaled(770, 280, bs, () => {
          K.heroHead(645, 296, 0.52, { hairCol: '#B9B2A6', glasses: true, frown: true, mouth: lt > wa ? 'o' : 'flat', brow: 0.6 });
          ctx.save(); ctx.translate(725, 300); ctx.rotate(lt > wa ? Math.sin(lt * 11) * 0.35 : 0);
          ctx.beginPath(); ctx.roundRect(-10, -62, 20, 56, 10); ctx.fillStyle = C.skin; ctx.fill(); ctx.beginPath(); ctx.ellipse(0, 4, 22, 18, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
          if (lt > wa) { ctx.save(); ctx.font = '900 46px Inter'; ctx.fillStyle = C.red; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const k = eob(seg(lt, wa, wa + 0.25)); ctx.translate(880, 285); ctx.scale(k, k); ctx.fillText('7 YEARS!', 0, 0); ctx.restore(); }
        });
      } });
    cue(st, 'whoosh'); cue(st + gl, 'gulp', { gain: 0.8 }); cue(st + mm, 'pop', { gain: 0.3 }); cue(st + pa, 'pop', { gain: 0.6 }); cue(st + wa, 'boing', { gain: 0.4 });
  }

  // ── intestine tube close-up (S07 / S08) ──
  const TY0 = 420, TY1 = 1000, TW = (TY0 + TY1) / 2;
  const tube = (t, scroll) => {
    K.xray(t);
    ctx.fillStyle = C.xnavy; ctx.fillRect(-300, TY0, W + 600, TY1 - TY0);
    for (const [y, dir] of [[TY0, 1], [TY1, -1]]) {
      ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = C.cyan; ctx.fillRect(-300, y - (dir > 0 ? 60 : 0), W + 600, 60); ctx.restore();
      ctx.fillStyle = C.cyan; ctx.fillRect(-300, y - 7, W + 600, 14);
      for (let k = -2; k < 16; k++) {
        const x = ((k * 90 - scroll) % 1440 + 1440) % 1440 - 180;
        ctx.save(); ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.ellipse(x, y + dir * 22, 22, 36, 0, 0, Math.PI * 2); ctx.fillStyle = C.cyan; ctx.fill(); ctx.restore();
        ctx.beginPath(); ctx.ellipse(x, y + dir * 22, 13, 26, 0, 0, Math.PI * 2); ctx.fillStyle = C.xnavy; ctx.fill();
      }
    }
  };

  // ── 6 · RE-HOOK "But here's the twist: whole doesn't mean stuck." (hard zoom into the intestine) ──
  {
    const st = cut(5), tw = Wd('twist', 5) - st, wh = Wd('whole', 5) - st, sk = Wd('stuck', 5) - st, Z = 0.5;
    add({ id: 'S07', at: st, cam: [540, 770], zoom: 0.05, note: 'RE-HOOK: hard zoom from the gut map into the wad (0.5 s), white flash, NEW PLACE: inside the intestine tube (cyan walls, villi), the wad big with its tag now reading "~40 h" (rewatch clue); on "twist" the wad spins a full turn + burst; sparkles on "whole"; on "stuck" a red STUCK? stamp slams and gets a red X',
      draw(lt, d, t) {
        if (lt < Z) {
          const [wx, wy] = G.at(U1), k = lerp(1, 5, eio(seg(lt, 0, Z)));
          ctx.save(); ctx.translate(540, 770); ctx.scale(k, k); ctx.translate(-wx, -wy); gutMap(t, U1); ctx.restore();
          return;
        }
        tube(t, (lt - Z) * 60);
        const spin = lt > tw ? eio(seg(lt, tw, tw + 0.55)) * Math.PI * 2 : 0;
        K.gumWad(540, TW, 2.4, { t, tag: true, text: '~40 h', rot: spin });
        if (lt > tw) K.burst(540, TW, 2.2, 1 - seg(lt, tw + 0.2, tw + 0.7));
        const sp = blip(lt, wh, 0.7);
        if (sp > 0) for (const [dx, dy, r] of [[-170, -120, 40], [150, 130, 30], [-130, 140, 26]]) K.sparkle4(540 + dx, TW + dy, r, sp, t);
        K.stamp('STUCK?', 540, 230, 62, -0.08, lt > sk ? lerp(1.6, 1, eo(seg(lt, sk, sk + 0.18))) : 0);
        if (lt > sk + 0.22) K.redX(540, 230, 0.42, 1, 0.6);
        if (lt > Z && lt < Z + 0.12) { ctx.save(); ctx.globalAlpha = 0.7 * (1 - (lt - Z) / 0.12); ctx.fillStyle = C.white; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'zip', { gain: 0.5 }); cue(st + Z, 'whoosh', { gain: 0.7 }); cue(st + tw, 'boing', { gain: 0.5 }); cue(st + wh, 'sparkle', { dur: 0.5, gain: 0.35 }); cue(st + sk, 'thud', { gain: 0.7 }); cue(st + sk + 0.22, 'slam', { gain: 0.6 });
  }

  // ── 7 · "It doesn't cling. It rides along with food." ──
  {
    const st = cut(6), cl = Wd('cling', 6) - st, ri = Wd('rides', 6) - st, fo = Wd('food', 6) - st;
    const FOOD = [['pea', 0, -150], ['bread', 0.18, 150], ['carrot', 0.36, -60], ['pea', 0.55, 120], ['bread', 0.72, -170], ['carrot', 0.88, 40]];
    add({ id: 'S08', at: st, cam: [540, 770], zoom: 0.06, note: 'intestine tube, walls scrolling (travel): on "cling" the wad bumps the top wall and bounces straight off (no grip); on "rides" bits of food (pea, bread, carrot) flow in beside it with sky-blue flow arrows; more food on "food"; tag still reads "~40 h"',
      draw(lt, d, t) {
        tube(t, lt * 260 + 40);
        const bump = blip(lt, cl - 0.15, 0.5);
        const wy = TW - 190 * bump, wx = 540 + 30 * Math.sin(t * 2);
        for (const [kind, ph, dy] of FOOD) {
          const a = lt > ri + ph * 0.6 ? clamp((lt - ri - ph * 0.6) * 4) : 0; if (a <= 0) continue;
          const x = ((ph * 1300 + (lt - ri) * 300) % 1300) - 110, y = TW + dy + 10 * Math.sin(t * 3 + ph * 9);
          if (Math.abs(x - wx) < 120 && Math.abs(y - wy) < 110) continue;
          K.foodBit(kind, x, y, lerp(0.4, 1.3, eob(a)), t * (ph + 0.5));
        }
        K.flowArrow(300, TY1 - 80, 220, 0, pop(lt, ri, 0.3), C.sky, 18);
        K.flowArrow(780, TY1 - 80, 220, 0, pop(lt, fo, 0.3), C.sky, 18);
        K.gumWad(wx, wy, 2.4, { t, tag: true, text: '~40 h', sq: lt > cl - 0.2 && lt < cl + 0.1 ? -0.3 : 0 });
        K.shockLines(wx, wy, 150, 0);
      } });
    cue(st, 'whoosh'); cue(st + cl, 'boing', { gain: 0.6 }); cue(st + ri, 'slide', { dur: 1.4, gain: 0.35 }); cue(st + fo, 'pop', { gain: 0.5 });
  }

  // ── 8a · "A Duke doctor reviewing stomach scopes" ──
  {
    const st = cut(7), du = Wd('duke', 7) - st, sto = Wd('stomach', 7) - st, sc = Wd('scopes', 7) - st;
    add({ id: 'S09', at: st, cam: [600, 700], zoom: 0.07, note: 'clinic: the grey-haired doctor (lab coat, glasses) points at a monitor on a stand; DUKE HEALTH pill on "Duke"; the monitor lights up with a pink stomach scope view on "stomach", the view flies forward on "scopes"',
      draw(lt, d, t) {
        plain();
        ctx.fillStyle = C.floor; ctx.fillRect(-300, 1230, W + 600, 900);
        K.doctor({ x: 270, y: 1010, s: 0.82, arm: K.armPose(K.ARM.down, K.ARM.point, eio(seg(lt, 0.1, 0.5))), finger: 0.9, mouth: 'smile', look: 1 });
        K.scopeMonitor(770, 640, 1.05, { on: eo(seg(lt, sto, sto + 0.3)), t: lt > sc ? t : sto + st, sc: pop(lt, 0, 0.3) });
        K.pill('DUKE HEALTH', 270, 450, 46, C.ink, C.white, pop(lt, du));
      } });
    cue(st, 'whoosh'); cue(st + du, 'pop', { gain: 0.6 }); cue(st + sto, 'tock', { gain: 0.5 }); cue(st + sc, 'slide', { dur: 0.6, gain: 0.3 });
  }
  // ── 8b · "hasn't seen one gum wad." ──
  {
    const st = at('hasn', 7), on = Wd('one', 7) - st, gm = Wd('gum', 7) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.1, note: 'close-up of the scope screen: pink stomach view flying forward, white reticle sweeping; on "one" a pill GUM WADS SEEN: 0 pops; on "gum" a ghosted outline of a gum wad blinks in the reticle and fades: nothing there',
      draw(lt, d, t) {
        plain();
        ctx.beginPath(); ctx.roundRect(70, 250, 940, 900, 60); ctx.fillStyle = C.ink; ctx.fill();
        K.scopeView(540, 700, 400, t, 1.4);
        const ang = lt * 2.2, rx = 540 + Math.cos(ang) * 120, ry = 700 + Math.sin(ang) * 90;
        ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 8; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(rx, ry, 70, 0, Math.PI * 2); ctx.stroke();
        for (const [a, b] of [[[rx - 110, ry], [rx - 80, ry]], [[rx + 80, ry], [rx + 110, ry]], [[rx, ry - 110], [rx, ry - 80]], [[rx, ry + 80], [rx, ry + 110]]]) line([a, b], C.white, 8);
        ctx.restore();
        if (lt > gm) { ctx.save(); ctx.globalAlpha = 0.5 * (1 - seg(lt, gm + 0.2, gm + 0.7)); ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.ellipse(rx, ry, 46, 36, 0, 0, Math.PI * 2); ctx.strokeStyle = C.white; ctx.lineWidth = 6; ctx.stroke(); ctx.restore(); }
        K.pill('GUM WADS SEEN: 0', 540, 1060, 50, C.yellow, C.ink, pop(lt, on));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + on, 'pop', { gain: 0.7 }); cue(st + gm, 'tock', { gain: 0.4 });
  }

  // ── 9 · ANSWER "It's B: out in your poop, about forty hours later." ──
  {
    const st = cut(8), b = Wd('b', 8) - st, ou = Wd('out', 8) - st, po = Wd('poop', 8) - st, fo = Wd('forty', 8) - st, la = Wd('later', 8) - st;
    const A0 = [660, 560], A1 = [320, 860];
    add({ id: 'S11', at: st, cam: [540, 600], zoom: 0.05, note: 'ANSWER: the A/B pills in the frame-1 spot; on "B" a green check pops right of B (clear of the text), B flashes, A dims; COMMENT A OR B pill for ~1 s (not voiced); the wad slides down a green exit arrow into a small toilet icon on "out"→"poop"; a wall clock spins and a yellow ~40 HOURS pill pops on "forty"',
      draw(lt, d, t) {
        plain();
        pills({ check: pop(lt, b, 0.3), dim: seg(lt, b, b + 0.3), hiB: blip(lt, b, 0.4) });
        K.pill('COMMENT A OR B', 540, 418, 36, C.ink, C.yellow, pop(lt, b + 0.4, 0.25) * out(lt, b + 1.4, 0.2));
        K.toilet(A1[0] - 20, A1[1] + 60, 0.62);
        const ang = Math.atan2(A1[1] - A0[1], A1[0] - A0[0]), len = Math.hypot(A1[0] - A0[0], A1[1] - A0[1]);
        K.flowArrow((A0[0] + A1[0]) / 2, (A0[1] + A1[1]) / 2, len, ang, pop(lt, 0.05, 0.3), C.leaf, 26, '#468F55');
        const u = eio(seg(lt, ou, po)), gone = lt > po + 0.05;
        if (!gone) K.gumWad(lerp(A0[0], A1[0] + 10, u), lerp(A0[1] - 40, A1[1] - 20, u), 0.75, { t, tag: true, rot: u * 3 });
        else { const a = 1 - seg(lt, po + 0.25, po + 0.5), k = eo(seg(lt, po + 0.05, po + 0.3)); if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = C.sky; ctx.strokeStyle = C.ink; ctx.lineWidth = 4; for (const [dx, dy, r] of [[-70, -30, 13], [0, -60, 16], [70, -30, 13]]) { ctx.beginPath(); ctx.arc(A1[0] - 20 + dx * k, A1[1] + 40 + dy * k, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); } ctx.restore(); } }
        K.wallClock(800, 780, 150, { hour: 40 * eio(seg(lt, fo - 0.1, la + 0.2)), sc: pop(lt, 0.1, 0.3) });
        K.pill('~40 HOURS', 800, 1030, 54, C.yellow, C.ink, pop(lt, fo));
      } });
    cue(st, 'whoosh'); cue(st + b, 'pop', { gain: 0.8 }); cue(st + b + 0.4, 'pop', { gain: 0.35 }); cue(st + ou, 'slide', { dur: po - ou, gain: 0.4 }); cue(st + po + 0.05, 'plop', { gain: 0.6 }); cue(st + fo, 'tock', { gain: 0.5 }); cue(st + la, 'tock', { gain: 0.4 });
  }

  // ── 10a · SAFETY "Rare exception: blockages," (calm schematic) ──
  {
    const st = cut(9), ra = Wd('rare', 9) - st, bl = Wd('blockages', 9) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.05, note: 'calm schematic (white bg): a pale gut-tube diagram; ink RARE pill on "Rare"; on "blockages" several small gum wads gather into one lump in the tube and a dashed red ring circles it (no body, no person)',
      draw(lt, d, t) {
        plain();
        K.gutSchematic(540, 780, 960, { clump: seg(lt, bl - 0.45, bl + 0.35), ring: eo(seg(lt, bl + 0.2, bl + 0.5)), t, sc: pop(lt, 0, 0.3) });
        K.pill('RARE', 540, 430, 66, C.ink, C.white, pop(lt, ra));
      } });
    cue(st, 'whoosh'); cue(st + ra, 'pop', { gain: 0.6 }); cue(st + bl - 0.3, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + bl + 0.2, 'thud', { gain: 0.5 });
  }
  // ── 10b · "mostly kids swallowing lots of gum daily." ──
  {
    const st = at('mostly', 9), ki = Wd('kids', 9) - st, sw = Wd('swallowing', 9) - st, lo = Wd('lots', 9) - st, da = Wd('daily', 9) - st;
    const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'], DX = (i) => 500 + i * 80, BASE = 1060;
    add({ id: 'S13', at: st, cam: [600, 760], zoom: 0.05, note: 'calm graphic: a smiling kid icon (left) pops on "kids"; a week strip M-S (right) fills with little pink gum wads, a few per day, from "swallowing", more on "lots"; on "daily" a yellow underline sweeps the whole week; small sourced "1 PIECE: USUALLY FINE" + check at the top',
      draw(lt, d, t) {
        plain();
        K.ageIcon(250, 1130, 0.86, { kid: true, sc: pop(lt, 0.05) });
        K.pill('1 PIECE: USUALLY FINE', 540, 300, 38, C.white, C.ink, pop(lt, 0.1, 0.3));
        K.checkMark(880, 300, 0.6, pop(lt, 0.3, 0.3));
        DAYS.forEach((dname, i) => {
          ctx.save(); ctx.font = '900 44px Inter'; ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(dname, DX(i), BASE + 50); ctx.restore();
          for (let k = 0; k < 3; k++) {
            const start = k === 0 ? sw + i * 0.07 : lo + (k - 1) * 0.25 + i * 0.05;
            K.gumWad(DX(i), BASE - 40 - k * 62, 0.55, { tag: false, rot: (i * 3 + k) * 0.7, sc: pop(lt, start, 0.25) });
          }
        });
        if (lt > da) { const p = eio(seg(lt, da, da + 0.4)); line([[DX(0) - 40, BASE + 92], [lerp(DX(0) - 40, DX(6) + 40, p), BASE + 92]], C.yellow, 16); }
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.6 }); cue(st + sw, 'pop', { gain: 0.35 }); cue(st + lo, 'pop', { gain: 0.45 }); cue(st + da, 'slide', { dur: 0.4, gain: 0.4 });
  }

  // ── 11a · TEASE "Next Body File: eyelid twitches" ──
  const badge = (x, y, sc, size = 50) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = cut(10), nx = Wd('next', 10) - st, bo = Wd('body', 10) - st, ey = Wd('eyelid', 10) - st, tw = Wd('twitches', 10) - st;
    add({ id: 'S14', at: st, cam: [540, 720], zoom: 0.08, note: 'tease: a big round eye close-up (skin window); yellow NEXT pill on "Next", BODY FILES badge on "Body"; the eye looks round on "eyelid" and its LOWER lid starts flickering up on "twitches"',
      draw(lt, d, t) {
        plain();
        K.twitchEye(540, 720, 1.0, { twitch: lt > tw ? 1 : 0, t, look: lt > ey ? Math.sin(t * 2) * 0.5 : 0, sc: pop(lt, 0, 0.3) });
        badge(540, 200, pop(lt, bo));
        K.pill('NEXT', 540, 1160, 64, C.yellow, C.ink, pop(lt, nx));
      } });
    cue(st, 'whoosh'); cue(st + nx, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.5 }); cue(st + tw, 'tock', { gain: 0.4 });
  }
  // ── 11b · LOOP END CARD "that won't quit, mostly the lower lid." (frame-1 framing, B checked, the lid flickers) ──
  {
    const st = at('that', 10), qu = Wd('quit', 10) - st, lo = Wd('lower', 10) - st, li = Wd('lid', 10) - st;
    add({ id: 'S15', at: st, cam: [540, 640], zoom: 0.04, note: 'END CARD = frame-1 framing for the loop: x-ray hero close-up mid-gulp, wad in the throat, A/B pills with the check on B (A dimmed); his lower eyelid flickers (stronger on "quit"), yellow ring on it on "lower"; small twitching eye + yellow NEXT pill right of his head; BODY FILES badge bottom left; + FOLLOW pops bottom right after "lid"',
      draw(lt, d, t) {
        hookScene(t, { u: 0, twitch: lt > qu ? 1 : 0.6, ring: eo(seg(lt, lo, lo + 0.25)) });
        pills({ check: 1, dim: 1 });
        K.twitchEye(950, 560, 0.24, { twitch: 1, t, sc: pop(lt, 0.05, 0.3) });
        K.pill('NEXT', 950, 700, 38, C.yellow, C.ink, pop(lt, 0.1, 0.3));
        badge(290, 1185, pop(lt, 0.05, 0.3), 40);
        K.followPill(800, 1185, pop(lt, li + 0.2), t, 42);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + qu, 'tock', { gain: 0.4 }); cue(st + lo, 'pop', { gain: 0.5 }); cue(st + li + 0.2, 'pop', { gain: 0.7 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES };
}
