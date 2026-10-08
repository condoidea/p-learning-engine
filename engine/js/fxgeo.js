/* =========================================================
 * fxgeo.js — 方眼ノートと単位円の背景（COURSE.scene.preset === 'geo' のとき FX3D の代わりになる）
 *  ・夜の方眼ノートの上で、単位円の点Pがゆっくり回り続ける
 *  ・Pからの垂線＝sin（ピンク）、x軸への影＝cos（シアン）、そして sin のグラフが流れていく
 *    → 背景を眺めているだけで「sin は y、cos は x」が目に入る
 *  ・正解でPから波紋、コンボで回転が加速、ZONE で虹色、不正解で赤くぶれる
 *  色は COURSE.scene.colors = {sin, cos, tan, grid} で変えられる
 * ========================================================= */
(function () {
  'use strict';
  var SC = (window.COURSE && COURSE.scene) || {};
  if (SC.preset !== 'geo') return;
  var COL = Object.assign({ sin: '#ff5fa2', cos: '#38d9ff', tan: '#ffd84d', grid: 'rgba(120,160,255,.07)', grid2: 'rgba(120,160,255,.14)', ink: 'rgba(230,240,255,.55)' }, SC.colors || {});

  document.documentElement.classList.add('scene-geo');
  var old = document.getElementById('bg3d'); if (old) old.style.display = 'none';
  var cv = document.createElement('canvas');
  cv.id = 'bggeo';
  cv.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:0;display:block;pointer-events:none;transition:opacity 1s';
  document.body.insertBefore(cv, document.body.firstChild);
  var ctx = cv.getContext('2d');
  var W = 0, H = 0, DPR = 1;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth || 800; H = window.innerHeight || 600;
    cv.width = W * DPR; cv.height = H * DPR;
  }
  resize();
  window.addEventListener('resize', resize);

  var st = { th: 0.6, speed: 0.18, energy: 0, fever: false, hue: 0, mode: 'home', shake: 0, red: 0, rings: [], dim: 0.75, lite: false };
  var hist = [];               // sin のグラフの履歴
  var last = performance.now();

  function layout() {
    var narrow = W < 820;
    var R = Math.min(W, H) * (narrow ? 0.26 : 0.24);
    var cx = narrow ? W * 0.32 : W * 0.24, cy = narrow ? H * 0.3 : H * 0.42;
    if (st.mode === 'lesson' || st.mode === 'quiz') { if (!narrow) { cx = W * 0.12; } }
    return { R: R, cx: cx, cy: cy };
  }
  function col(c) {
    if (!st.fever) return c;
    var h = (st.hue + (c === COL.sin ? 0 : c === COL.cos ? 0.33 : 0.66)) % 1;
    return 'hsl(' + Math.round(h * 360) + ',100%,62%)';
  }
  function line(x1, y1, x2, y2, c, w, dash) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = c; ctx.lineWidth = w || 1; ctx.setLineDash(dash || []); ctx.stroke(); ctx.setLineDash([]);
  }
  function draw(now) {
    requestAnimationFrame(draw);
    if (document.hidden) return;
    var dt = Math.min((now - last) / 1000, 0.05); last = now;
    var spd = st.speed * (1 + st.energy * 3 + (st.fever ? 2.5 : 0));
    st.th = (st.th + dt * spd) % (Math.PI * 2);
    st.hue = (st.hue + dt * 0.25) % 1;
    st.shake *= 0.88; st.red *= 0.92;
    hist.unshift(Math.sin(st.th)); if (hist.length > 900) hist.pop();

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    var sx = (Math.random() - 0.5) * st.shake, sy = (Math.random() - 0.5) * st.shake;
    ctx.translate(sx, sy);
    ctx.globalAlpha = st.dim;

    /* 方眼 */
    var g = 28;
    ctx.lineWidth = 1;
    for (var x = 0; x < W; x += g) line(x + 0.5, 0, x + 0.5, H, (Math.round(x / g) % 5) ? COL.grid : COL.grid2, 1);
    for (var y = 0; y < H; y += g) line(0, y + 0.5, W, y + 0.5, (Math.round(y / g) % 5) ? COL.grid : COL.grid2, 1);

    var L = layout(), R = L.R, cx = L.cx, cy = L.cy;
    var c = Math.cos(st.th), s = Math.sin(st.th);
    var px = cx + R * c, py = cy - R * s;

    /* 軸と単位円 */
    line(cx - R * 1.35, cy, W, cy, COL.ink, 1);
    line(cx, cy - R * 1.35, cx, cy + R * 1.35, COL.ink, 1);
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(200,220,255,.35)'; ctx.lineWidth = 1.5; ctx.stroke();
    /* 文字を読む画面（レッスン・問題）では、色のついた三角形・グラフ・点は描かない。
     *  うすくしても、ピンク・シアンの太線と光は文字や枠の上で目立ってしまう（「飾りが文字をじゃまする」の再発防止） */
    if (st.mode === 'lesson' || st.mode === 'quiz') { ctx.globalAlpha = 1; return; }
    /* 角θの弧 */
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.18, 0, -st.th, true); ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 1.5; ctx.stroke();

    /* tan（x=1 の接線との交点まで） */
    if (Math.abs(c) > 0.12) {
      var t = s / c;
      if (Math.abs(t) < 3) {
        line(cx + R, cy - R * 3, cx + R, cy + R * 3, 'rgba(255,216,77,.12)', 1);
        line(cx, cy, cx + R, cy - R * t, col(COL.tan), 1.2, [4, 5]);
        line(cx + R, cy, cx + R, cy - R * t, col(COL.tan), 2.5);
      }
    }
    /* cos（x方向の影）と sin（高さ） */
    ctx.shadowBlur = 12;
    ctx.shadowColor = col(COL.cos); line(cx, cy, px, cy, col(COL.cos), 4);
    ctx.shadowColor = col(COL.sin); line(px, cy, px, py, col(COL.sin), 4);
    ctx.shadowBlur = 0;
    line(cx, cy, px, py, 'rgba(255,255,255,.85)', 2);
    /* sin のグラフ：Pの高さが右へ流れていく */
    var gx0 = cx + R * 1.55, step = 1.6;
    line(px, py, gx0, py, 'rgba(255,95,162,.25)', 1, [3, 5]);
    ctx.beginPath();
    for (var i = 0; i < hist.length; i++) {
      var X = gx0 + i * step; if (X > W + 10) break;
      var Y = cy - R * hist[i];
      if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
    }
    ctx.strokeStyle = col(COL.sin); ctx.globalAlpha = st.dim * 0.55; ctx.lineWidth = 2.2; ctx.stroke(); ctx.globalAlpha = st.dim;
    /* 点P */
    ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.shadowBlur = 18; ctx.shadowColor = '#fff'; ctx.fill(); ctx.shadowBlur = 0;
    /* ラベル */
    if (W > 520) {
      ctx.font = '700 13px "M PLUS Rounded 1c", sans-serif';
      ctx.fillStyle = col(COL.cos); ctx.fillText('cos θ', cx + R * c / 2 - 16, cy + (s >= 0 ? 18 : -8));
      ctx.fillStyle = col(COL.sin); ctx.fillText('sin θ', px + (c >= 0 ? 8 : -46), cy - R * s / 2);
      ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fillText('P(cos θ, sin θ)', px + (c >= 0 ? 10 : -110), py - 10);
    }
    /* 正解の波紋 */
    st.rings = st.rings.filter(function (r) {
      r.t += dt;
      var k = r.t / r.dur; if (k >= 1) return false;
      if (k < 0) return true;   // 少し遅れて出る波紋は、出番まで待つ
      ctx.beginPath(); ctx.arc(px, py, 6 + k * r.size, 0, Math.PI * 2);
      ctx.strokeStyle = r.c; ctx.globalAlpha = st.dim * (1 - k); ctx.lineWidth = 3 * (1 - k) + 0.5; ctx.stroke(); ctx.globalAlpha = st.dim;
      return true;
    });
    /* 不正解の赤 */
    if (st.red > 0.01) { ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.fillStyle = 'rgba(255,40,80,' + (st.red * 0.25).toFixed(3) + ')'; ctx.fillRect(0, 0, W, H); }
    ctx.globalAlpha = 1;
  }

  var api = window.FX3D || {};
  api.pulse = function (k) {
    k = k || 1;
    st.rings.push({ t: 0, dur: 0.9, size: 60 + k * 40, c: col(COL.sin) });
    st.rings.push({ t: -0.12, dur: 1.1, size: 40 + k * 30, c: col(COL.cos) });
    st.energy = Math.min(1, st.energy + 0.05);
  };
  api.burst = api.pulse;
  api.miss = function () { st.shake = 14; st.red = 1; };
  api.shake = function (v) { st.shake = (v || 0.3) * 40; };
  api.setEnergy = function (e) { st.energy = Math.max(0, Math.min(1, e || 0)); };
  api.fever = function (on) { st.fever = !!on; };
  /* 文字を読む画面では背景を十分に暗くする（飾りが文字のじゃまをしないように） */
  api.setMode = function (m) { st.mode = m; st.dim = (m === 'lesson' || m === 'quiz') ? 0.14 : m === 'page' ? 0.3 : 0.75; };
  api.setTheme = function () {};
  api.setLite = function (on) { st.lite = !!on; };
  window.FX3D = api;
  requestAnimationFrame(draw);
})();
