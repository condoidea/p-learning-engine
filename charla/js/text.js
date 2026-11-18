/* =========================================================
 * charla/js/text.js — 文の切り分け・語の意味・単語アプリへの変換
 *  画面に関係しない部分。ブラウザと node（tests/check-charla.js）の両方で使う。
 * ========================================================= */
(function (root) {
  'use strict';
  var WORD = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g;

  function lower(s) { return String(s).toLowerCase(); }
  /* アクセント記号・ñ の波を外した形 */
  function bare(s) { return lower(s).normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  /* 単語アプリの id（アクセントと ñ を外す・空白は _） */
  function slug(s) { return bare(s).replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, ''); }

  /* 文を語と、語でない所（空白・記号）に分ける */
  function split(text) {
    var out = [], last = 0, m;
    WORD.lastIndex = 0;
    while ((m = WORD.exec(text))) {
      if (m.index > last) out.push({ t: 'x', s: text.slice(last, m.index) });
      out.push({ t: 'w', s: m[0], k: lower(m[0]) });
      last = m.index + m[0].length;
    }
    if (last < text.length) out.push({ t: 'x', s: text.slice(last) });
    return out;
  }

  /* 語の意味を引く辞書を作る：notes.json の words・phrases → 共通単語帳（shared/es-words.js） */
  function Dict(notes, esWords) {
    this.n = notes || {};
    this.words = this.n.words || {};
    this.names = {};
    var self = this;
    (this.n.names || []).concat(esWords && esWords.names || []).forEach(function (x) { self.names[lower(x)] = 1; });
    this.phr = (this.n.phrases || []).map(function (p) { return { p: p, ws: lower(p.t).split(/\s+/) }; })
      .sort(function (a, b) { return b.ws.length - a.ws.length; });
    this.es = {};
    (esWords && esWords.words || []).forEach(function (e) {
      if (e.pos === 'bad' || /（/.test(e.w)) return;
      [e.w].concat(e.f || []).forEach(function (f) { var k = lower(f); if (!self.es[k]) self.es[k] = e; });
    });
  }
  /* 1語の意味：{ w 見出し語, pos, g, ja, form, note, key, clue, cj, src } か null */
  Dict.prototype.word = function (k) {
    var g = this.words[k];
    if (g) return { w: g.w, pos: g.pos, g: g.g, ja: g.ja, form: g.form, note: g.note, key: !!g.key, clue: g.clue, cj: g.cj, src: 'notes' };
    if (this.names[k]) return { name: true };
    var e = this.es[k];
    if (e) return { w: e.w, pos: e.pos, ja: e.ja, form: lower(e.w) !== k ? e.w + ' の変化した形' : '', key: false, src: 'es-words' };
    return null;
  };
  /* 1つのセリフを、語・言い回し（phrases）・記号の並びにする
   *  言い回しは語の並びが一致したとき（間は空白だけ）。長いものから先に取る */
  Dict.prototype.line = function (text) {
    var toks = split(text), out = [], i = 0, self = this;
    while (i < toks.length) {
      var t = toks[i];
      if (t.t !== 'w') { out.push(t); i++; continue; }
      var hit = null;
      for (var p = 0; p < self.phr.length && !hit; p++) {
        var ws = self.phr[p].ws, j = i, n = 0, ok = true;
        while (n < ws.length) {
          if (j >= toks.length || toks[j].t !== 'w' || toks[j].k !== ws[n]) { ok = false; break; }
          n++; j++;
          if (n < ws.length) { if (j < toks.length && toks[j].t === 'x' && /^\s+$/.test(toks[j].s)) j++; else { ok = false; break; } }
        }
        if (ok) hit = { ph: self.phr[p].p, end: j };
      }
      if (hit) {
        var inner = toks.slice(i, hit.end).map(function (x) { return x.t === 'w' ? { t: 'w', s: x.s, k: x.k, g: self.word(x.k) } : x; });
        out.push({ t: 'ph', ph: hit.ph, s: toks.slice(i, hit.end).map(function (x) { return x.s; }).join(''), toks: inner });
        i = hit.end;
      } else {
        out.push({ t: 'w', s: t.s, k: t.k, g: self.word(t.k) });
        i++;
      }
    }
    return out;
  };

  /* ---------- 単語アプリ（¡VAMOS!）のデッキの1語にする ----------
   *  rec：調べた記録 { kind:'w'|'p', w, pos, g, ja, surf, line, note, form, clue, cj }
   *  dlg：dialog.json、notes：notes.json。返り値 { word } または { why：送れない理由 } */
  var POS_OK = { n: 'n', v: 'v', adj: 'adj', adv: 'adv', phr: 'phr' };
  function toVocab(rec, dlg, notes) {
    var line = dlg.lines[rec.line], lineJa = notes.lines && notes.lines[rec.line] && notes.lines[rec.line].ja;
    if (!line) return { why: 'セリフが見つからない' };
    var pos = rec.kind === 'p' ? 'phr' : (POS_OK[rec.pos] || 'phr');
    if (pos === 'n' && !rec.g) return { why: '名詞の性が分からない' };
    var at = line.text.toLowerCase().indexOf(String(rec.surf).toLowerCase());
    if (at < 0) return { why: '例文の中に見つからない' };
    var ex = line.text.slice(0, at) + '{' + line.text.slice(at, at + rec.surf.length) + '}' + line.text.slice(at + rec.surf.length);
    var w = { id: slug(rec.w), s: dlg.id, ref: 'セリフ' + (rec.line + 1), w: rec.w, pos: pos, ja: rec.ja,
      ex: [ex, lineJa || ''], clue: rec.clue || { t: 'ctx', text: notes.sceneJa || '💬 会話の一場面' } };
    if (pos === 'n') w.g = rec.g;
    if (pos === 'v' && rec.cj) w.cj = rec.cj;
    var memo = [rec.note, rec.kind === 'w' && rec.form && rec.surf.toLowerCase() !== rec.w.toLowerCase() ? '会話では ' + rec.surf + '（' + rec.form + '）' : ''].filter(Boolean).join('。');
    if (memo) w.memo = memo;
    if (!w.ex[1]) return { why: 'セリフの訳がない' };
    return { word: w };
  }

  var api = { split: split, Dict: Dict, bare: bare, slug: slug, toVocab: toVocab };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.CharlaText = api;
})(typeof window !== 'undefined' ? window : this);
