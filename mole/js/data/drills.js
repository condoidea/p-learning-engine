/* =========================================================
 * 数字が毎回変わる計算（早押し・抜き打ち・みがく で出る）
 *  どれも { q, num（答え）, unit, steps（解き方を1手ずつ）, hint } を返す
 *  数字は、答えがきれいになる組み合わせだけを使う
 * ========================================================= */
(function () {
  'use strict';
  var pick = M.pick;
  var T = M.numText;
  function f1(x) { return (Math.round(x * 10) / 10).toFixed(1); }   // 2.0 のように小数第1位まで
  function fx(x) { return T(x); }

  /* 物質（モル質量）。gas＝気体（22.4 L が使える） */
  var SUBS = [
    { f: 'H_2O', name: '水', M: 18, aw: 'H＝1.0、O＝16' },
    { f: 'CO_2', name: '二酸化炭素', M: 44, aw: 'C＝12、O＝16', gas: true },
    { f: 'O_2', name: '酸素', M: 32, aw: 'O＝16', gas: true },
    { f: 'N_2', name: '窒素', M: 28, aw: 'N＝14', gas: true },
    { f: 'H_2', name: '水素', M: 2, aw: 'H＝1.0', gas: true },
    { f: 'CH_4', name: 'メタン', M: 16, aw: 'C＝12、H＝1.0', gas: true },
    { f: 'NH_3', name: 'アンモニア', M: 17, aw: 'N＝14、H＝1.0', gas: true },
    { f: 'NaCl', name: '塩化ナトリウム', M: 58.5, aw: 'Na＝23、Cl＝35.5' },
    { f: 'C', name: '炭素', M: 12, aw: 'C＝12' },
    { f: 'Al', name: 'アルミニウム', M: 27, aw: 'Al＝27' }
  ];
  var GAS = SUBS.filter(function (s) { return s.gas; });
  var MOLS = [0.10, 0.20, 0.25, 0.50, 2.0, 3.0];
  /* 0.10・0.25・0.050・2.0 のように、有効数字2けたで */
  function nice(n) { return n === 0.05 ? '0.050' : n < 1 ? n.toFixed(2) : f1(n); }
  /* 質量が小数第1位までになる mol だけ（58.5×0.25 のような半端を出さない） */
  function pickMol(s, list) { return pick((list || MOLS).filter(function (n) { return Math.abs(Math.round(s.M * n * 10) - s.M * n * 10) < 1e-6; })); }
  function mass(s, n) { var g = s.M * n; return Math.round(g * 100) / 100; }
  /* 質量の表示：10 g 未満の整数は 2.0 のように */
  function gT(g) { return g < 10 && Math.abs(g * 10 - Math.round(g * 10)) < 1e-9 ? g.toFixed(1) : String(g); }
  function Lt(mL) { return (mL / 1000).toFixed(3); }
  function Mtxt(s) { return s.M === 2 ? '2.0' : String(s.M); }

  /* 分子量の内訳 */
  var MW = [
    { f: 'H_2O', parts: [['H', 1.0, 2], ['O', 16, 1]] },
    { f: 'CO_2', parts: [['C', 12, 1], ['O', 16, 2]] },
    { f: 'NH_3', parts: [['N', 14, 1], ['H', 1.0, 3]] },
    { f: 'CH_4', parts: [['C', 12, 1], ['H', 1.0, 4]] },
    { f: 'O_2', parts: [['O', 16, 2]] },
    { f: 'N_2', parts: [['N', 14, 2]] },
    { f: 'NaCl', parts: [['Na', 23, 1], ['Cl', 35.5, 1]], ion: true },
    { f: 'HCl', parts: [['H', 1.0, 1], ['Cl', 35.5, 1]] },
    { f: 'C_2H_6O', parts: [['C', 12, 2], ['H', 1.0, 6], ['O', 16, 1]], name: 'エタノール' },
    { f: 'H_2SO_4', parts: [['H', 1.0, 2], ['S', 32, 1], ['O', 16, 4]], name: '硫酸' }
  ];
  function awTxt(v) { return v === 1 ? '1.0' : String(v); }

  /* 2段階の計算を、まちがえたときに1段階ずつ解く問題（parts） */
  function part(q, ans, unit, hint, step) { return { num: q, ans: ans, unit: unit, hint: hint, steps: [step] }; }

  var GEN = {
    powMul: function () {
      var a = pick([1.5, 2.0, 3.0, 4.0]), b = pick([2.0, 3.0, 4.0]), m = pick([2, 3, 20, 23]), n = pick([1, 2, 3, 4]);
      var front = a * b, e = m + n, carry = front >= 10;
      var ans = front * Math.pow(10, e);
      return { q: '(' + f1(a) + '×10^' + m + ')×(' + f1(b) + '×10^' + n + ') ＝ ？', num: ans,
        hint: '前どうしをかけて、肩どうしをたす。',
        steps: ['前の数は ' + f1(a) + '×' + f1(b) + '＝' + (carry ? String(front) : f1(front)), '肩の数は ' + m + '＋' + n + '＝' + e,
          carry ? front + '×10^' + e + ' ＝ ' + f1(front / 10) + '×10^' + (e + 1) + '（前を ÷10、肩を ＋1）' : '答えは ' + f1(front) + '×10^' + e] };
    },
    powDiv: function () {
      var p = pick([[6.0, 2.0], [9.0, 3.0], [8.0, 4.0], [3.0, 6.0], [1.2, 6.0], [1.8, 6.0]]), m = pick([23, 24, 25]), n = 23;
      var front = p[0] / p[1], e = m - n, ans = front * Math.pow(10, e);
      return { q: '(' + f1(p[0]) + '×10^' + m + ')÷(' + f1(p[1]) + '×10^' + n + ') ＝ ？', num: ans,
        hint: '前どうしをわって、肩どうしをひく。',
        steps: ['前の数は ' + f1(p[0]) + '÷' + f1(p[1]) + '＝' + (Math.round(front * 100) / 100), '肩の数は ' + m + '−' + n + '＝' + e,
          '答えは ' + fx(ans)] };
    },
    mw: function () {
      var c = pick(MW), sum = 0, aw = [], st = [];
      c.parts.forEach(function (p) { sum += p[1] * p[2]; if (aw.indexOf(p[0] + '＝' + awTxt(p[1])) < 0) aw.push(p[0] + '＝' + awTxt(p[1])); st.push(p[0] + ' ' + p[2] + '個で ' + (p[2] > 1 ? awTxt(p[1]) + '×' + p[2] + '＝' + (p[1] * p[2]) : awTxt(p[1]))); });
      sum = Math.round(sum * 10) / 10;
      st.push('合計は ' + sum);
      return { q: (c.name ? c.name + ' ' : '') + c.f + ' の' + (c.ion ? '式量' : '分子量') + 'は？（' + aw.join('、') + '）', num: sum,
        hint: '右下の数字の個数ぶん、原子量をたす。', steps: st };
    },
    mol2n: function () {
      var n = pick([0.10, 0.20, 0.50, 1.5, 2.0, 3.0]), s = pick(SUBS.slice(0, 7));
      var ans = n * 6.0e23;
      return { q: s.name + ' ' + s.f + ' ' + nice(n) + ' mol は、分子何個？', num: ans, unit: '個',
        hint: 'mol から個数を求めるときは、6.0×10^23 をかける。',
        steps: ['【mol から個数を求める】6.0×10^23 をかける', nice(n) + '×6.0×10^23', '答えは ' + fx(ans) + ' 個'] };
    },
    n2mol: function () {
      var n = pick([0.10, 0.20, 0.50, 2.0, 3.0]), cnt = n * 6.0e23;
      return { q: '鉄原子 ' + fx(cnt) + ' 個は何 mol？', num: n, unit: 'mol',
        hint: '個数から mol を求めるときは、6.0×10^23 でわる。',
        steps: ['【個数から mol を求める】6.0×10^23 でわる', '(' + fx(cnt) + ')÷(6.0×10^23)', '答えは ' + nice(n) + ' mol'] };
    },
    g2mol: function () {
      var s = pick(SUBS), n = pickMol(s), g = mass(s, n);
      return { q: s.name + ' ' + s.f + ' ' + gT(g) + ' g は何 mol？（' + s.f + '＝' + Mtxt(s) + '）', num: n, unit: 'mol',
        hint: '質量から mol を求めるときは、モル質量でわる。',
        steps: ['モル質量は ' + Mtxt(s) + ' g/mol', '【質量から mol を求める】' + gT(g) + '÷' + Mtxt(s) + '＝' + nice(n) + ' mol'] };
    },
    mol2g: function () {
      var s = pick(SUBS), n = pickMol(s), g = mass(s, n);
      return { q: s.name + ' ' + s.f + ' ' + nice(n) + ' mol は何 g？（' + s.f + '＝' + Mtxt(s) + '）', num: g, unit: 'g',
        hint: 'mol から質量を求めるときは、モル質量をかける。',
        steps: ['モル質量は ' + Mtxt(s) + ' g/mol', '【mol から質量を求める】' + Mtxt(s) + '×' + nice(n) + '＝' + gT(g) + ' g'] };
    },
    L2mol: function () {
      var s = pick(GAS), n = pick([0.10, 0.25, 0.50, 2.0, 3.0]), v = Math.round(22.4 * n * 100) / 100;
      return { q: '標準状態で ' + v + ' L の' + s.name + ' ' + s.f + ' は何 mol？', num: n, unit: 'mol',
        hint: '体積から mol を求めるときは、22.4 でわる。',
        steps: ['【体積から mol を求める】22.4 でわる', v + '÷22.4＝' + nice(n) + ' mol'] };
    },
    mol2L: function () {
      var s = pick(GAS), n = pick([0.10, 0.25, 0.50, 2.0, 3.0]), v = Math.round(22.4 * n * 100) / 100;
      return { q: '標準状態で、' + s.name + ' ' + s.f + ' ' + nice(n) + ' mol は何 L？', num: v, unit: 'L',
        hint: 'mol から体積を求めるときは、22.4 をかける。',
        steps: ['【mol から体積を求める】22.4 をかける', '22.4×' + nice(n) + '＝' + v + ' L'] };
    },
    g2n: function () {
      var s = pick(SUBS.slice(0, 7)), n = pickMol(s, [0.10, 0.20, 0.50, 2.0]), g = mass(s, n), cnt = n * 6.0e23;
      return { q: s.name + ' ' + s.f + ' ' + gT(g) + ' g には、分子が何個ある？（' + s.f + '＝' + Mtxt(s) + '）', num: cnt, unit: '個',
        hint: 'まず質量から mol を求めて（わる）、次に mol から個数を求める（かける）。',
        steps: ['【質量から mol を求める】' + gT(g) + '÷' + Mtxt(s) + '＝' + nice(n) + ' mol', '【mol から個数を求める】' + nice(n) + '×6.0×10^23＝' + fx(cnt) + ' 個'],
        parts: [part('1段階め。' + s.f + ' ' + gT(g) + ' g は何 mol？（' + s.f + '＝' + Mtxt(s) + '）', n, 'mol', '質量から mol を求めるときは、モル質量でわる。', gT(g) + '÷' + Mtxt(s) + '＝' + nice(n) + ' mol'),
          part('2段階め。' + nice(n) + ' mol は、分子何個？', cnt, '個', 'mol から個数を求めるときは、6.0×10^23 をかける。', nice(n) + '×6.0×10^23＝' + fx(cnt) + ' 個')] };
    },
    L2g: function () {
      var s = pick(GAS), n = pickMol(s, [0.10, 0.25, 0.50, 2.0]), v = Math.round(22.4 * n * 100) / 100, g = mass(s, n);
      return { q: '標準状態で ' + v + ' L の' + s.name + ' ' + s.f + ' は何 g？（' + s.f + '＝' + Mtxt(s) + '）', num: g, unit: 'g',
        hint: 'まず体積から mol を求めて（22.4 でわる）、次に mol から質量を求める（モル質量をかける）。',
        steps: ['【体積から mol を求める】' + v + '÷22.4＝' + nice(n) + ' mol', '【mol から質量を求める】' + Mtxt(s) + '×' + nice(n) + '＝' + gT(g) + ' g'],
        parts: [part('1段階め。標準状態で ' + v + ' L の ' + s.f + ' は何 mol？', n, 'mol', '体積から mol を求めるときは、22.4 でわる。', v + '÷22.4＝' + nice(n) + ' mol'),
          part('2段階め。' + s.f + ' ' + nice(n) + ' mol は何 g？（' + s.f + '＝' + Mtxt(s) + '）', g, 'g', 'mol から質量を求めるときは、モル質量をかける。', Mtxt(s) + '×' + nice(n) + '＝' + gT(g) + ' g')] };
    },
    n2L: function () {
      var s = pick(GAS), n = pick([0.10, 0.50, 2.0, 3.0]), cnt = n * 6.0e23, v = Math.round(22.4 * n * 100) / 100;
      return { q: s.name + ' ' + s.f + ' の分子 ' + fx(cnt) + ' 個は、標準状態で何 L？', num: v, unit: 'L',
        hint: 'まず個数から mol を求めて（6.0×10^23 でわる）、次に mol から体積を求める（22.4 をかける）。',
        steps: ['【個数から mol を求める】(' + fx(cnt) + ')÷(6.0×10^23)＝' + nice(n) + ' mol', '【mol から体積を求める】22.4×' + nice(n) + '＝' + v + ' L'],
        parts: [part('1段階め。分子 ' + fx(cnt) + ' 個は何 mol？', n, 'mol', '個数から mol を求めるときは、6.0×10^23 でわる。', '(' + fx(cnt) + ')÷(6.0×10^23)＝' + nice(n) + ' mol'),
          part('2段階め。標準状態で ' + nice(n) + ' mol の気体は何 L？', v, 'L', 'mol から体積を求めるときは、22.4 をかける。', '22.4×' + nice(n) + '＝' + v + ' L')] };
    },
    g2L: function () {
      var s = pick(GAS), n = pickMol(s, [0.10, 0.25, 0.50, 2.0]), g = mass(s, n), v = Math.round(22.4 * n * 100) / 100;
      return { q: s.name + ' ' + s.f + ' ' + gT(g) + ' g は、標準状態で何 L？（' + s.f + '＝' + Mtxt(s) + '）', num: v, unit: 'L',
        hint: 'まず質量から mol を求めて（わる）、次に mol から体積を求める（22.4 をかける）。',
        steps: ['【質量から mol を求める】' + gT(g) + '÷' + Mtxt(s) + '＝' + nice(n) + ' mol', '【mol から体積を求める】22.4×' + nice(n) + '＝' + v + ' L'],
        parts: [part('1段階め。' + s.f + ' ' + gT(g) + ' g は何 mol？（' + s.f + '＝' + Mtxt(s) + '）', n, 'mol', '質量から mol を求めるときは、モル質量でわる。', gT(g) + '÷' + Mtxt(s) + '＝' + nice(n) + ' mol'),
          part('2段階め。標準状態で ' + nice(n) + ' mol の気体は何 L？', v, 'L', 'mol から体積を求めるときは、22.4 をかける。', '22.4×' + nice(n) + '＝' + v + ' L')] };
    },
    /* 溶液（追加レッスン） */
    molar: function () {
      var n = pick([0.10, 0.20, 0.050]), mL = pick([200, 250, 500]), c = Math.round(n / (mL / 1000) * 1000) / 1000;
      return { q: '塩化ナトリウム NaCl ' + nice(n) + ' mol を水にとかして、全体を ' + mL + ' mL の溶液にした。モル濃度は？', num: c, unit: 'mol/L',
        hint: 'mL を L に直してから、mol を L でわる。',
        steps: [mL + ' mL ＝ ' + Lt(mL) + ' L', nice(n) + '÷' + Lt(mL) + '＝' + nice(c) + ' mol/L'] };
    },
    molarN: function () {
      var p = pick([[0.10, 200], [0.10, 500], [0.20, 250], [0.20, 500], [0.50, 100], [0.50, 200], [2.0, 100], [2.0, 250]]), c = p[0], mL = p[1];
      var n = Math.round(c * mL / 1000 * 10000) / 10000;
      return { q: nice(c) + ' mol/L の溶液 ' + mL + ' mL の中に、溶質は何 mol とけている？', num: n, unit: 'mol',
        hint: 'mol/L に L をかけると mol。mL は L に直す。',
        steps: [mL + ' mL ＝ ' + Lt(mL) + ' L', nice(c) + '×' + Lt(mL) + '＝' + nice(n) + ' mol'] };
    },
    molarG: function () {
      var s = pick([{ f: 'NaOH', name: '水酸化ナトリウム', M: 40 }, { f: 'NaCl', name: '塩化ナトリウム', M: 58.5 }, { f: 'C_6H_{12}O_6', name: 'ブドウ糖', M: 180 }]);
      var n = pick([0.10, 0.20, 0.050]), mL = pick([250, 500]), g = Math.round(s.M * n * 100) / 100, c = Math.round(n / (mL / 1000) * 1000) / 1000;
      return { q: s.name + ' ' + s.f + ' ' + gT(g) + ' g を水にとかして ' + mL + ' mL の溶液にした。モル濃度は？（' + s.f + '＝' + s.M + '）', num: c, unit: 'mol/L',
        hint: 'まず質量から mol を求める（わる）。次に mol を L でわる。',
        steps: ['【質量から mol を求める】' + gT(g) + '÷' + s.M + '＝' + nice(n) + ' mol', mL + ' mL ＝ ' + Lt(mL) + ' L', nice(n) + '÷' + Lt(mL) + '＝' + nice(c) + ' mol/L'],
        parts: [part('1段階め。' + s.f + ' ' + gT(g) + ' g は何 mol？（' + s.f + '＝' + s.M + '）', n, 'mol', '質量から mol を求めるときは、モル質量でわる。', gT(g) + '÷' + s.M + '＝' + nice(n) + ' mol'),
          part('2段階め。' + nice(n) + ' mol をとかして全体を ' + mL + ' mL にした。モル濃度は？', c, 'mol/L', 'mL を L に直してから、mol を L でわる。', nice(n) + '÷' + Lt(mL) + '＝' + nice(c) + ' mol/L')] };
    }
  };
  M.GEN = GEN;
  M.genQ = function (name) { var g = GEN[name]; if (!g) throw new Error('drill がない: ' + name); var q = g(); q.gen = name; return q; };
})();
