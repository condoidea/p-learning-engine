/* ¡PEGA! の教材チェック：node tests/check-pega.js [--words]
 *  ・語：id が重ならない／「語幹|語尾」の形と語尾タイルが合う／意味が重ならない（4択がこわれない）／性
 *  ・段階：1段階＝くらべる語尾2枚。入荷する語は8語以上・各語尾3語以上・同じ元の語の組が1つ以上
 *  ・初見チャレンジの語：語尾タイルが習う範囲にある
 *  ・文に合う形：答えの語がある／正解がその語の形／はずれが正解と重ならない／文の語が単語帳（shared/es-words.js）にある
 *  --words で、単語帳にない語の一覧だけを出す */
'use strict';
var D = require('../pega/js/data.js');
global.window = {};
require('../shared/es-words.js');
var DICT = {}, EW = global.window.ES_WORDS;
EW.words.forEach(function (e) { if (e.pos === 'bad') return; [e.w].concat(e.f).forEach(function (f) { DICT[f.toLowerCase()] = e; }); });
var errs = [];
function err(m) { errs.push(m); }

var END = { cion: /^(ción|sión)$/, dad: /^(dad|tad)$/, mente: /^mente$/, oso: /^(oso|osa)$/, ista: /^ista$/, ero: /^ero$/, eria: /^ería$/, dor: /^(dor|dora)$/ };
var SUFBY = {}, STOF = {}, ids = {}, jas = {}, core = D.STAGES.map(function () { return []; });
D.SUF.forEach(function (s) { SUFBY[s.id] = s; if (!END[s.id]) err('語尾の形が未登録: ' + s.id); if (!D.KINDS[s.kind]) err('kind がない: ' + s.id); ['label', 'grp', 'role', 'color', 'short'].forEach(function (k) { if (!s[k]) err(s.id + ' に ' + k + ' がない'); }); });
D.STAGES.forEach(function (st, i) {
  if (!st.ids || st.ids.length !== 2) err('段階は語尾2枚ずつ（くらべる）: ' + i);
  st.ids.forEach(function (id) { if (!SUFBY[id]) err('段階に知らない語尾: ' + id); STOF[id] = i; });
  if (!st.rule) err('段階にきまりがない: ' + i);
});
D.SUF.forEach(function (s) { if (STOF[s.id] == null) err('どの段階にもない語尾: ' + s.id); });

D.WORDS.forEach(function (w) {
  if (!SUFBY[w.sf]) { err('知らない語尾: ' + w.id); return; }
  if (ids[w.id]) err('id が重なる: ' + w.id); ids[w.id] = w;
  var p = w.w.split('|'), sfs = w.sfs || [w.sf];
  if (p.length !== sfs.length + 1 || !p[0]) err('形がおかしい: ' + w.w);
  sfs.forEach(function (id, i) { if (!END[id] || !END[id].test(p[i + 1] || '')) err('語尾タイルと形が合わない: ' + w.w + '（' + id + '）'); });
  if (sfs[sfs.length - 1] !== w.sf) err('sfs の最後は sf と同じに: ' + w.id);
  if (jas[w.ja]) err('意味が重なる: ' + w.ja + '（' + w.id + '・' + jas[w.ja] + '）'); jas[w.ja] = w.id;
  if (!w.base || !w.bja || !w.ja) err('空の欄: ' + w.id);
  if (['cion', 'dad', 'eria'].indexOf(w.sf) >= 0 && w.g !== 'f') err('女性名詞のはず: ' + w.id);
  if (w.sf === 'ista' && w.g !== 'mf') err('-ista は mf: ' + w.id);
  if (['mente', 'oso'].indexOf(w.sf) >= 0 && w.g) err('名詞ではない語に性がある: ' + w.id);
  if (w.sf === 'mente' && /o$/.test(w.base) && !/a$/.test(p[p.length - 2])) err('-a に変えていない: ' + w.id);
  (w.bad || []).forEach(function (b) { if (ids[b] || b === w.id) err('ひっかけが実在の語: ' + b); });
  if (sfs.length > 1 && (!w.root || !w.rja)) err('語尾が2枚の語には root・rja を: ' + w.id);
  if (!w.x) core[Math.max.apply(null, sfs.map(function (s) { return STOF[s]; }))].push(w);
  else if (sfs.length > 1 && !ids[w.base]) err('語尾が2枚の語の元の語（' + w.base + '）が、語の一覧にない: ' + w.id);
});
core.forEach(function (list, i) {
  if (list.length < 8) err('段階 ' + (i + 1) + ' の入荷する語が ' + list.length + '（8語以上）');
  D.STAGES[i].ids.forEach(function (id) { var n = list.filter(function (w) { return w.sf === id; }).length; if (n < 3) err(id + ' の入荷する語が ' + n + '（3語以上）'); });
  var b = {}; list.forEach(function (w) { (b[w.base] = b[w.base] || {})[w.sf] = 1; });
  if (!D.STAGES[i].nopair && !Object.keys(b).some(function (k) { return Object.keys(b[k]).length > 1; })) err('段階 ' + (i + 1) + ' に、同じ元の語から2枚でできる組がない（くらべて見せる）');
});

/* 文に合う形 */
var missing = {};
D.CLOZE.forEach(function (c) {
  var w = ids[c.w];
  if (!w) { err('文の答えの語がない: ' + c.id + ' ' + c.w); return; }
  if ((c.s.match(/___/g) || []).length !== 1) err('空所は1つ: ' + c.id);
  if (c.opts.length < 2) err('選択肢が少ない: ' + c.id);
  var stem = w.w.split('|')[0].slice(0, 4).toLowerCase();
  if (c.opts[0].toLowerCase().indexOf(stem) !== 0) err('正解が答えの語の形ではない: ' + c.id + ' ' + c.opts[0]);
  if (c.opts.some(function (o, i) { return c.opts.indexOf(o) !== i; })) err('選択肢が重なる: ' + c.id);
  if (!c.ja || !c.why) err('訳・なぜ がない: ' + c.id);
  c.s.replace(/___/, ' ').split(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/).forEach(function (t) {
    if (!t || EW.names.indexOf(t) >= 0) return;
    if (!DICT[t.toLowerCase()]) missing[t.toLowerCase()] = c.id;
  });
});
var miss = Object.keys(missing);
if (process.argv.indexOf('--words') >= 0) { console.log(miss.length ? miss.join(', ') : '（単語帳にない語はない）'); process.exit(0); }
miss.forEach(function (t) { err('単語帳にない語: ' + t + '（' + missing[t] + '）'); });

if (errs.length) { console.log(errs.join('\n')); console.log('✕ ' + errs.length + ' 件'); process.exit(1); }
var x = D.WORDS.filter(function (w) { return w.x; }).length;
console.log('○ pega：語尾タイル ' + D.SUF.length + '・段階 ' + D.STAGES.length + '・入荷する語 ' + (D.WORDS.length - x) + '・初見チャレンジの語 ' + x + '・文 ' + D.CLOZE.length);
