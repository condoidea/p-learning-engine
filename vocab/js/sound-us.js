/* =========================================================
 * vocab/sound-us.js — サウンドパック「Avenue」（WORD AVENUE・英語）
 *  スチール弦のアコースティックギター（Karplus-Strong を明るめに）＋ジャズっぽい和音（maj7・9th・13th）
 *  ＋フィンガースナップ・ブラシ。カフェのジャズ・ギターのような、アメリカっぽくておしゃれな音。
 *  音の出口・振動・マナーモード対策は共通の engine/js/audio.js（Sfx.raw）。どの機種でも同じに鳴る。
 * ========================================================= */
(function () {
  'use strict';
  var R = window.Sfx && Sfx.raw;
  window.SndPacks = window.SndPacks || {};
  if (!R) return;

  var C3 = 130.81;
  function f(semi) { return C3 * Math.pow(2, semi / 12); }
  /* メジャー・ペンタトニック＋ブルーノート（コンボで上がっていく） */
  var SCALE = [12, 14, 16, 19, 21, 24, 26, 27, 28, 31, 33, 36, 38, 40, 43];

  var cache = {};
  function pluckBuf(ctx, freq, dur, bright) {
    var k = Math.round(freq * 10) + ':' + dur + ':' + bright;
    if (cache[k]) return cache[k];
    var sr = ctx.sampleRate, n = Math.floor(sr * dur), p = Math.max(2, Math.round(sr / freq));
    var buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0), ring = new Float32Array(p), i, idx = 0;
    for (i = 0; i < p; i++) ring[i] = (Math.random() * 2 - 1) * 0.9 + (i < p / 2 ? 0.1 : -0.1);   // スチール弦らしく、少し硬いアタック
    var damp = 0.5 * (bright || 0.9975);
    for (i = 0; i < n; i++) { var nx = (idx + 1) % p, v = ring[idx]; ring[idx] = (v + ring[nx]) * damp; d[i] = v; idx = nx; }
    cache[k] = buf;
    return buf;
  }
  function pluck(t, freq, vol, dur, bright) {
    var ctx = R.ctx(), src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = pluckBuf(ctx, freq, dur || 1.4, bright);
    g.gain.value = vol || 0.45;
    src.connect(g); g.connect(R.out()); src.start(t);
  }
  /* フィンガースナップ・ブラシ */
  function snap(t, vol) { R.noise(t, 0.035, vol || 0.32, 3200, 2400); R.tone(1800, t, 0.02, 'triangle', (vol || 0.32) * 0.15); }
  function brush(t, vol) { R.noise(t, 0.22, vol || 0.08, 2500, 6000); }
  function strum(t, semis, gap, vol) { semis.forEach(function (s, i) { pluck(t + i * (gap || 0.02), f(s), vol || 0.3, 1.8); }); }

  var CMAJ9 = [0, 7, 11, 14, 16], DM9 = [2, 9, 12, 16, 17], G13 = [-5, 5, 11, 16, 21], FMAJ7 = [5, 12, 16, 21, 24], AM9 = [-3, 7, 12, 14, 19], E7S9 = [4, 11, 14, 19, 20];
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  window.SndPacks.us = {
    tap: function () { R.play(function (t) { pluck(t, f(31), 0.12, 0.3, 0.985); }); },
    flip: function () { R.play(function (t) { brush(t, 0.07); pluck(t + 0.03, f(28), 0.16, 0.6); }); },
    guess: function () { R.play(function (t) { pluck(t, f(16), 0.25, 0.9); pluck(t + 0.08, f(23), 0.2, 0.9); }); },
    ok: function (combo) {
      R.buzz(combo >= 5 ? [12, 30, 12] : 12);
      R.play(function (t) {
        var i = Math.min(SCALE.length - 3, combo || 0);
        pluck(t, f(SCALE[i]), 0.38, 1.1);
        pluck(t + 0.07, f(SCALE[i + 2]), 0.32, 1.3);
        if (combo && combo % 5 === 0) [0.2, 0.5].forEach(function (d) { snap(t + d); });
      });
    },
    /* まちがい：弦をすべらせて下がる音（ブルースっぽく）＋ミュート */
    ng: function () {
      R.buzz([30, 40, 30]);
      R.play(function (t) { R.tone(f(10), t, 0.3, 'triangle', 0.16, f(5)); pluck(t + 0.05, f(-8), 0.4, 0.25, 0.9); });
    },
    appear: function () { R.play(function (t) { strum(t, AM9, 0.03, 0.22); strum(t + 0.4, E7S9, 0.03, 0.22); brush(t + 0.4, 0.06); }); },
    capture: function () {
      R.buzz([15, 40, 15]);
      R.play(pick([
        function (t) { strum(t, CMAJ9, 0.025); snap(t + 0.35); snap(t + 0.6); },
        function (t) { [0, 4, 7, 11, 14, 16].forEach(function (s, i) { pluck(t + i * 0.06, f(s + 12), 0.28, 1.6); }); },
        function (t) { strum(t, G13, 0.02, 0.26); strum(t + 0.3, CMAJ9, 0.025); }
      ]));
    },
    /* 進化：ii-V-I（Dm9 → G13 → Cmaj9）とスナップ */
    levelUp: function (lv) {
      R.buzz([20, 40, 20, 40, 80]);
      R.play(function (t) {
        strum(t, DM9, 0.02, 0.3); strum(t + 0.35, G13, 0.02, 0.3); strum(t + 0.75, CMAJ9, 0.03, 0.36);
        [0.35, 0.75, 1.1].forEach(function (d) { snap(t + d, 0.3); });
        if (lv >= 3) [0, 4, 7, 11, 14, 16, 19, 23].forEach(function (s, i) { pluck(t + 1.3 + i * 0.05, f(s + 24), 0.18, 1.8); });
      });
    },
    back: function () { R.play(function (t) { [12, 16, 19, 23, 26].forEach(function (s, i) { pluck(t + i * 0.08, f(s), 0.28, 1.5); }); }); },
    finish: function () { R.play(function (t) { strum(t, FMAJ7, 0.04, 0.26); strum(t + 0.5, CMAJ9, 0.06, 0.34); brush(t + 0.5, 0.07); }); }
  };
})();
