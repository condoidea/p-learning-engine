/* =========================================================
 * ¡QUE FUSIÓN! — スペイン語の関係詞（西検4級）
 *
 *  エンジンを使わない独立アプリ（mole/ と同じ考え方）。
 *   ホーム（ステージマップ・ミッション）→ レッスン（ケボットとトーク＋合体）→ ボス戦
 *   ほかに ⚡ラッシュ（60秒）・🔁復習（間隔反復）・🎰ガチャ（フレーズカード）・🃏図鑑・💡Tips
 *  保存：localStorage 'relativo.v1'（?sandbox なら 'relativo.sandbox'）
 *  教材：relativo/js/data/*.js、単語：shared/es-words.js
 * ========================================================= */
(function () {
  'use strict';
  var D = window.RQ, DICT = window.ES_WORDS;
  var DAY = 864e5;

  /* ---------- 小物 ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(t) { var d = new Date(t); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { return ymd(Date.now()); }
  function later(fn, ms) { return setTimeout(fn, ms); }
  function norm(w) { return String(w).replace(/[¿?¡!.,—:;]/g, '').toLowerCase(); }
  function plain(es) { return String(es).replace(/[\[\]{}^|]/g, '').replace(/___/g, '…'); }

  /* ---------- 保存 ---------- */
  var SANDBOX = /[?&]sandbox\b/.test(location.search);
  var KEY = SANDBOX ? 'relativo.sandbox' : 'relativo.v1';
  function fresh() {
    return { v: 1, xp: 0, tickets: 0, streak: { n: 0, last: '' }, lessons: {}, bosses: {}, q: {}, cards: {}, tips: {},
      mis: { d: '', done: {}, bonus: false }, rushBest: 0, pulls: 0, sets: {}, cardp: {}, settings: { sound: true, speak: true } };
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

  /* 単語帳（バルーン用） */
  var WORD = {};
  DICT.words.forEach(function (e) { [e.w].concat(e.f).forEach(function (f) { WORD[f.toLowerCase()] = e; }); });
  var POS = { n: '名詞', v: '動詞', adj: '形容詞', adv: '副詞', pron: '代名詞', art: '冠詞', prep: '前置詞', det: '', rel: '関係詞', int: '疑問詞', num: '数', phr: '表現', bad: '' };
  var LVN = { 5: '5級', 4: '4級', 3: '4級＋α', 0: '' };

  /* ---------- レベル・連続日数・ミッション ---------- */
  function need(lv) { return 100 + (lv - 1) * 40; }
  function levelOf(xp) { var lv = 1; while (xp >= need(lv)) { xp -= need(lv); lv++; } return { lv: lv, cur: xp, need: need(lv) }; }
  var TITLES = [[1, 'ケ見習い'], [3, 'つなぎ屋'], [5, '合体ルーキー'], [8, 'フュージョン職人'], [12, '関係詞ハンター'], [16, 'レラティーボ・マスター'], [20, 'QUE の王']];
  function titleOf(lv) { var t = TITLES[0][1]; TITLES.forEach(function (x) { if (lv >= x[0]) t = x[1]; }); return t; }
  function addXp(n) { var b = levelOf(S.xp).lv; S.xp += n; var a = levelOf(S.xp).lv; return a > b ? a : 0; }
  function touchDay() {
    var t = today();
    if (S.streak.last === t) return false;
    S.streak.n = S.streak.last === ymd(Date.now() - DAY) ? S.streak.n + 1 : 1;
    S.streak.last = t;
    return true;
  }
  var MIS = [{ id: 'stage', icon: '🗺', ti: 'レッスンかボスを1つクリア' }, { id: 'review', icon: '🔁', ti: '復習を1回やりきる' }, { id: 'rush', icon: '⚡', ti: 'ラッシュを1回' }];
  function mis() { if (S.mis.d !== today()) S.mis = { d: today(), done: {}, bonus: false }; return S.mis; }
  function missionDone(id) {
    var m = mis(), got = [];
    if (m.done[id]) return got;
    m.done[id] = 1; S.tickets += 1;
    got.push({ icon: '🎟', t: 'ミッション達成 +1' });
    if (MIS.every(function (x) { return m.done[x.id]; }) && !m.bonus) { m.bonus = true; S.tickets += 2; got.push({ icon: '🎉', t: 'ミッション コンプリート +2' }); }
    return got;
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

  /* ---------- 文の表示（色分け・バルーン） ---------- */
  function roles(h) {
    return h.replace(/\[([^\]]+)\]/g, '<span class="r-ante">$1</span>')
      .replace(/\{([^}]+)\}/g, '<span class="r-rel">$1</span>')
      .replace(/\^([^^]+)\^/g, '<span class="r-prep">$1</span>')
      .replace(/\|([^|]+)\|/g, '<span class="r-tap" role="button" tabindex="0">$1</span>')
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
  /* スペイン語の難しめの語（4級・4級＋α）に点線 */
  var WRE = /([A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)/;
  function glossEs(root) {
    $$('.es-line, .es', root).forEach(function (box) {
      walk(box, function (node) {
        if (node.parentNode.closest('.r-tap, .tok, .gw')) return;
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
  /* 日本語の用語（関係詞・先行詞…）に点線。1つの吹き出しで最初の1回だけ */
  var GRE = new RegExp('(' + Object.keys(D.gloss).sort(function (a, b) { return b.length - a.length; }).join('|') + ')');
  function glossJa(root) {
    var used = {};
    walk(root, function (node) {
      if (node.parentNode.closest('.es, .es-line, .gj, button')) return;
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
  /* 関係詞 → 先行詞 の矢印 */
  function drawArc(card) {
    $$('.es-line', card).forEach(function (line) {
      var rel = $('.r-rel', line), ante = $('.r-ante', line);
      if (!rel || !ante) return;
      var old = $('svg.arc', line); if (old) old.remove();
      var B = line.getBoundingClientRect(), a = ante.getBoundingClientRect(), r = rel.getBoundingClientRect();
      var x1 = r.left - B.left + Math.min(14, r.width / 2), y1 = r.top - B.top + 2, x2 = a.left - B.left + a.width / 2, y2 = a.top - B.top + 2;
      var top = Math.min(y1, y2) - 16, mx = (x1 + x2) / 2;
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'arc'); svg.setAttribute('width', B.width); svg.setAttribute('height', B.height);
      svg.innerHTML = '<path d="M' + x1 + ' ' + y1 + ' Q' + mx + ' ' + top + ' ' + x2 + ' ' + (y2 - 1) + '" pathLength="100"/><circle cx="' + x2 + '" cy="' + (y2 - 1) + '" r="3.5"/>';
      line.appendChild(svg);
    });
  }
  /* 1語ずつタップできる文（先行詞・まちがい探し・正体当て） */
  function toks(s, mark) {
    var marked = false;
    return esc(s).split(' ').map(function (w) {
      var m = /^([¿¡—]*)(.*?)([.,?!:;]*)$/.exec(w), core = m[2];
      var cls = 'tok';
      if (mark && !marked && core === mark) { cls += ' mk'; marked = true; }
      return m[1] + '<span class="' + cls + '" role="button" tabindex="0" data-n="' + esc(norm(core)) + '">' + core + '</span>' + m[3];
    }).join(' ');
  }

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

  /* トースト */
  var toastT = 0;
  function toast(msg) { var t = $('#toast'); t.innerHTML = msg; t.className = 'on'; clearTimeout(toastT); toastT = later(function () { t.className = ''; }, 2600); }

  /* ---------- 画面の切りかえ ---------- */
  function show(id) {
    $$('.screen').forEach(function (s) { s.hidden = s.id !== id; });
    document.body.setAttribute('data-screen', id);
    window.scrollTo(0, 0);
    if (id !== 'quiz' && id !== 'play') { feverOff(); FX.combo(0); }
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
      next: function (fn, label, cls) { t.innerHTML = ''; var b = btn(label || '▶ つぎへ', 'go ' + (cls || ''), function () { fn(); }); t.appendChild(b); if (!FX.RM) b.animate && b.animate([{ transform: 'translateY(30px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 260, easing: 'cubic-bezier(.2,1.5,.4,1)' }); },
      btns: function (list) { t.innerHTML = ''; var w = el('div', 'tbs'); list.forEach(function (x) { w.appendChild(btn(x.t, x.cls, x.fn)); }); t.appendChild(w); },
      options: function (list, cb, cls) {
        t.innerHTML = ''; var w = el('div', 'opts ' + (cls || ''));
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

  /* ---------- 正解・まちがいの演出（コンボ・FEVER） ---------- */
  var PRAISE = ['¡Bien!', '¡Muy bien!', '¡Genial!', '¡Perfecto!', '¡Olé!', '¡Increíble!'];
  function newRun() { return { combo: 0, best: 0, xp: 0, ok: 0, ng: 0, fever: false, misses: [] }; }
  function feverOn() { document.body.classList.add('fever'); }
  function feverOff() { document.body.classList.remove('fever'); }
  function hit(run, src, base) {
    run.combo++; run.ok++; run.best = Math.max(run.best, run.combo);
    var fever = run.combo >= 5;
    if (run.combo === 5) { run.fever = true; feverOn(); FX.slam('FEVER!!', 'rainbow', 'XP ×2'); Sfx.combo(10); }
    else if (run.combo === 3) FX.slam('NICE!', 'cyan');
    else if (run.combo === 10) { FX.slam('UNSTOPPABLE!!', 'gold'); Sfx.combo(10); FX.confetti(60); }
    else if (run.combo > 10 && run.combo % 5 === 0) { FX.slam(run.combo + ' COMBO!!', 'gold'); Sfx.combo(10); }
    var xp = ((base || 10) + Math.min(run.combo, 10)) * (fever ? 2 : 1);
    run.xp += xp;
    Sfx.correct(run.combo);
    var p = FX.at(src);
    FX.burst(p.x, p.y, { pal: fever ? 'rainbow' : 'ok', n: fever ? 40 : 26, ring: true });
    FX.floatText(p.x, p.y - 8, '+' + xp + ' XP', fever ? '#ffd23f' : '#4dff9a');
    if (run.combo >= 2 && Math.random() < 0.5) later(function () { FX.floatText(p.x + (Math.random() * 120 - 60), p.y - 40, PRAISE[Math.floor(Math.random() * PRAISE.length)], '#ff8fd0'); }, 180);
    FX.combo(run.combo, fever);
    return xp;
  }
  function miss(run, src) {
    run.combo = 0; run.ng++; run.fever = false;
    feverOff(); FX.combo(0); Sfx.wrong(); FX.shake(src); FX.flash('#ff2d55');
  }
  function bonus(run, n, src, label) { run.xp += n; var p = FX.at(src); FX.floatText(p.x, p.y, '+' + n + ' XP' + (label ? ' ' + label : ''), '#38e8ff'); }

  /* ---------- 間隔反復 ---------- */
  var IV = [0, 1, 2, 4, 7, 15, 30];
  function srs(q, ok) {
    var r = S.q[q.id] || (S.q[q.id] = { lv: 0, due: 0, ok: 0, ng: 0 });
    if (ok) { r.ok++; r.lv = Math.min(r.lv + 1, IV.length - 1); r.due = Date.now() + IV[r.lv] * DAY - 2 * 3600e3; }
    else { r.ng++; r.lv = 0; r.due = Date.now() + 10 * 60e3; }
  }
  /* ○✕ジャッジは1問が長いので、ほかのモードでは max 問までにする（道場ではぜんぶ） */
  function capJudge(list, max) { var j = 0; return list.filter(function (q) { return q.k !== 'judge' || j++ < max; }); }
  /* 出す順：期限切れ → 苦手 → まだ出ていない → ほか */
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
  var KIND = { pick: ['🎯', '空いている所に入るのは？'], ante: ['👆', '先行詞をタップ'], bug: ['🐛', 'まちがい探し'], which: ['🕵️', 'この que の正体は？'],
    ja: ['💬', '意味は？'], build: ['🧩', 'ならべて文を作ろう'], join: ['⚡', '正しい合体は？'], listen: ['🎧', '聞こえた文はどれ？'], ng: ['🚫', '＿＿ に入らない（NG）のはどれ？'], judge: ['⚖️', '○✕ジャッジ：＿＿ に入る？入らない？'] };
  var RELW = { que: 1, quien: 1, quienes: 1, donde: 1, cuyo: 1, cuya: 1, cuyos: 1, cuyas: 1 };
  var WHICH = ['関係詞', '接続詞（〜ということ）', '疑問詞（何・どこ）'];
  function firstOk(q) { for (var i = 0; i < q.items.length; i++) if (q.items[i].ok) return q.items[i].t; }
  /* ○✕ジャッジの「3つのチェック」と、表のその行 */
  var JROW = { 1: 'que ○・冠詞＋que ✕・quien ✕', 2: 'que ○・冠詞＋que △・quien ○（人）', 3: 'que ○（en・de・con）・冠詞＋que ○・quien ✕', 4: 'que ✕・冠詞＋que ○・quien ○' };
  function pathHtml(q) {
    var p = q.path;
    return '<p class="jpath">🔍 前置詞 <b>' + (p.prep ? 'あり（' + p.prep + '）' : 'なし') + '</b>・コンマ <b>' + (p.comma ? 'あり' : 'なし') + '</b>・先行詞 <b>' + (p.hum ? '人' : 'もの') + '</b>　' + esc(p.tag) +
      '<br>→ OK・NG 表の <b>' + p.row + '行目</b>：' + JROW[p.row] + (p.note ? '<br>💡 ' + esc(p.note) : '') + '</p>';
  }
  function fullOf(q) {
    if (q.k === 'judge') return q.s.replace('___', '{' + firstOk(q) + '}');
    if (q.k === 'pick') return q.s.replace('___', '{' + q.o[q.a] + '}');
    if (q.k === 'ng') return q.s.replace('___', '{' + q.o[q.a === 0 ? 1 : 0] + '}');
    if (q.k === 'bug') return q.ok;
    if (q.k === 'join' || q.k === 'listen') return q.o[q.a];
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
  /* まちがえたとき：自分の答えと正解をならべる（ちがう所に色） */
  function cmpHtml(q, chosen, withSay) {
    var you, right, mark = function (w) { return '<b class="wrong">' + esc(w) + '</b>'; };
    chosen = chosen == null ? '' : String(chosen);
    if (q.k === 'pick') { you = esHtml(q.s.replace('___', '\u0001')).replace('\u0001', mark(chosen)); right = esHtml(fullOf(q)); }
    else if (q.k === 'ng') { you = '「' + esc(chosen) + '」を NG にした → でも、これは<b class="okw">入る</b>'; right = '入らない（NG）のは ' + mark(q.o[q.a]); }
    else if (q.k === 'build') {
      /* 並べ替えは位置がずれた語に印（同じ語が別の位置にあるのも「ずれ」） */
      var yw = chosen.split(' '), cw = q.s.split(' ');
      you = yw.map(function (w, i) { return norm(w) === norm(cw[i] || '') ? esc(w) : mark(w); }).join(' ');
      right = cw.map(function (w, i) { return norm(w) === norm(yw[i] || '') ? esc(w) : '<b class="fix">' + esc(w) + '</b>'; }).join(' ');
    }
    else if (q.k === 'join' || q.k === 'listen') { var df = wordDiff(chosen, q.o[q.a]); you = df.a; right = df.b; }
    else if (q.k === 'ante') { you = '「' + esc(chosen) + '」をタップ'; right = '先行詞は「<b class="fix">' + esc(q.a) + '</b>」'; }
    else if (q.k === 'bug') { you = '「' + esc(chosen) + '」をまちがいにした'; right = 'まちがいは ' + mark(q.a) + ' → ' + esHtml(q.ok); }
    else if (q.k === 'which') { you = esc(chosen); right = '<b class="fix">' + WHICH[q.a] + '</b>'; }
    else if (q.k === 'judge') {
      var cm = chosen.split('');
      you = q.items.map(function (it, i) { var m = cm[i] === 'o' ? '○' : '✕', good = (cm[i] === 'o') === it.ok; return '<span class="ji">' + (good ? m + ' ' + esc(it.t) : '<b class="wrong">' + m + ' ' + esc(it.t) + '</b>') + '</span>'; }).join(' ');
      right = q.items.map(function (it, i) { var m = it.ok ? '○' : '✕', good = (cm[i] === 'o') === it.ok; return '<span class="ji">' + (good ? m + ' ' + esc(it.t) : '<b class="fix">' + m + ' ' + esc(it.t) + '</b>') + '</span>'; }).join(' ');
    }
    else { you = esc(chosen); right = '<b class="fix">' + esc(q.o[q.a]) + '</b>'; }
    var es = q.k === 'pick' || q.k === 'build' || q.k === 'join' || q.k === 'listen' || q.k === 'bug';
    return '<div class="cmp"><div class="cmp-row ng"><i>✕ あなた</i><span' + (es ? ' class="es"' : '') + '>' + you + '</span></div>' +
      '<div class="cmp-row ok' + (withSay && es ? ' has-say' : '') + '"><i>○ 正解</i><span' + (es ? ' class="es"' : '') + '>' + right + '</span>' + (withSay && es ? sayBtn(fullOf(q)) : '') + '</div></div>';
  }
  function renderQ(q, card, T, opts, cb) {
    opts = opts || {};
    var t0 = Date.now(), done = false;
    card.className = 'card qcard k-' + q.k + (opts.fast ? ' fast' : '');
    card.setAttribute('data-q', q.id);
    var body = '';
    if (q.k === 'pick' || q.k === 'ja' || q.k === 'ng') body = '<div class="es-line">' + esHtml(q.s) + '</div>';
    else if (q.k === 'judge') body = '<div class="es-line">' + esHtml(q.s) + '</div>';
    else if (q.k === 'ante' || q.k === 'bug' || q.k === 'which') body = '<div class="es-line toks">' + toks(q.s, q.k === 'which' ? q.w : null) + '</div>';
    else if (q.k === 'build') body = '<div class="build-line"></div>';
    else if (q.k === 'listen') body = Speech.ok() ? '<div class="listen"><button class="say big" data-say="' + esc(q.s) + '" aria-label="もう一度聞く">🔊</button><button class="say slow" data-say="' + esc(q.s) + '" aria-label="ゆっくり聞く">🐢</button><small>何度でも聞けるよ</small></div>'
      : '<p class="why">（この端末ではスペイン語の音声が使えないので、日本語の意味から選ぼう）</p><div class="es-line">' + esc(q.ja) + '</div>';
    else if (q.k === 'join') body = '<div class="join"><div class="es-line sm">' + esHtml(q.p[0]) + '</div><div class="fz-plus">＋</div><div class="es-line sm">' + esHtml(q.p[1]) + '</div></div>';
    var showJa = q.ja && q.k !== 'ja' && q.k !== 'join' && q.k !== 'listen';
    card.innerHTML = '<div class="qtag"><span>' + KIND[q.k][0] + '</span> ' + KIND[q.k][1] + (opts.tag ? '<em>' + esc(opts.tag) + '</em>' : '') + '</div>' + body +
      (showJa ? '<div class="ja-line">' + esc(q.ja) + '</div>' : '') + (q.k === 'judge' ? '<div class="jrows"></div>' : '') + '<div class="qres"></div>';
    glossEs(card);
    if (q.k === 'listen' && Speech.ok()) later(function () { if (!done) Speech.say(q.s); }, 350);
    if (q.k === 'ante') {
      var rw = $$('.tok', card).filter(function (t) { return RELW[t.getAttribute('data-n')]; })[0];
      if (rw) rw.classList.add('mk');
    }

    function finish(ok, chosenText) {
      if (done) return; done = true;
      var ms = Date.now() - t0;
      card.classList.add(ok ? 'is-ok' : 'is-ng');
      if (!ok && opts.run) (opts.run.misses = opts.run.misses || []).push({ q: q, c: chosenText });
      if (!opts.fast) result(ok, chosenText);
      cb(ok, ms, chosenText);
    }
    function result(ok, chosen) {
      var r = $('.qres', card), s = fullOf(q);
      if (q.k === 'judge') {
        r.innerHTML = (ok ? '<b class="rk ok">⭕ 全部正解！</b>' : '<b class="rk ng">❌ 赤い行を見てみよう（あなた → 正解）</b>') + pathHtml(q) +
          '<div class="es-line ans">' + esHtml(s) + sayBtn(s) + '</div>';
        glossAll(r); autoSay(s);
        return;
      }
      var head = ok ? '<b class="rk ok">⭕ ' + PRAISE[Math.floor(Math.random() * 4)] + '</b>' : '<b class="rk ng">❌ おしい！ くらべてみよう</b>' + cmpHtml(q, chosen, true);
      r.innerHTML = head +
        (q.k === 'ng' && ok ? '<p class="ngok">OK の形：' + q.o.filter(function (o, i) { return i !== q.a; }).map(function (o) { return '<b>' + esc(o) + '</b>'; }).join('・') + '　／　NG：<s>' + esc(q.o[q.a]) + '</s></p>' : '') +
        (!ok && q.k !== 'ng' && q.k !== 'ante' && q.k !== 'which' && q.k !== 'ja' || ok && q.k !== 'bug' && q.k !== 'join' && q.k !== 'pick' && q.k !== 'listen' && q.k !== 'ng' ? '' : '<div class="es-line ans">' + esHtml(s) + sayBtn(s) + '</div>') +
        (q.k === 'ja' ? '<div class="ja-line">' + esc(q.o[q.a]) + '</div>' : (q.k === 'join' || q.k === 'listen') && q.ja ? '<div class="ja-line">' + esc(q.ja) + '</div>' : '') +
        (q.why ? '<p class="why">' + ja(q.why) + '</p>' : '');
      glossAll(r);
      autoSay(s);
    }

    if (q.k === 'pick' || q.k === 'ja' || q.k === 'join' || q.k === 'which' || q.k === 'listen' || q.k === 'ng') {
      var labels = q.k === 'which' ? WHICH : q.o;
      var ans = q.a;
      var list = labels.map(function (l, i) { return { label: l, i: i }; });
      if (q.k !== 'which') list = shuffle(list);
      T.options(list, function (i, b, wrap) {
        var ok = i === ans;
        if (q.k === 'pick') { var bl = $('.blank', card); if (bl) { bl.textContent = q.o[i]; bl.className = 'blank filled ' + (ok ? 'ok' : 'ng'); } }
        if (q.k === 'ng') { var bn = $('.blank', card); if (bn) { bn.textContent = q.o[i]; bn.className = 'blank filled ' + (ok ? 'ng-hit' : 'ok'); } }
        markOpts(wrap, ans, i);
        finish(ok, q.k === 'which' ? labels[i] : q.o[i]);
      }, q.k === 'join' || q.k === 'ja' || q.k === 'listen' ? 'long' : '');
      return;
    }
    if (q.k === 'judge') {
      var box = $('.jrows', card), marks = {}, nMarked = 0;
      box.innerHTML = shuffle(q.items.map(function (x, i) { return i; })).map(function (i) {
        return '<div class="jrow" data-i="' + i + '"><span class="jt">' + esc(q.items[i].t) + '</span><button class="jb" data-m="o" aria-label="入る">○</button><button class="jb" data-m="x" aria-label="入らない">✕</button></div>';
      }).join('');
      T.hint('全部の形に <b class="c-ok">○（入る）</b>か <b class="c-ng">✕（入らない）</b>をつけよう');
      $$('.jb', box).forEach(function (b) {
        b.addEventListener('click', function () {
          if (done) return;
          var r = b.parentNode, i = +r.getAttribute('data-i');
          if (!marks[i]) nMarked++;
          marks[i] = b.getAttribute('data-m'); Sfx.tap();
          $$('.jb', r).forEach(function (x) { x.classList.toggle('on', x === b); });
          if (nMarked === q.items.length) T.next(judge, '⚖️ 判定！');
        });
      });
      function judge() {
        var ok = true;
        $$('.jrow', box).forEach(function (r) {
          var i = +r.getAttribute('data-i'), it = q.items[i], hitR = marks[i] === (it.ok ? 'o' : 'x');
          if (!hitR) ok = false;
          r.classList.add(hitR ? 'ok' : 'ng');
          r.insertAdjacentHTML('beforeend', '<small class="jw">' + (hitR ? (it.ok ? '○ ' : '✕ ') : 'あなた ' + (marks[i] === 'o' ? '○' : '✕') + ' → 正解 ' + (it.ok ? '○' : '✕') + '　') + esc(it.why) + '</small>');
          $$('.jb', r).forEach(function (x) { x.disabled = true; if (!hitR && x.getAttribute('data-m') === (it.ok ? 'o' : 'x')) x.classList.add('should'); });
        });
        T.clear();
        finish(ok, q.items.map(function (x, i) { return marks[i]; }).join(''));
      }
      return;
    }
    if (q.k === 'ante' || q.k === 'bug') {
      T.hint(q.k === 'ante' ? '👆 <b class="c-rel">ピンク</b>の関係詞が説明している名詞（<b class="c-ante">先行詞</b>）をタップ' : '👆 まちがっている語を1つタップ');
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
    if (q.k === 'build') {
      var words = q.s.split(' '), last = words[words.length - 1], end = (/[.?!]+$/.exec(last) || [''])[0];
      words[words.length - 1] = last.slice(0, last.length - end.length);
      var line = $('.build-line', card), placed = [];
      var tiles = shuffle(words.concat(q.d || []));
      T.clear();
      var pool = el('div', 'tiles'), dragEnd = 0;
      /* タップ：下のタイル → 文の最後に追加／並べたタイル → 下に戻す
       * ドラッグ：下のタイル → 好きな位置に入れる／並べたタイル → 位置を入れかえる（文の外に出すと下に戻る） */
      function insertAt(item, at) {
        if (at == null || at >= placed.length) { placed.push(item); line.appendChild(item.el); }
        else { line.insertBefore(item.el, placed[at].el); placed.splice(at, 0, item); }
      }
      function place(btn, w, at) {
        btn.classList.add('used');
        var p = el('span', 'tile on', esc(w)); p.setAttribute('role', 'button');
        var item = { w: w, el: p, src: btn };
        p.addEventListener('click', function () { if (done || Date.now() - dragEnd < 400) return; Sfx.tap(); unplace(item); });
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
      var caret = null;
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
          if (done || (!item && btn.classList.contains('used'))) return;
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
            if (done || ev.type === 'pointercancel') return;
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
          if (done || b.classList.contains('used') || Date.now() - dragEnd < 400) return;
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
        finish(ok, placed.map(function (x) { return x.w; }).join(' ') + end);
      }
      paint();
    }
  }

  /* =========================================================
   * レッスン（ケボットとのトーク）
   * ========================================================= */
  var feed = $('#feed');
  function scrollFeed() { later(function () { feed.scrollTo({ top: feed.scrollHeight, behavior: FX.RM ? 'auto' : 'smooth' }); }, 30); }
  function addBot(x, mood, cls) {
    var w = el('div', 'msg bot-msg ' + (cls || ''), '<div class="av">' + FX.bot(mood) + '</div><div class="bub">' + ja(x) + '</div>');
    glossAll(w); feed.appendChild(w); scrollFeed(); return w;
  }
  function addMe(x) { var w = el('div', 'msg me-msg', '<div class="bub">' + ja(x) + '</div>'); feed.appendChild(w); scrollFeed(); return w; }
  function addCard(c) { feed.appendChild(c); scrollFeed(); return c; }
  function exCard(es, jaTxt) {
    var c = el('div', 'card ex', '<div class="es-line big">' + esHtml(es) + '</div><div class="ja-line">' + esc(jaTxt) + '</div>' + sayBtn(es));
    glossEs(c); return c;
  }

  var cur = null;   // いまのレッスン
  function startLesson(L) {
    show('play');
    feed.innerHTML = ''; T1.clear();
    $('#pTitle').textContent = 'L' + L.no + '  ' + L.ti;
    cur = { L: L, i: 0, run: newRun(), used: {}, tips: [] };
    L.steps.forEach(function (st) { if (st.t === 'q') cur.used[st.id] = 1; });
    var intro = el('div', 'card lesson-title', '<small>LESSON ' + L.no + '</small><b>' + L.icon + ' ' + esc(L.ti) + '</b><span>' + esc(L.sub) + '</span>');
    addCard(intro);
    FX.slam('LESSON ' + L.no, 'cyan', L.ti);
    later(step, 500);
  }
  function setProg() { if (!cur) return; $('#pProg').style.width = Math.round(cur.i / cur.L.steps.length * 100) + '%'; $('#pXp').textContent = cur.run.xp; }
  function step() {
    if (!cur) return;
    T1.clear();
    setProg();
    if (cur.i >= cur.L.steps.length) return finishLesson();
    var st = cur.L.steps[cur.i++], run = cur.run;
    ({ say: doSay, ex: doEx, fuse: doFuse, morph: doMorph, ask: doAsk, tip: doTip, q: doQ, drill: doDrill })[st.t](st, run);
  }
  function nextBtn() { if (!cur) return; setProg(); T1.next(step); }

  function doSay(st) {
    addBot(st.x, '');
    if (!st.more) return nextBtn();
    T1.btns([
      { t: 'わかった ▶', cls: 'go', fn: function () { addMe('わかった！'); step(); } },
      { t: '🤔 なんで？', cls: 'sub', fn: function () { addMe('🤔 なんで？'); addBot(st.more, 'happy', 'more'); nextBtn(); } }
    ]);
  }
  function doEx(st) {
    var c = addCard(exCard(st.es, st.ja));
    later(function () { drawArc(c); }, 450);
    autoSay(st.es);
    nextBtn();
  }
  function fusionFx(c, out, jaTxt, run) {
    c.innerHTML = '<div class="fz-tag on">FUSION!!</div><div class="es-line big">' + esHtml(out) + '</div><div class="ja-line">' + esc(jaTxt) + '</div>' + sayBtn(out);
    glossEs(c); c.classList.add('fused');
    later(function () { drawArc(c); }, 680);
    FX.slam('FUSION!!', 'pink'); Sfx.crit();
    var p = FX.at(c); FX.burst(p.x, p.y, { pal: 'rainbow', n: 60, sp: 11, ring: true });
    bonus(run, 15, c, '合体ボーナス');
    autoSay(out); scrollFeed();
    nextBtn();
  }
  function doFuse(st, run) {
    var c = addCard(el('div', 'card fuse', '<div class="fz-tag">FUSION</div><div class="fz-a es-line">' + esHtml(st.a) + '</div><div class="fz-plus">＋</div><div class="fz-b es-line">' + esHtml(st.b) + '</div>'));
    glossEs(c);
    T1.hint('👆 ' + st.hint);
    var chunk = $('.r-tap', c);
    function go() {
      chunk.removeEventListener('click', go);
      Sfx.tap(); var p = FX.at(chunk); FX.burst(p.x, p.y, { pal: 'rel', n: 30 });
      chunk.classList.add('zap'); T1.clear();
      later(function () {
        var b = $('.fz-b', c); b.innerHTML = esHtml(st.bt); b.classList.add('morph'); FX.pop(b, 1.12); Sfx.whoosh();
        later(function () { c.classList.add('merging'); later(function () { c.classList.remove('merging'); fusionFx(c, st.out, st.ja, run); }, 420); }, 1000);
      }, 380);
    }
    chunk.addEventListener('click', go);
  }
  function doMorph(st, run) {
    var c = addCard(el('div', 'card fuse', '<div class="fz-tag">CUT</div><div class="fz-b es-line big">' + esHtml(st.es) + '</div>'));
    glossEs(c);
    T1.hint('👆 ' + st.hint);
    var chunk = $('.r-tap', c);
    function go() {
      chunk.removeEventListener('click', go);
      Sfx.whoosh(); var p = FX.at(chunk); FX.burst(p.x, p.y, { pal: 'rel', n: 30 });
      chunk.classList.add('zap'); T1.clear();
      later(function () { fusionFx(c, st.out, st.ja, run); $('.fz-tag', c).textContent = 'SMART!!'; }, 650);
    }
    chunk.addEventListener('click', go);
  }
  function doAsk(st, run) {
    var c = addCard(el('div', 'card ask' + (st.pred ? ' pred' : ''), '<div class="qtag">' + (st.pred ? '🤔 予想してみて <em>まちがえても OK</em>' : '❓ クイズ') + '</div><div class="qq">' + ja(st.q) + '</div>' + (st.es ? '<div class="es-line">' + esHtml(st.es) + '</div>' : '')));
    glossAll(c);
    var list = st.o.map(function (o, i) { return { label: o, i: i }; });
    if (!st.pred) list = shuffle(list);
    T1.options(list, function (i, b, wrap) {
      var ok = i === st.a;
      var bl = $('.blank', c); if (bl) { bl.textContent = st.o[st.pred ? st.a : i]; bl.className = 'blank filled ' + (ok || st.pred ? 'ok' : 'ng'); }
      if (st.pred) {
        markOpts(wrap, st.a, -1);
        addMe(st.o[i]);
        if (ok) { bonus(run, 8, b, '予想的中！'); Sfx.correct(2); } else Sfx.tap();
        later(function () { addBot((ok ? '🎯 ' : '') + st.r, ok ? 'happy' : 'wow'); nextBtn(); }, 350);
        return;
      }
      markOpts(wrap, st.a, i);
      if (ok) hit(run, b); else miss(run, c);
      addMe((ok ? '⭕ ' : '✕ ') + st.o[i]);
      later(function () {
        addBot(ok ? '⭕ ' + (st.why || 'そのとおり！') : '❌「' + st.o[i] + '」ではなく、正解は「' + st.o[st.a] + '」。' + (st.why ? '\n' + st.why : ''), ok ? 'happy' : 'sad');
        nextBtn();
      }, 350);
    });
  }
  /* Tips カードの中身（レッスンと Tips ノートで共通）。tbl があれば OK・NG 表 */
  var MARK = { o: ['ok', '○'], x: ['ng', '✕'], w: ['mid', '△'] };
  function tipBody(st) {
    var t = '';
    if (st.tbl) {
      t = '<div class="tbl-wrap"><table class="oknd"><colgroup><col class="c0"><col><col><col></colgroup><thead><tr>' + st.tbl.head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        st.tbl.rows.map(function (r) {
          return '<tr><th>' + r[0] + '</th>' + r.slice(1).map(function (c) {
            var m = MARK[c.split('|')[0]], note = c.split('|')[1];
            return '<td class="' + m[0] + '"><b>' + m[1] + '</b>' + (note ? '<small>' + esc(note) + '</small>' : '') + '</td>';
          }).join('') + '</tr>';
        }).join('') + '</tbody></table></div>';
    }
    return '<b class="tip-ti">' + esc(st.ti) + '</b>' + t + '<div class="tip-x">' + ja(st.x) + '</div>' +
      (st.more ? '<div class="tip-more">' + ja(st.more) + '</div>' : '') +
      (st.why ? '<details><summary>🤔 なぜ？</summary><p>' + ja(st.why) + '</p></details>' : '');
  }
  function doTip(st, run) {
    var first = !S.tips[st.id];
    S.tips[st.id] = 1; save();
    var c = addCard(el('div', 'card tip' + (st.tbl ? ' has-tbl' : ''), '<div class="tip-h"><span>💡 TIP GET!</span>' + (first ? '<em>NEW</em>' : '') + '</div>' + tipBody(st)));
    glossAll(c);
    if (first) { Sfx.coin(); var p = FX.at(c); FX.burst(p.x, p.y, { pal: 'gold', n: 30 }); bonus(run, 5, c, 'Tips'); }
    nextBtn();
  }
  function lessonQ(q, run, then) {
    var c = addCard(el('div', 'card qcard'));
    renderQ(q, c, T1, { run: run }, function (ok) {
      srs(q, ok); save();
      var src = $('.chosen', T1.el) || $('.tok.ok, .tok.ng', c) || c;
      if (ok) hit(run, src); else miss(run, c);
      scrollFeed();
      later(then, 250);
    });
  }
  function doQ(st, run) { lessonQ(QBY[st.id], run, nextBtn); }
  function doDrill(st, run) {
    var pool = D.questions.filter(function (q) { return q.L === cur.L.no && !cur.used[q.id]; });
    var list = capJudge(weighted(pool), 1).slice(0, st.n);
    addBot('よし、仕上げの **ドリル** だ！\n' + list.length + '問、連続正解で FEVER をねらえ🔥', 'happy');
    FX.slam('DRILL ×' + list.length, 'gold');
    var k = 0, me = cur;
    function one() {
      if (cur !== me) return;
      if (k >= list.length) return nextBtn();
      var q = list[k++];
      lessonQ(q, run, function () { setProg(); T1.next(one, k < list.length ? '▶ つぎの問題（' + (k + 1) + '/' + list.length + '）' : '▶ クリア！'); });
    }
    later(one, 700);
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
      S.cards[card.id] = (S.cards[card.id] || 0) + 1;
    }
    S.lessons[L.id] = { done: true, stars: Math.max(stars, rec.stars || 0), at: Date.now() };
    var sets = setRewards();
    rewards = rewards.concat(missionDone('stage'), sets);
    setFx(sets);
    touchDay();
    var up = addXp(run.xp);
    save(); cur = null;
    var ni = nextIdx();
    showResult({ title: 'STAGE CLEAR!!', sub: 'L' + L.no + ' ' + L.ti, stars: stars, run: run, rewards: rewards, card: card, up: up, unlock: first && ni >= 0 ? ORDER[ni] : null,
      next: ni >= 0 ? { label: nodeLabel(ORDER[ni]), fn: function () { openNode(ni); } } : null });
  }
  $('#pQuit').addEventListener('click', function () {
    if (cur && !confirm('レッスンをやめる？\n（このレッスンの進み具合は保存されません。答えた問題は復習に入ります）')) return;
    cur = null; Speech.stop(); home();
  });

  /* =========================================================
   * 結果画面
   * ========================================================= */
  function nodeLabel(n) { if (n.type === 'L') { var L = LESSON[n.id]; return '▶ L' + L.no + ' ' + L.ti; } var B = BOSS[n.id]; return '⚔ ボス戦：' + B.name; }
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
      '<div class="res-xp"><div class="rx-top"><b>+<span id="rXp">0</span> XP</b><span>Lv.<b id="rLv">' + lvBefore.lv + '</b></span></div><span class="lv-bar big"><i id="rBar" style="width:' + Math.round(lvBefore.cur / lvBefore.need * 100) + '%"></i></span></div>' +
      (o.rewards && o.rewards.length ? '<ul class="rewards">' + o.rewards.map(function (r) { return '<li><span>' + r.icon + '</span>' + esc(r.t) + '</li>'; }).join('') + '</ul>' : '') +
      (o.card ? '<div class="newcard"><p>🃏 カードをゲット！ タップでめくる</p>' + cardHtml(o.card, true) + '</div>' : '') +
      (o.unlock ? '<p class="unlock">🔓 解放：' + esc(nodeLabel(o.unlock).replace(/^[▶⚔] /, '')) + '</p>' : '') +
      (o.note ? '<p class="res-note">' + o.note + '</p>' : '') +
      (run.misses && run.misses.length ? '<details class="misses"' + (o.openMisses ? ' open' : '') + '><summary>📝 まちがえた問題を見直す（' + run.misses.length + '問）</summary>' +
        run.misses.map(function (m) {
          var full = fullOf(m.q);
          return '<div class="miss"><div class="es-line sm">' + esHtml(full) + sayBtn(full) + '</div>' + (m.q.ja ? '<div class="ja-line">' + esc(m.q.ja) + '</div>' : '') +
            cmpHtml(m.q, m.c) + (m.q.k === 'judge' ? pathHtml(m.q) : '') + (m.q.why ? '<p class="why">' + ja(m.q.why) + '</p>' : '') + '</div>';
        }).join('') + '</details>' : '') +
      '<div class="res-btns"></div></div>';
    var bt = $('.res-btns', scr);
    if (o.retry) bt.appendChild(mkBtn(o.retry.label, 'go', o.retry.fn));
    if (o.next) bt.appendChild(mkBtn(o.next.label, o.retry ? 'sub' : 'go', o.next.fn));
    bt.appendChild(mkBtn('🏠 ホームへ', 'sub', home));
    /* 演出 */
    if (o.lose) { Sfx.wrong(); FX.shake(null, true); }
    else { FX.slam(o.title, o.rank === 'S' || o.stars === 3 ? 'gold' : 'pink'); FX.confetti(o.stars === 3 || o.rank === 'S' ? 160 : 80); Sfx.levelUp(); }
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
    Sfx.levelUp(); FX.confetti(200); FX.flash('#ffd23f');
    modal('<div class="lvup"><small>LEVEL UP!!</small><b>' + lv + '</b><span>称号：' + esc(titleOf(lv)) + '</span>' + FX.bot('happy') + '</div>', 'lvup-m');
  }

  /* =========================================================
   * カード
   * ========================================================= */
  var RCOL = { N: 'n', R: 'r', SR: 'sr', SSR: 'ssr', UR: 'ur' };
  function cardHtml(c, back) {
    return '<div class="pcard rr-' + RCOL[c.r] + (back ? ' down' : '') + '" data-c="' + c.id + '" role="button" tabindex="0">' +
      '<div class="pc-in"><div class="pc-front"><span class="pc-r">' + c.r + '</span><span class="pc-tag">' + esc(c.tag) + '</span>' +
      '<div class="es-line">' + esHtml(c.es) + '</div><div class="ja-line">' + esc(c.ja) + '</div>' + sayBtn(c.es) + '</div>' +
      '<div class="pc-back"><b>¿QUE?</b></div></div></div>';
  }
  function flipCard(nc) {
    if (!nc.classList.contains('down')) return;
    nc.classList.remove('down');
    var c = CARD[nc.getAttribute('data-c')];
    var tier = { N: 'common', R: 'rare', SR: 'epic', SSR: 'legendary', UR: 'legendary' }[c.r];
    Sfx.chestOpen(tier);
    var p = FX.at(nc); FX.burst(p.x, p.y, { pal: c.r === 'N' ? 'ok' : c.r === 'R' ? 'ok' : c.r === 'SR' ? 'rel' : 'gold', n: c.r === 'N' ? 20 : 60, sp: 10, ring: true });
    if (c.r === 'SSR' || c.r === 'UR') { FX.slam(c.r + '!!', c.r === 'UR' ? 'rainbow' : 'gold'); FX.confetti(80, c.r === 'UR' ? 'rainbow' : 'gold'); }
    glossEs(nc);
    later(function () { drawArc(nc); }, 700);
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

  /* ----- ボス ----- */
  function bossIntro(B) {
    zStop(); show('quiz'); feverOff();
    $('#zTitle').textContent = (B.final ? 'FINAL BOSS' : 'BOSS') + '  ' + B.name; $('#zProg').style.width = '0%'; $('#zRight').innerHTML = '';
    zHud.innerHTML = '<div class="warn"><span>⚠ WARNING ⚠ WARNING ⚠ WARNING ⚠ WARNING ⚠</span></div>';
    var rec = S.bosses[B.id];
    zMain.innerHTML = '<div class="boss-intro" style="--bc:' + B.col + '"><div class="bface big">' + B.face + '</div><small>' + esc(B.en) + '</small><h2>' + esc(B.name) + '</h2>' +
      '<p class="bline">「' + esc(B.line) + '」</p>' +
      '<ul class="rules"><li>❤️ ライフは3つ。まちがえると1つ減る</li><li>⚡ すばやく正解するとクリティカル（ダメージ1.5倍）</li><li>🏆 ノーミスで S ランク</li><li>📚 出題：' + B.from.map(function (id) { return 'L' + LESSON[id].no; }).join('・') + '</li></ul>' +
      (rec && rec.win ? '<p class="best">これまでの最高：<b>' + rec.rank + '</b> ランク</p>' : '') + '</div>';
    Sfx.combo(10); FX.shake(null, true);
    T2.next(function () { bossFight(B); }, '⚔ たたかう！', 'boss');
  }
  function bossFight(B) {
    var pool = capJudge(shuffle(D.questions.filter(function (q) { return B.from.indexOf('L' + q.L) >= 0; })), 3);
    var queue = weighted(pool), qi = 0;
    var hpMax = 1000, hp = hpMax, hearts = 3, dmgBase = Math.ceil(hpMax / B.n), n = 0;
    zRun = newRun(); zActive = true;
    zHud.innerHTML = '<div class="bhud" style="--bc:' + B.col + '"><div class="bface" id="bFace">' + B.face + '</div><div class="bstat"><b>' + esc(B.name) + '</b><span class="hp"><i id="bHp"></i><em id="bHpN">' + hp + '</em></span></div><div class="hearts" id="bHearts"></div></div>';
    function paint() {
      $('#bHp').style.width = Math.max(0, hp / hpMax * 100) + '%'; $('#bHpN').textContent = Math.max(0, hp);
      $('#bHearts').innerHTML = [0, 1, 2].map(function (k) { return '<i class="' + (k < hearts ? 'on' : '') + '">❤️</i>'; }).join('');
      $('#zProg').style.width = Math.round((hpMax - hp) / hpMax * 100) + '%';
      $('#zRight').innerHTML = '<small>XP</small><b>' + zRun.xp + '</b>';
    }
    paint();
    FX.slam('FIGHT!!', 'pink');
    function one() {
      if (!zActive) return;
      if (qi >= queue.length) { queue = weighted(pool); qi = 0; }
      var q = queue[qi++]; n++;
      var c = zCard();
      var limit = q.k === 'build' || q.k === 'judge' ? 18000 : q.k === 'join' || q.k === 'ja' ? 9000 : 6000;
      renderQ(q, c, T2, { run: zRun, tag: 'TURN ' + n }, function (ok, ms) {
        srs(q, ok); save();
        var face = $('#bFace');
        if (ok) {
          var crit = ms < limit, dmg = Math.round(dmgBase * (crit ? 1.5 : 1));
          hp -= dmg;
          hit(zRun, $('.chosen', T2.el) || c, crit ? 15 : 10);
          var p = FX.at(face);
          later(function () {
            FX.burst(p.x, p.y, { pal: crit ? 'gold' : 'ok', n: crit ? 60 : 30, sp: 11, ring: true });
            FX.floatText(p.x, p.y + 10, (crit ? 'CRITICAL! ' : '') + '-' + dmg, crit ? '#ffd23f' : '#ffffff');
            FX.shake(face, true); face.classList.add('hurt'); later(function () { face.classList.remove('hurt'); }, 400);
            if (crit) { Sfx.crit(); FX.slam('CRITICAL!!', 'gold'); }
            paint();
            if (hp <= 0) return later(function () { bossEnd(B, true, hearts); }, 700);
            T2.next(one, '▶ つぎのターン');
          }, 260);
        } else {
          hearts--;
          miss(zRun, c);
          face.classList.add('atk'); later(function () { face.classList.remove('atk'); }, 500);
          later(function () {
            FX.shake(null, true); FX.flash('#ff0040'); paint();
            if (hearts <= 0) return later(function () { bossEnd(B, false, 0); }, 900);
            T2.next(one, '▶ 立て直す（❤️ ' + hearts + '）');
          }, 300);
        }
      });
    }
    one();
  }
  function bossEnd(B, win, hearts) {
    zStop();
    var rewards = [], card = null, rank = win ? (hearts === 3 ? 'S' : hearts === 2 ? 'A' : 'B') : null;
    var rec = S.bosses[B.id] || {};
    if (win) {
      zRun.xp += B.final ? 200 : 100;
      if (!rec.win) {
        S.tickets += 5; rewards.push({ icon: '🎟', t: '初撃破 +5' });
        card = CARD['u-' + B.id]; S.cards[card.id] = (S.cards[card.id] || 0) + 1;
      } else { S.tickets += 1; rewards.push({ icon: '🎟', t: '撃破 +1' }); }
      var better = !rec.rank || 'SAB'.indexOf(rank) < 'SAB'.indexOf(rec.rank);
      S.bosses[B.id] = { win: true, rank: better ? rank : rec.rank, at: Date.now() };
      rewards = rewards.concat(missionDone('stage'));
    }
    touchDay();
    var up = addXp(zRun.xp);
    save();
    var ni = nextIdx();
    showResult({ title: win ? (B.final ? 'ALL CLEAR!!' : 'K.O.!!') : 'GAME OVER', sub: B.name + (win ? ' を倒した！' : ' にやられた…'), lose: !win, rank: rank, run: zRun, rewards: rewards, card: card, up: up,
      unlock: win && !rec.win && ni >= 0 ? ORDER[ni] : null,
      note: win ? (B.final && rank !== 'S' ? 'ノーミスで S ランクをねらってみよう！' : '') : '答えた問題は復習に入ったよ。説明を思い出して、もう一回！',
      retry: win ? null : { label: '⚔ もう一回！', fn: function () { bossIntro(B); } },
      next: win && ni >= 0 ? { label: nodeLabel(ORDER[ni]), fn: function () { openNode(ni); } } : null });
  }

  /* ----- ラッシュ（60秒） ----- */
  function rushIntro() {
    var pool = unlockedQs().filter(function (q) { return q.k !== 'build' && q.k !== 'join' && q.k !== 'judge'; });
    if (!pool.length) return toast('🔒 L1 をクリアすると、ラッシュが遊べるよ');
    zStop(); show('quiz');
    $('#zTitle').textContent = '⚡ ラッシュ'; $('#zProg').style.width = '100%'; $('#zRight').innerHTML = '';
    zHud.innerHTML = '';
    zMain.innerHTML = '<div class="rush-intro"><b class="ri-ti">60 SEC RUSH</b><ul class="rules"><li>⏱ 60秒で、できるだけたくさん正解</li><li>🔥 5連続正解で <b>FEVER</b>（得点2倍・正解ごとに +1秒）</li><li>💥 まちがえると −3秒</li><li>📚 出題：クリアしたレッスンの問題（' + pool.length + '問）</li></ul>' +
      '<p class="best">ハイスコア：<b>' + S.rushBest + '</b></p></div>';
    T2.next(function () { rushGo(pool); }, '⚡ スタート！', 'boss');
  }
  function rushGo(pool) {
    T2.clear(); zMain.innerHTML = '';
    var k = 3;
    (function count() {
      if (k > 0) { FX.slam(String(k), 'cyan'); Sfx.tap(); k--; later(count, 700); }
      else { FX.slam('GO!!', 'pink'); Sfx.combo(10); rushRun(pool); }
    })();
  }
  function rushRun(pool) {
    var left = 60, score = 0, queue = weighted(pool), qi = 0, endAt = Date.now() + left * 1000;
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
      renderQ(q, c, T2, { run: zRun, fast: true }, function (ok) {
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
    showResult({ openMisses: true, title: best ? 'NEW RECORD!!' : 'TIME UP!', sub: '60秒ラッシュ', run: zRun, rewards: rewards, up: up, big: [score, best ? 'ハイスコア更新！' : 'ハイスコア ' + S.rushBest],
      note: '🎟 1500点で1枚・3500点で2枚・6000点で3枚', retry: { label: '⚡ もう一回！', fn: rushIntro } });
  }

  /* ----- 復習 ----- */
  /* ----- 使い分け道場（○✕ジャッジだけ。苦手な文から8問） ----- */
  function judgeQs() { return D.questions.filter(function (q) { return q.k === 'judge'; }); }
  function dojoGo() {
    if (!lessonDone(5)) return toast('🔒 L5 をクリアすると、道場が開くよ');
    var list = weighted(judgeQs()).slice(0, 8), k = 0;
    zStop(); show('quiz'); zActive = true; zRun = newRun();
    $('#zTitle').textContent = '🥋 使い分け道場'; zHud.innerHTML = '';
    FX.slam('DOJO', 'gold', 'que・quien・冠詞＋que');
    function paint() { $('#zProg').style.width = Math.round(k / list.length * 100) + '%'; $('#zRight').innerHTML = '<small>XP</small><b>' + zRun.xp + '</b>'; }
    function one() {
      paint();
      if (k >= list.length) return end();
      var q = list[k++], c = zCard();
      renderQ(q, c, T2, { run: zRun, tag: k + ' / ' + list.length }, function (ok) {
        srs(q, ok); save();
        if (ok) hit(zRun, c, 15); else miss(zRun, c);
        paint();
        later(function () { T2.next(one, k < list.length ? '▶ つぎへ' : '▶ おわり！'); }, 250);
      });
    }
    function end() {
      zStop();
      S.tickets += 1;
      var rewards = [{ icon: '🎟', t: '道場やりきり +1' }];
      touchDay();
      zRun.xp += 20;
      var up = addXp(zRun.xp); save();
      var acc = zRun.ok / list.length;
      showResult({ title: acc === 1 ? 'PERFECT!!' : 'DOJO CLEAR!', sub: '使い分け道場 ' + list.length + '問', stars: acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1, run: zRun, rewards: rewards, up: up,
        note: 'まちがえた文は、苦手として先に出てくるよ。全部 ○ になるまでくり返そう。', retry: { label: '🥋 もう8問', fn: dojoGo } });
    }
    one();
  }

  function reviewGo() {
    var all = unlockedQs();
    if (!all.length) return toast('🔒 L1 をクリアすると、復習ができるよ');
    var list = capJudge(weighted(all), 3).slice(0, 10), k = 0;
    zStop(); show('quiz'); zActive = true; zRun = newRun();
    $('#zTitle').textContent = '🔁 復習'; zHud.innerHTML = '';
    var due = dueQs().length;
    FX.slam('REVIEW', 'cyan', due ? '期限の問題 ' + Math.min(due, 10) + ' 問から' : '');
    function paint() { $('#zProg').style.width = Math.round(k / list.length * 100) + '%'; $('#zRight').innerHTML = '<small>XP</small><b>' + zRun.xp + '</b>'; }
    function one() {
      paint();
      if (k >= list.length) return end();
      var q = list[k++], c = zCard();
      renderQ(q, c, T2, { run: zRun, tag: k + ' / ' + list.length + '　L' + q.L }, function (ok) {
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
      showResult({ title: acc === 1 ? 'PERFECT!!' : 'REVIEW CLEAR!', sub: '復習 ' + list.length + '問', stars: acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1, run: zRun, rewards: rewards, up: up,
        note: 'まちがえた問題は、10分後からまた出てくるよ。正解した問題は、1日後・2日後・4日後…と間をあけて出る。', retry: { label: '🔁 もう10問', fn: reviewGo } });
    }
    one();
  }

  /* ----- カード練習（持っているカードの例文で 🎧聞き取り・🧩並べ替え） ----- */
  function cardQ(c, kind) {
    var s = plain(c.es);
    if (kind === 'build') return { id: 'card:' + c.id + ':b', k: 'build', s: s, d: [/\bquien(es)?\b/i.test(s) ? 'que' : 'quien'], ja: c.ja, card: c.id };
    /* まぎらわしい文：同じレッスンのカードを優先 */
    var others = shuffle(D.cards.filter(function (x) { return x.id !== c.id && plain(x.es) !== s; }))
      .sort(function (a, b) { return (b.L === c.L) - (a.L === c.L); }).slice(0, 2);
    return { id: 'card:' + c.id + ':l', k: 'listen', s: s, o: [s].concat(others.map(function (x) { return plain(x.es); })), a: 0, ja: c.ja, card: c.id };
  }
  function ownedCards() { return D.cards.filter(function (c) { return S.cards[c.id]; }); }
  function cardGo(ids) {
    var cards = ids ? ids.map(function (id) { return CARD[id]; })
      : shuffle(ownedCards()).sort(function (a, b) { return (S.cardp[a.id] || 0) - (S.cardp[b.id] || 0); }).slice(0, 5);
    if (!cards.length) return toast('🃏 カードを手に入れると、カードで練習できるよ');
    var list = [], k = 0, full = !ids;
    cards.forEach(function (c) { list.push(cardQ(c, 'listen'), cardQ(c, 'build')); });
    $('#modal').hidden = true;
    zStop(); show('quiz'); zActive = true; zRun = newRun();
    $('#zTitle').textContent = '🃏 カードで練習'; zHud.innerHTML = '';
    FX.slam('CARD PRACTICE', 'cyan', '🎧 聞き取り ・ 🧩 並べ替え');
    function paint() { $('#zProg').style.width = Math.round(k / list.length * 100) + '%'; $('#zRight').innerHTML = '<small>XP</small><b>' + zRun.xp + '</b>'; }
    function one() {
      paint();
      if (k >= list.length) return end();
      var q = list[k++], c = zCard();
      renderQ(q, c, T2, { run: zRun, tag: k + ' / ' + list.length + '　' + CARD[q.card].r }, function (ok) {
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
      showResult({ title: acc === 1 ? 'PERFECT!!' : 'PRACTICE CLEAR!', sub: 'カードで練習 ' + list.length + '問', stars: acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1, run: zRun, rewards: rewards, up: up,
        note: '練習で正解したカードは、図鑑に 🎧 の回数がつくよ。まだ練習していないカードから順に出る。',
        retry: { label: '🃏 もう一回', fn: function () { cardGo(ids); } }, next: { label: '🃏 図鑑へ', fn: function () { dexScreen('cards'); } } });
    }
    one();
  }

  /* ----- レッスンごとに5枚そろえるとボーナス ----- */
  var SET_TIX = 3, SET_XP = 50;
  function setRewards() {
    var got = [];
    D.lessons.forEach(function (L) {
      var mine = D.cards.filter(function (c) { return c.L === L.no; });
      if (S.sets[L.no] || !mine.every(function (c) { return S.cards[c.id]; })) return;
      S.sets[L.no] = Date.now(); S.tickets += SET_TIX; S.xp += SET_XP;
      got.push({ icon: '🏆', t: 'L' + L.no + ' カード5枚コンプリート！ 🎟+' + SET_TIX + '・+' + SET_XP + ' XP', set: L.no });
    });
    return got;
  }
  function setFx(got) {
    if (!got.length) return;
    later(function () { FX.slam('SET COMPLETE!!', 'gold', got.map(function (g) { return 'L' + g.set; }).join('・') + ' の5枚がそろった'); FX.confetti(140, 'gold'); Sfx.levelUp(); }, 600);
  }

  /* =========================================================
   * ガチャ
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
    g.innerHTML = '<header class="pbar"><button class="x" id="gBack" aria-label="もどる">←</button><div class="pmid"><b>🎰 フレーズガチャ</b></div><div class="pxp"><small>🎟</small><b>' + S.tickets + '</b></div></header>' +
      '<div class="gacha"><div class="machine" id="gm"><div class="dome">' + Array.apply(null, Array(14)).map(function (x, i) { return '<i style="left:' + (8 + (i * 37) % 140) + 'px;bottom:' + (4 + Math.floor(i / 4) * 24) + 'px;--h:' + (i * 47 % 360) + '"></i>'; }).join('') + '</div><div class="mbody"><span class="mslot"></span><span class="knob"></span></div></div>' +
      '<p class="g-info">クリアしたレッスンのフレーズカードが出るよ（いま ' + pool.length + ' 種類）。<br>持っているカード ' + own + ' / ' + D.cards.length + '</p>' +
      '<div class="g-btns"><button class="tb go" id="g1">1回まわす <small>🎟1</small></button><button class="tb gold" id="g10">10連 <small>🎟10・SR以上1枚確定</small></button></div>' +
      '<p class="g-rate">出る確率：SSR 5%・SR 13%・R 30%・N 52%（UR はボスを倒したときだけ）<br>持っているカードが出たら +15 XP<br>🏆 レッスンごとに5枚そろえると 🎟+3・+50 XP</p><div id="gOut"></div></div>';
    $('#gBack').addEventListener('click', home);
    $('#g1').addEventListener('click', function () { pull(1); });
    $('#g10').addEventListener('click', function () { pull(10); });
  }
  var pulling = false;
  function pull(n) {
    if (pulling) return;
    if (!cardPool().length) return toast('🔒 L1 をクリアすると、ガチャが回せるよ');
    if (S.tickets < n) return toast('🎟 チケットが足りない！ レッスン・ボス・ミッション・ラッシュでもらえるよ');
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
    m.className = 'machine spin t-' + RCOL[top];
    var k = 0;
    (function rattle() {
      if (k < 4) { Sfx.chestShake(); FX.shake(m); k++; later(rattle, 260); return; }
      m.className = 'machine t-' + RCOL[top];
      var cap = el('button', 'capsule t-' + RCOL[top], '<span>TAP!</span>');
      out.appendChild(cap); FX.pop(cap, 1.3);
      if (top === 'SSR') { FX.flash('#ffd23f'); FX.slam('!?', 'gold'); }
      cap.addEventListener('click', function () {
        cap.remove();
        var grid = el('div', 'g-grid' + (n === 1 ? ' one' : ''));
        got.forEach(function (c) { grid.insertAdjacentHTML('beforeend', cardHtml(c, true)); });
        out.appendChild(grid);
        var cards = $$('.pcard', grid);
        cards.forEach(function (nc, i) {
          var isNew = S.cards[nc.getAttribute('data-c')] === 1 && got.filter(function (c) { return c.id === nc.getAttribute('data-c'); }).length === 1;
          if (isNew) nc.insertAdjacentHTML('beforeend', '<em class="newtag">NEW</em>');
          nc.addEventListener('click', function () { flipCard(nc); });
          later(function () { flipCard(nc); }, 300 + i * 260);
        });
        later(function () {
          out.insertAdjacentHTML('beforeend', '<p class="g-sum">新しいカード <b>' + news + '</b> 枚' + (dupXp ? '　かぶり → <b>+' + dupXp + ' XP</b>' : '') + '</p>' +
            sets.map(function (g) { return '<p class="g-set">' + g.icon + ' ' + esc(g.t) + '</p>'; }).join('') +
            '<button class="tb sub" id="gDex">🃏 図鑑でカードを練習する</button>');
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
   * 図鑑・Tips ノート
   * ========================================================= */
  function dexScreen(tab) {
    show('dex');
    var d = $('#dex');
    var own = D.cards.filter(function (c) { return S.cards[c.id]; }).length, tips = TIPS.filter(function (t) { return S.tips[t.tip.id]; }).length;
    d.innerHTML = '<header class="pbar"><button class="x" id="dBack" aria-label="もどる">←</button><div class="pmid"><div class="tabs"><button data-tab="cards" class="' + (tab !== 'tips' ? 'on' : '') + '">🃏 図鑑 ' + own + '/' + D.cards.length + '</button><button data-tab="tips" class="' + (tab === 'tips' ? 'on' : '') + '">💡 Tips ' + tips + '/' + TIPS.length + '</button></div></div></header><div class="dex-body"></div>';
    $('#dBack').addEventListener('click', home);
    $$('.tabs button', d).forEach(function (b) { b.addEventListener('click', function () { Sfx.tap(); dexScreen(b.getAttribute('data-tab')); }); });
    var body = $('.dex-body', d);
    if (tab === 'tips') {
      body.innerHTML = '<p class="dex-note">レッスンで手に入れたコツ。🤔 なぜ？ を開くと理由が読めるよ。</p>' + TIPS.map(function (t) {
        var st = t.tip, have = S.tips[st.id];
        return have ? '<div class="card tip' + (st.tbl ? ' has-tbl' : '') + '"><div class="tip-h"><span>L' + t.L.no + '</span></div>' + tipBody(st) + '</div>'
          : '<div class="card tip locked"><b class="tip-ti">？？？</b><small>L' + t.L.no + ' でゲット</small></div>';
      }).join('');
      glossAll(body);
      return;
    }
    var html = '<button class="tb go" id="dPractice"' + (own ? '' : ' disabled') + '>🃏 カードで練習 <small>持っているカードから 🎧聞き取り・🧩並べ替え 10問</small></button>' +
      '<p class="dex-note">カードをタップすると、その1枚だけで練習もできるよ。<br>🏆 レッスンごとに5枚そろえると 🎟+3・+50 XP</p>';
    D.lessons.forEach(function (L) {
      var mine = D.cards.filter(function (c) { return c.L === L.no; }), have = mine.filter(function (c) { return S.cards[c.id]; }).length;
      html += '<h3 class="dex-h">L' + L.no + ' ' + esc(L.ti) + (S.sets[L.no] ? '<span class="set done">🏆 COMPLETE</span>' : '<span class="set">' + have + ' / ' + mine.length + '</span>') + '</h3><div class="dex-grid">' + D.cards.filter(function (c) { return c.L === L.no; }).map(slot).join('') + '</div>';
    });
    html += '<h3 class="dex-h">👑 ボス撃破の証（UR）</h3><div class="dex-grid">' + D.cards.filter(function (c) { return c.boss; }).map(slot).join('') + '</div>';
    body.innerHTML = html;
    $('#dPractice').addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); cardGo(); });
    function slot(c) {
      var n = S.cards[c.id], p = S.cardp[c.id];
      return n ? '<button class="slot rr-' + RCOL[c.r] + '" data-c="' + c.id + '"><span class="pc-r">' + c.r + '</span><span class="sl-es">' + esc(plain(c.es)) + '</span>' + (n > 1 ? '<em>×' + n + '</em>' : '') + (p ? '<i class="sl-p">🎧' + p + '</i>' : '') + '</button>'
        : '<div class="slot none"><span>？</span></div>';
    }
    $$('button.slot', body).forEach(function (b) {
      b.addEventListener('click', function () {
        var c = CARD[b.getAttribute('data-c')];
        modal(cardHtml(c, false) + '<p class="m-note">持っている枚数：' + S.cards[c.id] + '　練習で正解：' + (S.cardp[c.id] || 0) + '回</p>' +
          '<div class="tbs m-btns"><button class="tb go" id="mPractice">🎧 聞き取り ＋ 🧩 並べ替え</button></div>', 'card-m');
        $('#mPractice').addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); cardGo([c.id]); });
        var nc = $('#mbody .pcard'); glossEs(nc); later(function () { drawArc(nc); }, 380); autoSay(c.es);
      });
    });
  }

  /* モーダル */
  function modal(html, cls) {
    var m = $('#modal'); $('#mbody').innerHTML = html; m.className = cls || ''; m.hidden = false;
    var box = $('.mbox', m); if (box.animate && !FX.RM) box.animate([{ transform: 'scale(.7)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.2,1.5,.4,1)' });
  }
  $('#modal').addEventListener('click', function (e) { if (e.target.id === 'modal' || e.target.closest('.mclose')) { $('#modal').hidden = true; Speech.stop(); } });

  /* =========================================================
   * ホーム
   * ========================================================= */
  function openNode(i) {
    if (!nodeOpen(i)) return toast('🔒 前のステージをクリアすると開くよ');
    var n = ORDER[i];
    if (n.type === 'L') startLesson(LESSON[n.id]); else bossIntro(BOSS[n.id]);
  }
  function home() {
    zStop(); cur = null; show('home');
    /* 前の版でそろっていたセットのボーナスも、ここで渡す */
    var sets = setRewards();
    if (sets.length) { save(); setFx(sets); toast(sets.map(function (g) { return g.icon + ' ' + esc(g.t); }).join('<br>')); }
    var L = levelOf(S.xp);
    $('#hLvN').textContent = L.lv; $('#hLvBar').style.width = Math.round(L.cur / L.need * 100) + '%'; $('#hLvTi').textContent = titleOf(L.lv) + '　あと ' + (L.need - L.cur) + ' XP';
    $('#hStreak b').textContent = S.streak.last === today() || S.streak.last === ymd(Date.now() - DAY) ? S.streak.n : 0;
    $('#hTix b').textContent = S.tickets;
    var due = dueQs().length, ni = nextIdx(), started = Object.keys(S.lessons).length > 0;
    $('#hBot').innerHTML = FX.bot(ni < 0 ? 'happy' : due ? 'wow' : '');
    var greet = !started ? '¡Hola! ボクは<b>ケボット</b>。\n関係詞は「2つの文の<b>合体</b>」。いっしょにマスターしよう⚡'
      : ni < 0 ? '<b>ぜんぶクリア！</b> ¡Increíble!\nラスボスに S ランクで勝てるかな？ ラッシュのハイスコアもねらおう🔥'
      : due >= 5 ? '復習が <b>' + due + '問</b> たまってるよ。\n忘れる前にサクッと！ ⏰'
      : '¡Vamos! つづきは「' + (ORDER[ni].type === 'L' ? 'L' + LESSON[ORDER[ni].id].no + ' ' + LESSON[ORDER[ni].id].ti : 'ボス戦') + '」から！';
    $('#hGreet').innerHTML = greet.replace(/\n/g, '<br>');
    var cta = $('#hCta');
    cta.innerHTML = ni < 0 ? '⚡ ラッシュでハイスコア！' : ORDER[ni].type === 'B' ? '<small>⚔ ボス戦</small>' + BOSS[ORDER[ni].id].face + ' ' + esc(BOSS[ORDER[ni].id].name)
      : '<small>' + (started ? '▶ つづき' : '▶ はじめる') + '　L' + LESSON[ORDER[ni].id].no + '</small>' + esc(LESSON[ORDER[ni].id].ti);
    cta.className = 'cta' + (ni >= 0 && ORDER[ni].type === 'B' ? ' boss' : '');
    cta.onclick = function () { Sfx.unlock(); Sfx.tap(); if (ni < 0) rushIntro(); else openNode(ni); };

    var unlocked = unlockedQs().length > 0;
    $('#hDue').innerHTML = !unlocked ? '🔒' : due ? '<em>' + due + '</em> 問' : 'OK';
    $('#hRushBest').textContent = unlocked ? 'BEST ' + S.rushBest : '🔒';
    var jq = judgeQs();
    $('#hDojoN').textContent = lessonDone(5) ? jq.filter(function (q) { return S.q[q.id] && S.q[q.id].lv >= 2; }).length + '/' + jq.length : '🔒';
    $('#hGachaN').textContent = '🎟 ' + S.tickets;
    $('#hDexN').textContent = Object.keys(S.cards).length + '/' + D.cards.length;
    $('#hTipsN').textContent = TIPS.filter(function (t) { return S.tips[t.tip.id]; }).length + '/' + TIPS.length;
    $('#hReview').classList.toggle('alert', due > 0);
    $('#hGacha').classList.toggle('alert', S.tickets > 0 && cardPool().length > 0);

    var m = mis();
    $('#hMis').innerHTML = '<h3>📅 今日のミッション <small>' + (m.bonus ? 'コンプリート！🎉' : 'ぜんぶで 🎟 +2 ボーナス') + '</small></h3>' +
      MIS.map(function (x) { return '<div class="mi ' + (m.done[x.id] ? 'ok' : '') + '"><span>' + x.icon + '</span>' + x.ti + '<b>' + (m.done[x.id] ? '✔' : '🎟1') + '</b></div>'; }).join('');

    /* ステージマップ */
    var map = $('#hMap'), html = '';
    D.days.forEach(function (dd) {
      var nodes = ORDER.map(function (n, i) { return { n: n, i: i }; }).filter(function (x) { return x.n.day === dd.d; });
      html += '<div class="day"><div class="day-h"><b>DAY ' + dd.d + '</b><span>' + esc(dd.ti) + '</span><small>' + esc(dd.x) + '</small></div><div class="nodes">';
      nodes.forEach(function (x) {
        var n = x.n, done = nodeDone(n), open = nodeOpen(x.i), now = x.i === ni;
        var st = (done ? ' done' : '') + (open ? '' : ' lock') + (now ? ' now' : '');
        if (n.type === 'L') {
          var L = LESSON[n.id], rec = S.lessons[n.id];
          html += '<button class="node' + st + '" data-i="' + x.i + '"><span class="ni">' + (open ? L.icon : '🔒') + '</span><span class="nt"><small>L' + L.no + '</small>' + esc(L.ti) + '</span>' +
            (rec ? '<span class="ns">' + [1, 2, 3].map(function (k) { return k <= rec.stars ? '★' : '☆'; }).join('') + '</span>' : '') + '</button>';
        } else {
          var B = BOSS[n.id], br = S.bosses[n.id];
          html += '<button class="node boss' + st + (B.final ? ' final' : '') + '" data-i="' + x.i + '" style="--bc:' + B.col + '"><span class="ni">' + (open ? B.face : '🔒') + '</span><span class="nt"><small>' + (B.final ? 'FINAL BOSS' : 'BOSS') + '</small>' + esc(B.name) + '</span>' +
            (br && br.win ? '<span class="ns rk">' + br.rank + '</span>' : '') + '</button>';
        }
      });
      if (!nodes.length) {
        html += '<div class="extra"><button class="mini" data-act="dojo">🥋 道場</button><button class="mini" data-act="review">🔁 復習</button><button class="mini" data-act="rush">⚡ ラッシュ</button>' + (dd.d === 7 ? '<button class="mini" data-act="final">👑 ラスボス</button>' : '') + '</div>';
      } else if (dd.d >= 3) html += '<div class="extra"><button class="mini" data-act="dojo">🥋 使い分け道場</button></div>';
      html += '</div></div>';
    });
    map.innerHTML = html;
    $$('.node', map).forEach(function (b) { b.addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); openNode(+b.getAttribute('data-i')); }); });
    $$('.mini', map).forEach(function (b) {
      b.addEventListener('click', function () {
        Sfx.unlock(); Sfx.tap();
        var a = b.getAttribute('data-act');
        if (a === 'review') reviewGo(); else if (a === 'rush') rushIntro(); else if (a === 'dojo') dojoGo();
        else { var fi = ORDER.length - 1; openNode(fi); }
      });
    });
    var nowEl = $('.node.now', map);
    if (nowEl && started) later(function () { nowEl.scrollIntoView({ block: 'center', behavior: FX.RM ? 'auto' : 'smooth' }); }, 300);
    $('#tgSound').checked = S.settings.sound; $('#tgSpeak').checked = S.settings.speak;
  }
  $('#hReview').addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); reviewGo(); });
  $('#hRush').addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); rushIntro(); });
  $('#hDojo').addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); dojoGo(); });
  $('#hGacha').addEventListener('click', function () { Sfx.unlock(); Sfx.tap(); gachaScreen(); });
  $('#hDex').addEventListener('click', function () { Sfx.tap(); dexScreen('cards'); });
  $('#hTips').addEventListener('click', function () { Sfx.tap(); dexScreen('tips'); });
  $('#hLv').addEventListener('click', function () {
    var L = levelOf(S.xp);
    modal('<div class="lvinfo"><b>Lv.' + L.lv + '　' + esc(titleOf(L.lv)) + '</b><p>XP 合計 ' + S.xp + '</p><ul>' + TITLES.map(function (t) { return '<li class="' + (L.lv >= t[0] ? 'on' : '') + '">Lv.' + t[0] + '　' + t[1] + '</li>'; }).join('') + '</ul></div>');
  });
  $('#tgSound').addEventListener('change', function (e) { S.settings.sound = e.target.checked; save(); if (e.target.checked) { Sfx.unlock(); Sfx.coin(); } });
  $('#tgSpeak').addEventListener('change', function (e) { S.settings.speak = e.target.checked; save(); if (e.target.checked) Speech.say('¡Hola!'); });
  $('#hReset').addEventListener('click', function () {
    if (!confirm('記録をぜんぶ消しますか？（レベル・カード・クリア記録）')) return;
    if (!confirm('本当に消しますか？ もとに戻せません。')) return;
    S = fresh(); save(); home(); toast('記録をリセットしました');
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[role=button]')) { e.preventDefault(); e.target.click(); }
  });
  if (SANDBOX) document.body.classList.add('sandbox');
  try { localStorage.setItem('le.news.relativo.opened', '1'); } catch (e) { /* 保存できない環境 */ }
  home();
})();
