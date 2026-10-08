/* =========================================================
 * かやのき版（書籍の目次順）の組み立て道具 K
 *  基本情報コース（courses/fe）のレッスン・問題・カードを読み込んだあとに実行し、
 *  ユニット／レッスンをいったん片付けてから、書籍の「章＝ユニット」「節＝レッスン」に組み直す。
 *  元のレッスンの説明（ステップ）は「キーワードで指して」借りるので、基本情報コース側を直すとこちらにも反映される。
 *
 *  K.chapter({ id:'c1', name, icon, color, desc, boss:{name, ico} })
 *  K.lesson('c1', { id:'k1-01', no:'1-01', title, goal, from:['u1-1', …], steps:[…], card:{…} | 'u1-1' })
 *     from … 問題を引き継ぐ元レッスン。元レッスンの問題は、from に挙げた新レッスンのうち、
 *            説明の内容がいちばん近いレッスンに自動で振り分ける（qPin で個別指定も可）
 *     card … 復習カード。元レッスンID（文字列）なら元のカードを流用。vizFind はこのレッスンの図に合わせること
 *  K.S(元レッスンID, キーワード)            … キーワードを含むステップ1つ（複製）
 *  K.R(元レッスンID, 先頭キーワード, 末尾キーワード) … その範囲のステップ（複製の配列）
 *  K.P(ステップ, {上書き})                  … ステップの一部を書きかえた複製（つなぎの言葉を直すとき）
 *  K.recap(元レッスンID, [番号…])            … 元レッスンのまとめから要点を選ぶ
 *  K.qPin(新レッスンID, [問題ID…])          … 自動振り分けより優先して、その問題をそのレッスンに
 *  K.finish()                                … 最後に呼ぶ（問題の振り分け・検査）
 *  K.lenient = true                          … 作成途中用：まだ節のない元レッスンの問題を、いったん外す（完成したら消す）
 * ========================================================= */
