/* =========================================================
 * ¡MANDA! の通しテスト（ブラウザで動かす）
 *
 *   manda.html?sandbox を開き、コンソールで
 *     var s = document.createElement('script'); s.src = 'tests/e2e-manda.js'; document.body.appendChild(s);
 *   のあと  await mandaE2E(['L1', 'L2'])   … レッスンを正解で最後まで進め、重なり・横スクロール・エラーを返す
 *          await mandaBoss('B1')          … ボスを正解で倒す
 *          await mandaRemedy()            … ホームの「🩹 おさらい」を正解で最後まで
 *          await mandaForge()             … 🔨 鍛冶場を正解で6問（__manda.forge()＝入口、__manda.forgeAns()＝いまの手の正解の番号）
 *  画面の高さはスマホの実際の高さ（375×550 など）にしておく。
 *  重なりは、スクロールで隠れている部分を除いて数える（演出の飛び文字・コンボ表示は数えない）
 * ========================================================= */
(function () {
  'use strict';
  var SL = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var norm = function (w) { return String(w).replace(/[¿?¡!.,—:;]/g, '').toLowerCase(); };
  var OV = [], ERR = [];
  window.addEventListener('error', function (e) { ERR.push(e.message); });

  function vis(e) {
    var r = e.getBoundingClientRect(), L = r.left, T = r.top, R = r.right, B = r.bottom, p = e.parentElement;
    while (p && p !== document.body) {
      var cs = getComputedStyle(p);
      if (/(auto|scroll|hidden)/.test(cs.overflow + cs.overflowY + cs.overflowX)) { var q = p.getBoundingClientRect(); L = Math.max(L, q.left); T = Math.max(T, q.top); R = Math.min(R, q.right); B = Math.min(B, q.bottom); }
      p = p.parentElement;
    }
    return { left: L, top: T, right: R, bottom: B, width: R - L, height: B - T };
  }
  function overlaps() {
    var els = Array.prototype.filter.call(document.body.querySelectorAll('*'), function (e) {
      if (e.closest('svg') && e.tagName !== 'svg') return false;
      if (e.closest('[data-overlay-ok], [hidden], #combo, #slam, .flt, .act-fx, .rays, #fx, #toast')) return false;
      var cs = getComputedStyle(e);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return false;
      var hasText = Array.prototype.some.call(e.childNodes, function (n) { return n.nodeType === 3 && n.nodeValue.trim(); });
      return hasText || e.tagName === 'BUTTON' || e.tagName === 'svg';
    });
    var R = els.map(function (e) { return { e: e, r: vis(e) }; }).filter(function (o) { return o.r.width > 2 && o.r.height > 2 && o.r.bottom > 0 && o.r.top < innerHeight; });
    var out = [];
    for (var i = 0; i < R.length; i++) for (var j = i + 1; j < R.length; j++) {
      var a = R[i], b = R[j]; if (a.e.contains(b.e) || b.e.contains(a.e)) continue;
      var ix = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left), iy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
      if (ix > 4 && iy > 4) out.push(nm(a.e) + ' × ' + nm(b.e) + '（' + Math.round(ix) + '×' + Math.round(iy) + '）');
    }
    return out;
  }
  function nm(e) { var c = e.className && (e.className.baseVal != null ? e.className.baseVal : e.className); return e.tagName.toLowerCase() + (c ? '.' + String(c).split(' ')[0] : '') + '「' + e.textContent.trim().slice(0, 10) + '」'; }
  function ov(tag) {
    var o = overlaps(); if (o.length) OV.push(tag + ': ' + o.slice(0, 3).join(' ; '));
    if (document.documentElement.scrollWidth > innerWidth) OV.push(tag + ': 横スクロール ' + document.documentElement.scrollWidth);
  }
  function opt(T, label) { return Array.prototype.filter.call(T.querySelectorAll('.opt'), function (b) { return b.textContent === label && !b.disabled; })[0]; }
  async function solveQ(T) {
    var card = document.querySelector('.qcard[data-q]'); if (!card) return false;
    var q = __manda.Q[card.getAttribute('data-q')]; if (!q) return false;
    ov('Q ' + q.id);
    if (q.k === 'bug') { Array.prototype.filter.call(card.querySelectorAll('.tok'), function (t) { return t.dataset.n === norm(q.a); })[0].click(); return true; }
    if (q.k === 'build') {
      var words = q.s.split(' ').map(function (w) { var c = w.replace(/[¿?¡!.,;:]/g, ''); return /^(Pepe|Lola|Tomás|Marina)$/.test(c) ? c : c.toLowerCase(); });
      for (var i = 0; i < words.length; i++) { Array.prototype.filter.call(T.querySelectorAll('.tile:not(.used):not(.on)'), function (t) { return t.textContent === words[i]; })[0].click(); await SL(60); }
      return true;
    }
    var b = opt(T, q.k === 'who' ? __manda.WHO[q.a] : q.o[q.a]); if (b) b.click(); return !!b;
  }
  async function runLesson(id, start) {
    if (start) start(); else __manda.start(id);
    await SL(1200);
    for (var guard = 0; guard < 400; guard++) {
      await SL(250);
      var cur = __manda.cur(); if (!cur) return 'end';
      var T = document.querySelector('#tray'), t = document.querySelector('#talk');
      if (t && !t.hidden) t.click();
      await SL(80);
      var st = cur.L.steps[cur.i - 1], go = T.querySelector('.tb.go');
      if (go) {
        ov(id + ' #' + cur.i + ' ' + st.t);
        /* 地図：光っている札（いまここ）がボードの中で見えているか */
        if (st.t === 'map') { var hi = document.querySelector('.cmap-n.hi'), bd = document.querySelector('#board'); if (hi && bd) { var hr = hi.getBoundingClientRect(), br = bd.getBoundingClientRect(); if (hr.top < br.top - 2 || hr.bottom > br.bottom + 2) OV.push(id + ' #' + cur.i + ' map: 光る札がボードの外'); } var fm = document.querySelector('.cmap-card.cmap-focus'); if (fm && fm.getBoundingClientRect().height > 240) OV.push(id + ' #' + cur.i + ' map: しぼった地図が高すぎる(' + Math.round(fm.getBoundingClientRect().height) + 'px)'); }
        go.click(); continue;
      }
      if (document.querySelector('.qcard[data-q]:not(.is-ok):not(.is-ng)')) { await solveQ(T); await SL(500); continue; }
      if (st.t === 'ask' || st.t === 'cast') { var b = opt(T, st.o[st.a]); if (b) { ov(id + ' #' + cur.i + ' ' + st.t); b.click(); await SL(1300); } continue; }
      if (st.t === 'forge') {
        var start = st.w.length - (st.cut || '').length;
        var fl = document.querySelectorAll('.fg-word .fl:not(.gone)');
        for (var k = 0; k < fl.length; k++) if (+fl[k].dataset.i >= start) { fl[k].click(); await SL(80); }
        await SL(500);
        if (st.add) { ov(id + ' #' + cur.i + ' forge'); var a2 = opt(T, st.add); if (a2) a2.click(); }
        await SL(1200); continue;
      }
      if (st.t === 'tapwho') { ov(id + ' #' + cur.i + ' tapwho'); var ac = document.querySelector('.actor[data-who="' + st.a + '"]'); if (ac && !ac.disabled) { ac.click(); await SL(800); } continue; }
    }
    return 'guard';
  }
  window.mandaE2E = async function (ids) {
    OV = []; var res = {};
    for (var i = 0; i < ids.length; i++) { res[ids[i]] = await runLesson(ids[i]); ov(ids[i] + ' 結果'); }
    return { res: res, screen: document.body.dataset.screen, overlaps: OV, errors: ERR };
  };
  window.mandaBoss = async function (id) {
    OV = [];
    __manda.boss(id); await SL(800); ov(id + ' intro');
    document.querySelector('#zTray .tb.go').click(); await SL(1200);
    for (var guard = 0; guard < 60; guard++) {
      if (document.body.dataset.screen !== 'quiz') break;
      var T = document.querySelector('#zTray');
      var go = T.querySelector('.tb.go'); if (go) { go.click(); await SL(500); continue; }
      if (document.querySelector('.qcard[data-q]:not(.is-ok):not(.is-ng)')) await solveQ(T);
      await SL(900);
    }
    await SL(800); ov(id + ' 結果');
    return { screen: document.body.dataset.screen, overlaps: OV, errors: ERR };
  };
  /* ホームのボタンから「🩹 おさらい」を始めて、最後まで正解で進める */
  window.mandaRemedy = async function () {
    OV = [];
    var r = await runLesson('remedy', function () { document.querySelector('#hCta').click(); });
    ov('remedy 結果');
    return { res: r, screen: document.body.dataset.screen, overlaps: OV, errors: ERR };
  };
  /* 🔨 鍛冶場：クリアしたぶんの枝で、正解の手を選びつづけて6問。mistakes を渡すと、その回数ぶんわざとまちがえる */
  window.mandaForge = async function (mistakes) {
    OV = []; var bad = mistakes || 0;
    __manda.forge(); await SL(800);
    for (var guard = 0; guard < 120; guard++) {
      if (document.body.dataset.screen !== 'quiz') break;
      var T = document.querySelector('#zTray'), go = T.querySelector('.tb.go');
      if (go) { ov('forge next'); go.click(); await SL(600); continue; }
      var i = __manda.forgeAns();
      if (i >= 0) {
        ov('forge #' + guard);
        var all = Array.prototype.slice.call(T.querySelectorAll('.opt:not(:disabled)')), b;
        if (bad > 0) { b = all.filter(function (x) { return +x.dataset.i !== i; })[0]; bad--; } else b = all.filter(function (x) { return +x.dataset.i === i; })[0];
        if (b) b.click();
      }
      await SL(1000);
    }
    await SL(800); ov('forge 結果');
    return { screen: document.body.dataset.screen, overlaps: OV, errors: ERR };
  };
  window.mandaOverlaps = overlaps;
})();
