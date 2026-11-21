/* =========================================================
 * CHARLA のチェック（node で実行）
 *   node tests/check-charla.js [<ダイアログの id>]
 *  dialog.json（TTS ツールが書き出す）と notes.json（こちらで作る）を確かめる。
 *    ・dialog.json：仕様（docs/ダイアログ音声の書き出し仕様.md）どおりか・時刻の順
 *    ・notes.json：訳がセリフの数だけあるか／台本の語がすべて引けるか（notes → 共通単語帳）
 *                  言い回しが台本に出てくるか
 *    ・全部の語を単語アプリに送ったとして、単語アプリのチェック（deck-check）に通るか
 *  エラーがあれば終了コード 1。
 * ========================================================= */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var root = path.join(__dirname, '..');
var ctx = { window: {}, console: console };
vm.createContext(ctx);
['vocab/js/conj-es.js', 'vocab/js/deck-check.js', 'shared/es-words.js', 'charla/dialogs/list.js', 'charla/js/text.js'].forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx);
});
var W = ctx.window, T = W.CharlaText, Conj = W.Conj, DeckCheck = W.DeckCheck;
var only = process.argv[2];
var errs = 0, warns = 0, seen = {};
function E(where, m) { errs++; console.log('  ✖ ' + where + '：' + m); }
function Wn(where, m) { warns++; console.log('  ⚠ ' + where + '：' + m); }

var deck = { id: 'charla-check', title: 'チェック', brand: 'CHECK', lang: 'es', sections: [], words: [] };
var listIds = W.CHARLA_DIALOGS.map(function (d) { return d.series + '/' + d.id; }), guides = {};
fs.readdirSync(path.join(root, 'charla/dialogs')).forEach(function (sid) {
  var sd = path.join(root, 'charla/dialogs', sid);
  if (!fs.statSync(sd).isDirectory() || sid.charAt(0) === '_') return;   /* _受け取り などは見ない */
  var S = W.CHARLA_SERIES.filter(function (x) { return x.id === sid; })[0];
  if (!S) { errs++; console.log('✖ charla/dialogs/' + sid + ' のシリーズが list.js にない'); return; }
  fs.readdirSync(sd).forEach(function (id) {
    if (fs.statSync(path.join(sd, id)).isDirectory() && listIds.indexOf(sid + '/' + id) < 0) { errs++; console.log('✖ charla/dialogs/' + sid + '/' + id + ' が list.js にない'); }
  });
  if (S.guide) {
    try { guides[sid] = T.parseGuide(fs.readFileSync(path.join(sd, S.guide), 'utf8')); } catch (e) { errs++; console.log('✖ ' + sid + '/' + S.guide + ' が読めない'); }
  }
});

