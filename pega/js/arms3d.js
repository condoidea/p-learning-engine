/* arms3d.js — 武器を three.js で立体に（剣・杖・斧と、ソケットのジェム）
 *
 * 使い方：HTML に <div class="w3" data-w3="品詞|身分|ジェムの色|カット|動き|傾き" data-sock="sock">SVG</div> を置くだけ。
 * 画面に出たら、ここが SVG を立体の絵に置きかえる（MutationObserver）。three.js が読めない・WebGL がない端末では SVG のまま。
 * 動き：still＝止める（戦いの画面。主役は問題の文）／wiggle＝ジェムをはめた瞬間だけ少しひねって光る／
 *       intro＝一回転して止まる（ホーム。なぞると回せる）／spin＝回りつづける（武器の進化）。
 * WebGL の描画は1つだけ（端末の上限に当たらないように）。描いた絵を各 <canvas> に写す。 */
(function () {
  'use strict';
  var SRC = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  var RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var MAX = 640, T, R, ENV, TX, views = [], raf = 0, alive = false;
  var A3 = window.ARMS3D = { ready: false, views: views };

  function load() {
    if (window.THREE) { init(); return; }
    var s = document.createElement('script');
    s.src = SRC; s.async = true; s.onload = init;
    document.head.appendChild(s);
  }

  function init() {
    T = window.THREE;
    if (!T || alive) return;
    try { R = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); } catch (e) { return; }
    if (!R.getContext()) return;
    R.setPixelRatio(1); R.setSize(MAX, MAX, false);
    R.outputEncoding = T.sRGBEncoding;
    R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 1.08;
    R.setClearColor(0x000000, 0);
    R.domElement.addEventListener('webglcontextlost', function (e) { e.preventDefault(); lost(); });
    ENV = envMap(); TX = textures();
    alive = true; A3.ready = true;
    scan();
    new MutationObserver(function () { sweep(); scan(); }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
    window.addEventListener('resize', function () { views.forEach(function (v) { v.size(); v.draw(); }); });
  }
  /* 描画が落ちたら、SVG にもどす */
  function lost() {
    alive = false; A3.ready = false;
    views.slice().forEach(function (v) { v.el.innerHTML = v.fallback; v.el.classList.remove('on3d'); });
    views.length = 0;
  }

  /* ---------- 映りこみ（部屋の明かり） ---------- */
  function envMap() {
    var sc = new T.Scene();
    sc.add(new T.Mesh(new T.BoxGeometry(10, 10, 10), new T.MeshBasicMaterial({ color: 0x18214a, side: T.BackSide })));
    function panel(w, h, c, k, x, y, z) {
      var m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(c).multiplyScalar(k), side: T.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); sc.add(m);
    }
    panel(7, 2, 0xffffff, 7, 0, 4.8, 1);       /* 上の大きな明かり */
    panel(2, 5, 0xffd9a0, 4, -4.8, 0.6, 2);    /* 左：あたたかい */
    panel(2, 5, 0x9fb8ff, 4, 4.8, 0.4, -1.5);  /* 右：つめたい */
    panel(5, 1, 0xffffff, 2.5, 0, -1.2, 4.8);  /* 正面の低い明かり（刃のハイライト） */
    var pm = new T.PMREMGenerator(R), t = pm.fromScene(sc, 0.02).texture;
    pm.dispose();
    return t;
  }

  /* ---------- 模様（canvas で描く） ---------- */
  function cv(w, h, fn, srgb) {
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    fn(c.getContext('2d'), w, h);
    var t = new T.CanvasTexture(c);
    if (srgb !== false) t.encoding = T.sRGBEncoding;
    return t;
  }
  function rnd(a) { var s = a; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function textures() {
    var r = rnd(7);
    return {
      rainbow: cv(16, 256, function (x, w, h) {
        var g = x.createLinearGradient(0, h, 0, 0);
        ['#ff4d5e', '#ffa53d', '#ffe45a', '#5ee07a', '#4cc3ff', '#7d6bff', '#ff6bd0'].forEach(function (c, i, a) { g.addColorStop(i / (a.length - 1), c); });
        x.fillStyle = g; x.fillRect(0, 0, w, h);
        x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(w * 0.35, 0, w * 0.3, h);
      }),
      stone: cv(128, 128, function (x, w, h) {
        x.fillStyle = '#8c8f96'; x.fillRect(0, 0, w, h);
        for (var i = 0; i < 900; i++) { var v = 90 + r() * 110 | 0; x.fillStyle = 'rgba(' + v + ',' + v + ',' + (v + 6) + ',.5)'; x.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 3); }
        x.strokeStyle = 'rgba(40,40,48,.55)'; x.lineWidth = 1.2;
        for (var k = 0; k < 6; k++) { x.beginPath(); var px = r() * w, py = r() * h; x.moveTo(px, py); for (var j = 0; j < 4; j++) { px += (r() - .5) * 40; py += (r() - .5) * 40; x.lineTo(px, py); } x.stroke(); }
      }),
      wood: cv(32, 256, function (x, w, h) {
        x.fillStyle = '#8a5530'; x.fillRect(0, 0, w, h);
        for (var i = 0; i < 26; i++) { x.fillStyle = 'rgba(' + (r() < .5 ? '60,30,12' : '170,110,60') + ',' + (.15 + r() * .3) + ')'; x.fillRect(r() * w, 0, 1 + r() * 2, h); }
      }),
      leather: cv(64, 64, function (x, w, h) {
        x.fillStyle = '#5a3420'; x.fillRect(0, 0, w, h);
        x.strokeStyle = '#2c160b'; x.lineWidth = 5;
        for (var i = -2; i < 4; i++) { x.beginPath(); x.moveTo(0, i * 22); x.lineTo(w, i * 22 + 26); x.stroke(); }
        x.strokeStyle = 'rgba(255,220,180,.18)'; x.lineWidth = 2;
        for (var k = -2; k < 4; k++) { x.beginPath(); x.moveTo(0, k * 22 + 8); x.lineTo(w, k * 22 + 34); x.stroke(); }
      }),
      star: cv(64, 64, function (x, w, h) {
        var g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.25, 'rgba(255,240,150,.8)'); g.addColorStop(1, 'rgba(255,200,60,0)');
        x.fillStyle = g; x.fillRect(0, 0, w, h);
        x.fillStyle = 'rgba(255,255,230,.9)';
        x.beginPath(); x.moveTo(32, 0); x.lineTo(35, 29); x.lineTo(64, 32); x.lineTo(35, 35); x.lineTo(32, 64); x.lineTo(29, 35); x.lineTo(0, 32); x.lineTo(29, 29); x.closePath(); x.fill();
      }),
      halo: cv(64, 64, function (x, w, h) {
        var g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.18, 'rgba(255,255,255,.55)'); g.addColorStop(.5, 'rgba(255,255,255,.12)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = g; x.fillRect(0, 0, w, h);
      }),
      smoke: cv(64, 64, function (x, w, h) {
        var g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, 'rgba(8,2,18,.85)'); g.addColorStop(.55, 'rgba(14,4,30,.45)'); g.addColorStop(1, 'rgba(14,4,30,0)');
        x.fillStyle = g; x.fillRect(0, 0, w, h);
      }),
      veins: cv(128, 64, function (x, w, h) {
        x.fillStyle = '#f2ece4'; x.fillRect(0, 0, w, h);
        x.strokeStyle = 'rgba(190,20,30,.8)'; x.lineWidth = 1.2;
        for (var i = 0; i < 26; i++) { var px = r() * w, py = h * (.55 + r() * .45); x.beginPath(); x.moveTo(px, py); for (var j = 0; j < 5; j++) { px += (r() - .5) * 18; py -= r() * 9; x.lineTo(px, py); } x.stroke(); }
      }),
      glow: cv(64, 64, function (x, w, h) {
        var g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, 'rgba(255,214,90,.75)'); g.addColorStop(.5, 'rgba(255,170,40,.22)'); g.addColorStop(1, 'rgba(255,150,0,0)');
        x.fillStyle = g; x.fillRect(0, 0, w, h);
      })
    };
  }

  /* ---------- 材質 ---------- */
  function col(h) { return new T.Color(h).convertSRGBToLinear(); }
  function std(c, m, r, o) { var x = new T.MeshStandardMaterial({ color: col(c), metalness: m, roughness: r }); for (var k in (o || {})) x[k] = o[k]; return x; }
  /* 金具：兵士＝鉄・騎士＝金・英雄＝光る金 */
  function MET(t) { return t === 0 ? std(0x9aa4b2, 1, 0.4) : t === 1 ? std(0xe6b545, 1, 0.24) : std(0xffcf55, 1, 0.15, { emissive: col(0x5a3400) }); }
  function STEEL(t) { return std(0xe2e8f0, 1, t ? 0.14 : 0.3); }
  function WOOD() { return std(0xffffff, 0, 0.62, { map: TX.wood }); }
  function mesh(geo, mat, x, y, z) { var m = new T.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); return m; }
  function ext(shape, depth, bev, size) {
    var g = new T.ExtrudeGeometry(shape, { depth: depth, bevelEnabled: bev > 0, bevelThickness: bev, bevelSize: size === undefined ? bev : size, bevelSegments: 1, steps: 1, curveSegments: 10 });
    g.translate(0, 0, -depth / 2);
    return g;
  }
  function poly(pts) { var s = new T.Shape(); s.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]); s.closePath(); return s; }

  /* ---------- ジェム（カット＝はめたときの弱点。art.js の SVG と同じ） ---------- */
  function gem(color, cut, s) {
    var g = new T.Group(), c = col(color);
    var mat = new T.MeshPhysicalMaterial({ color: c, metalness: .25, roughness: 0.2, clearcoat: .45, clearcoatRoughness: 0.08, emissive: c.clone().multiplyScalar(0.16), envMapIntensity: .5 });
    var facet = mat.clone(); facet.flatShading = true;
    if (cut === 'adv') {   /* しずく */
      var pts = [[0, -1], [.5, -.92], [.85, -.6], [.95, -.15], [.75, .35], [.35, 1], [0, 1.6]].map(function (p) { return new T.Vector2(p[0] * s, p[1] * s); });
      var d = mesh(new T.LatheGeometry(pts, 8), facet); d.scale.z = .6; d.position.y = -.2 * s; g.add(d);
    } else if (cut === 'shop') {   /* 家 */
      g.add(mesh(ext(poly([[-.72, -.75], [.72, -.75], [.72, .18], [0, .92], [-.72, .18]].map(function (p) { return [p[0] * s, p[1] * s]; })), .5 * s, .3 * s, .22 * s), facet));
    } else if (cut === 'person' || cut === 'desc') {   /* 丸いカボション（人＝横顔を彫る／説明＝絵の具をのせる） */
      var b = mesh(new T.SphereGeometry(s, 24, 14), mat); b.scale.set(1, 1.12, .5); g.add(b);
      if (cut === 'person') {
        var hs = new T.Shape(), k = s;
        hs.moveTo(-.32 * k, -.78 * k); hs.lineTo(.12 * k, -.78 * k); hs.quadraticCurveTo(.1 * k, -.42 * k, .28 * k, -.32 * k);
        hs.lineTo(.4 * k, -.12 * k); hs.lineTo(.34 * k, 0); hs.lineTo(.48 * k, .12 * k); hs.lineTo(.34 * k, .22 * k);
        hs.quadraticCurveTo(.38 * k, .72 * k, 0, .74 * k); hs.quadraticCurveTo(-.46 * k, .72 * k, -.46 * k, .24 * k); hs.quadraticCurveTo(-.4 * k, -.2 * k, -.32 * k, -.78 * k);
        var cam = std(0xfff3df, 0.1, 0.45, { emissive: col(0x3a3020) });
        g.add(mesh(ext(hs, .06 * s, 0), cam, 0, 0, .5 * s));
      } else {
        [[0xff4d5e, -.38, .22], [0xffe45a, .1, .4], [0x4cc3ff, .32, -.12]].forEach(function (p) { g.add(mesh(new T.SphereGeometry(.2 * s, 10, 8), std(p[0], 0, .25), p[1] * s, p[2] * s, .4 * s)); });
      }
    } else {   /* 四角（もの・こと） */
      g.add(mesh(ext(poly([[-.7, -.7], [.7, -.7], [.7, .7], [-.7, .7]].map(function (p) { return [p[0] * s, p[1] * s]; })), .45 * s, .32 * s, .26 * s), facet));
    }
    return g;
  }
  /* ソケット：部品の表と裏に1つずつ（回しても、どちらかにジェムが見える）。d＝部品の厚み */
  function socket(t, d, set, s) {
    var g = new T.Group(), m = MET(t), hole = std(0x070b1c, 0, 0.7);
    g.userData.gems = [];
    [1, -1].forEach(function (k) {
      var face = new T.Group(); face.position.z = k * d / 2; if (k < 0) face.rotation.y = Math.PI;
      face.add(new T.Mesh(new T.TorusGeometry(s * 1.24, s * 0.2, 8, 28), m));
      if (set) { var gm = gem(set.color, set.cut, s); face.add(gm); g.userData.gems.push(gm); }
      else face.add(mesh(new T.CircleGeometry(s * 1.1, 24), hole, 0, 0, .004));
      g.add(face);
    });
    g.userData.d = d;
    return g;
  }
  function inlay(g, pts, s) {   /* 英雄：小さな宝石の象嵌 */
    pts.forEach(function (p, i) { g.add(mesh(new T.SphereGeometry(s, 10, 8), std([0xff4d5e, 0x4cc3ff, 0x5ee07a][i % 3], .1, .15, { emissive: col([0x601018, 0x103a60, 0x106030][i % 3]) }), p[0], p[1], p[2])); });
  }

  /* ---------- 剣（形容詞。そのまま＝🎨 説明 → 絵筆と色） ---------- */
  function sword(t, set) {
    var g = new T.Group(), met = MET(t), big = t === 2 ? 1.25 : 1;
    var blade = poly([[-.095, 0], [-.08, 1.85], [0, 2.22], [.08, 1.85], [.095, 0]]);
    g.add(mesh(ext(blade, .03, .03, .045), STEEL(t), 0, .08, 0));
    /* 虹色の刃紋（表と裏） */
    var rb = new T.MeshStandardMaterial({ map: TX.rainbow, emissive: new T.Color(1, 1, 1), emissiveMap: TX.rainbow, emissiveIntensity: t ? .6 : .32, metalness: .4, roughness: .25 });
    [1, -1].forEach(function (k) { var p = mesh(new T.PlaneGeometry(.07, 1.7), rb, 0, 1.02, k * .047); if (k < 0) p.rotation.y = Math.PI; g.add(p); });
    /* 鍔：両端が反り、まん中がふくらむ（ソケット） */
    var gs = new T.Shape();
    gs.moveTo(-.6, .17); gs.quadraticCurveTo(-.5, -.03, -.17, -.07); gs.quadraticCurveTo(0, -.34, .17, -.07); gs.quadraticCurveTo(.5, -.03, .6, .17);
    gs.lineTo(.52, .19); gs.quadraticCurveTo(.4, .07, .17, .09); gs.quadraticCurveTo(0, .34, -.17, .09); gs.quadraticCurveTo(-.4, .07, -.52, .19); gs.closePath();
    var guard = mesh(ext(gs, .1, .025, .02), met); guard.scale.x = big; g.add(guard);
    /* 鍔に絵の具（赤・青） */
    [[0xff4d5e, -.5], [0x4cc3ff, .5]].forEach(function (p) { [1, -1].forEach(function (k) { g.add(mesh(new T.SphereGeometry(.042, 12, 8), std(p[0], 0, .22, { emissive: col(p[0]).multiplyScalar(.15) }), p[1] * big, .11, k * .07)); }); });
    var sk = socket(t, .15, set, .12); g.add(sk); g.userData.sock = sk;
    /* 柄：革巻き */
    var lt = TX.leather.clone(); lt.needsUpdate = true; lt.wrapS = lt.wrapT = T.RepeatWrapping; lt.repeat.set(2, 3);
    g.add(mesh(new T.CylinderGeometry(.062, .072, .62, 18), std(0xffffff, 0, .75, { map: lt }), 0, -.4, 0));
    [-.12, -.68].forEach(function (y) { var rg = mesh(new T.TorusGeometry(.072, .014, 6, 18), met, 0, y, 0); rg.rotation.x = Math.PI / 2; g.add(rg); });
    /* 柄頭：絵筆（金具＋穂先＋黄色の絵の具） */
    g.add(mesh(new T.CylinderGeometry(.08, .085, .11, 18), met, 0, -.76, 0));
    var tuft = [[.085, -.81], [.095, -.9], [.085, -1.0], [.07, -1.06]].reverse().map(function (p) { return new T.Vector2(p[0], p[1]); });
    g.add(mesh(new T.LatheGeometry(tuft, 18), std(0xf3e6c8, 0, .85)));
    var tip = [[.07, -1.06], [.04, -1.15], [0, -1.21]].reverse().map(function (p) { return new T.Vector2(p[0], p[1]); });
    g.add(mesh(new T.LatheGeometry(tip, 18), std(0xffd23a, 0, .2, { emissive: col(0x402c00) })));
    if (t === 2) inlay(g, [[-.3 * big, .03, .075], [.3 * big, .03, .075], [-.3 * big, .03, -.075], [.3 * big, .03, -.075]], .03);
    return g;
  }

  /* ---------- 杖（動詞。そのまま＝⚡ 動作 → 稲妻） ---------- */
  function staff(t, set) {
    var g = new T.Group(), met = MET(t);
    g.add(mesh(new T.CylinderGeometry(.07, .088, 2.7, 16), WOOD(), 0, -.35, 0));
    g.add(mesh(new T.CylinderGeometry(.095, .08, .14, 16), met, 0, -1.72, 0));
    g.add(mesh(new T.CylinderGeometry(.1, .082, .14, 16), met, 0, 1.02, 0));
    var ring = mesh(new T.TorusGeometry(.095, .018, 6, 18), met, 0, 1.1, 0); ring.rotation.x = Math.PI / 2; g.add(ring);
    /* 柄の稲妻の彫り（表と裏） */
    [[-1.45, -.75], [-.35, .45]].forEach(function (seg) {
      [0, Math.PI].forEach(function (phi) {
        var y0 = seg[0], y1 = seg[1], n = 6, pts = [];
        for (var i = 0; i <= n; i++) {
          var y = y0 + (y1 - y0) * i / n, rr = .07 + (.088 - .07) * (1 - (y + 1.7) / 2.7) + .004, a = phi + (i % 2 ? .45 : -.45) * (i === 0 || i === n ? 0 : 1);
          pts.push(new T.Vector3(rr * Math.sin(a), y, rr * Math.cos(a)));
        }
        var path = new T.CurvePath(); for (var j = 0; j < n; j++) path.add(new T.LineCurve3(pts[j], pts[j + 1]));
        g.add(new T.Mesh(new T.TubeGeometry(path, 36, .011, 5, false), met));
      });
    });
    /* 頭：2本の稲妻の爪がジェムをつかむ */
    var bolt = poly([[-.03, 0], [.05, 0], [0, .24], [.09, .26], [-.01, .5], [.06, .51], [-.1, .8], [-.06, .52], [-.13, .5], [-.05, .27], [-.12, .25]]);
    var bm = MET(t); bm.side = T.DoubleSide;
    var bg = ext(bolt, .05, .015);
    var L = mesh(bg, bm, -.08, 1.06, 0); L.rotation.z = .28; L.scale.set(1.35, 1.35, 1); g.add(L);
    var Rr = mesh(bg, bm, .08, 1.06, 0); Rr.rotation.z = -.28; Rr.scale.set(-1.35, 1.35, 1); g.add(Rr);
    var sk = socket(t, .1, set, .14); sk.position.y = 1.5; g.add(sk); g.userData.sock = sk;
    /* 火花 */
    var sp = new T.Sprite(new T.SpriteMaterial({ map: TX.star, blending: T.AdditiveBlending, depthWrite: false, transparent: true }));
    sp.position.set(0, 2.12, 0); sp.scale.setScalar(t ? .42 : .3); g.add(sp); g.userData.spark = sp;
    if (t === 2) inlay(g, [[0, 1.02, .09], [0, 1.02, -.09], [.09, 1.02, 0]], .028);
    return g;
  }

  /* ---------- 斧（名詞。そのまま＝📦 もの → 石と箱） ---------- */
  function axe(t, set) {
    var g = new T.Group(), met = MET(t);
    g.add(mesh(new T.CylinderGeometry(.072, .084, 2.7, 16), WOOD(), 0, -.25, 0));
    var lt = TX.leather.clone(); lt.needsUpdate = true; lt.wrapS = lt.wrapT = T.RepeatWrapping; lt.repeat.set(2, 2.5);
    g.add(mesh(new T.CylinderGeometry(.092, .092, .5, 18), std(0xffffff, 0, .75, { map: lt }), 0, -1.25, 0));
    g.add(mesh(new T.BoxGeometry(.15, .15, .15), met, 0, -1.65, 0));
    /* 根元の立方体（箱）の金具。ソケットはその表と裏 */
    g.add(mesh(new T.BoxGeometry(.38, .46, .32), met, 0, .78, 0));
    [[.19, 1.01], [-.19, 1.01], [.19, .55], [-.19, .55]].forEach(function (p) { g.add(mesh(new T.BoxGeometry(.035, .035, .33), std(0x2a2f3a, .8, .4), p[0], p[1], 0)); });
    var sk = socket(t, .32, set, .12); sk.position.y = .78; g.add(sk); g.userData.sock = sk;
    /* 刃：先に向かって広がる四角い石の板＋刃先だけ鋼 */
    var st = poly([[.19, .62], [.82, .28], [.9, .5], [.93, .77], [.9, 1.04], [.82, 1.26], [.19, .94]]);
    g.add(mesh(ext(st, .08, .025, .02), std(0x8f939c, 0, .9, { map: TX.stone, bumpMap: TX.stone, bumpScale: .012 })));
    var ed = new T.Shape();
    ed.moveTo(.8, .3); ed.lineTo(.86, .23); ed.quadraticCurveTo(1.16, .77, .86, 1.31); ed.lineTo(.8, 1.24); ed.quadraticCurveTo(1.0, .77, .8, .3);
    g.add(mesh(ext(ed, .03, .02, .012), STEEL(t)));
    /* 背の小さな箱 */
    g.add(mesh(new T.BoxGeometry(.16, .2, .16), met, -.27, .78, 0));
    if (t === 2) inlay(g, [[.15, .97, .165], [-.15, .59, .165], [.15, .97, -.165], [-.15, .59, -.165]], .028);
    return g;
  }

  /* =========================================================
   * 敵（オリジナル）。ふつうの敵6種・ボス4種。戦いのあいだは止めておく（主役は文）
   * 迫力の出し方〔AI の設計〕：体は暗く、目・ひび・口の中だけをその敵の色で光らせる（光のにじみつき）。
   * 角・牙・爪・トゲでとがらせる。後ろから色の光を当てて輪郭を光らせ、少し下から見上げる。後ろに黒いもや。
   * ========================================================= */
  function dk(c, k) { return '#' + new T.Color(c).multiplyScalar(k).getHexString(); }
  function halo(c, s, op) { var sp = new T.Sprite(new T.SpriteMaterial({ map: TX.halo, color: new T.Color(c), blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: op || 1 })); sp.scale.setScalar(s); return sp; }
  function lit(c, k) { return std(0xffffff, 0, .3, { color: col(c), emissive: col(c), emissiveIntensity: k || 2 }); }
  function phys(c, o) { var m = new T.MeshPhysicalMaterial({ color: col(c), roughness: .25, metalness: 0, clearcoat: .8, clearcoatRoughness: .1, envMapIntensity: .7 }); for (var k in (o || {})) m[k] = o[k]; return m; }
  /* 光る目（つり目のスリット）＋にじみ */
  function eye(g, x, y, z, r, c, tilt) {
    var e = mesh(new T.SphereGeometry(r, 16, 10), lit('#fff3c4', 2.6), x, y, z); e.scale.set(1.5, .5, .5); e.rotation.z = tilt === undefined ? (x < 0 ? -.4 : .4) : tilt; g.add(e);
    var h = halo(c, r * 8, 1); h.position.set(x, y, z + .03); g.add(h);
    var h2 = halo('#ffffff', r * 3, .9); h2.position.set(x, y, z + .04); g.add(h2);
  }
  function teeth(g, n, w, y, z, len, down, mat) {
    for (var i = 0; i < n; i++) { var x = (i / (n - 1) - .5) * w, l = len * (i === 0 || i === n - 1 ? 1.5 : 1); var t = mesh(new T.ConeGeometry(len * .32, l, 6), mat, x, y + (down ? -l / 2 : l / 2), z - Math.abs(x) * .4); if (down) t.rotation.x = Math.PI; g.add(t); }
  }
  function spike(g, mat, x, y, z, r, l, rx, rz) { var s = mesh(new T.ConeGeometry(r, l, 7), mat, x, y, z); s.rotation.set(rx || 0, 0, rz || 0); g.add(s); return s; }
  function horn(g, mat, a, b, c2, r) { g.add(new T.Mesh(new T.TubeGeometry(new T.QuadraticBezierCurve3(new T.Vector3().fromArray(a), new T.Vector3().fromArray(b), new T.Vector3().fromArray(c2)), 20, r, 8, false), mat)); var tip = mesh(new T.ConeGeometry(r, r * 3, 8), mat); tip.position.fromArray(c2); tip.lookAt(new T.Vector3().fromArray(c2).multiplyScalar(2).sub(new T.Vector3().fromArray(b))); tip.rotateX(Math.PI / 2); g.add(tip); }
  function lathe(pts, n, mat) { return new T.Mesh(new T.LatheGeometry(pts.map(function (p) { return new T.Vector2(p[0], p[1]); }), n || 32), mat); }
  var BONE = function () { return std(0xd9cfb4, 0, .45); };
  var MAW = function () { return std(0x12040a, 0, .6); };

  /* 毒スライム：暗い体の中で核が光る。つり目と牙の口 */
  function slime(c) {
    var g = new T.Group(), geo = new T.SphereGeometry(1, 44, 30), p = geo.attributes.position;
    for (var i = 0; i < p.count; i++) {
      var x = p.getX(i), y = p.getY(i), z = p.getZ(i), r = Math.sqrt(x * x + z * z), a = Math.atan2(z, x);
      if (y < -.35) y = -.35 + (y + .35) * .25; else if (y > 0) y = y * .8 + Math.max(0, .4 - r) * 1.1;
      if (y < -.1) { var d = 1 + Math.max(0, Math.sin(a * 5)) * .12 * (-.1 - y) * 3; p.setX(i, x * d); p.setZ(i, z * d); }
      p.setY(i, y);
    }
    geo.computeVertexNormals();
    g.add(new T.Mesh(geo, phys(dk(c, .32), { emissive: col(c).multiplyScalar(.08), clearcoat: .35, envMapIntensity: .45 })));
    g.add(mesh(new T.SphereGeometry(.32, 16, 12), lit(c, 1.6), .1, -.05, -.05)); g.add(halo(c, 1.8, .55));
    eye(g, -.32, .14, 1.0, .17, c); eye(g, .32, .14, 1.0, .17, c);
    var m = mesh(new T.SphereGeometry(.32, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), MAW(), 0, -.12, .88); m.scale.set(1.6, .9, .4); g.add(m);
    teeth(g, 7, .8, -.12, 1.02, .15, true, BONE());
    [[-.25, .25], [0, 0], [.25, -.25]].forEach(function (q) { spike(g, std(0x1a1622, .3, .4), q[0], .78 - Math.abs(q[0]) * .5, q[1] * .4, .07, .3, 0, -q[0]); });
    return g;
  }
  /* 吸血コウモリ：骨の通った大きな翼・長い牙 */
  function bat(c) {
    var g = new T.Group(), fur = std(0x221a30, 0, .7), bone = BONE();
    var b = mesh(new T.SphereGeometry(.48, 24, 18), fur); b.scale.set(1, 1.15, .9); g.add(b);
    [-1, 1].forEach(function (k) {
      spike(g, fur, k * .25, .66, 0, .13, .6, 0, -k * .3);
      var ws = new T.Shape();
      ws.moveTo(0, .15); ws.lineTo(.7, .75); ws.lineTo(1.7, .95); ws.lineTo(1.55, .3); ws.quadraticCurveTo(1.35, .35, 1.25, -.05); ws.lineTo(1.05, .45);
      ws.quadraticCurveTo(.9, .1, .75, -.25); ws.lineTo(.62, .3); ws.quadraticCurveTo(.4, -.05, .05, -.25); ws.closePath();
      var wg = new T.Group(); wg.position.set(k * .36, .12, -.08); wg.scale.x = k; wg.rotation.y = -k * .3;
      wg.add(mesh(ext(ws, .015, 0), std(dk(c, .45), 0, .55, { side: T.DoubleSide, emissive: col(c).multiplyScalar(.08) })));
      [[1.7, .95], [1.25, -.05], [.75, -.25]].forEach(function (q) { wg.add(new T.Mesh(new T.TubeGeometry(new T.LineCurve3(new T.Vector3(.7, .75, 0), new T.Vector3(q[0], q[1], 0)), 4, .025, 5, false), bone)); });
      wg.add(new T.Mesh(new T.TubeGeometry(new T.LineCurve3(new T.Vector3(0, .15, 0), new T.Vector3(.7, .75, 0)), 4, .035, 5, false), bone));
      spike(wg, bone, .7, .85, 0, .03, .18);
      g.add(wg);
      eye(g, k * .17, .16, .42, .07, c);
      var f = mesh(new T.ConeGeometry(.04, .24, 6), bone, k * .09, -.22, .4); f.rotation.x = Math.PI; g.add(f);
    });
    var m = mesh(new T.SphereGeometry(.12, 12, 8), MAW(), 0, -.08, .42); m.scale.set(1.3, .6, .4); g.add(m);
    return g;
  }
  /* ゴーレム：前かがみ。体のひびと目が光る。肩に水晶 */
  function golem(c, king) {
    var g = new T.Group(), st = std(0x5d616b, 0, .9, { map: TX.stone, bumpMap: TX.stone, bumpScale: .02, color: col(0x6a6e78) });
    var torso = mesh(new T.BoxGeometry(1.15, .95, .75), st); torso.rotation.set(.12, .05, 0); g.add(torso);
    var head = mesh(new T.BoxGeometry(.56, .44, .5), st, 0, .62, .22); head.rotation.x = .15; g.add(head);
    g.add(mesh(new T.BoxGeometry(.42, .06, .05), lit(c, 2.5), 0, .64, .48)); var h = halo(c, .9, .8); h.position.set(0, .64, .52); g.add(h);
    var brow = mesh(new T.BoxGeometry(.62, .12, .2), st, 0, .78, .42); brow.rotation.x = .3; g.add(brow);
    [[-.2, .2, .1], [.1, -.1, -.5], [.3, .25, .6], [-.35, -.2, -.3]].forEach(function (q) { var l = mesh(new T.BoxGeometry(.26, .025, .02), lit(c, 2), q[0], q[1], .39); l.rotation.z = q[2]; g.add(l); });
    [-1, 1].forEach(function (k) {
      var arm = mesh(new T.BoxGeometry(.36, .85, .4), st, k * .8, -.2, .1); arm.rotation.z = k * .15; g.add(arm);
      var fist = mesh(new T.BoxGeometry(.5, .44, .5), st, k * .9, -.72, .18); fist.rotation.y = k * .2; g.add(fist);
      g.add(mesh(new T.BoxGeometry(.38, .4, .42), st, k * .3, -.68, 0));
      var cr = mesh(new T.OctahedronGeometry(.17), lit(c, 1.2), k * .62, .55, -.05); cr.scale.y = 2; cr.rotation.z = -k * .4; g.add(cr);
      var cr2 = mesh(new T.OctahedronGeometry(.11), lit(c, 1.2), k * .4, .6, -.2); cr2.scale.y = 2; cr2.rotation.z = -k * .2; g.add(cr2);
    });
    if (king) {
      var gold = std(0xd8a93a, 1, .25);
      g.add(mesh(new T.CylinderGeometry(.32, .3, .14, 6, 1, true), std(0xd8a93a, 1, .25, { side: T.DoubleSide }), 0, .92, .2));
      for (var i = 0; i < 6; i++) { var a = i / 6 * Math.PI * 2; spike(g, gold, Math.sin(a) * .31, 1.08, .2 + Math.cos(a) * .31, .05, .24); }
      g.add(mesh(new T.OctahedronGeometry(.2), lit(c, 2.2), 0, .05, .45)); var hc = halo(c, 1.6, .9); hc.position.set(0, .05, .5); g.add(hc);
    }
    return g;
  }
  /* 亡霊：フードの奥の闇に目だけが光る。すそはぼろぼろ。骨の爪 */
  function ghost(c) {
    var g = new T.Group(), cloth = std(0x1b1530, 0, .85, { side: T.DoubleSide });
    var geo = new T.LatheGeometry([[0, -1.0], [.7, -1.0], [.62, -.5], [.5, 0], [.42, .35], [.3, .55]].map(function (p) { return new T.Vector2(p[0], p[1]); }), 48, 0, Math.PI * 2);
    var p = geo.attributes.position;
    for (var i = 0; i < p.count; i++) { var y = p.getY(i); if (y < -.95) { var a = Math.atan2(p.getZ(i), p.getX(i)); p.setY(i, y + (Math.abs(Math.sin(a * 6)) * .28) - (Math.sin(a * 13) * .06)); } }
    geo.computeVertexNormals();
    g.add(new T.Mesh(geo, cloth));
    var hood = mesh(new T.SphereGeometry(.42, 28, 18, Math.PI / 2 + .75, Math.PI * 2 - 1.5, 0, Math.PI * .75), cloth, 0, .62, -.02); hood.scale.set(1, 1.15, 1.1); hood.rotation.x = -.35; g.add(hood);
    var tip = mesh(new T.ConeGeometry(.16, .4, 12), cloth, 0, 1.05, -.22); tip.rotation.x = -.6; g.add(tip);
    var face = mesh(new T.SphereGeometry(.3, 20, 14), std(0x020104, 0, 1), 0, .58, .14); face.scale.set(1, 1.05, .6); g.add(face);
    eye(g, -.12, .62, .34, .055, c, -.2); eye(g, .12, .62, .34, .055, c, .2);
    [-1, 1].forEach(function (k) {
      var sl = mesh(new T.CylinderGeometry(.12, .2, .6, 14, 1, true), cloth, k * .52, .05, .15); sl.rotation.z = k * 1.0; sl.rotation.x = .4; g.add(sl);
      for (var j = 0; j < 3; j++) { var f = mesh(new T.ConeGeometry(.025, .32, 6), BONE(), k * (.82 + j * .02), -.15 - j * .05, .35 + j * .07); f.rotation.set(1.2, 0, k * (.3 + j * .25)); g.add(f); }
    });
    var h = halo(c, 2.6, .35); h.position.set(0, -.5, -.3); g.add(h);
    return g;
  }
  /* 牙キノコ：暗いかさに光る毒の斑点。軸に大きな口 */
  function mush(c) {
    var g = new T.Group();
    g.add(lathe([[0, -.85], [.5, -.85], [.5, -.62], [.4, -.1], [.36, .2], [0, .2]], 28, std(0x5e5048, 0, .75)));
    var cap = mesh(new T.SphereGeometry(.85, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2), phys(dk(c, .35)), 0, .1, 0); cap.scale.set(1.2, .8, 1.2); g.add(cap);
    var under = mesh(new T.CircleGeometry(1.0, 32), std(0x3a2a30, 0, .9, { side: T.DoubleSide }), 0, .1, 0); under.rotation.x = Math.PI / 2; g.add(under);
    [[.2, .5], [1.2, .7], [2.4, .45], [3.5, .75], [4.6, .5], [5.6, .8], [0, .05]].forEach(function (s) {
      var th = s[1] * .95, x = Math.sin(th) * Math.cos(s[0]) * .85 * 1.2, z = Math.sin(th) * Math.sin(s[0]) * .85 * 1.2, y = Math.cos(th) * .85 * .8 + .1;
      var d = mesh(new T.SphereGeometry(.11, 12, 8), lit(c, 1.8), x, y, z); d.scale.set(1, .4, 1); d.lookAt(x * 3, y + .8, z * 3); g.add(d);
    });
    eye(g, -.15, -.1, .45, .06, c); eye(g, .15, -.1, .45, .06, c);
    var m = mesh(new T.SphereGeometry(.24, 20, 12), MAW(), 0, -.42, .36); m.scale.set(1.1, .7, .5); g.add(m);
    teeth(g, 5, .36, -.3, .5, .1, true, BONE()); teeth(g, 4, .3, -.56, .5, .08, false, BONE());
    [[-.9, .3], [.95, .5], [-.6, .8], [.5, .95]].forEach(function (q) { var s = halo(c, .22, .9); s.position.set(q[0], q[1], .3); g.add(s); });
    return g;
  }
  /* 邪眼：血走った目玉・光る虹彩・三日月のトゲ・下に触手 */
  function orb(c) {
    var g = new T.Group();
    g.add(mesh(new T.SphereGeometry(.62, 36, 24), std(0xffffff, 0, .2, { map: TX.veins })));
    var ir = mesh(new T.SphereGeometry(.63, 32, 12, 0, Math.PI * 2, 0, .55), lit(c, .55)); ir.rotation.x = Math.PI / 2; g.add(ir);
    var pu = mesh(new T.SphereGeometry(.12, 12, 10), std(0x050508, 0, .2), 0, 0, .61); pu.scale.set(.35, 1.6, .4); g.add(pu);
    var h = halo(c, 1.3, .7); h.position.z = .7; g.add(h);
    var lid = std(0x2a1e36, .3, .5);
    [-1, 1].forEach(function (k) { var l = mesh(new T.SphereGeometry(.66, 30, 12, 0, Math.PI * 2, 0, Math.PI * .32), lid); l.rotation.x = k > 0 ? .25 : Math.PI - .25; g.add(l); });
    for (var i = 0; i < 9; i++) { var a = i / 9 * Math.PI * 2, s = spike(g, std(0x1c1426, .5, .35), Math.cos(a) * .72, Math.sin(a) * .72, -.15, .1, .55 + (i % 2) * .25); s.rotation.z = a - Math.PI / 2; }
    for (var t = 0; t < 4; t++) {
      var ox = (t - 1.5) * .25;
      for (var j = 0; j < 12; j++) { var u = j / 12; g.add(mesh(new T.SphereGeometry(.07 * (1 - u * .8), 10, 8), std(0x2a1e36, .2, .5), ox + Math.sin(u * 5 + t) * .12, -.6 - u * .7, -.1 + Math.cos(u * 4 + t) * .08)); }
    }
    return g;
  }
  /* 竜：口を開けて奥に炎。後ろに流れる角・大きな翼・首のトゲ */
  function dragon(c) {
    var g = new T.Group(), sk = std(dk(c, .55), .45, .38, { emissive: col(c).multiplyScalar(.04) }), bone = BONE();
    var h = mesh(new T.SphereGeometry(.6, 32, 22), sk, 0, .35, 0); h.scale.set(.95, .78, 1.05); g.add(h);
    var up = mesh(new T.SphereGeometry(.42, 28, 18), sk, 0, .28, .6); up.scale.set(.8, .42, 1.35); up.rotation.x = -.18; g.add(up);
    var lo = mesh(new T.SphereGeometry(.36, 24, 14), std(dk(c, .45), .3, .5), 0, -.08, .5); lo.scale.set(.75, .3, 1.3); lo.rotation.x = .3; g.add(lo);
    g.add(mesh(new T.SphereGeometry(.22, 16, 12), lit('#ff8a2a', 2.2), 0, .1, .55)); var fh = halo('#ff7a1a', 1.4, .9); fh.position.set(0, .1, .9); g.add(fh);
    teeth(g, 6, .42, .17, 1.02, .12, true, bone); teeth(g, 5, .34, -.02, .95, .1, false, bone);
    [-1, 1].forEach(function (k) {
      horn(g, bone, [k * .3, .62, -.1], [k * .62, 1.0, -.55], [k * .5, 1.05, -1.25], .075);
      horn(g, bone, [k * .45, .4, -.2], [k * .8, .45, -.5], [k * .85, .25, -.95], .045);
      eye(g, k * .27, .5, .52, .07, '#ffd23a', k * .45);
      var br = mesh(new T.BoxGeometry(.3, .07, .2), sk, k * .27, .6, .48); br.rotation.z = k * .5; g.add(br);
      var ws = new T.Shape();
      ws.moveTo(0, 0); ws.lineTo(.9, 1.0); ws.lineTo(2.1, 1.35); ws.lineTo(1.9, .75); ws.quadraticCurveTo(1.65, .8, 1.5, .35); ws.lineTo(1.3, .62); ws.quadraticCurveTo(1.15, .3, 1.0, -.05); ws.lineTo(.85, .3); ws.quadraticCurveTo(.6, -.05, .4, -.35); ws.closePath();
      var wg = new T.Group(); wg.position.set(k * .5, -.15, -.95); wg.scale.x = k; wg.rotation.y = -k * .35;
      wg.add(mesh(ext(ws, .02, 0), std(dk(c, .4), .1, .6, { side: T.DoubleSide, emissive: col(c).multiplyScalar(.06) })));
      [[2.1, 1.35], [1.5, .35], [1.0, -.05]].forEach(function (q) { wg.add(new T.Mesh(new T.TubeGeometry(new T.LineCurve3(new T.Vector3(.9, 1.0, 0), new T.Vector3(q[0], q[1], 0)), 4, .03, 5, false), sk)); });
      g.add(wg);
    });
    for (var j = 0; j < 5; j++) spike(g, bone, 0, .75 - j * .12, -.15 - j * .25, .07, .32, -.6);
    var neck = mesh(new T.CylinderGeometry(.3, .42, 1.0, 20), sk, 0, -.3, -.75); neck.rotation.x = 1.05; g.add(neck);
    for (var b = 0; b < 4; b++) { var pl = mesh(new T.BoxGeometry(.32 - b * .03, .1, .1), std(dk(c, .8), .2, .5), 0, -.12 - b * .12, -.4 - b * .2); pl.rotation.x = 1.05; g.add(pl); }
    return g;
  }
  /* 黒騎士：角の兜・光る面頬・燃える飾り・とがった肩当て・大剣 */
  function knight(c) {
    var g = new T.Group(), m = std(0x1b1d26, 1, .32), gold = std(0xb8912f, 1, .3), bone = BONE();
    g.add(mesh(new T.SphereGeometry(.46, 30, 20, 0, Math.PI * 2, 0, Math.PI * .62), m, 0, .62, 0));
    g.add(mesh(new T.CylinderGeometry(.44, .4, .5, 30), m, 0, .37, 0));
    var vis = mesh(new T.BoxGeometry(.46, .05, .1), lit(c, 2.6), 0, .48, .41); g.add(vis); var vh = halo(c, 1.2, .9); vh.position.set(0, .48, .5); g.add(vh);
    var ridge = mesh(new T.BoxGeometry(.05, .55, .1), gold, 0, .42, .43); g.add(ridge);
    [-1, 1].forEach(function (k) {
      horn(g, bone, [k * .38, .7, 0], [k * .85, .85, .05], [k * .8, 1.4, -.1], .07);
      var pd = mesh(new T.SphereGeometry(.34, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), m, k * .66, .02, 0); pd.scale.set(1.15, .85, 1); pd.rotation.z = -k * .4; g.add(pd);
      spike(g, m, k * .78, .3, 0, .07, .4, 0, -k * .7); spike(g, m, k * .62, .32, .15, .06, .32, .3, -k * .4);
    });
    for (var i = 0; i < 5; i++) { var f = mesh(new T.ConeGeometry(.07, .4 - i * .04, 6), lit(c, 1.6), 0, 1.02 - i * .05, -.05 - i * .13); f.rotation.x = -.5 - i * .15; g.add(f); }
    g.add(mesh(new T.CylinderGeometry(.48, .62, .75, 24), m, 0, -.32, 0));
    g.add(mesh(new T.TorusGeometry(.5, .03, 8, 32), gold, 0, .02, 0)).children; g.children[g.children.length - 1].rotation.x = Math.PI / 2;
    var cape = mesh(new T.CylinderGeometry(.7, 1.05, 1.4, 24, 1, true, Math.PI * .6, Math.PI * .8), std(dk(c, .35), 0, .7, { side: T.DoubleSide }), 0, -.35, -.05); g.add(cape);
    /* 前に突き立てた大剣 */
    var bl = mesh(ext(poly([[-.08, -.9], [.08, -.9], [.07, .3], [0, .42], [-.07, .3]]), .03, .02, .02), std(0x2a2d38, 1, .25), .62, -.6, .5); bl.rotation.z = Math.PI; g.add(bl);
    var rn = mesh(new T.BoxGeometry(.03, .9, .01), lit(c, 1.8), .62, -.35, .54); g.add(rn);
    g.add(mesh(new T.BoxGeometry(.5, .07, .1), gold, .62, .32, .5));
    g.add(mesh(new T.CylinderGeometry(.035, .035, .3, 8), std(0x2a160c, 0, .7), .62, .5, .5));
    return g;
  }
  /* 大ダコ：暗い体に光る斑点。触手が下から巻き上がる */
  function kraken(c) {
    var g = new T.Group(), sk = phys(dk(c, .38), { roughness: .35 });
    var h = mesh(new T.SphereGeometry(.65, 32, 24), sk, 0, .5, -.1); h.scale.set(1, 1.3, .95); g.add(h);
    [-1, 1].forEach(function (k) {
      var lid = mesh(new T.SphereGeometry(.19, 16, 12), sk, k * .3, .3, .48); lid.scale.set(1.2, .8, .7); g.add(lid);
      eye(g, k * .3, .32, .66, .09, '#ffd23a', k * .2);
    });
    [[-.3, .95], [.25, 1.1], [.45, .75], [-.05, .7], [-.45, .55]].forEach(function (s) { g.add(mesh(new T.SphereGeometry(.05, 8, 6), lit(c, 2), s[0], s[1], .5 - Math.abs(s[0]) * .3)); var hh = halo(c, .3, .8); hh.position.set(s[0], s[1], .55); g.add(hh); });
    for (var t = 0; t < 8; t++) {
      var a = (t / 7 - .5) * 3.0, up = t % 3 === 0, pts = [];
      for (var j = 0; j <= 22; j++) {
        var u = j / 22, rr = .4 + u * 1.0, cu = up ? Math.sin(u * 2.4) * 1.0 : Math.sin(u * 3.2) * .3;
        pts.push([Math.sin(a) * rr + Math.sin(u * 6 + t) * .08, -.25 - u * .8 + cu + u * u * .4, Math.cos(a) * .35 * (1 - u * .4) + .15]);
      }
      pts.forEach(function (q, j) { g.add(mesh(new T.SphereGeometry(.16 * (1 - j / 25), 12, 8), sk, q[0], q[1], q[2])); });
    }
    return g;
  }
  var FOES = { slime: slime, bat: bat, golem: function (c) { return golem(c, false); }, ghost: ghost, mush: mush, orb: orb,
    dragon: dragon, king: function (c) { return golem(c, true); }, knight: knight, kraken: kraken };
  A3.FOES = Object.keys(FOES);

  /* ---------- 1つの絵 ---------- */
  function View(el) {
    var a = (el.getAttribute('data-w3') || '').split('|');
    this.el = el; this.fallback = el.innerHTML;
    this.pos = a[0]; this.tier = +a[1] || 0;
    this.set = a[2] ? { color: a[2], cut: a[3] } : null;
    this.mode = RM ? 'still' : (a[4] || 'still');
    this.foe = this.pos.indexOf('foe:') === 0 ? this.pos.slice(4) : '';
    this.tilt = this.foe ? 0 : a[5] === 'low' ? 1.13 : .78;   /* 縦からの傾き：low＝寝かせる（戦い）・high＝45° */
    this.base = this.foe === 'dragon' ? -.6 : this.foe ? -.3 : -.5; this.yaw = this.base; this.t0 = performance.now() + (+el.getAttribute('data-delay') || 0);
    this.build();
    var c = this.cv = document.createElement('canvas');
    this.ctx = c.getContext('2d');
    el.innerHTML = ''; el.appendChild(c); el.classList.add('on3d');
    var sid = el.getAttribute('data-sock');
    if (sid) { this.sockEl = document.createElement('i'); this.sockEl.className = 'sock3'; this.sockEl.id = sid; el.appendChild(this.sockEl); }
    if (el.hasAttribute('data-drag')) this.drag();
    this.anim = this.mode !== 'still';
    if (this.mode === 'intro') this.yaw = this.base + Math.PI * 2;
    this.size(); this.draw();
    if (this.anim) kick();
  }
  View.prototype.build = function () {
    var sc = this.scene = new T.Scene();
    sc.environment = ENV;
    if (this.foe) {
      var fc = this.set ? this.set.color : '#6cb4ff';
      var k1 = new T.DirectionalLight(0xfff0e0, 1.25); k1.position.set(-1.5, 4, 3);
      var r1 = new T.DirectionalLight(new T.Color(fc), 3.2); r1.position.set(3, 2.5, -3);
      var r2 = new T.DirectionalLight(0xb06bff, 1.8); r2.position.set(-3.5, .5, -2.5);
      var up = new T.DirectionalLight(new T.Color(fc), .6); up.position.set(0, -3, 2);
      sc.add(k1, r1, r2, up, new T.AmbientLight(0x2a2440, .35));
    } else {
      var key = new T.DirectionalLight(0xffffff, 1.5); key.position.set(-2, 3, 4);
      var rim = new T.DirectionalLight(0x9fb8ff, 1.3); rim.position.set(3, 1.5, -3);
      sc.add(key, rim, new T.AmbientLight(0x3a4470, .5));
    }
    var w = this.w3 = this.foe ? (FOES[this.foe] || slime)(this.set ? this.set.color : '#6cb4ff') : (this.pos === 'verb' ? staff : this.pos === 'noun' ? axe : sword)(this.tier, this.set);
    /* 縦の中心をそろえる（回す軸＝武器の芯） */
    var box = meshBox(w); w.position.y = -(box.min.y + box.max.y) / 2;
    this.spin = new T.Group(); this.spin.add(w);
    this.root = new T.Group(); this.root.add(this.spin);
    this.root.rotation.set(this.foe ? -.16 : .16, 0, -this.tilt);
    if (this.foe) { var sm = new T.Sprite(new T.SpriteMaterial({ map: TX.smoke, depthWrite: false, transparent: true })); sm.scale.set(3.2, 3.2, 1); sm.position.set(0, -.1, -1.6); this.root.add(sm); }
    if (/^(dragon|king|knight|kraken)$/.test(this.foe)) {
      var au = new T.Sprite(new T.SpriteMaterial({ map: TX.glow, color: 0xff5a4a, blending: T.AdditiveBlending, depthWrite: false, transparent: true }));
      au.scale.set(3.4, 3.4, 1); au.position.z = -1.2; this.root.add(au);
    }
    if (this.tier === 2 && !this.foe) {   /* 英雄：後ろに金色の光 */
      var gl = this.glow = new T.Sprite(new T.SpriteMaterial({ map: TX.glow, blending: T.AdditiveBlending, depthWrite: false, transparent: true }));
      gl.scale.set(2.6, 2.6, 1); gl.position.z = -.6; this.root.add(gl);
    }
    sc.add(this.root);
    this.cam = new T.PerspectiveCamera(this.foe ? 34 : 26, 1, .1, 60);
  };
  function meshBox(o) { var b = new T.Box3(); o.updateMatrixWorld(true); o.traverse(function (m) { if (m.isMesh) b.expandByObject(m); }); return b; }
  View.prototype.size = function () {
    var r = this.el.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.round(r.width * dpr), h = Math.round(r.height * dpr), k = Math.min(1, MAX / Math.max(w, h, 1));
    this.w = Math.max(1, Math.round(w * k)); this.h = Math.max(1, Math.round(h * k));
    this.cv.width = this.w; this.cv.height = this.h;
    this.fit();
  };
  /* 画面にちょうど収める（回る絵は、どの向きでも収まるように） */
  View.prototype.fit = function () {
    var self = this, box = new T.Box3(), yaws = this.mode === 'still' || this.mode === 'wiggle' ? [this.base] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (i) { return i / 12 * Math.PI * 2; });
    yaws.forEach(function (y) { self.spin.rotation.y = y; box.union(meshBox(self.root)); });
    this.spin.rotation.y = this.yaw;
    var c = box.getCenter(new T.Vector3()), sz = box.getSize(new T.Vector3());
    var tf = Math.tan(T.MathUtils.degToRad(this.cam.fov / 2)), asp = this.w / this.h;
    var d = Math.max(sz.y / 2 / tf, sz.x / 2 / (tf * asp)) * 1.04 + box.max.z;
    this.cam.aspect = asp; this.cam.position.set(c.x, c.y, d); this.cam.lookAt(c.x, c.y, 0); this.cam.updateProjectionMatrix();
  };
  View.prototype.draw = function () {
    if (!alive || !this.w) return;
    this.spin.rotation.y = this.yaw;
    R.setViewport(0, 0, this.w, this.h); R.setScissor(0, 0, this.w, this.h); R.setScissorTest(true);
    R.clear(); R.render(this.scene, this.cam);
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.ctx.drawImage(R.domElement, 0, MAX - this.h, this.w, this.h, 0, 0, this.w, this.h);
    if (this.sockEl) {   /* ジェムが飛んでいく先（ソケットの表の面） */
      var sk = this.w3.userData.sock, p = sk.localToWorld(new T.Vector3(0, 0, sk.userData.d / 2)).project(this.cam);
      this.sockEl.style.left = ((p.x + 1) / 2 * 100) + '%'; this.sockEl.style.top = ((1 - p.y) / 2 * 100) + '%';
    }
  };
  /* 1こま進める。まだ動くなら true */
  View.prototype.step = function (now) {
    if (!this.anim) return false;
    var e = now - this.t0, more = true, ud = this.w3.userData;
    if (e < 0) return true;
    if (this.mode === 'intro') {
      var p = Math.min(1, e / 1500), q = 1 - Math.pow(1 - p, 3);
      this.yaw = this.base + Math.PI * 2 * (1 - q); more = p < 1;
    } else if (this.mode === 'wiggle') {
      var w = Math.min(1, e / 650);
      this.yaw = this.base + Math.sin(w * Math.PI * 2) * .55 * (1 - w);
      var pop = 1 + .55 * Math.pow(1 - w, 2);
      ud.sock.userData.gems.forEach(function (gm) { gm.scale.setScalar(pop); });
      more = w < 1;
    } else if (this.mode === 'spin') {
      this.yaw = this.base + e * .0007;
    }
    if (ud.spark) ud.spark.material.opacity = this.mode === 'spin' ? .65 + .35 * Math.sin(e * .012) * Math.sin(e * .0047) : 1;
    if (this.glow) this.glow.material.opacity = this.mode === 'spin' ? .75 + .25 * Math.sin(e * .003) : 1;
    this.draw();
    if (!more) this.anim = false;
    return more;
  };
  /* なぞると回る（ホーム） */
  View.prototype.drag = function () {
    var self = this, x0 = null, y0 = 0;
    this.cv.style.touchAction = 'pan-y';
    this.cv.addEventListener('pointerdown', function (e) { x0 = e.clientX; y0 = self.yaw; self.anim = false; });
    this.cv.addEventListener('pointermove', function (e) { if (x0 === null) return; self.yaw = y0 + (e.clientX - x0) * .018; self.draw(); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (n) { self.cv.addEventListener(n, function () { x0 = null; }); });
  };
  View.prototype.dispose = function () {
    this.scene.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) [].concat(o.material).forEach(function (m) { m.dispose(); });
    });
  };

  function tick(now) {
    raf = 0;
    var any = false;
    views.forEach(function (v) { if (v.step(now)) any = true; });
    if (any) raf = requestAnimationFrame(tick);
  }
  function kick() { if (!raf) raf = requestAnimationFrame(tick); }
  /* 画面に出た .w3 を立体にする（大きさが 0 ＝隠れている間は待つ） */
  function scan() {
    if (!alive) return;
    var list = document.querySelectorAll('.w3[data-w3]:not(.on3d)');
    for (var i = 0; i < list.length; i++) {
      var r = list[i].getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      try { views.push(new View(list[i])); } catch (e) { list[i].classList.add('on3d'); }
    }
  }
  /* 画面から消えた絵は片づける */
  function sweep() {
    for (var i = views.length - 1; i >= 0; i--) if (!views[i].el.isConnected) { views[i].dispose(); views.splice(i, 1); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load); else load();
})();
