// WHAT HAPPENS IF YOU GET STRUCK BY LIGHTNING?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
// Safety: the hero is never struck. Bolts stay outside the window or hit the ground in an empty storm scene; the
// current-over-the-skin beat uses a generic slate silhouette with a glowing outline. The fern is a soft red pattern on
// a forearm (not a burn) and it fades. CPR = phone with 911 + a heart/hands icon. The water tease: the jug just stands there.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, bigText, line } from './core/lib.js';
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
  const flick = (lt, a, len = 0.5) => (lt > a && lt < a + len ? 1 - 0.7 * Math.max(0, Math.sin((lt - a) * 34)) * seg(lt, a, a + len) : 0);
  const HERO = { x: 320, y: 1000, s: 1.2 };                    // the hero's spot in the room (left, clear of the window)
  const hero = (o) => K.man({ ...HERO, ...o });

  // ── 1 · HOOK: storm outside, hero worried; bolt flashes outside the window on "struck", BOOM on "lightning" ──
  {
    const st = cut(0), sk = Wd('struck', 0) - st, li = Wd('lightning', 0) - st;
    add({ id: 'S01', at: st, cam: [620, 760], zoom: 0.1, note: 'room, storm in the window from frame 0 (bolt flicker at 0.15 s), hero frowning at it; big flash + wide eyes on "struck", BOOM! on "lightning"',
      draw(lt, d, t) {
        K.home();
        const b = Math.max(flick(lt, 0.15, 0.4), flick(lt, sk, 0.6));
        K.stormWindow(t, b, lt > sk && lt < sk + 0.12 ? 1 : 0);
        const wide = lt > sk;
        hero({ look: 1, eyes: wide ? 'wide' : 'n', mouth: wide ? 'o' : 'flat', frown: !wide, brow: wide ? 1 : 0.3,
          arm: wide ? K.armPose(K.ARM.down, K.ARM.mouth, eo(seg(lt, sk, sk + 0.25))) : K.ARM.down });
        K.shockLines(HERO.x, HERO.y - 350 * HERO.s, 170, wide ? clamp((lt - sk) * 5) : 0);
        bigText('BOOM!', 790, 800, 120, C.yellow, -0.1, pop(lt, li, 0.2));
        if (lt > sk && lt < sk + 0.14) { ctx.save(); ctx.globalAlpha = 0.35 * (1 - (lt - sk) / 0.14); ctx.fillStyle = C.white; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); }
      } });
    cue(st + 0.15, 'zip', { gain: 0.4 }); cue(st + sk, 'slam', { gain: 0.8 }); cue(st + li, 'thud', { gain: 0.7 }); cue(st + li + 0.05, 'alarm', { dur: 0.5, gain: 0.25 });
  }

  // ── 2a · most people actually survive: relief + a beating heart ─────────────────
  {
    const st = cut(1), sv = Wd('survive', 1) - st, mo = Wd('most', 1) - st;
    add({ id: 'S02', at: st, cam: [480, 800], zoom: 0.08, note: 'hero exhales, beating heart pops beside him on "survive" + burst',
      draw(lt, d, t) {
        K.home(); K.stormWindow(t, 0);
        const ok = lt > sv;
        hero({ look: 1, eyes: ok ? 'closed' : 'n', mouth: ok ? 'smile' : 'flat', brow: ok ? 0.6 : 0.3 });
        const hp = pop(lt, sv);
        if (hp > 0) K.heart(640, 880, 0.95 * hp, Math.max(0, Math.sin(lt * 9)));
        K.burst(640, 860, 2.4, ok ? 1 - seg(lt, sv + 0.2, sv + 0.6) : 0);
        K.pill('MOST PEOPLE', 640, 1110, 50, C.ink, C.white, pop(lt, mo));
      } });
    cue(st, 'whoosh'); cue(st + mo, 'pop', { gain: 0.4 }); cue(st + sv, 'sparkle', { dur: 0.5, gain: 0.5 });
  }
  // ── 2b · but some get a weird souvenir: a gift box in a thought bubble ───────────
  {
    const st = at('but', 1), we = Wd('weird', 1) - st, so = Wd('souvenir', 1) - st;
    add({ id: 'S02b', at: st, cam: [640, 820], zoom: 0.1, note: 'thought bubble with a gift box, box wobbles on "weird", lid pops + "?" on "souvenir"',
      draw(lt, d, t) {
        K.home(); K.stormWindow(t, 0);
        hero({ look: 1, eyes: 'n', mouth: lt > so ? 'o' : 'flat', brow: lt > we ? 1 : 0.4 });
        const b = pop(lt, 0.05);
        K.bubble(750, 920, 380, 330, 430, 700, b);
        if (b > 0) {
          ctx.save(); ctx.translate(750, 960); ctx.scale(b, b);
          K.giftBox(0, 0, 0.62, eo(seg(lt, so, so + 0.3)), t, lt > we && lt < so ? 1 : 0);
          if (lt > so) bigText('?', 0, lerp(-20, -150, eo(seg(lt, so, so + 0.4))), 120, C.yellow, 0.1, pop(lt, so + 0.05));
          ctx.restore();
        }
      } });
    cue(st, 'whoosh', { gain: 0.7 }); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + we, 'boing', { gain: 0.4 }); cue(st + so, 'pop', { gain: 0.6 });
  }

  // ── 3a · the bolt heats the air around it (empty storm scene, bolt hits the ground) ──
  const BX = 520, BY = 430, BS = 1.35;                       // bolt top + scale; tip lands at (BX - 81, BY + 702)
  {
    const st = cut(2), bo = Wd('bolt', 2) - st, he = Wd('heats', 2) - st, ai = Wd('air', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.1, note: 'storm sky, bolt slams to the ground on "bolt", heat rings spread from "heats", AIR tag on "air"',
      draw(lt, d, t) {
        const on = lt > bo;
        K.skyBg(t, on && lt < bo + 0.12 ? 1 : 0);
        K.stormCloud(540, 330, 1.1, t);
        K.heatRings(BX + 10, BY + 360, eo(seg(lt, he, he + 0.9)), t);
        if (on) { const g = eo(seg(lt, bo, bo + 0.12)); ctx.save(); ctx.beginPath(); ctx.rect(-300, -300, W + 600, BY + 760 * g + 300); ctx.clip(); K.lightningBolt(BX, BY, BS, 1); ctx.restore(); }
        K.burst(BX - 81, BY + 702, 1.8, on ? 1 - seg(lt, bo + 0.3, bo + 0.8) : 0);
        K.tag('AIR', 860, 560, 720, 700, 56, pop(lt, ai));
      } });
    cue(st, 'whoosh'); cue(st + bo, 'slam', { gain: 0.8 }); cue(st + he, 'sizzle', { dur: 0.9, gain: 0.35 }); cue(st + ai, 'pop', { gain: 0.5 });
  }
  // ── 3b · five times hotter than the sun's surface: thermometer rockets past the SUN mark ──
  {
    const st = at('five', 2), fi = Wd('five', 2) - st, ho = Wd('hotter', 2) - st, su = Wd('sun', 2) - st;
    const TX = 400, TY = 760, TS = 0.85, ySun = K.thermoY(TY, TS, 0.18), yTop = K.thermoY(TY, TS, 0.92);
    add({ id: 'S03b', at: st, cam: [560, 760], zoom: 0.08, note: 'thermometer with a SUN mark; mercury rockets to the bolt mark from "five" to "hotter", 5X pill on "five", sun bounces + SUN tag on "sun\'s"',
      draw(lt, d, t) {
        plain();
        const lv = lerp(0.18, 0.92, eio(seg(lt, fi, ho + 0.15)));
        K.thermometer(TX, TY, TS, lv);
        line([[TX + 110, ySun], [TX + 175, ySun]], C.ink, 10); line([[TX + 110, yTop], [TX + 175, yTop]], C.ink, 10);
        const sb = lt > su ? Math.abs(Math.sin((lt - su) * 10)) * 30 * (1 - seg(lt, su, su + 0.6)) : 0;
        K.sun(TX + 290, ySun - sb, 0.48, t);
        K.lightningBolt(TX + 250, yTop - 130, 0.42, pop(lt, ho));
        K.burst(TX + 280, yTop, 1.8, lt > ho ? 1 - seg(lt, ho + 0.2, ho + 0.6) : 0);
        K.pill('5X', 860, (ySun + yTop) / 2, 64, C.red, C.white, pop(lt, fi));
        K.pill('SUN', TX + 290, ySun + 140, 46, C.ink, C.white, pop(lt, su));
      } });
    cue(st, 'whoosh'); cue(st + fi, 'pop', { gain: 0.5 }); cue(st + fi + 0.05, 'slide', { dur: ho - fi + 0.1, gain: 0.5 }); cue(st + ho + 0.1, 'slam', { gain: 0.5 }); cue(st + su, 'boing', { gain: 0.4 });
  }

  // ── 4a · the current skims over the skin (generic silhouette, glowing outline) ───
  const SX = 540, SY = 640, SS = 0.75;
  {
    const st = cut(3), cu = Wd('current', 3) - st, sm = Wd('skim', 3) - st, sk = Wd('skin', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.08, note: 'slate silhouette, a spark sits on the head on "current", the current runs over the skin outline from "skim" down to the feet, SKIN tag on "skin"',
      draw(lt, d, t) {
        plain();
        const tr = lt < cu ? 0 : lt < sm ? 0.01 : lerp(0.01, 1, eio(seg(lt, sm, sk + 0.35)));
        K.silhouette(SX, SY, SS, { trace: tr, t });
        K.burst(SX, SY + 650 * SS, 0.9, tr >= 1 ? 1 - seg(lt, sk + 0.4, sk + 0.9) : 0);
        K.tag('SKIN', 860, 330, SX + 175 * SS, SY - 226 * SS, 52, pop(lt, sk));
      } });
    cue(st, 'whoosh'); cue(st + cu, 'zip', { gain: 0.4 }); cue(st + sm, 'sizzle', { dur: sk - sm + 0.35, gain: 0.35 }); cue(st + sk, 'pop', { gain: 0.5 });
  }
  // ── 4b · ...instead of going through you (red X on the path through the body) ───
  {
    const st = at('instead', 3), go = Wd('going', 3) - st, th = Wd('through', 3) - st;
    add({ id: 'S04b', at: st, cam: [540, 700], zoom: 0.08, note: 'outline stays lit; dashed red path straight down through the body on "going", red X over the chest on "through"',
      draw(lt, d, t) {
        plain();
        K.silhouette(SX, SY, SS, { glow: 1, t });
        const g = eo(seg(lt, go, go + 0.3));
        if (g > 0) { ctx.save(); ctx.setLineDash([30, 22]); line([[SX, SY - 380 * SS], [SX, lerp(SY - 380 * SS, SY + 560 * SS, g)]], C.red, 16); ctx.restore(); }
        if (lt > th) K.redX(SX, SY - 40, lerp(1.0, 0.6, eo(seg(lt, th, th + 0.2))), 1, 0.7);
      } });
    cue(st, 'whoosh'); cue(st + go, 'slide', { dur: 0.3, gain: 0.4 }); cue(st + th, 'slam');
  }

  // ── 5 · about nine in ten people who get struck survive ────────────────────────
  {
    const st = cut(4), ni = Wd('nine', 4) - st, te = Wd('ten', 4) - st, sv = Wd('survive', 4) - st;
    const P = []; for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) P.push([220 + c * 160, 560 + r * 330]);
    add({ id: 'S05', at: st, cam: [540, 720], zoom: 0.07, note: '10 grey person icons; 9 turn blue one by one on "nine", the 10th stays grey on "ten", the 9 bounce on "survive"',
      draw(lt, d, t) {
        plain();
        P.forEach(([x, y], i) => {
          const lit = i < 9 && lt > ni + i * 0.05;
          const hop = lit && lt > sv ? Math.abs(Math.sin((lt - sv) * 9 + i * 0.4)) * 30 * (1 - seg(lt, sv + 0.3, sv + 0.7)) : 0;
          K.personIcon(x, y - hop, 1, lit ? C.shirt : C.gumEdge, pop(lt, i * 0.02 - 0.25));
        });
        if (lt > te) { ctx.save(); ctx.globalAlpha = eo(seg(lt, te, te + 0.2)); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.setLineDash([20, 14]); ctx.beginPath(); ctx.roundRect(110, 400, 860, 650, 40); ctx.stroke(); ctx.restore(); }
      } });
    cue(st, 'whoosh'); for (let i = 0; i < 9; i++) cue(st + ni + i * 0.05, 'pop', { gain: 0.25 }); cue(st + te, 'tock', { gain: 0.5 }); cue(st + sv, 'boing', { gain: 0.5 });
  }

  // ── 6 · the real danger: the heart can suddenly stop (x-ray film, no body harm shown) ──
  {
    const st = cut(5), da = Wd('danger', 5) - st, he = Wd('heart', 5) - st, sp = Wd('stop', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 720], zoom: 0.1, note: 'x-ray film: beating heart + cyan heartbeat line; warning on "danger", heart grows on "heart", freezes + line goes flat red on "stop"',
      draw(lt, d, t) {
        K.xray(t);
        const stopped = lt > sp, tt = stopped ? st + sp : t;
        const beat = stopped ? 0 : Math.max(0, Math.sin(lt * 10));
        K.heart(540, 760, lerp(1.3, 1.6, eo(seg(lt, he, he + 0.3))), beat);
        K.ecg(540, 1080, 860, tt, eo(seg(lt, sp, sp + 0.25)), stopped ? C.red : C.cyan);
        K.pinchRing(540, 740, 300, 250, (t * 2) % 1, stopped ? eo(seg(lt, sp, sp + 0.2)) : 0);
        K.warning(540, 320, pop(lt, da) * 0.8);
      } });
    cue(st, 'whoosh'); cue(st + da, 'alarm', { dur: 0.7, gain: 0.35 }); cue(st + he, 'thud', { gain: 0.4 }); cue(st + sp, 'slam', { gain: 0.7 });
  }

  // ── 7a · the souvenir? about an hour later ────────────────────────────────────
  {
    const st = cut(6), so = Wd('souvenir', 6) - st, ho = Wd('hour', 6) - st;
    add({ id: 'S07', at: st, cam: [560, 760], zoom: 0.08, note: 'gift box, lid pops + "?" on "souvenir", stopwatch pops on "hour" and its hand makes one turn',
      draw(lt, d, t) {
        plain();
        K.giftBox(400, 860, 1.05, eo(seg(lt, so, so + 0.35)), t, lt < so ? 1 : 0);
        if (lt > so) bigText('?', 400, lerp(820, 560, eo(seg(lt, so, so + 0.45))), 170, C.yellow, 0.1, pop(lt, so + 0.05));
        K.stopwatch(800, 520, 0.38 * pop(lt, ho - 0.1), lt < ho ? 0 : Math.PI * 2 * eio(seg(lt, ho, ho + 0.7)));
      } });
    cue(st, 'whoosh'); cue(st + so, 'pop', { gain: 0.6 }); cue(st + ho - 0.1, 'pop', { gain: 0.4 }); cue(st + ho + 0.1, 'tock'); cue(st + ho + 0.5, 'tock', { gain: 0.5 });
  }
  // ── 7b · a red fern spreads across your skin ─────────────────────────────────
  const AX = 430, AY = 780, AS = 0.9;
  {
    const st = Wd('later', 6, 'e') + 0.16, fe = Wd('fern', 6) - st, sk = Wd('skin', 6) - st;
    add({ id: 'S07b', at: st, cam: [520, 780], zoom: 0.12, note: 'bare forearm, the red fern appears on "fern" and spreads until "skin"',
      draw(lt, d, t) {
        plain();
        K.forearm(AX, AY, AS, { fern: lt < fe ? 0 : lerp(0.38, 1, eio(seg(lt, fe, sk + 0.3))) });
      } });
    cue(st, 'whoosh'); cue(st + fe, 'sparkle', { dur: sk - fe + 0.3, gain: 0.5 });
  }

  // ── 8a · it's called a Lichtenberg figure ─────────────────────────────────────
  {
    const st = cut(7), li = Wd('lichtenberg', 7) - st;
    add({ id: 'S08', at: st, cam: [520, 700], zoom: 0.08, note: 'forearm with the full fern, LICHTENBERG FIGURE tag on "Lichtenberg"',
      draw(lt, d, t) {
        plain();
        K.forearm(AX, AY, AS, { fern: 1 });
        K.tag('LICHTENBERG FIGURE', 540, 420, 400, 730, 50, pop(lt, li));
      } });
    cue(st, 'whoosh'); cue(st + li, 'pop', { gain: 0.6 });
  }
  // ── 8b · not a burn, and it fades within hours ────────────────────────────────
  {
    const st = at('not', 7), bu = Wd('burn', 7) - st, fa = Wd('fades', 7) - st, hr = Wd('hours', 7) - st;
    add({ id: 'S08b', at: st, cam: [520, 700], zoom: 0.08, note: 'BURN pill + red X on "burn", the fern fades away from "fades" to "hours"',
      draw(lt, d, t) {
        plain();
        K.forearm(AX, AY, AS, { fern: 1, fade: eio(seg(lt, fa, hr + 0.3)) });
        K.pill('BURN', 540, 400, 84, C.ink, C.white, pop(lt, 0.05));
        if (lt > bu) K.redX(540, 400, lerp(0.7, 0.38, eo(seg(lt, bu, bu + 0.2))), 1, 0.4);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + bu, 'slam', { gain: 0.6 }); cue(st + fa, 'sparkle', { dur: hr - fa + 0.3, gain: 0.45 });
  }

  // ── 9a · if someone gets struck, they're safe to touch ────────────────────────
  {
    const st = cut(8), sk = Wd('struck', 8) - st, sa = Wd('safe', 8) - st, to = Wd('touch', 8) - st;
    const [shx, shy] = K.silShoulder(400, 740, 0.78);
    add({ id: 'S09', at: st, cam: [540, 740], zoom: 0.08, note: 'calm silhouette; small bolt icon pops on "struck", red X over it + SAFE pill on "safe", a helping hand rests on the shoulder on "touch"',
      draw(lt, d, t) {
        plain();
        K.silhouette(400, 740, 0.78, {});
        K.lightningBolt(770, 250, 0.4, pop(lt, sk));
        if (lt > sa) K.redX(800, 360, lerp(0.75, 0.45, eo(seg(lt, sa, sa + 0.2))), 1, 0.6);
        K.pill('SAFE', 820, 960, 64, C.leaf, C.white, pop(lt, sa));
        const r = eio(seg(lt, to - 0.35, to));
        if (r > 0) K.reachArm(1400, 620, lerp(1250, shx + 30, r), lerp(600, shy + 10, r), 1);
      } });
    cue(st, 'whoosh'); cue(st + sk, 'zip', { gain: 0.4 }); cue(st + sa, 'slam', { gain: 0.5 }); cue(st + to - 0.35, 'slide', { dur: 0.35, gain: 0.4 }); cue(st + to, 'thud', { gain: 0.4 });
  }
  // ── 9b · so call 911 and start CPR ────────────────────────────────────────────
  {
    const st = Wd('touch', 8, 'e') + 0.34, ca = Wd('call', 8) - st, nn = Wd('nine', 8) - st, sr = Wd('start', 8) - st, cp = Wd('cpr', 8) - st;
    add({ id: 'S09b', at: st, cam: [540, 740], zoom: 0.08, note: 'phone pops on "call", 911 types in on "nine-one-one" and it rings; CPR heart + hands icon pops on "start", presses on "CPR"',
      draw(lt, d, t) {
        plain();
        const digits = lt < nn ? '' : '911'.slice(0, 1 + Math.floor(clamp((lt - nn) / 0.45) * 2.99));
        const ps = pop(lt, 0.02);
        if (ps > 0) K.phone(320, 760, 0.95 * ps, digits, lt > nn + 0.5 ? 1 : 0, t);
        const cs = pop(lt, sr);
        if (cs > 0) K.cprIcon(780, 840, 0.95 * cs, lt > cp ? Math.max(0, Math.sin((lt - cp) * 14)) : 0);
      } });
    cue(st, 'whoosh'); cue(st + ca - 0.05, 'pop', { gain: 0.5 });
    for (let i = 0; i < 3; i++) cue(st + nn + i * 0.15, 'tock', { gain: 0.4 });
    cue(st + sr, 'pop', { gain: 0.5 }); cue(st + cp, 'thud', { gain: 0.4 }); cue(st + cp + 0.45, 'thud', { gain: 0.35 });
  }

  // ── 10 · so when thunder roars, go indoors (hero safe inside, punchy to camera) ──
  {
    const st = cut(9), th = Wd('thunder', 9) - st, ro = Wd('roars', 9) - st, gi = Wd('indoors', 9) - st;
    add({ id: 'S10', at: st, cam: [460, 760], zoom: 0.08, note: 'room, thunder outside: bolt flickers in the window on "thunder", RUMBLE on "roars"; hero turns to camera, finger up on "indoors"',
      draw(lt, d, t) {
        K.home();
        K.stormWindow(t, flick(lt, th, 0.6), lt > th && lt < th + 0.1 ? 1 : 0);
        const shake = lt > ro && lt < ro + 0.5 ? Math.sin(lt * 60) * 6 : 0;
        bigText('RUMBLE', 780, 760 + shake, 96, C.yellow, -0.08, pop(lt, ro, 0.2) * (1 - seg(lt, gi - 0.1, gi + 0.1)));
        const p = eio(seg(lt, gi - 0.2, gi + 0.2));
        hero({ look: lt > gi ? 0 : 1, eyes: 'n', brow: 0.5, mouth: lt > gi ? 'grin' : 'flat', smirk: lt > gi,
          arm: K.armPose(K.ARM.down, K.ARM.point, p), finger: p > 0.5 ? 0 : null });
        K.pill('INDOORS', 700, 960, 58, C.ink, C.white, pop(lt, gi));
      } });
    cue(st, 'whoosh'); cue(st + th, 'zip', { gain: 0.35 }); cue(st + ro, 'thud', { gain: 0.7 }); cue(st + ro + 0.05, 'alarm', { dur: 0.5, gain: 0.25 }); cue(st + gi, 'pop', { gain: 0.6 });
  }

  // ── 11a · NEXT: series badge on "next" (name only, no number); the storm passes outside ──
  {
    const st = cut(10), nx = Wd('next', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.05, note: 'room, BODY FILES badge on "next"; hero at the left looks at the window (storm quiet, no bolt)',
      draw(lt, d, t) {
        K.home(); K.stormWindow(t, 0);
        K.filesBadge('BODY FILES', 540, 130, 44, pop(lt, nx));
        hero({ look: 1, eyes: 'n', brow: 0.4, mouth: 'flat' });
      } });
    cue(st, 'whoosh'); cue(st + nx, 'thud', { gain: 0.6 });
  }
  // ── 11b · ...drink too much water: a big water jug slides in, NEXT pill (the hero never drinks) ──
  const JX = 790, JY = 990, JS = 0.85;
  {
    const st = at('happens', 10), dr = Wd('drink', 10) - st, wa = Wd('water', 10) - st;
    add({ id: 'S11b', at: st, cam: [600, 780], zoom: 0.06, note: 'water jug slides in on "drink" and fills up to the brim on "water"; NEXT pill on "water"; hero only looks',
      draw(lt, d, t) {
        K.home(); K.stormWindow(t, 0);
        K.filesBadge('BODY FILES', 540, 130, 44, 1);
        hero({ look: 1, eyes: lt > wa ? 'wide' : 'n', brow: lt > wa ? 1 : 0.4, mouth: lt > wa ? 'o' : 'flat' });
        const sl = eob(seg(lt, dr - 0.3, dr + 0.1));
        if (lt > dr - 0.3) K.waterJug(lerp(1400, JX, sl), JY, JS, lerp(0.35, 0.95, eio(seg(lt, wa - 0.3, wa + 0.3))), t);
        K.pill('NEXT', JX, 740, 52, C.yellow, C.ink, pop(lt, wa));
      } });
    cue(st, 'whoosh'); cue(st + dr - 0.3, 'slide', { dur: 0.4, gain: 0.5 }); cue(st + dr + 0.1, 'thud', { gain: 0.5 }); cue(st + wa - 0.3, 'bubbles', { dur: 0.6, gain: 0.4 }); cue(st + wa, 'pop', { gain: 0.5 });
  }
  // ── 12 · ...and why it can make your brain swell: brain swells a little, NEXT + FOLLOW ──
  {
    const st = cut(11), br = Wd('brain', 11) - st, sw = Wd('swell', 11) - st;
    add({ id: 'S12', at: st, cam: [600, 760], zoom: 0.04, note: 'end card: badge, jug + NEXT stay; brain pops on the front of the jug on "brain", puffs up + swell lines on "swell"; FOLLOW pill (top left) after "swell"; hero looks to camera',
      draw(lt, d, t) {
        K.home(); K.stormWindow(t, 0);
        K.filesBadge('BODY FILES', 540, 130, 44, 1);
        hero({ look: lt > sw + 0.3 ? 0 : 1, eyes: lt > sw ? 'wide' : 'n', brow: lt > br ? 1 : 0.5, mouth: lt > sw ? 'o' : 'flat' });
        K.waterJug(JX, JY, JS, 0.95, t);
        K.pill('NEXT', JX, 740, 52, C.yellow, C.ink, 1);
        const bp = pop(lt, br), sv = lt > sw ? eob(seg(lt, sw, sw + 0.35)) : 0;
        if (bp > 0) K.brain(JX - 10, JY + 10, 0.3 * bp * (1 + 0.18 * sv), { t, wob: sv > 0 && sv < 1 ? 1 : 0 });
        K.shockLines(JX - 5, JY + 20, 105 + 20 * sv, lt > sw ? 1 : 0);
        K.followPill(330, 260, pop(lt, sw + 0.35), t);
      } });
    cue(st, 'whoosh'); cue(st + br, 'pop', { gain: 0.5 }); cue(st + sw, 'boing', { gain: 0.5 }); cue(st + sw + 0.35, 'pop', { gain: 0.5 });
  }

  return { shots: S, cues: CUES };
}
