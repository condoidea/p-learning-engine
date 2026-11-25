#!/usr/bin/env node
/* =========================================================
 * ¡OJALÁ!（接続法現在アプリ ojala/）の教材チェック
 *
 *   node tests/check-ojala.js            エラー・注意を出す
 *   node tests/check-ojala.js --words    単語帳（shared/es-words.js）にない語の一覧だけ
 *
 *  チェックすること
 *   ・スペイン語の文に出てくる語が、すべて共通の単語帳にあるか
 *   ・問題：正解の番号が選択肢の中か、bug の語が文の中か、mood の full と s が合うか、ng の fit、id の重複、同じ選択肢
 *   ・レッスン：q の id、forge（w の最後が cut・add が o の中）、seal（mood・a・out・mis・人）、
 *     読むだけ（say・tip・map）が4つ以上続かないか、パロマが3回つづけて話さないか、吹き出しの1行が長すぎないか
 *   ・地図：枝の from・L、レッスンの map の hi がまだ習っていない枝でないか
 *   ・🖋 形の工房（verbs.js）：6つの形がぜんぶ単語帳にあるか（つづりの書きかえ・例外の形も）
 *   ・カード：id の重複・絵文字の重複・レッスンごとの枚数・UR
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
const FILES = ['shared/es-words.js', 'ojala/js/data/lessons.js', 'ojala/js/data/questions.js', 'ojala/js/data/cards.js', 'ojala/js/data/world.js', 'ojala/js/data/verbs.js'];
const W = load(FILES);
const OQ = W.OQ, DICT = W.ES_WORDS;
const WORDS_ONLY = process.argv.indexOf('--words') >= 0;
let errors = 0, warns = 0;
function err(m) { errors++; if (!WORDS_ONLY) console.log('❌ ' + m); }
function warn(m) { warns++; if (!WORDS_ONLY) console.log('⚠  ' + m); }

const index = new Map();
DICT.words.forEach(e => [e.w].concat(e.f || []).forEach(f => index.set(f.toLowerCase(), e)));
const names = new Set((DICT.names || []).map(n => n.toLowerCase()));

/* ---------- スペイン語の文を集める ---------- */
const JP = /[぀-ヿ一-鿿]/;
function clean(s) { return String(s).replace(/___/g, ' ').replace(/[\[\]{}^|]/g, ''); }
function tokens(s) { return clean(s).toLowerCase().match(/[a-záéíóúüñ]+/g) || []; }
const texts = [];
function addEs(src, s) { if (s && !JP.test(s)) texts.push({ src, es: s }); }
function addTicks(src, s) { String(s || '').replace(/`([^`]+)`/g, (m, x) => { texts.push({ src, es: x }); return m; }); }
OQ.lessons.forEach(L => L.steps.forEach((st, i) => {
  const src = L.id + ' #' + (i + 1) + ' ' + st.t;
  ['es', 'out', 'w'].forEach(k => { if (typeof st[k] === 'string') addEs(src, st[k]); });
  if (st.t !== 'forge') (st.o || []).forEach(o => { if (o.length > 2) addEs(src, o); });
  (st.tbl || []).forEach(r => r.forEach(c => addEs(src, c.replace(/（[^）]*）/g, ' ').replace(/[：:]/g, ' '))));
  ['x', 'r', 'why', 'more', 'q', 'ti', 'hint', 'need', 'mis'].forEach(k => addTicks(src, st[k]));
  if (st.t === 'letter') { addEs(src, st.to); addEs(src, String(st.sign).replace(/\n/g, ' ')); (st.body || []).forEach(b => addEs(src, b[0])); }
}));
OQ.questions.forEach(q => {
  const src = 'Q ' + q.id;
  addEs(src, q.s); addEs(src, q.ok); addEs(src, q.v); addEs(src, q.full);
  (q.d || []).forEach(d => addEs(src, d));
  if (q.k !== 'ja') (q.o || []).forEach(o => addEs(src, o));
  addTicks(src, q.why);
});
OQ.cards.forEach(c => addEs('card ' + c.id, c.es));
OQ.map.nodes.forEach(n => { addEs('map ' + n.id, n.ex); if (n.op) addEs('map ' + n.id, n.op.replace(/（[^）]*）/g, ' ')); });

const used = new Map(), unknown = new Map();
texts.forEach(t => tokens(t.es).forEach(tok => {
  if (names.has(tok)) return;
  const e = index.get(tok);
  if (!e) { if (!unknown.has(tok)) unknown.set(tok, t.src); return; }
  used.set(e, (used.get(e) || 0) + 1);
}));
unknown.forEach((src, tok) => err('単語帳にない語：' + tok + '（' + src + '）'));

/* ---------- 🖋 形の工房（verbs.js） ---------- */
const forms = [];
(OQ.verbs || []).forEach(v => {
  if (!OQ.lessons.some(L => L.no === v.L)) err('工房 ' + v.inf + '：L' + v.L + ' の依頼がない');
  if (!v.forms && v.yo.slice(-1) !== 'o') err('工房 ' + v.inf + '：yo が o で終わっていない（forms を書く）');
  if ((v.ex === 'oy' || v.ex === 'own') && !v.el) err('工房 ' + v.inf + '：例外なのに el がない');
  if (v.ex === 'spell' && !/(car|gar|zar)$/.test(v.inf)) err('工房 ' + v.inf + '：spell は -car・-gar・-zar だけ');
  const F = OQ.subForms(v);
  if (F.length !== 6) err('工房 ' + v.inf + '：形が6つでない');
  if (new Set(F).size < 5) err('工房 ' + v.inf + '：形の重なりが多すぎる（' + F.join(' ') + '）');
  [v.inf, v.yo].concat(F).forEach(f => { forms.push(f); if (!index.has(f.toLowerCase())) err('工房：単語帳にない形 ' + f + '（' + v.inf + '）'); });
});
if (WORDS_ONLY) {
  const all = new Map(unknown);
  console.log([...all.keys()].sort().join('\n'));
  process.exit(0);
}

/* ---------- 問題 ---------- */
const ids = new Set(), perL = {};
const KINDS = { pick: 1, form: 1, mood: 1, ng: 1, ja: 1, bug: 1, build: 1 };
const PERS = { yo: 1, 'tú': 1, 'él': 1, nosotros: 1, vosotros: 1, ellos: 1 };
OQ.questions.forEach(q => {
  if (ids.has(q.id)) err('問題 id の重複：' + q.id);
  ids.add(q.id);
  perL[q.L] = (perL[q.L] || 0) + 1;
  if (!KINDS[q.k]) err(q.id + '：知らない kind ' + q.k);
  if (q.o && (q.a < 0 || q.a >= q.o.length)) err(q.id + '：正解の番号が選択肢の外');
  if ((q.k === 'pick' || q.k === 'mood' || q.k === 'ng') && (q.s.match(/___/g) || []).length !== 1) err(q.id + '：___ は1つ');
  if (q.k === 'form' && !PERS[q.p]) err(q.id + '：form の p「' + q.p + '」');
  if (q.k === 'mood') {
    if (q.a !== 0 && q.a !== 1) err(q.id + '：mood の a は 0 か 1');
    if (!q.full || !q.v) err(q.id + '：mood に full・v がない');
    else {
      const m = /\{([^}]+)\}/.exec(q.full);
      if (!m || q.s.replace('___', '{' + m[1] + '}') !== q.full) err(q.id + '：mood の full が s と合わない');
    }
  }
  if (q.k === 'ng') {
    if (q.fit == null || q.fit === q.a || q.fit < 0 || q.fit >= q.o.length) err(q.id + '：ng の fit（入る選択肢）がおかしい');
  }
  if (q.k === 'bug') {
    const words = q.s.split(/\s+/).map(w => w.replace(/[¿?¡!.,—:;]/g, ''));
    if (words.indexOf(q.a) < 0) err(q.id + '：「' + q.a + '」が文の中にない');
    if (!q.ok) err(q.id + '：bug に ok（正しい文）がない');
  }
  if (q.k === 'build' && q.s.split(/\s+/).length > 7) warn(q.id + '：build のタイルが多い');
  if (q.o && new Set(q.o).size !== q.o.length) err(q.id + '：同じ選択肢が2つある');
  if (!q.why && q.k !== 'build') warn(q.id + '：why がない');
  if (/\n/.test(JSON.stringify(q).replace(/\\n/g, ''))) err(q.id + '：文字列の中に生の改行');
});

/* ---------- レッスン ---------- */
const PASSIVE = { say: 1, tip: 1, map: 1 };
const mapNode = id => OQ.map.nodes.find(x => x.id === id);
OQ.lessons.forEach((L, li) => {
  let run = 0, owl = 0;
  const here = new Set(L.actors || []);
  if (!OQ.people[L.ev.who]) err(L.id + '：ev の人 ' + L.ev.who + ' がいない');
  L.steps.forEach((st, i) => {
    const at = L.id + ' #' + (i + 1);
    if (st.t === 'q' && !ids.has(st.id)) err(at + '：問題 ' + st.id + ' がない');
    if (st.t === 'ask' && (st.a < 0 || st.a >= st.o.length)) err(at + '：ask の正解の番号が選択肢の外');
    if (st.t === 'seal') {
      if (!OQ.people[st.who]) err(at + '：知らない人 ' + st.who);
      if (st.mood !== 'sub' && st.mood !== 'ind') err(at + '：seal の mood は sub か ind');
      if (st.a < 0 || st.a >= st.o.length) err(at + '：seal の正解の番号が選択肢の外');
      if (!/\{/.test(st.out)) err(at + '：seal の out に {形} がない');
      if ((st.es.match(/___/g) || []).length !== 1) err(at + '：seal の es の ___ は1つ');
      const m = /\{([^}]+)\}/.exec(st.out);
      if (m && m[1] !== st.o[st.a]) err(at + '：seal の out の形（' + m[1] + '）が正解（' + st.o[st.a] + '）とちがう');
      if (m && clean(st.es.replace('___', m[1])) !== clean(st.out)) err(at + '：seal の es と out が合わない');
      if (!st.mis) err(at + '：seal に mis（誤解の返事）がない');
      if (!st.why) warn(at + '：seal に why がない');
      if (new Set(st.o).size !== st.o.length) err(at + '：seal に同じ選択肢');
    }
    if (st.t === 'letter') {
      if (!Array.isArray(st.body) || !st.body.length) err(at + '：letter の body が空');
      (st.body || []).forEach(b => { if (!/\{/.test(b[0])) warn(at + '：letter の行に {形} がない「' + b[0] + '」'); if (!b[1]) err(at + '：letter の行に訳がない'); });
      if (!st.to || !st.sign) err(at + '：letter に宛名（to）か署名（sign）がない');
    }
    if (st.t === 'forge') {
      if (st.cut && !st.w.endsWith(st.cut)) err(at + '：forge の w が cut で終わっていない');
      if (st.add && (st.o || []).indexOf(st.add) < 0) err(at + '：forge の add が o にない');
      if (clean(st.out) !== st.w.slice(0, st.w.length - (st.cut || '').length) + (st.add || '')) err(at + '：forge の out が w − cut ＋ add と合わない');
    }
    if (st.who || st.t === 'enter') here.add(st.who);
    if (st.t === 'map') {
      if (!Array.isArray(st.hi) || !st.hi.length) err(at + '：map の hi が空');
      (st.hi || []).forEach(id => {
        const n = mapNode(id);
        if (!n) return err(at + '：map の hi「' + id + '」が OQ.map.nodes にない');
        const ni = OQ.lessons.findIndex(x => x.no === n.L);
        if (ni < 0 || ni > li) err(at + '：map の hi「' + id + '」はまだ習っていない依頼（L' + n.L + '）の枝');
      });
      if (!st.x) err(at + '：map に x（パロマの一言）がない');
    }
    if (st.t !== 'show' && st.t !== 'enter') run = PASSIVE[st.t] ? run + 1 : 0;
    if (run === 4) warn(at + '：読むだけのステップが4つ続いている');
    owl = st.t === 'say' && !st.who ? owl + 1 : (st.t === 'show' || st.t === 'enter' ? owl : 0);
    if (owl === 3) warn(at + '：パロマが3回つづけて話している（返事・問いで区切る）');
    (st.t === 'say' || st.t === 'mono' ? String(st.x || '') : '').split('\n').forEach(line => {
      const len = line.replace(/\*\*|__|\(\(|\)\)|`|[\[\]{}^]/g, '').length;
      if (len > 30) warn(at + '：吹き出しの1行が長い（' + len + '字）「' + line.slice(0, 20) + '…」');
    });
  });
  if (!perL[L.no]) err(L.id + '：問題バンクに問題がない');
  const drill = L.steps.filter(s => s.t === 'drill').reduce((a, s) => a + s.n, 0);
  if (drill > (perL[L.no] || 0)) err(L.id + '：drill の問題数が問題バンクより多い');
  if (!OQ.world.grow[L.id]) warn(L.id + '：町の育ち（world.grow）がない');
  if (!L.steps.some(s => s.t === 'tip')) warn(L.id + '：tip がない');
});
OQ.bosses.forEach(B => {
  if (!OQ.world.grow[B.id]) warn(B.id + '：町の育ち（world.grow）がない');
  B.from.forEach(id => { if (!OQ.lessons.some(L => L.id === id)) err(B.id + '：from の ' + id + ' がない'); });
});