W.CHARLA_DIALOGS.forEach(function (it) {
  if (only && it.id !== only) return;
  var dir = path.join(root, it.base);
  console.log('■ ' + it.series + '/' + it.id + '（第' + it.no + '話 ' + it.title + '）');
  var D, N;
  try { D = JSON.parse(fs.readFileSync(path.join(dir, 'dialog.json'), 'utf8')); } catch (e) { return E('dialog.json', '読めない ' + e.message); }
  try { N = JSON.parse(fs.readFileSync(path.join(dir, 'notes.json'), 'utf8')); } catch (e) { return E('notes.json', '読めない ' + e.message); }
  N.names = (N.names || []).concat(W.CHARLA_SERIES.filter(function (x) { return x.id === it.series; })[0].names || []);
  if (!fs.existsSync(path.join(dir, D.audio || 'audio.mp3'))) E('audio', (D.audio || 'audio.mp3') + ' がない');
  if (D.format !== 1) E('dialog.json', 'format が 1 ではない（仕様が変わった？）');
  if (D.id !== it.id) E('dialog.json', 'id「' + D.id + '」がフォルダ名とちがう');
  if (D.title.replace(/^(?:[A-Z]+-)?\d+\s+/, '').replace(/^La Prórroga: e/, 'E') !== it.title) Wn('list.js', '題が dialog.json（' + D.title + '）とちがう');
  var prevEnd = 0;
  D.lines.forEach(function (l, i) {
    var at = 'セリフ' + (i + 1);
    if (l.index !== i) E(at, 'index が ' + l.index);
    if (!(l.startMs < l.endMs)) E(at, 'startMs < endMs でない');
    if (l.startMs < prevEnd) E(at, '前のセリフと時刻が重なる');
    prevEnd = l.endMs;
    if (/[<>]|^\s*\(/.test(l.text)) E(at, 'text に TTS への指示が残っている');
  });
  if (prevEnd > D.durationMs) E('dialog.json', '最後の endMs が durationMs を越える');

  /* 訳：guide.md の本文の表（あれば）→ notes.json の lines */
  var G = guides[it.series], ep = G && G.eps[it.no];
  if (G && !ep) E('guide.md', '「## 第' + it.no + '話」がない');
  if (ep) {
    var rows = ep.rows.filter(function (r) { return r.no; });
    if (rows.length !== D.lines.length) E('guide.md', '第' + it.no + '話の本文の行（' + rows.length + '）がセリフの数（' + D.lines.length + '）とちがう');
    rows.forEach(function (r, i) {
      if (r.no !== i + 1) E('guide.md', '本文の # が ' + r.no + '（' + (i + 1) + ' のはず）');
      var l = D.lines[i]; if (!l) return;
      if (r.es !== l.text) E('guide.md', 'セリフ' + (i + 1) + ' のスペイン語が音声の台本とちがう：「' + r.es + '」／「' + l.text + '」');
      if (!r.ja) E('guide.md', 'セリフ' + (i + 1) + ' の訳がない');
      l.ja = r.ja;
    });
  }
  D.lines.forEach(function (l, i) { if (!l.ja && N.lines && N.lines[i]) l.ja = N.lines[i].ja; if (!l.ja) E('訳', 'セリフ' + (i + 1) + ' の訳がない（guide.md の本文か notes.json の lines に）'); });
  if (!N.sceneJa) Wn('notes.json', 'sceneJa（場面の説明）がない。単語アプリの手がかりに使う');
  var dict = new T.Dict(N, W.ES_WORDS), unknown = {}, usedPh = {};
  var section = { id: D.id, name: D.title };
  deck.sections.push(section);
  D.lines.forEach(function (l, i) {
    dict.line(l.text, i + 1).forEach(function (t) {
      var ws = t.t === 'ph' ? t.toks : [t];
      if (t.t === 'ph') {
        usedPh[t.ph.t] = 1;
        var rp = T.toVocab({ kind: 'p', w: t.ph.t, pos: 'phr', ja: t.ph.ja, surf: t.s, line: i, note: t.ph.note || '' }, D, N);
        if (rp.word) addWord(rp.word); else E('セリフ' + (i + 1), '「' + t.ph.t + '」を単語アプリに送れない：' + rp.why);
      }
      ws.forEach(function (x) {
        if (x.t !== 'w') return;
        if (!x.g) { unknown[x.k] = (unknown[x.k] || 0) + 1; return; }
        if (x.g.name || x.g.src !== 'notes' || ['art', 'prep'].indexOf(x.g.pos) >= 0) return;
        var r = T.toVocab({ kind: 'w', w: x.g.w, pos: x.g.pos, g: x.g.g, ja: x.g.ja, surf: x.s, line: i, form: x.g.form, note: x.g.note, clue: x.g.clue, cj: x.g.cj }, D, N);
        if (r.word) addWord(r.word); else E('セリフ' + (i + 1), '「' + x.s + '」を単語アプリに送れない：' + r.why);
      });
    });
  });
  Object.keys(unknown).forEach(function (k) { E('notes.json', '「' + k + '」の意味がない（notes.json の words か shared/es-words.js に足す）'); });
  (N.phrases || []).forEach(function (p) { if (!usedPh[p.t]) Wn('notes.json', '言い回し「' + p.t + '」が台本に出てこない（語の並び・空白を確かめる）'); });
  Object.keys(N.words || {}).forEach(function (k) {
    var g = N.words[k];
    if (k !== k.toLowerCase()) E('notes.json', 'words のキー「' + k + '」は小文字で');
    /* 「語#番号」＝そのセリフだけの意味。そのセリフにその語があるか */
    var mm = /^(.+)#(\d+)(?:\.\d+)?$/.exec(k);
    if (mm) {
      var ln = D.lines[+mm[2] - 1];
      if (!ln) E('notes.json', '「' + k + '」：セリフ' + mm[2] + ' がない');
      else if (!T.split(ln.text).some(function (t) { return t.t === 'w' && t.k === mm[1]; })) E('notes.json', '「' + k + '」：セリフ' + mm[2] + ' に「' + mm[1] + '」がない');
    }
    if (!g || !g.w || !g.ja || !g.pos) E('notes.json', '「' + k + '」に w・ja・pos が必要');
    else if (g.pos === 'n' && !g.g) E('notes.json', '名詞「' + k + '」に g（m／f／mf）が必要');
  });
});

/* 単語アプリのチェック：同じ見出し語は1つ（最初のセリフ）だけ */

function addWord(w) {
  var k = w.w.toLowerCase();
  if (seen[k]) return;
  seen[k] = 1;
  var base = w.id, n = 2;
  while (deck.words.some(function (x) { return x.id === w.id; })) w.id = base + '_' + (n++);
  if (w.pos === 'v' && w.cj && !Conj.checkIrr(w.cj).length) Conj.addIrr(w.w, w.cj);
  deck.words.push(w);
}
if (deck.words.length) {
  var r = DeckCheck.check(deck, Conj);
  console.log('■ 単語アプリに全部送ったとき（' + deck.words.length + '語）');
  r.errors.forEach(function (e) { E('deck', e); });
  r.warnings.forEach(function (e) { Wn('deck', e); });
}
console.log(errs ? '\n✖ エラー ' + errs + '件' : '\n✔ エラーなし' + (warns ? '（注意 ' + warns + '件）' : ''));
process.exit(errs ? 1 : 0);
