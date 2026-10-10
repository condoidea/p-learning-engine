/* =========================================================
 * vocab/core.js — カードの成長（レベル・経験値・コンディション）と保存
 *
 *  レベル     0 ブロンズ → 1 シルバー → 2 ゴールド → 3 ホロ。最高到達なので下がらない
 *  経験値     間を空けて思い出せたときにたくさん入る（同じ日の連打ではほとんど入らない）
 *  コンディション  いまの定着度（0〜1）。時間で下がる。下がると「しおれ」→「野生に戻りかけ」
 *  記憶の強さ s（コンディションが半分になるまでの日数）
 *    思い出せるたびに約2.5倍（SM-2 の標準 2.5 と同じ）。遅れて思い出せたら少し多め、早めに会えば（なつかせる）少なめ
 *    s が 240日 を超えたら「卒業」：もう野生に出ない（WaniKani の burned と同じ考え方。たまり続けないように）
 *    次にしおれる日は、少し前後（0.85〜1.25倍）の中で「いちばん空いている日」にずらす（Anki の load balancer と同じ）
 *  設計の考え方は docs/単語アプリ設計.md（v6）
 * ========================================================= */
(function () {
  'use strict';
  var D = window.VOCAB_DECK;
  var KEY = 'vocab.' + D.id + '.v1';
  var HOUR = 3600e3, DAY = 24 * HOUR;

  var RANKS = [
    /* rel：単語キャラとの関係（＝距離）。ゴールド以上を「定着」とよぶ */
    { id: 'bronze', name: 'ブロンズ', rel: '出会った', mark: 'B', need: 0 },
    { id: 'silver', name: 'シルバー', rel: '顔なじみ', mark: 'S', need: 30 },
    { id: 'gold', name: 'ゴールド', rel: '仲間', mark: 'G', need: 80 },
    { id: 'holo', name: 'ホロ', rel: '相棒', mark: 'H', need: 160 }
  ];
  /* 以前の仕組み（ランクごとの長持ち日数）。古い記録を新しい s に移すときだけ使う */
  var KEEP = [1.2, 3.2, 7, 16];
  var FRESH = 0.75, WILD = 0.45;    // これ未満で「しおれ」、さらに未満で「野生に戻りかけ」
  var S0 = 1.2;                     // 出会ったばかりの s（約12時間でしおれ始める）
  var GROW = 2.5;                   // 思い出せたときの基本の倍率
  var GRAD = 240;                   // これを超えたら卒業（もう野生に出ない）
  var DUE = Math.log(1 / FRESH) / Math.LN2;   // s のうち、しおれ始めるまでの割合（約0.415）

  function fresh() {
    return { cards: {}, meet: [], day: { date: '', exp: 0, grown: [], caught: [] }, total: { exp: 0, answered: 0, correct: 0 },
      settings: { sound: true, speak: true, mood: 'firm' } };
  }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.cards) { var f = fresh(); for (var k in f) if (!(k in s)) s[k] = f[k]; return s; } } catch (e) { /* 保存領域が使えない */ }
    return fresh();
  }
  var S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* 保存できなくても学習は続ける */ } }

  function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function rollDay() { var t = today(); if (S.day.date !== t) S.day = { date: t, exp: 0, grown: [], caught: [] }; }
  rollDay();

  var W = {}; D.words.forEach(function (w, i) { w.i = i; W[w.id] = w; });
  /* 動詞のくせ（cj）がデッキに書かれていれば、活用エンジンに足す */
  if (window.Conj) D.words.forEach(function (w) { if (w.pos === 'v' && w.cj) Conj.addIrr(w.w, w.cj); });
  var SEC = {}; D.sections.forEach(function (s) { SEC[s.id] = s; });

  /* 冠詞：g が mf（el/la estudiante のように男女で形が同じ）なら el/la */
  function art(w) {
    if (D.lang && D.lang !== 'es') return w.art || '';   /* 冠詞を自動でつけるのはスペイン語だけ */
    return w.art || (w.pos === 'n' ? (w.g === 'f' ? 'la' : w.g === 'mf' ? 'el/la' : 'el') : '');
  }
  function card(id) { return S.cards[id] || null; }
  function rankOf(exp) { var r = 0; RANKS.forEach(function (R, i) { if (exp >= R.need) r = i; }); return r; }

  /* 記憶の強さ（古い記録は、以前の長持ち日数から移す） */
  function strength(c) {
    if (c.s == null) c.s = KEEP[c.lv] * (1 + 0.4 * Math.min(c.streak || 0, 4));
    return c.s * (c.j || 1);
  }
  /* いまのコンディション（0〜1）。卒業した子はずっと1 */
  function condition(id, now) {
    var c = card(id); if (!c) return 0;
    if (c.grad) return 1;
    var days = ((now || Date.now()) - c.ok) / DAY;
    return Math.pow(0.5, days / strength(c));
  }
  /* しおれ始める時刻 */
  function wiltAt(c) { return c.ok + strength(c) * DUE * DAY; }
  function dayNo(t) { var d = new Date(t); return d.getFullYear() * 400 + d.getMonth() * 32 + d.getDate(); }
  /* 次にしおれる日を、0.85〜1.25倍の中でいちばん空いている日に（2日以上先のときだけ） */
  function balance(id, c) {
    c.j = 1;
    if (c.s * DUE < 2) return;
    var load = {};
    Object.keys(S.cards).forEach(function (k) { var o = S.cards[k]; if (k === id || o.grad) return; var d = dayNo(wiltAt(o)); load[d] = (load[d] || 0) + 1; });
    var best = 1, bestN = Infinity;
    [1, 0.95, 1.05, 0.9, 1.1, 0.85, 1.15, 1.2, 1.25].forEach(function (j) {
      var n = load[dayNo(c.ok + c.s * j * DUE * DAY)] || 0;
      if (n < bestN) { bestN = n; best = j; }
    });
    c.j = best;
  }
  function state(id) {
    var c = card(id); if (!c) return 'none';
    var r = condition(id);
    return r >= FRESH ? 'fresh' : r >= WILD ? 'wilt' : 'wild';
  }

  /* 間の空き具合で経験値を決める */
  function expFor(gapH) { return gapH < 0.5 ? 1 : gapH < 6 ? 3 : gapH < 20 ? 8 : gapH < 72 ? 15 : 25; }

  function gain(id, n) {
    var c = S.cards[id], before = c.lv;
    c.exp += n; S.day.exp += n; S.total.exp += n;
    var lv = rankOf(c.exp);
    if (lv > c.lv) c.lv = lv;
    if (S.day.grown.indexOf(id) < 0) S.day.grown.push(id);
    return { exp: n, up: c.lv > before ? c.lv : 0 };
  }

  /* 活用カード：id は 'cj:動詞のid:時制'（例 cj:tener:pret）。成長のしかたは単語と同じ */
  /* 範囲（参考書の課など）。settings.range が空なら全部 */
  function inRange(w) { var r = S.settings.range; return !w || !r || !r.length || r.indexOf(w.s) >= 0; }
  function isCj(id) { return id.indexOf('cj:') === 0; }
  function cj(id) { var a = id.split(':'); return { id: id, verb: W[a[1]], tense: a[2] }; }

  var V = {
    D: D, S: S, W: W, SEC: SEC, RANKS: RANKS, save: save, art: art, card: card, condition: condition, state: state,
    word: function (id) { return W[id]; },
    /* 冠詞つきの見出し */
    head: function (w) { var a = art(w); return (a ? a + ' ' : '') + w.w; },

    /* 捕獲（ブロンズで図鑑へ） */
    capture: function (id, known) {
      rollDay();
      var now = Date.now();
      if (!S.cards[id]) S.cards[id] = { lv: 0, exp: 0, cap: now, ok: now, last: now, streak: 0, known: !!known, miss: 0, s: S0, j: 1 };
      var i = S.meet.indexOf(id); if (i >= 0) S.meet.splice(i, 1);
      if (S.day.caught.indexOf(id) < 0) S.day.caught.push(id);
      var r = gain(id, known ? 10 : 5);
      save();
      return r;
    },
    /* 野生戦・救出などの答え。正解なら経験値、まちがいならコンディションを下げる（レベルは下げない） */
    answer: function (id, ok) {
      rollDay();
      var c = S.cards[id], now = Date.now(), r = { exp: 0, up: 0, back: false, grad: false };
      S.total.answered++;
      if (!c) { save(); return r; }
      var st = strength(c), ratio = (now - c.ok) / (st * DUE * DAY);   // 1＝ちょうどしおれ始め。1未満は早め（なつかせる）
      if (ok) {
        S.total.correct++;
        var gapH = (now - c.last) / HOUR;
        r.back = state(id) === 'wild';
        r = Object.assign(r, gain(id, expFor(gapH)));
        if (gapH >= 6) c.streak = (c.streak || 0) + 1;
        /* 記憶の強さ：しおれてから思い出せたら ×2.5（遅いほど少し多め、最大×2.9）。早めに会ったら、その早さに応じて少なめ */
        var mult = ratio >= 1 ? GROW * (0.85 + 0.15 * Math.min(2, ratio)) : 1 + (GROW - 1) * Math.max(0, ratio);
        c.s = Math.max(S0, c.s * mult);
        c.ok = now;
        if (c.s >= GRAD && !c.grad) { c.grad = now; r.grad = true; }
        else balance(id, c);
      } else {
        c.streak = 0; c.miss = (c.miss || 0) + 1;
        c.s = Math.max(S0, c.s * 0.4); c.j = 1;                          // 忘れていたら、強さを4割に
        c.ok = Math.min(c.ok, now - c.s * DAY);                          // コンディションを半分に（まだ敵として残る）
      }
      c.last = now;
      save();
      return r;
    },
    /* 顔見知りチェックで答えられなかった語 → 出会いへ */
    toMeet: function (id) { if (S.meet.indexOf(id) < 0 && !S.cards[id]) S.meet.push(id); save(); },

    /* ---- 出題の候補 ---- */
    faceList: function () {
      return D.words.filter(function (w) { return SEC[w.s].known && !S.cards[w.id] && S.meet.indexOf(w.id) < 0 && inRange(w); });
    },
    meetList: function () {
      var first = S.meet.map(function (id) { return W[id]; }).filter(function (w) { return w && inRange(w); });
      var rest = D.words.filter(function (w) { return !SEC[w.s].known && !S.cards[w.id] && inRange(w); });
      return first.concat(rest);
    },
    /* しおれた・野生に戻りかけのカード（コンディションの低い順） */
    wildList: function () {
      var now = Date.now();
      return Object.keys(S.cards).map(function (id) { return { w: W[id], r: condition(id, now) }; })
        .filter(function (x) { return x.w && x.r < FRESH && inRange(x.w); })   /* 卒業した子は condition＝1 なので出ない */
        .sort(function (a, b) { return a.r - b.r; })
        .map(function (x) { return x.w; });
    },
    /* 次にしおれ始めるカードの時刻（なければ null） */
    nextWild: function () {
      var t = null;
      Object.keys(S.cards).forEach(function (id) {
        var c = S.cards[id]; if (!W[id] && !isCj(id)) return;
        if (c.grad) return;
        var at = wiltAt(c);
        if (t === null || at < t) t = at;
      });
      return t;
    },
    /* ランクごとの枚数 [ブロンズ, シルバー, ゴールド, ホロ] */
    rankCounts: function () { var n = [0, 0, 0, 0]; Object.keys(S.cards).forEach(function (id) { if (W[id]) n[S.cards[id].lv]++; }); return n; },
    isCj: isCj, cj: cj, inRange: inRange,
    cjId: function (verbId, tense) { return 'cj:' + verbId + ':' + tense; },
    /* しおれた活用カード（コンディションの低い順） */
    cjWildList: function () {
      var now = Date.now();
      return Object.keys(S.cards).filter(function (id) { return isCj(id) && W[id.split(':')[1]] && inRange(W[id.split(':')[1]]); })
        .map(function (id) { return { id: id, r: condition(id, now) }; })
        .filter(function (x) { return x.r < FRESH; }).sort(function (a, b) { return a.r - b.r; })
        .map(function (x) { return x.id; });
    },
    /* もうすぐしおれる子（hours 時間以内）。いま会いに行けば「なつかせる」（しおれる前のケア） */
    soonList: function (hours) {
      var now = Date.now(), lim = now + (hours || 24) * HOUR;
      return Object.keys(S.cards).filter(function (id) {
        var c = S.cards[id], w = isCj(id) ? W[id.split(':')[1]] : W[id];
        if (!w || c.grad || !inRange(w) || condition(id, now) < FRESH) return false;
        return wiltAt(c) <= lim && now - c.last > HOUR;     // さっき会ったばかりの子は除く
      }).sort(function (a, b) { return wiltAt(S.cards[a]) - wiltAt(S.cards[b]); });
    },
    grad: function (id) { var c = card(id); return !!(c && c.grad); },
    gradCount: function () { return Object.keys(S.cards).filter(function (id) { return W[id] && S.cards[id].grad; }).length; },
    /* 記憶の強さ（日）と、次にしおれるまでの日数（表示用） */
    memory: function (id) { var c = card(id); if (!c) return null; return { s: strength(c), grad: !!c.grad, next: c.grad ? null : (wiltAt(c) - Date.now()) / DAY }; },
    caughtCount: function () { return Object.keys(S.cards).filter(function (id) { return W[id]; }).length; },
    /* 次の進化まで */
    toNext: function (id) { var c = card(id); if (!c || c.lv >= 3) return null; return { now: c.exp - RANKS[c.lv].need, need: RANKS[c.lv + 1].need - RANKS[c.lv].need }; },
    reset: function () { try { localStorage.removeItem(KEY); } catch (e) { /* */ } location.reload(); }
  };
  window.V = V;
  /* 共通の効果音（engine/js/audio.js）に、音のオン・オフを伝える */
  window.SfxOn = function () { return S.settings.sound; };
})();
