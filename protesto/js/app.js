/* =========================================================
 * ¡PROTESTO! 森のどうぶつ裁判 — スペイン語の比較（西検4級）
 *
 *  エンジンを使わない独立アプリ（manda/ と同じ考え方）。
 *   表紙＝古い絵本。ページをめくって事件をえらぶ（第1話 → 第6話）。
 *   事件＝捜査（現場を調べてミミのノートで比較の形を習う）→ 法廷（尋問・ゆさぶり・証拠のつきつけ・ムジュン）。
 *   法廷では、まちがえると「どんぐり」が減る（0 になったら休廷して、5 つに戻して再開）。
 *   ほかに 📋 証言台ドリル（グラフと証言を見て「本当／異議あり」を 60 秒）・📓 ミミのノート
 *  保存：localStorage 'protesto.v1'（?sandbox なら 'protesto.sandbox'）
 *  台本：protesto/js/data/*.js（書き方は cast.js の先頭）、単語：shared/es-words.js
 * ========================================================= */
(function () {
  'use strict';
  var D = window.PQ, DICT = window.ES_WORDS;
  D.cases.sort(function (a, b) { return a.no - b.no; });

  /* ---------- 小物 ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function norm(w) { return String(w).replace(/[¿?¡!.,—:;]/g, '').toLowerCase(); }
  function plain(es) { return String(es).replace(/[\[\]]/g, ''); }
  function buzz(p) { try { if (navigator.vibrate && !(navigator.userActivation && !navigator.userActivation.hasBeenActive)) navigator.vibrate(p); } catch (e) { /* なし */ } }

  /* ---------- 保存 ---------- */
  var SANDBOX = /[?&]sandbox\b/.test(location.search);
  var KEY = SANDBOX ? 'protesto.sandbox' : 'protesto.v1';
  function fresh() { return { v: 1, lessons: {}, notes: {}, words: {}, drillBest: 0, weak: {}, page: 0, settings: { sound: true, speak: true, ja: false } }; }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) { var f = fresh(); for (var k in s) f[k] = s[k]; return f; } } catch (e) { /* 保存できない環境 */ }
    return fresh();
  }
  var S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* 保存できない環境 */ } }
  window.SfxOn = function () { return S.settings.sound; };
  /* まちがいの記録：S.weak[事件id] = まちがえた回数。🩹 おさらいを終えると消える */
  function weakAdd(id) { if (!id) return; if (!S.weak) S.weak = {}; S.weak[id] = (S.weak[id] || 0) + 1; save(); }
  function weakTop() {
    var best = null;
    D.cases.forEach(function (C) { var n = (S.weak || {})[C.id] || 0; if (n > 0 && (!best || n > best.n)) best = { C: C, n: n }; });
    return best;
  }
  function rec(id) { return S.lessons[id] || (S.lessons[id] = { i: 0, done: false, rank: '', acorn: 5, miss: 0 }); }

  /* ---------- 単語（4級以上はバルーン） ---------- */
  var WORD = new Map();
  DICT.words.forEach(function (e) { [e.w].concat(e.f || []).forEach(function (f) { if (!WORD.has(f.toLowerCase())) WORD.set(f.toLowerCase(), e); }); });
  var CMP = { 'más': 'up', mejor: 'up', mayor: 'up', mejores: 'up', mayores: 'up', menos: 'dn', peor: 'dn', menor: 'dn', peores: 'dn', menores: 'dn',
    tan: 'eq', tanto: 'eq', tanta: 'eq', tantos: 'eq', tantas: 'eq', que: 'ref', como: 'ref', de: 'ref', del: 'ref' };
  /* スペイン語の文：[ ] の中は比べる部分（más＝朱、menos＝藍、tan＝緑、que・como・de＝黄土）
   *  意味のある語（5級〜4級より上）はどれもタップで意味が出る。4級以上は点線で目印。
   *  事件・ドリルの画面で出た語は「単語の復習」に集める（hl：その語に色をつける） */
  var NAMES = new Set((DICT.names || []).map(function (n) { return n.toLowerCase(); }));
  function es(s, hl) {
    var out = '', inCmp = false;
    String(s).split(/(\[|\]|[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)/).forEach(function (t) {
      if (!t) return;
      if (t === '[') { inCmp = true; out += '<span class="cpt">'; return; }
      if (t === ']') { inCmp = false; out += '</span>'; return; }
      if (!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(t)) { out += esc(t); return; }
      var k = t.toLowerCase(), e = NAMES.has(k) ? null : WORD.get(k), cls = [];
      if (inCmp && CMP[k]) cls.push('k-' + CMP[k]);
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
  /* 単語帳に集める（事件とドリルの画面だけ。例文は最初に出会った文。訳のある文に出会ったら、そちらに替える） */
  function collect(e, s) {
    var scr = document.body.dataset.screen;
    if (scr !== 'play' && scr !== 'drill') return;
    if (e.lv === 5) return;   // 5級（ser・estar など基本の語）は集めない。復習は4級以上
    var ex = plain(s).replace(/___/g, '…').trim(), r = S.words[e.w];
    if (!r) S.words[e.w] = { t: Date.now(), ex: ex, c: CASE && scr === 'play' ? CASE.id : 'drill', box: 0, due: 0, n: 0 };
    else if (!JA.has(r.ex) && JA.has(ex)) r.ex = ex;
  }

  /* 例文の訳：台本の「スペイン語 → 日本語」の組をぜんぶ集めておく（セリフ・ノート・証言・通訳。ドリルは作るたびに足す） */
  var JA = new Map();
  function addJa(e, j) {
    if (!e || !j) return;
    var k = plain(e).trim();
    j = String(j).split('\n').filter(function (l) { return !/^（/.test(l); }).join('').replace(/\*\*|__|\(\(|\)\)|`/g, '').trim();
    if (j && !JA.has(k)) JA.set(k, j);
  }
  (function walk(o) {
    if (Array.isArray(o)) { o.forEach(walk); return; }
    if (!o || typeof o !== 'object') return;
    if (o.t === 'say' && o.es) addJa(o.es, o.x);
    if (o.t === 'interp') addJa(o.es, o.o[o.a]);
    if (o.es && o.ja && !o.t) addJa(o.es, o.ja);                       // 証言・ムジュンの行
    (o.rows || []).forEach(function (r) { addJa(r[0], r[1]); });       // ノート
    Object.keys(o).forEach(function (k) { if (o[k] && typeof o[k] === 'object') walk(o[k]); });
  })(D.cases.map(function (C) { return C.steps; }));
  /* 訳のない例文なら、その語が出てくる訳つきの文（同じ事件を先に・短い文）に替える */
  function exampleFor(w, E) {
    var r = S.words[w];
    if (JA.has(r.ex)) return;
    var best = null;
    JA.forEach(function (j, k) {
      if (!(k.toLowerCase().match(/[a-záéíóúüñ]+/g) || []).some(function (t) { return WORD.get(t) === E; })) return;
      if (!best || k.length < best.length) best = k;
    });
    if (best) { r.ex = best; save(); }
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
        try { syn.cancel(); var u = new SpeechSynthesisUtterance(plain(text)); u.voice = voice; u.lang = voice.lang; u.rate = 0.9; syn.speak(u); } catch (e) { /* 読み上げできない */ }
      },
      stop: function () { try { if (syn) syn.cancel(); } catch (e) { /* なし */ } }
    };
  })();
  function autoSay(s) { if (S.settings.speak) Speech.say(s); }
  function sayBtn(s) { return Speech.ok() ? '<button class="say" data-say="' + esc(plain(s)) + '" aria-label="読み上げ">🔊</button>' : ''; }

  /* ---------- 効果音（engine/js/audio.js の Sfx ＋ 木づち） ---------- */
  var Snd = {
    tap: function () { if (window.Sfx) Sfx.tap(); },
    ok: function () { if (window.Sfx) Sfx.correct(2); },
    ng: function () { if (window.Sfx) Sfx.wrong(); buzz([30, 40, 30]); },
    slam: function () { if (window.Sfx) Sfx.crit(); buzz([20, 30, 60]); },
    page: function () { if (window.Sfx) Sfx.whoosh(); },
    gavel: function () {
      if (!window.Sfx || !Sfx.raw) return;
      buzz(25);
      Sfx.raw.play(function (t) {
        [0, 0.28, 0.5].forEach(function (d) { Sfx.raw.tone(170, t + d, 0.12, 'triangle', 0.32, 70); Sfx.raw.noise(t + d, 0.07, 0.22, 900, 300); });
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

  /* 単語のバルーン・読み上げボタン（どこでも） */
  document.addEventListener('click', function (e) {
    var g = e.target.closest('.gl');
    var p = $('#pop');
    if (g) {
      e.stopPropagation();
      p.textContent = g.dataset.gl; p.hidden = false;
      /* 事件・ドリルの中で調べた語は、復習でいちばん先に出す。もう復習した語でも、調べた＝忘れかけ → すぐ復習にもどす */
      var wd = S.words[g.dataset.w], scr = document.body.dataset.screen;
      if (wd && (scr === 'play' || scr === 'drill')) {
        wd.look = true; wd.lt = Date.now();
        if (wd.n > 0 && wd.due > wd.lt) { wd.due = wd.lt; wd.box = Math.max(0, wd.box - 1); }
        save();
      }
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

  /* ---------- 叩きつけ文字 ---------- */
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
  var X = null;         // 実行中の状態 { ev:Set, cast:[], court, acorn, miss, quit }
  var waiting = null;   // ユーザーの操作待ち（やめるときに止める）
  var cur = { solve: null };   // 通しテスト用：いまの操作を正解で進める
  window.PRO = { cur: cur, S: function () { return S; } };

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
  function closeModalSilently() { modalClose = null; $('#modal').hidden = true; }

  /* ----- 場面 ----- */
  function drawStage() {
    var st = $('#stage'), P = D.places[X.place] || { n: '', e: '' };
    st.className = 'stage pl-' + X.place + (X.court ? ' court' : '');
    var html = '<div class="plname"><span>' + esc(P.e) + '</span>' + esc(P.n) + '<small>' + esc(P.es || '') + '</small></div><div class="cast">';
    X.cast.forEach(function (id) {
      var c = who(id), role = id === X.witness ? ' witness' : '';
      html += '<div class="med' + role + (id === X.speaker ? ' talking' : '') + '" data-id="' + id + '"><span class="em">' + c.e + '</span><small>' + esc(c.n) + '</small></div>';
    });
    st.innerHTML = html + '</div>';
  }
  function setSpeaker(id) { X.speaker = id; $$('#stage .med').forEach(function (m) { m.classList.toggle('talking', m.dataset.id === id); }); }
  function hud() {
    var a = $('#pAcorn');
    a.hidden = !X.court;
    var s = '';
    for (var i = 0; i < 5; i++) s += '<i class="' + (i < X.acorn ? 'on' : '') + '">🌰</i>';
    a.innerHTML = s;
  }
  function act() { return $('#act'); }
  function tray(html) { var t = $('#tray'); t.innerHTML = html || ''; return t; }
  function clearAct() { act().innerHTML = ''; tray(''); }
  function scrollAct() { var b = $('#board'), a = act(); if (a.lastElementChild) { var top = a.offsetTop - 8; if (b.scrollTop + b.clientHeight < a.offsetTop + a.offsetHeight || b.scrollTop > top) b.scrollTop = Math.max(0, Math.min(top, a.offsetTop + a.offsetHeight - b.clientHeight)); } }

  /* ----- ミス（法廷だけ）。どんぐりが 0 になったら休廷して 5 つに戻す ----- */
  async function miss() {
    Snd.ng();
    if (!X.court) return;
    X.acorn--; X.miss++;
    var r = rec(CASE.id); r.acorn = X.acorn; r.miss = X.miss; save();
    hud();
    var a = $$('#pAcorn i')[X.acorn]; if (a) { a.classList.add('lost'); }
    if (X.acorn <= 0) {
      await wait(function (done) {
        modal('<div class="recess"><div class="big">🐢</div><h3>休廷</h3><p>どんぐりがなくなりました。<br>カメ裁判長がお茶を一杯飲むあいだに、考えをまとめよう。</p><button class="btn main" id="rcOk">🌰 どんぐり 5 つで再開</button></div>');
        $('#rcOk').onclick = function () { closeModalSilently(); done(); };
        cur.solve = function () { $('#rcOk').click(); };
      });
      X.acorn = 5; rec(CASE.id).acorn = 5; save(); hud();
    }
  }

  /* ----- まちがえたとき：自分の答え（と正解）をならべる ----- */
  /* 法廷はやり直して正解を見つける形なので、ふつうは「あなた」の行だけ。正解も見せるときは right を渡す */
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

  /* ----- ステップ ----- */
  var H = {};
  async function run(steps) { for (var i = 0; i < steps.length; i++) { if (X.quit) throw 'quit'; await H[steps[i].t](steps[i]); } }

  H.scene = async function (st) {
    X.place = st.place; X.cast = (st.cast || []).slice(); X.witness = null; X.speaker = null;
    var wasCourt = X.court;
    X.court = st.place === 'court';
    if (X.court && !wasCourt && !X.resumed) { X.acorn = 5; rec(CASE.id).acorn = 5; save(); }
    X.resumed = false;
    $('#ref').innerHTML = ''; clearAct(); $('#talk').hidden = true;
    drawStage(); hud();
    var P = D.places[st.place] || { n: '', e: '' };
    if (X.court) Snd.gavel(); else Snd.page();
    await wait(function (done) {
      var c = el('div', 'chapter', '<span class="ce">' + P.e + '</span><b>' + esc(P.n) + '</b><small>' + esc(P.es || '') + '</small>');
      $('#stage').appendChild(c);
      var t = setTimeout(go, 1300);
      function go() { clearTimeout(t); c.remove(); done(); }
      c.addEventListener('click', go);
      cur.solve = go;
    });
  };
  H.enter = async function (st) {
    if (X.cast.indexOf(st.who) < 0) X.cast.push(st.who);
    if (X.court) X.witness = st.who;
    drawStage();
    var m = $('#stage .med[data-id="' + st.who + '"]'); if (m) m.classList.add('in');
  };
  /* セリフ：スペイン語があれば大きく、日本語は訳として下に */
  H.say = async function (st) {
    var c = who(st.who), t = $('#talk');
    setSpeaker(st.who);
    t.hidden = false;
    t.className = 'talk' + (st.who === 'nico' ? ' me' : '');
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
    var h = '<div class="note"><div class="nh">📓 ' + esc(n.title) + '</div>';
    (n.rows || []).forEach(function (r) { h += '<div class="nr"><p class="nes">' + es(r[0]) + sayBtn(r[0]) + '</p><p class="nja">' + ja(r[1]) + '</p></div>'; });
    if (n.x) h += '<p class="nx2">' + ja(n.x) + '</p>';
    if (n.why) h += '<details class="why"><summary>🤔 なぜ？</summary><p>' + ja(n.why) + '</p></details>';
    return h + '</div>';
  }
  H.chart = async function (st) { $('#ref').innerHTML = chartHtml(st); $('#board').scrollTop = 0; };
  function chartHtml(c) {
    var max = Math.max.apply(null, c.bars.map(function (b) { return b.v; })) || 1;
    var h = '<div class="chart"><div class="ch">📏 ' + esc(c.title) + '</div><div class="bars">';
    c.bars.forEach(function (b, i) {
      var hi = (c.hi || []).indexOf(i) >= 0 ? ' hi' : '';
      h += '<div class="bar' + hi + '"><span class="bv">' + b.v + '<small>' + esc(c.unit || '') + '</small></span><i style="--h:' + Math.max(0.04, b.v / max).toFixed(3) + '"></i><span class="be">' + b.e + '</span><span class="bn">' + esc(b.n) + '</span></div>';
    });
    return h + '</div></div>';
  }

  /* 選択肢：スペイン語の文は「文（語をタップで調べられる）＋右の端の選ぶボタン」の行、日本語だけなら札のボタン */
  function isEs(o) { return /[a-záéíóúñ]/i.test(o) && !/[぀-ヿ一-鿿]/.test(o); }
  function optsHtml(o) {
    if (o.some(isEs)) return '<div class="orows">' + o.map(function (x, i) {
      return '<div class="orow"><p class="otext">' + (isEs(x) ? es(x) : esc(x)) + '</p><button class="btn opt pk" data-i="' + i + '" aria-label="これをえらぶ">えらぶ</button></div>';
    }).join('') + '</div>';
    var long = o.some(function (x) { return x.length > 10; });
    return '<div class="opts' + (long ? ' col' : '') + '">' + o.map(function (x, i) { return '<button class="btn opt" data-i="' + i + '">' + esc(x) + '</button>'; }).join('') + '</div>';
  }
  /* 正解・まちがいの色は、行があれば行ごと */
  function mark(b, cls) { b.classList.add(cls); var r = b.closest('.orow'); if (r) r.classList.add(cls); }

  /* 選ぶ問い（法廷ではまちがえるとどんぐり −1） */
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
            if (/[a-z]/i.test(st.o[i]) && !/[぀-ヿ一-鿿]/.test(st.o[i])) autoSay(st.o[i]);
            await sleep(450); done();
          } else {
            mark(b, 'wrong'); b.disabled = true;
            if (st.es || st.o.some(isEs)) weakAdd(CASE.id);
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

  /* 証拠品を手に入れる */
  H.get = async function (st) {
    X.ev.add(st.ev);
    var e = CASE.evidence[st.ev];
    $('#talk').hidden = true;
    Snd.ok();
    act().innerHTML = '<div class="got"><span class="gt">📁 証拠品を記録した</span><div class="evc"><span class="em">' + e.e + '</span><div><b>' + esc(e.n) + '</b><p>' + ja(e.d) + '</p></div></div></div>';
    tray('<button class="btn main" id="gOk">記録した ▶</button>');
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

  /* 証拠をえらぶ（法廷記録をつきつけ用に開く） */
  function chooseEvidence(title) {
    return new Promise(function (res) {
      var h = '<h3>📁 ' + esc(title || 'つきつける証拠をえらぶ') + '</h3><div class="evlist">';
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

  /* 尋問：◀▶ で証言を見て、ゆさぶるか、証拠をつきつける */
  H.testimony = async function (st) {
    X.witness = st.who; drawStage(); setSpeaker(st.who);
    $('#talk').hidden = true; $('#ref').innerHTML = '';
    await slam('〜 証言 〜', 'banner');
    var i = 0, wrong = 0, c = who(st.who), goal = st.lines.findIndex(function (l) { return l.ok; }), tried = '';
    function draw() {
      var L = st.lines[i];
      act().innerHTML = '<div class="testi"><div class="th">〜 ' + esc(c.e + ' ' + c.n) + '「' + esc(st.title) + '」 〜</div>' + tried +
        '<div class="tl"><span class="tno">' + (i + 1) + ' / ' + st.lines.length + '</span><p class="tles">' + es(L.es) + sayBtn(L.es) + '</p>' +
        '<p class="tlja' + (S.settings.ja ? ' open' : '') + '" role="button">' + esc(L.ja) + '</p></div></div>';
      $('#act .tlja').onclick = function (e) { e.currentTarget.classList.add('open'); };
      tray('<div class="xrow"><button class="btn nav" id="xPrev" aria-label="前の証言">◀</button><button class="btn press" id="xPress">¡Un momento!<small>ゆさぶる</small></button>' +
        '<button class="btn obj" id="xObj">¡Protesto!<small>つきつける</small></button><button class="btn nav" id="xNext" aria-label="次の証言">▶</button></div>');
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
        await slam('¡Un momento!', 'press');
        tray('');
        await run(L.press && L.press.length ? L.press : [{ t: 'say', who: st.who, es: 'Es todo.', x: 'それだけよ。' }]);
        $('#talk').hidden = true;
        continue;
      }
      var k = window.__e2e ? (L.ok || [])[0] : await chooseEvidence();
      if (!k) continue;
      await slam('¡PROTESTO!');
      tray('');
      if (L.ok && L.ok.indexOf(k) >= 0) { clearAct(); await run(st.after || []); return; }
      wrong++;
      tried = cmpRows('証言 ' + (i + 1) + ' に <b class="wrong">' + evName(k) + '</b> をつきつけた');
      await run([{ t: 'say', who: 'pavon', es: '¡Eso no tiene nada que ver!', x: 'その証拠は、この証言と関係ありませんな！' }]);
      await miss();
      if (wrong >= 2 && st.hint) await run([{ t: 'say', who: 'mimi', x: st.hint }]);
      $('#talk').hidden = true;
    }
  };

  /* 1つの主張に証拠をつきつける */
  H.present = async function (st) {
    $('#talk').hidden = true;
    var wrong = 0, tried = '';
    while (true) {
      act().innerHTML = '<div class="q"><p class="qq">' + ja(st.q) + '</p>' + tried + '</div>';
      tray('<button class="btn obj wide" id="pObj">📁 ¡Protesto!<small>証拠をつきつける</small></button>');
      scrollAct();
      var k = await wait(function (done) {
        $('#pObj').onclick = function () { chooseEvidence().then(function (v) { if (v) done(v); }); };
        cur.solve = function () { done(st.ok[0]); };
      });
      await slam('¡PROTESTO!');
      clearAct();
      if (st.ok.indexOf(k) >= 0) { await run(st.after || []); return; }
      wrong++;
      tried = cmpRows('<b class="wrong">' + evName(k) + '</b> をつきつけた');
      await run([{ t: 'say', who: 'juez', x: 'ふむ…その証拠で…\nなにが言いたいのかね…？' }]);
      await miss();
      if (wrong >= 2 && st.hint) await run([{ t: 'say', who: 'mimi', x: st.hint }]);
    }
  };

  /* ムジュンする 2 つの証言をタップ */
  H.contra = async function (st) {
    if (st.who) { X.witness = st.who; drawStage(); setSpeaker(st.who); }
    $('#talk').hidden = true;
    var c = who(st.who), last = [];
    while (true) {
      var picked = [];
      var ok = await wait(function (done) {
        act().innerHTML = '<div class="testi"><div class="th">〜 ' + esc(c.e + ' ' + c.n) + '「' + esc(st.title || '証言') + '」 〜</div>' +
          (last.length ? cmpRows('<b class="wrong">✕ の2つ</b>はムジュンしていない') : '') + '<p class="guide">ムジュンする <b>2つ</b> の証言をタップ</p>' +
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
      if (ok) { await slam('¡Contradicción!'); clearAct(); await run(st.after || []); return; }
      last = picked.slice();
      await sleep(250);
      await miss();
      if (st.hint) await run([{ t: 'say', who: 'mimi', x: st.hint }]);
      $('#talk').hidden = true;
    }
  };

  /* 流れていく主張を、ムジュンの行で止める */
  H.stop = async function (st) {
    if (st.who) setSpeaker(st.who);
    $('#talk').hidden = true;
    var c = who(st.who), tried = '';
    while (true) {
      /* 1行の長さに合わせて、読み切れる時間だけ出す。⏸ で止めて読める。◀ ▶ で行を戻す・進める。語をタップして調べている間も止まる */
      var i = 0, timer = null, paused = false;
      var at = await wait(function (done) {
        act().innerHTML = '<div class="testi roll"><div class="th">〜 ' + esc(c.e + ' ' + c.n) + '「' + esc(st.title || '主張') + '」 〜</div>' + tried + '<div class="tl"><span class="tno"></span><p class="tles"></p><p class="tlja"></p></div><div class="rbar"><i></i></div></div>';
        tray('<p class="hint2">ムジュンの行が出たら止めよう（⏸ で止めて読めるよ）</p><div class="rctl"><button class="btn sub" id="sPrev" aria-label="前の行">◀</button><button class="btn sub" id="sPause">⏸ 止めて読む</button><button class="btn sub" id="sNext" aria-label="次の行">▶</button></div><button class="btn press wide" id="sStop">¡Un momento!<small>この行がおかしい！</small></button>');
        function dur(L) { return Math.max(7000, 2500 + (L.es.length + L.ja.length) * 110); }
        function arm() {
          clearTimeout(timer);
          var r = $('#act .rbar i');
          r.style.animation = 'none'; void r.offsetWidth;
          if (paused) { r.style.width = '0'; return; }
          r.style.width = ''; r.style.animation = 'rbar ' + dur(st.lines[i]) + 'ms linear';
          timer = setTimeout(function () { go(1, true); }, dur(st.lines[i]));
        }
        function show(say) {
          var L = st.lines[i];
          $('#act .tno').textContent = (i + 1) + ' / ' + st.lines.length;
          $('#act .tles').innerHTML = es(L.es);
          $('#act .tlja').textContent = L.ja;
          $('#act .tlja').className = 'tlja open';
          if (say) autoSay(L.es);
          arm();
        }
        function go(d, say) { i = (i + d + st.lines.length) % st.lines.length; show(say); }
        function setPause(p) {
          paused = p;
          $('#sPause').innerHTML = p ? '▶ 流す' : '⏸ 止めて読む';
          arm();
        }
        show(true);
        $('#sPrev').onclick = function () { go(-1, false); };
        $('#sNext').onclick = function () { go(1, false); };
        $('#sPause').onclick = function () { setPause(!paused); };
        $('#act .tles').addEventListener('click', function (e) { if (e.target.closest('.gl') && !paused) setPause(true); });
        $('#sStop').onclick = function () { clearTimeout(timer); done(i); };
        cur.solve = function () { clearTimeout(timer); done(st.a); };
        scrollAct();
      });
      clearTimeout(timer);
      if (at === st.a) { await slam('¡Un momento!', 'press'); clearAct(); await run(st.after || []); return; }
      tried = cmpRows('<b class="wrong">' + (at + 1) + '行め</b>「' + es(st.lines[at].es) + '」で止めた');
      clearAct();
      await run([{ t: 'say', who: st.who || 'pavon', x: 'おや？ その行に…\nおかしなところはありませんが？' }]);
      await miss();
      if (st.hint) await run([{ t: 'say', who: 'mimi', x: st.hint }]);
      $('#talk').hidden = true;
    }
  };

  /* 通訳ロロの訳がちがう → 正しい訳をえらぶ */
  H.interp = async function (st) {
    setSpeaker('loro');
    $('#talk').hidden = true;
    act().innerHTML = '<div class="interp"><p class="ih">🦜 通訳ロロの訳を、たしかめよう</p><p class="qes">' + es(st.es) + sayBtn(st.es) + '</p><p class="iwrong">🦜「' + esc(st.ja) + '」</p><p class="guide">正しい訳は？</p><p class="ng" hidden></p></div>';
    tray('<div class="opts col">' + st.o.map(function (o, i) { return '<button class="btn opt" data-i="' + i + '">' + esc(o) + '</button>'; }).join('') + '</div>');
    autoSay(st.es);
    scrollAct();
    await wait(function (done) {
      $$('#tray .opt').forEach(function (b) {
        b.onclick = async function () {
          var i = +b.dataset.i;
          if (i === st.a) { b.classList.add('right'); $$('#tray .opt').forEach(function (x) { x.disabled = true; }); await slam('¡Un momento!', 'press'); done(); }
          else { b.classList.add('wrong'); b.disabled = true; weakAdd(CASE.id); if (st.ng) { var n = $('#act .ng'); n.hidden = false; n.innerHTML = '💡 ' + ja(st.ng); } await miss(); }
        };
      });
      cur.solve = function () { $$('#tray .opt')[st.a].click(); };
    });
    clearAct();
    if (st.after) await run(st.after);
  };

  /* 順に並べる（タップした順） */
  H.order = async function (st) {
    $('#talk').hidden = true;
    var tried = '';
    while (true) {
      var seq = [];
      var ok = await wait(function (done) {
        act().innerHTML = '<div class="q"><p class="qq">' + ja(st.q) + '</p>' + tried + '<div class="seq"></div></div>';
        tray('<div class="opts">' + st.items.map(function (it) { return '<button class="btn opt it" data-id="' + it.id + '"><span class="em">' + it.e + '</span>' + esc(it.n) + '</button>'; }).join('') + '</div>');
        function paint() { $('#act .seq').innerHTML = st.items.map(function (_, k) { var id = seq[k], it = st.items.filter(function (x) { return x.id === id; })[0]; return '<span class="slot">' + (k + 1) + ' ' + (it ? it.e + ' ' + esc(it.n) : '') + '</span>'; }).join(''); }
        paint();
        $$('#tray .it').forEach(function (b) {
          b.onclick = function () {
            Snd.tap(); seq.push(b.dataset.id); b.disabled = true; paint();
            if (seq.length === st.items.length) done(seq.join() === st.a.join());
          };
        });
        cur.solve = function () { done(true); };
        scrollAct();
      });
      if (ok) { Snd.ok(); await sleep(400); clearAct(); if (st.r) await run(st.r); return; }
      tried = cmpRows(seq.map(function (id, k) { var it = st.items.filter(function (x) { return x.id === id; })[0]; var t = it.e + ' ' + esc(it.n); return id === st.a[k] ? t : '<b class="wrong">' + t + '</b>'; }).join(' → '));
      await miss();
      if (st.ng) await run([{ t: 'say', who: 'mimi', x: st.ng }]);
      $('#talk').hidden = true;
    }
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
      weakAdd(CASE.id);
      await sleep(350);
      await miss();
      /* ng＝まちがえたときのヒント（ミミが言う。組み立ての画面は、そのあとにもう一度出る） */
      if (st.ng) { await run([{ t: 'say', who: 'mimi', x: st.ng }]); $('#talk').hidden = true; }
    }
  };
  H.slam =function (st) { return slam(st.txt); };

  /* 判決 */
  H.verdict = async function (st) {
    $('#talk').hidden = true; clearAct();
    Snd.gavel();
    await sleep(500);
    await wait(function (done) {
      var v = el('div', 'verdict', '<div class="vin"><small>判決</small><b>' + esc(st.txt) + '</b><span>' + esc(st.es) + '</span></div>');
      document.body.appendChild(v);
      if (window.Sfx) Sfx.levelUp();
      buzz([30, 60, 30, 60, 120]);
      function go() { v.remove(); done(); }
      setTimeout(function () { v.addEventListener('click', go); }, 900);
      cur.solve = go;
    });
  };

  /* 証拠・場面を、途中から再開するときに組み立て直す */
  function replay(steps, upto) {
    function walk(arr) {
      arr.forEach(function (s) {
        if (s.t === 'get') X.ev.add(s.ev);
        if (s.t === 'scene') { X.place = s.place; X.cast = (s.cast || []).slice(); X.court = s.place === 'court'; X.witness = null; }
        if (s.t === 'enter') { if (X.cast.indexOf(s.who) < 0) X.cast.push(s.who); if (X.court) X.witness = s.who; }
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
    if (restart || r.done) { r.i = 0; r.acorn = 5; r.miss = 0; }
    X = { ev: new Set(), cast: [], place: 'office', court: false, acorn: r.acorn || 5, miss: r.miss || 0, quit: false, resumed: false };
    $('#pTitle').textContent = '第' + C.no + '話 ' + C.title;
    $('#ref').innerHTML = ''; clearAct(); $('#talk').hidden = true;
    show('play');
    var from = r.i || 0;
    /* 途中から：直前の scene まで戻して、その場面から始める */
    var k = from; while (k > 0 && C.steps[k].t !== 'scene') k--;
    if (k > 0) { replay(C.steps, k); X.resumed = X.court || C.steps[k].place === 'court'; from = k; }
    if (from > 0 && C.steps[from].place === 'court' && r.acorn) X.acorn = r.acorn;
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
    var next = D.cases[D.cases.indexOf(C) + 1], wk = (S.weak || {})[C.id] > 0;
    var d = $('#done');
    d.innerHTML = '<div class="closed"><p class="cno">第' + C.no + '話</p><h2>' + esc(C.title) + '</h2><p class="ces">' + esc(C.es) + '</p>' +
      '<div class="stamp r' + rank + '"><small>評価</small><b>' + rank + '</b></div>' +
      '<p class="cmiss">' + (X.miss === 0 ? 'ノーミス！ どんぐりは 1 つも減らなかった。' : 'ミス ' + X.miss + ' 回') + '</p>' +
      '<p class="cgr">この話で習った形：<b>' + esc(C.grammar) + '</b></p>' +
      (wk ? '<button class="btn main wide" id="dFix">🩹 この話のおさらい</button>' : '') +
      (next ? '<button class="btn ' + (wk ? 'sub' : 'main') + ' wide" id="dNext">📖 第' + next.no + '話へ</button>' : '<p class="fin">〜 おしまい 〜<br>全6話クリア！ 証言台ドリルで腕をみがこう。</p>') +
      '<button class="btn sub wide" id="dHome">表紙へもどる</button></div>';
    show('done');
    if (wk) $('#dFix').onclick = function () { startFix(C.id); };
    if (next) $('#dNext').onclick = function () { S.page = D.cases.indexOf(next); save(); playCase(next); };
    $('#dHome').onclick = function () { renderHome(); show('home'); };
  }

  /* ---------- 法廷記録（証拠品・人物・ノート） ---------- */
  function openRecord() {
    if (!CASE) return;
    var h = '<h3>📁 法廷記録</h3><div class="tabs"><button class="tab on" data-t="ev">証拠品</button><button class="tab" data-t="ppl">人物</button><button class="tab" data-t="nt">ノート</button></div><div id="recBody"></div>';
    var body = modal(h, 'evm');
    function paint(t) {
      $$('#mbody .tab').forEach(function (b) { b.classList.toggle('on', b.dataset.t === t); });
      var o = '';
      if (t === 'ev') {
        Object.keys(CASE.evidence).forEach(function (k) { if (!X.ev.has(k)) return; var e = CASE.evidence[k]; o += '<div class="evc"><span class="em">' + e.e + '</span><div><b>' + esc(e.n) + '</b><p>' + ja(e.d) + '</p></div></div>'; });
        if (!o) o = '<p class="empty">まだ証拠品はありません。</p>';
      } else if (t === 'ppl') {
        ['nico', 'mimi', 'juez', 'pavon', 'loro'].concat(Object.keys(CASE.cast)).forEach(function (id) { var c = who(id); o += '<div class="evc"><span class="em">' + c.e + '</span><div><b>' + esc(c.n) + ' <i class="esi">' + esc(c.es || '') + '</i></b><p>' + esc(c.role || '') + '</p></div></div>'; });
      } else {
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

  /* ---------- ミミのノート（ぜんぶの事件） ---------- */
  function openNotes() {
    var h = '<h3>📓 ミミのノート</h3>';
    D.cases.forEach(function (C) {
      var n = Object.keys(S.notes).filter(function (k) { return S.notes[k].c === C.id; });
      if (!n.length) return;
      h += '<h4>第' + C.no + '話 ' + esc(C.title) + '<small>' + esc(C.grammar) + '</small></h4>';
      n.forEach(function (k) { h += noteHtml(S.notes[k]); });
    });
    if (h === '<h3>📓 ミミのノート</h3>') h += '<p class="empty">事件を調べると、ミミがノートに書きためていきます。</p>';
    modal(h, 'evm');
  }

  /* =========================================================
   * 表紙（絵本）
   * ========================================================= */
  function caseOpen(i) { return i === 0 || SANDBOX || !!(S.lessons[D.cases[i - 1].id] || {}).done; }
  function renderHome() {
    var i = Math.min(S.page || 0, D.cases.length - 1), C = D.cases[i], r = S.lessons[C.id] || {}, open = caseOpen(i);
    var b = $('#book');
    b.innerHTML = '<button class="turn prev" id="bPrev" aria-label="前の話"' + (i === 0 ? ' disabled' : '') + '>◀</button>' +
      '<div class="page' + (open ? '' : ' locked') + '">' +
      '<p class="pno">― 第' + C.no + '話 ―</p><div class="vig"><span>' + (open ? C.icon : '🔒') + '</span></div>' +
      '<h2>' + esc(C.title) + '</h2><p class="pes">' + esc(C.es) + '</p>' +
      (open ? '<p class="pcover">' + esc(C.cover || '') + '</p>' : '<p class="pcover">第' + (C.no - 1) + '話を解決すると読めます。</p>') +
      '<p class="pgr">' + esc(C.grammar) + '</p>' +
      (r.done ? '<div class="stamp small r' + r.rank + '"><b>' + r.rank + '</b></div>' : '') +
      (open ? (r.i > 0 && !r.done ? '<button class="btn main" id="bGo">📖 つづきから</button><button class="link" id="bRe">はじめから読む</button>' : '<button class="btn main" id="bGo">📖 ' + (r.done ? 'もう一度読む' : 'ひらく') + '</button>') : '') +
      '</div><button class="turn next" id="bNext" aria-label="次の話"' + (i === D.cases.length - 1 ? ' disabled' : '') + '>▶</button>' +
      '<div class="dots">' + D.cases.map(function (c, k) { var rr = S.lessons[c.id] || {}; return '<i class="' + (k === i ? 'on ' : '') + (rr.done ? 'done' : '') + '"></i>'; }).join('') + '</div>';
    $('#bPrev').onclick = function () { S.page = i - 1; save(); Snd.page(); turn(-1); };
    $('#bNext').onclick = function () { S.page = i + 1; save(); Snd.page(); turn(1); };
    if ($('#bGo')) $('#bGo').onclick = function () { unlockAudio(); playCase(C); };
    if ($('#bRe')) $('#bRe').onclick = function () { unlockAudio(); playCase(C, true); };
    var wt = weakTop(), hf = $('#hFix');
    hf.hidden = !wt;
    if (wt) {
      hf.innerHTML = '<span class="fix-i">🩹</span><span class="fix-t"><b>おさらい　第' + wt.C.no + '話の形</b><span class="fix-g">' + esc(wt.C.grammar) + '</span><small>まちがい ' + wt.n + ' 回</small></span>';
      hf.onclick = function () { startFix(wt.C.id); };
    }
    $('#hDrillBest').textContent = S.drillBest ? '最高 ' + S.drillBest : '60秒';
    $('#hNotesN').textContent = Object.keys(S.notes).length + ' ページ';
    var wq = wordQueue();
    $('#hWordsN').textContent = wordKeys().length ? (wq.due + wq.fresh ? '今日 ' + Math.min(10, wq.due + wq.fresh) + ' 語' : '今日はおわり') : 'まだ 0 語';
    $('#tgSound').checked = S.settings.sound; $('#tgSpeak').checked = S.settings.speak; $('#tgJa').checked = S.settings.ja;
  }
  function turn(d) { renderHome(); var p = $('#book .page'); p.classList.add(d > 0 ? 'fromR' : 'fromL'); }
  function unlockAudio() { if (window.Sfx) Sfx.unlock(); }

  $('#hNotes').addEventListener('click', openNotes);
  $('#tgSound').addEventListener('change', function (e) { S.settings.sound = e.target.checked; save(); if (e.target.checked) { unlockAudio(); Snd.gavel(); } });
  $('#tgSpeak').addEventListener('change', function (e) { S.settings.speak = e.target.checked; save(); if (e.target.checked) Speech.say('¡Protesto!'); });
  $('#tgJa').addEventListener('change', function (e) { S.settings.ja = e.target.checked; save(); });
  $('#hReset').addEventListener('click', function () {
    var b = modal('<h3>記録をリセット</h3><p>事件の進み具合・ノート・ドリルの最高記録を消します。</p><button class="btn obj wide" id="rsOk">消す</button>');
    $('#rsOk', b).onclick = function () { S = fresh(); save(); closeModalSilently(); renderHome(); };
  });

  /* =========================================================
   * 証言台ドリル（60秒）：グラフと証言を見て「本当」か「異議あり」
   * ========================================================= */
  var DR = null;
  function drillForms() {
    var f = [];
    D.cases.forEach(function (C) { if ((S.lessons[C.id] || {}).done || SANDBOX) f.push(D.drill.forms[C.id]); });
    return f.length ? f : ['mas'];
  }
  function startDrill() {
    unlockAudio();
    DR = { score: 0, combo: 0, t0: Date.now(), left: 60000, paused: false, miss: [], forms: drillForms(), timer: null, q: null };
    show('drill');
    nextDrill();
    var last = Date.now();
    DR.timer = setInterval(function () {
      var now = Date.now();
      if (!DR.paused) DR.left -= now - last;
      last = now;
      $('#dTime').style.width = Math.max(0, DR.left / 600) + '%';
      if (DR.left <= 0) lastDrill();
    }, 100);
  }
  /* 時間切れ：いま出ている証言は最後まで答えられる（答えたら結果へ）。勝手に終わらせない */
  function lastDrill() {
    if (DR.over) return;
    DR.over = true;
    clearInterval(DR.timer);
    $('#dBoard').insertAdjacentHTML('afterbegin', '<p class="dlast">⏰ タイムアップ！ この証言が最後です。時間は気にせず、ゆっくり答えてね</p>');
    $('#dBoard').scrollTop = 0;
  }
  function nextDrill() {
    var fill = Math.random() < 0.4, q = DR.q = fill ? D.drill.fill(DR.forms[Math.floor(Math.random() * DR.forms.length)]) : D.drill.make(DR.forms);
    $('#dScore').innerHTML = '⚖️ ' + DR.score + (DR.combo >= 3 ? ' <i class="cb">' + DR.combo + '連続</i>' : '');
    if (fill) {
      addJa(q.full, q.ja);
      $('#dBoard').innerHTML = fillBoardHtml(q);
      $('#dTray').innerHTML = fillOptsHtml(q);
      $$('#dTray .opt').forEach(function (b) { b.onclick = function () { fillAnswer(+b.dataset.i); }; });
      cur.solve = function () { var b = $$('#dTray .opt')[q.a]; if (b && !b.disabled) b.click(); };
      return;
    }
    cur.solve = null;
    addJa(q.es, q.ja); addJa(q.fix, q.fixJa);
    $('#dBoard').innerHTML = chartHtml(q.chart) + '<div class="testi"><div class="th">〜 証言 〜</div><div class="tl"><p class="tles">' + es(q.es) + sayBtn(q.es) + '</p></div></div>';
    $('#dTray').innerHTML = '<div class="xrow"><button class="btn true" id="dT">¡Es verdad!<small>本当</small></button><button class="btn obj" id="dF">¡Protesto!<small>ウソだ</small></button></div>';
    autoSay(q.es);
    $('#dT').onclick = function () { answer(true); };
    $('#dF').onclick = function () { answer(false); };
  }
  /* ----- 穴埋め（証言台ドリルと🩹 おさらいで共通） ----- */
  function fillBoardHtml(q) {
    return chartHtml(q.chart) + '<div class="testi dfill-q"><div class="th">〜 穴うめ ・ 入る語は？ 〜</div><div class="tl"><p class="tles">' + es(q.es) + '</p></div></div>';
  }
  function fillOptsHtml(q) {
    return '<div class="dfill-opts">' + q.o.map(function (x, i) { return '<button class="btn opt" data-i="' + i + '">' + esc(x) + '</button>'; }).join('') + '</div>';
  }
  /* まちがえたとき：✕ あなたの文／○ 正解の文（ちがう語に色）＋訳＋なぜ */
  function fillCmp(q, you) {
    var d = wordDiff(plain(q.es.replace('___', q.o[you])), plain(q.full));
    return cmpRows('<span class="es">' + d.a + '</span>', '<span class="es">' + d.b + '</span>') + '<p class="nja">' + esc(q.ja) + '</p><p class="dfill-why">💡 ' + esc(q.why) + '</p>';
  }
  /* 正解の文を、空所に入れて見せる */
  function fillShowFull(q) { var t = $$('.dfill-q .tles')[0]; if (t) t.innerHTML = es(q.full); }
  function caseOfForm(f) { var r = null; Object.keys(D.drill.forms).forEach(function (id) { if (D.drill.forms[id] === f) r = id; }); return r; }
  async function fillAnswer(i) {
    var q = DR.q;
    $$('#dTray .opt').forEach(function (b) { b.disabled = true; });
    var b = $$('#dTray .opt')[i];
    if (i === q.a) {
      b.classList.add('right');
      DR.score += 10 + Math.min(DR.combo, 10) * 2; DR.combo++;
      Snd.ok(); fillShowFull(q);
      await sleep(700);
      if (DR) { if (DR.over) endDrill(); else nextDrill(); }
      return;
    }
    b.classList.add('wrong');
    DR.combo = 0; DR.paused = true; q.you = i; DR.miss.push(q);
    weakAdd(caseOfForm(q.form));
    Snd.ng();
    $('#dBoard').insertAdjacentHTML('beforeend', '<div class="dfix">' + fillCmp(q, i) + '</div>');
    $('#dBoard').scrollTop = 1e4;
    $('#dTray').innerHTML = '<button class="btn main wide" id="dN">' + (DR.over ? '結果を見る ▶' : 'つぎの証言 ▶') + '</button>';
    cur.solve = function () { $('#dN').click(); };
    $('#dN').onclick = function () { if (DR.over) { endDrill(); return; } DR.paused = false; nextDrill(); };
  }
  /* ドリルでまちがえたとき：自分の判断と正解をならべる（ウソの証言は、グラフどおりの文とちがう語に色） */
  function drillCmp(q) {
    if (q.kind === 'fill') return fillCmp(q, q.you);
    if (q.ok) return cmpRows('「<b class="wrong">ウソ</b>」と判断', '「<b class="fix">本当</b>」。グラフどおりの証言');
    var d = wordDiff(plain(q.es), plain(q.fix));
    return cmpRows('「<b class="wrong">本当</b>」と判断：<span class="es">' + d.a + '</span>', '「<b class="fix">ウソ</b>」。グラフどおりなら：<span class="es">' + d.b + '</span>');
  }
  async function answer(v) {
    var q = DR.q;
    $$('#dTray .btn').forEach(function (b) { b.disabled = true; });
    if (v === q.ok) {
      DR.score += 10 + Math.min(DR.combo, 10) * 2; DR.combo++;
      Snd.ok();
      if (!v) await slam('¡PROTESTO!');
      else { $('#dBoard .tl').classList.add('good'); await sleep(350); }
      if (DR) { if (DR.over) endDrill(); else nextDrill(); }
      return;
    }
    DR.combo = 0; DR.paused = true; DR.miss.push(q);
    weakAdd(caseOfForm(q.form));
    Snd.ng();
    $('#dBoard').insertAdjacentHTML('beforeend', '<div class="dfix">' + drillCmp(q) + (q.ok ? '<p class="nja">' + esc(q.ja) + '</p>' : '<p class="nja">' + esc(q.fixJa) + '</p>') + '</div>');
    $('#dBoard').scrollTop = 1e4;
    $('#dTray').innerHTML = '<button class="btn main wide" id="dN">' + (DR.over ? '結果を見る ▶' : 'つぎの証言 ▶') + '</button>';
    $('#dN').onclick = function () { if (DR.over) { endDrill(); return; } DR.paused = false; nextDrill(); };
  }
  function endDrill() {
    if (!DR) return;
    clearInterval(DR.timer);
    var best = DR.score > S.drillBest; if (best) { S.drillBest = DR.score; save(); }
    var d = $('#done');
    d.innerHTML = '<div class="closed"><p class="cno">証言台ドリル</p><h2>' + DR.score + ' 点</h2>' + (best ? '<p class="fin">✨ 最高記録！</p>' : '<p class="ces">最高 ' + S.drillBest + ' 点</p>') +
      (DR.miss.length ? '<h4>見のがした証言</h4>' + DR.miss.map(function (q) { return '<div class="nr">' + drillCmp(q) + '</div>'; }).join('') : '') +
      '<button class="btn main wide" id="drAgain">もう一度</button><button class="btn sub wide" id="drHome">表紙へもどる</button></div>';
    DR = null; cur.solve = null;
    show('done');
    $('#drAgain').onclick = startDrill;
    $('#drHome').onclick = function () { renderHome(); show('home'); };
  }
  $('#hDrill').addEventListener('click', startDrill);

  /* =========================================================
   * 単語の復習：事件・ドリルで出会った語を、意味の4択で（間隔反復）
   *  S.words[見出し語] = { t 出会った時, ex 最初の例文, c 事件, box 0〜5, due 次の日時, n 復習した回数, look 調べた }
   *  正解で box が1つ上がり、次は 1・3・7・14・30 日後。まちがえたら box 0 にもどり、その回の最後にもう一度
   * ========================================================= */
  var DAY = 864e5, GAP = [0, 1, 3, 7, 14, 30];
  function entry(w) { return DICT.words.filter(function (e) { return e.w === w; })[0]; }
  /* 復習するのは4級以上の語だけ（前に集めた5級の語も外す） */
  function wordKeys() { return Object.keys(S.words).filter(function (w) { var E = entry(w); return E && E.lv !== 5; }); }
  /* 出す順：① レッスン中に調べた語（新しく調べた順）② 期限が来た語 ③ まだ復習していない語 */
  function wordQueue() {
    var now = Date.now(), all = wordKeys(), W = S.words;
    function ready(w) { return !W[w].n || W[w].due <= now; }
    var looked = all.filter(function (w) { return W[w].look && ready(w) && (!W[w].n || (W[w].lt || 0) >= (W[w].rt || 0)); })
      .sort(function (a, b) { return (W[b].lt || 0) - (W[a].lt || 0); });
    var rest = all.filter(function (w) { return looked.indexOf(w) < 0; });
    var due = rest.filter(function (w) { return W[w].n > 0 && W[w].due <= now; }).sort(function (a, b) { return W[a].due - W[b].due; });
    var fresh = rest.filter(function (w) { return !W[w].n; }).sort(function (a, b) { return W[a].t - W[b].t; });
    return { list: looked.concat(due, fresh).slice(0, 10), due: looked.length + due.length, fresh: fresh.length };
  }
  var WR = null;
  function startWords() {
    var q = wordQueue();
    if (!wordKeys().length) { modal('<h3>🗂 単語の復習</h3><p>事件を読み進めたり、証言台ドリルをしたりすると、出てきた単語がここに集まります。<br>文の中の単語は、タップすると意味が見られます。</p>'); return; }
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
    var pool = DICT.words.filter(function (e) { return e !== E && (e.lv === 3 || e.lv === 4) && e.pos !== 'bad' && e.ja !== E.ja; });
    var same = pool.filter(function (e) { return e.pos === E.pos; });
    var others = shuffle(same.length >= 3 ? same : pool).slice(0, 3);
    var opts = shuffle([E].concat(others));
    exampleFor(w, E);
    var c = D.cases.filter(function (x) { return x.id === rec0.c; })[0];
    $('#wBoard').innerHTML = '<div class="wcard"><p class="wfrom">' + (c ? '第' + c.no + '話 ' + esc(c.title) : '証言台ドリル') + 'で出会った単語' + (rec0.look ? ' ・ 🔍 調べた' : '') + '</p>' +
      '<p class="ww">' + esc(E.w) + sayBtn(E.w) + '</p>' +
      '<p class="wex">' + es(rec0.ex, E) + sayBtn(rec0.ex) + '</p><p class="wja" hidden></p></div><p class="guide">意味は？</p><div class="wfb" hidden></div>';
    $('#wTray').innerHTML = '<div class="opts col">' + opts.map(function (e, i) { return '<button class="btn opt" data-i="' + i + '">' + esc(e.ja) + '</button>'; }).join('') + '</div>';
    autoSay(E.w);
    $$('#wTray .opt').forEach(function (b) {
      b.onclick = function () {
        var right = opts[+b.dataset.i] === E;
        $$('#wTray .opt').forEach(function (x) { x.disabled = true; if (opts[+x.dataset.i] === E) x.classList.add('right'); });
        var r = S.words[w];
        r.rt = Date.now();
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
        var tr = JA.get(r.ex);   // 答えたあとで、例文全体の意味も見せる
        if (tr) { var wj = $('#wBoard .wja'); wj.hidden = false; wj.textContent = '文の意味：' + tr; }
        $('#wBoard .guide').hidden = true;
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
    var d = $('#done'), n = WR.q.length - WR.missed.length;
    d.innerHTML = '<div class="closed"><p class="cno">単語の復習</p><h2>' + n + ' / ' + (WR.q.length - WR.missed.length + WR.missed.length) + ' 語</h2>' +
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
    var h = '<h3>📇 集めた単語（' + wordKeys().length + ' 語）</h3><p class="empty">★ の数は覚えぐあい（正解で1つふえる）。🔍 は調べた語。</p>';
    D.cases.map(function (c) { return { id: c.id, t: '第' + c.no + '話 ' + c.title }; }).concat([{ id: 'drill', t: '証言台ドリル' }]).forEach(function (g) {
      var ws = wordKeys().filter(function (w) { return S.words[w].c === g.id; }).sort(function (a, b) { return a.localeCompare(b, 'es'); });
      if (!ws.length) return;
      h += '<h4>' + esc(g.t) + '<small>' + ws.length + ' 語</small></h4><div class="wlist">' + ws.map(function (w) {
        var E = entry(w), r = S.words[w];
        return '<div class="wl"><b>' + esc(w) + '</b><span>' + esc(E ? E.ja : '') + '</span><i>' + '★'.repeat(r.box) + (r.look ? ' 🔍' : '') + '</i></div>';
      }).join('') + '</div>';
    });
    modal(h, 'evm');
  }
  $('#hWords').addEventListener('click', startWords);
  $('#wList').addEventListener('click', wordList);
  $('#wQuit').addEventListener('click', function () { WR = null; renderHome(); show('home'); });
  $('#dQuit').addEventListener('click', function () { if (DR) { clearInterval(DR.timer); DR = null; } cur.solve = null; renderHome(); show('home'); });

  /* =========================================================
   * 🩹 おさらい：まちがえた話のノートを見直して、穴埋め3問でリベンジ
   *  S.weak[事件id] = まちがえた回数（事件の中の問い・ドリルで +1）。おさらいを終えると消える
   * ========================================================= */
  var FX = null;
  /* 台本の steps をたどって、ノートとコツ（note・tip）をぜんぶ集める */
  function caseNotes(C) {
    var out = [];
    (function walk(o) {
      if (Array.isArray(o)) { o.forEach(walk); return; }
      if (!o || typeof o !== 'object') return;
      if (o.t === 'note' || o.t === 'tip') out.push({ title: o.title, rows: o.rows || [], x: o.x || '', why: o.why || '' });
      Object.keys(o).forEach(function (k) { if (o[k] && typeof o[k] === 'object') walk(o[k]); });
    })(C.steps);
    return out;
  }
  function startFix(id) {
    var C = D.cases.filter(function (c) { return c.id === id; })[0];
    if (!C) return;
    unlockAudio();
    FX = { C: C, form: D.drill.forms[id], ok: 0, q: null };
    $('#fTitle').textContent = '🩹 おさらい 第' + C.no + '話';
    $('#fProg').textContent = '';
    show('fix');
    var h = '<p class="guide fix-lead">第' + C.no + '話の形：<b>' + esc(C.grammar) + '</b><br>まず、ノートを見直そう</p>';
    caseNotes(C).forEach(function (n) { h += noteHtml(n); });
    $('#fBoard').innerHTML = h; $('#fBoard').scrollTop = 0;
    $('#fTray').innerHTML = '<button class="btn main wide" id="fGo">⚔ 3問でリベンジ</button>';
    $('#fGo').onclick = nextFix;
    cur.solve = nextFix;
  }
  function nextFix() {
    if (!FX) return;
    var q = FX.q = D.drill.fill(FX.form);
    addJa(q.full, q.ja);
    $('#fProg').innerHTML = '<span class="fix-dots">' + [0, 1, 2].map(function (i) { return i < FX.ok ? '●' : '○'; }).join('') + '</span>';
    $('#fBoard').innerHTML = fillBoardHtml(q); $('#fBoard').scrollTop = 0;
    $('#fTray').innerHTML = fillOptsHtml(q);
    $$('#fTray .opt').forEach(function (b) { b.onclick = function () { fixAnswer(+b.dataset.i); }; });
    cur.solve = function () { var b = $$('#fTray .opt')[q.a]; if (b && !b.disabled) b.click(); };
  }
  async function fixAnswer(i) {
    var q = FX.q, F = FX;
    $$('#fTray .opt').forEach(function (b) { b.disabled = true; });
    var b = $$('#fTray .opt')[i];
    cur.solve = null;
    if (i === q.a) {
      b.classList.add('right'); Snd.ok(); fillShowFull(q);
      F.ok++;
      $('#fProg').innerHTML = '<span class="fix-dots">' + [0, 1, 2].map(function (k) { return k < F.ok ? '●' : '○'; }).join('') + '</span>';
      await sleep(700);
      if (FX !== F) return;
      if (F.ok >= 3) finishFix(); else nextFix();
      return;
    }
    b.classList.add('wrong'); Snd.ng();
    $('#fBoard').insertAdjacentHTML('beforeend', '<div class="dfix">' + fillCmp(q, i) + '</div>');
    $('#fBoard').scrollTop = 1e4;
    $('#fTray').innerHTML = '<button class="btn main wide" id="fN">もう1問 ▶</button>';
    $('#fN').onclick = nextFix;
    cur.solve = nextFix;
  }
  function finishFix() {
    var C = FX.C;
    FX = null; cur.solve = null;
    delete S.weak[C.id]; save();
    var nx = weakTop();
    $('#done').innerHTML = '<div class="closed"><p class="cno">🩹 おさらい完了</p><h2>第' + C.no + '話の形</h2><p class="cgr"><b>' + esc(C.grammar) + '</b></p>' +
      (nx ? '<button class="btn main wide" id="fxNext">🩹 つぎのおさらい　第' + nx.C.no + '話</button><button class="btn sub wide" id="fxHome">表紙へもどる</button>'
        : '<button class="btn main wide" id="fxHome">表紙へもどる</button>') + '</div>';
    show('done');
    if (nx) $('#fxNext').onclick = function () { startFix(nx.C.id); };
    $('#fxHome').onclick = function () { renderHome(); show('home'); };
  }
  $('#fQuit').addEventListener('click', function () { FX = null; cur.solve = null; renderHome(); show('home'); });

  /* ---------- 起動 ---------- */
  renderHome(); show('home');
  /* 通しテスト用 */
  window.PRO.play = function (id, restart) { var C = D.cases.filter(function (c) { return c.id === id; })[0]; return playCase(C, restart); };
  window.PRO.drill = startDrill;
  window.PRO.fix = function (id) { startFix(id); };
})();
