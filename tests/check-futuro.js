#!/usr/bin/env node
/* =========================================================
 * ¿QUÉ SERÁ?（時制アプリ futuro/）の教材チェック
 *
 *   node tests/check-futuro.js            … 検査（エラーがあれば終了コード 1）
 *   node tests/check-futuro.js --words    … 単語帳（shared/es-words.js）にない語の一覧を出す
 *
 *  読みこむデータ：futuro/js/data/ の lessons.js・questions.js・cards.js・world.js と、shared/es-words.js。
 *
 *  チェックすること
 *   ・スペイン語の文に出てくる語が、すべて共通の単語帳にあるか
 *   ・問題：正解の番号・id の重複・同じ選択肢・form の p（時制）と s（主語）・who の a が地図のマスか・bug の語が文の中か
 *   ・レッスン：ステップの種類と必須の項目、forge（w の最後が cut・add が o の中）、orb・cast の人が場面にいるか、
 *     tapwhen と map のマスが FQ.map にあるか＋そのレッスン以前に開くか、flip の o と ans、
 *     同じ人が3回つづけて話さないか、読むだけのステップが4つ続かないか、吹き出しの1行が長すぎないか
 *   ・カード：id の重複・絵文字の重複・レッスンごとの枚数
 * ========================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const DATA = 'futuro/js/data/';
const FILES = ['shared/es-words.js'].concat(['lessons.js', 'questions.js', 'cards.js', 'world.js'].map(f => DATA + f));
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
FILES.forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f }));
const FQ = ctx.FQ, DICT = ctx.ES_WORDS;
FQ.bosses = FQ.bosses || []; FQ.world = FQ.world || { grow: {} };
let errors = 0, warns = 0;
function err(m) { errors++; console.log('❌ ' + m); }
function warn(m) { warns++; console.log('⚠  ' + m); }

const index = new Map();
DICT.words.forEach(e => [e.w].concat(e.f || []).forEach(f => index.set(f.toLowerCase(), e)));
const names = new Set((DICT.names || []).map(n => n.toLowerCase()));

/* ---------- 時間の地図（FQ.map が無ければ app.js の既定と同じ） ---------- */
const DEFAULT_MAP = {
  rows: ['now', 'past', 'fut', 'cond'].map(id => ({ id })), cols: ['s', 'p', 'g'].map(id => ({ id })),
  cells: [['now-s', 'now', 's', 0], ['past-s', 'past', 's', 0], ['fut-s', 'fut', 's', 1], ['cond-s', 'cond', 's', 5], ['now-p', 'now', 'p', 8], ['past-p', 'past', 'p', 9],
    ['fut-p', 'fut', 'p', 10], ['now-g', 'now', 'g', 11], ['past-g', 'past', 'g', 11], ['fut-g', 'fut', 'g', 11]].map(a => ({ id: a[0], r: a[1], c: a[2], L: a[3], given: !a[3], name: a[0], ex: 'x' })),
  notes: []
};
const MAP = FQ.map || DEFAULT_MAP;
const CELL = new Map(MAP.cells.map(c => [c.id, c]));
const lessonIdx = no => FQ.lessons.findIndex(x => x.no === no);