/* ---------- 封蝋の地図（OQ.map） ---------- */
const sids = new Set(OQ.map.starts.map(x => x.id)), nids = new Set(OQ.map.nodes.map(x => x.id));
OQ.map.nodes.forEach(n => {
  if (!sids.has(n.from) && !nids.has(n.from)) err('地図の枝 ' + n.id + '：from「' + n.from + '」がない');
  if (!OQ.lessons.some(x => x.no === n.L)) err('地図の枝 ' + n.id + '：L' + n.L + ' の依頼がない');
  if (n.kind === 'ex' ? !n.ti : !(n.who && n.op)) err('地図の枝 ' + n.id + '：who・op（例外の札は ti）がない');
  if (!n.ex) err('地図の枝 ' + n.id + '：ex がない');
});

/* ---------- カード ---------- */
const cids = new Set(), icons = new Set();
OQ.cards.forEach(c => {
  if (cids.has(c.id)) err('カード id の重複：' + c.id);
  cids.add(c.id);
  if (icons.has(c.icon)) warn('カードの絵文字の重複：' + c.icon + '（' + c.id + '）');
  icons.add(c.icon);
  if (!/\{/.test(c.es)) warn('カード ' + c.id + '：es に {形} がない');
});
OQ.lessons.forEach(L => { const n = OQ.cards.filter(c => c.L === L.no).length; if (n < 5) warn(L.id + '：カードが ' + n + ' 枚（5枚のはず）'); });
OQ.bosses.forEach(B => { if (!OQ.cards.some(c => c.id === 'u-' + B.id)) err(B.id + '：UR カード u-' + B.id + ' がない'); });

const kinds = {}; OQ.questions.forEach(q => { kinds[q.k] = (kinds[q.k] || 0) + 1; });
console.log('\nレッスン ' + OQ.lessons.length + '・問題 ' + OQ.questions.length + '（' + Object.keys(perL).map(k => 'L' + k + ':' + perL[k]).join(' ') + '）・種類 ' + JSON.stringify(kinds) + '・カード ' + OQ.cards.length + '・工房の動詞 ' + (OQ.verbs || []).length);
console.log('スペイン語の文 ' + texts.length + '・使った見出し語 ' + used.size + '／単語帳 ' + DICT.words.length);
console.log(errors ? '\n❌ エラー ' + errors + '・注意 ' + warns : '\n✅ エラーなし（注意 ' + warns + '）');
process.exit(errors ? 1 : 0);
