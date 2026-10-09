/* =========================================================
 * vocab/deck-check.js — 単語デッキのデータを確かめる
 *  ブラウザ（読み込み画面）と node（tests/check-vocab-deck.js）の両方で使う。
 *  形式の説明は docs/単語データの作り方.md
 *    errors   直さないと使えない
 *    warnings 直したほうがよい（答えがばれる手がかり、例文の { } の形が活用と合わない など）
 *    verbs    くせ（cj）が書かれていない動詞は規則動詞として活用する → その結果を見て確かめる
 * ========================================================= */
(function (root) {
  'use strict';
  var POS = ['n', 'v', 'adj', 'adv', 'phr'];
  var CLUE = ['cog', 'trap', 'parts', 'ctx'];
  var TENSES = ['pres', 'pret', 'impf', 'perf', 'fut', 'cond', 'subj', 'imp'];
  var BUILTIN = ['spanish'];

  function check(D, Conj, opt) {
    opt = opt || {};
    var E = [], Wn = [], verbs = [];
    function err(where, msg) { E.push(where + '：' + msg); }
    function warn(where, msg) { Wn.push(where + '：' + msg); }
    if (!D || typeof D !== 'object') return { errors: ['データが読めない（JSON のオブジェクトではない）'], warnings: [], verbs: [] };
    if (!/^[a-z0-9-]{2,40}$/.test(D.id || '')) err('id', '英小文字・数字・ハイフンで2〜40文字（例 spanish-nuevo1）');
    if (!opt.builtin && BUILTIN.indexOf(D.id) >= 0) err('id', '「' + D.id + '」はアプリに入っているデッキと同じ。別の id にする');
    ['title', 'brand'].forEach(function (k) { if (typeof D[k] !== 'string' || !D[k]) err(k, '文字列で必須'); });
    if (D.lang && D.lang !== 'es') warn('lang', 'いまの活用エンジンはスペイン語（es）だけ');
    var secs = {};
    if (!Array.isArray(D.sections) || !D.sections.length) err('sections', '区間（参考書の課）を1つ以上');
    else D.sections.forEach(function (s, i) {
      var at = 'sections[' + i + ']';
      if (!s || !/^[A-Za-z0-9_-]+$/.test(s.id || '')) err(at, 'id は英数字・_・-');
      else if (secs[s.id]) err(at, 'id「' + s.id + '」が重複');
      else secs[s.id] = 0;
      if (!s || typeof s.name !== 'string' || !s.name) err(at, 'name（例「第3課 家族」）が必須');
    });
    if (!Array.isArray(D.words) || !D.words.length) { err('words', '単語が1つもない'); return { errors: E, warnings: Wn, verbs: verbs }; }
    var ids = {}, spell = {};
    D.words.forEach(function (w, i) {
      var at = 'words[' + i + ']' + (w && w.w ? '（' + w.w + '）' : '');
      if (!w || typeof w !== 'object') return err(at, 'オブジェクトではない');
      if (!/^[a-z0-9_-]+$/.test(w.id || '')) err(at, 'id は英小文字・数字・_・-（アクセント記号やñは使わない：niño → nino）');
      else if (ids[w.id]) err(at, 'id「' + w.id + '」が重複（' + ids[w.id] + ' と）');
      else ids[w.id] = at;
      if (!(w.s in secs)) err(at, 's「' + w.s + '」が sections にない');
      else secs[w.s]++;
      if (typeof w.w !== 'string' || !w.w) err(at, 'w（つづり）が必須');
      else if (/[～〜~＋+…()（）]|動詞|原形|不定詞|algo|alguien/.test(w.w)) warn(at, 'w には、そのまま言う形だけを書く（例 "contento de"）。「＋動詞の原形」などの型は use に書く');
      if (w.use != null && (typeof w.use !== 'string' || !w.use)) err(at, 'use は文字列（例 "estar contento de ＋ 動詞の原形"）');
      if (POS.indexOf(w.pos) < 0) err(at, 'pos は ' + POS.join('/') + ' のどれか');
      if (w.pos === 'n' && ['m', 'f', 'mf'].indexOf(w.g) < 0) err(at, '名詞は g（m＝男性・f＝女性・mf＝el/la どちらも同じ形）が必須');
      if (w.w && /,\s*-|\/\s*-|\(-/.test(w.w)) warn(at, 'w には男性形だけを書く（例 "ingeniero"）。女性形は fem に（"ingeniera"）。形容詞の「-ta」などは書かなくてよい');
      if (w.fem != null) { if (typeof w.fem !== 'string' || !w.fem || /\s|-/.test(w.fem)) err(at, 'fem は女性形のつづり（例 "ingeniera"）'); else if (w.pos !== 'n') warn(at, 'fem は名詞だけ（形容詞の女性形は書かなくてよい）'); }
      if (w.art && ['el', 'la', 'los', 'las'].indexOf(w.art) < 0) err(at, 'art は el/la/los/las');
      if (typeof w.ja !== 'string' || !w.ja) err(at, 'ja（意味）が必須');
      if (w.w && spell[w.w]) warn(at, '同じつづりが ' + spell[w.w] + ' にもある（同じ語なら1つにまとめ、ref に両方のページを書く）');
      else if (w.w) spell[w.w] = at;
      /* 例文 */
      if (!Array.isArray(w.ex) || w.ex.length !== 2 || typeof w.ex[0] !== 'string' || typeof w.ex[1] !== 'string') err(at, 'ex は ["スペイン語の例文", "日本語訳"]');
      else {
        var m = w.ex[0].match(/\{([^{}]+)\}/g);
        if (!m) err(at, '例文に { } がない（この単語の所を { } で囲む）');
        else if (m.length > 1) err(at, '例文の { } は1か所だけ');
        else if (w.pos === 'v' && Conj && w.w && !/(ar|er|ir|ír)(se)?$/.test(w.w)) err(at, '動詞の w は原形（-ar・-er・-ir、再帰動詞は -se）で書く');
        else if (w.pos === 'v' && Conj && w.w) {
          var f = m[0].slice(1, -1), forms = formsOf(w.w, Conj);
          if (forms.indexOf(f.toLowerCase()) < 0) warn(at, '例文の {' + f + '} が ' + w.w + ' の活用形として作れない（活用のまちがい、または cj が必要）');
        } else if (w.w && w.pos !== 'phr') {
          var f2 = m[0].slice(1, -1).toLowerCase(), base = w.w.toLowerCase();
          if (f2.slice(0, 3) !== base.slice(0, 3)) warn(at, '例文の {' + m[0].slice(1, -1) + '} が単語「' + w.w + '」と形がかなりちがう');
        }
      }
      /* 予想の手がかり */
      if (!w.clue || CLUE.indexOf(w.clue.t) < 0) err(at, 'clue.t は ' + CLUE.join('/') + ' のどれか');
      else {
        if (typeof w.clue.text !== 'string' || !w.clue.text) err(at, 'clue.text が必須');
        if (w.clue.t === 'trap' && !w.clue.lure) err(at, 'trap には lure（思わず選んでしまう意味）が必須');
        if (w.clue.text && w.ja && w.ja.split(/[・、（）()]/).some(function (j) { return j.length >= 2 && w.clue.text.indexOf(j) >= 0; })) warn(at, '手がかりに意味（' + w.ja + '）がそのまま書いてある（答えがばれる）');
      }
      if (w.memo != null && typeof w.memo !== 'string') err(at, 'memo は文字列');
      if (w.ref != null && typeof w.ref !== 'string') err(at, 'ref は文字列（例 "p.42"）');
      /* 動詞のくせ */
      if (w.cj != null) {
        if (w.pos !== 'v') err(at, 'cj は動詞だけ');
        else if (Conj) Conj.checkIrr(w.cj).forEach(function (b) { err(at, 'cj：' + b); });
      }
      if (w.pos === 'v' && Conj && w.w && /(ar|er|ir|ír)(se)?$/.test(w.w) && !w.cj && !Conj.known(w.w)) {
        verbs.push({ w: w.w, at: at, sample: ['pres', 'pret', 'subj'].map(function (t) { return Conj.table(w.w, t).join(', '); }).concat(['未来 ' + Conj.form(w.w, 'fut', 0), '過去分詞 ' + Conj.part(w.w)]) });
      }
    });
    Object.keys(secs).forEach(function (k) { if (!secs[k]) warn('sections', '「' + k + '」に単語が1つもない'); });
    return { errors: E, warnings: Wn, verbs: verbs };
  }
  /* その動詞の作れる形（例文の { } と比べる） */
  function formsOf(inf, Conj) {
    var out = [inf.toLowerCase()], v = Conj.parse(inf);
    out.push(v.base, Conj.part(inf), v.stem + (v.cls === 'ar' ? 'ando' : 'iendo'));
    TENSES.forEach(function (t) { [0, 1, 2, 3, 4, 5].forEach(function (p) {
      var f; try { f = Conj.form(inf, t, p); } catch (e) { f = null; } if (!f) return;
      f = f.toLowerCase(); out.push(f);
      var parts = f.split(' '); if (parts.length > 1) out.push(parts[parts.length - 1], parts.slice(1).join(' '));
    }); });
    return out;
  }
  var api = { check: check, formsOf: formsOf };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.DeckCheck = api;
})(typeof window !== 'undefined' ? window : this);