/* ---------- スペイン語の文を集める ---------- */
const JP = /[぀-ヿ一-鿿]/;
function clean(s) { return String(s).replace(/___/g, ' ').replace(/[\[\]{}^|]/g, ''); }
// 語ではない断片（芯の podr-・tendr-、語尾の -ado・-iendo など）は、ハイフンがついているので、語として数えない
function tokens(s) { return clean(s).toLowerCase().replace(/[a-záéíóúüñ]*-[a-záéíóúüñ]*/g, ' ').match(/[a-záéíóúüñ]+/g) || []; }
const texts = [];
function addEs(src, s) { if (typeof s === 'string' && s && !JP.test(s)) texts.push({ src, es: s }); }
function addTicks(src, s) { String(s || '').replace(/`([^`]+)`/g, (m, x) => { texts.push({ src, es: x }); return m; }); }
FQ.lessons.forEach(L => L.steps.forEach((st, i) => {
  const src = L.id + ' #' + (i + 1) + ' ' + st.t;
  ['es', 'out', 'w', 'a', 'b'].forEach(k => {
    if (typeof st[k] !== 'string') return;
    if (st.t === 'tapwhen' && k === 'a') return;   // tapwhen の a は地図のマスの id
    if (st.t === 'forge' && k === 'w') return;      // forge の w は、語尾を足す前の語（芯の断片 podr など）
    addEs(src, st[k]);
  });
  if (st.t !== 'forge') (st.o || []).forEach(o => { if (String(o).length > 2) addEs(src, o); });   // forge の o は、つける語尾（é・dré・ía など）の選択肢
  (st.tbl || []).forEach(r => r.forEach(c => addEs(src, c.replace(/（[^）]*）/g, ' ').replace(/[：:]/g, ' '))));
  ['x', 'r', 'why', 'more', 'q', 'ti', 'hint', 'need', 'ja_a', 'ja_b'].forEach(k => addTicks(src, st[k]));
  if (st.see) addTicks(src, st.see.x);
}));
FQ.questions.forEach(q => {
  const src = 'Q ' + q.id;
  addEs(src, q.s); addEs(src, q.ok); addEs(src, q.v);
  (q.d || []).forEach(d => addEs(src, d));
  if (q.k !== 'ja') (q.o || []).forEach(o => addEs(src, o));
  addTicks(src, q.why); addTicks(src, q.sit);
});
FQ.cards.forEach(c => addEs('card ' + c.id, c.es));

const used = new Map(), unknown = new Map();
const ENDINGS = new Set(['é', 'ás', 'á', 'emos', 'éis', 'án', 'ía', 'ías', 'íamos', 'íais', 'ían', 'ado', 'ido', 'ando', 'iendo']);   // 説明の中の語尾の断片は、語として数えない
texts.forEach(t => tokens(t.es).forEach(tok => {
  if (names.has(tok) || ENDINGS.has(tok)) return;
  const e = index.get(tok);
  if (!e) { if (!unknown.has(tok)) unknown.set(tok, { src: t.src, n: 0 }); unknown.get(tok).n++; return; }
  used.set(e, (used.get(e) || 0) + 1);
}));
if (process.argv.indexOf('--words') >= 0) {
  console.log('\n単語帳（shared/es-words.js）にない語 ' + unknown.size + ' 個：');
  [...unknown.entries()].sort().forEach(([tok, o]) => console.log('  ' + tok + '　×' + o.n + '（' + o.src + '）'));
  console.log('\n' + [...unknown.keys()].sort().join(' '));
  process.exit(0);
}
unknown.forEach((o, tok) => err('単語帳にない語：' + tok + '（' + o.src + '）'));

/* ---------- 問題 ---------- */
const ids = new Set(), perL = {};
const KINDS = { pick: 1, form: 1, scene: 1, who: 1, ja: 1, bug: 1, build: 1 };
const TENSES = { fut: 1, cond: 1, perf: 1, plup: 1, futp: 1, prog: 1 };
const SUBJS = { yo: 1, 'tú': 1, 'él': 1, nosotros: 1, vosotros: 1, ellos: 1 };
FQ.questions.forEach(q => {
  if (ids.has(q.id)) err('問題 id の重複：' + q.id);
  ids.add(q.id);
  perL[q.L] = (perL[q.L] || 0) + 1;
  if (!KINDS[q.k]) err(q.id + '：知らない kind ' + q.k);
  if (q.k !== 'who' && q.o && (q.a < 0 || q.a >= q.o.length)) err(q.id + '：正解の番号が選択肢の外');
  if (q.k === 'who') {
    if (!CELL.has(q.a)) err(q.id + '：who の a「' + q.a + '」が FQ.map のマスにない');
    if (!q.s) err(q.id + '：who に s（文）がない');
  }
  if (q.k === 'form') {
    if (!TENSES[q.p]) err(q.id + '：form の p「' + q.p + '」は fut・cond・perf・plup・futp・prog のどれか');
    if (!SUBJS[q.s]) err(q.id + '：form の s「' + q.s + '」は yo・tú・él・nosotros・vosotros・ellos のどれか');
    if (!q.v) err(q.id + '：form に v（原形）がない');
  }
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
const PASSIVE = { say: 1, tip: 1, map: 1 };   // show・enter はすぐ次へ進むので数えない
const NEED = {
  say: ['x'], show: [], ask: ['q', 'o', 'a'], forge: ['w', 'o'], orb: ['who', 'need', 'o', 'a', 'out', 'ja'], cast: ['who', 'need', 'o', 'a', 'out', 'ja'],
  tapwhen: ['es', 'a'], flip: ['a', 'ja_a', 'b', 'ja_b', 'day_a', 'day_b'], map: ['hi', 'x'], enter: ['who'], tip: ['id', 'ti', 'x'], q: ['id'], drill: ['n']
};
const group = s => { const m = /\{([^}]+)\}/.exec(String(s)); return m ? m[1].replace(/\^/g, '') : null; };
FQ.lessons.forEach((L, li) => {
  let run = 0, mute = 0, last = null;
  const here = new Set(L.actors || []);
  const cellOk = (at, id, what) => {
    const c = CELL.get(id);
    if (!c) return err(at + '：' + what + '「' + id + '」が FQ.map のマスにない');
    if (!c.given) { const ni = lessonIdx(c.L); if (ni < 0 || ni > li) err(at + '：' + what + '「' + id + '」はまだ習っていないマス（L' + c.L + '）'); }
  };
  L.steps.forEach((st, i) => {
    const at = L.id + ' #' + (i + 1);
    if (!NEED[st.t]) return err(at + '：知らないステップ ' + st.t);
    NEED[st.t].forEach(k => { if (st[k] == null || st[k] === '') err(at + '：' + st.t + ' に ' + k + ' がない'); });
    if (st.t === 'show' && !st.tbl && !st.es) err(at + '：show に tbl も es もない');
    if (st.t === 'q' && !ids.has(st.id)) err(at + '：問題 ' + st.id + ' がない');
    if ((st.t === 'ask' || st.t === 'orb' || st.t === 'cast') && st.o && (st.a < 0 || st.a >= st.o.length)) err(at + '：' + st.t + ' の正解の番号が選択肢の外');
    if ((st.t === 'orb' || st.t === 'cast') && !/\{/.test(st.out || '')) err(at + '：' + st.t + ' の out に {形} がない');
    if (st.t === 'forge') {
      if (st.cut && !st.w.endsWith(st.cut)) err(at + '：forge の w が cut で終わっていない');
      if (st.add && (st.o || []).indexOf(st.add) < 0) err(at + '：forge の add が o にない');
      if (!st.cut && !st.add) err(at + '：forge に cut も add もない');
      if (!/\{/.test(st.out || '')) err(at + '：forge の out に {形} がない');
    }
    if (st.t === 'flip') {
      if (!/\{/.test(st.a || '') || !/\{/.test(st.b || '')) err(at + '：flip の a・b に {動詞} がない');
      if (st.o) {
        const ans = st.ans || 0;
        if (!Array.isArray(st.o) || st.o.length < 2) err(at + '：flip の o は2つ以上');
        else if (ans < 0 || ans >= st.o.length) err(at + '：flip の ans が o の外');
        else if (group(st.b) && st.o[ans] !== group(st.b)) err(at + '：flip の o[ans]「' + st.o[ans] + '」が b の動詞「' + group(st.b) + '」とちがう');
        if (st.o && new Set(st.o).size !== st.o.length) err(at + '：flip の o に同じ選択肢が2つある');
      }
    }
    if ((st.t === 'orb' || st.t === 'cast') && st.who && !here.has(st.who)) err(at + '：' + st.t + ' の ' + st.who + ' が場面にいない（enter か actors に）');
    if (st.who || st.t === 'enter') here.add(st.who);
    if ((st.t === 'orb' || st.t === 'cast' || st.t === 'enter' || (st.t === 'say' && st.who)) && !FQ.people[st.who]) err(at + '：知らない人 ' + st.who);
    if (st.t === 'map') {
      if (!Array.isArray(st.hi) || !st.hi.length) err(at + '：map の hi が空');
      (st.hi || []).forEach(id => cellOk(at, id, 'map の hi'));
    }
    if (st.t === 'tapwhen') cellOk(at, st.a, 'tapwhen の正解');
    if (st.t !== 'show' && st.t !== 'enter') run = PASSIVE[st.t] ? run + 1 : 0;
    if (run === 4) warn(at + '：読むだけのステップが4つ続いている');
    const key = st.t === 'say' && !st.more ? (st.who || 'luna') : null;
    if (key && key === last) mute++; else mute = key ? 1 : 0;
    last = key;
    if (mute === 3) warn(at + '：' + (FQ.people[key] ? FQ.people[key].n : key) + ' が3回つづけて話している（返事・問いで区切る）');
    (st.t === 'say' ? String(st.x || '') : '').split('\n').forEach(line => {
      const len = line.replace(/\*\*|__|\(\(|\)\)|`|[\[\]{}^]/g, '').length;
      if (len > 30) warn(at + '：吹き出しの1行が長い（' + len + '字）「' + line.slice(0, 20) + '…」');
    });
  });
  if (!perL[L.no]) err(L.id + '：問題バンクに問題がない');
  const drill = L.steps.filter(s => s.t === 'drill').reduce((a, s) => a + s.n, 0);
  if (drill > (perL[L.no] || 0)) err(L.id + '：drill の問題数が問題バンクより多い');
  if (!FQ.world.grow[L.id]) warn(L.id + '：占い館の育ち（world.grow）がない');
  if (!L.ev || !FQ.people[L.ev.who] || !L.ev.line) warn(L.id + '：ホームのお客の相談（ev: { who, line }）がない');
});
FQ.bosses.forEach(B => { if (!FQ.world.grow[B.id]) warn(B.id + '：占い館の育ち（world.grow）がない'); });

