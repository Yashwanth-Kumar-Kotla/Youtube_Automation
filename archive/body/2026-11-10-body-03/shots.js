// WHAT HAPPENS IF YOUR HICCUPS WON'T STOP?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Tone: curious, a little comic, true story. The hero hiccups in K.home(); the mechanism is a clean x-ray (lungs + the
// dome diaphragm) and a macro of the vocal cords. Charles Osborne (1922) is a 1920s farmer (K.farmer) on a simple farm
// (K.farmBg) with a cartoon hog: he lifts it, plops down on his bottom (no injury), then HIC! at a steady rate.
// No home cures are shown. The tease (brain freeze) is a slushie cup + a frosty brain + NEXT; the hero only watches.
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
  const floor = () => { plain(); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1150, W + 600, 900); };
  const pop = (lt, a, d = 0.3) => (lt > a ? eob(seg(lt, a, a + d)) : 0);
  const out = (lt, a, d = 0.25) => 1 - eio(seg(lt, a, a + d));
  // hiccup beats: j = body jolt (1 on the beat, gone 0.3 s later), b = index of the last beat
  const hicAt = (lt, beats) => { let j = 0, b = -1; beats.forEach((h, i) => { if (lt > h) { j = Math.max(j, 1 - seg(lt, h + 0.05, h + 0.3)); b = i; } }); return { j: Math.max(0, j), b }; };
  // the HIC! bubble of the last beat: pops at the beat, fades out 0.45-0.65 s later (never hangs)
  const hicB = (lt, beats, b, P, s = 0.8) => {
    if (b < 0) return; const h = beats[b], [x, y] = P[b % P.length];
    K.hicBubble(x, y, s, pop(lt, h, 0.2), 1 - seg(lt, h + 0.45, h + 0.65), b % 2 ? 0.12 : -0.12);
  };
  const hicCues = (st, beats, g = 0.4) => beats.forEach((h) => cue(st + h, 'boing', { gain: g }));
  const HERO = { x: 330, y: 1000, s: 1.2 };                    // the hero's spot in the room (left of the window)
  const hero = (o) => K.man({ ...HERO, ...o });
  const CH = { x: 380, y: 650, s: 0.8 };                       // Charles, wide on the farm (feet on the grass ≈ 1146)
  const SIT_Y = 1146 - 394 * CH.s;                             // his y when sitting (boots on the same ground line)

  // ── 1 · HOOK: hero in his room, hands on his chest, HIC! from frame 0; eyes wide on "hiccups", worried "?" on "stop" ──
  {
    const st = 0, hi = Wd('hiccups', 0), sp = Wd('stop', 0);
    const beats = [0.12, 0.8, 1.45, 2.1];
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.1, note: 'room: hero (hands on chest) jolts with a HIC! bubble from 0.12 s and every ~0.65 s; annoyed, eyes wide on "hiccups"; worried "o" + yellow ? on "stop"',
      draw(lt) {
        K.home();
        const { j, b } = hicAt(lt, beats);
        const s = 1.3, wide = lt > hi;
        K.man({ x: 400, y: 1060 - j * 30, s, arm: K.ARM.chest, armL: K.ARM.chest, eyes: j > 0.4 || wide ? 'wide' : 'n',
          mouth: j > 0.4 || lt > sp ? 'o' : 'flat', brow: lt > sp ? 1 : wide ? 0.7 : 0.3, frown: !wide });
        hicB(lt, beats, b, [[790, 430], [770, 650]], 0.9);
        bigText('?', 860, 930, 150, C.yellow, 0.12, pop(lt, sp, 0.25));
      } });
    cue(0.05, 'whoosh', { gain: 0.5 }); hicCues(st, beats, 0.45); cue(sp, 'pop', { gain: 0.5 });
  }

  // ── 2 · One man hiccuped for 68 years straight: Charles on his farm, HIC! beats; 68 YEARS calendar on "sixty-eight" ──
  {
    const st = cut(1), mn = Wd('man', 1) - st, sx = Wd('sixty', 1) - st, ye = Wd('years', 1) - st;
    const beats = [0.2, 0.82, 1.44, 2.06];
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.07, note: 'farm: Charles (1920s farmer: flat cap, overalls, mustache) hiccups with HIC! bubbles; he looks up on "man"; calendar 68 YEARS drops on "sixty-eight"; tired eyelids on "years"',
      draw(lt, d, t) {
        K.farmBg(t);
        const { j, b } = hicAt(lt, beats);
        K.farmer({ x: 330, y: 900 - j * 24, s: 0.95, eyes: j > 0.4 ? 'wide' : 'n', mouth: j > 0.4 ? 'o' : 'flat', frown: true, brow: lt > mn ? 0.5 : 0.2,
          look: lt > mn ? 1 : 0, tired: lt > ye ? eo(seg(lt, ye, ye + 0.4)) * 0.7 : 0, arm: K.ARM.chest });
        hicB(lt, beats, b, [[570, 400], [120, 420]], 0.7);
        if (lt > sx - 0.3) { const p = eob(seg(lt, sx - 0.3, sx + 0.1)); K.calendar(820, lerp(-400, 580, p), 0.5, '68', 'YEARS', lerp(-0.3, 0.05, p)); }
      } });
    cue(st, 'whoosh'); hicCues(st, beats, 0.4); cue(st + sx + 0.1, 'thud');
  }

  // ── 3 · So where does the hic even come from? thinking pose + ? on "where"; HIC! on "hic"; red arrow to the chest ──
  {
    const st = cut(2), wh = Wd('where', 2) - st, hc = Wd('hic', 2) - st, fr = Wd('from', 2) - st;
    add({ id: 'S03', at: st, cam: [520, 800], zoom: 0.08, note: 'room: hero puts a finger to his chin + yellow ? on "where"; jolts with a HIC! bubble on "hic"; red arrow points at his chest on "from"',
      draw(lt) {
        K.home();
        const { j } = hicAt(lt, [hc]);
        K.man({ x: 380, y: 1040 - j * 30, s: 1.3, arm: K.armPose(K.ARM.chest, K.ARM.chin, eio(seg(lt, wh - 0.2, wh + 0.15))), armL: K.ARM.chest,
          eyes: j > 0.4 ? 'wide' : 'n', mouth: j > 0.4 ? 'o' : 'flat', brow: lt > wh ? 0.8 : 0.4, look: lt > fr ? 1 : 0 });
        bigText('?', 800, 420, 160, C.yellow, 0.12, pop(lt, wh, 0.25));
        if (lt > hc) K.hicBubble(780, 700, 0.85, pop(lt, hc, 0.2), 1 - seg(lt, hc + 0.5, hc + 0.7), -0.12);
        K.arrow(lerp(760, 720, Math.sin(lt * 9) * 0.5 + 0.5), 1000, 280, Math.PI, eo(seg(lt, fr, fr + 0.2)));
      } });
    cue(st, 'whoosh'); cue(st + wh, 'pop', { gain: 0.5 }); cue(st + hc, 'boing', { gain: 0.5 }); cue(st + fr, 'slide', { dur: 0.3, gain: 0.4 });
  }

  // ── 4 · x-ray: diaphragm glows on "diaphragm", ring round the lungs on "lungs", the dome snaps down on "spasms" ──
  const XR = { x: 540, y: 940, s: 1.25 };
  {
    const st = cut(3), di = Wd('diaphragm', 3) - st, lu = Wd('lungs', 3) - st, su = Wd('suddenly', 3) - st, spz = Wd('spasms', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 900], zoom: 0.08, note: 'x-ray hero (whole body x-ray, head normal): pink lungs + the dome diaphragm under them; diaphragm glows yellow on "diaphragm"; yellow ring draws round the lungs on "lungs" and fades on "suddenly"; on "spasms" the dome snaps down with red shock strokes, surprised face',
      draw(lt, d, t) {
        K.xray(t);
        const sn = lt > spz ? eob(seg(lt, spz, spz + 0.12)) : 0, glow = lt > di ? eo(seg(lt, di, di + 0.3)) * (0.55 + 0.45 * Math.sin(lt * 7)) * out(lt, su, 0.3) : 0;
        K.man({ ...XR, y: XR.y - (lt > spz ? 22 * (1 - seg(lt, spz + 0.05, spz + 0.35)) : 0), xray: true, dia: sn, diaHi: glow,
          eyes: lt > spz ? 'wide' : 'n', mouth: lt > spz ? 'o' : 'smile', brow: lt > spz ? 1 : 0.4 });
        if (lt > lu) {
          const k = eo(seg(lt, lu, lu + 0.35)), a = out(lt, su, 0.3);
          ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.ellipse(XR.x, XR.y - 40 * XR.s, 205, 190, 0, -Math.PI / 2, -Math.PI / 2 + TAU * k);
          ctx.strokeStyle = C.ink; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.stroke(); ctx.strokeStyle = C.yellow; ctx.lineWidth = 12; ctx.stroke(); ctx.restore();
        }
        if (lt > spz) for (const sd of [-1, 1]) { ctx.save(); ctx.globalAlpha = 1 - seg(lt, spz + 0.5, spz + 0.8); K.shockLines(XR.x + sd * 230, XR.y + 120 * XR.s, 30, 1); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + di, 'sparkle', { dur: 0.6, gain: 0.4 }); cue(st + lu, 'pop', { gain: 0.5 }); cue(st + spz, 'slam', { gain: 0.7 });
  }

  // ── 5a · air rushes in: blue air arrows pour in at the mouth and down the windpipe; yellow ring at the throat on "vocal" ──
  {
    const st = cut(4), ru = Wd('rushes', 4) - st, vo = Wd('vocal', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.1, note: 'same x-ray hero, diaphragm held down; on "rushes" pale-blue air arrows rush in at the mouth and down the windpipe into the lungs; yellow ring circles the throat on "vocal"',
      draw(lt, d, t) {
        K.xray(t);
        K.man({ ...XR, xray: true, dia: 1, eyes: 'wide', mouth: 'o', brow: 0.9 });
        if (lt > ru) {
          const a0 = eo(seg(lt, ru, ru + 0.2));
          for (let i = 0; i < 2; i++) { const ph = ((lt - ru) * 1.8 + i / 2) % 1; K.flowArrow(lerp(900, 700, ph), XR.y - 272 * XR.s + 10, 150, Math.PI, a0 * Math.sin(ph * Math.PI), C.sky, 20); }
          for (let i = 0; i < 2; i++) { const ph = ((lt - ru) * 1.6 + i / 2) % 1; K.flowArrow(XR.x, lerp(XR.y - 200 * XR.s, XR.y - 60 * XR.s, ph), 110, Math.PI / 2, a0 * Math.sin(ph * Math.PI), C.sky, 18); }
        }
        if (lt > vo) {
          const k = eo(seg(lt, vo, vo + 0.25));
          ctx.save(); ctx.beginPath(); ctx.ellipse(XR.x, XR.y - 222 * XR.s, 92, 50, 0, -Math.PI / 2, -Math.PI / 2 + TAU * k);
          ctx.strokeStyle = C.ink; ctx.lineWidth = 20; ctx.lineCap = 'round'; ctx.stroke(); ctx.strokeStyle = C.yellow; ctx.lineWidth = 11; ctx.stroke(); ctx.restore();
        }
      } });
    cue(st, 'whoosh'); cue(st + ru, 'slide', { dur: 0.9, gain: 0.5 }); cue(st + vo, 'pop', { gain: 0.5 });
  }
  // ── 5b · vocal cords snap shut. HIC! (macro lens, top view of the cords) ─────────────────────────────────────────
  {
    const st = at('cords', 4), co = Wd('cords', 4) - st, sn = Wd('snap', 4) - st, sh = Wd('shut', 4) - st, hc = Wd('hic', 4) - st;
    const LX = 540, LY = 720;
    add({ id: 'S05b', at: st, cam: [540, 700], zoom: 0.08, note: 'macro lens on the vocal cords (top view, pink ring, two pale folds); VOCAL CORDS label on "cords"; blue air chevrons sink into the open gap; folds snap shut on "snap", press on "shut"; big HIC! bubble + yellow burst + lens shake on "Hic!"',
      draw(lt, d, t) {
        plain();
        const shake = lt > hc ? Math.sin(lt * 80) * 14 * Math.max(0, 1 - (lt - hc) * 3) : 0;
        ctx.save(); ctx.translate(shake, 0);
        ctx.beginPath(); ctx.arc(LX, LY, 392, 0, TAU); ctx.fillStyle = C.ink; ctx.fill();
        ctx.save(); ctx.beginPath(); ctx.arc(LX, LY, 374, 0, TAU); ctx.clip(); ctx.fillStyle = C.stomachBg; ctx.fillRect(LX - 400, LY - 400, 800, 800);
        const cl = lt > sn ? eo(seg(lt, sn, sn + 0.14)) : 0;
        K.vocalCords(LX, LY, 1.0 + (lt > sh ? 0.03 * Math.sin(seg(lt, sh, sh + 0.3) * Math.PI) : 0), cl);
        for (let i = 0; i < 4; i++) {                             // air chevrons sinking into the gap (they stop when it shuts)
          const ph = (lt * 1.3 + i / 4) % 1, a = Math.sin(ph * Math.PI) * (1 - seg(lt, sn, sn + 0.12)), sc = lerp(1.2, 0.3, ph);
          if (a <= 0.01) continue;
          ctx.save(); ctx.globalAlpha = a; ctx.translate(LX, LY - 300 + ph * 300); ctx.scale(sc, sc);
          ctx.beginPath(); ctx.moveTo(-50, -20); ctx.lineTo(0, 20); ctx.lineTo(50, -20); ctx.strokeStyle = C.sky; ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
        }
        ctx.restore();
        ctx.restore();
        K.pill('VOCAL CORDS', LX, 250, 52, C.ink, C.white, pop(lt, co));
        if (lt > hc) { K.burst(LX, LY, 3.2, 1 - seg(lt, hc + 0.2, hc + 0.5)); K.hicBubble(LX, LY, 1.5, pop(lt, hc, 0.2), 1, -0.08); }
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + sn, 'slam', { gain: 0.6 }); cue(st + sh, 'thud', { gain: 0.4 }); cue(st + hc, 'boing', { gain: 0.8 }); cue(st + hc + 0.02, 'pop', { gain: 0.6 });
  }

  // ── 6 · Most bouts fade within minutes: stopwatch ticks fast, HIC! bubbles shrink away, hero relaxes on "minutes" ──
  {
    const st = cut(5), fa = Wd('fade', 5) - st, mi = Wd('minutes', 5) - st;
    const beats = [0.1, 0.62];
    add({ id: 'S06', at: st, cam: [560, 760], zoom: 0.06, note: 'room: stopwatch (red hand sweeping fast) on the right; hero gives two weaker hiccups, the second HIC! bubble shrinks and fades on "fade"; hero relieved smile on "minutes"',
      draw(lt) {
        K.home();
        const { j, b } = hicAt(lt, beats), weak = b === 1 ? 0.5 : 1;
        hero({ y: HERO.y - j * 24 * weak, arm: K.ARM.chest, armL: K.ARM.chest, eyes: j > 0.5 ? 'wide' : lt > mi ? 'closed' : 'n',
          mouth: j > 0.5 ? 'o' : lt > mi ? 'smile' : 'flat', brow: lt > mi ? 0.3 : 0.6 });
        if (b >= 0) { const h = beats[b], sz = b === 1 ? 0.55 : 0.8; K.hicBubble(b ? 600 : 590, b ? 640 : 440, sz, pop(lt, h, 0.2), 1 - seg(lt, Math.max(h + 0.4, b ? fa : 0), Math.max(h + 0.6, b ? fa + 0.3 : 0)), b ? 0.12 : -0.12); }
        K.stopwatch(820, 600, 0.42 * eob(seg(lt, 0, 0.3)), lt * 5);
      } });
    cue(st, 'whoosh'); cue(st + beats[0], 'boing', { gain: 0.4 }); cue(st + beats[1], 'boing', { gain: 0.25 }); cue(st + 0.2, 'tock', { gain: 0.35 }); cue(st + 0.7, 'tock', { gain: 0.35 }); cue(st + mi, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 7 · but past two days: 2 DAYS calendar on "two"; doctor badge on "doctors"; PERSISTENT stamp on "persistent" ──
  {
    const st = cut(6), tw = Wd('two', 6) - st, dc = Wd('doctors', 6) - st, pe = Wd('persistent', 6) - st;
    const beats = [0.15, 0.95, 1.75, 2.55];
    add({ id: 'S07', at: st, cam: [560, 720], zoom: 0.06, note: 'room: hero (left) still hiccuping, worried; calendar 2 DAYS drops on "two"; calm doctor badge pops on "doctors"; red PERSISTENT stamp slams on "persistent"',
      draw(lt) {
        K.home();
        const { j, b } = hicAt(lt, beats);
        K.man({ x: 280, y: 1000 - j * 22, s: 1.0, arm: K.ARM.chest, armL: K.ARM.chest, eyes: j > 0.4 || lt > pe ? 'wide' : 'n', mouth: j > 0.4 || lt > pe ? 'o' : 'flat', brow: lt > tw ? 0.9 : 0.5, look: lt > tw ? 1 : 0 });
        hicB(lt, beats, b, [[520, 400], [110, 430]], 0.6);
        if (lt > tw - 0.3) { const p = eob(seg(lt, tw - 0.3, tw + 0.1)); K.calendar(780, lerp(-400, 460, p), 0.46, '2', 'DAYS', lerp(-0.3, 0.05, p)); }
        K.doctorBadge(780, 760, 0.7, pop(lt, dc));
        K.stamp('PERSISTENT', 760, 1010, 58, -0.08, lt > pe ? lerp(1.6, 1, eo(seg(lt, pe, pe + 0.18))) : 0);
      } });
    cue(st, 'whoosh'); hicCues(st, beats, 0.3); cue(st + tw + 0.1, 'thud'); cue(st + dc, 'pop', { gain: 0.6 }); cue(st + pe + 0.1, 'slam', { gain: 0.7 });
  }

  // ── 8a · In 1922: an old-timey farm, a hog trots in; JUNE 1922 pill on "nineteen" ─────────────────────────────────
  {
    const st = cut(7), ni = Wd('nineteen', 7) - st;
    add({ id: 'S08', at: st, cam: [560, 760], zoom: 0.08, note: 'farm (barn, fence, field): a cartoon hog trots in from the left and stops, happy; JUNE 1922 pill pops on "nineteen"',
      draw(lt, d, t) {
        K.farmBg(t);
        const w = eo(seg(lt, 0, 0.9));
        K.hog(lerp(-200, 600, w), 1040 - Math.abs(Math.sin(lt * 14)) * 10 * (1 - w), 0.7, { t, kick: 1 - w });
        K.pill('JUNE 1922', 540, 300, 64, C.ink, C.white, pop(lt, ni));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 0.8, gain: 0.4 }); cue(st + ni, 'pop', { gain: 0.6 });
  }
  // ── 8b · Charles Osborne picked up a hog: he waves on "Charles", lifts the hog on "picked", it squirms on "hog" ─────
  const HOG0 = [650, 1060];
  {
    const st = at('charles', 7), chs = Wd('charles', 7) - st, pk = Wd('picked', 7) - st, hg = Wd('hog', 7) - st;
    add({ id: 'S08b', at: st, cam: [480, 760], zoom: 0.1, note: 'farm: Charles (1920s farmer) waves with a smile on "Charles"; on "picked" he scoops the hog up to his chest (hog drawn over his hands); on "hog" the hog\'s eyes go wide and its legs wiggle, Charles\' brows go up',
      draw(lt, d, t) {
        K.farmBg(t);
        const wv = eio(seg(lt, chs, chs + 0.3)) * (1 - eio(seg(lt, pk - 0.45, pk - 0.15)));
        const lift = eio(seg(lt, pk, pk + 0.4));
        const arm = lt < pk ? K.armPose(K.ARM.down, K.ARM.wave, wv) : K.armPose(K.ARM.down, K.ARM.carry, lift);
        const armL = K.armPose(K.ARM.down, K.ARM.carry, lift);
        const sq = lt > hg;
        K.farmer({ ...CH, arm, armL, eyes: sq ? 'wide' : 'n', mouth: sq ? 'o' : lt > pk ? 'flat' : 'smile', brow: sq ? 1 : 0.5 });
        const hx = lerp(HOG0[0], CH.x + 10, lift), hy = lerp(HOG0[1], CH.y - 20, lift) - Math.sin(lift * Math.PI) * 60;
        K.hog(hx, hy + (sq ? Math.sin(lt * 40) * 4 : 0), 0.6, { t, kick: sq ? 1 : 0, wide: sq, happy: !sq, rot: sq ? Math.sin(lt * 25) * 0.05 : 0 });
      } });
    cue(st, 'whoosh'); cue(st + chs, 'pop', { gain: 0.4 }); cue(st + pk, 'slide', { dur: 0.4, gain: 0.4 }); cue(st + hg, 'boing', { gain: 0.4 });
  }

  // ── 9a · fell, and started hiccuping: he plops onto his bottom (dust puff, no injury), the hog hops free; HIC! ──────
  {
    const st = cut(8), fe = Wd('fell', 8) - st, hc = Wd('hiccuping', 8) - st;
    const beats = [hc, hc + 0.5];
    add({ id: 'S09', at: st, cam: [520, 780], zoom: 0.08, note: 'farm: on "fell" Charles plops down to sitting (comic, soft dust puff, no injury), the hog hops out to the right and lands happy; on "hiccuping" his first HIC! jolt + bubble, surprised face',
      draw(lt, d, t) {
        K.farmBg(t);
        const f = eio(seg(lt, fe - 0.05, fe + 0.25)), sat = f > 0.6, { j, b } = hicAt(lt, beats);
        const y = sat ? SIT_Y : lerp(CH.y, CH.y + 80, f);
        const dz = lt > fe + 0.2 && lt < fe + 0.6;
        K.farmer({ ...CH, y: y - j * 18, sit: sat, rot: 0, arm: sat ? K.ARM.down : K.ARM.carry, armL: sat ? K.ARM.down : K.ARM.carry,
          eyes: dz ? 'squeeze' : j > 0.3 || lt > hc ? 'wide' : 'n', mouth: j > 0.3 ? 'o' : dz ? 'flat' : lt > fe + 0.6 ? 'o' : 'flat', brow: lt > hc ? 1 : 0.6 });
        if (lt > fe + 0.18 && lt < fe + 1.0) K.fumes(CH.x, 1110, t, 0.6 * (1 - seg(lt, fe + 0.5, fe + 1.0)));
        // the hog: from his arms, hops right in an arc, lands, trots in place happily
        const hp = eo(seg(lt, fe, fe + 0.55));
        const hx = lerp(CH.x + 10, 820, hp), hy = lerp(CH.y - 20, 1060, hp) - Math.sin(hp * Math.PI) * 180;
        K.hog(hx, hy, 0.6, { t, kick: hp < 1 ? 1 : 0.3, wide: hp < 0.9, happy: hp >= 0.9, rot: lerp(-0.3, 0, hp) });
        hicB(lt, beats, b, [[590, 470], [600, 600]], 0.75);
      } });
    cue(st, 'whoosh'); cue(st + fe + 0.22, 'thud', { gain: 0.8 }); cue(st + fe + 0.25, 'boing', { gain: 0.4 }); cue(st + fe + 0.55, 'thud', { gain: 0.4 }); hicCues(st, beats, 0.5);
  }
  // ── 9b · twenty to forty times a minute: steady HIC! beats; the dial reads 20 on "twenty", 20-40 on "forty", PER MIN on "minute" ──
  {
    const st = at('twenty', 8), tw = Wd('twenty', 8) - st, fo = Wd('forty', 8) - st, mi = Wd('minute', 8) - st;
    const beats = [0.1, 0.52, 0.94, 1.36];
    add({ id: 'S09b', at: st, cam: [540, 700], zoom: 0.07, note: 'farm: Charles standing, fed up, a HIC! jolt + bubble every 0.42 s; a hiccup dial (red dot running round) shows 20 on "twenty", 20-40 on "forty", PER MIN on "minute"',
      draw(lt, d, t) {
        K.farmBg(t);
        const { j, b } = hicAt(lt, beats);
        K.farmer({ x: 330, y: 860 - j * 26, s: 1.0, arm: K.ARM.chest, armL: K.ARM.chest, eyes: j > 0.4 ? 'wide' : 'n', mouth: j > 0.4 ? 'o' : 'flat', frown: true, brow: 0.3 });
        hicB(lt, beats, b, [[570, 310], [120, 340]], 0.6);
        K.hicMeter(800, 590, 0.44, lt > fo ? '20-40' : lt > tw ? '20' : '', lt > mi ? 'PER MIN' : '', eob(seg(lt, 0, 0.25)), lt * 4);
      } });
    cue(st, 'whoosh'); hicCues(st, beats, 0.35); cue(st + tw, 'pop', { gain: 0.5 }); cue(st + fo, 'pop', { gain: 0.5 }); cue(st + mi, 'pop', { gain: 0.5 });
  }

  // ── 10 · Still, he married twice and had eight kids: rings on "married", x2 on "twice", eight kid icons on "eight" ──
  {
    const st = cut(9), ma = Wd('married', 9) - st, tw = Wd('twice', 9) - st, ei = Wd('eight', 9) - st;
    const beats = [0.3, 1.25];
    const KC = [C.shirt, C.yellow, C.leaf, C.pink, C.pot, C.sky, C.shirtShade, C.pinkDark];
    add({ id: 'S10', at: st, cam: [600, 720], zoom: 0.06, note: 'plain floor: Charles smiling (still the odd small HIC!); gold wedding rings pop on "married", x2 pill on "twice"; eight small kid icons pop in one by one from "eight"',
      draw(lt, d, t) {
        floor();
        const { j, b } = hicAt(lt, beats);
        K.farmer({ x: 260, y: 880 - j * 16, s: 0.95, arm: K.ARM.down, eyes: j > 0.4 ? 'wide' : 'n', mouth: j > 0.4 ? 'o' : 'grin', brow: 0.5, look: 1 });
        hicB(lt, beats, b, [[110, 330], [110, 330]], 0.5);
        K.weddingRings(680, 440, 0.95, pop(lt, ma));
        K.pill('×2', 945, 440, 64, C.yellow, C.ink, pop(lt, tw, 0.25));
        for (let i = 0; i < 8; i++) K.personIcon(540 + (i % 4) * 120, i < 4 ? 780 : 1040, 0.6, KC[i], pop(lt, ei + i * 0.045, 0.25));
      } });
    cue(st, 'whoosh'); hicCues(st, beats, 0.25); cue(st + ma, 'sparkle', { dur: 0.4, gain: 0.5 }); cue(st + tw, 'pop', { gain: 0.6 });
    for (let i = 0; i < 4; i++) cue(st + ei + i * 0.09, 'pop', { gain: 0.35 });
  }

  // ── 11a · Then in 1990: the calendar flips through the years and lands on 1990 on "ninety" ─────────────────────────
  {
    const st = cut(10), nt = Wd('ninety', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 680], zoom: 0.07, note: 'plain: big calendar flips year by year from 1922 and lands on 1990 on "ninety" with a bounce; HIC! bubble still pops beside it',
      draw(lt) {
        floor();
        const k = eio(seg(lt, 0.05, nt)), yr = Math.round(lerp(1922, 1990, k)), land = lt > nt ? Math.sin(seg(lt, nt, nt + 0.3) * Math.PI) * 0.06 : 0;
        K.calendar(540, 660, 0.82 * (1 + land), String(yr), '', Math.sin(yr * 1.7) * 0.03 * (1 - seg(lt, nt - 0.1, nt)));
        hicB(lt, [0.2], 0, [[910, 340]], 0.6);
      } });
    cue(st, 'whoosh');
    for (let i = 0; i < 6; i++) cue(st + 0.1 + i * 0.13, 'tock', { gain: 0.3 }); cue(st + nt, 'thud', { gain: 0.7 }); cue(st + 0.2, 'boing', { gain: 0.3 });
  }
  // ── 11b · they just stopped. Nobody knows why: the last HIC! pops away on "stopped", old Charles grins; ? on "why" ──
  {
    const st = at('they', 10), stp = Wd('stopped', 10) - st, nb = Wd('nobody', 10) - st, wy = Wd('why', 10) - st;
    add({ id: 'S11b', at: st, cam: [520, 720], zoom: 0.07, note: 'farm, 1990: Charles now grey-haired; one last HIC! jolt, the bubble shrinks away on "stopped"; he blinks, then a big relieved grin; on "why" a yellow ? pops and he looks up, puzzled-happy',
      draw(lt, d, t) {
        K.farmBg(t);
        const { j } = hicAt(lt, [0.04]);
        const surprised = lt > stp && lt < stp + 0.55;
        K.farmer({ x: 360, y: 900 - j * 22, s: 1.0, old: true, arm: K.armPose(K.ARM.down, K.ARM.hip, eio(seg(lt, nb, nb + 0.3))), armL: K.armPose(K.ARM.down, K.ARM.hip, eio(seg(lt, nb, nb + 0.3))),
          eyes: j > 0.4 || surprised ? 'wide' : 'n', mouth: j > 0.4 || surprised ? 'o' : lt > stp ? 'grin' : 'flat', brow: lt > wy ? 1 : 0.6, look: lt > wy ? 1 : 0 });
        if (lt < stp + 0.3) K.hicBubble(600, 400, 0.7 * (1 - eio(seg(lt, stp, stp + 0.25))), pop(lt, 0.04, 0.15), 1, -0.1);
        bigText('?', 790, 420, 190, C.yellow, 0.12, pop(lt, wy, 0.25) * (1 + 0.04 * Math.sin(lt * 6)));
      } });
    cue(st, 'whoosh'); cue(st + 0.04, 'boing', { gain: 0.4 }); cue(st + stp, 'zip', { gain: 0.5 }); cue(st + stp + 0.5, 'boing', { gain: 0.3 }); cue(st + wy, 'pop', { gain: 0.6 });
  }

  // ── 12a · Yours hit two days? See a doctor.: hero points at you on "Yours", 2 DAYS on "two", calm doctor badge on "doctor" ──
  {
    const st = cut(11), yo = Wd('yours', 11) - st, tw = Wd('two', 11) - st, dr = Wd('doctor', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 720], zoom: 0.06, note: 'room: hero points to camera (finger up) on "Yours", caring look; calendar 2 DAYS drops on "two"; calm doctor badge pops on "doctor", hero nods with a warm smile',
      draw(lt) {
        K.home();
        const nod = lt > dr ? Math.sin(seg(lt, dr, dr + 0.5) * Math.PI * 2) * 12 : 0;
        hero({ x: 330, y: 1000 + nod, s: 1.15, arm: K.armPose(K.ARM.down, K.ARM.point, eio(seg(lt, yo - 0.1, yo + 0.25))), finger: lt > yo ? 0 : null,
          eyes: 'n', mouth: lt > dr ? 'smile' : 'flat', brow: lt > dr ? 0.4 : 0.8 });
        if (lt > tw - 0.3) { const p = eob(seg(lt, tw - 0.3, tw + 0.1)); K.calendar(790, lerp(-400, 470, p), 0.46, '2', 'DAYS', lerp(-0.3, 0.05, p)); }
        K.doctorBadge(790, 840, 0.6, pop(lt, dr));
      } });
    cue(st, 'whoosh'); cue(st + yo, 'pop', { gain: 0.4 }); cue(st + tw + 0.1, 'thud'); cue(st + dr, 'pop', { gain: 0.6 });
  }
  // ── 12b · Don't wait sixty-eight years: close-up, finger wag on "Don't", 68 YEARS calendar on "sixty", wink on "years" ──
  {
    const st = at('don', 11), dn = Wd('don', 11) - st, sx = Wd('sixty', 11) - st, ye = Wd('years', 11) - st;
    add({ id: 'S12b', at: st, cam: [540, 700], zoom: 0.05, note: 'room close-up: hero wags his finger (friendly smirk) on "Don\'t"; small 68 YEARS calendar drops top-right on "sixty-eight"; he winks at camera with a grin on "years"',
      draw(lt) {
        K.home();
        const p = eio(seg(lt, 0, dn + 0.2));
        K.man({ x: 420, y: 1310, s: 1.7, arm: K.armPose(K.ARM.down, K.ARM.point, p), finger: lt > dn ? Math.sin(lt * 11) * 0.35 : 0,
          eyes: lt > ye ? 'wink' : 'n', mouth: lt > ye ? 'grin' : 'smirk', smirk: lt < ye, brow: 0.4 });
        if (lt > sx - 0.25) { const q = eob(seg(lt, sx - 0.25, sx + 0.1)); K.calendar(910, lerp(-300, 330, q), 0.34, '68', 'YEARS', lerp(-0.3, 0.06, q)); }
      } });
    cue(st, 'whoosh'); cue(st + dn, 'boing', { gain: 0.4 }); cue(st + sx + 0.05, 'thud', { gain: 0.6 }); cue(st + ye, 'pop', { gain: 0.5 });
  }

  // ── 13a · Next Body File: hero waves; BODY FILES badge (series name only) on "Next" ─────────────────────────────
  {
    const st = cut(12), nx = Wd('next', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 640], zoom: 0.05, note: 'room: BODY FILES badge (series name only) pops on "Next"; hero waves with a smile',
      draw(lt) {
        K.home();
        K.filesBadge('BODY FILES', 540, 150, 60, pop(lt, nx));
        hero({ arm: K.armPose(K.ARM.down, K.ARM.wave, eio(seg(lt, 0.05, 0.4))), mouth: 'smile', brow: 0.5 });
      } });
    cue(st, 'whoosh'); cue(st + nx, 'thud', { gain: 0.6 });
  }
  // ── 13b · what happens when you get brain freeze: slushie cup on "happens", frosty brain on "brain", frost badge + NEXT on "freeze" ──
  const BR = [820, 570], CUP = [810, 970], FB = [610, 400], BS = 0.52;
  {
    const st = at('what', 12), hp = Wd('happens', 12) - st, bn = Wd('brain', 12) - st, fz = Wd('freeze', 12) - st;
    add({ id: 'S13b', at: st, cam: [560, 640], zoom: 0.05, note: 'room: hero lowers his wave, looks right, curious; slushie cup pops on "happens" (on its own, nowhere near the hero); a cartoon brain with a snowy cap + icicles on "brain"; frost badge + yellow NEXT pill on "freeze"',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 150, 60, 1);
        hero({ arm: K.armPose(K.ARM.down, K.ARM.wave, 1 - eio(seg(lt, 0, 0.35))), look: 1, brow: lt > bn ? 0.9 : 0.6, mouth: lt > fz ? 'o' : 'smile' });
        K.slushCup(CUP[0], CUP[1], 0.55, pop(lt, hp), t);
        const bs = pop(lt, bn);
        if (bs > 0) { ctx.save(); ctx.translate(BR[0], BR[1]); ctx.scale(bs, bs); K.frostBrain(0, 0, BS, { t, frost: lt > fz ? 1 : 0.6 }); ctx.restore(); }
        K.frostBadge(FB[0], FB[1], 0.7, pop(lt, fz), t);
        K.pill('NEXT', BR[0], 300, 60, C.yellow, C.ink, pop(lt, fz + 0.05));
      } });
    cue(st, 'whoosh'); cue(st + hp, 'pop', { gain: 0.6 }); cue(st + bn, 'pop', { gain: 0.6 }); cue(st + fz, 'sparkle', { dur: 0.6, gain: 0.5 }); cue(st + fz + 0.05, 'thud', { gain: 0.5 });
  }

  // ── 14 · END CARD: and the tongue trick that helps it thaw: ? on "trick", the frost melts on "thaw", FOLLOW ──────
  {
    const st = cut(13), tr = Wd('trick', 13) - st, th = Wd('thaw', 13) - st;
    add({ id: 'S14', at: st, cam: [560, 640], zoom: 0.04, note: 'end card: BODY FILES badge, slushie cup, frosty brain + frost badge + NEXT stay; yellow ? pops on "trick" (the trick is not shown); the snow cap melts into drops on "thaw"; + FOLLOW pill after "thaw"; hero looks to camera with a warm smile',
      draw(lt, d, t) {
        K.home();
        K.filesBadge('BODY FILES', 540, 150, 60, 1);
        hero({ look: lt > th ? 0 : 1, brow: 0.6, mouth: lt > th ? 'grin' : 'smile' });
        K.slushCup(CUP[0], CUP[1], 0.55, 1, t);
        K.frostBrain(BR[0], BR[1], BS, { t, frost: 1, melt: lt > th ? seg(lt, th, th + 1.0) : 0 });
        K.frostBadge(FB[0], FB[1], 0.7, 1 - 0.3 * seg(lt, th, th + 0.6), t);
        K.pill('NEXT', BR[0], 300, 60, C.yellow, C.ink, 1);
        bigText('?', 600, 800, 140, C.yellow, 0.12, pop(lt, tr, 0.25) * (1 + 0.04 * Math.sin(lt * 6)));
        K.followPill(290, 330, pop(lt, th + 0.3), t, 60);
      } });
    cue(st, 'whoosh'); cue(st + tr, 'pop', { gain: 0.5 }); cue(st + th, 'sparkle', { dur: 0.8, gain: 0.4 }); cue(st + th + 0.3, 'pop', { gain: 0.6 });
  }

  return { shots: S, cues: CUES };
}
