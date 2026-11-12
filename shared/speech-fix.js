/* =========================================================
 * shared/speech-fix.js — 読み上げ（speechSynthesis）を iPhone でも止まらないようにする
 *
 *  各アプリの読み上げ（Speech.say など）はそのまま。ここで speechSynthesis の
 *  speak / cancel を包んで、全アプリにまとめて効かせる。アプリの js より先に読み込む。
 *
 *  iPhone（Safari・ホーム画面のアプリ）で自動読み上げが黙るわけ：
 *   ・タップの中で一度 speak していないと、タイマーや await のあとから呼んだ speak を
 *     エラーも出さずに捨てる（自動読み上げはほとんどこの形）
 *   ・別のアプリに切りかえて戻ると、また同じ状態に戻ることがある／一時停止のまま固まることがある
 *   ・cancel の直後にすぐ speak すると、新しいほうまで消えることがある
 *   ・読み上げ中の SpeechSynthesisUtterance が片づけられると、途中で止まる
 *  なので：
 *   1. 画面に触れるたび（最初の1回と、戻ってきたあとの1回）無音の speak をして鍵をあける
 *   2. speak の前に止まっていたら resume
 *   3. 何か読んでいるときだけ cancel し、その直後の speak は少し待ってから
 *   4. 読み終わるまで utterance をつかんでおく
 * ========================================================= */
(function () {
  'use strict';
  var ss = window.speechSynthesis;
  if (!ss || !window.SpeechSynthesisUtterance || ss.__fixed) return;
  ss.__fixed = true;

  var speak0 = ss.speak.bind(ss), cancel0 = ss.cancel.bind(ss);
  var unlocked = false, cutAt = 0, keep = [];

  function hold(u) {
    keep.push(u);
    if (keep.length > 8) keep.shift();
    var drop = function () { var i = keep.indexOf(u); if (i >= 0) keep.splice(i, 1); };
    try { u.addEventListener('end', drop); u.addEventListener('error', drop); } catch (e) { /* なし */ }
  }

  /* 1. タップの中で無音の speak（iPhone の鍵あけ） */
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    try {
      if (ss.paused) ss.resume();
      if (ss.speaking || ss.pending) return;   /* もう読んでいる＝鍵はあいている */
      var u = new SpeechSynthesisUtterance(' ');
      u.volume = 0; u.rate = 2;
      hold(u); speak0(u);
    } catch (e) { /* 読み上げできない */ }
  }
  ['touchend', 'pointerdown', 'click', 'keydown'].forEach(function (ev) {
    document.addEventListener(ev, unlock, true);
  });
  /* 別のアプリから戻ったら、次のタップでもう一度あける */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) return;
    unlocked = false;
    try { if (ss.paused) ss.resume(); } catch (e) { /* なし */ }
  });
  window.addEventListener('pageshow', function () { unlocked = false; });

  /* 3. 何か読んでいるときだけ止める */
  ss.cancel = function () {
    try {
      if (ss.speaking || ss.pending) { cutAt = Date.now(); cancel0(); }
    } catch (e) { /* なし */ }
  };

  /* 2・3・4. 読む */
  ss.speak = function (u) {
    if (!u) return;
    hold(u);
    var go = function () {
      try { if (ss.paused) ss.resume(); speak0(u); } catch (e) { /* 読み上げできない */ }
    };
    var since = Date.now() - cutAt;
    var inTap = navigator.userActivation && navigator.userActivation.isActive;   /* タップの中は待たない（待つとタップの外になる） */
    if (since < 80 && !inTap) setTimeout(go, 80 - since); else go();
  };
})();
