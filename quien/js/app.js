/* =========================================================
 * ¿QUIÉN FUE? 下町新聞の事件記者 — スペイン語の受身と se の使い分け（西検4級）
 *
 *  エンジンを使わない独立アプリ（protesto/ と同じ考え方。台本の形もほぼ同じ）。
 *   表紙＝新聞の一面。号をめくって事件をえらぶ（第1話 → 第7話）。
 *   事件＝取材（現場を調べてペパさんの校閲ノートで形と理屈を習う）→ 対決（取材・記者会見でごまかしをくずす）。
 *   対決では、まちがえると「インク」が減る（0 になったらひと休みして、5 つに戻して再開）。
 *   犯人を書かない文の「やった人」を、文法の手がかり（見分けの手順）で見ぬくのが中心の操作。
 *   ほかに ⏱ デスクの即答ドリル（時間内に何問。時間切れのときの1問は答えるまで）・🎓 西検模試・🗂 単語の復習・📓 校閲ノート
 *  保存：localStorage 'quien.v1'（?sandbox なら 'quien.sandbox'）
 *  台本：quien/js/data/*.js（書き方は cast.js の先頭）、単語：shared/es-words.js
 * ========================================================= */
(function () {
  'use strict';
  var D = window.QF, DICT = window.ES_WORDS;
  D.cases.sort(function (a, b) { return a.no - b.no; });

  /* ---------- 小物 ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function norm(w) { return String(w).replace(/[¿?¡!.,—:;"«»]/g, '').toLowerCase(); }
  function plain(es) { return String(es).replace(/[\[\]]/g, ''); }
  function buzz(p) { try { if (navigator.vibrate && !(navigator.userActivation && !navigator.userActivation.hasBeenActive)) navigator.vibrate(p); } catch (e) { /* なし */ } }
  var LETTER = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/;

  /* ---------- 保存 ---------- */
  var SANDBOX = /[?&]sandbox\b/.test(location.search);
  var KEY = SANDBOX ? 'quien.sandbox' : 'quien.v1';
  function fresh() { return { v: 1, lessons: {}, notes: {}, words: {}, flow: 0, drillBest: 0, exam: null, page: 0, settings: { sound: true, speak: true, ja: false } }; }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) { var f = fresh(); for (var k in s) f[k] = s[k]; return f; } } catch (e) { /* 保存できない環境 */ }
    return fresh();
  }
  var S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* 保存できない環境 */ } }
  window.SfxOn = function () { return S.settings.sound; };
  function rec(id) { return S.lessons[id] || (S.lessons[id] = { i: 0, done: false, rank: '', ink: 5, miss: 0 }); }
  function caseDone(id) { return SANDBOX || !!(S.lessons[id] || {}).done; }
  function caseOf(id) { return D.cases.filter(function (c) { return c.id === id; })[0]; }

  /* ---------- 単語（タップで意味） ---------- */
  var WORD = new Map();
  DICT.words.forEach(function (e) { [e.w].concat(e.f || []).forEach(function (f) { if (!WORD.has(f.toLowerCase())) WORD.set(f.toLowerCase(), e); }); });
  /* [ ] の中で色をつける語：se＝朱、por＝藍、a・al＝黄土、me・te・le…＝緑 */
  var KEYW = { se: 'se', por: 'por', a: 'a', al: 'a', me: 'io', te: 'io', le: 'io', nos: 'io', os: 'io', les: 'io' };
  var NAMES = new Set((DICT.names || []).map(function (n) { return n.toLowerCase(); }));
  /* スペイン語の文：[ ] の中は見どころ（下線＋色）。意味のある語はどれもタップで意味が出る。4級以上は点線で目印。
   *  事件・ドリルの画面で出た語は「単語の復習」に集める（hl：その語に色をつける） */
  function es(s, hl) {
    var out = '', inK = false;
    String(s).split(/(\[|\]|[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)/).forEach(function (t) {
      if (!t) return;
      if (t === '[') { inK = true; out += '<span class="kp">'; return; }
      if (t === ']') { inK = false; out += '</span>'; return; }
      if (!LETTER.test(t)) { out += esc(t); return; }
      var k = t.toLowerCase(), e = NAMES.has(k) ? null : WORD.get(k), cls = [];
      if (inK && KEYW[k]) cls.push('k-' + KEYW[k]);
      if (e && hl && e === hl) cls.push('hl');
      if (e && e.lv >= 3 && e.pos !== 'bad') {
        collect(e, s);
        cls.push(e.lv === 5 ? 'gl g5' : 'gl');
        out += '<span class="' + cls.join(' ') + '" role="button" data-w="' + esc(e.w) + '" data-gl="' + esc(e.w + '：' + e.ja) + '">' + esc(t) + '</span>';
        return;
      }
      out += cls.length ? '<span class="' + cls.join(' ') + '">' + esc(t) + '</span>' : esc(t);
    });
    return out;
  }
  /* 単語帳に集める（事件・ドリル・西検模試の画面だけ。例文は最初に出会った文） */
  function collect(e, s) {
    var scr = document.body.dataset.screen;
    if (scr !== 'play' && scr !== 'drill' && scr !== 'exam') return;
    if (!S.words[e.w]) S.words[e.w] = { t: Date.now(), ex: plain(s).replace(/___/g, '…'), c: CASE && scr === 'play' ? CASE.id : scr, box: 0, due: 0, n: 0 };
  }
  /* 日本語：**覚えること** __覚え方__ ((呼び方)) `スペイン語` */
  function ja(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, '<b class="mk">$1</b>').replace(/__(.+?)__/g, '<span class="hint">💡$1</span>')
      .replace(/\(\((.+?)\)\)/g, '<span class="call">$1</span>').replace(/`(.+?)`/g, '<i class="esi">$1</i>').replace(/\n/g, '<br>');
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
    if (syn) { find(); if ('onvoiceschanged' in syn) syn.onvoiceschanged = find; }
    return {
      ok: function () { return !!(syn && (voice || find())); },
      say: function (text) {
        if (!syn || !(voice || find())) return;
        try { syn.cancel(); var u = new SpeechSynthesisUtterance(plain(text).replace(/___/g, '')); u.voice = voice; u.lang = voice.lang; u.rate = 0.9; syn.speak(u); } catch (e) { /* 読み上げできない */ }
      },
      stop: function () { try { if (syn) syn.cancel(); } catch (e) { /* なし */ } }
    };
  })();
  function autoSay(s) { if (S.settings.speak && !/___/.test(s)) Speech.say(s); }
  function sayBtn(s) { return Speech.ok() ? '<button class="say" data-say="' + esc(plain(s)) + '" aria-label="読み上げ">🔊</button>' : ''; }

  /* ---------- 効果音（engine/js/audio.js の Sfx ＋ 輪転機） ---------- */
  var Snd = {
    tap: function () { if (window.Sfx) Sfx.tap(); },
    ok: function () { if (window.Sfx) Sfx.correct(2); },
    ng: function () { if (window.Sfx) Sfx.wrong(); buzz([30, 40, 30]); },
    slam: function () { if (window.Sfx) Sfx.crit(); buzz([20, 30, 60]); },
    page: function () { if (window.Sfx) Sfx.whoosh(); },
    press: function () {
      if (!window.Sfx || !Sfx.raw) return;
      buzz(25);
      Sfx.raw.play(function (t) {
        for (var d = 0; d < 0.6; d += 0.12) { Sfx.raw.noise(t + d, 0.05, 0.16, 1400, 500); Sfx.raw.tone(110, t + d, 0.06, 'square', 0.08, 90); }
      });
    }
  };

  /* ---------- 画面 ---------- */
  function show(id) {
    $$('.screen').forEach(function (s) { s.hidden = s.id !== id; });
    document.body.dataset.screen = id;
    window.scrollTo(0, 0);
  }
  function modal(html, cls) {
    $('#mbody').innerHTML = html;
    $('#modal .mbox').className = 'mbox ' + (cls || '');
    $('#modal').hidden = false;
    return $('#mbody');
  }
  function closeModal() { $('#modal').hidden = true; if (modalClose) { var f = modalClose; modalClose = null; f(); } }
  var modalClose = null;
  $('#modal .mclose').addEventListener('click', closeModal);
  $('#modal').addEventListener('click', function (e) { if (e.target.id === 'modal') closeModal(); });
  function closeModalSilently() { modalClose = null; $('#modal').hidden = true; }

  /* 単語のバルーン・読み上げボタン（どこでも） */
  document.addEventListener('click', function (e) {
    var g = e.target.closest('.gl');
    var p = $('#pop');
    if (g) {
      e.stopPropagation();
      p.textContent = g.dataset.gl; p.hidden = false;
      var wd = S.words[g.dataset.w]; if (wd && !wd.look) { wd.look = true; save(); }   // 調べた語は復習で先に出す
      var r = g.getBoundingClientRect(), w = Math.min(280, innerWidth - 24);
      p.style.maxWidth = w + 'px';
      var x = Math.max(12, Math.min(innerWidth - w - 12, r.left + r.width / 2 - w / 2));
      p.style.left = x + 'px';
      p.style.top = (r.top > 90 ? r.top - 8 : r.bottom + 8) + 'px';
      p.classList.toggle('below', r.top <= 90);
      return;
    }
    p.hidden = true;
    var b = e.target.closest('.say');
    if (b) { e.stopPropagation(); Speech.say(b.dataset.say); }
  }, true);

  /* ---------- 叩きつけ文字（新聞のゴム印） ---------- */
  function slam(txt, cls) {
    var s = $('#slam');
    s.className = ''; void s.offsetWidth;
    s.innerHTML = '<b>' + esc(txt) + '</b>';
    s.className = 'on ' + (cls || '');
    Snd.slam();
    $('#app').classList.remove('shake'); void $('#app').offsetWidth; $('#app').classList.add('shake');
    return sleep(1150).then(function () { s.className = ''; });
  }

  /* =========================================================
   * 事件の実行
   * ========================================================= */
  var CASE = null;      // いまの事件
  var X = null;         // 実行中の状態 { ev:Set, cast:[], duel, ink, miss, quit }
  var waiting = null;   // ユーザーの操作待ち（やめるときに止める）
  var cur = { solve: null };   // 通しテスト用：いまの操作を正解で進める
  window.QUI = { cur: cur, S: function () { return S; } };

  function who(id) { return (CASE && CASE.cast[id]) || D.cast[id] || { n: id, e: '❓' }; }
  /* 操作を待つ：resolve を返す関数を受けとる。やめたら reject */
  function wait(setup) {
    return new Promise(function (res, rej) {
      waiting = { rej: rej };
      setup(function (v) { waiting = null; cur.solve = null; res(v); });
    });
  }
  function quitCase() {
    Speech.stop();
    if (X) X.quit = true;
    if (waiting) { var w = waiting; waiting = null; w.rej('quit'); }
    cur.solve = null;
    closeModalSilently();
    renderHome(); show('home');
  }

  /* ----- 場面 ----- */
  function drawStage() {
    var st = $('#stage'), P = D.places[X.place] || { n: '', e: '' };
    st.className = 'stage pl-' + X.place + (X.duel ? ' duel' : '');
    var html = '<div class="plname"><span>' + esc(P.e) + '</span>' + esc(P.n) + '<small>' + esc(P.es || '') + '</small></div><div class="cast">';
    X.cast.forEach(function (id) {
      var c = who(id), role = id === X.witness ? ' witness' : '';
      html += '<div class="med' + role + (id === X.speaker ? ' talking' : '') + '" data-id="' + id + '"><span class="em">' + c.e + '</span><small>' + esc(c.n) + '</small></div>';
    });
    st.innerHTML = html + '</div>';
  }
  function setSpeaker(id) { X.speaker = id; $$('#stage .med').forEach(function (m) { m.classList.toggle('talking', m.dataset.id === id); }); }
  function hud() {
    var a = $('#pInk');
    a.hidden = !X.duel;
    var s = '';
    for (var i = 0; i < 5; i++) s += '<i class="' + (i < X.ink ? 'on' : '') + '">🖋</i>';
    a.innerHTML = s;
  }
  function act() { return $('#act'); }
  function tray(html) { var t = $('#tray'); t.innerHTML = html || ''; return t; }
  function clearAct() { act().innerHTML = ''; tray(''); }
  function scrollAct() { var b = $('#board'), a = act(); if (a.lastElementChild) { var top = a.offsetTop - 8; if (b.scrollTop + b.clientHeight < a.offsetTop + a.offsetHeight || b.scrollTop > top) b.scrollTop = Math.max(0, Math.min(top, a.offsetTop + a.offsetHeight - b.clientHeight)); } }

  /* ----- ミス（対決だけ）。インクが 0 になったらひと休みして 5 つに戻す ----- */
  async function miss() {
    Snd.ng();
    if (!X.duel) return;
    X.ink--; X.miss++;
    var r = rec(CASE.id); r.ink = X.ink; r.miss = X.miss; save();
    hud();
    var a = $$('#pInk i')[X.ink]; if (a) { a.classList.add('lost'); }
    if (X.ink <= 0) {
      await wait(function (done) {
        modal('<div class="recess"><div class="big">☕</div><h3>ひと休み</h3><p>インクがなくなりました。<br>ペパさんがいれてくれたコーヒーを飲んで、メモを見なおそう。</p><button class="btn main" id="rcOk">🖋 インク 5 つで再開</button></div>');
        $('#rcOk').onclick = function () { closeModalSilently(); done(); };
        cur.solve = function () { $('#rcOk').click(); };
      });
      X.ink = 5; rec(CASE.id).ink = 5; save(); hud();
    }
  }

  /* ----- まちがえたとき：自分の答え（と正解）をならべる ----- */
  function cmpRows(you, right) {
    return '<div class="cmp"><div class="cmp-row ng"><i>✕ あなた</i><span>' + you + '</span></div>' +
      (right != null ? '<div class="cmp-row ok"><i>○ 正解</i><span>' + right + '</span></div>' : '') + '</div>';
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
  function evName(k) { var e = CASE && CASE.evidence[k]; return e ? e.e + ' ' + esc(e.n) : esc(k); }
  function maskName(k) { var m = D.masks[k]; return m ? m.e + ' ' + esc(m.n) : esc(k); }

  /* ----- ステップ ----- */
  var H = {};
  async function run(steps) { for (var i = 0; i < steps.length; i++) { if (X.quit) throw 'quit'; await H[steps[i].t](steps[i]); } }

  H.scene = async function (st) {
    X.place = st.place; X.cast = (st.cast || []).slice(); X.witness = null; X.speaker = null;
    var was = X.duel;
    X.duel = !!st.duel;
    if (X.duel && !was && !X.resumed) { X.ink = 5; rec(CASE.id).ink = 5; save(); }
    X.resumed = false;
    $('#ref').innerHTML = ''; clearAct(); $('#talk').hidden = true;
    drawStage(); hud();
    var P = D.places[st.place] || { n: '', e: '' };
    if (X.duel) Snd.press(); else Snd.page();
    await wait(function (done) {
      var c = el('div', 'chapter', '<span class="ce">' + P.e + '</span><b>' + esc(P.n) + '</b><small>' + esc(P.es || '') + '</small>' + (X.duel ? '<i class="dl">― 対決 ―</i>' : ''));
      $('#stage').appendChild(c);
      var t = setTimeout(go, 1300);
      function go() { clearTimeout(t); c.remove(); done(); }
      c.addEventListener('click', go);
      cur.solve = go;
    });
  };
  H.enter = async function (st) {
    if (X.cast.indexOf(st.who) < 0) X.cast.push(st.who);
    if (X.duel) X.witness = st.who;
    drawStage();
    var m = $('#stage .med[data-id="' + st.who + '"]'); if (m) m.classList.add('in');
  };
  /* セリフ：スペイン語があれば大きく、日本語は訳として下に */
  H.say = async function (st) {
    var c = who(st.who), t = $('#talk');
    setSpeaker(st.who);
    t.hidden = false;
    t.className = 'talk' + (st.who === 'leo' ? ' me' : '') + (st.who === 'pepa' ? ' desk' : '');
    t.innerHTML = '<div class="tn"><span class="em">' + c.e + '</span>' + esc(c.n) + '</div>' +
      (st.es ? '<p class="tes">' + es(st.es) + sayBtn(st.es) + '</p>' : '') +
      '<p class="tja' + (st.es ? ' sub' : '') + '"></p><span class="nx" aria-hidden="true">▼</span>';
    if (st.es) autoSay(st.es);
    var body = ja(st.x || ''), p = $('.tja', t);
    /* 文字を少しずつ出す（タップで全部） */
    var typing = true, i = 0;
    p.innerHTML = body; var full = p.innerHTML, plainLen = p.textContent.length; p.innerHTML = '';
    var timer = setInterval(function () {
      i += 2; if (i >= plainLen) { finish(); return; }
      p.innerHTML = cut(full, i);
    }, 22);
    function finish() { clearInterval(timer); typing = false; p.innerHTML = full; t.classList.add('ready'); }
    tray(st.more ? '<button class="btn sub" id="tMore">🤔 なぜ？</button>' : '');
    if (st.more) $('#tMore').onclick = function (e) { e.stopPropagation(); modal('<h3>🤔 なぜ？</h3><p>' + ja(st.more) + '</p>'); };
    await wait(function (done) {
      function next(e) { if (e && e.target.closest('.say, .gl, #tMore')) return; if (typing) { finish(); return; } t.removeEventListener('click', next); t.classList.remove('ready'); tray(''); done(); }
      t.addEventListener('click', next);
      cur.solve = function () { finish(); next(); };
    });
  };
  /* HTML を、見える文字 n 個ぶんで切る（タグはそのまま） */
  function cut(html, n) {
    var out = '', k = 0, i = 0;
    while (i < html.length && k < n) {
      if (html[i] === '<') { var j = html.indexOf('>', i); out += html.slice(i, j + 1); i = j + 1; continue; }
      if (html[i] === '&') { var j2 = html.indexOf(';', i); out += html.slice(i, j2 + 1); i = j2 + 1; k++; continue; }
      out += html[i]; i++; k++;
    }
    return out + closeTags(out);
  }
  function closeTags(h) { var st = [], re = /<(\/?)([a-z]+)[^>]*>/g, m; while ((m = re.exec(h))) { if (m[2] === 'br') continue; if (m[1]) st.pop(); else st.push(m[2]); } return st.reverse().map(function (t) { return '</' + t + '>'; }).join(''); }

  H.note = async function (st) {
    S.notes[CASE.id + '|' + st.title] = { c: CASE.id, title: st.title, rows: st.rows || [], x: st.x || '', why: st.why || '' }; save();
    $('#ref').innerHTML = noteHtml(st);
    $('#talk').hidden = true;
    $('#board').scrollTop = 0;
  };
  H.tip = function (st) { return H.note({ title: st.title, x: st.x, why: st.why, rows: [] }); };
  function noteHtml(n) {
    var h = '<div class="note"><div class="nh">✒️ ' + esc(n.title) + '</div>';
    (n.rows || []).forEach(function (r) { h += '<div class="nr"><p class="nes">' + es(r[0]) + sayBtn(r[0]) + '</p><p class="nja">' + ja(r[1]) + '</p></div>'; });
    if (n.x) h += '<p class="nx2">' + ja(n.x) + '</p>';
    if (n.why) h += '<details class="why"><summary>🤔 なぜ？</summary><p>' + ja(n.why) + '</p></details>';
    return h + '</div>';
  }
  /* 見分けの手順：1〜upto 段目。いちばん新しい段は光る */
  H.flow = async function (st) {
    if (st.upto > (S.flow || 0)) { S.flow = st.upto; save(); }
    $('#ref').innerHTML = flowHtml(st.upto, st.upto);
    $('#talk').hidden = true;
    $('#board').scrollTop = 0;
  };
  function flowHtml(upto, hi) {
    var h = '<div class="flow"><div class="nh">🔎 見分けの手順</div><ol>';
    D.flow.slice(0, upto).forEach(function (f, i) {
      h += '<li class="' + (i + 1 === hi ? 'new' : '') + '"><p class="fq">' + ja(f.q) + '</p><p class="fa">→ ' + ja(f.a) + '</p><p class="fex">' + es(f.ex) + '</p></li>';
    });
    return h + '</ol></div>';
  }

  /* 選択肢：スペイン語の文は「文（語をタップで調べられる）＋右の端の選ぶボタン」の行、日本語だけなら札のボタン */
  function isEs(o) { return LETTER.test(o) && !/[぀-ヿ一-鿿]/.test(o); }
  function optsHtml(o) {
    if (o.some(isEs)) return '<div class="orows">' + o.map(function (x, i) {
      return '<div class="orow"><p class="otext">' + (isEs(x) ? es(x) : esc(x)) + '</p><button class="btn opt pk" data-i="' + i + '" aria-label="これをえらぶ">えらぶ</button></div>';
    }).join('') + '</div>';
    var long = o.some(function (x) { return x.length > 10; });
    return '<div class="opts' + (long ? ' col' : '') + '">' + o.map(function (x, i) { return '<button class="btn opt" data-i="' + i + '">' + esc(x) + '</button>'; }).join('') + '</div>';
  }
  /* 正解・まちがいの色は、行があれば行ごと */
  function mark(b, cls) { b.classList.add(cls); var r = b.closest('.orow'); if (r) r.classList.add(cls); }
  /* 文の訳（ぼかしておき、タップで見える） */
  function jaLine(s) { return s ? '<p class="tlja' + (S.settings.ja ? ' open' : '') + '" role="button">' + esc(s) + '</p>' : ''; }
  function bindJa(root) { $$('.tlja', root).forEach(function (p) { p.onclick = function () { p.classList.add('open'); }; }); }

  /* 選ぶ問い（対決ではまちがえるとインク −1） */
  H.ask = async function (st) {
    $('#talk').hidden = true;
    act().innerHTML = '<div class="q"><p class="qq">' + ja(st.q) + '</p>' + (st.es ? '<p class="qes">' + es(st.es) + sayBtn(st.es) + '</p>' : '') + '<p class="ng" hidden></p></div>';
    tray(optsHtml(st.o));
    scrollAct();
    await wait(function (done) {
      $$('#tray .opt').forEach(function (b) {
        b.onclick = async function (e) {
          if (e.target.closest('.gl')) return;
          var i = +b.dataset.i;
          if (i === st.a) {
            Snd.ok(); mark(b, 'right');
            $$('#tray .opt').forEach(function (x) { x.disabled = true; });
            if (isEs(st.o[i])) autoSay(st.o[i]);
            await sleep(450); done();
          } else {
            mark(b, 'wrong'); b.disabled = true;
            if (st.ng) { var n = $('#act .ng'); n.hidden = false; n.innerHTML = '💡 ' + ja(st.ng); }
            await miss();
          }
        };
      });
      cur.solve = function () { $$('#tray .opt')[st.a].click(); };
    });
    clearAct();
    if (st.r) await run(st.r);
  };

  /* 現場ボード：この文で「やった人」は？ */
  H.who = async function (st) {
    $('#talk').hidden = true;
    var order = shuffle(st.o.map(function (k, i) { return i; }));
    act().innerHTML = '<div class="scene-q"><p class="sh">🗂 現場ボード</p><p class="qq">' + ja(st.q || 'この文で、やった人は？') + '</p>' +
      '<div class="tl"><p class="tles">' + es(st.es) + sayBtn(st.es) + '</p>' + jaLine(st.ja) + '</div><p class="ng" hidden></p></div>';
    bindJa(act());
    tray('<div class="masks">' + order.map(function (i) { var m = D.masks[st.o[i]]; return '<button class="btn mask" data-i="' + i + '"><span class="me">' + m.e + '</span><b>' + esc(m.n) + '</b></button>'; }).join('') + '</div>');
    autoSay(st.es);
    scrollAct();
    await wait(function (done) {
      $$('#tray .mask').forEach(function (b) {
        b.onclick = async function () {
          var i = +b.dataset.i;
          if (i === st.a) {
            Snd.ok(); b.classList.add('right');
            $$('#tray .mask').forEach(function (x) { x.disabled = true; });
            await sleep(500); done();
          } else {
            b.classList.add('wrong'); b.disabled = true;
            if (st.ng) { var n = $('#act .ng'); n.hidden = false; n.innerHTML = '💡 ' + ja(st.ng); }
            await miss();
          }
        };
      });
      cur.solve = function () { $('#tray .mask[data-i="' + st.a + '"]').click(); };
    });
    clearAct();
    if (st.r) await run(st.r);
  };

  /* 文を語のボタンにする（タップで答える問い用。語の意味のバルーンは出さない） */
  function tokenBtns(s) {
    var seen = {}, out = '';
    plain(s).split(/(\s+)/).forEach(function (t) {
      if (!t.trim()) { out += ' '; return; }
      var m = t.match(/^([¿¡"«]*)(.*?)([.,!?;:"»]*)$/), w = m[2];
      if (!w || !LETTER.test(w)) { out += esc(t); return; }
      var k = norm(w); seen[k] = (seen[k] || 0) + 1;
      out += esc(m[1]) + '<button class="wd" data-k="' + esc(k + (seen[k] > 1 ? '#' + seen[k] : '')) + '">' + esc(w) + '</button>' + esc(m[3]);
    });
    return out;
  }
  function tapOk(k, a) { return a.some(function (x) { return norm(x.split('#')[0]) + (x.indexOf('#') > 0 ? '#' + x.split('#')[1] : '') === k; }); }

  /* 決め手の語をタップ */
  H.tap = async function (st) {
    $('#talk').hidden = true;
    act().innerHTML = '<div class="q"><p class="qq">' + ja(st.q) + '</p><p class="tapline">' + tokenBtns(st.es) + '</p>' + jaLine(st.ja) + '<p class="hint2">文の中の語をタップ</p><p class="ng" hidden></p></div>';
    bindJa(act());
    tray(sayBtn(st.es) ? '<div class="sayrow">' + sayBtn(st.es) + '</div>' : '');
    scrollAct();
    await wait(function (done) {
      $$('#act .wd').forEach(function (b) {
        b.onclick = async function () {
          if (tapOk(b.dataset.k, st.a)) {
            Snd.ok(); b.classList.add('right');
            $$('#act .wd').forEach(function (x) { x.disabled = true; });
            await sleep(600); done();
          } else {
            b.classList.add('wrong'); Snd.tap();
            if (st.ng) { var n = $('#act .ng'); n.hidden = false; n.innerHTML = '💡 ' + ja(st.ng); }
            await miss();
            b.classList.remove('wrong');
          }
        };
      });
      cur.solve = function () { var k = st.a[0]; $$('#act .wd').filter(function (b) { return tapOk(b.dataset.k, [k]); })[0].click(); };
    });
    clearAct();
    if (st.r) await run(st.r);
  };

  /* 赤ペン：まちがった語をタップ → 直した語を選ぶ */
  H.redpen = async function (st) {
    $('#talk').hidden = true;
    var fixed = false;
    act().innerHTML = '<div class="q draft"><p class="sh">✒️ ティトの原稿</p><p class="qq">' + ja(st.q) + '</p><p class="tapline">' + tokenBtns(st.es) + '</p><p class="hint2">まちがっている語をタップ</p><p class="ng" hidden></p></div>';
    tray('');
    scrollAct();
    await wait(function (done) {
      $$('#act .wd').forEach(function (b) {
        b.onclick = async function () {
          if (fixed) return;
          if (tapOk(b.dataset.k, [st.bad])) {
            fixed = true; Snd.tap(); b.classList.add('bad');
            $$('#act .wd').forEach(function (x) { x.disabled = true; });
            $('#act .hint2').textContent = '「' + b.textContent + '」を、どう直す？';
            tray(optsHtml(st.o));
            $$('#tray .opt').forEach(function (o) {
              o.onclick = async function (e) {
                if (e.target.closest('.gl')) return;
                var i = +o.dataset.i;
                if (i === st.a) {
                  Snd.ok(); mark(o, 'right');
                  $$('#tray .opt').forEach(function (x) { x.disabled = true; });
                  await sleep(400); done();
                } else {
                  mark(o, 'wrong'); o.disabled = true;
                  if (st.ng) { var n = $('#act .ng'); n.hidden = false; n.innerHTML = '💡 ' + ja(st.ng); }
                  await miss();
                }
              };
            });
            cur.solve = function () { $$('#tray .opt')[st.a].click(); };
            scrollAct();
          } else {
            b.classList.add('wrong');
            if (st.ng) { var n = $('#act .ng'); n.hidden = false; n.innerHTML = '💡 ' + ja(st.ng); }
            await miss();
            b.classList.remove('wrong');
          }
        };
      });
      cur.solve = function () { $$('#act .wd').filter(function (b) { return tapOk(b.dataset.k, [st.bad]); })[0].click(); };
    });
    var d = wordDiff(plain(st.es), plain(st.fix));
    act().innerHTML = '<div class="q draft"><p class="sh">✒️ 直した原稿</p><p class="qes big"><span class="es">' + d.b + sayBtn(st.fix) + '</span></p></div>';
    autoSay(st.fix);
    tray('<button class="btn main wide" id="rpOk">直した ▶</button>');
    await wait(function (done) { $('#rpOk').onclick = done; cur.solve = done; });
    clearAct();
    if (st.r) await run(st.r);
  };

  /* 取材メモを手に入れる */
  H.get = async function (st) {
    X.ev.add(st.ev);
    var e = CASE.evidence[st.ev];
    $('#talk').hidden = true;
    Snd.ok();
    act().innerHTML = '<div class="got"><span class="gt">📝 取材メモに書いた</span><div class="evc"><span class="em">' + e.e + '</span><div><b>' + esc(e.n) + '</b><p>' + ja(e.d) + '</p></div></div></div>';
    tray('<button class="btn main" id="gOk">書いた ▶</button>');
    scrollAct();
    await wait(function (done) { $('#gOk').onclick = done; cur.solve = done; });
    clearAct();
  };

  /* 調べる：場面の上に調べるところが出る。ぜんぶ調べたら次へ */
  H.inspect = async function (st) {
    var seen = {};
    $('#talk').hidden = true; setSpeaker(null);
    while (Object.keys(seen).length < st.spots.length) {
      var idx = await wait(function (done) {
        var box = el('div', 'spots');
        st.spots.forEach(function (s, i) {
          var b = el('button', 'spot' + (seen[i] ? ' seen' : ''), '<span class="em">' + s.e + '</span><small>' + esc(s.n) + '</small>' + (seen[i] ? '<i class="ck">✓</i>' : ''));
          b.onclick = function () { Snd.tap(); done(i); };
          box.appendChild(b);
        });
        $('#ref').innerHTML = '';
        act().innerHTML = '<p class="guide">🔍 調べるところをタップ（' + Object.keys(seen).length + ' / ' + st.spots.length + '）</p>';
        act().appendChild(box);
        tray('');
        $('#board').scrollTop = 0;
        cur.solve = function () { for (var i = 0; i < st.spots.length; i++) if (!seen[i]) { $$('#act .spot')[i].click(); return; } };
      });
      seen[idx] = true;
      clearAct();
      await run(st.spots[idx].steps);
      $('#talk').hidden = true;
    }
    clearAct();
  };

  /* メモをえらぶ（取材メモをつきつけ用に開く） */
  function chooseEvidence(title) {
    return new Promise(function (res) {
      var h = '<h3>📝 ' + esc(title || 'つきつけるメモをえらぶ') + '</h3><div class="evlist">';
      Object.keys(CASE.evidence).forEach(function (k) {
        if (!X.ev.has(k)) return;
        var e = CASE.evidence[k];
        h += '<button class="evc pick" data-k="' + k + '"><span class="em">' + e.e + '</span><div><b>' + esc(e.n) + '</b><p>' + ja(e.d) + '</p></div></button>';
      });
      modal(h + '</div>', 'evm');
      modalClose = function () { res(null); };
      $$('#mbody .pick').forEach(function (b) { b.onclick = function () { closeModalSilently(); res(b.dataset.k); }; });
    });
  }

  /* 取材・対決：◀▶ で発言を見て、つっこむか、メモをつきつける */
  H.testimony = async function (st) {
    X.witness = st.who; drawStage(); setSpeaker(st.who);
    $('#talk').hidden = true; $('#ref').innerHTML = '';
    await slam('〜 発言 〜', 'banner');
    var i = 0, wrong = 0, c = who(st.who), goal = st.lines.findIndex(function (l) { return l.ok; }), tried = '';
    function draw() {
      var L = st.lines[i];
      act().innerHTML = '<div class="testi"><div class="th">〜 ' + esc(c.e + ' ' + c.n) + '「' + esc(st.title) + '」 〜</div>' + tried +
        '<div class="tl"><span class="tno">' + (i + 1) + ' / ' + st.lines.length + '</span><p class="tles">' + es(L.es) + sayBtn(L.es) + '</p>' + jaLine(L.ja) + '</div></div>';
      bindJa(act());
      tray('<div class="xrow"><button class="btn nav" id="xPrev" aria-label="前の発言">◀</button><button class="btn press" id="xPress">¿De verdad?<small>つっこむ</small></button>' +
        '<button class="btn obj" id="xObj">¡No cuadra!<small>メモをつきつける</small></button><button class="btn nav" id="xNext" aria-label="次の発言">▶</button></div>');
      autoSay(L.es);
      scrollAct();
    }
    while (true) {
      var a = await wait(function (done) {
        draw();
        $('#xPrev').onclick = function () { done('prev'); };
        $('#xNext').onclick = function () { done('next'); };
        $('#xPress').onclick = function () { done('press'); };
        $('#xObj').onclick = function () { done('obj'); };
        cur.solve = function () { if (i !== goal) done(i < goal ? 'next' : 'prev'); else done('obj'); };
      });
      if (a === 'prev') { i = (i + st.lines.length - 1) % st.lines.length; Snd.tap(); continue; }
      if (a === 'next') { i = (i + 1) % st.lines.length; Snd.tap(); continue; }
      var L = st.lines[i];
      if (a === 'press') {
        await slam('¿De verdad?', 'press');
        tray('');
        await run(L.press && L.press.length ? L.press : [{ t: 'say', who: st.who, es: 'Es todo.', x: 'それだけです。' }]);
        $('#talk').hidden = true;
        continue;
      }
      var k = window.__e2e ? (L.ok || [])[0] : await chooseEvidence();
      if (!k) continue;
      await slam('¡No cuadra!');
      tray('');
      if (L.ok && L.ok.indexOf(k) >= 0) { clearAct(); await run(st.after || []); return; }
      wrong++;
      tried = cmpRows('発言 ' + (i + 1) + ' に <b class="wrong">' + evName(k) + '</b> をつきつけた');
      await run([{ t: 'say', who: st.who, es: 'Eso no tiene nada que ver.', x: 'それは、この話と関係ありませんよ。' }]);
      await miss();
      if (wrong >= 2 && st.hint) await run([{ t: 'say', who: 'pepa', x: st.hint }]);
      $('#talk').hidden = true;
    }
  };

  /* 1つの主張にメモをつきつける */
  H.present = async function (st) {
    $('#talk').hidden = true;
    var wrong = 0, tried = '';
    while (true) {
      act().innerHTML = '<div class="q"><p class="qq">' + ja(st.q) + '</p>' + tried + '</div>';
      tray('<button class="btn obj wide" id="pObj">📝 ¡No cuadra!<small>メモをつきつける</small></button>');
      scrollAct();
      var k = await wait(function (done) {
        $('#pObj').onclick = function () { chooseEvidence().then(function (v) { if (v) done(v); }); };
        cur.solve = function () { done(st.ok[0]); };
      });
      await slam('¡No cuadra!');
      clearAct();
      if (st.ok.indexOf(k) >= 0) { await run(st.after || []); return; }
      wrong++;
      tried = cmpRows('<b class="wrong">' + evName(k) + '</b> をつきつけた');
      await run([{ t: 'say', who: 'ramon', x: 'うーん、そのメモで…\nなにが言いたいんだ？' }]);
      await miss();
      if (wrong >= 2 && st.hint) await run([{ t: 'say', who: 'pepa', x: st.hint }]);
    }
  };

  /* つじつまの合わない 2 つの発言をタップ */
  H.contra = async function (st) {
    if (st.who) { X.witness = st.who; drawStage(); setSpeaker(st.who); }
    $('#talk').hidden = true;
    var c = who(st.who), last = [];
    while (true) {
      var picked = [];
      var ok = await wait(function (done) {
        act().innerHTML = '<div class="testi"><div class="th">〜 ' + esc(c.e + ' ' + c.n) + '「' + esc(st.title || '発言') + '」 〜</div>' +
          (last.length ? cmpRows('<b class="wrong">✕ の2つ</b>は、つじつまが合っている') : '') + '<p class="guide">つじつまの合わない <b>2つ</b> の発言をタップ</p>' +
          st.lines.map(function (L, i) { return '<button class="cl' + (last.indexOf(i) >= 0 ? ' tried' : '') + '" data-i="' + i + '"><span class="tles">' + es(L.es) + '</span><span class="tlja' + (S.settings.ja ? ' open' : '') + '">' + esc(L.ja) + '</span></button>'; }).join('') + '</div>';
        tray('<p class="hint2">訳は、文の下をタップすると見えます</p>');
        $$('#act .cl').forEach(function (b) {
          b.onclick = function (e) {
            if (e.target.closest('.gl')) return;
            var tj = e.target.closest('.tlja'); if (tj && !tj.classList.contains('open')) { tj.classList.add('open'); return; }
            var i = +b.dataset.i;
            if (picked.indexOf(i) >= 0) { picked.splice(picked.indexOf(i), 1); b.classList.remove('on'); return; }
            picked.push(i); b.classList.add('on'); Snd.tap(); autoSay(st.lines[i].es);
            if (picked.length === 2) { var s = picked.slice().sort(); var a = st.a.slice().sort(); done(s[0] === a[0] && s[1] === a[1]); }
          };
        });
        scrollAct();
        cur.solve = function () { picked = []; done(true); };
      });
      if (ok) { await slam('¡No cuadra!'); clearAct(); await run(st.after || []); return; }
      last = picked.slice();
      await sleep(250);
      await miss();
      if (st.hint) await run([{ t: 'say', who: 'pepa', x: st.hint }]);
      $('#talk').hidden = true;
    }
  };

  /* 記者会見：流れていく発言を、ごまかしの行で止める */
  H.stop = async function (st) {
    if (st.who) setSpeaker(st.who);
    $('#talk').hidden = true;
    var c = who(st.who), tried = '';
    while (true) {
      var i = 0, timer = null;
      var at = await wait(function (done) {
        act().innerHTML = '<div class="testi roll"><div class="th">🎤 ' + esc(c.e + ' ' + c.n) + '「' + esc(st.title || '発表') + '」</div>' + tried + '<div class="tl"><span class="tno"></span><p class="tles"></p><p class="tlja open"></p></div><div class="rbar"><i></i></div></div>';
        tray('<p class="hint2">ごまかしの行が出たら止めよう</p><button class="btn press wide" id="sStop">¡Un momento!<small>ここだ！</small></button>');
        function tick() {
          var L = st.lines[i];
          $('#act .tno').textContent = (i + 1) + ' / ' + st.lines.length;
          $('#act .tles').innerHTML = es(L.es);
          $('#act .tlja').textContent = L.ja;
          var r = $('#act .rbar i'); r.style.animation = 'none'; void r.offsetWidth; r.style.animation = '';
          autoSay(L.es);
        }
        tick();
        timer = setInterval(function () { i = (i + 1) % st.lines.length; tick(); }, 4500);
        $('#sStop').onclick = function () { clearInterval(timer); done(i); };
        cur.solve = function () { clearInterval(timer); done(st.a); };
        scrollAct();
      });
      clearInterval(timer);
      if (at === st.a) { await slam('¡Un momento!', 'press'); clearAct(); await run(st.after || []); return; }
      tried = cmpRows('<b class="wrong">' + (at + 1) + '行め</b>「' + es(st.lines[at].es) + '」で止めた');
      clearAct();
      await run([{ t: 'say', who: st.who || 'ramon', x: 'その行に…\nなにか問題でも？' }]);
      await miss();
      if (st.hint) await run([{ t: 'say', who: 'pepa', x: st.hint }]);
      $('#talk').hidden = true;
    }
  };

  /* 見習いティトの訳がちがう → 正しい訳をえらぶ */
  H.interp = async function (st) {
    if (X.cast.indexOf('tito') >= 0) setSpeaker('tito');
    $('#talk').hidden = true;
    act().innerHTML = '<div class="interp"><p class="ih">👦 ティトの訳を、たしかめよう</p><p class="qes">' + es(st.es) + sayBtn(st.es) + '</p><p class="iwrong">👦「' + esc(st.ja) + '」</p><p class="guide">正しい訳は？</p><p class="ng" hidden></p></div>';
    tray('<div class="opts col">' + st.o.map(function (o, i) { return '<button class="btn opt" data-i="' + i + '">' + esc(o) + '</button>'; }).join('') + '</div>');
    autoSay(st.es);
    scrollAct();
    await wait(function (done) {
      $$('#tray .opt').forEach(function (b) {
        b.onclick = async function () {
          var i = +b.dataset.i;
          if (i === st.a) { b.classList.add('right'); $$('#tray .opt').forEach(function (x) { x.disabled = true; }); await slam('¡Un momento!', 'press'); done(); }
          else { b.classList.add('wrong'); b.disabled = true; if (st.ng) { var n = $('#act .ng'); n.hidden = false; n.innerHTML = '💡 ' + ja(st.ng); } await miss(); }
        };
      });
      cur.solve = function () { $$('#tray .opt')[st.a].click(); };
    });
    clearAct();
    if (st.after) await run(st.after);
  };

  /* タイルで文を組み立てる */
  function tilesOf(s) { return plain(s).replace(/[.!?¡¿,]/g, '').split(/\s+/).filter(Boolean); }
  H.build = async function (st) {
    $('#talk').hidden = true;
    var goal = tilesOf(st.es), pool = shuffle(goal.concat(st.x || []).map(function (w, i) { return { w: w, i: i }; })), tried = '';
    while (true) {
      var line = [];
      var ok = await wait(function (done) {
        act().innerHTML = '<div class="q"><p class="qq">' + ja(st.q) + '</p>' + tried + '<div class="line"></div></div>';
        tray('<div class="tiles">' + pool.map(function (p) { return '<button class="btn tile" data-i="' + p.i + '">' + esc(p.w) + '</button>'; }).join('') + '</div>');
        function paint() {
          var L = $('#act .line');
          L.innerHTML = line.length ? line.map(function (p) { return '<button class="tile in" data-i="' + p.i + '">' + esc(p.w) + '</button>'; }).join('') : '<span class="ph">下のタイルをタップ</span>';
          $$('.tile.in', L).forEach(function (b) { b.onclick = function () { var i = +b.dataset.i; line = line.filter(function (p) { return p.i !== i; }); $('#tray .tile[data-i="' + i + '"]').disabled = false; paint(); }; });
        }
        paint();
        $$('#tray .tile').forEach(function (b) {
          b.onclick = function () {
            Snd.tap(); var i = +b.dataset.i; line.push(pool.filter(function (p) { return p.i === i; })[0]); b.disabled = true; paint();
            if (line.length === goal.length) done(norm(line.map(function (p) { return p.w; }).join(' ')) === norm(goal.join(' ')));
          };
        });
        cur.solve = function () { done(true); };
        scrollAct();
      });
      if (ok) {
        Snd.ok();
        act().innerHTML = '<div class="q"><p class="qes big">' + es(st.es) + '</p></div>';
        autoSay(st.es); await sleep(900); clearAct();
        if (st.r) await run(st.r);
        return;
      }
      $('#act .line').classList.add('bad');
      tried = cmpRows('<span class="es">' + wordDiff(line.map(function (p) { return p.w; }).join(' '), goal.join(' ')).a + '</span>');
      await sleep(350);
      await miss();
    }
  };
  H.slam = function (st) { return slam(st.txt); };

  /* スクープ：新聞の一面が刷り上がる（事件の終わり） */
  H.scoop = async function (st) {
    $('#talk').hidden = true; clearAct();
    Snd.press();
    await sleep(500);
    await wait(function (done) {
      var v = el('div', 'scoop', '<div class="sin"><p class="smh">EL ECO DEL BARRIO</p><small>号外</small><b>' + esc(st.txt) + '</b><span>' + es(st.es) + '</span><i>¡PRIMERA PLANA!</i></div>');
      document.body.appendChild(v);
      if (window.Sfx) Sfx.levelUp();
      buzz([30, 60, 30, 60, 120]);
      function go() { v.remove(); done(); }
      setTimeout(function () { v.addEventListener('click', go); }, 900);
      cur.solve = go;
    });
  };

  /* メモ・場面を、途中から再開するときに組み立て直す */
  function replay(steps, upto) {
    function walk(arr) {
      arr.forEach(function (s) {
        if (s.t === 'get') X.ev.add(s.ev);
        if (s.t === 'scene') { X.place = s.place; X.cast = (s.cast || []).slice(); X.duel = !!s.duel; X.witness = null; }
        if (s.t === 'enter') { if (X.cast.indexOf(s.who) < 0) X.cast.push(s.who); if (X.duel) X.witness = s.who; }
        ['steps', 'after', 'r'].forEach(function (k) { if (Array.isArray(s[k])) walk(s[k]); });
        (s.spots || []).forEach(function (p) { walk(p.steps); });
        (s.lines || []).forEach(function (l) { if (l.press) walk(l.press); });
      });
    }
    walk(steps.slice(0, upto));
  }

  async function playCase(C, restart) {
    CASE = C;
    var r = rec(C.id);
    if (restart || r.done) { r.i = 0; r.ink = 5; r.miss = 0; }
    X = { ev: new Set(), cast: [], place: 'redaccion', duel: false, ink: r.ink || 5, miss: r.miss || 0, quit: false, resumed: false };
    $('#pTitle').textContent = '第' + C.no + '話 ' + C.title;
    $('#ref').innerHTML = ''; clearAct(); $('#talk').hidden = true;
    show('play');
    var from = r.i || 0;
    /* 途中から：直前の scene まで戻して、その場面から始める */
    var k = from; while (k > 0 && C.steps[k].t !== 'scene') k--;
    if (k > 0) { replay(C.steps, k); X.resumed = !!C.steps[k].duel; from = k; }
    if (from > 0 && C.steps[from].duel && r.ink) X.ink = r.ink;
    drawStage(); hud();
    try {
      for (var i = from; i < C.steps.length; i++) {
        if (C.steps[i].t === 'scene') { r.i = i; save(); }
        await H[C.steps[i].t](C.steps[i]);
      }
    } catch (e) { if (e === 'quit') return; throw e; }
    r.done = true; r.i = 0;
    var rank = X.miss === 0 ? 'S' : X.miss <= 2 ? 'A' : 'B';
    if (!r.rank || 'SAB'.indexOf(rank) < 'SAB'.indexOf(r.rank)) r.rank = rank;
    r.lastMiss = X.miss;
    save();
    doneScreen(C, rank);
  }

  function doneScreen(C, rank) {
    var next = D.cases[D.cases.indexOf(C) + 1];
    var d = $('#done');
    d.innerHTML = '<div class="closed"><p class="cno">第' + C.no + '話</p><h2>' + esc(C.title) + '</h2><p class="ces">' + esc(C.es) + '</p>' +
      '<div class="stamp r' + rank + '"><small>評価</small><b>' + rank + '</b></div>' +
      '<p class="cmiss">' + (X.miss === 0 ? 'ノーミス！ インクは 1 滴も減らなかった。' : 'ミス ' + X.miss + ' 回') + '</p>' +
      '<p class="cgr">この話で習った形：<b>' + esc(C.grammar) + '</b></p>' +
      (next ? '<button class="btn main wide" id="dNext">📰 第' + next.no + '話へ</button>' : '<p class="fin">〜 全7話 解決 〜<br>🎓 西検模試が開きました。</p>') +
      '<button class="btn sub wide" id="dHome">表紙へもどる</button></div>';
    show('done');
    if (next) $('#dNext').onclick = function () { S.page = D.cases.indexOf(next); save(); playCase(next); };
    $('#dHome').onclick = function () { renderHome(); show('home'); };
  }

  /* ---------- 取材ファイル（メモ・人物・ノート） ---------- */
  function openRecord() {
    if (!CASE) return;
    var h = '<h3>📁 取材ファイル</h3><div class="tabs"><button class="tab on" data-t="ev">取材メモ</button><button class="tab" data-t="ppl">人物</button><button class="tab" data-t="nt">ノート</button></div><div id="recBody"></div>';
    var body = modal(h, 'evm');
    function paint(t) {
      $$('#mbody .tab').forEach(function (b) { b.classList.toggle('on', b.dataset.t === t); });
      var o = '';
      if (t === 'ev') {
        Object.keys(CASE.evidence).forEach(function (k) { if (!X.ev.has(k)) return; var e = CASE.evidence[k]; o += '<div class="evc"><span class="em">' + e.e + '</span><div><b>' + esc(e.n) + '</b><p>' + ja(e.d) + '</p></div></div>'; });
        if (!o) o = '<p class="empty">まだ取材メモはありません。</p>';
      } else if (t === 'ppl') {
        Object.keys(D.cast).concat(Object.keys(CASE.cast)).forEach(function (id) { var c = who(id); o += '<div class="evc"><span class="em">' + c.e + '</span><div><b>' + esc(c.n) + ' <i class="esi">' + esc(c.es || '') + '</i></b><p>' + esc(c.role || '') + '</p></div></div>'; });
      } else {
        if (S.flow) o += flowHtml(S.flow, 0);
        Object.keys(S.notes).forEach(function (k) { if (S.notes[k].c === CASE.id) o += noteHtml(S.notes[k]); });
        if (!o) o = '<p class="empty">まだノートはありません。</p>';
      }
      $('#recBody', body).innerHTML = o;
    }
    $$('#mbody .tab').forEach(function (b) { b.onclick = function () { paint(b.dataset.t); }; });
    paint('ev');
  }
  $('#pRec').addEventListener('click', openRecord);
  $('#pQuit').addEventListener('click', quitCase);

  /* ---------- 校閲ノート（ぜんぶの事件。only＝その事件だけ） ---------- */
  function openNotes(only) {
    var h = '<h3>✒️ ペパさんの校閲ノート</h3>';
    if (S.flow && !only) h += flowHtml(S.flow, 0);
    D.cases.forEach(function (C) {
      if (only && C.id !== only) return;
      var n = Object.keys(S.notes).filter(function (k) { return S.notes[k].c === C.id; });
      if (!n.length) return;
      h += '<h4>第' + C.no + '話 ' + esc(C.title) + '<small>' + esc(C.grammar) + '</small></h4>';
      n.forEach(function (k) { h += noteHtml(S.notes[k]); });
    });
    if (only) { var f = D.flow.filter(function (x) { return x.c === only; })[0]; if (f) h += '<div class="flow"><ol><li class="new"><p class="fq">' + ja(f.q) + '</p><p class="fa">→ ' + ja(f.a) + '</p><p class="fex">' + es(f.ex) + '</p></li></ol></div>'; }
    if (h === '<h3>✒️ ペパさんの校閲ノート</h3>') h += '<p class="empty">事件を取材すると、ペパさんがノートに書きためていきます。</p>';
    modal(h, 'evm');
  }

  /* =========================================================
   * 表紙（新聞の一面）
   * ========================================================= */
  function caseOpen(i) { return i === 0 || SANDBOX || !!(S.lessons[D.cases[i - 1].id] || {}).done; }
  function allDone() { return D.cases.every(function (c) { return caseDone(c.id); }); }
  function renderHome() {
    var i = Math.min(S.page || 0, D.cases.length - 1), C = D.cases[i], r = S.lessons[C.id] || {}, open = caseOpen(i);
    var b = $('#book');
    b.innerHTML = '<button class="turn prev" id="bPrev" aria-label="前の号"' + (i === 0 ? ' disabled' : '') + '>◀</button>' +
      '<div class="page' + (open ? '' : ' locked') + '">' +
      '<p class="pno"><span>N.º ' + C.no + '</span><span>第' + C.no + '話</span></p>' +
      '<div class="pfront"><div class="vig"><span>' + (open ? C.icon : '🔒') + '</span></div><div class="phead"><h2>' + esc(C.title) + '</h2><p class="pes">' + esc(C.es) + '</p></div></div>' +
      (open ? '<p class="pcover">' + esc(C.cover || '') + '</p>' : '<p class="pcover">第' + (C.no - 1) + '話を解決すると読めます。</p>') +
      '<p class="pgr">' + esc(C.grammar) + '</p>' +
      (r.done ? '<div class="stamp small r' + r.rank + '"><b>' + r.rank + '</b></div>' : '') +
      (open ? (r.i > 0 && !r.done ? '<button class="btn main" id="bGo">📰 つづきから</button><button class="link" id="bRe">はじめから読む</button>' : '<button class="btn main" id="bGo">📰 ' + (r.done ? 'もう一度読む' : '取材にいく') + '</button>') : '') +
      '</div><button class="turn next" id="bNext" aria-label="次の号"' + (i === D.cases.length - 1 ? ' disabled' : '') + '>▶</button>' +
      '<div class="dots">' + D.cases.map(function (c, k) { var rr = S.lessons[c.id] || {}; return '<i class="' + (k === i ? 'on ' : '') + (rr.done ? 'done' : '') + '"></i>'; }).join('') + '</div>';
    $('#bPrev').onclick = function () { S.page = i - 1; save(); Snd.page(); turn(-1); };
    $('#bNext').onclick = function () { S.page = i + 1; save(); Snd.page(); turn(1); };
    if ($('#bGo')) $('#bGo').onclick = function () { unlockAudio(); playCase(C); };
    if ($('#bRe')) $('#bRe').onclick = function () { unlockAudio(); playCase(C, true); };
    $('#hDrillBest').textContent = S.drillBest ? '最高 ' + S.drillBest + ' 問' : '60秒';
    $('#hNotesN').textContent = Object.keys(S.notes).length + ' ページ';
    $('#hExamN').textContent = allDone() ? (S.exam ? '最高 ' + S.exam.best + '%' + (S.exam.pass ? ' 合格' : '') : '20問') : '全話クリアで';
    $('#hExam').classList.toggle('lock', !allDone());
    var wq = wordQueue();
    $('#hWordsN').textContent = Object.keys(S.words).length ? (wq.due + wq.fresh ? '今日 ' + Math.min(10, wq.due + wq.fresh) + ' 語' : '今日はおわり') : 'まだ 0 語';
    $('#tgSound').checked = S.settings.sound; $('#tgSpeak').checked = S.settings.speak; $('#tgJa').checked = S.settings.ja;
  }
  function turn(d) { renderHome(); var p = $('#book .page'); p.classList.add(d > 0 ? 'fromR' : 'fromL'); }
  function unlockAudio() { if (window.Sfx) Sfx.unlock(); }

  $('#hNotes').addEventListener('click', function () { openNotes(); });
  $('#tgSound').addEventListener('change', function (e) { S.settings.sound = e.target.checked; save(); if (e.target.checked) { unlockAudio(); Snd.press(); } });
  $('#tgSpeak').addEventListener('change', function (e) { S.settings.speak = e.target.checked; save(); if (e.target.checked) Speech.say('¿Quién fue?'); });
  $('#tgJa').addEventListener('change', function (e) { S.settings.ja = e.target.checked; save(); });
  $('#hReset').addEventListener('click', function () {
    var b = modal('<h3>記録をリセット</h3><p>事件の進み具合・ノート・単語・ドリルと西検模試の記録を消します。</p><button class="btn obj wide" id="rsOk">消す</button>');
    $('#rsOk', b).onclick = function () { S = fresh(); save(); closeModalSilently(); renderHome(); };
  });

  /* =========================================================
   * デスクの即答ドリル：時間内に何問解けるか。
   *  時間切れのときに解いている1問は、答えるまで終わらない（まちがえたら直してから結果へ）
   *  問題：QF.drill.items（{ es, ja, k }＝やった人を選ぶ／{ es, ja, o, a }＝空所）。c の事件をクリアした問題だけ
   * ========================================================= */
  var DR = null, DRILL_MS = 60000;
  function drillPool() {
    var p = D.drill.items.filter(function (q) { return caseDone(q.c); });
    return p.length ? p : D.drill.items.filter(function (q) { return q.c === 'c1'; });
  }
  /* やった人の選択肢：クリアした事件の仮面から、正解＋3つ */
  function drillMasks(k) {
    var open = Object.keys(D.masks).filter(function (m) { return D.drill.maskCase[m] && caseDone(D.drill.maskCase[m]); });
    if (open.indexOf(k) < 0) open.push(k);
    var others = shuffle(open.filter(function (m) { return m !== k; })).slice(0, 3);
    if (others.length < 2) others = shuffle(Object.keys(D.masks).filter(function (m) { return m !== k; })).slice(0, 2);
    return shuffle([k].concat(others));
  }
  function startDrill() {
    unlockAudio();
    DR = { n: 0, combo: 0, left: DRILL_MS, paused: false, miss: [], pool: shuffle(drillPool()), timer: null, q: null, last: false, seen: 0 };
    show('drill');
    nextDrill();
    var t0 = Date.now();
    DR.timer = setInterval(function () {
      var now = Date.now();
      if (!DR.paused) DR.left -= now - t0;
      t0 = now;
      $('#dTime').style.width = Math.max(0, DR.left / DRILL_MS * 100) + '%';
      if (DR.left <= 0 && !DR.last) {
        DR.last = true; clearInterval(DR.timer);
        $('.dtime').classList.add('over');
        $('#dLast').hidden = false;
      }
    }, 100);
  }
  function nextDrill() {
    if (DR.seen >= DR.pool.length) { DR.pool = shuffle(DR.pool); DR.seen = 0; }
    var q = DR.q = DR.pool[DR.seen++];
    $('#dScore').innerHTML = '✅ ' + DR.n + ' 問' + (DR.combo >= 3 ? ' <i class="cb">' + DR.combo + '連続</i>' : '');
    var body = '<div class="testi"><div class="th">' + (q.k ? '〜 やった人は？ 〜' : '〜 ___ に入るのは？ 〜') + '</div><div class="tl"><p class="tles">' + es(q.es) + sayBtn(q.es.replace('___', '…')) + '</p>' + jaLine(q.ja) + '</div></div>';
    $('#dBoard').innerHTML = body;
    bindJa($('#dBoard'));
    if (q.k) {
      q.opts = drillMasks(q.k);
      $('#dTray').innerHTML = '<div class="masks">' + q.opts.map(function (k, i) { var m = D.masks[k]; return '<button class="btn mask" data-i="' + i + '"><span class="me">' + m.e + '</span><b>' + esc(m.n) + '</b></button>'; }).join('') + '</div>';
    } else {
      q.ord = shuffle(q.o.map(function (x, i) { return i; }));   // 選択肢の順はまぜる（正解の位置で覚えないように）
      $('#dTray').innerHTML = optsHtml(q.ord.map(function (i) { return q.o[i]; }));
    }
    autoSay(q.es);
    $$('#dTray .btn[data-i]').forEach(function (b) { b.onclick = function (e) { if (e.target.closest('.gl')) return; answer(+b.dataset.i, b); }; });
  }
  function drillRight(q) { return q.k ? maskName(q.k) : '<span class="es">' + esc(q.o[q.a]) + '</span>'; }
  function drillYou(q, i) { return q.k ? maskName(q.opts[i]) : '<span class="es">' + esc(q.o[q.ord[i]]) + '</span>'; }
  async function answer(i, b) {
    var q = DR.q, ok = q.k ? q.opts[i] === q.k : q.ord[i] === q.a;
    $$('#dTray .btn').forEach(function (x) { x.disabled = true; });
    if (ok) {
      DR.n++; DR.combo++;
      Snd.ok(); mark(b, 'right');
      $('#dBoard .tl').classList.add('good');
      await sleep(380);
      if (!DR) return;
      if (DR.last) { endDrill(); return; }
      nextDrill();
      return;
    }
    DR.combo = 0; DR.paused = true; DR.miss.push({ q: q, you: drillYou(q, i) });
    Snd.ng(); mark(b, 'wrong');
    var C = caseOf(q.c);
    $('#dBoard').insertAdjacentHTML('beforeend', '<div class="dfix">' + cmpRows(drillYou(q, i), drillRight(q)) + (q.why ? '<p class="nja">🔎 ' + ja(q.why) + '</p>' : '') +
      (C ? '<button class="btn sub" id="dNote">✒️ 第' + C.no + '話のノートを見る</button>' : '') + '</div>');
    if ($('#dNote')) $('#dNote').onclick = function () { openNotes(q.c); };
    $('#dBoard').scrollTop = 1e4;
    $('#dTray').innerHTML = '<button class="btn main wide" id="dN">' + (DR.last ? '結果へ ▶' : 'つぎの問題 ▶') + '</button>';
    $('#dN').onclick = function () { DR.paused = false; if (DR.last) endDrill(); else nextDrill(); };
  }
  function endDrill() {
    if (!DR) return;
    clearInterval(DR.timer);
    var best = DR.n > S.drillBest; if (best) { S.drillBest = DR.n; save(); }
    var d = $('#done');
    d.innerHTML = '<div class="closed"><p class="cno">デスクの即答ドリル</p><h2>' + DR.n + ' 問 正解</h2>' + (best ? '<p class="fin">✨ 最高記録！</p>' : '<p class="ces">最高 ' + S.drillBest + ' 問</p>') +
      (DR.miss.length ? '<h4>まちがえた問題</h4>' + DR.miss.map(function (m) { return '<div class="nr"><p class="nes">' + es(m.q.es) + '</p>' + cmpRows(m.you, drillRight(m.q)) + (m.q.why ? '<p class="nja">🔎 ' + ja(m.q.why) + '</p>' : '') + '</div>'; }).join('') : '') +
      '<button class="btn main wide" id="drAgain">もう一度</button><button class="btn sub wide" id="drHome">表紙へもどる</button></div>';
    DR = null;
    $('.dtime').classList.remove('over'); $('#dLast').hidden = true;
    show('done');
    $('#drAgain').onclick = startDrill;
    $('#drHome').onclick = function () { renderHome(); show('home'); };
  }
  $('#hDrill').addEventListener('click', startDrill);
  $('#dQuit').addEventListener('click', function () { if (DR) { clearInterval(DR.timer); DR = null; } $('.dtime').classList.remove('over'); $('#dLast').hidden = true; renderHome(); show('home'); });

  /* =========================================================
   * 🎓 西検模試：試験と同じ形の20問を、分野ごとに。答え合わせは最後。合格ライン 70%
   *  QF.exam = { secs:{ id:{ n, c } }, items:[{ s, q, es?, o, a, why }] }
   * ========================================================= */
  var EX = null;
  function startExam() {
    if (!allDone()) { modal('<h3>🎓 西検模試</h3><p>全7話を解決すると開きます。<br>試験と同じ形の問題 20 問で、受身と se の使い分けの仕上がりを確かめます。</p>'); return; }
    unlockAudio();
    var secs = Object.keys(D.exam.secs), per = Math.ceil(20 / secs.length), list = [];
    secs.forEach(function (s) { list = list.concat(shuffle(D.exam.items.filter(function (q) { return q.s === s; })).slice(0, per)); });
    list = shuffle(list).slice(0, 20);
    EX = { q: list, i: 0, ans: [] };
    show('exam');
    nextExam();
  }
  function nextExam() {
    if (EX.i >= EX.q.length) { endExam(); return; }
    var q = EX.q[EX.i];
    $('#eProg').textContent = (EX.i + 1) + ' / ' + EX.q.length;
    $('#eBoard').innerHTML = '<div class="q exq"><p class="exn">問 ' + (EX.i + 1) + '</p><p class="qq">' + ja(q.q) + '</p>' + (q.es ? '<p class="qes">' + es(q.es) + '</p>' : '') + '</div>';
    var ord = shuffle(q.o.map(function (x, i) { return i; }));
    $('#eTray').innerHTML = optsHtml(ord.map(function (i) { return q.o[i]; }));
    $('#eBoard').scrollTop = 0;
    $$('#eTray .opt').forEach(function (b) {
      b.onclick = function (e) {
        if (e.target.closest('.gl')) return;
        Snd.tap(); EX.ans.push(ord[+b.dataset.i]); EX.i++; nextExam();
      };
    });
  }
  function endExam() {
    var by = {}, ok = 0;
    EX.q.forEach(function (q, i) { var s = by[q.s] || (by[q.s] = { n: 0, ok: 0 }); s.n++; if (EX.ans[i] === q.a) { s.ok++; ok++; } });
    var pct = Math.round(ok / EX.q.length * 100), pass = pct >= 70;
    S.exam = { best: Math.max(pct, (S.exam || {}).best || 0), pass: pass || !!(S.exam || {}).pass }; save();
    var h = '<div class="closed"><p class="cno">🎓 西検模試</p><h2>' + ok + ' / ' + EX.q.length + '（' + pct + '%）</h2>' +
      '<div class="stamp ' + (pass ? 'rS' : 'rB') + '"><small>' + (pass ? '合格' : 'あと少し') + '</small><b>' + (pass ? '合' : '再') + '</b></div><p class="ces">合格ライン 70%</p><h4>分野ごと</h4><div class="secs">';
    Object.keys(D.exam.secs).forEach(function (s) {
      var r = by[s]; if (!r) return;
      var sec = D.exam.secs[s], weak = r.ok < r.n;
      h += '<div class="sec' + (weak ? ' weak' : '') + '"><span>' + esc(sec.n) + '</span><b>' + r.ok + ' / ' + r.n + '</b>' + (weak ? '<button class="btn sub" data-c="' + sec.c + '">✒️ 第' + caseOf(sec.c).no + '話のノート</button>' : '') + '</div>';
    });
    h += '</div><h4>答え合わせ</h4>';
    EX.q.forEach(function (q, i) {
      var right = EX.ans[i] === q.a;
      h += '<div class="nr exr"><p class="exn">問 ' + (i + 1) + (right ? ' ○' : ' ✕') + '</p>' + (q.es ? '<p class="nes">' + es(q.es) + '</p>' : '<p>' + ja(q.q) + '</p>') +
        (right ? '' : cmpRows(isEs(q.o[EX.ans[i]]) ? '<span class="es">' + esc(q.o[EX.ans[i]]) + '</span>' : esc(q.o[EX.ans[i]]), isEs(q.o[q.a]) ? '<span class="es">' + esc(q.o[q.a]) + '</span>' : esc(q.o[q.a]))) +
        (!right && q.why ? '<p class="nja">🔎 ' + ja(q.why) + '</p>' : '') + '</div>';
    });
    h += '<button class="btn main wide" id="exAgain">もう一度</button><button class="btn sub wide" id="exHome">表紙へもどる</button></div>';
    EX = null;
    $('#done').innerHTML = h;
    show('done');
    $$('#done .sec .btn').forEach(function (b) { b.onclick = function () { openNotes(b.dataset.c); }; });
    $('#exAgain').onclick = startExam;
    $('#exHome').onclick = function () { renderHome(); show('home'); };
  }
  $('#hExam').addEventListener('click', startExam);
  $('#eQuit').addEventListener('click', function () { EX = null; renderHome(); show('home'); });

  /* =========================================================
   * 単語の復習：事件・ドリルで出会った語を、意味の4択で（間隔反復）
   *  S.words[見出し語] = { t 出会った時, ex 最初の例文, c 事件, box 0〜5, due 次の日時, n 復習した回数, look 調べた }
   *  正解で box が1つ上がり、次は 1・3・7・14・30 日後。まちがえたら box 0 にもどり、その回の最後にもう一度
   * ========================================================= */
  var DAY = 864e5, GAP = [0, 1, 3, 7, 14, 30];
  function entry(w) { return DICT.words.filter(function (e) { return e.w === w; })[0]; }
  function wordQueue() {
    var now = Date.now(), all = Object.keys(S.words);
    var due = all.filter(function (w) { return S.words[w].n > 0 && S.words[w].due <= now; })
      .sort(function (a, b) { return S.words[a].due - S.words[b].due; });
    var fresh = all.filter(function (w) { return !S.words[w].n; })
      .sort(function (a, b) { return (S.words[b].look ? 1 : 0) - (S.words[a].look ? 1 : 0) || S.words[a].t - S.words[b].t; });
    return { list: due.concat(fresh).slice(0, 10), due: due.length, fresh: fresh.length };
  }
  function fromName(c) { var C = caseOf(c); return C ? '第' + C.no + '話 ' + C.title : c === 'exam' ? '西検模試' : 'デスクの即答ドリル'; }
  var WR = null;
  function startWords() {
    var q = wordQueue();
    if (!Object.keys(S.words).length) { modal('<h3>🗂 単語の復習</h3><p>事件を読み進めたり、ドリルをしたりすると、出てきた単語がここに集まります。<br>文の中の単語は、タップすると意味が見られます。</p>'); return; }
    if (!q.list.length) { modal('<h3>🗂 単語の復習</h3><p>今日の復習はおわりです。<br>また明日、忘れかけたころに出します。</p><button class="btn sub wide" id="wlOpen">📇 集めた単語の一覧</button>'); $('#wlOpen').onclick = wordList; return; }
    unlockAudio();
    WR = { q: q.list.slice(), i: 0, ok: 0, again: {}, missed: [] };
    show('words');
    nextWord();
  }
  function nextWord() {
    if (WR.i >= WR.q.length) { endWords(); return; }
    var w = WR.q[WR.i], E = entry(w), rec0 = S.words[w];
    if (!E) { WR.i++; nextWord(); return; }
    $('#wProg').textContent = (WR.i + 1) + ' / ' + WR.q.length;
    /* 意味の選択肢：同じ品詞で、意味がちがう語から3つ */
    var pool = DICT.words.filter(function (e) { return e !== E && e.lv >= 3 && e.pos !== 'bad' && e.ja !== E.ja; });
    var same = pool.filter(function (e) { return e.pos === E.pos; });
    var others = shuffle(same.length >= 3 ? same : pool).slice(0, 3);
    var opts = shuffle([E].concat(others));
    $('#wBoard').innerHTML = '<div class="wcard"><p class="wfrom">' + esc(fromName(rec0.c)) + 'で出会った単語' + (rec0.look ? ' ・ 🔍 調べた' : '') + '</p>' +
      '<p class="ww">' + esc(E.w) + sayBtn(E.w) + '</p>' +
      '<p class="wex">' + es(rec0.ex, E) + sayBtn(rec0.ex) + '</p></div><p class="guide">意味は？</p><div class="wfb" hidden></div>';
    $('#wTray').innerHTML = '<div class="opts col">' + opts.map(function (e, i) { return '<button class="btn opt" data-i="' + i + '">' + esc(e.ja) + '</button>'; }).join('') + '</div>';
    autoSay(E.w);
    $$('#wTray .opt').forEach(function (b) {
      b.onclick = function () {
        var right = opts[+b.dataset.i] === E;
        $$('#wTray .opt').forEach(function (x) { x.disabled = true; if (opts[+x.dataset.i] === E) x.classList.add('right'); });
        var r = S.words[w];
        if (right) {
          Snd.ok(); WR.ok++;
          if (!WR.again[w]) { r.box = Math.min(5, r.box + 1); r.due = Date.now() + GAP[r.box] * DAY; }
          r.n++;
        } else {
          Snd.ng(); b.classList.add('wrong');
          r.box = 0; r.due = Date.now(); r.n++;
          if (!WR.again[w]) { WR.again[w] = true; WR.q.push(w); WR.missed.push(w); }
        }
        save();
        var fb = $('#wBoard .wfb'); fb.hidden = false;
        fb.className = 'wfb ' + (right ? 'good' : 'bad');
        fb.innerHTML = '<b>' + (right ? '○ 正解' : '✕ 正しくは') + '</b>　' + esc(E.w) + '＝' + esc(E.ja) + (right ? '<br><small>次は ' + GAP[r.box] + ' 日後</small>' : '<br><small>この回の最後に、もう一度出ます</small>');
        $('#wTray').insertAdjacentHTML('beforeend', '<button class="btn main wide" id="wNext">つぎへ ▶</button>');
        $('#wNext').onclick = function () { WR.i++; nextWord(); };
        $('#wBoard').scrollTop = 1e4;
      };
    });
  }
  function endWords() {
    var d = $('#done'), total = WR.q.length - WR.missed.length, n = total - WR.missed.length;
    d.innerHTML = '<div class="closed"><p class="cno">単語の復習</p><h2>' + n + ' / ' + total + ' 語</h2>' +
      '<p class="ces">' + (WR.missed.length ? '1回目でまちがえた語は、また明日出します' : 'ぜんぶ1回目で正解！') + '</p>' +
      (WR.missed.length ? '<h4>まちがえた語</h4>' + WR.missed.map(function (w) { var E = entry(w); return '<div class="nr"><p class="nes">' + esc(w) + '</p><p class="nja">' + esc(E ? E.ja : '') + '</p></div>'; }).join('') : '') +
      '<button class="btn main wide" id="wAgain">つづけて復習</button><button class="btn sub wide" id="wHome">表紙へもどる</button></div>';
    WR = null;
    show('done');
    $('#wAgain').onclick = startWords;
    $('#wHome').onclick = function () { renderHome(); show('home'); };
  }
  /* 集めた単語の一覧（事件ごと） */
  function wordList() {
    var h = '<h3>📇 集めた単語（' + Object.keys(S.words).length + ' 語）</h3><p class="empty">★ の数は覚えぐあい（正解で1つふえる）。🔍 は調べた語。</p>';
    D.cases.map(function (c) { return c.id; }).concat(['drill', 'exam']).forEach(function (g) {
      var ws = Object.keys(S.words).filter(function (w) { return S.words[w].c === g; }).sort(function (a, b) { return a.localeCompare(b, 'es'); });
      if (!ws.length) return;
      h += '<h4>' + esc(fromName(g)) + '<small>' + ws.length + ' 語</small></h4><div class="wlist">' + ws.map(function (w) {
        var E = entry(w), r = S.words[w];
        return '<div class="wl"><b>' + esc(w) + '</b><span>' + esc(E ? E.ja : '') + '</span><i>' + '★'.repeat(r.box) + (r.look ? ' 🔍' : '') + '</i></div>';
      }).join('') + '</div>';
    });
    modal(h, 'evm');
  }
  $('#hWords').addEventListener('click', startWords);
  $('#wList').addEventListener('click', wordList);
  $('#wQuit').addEventListener('click', function () { WR = null; renderHome(); show('home'); });

  /* ---------- 起動 ---------- */
  renderHome(); show('home');
  /* 通しテスト用 */
  window.QUI.play = function (id, restart) { return playCase(caseOf(id), restart); };
  window.QUI.drill = startDrill;
  window.QUI.exam = startExam;
  window.QUI.drillMs = function (ms) { DRILL_MS = ms; };
})();
