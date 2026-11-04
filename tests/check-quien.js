#!/usr/bin/env node
/* =========================================================
 * ¿QUIÉN FUE?（受身と se の新聞記者アプリ quien/）の台本チェック
 *
 *   node tests/check-quien.js          … 点検
 *   node tests/check-quien.js --words  … 単語帳にない語を、事件ごとに一覧で出す
 *
 *  チェックすること
 *   ・スペイン語の文に出てくる語が、すべて共通の単語帳（shared/es-words.js）にあるか（ドリル・西検チャレンジの語も）
 *   ・ステップの種類・正解の番号・メモが定義されているか・使う前に get しているか
 *   ・who の仮面がその話までに習ったものか（まだ教えていない形を選択肢に出さない）
 *   ・tap の正解の語・redpen のまちがった語が文の中にあるか
 *   ・同じ人が3回つづけて話していないか、セリフの1行が長すぎないか（30字）
 *   ・ドリル・西検チャレンジの問題の形（空所の ___、正解の番号、分野）
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
  files.forEach(f => { if (fs.existsSync(path.join(ROOT, f))) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx.window, { filename: f }); else console.log('⚠  ' + f + ' がない'); });
  return ctx.window;
}
const CASES = [1, 2, 3, 4, 5, 6, 7].map(n => 'quien/js/data/case' + n + '.js');
const W = load(['shared/es-words.js', 'quien/js/data/cast.js'].concat(CASES, ['quien/js/data/drill.js', 'quien/js/data/exam.js']));
const QF = W.QF, DICT = W.ES_WORDS;
const WORDS = process.argv.includes('--words');
let errors = 0, warns = 0;
function err(m) { errors++; if (!WORDS) console.log('❌ ' + m); }
function warn(m) { warns++; if (!WORDS) console.log('⚠  ' + m); }

const index = new Map();
DICT.words.forEach(e => [e.w].concat(e.f || []).forEach(f => index.set(f.toLowerCase(), e)));
const names = new Set((DICT.names || []).map(n => n.toLowerCase()));
const caseNo = {}; QF.cases.forEach(C => { caseNo[C.id] = C.no; });
const maskCase = (QF.drill || {}).maskCase || {};

/* ---------- スペイン語の文を集める ---------- */
const JP = /[぀-ヿ一-鿿]/;
function tokens(s) { return String(s).replace(/[\[\]]/g, '').toLowerCase().match(/[a-záéíóúüñ]+/g) || []; }
function norm(w) { return String(w).replace(/[¿?¡!.,—:;"«»\[\]]/g, '').toLowerCase(); }
const texts = [];
function addEs(src, s) { if (s && !JP.test(s)) texts.push({ src, es: s }); }
/* 選択肢「el cuadro（絵）」のように訳つきなら、スペイン語の部分だけ */
function addMixed(src, s) { if (!s) return; if (!JP.test(s)) { texts.push({ src, es: s }); return; } String(s).replace(/^([A-Za-zÁÉÍÓÚÜÑáéíóúüñ ,.¿?¡!-]+)（/, (m, x) => { texts.push({ src, es: x }); return m; }); }
function addTicks(src, s) { String(s || '').replace(/`([^`]+)`/g, (m, x) => { texts.push({ src, es: x }); return m; }); }
function inSentence(es, w) { const [base, nth] = w.split('#'); const toks = String(es).replace(/[\[\]]/g, '').split(/\s+/).map(norm); return toks.filter(t => t === norm(base)).length >= (+nth || 1); }

const KINDS = ['scene', 'enter', 'say', 'note', 'tip', 'flow', 'ask', 'who', 'tap', 'redpen', 'get', 'inspect', 'testimony', 'present', 'contra', 'stop', 'interp', 'build', 'slam', 'scoop'];
QF.cases.forEach(C => {
  const got = new Set();
  let last = null, run = 0;
  const people = Object.assign({}, QF.cast, C.cast);
  function evOk(at, k) {
    if (!C.evidence[k]) err(at + '：メモ ' + k + ' が evidence にない');
    else if (!got.has(k)) err(at + '：メモ ' + k + ' を get する前につきつけている');
  }
  function lines(at, x) { String(x || '').split('\n').forEach(l => { const n = l.replace(/\*\*|__|\(\(|\)\)|`/g, '').length; if (n > 30) warn(at + '：1行が長い（' + n + '字）「' + l.slice(0, 16) + '…」'); }); }
  function walk(steps, where) {
    steps.forEach((st, i) => {
      const at = C.id + ' ' + where + '#' + (i + 1) + ' ' + st.t;
      if (KINDS.indexOf(st.t) < 0) err(at + '：知らないステップ');
      if (st.t === 'say') {
        if (!people[st.who]) err(at + '：知らない人 ' + st.who);
        addEs(at, st.es); addTicks(at, st.x); addTicks(at, st.more);
        run = st.who === last ? run + 1 : 1; last = st.who;
        if (run === 3) warn(at + '：' + st.who + ' が3回つづけて話している');
        lines(at, st.x);
      } else if (st.t !== 'get') { last = null; run = 0; }
      if (st.t === 'enter' && !people[st.who]) err(at + '：知らない人 ' + st.who);
      if (st.t === 'scene') { if (!QF.places[st.place]) err(at + '：知らない場所 ' + st.place); (st.cast || []).forEach(p => { if (!people[p]) err(at + '：知らない人 ' + p); }); }
      if (st.t === 'note') { (st.rows || []).forEach(r => addEs(at, r[0].replace(/→/g, ' '))); addTicks(at, st.x); addTicks(at, st.why); }
      if (st.t === 'tip') { addTicks(at, st.x); addTicks(at, st.why); }
      if (st.t === 'flow') { if (!(st.upto >= 1 && st.upto <= QF.flow.length)) err(at + '：upto が手順の外'); else if (QF.flow[st.upto - 1].c !== C.id) warn(at + '：upto の段（' + QF.flow[st.upto - 1].c + '）が、この話の段ではない'); }
      if (st.t === 'ask' || st.t === 'interp') {
        if (!(st.a >= 0 && st.a < st.o.length)) err(at + '：正解の番号が選択肢の外');
        if (new Set(st.o).size !== st.o.length) err(at + '：同じ選択肢がある');
        addEs(at, st.es); st.o.forEach(o => addMixed(at, o)); addTicks(at, st.q);
      }
      if (st.t === 'who') {
        addEs(at, st.es);
        if (!(st.a >= 0 && st.a < st.o.length)) err(at + '：正解の番号が選択肢の外');
        st.o.forEach(k => {
          if (!QF.masks[k]) err(at + '：知らない仮面 ' + k);
          else if (maskCase[k] && caseNo[maskCase[k]] > C.no) err(at + '：仮面 ' + k + ' は第' + caseNo[maskCase[k]] + '話で習う（まだ教えていない）');
        });
      }
      if (st.t === 'tap') {
        addEs(at, st.es);
        if (!(st.a || []).length) err(at + '：a がない');
        (st.a || []).forEach(w => { if (!inSentence(st.es, w)) err(at + '：正解の語 ' + w + ' が文にない'); });
      }
      if (st.t === 'redpen') {
        addEs(at, st.es); addEs(at, st.fix); st.o.forEach(o => addEs(at, o));
        if (!inSentence(st.es, st.bad)) err(at + '：まちがった語 ' + st.bad + ' が文にない');
        if (!(st.a >= 0 && st.a < st.o.length)) err(at + '：正解の番号が選択肢の外');
        else if (!inSentence(st.fix, st.o[st.a])) err(at + '：直した語 ' + st.o[st.a] + ' が fix にない');
        if (norm(st.es) === norm(st.fix)) err(at + '：fix が es と同じ');
      }
      if (st.t === 'get') { if (!C.evidence[st.ev]) err(at + '：メモ ' + st.ev + ' が evidence にない'); got.add(st.ev); }
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
      if (st.t === 'build') {
        addEs(at, st.es); (st.x || []).forEach(x => addEs(at, x));
        const goal = st.es.replace(/[.!?¡¿,]/g, '').split(/\s+/);
        (st.x || []).forEach(x => { if (goal.indexOf(x) >= 0) err(at + '：まぎらわしいタイル ' + x + ' が正解の中にもある'); });
        if (goal.length > 9) warn(at + '：タイルが多い（' + goal.length + '）');
      }
      if (st.t === 'scoop') addEs(at, st.es);
      ['after', 'r'].forEach(k => { if (Array.isArray(st[k])) walk(st[k], where + '#' + (i + 1) + '.' + k); });
    });
  }
  walk(C.steps, '');
  if (!C.steps.some(s => s.t === 'scoop')) err(C.id + '：scoop がない');
  if (!C.steps.some(s => s.t === 'flow')) warn(C.id + '：見分けの手順（flow）が出てこない');
  Object.keys(C.cast).forEach(k => addEs(C.id + ' cast', C.cast[k].es));
});
Object.keys(QF.places).forEach(k => addEs('places', QF.places[k].es));
QF.flow.forEach(f => addEs('flow', f.ex));

