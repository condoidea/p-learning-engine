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

  /* 錬成の形の書き方（画面なしでも使う部分）。答えの形は、くし形のマス（横5・上下3ずつ）の名前 'C:r0 C:r1 …' で書く */
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
  /* つながり方の「指紋」：どこから描いても、曲げても裏返しても同じ文字列になる（木の正規形） */
  function canonG(els, adj) {
    var best = null;
    function enc(v, par) {
      return els[v] + '(' + adj[v].filter(function (x) { return x !== par; }).map(function (x) { return enc(x, v); }).sort().join(',') + ')';
    }
    Object.keys(els).forEach(function (r) { var c = enc(r, null); if (best === null || c < best) best = c; });
    return best;
  }
  function canon(place) { return canonG(place, graphOf(place).adj); }
  /* その骨組みに必要な H の数（手の余りの合計） */
  function hNeed(place) { var g = graphOf(place), n = 0; g.ids.forEach(function (v) { n += VAL[place[v]] - g.adj[v].length; }); return n; }
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
  Y.BuildCore = { canon: canon, canonG: canonG, hNeed: hNeed, parseSet: parseSet, connected: connected, label: label, SLOTS: SLOTS };
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
  function mini(s, w, opt) {
    var hl = (opt && opt.hl) || [];
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
      h += '<g class="at at-' + a.el + (hl.indexOf(id) >= 0 ? ' hl' : '') + '" transform="translate(' + a.x * 30 + ',' + a.y * 30 + ')"><circle r="' + (a.el === 'H' ? 8 : 11) + '"/><text text-anchor="middle" dy=".36em">' + a.el + '</text></g>';
    });
    return h + '</svg>';
  }
  Y.Mol.view = view; Y.Mol.mini = mini;

  /* =========================================================
   * 構造式の絵（H まで全部描く）
   *  重い原子（C・O）はマス目に置き、H は手の向きに半マスの所に描く。手の向きは 上・右・下・左
   * ========================================================= */
  var DIRS = { U: [0, -1], R: [1, 0], D: [0, 1], L: [-1, 0] };
  var OPP = { U: 'D', D: 'U', L: 'R', R: 'L' };
  function dirOf(a, b) { var dx = b.x - a.x, dy = b.y - a.y; return dx === 1 ? 'R' : dx === -1 ? 'L' : dy === 1 ? 'D' : 'U'; }
  /* その原子の手の向き。C は4方向。O は「つながった向き」とその反対（つながりがなければ左右） */
  function handsOf(a, bondDirs) {
    if (a.el === 'C') return ['U', 'R', 'D', 'L'];
    if (a.el === 'O') { var d = bondDirs[0]; return d ? [d, OPP[d]] : ['L', 'R']; }
    return [];
  }
  var U = 46;   /* 1マスの大きさ（px） */
  function atomSVG(el, x, y, cls) {
    return '<g class="at at-' + el + (cls ? ' ' + cls : '') + '" transform="translate(' + x + ',' + y + ')"><circle r="' + (el === 'H' ? 10 : 15) + '"/><text text-anchor="middle" dy=".36em">' + el + '</text></g>';
  }
  /* 骨組み（{ id: {el, x, y} } と結合）から、H まで描いた SVG の中身 */
  function structSVG(heavy, bonds, hs) {
    var h = '';
    bonds.forEach(function (b) { var A = heavy[b[0]], B = heavy[b[1]]; h += '<line class="bb" x1="' + A.x * U + '" y1="' + A.y * U + '" x2="' + B.x * U + '" y2="' + B.y * U + '"/>'; });
    hs.forEach(function (H) { var A = heavy[H.p], d = DIRS[H.d]; h += '<line class="bh" x1="' + A.x * U + '" y1="' + A.y * U + '" x2="' + (A.x + d[0] * 0.55) * U + '" y2="' + (A.y + d[1] * 0.55) * U + '"/>'; });
    hs.forEach(function (H) { var A = heavy[H.p], d = DIRS[H.d]; h += atomSVG('H', (A.x + d[0] * 0.55) * U, (A.y + d[1] * 0.55) * U, H.cls); });
    Object.keys(heavy).forEach(function (k) { var A = heavy[k]; h += atomSVG(A.el, A.x * U, A.y * U); });
    return h;
  }
  /* 骨組みの残りの手を、ぜんぶ H で埋めた位置 */
  function fillH(heavy, bonds) {
    var hs = [];
    Object.keys(heavy).forEach(function (k) {
      var A = heavy[k], used = [];
      bonds.forEach(function (b) { if (b[0] === k) used.push(dirOf(A, heavy[b[1]])); if (b[1] === k) used.push(dirOf(A, heavy[b[0]])); });
      handsOf(A, used).forEach(function (d) { if (used.indexOf(d) < 0) hs.push({ p: k, d: d }); });
    });
    return hs;
  }
  /* マスの記法（'C:r0 C:r1 …'）の形を、H まで描いた絵にする（問題の図に使う） */
  Y.Mol.pic = function (set) {
    var place = parseSet(set), heavy = {}, bonds = [], ids = Object.keys(place);
    ids.forEach(function (s) { heavy[s] = { el: place[s], x: SLOTS[s][0], y: SLOTS[s][1] }; });
    ids.forEach(function (a) { ids.forEach(function (b) { if (a < b && adjSlots(a, b)) bonds.push([a, b]); }); });
    var xs = ids.map(function (s) { return heavy[s].x; }), ys = ids.map(function (s) { return heavy[s].y; });
    var x0 = (Math.min.apply(null, xs) - 0.85) * U, x1 = (Math.max.apply(null, xs) + 0.85) * U, y0 = (Math.min.apply(null, ys) - 0.85) * U, y1 = (Math.max.apply(null, ys) + 0.85) * U;
    return '<svg class="pic" viewBox="' + [x0, y0, x1 - x0, y1 - y0].join(' ') + '" style="max-width:' + Math.round((x1 - x0) * 0.85) + 'px" aria-hidden="true">' + structSVG(heavy, bonds, fillH(heavy, bonds)) + '</svg>';
  };

  /* =========================================================
   * 錬成：素材（C・O・H）を、原子の空いている「手」までドラッグしてつなぐ
   *  ・光っている小さな丸が「空いている手」。素材をそこへ運ぶ（または素材をタップ → 手をタップ）
   *  ・H は手が1本なので、骨組みの先には何もつなげない。C・O は新しいマスに置かれ、そこからまた手が出る
   *  ・ほかの原子のとなり（つながっていないのに、くっついて見える所）には置けない＝環はできない
   *  ・素材を使いきって、空いている手が1本もなくなったら魔法陣が光る（＝原子価がそろった）
   *
   *  分子が大きくなったときの工夫
   *   ・hFill：「水素の筆」ボタンで、残りの手をまとめて H で埋める（骨組みづくりに集中できる）
   *   ・parts：原子のまとまり（パーツ）をひとつで置ける。CH₃（メチル基）・OH（ヒドロキシ基）。
   *     パーツも素材（C・O・H）を使う。つなぐ手は 1 本だけで、残りの手には H が最初から付いている
   *     （芳香族の章では、ベンゼン環をパーツにする予定）
   *
   *  操作の練習：guide: [{ t: '…', until: 'heavy:1' | 'heavy:2' | 'sel:H' | 'h:6' | 'full' }] を順に出し、できたら次へ
   *  わからないとき：「💡 ヒント」を押すたびに、hints の文が1つずつ出る。最後は「攻略の書」（まだ見つけていない答えの構造式）。
   *  まちがいが2回つづくと、ヒントのボタンがゆれて知らせる
   *
   *  puzzle = { mat: { C: 2, H: 6, O: 0 }, hFill: true, parts: ['CH3'], hints: ['…', '…'],
   *             answers: [{ name, yomi, set: 'C:r1 C:r2', note }] }
   *  cb = { found(ans, n), dup(ans), bad(msg), change() }
   * ========================================================= */
  var PARTS = {
    CH3: { el: 'C', t: 'CH₃', n: 'メチル基' },
    OH: { el: 'O', t: 'OH', n: 'ヒドロキシ基' }
  };
  var SPANX = 6, SPANY = 4;   /* 骨組みの大きさの上限（横 7 マス・縦 5 マス）。絵はいつも魔法陣のまん中に寄せる */
  Y.Build = function (host, pz, cb) {
    cb = cb || {};
    var found = [], mats = ['C', 'O', 'H'].filter(function (k) { return pz.mat[k] > 0; }), parts = pz.parts || [];
    var heavy, hs, bonds, hist, sel = null, lock = false, seq = 0, hintLv = 0, stuck = 0;
    pz.answers.forEach(function (a) { a._c = canon(parseSet(a.set)); });
    host.innerHTML = '<div class="bld"><div class="mcw bw">' + circleSVG('b' + (++uid)) + '</div>' +
      '<div class="bld-guide" hidden></div><div class="bld-pal"></div><div class="bld-hint" hidden></div><div class="bld-bar"><button class="bld-hintb" type="button">💡 ヒント</button><button class="bld-undo" type="button">↶ ひとつ戻す</button>' +
      (pz.hFill ? '<button class="bld-fill" type="button">🖌 水素の筆（残りの手を H で）</button>' : '') +
      '<button class="bld-clr" type="button">↺ やり直す</button></div></div>';
    var w = host.querySelector('.mcw'), svg = w.querySelector('svg'), gm = w.querySelector('.mc-mol'), pal = host.querySelector('.bld-pal');
    function reset() { heavy = {}; hs = []; bonds = []; hist = []; render(); }
    function left(el) {
      var P = PARTS[el];
      if (P) return Math.max(0, Math.min(left(P.el), Math.floor(left('H') / (VAL[P.el] - 1))));
      var n = pz.mat[el] || 0;
      if (el === 'H') return n - hs.length;
      for (var k in heavy) if (heavy[k].el === el) n--;
      return n;
    }
    function bondDirs(k) {
      var A = heavy[k], ds = [];
      bonds.forEach(function (b) { if (b[0] === k) ds.push(dirOf(A, heavy[b[1]])); if (b[1] === k) ds.push(dirOf(A, heavy[b[0]])); });
      hs.forEach(function (H) { if (H.p === k) ds.push(H.d); });
      return ds;
    }
    function heavyBondDirs(k) {
      var A = heavy[k], ds = [];
      bonds.forEach(function (b) { if (b[0] === k) ds.push(dirOf(A, heavy[b[1]])); if (b[1] === k) ds.push(dirOf(A, heavy[b[0]])); });
      return ds;
    }
    /* 空いている手の一覧 */
    function sockets() {
      var out = [];
      if (!Object.keys(heavy).length) return [{ k: null, d: null, x: 0, y: 0 }];
      Object.keys(heavy).forEach(function (k) {
        var A = heavy[k], used = bondDirs(k);
        handsOf(A, heavyBondDirs(k)).forEach(function (d) { if (used.indexOf(d) < 0) out.push({ k: k, d: d, x: A.x + DIRS[d][0] * 0.55, y: A.y + DIRS[d][1] * 0.55 }); });
      });
      return out;
    }
    function cellFree(x, y, parent) {
      var xs = [x], ys = [y];
      for (var j in heavy) { xs.push(heavy[j].x); ys.push(heavy[j].y); }
      if (Math.max.apply(null, xs) - Math.min.apply(null, xs) > SPANX || Math.max.apply(null, ys) - Math.min.apply(null, ys) > SPANY) return '魔法陣からはみ出す';
      for (var k in heavy) {
        var A = heavy[k];
        if (A.x === x && A.y === y) return 'ふさがっている';
        if (k !== parent && Math.abs(A.x - x) + Math.abs(A.y - y) === 1) return 'ring';
      }
      return '';
    }
    function canPlace(el, s) {
      if (!el || left(el) <= 0) return false;
      if (s.k === null) return el !== 'H';
      if (el === 'H') return true;
      if (PARTS[el] && left('H') < VAL[PARTS[el].el] - 1) return false;
      var A = heavy[s.k];
      return !cellFree(A.x + DIRS[s.d][0], A.y + DIRS[s.d][1], s.k);
    }
    function place(el, s, quiet) {
      if (lock) return false;
      if (left(el) <= 0) { if (cb.bad) cb.bad(el + ' はもう残っていない'); return false; }
      var P = PARTS[el], key = el;
      if (P) el = P.el;
      if (s.k === null) {
        if (el === 'H') { if (cb.bad) cb.bad('H は手が 1 本だけ。骨組みのまん中にはなれない。C から始めよう'); Y.se('wrong'); return false; }
        var id0 = 'a' + (++seq); heavy[id0] = { el: el, x: 0, y: 0 }; hist.push({ t: 'h', id: id0 });
        if (P) partH(id0);
      } else if (el === 'H') {
        hs.push({ p: s.k, d: s.d, cls: quiet ? '' : 'pop' }); hist.push({ t: 'H' });
      } else {
        var A = heavy[s.k], x = A.x + DIRS[s.d][0], y = A.y + DIRS[s.d][1], why = cellFree(x, y, s.k);
        if (why === 'ring') { if (cb.bad) cb.bad('そこに置くと、となりの原子とも手をつないで「輪（環）」になる。\n輪にすると鎖の「はし」がなくなり、はしだった 2 つの原子が手を 1 本ずつ使う → H をつける手が 2 本へって、別の物質になる。いまの錬成は「鎖」だけ'); Y.se('wrong'); return false; }
        if (why) { if (cb.bad) cb.bad('そこには置けない（' + why + '）'); Y.se('wrong'); return false; }
        var id = 'a' + (++seq); heavy[id] = { el: el, x: x, y: y }; bonds.push([s.k, id]); hist.push({ t: 'h', id: id });
        if (P) partH(id);
      }
      if (!quiet) { Y.se('tap'); if (left(key) <= 0 && sel === key) sel = null; render(); check(); }
      return true;
    }
    /* パーツ：つなぐ手を 1 本だけ残して、ほかの手に H を付ける（最初の原子なら右の手を残す） */
    function partH(id) {
      var A = heavy[id], hb = heavyBondDirs(id), keep = hb.length ? null : 'R', n = 0;
      handsOf(A, hb).forEach(function (d) { if (hb.indexOf(d) < 0 && d !== keep) { hs.push({ p: id, d: d, cls: 'pop' }); n++; } });
      hist[hist.length - 1] = { t: 'p', id: id, n: n };
    }
    function undo() {
      var h = hist.pop(); if (!h) return;
      if (h.t === 'H') hs.pop();
      else {
        if (h.t === 'p') hs.splice(hs.length - h.n, h.n);
        delete heavy[h.id]; bonds = bonds.filter(function (b) { return b[1] !== h.id; });
      }
      Y.se('whoosh'); render(); check();
    }
    function render(quiet) {
      gm.innerHTML = structSVG(heavy, bonds, hs);
      /* 骨組みのまん中が、魔法陣のまん中に来るようにずらす */
      /* 小さな分子は大きく、大きな分子は魔法陣に収まるように拡大・縮小する */
      var ks = Object.keys(heavy), ox = 0, oy = 0, z = 1.35;
      if (ks.length) {
        var xs = ks.map(function (k) { return heavy[k].x; }), ys = ks.map(function (k) { return heavy[k].y; });
        var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
        ox = -(x1 + x0) / 2 * U; oy = -(y1 + y0) / 2 * U;
        z = Math.min(1.35, 250 / ((x1 - x0 + 1.6) * U), 230 / ((y1 - y0 + 1.6) * U));
      }
      gm.style.transform = 'scale(' + z.toFixed(3) + ') translate(' + ox + 'px,' + oy + 'px)';
      if (!lock) sockets().forEach(function (s, i) {
        var ok = canPlace(sel, s), cls = 'sock' + (sel ? (ok ? ' can' : ' no') : '');
        var px = s.x * U, py = s.y * U, ax = s.k === null ? px : heavy[s.k].x * U, ay = s.k === null ? py : heavy[s.k].y * U;
        var g = svgEl('g', { 'class': cls, 'data-sock': i }, gm);
        if (s.k !== null) svgEl('line', { x1: ax + (px - ax) * 0.45, y1: ay + (py - ay) * 0.45, x2: px, y2: py }, g);
        svgEl('circle', { 'class': 'dot', cx: px, cy: py, r: s.k === null ? 16 : 7 }, g);
        svgEl('circle', { 'class': 'hit', cx: px, cy: py, r: 19 }, g);
        if (s.k === null) { var t = svgEl('text', { x: px, y: py + 36, 'text-anchor': 'middle', 'class': 'sock-t' }, g); t.textContent = 'ここに最初の原子'; }
      });
      pal.innerHTML = mats.map(function (m) {
        var n = left(m);
        return '<button type="button" class="part at-' + m + (n ? '' : ' zero') + (sel === m ? ' on' : '') + '" data-el="' + m + '"' + (n && !lock ? '' : ' disabled') + '><b>' + m + '</b><small>×' + n + '</small></button>';
      }).join('') + parts.map(function (k) {
        var n = left(k), P = PARTS[k];
        return '<button type="button" class="part pt at-' + P.el + (sel === k ? ' on' : '') + '" data-el="' + k + '"' + (n && !lock ? '' : ' disabled') + '><b>' + P.t + '</b><small>' + P.n + '</small></button>';
      }).join('') + '<p class="pal-hint">' + (sel ? '光っている「手」をタップ（またはドラッグ）' : '素材を「手」までドラッグ。タップで選んでもいい') + '</p>';
      var fb = host.querySelector('.bld-fill');
      if (fb) fb.disabled = lock || !Object.keys(heavy).length || !sockets().length || left('C') > 0 || left('O') > 0;
      if (cb.change && !quiet) cb.change();
      guideTick();
    }
    /* ---- 操作の練習（ガイド）：条件を満たしたら次の指示へ ---- */
    var gi = 0, gEl = null;
    function guideTick() {
      var G = pz.guide; gEl = gEl || host.querySelector('.bld-guide');
      if (!G || !gEl) return;
      if (found.length || lock) { gEl.hidden = true; return; }
      var nH = Object.keys(heavy).length, adv = false;
      while (gi < G.length) {
        var u = String(G[gi].until).split(':'), ok = false;
        if (u[0] === 'heavy') ok = nH >= +u[1];
        else if (u[0] === 'sel') ok = sel === u[1] || (hs.length > 0 && u[1] === 'H');
        else if (u[0] === 'h') ok = hs.length >= +u[1];
        else if (u[0] === 'full') ok = !sockets().length;
        if (!ok) break;
        gi++; adv = true;
      }
      if (gi >= G.length) { gEl.hidden = true; return; }
      gEl.hidden = false;
      gEl.innerHTML = '<b>🧭 練習 ' + (gi + 1) + ' / ' + G.length + '</b><p>' + Y.fmt(G[gi].t) + '</p>';
      if (adv) { gEl.classList.remove('go'); void gEl.offsetWidth; gEl.classList.add('go'); Y.se('coin'); }
    }
    function check() {
      w.classList.remove('lit');
      var free = sockets().length, rest = mats.reduce(function (n, m) { return n + left(m); }, 0);
      if (!Object.keys(heavy).length) return;
      if (free && rest) return;   /* まだ作っている途中 */
      if (free || rest) nudge();
      if (free && !rest) { if (cb.bad) cb.bad('素材を使いきったのに、空いている手が ' + free + ' 本ある。魔法陣が光らない…'); w.classList.add('fz'); setTimeout(function () { w.classList.remove('fz'); }, 600); return; }
      if (!free && rest) { if (cb.bad) cb.bad('手は全部うまったのに、素材が余っている。骨組みを見直そう'); return; }
      /* 手も素材もぴったり → 形をくらべる */
      var els = {}, adj = {};
      Object.keys(heavy).forEach(function (k) { els[k] = heavy[k].el; adj[k] = []; });
      bonds.forEach(function (b) { adj[b[0]].push(b[1]); adj[b[1]].push(b[0]); });
      var c = canonG(els, adj), ans = null;
      for (var k in els) if (els[k] === 'O' && adj[k].some(function (x) { return els[x] === 'O'; })) { if (cb.bad) cb.bad('O どうしをつなぐ形は、この冒険では使わない（不安定）'); return; }
      pz.answers.forEach(function (a) { if (a._c === c) ans = a; });
      if (!ans) { nudge(); if (cb.bad) cb.bad('魔法陣は光った…でも、今回のミッションの形ではない'); return; }
      if (found.indexOf(ans) >= 0) { if (cb.dup) cb.dup(ans); return; }
      found.push(ans); w.classList.add('lit');
      hintLv = 0; stuck = 0; hintEl.hidden = true; hb.classList.remove('nudge');
      if (cb.found) cb.found(ans, found.length);
    }
    /* ---- ドラッグ（指・マウス共通）とタップ ---- */
    var drag = null;
    function nearest(cx, cy) {
      var best = null, bd = 44;
      Y.$$('[data-sock]', gm).forEach(function (g) {
        var r = g.querySelector('.hit').getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, d = Math.hypot(x - cx, y - cy);
        if (d < bd) { bd = d; best = g; }
      });
      return best;
    }
    pal.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('[data-el]'); if (!b || b.disabled || lock) return;
      e.preventDefault();
      drag = { el: b.getAttribute('data-el'), x: e.clientX, y: e.clientY, moved: false, ghost: null, over: null };
    });
    window.addEventListener('pointermove', function (e) {
      if (!drag) return;
      if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 8) return;
      if (!drag.moved) {
        drag.moved = true; sel = drag.el; render();
        drag.ghost = document.createElement('div'); drag.ghost.className = 'drag-ghost at-' + (PARTS[drag.el] ? PARTS[drag.el].el + ' pt' : drag.el); drag.ghost.textContent = PARTS[drag.el] ? PARTS[drag.el].t : drag.el;
        document.body.appendChild(drag.ghost);
      }
      drag.ghost.style.left = e.clientX + 'px'; drag.ghost.style.top = e.clientY + 'px';
      var g = nearest(e.clientX, e.clientY);
      if (drag.over !== g) { if (drag.over) drag.over.classList.remove('over'); drag.over = g; if (g) g.classList.add('over'); }
    }, { passive: true });
    window.addEventListener('pointerup', function (e) {
      if (!drag) return;
      var d = drag; drag = null;
      if (d.ghost) d.ghost.remove();
      if (!d.moved) { sel = sel === d.el ? null : d.el; Y.se('tap'); render(); return; }
      var g = d.over || nearest(e.clientX, e.clientY);
      if (g) place(d.el, sockets()[+g.getAttribute('data-sock')]);
      else { sel = null; render(); }
    });
    window.addEventListener('pointercancel', function () { if (drag && drag.ghost) drag.ghost.remove(); drag = null; });
    gm.addEventListener('click', function (e) {
      var g = e.target.closest && e.target.closest('[data-sock]'); if (!g || lock) return;
      if (!sel) { if (cb.bad) cb.bad('先に、下の素材を選ぼう'); return; }
      place(sel, sockets()[+g.getAttribute('data-sock')]);
    });
    host.querySelector('.bld-undo').onclick = function () { if (!lock) undo(); };
    /* ---- ヒント（押すたびにくわしく → 最後は攻略の書） ---- */
    var hintEl = host.querySelector('.bld-hint'), hb = host.querySelector('.bld-hintb');
    function nudge() { if (++stuck >= 2) hb.classList.add('nudge'); }
    hb.onclick = function () {
      if (lock) return;
      var target = pz.answers.filter(function (a) { return found.indexOf(a) < 0; })[0]; if (!target) return;
      var texts = (pz.hints && pz.hints.length ? pz.hints : ['C の手は 4 本、O は 2 本、H は 1 本。\nどの原子も手が全部うまれば、魔法陣が光る。']).concat(target.hint ? [target.hint] : []);
      var lv = Math.min(hintLv, texts.length), all = texts.length + 1;
      hintEl.hidden = false; hb.classList.remove('nudge');
      if (lv < texts.length) {
        hintEl.innerHTML = '<b>💡 ヒント ' + (lv + 1) + ' / ' + all + '</b><p>' + Y.fmt(texts[lv]) + '</p>' + (lv + 1 < all ? '<small>もう一度押すと、もっとくわしく</small>' : '');
      } else {
        hintEl.innerHTML = '<b>📖 攻略の書（' + all + ' / ' + all + '）</b><p>「' + Y.esc(target.name) + '」の形。これをまねして錬成しよう（H は自分でつなぐ）</p>' + Y.Mol.pic(target.set);
      }
      hintLv = lv + 1;
      Y.se('coin');
      if (cb.hint) cb.hint(lv);
    };
    host.querySelector('.bld-clr').onclick = function () { if (!lock) { Y.se('whoosh'); reset(); } };
    var fb = host.querySelector('.bld-fill');
    if (fb) fb.onclick = function () {
      if (lock) return;
      var ss = sockets();
      if (ss.length > left('H')) { if (cb.bad) cb.bad('H が足りない。骨組みを見直そう'); return; }
      ss.forEach(function (s) { place('H', s, true); });
      Y.se('levelUp'); render(); check();
    };
    reset();
    return {
      clear: function () { sel = null; reset(); },
      found: function () { return found.slice(); },
      lock: function (on) { lock = !!on; host.classList.toggle('lock', lock); render(true); },
      el: w,
      /* テスト用：骨組みを置く（'C:r0 C:r1 …' の記法） */
      _set: function (set, withH) {
        reset(); var p = parseSet(set), ids = Object.keys(p);
        ids.forEach(function (s) { heavy[s] = { el: p[s], x: SLOTS[s][0], y: SLOTS[s][1] }; });
        ids.forEach(function (a) { ids.forEach(function (b) { if (a < b && adjSlots(a, b)) bonds.push([a, b]); }); });
        if (withH) hs = fillH(heavy, bonds);
        render(); check();
      }
    };
  };
})();
