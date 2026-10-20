/* =========================================================
 * モル教室（mole.html）の教材チェック（Node）
 *   node tests/check-mole.js
 *  ・台本の形（知らない step・答えの番号・実験の名前）
 *  ・書式の閉じ忘れ（** __ (( ))）
 *  ・先生が4回以上つづけて話す（受け身の「読むだけ」）
 *  ・数字が変わる計算：答えが有限か、問題文に半端な小数（14.625 など）が出ないか
 * ========================================================= */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const noop = () => {};
const el = () => ({ getContext: () => ({}), addEventListener: noop, style: {}, setAttribute: noop });
const sb = {
  console, Math, JSON, Date, setTimeout, clearTimeout, Promise,
  location: { search: '' },
  localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
  document: { getElementById: el, addEventListener: noop, createElement: el, querySelector: () => null, querySelectorAll: () => [] },
  innerWidth: 400, innerHeight: 800, addEventListener: noop, requestAnimationFrame: noop, NodeFilter: {}
};
sb.window = sb;
vm.createContext(sb);
['mole/js/base.js', 'mole/js/data/glossary.js', 'mole/js/data/lessons.js', 'mole/js/data/lessons-extra.js', 'mole/js/data/drills.js']
  .forEach(f => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sb, { filename: f }));
const M = sb.M;
const PROPS = (fs.readFileSync(path.join(root, 'mole/js/props.js'), 'utf8').match(/P\.(\w+) = function/g) || []).map(s => s.slice(2).split(' ')[0]);

