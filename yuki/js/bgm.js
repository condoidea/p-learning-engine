/* =========================================================
 * yuki/bgm.js — その場で鳴らす BGM（音声ファイルなし・すべてオリジナル曲）
 *
 *  Y.Bgm.play(id, level)  曲を流す（同じ曲なら level だけ変える）
 *  Y.Bgm.level(n)          盛り上がり 0〜3（0：和音とベース → 1：太鼓 → 2：スネアとアルペジオ → 3：メロディ）
 *  Y.Bgm.climax()          一瞬止めてから「ドーン」→ 全部の楽器（発動の瞬間）。止まっている時間ぶん待つ Promise を返す
 *  Y.Bgm.duck(on)          読み上げ中は音量を下げる
 *  Y.Bgm.jingle(name)      ファンファーレなど一回だけ鳴る曲（clear / victory / lose）
 *  Y.Bgm.stop()
 *
 *  曲の書き方（SONGS）：1小節 = 8分音符 8つ。トークンを空白で区切る（| は読みやすさのためだけ）
 *   lead   'E5' など＝音、'-'＝前の音をのばす、'.'＝休み
 *   chords 1小節に1つ（'Em' 'F#m' 'Bb' …）。和音・ベース・アルペジオはここから作る
 *   bass   r＝根音 f＝5度 o＝1オクターブ上 .＝休み（毎小節くり返す）
 *   kick / snare / perc / hat   x＝鳴らす .＝休み（毎小節くり返す）。hat16: true なら16分で刻む
 *   arp    和音の何番目の音か（0〜3）。arp16: true なら16分
 *  音の出口は engine/js/audio.js（iPhone のマナーモード対策もそちら）
 * ========================================================= */
