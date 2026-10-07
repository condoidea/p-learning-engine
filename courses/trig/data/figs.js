/* =========================================================
 * 静止画の図（問題・説明用）。文字列のSVGを返すだけ（DOMを使わない）
 *  問題では fig: ['名前', 引数…] と書くと、ここの関数で図が描かれる
 *  色：.s=sin（ピンク） .c=cos（シアン） .t=tan（イエロー） .h=強調（オレンジ） .g=緑 .v=紫
 * ========================================================= */
(function () {
  function S(w, h, body) { return '<svg class="fg" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg">' + body + '</svg>'; }
  function L(a, b, cls) { return '<line class="' + (cls || 'k') + '" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>'; }
  function T(p, s, cls, size) { return '<text class="' + (cls || 'tx') + '" x="' + p[0] + '" y="' + p[1] + '"' + (size ? ' style="font-size:' + size + 'px !important"' : '') + '>' + s + '</text>'; }
  function poly(pts, cls) { return '<polygon class="' + (cls || 'k') + '" points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '"/>'; }
  function arc(v, r, a1, a2, cls) { /* 度（数学の向き） */
    var R = Math.PI / 180, x1 = v[0] + r * Math.cos(a1 * R), y1 = v[1] - r * Math.sin(a1 * R), x2 = v[0] + r * Math.cos(a2 * R), y2 = v[1] - r * Math.sin(a2 * R);
    return '<path class="' + (cls || 'k') + '" d="M' + x1.toFixed(1) + ',' + y1.toFixed(1) + ' A' + r + ',' + r + ' 0 ' + (Math.abs(a2 - a1) > 180 ? 1 : 0) + ',0 ' + x2.toFixed(1) + ',' + y2.toFixed(1) + '"/>';
  }
  function circ(c, r, cls) { return '<circle class="' + (cls || 'k') + '" cx="' + c[0] + '" cy="' + c[1] + '" r="' + r + '"/>'; }
  function on(c, r, d) { var R = Math.PI / 180; return [+(c[0] + r * Math.cos(d * R)).toFixed(1), +(c[1] - r * Math.sin(d * R)).toFixed(1)]; }
  function sq(p, k) { return '<path class="k thin" d="M' + (p[0] - 10) + ',' + p[1] + ' v-10 h10"/>'; }

  LE.figs = {
    /* 直角三角形（θは左下、直角は右下）。o = {a,b,c,th,hl:'a'|'b'|'c'|'ac'…} */
    rt: function (o) {
      o = o || {};
      var A = [30, 125], B = [190, 125], C = [190, 30], hl = o.hl || '';
      return S(220, 150,
        poly([A, B, C], 'k fillw') + sq(B) +
        L(B, C, hl.indexOf('a') >= 0 ? 's thick' : 'k') + L(A, B, hl.indexOf('b') >= 0 ? 'c thick' : 'k') + L(A, C, hl.indexOf('c') >= 0 ? 'h thick' : 'k') +
        arc(A, 24, 0, 30.7, 'k thin') + T([66, 117], o.th || 'θ') +
        T([204, 80], o.a == null ? 'a' : o.a, hl.indexOf('a') >= 0 ? 'tx s' : 'tx') + T([110, 142], o.b == null ? 'b' : o.b, hl.indexOf('b') >= 0 ? 'tx c' : 'tx') + T([98, 68], o.c == null ? 'c' : o.c, hl.indexOf('c') >= 0 ? 'tx h' : 'tx'));
    },
    /* 三角定規の2枚 */
    /* o.blank=true で辺の数字をかくす（思い出す練習用） */
    rulers: function (o) {
      o = o || {};
      var A = [14, 120], B = [118, 120], C = [118, 60], D = [140, 120], E = [206, 120], F = [206, 54];
      var n = function (p, v) { return T(p, o.blank ? '?' : v, o.blank ? 'tx h' : 'tx'); };
      return S(220, 140, poly([A, B, C], 'k fillw') + sq(B) + T([42, 114], '30°', 'tx', 10) + T([108, 76], '60°', 'tx', 10) + n([60, 82], '2') + n([66, 134], '√3') + n([128, 92], '1') +
        poly([D, E, F], 'k fillw') + sq(E) + T([160, 114], '45°', 'tx', 10) + n([164, 80], '√2') + n([174, 134], '1') + n([214, 88], '1'));
    },
    /* 単位円と点P（deg） */
    unit: function (deg, o) {
      o = o || {};
      var O = [110, 115], R = 85, P = on(O, R, deg), F = [P[0], O[1]];
      return S(220, 140, L([12, O[1]], [208, O[1]], 'k thin') + L([O[0], 132], [O[0], 14], 'k thin') + arc(O, R, 0, 180, 'k') +
        L(O, F, 'c thick') + L(F, P, 's thick') + L(O, P, 'k') + arc(O, 16, 0, deg, 'k thin') +
        '<circle class="dot" cx="' + P[0] + '" cy="' + P[1] + '" r="4"/>' + T([P[0] + (deg <= 90 ? 12 : -12), P[1] - 8], o.p || 'P') + T([O[0] + 24, O[1] - 8], o.th || 'θ', 'tx', 11) +
        T([O[0] - R, O[1] + 14], '−1', 'tx sm') + T([O[0] + R, O[1] + 14], '1', 'tx sm') + T([O[0] - 8, O[1] + 14], 'O', 'tx sm'));
    },
    /* 一般の三角形 ABC。o = {A:'60°', a:'a', b:'b', c:'c', hl:'a', R:true（外接円）, r:true（内接円）} */
    tri: function (o) {
      o = o || {};
      var A = [80, 20], B = [20, 128], C = [200, 128], hl = o.hl || '';
      var out = '';
      if (o.R) out += circ([110, 107.3], 92.3, 'k thin');
      out += poly([A, B, C], 'k fillw');
      if (o.r) out += circ([91, 86.2], 41.8, 'g');
      out += L(B, C, hl.indexOf('a') >= 0 ? 's thick' : 'k') + L(A, C, hl.indexOf('b') >= 0 ? 'c thick' : 'k') + L(A, B, hl.indexOf('c') >= 0 ? 't thick' : 'k');
      if (o.A) out += arc(A, 18, 241, 302, 'h') + T([84, 50], o.A, 'tx h', 11);
      if (o.B) out += arc(B, 20, 0, 61, 'h') + T([50, 116], o.B, 'tx h', 11);
      out += T([80, 12], 'A') + T([10, 134], 'B') + T([210, 134], 'C') +
        T([110, 142], o.a == null ? 'a' : o.a) + T([150, 70], o.b == null ? 'b' : o.b) + T([40, 70], o.c == null ? 'c' : o.c);
      return S(220, o.R ? 205 : 150, out);
    },
    /* 円周角：type = 'same'（同じ弧）| 'center'（中心角）| 'diam'（直径） */
    ins: function (type, o) {
      o = o || {};
      var O = [110, 75], R = 62, A = on(O, R, 215), B = on(O, R, 325), P1 = on(O, R, 110), P2 = on(O, R, 60);
      var out = circ(O, R, 'k');
      if (type === 'diam') { A = on(O, R, 180); B = on(O, R, 0); out += L(A, B, 'k') + L(A, P1, 'k') + L(B, P1, 'k') + T([P1[0] - 4, P1[1] + 22], o.x || '?', 'tx h'); }
      else if (type === 'center') { out += L(P1, A, 'k') + L(P1, B, 'k') + L(O, A, 'v') + L(O, B, 'v') + T([P1[0] + 2, P1[1] + 24], o.p || 'θ', 'tx h') + T([O[0], O[1] + 22], o.o || '?', 'tx v') + '<circle class="dot" cx="' + O[0] + '" cy="' + O[1] + '" r="3"/>'; }
      else { out += L(P1, A, 'k') + L(P1, B, 'k') + L(P2, A, 'k') + L(P2, B, 'k') + T([P1[0] - 2, P1[1] + 24], o.p || '40°', 'tx h') + T([P2[0] - 4, P2[1] + 26], o.q || '?', 'tx h'); }
      return S(220, 150, out + T([A[0] - 10, A[1] + 8], 'A') + T([B[0] + 10, B[1] + 8], 'B'));
    },
    /* 円に内接する四角形。o = {A:'80°', C:'?'} */
    cyc: function (o) {
      o = o || {};
      var O = [110, 75], R = 62, P = [on(O, R, 140), on(O, R, 225), on(O, R, 320), on(O, R, 40)];
      return S(220, 150, circ(O, R, 'k') + poly(P, 'k fillw') + T([P[0][0] + 16, P[0][1] + 12], o.A || 'θ', 'tx h', 11) + T([P[2][0] - 16, P[2][1] - 8], o.C || '?', 'tx h', 11) +
        T([P[0][0] - 10, P[0][1] - 4], 'A') + T([P[1][0] - 10, P[1][1] + 8], 'B') + T([P[2][0] + 10, P[2][1] + 8], 'C') + T([P[3][0] + 10, P[3][1] - 4], 'D'));
    },
    /* 接弦定理。o = {t:'50°'（接線と弦の角）, p:'?'} */
    tan: function (o) {
      o = o || {};
      var O = [110, 65], R = 55, A = on(O, R, 270), B = on(O, R, 20), P = on(O, R, 150);
      return S(220, 140, circ(O, R, 'k') + L([20, A[1]], [200, A[1]], 'g') + L(A, B, 'k') + L(P, A, 'k') + L(P, B, 'k') +
        T([A[0] + 30, A[1] - 6], o.t || '?', 'tx t', 11) + T([P[0] + 14, P[1] + 12], o.p || '?', 'tx t', 11) + T([A[0], A[1] + 14], 'A') + T([B[0] + 10, B[1]], 'B') + T([P[0] - 10, P[1]], 'P'));
    },
    /* 方べきの定理の3つの形。n=1|2|3、o で長さのラベル */
    pow: function (n, o) {
      o = o || {};
      var O = [125, 75], R = 55, out = circ(O, R, 'k');
      if (n === 1) {
        var A = on(O, R, 150), B = on(O, R, 330), C = on(O, R, 215), D = on(O, R, 20), P = [111, 81];
        out += L(A, B, 's') + L(C, D, 'c') + T([A[0] - 8, A[1] - 4], 'A') + T([B[0] + 8, B[1] + 8], 'B') + T([C[0] - 8, C[1] + 8], 'C') + T([D[0] + 8, D[1] - 2], 'D') + T([P[0] - 2, P[1] - 8], 'P', 'tx h');
        if (o.PA) out += T([(A[0] + P[0]) / 2 - 4, (A[1] + P[1]) / 2 - 6], o.PA, 'tx s sm') + T([(B[0] + P[0]) / 2 + 4, (B[1] + P[1]) / 2 - 6], o.PB, 'tx s sm') + T([(C[0] + P[0]) / 2 - 4, (C[1] + P[1]) / 2 + 12], o.PC, 'tx c sm') + T([(D[0] + P[0]) / 2 + 8, (D[1] + P[1]) / 2 + 10], o.PD, 'tx c sm');
      } else {
        /* 円の外の点 P から引いた直線と円の交点を計算する */
        var Pp = [16, n === 2 ? 75 : 66];
        var cut = function (deg) {
          var r = Math.PI / 180, dx = Math.cos(deg * r), dy = -Math.sin(deg * r), fx = Pp[0] - O[0], fy = Pp[1] - O[1];
          var b = fx * dx + fy * dy, c = fx * fx + fy * fy - R * R, s = Math.sqrt(b * b - c);
          return [[+(Pp[0] + dx * (-b - s)).toFixed(1), +(Pp[1] + dy * (-b - s)).toFixed(1)], [+(Pp[0] + dx * (-b + s)).toFixed(1), +(Pp[1] + dy * (-b + s)).toFixed(1)]];
        };
        var u = cut(n === 2 ? 14 : 4), A2 = u[0], B2 = u[1];
        out += L(Pp, B2, 's') + '<circle class="dot" cx="' + A2[0] + '" cy="' + A2[1] + '" r="2.5"/><circle class="dot" cx="' + B2[0] + '" cy="' + B2[1] + '" r="2.5"/>' +
          T([A2[0] - 2, A2[1] - 9], 'A') + T([B2[0] + 9, B2[1] - 4], 'B') + T([Pp[0] - 6, Pp[1] - 6], 'P', 'tx h');
        if (o.PA) out += T([(Pp[0] + A2[0]) / 2, (Pp[1] + A2[1]) / 2 - 7], o.PA, 'tx s sm') + T([(A2[0] + B2[0]) / 2, (A2[1] + B2[1]) / 2 - 7], o.AB, 'tx s sm');
        if (n === 2) {
          var v = cut(-14), C2 = v[0], D2 = v[1];
          out += L(Pp, D2, 'c') + '<circle class="dot" cx="' + C2[0] + '" cy="' + C2[1] + '" r="2.5"/><circle class="dot" cx="' + D2[0] + '" cy="' + D2[1] + '" r="2.5"/>' +
            T([C2[0] - 2, C2[1] + 13], 'C') + T([D2[0] + 9, D2[1] + 6], 'D');
          if (o.PC) out += T([(Pp[0] + C2[0]) / 2, (Pp[1] + C2[1]) / 2 + 12], o.PC, 'tx c sm') + T([(C2[0] + D2[0]) / 2, (C2[1] + D2[1]) / 2 + 12], o.CD, 'tx c sm');
        } else {
          /* 接点 T（下側） */
          var dx0 = O[0] - Pp[0], dy0 = O[1] - Pp[1], d0 = Math.hypot(dx0, dy0), Lt = Math.sqrt(d0 * d0 - R * R), base = Math.atan2(dy0, dx0), off = Math.asin(R / d0);
          var Tt = [+(Pp[0] + Lt * Math.cos(base + off)).toFixed(1), +(Pp[1] + Lt * Math.sin(base + off)).toFixed(1)];
          out += L(Pp, Tt, 't') + '<circle class="dot" cx="' + Tt[0] + '" cy="' + Tt[1] + '" r="2.5"/>' + T([Tt[0] + 2, Tt[1] + 13], 'T', 'tx t');
          if (o.PT) out += T([(Pp[0] + Tt[0]) / 2 - 4, (Pp[1] + Tt[1]) / 2 + 12], o.PT, 'tx t sm');
        }
      }
      return S(220, 140, out);
    },
    /* 内接円・内心 */
    incir: function () {
      var A = [90, 16], B = [16, 128], C = [204, 128], I = [97.2, 84.3];
      return S(220, 145, poly([A, B, C], 'k fillw') + circ(I, 43.7, 'g') + L(A, I, 'h thin') + L(B, I, 'h thin') + L(C, I, 'h thin') + L(I, [97.2, 128], 'g') + '<circle class="dot" cx="97.2" cy="84.3" r="3"/>' + T([108, 80], 'I', 'tx g') + T([104, 110], 'r', 'tx g', 11) +
        T([90, 10], 'A') + T([8, 134], 'B') + T([212, 134], 'C'));
    },
    /* 角の二等分線と比。o = {c:'AB', b:'AC', x:'BD', y:'DC'} */
    bis: function (o) {
      o = o || {};
      var A = [70, 16], B = [16, 125], C = [206, 125], D = [94, 125];
      return S(220, 145, poly([A, B, C], 'k fillw') + L(A, D, 't') + L(B, D, 's thick') + L(D, C, 'c thick') +
        arc(A, 20, 245, 268, 'h thin') + arc(A, 24, 268, 316, 'h thin') +
        T([70, 10], 'A') + T([8, 130], 'B') + T([212, 130], 'C') + T([94, 138], 'D', 'tx t') +
        T([30, 66], o.c || 'c') + T([150, 64], o.b || 'b') + T([54, 120], o.x || '?', 'tx s sm') + T([150, 120], o.y || '?', 'tx c sm'));
    },
    /* 重心 */
    cent: function (o) {
      o = o || {};
      var A = [100, 14], B = [16, 128], C = [204, 128], M = [110, 128], G = [106.7, 90];
      return S(220, 145, poly([A, B, C], 'k fillw') + L(A, M, 'k') + L(B, [152, 71], 'k thin') + L(C, [58, 71], 'k thin') + L(A, G, 's thick') + L(G, M, 'c thick') +
        '<circle class="dot" cx="' + G[0] + '" cy="' + G[1] + '" r="3.5"/>' + T([94, 92], 'G', 'tx g') + T([100, 8], 'A') + T([8, 134], 'B') + T([212, 134], 'C') + T([110, 141], 'M') +
        T([116, 52], o.ag || '', 'tx s sm') + T([118, 112], o.gm || '', 'tx c sm'));
    },
    /* チェバ */
    ceva: function () {
      var A = [110, 12], B = [14, 130], C = [206, 130], O = [112, 90], R = [64, 69], P = [113, 130], Q = [158, 71];
      return S(220, 145, poly([A, B, C], 'k fillw') + L(A, P, 'k thin') + L(B, Q, 'k thin') + L(C, R, 'k thin') +
        L(A, R, 's thick') + L(R, B, 's') + L(B, P, 'c thick') + L(P, C, 'c') + L(C, Q, 't thick') + L(Q, A, 't') +
        T([110, 7], 'A') + T([6, 134], 'B') + T([214, 134], 'C') + T([54, 66], 'R') + T([113, 142], 'P') + T([168, 66], 'Q') + T([122, 86], 'O', 'tx h sm'));
    },
    /* メネラウス */
    mene: function () {
      var A = [96, 14], B = [20, 128], C = [150, 128], R = [56, 74], Q = [138.7, 104.2], P = [204, 128];
      return S(220, 145, poly([A, B, C], 'k fillw') + L(R, P, 'g') + L(C, P, 'k thin') +
        L(A, R, 's thick') + L(R, B, 's') + L(B, P, 'c') + L(C, Q, 't thick') + L(Q, A, 't') +
        T([96, 9], 'A') + T([12, 134], 'B') + T([150, 141], 'C') + T([46, 72], 'R') + T([210, 140], 'P') + T([150, 100], 'Q'));
    },
    /* 正弦定理（外接円と直径） */
    sinR: function () {
      var O = [110, 72], R = 62, A = on(O, R, 105), B = on(O, R, 215), C = on(O, R, 325), A2 = [2 * O[0] - B[0], 2 * O[1] - B[1]];
      return S(220, 145, circ(O, R, 'k') + poly([A, B, C], 'k fillw') + L(B, C, 's thick') + L(B, A2, 'v') + L(A2, C, 'v') +
        T([A[0], A[1] - 8], 'A') + T([B[0] - 10, B[1] + 6], 'B') + T([C[0] + 10, C[1] + 6], 'C') + T([A2[0] + 12, A2[1] - 4], "A'", 'tx v') + T([(B[0] + C[0]) / 2, B[1] + 16], 'a', 'tx s') + T([O[0] + 2, O[1] - 6], '2R', 'tx v sm'));
    },
    /* 余弦定理の証明の図（C から AB へ垂線） */
    cosProof: function () {
      var A = [20, 125], B = [200, 125], C = [80, 25], H = [80, 125];
      return S(220, 145, poly([A, B, C], 'k fillw') + L(C, H, 's thick') + L(A, H, 'c thick') + L(H, B, 't thick') + '<path class="k thin" d="M80,115 h10 v10"/>' +
        T([14, 132], 'A') + T([206, 132], 'B') + T([80, 18], 'C') + T([40, 70], 'b') + T([150, 70], 'a', 'tx h') + T([96, 80], 'b sinA', 'tx s sm') + T([50, 140], 'b cosA', 'tx c sm') + T([140, 140], 'c − b cosA', 'tx t sm'));
    }
  };
})();
