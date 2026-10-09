/* =========================================================
 * vocab/chara.js — 単語キャラ（単語から自動で描くゆるキャラ）と自キャラ
 *
 *  同じ単語なら、いつも同じ姿（単語の id から乱数を作る）。絵のファイルは使わない（SVG）。
 *    体の形  品詞    名詞＝まる／動詞＝手足があって動く／形容詞＝ふわふわ雲／副詞＝しずく＋羽
 *    色      名詞の性 男性＝青系／女性＝赤系（ほかの品詞は品詞ごとの色）
 *    表情    コンディション  元気＝にこにこ／しおれ＝しょんぼり／野生に戻りかけ＝うとうと
 *  距離感：関係が深い（ランクが高く、元気な）ほど自キャラの近くにいる → closeness()
 * ========================================================= */
(function () {
  'use strict';
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function r1(n) { return Math.round(n * 10) / 10; }

  /* なめらかな閉じた形（点を通る曲線） */
  function smooth(pts) {
    var n = pts.length, d = 'M' + r1((pts[0][0] + pts[1][0]) / 2) + ' ' + r1((pts[0][1] + pts[1][1]) / 2);
    for (var i = 1; i <= n; i++) {
      var p = pts[i % n], q = pts[(i + 1) % n];
      d += ' Q' + r1(p[0]) + ' ' + r1(p[1]) + ' ' + r1((p[0] + q[0]) / 2) + ' ' + r1((p[1] + q[1]) / 2);
    }
    return d + 'Z';
  }
  var HUE = { m: [200, 228], f: [335, 358], v: [128, 165], adj: [32, 50], adv: [262, 290], n: [180, 200] };
  function palette(w, R) {
    var k = w.pos === 'n' ? (w.g || 'n') : w.pos, h = HUE[k] || HUE.n;
    var hue = h[0] + R() * (h[1] - h[0]), sat = 62 + R() * 14, lig = 64 + R() * 8;
    return { fill: 'hsl(' + r1(hue) + ',' + r1(sat) + '%,' + r1(lig) + '%)', dark: 'hsl(' + r1(hue) + ',' + r1(sat * 0.8) + '%,28%)', light: 'hsl(' + r1(hue) + ',' + r1(sat) + '%,86%)' };
  }

  function face(cx, cy, mood, R, dark) {
    var eye = R() < 0.5 ? 'dot' : 'oval', gap = 9 + R() * 3, s = '';
    var ex1 = cx - gap, ex2 = cx + gap;
    if (mood === 'sleep') {
      s += '<path d="M' + (ex1 - 4) + ' ' + cy + ' q4 3 8 0 M' + (ex2 - 4) + ' ' + cy + ' q4 3 8 0" stroke="' + dark + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
      s += '<ellipse cx="' + cx + '" cy="' + (cy + 10) + '" rx="2.6" ry="2" fill="' + dark + '"/>';
      s += '<text x="' + (cx + 18) + '" y="' + (cy - 12) + '" font-size="10" font-family="sans-serif" fill="' + dark + '" opacity=".7">z</text>';
      return s;
    }
    if (mood === 'meh') {
      s += '<path d="M' + (ex1 - 4) + ' ' + (cy - 1) + ' h8 M' + (ex2 - 4) + ' ' + (cy - 1) + ' h8" stroke="' + dark + '" stroke-width="2.6" stroke-linecap="round"/>';
      s += '<path d="M' + (cx - 5) + ' ' + (cy + 11) + ' q5 -3 10 0" stroke="' + dark + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
      s += '<path d="M' + (cx + 22) + ' ' + (cy - 14) + ' q3 5 0 7 q-3 -2 0 -7z" fill="#7cc8ff"/>';
      return s;
    }
    var ry = eye === 'oval' ? 4.6 : 3.6, rx = 3.4;
    if (mood === 'wow') { rx = 4; ry = 4.4; }
    s += '<ellipse cx="' + ex1 + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + dark + '"/><ellipse cx="' + ex2 + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + dark + '"/>';
    s += '<circle cx="' + (ex1 + 1.2) + '" cy="' + (cy - 1.5) + '" r="1.2" fill="#fff"/><circle cx="' + (ex2 + 1.2) + '" cy="' + (cy - 1.5) + '" r="1.2" fill="#fff"/>';
    if (mood === 'wow') s += '<ellipse cx="' + cx + '" cy="' + (cy + 11) + '" rx="3.4" ry="4" fill="' + dark + '"/>';
    else s += '<path d="M' + (cx - 6) + ' ' + (cy + 8) + ' q6 6 12 0" stroke="' + dark + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    s += '<ellipse cx="' + (ex1 - 5) + '" cy="' + (cy + 7) + '" rx="4" ry="2.4" fill="#ff8fa3" opacity=".45"/><ellipse cx="' + (ex2 + 5) + '" cy="' + (cy + 7) + '" rx="4" ry="2.4" fill="#ff8fa3" opacity=".45"/>';
    return s;
  }
  /* 小物（単語ごとに決まる） */
  function extra(kind, cx, top, P) {
    if (kind === 1) return '<path d="M' + cx + ' ' + top + ' q-2 -10 4 -16" stroke="' + P.dark + '" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="' + (cx + 4) + '" cy="' + (top - 17) + '" r="4" fill="' + P.light + '" stroke="' + P.dark + '" stroke-width="2"/>';
    if (kind === 2) return '<path d="M' + cx + ' ' + (top + 1) + ' q-10 -12 -2 -16 q6 6 2 16z" fill="#7bd67b" stroke="#2f7a3a" stroke-width="1.6"/><path d="M' + cx + ' ' + (top + 1) + ' q10 -10 14 -6 q-6 8 -14 6z" fill="#8fe08f" stroke="#2f7a3a" stroke-width="1.6"/>';
    if (kind === 3) { /* 花（王冠はゴールドのランクとまぎらわしいので使わない） */
      var f = '', fx = cx + 12, fy = top + 4;
      for (var i = 0; i < 5; i++) { var a = i / 5 * 6.283; f += '<circle cx="' + r1(fx + Math.cos(a) * 4.5) + '" cy="' + r1(fy + Math.sin(a) * 4.5) + '" r="3.6" fill="#fff" stroke="' + P.dark + '" stroke-width="1.2"/>'; }
      return f + '<circle cx="' + fx + '" cy="' + fy + '" r="2.8" fill="#ffc83d"/>';
    }
    return '';
  }

  /* 単語キャラの SVG。mood: happy | meh | sleep | wow | none（まだ会っていない＝シルエット） */
  function svg(w, opt) {
    opt = opt || {};
    var R = rng(hash(w.id)), P = palette(w, R), mood = opt.mood || 'happy', s = '', cx = 50, faceY = 56, top = 26;
    if (mood === 'none') P = { fill: 'rgba(60,40,30,.28)', dark: 'rgba(60,40,30,.4)', light: 'rgba(60,40,30,.2)' };
    var sw = 'stroke="' + P.dark + '" stroke-width="2.6"';
    if (w.pos === 'v') {
      var lean = (R() - 0.5) * 6;
      s += '<g class="limb arm-l"><path d="M28 58 q-12 -6 -14 -18" ' + sw + ' fill="none" stroke-linecap="round"/></g>';
      s += '<g class="limb arm-r"><path d="M72 58 q12 -4 15 -16" ' + sw + ' fill="none" stroke-linecap="round"/></g>';
      s += '<path class="limb leg-l" d="M40 84 l-4 10" ' + sw + ' stroke-linecap="round"/><path class="limb leg-r" d="M60 84 l4 10" ' + sw + ' stroke-linecap="round"/>';
      var pts = [[50 + lean, 18], [72, 30], [76, 58], [66, 84], [50, 88], [34, 84], [24, 58], [28, 30]];
      s += '<path d="' + smooth(pts) + '" fill="' + P.fill + '" ' + sw + '/>'; top = 20; faceY = 50;
    } else if (w.pos === 'adj') {
      var cs = [[34, 56, 17], [50, 44, 20], [66, 56, 17], [42, 68, 16], [58, 68, 16]].map(function (c) { return [c[0] + (R() - 0.5) * 4, c[1] + (R() - 0.5) * 4, c[2]]; });
      cs.forEach(function (c) { s += '<circle cx="' + r1(c[0]) + '" cy="' + r1(c[1]) + '" r="' + (c[2] + 1.3) + '" fill="' + P.dark + '"/>'; });
      cs.forEach(function (c) { s += '<circle cx="' + r1(c[0]) + '" cy="' + r1(c[1]) + '" r="' + (c[2] - 1.3) + '" fill="' + P.fill + '"/>'; });
      top = 25; faceY = 58;
    } else if (w.pos === 'adv') {
      s += '<ellipse class="limb wing-l" cx="24" cy="54" rx="13" ry="8" fill="' + P.light + '" ' + sw + ' transform="rotate(-25 24 54)"/>';
      s += '<ellipse class="limb wing-r" cx="76" cy="54" rx="13" ry="8" fill="' + P.light + '" ' + sw + ' transform="rotate(25 76 54)"/>';
      s += '<path d="M50 16 C58 34 74 46 74 64 A24 24 0 0 1 26 64 C26 46 42 34 50 16Z" fill="' + P.fill + '" ' + sw + '/>';
      top = 18; faceY = 62;
    } else {
      var n = 9, pp = [];
      for (var i = 0; i < n; i++) { var a = i / n * 6.283 - 1.57, rr = 1 + (R() - 0.5) * 0.12; pp.push([50 + Math.cos(a) * 36 * rr, 58 + Math.sin(a) * 31 * rr]); }
      s += '<ellipse cx="50" cy="92" rx="26" ry="4" fill="rgba(0,0,0,.12)"/>';
      s += '<path d="' + smooth(pp) + '" fill="' + P.fill + '" ' + sw + '/>';
      s += '<ellipse cx="38" cy="40" rx="8" ry="5" fill="#fff" opacity=".35" transform="rotate(-25 38 40)"/>';
      top = 28; faceY = 58;
    }
    if (mood === 'none') s += '<text x="50" y="' + (faceY + 8) + '" text-anchor="middle" font-size="26" font-weight="900" font-family="sans-serif" fill="rgba(255,255,255,.75)">?</text>';
    else { s += extra(Math.floor(R() * 4), cx, top, P); s += face(cx, faceY, mood, R, P.dark); }
    /* 動詞の衣装：覚えた時制（フォルム）の色のしましまスカーフ。フォルムが増えるほど色が増える */
    if (opt.forms && opt.forms.length && mood !== 'none') {
      var n = opt.forms.length, y0 = w.pos === 'v' ? 68 : 72, H = 8;
      var at = function (t, dy) { return r1(31 + 38 * t) + ' ' + r1(y0 + 14 * t * (1 - t) + dy); };   /* 首にそった曲線 */
      for (var k = 0; k < n; k++) {
        var t0 = k / n, t1 = (k + 1) / n;
        s += '<path d="M' + at(t0, 0) + ' L' + at(t1, 0) + ' L' + at(t1, H) + ' L' + at(t0, H) + 'Z" fill="' + opt.forms[k] + '" stroke="' + P.dark + '" stroke-width="1.3" stroke-linejoin="round"/>';
      }
      s += '<path d="M' + at(0.86, H - 2) + ' l5 12 l-8 0z" fill="' + opt.forms[n - 1] + '" stroke="' + P.dark + '" stroke-width="1.3" stroke-linejoin="round"/>';
    }
    if (opt.holo) s += '<g class="spark"><path d="M14 20 l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2z" fill="#fff6a8"/><path d="M84 30 l1.5 -4 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5z" fill="#c8f7ff"/></g>';
    return '<svg class="chara pos-' + w.pos + ' mood-' + mood + '" viewBox="0 0 100 100" aria-hidden="true">' + s + '</svg>';
  }

  /* 自キャラ（スキンごとに衣装を変える）
   *  España：つばの平らな帽子と赤いスカーフ／Avenue：紺のキャップと、マスタード色のマフラー */
  function me(opt) {
    opt = opt || {};
    var avenue = document.documentElement.getAttribute('data-skin') === 'avenue';
    var s = '<ellipse cx="50" cy="94" rx="24" ry="4" fill="rgba(0,0,0,.14)"/>';
    s += '<path d="M24 64 C24 40 36 30 50 30 C64 30 76 40 76 64 C76 84 66 92 50 92 C34 92 24 84 24 64Z" fill="#ffd9a8" stroke="#6b3b1c" stroke-width="2.6"/>';
    if (avenue) {
      s += '<path d="M30 74 q20 12 40 0 l-4 10 q-16 6 -32 0z" fill="#e0a83b" stroke="#6b3b1c" stroke-width="2.2" stroke-linejoin="round"/><path d="M60 80 l4 12 l6 -2 l-3 -11z" fill="#e0a83b" stroke="#6b3b1c" stroke-width="1.8" stroke-linejoin="round"/>';
      s += '<path d="M27 38 q0 -20 23 -20 q23 0 23 20 z" fill="#274c77" stroke="#1c2433" stroke-width="2.2"/><path d="M50 38 q22 -2 34 6 q-14 2 -34 0z" fill="#1c3a5c" stroke="#1c2433" stroke-width="2"/><circle cx="50" cy="18" r="2.6" fill="#b23a48"/>';
    } else {
      s += '<path d="M30 74 q20 12 40 0 l-4 10 q-16 6 -32 0z" fill="#d6283a" stroke="#6b3b1c" stroke-width="2.2" stroke-linejoin="round"/>';
      s += '<ellipse cx="50" cy="33" rx="34" ry="6" fill="#2b1d14"/><path d="M34 32 q0 -14 16 -14 q16 0 16 14z" fill="#2b1d14"/><path d="M34 29 h32" stroke="#d6283a" stroke-width="3"/>';
    }
    s += face(50, 56, opt.mood || 'happy', function () { return 0.3; }, '#4a2a14');
    return '<svg class="chara me" viewBox="0 0 100 100" aria-hidden="true">' + s + '</svg>';
  }

  /* 距離感：0（遠い）〜1（となり）。ランク×コンディション */
  function closeness(lv, cond) { return Math.max(0.05, Math.min(1, (lv + 1) / 4 * (0.35 + 0.65 * cond))); }
  function moodOf(state) { return state === 'wild' ? 'sleep' : state === 'wilt' ? 'meh' : 'happy'; }

  window.Chara = { svg: svg, me: me, closeness: closeness, moodOf: moodOf, hash: hash };
})();
