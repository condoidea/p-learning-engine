#!/usr/bin/env node
/* =========================================================
 * ユーキ・クエスト（yuki/）の教材チェック
 *
 *   node tests/check-yuki.js
 *
 *  チェックすること
 *   ・呪文：詠唱のあとの分子の「手の数」が合っているか（C4・H1・O2・Cl1・Br1）。素材の分子も
 *   ・呪文：読み（y）がひらがな・カタカナ・記号だけか（漢字が入ると機種で読みがぶれる）
 *   ・台本：分子・カード・呪文・Tips の id があるか、問題の答えが選択肢の中にあるか
 *   ・錬成：答えの形が素材の数と合っているか、同じ形の答えが2つないか
 *   ・テトラが3回つづけて話していないか（受け身の「読むだけ」を防ぐ）、吹き出しの1行が長すぎないか（40字超は注意）
 * ========================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const ctx = { window: {}, console };
ctx.window.window = ctx.window;
vm.createContext(ctx.window);
['yuki/js/mol.js', 'yuki/js/data/spells.js', 'yuki/js/data/tips.js', 'yuki/js/data/lessons.js', 'yuki/js/data/side.js', 'yuki/js/data/bosses.js'].forEach(f => {
  /* core.js は画面が必要なので、ここで使う部品だけ用意する */
  if (f === 'yuki/js/mol.js') { ctx.window.Y = { gloss(o) { this.GL = Object.assign(this.GL || {}, o); } }; }
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx.window, { filename: f });
});
const Y = ctx.window.Y;
let errors = 0, warns = 0;
const err = m => { errors++; console.log('❌ ' + m); };
const warn = m => { warns++; console.log('⚠  ' + m); };

/* ---------- 分子・呪文 ---------- */
for (const [id, m] of Object.entries(Y.MOLS)) {
  const bad = Y.Mol.valenceErrors(m.s);
  if (!m.bad && bad.length) err('分子 ' + id + '：手の数が合わない ' + bad.join(' '));
  if (m.bad && !bad.length) err('分子 ' + id + '：まちがい探し用なのに、手の数が合っている');
}
const KANA = /^[ぁ-ゖァ-ヺー、。！？・\s]+$/;
for (const [id, sp] of Object.entries(Y.SPELLS)) {
  if (!Y.MOLS[sp.from]) err('呪文 ' + id + '：素材 ' + sp.from + ' がない');
  ['reagent', 'cond'].forEach(k => { if (!Y.CARDS[sp[k]]) err('呪文 ' + id + '：カード ' + sp[k] + ' がない'); });
  if (!Y.ATTR[sp.attr]) err('呪文 ' + id + '：属性 ' + sp.attr + ' がない');
  let s;
  try {
    s = Y.Mol.applyOps(Y.MOLS[sp.from].s, sp.start);
    sp.lines.forEach((ln, i) => {
      s = Y.Mol.applyOps(s, ln.ops);
      if (!KANA.test(ln.y)) err('呪文 ' + id + ' ' + (i + 1) + '行目：読みに漢字などが入っている「' + ln.y + '」');
    });
  } catch (e) { err('呪文 ' + id + '：' + e.message); continue; }
  const bad = Y.Mol.valenceErrors(s);
  if (bad.length) err('呪文 ' + id + '：詠唱のあとの手の数が合わない ' + bad.join(' '));
  if (!/^顕現せよ/.test(sp.lines[sp.lines.length - 1].t)) warn('呪文 ' + id + '：最後の行が「顕現せよ」ではない');
  if (!sp.lines.some(l => l.key)) warn('呪文 ' + id + '：key の行がない（詠唱短縮で最後の行だけになる）');
  Object.keys(sp.ng || {}).forEach(k => { if (!Y.CARDS[k]) err('呪文 ' + id + '：ng のカード ' + k + ' がない'); });
}

/* ---------- 錬成 ---------- */
const B = Y.BuildCore;
function checkBuild(src, pz) {
  const seen = {};
  pz.answers.forEach(a => {
    const p = B.parseSet(a.set), cnt = {};
    Object.values(p).forEach(el => { cnt[el] = (cnt[el] || 0) + 1; });
    Object.keys(pz.mat).filter(el => el !== 'H').forEach(el => { if ((cnt[el] || 0) !== pz.mat[el]) err(src + '：「' + a.name + '」の ' + el + ' の数が素材と合わない'); });
    if ((pz.mat.H || 0) !== B.hNeed(p)) err(src + '：「' + a.name + '」に必要な H は ' + B.hNeed(p) + ' 個（素材は ' + (pz.mat.H || 0) + ' 個）');
    Object.keys(p).forEach(sl => { if (!B.SLOTS[sl]) err(src + '：マス ' + sl + ' がない'); });
    if (!B.connected(p)) err(src + '：「' + a.name + '」がつながっていない');
    const c = B.canon(p);
    if (seen[c]) err(src + '：「' + a.name + '」と「' + seen[c] + '」が同じ形');
    seen[c] = a.name;
  });
}

