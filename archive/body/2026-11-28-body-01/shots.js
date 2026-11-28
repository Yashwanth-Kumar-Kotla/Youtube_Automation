// WHAT HAPPENS WHEN YOU HEAR YOUR RECORDED VOICE?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): close-up of a phone playing the hero's voice note (thin spiky waveform), the hero's
// face behind it mid-cringe, A BETTER / B WORSE pills. Scene clock: the last shot draws with t - T_LAST, so the last frame =
// frame 0 (waveform jitter, playhead, cringe shudder) apart from the end-card badges.
// Cuts sit on caption-chunk starts (word start - 0.05) so no caption runs past a cut.
// Guess (S03): hero vs strangers listening to the same clip + A / B pills. Re-hook (S07): new scene, sky background, a studio
// mic catching only the air. Answer (S10): the 80-card grid again, check on A BETTER, the hero's 3 cards light up.
// Rewatch: 3 of the 80 clip cards have a hero-blue rim from the first moment (S02). Tease (S13, from "Next"): deja vu brain.
// Loop (S14, from "gets"): back to the frame-1 picture.
import { ctx, C, W, H, TAU, clamp, lerp, seg, eo, eio, eob, line, bigText, rr, circle } from './core/lib.js';
import { T, Wd } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const at = (w, i) => Wd(w, i) - 0.05;          // cut = the caption chunk's start
  const plain = (col = C.bg) => { ctx.fillStyle = col; ctx.fillRect(-300, -300, W + 600, H + 600); };
  const pop = (lt, a, d = 0.3) => (lt > a ? eob(seg(lt, a, a + d)) : 0);
  const out = (lt, a, d = 0.25) => 1 - eio(seg(lt, a, a + d));
  const blip = (lt, a, d = 0.35) => (lt > a ? Math.sin(Math.PI * seg(lt, a, a + d)) : 0);
  const enter = (lt) => lerp(0.86, 1, eob(seg(lt, 0, 0.25)));
  const T_LAST = (Math.ceil(T.dur * 30 - 1e-6) - 1) / 30;   // time of the film's last rendered frame
  const FLOOR = 1100;
  const floor = () => { ctx.fillStyle = C.floor; ctx.fillRect(-300, FLOOR, W + 600, 10); };

  // ── the hook set: phone close-up + cringing face + pills (frame 1 + loop) ──
  const HOOK_CAM = [540, 740];
  const PH = [385, 790], FACE = [670, 585];
  const HA = [800, 950], HB = [800, 1065], HS = 42;
  const hookScene = (t, { hi = 0, ring = 0, bump = 0, shock = 0 } = {}) => {
    plain();
    const sh = Math.sin(t * 30) * 4;
    K.heroHead(FACE[0] + sh, FACE[1], 1.6, { eyes: 'squeeze', mouth: 'wavy', brow: 0.9, frown: true });
    K.hiRing(FACE[0] + 168 + sh, FACE[1] + 4, 52, 64, ring);
    K.shockLines(FACE[0] - 10, FACE[1] - 70, 190, 0.85 + 0.15 * shock);
    K.rvVoicePhone(PH[0], PH[1], 1.05 * (1 + 0.06 * bump), { thin: 1, t, hi, rot: -0.1 });
    K.soundWaves(PH[0] - 195, PH[1] - 190, Math.PI * 1.22, t, 1, 0, 0.45);
  };
  const hookPills = (sc = 1) => { K.abPill('A', 'BETTER', HA[0], HA[1], HS, { sc }); K.abPill('B', 'WORSE', HB[0], HB[1], HS, { sc }); };

  // ── 1 · HOOK "What happens when you hear your recorded voice?" ──
  {
    const ha = Wd('happens', 0), he = Wd('hear', 0), re = Wd('recorded', 0), vo = Wd('voice', 0);
    add({ id: 'S01', at: 0, cam: HOOK_CAM, zoom: 0.05, note: 'FRAME 1 = hook: a phone playing the hero\'s voice note (thin spiky waveform, sound arcs) in front of his face mid-cringe (> < eyes, wavy mouth, shudder), A BETTER / B WORSE pills, all from frame 0; phone bumps on "happens"; yellow ring on his ear on "hear"; waveform flashes yellow on "recorded"; shock lines flare on "voice"',
      draw(lt, d, t) {
        hookScene(t, { bump: blip(lt, ha, 0.3), ring: blip(lt, he, 0.5), hi: blip(lt, re, 0.5), shock: blip(lt, vo, 0.4) });
        hookPills(1);
      } });
    cue(0.0, 'sparkle', { dur: 0.5, gain: 0.15 }); cue(ha, 'pop', { gain: 0.35 }); cue(he, 'pop', { gain: 0.4 }); cue(re, 'pop', { gain: 0.5 }); cue(vo, 'boing', { gain: 0.35 });
  }

  // ── the 80-card grid (S02, S10) ──
  const COLS = 10, ROWS = 8, GX = 86, GY = 68, G0 = [540 - 4.5 * GX, 330], CS = 0.74;
  const HERO = [[2, 7], [5, 2], [6, 8]];
  const cardXY = (r, c) => [G0[0] + c * GX, G0[1] + r * GY];
  const isHero = (r, c) => HERO.some(([a, b]) => a === r && b === c);
  const grid = (lt, { wave = -1, q = 0, lit = 0, ring = 0, sc = 1 } = {}) => {
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const [x, y] = cardXY(r, c), h = isHero(r, c);
      const bo = wave >= 0 ? 0.18 * blip(lt, wave + (r + c) * 0.025, 0.3) : 0;
      K.rvClipCard(x, y, CS * (1 + bo), { hero: h ? 1 : 0, q: h ? q : 0, lit: h ? lit : 0, sc });
    }
    if (ring > 0) for (const [r, c] of HERO) { const [x, y] = cardXY(r, c); K.hiRing(x, y, 58, 46, ring); }
  };

  // ── 2a · "Eighty people rated secret clips of their own voice." ──
  {
    const st = at('eighty', 1), ei = Wd('eighty', 1) - st, ra = Wd('rated', 1) - st, se = Wd('secret', 1) - st, ow = Wd('own', 1) - st, vo = Wd('voice', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 600], zoom: 0.06, note: 'blind test: a grid of 80 tiny voice-clip cards (10 x 8, on screen at the cut; 3 have a faint hero-blue rim = rewatch detail); yellow "80" pill on "Eighty"; a bounce ripples across the cards on "rated"; "?" badges pop on the 3 hero cards on "secret"; the hero\'s head pops under the grid on "own"; yellow rings on his 3 cards on "voice"',
      draw(lt, d, t) {
        plain();
        grid(lt, { wave: ra, q: pop(lt, se), ring: pop(lt, vo, 0.25), sc: enter(lt) });
        K.pill('80 PEOPLE', 540, 205, 60, C.yellow, C.ink, pop(lt, ei));
        K.heroHead(540, 1010, 0.62 * pop(lt, ow), { eyes: 'n', mouth: 'smile', brow: 0.5 });
      } });
    cue(st, 'whoosh'); cue(st + ei, 'pop', { gain: 0.6 }); cue(st + ra, 'slide', { dur: 0.45, gain: 0.25 }); cue(st + se, 'pop', { gain: 0.45 }); cue(st + ow, 'boing', { gain: 0.3 }); cue(st + vo, 'pop', { gain: 0.5 });
  }

  // ── guess / answer pills (S03, S10): side by side under the scene ──
  const GA = [300, 1060], GB = [770, 1060], GS = 42;

  // ── 2b · GUESS "Better than strangers, or worse?" ──
  {
    const st = at('better', 1), be = Wd('better', 1) - st, sg = Wd('strangers', 1) - st, wo = Wd('worse', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 640], zoom: 0.07, note: 'GUESS: one big clip card top centre sending sound arcs both ways, the hero\'s head (left) and two slate stranger silhouettes (right) listening, a "?" score card under each side (all on screen at the cut); pill A BETTER pops on "Better"; strangers bounce on "strangers"; B WORSE pops on "worse"',
      draw(lt, d, t) {
        plain();
        const e = enter(lt);
        K.rvClipCard(540, 330, 2.0 * e, { hero: 1 });
        K.soundWaves(410, 360, Math.PI * 0.8, t, 1, 0, 0.6);
        K.soundWaves(670, 360, Math.PI * 0.2, t, 1, 0, 0.6);
        K.heroHead(280, 600, 0.95 * e, { eyes: 'n', mouth: 'flat', brow: 0.6, look: 0.6 });
        const sb = 1 + 0.1 * blip(lt, sg, 0.35);
        K.rvStranger(700, 610, 0.62 * e * sb); K.rvStranger(870, 610, 0.62 * e * sb);
        for (const [x, ok] of [[280, 1], [785, 1]]) {
          rr(x - 80, 790, 160, 150, 22); ctx.fillStyle = C.ink; ctx.fill(); rr(x - 70, 800, 140, 130, 16); ctx.fillStyle = C.white; ctx.fill();
          bigText('?', x, 868, 96 * e * ok, C.yellow, 0);
        }
        K.abPill('A', 'BETTER', GA[0], GA[1], GS, { sc: pop(lt, be), hi: blip(lt, be, 0.4) });
        K.abPill('B', 'WORSE', GB[0], GB[1], GS, { sc: pop(lt, wo), hi: blip(lt, wo, 0.4) });
      } });
    cue(st, 'whoosh'); cue(st + be, 'pop', { gain: 0.65 }); cue(st + sg, 'boing', { gain: 0.3 }); cue(st + wo, 'pop', { gain: 0.65 });
  }

  // ── x-ray head set (S04, S05) ──
  const XH = [620, 600], XS = 0.9;

  // ── 3 · "Your voice hits your ears two ways: through air, and your skull." ──
  {
    const st = at('your', 2), vo = Wd('voice', 2) - st, ea = Wd('ears', 2) - st, tw = Wd('two', 2) - st, ai = Wd('air', 2) - st, sk = Wd('skull', 2) - st, th = Wd('through', 2) - st;
    add({ id: 'S04', at: st, cam: [580, 700], zoom: 0.07, note: 'x-ray film: side-view cyan skull with an outer ear + inner-ear spiral (on screen at the cut); sound arcs out of the mouth on "voice"; yellow ring on the inner ear on "ears"; both paths flash faintly on "two"; the yellow dashed AIR path draws from the mouth round under the jaw into the ear from "through" (AIR pill on "air"); the cyan path glows straight through the skull to the inner ear on "skull" (SKULL pill)',
      draw(lt, d, t) {
        K.xray(t);
        const ghost = blip(lt, tw, 0.45) * 0.5;
        const airP = Math.max(ghost, eio(seg(lt, th, ai + 0.25))), boneP = Math.max(ghost, eio(seg(lt, sk - 0.05, sk + 0.25)));
        ctx.save(); ctx.translate(XH[0], XH[1]); ctx.scale(enter(lt), enter(lt)); ctx.translate(-XH[0], -XH[1]);
        K.rvXrayHead(XH[0], XH[1], XS, { voice: seg(lt, vo, vo + 0.2), ear: blip(lt, ea, 0.5), air: airP, bone: boneP, t });
        ctx.restore();
        K.pill('AIR', 200, 1100, 46, C.yellow, C.ink, pop(lt, ai));
        K.pill('SKULL', 820, 225, 46, C.cyan, C.ink, pop(lt, sk));
      } });
    cue(st, 'whoosh'); cue(st + vo, 'pop', { gain: 0.35 }); cue(st + ea, 'pop', { gain: 0.45 }); cue(st + tw, 'tock', { gain: 0.4 }); cue(st + th, 'slide', { dur: ai - th + 0.25, gain: 0.3 }); cue(st + ai, 'pop', { gain: 0.5 }); cue(st + sk, 'zip', { gain: 0.45 }); cue(st + sk + 0.1, 'pop', { gain: 0.5 });
  }

  // ── 4 · "Your skull boosts the deep notes, like bass." (bone path swells, deep rings, a speaker) ──
  {
    const st = at('your', 3), bo = Wd('boosts', 3) - st, de = Wd('deep', 3) - st, ba = Wd('bass', 3) - st;
    add({ id: 'S05', at: st, cam: [560, 720], zoom: 0.14, note: 'same x-ray head, both paths drawn (on screen at the cut), camera pushing into the skull path; the cyan path swells + wobbles on "boosts"; deep cyan rings roll off it from "deep"; a wooden speaker pops inside the skull on "bass" and thumps, BASS pill',
      draw(lt, d, t) {
        K.xray(t);
        const bs = eo(seg(lt, bo - 0.05, bo + 0.3)) * (lt > de ? 1 : 0.6);
        K.rvXrayHead(XH[0], XH[1], XS, { air: 1, bone: 1, bass: bs, t });
        const beat = Math.max(0, Math.sin(t * 9));
        K.speaker(560, 470, 0.6, pop(lt, ba), beat);
        K.pill('BASS', 560, 290, 46, C.yellow, C.ink, pop(lt, ba + 0.1));
      } });
    cue(st, 'whoosh'); cue(st + bo, 'thud', { gain: 0.5 }); cue(st + de, 'thud', { gain: 0.4 }); cue(st + ba, 'pop', { gain: 0.6 }); cue(st + ba + 0.15, 'thud', { gain: 0.55 });
  }

  // ── 5 · RELATABLE "Ever cringed at your own voice note?" ──
  {
    const st = at('ever', 4), cr = Wd('cringed', 4) - st, ow = Wd('own', 4) - st, no = Wd('note', 4) - st;
    const X = 420, S1 = 0.6, Y = FLOOR - 620 * S1;
    add({ id: 'S06', at: st, cam: [520, 900], zoom: 0.06, note: 'the hero standing, holding his phone out playing a voice note (sound arcs, on screen at the cut); on "cringed" he squeezes his eyes, wavy mouth, shock lines; on "own" his other hand covers his mouth; on "note" he holds the phone at arm\'s length and it shakes',
      draw(lt, d, t) {
        plain(); floor();
        const c = lt > cr, far = eio(seg(lt, no - 0.05, no + 0.2));
        const hold = K.armPose({ e: [240, -60], h: [300, -200] }, { e: [300, -100], h: [440, -210] }, far);
        const cover = eio(seg(lt, ow - 0.1, ow + 0.15));
                K.man({ x: X, y: Y, s: S1, arm: hold, armL: K.armPose(K.ARM.down, K.ARM.mouth, cover), eyes: c ? 'squeeze' : 'n', mouth: c ? 'wavy' : 'smile', brow: c ? 0.9 : 0.3, frown: c, look: 0.6,
          holding: (hx, hy) => { K.rvVoicePhone(hx + 20, hy - 30, 0.36, { thin: 1, t, rot: 0.15, shake: far }); K.soundWaves(hx + 120, hy - 110, -0.5, t, 1, 0, 1.0); } });
        K.shockLines(X, Y - 320 * S1, 120, pop(lt, cr, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.25 }); cue(st + cr, 'boing', { gain: 0.45 }); cue(st + ow, 'slide', { dur: 0.2, gain: 0.25 }); cue(st + no, 'zip', { gain: 0.4 });
  }

  // ── 6 · RE-HOOK "But here's the catch: a mic only hears the air." (new scene: sky, studio mic) ──
  {
    const st = at('but', 5), ca = Wd('catch', 5) - st, mi = Wd('mic', 5) - st, on = Wd('only', 5) - st, he = Wd('hears', 5) - st, ai = Wd('air', 5) - st;
    const MX = 780, MY = 520;
    add({ id: 'S07', at: st, cam: [640, 640], zoom: 0.14, note: 'RE-HOOK, new scene: sky-blue background, the hero\'s head (left) talking into a big studio mic on a stand (right), sound arcs between them (on screen at the cut); shock lines + jolt on "catch"; mic bounces + yellow ring on "mic"; arcs speed into the mic grille from "only", the mic glows on "hears"; AIR pill above the arcs on "air"',
      draw(lt, d, t) {
        plain(C.sky);
        const jo = Math.sin(lt * 60) * 8 * blip(lt, ca, 0.3);
        K.heroHead(260 + jo, 560, 0.85 * enter(lt), { eyes: 'n', mouth: 'o', brow: 0.4, look: 1 });
        K.rvMic(MX + jo, MY, 0.9 * enter(lt), { glow: pop(lt, he, 0.25), beat: blip(lt, mi, 0.3) });
        const fast = lt > on ? 1.6 : 1;
        K.soundWaves(400, 560, 0, t * fast, 1, 0, 1.25);
        K.hiRing(MX, MY - 10, 150, 190, blip(lt, mi, 0.5));
        K.shockLines(MX, MY - 170, 120, blip(lt, ca, 0.5));
        K.pill('AIR', 540, 400, 52, C.yellow, C.ink, pop(lt, ai));
      } });
    cue(st, 'whoosh'); cue(st + ca, 'slam', { gain: 0.5 }); cue(st + mi, 'pop', { gain: 0.6 }); cue(st + on, 'slide', { dur: he - on + 0.2, gain: 0.3 }); cue(st + he, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + ai, 'pop', { gain: 0.55 });
  }

  // ── 7 · "No skull, no bass. You sound thin and high." (the recording goes thin) ──
  {
    const st = at('no', 6), sk = Wd('skull', 6) - st, nb = Wd('no', 6) - st, ba = Wd('bass', 6) - st, th = Wd('thin', 6) - st, hi = Wd('high', 6) - st;
    const b2 = (() => { const ws = T.words.filter((w) => w.line === 6); return ws[2].s - st; })();   // the second "no"
    add({ id: 'S08', at: st, cam: [540, 640], zoom: 0.07, note: 'a big phone playing the recording with a full deep waveform, an x-ray skull lens (top left) and a wooden speaker (top right) (all on screen at the cut); red X on the skull on "skull", red X on the speaker on "bass"; the waveform shrinks to thin spikes on "thin"; red up arrow + spikes flash yellow on "high"',
      draw(lt, d, t) {
        plain();
        const e = enter(lt);
        K.rvVoicePhone(540, 680, 1.12 * e, { thin: eio(seg(lt, th - 0.05, th + 0.3)), t, hi: blip(lt, hi, 0.45) });
        K.lens(215, 330, 110, e, () => { ctx.fillStyle = C.navy; ctx.fillRect(-130, -130, 260, 260); K.skull(5, -5, 0.24); }, C.navy);
        K.speaker(865, 330, 0.62 * e, 1, Math.max(0, Math.sin(t * 9)) * (lt < ba ? 1 : 0));
        if (lt > sk) K.redX(215, 330, lerp(0.7, 0.36, eo(seg(lt, sk, sk + 0.2))), 1, 0.8);
        if (lt > ba) K.redX(865, 330, lerp(0.7, 0.36, eo(seg(lt, ba, ba + 0.2))), 1, 0.8);
        if (lt > hi) { ctx.save(); ctx.translate(900, 820); ctx.scale(pop(lt, hi), pop(lt, hi)); K.arrow(0, 0, 260, -Math.PI / 2, 1); ctx.restore(); }
        void nb; void b2;
      } });
    cue(st, 'whoosh'); cue(st + sk, 'slam', { gain: 0.45 }); cue(st + ba, 'slam', { gain: 0.45 }); cue(st + th, 'zip', { gain: 0.4 }); cue(st + hi, 'pop', { gain: 0.55 });
  }

  // ── 8 · "That may be how others hear you." (a friend hears the same thin voice) ──
  {
    const st = at('that', 7), ma = Wd('may', 7) - st, ot = Wd('others', 7) - st, he = Wd('hear', 7) - st;
    const HXs = 270, S1 = 0.55, HY = FLOOR - 620 * S1, FX = 800, FS = 0.52, FY = FLOOR - 640 * FS;
    add({ id: 'S09', at: st, cam: [540, 900], zoom: 0.07, note: 'floor scene: the hero (left) talking to a slate friend silhouette (right), sound arcs from his mouth and a thin spiky voice-note bubble floating between them (all on screen at the cut); the bubble wobbles on "may"; the friend bounces + outline glows on "others"; yellow ring round the friend\'s head on "hear"',
      draw(lt, d, t) {
        plain(); floor();
        K.man({ x: HXs, y: HY, s: S1, eyes: 'n', mouth: Math.sin(t * 14) > 0 ? 'o' : 'smile', brow: 0.3, look: 1, arm: K.ARM.down });
        const fb = 18 * blip(lt, ot, 0.35);
        K.silhouette(FX, FY - fb, FS, { glow: pop(lt, ot, 0.25) * out(lt, ot + 0.7, 0.3), t });
        K.soundWaves(HXs + 60, HY - 272 * S1, 0, t, 1, 0, 0.8);
        const wb = Math.sin(lt * 26) * 0.06 * blip(lt, ma, 0.5);
        ctx.save(); ctx.translate(540, 400); ctx.rotate(wb); K.rvWaveBubble(0, 0, 1.05 * enter(lt), { thin: 1, t, prog: (t * 0.3) % 1 }); ctx.restore();
        K.hiRing(FX, FY - fb - 380 * FS, 78, 82, pop(lt, he, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + ma, 'boing', { gain: 0.25 }); cue(st + ot, 'pop', { gain: 0.5 }); cue(st + he, 'pop', { gain: 0.55 });
  }

  // ── 9a · ANSWER "Answer: better. They found it" (grid + pills, check on A) ──
  {
    const st = at('answer', 8), an = Wd('answer', 8) - st, be = Wd('better', 8) - st, fo = Wd('found', 8) - st, end = at('more', 8) - st;
    add({ id: 'S10', at: st, cam: [540, 640], zoom: 0.05, note: 'ANSWER: the 80-card grid (3 hero-rim cards with "?") + A BETTER / B WORSE pills in the guess spots (all on screen at the cut); A pill flashes on "Answer"; check lands on A BETTER on "better", B dims; COMMENT A OR B pill ~1.1 s at the top (not voiced); the hero\'s 3 cards light up yellow + rings on "found"',
      draw(lt, d, t) {
        plain();
        grid(lt, { q: 1, lit: eo(seg(lt, fo, fo + 0.2)), ring: pop(lt, fo, 0.25) });
        K.abPill('A', 'BETTER', GA[0], GA[1], GS, { check: pop(lt, be, 0.3), hi: blip(lt, an, 0.35) + blip(lt, be, 0.45) });
        K.abPill('B', 'WORSE', GB[0], GB[1], GS, { dim: seg(lt, be, be + 0.3) });
        K.pill('COMMENT A OR B', 540, 190, 46, C.ink, C.yellow, pop(lt, be + 0.1, 0.25) * out(lt, end - 0.23, 0.2));
      } });
    cue(st, 'whoosh'); cue(st + an, 'tock', { gain: 0.4 }); cue(st + be, 'pop', { gain: 0.8 }); cue(st + be + 0.1, 'pop', { gain: 0.3 }); cue(st + fo, 'sparkle', { dur: 0.5, gain: 0.35 });
  }

  // ── 9b · "more attractive than strangers did." (score bars: their own clips vs strangers' ratings) ──
  {
    const st = at('more', 8), mo = Wd('more', 8) - st, at2 = Wd('attractive', 8) - st, sg = Wd('strangers', 8) - st;
    const BASE = 1000, LX = 360, RX = 720;
    add({ id: 'S11', at: st, cam: [540, 650], zoom: 0.07, note: 'two score bars on a base line, the hero\'s head on the left bar, two slate strangers on the right bar (both short, on screen at the cut); the hero\'s bar shoots up on "more"; a red heart pops above his head on "attractive"; the strangers\' bar rises only a little on "strangers"',
      draw(lt, d, t) {
        plain();
        line([[150, BASE], [930, BASE]], C.ink, 12);
        const hL = lerp(120, 470, eob(seg(lt, mo - 0.05, mo + 0.35))), hR = lerp(120, 230, eob(seg(lt, sg - 0.05, sg + 0.35)));
        const [lx, ly] = K.rvBar(LX, BASE, 200, hL, C.shirt, C.shirtShade);
        const [rx, ry] = K.rvBar(RX, BASE, 200, hR, '#3D4F6E', '#2B3A55');
        K.heroHead(lx, ly - 95, 0.62 * enter(lt), { eyes: 'n', mouth: lt > at2 ? 'grin' : 'smile', brow: 0.5, smirk: lt > at2 });
        K.rvStranger(rx - 50, ry - 100, 0.42 * enter(lt)); K.rvStranger(rx + 50, ry - 100, 0.42 * enter(lt));
        K.loveHeart(lx + 150, ly - 200, 0.5, pop(lt, at2), Math.max(0, Math.sin(t * 8)));
      } });
    cue(st, 'whoosh'); cue(st + mo, 'slide', { dur: 0.35, gain: 0.35 }); cue(st + at2, 'pop', { gain: 0.6 }); cue(st + sg, 'slide', { dur: 0.3, gain: 0.25 });
  }

  // ── 10 · "And most likely never knew it was them." (their own clip, unrecognised) ──
  {
    const st = at('and', 9), mo = Wd('most', 9) - st, li = Wd('likely', 9) - st, ne = Wd('never', 9) - st, kn = Wd('knew', 9) - st, th = Wd('them', 9) - st;
    add({ id: 'S12', at: st, cam: [540, 620], zoom: 0.08, note: 'close-up: one big hero-rim clip card with its "?" badge (top) sending sound arcs to the hero\'s head below (puzzled), both on screen at the cut; brows raise on "most"; the "?" badge bounces on "likely"; a big yellow "?" pops over his head on "never"; head shakes on "knew"; on "them" the card flips to show his own face + yellow ring',
      draw(lt, d, t) {
        plain();
        const e = enter(lt), qb = 1 + 0.3 * blip(lt, li, 0.3);
        K.rvClipCard(540, 360, 3.0 * e, { hero: 1, q: lt < th ? qb : out(lt, th, 0.15), face: eio(seg(lt, th, th + 0.3)) });
        K.soundWaves(540, 520, Math.PI / 2, t, out(lt, th, 0.2), 0, 0.5);
        const shk = Math.sin(lt * 30) * 10 * blip(lt, kn, 0.4);
        K.heroHead(540 + shk, 830, 0.95 * e, { eyes: lt > th ? 'wide' : 'n', mouth: lt > th ? 'o' : 'flat', brow: lerp(0.3, 0.9, seg(lt, mo, mo + 0.2)), look: 0 });
        bigText('?', 760, 690, 150 * pop(lt, ne) * out(lt, th, 0.15), C.yellow, 0.12);
        K.hiRing(540, 360, 190, 140, pop(lt, th + 0.15, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + li, 'boing', { gain: 0.3 }); cue(st + ne, 'pop', { gain: 0.5 }); cue(st + kn, 'zip', { gain: 0.3 }); cue(st + th, 'slide', { dur: 0.25, gain: 0.3 }); cue(st + th + 0.2, 'pop', { gain: 0.6 });
  }

  // ── 11a · TEASE "Next Body File: déjà vu, a brain glitch nearly everyone" (starts on "Next") ──
  const badge = (x, y, sc, size = 44) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = at('next', 10), bo = Wd('body', 10) - st, dj = Wd('dj', 10) - st, gl = Wd('glitch', 10) - st, ev = Wd('everyone', 10) - st;
    const PX = [180, 300, 420, 540, 660, 780, 900];
    add({ id: 'S13', at: st, cam: [540, 660], zoom: 0.07, note: 'tease (cut on "Next"): a big flat brain (on screen at the cut), yellow NEXT pill at lt 0.03; BODY FILES badge on "Body"; a faint copy of the brain slides out of it (the deja vu echo) on "deja"; the brain glitches in slices + red glitch sign on "glitch"; a row of seven people icons pops in on "everyone"',
      draw(lt, d, t) {
        plain();
        K.rvEchoBrain(540, 690, 0.85, { echo: eio(seg(lt, dj, dj + 0.4)), glitch: lt > gl ? 0.6 + 0.4 * blip(lt, gl, 0.4) : 0, t, sc: enter(lt) });
        K.pcGlitch(870, 470, 0.38, { t, sc: pop(lt, gl) });
        PX.forEach((x, i) => K.personIcon(x, 1035, 0.5, i === 3 ? C.shirt : '#3D4F6E', pop(lt, ev + i * 0.04, 0.25)));
        K.pill('NEXT', 540, 170, 64, C.yellow, C.ink, pop(lt, 0.03, 0.25));
        badge(540, 290, pop(lt, bo));
      } });
    cue(st, 'whoosh'); cue(st + 0.03, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.4 }); cue(st + dj, 'sparkle', { dur: 0.5, gain: 0.35 }); cue(st + gl, 'zip', { gain: 0.5 }); cue(st + ev, 'pop', { gain: 0.5 });
  }

  // ── 11b · LOOP "gets." (back to the exact frame-1 picture) + end card ──
  {
    const st = at('gets', 10), Z = 0;
    add({ id: 'S14', at: st, cam: HOOK_CAM, zoom: Z, note: 'LOOP + END CARD: the frame-1 picture (phone + cringing face + A / B pills, scene clock t - T_LAST so the last frame = frame 1, no push); end card from ~0.3 s: deja vu badge + NEXT top right, BODY FILES + FOLLOW top left (clear of the face and the sound arcs)',
      draw(lt, d, t) {
        const tl = Math.max(0, t - T_LAST);   // clamp: a capture time a hair before the last frame must not wrap the loops
        hookScene(tl); hookPills(1);
        const k = (1 + 0.13 * (1 - eo(clamp(lt / 0.32)))) * (1 + Z * eio(clamp(lt / d)));
        ctx.save(); ctx.translate(HOOK_CAM[0], HOOK_CAM[1]); ctx.scale(1 / k, 1 / k); ctx.translate(-HOOK_CAM[0], -HOOK_CAM[1]);
        K.rvDejaBadge(905, 140, 0.5, pop(lt, 0.3, 0.3), t);
        K.pill('NEXT', 905, 255, 34, C.yellow, C.ink, pop(lt, 0.35, 0.3));
        badge(230, 120, pop(lt, 0.3, 0.3), 34);
        K.followPill(230, 210, pop(lt, 0.5), t, 36);
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'pop', { gain: 0.4 }); cue(st + 0.5, 'pop', { gain: 0.5 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES, loop: true };
}
