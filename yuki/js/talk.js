/* =========================================================
 * yuki/talk.js — 炭素の精霊テトラとのトーク（レッスン）
 *
 *  台本（data/lessons.js）のステップ
 *   '文字'                         テトラが話す（{ t, face } でも）
 *   { story: '…' }                 語り（ナレーション）
 *   { reply: ['うん', { l: '🤔 なんで？', then: [ … ] }] }   返事。then があれば話が分かれる
 *   { ask, opts, a, ok, ng, why, pre, mols }   選ぶ問題（pre: true ＝ 予想・採点しない / mols: true ＝ 選択肢が分子の絵）
 *   { show: 'ethanol', cap }       分子を見せる（小さな魔法陣のカード）
 *   { build: { mat, answers, need }, mission }  錬成（answers をすべて＝または need 個見つけるまで）
 *   { cast: { goal, pool, reagents, conds }, mission }   詠唱の儀式（ritual.js）
 *   { tip: 'honc' }                Tips カードを手に入れる（data/tips.js）
 *   { match: { title, rounds: [[[左, 右], …], …] } }   組み合わせ演習（全部の組を合わせる。右は文字か { pic: 'C:r0 …' }）
 *   { slam: '…' }                  画面のまん中にドン
 *  正解・錬成・詠唱で経験値（EXP）がふえる。たまるとレベルアップ
 * ========================================================= */