/* ---------- ドリル ---------- */
if (QF.drill) {
  Object.keys(QF.masks).forEach(k => { if (!maskCase[k]) err('drill.maskCase に ' + k + ' がない'); });
  const per = {};
  QF.drill.items.forEach((q, i) => {
    const at = 'drill#' + (i + 1);
    if (!caseNo[q.c]) err(at + '：c が事件にない ' + q.c);
    per[q.c] = (per[q.c] || 0) + 1;
    addEs(at, q.es);
    if (!q.ja) warn(at + '：訳がない');
    if (q.k) {
      if (!QF.masks[q.k]) err(at + '：知らない仮面 ' + q.k);
      else if (caseNo[maskCase[q.k]] > caseNo[q.c]) err(at + '：仮面 ' + q.k + ' は第' + caseNo[maskCase[q.k]] + '話で習う（c が早すぎる）');
    } else {
      if (!/___/.test(q.es)) err(at + '：空所 ___ がない');
      if (!(q.a >= 0 && q.a < (q.o || []).length)) err(at + '：正解の番号が選択肢の外');
      (q.o || []).forEach(o => addEs(at, o));
    }
    if (!q.why) warn(at + '：why がない');
  });
  Object.keys(caseNo).forEach(c => { if ((per[c] || 0) < 8) warn('drill：' + c + ' の問題が少ない（' + (per[c] || 0) + '）'); });
} else err('quien/js/data/drill.js がない');