(function () {
  'use strict';
  var Y = window.Y;

  var SONGS = {
    /* はじまりの村（タイトル・地図・レッスン）：G長調・のどかな冒険 */
    village: { bpm: 96, lead: 'tri', chords: 'G D Em C G Bm C D',
      lead_: 'B4 - D5 - G5 - F#5 E5 | D5 - - - A4 - F#4 A4 | B4 - G4 - E5 - D5 B4 | C5 - - - E5 - G5 - | D5 - B4 - G5 - A5 B5 | F#5 - - - D5 - B4 - | E5 - G5 - F#5 - E5 C5 | D5 - - - - - . .',
      bass: 'r . . r f . r .', kick: 'x . . . x . . .', snare: '. . x . . . x .', hat: 'x x x x x x x x', arp: '0 1 2 1 0 1 2 1' },
    /* 錬成の工房：イ短調・神秘的。鐘のような音 */
    forge: { bpm: 90, lead: 'bell', chords: 'Am F C G Am F E E',
      lead_: 'A5 - - E5 - - C6 - | A5 - - - F5 - - - | G5 - - E5 - - C5 - | D5 - - - B4 - - - | A5 - - E5 - - C6 - | D6 - - - C6 - A5 - | B5 - - G#5 - - E5 - | B4 - - - - - - -',
      bass: 'r . . . f . . .', kick: 'x . . . . . x .', snare: '. . . . x . . .', hat: '. x . x . x . x', arp: '0 1 2 3 2 1 2 1', arp16: true },
    /* ⚡ 雷（置換）：ホ短調・疾走 */
    thunder: { bpm: 144, lead: 'saw', chords: 'Em Em C D Em Em C B',
      lead_: 'E5 . E5 G5 . E5 B5 - | A5 G5 F#5 G5 - - E5 - | G5 . G5 A5 . G5 E5 - | F#5 - D5 - A5 - F#5 - | E5 . E5 G5 . B5 E6 - | D6 B5 G5 B5 - - G5 - | C6 - B5 - A5 - G5 E5 | D#5 - F#5 - B5 - - -',
      bass: 'r r r r r r o r', kick: 'x . . x x . . .', snare: '. . x . . . x .', hat: 'x x x x x x x x', hat16: true, arp: '0 2 1 2 0 2 1 2' },
    /* 🌪 風（付加）：イ長調・軽やかに跳ねる */
    wind: { bpm: 128, lead: 'square', chords: 'A E F#m D A E D E',
      lead_: 'E5 - C#5 E5 - A5 - E5 | B4 - E5 - G#5 - F#5 E5 | F#5 - A5 - C#6 - A5 F#5 | A5 - - F#5 - D5 - - | E5 C#5 E5 A5 - B5 C#6 - | B5 - G#5 - E5 - B5 - | A5 - F#5 - D5 - F#5 A5 | G#5 - - - B5 - - -',
      bass: 'r . f r . r f .', kick: 'x . . x . . x .', snare: '. . x . . . x .', hat: 'x x x x x x x x', arp: '0 1 2 1 0 1 2 1', arp16: true },
    /* 🏜 砂（脱水・縮合）：ニの音のフリジア・ドミナント（中東風の音階）・重い太鼓 */
    sand: { bpm: 104, lead: 'reed', chords: 'D Eb D Gm D Eb Cm D',
      lead_: 'D5 - Eb5 F#5 - G5 F#5 Eb5 | D5 - - - Bb4 - Eb5 - | F#5 - G5 A5 - Bb5 A5 G5 | G5 - - Bb5 - A5 G5 - | D6 - C6 Bb5 - A5 - - | G5 - Bb5 - A5 - G5 F#5 | Eb5 - D5 - C5 - Eb5 - | D5 - - - - - . .',
      bass: 'r . . r r . f .', kick: 'x . . x x . . .', snare: '. . . . . . . .', perc: 'x . x x . x . .', hat: '. x . x . x . x', arp: '0 1 2 1 0 1 2 1' },
    /* ボス戦：ハ短調・激しく */
    boss: { bpm: 152, lead: 'saw', chords: 'Cm Cm Ab Bb Cm Cm Ab G',
      lead_: 'C5 . C5 Eb5 . G5 . C6 | Bb5 - G5 - Eb5 - D5 - | Eb5 . Eb5 Ab5 . C6 . Eb6 | D6 - Bb5 - F5 - D5 - | G5 . G5 C6 . Eb6 . D6 | C6 - G5 - Eb5 - G5 - | Ab5 - G5 - F5 - Eb5 - | D5 - F5 - G5 - B5 -',
      bass: 'r r o r r r o r', kick: 'x . x . x . x .', snare: '. . x . . . x x', hat: 'x x x x x x x x', hat16: true, arp: '0 1 2 1 0 1 2 1' }
  };
  Y.SONGS = SONGS;

  /* ---------- 音の名前 → 周波数 ---------- */
  var NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function midi(n) {
    var m = /^([A-G])(#|b)?(\d)$/.exec(n); if (!m) return null;
    return NOTE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (+m[3] + 1) * 12;
  }
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function chord(name) {
    var m = /^([A-G])(#|b)?(m?)$/.exec(name);
    var root = NOTE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 48;   // 3オクターブ目
    var third = m[3] ? 3 : 4;
    return [root, root + third, root + 7, root + 12];
  }
  function toks(s) { return String(s || '').replace(/\|/g, ' ').trim().split(/\s+/); }
  function prep(song) {
    if (song._p) return song._p;
    var lead = [], t = toks(song.lead_), i;
    for (i = 0; i < t.length; i++) {
      if (t[i] === '-' ) { if (lead.length) lead[lead.length - 1].len++; continue; }
      if (t[i] === '.') continue;
      lead.push({ at: i, m: midi(t[i]), len: 1 });
    }
    song._p = { lead: lead, steps: t.length, chords: toks(song.chords).map(chord),
      bass: toks(song.bass), kick: toks(song.kick), snare: toks(song.snare), perc: song.perc ? toks(song.perc) : null,
      hat: toks(song.hat), arp: toks(song.arp).map(Number) };
    return song._p;
  }

  /* ---------- 音の部品 ---------- */
  var ctx = null, out = null, bus = null, rev = null, dly = null, layers = {};
  function setup() {
    if (ctx) return true;
    if (!window.Sfx) return false;
    Sfx.unlock();
    ctx = Sfx.raw.ctx(); if (!ctx) return false;
    out = ctx.createGain(); out.gain.value = vol();
    var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 3;
    out.connect(comp); comp.connect(ctx.destination);
    bus = ctx.createGain(); bus.connect(out);
    /* 残響（ノイズが減っていく音を響きとして使う） */
    rev = ctx.createConvolver();
    var len = Math.floor(ctx.sampleRate * 2.2), ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var c = 0; c < 2; c++) { var d = ir.getChannelData(c); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    rev.buffer = ir;
    var rg = ctx.createGain(); rg.gain.value = 0.32; rev.connect(rg); rg.connect(out);
    /* やまびこ（メロディ用） */
    dly = ctx.createDelay(1); var fb = ctx.createGain(), dg = ctx.createGain();
    fb.gain.value = 0.3; dg.gain.value = 0.22;
    dly.connect(fb); fb.connect(dly); dly.connect(dg); dg.connect(out);
    ['pad', 'bass', 'drum', 'arp', 'lead'].forEach(function (k) { var g = ctx.createGain(); g.gain.value = 0; g.connect(bus); layers[k] = g; });
    return true;
  }
  function vol() { return 0.55 * (Y.S.settings.vol == null ? 0.6 : Y.S.settings.vol); }
  function env(g, t, a, peak, dur, rel) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.setValueAtTime(peak, t + Math.max(a, dur - rel));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }
  function osc(type, f, t, dur, dest, detune) {
    var o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t);
    if (detune) o.detune.value = detune;
    o.connect(dest); o.start(t); o.stop(t + dur + 0.05); return o;
  }
  var NB = null;
  function noiseBuf() {
    if (NB) return NB;
    var len = ctx.sampleRate; NB = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = NB.getChannelData(0); for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return NB;
  }
  function noise(t, dur, type, freq, peak, dest) {
    var s = ctx.createBufferSource(); s.buffer = noiseBuf();
    var f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq;
    var g = ctx.createGain(); env(g, t, 0.003, peak, dur, dur * 0.9);
    s.connect(f); f.connect(g); g.connect(dest || layers.drum);
    s.start(t); s.stop(t + dur + 0.05);
  }
  var INST = {
    pad: function (notes, t, dur) {
      var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1100;
      var g = ctx.createGain(); env(g, t, 0.35, 0.05, dur, 0.4);
      f.connect(g); g.connect(layers.pad); g.connect(rev);
      notes.slice(0, 3).forEach(function (m) { osc('sawtooth', hz(m + 12), t, dur, f, -8); osc('sawtooth', hz(m + 12), t, dur, f, 8); });
    },
    bass: function (m, t, dur) {
      var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = 6;
      f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(220, t + dur);
      var g = ctx.createGain(); env(g, t, 0.006, 0.32, dur, dur * 0.5);
      f.connect(g); g.connect(layers.bass);
      osc('sawtooth', hz(m - 12), t, dur, f); osc('square', hz(m - 24), t, dur, f);
    },
    arp: function (m, t, dur) {
      var g = ctx.createGain(); env(g, t, 0.004, 0.06, Math.min(dur, 0.2), 0.15);
      g.connect(layers.arp); g.connect(dly);
      osc('square', hz(m + 24), t, dur, g);
    },
    kick: function (t) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
      env(g, t, 0.002, 0.9, 0.22, 0.2); o.connect(g); g.connect(layers.drum); o.start(t); o.stop(t + 0.3);
    },
    snare: function (t) {
      noise(t, 0.16, 'highpass', 1200, 0.32);
      var g = ctx.createGain(); env(g, t, 0.002, 0.15, 0.1, 0.09); g.connect(layers.drum); osc('triangle', 190, t, 0.1, g);
    },
    hat: function (t) { noise(t, 0.04, 'highpass', 7500, 0.12); },
    perc: function (t) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(320, t); o.frequency.exponentialRampToValueAtTime(190, t + 0.09);
      env(g, t, 0.002, 0.3, 0.12, 0.1); o.connect(g); g.connect(layers.drum); o.start(t); o.stop(t + 0.2);
      noise(t, 0.03, 'bandpass', 2500, 0.08);
    },
    lead: function (type, m, t, dur) {
      var g = ctx.createGain(), f = ctx.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.value = type === 'reed' ? 1800 : type === 'saw' ? 3200 : 5000;
      f.connect(g); g.connect(layers.lead); g.connect(dly); g.connect(rev);
      var w = { tri: 'triangle', bell: 'sine', saw: 'sawtooth', square: 'square', reed: 'square' }[type] || 'square';
      var peak = { tri: 0.16, bell: 0.13, saw: 0.075, square: 0.06, reed: 0.07 }[type] || 0.07;
      if (type === 'bell') { env(g, t, 0.004, peak, Math.max(dur, 0.9), 0.85); osc('sine', hz(m) * 2, t, 0.4, g); }
      else env(g, t, 0.015, peak, dur, Math.min(0.12, dur * 0.4));
      var o = osc(w, hz(m), t, Math.max(dur, type === 'bell' ? 0.9 : dur), f);
      if (dur > 0.3 && type !== 'bell') {    /* のばす音にビブラート */
        var lfo = ctx.createOscillator(), lg = ctx.createGain();
        lfo.frequency.value = 5.5; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(hz(m) * 0.012, t + dur);
        lfo.connect(lg); lg.connect(o.frequency); lfo.start(t); lfo.stop(t + dur + 0.05);
      }
    },
    crash: function (t) {
      noise(t, 1.6, 'highpass', 4000, 0.4, bus);
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(30, t + 0.9);
      env(g, t, 0.003, 0.9, 1, 0.9); o.connect(g); g.connect(bus); o.start(t); o.stop(t + 1.1);
    }
  };

  /* ---------- 進行（先読みスケジューラ） ---------- */
  var cur = null, curId = null, lvl = 0, timer = 0, nextT = 0, step = 0, muteUntil = 0;
  var LAYERS = [['pad', 'bass'], ['drum'], ['arp'], ['lead']];
  function applyLevel(t) {
    var on = {}; LAYERS.forEach(function (ls, i) { ls.forEach(function (k) { on[k] = i <= lvl; }); });
    /* 0 のときもドラムは少しだけ（レッスン中は静かに） */
    Object.keys(layers).forEach(function (k) {
      var v = on[k] ? (k === 'pad' ? 0.9 : 1) : 0;
      layers[k].gain.cancelScheduledValues(t);
      layers[k].gain.setTargetAtTime(v, t, 0.25);
    });
  }
  function on() { return Y.S.settings.bgm !== false; }
  function tick() {
    if (!cur || !ctx) return;
    var p = prep(cur), sd = 60 / cur.bpm / 2;
    while (nextT < ctx.currentTime + 0.15) {
      var t = nextT, s = step % p.steps, inBar = s % 8, bar = Math.floor(s / 8), ch = p.chords[bar % p.chords.length];
      if (t >= muteUntil) {
        if (inBar === 0) INST.pad(ch, t, sd * 8);
        var b = p.bass[inBar];
        if (b && b !== '.') INST.bass(ch[0] + (b === 'f' ? 7 : b === 'o' ? 12 : 0), t, sd * 0.9);
        if (lvl >= 1) {
          if (p.kick[inBar] === 'x') INST.kick(t);
          if (p.hat[inBar] === 'x') { INST.hat(t); if (cur.hat16) INST.hat(t + sd / 2); }
          if (p.perc && p.perc[inBar] === 'x') INST.perc(t);
        }
        if (lvl >= 2) {
          if (p.snare[inBar] === 'x') INST.snare(t);
          var ai = p.arp[inBar % p.arp.length];
          if (!isNaN(ai)) { INST.arp(ch[ai % ch.length], t, sd); if (cur.arp16) INST.arp(ch[(ai + 2) % ch.length], t + sd / 2, sd / 2); }
        }
        if (lvl >= 3) p.lead.forEach(function (n) { if (n.at === s) INST.lead(cur.lead, n.m, t, n.len * sd * 0.95); });
      }
      nextT += sd; step++;
    }
  }
  function start(id) {
    cur = SONGS[id]; curId = id; step = 0; nextT = ctx.currentTime + 0.08;
    if (!timer) timer = setInterval(tick, 30);
    tick();
  }

  var Bgm = Y.Bgm = {
    play: function (id, level) {
      if (level != null) lvl = level;
      if (!on() || !setup()) { curId = id; return; }
      if (ctx.state === 'suspended') ctx.resume();
      if (curId === id && cur) { applyLevel(ctx.currentTime); return; }
      var t = ctx.currentTime;
      if (cur) {   /* 前の曲は短くフェードしてから切りかえ */
        bus.gain.cancelScheduledValues(t); bus.gain.setTargetAtTime(0.0001, t, 0.12);
        cur = null;
        setTimeout(function () {
          if (curId !== id || cur) return;   /* 待っている間に別の曲・停止になった */
          bus.gain.cancelScheduledValues(ctx.currentTime); bus.gain.setValueAtTime(1, ctx.currentTime); start(id); applyLevel(ctx.currentTime);
        }, 420);
        curId = id; return;
      }
      bus.gain.setValueAtTime(1, t);
      start(id); applyLevel(t);
    },
    level: function (n) { lvl = Math.max(0, Math.min(3, n)); if (ctx && cur) applyLevel(ctx.currentTime); },
    getLevel: function () { return lvl; },
    current: function () { return curId; },
    /* 発動の瞬間：0.45秒の「ため」（無音）→ ドーン → 全部の楽器 */
    climax: function () {
      if (!ctx || !cur || !on()) return Y.sleep(450);
      var t = ctx.currentTime, gap = 0.45;
      muteUntil = t + gap;
      bus.gain.cancelScheduledValues(t); bus.gain.setTargetAtTime(0.0001, t, 0.03);
      bus.gain.setValueAtTime(1, t + gap);
      INST.crash(t + gap);
      lvl = 3; applyLevel(t + gap);
      return Y.sleep(gap * 1000);
    },
    duck: function (d) { if (!ctx) return; var t = ctx.currentTime; out.gain.cancelScheduledValues(t); out.gain.setTargetAtTime(d ? vol() * 0.35 : vol(), t, 0.15); },
    setVol: function () { if (out) out.gain.setTargetAtTime(vol(), ctx.currentTime, 0.1); },
    stop: function () {
      if (!ctx) return; var t = ctx.currentTime;
      if (cur) { bus.gain.cancelScheduledValues(t); bus.gain.setTargetAtTime(0.0001, t, 0.15); }
      cur = null; curId = null;
    },
    /* 一回だけの曲。鳴り終わる時間（ms）を返す */
    jingle: function (name) {
      if (!on() || !setup()) return 0;
      Bgm.stop();
      var t = ctx.currentTime + 0.25;
      layers.lead.gain.cancelScheduledValues(t); layers.lead.gain.setValueAtTime(1, t);
      layers.pad.gain.cancelScheduledValues(t); layers.pad.gain.setValueAtTime(1, t);
      bus.gain.cancelScheduledValues(t); bus.gain.setValueAtTime(1, t);
      var J = {
        clear: [['C5', 0, 1], ['E5', 1, 1], ['G5', 2, 1], ['C6', 3, 4], ['G5', 5, 1], ['C6', 6, 6]],
        victory: [['G4', 0, 1], ['G4', 1, 1], ['G4', 2, 1], ['G4', 3, 3], ['Eb4', 6, 3], ['F4', 9, 3], ['G4', 12, 2], ['F4', 14, 1], ['G4', 15, 8]],
        lose: [['E5', 0, 2], ['D#5', 2, 2], ['D5', 4, 2], ['C#5', 6, 8]]
      }[name] || [];
      var sd = name === 'victory' ? 0.11 : 0.13, end = 0;
      J.forEach(function (n) {
        var m = midi(n[0]), at = t + n[1] * sd, d = n[2] * sd;
        INST.lead(name === 'lose' ? 'tri' : 'square', m, at, d); INST.lead('tri', m - 12, at, d);
        end = Math.max(end, n[1] + n[2]);
      });
      if (name !== 'lose') INST.pad(name === 'victory' ? chord('C').map(function (x) { return x + 7; }) : chord('C'), t + (end - 6) * sd, 6 * sd + 0.6);
      return Math.round((end * sd + 0.9) * 1000);
    }
  };
  document.addEventListener('visibilitychange', function () {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else if (on()) ctx.resume();
  });
})();
