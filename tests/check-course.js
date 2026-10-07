#!/usr/bin/env node
/* =========================================================
 * コースデータの整合性チェック（依存なし・Node だけで動く）
 *   使い方：node tests/check-course.js fe
 *   - courses/<id>/course.js の files に書かれた順にデータを読み込み、エンジンの core.js で検査する
 *   - 問題・レッスン・カード・ボスの整合性を検査し、件数を出す（リファクタ前後の比較用）
 * ========================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const courseId = process.argv[2] || 'fe';
const courseDir = 'courses/' + courseId + '/';
if (!fs.existsSync(path.join(root, courseDir, 'course.js'))) { console.error('コース設定がありません: ' + courseDir + 'course.js'); process.exit(2); }

const store = {};
const sandbox = {
  console, Math, Date, JSON, Object, Array, String, Number, RegExp, Error, parseInt, parseFloat, isNaN,
  localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
  matchMedia: () => ({ matches: false }), location: { search: '' }, navigator: {}
};
sandbox.window = sandbox;
vm.createContext(sandbox);
const run = (s) => vm.runInContext(fs.readFileSync(path.join(root, s), 'utf8'), sandbox, { filename: s });
run(courseDir + 'course.js');
run('engine/js/terms.js');
run('engine/js/api.js');
for (const f of sandbox.COURSE.files) run(courseDir + f);
run('engine/js/core.js');
const LE = sandbox.LE;
const Core = sandbox.Core;
Core.load();

const errors = [];
const err = (m) => errors.push(m);
const STEP_TYPES = ['say', 'term', 'quiz', 'bits', 'gate', 'order', 'match', 'num', 'steps', 'trace', 'stack', 'timeline', 'recap'];

/* ---- 問題 ---- */
const ids = new Set();
for (const q of LE.questions) {
  if (ids.has(q.id)) err('問題IDが重複: ' + q.id);
  ids.add(q.id);
  if (!Array.isArray(q.o) || q.o.length < 2) err('選択肢が不足: ' + q.id);
  else if (new Set(q.o).size !== q.o.length) err('選択肢が重複: ' + q.id);
  if ((q.a || 0) >= q.o.length) err('正解番号が範囲外: ' + q.id);
  if (!q.e) err('解説がない: ' + q.id);
  if (!LE.fields.find(f => f.id === q.f)) err('分野が未定義: ' + q.id + ' (' + q.f + ')');
}

/* ---- レッスン ---- */
const mapped = {};
let steps = 0;
for (const [lid, L] of Object.entries(LE.lessonDefs)) {
  if (!LE.units.find(u => u.id === L.unit)) err('ユニット未定義: ' + lid);
  for (const qid of L.q) { if (!ids.has(qid)) err('レッスンが存在しない問題を参照: ' + lid + ' → ' + qid); mapped[qid] = (mapped[qid] || 0) + 1; }
  if (!L.steps.length || L.steps[L.steps.length - 1].t !== 'recap') err('最後のステップがまとめ(recap)ではない: ' + lid);
  L.steps.forEach((s, i) => {
    steps++;
    const at = lid + ' step' + i;
    if (!STEP_TYPES.includes(s.t)) err('未知のステップ種別: ' + at + ' (' + s.t + ')');
    if (s.t === 'quiz') {
      if ((s.a || 0) >= s.o.length) err('正解番号が範囲外: ' + at);
      if (s.why && s.why.length !== s.o.length) err('why の数が選択肢と不一致: ' + at);
      if (new Set(s.o).size !== s.o.length) err('選択肢が重複: ' + at);
    }
    if (s.t === 'bits' && s.target != null && s.target >= Math.pow(2, s.n || 4)) err('bits の目標値が範囲外: ' + at);
    if (s.t === 'match' && new Set(s.pairs.map(p => p[1])).size !== s.pairs.length) err('match の右側が重複: ' + at);
    if (s.t === 'trace') { const n = s.code.split('\n').length; s.rows.forEach(r => { if (r.l >= n) err('trace の行番号が範囲外: ' + at); }); }
    if (s.t === 'num' && typeof s.answer !== 'number') err('num の answer が数値でない: ' + at);
    if (s.t === 'timeline') { if (!s.items || s.items.length < 3) err('timeline の項目が3つ未満: ' + at); else s.items.forEach(it => { if (typeof it.y !== 'number') err('timeline の y が数値でない: ' + at); }); }
  });
}
const unmapped = LE.questions.filter(q => !mapped[q.id]).map(q => q.id);
if (unmapped.length) err('どのレッスンにも属さない問題: ' + unmapped.join(', '));

/* ---- 復習カード ---- */
for (const c of Core.ALL_CARDS) {
  const d = (LE.cardDefs || {})[c.id];
  if (!d) { err('カード定義がない: ' + c.id); continue; }
  if (d.vizFind && !c.L.steps.some(s => s.viz && s.viz.includes(d.vizFind))) err('カードの vizFind がレッスン内に見つからない: ' + c.id + ' (' + d.vizFind + ')');
}

/* ---- ボス ---- */
for (const u of LE.units) if (!(LE.bosses || {})[u.id]) err('ボス未定義: ' + u.id);

const summary = {
  course: courseId,
  units: LE.units.length,
  lessons: Object.keys(LE.lessonDefs).length,
  steps,
  questions: LE.questions.length,
  cards: Core.ALL_CARDS.length,
  glossary: Object.keys(LE.glossary || {}).length
};
console.log(JSON.stringify(summary));
if (errors.length) { console.error('NG: ' + errors.length + '件'); errors.forEach(e => console.error(' - ' + e)); process.exit(1); }
console.log('OK: 整合性チェックをすべて通過');