/* ---------- 西検チャレンジ ---------- */
if (QF.exam) {
  const per = {};
  Object.keys(QF.exam.secs).forEach(s => { if (!caseNo[QF.exam.secs[s].c]) err('exam.secs.' + s + '：c が事件にない'); });
  QF.exam.items.forEach((q, i) => {
    const at = 'exam#' + (i + 1);
    if (!QF.exam.secs[q.s]) err(at + '：知らない分野 ' + q.s);
    per[q.s] = (per[q.s] || 0) + 1;
    if (!(q.a >= 0 && q.a < q.o.length)) err(at + '：正解の番号が選択肢の外');
    if (new Set(q.o).size !== q.o.length) err(at + '：同じ選択肢がある');
    addEs(at, q.es); q.o.forEach(o => addMixed(at, o)); addTicks(at, q.q);
    if (!q.why) warn(at + '：why がない');
  });
  const need = Math.ceil(20 / Object.keys(QF.exam.secs).length);
  Object.keys(QF.exam.secs).forEach(s => { if ((per[s] || 0) < need + 2) warn('exam：' + s + ' の問題が少ない（' + (per[s] || 0) + '）'); });
} else err('quien/js/data/exam.js がない');

const unknown = new Map();
texts.forEach(t => tokens(t.es).forEach(tok => {
  if (names.has(tok) || index.has(tok)) return;
  if (!unknown.has(tok)) unknown.set(tok, []);
  const u = unknown.get(tok), src = t.src.split(/[ #]/)[0]; if (u.indexOf(src) < 0) u.push(src);
}));
if (WORDS) {
  [...unknown.keys()].sort().forEach(w => console.log(w + '\t' + unknown.get(w).join(',')));
  console.log('（' + unknown.size + ' 語）');
} else {
  unknown.forEach((src, tok) => err('単語帳にない語：' + tok + '（' + src.join(',') + '）'));
  console.log('\n事件 ' + QF.cases.length + ' 話・エラー ' + errors + '・注意 ' + warns);
}
process.exit(errors ? 1 : 0);
