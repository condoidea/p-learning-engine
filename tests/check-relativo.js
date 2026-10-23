#!/usr/bin/env node
/* =========================================================
 * ¡QUE FUSIÓN!（関係詞アプリ relativo/）の教材チェック ＋ スペイン語単語メモの書き出し
 *
 *   node tests/check-relativo.js           チェックだけ
 *   node tests/check-relativo.js --memo    チェックして docs/スペイン語単語メモ.md を書き直す
 *
 *  チェックすること
 *   ・スペイン語の文に出てくる語が、すべて共通の単語帳（shared/es-words.js）にあるか
 *     （ない語はエラー。単語帳に足すと、アプリのバルーンとメモに自動で出る）
 *   ・問題：正解が選択肢の中にあるか、ante/bug/which の語が文の中にあるか、id の重複
 *   ・レッスン：q ステップの id が問題バンクにあるか、受け身の「読むだけ」が4つ以上続かないか
 *   ・吹き出しの1行が長すぎないか（40字超は注意）
 * ========================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
function load(files) {
  const ctx = { window: {} };
  ctx.window.window = ctx.window;
  vm.createContext(ctx.window);
  files.forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx.window, { filename: f }));
  return ctx.window;
}

const W = load(['shared/es-words.js', 'relativo/js/data/lessons.js', 'relativo/js/data/questions.js', 'relativo/js/data/dojo.js', 'relativo/js/data/cards.js']);
const RQ = W.RQ, DICT = W.ES_WORDS;
let errors = 0, warns = 0;
function err(m) { errors++; console.log('❌ ' + m); }
function warn(m) { warns++; console.log('⚠  ' + m); }

/* ---------- 単語帳の索引（つづり・活用形 → 見出し語） ---------- */
const index = new Map();
DICT.words.forEach(e => {
  [e.w].concat(e.f || []).forEach(form => {
    const k = form.toLowerCase();
    if (index.has(k) && index.get(k) !== e) warn('単語帳：「' + form + '」が2つの見出し語にある（' + index.get(k).w + ' / ' + e.w + '）');
    index.set(k, e);
  });
});
const names = new Set((DICT.names || []).map(n => n.toLowerCase()));

