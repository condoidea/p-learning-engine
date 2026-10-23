#!/usr/bin/env node
/* =========================================================
 * ¡PROTESTO!（比較の法廷アプリ protesto/）の台本チェック
 *
 *   node tests/check-protesto.js          … 点検
 *   node tests/check-protesto.js --words  … 単語帳にない語を、事件ごとに一覧で出す
 *
 *  チェックすること
 *   ・スペイン語の文に出てくる語が、すべて共通の単語帳（shared/es-words.js）にあるか（ドリルの語も）
 *   ・ステップの種類・ask などの正解の番号・証拠が定義されているか・使う前に get しているか
 *   ・testimony に ok の行があるか、contra の a が2つか、build の x が正解のタイルと重ならないか
 *   ・同じ人が3回つづけて話していないか、セリフの1行が長すぎないか（30字）
 * ========================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
function load(files) {
  const ctx = { window: {} };
  ctx.window.window = ctx.window;
  ctx.window.PQ = undefined;
  vm.createContext(ctx.window);
  files.forEach(f => { if (fs.existsSync(path.join(ROOT, f))) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx.window, { filename: f }); });
  return ctx.window;
}
const CASES = [1, 2, 3, 4, 5, 6].map(n => 'protesto/js/data/case' + n + '.js');
const W = load(['shared/es-words.js', 'protesto/js/data/cast.js'].concat(CASES, ['protesto/js/data/drill.js']));
const PQ = W.PQ, DICT = W.ES_WORDS;
const WORDS = process.argv.includes('--words');
let errors = 0, warns = 0;
function err(m) { errors++; if (!WORDS) console.log('❌ ' + m); }
function warn(m) { warns++; if (!WORDS) console.log('⚠  ' + m); }

const index = new Map();
DICT.words.forEach(e => [e.w].concat(e.f || []).forEach(f => index.set(f.toLowerCase(), e)));
const names = new Set((DICT.names || []).map(n => n.toLowerCase()));

/* ---------- スペイン語の文を集める ---------- */
const JP = /[぀-ヿ一-鿿]/;
function tokens(s) { return String(s).replace(/[\[\]]/g, '').toLowerCase().match(/[a-záéíóúüñ]+/g) || []; }
const texts = [];
function addEs(src, s) { if (s && !JP.test(s)) texts.push({ src, es: s }); }
function addTicks(src, s) { String(s || '').replace(/`([^`]+)`/g, (m, x) => { texts.push({ src, es: x }); return m; }); }

const KINDS = ['scene', 'enter', 'say', 'note', 'tip', 'chart', 'ask', 'get', 'inspect', 'testimony', 'present', 'contra', 'stop', 'interp', 'order', 'build', 'slam', 'verdict'];
PQ.cases.forEach(C => {
  const got = new Set();
  let last = null, run = 0;
  const people = Object.assign({}, PQ.cast, C.cast);
  function evOk(at, k) {
    if (!C.evidence[k]) err(at + '：証拠 ' + k + ' が evidence にない');
    else if (!got.has(k)) err(at + '：証拠 ' + k + ' を get する前につきつけている');
  }
  function walk(steps, where) {
    steps.forEach((st, i) => {
      const at = C.id + ' ' + where + '#' + (i + 1) + ' ' + st.t;
      if (KINDS.indexOf(st.t) < 0) err(at + '：知らないステップ');
      if (st.t === 'say') {
        if (!people[st.who]) err(at + '：知らない人 ' + st.who);
        addEs(at, st.es); addTicks(at, st.x); addTicks(at, st.more);
        run = st.who === last ? run + 1 : 1; last = st.who;
        if (run === 3) warn(at + '：' + st.who + ' が3回つづけて話している');
        String(st.x || '').split('\n').forEach(l => { const n = l.replace(/\*\*|__|\(\(|\)\)|`/g, '').length; if (n > 30) warn(at + '：1行が長い（' + n + '字）「' + l.slice(0, 16) + '…」'); });
      } else if (st.t !== 'get' && st.t !== 'chart') { last = null; run = 0; }
      if (st.t === 'enter' && !people[st.who]) err(at + '：知らない人 ' + st.who);
      if (st.t === 'scene') { if (!PQ.places[st.place]) err(at + '：知らない場所 ' + st.place); (st.cast || []).forEach(p => { if (!people[p]) err(at + '：知らない人 ' + p); }); }
      if (st.t === 'note') { (st.rows || []).forEach(r => addEs(at, r[0])); addTicks(at, st.x); }
      if (st.t === 'tip') { addTicks(at, st.x); addTicks(at, st.why); }
      if (st.t === 'chart' && !(st.bars || []).length) err(at + '：棒がない');
      if (st.t === 'ask' || st.t === 'interp') {
        if (!(st.a >= 0 && st.a < st.o.length)) err(at + '：正解の番号が選択肢の外');
        if (new Set(st.o).size !== st.o.length) err(at + '：同じ選択肢がある');
        addEs(at, st.es); st.o.forEach(o => addEs(at, o)); addTicks(at, st.q);
      }
      if (st.t === 'get') { if (!C.evidence[st.ev]) err(at + '：証拠 ' + st.ev + ' が evidence にない'); got.add(st.ev); }
      if (st.t === 'inspect') { if (!(st.spots || []).length) err(at + '：調べるところがない'); st.spots.forEach((s, k) => walk(s.steps || [], where + '#' + (i + 1) + '.spot' + (k + 1))); }
      if (st.t === 'testimony') {
        if (!people[st.who]) err(at + '：知らない人 ' + st.who);
        const oks = st.lines.filter(l => l.ok);
        if (oks.length !== 1) warn(at + '：ok の行が ' + oks.length + ' つ');
        st.lines.forEach((l, k) => { addEs(at, l.es); (l.ok || []).forEach(e => evOk(at + ' 行' + (k + 1), e)); if (l.press) walk(l.press, where + '#' + (i + 1) + '.press' + (k + 1)); });
      }
      if (st.t === 'present') (st.ok || []).forEach(e => evOk(at, e));
      if (st.t === 'contra') { if ((st.a || []).length !== 2 || st.a.some(a => !(a >= 0 && a < st.lines.length))) err(at + '：a は行番号2つ'); st.lines.forEach(l => addEs(at, l.es)); }
      if (st.t === 'stop') { if (!(st.a >= 0 && st.a < st.lines.length)) err(at + '：a が行の外'); st.lines.forEach(l => addEs(at, l.es)); }
      if (st.t === 'interp') addEs(at, st.es);
      if (st.t === 'order') { const ids = st.items.map(x => x.id); if (st.a.length !== ids.length || st.a.some(a => ids.indexOf(a) < 0)) err(at + '：a が items と合わない'); }
      if (st.t === 'build') {
        addEs(at, st.es); (st.x || []).forEach(x => addEs(at, x));
        const goal = st.es.replace(/[.!?¡¿,]/g, '').split(/\s+/);
        (st.x || []).forEach(x => { if (goal.indexOf(x) >= 0) err(at + '：まぎらわしいタイル ' + x + ' が正解の中にもある'); });
        if (goal.length > 9) warn(at + '：タイルが多い（' + goal.length + '）');
      }
      if (st.t === 'testimony' || st.t === 'present' || st.t === 'contra' || st.t === 'stop' || st.t === 'interp' || st.t === 'order' || st.t === 'ask') {
        ['after', 'r'].forEach(k => { if (Array.isArray(st[k])) walk(st[k], where + '#' + (i + 1) + '.' + k); });
      }
    });
  }
  walk(C.steps, '');
  if (C.steps[C.steps.length - 1].t !== 'say' && !C.steps.some(s => s.t === 'verdict')) err(C.id + '：verdict がない');
  Object.keys(C.cast).forEach(k => addEs(C.id + ' cast', C.cast[k].es));
});
PQ.drill.words().forEach(w => addEs('drill', w));
for (let k = 0; k < 300; k++) { const q = PQ.drill.make(['mas', 'tan', 'irr', 'tanto', 'sup', 'masde']); addEs('drill', q.es); addEs('drill', q.fix); }

const unknown = new Map();
texts.forEach(t => tokens(t.es).forEach(tok => {
  if (names.has(tok) || index.has(tok)) return;
  if (!unknown.has(tok)) unknown.set(tok, []);
  const u = unknown.get(tok); if (u.indexOf(t.src.split(' ')[0]) < 0) u.push(t.src.split(' ')[0]);
}));
if (WORDS) {
  [...unknown.keys()].sort().forEach(w => console.log(w + '\t' + unknown.get(w).join(',')));
  console.log('（' + unknown.size + ' 語）');
} else {
  unknown.forEach((src, tok) => err('単語帳にない語：' + tok + '（' + src.join(',') + '）'));
  console.log('\n事件 ' + PQ.cases.length + ' 話・エラー ' + errors + '・注意 ' + warns);
}
process.exit(errors ? 1 : 0);
