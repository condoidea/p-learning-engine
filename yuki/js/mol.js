/* =========================================================
 * yuki/mol.js — 分子と魔法陣
 *
 *  Y.Mol.parse(atoms, bonds)  文字列から分子を作る（data/ で使う）
 *     atoms: 'C c1 0 0; H h1 0 -1; …'（元素 名前 x y。1 ＝ 結合1本の長さ）
 *     bonds: 'c1-h1 c1=c2 …'（- 単結合 / = 二重結合）
 *  Y.Mol.applyOps(snap, ops)  詠唱の1行ぶんの変化を分子に加える（画面なしでも動く。教材チェックでも使う）
 *     ops: { move:{id:[x,y]}, add:[[id, el, x, y, fromX, fromY]], del:[id], bond:[['a','b',n]]（n=0 で切る）,
 *            glow:[id], label:[{t, x, y}], tint:'bromine' | null, fx:'light' | 'heat' | 'wind' }
 *  Y.Mol.view(el)   魔法陣つきの分子の絵。load(snap) / apply(ops, ms) / lit(on) / attr(name)
 *  Y.Mol.mini(snap) 選択肢などに使う小さな分子の絵（SVG 文字列）
 *  Y.Build(el, puzzle, cb)   錬成（骨格に C・O を置いて分子を作る）
 * ========================================================= */