/* ---------- スペイン語の文を集める ---------- */
const JP = /[぀-ヿ一-鿿]/;
function clean(s) { return String(s).replace(/___/g, ' ').replace(/[\[\]{}^|]/g, ''); }
function tokens(s) { return clean(s).toLowerCase().match(/[a-záéíóúüñ]+/g) || []; }
const texts = [];   // { src, es }
function addEs(src, s) { if (s && !JP.test(s)) texts.push({ src, es: s }); }
function addTicks(src, s) { String(s || '').replace(/`([^`]+)`/g, (m, x) => { texts.push({ src, es: x }); return m; }); }

RQ.lessons.forEach(L => L.steps.forEach((st, i) => {
  const src = L.id + ' #' + (i + 1) + ' ' + st.t;
  ['es', 'a', 'b', 'bt', 'out'].forEach(k => { if (typeof st[k] === 'string') addEs(src, st[k]); });
  (st.o || []).forEach(o => addEs(src, o));
  ['x', 'r', 'why', 'more', 'q', 'ti', 'hint'].forEach(k => addTicks(src, st[k]));
}));
RQ.questions.forEach(q => {
  const src = 'Q ' + q.id;
  addEs(src, q.s); addEs(src, q.ok);
  (q.p || []).forEach(p => addEs(src, p));
  (q.d || []).forEach(d => addEs(src, d));
  (q.items || []).forEach(it => addEs(src, it.t));
  if (q.k !== 'ja') (q.o || []).forEach(o => { if (!/^（/.test(o)) addEs(src, o); });
  addTicks(src, q.why);
});
RQ.cards.forEach(c => addEs('card ' + c.id, c.es));

/* ---------- 単語帳にない語 ---------- */
const unknown = new Map();
const used = new Map();   // 見出し語 → 回数
texts.forEach(t => tokens(t.es).forEach(tok => {
  if (names.has(tok)) return;
  const e = index.get(tok);
  if (!e) { if (!unknown.has(tok)) unknown.set(tok, t.src); return; }
  used.set(e, (used.get(e) || 0) + 1);
}));
unknown.forEach((src, tok) => err('単語帳にない語：' + tok + '（' + src + '）'));

/* ---------- 問題 ---------- */
const ids = new Set();
RQ.questions.forEach(q => {
  if (ids.has(q.id)) err('問題 id の重複：' + q.id);
  ids.add(q.id);
  const words = clean(q.s || '').split(/\s+/).map(w => w.replace(/[¿?¡!.,—:;]/g, ''));
  if (q.o && (q.a < 0 || q.a >= q.o.length)) err(q.id + '：正解の番号が選択肢の外');
  if ((q.k === 'pick' || q.k === 'ng' || q.k === 'judge') && !/___/.test(q.s)) err(q.id + '：' + q.k + ' なのに ___ がない');
  if ((q.k === 'ante' || q.k === 'bug' || q.k === 'which') && words.indexOf(q.k === 'which' ? q.w : q.a) < 0) err(q.id + '：「' + (q.w || q.a) + '」が文の中にない');
  if (q.k === 'bug' && !q.ok) err(q.id + '：bug に ok（正しい文）がない');
  if (q.k === 'build' && q.s.split(/\s+/).length > 10) warn(q.id + '：build のタイルが多い（' + q.s.split(/\s+/).length + '枚）');
  if (!q.ja && q.k !== 'ja') warn(q.id + '：日本語訳（ja）がない');
  if (q.o && new Set(q.o).size !== q.o.length) err(q.id + '：同じ選択肢が2つある');
});
const perL = {};
RQ.questions.forEach(q => { perL[q.L] = (perL[q.L] || 0) + 1; });

/* ---------- レッスン ---------- */
const PASSIVE = { say: 1, ex: 1, tip: 1 };
RQ.lessons.forEach(L => {
  let run = 0;
  L.steps.forEach((st, i) => {
    if (st.t === 'q' && !ids.has(st.id)) err(L.id + ' #' + (i + 1) + '：問題 ' + st.id + ' がない');
    if (st.t === 'ask' && (st.a < 0 || st.a >= st.o.length)) err(L.id + ' #' + (i + 1) + '：ask の正解の番号が選択肢の外');
    if (st.t === 'fuse' && (!/\|/.test(st.b) || !st.bt || !st.out)) err(L.id + ' #' + (i + 1) + '：fuse に b の |…|・bt・out が必要');
    if (st.t === 'morph' && (!/\|/.test(st.es) || !st.out)) err(L.id + ' #' + (i + 1) + '：morph に es の |…|・out が必要');
    run = PASSIVE[st.t] ? run + 1 : 0;
    if (run === 4) warn(L.id + ' #' + (i + 1) + '：読むだけのステップが4つ続いている');
    String(st.x || '').split('\n').forEach(line => {
      const len = line.replace(/\*\*|__|\(\(|\)\)|`|[\[\]{}^]/g, '').length;
      if (len > 40) warn(L.id + ' #' + (i + 1) + '：吹き出しの1行が長い（' + len + '字）「' + line.slice(0, 20) + '…」');
    });
  });
  if (!perL[L.no]) err(L.id + '：問題バンクに問題がない');
});
const cardIds = new Set();
RQ.cards.forEach(c => { if (cardIds.has(c.id)) err('カード id の重複：' + c.id); cardIds.add(c.id); });

console.log('\nレッスン ' + RQ.lessons.length + '・問題 ' + RQ.questions.length + '（' + Object.keys(perL).map(k => 'L' + k + ':' + perL[k]).join(' ') + '）・カード ' + RQ.cards.length);
console.log('スペイン語の文 ' + texts.length + '・使った見出し語 ' + used.size + '／単語帳 ' + DICT.words.length);
console.log(errors ? '\n❌ エラー ' + errors + '・注意 ' + warns : '\n✅ エラーなし（注意 ' + warns + '）');

