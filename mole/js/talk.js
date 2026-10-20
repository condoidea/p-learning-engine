/* =========================================================
 * mole/talk.js — モルモ先生とのトーク（チャット形式の授業）
 *
 *  先生が吹き出しで話し、キミは下のトレイ（返事・選択肢・テンキー）で答える。
 *  台本の書き方は data/lessons.js の先頭を参照。
 *  正解すると「粒」が ×○倍 にふえる（あつめた粒は 10 の何乗かで記録）。
 * ========================================================= */
(function () {
  'use strict';
  var $ = M.$, $$ = M.$$, fmt = M.fmt, esc = M.esc, FX = M.FX, S = M.S;
  var E2E = M.E2E;
  var ABORT = { abort: true };

  /* 粒のふえ方（10 の何乗ぶん、ふえるか） */
  var GAIN = { base: 0.105, combo: 0.014, speed: 0.07, clear: 0.4 };
  M.GAIN = GAIN;

  var log, tray, run = null;
  var PRAISE = ['正解！', 'いいね！', 'そのとおり！', 'ナイス！', 'さすが助手！', 'カンペキ！'];

  /* ---------- 小物 ---------- */
  function alive(r) { if (run !== r || r.dead) throw ABORT; }
  function wait(ms) {
    var r = run;
    return new Promise(function (res) {
      if (E2E) { res(); return; }
      var t = setTimeout(done, r && r.fast ? Math.min(ms, 120) : ms);
      function done() { if (r) r.skip = null; res(); }
      if (r) r.skip = function () { clearTimeout(t); done(); };
    }).then(function () { alive(r); });
  }
  function scrollDown() {
    requestAnimationFrame(function () { window.scrollTo({ top: document.documentElement.scrollHeight, behavior: E2E ? 'auto' : 'smooth' }); });
  }
  function fitTray() { log.style.paddingBottom = (tray.offsetHeight + 28) + 'px'; scrollDown(); }
  function setTray(html) { tray.innerHTML = html || ''; tray.classList.toggle('on', !!html); fitTray(); if (html && M.G && !E2E) M.G.fromTo(tray.children, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, stagger: 0.04, ease: 'back.out(2)' }); }
  function setFace(f) {
    var av = $('#tAv'); av.innerHTML = M.face(f || 'normal');
    if (M.G && !E2E && f && f !== 'normal') M.G.fromTo(av, { y: -6, rotate: f === 'oops' ? -8 : 0 }, { y: 0, rotate: 0, duration: 0.4, ease: 'bounce.out' });
    if (run) run.face = f;
  }
  function row(cls, inner, who) {
    var last = log.lastElementChild, cont = last && last.getAttribute('data-who') === who;
    var d = document.createElement('div');
    d.className = 'row ' + cls + (cont ? ' cont' : '');
    d.setAttribute('data-who', who);
    d.innerHTML = (who === 't' ? '<div class="av">' + (cont ? '' : M.face(run && run.face || 'normal')) + '</div>' : '') + inner;
    log.appendChild(d);
    if (M.G && !E2E) M.G.fromTo(d.lastElementChild, { y: 14, scale: 0.92, opacity: 0, transformOrigin: who === 'me' ? 'right bottom' : 'left bottom' }, { y: 0, scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' });
    scrollDown();
    return d;
  }
  function gl(el) { M.glossify(el, run.used); }

  /* ---------- 先生がしゃべる ---------- */
  function say(text, face, cls) {
    var r = run;
    setFace(face || 'normal');
    var d = row('t', '<div class="bub ' + (cls || '') + '"><i class="dots"><b></b><b></b><b></b></i></div>', 't');
    var plain = String(text).replace(/[*_{}()|^]/g, '');
    return wait(Math.min(1250, 280 + plain.length * 16)).then(function () {
      alive(r);
      var b = d.querySelector('.bub');
      b.innerHTML = fmt(text); gl(b);
      M.snd.pop();
      M.$$('mark.k', b).forEach(function (mk, i) { if (M.G && !E2E) M.G.fromTo(mk, { backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%', duration: 0.5, delay: 0.15 + i * 0.15, ease: 'power2.out' }); });
      scrollDown();
      return wait(Math.min(900, 200 + plain.length * 9));
    });
  }
  function me(html) { row('me', '<div class="bub">' + html + '</div>', 'me'); M.snd.type(); }

  /* ---------- 粒（ごほうび） ---------- */
  function refreshCount(bump) {
    var c = $('#tCount'); c.innerHTML = M.countHTML(S.L);
    var cb = run ? run.combo : 0;
    $('#tCombo').textContent = cb >= 2 ? '🔥' + cb + ' COMBO' : '';
    /* コンボ中はカウンターが燃える */
    var box = $('.t-gain'); box.classList.toggle('hot', cb >= 3); box.classList.toggle('blaze', cb >= 5);
    if (bump && M.G && !E2E) M.G.fromTo(c, { scale: 1.45, color: '#ff5fa2' }, { scale: 1, color: '#33414d', duration: 0.5, ease: 'back.out(3)' });
  }
  /* 粒をふやす。新しく超えたスケール図鑑の項目を返す */
  function addParts(g, el) {
    var before = S.L, fresh = [];
    S.L = Math.round((S.L + g) * 1000) / 1000;
    M.MILES.forEach(function (m) {
      var L = Math.log10(m.n);
      if (before < L && S.L >= L && S.miles.indexOf(m.id) < 0) { S.miles.push(m.id); fresh.push(m); }
    });
    M.save();
    if (run) {
      run.gained += g; Array.prototype.push.apply(run.newMiles, fresh);
      /* 粒がカウンターへ飛んでいき、着いたら数字がはねる */
      if (el) FX.fly(el, $('#tCount'), 6 + Math.min(run.combo, 8) * 2, function () { refreshCount(true); });
      else refreshCount(true);
    }
    var x = Math.pow(10, g);
    FX.floatText(el || $('#tCount'), '粒 ×' + (x < 10 ? x.toFixed(2) : Math.round(x)), 'gain');
    return fresh;
  }
  function hit(el, opt) {
    opt = opt || {};
    run.ok++; run.total++; run.combo++;
    var g = (GAIN.base + GAIN.combo * Math.min(run.combo, 5) + (opt.speed ? GAIN.speed : 0)) * run.factor;
    addParts(g, el);
    if (window.Sfx) Sfx.correct(run.combo);
    if (el) FX.burst.apply(null, FX.at(el).concat([18 + Math.min(run.combo, 8) * 4, 1 + Math.min(run.combo, 8) * 0.08]));
    if (run.combo === 3 || run.combo === 5 || run.combo % 10 === 0) {
      if (window.Sfx) Sfx.combo(run.combo);
      FX.bubbles(innerWidth / 2, innerHeight - 80, 10 + run.combo * 2);
      run.pendingSlam = '<b class="cmb">' + run.combo + '</b><small>COMBO!</small>';
    }
  }
  function miss(el) {
    run.total++; run.combo = 0; run.missed = true;
    refreshCount(false);
    if (window.Sfx) Sfx.wrong();
    if (el) FX.shake(el);
  }
  /* 大きな演出は、答えの説明が終わってから */
  function afterStep() {
    var r = run, p = Promise.resolve();
    if (r.pendingSlam) { var s = r.pendingSlam; r.pendingSlam = null; p = p.then(function () { return FX.slam(s, 'combo'); }); }
    while (r.newMiles.length) {
      (function (m) {
        p = p.then(function () {
          M.snd.exp(); FX.rain(90);
          return FX.slam('<small>あつめた粒が</small><b class="mile">' + esc(m.t) + '</b><small>を こえた！</small>', 'mile');
        });
      })(r.newMiles.shift());
    }
    return p.then(function () { alive(r); });
  }

  /* ---------- 返事 ---------- */
  function reply(opts) {
    var r = run;
    return new Promise(function (res) {
      setTray('<div class="replies">' + opts.map(function (o, i) {
        var l = typeof o === 'string' ? o : o.l;
        return '<button class="rp' + (/🤔/.test(l) ? ' why' : '') + '" data-i="' + i + '">' + fmt(l) + '</button>';
      }).join('') + '</div>');
      tray.onclick = function (e) {
        var b = e.target.closest('[data-i]'); if (!b) return;
        tray.onclick = null;
        var o = opts[+b.getAttribute('data-i')];
        setTray('');
        me(fmt(typeof o === 'string' ? o : o.l));
        res(o);
      };
      if (E2E) setTimeout(function () { var bs = $$('[data-i]', tray); bs[bs.length - 1].click(); });
    }).then(function (o) { alive(r); if (o && o.then) return play(o.then); });
  }

  /* ---------- 選ぶ問題 ---------- */
  function ask(s) {
    var r = run, text = s.ask;
    return say(text, s.pre ? 'think' : 'normal', 'q' + (s.pre ? ' pre' : '')).then(function () {
      var b = log.lastElementChild.querySelector('.bub');
      b.insertAdjacentHTML('afterbegin', '<span class="qtag">' + (s.pre ? '予想' : 'Q') + '</span>');
      return new Promise(function (res) {
        setTray('<div class="opts">' + s.opts.map(function (o, i) { return '<button class="op" data-i="' + i + '">' + fmt(o) + '</button>'; }).join('') + '</div>');
        tray.onclick = function (e) {
          var bt = e.target.closest('[data-i]'); if (!bt) return;
          tray.onclick = null;
          var i = +bt.getAttribute('data-i'), ok = i === s.a;
          $$('.op', tray).forEach(function (x, k) { x.disabled = true; if (k === s.a) x.classList.add('right'); });
          if (!ok) bt.classList.add('wrong');
          if (!s.pre) { if (ok) hit(bt); else miss(bt); }
          setTimeout(function () { setTray(''); me(fmt(s.opts[i])); res(i); }, E2E ? 0 : (ok ? 450 : 750));
        };
        if (E2E) setTimeout(function () { $('[data-i="' + s.a + '"]', tray).click(); });
      });
    }).then(function (i) {
      alive(r);
      var ok = i === s.a, ng = s.ng && (typeof s.ng === 'string' ? s.ng : s.ng[i]);
      var p;
      if (s.pre) p = say(ok ? (s.ok || 'いい読みだね！') : (ng || 'じつは…'), ok ? 'happy' : 'think');
      else if (ok) p = say(M.pick(PRAISE) + (s.ok ? ' ' + s.ok : ''), r.combo >= 3 ? 'wow' : 'happy');
      else p = say((ng ? ng + '\n' : 'おしい！ ') + '正解は「' + s.opts[s.a] + '」。', 'oops');
      return p.then(function () { if (s.why && (!ok || s.pre || r.mode !== 'lesson')) return say(s.why, s.pre ? 'normal' : 'normal'); });
    });
  }

  /* ---------- テンキー ---------- */
  function keypad(unit, onSubmit) {
    var m = '', e = '', expMode = false;
    var html = '<div class="kp"><div class="kp-disp"><span class="kp-v"></span><span class="kp-u">' + fmt(unit || '') + '</span></div><div class="kp-keys">' +
      ['7', '8', '9', 'del', '4', '5', '6', 'x10', '1', '2', '3', 'neg', '0', '.', 'ok'].map(function (k) {
        var lab = { del: '⌫', x10: '×10ⁿ', neg: '−', ok: '決定' }[k] || k;
        return '<button class="kk k-' + k + '" data-k="' + k + '">' + lab + '</button>';
      }).join('') + '</div></div>';
    function view(root) {
      var v = $('.kp-v', root);
      v.innerHTML = (m || (expMode ? '' : '<i class="ph">数を入力</i>')) + (expMode ? '<span class="kp-x">×10<sup>' + (e || '<i class="cur">□</i>') + '</sup></span>' : '');
      $('.k-x10', root).classList.toggle('on', expMode);
      $('.k-ok', root).disabled = !valid();
      $('.k-neg', root).disabled = !expMode;
    }
    function valid() { return m !== '' && m !== '.' && !isNaN(parseFloat(m)) && (!expMode || /^-?\d+$/.test(e)); }
    function value() { return parseFloat(m) * (expMode ? Math.pow(10, parseInt(e, 10)) : 1); }
    function text() { return m + (expMode ? '×10^' + e : '') + (unit ? ' ' + unit : ''); }
    function bind(root) {
      root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-k]'); if (!b || b.disabled) return;
        var k = b.getAttribute('data-k');
        if (k === 'ok') { if (valid()) onSubmit(value(), text(), function () { m = ''; e = ''; expMode = false; view(root); }); return; }
        if (k === 'del') { if (expMode) { if (e) e = e.slice(0, -1); else expMode = false; } else m = m.slice(0, -1); }
        else if (k === 'x10') { if (m) expMode = !expMode; if (!expMode) e = ''; }
        else if (k === 'neg') { if (expMode) e = e[0] === '-' ? e.slice(1) : '-' + e; }
        else if (k === '.') { if (!expMode && m.indexOf('.') < 0) m = (m || '0') + '.'; }
        else { if (expMode) { if (e.replace('-', '').length < 2) e += k; } else if (m.replace('.', '').length < 6) m += k; }
        M.snd.type(); view(root);
      });
      view(root);
    }
    return { html: html, bind: bind, set: function (str) { var p = str.split('e'); m = p[0]; e = p[1] || ''; expMode = !!p[1]; } };
  }
  function same(a, b) { if (b === 0) return Math.abs(a) < 1e-9; return Math.abs(a - b) / Math.abs(b) < 0.015; }
  function e2eStr(x) { var a = Math.abs(x); if (a >= 1e4) { var ex = Math.floor(Math.log10(a)); return String(Math.round(x / Math.pow(10, ex) * 100) / 100) + 'e' + ex; } return String(Math.round(x * 1000) / 1000); }

  /* ---------- 数を入れる問題 ---------- */
  function num(s) {
    var r = run, tries = 0;
    return say(s.num, 'normal', 'q').then(function () {
      log.lastElementChild.querySelector('.bub').insertAdjacentHTML('afterbegin', '<span class="qtag">Q</span>');
      return new Promise(function (res) {
        var kp = keypad(s.unit, function (v, t, clear) {
          alive(r);
          tries++;
          var ok = same(v, s.ans);
          me(fmt(t));
          if (ok) { if (tries === 1) hit($('.k-ok', tray)); else { M.snd.pop(); refreshCount(false); } setTray(''); res({ ok: true, tries: tries }); return; }
          if (tries === 1) miss($('.k-ok', tray));
          clear();
          if (tries === 1 && s.hint) { say('ちょっとちがうみたい。ヒント：' + s.hint, 'think').then(fitTray); return; }
          setTray(''); res({ ok: false, tries: tries });
        });
        setTray(kp.html); kp.bind(tray.firstChild);
        if (E2E) setTimeout(function () { kp.set(e2eStr(s.ans)); $('.k-ok', tray).disabled = false; $('.k-ok', tray).click(); });
      });
    }).then(function (o) {
      alive(r);
      if (o.ok) return say(o.tries === 1 ? (s.ok || M.pick(PRAISE)) : '今度は正解！ ヒントから立て直せたね。', o.tries === 1 ? (r.combo >= 3 ? 'wow' : 'happy') : 'happy');
      return say('おしい！ いっしょに解いてみよう。', 'oops').then(function () {
        return steps(s.steps || [], s.ans, s.unit);
      });
    });
  }
  function steps(lines, ans, unit) {
    var r = run;
    var d = row('t wide', '<div class="card steps"><h4>解き方</h4><ol>' + lines.map(function (l) { return '<li>' + fmt(l) + '</li>'; }).join('') + '</ol>' +
      '<p class="ans">答え：' + fmt(M.numText(ans) + (unit ? ' ' + unit : '')) + '</p></div>', 't');
    gl(d);
    if (M.G && !E2E) M.G.from($$('li', d), { x: -14, opacity: 0, duration: 0.3, stagger: 0.25 });
    return wait(900 + lines.length * 500).then(function () { alive(r); return reply(['わかった']); });
  }

  /* ---------- 先生のまちがい探し ---------- */
  function oops(s) {
    var r = run;
    return say(s.oops, 'proud').then(function () {
      var d = row('t wide', '<div class="card oops"><h4>🐹 モルモ先生の計算</h4>' + s.lines.map(function (l, i) { return '<button class="ol" data-l="' + i + '">' + fmt(l) + '</button>'; }).join('') + '</div>', 't');
      setTray('<p class="mission">🔍 まちがっている行をタップ！</p>');
      return new Promise(function (res) {
        d.onclick = function (e) {
          var b = e.target.closest('[data-l]'); if (!b) return;
          d.onclick = null;
          var i = +b.getAttribute('data-l'), ok = i === s.bad;
          $$('.ol', d).forEach(function (x, k) { x.disabled = true; if (k === s.bad) x.classList.add('bad'); });
          if (ok) hit(b); else miss(b);
          setTray('');
          res(ok);
        };
        if (E2E) setTimeout(function () { $('[data-l="' + s.bad + '"]', d).click(); });
      });
    }).then(function (ok) {
      alive(r);
      return say(ok ? 'あっ…バレた！ 見つけてくれてありがとう。' : 'まちがいは、赤くなった行だったの。', 'oops').then(function () { return say(s.fix, 'normal'); });
    });
  }

  /* ---------- 実験 ---------- */
  function prop(s) {
    var r = run;
    return new Promise(function (res) {
      /* 何のための実験か（ねらい）と、やること（ミッション）をカードの上に書いておく。終わっても残る */
      var d = row('t wide', '<div class="card prop">' +
        (s.mission ? '<h4>🧪 実験</h4>' : '<h4>🔬 図</h4>') +
        (s.aim ? '<p class="aim"><b>ねらい</b>' + fmt(s.aim) + '</p>' : '') +
        (s.mission ? '<p class="todo"><b>やること</b>' + fmt(s.mission) + '</p>' : '') +
        '<div class="pbox"></div><p class="pnote"></p></div>', 't');
      var box = $('.pbox', d), note = $('.pnote', d), finished = false;
      if (s.mission) setTray('<p class="mission">👆 上の実験で：' + fmt(s.mission) + '</p>'); else setTray('');
      var api = {
        done: function () {
          if (finished) return; finished = true; alive(r); setTray('');
          var td = $('.todo', d); if (td) { td.classList.add('ok'); td.querySelector('b').textContent = '✓ できた'; }
          res();
        },
        note: function (t) { note.innerHTML = t ? fmt(t) : ''; if (t) scrollDown(); },
        hit: function (el) { hit(el); },
        miss: function (el) { miss(el); }
      };
      var h = M.PROPS[s.prop](box, s, api);
      gl(d);
      setTimeout(scrollDown, 60);
      if (E2E && h && h.auto) setTimeout(h.auto);
    }).then(function () { alive(r); return wait(300); });
  }

  /* ---------- ホワイトボード ---------- */
  function board(s) {
    var d = row('t wide', '<div class="card board"><h4>📋 ' + fmt(s.board) + '</h4><ul>' + s.lines.map(function (l) { return '<li>' + fmt(l) + '</li>'; }).join('') + '</ul>' +
      (s.foot ? '<p class="foot">' + fmt(s.foot) + '</p>' : '') + '</div>', 't');
    gl(d);
    M.snd.bloop();
    if (M.G && !E2E) M.G.from($$('li', d), { x: -12, opacity: 0, duration: 0.3, stagger: 0.18, delay: 0.2 });
    return wait(700 + s.lines.length * 350);
  }

  /* ---------- 早押しラッシュ ---------- */
  /* ルールはトークの中で見せて、自分で「スタート」を押してから画面が開く（前の説明を読み終えてから） */
  function rush(n, pool) {
    var r = run;
    var d = row('t wide', '<div class="card rs-rule"><h4>⚡ 早押しラッシュ</h4><ul>' +
      '<li>このレッスンから <b>' + n + ' 問</b></li>' +
      '<li>バーがなくなる前に答えると <b>スピードボーナス</b></li>' +
      '<li>時間切れでも答えられる。まちがえたら答えと解き方が出るよ</li>' +
      '<li>全問正解で <b>PERFECT!!</b> 粒のボーナス</li></ul></div>', 't');
    gl(d);
    return reply(['⚡ スタート！']).then(function () { alive(r); return openRush(n, pool); });
  }
  function openRush(n, pool) {
    var r = run, qs = pickQuiz(pool || r.lesson.quiz, n);
    var ov = document.createElement('div');
    ov.className = 'rush'; ov.innerHTML = '<div class="rs-top"><b>⚡ RUSH</b><span class="rs-n"></span></div><div class="rs-timer"><i></i></div><div class="rs-q"></div><div class="rs-a"></div>';
    $('#talk').appendChild(ov);
    setTray('');
    if (M.G && !E2E) M.G.fromTo(ov, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.3 });
    var i = 0, okN = 0;
    function one() {
      alive(r);
      if (i >= qs.length) return Promise.resolve();
      var q = qs[i++], limit = q.num != null ? 30 : 12, t0 = Date.now(), raf = 0;
      $('.rs-n', ov).textContent = i + ' / ' + qs.length;
      var qe = $('.rs-q', ov), ae = $('.rs-a', ov), bar = $('.rs-timer i', ov);
      qe.innerHTML = fmt(q.num != null ? q.num : q.ask); gl(qe);
      if (M.G && !E2E) M.G.fromTo(qe, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: 'power3.out' });
      function tick() { var p = Math.max(0, 1 - (Date.now() - t0) / (limit * 1000)); bar.style.transform = 'scaleX(' + p + ')'; bar.classList.toggle('low', p < 0.3); if (p > 0 && ov.isConnected) raf = requestAnimationFrame(tick); }
      tick();
      return new Promise(function (res) {
        function judge(ok, el) {
          cancelAnimationFrame(raf);
          var fast = (Date.now() - t0) < limit * 1000;
          if (ok) { hit(el, { speed: fast }); if (fast) FX.floatText(el, 'SPEED!', 'speed'); }
          else miss(el);
          res({ ok: ok, el: el });
        }
        if (q.num != null) {
          var kp = keypad(q.unit, function (v, t) { judge(same(v, q.ans), $('.k-ok', ae)); });
          ae.innerHTML = kp.html; kp.bind(ae.firstChild);
          if (E2E) setTimeout(function () { kp.set(e2eStr(q.ans)); $('.k-ok', ae).disabled = false; $('.k-ok', ae).click(); });
        } else {
          ae.innerHTML = '<div class="opts">' + q.opts.map(function (o, k) { return '<button class="op" data-i="' + k + '">' + fmt(o) + '</button>'; }).join('') + '</div>';
          ae.onclick = function (e) {
            var b = e.target.closest('[data-i]'); if (!b) return; ae.onclick = null;
            var k = +b.getAttribute('data-i');
            $$('.op', ae).forEach(function (x, j) { x.disabled = true; if (j === q.a) x.classList.add('right'); });
            if (k !== q.a) b.classList.add('wrong');
            judge(k === q.a, b);
          };
          if (E2E) setTimeout(function () { $('[data-i="' + q.a + '"]', ae).click(); });
        }
      }).then(function (o) {
        alive(r);
        if (o.ok) { okN++; return wait(650).then(one); }
        /* まちがえたら、答えと解き方を見てから次へ */
        var expl = q.num != null ? (q.steps || []).map(fmt).join('<br>') + '<br><b>答え：' + fmt(M.numText(q.ans) + (q.unit ? ' ' + q.unit : '')) + '</b>'
          : '<b>正解：' + fmt(q.opts[q.a]) + '</b>' + (q.why ? '<br>' + fmt(q.why) : '');
        ae.innerHTML = '<div class="rs-ex">' + expl + '</div><button class="main-s rs-next">つぎへ ▶</button>';
        gl(ae);
        return new Promise(function (res) { $('.rs-next', ae).onclick = res; if (E2E) setTimeout(res); }).then(one);
      });
    }
    return FX.slam('<b class="rush-t">⚡ RUSH!</b><small>早押し ' + qs.length + ' 問</small>', 'rush').then(one).then(function () {
      alive(r);
      if (okN === qs.length) {
        /* 全問正解：PERFECT!! と粒のボーナス（ふつうの正解2問ぶん） */
        M.snd.exp(); FX.rain(140);
        addParts(GAIN.base * 2 * r.factor, $('.rs-q', ov));
        return FX.slam('<b class="rush-t">PERFECT!!</b><small>全問正解ボーナス　粒 ×' + Math.pow(10, GAIN.base * 2 * r.factor).toFixed(2) + '</small>', 'rush');
      }
      return FX.slam('<b class="rush-t">CLEAR!</b><small>' + okN + ' / ' + qs.length + ' 問正解</small>', 'rush');
    }).then(function () { ov.remove(); }, function (e) { ov.remove(); throw e; });
  }

  /* ---------- 問題プール → 台本の形に ---------- */
  function norm(item) {
    var q = item.gen ? M.genQ(item.gen) : item;
    if (q.num != null && q.opts == null) return { num: q.q, ans: q.num, unit: q.unit, hint: q.hint, steps: q.steps, src: item };
    var order = M.shuffle(q.opts.map(function (o, i) { return i; }));
    return { ask: q.q, opts: order.map(function (i) { return q.opts[i]; }), a: order.indexOf(q.a), why: q.why, src: item };
  }
  function pickQuiz(pool, n) { return M.shuffle(pool).slice(0, n).map(norm); }
  M.pickQuiz = pickQuiz;

  /* ---------- 台本を流す ---------- */
  function step(s) {
    if (typeof s === 'string') return say(s);
    if (s.t) return say(s.t, s.face);
    if (s.reply) return reply(s.reply);
    if (s.ask) return ask(s);
    if (s.num) return num(s);
    if (s.oops) return oops(s);
    if (s.prop) return prop(s);
    if (s.board) return board(s);
    if (s.rush) return rush(s.rush);
    return Promise.resolve();
  }
  function play(list) {
    var p = Promise.resolve();
    list.forEach(function (s) { p = p.then(function () { alive(run); return step(s); }).then(afterStep); });
    return p;
  }

  /* =========================================================
   * 開始：lesson（授業）／ polish（みがく）
   *  opt.onEnd({ ok, total, gained, missed }) で終わる
   * ========================================================= */
  function begin(opt) {
    if (run) run.dead = true;
    log = $('#log'); tray = $('#tray');
    log.innerHTML = ''; setTray('');
    run = { mode: opt.mode, lesson: opt.lesson, used: {}, ok: 0, total: 0, combo: 0, gained: 0, factor: opt.factor || 1, newMiles: [], face: 'normal', fast: false };
    $('#tTitle').textContent = opt.head; $('#tSub').textContent = opt.sub || '';
    setFace('normal'); refreshCount(false);
    var r = run;
    return r;
  }
  M.Talk = {
    lesson: function (L, opt) {
      var r = begin({ mode: 'lesson', lesson: L, head: 'Lesson ' + L.no, sub: L.title.replace(/\^(\d+)/g, function (m, d) { return M.sup(d); }), factor: opt.factor });
      var pre = [];
      if (opt.pop) {
        pre.push({ t: '始める前に、抜き打ちチェック！ 前に習ったこと、覚えてるかな？', face: 'proud' });
        pre.push(opt.pop);
        pre.push({ t: 'よし、じゃあ今日のテーマ「' + L.title + '」いくよ！', face: 'happy' });
      }
      return play(pre.concat(L.talk)).then(function () {
        alive(r); setTray('');
        var res = { ok: r.ok, total: r.total, gained: r.gained, missed: !!r.missed };
        run = null; opt.onEnd(res);
      }, function (e) { if (e !== ABORT) { console.error(e); if (M.E2E) M.e2eFail(e); } });
    },
    polish: function (L, opt) {
      var r = begin({ mode: 'polish', lesson: L, head: '✨ みがく', sub: L.crystal.name + '（Lesson ' + L.no + '）', factor: opt.factor });
      var qs = pickQuiz(L.quiz, 4);
      if (opt.extra) qs.push(opt.extra);
      var list = [{ t: opt.due ? L.crystal.name + 'の結晶がくもってきたよ。' + qs.length + '問でピカピカにしよう！' : '練習だね！ ' + qs.length + '問いくよ。', face: 'happy' }].concat(qs);
      return play(list).then(function () {
        alive(r); setTray('');
        var res = { ok: r.ok, total: r.total, gained: r.gained };
        run = null; opt.onEnd(res);
      }, function (e) { if (e !== ABORT) { console.error(e); if (M.E2E) M.e2eFail(e); } });
    },
    stop: function () { if (run) { run.dead = true; if (run.skip) run.skip(); } run = null; M.$$('.rush').forEach(function (x) { x.remove(); }); },
    add: addParts,
    norm: norm
  };
  /* 吹き出しの待ちを、タップで早送り */
  document.addEventListener('click', function (e) {
    if (!run || !e.target.closest || !e.target.closest('#log')) return;
    if (e.target.closest('button,[data-gl],input')) return;
    if (run.skip) run.skip();
  });
})();