(function () {
  'use strict';
  var Y = window.Y = window.Y || {};
  var VAL = { C: 4, H: 1, O: 2, N: 3, Cl: 1, Br: 1 };

  function parse(atoms, bonds) {
    var s = { atoms: {}, order: [], bonds: [], glow: [], labels: [], tint: null };
    String(atoms).split(';').forEach(function (p) {
      var t = p.trim().split(/\s+/); if (t.length < 4) return;
      s.atoms[t[1]] = { el: t[0], x: +t[2], y: +t[3], o: 1 }; s.order.push(t[1]);
    });
    String(bonds || '').trim().split(/\s+/).forEach(function (b) {
      if (!b) return;
      var m = /^(\w+)([-=#])(\w+)$/.exec(b); if (!m) throw new Error('bond ' + b);
      s.bonds.push({ a: m[1], b: m[3], n: m[2] === '=' ? 2 : m[2] === '#' ? 3 : 1 });
    });
    return s;
  }
  function clone(s) {
    var c = { atoms: {}, order: s.order.slice(), bonds: s.bonds.map(function (b) { return { a: b.a, b: b.b, n: b.n }; }),
      glow: (s.glow || []).slice(), labels: (s.labels || []).map(function (l) { return { t: l.t, x: l.x, y: l.y }; }), tint: s.tint || null };
    for (var k in s.atoms) { var a = s.atoms[k]; c.atoms[k] = { el: a.el, x: a.x, y: a.y, o: a.o == null ? 1 : a.o }; }
    return c;
  }
  function findBond(s, a, b) {
    for (var i = 0; i < s.bonds.length; i++) { var x = s.bonds[i]; if ((x.a === a && x.b === b) || (x.a === b && x.b === a)) return i; }
    return -1;
  }
  function applyOps(s0, ops) {
    var s = clone(s0); ops = ops || {};
    s.glow = ops.glow || [];
    if (ops.label !== undefined) s.labels = ops.label || [];
    if (ops.tint !== undefined) s.tint = ops.tint;
    (ops.add || []).forEach(function (a) { s.atoms[a[0]] = { el: a[1], x: a[2], y: a[3], o: 1, fx: a[4], fy: a[5] }; if (s.order.indexOf(a[0]) < 0) s.order.push(a[0]); });
    for (var id in (ops.move || {})) { if (!s.atoms[id]) throw new Error('move: no atom ' + id); s.atoms[id].x = ops.move[id][0]; s.atoms[id].y = ops.move[id][1]; }
    (ops.bond || []).forEach(function (b) {
      if (!s.atoms[b[0]] || !s.atoms[b[1]]) throw new Error('bond: no atom ' + b[0] + '/' + b[1]);
      var i = findBond(s, b[0], b[1]);
      if (b[2] === 0) { if (i >= 0) s.bonds.splice(i, 1); }
      else if (i >= 0) s.bonds[i].n = b[2]; else s.bonds.push({ a: b[0], b: b[1], n: b[2] });
    });
    (ops.del || []).forEach(function (id) {
      delete s.atoms[id]; s.order = s.order.filter(function (x) { return x !== id; });
      s.bonds = s.bonds.filter(function (b) { return b.a !== id && b.b !== id; });
    });
    return s;
  }
  /* 手の数（原子価）が合っているか。合わない原子の一覧を返す（教材チェック用） */
  function valenceErrors(s) {
    var deg = {}, bad = [];
    s.bonds.forEach(function (b) { deg[b.a] = (deg[b.a] || 0) + b.n; deg[b.b] = (deg[b.b] || 0) + b.n; });
    s.order.forEach(function (id) { var a = s.atoms[id]; if ((deg[id] || 0) !== VAL[a.el]) bad.push(id + '(' + a.el + ':' + (deg[id] || 0) + ')'); });
    return bad;
  }
  function bbox(s) {
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    s.order.forEach(function (id) { var a = s.atoms[id]; x0 = Math.min(x0, a.x); x1 = Math.max(x1, a.x); y0 = Math.min(y0, a.y); y1 = Math.max(y1, a.y); });
    (s.labels || []).forEach(function (l) { x0 = Math.min(x0, l.x - 0.6); x1 = Math.max(x1, l.x + 0.6); y0 = Math.min(y0, l.y); y1 = Math.max(y1, l.y); });
    return { x0: x0, y0: y0, x1: x1, y1: y1 };
  }
  function union(a, b) { return { x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) }; }

  Y.Mol = { parse: parse, clone: clone, applyOps: applyOps, valenceErrors: valenceErrors, bbox: bbox, union: union, VAL: VAL };

  /* 錬成の台座（画面なしでも使う部分） */
  var SLOTS = {};
  [0, 1, 2, 3, 4].forEach(function (i) { SLOTS['r' + i] = [i - 2, 0]; });
  [1, 2, 3].forEach(function (i) { SLOTS['u' + i] = [i - 2, -1]; SLOTS['d' + i] = [i - 2, 1]; });
  function adjSlots(a, b) {
    var p = SLOTS[a], q = SLOTS[b];
    if (a[0] === 'r' && b[0] === 'r') return Math.abs(p[0] - q[0]) === 1;
    if (a[0] === 'r' || b[0] === 'r') return p[0] === q[0] && Math.abs(p[1] - q[1]) === 1;
    return false;
  }
  function graphOf(place) {   /* place: { slot: el } */
    var ids = Object.keys(place), adj = {};
    ids.forEach(function (a) { adj[a] = ids.filter(function (b) { return b !== a && adjSlots(a, b); }); });
    return { ids: ids, adj: adj };
  }
  function canon(place) {
    var g = graphOf(place), best = null;
    function enc(v, par) {
      return place[v] + '(' + g.adj[v].filter(function (x) { return x !== par; }).map(function (x) { return enc(x, v); }).sort().join(',') + ')';
    }
    g.ids.forEach(function (r) { var c = enc(r, null); if (best === null || c < best) best = c; });
    return best;
  }
  function connected(place) {
    var g = graphOf(place); if (!g.ids.length) return false;
    var seen = {}, st = [g.ids[0]];
    while (st.length) { var v = st.pop(); if (seen[v]) continue; seen[v] = 1; g.adj[v].forEach(function (x) { st.push(x); }); }
    return Object.keys(seen).length === g.ids.length;
  }
  function parseSet(str) { var p = {}; str.trim().split(/\s+/).forEach(function (t) { var m = t.split(':'); p[m[1]] = m[0]; }); return p; }
  var SUB = '₀₁₂₃₄₅₆₇₈₉';
  function sub(n) { return String(n).split('').map(function (c) { return SUB[+c]; }).join(''); }
  function label(el, deg) {
    var h = VAL[el] - deg;
    if (el === 'O') return h === 2 ? 'H₂O' : h === 1 ? 'OH' : 'O';
    return el + (h > 0 ? 'H' + (h > 1 ? sub(h) : '') : '');
  }
  Y.BuildCore = { canon: canon, parseSet: parseSet, connected: connected, label: label, SLOTS: SLOTS };
  if (typeof document === 'undefined') return;

  /* =========================================================
   * 絵（SVG）
   * ========================================================= */
  var NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  var RUNE = 'C · H · O · N · ⬡ · HONC 1234 · ✦ · C · H · O · N · ⬡ · ✧ · CₙH₂ₙ₊₂ · ✦ · ';
  function circleSVG(id) {
    return '<svg class="mc" viewBox="-170 -170 340 340" aria-hidden="true">' +
      '<defs><path id="rp' + id + '" d="M0,-151 a151,151 0 1,1 -0.1,0"/>' +
      '<radialGradient id="rg' + id + '"><stop offset="0" stop-color="var(--ac)" stop-opacity=".28"/><stop offset=".7" stop-color="var(--ac)" stop-opacity=".06"/><stop offset="1" stop-color="var(--ac)" stop-opacity="0"/></radialGradient></defs>' +
      '<circle class="mc-tint" r="140"/>' +
      '<circle class="mc-glow" r="168" fill="url(#rg' + id + ')"/>' +
      '<g class="mc-spin"><circle class="mc-r1" r="162"/><circle class="mc-r2" r="140"/>' +
      '<text class="mc-rune"><textPath href="#rp' + id + '">' + RUNE + RUNE.slice(0, 28) + '</textPath></text></g>' +
      '<g class="mc-spin2"><polygon class="mc-hex" points="0,-140 121,-70 121,70 0,140 -121,70 -121,-70"/>' +
      '<polygon class="mc-hex" points="0,-140 121,70 -121,70"/><polygon class="mc-hex" points="0,140 121,-70 -121,-70"/></g>' +
      '<g class="mc-fx"></g><g class="mc-mol"></g></svg>';
  }
  var uid = 0;

  function view(host) {
    var id = ++uid;
    host.innerHTML = '<div class="mcw">' + circleSVG(id) + '</div>';
    var svg = host.querySelector('svg'), gm = svg.querySelector('.mc-mol'), gfx = svg.querySelector('.mc-fx'), tintC = svg.querySelector('.mc-tint');
    var cur = null, S = 40, K = 1, cx = 0, cy = 0, nodes = {}, bondEls = {}, labelEls = [];
    function fit(box) {
      var w = Math.max(1, box.x1 - box.x0), h = Math.max(1, box.y1 - box.y0);
      S = Math.min(46, 250 / w, 210 / h);
      K = Math.min(1, S / 40);   /* 大きな分子は原子の丸も小さくする（重ならないように） */
      cx = (box.x0 + box.x1) / 2; cy = (box.y0 + box.y1) / 2;
    }
    function P(a) { return [(a.x - cx) * S, (a.y - cy) * S]; }
    function atomNode(aid, a) {
      var g = svgEl('g', { 'class': 'at at-' + a.el }, gm);
      var r = a.el === 'H' ? 11 : 15;
      svgEl('circle', { r: r }, g);
      var t = svgEl('text', { 'text-anchor': 'middle', dy: '.36em' }, g); t.textContent = a.el;
      nodes[aid] = g; return g;
    }
    function draw(s, k) {   /* k：0〜1 の途中（from → s） */
      /* 結合 */
      var keep = {};
      s.bonds.forEach(function (b) {
        var key = b.a < b.b ? b.a + '|' + b.b : b.b + '|' + b.a; keep[key] = true;
        var e = bondEls[key];
        if (!e) { e = bondEls[key] = svgEl('g', { 'class': 'bd' }, gm); gm.insertBefore(e, gm.firstChild); e._n = 0; }
        if (e._n !== b.n) {
          e.innerHTML = ''; e._n = b.n;
          for (var i = 0; i < b.n; i++) svgEl('line', {}, e);
          e.classList.toggle('dbl', b.n > 1);
        }
        var A = s.atoms[b.a], B = s.atoms[b.b];
        var p = P(A), q = P(B), dx = q[0] - p[0], dy = q[1] - p[1], L = Math.sqrt(dx * dx + dy * dy) || 1;
        var nx = -dy / L * 4, ny = dx / L * 4;
        Array.prototype.forEach.call(e.children, function (ln, i) {
          var off = b.n === 1 ? 0 : (i - (b.n - 1) / 2) * 2;
          ln.setAttribute('x1', p[0] + nx * off); ln.setAttribute('y1', p[1] + ny * off);
          ln.setAttribute('x2', q[0] + nx * off); ln.setAttribute('y2', q[1] + ny * off);
        });
        e.style.opacity = Math.min(A.o, B.o);
      });
      for (var key in bondEls) if (!keep[key]) { bondEls[key].remove(); delete bondEls[key]; }
      /* 原子 */
      s.order.forEach(function (aid) {
        var a = s.atoms[aid], g = nodes[aid] || atomNode(aid, a), p = P(a);
        g.setAttribute('transform', 'translate(' + p[0].toFixed(1) + ',' + p[1].toFixed(1) + ') scale(' + ((a.sc || 1) * K).toFixed(3) + ')');
        g.style.opacity = a.o;
        g.classList.toggle('glow', (s.glow || []).indexOf(aid) >= 0);
      });
      for (var nid in nodes) if (!s.atoms[nid]) { nodes[nid].remove(); delete nodes[nid]; }
    }
    function drawLabels(s) {
      labelEls.forEach(function (l) { l.remove(); }); labelEls = [];
      (s.labels || []).forEach(function (l) {
        var t = svgEl('text', { 'class': 'mlab', 'text-anchor': 'middle', x: (l.x - cx) * S, y: (l.y - cy) * S }, gm);
        t.textContent = l.t; labelEls.push(t);
      });
    }
    function tint(t) { tintC.setAttribute('class', 'mc-tint' + (t ? ' t-' + t : '')); }
    var ease = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

    var V = {
      el: host,
      load: function (s, box) {
        gm.innerHTML = ''; nodes = {}; bondEls = {}; labelEls = [];
        cur = clone(s); fit(box || bbox(s)); draw(cur); drawLabels(cur); tint(cur.tint);
      },
      snap: function () { return cur; },
      /* ops を加えて、ms かけて動かす */
      apply: function (ops, ms) {
        var from = cur, to = applyOps(cur, ops);
        cur = to; tint(to.tint);
        if (ops.fx) V.fx(ops.fx);
        ms = Y.RM ? 0 : (ms == null ? 650 : ms);
        /* 消える原子は、消えるまで残しておく */
        var mid = clone(to);
        from.order.forEach(function (aid) { if (!to.atoms[aid]) { var a = from.atoms[aid]; mid.atoms[aid] = { el: a.el, x: a.x, y: a.y, o: 0 }; mid.order.push(aid); } });
        return new Promise(function (res) {
          if (!ms) { draw(to); drawLabels(to); res(); return; }
          var t0 = performance.now();
          drawLabels({ labels: [] });
          (function frame(now) {
            var k = Math.min(1, (now - t0) / ms), e = ease(k), s = clone(mid);
            s.order.forEach(function (aid) {
              var A = from.atoms[aid], B = mid.atoms[aid], a = s.atoms[aid];
              if (A) { a.x = A.x + (B.x - A.x) * e; a.y = A.y + (B.y - A.y) * e; a.o = (A.o == null ? 1 : A.o) + (B.o - (A.o == null ? 1 : A.o)) * e; }
              else { var fx = B.fx != null ? B.fx : B.x, fy = B.fy != null ? B.fy : B.y; a.x = fx + (B.x - fx) * e; a.y = fy + (B.y - fy) * e; a.o = e; a.sc = 0.4 + 0.6 * e; }
            });
            /* 前半は前の結合、後半で新しい結合に切りかわる（切れる結合は前半で消える） */
            var src = k < 0.5 ? from.bonds : to.bonds;
            s.bonds = src.filter(function (b) { return s.atoms[b.a] && s.atoms[b.b] && (k >= 0.5 || k < 0.25 || findBond(to, b.a, b.b) >= 0); });
            draw(s);
            if (k < 1) requestAnimationFrame(frame);
            else { draw(to); drawLabels(to); res(); }
          })(t0);
        });
      },
      lit: function (on) { host.firstChild.classList.toggle('lit', !!on); },
      fizzle: function () { var w = host.firstChild; w.classList.remove('fz'); void w.offsetWidth; w.classList.add('fz'); },
      attr: function (a) { host.firstChild.setAttribute('data-attr', a || ''); },
      /* 演出：光の雨・炎・風 */
      fx: function (kind) {
        if (Y.RM) return;
        var g = svgEl('g', { 'class': 'fx-' + kind }, gfx);
        var n = kind === 'light' ? 9 : kind === 'heat' ? 12 : 8;
        for (var i = 0; i < n; i++) {
          if (kind === 'light') svgEl('line', { x1: -120 + i * 30, y1: -170, x2: -150 + i * 30, y2: 170, style: 'animation-delay:' + (i * 0.06) + 's' }, g);
          else if (kind === 'heat') svgEl('circle', { cx: Math.cos(i / n * 6.283) * 128, cy: Math.sin(i / n * 6.283) * 128, r: 9, style: 'animation-delay:' + (i * 0.05) + 's' }, g);
          else svgEl('path', { d: 'M-160,' + (-100 + i * 28) + ' q80,-30 160,0 t160,0', style: 'animation-delay:' + (i * 0.07) + 's' }, g);
        }
        setTimeout(function () { g.remove(); }, 1800);
      }
    };
    return V;
  }

  /* 小さな分子の絵（選択肢・呪文書） */
  function mini(s, w) {
    var b = bbox(s), pad = 0.7;
    var vb = [(b.x0 - pad) * 30, (b.y0 - pad) * 30, (b.x1 - b.x0 + pad * 2) * 30, (b.y1 - b.y0 + pad * 2) * 30].map(function (v) { return v.toFixed(0); }).join(' ');
    /* どの分子も同じ縮尺で描く（小さい分子が大きく見えないように）。入りきらないときだけ縮む */
    var natural = Math.round((b.x1 - b.x0 + pad * 2) * 30 * 0.72);
    var h = '<svg class="mini" viewBox="' + vb + '" style="width:' + natural + 'px" aria-hidden="true">';
    s.bonds.forEach(function (bd) {
      var A = s.atoms[bd.a], B = s.atoms[bd.b], dx = B.x - A.x, dy = B.y - A.y, L = Math.sqrt(dx * dx + dy * dy) || 1;
      for (var i = 0; i < bd.n; i++) {
        var off = bd.n === 1 ? 0 : (i - (bd.n - 1) / 2) * 6;
        h += '<line x1="' + (A.x * 30 - dy / L * off) + '" y1="' + (A.y * 30 + dx / L * off) + '" x2="' + (B.x * 30 - dy / L * off) + '" y2="' + (B.y * 30 + dx / L * off) + '"/>';
      }
    });
    s.order.forEach(function (id) {
      var a = s.atoms[id];
      h += '<g class="at at-' + a.el + '" transform="translate(' + a.x * 30 + ',' + a.y * 30 + ')"><circle r="' + (a.el === 'H' ? 8 : 11) + '"/><text text-anchor="middle" dy=".36em">' + a.el + '</text></g>';
    });
    return h + '</svg>';
  }
  Y.Mol.view = view; Y.Mol.mini = mini;

  /* 台座の形を、略した書き方（CH₃・CH₂…）の絵で見せる（錬成と同じ見た目） */
  Y.Mol.pic = function (set) {
    var place = parseSet(set), ids = Object.keys(place), SX = 68, SY = 60;
    var xs = ids.map(function (s) { return SLOTS[s][0]; }), ys = ids.map(function (s) { return SLOTS[s][1]; });
    var x0 = Math.min.apply(null, xs) * SX - 34, x1 = Math.max.apply(null, xs) * SX + 34, y0 = Math.min.apply(null, ys) * SY - 24, y1 = Math.max.apply(null, ys) * SY + 24;
    var h = '<svg class="pic" viewBox="' + [x0, y0, x1 - x0, y1 - y0].join(' ') + '" style="max-width:' + Math.round((x1 - x0) * 0.9) + 'px" aria-hidden="true">';
    ids.forEach(function (a) { ids.forEach(function (b) { if (a < b && adjSlots(a, b)) h += '<line class="bb" x1="' + SLOTS[a][0] * SX + '" y1="' + SLOTS[a][1] * SY + '" x2="' + SLOTS[b][0] * SX + '" y2="' + SLOTS[b][1] * SY + '"/>'; }); });
    ids.forEach(function (s) {
      var deg = ids.filter(function (b) { return b !== s && adjSlots(s, b); }).length;
      h += '<g class="slot on at-' + place[s] + '" transform="translate(' + SLOTS[s][0] * SX + ',' + SLOTS[s][1] * SY + ')"><rect x="-27" y="-18" width="54" height="36" rx="18"/><text text-anchor="middle" dy=".36em">' + label(place[s], deg) + '</text></g>';
    });
    return h + '</svg>';
  };

  /* =========================================================
   * 錬成（骨格づくり）
   *  くしの形の台座（横5つ・上下に3つずつ）に、C や O を置く。台座どうしは環にならないので、できるのは鎖と枝だけ
   *  H は手の余りから自動で数え、CH₃ / CH₂ / OH のように略して書く（＝示性式の書き方に慣れる）
   *
   *  puzzle = { mat: { C: 4, O: 0 }, answers: [{ name, yomi, set: 'C:r0 C:r1 C:r2 C:r3' }], hint }
   *  cb = { found(ans, n), dup(ans), bad(msg), change() }
   * ========================================================= */
  Y.Build = function (host, pz, cb) {
    cb = cb || {};
    var place = {}, found = [], mats = Object.keys(pz.mat).filter(function (k) { return pz.mat[k] > 0; });
    pz.answers.forEach(function (a) { a._c = canon(parseSet(a.set)); });
    host.innerHTML = '<div class="bld"><div class="mcw bw">' + circleSVG('b' + (++uid)) + '</div>' +
      '<div class="bld-bar"><span class="bld-mat"></span><button class="bld-clr" type="button">↺ やり直す</button></div></div>';
    var w = host.querySelector('.mcw'), gm = w.querySelector('.mc-mol'), matEl = host.querySelector('.bld-mat');
    var SX = 68, SY = 60;
    function count(el) { var n = 0; for (var k in place) if (place[k] === el) n++; return n; }
    function render() {
      gm.innerHTML = '';
      var g = graphOf(place);
      /* 結合 */
      g.ids.forEach(function (a) { g.adj[a].forEach(function (b) { if (a < b) svgEl('line', { 'class': 'bb', x1: SLOTS[a][0] * SX, y1: SLOTS[a][1] * SY, x2: SLOTS[b][0] * SX, y2: SLOTS[b][1] * SY }, gm); }); });
      Object.keys(SLOTS).forEach(function (s) {
        var p = SLOTS[s], el = place[s];
        var gg = svgEl('g', { 'class': 'slot' + (el ? ' on at-' + el : ''), transform: 'translate(' + p[0] * SX + ',' + p[1] * SY + ')', 'data-s': s, role: 'button', tabindex: '0' }, gm);
        svgEl('rect', { x: -27, y: -18, width: 54, height: 36, rx: 18 }, gg);
        var t = svgEl('text', { 'text-anchor': 'middle', dy: '.36em' }, gg);
        t.textContent = el ? label(el, g.adj[s].length) : '';
        /* タップの範囲は少し大きめ */
        svgEl('rect', { 'class': 'hit', x: -31, y: -30, width: 62, height: 60 }, gg);
      });
      matEl.innerHTML = mats.map(function (m) {
        var left = pz.mat[m] - count(m);
        return '<span class="mt at-' + m + (left ? '' : ' zero') + '"><b>' + m + '</b>×' + left + '</span>';
      }).join('') + '<small>台座をタップして置く</small>';
      if (cb.change) cb.change();
    }
    function cycle(s) {
      var order = [null].concat(mats), i = order.indexOf(place[s] || null);
      for (var k = 1; k <= order.length; k++) {
        var nx = order[(i + k) % order.length];
        if (nx === null || count(nx) < pz.mat[nx]) { if (nx === null) delete place[s]; else place[s] = nx; break; }
      }
      Y.se('tap');
      render(); check();
    }
    function check() {
      var full = mats.every(function (m) { return count(m) === pz.mat[m]; });
      w.classList.remove('lit');
      if (!full) return;
      if (!connected(place)) { if (cb.bad) cb.bad('バラバラだと魔法陣にならない。全部を手でつなごう'); w.classList.add('fz'); setTimeout(function () { w.classList.remove('fz'); }, 600); return; }
      var g = graphOf(place);
      for (var s in place) if (place[s] === 'O' && g.adj[s].length > 2) { if (cb.bad) cb.bad('O の手は 2 本。3 本以上はつなげない'); return; }
      for (var s2 in place) if (place[s2] === 'O') { if (g.adj[s2].some(function (x) { return place[x] === 'O'; })) { if (cb.bad) cb.bad('O どうしをつなぐ形は、この冒険では使わない（不安定）'); return; } }
      var c = canon(place), ans = null;
      pz.answers.forEach(function (a) { if (a._c === c) ans = a; });
      if (!ans) { if (cb.bad) cb.bad('この形は今回の答えにない'); return; }
      if (found.indexOf(ans) >= 0) { if (cb.dup) cb.dup(ans); return; }
      found.push(ans); w.classList.add('lit');
      if (cb.found) cb.found(ans, found.length);
    }
    host.addEventListener('click', function (e) {
      var sl = e.target.closest && e.target.closest('[data-s]'); if (sl && !host.classList.contains('lock')) { cycle(sl.getAttribute('data-s')); return; }
      if (e.target.closest && e.target.closest('.bld-clr')) { place = {}; Y.se('whoosh'); render(); }
    });
    render();
    return {
      clear: function () { place = {}; render(); },
      found: function () { return found.slice(); },
      lock: function (on) { host.classList.toggle('lock', !!on); },
      el: w
    };
  };
})();
