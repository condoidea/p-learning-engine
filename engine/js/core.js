/* =========================================================
 * core.js — 状態管理・間隔反復(SRS)・ゲーム要素のロジック（DOMに触れない）
 * ========================================================= */
(function () {
  'use strict';
  var C = window.COURSE || {};
  var TEST = window.LE_E2E ? '.e2e' : '';           // 自動テスト中は別の保存先を使い、本物の学習データに触れない
  var KEY = (C.storageKey || 'le.' + (C.id || 'default') + '.v1') + TEST;
  var PROFILE_KEY = 'le.profile.v1' + TEST;          // 全コース共通：XP（レベル）・ストリーク・ログイン日
  var PROFILE_FIELDS = ['totalXp', 'streak', 'loginDay'];
  var DEFAULT_TITLES = [[1, 'ビギナー'], [5, 'ルーキー'], [10, 'レギュラー'], [20, 'エキスパート'], [30, 'マスター'], [50, 'レジェンド']];
  function rule(q) { return (C.fieldRules || {})[q.f] || {}; }
  var DAY = 86400000;
  var MIN = 60000;
  var LN09 = Math.log(0.9);

  /* ---------- 日付ユーティリティ ---------- */
  function dayKey(t) {
    var d = new Date(t == null ? Date.now() : t);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function dayDiff(a, b) { // b - a（日数）
    var pa = a.split('-'), pb = b.split('-');
    var da = new Date(+pa[0], +pa[1] - 1, +pa[2]), db = new Date(+pb[0], +pb[1] - 1, +pb[2]);
    return Math.round((db - da) / DAY);
  }
  function rand(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    return arr;
  }

  /* ---------- 状態 ---------- */
  function defaults() {
    return {
      v: 1,
      created: Date.now(),
      settings: { examDate: '', dailyGoal: 20, newPerDay: 15, setSize: 10, sound: true, lite: !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches), theme: (C.themes ? Object.keys(C.themes)[0] : 'cyan'), allQ: false },
      cards: {},
      totalXp: 0,
      streak: { count: 0, best: 0, lastDay: '', freezes: 1 },
      days: {},
      quests: { day: '', list: [] },
      ach: {},
      items: { boost: 0 },
      boostArmed: false,
      themes: [C.themes ? Object.keys(C.themes)[0] : 'cyan'],
      titles: [],
      title: '',
      pity: 0,
      loginDay: '',
      read: {},
      cardSeen: {},
      bosses: {},
      milestones: {},
      revealed: {},
      lessons: {},
      decks: {},
      stats: { answered: 0, correct: 0, bestCombo: 0, crits: 0, chests: 0, legendary: 0, perfectSets: 0, sets: 0, mockBest: 0, focusCorrect: 0, rescues: 0, cardsRead: 0, zones: 0, bossWins: 0 }
    };
  }
  function merge(base, src) {
    Object.keys(src || {}).forEach(function (k) {
      if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k]) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) merge(base[k], src[k]);
      else base[k] = src[k];
    });
    return base;
  }
  var S;
  var migratedFrom = null;
  function readJSON(k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  function load() {
    var raw = readJSON(KEY);
    /* 旧版のデータがあれば自動で引き継ぐ（新しい保存先が空のときだけ） */
    if (!raw && !TEST) (C.legacyKeys || []).some(function (k) { var v = readJSON(k); if (v) { raw = v; migratedFrom = k; } return !!v; });
    S = merge(defaults(), raw || {});
    if (S.stats.bCorrect && !S.stats.focusCorrect) S.stats.focusCorrect = S.stats.bCorrect; // 旧版の統計名
    /* 全コース共通のプロフィール（なければ、このコースの値から作る） */
    var P = readJSON(PROFILE_KEY);
    if (P) PROFILE_FIELDS.forEach(function (f) { if (P[f] !== undefined) S[f] = P[f]; });
    if (migratedFrom) save();
    return S;
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
      var P = readJSON(PROFILE_KEY) || {};
      PROFILE_FIELDS.forEach(function (f) { P[f] = S[f]; });
      P.updated = Date.now();
      P.courses = P.courses || {};
      P.courses[C.id || 'default'] = { last: Date.now(), lessons: Object.keys(S.lessons || {}).length };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(P));
    } catch (e) { /* 容量超過・プライベートモード等 */ }
  }

  /* ---------- 問題 ---------- */
  var QMAP = {};
  LE.questions.forEach(function (q) { QMAP[q.id] = q; });
  var FMAP = {}; LE.fields.forEach(function (f) { FMAP[f.id] = f; });
  LE.lessonDefs = LE.lessonDefs || {};
  var Q2LESSON = {};
  Object.keys(LE.lessonDefs).forEach(function (lid) { (LE.lessonDefs[lid].q || []).forEach(function (qid) { (Q2LESSON[qid] = Q2LESSON[qid] || []).push(lid); }); });
  var CMAP = {}; LE.cats.forEach(function (c) { CMAP[c.id] = c; });

  /* =========================================================
   * SRS：SM-2 を基礎に、保持率 R(t)=0.9^(経過/間隔) で「忘れかけ度」を表現
   *  - 間隔 = 保持率が 90% まで下がると予測される時点
   *  - 回答の速さで評価(q=3..5)を自動判定 → 余計な自己評価の手間をなくす
   *  - 不正解はセット内で再出題（短期の再学習ステップ）
   * ========================================================= */
  function card(id) { return S.cards[id]; }
  function retr(c, now) {
    if (!c || !c.seen) return 0;
    now = now || Date.now();
    var ivlMs = Math.max(c.ivl * DAY, 10 * MIN);
    var el = Math.max(0, now - c.last);
    return Math.exp(LN09 * el / ivlMs);
  }
  /* 1問のマスター度：保持率 × 習熟（連続正解の段階） */
  function strength(c, now) {
    if (!c || !c.seen) return 0;
    var r = retr(c, now);
    var depth = Math.min(1, (c.reps + 1) / 3);
    return r * depth * (c.lastOk ? 1 : 0.35);
  }
  function gradeFor(q, ms) {
    var r = rule(q);
    var fast = r.fast || C.gradeFast || 12000, ok = r.ok || C.gradeOk || 35000;
    if (ms < fast) return 5;
    if (ms < ok) return 4;
    return 3;
  }
  function examCapDays(now) {
    if (!S.settings.examDate) return 365;
    var left = dayDiff(dayKey(now), S.settings.examDate);
    if (left <= 1) return 1;
    return Math.max(1, Math.floor(left * 0.5)); // 試験までに最低1回は復習が来るように
  }
  function fmtIvl(days) {
    if (days < 1 / 24) return Math.max(1, Math.round(days * 1440)) + '分後';
    if (days < 1) return Math.round(days * 24) + '時間後';
    if (days < 30) return Math.round(days) + '日後';
    return Math.round(days / 30) + 'か月後';
  }
  /* 回答を記録し、次回の間隔を返す */
  function review(q, ok, ms) {
    var now = Date.now();
    var c = S.cards[q.id];
    var wasNew = !c || !c.seen;
    var wasDue = !wasNew && c.due <= now;
    var rBefore = retr(c, now);
    if (!c) c = S.cards[q.id] = { due: 0, ivl: 0, ease: 2.5, reps: 0, lapses: 0, last: 0, seen: 0, ok: 0, ng: 0, lastOk: false };
    c.seen++;
    var grade = ok ? gradeFor(q, ms) : 1;
    if (!ok) {
      c.ng++; c.lapses += wasNew ? 0 : 1; c.reps = 0;
      c.ease = Math.max(1.3, c.ease - 0.2);
      c.ivl = 0;
      c.due = now + 10 * MIN;
    } else {
      c.ok++; c.reps++;
      var ivl;
      if (c.reps === 1) ivl = grade === 5 ? 2 : 1;
      else if (c.reps === 2) ivl = grade === 5 ? 4 : 3;
      else ivl = c.ivl * c.ease * (grade === 5 ? 1.15 : grade === 3 ? 0.85 : 1);
      c.ease = Math.max(1.3, Math.min(3.0, c.ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))));
      ivl = ivl * (0.95 + Math.random() * 0.1); // ファズ：同じ日に復習が固まるのを防ぐ
      ivl = Math.min(ivl, examCapDays(now));
      c.ivl = Math.max(1, ivl);
      c.due = now + c.ivl * DAY;
    }
    c.last = now;
    c.lastOk = ok;
    return { wasNew: wasNew, wasDue: wasDue, rBefore: rBefore, ivl: ok ? c.ivl : 10 / 1440, grade: grade };
  }

  /* ---------- 出題キュー ---------- */
  function today() {
    var k = dayKey();
    if (!S.days[k]) S.days[k] = { answered: 0, correct: 0, xp: 0, sets: 0, newCount: 0 };
    return S.days[k];
  }
  function pool(filter) {
    return LE.questions.filter(function (q) { return !filter || filter(q); });
  }
  function dueList(filter, now) {
    now = now || Date.now();
    return pool(filter).filter(function (q) { var c = S.cards[q.id]; return c && c.seen && c.due <= now; })
      .sort(function (a, b) { return retr(S.cards[a.id], now) - retr(S.cards[b.id], now); });
  }
  function newList(filter) {
    /* 分野をラウンドロビンで混ぜる（インターリービング） */
    var byField = {};
    pool(filter).forEach(function (q) {
      var c = S.cards[q.id];
      if (c && c.seen) return;
      (byField[q.f] = byField[q.f] || []).push(q);
    });
    var keys = shuffle(Object.keys(byField));
    keys.forEach(function (k) { shuffle(byField[k]); });
    var out = [], more = true;
    while (more) {
      more = false;
      keys.forEach(function (k) { var x = byField[k].shift(); if (x) { out.push(x); more = true; } });
    }
    return out;
  }
  function weakList(filter) {
    var now = Date.now();
    return pool(filter).filter(function (q) { var c = S.cards[q.id]; return c && c.seen; })
      .sort(function (a, b) {
        var ca = S.cards[a.id], cb = S.cards[b.id];
        var sa = strength(ca, now) - ca.lapses * 0.15 - (ca.lastOk ? 0 : 0.5);
        var sb = strength(cb, now) - cb.lapses * 0.15 - (cb.lastOk ? 0 : 0.5);
        return sa - sb;
      });
  }
  function interleave(reviews, news, size) {
    var out = [];
    while (out.length < size && (reviews.length || news.length)) {
      if (reviews.length) out.push(reviews.shift());
      if (out.length < size && reviews.length) out.push(reviews.shift());
      if (out.length < size && news.length) out.push(news.shift());
    }
    return out;
  }
  function uniq(list) {
    var seen = {}; return list.filter(function (q) { if (seen[q.id]) return false; seen[q.id] = 1; return true; });
  }
  /* ---------- 習熟ゲート：レッスンを終えた範囲の問題だけを出題 ---------- */
  function isLearned(qid) {
    var ls = Q2LESSON[qid];
    if (!ls) return true; // どのレッスンにも属さない問題は常に出題可
    for (var i = 0; i < ls.length; i++) if (S.lessons[ls[i]] && S.lessons[ls[i]].done) return true;
    return false;
  }
  function learnedCount() { return LE.questions.filter(function (q) { return S.settings.allQ || isLearned(q.id); }).length; }
  function buildQueue(mode, arg) {
    var size = S.settings.setSize;
    var t = today();
    var newLeft = Math.max(0, S.settings.newPerDay - t.newCount);
    var filter = null, list;
    var gate = function (q) { return S.settings.allQ || isLearned(q.id); };
    filter = gate;
    if (mode === 'field') filter = function (q) { return q.f === arg && gate(q); };
    if (mode === 'focus') filter = function (q) { return C.focus && FMAP[q.f].cat === C.focus.cat && gate(q); };
    if (mode === 'boss') { /* ユニットボス：そのユニットの全レッスンから混ぜて出題（インターリービング） */
      var U = LE.units.find(function (x) { return x.id === arg; });
      var bq = [];
      U.lessons.forEach(function (lid) { bq = bq.concat((LE.lessonDefs[lid].q || []).map(function (id) { return QMAP[id]; }).filter(Boolean)); });
      return shuffle(bq).slice(0, 12);
    }
    if (mode === 'lesson') {
      var L = LE.lessonDefs[arg];
      var lq = (L && L.q || []).map(function (id) { return QMAP[id]; }).filter(Boolean);
      return shuffle(lq).slice(0, Math.max(size, lq.length));
    }
    if (mode === 'quick') size = 3;

    if (mode === 'mock') {
      /* 模試：対象区分（mock.exam）の出題比率に合わせて mock.count 問 */
      var mk = C.mock || {}, cnt = mk.count || 20;
      var aFields = LE.fields.filter(function (f) { return !mk.exam || CMAP[f.cat].exam === mk.exam; });
      var tw = aFields.reduce(function (s, f) { return s + f.weight; }, 0);
      list = [];
      aFields.forEach(function (f) {
        var n = Math.max(1, Math.round(cnt * f.weight / tw));
        list = list.concat(shuffle(pool(function (q) { return q.f === f.id && gate(q); })).slice(0, n));
      });
      return shuffle(list).slice(0, cnt);
    }
    if (mode === 'weak') {
      list = weakList(filter).slice(0, size);
      if (list.length < size) list = list.concat(newList(filter).slice(0, size - list.length));
      return shuffle(list);
    }
    var due = dueList(filter);
    var fresh = newList(filter);
    var allowNew = (mode === 'field' || mode === 'focus') ? Math.max(newLeft, Math.ceil(size / 2)) : newLeft;
    list = interleave(due.slice(), fresh.slice(0, allowNew), size);
    if (list.length < size) { // ノルマ以上に頑張る人向け：①記憶が薄れ始めた問題 → ②新規（上限超過分） → ③その他
      var now = Date.now();
      var fading = weakList(filter).filter(function (q) { var c = S.cards[q.id]; return !c.lastOk || retr(c, now) < 0.95; });
      list = uniq(list.concat(fading, fresh, weakList(filter))).slice(0, size);
    }
    return list;
  }

  /* ---------- マスター度・合格予測 ---------- */
  function fieldStats(fid, now) {
    now = now || Date.now();
    var qs = pool(function (q) { return q.f === fid; });
    var sum = 0, seen = 0, due = 0;
    qs.forEach(function (q) {
      var c = S.cards[q.id];
      sum += strength(c, now);
      if (c && c.seen) { seen++; if (c.due <= now) due++; }
    });
    return { total: qs.length, seen: seen, due: due, mastery: qs.length ? sum / qs.length : 0 };
  }
  /* 試験の定義（満点・合格ライン）。コース設定 exams に無ければ1000点満点・合格ラインなし */
  function examDef(id) {
    return (C.exams || []).find(function (e) { return e.id === id; }) || { id: id, name: id, max: 1000, pass: null };
  }
  function predict(exam, now) {
    var fs = LE.fields.filter(function (f) { return CMAP[f.cat].exam === exam; });
    var tw = 0, acc = 0;
    fs.forEach(function (f) { var st = fieldStats(f.id, now); tw += f.weight; acc += f.weight * st.mastery; });
    var m = tw ? acc / tw : 0;
    /* 当てずっぽうで取れる割合（guessRate）を下限に、記憶の定着度から正答率を推定して満点換算 */
    var ex = examDef(exam), g = (C.predict && C.predict.guessRate != null) ? C.predict.guessRate : 0.25;
    return Math.round((g + (1 - g) * m) * ex.max);
  }
  /* 忘却曲線：今後 days 日、復習しなかった場合の平均保持率 */
  function curve(days, steps) {
    var now = Date.now(), seen = [];
    Object.keys(S.cards).forEach(function (id) { if (S.cards[id].seen && QMAP[id]) seen.push(S.cards[id]); });
    var pts = [];
    for (var i = 0; i <= steps; i++) {
      var t = now + (days * DAY) * i / steps;
      var r = 0;
      seen.forEach(function (c) { r += retr(c, t); });
      pts.push(seen.length ? r / seen.length : null);
    }
    return pts;
  }

  /* =========================================================
   * 復習カード：1レッスン＝1枚。レッスンをクリアすると入手。
   * 進化ランクは、そのレッスンで解放された問題のマスター度で決まる。
   * ========================================================= */
  var ALL_CARDS = [], LMAP = {};
  (LE.units || []).forEach(function (u) {
    u.lessons.forEach(function (lid, i) {
      var L = LE.lessonDefs[lid];
      var c = { id: lid, L: L, unit: u, no: i + 1, t: L.title, def: (LE.cardDefs || {})[lid] || {} };
      ALL_CARDS.push(c); LMAP[lid] = c;
    });
  });
  var Q2CARD = {}, CARD2Q = {};
  ALL_CARDS.forEach(function (c) {
    CARD2Q[c.id] = (c.L.q || []).map(function (id) { return QMAP[id]; }).filter(Boolean);
    CARD2Q[c.id].forEach(function (q) { if (!Q2CARD[q.id]) Q2CARD[q.id] = c; });
  });
  var TIERS = ['locked', 'bronze', 'silver', 'gold', 'holo'];
  function owned(c) { return !!(S.lessons[c.id] && S.lessons[c.id].done); }
  function cardProgress(c, now) {
    var qs = CARD2Q[c.id] || [];
    if (!qs.length) return 1;
    var sum = 0; qs.forEach(function (q) { sum += strength(S.cards[q.id], now); });
    return sum / qs.length;
  }
  function cardTier(c, now) {
    if (!owned(c)) return 'locked';
    var m = cardProgress(c, now);
    return m >= 0.8 ? 'holo' : m >= 0.55 ? 'gold' : m >= 0.25 ? 'silver' : 'bronze';
  }
  /* 初めて開いたときの NEW 表示用 */
  function markRead(id) {
    if (S.cardSeen[id]) return false;
    S.cardSeen[id] = Date.now();
    S.stats.cardsRead++;
    return true;
  }
  function unitStats(uid) {
    var cs = ALL_CARDS.filter(function (c) { return c.unit.id === uid; }), got = 0, tiers = {};
    cs.forEach(function (c) { if (owned(c)) got++; var t = cardTier(c); tiers[t] = (tiers[t] || 0) + 1; });
    return { total: cs.length, got: got, tiers: tiers };
  }
  function unitCleared(uid) {
    var u = LE.units.find(function (x) { return x.id === uid; });
    return u.lessons.every(function (lid) { return S.lessons[lid] && S.lessons[lid].done; });
  }

  /* =========================================================
   * ゲーム要素
   * ========================================================= */
  function xpNeed(level) { return 60 + level * 30; }
  function levelInfo(total) {
    var lv = 1, rest = total;
    while (rest >= xpNeed(lv)) { rest -= xpNeed(lv); lv++; }
    return { level: lv, cur: rest, need: xpNeed(lv) };
  }
  var TITLES = C.titles || DEFAULT_TITLES;
  function titleFor(lv) { var t = TITLES[0][1]; TITLES.forEach(function (x) { if (lv >= x[0]) t = x[1]; }); return t; }
  var THEMES = {
    cyan:    { name: 'ネオンシアン',   a: '#38e8ff', b: '#7a5cff', lv: 1 },
    magenta: { name: 'サイバーピンク', a: '#ff3fa4', b: '#ffb347', lv: 6 },
    lime:    { name: 'マトリクス',     a: '#5cff9d', b: '#00b3ff', lv: 12 },
    gold:    { name: 'ゴールドラッシュ', a: '#ffd84d', b: '#ff6a3d', lv: 20 },
    violet:  { name: 'ネビュラ',       a: '#c779ff', b: '#38e8ff', lv: 0, legendary: true },
    crimson: { name: 'クリムゾン',     a: '#ff4d6d', b: '#ffd84d', lv: 0, legendary: true }
  };  if (C.themes) THEMES = C.themes;                   // コース専用のテーマカラー
  var FIRST_THEME = Object.keys(THEMES)[0];


  /* 実績 */
  var ACH = [
    { id: 'first',  ico: '🌱', name: 'はじめの一歩', desc: '初めて問題に答える', test: function (s) { return s.stats.answered >= 1; } },
    { id: 'c5',     ico: '⚡', name: '5コンボ',     desc: '5問連続正解',   test: function (s) { return s.stats.bestCombo >= 5; } },
    { id: 'c10',    ico: '🔥', name: 'FEVER突入',    desc: '10問連続正解', test: function (s) { return s.stats.bestCombo >= 10; } },
    { id: 'c25',    ico: '💥', name: '25コンボ',    desc: '25問連続正解',  test: function (s) { return s.stats.bestCombo >= 25; } },
    { id: 'c50',    ico: '🌋', name: 'アンストッパブル', desc: '50問連続正解', test: function (s) { return s.stats.bestCombo >= 50; } },
    { id: 's3',     ico: '📅', name: '三日坊主卒業', desc: '3日連続で学習', test: function (s) { return s.streak.best >= 3; } },
    { id: 's7',     ico: '🗓', name: '1週間継続',    desc: '7日連続で学習', test: function (s) { return s.streak.best >= 7; } },
    { id: 's14',    ico: '🏅', name: '習慣化の入口', desc: '14日連続で学習', test: function (s) { return s.streak.best >= 14; } },
    { id: 's30',    ico: '👑', name: '鉄の意志',     desc: '30日連続で学習', test: function (s) { return s.streak.best >= 30; } },
    { id: 'a100',   ico: '💯', name: '100問突破',    desc: '累計100問回答', test: function (s) { return s.stats.answered >= 100; } },
    { id: 'a500',   ico: '🚀', name: '500問突破',    desc: '累計500問回答', test: function (s) { return s.stats.answered >= 500; } },
    { id: 'a1000',  ico: '🌌', name: '1000問の旅',   desc: '累計1000問回答', test: function (s) { return s.stats.answered >= 1000; } },
    { id: 'perfect',ico: '✨', name: 'パーフェクト', desc: 'セットを全問正解', test: function (s) { return s.stats.perfectSets >= 1; } },
    { id: 'rescue', ico: '🛟', name: '記憶レスキュー', desc: '忘れかけの復習問題を20問救出', test: function (s) { return s.stats.rescues >= 20; } },
    { id: 'allf',   ico: '🗺', name: '全分野制覇',   desc: '全分野の問題に1問以上挑戦', test: function (s) { return LE.fields.every(function (f) { return fieldStats(f.id).seen > 0; }); } },
    { id: 'm80',    ico: '🧠', name: 'スペシャリスト', desc: 'いずれかの分野でマスター度80%', test: function (s) { return LE.fields.some(function (f) { return fieldStats(f.id).mastery >= 0.8; }); } },
    { id: 'lv10',   ico: '🔟', name: 'レベル10',     desc: 'レベル10に到達', test: function (s) { return levelInfo(s.totalXp).level >= 10; } },
    { id: 'lv25',   ico: '🏆', name: 'レベル25',     desc: 'レベル25に到達', test: function (s) { return levelInfo(s.totalXp).level >= 25; } },
    { id: 'legend', ico: '🌈', name: 'レジェンド',   desc: 'LEGENDARY 宝箱を引く', test: function (s) { return s.stats.legendary >= 1; } },

    { id: 'rd1',    ico: '📇', name: 'はじめてのカード', desc: LE_T('card') + 'を1枚手に入れる', test: function (s) { return ALL_CARDS.some(owned); } },
    { id: 'rd30',   ico: '📚', name: 'カードコレクター', desc: LE_T('card') + 'を30枚集める', test: function (s) { return ALL_CARDS.filter(owned).length >= 30; } },
    { id: 'rdall',  ico: '🗃', name: '図鑑コンプリート', desc: '全ての' + LE_T('card') + 'を集める', test: function (s) { return ALL_CARDS.every(owned); } },
    { id: 'gold',   ico: '🥇', name: 'ゴールドカード', desc: 'カードをゴールドに進化させる', test: function (s) { return ALL_CARDS.some(function (c) { var t = cardTier(c); return t === 'gold' || t === 'holo'; }); } },
    { id: 'holo',   ico: '🌈', name: 'ホログラム',   desc: 'カードをホロに進化させる', test: function (s) { return ALL_CARDS.some(function (c) { return cardTier(c) === 'holo'; }); } },
    { id: 'unit1',  ico: '🏁', name: 'ユニット制覇', desc: 'ユニットのレッスンを全部クリア', test: function (s) { return LE.units.some(function (u) { return unitCleared(u.id); }); } },
    { id: 'boss1',  ico: '⚔', name: LE_T('boss') + 'キラー', desc: LE_T('boss') + 'を倒す', test: function (s) { return s.stats.bossWins >= 1; } },
    { id: 'bossall',ico: '👑', name: '全' + LE_T('boss') + '制覇', desc: 'すべての' + LE_T('boss') + 'を倒す', test: function (s) { return LE.units.every(function (u) { return s.bosses[u.id]; }); } },
    { id: 'zone',   ico: '🌀', name: 'ZONE突入',     desc: 'レッスンで5問連続一発正解', test: function (s) { return s.stats.zones >= 1; } },
    { id: 'owl',    ico: '🦉', name: '夜ふかし学習', desc: '23時以降に学習する', test: function (s) { return s._owl; } },
    { id: 'bird',   ico: '🐓', name: '朝活の鬼',     desc: '7時前に学習する', test: function (s) { return s._bird; } }
  ];
  /* コース設定に応じた実績（模試・特訓モード） */
  (function () {
    var mk = C.mock, ex = mk && examDef(mk.exam);
    if (mk && ex.pass) ACH.push({ id: 'mock', ico: '🎓', name: '模試合格ライン', desc: (mk.label || 'ミニ模試') + 'で' + ex.pass + '点以上', test: function (s) { return s.stats.mockBest >= ex.pass; } });
    var fo = C.focus;
    if (fo) ACH.push({ id: 'btr', ico: fo.achIco || '🔥', name: fo.achName || fo.label + 'マスター', desc: fo.achDesc || fo.label + 'で累計10問正解', test: function (s) { return (s.stats.focusCorrect || 0) >= 10; } });
  })();
  function checkAch() {
    var h = new Date().getHours();
    S._owl = S._owl || h >= 23;
    S._bird = S._bird || (h >= 4 && h < 7);
    var got = [];
    ACH.forEach(function (a) { if (!S.ach[a.id] && a.test(S)) { S.ach[a.id] = Date.now(); got.push(a); } });
    return got;
  }

  /* デイリークエスト */
  var QUEST_POOL = [
    { type: 'answer',  label: function (n) { return n + '問に回答する'; }, n: [10, 15, 20] },
    { type: 'correct', label: function (n) { return n + '問正解する'; }, n: [8, 12, 15] },
    { type: 'combo',   label: function (n) { return n + 'コンボを達成する'; }, n: [3, 5, 7] },
    { type: 'rescue',  label: function (n) { return '復習問題を' + n + '問正解する'; }, n: [3, 5] },
    { type: 'sets',    label: function (n) { return n + 'セットクリアする'; }, n: [1, 2] },
    { type: 'read',    label: function (n) { return LE_T('card') + 'を' + n + '枚見返す'; }, n: [2, 3] },
    { type: 'lesson',  label: function (n) { return 'レッスンを' + n + '本クリアする'; }, n: [1, 1, 2] },
    { type: 'newq',    label: function (n) { return '新しい問題に' + n + '問挑戦する'; }, n: [5, 8] }
  ];
  if (C.focus) QUEST_POOL.push({ type: 'focus', label: function (n) { return (C.focus.questLabel || C.focus.label + 'で{n}問正解する').replace('{n}', n); }, n: [2, 3] });
  function ensureQuests() {
    var k = dayKey();
    if (S.quests.day === k && S.quests.list.length) return;
    var picks = shuffle(QUEST_POOL.slice()).slice(0, 3);
    S.quests = {
      day: k,
      list: picks.map(function (p, i) {
        var n = p.n[Math.min(p.n.length - 1, i)];
        return { type: p.type, target: n, label: p.label(n), prog: 0, done: false, xp: 40 + i * 20 };
      })
    };
    save();
  }
  function questEvent(type, amount, absolute) {
    var done = [];
    S.quests.list.forEach(function (q) {
      if (q.done || q.type !== type) return;
      q.prog = absolute ? Math.max(q.prog, amount) : q.prog + amount;
      if (q.prog >= q.target) { q.prog = q.target; q.done = true; done.push(q); }
    });
    return done;
  }

  /* ストリーク：起動時に判定。休んだ日はフリーズで自動補填 */
  function checkStreak() {
    var k = dayKey(), st = S.streak, res = { broken: false, usedFreeze: 0 };
    if (!st.lastDay) return res;
    var gap = dayDiff(st.lastDay, k);
    if (gap <= 1) return res;
    var missed = gap - 1;
    if (st.freezes >= missed) { st.freezes -= missed; res.usedFreeze = missed; st.lastDay = dayKey(Date.now() - DAY); }
    else { res.broken = st.count > 0; res.lost = st.count; st.count = 0; }
    save();
    return res;
  }
  var STREAK_MIN = 3; // 1日3問でストリーク維持（ハードルは極限まで低く）
  function touchStreak() {
    var k = dayKey(), st = S.streak;
    if (st.lastDay === k) return false;
    if (today().answered + (today().steps || 0) < STREAK_MIN) return false;
    var gap = st.lastDay ? dayDiff(st.lastDay, k) : 99;
    st.count = gap === 1 ? st.count + 1 : 1;
    st.best = Math.max(st.best, st.count);
    st.lastDay = k;
    if (st.count % 7 === 0 && st.freezes < 3) st.freezes++; // 7日ごとにフリーズ支給
    return true;
  }

  /* XP 計算（変動報酬：クリティカル／ジャックポット） */
  function calcXp(ok, info, combo, ms, q) {
    if (!ok) return { xp: 2, tags: [] };
    var xp = 10, tags = [];
    xp += Math.min(combo, 20);
    if (info.wasDue) { xp += 6; tags.push('RESCUE'); }
    if (info.wasNew) { xp += 3; }
    if (info.grade === 5) { xp += 4; tags.push('SPEED'); }
    xp += rule(q).xpBonus || 0;
    var mult = 1;
    if (combo >= 10) { mult *= 1.5; tags.push('FEVER'); }
    if (S.boostArmed) { mult *= 2; tags.push('BOOST'); }
    var roll = Math.random();
    if (roll < 0.02) { mult *= 5; tags.push('JACKPOT'); }
    else if (roll < 0.12) { mult *= 2; tags.push('CRITICAL'); }
    return { xp: Math.round(xp * mult), tags: tags };
  }

  /* 宝箱：天井付き。パーフェクトでレア度アップ */
  function rollChest(perfect, minTier) {
    S.pity++;
    S.stats.chests++;
    var r = Math.random() - (perfect ? 0.06 : 0);
    var tier = r < 0.015 || S.pity >= 30 ? 'legendary' : r < 0.09 ? 'epic' : r < 0.32 ? 'rare' : 'common';
    var ORDER = ['common', 'rare', 'epic', 'legendary'];
    if (minTier && ORDER.indexOf(tier) < ORDER.indexOf(minTier)) tier = minTier;
    var loot = { tier: tier, xp: 0, label: '', sub: '' };
    if (tier === 'legendary') {
      S.pity = 0; S.stats.legendary++;
      var locked = Object.keys(THEMES).filter(function (k) { return THEMES[k].legendary && S.themes.indexOf(k) < 0; });
      loot.xp = 300;
      if (locked.length) { var th = locked[rand(0, locked.length - 1)]; S.themes.push(th); loot.label = 'テーマ「' + THEMES[th].name + '」'; loot.sub = '実績画面で切替できます'; loot.theme = th; }
      else { loot.xp = 500; loot.label = 'XP 大量ボーナス'; }
    } else if (tier === 'epic') {
      S.items.boost++; loot.xp = 100; loot.label = 'XPブースト ×2'; loot.sub = '次のセットのXPが2倍';
    } else if (tier === 'rare') {
      if (S.streak.freezes < 3 && Math.random() < 0.5) { S.streak.freezes++; loot.label = 'ストリークフリーズ'; loot.sub = '1日休んでも記録が守られる'; loot.xp = 30; }
      else { loot.xp = rand(80, 130); loot.label = 'XP ボーナス'; }
    } else {
      loot.xp = rand(20, 50); loot.label = 'XP';
    }
    return loot;
  }

  function addXp(n) {
    var before = levelInfo(S.totalXp).level;
    S.totalXp += n;
    today().xp += n;
    var after = levelInfo(S.totalXp).level;
    return after > before ? { from: before, to: after } : null;
  }

  window.Core = {
    get S() { return S; },
    load: load, save: save, defaults: defaults,
    examDef: examDef, rule: rule, firstTheme: function () { return FIRST_THEME; }, COURSE: C, migratedFrom: function () { return migratedFrom; },
    QMAP: QMAP, FMAP: FMAP, CMAP: CMAP, THEMES: THEMES, ACH: ACH, TITLES: TITLES,
    dayKey: dayKey, dayDiff: dayDiff, shuffle: shuffle, rand: rand,
    retr: retr, strength: strength, review: review, fmtIvl: fmtIvl,
    today: today, buildQueue: buildQueue, dueList: dueList, newList: newList,
    fieldStats: fieldStats, predict: predict, curve: curve,
    levelInfo: levelInfo, titleFor: titleFor, xpNeed: xpNeed,
    checkAch: checkAch, ensureQuests: ensureQuests, questEvent: questEvent,
    checkStreak: checkStreak, touchStreak: touchStreak, STREAK_MIN: STREAK_MIN,
    LMAP: LMAP, ALL_CARDS: ALL_CARDS, Q2CARD: Q2CARD, CARD2Q: CARD2Q, TIERS: TIERS,
    cardTier: cardTier, cardProgress: cardProgress, markRead: markRead, owned: owned, unitStats: unitStats, unitCleared: unitCleared,
    isLearned: isLearned, learnedCount: learnedCount, Q2LESSON: Q2LESSON,
    calcXp: calcXp, rollChest: rollChest, addXp: addXp,
    /* このコースだけリセット（XP・ストリークなど全コース共通のプロフィールは残す） */
    reset: function () { var keep = {}; PROFILE_FIELDS.forEach(function (f) { keep[f] = S[f]; }); S = defaults(); PROFILE_FIELDS.forEach(function (f) { S[f] = keep[f]; }); save(); return S; },
    replace: function (obj) { S = merge(defaults(), obj); save(); return S; }
  };
})();