/* ---------- 台本 ---------- */
const lineLen = (t, src) => String(t).split('\n').forEach(l => {
  const n = l.replace(/\*\*|__|\(\(|\)\)/g, '').length;
  if (n > 40) warn(src + '：1行が長い（' + n + '字）「' + l.slice(0, 24) + '…」');
});
function checkQ(src, q) {
  if (!Array.isArray(q.opts) || q.a == null || q.a < 0 || q.a >= q.opts.length) err(src + '：答えが選択肢の中にない');
  if (q.mols) q.opts.forEach(o => { if (!Y.MOLS[o]) err(src + '：分子 ' + o + ' がない'); });
}
function walk(steps, src, run) {
  steps.forEach((s, i) => {
    const at = src + ' #' + (i + 1);
    const talk = typeof s === 'string' || s.t;
    if (talk) {
      run.n++;
      if (run.n === 3) warn(at + '：テトラが3回つづけて話している（返事で区切る）');
      lineLen(typeof s === 'string' ? s : s.t, at);
      return;
    }
    run.n = 0;
    if (s.story) { lineLen(s.story, at); return; }
    if (s.reply) { s.reply.forEach(o => { if (o.then) walk(o.then, at + ' 分岐', { n: 0 }); }); return; }
    if (s.ask) { checkQ(at, s); lineLen(s.ask, at); return; }
    if (s.show) { if (!Y.MOLS[s.show]) err(at + '：分子 ' + s.show + ' がない'); return; }
    if (s.pic) { if (!B.connected(B.parseSet(s.pic))) err(at + '：pic がつながっていない'); return; }
    if (s.build) { checkBuild(at, s.build); return; }
    if (s.cast) {
      const c = s.cast;
      if (!Y.SPELLS[c.goal]) { err(at + '：呪文 ' + c.goal + ' がない'); return; }
      const g = Y.SPELLS[c.goal];
      (c.pool || []).forEach(p => { if (!Y.SPELLS[p]) err(at + '：pool の呪文 ' + p + ' がない'); });
      (c.reagents || []).concat(c.conds || []).forEach(k => { if (!Y.CARDS[k]) err(at + '：カード ' + k + ' がない'); });
      if ((c.reagents || []).indexOf(g.reagent) < 0) err(at + '：正解の試薬 ' + g.reagent + ' がカードにない');
      if (c.conds && c.conds.indexOf(g.cond) < 0) err(at + '：正解の条件 ' + g.cond + ' がカードにない');
      return;
    }
    if (s.tip) { if (!Y.TIPS[s.tip]) err(at + '：Tips ' + s.tip + ' がない'); return; }
    if (s.match) {
      (s.match.rounds || []).forEach((r, k) => {
        if (r.length < 2) err(at + '：マッチングの ' + (k + 1) + ' 回目が 2 組より少ない');
        const lefts = new Set(r.map(p => String(p[0])));
        if (lefts.size !== r.length) err(at + '：マッチングの ' + (k + 1) + ' 回目に同じ左がある');
        r.forEach(p => { if (p[1] && p[1].pic) { if (!B.connected(B.parseSet(p[1].pic))) err(at + '：マッチングの図がつながっていない'); else { const a = B.appraiseSet(p[1].pic); if (a.name && a.name !== p[0]) err(at + '：「' + p[0] + '」の図は ' + a.name); } } });
      });
      return;
    }
    if (s.slam || s.journey) return;
    err(at + '：知らないステップ ' + JSON.stringify(s).slice(0, 60));
  });
}
Y.LESSONS.forEach(L => walk(L.steps, L.id, { n: 0 }));
/* 寄り道クエスト：問題は毎回作るので、何度か作って全部点検する */
Y.shuffle = Y.shuffle || (a => a.slice().sort(() => Math.random() - 0.5));
(Y.GUILD || []).forEach(q => {
  if (!Y.LESSONS.some(l => l.id === q.after)) err('依頼 ' + q.id + '：after ' + q.after + ' がない');
  if (!Y.GUILD_TYPES[q.type]) err('依頼 ' + q.id + '：種類 ' + q.type + ' がない');
  for (let k = 0; k < 30; k++) {
    if (q.run === 'battle') { const b = q.make(); b.qs.forEach(id => { const x = Y.QS[id]; if (!x) err('依頼 ' + q.id + '：問題 ' + id + ' がない'); else { checkQ('依頼 ' + q.id + ' ' + id, x); if (x.pic && !B.connected(B.parseSet(x.pic))) err('依頼 ' + q.id + '：図がつながっていない'); } }); }
    else walk(q.make(), q.id + '（' + (k + 1) + '回目）', { n: 0 });
  }
});
for (const [id, q] of Object.entries(Y.QS)) checkQ('問題 ' + id, q);
for (const [id, b] of Object.entries(Y.BOSSES)) {
  if (b.kind === 'build') checkBuild('ボス ' + id, b.build);
  (b.qs || []).forEach(q => { if (!Y.QS[q]) err('ボス ' + id + '：問題 ' + q + ' がない'); });
  if (b.finisher && !Y.SPELLS[b.finisher]) err('ボス ' + id + '：とどめの呪文 ' + b.finisher + ' がない');
}
/* Tips の図：分子と、光らせる原子があるか */
for (const [id, t] of Object.entries(Y.TIPS)) (t.fig || []).forEach(f => {
  const m = Y.MOLS[f.m];
  if (!m) { err('Tips ' + id + '：図の分子 ' + f.m + ' がない'); return; }
  (f.hl || []).forEach(a => { if (!m.s.atoms[a]) err('Tips ' + id + '：図の ' + f.m + ' に原子 ' + a + ' がない'); });
});
Y.ROUTE.forEach(id => { if (!Y.BOSSES[id] && !Y.LESSONS.some(l => l.id === id)) err('地図：' + id + ' がない'); });

console.log('\nレッスン ' + Y.LESSONS.length + ' ・ 呪文 ' + Object.keys(Y.SPELLS).length + ' ・ 問題 ' + Object.keys(Y.QS).filter(k => /^q\d+$/.test(k)).length + ' ・ Tips ' + Object.keys(Y.TIPS).length);
console.log(errors ? '❌ エラー ' + errors + ' 件' : '✅ エラーなし', warns ? '・ 注意 ' + warns + ' 件' : '');
process.exit(errors ? 1 : 0);
