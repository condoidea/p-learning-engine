/* =========================================================
 * drill.js — 計算ドリルの問題を、その場で作る（数字は毎回ちがう）
 *  レッスンの {t:'drill', kind:'hexfrac', n:3} で使う。まちがえると「解き方」を1手ずつ見せる。
 *  各 kind は () => { q, o:[正解, 誤1, 誤2, 誤3], steps:[解き方…], mono:true(選択肢を等幅に) } を返す
 *  （ブラウザでもテスト（Node）でも動くように、DOM は使わない）
 * ========================================================= */
(function () {
  'use strict';
  var R = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  var pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  var HEX = '0123456789ABCDEF';
  var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  var pow2 = function (e) { return '2' + String(e).split('').map(function (c) { return SUP[c]; }).join(''); };
  var bin = function (n, w) { var s = n.toString(2); while (s.length < w) s = '0' + s; return s; };
  var nib = function (d) { return bin(HEX.indexOf(d), 4); };
  var grp = function (s) { return s.replace(/(\d{4})(?=\d)/g, '$1 '); };   // 4桁ごとにすきま
  var ones = function (s) { return s.split('').filter(function (c) { return c === '1'; }).length; };
  /* 選択肢：正解＋重複しない誤答3つ（足りなければ予備から） */
  function opts(right, wrongs, spare) {
    var o = [right];
    wrongs.concat(spare || []).forEach(function (w) { if (o.length < 4 && w != null && o.indexOf(w) < 0) o.push(w); });
    return o;
  }
  /* 分数 p/q（q は 2のべき乗）を10進の小数文字列に */
  function dec(p, q) { return String(p / q); }

  var K = {};

  /* ---- 16進小数 → 10進 ---- */
  K.hexfrac = function () {
    var d1 = R(1, 15), two = Math.random() < 0.35, d2 = two ? pick([4, 8, 12]) : 0;
    var hex = '0.' + HEX[d1] + (two ? HEX[d2] : '');
    var v = dec(d1 * 16 + d2, 256);
    var steps = ['16進数の小数は、小数第1位の重みが **1/16**、第2位が **1/256**（16 で割っていく）',
      HEX[d1] + '（＝' + d1 + '）× 1/16 ＝ ' + dec(d1, 16)];
    if (two) steps.push(HEX[d2] + '（＝' + d2 + '）× 1/256 ＝ ' + dec(d2, 256), '合計 ' + dec(d1, 16) + ' ＋ ' + dec(d2, 256) + ' ＝ **' + v + '**');
    else steps.push('答え **' + v + '**');
    return { q: '16進数の小数 **' + hex + '** を10進数にすると？', o: opts(v, ['0.' + d1 + (two ? String(d2) : ''), dec(d1 * 16 + d2, 512), dec(d1 + 1, 16), dec(d1 - 1 || 2, 16)]), steps: steps };
  };

  /* ---- 10進の分数（分母が2のべき乗）→ 16進小数 ---- */
  K.frac2hex = function () {
    var k = R(2, 8), m = k <= 2 ? 1 : pick([1, 1, 3, 5]), q = Math.pow(2, k);
    if (m >= q) m = 1;
    var b = bin(m, k);                       // 小数点以下 k 桁の2進数
    var padded = b; while (padded.length % 4) padded += '0';
    var hx = '0.' + padded.match(/.{4}/g).map(function (s) { return HEX[parseInt(s, 2)]; }).join('');
    var wrong = function (sh) { var x = sh > 0 ? b + '0' : b.slice(0, -1) || '0'; while (x.length % 4) x += '0'; return '0.' + x.match(/.{4}/g).map(function (s) { return HEX[parseInt(s, 2)]; }).join(''); };
    return {
      q: '10進数の分数 **' + m + '/' + q + '** を16進数の小数で表すと？',
      o: opts(hx, [wrong(1), wrong(-1), '0.' + (String(m / q).split('.')[1] || '0').slice(0, 2)], ['0.' + HEX[R(1, 15)]]),
      steps: [m + '/' + q + ' の分母 ' + q + ' ＝ ' + pow2(k) + '。2進数の小数第' + k + '位までで表せる',
        '2進数にすると 0.' + b + '（' + (m === 1 ? '小数第' + k + '位だけが1' : m + ' を ' + k + '桁の2進数 ' + b + ' にして並べる') + '）',
        '小数点から **右へ4桁ずつ** 区切る。足りない分は **右に0** を足す：0.' + grp(padded),
        '4桁ずつ16進数1文字に置きかえて **' + hx + '**']
    };
  };

  /* ---- 16進数（小数つき）→ 2のべき乗の和 ---- */
  K.hex2pow = function () {
    var ip = HEX[R(1, 15)] + (Math.random() < 0.6 ? HEX[R(0, 15)] : ''), fp = HEX[R(1, 15)] + (Math.random() < 0.6 ? HEX[R(1, 15)] : '');
    if (ip.length === 2 && ip[0] === '0') ip = ip[1];
    var ib = ip.split('').map(nib).join(''), fb = fp.split('').map(nib).join('');
    var ex = [];
    ib.split('').forEach(function (c, i) { if (c === '1') ex.push(ib.length - 1 - i); });
    fb.split('').forEach(function (c, i) { if (c === '1') ex.push(-(i + 1)); });
    var show = function (arr) { return arr.map(pow2).join('＋'); };
    var right = show(ex);
    return {
      q: '16進数 **' + ip + '.' + fp + '** と等しいものは？',
      o: opts(right, [show(ex.map(function (e) { return e + 1; })), show(ex.map(function (e) { return e < 0 ? e + 1 : e; })), show(ex.map(function (e) { return e >= 0 ? e + 1 : e; }))]),
      steps: ['16進数1桁 ＝ 2進数4桁。1文字ずつ4桁の2進数に置きかえる',
        ip.split('').map(function (d) { return d + '→' + nib(d); }).join('　') + '　.　' + fp.split('').map(function (d) { return d + '→' + nib(d); }).join('　'),
        '2進数 ' + grp(ib) + ' . ' + grp(fb) + '（小数点の左は右から ' + pow2(0) + ', ' + pow2(1) + '…、右は ' + pow2(-1) + ', ' + pow2(-2) + '…）',
        '1 が立っている位を並べて **' + right + '**']
    };
  };

  /* ---- 2進数で無限小数になる10進小数はどれ？ ---- */
  var FIN = [[1, 2], [1, 4], [3, 4], [1, 8], [3, 8], [5, 8], [7, 8], [1, 16], [3, 16], [5, 16]];
  var INF = [[1, 10], [1, 5], [3, 10], [2, 5], [3, 5], [7, 10], [1, 20], [3, 20], [7, 20], [9, 20]];
  K.finite = function () {
    var inf = pick(INF), fins = FIN.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 3);
    var s = function (f) { return String(f[0] / f[1]); };
    var p = inf[0], q = inf[1], tr = [];
    for (var i = 0; i < 5; i++) { var before = p / q; p *= 2; var bit = p >= q ? 1 : 0; if (bit) p -= q; tr.push(String(+before.toFixed(4)) + '×2 ＝ ' + String(+(before * 2).toFixed(4))); }
    return {
      q: '次の10進数のうち、2進数で表すと **無限小数** になるのは？',
      o: opts(s(inf), fins.map(s)),
      steps: ['分数にして約分する：' + s(inf) + ' ＝ ' + inf[0] + '/' + inf[1] + '（ほかは ' + fins.map(function (f) { return s(f) + '＝' + f[0] + '/' + f[1]; }).join('、') + '）',
        '**分母が 2・4・8・16…（2のべき乗）なら有限**。分母に 5 などが残ると無限になる',
        '確かめ（×2 して整数部分を取り出す）：' + tr.join('、') + '… 小数部が 0 にならない']
    };
  };

  /* ---- 偶数パリティ（7ビットの文字コード、先頭にパリティ） ---- */
  K.parity = function () {
    var c = R(0x21, 0x7E), b = bin(c, 7), n = ones(b), pb = n % 2, res = (pb << 7) | c;
    var h = function (x) { return (x < 16 ? '0' : '') + x.toString(16).toUpperCase(); };
    return {
      q: '7ビットの文字コード **' + h(c) + '**（16進数）の先頭に **偶数パリティビット** を付けると？（16進数で）',
      o: opts(h(res), [h(res ^ 0x80), h(c ^ 0x01), h((c << 1) & 0xFF)]),
      steps: ['16進数を2進数に：' + h(c) + ' → ' + grp(bin(c, 8)) + '（7ビットなら ' + b + '）',
        '1 の個数を数える：**' + n + '個**（' + (n % 2 ? '奇数' : '偶数') + '）',
        '偶数パリティは、全体の1の個数が偶数になるように付ける → パリティビットは **' + pb + '**',
        '先頭に付けて ' + pb + b + ' ＝ ' + grp(bin(res, 8)) + ' → 16進数で **' + h(res) + '**']
    };
  };

  /* ---- 8ビットの2の補数 → 10進数 ---- */
  K.twos2dec = function () {
    var n = R(2, 127), bits = bin(256 - n, 8), inv = bin((~(256 - n)) & 0xFF, 8);
    return {
      q: '8ビットの2の補数で表した **' + grp(bits) + '** は10進数でいくつ？', mono: false,
      o: opts('−' + n, [String(256 - n), '−' + (n - 1), String(n)]),
      steps: ['先頭（いちばん左）が **1** → 負の数', '大きさを知るには「**反転して＋1**」：反転 ' + grp(inv) + ' → ＋1 → ' + grp(bin(n, 8)),
        grp(bin(n, 8)) + ' ＝ ' + n + '。だから答えは **−' + n + '**']
    };
  };

  /* ---- 10進数（負）→ 8ビットの2の補数 ---- */
  K.dec2twos = function () {
    var n = R(2, 127), pos = bin(n, 8), inv = bin((~n) & 0xFF, 8), ans = bin(256 - n, 8);
    return {
      q: '10進数 **−' + n + '** を8ビットの2の補数で表すと？', mono: true,
      o: opts(grp(ans), [grp(inv), grp('1' + bin(n, 7)), grp(pos)]),
      steps: ['まず正の数 ' + n + ' を2進数に：' + grp(pos), '全ビットを **反転**：' + grp(inv), '**1 を足す**：' + grp(ans) + '（これが −' + n + '）']
    };
  };

  /* ---- 固定小数点（8ビット、小数部 k ビット、負数は2の補数） ---- */
  K.fixed = function () {
    var k = pick([3, 4]), lim = Math.pow(2, 7 - k) - 1;         // 整数部は 8−k ビット（先頭は符号）
    var ip = R(1, lim), fpN = R(1, Math.pow(2, k) - 1), v = ip + fpN / Math.pow(2, k);
    var posBits = bin(ip, 8 - k) + bin(fpN, k), m = parseInt(posBits, 2);
    var inv = bin((~m) & 0xFF, 8), ans = bin((256 - m) & 0xFF, 8);
    var pt = function (s) { return s.slice(0, 8 - k) + '.' + s.slice(8 - k); };
    return {
      q: '10進数 **−' + v + '** を、8ビットの固定小数点数（小数部 ' + k + 'ビット・整数部 ' + (8 - k) + 'ビット、負数は2の補数）で表すと？', mono: true,
      o: opts(ans, [inv, '1' + posBits.slice(1), posBits]),
      steps: ['まず正の数 ' + v + ' を2進数に：整数部 ' + ip + ' → ' + bin(ip, 8 - k) + '、小数部 ' + (fpN / Math.pow(2, k)) + ' → ' + bin(fpN, k) + '（小数第1位から 1/2, 1/4, 1/8…）',
        '小数点の位置を合わせて8ビットに：' + pt(posBits) + ' → ' + posBits,
        '負の数なので **反転して＋1**：反転 ' + inv + ' → ＋1 → **' + ans + '**']
    };
  };

  window.LEDrill = K;
})();
