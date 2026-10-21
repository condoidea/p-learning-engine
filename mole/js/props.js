/* =========================================================
 * mole/props.js — トークの中の「実験」（動かせる図）
 *  M.PROPS[名前](box, cfg, api) → { auto: 自動で達成する関数（通しテスト用） }
 *  api.done()  ミッション達成（トークが先へ進む）
 *  api.note(t) 図の下に一言
 *  api.hit(el) / api.miss(el)  採点つきの操作で正解・まちがい（粒がふえる・コンボ）
 * ========================================================= */
(function () {
  'use strict';
  var P = M.PROPS = {};
  var fmt = M.fmt, esc = M.esc;
  function svg(w, h, inner, cls) { return '<svg class="' + (cls || '') + '" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' + inner + '</svg>'; }
  function tw(el, from, to) { if (M.G && el && !M.E2E) M.G.fromTo(el, from, to); }

  /* 原子の見た目（色は分子模型でよく使う色） */
  var ATOM = {
    H: { c: '#ffffff', s: '#b9c4cc', r: 13, name: '水素' },
    C: { c: '#4a4f57', s: '#2a2e33', r: 18, name: '炭素', ink: '#fff' },
    O: { c: '#ff5a5a', s: '#c93333', r: 17, name: '酸素', ink: '#fff' },
    N: { c: '#4f7cff', s: '#2b54cc', r: 17, name: '窒素', ink: '#fff' }
  };
  function atomSvg(el, x, y, k) {
    var a = ATOM[el]; k = k || 1;
    return '<g class="at" transform="translate(' + x + ' ' + y + ')"><circle r="' + a.r * k + '" fill="' + a.c + '" stroke="' + a.s + '" stroke-width="2.5"/>' +
      '<circle cx="' + (-a.r * k * 0.35) + '" cy="' + (-a.r * k * 0.35) + '" r="' + a.r * k * 0.28 + '" fill="#fff" opacity=".55"/>' +
      '<text y="5" text-anchor="middle" font-size="' + (14 * k) + '" font-weight="800" fill="' + (a.ink || '#333') + '">' + el + '</text></g>';
  }

  /* =========================================================
   * build：原子をタップして分子をつくる
   * ========================================================= */
  var MOLS = {
    H2O: { need: { H: 2, O: 1 }, order: ['H', 'O'], name: '水', f: 'H_2O',
      layout: [['O', 0, 0], ['H', -30, 22], ['H', 30, 22]], bonds: [[0, 1], [0, 2]] },
    CO2: { need: { C: 1, O: 2 }, order: ['C', 'O'], name: '二酸化炭素', f: 'CO_2',
      layout: [['O', -42, 0], ['C', 0, 0], ['O', 42, 0]], bonds: [[0, 1], [1, 2]], dbl: true }
  };
  P.build = function (box, cfg, api) {
    var T = MOLS[cfg.target], have = {}, placed = [], finished = false;
    box.innerHTML = '<div class="pb-area">' + svg(300, 130, '', 'pb-svg') + '</div>' +
      '<div class="pb-f"><span class="pb-fl">できた化学式</span><b class="pb-ft">—</b></div>' +
      '<div class="pb-pal">' + cfg.palette.map(function (e) {
        return '<button class="pb-at" data-at="' + e + '">' + svg(40, 40, atomSvg(e, 20, 20, 0.95)) + '<small>' + ATOM[e].name + '</small></button>';
      }).join('') + '</div>' +
      '<button class="pb-undo ghost-s">ひとつ戻す</button>';
    var sv = M.$('.pb-svg', box), ft = M.$('.pb-ft', box);
    function formula() {
      var s = '';
      T.order.forEach(function (e) { if (have[e]) s += e + (have[e] > 1 ? '_' + have[e] : ''); });
      Object.keys(have).forEach(function (e) { if (T.order.indexOf(e) < 0 && have[e]) s += e + (have[e] > 1 ? '_' + have[e] : ''); });
      return s || '—';
    }
    function draw() {
      var n = placed.length, html = '';
      placed.forEach(function (e, i) { html += atomSvg(e, 150 + (i - (n - 1) / 2) * 44, 65); });
      sv.innerHTML = html;
      var last = sv.lastChild; if (last) tw(last, { scale: 0.2, transformOrigin: 'center' }, { scale: 1, duration: 0.35, ease: 'back.out(3)' });
      ft.innerHTML = fmt(formula());
    }
    function complete() {
      finished = true;
      var html = '';
      T.bonds.forEach(function (b) {
        var p = T.layout[b[0]], q = T.layout[b[1]];
        if (T.dbl) { html += '<line x1="' + (150 + p[1]) + '" y1="' + (59 + p[2]) + '" x2="' + (150 + q[1]) + '" y2="' + (59 + q[2]) + '" stroke="#8a96a3" stroke-width="4"/><line x1="' + (150 + p[1]) + '" y1="' + (71 + p[2]) + '" x2="' + (150 + q[1]) + '" y2="' + (71 + q[2]) + '" stroke="#8a96a3" stroke-width="4"/>'; }
        else html += '<line x1="' + (150 + p[1]) + '" y1="' + (65 + p[2]) + '" x2="' + (150 + q[1]) + '" y2="' + (65 + q[2]) + '" stroke="#8a96a3" stroke-width="6"/>';
      });
      T.layout.forEach(function (a) { html += atomSvg(a[0], 150 + a[1], 65 + a[2], 1.1); });
      sv.innerHTML = '<g class="pb-mol">' + html + '</g>';
      tw(M.$('.pb-mol', sv), { scale: 0.5, transformOrigin: '150px 65px', rotate: -20 }, { scale: 1, rotate: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
      ft.innerHTML = fmt(T.f) + ' <small>' + esc(T.name) + 'の分子 できた！</small>';
      M.$$('.pb-at,.pb-undo', box).forEach(function (b) { b.disabled = true; });
      M.FX.burst.apply(null, M.FX.at(sv).concat([30]));
      M.snd.bloop();
      setTimeout(api.done, M.E2E ? 0 : 700);
    }
    box.addEventListener('click', function (e) {
      if (finished) return;
      var b = e.target.closest('[data-at]');
      if (e.target.closest('.pb-undo')) { var x = placed.pop(); if (x) have[x]--; draw(); return; }
      if (!b) return;
      var el = b.getAttribute('data-at');
      if (!T.need[el]) { api.note(ATOM[el].name + '原子は、' + T.name + 'の分子には入っていないよ。'); M.FX.shake(b); if (window.Sfx) Sfx.wrong(); return; }
      if ((have[el] || 0) >= T.need[el]) { api.note(ATOM[el].name + '原子は ' + T.need[el] + ' 個までだよ。'); M.FX.shake(b); if (window.Sfx) Sfx.wrong(); return; }
      have[el] = (have[el] || 0) + 1; placed.push(el); M.snd.pop(); api.note('');
      draw();
      if (Object.keys(T.need).every(function (k) { return have[k] === T.need[k]; })) setTimeout(complete, M.E2E ? 0 : 250);
    });
    return { auto: function () { Object.keys(T.need).forEach(function (k) { for (var i = 0; i < T.need[k]; i++) M.$('[data-at="' + k + '"]', box).click(); }); } };
  };

  /* =========================================================
   * zoom：食塩のひとつぶを、原子が見えるまで拡大
   * ========================================================= */
  P.zoom = function (box, cfg, api) {
    var cube = '<g transform="translate(150 100)"><path d="M-46 -10 L0 -34 L46 -10 L0 14z" fill="#ffffff" stroke="#c9d6dd" stroke-width="2"/><path d="M-46 -10 L0 14 L0 62 L-46 38z" fill="#e7eef2" stroke="#c9d6dd" stroke-width="2"/><path d="M46 -10 L0 14 L0 62 L46 38z" fill="#d3dee5" stroke="#c9d6dd" stroke-width="2"/></g>';
    var steps = '';
    for (var i = 0; i < 7; i++) for (var j = 0; j < 5; j++) steps += '<rect x="' + (40 + i * 32 + (j % 2) * 4) + '" y="' + (30 + j * 30) + '" width="28" height="26" rx="3" fill="#f5f9fb" stroke="#d3dee5"/>';
    var fog = '';
    for (var a = 0; a < 9; a++) for (var b = 0; b < 6; b++) fog += '<circle cx="' + (30 + a * 30) + '" cy="' + (28 + b * 30) + '" r="12" fill="#cfd8ff" opacity=".55"/>';
    var atoms = '';
    for (var x = 0; x < 7; x++) for (var y = 0; y < 5; y++) {
      var na = (x + y) % 2 === 0;
      atoms += '<circle cx="' + (42 + x * 36) + '" cy="' + (30 + y * 36) + '" r="' + (na ? 10 : 17) + '" fill="' + (na ? '#b48cff' : '#5fd39a') + '" stroke="' + (na ? '#7d55d6' : '#2f9e6a') + '" stroke-width="2"/>';
    }
    atoms += '<g font-size="12" font-weight="800"><rect x="6" y="176" width="140" height="20" rx="10" fill="#fff" opacity=".9"/><circle cx="18" cy="186" r="6" fill="#b48cff"/><text x="28" y="190" fill="#333">Na^+</text><circle cx="78" cy="186" r="7" fill="#5fd39a"/><text x="89" y="190" fill="#333">Cl^-</text></g>';
    atoms = atoms.replace('Na^+', 'Na⁺').replace('Cl^-', 'Cl⁻');
    var L = [
      { svg: cube, cap: '食塩のひとつぶ（約 0.5 mm）' },
      { svg: steps, cap: 'かどを拡大…まだ、なめらかな面' },
      { svg: fog, cap: 'もっと拡大…なにか並んでいる？' },
      { svg: atoms, cap: 'イオンの粒が見えた！ 粒の間隔は約 1億分の1 cm' }
    ];
    box.innerHTML = '<div class="pz-stage">' + L.map(function (l, i) { return '<div class="pz-l" data-i="' + i + '">' + svg(300, 200, l.svg) + '</div>'; }).join('') +
      '<div class="pz-mag"></div></div><p class="pz-cap"></p>' +
      '<label class="pz-range"><span>🔍</span><input type="range" min="0" max="100" value="0" step="1"><span>⚛</span></label>';
    var inp = M.$('input', box), layers = M.$$('.pz-l', box), cap = M.$('.pz-cap', box), mag = M.$('.pz-mag', box), finished = false, lastStep = -1;
    function magTxt(v) {
      var e = Math.round(v * 8 / 100), u = [[8, '億'], [4, '万']], s = '';
      for (var k = 0; k < u.length; k++) if (e >= u[k][0]) { s = Math.pow(10, e - u[k][0]) + u[k][1]; break; }
      return '×' + (s || Math.pow(10, e)) + ' 倍';
    }
    function upd() {
      var v = +inp.value, best = 0, bo = 0;
      layers.forEach(function (el, i) {
        var c = i * 33.3, d = v - c, o = Math.max(0, 1 - Math.abs(d) / 22);
        el.style.opacity = o; el.style.transform = 'scale(' + Math.pow(2, d / 14).toFixed(3) + ')';
        if (o > bo) { bo = o; best = i; }
      });
      cap.textContent = L[best].cap; mag.textContent = magTxt(v);
      var st = Math.floor(v / 12.5);
      if (st !== lastStep) { lastStep = st; M.snd.tick(); }
      if (v >= 97 && !finished) { finished = true; inp.disabled = true; M.snd.bloop(); M.FX.burst.apply(null, M.FX.at(box).concat([24])); setTimeout(api.done, M.E2E ? 0 : 600); }
    }
    inp.addEventListener('input', upd); upd();
    return { auto: function () { inp.value = 100; upd(); } };
  };

  /* =========================================================
   * power：10 の何乗（肩の数を変えると、0 の数と名前が変わる）
   * ========================================================= */
  function jpName(n) {
    var u = [[20, '垓'], [16, '京'], [12, '兆'], [8, '億'], [4, '万']];
    for (var k = 0; k < u.length; k++) if (n >= u[k][0]) return Math.pow(10, n - u[k][0]) + u[k][1];
    return String(Math.pow(10, n));
  }
  function groupZeros(n) {
    var s = '1' + new Array(n + 1).join('0'), out = '';
    for (var i = s.length; i > 0; i -= 4) out = s.slice(Math.max(0, i - 4), i) + (out ? ' ' + out : '');
    return out;
  }
  P.power = function (box, cfg, api) {
    var n = 1, finished = false;
    box.innerHTML = '<div class="pp-big"><button class="pp-b" data-d="-1" aria-label="肩の数を減らす">−</button><b class="pp-e"></b><button class="pp-b" data-d="1" aria-label="肩の数を増やす">＋</button></div>' +
      '<div class="pp-num"></div><div class="pp-name"></div>';
    var be = M.$('.pp-e', box), bn = M.$('.pp-num', box), nm = M.$('.pp-name', box);
    function upd(bump) {
      be.innerHTML = '10<sup>' + n + '</sup>';
      bn.innerHTML = groupZeros(n).replace(/0/g, '<i>0</i>');
      nm.textContent = '＝ ' + jpName(n) + '（0 が ' + n + ' 個）';
      if (bump) tw(be, { scale: 1.3 }, { scale: 1, duration: 0.3, ease: 'back.out(3)' });
      if (n === cfg.goal && !finished) {
        finished = true; M.$$('.pp-b', box).forEach(function (b) { b.disabled = true; });
        nm.textContent = '＝ ' + jpName(n) + '！ できた！'; M.snd.bloop();
        M.FX.burst.apply(null, M.FX.at(be).concat([28]));
        setTimeout(api.done, M.E2E ? 0 : 700);
      }
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-d]'); if (!b || finished) return;
      n = Math.max(0, Math.min(24, n + +b.getAttribute('data-d'))); M.snd.pop(); upd(true);
    });
    upd();
    return { auto: function () { while (!finished) M.$('[data-d="1"]', box).click(); } };
  };

  /* =========================================================
   * atom：原子のつくり（^{12}C）— 見るだけの図
   * ========================================================= */
  P.atom = function (box, cfg, api) {
    var nuc = '', pts = [[-7, -7], [7, -7], [0, 3], [-10, 6], [10, 6], [-3, -14], [4, 13], [-12, -2], [12, -2], [-5, 12], [6, -15], [0, -4]];
    pts.forEach(function (p, i) {
      var pr = i % 2 === 0;
      nuc += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="7" fill="' + (pr ? '#ff7fae' : '#c5ccd3') + '" stroke="' + (pr ? '#d94c82' : '#8f9aa5') + '" stroke-width="1.5"/>' + (pr ? '<text x="' + p[0] + '" y="' + (p[1] + 3.5) + '" text-anchor="middle" font-size="9" font-weight="800" fill="#fff">+</text>' : '');
    });
    var orb = '<ellipse rx="62" ry="62" fill="none" stroke="#bcd" stroke-dasharray="4 5"/><ellipse rx="100" ry="100" fill="none" stroke="#bcd" stroke-dasharray="4 5"/>';
    var el = '<g class="pa-spin">';
    [[62, 0], [62, 180], [100, 30], [100, 120], [100, 210], [100, 300]].forEach(function (o) {
      var a = o[1] * Math.PI / 180;
      el += '<circle cx="' + (Math.cos(a) * o[0]).toFixed(1) + '" cy="' + (Math.sin(a) * o[0]).toFixed(1) + '" r="5.5" fill="#3a8dff"/><text x="' + (Math.cos(a) * o[0]).toFixed(1) + '" y="' + (Math.sin(a) * o[0] + 3).toFixed(1) + '" text-anchor="middle" font-size="8" font-weight="800" fill="#fff">−</text>';
    });
    el += '</g>';
    box.innerHTML = svg(300, 230, '<g transform="translate(150 112)">' + orb + el + nuc + '</g>' +
      '<g font-size="12" font-weight="700" fill="#33414d">' +
      '<text x="8" y="20">^{12}C の原子</text>' +
      '<circle cx="12" cy="212" r="6" fill="#ff7fae"/><text x="22" y="216">陽子（＋）6個</text>' +
      '<circle cx="118" cy="212" r="6" fill="#c5ccd3"/><text x="128" y="216">中性子 6個</text>' +
      '<circle cx="214" cy="212" r="5" fill="#3a8dff"/><text x="223" y="216">電子（−）6個</text></g>', 'pa-svg').replace('^{12}C', '¹²C') +
      '<p class="pz-cap">まん中の粒のかたまり＝原子核（陽子と中性子）。まわりを電子がまわっている</p>';
    setTimeout(api.done, M.E2E ? 0 : 400);
    return { auto: function () {} };
  };

  /* =========================================================
   * balance：天びんで ^{12}C と重さくらべ
   * ========================================================= */
  P.balance = function (box, cfg, api) {
    var st = cfg.stage === 'O' ? { left: 4, lm: 12, el: 'O', m: 16, goal: 3, name: '酸素原子' } : { left: 1, lm: 12, el: 'H', m: 1, goal: 12, name: '水素原子' };
    var n = 0, finished = false;
    box.innerHTML = svg(300, 190, '', 'pbl-svg') + '<p class="pbl-cnt"></p>' +
      '<div class="pbl-btns"><button class="pbl-b ghost-s" data-d="-1">− とる</button><button class="pbl-b main-s" data-d="1">＋ ' + st.el + ' をのせる</button></div>';
    var sv = M.$('.pbl-svg', box), cnt = M.$('.pbl-cnt', box);
    function pile(el, k, cx, cy, sc) {
      var h = '', per = 4, r = ATOM[el].r * sc;
      for (var i = 0; i < k; i++) { var row = Math.floor(i / per), col = i % per, inRow = Math.min(per, k - row * per); h += atomSvg(el, cx + (col - (inRow - 1) / 2) * r * 2.05, cy - r - row * r * 1.7, sc); }
      return h;
    }
    function draw() {
      var L = st.left * st.lm, R = n * st.m, d = R - L;
      var ang = Math.max(-16, Math.min(16, d / Math.max(L, 1) * 30));
      if (d === 0) ang = 0;
      var rad = ang * Math.PI / 180, lx = 150 - Math.cos(rad) * 105, ly = 70 - Math.sin(rad) * 105, rx = 150 + Math.cos(rad) * 105, ry = 70 + Math.sin(rad) * 105;
      var cpan = function (x, y) { return '<line x1="' + x + '" y1="' + y + '" x2="' + (x - 34) + '" y2="' + (y + 60) + '" stroke="#9aa7b2" stroke-width="1.5"/><line x1="' + x + '" y1="' + y + '" x2="' + (x + 34) + '" y2="' + (y + 60) + '" stroke="#9aa7b2" stroke-width="1.5"/><path d="M' + (x - 40) + ' ' + (y + 60) + ' q40 18 80 0z" fill="#ffd36b" stroke="#d9a53a" stroke-width="2"/>'; };
      sv.innerHTML = '<path d="M150 70 L135 180 h30z" fill="#c9d3da"/><rect x="110" y="176" width="80" height="8" rx="4" fill="#9aa7b2"/>' +
        '<line x1="' + lx + '" y1="' + ly + '" x2="' + rx + '" y2="' + ry + '" stroke="#6b7a86" stroke-width="6" stroke-linecap="round"/><circle cx="150" cy="70" r="7" fill="#6b7a86"/>' +
        '<path d="M150 50 l-6 12 h12z" fill="' + (d === 0 ? '#2bb673' : '#ff5a5a') + '"/>' +
        cpan(lx, ly) + cpan(rx, ry) +
        '<g>' + pile('C', st.left, lx, ly + 62, 0.62).replace(/>C</g, '>¹²C<') + '</g><g>' + pile(st.el, n, rx, ry + 62, st.el === 'H' ? 0.55 : 0.6) + '</g>';
      cnt.innerHTML = '左の皿 ¹²C ' + st.left + '個　／　右の皿 ' + st.el + ' <b>' + n + '</b>個' + (d === 0 && n ? '　<span class="ok">つり合った！</span>' : d > 0 ? '　<span class="ng">右が重い</span>' : '');
      if (d === 0 && n && !finished) {
        finished = true; M.$$('.pbl-b', box).forEach(function (b) { b.disabled = true; });
        M.snd.bloop(); M.FX.burst.apply(null, M.FX.at(sv).concat([30]));
        setTimeout(api.done, M.E2E ? 0 : 800);
      }
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-d]'); if (!b || finished) return;
      n = Math.max(0, Math.min(st.goal * 2, n + +b.getAttribute('data-d'))); M.snd.pop(); draw();
    });
    draw();
    return { auto: function () { while (!finished) M.$('[data-d="1"]', box).click(); } };
  };

  /* =========================================================
   * scale：1 mol ずつ、はかりにのせる
   * ========================================================= */
  P.scale = function (box, cfg, api) {
    var S = [
      { f: 'C', name: '炭素', m: 12, c: '#4a4f57', k: '原子量' },
      { f: 'H_2O', name: '水', m: 18, c: '#7cc8ff', k: '分子量' },
      { f: 'Al', name: 'アルミニウム', m: 27, c: '#c5ccd3', k: '原子量' },
      { f: 'CO_2', name: '二酸化炭素', m: 44, c: '#e3e8ec', k: '分子量', gas: true },
      { f: 'NaCl', name: '食塩', m: 58.5, c: '#ffffff', k: '式量' }
    ];
    var tried = {}, timer = 0, finished = false;
    box.innerHTML = '<div class="ps-scale">' + svg(300, 140, '', 'ps-svg') + '<div class="ps-disp"><b>0.0</b> g</div></div><p class="pz-cap ps-cap">物質を選んでね（どれも 1 mol ＝ 6.0×10²³ 個）</p>' +
      '<div class="ps-btns">' + S.map(function (s, i) { return '<button class="ps-b" data-i="' + i + '"><span>' + fmt(s.f) + '</span><small>' + esc(s.name) + '</small></button>'; }).join('') + '</div>';
    var sv = M.$('.ps-svg', box), disp = M.$('.ps-disp b', box), cap = M.$('.ps-cap', box);
    function draw(s) {
      var h = s ? Math.min(70, 18 + s.m * 0.9) : 0;
      sv.innerHTML = (s ? (s.gas ? '<rect x="110" y="' + (104 - h) + '" width="80" height="' + h + '" rx="10" fill="#e8f6ff" stroke="#9ccbe8" stroke-width="2" stroke-dasharray="5 4"/><text x="150" y="' + (100 - h / 2) + '" text-anchor="middle" font-size="12" fill="#5a7a90">（ふくろの中の気体）</text>'
        : '<path d="M' + (150 - h * 0.9) + ' 104 Q150 ' + (104 - h * 1.5) + ' ' + (150 + h * 0.9) + ' 104z" fill="' + s.c + '" stroke="#9aa7b2" stroke-width="2"/>') : '') +
        '<rect x="70" y="104" width="160" height="10" rx="5" fill="#9aa7b2"/><rect x="95" y="114" width="110" height="22" rx="6" fill="#6b7a86"/>';
    }
    function pick(i) {
      var s = S[i]; tried[i] = true; draw(s); M.snd.pop();
      if (M.G && !M.E2E) { var o = { v: 0 }; M.G.to(o, { v: s.m, duration: 0.8, ease: 'power2.out', onUpdate: function () { disp.textContent = o.v.toFixed(1); } }); }
      else disp.textContent = s.m.toFixed(1);
      tw(M.$('svg > :first-child', box), { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'bounce.out' });
      cap.innerHTML = fmt(s.name + ' ' + s.f + ' の' + s.k + 'は ' + s.m + '。1 mol は **' + s.m + ' g**');
      M.$('[data-i="' + i + '"]', box).classList.add('done');
      if (Object.keys(tried).length >= 3 && !finished) { finished = true; clearTimeout(timer); timer = setTimeout(function () { M.snd.bloop(); api.done(); }, M.E2E ? 0 : 1100); }
    }
    box.addEventListener('click', function (e) { var b = e.target.closest('[data-i]'); if (b) pick(+b.getAttribute('data-i')); });
    draw(null);
    return { auto: function () { [0, 1, 2].forEach(pick); } };
  };

  /* =========================================================
   * gasbox：気体 1 mol を同じ箱に（標準状態）
   * ========================================================= */
  P.gasbox = function (box, cfg, api) {
    var G = [
      { f: 'H_2', name: '水素', m: '2.0', r: 4, c: '#b9c4cc' },
      { f: 'O_2', name: '酸素', m: '32', r: 6, c: '#ff5a5a' },
      { f: 'CO_2', name: '二酸化炭素', m: '44', r: 7.5, c: '#4a4f57' }
    ];
    var tried = {}, cur = null, dots = [], raf = 0, finished = false;
    box.innerHTML = '<div class="pg-wrap">' + svg(300, 180, '<rect x="60" y="14" width="180" height="150" rx="6" fill="#f2fbff" stroke="#3a8dff" stroke-width="3"/><g class="pg-dots"></g><text x="150" y="178" text-anchor="middle" font-size="12" font-weight="800" fill="#3a8dff">22.4 L（1辺 約28 cm）</text>', 'pg-svg') + '</div>' +
      '<p class="pz-cap pg-cap">気体を選んでね（どれも 1 mol・標準状態）</p>' +
      '<div class="ps-btns">' + G.map(function (g, i) { return '<button class="ps-b" data-i="' + i + '"><span>' + fmt(g.f) + '</span><small>' + esc(g.name) + '</small></button>'; }).join('') + '</div>';
    var layer = M.$('.pg-dots', box), cap = M.$('.pg-cap', box);
    function loop() {
      if (!box.isConnected) { raf = 0; return; }
      var h = '';
      dots.forEach(function (d) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 64 + cur.r || d.x > 236 - cur.r) d.vx *= -1;
        if (d.y < 18 + cur.r || d.y > 160 - cur.r) d.vy *= -1;
        if (cur.f === 'H_2' || cur.f === 'O_2') h += '<circle cx="' + (d.x - cur.r * 0.6) + '" cy="' + d.y + '" r="' + cur.r + '" fill="' + cur.c + '"/><circle cx="' + (d.x + cur.r * 0.6) + '" cy="' + d.y + '" r="' + cur.r + '" fill="' + cur.c + '"/>';
        else h += '<circle cx="' + (d.x - cur.r * 1.1) + '" cy="' + d.y + '" r="' + cur.r * 0.8 + '" fill="#ff5a5a"/><circle cx="' + (d.x + cur.r * 1.1) + '" cy="' + d.y + '" r="' + cur.r * 0.8 + '" fill="#ff5a5a"/><circle cx="' + d.x + '" cy="' + d.y + '" r="' + cur.r * 0.85 + '" fill="#4a4f57"/>';
      });
      layer.innerHTML = h;
      raf = requestAnimationFrame(loop);
    }
    function pick(i) {
      cur = G[i]; tried[i] = true; dots = [];
      for (var k = 0; k < 14; k++) dots.push({ x: 80 + Math.random() * 140, y: 30 + Math.random() * 115, vx: (Math.random() - 0.5) * 2.4, vy: (Math.random() - 0.5) * 2.4 });
      if (!raf && !M.E2E) raf = requestAnimationFrame(loop);
      M.snd.pop();
      cap.innerHTML = fmt(cur.name + ' ' + cur.f + ' 1 mol は、体積 **22.4 L**・質量 ' + cur.m + ' g');
      M.$('[data-i="' + i + '"]', box).classList.add('done');
      if (Object.keys(tried).length >= 3 && !finished) {
        finished = true;
        setTimeout(function () { cap.innerHTML = fmt('重さはバラバラ。でも体積は、どれも **22.4 L**！'); M.snd.bloop(); api.done(); }, M.E2E ? 0 : 1300);
      }
    }
    box.addEventListener('click', function (e) { var b = e.target.closest('[data-i]'); if (b) pick(+b.getAttribute('data-i')); });
    return { auto: function () { [0, 1, 2].forEach(pick); } };
  };

  /* =========================================================
   * map：mol を通る地図
   *  fill：3本の道に「何でかける・わるか」を選ぶ（採点あり）
   *  route：from から to まで、町を順にタップ
   * ========================================================= */
  var NODES = {
    mol: { x: 160, y: 172, t: 'mol', s: '物質量', c: 'm' },
    p: { x: 48, y: 56, t: '個数', s: '粒子の数', c: 'p' },
    g: { x: 272, y: 56, t: '質量', s: 'g', c: 'g' },
    v: { x: 160, y: 290, t: '体積', s: 'L（気体）', c: 'v' }
  };
  var ROAD = { p: '6.0×10^23', g: 'モル質量', v: '22.4' };
  var COL = { m: '#ffb020', p: '#ff5fa2', g: '#2bb673', v: '#3a8dff' };
  P.map = function (box, cfg, api) {
    var filled = cfg.mode === 'fill' ? {} : { p: 1, g: 1, v: 1 }, path = [cfg.from], picking = null, finished = false, missed = {};
    box.innerHTML = '<div class="pm-wrap">' + svg(320, 352, '', 'pm-svg') + '</div><div class="pm-opts" hidden></div>';
    var sv = M.$('.pm-svg', box), opts = M.$('.pm-opts', box);
    function nodeSvg(k) {
      var n = NODES[k], on = path.indexOf(k) >= 0, r = k === 'mol' ? 40 : 34;
      return '<g class="pm-n' + (on ? ' on' : '') + '" data-n="' + k + '" transform="translate(' + n.x + ' ' + n.y + ')"><circle r="' + r + '" fill="' + (on ? COL[n.c] : '#fff') + '" stroke="' + COL[n.c] + '" stroke-width="4"/>' +
        '<text y="' + (k === 'mol' ? 2 : 0) + '" text-anchor="middle" font-size="' + (k === 'mol' ? 22 : 17) + '" font-weight="800" fill="' + (on ? '#fff' : COL[n.c]) + '">' + n.t + '</text>' +
        '<text y="' + (k === 'mol' ? 20 : 17) + '" text-anchor="middle" font-size="10.5" font-weight="700" fill="' + (on ? '#fff' : '#6b7a86') + '">' + n.s + '</text></g>';
    }
    function roadSvg(k) {
      var a = NODES.mol, b = NODES[k], mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, lit = path.indexOf(k) >= 0 && path.indexOf('mol') >= 0;
      var lab = filled[k] ? '<g class="pm-lab"><rect x="-42" y="-14" width="84" height="28" rx="14" fill="#fff" stroke="' + COL[NODES[k].c] + '" stroke-width="2.5"/>' +
        '<text y="5" text-anchor="middle" font-size="13" font-weight="800" fill="#33414d">' + ROAD[k].replace('^23', '²³') + '</text></g>'
        : '<g class="pm-q" data-r="' + k + '"><circle r="20" fill="' + (picking === k ? '#ffe9a8' : '#fff') + '" stroke="#ffb020" stroke-width="3"/><text y="7" text-anchor="middle" font-size="20" font-weight="900" fill="#ffb020">？</text></g>';
      return '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" stroke="' + (lit ? COL[NODES[k].c] : '#d5dde3') + '" stroke-width="' + (lit ? 9 : 7) + '" stroke-linecap="round"/>' +
        '<g transform="translate(' + mx + ' ' + my + ')">' + lab + '</g>';
    }
    function draw() {
      sv.innerHTML = (cfg.mode === 'route' ? '<line x1="' + NODES.p.x + '" y1="' + NODES.p.y + '" x2="' + NODES.g.x + '" y2="' + NODES.g.y + '" stroke="#e7ecef" stroke-width="3" stroke-dasharray="6 8"/><text x="160" y="48" text-anchor="middle" font-size="11" fill="#a8b4bd">直行の道はない</text>' : '') +
        '<text x="160" y="346" text-anchor="middle" font-size="12" font-weight="800" fill="#6b7a86">【mol を求める】わる　／　【mol から求める】かける</text>' +
        roadSvg('p') + roadSvg('g') + roadSvg('v') + nodeSvg('mol') + nodeSvg('p') + nodeSvg('g') + nodeSvg('v');
    }
    function showOpts(k) {
      picking = k; draw();
      opts.hidden = false;
      opts.innerHTML = '<p>' + esc(NODES[k].t) + ' と mol をつなぐ数は？</p>' + M.shuffle(['p', 'g', 'v']).map(function (r) { return '<button class="ps-b" data-o="' + r + '">' + esc(ROAD[r].replace('^23', '²³')) + '</button>'; }).join('');
    }
    function done() { finished = true; M.snd.bloop(); M.FX.burst.apply(null, M.FX.at(sv).concat([36])); setTimeout(api.done, M.E2E ? 0 : 800); }
    box.addEventListener('click', function (e) {
      if (finished) return;
      var o = e.target.closest('[data-o]');
      if (o && picking) {
        var k = picking;
        if (o.getAttribute('data-o') === k) {
          filled[k] = 1; picking = null; opts.hidden = true; if (!missed[k]) api.hit(o); else M.snd.pop();
          draw(); tw(M.$('[data-r]', sv) || null, {}, {});
          if (Object.keys(filled).length === 3) done();
        } else { missed[k] = 1; api.miss(o); M.FX.shake(o); o.disabled = true; api.note(ROAD[o.getAttribute('data-o')].replace('^23', '²³') + ' は、ほかの道の数だよ。'); }
        return;
      }
      var q = e.target.closest('[data-r]');
      if (q && cfg.mode === 'fill') { showOpts(q.getAttribute('data-r')); M.snd.pop(); api.note(''); return; }
      var n = e.target.closest('[data-n]');
      if (n && cfg.mode === 'route') {
        var k2 = n.getAttribute('data-n'), last = path[path.length - 1];
        if (path.indexOf(k2) >= 0) return;
        var ok = (last === 'mol') || (k2 === 'mol');
        if (!ok) { api.note('直行の道はないよ！ まん中の mol を通ってね。'); M.FX.shake(n); if (window.Sfx) Sfx.wrong(); return; }
        if (last === 'mol' && k2 !== cfg.to) { api.note('行きたいのは「' + NODES[cfg.to].t + '」だよ。'); M.FX.shake(n); return; }
        path.push(k2); M.snd.pop(); api.note(''); draw();
        if (k2 === cfg.to) { api.note(NODES[cfg.from].t + ' → mol → ' + NODES[cfg.to].t + '　2歩で到着！'); done(); }
      }
    });
    draw();
    return { auto: function () {
      if (cfg.mode === 'fill') ['p', 'g', 'v'].forEach(function (k) { showOpts(k); M.$('[data-o="' + k + '"]', box).click(); });
      else { M.$('[data-n="mol"]', box).dispatchEvent(new MouseEvent('click', { bubbles: true })); M.$('[data-n="' + cfg.to + '"]', box).dispatchEvent(new MouseEvent('click', { bubbles: true })); }
    } };
  };

  /* =========================================================
   * flask：メスフラスコで溶液をつくる（手順を順に）
   * ========================================================= */
  P.flask = function (box, cfg, api) {
    var STEPS = [
      { t: '粉をはかって、ビーカーに入れる', s: 'はかった NaCl 0.10 mol（5.85 g）を入れた' },
      { t: '少しの水でとかして、メスフラスコへ', s: 'とかした液をメスフラスコへ' },
      { t: '目盛りの線まで水を入れる', s: '線までぴったり。これで全体が 1 L！' }
    ];
    var k = 0, finished = false;
    box.innerHTML = svg(300, 200, '', 'pf-svg') + '<p class="pz-cap pf-cap">正しい順に、手順をタップしよう</p>' +
      '<div class="pf-btns">' + M.shuffle([0, 1, 2]).map(function (i) { return '<button class="ps-b pf-b" data-s="' + i + '">' + esc(STEPS[i].t) + '</button>'; }).join('') + '</div>';
    var sv = M.$('.pf-svg', box), cap = M.$('.pf-cap', box);
    function draw() {
      var lv = k === 0 ? 0 : k === 1 ? 40 : 96;
      sv.innerHTML = '<defs><clipPath id="pfc"><path d="M136 20 h28 v80 q50 20 50 60 q0 32 -64 32 q-64 0 -64 -32 q0 -40 50 -60z"/></clipPath></defs>' +
        '<g clip-path="url(#pfc)"><rect x="80" y="' + (192 - lv * 1.0) + '" width="140" height="' + lv * 1.0 + '" fill="#a8dcff" opacity=".8"/></g>' +
        '<path d="M136 20 h28 v80 q50 20 50 60 q0 32 -64 32 q-64 0 -64 -32 q0 -40 50 -60z" fill="none" stroke="#6b7a86" stroke-width="3"/>' +
        '<line x1="130" y1="52" x2="170" y2="52" stroke="#ff5a5a" stroke-width="2.5"/><text x="176" y="56" font-size="11" font-weight="700" fill="#ff5a5a">目盛りの線（1 L）</text>' +
        (k === 0 ? '' : '') +
        '<g transform="translate(26 150)"><path d="M0 0 h40 v38 q0 6 -6 6 h-28 q-6 0 -6 -6z" fill="' + (k >= 1 ? '#f2fbff' : '#fff') + '" stroke="#9aa7b2" stroke-width="2"/>' +
        (k === 1 ? '<rect x="3" y="18" width="34" height="22" fill="#a8dcff" opacity=".6"/>' : '') + '</g>' +
        (k >= 1 && k < 3 ? '' : '') + '<text x="46" y="140" text-anchor="middle" font-size="11" fill="#6b7a86">ビーカー</text>';
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-s]'); if (!b || finished) return;
      var i = +b.getAttribute('data-s');
      if (i !== k) { api.note(k === 0 ? 'まずは、とかすもの（溶質）を用意しよう。' : k === 1 ? 'フラスコに入れる前に、とかしておこう。' : ''); M.FX.shake(b); if (window.Sfx) Sfx.wrong(); return; }
      k++; b.disabled = true; b.classList.add('done'); cap.textContent = STEPS[i].s; M.snd.pop(); api.note(''); draw();
      if (k === 3) { finished = true; M.snd.bloop(); M.FX.bubbles.apply(null, M.FX.at(sv).concat([16])); setTimeout(api.done, M.E2E ? 0 : 900); }
    });
    draw();
    return { auto: function () { [0, 1, 2].forEach(function (i) { M.$('[data-s="' + i + '"]', box).click(); }); } };
  };
})();
