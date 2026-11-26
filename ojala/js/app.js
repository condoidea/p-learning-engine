/* =========================================================
 * ¡OJALÁ! — 港町の代書屋（スペイン語の接続法現在・西検4級）
 *
 *  ¡MANDA!（manda/）の仕組みを元にした独立アプリ。
 *   ホーム＝港町の景色。次の「依頼」（レッスン）が町の人の頼みごととして自動で出てくる（目次は 📖 帳面 の中に隠す）。
 *   レッスン＝場面（町の人）・ボード（表・例文・問題）・パロマ（伝書バト）のセリフ・下のボタン。
 *   中心の操作＝🔏 封蝋：que のあとが「本当のこと（直説法）＝🔵 青」か「頭の中のこと（接続法）＝🔴 赤」かを選んで押し、形を選ぶ。
 *     封蝋をまちがえると、届いた先で誤解された返事が来る。
 *   ほかに 🖋 形の工房（人ごとの形の反復）・⚡ラッシュ（60秒）・🔁 読み返し（間隔反復）・🎓 西検チャレンジ・📮 切手（ガチャ）
 *  保存：localStorage 'ojala.v1'（?sandbox なら 'ojala.sandbox'）
 *  教材：ojala/js/data/*.js、単語：shared/es-words.js
 * ========================================================= */