/* ---------- スペイン語単語メモ（docs/スペイン語単語メモ.md） ---------- */
if (process.argv.indexOf('--memo') >= 0) {
  let vamos = new Set();
  try {
    const V = load(['vocab/decks/spanish/deck.js']);
    vamos = new Set(V.VOCAB_DECK.words.map(w => w.w.toLowerCase()));
  } catch (e) { warn('¡VAMOS! のデッキが読めない：' + e.message); }
  /* ¡MANDA!（命令表現 manda/）の文も数える */
  const usedM = new Map(), mTexts = [];
  try {
    const M = load(['shared/es-words.js', 'manda/js/data/lessons.js', 'manda/js/data/questions.js', 'manda/js/data/cards.js']).MQ;
    const add = s => { if (s && !JP.test(s)) mTexts.push(s); };
    const ticks = s => String(s || '').replace(/`([^`]+)`/g, (m, x) => { mTexts.push(x); return m; });
    M.lessons.forEach(L => L.steps.forEach(st => {
      ['es', 'out', 'w'].forEach(k => { if (typeof st[k] === 'string') add(st[k]); });
      (st.o || []).forEach(o => { if (o.length > 2) add(o); });
      (st.tbl || []).forEach(r => r.forEach(c => add(c.replace(/（[^）]*）/g, ' ').replace(/[：:]/g, ' '))));
      ['x', 'r', 'why', 'more', 'q', 'ti', 'hint', 'need'].forEach(k => ticks(st[k]));
    }));
    M.questions.forEach(q => { add(q.s); add(q.ok); add(q.v); (q.d || []).forEach(add); if (q.k !== 'ja') (q.o || []).forEach(add); ticks(q.why); ticks(q.sit); });
    M.cards.forEach(c => add(c.es));
    mTexts.forEach(s => tokens(s).forEach(tok => { const e = index.get(tok); if (e && !names.has(tok)) usedM.set(e, (usedM.get(e) || 0) + 1); }));
  } catch (e) { warn('¡MANDA! のデータが読めない：' + e.message); }
  /* ¡PROTESTO!（比較の法廷 protesto/）の文も数える：台本の es・選択肢・ノートの例文・タイル・ドリルの語 */
  const usedP = new Map(), pTexts = [];
  try {
    const P = load(['shared/es-words.js', 'protesto/js/data/cast.js'].concat([1, 2, 3, 4, 5, 6].map(n => 'protesto/js/data/case' + n + '.js'), ['protesto/js/data/drill.js'])).PQ;
    const add = s => { if (s && !JP.test(s)) pTexts.push(s); };
    const walk = o => {
      if (Array.isArray(o)) { o.forEach(walk); return; }
      if (!o || typeof o !== 'object') return;
      if (typeof o.es === 'string') add(o.es);
      (o.o || []).forEach(add); (o.x && Array.isArray(o.x) ? o.x : []).forEach(add);
      (o.rows || []).forEach(r => add(r[0]));
      Object.keys(o).forEach(k => { if (typeof o[k] === 'object') walk(o[k]); });
    };
    P.cases.forEach(C => walk(C.steps));
    P.drill.words().forEach(add);
    pTexts.forEach(s => tokens(s).forEach(tok => { const e = index.get(tok); if (e && !names.has(tok)) usedP.set(e, (usedP.get(e) || 0) + 1); }));
  } catch (e) { warn('¡PROTESTO! のデータが読めない：' + e.message); }
  const tot = e => (used.get(e) || 0) + (usedM.get(e) || 0) + (usedP.get(e) || 0);
  const LV = { 5: '5級（基本）', 4: '4級', 3: '4級より上（アプリでバルーン説明）', 0: '機能語（冠詞・前置詞・代名詞など）' };
  const POS = { n: '名詞', v: '動詞', adj: '形容詞', adv: '副詞', pron: '代名詞', art: '冠詞', prep: '前置詞', conj: '接続詞', rel: '関係詞', int: '疑問詞', num: '数', det: '限定詞', phr: '表現' };
  const out = [];
  out.push('# スペイン語 単語メモ（アプリ横断）');
  out.push('');
  out.push('スペイン語のアプリで、問題・例文に織り込んだ単語の一覧。**次のアプリを作るときに「どれを復習として使うか」「どれと被らないように新しく足すか」を決めるためのメモ。**');
  out.push('');
  out.push('- 元のデータは [shared/es-words.js](../shared/es-words.js)（共通の単語帳）。アプリはこれを読んで、難しめの語（4級・4級より上）にバルーンを出す');
  out.push('- この文書は `node tests/check-relativo.js --memo` で作り直す（手で直さない）。回数は、そのアプリの例文・問題に出てきた回数（活用形もまとめて数える）。「よく出した語」はアプリの合計');
  out.push('- 「¡VAMOS!」の列：単語アプリ（vocab.html）のスペイン語デッキにもある語は ✓');
  out.push('- 新しいアプリを作ったら：使う語を単語帳に足し（ない語はチェックでエラーになる）、このスクリプトにそのアプリの文を集める処理と列を足す');
  out.push('- 次のアプリの語選びのめやす：**復習として使うなら「よく出した語」や 4級の語から**（このアプリで見慣れている）。**新しく足すなら、この表にない語**を選ぶと被らない');
  out.push('');
  out.push('## アプリ');
  out.push('');
  out.push('| 印 | アプリ | 中身 |');
  out.push('|---|---|---|');
  out.push('| relativo | ¡QUE FUSIÓN!（relativo.html） | 関係詞（que・quien・前置詞＋冠詞＋que・donde・lo que・el que・cuyo）。西検4級 |');
  out.push('| manda | ¡MANDA!（manda.html） | 命令表現（tú・usted・vosotros・ustedes の命令、不規則な8つ、代名詞をくっつける、「〜するな」）。西検4級 |');
  out.push('| protesto | ¡PROTESTO!（protesto.html） | 比較（más・menos…que、tan…como、mejor・peor・mayor・menor、tanto…como、el más…de、-ísimo、más de＋数）。西検4級 |');
  out.push('');
  out.push('## まとめ');
  out.push('');
  const usedList = DICT.words.filter(e => (used.has(e) || usedM.has(e) || usedP.has(e)) && e.pos !== 'bad');
  const byLv = {};
  usedList.forEach(e => { byLv[e.lv] = (byLv[e.lv] || 0) + 1; });
  out.push('| 級 | 語数 |');
  out.push('|---|---|');
  [5, 4, 3, 0].forEach(l => out.push('| ' + LV[l] + ' | ' + (byLv[l] || 0) + ' |'));
  out.push('| 合計 | ' + usedList.length + ' |');
  out.push('');
  out.push('よく出した語（10回以上）：' + usedList.filter(e => e.lv !== 0 && tot(e) >= 10).sort((a, b) => tot(b) - tot(a)).map(e => e.w + '（' + tot(e) + '）').join('、'));
  out.push('');
  [5, 4, 3, 0].forEach(l => {
    const list = usedList.filter(e => e.lv === l).sort((a, b) => a.w.localeCompare(b.w, 'es'));
    if (!list.length) return;
    out.push('## ' + LV[l]);
    out.push('');
    out.push('| 単語 | 意味 | 品詞 | 出てきた形 | relativo | manda | protesto | ¡VAMOS! |');
    out.push('|---|---|---|---|---|---|---|---|');
    list.forEach(e => {
      const forms = (e.f || []).filter(f => texts.some(t => tokens(t.es).indexOf(f.toLowerCase()) >= 0) || mTexts.some(t => tokens(t).indexOf(f.toLowerCase()) >= 0) || pTexts.some(t => tokens(t).indexOf(f.toLowerCase()) >= 0));
      out.push('| ' + e.w + ' | ' + e.ja + ' | ' + (POS[e.pos] || e.pos || '') + ' | ' + forms.join(', ') + ' | ' + (used.get(e) || '') + ' | ' + (usedM.get(e) || '') + ' | ' + (usedP.get(e) || '') + ' | ' + (vamos.has(e.w.toLowerCase()) ? '✓' : '') + ' |');
    });
    out.push('');
  });
  out.push('## 人名・地名（単語ではないので数えない）');
  out.push('');
  out.push((DICT.names || []).join('、'));
  out.push('');
  fs.writeFileSync(path.join(ROOT, 'docs', 'スペイン語単語メモ.md'), out.join('\n'), 'utf8');
  console.log('📝 docs/スペイン語単語メモ.md を書き直しました（' + usedList.length + '語）');
}
process.exit(errors ? 1 : 0);
