/* =========================================================
 * fxmap.js — 古地図の背景（COURSE.scene.preset === 'map' のとき FX3D の代わりになる）
 *  ・ろうそくの灯りで見る羊皮紙の地図。ポルトラーノ海図の方位線・羅針図・山なみ・川
 *  ・物語の舞台へ地図がゆっくり移動する（ユニット／レッスン／ステップの place）
 *  ・正解で現在地の封蝋が波打ち、不正解で赤くにじみ、ZONE で金色に輝く
 *  地図データは LE.mapData（コースの data/map.js）。
 *  LEMap.svg() はレッスンの「旅」ステップ（route）の小さな地図にも使う。
 * ========================================================= */
(function () {
  'use strict';
  var D = window.LE && LE.mapData;
  var SC = (window.COURSE && COURSE.scene) || {};
  if (!D) return;

  /* ---- 投影（正距円筒図法を緯度47度で補正） ---- */
  var LON0 = -14, LAT0 = 64, KY = 10, KX = 10 * Math.cos(47 * Math.PI / 180);
  function P(ll) { return [(ll[0] - LON0) * KX, (LAT0 - ll[1]) * KY]; }
  function pt(ll) { var p = P(ll); return p[0].toFixed(1) + ',' + p[1].toFixed(1); }
  function poly(a) { return 'M' + a.map(pt).join('L') + 'Z'; }
  function line(a) { return 'M' + a.map(pt).join('L'); }
  function place(id) {
    if (Array.isArray(id)) return id;
    var p = D.places[id]; return p ? p.ll : null;
  }
  var W = (52) * KX, H = (LAT0 - 25) * KY;

  /* ---- 地図の本体（一度だけ組み立てる） ---- */
  function roseLines(ll) {
    var c = P(ll), s = '';
    for (var i = 0; i < 32; i++) {
      var a = i * Math.PI / 16, r = 520;
      var cls = i % 4 === 0 ? 'r0' : i % 2 === 0 ? 'r1' : 'r2';
      s += '<path class="mp-rh ' + cls + '" d="M' + c[0].toFixed(1) + ',' + c[1].toFixed(1) + 'L' + (c[0] + Math.cos(a) * r).toFixed(1) + ',' + (c[1] + Math.sin(a) * r).toFixed(1) + '"/>';
    }
    return s;
  }
  function rose(ll, size) {
    var c = P(ll), s = '<g class="mp-rose" transform="translate(' + c[0].toFixed(1) + ',' + c[1].toFixed(1) + ') scale(' + size + ')">';
    s += '<circle r="9" class="mp-rose-c"/><circle r="6.5" class="mp-rose-c"/>';
    for (var i = 0; i < 16; i++) {
      var a = i * Math.PI / 8 - Math.PI / 2, L = i % 4 === 0 ? 12 : i % 2 === 0 ? 8 : 5.5, w = i % 4 === 0 ? 1.6 : 1.1;
      var x = Math.cos(a), y = Math.sin(a), px = -y, py = x;
      s += '<path class="mp-rose-p' + (i % 2) + '" d="M' + (x * L).toFixed(2) + ',' + (y * L).toFixed(2) + 'L' + (px * w).toFixed(2) + ',' + (py * w).toFixed(2) + 'L' + (-px * w).toFixed(2) + ',' + (-py * w).toFixed(2) + 'Z"/>';
    }
    s += '<path class="mp-fleur" d="M0,-16 C1.5,-14 2.5,-13 1.2,-11.5 L0,-12.5 L-1.2,-11.5 C-2.5,-13 -1.5,-14 0,-16Z"/></g>';
    return s;
  }
  function mountains() {
    var s = '';
    D.mountains.forEach(function (row) {
      row.forEach(function (ll) {
        var c = P(ll);
        s += '<path class="mp-mt" d="M' + (c[0] - 1.7).toFixed(1) + ',' + (c[1] + 1.1).toFixed(1) + 'L' + c[0].toFixed(1) + ',' + (c[1] - 1.5).toFixed(1) + 'L' + (c[0] + 1.7).toFixed(1) + ',' + (c[1] + 1.1).toFixed(1) + '"/><path class="mp-mt-s" d="M' + c[0].toFixed(1) + ',' + (c[1] - 1.8).toFixed(1) + 'L' + (c[0] + 0.8).toFixed(1) + ',' + (c[1] + 1.4).toFixed(1) + '"/>';
      });
    });
    return s;
  }
  function regions(opt) {
    return D.regions.map(function (r) {
      var c = P(r.ll), fs = 3.4 * r.s * (opt.textScale || 1);
      return '<g class="mp-reg' + (r.sea ? ' sea' : '') + '" transform="translate(' + c[0].toFixed(1) + ',' + c[1].toFixed(1) + ')">' +
        '<text class="mp-reg-en" y="' + (-fs * 0.55).toFixed(1) + '" font-size="' + (fs * 0.62).toFixed(2) + '">' + r.en + '</text>' +
        '<text class="mp-reg-ja" y="' + (fs * 0.55).toFixed(1) + '" font-size="' + fs.toFixed(2) + '">' + r.n + '</text></g>';
    }).join('');
  }
  function base(opt) {
    opt = opt || {};
    var s = '';
    s += '<g class="mp-rhumb">' + D.roses.map(roseLines).join('') + '</g>';
    var coast = D.coast.map(poly).join('');
    s += '<path class="mp-wave3" d="' + coast + '"/><path class="mp-wave2" d="' + coast + '"/><path class="mp-wave1" d="' + coast + '"/>';
    s += '<path class="mp-land" d="' + coast + '"/>';
    s += '<g class="mp-rivers">' + D.rivers.map(function (r) { return '<path d="' + line(r) + '"/>'; }).join('') + '</g>';
    s += '<g class="mp-mts">' + mountains() + '</g>';
    if (opt.regions !== false) s += '<g class="mp-regs">' + regions(opt) + '</g>';
    s += D.roses.map(function (ll, i) { return rose(ll, i === 0 ? 0.9 : 0.6); }).join('');
    return s;
  }
  function placeMark(id, opt) {
    var p = D.places[id]; if (!p) return '';
    var c = P(p.ll), fs = (opt && opt.fs) || 2.3;
    return '<g class="mp-pl" data-p="' + id + '" transform="translate(' + c[0].toFixed(1) + ',' + c[1].toFixed(1) + ')"><circle r="' + (fs * 0.32).toFixed(2) + '"/><text x="' + (fs * 0.6).toFixed(2) + '" y="' + (fs * 0.35).toFixed(2) + '" font-size="' + fs.toFixed(2) + '">' + p.n + '</text></g>';
  }

  /* ---- 外から使う道具 ---- */
  window.LEMap = {
    P: P, place: place,
    /* 小さな地図：center=[経度,緯度], span=横幅（度）, ratio=縦/横 */
    svg: function (o) {
      var c = P(o.center), w = o.span * KX, h = w * (o.ratio || 0.75);
      return '<svg class="lemap" viewBox="' + (c[0] - w / 2).toFixed(1) + ' ' + (c[1] - h / 2).toFixed(1) + ' ' + w.toFixed(1) + ' ' + h.toFixed(1) + '" preserveAspectRatio="xMidYMid slice">' +
        '<rect class="mp-sea" x="-500" y="-500" width="2000" height="2000"/>' + base({ textScale: w / 120, regions: o.regions }) + (o.extra || '') + '</svg>';
    },
    name: function (id) { var p = D.places[id]; return p ? p.n : id; }
  };

  if (SC.preset !== 'map') return;

  /* =========================================================
   * 背景としての地図（FX3D の代わり）
   * ========================================================= */
  document.documentElement.classList.add('scene-map');
  var old = document.getElementById('bg3d'); if (old) old.style.display = 'none';
  var wrap = document.createElement('div');
  wrap.id = 'bgmap';
  var cities = Object.keys(D.places).filter(function (k) { return D.places[k].w; });
  wrap.innerHTML = '<div class="bm-paper"></div>' +
    '<svg class="bm-svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 ' + W.toFixed(0) + ' ' + H.toFixed(0) + '">' +
    '<g class="bm-world">' + base({ textScale: 1 }) + '<g class="mp-pls">' + cities.map(function (k) { return placeMark(k); }).join('') + '</g>' +
    '<g class="bm-here" opacity="0"><circle class="bm-ring" r="3"/><circle class="bm-ring2" r="3"/><circle class="bm-seal" r="1.6"/><text class="bm-here-t" y="-4.2" font-size="2.6"></text></g>' +
    '</g></svg>' +
    '<div class="bm-tint"></div><div class="bm-vignette"></div>';
  document.body.insertBefore(wrap, document.body.firstChild);
  var svg = wrap.querySelector('.bm-svg'), here = wrap.querySelector('.bm-here'), hereT = wrap.querySelector('.bm-here-t');
  var cam = { x: 0, y: 0, z: 1.4 }, mode = 'home', focusLL = (D.units.u1 || {}).ll || [10, 48], focusZ = 1.5;

  function apply() {
    var vw = window.innerWidth || 800, vh = window.innerHeight || 600;
    /* 画面の短い辺に約 140/z 単位（緯度で約14度/z）が入るように */
    var short = 140 / cam.z, w, h;
    if (vw < vh) { w = short; h = w * vh / vw; } else { h = short; w = h * vw / vh; }
    var shift = (mode === 'lesson' || mode === 'quiz') && vw >= 820 ? w * 0.22 : 0;  // 本文の右側に舞台が見えるように
    svg.setAttribute('viewBox', (cam.x - w / 2 - shift).toFixed(2) + ' ' + (cam.y - h / 2).toFixed(2) + ' ' + w.toFixed(2) + ' ' + h.toFixed(2));
  }
  function moveTo(ll, z, instant) {
    var c = P(ll);
    if (!window.gsap || instant) { cam.x = c[0]; cam.y = c[1]; cam.z = z; apply(); return; }
    gsap.to(cam, { x: c[0], y: c[1], z: z, duration: 2.4, ease: 'power2.inOut', onUpdate: apply, overwrite: true });
  }
  function setHere(ll, label) {
    var c = P(ll);
    here.setAttribute('transform', 'translate(' + c[0].toFixed(2) + ',' + c[1].toFixed(2) + ')');
    hereT.textContent = label || '';
    if (window.gsap) gsap.to(here, { attr: { opacity: 1 }, duration: 0.8, delay: 1.2 });
    else here.setAttribute('opacity', 1);
  }
  /* ゆっくり呼吸するような漂い（パーティクルの代わりの「生きている」感じ） */
  var t0 = Date.now();
  function drift() {
    requestAnimationFrame(drift);
    if (document.hidden) return;
    var t = (Date.now() - t0) / 1000;
    svg.style.transform = 'translate(' + (Math.sin(t * 0.07) * 6).toFixed(2) + 'px,' + (Math.cos(t * 0.05) * 4).toFixed(2) + 'px) scale(' + (1.03 + Math.sin(t * 0.04) * 0.01).toFixed(4) + ')';
  }

  var api = window.FX3D || {};
  function ringPulse(strength) {
    if (!window.gsap) return;
    var r1 = wrap.querySelector('.bm-ring'), r2 = wrap.querySelector('.bm-ring2');
    gsap.fromTo(r1, { attr: { r: 2 }, opacity: 0.9 }, { attr: { r: 6 + strength * 4 }, opacity: 0, duration: 1.1, ease: 'expo.out' });
    gsap.fromTo(r2, { attr: { r: 2 }, opacity: 0.7 }, { attr: { r: 4 + strength * 3 }, opacity: 0, duration: 1.4, delay: 0.12, ease: 'expo.out' });
    gsap.fromTo(wrap.querySelector('.bm-tint'), { opacity: 0.18 + strength * 0.05, background: 'radial-gradient(circle at 50% 50%, rgba(255,214,120,.5), transparent 60%)' }, { opacity: 0, duration: 0.9 });
  }
  api.pulse = function (s) { ringPulse(s || 1); };
  api.burst = function (s) { ringPulse(s || 1); };
  api.miss = function () {
    if (!window.gsap) return;
    gsap.fromTo(wrap.querySelector('.bm-tint'), { opacity: 0.35, background: 'radial-gradient(circle at 50% 50%, rgba(160,20,20,.45), rgba(60,0,0,.3) 70%)' }, { opacity: 0, duration: 0.9 });
    gsap.fromTo(wrap, { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1.4,0.3)' });
  };
  api.setEnergy = function () {};
  api.fever = function (on) { wrap.classList.toggle('fever', !!on); };
  api.setMode = function (m) {
    mode = m;
    wrap.className = wrap.className.replace(/\bm-\w+/g, '').trim() + ' m-' + m;
    apply();
  };
  api.setTheme = function (th) {
    if (!th) return;
    wrap.style.setProperty('--mp-ink', th.a); wrap.style.setProperty('--mp-red', th.b);
  };
  api.setLite = function (on) { wrap.classList.toggle('lite', !!on); };
  api.shake = function () { api.miss(); };
  /* 物語の舞台へ：place は地名ID か [経度,緯度]。z はズーム */
  api.focus = function (p, z, label) {
    var ll = place(p); if (!ll) return;
    if (ll[0] === focusLL[0] && ll[1] === focusLL[1] && (z || focusZ) === focusZ) return;
    focusLL = ll; focusZ = z || focusZ;
    moveTo(ll, focusZ);
    setHere(ll, label != null ? label : (typeof p === 'string' && D.places[p] ? D.places[p].n : ''));
  };
  api.focusUnit = function (uid) {
    var u = D.units[uid]; if (!u) return;
    api.focus(u.ll, u.z, '');
  };
  window.FX3D = api;
  moveTo(focusLL, focusZ, true);
  window.addEventListener('resize', apply);
  drift();
})();