/* ---------- 時間の地図（FQ.map） ---------- */
if (FQ.map) {
  const rids = new Set(MAP.rows.map(x => x.id)), cids2 = new Set(MAP.cols.map(x => x.id)), seen = new Set();
  MAP.cells.forEach(c => {
    if (seen.has(c.id)) err('地図のマス ' + c.id + '：id の重複');
    seen.add(c.id);
    if (!rids.has(c.r)) err('地図のマス ' + c.id + '：r「' + c.r + '」が rows にない');
    if (!cids2.has(c.c)) err('地図のマス ' + c.id + '：c「' + c.c + '」が cols にない');
    if (!c.name || !c.ex) err('地図のマス ' + c.id + '：name・ex がない');
    if (!c.given && !c.op) err('地図のマス ' + c.id + '：op（作り方）がない');
    if (!c.given && !FQ.lessons.some(x => x.no === c.L)) err('地図のマス ' + c.id + '：L' + c.L + ' のレッスンがない');
  });
  (MAP.notes || []).forEach(n => (n.at || []).forEach(id => { if (!CELL.has(id)) err('地図の notes ' + n.id + '：at「' + id + '」がマスにない'); }));
  if (new Set(MAP.cells.map(c => c.name)).size !== MAP.cells.length) warn('地図のマスの name に同じものがある（「いつの話？」の選択肢が重なる）');
}

