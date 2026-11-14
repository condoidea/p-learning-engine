/* =========================================================
 * ¡PEGA! — 武器とジェムの絵（SVG・手描き。外部の画像なし）
 *
 *  意匠には意味をもたせる（かのと先生「形には意味がある・主役のモチーフは1つ・属性と意匠を結びつける」）
 *   武器の意匠＝その武器を「そのまま」使ったときの弱点
 *     剣（形容詞）＝ 🎨 説明 → 絵筆と色：柄頭は筆の穂先、刃に虹色の刃紋、鍔に絵の具の3色（モチーフは鍔に。メディバン「鍔にこだわる」）
 *     杖（動詞）  ＝ ⚡ 動作 → 稲妻：頭は2本の稲妻の爪、柄に稲妻の彫り
 *     斧（名詞）  ＝ 📦 もの → 石と箱：刃は四角い石の板、根元は箱（立方体）の金具
 *   ジェムのカット＝はめたときの弱点
 *     🌀 ようす＝しずく ／ 📦 もの・こと＝四角 ／ 👤 人＝横顔を彫った丸いカボション ／ 🏠 店＝家の形 ／ 🎨 説明＝絵の具をのせた丸いカボション
 *   武器は持ち主（レベル）で育つ（持ち主の身分で飾りが変わる）
 *     tier 0 兵士＝鉄の金具・飾りなし ／ 1 騎士＝金の金具・彫り ／ 2 英雄＝金に小さな宝石の象嵌・金色の光
 *
 *  武器は横向き（左に柄、右に刃）。viewBox 0 0 150 48、中心線 y=24。ソケットは1つ（id を渡すとつく。ジェムが飛んでいく先）
 *  色の塗りは、ページに1回だけ置く共通の defs を参照する
 * ========================================================= */
