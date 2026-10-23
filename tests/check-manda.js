#!/usr/bin/env node
/* =========================================================
 * ¡MANDA!（命令表現アプリ manda/）の教材チェック
 *
 *   node tests/check-manda.js
 *
 *  チェックすること
 *   ・スペイン語の文に出てくる語が、すべて共通の単語帳（shared/es-words.js）にあるか
 *   ・問題：正解の番号が選択肢の中か、bug の語が文の中か、id の重複、同じ選択肢
 *   ・レッスン：q の id、forge（w の最後が cut・add が o の中）、cast・tapwho の人が場面にいるか、
 *     読むだけ（say・show・tip）が4つ以上続かないか、ブーホが3回つづけて話さないか、吹き出しの1行が長すぎないか
 *   ・カード：id の重複・絵文字の重複・レッスンごとの枚数
 *  単語メモ（docs/スペイン語単語メモ.md）は node tests/check-relativo.js --memo で書き出す（manda の列もそこで作る）
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
const FILES = ['shared/es-words.js', 'manda/js/data/lessons.js', 'manda/js/data/questions.js', 'manda/js/data/cards.js', 'manda/js/data/world.js'];
const W = load(FILES);
const MQ = W.MQ, DICT = W.ES_WORDS;
let errors = 0, warns = 0;
function err(m) { errors++; console.log('❌ ' + m); }
function warn(m) { warns++; console.log('⚠  ' + m); }

const index = new Map();
DICT.words.forEach(e => [e.w].concat(e.f || []).forEach(f => index.set(f.toLowerCase(), e)));
const names = new Set((DICT.names || []).map(n => n.toLowerCase()));

/* ---------- スペイン語の文を集める（manda.texts は単語メモでも使う） ---------- */
const JP = /[぀-ヿ一-鿿]/;
function clean(s) { return String(s).replace(/___/g, ' ').replace(/[\[\]{}^|]/g, ''); }
function tokens(s) { return clean(s).toLowerCase().match(/[a-záéíóúüñ]+/g) || []; }
const texts = [];
function addEs(src, s) { if (s && !JP.test(s)) texts.push({ src, es: s }); }
function addTicks(src, s) { String(s || '').replace(/`([^`]+)`/g, (m, x) => { texts.push({ src, es: x }); return m; }); }
MQ.lessons.forEach(L => L.steps.forEach((st, i) => {
  const src = L.id + ' #' + (i + 1) + ' ' + st.t;
  ['es', 'out', 'w'].forEach(k => { if (typeof st[k] === 'string') addEs(src, st[k]); });
  (st.o || []).forEach(o => { if (o.length > 2) addEs(src, o); });
  (st.tbl || []).forEach(r => r.forEach(c => addEs(src, c.replace(/（[^）]*）/g, ' ').replace(/[：:]/g, ' '))));
  ['x', 'r', 'why', 'more', 'q', 'ti', 'hint', 'need'].forEach(k => addTicks(src, st[k]));
}));
MQ.questions.forEach(q => {
  const src = 'Q ' + q.id;
  addEs(src, q.s); addEs(src, q.ok); addEs(src, q.v);
  (q.d || []).forEach(d => addEs(src, d));
  if (q.k !== 'ja') (q.o || []).forEach(o => addEs(src, o));
  addTicks(src, q.why); addTicks(src, q.sit);
});
MQ.cards.forEach(c => addEs('card ' + c.id, c.es));

const used = new Map(), unknown = new Map();
texts.forEach(t => tokens(t.es).forEach(tok => {
  if (names.has(tok)) return;
  const e = index.get(tok);
  if (!e) { if (!unknown.has(tok)) unknown.set(tok, t.src); return; }
  used.set(e, (used.get(e) || 0) + 1);
}));
unknown.forEach((src, tok) => err('単語帳にない語：' + tok + '（' + src + '）'));

/* ---------- 問題 ---------- */
const ids = new Set(), perL = {};
const KINDS = { pick: 1, form: 1, scene: 1, who: 1, ja: 1, bug: 1, build: 1 };
MQ.questions.forEach(q => {
  if (ids.has(q.id)) err('問題 id の重複：' + q.id);
  ids.add(q.id);
  perL[q.L] = (perL[q.L] || 0) + 1;
  if (!KINDS[q.k]) err(q.id + '：知らない kind ' + q.k);
  if (q.o && (q.a < 0 || q.a >= q.o.length)) err(q.id + '：正解の番号が選択肢の外');
  if (q.k === 'who' && (q.a < 0 || q.a > 3)) err(q.id + '：who の正解は 0〜3');
  if (q.k === 'pick' && (q.s.match(/___/g) || []).length !== 1) err(q.id + '：pick の ___ は1つ');
  if (q.k === 'bug') {
    const words = q.s.split(/\s+/).map(w => w.replace(/[¿?¡!.,—:;]/g, ''));
    if (words.indexOf(q.a) < 0) err(q.id + '：「' + q.a + '」が文の中にない');
    if (!q.ok) err(q.id + '：bug に ok（正しい文）がない');
  }
  if (q.k === 'build' && q.s.split(/\s+/).length > 7) warn(q.id + '：build のタイルが多い');
  if (q.o && new Set(q.o).size !== q.o.length) err(q.id + '：同じ選択肢が2つある');
  if (!q.why && q.k !== 'build') warn(q.id + '：why がない');
});

/* ---------- レッスン ---------- */
const PASSIVE = { say: 1, tip: 1 };   // show はすぐ次へ進むので数えない（続けて読むのは、その次の say）
MQ.lessons.forEach(L => {
  let run = 0, owl = 0;
  const here = new Set(L.actors || []);
  L.steps.forEach((st, i) => {
    const at = L.id + ' #' + (i + 1);
    if (st.t === 'q' && !ids.has(st.id)) err(at + '：問題 ' + st.id + ' がない');
    if (st.t === 'ask' && (st.a < 0 || st.a >= st.o.length)) err(at + '：ask の正解の番号が選択肢の外');
    if (st.t === 'cast' && (st.a < 0 || st.a >= st.o.length)) err(at + '：cast の正解の番号が選択肢の外');
    if (st.t === 'cast' && !/\{/.test(st.out)) err(at + '：cast の out に {命令} がない');
    if (st.t === 'forge') {
      if (st.cut && !st.w.endsWith(st.cut)) err(at + '：forge の w が cut で終わっていない');
      if (st.add && (st.o || []).indexOf(st.add) < 0) err(at + '：forge の add が o にない');
      if (!st.cut && !st.add) err(at + '：forge に cut も add もない');
    }
    if (st.who || st.t === 'enter') here.add(st.who);
    if ((st.t === 'cast') && !MQ.people[st.who]) err(at + '：知らない人 ' + st.who);
    if (st.t === 'tapwho' && !here.has(st.a)) err(at + '：tapwho の正解 ' + st.a + ' が場面にいない');
    if (st.t !== 'show' && st.t !== 'enter') run = PASSIVE[st.t] ? run + 1 : 0;
    if (run === 4) warn(at + '：読むだけのステップが4つ続いている');
    owl = st.t === 'say' && !st.who && !st.more ? owl + 1 : 0;
    if (owl === 3) warn(at + '：ブーホが3回つづけて話している（返事・問いで区切る）');
    (st.t === 'say' ? String(st.x || '') : '').split('\n').forEach(line => {
      const len = line.replace(/\*\*|__|\(\(|\)\)|`|[\[\]{}^]/g, '').length;
      if (len > 30) warn(at + '：吹き出しの1行が長い（' + len + '字）「' + line.slice(0, 20) + '…」');
    });
  });
  if (!perL[L.no]) err(L.id + '：問題バンクに問題がない');
  const drill = L.steps.filter(s => s.t === 'drill').reduce((a, s) => a + s.n, 0);
  if (drill > (perL[L.no] || 0)) err(L.id + '：drill の問題数が問題バンクより多い');
  if (!MQ.world.grow[L.id]) warn(L.id + '：島の育ち（world.grow）がない');
});
MQ.bosses.forEach(B => { if (!MQ.world.grow[B.id]) warn(B.id + '：島の育ち（world.grow）がない'); });

