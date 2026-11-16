// WHAT HAPPENS WHEN YOU LOSE YOUR VOICE?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 and the loop ending): x-ray film, the x-ray hero (left) clutching his throat mid-croak, a cyan
// K.cordsLens (right) on his slightly puffy vocal cords with the tiny "HUNDREDS OF BUZZES/SEC" label (rewatch detail), and the
// two guess pills K.abPill "A WHISPER" / "B BARELY TALK" at the top. The answer shot checks B; the last shot is the hook framing
// again with B checked + the energy-can tease (NEXT) + BODY FILES + FOLLOW. Re-hook (line 7) = zoom into the neck → the cords.
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
  const ringIn = (lt, a, d = 0.2) => (lt > a ? eo(seg(lt, a, a + d)) : 0);
  const blip = (lt, a, d = 0.35) => (lt > a ? Math.sin(Math.PI * seg(lt, a, a + d)) : 0);   // 0 → 1 → 0 flash
  const scaled = (x, y, k, fn) => { if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); fn(); ctx.restore(); };
  // x-ray tag: white pill + cyan pointer (readable on the navy film)
  const xtag = (text, x, y, tx, ty, size, sc) => { if (sc <= 0) return; ctx.save(); ctx.globalAlpha = clamp(sc); line([[x, y], [tx, ty]], C.cyan, 7); ctx.restore(); K.pill(text, x, y, size, C.white, C.ink, sc); };
  const roomAt = (floorY = 1120, k = 0.7) => {
    ctx.fillStyle = C.floor; ctx.fillRect(-300, -300, W + 600, H + 600);
    ctx.save(); ctx.translate(540, floorY); ctx.scale(k, k); ctx.translate(-540, -1560); K.home(); ctx.restore();
  };

  // ── the HOOK framing (frame 1 + loop ending) ──
  const XR = { x: 300, y: 1240, s: 1.25 };
  const NECK = [XR.x, XR.y - 220 * XR.s], MOUTH = [XR.x, XR.y - 274 * XR.s];
  const CL = [770, 690, 230];
  const PA = [540, 240], PB = [540, 388], PS = 64;
  const hookScene = (lt, t, { croak = 1, wide = false, label = 1, swell = 0.35, rough = 0.5, lensSc = 1 } = {}) => {
    K.xray(t);
    K.man({ ...XR, xray: true, lungs: 0, arm: K.ARM.throat, eyes: wide ? 'wide' : 'n', mouth: croak > 0.5 ? 'wavy' : 'flat', brow: wide ? 1 : 0.5, sad: wide ? 0.2 : 0.7 });
    K.croakLines(MOUTH[0] - 130 * XR.s, MOUTH[1] + 4, 0.8, t, croak, -1, C.white);
    // pointer from the neck to the lens (x-ray cyan)
    const dx = NECK[0] + 40 - CL[0], dy = NECK[1] - CL[1], dl = Math.hypot(dx, dy), ex = CL[0] + dx / dl * (CL[2] + 22), ey = CL[1] + dy / dl * (CL[2] + 22);
    if (lensSc > 0) { ctx.save(); ctx.globalAlpha = clamp(lensSc); line([[NECK[0] + 40, NECK[1]], [ex, ey]], C.cyan, 8); ctx.restore(); K.hiRing(NECK[0] + 10, NECK[1] + 4, 70, 46, clamp(lensSc) * 0.9); }
    K.cordsLens(CL[0], CL[1], CL[2], { swell, buzz: 1, rough, gap: 0.55, t, sc: lensSc, label });
  };
  const pills = (lt, { scA = 1, scB = 1, hiA = 0, hiB = 0, check = 0, dim = 0 } = {}) => {
    K.abPill('A', 'WHISPER', PA[0], PA[1], PS, { sc: scA, hi: hiA, dim });
    K.abPill('B', 'BARELY TALK', PB[0], PB[1], PS, { sc: scB, hi: hiB, check });
  };

  // ── 1 · HOOK: "What happens when you lose your voice?" ──
  {
    const lo = Wd('lose', 0), vo = Wd('voice', 0);
    add({ id: 'S01', at: 0, cam: [560, 700], zoom: 0.06, note: 'FRAME 1 = premise + guess: x-ray film, x-ray hero (left) clutching his throat mid-croak (croak marks at his mouth), cyan lens (right) on his slightly puffy vocal cords fluttering, tiny "HUNDREDS OF BUZZES/SEC" label under the lens; A WHISPER / B BARELY TALK pills at the top already in; on "lose" the croak marks jitter harder; on "voice" his eyes go wide and the lens bumps',
      draw(lt, d, t) {
        hookScene(lt, t, { croak: lt > lo ? 1 : 0.75, wide: lt > vo, lensSc: 1 + 0.06 * blip(lt, vo) });
        pills(lt, { scA: lt < 0.25 ? lerp(0.85, 1, eob(seg(lt, 0, 0.25))) : 1, scB: lt < 0.25 ? lerp(0.85, 1, eob(seg(lt, 0, 0.25))) : 1 });
      } });
    cue(0.05, 'whoosh', { gain: 0.5 }); cue(0.1, 'pop', { gain: 0.45 }); cue(lo, 'boing', { gain: 0.35 }); cue(vo, 'pop', { gain: 0.5 });
  }

  // ── 2 · "To save it, should you whisper, or barely talk? Guess." ──
  {
    const st = cut(1), sa = Wd('save', 1) - st, wh = Wd('whisper', 1) - st, ba = Wd('barely', 1) - st, gu = Wd('guess', 1) - st;
    const CA = [290, 640], CB = [790, 640], CW = 420, CH = 520;
    const card = (x, y, sc, fn) => scaled(x, y, sc, () => {
      ctx.beginPath(); ctx.roundRect(x - CW / 2 - 10, y - CH / 2 - 10, CW + 20, CH + 20, 46); ctx.fillStyle = C.ink; ctx.fill();
      ctx.beginPath(); ctx.roundRect(x - CW / 2, y - CH / 2, CW, CH, 38); ctx.fillStyle = C.white; ctx.fill(); fn();
    });
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.05, note: 'guess: two white cards pop in with a "?" each; on "whisper" card A shows the hero whispering (pursed mouth, finger at lips, tiny "shh" bubble) and pill A WHISPER pops under it; on "barely" card B shows the hero resting his voice (closed calm smile, pause bubble) and pill B BARELY TALK pops; on "Guess" a big yellow "?" bounces between them and both pills flash',
      draw(lt, d, t) {
        plain();
        const g = blip(lt, gu, 0.4);
        card(CA[0], CA[1], pop(lt, 0, 0.3), () => {
          if (lt < wh) { bigText('?', CA[0], CA[1], 200, C.white); return; }
          const k = pop(lt, wh, 0.25);
          scaled(CA[0], CA[1], k, () => {
            K.heroHead(CA[0], CA[1] + 40, 0.95, { mouth: 'o', eyes: 'n', brow: 0.4, look: 0.3 });
            ctx.beginPath(); ctx.roundRect(CA[0] + 6, CA[1] + 40 + 30, 22, 90, 11); ctx.fillStyle = C.skin; ctx.fill();
            K.textBubble('shh', CA[0] + 100, CA[1] - 170, 170, 100, CA[0] + 60, CA[1] - 80, 1, 52);
          });
        });
        card(CB[0], CB[1], pop(lt, 0.06, 0.3), () => {
          if (lt < ba) { bigText('?', CB[0], CB[1], 200, C.white); return; }
          const k = pop(lt, ba, 0.25);
          scaled(CB[0], CB[1], k, () => {
            K.heroHead(CB[0], CB[1] + 40, 0.95, { mouth: 'smile', eyes: 'closed', brow: 0.2 });
            K.bubble(CB[0] + 105, CB[1] - 170, 150, 110, CB[0] + 60, CB[1] - 80, 1);
            K.pauseIcon(CB[0] + 105, CB[1] - 170, 0.32, 1);
          });
        });
        K.abPill('A', 'WHISPER', CA[0], 1010, 44, { sc: pop(lt, wh), hi: g });
        K.abPill('B', 'BARELY TALK', CB[0], 1010, 44, { sc: pop(lt, ba), hi: g });
        if (lt > gu) { ctx.save(); ctx.translate(540, 640); ctx.rotate(Math.sin(t * 7) * 0.08); bigText('?', 0, 0, 260, C.yellow, 0, eob(seg(lt, gu, gu + 0.3))); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + wh, 'pop', { gain: 0.6 }); cue(st + ba, 'pop', { gain: 0.6 }); cue(st + gu, 'boing', { gain: 0.55 });
  }

  // ── 3 · "Your vocal cords buzz hundreds of times a second." ──
  {
    const st = cut(2), co = Wd('cords', 2) - st, bu = Wd('buzz', 2) - st, hu = Wd('hundreds', 2) - st, se = Wd('second', 2) - st;
    const CV = [540, 690, 1.15];
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.07, note: 'x-ray close-up: the vocal cords from above (pink ring, two pale folds in a V, dark gap) pop in; VOCAL CORDS tag on "cords"; on "buzz" the folds flutter fast with white ticks and sound waves ripple up; yellow "100s" pill on "hundreds" becomes "100s / SECOND" on "second"',
      draw(lt, d, t) {
        K.xray(t);
        const bz = lt > bu ? eo(seg(lt, bu, bu + 0.2)) : 0;
        scaled(CV[0], CV[1], lerp(0.6, 1, pop(lt, 0, 0.3)), () => K.cordsView(CV[0], CV[1], CV[2], { gap: lerp(1, 0.4, bz), buzz: bz, swell: 0.1, t }));
        K.soundWaves(CV[0], CV[1] - 300, -Math.PI / 2, t, bz, 0, 0.9);
        xtag('VOCAL CORDS', 300, 300, CV[0] - 60, CV[1] - 120, 54, pop(lt, co));
        K.pill(lt > se ? '100s / SECOND' : '100s', 540, 1130, 66, C.yellow, C.ink, pop(lt, hu) * (1 + 0.08 * blip(lt, se)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + co, 'pop', { gain: 0.55 }); cue(st + bu, 'sparkle', { dur: 0.6, gain: 0.25 }); cue(st + hu, 'pop', { gain: 0.6 }); cue(st + se, 'tock', { gain: 0.5 });
  }

  // ── 4 · "A cold swells them, so they can't vibrate cleanly," ──
  {
    const st = cut(3), cd = Wd('cold', 3) - st, sw = Wd('swells', 3) - st, vi = Wd('vibrate', 3) - st, cl = Wd('cleanly', 3) - st;
    const CV = [540, 760, 1.0];
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.06, note: 'x-ray: the cords; on "cold" a green cold virus pops at top left and drifts toward them; on "swells" the folds puff up fat and pink (gap narrows) with a red SWOLLEN pill; on "vibrate" the folds flutter unevenly and a jagged red wave appears above; small red X on the wave on "cleanly"',
      draw(lt, d, t) {
        K.xray(t);
        const s = eio(seg(lt, sw, sw + 0.5)), v = lt > vi ? eo(seg(lt, vi, vi + 0.2)) : 0;
        K.cordsView(CV[0], CV[1], CV[2], { gap: 0.6, swell: s, buzz: v, rough: 1, t });
        const dr = eio(seg(lt, cd + 0.2, sw + 0.5));
        K.virus(lerp(190, 250, dr), lerp(400, 470, dr), 0.75, { t, sc: pop(lt, cd) * out(lt, vi - 0.1, 0.25) });
        K.pill('SWOLLEN', 790, 420, 54, C.red, C.white, pop(lt, sw + 0.1) * out(lt, vi - 0.1, 0.2));
        K.voiceWave(540, 330, 560, 60, { rough: 1, t, a: v });
        K.redX(860, 330, 0.2, lt > cl ? eo(seg(lt, cl, cl + 0.15)) : 0);
      } });
    cue(st, 'whoosh'); cue(st + cd, 'pop', { gain: 0.55 }); cue(st + sw, 'boing', { gain: 0.45 }); cue(st + vi, 'alarm', { dur: 0.6, gain: 0.18 }); cue(st + cl, 'slam', { gain: 0.5 });
  }

  // ── 5 · "and your voice goes raspy, or vanishes." ──
  {
    const st = cut(4), vo = Wd('voice', 4) - st, ra = Wd('raspy', 4) - st, va = Wd('vanishes', 4) - st;
    const HX = 330, HY = 1260, HS = 1.45, BX = [770, 500];
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.06, note: 'room close-up: hero (left) talking, a speech bubble (right) with his voice as a clean white wave; on "raspy" the wave goes jagged red, his mouth wavy, brows sad; on "vanishes" the wave dies into dashes and is gone, bubble empty, he grabs his throat wide-eyed',
      draw(lt, d, t) {
        K.room();
        const rasp = lt > ra ? eo(seg(lt, ra, ra + 0.2)) : 0, gone = eio(seg(lt, va, va + 0.5));
        const grab = eio(seg(lt, va, va + 0.3));
        K.man({ x: HX, y: HY, s: HS, arm: K.armPose(K.ARM.down, K.ARM.throat, grab), look: 0.6, eyes: lt > va ? 'wide' : 'n', mouth: lt > va ? 'o' : rasp > 0.5 ? 'wavy' : (Math.sin(t * 10) > 0 ? 'o' : 'smile'), brow: lt > va ? 1 : 0.4, sad: rasp * (lt > va ? 0.2 : 0.8) });
        K.bubble(BX[0], BX[1], 470, 260, HX + 120, HY - 300 * HS, pop(lt, 0.02, 0.3));
        K.voiceWave(BX[0], BX[1], 360, 70, { rough: rasp, fade: gone, t, a: (lt > vo - 0.1 ? 1 : 0) * (1 - seg(gone, 0.75, 1)) });
        if (lt > va + 0.45) bigText('...', BX[0], BX[1] - 20, 110, C.ink, 0, eob(seg(lt, va + 0.45, va + 0.7)));
      } });
    cue(st, 'whoosh'); cue(st + vo, 'pop', { gain: 0.45 }); cue(st + ra, 'alarm', { dur: 0.5, gain: 0.2 }); cue(st + va, 'zip', { gain: 0.5 }); cue(st + va + 0.45, 'pop', { gain: 0.4 });
  }

  // ── 6 · "Ever screamed through a whole concert," ──
  {
    const st = cut(5), sc = Wd('screamed', 5) - st, co = Wd('concert', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.07, note: 'concert at night: stage lights swing, speakers thump either side; hero (centre) with both arms up screams on "screamed" (eyes squeezed, open mouth, shock lines); on "concert" the beams flash brighter and the bulbs chase',
      draw(lt, d, t) {
        const beat = 0.5 + 0.5 * Math.sin(t * 13), fl = blip(lt, co, 0.5);
        K.stageBg(t, { beat: Math.max(beat * 0.6, fl), floorY: 1180 });
        K.speaker(150, 1020, 1.0, pop(lt, 0, 0.3), beat); K.speaker(930, 1020, 1.0, pop(lt, 0.05, 0.3), 1 - beat);
        const yell = lt > sc;
        const up = eio(seg(lt, 0, 0.35)), bob = Math.sin(t * 13) * 10;
        K.man({ x: 540, y: 1190 + bob, s: 1.0, arm: K.armPose(K.ARM.down, K.ARM.wave, up), armL: K.armPose(K.ARM.down, K.ARM.wave, up), eyes: yell ? 'squeeze' : 'n', mouth: yell ? 'bawl' : 'grin', brow: 0.8 });
        K.shockLines(540, 1190 + bob - 350, 220, yell ? clamp((lt - sc) * 5) : 0);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'thud', { gain: 0.4 }); cue(st + sc, 'boing', { gain: 0.5 }); cue(st + co, 'slam', { gain: 0.45 });
  }

  // ── 7a · "then croaked at work the next morning?" ──
  {
    const st = cut(6), cr = Wd('croaked', 6) - st, wo = Wd('work', 6) - st, mo = Wd('morning', 6) - st;
    const HX = 560, HY = 1010, HS = 0.95;
    add({ id: 'S07', at: st, cam: [560, 720], zoom: 0.06, note: 'office, morning: window with the sun low, the hero behind his desk (laptop back, mug); on "croaked" he clutches his throat, wavy mouth + croak marks; on "work" the desk bumps; on "morning" a wall clock pops showing 9 o\'clock',
      draw(lt, d, t) {
        officeBg();
        const grab = eio(seg(lt, cr - 0.1, cr + 0.2)), c = lt > cr;
        K.man({ x: HX, y: HY, s: HS, sit: true, arm: K.armPose(K.ARM.down, K.ARM.throat, grab), eyes: 'n', mouth: c ? 'wavy' : 'flat', brow: 0.6, sad: c ? 0.8 : 0.4, tired: 0.4 });
        K.croakLines(HX - 140 * HS, HY - 274 * HS, 0.9, t, c ? 1 : 0, -1);
        scaled(540, 1060, 1 + 0.04 * blip(lt, wo), () => K.workDesk(540, 1060, 1.0, { t }));
        K.wallClock(860, 380, 110, { hour: 9, sc: pop(lt, mo) });
      } });
    function officeBg() {
      plain();
      ctx.fillStyle = C.floor; ctx.fillRect(-300, 1060, W + 600, H);
      ctx.beginPath(); ctx.roundRect(80, 220, 380, 420, 22); ctx.fillStyle = C.white; ctx.fill();
      ctx.beginPath(); ctx.roundRect(100, 240, 340, 380, 12); ctx.fillStyle = C.sky; ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.rect(100, 240, 340, 380); ctx.clip(); K.sun(330, 560, 0.55, 0); ctx.restore();
      ctx.fillStyle = C.white; ctx.fillRect(262, 240, 14, 380); ctx.fillRect(100, 420, 340, 14);
    }
    cue(st, 'whoosh'); cue(st + cr, 'alarm', { dur: 0.45, gain: 0.18 }); cue(st + wo, 'thud', { gain: 0.45 }); cue(st + mo, 'tock', { gain: 0.55 });
  }

  // ── 7b · "Same swelling, from yelling." ──
  {
    const st = at('same', 6), sa = Wd('same', 6) - st, sw = Wd('swelling', 6) - st, ye = Wd('yelling', 6) - st;
    const LZ = [540, 760, 250];
    add({ id: 'S08', at: st, cam: [540, 640], zoom: 0.06, note: 'x-ray: big cords lens (centre) with swollen pink folds; a green cold virus (top left) with an arrow into the lens from the start; yellow ring on the folds on "swelling"; on "yelling" a shouting hero head (top right, shock lines) pops with its own arrow into the same lens',
      draw(lt, d, t) {
        K.xray(t);
        K.cordsLens(LZ[0], LZ[1], LZ[2], { swell: 1, buzz: 0.5, rough: 1, gap: 0.5, t, sc: pop(lt, 0, 0.3) });
        K.virus(200, 330, 0.7, { t, sc: pop(lt, sa) });
        K.flowArrow(330, 470, 140, 0.75, pop(lt, sa + 0.1), C.white, 22, C.ink);
        K.hiRing(LZ[0], LZ[1], 170, 200, ringIn(lt, sw) * out(lt, d - 0.25, 0.2));
        scaled(880, 330, pop(lt, ye), () => { K.heroHead(880, 330, 0.85, { eyes: 'squeeze', mouth: 'bawl', brow: 0.9 }); K.shockLines(880, 330, 150, 1); });
        K.flowArrow(750, 470, 140, Math.PI - 0.75, pop(lt, ye + 0.1), C.white, 22, C.ink);
      } });
    cue(st, 'whoosh'); cue(st + sa, 'pop', { gain: 0.5 }); cue(st + sw, 'pop', { gain: 0.5 }); cue(st + ye, 'boing', { gain: 0.5 });
  }

  // ── 8a · RE-HOOK "But here's the weird part:" → zoom into the neck, into the cords ──
  const BIG = [540, 690, 1.3];
  {
    const st = cut(7), we = Wd('weird', 7) - st, pa = Wd('part', 7) - st;
    const N = [XR.x, XR.y - 222 * XR.s];
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.03, note: 'RE-HOOK visual change: x-ray hero (no lens, no pills) brows up on "weird", then the camera dives into his neck (fast zoom, a cyan ring opens) and lands inside on the big vocal cords by "part"',
      draw(lt, d, t) {
        const z0 = we - 0.05, z1 = pa + 0.25, e = eio(seg(lt, z0, z1)), k = lerp(1, 9, e * e);
        K.xray(t);
        if (e < 1) {
          ctx.save(); ctx.translate(lerp(N[0], 540, e), lerp(N[1], 690, e)); ctx.scale(k, k); ctx.translate(-N[0], -N[1]);
          K.man({ ...XR, xray: true, lungs: 0, eyes: lt > we ? 'wide' : 'n', mouth: lt > we ? 'o' : 'flat', brow: lt > we ? 1 : 0.4, look: 0 });
          ctx.restore();
        }
        const inn = seg(lt, z1 - 0.25, z1);
        if (inn > 0) {
          ctx.save(); ctx.globalAlpha = inn; K.xray(t); ctx.restore();
          ctx.save(); ctx.globalAlpha = inn; K.cordsView(BIG[0], BIG[1], BIG[2] * lerp(0.6, 1, eo(inn)), { gap: 1, t }); ctx.restore();
        }
        const ring = seg(lt, z0 + 0.15, z1 + 0.1);
        if (ring > 0 && ring < 1) { ctx.save(); ctx.globalAlpha = 1 - ring; ctx.beginPath(); ctx.arc(540, 690, lerp(40, 900, eo(ring)), 0, Math.PI * 2); ctx.strokeStyle = C.cyan; ctx.lineWidth = 30; ctx.stroke(); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + we, 'boing', { gain: 0.45 }); cue(st + we, 'slide', { dur: pa + 0.25 - we, gain: 0.5 }); cue(st + pa + 0.25, 'thud', { gain: 0.5 });
  }
  // ── 8b · "whispering still works those cords," ──
  {
    const st = at('whispering', 7), wh = Wd('whispering', 7) - st, sl = Wd('still', 7) - st, wo = Wd('works', 7) - st, co = Wd('cords', 7) - st;
    add({ id: 'S10', at: st, cam: [540, 690], zoom: 0.07, note: 'inside: the big cords; on "whispering" a "shh" bubble + WHISPER pill pop at the top and the folds swing in close together (they still close) and rub with a light flutter; white rub ticks on "works"; yellow ring round the folds on "cords"',
      draw(lt, d, t) {
        K.xray(t);
        const cl = eio(seg(lt, wh + 0.1, sl + 0.25)), w = lt > wo ? eo(seg(lt, wo, wo + 0.2)) : 0;
        K.cordsView(BIG[0], BIG[1], BIG[2], { gap: lerp(1, 0.18, cl), buzz: lerp(0.15, 0.6, w) * cl, t });
        K.textBubble('shh', 760, 210, 230, 120, 640, 330, pop(lt, wh), 66);
        K.pill('WHISPER', 330, 210, 56, C.white, C.ink, pop(lt, wh + 0.05));
        K.hiRing(BIG[0], BIG[1] + 10, 210, 300, ringIn(lt, co) * out(lt, d - 0.2, 0.2));
      } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + wh, 'pop', { gain: 0.5 }); cue(st + wh + 0.1, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + wo, 'sparkle', { dur: 0.5, gain: 0.25 }); cue(st + co, 'pop', { gain: 0.55 });
  }

  // ── 9 · "and the NHS says it strains your voice, like shouting." ──
  {
    const st = cut(8), nh = Wd('nhs', 8) - st, sr = Wd('strains', 8) - st, li = Wd('like', 8) - st, sh = Wd('shouting', 8) - st;
    const LA = [290, 720, 200], LB = [790, 720, 200];
    add({ id: 'S11', at: st, cam: [540, 680], zoom: 0.05, note: 'graphic: blue NHS SAYS pill on "NHS"; throat lens (centred, WHISPER pill) with pursed lips + "shh" bubble is in from the start and slides left just before "like"; on "strains" its voice box strains (jitter, red zig-zags); "=" on "like"; on "shouting" a second throat lens (right, SHOUT pill) with a wide-open shouting mouth pops with the same strain',
      draw(lt, d, t) {
        plain();
        K.pill('NHS SAYS', 540, 250, 66, C.shirt, C.white, pop(lt, nh));
        const lx = lerp(540, LA[0], eio(seg(lt, li - 0.3, li)));
        const s1 = lt > sr ? eo(seg(lt, sr, sr + 0.25)) : 0;
        K.throatLens(lx, LA[1], LA[2], { whisper: 1, strain: s1, t, sc: pop(lt, 0, 0.3) });
        K.textBubble('shh', lx + 150, LA[1] - 230, 170, 100, lx + 40, LA[1] - 140, pop(lt, 0.1) * out(lt, sr, 0.2), 50);
        K.pill('WHISPER', lx, LA[1] + LA[2] + 80, 48, C.ink, C.white, pop(lt, 0.1));
        if (lt > li) bigText('=', 540, LA[1], 150, C.yellow, 0, eob(seg(lt, li, li + 0.25)));
        K.throatLens(LB[0], LB[1], LB[2], { shout: 1, strain: lt > sh ? eo(seg(lt, sh, sh + 0.25)) : 0, t, sc: pop(lt, sh) });
        K.pill('SHOUT', LB[0], LB[1] + LB[2] + 80, 48, C.red, C.white, pop(lt, sh + 0.05));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + nh, 'pop', { gain: 0.6 }); cue(st + sr, 'alarm', { dur: 0.5, gain: 0.2 }); cue(st + li, 'pop', { gain: 0.4 }); cue(st + sh, 'slam', { gain: 0.55 });
  }

  // ── 10 · ANSWER "So it's B: barely talk, and sip water." ──
  {
    const st = cut(9), bb = Wd('b', 9) - st, ba = Wd('barely', 9) - st, wa = Wd('water', 9) - st, si = Wd('sip', 9) - st;
    const HX = 330, HY = 1250, HS = 1.0;
    const HOLD = { e: [215, 30], h: [120, -60] };
    add({ id: 'S12', at: st, cam: [540, 600], zoom: 0.05, note: 'answer: the A/B pills at the top (same spot as frame 1); on "B" a green check pops on B, B flashes, A dims; COMMENT A OR B pill for ~1 s just after (not voiced); hero (left, calm) with a pause bubble on "barely"; on "sip" he raises a glass of water to his chest (holds it, no drinking on screen)',
      draw(lt, d, t) {
        roomAt(1500, 0.8);
        const ok = lt > bb ? eob(seg(lt, bb, bb + 0.3)) : 0;
        pills(lt, { check: ok, hiB: blip(lt, bb, 0.45), dim: lt > bb ? eio(seg(lt, bb + 0.1, bb + 0.4)) : 0 });
        K.pill('COMMENT A OR B', 540, 545, 40, C.ink, C.yellow, pop(lt, bb + 0.35, 0.25) * out(lt, bb + 1.3, 0.2));
        const g = eio(seg(lt, si - 0.1, si + 0.25));
        K.man({ x: HX, y: HY, s: HS, arm: K.armPose(K.ARM.down, HOLD, g), mouth: 'smile', eyes: lt > ba && lt < si ? 'closed' : 'n', brow: 0.3, look: 0.4,
          holding: g > 0.02 ? (x, y) => K.glass(x + 20, y - 40, 0.5, 0.7, t) : null });
        K.bubble(780, 760, 220, 170, HX + 60, HY - 280, pop(lt, ba) * out(lt, wa - 0.1, 0.2));
        K.pauseIcon(780, 760, 0.45, pop(lt, ba) * out(lt, wa - 0.1, 0.2));
        K.pill('WATER', 760, 950, 52, C.sky, C.ink, pop(lt, wa));
      } });
    cue(st, 'whoosh'); cue(st + bb, 'slam', { gain: 0.55 }); cue(st + bb + 0.05, 'sparkle', { dur: 0.5, gain: 0.3 }); cue(st + bb + 0.35, 'pop', { gain: 0.35 }); cue(st + ba, 'pop', { gain: 0.5 }); cue(st + wa, 'plop', { gain: 0.5 });
  }

  // ── 11 · "Still hoarse after two weeks? See a doctor." ──
  {
    const st = Wd('still', 10) - 0.05, sl = Wd('still', 10) - st, ho = Wd('hoarse', 10) - st, tw = Wd('two', 10) - st, se = Wd('see', 10) - st, dc = Wd('doctor', 10) - st;
    const CA = [290, 640, 0.7];
    add({ id: 'S13', at: st, cam: [540, 680], zoom: 0.06, note: 'graphic: a bubble with a jagged red hoarse wave pops on "hoarse" (top); calendar (left) pops on "Still" showing 1 WEEK, flips to 2 WEEKS on "two"; the doctor (right, lab coat) pops in on "See" and waves, a red cross badge pops by him on "doctor"',
      draw(lt, d, t) {
        plain();
        K.bubble(540, 250, 420, 170, 420, 360, pop(lt, ho - 0.05));
        K.voiceWave(540, 250, 300, 40, { rough: 1, t, a: lt > ho ? 1 : 0 });
        const k = lt > tw, fl = k ? seg(lt, tw, tw + 0.22) : 1, bump = k ? Math.sin(fl * Math.PI) : 0;
        scaled(CA[0], CA[1], pop(lt, 0, 0.3) * (1 + 0.06 * bump), () => K.calendar(CA[0], CA[1], CA[2], k ? '2' : '1', k ? 'WEEKS' : 'WEEK', -0.03 * bump));
        const dp = pop(lt, se - 0.05);
        scaled(790, 1250, dp, () => K.doctor({ x: 790, y: 1060, s: 0.7, arm: K.armPose(K.ARM.down, K.ARM.wave, eio(seg(lt, se, se + 0.3))), mouth: 'smile', look: -0.4 }));
        K.doctorBadge(960, 520, 0.45, pop(lt, dc));
      } });
    cue(st, 'whoosh'); cue(st + sl, 'pop', { gain: 0.4 }); cue(st + ho, 'alarm', { dur: 0.4, gain: 0.18 }); cue(st + tw, 'tock', { gain: 0.6 }); cue(st + se, 'pop', { gain: 0.55 }); cue(st + dc, 'pop', { gain: 0.6 });
  }

  // ── 12 · TEASE "Next Body File: energy drinks," (the hero only watches) ──
  const badge = (sc, x = 540) => K.filesBadge('BODY FILES', x, 105, 50, sc);
  {
    const st = cut(11), nx = Wd('next', 11) - st, bo = Wd('body', 11) - st, en = Wd('energy', 11) - st;
    const CANP = [300, 720];
    add({ id: 'S14', at: st, cam: [540, 720], zoom: 0.06, note: 'room: hero (right) waves; NEXT pill (left) on "Next", BODY FILES badge on "Body"; on "energy" a tall energy-drink can (no brand, yellow bolt) pops on the left with a small bounce; the hero turns to look at it, curious (he never holds or drinks it)',
      draw(lt, d, t) {
        roomAt();
        badge(pop(lt, bo));
        const wv = eio(seg(lt, 0.05, 0.4)) * out(lt, en - 0.3, 0.3);
        K.man({ x: 830, y: 636, s: 0.78, armL: K.armPose(K.ARM.down, K.ARM.wave, wv), look: lt > en ? -1 : 0, mouth: lt > en ? 'o' : 'smile', brow: lt > en ? 0.9 : 0.5 });
        K.energyCan(CANP[0], CANP[1] + 8 * Math.sin(t * 4), 1.15, { sc: pop(lt, en), rot: -0.06 });
        K.pill('NEXT', CANP[0], 1080, 60, C.yellow, C.ink, pop(lt, nx));
      } });
    cue(st, 'whoosh'); cue(st + nx, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.6 }); cue(st + en, 'pop', { gain: 0.6 });
  }
  // ── 13a · "where some cans pack six times the caffeine." ──
  {
    const st = cut(12), ca = Wd('cans', 12) - st, sx = Wd('six', 12) - st;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.06, note: 'graphic: a small energy can (left) and a big one (right) pop in at the cut, "1x" pill on "cans"; on "six" a red "6x" pill slams onto the big can and it bounces',
      draw(lt, d, t) {
        plain();
        K.energyCan(320, 760, 0.95, { sc: pop(lt, 0, 0.3) });
        K.pill('1x', 320, 1060, 60, C.ink, C.white, pop(lt, ca));
        const b = blip(lt, sx, 0.3);
        K.energyCan(760, 700 - 30 * b, 1.4, { sc: pop(lt, 0.05, 0.3), rot: 0.05 * b });
        K.pill('6x', 760, 1080, 80, C.red, C.white, pop(lt, sx, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.45 }); cue(st + ca, 'pop', { gain: 0.5 }); cue(st + sx, 'slam', { gain: 0.7 });
  }
  // ── 13b · LOOP END CARD: back to the frame-1 hook framing, now with B checked + the tease + BODY FILES + FOLLOW ──
  {
    const st = at('the', 12), cf = Wd('caffeine', 12) - st;
    add({ id: 'S16', at: st, cam: [560, 700], zoom: 0.04, note: 'END CARD = frame-1 framing for the loop: x-ray hero clutching his throat, cords lens + tiny label, A/B pills with the check on B (A dimmed); BODY FILES badge top left; energy can + yellow NEXT pill (bottom right) in from the start, can bounces on "caffeine"; + FOLLOW pops top right after "caffeine"',
      draw(lt, d, t) {
        hookScene(lt, t, { croak: 1 });
        badge(1, 360);
        pills(lt, { check: 1, dim: 1 });
        K.energyCan(950, 1100 - 20 * blip(lt, cf, 0.3), 0.55, { sc: pop(lt, 0, 0.3) });
        K.pill('NEXT', 790, 1100, 50, C.yellow, C.ink, pop(lt, 0.05, 0.3));
        K.followPill(850, 105, pop(lt, cf + 0.35), t, 46);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.45 }); cue(st + cf, 'boing', { gain: 0.4 }); cue(st + cf + 0.35, 'pop', { gain: 0.7 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES };
}
