/* =========================================================
 * yuki/battle.js — ボス戦
 *
 *  Y.Battle.run(boss) → Promise<{ win, rank, exp }>
 *   kind: 'quiz'   問題に答えて攻撃。速く答えるとクリティカル（2倍）、3連続で FEVER（2倍）。まちがえると反撃（ライフ −1）
 *         'build'  時間内に錬成。ちがう形を作るたびに大ダメージ。同じ形を作ると幻影に惑わされて反撃
 *                  split: true なら、ボスは答えの数だけ分身する。それぞれ別の形の魔法陣でしか倒せない（＝別の形を作る必然性）。
 *                  倒した分身の所に、その形の構造式が残る（＝どの形をもう作ったかが見える）
 *   HP を削りきったら、とどめの詠唱（finisher）。ライフ 3、0 で負け
 * ========================================================= */
(function () {
  'use strict';
  var Y = window.Y, $ = Y.$, $$ = Y.$$, esc = Y.esc, fmt = Y.fmt;
  var ATK = { thunder: '⚡ 雷撃！', wind: '🌪 疾風刃！', sand: '🏜 砂塵波！', forge: '⬡ 錬成撃！' };
  var el, st, timer = 0;
  var GHOST = '<svg viewBox="0 0 200 200" class="gh-svg"><path d="M100 24c-36 0-58 30-58 64v84l14-12 14 14 15-14 15 14 15-14 14 14 14-12V88c0-34-22-64-57-64z" fill="#b39bff"/><path d="M64 76q36-26 72 0v26q-36 18-72 0z" fill="#2a1760"/><ellipse cx="82" cy="88" rx="9" ry="6" fill="#7dffcf"/><ellipse cx="118" cy="88" rx="9" ry="6" fill="#7dffcf"/><path d="M86 128q14 10 28 0" stroke="#2a1760" stroke-width="5" fill="none" stroke-linecap="round"/></svg>';

  function hud() {
    $('.bt-hp i', el).style.width = Math.max(0, st.hp / st.max * 100) + '%';
    $('.bt-hp b', el).textContent = Math.max(0, Math.ceil(st.hp)) + ' / ' + st.max;
    $('.bt-life', el).innerHTML = [0, 1, 2].map(function (i) { return i < st.life ? '❤️' : '🖤'; }).join('');
    var cb = $('.bt-combo', el);
    cb.textContent = st.combo >= 2 ? st.combo + ' COMBO' + (st.combo >= 3 ? ' 🔥FEVER' : '') : '';
    el.classList.toggle('fever', st.combo >= 3);
  }
  function bossHit(dmg, crit, label) {
    var b = $('.bt-boss', el);
    st.hp -= dmg;
    b.classList.remove('hurt'); void b.offsetWidth; b.classList.add('hurt');
    if (window.FX) {
      var c = FX.at(b);
      FX.burst(c.x, c.y, { pal: crit ? 'gold' : 'ok', n: crit ? 70 : 36, sp: crit ? 12 : 8, ring: crit });
      FX.floatText(c.x, c.y - 30, '-' + dmg + (crit ? ' CRITICAL!' : ''), crit ? '#ffd23f' : '#fff');
      FX.slam(label + (crit ? '<br>CRITICAL' : ''), crit ? 'crit' : 'atk');
    }
    Y.se(crit ? 'crit' : 'correct', st.combo);
    hud();
  }
  function bossAttack(text) {
    st.life--; st.combo = 0; st.dmgTaken++;
    var b = $('.bt-boss', el);
    b.classList.remove('atk'); void b.offsetWidth; b.classList.add('atk');
    Y.se('wrong');
    if (window.FX) { FX.flash('#ff2b4a'); FX.shake(el, true); }
    $('.bt-say', el).innerHTML = '<b>' + esc(st.boss.name) + '</b>「' + esc(text || Y.pick(st.boss.taunt)) + '」';
    hud();
  }
  function clearTimer() { if (timer) { clearInterval(timer); timer = 0; } }

  /* ---------- 問題で戦う ---------- */
  function quizLoop(resolve) {
    var bank = Y.shuffle(st.boss.qs.map(function (id) { return Y.QS[id]; })), qi = 0;
    function next() {
      if (st.hp <= 0) return finish(true, resolve);
      if (st.life <= 0) return finish(false, resolve);
      if (qi >= bank.length) { bank = Y.shuffle(bank); qi = 0; }
      var q = bank[qi++], order = Y.shuffle(q.opts.map(function (_, i) { return i; }));
      var panel = $('.bt-panel', el), t0 = Date.now(), LIM = q.lim || 15000;
      el.classList.toggle('haspic', !!q.pic);   /* 構造式が出る問題は、ボスを小さくして選択肢まで画面に収める */
      panel.innerHTML = '<div class="bt-time"><i></i></div>' + (q.pic ? '<div class="bt-pic">' + Y.Mol.pic(q.pic) + '</div>' : '') + '<p class="bt-q">' + fmt(q.q) + '</p>' +
        '<div class="opts' + (q.mols ? ' mols' : q.opts.every(function (o) { return String(o).length <= 12; }) ? ' two' : '') + '">' + order.map(function (i) {
          var o = q.opts[i];
          return '<button class="op" data-i="' + i + '">' + (q.mols ? Y.Mol.mini(Y.MOLS[o].s, 110) + '<small>' + esc(Y.MOLS[o].f) + '</small>' : fmt(o)) + '</button>';
        }).join('') + '</div>';
      Y.glossify(panel, {});
      var bar = $('.bt-time i', panel);
      clearTimer();
      timer = setInterval(function () {
        var k = 1 - (Date.now() - t0) / LIM;
        bar.style.width = Math.max(0, k * 100) + '%';
        bar.classList.toggle('low', k < 0.3);
        if (k <= 0) { clearTimer(); answer(-1); }
      }, 100);
      function answer(i) {
        clearTimer(); panel.onclick = null;
        var ok = i === q.a, ms = Date.now() - t0;
        $$('.op', panel).forEach(function (x) { x.disabled = true; if (+x.getAttribute('data-i') === q.a) x.classList.add('right'); else if (+x.getAttribute('data-i') === i) x.classList.add('wrong'); });
        if (ok) {
          st.combo++; st.ok++;
          var crit = ms < (q.crit || 5000), fever = st.combo >= 3;
          var dmg = Math.round(st.boss.dmg * (crit ? 2 : 1) * (fever ? 1.5 : 1));
          bossHit(dmg, crit, ATK[q.attr] || ATK.forge);
          $('.bt-say', el).innerHTML = q.ok ? fmt(q.ok) : '';
          setTimeout(next, 1250);
        } else {
          bossAttack(i < 0 ? '遅い！' : null);
          var ans = q.mols ? Y.MOLS[q.opts[q.a]].n : q.opts[q.a];
          panel.insertAdjacentHTML('beforeend', '<div class="bt-why"><p>正解は「' + fmt(ans) + '」</p>' + (q.why ? '<p>' + fmt(q.why) + '</p>' : '') + '<button class="btn">つづける ▶</button></div>');
          Y.glossify($('.bt-why', panel), {});
          $('.bt-why .btn', panel).onclick = next;
        }
      }
      panel.onclick = function (e) { var b = e.target.closest('[data-i]'); if (b && !b.disabled) answer(+b.getAttribute('data-i')); };
    }
    next();
  }

  /* ---------- 錬成で戦う ---------- */
  function buildLoop(resolve) {
    var pz = st.boss.build, need = pz.answers.length, t0 = Date.now(), LIM = st.boss.lim || 150000;
    var panel = $('.bt-panel', el);
    panel.innerHTML = '<div class="bt-time"><i></i></div><p class="bt-q">' + fmt(st.boss.mission) + '</p><div class="b-host"></div><p class="b-msg"></p>';
    var msg = $('.b-msg', panel), bar = $('.bt-time i', panel);
    var B = Y.Build($('.b-host', panel), pz, {
      found: function (a, n) {
        st.combo++; st.ok++;
        Y.chg(msg); msg.innerHTML = '<b class="ok">' + esc(a.name) + '！</b>';
        if (st.boss.split) ghostDown(n - 1, a);
        Y.Voice.say(a.yomi || a.name, { rate: 1.05, pitch: 0.8 });
        bossHit(Math.ceil(st.max / need), true, '⬡ 錬成撃！<br>' + esc(a.name));
        if (n >= need) { clearTimer(); B.lock(true); setTimeout(function () { finish(true, resolve); }, 1300); }
        else setTimeout(function () { B.clear(); }, 1100);
      },
      dup: function (a) {
        bossAttack(st.boss.split ? 'ふふふ…その形の魔法なら、もう倒した分身にしか当たらないわ' : 'ふふふ…それは「' + a.name + '」。さっきと同じ形よ');
        if (st.boss.split) { var gi = B.found().indexOf(a), g = $('.gh[data-g="' + gi + '"]', el); if (g) { g.classList.remove('dup'); void g.offsetWidth; g.classList.add('dup'); } }
        Y.chg(msg); msg.innerHTML = '<b class="ng">同じ形に惑わされた！</b><br><small>曲げても、ひっくり返しても、つながり方が同じなら同じ物質</small>';
        if (st.life <= 0) { clearTimer(); B.lock(true); setTimeout(function () { finish(false, resolve); }, 1200); }
        else setTimeout(function () { B.clear(); }, 1400);
      },
      bad: function (m) { Y.chg(msg); msg.innerHTML = '<b class="ng">' + fmt(m) + '</b>'; Y.se('wrong'); },
      /* ボス戦のヒントは、残り時間と引きかえ */
      hint: function () { t0 -= 15000; if (window.FX) FX.floatText(innerWidth / 2, 120, '−15 秒', '#ff6b7a'); },
      change: function () {}
    });
    timer = setInterval(function () {
      var k = 1 - (Date.now() - t0) / LIM;
      bar.style.width = Math.max(0, k * 100) + '%'; bar.classList.toggle('low', k < 0.25);
      if (k <= 0) { clearTimer(); B.lock(true); st.life = 0; hud(); finish(false, resolve); }
    }, 200);
  }

  /* 分身を倒す：魔法陣から光が飛び、分身が消えて、そこに弱点の形（作った構造式）が残る */
  function ghostDown(i, a) {
    var g = $('.gh[data-g="' + i + '"]', el); if (!g) return;
    g.classList.add('hit');
    if (window.FX) { var p = FX.at(g); FX.burst(p.x, p.y, { pal: 'rel', n: 50, sp: 10, ring: true }); FX.flash('#b39bff'); }
    setTimeout(function () {
      g.classList.add('down');
      $('.gh-lab', g).innerHTML = '<small>弱点</small>' + Y.Mol.pic(a.set, { num: true }) + '<b>' + esc(a.name) + '</b>';
    }, 450);
  }

  function finish(win, resolve) {
    clearTimer();
    var b = st.boss;
    if (!win) {
      var ms = Y.Bgm ? Y.Bgm.jingle('lose') : 0;
      $('.bt-panel', el).innerHTML = '<div class="bt-end lose"><b>敗北…</b><p>' + esc(b.name) + 'は、まだ立ちはだかっている。<br>レッスンをふり返って、もう一度挑もう。</p><div class="rt-btns"><button class="btn sub" data-a="quit">地図へもどる</button><button class="btn" data-a="retry">再挑戦 ↺</button></div></div>';
      $('.bt-panel', el).onclick = function (e) {
        var a = e.target.closest('[data-a]'); if (!a) return;
        resolve({ win: false, retry: a.getAttribute('data-a') === 'retry' });
      };
      return;
    }
    /* とどめ */
    var p = Promise.resolve();
    if (b.finisher) {
      $('.bt-say', el).innerHTML = '<b>テトラ</b>「いまだ！ とどめの詠唱を！」';
      /* とどめも、自分で押してから（セリフを読む時間をとる） */
      $('.bt-panel', el).innerHTML = '<div class="bt-rule"><b>とどめの詠唱</b><button class="btn">⚡ 詠唱をはじめる</button></div>';
      p = new Promise(function (go) { $('.bt-rule .btn', el).onclick = function () { Y.Voice.unlock(); go(); }; }).then(function () {
        return Y.Ritual.cast(b.finisher, { full: true, mission: 'とどめの詠唱', onBoss: function () { $('.bt-boss', el).classList.add('gone'); } });
      });
    } else if (b.finYomi) {
      p = Y.Voice.say(b.finYomi, { rate: 1, pitch: 0.75 }).then(function () { if (window.FX) FX.slam(b.finText || '撃破！', 'crit'); $('.bt-boss', el).classList.add('gone'); return Y.sleep(900); });
    }
    p.then(function () {
      $('.bt-boss', el).classList.add('gone');
      var rank = st.dmgTaken === 0 ? 'S' : st.dmgTaken === 1 ? 'A' : 'B';
      var mp = { S: 120, A: 90, B: 60 }[rank], up = Y.addExp(mp);
      if (up) setTimeout(function () { Y.levelUp(up); }, 1800);
      if (Y.Bgm) Y.Bgm.jingle('victory');
      if (window.FX) FX.confetti(150, 'rainbow');
      $('.bt-say', el).innerHTML = '';
      $('.bt-panel', el).innerHTML = '<div class="bt-end"><small>' + esc(b.name) + ' を倒した！</small><b class="rank r-' + rank + '">' + rank + '</b><p>正解 ' + st.ok + ' ・ 受けたダメージ ' + st.dmgTaken + '<br>経験値 +' + mp + ' EXP</p>' +
        (b.reward ? '<p class="rt-get">' + fmt(b.reward) + '</p>' : '') + '<button class="btn" data-a="ok">地図へ ▶</button></div>';
      $('.bt-panel', el).onclick = function (e) { if (e.target.closest('[data-a]')) resolve({ win: true, rank: rank, exp: mp }); };
    });
  }

  Y.Battle = {
    run: function (boss) {
      el = $('#battle');
      st = { boss: boss, hp: boss.hp, max: boss.hp, life: 3, combo: 0, ok: 0, dmgTaken: 0 };
      el.className = 'screen boss-' + boss.id;
      el.innerHTML = '<header class="bt-head"><button class="bt-quit" aria-label="にげる">✕</button><div class="bt-name"><small>' + esc(boss.title) + '</small><b>' + esc(boss.name) + '</b></div>' +
        '<div class="bt-hp"><i></i><b></b></div></header>' +
        '<div class="bt-stage"><div class="bt-boss">' + (boss.split ? '<div class="bt-split">' + boss.build.answers.map(function (a, i) {
          return '<div class="gh" data-g="' + i + '"><div class="gh-art">' + GHOST + '</div><p class="gh-lab">分身 ' + (i + 1) + '<br><small>弱点：？</small></p></div>';
        }).join('') + '</div>' : boss.art) + '</div><p class="bt-say"></p></div>' +
        '<div class="bt-me"><span class="bt-life"></span><span class="bt-combo"></span></div>' +
        '<div class="bt-panel"></div>';
      hud();
      if (Y.Bgm) Y.Bgm.play('boss', 3);
      if (window.FX) FX.slam(esc(boss.name), 'boss', esc(boss.title));
      $('.bt-say', el).innerHTML = '<b>' + esc(boss.name) + '</b>「' + esc(boss.intro) + '」';
      var panel = $('.bt-panel', el);
      panel.innerHTML = '<div class="bt-rule"><b>ルール</b>' + fmt(boss.rule) + '<button class="btn">⚔ 戦う！</button></div>';
      return new Promise(function (resolve) {
        $('.bt-quit', el).onclick = function () { if (confirm('にげますか？（記録は残りません）')) { clearTimer(); Y.Ritual.close(); resolve({ win: false, quit: true }); } };
        $('.bt-rule .btn', panel).onclick = function () {
          Y.Voice.unlock(); Y.se('levelUp');
          if (boss.kind === 'build') buildLoop(resolve); else quizLoop(resolve);
        };
      }).then(function (r) { clearTimer(); return r; });
    }
  };
})();
