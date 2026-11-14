/* =========================================================
 * ¡PEGA! — 武器とジェムの絵（SVG・手描き。外部の画像なし）
 *  武器は横向き（左に柄、右に刃）。ソケット（ジェムの穴）は1つ。id="sock" をつけて、ジェムが飛んでいく先にする
 *  色の塗り（鋼・金・木・革）は、ページに1回だけ置く共通の defs を参照する
 *  ジェムは上から見たブリリアントカット（八角形の面）。色は1色だけ受けとり、面の明暗は白と黒の半透明を重ねて出す
 * ========================================================= */
(function () {
  'use strict';
  var DEFS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<linearGradient id="pg-steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7faff"/><stop offset=".42" stop-color="#cfd8ea"/><stop offset=".55" stop-color="#8b97b3"/><stop offset="1" stop-color="#4f5b78"/></linearGradient>' +
    '<linearGradient id="pg-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c2"/><stop offset=".4" stop-color="#f3c650"/><stop offset=".62" stop-color="#b47c12"/><stop offset="1" stop-color="#6e4506"/></linearGradient>' +
    '<linearGradient id="pg-goldh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a5a0a"/><stop offset=".35" stop-color="#f3c650"/><stop offset=".5" stop-color="#fff6c2"/><stop offset=".7" stop-color="#d79a22"/><stop offset="1" stop-color="#6e4506"/></linearGradient>' +
    '<linearGradient id="pg-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c98d58"/><stop offset=".5" stop-color="#8a542c"/><stop offset="1" stop-color="#4c2a12"/></linearGradient>' +
    '<linearGradient id="pg-leather" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a3c52"/><stop offset=".55" stop-color="#5a2034"/><stop offset="1" stop-color="#2e0f1c"/></linearGradient>' +
    '<radialGradient id="pg-hole" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#26305a"/><stop offset=".7" stop-color="#0b1026"/><stop offset="1" stop-color="#000"/></radialGradient>' +
    '<radialGradient id="pg-shine" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
    '</defs></svg>';
  function inject() { if (!document.getElementById('pg-defs')) { var d = document.createElement('div'); d.id = 'pg-defs'; d.innerHTML = DEFS; document.body.insertBefore(d, document.body.firstChild); } }
  if (document.body) inject(); else document.addEventListener('DOMContentLoaded', inject);

  var INK = '#1b1530';
  function f(n) { return Math.round(n * 100) / 100; }
  function oct(cx, cy, r) {
    var p = [];
    for (var k = 0; k < 8; k++) { var a = (k * 45 + 22.5) * Math.PI / 180; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    return p;
  }
  function pts(a) { return a.map(function (q) { return f(q[0]) + ',' + f(q[1]); }).join(' '); }

  /* ジェム（中心 cx,cy・半径 r）。外の八角形 → 面の明暗 → テーブル面 → 線 → 光 */
  function gemShape(cx, cy, r, color, sparkle) {
    var o = oct(cx, cy, r), t = oct(cx, cy, r * 0.52), h = '';
    h += '<polygon points="' + pts(o) + '" fill="' + color + '" stroke="' + INK + '" stroke-width="' + f(r * 0.12) + '" stroke-linejoin="round"/>';
    for (var k = 0; k < 8; k++) {
      var k2 = (k + 1) % 8, quad = [o[k], o[k2], t[k2], t[k]];
      /* 左上の面は明るく、右下の面は暗く（k=0 は右の少し下から、時計回り） */
      var shade = [-0.22, -0.3, -0.12, 0.12, 0.32, 0.24, 0.05, -0.1][k];
      h += '<polygon points="' + pts(quad) + '" fill="' + (shade > 0 ? '#fff' : '#000') + '" fill-opacity="' + f(Math.abs(shade)) + '"/>';
    }
    h += '<polygon points="' + pts(t) + '" fill="#fff" fill-opacity=".16" stroke="#fff" stroke-opacity=".55" stroke-width="' + f(r * 0.05) + '"/>';
    h += '<polygon points="' + pts([t[4], t[5], t[6], [cx, cy]]) + '" fill="#fff" fill-opacity=".28"/>';
    h += '<ellipse cx="' + f(cx - r * 0.3) + '" cy="' + f(cy - r * 0.38) + '" rx="' + f(r * 0.22) + '" ry="' + f(r * 0.12) + '" fill="#fff" fill-opacity=".85" transform="rotate(-30 ' + f(cx - r * 0.3) + ' ' + f(cy - r * 0.38) + ')"/>';
    if (sparkle) h += star(cx + r * 0.62, cy - r * 0.62, r * 0.42);
    return h;
  }
  function star(x, y, s) {
    return '<path class="spk" d="M' + f(x) + ' ' + f(y - s) + ' Q' + f(x + s * 0.18) + ' ' + f(y - s * 0.18) + ' ' + f(x + s) + ' ' + f(y) + ' Q' + f(x + s * 0.18) + ' ' + f(y + s * 0.18) + ' ' + f(x) + ' ' + f(y + s) +
      ' Q' + f(x - s * 0.18) + ' ' + f(y + s * 0.18) + ' ' + f(x - s) + ' ' + f(y) + ' Q' + f(x - s * 0.18) + ' ' + f(y - s * 0.18) + ' ' + f(x) + ' ' + f(y - s) + 'Z" fill="#fff"/>';
  }
  /* ジェム1つの絵。px＝表示の大きさ。o.sparkle＝きらり／o.dull＝くすみ（まだ原石） */
  function gem(color, px, o) {
    o = o || {};
    return '<svg class="gsvg' + (o.dull ? ' dull' : '') + '" viewBox="-13 -13 26 26" width="' + px + '" height="' + px + '" aria-hidden="true">' + gemShape(0, 0, 11, color, o.sparkle) + '</svg>';
  }
  /* ソケット：金の台座 → 穴 → （はまっていれば）ジェム */
  function socket(cx, cy, color, id) {
    return '<g class="sock' + (color ? ' set' : '') + '"' + (id ? ' id="' + id + '"' : '') + '>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="10.5" fill="url(#pg-gold)" stroke="' + INK + '" stroke-width="1.4"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="7.4" fill="url(#pg-hole)" stroke="#6e4506" stroke-width="1"/>' +
      (color ? gemShape(cx, cy, 7, color) : '<circle cx="' + (cx - 2) + '" cy="' + (cy - 2.5) + '" r="1.6" fill="#fff" fill-opacity=".25"/>') + '</g>';
  }

  /* ---------- 武器（viewBox 0 0 150 48、中心線 y=24） ---------- */
  function sword(color, id) {
    var h = '';
    /* 刃：鋼。樋（ふち）と刃先の光 */
    h += '<path d="M42 17 L52 16.2 L124 16.8 L148 24 L124 31.2 L52 31.8 L42 31 Z" fill="url(#pg-steel)" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round"/>';
    h += '<path d="M54 24 L116 24" stroke="#5d6886" stroke-width="3" stroke-linecap="round"/><path d="M54 21.6 L116 21.6" stroke="#fff" stroke-opacity=".75" stroke-width="1"/>';
    h += '<path d="M124 16.8 L148 24" stroke="#fff" stroke-opacity=".95" stroke-width="1.1"/><path d="M128 19 L140 22.4 L128 21.4 Z" fill="#fff" fill-opacity=".8"/>';
    h += '<path d="M46 19.5 L50 19 M46 28.5 L50 29" stroke="#4f5b78" stroke-width="1"/>';
    /* 柄：革巻き */
    h += '<rect x="13" y="19.5" width="21" height="9" rx="2.5" fill="url(#pg-leather)" stroke="' + INK + '" stroke-width="1.3"/>';
    for (var x = 16; x < 33; x += 4) h += '<path d="M' + x + ' 19.8 L' + (x + 3) + ' 28.2" stroke="#2e0f1c" stroke-width="1.1"/>';
    /* 柄頭 */
    h += '<circle cx="9" cy="24" r="5.6" fill="url(#pg-gold)" stroke="' + INK + '" stroke-width="1.3"/><circle cx="7.6" cy="22.4" r="1.6" fill="#fff" fill-opacity=".7"/>';
    /* 鍔：左右に反った金。まん中にソケット */
    h += '<path d="M33 24 Q33 10 25 1.5 Q36 3 42 10 Q46 16 46 24 Q46 32 42 38 Q36 45 25 46.5 Q33 38 33 24 Z" fill="url(#pg-goldh)" stroke="' + INK + '" stroke-width="1.3" stroke-linejoin="round"/>';
    h += '<path d="M28 4.5 Q36 7 40 13 M28 43.5 Q36 41 40 35" fill="none" stroke="#fff6c2" stroke-opacity=".7" stroke-width="1"/>';
    return h + socket(39, 24, color, id);
  }
  function staff(color, id) {
    var h = '';
    /* 柄：木。金の帯 */
    h += '<rect x="3" y="21" width="110" height="6" rx="3" fill="url(#pg-wood)" stroke="' + INK + '" stroke-width="1.3"/>';
    h += '<path d="M8 22.6 L106 22.6" stroke="#f0c48e" stroke-opacity=".5" stroke-width="1"/>';
    [22, 56, 92].forEach(function (x) { h += '<rect x="' + x + '" y="19.5" width="5" height="9" rx="1.5" fill="url(#pg-gold)" stroke="' + INK + '" stroke-width="1.1"/>'; });
    /* 頭：翼のような金の爪が、ソケットを抱く */
    h += '<path d="M104 24 Q108 14 118 8 Q114 3 124 1 Q122 6 128 7 Q140 10 144 24 Q140 38 128 41 Q122 42 124 47 Q114 45 118 40 Q108 34 104 24 Z" fill="url(#pg-goldh)" stroke="' + INK + '" stroke-width="1.3" stroke-linejoin="round"/>';
    h += '<path d="M146 24 L140 20 L140 28 Z" fill="url(#pg-gold)" stroke="' + INK + '" stroke-width="1"/>';
    h += '<circle cx="127" cy="24" r="13.5" fill="none" stroke="' + INK + '" stroke-opacity=".35" stroke-width="1"/>';
    return h + socket(127, 24, color, id);
  }
  function axe(color, id) {
    var h = '';
    /* 柄：木。手元に革 */
    h += '<rect x="3" y="21" width="118" height="6" rx="3" fill="url(#pg-wood)" stroke="' + INK + '" stroke-width="1.3"/>';
    h += '<rect x="5" y="20" width="24" height="8" rx="2" fill="url(#pg-leather)" stroke="' + INK + '" stroke-width="1.1"/>';
    for (var x = 8; x < 28; x += 4) h += '<path d="M' + x + ' 20.3 L' + (x + 3) + ' 27.7" stroke="#2e0f1c" stroke-width="1"/>';
    /* 刃：大きな三日月 */
    h += '<path d="M110 13 Q128 10 138 1 Q150 24 138 47 Q128 38 110 35 Z" fill="url(#pg-steel)" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round"/>';
    h += '<path d="M138 2 Q149 24 138 46" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="1.2"/>';
    /* 根元の金具と上のとげ */
    h += '<path d="M93 15 L114 13 L114 35 L93 33 Z" fill="url(#pg-gold)" stroke="' + INK + '" stroke-width="1.3" stroke-linejoin="round"/>';
    h += '<path d="M97 15 L101 6 L105 14.6 Z" fill="url(#pg-steel)" stroke="' + INK + '" stroke-width="1.1" stroke-linejoin="round"/>';
    return h + socket(103.5, 24, color, id);
  }
  var DRAW = { adj: sword, verb: staff, noun: axe };
  /* 武器の絵。pos＝adj/verb/noun。color＝はまっているジェムの色（なければ空のソケット）。id＝ソケットの id */
  function weapon(pos, color, id) {
    return '<svg class="wsvg" viewBox="0 0 150 48" aria-hidden="true">' + DRAW[pos](color || null, id || '') + '</svg>';
  }
  /* 文の中に置く小さな武器（ソケットは空・id なし） */
  function icon(pos) { return '<svg class="wic" viewBox="0 0 150 48" aria-hidden="true">' + DRAW[pos](null, '') + '</svg>'; }

  window.ART = { gem: gem, weapon: weapon, icon: icon, socket: socket };
})();