let err = 0, warn = 0;
const E = (w, m) => { err++; console.log('✗ ' + w + '：' + m); };
const W = (w, m) => { warn++; console.log('△ ' + w + '：' + m); };
function marks(w, s) {
  if (typeof s !== 'string') return;
  if ((s.match(/\*\*/g) || []).length % 2) E(w, '** が閉じていない：' + s);
  if ((s.match(/__/g) || []).length % 2) E(w, '__ が閉じていない：' + s);
  if ((s.match(/\(\(/g) || []).length !== (s.match(/\)\)/g) || []).length) E(w, '(( )) が対応していない：' + s);
  if (/\*\*[^*]*\$/.test(s)) W(w, '数式を太字にしている：' + s);
}
function texts(s) {
  if (typeof s === 'string') return [s];
  const out = [];
  ['t', 'ask', 'num', 'oops', 'mission', 'aim', 'board', 'foot', 'why', 'ok', 'fix', 'hint', 'q'].forEach(k => { if (typeof s[k] === 'string') out.push(s[k]); });
  ['opts', 'lines', 'steps'].forEach(k => { if (Array.isArray(s[k])) s[k].forEach(x => out.push(x)); });
  if (s.ng && typeof s.ng === 'object') Object.values(s.ng).forEach(x => out.push(x));
  if (typeof s.ng === 'string') out.push(s.ng);
  return out;
}
function checkStep(w, s, run) {
  texts(s).forEach(t => marks(w, t));
  if (typeof s === 'string' || s.t) { run.n++; if (run.n === 4) W(w, '先生が4回つづけて話している：' + (s.t || s).slice(0, 30)); return; }
  run.n = 0;
  if (s.reply) { s.reply.forEach(o => { if (o.then) { const r2 = { n: 0 }; o.then.forEach(x => checkStep(w + '（' + o.l + '）', x, r2)); } }); return; }
  if (s.ask) { if (!Array.isArray(s.opts) || s.a == null || s.a < 0 || s.a >= s.opts.length) E(w, '答えの番号がおかしい：' + s.ask); if (s.ng && typeof s.ng === 'object') Object.keys(s.ng).forEach(k => { if (+k === s.a || +k >= s.opts.length) E(w, 'ng の番号がおかしい：' + s.ask); }); return; }
  if (s.num) { if (typeof s.ans !== 'number' || !isFinite(s.ans)) E(w, '答えが数でない：' + s.num); if (!s.steps) W(w, '解き方（steps）がない：' + s.num); return; }
  if (s.oops) { if (s.bad == null || s.bad >= s.lines.length) E(w, 'まちがいの行番号がおかしい'); if (!s.fix) E(w, 'fix がない'); return; }
  if (s.prop) { if (PROPS.indexOf(s.prop) < 0) E(w, '実験がない：' + s.prop); return; }
  if (s.board) { if (!Array.isArray(s.lines)) E(w, '板書の lines がない'); return; }
  if (s.rush) return;
  E(w, '知らない step：' + JSON.stringify(s).slice(0, 60));
}
function checkQuiz(w, q) {
  if (q.gen) { if (!M.GEN[q.gen]) E(w, 'drill がない：' + q.gen); return; }
  texts(q).forEach(t => marks(w, t));
  if (q.opts) { if (q.a == null || q.a >= q.opts.length) E(w, '答えの番号がおかしい：' + q.q); if (!q.why) W(w, 'why がない：' + q.q); }
  else if (typeof q.num !== 'number') E(w, '答えがない：' + q.q);
}
const ALL = M.LESSONS.concat(M.EXTRA || []);
const ids = {};
ALL.forEach(L => {
  if (ids[L.id]) E(L.id, 'id が重複'); ids[L.id] = 1;
  ['title', 'sub', 'crystal', 'talk', 'quiz', 'note'].forEach(k => { if (!L[k]) E(L.id, k + ' がない'); });
  const run = { n: 0 };
  L.talk.forEach(s => checkStep(L.id, s, run));
  const rushN = L.talk.filter(s => s.rush).map(s => s.rush)[0] || 0;
  if (L.quiz.length < Math.max(rushN, 4)) W(L.id, 'quiz が少ない（' + L.quiz.length + '）');
  L.quiz.forEach(q => checkQuiz(L.id + ' quiz', q));
  L.note.tips.forEach(t => { marks(L.id + ' note', t.t); marks(L.id + ' note', t.why); });
  L.note.trivia.forEach(t => { marks(L.id + ' note', t.t); marks(L.id + ' note', t.b); });
  /* 採点される数 */
  let scored = 0;
  (function count(list) { list.forEach(s => { if (s.ask && !s.pre) scored++; else if (s.num || s.oops) scored++; else if (s.reply) s.reply.forEach(o => o.then && count(o.then)); }); })(L.talk);
  console.log('  ' + L.id + ' ' + L.title + '：台本 ' + L.talk.length + ' 行・採点 ' + scored + ' 問＋早押し ' + rushN + '・quiz ' + L.quiz.length);
});
/* 計算ドリル */
Object.keys(M.GEN).forEach(name => {
  for (let i = 0; i < 300; i++) {
    const q = M.GEN[name]();
    if (typeof q.num !== 'number' || !isFinite(q.num) || q.num <= 0) { E('drill ' + name, '答えがおかしい：' + q.num + ' / ' + q.q); break; }
    const all = [q.q].concat(q.steps || []).join(' ');
    if (/NaN|undefined/.test(all)) { E('drill ' + name, 'NaN/undefined：' + all); break; }
    const odd = (all.match(/\d+\.\d+/g) || []).filter(x => x.split('.')[1].replace(/0+$/, '').length >= 3)[0] ? [(all.match(/\d+\.\d+/g) || []).filter(x => x.split('.')[1].replace(/0+$/, '').length >= 3)[0]] : null;
    if (odd) { E('drill ' + name, '半端な小数 ' + odd[0] + '：' + q.q); break; }
    if (!q.steps || !q.steps.length) { E('drill ' + name, 'steps がない'); break; }
  }
});
console.log('\n' + (err ? '✗ エラー ' + err + ' 件' : '✓ エラーなし') + (warn ? '・注意 ' + warn + ' 件' : ''));
process.exit(err ? 1 : 0);
