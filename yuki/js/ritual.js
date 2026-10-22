/* =========================================================
 * yuki/ritual.js — 詠唱の儀式（呪文カードを選んで発動 → 詠唱と魔法陣が連動）
 *
 *  Y.Ritual.run(spec) → Promise<{ ok, tries }>
 *   spec = {
 *     goal: 'dehydration170',            ねらいの呪文
 *     pool: ['dehydration170', 'dehydration130'],  選び方しだいで発動する呪文（ねらい以外は「暴発」）
 *     reagents: ['H2SO4', 'H2O'], conds: ['t170', 't130'],  並べるカード
 *     mission: '…',                      ミッション（何をすれば合格か）
 *     auto: true                         カードを選ばず、すぐ詠唱する（先生のお手本・ボスのとどめ）
 *     onBoss: fn                         とどめのとき、最後の行で呼ぶ（ボスを消す演出）
 *   }
 *  詠唱の長さは呪文書の段階（Y.S.spells[id].stage）で変わる：0 全部 → 1 key の行だけ → 2 最後の行だけ → 3 無詠唱
 * ========================================================= */
(function () {
  'use strict';
  var Y = window.Y, $ = Y.$, esc = Y.esc;

  function rec(id) { return Y.S.spells[id] || { n: 0, stage: 0, last: 0 }; }
  /* しばらく使わないと、詠唱を忘れて段階が下がる（3日ごとに1段） */
  function stageOf(id) {
    var r = rec(id); if (!r.n) return 0;
    var days = (Date.now() - (r.last || 0)) / 864e5;
    return Math.max(0, (r.stage || 0) - Math.floor(days / 3));
  }
  function addCast(id) {
    var r = rec(id), st = stageOf(id);
    r.n = (r.n || 0) + 1;
    r.stage = Math.min(3, st + (r.n >= 2 && r.n % 2 === 0 ? 1 : 0));
    r.last = Date.now();
    Y.S.spells[id] = r; Y.save();
    return r;
  }
  var STAGE = ['完全詠唱', '詠唱短縮', '詠唱破棄', '無詠唱'];

  function linesFor(sp, st) {
    var L = sp.lines, last = L.length - 1;
    return L.map(function (ln, i) {
      var show = st === 0 || (st === 1 && (ln.key || i === last)) || (st === 2 && i === last);
      return show;
    });
  }
  /* 全部の行のあとの形まで入れて、魔法陣の大きさを決める（途中で大きさが変わらないように） */
  function boxOf(sp) {
    var s = Y.Mol.applyOps(Y.MOLS[sp.from].s, sp.start), b = Y.Mol.bbox(s);
    sp.lines.forEach(function (ln) { s = Y.Mol.applyOps(s, ln.ops); b = Y.Mol.union(b, Y.Mol.bbox(s)); });
    return b;
  }

  var R = Y.Ritual = { stageOf: stageOf, STAGE: STAGE, rec: rec };
  var el, view, busy = false, skip = false;

  function cardHTML(id, kind) {
    var c = Y.CARDS[id];
    return '<button class="cd cd-' + kind + '" data-c="' + id + '" data-k="' + kind + '"><span class="cd-i">' + c.icon + '</span><b>' + esc(c.t) + '</b>' + (c.f ? '<small>' + esc(c.f) + '</small>' : '') + '</button>';
  }

  /* 1つの呪文を詠唱する（画面はもう開いている） */
  function chant(sp, id, opt) {
    opt = opt || {};
    var A = Y.ATTR[sp.attr], st = opt.full ? 0 : stageOf(id), show = linesFor(sp, st);
    var box = el.querySelector('.rt-chant');
    box.innerHTML = st > 0 ? '<p class="rt-stage">' + STAGE[st] + '</p>' : '';
    el.setAttribute('data-attr', sp.attr);
    view.attr(sp.attr);
    view.load(Y.Mol.applyOps(Y.MOLS[sp.from].s, sp.start), boxOf(sp));
    view.lit(true);
    if (Y.Bgm) Y.Bgm.play(A.song, 0);
    Y.se('whoosh');
    skip = false;
    var p = Y.sleep(350), last = sp.lines.length - 1;
    sp.lines.forEach(function (ln, i) {
      p = p.then(function () {
        if (i === last) {
          /* 最後の行：ため → ドーン */
          var cl = (Y.Bgm && !skip) ? Y.Bgm.climax() : Y.sleep(skip ? 0 : 450);
          el.classList.add('charge');
          return cl.then(function () {
            el.classList.remove('charge');
            var d = document.createElement('p');
            d.className = 'rt-ln final';
            /* 「顕現せよ——○○！」は2行に分けて、名前を大きく（長い名前が途中で折り返さないように） */
            var parts = ln.t.split('——');
            d.innerHTML = parts.length > 1 ? '<small>' + esc(parts[0]) + '</small>' + esc(parts[1]) : esc(ln.t);
            box.appendChild(d);
            if (window.FX) { FX.flash(getComputedStyle(el).getPropertyValue('--ac') || '#fff'); FX.shake(el, true); var c = FX.at(view.el); FX.burst(c.x, c.y, { pal: 'gold', n: 60, sp: 11, ring: true }); }
            Y.se('crit');
            if (opt.onBoss) opt.onBoss();
            var v = (show[i] && !skip) ? Y.Voice.say(ln.y, { rate: 0.95, pitch: 0.75 }) : Y.sleep(300);
            return Promise.all([v, view.apply(ln.ops, skip ? 0 : 700)]);
          });
        }
        if (!show[i] || skip) return view.apply(ln.ops, skip ? 0 : 260);
        var d = document.createElement('p');
        d.className = 'rt-ln'; d.innerHTML = esc(ln.t);
        box.appendChild(d);
        if (Y.Bgm) Y.Bgm.level(Math.min(2, i));
        Y.se('tap');
        return Promise.all([Y.Voice.say(ln.y), view.apply(ln.ops, 750)]);
      });
    });
    if (st === 3) p = p.then(function () { if (window.FX) FX.slam('無詠唱', 'mute'); });
    return p.then(function () { view.lit(true); });
  }

  function open(spec) {
    el = $('#ritual');
    el.hidden = false;
    el.innerHTML = '<header class="rt-head"><span class="rt-attr"></span><p class="rt-mis">' + Y.fmt(spec.mission || '') + '</p><button class="rt-skip" aria-label="早送り">⏩</button></header>' +
      '<div class="rt-circle"></div><div class="rt-chant"></div><div class="rt-tray"></div>';
    view = Y.Mol.view(el.querySelector('.rt-circle'));
    el.querySelector('.rt-skip').onclick = function () { skip = true; Y.Voice.stop(); };
    document.body.classList.add('in-ritual');
  }
  function close() {
    Y.Voice.stop();
    if (Y.Bgm && !document.body.classList.contains('in-battle')) Y.Bgm.stop();   /* 儀式が終わったら曲も終わり（ボス戦の中ならボスの曲にまかせる） */
    if (el) { el.hidden = true; el.innerHTML = ''; }
    document.body.classList.remove('in-ritual');
  }
  R.close = close;

  R.run = function (spec) {
    var goal = Y.SPELLS[spec.goal], pool = spec.pool || [spec.goal], tries = 0, lastFz = '';
    open(spec);
    var base = Y.MOLS[goal.from];
    function setHead(sp) {
      var A = Y.ATTR[sp ? sp.attr : goal.attr];
      el.querySelector('.rt-attr').innerHTML = (sp ? '<i>' + A.icon + '</i>' + esc(A.n) + '属性・' + esc(A.type) : '<i>⬡</i>素材：' + esc(base.n));
    }
    function reset() {
      el.classList.remove('fin');
      el.removeAttribute('data-attr'); view.attr('');
      view.load(base.s); view.lit(false);
      /* 不発のときの ひとこと・ヒントは、選び直している間も残しておく */
      el.querySelector('.rt-chant').innerHTML = '<p class="rt-src">' + esc(base.n) + ' <small>' + esc(base.f) + '</small></p>' + lastFz;
      setHead(null);
    }
    return new Promise(function (resolve) {
      function finish(sp, id) {
        el.classList.add('fin');   /* 結果を出すときは、詠唱の途中の行をたたむ（小さい画面でもボタンが見えるように） */
        var r = addCast(id), first = r.n === 1;
        var tray = el.querySelector('.rt-tray');
        tray.innerHTML = '<div class="rt-done"><p class="rt-prod"><small>顕現</small><b>' + esc(sp.product) + '</b><span>' + esc(sp.pf) + '</span></p>' +
          (first ? '<p class="rt-get">📜 魔法のスクロール「' + esc(sp.name) + '」を手に入れた！</p>' : '<p class="rt-get">' + STAGE[stageOf(id)] + (r.stage > 0 ? '（使うほど詠唱が短くなる）' : '') + '</p>') +
          '<div class="rt-btns"><button class="btn sub" data-a="scroll">📜 スクロールを読む</button><button class="btn" data-a="next">つづける ▶</button></div></div>';
        if (first && window.FX) FX.confetti(70, 'gold');
        tray.onclick = function (e) {
          var b = e.target.closest('[data-a]'); if (!b) return;
          if (b.getAttribute('data-a') === 'scroll') { Y.showScroll(id); return; }
          tray.onclick = null; close(); resolve({ ok: true, tries: tries });
        };
      }
      function fire(sel) {
        var id = null;
        pool.forEach(function (pid) { var s = Y.SPELLS[pid]; if (s.reagent === sel.reagent && (!spec.conds || !spec.conds.length || s.cond === sel.cond)) id = pid; });
        busy = true;
        el.querySelector('.rt-tray').innerHTML = '';
        if (!id) {   /* 不発 */
          tries++;
          view.fizzle(); Y.se('wrong'); if (window.FX) FX.shake(el);
          var msg = (goal.ng && (goal.ng[sel.reagent] || goal.ng[sel.cond])) || '…何も起きない。魔法陣が反応しない';
          /* 2回目の不発からはヒント：まず試薬、3回目からは条件も */
          var R0 = Y.CARDS[goal.reagent], C0 = Y.CARDS[goal.cond], tip = '';
          if (tries >= 2 && !spec.auto) tip = '💡 試薬は「' + R0.t + '」' + (tries >= 3 && spec.conds && spec.conds.length ? '、条件は「' + C0.t + '」' : '') + '。くわしくは、テトラの話を思い出そう';
          lastFz = '<p class="rt-hint">不発：' + Y.fmt(msg) + '</p>' + (tip ? '<p class="rt-tip">' + Y.esc(tip) + '</p>' : '');
          el.querySelector('.rt-chant').innerHTML = '<p class="rt-fz">不発…</p>' + lastFz;
          return Y.sleep(900).then(function () { busy = false; pick(); });
        }
        var sp = Y.SPELLS[id];
        lastFz = '';
        setHead(sp);
        var pre = id === spec.goal ? Promise.resolve() : (window.FX ? (FX.slam('暴発！？', 'warn'), Y.sleep(900)) : Y.sleep(500));
        return pre.then(function () { return chant(sp, id); }).then(function () {
          busy = false;
          if (id === spec.goal) { finish(sp, id); return; }
          /* ねらいとちがう呪文が出た（でも、化学としては正しい反応） */
          tries++;
          addCast(id);
          var tray = el.querySelector('.rt-tray');
          el.classList.add('fin');
          tray.innerHTML = '<div class="rt-done"><p class="rt-prod warn"><small>できたのは…</small><b>' + esc(sp.product) + '</b><span>' + esc(sp.pf) + '</span></p>' +
            '<p class="rt-hint">ミッションは「' + esc(goal.product) + '」。条件を見直そう</p><div class="rt-btns"><button class="btn" data-a="again">もう一度 ↺</button></div></div>';
          tray.onclick = function (e) { if (e.target.closest('[data-a]')) { tray.onclick = null; if (Y.Bgm) Y.Bgm.stop(); pick(); } };
        });
      }
      function pick() {
        reset();
        if (spec.auto) { fire({ reagent: goal.reagent, cond: goal.cond }); return; }
        var sel = { reagent: null, cond: null }, needCond = spec.conds && spec.conds.length;
        var tray = el.querySelector('.rt-tray');
        tray.innerHTML = '<p class="rt-lab">試薬</p><div class="cds">' + spec.reagents.map(function (c) { return cardHTML(c, 'reagent'); }).join('') + '</div>' +
          (needCond ? '<p class="rt-lab">条件</p><div class="cds">' + spec.conds.map(function (c) { return cardHTML(c, 'cond'); }).join('') + '</div>' : '') +
          '<button class="btn fire" disabled>⬡ 発動</button>';
        var fb = tray.querySelector('.fire');
        tray.onclick = function (e) {
          if (busy) return;
          var c = e.target.closest('[data-c]');
          if (c) {
            var k = c.getAttribute('data-k');
            sel[k] = c.getAttribute('data-c');
            Y.$$('[data-k="' + k + '"]', tray).forEach(function (x) { x.classList.toggle('on', x === c); });
            Y.se('tap');
            fb.disabled = !(sel.reagent && (!needCond || sel.cond));
            return;
          }
          if (e.target.closest('.fire') && !fb.disabled) { tray.onclick = null; Y.Voice.unlock(); fire(sel); }
        };
      }
      if (Y.Bgm) Y.Bgm.stop();   /* カードを選んでいる間は静かに。詠唱が始まったら属性の曲 */
      pick();
    });
  };

  /* とどめ・お手本：カードを選ばずに詠唱だけ（画面は開いて、終わったら閉じる） */
  R.cast = function (id, opt) {
    opt = opt || {};
    open({ mission: opt.mission || '' });
    var sp = Y.SPELLS[id];
    el.querySelector('.rt-attr').innerHTML = '<i>' + Y.ATTR[sp.attr].icon + '</i>' + esc(Y.ATTR[sp.attr].n) + '属性・' + esc(Y.ATTR[sp.attr].type);
    return chant(sp, id, { full: opt.full, onBoss: opt.onBoss }).then(function () { return Y.sleep(skip ? 200 : 1200); }).then(close);
  };

  /* 魔法のスクロール（くわしい説明） */
  Y.showScroll = function (id) {
    var sp = Y.SPELLS[id], sc = sp.scroll, A = Y.ATTR[sp.attr], st = stageOf(id);
    Y.sheet('<div class="scroll" data-attr="' + sp.attr + '">' +
      '<p class="sc-attr">' + A.icon + ' ' + esc(A.n) + '属性 ・ ' + esc(A.type) + '</p><h3>' + esc(sp.name) + '</h3>' +
      '<p class="sc-eq">' + esc(sc.eq) + '</p><p class="sc-cond">条件：' + esc(sc.cond) + '</p>' +
      '<ul>' + sc.pts.map(function (p) { return '<li>' + Y.fmt(p) + '</li>'; }).join('') + '</ul>' +
      (sc.trap ? '<p class="sc-trap"><b>⚠ ひっかけ注意</b>' + Y.fmt(sc.trap) + '</p>' : '') +
      (sc.why ? '<details class="sc-why"><summary>🤔 なぜ？</summary><p>' + Y.fmt(sc.why) + '</p></details>' : '') +
      '<div class="sc-chant"><b>詠唱</b>' + sp.lines.map(function (l) { return '<p>' + esc(l.t) + '</p>'; }).join('') + '</div>' +
      '<p class="sc-stage">いまの段階：' + STAGE[st] + '</p></div>', 'sh-scroll');
  };
})();
