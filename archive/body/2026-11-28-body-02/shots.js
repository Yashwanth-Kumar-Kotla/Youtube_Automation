// WHAT HAPPENS WHEN YOU GET DÉJÀ VU?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): a café front, the hero frozen mid-step in its doorway, a "rerun" film strip across the
// top repeating the same doorway scene, an x-ray lens with the schematic brain (dashed memory + front areas, a dim magnifier
// at the front = rewatch detail), A MEMORY / B DECISION-MAKER pills. No title card, no black fade (loop: true).
// Cuts sit on caption-chunk starts (word start - 0.05) so no caption runs past a cut.
// Guess (line 1c): the big x-ray brain, pills pop on the spoken options. Re-hook (line 5): hard cut to a lab, hero in a scanner.
// Answer (line 7): same brain + pills, front area lights, check on B, the magnifier lights and checks the memory area.
// Rewatch: blank 5th word card with a faint "S" (SLEEP, the missing link word); the dim magnifier from frame 1.
// Tease (line 9a, from "Next"): sweat glands + NEXT + BODY FILES. Loop (9b, "glands"): back to the exact frame-1 picture.
import { ctx, C, W, H, TAU, clamp, lerp, seg, eo, eio, eob, line, bigText, rr, circle } from './core/lib.js';
import { T, Wd } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const at = (w, i) => Wd(w, i) - 0.05;          // cut = the caption chunk's start
  const plain = () => { ctx.fillStyle = C.bg; ctx.fillRect(-300, -300, W + 600, H + 600); };
  const pop = (lt, a, d = 0.3) => (lt > a ? eob(seg(lt, a, a + d)) : 0);
  const out = (lt, a, d = 0.25) => 1 - eio(seg(lt, a, a + d));
  const blip = (lt, a, d = 0.35) => (lt > a ? Math.sin(Math.PI * seg(lt, a, a + d)) : 0);
  const enter = (lt) => lerp(0.86, 1, eob(seg(lt, 0, 0.25)));
  const T_LAST = (Math.ceil(T.dur * 30 - 1e-6) - 1) / 30;   // time of the film's last rendered frame

  // ── the hook set: café doorway, frozen hero, rerun strip, x-ray brain lens, A / B pills (frame 1 + loop) ──
  const CAFE = { x0: 190, w: 280, top: 410, floor: 960 }, HERO = { x: 330, s: 0.46 }, HY = CAFE.floor - 8 - 620 * HERO.s;
  const STRIP = [205, 160], LENS = [800, 620, 180], HOOK_CAM = [540, 700];
  const PA = [540, 1005], PB = [540, 1100], PS = 40;
  const frozen = (x, y, s, o = {}) => K.man({ x, y, s, step: 0.3, look: 0.1, eyes: o.eyes || 'wide', mouth: o.mouth || 'o', brow: 1,
    armL: { e: [190, 20], h: [150, 150] }, arm: { e: [200, -10], h: [230, 120] } });
  const cafe = (t) => { K.dvCafeFront({ ...CAFE, t }); frozen(HERO.x, HY, HERO.s); };
  const mini = (t) => (fx, fy, fw, fh) => { const k = fh / 660; ctx.save(); ctx.translate(fx + fw / 2, fy); ctx.scale(k, k); ctx.translate(-330, -300); cafe(t); ctx.restore(); };
  const brainLens = (t, o = {}) => {
    const hx = HERO.x + 60, hy = HY - 330 * HERO.s;
    for (const [u, r] of [[0.45, 16], [0.75, 22]]) { const px = lerp(hx, LENS[0] - LENS[2], u), py = lerp(hy, LENS[1] - 40, u); circle(px, py, r + 7, C.ink); circle(px, py, r, C.white); }
    K.lens(LENS[0], LENS[1], LENS[2], 1, () => K.dvXBrain(-8, 14, 0.52, { zones: 1, t, ...o }), C.navy);
  };
  const hookPills = (sc = 1, o = {}) => { K.abPill('A', 'MEMORY', PA[0], PA[1], PS, { sc, ...o.a }); K.abPill('B', 'DECISION-MAKER', PB[0], PB[1], PS, { sc, ...o.b }); };
  const hookScene = (t, o = {}) => { cafe(t); K.dvRerunStrip(STRIP[0], STRIP[1], t, mini(t), { flash: o.flash || 0 }); brainLens(t, o.brain); hookPills(1); };

  // ── 1 · HOOK "What happens when you get déjà vu?" ──
  {
    const de = Wd('déjà', 0), vu = Wd('vu', 0);
    add({ id: 'S01', at: 0, cam: HOOK_CAM, zoom: 0.03, note: 'FRAME 1 = hook: café front, the hero frozen mid-step in the doorway (wide eyes), a rerun film strip across the top repeating the same doorway scene, x-ray lens with the schematic brain (dashed memory + front areas, dim magnifier at the front), A MEMORY / B DECISION-MAKER pills, all from frame 0; strip frames flash yellow on "déjà"; both brain areas blink on "vu"',
      draw(lt, d, t) {
        hookScene(t, { flash: blip(lt, de, 0.45), brain: { mem: 0.85 * blip(lt, vu, 0.3), front: 0.85 * blip(lt, vu + 0.15, 0.3) } });
      } });
    cue(0.0, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(de, 'slide', { dur: 0.4, gain: 0.3 }); cue(vu, 'pop', { gain: 0.45 }); cue(vu + 0.15, 'pop', { gain: 0.35 });
  }

  // ── 2a · "Ninety-seven percent of people have had it." (100 icons, 97 light up) ──
  {
    const st = at('ninety', 1), of = Wd('of', 1) - st, ha = Wd('had', 1) - st;
    const NOT = [27, 58, 93];
    add({ id: 'S02', at: st, cam: [540, 650], zoom: 0.07, note: '100 grey person icons in 5 rows of 20 (on screen at the cut); yellow "97%" pill pops on "Ninety-seven"; from "of" to "had" the icons turn blue row by row, three stay grey; the blue ones hop on "had"',
      draw(lt, d, t) {
        plain();
        for (let i = 0; i < 100; i++) {
          const r = Math.floor(i / 20), c = i % 20, x = 103 + c * 46, y = 430 + r * 130;
          const lit = !NOT.includes(i) && lt > lerp(of, ha - 0.1, i / 100);
          const hop = lit ? 14 * blip(lt, ha + c * 0.012, 0.3) : 0;
          K.personIcon(x, y - hop, 0.3, lit ? C.shirt : C.gumEdge);
        }
        K.pill('97%', 540, 250, 90, C.yellow, C.ink, pop(lt, 0.05));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.7 }); cue(st + of, 'slide', { dur: ha - of, gain: 0.25 }); cue(st + ha, 'boing', { gain: 0.35 });
  }

  // ── 2b · "In a scanner, what lights up:" (scan monitor) ──
  {
    const st = at('in', 1), sc = Wd('scanner', 1) - st, li = Wd('lights', 1) - st, up = Wd('up', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 640], zoom: 0.1, note: 'scan monitor with the x-ray brain on screen at the cut (dashed memory + front areas); a cyan scan bar sweeps down from "scanner"; on "lights" the memory and front areas flicker yellow in turn; yellow "?" over the monitor on "up"',
      draw(lt, d, t) {
        plain();
        const fl = lt > li ? Math.sin((lt - li) * 18) : 0;
        K.dvMonitor(540, 640, 820, 600, { scan: seg(lt, sc, sc + 0.9) < 1 && lt > sc ? seg(lt, sc, sc + 0.9) : -1, sc: enter(lt),
          inner: () => K.dvXBrain(0, 10, 1.0, { zones: 1, t, mem: lt > li ? 0.8 * Math.max(0, fl) : 0, front: lt > li ? 0.8 * Math.max(0, -fl) : 0 }) });
        bigText('?', 540, 220, 150 * pop(lt, up), C.yellow, 0.1);
      } });
    cue(st, 'whoosh'); cue(st + sc, 'slide', { dur: 0.9, gain: 0.3 }); cue(st + li, 'sparkle', { dur: 0.5, gain: 0.25 }); cue(st + up, 'boing', { gain: 0.4 });
  }

  // ── the big x-ray brain + pills (guess S04, answer S11) ──
  const BR = [540, 560, 1.25];
  // label on the x-ray film: white pill + white pointer line (ink would vanish on navy)
  const xtag = (txt, x, y, tx, ty, sc) => { if (sc <= 0) return; ctx.save(); ctx.globalAlpha = clamp(sc); line([[x, y], [tx, ty]], C.white, 7); circle(tx, ty, 10, C.white); ctx.restore(); K.pill(txt, x, y, 42, C.white, C.ink, sc); };
  // ── 2c · GUESS "your memory, or your decision-maker?" ──
  {
    const st = at('your', 1), me = Wd('memory', 1) - st, de = Wd('decision', 1) - st;
    add({ id: 'S04', at: st, cam: [540, 900], zoom: 0.06, note: 'GUESS: x-ray film, the big schematic brain on screen at the cut (dashed memory + front areas); pill A MEMORY pops + memory area flashes yellow on "memory"; pill B DECISION-MAKER pops + front area flashes on "decision-maker"',
      draw(lt, d, t) {
        K.xray(t);
        K.dvXBrain(BR[0], BR[1], BR[2], { zones: 1, t, mem: 0.9 * blip(lt, me, 0.6), front: 0.9 * blip(lt, de, 0.6) });
        K.abPill('A', 'MEMORY', PA[0], PA[1] - 17, PS, { sc: pop(lt, me), hi: blip(lt, me, 0.4) });
        K.abPill('B', 'DECISION-MAKER', PB[0], PB[1], PS, { sc: pop(lt, de), hi: blip(lt, de, 0.4) });
      } });
    cue(st, 'whoosh'); cue(st + me, 'pop', { gain: 0.65 }); cue(st + de, 'pop', { gain: 0.65 });
  }

  // ── 3 · "Your memory wiring and your new-info wiring cross." ──
  {
    const st = at('your', 2), me = Wd('memory', 2) - st, ni = Wd('new', 2) - st, cr = Wd('cross', 2) - st;
    const [bx, by, bs] = [540, 620, 1.45], P = (lx, ly) => K.dvBPt(bx, by, bs, [lx, ly]);
    const MEM = [P(-20, 75), P(10, 30), P(50, -30), P(110, -100), P(190, -150)];
    const NEW = [P(285, 25), P(180, 10), P(50, -30), P(-60, -70), P(-190, -100)];
    const [cx, cy] = P(50, -30);
    add({ id: 'S05', at: st, cam: [540, 620], zoom: 0.1, note: 'x-ray film, the big brain on screen at the cut; a pink MEMORY wire draws up from the memory area from "memory" (MEMORY tag); a white NEW-INFO wire draws in from the front from "new-info" (NEW-INFO tag); they meet and a yellow spark bursts at the crossing on "cross"',
      draw(lt, d, t) {
        K.xray(t);
        K.dvXBrain(bx, by, bs, { t });
        const cross = lt > cr;
        K.dvWire(MEM, eio(seg(lt, me, ni - 0.1)) * (cross ? 1 : 0.999), cross && Math.sin(lt * 30) > 0 ? C.yellow : C.pink);
        K.dvWire(NEW, eio(seg(lt, ni, cr)) * (cross ? 1 : 0.999), cross && Math.sin(lt * 30) < 0 ? C.yellow : C.white);
        K.burst(cx, cy, 1.8, blip(lt, cr, 0.5));
        K.sparkle4(cx, cy, 46, pop(lt, cr, 0.2) * out(lt, cr + 0.6), lt * 2);
        xtag('MEMORY', 290, 1050, MEM[0][0], MEM[0][1] + 24, pop(lt, me));
        xtag('NEW-INFO', 800, 1050, NEW[0][0], NEW[0][1] + 24, pop(lt, ni));
      } });
    cue(st, 'whoosh'); cue(st + me, 'slide', { dur: ni - me - 0.1, gain: 0.3 }); cue(st + me, 'pop', { gain: 0.45 }); cue(st + ni, 'slide', { dur: cr - ni, gain: 0.3 }); cue(st + ni, 'pop', { gain: 0.45 });
    cue(st + cr, 'slam', { gain: 0.6 }); cue(st + cr + 0.05, 'sparkle', { dur: 0.5, gain: 0.3 });
  }

  // ── 4 · "So now feels like a rerun." (the present as a film frame, stamped RERUN) ──
  {
    const st = at('so', 3), no = Wd('now', 3) - st, li = Wd('like', 3) - st, re = Wd('rerun', 3) - st;
    const FX = 540, FY = 620, FW = 600, FH = 640;
    const frame = (x, y, a, t) => {
      ctx.save(); ctx.globalAlpha = a;
      rr(x - FW / 2 - 22, y - FH / 2 - 22, FW + 44, FH + 44, 30); ctx.fillStyle = C.ink; ctx.fill();
      ctx.save(); rr(x - FW / 2, y - FH / 2, FW, FH, 16); ctx.clip();
      const k = FH / 660; ctx.translate(x, y - FH / 2); ctx.scale(k, k); ctx.translate(-330, -300); cafe(t); ctx.restore();
      ctx.restore();
    };
    add({ id: 'S06', at: st, cam: [540, 620], zoom: 0.08, note: 'the café-doorway moment as a big film frame on plain paper (on screen at the cut); yellow NOW pill on "now"; two identical copies slide out behind it on "like" (the rerun); red RERUN stamp slams across it on "rerun"',
      draw(lt, d, t) {
        plain();
        const sl = eio(seg(lt, li - 0.05, li + 0.3));
        frame(FX - 80 * sl, FY - 80 * sl, 0.35 * sl, t); frame(FX - 40 * sl, FY - 40 * sl, 0.6 * sl, t);
        frame(FX, FY, 1, t);
        K.pill('NOW', 540, 1050, 60, C.yellow, C.ink, pop(lt, no));
        K.stamp('RERUN', 540, 600, 110, -0.14, pop(lt, re, 0.2) * lerp(1.6, 1, eo(seg(lt, re, re + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + no, 'pop', { gain: 0.6 }); cue(st + li, 'slide', { dur: 0.35, gain: 0.3 }); cue(st + re, 'slam', { gain: 0.7 });
  }

  // ── 5 · RELATABLE "Ever walked somewhere new and thought, I've been here?" ──
  {
    const st = at('ever', 4), wa = Wd('walked', 4) - st, ne = Wd('new', 4) - st, th = Wd('thought', 4) - st, be = Wd('been', 4) - st, he = Wd('here', 4) - st;
    const G = 1100, S6 = 0.6, Y6 = G - 620 * S6;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.08, note: 'RELATABLE: a park he has never seen, the hero standing on the path at the cut; he walks right from "walked"; red map pin drops on the lawn on "new"; on "thought" he stops, squints and a thought cloud pops; on "been" the cloud shows the same park view (the rerun); rerun icon pops by the cloud on "here"',
      draw(lt, d, t) {
        K.dvPark({ ground: G, t });
        K.mapPin(860, 900, 0.6, pop(lt, ne));
        const walk = seg(lt, wa - 0.05, th), x = lerp(230, 430, eio(walk)), moving = walk > 0 && walk < 1;
        const ph = (lt - wa) * 9, stp = moving ? 0.12 + 0.2 * Math.abs(Math.sin(ph)) : (lt < wa ? 0.02 : 0.12), bob = moving ? -Math.abs(Math.sin(ph)) * 10 : 0;
        const stop = lt > th;
        K.man({ x, y: Y6 + bob, s: S6, step: stp, look: stop ? 0.5 : 0.8, eyes: stop && lt < be ? 'squeeze' : 'n', mouth: stop ? 'flat' : 'smile', brow: stop ? 0.9 : 0.3, frown: stop && lt < be,
          armL: moving ? K.armPose(K.ARM.down, { e: [190, 10], h: [200, 130] }, Math.abs(Math.sin(ph))) : K.ARM.down, arm: stop ? K.armPose(K.ARM.down, K.ARM.chin, eo(seg(lt, th, th + 0.25))) : K.ARM.down });
        const csc = pop(lt, th, 0.25);
        if (csc > 0) {
          const cx = 770, cy = 330;
          K.fbThought(cx, cy, 1.25, { sc: csc, t, tx: x + 60, ty: Y6 - 300 * S6, text: lt > be ? '' : '?' });
          if (lt > be) {
            const k = 0.2 * pop(lt, be, 0.25);
            ctx.save(); rr(cx - 120 * k / 0.2, cy - 80 * k / 0.2, 240 * k / 0.2, 160 * k / 0.2, 14); ctx.clip();
            ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-540, -800); K.dvPark({ ground: G, t }); K.man({ x: 430, y: Y6, s: S6, step: 0.12, look: 0.5 }); ctx.restore();
            rr(cx - 120, cy - 80, 240, 160, 14); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.globalAlpha = clamp(pop(lt, be, 0.25)); ctx.stroke(); ctx.globalAlpha = 1;
          }
          K.dvRerunIcon(cx + 170, cy - 150, 0.7, pop(lt, he, 0.25), lt * 3);
        }
      } });
    cue(st, 'whoosh'); cue(st + wa, 'slide', { dur: th - wa, gain: 0.25 }); cue(st + ne, 'pop', { gain: 0.5 }); cue(st + th, 'pop', { gain: 0.55 }); cue(st + be, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + he, 'boing', { gain: 0.4 });
  }

  // ── lab set (re-hook S08, cards S09) ──
  const LAB_FLOOR = 1000;
  const remote = (x, y, lit = 0) => { rr(x - 22, y - 50, 44, 90, 12); ctx.fillStyle = C.ink; ctx.fill(); circle(x, y - 18, 14, lit > 0 ? C.yellow : '#B8962A'); };

  // ── 6 · RE-HOOK "But here's the twist: scientists triggered it on purpose." (hard cut to a lab) ──
  {
    const st = at('but', 5), tw = Wd('twist', 5) - st, sc = Wd('scientists', 5) - st, tr = Wd('triggered', 5) - st, pu = Wd('purpose', 5) - st;
    const SX = 700, SY = 760, SS = 0.8, [hx, hy] = [SX + 60 * SS, SY];
    add({ id: 'S08', at: st, cam: [640, 720], zoom: 0.15, note: 'RE-HOOK, new scene: a white lab, the hero lying in a brain scanner (head in the cutaway bore), a scientist in a lab coat behind the bed, a monitor on top of the scanner, all on screen at the cut, camera pushing in; shock lines + wide eyes on "twist"; scientist raises a hand on "scientists"; he presses a yellow remote button on "triggered" (bore lights up); a rerun icon pops on the monitor on "purpose"',
      draw(lt, d, t) {
        K.hgLab(LAB_FLOOR - 54);
        const press = lt > tr;
        K.doctor({ x: 330, y: LAB_FLOOR - 620 * 0.5, s: 0.5, eyes: 'n', mouth: lt > sc ? 'smirk' : 'smile', brow: 0.4, look: 0.6,
          arm: press ? K.armPose(K.ARM.wave, { e: [240, -40], h: [300, 40] }, eo(seg(lt, tr - 0.15, tr))) : K.armPose(K.ARM.down, K.ARM.wave, eo(seg(lt, sc, sc + 0.2))),
          holding: (x, y) => remote(x + 10, y + 10, press ? 1 : 0) });
        K.dvScanner(SX, SY, SS, { glow: eo(seg(lt, tr, tr + 0.3)), face: { eyes: lt > tw ? 'wide' : 'n', brow: lt > tw ? 1 : 0.3, mouth: lt > tw ? 'o' : 'flat' }, t });
        K.dvMonitor(800, 330, 300, 210, { inner: () => { K.dvXBrain(0, 6, 0.36, { t, zones: 1 }); }, scan: press ? ((lt - tr) * 1.2) % 1 : -1 });
        K.dvRerunIcon(800, 330, 0.75, pop(lt, pu, 0.25), lt * 3);
        K.shockLines(hx + 10, hy - 70, 70, blip(lt, tw, 0.6));
        const [rx, ry] = [330 + 300 * 0.5 + 10, LAB_FLOOR - 310 + 40 * 0.5 - 8];
        K.burst(rx, ry, 0.7, blip(lt, tr, 0.4));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.5 }); cue(st + sc, 'pop', { gain: 0.4 }); cue(st + tr, 'pop', { gain: 0.6 }); cue(st + tr + 0.05, 'alarm', { dur: 0.6, gain: 0.15 }); cue(st + pu, 'sparkle', { dur: 0.5, gain: 0.35 });
  }

  // ── 7a · "With words like bed, pillow and dream," (word cards over the scanner) ──
  {
    const st = at('with', 6), wo = Wd('words', 6) - st, be = Wd('bed', 6) - st, pi = Wd('pillow', 6) - st, an = Wd('and', 6) - st, dr = Wd('dream', 6) - st;
    const SLOTS = [[230, 300], [540, 300], [850, 300], [385, 480], [695, 480]];
    const CARDS = [['BED', be], ['PILLOW', pi], ['NIGHT', an], ['DREAM', dr]];
    add({ id: 'S09', at: st, cam: [540, 620], zoom: 0.07, note: 'lab wall, the scanner bore close-up at the bottom (hero head inside, looking up), five dashed card slots + the 5th card already there: a BLANK card with a faint "S" (rewatch: SLEEP, the missing linking word), on screen at the cut; slots bounce on "words"; cards fly in from the right: BED on "bed", PILLOW on "pillow", NIGHT on "and", DREAM on "dream"',
      draw(lt, d, t) {
        K.hgLab(1140 - 54);
        K.dvScanner(640, 880, 0.75, { glow: 1, face: { eyes: 'n', brow: 0.6, mouth: 'flat', look: 0.3 }, t });
        const bo = 1 + 0.06 * blip(lt, wo, 0.3);
        SLOTS.slice(0, 4).forEach(([x, y]) => K.dvWordCard('', x, y, bo, { slot: true }));
        K.dvWordCard('S', SLOTS[4][0], SLOTS[4][1], 1, { faint: 1, sc: enter(lt), rot: 0.03 });
        CARDS.forEach(([w, a], i) => {
          if (lt < a - 0.05) return;
          const u = eo(seg(lt, a - 0.05, a + 0.2)), [x, y] = SLOTS[i];
          K.dvWordCard(w, lerp(i === 3 ? -320 : 1400, x, u), y, 1, { rot: lerp(0.3, (i % 2 ? 0.03 : -0.03), u), hi: lt < a + 0.25 ? 1 : 0 });
        });
      } });
    cue(st, 'whoosh'); cue(st + wo, 'boing', { gain: 0.3 }); for (const a of [be, pi, an, dr]) cue(st + a - 0.05, 'zip', { gain: 0.4 });
  }

  // ── 7b · "sixteen of twenty-one felt it." (21 volunteers, 16 light up) ──
  {
    const st = at('sixteen', 6), si = Wd('sixteen', 6) - st, tw = Wd('twenty', 6) - st, fe = Wd('felt', 6) - st;
    const LIT = [0, 2, 3, 5, 6, 7, 8, 10, 11, 13, 14, 15, 17, 18, 19, 20];
    add({ id: 'S10', at: st, cam: [540, 640], zoom: 0.06, note: '21 grey volunteer icons in three rows (on screen at the cut); yellow "16" pill on "sixteen" while 16 of them turn blue one by one; the pill becomes "16 OF 21" on "twenty-one"; the 16 hop + sparkle on "felt"',
      draw(lt, d, t) {
        plain();
        for (let i = 0; i < 21; i++) {
          const r = Math.floor(i / 7), c = i % 7, x = 120 + c * 140, y = 440 + r * 220, k = LIT.indexOf(i);
          const lit = k >= 0 && lt > lerp(si, tw - 0.05, k / 16);
          const hop = lit ? 22 * blip(lt, fe + c * 0.03, 0.35) : 0;
          K.personIcon(x, y - hop, 0.7, lit ? C.shirt : C.gumEdge);
          if (lit) K.sparkle4(x + 50, y - 110, 22, pop(lt, fe + c * 0.03, 0.2) * out(lt, fe + 0.45, 0.2));
        }
        const two = lt > tw;
        K.pill(two ? '16 OF 21' : '16', 540, 210, 80, C.yellow, C.ink, two ? lerp(0.9, 1, eob(seg(lt, tw, tw + 0.25))) : pop(lt, si));
      } });
    cue(st, 'whoosh'); cue(st + si, 'pop', { gain: 0.65 }); cue(st + si, 'slide', { dur: tw - si, gain: 0.2 }); cue(st + tw, 'pop', { gain: 0.6 }); cue(st + fe, 'sparkle', { dur: 0.5, gain: 0.35 });
  }

  // ── 8 · ANSWER "Answer: your decision-maker, fact-checking the memory." ──
  {
    const st = at('answer', 7), an = Wd('answer', 7) - st, de = Wd('decision', 7) - st, fa = Wd('fact', 7) - st, me = Wd('memory', 7) - st;
    const F = K.DVB.mag, M = [K.DVB.mem[0] + 30, K.DVB.mem[1] - 30];
    add({ id: 'S11', at: st, cam: [540, 900], zoom: 0.05, note: 'ANSWER: the guess brain + A / B pills in the same spots (on screen at the cut); a cyan scan bar sweeps on "Answer"; on "decision-maker" the FRONT area lights yellow, check on B, A dims, the memory area stays dark; COMMENT A OR B pill ~1.2 s (not voiced); on "fact-checking" the little magnifier at the front lights up and glides over the memory area; dashed memory outline flashes on "memory"',
      draw(lt, d, t) {
        K.xray(t);
        const glide = eio(seg(lt, fa, fa + 0.6));
        K.dvXBrain(BR[0], BR[1], BR[2], { t, zones: 1 - 0.6 * seg(lt, de, de + 0.3) + 0.6 * blip(lt, me, 0.5), front: pop(lt, de, 0.3), mag: pop(lt, fa, 0.25), magAt: [lerp(F[0], M[0], glide), lerp(F[1], M[1], glide)] });
        const sb = seg(lt, an, an + 0.5);
        if (lt > an && sb < 1) { ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = C.cyan; ctx.fillRect(-300, lerp(200, 900, sb) - 50, W + 600, 50); ctx.restore(); }
        K.abPill('A', 'MEMORY', PA[0], PA[1], PS, { dim: seg(lt, de, de + 0.3) });
        K.abPill('B', 'DECISION-MAKER', PB[0], PB[1], PS, { check: pop(lt, de, 0.3), hi: blip(lt, de, 0.45) });
        K.pill('COMMENT A OR B', 540, 170, 44, C.yellow, C.ink, pop(lt, de + 0.45, 0.25) * out(lt, de + 1.7, 0.2));
      } });
    cue(st, 'whoosh'); cue(st + an, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + de, 'pop', { gain: 0.8 }); cue(st + de + 0.05, 'sparkle', { dur: 0.5, gain: 0.3 }); cue(st + de + 0.45, 'pop', { gain: 0.3 });
    cue(st + fa, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + me, 'tock', { gain: 0.45 });
  }

  // ── 9a · "Lasts over a few seconds, or brings confusion?" (calm: stopwatch + a puzzled head) ──
  {
    const st = at('lasts', 8), ov = Wd('over', 8) - st, fe = Wd('few', 8) - st, se = Wd('seconds', 8) - st, br = Wd('brings', 8) - st, co = Wd('confusion', 8) - st;
    const FEW = 1.1, SPD = FEW / se;
    add({ id: 'S12', at: st, cam: [540, 640], zoom: 0.06, note: 'calm card: a big stopwatch on plain paper (on screen at the cut), its hand sweeping; a yellow "few seconds" wedge appears on "few"; the hand passes the wedge on "seconds" and the part past it shades red ("over"); on "brings" a calm hero head pops in to the right, a thought cloud with "?" on "confusion" (no seizure visuals)',
      draw(lt, d, t) {
        plain();
        const ang = lt * SPD;
        K.dvTimer(420, 640, 0.9, ang, { few: seg(lt, fe - 0.1, fe + 0.1), fewA: FEW, over: seg(lt, se, se + 0.2) });
                const hs = pop(lt, br, 0.3);
        if (hs > 0) K.heroHead(850, 720, 0.95 * hs, { eyes: 'n', mouth: 'flat', brow: 0.7, look: -0.5 });
        K.fbThought(870, 400, 0.85, { sc: pop(lt, co, 0.3), t, tx: 850, ty: 560 });
        void ov;
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'tock', { gain: 0.3 }); cue(st + fe, 'pop', { gain: 0.45 }); cue(st + se, 'tock', { gain: 0.5 }); cue(st + br, 'pop', { gain: 0.4 }); cue(st + co, 'boing', { gain: 0.3 });
  }

  // ── 9b · "See a doctor." ──
  {
    const st = at('see', 8), dc = Wd('doctor', 8) - st;
    const FL = 930;
    add({ id: 'S13', at: st, cam: [540, 640], zoom: 0.06, note: 'calm clinic front with a red-cross sign (on screen at the cut), the door swings open (warm light) right after the cut; a friendly doctor stands beside it and waves on "doctor"',
      draw(lt, d, t) {
        plain(); ctx.fillStyle = C.floor; ctx.fillRect(-300, FL, W + 600, H);
        K.pcClinic(400, FL - 260 * 1.1, 1.1, { open: eo(seg(lt, 0.05, 0.4)), sc: enter(lt) });
        const wv = eo(seg(lt, dc - 0.1, dc + 0.15));
        K.doctor({ x: 820, y: FL - 620 * 0.5, s: 0.5, eyes: 'n', mouth: 'smile', brow: 0.4, look: -0.4, arm: K.armPose(K.ARM.down, K.ARM.wave, wv), finger: null });
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.3, gain: 0.25 }); cue(st + dc, 'pop', { gain: 0.5 });
  }

  // ── 10a · TEASE "Next Body File: sweat, up to four million" (starts on "Next") ──
  const badge = (x, y, sc, size = 44) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = at('next', 9), bo = Wd('body', 9) - st, sw = Wd('sweat', 9) - st, fo = Wd('four', 9) - st, mi = Wd('million', 9) - st;
    add({ id: 'S14', at: st, cam: [540, 640], zoom: 0.06, note: 'tease (cut on "Next"): skin cross-section with three coiled sweat glands + yellow NEXT pill on screen at the cut; BODY FILES badge on "Body"; sweat drops bead out of the pores on "sweat"; yellow "UP TO 4 MILLION" pill on "four"; the gland coils glow yellow on "million"',
      draw(lt, d, t) {
        plain();
        K.dvSweatSkin(540, 680, 1, { bead: eo(seg(lt, sw - 0.05, sw + 0.5)), glow: pop(lt, mi, 0.25), t, sc: enter(lt) });
        K.pill('NEXT', 540, 170, 64, C.yellow, C.ink, pop(lt, 0.03, 0.25));
        badge(540, 300, pop(lt, bo));
        K.pill('UP TO 4 MILLION', 540, 1060, 50, C.yellow, C.ink, pop(lt, fo));
      } });
    cue(st, 'whoosh'); cue(st + 0.03, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.4 }); cue(st + sw, 'plop', { gain: 0.45 }); cue(st + sw + 0.2, 'plop', { gain: 0.35 }); cue(st + fo, 'pop', { gain: 0.6 }); cue(st + mi, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 10b · LOOP "glands." (back to the exact frame-1 picture) ──
  {
    const st = at('glands', 9), Z = 0;
    add({ id: 'S15', at: st, cam: HOOK_CAM, zoom: Z, note: 'LOOP + END CARD: the exact frame-1 café doorway (same strip scroll + steam phase via the scene clock t - T_LAST, same camera, no push), a sweat drop on the hero\'s forehead at the cut that runs down and fades by ~0.8 s; end card from ~0.35 s in the clear top band: BODY FILES + FOLLOW top left, sweat-drop badge + NEXT top right',
      draw(lt, d, t) {
        const tl = t - T_LAST;                                  // scene clock: the last frame draws exactly like frame 0
        hookScene(tl);
        const da = 1 - seg(lt, 0.5, 0.8);
        K.drop(HERO.x + 34, HY - 380 * HERO.s + lerp(0, 60, eio(seg(lt, 0.1, 0.8))), 0.55, 0, da);
        const k = (1 + 0.13 * (1 - eo(clamp(lt / 0.32)))) * (1 + Z * eio(clamp(lt / d)));
        ctx.save(); ctx.translate(HOOK_CAM[0], HOOK_CAM[1]); ctx.scale(1 / k, 1 / k); ctx.translate(-HOOK_CAM[0], -HOOK_CAM[1]);
        badge(215, 75, pop(lt, 0.35, 0.3), 32);
        K.followPill(160, 150, pop(lt, 0.55), t, 32);
        K.dvDropBadge(935, 112, 0.33, pop(lt, 0.35, 0.3));
        K.pill('NEXT', 790, 112, 34, C.yellow, C.ink, pop(lt, 0.4, 0.3));
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'plop', { gain: 0.3 }); cue(st + 0.35, 'pop', { gain: 0.4 }); cue(st + 0.55, 'pop', { gain: 0.5 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES, loop: true };
}
