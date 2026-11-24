// WHAT HAPPENS IF YOU HOLD IN A SNEEZE?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): x-ray film, the hero's x-ray head + neck (K.sneezeXray) frozen mid "ah-" (eyes
// squeezed, lips pressed, cheeks puffed), the yellow sneeze blast bouncing trapped inside (nose → ear → throat → ear → mouth),
// white pressure ticks round the head, red "MYTH: HARMLESS" stamp at the top. No title card.
// Guess (line 2): A EARS / B THROAT pills in the stamp's spot. Answer (line 6): check on B, A dims, tiny "pharynx" label at the
// crack, small "7 DAYS / BMJ Case Reports 2018" wristband in the corner (rewatch detail), ~1 s "COMMENT A OR B" (not voiced).
// Re-hook (line 4): hard push into the cyan x-ray chest; air bubbles crackle down the neck and stop at the ribcage line.
// Safety: no hands near the nose or mouth, no stifling shown (the "blocked" beat = red stop bars on a schematic), no gore.
// Last shot = the frame-1 framing again + BODY FILES badge + FOLLOW + a small stand-up-fast badge with NEXT (the tease).
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
  // x-ray tag: white pill + cyan pointer (readable on the navy film)
  const xtag = (text, x, y, tx, ty, size, sc) => { if (sc <= 0) return; ctx.save(); ctx.globalAlpha = clamp(sc); line([[x, y], [tx, ty]], C.cyan, 7); ctx.restore(); K.pill(text, x, y, size, C.white, C.ink, sc); };

  // ── the HOOK framing (frame 1 + loop ending) ──
  const B = { x: 540, y: 700, s: 1.15 };
  const bp = (k) => K.sxPt(B.x, B.y, B.s, k);
  const hookScene = (t, o = {}) => { K.xray(t); K.sneezeXray(B.x, B.y, B.s, { t, blast: 1, press: 1, puff: 1, ...o }); };
  const mythStamp = (sc) => K.stamp('MYTH: HARMLESS', 540, 205, 60, -0.06, sc);
  const PA = [540, 150], PB = [540, 285], PS = 58;
  const pills = ({ scA = 1, scB = 1, hiA = 0, hiB = 0, check = 0, dim = 0 } = {}) => {
    K.abPill('A', 'EARS', PA[0], PA[1], PS, { sc: scA, hi: hiA, dim });
    K.abPill('B', 'THROAT', PB[0], PB[1], PS, { sc: scB, hi: hiB, check });
  };
  const COMMENT = [770, 1192];
  const commentPill = (sc) => K.pill('COMMENT A OR B', COMMENT[0], COMMENT[1], 36, C.ink, C.yellow, sc);

  // ── 1 · HOOK "What happens if you hold in a sneeze?" (frame 1 carries it: trapped blast + MYTH stamp) ──
  {
    const st = cut(0), ho = Wd('hold', 0) - st, sn = Wd('sneeze', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 640], zoom: 0.06, note: 'FRAME 1: x-ray head+neck frozen mid "ah-" (eyes squeezed, cheeks puffed, lips shut), yellow blast already bouncing trapped inside, pressure ticks, red MYTH: HARMLESS stamp already on (settles in 0.15 s); on "hold" the blast flares, on "sneeze" the head shakes harder',
      draw(lt, d, t) {
        const fl = blip(lt, ho, 0.4) + blip(lt, sn, 0.4);
        hookScene(t, { blastR: 50 + 16 * fl, press: 0.8 + 0.2 * fl });
        mythStamp(lerp(1.18, 1, eo(seg(lt, 0, 0.15))));
      } });
    cue(st + 0.02, 'slam', { gain: 0.7 }); cue(st + 0.1, 'alarm', { dur: 1.8, gain: 0.25 }); cue(st + ho, 'boing', { gain: 0.4 }); cue(st + sn, 'thud', { gain: 0.5 });
  }

  // ── 2 · "Myth: it's harmless." (room: hero shrugs it off; MYTH stamp, HARMLESS crossed out) ──
  {
    const st = cut(1), my = Wd('myth', 1) - st, ha = Wd('harmless', 1) - st;
    const SHRUG = { e: [250, -40], h: [330, -170] };
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.06, note: 'room: hero close-up shrugging it off (smirk, palms up); red MYTH stamp slams on "Myth"; a HARMLESS pill pops on "harmless" and a red line strikes through it',
      draw(lt) {
        K.room();
        const sh = eio(seg(lt, 0, 0.35));
        K.man({ x: 540, y: 1250, s: 1.55, arm: K.armPose(K.ARM.down, SHRUG, sh), armL: K.armPose(K.ARM.down, SHRUG, sh), mouth: 'smirk', smirk: true, brow: 0.5 });
        K.stamp('MYTH', 540, 230, 96, -0.1, pop(lt, my, 0.2));
        K.pill('HARMLESS', 560, 430, 64, C.ink, C.white, pop(lt, ha, 0.25));
        if (lt > ha + 0.2) { const p = eo(seg(lt, ha + 0.2, ha + 0.4)); line([[330, 432], [lerp(330, 750, p), 408]], C.red, 16); }
      } });
    cue(st, 'whoosh'); cue(st + my, 'slam', { gain: 0.8 }); cue(st + ha, 'pop', { gain: 0.6 }); cue(st + ha + 0.2, 'zip', { gain: 0.4 });
  }

  // ── 3 · "Fact: one man spent seven days in hospital." (hospital bed + 7 DAYS wristband) ──
  {
    const st = at('fact', 1), fa = Wd('fact', 1) - st, on = Wd('one', 1) - st, se = Wd('seven', 1) - st, ho = Wd('hospital', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 820], zoom: 0.07, note: 'calm hospital room: hero lying in a bed (awake, calm) on screen from the cut; FACT pill on "Fact"; a yellow ring round him on "one man"; a big hospital wristband "7 DAYS" (fine print BMJ Case Reports 2018) drops in on "seven"; the red-cross sign pulses on "hospital"',
      draw(lt, d, t) {
        K.hospitalRoom();
        K.bed(500, 1060, 0.95, { sleeper: { eyes: 'n', mouth: 'flat', brow: 0.3 }, breathe: 0.5 + 0.5 * Math.sin(t * 2.4) });
        K.pill('FACT', 540, 500, 70, C.yellow, C.ink, pop(lt, fa, 0.25));
        if (lt > on) K.hiRing(310, 975, 130, 95, eo(seg(lt, on, on + 0.3)));
        const wp = eob(seg(lt, se - 0.1, se + 0.25));
        if (lt > se - 0.1) K.wristband(540, lerp(-200, 690, wp), 1.05, '7 DAYS', 'BMJ Case Reports 2018', { rot: lerp(-0.25, -0.04, wp) });
        if (lt > ho) K.burst(760, 270, 0.8, 1 - seg(lt, ho + 0.15, ho + 0.6));
      } });
    cue(st, 'whoosh'); cue(st + fa, 'pop', { gain: 0.6 }); cue(st + on, 'pop', { gain: 0.4 }); cue(st + se + 0.15, 'thud'); cue(st + ho, 'tock', { gain: 0.4 });
  }

  // ── 4 · "He blocked his nose and mouth." (schematic: red stop bars over the exits, no hands) ──
  {
    const st = cut(2), bl = Wd('blocked', 2) - st, no = Wd('nose', 2) - st, mo = Wd('mouth', 2) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.12, note: 'x-ray head close: blast bouncing inside; schematic red stop bar slams over the nostrils on "nose", over the lips on "mouth" (no hands, nothing near the face); pressure ticks rise from "blocked"',
      draw(lt, d, t) {
        hookScene(t, { press: 0.4 + 0.6 * seg(lt, bl, bl + 0.4), block: [pop(lt, no, 0.2), pop(lt, mo, 0.2)] });
      } });
    cue(st, 'whoosh'); cue(st + no, 'slam', { gain: 0.6 }); cue(st + mo, 'slam', { gain: 0.7 });
  }

  // ── 5 · GUESS "Where did the blast go? Ears, or throat?" (A/B pills on the spoken options) ──
  {
    const st = at('where', 2), bl = Wd('blast', 2) - st, ea = Wd('ears', 2) - st, th = Wd('throat', 2) - st;
    add({ id: 'S05', at: st, cam: [540, 600], zoom: 0.05, note: 'GUESS: frame-1 framing with both exits barred; the blast flares big on "blast" and bounces faster; pill A EARS pops on "Ears" + yellow rings on both ears; pill B THROAT pops on "throat" + yellow ring on the throat (ear rings fade back)',
      draw(lt, d, t) {
        const fl = blip(lt, bl, 0.45);
        hookScene(t, { block: [1, 1], speed: 2.2 + 1.2 * seg(lt, bl, bl + 0.3), blastR: 50 + 22 * fl,
          ears: lt > ea ? eo(seg(lt, ea, ea + 0.25)) * (lt > th ? lerp(1, 0.35, seg(lt, th, th + 0.3)) : 1) : 0, throat: lt > th ? eo(seg(lt, th, th + 0.25)) : 0 });
        pills({ scA: pop(lt, ea), scB: pop(lt, th), hiA: blip(lt, ea, 0.4), hiB: blip(lt, th, 0.4) });
      } });
    cue(st, 'whoosh'); cue(st + bl, 'boing', { gain: 0.5 }); cue(st + ea, 'pop', { gain: 0.8 }); cue(st + th, 'pop', { gain: 0.8 });
  }

  // ── 6 · RELATABLE "Ever choked one back in a silent meeting?" (meeting room, the tickle face, everyone quiet) ──
  {
    const st = cut(3), ch = Wd('choked', 3) - st, si = Wd('silent', 3) - st, me = Wd('meeting', 3) - st;
    add({ id: 'S06', at: st, cam: [540, 700], zoom: 0.07, note: 'meeting room: hero seated at the table mid "ah-" (eyes squeezed, brows up, small open mouth, no hands near the face), coworkers either side; sweat drop on "choked"; a "SHH..." bubble pops on "silent"; the chart screen dings a small yellow "..." on "meeting"',
      draw(lt, d, t) {
        K.meetingRoom();
        K.personIcon(165, 880, 1.35, '#5A6B8C');
        K.personIcon(915, 880, 1.35, C.pot);
        const tick = Math.sin(t * 9) * 0.05;
        ctx.save(); ctx.translate(540, 880); ctx.rotate(-0.06 + tick); ctx.translate(-540, -880);
        K.man({ x: 540, y: 880, s: 0.95, sit: true, eyes: 'squeeze', mouth: 'o', brow: 1, sweat: seg(lt, ch, ch + 0.3) });
        ctx.restore();
        K.meetingTable(540, 1010, 1);
        bigText('ah-', 760, 420, 76, C.yellow, -0.12, pop(lt, 0.04, 0.25));
        const bs = pop(lt, si, 0.3);
        K.bubble(830, 250, 300, 150, 900, 400, bs);
        if (bs > 0) bigText('SHH...', 830, 250, 64, C.white, 0, bs);
        if (lt > me) K.pill('...', 260, 470, 40, C.yellow, C.ink, pop(lt, me, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + ch, 'gulp', { gain: 0.5 }); cue(st + si, 'pop', { gain: 0.6 }); cue(st + me, 'tock', { gain: 0.4 });
  }

  // ── 7a · RE-HOOK "But here's the weird part:" (hard push into the x-ray chest) ──
  const MAN7 = { x: 540, y: 1150, s: 2.0 };
  {
    const st = cut(4), we = Wd('weird', 4) - st;
    add({ id: 'S07', at: st, cam: [540, 780], zoom: 0.35, note: 'RE-HOOK: new mode, x-ray film: full x-ray hero (head normal, eyes wide) and the camera pushes hard toward his neck/upper chest; yellow "?!" pops on "weird"',
      draw(lt, d, t) {
        K.xray(t);
        K.man({ x: 540, y: 1250, s: 1.25, xray: true, lungs: 0, eyes: 'wide', mouth: 'o', brow: 1 });
        bigText('?!', 830, 330, 150, C.yellow, 0.12, pop(lt, we, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'zip', { gain: 0.5 }); cue(st + we, 'boing', { gain: 0.6 });
  }
  // ── 7b · "his skin crackled, down to his ribs." (bubbles crackle under the skin and stop at the ribcage) ──
  const neckClip = () => {
    ctx.beginPath(); ctx.moveTo(472, 684); ctx.lineTo(608, 684); ctx.lineTo(608, 726); ctx.lineTo(650, 722);
    ctx.quadraticCurveTo(820, 730, 840, 800); ctx.lineTo(850, 960); ctx.lineTo(230, 960); ctx.lineTo(240, 800); ctx.quadraticCurveTo(260, 730, 430, 722); ctx.lineTo(472, 726); ctx.closePath();
  };
  const RIB_Y = 872;
  {
    const st = at('his', 4), sk = Wd('skin', 4) - st, cr = Wd('crackled', 4) - st, dn = Wd('down', 4) - st, ri = Wd('ribs', 4) - st;
    add({ id: 'S08', at: st, cam: [540, 780], zoom: 0.08, note: 'x-ray close-up of neck + upper chest (head normal, worried): small white air bubbles appear under the skin of the neck on "skin", crackle with yellow sparks on "crackled", spread down from "down" and stop exactly at a yellow dashed ribcage line that draws on "ribs"',
      draw(lt, d, t) {
        K.xray(t);
        K.man({ ...MAN7, xray: true, lungs: 0, eyes: 'wide', mouth: 'o', brow: 1 });
        const p = lt < dn ? 0.35 * eo(seg(lt, sk - 0.05, sk + 0.4)) : lerp(0.35, 1, eio(seg(lt, dn, ri + 0.1)));
        ctx.save(); neckClip(); ctx.clip();
        K.airPocket(540, 780, 300, 110, { p, t, crackle: lt > cr ? 1 : 0, n: 46, seed: 2, stopY: RIB_Y - 14, r0: 15 });
        ctx.restore();
        if (lt > ri - 0.05) { const q = eo(seg(lt, ri - 0.05, ri + 0.3)); ctx.save(); ctx.setLineDash([26, 18]); line([[190, RIB_Y], [lerp(190, 890, q), RIB_Y]], C.yellow, 12); ctx.restore(); K.pill('RIBCAGE', 850, RIB_Y + 64, 40, C.white, C.ink, pop(lt, ri + 0.1, 0.25)); }
      } });
    cue(st, 'whoosh'); cue(st + sk, 'bubbles', { dur: 0.5, gain: 0.4 }); cue(st + cr, 'sizzle', { dur: 0.9, gain: 0.45 }); cue(st + dn, 'slide', { dur: ri - dn, gain: 0.3 }); cue(st + ri, 'pop', { gain: 0.6 });
  }

  // ── 8 · "Air had leaked deep into his chest." (bubbles flow down into the middle of the chest) ──
  {
    const st = cut(5), ai = Wd('air', 5) - st, le = Wd('leaked', 5) - st, de = Wd('deep', 5) - st, che = Wd('chest', 5) - st;
    const M = { x: 540, y: 960, s: 1.45 }, MX = 540, MY = M.y - 70 * M.s;
    add({ id: 'S09', at: st, cam: [540, 820], zoom: 0.08, note: 'x-ray hero, chest with lungs + windpipe; a cluster of air bubbles already in the neck; AIR tag on "Air"; on "leaked" bubbles stream down beside the windpipe; on "deep" a yellow arrow points down; on "chest" the bubble cluster fills the middle of the chest between the lungs',
      draw(lt, d, t) {
        K.xray(t);
        K.man({ ...M, xray: true, lungs: 0, eyes: 'wide', mouth: 'flat', brow: 0.7 });
        K.airPocket(MX, M.y - 228 * M.s, 40, 34, { p: 1, t, n: 8, seed: 9, r0: 11 });
        const flow = eio(seg(lt, le, che + 0.3));
        K.airPocket(MX, MY, 60, 130, { p: flow, t, crackle: 0.6, n: 22, seed: 4, r0: 12 });
        K.flowArrow(820, 870, 260, Math.PI / 2, pop(lt, de, 0.25), C.yellow, 24, C.ink);
        xtag('AIR', 250, 560, MX - 30, M.y - 228 * M.s, 50, pop(lt, ai, 0.25));
        if (lt > che) K.hiRing(MX, MY, 120, 200, eo(seg(lt, che, che + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + ai, 'pop', { gain: 0.6 }); cue(st + le, 'bubbles', { dur: 1.2, gain: 0.4 }); cue(st + de, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + che, 'thud', { gain: 0.5 });
  }

  // ── 9 · ANSWER "His throat." (frame-1 framing, check on B, small crack + pharynx label, wristband, COMMENT pill) ──
  {
    const st = cut(6), th = Wd('throat', 6) - st;
    const [tx, ty] = bp('throat');
    add({ id: 'S10', at: st, cam: [540, 640], zoom: 0.05, note: 'ANSWER: frame-1 framing, the pills back in place; on "throat" a green check pops right of B THROAT, A dims, yellow ring on the throat and a small cyan crack draws on its back wall with a tiny "pharynx" label; bubbles leak into the neck; small hospital wristband "7 DAYS / BMJ Case Reports 2018" bottom-left (rewatch); COMMENT A OR B pill ~1 s (not voiced)',
      draw(lt, d, t) {
        hookScene(t, { block: [1, 1], blast: 1 - seg(lt, th, th + 0.2), press: 1 - seg(lt, th, th + 0.3), throat: lt > th ? eo(seg(lt, th, th + 0.25)) : 0.3,
          tear: seg(lt, th, th + 0.3), leak: seg(lt, th + 0.1, th + 0.6) });
        if (lt > th) K.burst(tx, ty, 0.9, 1 - seg(lt, th + 0.1, th + 0.5));
        pills({ check: pop(lt, th, 0.3), dim: seg(lt, th, th + 0.3), hiB: blip(lt, th, 0.4) });
        xtag('pharynx', 850, 900, tx + 18, ty + 6, 30, pop(lt, th + 0.2, 0.25));
        K.wristband(245, 1160, 0.5, '7 DAYS', 'BMJ Case Reports 2018', { rot: -0.06, sc: pop(lt, 0.03, 0.25) });
        commentPill(pop(lt, th + 0.35, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + th, 'pop', { gain: 0.9 }); cue(st + th + 0.05, 'slam', { gain: 0.5 }); cue(st + th + 0.35, 'pop', { gain: 0.35 });
  }
  const commentEnd = Wd('throat', 6) + 0.35 + 1.0;

  // ── 10a · "Torn, then healed." (close-up of the throat crack, it closes) ──
  {
    const st = cut(7), to = Wd('torn', 7) - st, he = Wd('healed', 7) - st;
    const s2 = 1.9, X2 = 540, Y2 = 720 - K.SX.throat[1] * s2;
    add({ id: 'S11', at: st, cam: [540, 720], zoom: 0.1, note: 'push-in on the x-ray throat (mouth, jaw, neck fill the frame): the small cyan crack flashes on "Torn"; on "healed" it closes into a fresh pink patch with sparkles + green check; COMMENT A OR B pill finishes its ~1 s',
      draw(lt, d, t) {
        K.xray(t);
        K.sneezeXray(X2, Y2, s2, { t, puff: 0.3, eyes: 'closed', tear: 1, heal: eio(seg(lt, he, he + 0.4)), throat: blip(lt, to, 0.4) });
        const hp = seg(lt, he, he + 0.6);
        if (hp > 0 && hp < 1) for (let k = 0; k < 4; k++) K.sparkle4(540 + Math.cos(k * 1.7) * 120, 720 + Math.sin(k * 1.7) * 110, 34, Math.sin(Math.PI * hp), k);
        K.checkMark(760, 560, 0.9, pop(lt, he + 0.15, 0.3));
        commentPill(t < commentEnd ? out(t, commentEnd - 0.2, 0.2) : 0);
      } });
    cue(st, 'whoosh'); cue(st + to, 'tock', { gain: 0.5 }); cue(st + he, 'sparkle', { dur: 0.6, gain: 0.5 }); cue(st + he + 0.15, 'pop', { gain: 0.5 });
  }
  // ── 10b · "Doctors say: let it out." (doctor badge; hero sneezes into his elbow) ──
  {
    const st = at('doctors', 7), dc = Wd('doctors', 7) - st, le = Wd('let', 7) - st, ou = Wd('out', 7) - st;
    add({ id: 'S12', at: st, cam: [540, 780], zoom: 0.06, note: 'room: hero on screen from the cut; doctor badge pops on "Doctors"; from "let" he lifts his elbow in front of his face (eyes squeezed); on "out" soft sneeze puffs burst out at the elbow, then he smiles; green check',
      draw(lt, d, t) {
        K.room();
        const up = eio(seg(lt, le - 0.2, le + 0.15)), sneezed = lt > ou + 0.5;
        K.man({ x: 560, y: 1250, s: 1.55, arm: K.armPose(K.ARM.down, K.ARM.elbow, sneezed ? 1 - eio(seg(lt, ou + 0.5, ou + 0.8)) : up), eyes: lt > le && !sneezed ? 'squeeze' : 'n', mouth: sneezed ? 'smile' : 'flat', brow: 0.5 });
        K.sneezeSpray(470, 835, 1.0, seg(lt, ou, ou + 0.7), -1, { d0: 10, reach: 120, ang: -0.4 });
        K.doctorBadge(220, 330, 0.75, pop(lt, dc));
        K.checkMark(860, 360, 1, pop(lt, ou + 0.55));
      } });
    cue(st, 'whoosh'); cue(st + dc, 'pop', { gain: 0.6 }); cue(st + ou, 'zip', { gain: 0.5 }); cue(st + ou + 0.55, 'pop', { gain: 0.6 });
  }

  // ── 11a · TEASE "Next Body File: why standing up fast blurs your vision." ──
  const badge = (x, y, sc, size = 50) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = cut(8), nx = Wd('next', 8) - st, bo = Wd('body', 8) - st, sd = Wd('standing', 8) - st, fa = Wd('fast', 8) - st, bl = Wd('blurs', 8) - st;
    const SC = 0.8, OX = 100, OY = 1170 - 1560 * SC, SOFA = [400, 1360], HX = 360;
    const SX2 = (wx) => OX + wx * SC, SY2 = (wy) => OY + wy * SC;
    add({ id: 'S13', at: st, cam: [540, 800], zoom: 0.07, note: 'tease: room + sofa, hero seated on screen from the cut; yellow NEXT pill on "Next", BODY FILES badge on "Body"; he pops up to standing on "standing" (speed lines); on "blurs" the scene doubles (ghost copy sliding) and his eyes turn to spirals',
      draw(lt, d, t) {
        const up = lt > sd + 0.1, blur = lt > bl ? eo(seg(lt, bl, bl + 0.3)) : 0;
        const scene = () => {
          plain(); ctx.fillStyle = C.floor; ctx.fillRect(-300, SY2(1560), W + 600, H);
          ctx.save(); ctx.translate(OX, OY); ctx.scale(SC, SC); K.home(); K.sofa(SOFA[0], SOFA[1], 1);
          if (!up) K.man({ x: HX, y: 1120, s: 1, sit: true, arm: K.ARM.knee, armL: K.ARM.knee, mouth: 'flat', brow: 0.3 });
          else { const hop = Math.sin(Math.PI * seg(lt, sd + 0.1, sd + 0.4)) * 50; K.man({ x: HX, y: 940 - hop, s: 1, eyes: blur > 0 ? 'spiral' : 'wide', spin: t, mouth: 'o', brow: 0.9 }); }
          ctx.restore();
        };
        scene();
        if (blur > 0) { ctx.save(); ctx.globalAlpha = 0.4 * blur; ctx.translate(26 * blur + Math.sin(t * 5) * 10, 6); scene(); ctx.restore(); }
        if (up && lt < fa + 0.6) K.speedLines(SX2(HX), SY2(600), 1 - seg(lt, fa + 0.2, fa + 0.6));
        K.pill('NEXT', 760, 330, 70, C.yellow, C.ink, pop(lt, nx, 0.25));
        badge(760, 460, pop(lt, bo, 0.3), 46);
      } });
    cue(st, 'whoosh'); cue(st + nx, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.5 }); cue(st + sd + 0.1, 'zip', { gain: 0.6 }); cue(st + bl, 'boing', { gain: 0.5 });
  }
  // ── 11b · LOOP END CARD "Now you know..." (snap back to the frame-1 framing) ──
  {
    const st = at('now', 8), kn = Wd('know', 8) - st;
    add({ id: 'S14', at: st, cam: [540, 640], zoom: 0.04, note: 'END CARD = frame-1 framing for the loop: x-ray head frozen mid "ah-", blast trapped and bouncing, MYTH: HARMLESS stamp; small stand-up-fast badge + yellow NEXT pill right of the head; BODY FILES badge bottom-left; + FOLLOW pops bottom-right after "know"',
      draw(lt, d, t) {
        hookScene(t);
        mythStamp(1);
        K.standUpBadge(895, 470, 0.55, pop(lt, 0.05, 0.3), t);
        K.pill('NEXT', 895, 600, 36, C.yellow, C.ink, pop(lt, 0.1, 0.3));
        badge(290, 1110, pop(lt, 0.05, 0.3), 40);
        K.followPill(800, 1110, pop(lt, kn + 0.2), t, 42);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slam', { gain: 0.5 }); cue(st + kn + 0.2, 'pop', { gain: 0.7 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES };
}
