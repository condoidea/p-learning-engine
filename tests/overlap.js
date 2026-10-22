/* =========================================================
 * 画面の重なりチェック（ブラウザの開発ツール・自動テスト用）
 *
 *   ページで <script src="tests/overlap.js"></script> を読みこむか、コンソールに貼り付けて
 *   overlaps()  → いま画面に見えている「文字・ボタン」どうしが重なっている組を返す
 *
 *  スマホの実際の表示は、ブラウザの上下のバーで高さが短い（iPhone で 550〜660px くらい）。
 *  その高さで各画面を開いて、重なりが 0 になるまで直す。
 *  わざと重ねている物（詠唱の文字を魔法陣に重ねる など）は、data-overlay-ok を付けた要素の中なら数えない
 * ========================================================= */
window.overlaps = function (root) {
  root = root || document.body;
  var els = Array.prototype.filter.call(root.querySelectorAll('*'), function (e) {
    if (e.closest('svg') && e.tagName !== 'svg') return false;
    if (e.closest('[data-overlay-ok], [hidden]')) return false;
    var cs = getComputedStyle(e);
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return false;
    var hasText = Array.prototype.some.call(e.childNodes, function (n) { return n.nodeType === 3 && n.nodeValue.trim(); });
    return hasText || e.tagName === 'BUTTON' || e.tagName === 'svg';
  });
  var R = els.map(function (e) { return { e: e, r: e.getBoundingClientRect() }; })
    .filter(function (o) { return o.r.width > 2 && o.r.height > 2 && o.r.bottom > 0 && o.r.top < innerHeight; });
  var out = [];
  for (var i = 0; i < R.length; i++) for (var j = i + 1; j < R.length; j++) {
    var a = R[i], b = R[j];
    if (a.e.contains(b.e) || b.e.contains(a.e)) continue;
    var ix = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
    var iy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
    if (ix > 4 && iy > 4) out.push(name(a.e) + ' × ' + name(b.e) + '（' + Math.round(ix) + '×' + Math.round(iy) + '）');
  }
  function name(e) { var c = e.className && (e.className.baseVal != null ? e.className.baseVal : e.className); return e.tagName.toLowerCase() + (c ? '.' + String(c).split(' ')[0] : '') + '「' + e.textContent.trim().slice(0, 10) + '」'; }
  return out;
};