(function () {
  'use strict';
  var Y = window.Y, $ = Y.$, $$ = Y.$$, fmt = Y.fmt, esc = Y.esc;
  var ABORT = { abort: true };
  var log, tray, run = null;
  var PRAISE = ['正解！', 'そのとおり！', 'いいね！', 'さすが！', 'カンペキ！'];

  /* ---------- テトラ（炭素の精霊・腕が4本）の顔 ---------- */
  Y.face = function (f) {
    f = f || 'normal';
    var eye = function (x) {
      if (f === 'happy' || f === 'proud') return '<path d="M' + (x - 6) + ' 50 q6 -8 12 0" stroke="#1a1238" stroke-width="3.6" fill="none" stroke-linecap="round"/>';
      if (f === 'oops') return '<path d="M' + (x - 5) + ' 45 l10 8 M' + (x + 5) + ' 45 l-10 8" stroke="#1a1238" stroke-width="3.2" stroke-linecap="round"/>';
      var r = f === 'wow' ? 6.5 : 5.2;
      return '<circle cx="' + x + '" cy="49" r="' + r + '" fill="#1a1238"/><circle cx="' + (x + 2) + '" cy="46.6" r="2" fill="#fff"/>';
    };
    var mouth = { normal: '<path d="M44 62 q6 5 12 0" stroke="#1a1238" stroke-width="3" fill="none" stroke-linecap="round"/>',
      happy: '<path d="M42 60 q8 10 16 0z" fill="#1a1238"/>', proud: '<path d="M42 61 q8 7 16 -1" stroke="#1a1238" stroke-width="3.2" fill="none" stroke-linecap="round"/>',
      wow: '<ellipse cx="50" cy="63" rx="5" ry="6" fill="#1a1238"/>', think: '<path d="M44 63 h12" stroke="#1a1238" stroke-width="3" stroke-linecap="round"/>',
      oops: '<path d="M43 64 q4 -4 7 0 q3 4 7 0" stroke="#1a1238" stroke-width="3" fill="none" stroke-linecap="round"/>' }[f] || '';
    var arm = function (r) { return '<g transform="rotate(' + r + ' 50 54)"><line x1="50" y1="54" x2="50" y2="8" stroke="#ffd98a" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="8" r="6" fill="#fff3c4"/></g>'; };
    return '<svg viewBox="0 0 100 100" class="face f-' + f + '" aria-hidden="true">' + arm(-45) + arm(45) + arm(135) + arm(-135) +
      '<circle cx="50" cy="54" r="27" fill="#ffe7a6"/><circle cx="50" cy="54" r="27" fill="url(#tg)" opacity=".5"/>' +
      '<defs><radialGradient id="tg" cx=".35" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#ffb84d"/></radialGradient></defs>' +
      eye(41) + eye(59) + mouth + (f === 'think' ? '<text x="78" y="26" font-size="18" fill="#ffd98a">?</text>' : '') +
      '<ellipse cx="34" cy="60" rx="4.5" ry="2.6" fill="#ff8a7a" opacity=".55"/><ellipse cx="66" cy="60" rx="4.5" ry="2.6" fill="#ff8a7a" opacity=".55"/></svg>';
  };

  /* ---------- 小物 ---------- */
  function alive(r) { if (run !== r || r.dead) throw ABORT; }
  function wait(ms) {
    var r = run;
    return new Promise(function (res) {
      var t = setTimeout(done, ms);
      function done() { if (r) r.skip = null; res(); }
      if (r) r.skip = function () { clearTimeout(t); done(); };
    }).then(function () { alive(r); });
  }
  function scrollDown() { requestAnimationFrame(function () { var m = $('#log'); m.scrollTo({ top: m.scrollHeight, behavior: Y.RM ? 'auto' : 'smooth' }); }); }
  function setTray(html) { tray.innerHTML = html || ''; tray.classList.toggle('on', !!html); scrollDown(); }
  function setFace(f) { $('#tAv').innerHTML = Y.face(f || 'normal'); if (run) run.face = f; }
  function row(cls, inner, who) {
    var last = log.lastElementChild, cont = last && last.getAttribute('data-who') === who;
    var d = document.createElement('div');
    d.className = 'row ' + cls + (cont ? ' cont' : '');
    d.setAttribute('data-who', who);
    d.innerHTML = (who === 't' ? '<div class="av">' + (cont ? '' : Y.face(run && run.face || 'normal')) + '</div>' : '') + inner;
    log.appendChild(d);
    scrollDown();
    return d;
  }
  function gl(el) { Y.glossify(el, run.used); }

  function say(text, face, cls) {
    var r = run;
    setFace(face || 'normal');
    var d = row('t', '<div class="bub ' + (cls || '') + '"><i class="dots"><b></b><b></b><b></b></i></div>', 't');
    var n = Y.plain(text).length;
    return wait(Math.min(650, 220 + n * 6)).then(function () {
      alive(r);
      var b = d.querySelector('.bub');
      b.innerHTML = fmt(text); gl(b);
      Y.se('tap');
      scrollDown();
      if (!tray.innerHTML) setTray('<p class="wait">👆 タップで先へ</p>');
      return wait(Math.max(900, Math.min(3000, n * 55)));
    });
  }
  function story(text) {
    var r = run;
    var d = row('story', '<div class="sto">' + fmt(text) + '</div>', 's');
    gl(d);
    if (!tray.innerHTML) setTray('<p class="wait">👆 タップで先へ</p>');
    return wait(Math.max(1200, Math.min(3400, Y.plain(text).length * 60))).then(function () { alive(r); });
  }
  function me(html) { row('me', '<div class="bub">' + html + '</div>', 'me'); }

  /* ---------- 経験値（EXP） ---------- */
  function gain(n, el) {
    var up = Y.addExp(n);
    run.exp += n;
    $('#tMp').textContent = run.exp;
    if (el && window.FX) { var c = FX.at(el); FX.floatText(c.x, c.y - 10, '+' + n + ' EXP', '#ffd98a'); }
    if (up) setTimeout(function () { Y.levelUp(up); }, 500);
  }
  function hit(el) {
    run.ok++; run.total++; run.combo++;
    gain(10 + Math.min(run.combo, 5) * 2, el);
    Y.se('correct', run.combo);
    if (el && window.FX) { var c = FX.at(el); FX.burst(c.x, c.y, { pal: 'gold', n: 18 + run.combo * 3 }); }
    if (run.combo === 3 || run.combo === 5) { Y.se('combo', run.combo); run.slam = run.combo + ' COMBO!'; }
  }
  function miss(el) { run.total++; run.combo = 0; run.miss++; Y.se('wrong'); if (window.FX) FX.shake(el); }
  function afterStep() { if (run.slam && window.FX) { FX.slam(run.slam, 'combo'); run.slam = null; return Y.sleep(700); } return Promise.resolve(); }

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
        setTray(''); me(fmt(typeof o === 'string' ? o : o.l)); Y.se('tap');
        res(o);
      };
    }).then(function (o) { alive(r); if (o && o.then) return play(o.then); });
  }

  /* ---------- 選ぶ問題 ---------- */
  function optHTML(o, s) {
    if (s.mols) { var m = Y.MOLS[o]; return Y.Mol.mini(m.s, 120) + '<small>' + esc(m.f || '') + '</small>'; }
    return fmt(o);
  }
  function ask(s) {
    var r = run;
    return say(s.ask, s.pre ? 'think' : 'normal', 'q' + (s.pre ? ' pre' : '')).then(function () {
      var b = log.lastElementChild.querySelector('.bub');
      b.insertAdjacentHTML('afterbegin', '<span class="qtag">' + (s.pre ? '予想' : 'Q') + '</span>');
      return new Promise(function (res) {
        setTray('<div class="opts' + (s.mols ? ' mols' : s.opts.every(function (o) { return String(o).length <= 12; }) ? ' two' : '') + '">' + s.opts.map(function (o, i) { return '<button class="op" data-i="' + i + '">' + optHTML(o, s) + '</button>'; }).join('') + '</div>');
        tray.onclick = function (e) {
          var bt = e.target.closest('[data-i]'); if (!bt) return;
          tray.onclick = null;
          var i = +bt.getAttribute('data-i'), ok = i === s.a;
          $$('.op', tray).forEach(function (x, k) { x.disabled = true; if (k === s.a) x.classList.add('right'); });
          if (!ok) bt.classList.add('wrong');
          if (!s.pre) { if (ok) hit(bt); else miss(bt); } else Y.se('tap');
          setTimeout(function () { setTray(''); me(s.mols ? esc(Y.MOLS[s.opts[i]].n) : fmt(s.opts[i])); res(i); }, ok ? 450 : 800);
        };
      });
    }).then(function (i) {
      alive(r);
      var ok = i === s.a, ng = s.ng && (typeof s.ng === 'string' ? s.ng : s.ng[i]);
      var ans = s.mols ? Y.MOLS[s.opts[s.a]].n : s.opts[s.a];
      var p;
      if (s.pre) p = say(ok ? (s.ok || 'いい読みだね！') : (ng || 'じつは…'), ok ? 'happy' : 'think');
      else if (ok) p = say(Y.pick(PRAISE) + (s.ok ? '\n' + s.ok : ''), r.combo >= 3 ? 'wow' : 'happy');
      else p = say((ng ? ng + '\n' : 'おしい！ ') + '正解は「' + ans + '」。', 'oops');
      return p.then(function () { if (s.why && (!ok || s.pre)) return say(s.why); }).then(afterStep);
    });
  }

  /* ---------- 分子を見せる ---------- */
  function show(s) {
    var m = Y.MOLS[s.show];
    var d = row('card', '<div class="molcard"><div class="mc-host"></div><p><b>' + esc(m.n) + '</b> <span>' + esc(m.f) + '</span></p>' + (s.cap ? '<small>' + fmt(s.cap) + '</small>' : '') + '</div>', 'c');
    var v = Y.Mol.view(d.querySelector('.mc-host')), snap = Y.Mol.clone(m.s);
    snap.glow = s.hl || [];   /* 注目してほしい原子を光らせる */
    v.load(snap); v.lit(!m.bad); if (m.bad) v.fizzle();
    Y.se('whoosh');
    return wait(900);
  }

  /* ---------- 錬成 ---------- */
  function build(s) {
    var r = run, pz = s.build, need = pz.need || pz.answers.length;
    var d = row('card', '<div class="bcard"><p class="b-mis">⬡ ' + fmt(s.mission) + '</p><div class="b-host"></div><p class="b-msg"></p><div class="b-got"></div></div>', 'c');
    var msg = d.querySelector('.b-msg'), got = d.querySelector('.b-got'), made = [];
    /* 小さい画面でも魔法陣と素材が同時に見えるよう、カードの頭を画面の上にそろえる */
    setTimeout(function () { var lg = $('#log'); lg.scrollTo({ top: d.offsetTop - 8, behavior: Y.RM ? 'auto' : 'smooth' }); }, 350);
    /* 作った形の棚：作った形は構造式で、まだの所は「？」 */
    function prog() {
      got.innerHTML = '<p class="shelf-t">作った形 ' + made.length + ' / ' + need + '</p><div class="shelf">' + made.map(function (a) {
        return '<figure>' + Y.Mol.pic(a.set, { num: !!pz.appraise }) + '<figcaption>' + esc(a.name) + '</figcaption></figure>';
      }).join('') + new Array(need - made.length + 1).join('<figure class="q"><span>？</span></figure>') + '</div>';
    }
    prog();
    setTray('');
    return new Promise(function (res) {
      var names = [];
      var B = Y.Build(d.querySelector('.b-host'), pz, {
        found: function (a, n) {
          names.push(a.name); made.push(a);
          if (window.FX) FX.slam(esc(a.name), 'clear', '錬成、発動！');
          Y.chg(msg);
          msg.innerHTML = '<b class="ok">錬成成功！ ' + esc(a.name) + '</b>' + (a.note ? '<br><small>' + fmt(a.note) + '</small>' : '');
          Y.se('levelUp'); if (window.FX) { var c = FX.at(B.el); FX.burst(c.x, c.y, { pal: 'gold', n: 50, ring: true }); }
          Y.Voice.say((a.yomi || a.name) + '、れんせい！', { rate: 1, pitch: 0.8 });
          gain(15, B.el);
          prog();
          if (n >= need) { B.lock(true); setTimeout(function () { res(names); }, 1600); }
          else setTimeout(function () { B.clear(); }, 1500);
        },
        dup: function (a) {
          Y.chg(msg);
          msg.innerHTML = '<b class="ng">それは「' + esc(a.name) + '」。さっきと同じ形だ！</b><br><small>' + fmt(pz.dupMsg || '曲げても、ひっくり返しても、つながり方が同じなら同じ物質') + '</small>';
          Y.se('wrong'); if (window.FX) FX.shake(B.el);
        },
        bad: function (m) { Y.chg(msg); msg.innerHTML = '<b class="ng">' + fmt(m) + '</b>'; Y.se('wrong'); },
        change: function () { if (msg.textContent.trim()) msg.innerHTML = ''; }
      });
      run.onAbort = function () { res([]); };
    }).then(function () { alive(r); setTray(''); });
  }

  /* ---------- 組み合わせ演習（マッチング） ----------
   *  1 回 5 組くらい。左を選んで右を選ぶ（逆でもよい）。まちがえた組は、その回の最後に「おさらい」でもう一度出す
   *  ＝抜き出しの問題ではなく、全部の組を一度は自分で合わせる */
  function match(s) {
    var r = run, M = s.match, rounds = M.rounds.slice(), t0 = Date.now(), misses = 0, ri = 0, total = rounds.length;
    var d = row('card', '<div class="mcard"><p class="m-t">⚔ ' + fmt(M.title) + '</p><p class="m-st"></p><div class="m-grid"></div><p class="m-msg">　</p></div>', 'c');
    var grid = d.querySelector('.m-grid'), st = d.querySelector('.m-st'), mm = d.querySelector('.m-msg');
    setTray('');
    function rhtml(x) { return typeof x === 'object' && x.pic ? Y.Mol.pic(x.pic) : fmt(String(x)); }
    return new Promise(function (res) {
      function round(pairs, review) {
        var missed = [], left = pairs.length, selL = null, selR = null;
        st.innerHTML = (review ? '🔁 おさらい' : '第 ' + (ri + 1) + ' / ' + total + ' 陣') + '　<span class="m-time"></span>';
        var L = Y.shuffle(pairs.map(function (p, i) { return i; })), R = Y.shuffle(pairs.map(function (p, i) { return i; }));
        grid.innerHTML = '<div class="m-col">' + L.map(function (i) { return '<button class="m-it" data-s="l" data-i="' + i + '">' + fmt(String(pairs[i][0])) + '</button>'; }).join('') + '</div>' +
          '<div class="m-col">' + R.map(function (i) { return '<button class="m-it' + (typeof pairs[i][1] === 'object' ? ' pic' : '') + '" data-s="r" data-i="' + i + '">' + rhtml(pairs[i][1]) + '</button>'; }).join('') + '</div>';
        Y.glossify(grid, {});
        var tick = setInterval(function () { var tm = d.querySelector('.m-time'); if (tm) tm.textContent = '⏱ ' + ((Date.now() - t0) / 1000).toFixed(1) + ' 秒'; }, 100);
        grid.onclick = function (e) {
          var b = e.target.closest('.m-it'); if (!b || b.disabled) return;
          var side = b.getAttribute('data-s');
          Y.$$('.m-it[data-s="' + side + '"]', grid).forEach(function (x) { x.classList.toggle('on', x === b); });
          if (side === 'l') selL = b; else selR = b;
          Y.se('tap');
          if (!selL || !selR) return;
          var a = selL, c = selR; selL = selR = null;
          a.classList.remove('on'); c.classList.remove('on');
          if (a.getAttribute('data-i') === c.getAttribute('data-i')) {
            a.disabled = c.disabled = true; a.classList.add('ok'); c.classList.add('ok');
            Y.se('correct', pairs.length - left + 1);
            if (window.FX) { var p = FX.at(c); FX.burst(p.x, p.y, { pal: 'gold', n: 14 }); }
            mm.innerHTML = '<b class="ok">' + fmt(String(pairs[+a.getAttribute('data-i')][0])) + '</b>';
            if (--left === 0) {
              clearInterval(tick); gain(review ? 4 : 8, d);
              setTimeout(function () {
                if (missed.length) {   /* まちがえた組を、もう一度（1 組だけなら、もう 1 組まぜて選ばせる） */
                  var again = missed.map(function (i) { return pairs[i]; });
                  if (again.length === 1) again.push(pairs.filter(function (p) { return p !== again[0]; })[0]);
                  round(again, true);
                } else if (++ri < total) round(rounds[ri]);
                else finish();
              }, 650);
            }
          } else {
            misses++; Y.se('wrong');
            [a, c].forEach(function (x) { x.classList.add('ng'); setTimeout(function () { x.classList.remove('ng'); }, 450); });
            var i = +a.getAttribute('data-i');
            if (missed.indexOf(i) < 0) missed.push(i);
            mm.innerHTML = '<b class="ng">ちがう組み合わせ</b>　「' + fmt(String(pairs[i][0])) + '」の相手は…？';
          }
        };
      }
      function finish() {
        var sec = ((Date.now() - t0) / 1000).toFixed(1);
        grid.onclick = null;
        grid.innerHTML = '';
        st.innerHTML = '';
        mm.innerHTML = '<b class="ok">全部そろった！</b>　⏱ ' + sec + ' 秒・まちがい ' + misses + ' 回';
        if (window.FX) FX.slam('COMPLETE!', 'clear', '⏱ ' + sec + ' 秒');
        Y.se('levelUp');
        setTimeout(res, 1100);
      }
      round(rounds[0]);
    }).then(function () { alive(r); });
  }

  /* ---------- 詠唱の儀式 ---------- */
  function cast(s) {
    var r = run, c = s.cast;
    var spec = { goal: c.goal, pool: c.pool, reagents: c.reagents, conds: c.conds, mission: s.mission, auto: c.auto };
    /* 前の話を読みきってから、自分で押して儀式を開く（勝手に開くと読む時間が足りない） */
    return new Promise(function (go) {
      setTray('<button class="btn fire go-rt">⬡ 魔法陣へ</button>');
      tray.onclick = function (e) { if (e.target.closest('.go-rt')) { tray.onclick = null; setTray(''); Y.Voice.unlock(); go(); } };
    }).then(function () { alive(r); return Y.Ritual.run(spec); }).then(function (res) {
      alive(r);
      if (!res.tries) gain(20); else gain(8);
      var sp = Y.SPELLS[c.goal];
      row('card', '<div class="spcard" data-attr="' + sp.attr + '"><span>' + Y.ATTR[sp.attr].icon + '</span><b>' + esc(sp.name) + '</b><small>' + esc(sp.scroll.eq) + '</small><button class="link" data-scroll="' + c.goal + '">📜 スクロール</button></div>', 'c');
      if (Y.Bgm) Y.Bgm.stop();   /* 学習中は BGM なし（キメの場面だけで鳴らす） */
    });
  }

  /* ---------- Tips ---------- */
  /* Tips のカード（レッスンと Tips ノートで共通）。fig があれば、分子の絵で図解する */
  Y.tipHTML = function (id, tag) {
    var t = Y.TIPS[id];
    var fig = t.fig ? '<div class="tfig">' + t.fig.map(function (f) {
      var m = Y.MOLS[f.m];
      return '<figure>' + Y.Mol.mini(m.s, 0, { hl: f.hl }) + '<figcaption><b>' + esc(m.n) + ' ' + esc(m.f) + '</b>' + fmt(f.cap) + '</figcaption></figure>';
    }).join('') + '</div>' : '';
    return '<div class="tipcard">' + (tag ? '<span class="tc-tag">' + tag + '</span>' : '') + '<b>' + fmt(t.t) + '</b><p>' + fmt(t.b) + '</p>' + fig +
      (t.why ? '<details><summary>🤔 なぜ？</summary><p>' + fmt(t.why) + '</p></details>' : '') + '</div>';
  };
  function tip(s) {
    var first = !Y.S.tips[s.tip];
    Y.S.tips[s.tip] = Y.S.tips[s.tip] || Date.now(); Y.save();
    var d = row('card', Y.tipHTML(s.tip, '💡 Tips' + (first ? ' GET!' : '')), 'c');
    Y.glossify(d, {});   /* Tips は読み返す物なので、前に出た言葉にもバルーンをつける */
    Y.se('coin');
    if (window.FX) { var c = FX.at(d); FX.burst(c.x, c.y, { pal: 'gold', n: 24 }); }
    return reply(['おぼえた！']);
  }

  /* ---------- 進行 ---------- */
  function play(steps) {
    var p = Promise.resolve();
    steps.forEach(function (s) {
      p = p.then(function () {
        alive(run);
        if (typeof s === 'string') return say(s);
        if (s.t) return say(s.t, s.face);
        if (s.story) return story(s.story);
        if (s.reply) return reply(s.reply);
        if (s.ask) return ask(s);
        if (s.show) return show(s);
        if (s.pic) { row('card', '<div class="piccard">' + (s.cap ? '<b>' + fmt(s.cap) + '</b>' : '') + Y.Mol.pic(s.pic) + '</div>', 'c'); return wait(700); }
        if (s.build) return build(s);
        if (s.cast) return cast(s);
        if (s.tip) return tip(s);
        if (s.match) return match(s);
        if (s.slam) { if (window.FX) FX.slam(s.slam, s.cls || ''); Y.se('crit'); return wait(1000); }
        throw new Error('unknown step ' + JSON.stringify(s));
      });
    });
    return p;
  }

  Y.Talk = {
    run: function (L) {
      log = $('#log'); tray = $('#tray');
      log.innerHTML = ''; setTray('');
      var r = run = { L: L, used: {}, ok: 0, total: 0, miss: 0, combo: 0, exp: 0, face: 'normal' };
      $('#tTitle').textContent = L.title; $('#tSub').textContent = L.sub || '';
      $('#tMp').textContent = '0';
      setFace('normal');
      if (Y.Bgm) Y.Bgm.stop();   /* 学習中は BGM なし（キメの場面だけで鳴らす） */
      return play(L.steps).then(function () { return { ok: r.ok, total: r.total, miss: r.miss, exp: r.exp }; });
    },
    abort: function () { if (run) { run.dead = true; if (run.skip) run.skip(); if (run.onAbort) run.onAbort(); } run = null; Y.Ritual.close(); },
    tapSkip: function () { if (run && run.skip) run.skip(); }
  };
  Y.ABORT = ABORT;
  document.addEventListener('click', function (e) {
    var sc = e.target.closest && e.target.closest('[data-scroll]');
    if (sc) { Y.showScroll(sc.getAttribute('data-scroll')); }
  });
})();