/* ---------- カード ---------- */
const cids = new Set(), icons = new Set();
MQ.cards.forEach(c => {
  if (cids.has(c.id)) err('カード id の重複：' + c.id);
  cids.add(c.id);
  if (icons.has(c.icon)) warn('カードの絵文字の重複：' + c.icon + '（' + c.id + '）');
  icons.add(c.icon);
});
MQ.lessons.forEach(L => { const n = MQ.cards.filter(c => c.L === L.no).length; if (n !== 5) warn(L.id + '：カードが ' + n + ' 枚（5枚のはず）'); });
MQ.bosses.forEach(B => { if (!MQ.cards.some(c => c.id === 'u-' + B.id)) err(B.id + '：UR カード u-' + B.id + ' がない'); });

console.log('\nレッスン ' + MQ.lessons.length + '・問題 ' + MQ.questions.length + '（' + Object.keys(perL).map(k => 'L' + k + ':' + perL[k]).join(' ') + '）・カード ' + MQ.cards.length);
console.log('スペイン語の文 ' + texts.length + '・使った見出し語 ' + used.size + '／単語帳 ' + DICT.words.length);
console.log(errors ? '\n❌ エラー ' + errors + '・注意 ' + warns : '\n✅ エラーなし（注意 ' + warns + '）');
process.exit(errors ? 1 : 0);
