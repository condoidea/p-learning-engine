/* =========================================================
 * 動かせる図形（ウィジェット）。レッスンの {t:'widget', w:'名前'} で使う
 *  ・指でもマウスでもドラッグできる（pointer events）
 *  ・有名な角度（30°・45°・60°・90° など）の近くで離すと「吸いつく」
 *  ・ミッションを順にクリアすると次へ進める（api.ok）
 *  色：sin＝ピンク、cos＝シアン、tan＝イエロー（背景・問題と共通）
 * ========================================================= */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var K = { sin: '#ff5fa2', cos: '#38d9ff', tan: '#ffd84d', ink: '#e8eeff', dim: 'rgba(232,238,255,.35)', ok: '#5cffb0', hi: '#ff8a5c', vio: '#b48cff' };
  var D2R = Math.PI / 180;

  /* ---------------- 道具 ---------------- */
  function el(tag, a, parent) {
    var e = document.createElementNS(NS, tag);
    if (a) set(e, a);
    if (parent) parent.appendChild(e);
    return e;
  }
  function set(e, a) { for (var k in a) { if (k === 'text') e.textContent = a[k]; else e.setAttribute(k, a[k]); } return e; }
  function stage(api, w, h) {
    var wrap = document.createElement('div'); wrap.className = 'gw';
    var svg = el('svg', { viewBox: '0 0 ' + w + ' ' + h, class: 'gw-svg' });
    wrap.appendChild(svg);
    var read = document.createElement('div'); read.className = 'gw-read';
    wrap.appendChild(read);
    api.el.appendChild(wrap);
    var yay = document.createElement('div'); yay.className = 'gw-yay'; wrap.appendChild(yay);
    return { svg: svg, read: read, wrap: wrap, yay: yay, w: w, h: h };
  }
  function toPt(svg, ev) {
    var p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY;
    var m = svg.getScreenCTM(); if (!m) return { x: 0, y: 0 };
    p = p.matrixTransform(m.inverse()); return { x: p.x, y: p.y };
  }
  /* つまめる点：大きめの当たり判定＋つまんだら少し大きく */
  function handle(svg, x, y, color, onMove, onEnd) {
    var g = el('g', { class: 'gw-h' }, svg);
    var hit = el('circle', { r: 22, fill: 'transparent' }, g);
    var ring = el('circle', { r: 11, fill: 'none', stroke: color, 'stroke-width': 2, opacity: 0.5, class: 'gw-ring' }, g);
    var dot = el('circle', { r: 7, fill: color, stroke: '#0b0e24', 'stroke-width': 2 }, g);
    var drag = false;
    function pos(px, py) { set(g, { transform: 'translate(' + px.toFixed(2) + ',' + py.toFixed(2) + ')' }); }
    pos(x, y);
    g.addEventListener('pointerdown', function (ev) {
      ev.preventDefault(); drag = true; g.setPointerCapture(ev.pointerId);
      gsap.to(dot, { attr: { r: 9.5 }, duration: 0.18, ease: 'back.out(3)' }); gsap.to(ring, { attr: { r: 17 }, opacity: 0.9, duration: 0.2 });
    });
    g.addEventListener('pointermove', function (ev) { if (!drag) return; var p = toPt(svg, ev); onMove(p.x, p.y); });
    function up() {
      if (!drag) return; drag = false;
      gsap.to(dot, { attr: { r: 7 }, duration: 0.3, ease: 'back.out(2)' }); gsap.to(ring, { attr: { r: 11 }, opacity: 0.5, duration: 0.3 });
      if (onEnd) onEnd();
    }
    g.addEventListener('pointerup', up); g.addEventListener('pointercancel', up);
    /* 待機中は輪がゆっくり呼吸する（触れるものだと伝える） */
    gsap.to(ring, { attr: { r: 14 }, opacity: 0.2, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    return { g: g, pos: pos };
  }
  function line(p, a, b, color, w, extra) { return el('line', Object.assign({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: color, 'stroke-width': w || 2, 'stroke-linecap': 'round' }, extra || {}), p); }
  function mvLine(l, a, b) { set(l, { x1: a.x, y1: a.y, x2: b.x, y2: b.y }); }
  function text(p, x, y, s, color, size, extra) { return el('text', Object.assign({ x: x, y: y, fill: color || K.ink, 'font-size': size || 13, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'gw-t' }, extra || {}), p).appendChild(document.createTextNode(s)).parentNode; }
  function mvText(t, x, y, s) { set(t, { x: x, y: y }); if (s != null) t.textContent = s; }
  /* 角の弧（頂点 v、方向 a→b を小さい方で） */
  function arcPath(v, a, b, r) {
    var a1 = Math.atan2(a.y - v.y, a.x - v.x), a2 = Math.atan2(b.y - v.y, b.x - v.x);
    var d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    var x1 = v.x + r * Math.cos(a1), y1 = v.y + r * Math.sin(a1), x2 = v.x + r * Math.cos(a1 + d), y2 = v.y + r * Math.sin(a1 + d);
    return 'M' + x1.toFixed(2) + ',' + y1.toFixed(2) + ' A' + r + ',' + r + ' 0 0,' + (d > 0 ? 1 : 0) + ' ' + x2.toFixed(2) + ',' + y2.toFixed(2);
  }
  function angDeg(v, a, b) {
    var x1 = a.x - v.x, y1 = a.y - v.y, x2 = b.x - v.x, y2 = b.y - v.y;
    var c = (x1 * x2 + y1 * y2) / (Math.hypot(x1, y1) * Math.hypot(x2, y2));
    return Math.acos(Math.max(-1, Math.min(1, c))) / D2R;
  }
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function onCircle(c, r, deg) { return { x: c.x + r * Math.cos(deg * D2R), y: c.y - r * Math.sin(deg * D2R) }; }
  function degOf(c, p) { var d = Math.atan2(c.y - p.y, p.x - c.x) / D2R; return (d + 360) % 360; }
  function f(v, n) { n = n == null ? 2 : n; return (Math.abs(v) < 1e-9 ? 0 : v).toFixed(n); }
  /* 有名角への吸いつき */
  function snapTo(v, list, tol) { for (var i = 0; i < list.length; i++) if (Math.abs(v - list[i]) <= tol) return list[i]; return v; }
  /* 値をなめらかにアニメーションさせながら set する */
  function tweenVal(obj, key, to, cb, dur) { var o = {}; o[key] = to; gsap.to(obj, Object.assign(o, { duration: dur || 0.45, ease: 'back.out(1.8)', onUpdate: cb, overwrite: true })); }

  /* やったね表示（ウィジェットの上にふわっと） */
  function yay(st, msg) {
    st.yay.textContent = msg;
    gsap.killTweensOf(st.yay);
    gsap.fromTo(st.yay, { opacity: 0, y: 14, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(3)' });
    gsap.to(st.yay, { opacity: 0, y: -10, duration: 0.4, delay: 1.3 });
  }
  /* ミッション：上から順にクリア。最後で api.ok */
  function missions(api, st, list) {
    var i = 0, last;
    /* 進み具合：prog() が [今, 目標] を返すミッションは「●●○」で見せる */
    function dots(it) { if (!it.prog) return ''; var p = it.prog(), d = ''; for (var k = 0; k < p[1]; k++) d += k < Math.min(p[0], p[1]) ? '●' : '○'; return '　<span class="gw-dots">' + d + '</span>'; }
    function show() { if (list[i]) api.goal(list[i].goal + dots(list[i]) + (list.length > 1 ? '　<small>(' + (i + 1) + '/' + list.length + ')</small>' : '')); }
    show();
    var m = {
      check: function (s) {
        last = s;
        if (i >= list.length || api.isDone()) return;
        if (list[i].test(s)) {
          var cur = list[i]; i++;
          api.ding(i); yay(st, cur.yay || 'OK！');
          var r = st.wrap.getBoundingClientRect(); api.burst(r.left + r.width / 2, r.top + r.height * 0.4, 22);
          if (i >= list.length) setTimeout(function () { api.ok(cur.msg); }, 350);
          /* 次のミッションへ。すでに条件を満たしていれば（順番どおりでなくても）そのまま合格 */
          else setTimeout(function () { show(); m.check(last); }, 700);
        } else if (list[i].prog) show();   // 進み具合だけ更新
      },
      at: function () { return i; }
    };
    return m;
  }
  /* 読み取り欄（KaTeX つき） */
  function readout(api, st, html) { st.read.innerHTML = api.html(html); }

  LE.widgets = {};

  /* =========================================================
   * sct：筆記体の s・c・t で三角比を覚える
   *  三角形の辺の上に、筆記体の文字をペンで書く。
   *  ペンが ① 最初に通った辺 → 分母、② 次に通った辺 → 分子。
   *  書き終わると、①②の辺の名前が右の分数の「下」「上」へ飛んでいく
   * ========================================================= */
  LE.widgets.sct = function (api) {
    var st = stage(api, 360, 210);
    var A = { x: 30, y: 175 }, B = { x: 228, y: 175 }, C = { x: 228, y: 52 };
    el('polygon', { points: [A, B, C].map(function (p) { return p.x + ',' + p.y; }).join(' '), fill: 'rgba(255,255,255,.04)', stroke: K.dim, 'stroke-width': 2 }, st.svg);
    el('path', { d: 'M216,175 v-12 h12', fill: 'none', stroke: K.dim, 'stroke-width': 1.5 }, st.svg);
    el('path', { d: arcPath(A, B, C, 28), fill: 'none', stroke: K.ink, 'stroke-width': 1.5 }, st.svg);
    text(st.svg, 70, 166, 'θ', K.ink, 15);
    var LBL = { c: { x: 116, y: 100 }, a: { x: 246, y: 114 }, b: { x: 129, y: 194 } };
    var lab = { c: text(st.svg, LBL.c.x, LBL.c.y, 'c', K.ink, 18), a: text(st.svg, LBL.a.x, LBL.a.y, 'a', K.ink, 18), b: text(st.svg, LBL.b.x, LBL.b.y, 'b', K.ink, 18) };
    /* 右側：分数の置き場 */
    var fx = 310;
    var fName = text(st.svg, fx, 36, '', K.ink, 17, { 'font-style': 'italic' });
    var fBar = line(st.svg, { x: fx, y: 112 }, { x: fx, y: 112 }, K.ink, 2.5);
    var slotT = el('rect', { x: fx - 18, y: 66, width: 36, height: 34, rx: 7, fill: 'none', stroke: K.dim, 'stroke-dasharray': '4 4' }, st.svg);
    var slotB = el('rect', { x: fx - 18, y: 124, width: 36, height: 34, rx: 7, fill: 'none', stroke: K.dim, 'stroke-dasharray': '4 4' }, st.svg);
    text(st.svg, fx + 34, 83, '②', K.dim, 12); text(st.svg, fx + 34, 141, '①', K.dim, 12);
    text(st.svg, fx, 186, '①分母 ②分子', K.dim, 10);
    var layer = el('g', {}, st.svg);
    var ink = el('path', { fill: 'none', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, st.svg);
    var pen = el('circle', { r: 7, fill: '#fff' }, st.svg); set(pen, { opacity: 0 });
    /* 筆の道：辺の上を通りながら、文字の形のはね・しっぽをつけた */
    var MID = { c: { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 }, a: { x: C.x, y: (B.y + C.y) / 2 }, b: { x: (A.x + B.x) / 2, y: A.y } };
    var R = {
      sin: { d: 'M16,188 Q20,170 30,175 L228,52 Q252,112 230,162 Q220,190 192,182', c: K.sin, first: 'c', second: 'a', t1: 0.22, t2: 0.7,
        name: 'sin θ', letter: 's', say: '筆記体の <b>s</b> は、θ の角から<b>斜辺 c</b> をかけ上がって、<b>たて a</b> をおりる。<br>① c が分母、② a が分子 → $\\S\\theta=\\dfrac{a}{c}$' },
      cos: { d: 'M246,38 Q236,36 228,52 L30,175 L228,175 Q246,173 250,158', c: K.cos, first: 'c', second: 'b', t1: 0.22, t2: 0.72,
        name: 'cos θ', letter: 'c', say: '筆記体の <b>c</b> は、上から<b>斜辺 c</b> をおりて、<b>底辺 b</b> を右へ（「&lt;」の形）。<br>① c が分母、② b が分子 → $\\C\\theta=\\dfrac{b}{c}$' },
      tan: { d: 'M30,175 L228,175 L228,52 M204,82 L252,82', c: K.tan, first: 'b', second: 'a', t1: 0.2, t2: 0.62,
        name: 'tan θ', letter: 't', say: '筆記体の <b>t</b> は、<b>底辺 b</b> を走って、<b>たて a</b> を上へ。最後に横棒をピッ。<br>① b が分母、② a が分子 → $\\T\\theta=\\dfrac{a}{b}$' }
    };
    function badge(n, side, col) {
      var p = MID[side], g = el('g', { transform: 'translate(' + p.x + ',' + p.y + ')' }, layer);
      el('circle', { r: 11, fill: col, stroke: '#0b0e24', 'stroke-width': 2 }, g);
      text(g, 0, 1, n, '#0b0e24', 12);
      gsap.fromTo(g, { scale: 0, transformOrigin: 'center' }, { scale: 1, duration: 0.35, ease: 'back.out(3)' });
    }
    function fly(side, to, col) {
      var from = LBL[side], t = text(layer, from.x, from.y, side, col, 20);
      var o = { x: from.x, y: from.y };
      return gsap.to(o, { x: to.x, y: to.y, duration: 0.6, ease: 'back.out(1.6)', onUpdate: function () { set(t, { x: o.x, y: o.y }); } });
    }
    var seen = {}, btns = document.createElement('div'); btns.className = 'gw-btns';
    ['sin', 'cos', 'tan'].forEach(function (k) {
      var b = document.createElement('button'); b.className = 'gw-btn gw-' + k; b.textContent = k; btns.appendChild(b);
      b.addEventListener('click', function () { play(k); });
    });
    st.wrap.insertBefore(btns, st.read);
    readout(api, st, 'ボタンを押すと、筆記体を書くペンが三角形の辺の上を走るよ');
    var m = missions(api, st, [{ goal: 'sin・cos・tan の3つとも、ペンの動きを見よう', test: function () { return Object.keys(seen).length >= 3; }, prog: function () { return [Object.keys(seen).length, 3]; }, yay: '3つ制覇！', msg: 'θ の角から書き始めて、①最初に通った辺が分母、②次に通った辺が分子。テスト中は空中で筆記体を書いて思い出そう。' }]);
    var tl;
    function play(k) {
      var r = R[k];
      if (tl) tl.kill();
      layer.innerHTML = '';
      ['a', 'b', 'c'].forEach(function (s) { set(lab[s], { fill: K.ink }); });
      set(fName, { fill: r.c }); fName.textContent = r.name + ' =';
      set(fBar, { x1: fx, x2: fx, stroke: r.c });
      set(ink, { d: r.d, stroke: r.c });
      var len = ink.getTotalLength();
      set(ink, { 'stroke-dasharray': len, 'stroke-dashoffset': len });
      var o = { t: 0 }, b1 = false, b2 = false;
      tl = gsap.timeline();
      tl.set(pen, { opacity: 1 })
        .to(o, { t: 1, duration: 1.9, ease: 'power1.inOut', onUpdate: function () {
          set(ink, { 'stroke-dashoffset': len * (1 - o.t) });
          var p = ink.getPointAtLength(len * o.t); set(pen, { cx: p.x, cy: p.y });
          if (!b1 && o.t > r.t1) { b1 = true; badge('1', r.first, r.c); set(lab[r.first], { fill: r.c }); api.tick(); }
          if (!b2 && o.t > r.t2) { b2 = true; badge('2', r.second, r.c); set(lab[r.second], { fill: r.c }); api.tick(); }
        } })
        .to(pen, { opacity: 0, duration: 0.2 })
        .add(fly(r.first, { x: fx, y: 142 }, r.c))
        .add(fly(r.second, { x: fx, y: 84 }, r.c), '-=0.25')
        .to(fBar, { attr: { x1: fx - 22, x2: fx + 22 }, duration: 0.3, ease: 'power2.out' }, '-=0.2')
        .add(function () {
          readout(api, st, r.say);
          gsap.fromTo(st.read, { scale: 0.92, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' });
          api.ding(Object.keys(seen).length + 1);
          seen[k] = 1; m.check();
        });
      api.tick();
    }
    return { solve: function () { seen = { sin: 1, cos: 1, tan: 1 }; m.check(); } };
  };

  /* =========================================================
   * rtri：直角三角形
   *  mode 'angle'：斜辺の先の点を、点線の「レール（円弧）」にそって回すと角θが変わる
   *  mode 'size' ：同じ点を斜辺の向きにのばしたり縮めたりすると、大きさだけが変わる
   * ========================================================= */
  LE.widgets.rtri = function (api, s) {
    var st = stage(api, 320, 230);
    var A = { x: 34, y: 205 }, Lmax = 190, th = s.mode === 'size' ? (s.th || 35) : 20, size = s.mode === 'size' ? 0.85 : 1;
    var guide = el('path', { fill: 'none', stroke: 'rgba(255,255,255,.22)', 'stroke-width': 2, 'stroke-dasharray': '3 7', 'stroke-linecap': 'round' }, st.svg);
    var tri = el('polygon', { fill: 'rgba(255,255,255,.04)', stroke: K.dim, 'stroke-width': 2 }, st.svg);
    var la = line(st.svg, A, A, K.sin, 5), lb = line(st.svg, A, A, K.cos, 5), lc = line(st.svg, A, A, K.ink, 2.5);
    var arc = el('path', { fill: 'none', stroke: K.ink, 'stroke-width': 1.5 }, st.svg);
    var tTh = text(st.svg, 0, 0, '', K.ink, 13), tA = text(st.svg, 0, 0, 'a', K.sin, 15), tB = text(st.svg, 0, 0, 'b', K.cos, 15), tC = text(st.svg, 0, 0, 'c', K.ink, 15);
    var sq = el('path', { fill: 'none', stroke: K.dim, 'stroke-width': 1.3 }, st.svg);
    var B, C, h, sizes = {};
    if (s.mode === 'size') set(guide, { d: 'M' + A.x + ',' + A.y + ' L' + (A.x + Lmax * 1.05 * Math.cos(th * D2R)).toFixed(1) + ',' + (A.y - Lmax * 1.05 * Math.sin(th * D2R)).toFixed(1) });
    else set(guide, { d: 'M' + (A.x + Lmax) + ',' + A.y + ' A' + Lmax + ',' + Lmax + ' 0 0,0 ' + (A.x + Lmax * Math.cos(78 * D2R)).toFixed(1) + ',' + (A.y - Lmax * Math.sin(78 * D2R)).toFixed(1) });
    function draw() {
      var L = Lmax * size;
      C = { x: A.x + L * Math.cos(th * D2R), y: A.y - L * Math.sin(th * D2R) };
      B = { x: C.x, y: A.y };
      set(tri, { points: [A, B, C].map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ') });
      mvLine(la, B, C); mvLine(lb, A, B); mvLine(lc, A, C);
      set(arc, { d: arcPath(A, B, C, 30) });
      set(sq, { d: 'M' + (B.x - 11) + ',' + B.y + ' v-11 h11' });
      mvText(tTh, A.x + 46 * Math.cos(th / 2 * D2R), A.y - 46 * Math.sin(th / 2 * D2R), Math.round(th) + '°');
      mvText(tA, B.x + 14, (B.y + C.y) / 2); mvText(tB, (A.x + B.x) / 2, A.y + 16); mvText(tC, (A.x + C.x) / 2 - 12, (A.y + C.y) / 2 - 10);
      h.pos(C.x, C.y);
      var sn = Math.sin(th * D2R), cs = Math.cos(th * D2R), tn = Math.tan(th * D2R);
      readout(api, st, '$\\theta=' + Math.round(th) + '^\\circ$　　$\\S\\theta=' + f(sn) + '$　$\\C\\theta=' + f(cs) + '$　$\\T\\theta=' + f(tn) + '$' +
        (s.mode === 'size' ? '<br><small>辺の長さ：a=' + f((B.y - C.y) / 40, 1) + '　b=' + f((B.x - A.x) / 40, 1) + '　c=' + f(L / 40, 1) + '（大きさが変わっても比は同じ）</small>' : '<br><small>点を点線のレールにそって回そう</small>'));
    }
    function snapEnd() {
      var t = snapTo(th, [30, 45, 60], 4);
      if (t !== th) { var o = { v: th }; gsap.to(o, { v: t, duration: 0.45, ease: 'back.out(2.5)', onUpdate: function () { th = o.v; draw(); }, onComplete: function () { th = t; draw(); m.check(); } }); api.tick(); }
      else m.check();
    }
    if (s.mode === 'size') {
      h = handle(st.svg, 0, 0, K.cos, function (x, y) {
        var ux = Math.cos(th * D2R), uy = -Math.sin(th * D2R), d = (x - A.x) * ux + (y - A.y) * uy;   // 斜辺の向きへの射影
        size = Math.max(0.3, Math.min(1, d / Lmax)); draw();
      }, function () { sizes[Math.round(size * 5)] = 1; m.check(); });
    } else {
      h = handle(st.svg, 0, 0, K.sin, function (x, y) { th = Math.max(8, Math.min(78, degOf(A, { x: x, y: y }))); draw(); }, snapEnd);
    }
    var list = s.mode === 'size'
      ? [{ goal: '青い点を斜辺の向きに動かして、三角形の<b>大きさ</b>をいろいろ変えてみよう（角度はそのまま）', test: function () { return Object.keys(sizes).length >= 3; }, prog: function () { return [Object.keys(sizes).length, 3]; }, yay: '値が変わらない！', msg: '大きさを変えても sin・cos・tan は同じ。三角比は「角度だけ」で決まる！' }]
      : [{ goal: 'ピンクの点を<b>レールにそって回し</b>、$\\S\\theta=0.50$ にしよう', test: function () { return Math.round(th) === 30; }, yay: 'θ=30°！' },
         { goal: '次は $\\S\\theta=\\C\\theta$（ピンクとシアンが同じ長さ）になる角度へ', test: function () { return Math.round(th) === 45; }, yay: 'θ=45°！' },
         { goal: '$\\T\\theta$ が $1.73$（＝$\\sqrt3$）になる角度は？', test: function () { return Math.round(th) === 60; }, yay: 'θ=60°！', msg: '30°・45°・60° は三角定規の角度。次のレッスンでくわしく！' }];
    var m = missions(api, st, list);
    draw();
    return { solve: function () {
      if (s.mode === 'size') { sizes = { 1: 1, 2: 1, 3: 1 }; m.check(); return; }
      [30, 45, 60].forEach(function (v) { th = v; draw(); m.check(); });
    } };
  };

  /* =========================================================
   * scribe：三角形の上に筆記体の s・c・t を書いて、値を組み立てる（復習にも使う）
   *  s.stages = [{deg, name, th, lab:{a,b,c}, tex:{a,b,c}, ask:['sin'], val:{sin:'…'}, goal, tr:'flip'|'morph', caption, u, circle}]
   *   ・ボタン（sin/cos/tan）を押すと、ペンが辺の上を走る → ①②のバッジ → 辺の長さが分数へ飛ぶ → 値
   *   ・ask の関数をぜんぶ書いたら「次へ」。tr:'flip' は直角の頂点を通る線で三角形を裏返す
   *     （たてとよこが本当に入れかわるのが見える）、'morph' は形をなめらかに変える
   * ========================================================= */
  LE.widgets.scribe = function (api, s) {
    var st = stage(api, 360, 250);
    var B0 = { x: 236, y: 222 };
    var deco = el('g', {}, st.svg), body = el('g', {}, st.svg), fl = el('g', {}, st.svg);
    var ink = el('path', { fill: 'none', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, st.svg);
    var pen = el('circle', { r: 7, fill: '#fff' }, st.svg); set(pen, { opacity: 0 });
    var fx = 314;
    var fName = text(st.svg, fx, 34, '', K.ink, 14, { 'font-style': 'italic' });
    var fBar = line(st.svg, { x: fx, y: 117 }, { x: fx, y: 117 }, K.ink, 2.5);
    el('rect', { x: fx - 21, y: 70, width: 42, height: 36, rx: 8, fill: 'none', stroke: K.dim, 'stroke-dasharray': '4 4' }, st.svg);
    el('rect', { x: fx - 21, y: 128, width: 42, height: 36, rx: 8, fill: 'none', stroke: K.dim, 'stroke-dasharray': '4 4' }, st.svg);
    text(st.svg, fx, 60, '② 分子', K.dim, 10); text(st.svg, fx, 176, '① 分母', K.dim, 10);
    var MAC = { sin: '\\S', cos: '\\C', tan: '\\T' };
    var ROLE = { sin: { den: 'c', num: 'a' }, cos: { den: 'c', num: 'b' }, tan: { den: 'b', num: 'a' } };
    var stages = s.stages, si = 0, G = null, done = {}, busy = false, tl;
    var btns = document.createElement('div'); btns.className = 'gw-btns';
    var B = {};
    ['sin', 'cos', 'tan'].forEach(function (k) {
      var b = document.createElement('button'); b.className = 'gw-btn gw-' + k; b.textContent = k; btns.appendChild(b); B[k] = b;
      b.addEventListener('click', function () { write(k); });
    });
    var nextB = document.createElement('button'); nextB.className = 'gw-btn gw-next'; nextB.style.display = 'none'; btns.appendChild(nextB);
    nextB.addEventListener('click', function () { if (!busy) go(si + 1); });
    st.wrap.insertBefore(btns, st.read);

    function fit(sg) {
      var r = sg.deg * D2R, an = Math.sin(r), bn = Math.cos(r), u = sg.u || Math.min(205 / bn, 185 / an);
      return { A: { x: B0.x - bn * u, y: B0.y }, B: { x: B0.x, y: B0.y }, C: { x: B0.x, y: B0.y - an * u } };
    }
    function P(p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }
    function mid(p, q) { return { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 }; }
    /* 三角形を描く。sides = [[p,q,ラベル], …]、opt.deco=false で角の印をかくす */
    function drawTri(A, Bv, C, lab, opt) {
      opt = opt || {};
      body.innerHTML = '';
      var cen = { x: (A.x + Bv.x + C.x) / 3, y: (A.y + Bv.y + C.y) / 3 };
      el('polygon', { points: P(A) + ' ' + P(Bv) + ' ' + P(C), fill: 'rgba(255,255,255,.05)', stroke: 'rgba(232,238,255,.8)', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, body);
      if (opt.deco !== false) {
        var ua = { x: (A.x - Bv.x), y: (A.y - Bv.y) }, uc = { x: (C.x - Bv.x), y: (C.y - Bv.y) }, la = Math.hypot(ua.x, ua.y), lc = Math.hypot(uc.x, uc.y);
        if (la > 20 && lc > 20) {
          var p1 = { x: Bv.x + ua.x / la * 12, y: Bv.y + ua.y / la * 12 }, p3 = { x: Bv.x + uc.x / lc * 12, y: Bv.y + uc.y / lc * 12 };
          el('path', { d: 'M' + P(p1) + ' L' + (p1.x + p3.x - Bv.x).toFixed(1) + ',' + (p1.y + p3.y - Bv.y).toFixed(1) + ' L' + P(p3), fill: 'none', stroke: K.dim, 'stroke-width': 1.5 }, body);
          el('path', { d: arcPath(A, Bv, C, 28), fill: 'none', stroke: K.ink, 'stroke-width': 1.8 }, body);
          var bis = Math.atan2(((Bv.y - A.y) / Math.hypot(Bv.x - A.x, Bv.y - A.y) + (C.y - A.y) / Math.hypot(C.x - A.x, C.y - A.y)), ((Bv.x - A.x) / Math.hypot(Bv.x - A.x, Bv.y - A.y) + (C.x - A.x) / Math.hypot(C.x - A.x, C.y - A.y)));
          text(body, A.x + 50 * Math.cos(bis), A.y + 50 * Math.sin(bis), opt.th || '', K.ink, 13);
        }
      }
      if (opt.circle) {
        var R = Math.hypot(C.x - A.x, C.y - A.y);
        el('path', { d: 'M' + (A.x + R) + ',' + A.y + ' A' + R + ',' + R + ' 0 0,0 ' + (A.x - R) + ',' + A.y, fill: 'none', stroke: 'rgba(232,238,255,.3)', 'stroke-width': 1.5, 'stroke-dasharray': '5 5' }, body);
        el('line', { x1: A.x - R - 6, y1: A.y, x2: A.x + R + 6, y2: A.y, stroke: K.dim, 'stroke-width': 1.2 }, body);
        text(body, A.x - 8, A.y + 14, 'O', K.dim, 11);
      }
      var pos = {};
      [['b', A, Bv], ['a', Bv, C], ['c', A, C]].forEach(function (sd) {
        var m = mid(sd[1], sd[2]), dx = m.x - cen.x, dy = m.y - cen.y, L = Math.hypot(dx, dy) || 1;
        pos[sd[0]] = { x: m.x + dx / L * 16, y: m.y + dy / L * 16 };
        text(body, pos[sd[0]].x, pos[sd[0]].y, lab[sd[0]], K.ink, 17);
      });
      return pos;
    }
    function show(i) {
      var sg = stages[i];
      G = fit(sg);
      G.pos = drawTri(G.A, G.B, G.C, sg.lab, { th: sg.th, circle: sg.circle });
      done = {};
      ['sin', 'cos', 'tan'].forEach(function (k) { B[k].classList.toggle('ask', sg.ask.indexOf(k) >= 0); });
      nextB.style.display = 'none';
      api.goal(sg.goal || ('ボタンを押して ' + sg.ask.join('・') + ' を書いてみよう'));
    }
    function resetFrac(fn) {
      fl.innerHTML = '';
      set(fName, { fill: K[fn] }); fName.textContent = fn + ' ' + (stages[si].th || '') + ' =';
      set(fBar, { x1: fx, x2: fx, stroke: K[fn] });
    }
    function pathOf(fn) {
      var A = G.A, Bv = G.B, C = G.C;
      if (fn === 'sin') return 'M' + (A.x - 14) + ',' + (A.y + 12) + ' Q' + (A.x - 8) + ',' + (A.y - 4) + ' ' + P(A) + ' L' + P(C) + ' Q' + (C.x + 22) + ',' + ((C.y + Bv.y) / 2) + ' ' + (Bv.x + 2) + ',' + (Bv.y - 12) + ' Q' + (Bv.x - 6) + ',' + (Bv.y + 14) + ' ' + (Bv.x - 32) + ',' + (Bv.y + 8);
      if (fn === 'cos') return 'M' + (C.x + 18) + ',' + (C.y - 12) + ' Q' + (C.x + 6) + ',' + (C.y - 16) + ' ' + P(C) + ' L' + P(A) + ' L' + P(Bv) + ' Q' + (Bv.x + 16) + ',' + (Bv.y - 2) + ' ' + (Bv.x + 20) + ',' + (Bv.y - 16);
      return 'M' + P(A) + ' L' + P(Bv) + ' L' + P(C) + ' M' + (C.x - 22) + ',' + (C.y + 26) + ' L' + (C.x + 22) + ',' + (C.y + 26);
    }
    function badge(n, side, col) {
      var A = G.A, Bv = G.B, C = G.C, m = side === 'a' ? mid(Bv, C) : side === 'b' ? mid(A, Bv) : mid(A, C);
      var g = el('g', { transform: 'translate(' + P(m) + ')' }, fl);
      el('circle', { r: 11, fill: col, stroke: '#0b0e24', 'stroke-width': 2 }, g);
      text(g, 0, 1, n, '#0b0e24', 12);
      gsap.fromTo(g, { scale: 0, transformOrigin: 'center' }, { scale: 1, duration: 0.35, ease: 'back.out(3)' });
    }
    function fly(side, to, col) {
      var from = G.pos[side], t = text(fl, from.x, from.y, stages[si].lab[side], col, 19), o = { x: from.x, y: from.y };
      return gsap.to(o, { x: to.x, y: to.y, duration: 0.55, ease: 'back.out(1.7)', onUpdate: function () { set(t, { x: o.x, y: o.y }); } });
    }
    function write(fn) {
      if (busy || !G) return;
      busy = true;
      var sg = stages[si], r = ROLE[fn], col = K[fn];
      if (tl) tl.kill();
      resetFrac(fn);
      G.pos = drawTri(G.A, G.B, G.C, sg.lab, { th: sg.th, circle: sg.circle });
      set(ink, { d: pathOf(fn), stroke: col, opacity: 1 });
      var len = ink.getTotalLength(); set(ink, { 'stroke-dasharray': len, 'stroke-dashoffset': len });
      var o = { t: 0 }, b1 = false, b2 = false, t1 = fn === 'tan' ? 0.25 : 0.3, t2 = fn === 'tan' ? 0.68 : 0.72;
      tl = gsap.timeline();
      tl.set(pen, { opacity: 1 })
        .to(o, { t: 1, duration: 1.7, ease: 'power1.inOut', onUpdate: function () {
          set(ink, { 'stroke-dashoffset': len * (1 - o.t) });
          var p = ink.getPointAtLength(len * o.t); set(pen, { cx: p.x, cy: p.y });
          if (!b1 && o.t > t1) { b1 = true; badge('1', r.den, col); api.tick(); }
          if (!b2 && o.t > t2) { b2 = true; badge('2', r.num, col); api.tick(); }
        } })
        .to(pen, { opacity: 0, duration: 0.15 })
        .add(fly(r.den, { x: fx, y: 147 }, col))
        .add(fly(r.num, { x: fx, y: 89 }, col), '-=0.25')
        .to(fBar, { attr: { x1: fx - 24, x2: fx + 24 }, duration: 0.3, ease: 'power2.out' }, '-=0.2')
        .add(function () {
          var fr = '\\dfrac{' + sg.tex[r.num] + '}{' + sg.tex[r.den] + '}', v = sg.val && sg.val[fn];
          readout(api, st, '$' + MAC[fn] + (sg.name ? sg.name : '') + '=' + fr + (v ? '=' + v : '') + '$');
          gsap.fromTo(st.read, { scale: 0.88, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2.5)' });
          api.ding(Object.keys(done).length + 1);
          busy = false;
          if (sg.ask.indexOf(fn) >= 0) done[fn] = 1;
          if (sg.ask.every(function (k) { return done[k]; })) {
            if (si >= stages.length - 1) { yay(st, 'カンペキ！'); setTimeout(function () { api.ok(s.ok); }, 500); }
            else { yay(st, 'OK！'); nextB.textContent = '次へ：' + (stages[si + 1].btn || stages[si + 1].th) + ' ▶'; nextB.style.display = ''; gsap.fromTo(nextB, { scale: 0.6 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' }); api.goal(stages[si + 1].lead || '「次へ」を押そう'); }
          }
        });
      api.tick();
    }
    /* 次の三角形へ：flip（直角の頂点を通る線で裏返す）か morph（形をなめらかに変える） */
    function go(i) {
      var nx = stages[i], from = G, to = fit(nx);
      busy = true; nextB.style.display = 'none';
      fl.innerHTML = ''; set(ink, { opacity: 0 });
      if (nx.caption) readout(api, st, nx.caption);
      var o = { t: 0 }, cur = stages[si];
      var tlx = gsap.timeline({ onComplete: function () { si = i; busy = false; show(i); } });
      if (nx.tr === 'flip') {
        /* v=(p−B) を (vy, vx) に：直角の頂点を通る斜め45°の線で鏡に映すのと同じ。半分で三角形がぺちゃんこになり、裏側が開く */
        var Bv = from.B, vA = { x: from.A.x - Bv.x, y: from.A.y - Bv.y }, vC = { x: from.C.x - Bv.x, y: from.C.y - Bv.y };
        var labA = cur.lab;
        tlx.to(o, { t: 1, duration: 1.1, ease: 'power2.inOut', onUpdate: function () {
          var t = o.t, A2 = { x: Bv.x + vA.x + t * (vA.y - vA.x), y: Bv.y + vA.y + t * (vA.x - vA.y) }, C2 = { x: Bv.x + vC.x + t * (vC.y - vC.x), y: Bv.y + vC.y + t * (vC.x - vC.y) };
          /* もとの A は上へ、もとの C は左下へ。ラベルは辺にくっついたまま動く */
          drawTri(A2, Bv, C2, { b: labA.b, a: labA.a, c: labA.c }, { deco: false });
        } });
        /* 裏返し後：新しい A＝もとの C の位置、新しい C＝もとの A の位置 → 見やすい大きさへ */
        var fA = { x: Bv.x + vC.y, y: Bv.y + vC.x }, fC = { x: Bv.x + vA.y, y: Bv.y + vA.x }, o2 = { t: 0 };
        tlx.to(o2, { t: 1, duration: 0.6, ease: 'power2.inOut', onUpdate: function () {
          var t = o2.t, A3 = { x: fA.x + (to.A.x - fA.x) * t, y: fA.y + (to.A.y - fA.y) * t }, C3 = { x: fC.x + (to.C.x - fC.x) * t, y: fC.y + (to.C.y - fC.y) * t };
          drawTri(A3, to.B, C3, nx.lab, { th: t > 0.5 ? nx.th : '', circle: nx.circle });
        } });
      } else {
        tlx.to(o, { t: 1, duration: 1.0, ease: 'power2.inOut', onUpdate: function () {
          var t = o.t, A3 = { x: from.A.x + (to.A.x - from.A.x) * t, y: from.A.y + (to.A.y - from.A.y) * t }, C3 = { x: from.C.x + (to.C.x - from.C.x) * t, y: from.C.y + (to.C.y - from.C.y) * t };
          drawTri(A3, to.B, C3, t < 0.5 ? cur.lab : nx.lab, { th: t < 0.5 ? cur.th : nx.th, circle: nx.circle });
        } });
      }
      api.tick();
    }
    readout(api, st, s.intro || 'ボタンを押すと、筆記体を書くペンが辺の上を走るよ');
    show(0);
    return { solve: function () { si = stages.length - 1; api.ok(s.ok); } };
  };

  /* =========================================================
   * ruler：三角定規で値を出す
   *  お題（例：tan 30°）の角を左下に置いた三角定規が出てくる。
   *  ① 分母になる辺 → ② 分子になる辺 の順にタップ。辺の長さが分数に飛んでいき、値が完成する。
   *  60° のときは定規がくるっと裏返って、60° が左下に来る（たてとよこが入れかわる）
   * ========================================================= */
  LE.widgets.ruler = function (api, s) {
    var st = stage(api, 340, 248);
    var D = {
      30: { a: '1', b: '√3', c: '2', ta: '1', tb: '\\sqrt3', tc: '2' },
      45: { a: '1', b: '1', c: '√2', ta: '1', tb: '1', tc: '\\sqrt2' },
      60: { a: '√3', b: '1', c: '2', ta: '\\sqrt3', tb: '1', tc: '2' }
    };
    var VAL = { sin30: '\\dfrac12', cos30: '\\dfrac{\\sqrt3}{2}', tan30: '\\dfrac{1}{\\sqrt3}', sin45: '\\dfrac{1}{\\sqrt2}', cos45: '\\dfrac{1}{\\sqrt2}', tan45: '1',
      sin60: '\\dfrac{\\sqrt3}{2}', cos60: '\\dfrac12', tan60: '\\sqrt3' };
    var ROLE = { sin: { den: 'c', num: 'a' }, cos: { den: 'c', num: 'b' }, tan: { den: 'b', num: 'a' } };
    var WORD = { a: 'たて', b: 'よこ', c: '斜辺' };
    var RULE = { sin: '斜辺分のたて', cos: '斜辺分のよこ', tan: 'よこ分のたて' };
    var Q = s.q || [['sin', 30], ['cos', 30], ['tan', 30], ['sin', 60], ['cos', 60], ['tan', 45]];
    var MAC = { sin: '\\S', cos: '\\C', tan: '\\T' };
    var tri = el('g', {}, st.svg), fl = el('g', {}, st.svg);
    /* 右側：分数の置き場 */
    var fx = 296;
    var fName = text(st.svg, fx, 34, '', K.ink, 15, { 'font-style': 'italic' });
    var fBar = line(st.svg, { x: fx, y: 117 }, { x: fx, y: 117 }, K.ink, 2.5);
    el('rect', { x: fx - 20, y: 70, width: 40, height: 36, rx: 8, fill: 'none', stroke: K.dim, 'stroke-dasharray': '4 4' }, st.svg);
    el('rect', { x: fx - 20, y: 128, width: 40, height: 36, rx: 8, fill: 'none', stroke: K.dim, 'stroke-dasharray': '4 4' }, st.svg);
    text(st.svg, fx, 60, '② 分子', K.dim, 10); text(st.svg, fx, 176, '① 分母', K.dim, 10);
    var qi = 0, phase = 'den', cur = null, busy = false, prevDeg = null;
    function geo(deg) {
      var r = deg * D2R, A = { x: 22, y: 200 }, Lh = Math.min(200 / Math.cos(r), 160 / Math.sin(r));
      var B = { x: A.x + Lh * Math.cos(r), y: A.y }, C = { x: B.x, y: A.y - Lh * Math.sin(r) };
      return { A: A, B: B, C: C };
    }
    function setup() {
      var q = Q[qi], fn = q[0], deg = q[1], d = D[deg], G = geo(deg);
      tri.innerHTML = ''; fl.innerHTML = '';
      set(fName, { fill: K[fn] }); fName.textContent = fn + ' ' + deg + '° =';
      set(fBar, { x1: fx, x2: fx, stroke: K[fn] });
      el('polygon', { points: [G.A, G.B, G.C].map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' '), fill: 'rgba(255,255,255,.05)' }, tri);
      el('path', { d: 'M' + (G.B.x - 11) + ',' + G.B.y + ' v-11 h11', fill: 'none', stroke: K.dim, 'stroke-width': 1.5 }, tri);
      el('path', { d: arcPath(G.A, G.B, G.C, 30), fill: 'none', stroke: K[fn], 'stroke-width': 2.5 }, tri);
      text(tri, G.A.x + 48 * Math.cos(deg / 2 * D2R), G.A.y - 44 * Math.sin(deg / 2 * D2R), deg + '°', K[fn], 14);
      var sides = { a: [G.B, G.C], b: [G.A, G.B], c: [G.A, G.C] };
      var labPos = {
        a: { x: G.B.x + 16, y: (G.B.y + G.C.y) / 2 }, b: { x: (G.A.x + G.B.x) / 2, y: G.A.y + 17 },
        c: { x: (G.A.x + G.C.x) / 2 - 16 * Math.sin(deg * D2R), y: (G.A.y + G.C.y) / 2 - 16 * Math.cos(deg * D2R) }
      };
      cur = { fn: fn, deg: deg, d: d, vis: {}, lab: {}, pos: labPos };
      ['a', 'b', 'c'].forEach(function (k) {
        var sd = sides[k];
        cur.vis[k] = line(tri, sd[0], sd[1], 'rgba(232,238,255,.75)', 3);
        cur.lab[k] = text(tri, labPos[k].x, labPos[k].y, d[k], K.ink, 16);
        text(tri, labPos[k].x + (k === 'a' ? 0 : 0), labPos[k].y + (k === 'b' ? 15 : 15), WORD[k], K.dim, 9);
        var hit = line(tri, sd[0], sd[1], 'transparent', 28, { class: 'gw-side' });
        hit.addEventListener('click', function () { tap(k); });
      });
      phase = 'den';
      api.goal('お題 $' + MAC[fn] + ' ' + deg + '^\\circ$：まず<b>分母</b>になる辺をタップ　<small>(' + (qi + 1) + '/' + Q.length + ')</small>');
      /* 登場：60° は「裏返し」て出てくる（たてとよこが入れかわる） */
      if (prevDeg !== null && prevDeg !== deg && (deg === 60 || prevDeg === 60)) {
        gsap.fromTo(tri, { scaleX: -0.1, opacity: 0.2, transformOrigin: '50% 50%' }, { scaleX: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.6)' });
        readout(api, st, deg === 60 ? '60° を左下に置くと、<b>たて √3・よこ 1</b> に入れかわる！（斜辺は 2 のまま）' : '30° を左下に戻すと、たて 1・よこ √3。');
      } else {
        gsap.fromTo(tri, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' });
        if (prevDeg === null) readout(api, st, '30°・60° の定規は <b>1 : 2 : √3</b>、45° の定規は <b>1 : 1 : √2</b>。<br><small>sin＝斜辺分のたて　cos＝斜辺分のよこ　tan＝よこ分のたて</small>');
      }
      prevDeg = deg;
    }
    function fly(k, to) {
      var from = cur.pos[k], t = text(fl, from.x, from.y, cur.d[k], K[cur.fn], 19), o = { x: from.x, y: from.y };
      gsap.to(o, { x: to.x, y: to.y, duration: 0.55, ease: 'back.out(1.7)', onUpdate: function () { set(t, { x: o.x, y: o.y }); } });
    }
    function tap(k) {
      if (busy || api.isDone() || !cur) return;
      var want = ROLE[cur.fn][phase];
      if (k !== want) {
        gsap.fromTo(cur.vis[k], { attr: { stroke: '#ff5470' } }, { attr: { stroke: 'rgba(232,238,255,.75)' }, duration: 0.7 });
        api.ng(cur.fn + ' は「' + RULE[cur.fn] + '」。' + (phase === 'den' ? '分母' : '分子') + 'は ' + WORD[want] + ' の辺だよ。');
        return;
      }
      set(cur.vis[k], { stroke: K[cur.fn], 'stroke-width': phase === 'den' ? 4 : 6, opacity: phase === 'den' ? 0.6 : 1 });
      gsap.fromTo(cur.vis[k], { attr: { 'stroke-width': 12 } }, { attr: { 'stroke-width': phase === 'den' ? 4 : 6 }, duration: 0.45, ease: 'back.out(2)' });
      set(cur.lab[k], { fill: K[cur.fn] });
      fly(k, phase === 'den' ? { x: fx, y: 146 } : { x: fx, y: 88 });
      api.tick();
      if (phase === 'den') {
        phase = 'num';
        api.goal('お題 $' + MAC[cur.fn] + ' ' + cur.deg + '^\\circ$：次は<b>分子</b>の辺をタップ　<small>(' + (qi + 1) + '/' + Q.length + ')</small>');
        return;
      }
      busy = true;
      gsap.to(fBar, { attr: { x1: fx - 22, x2: fx + 22 }, duration: 0.3, delay: 0.35, ease: 'power2.out' });
      var key = cur.fn + cur.deg, d = cur.d, num = ROLE[cur.fn].num, den = ROLE[cur.fn].den;
      setTimeout(function () {
        readout(api, st, '$' + MAC[cur.fn] + ' ' + cur.deg + '^\\circ=\\dfrac{' + d['t' + num] + '}{' + d['t' + den] + '}' + (('\\dfrac{' + d['t' + num] + '}{' + d['t' + den] + '}').replace(/[{}]/g, '') === VAL[key].replace(/[{}]/g, '') ? '' : '=' + VAL[key]) + '$　<small>' + WORD[den] + ' ' + d[den] + ' 分の ' + WORD[num] + ' ' + d[num] + '</small>');
        gsap.fromTo(st.read, { scale: 0.88 }, { scale: 1, duration: 0.45, ease: 'back.out(2.5)' });
        api.ding(qi + 1); yay(st, ['ナイス！', 'その通り！', 'カンペキ！'][qi % 3]);
        var r = st.wrap.getBoundingClientRect(); api.burst(r.left + r.width * 0.8, r.top + r.height * 0.35, 18);
      }, 600);
      setTimeout(function () {
        busy = false; qi++;
        if (qi >= Q.length) api.ok('三角定規の 1:2:√3 と 1:1:√2 さえ描ければ、表を丸暗記しなくても値が出せる！');
        else setup();
      }, 2300);
    }
    setup();
    return { solve: function () { qi = Q.length; api.ok(); } };
  };

  /* =========================================================
   * unit：単位円の上の点Pを動かす。P(cosθ, sinθ)、tan＝OPの傾き
   * ========================================================= */
  LE.widgets.unit = function (api, s) {
    var st = stage(api, 320, 210);
    var O = { x: 160, y: 168 }, R = 128, th = 50;
    el('line', { x1: 14, y1: O.y, x2: 306, y2: O.y, stroke: K.dim, 'stroke-width': 1.5 }, st.svg);
    el('line', { x1: O.x, y1: 196, x2: O.x, y2: 12, stroke: K.dim, 'stroke-width': 1.5 }, st.svg);
    el('path', { d: 'M' + (O.x - R) + ',' + O.y + ' A' + R + ',' + R + ' 0 0,1 ' + (O.x + R) + ',' + O.y, fill: 'none', stroke: 'rgba(232,238,255,.5)', 'stroke-width': 2 }, st.svg);
    text(st.svg, O.x - R, O.y + 14, '−1', K.dim, 12); text(st.svg, O.x + R, O.y + 14, '1', K.dim, 12); text(st.svg, O.x - 10, O.y + 14, 'O', K.dim, 12);
    var tanL = line(st.svg, O, O, K.tan, 1.5, { 'stroke-dasharray': '5 5', opacity: 0.8 });
    var cosL = line(st.svg, O, O, K.cos, 5), sinL = line(st.svg, O, O, K.sin, 5), rad = line(st.svg, O, O, K.ink, 2.2);
    var arc = el('path', { fill: 'none', stroke: K.ink, 'stroke-width': 1.5 }, st.svg);
    var tP = text(st.svg, 0, 0, '', K.ink, 12), tTh = text(st.svg, 0, 0, '', K.ink, 12);
    var P;
    var tanNote = '';
    function draw() {
      P = onCircle(O, R, th);
      var foot = { x: P.x, y: O.y };
      mvLine(cosL, O, foot); mvLine(sinL, foot, P); mvLine(rad, O, P);
      var far = { x: O.x + (P.x - O.x) * 2.2, y: O.y + (P.y - O.y) * 2.2 }; mvLine(tanL, { x: O.x - (P.x - O.x) * 0.3, y: O.y - (P.y - O.y) * 0.3 }, far);
      set(arc, { d: 'M' + (O.x + 24) + ',' + O.y + ' A24,24 0 0,0 ' + (O.x + 24 * Math.cos(th * D2R)).toFixed(2) + ',' + (O.y - 24 * Math.sin(th * D2R)).toFixed(2) });
      mvText(tTh, O.x + 36 * Math.cos(th / 2 * D2R), O.y - 36 * Math.sin(th / 2 * D2R) - 2, Math.round(th) + '°');
      mvText(tP, P.x + (th < 90 ? 22 : -22), P.y - 14, 'P');
      h.pos(P.x, P.y);
      var c = Math.cos(th * D2R), sn = Math.sin(th * D2R);
      var tn = Math.abs(c) < 1e-6 ? null : sn / c;
      readout(api, st, '$\\theta=' + Math.round(th) + '^\\circ$　P$(\\C\\theta,\\ \\S\\theta)=(' + f(c) + ',\\ ' + f(sn) + ')$<br>$\\T\\theta=' + (tn == null ? '\\text{なし（OPがたて）}' : f(tn)) + '$　<small>＝OPの傾き</small>');
    }
    var h = handle(st.svg, 0, 0, '#fff', function (x, y) { th = Math.max(0, Math.min(180, degOf(O, { x: x, y: Math.min(y, O.y) }))); draw(); }, function () {
      var t = snapTo(th, [0, 30, 45, 60, 90, 120, 135, 150, 180], 4);
      if (t !== th) { var o = { v: th }; gsap.to(o, { v: t, duration: 0.45, ease: 'back.out(2.5)', onUpdate: function () { th = o.v; draw(); }, onComplete: function () { th = t; draw(); m.check(th); } }); api.tick(); }
      else m.check(th);
    });
    var tasks = s.tasks || ['neg', 'eq', 't90'];
    var T = {
      neg: { goal: '$\\C\\theta$ が<b>マイナス</b>になる場所へPを動かそう', test: function (t) { return t > 92; }, yay: 'cosがマイナス！', msg: '' },
      eq: { goal: '$\\S\\theta=\\C\\theta$ になる角度へ（ピンクとシアンが同じ長さ）', test: function (t) { return Math.round(t) === 45; }, yay: '45°！' },
      t90: { goal: '$\\T\\theta$ が<b>存在しない</b>角度へ動かそう', test: function (t) { return Math.round(t) === 90; }, yay: 'tan 90° はなし！', msg: 'θ=90° では OP がたてになり、傾き（tan）が決められない。' },
      s150: { goal: '$\\S\\theta=\\dfrac12$ になる<b>鈍角</b>を探そう', test: function (t) { return Math.round(t) === 150; }, yay: '150°！' },
      c120: { goal: '$\\C\\theta=-\\dfrac12$ になる角度を探そう', test: function (t) { return Math.round(t) === 120; }, yay: '120°！' }
    };
    var m = missions(api, st, tasks.map(function (k) { return T[k]; }));
    m.check = (function (orig) { return function (t) { orig(t); }; })(m.check);
    draw();
    return { solve: function () { tasks.forEach(function (k) { th = { neg: 120, eq: 45, t90: 90, s150: 150, c120: 120 }[k]; draw(); m.check(th); }); } };
  };

  /* =========================================================
   * pyth：単位円の直角三角形に正方形をのせる。cos² と sin² の面積の和はいつも 1
   * ========================================================= */
  LE.widgets.pyth = function (api) {
    var st = stage(api, 320, 220);
    var O = { x: 70, y: 130 }, R = 100, th = 35;
    var sqC = el('polygon', { fill: 'rgba(56,217,255,.25)', stroke: K.cos, 'stroke-width': 1.5 }, st.svg);
    var sqS = el('polygon', { fill: 'rgba(255,95,162,.25)', stroke: K.sin, 'stroke-width': 1.5 }, st.svg);
    var sq1 = el('polygon', { fill: 'rgba(255,255,255,.07)', stroke: K.ink, 'stroke-width': 1.5, 'stroke-dasharray': '4 4' }, st.svg);
    el('path', { d: 'M' + (O.x + R) + ',' + O.y + ' A' + R + ',' + R + ' 0 0,0 ' + O.x + ',' + (O.y - R), fill: 'none', stroke: K.dim, 'stroke-width': 1.5 }, st.svg);
    var cosL = line(st.svg, O, O, K.cos, 4), sinL = line(st.svg, O, O, K.sin, 4), hyp = line(st.svg, O, O, K.ink, 2.5);
    var t1 = text(st.svg, 0, 0, '1', K.ink, 14);
    var minT = 90, maxT = 0;
    function poly(pts) { return pts.map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' '); }
    function draw() {
      var c = Math.cos(th * D2R), s = Math.sin(th * D2R);
      var F = { x: O.x + R * c, y: O.y }, P = { x: F.x, y: O.y - R * s };
      mvLine(cosL, O, F); mvLine(sinL, F, P); mvLine(hyp, O, P);
      set(sqC, { points: poly([O, F, { x: F.x, y: F.y + R * c }, { x: O.x, y: O.y + R * c }]) });
      set(sqS, { points: poly([F, P, { x: P.x + R * s, y: P.y }, { x: F.x + R * s, y: F.y }]) });
      var vx = P.x - O.x, vy = P.y - O.y; // 斜辺の外側（左上）に正方形
      set(sq1, { points: poly([O, P, { x: P.x + vy, y: P.y - vx }, { x: O.x + vy, y: O.y - vx }]) });
      mvText(t1, (O.x + P.x) / 2 + 8, (O.y + P.y) / 2 + 10);
      h.pos(P.x, P.y);
      readout(api, st, '$\\textcolor{#38d9ff}{\\cos^2\\theta}+\\textcolor{#ff5fa2}{\\sin^2\\theta}=' + f(c * c, 3) + '+' + f(s * s, 3) + '=\\mathbf{1.000}$');
    }
    var h = handle(st.svg, 0, 0, '#fff', function (x, y) { th = Math.max(8, Math.min(82, degOf(O, { x: x, y: y }))); minT = Math.min(minT, th); maxT = Math.max(maxT, th); draw(); }, function () { m.check(); });
    var m = missions(api, st, [{ goal: 'Pをレールにそって<b>大きく</b>動かそう（40°ぶん）。ピンクとシアンの正方形の面積をたすと…？', test: function () { return maxT - minT > 40; }, prog: function () { return [Math.floor(Math.min(maxT - minT, 40) / 10), 4]; }, yay: 'いつも 1！', msg: '$\\cos^2\\theta+\\sin^2\\theta=1$ は、単位円の三平方の定理そのもの！' }]);
    draw();
    return { solve: function () { minT = 10; maxT = 80; m.check(); } };
  };

  /* =========================================================
   * mirror：単位円の点Pと、鏡に映した点P'
   *  s.mode='90'（直線 y=x で映す → 座標が入れかわる）| '180'（y軸で映す → xの符号だけ反転）
   * ========================================================= */
  LE.widgets.mirror = function (api, s) {
    var st = stage(api, 320, 220);
    var is90 = s.mode === '90';
    var O = is90 ? { x: 70, y: 190 } : { x: 160, y: 180 }, R = is90 ? 160 : 135, th = 25;
    el('line', { x1: 10, y1: O.y, x2: 310, y2: O.y, stroke: K.dim }, st.svg);
    el('line', { x1: O.x, y1: 210, x2: O.x, y2: 10, stroke: K.dim }, st.svg);
    el('path', { d: is90 ? 'M' + (O.x + R) + ',' + O.y + ' A' + R + ',' + R + ' 0 0,0 ' + O.x + ',' + (O.y - R) : 'M' + (O.x - R) + ',' + O.y + ' A' + R + ',' + R + ' 0 0,1 ' + (O.x + R) + ',' + O.y, fill: 'none', stroke: 'rgba(232,238,255,.45)', 'stroke-width': 1.8 }, st.svg);
    /* 鏡 */
    var mir = is90 ? line(st.svg, O, { x: O.x + R * 1.1 * Math.SQRT1_2, y: O.y - R * 1.1 * Math.SQRT1_2 }, K.vio, 2, { 'stroke-dasharray': '6 5' }) : line(st.svg, { x: O.x, y: O.y }, { x: O.x, y: O.y - R - 10 }, K.vio, 2.5, { 'stroke-dasharray': '6 5' });
    text(st.svg, is90 ? O.x + R * 0.86 : O.x + 26, is90 ? O.y - R * 0.68 : 18, is90 ? '鏡 y=x' : '鏡（y軸）', K.vio, 12);
    var g1 = el('g', {}, st.svg), g2 = el('g', { opacity: 0.95 }, st.svg);
    function seg(g) { return { c: line(g, O, O, K.cos, 4), s: line(g, O, O, K.sin, 4), r: line(g, O, O, K.ink, 2) }; }
    var A1 = seg(g1), A2 = seg(g2);
    /* P' 側は紫の点線（P の線と重なっても見分けられるように） */
    [A2.r, A2.c, A2.s].forEach(function (l) { set(l, { stroke: K.vio, 'stroke-dasharray': '6 5', 'stroke-width': 2.5 }); });
    var p2 = el('circle', { r: 6, fill: K.vio }, st.svg);
    var tP = text(st.svg, 0, 0, 'P', K.ink, 12), tQ = text(st.svg, 0, 0, "P'", K.vio, 12);
    var seen = {};
    function put(S, P) { var F = { x: P.x, y: O.y }; mvLine(S.c, O, F); mvLine(S.s, F, P); mvLine(S.r, O, P); }
    function draw() {
      var P = onCircle(O, R, th), th2 = is90 ? 90 - th : 180 - th, Q = onCircle(O, R, th2);
      put(A1, P); put(A2, Q); set(p2, { cx: Q.x, cy: Q.y });
      mvText(tP, P.x + 14, P.y - 12); mvText(tQ, Q.x + (is90 ? 14 : -16), Q.y - 12);
      h.pos(P.x, P.y);
      var c = Math.cos(th * D2R), sn = Math.sin(th * D2R);
      readout(api, st, 'P$(\\C' + Math.round(th) + '^\\circ,\\ \\S' + Math.round(th) + '^\\circ)=(' + f(c) + ',\\ ' + f(sn) + ')$<br>' +
        "P'$(\\C" + Math.round(th2) + '^\\circ,\\ \\S' + Math.round(th2) + '^\\circ)=(' + f(Math.cos(th2 * D2R)) + ',\\ ' + f(Math.sin(th2 * D2R)) + ')$　' +
        (is90 ? '<small>xとyが入れかわる！</small>' : '<small>yはそのまま、xだけ符号が反対！</small>'));
    }
    var h = handle(st.svg, 0, 0, '#fff', function (x, y) {
      th = Math.max(is90 ? 2 : 2, Math.min(is90 ? 88 : 88, degOf(O, { x: x, y: y }))); draw();
    }, function () {
      var t = snapTo(th, [30, 45, 60], 4);
      var fin = function () { seen[Math.round(th)] = 1; m.check(); };
      if (t !== th) { var o = { v: th }; gsap.to(o, { v: t, duration: 0.45, ease: 'back.out(2.5)', onUpdate: function () { th = o.v; draw(); }, onComplete: function () { th = t; draw(); fin(); } }); api.tick(); } else fin();
    });
    var m = missions(api, st, is90
      ? [{ goal: 'Pを <b>30°</b> にあわせよう（近くで離すと吸いつく）。P\'はどこに映る？', test: function () { return seen[30]; }, yay: "P'は60°！" },
         { goal: '次は Pを <b>60°</b> にあわせて、座標の入れかわりを確かめよう', test: function () { return seen[60]; }, yay: 'cos と sin がチェンジ！', msg: '$90^\\circ-\\theta$ は「名前が入れかわる」：sin↔cos、tanは逆数。' }]
      : [{ goal: 'Pを <b>30°</b> にあわせよう（近くで離すと吸いつく）。P\'は何度？', test: function () { return seen[30]; }, yay: "P'は150°！" },
         { goal: '次は Pを <b>45°</b> にあわせて、何が変わって何が変わらないか見よう', test: function () { return seen[45]; }, yay: 'sinだけ生き残る！', msg: '$180^\\circ-\\theta$ は「名前はそのまま、sin以外にマイナス」。' }]);
    draw();
    return { solve: function () { [30, 45, 60].forEach(function (v) { th = v; draw(); seen[v] = 1; m.check(); m.check(); }); } };
  };

  /* =========================================================
   * 円の上の点を動かす共通部品
   * ========================================================= */
  function circleBase(st, C, R) {
    el('circle', { cx: C.x, cy: C.y, r: R, fill: 'rgba(255,255,255,.03)', stroke: 'rgba(232,238,255,.55)', 'stroke-width': 2 }, st.svg);
  }
  function angleArc(p, color) { return el('path', { fill: color ? color.replace(')', ',.18)').replace('rgb', 'rgba') : 'none', stroke: color || K.ink, 'stroke-width': 2 }, p); }
  function wedge(v, a, b, r) { return arcPath(v, a, b, r) + ' L' + v.x.toFixed(2) + ',' + v.y.toFixed(2) + ' Z'; }

  /* =========================================================
   * inscribed：円周角の定理
   *  弧ABを決めて、円周上の点Pを動かすと ∠APB は一定。中心角 ∠AOB はその2倍
   * ========================================================= */
  LE.widgets.inscribed = function (api) {
    var st = stage(api, 320, 230);
    var C = { x: 160, y: 118 }, R = 95, a = 215, b = 325, p = 100;
    circleBase(st, C, R);
    var wP = el('path', { fill: 'rgba(255,138,92,.25)', stroke: K.hi, 'stroke-width': 1.5 }, st.svg);
    var wO = el('path', { fill: 'rgba(180,140,255,.22)', stroke: K.vio, 'stroke-width': 1.5 }, st.svg);
    var PA = line(st.svg, C, C, K.ink, 2), PB = line(st.svg, C, C, K.ink, 2), OA = line(st.svg, C, C, K.vio, 1.6, { 'stroke-dasharray': '4 4' }), OB = line(st.svg, C, C, K.vio, 1.6, { 'stroke-dasharray': '4 4' });
    var arcAB = el('path', { fill: 'none', stroke: K.ok, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 }, st.svg);
    el('circle', { cx: C.x, cy: C.y, r: 3, fill: K.vio }, st.svg); text(st.svg, C.x + 10, C.y - 8, 'O', K.vio, 12);
    var tA = text(st.svg, 0, 0, 'A', K.ink, 13), tB = text(st.svg, 0, 0, 'B', K.ink, 13), tP = text(st.svg, 0, 0, 'P', K.hi, 13);
    var spots = {}, dia = false;
    function draw() {
      var A = onCircle(C, R, a), B = onCircle(C, R, b), P = onCircle(C, R, p);
      mvLine(PA, P, A); mvLine(PB, P, B); mvLine(OA, C, A); mvLine(OB, C, B);
      set(wP, { d: wedge(P, A, B, 26) }); set(wO, { d: wedge(C, A, B, 20) });
      /* 弧AB（Pと反対側） */
      var big = ((b - a + 360) % 360);
      set(arcAB, { d: 'M' + A.x.toFixed(1) + ',' + A.y.toFixed(1) + ' A' + R + ',' + R + ' 0 ' + (big > 180 ? 1 : 0) + ',0 ' + B.x.toFixed(1) + ',' + B.y.toFixed(1) });
      mvText(tA, C.x + (R + 14) * Math.cos(a * D2R), C.y - (R + 14) * Math.sin(a * D2R));
      mvText(tB, C.x + (R + 14) * Math.cos(b * D2R), C.y - (R + 14) * Math.sin(b * D2R));
      mvText(tP, C.x + (R + 16) * Math.cos(p * D2R), C.y - (R + 16) * Math.sin(p * D2R));
      hA.pos(A.x, A.y); hB.pos(B.x, B.y); hP.pos(P.x, P.y);
      var ip = angDeg(P, A, B), io = angDeg(C, A, B);
      if (big > 180) io = 360 - io;
      dia = Math.abs(big - 180) < 1.5;
      readout(api, st, '円周角 <b style="color:' + K.hi + '">∠APB = ' + Math.round(ip) + '°</b>　中心角 <b style="color:' + K.vio + '">∠AOB = ' + Math.round(io) + '°</b>' + (dia ? '　<small>（ABが直径！）</small>' : ''));
    }
    /* P は B から反時計回りに A まで（弧ABの反対側） */
    function inArcP(v) { var x = (v - b + 360) % 360, span = (a - b + 360) % 360; return x > 6 && x < span - 6; }
    var hP = handle(st.svg, 0, 0, K.hi, function (x, y) { var d = degOf(C, { x: x, y: y }); if (inArcP(d)) { p = d; draw(); } }, function () { spots[Math.round(p / 25)] = 1; m.check(); });
    var hA = handle(st.svg, 0, 0, K.ok, function (x, y) { var d = degOf(C, { x: x, y: y }); if (d > 150 && d < 265) { a = d; if (!inArcP(p)) p = (b + ((a - b + 360) % 360) / 2) % 360; draw(); } }, function () { m.check(); });
    var hB = handle(st.svg, 0, 0, K.ok, function (x, y) {
      var d = degOf(C, { x: x, y: y }); if (d > 275 || d < 75) { b = d; if (Math.abs(((b - a + 360) % 360) - 180) < 6) b = (a + 180) % 360; if (!inArcP(p)) p = (b + ((a - b + 360) % 360) / 2) % 360; draw(); }
    }, function () { m.check(); });
    var m = missions(api, st, [
      { goal: 'オレンジの点Pを、円周上の<b>3か所以上</b>に動かそう', test: function () { return Object.keys(spots).length >= 3; }, prog: function () { return [Object.keys(spots).length, 3]; }, yay: 'どこでも同じ角！' },
      { goal: '緑の点Bを動かして、<b>ABを直径</b>にしてみよう', test: function () { return dia; }, yay: '直径なら90°！', msg: '同じ弧の円周角は等しい／中心角は円周角の2倍／直径の円周角は90°。' }
    ]);
    draw();
    return { solve: function () { spots = { 1: 1, 2: 1, 3: 1 }; m.check(); b = (a + 180) % 360; draw(); m.check(); } };
  };

  /* =========================================================
   * cyclic：円に内接する四角形。どの頂点を動かしても ∠A+∠C=180°、∠B+∠D=180°
   * ========================================================= */
  LE.widgets.cyclic = function (api) {
    var st = stage(api, 320, 230);
    var C = { x: 160, y: 116 }, R = 95, ang = [140, 230, 320, 50];
    circleBase(st, C, R);
    var quad = el('polygon', { fill: 'rgba(255,255,255,.05)', stroke: K.ink, 'stroke-width': 2 }, st.svg);
    var wA = el('path', { fill: 'rgba(255,95,162,.28)', stroke: K.sin, 'stroke-width': 1.5 }, st.svg), wC = el('path', { fill: 'rgba(255,95,162,.28)', stroke: K.sin, 'stroke-width': 1.5 }, st.svg);
    var wB = el('path', { fill: 'rgba(56,217,255,.25)', stroke: K.cos, 'stroke-width': 1.5 }, st.svg), wD = el('path', { fill: 'rgba(56,217,255,.25)', stroke: K.cos, 'stroke-width': 1.5 }, st.svg);
    var names = ['A', 'B', 'C', 'D'], labs = names.map(function (n) { return text(st.svg, 0, 0, n, K.ink, 13); });
    var drags = 0;
    function pts() { return ang.map(function (d) { return onCircle(C, R, d); }); }
    function draw() {
      var P = pts();
      set(quad, { points: P.map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ') });
      [wA, wB, wC, wD].forEach(function (w, i) { set(w, { d: wedge(P[i], P[(i + 3) % 4], P[(i + 1) % 4], 22) }); });
      labs.forEach(function (t, i) { mvText(t, C.x + (R + 15) * Math.cos(ang[i] * D2R), C.y - (R + 15) * Math.sin(ang[i] * D2R)); });
      hs.forEach(function (h, i) { h.pos(P[i].x, P[i].y); });
      var A = angDeg(P[0], P[3], P[1]), B = angDeg(P[1], P[0], P[2]), Cc = angDeg(P[2], P[1], P[3]), Dd = angDeg(P[3], P[2], P[0]);
      var rA = Math.round(A), rB = Math.round(B);   /* 表示は整数。向かいの角は 180 から引いた値にして、足し算が必ず合うようにする */
      readout(api, st, '<b style="color:' + K.sin + '">∠A + ∠C = ' + rA + '° + ' + (180 - rA) + '° = 180°</b><br><b style="color:' + K.cos + '">∠B + ∠D = ' + rB + '° + ' + (180 - rB) + '° = 180°</b>');
    }
    var hs = ang.map(function (_, i) {
      return handle(st.svg, 0, 0, i % 2 ? K.cos : K.sin, function (x, y) {
        var d = degOf(C, { x: x, y: y }), prev = ang[(i + 3) % 4], next = ang[(i + 1) % 4];
        /* 隣の頂点を追いこさない */
        var lo = prev + 12, hi = next - 12; if (hi < lo) hi += 360; var dd = d < lo - 1e-9 ? d + 360 : d;
        if (dd > lo && dd < hi) { ang[i] = dd % 360; draw(); }
      }, function () { drags++; m.check(); });
    });
    var m = missions(api, st, [{ goal: '4つの頂点をどれでも動かしてみよう', test: function () { return drags >= 3; }, prog: function () { return [drags, 3]; }, yay: 'いつも180°！', msg: '円に内接する四角形：向かい合う角の和は 180°。' }]);
    draw();
    return { solve: function () { drags = 3; m.check(); } };
  };

  /* =========================================================
   * tangent：接弦定理。接線と弦のつくる角 ＝ その角の内側の弧に対する円周角
   * ========================================================= */
  LE.widgets.tangent = function (api) {
    var st = stage(api, 320, 230);
    var C = { x: 160, y: 105 }, R = 85, b = 30, p = 150;
    circleBase(st, C, R);
    var A = onCircle(C, R, 270);
    line(st.svg, { x: A.x - 150, y: A.y }, { x: A.x + 150, y: A.y }, K.ok, 2.5);
    text(st.svg, A.x + 120, A.y - 10, '接線', K.ok, 12);
    var AB = line(st.svg, A, A, K.ink, 2), PA = line(st.svg, A, A, K.ink, 1.8), PB = line(st.svg, A, A, K.ink, 1.8);
    var wT = el('path', { fill: 'rgba(255,216,77,.3)', stroke: K.tan, 'stroke-width': 1.5 }, st.svg);
    var wP = el('path', { fill: 'rgba(255,216,77,.3)', stroke: K.tan, 'stroke-width': 1.5 }, st.svg);
    text(st.svg, A.x, A.y + 14, 'A', K.ink, 13);
    var tB = text(st.svg, 0, 0, 'B', K.ink, 13), tP = text(st.svg, 0, 0, 'P', K.ink, 13);
    var drags = 0;
    function draw() {
      var B = onCircle(C, R, b), P = onCircle(C, R, p);
      mvLine(AB, A, B); mvLine(PA, P, A); mvLine(PB, P, B);
      var T = { x: A.x + 100, y: A.y };
      set(wT, { d: wedge(A, T, B, 30) }); set(wP, { d: wedge(P, A, B, 24) });
      mvText(tB, C.x + (R + 14) * Math.cos(b * D2R), C.y - (R + 14) * Math.sin(b * D2R));
      mvText(tP, C.x + (R + 14) * Math.cos(p * D2R), C.y - (R + 14) * Math.sin(p * D2R));
      hB.pos(B.x, B.y); hP.pos(P.x, P.y);
      readout(api, st, '接線と弦ABの角 = <b style="color:' + K.tan + '">' + Math.round(angDeg(A, T, B)) + '°</b>　円周角 ∠APB = <b style="color:' + K.tan + '">' + Math.round(angDeg(P, A, B)) + '°</b>');
    }
    /* A（真下＝270°）から反時計回りに測った角 rel で考える。B は 20°〜250°、P は B より先（B の向こう側の弧） */
    function rel(d) { return (d - 270 + 360) % 360; }
    var hB = handle(st.svg, 0, 0, K.ink, function (x, y) { var r = rel(degOf(C, { x: x, y: y })); if (r > 20 && r < 250 && r < rel(p) - 15) { b = (r + 270) % 360; draw(); } }, function () { drags++; m.check(); });
    var hP = handle(st.svg, 0, 0, K.tan, function (x, y) { var r = rel(degOf(C, { x: x, y: y })); if (r > rel(b) + 15 && r < 345) { p = (r + 270) % 360; draw(); } }, function () { drags++; m.check(); });
    var m = missions(api, st, [{ goal: '点Bや点Pを動かして、2つの黄色い角を比べよう', test: function () { return drags >= 3; }, prog: function () { return [drags, 3]; }, yay: 'いつも同じ！', msg: '接線と弦のつくる角は、その角の内側にある弧に対する円周角に等しい。' }]);
    draw();
    return { solve: function () { drags = 3; m.check(); } };
  };

  /* =========================================================
   * power：方べきの定理（3つの形をタブで切りかえ）
   *  ① 円の内部で交わる弦 ② 円の外から2本の割線 ③ 割線と接線
   * ========================================================= */
  LE.widgets.power = function (api) {
    var st = stage(api, 320, 230);
    var tabs = document.createElement('div'); tabs.className = 'gw-btns';
    ['① 中で交わる', '② 外から2本', '③ 接線'].forEach(function (n, i) { var b = document.createElement('button'); b.className = 'gw-btn'; b.textContent = n; b.addEventListener('click', function () { setMode(i); }); tabs.appendChild(b); });
    st.wrap.insertBefore(tabs, st.svg);
    var C = { x: 175, y: 115 }, R = 80;
    circleBase(st, C, R);
    var layer = el('g', {}, st.svg);
    var mode = 0, P = { x: 150, y: 125 }, u1 = 20, u2 = 115, visited = {}, drags = 0;
    /* P を通る方向 u の直線と円の交点（近い順） */
    function hits(P, deg) {
      var dx = Math.cos(deg * D2R), dy = -Math.sin(deg * D2R);
      var fx = P.x - C.x, fy = P.y - C.y;
      var bq = fx * dx + fy * dy, cq = fx * fx + fy * fy - R * R, disc = bq * bq - cq;
      if (disc < 0) return null;
      var r = Math.sqrt(disc), t1 = -bq - r, t2 = -bq + r;
      return [{ x: P.x + dx * t1, y: P.y + dy * t1, t: t1 }, { x: P.x + dx * t2, y: P.y + dy * t2, t: t2 }];
    }
    var hP;
    function draw() {
      layer.innerHTML = '';
      var d0 = dist(P, C), html = '', pw = f(Math.abs(d0 * d0 - R * R) / 400, 2);   // 方べきの値（どの線でも同じ）
      if (mode === 0) {
        var h1 = hits(P, u1), h2 = hits(P, u2);
        line(layer, h1[0], h1[1], K.sin, 3); line(layer, h2[0], h2[1], K.cos, 3);
        var PA = -h1[0].t, PB = h1[1].t, PC = -h2[0].t, PD = h2[1].t;
        [['A', h1[0]], ['B', h1[1]], ['C', h2[0]], ['D', h2[1]]].forEach(function (q) { el('circle', { cx: q[1].x, cy: q[1].y, r: 4, fill: K.ink }, layer); text(layer, q[1].x + (q[1].x - C.x) * 0.16, q[1].y + (q[1].y - C.y) * 0.16, q[0], K.ink, 13); });
        html = '<b style="color:' + K.sin + '">PA·PB = ' + f(PA / 20, 2) + '×' + f(PB / 20, 2) + ' = ' + pw + '</b><br><b style="color:' + K.cos + '">PC·PD = ' + f(PC / 20, 2) + '×' + f(PD / 20, 2) + ' = ' + pw + '</b>';
      } else {
        var dir0 = Math.atan2(-(C.y - P.y), C.x - P.x) / D2R;
        var a1 = dir0 + 18, h3 = hits(P, a1);
        line(layer, P, h3[1], K.sin, 3);
        var PA2 = h3[0].t, PB2 = h3[1].t;
        el('circle', { cx: h3[0].x, cy: h3[0].y, r: 4, fill: K.ink }, layer); text(layer, h3[0].x - 6, h3[0].y - 12, 'A', K.ink, 13);
        el('circle', { cx: h3[1].x, cy: h3[1].y, r: 4, fill: K.ink }, layer); text(layer, h3[1].x + 10, h3[1].y - 10, 'B', K.ink, 13);
        if (mode === 1) {
          var h4 = hits(P, dir0 - 20);
          line(layer, P, h4[1], K.cos, 3);
          el('circle', { cx: h4[0].x, cy: h4[0].y, r: 4, fill: K.ink }, layer); text(layer, h4[0].x - 4, h4[0].y + 14, 'C', K.ink, 13);
          el('circle', { cx: h4[1].x, cy: h4[1].y, r: 4, fill: K.ink }, layer); text(layer, h4[1].x + 10, h4[1].y + 10, 'D', K.ink, 13);
          html = '<b style="color:' + K.sin + '">PA·PB = ' + f(PA2 / 20, 2) + '×' + f(PB2 / 20, 2) + ' = ' + pw + '</b><br><b style="color:' + K.cos + '">PC·PD = ' + f(h4[0].t / 20, 2) + '×' + f(h4[1].t / 20, 2) + ' = ' + pw + '</b><br><small>手前×奥 ＝ 手前×奥</small>';
        } else {
          var L = Math.sqrt(d0 * d0 - R * R), base = Math.atan2(C.y - P.y, C.x - P.x), off = Math.asin(R / d0);
          var T = { x: P.x + L * Math.cos(base + off), y: P.y + L * Math.sin(base + off) };
          line(layer, P, T, K.tan, 3); el('circle', { cx: T.x, cy: T.y, r: 4, fill: K.tan }, layer); text(layer, T.x + 4, T.y + 14, 'T', K.tan, 13);
          html = '<b style="color:' + K.sin + '">PA·PB = ' + f(PA2 / 20, 2) + '×' + f(PB2 / 20, 2) + ' = ' + pw + '</b><br><b style="color:' + K.tan + '">PT² = ' + f(L / 20, 2) + '² = ' + pw + '</b><br><small>接線は「手前も奥もT」だから PT×PT</small>';
        }
      }
      text(layer, P.x - 12, P.y - 10, 'P', K.hi, 13);
      if (hP) layer.appendChild(hP.g);
      hP.pos(P.x, P.y);
      readout(api, st, html);
    }
    hP = handle(st.svg, 0, 0, K.hi, function (x, y) {
      var d = Math.hypot(x - C.x, y - C.y);
      if (mode === 0 ? d < R - 12 : (d > R + 16 && x > 8 && x < 312 && y > 8 && y < 222)) { P = { x: x, y: y }; draw(); }
    }, function () { drags++; visited[mode] = (visited[mode] || 0) + 1; m.check(); });
    function setMode(i) {
      mode = i; P = i === 0 ? { x: 150, y: 125 } : { x: 40, y: i === 1 ? 120 : 150 };
      Array.prototype.forEach.call(tabs.children, function (b, k) { b.classList.toggle('on', k === i); });
      draw(); gsap.fromTo(layer, { opacity: 0 }, { opacity: 1, duration: 0.35 }); api.tick(); m.check();
    }
    var m = missions(api, st, [{ goal: '3つのタブそれぞれで、点Pを動かしてみよう', test: function () { return visited[0] && visited[1] && visited[2]; }, prog: function () { return [(visited[0] ? 1 : 0) + (visited[1] ? 1 : 0) + (visited[2] ? 1 : 0), 3]; }, yay: '3つの形を制覇！', msg: 'Pから引いた線で「手前×奥」がいつも等しい。接線なら PT²。' }]);
    setMode(0);
    return { solve: function () { visited = { 0: 1, 1: 1, 2: 1 }; m.check(); } };
  };

  /* =========================================================
   * area：S＝½ bc sinA。2辺を固定して角Aを動かすと、高さ b sinA が変わる
   * ========================================================= */
  LE.widgets.area = function (api) {
    var st = stage(api, 320, 210);
    var A = { x: 135, y: 185 }, c = 160, b = 120, th = 50;   // 鈍角にしても図がはみ出さない配置
    var B = { x: A.x + c, y: A.y };
    /* 角Aを変える点が動くレール（点線の半円） */
    el('path', { d: 'M' + (A.x + b) + ',' + A.y + ' A' + b + ',' + b + ' 0 0,0 ' + (A.x - b) + ',' + A.y, fill: 'none', stroke: 'rgba(255,255,255,.2)', 'stroke-width': 2, 'stroke-dasharray': '3 7', 'stroke-linecap': 'round' }, st.svg);
    var tri = el('polygon', { fill: 'rgba(92,255,176,.16)', stroke: K.ink, 'stroke-width': 2 }, st.svg);
    var hL = line(st.svg, A, A, K.sin, 3.5, { 'stroke-dasharray': '6 4' });
    var arc = el('path', { fill: 'none', stroke: K.ink, 'stroke-width': 1.5 }, st.svg);
    line(st.svg, A, B, K.ink, 3); text(st.svg, A.x + c / 2, A.y + 16, 'c', K.ink, 14);
    var tb = text(st.svg, 0, 0, 'b', K.ink, 14), th1 = text(st.svg, 0, 0, 'b sinA', K.sin, 12), tA = text(st.svg, A.x - 10, A.y + 4, 'A', K.ink, 13);
    var CC, best = false;
    function draw() {
      CC = { x: A.x + b * Math.cos(th * D2R), y: A.y - b * Math.sin(th * D2R) };
      set(tri, { points: [A, B, CC].map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ') });
      mvLine(hL, CC, { x: CC.x, y: A.y });
      set(arc, { d: 'M' + (A.x + 26) + ',' + A.y + ' A26,26 0 0,0 ' + (A.x + 26 * Math.cos(th * D2R)).toFixed(1) + ',' + (A.y - 26 * Math.sin(th * D2R)).toFixed(1) });
      mvText(tb, (A.x + CC.x) / 2 - 10, (A.y + CC.y) / 2 - 8); mvText(th1, CC.x + 32, (CC.y + A.y) / 2);
      h.pos(CC.x, CC.y);
      var S = 0.5 * (b / 20) * (c / 20) * Math.sin(th * D2R);
      readout(api, st, '$A=' + Math.round(th) + '^\\circ$　$S=\\dfrac12\\cdot b\\cdot c\\cdot\\S A=\\dfrac12\\cdot ' + (b / 20) + '\\cdot ' + (c / 20) + '\\cdot' + f(Math.sin(th * D2R)) + '=\\mathbf{' + f(S, 1) + '}$');
    }
    var h = handle(st.svg, 0, 0, K.sin, function (x, y) { th = Math.max(8, Math.min(172, degOf(A, { x: x, y: Math.min(y, A.y) }))); draw(); }, function () {
      var t = snapTo(th, [30, 45, 60, 90, 120, 135, 150], 4);
      var fin = function () { best = Math.round(th) === 90; m.check(); };
      if (t !== th) { var o = { v: th }; gsap.to(o, { v: t, duration: 0.45, ease: 'back.out(2.5)', onUpdate: function () { th = o.v; draw(); }, onComplete: function () { th = t; draw(); fin(); } }); api.tick(); } else fin();
    });
    var m = missions(api, st, [{ goal: '角Aを動かして、<b>面積が最大</b>になる角度を探そう', test: function () { return best; }, yay: 'A=90°で最大！', msg: '$\\sin A$ が最大（=1）のとき面積も最大。「2辺とそのあいだの角の sin」で面積が出る。' }]);
    draw();
    return { solve: function () { th = 90; draw(); best = true; m.check(); } };
  };

  /* =========================================================
   * 三角形の頂点を動かす共通部品
   * ========================================================= */
  function triWidget(api, st, pts, onDraw, opts) {
    opts = opts || {};
    var hs = pts.map(function (p, i) {
      return handle(st.svg, p.x, p.y, opts.color || K.ink, function (x, y) {
        pts[i] = { x: Math.max(14, Math.min(st.w - 14, x)), y: Math.max(14, Math.min(st.h - 14, y)) };
        /* つぶれた三角形にしない */
        var a = pts[0], b = pts[1], c = pts[2];
        var area = Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;
        if (area < 1800) return;
        draw();
      }, function () { drags++; if (opts.onEnd) opts.onEnd(drags); });
    });
    var drags = 0;
    function draw() { onDraw(pts); hs.forEach(function (h, i) { h.pos(pts[i].x, pts[i].y); st.svg.appendChild(h.g); }); }
    draw();
    return { draw: draw, drags: function () { return drags; } };
  }
  function inter(p1, p2, p3, p4) {
    var d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    var t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / d;
    return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
  }
  function lerpP(a, b, t) { return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }; }

  /* =========================================================
   * incircle：内接円で3つの三角形に分ける。S = ½ar + ½br + ½cr
   * ========================================================= */
  LE.widgets.incircle = function (api) {
    var st = stage(api, 320, 220);
    var pts = [{ x: 150, y: 20 }, { x: 30, y: 195 }, { x: 290, y: 195 }];
    var g = el('g', {}, st.svg);
    var m;
    var T = triWidget(api, st, pts, function (P) {
      g.innerHTML = '';
      var A = P[0], B = P[1], Cc = P[2];
      var a = dist(B, Cc), b = dist(A, Cc), c = dist(A, B), s = a + b + c;
      var I = { x: (a * A.x + b * B.x + c * Cc.x) / s, y: (a * A.y + b * B.y + c * Cc.y) / s };
      var S = Math.abs((B.x - A.x) * (Cc.y - A.y) - (Cc.x - A.x) * (B.y - A.y)) / 2, r = 2 * S / s;
      el('polygon', { points: [I, B, Cc].map(function (p) { return p.x + ',' + p.y; }).join(' '), fill: 'rgba(255,95,162,.22)' }, g);
      el('polygon', { points: [I, Cc, A].map(function (p) { return p.x + ',' + p.y; }).join(' '), fill: 'rgba(56,217,255,.22)' }, g);
      el('polygon', { points: [I, A, B].map(function (p) { return p.x + ',' + p.y; }).join(' '), fill: 'rgba(255,216,77,.22)' }, g);
      el('polygon', { points: [A, B, Cc].map(function (p) { return p.x + ',' + p.y; }).join(' '), fill: 'none', stroke: K.ink, 'stroke-width': 2 }, g);
      el('circle', { cx: I.x, cy: I.y, r: r, fill: 'none', stroke: K.ok, 'stroke-width': 2 }, g);
      [[B, Cc], [Cc, A], [A, B]].forEach(function (e) {
        var dx = e[1].x - e[0].x, dy = e[1].y - e[0].y, L = Math.hypot(dx, dy), t = ((I.x - e[0].x) * dx + (I.y - e[0].y) * dy) / (L * L);
        var F = lerpP(e[0], e[1], t); line(g, I, F, K.ok, 1.6, { 'stroke-dasharray': '3 3' });
      });
      el('circle', { cx: I.x, cy: I.y, r: 3.5, fill: K.ok }, g); text(g, I.x + 10, I.y - 6, 'I', K.ok, 12);
      text(g, A.x, A.y - 12, 'A', K.ink, 13); text(g, B.x - 10, B.y + 8, 'B', K.ink, 13); text(g, Cc.x + 10, Cc.y + 8, 'C', K.ink, 13);
      var k = 1 / 20;
      var q1 = Math.round(S * k * k * (a / s) * 10) / 10, q2 = Math.round(S * k * k * (b / s) * 10) / 10, q3 = Math.round(S * k * k * (c / s) * 10) / 10;
      readout(api, st, '<span style="color:' + K.sin + '">½ar</span> + <span style="color:' + K.cos + '">½br</span> + <span style="color:' + K.tan + '">½cr</span> = ' + q1.toFixed(1) + ' + ' + q2.toFixed(1) + ' + ' + q3.toFixed(1) + ' = <b>' + (q1 + q2 + q3).toFixed(1) + '</b> ＝ 面積S<br><small>r＝内接円の半径（I＝内心：角の二等分線の交点）</small>');
    }, { onEnd: function () { m.check(); } });
    m = missions(api, st, [{ goal: '頂点を動かして、3色の三角形の面積の和を見よう', test: function () { return T.drags() >= 3; }, prog: function () { return [T.drags(), 3]; }, yay: 'いつも面積Sと一致！', msg: '$S=\\dfrac r2(a+b+c)$：内心から3つの三角形に分けて、高さはどれも r。' }]);
    return { solve: function () { for (var i = 0; i < 3; i++) T.drags = function () { return 3; }; m.check(); } };
  };

  /* =========================================================
   * sine：正弦定理。円周上で A を動かしても a/sinA はいつも 2R
   * ========================================================= */
  LE.widgets.sine = function (api) {
    var st = stage(api, 320, 230);
    var C = { x: 160, y: 115 }, R = 90, bd = 210, cd = 330, ad = 100, showDia = false;
    circleBase(st, C, R);
    var g = el('g', {}, st.svg);
    var spots = {}, diaSeen = false;
    var btn = document.createElement('div'); btn.className = 'gw-btns';
    var b1 = document.createElement('button'); b1.className = 'gw-btn'; b1.textContent = '直径 BA\' を引く'; btn.appendChild(b1);
    b1.addEventListener('click', function () { showDia = !showDia; b1.classList.toggle('on', showDia); if (showDia) diaSeen = true; draw(); api.tick(); m.check(); });
    st.wrap.insertBefore(btn, st.read);
    function draw() {
      g.innerHTML = '';
      var A = onCircle(C, R, ad), B = onCircle(C, R, bd), Cc = onCircle(C, R, cd);
      el('polygon', { points: [A, B, Cc].map(function (p) { return p.x + ',' + p.y; }).join(' '), fill: 'rgba(255,255,255,.05)', stroke: K.ink, 'stroke-width': 2 }, g);
      line(g, B, Cc, K.sin, 4);
      el('path', { d: wedge(A, B, Cc, 22), fill: 'rgba(255,95,162,.3)', stroke: K.sin, 'stroke-width': 1.5 }, g);
      if (showDia) {
        var A2 = { x: 2 * C.x - B.x, y: 2 * C.y - B.y };
        line(g, B, A2, K.vio, 2, { 'stroke-dasharray': '5 4' }); line(g, A2, Cc, K.vio, 2);
        el('path', { d: wedge(A2, B, Cc, 18), fill: 'rgba(180,140,255,.3)', stroke: K.vio }, g);
        text(g, A2.x + 12, A2.y - 8, "A'", K.vio, 13); text(g, (B.x + A2.x) / 2 - 12, (B.y + A2.y) / 2 - 8, '2R', K.vio, 12);
        el('path', { d: 'M' + (Cc.x - 10) + ',' + Cc.y + ' l0,0', stroke: 'none' }, g);
      }
      text(g, C.x + (R + 14) * Math.cos(ad * D2R), C.y - (R + 14) * Math.sin(ad * D2R), 'A', K.sin, 13);
      text(g, B.x - 12, B.y + 8, 'B', K.ink, 13); text(g, Cc.x + 12, Cc.y + 8, 'C', K.ink, 13);
      text(g, (B.x + Cc.x) / 2, (B.y + Cc.y) / 2 + 14, 'a', K.sin, 14);
      h.pos(A.x, A.y); st.svg.appendChild(h.g);
      var a = dist(B, Cc), sa = Math.sin(angDeg(A, B, Cc) * D2R);
      readout(api, st, '$A=' + Math.round(angDeg(A, B, Cc)) + '^\\circ$　$\\dfrac{a}{\\S A}=\\dfrac{' + f(a / 20, 2) + '}{' + f(sa, 3) + '}=\\mathbf{' + f(a / sa / 20, 2) + '}$　＝ $2R=' + f(2 * R / 20, 2) + '$');
    }
    var h = handle(st.svg, 0, 0, K.sin, function (x, y) { var d = degOf(C, { x: x, y: y }); if (d > 20 && d < 200) { ad = d; draw(); } }, function () { spots[Math.round(ad / 30)] = 1; m.check(); });
    var m = missions(api, st, [
      { goal: '点Aを円周上の3か所に動かそう。$\\dfrac{a}{\\S A}$ は？', test: function () { return Object.keys(spots).length >= 3; }, prog: function () { return [Object.keys(spots).length, 3]; }, yay: 'いつも 2R！' },
      { goal: '「直径 BA\' を引く」を押して、なぜ 2R になるか見よう', test: function () { return diaSeen; }, yay: '∠A＝∠A\'（円周角）！', msg: '同じ弧BCの円周角だから ∠A＝∠A\'。直角三角形A\'BCで $\\sin A=\\dfrac{a}{2R}$ → $\\dfrac{a}{\\sin A}=2R$。' }
    ]);
    draw();
    return { solve: function () { spots = { 1: 1, 2: 1, 3: 1 }; m.check(); diaSeen = true; m.check(); } };
  };

  /* =========================================================
   * cosine：余弦定理。b, c を固定して角Aを動かす → a² と b²+c² のずれが −2bc cosA
   * ========================================================= */
  LE.widgets.cosine = function (api) {
    var st = stage(api, 320, 220);
    var A = { x: 120, y: 190 }, c = 150, b = 110, th = 60;
    var B = { x: A.x + c, y: A.y };
    /* 角Aを変える点が動くレール（点線の半円） */
    el('path', { d: 'M' + (A.x + b) + ',' + A.y + ' A' + b + ',' + b + ' 0 0,0 ' + (A.x - b) + ',' + A.y, fill: 'none', stroke: 'rgba(255,255,255,.2)', 'stroke-width': 2, 'stroke-dasharray': '3 7', 'stroke-linecap': 'round' }, st.svg);
    var tri = el('polygon', { fill: 'rgba(255,255,255,.05)', stroke: K.ink, 'stroke-width': 2 }, st.svg);
    var aL = line(st.svg, B, B, K.hi, 4.5);
    var arc = el('path', { fill: 'rgba(56,217,255,.25)', stroke: K.cos, 'stroke-width': 1.5 }, st.svg);
    line(st.svg, A, B, K.ink, 2.5);
    text(st.svg, A.x + c / 2, A.y + 16, 'c', K.ink, 14); text(st.svg, A.x - 12, A.y + 4, 'A', K.ink, 13);
    var tb = text(st.svg, 0, 0, 'b', K.ink, 14), ta = text(st.svg, 0, 0, 'a', K.hi, 15);
    /* バー：a² と b²+c² と 補正項 */
    var barY = 18, sc = 0.0042;
    var bar1 = el('rect', { x: 20, y: barY, height: 12, fill: K.hi, rx: 3 }, st.svg), bar2 = el('rect', { x: 20, y: barY + 18, height: 12, fill: 'rgba(232,238,255,.5)', rx: 3 }, st.svg);
    var corr = el('rect', { y: barY + 18, height: 12, fill: K.cos, rx: 3, opacity: 0.8 }, st.svg);
    text(st.svg, 11, barY + 6, 'a²', K.hi, 11); text(st.svg, 8, barY + 24, 'b²+c²', K.ink, 9);
    var CC, hit90 = false, obt = false;
    function draw() {
      CC = { x: A.x + b * Math.cos(th * D2R), y: A.y - b * Math.sin(th * D2R) };
      set(tri, { points: [A, B, CC].map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ') });
      mvLine(aL, B, CC);
      set(arc, { d: wedge(A, B, CC, 24) });
      mvText(tb, (A.x + CC.x) / 2 - 12, (A.y + CC.y) / 2 - 6); mvText(ta, (B.x + CC.x) / 2 + 12, (B.y + CC.y) / 2 - 6);
      h.pos(CC.x, CC.y);
      var a2 = b * b + c * c - 2 * b * c * Math.cos(th * D2R), s2 = b * b + c * c, k = 2 * b * c * Math.cos(th * D2R);
      set(bar1, { width: Math.max(1, a2 * sc) }); set(bar2, { width: s2 * sc });
      if (k >= 0) set(corr, { x: 20 + (s2 - k) * sc, width: Math.max(0.5, k * sc), fill: K.cos }); else set(corr, { x: 20 + s2 * sc, width: -k * sc, fill: K.sin });
      var u = 1 / 400;
      var sR = Math.round(s2 * u * 10) / 10, kR = Math.round(k * u * 10) / 10;   /* 表示の足し算が必ず合うように */
      readout(api, st, '$A=' + Math.round(th) + '^\\circ$　$a^2=b^2+c^2\\textcolor{#38d9ff}{-2bc\\C A}$<br>$' + (sR - kR).toFixed(1) + '=' + sR.toFixed(1) + (kR >= 0 ? '-' : '+') + Math.abs(kR).toFixed(1) + '$' + (Math.round(th) === 90 ? '　<b style="color:#5cff9d">補正0 → 三平方！</b>' : ''));
    }
    var h = handle(st.svg, 0, 0, K.cos, function (x, y) { th = Math.max(15, Math.min(165, degOf(A, { x: x, y: Math.min(y, A.y) }))); draw(); }, function () {
      var t = snapTo(th, [30, 45, 60, 90, 120, 135, 150], 4);
      var fin = function () { if (Math.round(th) === 90) hit90 = true; if (th > 95) obt = true; m.check(); };
      if (t !== th) { var o = { v: th }; gsap.to(o, { v: t, duration: 0.45, ease: 'back.out(2.5)', onUpdate: function () { th = o.v; draw(); }, onComplete: function () { th = t; draw(); fin(); } }); api.tick(); } else fin();
    });
    var m = missions(api, st, [
      { goal: '角Aを <b>90°</b> にしてみよう。補正の部分はどうなる？', test: function () { return hit90; }, yay: '三平方の定理に！' },
      { goal: '角Aを<b>鈍角</b>（90°より大きく）にしてみよう', test: function () { return obt; }, yay: 'aが b²+c² をこえた！', msg: '余弦定理は「三平方＋補正」。鋭角なら a²<b²+c²、直角で等しい、鈍角なら a²>b²+c²。' }
    ]);
    draw();
    return { solve: function () { th = 90; draw(); hit90 = true; m.check(); th = 120; draw(); obt = true; m.check(); } };
  };

  /* =========================================================
   * bisector：角の二等分線と比。BD:DC = AB:AC
   * ========================================================= */
  LE.widgets.bisector = function (api) {
    var st = stage(api, 320, 220);
    var pts = [{ x: 120, y: 30 }, { x: 30, y: 190 }, { x: 290, y: 190 }];
    var g = el('g', {}, st.svg), m;
    var T = triWidget(api, st, pts, function (P) {
      g.innerHTML = '';
      var A = P[0], B = P[1], C = P[2], c = dist(A, B), b = dist(A, C);
      var D = lerpP(B, C, c / (b + c));
      el('polygon', { points: [A, B, C].map(function (p) { return p.x + ',' + p.y; }).join(' '), fill: 'rgba(255,255,255,.04)', stroke: K.ink, 'stroke-width': 2 }, g);
      line(g, A, B, K.sin, 4); line(g, A, C, K.cos, 4);
      line(g, B, D, K.sin, 6, { opacity: 0.55 }); line(g, D, C, K.cos, 6, { opacity: 0.55 });
      line(g, A, D, K.tan, 2.5, { 'stroke-dasharray': '6 4' });
      el('path', { d: wedge(A, B, D, 26), fill: 'rgba(255,216,77,.25)', stroke: K.tan }, g); el('path', { d: wedge(A, D, C, 32), fill: 'rgba(255,216,77,.25)', stroke: K.tan }, g);
      el('circle', { cx: D.x, cy: D.y, r: 4, fill: K.tan }, g);
      text(g, A.x, A.y - 12, 'A', K.ink, 13); text(g, B.x - 10, B.y + 10, 'B', K.ink, 13); text(g, C.x + 10, C.y + 10, 'C', K.ink, 13); text(g, D.x, D.y + 14, 'D', K.tan, 13);
      var bd = dist(B, D), dc = dist(D, C);
      readout(api, st, '<b style="color:' + K.sin + '">AB : AC</b> = ' + f(c / 20, 2) + ' : ' + f(b / 20, 2) + ' = <b>' + f(c / b, 3) + '</b><br><b style="color:' + K.cos + '">BD : DC</b> = ' + f(bd / 20, 2) + ' : ' + f(dc / 20, 2) + ' = <b>' + f(bd / dc, 3) + '</b>');
    }, { onEnd: function () { m.check(); } });
    m = missions(api, st, [{ goal: '頂点を動かして、2つの比を比べよう', test: function () { return T.drags() >= 3; }, prog: function () { return [T.drags(), 3]; }, yay: '比がそろう！', msg: '角の二等分線は、向かいの辺を「となりの2辺の比」に分ける：BD:DC＝AB:AC。' }]);
    return { solve: function () { T.drags = function () { return 3; }; m.check(); } };
  };

  /* =========================================================
   * centroid：重心。中線の交点Gは、各中線を 2:1 に分ける
   * ========================================================= */
  LE.widgets.centroid = function (api) {
    var st = stage(api, 320, 220);
    var pts = [{ x: 140, y: 22 }, { x: 30, y: 195 }, { x: 292, y: 175 }];
    var g = el('g', {}, st.svg), m;
    var T = triWidget(api, st, pts, function (P) {
      g.innerHTML = '';
      var A = P[0], B = P[1], C = P[2];
      var G = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 };
      el('polygon', { points: [A, B, C].map(function (p) { return p.x + ',' + p.y; }).join(' '), fill: 'rgba(255,255,255,.04)', stroke: K.ink, 'stroke-width': 2 }, g);
      [[A, lerpP(B, C, 0.5)], [B, lerpP(A, C, 0.5)], [C, lerpP(A, B, 0.5)]].forEach(function (e, i) {
        line(g, e[0], G, i === 0 ? K.sin : 'rgba(255,95,162,.45)', i === 0 ? 4 : 2.5); line(g, G, e[1], i === 0 ? K.cos : 'rgba(56,217,255,.45)', i === 0 ? 4 : 2.5);
        el('circle', { cx: e[1].x, cy: e[1].y, r: 3.5, fill: K.ink }, g);
      });
      var M = lerpP(B, C, 0.5);
      text(g, (A.x + G.x) / 2 + 12, (A.y + G.y) / 2, '2', K.sin, 15); text(g, (G.x + M.x) / 2 + 12, (G.y + M.y) / 2, '1', K.cos, 15);
      el('circle', { cx: G.x, cy: G.y, r: 5, fill: K.ok }, g); text(g, G.x - 12, G.y - 8, 'G', K.ok, 13);
      text(g, A.x, A.y - 12, 'A', K.ink, 13); text(g, B.x - 10, B.y + 10, 'B', K.ink, 13); text(g, C.x + 10, C.y + 10, 'C', K.ink, 13); text(g, M.x, M.y + 14, 'M', K.ink, 12);
      readout(api, st, '<b style="color:' + K.sin + '">AG</b> : <b style="color:' + K.cos + '">GM</b> = ' + f(dist(A, G) / 20, 2) + ' : ' + f(dist(G, M) / 20, 2) + ' = <b>2 : 1</b>　<small>（M は BC の中点）</small>');
    }, { onEnd: function () { m.check(); } });
    m = missions(api, st, [{ goal: '頂点を動かしてみよう。比は変わる？', test: function () { return T.drags() >= 3; }, prog: function () { return [T.drags(), 3]; }, yay: 'いつも 2:1！', msg: '重心は3本の中線の交点。頂点側が「2」、辺側が「1」。' }]);
    return { solve: function () { T.drags = function () { return 3; }; m.check(); } };
  };

  /* =========================================================
   * ceva / menelaus：比の積はいつも 1。「ぐるっと一周」を光でなぞる
   * ========================================================= */
  function loopPlayer(svg, path, color) {
    var ink = el('path', { d: path, fill: 'none', stroke: color, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.9 }, svg);
    var len = ink.getTotalLength(), pen = el('circle', { r: 6, fill: '#fff' }, svg);
    set(ink, { 'stroke-dasharray': len, 'stroke-dashoffset': len }); set(pen, { opacity: 0 });
    var o = { t: 0 };
    return gsap.timeline({ onComplete: function () { gsap.to([ink, pen], { opacity: 0, duration: 0.6, delay: 0.6, onComplete: function () { ink.remove(); pen.remove(); } }); } })
      .set(pen, { opacity: 1 })
      .to(o, { t: 1, duration: 2.6, ease: 'power1.inOut', onUpdate: function () { set(ink, { 'stroke-dashoffset': len * (1 - o.t) }); var p = ink.getPointAtLength(len * o.t); set(pen, { cx: p.x, cy: p.y }); } });
  }
  LE.widgets.ceva = function (api) {
    var st = stage(api, 320, 225);
    var A = { x: 160, y: 18 }, B = { x: 22, y: 205 }, C = { x: 298, y: 205 }, Pp = { x: 165, y: 140 };
    var g = el('g', {}, st.svg), played = false, drags = 0, cur;
    var btns = document.createElement('div'); btns.className = 'gw-btns';
    var pb = document.createElement('button'); pb.className = 'gw-btn'; pb.textContent = '▶ ぐるっと一周をなぞる'; btns.appendChild(pb);
    st.wrap.insertBefore(btns, st.read);
    pb.addEventListener('click', function () { played = true; loopPlayer(st.svg, 'M' + [A, cur.R, B, cur.Pq, C, cur.Q, A].map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' L'), K.tan); api.tick(); m.check(); });
    function draw() {
      g.innerHTML = '';
      var R = inter(C, Pp, A, B), Pq = inter(A, Pp, B, C), Q = inter(B, Pp, C, A);
      cur = { R: R, Pq: Pq, Q: Q };
      el('polygon', { points: [A, B, C].map(function (p) { return p.x + ',' + p.y; }).join(' '), fill: 'rgba(255,255,255,.04)', stroke: K.ink, 'stroke-width': 2 }, g);
      line(g, A, Pq, K.dim, 1.6); line(g, B, Q, K.dim, 1.6); line(g, C, R, K.dim, 1.6);
      [[A, R, K.sin], [R, B, K.sin], [B, Pq, K.cos], [Pq, C, K.cos], [C, Q, K.tan], [Q, A, K.tan]].forEach(function (e, i) { line(g, e[0], e[1], e[2], 4, { opacity: i % 2 ? 0.5 : 1 }); });
      [['R', R, -14, 0], ['P', Pq, 0, 14], ['Q', Q, 14, 0]].forEach(function (q) { el('circle', { cx: q[1].x, cy: q[1].y, r: 4, fill: K.ink }, g); text(g, q[1].x + q[2], q[1].y + q[3], q[0], K.ink, 13); });
      text(g, A.x, A.y - 10, 'A', K.ink, 13); text(g, B.x - 10, B.y + 6, 'B', K.ink, 13); text(g, C.x + 10, C.y + 6, 'C', K.ink, 13); text(g, Pp.x + 12, Pp.y - 4, 'O', K.hi, 12);
      var r1 = dist(A, R) / dist(R, B), r2 = dist(B, Pq) / dist(Pq, C), r3 = dist(C, Q) / dist(Q, A);
      readout(api, st, '$\\dfrac{\\textcolor{#ff5fa2}{AR}}{RB}\\cdot\\dfrac{\\textcolor{#38d9ff}{BP}}{PC}\\cdot\\dfrac{\\textcolor{#ffd84d}{CQ}}{QA}=' + f(r1) + '\\times' + f(r2) + '\\times' + f(r3) + '=\\mathbf{' + f(r1 * r2 * r3) + '}$');
      h.pos(Pp.x, Pp.y); st.svg.appendChild(h.g);
    }
    function inside(p) {
      function sgn(a, b, c) { return (a.x - c.x) * (b.y - c.y) - (b.x - c.x) * (a.y - c.y); }
      var d1 = sgn(p, A, B), d2 = sgn(p, B, C), d3 = sgn(p, C, A);
      return (d1 < -600 && d2 < -600 && d3 < -600) || (d1 > 600 && d2 > 600 && d3 > 600);
    }
    var h = handle(st.svg, 0, 0, K.hi, function (x, y) { var p = { x: x, y: y }; if (inside(p)) { Pp = p; draw(); } }, function () { drags++; m.check(); });
    var m = missions(api, st, [
      { goal: '三角形の中の点Oを動かしてみよう。積はどうなる？', test: function () { return drags >= 3; }, prog: function () { return [drags, 3]; }, yay: 'いつも 1！' },
      { goal: '「ぐるっと一周をなぞる」で、分子・分母の順番を目に焼きつけよう', test: function () { return played; }, yay: 'A→R→B→P→C→Q→A！', msg: 'チェバ：頂点から出発して「頂点→分点→頂点→分点…」と三角形を一周。通った順に 分子・分母・分子・分母…' }
    ]);
    draw();
    return { solve: function () { drags = 3; m.check(); played = true; m.check(); } };
  };
  LE.widgets.menelaus = function (api) {
    var st = stage(api, 320, 225);
    var A = { x: 120, y: 22 }, B = { x: 30, y: 200 }, C = { x: 215, y: 200 };
    var t1 = 0.3, t2 = 0.7; // 直線が AB 上（R）と AC 上（Q）を通る位置
    /* 直線と BC の延長の交点 P が画面の中におさまる位置だけ受けつける */
    function okP(a, b) { if (Math.abs(a - b) < 0.12) return false; var P = inter(lerpP(A, B, a), lerpP(A, C, b), B, C); return P.x > 12 && P.x < 308 && (P.x < B.x - 8 || P.x > C.x + 8); }
    var g = el('g', {}, st.svg), played = false, drags = 0, cur;
    var btns = document.createElement('div'); btns.className = 'gw-btns';
    var pb = document.createElement('button'); pb.className = 'gw-btn'; pb.textContent = '▶ きつねの一筆書き'; btns.appendChild(pb);
    st.wrap.insertBefore(btns, st.read);
    pb.addEventListener('click', function () { played = true; loopPlayer(st.svg, 'M' + [A, cur.R, B, cur.P, C, cur.Q, A].map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' L'), K.tan); api.tick(); m.check(); });
    function draw() {
      g.innerHTML = '';
      var R = lerpP(A, B, t1), Q = lerpP(A, C, t2), P = inter(R, Q, B, C);
      cur = { R: R, Q: Q, P: P };
      el('polygon', { points: [A, B, C].map(function (p) { return p.x + ',' + p.y; }).join(' '), fill: 'rgba(255,255,255,.04)', stroke: K.ink, 'stroke-width': 2 }, g);
      line(g, C, P, K.dim, 1.5, { 'stroke-dasharray': '4 4' });
      var far = lerpP(P, R, 1.25);
      line(g, P, far, K.ok, 2.5);
      [[A, R, K.sin], [R, B, K.sin], [B, P, K.cos], [P, C, K.cos], [C, Q, K.tan], [Q, A, K.tan]].forEach(function (e, i) { line(g, e[0], e[1], e[2], 4, { opacity: i % 2 ? 0.5 : 1 }); });
      [['R', R, -14, 0], ['P', P, 0, 14], ['Q', Q, 12, -4]].forEach(function (q) { el('circle', { cx: q[1].x, cy: q[1].y, r: 4, fill: K.ink }, g); text(g, q[1].x + q[2], q[1].y + q[3], q[0], K.ink, 13); });
      text(g, A.x, A.y - 10, 'A', K.ink, 13); text(g, B.x - 10, B.y + 6, 'B', K.ink, 13); text(g, C.x + 4, C.y + 14, 'C', K.ink, 13);
      var r1 = dist(A, R) / dist(R, B), r2 = dist(B, P) / dist(P, C), r3 = dist(C, Q) / dist(Q, A);
      readout(api, st, '$\\dfrac{\\textcolor{#ff5fa2}{AR}}{RB}\\cdot\\dfrac{\\textcolor{#38d9ff}{BP}}{PC}\\cdot\\dfrac{\\textcolor{#ffd84d}{CQ}}{QA}=' + f(r1) + '\\times' + f(r2) + '\\times' + f(r3) + '=\\mathbf{' + f(r1 * r2 * r3) + '}$');
      h1.pos(R.x, R.y); h2.pos(Q.x, Q.y); st.svg.appendChild(h1.g); st.svg.appendChild(h2.g);
    }
    function proj(a, b, x, y) { var dx = b.x - a.x, dy = b.y - a.y; return Math.max(0.15, Math.min(0.85, ((x - a.x) * dx + (y - a.y) * dy) / (dx * dx + dy * dy))); }
    var h1 = handle(st.svg, 0, 0, K.ok, function (x, y) { var t = proj(A, B, x, y); if (okP(t, t2)) { t1 = t; draw(); } }, function () { drags++; m.check(); });
    var h2 = handle(st.svg, 0, 0, K.ok, function (x, y) { var t = proj(A, C, x, y); if (okP(t1, t)) { t2 = t; draw(); } }, function () { drags++; m.check(); });
    var m = missions(api, st, [
      { goal: '緑の直線（の2つの点）を動かしてみよう。積は？', test: function () { return drags >= 3; }, prog: function () { return [drags, 3]; }, yay: 'やっぱり 1！' },
      { goal: '「きつねの一筆書き」を見て、なぞる順番を覚えよう', test: function () { return played; }, yay: 'コンッ！🦊', msg: 'メネラウス：頂点→分点→頂点…と、三角形と直線を一筆書き。外にはみ出す P をまたいで戻ってくる形が「きつね」の顔に見える！' }
    ]);
    draw();
    return { solve: function () { drags = 3; m.check(); played = true; m.check(); } };
  };
})();
