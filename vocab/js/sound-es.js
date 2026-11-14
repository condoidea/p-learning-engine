/* =========================================================
 * vocab/sound-es.js — サウンドパック「España」
 *  ギターをはじく音（Karplus-Strong）・手拍子（パルマ）・カスタネット。
 *  音の出口・振動・マナーモード対策は共通の engine/js/audio.js（Sfx.raw）を使う。
 *  どの機種でも同じに鳴る（WebAudio の標準機能だけ）。
 * ========================================================= */
(function () {
  'use strict';
  var R = window.Sfx && Sfx.raw;
  window.SndPacks = window.SndPacks || {};
  if (!R) { window.Snd = window.Snd || {}; return; }

  /* スペインらしい音階（フリジア旋法：ミ・ファ・ソ#・ラ・シ・ド・レ） */
  var SCALE = [0, 1, 4, 5, 7, 8, 10, 12, 13, 16, 17, 19, 20, 22, 24];
  var E3 = 164.81;
  function f(semi) { return E3 * Math.pow(2, semi / 12); }

  /* ギターの弦をはじく音 */
  var cache = {};
  function pluckBuf(ctx, freq, dur, bright) {
    var k = Math.round(freq) + ':' + dur + ':' + bright;
    if (cache[k]) return cache[k];
    var sr = ctx.sampleRate, n = Math.floor(sr * dur), p = Math.max(2, Math.round(sr / freq));
    var buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0), ring = new Float32Array(p), i, idx = 0;
    for (i = 0; i < p; i++) ring[i] = Math.random() * 2 - 1;
    var damp = 0.5 * (bright || 0.996);
    for (i = 0; i < n; i++) {
      var nx = (idx + 1) % p, v = ring[idx];
      ring[idx] = (v + ring[nx]) * damp;
      d[i] = v; idx = nx;
    }
    cache[k] = buf;
    return buf;
  }
  function pluck(t, freq, vol, dur, bright) {
    var ctx = R.ctx(), src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = pluckBuf(ctx, freq, dur || 1.2, bright);
    g.gain.value = vol || 0.5;
    src.connect(g); g.connect(R.out()); src.start(t);
  }
  /* 手拍子（パルマ）・カスタネット */
  function palma(t, vol) { R.noise(t, 0.06, vol || 0.35, 1800, 1200); R.noise(t + 0.012, 0.05, (vol || 0.35) * 0.6, 2400, 1500); }
  function castanet(t, vol) { R.tone(2600, t, 0.025, 'square', vol || 0.06); R.noise(t, 0.03, (vol || 0.06) * 3, 5000, 3000); }
  /* かき鳴らし（ラスゲアード） */
  function strum(t, semis, gap, vol) { semis.forEach(function (s, i) { pluck(t + i * (gap || 0.018), f(s), vol || 0.32, 1.6); }); }

  var CH_E = [0, 7, 12, 16, 19, 24];   // ミのコード
  var CH_F = [1, 8, 13, 17, 20, 25];   // ファのコード（ミ→ファがスペインっぽい）
  var CH_A = [5, 12, 17, 21, 24];      // ラのコード

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* サウンドパックとして登録（ui.js がデッキの sound で選ぶ）。既定はこのパック */
  window.Snd = window.SndPacks.es = {
    tap: function () { R.play(function (t) { pluck(t, f(24), 0.12, 0.3, 0.98); }); },
    flip: function () { R.play(function (t) { R.noise(t, 0.12, 0.08, 3000, 800); pluck(t + 0.03, f(19), 0.16, 0.6); }); },
    /* 予想を選んだ（採点しない） */
    guess: function () { R.play(function (t) { pluck(t, f(12), 0.25, 0.8); pluck(t + 0.08, f(16), 0.2, 0.8); }); },
    /* 正解：コンボで音階が上がる。5の倍数で手拍子 */
    ok: function (combo) {
      R.buzz(combo >= 5 ? [12, 30, 12] : 12);
      R.play(function (t) {
        var i = Math.min(SCALE.length - 3, combo || 0);
        pluck(t, f(SCALE[i] + 12), 0.4, 1);
        pluck(t + 0.07, f(SCALE[i + 2] + 12), 0.35, 1.2);
        if (combo && combo % 5 === 0) [0, 0.14, 0.28].forEach(function (d) { palma(t + 0.2 + d); });
      });
    },
    /* まちがい：弦をミュートした低い音 */
    ng: function () {
      R.buzz([30, 40, 30]);
      R.play(function (t) { pluck(t, f(-5), 0.5, 0.25, 0.9); pluck(t + 0.09, f(-6), 0.45, 0.3, 0.9); });
    },
    /* 野生の単語が現れた */
    appear: function () { R.play(function (t) { strum(t, CH_F, 0.03, 0.22); strum(t + 0.35, CH_E, 0.03, 0.22); }); },
    /* 捕獲：3種類からランダム */
    capture: function () {
      R.buzz([15, 40, 15]);
      R.play(pick([
        function (t) { strum(t, CH_E, 0.02); [0.3, 0.42, 0.54].forEach(function (d) { castanet(t + d); }); },
        function (t) { [0, 4, 7, 12, 16].forEach(function (s, i) { pluck(t + i * 0.06, f(s + 12), 0.3, 1.4); }); palma(t + 0.4); },
        function (t) { strum(t, CH_A, 0.025); strum(t + 0.25, CH_E, 0.015); }
      ]));
    },
    /* 進化：フラメンコの決め（ファ→ミ のかき鳴らし＋手拍子） */
    levelUp: function (lv) {
      R.buzz([20, 40, 20, 40, 80]);
      R.play(function (t) {
        strum(t, CH_F, 0.012, 0.35); strum(t + 0.22, CH_F, 0.012, 0.3); strum(t + 0.5, CH_E, 0.02, 0.4);
        [0.8, 0.95, 1.1].forEach(function (d) { palma(t + d, 0.4); });
        if (lv >= 3) [0, 4, 7, 12, 16, 19, 24].forEach(function (s, i) { pluck(t + 1.3 + i * 0.05, f(s + 24), 0.2, 1.6); });
      });
    },
    /* 野生に戻りかけたカードを取り返した */
    back: function () { R.play(function (t) { [12, 16, 19, 24].forEach(function (s, i) { pluck(t + i * 0.09, f(s), 0.3, 1.4); }); }); },
    finish: function () { R.play(function (t) { strum(t, CH_A, 0.03); strum(t + 0.4, CH_E, 0.05, 0.4); }); }
  };
})();
