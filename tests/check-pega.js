/* ¡PEGA! の教材チェック：node tests/check-pega.js
 *  ・接尾辞ごとに10語・id が重ならない・「語幹|語尾」の形・語尾がその接尾辞のもの
 *  ・意味の4択がこわれないよう、意味（ja・ja2）が重ならない
 *  ・あたらしい語尾の最初の5語に、きまりの例になる語が入っている（-mente の -o、-ero・-ería の組） */
'use strict';
var D = require('../pega/js/data.js');
var errs = [];
function err(m) { errs.push(m); }

var END = { cion: /^(ción|sión)$/, dad: /^(dad|tad)$/, mente: /^mente$/, oso: /^oso$/, ista: /^ista$/, ero: /^(ero|ería)$/, dor: /^(dor|dora)$/ };
var ids = {}, jas = {}, by = {};
D.SUF.forEach(function (s) {
  by[s.id] = [];
  if (!END[s.id]) err('語尾の形が未登録: ' + s.id);
  if (!s.opts || s.opts[s.a] == null) err('予想の問いの正解がない: ' + s.id);
  ['label', 'role', 'color', 'short', 'q', 'rule'].forEach(function (k) { if (!s[k]) err(s.id + ' に ' + k + ' がない'); });
});
D.WORDS.forEach(function (w) {
  if (!by[w.sf]) { err('知らない接尾辞: ' + w.id); return; }
  by[w.sf].push(w);
  if (ids[w.id]) err('id が重なる: ' + w.id); ids[w.id] = 1;
  [w.w, w.w2].forEach(function (f) {
    if (!f) return;
    var p = f.split('|');
    if (p.length !== 2 || !p[0] || !END[w.sf].test(p[1])) err('形がおかしい: ' + f);
  });
  [w.ja, w.ja2].forEach(function (j) { if (!j) return; if (jas[j]) err('意味が重なる: ' + j + '（' + w.id + '・' + jas[j] + '）'); jas[j] = w.id; });
  if (!w.base || !w.baseJa || !w.ja) err('空の欄: ' + w.id);
  if (!!w.w2 !== !!w.ja2) err('w2 と ja2 は両方書く: ' + w.id);
  if (['cion', 'dad'].indexOf(w.sf) >= 0 && w.g !== 'f') err('女性名詞のはず: ' + w.id);
  if (w.sf === 'ista' && w.g !== 'mf') err('-ista は mf: ' + w.id);
  if (w.bad && (w.sf !== 'mente' || !/o$/.test(w.base))) err('bad は -o で終わる形容詞の -mente だけ: ' + w.id);
  if (w.sf === 'mente' && /o$/.test(w.base) && !/a$/.test(w.w.split('|')[0])) err('-a に変えていない: ' + w.id);
});
D.SUF.forEach(function (s) {
  if (by[s.id].length !== 10) err(s.id + ' は ' + by[s.id].length + ' 語（10語のはず）');
});
if (!by.mente.slice(0, 5).some(function (w) { return w.bad; })) err('-mente の最初の5語に -o の形容詞がない');
if (!by.ero.slice(0, 5).every(function (w) { return w.w2; })) err('-ero の最初の5語は、人と店の組にする');

if (errs.length) { console.log(errs.join('\n')); console.log('✕ ' + errs.length + ' 件'); process.exit(1); }
console.log('○ pega：接尾辞 ' + D.SUF.length + '・語 ' + D.WORDS.length + '（店の形をふくめて ' + Object.keys(jas).length + '）');