/* ---------- カード ---------- */
const cids = new Set(), icons = new Set();
FQ.cards.forEach(c => {
  if (cids.has(c.id)) err('カード id の重複：' + c.id);
  cids.add(c.id);
  if (icons.has(c.icon)) warn('カードの絵文字の重複：' + c.icon + '（' + c.id + '）');
  icons.add(c.icon);
});
FQ.lessons.forEach(L => { const n = FQ.cards.filter(c => c.L === L.no).length; if (n !== 5) warn(L.id + '：カードが ' + n + ' 枚（5枚のはず）'); });
FQ.bosses.forEach(B => { if (!FQ.cards.some(c => c.id === 'u-' + B.id)) err(B.id + '：UR カード u-' + B.id + ' がない'); });

console.log('\nレッスン ' + FQ.lessons.length + '・問題 ' + FQ.questions.length + '（' + Object.keys(perL).map(k => 'L' + k + ':' + perL[k]).join(' ') + '）・カード ' + FQ.cards.length + '・ボス ' + FQ.bosses.length);
console.log('スペイン語の文 ' + texts.length + '・使った見出し語 ' + used.size + '／単語帳 ' + DICT.words.length + (unknown.size ? '・単語帳にない語 ' + unknown.size + '（--words で一覧）' : ''));
console.log(errors ? '\n❌ エラー ' + errors + '・注意 ' + warns : '\n✅ エラーなし（注意 ' + warns + '）');
process.exit(errors ? 1 : 0);
