/* =========================================================
 * ユーキ・クエスト — 演出（パーティクル・叩きつけ文字・ゆれ・浮かぶ文字）。relativo/js/fx.js を元に、ケボットを外して色を変えたもの
 *  アニメーションは canvas と Web Animations（element.animate）だけ。外部ライブラリなし。
 * ========================================================= */
(function () {
  'use strict';
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cv = document.getElementById('fx'), cx = cv.getContext('2d'), parts = [], raf = 0;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  function size() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  size(); addEventListener('resize', size);

  var PAL = {
    ok: ['#4dff9a', '#38e8ff', '#ffffff', '#ffd23f'],
    rel: ['#b98cff', '#ff8fd0', '#ffffff', '#ffd23f'],
    thunder: ['#fff36b', '#ffffff', '#9fd8ff', '#ffd23f'],
    wind: ['#7dffcf', '#c8fff0', '#ffffff', '#38e8ff'],
    sand: ['#ffb45a', '#ffe0a3', '#ffffff', '#ff7a3d'],
    gold: ['#ffd23f', '#ffb020', '#fff3b0', '#ffffff'],
    rainbow: ['#ff4fa3', '#ffd23f', '#4dff9a', '#38e8ff', '#9b6bff', '#ff8a3d'],
    ng: ['#ff5c5c', '#ff9a9a', '#7a2b55']
  };
  function loop() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.life -= 1; p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= p.drag; p.vy *= p.drag; p.rot += p.vr;
      if (p.life <= 0 || p.y > innerHeight + 40) { parts.splice(i, 1); continue; }
      var a = Math.min(1, p.life / 25);
      cx.save(); cx.globalAlpha = a; cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillStyle = p.c;
      if (p.s === 'star') { star(p.r); }
      else if (p.s === 'rect') { cx.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r); }
      else if (p.s === 'ring') { cx.strokeStyle = p.c; cx.lineWidth = 3 * a; cx.beginPath(); cx.arc(0, 0, p.r * (1 + (60 - p.life) / 8), 0, 7); cx.stroke(); }
      else { cx.beginPath(); cx.arc(0, 0, p.r, 0, 7); cx.fill(); }
      cx.restore();
    }
    raf = parts.length ? requestAnimationFrame(loop) : 0;
  }
  function star(r) {
    cx.beginPath();
    for (var k = 0; k < 10; k++) { var rr = k % 2 ? r * 0.45 : r, an = k * Math.PI / 5 - Math.PI / 2; cx.lineTo(Math.cos(an) * rr, Math.sin(an) * rr); }
    cx.closePath(); cx.fill();
  }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }

  function burst(x, y, o) {
    if (RM) return;
    o = o || {};
    var cols = PAL[o.pal || 'ok'], n = o.n || 26, sp = o.sp || 7;
    for (var i = 0; i < n; i++) {
      var an = Math.random() * Math.PI * 2, v = sp * (0.35 + Math.random());
      parts.push({ x: x, y: y, vx: Math.cos(an) * v, vy: Math.sin(an) * v - 2, g: 0.18, drag: 0.97, r: 2 + Math.random() * 4,
        c: cols[i % cols.length], life: 40 + Math.random() * 30, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
        s: o.shape || (i % 3 === 0 ? 'star' : i % 3 === 1 ? 'rect' : 'dot') });
    }
    if (o.ring) parts.push({ x: x, y: y, vx: 0, vy: 0, g: 0, drag: 1, r: 14, c: cols[0], life: 60, rot: 0, vr: 0, s: 'ring' });
    kick();
  }
  function confetti(n, pal) {
    if (RM) return;
    var cols = PAL[pal || 'rainbow'];
    for (var i = 0; i < (n || 120); i++) {
      parts.push({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * 0.5, vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 3,
        g: 0.05, drag: 0.995, r: 3 + Math.random() * 4, c: cols[i % cols.length], life: 160 + Math.random() * 80,
        rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, s: i % 2 ? 'rect' : 'star' });
    }
    kick();
  }
  function at(el) {
    if (!el || !el.getBoundingClientRect) return { x: innerWidth / 2, y: innerHeight / 2 };
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  /* 叩きつけ文字（画面のまん中にドン） */
  var slamEl = document.getElementById('slam');
  function slam(text, cls, sub) {
    var d = document.createElement('div');
    d.className = 'sl ' + (cls || '');
    d.innerHTML = '<b>' + text + '</b>' + (sub ? '<small>' + sub + '</small>' : '');
    slamEl.appendChild(d);
    if (RM || !d.animate) { setTimeout(function () { d.remove(); }, 1100); return; }
    d.animate([
      { transform: 'scale(3.2) rotate(-12deg)', opacity: 0 },
      { transform: 'scale(.9) rotate(-4deg)', opacity: 1, offset: 0.22 },
      { transform: 'scale(1.05) rotate(-4deg)', opacity: 1, offset: 0.32 },
      { transform: 'scale(1) rotate(-4deg)', opacity: 1, offset: 0.75 },
      { transform: 'scale(1.4) rotate(-4deg)', opacity: 0 }
    ], { duration: 1150, easing: 'cubic-bezier(.2,.9,.3,1)', fill: 'forwards' });
    setTimeout(function () { d.remove(); }, 1250);
  }
  /* 浮かぶ文字（+10 XP など） */
  function floatText(x, y, text, color) {
    var d = document.createElement('div');
    d.className = 'flt'; d.textContent = text; d.style.left = x + 'px'; d.style.top = y + 'px';
    if (color) d.style.color = color;
    document.body.appendChild(d);
    if (!d.animate) { setTimeout(function () { d.remove(); }, 900); return; }
    d.animate([{ transform: 'translate(-50%,0) scale(.6)', opacity: 0 }, { transform: 'translate(-50%,-26px) scale(1.15)', opacity: 1, offset: 0.25 }, { transform: 'translate(-50%,-70px) scale(1)', opacity: 0 }],
      { duration: 950, easing: 'ease-out', fill: 'forwards' });
    setTimeout(function () { d.remove(); }, 1050);
  }
  function shake(el, big) {
    el = el || document.getElementById('app');
    if (RM || !el.animate) return;
    var a = big ? 12 : 6;
    el.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(' + -a + 'px,' + a / 3 + 'px)' }, { transform: 'translate(' + a + 'px,' + -a / 3 + 'px)' },
      { transform: 'translate(' + -a / 2 + 'px,0)' }, { transform: 'translate(' + a / 2 + 'px,0)' }, { transform: 'translate(0,0)' }], { duration: big ? 420 : 300 });
  }
  function pop(el, s) {
    if (RM || !el || !el.animate) return;
    el.animate([{ transform: 'scale(1)' }, { transform: 'scale(' + (s || 1.18) + ')' }, { transform: 'scale(1)' }], { duration: 260, easing: 'ease-out' });
  }
  function flash(color) {
    var d = document.createElement('div');
    d.className = 'flash'; d.style.background = color || '#fff';
    document.body.appendChild(d);
    if (!d.animate) { d.remove(); return; }
    d.animate([{ opacity: 0.55 }, { opacity: 0 }], { duration: 380, fill: 'forwards' });
    setTimeout(function () { d.remove(); }, 450);
  }
  /* コンボ表示（右上でポンッ） */
  var comboEl = document.getElementById('combo') || document.createElement('div');
  function combo(n, fever) {
    if (n < 2) { comboEl.className = ''; comboEl.innerHTML = ''; return; }
    comboEl.className = 'on' + (fever ? ' fever' : '');
    comboEl.innerHTML = '<b>' + n + '</b><small>COMBO' + (fever ? ' ×2' : '') + '</small>';
    pop(comboEl, 1.35);
  }

  window.FX = { burst: burst, confetti: confetti, at: at, slam: slam, floatText: floatText, shake: shake, pop: pop, flash: flash, combo: combo, RM: RM };
})();