(function () {
  'use strict';
  var D = window.OQ, DICT = window.ES_WORDS, W = D.world;
  var DAY = 864e5;

  /* ---------- 小物 ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return seals(String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; })); }
  /* 本文の 🔴・🔵（{{red}}・{{blue}} とも書ける）は、絵文字ではなく CSS で描く小さな封蝋にする
     （絵文字は明朝のウェブフォントと混ざると機種ごとに見え方が変わり、1文字ずつ出す吹き出しでは割れていた） */
  function seals(h) { return h.replace(/(?:🔴|\{\{red\}\})\s?/g, '<i class="wx red" aria-label="赤"></i>').replace(/(?:🔵|\{\{blue\}\})\s?/g, '<i class="wx blue" aria-label="青"></i>'); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(t) { var d = new Date(t); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { return ymd(Date.now()); }
  function later(fn, ms) { return setTimeout(fn, ms); }
  function norm(w) { return String(w).replace(/[¿?¡!.,—:;]/g, '').toLowerCase(); }
  function plain(es) { return String(es).replace(/[\[\]{}^|]/g, '').replace(/___/g, '…'); }
  function num(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function hash(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; }

  /* ---------- 保存 ---------- */
  var SANDBOX = /[?&]sandbox\b/.test(location.search);
  var KEY = SANDBOX ? 'ojala.sandbox' : 'ojala.v1';
  function fresh() {
    return { v: 1, xp: 0, tickets: 0, streak: { n: 0, last: '' }, lessons: {}, bosses: {}, q: {}, cards: {}, tips: {},
      mis: { d: '', done: {}, bonus: false }, rushBest: 0, pulls: 0, sets: {}, cardp: {}, seen: {}, weak: {}, mockBest: 0, settings: { sound: true, speak: true, auto: true } };
  }
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.v === 1) { var f = fresh(); for (var k in s) f[k] = s[k]; return f; }
    } catch (e) { /* 保存領域が使えない */ }
    return fresh();
  }
  var S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* 保存できない環境 */ } }
  window.SfxOn = function () { return S.settings.sound; };

  /* ---------- 索引 ---------- */
  var LESSON = {}, BOSS = {}, QBY = {}, CARD = {}, TIPS = [];
  D.lessons.forEach(function (L) { LESSON[L.id] = L; L.steps.forEach(function (st) { if (st.t === 'tip') TIPS.push({ tip: st, L: L }); }); });
  D.bosses.forEach(function (b) { BOSS[b.id] = b; });
  D.questions.forEach(function (q) { QBY[q.id] = q; });
  D.cards.forEach(function (c) { CARD[c.id] = c; });
  D.lessons.forEach(function (L, i) { L.ord = i + 1; });
  var ORDER = [];
  D.lessons.forEach(function (L) {
    ORDER.push({ type: 'L', id: L.id, day: L.day });
    D.bosses.forEach(function (b) { if (b.after === L.id) ORDER.push({ type: 'B', id: b.id, day: b.day }); });
  });
  function nodeDone(n) { return n.type === 'L' ? !!(S.lessons[n.id] && S.lessons[n.id].done) : !!(S.bosses[n.id] && S.bosses[n.id].win); }
  function nodeOpen(i) { return i === 0 || nodeDone(ORDER[i]) || nodeDone(ORDER[i - 1]); }
  function nextIdx() { for (var i = 0; i < ORDER.length; i++) if (!nodeDone(ORDER[i])) return i; return -1; }
  function lessonDone(no) { return !!(S.lessons['L' + no] && S.lessons['L' + no].done); }
  function unlockedQs() { return D.questions.filter(function (q) { return lessonDone(q.L); }); }
  function dueQs() { var now = Date.now(); return unlockedQs().filter(function (q) { var r = S.q[q.id]; return r && r.due <= now; }); }
  function cardPool() { return D.cards.filter(function (c) { return c.L && lessonDone(c.L); }); }
  function oracleNo(L) { return '第' + L.ord + 'の依頼'; }

  /* 単語帳（バルーン用） */
  var WORD = {};
  DICT.words.forEach(function (e) { [e.w].concat(e.f).forEach(function (f) { WORD[f.toLowerCase()] = e; }); });
  var POS = { n: '名詞', v: '動詞', adj: '形容詞', adv: '副詞', pron: '代名詞', art: '冠詞', prep: '前置詞', det: '', rel: '関係詞', int: '疑問詞', num: '数', phr: '表現', bad: '' };
  var LVN = { 5: '5級', 4: '4級', 3: '4級＋α', 0: '' };

  /* ---------- ランク（レベル）・連続日数・ミッション ---------- */
  function need(lv) { return 100 + (lv - 1) * 40; }
  function levelOf(xp) { var lv = 1; while (xp >= need(lv)) { xp -= need(lv); lv++; } return { lv: lv, cur: xp, need: need(lv) }; }
  var TITLES = [[1, '見習い'], [3, '代書人'], [5, '町の代書人'], [8, '港いちばんの代書人'], [12, '手紙の名人'], [16, '言葉の職人'], [20, '伝説の代書人']];
  function titleOf(lv) { var t = TITLES[0][1]; TITLES.forEach(function (x) { if (lv >= x[0]) t = x[1]; }); return t; }
  function addXp(n) { var b = levelOf(S.xp).lv; S.xp += n; var a = levelOf(S.xp).lv; return a > b ? a : 0; }
  function touchDay() {
    var t = today();
    if (S.streak.last === t) return false;
    S.streak.n = S.streak.last === ymd(Date.now() - DAY) ? S.streak.n + 1 : 1;
    S.streak.last = t;
    return true;
  }
  var MIS = [{ id: 'stage', icon: '✉️', ti: '依頼かボスを1つクリア' }, { id: 'review', icon: '🔁', ti: '読み返しを1回やりきる' }, { id: 'rush', icon: '⚡', ti: 'ラッシュを1回' }];
  function mis() { if (S.mis.d !== today()) S.mis = { d: today(), done: {}, bonus: false }; return S.mis; }
  function missionDone(id) {
    var m = mis(), got = [];
    if (m.done[id]) return got;
    m.done[id] = 1; S.tickets += 1;
    got.push({ icon: '🎟', t: 'ミッション達成 +1' });
    if (MIS.every(function (x) { return m.done[x.id]; }) && !m.bonus) { m.bonus = true; S.tickets += 2; got.push({ icon: '🎉', t: 'ミッション コンプリート +2' }); }
    return got;
  }

  /* 届いた手紙の数（町のにぎわい） */
  function population() {
    var p = 1;
    ORDER.forEach(function (n) { if (nodeDone(n)) p += W.pop[n.id] || 0; });
    p += Object.keys(S.cards).length * 7 + Math.floor(S.xp / 25);
    return p;
  }

  /* ---------- 読み上げ（スペイン語の声がある端末だけ） ---------- */
  var Speech = (function () {
    var syn = window.speechSynthesis, voice = null;
    function find() {
      if (!syn) return null;
      var vs = syn.getVoices() || [];
      voice = vs.filter(function (v) { return /^es[-_]ES/i.test(v.lang); })[0] || vs.filter(function (v) { return /^es/i.test(v.lang); })[0] || null;
      return voice;
    }
    if (syn) { find(); if ('onvoiceschanged' in syn) syn.onvoiceschanged = function () { find(); $$('.say').forEach(function (b) { b.hidden = !voice; }); }; }
    return {
      ok: function () { return !!(syn && (voice || find())); },
      say: function (text, slow) {
        if (!syn || !(voice || find())) return;
        try { syn.cancel(); var u = new SpeechSynthesisUtterance(plain(text)); u.voice = voice; u.lang = voice.lang; u.rate = slow ? 0.7 : 0.92; syn.speak(u); } catch (e) { /* 読み上げできない */ }
      },
      stop: function () { try { if (syn) syn.cancel(); } catch (e) { /* なし */ } }
    };
  })();
  function sayBtn(es) { return '<button class="say" data-say="' + esc(plain(es)) + '" aria-label="読み上げ"' + (Speech.ok() ? '' : ' hidden') + '>🔊</button>'; }
  function autoSay(es) { if (S.settings.speak) Speech.say(es); }

  /* 封をして手紙が届いたときの音（低い鐘＋光の音） */
  function sfxDivine() {
    if (!window.Sfx || !Sfx.raw) return;
    var R = Sfx.raw;
    R.play(function (t) {
      R.noise(t, 0.08, 0.1, 900, 400);   // 封蝋を押す、こもった音
      R.tone(R.hz(-12), t + 0.02, 1.6, 'sine', 0.08);   // 遠くの鐘
      [0, 7, 12, 16].forEach(function (s, k) { R.tone(R.hz(s), t + 0.12 + k * 0.09, 1.2, 'sine', 0.05); R.tone(R.hz(s + 24), t + 0.12 + k * 0.09, 0.4, 'sine', 0.012); });
    });
    R.buzz([15, 30, 40]);
  }

  /* ---------- 文の表示（色分け・バルーン） ---------- */
  function roles(h) {
    return h.replace(/\{([^}]+)\}/g, '<span class="r-cmd">$1</span>')
      .replace(/\[([^\]]+)\]/g, '<span class="r-who">$1</span>')
      .replace(/\^([^^]+)\^/g, '<span class="r-chg">$1</span>')
      .replace(/___/g, '<span class="blank">？</span>');
  }
  function esHtml(s) { return roles(esc(s)); }
  function ja(s) {
    var h = esc(s);
    h = h.replace(/`([^`]+)`/g, function (m, x) { return '<span class="es">' + roles(x) + '</span>'; });
    h = h.replace(/\*\*([^*]+)\*\*/g, '<mark>$1</mark>');
    h = h.replace(/__([^_]+)__/g, '<span class="hint">$1</span>');
    h = h.replace(/\(\(([^)]+)\)\)/g, '<span class="conv">$1</span>');
    return h.replace(/\n/g, '<br>');
  }
  var WRE = /([A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)/;
  function glossEs(root) {
    $$('.es-line, .es, .es-cell', root).forEach(function (box) {
      walk(box, function (node) {
        if (node.parentNode.closest('.tok, .gw, .fl')) return;
        var parts = node.nodeValue.split(WRE);
        if (parts.length < 2) return;
        var frag = document.createDocumentFragment(), hit = false;
        parts.forEach(function (p, i) {
          var e = i % 2 ? WORD[p.toLowerCase()] : null;
          if (e && (e.lv === 4 || e.lv === 3)) { var s = el('span', 'gw', esc(p)); s.setAttribute('data-w', p.toLowerCase()); s.setAttribute('role', 'button'); frag.appendChild(s); hit = true; }
          else frag.appendChild(document.createTextNode(p));
        });
        if (hit) node.parentNode.replaceChild(frag, node);
      });
    });
  }
  var GRE = new RegExp('(' + Object.keys(D.gloss).sort(function (a, b) { return b.length - a.length; }).join('|') + ')');
  function glossJa(root) {
    var used = {};
    walk(root, function (node) {
      if (node.parentNode.closest('.es, .es-line, .es-cell, .gj, .cmap, button')) return;
      var parts = node.nodeValue.split(GRE);
      if (parts.length < 2) return;
      var frag = document.createDocumentFragment(), hit = false;
      parts.forEach(function (p, i) {
        if (i % 2 && !used[p]) { used[p] = 1; var s = el('span', 'gj', esc(p)); s.setAttribute('data-t', p); s.setAttribute('role', 'button'); frag.appendChild(s); hit = true; }
        else frag.appendChild(document.createTextNode(p));
      });
      if (hit) node.parentNode.replaceChild(frag, node);
    });
  }
  function glossAll(root) { glossEs(root); glossJa(root); }
  function walk(root, fn) {
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), list = [], n;
    while ((n = tw.nextNode())) list.push(n);
    list.forEach(fn);
  }
  function toks(s) {
    return esc(s).split(' ').map(function (w) {
      var m = /^([¿¡—]*)(.*?)([.,?!:;]*)$/.exec(w), core = m[2];
      return m[1] + '<span class="tok" role="button" tabindex="0" data-n="' + esc(norm(core)) + '">' + core + '</span>' + m[3];
    }).join(' ');
  }
  /* 接続法などの印の語（{…}）だけを取り出す：叩きつけ文字に使う */
  function cmdWords(s) { var out = []; String(s).replace(/\{([^}]+)\}/g, function (m, x) { out.push(x); return m; }); return out; }

  /* バルーン（タップで出す） */
  var pop = $('#pop');
  function showPop(target, html) {
    pop.innerHTML = html; pop.hidden = false;
    var r = target.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
    var x = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2));
    var y = r.top - h - 10; if (y < 8) y = r.bottom + 10;
    pop.style.left = x + 'px'; pop.style.top = y + 'px';
    FX.pop(pop, 1.08);
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.gw, .gj, [data-say]');
    if (!t) { if (!e.target.closest('#pop')) pop.hidden = true; return; }
    e.stopPropagation(); e.preventDefault();
    if (t.hasAttribute('data-say')) { Speech.say(t.getAttribute('data-say'), t.classList.contains('slow')); FX.pop(t); return; }
    if (t.classList.contains('gw')) {
      var w = WORD[t.getAttribute('data-w')];
      showPop(t, '<b class="pw">' + esc(t.textContent) + (w.w.toLowerCase() !== t.textContent.toLowerCase() ? '<small>← ' + esc(w.w) + '</small>' : '') + '</b><span>' + esc(w.ja) + '</span><i>' + [POS[w.pos], LVN[w.lv]].filter(Boolean).join('・') + '</i>');
    } else {
      showPop(t, '<b class="pw">' + esc(t.getAttribute('data-t')) + '</b><span>' + esc(D.gloss[t.getAttribute('data-t')]) + '</span>');
    }
  }, true);

  var toastT = 0;
  function toast(msg) { var t = $('#toast'); t.innerHTML = msg; t.className = 'on'; clearTimeout(toastT); toastT = later(function () { t.className = ''; }, 2600); }

  /* ---------- 画面の切りかえ ---------- */
  function show(id) {
    $$('.screen').forEach(function (s) { s.hidden = s.id !== id; });
    document.body.setAttribute('data-screen', id);
    window.scrollTo(0, 0);
    if (id !== 'quiz' && id !== 'play') { feverOff(); FX.combo(0); }
    $('#modal').hidden = true; Speech.stop();   // 前の画面で開いたもの（レベルアップなど）を、次の画面に持ちこまない
    stopAuto();
  }

  /* ---------- 下のボタン置き場 ---------- */
  function Tray(t) {
    function btn(label, cls, fn) {
      var b = el('button', 'tb ' + (cls || ''), label);
      b.addEventListener('click', function () {
        /* 同じボタンのすばやい2度押しで2回進まないように（ダブルタップ） */
        var now = Date.now(); if (b.disabled || now - (b._t || 0) < 350) return; b._t = now;
        if (window.Sfx) Sfx.tap(); fn(b);
      });
      return b;
    }
    return {
      el: t,
      clear: function () { t.innerHTML = ''; },
      hint: function (html) { t.innerHTML = '<p class="thint">' + html + '</p>'; },
      next: function (fn, label, cls) { t.innerHTML = ''; var b = btn(label || '▶ つぎへ', 'go ' + (cls || ''), function () { b.disabled = true; fn(); }); t.appendChild(b); if (!FX.RM && b.animate) b.animate([{ transform: 'translateY(24px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 240, easing: 'cubic-bezier(.2,1.5,.4,1)' }); },
      btns: function (list) { t.innerHTML = ''; var w = el('div', 'tbs'); list.forEach(function (x) { w.appendChild(btn(x.t, x.cls, x.fn)); }); t.appendChild(w); },
      options: function (list, cb, cls) {
        t.innerHTML = '';
        /* 短い選択肢（単語だけ）は2〜3列にして、高さを取らない */
        var short = list.every(function (x) { return String(x.label).length <= 9; });
        var w = el('div', 'opts ' + (cls || '') + (short ? ' cols' + (list.length === 4 ? 2 : Math.min(list.length, 3)) : ''));
        list.forEach(function (x, k) {
          var b = btn(esc(x.label), 'opt', function () { $$('.opt', w).forEach(function (o) { o.disabled = true; }); b.classList.add('chosen'); cb(x.i, b, w); });
          b.style.animationDelay = (k * 50) + 'ms';
          b.setAttribute('data-i', x.i);
          w.appendChild(b);
        });
        t.appendChild(w);
      }
    };
  }
  var T1 = Tray($('#tray')), T2 = Tray($('#zTray'));
  function markOpts(wrap, correct, chosen) {
    $$('.opt', wrap).forEach(function (b) { var i = +b.getAttribute('data-i'); if (i === correct) b.classList.add('ok'); else if (i === chosen) b.classList.add('ng'); });
  }

  /* ---------- 正解・まちがいの演出（コンボ・筆が乗る＝FEVER） ---------- */
  var PRAISE = ['Bien', 'Muy bien', 'Precioso', 'Así es', 'Bonito', 'Perfecto'];
  function newRun() { return { combo: 0, best: 0, xp: 0, ok: 0, ng: 0, fever: false, misses: [] }; }
  function feverOn() { document.body.classList.add('fever'); }
  function feverOff() { document.body.classList.remove('fever'); }
  function hit(run, src, base) {
    run.combo++; run.ok++; run.best = Math.max(run.best, run.combo);
    var fever = run.combo >= 5;
    if (run.combo === 5) { run.fever = true; feverOn(); FX.slam('Inspirada', 'rainbow', '筆が乗る　XP ×2'); Sfx.combo(10); FX.confetti(70, 'divine'); }
    else if (run.combo === 3) FX.slam(pick(['Bien', 'Así es', 'Bonito']), 'cyan');
    else if (run.combo === 10) { FX.slam('Maestra', 'gold', '10 通つづけて'); Sfx.combo(10); FX.confetti(90); }
    else if (run.combo > 10 && run.combo % 5 === 0) { FX.slam(run.combo + ' seguidas', 'gold'); Sfx.combo(10); }
    var xp = ((base || 10) + Math.min(run.combo, 10)) * (fever ? 2 : 1);
    run.xp += xp;
    Sfx.correct(run.combo);
    var p = FX.at(src);
    FX.burst(p.x, p.y, { pal: fever ? 'rainbow' : 'divine', n: fever ? 40 : 26, ring: true });
    FX.floatText(p.x, p.y - 8, '+' + xp + ' XP', fever ? '#ffd23f' : '#7dffb0');
    if (run.combo >= 2 && Math.random() < 0.5) later(function () { FX.floatText(p.x + (Math.random() * 120 - 60), p.y - 40, pick(PRAISE), '#ffe68a'); }, 180);
    FX.combo(run.combo, fever);
    return xp;
  }
  function miss(run, src) {
    run.combo = 0; run.ng++; run.fever = false;
    feverOff(); FX.combo(0); Sfx.wrong(); FX.shake(src); FX.flash('#ff2d55');
  }
  function bonus(run, n, src, label) { run.xp += n; var p = FX.at(src); FX.floatText(p.x, p.y, '+' + n + ' XP' + (label ? ' ' + label : ''), '#9be7ff'); }

  /* ---------- 間隔反復 ---------- */
  var IV = [0, 1, 2, 4, 7, 15, 30];
  function srs(q, ok) {
    var r = S.q[q.id] || (S.q[q.id] = { lv: 0, due: 0, ok: 0, ng: 0 });
    if (ok) { r.ok++; r.lv = Math.min(r.lv + 1, IV.length - 1); r.due = Date.now() + IV[r.lv] * DAY - 2 * 3600e3; }
    else { r.ng++; r.lv = 0; r.due = Date.now() + 10 * 60e3; }
  }
  function weighted(list) {
    var now = Date.now();
    return shuffle(list).sort(function (a, b) {
      function w(q) { var r = S.q[q.id]; if (!r) return 2; if (r.due <= now) return 0; if (r.ng > r.ok) return 1; return 3 + r.lv; }
      return w(a) - w(b);
    });
  }

  /* =========================================================
   * 問題の表示（レッスンの中・ボス・ラッシュ・復習で共通）
   *  cb(ok, ms)
   * ========================================================= */
  var KIND = { pick: ['🎯', '空いている所に入るのは？'], form: ['🖋', '接続法の形にしよう'], mood: ['🔏', 'どちらの封蝋？'], ng: ['🚫', '入らないのは？'],
    ja: ['💬', '意味は？'], bug: ['🐛', 'まちがい探し'], build: ['🧩', 'ならべて文を作ろう'], listen: ['🎧', '聞こえた文はどれ？'] };
  /* 封蝋の2色：青＝本当のこと（直説法）・赤＝頭の中のこと（接続法） */
  var MOOD = ['青：本当のこと（いつもの形）', '赤：頭の中のこと（接続法）'];   // 選択肢の左に小さな封蝋（CSS の .seals）
  var PTAG = { yo: 'yo（私）', 'tú': 'tú（君）', 'él': 'él・ella・usted', nosotros: 'nosotros（私たち）', vosotros: 'vosotros（君たち）', ellos: 'ellos・ustedes' };
  function fullOf(q) {
    if (q.k === 'pick') return q.s.replace('___', '{' + q.o[q.a] + '}');
    if (q.k === 'ng') return q.s.replace('___', '{' + q.o[q.fit] + '}');
    if (q.k === 'mood') return q.full;
    if (q.k === 'bug') return q.ok;
    if (q.k === 'form') return q.o[q.a];
    return q.s;
  }
  /* 2つの文を語ごとにくらべ、共通でない語に印をつける（最長共通部分列） */
  function wordDiff(a, b) {
    var x = a.split(' '), y = b.split(' '), n = x.length, m = y.length, L = [], i, j;
    for (i = 0; i <= n; i++) { L.push([]); for (j = 0; j <= m; j++) L[i][j] = 0; }
    for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--) L[i][j] = norm(x[i]) === norm(y[j]) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    var kx = {}, ky = {};
    for (i = 0, j = 0; i < n && j < m;) {
      if (norm(x[i]) === norm(y[j])) { kx[i] = ky[j] = 1; i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++;
    }
    return {
      a: x.map(function (w, k) { return kx[k] ? esc(w) : '<b class="wrong">' + esc(w) + '</b>'; }).join(' '),
      b: y.map(function (w, k) { return ky[k] ? esc(w) : '<b class="fix">' + esc(w) + '</b>'; }).join(' ')
    };
  }
  function cmpRows(you, right, es, say) {
    return '<div class="cmp"><div class="cmp-row ng"><i>✕ あなた</i><span' + (es ? ' class="es"' : '') + '>' + you + '</span></div>' +
      '<div class="cmp-row ok' + (say ? ' has-say' : '') + '"><i>○ 正解</i><span' + (es ? ' class="es"' : '') + '>' + right + '</span>' + (say ? sayBtn(say) : '') + '</div></div>';
  }
  /* まちがえたとき：自分の答えと正解をならべる（ちがう所に色） */
  function cmpHtml(q, chosen, withSay) {
    var you, right, mark = function (w) { return '<b class="wrong">' + esc(w) + '</b>'; };
    chosen = chosen == null ? '' : String(chosen);
    if (q.k === 'pick') { you = esHtml(q.s.replace('___', '\u0001')).replace('\u0001', mark(chosen)); right = esHtml(fullOf(q)); }
    else if (q.k === 'build' || q.k === 'listen' || q.k === 'form') { var df = wordDiff(chosen, fullOf(q)); you = df.a; right = df.b; }
    else if (q.k === 'bug') { you = '「' + esc(chosen) + '」をまちがいにした'; right = 'まちがいは ' + mark(q.a) + ' → ' + esHtml(q.ok); }
    else if (q.k === 'mood') { you = esc(chosen); right = '<b class="fix">' + esc(MOOD[q.a]) + '</b>'; }
    else if (q.k === 'ng') { you = '「' + esc(chosen) + '」は入らない'; right = '入らないのは <b class="fix">' + esc(q.o[q.a]) + '</b>'; }
    else { you = esc(chosen); right = '<b class="fix">' + esc(q.o[q.a]) + '</b>'; }
    var es = q.k !== 'mood' && q.k !== 'ja' && q.k !== 'ng';
    return cmpRows(you, right, es, withSay && es ? fullOf(q) : '');
  }
  function renderQ(q, card, T, opts, cb) {
    opts = opts || {};
    var t0 = Date.now(), done = false;
    card.className = 'card qcard k-' + q.k + (opts.fast ? ' fast' : '');
    card.setAttribute('data-q', q.id);
    var body = '';
    if (q.k === 'pick' || q.k === 'ja' || q.k === 'ng') body = '<div class="es-line">' + esHtml(q.s) + '</div>';
    else if (q.k === 'mood') body = '<div class="es-line">' + esHtml(q.s) + '</div><small class="vhint">' + esc(q.v) + '</small>';
    else if (q.k === 'bug') body = '<div class="es-line toks">' + toks(q.s) + '</div>';
    else if (q.k === 'build') body = '<div class="build-line"></div>';
    else if (q.k === 'form') body = '<div class="form-q"><b class="es-line">' + esc(q.v) + '</b><span>→ ' + esc(PTAG[q.p] || q.p) + ' の接続法</span></div>';
    else if (q.k === 'listen') body = Speech.ok() ? '<div class="listen"><button class="say big" data-say="' + esc(q.s) + '" aria-label="もう一度聞く">🔊</button><button class="say slow" data-say="' + esc(q.s) + '" aria-label="ゆっくり聞く">🐢</button><small>何度でも聞けるよ</small></div>'
      : '<p class="why">（この端末ではスペイン語の音声が使えないので、日本語の意味から選ぼう）</p><div class="es-line">' + esc(q.ja) + '</div>';
    var showJa = q.ja && (q.k === 'pick' || q.k === 'bug' || q.k === 'build' || q.k === 'mood' || q.k === 'ng');
    card.innerHTML = '<div class="qtag"><span>' + KIND[q.k][0] + '</span> ' + KIND[q.k][1] + (opts.tag ? '<em>' + esc(opts.tag) + '</em>' : '') + '</div>' + body +
      (showJa ? '<div class="ja-line">' + esc(q.ja) + '</div>' : '') + '<div class="qres"></div>';
    glossAll(card);
    if (q.k === 'listen' && Speech.ok()) later(function () { if (!done) Speech.say(q.s); }, 350);

    function finish(ok, chosen) {
      if (done) return; done = true;
      var ms = Date.now() - t0;
      card.classList.add(ok ? 'is-ok' : 'is-ng');
      if (!ok && opts.run) opts.run.misses.push({ q: q, c: chosen });
      if (!opts.fast) result(ok, chosen);
      cb(ok, ms);
    }
    function result(ok, chosen) {
      var r = $('.qres', card), s = fullOf(q);
      var alt = card.hasAttribute('data-alt');
      /* まちがえたら「あなた／正解」の2行に正解の文が入る（意味・相手の問題は、文をもう一度見せる） */
      var showS = ok ? alt || !(q.k === 'ja' || q.k === 'build') : q.k === 'ja' || q.k === 'mood' || q.k === 'ng';
      r.innerHTML = (ok ? '<b class="rk ok">⭕ ' + pick(PRAISE) + '</b>' : '<b class="rk ng">❌ おしい！ くらべてみよう</b>' + cmpHtml(q, chosen, true)) +
        (alt ? '<p class="why">その語順でも正解！ 呼びかけの名前は、文の前でも後ろでも OK（コンマで区切る）。こんな言い方もあるよ：</p>' : '') +
        (showS ? '<div class="es-line ans">' + esHtml(s) + sayBtn(s) + '</div>' : '') +
        (q.k === 'ja' && ok ? '<div class="ja-line">' + esc(q.o[q.a]) + '</div>' : (q.k === 'listen' || q.k === 'build' && !ok) && q.ja ? '<div class="ja-line">' + esc(q.ja) + '</div>' : '') +
        (q.why ? '<p class="why">' + ja(q.why) + '</p>' : '');
      glossAll(r);
      autoSay(s);
    }

    if (q.k === 'pick' || q.k === 'ja' || q.k === 'form' || q.k === 'mood' || q.k === 'ng' || q.k === 'listen') {
      var labels = q.k === 'mood' ? MOOD : q.o;
      var list = labels.map(function (l, i) { return { label: l, i: i }; });
      if (q.k !== 'mood') list = shuffle(list);
      T.options(list, function (i, b, wrap) {
        var ok = i === q.a;
        if (q.k === 'pick') { var bl = $('.blank', card); if (bl) { bl.textContent = q.o[i]; bl.className = 'blank filled ' + (ok ? 'ok' : 'ng'); } }
        markOpts(wrap, q.a, i);
        finish(ok, labels[i]);
      }, q.k === 'mood' ? 'long seals' : q.k === 'ja' || q.k === 'listen' ? 'long' : '');
      return;
    }
    if (q.k === 'bug') {
      T.hint('👆 まちがっている語を1つタップ');
      $$('.tok', card).forEach(function (t) {
        t.addEventListener('click', function () {
          if (done) return;
          var ok = t.getAttribute('data-n') === norm(q.a);
          t.classList.add(ok ? 'ok' : 'ng');
          if (!ok) $$('.tok', card).forEach(function (u) { if (u.getAttribute('data-n') === norm(q.a)) u.classList.add('right'); });
          T.clear();
          finish(ok, t.textContent);
        });
      });
      return;
    }
    if (q.k === 'build') buildQ(q, card, T, finish, function () { return done; });
  }

  /* タイル並べ（タップで追加・ドラッグで好きな位置へ） */
  /* タイルは記号なし・小文字（名前は大文字のまま）。コンマや大文字で並び順が分からないように。
   * 呼びかけの名前・por favor は、前でも後ろでも正解（Lola, abre la puerta. ／ Abre la puerta, Lola.） */
  var NAMES = {}; (DICT.names || []).forEach(function (n) { NAMES[n.toLowerCase()] = n; });
  function tileWord(w) { var c = w.replace(/[¿?¡!.,;:]/g, ''), lc = c.toLowerCase(); return NAMES[lc] || lc; }
  function buildAnswers(s) {
    var segs = s.replace(/[.?!]+$/, '').split(/,\s*/).map(function (x) { return x.split(' ').map(tileWord).filter(Boolean); });
    var movable = function (g) { var t = g.join(' '); return (g.length === 1 && (NAMES[t.toLowerCase()] || /^(amigos|chicos|señores|señor|señora)$/.test(t))) || t === 'por favor'; };
    var core = segs.filter(function (g) { return !movable(g); }), mov = segs.filter(movable), out = {};
    /* 動かせる部分を、それぞれ前か後ろに置く（2^n 通り） */
    for (var m = 0; m < (1 << mov.length); m++) {
      var front = [], back = [];
      mov.forEach(function (g, k) { (m & (1 << k) ? front : back).push(g); });
      out[[].concat.apply([], front.concat(core, back)).join(' ')] = 1;
    }
    out[[].concat.apply([], segs).join(' ')] = 1;
    return out;
  }
  function buildQ(q, card, T, finish, isDone) {
    var words = q.s.split(' ').map(tileWord), end = (/[.?!]+$/.exec(q.s) || [''])[0];
    var answers = buildAnswers(q.s), canon = words.join(' ');
    var line = $('.build-line', card), placed = [];
    var tiles = shuffle(words.concat((q.d || []).map(tileWord)));
    T.clear();
    var pool = el('div', 'tiles'), dragEnd = 0, caret = null;
    function insertAt(item, at) {
      if (at == null || at >= placed.length) { placed.push(item); line.appendChild(item.el); }
      else { line.insertBefore(item.el, placed[at].el); placed.splice(at, 0, item); }
    }
    function place(btn, w, at) {
      btn.classList.add('used');
      var p = el('span', 'tile on', esc(w)); p.setAttribute('role', 'button');
      var item = { w: w, el: p, src: btn };
      p.addEventListener('click', function () { if (isDone() || Date.now() - dragEnd < 400) return; Sfx.tap(); unplace(item); });
      drag(p, item, btn, w);
      insertAt(item, at); FX.pop(p, 1.2); paint();
      if (placed.length === words.length) check();
    }
    function unplace(item) { placed.splice(placed.indexOf(item), 1); item.el.remove(); item.src.classList.remove('used'); paint(); }
    function dropIndex(ev, skip) {
      var list = placed.filter(function (x) { return x !== skip; });
      for (var i = 0; i < list.length; i++) {
        var r = list[i].el.getBoundingClientRect();
        if (ev.clientY < r.top) return i;
        if (ev.clientY <= r.bottom && ev.clientX < r.left + r.width / 2) return i;
      }
      return list.length;
    }
    function overLine(ev) { var r = line.getBoundingClientRect(); return ev.clientX >= r.left - 12 && ev.clientX <= r.right + 12 && ev.clientY >= r.top - 30 && ev.clientY <= r.bottom + 30; }
    function showCaret(ev, skip) {
      if (!overLine(ev)) { if (caret) caret.hidden = true; return; }
      if (!caret) { caret = el('div', 'drop-caret'); document.body.appendChild(caret); }
      var list = placed.filter(function (x) { return x !== skip; }), at = dropIndex(ev, skip), r, x;
      if (list.length && at < list.length) { r = list[at].el.getBoundingClientRect(); x = r.left - 4; }
      else if (list.length) { r = list[list.length - 1].el.getBoundingClientRect(); x = r.right + 2; }
      else { r = line.getBoundingClientRect(); x = r.left + 8; r = { top: r.top + 10, height: r.height - 20 }; }
      caret.hidden = false; caret.style.left = x + 'px'; caret.style.top = r.top + 'px'; caret.style.height = r.height + 'px';
    }
    function drag(src, item, btn, w) {
      src.addEventListener('pointerdown', function (e) {
        if (isDone() || (!item && btn.classList.contains('used'))) return;
        var x0 = e.clientX, y0 = e.clientY, ghost = null;
        function move(ev) {
          if (!ghost) {
            if (Math.abs(ev.clientX - x0) + Math.abs(ev.clientY - y0) < 8) return;
            ghost = el('div', 'tile ghost', esc(w)); document.body.appendChild(ghost);
            src.classList.add('dragging');
          }
          ev.preventDefault();
          ghost.style.left = ev.clientX + 'px'; ghost.style.top = ev.clientY + 'px';
          showCaret(ev, item);
        }
        function up(ev) {
          document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', up);
          if (!ghost) return;
          ghost.remove(); src.classList.remove('dragging'); if (caret) caret.hidden = true;
          dragEnd = Date.now();
          if (isDone() || ev.type === 'pointercancel') return;
          Sfx.tap();
          if (item) {
            if (overLine(ev)) { var at = dropIndex(ev, item); placed.splice(placed.indexOf(item), 1); insertAt(item, at); FX.pop(item.el, 1.15); paint(); }
            else unplace(item);
          } else if (overLine(ev)) place(btn, w, dropIndex(ev, null));
        }
        document.addEventListener('pointermove', move, { passive: false });
        document.addEventListener('pointerup', up); document.addEventListener('pointercancel', up);
      });
    }
    tiles.forEach(function (w) {
      var b = el('button', 'tile', esc(w));
      b.addEventListener('click', function () {
        if (isDone() || b.classList.contains('used') || Date.now() - dragEnd < 400) return;
        Sfx.tap(); place(b, w);
      });
      drag(b, null, b, w);
      pool.appendChild(b);
    });
    T.el.appendChild(el('p', 'tile-hint', 'タップで追加・ドラッグで好きな位置へ'));
    T.el.appendChild(pool);
    function paint() { line.setAttribute('data-end', end); line.classList.toggle('empty', !placed.length); }
    function check() {
      var mine = placed.map(function (x) { return x.w; }).join(' '), ok = !!answers[mine];
      if (ok && mine !== canon) card.setAttribute('data-alt', '1');
      line.classList.add(ok ? 'ok' : 'ng');
      $$('.tile', pool).forEach(function (t) { t.disabled = true; });
      if (caret) caret.remove();
      finish(ok, mine + end);
    }
    paint();
  }

  /* =========================================================
   * 港町の景色（ホームの大きな景色・レッスンの場面）
   * ========================================================= */
  /* 空の色：進み具合で夜明け → 昼 → 夕方 → 嵐の前 → 晴れた港 */
  /* 時刻の光：依頼ごとに空の色を決める（body[data-hour]。色は ojala.css の [data-hour]）。
   *  物語が進むほど --warm が上がり、全体が少しずつ暖かくなる */
  var HOUR = { L1: 'evening', L2: 'dawn', B1: 'fog', L3: 'noon', L4: 'morning', B2: 'office', L5: 'evening', L6: 'rain', L7: 'night', B3: 'storm' };
  function setHour(id) {
    var ni = nextIdx();
    var h = id ? HOUR[id] : ni < 0 ? 'clear' : HOUR[ORDER[ni].id];
    document.body.setAttribute('data-hour', h || 'morning');
    var done = ORDER.filter(nodeDone).length;
    document.body.style.setProperty('--warm', (done / Math.max(1, ORDER.length)).toFixed(2));
  }
  function skyOf() {
    var ni = nextIdx(), k = ni < 0 ? ORDER.length : ni;
    if (ni < 0) return 'sky-gold';
    if (k === 0) return 'sky-night';
    var n = ORDER[k];
    if (n.id === 'B3') return 'sky-dark';
    if (k <= 2) return 'sky-dawn';
    if (k <= 5) return 'sky-day';
    return 'sky-dusk';
  }
  function sprite(it, cls) {
    return '<i class="sp' + (it.sky ? ' sky' : '') + (cls ? ' ' + cls : '') + '" style="left:' + it.x + '%;top:' + it.y + '%;--s:' + (it.s || 1) + ';z-index:' + Math.round(it.y) + '">' + it.e + '</i>';
  }
  function islandHtml(newId) {
    /* 港町：遠くの屋根と鐘楼（空の色にとける）→ 石だたみの岸壁 → 海。色は ojala.css の --far・--quay1/2・--sea1/2 */
    var h = '<div class="sea"><i></i><i></i></div><svg class="land" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">' +
      '<path style="fill:var(--far)" d="M0 16 V9 H5 V6 L8 3 L11 6 V9 H15 V5 H21 V9 H25 L28 6 L31 9 H35 V7 H39 V2 L41 -2 L43 2 V7 H47 V9 H53 V5 L57 2 L61 5 V9 H66 V6 H72 V9 H76 L80 5 L84 9 H88 V4 H94 V9 H100 V16 Z"/>' +
      '<path style="fill:var(--far);opacity:.55" d="M0 16 V12 H100 V16 Z"/>' +
      '<rect x="0" y="15" width="100" height="25" style="fill:url(#qg)"/>' +
      '<path d="M0 15.4 H100" style="stroke:var(--glow);stroke-width:.5;opacity:.8"/>' +
      '<path d="M0 39.4 H100" style="stroke:rgba(0,0,0,.18);stroke-width:1"/>' +
      '<defs><linearGradient id="qg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--quay1)"/><stop offset="1" style="stop-color:var(--quay2)"/></linearGradient></defs></svg>';
    ORDER.forEach(function (n) {
      if (!nodeDone(n) && n.id !== newId) return;
      (W.grow[n.id] || []).forEach(function (it, k) { h += sprite(it, n.id === newId ? 'new n' + k : ''); });
    });
    /* 町の人たち（依頼を受けたことのある人） */
    var met = { luz: S.lessons.L1, nico: S.lessons.L2, anselmo: S.lessons.L3, ines: S.lessons.L4, teo: S.lessons.L7 };
    var spots = { luz: [38, 80], nico: [48, 84], anselmo: [26, 80], ines: [64, 78], teo: [74, 84] };
    /* 人物は絵文字で描かない（ユーザーの指摘：絵文字には情緒がない）。町の絵には人を出さない */
    /* 手に入れた切手（位置は id から決める） */
    D.cards.forEach(function (c) {
      if (!S.cards[c.id]) return;
      var hx = hash(c.id), x = 14 + hx % 72, y = 62 + (hx >> 3) % 24;
      if (c.sky) y = 12 + (hx >> 3) % 30;
      h += '<i class="sp res" style="left:' + x + '%;top:' + y + '%;--s:.72;z-index:' + y + '">' + c.icon + '</i>';
    });
    return h;
  }

  /* =========================================================
   * レッスン（場面 ＋ ボード ＋ セリフ ＋ ボタン）
   * ========================================================= */
  var stageEl = $('#stage'), boardEl = $('#board'), talkEl = $('#talk');
  var cur = null;   // いまのレッスン

  /* ---- 場面（町の人たち） ---- */
  function stageSet(actors) {
    stageEl.className = 'stage ' + skyOf();
    stageEl.innerHTML = '<div class="st-sky" id="stSky"></div><div class="st-ground"></div><div class="actors" id="actors"></div>';
    actors.forEach(function (k) { addActor(k, true); });
  }
  function addActor(k, quiet) {
    var box = $('#actors');
    if (!box || $('.actor[data-who="' + k + '"]', box)) return;
    var p = D.people[k], a = el('button', 'actor', '<span class="an">' + esc(p.n) + '</span><span class="am"></span>');
    a.setAttribute('data-who', k); a.disabled = true;
    box.appendChild(a);
    if (!quiet) { FX.pop(a, 1.4); var pt = FX.at(a); FX.burst(pt.x, pt.y, { pal: 'divine', n: 18 }); Sfx.whoosh(); }
  }
  function actorEl(k) { return $('.actor[data-who="' + k + '"]', stageEl); }
  function actorReact(k, e, mood) {
    var a = actorEl(k); if (!a) return;
    a.classList.remove('jump'); void a.offsetWidth; a.classList.add('jump');
    if (e) {
      var f = el('i', 'act-fx', e); stageEl.appendChild(f);
      var r = a.getBoundingClientRect(), R = stageEl.getBoundingClientRect();
      f.style.left = (r.left - R.left + r.width / 2) + 'px'; f.style.top = (r.top - R.top) + 'px';
      later(function () { f.remove(); }, 1500);
    }
  }
  function worldFx(key) {
    var e = W.fx[key]; if (!e) return;
    var sky = $('#stSky'); if (!sky) return;
    /* 人と重ならないよう、空の左右の端に置く（3つめからは古いものと入れかわる） */
    var i = el('i', 'st-item', e), n = sky.children.length;
    if (n >= 2) sky.firstChild.remove();
    sky.appendChild(i);
    i.style.left = (n % 2 ? 92 : 8) + '%';
    var p = FX.at(i); FX.rays(p.x, p.y, '#ffe68a');
  }

  /* ---- ボード（いまのカード） ---- */
  /* 表（show）は、次の表が出るまで上に残す（「表を見て」の問いで表が消えないように）。ほかのカードは入れかわる */
  function boardSet(card) {
    var isTbl = card.classList.contains('board-tbl');
    $$('.card', boardEl).forEach(function (old) { if (isTbl || !old.classList.contains('board-tbl')) old.remove(); });
    boardEl.appendChild(card);
    if (!FX.RM && card.animate) card.animate([{ transform: 'translateX(26px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 260, easing: 'cubic-bezier(.2,1.2,.4,1)' });
    boardEl.scrollTop = 0;
    if (!isTbl) later(function () {
      var r = card.getBoundingClientRect(), B = boardEl.getBoundingClientRect();
      if (r.bottom > B.bottom) boardEl.scrollTop += Math.min(r.top - B.top - 6, r.bottom - B.bottom + 8);
      /* しぼった地図が上に残っているときは、その先頭が見える位置を超えて下げない（地図が上・問題がその下） */
      var m = $('.cmap-focus', boardEl);
      if (m) { var mt = m.getBoundingClientRect().top - B.top; if (mt < 4) boardEl.scrollTop += mt - 4; }
    }, 30);
    return card;
  }
  function boardScroll() { later(function () { boardEl.scrollTo({ top: boardEl.scrollHeight, behavior: FX.RM ? 'auto' : 'smooth' }); }, 40); }

  /* ---- セリフ（1文字ずつ） ---- */
  var typeT = 0, typeDone = null;
  var ME = { e: '🖋', n: 'わたし（代書人）' };   // 依頼の終わりの独白
  function talk(x, who, mood, then) {
    talkEl.hidden = false;
    clearTimeout(typeT);
    var p = who === 'me' ? ME : who ? D.people[who] : null;
    talkEl.className = 'talk' + (who === 'me' ? ' mono' : p ? ' person' : '');
    talkEl.innerHTML = '<div class="tk-body"><b class="tk-name">' + (p ? esc(p.n) : 'パロマ') + '</b><div class="tk-x">' + ja(x) + '</div></div><button class="tk-log" aria-label="これまでのセリフ">📜</button>';
    if (cur) cur.log.push({ who: who, x: x });
    var box = $('.tk-x', talkEl);
    glossAll(box);
    /* 文字を1つずつ出す（タップで全部） */
    var chars = [];
    walk(box, function (node) {
      var frag = document.createDocumentFragment();
      Array.from(node.nodeValue).forEach(function (ch) { var s = el('span', 'ch', esc(ch)); chars.push(s); frag.appendChild(s); });
      node.parentNode.replaceChild(frag, node);
    });
    var k = 0, step = Math.max(10, Math.min(28, 1500 / Math.max(1, chars.length)));
    function finishType() { clearTimeout(typeT); chars.forEach(function (c) { c.classList.add('on'); }); typeDone = null; if (then) { var f = then; then = null; f(); } }
    typeDone = finishType;
    (function tick() {
      if (k >= chars.length) return finishType();
      chars[k++].classList.add('on');
      typeT = later(tick, step);
    })();
    $('.tk-log', talkEl).addEventListener('click', function (e) { e.stopPropagation(); showLog(); });
  }
  talkEl.addEventListener('click', function (e) { if (e.target.closest('.gw, .gj, .tk-log')) return; if (typeDone) typeDone(); });
  function talkHide() { clearTimeout(typeT); typeDone = null; talkEl.hidden = true; }
  function showLog() {
    if (!cur) return;
    modal('<h3 class="m-h">これまでのことば</h3><div class="log">' + cur.log.map(function (l) {
      var p = l.who === 'me' ? ME : l.who ? D.people[l.who] : null;
      return '<div class="lg"><b>' + (p ? esc(p.n) : 'パロマ') + '</b><p>' + ja(l.x) + '</p></div>';
    }).join('') + '</div>', 'log-m');
    glossAll($('#mbody'));
    var lg = $('#mbody .log'); lg.scrollTop = lg.scrollHeight;
  }

  var REPLY = ['ええ ▶', 'うん ▶', 'それで？ ▶', 'わかった ▶', 'なるほど ▶'];
  var READY = ['書いてみる ▶', 'ペンを取る ▶', 'インクをつける ▶'];
  function replyLabel() {
    var nx = cur && cur.L.steps[cur.i];
    return nx && /^(seal|forge|ask|q|drill)$/.test(nx.t) ? pick(READY) : pick(REPLY);
  }

  function startLesson(L) {
    show('play');
    boardEl.innerHTML = ''; T1.clear(); talkHide();
    $('#pTitle').textContent = L.remedy ? '🩹 おさらい　' + oracleNo(L.base) : oracleNo(L) + '　' + L.ti;
    cur = { L: L, i: 0, run: newRun(), used: {}, log: [], qok: {} };
    L.steps.forEach(function (st) { if (st.t === 'q') cur.used[st.id] = 1; });
    setHour((L.base || L).id);
    stageSet(L.actors || []);
    boardSet(el('div', 'card lesson-title', '<small>' + (L.remedy ? 'Repaso' : 'Carta ' + L.ord) + '</small><b>' + L.icon + ' ' + esc(L.ti) + '</b><span>' + esc(L.sub) + '</span>'));
    FX.slam(L.remedy ? 'Repaso' : 'Carta ' + L.ord, 'gold', L.remedy ? 'おさらい：' + L.base.ti : L.ti);
    sfxDivine();
    later(step, 900);
  }
  function setProg() { if (!cur) return; $('#pProg').style.width = Math.round(cur.i / cur.L.steps.length * 100) + '%'; $('#pXp').textContent = cur.run.xp; }
  function step() {
    if (!cur) return;
    T1.clear();
    setProg();
    if (cur.i >= cur.L.steps.length) return finishLesson();
    var st = cur.L.steps[cur.i++], run = cur.run;
    ({ say: doSay, show: doShow, enter: doEnter, ask: doAsk, forge: doForge, seal: doSeal, tip: doTip, map: doMap, q: doQ, drill: doDrill, letter: doLetter, mono: doMono, scene: doScene })[st.t](st, run);
  }
  function nextBtn(label) { if (!cur) return; setProg(); T1.next(step, label || replyLabel()); }

  function doSay(st) {
    if (st.who) { addActor(st.who); actorReact(st.who); }
    var me = cur;
    talk(st.x, st.who, st.who ? '' : pick(['', '', 'happy']), function () {
      if (cur !== me) return;
      if (!st.more) return nextBtn();
      T1.btns([
        { t: 'わかった ▶', cls: 'go', fn: function () { step(); } },
        { t: 'なんで？', cls: 'sub', fn: function () { talk(st.more, null, 'happy', function () { nextBtn(); }); } }
      ]);
    });
  }
  function doShow(st) {
    var c = el('div', 'card board-tbl', (st.cap ? '<div class="qtag">' + esc(st.cap) + '</div>' : '') +
      (st.tbl ? '<table class="tbl">' + st.tbl.map(function (r) { return '<tr><th class="es-cell">' + esHtml(r[0]) + '</th><td class="es-cell">' + esHtml(r[1]) + '</td></tr>'; }).join('') + '</table>' : '') +
      (st.es ? '<div class="es-line big">' + esHtml(st.es) + sayBtn(st.es) + '</div>' : '') + (st.ja ? '<div class="ja-line">' + esc(st.ja) + '</div>' : ''));
    glossEs(c);
    boardSet(c);
    step();
  }
  function doEnter(st) { addActor(st.who); later(step, 500); }

  /* ✉️ 書きあがった手紙：その依頼で書いた文をつなげて、宛名・本文・署名の1通にして便せんに出す。封をして送る。
   *  recv:true は届いた手紙（読むだけ）。どの行も下に小さく訳をそえる（文脈の中で形を見直す） */
  function doLetter(st) {
    talkHide();
    if (st.who) addActor(st.who);
    var body = st.body.map(function (b) { return '<p class="lt-es">' + esHtml(b[0]) + '</p><p class="lt-ja">' + esc(b[1]) + '</p>'; }).join('');
    var c = boardSet(el('div', 'card letter-full' + (st.recv ? ' recv' : ''), '<div class="qtag">' + (st.recv ? '届いた手紙' : '書きあがった手紙') + '</div>' +
      '<div class="letter lt-sheet"><p class="lt-to">' + esHtml(st.to) + '</p>' + body + '<p class="lt-sign">' + String(st.sign).split('\n').map(esHtml).join('<br>') + '</p></div>' +
      (st.note ? '<p class="lt-note">' + ja(st.note) + '</p>' : '')));
    glossEs(c);
    Sfx.whoosh();
    if (st.recv) return later(function () { nextBtn('たたむ ▶'); }, 400);
    T1.next(function () {
      if (!cur) return;
      stamp(c, st.wax === 'blue' ? 0 : 1);
      sfxDivine();
      var w = $('.wax', c), pt = FX.at(w || c); FX.rays(pt.x, pt.y);
      if (st.who) actorReact(st.who, '✉️', '😊');
      later(function () { nextBtn('送る ▶'); }, 700);
    }, '封をする');
  }
  /* 場面の地の文（だれのせりふでもない）。ボードに静かに出す。物語の流れ（いつ・なぜ来たか）を見せる */
  function doScene(st) {
    talkHide();
    var c = boardSet(el('div', 'card scene', String(st.x).split('\n').map(function (l) { return '<p>' + ja(l) + '</p>'; }).join('')));
    glossAll(c);
    later(function () { nextBtn('つぎへ ▶'); }, 500);
  }
  function doMono(st) { talk(st.x, 'me', '', function () { nextBtn('つぎへ ▶'); }); }

  function doAsk(st, run) {
    talkHide();
    var c = boardSet(el('div', 'card ask' + (st.pred ? ' pred' : ''), '<div class="qtag">' + (st.pred ? '予想してみて <em>まちがえても OK</em>' : '問い') + '</div><div class="qq">' + ja(st.q) + '</div>' + (st.es ? '<div class="es-line">' + esHtml(st.es) + '</div>' : '') + '<div class="qres"></div>'));
    glossAll(c);
    var list = st.o.map(function (o, i) { return { label: o, i: i }; });
    if (!st.pred) list = shuffle(list);
    T1.options(list, function (i, b, wrap) {
      var ok = i === st.a, res = $('.qres', c);
      if (st.pred) {
        markOpts(wrap, st.a, -1);
        res.innerHTML = '<p class="mine">あなたの予想：<b>' + esc(st.o[i]) + '</b>' + (ok ? '　🎯 的中！' : '') + '</p>';
        if (ok) { bonus(run, 8, b, '予想的中！'); Sfx.correct(2); } else Sfx.tap();
        later(function () { talk(st.r, null, ok ? 'happy' : 'wow', function () { nextBtn(); }); }, 300);
        return;
      }
      markOpts(wrap, st.a, i);
      res.innerHTML = ok ? '<b class="rk ok">⭕ ' + pick(PRAISE) + '</b>' : '<b class="rk ng">❌ おしい！ くらべてみよう</b>' + cmpRows(esc(st.o[i]), '<b class="fix">' + esc(st.o[st.a]) + '</b>');
      if (ok) hit(run, b); else miss(run, c);
      later(function () { talk(ok ? (st.why || 'そのとおり。') : (st.why || 'もう一度、表を思い出してみよう。'), null, ok ? 'happy' : 'sad', function () { nextBtn(); }); }, 300);
    });
  }

  /* 形を作る：yo の形の o をタップで消す → つける語尾を選ぶ → 接続法の形が完成 */
  function doForge(st, run) {
    talkHide();
    var w = st.w, cut = st.cut || '', start = w.length - cut.length, errs = 0, left = cut.length;
    var c = boardSet(el('div', 'card forge', '<div class="qtag">形を作る</div>' + (st.p ? '<p class="forge2-ask"><b>' + esc(st.p) + '</b> の接続法に　<small>' + esc(st.ja) + '</small></p>' : '') + '<div class="fg-word">' + w.split('').map(function (ch, i) { return '<button class="fl" data-i="' + i + '">' + esc(ch) + '</button>'; }).join('') + '</div><div class="qres"></div>'));
    var fls = $$('.fl', c);
    T1.hint('👆 ' + ja(st.hint));
    function wrong(src) {
      errs++; if (errs === 1) miss(run, src); else { Sfx.wrong(); FX.shake(src); }
      if (errs >= 2) fls.forEach(function (f, i) { if (i >= start) f.classList.add('hintme'); });
    }
    function cutDone() {
      if (!st.add) return finish();
      T1.options(st.o.map(function (o, i) { return { label: o, i: i }; }), function (i, b, wrap) {
        if (st.o[i] !== st.add) {
          wrong(b);
          $$('.opt', wrap).forEach(function (o) { if (o !== b) o.disabled = false; });
          b.classList.add('ng'); b.classList.remove('chosen');
          return;
        }
        var nl = el('span', 'fl add', esc(st.add)); $('.fg-word', c).appendChild(nl); FX.pop(nl, 1.6);
        var p = FX.at(nl); FX.burst(p.x, p.y, { pal: 'rel', n: 24 });
        later(finish, 380);
      });
      $('.opts', T1.el).insertAdjacentHTML('beforebegin', '<p class="thint">つける文字は？' + (st.p ? '（<b>' + esc(st.p) + '</b> の形）' : '') + '</p>');
    }
    function finish() {
      T1.clear();
      $('.fg-word', c).classList.add('done');
      later(function () {
        $('.fg-word', c).outerHTML = '<div class="es-line big fg-out">' + esHtml(st.out) + sayBtn(plain(st.out)) + '</div>';
        $('.qres', c).innerHTML = '<div class="ja-line">' + esc(st.ja) + '</div>';
        glossEs(c);
        var words = cmdWords(st.out);
        FX.slam('« ' + (words.length ? words.join(' ') : plain(st.out)) + ' »', 'gold');
        sfxDivine();
        var p = FX.at($('.fg-out', c)); FX.rays(p.x, p.y); FX.burst(p.x, p.y, { pal: 'divine', n: 50, sp: 10, ring: true });
        if (!errs) hit(run, $('.fg-out', c)); else bonus(run, 5, $('.fg-out', c));
        autoSay(plain(st.out));
        later(function () { nextBtn(pick(['できた ▶', 'きれいな形 ▶', 'つぎへ ▶'])); }, 500);
      }, 300);
    }
    fls.forEach(function (f) {
      f.addEventListener('click', function () {
        var i = +f.getAttribute('data-i');
        if (f.classList.contains('gone') || !left) return;
        if (i >= start) {
          f.classList.add('gone'); Sfx.whoosh(); var p = FX.at(f); FX.burst(p.x, p.y, { pal: 'rel', n: 14 });
          left--;
          if (!left) later(cutDone, 360);
        } else wrong(f);
      });
    });
    if (!left) cutDone();
  }

  /* 🔏 封蝋：依頼 → 封蝋の色（🔵 本当のこと／🔴 頭の中のこと）→ 形 → 封をして届ける。
   *  色をまちがえると、届いた先で誤解された返事（mis）が来る。そのあと正しい色で封をしなおして、形を選ぶ */
  var THANKS = ['Gracias.', 'Muchas gracias.', 'Qué bonito…', 'Gracias, de verdad.'];
  function stamp(c, col, bad) {
    var lt = $('.letter', c); if (!lt) return;
    var old = $('.wax', lt); if (old) old.remove();
    var w = el('i', 'wax ' + (col ? 'red' : 'blue') + (bad ? ' bad' : ''), ''); w.setAttribute('aria-hidden', 'true');
    lt.appendChild(w); FX.pop(w, 1.5);
    if (!bad) { var p = FX.at(w); FX.burst(p.x, p.y, { pal: col ? 'rel' : 'cyan', n: 16 }); }
  }
  var sealAns = -1;   // 通しテスト用：いま選ぶ正解の番号（封蝋の色は 0/1、形は o の番号）
  function doSeal(st, run) {
    talkHide();
    addActor(st.who);
    var p = D.people[st.who], want = st.mood === 'ind' ? 0 : 1, sealOk = true;
    var c = boardSet(el('div', 'card seal', '<div class="qtag">封蝋 <em>どちらの色で封をする？</em></div><div class="need"><div class="nb"><b>' + esc(p.n) + '</b><p>' + ja(st.need) + '</p></div></div>' +
      '<div class="letter"><div class="es-line">' + esHtml(st.es) + '</div><small class="vhint">' + esc(st.v) + '</small></div><div class="qres"></div>'));
    glossAll(c);
    var a = actorEl(st.who); if (a) a.classList.add('ask');
    sealAns = want;
    T1.options([{ label: MOOD[0], i: 0 }, { label: MOOD[1], i: 1 }], function (i, b, wrap) {
      sealAns = -1;
      markOpts(wrap, want, i);
      if (i === want) { hit(run, b, 8); stamp(c, want); Sfx.whoosh(); return later(formStep, 600); }
      sealOk = false; miss(run, c); stamp(c, i, true);
      var res = $('.qres', c);
      /* 見せたいのは「届いた先の誤解の返事」。パロマの吹き出しで隠さず、返事の下に一言だけ添えて、返事が見える位置までボードを送る */
      res.innerHTML = '<div class="misreply"><b>届いた先で……</b><p>' + ja(st.mis) + '</p><p class="mis-fix">' + (want ? 'que のあとは、頭の中のこと → <i class="wx red"></i>赤' : 'que のあとは、本当のこと → 🔵 青') + '</p></div>';
      glossAll(res);
      later(function () {
        var r = res.getBoundingClientRect(), B = boardEl.getBoundingClientRect();
        if (r.bottom > B.bottom - 6) boardEl.scrollTo({ top: boardEl.scrollTop + Math.min(r.top - B.top - 6, r.bottom - B.bottom + 10), behavior: FX.RM ? 'auto' : 'smooth' });
        T1.next(formStep, '🔏 ' + (want ? '赤' : '青') + 'で封をしなおす');
      }, 500);
    }, 'long seals');
    function formStep() {
      if (!cur) return;
      talkHide();
      $('.qres', c).innerHTML = ''; stamp(c, want);
      sealAns = st.a;
      T1.options(shuffle(st.o.map(function (o, i) { return { label: o, i: i }; })), function (i, b, wrap) {
        sealAns = -1;
        var ok = i === st.a;
        markOpts(wrap, st.a, i);
        if (a) a.classList.remove('ask');
        var bl = $('.letter .blank', c); if (bl) { bl.textContent = st.o[i]; bl.className = 'blank filled ' + (ok ? 'ok' : 'ng'); }
        var res = $('.qres', c);
        res.innerHTML = '<div class="es-line big cast-out">' + esHtml(st.out) + sayBtn(plain(st.out)) + '</div><div class="ja-line">' + esc(st.ja) + '</div>';
        glossEs(res);
        if (ok) {
          hit(run, b, 12);
          var words = cmdWords(st.out);
          later(function () {
            FX.slam('« ' + words.join(' ') + ' »', sealOk ? 'gold' : 'cyan', sealOk ? '封をして、届けた！' : '封をしなおして、届けた');
            sfxDivine();
            var pt = FX.at(a || c); FX.rays(pt.x, pt.y); FX.burst(pt.x, pt.y, { pal: 'divine', n: 36, sp: 9 });
            actorReact(st.who, (st.fx && st.fx.e) || '✉️', (st.fx && st.fx.mood) || '😊');
            if (st.fx && st.fx.world) worldFx(st.fx.world);
            autoSay(plain(st.out));
          }, 250);
          later(function () { talk(pick(THANKS), st.who, '', function () { nextBtn(); }); }, 900);
        } else {
          miss(run, c);
          if (a) { var m = $('.am', a); m.textContent = '❓'; m.classList.remove('on'); void m.offsetWidth; m.classList.add('on'); }
          res.insertAdjacentHTML('afterbegin', '<b class="rk ng">❌ 形がちがう…　正しくはこれ</b>');
          autoSay(plain(st.out));
          later(function () { talk(st.why || '', null, 'sad', function () { nextBtn('▶ もう覚えた'); }); }, 400);
        }
      });
      $('.opts', T1.el).insertAdjacentHTML('beforebegin', '<p class="thint">' + (want ? '<i class="wx red"></i>接続法' : '<i class="wx blue"></i>いつもの形') + 'で、入る形は？</p>');
    }
  }
  function doTip(st, run) {
    var first = !S.tips[st.id];
    S.tips[st.id] = 1; save();
    var c = boardSet(el('div', 'card tip', '<div class="tip-h"><span>📜 TIP GET!</span>' + (first ? '<em>NEW</em>' : '') + '</div><b class="tip-ti">' + esc(st.ti) + '</b><div class="tip-x">' + ja(st.x) + '</div>' +
      (st.why ? '<details><summary>なぜ？</summary><p>' + ja(st.why) + '</p></details>' : '')));
    glossAll(c);
    if (first) { Sfx.coin(); var p = FX.at(c); FX.burst(p.x, p.y, { pal: 'gold', n: 30 }); bonus(run, 5, c, 'Tips'); }
    var me = cur;
    talk(pick(['大事なところ。\n帳面の心得に、書きとめておくね。', 'ここは、試験にも出るところ。\n帳面の心得で、いつでも読み返せる。', 'まとめの一枚。\n帳面にはさんでおくね。']), null, 'happy', function () { if (cur === me) nextBtn(); });
  }
  function lessonQ(q, run, then, tag) {
    talkHide();
    $$('.board-tbl', boardEl).forEach(function (t) { t.remove(); });   // 問題では表を見せない（思い出す練習）
    var c = boardSet(el('div', 'card qcard'));
    renderQ(q, c, T1, { tag: tag, run: run }, function (ok) {
      srs(q, ok); if (cur) cur.qok[q.id] = ok; save();
      var src = $('.chosen', T1.el) || $('.tok.ok, .tok.ng', c) || c;
      if (ok) hit(run, src); else miss(run, c);
      boardScroll();
      later(then, 250);
    });
  }
  function doQ(st, run) { lessonQ(QBY[st.id], run, function () { nextBtn('▶ つぎへ'); }, st.tag); }
  function doDrill(st, run) {
    var pool = D.questions.filter(function (q) { return q.L === cur.L.no && !cur.used[q.id]; });
    var list = weighted(pool).slice(0, st.n);
    var k = 0, me = cur;
    talk(pick(['最後に、' + list.length + '問の練習。\n5問つづけて書けたら、筆が乗るよ。', '仕上げに、' + list.length + '問。\nあわてずに、一通ずつ。', '最後に ' + list.length + '問の練習。\n迷ったら、que の前を見て。']), null, 'happy', function () {
      if (cur !== me) return;
      T1.next(function () { FX.slam('Práctica', 'gold', list.length + ' 問'); later(one, 600); }, '🖋 練習をはじめる');
    });
    function one() {
      if (cur !== me) return;
      if (k >= list.length) return nextBtn('▶ 練習クリア！');
      var q = list[k++];
      lessonQ(q, run, function () { setProg(); T1.next(one, k < list.length ? '▶ つぎ（' + (k + 1) + '/' + list.length + '）' : '▶ 練習クリア！'); }, k + ' / ' + list.length);
    }
  }
  function finishLesson() {
    if (cur.L.remedy) return finishRemedy();
    var L = cur.L, run = cur.run, rec = S.lessons[L.id] || {}, first = !rec.done;
    var acc = run.ok + run.ng ? run.ok / (run.ok + run.ng) : 1;
    var stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
    var rewards = [], card = null;
    run.xp += 30;
    if (first) {
      S.tickets += 3; rewards.push({ icon: '🎟', t: '初クリア +3' });
      var mine = D.cards.filter(function (c) { return c.L === L.no; });
      var fresh2 = mine.filter(function (c) { return !S.cards[c.id]; });
      card = (fresh2.length ? fresh2 : mine)[0];
      if (card) S.cards[card.id] = (S.cards[card.id] || 0) + 1;
    }
    S.lessons[L.id] = { done: true, stars: Math.max(stars, rec.stars || 0), at: Date.now() };
    var sets = setRewards();
    rewards = rewards.concat(missionDone('stage'), sets);
    var mapNew = first ? MAP.nodes.filter(function (n) { return n.L === L.no; }).slice(0, 2) : [];
    if (mapNew.length) rewards.push({ icon: '🗺', t: '地図に書きこまれた', h: mapChips(mapNew) });
    setFx(sets);
    touchDay();
    var up = addXp(run.xp);
    save(); cur = null;
    showResult({ title: 'Carta enviada', sub: oracleNo(L) + '　' + L.ti, stars: stars, run: run, rewards: rewards, card: card, up: up,
      next: { label: first ? '⚓ 港町へもどる（町がにぎわう！）' : '⚓ 港町へもどる', fn: function () { home(first ? { grow: L.id } : null); } }, noHome: true,
      after: function (scr) {   // 「🗺 地図に書きこまれた」の下の小さな 🖋 形の工房（町がにぎわう演出は、工房のあとの「港町へ」まで持ちこす）
        var fb = $('.forge2-go', scr);
        if (fb) fb.addEventListener('click', function () { if ($('#done').hidden) return; Sfx.unlock(); Sfx.tap(); workGrow = first ? L.id : null; workGo(); });
      } });
  }
  $('#pQuit').addEventListener('click', function () {
    if (cur && !confirm('依頼をやめる？\n（この依頼の進み具合は保存されません。答えた問題は読み返しに入ります）')) return;
    cur = null; Speech.stop(); home();
  });

  /* =========================================================
   * 結果画面
   * ========================================================= */
  function nodeLabel(n) { if (n.type === 'L') { var L = LESSON[n.id]; return oracleNo(L) + '　' + L.ti; } var B = BOSS[n.id]; return '✉️ ' + B.name; }
  var resTok = 0;
  function showResult(o) {
    var scr = $('#done'); show('done');
    /* 結果画面の演出（星・XP・レベルアップ）は、まだこの結果画面にいるときだけ。先に港町へもどったら出さない */
    var tok = ++resTok, onRes = function () { return tok === resTok && !scr.hidden; };
    var run = o.run || newRun();
    var lvBefore = levelOf(S.xp - run.xp), lvNow = levelOf(S.xp);
    scr.innerHTML = '<div class="res">' +
      '<h2 class="res-ti ' + (o.lose ? 'lose' : '') + '">' + esc(o.title) + '</h2><p class="res-sub">' + esc(o.sub || '') + '</p>' +
      (o.stars ? '<div class="stars">' + [1, 2, 3].map(function (k) { return '<i class="' + (k <= o.stars ? 'on' : '') + '">★</i>'; }).join('') + '</div>' : '') +
      (o.rank ? '<div class="rank r-' + o.rank + '">' + o.rank + '<small>RANK</small></div>' : '') +
      (o.big ? '<div class="bignum"><b>' + o.big[0] + '</b><small>' + esc(o.big[1]) + '</small></div>' : '') +
      '<div class="res-stats"><span>⭕ <b>' + run.ok + '</b></span><span>❌ <b>' + run.ng + '</b></span><span>🔥 最大 <b>' + run.best + '</b> コンボ</span></div>' +
      '<div class="res-xp"><div class="rx-top"><b>+<span id="rXp">0</span> XP</b><span>ランク Lv.<b id="rLv">' + lvBefore.lv + '</b></span></div><span class="lv-bar big"><i id="rBar" style="width:' + Math.round(lvBefore.cur / lvBefore.need * 100) + '%"></i></span></div>' +
      (o.rewards && o.rewards.length ? '<ul class="rewards">' + o.rewards.map(function (r) { return '<li><span>' + r.icon + '</span>' + (r.h || esc(r.t)) + '</li>'; }).join('') + '</ul>' : '') +
      (o.card ? '<div class="newcard"><p>📮 新しい切手！ タップでめくる</p>' + cardHtml(o.card, true) + '</div>' : '') +
      (o.note ? '<p class="res-note">' + o.note + '</p>' : '') +
      (run.misses && run.misses.length ? '<details class="misses"' + (o.openMisses ? ' open' : '') + '><summary>📝 まちがえた問題を見直す（' + run.misses.length + '問）</summary>' +
        run.misses.map(function (m) {
          var full = fullOf(m.q);
          return '<div class="miss"><div class="es-line">' + esHtml(full) + sayBtn(full) + '</div>' + (m.q.ja ? '<div class="ja-line">' + esc(m.q.ja) + '</div>' : '') +
            cmpHtml(m.q, m.c) + (m.q.why ? '<p class="why">' + ja(m.q.why) + '</p>' : '') + '</div>';
        }).join('') + '</details>' : '') +
      (o.weak && o.weak.length ? '<div class="weakbox"><h3>🩹 あやしい所をおさらい</h3><p>1回読んだだけで全部は覚えられない。まちがえた依頼の要点を、もう一度たどろう。</p>' +
        o.weak.map(function (no, i) { var L = LESSON['L' + no]; return '<button class="tb ' + (i ? 'sub' : 'go') + ' wk" data-no="' + no + '">' + esc(oracleNo(L)) + '　' + esc(L.ti) + ' <small>まちがえた問題 ' + S.weak[no].ids.length + ' 問</small></button>'; }).join('') + '</div>' : '') +
      (o.extra || '') +
      '<div class="res-btns"></div></div>';
    $$('.weakbox .wk', scr).forEach(function (b) { b.addEventListener('click', function () { if (!onRes()) return; resTok++; Sfx.tap(); startLesson(remedyLesson(+b.getAttribute('data-no'))); }); });
    if (o.after) o.after(scr);
    var bt = $('.res-btns', scr);
    var hasWeak = o.weak && o.weak.length;
    if (o.retry) bt.appendChild(mkBtn(o.retry.label, hasWeak ? 'sub' : 'go', o.retry.fn));
    if (o.next) bt.appendChild(mkBtn(o.next.label, o.retry || hasWeak ? 'sub' : 'go', o.next.fn));
    if (!o.noHome) bt.appendChild(mkBtn('⚓ 港町へ', 'sub', function () { home(); }));
    if (o.lose) { Sfx.wrong(); FX.shake(null, true); }
    else { FX.slam(o.title, o.rank === 'S' || o.stars === 3 ? 'gold' : 'cyan'); FX.confetti(o.stars === 3 || o.rank === 'S' ? 160 : 80, 'divine'); Sfx.levelUp(); }
    $$('.stars i.on', scr).forEach(function (s, k) { later(function () { if (!onRes()) return; s.classList.add('pop'); Sfx.coin(); var p = FX.at(s); FX.burst(p.x, p.y, { pal: 'gold', n: 18 }); }, 500 + k * 280); });
    var xpEl = $('#rXp'), t0 = 0, dur = 900;
    later(function () {
      if (!onRes()) return;
      t0 = performance.now();
      (function tick(t) { var k = Math.min(1, (t - t0) / dur); xpEl.textContent = Math.round(run.xp * k); if (k < 1) requestAnimationFrame(tick); })(t0);
      $('#rBar').style.width = (lvNow.lv > lvBefore.lv ? 100 : Math.round(lvNow.cur / lvNow.need * 100)) + '%';
    }, 700);
    if (o.up) later(function () { if (!onRes()) return; $('#rLv').textContent = lvNow.lv; $('#rBar').style.width = Math.round(lvNow.cur / lvNow.need * 100) + '%'; levelUp(o.up); }, 1700);
    var nc = $('.newcard .pcard', scr);
    if (nc) nc.addEventListener('click', function () { flipCard(nc); });
  }
  /* 結果画面のボタンは1回だけ（2度押しで町の演出・自動スタートが二重に動かないように） */
  function mkBtn(label, cls, fn) { var b = el('button', 'tb ' + cls, esc(label)); b.addEventListener('click', function () { if (b.disabled || $('#done').hidden) return; b.disabled = true; Sfx.tap(); fn(); }); return b; }
  function levelUp(lv) {
    Sfx.levelUp(); FX.confetti(200, 'divine'); FX.flash('#ffd23f');
    modal('<div class="lvup"><small>ランクが上がりました</small><b>' + lv + '</b><span>' + esc(titleOf(lv)) + '</span></div>', 'lvup-m');
  }

  /* =========================================================
   * 切手
   * ========================================================= */
  var RCOL = { N: 'n', R: 'r', SR: 'sr', SSR: 'ssr', UR: 'ur' };
  function cardHtml(c, back) {
    return '<div class="pcard rr-' + RCOL[c.r] + (back ? ' down' : '') + '" data-c="' + c.id + '" role="button" tabindex="0">' +
      '<div class="pc-in"><div class="pc-front"><span class="pc-r">' + c.r + '</span><span class="pc-tag">' + esc(c.tag || '') + '</span>' +
      '<div class="pc-ico">' + c.icon + '</div><b class="pc-name">' + esc(c.name) + '</b>' +
      '<div class="es-line">' + esHtml(c.es) + '</div><div class="ja-line">' + esc(c.ja) + '</div>' + sayBtn(c.es) + '</div>' +
      '<div class="pc-back"><b>✦</b></div></div></div>';
  }
  function flipCard(nc) {
    if (!nc.classList.contains('down')) return;
    nc.classList.remove('down');
    var c = CARD[nc.getAttribute('data-c')];
    var tier = { N: 'common', R: 'rare', SR: 'epic', SSR: 'legendary', UR: 'legendary' }[c.r];
    Sfx.chestOpen(tier);
    var p = FX.at(nc); FX.burst(p.x, p.y, { pal: c.r === 'N' || c.r === 'R' ? 'ok' : c.r === 'SR' ? 'rel' : 'gold', n: c.r === 'N' ? 20 : 60, sp: 10, ring: true });
    if (c.r === 'SSR' || c.r === 'UR') { FX.slam(c.r, c.r === 'UR' ? 'rainbow' : 'gold'); FX.confetti(80, c.r === 'UR' ? 'rainbow' : 'gold'); FX.rays(p.x, p.y); }
    glossEs(nc);
    autoSay(c.es);
  }

  /* =========================================================
   * ボス戦・ラッシュ・復習（1問ずつの画面）
   * ========================================================= */
  var zMain = $('#zMain'), zHud = $('#zHud'), zRun = null, zTimer = 0, zActive = false;
  function zStop() { zActive = false; clearInterval(zTimer); Speech.stop(); $('#quiz').classList.remove('exam'); $('#zMap').hidden = false; }
  $('#zQuit').addEventListener('click', function () {
    if (zActive && !confirm('やめる？（ここまでの XP はもらえません）')) return;
    zStop(); home();
  });
  function zCard() { zMain.innerHTML = ''; var c = el('div', 'card qcard'); zMain.appendChild(c); return c; }

  /* ----- ボス：手紙をねらう影から、3通の手紙を守る ----- */
  function bossIntro(B) {
    zStop(); show('quiz'); feverOff(); setHour(B.id);
    $('#zTitle').textContent = (B.final ? '最後の夜' : '試しの日') + '　' + B.name; $('#zProg').style.width = '0%'; $('#zRight').innerHTML = '';
    zHud.innerHTML = '<div class="warn"><span>町に影がさす　·　手紙を守って　·　町に影がさす　·　手紙を守って　·　</span></div>';
    var rec = S.bosses[B.id];
    zMain.innerHTML = '<div class="boss-intro" style="--bc:' + B.col + '"><div class="bface big">' + B.face + '</div><small>' + esc(B.en) + '</small><h2>' + esc(B.name) + '</h2>' +
      '<p class="bline">「' + esc(B.line) + '」</p>' +
      '<ul class="rules"><li>✉️ 手紙は3通。まちがえると1通、迷子になる</li><li>⚡ 早書きゲージが残っているうちに正解するとクリティカル</li><li>🏆 ノーミスで S ランク</li><li>📚 出題：' + B.from.map(function (id) { return oracleNo(LESSON[id]).replace('の依頼', ''); }).join('・') + ' の依頼</li></ul>' +
      (rec && rec.win ? '<p class="best">これまでの最高：<b>' + rec.rank + '</b> ランク</p>' : '') + '</div>';
    Sfx.combo(10); FX.shake(null, true);
    T2.next(function () { bossFight(B); }, '🖋 書きはじめる', 'boss');
  }
  function bossFight(B) {
    var pool = D.questions.filter(function (q) { return B.from.indexOf('L' + q.L) >= 0; });
    var queue = weighted(pool), qi = 0;
    var hpMax = 1000, hp = hpMax, hearts = 3, dmgBase = Math.ceil(hpMax / B.n), n = 0;
    zRun = newRun(); zActive = true;
    zHud.innerHTML = '<div class="bhud" style="--bc:' + B.col + '"><div class="bface" id="bFace">' + B.face + '</div><div class="bstat"><b>' + esc(B.name) + '</b><span class="hp"><i id="bHp"></i><em id="bHpN">' + hp + '</em></span><span class="speed"><i id="bSpd"></i></span></div><div class="hearts" id="bHearts"></div></div>';
    function paint() {
      $('#bHp').style.width = Math.max(0, hp / hpMax * 100) + '%'; $('#bHpN').textContent = Math.max(0, hp);
      $('#bHearts').innerHTML = [0, 1, 2].map(function (k) { return '<i class="' + (k < hearts ? 'on' : '') + '">✉️</i>'; }).join('');
      $('#zProg').style.width = Math.round((hpMax - hp) / hpMax * 100) + '%';
      $('#zRight').innerHTML = '<small>XP</small><b>' + zRun.xp + '</b>';
    }
    paint();
    FX.slam('En guardia', 'pink', '手紙を守ろう');
    function one() {
      if (!zActive) return;
      if (qi >= queue.length) { queue = weighted(pool); qi = 0; }
      var q = queue[qi++]; n++;
      var c = zCard();
      var limit = q.k === 'build' ? 14000 : q.k === 'ja' || q.k === 'mood' || q.k === 'ng' ? 9000 : 6500;
      /* 早書きゲージ（残っているうちに正解でクリティカル） */
      var spd = $('#bSpd'), t0 = Date.now();
      clearInterval(zTimer);
      zTimer = setInterval(function () { var k = Math.max(0, 1 - (Date.now() - t0) / limit); spd.style.width = (k * 100) + '%'; spd.classList.toggle('low', k < 0.3); if (!k) clearInterval(zTimer); }, 80);
      renderQ(q, c, T2, { tag: 'TURN ' + n, run: zRun }, function (ok, ms) {
        clearInterval(zTimer);
        srs(q, ok); save();
        var face = $('#bFace');
        if (ok) {
          var crit = ms < limit, dmg = Math.round(dmgBase * (crit ? 1.5 : 1));
          hp -= dmg;
          hit(zRun, $('.chosen', T2.el) || c, crit ? 15 : 10);
          var p = FX.at(face);
          later(function () {
            FX.rays(p.x, p.y, '#ffe68a');
            FX.burst(p.x, p.y, { pal: crit ? 'gold' : 'divine', n: crit ? 60 : 30, sp: 11, ring: true });
            FX.floatText(p.x, p.y + 10, (crit ? '早書き ' : '') + '-' + dmg, crit ? '#ffd23f' : '#ffffff');
            FX.shake(face, true); face.classList.add('hurt'); later(function () { face.classList.remove('hurt'); }, 400);
            if (crit) { Sfx.crit(); FX.slam('早書き', 'gold', 'すばやい一筆'); } else sfxDivine();
            paint();
            if (hp <= 0) return later(function () { bossEnd(B, true, hearts); }, 700);
            T2.next(one, pick(['▶ つぎの一筆', '▶ たたみかける', '▶ まだまだ！']));
          }, 260);
        } else {
          hearts--;
          miss(zRun, c);
          face.classList.add('atk'); later(function () { face.classList.remove('atk'); }, 500);
          later(function () {
            FX.shake(null, true); FX.flash('#ff0040'); paint();
            if (hearts <= 0) return later(function () { bossEnd(B, false, 0); }, 900);
            var hi = mapHiFor(q), lab = '▶ 立て直す（✉️ ' + hearts + '）';
            if (hi.length) T2.btns([{ t: lab, cls: 'go', fn: one }, { t: '🗺 地図で見る', cls: 'sub', fn: function () { mapModal(hi); } }]);
            else T2.next(one, lab);
          }, 300);
        }
      });
    }
    one();
  }
  function bossEnd(B, win, hearts) {
    zStop();
    var weak = markWeak(zRun);
    var rewards = [], card = null, rank = win ? (hearts === 3 ? 'S' : hearts === 2 ? 'A' : 'B') : null;
    var rec = S.bosses[B.id] || {}, first = win && !rec.win;
    if (win) {
      zRun.xp += B.final ? 200 : 100;
      if (first) {
        S.tickets += 5; rewards.push({ icon: '🎟', t: 'はじめて越えた +5' });
        card = CARD['u-' + B.id]; if (card) S.cards[card.id] = (S.cards[card.id] || 0) + 1;
      } else { S.tickets += 1; rewards.push({ icon: '🎟', t: '越えた +1' }); }
      var better = !rec.rank || 'SAB'.indexOf(rank) < 'SAB'.indexOf(rec.rank);
      S.bosses[B.id] = { win: true, rank: better ? rank : rec.rank, at: Date.now() };
      rewards = rewards.concat(missionDone('stage'));
    }
    touchDay();
    var up = addXp(zRun.xp);
    save();
    showResult({ title: win ? (B.final ? 'Cielo despejado' : 'Se fue la sombra') : 'Otra vez', sub: win ? B.win : B.name + ' の中で、手紙が迷子になった……', lose: !win, rank: rank, run: zRun, rewards: rewards, card: card, up: up, weak: weak,
      note: win ? (B.final && rank !== 'S' ? 'ノーミスで S ランクをねらってみよう！' : '') : '答えた問題は復習に入ったよ。Tips を見直して、もう一回！',
      retry: win ? null : { label: '⚡ もう一回！', fn: function () { bossIntro(B); } },
      next: win ? { label: first ? '⚓ 港町へもどる（町がにぎわう！）' : '⚓ 港町へもどる', fn: function () { home(first ? { grow: B.id } : null); } } : null, noHome: win });
  }

  /* ----- ラッシュ（60秒） ----- */
  function rushIntro() {
    var pool = unlockedQs().filter(function (q) { return q.k !== 'build'; });
    if (!pool.length) return toast('🔒 第1の依頼をクリアすると、ラッシュが遊べるよ');
    zStop(); show('quiz');
    $('#zTitle').textContent = '⚡ 代筆ラッシュ'; $('#zProg').style.width = '100%'; $('#zRight').innerHTML = '';
    zHud.innerHTML = '';
    zMain.innerHTML = '<div class="rush-intro"><b class="ri-ti">Sesenta segundos</b><ul class="rules"><li>⏱ 60秒で、できるだけたくさん正解</li><li>🔥 5連続正解で <b>筆が乗る</b>（得点2倍・正解ごとに +1秒）</li><li>💥 まちがえると −3秒</li><li>📚 出題：クリアした依頼の問題（' + pool.length + '問）</li></ul>' +
      '<p class="best">ハイスコア：<b>' + S.rushBest + '</b></p></div>';
    T2.next(function () { rushGo(pool); }, '🖋 書きはじめる', 'boss');
  }
  function rushGo(pool) {
    T2.clear(); zMain.innerHTML = ''; $('#zMap').hidden = true;   // 60秒の時間が減らないように、ラッシュ中は地図を出さない
    var k = 3;
    (function count() {
      if (k > 0) { FX.slam(String(k), 'cyan'); Sfx.tap(); k--; later(count, 700); }
      else { FX.slam('¡Ya!', 'gold'); Sfx.combo(10); rushRun(pool); }
    })();
  }
  function rushRun(pool) {
    var score = 0, queue = weighted(pool), qi = 0, endAt = Date.now() + 60000;
    zRun = newRun(); zActive = true;
    zHud.innerHTML = '<div class="rhud"><span class="rtime"><i id="rT"></i></span><b id="rS">0</b></div>';
    function paint() {
      var ms = Math.max(0, endAt - Date.now());
      $('#rT').style.width = (ms / 600) + '%'; $('#rT').classList.toggle('low', ms < 10000);
      $('#zProg').style.width = (ms / 600) + '%';
      $('#zRight').innerHTML = '<small>' + Math.ceil(ms / 1000) + 's</small><b>' + score + '</b>';
      if (ms <= 0) end();
    }
    zTimer = setInterval(paint, 100);
    function end() {
      if (!zActive) return;
      zStop(); T2.clear();
      FX.slam('Fin', 'pink', '時間です');
      later(function () { rushEnd(score); }, 900);
    }
    function one() {
      if (!zActive) return;
      if (qi >= queue.length) { queue = weighted(pool); qi = 0; }
      var q = queue[qi++], c = zCard();
      renderQ(q, c, T2, { fast: true, run: zRun }, function (ok) {
        srs(q, ok);
        if (ok) {
          var pts = (100 + zRun.combo * 10) * (zRun.combo + 1 >= 5 ? 2 : 1);
          score += pts; hit(zRun, $('.chosen', T2.el) || c, 5);
          if (zRun.combo >= 5) endAt += 1000;
          var p = FX.at($('#rS')); FX.floatText(p.x, p.y + 20, '+' + pts, '#ffd23f'); FX.pop($('#rS'), 1.4);
          later(one, 380);
        } else {
          endAt -= 3000; miss(zRun, c);
          var p2 = FX.at($('#rT')); FX.floatText(p2.x, p2.y + 16, '−3s', '#ff5c5c');
          later(one, 1100);
        }
        $('#rS').textContent = score;
      });
    }
    paint(); one();
  }
  function rushEnd(score) {
    var weak = markWeak(zRun);
    var best = score > S.rushBest, tix = score >= 6000 ? 3 : score >= 3500 ? 2 : score >= 1500 ? 1 : 0;
    if (best) S.rushBest = score;
    S.tickets += tix;
    var rewards = tix ? [{ icon: '🎟', t: 'スコアボーナス +' + tix }] : [];
    rewards = rewards.concat(missionDone('rush'));
    touchDay(); save();
    var up = addXp(zRun.xp); save();
    showResult({ openMisses: true, title: best ? 'Nuevo récord' : 'Fin del tiempo', sub: '60秒の代筆ラッシュ', run: zRun, weak: weak, rewards: rewards, up: up, big: [score, best ? 'ハイスコア更新！' : 'ハイスコア ' + S.rushBest],
      note: '🎟 1500点で1枚・3500点で2枚・6000点で3枚', retry: { label: '⚡ もう一回！', fn: rushIntro } });
  }

  /* ----- 読み返し（復習） ----- */
  function reviewGo() {
    var all = unlockedQs();
    if (!all.length) return toast('🔒 第1の依頼をクリアすると、読み返しができるよ');
    var list = weighted(all).slice(0, 10), k = 0;
    zStop(); show('quiz'); zActive = true; zRun = newRun();
    $('#zTitle').textContent = '🔁 読み返し'; zHud.innerHTML = '';
    var due = dueQs().length;
    FX.slam('Releer', 'cyan', due ? '忘れかけの問題 ' + Math.min(due, 10) + ' 問から' : '読み返し');
    function paint() { $('#zProg').style.width = Math.round(k / list.length * 100) + '%'; $('#zRight').innerHTML = '<small>XP</small><b>' + zRun.xp + '</b>'; }
    function one() {
      paint();
      if (k >= list.length) return end();
      var q = list[k++], c = zCard();
      renderQ(q, c, T2, { tag: k + ' / ' + list.length + '　' + oracleNo(LESSON['L' + q.L]), run: zRun }, function (ok) {
        srs(q, ok); save();
        if (ok) hit(zRun, $('.chosen', T2.el) || c); else miss(zRun, c);
        paint();
        var nx = k < list.length ? '▶ つぎへ' : '▶ おわり！';
        later(function () {
          if (ok) return T2.next(one, nx);
          var hi = mapHiFor(q);
          T2.btns([{ t: nx, cls: 'go', fn: one }, { t: hi.length ? '📜 ヒント' : '📜 ヒントを見る', cls: 'sub', fn: function () { hintModal(q.L); } }]
            .concat(hi.length ? [{ t: '🗺 地図', cls: 'sub', fn: function () { mapModal(hi); } }] : []));
        }, 250);
      });
    }
    function end() {
      zStop();
      S.tickets += 1;
      var rewards = [{ icon: '🎟', t: '復習やりきり +1' }].concat(missionDone('review'));
      touchDay();
      var weak = markWeak(zRun);
      var up = addXp(zRun.xp + 20); zRun.xp += 20; save();
      var acc = zRun.ok / list.length;
      showResult({ title: acc === 1 ? 'Perfecto' : 'Releído', sub: '読み返し ' + list.length + '問', stars: acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1, run: zRun, rewards: rewards, up: up, weak: weak,
        note: 'まちがえた問題は、10分後からまた出てくるよ。正解した問題は、1日後・2日後・4日後…と間をあけて出る。', retry: { label: '🔁 もう10問', fn: reviewGo } });
    }
    one();
  }

  /* =========================================================
   * 🗺 封蝋の地図
   *  出発点は3つ（形の作り方・🔴 頭の中のこと・🔵 本当のこと）。きまりを習うたびに枝が1本ずつ書きこまれる。
   *  データは OQ.map（lessons.js）。
   *  動かすのは「いまここ」の札（hi）だけ。ほかは動かさない（opacity だけのパルス）。
   * ========================================================= */
  var MAP = D.map || { starts: [], nodes: [] };
  function mapOpenN() { return MAP.nodes.filter(function (n) { return lessonDone(n.L); }).length; }
  function mapNodeHtml(n, open, hi, now) {
    if (!open) { var NL = LESSON['L' + n.L]; return '<div class="cmap-n lock">？？？<small>' + (NL ? esc(oracleNo(NL)) + 'で' : '') + '</small></div>'; }
    var here = hi ? '<b class="cmap-here">いまここ</b>' : '';
    if (n.kind === 'ex') return '<div class="cmap-n ex' + (hi ? ' hi' : now ? ' now' : '') + '"><div class="cmap-who">' + esc(n.ti) + here + '</div><div class="cmap-ex">' + esHtml(n.ex) + '</div></div>';
    return '<div class="cmap-n' + (hi ? ' hi' : now ? ' now' : '') + '"><div class="cmap-who">' + esc(n.who) + here + '</div>' +
      '<div class="cmap-flow">→ ' + esc(n.op) + ' → <b class="cmap-ex">' + esHtml(n.ex) + '</b>' + (n.ja ? '<small class="cmap-ja">' + esc(n.ja) + '</small>' : '') + '</div></div>';
  }
  /* hi：いま光らせる枝の id の配列。opts.nowL：その番号の依頼で習う枝は、まだクリア前でも開いて見せる。opts.hiStart：光らせる出発点の id（鍛冶場） */
  function mapHtml(hi, opts) {
    hi = hi || []; opts = opts || {};
    var kids = {};
    MAP.nodes.forEach(function (n) { (kids[n.from] || (kids[n.from] = [])).push(n); });
    function isOpen(n) { return lessonDone(n.L) || hi.indexOf(n.id) >= 0 || (opts.nowL && n.L === opts.nowL); }
    function any(id) { return (kids[id] || []).some(function (n) { return isOpen(n) || any(n.id); }); }
    function tree(id) {
      return (kids[id] || []).map(function (n) {
        return '<div class="cmap-b">' + mapNodeHtml(n, isOpen(n), hi.indexOf(n.id) >= 0, !!opts.nowL && n.L === opts.nowL) + (kids[n.id] ? '<div class="cmap-kids">' + tree(n.id) + '</div>' : '') + '</div>';
      }).join('');
    }
    if (opts.focus) {
      /* しぼった表示：hi の枝とそこへの道（親の枝）だけ。出発点は hi の枝があるものだけ */
      var byId = {}, inc = {}, roots = {}, shownRoots = [];
      MAP.nodes.forEach(function (n) { byId[n.id] = n; });
      hi.forEach(function (id) {
        var n = byId[id]; if (!n) return;
        inc[id] = 1;
        var r = n; while (byId[r.from]) { r = byId[r.from]; inc[r.id] = 1; }
        if (!roots[r.from]) { roots[r.from] = 1; shownRoots.push(r.from); }
      });
      if (shownRoots.length) {
        /* 1行の道（出発 → 親の枝）＋ hi の札だけ。問題と同時に画面に入る高さにする。全体は右上の 🗺 で */
        var first = byId[hi.filter(function (id) { return byId[id]; })[0]], chain = [], r0 = first;
        while (byId[r0.from]) { r0 = byId[r0.from]; chain.unshift(r0); }
        var st0 = MAP.starts.filter(function (x) { return x.id === r0.from; })[0] || MAP.starts[0];
        var path = '<small>出発</small> <b class="cmap-pst' + (opts.hiStart === st0.id ? ' hi' : '') + '">' + esc(st0.ti) + '</b> <span class="cmap-sx">' + esc(st0.ex) + '</span>' +
          chain.map(function (n) { return ' <i>→</i> <span class="cmap-pn">' + esc((n.who || n.ti).replace(/（.*?）/, '')) + ' <b class="cmap-ex">' + esHtml(n.ex.split('・')[0]) + '</b></span>'; }).join('');
        return '<div class="cmap focus"><button type="button" class="cmap-more" aria-label="地図の全体を見る">🗺</button><div class="cmap-path">' + path + '</div>' +
          hi.filter(function (id) { return byId[id]; }).map(function (id) { return mapNodeHtml(byId[id], true, true); }).join('') + '</div>';
      }
    }
    return '<div class="cmap">' + MAP.starts.map(function (s) {
      var on = any(s.id);
      return '<section class="cmap-g' + (on ? '' : ' off') + (on && opts.hiStart === s.id ? ' hi' : '') + '"><div class="cmap-h"><small>出発：</small>' +
        (on ? '<b>' + esc(s.ti) + '</b><span class="cmap-sx">' + esc(s.ex) + '</span><em>（' + esc(s.sub) + '）</em>' : '<b>？？？</b>') + '</div>' + tree(s.id) + '</section>';
    }).join('') + '</div>';
  }
  /* 光っている札が見える所まで、入れ物（ボード・モーダル）の中でスクロール */
  function mapReveal(root, scroller, ms) {
    later(function () {
      var h = $('.cmap-n.hi', root) || $('.cmap-n.now', root); if (!h || !scroller) return;
      var r = h.getBoundingClientRect(), B = scroller.getBoundingClientRect();
      if (r.top < B.top + 8 || r.bottom > B.bottom - 8) scroller.scrollTop += r.top - B.top - 10;
    }, ms);
  }
  /* 地図を開く（いつでも）。レッスン中は、いま習っている枝を開いて見せる */
  function mapModal(hi) {
    var nowL = cur ? (cur.L.base ? cur.L.base.no : cur.L.no) : 0;
    modal('<h3 class="m-h">🗺 封蝋の地図</h3>' + mapHtml(hi, { nowL: nowL }) +
      '<p class="m-note">' + mapOpenN() + ' / ' + MAP.nodes.length + ' 本が書きこまれている。習うたびに増えるよ。</p>' +
      (mapOpenN() > 0 && !cur && !zActive ? '<div class="tbs m-btns"><button class="tb go" id="mForge">🖋 形の工房で形を作る</button></div>' : ''), 'map-m');
    mapReveal($('#mbody'), $('.mbox'), 380);
    var fb = $('#mForge'); if (fb) fb.addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); $('#modal').hidden = true; workGo(); });
  }
  /* まちがえた問題に当たる枝：その依頼で習う枝 */
  function mapHiFor(q) {
    return MAP.nodes.filter(function (n) { return n.L === q.L; }).map(function (n) { return n.id; });
  }
  /* 結果画面：そのレッスンで新しく開いた枝の札（1〜2枚） */
  function mapChips(nodes) {
    return '<div class="cmap-rw"><b>地図に書きこまれた</b>' + nodes.map(function (n) {
      return '<div class="cmap-chip"><i>' + esc(n.kind === 'ex' ? n.ti : n.who) + '</i><br>' + (n.kind === 'ex' ? '' : '→ ' + esc(n.op) + ' → ') + '<b>' + esHtml(n.ex) + '</b></div>';
    }).join('') + '<button class="forge2-go" type="button">🖋 形の工房</button></div>';
  }
  /* しぼった表示の「ほかの枝は 🗺 で」→ 全体の地図 */
  function mapMoreBind(root, hi) {
    var b = $('.cmap-more', root); if (b) b.addEventListener('click', function () { Sfx.tap(); mapModal(hi); });
  }
  function doMap(st) {
    var c = el('div', 'card board-tbl cmap-card' + ((st.hi || []).length ? ' cmap-focus' : ''), ((st.hi || []).length ? '' : '<div class="qtag">🗺 封蝋の地図</div>') + mapHtml(st.hi || [], { focus: true }));
    mapMoreBind(c, st.hi || []);
    boardSet(c);
    mapReveal(c, boardEl, 120);
    var me = cur;
    talk(st.x, null, 'happy', function () { if (cur === me) nextBtn(); });
  }
  $('#pMap').addEventListener('click', function () { Sfx.tap(); mapModal([]); });
  $('#zMap').addEventListener('click', function () { Sfx.tap(); mapModal([]); });
  $('#hMap').addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); mapModal([]); });

  /* =========================================================
   * 🖋 形の工房：人ごとの接続法の形を、くり返し作る（1回6問）
   *  手1 yo の形から「o を何にする？」（例外の動詞は、覚えた形を選ぶ。-car・-gar・-zar はつづりの書きかえをもう1手）
   *  手2 「この人の形は？」：同じ動詞の接続法の仲間（人ちがい）から選ぶ
   *  動詞の表と形の計算は OQ.verbs・OQ.subForms（data/verbs.js）。クリアした依頼の動詞だけ出す。
   * ========================================================= */
  var PERS = ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'];
  var workTok = 0, workAnsI = -1, workGrow = null;
  function workVerbs() { return (D.verbs || []).filter(function (v) { return lessonDone(v.L); }); }
  function workPick(n) {
    var vs = shuffle(workVerbs()), out = [], cnt = [0, 0, 0, 0, 0, 0];
    for (var i = 0; i < n && vs.length; i++) {
      var v = vs[i % vs.length];
      var ps = [0, 1, 2, 3, 4, 5].filter(function (k) { return !(v.nv === false && (k === 3 || k === 4)); });
      var min = Math.min.apply(null, ps.map(function (k) { return cnt[k]; }));
      var p = pick(ps.filter(function (k) { return cnt[k] === min; }));
      cnt[p]++;
      out.push({ v: v, p: p });
    }
    return out;
  }
  function workGo() {
    if (!workVerbs().length) return toast('🔒 第1の依頼をクリアすると、形の工房が開くよ');
    var list = workPick(6), k = 0, tok = ++workTok;
    zStop(); show('quiz'); zActive = true; zRun = newRun();
    $('#zTitle').textContent = '🖋 形の工房'; zHud.innerHTML = '';
    FX.slam('Taller', 'cyan', '人ごとの形を作ろう');
    function paint() { $('#zProg').style.width = Math.round(k / list.length * 100) + '%'; $('#zRight').innerHTML = '<small>XP</small><b>' + zRun.xp + '</b>'; }
    function one() {
      paint();
      if (k >= list.length) return end();
      var q = list[k++];
      workAsk(q, k + ' / ' + list.length, tok, function (ok) {
        /* まちがえたら、同じ動詞の別の人の形をもう1問 */
        if (!ok && !q.extra) { var ps = [0, 1, 2, 3, 4, 5].filter(function (x) { return x !== q.p && !(q.v.nv === false && (x === 3 || x === 4)); }); list.push({ v: q.v, p: pick(ps), extra: true }); }
        paint();
        T2.next(one, k < list.length ? '▶ つぎへ' : '▶ おわり！');
      });
    }
    function end() {
      zStop(); touchDay();
      var up = addXp(zRun.xp + 20); zRun.xp += 20; save();
      var acc = zRun.ok / Math.max(1, zRun.ok + zRun.ng), g = workGrow; workGrow = null;
      showResult({ title: acc === 1 ? 'Perfecto' : 'Taller, hecho', sub: '🖋 形の工房 ' + list.length + '問', stars: acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1, run: zRun, up: up,
        note: 'まちがえた動詞は、別の人の形でもう1問ふえている。yo の形 → o を反対の母音 → 人ごとの語尾、を毎回たどれたかな。', retry: { label: '🖋 もう6問', fn: workGo },
        next: g ? { label: '⚓ 港町へもどる（町がにぎわう！）', fn: function () { home({ grow: g }); } } : null, noHome: !!g });
    }
    one();
  }
  /* 1問：手1（o を何に／例外の形）→（つづり）→ 手2（人の形）。finish(ok) は1回だけ */
  function workAsk(q, tag, tok, finish) {
    var v = q.v, F = D.subForms(v), form = F[q.p], ar = /ar$/.test(v.inf), errs = 0;
    var c = zCard(); c.classList.add('forge2');
    c.innerHTML = '<div class="qtag">🖋 形の工房 <em>' + esc(tag) + '</em></div>' +
      '<p class="forge2-ask"><b>' + esc(v.inf) + '</b>（' + esc(v.ja) + '）を、<b>' + esc(PTAG[PERS[q.p]]) + '</b> の接続法に</p>' +
      '<div class="forge2-word">' + esHtml(v.yo) + '</div><p class="forge2-step"></p><div class="qres"></div>';
    var Wd = $('.forge2-word', c);
    function alive() { return tok === workTok && zActive; }
    function setW(s) { Wd.innerHTML = esHtml(s); FX.pop(Wd, 1.15); }
    function hand(prompt, items, why, ok) {
      var ans = -1; items.forEach(function (x, i) { if (x.ok) ans = i; });
      $('.forge2-step', c).innerHTML = prompt;
      workAnsI = ans;
      T2.options(shuffle(items.map(function (x, i) { return { label: x.label, i: i }; })), function (i, b, wrap) {
        markOpts(wrap, ans, i); workAnsI = -1;
        if (i === ans) { Sfx.whoosh(); return ok(); }
        errs++; miss(zRun, c); c.classList.add('is-ng');
        $('.qres', c).innerHTML = '<b class="rk ng">❌ 正解は「' + esc(items[ans].label) + '」</b><p class="forge2-why">' + why + '</p>';
        later(function () { if (alive()) finish(false); }, 350);
      }, 'forge2-opts' + (items.length >= 4 ? ' two' : ''));
    }
    function complete() {
      workAnsI = -1; T2.clear();
      Wd.innerHTML = '<span class="r-cmd">' + esc(form) + '</span>'; FX.pop(Wd, 1.35);
      $('.qres', c).innerHTML = '<div class="ja-line">' + esc(PTAG[PERS[q.p]]) + '：' + esc(v.inf) + '（' + esc(v.ja) + '）</div>';
      c.classList.add('is-ok');
      hit(zRun, Wd);
      later(function () {
        if (!alive()) return;
        FX.slam(form, 'gold'); sfxDivine();
        var p = FX.at(Wd); FX.rays(p.x, p.y); FX.burst(p.x, p.y, { pal: 'divine', n: 40, sp: 9, ring: true });
        autoSay(form);
      }, 250);
      later(function () { if (alive()) finish(true); }, 1000);
    }
    /* 手2：人ごとの形。選択肢は同じ動詞の接続法の仲間（よくある取りちがえ：人ちがい） */
    function h2() {
      var others = shuffle(F.filter(function (x) { return x !== form; }).filter(function (x, i, a) { return a.indexOf(x) === i; })).slice(0, 3);
      var items = [{ label: form, ok: true }].concat(others.map(function (x) { return { label: x }; }));
      hand('<b>' + esc(PTAG[PERS[q.p]]) + '</b> の形は？', items,
        '語尾は人ごとのいつもの語尾（-s・-mos・-is・-n）。' + esc(PERS[q.p]) + ' → ' + esc(form),
        function () { setW('^' + form + '^'); later(function () { if (alive()) complete(); }, 450); });
    }
    /* つづりの書きかえ（-car・-gar・-zar） */
    function hSpell() {
      var t = /car$/.test(v.inf) ? 'car' : /gar$/.test(v.inf) ? 'gar' : 'zar', stem = v.yo.slice(0, -1), naive = stem + 'e';
      hand(t === 'gar' ? 'このままだと <b>' + esc(naive) + '</b> の「ge」は「ヘ」と読める。「グ」の音を残すには？'
        : t === 'car' ? 'このままだと <b>' + esc(naive) + '</b> の「ce」は「セ」と読める。「ク」の音を残すには？'
        : 'z は e の前で書きかえるきまり。<b>' + esc(naive) + '</b> はどう書く？',
        [{ label: F[0], ok: true }, { label: naive }],
        t === 'gar' ? '「グ」の音を残すため、g のあとに u を入れる。' : t === 'car' ? '「ク」の音を残すため、c を qu に書きかえる。' : 'z は e の前では c と書く。',
        function () { setW('^' + F[0] + '^'); later(function () { if (alive()) h2(); }, 450); });
    }
    /* 手1 */
    if (v.ex === 'oy' || v.ex === 'own') {
      $('.forge2-word', c).innerHTML = esHtml(v.inf);
      var bad = [v.yo, v.el].filter(function (x) { return x && x !== F[0]; });
      return hand('例外の動詞。接続法の形（yo）は？', [{ label: F[0], ok: true }].concat(bad.map(function (x) { return { label: x }; })),
        '「' + esc(F[0]) + '」は覚えた形。' + (v.ex === 'oy' ? 'yo の形（' + esc(v.yo) + '）が -oy で終わるので、o を取って作れない。' : 'この動詞は形をそのまま覚える。'),
        function () { setW('^' + F[0] + '^'); later(function () { if (alive()) h2(); }, 450); });
    }
    var vow = ar ? 'e' : 'a', sy = v.yo.slice(0, -1);
    hand('yo の形 <b>' + esc(v.yo) + '</b> から。o を何にする？', [{ label: 'o → ' + vow, ok: true }, { label: 'o → ' + (ar ? 'a' : 'e') }],
      'yo の形（' + esc(v.yo) + '）の o を、' + (ar ? '-ar だから e' : '-er・-ir だから a') + ' に → ' + esc(sy + vow),
      function () {
        setW(sy + '^' + vow + '^');
        later(function () { if (alive()) (v.ex === 'spell' ? hSpell : h2)(); }, 450);
      });
  }

  /* =========================================================
   * 🩹 あやしい所 → おさらい依頼
   *  人は1回読んだだけでは覚えきれない。復習・ボス・ラッシュ・西検チャレンジでまちがえた問題を
   *  依頼ごとに S.weak に残し、その依頼の要点（表・その説明・形を作る操作・封蝋・予想の問い・Tips）を短く回り直して、
   *  最後にまちがえた問題そのものにリベンジする。正解できた問題だけ S.weak から消える。
   * ========================================================= */
  function markWeak(run) {
    var got = {};
    (run.misses || []).forEach(function (m) {
      var q = m.q; if (!q || !q.L || !QBY[q.id]) return;
      var w = S.weak[q.L] || (S.weak[q.L] = { ids: [], at: 0 });
      if (w.ids.indexOf(q.id) < 0) w.ids.push(q.id);
      w.at = Date.now(); got[q.L] = 1;
    });
    save();
    return Object.keys(got).map(Number).sort(function (a, b) { return LESSON['L' + a].ord - LESSON['L' + b].ord; });
  }
  /* いちばんあやしい依頼（まちがえた問題が多い順・同じなら前の依頼から） */
  function weakNext() {
    var list = Object.keys(S.weak).map(Number).filter(function (no) { return LESSON['L' + no] && S.weak[no].ids.length; });
    list.sort(function (a, b) { return S.weak[b].ids.length - S.weak[a].ids.length || LESSON['L' + a].ord - LESSON['L' + b].ord; });
    return list[0] || 0;
  }
  var REMEDY_KEEP = { show: 1, forge: 1, seal: 1, ask: 1, tip: 1, map: 1 };
  function remedyLesson(no) {
    var L = LESSON['L' + no], ids = (S.weak[no] ? S.weak[no].ids : []).slice(0, 4), steps = [];
    steps.push({ t: 'say', x: oracleNo(L) + '「' + L.ti + '」で、\nまちがえた問題があったね。\n1回で覚えきれないのは、あたりまえのこと。\n要点だけ、もう一度ゆっくり見ていこう。' });
    L.steps.forEach(function (st, i) {
      var prev = L.steps[i - 1];
      if (REMEDY_KEEP[st.t] || (st.t === 'say' && !st.who && ((prev && prev.t === 'show') || String(st.x).indexOf('**') >= 0))) steps.push(st);   // 表の説明・覚えること（**）の入った説明は残す
    });
    if (ids.length) {
      steps.push({ t: 'say', x: 'では、まちがえた問題にリベンジ！\n' + ids.length + '問。さっきの要点を思い出して。' });
      ids.forEach(function (id, k) { steps.push({ t: 'q', id: id, tag: 'リベンジ ' + (k + 1) + ' / ' + ids.length }); });
    }
    return { id: 'R' + no, no: no, ord: L.ord, remedy: true, base: L, icon: '🩹', ti: L.ti, sub: 'おさらい：' + L.sub, actors: L.actors, steps: steps };
  }
  function finishRemedy() {
    var L = cur.L, run = cur.run, base = L.base, w = S.weak[base.no], fixed = 0, left = 0;
    if (w) {
      w.ids = w.ids.filter(function (id) { if (cur.qok[id] === true) { fixed++; return false; } if (cur.qok[id] === false) left++; return true; });
      if (!w.ids.length) delete S.weak[base.no];
    }
    run.xp += 20 + fixed * 10;
    touchDay();
    var up = addXp(run.xp);
    save(); cur = null;
    var more = weakNext();
    showResult({ title: left ? 'Repaso, hecho' : 'Repaso perfecto', sub: '🩹 おさらい：' + oracleNo(base) + '　' + base.ti, stars: left ? 2 : 3, run: run, up: up,
      rewards: fixed ? [{ icon: '🩹', t: 'まちがえた問題 ' + fixed + ' 問をクリア' }] : [],
      note: left ? 'まだ ' + left + ' 問があやしい。また今度、おさらいで出てくるよ。' : 'この依頼のあやしい所は、ぜんぶ消えた！ 忘れかけたころに、復習でまた出てくるよ。',
      next: more ? { label: '🩹 つぎのおさらい：' + oracleNo(LESSON['L' + more]), fn: function () { startLesson(remedyLesson(more)); } } : { label: '⚓ 港町へもどる', fn: function () { home(); } }, noHome: !more });
  }
  /* 復習でまちがえたときの「📜 ヒント」：その依頼の Tips と表 */
  function hintModal(no) {
    var L = LESSON['L' + no], tips = L.steps.filter(function (st) { return st.t === 'tip'; }), shows = L.steps.filter(function (st) { return st.t === 'show' && st.tbl; });
    modal('<h3 class="m-h">📜 ' + esc(oracleNo(L)) + '　' + esc(L.ti) + '</h3>' +
      tips.map(function (tip) { return '<div class="card tip"><b class="tip-ti">' + esc(tip.ti) + '</b><div class="tip-x">' + ja(tip.x) + '</div>' + (tip.why ? '<details><summary>なぜ？</summary><p>' + ja(tip.why) + '</p></details>' : '') + '</div>'; }).join('') +
      shows.map(function (st) { return '<div class="card board-tbl"><div class="qtag">' + esc(st.cap || '') + '</div><table class="tbl">' + st.tbl.map(function (r) { return '<tr><th class="es-cell">' + esHtml(r[0]) + '</th><td class="es-cell">' + esHtml(r[1]) + '</td></tr>'; }).join('') + '</table></div>'; }).join('') +
      '<p class="m-note">この依頼は、読み返しのあとで「🩹 おさらい」できるよ。</p>', 'hint-m');
    glossAll($('#mbody'));
  }

  /* =========================================================
   * 🎓 西検チャレンジ：試験と同じ形の20問を分野ごとに。答え合わせは最後にまとめて。
   *  分野ごとの正解数を出し、まちがえた依頼は「🩹 おさらい」へ。合格ライン 70%
   * ========================================================= */
  var TOPICS = [
    { id: 'wish', ti: '願いの que と形（-ar は e・-er・-ir は a）', L: [1, 2], n: 4 },
    { id: 'feel', ti: '気持ちの que と例外の形（vaya・sea・esté・haya）', L: [3], n: 3 },
    { id: 'doubt', ti: '疑い・必要（no creo que・es necesario que）と本当のこと', L: [4], n: 4 },
    { id: 'yet', ti: 'まだのこと・目的（cuando・antes de que・para que）', L: [5], n: 3 },
    { id: 'who', ti: 'さがしている人（busco…que・no hay nadie que）', L: [6], n: 3 },
    { id: 'tell', ti: '伝える／頼む（dile que viene・dile que venga）', L: [7], n: 3 }
  ];
  var EXAMK = { pick: 1, form: 1, mood: 1, ng: 1, bug: 1, ja: 1 };
  function topicOf(q) { for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].L.indexOf(q.L) >= 0) return TOPICS[i]; }
  function allLessonsDone() { return D.lessons.every(function (L) { return lessonDone(L.no); }); }
  function mockGo() {
    if (!allLessonsDone()) return toast('🔒 依頼をぜんぶクリアすると、西検チャレンジが開くよ');
    var list = [];
    TOPICS.forEach(function (tp) {
      var pool = D.questions.filter(function (q) { return tp.L.indexOf(q.L) >= 0 && EXAMK[q.k]; });
      /* 空所を選ぶ形（試験でいちばん多い）を先に、その中で苦手・期限切れから */
      var picks = weighted(pool.filter(function (q) { return q.k === 'pick'; })), rest = weighted(pool.filter(function (q) { return q.k !== 'pick'; }));
      picks.slice(0, Math.ceil(tp.n / 2)).concat(rest).slice(0, tp.n).forEach(function (q) { list.push(q); });
    });
    list = shuffle(list);
    var k = 0, ok = 0, got = {};
    zStop(); show('quiz'); $('#quiz').classList.add('exam'); $('#zMap').hidden = true; zActive = true; zRun = newRun();
    $('#zTitle').textContent = '🎓 西検チャレンジ'; zHud.innerHTML = '';
    FX.slam('Examen', 'gold', '試験と同じ形で ' + list.length + '問');
    function paint() { $('#zProg').style.width = Math.round(k / list.length * 100) + '%'; $('#zRight').innerHTML = '<small>問</small><b>' + Math.min(k + 1, list.length) + '/' + list.length + '</b>'; }
    function one() {
      paint();
      if (k >= list.length) return end();
      var q = list[k++], c = zCard();
      renderQ(q, c, T2, { run: zRun, fast: true, tag: '第' + k + '問' }, function (good) {
        if (good) { ok++; zRun.ok++; } else zRun.ng++;
        got[q.id] = good;
        srs(q, good); save();
        later(one, 450);
      });
    }
    function end() {
      zStop();
      var weak = markWeak(zRun);
      var pct = Math.round(ok / list.length * 100), pass = pct >= 70, best = S.mockBest || 0;
      S.mockBest = Math.max(best, pct);
      var tix = pct >= 90 ? 5 : pass ? 3 : 1;
      S.tickets += tix;
      touchDay();
      zRun.xp = ok * 10 + (pass ? 50 : 0);
      var up = addXp(zRun.xp); save();
      var rows = TOPICS.map(function (tp) {
        var qs = list.filter(function (q) { return topicOf(q) === tp; }), n = qs.filter(function (q) { return got[q.id]; }).length, all = qs.length;
        return '<div class="tp' + (n < all ? ' weak' : '') + '"><div class="tp-h"><b>' + esc(tp.ti) + '</b><span>' + n + ' / ' + all + '</span></div><span class="tp-bar"><i style="width:' + Math.round(n / all * 100) + '%"></i></span></div>';
      }).join('');
      showResult({ title: pct >= 90 ? 'Excelente' : pass ? 'Aprobado' : 'もう一歩', sub: '🎓 西検チャレンジ（合格ライン 70%）', lose: !pass, run: zRun, up: up, openMisses: true, weak: weak,
        big: [pct + '%', ok + ' / ' + list.length + ' 問正解' + (pct > best ? '　自己ベスト更新！' : '　自己ベスト ' + S.mockBest + '%')],
        rewards: [{ icon: '🎟', t: (pass ? '合格' : 'チャレンジ') + ' +' + tix }],
        extra: '<div class="topics"><h3>分野ごとの結果</h3>' + rows + '</div>',
        retry: { label: '🎓 もう一回（問題は入れかわる）', fn: mockGo } });
    }
    one();
  }

  /* ----- 切手で練習（🎧聞き取り・🧩並べ替え） ----- */
  function cardQ(c, kind) {
    var s = plain(c.es);
    if (kind === 'build') return { id: 'card:' + c.id + ':b', k: 'build', s: s, d: [], ja: c.ja, card: c.id };
    var others = shuffle(D.cards.filter(function (x) { return x.id !== c.id && plain(x.es) !== s; }))
      .sort(function (a, b) { return (b.L === c.L) - (a.L === c.L); }).slice(0, 2);
    return { id: 'card:' + c.id + ':l', k: 'listen', s: s, o: [s].concat(others.map(function (x) { return plain(x.es); })), a: 0, ja: c.ja, card: c.id };
  }
  function ownedCards() { return D.cards.filter(function (c) { return S.cards[c.id]; }); }
  function cardGo(ids) {
    var cards = ids ? ids.map(function (id) { return CARD[id]; })
      : shuffle(ownedCards()).sort(function (a, b) { return (S.cardp[a.id] || 0) - (S.cardp[b.id] || 0); }).slice(0, 5);
    if (!cards.length) return toast('📮 切手を手に入れると、切手で練習できるよ');
    var list = [], k = 0, full = !ids;
    cards.forEach(function (c) { list.push(cardQ(c, 'listen'), cardQ(c, 'build')); });
    $('#modal').hidden = true;
    zStop(); show('quiz'); zActive = true; zRun = newRun();
    $('#zTitle').textContent = '📮 切手で練習'; zHud.innerHTML = '';
    FX.slam('Práctica', 'cyan', '🎧 聞き取り ・ 🧩 並べ替え');
    function paint() { $('#zProg').style.width = Math.round(k / list.length * 100) + '%'; $('#zRight').innerHTML = '<small>XP</small><b>' + zRun.xp + '</b>'; }
    function one() {
      paint();
      if (k >= list.length) return end();
      var q = list[k++], c = zCard();
      renderQ(q, c, T2, { tag: k + ' / ' + list.length + '　' + CARD[q.card].icon + ' ' + CARD[q.card].name, run: zRun }, function (ok) {
        if (ok) { S.cardp[q.card] = (S.cardp[q.card] || 0) + 1; hit(zRun, $('.chosen', T2.el) || c); } else miss(zRun, c);
        save(); paint();
        later(function () { T2.next(one, k < list.length ? '▶ つぎへ' : '▶ おわり！'); }, 250);
      });
    }
    function end() {
      zStop();
      var rewards = [];
      if (full) { S.tickets += 1; rewards.push({ icon: '🎟', t: '切手の練習やりきり +1' }); }
      touchDay();
      zRun.xp += 10;
      var up = addXp(zRun.xp); save();
      var acc = zRun.ok / list.length;
      showResult({ title: acc === 1 ? 'Perfecto' : 'Práctica, hecha', sub: '切手で練習 ' + list.length + '問', stars: acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1, run: zRun, rewards: rewards, up: up,
        note: '練習で正解した切手は、切手帳に 🎧 の回数がつくよ。まだ練習していない切手から順に出る。',
        retry: { label: '📮 もう一回', fn: function () { cardGo(ids); } }, next: { label: '📖 切手帳へ', fn: function () { dexScreen('cards'); } } });
    }
    one();
  }

  /* ----- 依頼ごとに5枚そろえるとボーナス ----- */
  var SET_TIX = 3, SET_XP = 50;
  function setRewards() {
    var got = [];
    D.lessons.forEach(function (L) {
      var mine = D.cards.filter(function (c) { return c.L === L.no; });
      if (!mine.length || S.sets[L.no] || !mine.every(function (c) { return S.cards[c.id]; })) return;
      S.sets[L.no] = Date.now(); S.tickets += SET_TIX; S.xp += SET_XP;
      got.push({ icon: '🏆', t: oracleNo(L) + ' の切手5枚コンプリート！ 🎟+' + SET_TIX + '・+' + SET_XP + ' XP', set: L.no });
    });
    return got;
  }
  function setFx(got) {
    if (!got.length) return;
    later(function () { FX.slam('Completo', 'gold', '切手が5枚そろった'); FX.confetti(140, 'gold'); Sfx.levelUp(); }, 600);
  }

  /* =========================================================
   * 切手の市（ガチャ）：町に新しい切手が届く（お金はからまない。チケットは学習でもらえる）
   * ========================================================= */
  var RATE = [['SSR', 5], ['SR', 13], ['R', 30], ['N', 52]];
  function roll(minSR) {
    var pool = cardPool(), x = Math.random() * 100, r = 'N', acc = 0;
    for (var i = 0; i < RATE.length; i++) { acc += RATE[i][1]; if (x < acc) { r = RATE[i][0]; break; } }
    if (minSR && (r === 'N' || r === 'R')) r = 'SR';
    var order = ['SSR', 'SR', 'R', 'N'], k = order.indexOf(r), list = [];
    while (!list.length && k < order.length) { var rr = order[k++]; list = pool.filter(function (c) { return c.r === rr; }); }
    if (!list.length) list = pool;
    return list[Math.floor(Math.random() * list.length)];
  }
  function gachaScreen() {
    show('gacha');
    var pool = cardPool(), own = Object.keys(S.cards).length;
    var g = $('#gacha');
    g.innerHTML = '<header class="pbar"><button class="x" id="gBack" aria-label="もどる">←</button><div class="pmid"><b>✨ 切手の市</b></div><div class="pxp"><small>🎟</small><b>' + S.tickets + '</b></div></header>' +
      '<div class="gacha"><div class="altar" id="gm"><div class="orb"><i></i><i></i><i></i></div><div class="pedestal"></div></div>' +
      '<p class="g-info">封筒を開けると、新しい切手が出てくる。<br>クリアした依頼の切手が出るよ（いま ' + pool.length + ' 種類）。切手 ' + own + ' / ' + D.cards.length + '</p>' +
      '<div class="g-btns"><button class="tb go" id="g1">1通あける <small>🎟1</small></button><button class="tb gold" id="g10">10通まとめて <small>🎟10・SR以上1枚確定</small></button></div>' +
      '<p class="g-rate">出る確率：SSR 5%・SR 13%・R 30%・N 52%（UR はボスの日を越えたときだけ）<br>もう持っている切手が来たら +15 XP<br>🏆 依頼ごとに切手5枚そろえると 🎟+3・+50 XP</p><div id="gOut"></div></div>';
    $('#gBack').addEventListener('click', function () { home(); });
    $('#g1').addEventListener('click', function () { pull(1); });
    $('#g10').addEventListener('click', function () { pull(10); });
  }
  var pulling = false;
  function pull(n) {
    if (pulling) return;
    if (!cardPool().length) return toast('🔒 第1の依頼をクリアすると、切手の市が開くよ');
    if (S.tickets < n) return toast('🎟 チケットが足りない！ 依頼・ボス・ミッション・ラッシュでもらえるよ');
    pulling = true;
    S.tickets -= n; S.pulls += n;
    var got = [];
    for (var i = 0; i < n; i++) got.push(roll(n === 10 && i === 9 && !got.some(function (c) { return c.r === 'SR' || c.r === 'SSR'; })));
    var dupXp = 0, news = 0;
    got.forEach(function (c) { if (S.cards[c.id]) dupXp += 15; else news++; S.cards[c.id] = (S.cards[c.id] || 0) + 1; });
    var up = dupXp ? addXp(dupXp) : 0;
    var sets = setRewards();
    save();
    var top = got.reduce(function (m, c) { return 'N R SR SSR'.split(' ').indexOf(c.r) > 'N R SR SSR'.split(' ').indexOf(m) ? c.r : m; }, 'N');
    var m = $('#gm'), out = $('#gOut');
    out.innerHTML = '';
    m.className = 'altar pray t-' + RCOL[top];
    var k = 0;
    (function rattle() {
      if (k < 4) { Sfx.chestShake(); FX.shake(m); k++; later(rattle, 280); return; }
      m.className = 'altar t-' + RCOL[top];
      var p = FX.at(m); FX.rays(p.x, p.y, top === 'SSR' ? '#ffd23f' : top === 'SR' ? '#ff8fd0' : '#9be7ff'); sfxDivine();
      if (top === 'SSR') { FX.flash('#ffd23f'); FX.slam('!?', 'gold'); }
      var cap = el('button', 'capsule t-' + RCOL[top], '<span>封を切る</span>');
      out.appendChild(cap); FX.pop(cap, 1.3);
      cap.addEventListener('click', function () {
        cap.remove();
        var grid = el('div', 'g-grid' + (n === 1 ? ' one' : ''));
        got.forEach(function (c) { grid.insertAdjacentHTML('beforeend', cardHtml(c, true)); });
        out.appendChild(grid);
        $$('.pcard', grid).forEach(function (nc, i) {
          var id = nc.getAttribute('data-c');
          if (S.cards[id] === 1 && got.filter(function (c) { return c.id === id; }).length === 1) nc.insertAdjacentHTML('beforeend', '<em class="newtag">NEW</em>');
          nc.addEventListener('click', function () { flipCard(nc); });
          later(function () { flipCard(nc); }, 300 + i * 260);
        });
        later(function () {
          out.insertAdjacentHTML('beforeend', '<p class="g-sum">新しい切手 <b>' + news + '</b> 枚' + (dupXp ? '　かぶり → <b>+' + dupXp + ' XP</b>' : '') + '</p>' +
            sets.map(function (g) { return '<p class="g-set">' + g.icon + ' ' + esc(g.t) + '</p>'; }).join('') +
            '<div class="tbs"><button class="tb go" id="gIsle">⚓ 港町へ</button><button class="tb sub" id="gDex">📮 切手で練習</button></div>');
          $('#gIsle').addEventListener('click', function () { Sfx.tap(); home(); });
          $('#gDex').addEventListener('click', function () { Sfx.tap(); dexScreen('cards'); });
          setFx(sets);
          $('.pxp b', $('#gacha')).textContent = S.tickets;
          pulling = false;
          if (up) levelUp(up);
        }, 400 + got.length * 260);
      });
    })();
  }

  /* =========================================================
   * 📖 帳面（目次・切手帳・Tips）
   * ========================================================= */
  function dexScreen(tab) {
    tab = tab || 'book';
    show('dex');
    var d = $('#dex');
    var own = D.cards.filter(function (c) { return S.cards[c.id]; }).length, tips = TIPS.filter(function (t) { return S.tips[t.tip.id]; }).length;
    d.innerHTML = '<header class="pbar"><button class="x" id="dBack" aria-label="もどる">←</button><div class="pmid"><div class="tabs">' +
      '<button data-tab="book" class="' + (tab === 'book' ? 'on' : '') + '">📖 帳面</button><button data-tab="cards" class="' + (tab === 'cards' ? 'on' : '') + '">📮 切手 ' + own + '</button><button data-tab="tips" class="' + (tab === 'tips' ? 'on' : '') + '">📜 Tips ' + tips + '</button></div></div></header><div class="dex-body"></div>';
    $('#dBack').addEventListener('click', function () { home(); });
    $$('.tabs button', d).forEach(function (b) { b.addEventListener('click', function () { Sfx.tap(); dexScreen(b.getAttribute('data-tab')); }); });
    var body = $('.dex-body', d);
    if (tab === 'tips') {
      body.innerHTML = '<div class="card cmap-card"><div class="qtag">🗺 封蝋の地図　' + mapOpenN() + ' / ' + MAP.nodes.length + '</div>' + mapHtml([]) + '</div>' +
        '<p class="dex-note">依頼で手に入れたコツ。</p>' + TIPS.map(function (t) {
        var st = t.tip, have = S.tips[st.id];
        return have ? '<div class="card tip"><div class="tip-h"><span>' + esc(oracleNo(t.L)) + '</span></div><b class="tip-ti">' + esc(st.ti) + '</b><div class="tip-x">' + ja(st.x) + '</div>' + (st.why ? '<details><summary>なぜ？</summary><p>' + ja(st.why) + '</p></details>' : '') + '</div>'
          : '<div class="card tip locked"><b class="tip-ti">？？？</b><small>' + esc(oracleNo(t.L)) + ' でゲット</small></div>';
      }).join('');
      glossAll(body);
      return;
    }
    if (tab === 'book') {
      var ni = nextIdx(), html = '<p class="dex-note">これまでの依頼の記録。クリアした依頼は、何度でもやり直せるよ。</p>';
      D.days.forEach(function (dd) {
        var nodes = ORDER.map(function (n, i) { return { n: n, i: i }; }).filter(function (x) { return x.n.day === dd.d; });
        html += '<div class="day"><div class="day-h"><b>DÍA ' + dd.d + '</b><span>' + esc(dd.ti) + '</span><small>' + esc(dd.x) + '</small></div><div class="nodes">';
        nodes.forEach(function (x) {
          var n = x.n, done = nodeDone(n), open = nodeOpen(x.i), now = x.i === ni;
          var st = (done ? ' done' : '') + (open ? '' : ' lock') + (now ? ' now' : '');
          if (n.type === 'L') {
            var L = LESSON[n.id], rec = S.lessons[n.id];
            html += '<button class="node' + st + '" data-i="' + x.i + '"><span class="ni">' + (open ? L.icon : '🔒') + '</span><span class="nt"><small>' + esc(oracleNo(L)) + '</small>' + (open ? esc(L.ti) + '<em>' + esc(L.sub) + '</em>' : '？？？') + '</span>' +
              (rec ? '<span class="ns">' + [1, 2, 3].map(function (k) { return k <= rec.stars ? '★' : '☆'; }).join('') + '</span>' : '') + '</button>';
          } else {
            var B = BOSS[n.id], br = S.bosses[n.id];
            html += '<button class="node boss' + st + '" data-i="' + x.i + '" style="--bc:' + B.col + '"><span class="ni">' + (open ? '✉' : '🔒') + '</span><span class="nt"><small>' + (B.final ? '最後の夜' : '試しの日') + '</small>' + (open ? esc(B.name) : '？？？') + '</span>' +
              (br && br.win ? '<span class="ns rk">' + br.rank + '</span>' : '') + '</button>';
          }
        });
        var lastDay = dd.d === D.days[D.days.length - 1].d;
        if (!nodes.length || lastDay) html += '<div class="extra"><button class="mini" data-act="review">🔁 読み返し</button><button class="mini" data-act="work">🖋 形の工房</button><button class="mini" data-act="rush">⚡ ラッシュ</button>' + (lastDay ? '<button class="mini" data-act="mock">🎓 西検チャレンジ</button>' : '') + '</div>';
        html += '</div></div>';
      });
      body.innerHTML = html;
      $$('.node', body).forEach(function (b) { b.addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); openNode(+b.getAttribute('data-i')); }); });
      $$('.mini', body).forEach(function (b) { b.addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); var a = b.getAttribute('data-act'); if (a === 'review') reviewGo(); else if (a === 'mock') mockGo(); else if (a === 'work') workGo(); else rushIntro(); }); });
      return;
    }
    var html2 = '<button class="tb go" id="dPractice"' + (own ? '' : ' disabled') + '>📮 切手で練習 <small>切手の文で 🎧聞き取り・🧩並べ替え 10問</small></button>' +
      '<p class="dex-note">切手をタップすると、その1枚だけで練習もできるよ。<br>🏆 依頼ごとに5枚そろえると 🎟+3・+50 XP</p>';
    D.lessons.forEach(function (L) {
      var mine = D.cards.filter(function (c) { return c.L === L.no; }), have = mine.filter(function (c) { return S.cards[c.id]; }).length;
      html2 += '<h3 class="dex-h">' + esc(oracleNo(L)) + (S.sets[L.no] ? '<span class="set done">🏆 COMPLETE</span>' : '<span class="set">' + have + ' / ' + mine.length + '</span>') + '</h3><div class="dex-grid">' + mine.map(slot).join('') + '</div>';
    });
    html2 += '<h3 class="dex-h">👑 ボスに勝った記念切手（UR）</h3><div class="dex-grid">' + D.cards.filter(function (c) { return c.boss; }).map(slot).join('') + '</div>';
    body.innerHTML = html2;
    $('#dPractice').addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); cardGo(); });
    function slot(c) {
      var n = S.cards[c.id], p = S.cardp[c.id];
      return n ? '<button class="slot rr-' + RCOL[c.r] + '" data-c="' + c.id + '"><span class="pc-r">' + c.r + '</span><span class="sl-ico">' + c.icon + '</span><span class="sl-nm">' + esc(c.name) + '</span>' + (n > 1 ? '<em>×' + n + '</em>' : '') + (p ? '<i class="sl-p">🎧' + p + '</i>' : '') + '</button>'
        : '<div class="slot none"><span>？</span></div>';
    }
    $$('button.slot', body).forEach(function (b) {
      b.addEventListener('click', function () {
        var c = CARD[b.getAttribute('data-c')];
        modal(cardHtml(c, false) + '<p class="m-note">出た回数：' + S.cards[c.id] + '　練習で正解：' + (S.cardp[c.id] || 0) + '回</p>' +
          '<div class="tbs m-btns"><button class="tb go" id="mPractice">🎧 聞き取り ＋ 🧩 並べ替え</button></div>', 'card-m');
        $('#mPractice').addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); cardGo([c.id]); });
        glossEs($('#mbody .pcard')); autoSay(c.es);
      });
    });
  }

  function modal(html, cls) {
    var m = $('#modal'); $('#mbody').innerHTML = html; m.className = cls || ''; m.hidden = false;
    stopAuto();   // 何か開いたら、ホームの自動スタートは止める（後ろで勝手に始まらないように）
    var box = $('.mbox', m); if (box.animate && !FX.RM) box.animate([{ transform: 'scale(.7)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.2,1.5,.4,1)' });
  }
  $('#modal').addEventListener('click', function (e) { if (e.target.id === 'modal' || e.target.closest('.mclose')) { $('#modal').hidden = true; Speech.stop(); } });

  /* =========================================================
   * ホーム（港町の景色）
   *  次の依頼は、町の人の頼みごととして出る。クリア直後は町がにぎわう演出 → 数秒で次の依頼が自動スタート
   * ========================================================= */
  function openNode(i) {
    if (!nodeOpen(i)) return toast('🔒 前の依頼をクリアすると開くよ');
    var n = ORDER[i];
    if (n.type === 'L') startLesson(LESSON[n.id]); else bossIntro(BOSS[n.id]);
  }
  var autoT = 0, homeGen = 0;
  function stopAuto() { clearInterval(autoT); autoT = 0; var c = $('#hCta'); if (c) c.classList.remove('counting'); var s = $('#hStop'); if (s) s.hidden = true; }
  function home(opts) {
    opts = opts || {};
    zStop(); cur = null; show('home'); setHour();
    var gen = ++homeGen;   // 前のホームの演出（町がにぎわう・自動スタート）は、ここで無効になる
    var sets = setRewards();
    if (sets.length) { save(); setFx(sets); toast(sets.map(function (g) { return g.icon + ' ' + esc(g.t); }).join('<br>')); }
    var L = levelOf(S.xp);
    $('#hLvN').textContent = L.lv; $('#hLvBar').style.width = Math.round(L.cur / L.need * 100) + '%'; $('#hLvTi').textContent = titleOf(L.lv) + '　あと ' + (L.need - L.cur) + ' XP';
    $('#hStreak b').textContent = S.streak.last === today() || S.streak.last === ymd(Date.now() - DAY) ? S.streak.n : 0;
    $('#hTix b').textContent = S.tickets;

    var growId = opts.grow, ni = nextIdx();
    var isle = $('#isle');
    isle.className = 'isle ' + skyOf();
    isle.innerHTML = islandHtml(growId);
    var popEl = $('#hPop b'), popNow = population(), popOld = growId ? popNow - (W.pop[growId] || 0) : popNow;
    popEl.textContent = num(popOld);

    /* 次の依頼（町の人の頼みごと）／ボス（あやしい影） */
    var cta = $('#hCta'), evEl = $('#hEv');
    cta.onclick = null; $('#hSkip').onclick = null;   // 前のホームのボタンの動きを残さない（このあと付け直す）
    evEl.innerHTML = ''; evEl.className = 'ev';
    if (ni < 0) {
      cta.innerHTML = '<small>港町の手紙 ぜんぶ完了</small>⚡ ラッシュでハイスコア！';
      cta.className = 'cta';
      evEl.innerHTML = '<span class="ev-f">🕊️</span><p>おつかれさま、代書人さん！<br>読み返しとラッシュで、腕をみがこう。</p>';
    } else if (ORDER[ni].type === 'B') {
      var B = BOSS[ORDER[ni].id];
      cta.innerHTML = '<small>試しの日</small>' + esc(B.name);
      cta.className = 'cta boss';
      evEl.className = 'ev danger';
      evEl.innerHTML = '<p>「' + esc(B.line) + '」</p>';
    } else {
      var NL = LESSON[ORDER[ni].id], who = D.people[NL.ev.who];
      cta.innerHTML = '<small>✉️ ' + esc(oracleNo(NL)) + '</small>' + esc(NL.ti);
      cta.className = 'cta';
      evEl.innerHTML = '<p><b>' + esc(who.n) + '</b>' + esc(NL.ev.line) + '</p>';
    }
    var go = function () { if (ni < 0) { if ((S.mockBest || 0) < 70) mockGo(); else rushIntro(); } else openNode(ni); };
    if (ni < 0) {
      cta.innerHTML = (S.mockBest || 0) < 70 ? '<small>🎓 仕上げ（合格ライン 70%）</small>西検チャレンジ 20問' : '<small>🎓 西検チャレンジ 合格！ 自己ベスト ' + S.mockBest + '%</small>⚡ ラッシュでハイスコア！';
      evEl.innerHTML = '<span class="ev-f">🕊️</span><p>' + ((S.mockBest || 0) < 70 ? '港町の手紙、ぜんぶ届いたね！<br>仕上げは、試験と同じ形の20問。合格ラインは 70% だよ。' : '西検チャレンジ合格！<br>あとは忘れないように、読み返しとラッシュで。') + '</p>';
    }
    var wk = weakNext(), skip = $('#hSkip');
    skip.hidden = true;
    if (wk) {
      var WL = LESSON['L' + wk];
      cta.innerHTML = '<small>🩹 先におさらい（まちがえた問題 ' + S.weak[wk].ids.length + ' 問）</small>' + esc(oracleNo(WL)) + '　' + esc(WL.ti);
      cta.className = 'cta remedy';
      evEl.className = 'ev';
      evEl.innerHTML = '<span class="ev-f">🕊️</span><p><b>パロマ</b>' + esc(oracleNo(WL)) + 'で、まちがえた問題があったよ。1回で覚えきれないのは、あたりまえ。要点だけ、さっともう一度！</p>';
      skip.hidden = false;
      skip.textContent = ni < 0 ? 'おさらいはあとで（西検チャレンジ・ラッシュへ）' : 'おさらいはあとで → ' + nodeLabel(ORDER[ni]).replace(/^⚔ /, '');
      skip.onclick = function () { Sfx.unlock(); Sfx.tap(); stopAuto(); go(); };
    }
    cta.onclick = function () { Sfx.unlock(); Sfx.tap(); stopAuto(); if (wk) startLesson(remedyLesson(wk)); else go(); };

    var unlocked = unlockedQs().length > 0, due = dueQs().length;
    $('#hDue').innerHTML = !unlocked ? '🔒' : due ? '<em>' + due + '</em> 問' : 'OK';
    $('#hRushBest').textContent = unlocked ? 'BEST ' + S.rushBest : '🔒';
    $('#hGachaN').textContent = '🎟 ' + S.tickets;
    $('#hWorkN').textContent = workVerbs().length ? workVerbs().length + '語' : '🔒';
    $('#hBookN').textContent = Object.keys(S.cards).length + '枚';
    $('#hMapN').textContent = mapOpenN() + '/' + MAP.nodes.length;
    $('#hMockN').textContent = allLessonsDone() ? (S.mockBest ? 'BEST ' + S.mockBest + '%' : '20問') : '🔒';
    $('#hMock').classList.toggle('alert', allLessonsDone() && (S.mockBest || 0) < 70);
    $('#hReview').classList.toggle('alert', due >= 3);
    $('#hGacha').classList.toggle('alert', S.tickets > 0 && cardPool().length > 0);
    var m = mis(), md = MIS.filter(function (x) { return m.done[x.id]; }).length;
    $('#hMis').innerHTML = '📅 今日のミッション <b>' + MIS.map(function (x) { return m.done[x.id] ? '●' : '○'; }).join('') + '</b>' + (m.bonus ? ' コンプリート！' : ' <small>' + md + '/3</small>');
    $('#tgSound').checked = S.settings.sound; $('#tgSpeak').checked = S.settings.speak; $('#tgAuto').checked = S.settings.auto;

    if (growId) growFx(growId, popOld, popNow, ni, gen);
    else { evEl.classList.add('on'); }
  }
  /* 町がにぎわう演出 → 次の依頼の頼みごと → 自動スタート */
  function growFx(id, popOld, popNow, ni, gen) {
    var news = $$('#isle .sp.new'), k = 0;
    var live = function () { return gen === homeGen && !$('#home').hidden; };
    later(function () { if (!live()) return; FX.slam(id === 'B3' ? '¡Qué alegría!' : 'El pueblo crece', 'gold', W.msg[id] || '町がにぎやかになった！'); sfxDivine(); }, 300);
    (function one() {
      if (!live()) return;
      if (k >= news.length) return after();
      var s = news[k++];
      s.classList.add('in');
      var p = FX.at(s); FX.burst(p.x, p.y, { pal: 'divine', n: 22, ring: true }); Sfx.coin();
      later(one, 380);
    })();
    var t0 = performance.now(), popEl = $('#hPop b');
    later(function () {
      if (!live()) return;
      FX.pop($('#hPop'), 1.3);
      (function tick(t) { var q = Math.min(1, (t - t0 - 900) / 1200); if (q < 0) q = 0; popEl.textContent = num(Math.round(popOld + (popNow - popOld) * q)); if (q < 1) requestAnimationFrame(tick); })(performance.now());
      var pp = FX.at($('#hPop')); FX.floatText(pp.x, pp.y + 10, '✉️ +' + num(popNow - popOld), '#7dffb0');
    }, 900);
    function after() {
      later(function () {
        if (!live()) return;
        var ev = $('#hEv'); ev.classList.add('on'); Sfx.whoosh();
        if ((ni < 0 && !weakNext()) || !S.settings.auto || !$('#modal').hidden) return;
        /* 自動スタート（数秒のカウント。「あとで」で止まる） */
        var cta = $('#hCta'), left = 5;
        cta.classList.add('counting'); cta.style.setProperty('--cd', '0%');
        $('#hStop').hidden = false;
        var tStart = Date.now();
        stopAuto(); cta.classList.add('counting'); $('#hStop').hidden = false;
        var me = autoT = setInterval(function () {
          /* 自分が止められた・別のホームになった・何か開いている → このタイマーは自分で消える */
          if (me !== autoT || !live() || !$('#modal').hidden) { clearInterval(me); if (me === autoT) stopAuto(); return; }
          var q = Math.min(1, (Date.now() - tStart) / (left * 1000));
          cta.style.setProperty('--cd', Math.round(q * 100) + '%');
          if (q >= 1) { stopAuto(); cta.onclick(); }
        }, 60);
      }, 700);
    }
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) stopAuto(); });
  $('#hStop').addEventListener('click', function () { Sfx.tap(); stopAuto(); toast('🕊️ 了解。つづきは、また今度ね'); });
  $('#hReview').addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); reviewGo(); });
  $('#hRush').addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); rushIntro(); });
  $('#hMock').addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); mockGo(); });
  $('#hGacha').addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); gachaScreen(); });
  $('#hWork').addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); workGo(); });
  $('#hBook').addEventListener('click', function () { Sfx.tap(); dexScreen('book'); });
  $('#hMis').addEventListener('click', function () {
    var m = mis();
    modal('<h3 class="m-h">📅 今日のミッション</h3><p class="m-note">' + (m.bonus ? 'コンプリート！🎉' : 'ぜんぶ達成で 🎟 +2 ボーナス') + '</p>' +
      MIS.map(function (x) { return '<div class="mi ' + (m.done[x.id] ? 'ok' : '') + '"><span>' + x.icon + '</span>' + x.ti + '<b>' + (m.done[x.id] ? '✔' : '🎟1') + '</b></div>'; }).join(''));
  });
  $('#isle').addEventListener('click', function (e) {
    var f = e.target.closest('.folk');
    if (!f) return;
    var p = D.people[f.getAttribute('data-who')];
    FX.pop(f, 1.5); Sfx.tap();
    showPop(f, '<b class="pw">' + esc(p.n) + '</b><span>' + esc(p.d) + '</span>');
  });
  $('#hLv').addEventListener('click', function () {
    var L = levelOf(S.xp);
    modal('<div class="lvinfo"><b>ランク Lv.' + L.lv + '　' + esc(titleOf(L.lv)) + '</b><p>XP 合計 ' + S.xp + '　✉️ 届いた手紙 ' + num(population()) + '</p><ul>' + TITLES.map(function (t) { return '<li class="' + (L.lv >= t[0] ? 'on' : '') + '">Lv.' + t[0] + '　' + t[1] + '</li>'; }).join('') + '</ul></div>');
  });
  $('#tgSound').addEventListener('change', function (e) { S.settings.sound = e.target.checked; save(); if (e.target.checked) { Sfx.unlock(); Sfx.coin(); } });
  $('#tgSpeak').addEventListener('change', function (e) { S.settings.speak = e.target.checked; save(); if (e.target.checked) Speech.say('¡Hola!'); });
  $('#tgAuto').addEventListener('change', function (e) { S.settings.auto = e.target.checked; save(); });
  $('#hReset').addEventListener('click', function () {
    if (!confirm('記録をぜんぶ消しますか？（ランク・切手・クリア記録）')) return;
    if (!confirm('本当に消しますか？ もとに戻せません。')) return;
    S = fresh(); save(); home(); toast('記録をリセットしました');
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[role=button]')) { e.preventDefault(); e.target.click(); }
  });
  if (SANDBOX) document.body.classList.add('sandbox');
  /* 不具合しらべ用：?debug で、画面の左上に「1秒のコマ数・いちばん長いコマ・エラー」を出す（実機でスクリーンショットをもらうため） */
  if (/[?&]debug\b/.test(location.search)) (function () {
    var box = el('div', '', ''), errs = [], n = 0, worst = 0, last = performance.now(), t0 = last;
    box.style.cssText = 'position:fixed;left:4px;top:4px;z-index:999;pointer-events:none;padding:2px 6px;border-radius:6px;background:rgba(0,0,0,.75);color:#7dffb0;font:11px/1.4 monospace;white-space:pre;max-width:90vw;overflow:hidden';
    document.body.appendChild(box);
    addEventListener('error', function (e) { errs.push(String(e.message).slice(0, 80)); });
    addEventListener('unhandledrejection', function (e) { errs.push('promise: ' + String(e.reason).slice(0, 70)); });
    (function f(t) {
      n++; worst = Math.max(worst, t - last); last = t;
      if (t - t0 >= 1000) {
        box.textContent = 'fps ' + Math.round(n * 1000 / (t - t0)) + '  最長 ' + Math.round(worst) + 'ms  ' + document.body.dataset.screen + '  町の絵 ' + $$('#isle .sp').length + (errs.length ? '\n⚠ ' + errs.slice(-3).join('\n⚠ ') : '');
        n = 0; worst = 0; t0 = t;
      }
      requestAnimationFrame(f);
    })(last);
  })();
  /* 動作確認用：?sandbox で window.__ojala（状態の参照・クリア記録の書きかえ） */
  if (SANDBOX) window.__ojala = { S: function () { return S; }, save: save, home: home, start: function (id) { startLesson(LESSON[id]); }, boss: function (id) { bossIntro(BOSS[id]); }, finish: function () { if (cur) { cur.i = cur.L.steps.length; step(); } }, cur: function () { return cur; }, Q: QBY, MOOD: MOOD,
    work: function () { workGo(); }, workAns: function () { return workAnsI; }, sealAns: function () { return sealAns; },
    testQ: function (id) { zStop(); show('quiz'); zRun = newRun(); renderQ(QBY[id], zCard(), T2, {}, function () {}); } };
  home();
})();
