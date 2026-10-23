/* =========================================================
 * ¡PROTESTO! の通しテスト（ブラウザで動かす）
 *
 *   protesto.html?sandbox を開き、コンソールで
 *     var s = document.createElement('script'); s.src = 'tests/e2e-protesto.js'; document.body.appendChild(s);
 *   のあと  await protestoE2E(['c1', 'c2'])   … 事件を正解で最後まで進め、重なり・横スクロール・エラーを返す
 *  画面の高さはスマホの実際の高さ（375×550 など）にしておく。
 *  重なりは、スクロールで隠れている部分を除いて数える（叩きつけ文字・判決のスタンプは数えない）
 * ========================================================= */
(function () {
  'use strict';
  var SL = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var ERR = [];
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
      if (e.closest('[data-overlay-ok], [hidden], #slam, .verdict, .chapter, #pop, .tn, .mk')) return false;
      var dt = e.closest('details'); if (dt && !dt.open && !e.closest('summary')) return false;
      var cs = getComputedStyle(e);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return false;
      var hasText = Array.prototype.some.call(e.childNodes, function (n) { return n.nodeType === 3 && n.nodeValue.trim(); });
      return hasText || e.tagName === 'BUTTON';
    });
    var R = els.map(function (e) { return { e: e, r: vis(e) }; }).filter(function (o) { return o.r.width > 2 && o.r.height > 2 && o.r.bottom > 0 && o.r.top < innerHeight; });
    var out = [];
    for (var i = 0; i < R.length; i++) for (var j = i + 1; j < R.length; j++) {
      var a = R[i], b = R[j]; if (a.e.contains(b.e) || b.e.contains(a.e)) continue;
      var ix = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left), iy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
      if (ix > 4 && iy > 4) out.push(nm(a.e) + ' × ' + nm(b.e));
    }
    return out;
  }
  function nm(e) { var c = e.className && String(e.className.baseVal != null ? e.className.baseVal : e.className); return e.tagName.toLowerCase() + (c ? '.' + c.split(' ')[0] : '') + '「' + e.textContent.trim().slice(0, 12) + '」'; }

  window.protestoE2E = async function (ids) {
    var res = {};
    window.__e2e = true;
    for (var k = 0; k < ids.length; k++) {
      var id = ids[k], OV = {}, steps = 0, wide = 0;
      ERR.length = 0;
      var p = PRO.play(id, true), fin = false;
      p.then(function () { fin = true; }, function (e) { ERR.push(String(e)); fin = true; });
      while (!fin && steps < 3000) {
        await SL(60);
        overlaps().forEach(function (o) { OV[o] = (OV[o] || 0) + 1; });
        if (document.documentElement.scrollWidth > innerWidth + 1) wide++;
        if (PRO.cur.solve) { var f = PRO.cur.solve; PRO.cur.solve = null; f(); steps++; }
      }
      res[id] = { steps: steps, done: !!(PRO.S().lessons[id] || {}).done, overlaps: Object.keys(OV), wide: wide, errors: ERR.slice() };
      var h = document.querySelector('#dHome'); if (h) h.click();
    }
    window.__e2e = false;
    return res;
  };
})();
