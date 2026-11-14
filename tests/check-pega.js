/* ¡PEGA! の教材チェック：node tests/check-pega.js [--words]
 *  ・ジェム：はまる武器・弱点がある
 *  ・形：id が重ならない／元の語が武器にある／ジェムがその武器にはまる／「語幹|語尾」がジェムと合う／性
 *        同じ武器の形どうしで弱点が重ならない（＝武器 × 弱点 → 形が1つに決まる。-ista と -ero は同じ武器にない）
 *  ・敵（文）：空所が1つ／答えの形がある／訳に（　）が1つ／手がかりがある／文の語が単語帳（shared/es-words.js）にある
 *  ・章：intro 3語・fight・asis の形があり、ジェムが章のジェムと合う／戦う形には敵の文が1つ以上
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
var GB = {}, FB = {}, foesOf = {};
D.GEMS.forEach(function (g) {
  GB[g.id] = g;
  if (!END[g.id]) err('ジェムの形が未登録: ' + g.id);
  if (!D.POS[g.fit]) err('はまる武器がない: ' + g.id);
  if (!D.ATT[g.att]) err('弱点がない: ' + g.id);
  ['label', 'color', 'note'].forEach(function (k) { if (!g[k]) err(g.id + ' に ' + k + ' がない'); });
});
function attOf(f) { var wp = D.WEAPONS[f.base]; return f.gem ? GB[f.gem].att : D.POS[wp.pos].asis; }

D.FORMS.forEach(function (f) {
  var wp = D.WEAPONS[f.base];
  if (FB[f.id]) err('形の id が重なる: ' + f.id); FB[f.id] = f;
  if (!wp) { err('武器がない: ' + f.base + '（' + f.id + '）'); return; }
  if (!f.ja) err('意味がない: ' + f.id);
  if (!f.gem) { if (f.w !== f.base) err('そのままの形が元の語とちがう: ' + f.id); return; }
  var g = GB[f.gem];
  if (!g) { err('知らないジェム: ' + f.id); return; }
  var sfs = f.sfs || [f.gem], p = f.w.split('|');
  if (p.length !== sfs.length + 1 || !p[0]) err('形がおかしい: ' + f.w);
  sfs.forEach(function (id, i) { if (!END[id] || !END[id].test(p[i + 1] || '')) err('ジェムと形が合わない: ' + f.w + '（' + id + '）'); });
  if (sfs.length === 1 && g.fit !== wp.pos) err('ジェムが武器にはまらない: ' + f.id + '（' + f.gem + ' は ' + g.fit + '、' + f.base + ' は ' + wp.pos + '）');
  if (sfs.length > 1 && (!f.root || !f.rja)) err('ジェムが2つの語には root・rja を: ' + f.id);
  if (['cion', 'dad', 'eria'].indexOf(f.gem) >= 0 && f.g !== 'f') err('女性名詞のはず: ' + f.id);
  if (f.gem === 'ista' && f.g !== 'mf') err('-ista は mf: ' + f.id);
  if (['mente', 'oso'].indexOf(f.gem) >= 0 && f.g) err('名詞ではない語に性がある: ' + f.id);
  if (f.gem === 'mente' && sfs.length === 1 && /o$/.test(f.base) && !/a$/.test(p[0])) err('-a に変えていない: ' + f.id);
});
/* 同じ武器で、弱点が重なる形がない（x の語は戦わないので除く） */
var byW = {};
D.FORMS.forEach(function (f) {
  if (f.x || !D.WEAPONS[f.base]) return;
  var a = attOf(f), k = f.base + '/' + a;
  if (byW[k]) err('同じ武器で弱点が重なる: ' + byW[k] + '・' + f.id + '（' + a + '）'); byW[k] = f.id;
});

var missing = {};
D.FOES.forEach(function (e) {
  var f = FB[e.form];
  if (!f) { err('敵の答えの形がない: ' + e.id + ' ' + e.form); return; }
  if (f.x) err('鑑定の語を敵にしない: ' + e.form);
  (foesOf[e.form] = foesOf[e.form] || []).push(e);
  if ((e.s.match(/___/g) || []).length !== 1) err('空所は1つ: ' + e.id + ' ' + e.s);
  if ((e.ja.match(/（　）/g) || []).length !== 1) err('訳の（　）は1つ: ' + e.id);
  if (!e.clue) err('手がかりがない: ' + e.id);
  e.s.replace(/___/, ' ').split(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/).forEach(function (t) {
    if (!t || EW.names.indexOf(t) >= 0) return;
    if (!DICT[t.toLowerCase()]) missing[t.toLowerCase()] = e.id;
  });
});
D.FORMS.forEach(function (f) { if (!f.x && !DICT[f.id.toLowerCase()]) missing[f.id.toLowerCase()] = '形'; });

var seen = {};
D.CH.forEach(function (c, i) {
  if (!GB[c.gem]) err('章のジェムがない: ' + i);
  if (c.intro.length !== 3) err('intro は3語: 章' + (i + 1));
  c.intro.concat(c.fight).forEach(function (id) {
    var f = FB[id];
    if (!f) { err('章の形がない: ' + id); return; }
    if (f.gem !== c.gem) err('章のジェムとちがう形: ' + id + '（章' + (i + 1) + '）');
    if (!foesOf[id]) err('敵の文がない: ' + id);
    if (seen[id]) err('2つの章に出る: ' + id); seen[id] = 1;
  });
  c.asis.forEach(function (id) {
    var f = FB[id];
    if (!f) { err('そのままの形がない: ' + id); return; }
    if (f.gem) err('asis にジェムつきの形: ' + id);
    if (!foesOf[id]) err('敵の文がない: ' + id);
  });
});
D.FORMS.forEach(function (f) { if (!f.x && f.gem && !seen[f.id]) err('どの章にも出ない形: ' + f.id); });

var miss = Object.keys(missing);
if (process.argv.indexOf('--words') >= 0) { console.log(miss.length ? miss.map(function (t) { return t + '（' + missing[t] + '）'; }).join(', ') : '（単語帳にない語はない）'); process.exit(0); }
miss.forEach(function (t) { err('単語帳にない語: ' + t + '（' + missing[t] + '）'); });

if (errs.length) { console.log(errs.join('\n')); console.log('✕ ' + errs.length + ' 件'); process.exit(1); }
var x = D.FORMS.filter(function (f) { return f.x; }).length;
console.log('○ pega：ジェム ' + D.GEMS.length + '・章 ' + D.CH.length + '・武器 ' + Object.keys(D.WEAPONS).length + '・戦う形 ' + (D.FORMS.length - x) + '・敵の文 ' + D.FOES.length + '・鑑定の語 ' + x);
