// WHAT HAPPENS IF YOU SWALLOW A MAGNET?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Safety: nobody ever brings a magnet near the mouth. The hero only holds it at chest height and eyes it.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, bigText, line, rr } from './core/lib.js';
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

  // ── 1 · HOOK: hero eyes a magnet held at chest height, "?" on "magnet" ─────
  {
    const st = cut(0), sw = Wd('swallow', 0) - st, mg = Wd('magnet', 0) - st;
    add({ id: 'S01', at: st, cam: [560, 800], note: 'room, hero holds a horseshoe magnet at chest height (never near mouth), brows up on "swallow", "?" on "magnet"',
      draw(lt) {
        K.room();
        const p = eio(seg(lt, 0, 0.4)), sus = lt > sw;
        K.man({ x: 380, y: 1180, s: 1.45, arm: K.armPose(K.ARM.down, HOLD, p), look: 1, eyes: lt > mg ? 'wide' : 'n', mouth: sus ? 'o' : 'flat', brow: sus ? 1 : 0.2,
          holding: (x, y) => K.magnet(x + 20, y - 30, 0.32, Math.sin(lt * 3) * 0.08) });
        bigText('?', 760, 560, 200, C.yellow, 0.15, pop(lt, mg));
      } });
    cue(st + 0.2, 'whoosh', { gain: 0.5 }); cue(st + mg, 'pop', { gain: 0.6 });
  }

  // ── 2 · one small magnet usually isn't the problem ─────────────────────
  {
    const st = cut(1), on = Wd('one', 1) - st, sm = Wd('small', 1) - st, isn = Wd('isn', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.08, note: 'bar magnet drops at shot start, big "1" on "one", shrinks on "small", USUALLY FINE pill on "isn\'t"',
      draw(lt) {
        plain();
        bigText('1', 540, 380, 260, C.yellow, -0.08, pop(lt, on));
        { const p = eob(seg(lt, 0.02, 0.4)), s = lerp(3.4, 2.4, eio(seg(lt, sm, sm + 0.35)));
          K.barMagnet(540, lerp(-200, 760, p) + Math.sin(lt * 3) * 8, s, lerp(0.5, -0.06, p)); }
        K.pill('USUALLY FINE', 540, 1080, 62, C.ink, C.white, pop(lt, isn));
      } });
    cue(st, 'whoosh'); cue(st + 0.35, 'thud', { gain: 0.6 }); cue(st + isn, 'pop', { gain: 0.5 });
  }

  // ── 3 / 3b / 4 · one magnet rides the folded gut and zips out ──────────
  const gut = K.makeGut();
  const t0 = L(2), tOut = Wd('out', 3), tEnd = Wd('end', 3);
  const uAt = (t) => (t < tOut ? lerp(0.0, 0.88, eio(seg(t, t0 - 0.1, tOut))) : lerp(0.88, 1.05, eo(seg(t, tOut, tEnd + 0.1))));
  const rideMag = (t) => { const [x, y, a] = gut.at(Math.min(1, uAt(t))); const extra = Math.max(0, uAt(t) - 1) * 3000; K.barMagnet(x + extra, y, 0.56, a); };
  {
    const st = cut(2), tw = Wd('twenty', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.08, note: 'x-ray: serpentine gut, one bar magnet slides in from the top, 20+ FEET pill on "twenty"',
      draw(lt, d, t) {
        K.xray(t); gut.draw(); rideMag(t);
        K.pill('20+ FEET', 640, 200, 60, C.ink, C.white, pop(lt, tw));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 2.0, gain: 0.45 }); cue(st + tw, 'pop', { gain: 0.5 });
  }
  {
    const st = at('folded', 2);
    add({ id: 'S03b', at: st, cam: [540, 820], zoom: 0.16, note: 'push in on the folded loops, magnet keeps riding, FOLDED tag on "folded"',
      draw(lt, d, t) {
        K.xray(t); gut.draw(); rideMag(t);
        K.tag('FOLDED', 540, 230, 870, 420, 56, pop(lt, 0.05));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 1.3, gain: 0.4 });
  }
  {
    const st = cut(3), out = tOut - st, en = tEnd - st;
    add({ id: 'S04', at: st, cam: [700, 960], zoom: 0.1, note: 'magnet reaches the last loop and zips out the right side on "out", OUT IT GOES pill on "end"',
      draw(lt, d, t) {
        K.xray(t); gut.draw(); rideMag(t);
        if (lt > out && lt < out + 0.4) K.speedLines(960, 1120, 0.8 * (1 - seg(lt, out + 0.2, out + 0.4)));
        K.pill('OUT IT GOES', 540, 230, 60, C.ink, C.white, pop(lt, en));
      } });
    cue(st, 'whoosh'); cue(st + out, 'zip', { gain: 0.7 }); cue(st + en, 'pop', { gain: 0.5 });
  }

  // ── 5 · swallow TWO: they hunt each other down ─────────────────────────
  {
    const st = cut(4), tw = Wd('two', 4) - st, hu = Wd('hunt', 4) - st, dn = Wd('down', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.1, note: 'two magnets with eyes fly in at shot start, "2" on "two", turn mad + red arrows toward each other on "hunt", creep closer to "down"',
      draw(lt, d, t) {
        plain();
        bigText('2', 540, 380, 240, C.yellow, 0.08, pop(lt, tw));
        {
          const p = eo(seg(lt, 0.02, 0.4)), mad = lt > hu, close = eio(seg(lt, hu, dn + 0.3));
          const jit = mad ? Math.sin(lt * 40) * 4 : 0;
          K.barMagnet(lerp(-300, 230, p) + close * 60 + jit, 780, 2.2, 0, { face: { look: 1, mad } });
          K.barMagnet(lerp(1380, 850, p) - close * 60 - jit, 780, 2.2, 0, { face: { look: -1, mad } });
          if (mad) { const a = eo(seg(lt, hu, hu + 0.25)); K.arrow(540, 1010, 300, 0, a); K.arrow(540, 560, 300, Math.PI, a); }
        }
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'zip', { gain: 0.5 }); cue(st + tw, 'pop', { gain: 0.5 }); cue(st + hu, 'boing', { gain: 0.5 });
  }

  // ── 6 · they snap together through the walls of two gut loops ──────────
  const YA = 560, YB = 960, MEET = (YA + YB) / 2;
  const stuckPair = (t, pull, snapP, jx = 0) => {
    const g = K.gutPair(YA, YB, t, pull);
    K.barMagnet(540 + jx, lerp(g.a(540), MEET - 36, snapP), 1.15, 0);
    K.barMagnet(540 - jx, lerp(g.b(540), MEET + 36, snapP), 1.15, 0, { flip: true });
    return g;
  };
  {
    const st = cut(5), sn = Wd('snap', 5) - st, wl = Wd('walls', 5) - st, tw = Wd('two', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.1, note: 'close-up: two gut loops, a magnet in each; walls pull together and SNAP! on "snap", GUT WALLS tag on "walls", 2 LOOPS on "two"',
      draw(lt, d, t) {
        plain();
        const sp = eo(seg(lt, sn - 0.12, sn + 0.05)), pull = eob(seg(lt, sn - 0.12, sn + 0.2));
        stuckPair(t, clamp(pull, 0, 1.08), sp, (1 - sp) * Math.sin(lt * 9) * 60);
        if (lt > sn) { K.burst(540, MEET, 1.8, 1 - seg(lt, sn + 0.3, sn + 0.8)); bigText('SNAP!', 820, 330, 120, C.yellow, -0.12, pop(lt, sn, 0.18)); }
        K.tag('GUT WALLS', 260, 330, 400, MEET - 20, 52, pop(lt, wl));
        K.pill('2 LOOPS', 540, 160, 56, C.ink, C.white, pop(lt, tw));
      } });
    cue(st, 'whoosh'); cue(st + sn, 'slam', { gain: 0.8 }); cue(st + wl, 'pop', { gain: 0.5 });
  }

  // ── 7 · pinching the tissue between them ───────────────────────────────
  {
    const st = cut(6), ti = Wd('tissue', 6) - st;
    add({ id: 'S07', at: st, cam: [540, MEET], zoom: 0.22, note: 'push in on the pinch: red dashed ring, squeezed tissue darkens on "tissue", PINCHED tag',
      draw(lt, d, t) {
        plain();
        stuckPair(t, 1, 1);
        ctx.save(); ctx.globalAlpha = eo(seg(lt, ti, ti + 0.4)); ctx.beginPath(); ctx.ellipse(540, MEET, 190, 26, 0, 0, Math.PI * 2); ctx.fillStyle = C.stomachBg; ctx.fill(); ctx.restore();
        K.barMagnet(540, MEET - 36, 1.15, 0); K.barMagnet(540, MEET + 36, 1.15, 0, { flip: true });
        K.pinchRing(540, MEET, 210, 90, 0.5 + 0.5 * Math.sin(lt * 9), eo(seg(lt, 0.05, 0.35)));
        K.tag('PINCHED', 820, 420, 680, MEET - 50, 54, pop(lt, 0.15));
      } });
    cue(st, 'whoosh'); cue(st + 0.15, 'pop', { gain: 0.5 }); cue(st + ti, 'alarm', { dur: 1.2, gain: 0.35 });
  }
  {
    const st = at('until', 6), ho = Wd('holes', 6) - st, bl = Wd('blockages', 6) - st;
    add({ id: 'S07b', at: st, cam: [540, 700], zoom: 0.06, note: 'same pinch, warning triangle + HOLES pill on "holes", BLOCKAGE pill on "blockages" (flat, no gore)',
      draw(lt, d, t) {
        plain();
        stuckPair(t, 1, 1);
        K.pinchRing(540, MEET, 210, 90, 0.5 + 0.5 * Math.sin(lt * 9), 1);
        K.warning(540, 330, pop(lt, ho) * 0.6);
        K.pill('HOLES', 300, 1170, 58, C.red, C.white, pop(lt, ho));
        K.pill('BLOCKAGE', 760, 1170, 58, C.red, C.white, pop(lt, bl));
      } });
    cue(st, 'whoosh'); cue(st + ho, 'thud', { gain: 0.7 }); cue(st + bl, 'thud', { gain: 0.7 });
  }

  // ── 8 · it might feel like nothing, or a stomach bug ───────────────────
  {
    const st = cut(7), no = Wd('nothing', 7) - st, sb = Wd('stomach', 7) - st;
    add({ id: 'S08', at: st, cam: [480, 760], zoom: 0.08, note: 'room, hero rubs his belly; shrug face on "nothing", frown + ache swirls + STOMACH BUG? on "stomach"',
      draw(lt, d, t) {
        K.room();
        const p = eio(seg(lt, 0, 0.35)), rub = Math.sin(lt * 8) * 22 * p;
        const pose = K.armPose(K.ARM.down, { e: K.ARM.belly.e, h: [K.ARM.belly.h[0] + rub, K.ARM.belly.h[1]] }, p);
        const bug = lt > sb;
        K.man({ x: 430, y: 1000, s: 1.5, arm: pose, eyes: 'n', look: 0, mouth: bug ? 'o' : 'flat', brow: lt > no && !bug ? 0.7 : 0.2, frown: bug });
        K.ache(450, 1130, t, bug ? eo(seg(lt, sb, sb + 0.3)) : 0);
        K.pill('STOMACH BUG?', 540, 230, 58, C.ink, C.white, pop(lt, sb));
      } });
    cue(st, 'whoosh'); cue(st + sb, 'pop', { gain: 0.5 });
  }

  // ── 9 · so see a doctor right away ─────────────────────────────────────
  {
    const st = cut(8), dr = Wd('doctor', 8) - st, aw = Wd('away', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.1, note: 'doctor\'s clipboard with red cross drops in, SEE A DOCTOR pill on "doctor", pulses on "away"',
      draw(lt) {
        plain();
        const p = eob(seg(lt, 0, 0.35));
        K.clipboard(540, lerp(-400, 680, p), 1.05, seg(lt, 0.3, 1.2), lerp(-0.3, 0.04, p));
        const beat = lt > aw ? 1 + 0.08 * Math.sin((lt - aw) * 16) * (1 - seg(lt, aw, aw + 0.5)) : 1;
        K.pill('SEE A DOCTOR', 540, 1150, 66, C.red, C.white, pop(lt, dr) * beat);
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'thud', { gain: 0.6 }); cue(st + dr, 'pop', { gain: 0.6 });
  }

  // ── 10 · an X-ray counts them ──────────────────────────────────────────
  const fgut = K.makeGut({ L: 270, R: 810, r: 90, y0: 420, rows: 5 });
  {
    const st = cut(9), xr = Wd('x-ray', 9) - st, co = Wd('counts', 9) - st;
    const [bx, by] = fgut.at(0.56);
    add({ id: 'S10', at: st, cam: [bx, by], zoom: 0.1, note: 'lightbox x-ray film: faint gut, one white blob; X-RAY pill on "X-ray", yellow ring + "?" on "counts"',
      draw(lt, d, t) {
        plain();
        K.lightbox(90, 230, 900, 1000, t, () => { fgut.draw({ ghost: 1 }); K.barMagnet(bx, by, 0.7, 0, { xr: true }); });
        K.pill('X-RAY', 540, 230, 56, C.ink, C.white, pop(lt, xr));
        if (lt > co) {
          ctx.save(); ctx.globalAlpha = eo(seg(lt, co, co + 0.25)); ctx.beginPath(); ctx.arc(bx, by, 110 + 8 * Math.sin(lt * 9), 0, Math.PI * 2);
          ctx.strokeStyle = C.yellow; ctx.lineWidth = 12; ctx.stroke(); ctx.restore();
          bigText('?', bx + 150, by - 120, 150, C.yellow, 0.15, pop(lt, co));
        }
      } });
    cue(st, 'whoosh'); cue(st + xr, 'tock'); cue(st + co, 'pop', { gain: 0.5 });
  }
  // ── 10b · two stuck together can look like one ─────────────────────────
  {
    const st = at('because', 9), tw = Wd('two', 9) - st, on = Wd('one', 9) - st;
    add({ id: 'S10b', at: st, cam: [540, 700], zoom: 0.06, note: 'split: left x-ray film shows one blob ("1?" on "one"), right card shows the real two magnets stuck ("2" on "two")',
      draw(lt, d, t) {
        plain();
        K.lightbox(40, 300, 490, 760, t, () => { K.barMagnet(285, 640, 1.3, 0, { xr: true }); K.barMagnet(285, 640 + 52, 1.3, 0, { xr: true }); });
        rr(550, 300, 490, 760, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
        const sn = eo(seg(lt, tw - 0.2, tw + 0.1));
        K.barMagnet(795, lerp(560, 640, sn), 1.3, 0); K.barMagnet(795, lerp(780, 640 + 82, sn), 1.3, 0, { flip: true });
        K.pill('FILM', 285, 300, 48, C.ink, C.white, 1);
        K.pill('REAL', 795, 300, 48, C.ink, C.white, 1);
        bigText('2', 795, 920, 170, C.yellow, 0.08, pop(lt, tw));
        bigText('1?', 285, 920, 170, C.yellow, -0.08 + (lt > on + 0.3 ? Math.sin((lt - on) * 9) * 0.06 : 0), pop(lt, on) * (lt > on + 0.3 ? 1 + 0.05 * Math.sin((lt - on) * 12) : 1));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'thud', { gain: 0.6 }); cue(st + on, 'boing', { gain: 0.5 });
  }

  // ── 11 · one gets watched, two can mean surgery ────────────────────────
  {
    const st = at('magnet', 10), on = Wd('one', 10) - st, wa = Wd('watched', 10) - st, tw = Wd('two', 10) - st, su = Wd('surgery', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.06, note: 'split: left 1 magnet + stopwatch + WATCHED (ink) on "watched"; right 2 stuck magnets on "two", warning + red SURGERY on "surgery"',
      draw(lt) {
        plain();
        line([[540, 260], [540, 1200]], C.gumEdge, 8);
        K.barMagnet(270, 1000, 1.6 * pop(lt, on), 0);
        if (lt > wa - 0.1) K.stopwatch(270, 640, 0.55 * pop(lt, wa - 0.1), lt * 4);
        K.pill('WATCHED', 270, 1160, 56, C.ink, C.white, pop(lt, wa));
        const p2 = pop(lt, tw);
        if (p2 > 0) { K.barMagnet(810, 1000 - 48 * p2, 1.6 * p2, 0); K.barMagnet(810, 1000 + 48 * p2, 1.6 * p2, 0, { flip: true }); }
        K.warning(810, 640, 0.9 * pop(lt, su));
        K.pill('SURGERY', 810, 1160, 56, C.red, C.white, pop(lt, su));
      } });
    cue(st, 'whoosh'); cue(st + wa, 'tock', { gain: 0.6 }); cue(st + su, 'slam', { gain: 0.6 });
  }

  // ── 12 · NEXT: hold your pee → bladder balloon, BODY FILES badge ───────
  {
    const st = cut(11), nx = Wd('next', 11) - st, wh = Wd('what', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 700], zoom: 0.08, note: 'room, BODY FILES badge (no number) on "next", hero looks at a small bladder balloon that floats in on "what", "?"',
      draw(lt, d, t) {
        K.room(); ctx.fillStyle = C.bg; ctx.fillRect(590, 220, 380, 460);   // no window: keeps ureters + NEXT clean
        K.filesBadge('BODY FILES', 540, 130, 44, pop(lt, nx));
        K.man({ x: 300, y: 1250, s: 1.3, look: 1, eyes: 'n', brow: lt > wh ? 0.8 : 0.2, mouth: 'flat' });
        if (lt > wh - 0.3) { const p = eo(seg(lt, wh - 0.3, wh + 0.1)); K.bladder(lerp(1400, 720, p), 780 + Math.sin(t * 2) * 10, 1, 0.25, { t }); }
        bigText('?', 470, 540, 150, C.yellow, 0.15, pop(lt, wh + 0.2));
      } });
    cue(st, 'whoosh'); cue(st + nx, 'thud', { gain: 0.6 }); cue(st + wh - 0.3, 'slide', { dur: 0.4, gain: 0.45 });
  }
  {
    const st = at('hold', 11), pe = Wd('pee', 11) - st, ba = Wd('balloons', 11) - st;
    add({ id: 'S12b', at: st, cam: [600, 700], zoom: 0.04, note: 'bladder balloon inflates from "pee" to "balloons" (boing), NEXT pill + FOLLOW pill; hero just watches',
      draw(lt, d, t) {
        K.room(); ctx.fillStyle = C.bg; ctx.fillRect(590, 220, 380, 460);   // no window: keeps ureters + NEXT clean
        K.filesBadge('BODY FILES', 540, 130, 44, 1);
        const fill = lerp(0.25, 0.95, eio(seg(lt, pe, ba + 0.1)));
        const big = lt > ba;
        K.man({ x: 300, y: 1250, s: 1.3, look: 1, eyes: big ? 'wide' : 'n', brow: big ? 1 : 0.5, mouth: big ? 'o' : 'flat' });
        K.bladder(720, 780 + Math.sin(t * 2) * 10, 1, fill, { t, wob: big ? 1 - seg(lt, ba + 0.4, ba + 1.2) : 0 });
        K.pill('NEXT', 900, 330, 56, C.yellow, C.ink, pop(lt, 0.1));
        K.followPill(760, 1170, pop(lt, ba + 0.4), t);
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.5 }); cue(st + ba, 'boing', { gain: 0.6 }); cue(st + ba + 0.4, 'pop', { gain: 0.5 });
  }

  return { shots: S, cues: CUES };
}
