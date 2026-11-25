// WHAT HAPPENS WHEN YOU YAWN, AND WHY IS IT CONTAGIOUS?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// HOOK framing (frame 1 + loop ending): the hero mid-yawn (jaw wide, arms stretched) in his room beside a schematic ultrasound
// monitor of a yawning baby ("24 WKS"), A AGE ONE / B AGE FOUR pills under the monitor, a dog asleep on a cushion in the corner,
// a "9/day" sticky note on the wall (rewatch details). Cuts sit on caption-chunk starts (word start - 0.05).
// Guess (2b): toddler vs four-year-old panels, pills pop on "one" / "four". Re-hook (6a): new scene, hard zoom into a phone.
// Answer (8): same panels, check on B on "four". Dog yawns exactly once in the corner on line 3 ("long"), before it's mentioned.
// Tease (10a, from "Next"): heartburn stomach + NEXT. Loop (10b "Still yawning?"): back to the exact frame-1 picture.
import { ctx, C, W, H, TAU, clamp, lerp, seg, eo, eio, eob, line, bigText, rr, rnd } from './core/lib.js';
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
  const blip = (lt, a, d = 0.35) => (lt > a && lt < a + d ? Math.sin(Math.PI * seg(lt, a, a + d)) : 0);
  const hump = (lt, a, b, r = 0.25) => eio(seg(lt, a, a + r)) * (1 - eio(seg(lt, b, b + r)));

  // ── the hook set (frame 1 + loop) ──
  const FLOOR = 1120, HX = 700, HY = 1080, HS = 1.0, HOOK_CAM = [540, 760];
  const US = [250, 520, 0.85], DOG = [985, 1125, 0.5];
  const PA = [250, 800], PB = [250, 920], PS = 44;
  const T_LAST = (Math.ceil(T.dur * 30 - 1e-6) - 1) / 30;   // time of the film's last rendered frame
  const ywWave = (x, y, dir, a) => {                          // three "yawn" arcs spreading from a mouth
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = clamp(a); ctx.lineCap = 'round';
    for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(x, y, 50 + k * 38, dir - 0.5, dir + 0.5); ctx.strokeStyle = C.ink; ctx.lineWidth = 12; ctx.stroke(); ctx.strokeStyle = C.yellow; ctx.lineWidth = 6; ctx.stroke(); }
    ctx.restore();
  };
  const hookScene = (tl, { stretch = 0, wave = 0, pills = 1, dogYawn = 0 } = {}) => {
    K.ywRoom(FLOOR, { tx: 500, ty: 250 });
    K.ywUltrasound(US[0], US[1], US[2], { yawn: 1, t: tl, stand: FLOOR + 40 });
    K.ywDog(DOG[0], DOG[1], DOG[2], { t: tl, yawn: dogYawn });
    const up = { e: [230 + 10 * stretch, -250 - 25 * stretch], h: [200 + 10 * stretch, -470 - 40 * stretch] };
    K.man({ x: HX, y: HY, s: HS, arm: up, armL: up, eyes: 'closed', mouth: 'yawn', brow: 0.7 });
    ywWave(HX - 40, HY - 256, Math.PI, wave);
    K.abPill('A', 'AGE ONE', PA[0], PA[1], PS, { sc: pills });
    K.abPill('B', 'AGE FOUR', PB[0], PB[1], PS, { sc: pills });
  };

  // ── 1 · HOOK "What happens when you yawn, and why is it contagious?" ──
  {
    const yw = Wd('yawn', 0), co = Wd('contagious', 0);
    add({ id: 'S01', at: 0, cam: HOOK_CAM, zoom: 0.05, note: 'FRAME 1 = hook: hero mid-yawn (jaw wide, eyes shut, arms stretched) in his room beside a schematic ultrasound monitor of a yawning baby ("24 WKS"), A AGE ONE / B AGE FOUR pills, dog asleep in the corner, "9/day" note, all from frame 0; extra stretch on "yawn"; yellow yawn arcs spread from his mouth toward the monitor on "contagious"',
      draw(lt, d, t) {
        hookScene(t, { stretch: blip(lt, yw, 0.6), wave: hump(lt, co, co + 0.6, 0.2) });
      } });
    cue(0.0, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(yw, 'boing', { gain: 0.35 }); cue(co, 'pop', { gain: 0.5 });
  }

  // ── 2a · "You yawned in the womb," (the ultrasound, big) ──
  {
    const st = at('you', 1), ya = Wd('yawned', 1) - st, wo = Wd('womb', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 640], zoom: 0.16, note: 'the ultrasound monitor fills the frame (on screen at the cut): the cartoon baby\'s mouth opens wide on "yawned"; yellow ring round the baby on "womb"; "24 WKS" label in the corner',
      draw(lt, d, t) {
        plain();
        K.ywUltrasound(540, 640, 1.9, { yawn: lerp(0.3, 1, eo(seg(lt, ya, ya + 0.35))), t });
        K.hiRing(560, 700, 230, 200, pop(lt, wo, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + ya, 'boing', { gain: 0.35 }); cue(st + wo, 'pop', { gain: 0.55 });
  }

  // ── the guess / answer panels (S03, S09) ──
  const GA = [290, 1000], GB = [790, 1000], GS = 42, PY0 = 430, PY1 = 920;
  const ADULT = [540, 290, 0.62];
  const panel = (x0, x1, fn) => {
    ctx.save(); rr(x0, PY0, x1 - x0, PY1 - PY0, 30); ctx.clip(); fn(); ctx.restore();
    rr(x0, PY0, x1 - x0, PY1 - PY0, 30); ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.stroke();
  };
  const panels = (t, { kidYawn = 0, dimA = 0, hiB = 0, wave = 0 } = {}) => {
    plain();
    K.heroHead(ADULT[0], ADULT[1], ADULT[2], { eyes: 'closed', mouth: 'yawn', brow: 0.7 });
    ywWave(ADULT[0] - 60, ADULT[1] + 60, Math.PI * 0.78, wave); ywWave(ADULT[0] + 60, ADULT[1] + 60, Math.PI * 0.22, wave);
    panel(50, 530, () => {
      ctx.fillStyle = C.sky; ctx.fillRect(50, PY0, 480, PY1 - PY0); ctx.fillStyle = C.floor; ctx.fillRect(50, 850, 480, 80);
      K.ywKid(290, 880, 0.6, { shirt: [C.pinkLight, C.pink] });
      if (dimA > 0) { ctx.save(); ctx.globalAlpha = 0.4 * clamp(dimA); ctx.fillStyle = C.bg; ctx.fillRect(50, PY0, 480, PY1 - PY0); ctx.restore(); }
    });
    panel(550, 1030, () => {
      ctx.fillStyle = C.sky; ctx.fillRect(550, PY0, 480, PY1 - PY0); ctx.fillStyle = C.floor; ctx.fillRect(550, 850, 480, 80);
      K.ywKid(790, 880, 0.78, { yawn: kidYawn });
      if (hiB > 0) { ctx.save(); ctx.globalAlpha = 0.3 * clamp(hiB); ctx.fillStyle = C.yellow; ctx.fillRect(550, PY0, 480, PY1 - PY0); ctx.restore(); }
    });
  };

  // ── 2b · GUESS "but catching yawns starts at age one, or four?" ──
  {
    const st = at('but', 1), ca = Wd('catching', 1) - st, on = Wd('one', 1) - st, fo = Wd('four', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 680], zoom: 0.07, note: 'GUESS: a yawning adult head on top, two panels (a toddler left, a four-year-old right) on screen at the cut; yellow yawn arcs spread toward both kids on "catching"; pill A AGE ONE pops on "one", B AGE FOUR on "four"; yellow "?" on "four"',
      draw(lt, d, t) {
        panels(t, { wave: hump(lt, ca, ca + 0.8, 0.2) });
        K.abPill('A', 'AGE ONE', GA[0], GA[1], GS, { sc: pop(lt, on), hi: blip(lt, on, 0.4) });
        K.abPill('B', 'AGE FOUR', GB[0], GB[1], GS, { sc: pop(lt, fo), hi: blip(lt, fo, 0.4) });
        bigText('?', 540, 675, 150 * pop(lt, fo + 0.1), C.yellow, 0.1);
      } });
    cue(st, 'whoosh'); cue(st + ca, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + on, 'pop', { gain: 0.65 }); cue(st + fo, 'pop', { gain: 0.65 }); cue(st + fo + 0.1, 'boing', { gain: 0.35 });
  }

  // ── 3 · "Your jaw drops and you gulp one long, deep breath." (room; the corner dog yawns once, a beat later) ──
  {
    const st = at('your', 2), dr = Wd('drops', 2) - st, gu = Wd('gulp', 2) - st, lo = Wd('long', 2) - st, br = Wd('breath', 2) - st;
    const X = 440, Y = 1250, SC = 1.6, MX = X, MY = Y - 256 * SC;
    add({ id: 'S04', at: st, cam: [480, 760], zoom: 0.08, note: 'room: hero big (on screen at the cut), mouth closed; jaw drops into a wide yawn on "drops" (ink arrow down at the jaw); sky-blue air streams curl into his mouth from "gulp" to "breath"; arms stretch up on "breath"; REWATCH: the corner dog yawns once on "long" (unmentioned)',
      draw(lt, d, t) {
        K.ywRoom(FLOOR, { tx: 500, ty: 250 });
        K.ywDog(DOG[0], DOG[1], DOG[2], { t, yawn: hump(lt, lo, br + 0.15, 0.3) });
        const open = lt > dr, s2 = eio(seg(lt, br - 0.1, br + 0.35));
        const up = K.armPose(K.ARM.down, { e: [230, -250], h: [200, -470] }, s2);
        K.man({ x: X, y: Y, s: SC, arm: up, armL: up, eyes: open ? 'closed' : 'n', mouth: open ? 'yawn' : 'flat', brow: open ? 0.7 : 0.2 });
        K.arrow(MX + 150, MY - 30, 120, Math.PI / 2, blip(lt, dr, 0.6));
        const air = seg(lt, gu - 0.1, gu + 0.2) * out(lt, d - 0.3, 0.3);
        if (air > 0) for (let k = 0; k < 3; k++) {
          const ph = (lt * 1.6 + k / 3) % 1, a = Math.sin(ph * Math.PI) * air;
          const sx = lerp(1000, MX + 70, ph), sy = MY - 160 + k * 70 + Math.sin(ph * 6 + k) * 30 * (1 - ph) + ph * (130 - k * 70);
          K.flowArrow(sx, sy, 110, Math.PI + 0.25 * (k - 1) * (1 - ph), a, C.sky, 22, '#7EC3E0');
        }
      } });
    cue(st, 'whoosh'); cue(st + dr, 'boing', { gain: 0.4 }); cue(st + gu, 'gulp', { gain: 0.5 }); cue(st + lo, 'slide', { dur: 0.9, gain: 0.25 }); cue(st + br, 'sparkle', { dur: 0.4, gain: 0.2 });
  }

  // ── 4 · "Not for oxygen; tests ruled that out." (x-ray) ──
  {
    const st = at('not', 3), ox = Wd('oxygen', 3) - st, te = Wd('tests', 3) - st, ou = Wd('out', 3) - st;
    const X = 470, Y = 1010, SC = 1.25, MY = Y - 256 * SC;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.1, note: 'x-ray film: the hero\'s x-ray body with lungs, head normal, yawning (on screen at the cut); O2 bubbles stream toward his mouth; a red X slams over the O2 stream on "oxygen" and the bubbles stop; a clipboard with a test chart pops on "tests"; red RULED OUT stamp on "out"',
      draw(lt, d, t) {
        K.xray(t);
        K.man({ x: X, y: Y, s: SC, xray: true, lungs: 0, eyes: 'closed', mouth: 'yawn', brow: 0.6 });
        const stop = lt > ox + 0.1;
        for (let k = 0; k < 4; k++) {
          const u = ((stop ? ox + 0.1 : lt) * 0.9 + k / 4) % 1;   // the stream freezes after the X
          K.o2Bubble(lerp(1010, X + 120, u), lerp(470, MY - 20, u) - Math.sin(u * Math.PI) * 60, 0.75, Math.sin(u * Math.PI) * (stop ? 0.55 : 1));
        }
        if (lt > ox) K.redX(800, 520, lerp(1.0, 0.62, eo(seg(lt, ox, ox + 0.2))), 1);
        const cb = pop(lt, te, 0.3);
        if (cb > 0) {
          ctx.save(); ctx.translate(890, 870); ctx.scale(cb, cb); K.clipboard(0, 0, 0.42, seg(lt, te, te + 0.6), 0.06); ctx.restore();
        }
        K.stamp('RULED OUT', 820, 1070, 40, -0.1, pop(lt, ou, 0.22) * lerp(1.6, 1, eo(seg(lt, ou, ou + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'bubbles', { dur: 0.6, gain: 0.2 }); cue(st + ox, 'slam', { gain: 0.6 }); cue(st + te, 'pop', { gain: 0.5 }); cue(st + ou, 'slam', { gain: 0.5 });
  }

  // ── 5 · "One theory? It may cool your brain." ──
  {
    const st = at('one', 4), th = Wd('theory', 4) - st, co = Wd('cool', 4) - st, bra = Wd('brain', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 640], zoom: 0.1, note: 'a warm brain character with orange heat waves rising + a thermometer high (on screen at the cut); THEORY? pill on "theory"; on "cool" sky-blue cool air streams in from the left, white snowflakes, the heat waves fade and the thermometer drops; the brain smiles relieved on "brain"',
      draw(lt, d, t) {
        plain();
        const cool = eio(seg(lt, co - 0.05, co + 0.5));
        K.warmWaves(540, 430, 380, t, 1 - cool, { n: 4, h: 200 });
        K.brainBuddy(560, 700, 0.95, { t, eyes: lt > bra ? 'closed' : 'n', mouth: lt > bra ? 'smile' : 'wavy', look: 0, wob: 1 - cool });
        K.thermometer(950, 720, 0.42, lerp(0.85, 0.35, cool));
        if (cool > 0) for (let k = 0; k < 3; k++) {
          const ph = (lt * 1.4 + k / 3) % 1;
          K.flowArrow(lerp(-60, 260, ph), 560 + k * 130, 130, 0, Math.sin(ph * Math.PI) * cool, C.sky, 24, '#7EC3E0');
        }
        if (cool > 0) for (let k = 0; k < 5; k++) K.snowflake(220 + rnd(k) * 680, 380 + rnd(k + 7) * 600 + Math.sin(t * 2 + k) * 14, 24 * cool, '#7EC3E0', 8, t * 0.6 + k);
        K.pill('THEORY?', 540, 1080, 52, C.ink, C.white, pop(lt, th));
      } });
    cue(st, 'whoosh'); cue(st + th, 'pop', { gain: 0.5 }); cue(st + co, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + co + 0.1, 'sparkle', { dur: 0.6, gain: 0.25 });
  }

  // ── 6a · RE-HOOK "But here's the weird part:" (new scene: hard zoom into a phone screen full of "yawn") ──
  {
    const st = at('but', 5), we = Wd('weird', 5) - st, pa = Wd('part', 5) - st;
    add({ id: 'S07', at: st, cam: [540, 560], zoom: 0.32, note: 'RE-HOOK, new scene: a giant phone with text lines on plain paper (on screen at the cut), the camera pushing hard into the screen; the phone jolts + shock lines on "weird"; every "yawn" word on the screen lights up yellow on "part"',
      draw(lt, d, t) {
        plain();
        const jolt = blip(lt, we, 0.3);
        K.ywPhone(540, 740, 1.4, { hi: eo(seg(lt, pa, pa + 0.25)), rot: 0.06 * jolt, scroll: 30 * eio(seg(lt, 0, d)) });
        K.shockLines(540, 740 - 380, 160, blip(lt, we, 0.6));
      } });
    cue(st, 'whoosh'); cue(st + we, 'slam', { gain: 0.45 }); cue(st + pa, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 6b · "just reading about yawns can trigger one." (room, reading the phone) ──
  {
    const st = at('just', 5), re = Wd('reading', 5) - st, ya = Wd('yawns', 5) - st, tr = Wd('trigger', 5) - st;
    const X = 400, Y = 1150, SC = 1.3, READ = { e: [225, 60], h: [120, -40] };
    add({ id: 'S08', at: st, cam: [500, 760], zoom: 0.08, note: 'room: hero holding a phone, eyes down reading (on screen at the cut; dog asleep in the corner); eyes scan side to side from "reading"; the phone\'s "yawn" words light up yellow + a "yawn" speech bubble pops from the phone on "yawns"; on "trigger" his mouth snaps open into a yawn, eyes shut, small burst',
      draw(lt, d, t) {
        K.ywRoom(FLOOR, { tx: 500, ty: 250 });
        K.ywDog(DOG[0], DOG[1], DOG[2], { t });
        const yawn = lt > tr;
        K.man({ x: X, y: Y, s: SC, arm: READ, armL: K.armPose(K.ARM.down, { e: [230, -250], h: [200, -470] }, eio(seg(lt, tr + 0.1, tr + 0.4))),
          eyes: yawn ? 'closed' : 'n', lookY: yawn ? 0 : 1, look: lt > re && !yawn ? Math.sin((lt - re) * 9) * 0.6 : 0.2, mouth: yawn ? 'yawn' : 'flat', brow: yawn ? 0.7 : 0.2,
          holding: (hx, hy) => K.ywPhone(hx + 10, hy - 50, 0.4, { hi: seg(lt, ya, ya + 0.2) }) });
        K.textBubble('yawn', 800, 470, 300, 150, X + 140, Y - 330, pop(lt, ya), 78, C.ink);
        K.burst(X, Y - 256 * SC, 1.6, blip(lt, tr, 0.45));
      } });
    cue(st, 'whoosh'); cue(st + re, 'slide', { dur: 0.4, gain: 0.2 }); cue(st + ya, 'pop', { gain: 0.6 }); cue(st + tr, 'boing', { gain: 0.5 });
  }

  // ── 7 · RELATABLE "Feel one coming yet? Thought so." (close-up to camera) ──
  {
    const st = at('feel', 6), co = Wd('coming', 6) - st, ye = Wd('yet', 6) - st, th = Wd('thought', 6) - st;
    const X = 470, Y = 1330, SC = 1.8;
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.1, note: 'room close-up: hero looks straight at camera pointing at the viewer (on screen at the cut); a yawn-o-meter needle climbs from "coming" to "yet"; brows up on "yet"; on "Thought so" a smirk + finger wag',
      draw(lt, d, t) {
        K.ywRoom(FLOOR, { tx: 500, ty: 250 });
        K.ywDog(DOG[0], DOG[1], DOG[2], { t });
        const sm = lt > th;
        K.man({ x: X, y: Y, s: SC, arm: K.ARM.point, finger: sm ? Math.sin(lt * 11) * 0.35 : 0, look: 0, eyes: 'n', mouth: sm ? 'smirk' : 'o', brow: lt > ye ? 1 : 0.4, smirk: sm });
        K.speedGauge(770, 330, 0.55, lerp(0.1, 0.92, eio(seg(lt, co - 0.1, ye + 0.3))), pop(lt, 0.03, 0.25));
        K.pill('YAWN-O-METER', 770, 470, 30, C.ink, C.white, pop(lt, 0.03, 0.25));
      } });
    cue(st, 'whoosh'); cue(st + co, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + ye, 'pop', { gain: 0.45 }); cue(st + th, 'boing', { gain: 0.4 });
  }

  // ── 8 · ANSWER "Answer: about age four. Toddlers rarely do." ──
  {
    const st = at('answer', 7), fo = Wd('four', 7) - st, to = Wd('toddlers', 7) - st, ra = Wd('rarely', 7) - st;
    add({ id: 'S10', at: st, cam: [540, 680], zoom: 0.07, note: 'ANSWER: the guess panels + A / B pills in the same spots (on screen at the cut); on "four" the check lands on B AGE FOUR, A dims, the four-year-old catches the yawn (yawn arcs from the adult); COMMENT A OR B pill ~1 s (not voiced); on "Toddlers" the toddler panel glows and "0 of 20 one-year-olds" pill pops on "rarely"',
      draw(lt, d, t) {
        panels(t, { kidYawn: hump(lt, fo + 0.1, d, 0.3), dimA: seg(lt, fo, fo + 0.3) * out(lt, to - 0.1, 0.2), hiB: blip(lt, fo, 0.6), wave: hump(lt, fo - 0.1, fo + 0.6, 0.15) });
        K.abPill('A', 'AGE ONE', GA[0], GA[1], GS, { sc: 1, dim: seg(lt, fo, fo + 0.3), hi: blip(lt, to, 0.4) });
        K.abPill('B', 'AGE FOUR', GB[0], GB[1], GS, { sc: 1, check: pop(lt, fo, 0.3), hi: blip(lt, fo, 0.45) });
        K.pill('COMMENT A OR B', 540, 1110, 30, C.ink, C.yellow, pop(lt, fo + 0.35, 0.25) * out(lt, fo + 1.1, 0.2));
        K.pill('0 of 20 one-year-olds', 290, 470, 26, C.ink, C.white, pop(lt, ra));
      } });
    cue(st, 'whoosh'); cue(st + fo, 'pop', { gain: 0.8 }); cue(st + fo + 0.35, 'pop', { gain: 0.3 }); cue(st + to, 'tock', { gain: 0.4 }); cue(st + ra, 'pop', { gain: 0.45 });
  }

  // ── 9a · "Your dog might too." (room, the dog big) ──
  {
    const st = at('your', 8), dg = Wd('dog', 8) - st, too = Wd('too', 8) - st;
    add({ id: 'S11', at: st, cam: [640, 820], zoom: 0.14, note: 'room: the corner dog big on its cushion + the hero yawning at the left (both on screen at the cut); yellow ring round the dog on "dog"; the dog yawns on "too"',
      draw(lt, d, t) {
        K.ywRoom(FLOOR, { tx: 500, ty: 250 });
        const up = { e: [230, -250], h: [200, -470] };
        K.man({ x: 190, y: 1260, s: 1.3, arm: up, armL: up, eyes: 'closed', mouth: 'yawn', brow: 0.7 });
        K.ywDog(790, 1080, 1.25, { t, yawn: eio(seg(lt, too, too + 0.3)) });
        K.hiRing(760, 950, 300, 170, pop(lt, dg, 0.25) * out(lt, too - 0.05));
      } });
    cue(st, 'whoosh'); cue(st + dg, 'pop', { gain: 0.5 }); cue(st + too, 'boing', { gain: 0.45 });
  }

  // ── 9b · "One study: twenty-one of twenty-nine." (dog grid) ──
  {
    const st = at('one', 8), su = Wd('study', 8) - st, t21 = Wd('twenty-one', 8) - st, of = Wd('of', 8) - st, t29 = Wd('twenty-nine', 8) - st;
    const NO = new Set([3, 8, 11, 15, 19, 22, 25, 28]);   // the 8 dogs that didn't yawn
    const order = []; for (let i = 0; i < 29; i++) if (!NO.has(i)) order.push(i);
    add({ id: 'S12', at: st, cam: [540, 680], zoom: 0.08, note: '29 dog-head icons in a grid (on screen at the cut); ONE STUDY folder pill on "study"; from "twenty-one" 21 of them yawn one by one; yellow 21 / 29 pill on "twenty-nine"',
      draw(lt, d, t) {
        plain();
        for (let i = 0; i < 29; i++) {
          const c = i % 6, r = Math.floor(i / 6), x = 140 + c * 160 + (r === 4 ? 80 : 0), y = 380 + r * 140;
          const k = order.indexOf(i), yt = k >= 0 ? t21 + k * ((of + 0.15 - t21) / 21) : 1e9;
          K.ywDogHead(x, y, 0.82, { yawn: eo(seg(lt, yt, yt + 0.15)), dim: k < 0 ? seg(lt, t29, t29 + 0.3) : 0, sc: lerp(0.86, 1, eob(seg(lt, 0, 0.25))) });
        }
        K.pill('ONE STUDY', 540, 240, 48, C.ink, C.white, pop(lt, su));
        K.pill('21 / 29', 540, 1095, 56, C.yellow, C.ink, pop(lt, t29));
      } });
    cue(st, 'whoosh'); cue(st + su, 'pop', { gain: 0.45 }); cue(st + t21, 'sparkle', { dur: 0.6, gain: 0.3 }); cue(st + t29, 'slam', { gain: 0.5 });
  }

  // ── 10a · TEASE "Next Body File: heartburn, not your heart." (starts on "Next") ──
  const badge = (x, y, sc, size = 44) => K.filesBadge('BODY FILES', x, y, size, sc);
  {
    const st = at('next', 9), bo = Wd('body', 9) - st, hb = Wd('heartburn', 9) - st, no = Wd('not', 9) - st, he = T.words.filter((w) => w.line === 9 && /^heart\W*$/i.test(w.w))[0].s - st;
    add({ id: 'S13', at: st, cam: [540, 640], zoom: 0.08, note: 'tease (cut on "Next"): a cartoon stomach with its food pipe + yellow NEXT pill on screen at the cut; BODY FILES badge on "Body"; on "heartburn" yellow acid climbs the pipe and a flame flares at the top (stomach goes wide-eyed); a heart pops on "not" and gets a red X on "heart"',
      draw(lt, d, t) {
        plain();
        const ac = eio(seg(lt, hb - 0.05, hb + 0.4));
        K.ywHeartburn(420, 900, 1.0, { acid: ac, flame: eob(seg(lt, hb + 0.2, hb + 0.45)), t, face: lt > hb ? 'wow' : 'n', sc: lerp(0.86, 1, eob(seg(lt, 0, 0.25))) });
        K.heart(800, 640, 1.05 * pop(lt, no, 0.25));
        if (lt > he) K.redX(800, 625, lerp(0.7, 0.42, eo(seg(lt, he, he + 0.2))), 1);
        K.pill('NEXT', 540, 170, 64, C.yellow, C.ink, pop(lt, 0.03, 0.25));
        badge(540, 290, pop(lt, bo));
      } });
    cue(st, 'whoosh'); cue(st + 0.03, 'pop', { gain: 0.6 }); cue(st + bo, 'thud', { gain: 0.4 }); cue(st + hb, 'sizzle', { dur: 0.6, gain: 0.35 }); cue(st + no, 'pop', { gain: 0.45 }); cue(st + he, 'slam', { gain: 0.55 });
  }

  // ── 10b · LOOP "Still yawning?" (back to the exact frame-1 picture) ──
  {
    const st = at('still', 9), yi = Wd('yawning', 9) - st, Z = 0;
    add({ id: 'S14', at: st, cam: HOOK_CAM, zoom: Z, note: 'LOOP + END CARD: the frame-1 room, hero mid-yawn beside the ultrasound, dog asleep (on screen at the cut, same scene clock as frame 1); extra stretch on "yawning"; A / B pills pop back in after "yawning" so the last frame = frame 1 (same camera, no push); end card from ~0.9 s: heartburn badge + NEXT top right, BODY FILES + FOLLOW top left',
      draw(lt, d, t) {
        const tl = t - T_LAST;                                  // scene clock: the last frame draws exactly like frame 0
        hookScene(tl, { stretch: blip(lt, yi, 0.6), pills: pop(lt, yi + 0.4, 0.3) });
        const k = (1 + 0.13 * (1 - eo(clamp(lt / 0.32)))) * (1 + Z * eio(clamp(lt / d)));
        ctx.save(); ctx.translate(HOOK_CAM[0], HOOK_CAM[1]); ctx.scale(1 / k, 1 / k); ctx.translate(-HOOK_CAM[0], -HOOK_CAM[1]);
        K.ywHeartburnBadge(900, 175, 0.5, pop(lt, 0.9, 0.3), t);
        K.pill('NEXT', 900, 300, 36, C.yellow, C.ink, pop(lt, 0.95, 0.3));
        badge(210, 150, pop(lt, 0.9, 0.3), 34);
        K.followPill(210, 245, pop(lt, 1.1), t, 38);
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + yi, 'boing', { gain: 0.35 }); cue(st + yi + 0.4, 'pop', { gain: 0.35 }); cue(st + 0.9, 'pop', { gain: 0.4 }); cue(st + 1.1, 'pop', { gain: 0.5 });
  }

  S.sort((a, b) => a.at - b.at).forEach((s, i) => { s.id = 'S' + String(i + 1).padStart(2, '0'); });
  return { shots: S, cues: CUES, loop: true };
}