(function () {
  'use strict';
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  /* 元（基本情報コース）の状態を保存して、ユニット・レッスン・カード・ボスを空にする */
  var SRC = {}, SRC_CARD = LE.cardDefs || {};
  Object.keys(LE.lessonDefs).forEach(function (id) { SRC[id] = LE.lessonDefs[id]; });
  LE.units.length = 0;
  LE.lessonDefs = {};
  LE.cardDefs = {};
  LE.bosses = {};

  var used = {}, pins = {}, kOrder = [];
  function srcL(id) { var L = SRC[id]; if (!L) throw new Error('K: 元レッスンがない ' + id); return L; }
  function textOf(s) {
    var t = [s.text, s.q, s.word, s.short, s.ex, s.reveal, s.ok, s.goal];
    (s.frames || []).forEach(function (f) { t.push(f.say, f.reveal); });
    (s.steps || []).forEach(function (x) { t.push(x); });
    (s.pairs || []).forEach(function (p) { t.push(p.join(' ')); });
    (s.o || []).forEach(function (o) { t.push(typeof o === 'string' ? o : (o && o.t)); });
    (s.points || []).forEach(function (p) { t.push(typeof p === 'string' ? p : p.q + ' ' + p.a); });
    return t.filter(Boolean).join(' ');
  }
  function find(id, key) {
    var L = srcL(id), hit = [];
    L.steps.forEach(function (s, i) { if (textOf(s).indexOf(key) >= 0) hit.push(i); });
    if (hit.length !== 1) throw new Error('K: ' + id + ' で「' + key + '」を含むステップが ' + hit.length + ' 個（1個になるようにキーワードを長くする）');
    return hit[0];
  }
  var K = window.K = {};
  K.S = function (id, key) { var i = find(id, key); used[id] = true; return clone(srcL(id).steps[i]); };
  K.R = function (id, a, b) {
    var i = find(id, a), j = find(id, b);
    if (j < i) throw new Error('K.R: 範囲が逆 ' + id + ' ' + a + '〜' + b);
    used[id] = true;
    return clone(srcL(id).steps.slice(i, j + 1));
  };
  K.P = function (s, patch) { var c = clone(s); Object.keys(patch).forEach(function (k) { c[k] = patch[k]; }); return c; };
  K.recap = function (id, idx) {
    var r = srcL(id).steps.filter(function (s) { return s.t === 'recap'; })[0];
    if (!r) throw new Error('K.recap: まとめがない ' + id);
    return idx.map(function (i) { if (r.points[i] == null) throw new Error('K.recap: ' + id + ' の要点 ' + i + ' がない'); return clone(r.points[i]); });
  };
  K.card = function (id) { if (!SRC_CARD[id]) throw new Error('K.card: 元カードがない ' + id); return clone(SRC_CARD[id]); };
  K.src = function (id) { return srcL(id); };
  K.chapter = function (u) {
    var boss = u.boss; delete u.boss;
    LE.unit(u);
    LE.bosses[u.id] = boss || { name: u.name + 'の番人', ico: '👾' };
  };
  K.lesson = function (unitId, L) {
    var card = L.card, from = L.from || []; delete L.card;
    L.steps = [].concat.apply([], L.steps.map(function (s) { return Array.isArray(s) ? s : [s]; }));
    LE.defLesson(unitId, L);
    L.from = from;
    from.forEach(srcL);
    if (card) LE.cardDefs[L.id] = typeof card === 'string' ? K.card(card) : card;
    kOrder.push(L.id);
  };
  K.qPin = function (lid, ids) { ids.forEach(function (q) { pins[q] = lid; }); };

  /* 問題の振り分け：文字の2文字組（バイグラム）の重なりで、いちばん近いレッスンへ */
  function grams(t) {
    t = String(t || '').replace(/<[^>]+>|\*\*|__|\(\(|\)\)|\[\[|\]\]|[\s、。・（）()「」：:？?！!0-9０-９]/g, '');
    var g = {}; for (var i = 0; i < t.length - 1; i++) g[t.substr(i, 2)] = 1; return g;
  }
  K.finish = function () {
    var gs = {};
    kOrder.forEach(function (id) { var L = LE.lessonDefs[id]; gs[id] = grams(L.title + ' ' + L.goal + ' ' + L.steps.map(textOf).join(' ')); });
    var byQ = {}; LE.questions.forEach(function (q) { byQ[q.id] = q; });
    var dest = {};
    Object.keys(SRC).forEach(function (sid) {
      var cands = kOrder.filter(function (id) { return LE.lessonDefs[id].from.indexOf(sid) >= 0; });
      SRC[sid].q.forEach(function (qid) {
        if (pins[qid]) { dest[qid] = pins[qid]; return; }
        if (!cands.length && K.lenient) { (K.orphans = K.orphans || []).push(qid); return; }
        if (!cands.length) throw new Error('K.finish: 元レッスン ' + sid + ' の問題 ' + qid + ' の行き先がない（どこかの from に ' + sid + ' を入れる）');
        var q = byQ[qid], qg = grams(q.q + ' ' + q.o.join(' ') + ' ' + (q.e || '')), best = null, bs = -1;
        cands.forEach(function (id) {
          var g = gs[id], sc = 0; Object.keys(qg).forEach(function (k) { if (g[k]) sc++; });
          if (sc > bs) { bs = sc; best = id; }
        });
        dest[qid] = best;
      });
    });
    Object.keys(pins).forEach(function (qid) { dest[qid] = pins[qid]; });
    /* 作成途中（K.lenient）：行き先のない問題は、いったん外す */
    if (K.orphans) { var drop = {}; K.orphans.forEach(function (q) { drop[q] = 1; }); for (var i = LE.questions.length - 1; i >= 0; i--) if (drop[LE.questions[i].id] && !dest[LE.questions[i].id]) LE.questions.splice(i, 1); }
    Object.keys(dest).forEach(function (qid) {
      var L = LE.lessonDefs[dest[qid]];
      if (!L) throw new Error('K.finish: 行き先レッスンがない ' + dest[qid]);
      if (L.q.indexOf(qid) < 0) L.q.push(qid);
    });
    /* 元レッスンで、説明を1つも借りていないものがあれば知らせる（内容の取りこぼし防止） */
    var unused = Object.keys(SRC).filter(function (id) { return !used[id]; });
    if (unused.length && window.console) console.warn('K: 説明を借りていない元レッスン: ' + unused.join(', '));
    K.dest = dest;
  };
})();
