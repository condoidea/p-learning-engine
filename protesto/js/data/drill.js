/* =========================================================
 * 証言台ドリル — くらべる証言を、その場で作る（毎回ちがう問題）
 *
 *  PQ.drill.make(forms) → { chart, es, ja, ok, fix }
 *    chart：ボードの棒グラフ（{ title, unit, bars:[{ e, n, v }] }）
 *    es：証言（スペイン語）、ja：その訳、ok：グラフどおりなら true（ウソなら false）
 *    fix：ウソのとき、グラフどおりに直した証言
 *  forms：使ってよい形（クリアした事件の文法）。'mas' 'tan' 'irr' 'tanto' 'sup' 'masde'
 *  ここに出る語は、すべて shared/es-words.js にあること（tests/check-protesto.js が確かめる）
 * ========================================================= */
(function () {
  'use strict';
  /* f＝女性名詞か */
  var ANIMALS = [
    { es: 'oso', ja: 'クマ', e: '🐻' }, { es: 'jirafa', ja: 'キリン', e: '🦒', f: 1 }, { es: 'conejo', ja: 'ウサギ', e: '🐰' },
    { es: 'tortuga', ja: 'カメ', e: '🐢', f: 1 }, { es: 'elefante', ja: 'ゾウ', e: '🐘' }, { es: 'ardilla', ja: 'リス', e: '🐿', f: 1 },
    { es: 'caballo', ja: 'ウマ', e: '🐴' }, { es: 'rana', ja: 'カエル', e: '🐸', f: 1 }, { es: 'ratón', ja: 'ネズミ', e: '🐭' },
    { es: 'vaca', ja: 'ウシ', e: '🐮', f: 1 }, { es: 'cerdo', ja: 'ブタ', e: '🐷' }, { es: 'mono', ja: 'サル', e: '🐵' },
    { es: 'lobo', ja: 'オオカミ', e: '🐺' }, { es: 'oveja', ja: 'ヒツジ', e: '🐑', f: 1 }
  ];
  /* くらべるもの：up＝値が大きいほうの形容詞、dn＝小さいほう */
  var ATTRS = [
    { title: '背の高さ', unit: 'cm', up: ['alto', 'alta', '背が高い'], dn: ['bajo', 'baja', '背が低い'], lo: 20, hi: 400, step: 10 },
    { title: '速さ', unit: 'km/h', up: ['rápido', 'rápida', '速い'], dn: ['lento', 'lenta', '遅い'], lo: 5, hi: 70, step: 5 },
    { title: '重さ', unit: 'kg', up: ['pesado', 'pesada', '重い'], dn: ['ligero', 'ligera', '軽い'], lo: 10, hi: 900, step: 10 }
  ];

  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(a) { return a[rnd(a.length)]; }
  function two(a) { var i = rnd(a.length), j = rnd(a.length - 1); if (j >= i) j++; return [a[i], a[j]]; }
  function three(a) { var s = a.slice().sort(function () { return Math.random() - 0.5; }); return s.slice(0, 3); }
  function val(at) { return at.lo + rnd(Math.floor((at.hi - at.lo) / at.step) + 1) * at.step; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function the(a) { return (a.f ? 'la ' : 'el ') + a.es; }          // la jirafa
  function deThe(a) { return a.f ? 'de la ' + a.es : 'del ' + a.es; } // del oso
  function adj(pair, a) { return a.f ? pair[1] : pair[0]; }
  function bars(at, list, vals) { return { title: at.title, unit: at.unit, bars: list.map(function (a, i) { return { e: a.e, n: a.ja, v: vals[i] }; }) }; }
  /* 本当の文とウソの文を1つずつ作り、どちらかを出す */
  function out(chart, t, f) { var ok = Math.random() < 0.5; return { chart: chart, es: ok ? t.es : f.es, ja: ok ? t.ja : f.ja, ok: ok, fix: t.es, fixJa: t.ja }; }

  var MAKE = {
    /* más / menos ＋ 形容詞 ＋ que */
    mas: function () {
      var at = pick(ATTRS), p = two(ANIMALS), va = val(at), vb = val(at);
      while (vb === va) vb = val(at);
      var A = p[0], B = p[1], aBig = va > vb;
      var word = pick(['más', 'menos']), side = pick(['up', 'dn']);
      /* A が「より …」かどうか：up の形容詞なら A が大きいとき、dn なら小さいとき。menos なら反対 */
      var truthUp = side === 'up' ? aBig : !aBig;
      var isTrue = word === 'más' ? truthUp : !truthUp;
      var other = word === 'más' ? 'menos' : 'más';
      function s(w) { return { es: cap(the(A)) + ' es ' + w + ' ' + adj(at[side], A) + ' que ' + the(B) + '.', ja: A.ja + 'は' + B.ja + (w === 'más' ? 'より' + at[side][2] : 'ほど' + at[side][2].replace(/い$/, 'くない')) + '。' }; }
      var t = isTrue ? s(word) : s(other), f = isTrue ? s(other) : s(word);
      return out(bars(at, [A, B], [va, vb]), t, f);
    },
    /* tan ＋ 形容詞 ＋ como（同じ） / no tan ＋ 形容詞 ＋ como */
    tan: function () {
      var at = pick(ATTRS), p = two(ANIMALS), A = p[0], B = p[1], same = Math.random() < 0.5;
      var va = val(at), vb = same ? va : val(at);
      while (!same && vb === va) vb = val(at);
      var eq = { es: cap(the(A)) + ' es tan ' + adj(at.up, A) + ' como ' + the(B) + '.', ja: A.ja + 'は' + B.ja + 'と同じくらい' + at.up[2] + '。' };
      if (same) {
        var neq = { es: cap(the(A)) + ' es más ' + adj(at.up, A) + ' que ' + the(B) + '.', ja: A.ja + 'は' + B.ja + 'より' + at.up[2] + '。' };
        return out(bars(at, [A, B], [va, vb]), eq, neq);
      }
      /* ちがう値：「no tan … como」が本当になる向きで作る */
      if (va > vb) { var t0 = va; va = vb; vb = t0; }
      var notTan = { es: cap(the(A)) + ' no es tan ' + adj(at.up, A) + ' como ' + the(B) + '.', ja: A.ja + 'は' + B.ja + 'ほど' + at.up[2].replace(/い$/, 'くない') + '。' };
      return out(bars(at, [A, B], [va, vb]), notTan, eq);
    },
    /* mayor / menor（年齢）・mejor / peor（パンの点数） */
    irr: function () {
      var p = two(ANIMALS), A = p[0], B = p[1];
      if (Math.random() < 0.5) {
        var va = 2 + rnd(30), vb = 2 + rnd(30); while (vb === va) vb = 2 + rnd(30);
        var w = pick(['mayor', 'menor']), isTrue = (w === 'mayor') === (va > vb), o = w === 'mayor' ? 'menor' : 'mayor';
        var s = function (x) { return { es: cap(the(A)) + ' es ' + x + ' que ' + the(B) + '.', ja: A.ja + 'は' + B.ja + 'より' + (x === 'mayor' ? '年上' : '年下') + '。' }; };
        return out({ title: '年齢', unit: '歳', bars: [{ e: A.e, n: A.ja, v: va }, { e: B.e, n: B.ja, v: vb }] }, isTrue ? s(w) : s(o), isTrue ? s(o) : s(w));
      }
      var pa = 1 + rnd(10), pb = 1 + rnd(10); while (pb === pa) pb = 1 + rnd(10);
      var w2 = pick(['mejor', 'peor']), ok2 = (w2 === 'mejor') === (pa > pb), o2 = w2 === 'mejor' ? 'peor' : 'mejor';
      var s2 = function (x) { return { es: 'El pan ' + deThe(A) + ' es ' + x + ' que el pan ' + deThe(B) + '.', ja: A.ja + 'のパンは' + B.ja + 'のパンより' + (x === 'mejor' ? 'おいしい（よい）' : 'まずい（悪い）') + '。' }; };
      return out({ title: 'パンの点数', unit: '点', bars: [{ e: A.e, n: A.ja, v: pa }, { e: B.e, n: B.ja, v: pb }] }, ok2 ? s2(w2) : s2(o2), ok2 ? s2(o2) : s2(w2));
    },
    /* tantas manzanas como */
    tanto: function () {
      var p = two(ANIMALS), A = p[0], B = p[1], same = Math.random() < 0.5;
      var va = 1 + rnd(12), vb = same ? va : 1 + rnd(12); while (!same && vb === va) vb = 1 + rnd(12);
      var eq = { es: cap(the(A)) + ' tiene tantas manzanas como ' + the(B) + '.', ja: A.ja + 'は' + B.ja + 'と同じ数のりんごを持っている。' };
      var mas = function (w) { return { es: cap(the(A)) + ' tiene ' + w + ' manzanas que ' + the(B) + '.', ja: A.ja + 'は' + B.ja + 'より' + (w === 'más' ? '多くの' : '少ない') + 'りんごを持っている。' }; };
      var chart = { title: 'りんごの数', unit: '個', bars: [{ e: A.e, n: A.ja, v: va }, { e: B.e, n: B.ja, v: vb }] };
      if (same) return out(chart, eq, mas(pick(['más', 'menos'])));
      return out(chart, mas(va > vb ? 'más' : 'menos'), eq);
    },
    /* el / la más ＋ 形容詞 ＋ de los tres */
    sup: function () {
      var at = pick(ATTRS), L = three(ANIMALS), v = [val(at), val(at), val(at)];
      while (v[0] === v[1] || v[1] === v[2] || v[0] === v[2]) v = [val(at), val(at), val(at)];
      var side = pick(['up', 'dn']), best = 0;
      v.forEach(function (x, i) { if (side === 'up' ? x > v[best] : x < v[best]) best = i; });
      var wrong = (best + 1 + rnd(2)) % 3;
      var grp = L.every(function (a) { return a.f; }) ? 'las tres' : 'los tres';
      var s = function (a) { return { es: cap(the(a)) + ' es ' + (a.f ? 'la' : 'el') + ' más ' + adj(at[side], a) + ' de ' + grp + '.', ja: a.ja + 'が3匹の中でいちばん' + at[side][2] + '。' }; };
      return out(bars(at, L, v), s(L[best]), s(L[wrong]));
    },
    /* más de ＋ 数 */
    masde: function () {
      var A = pick(ANIMALS), n = 5 + rnd(16), line = (2 + rnd(4)) * 5;
      while (n === line) n = 5 + rnd(16);
      var w = pick(['más', 'menos']), isTrue = (w === 'más') === (n > line), o = w === 'más' ? 'menos' : 'más';
      var s = function (x) { return { es: cap(the(A)) + ' tiene ' + x + ' de ' + line + ' manzanas.', ja: A.ja + 'は' + line + '個' + (x === 'más' ? 'より多い' : 'より少ない') + 'りんごを持っている。' }; };
      return out({ title: 'りんごの数', unit: '個', bars: [{ e: A.e, n: A.ja, v: n }, { e: '📏', n: line + '個のライン', v: line }] }, isTrue ? s(w) : s(o), isTrue ? s(o) : s(w));
    }
  };

  window.PQ.drill = {
    /* 事件 → その事件で習う形 */
    forms: { c1: 'mas', c2: 'tan', c3: 'irr', c4: 'tanto', c5: 'sup', c6: 'masde' },
    make: function (forms) { return MAKE[pick(forms)](); },
    /* チェック用：語をすべて出す */
    words: function () {
      var w = [];
      ANIMALS.forEach(function (a) { w.push(a.es); });
      ATTRS.forEach(function (a) { w.push(a.up[0], a.up[1], a.dn[0], a.dn[1]); });
      return w.concat(['el', 'la', 'del', 'de', 'es', 'más', 'menos', 'que', 'tan', 'como', 'no', 'mayor', 'menor', 'mejor', 'peor', 'pan',
        'tiene', 'tantas', 'manzanas', 'los', 'las', 'tres']);
    }
  };
})();
