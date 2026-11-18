/* =========================================================
 * charla/js/app.js — CHARLA（会話を 聞く・書く・まねる）
 *
 *  ダイアログ（charla/dialogs/<シリーズ>/<id>/ の dialog.json・audio.mp3・notes.json）を、
 *  シリーズの解説（charla/dialogs/<シリーズ>/guide.md）の訳・★・聞き取りポイントと合わせて、
 *  台本と音声をそろえて聞く道具。ゲームの要素は入れない。
 *    🎧 聞く        台本を見ながら（隠して）聞く。セリフをタップ → そのセリフを AB 区間にしてくり返す
 *    ✍️ 書き取り    1セリフずつ「聞く → 書く時間」を回数ぶん → 答えを見る（書くのは紙。アプリは再生だけ）
 *    🗣 シャドーイング 1セリフずつ「聞く → 間（あなたの番）」を回数ぶん。役になる・録音して聞き比べる
 *    📘 解説        guide.md から：聞き取りポイントは台本の頭に（聞く前に読む）。文法ノートなどはたたんで
 *    📒 調べた単語   バルーンで調べた語を記録 → チェックして単語アプリ（¡VAMOS!）のデッキ「charla」へ
 *
 *  保存（localStorage）：charla.v1（?sandbox は charla.sandbox.v1）
 *    lessons[id].done  最後まで聞いた（コース一覧の進み具合）
 *    looked[id][key]   調べた語（key＝'w:見出し語' か 'p:言い回し'）
 *    pos[id]           最後に聞いていたセリフ
 *    set               速さ・文字・訳・シャドーイングの設定
 * ========================================================= */
