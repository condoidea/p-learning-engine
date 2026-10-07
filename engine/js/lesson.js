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
  /* 本文の書式：**太字** `等幅` [[用語]] [[用語|表示]] 改行 */
  function fmt(t) {
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
  var INTERACTIVE = { quiz: 1, bits: 1, gate: 1, order: 1, match: 1, num: 1, stack: 1, timeline: 1 };
  var P = null;
  function start(id) {
    Sfx.unlock();
    var L = LE.lessonDefs[id];
    P = { L: L, i: 0, xp: 0, first: {}, combo: 0, ready: false, startAt: Date.now() };
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
  function solved(el, firstTry, msg) {
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
    feedback('ok', '<b>' + (firstTry ? pick(['正解！', 'ばっちり！', 'その通り！', 'ナイス！']) : 'できた！') + '</b>' + (msg ? '<p>' + fmt(msg) + '</p>' : ''));
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
    var bubble = s.t === 'say' ? s.text : s.t === 'term' ? 'あたらしい用語だよ！' : s.t === 'recap' ? 'ここまでのまとめ！' : s.text || s.q;
    if (s.t !== 'quiz') html += '<div class="ls-talk">' + pico(s.t === 'recap' ? 'happy' : '') + '<div class="bubble">' + fmt(bubble) + '</div></div>';
    html += '<div class="ls-body"></div></div>';
    st.innerHTML = html;
    var body = $('.ls-body', st);
    (STEP[s.t] || STEP.say)(s, body);
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
    if (s.viz) body.innerHTML = '<div class="vz vz-anim">' + s.viz + '</div>';
    setReady(true);
  };
  STEP.term = function (s, body) {
    body.innerHTML = '<div class="term-card"><span class="term-stamp">用語GET</span><small>' + esc(s.yomi || '') + '</small><h2>' + esc(s.word) + '</h2>' +
      '<p class="term-short">' + fmt(s.short) + '</p>' + (s.ex ? '<p class="term-ex"><span>たとえるなら</span>' + fmt(s.ex) + '</p>' : '') + '</div>' +
      (s.viz ? '<div class="vz vz-anim">' + s.viz + '</div>' : '');
    var tc = $('.term-card', body);
    gsap.fromTo(tc, { rotateY: 90 }, { rotateY: 0, duration: 0.6, ease: 'back.out(1.6)', delay: 0.15 });
    gsap.fromTo($('.term-stamp', body), { scale: 3, opacity: 0, rotate: -40 }, { scale: 1, opacity: 1, rotate: -12, duration: 0.4, delay: 0.6, ease: 'back.out(3)', onStart: function () { Sfx.coin(); } });
    setReady(true);
  };
  STEP.recap = function (s, body) {
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
      (s.viz ? '<div class="vz vz-anim">' + s.viz + '</div>' : '') +
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
    var tries = 0;
    body.innerHTML = (s.viz ? '<div class="vz vz-anim">' + s.viz + '</div>' : '') +
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
        solved(inp, tries === 1, s.ok || (s.solve ? s.solve.join('\n') : ''));
      } else {
        inp.classList.add('bad'); setTimeout(function () { inp.classList.remove('bad'); }, 600);
        if (tries >= 2 && s.solve) {
          $('.num-solve', body).innerHTML = '<div class="solve"><b>解き方</b><ol>' + s.solve.map(function (x) { return '<li>' + fmt(x) + '</li>'; }).join('') + '</ol></div>';
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
    renderMap: renderMap, start: start, next: nextLesson, isDone: isDone, all: allLessons, no: lessonNo, label: label, fmt: fmt, bind: bind,
    active: function () { return !!P; }
  };
})();
