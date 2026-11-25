/* =========================================================
 * ¡OJALÁ! — 効果音（このアプリだけの音色）
 *
 *  共通の engine/js/audio.js（iPhone の消音対策・振動）はそのまま使い、
 *  音色だけを「オルゴール・小さな鐘・紙とペン」にかえる（Sfx.raw の tone／noise を使う）。
 *  鳴らすタイミング・回数・振動は共通のまま（ごほうびの豊かさは削らない）。
 *  音を変えるときは、このファイルだけを直す。
 * ========================================================= */
(function () {
  'use strict';
  if (!window.Sfx || !Sfx.raw) return;
  var R = Sfx.raw, P = R.play, T = R.tone, N = R.noise, hz = R.hz, buzz = R.buzz;
  /* オルゴールの1音：澄んだ基音 ＋ 2オクターブ上のきらめき（すぐ消える） */
  function bell(semi, t, len, vol) {
    T(hz(semi), t, len, 'sine', vol);
    T(hz(semi + 24), t, len * 0.35, 'sine', vol * 0.25);
  }
  var SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];   // ペンタトニック：つづけて正解すると音が上がる

  Sfx.tap = function () { P(function (t) { N(t, 0.035, 0.05, 2500, 1800); }); };   // 紙にふれる音
  Sfx.hover = function () {};
  Sfx.correct = function (combo) {
    buzz(combo >= 10 ? [12, 30, 12] : 12);
    P(function (t) {
      var i = Math.min(SCALE.length - 3, combo || 0);
      bell(SCALE[i], t, 0.9, 0.09);
      bell(SCALE[i + 2], t + 0.09, 1.1, 0.08);
    });
  };
  Sfx.wrong = function () {
    buzz([30, 40, 30]);
    P(function (t) { T(hz(-8), t, 0.45, 'sine', 0.12, hz(-10)); T(hz(-5), t + 0.04, 0.4, 'sine', 0.05); });   // 低く、やわらかく
  };
  Sfx.crit = function () {
    P(function (t) { [0, 4, 7, 12, 16].forEach(function (s, k) { bell(s + 12, t + k * 0.06, 0.9, 0.05); }); N(t, 0.3, 0.04, 4000, 8000); });
  };
  Sfx.combo = function (n) {
    P(function (t) { [0, 7, 12].forEach(function (s, k) { bell(s + (n >= 10 ? 12 : 7), t + k * 0.08, 1.2, 0.06); }); });
  };
  Sfx.coin = function () { P(function (t) { bell(19, t, 0.6, 0.06); bell(24, t + 0.07, 0.8, 0.06); }); };
  Sfx.levelUp = function () {
    buzz([20, 40, 20, 40, 80]);
    P(function (t) {
      [0, 4, 7, 12, 16, 19, 24].forEach(function (s, k) { bell(s, t + k * 0.11, 1.4, 0.07); });
      T(hz(-12), t, 2.2, 'sine', 0.06);
    });
  };
  Sfx.chestShake = function () { P(function (t) { N(t, 0.06, 0.06, 1200, 900); }); };   // 封筒がこすれる
  Sfx.chestOpen = function (tier) {
    P(function (t) {
      N(t, 0.25, 0.08, 1500, 4000);   // 封を切る
      var base = { common: 0, rare: 2, epic: 5, legendary: 7 }[tier] || 0;
      [0, 4, 7, 11, 14].forEach(function (s, k) { bell(s + base, t + 0.25 + k * 0.1, 1.3, 0.06); });
      if (tier === 'legendary') [12, 19, 24].forEach(function (s, k) { bell(s + base, t + 0.8 + k * 0.12, 1.6, 0.05); });
    });
  };
  Sfx.whoosh = function () { P(function (t) { N(t, 0.3, 0.06, 3000, 900); }); };   // 便せんをすべらせる
})();
