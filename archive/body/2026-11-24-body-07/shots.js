// WHAT HAPPENS TO YOUR FINGERS IN THE BATH?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): close-up of the hero's pruned hand rising out of bubbly bath water, a "5 MIN" kitchen
// timer on the tub rim (right), a rubber duck on the rim (left), pills A WATER / B NERVES. No black fade (loop: true).
// Guess (line 1): A WATER / B NERVES pop on the spoken options. Re-hook (line 5): new scene, the dark fingertip scanner.
// Answer (line 7): B gets the check in the same pill spot. Rewatch: "soak 1" / "soak 2 · 24 h+ later" scan cards +
// "Binghamton 2025" tag, and the duck on the rim faces the other way in the last shot. Tease (line 9) only from "Next";
// "Still pruney?" sinks the hand back to its frame-1 position (same camera scale) with the end card.
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
  const blip = (lt, a, d = 0.35) => (lt > a ? Math.sin(Math.PI * seg(lt, a, a + d)) : 0);
  const enter = (lt) => lerp(0.86, 1, eob(seg(lt, 0, 0.25)));        // on screen from frame 1 of the shot
  const GREY = '#8C8C94';

  // ── the HOOK framing (frame 1 + loop ending) ──
  const WY = 1000, HX = 440, HS = 1.4, HY_DOWN = 860, HY_UP = 800, HOOK_CAM = [540, 700];
  const TIMER = [905, 822, 88], DUCK = [728, 932, 0.6];
  const PY = 1060, PA = 290, PB = 790, PS = 44;
  const pills = ({ scA = 1, scB = 1, hiA = 0, hiB = 0, checkB = 0, dimA = 0 } = {}) => {
    K.abPill('A', 'WATER', PA, PY, PS, { sc: scA, hi: hiA, dim: dimA });
    K.abPill('B', 'NERVES', PB, PY, PS, { sc: scB, hi: hiB, check: checkB });
  };
  const hookScene = (t, { hy = HY_DOWN, tips = 0, kick = 0, duckFlip = 1, showPills = true, hiA = 0, hiB = 0 } = {}) => {
    K.bathWall(WY);
    K.bathTimer(TIMER[0], TIMER[1], TIMER[2], { text: '5 MIN', p: 1, kick });
    K.bathDuck(DUCK[0], DUCK[1], DUCK[2], { flip: duckFlip, rot: Math.sin(t * 1.6) * 0.03 });
    K.bathHand(HX, hy, HS, { prune: 1, tips, t, drip: 1 });
    K.bathWater(WY, t, { ripple: [HX, 200] });
    if (showPills) pills({ hiA, hiB });
  };

  // ── 1 · HOOK "What happens to your fingers in the bath?" ──
  {
    const fi = Wd('fingers', 0), ba = Wd('bath', 0);
    add({ id: 'S01', at: 0, cam: HOOK_CAM, zoom: 0.06, note: 'FRAME 1 = hook (no fade): pruned hand rising out of bubbly bath water, drips; 5 MIN timer on the rim, duck on the rim, A WATER / B NERVES pills; yellow rings on the fingertips on "fingers"; timer kicks on "bath"',
      draw(lt, d, t) {
        hookScene(t, { hy: lerp(HY_DOWN, HY_UP, eio(seg(lt, 0, d))), tips: blip(lt, fi, 0.6), kick: blip(lt, ba, 0.35) });
      } });
    cue(0.02, 'bubbles', { dur: 1.2, gain: 0.3 }); cue(fi, 'pop', { gain: 0.5 }); cue(ba, 'plop', { gain: 0.5 });
  }

  // ── 2a · "About five minutes in, they prune." (timer counts to 5, fingertips wrinkle) ──
  {
    const st = Wd('about', 1) - 0.1, fv = Wd('five', 1) - st, mi = Wd('minutes', 1) - st, pr = Wd('prune', 1) - st;
    add({ id: 'S02', at: st, cam: [520, 560], zoom: 0.1, note: 'closer on the hand in the water (on screen at the cut, still smooth) + big kitchen timer top right at 0 MIN; timer sweeps to 5 MIN from "five" to "minutes"; on "prune" the fingertips wrinkle + yellow rings',
      draw(lt, d, t) {
        const wy = 1180;
        K.bathWall(wy);
        const p = seg(lt, fv, mi + 0.2), n = Math.min(5, Math.floor(p * 5 + 0.0001));
        K.bathTimer(850, 330, 125, { text: `${n} MIN`, p, sc: enter(lt), kick: blip(lt, mi + 0.2, 0.3) });
        const pru = eio(seg(lt, pr, pr + 0.45));
        K.bathHand(400, 900, 1.55, { prune: pru, tips: blip(lt, pr + 0.2, 0.7), t, drip: 0.6 });
        K.bathWater(wy, t, { ripple: [400, 210] });
      } });
    cue(st, 'whoosh'); cue(st + fv, 'tock', { gain: 0.4 }); cue(st + fv + 0.2, 'tock', { gain: 0.35 }); cue(st + mi, 'tock', { gain: 0.4 }); cue(st + mi + 0.2, 'pop', { gain: 0.5 }); cue(st + pr, 'sparkle', { dur: 0.5, gain: 0.35 });
  }

  // ── 2b · GUESS "Is it water soaking in, or your nerves?" ──
  {
    const st = at('is', 1), wa = Wd('water', 1) - st, so = Wd('soaking', 1) - st, ne = Wd('nerves', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.05, note: 'guess: the pruned hand in the bath (on screen at the cut); pill A WATER pops on "water", blue arrows push into the fingertips on "soaking"; pill B NERVES pops on "nerves" + a pink nerve with a yellow signal runs up the arm into the fingers',
      draw(lt, d, t) {
        K.bathWall(WY);
        K.bathHand(HX, HY_UP, HS, { prune: 1, t, sc: enter(lt) });
        const aa = eo(seg(lt, so, so + 0.35)) * (1 - 0.6 * seg(lt, ne, ne + 0.3));
        if (aa > 0) for (let i = 0; i < 4; i++) {
          const [tx, ty] = K.bathTipAt(HX, HY_UP, HS, i);
          K.flowArrow(tx, ty - 150 + 40 * (1 - aa) + Math.sin(t * 6 + i) * 6, 90, Math.PI / 2, aa, C.sky, 16, '#7EC3E0');
        }
        const na = eo(seg(lt, ne, ne + 0.35));
        if (na > 0) {
          const [tx, ty] = K.bathTipAt(HX, HY_UP, HS, 1);
          const P = [[HX + 10, WY + 40], [HX + 20, HY_UP + 200], [HX - 10, HY_UP], [tx + 4, ty + 40]];
          ctx.save(); ctx.globalAlpha = na; K.nerve(P, ((t * 1.4) % 1), na); ctx.restore();
        }
        K.bathWater(WY, t, { ripple: [HX, 200] });
        pills({ scA: pop(lt, wa), scB: pop(lt, ne), hiA: blip(lt, wa, 0.45), hiB: blip(lt, ne, 0.45) });
      } });
    cue(st, 'whoosh'); cue(st + wa, 'pop', { gain: 0.6 }); cue(st + so, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + ne, 'pop', { gain: 0.6 }); cue(st + ne + 0.05, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 3 · RELATABLE "Ever chased the soap around the tub?" ──
  {
    const st = cut(2), ch = Wd('chased', 2) - st, so = Wd('soap', 2) - st, tu = Wd('tub', 2) - st;
    add({ id: 'S04', at: st, cam: [560, 760], zoom: 0.07, note: 'pink soap bar in the pruned hand over the water (both on screen at the cut); on "chased" it shoots out of the grip (speed lines), the hand lunges after it; it bounces up on "soap"; plops into the water on "tub" (splash)',
      draw(lt, d, t) {
        const wy = 1020;
        K.bathWall(wy);
        // soap path: in hand → shoots right → bounces up → plops at x 820
        let sx = 560, sy = 760, rot = 0;
        if (lt > ch) { const u = seg(lt, ch, so); sx = lerp(560, 900, eo(u)); sy = 760 - Math.sin(u * Math.PI) * 40; rot = u * 2.5; }
        if (lt > so) { const u = seg(lt, so, tu); sx = lerp(900, 800, u); sy = lerp(760, 1000, u * u) - Math.sin(u * Math.PI) * 260; rot = 2.5 + u * 3; }
        const sunk = lt > tu ? seg(lt, tu, tu + 0.3) : 0;
        const hx = lt < ch ? 330 : lerp(330, 520, eob(seg(lt, ch + 0.05, ch + 0.4)));
        K.bathHand(hx, 760, 0.95, { prune: 1, rot: 1.35, t, sc: enter(lt) });
        if (sunk < 1) K.bathSoap(sx, sy + sunk * 80, 0.95, rot, 1 - sunk * 0.5);
        if (lt > ch && lt < so + 0.2) K.speedLines(sx - 160, sy, out(lt, so - 0.1, 0.3));
        K.bathWater(wy, t, { foam: 0.8 });
        if (lt > tu) { const u = seg(lt, tu, tu + 0.45); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * 0.45; K.drop(800 + Math.cos(a) * 140 * u, wy - 20 + Math.sin(a) * 160 * u + 200 * u * u, 0.55, a + Math.PI / 2, 1 - u); } }
        K.shockLines(sx, sy, 130, lt > so ? out(lt, so + 0.15, 0.3) : 0);
      } });
    cue(st, 'whoosh'); cue(st + ch, 'zip', { gain: 0.5 }); cue(st + so, 'boing', { gain: 0.5 }); cue(st + tu, 'plop', { gain: 0.7 });
  }

  // ── 4a · "One study: wrinkly fingers" ──
  {
    const st = Wd('one', 3) - 0.07, sd = Wd('study', 3) - st, wr = Wd('wrinkly', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 640], zoom: 0.07, note: 'a study clipboard (on screen at the cut) writes its lines on "study" + "Newcastle Univ. 2013" tag; on "wrinkly" a big wrinkly fingertip pops beside a smooth one, yellow ring on the wrinkly pad',
      draw(lt, d, t) {
        plain();
        K.clipboard(540, 450, 0.8 * enter(lt), seg(lt, sd, sd + 0.6), -0.04);
        K.pill('Newcastle Univ. 2013', 540, 150, 38, C.ink, C.white, pop(lt, sd + 0.1));
        const pw = pop(lt, wr);
        K.bathPad(330, 900, 120, { prune: 1, seed: 3, sc: pw });
        K.bathPad(750, 900, 120, { prune: 0, seed: 3, sc: pw, alpha: 0.75 });
        K.hiRing(330, 880, 150, 175, eo(seg(lt, wr + 0.15, wr + 0.4)));
        K.pill('WRINKLY', 330, 1110, 36, C.yellow, C.ink, pop(lt, wr + 0.1));
        K.pill('SMOOTH', 750, 1110, 36, GREY, C.white, pop(lt, wr + 0.2));
      } });
    cue(st, 'whoosh'); cue(st + sd, 'pop', { gain: 0.5 }); cue(st + wr, 'pop', { gain: 0.6 }); cue(st + wr + 0.2, 'pop', { gain: 0.4 });
  }

  // ── 4b · "moved wet marbles twelve percent faster." (marble race) ──
  {
    const st = at('moved', 3), mv = Wd('moved', 3) - st, mb = Wd('marbles', 3) - st, tw = Wd('twelve', 3) - st, fa = Wd('faster', 3) - st;
    const lanes = [{ y: 500, prune: 1, per: 0.42, col: C.cyan }, { y: 940, prune: 0, per: 0.47, col: C.pink }];
    add({ id: 'S06', at: st, cam: [540, 700], zoom: 0.06, note: 'marble race (on screen at the cut): two lanes, bowl → bowl; top lane a wrinkly fingertip, bottom a smooth one; marbles start moving on "moved", top lane pulls ahead; +12% yellow pill on "twelve"; FASTER burst + check on "faster"',
      draw(lt, d, t) {
        plain();
        const e = enter(lt);
        lanes.forEach((ln, li) => {
          const { y, prune, per, col } = ln;
          ctx.save(); ctx.translate(540, y); ctx.scale(e, e); ctx.translate(-540, -y);
          K.bathBowl(180, y + 70, 300); K.bathBowl(900, y + 70, 300);
          line([[300, y + 40], [780, y + 40]], '#E4DCCB', 10);
          const run = Math.max(0, lt - mv), done = Math.min(6, Math.floor(run / per)), u = (run / per) % 1;
          for (let k = 0; k < 6 - done - (run > 0 && done < 6 ? 1 : 0); k++) K.bathMarble(120 + (k % 3) * 60, y + 60 - Math.floor(k / 3) * 44, 29, col);
          for (let k = 0; k < done; k++) K.bathMarble(840 + (k % 3) * 60, y + 60 - Math.floor(k / 3) * 44, 29, col);
          const px = run > 0 && done < 6 ? lerp(240, 840, eio(u)) : 240, py = y - 20 - Math.sin(Math.PI * (run > 0 ? u : 0)) * 110;
          if (run > 0 && done < 6) K.bathMarble(px, py + 30, 29, col);
          K.bathPad(px, py - 95, 62, { prune, seed: 3 });
          ctx.restore();
        });
        K.pill('WRINKLY', 540, 250, 40, C.yellow, C.ink, enter(lt));
        K.pill('SMOOTH', 540, 690, 40, GREY, C.white, enter(lt));
        K.burst(880, 290, 1.5, lt > fa ? out(lt, fa + 0.15, 0.4) : 0);
        K.pill('+12%', 880, 290, 64, C.yellow, C.ink, pop(lt, tw));
        K.checkMark(1010, 200, 0.6, pop(lt, fa));
      } });
    cue(st, 'whoosh'); cue(st + mv, 'slide', { dur: 1.6, gain: 0.25 }); cue(st + mb, 'pop', { gain: 0.35 }); cue(st + tw, 'pop', { gain: 0.7 }); cue(st + fa, 'thud', { gain: 0.5 });
  }

  // ── 5 · "Like tire treads, though not every study agrees." ──
  {
    const st = cut(4), ti = Wd('tire', 4) - st, tr = Wd('treads', 4) - st, ev = Wd('every', 4) - st;
    add({ id: 'S07', at: st, cam: [540, 620], zoom: 0.06, note: 'big wrinkly fingertip (left) + a car tyre (right), both on screen at the cut; tyre rolls on "tire"; on "treads" blue water arrows squeeze out of the grooves of both + yellow rings; grey stamp OTHER STUDY: NO DIFFERENCE slams on "every"',
      draw(lt, d, t) {
        plain();
        const e = enter(lt);
        K.bathPad(300, 640, 150, { prune: 1, seed: 3, sc: e });
        K.bathTyre(790, 600, 200, lt > ti ? (lt - ti) * 1.2 : 0, e);
        bigText('=', 545, 420, 120, C.yellow, 0, pop(lt, tr));
        const fa = eo(seg(lt, tr, tr + 0.4)) * out(lt, ev, 0.3);
        if (fa > 0) for (const [x0, dir] of [[300, -1], [300, 1], [790, -1], [790, 1]]) for (let i = 0; i < 2; i++) {
          const y = (x0 === 300 ? 560 : 470) + i * 130 + Math.sin(t * 8 + i) * 4;
          K.flowArrow(x0 + dir * (x0 === 300 ? 120 : 200) + dir * 30 * fa, y, 70, dir > 0 ? 0 : Math.PI, fa, C.sky, 14, '#7EC3E0');
        }
        K.hiRing(300, 600, 180, 230, blip(lt, tr, 0.6)); K.hiRing(790, 600, 225, 225, blip(lt, tr, 0.6));
        K.pill('GRIP', 540, 230, 50, C.yellow, C.ink, pop(lt, tr + 0.1) * out(lt, ev, 0.2));
        K.stamp('OTHER STUDY:\nNO DIFFERENCE', 540, 1010, 50, -0.08, lt > ev ? lerp(1.8, 1, eo(seg(lt, ev, ev + 0.2))) : 0, GREY);
      } });
    cue(st, 'whoosh'); cue(st + ti, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + tr, 'pop', { gain: 0.6 }); cue(st + ev, 'slam', { gain: 0.5 });
  }

  // ── 6a · RE-HOOK "But here's the weird part:" (new scene: dark fingertip scanner) ──
  {
    const st = cut(5), bu = Wd('but', 5) - st, we = Wd('weird', 5) - st;
    add({ id: 'S08', at: st, cam: [540, 640], zoom: 0.22, note: 'RE-HOOK, new scene: dark room, a fingertip scanner plate with a pruned fingertip pressed on it (on screen at the cut), yellow scan bar sweeping; strong push in; on "weird" a yellow burst + "?!" + SCANNING pill',
      draw(lt, d, t) {
        ctx.fillStyle = C.navy; ctx.fillRect(-300, -300, W + 600, H + 600);
        const e = enter(lt);
        ctx.save(); ctx.translate(540, 650); ctx.scale(e, e); ctx.translate(-540, -650);
        ctx.beginPath(); ctx.roundRect(170, 330, 740, 700, 50); ctx.fillStyle = C.ink; ctx.fill();
        ctx.beginPath(); ctx.roundRect(200, 360, 680, 640, 36); ctx.fillStyle = '#DCEFF7'; ctx.fill();
        K.bathPad(540, 690, 190, { prune: 1, seed: 3 });
        const sy = 380 + ((lt * 0.9) % 1) * 600;
        ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = C.yellow; ctx.fillRect(200, sy, 680, 16); ctx.restore();
        ctx.restore();
        K.burst(830, 330, 1.6, lt > we ? out(lt, we + 0.2, 0.4) : 0);
        bigText('?!', 830, 330, 150, C.yellow, 0.1, pop(lt, we));
        K.pill('SCANNING', 540, 1110, 40, C.yellow, C.ink, pop(lt, bu + 0.05));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'sparkle', { dur: 1.2, gain: 0.25 }); cue(st + bu + 0.05, 'pop', { gain: 0.4 }); cue(st + we, 'boing', { gain: 0.55 });
  }

  // ── 6b · "soak again tomorrow, and the wrinkles match exactly." (scan cards overlap) ──
  {
    const st = at('soak', 5), ag = Wd('again', 5) - st, to = Wd('tomorrow', 5) - st, wr = Wd('wrinkles', 5) - st, ma = Wd('match', 5) - st, ex = Wd('exactly', 5) - st;
    const A = [290, 620], B = [790, 620], CW = 380;
    add({ id: 'S09', at: st, cam: [540, 640], zoom: 0.06, note: 'scan card SOAK 1 (on screen at the cut); card SOAK 2 · 24 h+ later pops on "tomorrow" (rewatch: tiny labels + Binghamton 2025 tag); on "match" a yellow copy of the soak-2 print flies onto soak 1 and lands line-for-line; check + MATCH pill on "exactly"',
      draw(lt, d, t) {
        plain();
        K.bathScanCard(A[0], A[1], CW, { label: 'SOAK 1', sub: 'day 1', seed: 3, sc: enter(lt), rot: -0.03 });
        K.bathScanCard(B[0], B[1], CW, { label: 'SOAK 2', sub: '24 h+ later', seed: 3, sc: pop(lt, to), rot: 0.03 });
        K.pill('Binghamton 2025', 540, 1080, 34, C.ink, C.white, pop(lt, to + 0.15));
        if (lt > wr) K.hiRing(B[0], B[1], 150, 190, blip(lt, wr, 0.5));
        const fly = eio(seg(lt, ma, ma + 0.35));
        if (lt > ma) {
          const x = lerp(B[0], A[0], fly), y = lerp(B[1], A[1], fly) - Math.sin(Math.PI * fly) * 120, r = lerp(0.03, -0.03, fly);
          ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.translate(-x, -y);
          K.bathPad(x, y - CW * 1.3 * 0.02, CW * 0.26, { prune: 1, seed: 3, print: true, col: C.yellow });
          ctx.restore();
        }
        K.checkMark(A[0] + 160, A[1] - 230, 0.8, pop(lt, ex));
        K.pill('MATCH', A[0], A[1] + 330, 46, C.yellow, C.ink, pop(lt, ex + 0.05));
        K.calendar(B[0], 220, 0.32 * pop(lt, ag), 'DAY', '2', 0.06);
      } });
    cue(st, 'whoosh'); cue(st + ag, 'pop', { gain: 0.4 }); cue(st + to, 'pop', { gain: 0.6 }); cue(st + ma, 'slide', { dur: 0.35, gain: 0.4 }); cue(st + ex, 'thud', { gain: 0.5 }); cue(st + ex + 0.05, 'sparkle', { dur: 0.5, gain: 0.35 });
  }

  // ── 7 · "The blood vessels underneath barely move." (x-ray zoom into the fingertip) ──
  const TIP = [540, 560, 0.70];
  {
    const st = cut(6), bl = Wd('blood', 6) - st, ve = Wd('vessels', 6) - st, ba = Wd('barely', 6) - st, mo = Wd('move', 6) - st;
    add({ id: 'S10', at: st, cam: [480, 520], zoom: 0.12, note: 'x-ray film: cutaway of one fingertip (cyan outline, bone, nail, red vessel with loops, pink nerve), on screen at the cut; yellow glow on the vessel on "vessels"; dashed yellow copy (soak 2) lands right on it on "barely"; pins fix it on "move" + SAME SPOT pill',
      draw(lt, d, t) {
        K.xray(t);
        K.bathTipXray(TIP[0], TIP[1], TIP[2], { t, hiV: eo(seg(lt, ve, ve + 0.25)) * out(lt, ba, 0.3), ghost: eo(seg(lt, ba, ba + 0.3)), pins: seg(lt, mo, mo + 0.4), sc: enter(lt) });
        if (lt > bl + 0.05) { ctx.save(); ctx.globalAlpha = clamp(pop(lt, bl + 0.05)); line([[320, 790], [TIP[0] - 90 * TIP[2], TIP[1] + 400 * TIP[2]]], C.cyan, 6); ctx.restore(); }
        K.pill('blood vessel', 235, 760, 34, C.cyan, C.xnavy, pop(lt, bl + 0.05));
        K.pill('SAME SPOT', 820, 920, 40, C.yellow, C.ink, pop(lt, mo));
      } });
    cue(st, 'whoosh'); cue(st + bl, 'pop', { gain: 0.4 }); cue(st + ve, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + ba, 'slide', { dur: 0.3, gain: 0.3 }); cue(st + mo, 'thud', { gain: 0.5 });
  }

  // ── 8 · ANSWER "It's your nerves: they narrow those vessels, and skin buckles." ──
  {
    const st = cut(7), ne = Wd('nerves', 7) - st, na = Wd('narrow', 7) - st, ve = Wd('vessels', 7) - st, sk = Wd('skin', 7) - st, bu = Wd('buckles', 7) - st;
    add({ id: 'S11', at: st, cam: [540, 600], zoom: 0.07, note: 'ANSWER: same x-ray fingertip + A/B pills in the guess spot (all on screen at the cut); on "nerves" the nerve lights yellow with signals, B gets the check, A dims; COMMENT A OR B pill ~1 s (not voiced); on "narrow" the vessel squeezes thin; on "buckles" the pad skin folds into wrinkles + yellow burst',
      draw(lt, d, t) {
        K.xray(t);
        const nv = eo(seg(lt, ne, ne + 0.3));
        K.bathTipXray(540, 500, 0.62, { t, nerve: nv, narrow: eio(seg(lt, na, ve + 0.2)), buckle: eob(seg(lt, bu, bu + 0.45)), sc: enter(lt) });
        K.burst(410, 470, 1.3, lt > bu ? out(lt, bu + 0.2, 0.4) : 0);
        K.pill('nerve', 820, 420, 34, C.cyan, C.xnavy, pop(lt, ne + 0.1));
        if (lt > na) { K.arrow(250, 560, 80 * eo(seg(lt, na, na + 0.3)), 0, 1); K.arrow(250, 300, 80 * eo(seg(lt, na, na + 0.3)), 0, 1); }
        pills({ scA: enter(lt), scB: enter(lt), checkB: pop(lt, ne, 0.3), dimA: seg(lt, ne, ne + 0.3), hiB: blip(lt, ne, 0.45) });
        K.pill('COMMENT A OR B', 540, 150, 44, C.ink, C.yellow, pop(lt, ne + 0.35, 0.25) * out(lt, ne + 1.35, 0.2));
      } });
    cue(st, 'whoosh'); cue(st + ne, 'pop', { gain: 0.8 }); cue(st + ne + 0.05, 'sparkle', { dur: 0.5, gain: 0.35 }); cue(st + ne + 0.35, 'pop', { gain: 0.3 }); cue(st + na, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + bu, 'boing', { gain: 0.5 });
  }

  // ── 9 · "Fingers with cut nerves stay smooth." (schematic only) ──
  {
    const st = Wd('fingers', 8) - 0.07, fi = Wd('fingers', 8) - st, cu = Wd('cut', 8) - st, sm = Wd('smooth', 8) - st;
    add({ id: 'S12', at: st, cam: [540, 640], zoom: 0.06, note: 'two hands rising from the bath (on screen at the cut): left pruned, right smooth; nerve icons pop above: intact (signal) on "fingers", cut symbol (two ends + red //, no wound) on "cut"; sparkles on the smooth fingertips + SMOOTH pill on "smooth"',
      draw(lt, d, t) {
        const wy = 1060;
        K.bathWall(wy);
        K.bathHand(290, 800, 0.78, { prune: 1, t, sc: enter(lt) });
        K.bathHand(790, 800, 0.78, { prune: 0, t, sc: enter(lt) });
        K.bathWater(wy, t, { foam: 0.7 });
        K.bathNerveIcon(290, 200, 92, { t, sc: pop(lt, fi) });
        K.bathNerveIcon(790, 200, 92, { cut: eo(seg(lt, cu, cu + 0.35)), sc: pop(lt, cu - 0.05) });
        K.pill('NERVE OK', 290, 335, 34, C.ink, C.white, pop(lt, fi + 0.1));
        K.pill('NERVE CUT', 790, 335, 34, C.ink, C.white, pop(lt, cu + 0.1));
        const ss = pop(lt, sm);
        for (let i = 0; i < 4; i++) { const [x, y] = K.bathTipAt(790, 800, 0.78, i); K.sparkle4(x + (i - 1.5) * 8, y - 70, 20, ss * (0.8 + 0.2 * Math.sin(t * 9 + i))); }
        K.pill('SMOOTH', 790, 1150 - 40, 40, C.yellow, C.ink, pop(lt, sm + 0.05));
      } });
    cue(st, 'whoosh'); cue(st + fi, 'pop', { gain: 0.5 }); cue(st + cu, 'pop', { gain: 0.6 }); cue(st + sm, 'sparkle', { dur: 0.5, gain: 0.45 });
  }

  // ── 10a · TEASE "Next Body File: the side stitch, three suspects." (starts on "Next") ──
  const badge = (x, y, sc, size = 46) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = Wd('next', 9), bo = Wd('body', 9) - st, si = Wd('side', 9) - st, sti = Wd('stitch', 9) - st, th = Wd('three', 9) - st, su = Wd('suspects', 9) - st;
    add({ id: 'S13', at: st, cam: [540, 640], zoom: 0.07, note: 'tease (cut exactly on "Next"): side-stitch badge (hero clutching his side, red zap) big on screen at the cut + yellow NEXT pill; BODY FILES badge on "Body"; zap flares on "stitch"; three "?" suspect cards deal in on "three"/"suspects"',
      draw(lt, d, t) {
        plain();
        K.sideStitchBadge(330, 620, 250, { sc: enter(lt), t });
        K.burst(330 + 250 * 0.36, 620 + 250 * 0.62, 1.2, lt > sti ? out(lt, sti + 0.15, 0.35) : 0);
        K.pill('NEXT', 330, 260, 60, C.yellow, C.ink, pop(lt, 0.02));
        badge(540, 1110, pop(lt, bo));
        [0, 1, 2].forEach((i) => {
          const sc = pop(lt, th + i * 0.12, 0.28), x = 840, y = 360 + i * 230;
          if (sc <= 0) return;
          ctx.save(); ctx.translate(x, y); ctx.rotate((i - 1) * 0.06); ctx.scale(sc, sc);
          ctx.beginPath(); ctx.roundRect(-110, -95, 220, 190, 24); ctx.fillStyle = C.ink; ctx.fill();
          ctx.beginPath(); ctx.roundRect(-100, -85, 200, 170, 18); ctx.fillStyle = C.white; ctx.fill();
          ctx.restore();
          bigText('?', x, y + 4, 120, C.yellow, (i - 1) * 0.06, sc);
        });
        K.pill('3 SUSPECTS', 840, 1000 - 40, 34, C.red, C.white, pop(lt, su + 0.2));
        void si;
      } });
    cue(st, 'whoosh'); cue(st + 0.02, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.5 }); cue(st + sti, 'zip', { gain: 0.4 });
    cue(st + th, 'pop', { gain: 0.5 }); cue(st + th + 0.12, 'pop', { gain: 0.5 }); cue(st + th + 0.24, 'pop', { gain: 0.5 });
  }

  // ── 10b · LOOP "Still pruney?" (back to the frame-1 bath; hand sinks to its frame-1 spot; camera ends at frame 1's scale) ──
  {
    const st = at('still', 9), pr = Wd('pruney', 9) - st, Z = 0.13;
    add({ id: 'S14', at: st, cam: HOOK_CAM, zoom: Z, note: 'LOOP + END CARD: back to the frame-1 bath (same timer, duck, hand, camera); the hand sinks from its raised height back to its frame-1 position, ending at frame 1\'s exact scale; rings on the fingertips on "pruney"; duck on the rim now faces the other way (rewatch); small side-stitch badge + NEXT top right; BODY FILES + FOLLOW in the pill spot (overlay held still against the camera push)',
      draw(lt, d, t) {
        hookScene(t, { hy: lerp(HY_UP, HY_DOWN, eio(seg(lt, 0, d))), tips: blip(lt, pr, 0.6), duckFlip: -1, showPills: false });
        const k = (1 + 0.13 * (1 - eo(clamp(lt / 0.32)))) * (1 + Z * eio(clamp(lt / d)));    // undo main.js camera for the overlay
        ctx.save(); ctx.translate(HOOK_CAM[0], HOOK_CAM[1]); ctx.scale(1 / k, 1 / k); ctx.translate(-HOOK_CAM[0], -HOOK_CAM[1]);
        K.sideStitchBadge(915, 230, 95, { sc: pop(lt, 0.03, 0.3), t });
        K.pill('NEXT', 915, 365, 30, C.yellow, C.ink, pop(lt, 0.08, 0.3));
        badge(300, 1090, pop(lt, 0.03, 0.3), 38);
        K.followPill(800, 1090, pop(lt, 0.3), t, 40);
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + 0.3, 'pop', { gain: 0.6 }); cue(st + pr, 'bubbles', { dur: 0.9, gain: 0.3 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES, loop: true };
}
