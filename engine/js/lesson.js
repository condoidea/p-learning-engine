/* =========================================================
 * lesson.js — ロードマップとレッスンプレイヤー
 *  1画面＝1アイデア。説明 → 体験 → 確認 → 例題 → 自力 → まとめ
 * ========================================================= */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function S() { return Core.S; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  /* 数式（COURSE.math のとき）：$…$ を KaTeX で描画。COURSE.katexMacros でマクロ（色分けなど）を定義できる */
  var MATH = !!(window.COURSE && COURSE.math);
  var MACROS = (window.COURSE && COURSE.katexMacros) || {};
  function tex(s, display) {
    if (!window.katex) return esc(s);
    try { return katex.renderToString(s, { throwOnError: false, displayMode: !!display, macros: MACROS }); } catch (e) { return esc(s); }
  }
  function withMath(t, rest) {
    if (!MATH) return rest(t);
    return String(t == null ? '' : t).split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g).map(function (p, i) {
      if (!(i % 2)) return rest(p);
      return p.charAt(1) === '$' ? tex(p.slice(2, -2), true) : tex(p.slice(1, -1));
    }).join('');
  }
  /* 図（HTML）の中の $…$ も数式にする */
  function mviz(h) { return withMath(h, function (x) { return x; }); }
  /* 本文の書式：**太字** `等幅` [[用語]] [[用語|表示]] 改行（数式コースでは $…$ も） */
  function fmt(t) { return withMath(t, fmt0); }
  function fmt0(t) {
    return esc(t || '')
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[\[(.+?)(?:\|(.+?))?\]\]/g, function (m, term, label) { return '<button class="gl" data-t="' + term + '">' + (label || term) + '</button>'; })
      .replace(/\n/g, '<br>');
  }
  function allLessons() {
    var out = [];
    LE.units.forEach(function (u) { u.lessons.forEach(function (id) { out.push(LE.lessonDefs[id]); }); });
    return out;
  }
  function isDone(id) { var r = S().lessons[id]; return !!(r && r.done); }
  function isOpen(L) {
    var u = LE.units.find(function (x) { return x.id === L.unit; });
    var i = u.lessons.indexOf(L.id);
    return i === 0 || isDone(u.lessons[i - 1]);
  }
  function nextLesson() { return allLessons().find(function (L) { return !isDone(L.id) && isOpen(L); }) || null; }
  function lessonNo(L) { return allLessons().indexOf(L) + 1; }
  /* ロードマップ・カード・問題で共通の番号「ユニット-レッスン」 */
  function label(L) {
    var ui = LE.units.findIndex(function (u) { return u.id === L.unit; });
    return LE_UNO(ui + 1) + '-' + (LE.units[ui].lessons.indexOf(L.id) + 1);
  }

  /* =========================================================
   * ナビキャラ：既定はロボットのピコ。COURSE.mascot = {ico, name} で差し替え
   * ========================================================= */
  var MASCOT = (window.COURSE && COURSE.mascot) || null;
  function pico(mood) {
    if (MASCOT) return '<div class="pico mascot ' + (mood || '') + '" aria-hidden="true"><span class="ms-ico">' + MASCOT.ico + '</span>' + (MASCOT.name ? '<span class="ms-name">' + esc(MASCOT.name) + '</span>' : '') + '</div>';
    return '<div class="pico ' + (mood || '') + '" aria-hidden="true"><div class="pico-ant"></div><div class="pico-head"><i class="pe l"></i><i class="pe r"></i><i class="pm"></i></div></div>';
  }
  function setMood(m) {
    var p = $('#lsStage .pico'); if (!p) return;
    p.className = 'pico ' + (MASCOT ? 'mascot ' : '') + m;
    gsap.fromTo(p, { y: 0 }, { y: -10, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' });
  }

  /* =========================================================
   * ロードマップ
   * ========================================================= */
  function renderMap() {
    var box = $('#roadmap'); if (!box) return;
    var all = allLessons(), done = all.filter(function (L) { return isDone(L.id); }).length;
    var nx = nextLesson();
    stage(nx);
    $('#rmDone').textContent = done; $('#rmTotal').textContent = all.length;
    var C = 2 * Math.PI * 52, ring = $('#rmRing');
    ring.style.strokeDasharray = C;
    gsap.fromTo(ring, { strokeDashoffset: C }, { strokeDashoffset: C * (1 - done / Math.max(1, all.length)), duration: 1.2, ease: 'power3.out' });
    $('#rmLearned').textContent = Core.learnedCount();
    $('#rmNext').textContent = nx ? LE_T('lesson') + ' ' + label(nx) + '：' + nx.title : '全レッスン制覇！';

    box.innerHTML = '';
    LE.units.forEach(function (u, ui) {
      var ls = u.lessons.map(function (id) { return LE.lessonDefs[id]; });
      if (!ls.length) return;
      var ud = ls.filter(function (L) { return isDone(L.id); }).length;
      var sec = document.createElement('section');
      sec.className = 'unit' + (ud === ls.length ? ' clear' : '');
      sec.style.setProperty('--c', u.color);
      sec.innerHTML = '<div class="unit-head glass"><span class="unit-ico">' + esc(u.icon) + '</span><div><small>' + LE_T('unit') + ' ' + LE_UNO(ui + 1) + '</small><h3>' + esc(u.name) + '</h3><p>' + esc(u.desc) + '</p></div>' +
        '<div class="unit-prog"><b>' + ud + '</b>/' + ls.length + '</div></div><div class="unit-path"><svg class="unit-line"></svg></div>';
      var path = sec.querySelector('.unit-path');
      ls.forEach(function (L, i) {
        var st = isDone(L.id) ? 'done' : isOpen(L) ? 'open' : 'locked';
        if (nx && nx.id === L.id) st += ' next';
        var stars = (S().lessons[L.id] && S().lessons[L.id].stars) || 0;
        var n = document.createElement('button');
        n.className = 'node ' + st;
        n.style.setProperty('--off', Math.round(Math.sin(i * 1.15) * 34) + '%');
        n.dataset.id = L.id;
        n.innerHTML = '<span class="node-disc">' + (st.indexOf('done') === 0 ? '✓' : st.indexOf('locked') === 0 ? '🔒' : label(L)) + '</span>' +
          '<span class="node-stars">' + [1, 2, 3].map(function (k) { return '<i class="' + (k <= stars ? 'on' : '') + '">★</i>'; }).join('') + '</span>' +
          '<span class="node-label">' + (L.year ? '<em class="node-year">' + esc(L.year) + '</em>' : '') + esc(L.title) + '</span>' + (nx && nx.id === L.id ? '<span class="node-start">START</span>' : '');
        n.addEventListener('click', function () { preview(L); });
        path.appendChild(n);
      });
      /* ユニットボス */
      var cleared = Core.unitCleared(u.id), beaten = !!S().bosses[u.id];
      var bi = LE.bosses[u.id] || { name: LE_T('bossEn'), ico: '👾' };
      var bn = document.createElement('button');
      bn.className = 'node boss-node ' + (beaten ? 'done' : cleared ? 'open' : 'locked');
      bn.dataset.id = 'boss-' + u.id;
      bn.style.setProperty('--off', '0%');
      bn.innerHTML = '<span class="node-disc">' + (cleared ? bi.ico : '🔒') + '</span>' +
        '<span class="node-stars">' + (beaten ? '<i class="on">👑</i>' : '') + '</span>' +
        '<span class="node-label">' + (cleared ? LE_T('bossEn') + '：' + esc(bi.name) : LE_T('bossEn') + '：？？？') + '</span>' + (cleared && !beaten ? '<span class="node-start boss">' + LE_T('bossEn') + '</span>' : '');
      bn.addEventListener('click', function () { bossPreview(u, ui); });
      path.appendChild(bn);
      if (ud === ls.length) sec.querySelector('.unit-head').insertAdjacentHTML('beforeend', '<span class="unit-stamp">' + (beaten ? '👑 MASTER' : 'CLEAR') + '</span>');
      box.appendChild(sec);
    });
    requestAnimationFrame(drawLines);
    var fresh = [];
    $$('.node', box).forEach(function (n) {
      var key = n.dataset.id;
      var openNow = !n.classList.contains('locked');
      if (openNow && !S().revealed[key]) { fresh.push(n); S().revealed[key] = Date.now(); }
    });
    gsap.from($$('.node', box).filter(function (n) { return fresh.indexOf(n) < 0; }), { scale: 0, opacity: 0, duration: 0.5, stagger: 0.02, ease: 'back.out(2.2)', clearProps: 'transform,opacity' });
    var nn = $('.node.next', box) || $('.boss-node.open', box);
    if (nn) {
      gsap.to($('.node-disc', nn), { scale: 1.08, repeat: -1, yoyo: true, duration: 0.7, ease: 'sine.inOut' });
      setTimeout(function () { var r = nn.getBoundingClientRect(); if (r.top > window.innerHeight * 0.8 || r.top < 0) window.scrollTo({ top: window.scrollY + r.top - window.innerHeight * 0.45, behavior: 'smooth' }); }, 400);
    }
    /* 新しく開いたノードの開放演出（最初の1つ目を除く） */
    var isFirstEver = Object.keys(S().revealed).length === fresh.length;
    if (fresh.length && !isFirstEver) { gsap.set(fresh, { opacity: 0 }); setTimeout(function () { revealNodes(fresh); }, 900); }
    else fresh.forEach(function (n) { gsap.set(n, { clearProps: 'all' }); });
    /* ユニットクリアのスタンプ演出 */
    $$('.unit-stamp', box).forEach(function (st) {
      var u = st.closest('.unit'), key = 'clear-' + st.textContent;
      var k2 = 'stamp-' + [].indexOf.call($$('.unit', box), u) + st.textContent;
      if (!S().revealed[k2]) {
        S().revealed[k2] = Date.now();
        gsap.fromTo(st, { scale: 4, opacity: 0, rotate: -40 }, { scale: 1, opacity: 1, rotate: -10, duration: 0.6, ease: 'back.out(2.5)', delay: 1.2, onStart: function () { Sfx.crit(); FX.shake(8); } });
      }
    });
    Core.save();
  }
  function revealNodes(list) {
    list.forEach(function (n, i) {
      var disc = $('.node-disc', n);
      gsap.fromTo(n, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'elastic.out(1,0.45)', delay: i * 0.35,
        onStart: function () {
          var r = disc.getBoundingClientRect();
          FX.burst(r.left + r.width / 2, r.top + r.height / 2, { n: 60, speed: 10 });
          FX.floatText(r.left + r.width / 2, r.top - 10, n.classList.contains('boss-node') ? LE_T('bossEn') + ' 出現！' : 'UNLOCK!', 'crit');
          Sfx.chestOpen(n.classList.contains('boss-node') ? 'epic' : 'rare');
          FX3D.pulse(2);
        }, clearProps: 'transform,opacity' });
    });
  }
  function bossPreview(u, ui) {
    var cleared = Core.unitCleared(u.id), beaten = !!S().bosses[u.id];
    var bi = LE.bosses[u.id] || { name: LE_T('bossEn'), ico: '👾' };
    var n = 0; u.lessons.forEach(function (lid) { n += (LE.lessonDefs[lid].q || []).length; });
    var qn = Math.min(12, n), hp = Math.max(3, Math.ceil(qn * 0.7));
    var pv = $('#lessonPreview');
    pv.style.setProperty('--c', '#ff4d6d');
    pv.innerHTML = '<div class="pv-card glass boss-pv"><small>' + LE_T('unit') + ' ' + LE_UNO(ui + 1) + ' ／ ' + esc(u.name) + '</small>' +
      '<div class="pv-boss-ico">' + (cleared ? bi.ico : '🔒') + '</div><h3>' + (cleared ? esc(bi.name) : '？？？') + '</h3>' +
      '<p class="pv-goal">' + (cleared ? 'ユニット全体から <b>' + qn + '問</b> をシャッフル出題。<b>' + hp + '回</b> 正解すれば撃破！ 範囲を混ぜて解くことで、本番の「どの知識を使う問題か見抜く力」が鍛えられる。' : 'このユニットのレッスンを全部クリアすると出現する。') + '</p>' +
      (beaten ? '<p class="pv-goal">👑 撃破済み。再戦すると復習になるよ。</p>' : '') +
      '<div class="pv-meta"><span>🎁 初撃破でレア宝箱確定</span><span>⚔ 間違えてもペナルティなし</span></div>' +
      (cleared ? '<button class="btn-mega pv-go boss-go"><span class="mega-label">' + LE_T('fight') + '</span><span class="mega-sub">' + (beaten ? '再戦する' : LE_T('boss') + 'に挑む') + '</span></button>' : '') +
      '<button class="btn-ghost pv-close">とじる</button></div>';
    pv.classList.add('show');
    gsap.fromTo(pv, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    gsap.fromTo('.pv-card', { y: 60, scale: 0.9 }, { y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.8)' });
    if (cleared) gsap.fromTo('.pv-boss-ico', { scale: 0.3, rotate: -20 }, { scale: 1, rotate: 0, duration: 0.8, ease: 'elastic.out(1,0.4)', delay: 0.2 });
    Sfx.tap();
    var close = function () { gsap.to(pv, { opacity: 0, duration: 0.2, onComplete: function () { pv.classList.remove('show'); } }); };
    $('.pv-close', pv).addEventListener('click', close);
    pv.onclick = function (e) { if (e.target === pv) close(); };
    var go = $('.pv-go', pv); if (go) go.addEventListener('click', function () { close(); setTimeout(function () { UI.startSet('boss', u.id); }, 250); });
  }
  function drawLines() {
    $$('.unit-path').forEach(function (p) {
      var svg = $('.unit-line', p), nodes = $$('.node-disc', p);
      if (!nodes.length) return;
      var pr = p.getBoundingClientRect();
      svg.setAttribute('width', pr.width); svg.setAttribute('height', pr.height);
      var d = '', dd = '';
      nodes.forEach(function (n, i) {
        var r = n.getBoundingClientRect();
        var x = r.left - pr.left + r.width / 2, y = r.top - pr.top + r.height / 2;
        d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
        if (n.parentNode.classList.contains('done')) dd = d;
      });
      svg.innerHTML = '<path class="ul-bg" d="' + d + '"/>' + (dd ? '<path class="ul-done" d="' + dd + '"/>' : '');
      var pd = $('.ul-done', svg);
      if (pd) { var L = pd.getTotalLength(); gsap.fromTo(pd, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }); }
    });
  }
  window.addEventListener('resize', function () { if ($('#roadmap') && $('#roadmap').offsetParent) drawLines(); });

  function preview(L) {
    var open = isOpen(L), done = isDone(L.id);
    var pv = $('#lessonPreview');
    var u = LE.units.find(function (x) { return x.id === L.unit; });
    pv.style.setProperty('--c', u.color);
    var nSteps = L.steps.length, nInt = L.steps.filter(function (s) { return INTERACTIVE[s.t]; }).length;
    pv.innerHTML = '<div class="pv-card glass"><small>' + LE_T('unit') + ' ' + LE_UNO(LE.units.indexOf(u) + 1) + ' ' + esc(u.name) + ' ／ ' + LE_T('lesson') + ' ' + label(L) + '</small>' + (L.year ? '<span class="pv-year">' + esc(L.year) + '</span>' : '') + '<h3>' + esc(L.title) + '</h3>' +
      '<p class="pv-goal">🎯 ' + esc(L.goal || '') + '</p>' +
      '<div class="pv-meta"><span>⏱ 約' + Math.max(3, Math.round(nSteps * 0.5)) + '分</span><span>🧩 体験・確認 ' + nInt + '問</span><span>🔓 解放される問題 ' + L.q.length + '問</span></div>' +
      (open ? '<button class="btn-mega pv-go"><span class="mega-label">' + (done ? 'REPLAY' : 'START') + '</span><span class="mega-sub">' + (done ? 'もう一度学ぶ' : 'レッスンをはじめる') + '</span></button>' : '<p class="pv-lock">🔒 前のレッスンをクリアすると開放されます</p>') +
      (done && L.q.length ? '<button class="btn-ghost pv-prac">⚔ このレッスンの問題を解く（' + L.q.length + '問）</button>' : '') +
      (done ? '<button class="btn-ghost pv-card-open">📇 ' + LE_T('card') + 'を見る</button>' : '<p class="pv-cardnote">📇 クリアすると、このレッスンの' + LE_T('card') + 'が手に入る</p>') +
      '<button class="btn-ghost pv-close">とじる</button></div>';
    pv.classList.add('show');
    gsap.fromTo(pv, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    gsap.fromTo('.pv-card', { y: 60, scale: 0.9 }, { y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.8)' });
    Sfx.tap();
    var close = function () { gsap.to(pv, { opacity: 0, duration: 0.2, onComplete: function () { pv.classList.remove('show'); } }); };
    $('.pv-close', pv).addEventListener('click', close);
    pv.onclick = function (e) { if (e.target === pv) close(); };
    var go = $('.pv-go', pv); if (go) go.addEventListener('click', function () { close(); start(L.id); });
    var pr = $('.pv-prac', pv); if (pr) pr.addEventListener('click', function () { close(); UI.startSet('lesson', L.id); });
    var pc = $('.pv-card-open', pv); if (pc) pc.addEventListener('click', function () { close(); setTimeout(function () { UI.openCard(L.id); }, 220); });
  }

  /* =========================================================
   * レッスンプレイヤー
   * ========================================================= */
  var INTERACTIVE = { quiz: 1, bits: 1, gate: 1, order: 1, match: 1, num: 1, stack: 1, timeline: 1, decide: 1, advise: 1, route: 1, fill: 1, widget: 1, build: 1 };
  /* 背景が地図のコースでは、レッスンの舞台（L.place / ユニットの舞台）へ地図を動かす */
  function stage(L) {
    if (!L || !window.FX3D || !FX3D.focus) return;
    if (L.place) FX3D.focus(L.place, L.zoom); else if (FX3D.focusUnit) FX3D.focusUnit(L.unit);
  }
  var P = null;
  function start(id) {
    Sfx.unlock();
    var L = LE.lessonDefs[id];
    P = { L: L, i: 0, xp: 0, first: {}, combo: 0, ready: false, startAt: Date.now() };
    stage(L);
    UI.go('lesson');
    setTimeout(function () { renderStep(true); }, 350);
  }
  function progress() {
    var pct = (P.i / P.L.steps.length) * 100;
    gsap.to('#lsBar', { width: pct + '%', duration: 0.5, ease: 'power3.out' });
    $('#lsCount').textContent = (P.i + 1) + ' / ' + P.L.steps.length;
  }
  function setReady(on, label) {
    P.ready = on;
    var b = $('#lsGo');
    b.disabled = !on;
    b.textContent = label || (P.i === P.L.steps.length - 1 ? 'レッスン完了！' : 'つづける');
    if (on) gsap.fromTo(b, { scale: 0.92 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
  }
  function feedback(kind, html) {
    var fb = $('#lsFb');
    if (!kind) { fb.className = 'ls-fb'; fb.innerHTML = ''; return; }
    fb.className = 'ls-fb show ' + kind;
    fb.innerHTML = html;
    gsap.fromTo(fb, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'back.out(2)' });
  }
  function gain(n, x, y) {
    P.xp += n;
    $('#lsXp').textContent = P.xp;
    gsap.fromTo('.ls-xp', { scale: 1.4 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    if (x != null) FX.floatText(x, y, '+' + n + ' XP');
  }
  function centerOf(el) { var r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
  /* 体験・確認ステップの成否を記録して演出 */
  function solved(el, firstTry, msg, title) {
    var c = el ? centerOf(el) : [window.innerWidth / 2, window.innerHeight / 2];
    if (P.first[P.i] === undefined) P.first[P.i] = firstTry;
    if (firstTry) {
      P.combo++;
      if (P.combo === 5 && !P.zone) zoneIn();
      gain(Math.round((6 + Math.min(P.combo, 5)) * (P.zone ? 1.5 : 1)), c[0], c[1] - 20);
      FX.burst(c[0], c[1], { n: 30 + P.combo * 6, speed: 8 });
      Sfx.correct(P.combo);
      FX3D.pulse(1 + P.combo / 5);
      if (P.combo >= 3) { var cb = $('#lsCombo'); cb.textContent = P.combo + '連続正解！'; gsap.fromTo(cb, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }); gsap.to(cb, { opacity: 0, delay: 1.4, duration: 0.4 }); }
    } else {
      zoneOut();
      P.combo = 0;
      gain(2, c[0], c[1] - 20);
      Sfx.correct(0);
      FX3D.pulse(0.6);
    }
    setMood('happy');
    feedback('ok', '<b>' + (title || (firstTry ? pick(['正解！', 'ばっちり！', 'その通り！', 'ナイス！']) : 'できた！')) + '</b>' + (msg ? '<p>' + fmt(msg) + '</p>' : ''));
    setReady(true);
  }
  function zoneIn() {
    P.zone = true;
    S().stats.zones++;
    document.body.classList.add('zone');
    FX.slam('ZONE', '一発正解×5 ／ 獲得XP ×1.5', '#5cff9d');
    Sfx.combo(10); FX3D.fever(true);
  }
  function zoneOut() {
    if (!P || !P.zone) return;
    P.zone = false;
    document.body.classList.remove('zone');
    FX3D.fever(false);
  }
  function missed(msg) {
    zoneOut();
    P.combo = 0;
    if (P.first[P.i] === undefined) P.first[P.i] = false;
    Sfx.wrong();
    FX.shake(5);
    setMood('sad');
    feedback('ng', '<b>おしい！</b><p>' + fmt(msg || 'もう一度考えてみよう。') + '</p>');
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  function renderStep(first) {
    var s = P.L.steps[P.i];
    var st = $('#lsStage');
    feedback(null);
    progress();
    setReady(false);
    var html = '<div class="ls-step t-' + s.t + '">';
    var bubble = s.t === 'show' ? (s.frames[0].say || '') : s.t === 'say' ? s.text : s.t === 'term' ? 'あたらしい用語だよ！' : s.t === 'recap' ? (window.COURSE && COURSE.recapTap ? 'まとめ！ 思い出せるかな？' : 'ここまでのまとめ！') : s.text || s.q;
    if (s.t !== 'quiz') html += '<div class="ls-talk">' + pico(s.t === 'recap' ? 'happy' : '') + '<div class="bubble' + (/^[*\s]*[0-9０-９]/.test(bubble || '') ? ' num-start' : '') + '">' + fmt(bubble) + '</div></div>';
    html += '<div class="ls-body"></div></div>';
    st.innerHTML = html;
    var body = $('.ls-body', st);
    (STEP[s.t] || STEP.say)(s, body);
    if (s.art && LE.art && LE.art[s.art]) {
      body.insertAdjacentHTML('afterbegin', '<figure class="ls-art">' + LE.art[s.art] + (s.cap ? '<figcaption>' + fmt(s.cap) + '</figcaption>' : '') + '</figure>');
      inkDraw($('.ls-art svg', body));
    }
    if (s.place && window.FX3D && FX3D.focus) FX3D.focus(s.place, s.zoom);
    var stepEl = $('.ls-step', st);
    gsap.fromTo(stepEl, { opacity: 0, x: first ? 0 : 60 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' });
    gsap.from($$('.bubble, .ls-body > *', st), { opacity: 0, y: 16, duration: 0.4, stagger: 0.08, delay: 0.1, ease: 'power3.out', clearProps: 'opacity,transform' });
    var vz = $$('.vz-anim > *', st);
    if (vz.length) gsap.from(vz, { opacity: 0, y: 14, scale: 0.9, duration: 0.45, stagger: 0.12, delay: 0.35, ease: 'back.out(1.8)', clearProps: 'opacity,transform' });
    st.scrollTop = 0;
    window.scrollTo(0, 0);
  }
  function next() {
    if (!P || !P.ready) return;
    var s = P.L.steps[P.i];
    if (!INTERACTIVE[s.t] && P.first[P.i] === undefined) { P.first[P.i] = null; gain(2); }
    Core.today().steps = (Core.today().steps || 0) + 1;
    if (Core.touchStreak()) { FX.toast('🔥', 'ストリーク ' + S().streak.count + '日！', '今日の記録を確保した'); UI.renderTop(true); }
    Sfx.tap();
    if (P.i >= P.L.steps.length - 1) { finish(); return; }
    var stepEl = $('#lsStage .ls-step');
    gsap.to(stepEl, { opacity: 0, x: -60, duration: 0.22, ease: 'power2.in', onComplete: function () { P.i++; renderStep(false); } });
  }

  /* =========================================================
   * ステップ描画
   * ========================================================= */
  var STEP = {};
  STEP.say = function (s, body) {
    if (s.viz) body.innerHTML = '<div class="vz vz-anim">' + mviz(s.viz) + '</div>';
    if (s.ask) { askBlock(body, s.ask, function (r) { revealInto(r, s.reveal, s.rviz); setReady(true); }); return; }
    setReady(true);
  };
  STEP.term = function (s, body) {
    body.innerHTML = '<div class="term-card"><span class="term-stamp">用語GET</span><small>' + esc(s.yomi || '') + '</small><h2>' + esc(s.word) + '</h2>' +
      '<p class="term-short">' + fmt(s.short) + '</p>' + (s.ex ? '<p class="term-ex"><span>たとえるなら</span>' + fmt(s.ex) + '</p>' : '') + '</div>' +
      (s.viz ? '<div class="vz vz-anim">' + mviz(s.viz) + '</div>' : '');
    var tc = $('.term-card', body);
    gsap.fromTo(tc, { rotateY: 90 }, { rotateY: 0, duration: 0.6, ease: 'back.out(1.6)', delay: 0.15 });
    gsap.fromTo($('.term-stamp', body), { scale: 3, opacity: 0, rotate: -40 }, { scale: 1, opacity: 1, rotate: -12, duration: 0.4, delay: 0.6, ease: 'back.out(3)', onStart: function () { Sfx.coin(); } });
    setReady(true);
  };
  STEP.recap = function (s, body) {
    if (window.COURSE && COURSE.recapTap) { recapTap(s, body); return; }
    body.innerHTML = '<ul class="recap">' + s.points.map(function (p) { return '<li><i>✔</i><span>' + fmt(p) + '</span></li>'; }).join('') + '</ul>';
    gsap.from($$('.recap li', body), { x: -30, opacity: 0, stagger: 0.12, duration: 0.4, delay: 0.3, ease: 'back.out(2)', onComplete: function () { } });
    setReady(true);
  };
  STEP.quiz = function (s, body) {
    var correct = s.a != null ? s.a : 0;
    var order = s.o.map(function (_, i) { return i; });
    if (!s.ns) Core.shuffle(order);
    var tried = 0;
    body.innerHTML = '<div class="ls-talk">' + pico('think') + '<div class="bubble q">' + fmt(s.q) + '</div></div>' +
      (s.viz ? '<div class="vz vz-anim">' + mviz(s.viz) + '</div>' : '') +
      (s.code ? '<pre class="q-code">' + esc(s.code) + '</pre>' : '') +
      '<div class="ls-opts">' + order.map(function (oi, k) { return '<button class="ls-opt" data-i="' + oi + '"><span class="ck">' + 'ABCDEF'[k] + '</span><span>' + fmt(s.o[oi]) + '</span></button>'; }).join('') + '</div>' +
      (s.hint ? '<button class="ls-hint">💡 ヒントを見る</button>' : '');
    var hb = $('.ls-hint', body);
    if (hb) hb.addEventListener('click', function () { hb.outerHTML = '<p class="ls-hint-text">💡 ' + fmt(s.hint) + '</p>'; Sfx.tap(); });
    $$('.ls-opt', body).forEach(function (b) {
      b.addEventListener('click', function () {
        if (P.ready || b.disabled) return;
        var i = +b.dataset.i;
        tried++;
        if (i === correct) {
          b.classList.add('right');
          $$('.ls-opt', body).forEach(function (x) { x.disabled = true; });
          solved(b, tried === 1, s.why && s.why[correct]);
        } else {
          b.classList.add('wrong'); b.disabled = true;
          gsap.fromTo(b, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1.5,0.3)' });
          missed((s.why && s.why[i]) || s.hint || 'ちがうみたい。もう一度！');
        }
      });
    });
  };
  STEP.bits = function (s, body) {
    var n = s.n || 4, bits = [];
    for (var i = 0; i < n; i++) bits.push(0);
    body.innerHTML = '<div class="bits-wrap"><div class="bits">' + bits.map(function (_, i) {
      var w = Math.pow(2, n - 1 - i);
      return '<button class="bit" data-i="' + i + '"><b>0</b><small>' + w + '</small></button>';
    }).join('') + '</div><div class="bits-out"><div class="bo-sum" id="boSum">0</div><div class="bo-val"><span>10進数</span><b id="boDec">0</b>' + (s.hex ? '<span>16進数</span><b id="boHex">0</b>' : '') + '</div></div>' +
      (s.target != null ? '<p class="bits-goal">🎯 <b>' + s.target + '</b> を作ろう</p>' : '') + '</div>';
    if (s.target == null) setReady(true);
    var done = false;
    $$('.bit', body).forEach(function (b) {
      b.addEventListener('click', function () {
        if (done) return;
        var i = +b.dataset.i;
        bits[i] ^= 1;
        b.classList.toggle('on', !!bits[i]);
        $('b', b).textContent = bits[i];
        gsap.fromTo(b, { scale: 0.85 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' });
        Sfx.tap();
        var val = 0, parts = [];
        bits.forEach(function (v, k) { var w = Math.pow(2, n - 1 - k); if (v) { val += w; parts.push(w); } });
        $('#boSum').textContent = parts.length ? parts.join(' + ') + ' = ' + val : '0';
        $('#boDec').textContent = val;
        if (s.hex) $('#boHex').textContent = val.toString(16).toUpperCase();
        if (s.target != null && val === s.target) { done = true; solved($('.bits', body), true, s.ok); }
      });
    });
  };
  var GATES = {
    AND: function (a, b) { return a & b; }, OR: function (a, b) { return a | b; }, XOR: function (a, b) { return a ^ b; },
    NAND: function (a, b) { return 1 - (a & b); }, NOR: function (a, b) { return 1 - (a | b); }
  };
  STEP.gate = function (s, body) {
    var A = 0, B = 0, seen = {}, f = GATES[s.op];
    body.innerHTML = '<div class="gate-wrap"><div class="gate-ins"><button class="sw" data-k="A">A<b>0</b></button><button class="sw" data-k="B">B<b>0</b></button></div>' +
      '<div class="gate-box">' + s.op + '</div><div class="lamp"><i></i><b>0</b></div></div>' +
      '<table class="gate-tbl"><tr><th>A</th><th>B</th><th>出力</th></tr>' + [[0, 0], [0, 1], [1, 0], [1, 1]].map(function (p) { return '<tr data-k="' + p.join('') + '"><td>' + p[0] + '</td><td>' + p[1] + '</td><td>?</td></tr>'; }).join('') + '</table>' +
      '<p class="bits-goal">🎯 4通りぜんぶ試して表を埋めよう</p>';
    function upd() {
      var o = f(A, B);
      $('.lamp', body).classList.toggle('on', !!o);
      $('.lamp b', body).textContent = o;
      var k = '' + A + B, row = $('tr[data-k="' + k + '"]', body);
      row.lastChild.textContent = o; row.classList.add('seen', o ? 'one' : 'zero');
      gsap.fromTo(row, { backgroundColor: 'rgba(255,255,255,.25)' }, { backgroundColor: 'rgba(255,255,255,0)', duration: 0.6 });
      seen[k] = 1;
      if (Object.keys(seen).length === 4 && !P.ready) solved($('.gate-tbl', body), true, s.ok);
    }
    $$('.sw', body).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.k === 'A') A ^= 1; else B ^= 1;
        b.classList.toggle('on', b.dataset.k === 'A' ? !!A : !!B);
        $('b', b).textContent = b.dataset.k === 'A' ? A : B;
        Sfx.tap(); upd();
      });
    });
    upd();
  };
  STEP.order = function (s, body) {
    var pool = Core.shuffle(s.items.map(function (t, i) { return i; }));
    if (pool.every(function (v, i) { return v === i; })) pool.reverse();
    var ans = [], tries = 0;
    body.innerHTML = '<div class="ord-ans"></div><div class="ord-pool"></div><button class="btn-primary ord-check" disabled>チェック</button>';
    var ansEl = $('.ord-ans', body), poolEl = $('.ord-pool', body), chk = $('.ord-check', body);
    function draw() {
      ansEl.innerHTML = ans.length ? ans.map(function (i, k) { return '<button class="chipb a" data-i="' + i + '"><em>' + (k + 1) + '</em>' + fmt(s.items[i]) + '</button>'; }).join('') : '<span class="ord-ph">下の項目を正しい順にタップ</span>';
      poolEl.innerHTML = pool.map(function (i) { return '<button class="chipb" data-i="' + i + '">' + fmt(s.items[i]) + '</button>'; }).join('');
      chk.disabled = pool.length > 0;
      $$('.chipb', poolEl).forEach(function (b) { b.addEventListener('click', function () { if (P.ready) return; var i = +b.dataset.i; pool.splice(pool.indexOf(i), 1); ans.push(i); Sfx.tap(); draw(); }); });
      $$('.chipb', ansEl).forEach(function (b) { b.addEventListener('click', function () { if (P.ready) return; var i = +b.dataset.i; ans.splice(ans.indexOf(i), 1); pool.push(i); draw(); }); });
    }
    chk.addEventListener('click', function () {
      tries++;
      var bad = ans.map(function (v, k) { return v !== k; });
      if (!bad.some(Boolean)) {
        $$('.chipb', ansEl).forEach(function (b) { b.classList.add('ok'); });
        chk.style.display = 'none';
        solved(ansEl, tries === 1, s.ok);
      } else {
        $$('.chipb', ansEl).forEach(function (b, k) { if (bad[k]) b.classList.add('bad'); else b.classList.add('ok'); });
        missed(s.hint || '赤い項目の位置がちがうよ。赤をタップして戻し、並べ直そう。');
        setTimeout(function () { /* 間違った項目だけプールへ戻す */
          var keep = []; ans.forEach(function (v, k) { if (!bad[k] && keep.length === k) keep.push(v); });
          ans.slice(keep.length).forEach(function (v) { pool.push(v); });
          ans = keep; draw();
        }, 1100);
      }
    });
    draw();
  };
  /* 年表：出来事を古い順にタップ。正しければ年表に年号つきで刻まれる（1手ごとに即フィードバック） */
  STEP.timeline = function (s, body) {
    var items = s.items.map(function (it, i) { return { i: i, y: it.y, t: it.t, label: it.label || String(it.y) }; });
    var sorted = items.slice().sort(function (a, b) { return a.y - b.y; });
    var pool = Core.shuffle(items.slice());
    if (pool.every(function (v, i) { return v === sorted[i]; })) pool.reverse();
    var k = 0, miss = 0;
    body.innerHTML = '<div class="tl-wrap"><div class="tl-track"></div><div class="tl-pool">' +
      pool.map(function (it) { return '<button class="chipb tl-chip" data-i="' + it.i + '">' + fmt(it.t) + '</button>'; }).join('') + '</div>' +
      '<p class="bits-goal">🎯 ' + esc(s.goal || 'いちばん古い出来事から順にタップ') + '</p></div>';
    var track = $('.tl-track', body);
    $$('.tl-chip', body).forEach(function (b) {
      b.addEventListener('click', function () {
        if (P.ready || b.disabled) return;
        var it = items[+b.dataset.i];
        if (it === sorted[k] || it.y === sorted[k].y) {
          var idx = sorted.indexOf(it); if (idx !== k) { sorted[idx] = sorted[k]; sorted[k] = it; }
          k++;
          b.disabled = true;
          gsap.to(b, { scale: 0.6, opacity: 0, duration: 0.25, onComplete: function () { b.style.display = 'none'; } });
          var row = document.createElement('div');
          row.className = 'tl-row';
          row.innerHTML = '<span class="tl-y">' + esc(it.label) + '</span><span class="tl-dot"></span><span class="tl-t">' + fmt(it.t) + '</span>';
          track.appendChild(row);
          gsap.from(row, { x: -30, opacity: 0, duration: 0.45, ease: 'back.out(2)' });
          gsap.from($('.tl-y', row), { scale: 2.2, duration: 0.5, ease: 'back.out(3)' });
          Sfx.correct(k);
          var c = centerOf(row); FX.burst(c[0] - 60, c[1], { n: 14, speed: 4 });
          if (k === items.length) solved(track, miss === 0, s.ok);
        } else {
          miss++;
          b.classList.add('bad'); setTimeout(function () { b.classList.remove('bad'); }, 500);
          gsap.fromTo(b, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1.5,0.3)' });
          missed(s.hint || 'それより前に起きた出来事が残っているよ。');
        }
      });
    });
  };
  /* =========================================================
   * 挿絵：線画を「ペンで描くように」表示する（ストロークのアニメーション）
   * ========================================================= */
  function inkDraw(svg) {
    if (!svg || !window.gsap) return;
    var els = $$('path, line, polyline, polygon, circle, ellipse, rect', svg);
    els.forEach(function (el, i) {
      var len = 0;
      try { len = el.getTotalLength ? el.getTotalLength() : 0; } catch (e) { len = 0; }
      if (!len) return;
      el.style.strokeDasharray = len + ' ' + len;
      el.style.strokeDashoffset = len;
      el.style.fillOpacity = 0;
      gsap.to(el, { strokeDashoffset: 0, duration: Math.min(1.1, 0.25 + len / 260), delay: 0.15 + i * 0.045, ease: 'power1.inOut' });
      gsap.to(el, { fillOpacity: 1, duration: 0.5, delay: 0.6 + i * 0.045, clearProps: 'fillOpacity' });
    });
  }

  /* =========================================================
   * 決断（RPG）：その人物になって選ぶ → 選んだ道の結末 → 史実
   *  {t:'decide', role, ico, text, q, o:[{t, r, hist:true}]}
   *  「予想してから答え合わせ」は記憶に残りやすい（予測・生成効果）
   * ========================================================= */
  STEP.decide = function (s, body) {
    var order = Core.shuffle(s.o.map(function (_, i) { return i; }));
    var h = s.o.findIndex(function (o) { return o.hist; });
    body.innerHTML = '<div class="rpg"><div class="rpg-head"><span class="rpg-ico">' + (s.ico || '👑') + '</span><div><small>あなたは</small><b>' + esc(s.role || '') + '</b></div></div>' +
      '<p class="rpg-q">' + fmt(s.q || 'どうする？') + '</p>' +
      '<div class="rpg-cmd">' + order.map(function (i) { return '<button class="rpg-opt" data-i="' + i + '"><i>▶</i><span>' + fmt(s.o[i].t) + '</span></button>'; }).join('') + '</div><div class="rpg-res"></div></div>';
    var res = $('.rpg-res', body);
    $$('.rpg-opt', body).forEach(function (b) {
      b.addEventListener('click', function () {
        if (P.ready) return;
        var i = +b.dataset.i, c = s.o[i];
        $$('.rpg-opt', body).forEach(function (x) { x.disabled = true; if (+x.dataset.i === h) x.classList.add('hist'); });
        b.classList.add('pick');
        var html = '<div class="rpg-card you"><small>' + (c.hist ? '📜 あなたの選択＝史実' : 'あなたの選択の行方') + '</small><p>' + fmt(c.r) + '</p></div>';
        if (!c.hist && h >= 0) html += '<div class="rpg-card hist"><small>📜 史実では</small><b>' + fmt(s.o[h].t) + '</b><p>' + fmt(s.o[h].r.replace(/^史実どおり。/, '')) + '</p></div>';
        res.innerHTML = html;
        gsap.from($$('.rpg-card', res), { y: 20, opacity: 0, duration: 0.45, stagger: 0.35, ease: 'back.out(2)', clearProps: 'opacity,transform' });
        if (c.hist) solved(b, true, s.ok, pick(['史実どおり！', '名君の判断！', '歴史が動いた！']));
        else { solved(b, false, s.ok, '史実は別の道へ'); setMood('think'); }
      });
    });
  };

  /* =========================================================
   * 提言（臣下として説得）：正しい根拠のカードを need 枚選ぶと説得ゲージが満ちる
   *  {t:'advise', to, ico, text, need, o:[{t, ok:true, r}]}
   * ========================================================= */
  STEP.advise = function (s, body) {
    var need = s.need || s.o.filter(function (o) { return o.ok; }).length, got = 0, miss = 0;
    var order = Core.shuffle(s.o.map(function (_, i) { return i; }));
    var segs = ''; for (var k = 0; k < need; k++) segs += '<i></i>';
    body.innerHTML = '<div class="adv"><div class="adv-head"><span class="adv-ico">' + (s.ico || '🏰') + '</span><div><small>提言する相手</small><b>' + esc(s.to || '') + '</b></div>' +
      '<div class="adv-meter"><small>説得ゲージ</small><div class="adv-segs">' + segs + '</div></div></div>' +
      '<p class="adv-goal">🎯 ' + fmt(s.goal || ('説得力のある根拠を ' + need + ' つ選ぼう')) + '</p>' +
      '<div class="adv-cards">' + order.map(function (i) { return '<button class="adv-opt" data-i="' + i + '"><span>' + fmt(s.o[i].t) + '</span><em class="adv-r"></em></button>'; }).join('') + '</div></div>';
    $$('.adv-opt', body).forEach(function (b) {
      b.addEventListener('click', function () {
        if (P.ready || b.disabled) return;
        var o = s.o[+b.dataset.i];
        b.disabled = true;
        if (o.r) $('.adv-r', b).innerHTML = fmt(o.r);
        if (o.ok) {
          b.classList.add('ok');
          var seg = $$('.adv-segs i', body)[got]; got++;
          if (seg) { seg.classList.add('on'); gsap.fromTo(seg, { scaleY: 0.2 }, { scaleY: 1, duration: 0.4, ease: 'back.out(3)' }); }
          var c = centerOf(b); FX.burst(c[0], c[1], { n: 18, speed: 5 }); Sfx.correct(got);
          if (got >= need) {
            $$('.adv-opt', body).forEach(function (x) { x.disabled = true; });
            var hd = $('.adv-head', body);
            hd.insertAdjacentHTML('beforeend', '<span class="adv-stamp">' + esc(s.win || '採用') + '</span>');
            gsap.fromTo($('.adv-stamp', hd), { scale: 3, opacity: 0, rotate: -30 }, { scale: 1, opacity: 1, rotate: -12, duration: 0.45, ease: 'back.out(3)' });
            solved($('.adv-meter', body), miss === 0, s.ok, '説得成功！');
          }
        } else {
          miss++;
          b.classList.add('bad');
          gsap.fromTo(b, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1.5,0.3)' });
          missed(o.r || 'その理由では説得できないみたい。');
        }
      });
    });
  };

  /* =========================================================
   * 旅（地図の上で駒を進める）：次の目的地をタップすると駒が進み、記録が残る
   *  {t:'route', piece:'♚', text, stops:[{p:'frankfurt', t:'…', hint}], decoys:['paris']}
   * ========================================================= */
  STEP.route = function (s, body) {
    if (!window.LEMap) { body.innerHTML = '<p>（地図データがありません）</p>'; setReady(true); return; }
    var ids = s.stops.map(function (x) { return x.p; }).concat(s.decoys || []);
    var lls = ids.map(LEMap.place);
    var lo = Math.min.apply(null, lls.map(function (l) { return l[0]; })), hi = Math.max.apply(null, lls.map(function (l) { return l[0]; }));
    var la = Math.min.apply(null, lls.map(function (l) { return l[1]; })), lb = Math.max.apply(null, lls.map(function (l) { return l[1]; }));
    var kx = Math.cos(47 * Math.PI / 180);
    var span = s.span || Math.max(5, (hi - lo) * 1.4, (lb - la) * 1.5 / 0.75 / kx);
    var center = s.center || [(lo + hi) / 2, (la + lb) / 2];
    var w = span * 10 * kx, R = w * 0.017, FS = w * 0.038;
    var pins = ids.map(function (id, n) {
      var c = LEMap.P(LEMap.place(id));
      return '<g class="rt-pin' + (n === 0 ? ' done start' : '') + '" data-p="' + id + '" transform="translate(' + c[0].toFixed(2) + ',' + c[1].toFixed(2) + ')"><circle class="rt-hit" r="' + (R * 2.8).toFixed(2) + '"/><circle class="rt-dot" r="' + R.toFixed(2) + '"/>' +
        '<text x="' + (R * 1.6).toFixed(2) + '" y="' + (FS * 0.35).toFixed(2) + '" font-size="' + FS.toFixed(2) + '">' + esc(LEMap.name(id)) + '</text></g>';
    }).join('');
    var c0 = LEMap.P(LEMap.place(s.stops[0].p));
    var extra = '<g class="rt-trail"></g>' + pins +
      '<g class="rt-piece" transform="translate(' + c0[0].toFixed(2) + ',' + c0[1].toFixed(2) + ')"><circle r="' + (R * 2.3).toFixed(2) + '"/><text y="' + (R * 1.15).toFixed(2) + '" font-size="' + (R * 3.4).toFixed(2) + '">' + (s.piece || '♚') + '</text></g>';
    body.innerHTML = '<div class="route"><div class="rt-map">' + LEMap.svg({ center: center, span: span, extra: extra }) + '</div>' +
      '<ol class="rt-log"><li><b>' + esc(LEMap.name(s.stops[0].p)) + '</b>' + fmt(s.stops[0].t || '') + '</li></ol>' +
      '<p class="bits-goal">🎯 ' + esc(s.goal || '次の目的地を地図でタップ') + '</p></div>';
    var trail = $('.rt-trail', body), piece = $('.rt-piece', body), log = $('.rt-log', body);
    var k = 1, miss = 0, pos = { x: c0[0], y: c0[1] }, moving = false;
    $$('.rt-pin', body).forEach(function (g) {
      g.addEventListener('click', function () {
        if (P.ready || moving || g.classList.contains('done')) return;
        var stop = s.stops[k];
        if (g.dataset.p === stop.p) {
          moving = true; g.classList.add('done');
          var to = LEMap.P(LEMap.place(stop.p)), from = { x: pos.x, y: pos.y };
          var mx = (from.x + to[0]) / 2, my = (from.y + to[1]) / 2 - Math.hypot(to[0] - from.x, to[1] - from.y) * 0.25;
          var d = 'M' + from.x.toFixed(2) + ',' + from.y.toFixed(2) + ' Q' + mx.toFixed(2) + ',' + my.toFixed(2) + ' ' + to[0].toFixed(2) + ',' + to[1].toFixed(2);
          trail.insertAdjacentHTML('beforeend', '<path d="' + d + '"/>');
          var path = trail.lastChild, len = path.getTotalLength();
          path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
          var tt = { t: 0 };
          Sfx.tap();
          gsap.to(tt, { t: 1, duration: 0.9, ease: 'power2.inOut', onUpdate: function () {
            var t = tt.t, x = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * mx + t * t * to[0], y = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * my + t * t * to[1];
            piece.setAttribute('transform', 'translate(' + x.toFixed(2) + ',' + y.toFixed(2) + ') scale(' + (1 + Math.sin(t * Math.PI) * 0.35).toFixed(3) + ')');
            path.style.strokeDashoffset = (len * (1 - t)).toFixed(2);
          }, onComplete: function () {
            pos = { x: to[0], y: to[1] }; moving = false; k++;
            var li = document.createElement('li');
            li.innerHTML = '<b>' + esc(LEMap.name(stop.p)) + '</b>' + fmt(stop.t || '');
            log.appendChild(li);
            gsap.from(li, { x: -20, opacity: 0, duration: 0.4, ease: 'back.out(2)' });
            var c = centerOf(g); FX.burst(c[0], c[1], { n: 16, speed: 5 }); Sfx.correct(k);
            if (k >= s.stops.length) solved($('.rt-map', body), miss === 0, s.ok, pick(['到着！', '旅の完了！', '見事な道のり！']));
          } });
        } else {
          miss++;
          g.classList.add('bad'); setTimeout(function () { g.classList.remove('bad'); }, 600);
          missed(stop.hint || s.hint || ('そこは「' + LEMap.name(g.dataset.p) + '」。次の目的地はちがうよ。'));
        }
      });
    });
  };

  /* =========================================================
   * 穴埋め図（家系図・勢力図など）：光る空欄に入る札をタップ
   *  {t:'fill', text, viz:'…{{0}}…{{1}}…', a:['答え0','答え1'], extra:['ダミー'], hints:[…]}
   * ========================================================= */
  STEP.fill = function (s, body) {
    var vz = mviz(s.viz).replace(/\{\{(\d+)\}\}/g, function (m, k) { return '<button class="fl-b" data-k="' + k + '"><span>？</span></button>'; });
    var all = s.a.concat(s.extra || []);
    var chips = Core.shuffle(all.map(function (v, i) { return { v: v, i: i }; }));
    body.innerHTML = '<div class="vz fl-vz">' + vz + '</div><div class="fl-pool">' + chips.map(function (c) { return '<button class="chipb fl-chip" data-i="' + c.i + '">' + fmt(c.v) + '</button>'; }).join('') + '</div>' +
      '<p class="bits-goal">🎯 ' + esc(s.goal || '光っている空欄に入る札をタップ（空欄をタップすると選び直せる）') + '</p>';
    var filled = {}, miss = 0, act = 0, n = s.a.length;
    function setAct(k) {
      act = k;
      $$('.fl-b', body).forEach(function (b) { b.classList.toggle('act', +b.dataset.k === k && !filled[k]); });
    }
    function nextOpen() { for (var k = 0; k < n; k++) if (!filled[k]) return k; return -1; }
    $$('.fl-b', body).forEach(function (b) { b.addEventListener('click', function () { if (!filled[+b.dataset.k]) { setAct(+b.dataset.k); Sfx.tap(); } }); });
    $$('.fl-chip', body).forEach(function (c) {
      c.addEventListener('click', function () {
        if (P.ready || c.disabled) return;
        var v = all[+c.dataset.i];
        if (v === s.a[act]) {
          filled[act] = 1; c.disabled = true;
          gsap.to(c, { scale: 0.6, opacity: 0, duration: 0.25, onComplete: function () { c.style.display = 'none'; } });
          var b = $('.fl-b[data-k="' + act + '"]', body);
          b.classList.remove('act'); b.classList.add('ok'); b.innerHTML = '<span>' + fmt(v) + '</span>';
          gsap.fromTo(b, { scale: 1.4 }, { scale: 1, duration: 0.45, ease: 'back.out(3)' });
          var cc = centerOf(b); FX.burst(cc[0], cc[1], { n: 14, speed: 4 }); Sfx.correct(Object.keys(filled).length);
          var nx = nextOpen();
          if (nx < 0) solved($('.fl-vz', body), miss === 0, s.ok); else setAct(nx);
        } else {
          miss++;
          c.classList.add('bad'); setTimeout(function () { c.classList.remove('bad'); }, 500);
          gsap.fromTo(c, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1.5,0.3)' });
          missed((s.hints && s.hints[act]) || s.hint || 'その札はこの空欄には入らないよ。');
        }
      });
    });
    setAct(0);
  };

  /* =========================================================
   * たとえ（歴史 ⇄ いまでいうと）：1行ずつめくって対応を確かめる
   *  {t:'like', text, rows:[['選帝侯','社長を選ぶ大株主'], …], note}
   * ========================================================= */
  STEP.like = function (s, body) {
    var left = s.rows.length;
    body.innerHTML = '<div class="like"><div class="lk-head"><span>' + esc(s.ha || '📜 歴史') + '</span><span></span><span>' + esc(s.hb || '🏙 いまでいうと') + '</span></div>' +
      s.rows.map(function (r, i) { return '<button class="lk-row" data-i="' + i + '"><span class="lk-a">' + fmt(r[0]) + '</span><span class="lk-ar">⇄</span><span class="lk-b"><i>タップ</i><em>' + fmt(r[1]) + '</em></span></button>'; }).join('') +
      (s.note ? '<p class="lk-note">' + fmt(s.note) + '</p>' : '') + '</div>';
    $$('.lk-row', body).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.classList.contains('open')) return;
        b.classList.add('open'); left--;
        gsap.fromTo($('.lk-b', b), { rotateX: 90 }, { rotateX: 0, duration: 0.45, ease: 'back.out(2)' });
        Sfx.coin();
        if (!left) { var n = $('.lk-note', body); if (n) gsap.fromTo(n, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }); setReady(true); }
      });
    });
    if (!left) setReady(true);
  };

  /* =========================================================
   * ウィジェット：図形を動かして体感する（コースの LE.widgets[名前] が中身を描く）
   *  {t:'widget', w:'unit', text, goal, ...任意の設定}
   *  ウィジェットは (api, s) を受け取り、ミッション達成で api.ok()、失敗で api.ng(msg) を呼ぶ。
   *  戻り値 {solve: fn} は自動テスト用（ミッションを自動で達成する）
   * ========================================================= */
  STEP.widget = function (s, body) {
    var W = LE.widgets && LE.widgets[s.w];
    if (!W) { body.innerHTML = '<p>（ウィジェット ' + esc(s.w) + ' がありません）</p>'; setReady(true); return; }
    /* ミッションの文言（図の上）はウィジェットが api.goal で書きかえる */
    body.innerHTML = '<p class="bits-goal wg-goal">' + (s.goal ? '🎯 ' + fmt(s.goal) : '') + '</p><div class="wg wg-' + esc(s.w) + '"></div>';
    var el = $('.wg', body), miss = 0, done = false;
    var api = {
      el: el, fmt: fmt, tex: tex, esc: esc, html: mviz,   // html：HTML はそのまま、$…$ だけ数式にする
      ok: function (msg, title) { if (done) return; done = true; solved(el, miss === 0, msg || s.ok, title); },
      ng: function (msg) { if (done) return; miss++; missed(msg || s.hint); },
      /* goal：HTML も **太字** も使える */
      goal: function (h) { var g = $('.wg-goal', body); if (g) { g.innerHTML = '🎯 ' + mviz(h).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); gsap.fromTo(g, { scale: 1.08 }, { scale: 1, duration: 0.3 }); } },
      tick: function () { Sfx.tap(); },
      ding: function (n) { Sfx.correct(n || 1); },
      burst: function (x, y, n) { FX.burst(x, y, { n: n || 16, speed: 5 }); },
      isDone: function () { return done; }
    };
    window.__LE_WIDGET = W(api, s) || {};
  };

  /* =========================================================
   * 公式を組み立てる：札を正しい順にタップして式を完成させる（1手ごとに判定）
   *  {t:'build', text, ans:['\\sin\\theta', '=', '\\frac{a}{c}'], extra:['\\frac{b}{c}'], pre:'', post:''}
   *  札は TeX。同じ札が複数あってもよい
   * ========================================================= */
  STEP.build = function (s, body) {
    var pool = s.ans.concat(s.extra || []).map(function (v, i) { return { v: v, i: i }; });
    Core.shuffle(pool);
    body.innerHTML = (s.viz ? '<div class="vz vz-anim">' + mviz(s.viz) + '</div>' : '') + '<div class="bd"><div class="bd-line">' + (s.pre ? '<span class="bd-pre">' + tex(s.pre) + '</span>' : '') +
      s.ans.map(function (_, k) { return '<span class="bd-slot" data-k="' + k + '"></span>'; }).join('') +
      (s.post ? '<span class="bd-pre">' + tex(s.post) + '</span>' : '') + '</div>' +
      '<div class="bd-pool">' + pool.map(function (p) { return '<button class="chipb bd-chip" data-v="' + esc(p.v) + '">' + tex(p.v) + '</button>'; }).join('') + '</div>' +
      '<p class="bits-goal">🎯 ' + fmt(s.goal || '左から順に、札をタップして式を完成させよう') + '</p></div>';
    var k = 0, miss = 0;
    var slots = $$('.bd-slot', body);
    function mark() { slots.forEach(function (x, i) { x.classList.toggle('act', i === k); }); }
    mark();
    $$('.bd-chip', body).forEach(function (c) {
      c.addEventListener('click', function () {
        if (P.ready || c.disabled) return;
        if (c.dataset.v === s.ans[k]) {
          c.disabled = true;
          gsap.to(c, { scale: 0.5, opacity: 0, duration: 0.2, onComplete: function () { c.style.display = 'none'; } });
          var sl = slots[k];
          sl.innerHTML = tex(s.ans[k]); sl.classList.add('ok');
          gsap.fromTo(sl, { scale: 1.6, y: -10 }, { scale: 1, y: 0, duration: 0.4, ease: 'back.out(3)' });
          var cc = centerOf(sl); FX.burst(cc[0], cc[1], { n: 10, speed: 4 }); Sfx.correct(k + 1);
          k++; mark();
          if (k >= s.ans.length) {
            var line = $('.bd-line', body);
            gsap.fromTo(line, { scale: 1 }, { scale: 1.12, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' });
            solved(line, miss === 0, s.ok, pick(['公式完成！', 'カンペキ！', '組み上がった！']));
          }
        } else {
          miss++;
          c.classList.add('bad'); setTimeout(function () { c.classList.remove('bad'); }, 500);
          gsap.fromTo(c, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1.5,0.3)' });
          missed(s.hint || 'その札は、ここではないよ。');
        }
      });
    });
  };

  /* =========================================================
   * 見せて教える（アニメーション解説）：コマ送りで、キャラが一言ずつ話し、図がペンで描かれていく
   *  {t:'show', frames:[{say:'…', viz:'<svg …>'}, …]}
   *  インプット用（採点しない）。最後のコマまで見ると「つづける」が押せる
   * ========================================================= */
  STEP.show = function (s, body) {
    var k = -1, n = s.frames.length;
    body.innerHTML = '<div class="sh"><div class="sh-stage vz"></div><div class="sh-nav"><div class="sh-dots">' +
      s.frames.map(function () { return '<i></i>'; }).join('') + '</div><button class="btn-primary sh-next">次へ ▶</button><button class="btn-ghost sh-again">↺ もう一度</button></div></div>';
    var stg = $('.sh-stage', body), nx = $('.sh-next', body), ag = $('.sh-again', body), bub = $('#lsStage .bubble');
    ag.style.display = 'none';
    function frame(i) {
      k = i;
      var f = s.frames[i];
      if (bub && f.say != null) {
        bub.innerHTML = fmt(f.say);
        gsap.fromTo(bub, { opacity: 0.25, y: 6 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
      }
      var nw = null;
      if (f.viz != null || f.ask) {
        var old = stg.firstElementChild;
        nw = document.createElement('div'); nw.className = 'sh-frame'; nw.innerHTML = f.viz != null ? mviz(f.viz) : '';
        if (old) gsap.to(old, { opacity: 0, duration: 0.2, onComplete: function () { old.remove(); } });
        stg.appendChild(nw);
        /* 図の線はペンで描くように、文字はふわっと */
        var svg = $('svg', nw);
        if (svg && !f.still) {
          inkDraw(svg);
          gsap.from($$('text', svg), { opacity: 0, duration: 0.4, stagger: 0.04, delay: 0.35 });
        }
        gsap.from($$('.vz-row > *, .vz-col > *, .bx, .note', nw), { opacity: 0, y: 10, duration: 0.35, stagger: 0.08, delay: 0.2, clearProps: 'all' });
      }
      $$('.sh-dots i', body).forEach(function (d, j) { d.classList.toggle('on', j <= i); });
      Sfx.tap();
      function fin() {
        if (i >= n - 1) { nx.style.display = 'none'; ag.style.display = ''; if (!P.ready) setReady(true); }
        else nx.style.display = '';
      }
      if (f.ask && nw) { nx.style.display = 'none'; askBlock(nw, f.ask, function (r) { revealInto(r, f.reveal, f.rviz); fin(); }); }
      else fin();
    }
    nx.addEventListener('click', function () { if (k < n - 1) frame(k + 1); });
    ag.addEventListener('click', function () { ag.style.display = 'none'; frame(0); });
    frame(0);
  };

  /* =========================================================
   * 考えてから見る（ask）：説明の前に小さな問いを出し、答えると説明が現れる
   *  ask = {q:'問い', o:['正解', 'ちがう', …], why:['', 'ちがう理由', …]}（o[0] が正解。表示はシャッフル）
   *  予想（生成効果）のための問いなので採点しない。まちがえたらヒントを出して、もう一度
   * ========================================================= */
  function askBlock(box, ask, onDone) {
    var order = Core.shuffle(ask.o.map(function (_, i) { return i; }));
    var wrap = document.createElement('div'); wrap.className = 'ask';
    wrap.innerHTML = '<p class="ask-q">🤔 ' + fmt(ask.q) + '</p><div class="ask-o">' +
      order.map(function (i) { return '<button class="ask-b"' + (i === 0 ? ' data-ok="1"' : '') + ' data-i="' + i + '">' + fmt(ask.o[i]) + '</button>'; }).join('') + '</div><div class="ask-r"></div>';
    box.appendChild(wrap);
    gsap.from(wrap, { opacity: 0, y: 12, duration: 0.4, delay: 0.25, ease: 'power3.out', clearProps: 'all' });
    var r = $('.ask-r', wrap), fin = false;
    $$('.ask-b', wrap).forEach(function (b) {
      b.addEventListener('click', function () {
        if (fin || b.disabled) return;
        var i = +b.dataset.i;
        if (i === 0) {
          fin = true;
          b.classList.add('ok');
          $$('.ask-b', wrap).forEach(function (x) { x.disabled = true; if (x !== b) x.classList.add('dim'); });
          var c = centerOf(b); FX.burst(c[0], c[1], { n: 22, speed: 6 }); Sfx.correct(1);
          gsap.fromTo(b, { scale: 1.12 }, { scale: 1, duration: 0.45, ease: 'back.out(3)' });
          r.innerHTML = '';
          if (onDone) onDone(r);
        } else {
          b.disabled = true; b.classList.add('bad');
          gsap.fromTo(b, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1.5,0.3)' });
          Sfx.wrong();
          r.innerHTML = '<p class="ask-why">' + fmt((ask.why && ask.why[i]) || ask.hint || 'もう一度考えてみよう。') + '</p>';
          gsap.fromTo(r, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        }
      });
    });
    return wrap;
  }
  /* 答えのあとに出す説明（reveal）とおまけの図（rviz） */
  function revealInto(r, html, viz) {
    if (html) {
      var p = document.createElement('div'); p.className = 'ask-reveal'; p.innerHTML = fmt(html);
      r.appendChild(p);
      gsap.fromTo(p, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' });
    }
    if (viz) {
      var v = document.createElement('div'); v.className = 'vz'; v.innerHTML = mviz(viz);
      r.appendChild(v);
      var svg = $('svg', v); if (svg) inkDraw(svg);
      gsap.from($$('.vz > *', r), { opacity: 0, y: 10, duration: 0.4, stagger: 0.08, delay: 0.2, clearProps: 'all' });
    }
  }

  /* まとめを「思い出してから答え合わせ」に：太字のキーワードをぼかし、タップでくっきり */
  function recapTap(s, body) {
    body.innerHTML = '<p class="rc-lead">ぼかした所を<b>頭の中で言ってから</b>タップ！</p><ul class="recap rc-tap">' + s.points.map(function (p) {
      /* 太字があれば太字を、なければ数式をぼかす */
      var h = fmt(p), cls = /<b>/.test(h) ? 'rv rv-b' : /class="katex"/.test(h) ? 'rv rv-k' : 'open';
      return '<li class="' + cls + '"><i>✔</i><span>' + h + '</span></li>';
    }).join('') + '</ul>';
    var left = $$('.rc-tap li.rv', body).length;
    gsap.from($$('.recap li', body), { x: -30, opacity: 0, stagger: 0.12, duration: 0.4, delay: 0.3, ease: 'back.out(2)' });
    $$('.rc-tap li.rv', body).forEach(function (li) {
      li.addEventListener('click', function () {
        if (!li.classList.contains('rv')) return;
        li.classList.remove('rv'); li.classList.add('open');
        gsap.fromTo($$('b, .katex', li), { scale: 1.25 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
        Sfx.coin(); left--;
        if (!left) setReady(true);
      });
    });
    if (!left) setReady(true);
  }
  STEP.match = function (s, body) {
    var L = Core.shuffle(s.pairs.map(function (p, i) { return i; })), R = Core.shuffle(s.pairs.map(function (p, i) { return i; }));
    var sel = null, left = s.pairs.length, miss = 0;
    body.innerHTML = '<div class="match"><div class="m-col">' + L.map(function (i) { return '<button class="mt l" data-i="' + i + '">' + fmt(s.pairs[i][0]) + '</button>'; }).join('') +
      '</div><div class="m-col">' + R.map(function (i) { return '<button class="mt r" data-i="' + i + '">' + fmt(s.pairs[i][1]) + '</button>'; }).join('') + '</div></div>';
    $$('.mt.l', body).forEach(function (b) {
      b.addEventListener('click', function () { if (b.disabled) return; $$('.mt.l', body).forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); sel = +b.dataset.i; Sfx.tap(); });
    });
    $$('.mt.r', body).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.disabled || sel == null) { if (sel == null) gsap.fromTo($$('.mt.l:not(:disabled)', body), { x: -4 }, { x: 0, duration: 0.3 }); return; }
        var lb = $('.mt.l[data-i="' + sel + '"]', body);
        if (+b.dataset.i === sel) {
          [lb, b].forEach(function (x) { x.disabled = true; x.classList.remove('sel'); x.classList.add('ok'); });
          var c = centerOf(b); FX.burst(c[0], c[1], { n: 14, speed: 5 }); Sfx.correct(s.pairs.length - left);
          sel = null; left--;
          if (!left) solved($('.match', body), miss === 0, s.ok);
        } else {
          miss++;
          b.classList.add('bad'); setTimeout(function () { b.classList.remove('bad'); }, 500);
          gsap.fromTo(b, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1.5,0.3)' });
          Sfx.wrong();
        }
      });
    });
  };
  function normNum(v) {
    return parseFloat(String(v).replace(/[０-９．－]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); }).replace(/[,，\s]/g, '').replace('ー', '-'));
  }
  STEP.num = function (s, body) {
    var tries = 0, sol = [].concat(s.solve || []);   // 解き方は配列でも1つの文字列でもよい
    body.innerHTML = (s.viz ? '<div class="vz vz-anim">' + mviz(s.viz) + '</div>' : '') +
      '<div class="num-row"><input class="num-in" inputmode="decimal" autocomplete="off" placeholder="?"><span class="num-unit">' + esc(s.unit || '') + '</span><button class="btn-primary num-check">チェック</button></div>' +
      (s.hint ? '<button class="ls-hint">💡 ヒントを見る</button>' : '') + '<div class="num-solve"></div>';
    var inp = $('.num-in', body);
    setTimeout(function () { inp.focus(); }, 500);
    var hb = $('.ls-hint', body);
    if (hb) hb.addEventListener('click', function () { hb.outerHTML = '<p class="ls-hint-text">💡 ' + fmt(s.hint) + '</p>'; });
    function check() {
      if (P.ready) return;
      var v = normNum(inp.value);
      if (isNaN(v)) { gsap.fromTo(inp, { x: -6 }, { x: 0, duration: 0.3 }); return; }
      tries++;
      if (Math.abs(v - s.answer) <= (s.tol || 1e-9)) {
        inp.classList.add('ok'); inp.disabled = true; $('.num-check', body).style.display = 'none';
        solved(inp, tries === 1, s.ok || sol.join('\n'));
      } else {
        inp.classList.add('bad'); setTimeout(function () { inp.classList.remove('bad'); }, 600);
        if (tries >= 2 && sol.length) {
          $('.num-solve', body).innerHTML = '<div class="solve"><b>解き方</b><ol>' + sol.map(function (x) { return '<li>' + fmt(x) + '</li>'; }).join('') + '</ol></div>';
          gsap.from('.solve li', { opacity: 0, x: -20, stagger: 0.15 });
          missed('解き方を見て、もう一度入力してみよう。答えは **' + s.answer + (s.unit || '') + '**。');
        } else missed(s.hint || '計算をもう一度たしかめよう。');
      }
    }
    $('.num-check', body).addEventListener('click', check);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); if (P.ready) next(); else check(); } });
  };
  STEP.steps = function (s, body) {
    var shown = 0;
    body.innerHTML = '<div class="ex-card"><span class="ex-tag">例題</span><p class="ex-q">' + fmt(s.q) + '</p><ol class="ex-steps"></ol><button class="btn-ghost ex-more">▼ 次の手順を見る</button></div>';
    var ol = $('.ex-steps', body), more = $('.ex-more', body);
    function show() {
      var li = document.createElement('li');
      li.innerHTML = fmt(s.steps[shown]);
      ol.appendChild(li);
      gsap.from(li, { opacity: 0, y: 12, duration: 0.35, ease: 'power3.out' });
      shown++; Sfx.tap();
      if (shown >= s.steps.length) { more.style.display = 'none'; li.classList.add('final'); setReady(true); }
    }
    more.addEventListener('click', show);
    show();
  };
  STEP.trace = function (s, body) {
    var lines = s.code.split('\n'), k = -1;
    var vars = []; s.rows.forEach(function (r) { Object.keys(r.v || {}).forEach(function (n) { if (vars.indexOf(n) < 0) vars.push(n); }); });
    body.innerHTML = '<pre class="tr-code">' + lines.map(function (l, i) { return '<div class="tl" data-l="' + i + '"><em>' + (i + 1) + '</em>' + esc(l) + '</div>'; }).join('') + '</pre>' +
      '<div class="tr-vars">' + vars.map(function (v) { return '<div class="tv"><small>' + esc(v) + '</small><b data-v="' + esc(v) + '">-</b></div>'; }).join('') + '</div>' +
      '<p class="tr-say"></p><div class="tr-ctrl"><button class="btn-ghost tr-prev">◀ 戻る</button><span class="tr-pos"></span><button class="btn-primary tr-next">1行実行 ▶</button></div>';
    var cur = {};
    function go(to) {
      k = to;
      cur = {};
      for (var i = 0; i <= k; i++) Object.keys(s.rows[i].v || {}).forEach(function (n) { cur[n] = s.rows[i].v[n]; });
      var r = s.rows[k];
      $$('.tl', body).forEach(function (el) { el.classList.toggle('on', +el.dataset.l === r.l); });
      vars.forEach(function (n) {
        var el = $('b[data-v="' + n + '"]', body);
        var nv = cur[n] == null ? '-' : String(cur[n]);
        if (el.textContent !== nv) { el.textContent = nv; gsap.fromTo(el, { scale: 1.6, color: '#ffd84d' }, { scale: 1, color: '#ffffff', duration: 0.5, ease: 'back.out(3)' }); }
      });
      $('.tr-say', body).innerHTML = r.say ? '🤖 ' + fmt(r.say) : '';
      $('.tr-pos', body).textContent = (k + 1) + ' / ' + s.rows.length;
      $('.tr-prev', body).disabled = k <= 0;
      $('.tr-next', body).disabled = k >= s.rows.length - 1;
      var on = $('.tl.on', body); if (on) on.scrollIntoView({ block: 'nearest' });
      if (k >= s.rows.length - 1 && !P.ready) setReady(true);
    }
    $('.tr-next', body).addEventListener('click', function () { if (k < s.rows.length - 1) { go(k + 1); Sfx.tap(); } });
    $('.tr-prev', body).addEventListener('click', function () { if (k > 0) { go(k - 1); Sfx.tap(); } });
    go(0);
  };
  STEP.stack = function (s, body) {
    var q = [], nextN = 1, ops = 0, isQ = s.mode === 'queue', out = [];
    body.innerHTML = '<div class="sq ' + (isQ ? 'queue' : 'stack') + '"><div class="sq-box"></div><div class="sq-out"><small>取り出した順</small><div class="sq-got"></div></div></div>' +
      '<div class="sq-ctrl"><button class="btn-primary sq-in">' + (isQ ? '入れる（enqueue）' : '積む（push）') + '</button><button class="btn-ghost sq-pop">' + (isQ ? '取り出す（dequeue）' : '取り出す（pop）') + '</button></div>' +
      '<p class="bits-goal">🎯 ' + esc(s.goal || '入れたり出したりして、どれが先に出てくるか確かめよう（4回以上操作）') + '</p>';
    var box = $('.sq-box', body);
    function draw() {
      box.innerHTML = q.map(function (v) { return '<i>' + v + '</i>'; }).join('') || '<span class="sq-empty">からっぽ</span>';
      $('.sq-got', body).innerHTML = out.map(function (v) { return '<i>' + v + '</i>'; }).join('');
    }
    $('.sq-in', body).addEventListener('click', function () {
      if (q.length >= 6) { gsap.fromTo(box, { x: -6 }, { x: 0, duration: 0.3 }); return; }
      q.push(nextN++); ops++; draw(); Sfx.tap();
      var last = box.lastChild; gsap.from(last, isQ ? { x: 40, opacity: 0, duration: 0.3 } : { y: -40, opacity: 0, duration: 0.3 });
      chk();
    });
    $('.sq-pop', body).addEventListener('click', function () {
      if (!q.length) { gsap.fromTo(box, { x: -6 }, { x: 0, duration: 0.3 }); return; }
      var v = isQ ? q.shift() : q.pop(); out.push(v); ops++; Sfx.coin(); draw();
      var g = $('.sq-got', body).lastChild; gsap.from(g, { scale: 2, opacity: 0, duration: 0.35, ease: 'back.out(3)' });
      chk();
    });
    function chk() { if (ops >= 4 && out.length >= 1 && !P.ready) solved(box, true, s.ok); }
    draw();
  };

  /* =========================================================
   * クリア
   * ========================================================= */
  function finish() {
    var L = P.L, ks = Object.keys(P.first).filter(function (k) { return P.first[k] !== null; });
    var ok = ks.filter(function (k) { return P.first[k]; }).length;
    var ratio = ks.length ? ok / ks.length : 1;
    var stars = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1;
    var rec = S().lessons[L.id];
    var firstClear = !(rec && rec.done);
    var bonus = (firstClear ? 30 : 10) + stars * 10;
    S().lessons[L.id] = { done: (rec && rec.done) || Date.now(), stars: Math.max(stars, (rec && rec.stars) || 0), plays: ((rec && rec.plays) || 0) + 1 };
    var zoneWas = P.zone; zoneOut();
    var card = Core.LMAP[L.id];
    var total = P.xp + bonus;
    var lu = Core.addXp(total);
    var quests = firstClear ? Core.questEvent('lesson', 1) : [];
    Core.save();

    var ov = $('#overlay-lclear');
    var nx = nextLesson();
    $('#lcTitle').textContent = L.title;
    $('#lcStars').innerHTML = [1, 2, 3].map(function (k) { return '<i class="' + (k <= stars ? 'on' : '') + '">★</i>'; }).join('');
    $('#lcXp').textContent = 0;
    $('#lcAcc').textContent = ks.length ? ok + ' / ' + ks.length : '—';
    $('#lcUnlock').innerHTML = (L.q.length ? '<div class="lc-un">🔓 本番形式の問題 <b>' + L.q.length + '問</b> が解放された！</div>' : '') +
      (card ? '<div class="lc-cardget"><p class="lc-cg-head">' + (firstClear ? LE_T('cardGet') : LE_T('card')) + '</p>' + UI.miniCard(card, 'big') + '<small class="lc-cnote">タップで見る。このレッスンのまとめ＋補足が入った' + LE_T('card') + '。図鑑でいつでも見返せる</small></div>' : '');
    var cg = $('#lcUnlock .mcard'); if (cg) cg.addEventListener('click', function () { UI.openCard(L.id); });
    var acts = $('#lcActs'); acts.innerHTML = '';
    function btn(label, cls, fn) { var b = document.createElement('button'); b.className = cls; b.innerHTML = label; b.addEventListener('click', fn); acts.appendChild(b); }
    if (L.q.length) btn('⚔ 学んだことを問題で確かめる（' + L.q.length + '問）', 'btn-primary', function () { close(); setTimeout(function () { UI.startSet('lesson', L.id); }, 250); });
    if (nx && nx.id !== L.id) btn('▶ 次のレッスン：' + esc(nx.title), L.q.length ? 'btn-ghost' : 'btn-primary', function () { close(); setTimeout(function () { start(nx.id); }, 250); });
    btn(LE_T('roadmap') + 'へ', 'btn-ghost', function () { close(); UI.go('learn'); });
    function close() { gsap.to(ov, { opacity: 0, duration: 0.25, onComplete: function () { ov.classList.remove('show'); } }); }

    gsap.to('#lsBar', { width: '100%', duration: 0.4 });
    ov.classList.add('show');
    Sfx.levelUp();
    var tl = gsap.timeline();
    tl.fromTo(ov, { opacity: 0 }, { opacity: 1, duration: 0.25 })
      .fromTo('#overlay-lclear .lu-small', { y: -30, opacity: 0, letterSpacing: '1em' }, { y: 0, opacity: 1, letterSpacing: '0.3em', duration: 0.6, ease: 'expo.out' })
      .fromTo('#lcTitle', { scale: 2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'expo.out' }, '-=0.3')
      .add(function () { FX.confetti(firstClear ? 220 : 100); FX.flash('#ffffff', 0.35); FX3D.pulse(3); });
    $$('#lcStars i').forEach(function (s, k) {
      tl.fromTo(s, { scale: 0, rotate: -180 }, { scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(3)', onStart: function () { if (s.classList.contains('on')) { Sfx.correct(k * 3 + 2); var c = centerOf(s); FX.burst(c[0], c[1], { n: 26, speed: 7, colors: ['#ffd84d', '#fff'] }); } } }, '+=0.05');
    });
    tl.add(function () { FX.countUp($('#lcXp'), total, 1); })
      .from(['.lc-stats', '.lc-un', '#lcActs'], { y: 20, opacity: 0, stagger: 0.12, duration: 0.4, clearProps: 'all' })
      .fromTo('#lcUnlock .mcard', { rotateY: 180, scale: 0.4, opacity: 0 }, { rotateY: 0, scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.6)',
        onStart: function () { Sfx.chestOpen('rare'); }, onComplete: function () { var m = $('#lcUnlock .mcard'); if (!m) return; var r = m.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + r.height / 2, { n: 60, speed: 9 }); } }, '-=0.2')
      .from('.lc-cg-head', { scale: 2, opacity: 0, duration: 0.4, ease: 'back.out(3)' }, '-=0.5');
    UI.handleQuests(quests);
    UI.handleAch();
    UI.renderTop(true);
    if (lu) setTimeout(function () { UI.levelUp(lu); }, 2600);
    P = null;
  }

  /* =========================================================
   * 用語ポップアップ
   * ========================================================= */
  document.addEventListener('click', function (e) {
    var tip = $('#glossTip');
    var g = e.target.closest && e.target.closest('.gl');
    if (!g) { if (tip.classList.contains('show') && !e.target.closest('#glossTip')) tip.classList.remove('show'); return; }
    var term = g.dataset.t, def = LE.glossary[term];
    tip.innerHTML = '<b>' + esc(term) + '</b><p>' + fmt(def || '（このあとのレッスンで説明するよ）') + '</p>';
    tip.classList.add('show');
    var r = g.getBoundingClientRect(), w = Math.min(300, window.innerWidth - 32);
    tip.style.width = w + 'px';
    tip.style.left = Math.max(16, Math.min(window.innerWidth - w - 16, r.left + r.width / 2 - w / 2)) + 'px';
    var top = r.bottom + 8;
    tip.style.top = top + 'px';
    if (top + tip.offsetHeight > window.innerHeight - 10) tip.style.top = (r.top - tip.offsetHeight - 8) + 'px';
    gsap.fromTo(tip, { y: -6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 });
    Sfx.tap();
  });

  function bind() {
    $('#lsGo').addEventListener('click', next);
    $('#lsClose').addEventListener('click', function () {
      if (P && !confirm('レッスンを中断しますか？（最初からやり直しになります）')) return;
      P = null; UI.go('learn');
    });
    document.addEventListener('keydown', function (e) {
      if (!P || UI.current() !== 'lesson') return;
      if ($('#overlay-levelup').classList.contains('show') || $('#overlay-lclear').classList.contains('show')) return;
      if (e.target.tagName === 'INPUT') return;
      var s = P.L.steps[P.i];
      if (e.key === 'Enter' || (e.key === ' ' && P.ready)) { e.preventDefault(); next(); return; }
      if (s.t === 'quiz' && /^[1-6]$/.test(e.key)) { var b = $$('#lsStage .ls-opt')[+e.key - 1]; if (b) b.click(); }
      if (s.t === 'trace' && e.key === 'ArrowRight') { var tn = $('#lsStage .tr-next'); if (tn) tn.click(); }
      if (s.t === 'trace' && e.key === 'ArrowLeft') { var tp = $('#lsStage .tr-prev'); if (tp) tp.click(); }
    });
  }

  window.Lesson = {
    renderMap: renderMap, start: start, stage: stage, tex: tex, mviz: mviz, math: withMath, next: nextLesson, isDone: isDone, all: allLessons, no: lessonNo, label: label, fmt: fmt, bind: bind,
    active: function () { return !!P; }
  };
})();
