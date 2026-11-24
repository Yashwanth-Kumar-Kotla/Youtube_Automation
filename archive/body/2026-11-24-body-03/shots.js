// WHAT HAPPENS WHEN YOU STAND UP TOO FAST?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): the hero caught half-way up off the couch, whole body x-ray (head normal), a red
// blood mass sliding in his vessel tagged "1 LITER", HEAD (up) / LEGS (down) arrow pills, blurry flat fog at the edges.
// No black fade in or out (loop: true), so frame 1 is the hook. Guess (line 1): A HEAD / B LEGS pop on the spoken words.
// Re-hook (line 4): new scene, big "HEAD RUSH?" over the hero's head. Answer (line 6): check on B LEGS, blood pools in the
// legs. Rewatch: "baroreceptors" tag on the neck lens (Mayo Clinic), "1/2 TO 1 L · MERCK MANUAL" on the leg veins.
// Tease (line 8): funny-bone elbow badge + NEXT; "But first..." snaps back to the frame-1 composition (+ BODY FILES, FOLLOW).
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, line, bigText } from './core/lib.js';
import { L, Wd, lineWords, T } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i) - 0.08;
  const plain = () => { ctx.fillStyle = C.bg; ctx.fillRect(-300, -300, W + 600, H + 600); };
  const pop = (lt, a, d = 0.3) => (lt > a ? eob(seg(lt, a, a + d)) : 0);
  const blip = (lt, a, d = 0.35) => (lt > a ? Math.sin(Math.PI * seg(lt, a, a + d)) : 0);   // 0 → 1 → 0
  const enter = (lt) => lerp(0.86, 1, eob(seg(lt, 0, 0.25)));                                  // on screen from frame 1 of the shot
  const RISE_ARM = { e: [215, 10], h: [252, 150] };
  const riseLines = (x, y, w, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) line([[x + sd * (w + i * 34), y + i * 40], [x + sd * (w + i * 34), y + 150 + i * 40]], C.ink, 10); ctx.restore(); };

  // ── the HOOK framing (frame 1 + loop ending) ──
  const HOOK_CAM = [540, 760], HX = 540, HF = 1215, HS = 0.85, PX = 872;
  // ph = loop phase (film time for S01, time-to-end for S12, so the last frame equals frame 1)
  const hookScene = (ph, rise, { kick = 0, slugAmp = 1, headK = 0, legsK = 0 } = {}) => {
    const t = ph;
    K.hrLounge(HF);
    K.sofa(HX, HF - 260 * 0.92, 0.92);
    const o = K.hrRiser(HX, HF, HS, { rise, bend: 170, lean: 1, xray: true, arm: RISE_ARM, armL: RISE_ARM, eyes: 'wide', mouth: 'o', brow: 0.8,
      slug: 0.42 + 0.07 * slugAmp * Math.sin(t * 5.5), beat: Math.max(0, 1 - (((t % 10 + 10) * 1.3) % 1) * 4) });
    K.tag('1 LITER', 210, 760, o.slug[0] - 24, o.slug[1], 52, 1 + 0.15 * kick);
    K.hrArrowPill('HEAD', PX, 390, 54, -1, 1 + 0.15 * headK);
    K.hrArrowPill('LEGS', PX, 1000, 54, 1, 1 + 0.15 * legsK);
    riseLines(HX, o.chest[1] - 420 * HS, 190 * HS, 0.6);
    K.hrFog(0.42, t);
    return o;
  };
  const hookRise = (t) => lerp(0.5, 0.7, eio(seg(t, 0, 2.4)));

  // ── 1 · HOOK "What happens when you stand up too fast?" ──
  {
    const stn = Wd('stand', 0), fa = Wd('fast', 0);
    add({ id: 'S01', at: 0, cam: HOOK_CAM, zoom: 0.06, note: 'FRAME 1 = hook (no fade): hero half-way up off the couch, whole body x-ray, red blood mass sliding in his vessel tagged "1 LITER", HEAD/LEGS arrow pills, fog at the edges; he keeps rising; pills kick on "stand", tag kicks on "fast"',
      draw(lt, d, t) { hookScene(t, hookRise(lt), { headK: blip(lt, stn), legsK: blip(lt, stn + 0.1), kick: blip(lt, fa) }); } });
    cue(0.02, 'slide', { dur: 1.2, gain: 0.35 }); cue(stn, 'pop', { gain: 0.45 }); cue(fa, 'boing', { gain: 0.4 });
  }

  // ── 2a · "Up to a liter of blood moves." (x-ray film, closer on the body) ──
  {
    const st = cut(1), li = Wd('liter', 1) - st, bl = Wd('blood', 1) - st, mv = Wd('moves', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 720], zoom: 0.1, note: 'x-ray film: the x-ray hero standing closer, vessel + red blood mass in his chest (on screen at the cut); big "1 LITER" tag on "liter"; blood mass swells on "blood"; on "moves" it slides up and down the vessel with speed lines',
      draw(lt, d, t) {
        K.xray(t);
        const mvK = seg(lt, mv, mv + 0.2), sl = 0.42 + mvK * 0.16 * Math.sin((lt - mv) * 7);
        const o = K.hrRiser(540, 1560, 1.12, { rise: 1, xray: true, arm: RISE_ARM, armL: RISE_ARM, eyes: 'n', mouth: 'flat', brow: 0.3, slug: sl, beat: Math.max(0, 1 - ((t * 1.3) % 1) * 4) });
        K.tag('1 LITER', 820, 560, o.slug[0] + 30, o.slug[1], 70, pop(lt, li) * (1 + 0.12 * blip(lt, bl)));
        if (lt > mv) K.speedLines(o.slug[0] - 120, o.slug[1], 0.5 * mvK);
      } });
    cue(st, 'whoosh'); cue(st + li, 'pop', { gain: 0.6 }); cue(st + bl, 'thud', { gain: 0.4 }); cue(st + mv, 'slide', { dur: 0.5, gain: 0.4 });
  }

  // guess pills (S03 pop + S08 answer: same spot)
  const PA = [70, 300], PB = [70, 470], PS = 62;
  const pills = ({ scA = 1, scB = 1, check = 0, dim = 0 } = {}) => {
    K.optionPill('A', 'HEAD', PA[0], PA[1], PS, { sc: scA, dim, left: true });
    K.optionPill('B', 'LEGS', PB[0], PB[1], PS, { sc: scB, check, left: true });
  };

  // ── 2b · GUESS "Toward your head, or your legs?" ──
  {
    const st = at('toward', 1), hd = Wd('head', 1) - st, lg = Wd('legs', 1) - st;
    add({ id: 'S03', at: st, cam: [640, 760], zoom: 0.05, note: 'guess: x-ray hero full body on the right, blood mass bobbing in his chest (on screen at the cut); pill A HEAD pops on "head" (yellow ring on his head), pill B LEGS pops on "legs" (ring on his legs)',
      draw(lt, d, t) {
        K.xray(t);
        const o = K.hrRiser(700, 1240, 0.8, { rise: 1, xray: true, arm: RISE_ARM, armL: RISE_ARM, eyes: 'n', mouth: 'flat', brow: 0.6, look: -0.6, slug: 0.42 + 0.08 * Math.sin(t * 5.5), sc: enter(lt) });
        pills({ scA: pop(lt, hd), scB: pop(lt, lg) });
        if (lt > hd) K.hiRing(700, o.chest[1] - 350 * 0.8, 120, 130, clamp(1 - seg(lt, lg, lg + 0.2)));
        if (lt > lg) K.hiRing(700, o.chest[1] + 440 * 0.8, 150, 210, 1);
      } });
    cue(st, 'whoosh'); cue(st + hd, 'pop', { gain: 0.6 }); cue(st + lg, 'pop', { gain: 0.6 });
  }

  // ── 3 · "Within seconds, your vision can go blurry." (close-up, edges blur) ──
  {
    const st = cut(2), sc = Wd('seconds', 2) - st, vi = Wd('vision', 2) - st, bl = Wd('blurry', 2) - st;
    add({ id: 'S04', at: st, cam: [540, 640], zoom: 0.12, note: 'living room close-up: the hero just stood up (on screen at the cut); stopwatch sweeps on "seconds"; yellow ring round his eyes on "vision"; on "blurry" the fog closes in and he goes double (ghost copy), eyes wide',
      draw(lt, d, t) {
        K.hrLounge(1250);
        const bk = seg(lt, bl - 0.15, bl + 0.4), fog = lerp(0.2, 1, seg(lt, vi, bl + 0.5));
        const hero = (dx) => K.man({ x: 540 + dx, y: 1180, s: 1.6, arm: K.ARM.down, eyes: lt > bl ? 'wide' : 'n', mouth: lt > bl ? 'wavy' : 'flat', brow: lt > bl ? 0.9 : 0.3 });
        hero(0);
        if (bk > 0) { ctx.save(); ctx.globalAlpha = 0.35 * bk; hero(36 * bk * (1 + 0.3 * Math.sin(lt * 6))); ctx.restore(); }
        K.stopwatch(860, 360, 0.42 * pop(lt, sc), (lt - sc) * 5);
        if (lt > vi) K.hiRing(540, 1180 - 344 * 1.6, 120, 60, clamp(1 - seg(lt, bl, bl + 0.2)));
        K.hrFog(fog, t);
      } });
    cue(st, 'whoosh'); cue(st + sc, 'tock', { gain: 0.5 }); cue(st + vi, 'pop', { gain: 0.45 }); cue(st + bl, 'sparkle', { dur: 0.6, gain: 0.35 });
  }

  // ── 4 · RELATABLE "Ever jumped up for the doorbell and gone fuzzy?" ──
  {
    const st = cut(3), ju = Wd('jumped', 3) - st, db = Wd('doorbell', 3) - st, fz = Wd('fuzzy', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 820], zoom: 0.08, note: 'living room: hero on the couch left, front door right (both on screen at the cut); he springs up on "jumped"; doorbell rings (yellow + rings) on "doorbell"; on "fuzzy" spiral eyes, he goes double and the fog closes in',
      draw(lt, d, t) {
        K.hrLounge(1250);
        K.hrDoor(830, 1250, 0.78, { ring: lt > db ? 1 : 0, t });
        K.sofa(300, 1106, 0.6);
        const rise = eob(seg(lt, ju, ju + 0.35)), fk = seg(lt, fz - 0.1, fz + 0.3);
        const hero = (dx) => K.hrRiser(300 + dx, 1250, 0.6, { rise, arm: RISE_ARM, armL: RISE_ARM, look: 0.8, eyes: lt > fz ? 'spiral' : lt > ju ? 'wide' : 'n', spin: t, mouth: lt > fz ? 'wavy' : lt > ju ? 'o' : 'smile', brow: lt > ju ? 0.8 : 0.2 });
        const o = hero(0);
        if (fk > 0) { ctx.save(); ctx.globalAlpha = 0.35 * fk; hero(30 * fk); ctx.restore(); }
        if (lt > ju && lt < ju + 0.6) riseLines(300, o.chest[1] - 40, 190, 1 - seg(lt, ju + 0.3, ju + 0.6));
        K.hrFog(0.9 * fk, t);
      } });
    cue(st, 'whoosh'); cue(st + ju, 'boing', { gain: 0.5 }); cue(st + db, 'pop', { gain: 0.6 }); cue(st + db + 0.25, 'pop', { gain: 0.45 }); cue(st + fz, 'sparkle', { dur: 0.6, gain: 0.35 });
  }

  // ── 5 · RE-HOOK "But here's the twist: we call it a head rush." (new scene: big head, big label) ──
  {
    const st = cut(4), tw = Wd('twist', 4) - st, ca = Wd('call', 4) - st, hd = Wd('head', 4) - st, ru = Wd('rush', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 700], zoom: 0.1, note: 'RE-HOOK, new scene: tight close-up of the hero\'s head on yellow-free cream (on screen at the cut), smirk to camera; shock lines + brows up on "twist"; red up-arrows into his head on "call"; "HEAD RUSH" slams above on "head", a big "?" on "rush"',
      draw(lt, d, t) {
        plain();
        K.burst(540, 820, 2.4, 0.5 * pop(lt, tw));
        K.heroHead(540, 860 - 14 * Math.abs(Math.sin(lt * 5)) * (1 - seg(lt, tw, tw + 0.3)), 1.9 * (1 + 0.05 * eio(seg(lt, 0.05, tw))), { eyes: 'n', look: 0, mouth: lt > tw ? 'smirk' : 'smile', smirk: lt > tw, brow: lt > tw ? 1 : 0.2 });
        K.shockLines(540, 840, 330, lt > tw ? clamp((lt - tw) * 5) * (1 - seg(lt, ca, ca + 0.3)) : 0);
        const ua = eo(seg(lt, ca, ca + 0.3));
        if (ua > 0) for (const sd of [-1, 1]) K.arrow(540 + sd * 330, 1180 - 180 * ua, 260, -Math.PI / 2 + sd * 0.35, ua);
        bigText('HEAD RUSH', 540, 290, 150, C.yellow, -0.04, pop(lt, hd, 0.22));
        bigText('?', 540 + 350, 470, 190, C.white, 0.15, pop(lt, ru, 0.22));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'boing', { gain: 0.5 }); cue(st + ca, 'slide', { dur: 0.3, gain: 0.35 }); cue(st + hd, 'slam', { gain: 0.7 }); cue(st + ru, 'pop', { gain: 0.5 });
  }

  // ── 6a · "Sensors in your neck arteries catch the pressure drop." (lens zoom into the neck) ──
  const dropEnd = Wd('drop', 5, 'e');
  {
    const st = cut(5), se = Wd('sensors', 5) - st, ne = Wd('neck', 5) - st, ca = Wd('catch', 5) - st, pr = Wd('pressure', 5) - st, dr = Wd('drop', 5) - st;
    const LX = 540, LY = 560, LR = 330;
    add({ id: 'S07', at: st, cam: [540, 620], zoom: 0.08, note: 'ZOOM into a new place: x-ray film, the x-ray hero\'s neck below, a big round lens of the neck artery (red carotid forking, sinus bulb, 4 sensors) on screen at the cut; sensors blink on "Sensors"; tiny "baroreceptors" tag on "neck" (rewatch); gauge pops on "pressure", needle drops on "drop" + sensors flash yellow and a signal runs up the nerve on "catch"/"drop"',
      draw(lt, d, t) {
        K.xray(t);
        K.man({ x: 540, y: 1520, s: 1.35, xray: true, arm: K.ARM.down, eyes: 'n', mouth: 'flat', look: 0.3 });
        const nk = [540, 1520 - 222 * 1.35];
        ctx.save(); ctx.setLineDash([16, 14]); line([[LX + 90, LY + LR - 20], [nk[0] + 60, nk[1] + 10]], C.yellow, 8); ctx.restore();
        K.hiRing(nk[0] + 58, nk[1] + 14, 46, 46, 1);
        const flash = Math.max(0.5 * blip(lt, se, 0.5), seg(lt, ca, ca + 0.2)), dropK = eio(seg(lt, dr, dr + 0.35));
        K.lens(LX, LY, LR, enter(lt), () => { ctx.save(); ctx.scale(LR / 300, LR / 300); K.hrNeckArtery({ flow: 1 - 0.6 * dropK, drop: dropK, flash, t }); ctx.restore(); }, C.xnavy);
        K.pill('baroreceptors', LX + 120, LY - LR - 40, 34, C.cyan, C.xnavy, pop(lt, ne));
        K.pressureGauge(900, 1010, 0.62, lerp(0.85, 0.3, dropK), pop(lt, pr));
      } });
    cue(st, 'whoosh'); cue(st + se, 'pop', { gain: 0.4 }); cue(st + ne, 'pop', { gain: 0.45 }); cue(st + ca, 'sparkle', { dur: 0.5, gain: 0.35 }); cue(st + pr, 'pop', { gain: 0.5 }); cue(st + dr, 'slide', { dur: 0.35, gain: 0.4 });
  }

  // ── 6b · "Your heart speeds up." ──
  {
    const st = dropEnd + 0.07, hr = Wd('heart', 5) - st, sp = Wd('speeds', 5) - st;
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.12, note: 'x-ray film: big beating heart + ECG line (on screen at the cut); heart bounces on "heart"; on "speeds" the beat and the ECG double in speed with speed lines',
      draw(lt, d, t) {
        K.xray(t);
        const ph = 1.3 * lt + 1.5 * Math.max(0, lt - sp);
        const beat = Math.max(0, 1 - (ph % 1) * 4);
        K.heart(540, 640, 2.3 * enter(lt), beat + 0.6 * blip(lt, hr));
        K.ecg(540, 1060, 900, ph / 1.2);
        if (lt > sp) K.speedLines(150, 640, 0.6 * seg(lt, sp, sp + 0.2));
      } });
    cue(st, 'whoosh'); cue(st + hr, 'thud', { gain: 0.5 }); cue(st + sp, 'boing', { gain: 0.35 });
    for (const k of [0.25, 0.5, 0.75]) cue(st + sp + k * 0.6, 'thud', { gain: 0.3 });
  }

  // ── 7 · ANSWER "Your blood pooled in your legs." (camera drops down the body) ──
  {
    const st = cut(6), bl = Wd('blood', 6) - st, po = Wd('pooled', 6) - st, lg = Wd('legs', 6) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.05, note: 'ANSWER: x-ray film, x-ray hero standing; the camera drops from his chest down to his legs; A HEAD / B LEGS pills at the top (on screen at the cut); blood fills the leg veins from the feet on "pooled" + tiny "1/2 TO 1 L · MERCK MANUAL" label (rewatch); check on B LEGS and A dims on "legs"',
      draw(lt, d, t) {
        K.xray(t);
        const dy = lerp(-380, -700, eio(seg(lt, 0.05, Math.min(po, 0.7))));
        ctx.save(); ctx.translate(0, dy);
        const o = K.hrRiser(540, 1700, 1, { rise: 1, xray: true, arm: K.ARM.down, eyes: 'n', mouth: 'flat', slug: lt < po ? lerp(0.45, 0.62, seg(lt, 0, po)) : null, pool: eo(seg(lt, po - 0.05, lg + 0.1)) });
        K.pill('1/2 TO 1 L · MERCK MANUAL', 540, o.knee[1] + 40, 30, C.cyan, C.xnavy, pop(lt, po + 0.15));
        ctx.restore();
        pills({ check: lt > lg ? eo(seg(lt, lg, lg + 0.3)) : 0, dim: seg(lt, lg, lg + 0.3) });
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.6, gain: 0.35 }); cue(st + po, 'bubbles', { dur: 0.6, gain: 0.4 }); cue(st + lg, 'pop', { gain: 0.7 });
  }

  // ── 8 · SAFETY "Rise slowly. Dizzy often? See a doctor." ──
  {
    const st = cut(7), sl = Wd('slowly', 7) - st, di = Wd('dizzy', 7) - st, dc = Wd('doctor', 7) - st;
    add({ id: 'S10', at: st, cam: [480, 820], zoom: 0.05, note: 'calm living room: hero gets up off the couch slowly, smiling (on screen at the cut); yellow "SLOW" up-arrow pill on "slowly"; "?" bubble on "Dizzy often"; doctor badge pops on "doctor"',
      draw(lt, d, t) {
        K.hrLounge(1250);
        K.sofa(420, 1106, 0.6);
        K.hrRiser(420, 1250, 0.6, { rise: eio(seg(lt, 0.15, d - 0.2)), arm: RISE_ARM, armL: RISE_ARM, eyes: 'n', mouth: 'smile', look: 0.3 });
        K.hrArrowPill('SLOW', 820, 560, 56, -1, pop(lt, sl));
        bigText('?', 820, 760, 150, C.white, 0.12, pop(lt, di) * (1 - seg(lt, dc, dc + 0.2)));
        K.doctorBadge(820, 800, 0.9, pop(lt, dc));
      } });
    cue(st, 'whoosh'); cue(st + 0.2, 'slide', { dur: 1.4, gain: 0.25 }); cue(st + sl, 'pop', { gain: 0.5 }); cue(st + di, 'pop', { gain: 0.45 }); cue(st + dc, 'thud', { gain: 0.5 });
  }

  // ── 9a · TEASE "Next Body File: your funny bone isn't a bone." ──
  const badge = (x, y, sc, size = 50) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const W8 = lineWords(8), bones = W8.filter((w) => /^bone/i.test(w.w));
    const st = Wd('next', 8) - 0.04, nx = Wd('next', 8) - st, bo = Wd('body', 8) - st, fu = Wd('funny', 8) - st, is = Wd('isn', 8) - st, b2 = bones[1].s - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.08, note: 'tease: funny-bone elbow badge big in the centre (on screen at the cut); yellow NEXT pill on "Next", BODY FILES badge on "Body"; elbow zaps on "funny"; white bone icon pops on "isn\'t", red X over it on the 2nd "bone" (nobody hits anything)',
      draw(lt, d, t) {
        plain();
        K.hrElbowBadge(540, 700, 1.7, { zap: lt > fu ? 1 : 0, sc: enter(lt), t });
        K.pill('NEXT', 540, 250, 64, C.yellow, C.ink, pop(lt, nx));
        badge(540, 1130, pop(lt, bo));
        K.hrBone(860, 400, 0.6, -0.4, pop(lt, is));
        if (lt > b2) K.redX(860, 400, lerp(0.7, 0.4, eo(seg(lt, b2, b2 + 0.2))), 1, 0.7);
      } });
    cue(st, 'whoosh'); cue(st + nx, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.5 }); cue(st + fu, 'boing', { gain: 0.4 }); cue(st + is, 'pop', { gain: 0.5 }); cue(st + b2, 'slam', { gain: 0.6 });
  }

  // ── 9b · LOOP "But first..." (snap back to the frame-1 composition; end card held still against the camera push) ──
  {
    const st = at('but', 8), Z = 0;
    add({ id: 'S12', at: st, cam: HOOK_CAM, zoom: Z, note: 'LOOP + END CARD: snap back to the frame-1 couch rise (same x-ray hero, 1 LITER tag, HEAD/LEGS pills, fog); no drift, so the camera settles at scale 1 = frame 1 (frame 1 has no punch in loop mode) and the hero ends at frame 1\'s rise and blood phase; elbow badge + NEXT + BODY FILES top left, + FOLLOW right under the LEGS pill (off the body)',
      draw(lt, d, t) {
        hookScene(t - T.dur, lerp(0.38, 0.5, eio(seg(lt, 0, d))));
        const k = 1 + 0.13 * (1 - eo(clamp(lt / 0.32)));   // undo main.js punch for the overlay
        ctx.save(); ctx.translate(HOOK_CAM[0], HOOK_CAM[1]); ctx.scale(1 / k, 1 / k); ctx.translate(-HOOK_CAM[0], -HOOK_CAM[1]);
        K.hrElbowBadge(150, 210, 0.42, { sc: pop(lt, 0.05, 0.3), t });
        K.pill('NEXT', 150, 315, 30, C.yellow, C.ink, pop(lt, 0.1, 0.3));
        badge(210, 400, pop(lt, 0.15, 0.3), 34);
        K.followPill(PX, 1125, pop(lt, 0.35), t, 38);
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + 0.35, 'pop', { gain: 0.6 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES, loop: true };
}
