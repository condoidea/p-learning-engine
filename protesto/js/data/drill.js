/* =========================================================
 * 証言台ドリル — くらべる証言を、その場で作る（毎回ちがう問題）
 *
 *  PQ.drill.fill(form) → 穴埋め問題 { kind:'fill', form, chart, es（___ を1つ含む）, o, a, full, ja, why }
 *  PQ.drill.make(forms) → { form, chart, es, ja, ok, fix }
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

  /* ---------- 穴埋め：形を自分で選ぶ ---------- */
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function distinctVals(at) { var a = val(at), b = val(at); while (b === a) b = val(at); return [a, b]; }
  /* グラフの事実（why の最初に置く） */
  function fact(A, B, va, vb, unit) { return 'グラフで' + A.ja + 'は ' + va + unit + '、' + B.ja + 'は ' + vb + unit; }
  function neg(j) { return j.replace(/い$/, 'くない'); }
  /* A は B より／ほど …（más／menos） */
  function cj(A, B, w, j) { return A.ja + 'は' + B.ja + (w === 'más' ? 'より' + j : 'ほど' + neg(j)) + '。'; }
  /* 問題をまとめる：correct を含む choices をシャッフルして a を決める */
  function mk(form, chart, esTxt, choices, correct, why, jaTxt) {
    var o = shuf(choices);
    return { kind: 'fill', form: form, chart: chart, es: esTxt, o: o, a: o.indexOf(correct), full: esTxt.replace('___', correct), ja: jaTxt, why: why };
  }
  var NOUNS = [
    { es: 'manzanas', f: 1, pl: 1, ja: 'りんご', title: 'りんごの数', unit: '個' }, { es: 'libros', f: 0, pl: 1, ja: '本', title: '本の数', unit: '冊' },
    { es: 'dinero', f: 0, pl: 0, ja: 'お金', title: 'お金の量', unit: '€' }, { es: 'agua', f: 1, pl: 0, ja: '水', title: '水の量', unit: 'L' }
  ];
  function tantForm(n) { return 'tant' + (n.f ? 'a' : 'o') + (n.pl ? 's' : ''); }
  function nounDesc(n) { return (n.f ? '女性' : '男性') + (n.pl ? '・複数' : '・単数'); }

  var FILL = {
    mas: function () {
      var at = pick(ATTRS), p = two(ANIMALS), A = p[0], B = p[1], v = distinctVals(at), va = v[0], vb = v[1], aBig = va > vb, ch = bars(at, [A, B], [va, vb]);
      if (Math.random() < 0.5) {
        var side = pick(['up', 'dn']), more = side === 'up' ? aBig : !aBig, w = more ? 'más' : 'menos', j = at[side][2];
        return mk('mas', ch, cap(the(A)) + ' es ___ ' + adj(at[side], A) + ' que ' + the(B) + '.', ['más', 'menos'], w,
          fact(A, B, va, vb, at.unit) + ' → ' + cj(A, B, w, j) + 'だから ' + w + '。', cj(A, B, w, j));
      }
      var s2 = aBig ? 'up' : 'dn', ad = adj(at[s2], A);
      return mk('mas', ch, cap(the(A)) + ' es más ___ que ' + the(B) + '.', [at[s2][0], at[s2][1], at[s2][0] + 's'], ad,
        fact(A, B, va, vb, at.unit) + ' → ' + cj(A, B, 'más', at[s2][2]) + '主語の ' + the(A) + ' は' + (A.f ? '女性' : '男性') + '・1匹 → 形容詞も' + (A.f ? '女性' : '男性') + '・単数の ' + ad + '。',
        cj(A, B, 'más', at[s2][2]));
    },
    tan: function () {
      var at = pick(ATTRS), p = two(ANIMALS), A = p[0], B = p[1], va = val(at), ad = adj(at.up, A), k = rnd(3);
      if (k === 2) {
        var v = distinctVals(at), lo = Math.min(v[0], v[1]), hi = Math.max(v[0], v[1]);
        return mk('tan', bars(at, [A, B], [lo, hi]), cap(the(A)) + ' ___ tan ' + ad + ' como ' + the(B) + '.', ['no es', 'es'], 'no es',
          fact(A, B, lo, hi, at.unit) + ' → ' + A.ja + 'のほうが小さくて、同じではない。だから打ち消して no es。', cj(A, B, 'menos', at.up[2]));
      }
      var ch = bars(at, [A, B], [va, va]), jaEq = A.ja + 'は' + B.ja + 'と同じくらい' + at.up[2] + '。';
      if (k === 0) {
        return mk('tan', ch, cap(the(A)) + ' es ___ ' + ad + ' como ' + the(B) + '.', ['tan', 'más', 'menos'], 'tan',
          fact(A, B, va, va, at.unit) + ' → 同じ値だから「同じくらい」。だから tan。', jaEq);
      }
      return mk('tan', ch, cap(the(A)) + ' es tan ' + ad + ' ___ ' + the(B) + '.', ['como', 'que', 'de'], 'como',
        fact(A, B, va, va, at.unit) + ' → 「同じくらい」は tan 〜 como…。que は más・menos の相手の前に使う。だから como。', jaEq);
    },
    irr: function () {
      var p = two(ANIMALS), A = p[0], B = p[1];
      if (Math.random() < 0.5) {
        var va = 2 + rnd(30), vb = 2 + rnd(30); while (vb === va) vb = 2 + rnd(30);
        var w = va > vb ? 'mayor' : 'menor';
        return mk('irr', { title: '年齢', unit: '歳', bars: [{ e: A.e, n: A.ja, v: va }, { e: B.e, n: B.ja, v: vb }] }, cap(the(A)) + ' es ___ que ' + the(B) + '.', ['mayor', 'menor', 'más grande'], w,
          fact(A, B, va, vb, '歳') + ' → ' + A.ja + 'のほうが' + (w === 'mayor' ? '年上' : '年下') + '。年れいの「上」「下」は特別な形の ' + w + '（más grande ではない）。',
          A.ja + 'は' + B.ja + 'より' + (w === 'mayor' ? '年上' : '年下') + '。');
      }
      var pa = 1 + rnd(10), pb = 1 + rnd(10); while (pb === pa) pb = 1 + rnd(10);
      var w2 = pa > pb ? 'mejor' : 'peor';
      return mk('irr', { title: 'パンの点数', unit: '点', bars: [{ e: A.e, n: A.ja, v: pa }, { e: B.e, n: B.ja, v: pb }] }, 'El pan ' + deThe(A) + ' es ___ que el pan ' + deThe(B) + '.', ['mejor', 'peor', 'más bueno'], w2,
        fact(A, B, pa, pb, '点') + ' → ' + A.ja + 'のパンのほうが' + (w2 === 'mejor' ? 'よい' : '悪い') + '。「よい」「悪い」の比べる形は特別な ' + w2 + '（más bueno ではない）。',
        A.ja + 'のパンは' + B.ja + 'のパンより' + (w2 === 'mejor' ? 'おいしい（よい）' : 'まずい（悪い）') + '。');
    },
    tanto: function () {
      var p = two(ANIMALS), A = p[0], B = p[1];
      if (Math.random() < 0.5) {
        var n = pick(NOUNS), c = tantForm(n), all = ['tanto', 'tanta', 'tantos', 'tantas'], other = pick(all.filter(function (x) { return x !== c; })), v = 1 + rnd(12);
        return mk('tanto', { title: n.title, unit: n.unit, bars: [{ e: A.e, n: A.ja, v: v }, { e: B.e, n: B.ja, v: v }] }, cap(the(A)) + ' tiene ___ ' + n.es + ' como ' + the(B) + '.', [c, other, 'tan'], c,
          'グラフで' + A.ja + 'も' + B.ja + 'も ' + v + n.unit + ' → 同じ数。名詞の前では tanto の仲間で、名詞に合わせて形が変わる。' + n.es + ' は' + nounDesc(n) + 'だから ' + c + '。',
          A.ja + 'は' + B.ja + 'と同じだけの' + n.ja + 'を持っている。');
      }
      var at = pick(ATTRS), va = val(at);
      return mk('tanto', bars(at, [A, B], [va, va]), cap(the(A)) + ' es ___ ' + adj(at.up, A) + ' como ' + the(B) + '.', ['tan', 'tanto', 'tantos'], 'tan',
        fact(A, B, va, va, at.unit) + ' → 同じ値。' + adj(at.up, A) + ' は形容詞で、形容詞の前は形が変わらない tan（tanto の仲間は名詞の前）。',
        A.ja + 'は' + B.ja + 'と同じくらい' + at.up[2] + '。');
    },
    sup: function () {
      var at = pick(ATTRS), L, v = [0, 0, 0];
      do { L = three(ANIMALS); } while (L.every(function (a) { return a.f; }));
      while (v[0] === v[1] || v[1] === v[2] || v[0] === v[2]) v = [val(at), val(at), val(at)];
      var side = pick(['up', 'dn']), best = 0;
      v.forEach(function (x, i) { if (side === 'up' ? x > v[best] : x < v[best]) best = i; });
      var A = L[best], ch = bars(at, L, v), j = at[side][2];
      if (Math.random() < 0.5) {
        var art = A.f ? 'la' : 'el';
        return mk('sup', ch, cap(the(A)) + ' es ___ más ' + adj(at[side], A) + ' de los tres.', ['el', 'la', 'los'], art,
          'グラフで' + A.ja + 'が3匹の中でいちばん' + j + ' → 「いちばん」は 冠詞＋más＋形容詞。' + the(A) + ' は' + (A.f ? '女性' : '男性') + '・1匹だから ' + art + '。', A.ja + 'が3匹の中でいちばん' + j + '。');
      }
      return mk('sup', ch, cap(the(A)) + ' es ' + (A.f ? 'la' : 'el') + ' más ' + adj(at[side], A) + ' ___ los tres.', ['de', 'en', 'que'], 'de',
        'グラフで' + A.ja + 'が3匹の中でいちばん' + j + ' → que は比べる相手1つの前。「3匹の中で」と仲間の範囲を言うときは de。', A.ja + 'が3匹の中でいちばん' + j + '。');
    },
    masde: function () {
      if (Math.random() < 0.5) {
        var A = pick(ANIMALS), n = 5 + rnd(16), line = (2 + rnd(4)) * 5; while (n === line) n = 5 + rnd(16);
        var w = n > line ? 'más' : 'menos';
        return mk('masde', { title: 'りんごの数', unit: '個', bars: [{ e: A.e, n: A.ja, v: n }, { e: '📏', n: line + '個のライン', v: line }] }, cap(the(A)) + ' tiene ' + w + ' ___ ' + line + ' manzanas.', ['de', 'que'], 'de',
          'グラフで' + A.ja + 'は ' + n + '個、ラインは ' + line + '個 → ' + line + '個を境に' + (w === 'más' ? '多い' : '少ない') + '。数の前の「〜より」は de。',
          A.ja + 'は' + line + '個' + (w === 'más' ? 'より多い' : 'より少ない') + 'りんごを持っている。');
      }
      var at = pick(ATTRS), p = two(ANIMALS), X = p[0], Y = p[1], v2 = distinctVals(at), side = v2[0] > v2[1] ? 'up' : 'dn';
      return mk('masde', bars(at, [X, Y], v2), cap(the(X)) + ' es más ' + adj(at[side], X) + ' ___ ' + the(Y) + '.', ['que', 'de'], 'que',
        fact(X, Y, v2[0], v2[1], at.unit) + ' → ' + Y.ja + 'という相手とくらべている。もの・人の前の「〜より」は que（de は数の前）。', cj(X, Y, 'más', at[side][2]));
    }
  };

  window.PQ.drill = {
    /* 事件 → その事件で習う形 */
    forms: { c1: 'mas', c2: 'tan', c3: 'irr', c4: 'tanto', c5: 'sup', c6: 'masde' },
    make: function (forms) { var f = pick(forms), q = MAKE[f](); q.form = f; return q; },
    /* 穴埋め：{ kind:'fill', form, chart, es（___ を1つ含む）, o, a, full, ja, why } */
    fill: function (form) { return FILL[form](); },
    /* チェック用：語をすべて出す */
    words: function () {
      var w = [];
      ANIMALS.forEach(function (a) { w.push(a.es); });
      ATTRS.forEach(function (a) { w.push(a.up[0], a.up[1], a.dn[0], a.dn[1]); });
      return w.concat(['el', 'la', 'del', 'de', 'es', 'más', 'menos', 'que', 'tan', 'como', 'no', 'mayor', 'menor', 'mejor', 'peor', 'pan',
        'tiene', 'tantas', 'manzanas', 'los', 'las', 'tres',
        'libros', 'dinero', 'agua', 'grande', 'bueno', 'en', 'tanto', 'tanta', 'tantos'])
        .concat(ATTRS.reduce(function (r, a) { return r.concat([a.up[0] + 's', a.dn[0] + 's']); }, []));
    }
  };
})();
