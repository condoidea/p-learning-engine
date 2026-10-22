/* =========================================================
 * data/side.js — 寄り道クエスト（メインの話は増やさずに、練習で深める）
 *
 *  地図の章の下に並ぶ。after のレッスンを終えると開く。何度でも遊べる（問題は毎回作り直す）
 *  make() は、トークの台本（steps）を返す。書き方は talk.js の先頭と同じ
 *
 *   名前の道場     構造式（曲げた・裏返した描き方も出る）を見て名前を読む／同じ物質か見分ける／分子式
 *   錬成の修練場   名前を見て、その形を錬成する
 *   反応の試練     1章の反応・名前の問題（ボス戦の問題から）
 * ========================================================= */
(function () {
  'use strict';
  var Y = window.Y, B = Y.BuildCore;
  var SUB = '₀₁₂₃₄₅₆₇₈₉';
  function sub(n) { return String(n).split('').map(function (c) { return SUB[+c]; }).join(''); }
  function formula(n) { return 'C' + sub(n) + 'H' + sub(2 * n + 2); }
  function pickFrom(a) { return a[Math.floor(Math.random() * a.length)]; }
  function choices(right, wrongs, k) {
    var opts = [right].concat(Y.shuffle(wrongs.filter(function (w, i, a) { return w !== right && a.indexOf(w) === i; })).slice(0, k - 1));
    opts = Y.shuffle(opts);
    return { opts: opts, a: opts.indexOf(right) };
  }
  /* 名前の読み解き（まちがえたときの説明）：見る順に「鎖 → 枝 → 名前」 */
  function readOut(g) {
    var br = g.loc.length ? '枝は ' + g.loc.join('・') + ' 番目の C から' + (g.loc.length > 1 ? '（同じ枝が ' + g.loc.length + ' つなので「' + B.MULT[g.loc.length] + '」）' : '') : '枝はない';
    return 'いちばん長い鎖は C ' + g.len + ' つ（' + B.CHAIN[g.len] + '）。\n' + br + '。\n→ ' + g.name;
  }
  /* 番号のつけまちがい・鎖のまちがいを、まぎらわしい選択肢にする */
  function nearMiss(g) {
    var out = [];
    if (g.loc.length === 1) { var k = g.len + 1 - g.loc[0]; if (k !== g.loc[0]) out.push(k + '-メチル' + B.CHAIN[g.len]); }
    if (g.loc.length) out.push((g.loc.length > 1 ? g.loc.join(',') + '-' + B.MULT[g.loc.length] : g.loc[0] + '-') + 'メチル' + B.CHAIN[g.len + 1]);
    return out;
  }

  /* ---------- 名前の道場 ---------- */
  function nameDojo() {
    var steps = [
      { t: '名前の道場へ、ようこそ。\n形を見て、名前を読み解く修行だ。', face: 'proud' },
      { reply: ['読み方は？', { l: '🤔 読み方をおさらいしたい', then: ['① いちばん長い鎖を見る（C の数で鎖の名前）\n② 枝が何番目の C から出ているか（枝に近いはしから数える）\n③ 番号 → 枝 → 鎖の順に並べる。同じ枝が 2 つなら「ジ」'] }] }
    ];
    var kinds = Y.shuffle(['name', 'name', 'name', 'name', 'same', 'same', 'formula', 'name']);
    kinds.forEach(function (kind, i) {
      var n = pickFrom([4, 5, 5, 6, 6]), all = B.isomers(n), g = pickFrom(all);
      if (kind === 'name') {
        var c = choices(g.name, all.map(function (x) { return x.name; }).concat(nearMiss(g)), 4);
        steps.push({ pic: pickFrom(g.sets), cap: '第 ' + (i + 1) + ' 問' });
        steps.push({ ask: 'この形の名前は？', opts: c.opts, a: c.a, ok: readOut(g), why: readOut(g) });
      } else if (kind === 'same') {
        var same = Math.random() < 0.5 && g.sets.length > 1, g2 = same ? g : pickFrom(all.filter(function (x) { return x !== g; }));
        var s1 = pickFrom(g.sets), s2 = pickFrom(g2.sets.filter(function (x) { return x !== s1; }).concat(g2 === g ? [] : g2.sets));
        steps.push({ pic: s1, cap: '第 ' + (i + 1) + ' 問　①' });
        steps.push({ pic: s2, cap: '②' });
        steps.push({ ask: '①と②は、同じ物質？', opts: ['同じ物質', 'ちがう物質'], a: same ? 0 : 1,
          ok: same ? 'どちらも「' + g.name + '」。描き方がちがうだけ。' : '①は「' + g.name + '」、②は「' + g2.name + '」。',
          why: '鎖の長さと枝の番号をくらべる。\n①：' + g.name + '\n②：' + g2.name });
      } else {
        var f = formula(n), wrong = [formula(n - 1), formula(n + 1), 'C' + sub(n) + 'H' + sub(2 * n), 'C' + sub(n) + 'H' + sub(2 * n + 4)];
        var c2 = choices(f, wrong, 4);
        steps.push({ ask: '第 ' + (i + 1) + ' 問　「' + g.name + '」の分子式は？', opts: c2.opts, a: c2.a, why: '鎖と枝の C を全部数えると ' + n + ' 個。アルカンなので H は 2×' + n + '＋2 ＝ ' + (2 * n + 2) + ' 個。' });
      }
    });
    steps.push({ t: '修行おつかれさま！\nまちがえた所は、読み方の順番を思い出そう。', face: 'happy' });
    return steps;
  }

  /* ---------- 錬成の修練場 ---------- */
  function forgeTrial() {
    var steps = [
      { t: '錬成の修練場へ、ようこそ。\n名前だけを頼りに、その形を錬成する修行だ。', face: 'proud' },
      { reply: ['やってみる！'] }
    ];
    var used = {};
    [5, 6, 6].forEach(function (n, i) {
      var all = B.isomers(n).filter(function (x) { return !used[x.name]; }), g = pickFrom(all);
      used[g.name] = 1;
      steps.push({ build: { mat: { C: n, H: 2 * n + 2 }, hFill: true, parts: ['CH3'], appraise: 'chain',
        answers: [{ name: g.name, set: g.sets[0], note: readOut(g).replace(/\n/g, ' ') }],
        hints: ['まず、いちばん長い鎖を作る。\n「' + B.CHAIN[g.len] + '」は C ' + g.len + ' つ。',
          g.loc.length ? '枝（メチル）は、' + g.loc.join('・') + ' 番目の C から。\n番号は、枝に近いはしから数える。' : '枝はない。C を一列に並べるだけ。'] },
        mission: '第 ' + (i + 1) + ' 問　**' + g.name + '** を錬成せよ（C ' + n + ' つ）' });
    });
    steps.push({ t: '見事！\n名前から形が描ければ、名前の呪文はキミのものだ。', face: 'happy' });
    return steps;
  }

  /* ---------- 反応の試練 ---------- */
  function reactionTrial() {
    var ids = Y.shuffle(Object.keys(Y.QS)).slice(0, 8);
    var steps = [
      { t: '反応の試練へ、ようこそ。\n1 章で覚えた魔法を、思い出す修行だ。', face: 'proud' },
      { reply: ['かかってこい！'] }
    ];
    ids.forEach(function (id, i) {
      var q = Y.QS[id];
      steps.push({ ask: '第 ' + (i + 1) + ' 問　' + q.q, opts: q.opts, a: q.a, mols: q.mols, why: q.why });
    });
    steps.push({ t: '試練、突破！\n忘れかけた魔法は、呪文書の「復習詠唱」でみがこう。', face: 'happy' });
    return steps;
  }

  Y.SIDE = [
    { id: 's-name', ch: 0, after: 'p3b', icon: '📜', title: '名前の道場', sub: '形を見て名前を読む・同じ物質か見分ける', make: nameDojo },
    { id: 's-forge', ch: 0, after: 'p3b', icon: '⬡', title: '錬成の修練場', sub: '名前から、その形を錬成する', make: forgeTrial },
    { id: 's-react', ch: 1, after: 'c3', icon: '⚔', title: '反応の試練', sub: '1章の反応と名前を思い出す', make: reactionTrial }
  ];
})();
