/* =========================================================
 * data/side.js — 冒険者ギルドの依頼（メインの話は増やさずに、練習で深める）
 *
 *  地図の章ごとに「🍺 冒険者ギルド」の掲示板があり、困りごとの依頼を受ける。after のレッスンを終えると受けられる。
 *  何度でも受けられる（問題は毎回作り直す）
 *
 *  依頼 = { id, ch, after, type, client, title, trouble（困りごと）, reward, run: 'talk' | 'battle', make }
 *   type: 'hunt' 魔物退治 / 'gather' 素材集め / 'explore' 探索 / 'escort' 護衛任務
 *   run 'talk'   make() はトークの台本（steps）を返す。{ journey: { i, n, label, icon } } で旅の進み具合を見せる
 *   run 'battle' make() はボス（battle.js の形）を返す。問題は Y.QS に作って足す（q.pic で構造式を出せる）
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
  function randIso(ns) { var n = pickFrom(ns), all = B.isomers(n); return { n: n, all: all, g: pickFrom(all) }; }
  /* 問題の部品 */
  function nameQ(ns) {
    var r = randIso(ns), c = choices(r.g.name, r.all.map(function (x) { return x.name; }).concat(nearMiss(r.g)), 4);
    return { pic: pickFrom(r.g.sets), q: 'この形の名前は？', opts: c.opts, a: c.a, why: readOut(r.g) };
  }
  function sameQ(ns) {
    var r = randIso(ns), same = Math.random() < 0.5 && r.g.sets.length > 1, g2 = same ? r.g : pickFrom(r.all.filter(function (x) { return x !== r.g; }));
    var s1 = pickFrom(r.g.sets), s2 = pickFrom(same ? r.g.sets.filter(function (x) { return x !== s1; }) : g2.sets);
    return { pics: [s1, s2], q: '①と②は、同じ物質？', opts: ['同じ物質', 'ちがう物質'], a: same ? 0 : 1,
      why: '鎖の長さと枝の番号をくらべる。\n①：' + r.g.name + '\n②：' + g2.name };
  }
  function formulaQ(ns) {
    var r = randIso(ns), n = r.n, f = formula(n);
    var c = choices(f, [formula(n - 1), formula(n + 1), 'C' + sub(n) + 'H' + sub(2 * n), 'C' + sub(n) + 'H' + sub(2 * n + 4)], 4);
    return { q: '「' + r.g.name + '」の分子式は？', opts: c.opts, a: c.a, why: '鎖と枝の C を全部数えると ' + n + ' 個。アルカンなので H は 2×' + n + '＋2 ＝ ' + (2 * n + 2) + ' 個。' };
  }
  /* トークの台本に変える */
  function askSteps(q, cap) {
    var st = [];
    if (q.pic) st.push({ pic: q.pic, cap: cap });
    if (q.pics) { st.push({ pic: q.pics[0], cap: cap + '　①' }); st.push({ pic: q.pics[1], cap: '②' }); }
    st.push({ ask: (q.pic || q.pics ? '' : cap + '　') + q.q, opts: q.opts, a: q.a, mols: q.mols, why: q.why });
    return st;
  }

  /* ---------- ⚔ 魔物退治：名前喰いの幻影 ---------- */
  var gq = 0;
  function huntNames() {
    var ids = [];
    for (var i = 0; i < 12; i++) {
      var q = nameQ([4, 5, 5, 6, 6]), id = 'gen' + (++gq);
      Y.QS[id] = { attr: 'forge', pic: q.pic, q: q.q, opts: q.opts, a: q.a, why: q.why, lim: 20000, crit: 7000 };
      ids.push(id);
    }
    return { id: 'r-hunt', kind: 'quiz', name: '名前喰い', title: '村の書庫を荒らす幻影', hp: 100, dmg: 14, qs: ids,
      intro: 'くくく…名前は全部、喰ってやった。この形の名前、言えるかな？',
      taunt: ['ちがう名前だ！', 'くくく、もう一口いただき', '鎖をたどり直せ'],
      rule: '構造式を見て、名前を答えると攻撃。**7 秒以内**ならクリティカル。\nまちがえると反撃（ライフ −1）。',
      reward: '📜 書記官「名前がもどった！ ありがとう、錬成士さん」',
      art: '<svg viewBox="0 0 200 200" class="boss-art mirage"><g class="body"><path d="M100 24c-36 0-58 30-58 64v84l14-12 14 14 15-14 15 14 15-14 14 14 14-12V88c0-34-22-64-57-64z" fill="#6fd0c0"/>' +
        '<path d="M64 76q36-26 72 0v26q-36 18-72 0z" fill="#103a34"/><ellipse cx="82" cy="88" rx="9" ry="6" fill="#ffd23f"/><ellipse cx="118" cy="88" rx="9" ry="6" fill="#ffd23f"/>' +
        '<path d="M80 124q20 18 40 0" stroke="#103a34" stroke-width="6" fill="none" stroke-linecap="round"/><text x="100" y="160" text-anchor="middle" font-size="15" fill="#103a34" font-weight="800">名？</text></g></svg>' };
  }

  /* ---------- 🧪 素材集め：錬金術師の注文 ---------- */
  function gatherForge() {
    var steps = [
      { story: '酒場の奥の席。\n錬金術師ベルナが、注文書を広げた。' },
      { t: '「この 3 つの素材を、錬成して届けてほしいの」\n名前だけが書いてある注文書だ。', face: 'think' },
      { reply: ['引き受けた！', { l: '🤔 名前から形を作るには？', then: ['① 名前の最後で、いちばん長い鎖の C の数が分かる\n② 「○-メチル」の数字が、枝を出す C の番号\n③ 鎖を作ってから、その番号の C に枝をつなぐ'] }] }
    ];
    var used = {};
    [5, 6, 6].forEach(function (n, i) {
      var all = B.isomers(n).filter(function (x) { return !used[x.name]; }), g = pickFrom(all);
      used[g.name] = 1;
      steps.push({ build: { mat: { C: n, H: 2 * n + 2 }, hFill: true, parts: ['CH3'], appraise: 'chain',
        answers: [{ name: g.name, set: g.sets[0], note: readOut(g).replace(/\n/g, ' ') }],
        hints: ['まず、いちばん長い鎖を作る。\n「' + B.CHAIN[g.len] + '」は C ' + g.len + ' つ。',
          g.loc.length ? '枝（メチル）は、' + g.loc.join('・') + ' 番目の C から。\n番号は、枝に近いはしから数える。' : '枝はない。C を一列に並べるだけ。'] },
        mission: '注文 ' + (i + 1) + ' / 3　**' + g.name + '**（C ' + n + ' つ）' });
    });
    steps.push({ t: '「まあ、注文どおり！ 腕のいい錬成士ね」\nベルナは、うれしそうに素材を受け取った。', face: 'happy' });
    return steps;
  }

  /* ---------- 🗝 探索：双子の遺跡 ---------- */
  function exploreTwins() {
    var rooms = 5, steps = [
      { story: '学者ヨハンの依頼で、古い遺跡へ。\n扉には、2 つの紋章が刻まれている。' },
      { t: '「同じ物質の紋章なら扉が開く。ちがえば罠だ」\nヨハンは、そう言って身をすくめた。', face: 'think' },
      { reply: ['見分けてみせる', { l: '🤔 同じかどうかの見分け方は？', then: ['見た目の曲がり方ではなく、つながり方で見る。\nいちばん長い鎖の C の数と、枝の番号が同じなら同じ物質。'] }] }
    ];
    for (var i = 0; i < rooms; i++) {
      steps.push({ journey: { i: i + 1, n: rooms, icon: '🗝', label: '遺跡の部屋 ' + (i + 1) + ' / ' + rooms } });
      var q = i === rooms - 1 ? formulaQ([5, 6]) : sameQ([4, 5, 6]);
      if (i === rooms - 1) steps.push({ story: '最後の扉。紋章ではなく、文字が刻まれている。' });
      Array.prototype.push.apply(steps, askSteps(q, '部屋 ' + (i + 1)));
    }
    steps.push({ story: '最後の扉が開いた。\n奥には、古い錬成書が眠っていた。' });
    steps.push({ t: '「これで研究が進む！ ありがとう」\nヨハンは、錬成書を大事そうに抱えた。', face: 'happy' });
    return steps;
  }

  /* ---------- 🛡 護衛任務：草原を越える荷馬車 ---------- */
  function escortCaravan() {
    var legs = 6, ids = Y.shuffle(Object.keys(Y.QS).filter(function (k) { return /^q\d+$/.test(k) && Y.QS[k].attr !== 'forge'; })).slice(0, legs);
    var events = ['草むらから、雷をまとった魔物が！', '風の精霊が、荷台をゆさぶる！', '砂嵐の中から、盗賊の声が…', '橋の手前で、魔物が道をふさいだ！', '夜の野営地を、赤い霧がおそう！', '町の門の前で、最後の待ちぶせ！'];
    var steps = [
      { story: '行商人マルコの荷馬車が、草原を越える。\nキミの役目は、その護衛だ。' },
      { t: '「道中は魔物だらけでね。魔法で守ってくれ」\n荷台には、薬の瓶が山積みだ。', face: 'think' },
      { reply: ['任せて！'] }
    ];
    ids.forEach(function (id, i) {
      var q = Y.QS[id];
      steps.push({ journey: { i: i + 1, n: legs, icon: '🛡', label: '旅程 ' + (i + 1) + ' / ' + legs } });
      steps.push({ story: events[i % events.length] });
      steps.push({ ask: '迎え撃て！　' + q.q, opts: q.opts, a: q.a, mols: q.mols, why: q.why });
    });
    steps.push({ story: '荷馬車は、無事に町へ着いた。' });
    steps.push({ t: '「助かったよ！ キミがいれば、どこへでも行ける」\nマルコは、報酬の袋を手渡した。', face: 'happy' });
    return steps;
  }

  Y.GUILD = [
    { id: 'r-hunt', ch: 0, after: 'p3b', type: 'hunt', client: '村の書記官', title: '名前喰いの幻影を退治して',
      trouble: '書庫の魔法陣から、名前が次々に消えています。形を見て名前を言いあてれば、幻影は弱るはずです。', reward: '経験値（ランクで変わる）', run: 'battle', make: huntNames },
    { id: 'r-gather', ch: 0, after: 'p3b', type: 'gather', client: '錬金術師ベルナ', title: '注文書の素材を錬成して',
      trouble: '薬の材料が 3 つ足りないの。名前しか分からないけれど、錬成して届けてくれる？', reward: '経験値', run: 'talk', make: gatherForge },
    { id: 'r-explore', ch: 0, after: 'p3b', type: 'explore', client: '学者ヨハン', title: '双子の遺跡の扉を開けて',
      trouble: '遺跡の扉は、同じ物質の紋章のときだけ開くらしい。見分けられる人を探しています。', reward: '経験値', run: 'talk', make: exploreTwins },
    { id: 'r-escort', ch: 1, after: 'c3', type: 'escort', client: '行商人マルコ', title: '草原を越える荷馬車を守って',
      trouble: '草原の道は魔物が多くて…。1 章の魔法で、荷馬車を町まで守ってほしい。', reward: '経験値', run: 'talk', make: escortCaravan }
  ];
  Y.GUILD_TYPES = {
    hunt: { n: '魔物退治', icon: '⚔' }, gather: { n: '素材集め', icon: '🧪' },
    explore: { n: '探索', icon: '🗝' }, escort: { n: '護衛任務', icon: '🛡' }
  };
})();
