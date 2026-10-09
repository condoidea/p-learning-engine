/* =========================================================
 * 単語デッキのチェック（node で実行）
 *   node tests/check-vocab-deck.js <デッキ.json または deck.js> [--verbs]
 *  エラーがあれば終了コード 1。--verbs で、規則動詞として活用した動詞の表も出す。
 *  形式の説明は docs/単語データの作り方.md
 * ========================================================= */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var file = process.argv[2], showVerbs = process.argv.indexOf('--verbs') >= 0;
if (!file) { console.log('使い方：node tests/check-vocab-deck.js <デッキ.json> [--verbs]'); process.exit(2); }

var root = path.join(__dirname, '..');
var ctx = { window: {}, console: console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'vocab/js/conj-es.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'vocab/js/deck-check.js'), 'utf8'), ctx);
var Conj = ctx.window.Conj, DeckCheck = ctx.window.DeckCheck;

var text = fs.readFileSync(file, 'utf8'), D;
try {
  if (/\.js$/i.test(file)) { vm.runInContext(text, ctx); D = ctx.window.VOCAB_DECK; }
  else D = JSON.parse(text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text);   /* 先頭の BOM を取る */
} catch (e) { console.log('✖ 読めない：' + e.message); process.exit(1); }

/* デッキのくせ（cj）を活用エンジンに足してからチェック */
(D.words || []).forEach(function (w) { if (w && w.pos === 'v' && w.cj && Conj.checkIrr(w.cj).length === 0) Conj.addIrr(w.w, w.cj); });
var r = DeckCheck.check(D, Conj, { builtin: /\.js$/i.test(file) });   /* アプリに入っているデッキ（.js）は id の重複を問わない */

console.log('デッキ：' + (D.title || '?') + '（' + (D.words || []).length + '語・' + (D.sections || []).length + '区間）');
if (r.errors.length) { console.log('\n✖ エラー ' + r.errors.length + '件'); r.errors.forEach(function (e) { console.log('  - ' + e); }); }
if (r.warnings.length) { console.log('\n⚠ 注意 ' + r.warnings.length + '件'); r.warnings.forEach(function (e) { console.log('  - ' + e); }); }
if (r.verbs.length) {
  console.log('\n🔁 規則動詞として活用する動詞 ' + r.verbs.length + '語（不規則なら cj を書く）');
  r.verbs.forEach(function (v) {
    if (!showVerbs) { console.log('  - ' + v.w); return; }
    console.log('  ■ ' + v.w + '  ' + v.at);
    ['現在  ', '点過去', '接続法'].forEach(function (lab, i) { console.log('     ' + lab + ' ' + v.sample[i]); });
    console.log('     ' + v.sample[3] + '／' + v.sample[4]);
  });
  if (!showVerbs) console.log('  （--verbs をつけると、作った活用表を表示）');
}
console.log(r.errors.length ? '\n✖ 直してから読み込んでください' : '\n✔ 読み込めます');
process.exit(r.errors.length ? 1 : 0);
