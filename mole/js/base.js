/* =========================================================
 * mole/base.js — モル教室の土台（保存・文字の書式・用語ヘルプ・先生の顔・演出・音）
 *
 *  文字の書式（レッスンの台本で使う）
 *    **…**   覚えること（黄色のマーカー）
 *    __…__   覚え方のコツ（💡 波線）
 *    ((…))   このアプリでの呼び方（グレー・覚えなくていい）
 *    {p|…} {m|…} {g|…} {v|…}   意味の色：粒子数（ピンク）・物質量 mol（オレンジ）・質量（緑）・体積（青）
 *    H_2O → 下つき、10^23 / 10^-23 / Na^+ / Ca^{2+} → 上つき
 *  用語集（M.gloss）の言葉は、本文に出たら自動で点線になり、タップで説明（バルーン）が出る
 * ========================================================= */
(function () {
  'use strict';
  var M = window.M = window.M || {};
  var E2E = /[?&]e2e\b/.test(location.search);
  M.E2E = E2E;
  /* ?sandbox：動作確認用の別の保存先（本物の記録に触れない） */
  M.KEY = E2E ? 'mole.e2e.v1' : /[?&]sandbox\b/.test(location.search) ? 'mole.sandbox.v1' : 'mole.v1';
  /* 一度でも開いたら、ほかのアプリの「新しいアプリができたよ」のお知らせ（news/news.js）を出さない */
  if (M.KEY === 'mole.v1') { try { localStorage.setItem('le.news.mole.opened', String(Date.now())); } catch (e) { /* 保存できない環境 */ } }

  M.$ = function (s, r) { return (r || document).querySelector(s); };
  M.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  M.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  M.shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  M.pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  M.G = window.gsap || null;
  M.wait = function (ms) { return new Promise(function (r) { setTimeout(r, E2E ? 0 : ms); }); };

  /* =========================================================
   * 保存
   *  lessons：{ L1: { done, at, best } }（コース一覧が done を数える）
   *  crystals：{ L1: { lv, due, last } } 結晶の育ち（lv 0〜5）と、くもる日
   *  L：あつめた粒の数（10 の何乗か。log10）
   *  miles：スケール図鑑で超えたもの
   * ========================================================= */
  function blank() { return { v: 1, lessons: {}, crystals: {}, L: 0, miles: [], settings: { sound: true }, seen: {} }; }
  M.load = function () {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(M.KEY)); } catch (e) { s = null; }
    var b = blank();
    if (!s || typeof s !== 'object') return b;
    for (var k in b) if (!(k in s)) s[k] = b[k];
    return s;
  };
  M.S = M.load();
  M.save = function () {
    try { localStorage.setItem(M.KEY, JSON.stringify(M.S)); } catch (e) { /* 保存できない環境（プライベートなど） */ }
    if (E2E) return;
    /* コース一覧の「最終学習」 */
    try {
      var P = JSON.parse(localStorage.getItem('le.profile.v1')) || {};
      P.courses = P.courses || {}; P.courses.mole = P.courses.mole || {}; P.courses.mole.last = Date.now();
      localStorage.setItem('le.profile.v1', JSON.stringify(P));
    } catch (e) { /* 無視 */ }
  };
  window.SfxOn = function () { return !E2E && M.S.settings.sound !== false; };

  /* =========================================================
   * 数の見せ方
   * ========================================================= */
  var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', '−': '⁻' };
  M.sup = function (n) { return String(n).split('').map(function (c) { return SUP[c] || c; }).join(''); };
  /* あつめた粒（log10）→ 「37 個」「1.2×10⁸ 個」 */
  M.countParts = function (L) {
    if (L < 4) { var n = Math.round(Math.pow(10, L)); return { m: String(n), e: null }; }
    var e = Math.floor(L + 1e-9), m = Math.pow(10, L - e);
    var ms = m.toFixed(1);
    if (ms === '10.0') { ms = '1.0'; e++; }
    return { m: ms, e: e };
  };
  M.countHTML = function (L) {
    var c = M.countParts(L);
    return c.e === null ? c.m : c.m + '<span class="x">×</span>10<sup>' + c.e + '</sup>';
  };
  /* 答えの数（ふつうの数）→ 表示（1.2×10^24 のような台本の書き方で返す） */
  M.numText = function (x) {
    if (x === 0) return '0';
    var a = Math.abs(x);
    if (a >= 1e4 || a < 1e-3) {
      var e = Math.floor(Math.log10(a) + 1e-9), m = x / Math.pow(10, e);
      var ms = (Math.round(m * 10) / 10).toFixed(1);
      if (Math.abs(parseFloat(ms)) >= 10) { ms = (parseFloat(ms) / 10).toFixed(1); e++; }
      return ms + '×10^' + (e < 0 ? '-' + (-e) : e);
    }
    var r = Math.round(x * 1000) / 1000;
    return String(r);
  };

  /* =========================================================
   * 文字の書式
   * ========================================================= */
  M.fmt = function (s) {
    var h = M.esc(s == null ? '' : s);
    h = h.replace(/\{([pmgv])\|([^}]*)\}/g, '<span class="c-$1">$2</span>');
    h = h.replace(/\*\*([\s\S]+?)\*\*/g, '<mark class="k">$1</mark>');
    h = h.replace(/__([\s\S]+?)__/g, '<span class="tip">$1</span>');
    h = h.replace(/\(\(([\s\S]+?)\)\)/g, '<span class="nick">$1</span>');
    h = h.replace(/\^\{([^}]*)\}/g, function (m, x) { return '<sup>' + x.replace(/-/g, '−') + '</sup>'; });
    h = h.replace(/_\{([^}]*)\}/g, '<sub>$1</sub>');
    h = h.replace(/\^([-−]?\d+[+−-]?)/g, function (m, x) { return '<sup>' + x.replace(/-/g, '−') + '</sup>'; });
    h = h.replace(/\^([+−-])/g, function (m, x) { return '<sup>' + (x === '-' ? '−' : x) + '</sup>'; });
    h = h.replace(/([A-Za-z\)])_(\d+)/g, '$1<sub>$2</sub>');
    h = h.replace(/\n/g, '<br>');
    return h;
  };

  /* =========================================================
   * 用語ヘルプ（バルーン）
   * ========================================================= */
  M.GL = {};
  M.gloss = function (o) { for (var k in o) M.GL[k] = o[k]; M._gre = null; };
  function glossRe() {
    if (M._gre) return M._gre;
    var keys = Object.keys(M.GL).sort(function (a, b) { return b.length - a.length; });
    M._gre = keys.length ? new RegExp(keys.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|'), 'g') : null;
    return M._gre;
  }
  /* el の中の用語に点線をつける。used（{語:true}）に入っている語と、マーカー（定義する場面）の中は飛ばす */
  M.glossify = function (el, used) {
    var re = glossRe(); if (!re) return;
    used = used || {};
    /* マーカーで定義したばかりの語は、同じ吹き出しの中では点線にしない（次の吹き出しから） */
    var here = {};
    M.$$('mark', el).forEach(function (mk) { here[mk.textContent] = true; });
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function (t) {
      if (t.parentNode.closest && t.parentNode.closest('mark,.gl,button,.no-gl,sup,sub,svg')) return;
      var s = t.nodeValue, out = [], last = 0, m, hit = false;
      re.lastIndex = 0;
      while ((m = re.exec(s))) {
        if (used[m[0]] || here[m[0]]) continue;
        if (M.glossSkip && M.glossSkip[m[0]] && M.glossSkip[m[0]].test(s.slice(m.index + m[0].length))) continue;
        used[m[0]] = true; hit = true;
        out.push(document.createTextNode(s.slice(last, m.index)));
        var sp = document.createElement('span');
        sp.className = 'gl'; sp.setAttribute('role', 'button'); sp.setAttribute('tabindex', '0');
        sp.setAttribute('data-gl', m[0]); sp.textContent = m[0];
        out.push(sp);
        last = m.index + m[0].length;
      }
      if (!hit) return;
      out.push(document.createTextNode(s.slice(last)));
      var f = document.createDocumentFragment(); out.forEach(function (x) { f.appendChild(x); });
      t.parentNode.replaceChild(f, t);
    });
  };
  /* バルーン */
  var pop = null, popFor = null;
  function closePop() { if (pop) { pop.hidden = true; popFor = null; } }
  M.closePop = closePop;
  document.addEventListener('click', function (e) {
    var g = e.target.closest && e.target.closest('[data-gl]');
    pop = pop || M.$('#tipPop');
    if (!g) { if (pop && !(e.target.closest && e.target.closest('#tipPop'))) closePop(); return; }
    e.preventDefault(); e.stopPropagation();
    if (popFor === g) { closePop(); return; }
    var w = g.getAttribute('data-gl');
    pop.innerHTML = '<b>' + M.esc(w) + '</b><span>' + M.fmt(M.GL[w] || '') + '</span>';
    pop.hidden = false; popFor = g;
    var r = g.getBoundingClientRect(), pw = Math.min(300, innerWidth - 24);
    pop.style.width = pw + 'px';
    var x = Math.max(12, Math.min(innerWidth - pw - 12, r.left + r.width / 2 - pw / 2));
    var below = r.bottom + 10, ph = pop.offsetHeight;
    var y = (below + ph > innerHeight - 8) ? r.top - ph - 10 : below;
    pop.style.left = x + 'px'; pop.style.top = Math.max(8, y) + 'px';
    pop.style.setProperty('--ax', (r.left + r.width / 2 - x) + 'px');
    pop.classList.toggle('up', y < r.top);
    if (M.G) M.G.fromTo(pop, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(2)' });
    if (window.Sfx) Sfx.tap();
  }, true);
  addEventListener('scroll', closePop, { passive: true });

  /* =========================================================
   * モルモ先生（モルモットの化学の先生）の顔
   *  normal / happy / wow / oops / think / proud / sad
   * ========================================================= */
  M.face = function (f) {
    f = f || 'normal';
    var eyes, mouth, extra = '';
    var dot = function (x) { return '<circle cx="' + x + '" cy="52" r="5" fill="#2b1d16"/><circle cx="' + (x + 1.8) + '" cy="50" r="1.7" fill="#fff"/>'; };
    switch (f) {
      case 'happy':
        eyes = '<path d="M30 53 q6 -8 12 0 M58 53 q6 -8 12 0" stroke="#2b1d16" stroke-width="3.2" fill="none" stroke-linecap="round"/>';
        mouth = '<path d="M43 67 q7 10 14 0 z" fill="#c2455a"/>'; break;
      case 'wow':
        eyes = '<circle cx="36" cy="51" r="6.5" fill="#2b1d16"/><circle cx="64" cy="51" r="6.5" fill="#2b1d16"/><circle cx="38.5" cy="48.5" r="2.4" fill="#fff"/><circle cx="66.5" cy="48.5" r="2.4" fill="#fff"/><circle cx="34" cy="54" r="1.1" fill="#fff"/><circle cx="62" cy="54" r="1.1" fill="#fff"/>';
        mouth = '<ellipse cx="50" cy="69" rx="4" ry="5" fill="#c2455a"/>';
        extra = '<path d="M84 22 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" fill="#ffd23f"/><path d="M14 30 l1.4 4 4 1.4 -4 1.4 -1.4 4 -1.4 -4 -4 -1.4 4 -1.4z" fill="#ffd23f"/>'; break;
      case 'oops':
        eyes = '<path d="M31 47 l9 5 -9 5 M69 47 l-9 5 9 5" stroke="#2b1d16" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
        mouth = '<path d="M43 69 q3.5 -3 7 0 q3.5 3 7 0" stroke="#2b1d16" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
        extra = '<path d="M82 36 q5 8 0 11 q-5 -3 0 -11z" fill="#7cc8ff"/>'; break;
      case 'think':
        eyes = '<circle cx="39" cy="50" r="4.5" fill="#2b1d16"/><circle cx="67" cy="50" r="4.5" fill="#2b1d16"/><circle cx="40.5" cy="48.5" r="1.4" fill="#fff"/><circle cx="68.5" cy="48.5" r="1.4" fill="#fff"/>';
        mouth = '<path d="M45 69 h10" stroke="#2b1d16" stroke-width="2.4" stroke-linecap="round"/>';
        extra = '<circle cx="84" cy="26" r="3" fill="#b9a6e8"/><circle cx="90" cy="16" r="4.4" fill="#b9a6e8"/>'; break;
      case 'proud':
        eyes = '<path d="M30 52 h12 M58 52 h12" stroke="#2b1d16" stroke-width="3.2" stroke-linecap="round"/>';
        mouth = '<path d="M44 66 q3 4 6 0 q3 4 6 0" stroke="#2b1d16" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
        extra = '<path d="M80 40 l8 -4 M82 48 l9 0" stroke="#ffb020" stroke-width="2.6" stroke-linecap="round"/>'; break;
      case 'sad':
        eyes = dot(36) + dot(64) + '<path d="M29 43 l10 3 M71 43 l-10 3" stroke="#2b1d16" stroke-width="2.4" stroke-linecap="round"/>';
        mouth = '<path d="M44 71 q6 -6 12 0" stroke="#2b1d16" stroke-width="2.4" fill="none" stroke-linecap="round"/>'; break;
      default:
        eyes = dot(36) + dot(64);
        mouth = '<path d="M44 66 q3 4 6 0 q3 4 6 0" stroke="#2b1d16" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    }
    return '<svg class="face f-' + f + '" viewBox="0 0 100 100" aria-hidden="true">' +
      /* 白衣 */
      '<path d="M14 100 q2 -18 22 -20 h28 q20 2 22 20z" fill="#fff" stroke="#cfe3dc" stroke-width="2"/>' +
      '<path d="M36 80 l14 14 14 -14" fill="#5fd3b0" stroke="#cfe3dc" stroke-width="2"/>' +
      /* 耳 */
      '<ellipse cx="20" cy="30" rx="11" ry="9" fill="#c9783f" transform="rotate(-30 20 30)"/><ellipse cx="21" cy="31" rx="6" ry="4.5" fill="#f2a5a5" transform="rotate(-30 21 31)"/>' +
      '<ellipse cx="80" cy="30" rx="11" ry="9" fill="#c9783f" transform="rotate(30 80 30)"/><ellipse cx="79" cy="31" rx="6" ry="4.5" fill="#f2a5a5" transform="rotate(30 79 31)"/>' +
      /* 顔 */
      '<ellipse cx="50" cy="55" rx="38" ry="31" fill="#e9a15b"/>' +
      '<path d="M50 26 q-9 14 -12 28 q-4 18 12 25 q16 -7 12 -25 q-3 -14 -12 -28z" fill="#fff7ec"/>' +
      '<ellipse cx="22" cy="60" rx="9" ry="7" fill="#fff7ec" opacity=".75"/><ellipse cx="78" cy="60" rx="9" ry="7" fill="#fff7ec" opacity=".75"/>' +
      /* ゴーグル（おでこ） */
      '<path d="M16 37 q34 -16 68 0" stroke="#3a8dff" stroke-width="3" fill="none"/>' +
      '<circle cx="38" cy="31" r="7.5" fill="#bfe6ff" stroke="#3a8dff" stroke-width="2.6"/><circle cx="62" cy="31" r="7.5" fill="#bfe6ff" stroke="#3a8dff" stroke-width="2.6"/>' +
      '<path d="M34 28 l4 -2" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M58 28 l4 -2" stroke="#fff" stroke-width="2" stroke-linecap="round"/>' +
      eyes +
      '<ellipse cx="26" cy="62" rx="6" ry="3.6" fill="#ff8fa3" opacity=".55"/><ellipse cx="74" cy="62" rx="6" ry="3.6" fill="#ff8fa3" opacity=".55"/>' +
      '<path d="M46.5 60 h7 q-3.5 5 -3.5 5 q0 0 -3.5 -5z" fill="#ff8fa3"/>' +
      mouth + extra + '</svg>';
  };

  /* =========================================================
   * 演出（粒が弾ける・叩きつけ文字・浮かぶ文字）
   * ========================================================= */
  M.FX = (function () {
    var cv = document.getElementById('fx'), cx = cv.getContext('2d'), parts = [], raf = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var COLS = ['#ff5fa2', '#ffb020', '#2bb673', '#3a8dff', '#9b5cff', '#5fd3b0'];
    function size() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'; }
    addEventListener('resize', size); size();
    function tick() {
      cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, innerWidth, innerHeight);
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        if (p.k === 'fly') {
          /* カウンターへ飛んでいく粒（カーブを描いて吸いこまれる） */
          if (p.delay > 0) { p.delay--; continue; }
          p.t += p.dt;
          if (p.t >= 1) { parts.splice(i, 1); if (p.cb) p.cb(); continue; }
          var u = p.t * p.t, a1 = (1 - u) * (1 - u), b1 = 2 * (1 - u) * u, c1 = u * u;
          var fx = a1 * p.x0 + b1 * p.cx + c1 * p.x1, fy = a1 * p.y0 + b1 * p.cy + c1 * p.y1;
          cx.globalAlpha = 1; cx.fillStyle = p.c; cx.beginPath(); cx.arc(fx, fy, p.s * (1 - u * 0.5), 0, 6.283); cx.fill();
          cx.fillStyle = 'rgba(255,255,255,.6)'; cx.beginPath(); cx.arc(fx - p.s * 0.3, fy - p.s * 0.3, p.s * 0.3, 0, 6.283); cx.fill();
          continue;
        }
        p.life -= p.decay; if (p.life <= 0) { parts.splice(i, 1); continue; }
        p.vx *= p.drag; p.vy = p.vy * p.drag + p.g; p.x += p.vx; p.y += p.vy;
        cx.globalAlpha = Math.min(1, p.life * 1.4);
        var r = p.s * (p.k === 'bub' ? (1.2 - p.life * 0.4) : Math.max(0.3, p.life));
        if (p.k === 'bub') { cx.strokeStyle = p.c; cx.lineWidth = 2; cx.beginPath(); cx.arc(p.x, p.y, r, 0, 6.283); cx.stroke(); cx.fillStyle = 'rgba(255,255,255,.5)'; cx.beginPath(); cx.arc(p.x - r * 0.35, p.y - r * 0.35, r * 0.25, 0, 6.283); cx.fill(); }
        else { cx.fillStyle = p.c; cx.beginPath(); cx.arc(p.x, p.y, r, 0, 6.283); cx.fill(); cx.fillStyle = 'rgba(255,255,255,.55)'; cx.beginPath(); cx.arc(p.x - r * 0.3, p.y - r * 0.3, r * 0.3, 0, 6.283); cx.fill(); }
      }
      cx.globalAlpha = 1;
      raf = parts.length ? requestAnimationFrame(tick) : 0;
    }
    function kick() { if (!raf) raf = requestAnimationFrame(tick); }
    function burst(x, y, n, power) {
      if (E2E) return;
      n = n || 24; power = power || 1;
      for (var i = 0; i < n; i++) {
        var a = Math.random() * 6.283, v = (2 + Math.random() * 6) * power;
        parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, g: 0.22, drag: 0.95, s: 3 + Math.random() * 5, c: M.pick(COLS), life: 1, decay: 0.012 + Math.random() * 0.012, k: 'dot' });
      }
      kick();
    }
    function bubbles(x, y, n) {
      if (E2E) return;
      for (var i = 0; i < (n || 12); i++) parts.push({ x: x + (Math.random() - 0.5) * 80, y: y, vx: (Math.random() - 0.5) * 1.2, vy: -1.5 - Math.random() * 3, g: -0.03, drag: 0.99, s: 4 + Math.random() * 9, c: M.pick(COLS), life: 1, decay: 0.008 + Math.random() * 0.01, k: 'bub' });
      kick();
    }
    function rain(n) {
      if (E2E) return;
      for (var i = 0; i < (n || 80); i++) parts.push({ x: Math.random() * innerWidth, y: -20 - Math.random() * 200, vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 4, g: 0.12, drag: 0.99, s: 3 + Math.random() * 6, c: M.pick(COLS), life: 1.6, decay: 0.006 + Math.random() * 0.006, k: 'dot' });
      kick();
    }
    /* from の要素から to の要素へ、粒が n 個飛んでいく。最初の1個が着いたら arrive() */
    function fly(from, to, n, arrive) {
      if (E2E || !from || !to) { if (arrive) arrive(); return; }
      var a = at(from), b = at(to), first = true;
      for (var i = 0; i < (n || 10); i++) {
        parts.push({ k: 'fly', x0: a[0] + (Math.random() - 0.5) * 40, y0: a[1] + (Math.random() - 0.5) * 20, x1: b[0], y1: b[1],
          cx: a[0] + (Math.random() - 0.5) * 240, cy: Math.min(a[1], b[1]) - 40 - Math.random() * 120,
          t: 0, dt: 0.022 + Math.random() * 0.012, delay: i * 2, s: 4 + Math.random() * 3, c: M.pick(COLS),
          cb: function () { if (first) { first = false; if (arrive) arrive(); } if (window.Sfx) M.snd.tick(); } });
      }
      kick();
    }
    function at(el) { var r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
    /* 画面いっぱいの叩きつけ文字 */
    function slam(html, cls) {
      var s = document.getElementById('slam');
      s.className = cls || ''; s.innerHTML = '<div>' + html + '</div>'; s.hidden = false;
      if (E2E) { s.hidden = true; return Promise.resolve(); }
      return new Promise(function (res) {
        if (M.G) {
          var d = s.firstChild;
          M.G.timeline({ onComplete: function () { s.hidden = true; res(); } })
            .fromTo(d, { scale: 2.6, opacity: 0, rotate: -8 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.38, ease: 'back.out(2.2)' })
            .to(d, { scale: 1.06, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' })
            .to(d, { scale: 0.6, opacity: 0, duration: 0.25, ease: 'power2.in' }, '+=0.2');
        } else setTimeout(function () { s.hidden = true; res(); }, 1200);
      });
    }
    /* 要素から文字が浮かぶ（＋粒 ×1.3 など） */
    function floatText(el, html, cls) {
      if (E2E || !el) return;
      var p = at(el), d = document.createElement('div');
      d.className = 'float ' + (cls || ''); d.innerHTML = html;
      d.style.left = p[0] + 'px'; d.style.top = p[1] + 'px';
      document.body.appendChild(d);
      if (M.G) M.G.fromTo(d, { y: 0, opacity: 0, scale: 0.6 }, { y: -60, opacity: 1, scale: 1.1, duration: 0.5, ease: 'back.out(2)', onComplete: function () { M.G.to(d, { y: -90, opacity: 0, duration: 0.5, delay: 0.3, onComplete: function () { d.remove(); } }); } });
      else setTimeout(function () { d.remove(); }, 1200);
    }
    function shake(el) { if (M.G && el && !E2E) M.G.fromTo(el, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1.2,0.3)' }); }
    return { burst: burst, bubbles: bubbles, rain: rain, fly: fly, at: at, slam: slam, floatText: floatText, shake: shake };
  })();

  /* =========================================================
   * 音（エンジンの audio.js の上に、ラボの音をたす）
   * ========================================================= */
  M.snd = {
    pop: function () { if (!window.Sfx) return; Sfx.raw.play(function (t) { Sfx.raw.tone(520 + Math.random() * 160, t, 0.08, 'sine', 0.16, 1100); }); },
    bloop: function () { if (!window.Sfx) return; Sfx.raw.play(function (t) { Sfx.raw.tone(300, t, 0.14, 'sine', 0.2, 720); Sfx.raw.tone(700, t + 0.08, 0.12, 'sine', 0.12, 1300); }); },
    type: function () { if (!window.Sfx) return; Sfx.raw.play(function (t) { Sfx.raw.tone(1800 + Math.random() * 400, t, 0.025, 'triangle', 0.03); }); },
    tick: function () { if (!window.Sfx) return; Sfx.raw.play(function (t) { Sfx.raw.tone(1200, t, 0.03, 'square', 0.04); }); },
    grow: function () {
      if (!window.Sfx) return; Sfx.raw.buzz([15, 30, 15, 30, 60]);
      Sfx.raw.play(function (t) { [0, 5, 9, 12, 17, 21, 24].forEach(function (s, k) { Sfx.raw.tone(Sfx.raw.hz(s), t + k * 0.07, 0.5, 'triangle', 0.1); Sfx.raw.tone(Sfx.raw.hz(s + 12), t + k * 0.07, 0.3, 'sine', 0.05); }); Sfx.raw.noise(t + 0.4, 1, 0.12, 2000, 12000); });
    },
    exp: function () {
      if (!window.Sfx) return; Sfx.raw.buzz([20, 30, 40]);
      Sfx.raw.play(function (t) { Sfx.raw.tone(200, t, 0.5, 'sawtooth', 0.08, 1600); Sfx.raw.noise(t, 0.6, 0.18, 300, 8000); [0, 7, 12, 19].forEach(function (s, k) { Sfx.raw.tone(Sfx.raw.hz(s + 7), t + 0.35 + k * 0.06, 0.4, 'square', 0.07); }); });
    }
  };
})();