(function () {
  'use strict';
  var T = window.CharlaText;
  var SANDBOX = /[?&]sandbox/.test(location.search);
  var KEY = SANDBOX ? 'charla.sandbox.v1' : 'charla.v1';
  var DECK_ID = SANDBOX ? 'charla-sandbox' : 'charla';
  var PRE = 120, TAIL = 250;                 /* セリフの前後の余白（ms）。書き出しの時刻は声の約30ms前〜約60ms後 */
  var SPEEDS = [0.6, 0.75, 0.85, 1, 1.15];

  /* ---------- 保存 ---------- */
  function fresh() { return { lessons: {}, looked: {}, dict: {}, pos: {}, set: { speed: 1, text: 'show', ja: false, rep: 2, gap: 1.5, role: '', stext: 'show', rec: false, drep: 2, dgap: 3, dtext: 'after', dauto: false, only: '' }, pts: {}, dest: '' }; }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.set) { var f = fresh(); for (var k in f) if (!(k in s)) s[k] = f[k]; for (var j in f.set) if (!(j in s.set)) s.set[j] = f.set[j]; return s; } } catch (e) { /* 保存領域が使えない */ }
    return fresh();
  }
  var S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* 保存できなくても使える */ } }

  /* ---------- 小道具 ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function mmss(ms) { var s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  function show(id) { $$('.screen').forEach(function (el) { el.hidden = el.id !== id; }); closeBalloon(); }
  var POS_JA = { n: '名詞', v: '動詞', adj: '形容詞', adv: '副詞', phr: '言い回し', prep: '前置詞', pron: '代名詞', art: '冠詞', conj: '接続詞', num: '数', int: '疑問詞', det: '指示・所有', rel: '関係詞', interj: '間投詞' };
  var G_JA = { m: '男性', f: '女性', mf: '男女同形' };

  /* ---------- 読み込み ---------- */
  var cache = {}, guides = {};
  function getJSON(url) { return fetch(url, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status + ' ' + url); return r.json(); }); }
  function series(id) { return (window.CHARLA_SERIES || []).filter(function (s) { return s.id === id; })[0] || null; }
  function entry(id) { return (window.CHARLA_DIALOGS || []).filter(function (d) { return d.id === id; })[0] || null; }
  /* シリーズの解説（guide.md）。なければ null */
  function loadGuide(sid) {
    var s = series(sid);
    if (!s || !s.guide) return Promise.resolve(null);
    if (!guides[sid]) guides[sid] = fetch('charla/dialogs/' + sid + '/' + s.guide, { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(T.parseGuide).catch(function () { delete guides[sid]; return null; });
    return guides[sid];
  }
  /* 話の頭（### より前）から「あらすじ」と「聞き取りポイント」（箇条書き）を取り出す */
  function epPoints(ep) {
    var out = { plot: '', pts: [] }, inPts = false;
    String(ep && ep.top || '').split('\n').forEach(function (ln) {
      var m = /^\*\*あらすじ\*\*[：:]\s*(.*)/.exec(ln);
      if (m) { out.plot = m[1]; inPts = false; return; }
      if (/^\*\*聞き取りポイント\*\*/.test(ln)) { inPts = true; return; }
      if (inPts && /^\s*[-*] +/.test(ln)) out.pts.push(ln.replace(/^\s*[-*] +/, ''));
      else if (inPts && ln.trim()) inPts = false;
    });
    return out;
  }
  function loadDialog(id) {
    if (cache[id]) return Promise.resolve(cache[id]);
    var d = entry(id);
    if (!d) return Promise.reject(new Error('一覧にないダイアログ ' + id));
    var base = d.base, s = series(d.series);
    return Promise.all([getJSON(base + 'dialog.json'), getJSON(base + 'notes.json').catch(function () { return { words: {}, phrases: [] }; }), loadGuide(d.series)])
      .then(function (r) {
        var D = r[0], N = r[1], G = r[2], ep = G && G.eps[d.no] || null;
        N.names = (N.names || []).concat(s && s.names || []);
        var dict = new T.Dict(N, window.ES_WORDS);
        /* 訳と ★ は解説の本文の表から（# の番号でそろえる。ト書きの行は飛ばす） */
        var rows = {};
        (ep && ep.rows || []).forEach(function (x) { if (x.no) rows[x.no] = x; });
        D.lines.forEach(function (l, i) {
          var g = rows[i + 1];
          l.toks = dict.line(l.text);
          l.ja = g && g.ja || N.lines && N.lines[i] && N.lines[i].ja || '';
          l.star = !!(g && g.star);
        });
        cache[id] = { D: D, N: N, dict: dict, base: base, d: d, ep: ep, pts: epPoints(ep) };
        return cache[id];
      });
  }

  /* =========================================================
   * ホーム
   * ========================================================= */
  function home() {
    stopAll();
    show('home');
    var list = window.CHARLA_DIALOGS || [];
    $('#dlist').innerHTML = (window.CHARLA_SERIES || []).map(function (s) {
      return '<li class="series"><div class="shead"><div><b>' + esc(s.title) + '</b><small>' + esc(s.sub || '') + '</small></div>' +
        (s.guide ? '<button class="gbtn" data-series="' + esc(s.id) + '">📘 教材について</button>' : '') + '</div></li>' +
        s.dialogs.map(function (d) {
          return '<li><button class="dcard" data-id="' + esc(d.id) + '"><b class="es">' + (d.no ? '<i>' + d.no + '</i>' : '') + esc(d.title) + '</b><span>' + esc(d.titleJa || '') + '</span>' +
            '<small id="dm-' + esc(d.id) + '">' + (S.lessons[d.id] && S.lessons[d.id].done ? '🎧 最後まで聞いた' : '') + '</small></button></li>';
        }).join('');
    }).join('') || '<li class="empty">ダイアログがまだありません</li>';
    list.forEach(function (d) {
      loadDialog(d.id).then(function (c) {
        var el = document.getElementById('dm-' + d.id); if (!el) return;
        el.textContent = c.D.lines.length + 'セリフ・' + mmss(c.D.durationMs) + (el.textContent ? '　' + el.textContent : '');
      }).catch(function () { /* 一覧は出したまま */ });
    });
    var n = lookedList().filter(function (r) { return !r.sent; }).length;
    $('#hWordsN').textContent = n ? '（まだ送っていない語 ' + n + '）' : '';
  }
  $('#dlist').addEventListener('click', function (e) {
    var g = e.target.closest('[data-series]'); if (g) { guideScreen(g.dataset.series, null, 'home'); return; }
    var b = e.target.closest('[data-id]'); if (b) openDialog(b.dataset.id);
  });

  /* =========================================================
   * 📘 解説（guide.md）。全部を読ませる画面ではなく、必要なときに引く
   *  話から：あらすじ・聞き取りポイント → 文法ノート・慣用表現・語彙（たたんでおく）
   *  一覧から：シリーズの説明と、付録（ネタバレがあるので閉じておく）
   * ========================================================= */
  var gFrom = 'home';
  function guideScreen(sid, no, from) {
    gFrom = from;
    stopAll();
    var s = series(sid);
    $('#gTitle').textContent = no ? '📘 第' + no + '話の解説' : '📘 ' + (s ? s.title : '解説');
    $('#gSub').textContent = no ? (C && C.d && C.d.titleJa || '') : (s && s.sub || '');
    $('#gBody').innerHTML = '<p class="hint">読み込み中…</p>';
    show('guide');
    $('#gBody').scrollTop = 0;
    loadGuide(sid).then(function (G) {
      if (!G) { $('#gBody').innerHTML = '<p class="hint">解説を読み込めませんでした</p>'; return; }
      var html = '';
      if (no) {
        var ep = G.eps[no];
        if (!ep) { $('#gBody').innerHTML = '<p class="hint">この話の解説はありません</p>'; return; }
        html += '<div class="md">' + T.mdToHtml(ep.top) + '</div>';
        html += ep.secs.map(function (x) { return '<details class="gsec"><summary>' + esc(x.h) + '</summary><div class="md">' + T.mdToHtml(x.md) + '</div></details>'; }).join('');
        html += '<p class="hint">訳は「訳 あり」でセリフの下に。★＝くり返し練習したいセリフ（書き取り・シャドーイングで「★だけ」にできます）。</p>';
      } else {
        html += '<div class="md">' + T.mdToHtml(G.intro.replace(/^# .*\n/, '')) + '</div>';
        html += G.extra.map(function (x) { return '<details class="gsec"><summary>' + esc(x.h) + '<small>（ネタバレあり）</small></summary><div class="md">' + T.mdToHtml(x.md) + '</div></details>'; }).join('');
      }
      $('#gBody').innerHTML = html;
    });
  }
  $('#gBack').addEventListener('click', function () { if (gFrom === 'play' && C) show('play'); else home(); });
  $('#pGuide').addEventListener('click', function () { if (C && C.d) guideScreen(C.d.series, C.d.no, 'play'); });
  $('#hWords').addEventListener('click', function () { wordsScreen('home'); });

  /* =========================================================
   * プレーヤー
   * ========================================================= */
  var C = null;                 /* いまのダイアログ { D, N, dict, base } */
  var mode = 'listen';
  var au = new Audio();
  au.preload = 'auto';
  try { au.preservesPitch = true; au.webkitPreservesPitch = true; au.mozPreservesPitch = true; } catch (e) { /* */ }

  /* 再生の状態
   *  loop：'' なし／'all' 全体／'ab' AB区間
   *  ab：{ a, b, i, j }（ms と、セリフ i〜j）
   *  sh：シャドーイングの進行 { i：セリフ, n：何回目, phase：'play'|'gap'|'turn'|'model', timer } */
  var P = { loop: '', ab: null, cur: -1, sh: null, stopAt: null, raf: 0, reveal: {}, heard: {} };

  function seg(i) {
    var L = C.D.lines, l = L[i], nx = L[i + 1];
    return { a: Math.max(0, l.startMs - PRE), b: Math.min(l.endMs + TAIL, nx ? nx.startMs - 20 : C.D.durationMs) };
  }
  function lineAt(ms) {
    var L = C.D.lines, k = -1;
    for (var i = 0; i < L.length; i++) { if (ms >= L[i].startMs - PRE) k = i; else break; }
    return k;
  }
  function nowMs() { return nowMsSafe(); }
  /* 音声の長さが分かる前の位置合わせは、分かったときに行う（iPhone は再生の直前まで読み込まないことがある） */
  var pendingSeek = null;
  function seekMs(ms) {
    ms = Math.max(0, ms);
    if (au.readyState < 1) { pendingSeek = ms; return; }
    pendingSeek = null;
    try { au.currentTime = ms / 1000; } catch (e) { pendingSeek = ms; }
  }
  au.addEventListener('loadedmetadata', function () { if (pendingSeek != null) { var m = pendingSeek; pendingSeek = null; try { au.currentTime = m / 1000; } catch (e) { /* */ } } });
  function nowMsSafe() { return pendingSeek != null ? pendingSeek : au.currentTime * 1000; }
  function play() { var p = au.play(); if (p && p.catch) p.catch(function () { /* 自動再生の制限（タップで再開） */ }); }

  function openDialog(id) {
    loadDialog(id).then(function (c) {
      C = c;
      P = { loop: '', ab: null, cur: -1, sh: null, stopAt: null, raf: 0, reveal: {}, heard: {}, ptsOpen: !S.pts[id] };
      S.pts[id] = 1; save();   /* 聞き取りポイントは初めての1回だけ開いて出す */
      au.src = c.base + (c.D.audio || 'audio.mp3');
      au.load();
      au.playbackRate = S.set.speed;
      $('#pTitle').textContent = c.d.title;
      $('#pSub').textContent = (c.d.titleJa ? c.d.titleJa + '　' : '') + (c.N.sceneJa || '');
      $('#pGuide').hidden = !c.ep;
      $('#sOnly').hidden = $('#dOnly').hidden = !c.D.lines.some(function (l) { return l.star; });
      $('#tAll').textContent = mmss(c.D.durationMs);
      drawSegs();
      setMode('listen');
      show('play');
      var last = S.pos[id];
      if (last != null && c.D.lines[last]) { P.cur = last; seekWhenReady(seg(last).a); }
      paint();
      if ('mediaSession' in navigator) {
        try {
          navigator.mediaSession.metadata = new MediaMetadata({ title: c.d.title, artist: 'CHARLA', album: c.d.titleJa || '' });
          navigator.mediaSession.setActionHandler('play', function () { togglePlay(true); });
          navigator.mediaSession.setActionHandler('pause', function () { togglePlay(false); });
          navigator.mediaSession.setActionHandler('seekbackward', function () { back2(); });
          navigator.mediaSession.setActionHandler('previoustrack', function () { stepLine(-1); });
          navigator.mediaSession.setActionHandler('nexttrack', function () { stepLine(1); });
        } catch (e) { /* 対応していない操作 */ }
      }
    }).catch(function (e) { alert('ダイアログを読み込めませんでした：' + e.message); });
  }
  function seekWhenReady(ms) { seekMs(ms); }
  function stopAll() {
    au.pause();
    if (P.sh && P.sh.timer) clearTimeout(P.sh.timer);
    P.sh = null; P.stopAt = null;
    stopRec();
  }
  $('#pBack').addEventListener('click', home);
  $('#pWords').addEventListener('click', function () { au.pause(); shPause(); wordsScreen('play'); });

  /* ---------- モード ---------- */
  function setMode(m) {
    stopAll();
    mode = m;
    $$('#tabs button').forEach(function (b) { b.classList.toggle('on', b.dataset.m === m); });
    $('#optsListen').hidden = m !== 'listen';
    $('#optsShadow').hidden = m !== 'shadow';
    $('#optsDict').hidden = m !== 'dict';
    $('#cLoop').hidden = m !== 'listen';
    P.reveal = {}; P.heard = {};
    renderScript();
    paintOpts();
    paint();
  }
  $('#tabs').addEventListener('click', function (e) { var b = e.target.closest('[data-m]'); if (b && b.dataset.m !== mode) setMode(b.dataset.m); });

  /* ---------- 台本 ---------- */
  function tokHTML(toks, li) {
    return toks.map(function (t) {
      if (t.t === 'x') return esc(t.s);
      if (t.t === 'ph') return '<span class="ph' + (t.ph.key ? ' key' : '') + '" data-ph="' + esc(t.ph.t) + '" data-li="' + li + '">' + esc(t.s) + '</span>';
      var g = t.g, cls = 'w' + (g && g.key ? ' key' : '') + (g && !g.name ? ' has' : '');
      return '<span class="' + cls + '" data-k="' + esc(t.k) + '" data-li="' + li + '">' + esc(t.s) + '</span>';
    }).join('');
  }
  /* 隠すとき：語の長さだけの棒（何語・どのくらいの長さかは見える＝聞き取りの手がかり） */
  function hiddenHTML(l) {
    var flat = [];
    l.toks.forEach(function (t) { if (t.t === 'ph') flat = flat.concat(t.toks); else flat.push(t); });
    return flat.map(function (t) { return t.t === 'x' ? esc(t.s) : '<span class="bar-w" style="width:' + (t.s.length * 0.46) + 'em"></span>'; }).join('');
  }
  function textMode() { return mode === 'shadow' ? S.set.stext : mode === 'dict' ? S.set.dtext : S.set.text; }
  /* 1セリフずつ進むモード（シャドーイング・書き取り） */
  function stepMode() { return mode === 'shadow' || mode === 'dict'; }
  /* 「セリフ：★だけ」：1セリフずつ進むとき、★のセリフだけを回る */
  function onlyStar() { return S.set.only === 'star' && !!C && C.D.lines.some(function (l) { return l.star; }); }
  function stepTo(i, d) {
    var L = C.D.lines;
    for (; i >= 0 && i < L.length; i += d) if (!onlyStar() || L[i].star) return i;
    return -1;
  }
  function lineHidden(i) {
    var m = textMode();
    if (P.reveal[i]) return false;
    if (m === 'hide') return true;
    if (m === 'after') return !P.heard[i];
    return false;
  }
  function renderScript() {
    var L = C.D.lines, sp = {};
    (C.D.speakers || []).forEach(function (s, k) { sp[s.id] = k; });
    $('#script').innerHTML = ptsHTML() + L.map(function (l, i) {
      var hid = lineHidden(i), off = stepMode() && onlyStar() && !l.star;
      return '<div class="ln sp' + (sp[l.speaker] || 0) + (hid ? ' hid' : '') + (off ? ' off' : '') + '" data-i="' + i + '">' +
        '<button class="who" data-act="line" aria-label="セリフ' + (i + 1) + 'から">' + esc(spName(l.speaker)) + '<small>' + (l.star ? '<b class="star">★</b>' : '') + (i + 1) + '</small></button>' +
        '<div class="body"><p class="es" lang="es">' + (hid ? hiddenHTML(l) : tokHTML(l.toks, i)) + '</p>' +
        (S.set.ja && !hid ? '<p class="ja">' + esc(l.ja) + '</p>' : '') +
        '<div class="turn" hidden><i></i><span></span></div>' +
        '</div>' +
        '<div class="side">' + (textMode() !== 'show' ? '<button class="eye" data-act="eye" aria-label="このセリフの文字">' + (hid ? '👁' : '🙈') + '</button>' : '') +
        (P.recs && P.recs[i] ? '<button class="mine" data-act="mine" aria-label="自分の声">▶<small>自分</small></button>' : '') + '</div>' +
        '</div>';
    }).join('') + '<div class="endpad"></div>';
    paint(true);
  }
  /* 聞き取りポイント：聞く前に「何を聞き取るか」を決めておく（🎧 聞くのときだけ）
   *  一度見ればよい情報なので、開いて出すのはそのダイアログを初めて開いたときだけ。2回目からは細い1行（タップで開く） */
  function ptsHTML() {
    var p = C.pts;
    if (mode !== 'listen' || !p || !p.pts.length) return '';
    var open = !!P.ptsOpen;
    return '<div class="pts' + (open ? '' : ' shut') + '"><button class="ptsh" data-act="pts">🎯 聞き取りポイント<span>' + (open ? 'たたむ' : '開く') + '</span></button>' +
      (open ? (p.plot ? '<p class="plot">' + esc(p.plot) + '</p>' : '') + '<ol>' + p.pts.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' : '') + '</div>';
  }
  /* 話し手の表示：LUCIA → Lucia（大文字だけだと幅をとる） */
  function spName(id) { id = String(id || ''); return id.length > 2 && id === id.toUpperCase() ? id.charAt(0) + id.slice(1).toLowerCase() : id; }
  function lineEl(i) { return $('#script .ln[data-i="' + i + '"]'); }

  $('#script').addEventListener('click', function (e) {
    if (e.target.closest('[data-act="pts"]')) { P.ptsOpen = !P.ptsOpen; refreshLine(); return; }
    var ln = e.target.closest('.ln'); if (!ln) return;
    var i = +ln.dataset.i, act = e.target.closest('[data-act]');
    if (act && act.dataset.act === 'eye') {
      if (lineHidden(i)) P.reveal[i] = true; else { P.reveal[i] = false; P.heard[i] = false; }
      refreshLine(i); return;
    }
    if (act && act.dataset.act === 'mine') { playMine(i); return; }
    var w = e.target.closest('.w.has, .ph');
    /* 語：点線の語はいつでも、ほかの語は「いま聞いている（くり返している）セリフ」の中なら、意味を出す */
    if (w && !(act && act.dataset.act === 'line') && (w.classList.contains('key') || isActive(i))) { openBalloon(w, i); return; }
    lineTap(i);
  });
  function isActive(i) {
    if (stepMode()) return P.sh ? P.sh.i === i : P.cur === i;
    if (P.ab) return i >= P.ab.i && i <= P.ab.j;
    return P.cur === i;
  }
  /* 1セリフの表示を変えたとき（全体を描き直し、スクロールの位置は保つ） */
  function refreshLine() {
    var keep = $('#script').scrollTop, lab = P.sh && $('#script .turn:not([hidden])');
    var labText = lab ? $('span', lab).textContent : '';
    renderScript();
    $('#script').scrollTop = keep;
    if (labText && P.sh && P.sh.phase !== 'turn') shLabel(labText, 0);
  }

  /* セリフをタップ：聞く → そのセリフを AB 区間にして頭から（くり返す）／シャドーイング → そのセリフから始める */
  function lineTap(i) {
    closeBalloon();
    if (stepMode()) { shStart(i); return; }
    var s = seg(i);
    P.ab = { a: s.a, b: s.b, i: i, j: i };
    P.loop = 'ab';
    P.cur = i;
    seekMs(s.a);
    play();
    paintOpts(); paint(true);
  }

  /* ---------- 時間の進行（再生中は毎フレーム、画面が消えているあいだは timeupdate） ---------- */
  function tick() {
    if (!C) return;
    var t = nowMs();
    if (mode === 'listen' && !au.paused) {
      if (P.loop === 'ab' && P.ab && (t >= P.ab.b || t < P.ab.a - 400)) { seekMs(P.ab.a); t = P.ab.a; }
      else if (P.stopAt != null && t >= P.stopAt) { au.pause(); P.stopAt = null; }
    }
    if (stepMode() && P.sh && (P.sh.phase === 'play' || P.sh.phase === 'model')) {
      if (t >= seg(P.sh.i).b) shAfterPlay();
    }
    var k = lineAt(t);
    if (!(stepMode() && !P.sh) && k !== P.cur && !(P.sh && P.sh.phase !== 'play' && P.sh.phase !== 'model')) {
      if (!(P.loop === 'ab' && P.ab && (k < P.ab.i || k > P.ab.j))) { P.cur = k; if (k >= 0) { S.pos[C.D.id] = k; save(); } paint(true); }
    }
    paintTime(t);
  }
  function loopRaf() { tick(); if (!au.paused) P.raf = requestAnimationFrame(loopRaf); }
  au.addEventListener('play', function () { cancelAnimationFrame(P.raf); P.raf = requestAnimationFrame(loopRaf); paintPlay(); });
  au.addEventListener('pause', function () { paintPlay(); });
  /* 毎フレームの更新が止まる場面（画面が消えている・裏のタブ）でも、くり返しの区切りを守る */
  au.addEventListener('timeupdate', tick);
  au.addEventListener('ended', function () {
    if (!C) return;
    if (mode === 'listen') {
      S.lessons[C.D.id] = { done: true }; save();
      if (P.loop === 'all') { seekMs(0); play(); }
      else if (P.loop === 'ab' && P.ab) { seekMs(P.ab.a); play(); }
    }
    if (stepMode() && P.sh) shAfterPlay();
    paintPlay();
  });

  /* ---------- 操作盤 ---------- */
  function togglePlay(force) {
    if (!C) return;
    closeBalloon();
    var want = force != null ? force : (au.paused && !(P.sh && P.sh.timer));
    if (stepMode()) { if (want) shStart(P.sh ? P.sh.i : stepTo(Math.max(0, P.cur), 1) < 0 ? stepTo(0, 1) : stepTo(Math.max(0, P.cur), 1)); else shPause(); return; }
    if (want) { if (P.loop === 'ab' && P.ab && (nowMs() < P.ab.a || nowMs() >= P.ab.b)) seekMs(P.ab.a); play(); }
    else au.pause();
  }
  function back2() {
    if (!C) return;
    if (stepMode()) { shBack2(); return; }
    var t = nowMs() - 2000 * Math.max(1, S.set.speed);
    if (P.loop === 'ab' && P.ab && t < P.ab.a) t = P.ab.a;
    seekMs(t);
    if (au.paused) play();
    paintTime(nowMs());
  }
  function stepLine(d) {
    if (!C) return;
    var n = C.D.lines.length, base = stepMode() && P.sh ? P.sh.i : (P.ab && P.loop === 'ab' ? P.ab.i : P.cur);
    /* セリフの途中で ⏮ → そのセリフの頭へ（1秒より後なら） */
    if (d < 0 && mode === 'listen' && base >= 0 && nowMs() - seg(base).a > 1000 && !(P.loop === 'ab')) { seekMs(seg(base).a); play(); return; }
    var i = Math.max(0, Math.min(n - 1, (base < 0 ? 0 : base) + d));
    if (stepMode()) { var k = stepTo(base < 0 ? 0 : base + d, d < 0 ? -1 : 1); if (k < 0) k = stepTo(Math.max(0, base), d < 0 ? 1 : -1); if (k >= 0) shStart(k); return; }
    if (P.loop === 'ab') { lineTap(i); return; }
    P.cur = i; seekMs(seg(i).a); play(); paint(true);
  }
  $('#cPlay').addEventListener('click', function () { togglePlay(); });
  $('#cBack2').addEventListener('click', back2);
  $('#cPrev').addEventListener('click', function () { stepLine(-1); });
  $('#cNext').addEventListener('click', function () { stepLine(1); });
  $('#cLoop').addEventListener('click', function () {
    /* なし → 全体 → （AB区間があれば）AB → なし */
    var order = P.ab ? ['', 'all', 'ab'] : ['', 'all'];
    P.loop = order[(order.indexOf(P.loop) + 1) % order.length];
    paintOpts(); paint();
  });
  function cycle(arr, v) { var k = arr.indexOf(v); return arr[(k + 1) % arr.length]; }
  function setSpeed() {
    S.set.speed = cycle(SPEEDS, S.set.speed); save();
    au.playbackRate = S.set.speed;
    paintOpts();
  }
  $('#oSpeed').addEventListener('click', setSpeed);
  $('#sSpeed').addEventListener('click', setSpeed);
  $('#oText').addEventListener('click', function () { S.set.text = S.set.text === 'show' ? 'hide' : 'show'; P.reveal = {}; save(); renderScript(); paintOpts(); });
  $('#oJa').addEventListener('click', function () { S.set.ja = !S.set.ja; save(); renderScript(); paintOpts(); });
  $('#abMore').addEventListener('click', function () {
    if (!P.ab) return;
    var j = Math.min(C.D.lines.length - 1, P.ab.j + 1);
    P.ab.j = j; P.ab.b = seg(j).b;
    paintOpts(); paint(true);
  });
  $('#abClear').addEventListener('click', function () { P.ab = null; if (P.loop === 'ab') P.loop = ''; paintOpts(); paint(true); });

  /* 進みのバー：セリフごとの区切り（話し手の色）・AB区間・いまの位置。タップでその位置へ */
  function drawSegs() {
    var dur = C.D.durationMs, sp = {};
    (C.D.speakers || []).forEach(function (s, k) { sp[s.id] = k; });
    $('#segs').innerHTML = C.D.lines.map(function (l) {
      return '<i class="sp' + (sp[l.speaker] || 0) + '" style="left:' + (l.startMs / dur * 100) + '%;width:' + ((l.endMs - l.startMs) / dur * 100) + '%"></i>';
    }).join('');
  }
  $('#seek').addEventListener('click', function (e) {
    if (!C) return;
    var r = this.getBoundingClientRect(), ms = (e.clientX - r.left) / r.width * C.D.durationMs;
    if (stepMode()) { shStart(Math.max(0, lineAt(ms))); return; }
    if (P.loop === 'ab') { P.loop = ''; }
    seekMs(ms); P.cur = lineAt(ms); paintOpts(); paint(true);
  });

  /* ---------- 画面の更新 ---------- */
  function paintTime(t) {
    if (!C) return;
    $('#tNow').textContent = mmss(t);
    $('#needle').style.left = Math.min(100, t / C.D.durationMs * 100) + '%';
  }
  function paintPlay() {
    var on = stepMode() ? !!(P.sh && (P.sh.timer || !au.paused)) : !au.paused;
    $('#cPlay').textContent = on ? '⏸' : '▶';
    $('#cPlay').setAttribute('aria-label', on ? '止める' : '再生');
  }
  function paint(scroll) {
    if (!C) return;
    var act = stepMode() && P.sh ? P.sh.i : P.cur;
    $$('#script .ln').forEach(function (el) {
      var i = +el.dataset.i;
      el.classList.toggle('now', i === act);
      el.classList.toggle('inab', mode === 'listen' && !!P.ab && P.loop === 'ab' && i >= P.ab.i && i <= P.ab.j);
    });
    var sh = $('#abShade');
    if (mode === 'listen' && P.ab) {
      sh.hidden = false;
      sh.style.left = (P.ab.a / C.D.durationMs * 100) + '%';
      sh.style.width = ((P.ab.b - P.ab.a) / C.D.durationMs * 100) + '%';
      sh.classList.toggle('off', P.loop !== 'ab');
    } else sh.hidden = true;
    if (scroll && act >= 0) {
      var el = lineEl(act), box = $('#script');
      if (el) {
        var top = el.offsetTop - box.offsetTop, h = el.offsetHeight;
        if (top < box.scrollTop + 8 || top + h > box.scrollTop + box.clientHeight - 8) box.scrollTo({ top: Math.max(0, top - box.clientHeight * 0.3), behavior: 'smooth' });
      }
    }
    paintPlay();
  }
  function paintOpts() {
    var sp = (S.set.speed === 1 ? '1.0' : String(S.set.speed));
    $('#oSpeed b').textContent = sp; $('#sSpeed b').textContent = sp; $('#dSpeed b').textContent = sp;
    $('#oText b').textContent = S.set.text === 'show' ? '見せる' : '隠す';
    $('#oJa b').textContent = S.set.ja ? 'あり' : 'なし';
    $('#cLoopT').textContent = { '': 'なし', all: '全体', ab: 'AB' }[P.loop];
    $('#cLoop').classList.toggle('on', !!P.loop);
    var chip = $('#abChip');
    chip.hidden = !(mode === 'listen' && P.ab);
    if (P.ab) $('#abT').textContent = 'AB：セリフ' + (P.ab.i + 1) + (P.ab.j > P.ab.i ? '〜' + (P.ab.j + 1) : '') + (P.loop === 'ab' ? '' : '（止めている）');
    $('#sRep b').textContent = S.set.rep;
    $('#sGap b').textContent = '×' + S.set.gap;
    $('#sRole b').textContent = S.set.role ? spName(S.set.role) + ' になる' : 'なし';
    $('#sText b').textContent = { show: '見せる', hide: '隠す', after: '聞いたら' }[S.set.stext];
    $('#sRec b').textContent = S.set.rec ? '録音する' : '録音しない';
    $('#dRep b').textContent = S.set.drep;
    $('#dGap b').textContent = '×' + S.set.dgap;
    $('#dText b').textContent = { show: '見せる', hide: '隠す', after: '書いたら' }[S.set.dtext];
    $('#dAuto b').textContent = S.set.dauto ? '自動' : '止まる';
    $('#sOnly b').textContent = $('#dOnly b').textContent = S.set.only === 'star' ? '★だけ' : '全部';
    $('#tState').textContent = '';
  }

  /* =========================================================
   * 1セリフずつ進む（🗣 シャドーイング・✍️ 書き取り）
   *  聞く → 間（セリフの長さ×間）を「回数」くり返す → 次のセリフ
   *  シャドーイング：間＝あなたが言う番。役を選ぶと、そのセリフは先に言ってからお手本を1回。録音して ▶自分 で聞ける
   *  書き取り：間＝紙に書く時間。回数ぶん聞いたら、そのセリフで止まる（⏭ で次へ。「次へ：自動」なら進む）。
   *            文字「書いたら」＝回数ぶん聞き終えたセリフだけ答えが見える
   * ========================================================= */
  function cfg() {
    if (mode === 'dict') return { rep: S.set.drep, gap: S.set.dgap, role: '', rec: false, auto: S.set.dauto, turn: '✍️ 書く時間', done: '✔ ▶ もう一度・⏭ 次のセリフ' };
    return { rep: S.set.rep, gap: S.set.gap, role: S.set.role, rec: S.set.rec, auto: true, turn: '🗣 あなたの番', done: '' };
  }
  function shStart(i) {
    closeBalloon();
    if (P.sh && P.sh.timer) clearTimeout(P.sh.timer);
    var role = cfg().role && C.D.lines[i].speaker === cfg().role;
    P.sh = { i: i, n: 0, phase: role ? 'turn' : 'play', timer: 0 };
    P.cur = i; S.pos[C.D.id] = i; save();
    if (role) shTurn(); else shPlay();
    paint(true);
  }
  function shPlay() {
    P.sh.phase = P.sh.phase === 'model' ? 'model' : 'play';
    seekMs(seg(P.sh.i).a);
    play();
    var c = cfg();
    shLabel(P.sh.phase === 'model' ? '🔊 お手本' : '🔊 聞く' + (c.rep > 1 ? '（' + Math.min(P.sh.n + 1, c.rep) + '/' + c.rep + '）' : ''), 0);
  }
  function shAfterPlay() {
    if (!P.sh) return;
    au.pause();
    if (mode === 'shadow' && !P.heard[P.sh.i]) { P.heard[P.sh.i] = true; if (textMode() === 'after') refreshLine(P.sh.i); }
    if (P.sh.phase === 'model') return shDone();
    shTurn();
  }
  /* あなたの番：セリフの長さ×間（速さを落としているときは、その分長く） */
  function shTurn() {
    var l = C.D.lines[P.sh.i];
    var c = cfg();
    var ms = (l.endMs - l.startMs) * c.gap / Math.min(1, S.set.speed) + 300;
    var role = c.role && l.speaker === c.role;
    P.sh.phase = 'turn';
    shLabel(role ? '🗣 あなたのセリフ' : c.turn, ms);
    if (c.rec) startRec(P.sh.i, ms);
    P.sh.timer = setTimeout(function () {
      P.sh.timer = 0;
      stopRec();
      if (role && P.sh.n === 0) { P.sh.n = c.rep; P.sh.phase = 'model'; shPlay(); return; }   /* 役：言ったあとにお手本を1回 */
      P.sh.n++;
      if (!role && P.sh.n < c.rep) { P.sh.phase = 'play'; shPlay(); return; }
      shDone();
    }, ms);
    paintPlay();
  }
  /* そのセリフを回数ぶん終えた：書き取りは答えを見せ、「止まる」ならここで止まる */
  function shDone() {
    var c = cfg(), i = P.sh.i;
    if (mode === 'dict' && !P.heard[i]) { P.heard[i] = true; if (textMode() === 'after') refreshLine(i); }
    if (!c.auto) {
      P.sh = null; P.cur = i;
      shLabelAt(i, c.done, 0);
      paint(); paintPlay();
      return;
    }
    shNext();
  }
  function shNext() {
    var i = stepTo(P.sh.i + 1, 1);
    shLabel('', 0);
    if (i < 0) { P.sh = null; S.lessons[C.D.id] = { done: true }; save(); paint(); $('#tState').textContent = '✔ 最後まで'; return; }
    shStart(i);
  }
  function shPause() {
    if (!P.sh) return;
    if (P.sh.timer) { clearTimeout(P.sh.timer); P.sh.timer = 0; }
    au.pause(); stopRec();
    shLabel('', 0);
    P.cur = P.sh.i; P.sh = null;
    paint();
  }
  /* ⟲ 2秒：聞いている途中 → そのセリフの中で2秒戻す／間・止まっているとき → セリフの最後の2秒をもう一度（回数には数えない） */
  function shBack2() {
    var back = 2000 * Math.max(1, S.set.speed);
    if (P.sh && (P.sh.phase === 'play' || P.sh.phase === 'model') && !au.paused) { seekMs(Math.max(seg(P.sh.i).a, nowMs() - back)); return; }
    var i = P.sh ? P.sh.i : Math.max(0, P.cur), n = P.sh ? P.sh.n : cfg().rep - 1;
    if (P.sh && P.sh.timer) { clearTimeout(P.sh.timer); P.sh.timer = 0; }
    stopRec();
    P.sh = { i: i, n: n, phase: 'play', timer: 0 };
    var s = seg(i);
    seekMs(Math.max(s.a, s.b - TAIL - back));
    play();
    shLabel('🔊 2秒もどして', 0);
    paint();
  }
  /* セリフの下の表示（いまの段階と、あなたの番の残り時間の棒） */
  function shLabel(text, ms) {
    if (!P.sh) { $$('#script .turn').forEach(function (t) { t.hidden = true; }); return; }
    shLabelAt(P.sh.i, text, ms);
  }
  function shLabelAt(i, text, ms) {
    $$('#script .turn').forEach(function (t) { t.hidden = true; });
    if (!text) return;
    var el = lineEl(i); if (!el) return;
    var box = $('.turn', el), bar = $('i', box);
    box.hidden = false;
    $('span', box).textContent = text;
    box.classList.toggle('my', ms > 0);
    box.classList.toggle('fin', /^✔/.test(text));
    bar.style.transition = 'none'; bar.style.width = ms ? '100%' : '0';
    if (ms) { void bar.offsetWidth; bar.style.transition = 'width ' + ms + 'ms linear'; bar.style.width = '0'; }
  }
  $('#sRep').addEventListener('click', function () { S.set.rep = cycle([1, 2, 3], S.set.rep); save(); paintOpts(); });
  $('#sGap').addEventListener('click', function () { S.set.gap = cycle([1, 1.5, 2], S.set.gap); save(); paintOpts(); });
  $('#sRole').addEventListener('click', function () { var ids = [''].concat((C.D.speakers || []).map(function (s) { return s.id; })); S.set.role = cycle(ids, S.set.role); save(); paintOpts(); });
  $('#sText').addEventListener('click', function () { S.set.stext = cycle(['show', 'after', 'hide'], S.set.stext); P.reveal = {}; save(); renderScript(); paintOpts(); });
  $('#dRep').addEventListener('click', function () { S.set.drep = cycle([1, 2, 3], S.set.drep); save(); paintOpts(); });
  $('#dGap').addEventListener('click', function () { S.set.dgap = cycle([2, 3, 4], S.set.dgap); save(); paintOpts(); });
  $('#dText').addEventListener('click', function () { S.set.dtext = cycle(['after', 'hide', 'show'], S.set.dtext); P.reveal = {}; save(); renderScript(); paintOpts(); });
  $('#sOnly').addEventListener('click', toggleOnly);
  $('#dOnly').addEventListener('click', toggleOnly);
  function toggleOnly() { S.set.only = S.set.only === 'star' ? '' : 'star'; save(); stopAll(); shLabel('', 0); renderScript(); paintOpts(); paintPlay(); }
  $('#dAuto').addEventListener('click', function () { S.set.dauto = !S.set.dauto; save(); paintOpts(); });
  $('#dSpeed').addEventListener('click', setSpeed);
  $('#sRec').addEventListener('click', function () {
    S.set.rec = !S.set.rec; save(); paintOpts();
    if (S.set.rec) getMic().catch(function () { S.set.rec = false; save(); paintOpts(); alert('マイクを使えませんでした（ブラウザの設定でマイクを許可してください）'); });
    else dropMic();
  });

  /* ---------- 録音（MediaRecorder）。iPhone ではイヤホンを使うと、お手本と自分の声が混ざらない ---------- */
  var mic = null, rec = null;
  P.recs = {};
  function getMic() {
    if (mic) return Promise.resolve(mic);
    if (!navigator.mediaDevices || !window.MediaRecorder) return Promise.reject(new Error('no'));
    return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) { mic = s; return s; });
  }
  function dropMic() { stopRec(); if (mic) { mic.getTracks().forEach(function (t) { t.stop(); }); mic = null; } }
  function startRec(i, ms) {
    getMic().then(function (s) {
      if (!P.sh || P.sh.phase !== 'turn') return;
      var chunks = [];
      try { rec = new MediaRecorder(s); } catch (e) { return; }
      rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = function () {
        if (!chunks.length) return;
        if (!P.recs) P.recs = {};
        if (P.recs[i]) URL.revokeObjectURL(P.recs[i]);
        P.recs[i] = URL.createObjectURL(new Blob(chunks, { type: chunks[0].type || 'audio/mp4' }));
        var el = lineEl(i);
        if (el && !$('.mine', el)) $('.side', el).insertAdjacentHTML('beforeend', '<button class="mine" data-act="mine" aria-label="自分の声">▶<small>自分</small></button>');
      };
      rec.start();
      void ms;
    }).catch(function () { /* マイクなし */ });
  }
  function stopRec() { if (rec && rec.state !== 'inactive') { try { rec.stop(); } catch (e) { /* */ } } rec = null; }
  var mine = new Audio();
  function playMine(i) {
    if (!P.recs || !P.recs[i]) return;
    shPause(); au.pause();
    mine.src = P.recs[i]; mine.play().catch(function () { /* */ });
  }

  /* =========================================================
   * バルーン（語の意味）と、調べた語の記録
   * ========================================================= */
  var B = $('#balloon');
  function closeBalloon() { B.hidden = true; }
  function openBalloon(el, li) {
    var l = C.D.lines[li], rec = null, html;
    if (el.classList.contains('ph')) {
      var tok = l.toks.filter(function (t) { return t.t === 'ph' && t.ph.t === el.dataset.ph; })[0];
      if (!tok) return;
      var ph = tok.ph;
      var parts = tok.toks.filter(function (t) { return t.t === 'w' && t.g && !t.g.name && t.g.pos !== 'art' && t.g.pos !== 'prep'; });
      html = '<p class="bw"><b lang="es">' + esc(tok.s) + '</b><small>言い回し</small><button class="say" data-say="' + esc(tok.s) + '" aria-label="読み上げ">🔊</button></p>' +
        '<p class="bja">' + esc(ph.ja) + '</p>' + (ph.note ? '<p class="bnote">' + esc(ph.note) + '</p>' : '') +
        (parts.length ? '<p class="bparts">' + parts.map(function (t) { return '<span lang="es">' + esc(t.s) + '</span>＝' + esc(t.g.ja); }).join('　') + '</p>' : '');
      rec = { kind: 'p', w: ph.t, pos: 'phr', ja: ph.ja, surf: tok.s, line: li, note: ph.note || '', clue: ph.clue || null };
    } else {
      var g = C.dict.word(el.dataset.k);
      if (!g || g.name) return;
      var surf = el.textContent;
      html = '<p class="bw"><b lang="es">' + esc(g.w) + '</b><small>' + esc(POS_JA[g.pos] || '') + (g.g ? '・' + G_JA[g.g] : '') + '</small><button class="say" data-say="' + esc(g.w) + '" aria-label="読み上げ">🔊</button></p>' +
        '<p class="bja">' + esc(g.ja) + '</p>' +
        (g.form ? '<p class="bform"><span lang="es">' + esc(surf) + '</span>：' + esc(g.form) + '</p>' : '') +
        (g.note ? '<p class="bnote">' + esc(g.note) + '</p>' : '');
      if (g.pos !== 'art' && g.pos !== 'prep' && g.pos !== 'bad') rec = { kind: 'w', w: g.w, pos: g.pos, g: g.g || null, ja: g.ja, surf: surf, line: li, form: g.form || '', note: g.note || '', clue: g.clue || null, cj: g.cj || null };
    }
    if (rec) { record(rec); html += '<p class="bfoot">📒 調べた単語に記録しました</p>'; }
    B.innerHTML = html;
    B.hidden = false;
    /* 語の下（下に入らなければ上）に出す */
    var r = el.getBoundingClientRect(), vw = document.documentElement.clientWidth, vh = window.innerHeight;
    B.style.maxWidth = Math.min(320, vw - 24) + 'px';
    var bw = B.offsetWidth, bh = B.offsetHeight;
    var x = Math.max(12, Math.min(vw - bw - 12, r.left + r.width / 2 - bw / 2));
    var y = r.bottom + 8;
    if (y + bh > vh - 12) y = Math.max(12, r.top - bh - 8);
    B.style.left = x + 'px'; B.style.top = y + 'px';
  }
  B.addEventListener('click', function (e) {
    var s = e.target.closest('[data-say]');
    if (s) { e.stopPropagation(); say(s.dataset.say); }
  });
  document.addEventListener('click', function (e) {
    if (B.hidden || B.contains(e.target) || e.target.closest('.w.has, .ph')) return;
    closeBalloon();
  }, true);
  $$('.scroll').forEach(function (s) { s.addEventListener('scroll', closeBalloon, { passive: true }); });
  /* 語の読み上げ（語は読み上げでも十分。文はダイアログの音声で聞く） */
  function say(text) {
    if (!window.speechSynthesis) return;
    au.pause(); if (P.sh) shPause();
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-ES'; u.rate = 0.9;
      var v = speechSynthesis.getVoices().filter(function (x) { return /^es(-|_)ES/i.test(x.lang); })[0] || speechSynthesis.getVoices().filter(function (x) { return /^es/i.test(x.lang); })[0];
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) { /* 読み上げなし */ }
  }

  function record(r) {
    var id = C.D.id, box = S.looked[id] = S.looked[id] || {}, key = r.kind + ':' + r.w.toLowerCase();
    var old = box[key];
    r.n = (old ? old.n : 0) + 1;
    r.at = Date.now();
    r.sent = old ? old.sent : false;
    if (old && old.sent) { r.surf = old.surf; r.line = old.line; }     /* 送った語は、送ったときの例文のまま */
    box[key] = r;
    save();
  }
  function lookedList() {
    var out = [];
    Object.keys(S.looked).forEach(function (did) {
      Object.keys(S.looked[did]).forEach(function (k) { var r = S.looked[did][k]; out.push(Object.assign({ did: did, key: k }, r)); });
    });
    return out;
  }

  /* =========================================================
   * 📒 調べた単語 → 単語アプリの「端末に読み込んだ参考書のデッキ」に足す
   *  アプリを切りかえずに参考書の語と一緒に出題されるよう、送り先は参考書のデッキ（えらべる・覚える）。
   *  区別：1ダイアログ＝デッキの1区間（id「charla-<ダイアログ>」、名前「💬 1 La paella…」）、語の id は「charla-…」。
   *  例文＝そのセリフ（語を { } で囲む）、訳＝セリフの訳、ref＝「セリフ3」
   *  まちがえて送った語は「取り消す」でデッキから外せる（その語の育ち具合も消す）。
   *  参考書のデッキがないときは、CHARLA だけのデッキ「charla」に入れる。?sandbox は「charla-sandbox」だけ
   * ========================================================= */
  var wFrom = 'home', chosen = {};
  var SEC_PRE = 'charla-';
  function destDecks() {
    if (SANDBOX) return [{ id: DECK_ID, title: 'お試し（sandbox）', brand: '💬' }];
    var l = (window.VocabDecks ? VocabDecks.list() : []).filter(function (d) { return (d.lang || 'es') === 'es' && !/^charla/.test(d.id); });
    l.push({ id: DECK_ID, title: '会話で出会った単語（CHARLA だけのデッキ）', brand: '💬 CHARLA' });
    return l;
  }
  function destId() {
    var l = destDecks();
    return l.some(function (d) { return d.id === S.set.dest; }) ? S.set.dest : l[0].id;
  }
  function deckLabel(id) { var d = destDecks().filter(function (x) { return x.id === id; })[0]; return d ? (d.brand ? d.brand + ' ' : '') + d.title : id; }
  function getDeck(id) {
    try { var D2 = SANDBOX || id === DECK_ID ? JSON.parse(localStorage.getItem('vocab.deck.' + id)) : VocabDecks.get(id); if (D2) return D2; } catch (e) { /* */ }
    if (id === DECK_ID) return { id: DECK_ID, title: '会話で出会った単語', brand: '💬 CHARLA', sub: '会話で調べた語（ダイアログごとに区間）', book: '会話アプリ CHARLA', lang: 'es', skin: 'espana', sections: [], words: [] };
    return null;
  }
  function putDeck(D2) {
    /* ?sandbox はデッキの一覧（vocab.decks.v1）に載せない。vocab.html?deck=charla-sandbox では開ける */
    if (SANDBOX) localStorage.setItem('vocab.deck.' + D2.id, JSON.stringify(D2)); else VocabDecks.save(D2);
  }
  /* 送り先のデッキにもうある語（CHARLA から送った語は除く）＝ { 小文字の見出し語: true } */
  function destHas() {
    var have = {}, D2 = getDeck(destId());
    (D2 && D2.words || []).forEach(function (w) { if (String(w.id).indexOf(SEC_PRE) !== 0) have[String(w.w).toLowerCase()] = true; });
    return have;
  }
  /* 送ったかどうか：r.sent は { deck, wid }（前の版の true は「charla」へ送った扱い） */
  function sentTo(r) { return !r.sent ? null : r.sent === true ? { deck: 'charla', wid: '' } : r.sent; }
  function wordsScreen(from) {
    wFrom = from;
    show('words');
    $('#wMsg').innerHTML = '';
    var list = (window.CHARLA_DIALOGS || []);
    Promise.all(list.map(function (d) { return loadDialog(d.id).catch(function () { return null; }); })).then(function () {
      var other = destHas(), all = lookedList(), html = '', dl = destDecks(), cur = destId();
      chosen = {};
      $('#wDest').innerHTML = dl.map(function (d) { return '<option value="' + esc(d.id) + '"' + (d.id === cur ? ' selected' : '') + '>' + esc((d.brand ? d.brand + ' ' : '') + d.title) + '</option>'; }).join('');
      list.forEach(function (d) {
        var rs = all.filter(function (r) { return r.did === d.id; }).sort(function (a, b) { return a.line - b.line || a.at - b.at; });
        if (!rs.length) return;
        var c = cache[d.id];
        html += '<h3><span lang="es">' + esc(d.title) + '</span><small>' + esc(d.titleJa || '') + '</small></h3><ul class="wl">' + rs.map(function (r) {
          var id = r.did + '|' + r.key, conv = c ? T.toVocab(r, c.D, c.N) : { why: '読み込めない' };
          var st = sentTo(r);
          var also = !st && other[r.w.toLowerCase()];
          var can = !!conv.word && !st && !also;
          if (can) chosen[id] = true;
          return '<li class="' + (st ? 'sent' : '') + '"><label><input type="checkbox" data-id="' + esc(id) + '"' + (chosen[id] ? ' checked' : '') + (can ? '' : ' disabled') + '>' +
            '<span class="wt"><b lang="es">' + esc(r.w) + '</b>　' + esc(r.ja) +
            '<small>セリフ' + (r.line + 1) + '「<span lang="es">' + esc(snippet(c, r)) + '</span>」' + (r.n > 1 ? '・' + r.n + '回調べた' : '') + '</small>' +
            (st ? '<em>✔ ' + esc(deckLabel(st.deck)) + ' に送った</em>' : '') + (also ? '<em class="also">📗 送り先のデッキにもうある</em>' : '') + (conv.why && !st ? '<em class="why">送れない：' + esc(conv.why) + '</em>' : '') +
            '</span></label>' + (st ? '<button class="undo" data-undo="' + esc(id) + '">取り消す</button>' : '<button class="del" data-del="' + esc(id) + '" aria-label="記録から消す">✕</button>') + '</li>';
        }).join('') + '</ul>';
      });
      $('#wBody').innerHTML = html || '<p class="empty">まだありません。<br>台本の語をタップして意味を見ると、ここに記録されます。</p>';
      paintSend();
    });
  }
  function snippet(c, r) {
    if (!c) return r.surf;
    var t = c.D.lines[r.line] ? c.D.lines[r.line].text : '', at = t.toLowerCase().indexOf(String(r.surf).toLowerCase());
    if (at < 0) return r.surf;
    var a = Math.max(0, at - 18), b = Math.min(t.length, at + r.surf.length + 18);
    /* 語の途中で切らない */
    if (a > 0) { var sp = t.indexOf(' ', a); a = sp >= 0 && sp < at ? sp + 1 : a; }
    if (b < t.length) { var sp2 = t.lastIndexOf(' ', b); b = sp2 > at + r.surf.length ? sp2 : b; }
    return (a > 0 ? '…' : '') + t.slice(a, b) + (b < t.length ? '…' : '');
  }
  function paintSend() {
    var n = Object.keys(chosen).filter(function (k) { return chosen[k]; }).length;
    $('#wSend').textContent = '単語アプリへ送る（' + n + '語）';
    $('#wSend').disabled = !n;
  }
  $('#wBody').addEventListener('change', function (e) { var c = e.target.closest('input[data-id]'); if (c) { chosen[c.dataset.id] = c.checked; paintSend(); } });
  $('#wDest').addEventListener('change', function () { S.set.dest = this.value; save(); wordsScreen(wFrom); });
  $('#wBody').addEventListener('click', function (e) {
    var u = e.target.closest('[data-undo]'); if (u) { undoSend(u.dataset.undo); return; }
    var b = e.target.closest('[data-del]'); if (!b) return;
    var p = b.dataset.del.split('|');
    if (S.looked[p[0]]) { delete S.looked[p[0]][p[1]]; save(); }
    delete chosen[b.dataset.del];
    b.closest('li').remove();
    paintSend();
  });
  $('#wAll').addEventListener('click', function () { $$('#wBody input[data-id]:not(:disabled)').forEach(function (c) { c.checked = true; chosen[c.dataset.id] = true; }); paintSend(); });
  $('#wNone').addEventListener('click', function () { $$('#wBody input[data-id]').forEach(function (c) { c.checked = false; chosen[c.dataset.id] = false; }); paintSend(); });
  $('#wBack').addEventListener('click', function () { if (wFrom === 'play' && C) { show('play'); } else home(); });
  $('#wSend').addEventListener('click', sendToVocab);

  /* まちがえて送った語をデッキから外す（区間が空になれば区間も。その語の育ち具合も消す） */
  function undoSend(id) {
    var p = id.split('|'), r = S.looked[p[0]] && S.looked[p[0]][p[1]], st = r && sentTo(r);
    if (!st) return;
    var D2 = getDeck(st.deck), w = D2 && D2.words.filter(function (x) { return st.wid ? x.id === st.wid : String(x.w).toLowerCase() === String(r.w).toLowerCase() && String(x.s).indexOf(SEC_PRE) === 0; })[0];
    if (!w) { r.sent = false; save(); wordsScreen(wFrom); $('#wMsg').innerHTML = '<p>デッキにもうなかったので、送る前に戻しました。</p>'; return; }
    var pk = 'vocab.' + D2.id + '.v1', prog = null;
    try { prog = JSON.parse(localStorage.getItem(pk)); } catch (e) { /* */ }
    var grown = prog && prog.cards && prog.cards[w.id];
    if (grown && !confirm('「' + w.w + '」を「' + deckLabel(D2.id) + '」から外します。この語の育ち具合も消えます。')) return;
    D2.words = D2.words.filter(function (x) { return x !== w; });
    D2.sections = D2.sections.filter(function (s) { return String(s.id).indexOf(SEC_PRE) !== 0 || D2.words.some(function (x) { return x.s === s.id; }); });
    try {
      putDeck(D2);
      if (prog) {
        if (prog.cards) delete prog.cards[w.id];
        if (Array.isArray(prog.meet)) prog.meet = prog.meet.filter(function (x) { return (x && x.id || x) !== w.id; });
        localStorage.setItem(pk, JSON.stringify(prog));
      }
    } catch (e) { $('#wMsg').innerHTML = '<p class="bad">✖ 保存できませんでした</p>'; return; }
    r.sent = false; save();
    wordsScreen(wFrom);
    setTimeout(function () { $('#wMsg').innerHTML = '<p>「<span lang="es">' + esc(w.w) + '</span>」を ' + esc(deckLabel(D2.id)) + ' から外しました。</p>'; }, 0);
  }
  function sendToVocab() {
    if (!window.VocabDecks) return;
    var ids = Object.keys(chosen).filter(function (k) { return chosen[k]; });
    var deck = getDeck(destId());
    if (!deck) { $('#wMsg').innerHTML = '<p class="bad">✖ 送り先のデッキが見つかりません</p>'; return; }
    var added = [], skipped = [];
    ids.forEach(function (id) {
      var p = id.split('|'), r = S.looked[p[0]] && S.looked[p[0]][p[1]], c = cache[p[0]];
      if (!r || !c) return;
      var conv = T.toVocab(Object.assign({}, r), c.D, c.N);
      if (!conv.word) { skipped.push(r.w + '（' + conv.why + '）'); return; }
      var w = conv.word, sid = SEC_PRE + c.D.id;
      w.s = sid;
      w.id = SEC_PRE + w.id;
      if (!deck.sections.some(function (s) { return s.id === sid; })) deck.sections.push({ id: sid, name: '💬 ' + (c.d.no ? c.d.no + ' ' : '') + c.d.title + (c.d.titleJa ? '（' + c.d.titleJa + '）' : ''), ref: 'CHARLA' });
      var same = deck.words.filter(function (x) { return x.w.toLowerCase() === w.w.toLowerCase(); })[0];
      if (same) { skipped.push(w.w + '（もうデッキにある' + (same.ref ? '：' + same.ref : '') + '）'); return; }
      var base = w.id, k = 2;
      while (deck.words.some(function (x) { return x.id === w.id; })) w.id = base + '_' + (k++);
      if (w.pos === 'v' && w.cj && window.Conj && !Conj.checkIrr(w.cj).length) Conj.addIrr(w.w, w.cj);
      deck.words.push(w);
      added.push({ w: w, r: r });
    });
    if (!added.length) { $('#wMsg').innerHTML = '<p>送る語がありませんでした。' + (skipped.length ? '<br><small>' + esc(skipped.join('、')) + '</small>' : '') + '</p>'; save(); wordsScreen(wFrom); return; }
    var chk = window.DeckCheck ? DeckCheck.check(deck, window.Conj) : { errors: [] };
    if (chk.errors.length) { $('#wMsg').innerHTML = '<p class="bad">✖ 単語アプリの形に合いませんでした（' + chk.errors.length + '件）</p><ul>' + chk.errors.slice(0, 4).map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>'; return; }
    try { putDeck(deck); } catch (e) { $('#wMsg').innerHTML = '<p class="bad">✖ 保存できませんでした（端末の保存領域がいっぱい、またはプライベートブラウズ）</p>'; return; }
    added.forEach(function (x) { x.r.sent = { deck: deck.id, wid: x.w.id }; });
    save();
    var msg = '<p>✔ ' + added.length + '語を、単語アプリのデッキ「' + esc(deck.brand + ' ' + deck.title) + '」に足しました（全 ' + deck.words.length + '語）。' +
      (skipped.length ? '<br><small>送らなかった語：' + esc(skipped.join('、')) + '</small>' : '') + '</p>' +
      '<a class="go" href="vocab.html?deck=' + encodeURIComponent(deck.id) + '">単語アプリで開く ›</a>';
    wordsScreen(wFrom);
    setTimeout(function () { $('#wMsg').innerHTML = msg; }, 0);
  }

  /* ---------- はじめ ---------- */
  document.addEventListener('visibilitychange', function () { if (!document.hidden && !au.paused) { cancelAnimationFrame(P.raf); P.raf = requestAnimationFrame(loopRaf); } });
  var q = /[?&]d=([A-Za-z0-9-]+)/.exec(location.search);
  if (q) openDialog(q[1]); else home();
  window.CHARLA_DEBUG = { S: S, P: function () { return P; }, au: au };
})();
