/* fx2d.js — 2D演出：パーティクル爆発・紙吹雪・浮き上がる数字・スラム文字・フラッシュ・トースト */
(function () {
  'use strict';
  var cv = document.getElementById('fxcanvas');
  var cx = cv.getContext('2d');
  var parts = [];
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    cv.width = window.innerWidth * dpr; cv.height = window.innerHeight * dpr;
    cv.style.width = window.innerWidth + 'px'; cv.style.height = window.innerHeight + 'px';
  }
  window.addEventListener('resize', resize); resize();

  var raf = 0;
  function tick() {
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx.clearRect(0, 0, cv.width, cv.height);
    cx.globalCompositeOperation = 'lighter';
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.life -= p.decay;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      p.vx *= p.drag; p.vy = p.vy * p.drag + p.g;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      cx.globalAlpha = Math.max(0, Math.min(1, p.life));
      cx.fillStyle = p.c;
      if (p.kind === 'confetti') {
        cx.globalCompositeOperation = 'source-over';
        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot);
        cx.scale(1, Math.cos(p.rot * 3));
        cx.fillRect(-p.s, -p.s * 0.45, p.s * 2, p.s * 0.9);
        cx.restore();
        cx.globalCompositeOperation = 'lighter';
      } else if (p.kind === 'spark') {
        cx.strokeStyle = p.c; cx.lineWidth = p.s * 0.5;
        cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3); cx.stroke();
      } else {
        cx.beginPath(); cx.arc(p.x, p.y, p.s * p.life, 0, 6.283); cx.fill();
      }
    }
    cx.globalAlpha = 1;
    raf = parts.length ? requestAnimationFrame(tick) : 0;
  }
  function kick() { if (!raf) raf = requestAnimationFrame(tick); }
  function lite() { return window.Core && Core.S.settings.lite; }

  function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || '#38e8ff'; }

  var FX = {
    burst: function (x, y, opts) {
      opts = opts || {};
      var n = Math.round((opts.n || 40) * (lite() ? 0.4 : 1));
      var cols = opts.colors || [css('--accent'), css('--accent2'), '#ffffff'];
      for (var i = 0; i < n; i++) {
        var a = Math.random() * Math.PI * 2, sp = (opts.speed || 8) * (0.3 + Math.random());
        parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 0.12, drag: 0.94,
          s: 2 + Math.random() * 3.5, c: cols[i % cols.length], life: 1, decay: 0.012 + Math.random() * 0.02,
          rot: 0, vr: 0, kind: Math.random() < 0.5 ? 'spark' : 'dot' });
      }
      kick();
    },
    confetti: function (amount) {
      var n = Math.round((amount || 160) * (lite() ? 0.35 : 1));
      /* 紙吹雪の色：テーマの --fx-confetti（カンマ区切り）があればそれを使う */
      var custom = getComputedStyle(document.documentElement).getPropertyValue('--fx-confetti').trim();
      var cols = custom ? custom.split(',').map(function (x) { return x.trim(); }) : [css('--accent'), css('--accent2'), '#ffd84d', '#5cff9d', '#ff3fa4', '#ffffff'];
      var W = window.innerWidth;
      for (var i = 0; i < n; i++) {
        var fromLeft = i % 2 === 0;
        parts.push({ x: fromLeft ? -10 : W + 10, y: window.innerHeight * (0.55 + Math.random() * 0.4),
          vx: (fromLeft ? 1 : -1) * (6 + Math.random() * 10), vy: -(10 + Math.random() * 12), g: 0.32, drag: 0.985,
          s: 4 + Math.random() * 5, c: cols[i % cols.length], life: 2.4, decay: 0.008 + Math.random() * 0.006,
          rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, kind: 'confetti' });
      }
      kick();
    },
    floatText: function (x, y, text, cls) {
      var el = document.createElement('div');
      el.className = 'float-text ' + (cls || '');
      el.textContent = text;
      el.style.left = x + 'px'; el.style.top = y + 'px';
      document.body.appendChild(el);
      gsap.fromTo(el, { y: 0, scale: 0.4, opacity: 0 }, { y: -90, scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(3)' });
      gsap.to(el, { opacity: 0, y: -140, duration: 0.5, delay: 0.75, ease: 'power2.in', onComplete: function () { el.remove(); } });
    },
    /* 画面中央に文字を叩きつける */
    slam: function (text, sub, color) {
      var box = document.getElementById('slam');
      box.innerHTML = '';
      var t = document.createElement('div'); t.className = 'slam-text';
      if (color) t.style.setProperty('--slam', color);
      text.split('').forEach(function (ch) { var s = document.createElement('span'); s.textContent = ch === ' ' ? ' ' : ch; t.appendChild(s); });
      box.appendChild(t);
      if (sub) { var s2 = document.createElement('div'); s2.className = 'slam-sub'; s2.textContent = sub; box.appendChild(s2); }
      var tl = gsap.timeline({ onComplete: function () { box.innerHTML = ''; } });
      tl.set(box, { opacity: 1 })
        .fromTo(t.children, { scale: 3.2, opacity: 0, rotate: function () { return gsap.utils.random(-25, 25); }, y: -30 },
          { scale: 1, opacity: 1, rotate: 0, y: 0, duration: 0.42, ease: 'expo.out', stagger: 0.035 })
        .fromTo(box.querySelector('.slam-sub'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3 }, '-=0.2')
        .to(t, { scale: 1.06, duration: 0.6, ease: 'sine.inOut' })
        .to(box, { opacity: 0, scale: 1.25, duration: 0.3, ease: 'power2.in' })
        .set(box, { scale: 1 });
      FX.shake(10);
    },
    flash: function (color, strength) {
      var f = document.getElementById('flash');
      f.style.background = color || '#fff';
      gsap.fromTo(f, { opacity: strength || 0.35 }, { opacity: 0, duration: 0.5, ease: 'power2.out' });
    },
    shake: function (px) {
      var app = document.getElementById('app');
      gsap.fromTo(app, { x: 0 }, { x: 0, duration: 0.4, ease: 'none', onUpdate: function () {
        var p = 1 - this.progress();
        gsap.set(app, { x: (Math.random() - 0.5) * px * p * 2, y: (Math.random() - 0.5) * px * p });
      }, onComplete: function () { gsap.set(app, { x: 0, y: 0 }); } });
    },
    countUp: function (el, to, dur, onTick) {
      var o = { v: +el.textContent || 0 };
      return gsap.to(o, { v: to, duration: dur || 1, ease: 'power2.out', onUpdate: function () {
        el.textContent = Math.round(o.v);
        if (onTick) onTick(o.v);
      } });
    },
    toast: function (ico, title, sub, kind) {
      var box = document.getElementById('toasts');
      var el = document.createElement('div');
      el.className = 'toast ' + (kind || '');
      el.innerHTML = '<span class="t-ico"></span><div><b></b><small></small></div>';
      el.querySelector('.t-ico').textContent = ico;
      el.querySelector('b').textContent = title;
      el.querySelector('small').textContent = sub || '';
      box.appendChild(el);
      gsap.fromTo(el, { x: 120, opacity: 0, scale: 0.8 }, { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' });
      gsap.to(el, { x: 120, opacity: 0, duration: 0.4, delay: 3.2, ease: 'power2.in', onComplete: function () { el.remove(); } });
    }
  };
  window.FX = FX;
})();