(function () {
  'use strict';
  function lg(id, stops, h) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (h ? 1 : 0) + '" y2="' + (h ? 0 : 1) + '">' +
      stops.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"/>'; }).join('') + '</linearGradient>';
  }
  var DEFS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    lg('pg-steel', [[0, '#f7faff'], [.42, '#cfd8ea'], [.55, '#8b97b3'], [1, '#4f5b78']]) +
    lg('pg-gold', [[0, '#fff6c2'], [.4, '#f3c650'], [.62, '#b47c12'], [1, '#6e4506']]) +
    lg('pg-goldh', [[0, '#8a5a0a'], [.35, '#f3c650'], [.5, '#fff6c2'], [.7, '#d79a22'], [1, '#6e4506']], 1) +
    lg('pg-iron', [[0, '#e3e6ee'], [.45, '#9aa1b2'], [.62, '#62697c'], [1, '#353a48']]) +
    lg('pg-ironh', [[0, '#3a3f4e'], [.4, '#a3aabb'], [.52, '#e3e6ee'], [.72, '#7c8396'], [1, '#353a48']], 1) +
    lg('pg-brass', [[0, '#fff1a6'], [.45, '#e8c440'], [.7, '#a6800e'], [1, '#5e4604']]) +
    lg('pg-wood', [[0, '#c98d58'], [.5, '#8a542c'], [1, '#4c2a12']]) +
    lg('pg-leather', [[0, '#8a3c52'], [.55, '#5a2034'], [1, '#2e0f1c']]) +
    lg('pg-stone', [[0, '#d6dbe4'], [.35, '#a7afbf'], [.7, '#707a8e'], [1, '#454d60']]) +
    lg('pg-rainbow', [[0, '#ff6b6b'], [.2, '#ffb84d'], [.4, '#ffe866'], [.6, '#6be38f'], [.8, '#5fb4ff'], [1, '#b98bff']], 1) +
    '<radialGradient id="pg-hole" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#26305a"/><stop offset=".7" stop-color="#0b1026"/><stop offset="1" stop-color="#000"/></radialGradient>' +
    '<radialGradient id="pg-cab" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".35" stop-color="#fff" stop-opacity=".12"/><stop offset=".8" stop-color="#000" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient>' +
    '</defs></svg>';
  function inject() { if (!document.getElementById('pg-defs')) { var d = document.createElement('div'); d.id = 'pg-defs'; d.innerHTML = DEFS; document.body.insertBefore(d, document.body.firstChild); } }
  if (document.body) inject(); else document.addEventListener('DOMContentLoaded', inject);

  var INK = '#1b1530';
  function f(n) { return Math.round(n * 100) / 100; }
  function pts(a) { return a.map(function (q) { return f(q[0]) + ',' + f(q[1]); }).join(' '); }
  function ring(cx, cy, r, n, rot) { var p = []; for (var k = 0; k < n; k++) { var a = (k * 360 / n + rot) * Math.PI / 180; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return p; }

  /* ---------- ジェム ---------- */
  /* 面のあるジェム：外形 O（凸の多角形）→ 内側のテーブル面 → 面ごとの明暗（左上から光） → 光 */
  function faceted(O, cx, cy, r, color) {
    var T = O.map(function (q) { return [cx + (q[0] - cx) * 0.52, cy + (q[1] - cy) * 0.52]; }), h = '', n = O.length;
    h += '<polygon points="' + pts(O) + '" fill="' + color + '" stroke="' + INK + '" stroke-width="' + f(r * 0.12) + '" stroke-linejoin="round"/>';
    for (var k = 0; k < n; k++) {
      var k2 = (k + 1) % n, mx = (O[k][0] + O[k2][0]) / 2 - cx, my = (O[k][1] + O[k2][1]) / 2 - cy;
      var sh = 0.32 * Math.cos(Math.atan2(my, mx) + 3 * Math.PI / 4);
      h += '<polygon points="' + pts([O[k], O[k2], T[k2], T[k]]) + '" fill="' + (sh > 0 ? '#fff' : '#000') + '" fill-opacity="' + f(Math.abs(sh)) + '"/>';
    }
    h += '<polygon points="' + pts(T) + '" fill="#fff" fill-opacity=".16" stroke="#fff" stroke-opacity=".55" stroke-width="' + f(r * 0.05) + '" stroke-linejoin="round"/>';
    return h + shine(cx, cy, r);
  }
  function shine(cx, cy, r) {
    var x = cx - r * 0.32, y = cy - r * 0.36;
    return '<ellipse cx="' + f(x) + '" cy="' + f(y) + '" rx="' + f(r * 0.22) + '" ry="' + f(r * 0.11) + '" fill="#fff" fill-opacity=".85" transform="rotate(-35 ' + f(x) + ' ' + f(y) + ')"/>';
  }
  /* つるりとしたカボション（面なし） */
  function cabochon(cx, cy, r, color) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + f(r) + '" fill="' + color + '" stroke="' + INK + '" stroke-width="' + f(r * 0.12) + '"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + f(r * 0.94) + '" fill="url(#pg-cab)"/>';
  }
  var CUTS = {
    /* 🌀 ようす：しずく（上がとがる） */
    adv: function (cx, cy, r, c) {
      var O = [[cx, cy - r]], R = r * 0.68, oy = cy + r * 0.3;
      for (var a = -50; a <= 230; a += 35) { var t = a * Math.PI / 180; O.push([cx + Math.cos(t) * R, oy + Math.sin(t) * R]); }
      return faceted(O, cx, cy + r * 0.12, r, c) +
        '<path d="M' + f(cx - r * 0.18) + ' ' + f(cy + r * 0.42) + ' q' + f(r * 0.3) + ' ' + f(r * 0.12) + ' ' + f(r * 0.3) + ' ' + f(-r * 0.2) + ' q0 ' + f(-r * 0.25) + ' ' + f(-r * 0.22) + ' ' + f(-r * 0.2) + '" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="' + f(r * 0.08) + '" stroke-linecap="round"/>';
    },
    /* 📦 もの・こと：四角（角を落としたエメラルドカット） */
    thing: function (cx, cy, r, c) {
      var s = r * 0.86, k = r * 0.3;
      return faceted([[cx - s + k, cy - s], [cx + s - k, cy - s], [cx + s, cy - s + k], [cx + s, cy + s - k], [cx + s - k, cy + s], [cx - s + k, cy + s], [cx - s, cy + s - k], [cx - s, cy - s + k]], cx, cy, r, c);
    },
    /* 🏠 店：家の形（屋根＋壁） */
    shop: function (cx, cy, r, c) {
      return faceted([[cx, cy - r], [cx + r * 0.98, cy - r * 0.12], [cx + r * 0.78, cy - r * 0.1], [cx + r * 0.78, cy + r * 0.88], [cx - r * 0.78, cy + r * 0.88], [cx - r * 0.78, cy - r * 0.1], [cx - r * 0.98, cy - r * 0.12]], cx, cy + r * 0.05, r, c) +
        '<rect x="' + f(cx - r * 0.16) + '" y="' + f(cy + r * 0.38) + '" width="' + f(r * 0.32) + '" height="' + f(r * 0.5) + '" rx="' + f(r * 0.1) + '" fill="#000" fill-opacity=".3"/>';
    },
    /* 👤 人：横顔を彫ったカボション */
    person: function (cx, cy, r, c) {
      return cabochon(cx, cy, r, c) +
        '<path d="M' + f(cx - r * 0.55) + ' ' + f(cy + r * 0.78) + ' Q' + f(cx - r * 0.5) + ' ' + f(cy + r * 0.2) + ' ' + f(cx - r * 0.05) + ' ' + f(cy + r * 0.12) +
        ' Q' + f(cx - r * 0.42) + ' ' + f(cy - r * 0.05) + ' ' + f(cx - r * 0.3) + ' ' + f(cy - r * 0.42) + ' Q' + f(cx - r * 0.12) + ' ' + f(cy - r * 0.78) + ' ' + f(cx + r * 0.2) + ' ' + f(cy - r * 0.6) +
        ' Q' + f(cx + r * 0.38) + ' ' + f(cy - r * 0.45) + ' ' + f(cx + r * 0.3) + ' ' + f(cy - r * 0.25) + ' L' + f(cx + r * 0.42) + ' ' + f(cy - r * 0.12) + ' L' + f(cx + r * 0.27) + ' ' + f(cy - r * 0.06) +
        ' Q' + f(cx + r * 0.25) + ' ' + f(cy + r * 0.1) + ' ' + f(cx + r * 0.08) + ' ' + f(cy + r * 0.12) + ' Q' + f(cx + r * 0.55) + ' ' + f(cy + r * 0.25) + ' ' + f(cx + r * 0.6) + ' ' + f(cy + r * 0.78) + ' Z" fill="#000" fill-opacity=".32"/>' +
        shine(cx, cy, r);
    },
    /* 🎨 説明：絵の具をのせたカボション（パレット） */
    desc: function (cx, cy, r, c) {
      return cabochon(cx, cy, r, c) +
        [[-0.38, -0.05, '#ff5d5d'], [0.02, 0.35, '#4fa3ff'], [0.4, -0.02, '#3fcf7a'], [0.06, -0.42, '#ffffff']].map(function (d) {
          return '<circle cx="' + f(cx + d[0] * r) + '" cy="' + f(cy + d[1] * r) + '" r="' + f(r * 0.18) + '" fill="' + d[2] + '" stroke="' + INK + '" stroke-opacity=".6" stroke-width="' + f(r * 0.05) + '"/>';
        }).join('') + shine(cx, cy, r);
    }
  };
  function gemShape(cx, cy, r, color, cut, sparkle) {
    var h = (CUTS[cut] || function () { return faceted(ring(cx, cy, r, 8, 22.5), cx, cy, r, color); })(cx, cy, r, color);
    if (sparkle) h += star(cx + r * 0.66, cy - r * 0.66, r * 0.42);
    return h;
  }
  function star(x, y, s) {
    return '<path class="spk" d="M' + f(x) + ' ' + f(y - s) + ' Q' + f(x + s * 0.18) + ' ' + f(y - s * 0.18) + ' ' + f(x + s) + ' ' + f(y) + ' Q' + f(x + s * 0.18) + ' ' + f(y + s * 0.18) + ' ' + f(x) + ' ' + f(y + s) +
      ' Q' + f(x - s * 0.18) + ' ' + f(y + s * 0.18) + ' ' + f(x - s) + ' ' + f(y) + ' Q' + f(x - s * 0.18) + ' ' + f(y - s * 0.18) + ' ' + f(x) + ' ' + f(y - s) + 'Z" fill="#fff"/>';
  }
  /* ジェム1つの絵。px＝表示の大きさ。o.cut＝弱点（カットの形）／o.sparkle＝きらり／o.dull＝くすみ */
  function gem(color, px, o) {
    o = o || {};
    return '<svg class="gsvg' + (o.dull ? ' dull' : '') + '" viewBox="-13 -13 26 26" width="' + px + '" height="' + px + '" aria-hidden="true">' + gemShape(0, 0, 11, color, o.cut, o.sparkle) + '</svg>';
  }

  /* ---------- 金具の色（持ち主で変わる） ---------- */
  function M(tier) { return tier >= 1 ? { v: 'url(#pg-gold)', h: 'url(#pg-goldh)', hi: '#fff6c2', lo: '#6e4506' } : { v: 'url(#pg-iron)', h: 'url(#pg-ironh)', hi: '#ffffff', lo: '#353a48' }; }
  function inlay(x, y, c) { return '<circle cx="' + x + '" cy="' + y + '" r="2.1" fill="' + c + '" stroke="' + INK + '" stroke-width=".8"/><circle cx="' + (x - 0.6) + '" cy="' + (y - 0.7) + '" r=".6" fill="#fff"/>'; }

  /* ソケット：台座 → 穴 → （はまっていれば）ジェム。set＝{color, cut} */
  function socket(cx, cy, set, id, tier) {
    var m = M(tier == null ? 1 : tier);
    return '<g class="sock' + (set ? ' set' : '') + '"' + (id ? ' id="' + id + '"' : '') + '>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="10.5" fill="' + m.v + '" stroke="' + INK + '" stroke-width="1.4"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="7.6" fill="url(#pg-hole)" stroke="' + m.lo + '" stroke-width="1"/>' +
      (set ? gemShape(cx, cy, 7.2, set.color, set.cut) : '<circle cx="' + (cx - 2) + '" cy="' + (cy - 2.5) + '" r="1.6" fill="#fff" fill-opacity=".25"/>') + '</g>';
  }

  /* ---------- 剣：🎨 絵筆と色 ---------- */
  function sword(set, id, t) {
    var m = M(t), h = '';
    /* 刃：鋼。虹色の刃紋（色＝説明）、樋、刃先の光 */
    h += '<path d="M42 17 L52 16.2 L124 16.8 L148 24 L124 31.2 L52 31.8 L42 31 Z" fill="url(#pg-steel)" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round"/>';
    h += '<path d="M50 28.4 Q66 26.6 80 28.4 T110 28.2 T134 26.6" fill="none" stroke="url(#pg-rainbow)" stroke-width="2.2" stroke-linecap="round" opacity="' + (t >= 1 ? 1 : 0.75) + '"/>';
    h += '<path d="M54 22.6 L116 22.6" stroke="#5d6886" stroke-width="2.6" stroke-linecap="round"/><path d="M54 20.4 L116 20.4" stroke="#fff" stroke-opacity=".75" stroke-width="1"/>';
    h += '<path d="M124 16.8 L148 24" stroke="#fff" stroke-opacity=".95" stroke-width="1.1"/><path d="M128 19 L140 22.4 L128 21.4 Z" fill="#fff" fill-opacity=".8"/>';
    /* 柄：革巻き */
    h += '<rect x="15" y="19.5" width="19" height="9" rx="2.5" fill="url(#pg-leather)" stroke="' + INK + '" stroke-width="1.3"/>';
    for (var x = 18; x < 33; x += 4) h += '<path d="M' + x + ' 19.8 L' + (x + 3) + ' 28.2" stroke="#2e0f1c" stroke-width="1.1"/>';
    /* 柄頭：筆。金具の口金 → 穂先（先に絵の具） */
    h += '<rect x="11" y="20" width="5" height="8" rx="1.2" fill="' + m.v + '" stroke="' + INK + '" stroke-width="1.1"/>';
    h += '<path d="M11.5 20.4 Q4 21 1 24 Q4 27 11.5 27.6 Z" fill="#3a2a22" stroke="' + INK + '" stroke-width="1.1" stroke-linejoin="round"/>';
    h += '<path d="M5.2 21.6 Q2.2 22.6 1 24 Q2.2 25.4 5.2 26.4 Q4.2 24 5.2 21.6 Z" fill="url(#pg-rainbow)"/>';
    /* 鍔：反った翼。絵の具の3色をのせる（モチーフは鍔に） */
    var wing = t >= 2 ? 'M33 24 Q32 8 22 0.5 Q37 1 44 9 Q48 16 48 24 Q48 32 44 39 Q37 47 22 47.5 Q32 40 33 24 Z' : 'M33 24 Q33 10 25 1.5 Q36 3 42 10 Q46 16 46 24 Q46 32 42 38 Q36 45 25 46.5 Q33 38 33 24 Z';
    h += '<path d="' + wing + '" fill="' + m.h + '" stroke="' + INK + '" stroke-width="1.3" stroke-linejoin="round"/>';
    h += '<path d="M28 4.5 Q36 7 40 13 M28 43.5 Q36 41 40 35" fill="none" stroke="' + m.hi + '" stroke-opacity=".7" stroke-width="1"/>';
    h += [[31.5, 7.5, '#ff5d5d'], [34.5, 40, '#4fa3ff'], [41.5, 12.5, '#ffe866']].map(function (d) {
      return '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="1.9" fill="' + d[2] + '" stroke="' + INK + '" stroke-width=".7"/>';
    }).join('');
    if (t >= 2) h += inlay(15, 24, '#ff5d8a');
    return h + socket(39, 24, set, id, t);
  }
  /* ---------- 杖：⚡ 稲妻 ---------- */
  function bolt(dir) {   /* dir 1＝上の爪、-1＝下の爪（y を反転） */
    var p = [[104, 22], [117, 13], [113.5, 11.5], [127, 1.5], [124.5, 8.5], [131, 7.5], [121.5, 18]];
    return pts(p.map(function (q) { return [q[0], dir > 0 ? q[1] : 48 - q[1]]; }));
  }
  function staff(set, id, t) {
    var m = M(t), h = '', b = t >= 1 ? 'url(#pg-gold)' : 'url(#pg-brass)';
    /* 柄：木。稲妻の彫り、金具の帯 */
    h += '<rect x="3" y="21" width="110" height="6" rx="3" fill="url(#pg-wood)" stroke="' + INK + '" stroke-width="1.3"/>';
    h += '<path d="M10 24 L18 22.2 L16 25.6 L26 23.2 L24 26 L34 24" fill="none" stroke="' + (t >= 1 ? '#ffe27a' : '#e8c440') + '" stroke-width="1.1" stroke-linejoin="round" opacity=".85"/>';
    h += '<path d="M62 24 L70 22.2 L68 25.6 L78 23.2 L76 26 L86 24" fill="none" stroke="' + (t >= 1 ? '#ffe27a' : '#e8c440') + '" stroke-width="1.1" stroke-linejoin="round" opacity=".85"/>';
    [40, 94].forEach(function (x) { h += '<rect x="' + x + '" y="19.5" width="5" height="9" rx="1.5" fill="' + m.v + '" stroke="' + INK + '" stroke-width="1.1"/>'; });
    if (t >= 2) { h += inlay(42.5, 24, '#5fb4ff'); h += inlay(96.5, 24, '#5fb4ff'); }
    /* 頭：2本の稲妻が、ソケットを上下からつかむ。先には火花 */
    h += '<polygon points="' + bolt(1) + '" fill="' + b + '" stroke="' + INK + '" stroke-width="1.2" stroke-linejoin="round"/>';
    h += '<polygon points="' + bolt(-1) + '" fill="' + b + '" stroke="' + INK + '" stroke-width="1.2" stroke-linejoin="round"/>';
    h += '<path d="M104 24 L114 19.5 L114 28.5 Z" fill="' + m.v + '" stroke="' + INK + '" stroke-width="1.1" stroke-linejoin="round"/>';
    h += '<path d="M141 24 L145 19 L144 23 L149 22 L145 29 L146 25 L141 26 Z" fill="#fff6a0" stroke="' + INK + '" stroke-width=".9" stroke-linejoin="round"/>';
    return h + socket(127, 24, set, id, t);
  }
  /* ---------- 斧：📦 石と箱 ---------- */
  function axe(set, id, t) {
    var m = M(t), h = '';
    /* 柄：木。手元に革 */
    h += '<rect x="3" y="21" width="118" height="6" rx="3" fill="url(#pg-wood)" stroke="' + INK + '" stroke-width="1.3"/>';
    h += '<rect x="5" y="20" width="24" height="8" rx="2" fill="url(#pg-leather)" stroke="' + INK + '" stroke-width="1.1"/>';
    for (var x = 8; x < 28; x += 4) h += '<path d="M' + x + ' 20.3 L' + (x + 3) + ' 27.7" stroke="#2e0f1c" stroke-width="1"/>';
    /* 刃：四角い石の板。右のふちだけ鋼の刃 */
    h += '<path d="M112 14 L136 1.5 L141 3.5 L141 44.5 L136 46.5 L112 34 Z" fill="url(#pg-stone)" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round"/>';
    h += '<path d="M136 1.5 L141 3.5 L141 44.5 L136 46.5 Q149 24 136 1.5 Z" fill="url(#pg-steel)" stroke="' + INK + '" stroke-width="1.2" stroke-linejoin="round"/>';
    h += '<path d="M139 4 Q146.5 24 139 44" fill="none" stroke="#fff" stroke-width="1"/>';
    h += '<path d="M122 12 L126 18 L123 23 M130 30 L127 36" fill="none" stroke="#454d60" stroke-width=".9" stroke-linecap="round"/>';
    h += '<path d="M115 15 L135 5" stroke="#fff" stroke-opacity=".55" stroke-width="1"/>';
    /* 根元：箱（立方体）の金具。上の面と前の面 */
    h += '<path d="M92 14 L98 8.5 L120 8.5 L114 14 Z" fill="' + m.v + '" stroke="' + INK + '" stroke-width="1.1" stroke-linejoin="round" opacity=".95"/>';
    h += '<rect x="92" y="14" width="22" height="21" rx="1.5" fill="' + m.h + '" stroke="' + INK + '" stroke-width="1.3"/>';
    h += '<path d="M114 14 L120 8.5 L120 29.5 L114 35 Z" fill="' + m.v + '" stroke="' + INK + '" stroke-width="1.1" stroke-linejoin="round" opacity=".8"/>';
    if (t >= 2) { h += inlay(95.5, 17.5, '#ffd84d'); h += inlay(110.5, 31.5, '#ffd84d'); }
    return h + socket(103, 24.5, set, id, t);
  }
  var DRAW = { adj: sword, verb: staff, noun: axe };
  /* 武器の絵。pos＝adj/verb/noun。set＝はまっているジェム {color, cut}（なければ空のソケット）。id＝ソケットの id。tier＝0 兵士／1 騎士／2 英雄 */
  function weapon(pos, set, id, tier) {
    tier = tier || 0;
    return '<svg class="wsvg t' + tier + '" viewBox="0 0 150 48" aria-hidden="true">' + DRAW[pos](set || null, id || '', tier) + '</svg>';
  }
  /* 文の中に置く小さな武器（ソケットは空・id なし・騎士の色） */
  function icon(pos) { return '<svg class="wic" viewBox="0 0 150 48" aria-hidden="true">' + DRAW[pos](null, '', 1) + '</svg>'; }
  function hole(px) { return '<svg viewBox="-13 -13 26 26" width="' + px + '" height="' + px + '" aria-hidden="true">' + socket(0, 0, null, '', 1) + '</svg>'; }

  window.ART = { gem: gem, weapon: weapon, icon: icon, socket: socket, hole: hole };
})();
