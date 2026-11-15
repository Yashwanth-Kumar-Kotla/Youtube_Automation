// WHAT HAPPENS WHEN YOU GET A SUNBURN?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Real world = THE room (K.home, framed wider via roomAt, floor at y 1120) with the hero at right (man({ burn }) = sunburnt
// face + arms). Graphics on the plain cream background: sun + K.uvRay into K.skinCutLens (skin cutaway: top layer, living
// cells, dermis with a blood vessel), a skin cell with a K.dnaLadder that snaps, K.painChart, calendar + K.sunSkinLens,
// K.showerHead / K.aloePlant / glass, K.blisterBadge + K.frostBadge + phone/doctor. Tease (losing your voice): K.throatLens
// (lower face + neck cutaway with the voice box) + a "shh" whisper bubble + NEXT; the hero only watches.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, line } from './core/lib.js';
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
  const ringIn = (lt, a, d = 0.2) => (lt > a ? eo(seg(lt, a, a + d)) : 0);
  const scaled = (x, y, k, fn) => { if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); fn(); ctx.restore(); };
  // THE room, framed wider (camera pulled back): floor line at floorY, everything scaled k around x 540
  const roomAt = (floorY = 1120, k = 0.7) => {
    ctx.fillStyle = C.floor; ctx.fillRect(-300, -300, W + 600, H + 600);
    ctx.save(); ctx.translate(540, floorY); ctx.scale(k, k); ctx.translate(-540, -1560); K.home(); ctx.restore();
  };
  const HERO = { x: 830, y: 636, s: 0.78 };
  const hero = (o) => K.man({ ...HERO, ...o });
  const LBG = '#FFF1E0';
  const qMark = (t) => { ctx.save(); ctx.font = '900 230px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = 40; ctx.strokeStyle = C.ink;
    const k = 1 + 0.05 * Math.sin(t * 6); ctx.scale(k, k); ctx.strokeText('?', 0, 0); ctx.fillStyle = C.white; ctx.fillText('?', 0, 0); ctx.restore(); };
  const SL = [540, 680, 380];   // the big skin cutaway lens (graphic shots)
  const flakeTip = () => { const u = SL[2] / 300; return [SL[0] + 158 * u, SL[1] - 128 * u]; };   // free edge of the right flake once lifted

  // ── 1 · HOOK: sunburnt hero in the room; the sun-over-skin lens turns the skin pink ──
  {
    const sb = Wd('sunburn', 0);
    const TL = [300, 640, 210];
    add({ id: 'S01', at: 0, cam: [560, 660], zoom: 0.07, note: 'room: lens (left) with the sun over a patch of skin pops in and the skin turns pink by 0.5 s; hero (right) with sunburnt face + arms looks at it, worried; on "sunburn" both go deeper red, hero winces (eyes squeezed, "o") with a red pain zap at his arm',
      draw(lt, d, t) {
        roomAt();
        const burn = clamp(lerp(0.2, 0.75, eo(seg(lt, 0.05, 0.5))) + 0.25 * eio(seg(lt, sb, sb + 0.3)));
        K.sunSkinLens(TL[0], TL[1], TL[2], { sun: 1, burn, sc: pop(lt, 0, 0.25), t });
        const ouch = lt > sb;
        hero({ burn, look: -1, eyes: ouch ? 'squeeze' : 'n', mouth: ouch ? 'o' : 'flat', brow: ouch ? 0.8 : 0.5, sad: ouch ? 0.2 : 0.6 });
        K.painZap(HERO.x - 172 * HERO.s, HERO.y + 30, 0.8, pop(lt, sb + 0.05, 0.25), t);
      } });
    cue(0.05, 'whoosh', { gain: 0.5 }); cue(0.03, 'pop', { gain: 0.45 }); cue(0.1, 'sizzle', { dur: 0.5, gain: 0.25 }); cue(sb, 'boing', { gain: 0.4 }); cue(sb + 0.05, 'pop', { gain: 0.5 });
  }

  // ── 2a · Ultraviolet rays just damaged ──
  {
    const st = cut(1), uv = Wd('ultraviolet', 1) - st, ra = Wd('rays', 1) - st, dm = Wd('damaged', 1) - st;
    const L2 = [600, 800, 310], SUN = [190, 300], DX = [-150, 0, 150];
    const T = DX.map((dx) => K.skinCutAt(L2[0], L2[1], L2[2], 'top', dx));
    const O = T.map(([tx, ty]) => { const a = Math.atan2(ty - SUN[1], tx - SUN[0]); return [SUN[0] + Math.cos(a) * 135, SUN[1] + Math.sin(a) * 135]; });
    add({ id: 'S02', at: st, cam: [560, 700], zoom: 0.04, note: 'sun (top left) + skin cutaway lens (top layer, living cells, dermis, a blood vessel); ink "UV" pill pops by the sun on "Ultraviolet"; three wavy orange UV rays shoot from the sun into the skin by "rays"; on "damaged" red zaps flash where they hit and the skin tints pink',
      draw(lt, d, t) {
        plain();
        K.sun(SUN[0], SUN[1], 0.75 * lerp(0.6, 1, pop(lt, 0, 0.25)), t);
        K.skinCutLens(L2[0], L2[1], L2[2], { burn: lt > dm ? 0.35 * eo(seg(lt, dm, dm + 0.4)) : 0, sc: lerp(0.6, 1, pop(lt, 0, 0.3)), t });
        T.forEach(([tx, ty], i) => K.uvRay(O[i][0], O[i][1], tx, ty, lt > uv + 0.1 ? eio(seg(lt, uv + 0.1 + i * 0.08, ra + 0.3 + i * 0.08)) : 0, t));
        T.forEach(([tx, ty], i) => K.painZap(tx, ty + 34, 0.45, pop(lt, dm + i * 0.06, 0.2) * out(lt, dm + 0.7, 0.3), t));
        K.pill('UV', 440, 250, 64, C.ink, C.white, pop(lt, uv));
      } });
    cue(st, 'whoosh'); cue(st + uv, 'pop', { gain: 0.55 }); cue(st + uv + 0.1, 'slide', { dur: ra + 0.4 - uv, gain: 0.35 }); cue(st + dm, 'slam', { gain: 0.5 }); cue(st + dm + 0.05, 'sizzle', { dur: 0.5, gain: 0.25 });
  }
  // ── 2b · the DNA in your skin cells ──
  {
    const st = at('the', 1), dn = Wd('dna', 1) - st, ce = Wd('cells', 1) - st;
    const CE = [540, 680], CR = 330, NR = 175, SUN = [540, 190], hit = dn + 0.4;
    add({ id: 'S03', at: st, cam: [540, 660], zoom: 0.06, note: 'a big skin cell with a pink nucleus; small sun at top; on "DNA" a DNA ladder pops inside the nucleus + DNA tag; a UV ray shoots down and snaps the middle rung (small red nick) as "DNA" ends; SKIN CELL tag on "cells"',
      draw(lt, d, t) {
        plain();
        const cs = pop(lt, 0, 0.3);
        scaled(CE[0], CE[1], cs, () => {
          ctx.beginPath(); ctx.arc(CE[0], CE[1], CR + 14, 0, Math.PI * 2); ctx.fillStyle = C.skinShade; ctx.fill();
          ctx.beginPath(); ctx.arc(CE[0], CE[1], CR, 0, Math.PI * 2); ctx.fillStyle = C.skin; ctx.fill();
          ctx.save(); ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.ellipse(CE[0] - 170, CE[1] - 190, 60, 24, -0.7, 0, Math.PI * 2); ctx.fillStyle = '#F2CDB5'; ctx.fill(); ctx.restore();
          ctx.beginPath(); ctx.arc(CE[0], CE[1], NR + 12, 0, Math.PI * 2); ctx.fillStyle = C.pinkDark; ctx.fill();
          ctx.beginPath(); ctx.arc(CE[0], CE[1], NR, 0, Math.PI * 2); ctx.fillStyle = C.pinkLight; ctx.fill();
          ctx.save(); ctx.beginPath(); ctx.arc(CE[0], CE[1], NR, 0, Math.PI * 2); ctx.clip();
          K.dnaLadder(CE[0], CE[1], 0.5, { brk: lt > hit ? eo(seg(lt, hit, hit + 0.25)) : 0, t, sc: pop(lt, dn) });
          ctx.restore();
        });
        K.sun(SUN[0], SUN[1], 0.45 * pop(lt, 0.05, 0.25), t);
        K.uvRay(SUN[0], SUN[1] + 85, CE[0], CE[1] - 6, lt > dn + 0.05 ? eio(seg(lt, dn + 0.05, hit)) : 0, t, out(lt, hit + 0.3, 0.25));
        K.tag('DNA', 850, 320, CE[0] + NR * 0.72, CE[1] - NR * 0.72, 60, pop(lt, dn));
        K.tag('SKIN CELL', 300, 1110, CE[0] - CR * 0.7, CE[1] + CR * 0.7, 56, pop(lt, ce));
      } });
    cue(st, 'whoosh'); cue(st + 0.03, 'pop', { gain: 0.4 }); cue(st + dn, 'pop', { gain: 0.6 }); cue(st + dn + 0.05, 'slide', { dur: 0.35, gain: 0.3 }); cue(st + hit, 'thud', { gain: 0.6 }); cue(st + ce, 'pop', { gain: 0.5 });
  }

  // ── 3 · and that damage is permanent ──
  {
    const st = cut(2), dg = Wd('damage', 2) - st, pm = Wd('permanent', 2) - st;
    const DN = [540, 580, 1.1];
    add({ id: 'S04', at: st, cam: [540, 600], zoom: 0.08, note: 'close-up: the DNA ladder with the snapped middle rung (red nick) on a soft pink disc; yellow ring round the break on "damage"; red PERMANENT stamp slams in below on "permanent"',
      draw(lt, d, t) {
        plain();
        ctx.save(); ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.arc(540, 590, 440, 0, Math.PI * 2); ctx.fillStyle = C.pinkLight; ctx.fill(); ctx.restore();
        K.dnaLadder(DN[0], DN[1], DN[2], { brk: 1, t });
        K.hiRing(DN[0], DN[1] + 8, 175, 96, ringIn(lt, dg) * out(lt, d - 0.25, 0.2));
        K.stamp('PERMANENT', 540, 1070, 84, -0.08, pop(lt, pm, 0.22));
      } });
    cue(st, 'whoosh'); cue(st + dg, 'pop', { gain: 0.55 }); cue(st + pm, 'slam', { gain: 0.8 });
  }

  // ── 4 · Your skin's blood vessels widen ──
  {
    const st = cut(3), bl = Wd('blood', 3) - st, wi = Wd('widen', 3) - st;
    const u = SL[2] / 300, vy = SL[1] + 170 * u;
    add({ id: 'S05', at: st, cam: [540, 800], zoom: 0.07, note: 'big skin cutaway lens, blood flowing along the vessel; BLOOD VESSEL pill pops just above the vessel on "blood"; on "widen" the pill fades, the vessel swells wider and white arrows above it push up',
      draw(lt, d, t) {
        plain();
        const w = eio(seg(lt, wi, wi + 0.45));
        K.skinCutLens(SL[0], SL[1], SL[2], { burn: 0.2, widen: w, sc: pop(lt, 0, 0.3), t, flow: 1.4 });
        K.pill('BLOOD VESSEL', 540, SL[1] + 45 * u, 50, C.ink, C.white, pop(lt, bl) * out(lt, wi - 0.15, 0.15));
        const aw = lt > wi ? eo(seg(lt, wi, wi + 0.25)) * out(lt, d - 0.3, 0.25) : 0;
        for (const dx of [-120, 120]) K.flowArrow(540 + dx, vy - (56 + 16) * u - 70 - 20 * w, 90, -Math.PI / 2, aw, C.white, 24, C.ink);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + bl, 'pop', { gain: 0.55 }); cue(st + wi, 'slide', { dur: 0.45, gain: 0.45 }); cue(st + wi + 0.45, 'boing', { gain: 0.3 });
  }

  // ── 5 · so it turns red, swollen and hot ──
  {
    const st = cut(4), rd = Wd('red', 4) - st, sw = Wd('swollen', 4) - st, ho = Wd('hot', 4) - st;
    const TL = [310, 700, 220];
    add({ id: 'S06', at: st, cam: [560, 680], zoom: 0.06, note: 'room: skin cutaway lens (left, wide vessel), hero (right, sunburnt); on "red" the skin in the lens and the hero go deep red; on "swollen" the skin surface puffs up; on "hot" orange warm wavy air rises off the lens and the hero goes wide-eyed with a sweat drop',
      draw(lt, d, t) {
        roomAt();
        const red = eio(seg(lt, rd, rd + 0.35)), swell = eio(seg(lt, sw, sw + 0.4)), hot = lt > ho ? eo(seg(lt, ho, ho + 0.3)) : 0;
        K.skinCutLens(TL[0], TL[1], TL[2], { burn: lerp(0.3, 1, red), swell, widen: 1, sc: lerp(0.6, 1, pop(lt, 0, 0.3)), t, flow: 1.4 });
        K.warmWaves(TL[0], TL[1] - TL[2] - 50, 260, t, hot, { n: 4, h: 200 });
        hero({ burn: lerp(0.5, 1, red), look: -1, eyes: lt > ho ? 'wide' : 'n', mouth: lt > ho ? 'o' : 'flat', brow: lt > ho ? 1 : 0.5, sad: lt > ho ? 0 : 0.5, sweat: hot });
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + rd, 'pop', { gain: 0.5 }); cue(st + sw, 'boing', { gain: 0.4 }); cue(st + ho, 'sizzle', { dur: 0.8, gain: 0.3 });
  }

  // ── 6a · The pain hits within hours ──
  {
    const st = cut(5), hi = Wd('hits', 5) - st, wi = Wd('within', 5) - st, ho = Wd('hours', 5) - st;
    const CL = [300, 520, 150];
    add({ id: 'S07', at: st, cam: [560, 640], zoom: 0.06, note: 'room: wall clock (left) pops in; hero (right, sunburnt) winces on "hits" with a red pain zap at his arm; from "within" the clock hand sweeps three hours (pale blue wedge) through "hours"',
      draw(lt, d, t) {
        roomAt();
        K.wallClock(CL[0], CL[1], CL[2], { hour: lerp(0, 3, eio(seg(lt, wi, ho + 0.45))), from: 0, sc: pop(lt, 0, 0.3) });
        const ouch = lt > hi;
        hero({ burn: 1, look: ouch ? 0 : -1, eyes: ouch ? 'squeeze' : 'n', mouth: ouch ? 'o' : 'flat', brow: 0.6, sad: ouch ? 0.3 : 0.6 });
        K.painZap(HERO.x - 172 * HERO.s, HERO.y + 30, 0.8, pop(lt, hi, 0.25), t);
      } });
    cue(st, 'whoosh'); cue(st + 0.03, 'pop', { gain: 0.4 }); cue(st + hi, 'slam', { gain: 0.5 }); cue(st + wi, 'slide', { dur: ho + 0.45 - wi, gain: 0.3 }); cue(st + ho + 0.45, 'tock', { gain: 0.55 });
  }
  // ── 6b · then peaks the next day ──
  {
    const st = at('then', 5), pk = Wd('peaks', 5) - st, nx = Wd('next', 5) - st;
    const CH = [540, 660, 860, 700];
    add({ id: 'S08', at: st, cam: [600, 620], zoom: 0.07, note: 'pain chart card (red PAIN pill on the y axis): a red line climbs to its peak by "peaks", a red pain zap bursts at the peak; dashed line down + NEXT DAY pill under the peak on "next"; the line then eases down a little',
      draw(lt, d, t) {
        plain();
        const p = lt < pk ? lerp(0.02, 0.7, eio(seg(lt, 0.05, pk))) : lerp(0.7, 0.86, seg(lt, pk + 0.25, d));
        const [px, py] = K.painChart(CH[0], CH[1], CH[2], CH[3], { p, sc: pop(lt, 0, 0.3) });
        K.pill('PAIN', 290, 360, 44, C.red, C.white, pop(lt, 0.05));
        K.painZap(px, py, 0.9, pop(lt, pk, 0.25), t);
        const nd = pop(lt, nx);
        if (nd > 0) { ctx.save(); ctx.globalAlpha = clamp(nd); ctx.setLineDash([18, 14]); line([[px, py + 60], [px, 780]], C.ink, 8); ctx.restore(); }
        K.pill('NEXT DAY', px, 850, 52, C.ink, C.white, nd);
      } });
    cue(st, 'whoosh'); cue(st + 0.03, 'pop', { gain: 0.4 }); cue(st + 0.05, 'slide', { dur: pk - 0.05, gain: 0.35 }); cue(st + pk, 'slam', { gain: 0.6 }); cue(st + nx, 'pop', { gain: 0.6 });
  }

  // ── 7 · About three days later, the peeling starts ──
  {
    const st = cut(6), th = Wd('three', 6) - st, pe = Wd('peeling', 6) - st;
    const CA = [320, 650, 0.68], PL = [800, 660, 200];
    add({ id: 'S09', at: st, cam: [540, 650], zoom: 0.05, note: 'calendar (left) shows 1 DAY, flips to 3 DAYS on "three"; sun-over-red-skin lens (right); on "peeling" clean pale flakes curl up off the skin and two drift away',
      draw(lt, d, t) {
        plain();
        const k = lt > th, fl = k ? seg(lt, th, th + 0.22) : 1, bump = k ? Math.sin(fl * Math.PI) : 0;
        ctx.save(); const ps = pop(lt, 0, 0.3); ctx.translate(CA[0], CA[1]); ctx.scale(ps * (1 + 0.06 * bump), ps * (1 - 0.1 * bump)); ctx.translate(-CA[0], -CA[1]);
        K.calendar(CA[0], CA[1], CA[2], k ? '3' : '1', k ? 'DAYS' : 'DAY', -0.03 * bump); ctx.restore();
        K.sunSkinLens(PL[0], PL[1], PL[2], { sun: 1, burn: 1, peel: lt > pe ? eio(seg(lt, pe, pe + 0.9)) : 0, sc: pop(lt, 0.05, 0.3), t });
      } });
    cue(st, 'whoosh'); cue(st + 0.03, 'pop', { gain: 0.4 }); cue(st + th, 'tock', { gain: 0.6 }); cue(st + pe, 'sparkle', { dur: 0.8, gain: 0.35 });
  }

  // ── 8 · That's fresh new skin growing underneath ──
  {
    const st = cut(7), fr = Wd('fresh', 7) - st, nw = Wd('new', 7) - st, gr = Wd('growing', 7) - st, un = Wd('underneath', 7) - st;
    const u = SL[2] / 300, [fx, fy] = K.skinCutAt(SL[0], SL[1], SL[2], 'fresh', 60);
    add({ id: 'S10', at: st, cam: [540, 620], zoom: 0.07, note: 'big skin cutaway lens (red skin, pale top layer); from "fresh" a fresh light new layer grows in under the top layer through "underneath"; NEW SKIN tag (in the air above) points at it on "new"; white up arrows in the living layer on "growing"',
      draw(lt, d, t) {
        plain();
        const fresh = eio(seg(lt, fr, un + 0.3));
        K.skinCutLens(SL[0], SL[1], SL[2], { burn: 0.7, widen: 0.7, dead: lerp(0.3, 0.8, seg(lt, 0, d)), fresh, sc: pop(lt, 0, 0.3), t });
        K.tag('NEW SKIN', 540, SL[1] - 215 * u, fx, fy, 56, pop(lt, nw));
        const aw = lt > gr ? eo(seg(lt, gr, gr + 0.25)) * out(lt, d - 0.3, 0.25) : 0;
        for (const dx of [-200, 200]) K.flowArrow(SL[0] + dx * u, SL[1] - 6 * u - 10 * Math.sin(t * 6), 70, -Math.PI / 2, aw, C.white, 20, C.ink);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + fr, 'sparkle', { dur: un + 0.3 - fr, gain: 0.35 }); cue(st + nw, 'pop', { gain: 0.6 });
  }

  // ── 9 · while the dead top layer peels away ──
  {
    const st = cut(8), de = Wd('dead', 8) - st, pe = Wd('peels', 8) - st;
    const u = SL[2] / 300, [tx, ty] = K.skinCutAt(SL[0], SL[1], SL[2], 'top', -75);
    add({ id: 'S11', at: st, cam: [540, 600], zoom: 0.07, note: 'same lens with the fresh layer in place; on "dead" the top layer goes pale and a DEAD LAYER tag points at it; on "peels" the tag fades and the top layer lifts in clean flakes that curl up, one drifting off and fading, fresh skin showing under it',
      draw(lt, d, t) {
        plain();
        K.skinCutLens(SL[0], SL[1], SL[2], { burn: 0.7, widen: 0.7, dead: lerp(0.8, 1, eo(seg(lt, de, de + 0.3))), fresh: 1, peel: lt > pe ? eio(seg(lt, pe, pe + 0.85)) : 0, t });
        K.tag('DEAD LAYER', 540, SL[1] - 215 * u, tx, ty, 56, pop(lt, de) * out(lt, pe - 0.12, 0.2));
      } });
    cue(st, 'whoosh'); cue(st + de, 'pop', { gain: 0.6 }); cue(st + pe, 'slide', { dur: 0.6, gain: 0.35 }); cue(st + pe + 0.1, 'sparkle', { dur: 0.7, gain: 0.3 });
  }

  // ── 10 · Don't pick it. That dead layer is protecting your new skin ──
  {
    const st = cut(9), dn = Wd('don', 9) - st, pk = Wd('pick', 9) - st, it = Wd('it', 9, 'e') - st, th = Wd('that', 9) - st, pr = Wd('protecting', 9) - st;
    const [gx, gy] = flakeTip(), FAR = [1240, 560];
    add({ id: 'S12', at: st, cam: [600, 600], zoom: 0.06, note: 'same lens, flakes curled; an arm + hand reaches in from the right toward the curled flake; on "pick" a red X slams over the fingertips, then the hand pulls back out and the X fades (gone before "That"); from "That" the curled flakes settle back down onto the fresh layer; on "protecting" a green shield with a white check pops in the air right above the skin',
      draw(lt, d, t) {
        plain();
        K.skinCutLens(SL[0], SL[1], SL[2], { burn: 0.7, widen: 0.7, dead: 1, fresh: 1, peel: 1, settle: eio(seg(lt, th, th + 0.4)), t });
        const inn = eio(seg(lt, 0, pk)), back = eio(seg(lt, it, th - 0.02)), k = inn * (1 - back);
        if (k > 0) {
          const hx = lerp(FAR[0], gx + 14, k), hy = lerp(FAR[1], gy + 8, k);
          K.reachArm(1260, hy - 40 + 40 * k, hx + 20, hy, 1);
          ctx.save(); ctx.translate(hx - 18, hy - 2); ctx.rotate(Math.PI + 0.15); ctx.beginPath(); ctx.roundRect(-10, -12, 46, 24, 12); ctx.fillStyle = C.skin; ctx.fill(); ctx.restore();   // pinching fingertip
        }
        K.redX(gx + 30, gy, 0.34, (lt > pk ? eo(seg(lt, pk, pk + 0.15)) : 0) * out(lt, it + 0.02, 0.15));
        K.shieldBadge(540, 418, 0.48, pop(lt, pr));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: pk - 0.05, gain: 0.35 }); cue(st + pk, 'slam', { gain: 0.8 }); cue(st + it, 'zip', { gain: 0.5 }); cue(st + pr, 'pop', { gain: 0.6 }); cue(st + pr + 0.1, 'sparkle', { dur: 0.6, gain: 0.3 });
  }

  // ── 11 · Cool showers, aloe and plenty of water help soothe it ──
  {
    const st = cut(10), co = Wd('cool', 10) - st, sh = Wd('showers', 10) - st, al = Wd('aloe', 10) - st, wa = Wd('water', 10) - st, so = Wd('soothe', 10) - st;
    const SH = [330, 420, 0.85], AL = [790, 600, 0.9], GL = [540, 960, 1.0];
    add({ id: 'S13', at: st, cam: [540, 640], zoom: 0.06, note: 'graphic: a shower head (top left) pops on "Cool" and cool water drops fall on "showers"; a potted aloe plant (right) pops on "aloe"; an outlined glass of water (bottom) pops on "water"; green check marks pop beside each on "soothe"',
      draw(lt, d, t) {
        plain();
        K.showerHead(SH[0], SH[1], SH[2], { flow: lt > sh ? eo(seg(lt, sh, sh + 0.2)) : 0, t, sc: pop(lt, co), fall: 300 });
        K.aloePlant(AL[0], AL[1], AL[2], { sc: pop(lt, al), t });
        scaled(GL[0], GL[1] + 128, pop(lt, wa), () => K.outlinedGlass(GL[0], GL[1], GL[2], 0.75, t));
        K.checkMark(520, 330, 0.9, pop(lt, so));
        K.checkMark(960, 340, 0.9, pop(lt, so + 0.08));
        K.checkMark(720, 880, 0.9, pop(lt, so + 0.16));
      } });
    cue(st, 'whoosh'); cue(st + co, 'pop', { gain: 0.5 }); cue(st + sh, 'bubbles', { dur: 0.7, gain: 0.3 }); cue(st + al, 'pop', { gain: 0.55 }); cue(st + wa, 'pop', { gain: 0.55 }); cue(st + wa + 0.1, 'plop', { gain: 0.4 });
    for (let i = 0; i < 3; i++) cue(st + so + i * 0.08, 'pop', { gain: 0.4 });
  }

  // ── 12 · and blisters or chills? Call a doctor. ──
  {
    const st = at('blisters', 11), bl = Wd('blisters', 11) - st, ch = Wd('chills', 11) - st, ca = Wd('call', 11) - st, dc = Wd('doctor', 11) - st;
    const BB = [290, 430], FB = [790, 430], PH = [540, 860, 0.55];
    add({ id: 'S14', at: st, cam: [540, 620], zoom: 0.06, note: 'graphic: a blisters badge (red skin with two clear domes, left) pops on "blisters"; a snowflake frost badge (right) pops and shivers on "chills"; a phone (bottom) pops and rings on "Call", doctor badge on its screen on "doctor"',
      draw(lt, d, t) {
        plain();
        K.blisterBadge(BB[0], BB[1], 0.95, pop(lt, bl));
        const sv = lt > ch ? eo(seg(lt, ch, ch + 0.2)) : 0, jx = Math.sin(t * 50) * 6 * sv;
        K.frostBadge(FB[0] + jx, FB[1], 1.4, pop(lt, ch), t);
        K.shakeLines(FB[0], FB[1], 175, 90, t, sv);
        const ring = lt > ca ? eo(seg(lt, ca, ca + 0.15)) * out(lt, ca + 0.9, 0.3) : 0;
        scaled(PH[0], PH[1], pop(lt, ca - 0.05), () => {
          K.phone(PH[0], PH[1], PH[2], '', ring, t);
          ctx.save(); ctx.translate(PH[0], PH[1]); ctx.rotate(Math.sin(t * 38) * 0.07 * ring); K.doctorBadge(0, -80 * PH[2], 0.75 * PH[2], pop(lt, dc)); ctx.restore();
        });
      } });
    cue(st, 'whoosh'); cue(st + bl, 'pop', { gain: 0.6 }); cue(st + ch, 'pop', { gain: 0.5 }); cue(st + ch + 0.05, 'alarm', { dur: 0.5, gain: 0.15 }); cue(st + ca, 'alarm', { dur: 0.7, gain: 0.3 }); cue(st + dc, 'pop', { gain: 0.6 });
  }

  // ── 13-14 · TEASE + END CARD (room): throat lens at left, NEXT, BODY FILES; the hero only watches ──
  const TL = [310, 740, 220], NX = [310, 1080];
  const badge = (sc) => K.filesBadge('BODY FILES', 540, 110, 54, sc);
  {
    const st = cut(12), nx = Wd('next', 12) - st, bo = Wd('body', 12) - st, wh = Wd('what', 12) - st, vo = Wd('voice', 12) - st;
    add({ id: 'S15', at: st, cam: [540, 720], zoom: 0.06, note: 'room: hero (right) waves; a lens with a "?" pops at left; NEXT pill on "Next", BODY FILES badge on "Body"; hero turns to the lens on "what"; on "voice" the "?" swaps for a throat lens: lower face + neck cutaway with the voice box',
      draw(lt, d, t) {
        roomAt();
        badge(pop(lt, bo));
        const wv = eio(seg(lt, 0.05, 0.4)) * out(lt, wh - 0.3, 0.3);
        hero({ armL: K.armPose(K.ARM.down, K.ARM.wave, wv), look: lt > wh ? -1 : 0, mouth: lt > vo ? 'o' : 'smile', brow: lt > vo ? 0.9 : 0.5 });
        if (lt < vo) K.lens(TL[0], TL[1], TL[2], pop(lt, 0.03), () => qMark(t), LBG);
        else K.throatLens(TL[0], TL[1], TL[2], { sc: pop(lt, vo, 0.3), t });
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, pop(lt, nx));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.5 }); cue(st + nx, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.6 }); cue(st + vo, 'pop', { gain: 0.6 });
  }
  {
    const st = cut(13), wp = Wd('whispering', 13) - st, wo = Wd('worse', 13) - st, we = Wd('worse', 13, 'e') - st;
    add({ id: 'S16', at: st, cam: [540, 720], zoom: 0.05, note: 'END CARD (room): BODY FILES badge, throat lens, NEXT pill; on "whispering" the lens mouth purses and a small "shh" bubble pops above the lens; on "worse" the voice box strains (jitters, folds pinch, red strain marks); after "worse" the bubble exits, hero turns to camera with a warm grin and + FOLLOW pops above the lens',
      draw(lt, d, t) {
        roomAt(); badge(1);
        const toCam = lt > we + 0.05;
        hero({ look: toCam ? 0 : -1, mouth: toCam ? 'grin' : 'smile', brow: toCam ? 0.5 : lt > wo ? 0.9 : 0.6 });
        K.throatLens(TL[0], TL[1], TL[2], { whisper: lt > wp ? 1 : 0, strain: lt > wo ? eo(seg(lt, wo, wo + 0.25)) : 0, t });
        K.textBubble('shh', 250, 400, 240, 130, 300, 540, pop(lt, wp) * out(lt, we, 0.2), 70);
        K.pill('NEXT', NX[0], NX[1], 60, C.yellow, C.ink, 1);
        K.followPill(TL[0], 400, pop(lt, we + 0.15), t, 60);
      } });
    cue(st, 'whoosh'); cue(st + wp, 'pop', { gain: 0.5 }); cue(st + wo, 'alarm', { dur: 0.5, gain: 0.2 }); cue(st + we, 'zip', { gain: 0.4 }); cue(st + we + 0.15, 'pop', { gain: 0.7 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES };
}
