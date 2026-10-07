/* =========================================================
 * e2e.js — ブラウザでの通しテスト
 *   使い方：<コース>.html?e2e を開く（例：fe.html?e2e）。fast を付けると最初の2ユニットだけ：fe.html?e2e&fast
 *   - 学習データは「.e2e」付きの別保存先を使う（本物の進捗には触れない）
 *   - 全レッスンを自動で解く → ユニットボス → 復習/模試/特訓/弱点 → カード表示 → 各画面
 *   - 結果は画面左上に表示し、タイトルを「E2E PASS / FAIL」に変える
 * ========================================================= */
(function () {
  'use strict';
  var FAST = /[?&]fast\b/.test(location.search);
  var errors = [];
  window.addEventListener('error', function (e) { errors.push((e.message || 'error') + ' @' + String(e.filename || '').split('/').pop() + ':' + e.lineno); });
  window.confirm = function () { return true; };
  window.alert = function () {};

  var sl = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  /* 画面が非表示だと requestAnimationFrame が止まるので、アニメーションを手動で進める */
  setInterval(function () { if (document.hidden && window.gsap) gsap.ticker.tick(); }, 16);

  var panel, results = [];
  function log(ok, msg) {
    results.push({ ok: ok, msg: msg });
    if (!panel) {
      panel = document.createElement('div');
      panel.style.cssText = 'position:fixed;left:8px;top:8px;z-index:9999;max-width:420px;max-height:60vh;overflow:auto;padding:10px 12px;border-radius:10px;background:rgba(0,0,0,.85);color:#fff;font:12px/1.6 monospace;pointer-events:none';
      document.body.appendChild(panel);
    }
    var d = document.createElement('div');
    d.textContent = (ok ? '✔ ' : '✘ ') + msg;
    d.style.color = ok ? '#5cff9d' : '#ff4d6d';
    panel.appendChild(d);
    panel.scrollTop = 1e9;
  }
  function closeOverlays() {
    $$('#overlay-levelup.show #luClose, #overlay-login.show #loginClose').forEach(function (b) { b.click(); });
    var lc = $('#overlay-lclear'); if (lc && lc.classList.contains('show')) lc.classList.remove('show');
  }

  /* 条件が満たされるまで待つ（描画のタイミング差でテストが不安定にならないように） */
  async function waitFor(fn, ms) {
    var t = Date.now();
    while (Date.now() - t < (ms || 4000)) { if (fn()) return true; await sl(40); }
    return false;
  }
  async function solveLesson(L) {
    for (var i = 0; i < L.steps.length; i++) {
      var s = L.steps[i];
      var stepNo = (i + 1) + ' / ' + L.steps.length;
      var shown = await waitFor(function () {
        var st = $('.ls-step');
        return st && st.classList.contains('t-' + s.t) && $('#lsCount').textContent === stepNo && getComputedStyle(st).opacity > 0.5;
      });
      if (!shown) return 'ステップ' + i + '（' + s.t + '）が表示されない';
      closeOverlays();
      if (s.t === 'quiz') { var a = s.a || 0; $$('.ls-opt').find(function (x) { return +x.dataset.i === a; }).click(); }
      if (s.t === 'bits' && s.target != null) { var bs = $$('.bit'), n = bs.length; bs.forEach(function (b, k) { if (s.target & (1 << (n - 1 - k))) b.click(); }); }
      if (s.t === 'gate') { $$('.sw')[0].click(); $$('.sw')[1].click(); $$('.sw')[0].click(); }
      if (s.t === 'order') { for (var k = 0; k < s.items.length; k++) $$('.ord-pool .chipb').find(function (x) { return +x.dataset.i === k; }).click(); $('.ord-check').click(); }
      if (s.t === 'timeline') { var ord = s.items.map(function (it, ii) { return { y: it.y, i: ii }; }).sort(function (x, z) { return x.y - z.y; }); ord.forEach(function (o) { var c = $$('.tl-chip').find(function (x) { return +x.dataset.i === o.i && !x.disabled; }); if (c) c.click(); }); }
      if (s.t === 'match') { for (var m = 0; m < s.pairs.length; m++) { $('.mt.l[data-i="' + m + '"]').click(); $('.mt.r[data-i="' + m + '"]').click(); } }
      if (s.t === 'num') { $('.num-in').value = String(s.answer); $('.num-check').click(); }
      if (s.t === 'steps') { var g = 0; while ($('.ex-more') && $('.ex-more').style.display !== 'none' && g++ < 30) $('.ex-more').click(); }
      if (s.t === 'trace') { var h = 0; while (!$('.tr-next').disabled && h++ < 100) $('.tr-next').click(); }
      if (s.t === 'stack') { for (var q = 0; q < 4; q++) $('.sq-in').click(); $('.sq-pop').click(); }
      await sl(50);
      if ($('#lsGo').disabled) return 'ステップ' + i + '（' + s.t + '）で進めない';
      $('#lsGo').click();
      await sl(260);
    }
    await sl(300);
    if (!$('#overlay-lclear').classList.contains('show')) return 'クリア画面が出ない';
    closeOverlays();
    return null;
  }
  function correctChoice() {
    var qt = $('#qText').textContent, code = $('#qCode').textContent;
    var q = LE.questions.find(function (x) { return x.q === qt && (!x.code || x.code === code); });
    if (!q) return null;
    var ans = q.o[q.a || 0];
    return $$('.choice').find(function (x) { return x.querySelector('.ct').textContent === ans; });
  }
  async function playSet(mode, arg, wrongFirst) {
    UI.startSet(mode, arg);
    await sl(900);
    if (UI.current() !== 'quiz') return '出題されない';
    var n = 0;
    while (UI.current() === 'quiz' && n++ < 40) {
      closeOverlays();
      var b = correctChoice();
      if (!b) return '問題が特定できない: ' + $('#qText').textContent.slice(0, 30);
      if (!b.disabled) { if (wrongFirst && n === 1) $$('.choice').find(function (x) { return x !== b; }).click(); else b.click(); }
      await sl(450);
      $('#btnNext').click();
      await sl(450);
    }
    await sl(800); closeOverlays();
    return UI.current() === 'result' ? null : 'リザルト画面に行かない（' + UI.current() + '）';
  }

  async function run() {
    await sl(1500);
    closeOverlays();
    var t0 = Date.now();
    log(true, 'E2E 開始（' + (window.COURSE && COURSE.id) + (FAST ? ' / fast' : '') + '）');

    /* 1) レッスン */
    var lessons = Lesson.all();
    if (FAST) { var keep = LE.units.slice(0, 2).map(function (u) { return u.id; }); lessons = lessons.filter(function (L) { return keep.indexOf(L.unit) >= 0; }); }
    var bad = 0;
    for (var i = 0; i < lessons.length; i++) {
      Lesson.start(lessons[i].id); await sl(420);
      var r = await solveLesson(lessons[i]);
      if (r) { bad++; log(false, 'レッスン ' + lessons[i].id + '：' + r); }
    }
    log(bad === 0, 'レッスン ' + (lessons.length - bad) + ' / ' + lessons.length + ' 本クリア');
    var owned = Core.ALL_CARDS.filter(Core.owned).length;
    log(owned >= lessons.length, '復習カード入手 ' + owned + ' 枚');

    /* 2) ユニットボス */
    var units = LE.units.filter(function (u) { return Core.unitCleared(u.id); });
    var beaten = 0;
    for (var j = 0; j < units.length; j++) {
      var e = await playSet('boss', units[j].id, j === 0);
      if (e) log(false, 'ボス ' + units[j].id + '：' + e);
      if (Core.S.bosses[units[j].id]) beaten++;
      UI.go('home'); await sl(400);
    }
    log(beaten === units.length, 'ユニットボス撃破 ' + beaten + ' / ' + units.length);

    /* 3) 各モード */
    var modes = [['daily'], ['weak'], ['quick']];
    if (COURSE.mock) modes.push(['mock']);
    if (COURSE.focus) modes.push(['focus']);
    if (lessons[0]) modes.push(['lesson', lessons[0].id]);
    for (var k = 0; k < modes.length; k++) {
      /* 学んだ範囲に問題がないモードは「出題されない」のが正しい（習熟ゲート） */
      if (!Core.buildQueue(modes[k][0], modes[k][1]).length) { log(true, 'モード ' + modes[k][0] + '：未学習の範囲なので出題なし（想定どおり）'); continue; }
      var me = await playSet(modes[k][0], modes[k][1], true);
      if (!me) {
        var chest = $('#chest'); if (chest && !chest.disabled) { chest.click(); await sl(1500); closeOverlays(); }
      }
      log(!me, 'モード ' + modes[k][0] + (me ? '：' + me : ''));
      UI.go('home'); await sl(400);
    }

    /* 4) 復習カード */
    var cid = Core.ALL_CARDS.filter(Core.owned)[0];
    if (cid) {
      UI.openCard(cid.id); await sl(900);
      var opened = $('#overlay-deck').classList.contains('show') && !!$('#kcard .kc-front');
      $('#deckActions .btn-ghost').click(); await sl(700);
      $('#deckClose').click(); await sl(400);
      log(opened, '復習カードの表示・裏返し');
    }

    /* 5) 各画面 */
    var screens = ['learn', 'fields', 'ach', 'settings', 'home'];
    for (var s = 0; s < screens.length; s++) { UI.go(screens[s]); await sl(700); }
    $$('#learnTabs button')[1] && (UI.go('learn'), await sl(600), $$('#learnTabs button')[1].click(), await sl(800));
    log(true, '画面遷移（' + screens.join(' / ') + '）');

    log(errors.length === 0, 'JavaScript エラー ' + errors.length + ' 件' + (errors.length ? '：' + errors.slice(0, 3).join(' | ') : ''));
    var pass = results.every(function (x) { return x.ok; });
    log(pass, (pass ? 'E2E PASS' : 'E2E FAIL') + '（' + Math.round((Date.now() - t0) / 1000) + '秒）');
    document.title = (pass ? 'E2E PASS' : 'E2E FAIL') + '｜' + document.title;
    window.E2E_RESULT = { pass: pass, results: results, errors: errors };
  }
  window.addEventListener('load', function () { run().catch(function (e) { log(false, '例外：' + e.message); window.E2E_RESULT = { pass: false, error: String(e) }; }); });
})();
