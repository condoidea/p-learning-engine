/* =========================================================
 * ¡MANDA! — スペイン語の命令表現（西検4級）
 *
 *  エンジンを使わない独立アプリ（relativo/ と同じ考え方）。
 *   ホーム＝島の景色。次の「神託」（レッスン）が島の人の頼みごととして自動で出てくる（目次は 📖 創世記 の中に隠す）。
 *   レッスン＝場面（島の人たち）・ボード（表・例文・問題）・ブーホのセリフ・下のボタン。命令が届くと島の人が動く。
 *   クリア → 島が育つ（物が現れる・人口がふえる）→ 次の神託が数秒で自動スタート
 *   ほかに ⚡ラッシュ（60秒）・🔁祈り（間隔反復の復習）・✨奇跡の祈り（ガチャ：島の住人カード）・📖 創世記（目次・住人図鑑・Tips）
 *  保存：localStorage 'manda.v1'（?sandbox なら 'manda.sandbox'）
 *  教材：manda/js/data/*.js、単語：shared/es-words.js
 * ========================================================= */
(function () {
  'use strict';
  var D = window.MQ, DICT = window.ES_WORDS, W = D.world;
  var DAY = 864e5;

  /* ---------- 小物 ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
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
  var KEY = SANDBOX ? 'manda.sandbox' : 'manda.v1';
  function fresh() {
    return { v: 1, xp: 0, tickets: 0, streak: { n: 0, last: '' }, lessons: {}, bosses: {}, q: {}, cards: {}, tips: {},
      mis: { d: '', done: {}, bonus: false }, rushBest: 0, pulls: 0, sets: {}, cardp: {}, seen: {}, settings: { sound: true, speak: true, auto: true } };
  }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) { var f = fresh(); for (var k in s) f[k] = s[k]; return f; } } catch (e) { /* 保存領域が使えない */ }
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
  function oracleNo(L) { return '第' + L.no + 'の神託'; }

  /* 単語帳（バルーン用） */
  var WORD = {};
  DICT.words.forEach(function (e) { [e.w].concat(e.f).forEach(function (f) { WORD[f.toLowerCase()] = e; }); });
  var POS = { n: '名詞', v: '動詞', adj: '形容詞', adv: '副詞', pron: '代名詞', art: '冠詞', prep: '前置詞', det: '', rel: '関係詞', int: '疑問詞', num: '数', phr: '表現', bad: '' };
  var LVN = { 5: '5級', 4: '4級', 3: '4級＋α', 0: '' };

  /* ---------- 神格（レベル）・連続日数・ミッション ---------- */
  function need(lv) { return 100 + (lv - 1) * 40; }
  function levelOf(xp) { var lv = 1; while (xp >= need(lv)) { xp -= need(lv); lv++; } return { lv: lv, cur: xp, need: need(lv) }; }
  var TITLES = [[1, '見習い神'], [3, '村の守り神'], [5, '島の神'], [8, '海の神'], [12, '大地の神'], [16, '天空の神'], [20, '創造神']];
  function titleOf(lv) { var t = TITLES[0][1]; TITLES.forEach(function (x) { if (lv >= x[0]) t = x[1]; }); return t; }
  function addXp(n) { var b = levelOf(S.xp).lv; S.xp += n; var a = levelOf(S.xp).lv; return a > b ? a : 0; }
  function touchDay() {
    var t = today();
    if (S.streak.last === t) return false;
    S.streak.n = S.streak.last === ymd(Date.now() - DAY) ? S.streak.n + 1 : 1;
    S.streak.last = t;
    return true;
  }
  var MIS = [{ id: 'stage', icon: '📜', ti: '神託かボスを1つクリア' }, { id: 'review', icon: '🔁', ti: '祈りの復習を1回やりきる' }, { id: 'rush', icon: '⚡', ti: 'ラッシュを1回' }];
  function mis() { if (S.mis.d !== today()) S.mis = { d: today(), done: {}, bonus: false }; return S.mis; }
  function missionDone(id) {
    var m = mis(), got = [];
    if (m.done[id]) return got;
    m.done[id] = 1; S.tickets += 1;
    got.push({ icon: '🎟', t: 'ミッション達成 +1' });
    if (MIS.every(function (x) { return m.done[x.id]; }) && !m.bonus) { m.bonus = true; S.tickets += 2; got.push({ icon: '🎉', t: 'ミッション コンプリート +2' }); }
    return got;
  }

  /* 人口（島の育ち具合） */
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

  /* 命令が届いたときの音（低い鐘＋光の音） */
  function sfxDivine() {
    if (!window.Sfx || !Sfx.raw) return;
    var R = Sfx.raw;
    R.play(function (t) {
      R.noise(t, 0.7, 0.16, 300, 7000);
      [0, 7, 12, 16, 19].forEach(function (s, k) { R.tone(R.hz(s - 12), t + k * 0.035, 0.9, 'sine', 0.07); R.tone(R.hz(s), t + 0.05 + k * 0.035, 0.6, 'triangle', 0.05); });
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
    h = h.replace(/__([^_]+)__/g, '<span class="hint">💡$1</span>');
    h = h.replace(/\(\(([^)]+)\)\)/g, '<span class="conv">📎 $1</span>');
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
      if (node.parentNode.closest('.es, .es-line, .es-cell, .gj, button')) return;
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
  /* 命令の語（{…}）だけを取り出す：叩きつけ文字に使う */
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
    stopAuto();
  }

  /* ---------- 下のボタン置き場 ---------- */
  function Tray(t) {
    function btn(label, cls, fn) {
      var b = el('button', 'tb ' + (cls || ''), label);
      b.addEventListener('click', function () { if (b.disabled) return; if (window.Sfx) Sfx.tap(); fn(b); });
      return b;
    }
    return {
      el: t,
      clear: function () { t.innerHTML = ''; },
      hint: function (html) { t.innerHTML = '<p class="thint">' + html + '</p>'; },
      next: function (fn, label, cls) { t.innerHTML = ''; var b = btn(label || '▶ つぎへ', 'go ' + (cls || ''), function () { fn(); }); t.appendChild(b); if (!FX.RM && b.animate) b.animate([{ transform: 'translateY(24px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 240, easing: 'cubic-bezier(.2,1.5,.4,1)' }); },
      btns: function (list) { t.innerHTML = ''; var w = el('div', 'tbs'); list.forEach(function (x) { w.appendChild(btn(x.t, x.cls, x.fn)); }); t.appendChild(w); },
      options: function (list, cb, cls) {
        t.innerHTML = '';
        /* 短い選択肢（単語だけ）は2〜3列にして、高さを取らない */
        var short = list.every(function (x) { return String(x.label).length <= 9; });
        var w = el('div', 'opts ' + (cls || '') + (short ? ' cols' + Math.min(list.length, 3) : ''));
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

  /* ---------- 正解・まちがいの演出（コンボ・神の加護＝FEVER） ---------- */
  var PRAISE = ['¡Bien!', '¡Muy bien!', '¡Genial!', '¡Perfecto!', '¡Olé!', '¡Increíble!', '¡Fantástico!', '¡Divino!'];
  function newRun() { return { combo: 0, best: 0, xp: 0, ok: 0, ng: 0, fever: false }; }
  function feverOn() { document.body.classList.add('fever'); }
  function feverOff() { document.body.classList.remove('fever'); }
  function hit(run, src, base) {
    run.combo++; run.ok++; run.best = Math.max(run.best, run.combo);
    var fever = run.combo >= 5;
    if (run.combo === 5) { run.fever = true; feverOn(); FX.slam('GODLIKE!!', 'rainbow', '神の加護　XP ×2'); Sfx.combo(10); FX.confetti(70, 'divine'); }
    else if (run.combo === 3) FX.slam(pick(['NICE!', 'GREAT!', '¡BIEN!']), 'cyan');
    else if (run.combo === 10) { FX.slam('DIVINE!!', 'gold', '10 COMBO'); Sfx.combo(10); FX.confetti(90); }
    else if (run.combo > 10 && run.combo % 5 === 0) { FX.slam(run.combo + ' COMBO!!', 'gold'); Sfx.combo(10); }
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
  var KIND = { pick: ['🎯', '空いている所に入るのは？'], form: ['🔨', '命令の形にしよう'], scene: ['🎭', 'この場面の命令は？'], who: ['👥', 'だれへの命令？'],
    ja: ['💬', '意味は？'], bug: ['🐛', 'まちがい探し'], build: ['🧩', 'ならべて命令を作ろう'], listen: ['🎧', '聞こえた命令はどれ？'] };
  var WHO = ['tú（1人・仲よし）', 'usted（1人・ていねい）', 'vosotros（何人も・仲よし）', 'ustedes（何人も・ていねい）'];
  var PTAG = { 'tú': '→ tú へ（1人・仲よし）', 'usted': '→ usted へ（1人・ていねい）', 'vosotros': '→ vosotros へ（何人も・仲よし）', 'ustedes': '→ ustedes へ（何人も・ていねい）',
    'no-tú': '→ tú に「〜するな」　no ＿＿', 'no-usted': '→ usted に「〜しないでください」　no ＿＿' };
  function renderQ(q, card, T, opts, cb) {
    opts = opts || {};
    var t0 = Date.now(), done = false;
    card.className = 'card qcard k-' + q.k + (opts.fast ? ' fast' : '');
    card.setAttribute('data-q', q.id);
    var body = '';
    if (q.k === 'pick' || q.k === 'ja' || q.k === 'who') body = '<div class="es-line">' + esHtml(q.s) + '</div>';
    else if (q.k === 'bug') body = '<div class="es-line toks">' + toks(q.s) + '</div>';
    else if (q.k === 'build') body = '<div class="build-line"></div>';
    else if (q.k === 'form') body = '<div class="form-q"><b class="es-line">' + esc(q.v) + '</b><span>' + esc(PTAG[q.p] || q.p) + '</span></div>';
    else if (q.k === 'scene') body = '<p class="sit">' + ja(q.sit) + '</p>';
    else if (q.k === 'listen') body = Speech.ok() ? '<div class="listen"><button class="say big" data-say="' + esc(q.s) + '" aria-label="もう一度聞く">🔊</button><button class="say slow" data-say="' + esc(q.s) + '" aria-label="ゆっくり聞く">🐢</button><small>何度でも聞けるよ</small></div>'
      : '<p class="why">（この端末ではスペイン語の音声が使えないので、日本語の意味から選ぼう）</p><div class="es-line">' + esc(q.ja) + '</div>';
    var showJa = q.ja && (q.k === 'pick' || q.k === 'bug' || q.k === 'build' || q.k === 'who');
    card.innerHTML = '<div class="qtag"><span>' + KIND[q.k][0] + '</span> ' + KIND[q.k][1] + (opts.tag ? '<em>' + esc(opts.tag) + '</em>' : '') + '</div>' + body +
      (showJa ? '<div class="ja-line">' + esc(q.ja) + '</div>' : '') + '<div class="qres"></div>';
    glossAll(card);
    if (q.k === 'listen' && Speech.ok()) later(function () { if (!done) Speech.say(q.s); }, 350);

    function finish(ok) {
      if (done) return; done = true;
      var ms = Date.now() - t0;
      card.classList.add(ok ? 'is-ok' : 'is-ng');
      if (!opts.fast) result(ok);
      cb(ok, ms);
    }
    function full() {
      if (q.k === 'pick') return q.s.replace('___', '{' + q.o[q.a] + '}');
      if (q.k === 'bug') return q.ok;
      if (q.k === 'scene' || q.k === 'form') return q.o[q.a];
      return q.s;
    }
    function result(ok) {
      var r = $('.qres', card), s = full();
      var showS = !(ok && (q.k === 'ja' || q.k === 'who' || q.k === 'build'));
      r.innerHTML = (ok ? '<b class="rk ok">⭕ ' + pick(PRAISE) + '</b>' : '<b class="rk ng">❌ おしい！</b>') +
        (showS ? '<div class="es-line ans">' + esHtml(s) + sayBtn(s) + '</div>' : '') +
        (q.k === 'ja' ? '<div class="ja-line">' + esc(q.o[q.a]) + '</div>' : q.k === 'who' && !ok ? '<div class="ja-line">' + esc(WHO[q.a]) + '</div>' : q.k === 'listen' && q.ja ? '<div class="ja-line">' + esc(q.ja) + '</div>' : '') +
        (q.why ? '<p class="why">' + ja(q.why) + '</p>' : '');
      glossAll(r);
      autoSay(s);
    }

    if (q.k === 'pick' || q.k === 'ja' || q.k === 'form' || q.k === 'scene' || q.k === 'who' || q.k === 'listen') {
      var labels = q.k === 'who' ? WHO : q.o;
      var list = labels.map(function (l, i) { return { label: l, i: i }; });
      if (q.k !== 'who') list = shuffle(list);
      T.options(list, function (i, b, wrap) {
        var ok = i === q.a;
        if (q.k === 'pick') { var bl = $('.blank', card); if (bl) { bl.textContent = q.o[i]; bl.className = 'blank filled ' + (ok ? 'ok' : 'ng'); } }
        markOpts(wrap, q.a, i);
        finish(ok);
      }, q.k === 'ja' || q.k === 'listen' || q.k === 'scene' || q.k === 'who' ? 'long' : '');
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
          finish(ok);
        });
      });
      return;
    }
    if (q.k === 'build') buildQ(q, card, T, finish, function () { return done; });
  }

  /* タイル並べ（タップで追加・ドラッグで好きな位置へ） */
  function buildQ(q, card, T, finish, isDone) {
    var words = q.s.split(' '), last = words[words.length - 1], end = (/[.?!]+$/.exec(last) || [''])[0];
    words[words.length - 1] = last.slice(0, last.length - end.length);
    var line = $('.build-line', card), placed = [];
    var tiles = shuffle(words.concat(q.d || []));
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
      var ok = placed.map(function (x) { return x.w; }).join(' ') === words.join(' ');
      line.classList.add(ok ? 'ok' : 'ng');
      $$('.tile', pool).forEach(function (t) { t.disabled = true; });
      if (caret) caret.remove();
      finish(ok);
    }
    paint();
  }

  /* =========================================================
   * 島の景色（ホームの大きな島・レッスンの場面）
   * ========================================================= */
  /* 空の色：進み具合で夜明け → 昼 → 夕方 → 闇 → 創世の光 */
  function skyOf() {
    var ni = nextIdx(), k = ni < 0 ? ORDER.length : ni;
    if (ni < 0) return 'sky-gold';
    if (k === 0) return 'sky-night';
    var n = ORDER[k];
    if (n.id === 'L10' || n.id === 'B3') return 'sky-dark';
    if (k <= 3) return 'sky-dawn';
    if (k <= 8) return 'sky-day';
    return 'sky-dusk';
  }
  function sprite(it, cls) {
    return '<i class="sp' + (it.sky ? ' sky' : '') + (cls ? ' ' + cls : '') + '" style="left:' + it.x + '%;top:' + it.y + '%;--s:' + (it.s || 1) + ';z-index:' + Math.round(it.y) + '">' + it.e + '</i>';
  }
  function islandHtml(newId) {
    var h = '<div class="sea"><i></i><i></i></div><svg class="land" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M4 30 C10 12 26 4 50 4 C74 4 90 12 96 30 C92 38 70 40 50 40 C30 40 8 38 4 30Z" fill="url(#lg)"/><path d="M4 30 C8 34 20 38 50 38 C80 38 92 34 96 30" stroke="#f6e3a1" stroke-width="1.6" fill="none" opacity=".7"/><defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--g1)"/><stop offset="1" stop-color="var(--g2)"/></linearGradient></defs></svg>';
    ORDER.forEach(function (n) {
      if (!nodeDone(n) && n.id !== newId) return;
      (W.grow[n.id] || []).forEach(function (it, k) { h += sprite(it, n.id === newId ? 'new n' + k : ''); });
    });
    /* 島の人たち（会ったことのある人） */
    var met = { pepe: S.lessons.L1, lola: S.lessons.L2, tomas: S.lessons.L4, pueblo: S.lessons.L7 };
    var spots = { pepe: [38, 80], lola: [48, 84], tomas: [26, 80], pueblo: [64, 78] };
    Object.keys(met).forEach(function (k) { if (met[k]) h += '<i class="sp folk" data-who="' + k + '" style="left:' + spots[k][0] + '%;top:' + spots[k][1] + '%;z-index:' + spots[k][1] + '">' + D.people[k].e + '</i>'; });
    /* 手に入れた住人カード（位置は id から決める） */
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

  /* ---- 場面（島の人たち） ---- */
  function stageSet(actors) {
    stageEl.className = 'stage ' + skyOf();
    stageEl.innerHTML = '<div class="st-sky" id="stSky"></div><div class="st-ground"></div><div class="actors" id="actors"></div>';
    actors.forEach(function (k) { addActor(k, true); });
  }
  function addActor(k, quiet) {
    var box = $('#actors');
    if (!box || $('.actor[data-who="' + k + '"]', box)) return;
    var p = D.people[k], a = el('button', 'actor', '<span class="af">' + p.e + '</span><span class="an">' + esc(p.n) + '</span><span class="am"></span>');
    a.setAttribute('data-who', k); a.disabled = true;
    box.appendChild(a);
    if (!quiet) { FX.pop(a, 1.4); var pt = FX.at(a); FX.burst(pt.x, pt.y, { pal: 'divine', n: 18 }); Sfx.whoosh(); }
  }
  function actorEl(k) { return $('.actor[data-who="' + k + '"]', stageEl); }
  function actorReact(k, e, mood) {
    var a = actorEl(k); if (!a) return;
    a.classList.remove('jump'); void a.offsetWidth; a.classList.add('jump');
    if (mood) { var m = $('.am', a); m.textContent = mood; m.classList.remove('on'); void m.offsetWidth; m.classList.add('on'); }
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
    if (!isTbl) later(function () { var r = card.getBoundingClientRect(), B = boardEl.getBoundingClientRect(); if (r.bottom > B.bottom) boardEl.scrollTop += Math.min(r.top - B.top - 6, r.bottom - B.bottom + 8); }, 30);
    return card;
  }
  function boardScroll() { later(function () { boardEl.scrollTo({ top: boardEl.scrollHeight, behavior: FX.RM ? 'auto' : 'smooth' }); }, 40); }

  /* ---- セリフ（1文字ずつ） ---- */
  var typeT = 0, typeDone = null;
  function talk(x, who, mood, then) {
    talkEl.hidden = false;
    clearTimeout(typeT);
    var p = who ? D.people[who] : null;
    talkEl.className = 'talk' + (p ? ' person' : '');
    talkEl.innerHTML = '<div class="tk-av">' + (p ? '<span>' + p.e + '</span>' : FX.owl(mood)) + '</div><div class="tk-body"><b class="tk-name">' + (p ? esc(p.n) : 'ブーホ') + '</b><div class="tk-x">' + ja(x) + '</div></div><button class="tk-log" aria-label="これまでのセリフ">📜</button>';
    if (cur) cur.log.push({ who: who, x: x });
    var box = $('.tk-x', talkEl);
    glossAll(box);
    /* 文字を1つずつ出す（タップで全部） */
    var chars = [];
    walk(box, function (node) {
      var frag = document.createDocumentFragment();
      Array.prototype.forEach.call(node.nodeValue, function (ch) { var s = el('span', 'ch', esc(ch)); chars.push(s); frag.appendChild(s); });
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
    modal('<h3 class="m-h">📜 これまでのセリフ</h3><div class="log">' + cur.log.map(function (l) {
      var p = l.who ? D.people[l.who] : null;
      return '<div class="lg"><b>' + (p ? p.e + ' ' + esc(p.n) : '🦉 ブーホ') + '</b><p>' + ja(l.x) + '</p></div>';
    }).join('') + '</div>', 'log-m');
    glossAll($('#mbody'));
    var lg = $('#mbody .log'); lg.scrollTop = lg.scrollHeight;
  }

  var REPLY = ['なるほど ▶', 'ふむふむ ▶', 'うんうん ▶', 'それで？ ▶', 'わかった ▶', 'OK ▶'];
  var READY = ['やってみる ▶', 'まかせて ▶', 'よし、命令だ ▶', 'いくぞ ▶'];
  function replyLabel() {
    var nx = cur && cur.L.steps[cur.i];
    return nx && /^(cast|forge|ask|tapwho|q|drill)$/.test(nx.t) ? pick(READY) : pick(REPLY);
  }

  function startLesson(L) {
    show('play');
    boardEl.innerHTML = ''; T1.clear(); talkHide();
    $('#pTitle').textContent = oracleNo(L) + '　' + L.ti;
    cur = { L: L, i: 0, run: newRun(), used: {}, log: [] };
    L.steps.forEach(function (st) { if (st.t === 'q') cur.used[st.id] = 1; });
    stageSet(L.actors || []);
    boardSet(el('div', 'card lesson-title', '<small>ORÁCULO ' + L.no + '</small><b>' + L.icon + ' ' + esc(L.ti) + '</b><span>' + esc(L.sub) + '</span>'));
    FX.slam('ORÁCULO ' + L.no, 'gold', L.ti);
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
    ({ say: doSay, show: doShow, enter: doEnter, ask: doAsk, forge: doForge, cast: doCast, tapwho: doTapWho, tip: doTip, q: doQ, drill: doDrill })[st.t](st, run);
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
        { t: '🤔 なんで？', cls: 'sub', fn: function () { talk(st.more, null, 'happy', function () { nextBtn(); }); } }
      ]);
    });
  }
  function doShow(st) {
    var c = el('div', 'card board-tbl', (st.cap ? '<div class="qtag">📋 ' + esc(st.cap) + '</div>' : '') +
      (st.tbl ? '<table class="tbl">' + st.tbl.map(function (r) { return '<tr><th class="es-cell">' + esHtml(r[0]) + '</th><td class="es-cell">' + esHtml(r[1]) + '</td></tr>'; }).join('') + '</table>' : '') +
      (st.es ? '<div class="es-line big">' + esHtml(st.es) + sayBtn(st.es) + '</div>' : '') + (st.ja ? '<div class="ja-line">' + esc(st.ja) + '</div>' : ''));
    glossEs(c);
    boardSet(c);
    step();
  }
  function doEnter(st) { addActor(st.who); later(step, 500); }

  function doAsk(st, run) {
    talkHide();
    var c = boardSet(el('div', 'card ask' + (st.pred ? ' pred' : ''), '<div class="qtag">' + (st.pred ? '🤔 予想してみて <em>まちがえても OK</em>' : '❓ クイズ') + '</div><div class="qq">' + ja(st.q) + '</div>' + (st.es ? '<div class="es-line">' + esHtml(st.es) + '</div>' : '') + '<div class="qres"></div>'));
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
      res.innerHTML = ok ? '<b class="rk ok">⭕ ' + pick(PRAISE) + '</b>' : '<b class="rk ng">❌ 正解は「' + esc(st.o[st.a]) + '」</b>';
      if (ok) hit(run, b); else miss(run, c);
      later(function () { talk(ok ? (st.why || 'そのとおり！') : (st.why || 'もう一度、表を思い出してみよう。'), null, ok ? 'happy' : 'sad', function () { nextBtn(); }); }, 300);
    });
  }

  /* 語をきたえる：消す文字をタップ → つける文字を選ぶ → 命令が完成 */
  function doForge(st, run) {
    talkHide();
    var w = st.w, cut = st.cut || '', start = w.length - cut.length, errs = 0, left = cut.length;
    var c = boardSet(el('div', 'card forge', '<div class="qtag">🔨 神の言葉をきたえる</div><div class="fg-word">' + w.split('').map(function (ch, i) { return '<button class="fl" data-i="' + i + '">' + esc(ch) + '</button>'; }).join('') + '</div><div class="qres"></div>'));
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
      $('.opts', T1.el).insertAdjacentHTML('beforebegin', '<p class="thint">つける文字は？</p>');
    }
    function finish() {
      T1.clear();
      $('.fg-word', c).classList.add('done');
      later(function () {
        $('.fg-word', c).outerHTML = '<div class="es-line big fg-out">' + esHtml(st.out) + sayBtn(plain(st.out)) + '</div>';
        $('.qres', c).innerHTML = '<div class="ja-line">' + esc(st.ja) + '</div>';
        glossEs(c);
        var words = cmdWords(st.out);
        FX.slam('¡' + (words.length ? words.join(' ') : plain(st.out)).toUpperCase() + '!', 'gold');
        sfxDivine();
        var p = FX.at($('.fg-out', c)); FX.rays(p.x, p.y); FX.burst(p.x, p.y, { pal: 'divine', n: 50, sp: 10, ring: true });
        if (!errs) hit(run, $('.fg-out', c)); else bonus(run, 5, $('.fg-out', c));
        autoSay(plain(st.out));
        later(function () { nextBtn('▶ ' + pick(['できた！', 'かんぺき！', 'ふむ、いい形だ'])); }, 500);
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

  /* 場面の命令：島の人の困りごと → 命令を選ぶ → その人が動く */
  var YES = ['¡Sí!', '¡Vale!', '¡Claro!', '¡Ahora mismo!', '¡Gracias!'], YES_POLITE = ['¡Muchas gracias!', '¡Con mucho gusto!', '¡Qué amable!'];
  function doCast(st, run) {
    talkHide();
    addActor(st.who);
    var p = D.people[st.who];
    var c = boardSet(el('div', 'card cast', '<div class="qtag">⚡ 神託 <em>命令をえらべ</em></div><div class="need"><span class="nf">' + p.e + '</span><div class="nb"><b>' + esc(p.n) + '</b><p>' + ja(st.need) + '</p></div></div><div class="qres"></div>'));
    glossAll(c);
    var a = actorEl(st.who); if (a) a.classList.add('ask');
    var list = shuffle(st.o.map(function (o, i) { return { label: o, i: i }; }));
    T1.options(list, function (i, b, wrap) {
      var ok = i === st.a;
      markOpts(wrap, st.a, i);
      if (a) a.classList.remove('ask');
      var res = $('.qres', c);
      res.innerHTML = '<div class="es-line big cast-out">' + esHtml(st.out) + sayBtn(plain(st.out)) + '</div><div class="ja-line">' + esc(st.ja) + '</div>';
      glossEs(res);
      if (ok) {
        hit(run, b, 12);
        var words = cmdWords(st.out);
        later(function () {
          FX.slam('¡' + words.join(' ').toUpperCase() + '!', 'gold');
          sfxDivine();
          var pt = FX.at(a || c); FX.rays(pt.x, pt.y); FX.burst(pt.x, pt.y, { pal: 'divine', n: 40, sp: 9 });
          actorReact(st.who, st.fx && st.fx.e, st.fx && st.fx.mood);
          if (st.fx && st.fx.world) worldFx(st.fx.world);
          autoSay(plain(st.out));
        }, 250);
        later(function () {
          var polite = st.who === 'marina' || st.who === 'viaje';
          talk(pick(polite ? YES_POLITE : YES), st.who, '', function () { nextBtn(); });
        }, 900);
      } else {
        miss(run, c);
        if (a) { var m = $('.am', a); m.textContent = '❓'; m.classList.remove('on'); void m.offsetWidth; m.classList.add('on'); }
        res.insertAdjacentHTML('afterbegin', '<b class="rk ng">❌ 届かなかった…　正しい命令はこれ</b>');
        autoSay(plain(st.out));
        later(function () { talk(st.why || '', null, 'sad', function () { nextBtn('▶ もう覚えた'); }); }, 400);
      }
    });
  }

  /* だれへの命令？：場面の人をタップ */
  function doTapWho(st, run) {
    talkHide();
    var c = boardSet(el('div', 'card tapwho', '<div class="qtag">👥 だれへの命令？ <em>上の人をタップ</em></div><div class="es-line big">' + esHtml(st.es) + sayBtn(plain(st.es)) + '</div><div class="ja-line">' + esc(st.ja) + '</div><div class="qres"></div>'));
    glossEs(c);
    autoSay(plain(st.es));
    T1.hint('👆 この命令を言う相手を、<b>上の場面</b>でタップ！');
    var acts = $$('.actor', stageEl), done = false;
    acts.forEach(function (a) {
      a.disabled = false; a.classList.add('pickme');
      a.onclick = function () {
        if (done) return; done = true;
        acts.forEach(function (x) { x.disabled = true; x.classList.remove('pickme'); x.onclick = null; });
        var ok = a.getAttribute('data-who') === st.a, right = actorEl(st.a);
        a.classList.add(ok ? 'ok' : 'ng'); if (!ok && right) right.classList.add('right');
        later(function () { acts.forEach(function (x) { x.classList.remove('ok', 'ng', 'right'); }); }, 2200);
        $('.qres', c).innerHTML = ok ? '<b class="rk ok">⭕ ' + pick(PRAISE) + '</b>' : '<b class="rk ng">❌ 正解は ' + esc(D.people[st.a].e + ' ' + D.people[st.a].n) + '</b>';
        T1.clear();
        if (ok) { hit(run, a); actorReact(st.a, '✨', pick(['😊', '😆', '🙌'])); sfxDivine(); } else miss(run, c);
        later(function () { talk(st.why, null, ok ? 'happy' : 'sad', function () { nextBtn(); }); }, 350);
      };
    });
  }
  function doTip(st, run) {
    var first = !S.tips[st.id];
    S.tips[st.id] = 1; save();
    var c = boardSet(el('div', 'card tip', '<div class="tip-h"><span>📜 TIP GET!</span>' + (first ? '<em>NEW</em>' : '') + '</div><b class="tip-ti">' + esc(st.ti) + '</b><div class="tip-x">' + ja(st.x) + '</div>' +
      (st.why ? '<details><summary>🤔 なぜ？</summary><p>' + ja(st.why) + '</p></details>' : '')));
    glossAll(c);
    if (first) { Sfx.coin(); var p = FX.at(c); FX.burst(p.x, p.y, { pal: 'gold', n: 30 }); bonus(run, 5, c, 'Tips'); }
    var me = cur;
    talk(pick(['これは大事！ 創世記の Tips にしまっておくね。', 'ここ、テストに出るよ。\nTips にメモしたから、いつでも読み返せる。', 'まとめのメモだよ。\n「🤔 なぜ？」を開くと、理由も読める。']), null, 'happy', function () { if (cur === me) nextBtn(); });
  }
  function lessonQ(q, run, then, tag) {
    talkHide();
    $$('.board-tbl', boardEl).forEach(function (t) { t.remove(); });   // 問題では表を見せない（思い出す練習）
    var c = boardSet(el('div', 'card qcard'));
    renderQ(q, c, T1, { tag: tag }, function (ok) {
      srs(q, ok); save();
      var src = $('.chosen', T1.el) || $('.tok.ok, .tok.ng', c) || c;
      if (ok) hit(run, src); else miss(run, c);
      boardScroll();
      later(then, 250);
    });
  }
  function doQ(st, run) { lessonQ(QBY[st.id], run, function () { nextBtn('▶ つぎへ'); }); }
  function doDrill(st, run) {
    var pool = D.questions.filter(function (q) { return q.L === cur.L.no && !cur.used[q.id]; });
    var list = weighted(pool).slice(0, st.n);
    var k = 0, me = cur;
    talk(pick(['仕上げの試練だ！\n' + list.length + '問、5連続正解で「神の加護」が来るよ🔥', 'さあ、命令の腕だめし！\n' + list.length + '問。連続正解をねらって！', '最後に ' + list.length + '問の試練。\n迷ったら、Tips を思い出して！']), null, 'happy', function () {
      if (cur !== me) return;
      T1.next(function () { FX.slam('TRIAL ×' + list.length, 'gold'); later(one, 600); }, '⚔ 試練をうける');
    });
    function one() {
      if (cur !== me) return;
      if (k >= list.length) return nextBtn('▶ 試練クリア！');
      var q = list[k++];
      lessonQ(q, run, function () { setProg(); T1.next(one, k < list.length ? '▶ つぎ（' + (k + 1) + '/' + list.length + '）' : '▶ 試練クリア！'); }, k + ' / ' + list.length);
    }
  }
  function finishLesson() {
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
    setFx(sets);
    touchDay();
    var up = addXp(run.xp);
    save(); cur = null;
    showResult({ title: 'ORÁCULO CLEAR!!', sub: oracleNo(L) + '　' + L.ti, stars: stars, run: run, rewards: rewards, card: card, up: up,
      next: { label: first ? '🏝 島へもどる（島が育つ！）' : '🏝 島へもどる', fn: function () { home(first ? { grow: L.id } : null); } }, noHome: true });
  }
  $('#pQuit').addEventListener('click', function () {
    if (cur && !confirm('神託をやめる？\n（この神託の進み具合は保存されません。答えた問題は復習に入ります）')) return;
    cur = null; Speech.stop(); home();
  });

  /* =========================================================
   * 結果画面
   * ========================================================= */
  function nodeLabel(n) { if (n.type === 'L') { var L = LESSON[n.id]; return oracleNo(L) + '　' + L.ti; } var B = BOSS[n.id]; return '⚔ ' + B.name; }
  function showResult(o) {
    var scr = $('#done'); show('done');
    var run = o.run || newRun();
    var lvBefore = levelOf(S.xp - run.xp), lvNow = levelOf(S.xp);
    scr.innerHTML = '<div class="res">' +
      '<h2 class="res-ti ' + (o.lose ? 'lose' : '') + '">' + esc(o.title) + '</h2><p class="res-sub">' + esc(o.sub || '') + '</p>' +
      (o.stars ? '<div class="stars">' + [1, 2, 3].map(function (k) { return '<i class="' + (k <= o.stars ? 'on' : '') + '">★</i>'; }).join('') + '</div>' : '') +
      (o.rank ? '<div class="rank r-' + o.rank + '">' + o.rank + '<small>RANK</small></div>' : '') +
      (o.big ? '<div class="bignum"><b>' + o.big[0] + '</b><small>' + esc(o.big[1]) + '</small></div>' : '') +
      '<div class="res-stats"><span>⭕ <b>' + run.ok + '</b></span><span>❌ <b>' + run.ng + '</b></span><span>🔥 最大 <b>' + run.best + '</b> コンボ</span></div>' +
      '<div class="res-xp"><div class="rx-top"><b>+<span id="rXp">0</span> XP</b><span>神格 Lv.<b id="rLv">' + lvBefore.lv + '</b></span></div><span class="lv-bar big"><i id="rBar" style="width:' + Math.round(lvBefore.cur / lvBefore.need * 100) + '%"></i></span></div>' +
      (o.rewards && o.rewards.length ? '<ul class="rewards">' + o.rewards.map(function (r) { return '<li><span>' + r.icon + '</span>' + esc(r.t) + '</li>'; }).join('') + '</ul>' : '') +
      (o.card ? '<div class="newcard"><p>🃏 新しい住人！ タップでめくる</p>' + cardHtml(o.card, true) + '</div>' : '') +
      (o.note ? '<p class="res-note">' + o.note + '</p>' : '') +
      '<div class="res-btns"></div></div>';
    var bt = $('.res-btns', scr);
    if (o.retry) bt.appendChild(mkBtn(o.retry.label, 'go', o.retry.fn));
    if (o.next) bt.appendChild(mkBtn(o.next.label, o.retry ? 'sub' : 'go', o.next.fn));
    if (!o.noHome) bt.appendChild(mkBtn('🏝 島へ', 'sub', function () { home(); }));
    if (o.lose) { Sfx.wrong(); FX.shake(null, true); }
    else { FX.slam(o.title, o.rank === 'S' || o.stars === 3 ? 'gold' : 'cyan'); FX.confetti(o.stars === 3 || o.rank === 'S' ? 160 : 80, 'divine'); Sfx.levelUp(); }
    $$('.stars i.on', scr).forEach(function (s, k) { later(function () { s.classList.add('pop'); Sfx.coin(); var p = FX.at(s); FX.burst(p.x, p.y, { pal: 'gold', n: 18 }); }, 500 + k * 280); });
    var xpEl = $('#rXp'), t0 = 0, dur = 900;
    later(function () {
      t0 = performance.now();
      (function tick(t) { var k = Math.min(1, (t - t0) / dur); xpEl.textContent = Math.round(run.xp * k); if (k < 1) requestAnimationFrame(tick); })(t0);
      $('#rBar').style.width = (lvNow.lv > lvBefore.lv ? 100 : Math.round(lvNow.cur / lvNow.need * 100)) + '%';
    }, 700);
    if (o.up) later(function () { $('#rLv').textContent = lvNow.lv; $('#rBar').style.width = Math.round(lvNow.cur / lvNow.need * 100) + '%'; levelUp(o.up); }, 1700);
    var nc = $('.newcard .pcard', scr);
    if (nc) nc.addEventListener('click', function () { flipCard(nc); });
  }
  function mkBtn(label, cls, fn) { var b = el('button', 'tb ' + cls, esc(label)); b.addEventListener('click', function () { Sfx.tap(); fn(); }); return b; }
  function levelUp(lv) {
    Sfx.levelUp(); FX.confetti(200, 'divine'); FX.flash('#ffd23f');
    modal('<div class="lvup"><small>神格 UP!!</small><b>' + lv + '</b><span>' + esc(titleOf(lv)) + '</span>' + FX.owl('happy') + '</div>', 'lvup-m');
  }

  /* =========================================================
   * 住人カード
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
    if (c.r === 'SSR' || c.r === 'UR') { FX.slam(c.r + '!!', c.r === 'UR' ? 'rainbow' : 'gold'); FX.confetti(80, c.r === 'UR' ? 'rainbow' : 'gold'); FX.rays(p.x, p.y); }
    glossEs(nc);
    autoSay(c.es);
  }

  /* =========================================================
   * ボス戦・ラッシュ・復習（1問ずつの画面）
   * ========================================================= */
  var zMain = $('#zMain'), zHud = $('#zHud'), zRun = null, zTimer = 0, zActive = false;
  function zStop() { zActive = false; clearInterval(zTimer); Speech.stop(); }
  $('#zQuit').addEventListener('click', function () {
    if (zActive && !confirm('やめる？（ここまでの XP はもらえません）')) return;
    zStop(); home();
  });
  function zCard() { zMain.innerHTML = ''; var c = el('div', 'card qcard'); zMain.appendChild(c); return c; }

  /* ----- ボス：災いから島を守る ----- */
  function bossIntro(B) {
    zStop(); show('quiz'); feverOff();
    $('#zTitle').textContent = (B.final ? 'FINAL BOSS' : 'BOSS') + '  ' + B.name; $('#zProg').style.width = '0%'; $('#zRight').innerHTML = '';
    zHud.innerHTML = '<div class="warn"><span>⚠ WARNING ⚠ 災いが来る ⚠ WARNING ⚠ 災いが来る ⚠</span></div>';
    var rec = S.bosses[B.id];
    zMain.innerHTML = '<div class="boss-intro" style="--bc:' + B.col + '"><div class="bface big">' + B.face + '</div><small>' + esc(B.en) + '</small><h2>' + esc(B.name) + '</h2>' +
      '<p class="bline">「' + esc(B.line) + '」</p>' +
      '<ul class="rules"><li>🏠 島の家は3つ。まちがえると1つこわされる</li><li>⚡ 神速ゲージが残っているうちに正解するとクリティカル</li><li>🏆 ノーミスで S ランク</li><li>📚 出題：' + B.from.map(function (id) { return oracleNo(LESSON[id]).replace('の神託', ''); }).join('・') + ' の神託</li></ul>' +
      (rec && rec.win ? '<p class="best">これまでの最高：<b>' + rec.rank + '</b> ランク</p>' : '') + '</div>';
    Sfx.combo(10); FX.shake(null, true);
    T2.next(function () { bossFight(B); }, '⚡ 神の力で立ち向かう！', 'boss');
  }
  function bossFight(B) {
    var pool = D.questions.filter(function (q) { return B.from.indexOf('L' + q.L) >= 0; });
    var queue = weighted(pool), qi = 0;
    var hpMax = 1000, hp = hpMax, hearts = 3, dmgBase = Math.ceil(hpMax / B.n), n = 0;
    zRun = newRun(); zActive = true;
    zHud.innerHTML = '<div class="bhud" style="--bc:' + B.col + '"><div class="bface" id="bFace">' + B.face + '</div><div class="bstat"><b>' + esc(B.name) + '</b><span class="hp"><i id="bHp"></i><em id="bHpN">' + hp + '</em></span><span class="speed"><i id="bSpd"></i></span></div><div class="hearts" id="bHearts"></div></div>';
    function paint() {
      $('#bHp').style.width = Math.max(0, hp / hpMax * 100) + '%'; $('#bHpN').textContent = Math.max(0, hp);
      $('#bHearts').innerHTML = [0, 1, 2].map(function (k) { return '<i class="' + (k < hearts ? 'on' : '') + '">🏠</i>'; }).join('');
      $('#zProg').style.width = Math.round((hpMax - hp) / hpMax * 100) + '%';
      $('#zRight').innerHTML = '<small>XP</small><b>' + zRun.xp + '</b>';
    }
    paint();
    FX.slam('¡LUCHA!', 'pink', 'たたかえ！');
    function one() {
      if (!zActive) return;
      if (qi >= queue.length) { queue = weighted(pool); qi = 0; }
      var q = queue[qi++]; n++;
      var c = zCard();
      var limit = q.k === 'build' ? 14000 : q.k === 'ja' || q.k === 'scene' || q.k === 'who' ? 9000 : 6500;
      /* 神速ゲージ（残っているうちに正解でクリティカル） */
      var spd = $('#bSpd'), t0 = Date.now();
      clearInterval(zTimer);
      zTimer = setInterval(function () { var k = Math.max(0, 1 - (Date.now() - t0) / limit); spd.style.width = (k * 100) + '%'; spd.classList.toggle('low', k < 0.3); if (!k) clearInterval(zTimer); }, 80);
      renderQ(q, c, T2, { tag: 'TURN ' + n }, function (ok, ms) {
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
            FX.floatText(p.x, p.y + 10, (crit ? 'CRITICAL! ' : '') + '-' + dmg, crit ? '#ffd23f' : '#ffffff');
            FX.shake(face, true); face.classList.add('hurt'); later(function () { face.classList.remove('hurt'); }, 400);
            if (crit) { Sfx.crit(); FX.slam('神速!!', 'gold', 'CRITICAL'); } else sfxDivine();
            paint();
            if (hp <= 0) return later(function () { bossEnd(B, true, hearts); }, 700);
            T2.next(one, pick(['▶ つぎの命令', '▶ たたみかける', '▶ まだまだ！']));
          }, 260);
        } else {
          hearts--;
          miss(zRun, c);
          face.classList.add('atk'); later(function () { face.classList.remove('atk'); }, 500);
          later(function () {
            FX.shake(null, true); FX.flash('#ff0040'); paint();
            if (hearts <= 0) return later(function () { bossEnd(B, false, 0); }, 900);
            T2.next(one, '▶ 立て直す（🏠 ' + hearts + '）');
          }, 300);
        }
      });
    }
    one();
  }
  function bossEnd(B, win, hearts) {
    zStop();
    var rewards = [], card = null, rank = win ? (hearts === 3 ? 'S' : hearts === 2 ? 'A' : 'B') : null;
    var rec = S.bosses[B.id] || {}, first = win && !rec.win;
    if (win) {
      zRun.xp += B.final ? 200 : 100;
      if (first) {
        S.tickets += 5; rewards.push({ icon: '🎟', t: '初撃破 +5' });
        card = CARD['u-' + B.id]; if (card) S.cards[card.id] = (S.cards[card.id] || 0) + 1;
      } else { S.tickets += 1; rewards.push({ icon: '🎟', t: '撃破 +1' }); }
      var better = !rec.rank || 'SAB'.indexOf(rank) < 'SAB'.indexOf(rec.rank);
      S.bosses[B.id] = { win: true, rank: better ? rank : rec.rank, at: Date.now() };
      rewards = rewards.concat(missionDone('stage'));
    }
    touchDay();
    var up = addXp(zRun.xp);
    save();
    showResult({ title: win ? (B.final ? 'CREACIÓN!!' : 'K.O.!!') : 'GAME OVER', sub: win ? B.win : B.name + ' に島をあらされた…', lose: !win, rank: rank, run: zRun, rewards: rewards, card: card, up: up,
      note: win ? (B.final && rank !== 'S' ? 'ノーミスで S ランクをねらってみよう！' : '') : '答えた問題は復習に入ったよ。Tips を見直して、もう一回！',
      retry: win ? null : { label: '⚡ もう一回！', fn: function () { bossIntro(B); } },
      next: win ? { label: first ? '🏝 島へもどる（島が育つ！）' : '🏝 島へもどる', fn: function () { home(first ? { grow: B.id } : null); } } : null, noHome: win });
  }

  /* ----- ラッシュ（60秒） ----- */
  function rushIntro() {
    var pool = unlockedQs().filter(function (q) { return q.k !== 'build'; });
    if (!pool.length) return toast('🔒 第1の神託をクリアすると、ラッシュが遊べるよ');
    zStop(); show('quiz');
    $('#zTitle').textContent = '⚡ 神託ラッシュ'; $('#zProg').style.width = '100%'; $('#zRight').innerHTML = '';
    zHud.innerHTML = '';
    zMain.innerHTML = '<div class="rush-intro"><b class="ri-ti">60 SEC RUSH</b><ul class="rules"><li>⏱ 60秒で、できるだけたくさん正解</li><li>🔥 5連続正解で <b>神の加護</b>（得点2倍・正解ごとに +1秒）</li><li>💥 まちがえると −3秒</li><li>📚 出題：クリアした神託の問題（' + pool.length + '問）</li></ul>' +
      '<p class="best">ハイスコア：<b>' + S.rushBest + '</b></p></div>';
    T2.next(function () { rushGo(pool); }, '⚡ スタート！', 'boss');
  }
  function rushGo(pool) {
    T2.clear(); zMain.innerHTML = '';
    var k = 3;
    (function count() {
      if (k > 0) { FX.slam(String(k), 'cyan'); Sfx.tap(); k--; later(count, 700); }
      else { FX.slam('¡YA!', 'gold'); Sfx.combo(10); rushRun(pool); }
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
      FX.slam('TIME UP!!', 'pink');
      later(function () { rushEnd(score); }, 900);
    }
    function one() {
      if (!zActive) return;
      if (qi >= queue.length) { queue = weighted(pool); qi = 0; }
      var q = queue[qi++], c = zCard();
      renderQ(q, c, T2, { fast: true }, function (ok) {
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
    var best = score > S.rushBest, tix = score >= 6000 ? 3 : score >= 3500 ? 2 : score >= 1500 ? 1 : 0;
    if (best) S.rushBest = score;
    S.tickets += tix;
    var rewards = tix ? [{ icon: '🎟', t: 'スコアボーナス +' + tix }] : [];
    rewards = rewards.concat(missionDone('rush'));
    touchDay(); save();
    var up = addXp(zRun.xp); save();
    showResult({ title: best ? 'NEW RECORD!!' : 'TIME UP!', sub: '60秒の神託ラッシュ', run: zRun, rewards: rewards, up: up, big: [score, best ? 'ハイスコア更新！' : 'ハイスコア ' + S.rushBest],
      note: '🎟 1500点で1枚・3500点で2枚・6000点で3枚', retry: { label: '⚡ もう一回！', fn: rushIntro } });
  }

  /* ----- 祈り（復習） ----- */
  function reviewGo() {
    var all = unlockedQs();
    if (!all.length) return toast('🔒 第1の神託をクリアすると、復習ができるよ');
    var list = weighted(all).slice(0, 10), k = 0;
    zStop(); show('quiz'); zActive = true; zRun = newRun();
    $('#zTitle').textContent = '🔁 祈りの復習'; zHud.innerHTML = '';
    var due = dueQs().length;
    FX.slam('ORACIÓN', 'cyan', due ? '忘れかけの問題 ' + Math.min(due, 10) + ' 問から' : '祈りの復習');
    function paint() { $('#zProg').style.width = Math.round(k / list.length * 100) + '%'; $('#zRight').innerHTML = '<small>XP</small><b>' + zRun.xp + '</b>'; }
    function one() {
      paint();
      if (k >= list.length) return end();
      var q = list[k++], c = zCard();
      renderQ(q, c, T2, { tag: k + ' / ' + list.length + '　' + oracleNo(LESSON['L' + q.L]) }, function (ok) {
        srs(q, ok); save();
        if (ok) hit(zRun, $('.chosen', T2.el) || c); else miss(zRun, c);
        paint();
        later(function () { T2.next(one, k < list.length ? '▶ つぎへ' : '▶ おわり！'); }, 250);
      });
    }
    function end() {
      zStop();
      S.tickets += 1;
      var rewards = [{ icon: '🎟', t: '復習やりきり +1' }].concat(missionDone('review'));
      touchDay();
      var up = addXp(zRun.xp + 20); zRun.xp += 20; save();
      var acc = zRun.ok / list.length;
      showResult({ title: acc === 1 ? 'PERFECT!!' : 'ORACIÓN CLEAR!', sub: '祈りの復習 ' + list.length + '問', stars: acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1, run: zRun, rewards: rewards, up: up,
        note: 'まちがえた問題は、10分後からまた出てくるよ。正解した問題は、1日後・2日後・4日後…と間をあけて出る。', retry: { label: '🔁 もう10問', fn: reviewGo } });
    }
    one();
  }

  /* ----- 住人カードで練習（🎧聞き取り・🧩並べ替え） ----- */
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
    if (!cards.length) return toast('🃏 住人カードを手に入れると、カードで練習できるよ');
    var list = [], k = 0, full = !ids;
    cards.forEach(function (c) { list.push(cardQ(c, 'listen'), cardQ(c, 'build')); });
    $('#modal').hidden = true;
    zStop(); show('quiz'); zActive = true; zRun = newRun();
    $('#zTitle').textContent = '🃏 住人カードで練習'; zHud.innerHTML = '';
    FX.slam('PRÁCTICA', 'cyan', '🎧 聞き取り ・ 🧩 並べ替え');
    function paint() { $('#zProg').style.width = Math.round(k / list.length * 100) + '%'; $('#zRight').innerHTML = '<small>XP</small><b>' + zRun.xp + '</b>'; }
    function one() {
      paint();
      if (k >= list.length) return end();
      var q = list[k++], c = zCard();
      renderQ(q, c, T2, { tag: k + ' / ' + list.length + '　' + CARD[q.card].icon + ' ' + CARD[q.card].name }, function (ok) {
        if (ok) { S.cardp[q.card] = (S.cardp[q.card] || 0) + 1; hit(zRun, $('.chosen', T2.el) || c); } else miss(zRun, c);
        save(); paint();
        later(function () { T2.next(one, k < list.length ? '▶ つぎへ' : '▶ おわり！'); }, 250);
      });
    }
    function end() {
      zStop();
      var rewards = [];
      if (full) { S.tickets += 1; rewards.push({ icon: '🎟', t: 'カード練習やりきり +1' }); }
      touchDay();
      zRun.xp += 10;
      var up = addXp(zRun.xp); save();
      var acc = zRun.ok / list.length;
      showResult({ title: acc === 1 ? 'PERFECT!!' : 'PRÁCTICA CLEAR!', sub: '住人カードで練習 ' + list.length + '問', stars: acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1, run: zRun, rewards: rewards, up: up,
        note: '練習で正解したカードは、図鑑に 🎧 の回数がつくよ。まだ練習していないカードから順に出る。',
        retry: { label: '🃏 もう一回', fn: function () { cardGo(ids); } }, next: { label: '📖 図鑑へ', fn: function () { dexScreen('cards'); } } });
    }
    one();
  }

  /* ----- 神託ごとに5人そろえるとボーナス ----- */
  var SET_TIX = 3, SET_XP = 50;
  function setRewards() {
    var got = [];
    D.lessons.forEach(function (L) {
      var mine = D.cards.filter(function (c) { return c.L === L.no; });
      if (!mine.length || S.sets[L.no] || !mine.every(function (c) { return S.cards[c.id]; })) return;
      S.sets[L.no] = Date.now(); S.tickets += SET_TIX; S.xp += SET_XP;
      got.push({ icon: '🏆', t: oracleNo(L) + ' の住人5人コンプリート！ 🎟+' + SET_TIX + '・+' + SET_XP + ' XP', set: L.no });
    });
    return got;
  }
  function setFx(got) {
    if (!got.length) return;
    later(function () { FX.slam('SET COMPLETE!!', 'gold', '住人が5人そろった'); FX.confetti(140, 'gold'); Sfx.levelUp(); }, 600);
  }

  /* =========================================================
   * 奇跡の祈り（ガチャ）：住人カードが島にやって来る
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
    g.innerHTML = '<header class="pbar"><button class="x" id="gBack" aria-label="もどる">←</button><div class="pmid"><b>✨ 奇跡の祈り</b></div><div class="pxp"><small>🎟</small><b>' + S.tickets + '</b></div></header>' +
      '<div class="gacha"><div class="altar" id="gm"><div class="orb"><i></i><i></i><i></i></div><div class="pedestal"></div></div>' +
      '<p class="g-info">祈ると、島に新しい住人がやって来る。<br>クリアした神託の住人が出るよ（いま ' + pool.length + ' 種類）。住人 ' + own + ' / ' + D.cards.length + '</p>' +
      '<div class="g-btns"><button class="tb go" id="g1">1回祈る <small>🎟1</small></button><button class="tb gold" id="g10">10連の祈り <small>🎟10・SR以上1枚確定</small></button></div>' +
      '<p class="g-rate">出る確率：SSR 5%・SR 13%・R 30%・N 52%（UR はボスを倒したときだけ）<br>もういる住人が来たら +15 XP<br>🏆 神託ごとに住人5人そろえると 🎟+3・+50 XP</p><div id="gOut"></div></div>';
    $('#gBack').addEventListener('click', function () { home(); });
    $('#g1').addEventListener('click', function () { pull(1); });
    $('#g10').addEventListener('click', function () { pull(10); });
  }
  var pulling = false;
  function pull(n) {
    if (pulling) return;
    if (!cardPool().length) return toast('🔒 第1の神託をクリアすると、祈れるようになるよ');
    if (S.tickets < n) return toast('🎟 チケットが足りない！ 神託・ボス・ミッション・ラッシュでもらえるよ');
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
      var cap = el('button', 'capsule t-' + RCOL[top], '<span>TAP!</span>');
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
          out.insertAdjacentHTML('beforeend', '<p class="g-sum">新しい住人 <b>' + news + '</b> 人' + (dupXp ? '　かぶり → <b>+' + dupXp + ' XP</b>' : '') + '</p>' +
            sets.map(function (g) { return '<p class="g-set">' + g.icon + ' ' + esc(g.t) + '</p>'; }).join('') +
            '<div class="tbs"><button class="tb go" id="gIsle">🏝 島で会う</button><button class="tb sub" id="gDex">🃏 カードで練習</button></div>');
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
   * 📖 創世記（目次・住人図鑑・Tips）
   * ========================================================= */
  function dexScreen(tab) {
    tab = tab || 'book';
    show('dex');
    var d = $('#dex');
    var own = D.cards.filter(function (c) { return S.cards[c.id]; }).length, tips = TIPS.filter(function (t) { return S.tips[t.tip.id]; }).length;
    d.innerHTML = '<header class="pbar"><button class="x" id="dBack" aria-label="もどる">←</button><div class="pmid"><div class="tabs">' +
      '<button data-tab="book" class="' + (tab === 'book' ? 'on' : '') + '">📖 創世記</button><button data-tab="cards" class="' + (tab === 'cards' ? 'on' : '') + '">🃏 住人 ' + own + '</button><button data-tab="tips" class="' + (tab === 'tips' ? 'on' : '') + '">📜 Tips ' + tips + '</button></div></div></header><div class="dex-body"></div>';
    $('#dBack').addEventListener('click', function () { home(); });
    $$('.tabs button', d).forEach(function (b) { b.addEventListener('click', function () { Sfx.tap(); dexScreen(b.getAttribute('data-tab')); }); });
    var body = $('.dex-body', d);
    if (tab === 'tips') {
      body.innerHTML = '<p class="dex-note">神託で手に入れたコツ。🤔 なぜ？ を開くと理由が読めるよ。</p>' + TIPS.map(function (t) {
        var st = t.tip, have = S.tips[st.id];
        return have ? '<div class="card tip"><div class="tip-h"><span>' + esc(oracleNo(t.L)) + '</span></div><b class="tip-ti">' + esc(st.ti) + '</b><div class="tip-x">' + ja(st.x) + '</div>' + (st.why ? '<details><summary>🤔 なぜ？</summary><p>' + ja(st.why) + '</p></details>' : '') + '</div>'
          : '<div class="card tip locked"><b class="tip-ti">？？？</b><small>' + esc(oracleNo(t.L)) + ' でゲット</small></div>';
      }).join('');
      glossAll(body);
      return;
    }
    if (tab === 'book') {
      var ni = nextIdx(), html = '<p class="dex-note">これまでの神託の記録。クリアした神託は、何度でもやり直せるよ。</p>';
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
            html += '<button class="node boss' + st + '" data-i="' + x.i + '" style="--bc:' + B.col + '"><span class="ni">' + (open ? B.face : '🔒') + '</span><span class="nt"><small>' + (B.final ? 'FINAL BOSS' : 'BOSS') + '</small>' + (open ? esc(B.name) : '？？？') + '</span>' +
              (br && br.win ? '<span class="ns rk">' + br.rank + '</span>' : '') + '</button>';
          }
        });
        if (!nodes.length) html += '<div class="extra"><button class="mini" data-act="review">🔁 祈りの復習</button><button class="mini" data-act="rush">⚡ ラッシュ</button></div>';
        html += '</div></div>';
      });
      body.innerHTML = html;
      $$('.node', body).forEach(function (b) { b.addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); openNode(+b.getAttribute('data-i')); }); });
      $$('.mini', body).forEach(function (b) { b.addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); if (b.getAttribute('data-act') === 'review') reviewGo(); else rushIntro(); }); });
      return;
    }
    var html2 = '<button class="tb go" id="dPractice"' + (own ? '' : ' disabled') + '>🃏 カードで練習 <small>住人の命令で 🎧聞き取り・🧩並べ替え 10問</small></button>' +
      '<p class="dex-note">住人をタップすると、その1人だけで練習もできるよ。<br>🏆 神託ごとに5人そろえると 🎟+3・+50 XP</p>';
    D.lessons.forEach(function (L) {
      var mine = D.cards.filter(function (c) { return c.L === L.no; }), have = mine.filter(function (c) { return S.cards[c.id]; }).length;
      html2 += '<h3 class="dex-h">' + esc(oracleNo(L)) + (S.sets[L.no] ? '<span class="set done">🏆 COMPLETE</span>' : '<span class="set">' + have + ' / ' + mine.length + '</span>') + '</h3><div class="dex-grid">' + mine.map(slot).join('') + '</div>';
    });
    html2 += '<h3 class="dex-h">👑 ボス撃破の証（UR）</h3><div class="dex-grid">' + D.cards.filter(function (c) { return c.boss; }).map(slot).join('') + '</div>';
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
        modal(cardHtml(c, false) + '<p class="m-note">来た回数：' + S.cards[c.id] + '　練習で正解：' + (S.cardp[c.id] || 0) + '回</p>' +
          '<div class="tbs m-btns"><button class="tb go" id="mPractice">🎧 聞き取り ＋ 🧩 並べ替え</button></div>', 'card-m');
        $('#mPractice').addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); cardGo([c.id]); });
        glossEs($('#mbody .pcard')); autoSay(c.es);
      });
    });
  }

  function modal(html, cls) {
    var m = $('#modal'); $('#mbody').innerHTML = html; m.className = cls || ''; m.hidden = false;
    var box = $('.mbox', m); if (box.animate && !FX.RM) box.animate([{ transform: 'scale(.7)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.2,1.5,.4,1)' });
  }
  $('#modal').addEventListener('click', function (e) { if (e.target.id === 'modal' || e.target.closest('.mclose')) { $('#modal').hidden = true; Speech.stop(); } });

  /* =========================================================
   * ホーム（島の景色）
   *  次の神託は、島の人の頼みごととして出る。クリア直後は島が育つ演出 → 数秒で次の神託が自動スタート
   * ========================================================= */
  function openNode(i) {
    if (!nodeOpen(i)) return toast('🔒 前の神託をクリアすると開くよ');
    var n = ORDER[i];
    if (n.type === 'L') startLesson(LESSON[n.id]); else bossIntro(BOSS[n.id]);
  }
  var autoT = 0;
  function stopAuto() { clearInterval(autoT); autoT = 0; var c = $('#hCta'); if (c) c.classList.remove('counting'); var s = $('#hStop'); if (s) s.hidden = true; }
  function home(opts) {
    opts = opts || {};
    zStop(); cur = null; show('home');
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

    /* 次の神託（島の人の頼みごと）／ボス（災いの気配） */
    var cta = $('#hCta'), evEl = $('#hEv');
    evEl.innerHTML = ''; evEl.className = 'ev';
    if (ni < 0) {
      cta.innerHTML = '<small>創世 完了</small>⚡ ラッシュでハイスコア！';
      cta.className = 'cta';
      evEl.innerHTML = '<span class="ev-f">🦉</span><p>島の創世、おめでとう！<br>復習とラッシュで、命令の腕をみがこう。</p>';
    } else if (ORDER[ni].type === 'B') {
      var B = BOSS[ORDER[ni].id];
      cta.innerHTML = '<small>⚠ 災いが近づいている</small>' + B.face + ' ' + esc(B.name) + ' に立ち向かう';
      cta.className = 'cta boss';
      evEl.className = 'ev danger';
      evEl.innerHTML = '<span class="ev-f">' + B.face + '</span><p>「' + esc(B.line) + '」</p>';
    } else {
      var NL = LESSON[ORDER[ni].id], who = D.people[NL.ev.who];
      cta.innerHTML = '<small>📜 ' + esc(oracleNo(NL)) + '</small>' + esc(NL.ti);
      cta.className = 'cta';
      evEl.innerHTML = '<span class="ev-f">' + who.e + '</span><p><b>' + esc(who.n) + '</b>' + esc(NL.ev.line) + '</p>';
    }
    cta.onclick = function () { Sfx.unlock(); Sfx.tap(); stopAuto(); if (ni < 0) rushIntro(); else openNode(ni); };

    var unlocked = unlockedQs().length > 0, due = dueQs().length;
    $('#hDue').innerHTML = !unlocked ? '🔒' : due ? '<em>' + due + '</em> 問' : 'OK';
    $('#hRushBest').textContent = unlocked ? 'BEST ' + S.rushBest : '🔒';
    $('#hGachaN').textContent = '🎟 ' + S.tickets;
    $('#hBookN').textContent = Object.keys(S.cards).length + '人';
    $('#hReview').classList.toggle('alert', due >= 3);
    $('#hGacha').classList.toggle('alert', S.tickets > 0 && cardPool().length > 0);
    var m = mis(), md = MIS.filter(function (x) { return m.done[x.id]; }).length;
    $('#hMis').innerHTML = '📅 今日のミッション <b>' + MIS.map(function (x) { return m.done[x.id] ? '●' : '○'; }).join('') + '</b>' + (m.bonus ? ' コンプリート！' : ' <small>' + md + '/3</small>');
    $('#tgSound').checked = S.settings.sound; $('#tgSpeak').checked = S.settings.speak; $('#tgAuto').checked = S.settings.auto;

    if (growId) growFx(growId, popOld, popNow, ni);
    else { evEl.classList.add('on'); }
  }
  /* 島が育つ演出 → 次の神託の頼みごと → 自動スタート */
  function growFx(id, popOld, popNow, ni) {
    var news = $$('#isle .sp.new'), k = 0;
    later(function () { FX.slam(id === 'B3' ? '¡CREACIÓN!' : '¡CRECE!', 'gold', W.msg[id] || '島が育った！'); sfxDivine(); }, 300);
    (function one() {
      if (k >= news.length) return after();
      var s = news[k++];
      s.classList.add('in');
      var p = FX.at(s); FX.burst(p.x, p.y, { pal: 'divine', n: 22, ring: true }); Sfx.coin();
      later(one, 380);
    })();
    var t0 = performance.now(), popEl = $('#hPop b');
    later(function () {
      FX.pop($('#hPop'), 1.3);
      (function tick(t) { var q = Math.min(1, (t - t0 - 900) / 1200); if (q < 0) q = 0; popEl.textContent = num(Math.round(popOld + (popNow - popOld) * q)); if (q < 1) requestAnimationFrame(tick); })(performance.now());
      var pp = FX.at($('#hPop')); FX.floatText(pp.x, pp.y + 10, '👥 +' + num(popNow - popOld), '#7dffb0');
    }, 900);
    function after() {
      later(function () {
        var ev = $('#hEv'); ev.classList.add('on'); Sfx.whoosh();
        if (ni < 0 || !S.settings.auto || !$('#home') || $('#home').hidden) return;
        /* 自動スタート（数秒のカウント。「あとで」で止まる） */
        var cta = $('#hCta'), left = 5;
        cta.classList.add('counting'); cta.style.setProperty('--cd', '0%');
        $('#hStop').hidden = false;
        var tStart = Date.now();
        autoT = setInterval(function () {
          var q = Math.min(1, (Date.now() - tStart) / (left * 1000));
          cta.style.setProperty('--cd', Math.round(q * 100) + '%');
          if (q >= 1) { stopAuto(); if (!$('#home').hidden) cta.onclick(); }
        }, 60);
      }, 700);
    }
  }
  $('#hStop').addEventListener('click', function () { Sfx.tap(); stopAuto(); toast('🦉 了解。つづきは、また今度ね'); });
  $('#hReview').addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); reviewGo(); });
  $('#hRush').addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); rushIntro(); });
  $('#hGacha').addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); gachaScreen(); });
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
    showPop(f, '<b class="pw">' + p.e + ' ' + esc(p.n) + '</b><span>' + esc(p.d) + '</span>');
  });
  $('#hLv').addEventListener('click', function () {
    var L = levelOf(S.xp);
    modal('<div class="lvinfo"><b>神格 Lv.' + L.lv + '　' + esc(titleOf(L.lv)) + '</b><p>XP 合計 ' + S.xp + '　👥 人口 ' + num(population()) + '</p><ul>' + TITLES.map(function (t) { return '<li class="' + (L.lv >= t[0] ? 'on' : '') + '">Lv.' + t[0] + '　' + t[1] + '</li>'; }).join('') + '</ul></div>');
  });
  $('#tgSound').addEventListener('change', function (e) { S.settings.sound = e.target.checked; save(); if (e.target.checked) { Sfx.unlock(); Sfx.coin(); } });
  $('#tgSpeak').addEventListener('change', function (e) { S.settings.speak = e.target.checked; save(); if (e.target.checked) Speech.say('¡Hola!'); });
  $('#tgAuto').addEventListener('change', function (e) { S.settings.auto = e.target.checked; save(); });
  $('#hReset').addEventListener('click', function () {
    if (!confirm('記録をぜんぶ消しますか？（神格・住人・クリア記録）')) return;
    if (!confirm('本当に消しますか？ もとに戻せません。')) return;
    S = fresh(); save(); home(); toast('記録をリセットしました');
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[role=button]')) { e.preventDefault(); e.target.click(); }
  });
  if (SANDBOX) document.body.classList.add('sandbox');
  try { localStorage.setItem('le.news.manda.opened', '1'); } catch (e) { /* 保存できない環境 */ }
  /* 動作確認用：?sandbox で window.__manda（状態の参照・クリア記録の書きかえ） */
  if (SANDBOX) window.__manda = { S: function () { return S; }, save: save, home: home, start: function (id) { startLesson(LESSON[id]); }, boss: function (id) { bossIntro(BOSS[id]); }, finish: function () { if (cur) { cur.i = cur.L.steps.length; step(); } }, cur: function () { return cur; }, Q: QBY, WHO: WHO };
  home();
})();
