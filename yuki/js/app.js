/* =========================================================
 * yuki/app.js — 画面の切りかえ（タイトル・地図・レッスン・ボス・結果）と、呪文書・Tips・設定
 * ========================================================= */
(function () {
  'use strict';
  var Y = window.Y, $ = Y.$, $$ = Y.$$, esc = Y.esc, fmt = Y.fmt, S = function () { return Y.S; };

  var TITLES = [[0, '見習い錬成士'], [200, '錬成士'], [500, '上級錬成士'], [900, '炭素の継承者'], [1400, '大錬成士']];
  function title() { var mp = S().mp || 0, t = TITLES[0][1]; TITLES.forEach(function (x) { if (mp >= x[0]) t = x[1]; }); return t; }
  function node(id) { return Y.BOSSES[id] ? { boss: Y.BOSSES[id] } : { L: Y.LESSONS.filter(function (l) { return l.id === id; })[0] }; }
  function done(id) { return !!(S().lessons[id] && S().lessons[id].done); }
  function unlocked(id) { var i = Y.ROUTE.indexOf(id); return i === 0 || done(Y.ROUTE[i - 1]); }
  function nextId() { for (var i = 0; i < Y.ROUTE.length; i++) if (!done(Y.ROUTE[i])) return Y.ROUTE[i]; return null; }
  function chOf(id) { var n = node(id); return n.boss ? n.boss.ch : n.L.ch; }
  function nameOf(id) { var n = node(id); return n.boss ? n.boss.title + '・' + n.boss.name : n.L.title; }

  function screen(id) {
    $$('.screen').forEach(function (s) { s.hidden = s.id !== id; }); window.scrollTo(0, 0);
    /* 文字を読む画面では、背景の城をうすくする */
    document.body.classList.toggle('reading', id === 'talk' || id === 'battle');
  }

  /* ---------- ホーム（地図） ---------- */
  var logoView = null;
  function home() {
    screen('home');
    $('#hMp').textContent = S().mp || 0;
    $('#hTitle').textContent = title();
    if (!logoView) { logoView = Y.Mol.view($('#hCircle')); logoView.load({ atoms: {}, order: [], bonds: [] }); logoView.lit(true); }
    var nx = nextId();
    $('#hCta').innerHTML = nx ? '<small>' + (done(Y.ROUTE[0]) ? 'つづきから' : '冒険をはじめる') + '</small><b>' + esc(Y.CHAPTERS[chOf(nx)].n + '　' + nameOf(nx)) + '</b>' : '<small>序盤クリア！</small><b>復習詠唱で呪文をみがこう</b>';
    $('#hCta').onclick = function () { if (nx) go(nx); else spellbook(); };
    var h = '';
    Y.CHAPTERS.forEach(function (c) {
      h += '<section class="ch ch-' + c.bg + '"><h2><small>' + esc(c.n) + '</small>' + esc(c.t) + '</h2><ol class="path">';
      Y.ROUTE.filter(function (id) { return chOf(id) === c.id; }).forEach(function (id) {
        var n = node(id), rec = S().lessons[id] || {}, st = done(id) ? 'done' : unlocked(id) ? 'open' : 'lock';
        var badge = n.boss ? (rec.rank ? '<i class="rk r-' + rec.rank + '">' + rec.rank + '</i>' : '👹') : (rec.stars ? '<i class="st">' + '★★★'.slice(0, rec.stars) + '<u>' + '★★★'.slice(rec.stars) + '</u></i>' : '');
        h += '<li class="nd ' + st + (n.boss ? ' boss' : '') + (id === nx ? ' now' : '') + '"><button data-go="' + id + '"' + (st === 'lock' ? ' disabled' : '') + '>' +
          '<span class="nd-ic">' + (st === 'lock' ? '🔒' : n.boss ? '⚔' : st === 'done' ? '✦' : '⬡') + '</span>' +
          '<span class="nd-t"><b>' + esc(n.boss ? n.boss.name : n.L.title) + '</b><small>' + esc(n.boss ? n.boss.title + '（ボス）' : n.L.sub) + '</small></span>' + badge + '</button></li>';
      });
      h += '</ol></section>';
    });
    h += '<section class="ch ch-soon"><h2><small>2章</small>酸素の森</h2><p class="soon">アルコール・アルデヒド・カルボン酸・エステル。🔥炎（酸化）・✨光（銀鏡）・💧水（加水分解）の魔法… 準備中</p></section>';
    $('#hMap').innerHTML = h;
    var n2 = $('.nd.now'); if (n2 && !Y.RM) setTimeout(function () { n2.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 300);
    if (Y.Bgm) Y.Bgm.play('village', 3);
  }

  function go(id) {
    if (!unlocked(id)) return;
    var n = node(id);
    Y.Voice.unlock();
    if (n.boss) boss(n.boss); else lesson(n.L);
  }

  /* ---------- レッスン ---------- */
  function lesson(L) {
    screen('talk');
    var tips0 = Object.keys(S().tips).length, sp0 = Object.keys(S().spells).length;
    Y.Talk.run(L).then(function (r) {
      var stars = r.miss === 0 ? 3 : r.miss <= 2 ? 2 : 1;
      var rec = S().lessons[L.id] || {};
      S().lessons[L.id] = { done: true, stars: Math.max(stars, rec.stars || 0) }; Y.save();
      result(L, r, stars, Object.keys(S().tips).length - tips0, Object.keys(S().spells).length - sp0);
    }).catch(function (e) { if (e !== Y.ABORT) { console.error(e); home(); } });
  }
  function result(L, r, stars, nt, ns) {
    screen('done');
    var d = $('#done');
    d.innerHTML = '<div class="rs"><small>' + esc(Y.CHAPTERS[L.ch].n) + '</small><h2>' + esc(L.title) + '<span>クリア！</span></h2>' +
      '<p class="rs-st">' + '★★★'.slice(0, stars) + '<u>' + '★★★'.slice(stars) + '</u></p>' +
      '<ul><li>正解 <b>' + r.ok + ' / ' + r.total + '</b></li><li>魔力 <b>+' + r.mp + ' MP</b></li>' + (nt ? '<li>💡 Tips <b>+' + nt + '</b></li>' : '') + (ns ? '<li>📜 呪文 <b>+' + ns + '</b></li>' : '') + '</ul>' +
      '<p class="rs-ti">称号：<b>' + esc(title()) + '</b></p><button class="btn" id="rsGo">地図へ ▶</button></div>';
    if (Y.Bgm) Y.Bgm.jingle('clear');
    if (window.FX) { FX.confetti(110, 'gold'); FX.slam('CLEAR!', 'clear'); }
    $('#rsGo').onclick = home;
  }

  /* ---------- ボス ---------- */
  function boss(b) {
    screen('battle');
    Y.Battle.run(b).then(function (r) {
      if (r.win) { S().lessons[b.id] = { done: true, rank: best(S().lessons[b.id], r.rank) }; Y.save(); home(); }
      else if (r.retry) boss(b);
      else home();
    });
  }
  function best(rec, r) { var o = 'SAB'; return rec && rec.rank && o.indexOf(rec.rank) < o.indexOf(r) ? rec.rank : r; }

  /* ---------- 呪文書 ---------- */
  function spellbook() {
    var ids = Object.keys(Y.SPELLS);
    var body = Y.sheet('<h3 class="sh-t">📜 呪文書</h3><p class="sh-sub">使うほど詠唱が短くなる（完全詠唱 → 詠唱短縮 → 詠唱破棄 → 無詠唱）。しばらく使わないと、詠唱を忘れていく。</p>' +
      '<div class="book">' + ids.map(function (id) {
        var sp = Y.SPELLS[id], r = Y.Ritual.rec(id), A = Y.ATTR[sp.attr];
        if (!r.n) return '<div class="bk lock"><span>？</span><b>？？？</b><small>まだ覚えていない</small></div>';
        var st = Y.Ritual.stageOf(id), fade = st < (r.stage || 0);
        return '<div class="bk" data-attr="' + sp.attr + '"><span>' + A.icon + '</span><b>' + esc(sp.name) + '</b><small>' + esc(sp.scroll.eq) + '</small>' +
          '<em class="stg s' + st + '">' + Y.Ritual.STAGE[st] + (fade ? '（忘れかけ）' : '') + '</em>' +
          '<div class="bk-b"><button class="btn sub" data-scroll="' + id + '">📜 スクロール</button><button class="btn" data-prac="' + id + '">⬡ 復習詠唱</button></div></div>';
      }).join('') + '</div>');
    body.onclick = function (e) {
      var p = e.target.closest('[data-prac]'); if (!p) return;
      Y.closeSheet(); practice(p.getAttribute('data-prac'));
    };
  }
  /* 復習詠唱：カードを選び直して発動（ねらいの呪文と、ほかのカードを混ぜる） */
  function practice(id) {
    var sp = Y.SPELLS[id];
    var reag = Y.shuffle([sp.reagent].concat(Y.shuffle(Object.keys(Y.CARDS).filter(function (k) { return Y.CARDS[k].k === 'reagent' && k !== sp.reagent; })).slice(0, 2)));
    var conds = Y.shuffle([sp.cond].concat(Y.shuffle(Object.keys(Y.CARDS).filter(function (k) { return Y.CARDS[k].k === 'cond' && k !== sp.cond; })).slice(0, 2)));
    var pool = Object.keys(Y.SPELLS).filter(function (k) { return Y.SPELLS[k].from === sp.from && Y.S.spells[k]; });
    Y.Voice.unlock();
    Y.Ritual.run({ goal: id, pool: pool, reagents: reag, conds: conds, mission: '復習詠唱：**' + esc(sp.product) + '** を作れ（素材：' + esc(Y.MOLS[sp.from].n) + '）' }).then(function () { home(); spellbook(); });
  }

  /* ---------- Tips ノート ---------- */
  function tipsNote() {
    var ids = Object.keys(Y.TIPS).filter(function (k) { return S().tips[k]; });
    Y.sheet('<h3 class="sh-t">💡 Tips ノート</h3><p class="sh-sub">' + ids.length + ' / ' + Object.keys(Y.TIPS).length + ' 個</p>' +
      (ids.length ? ids.map(function (k) {
        var t = Y.TIPS[k];
        return '<div class="tipcard"><b>' + fmt(t.t) + '</b><p>' + fmt(t.b) + '</p>' + (t.why ? '<details><summary>🤔 なぜ？</summary><p>' + fmt(t.why) + '</p></details>' : '') + '</div>';
      }).join('') : '<p class="soon">レッスンで手に入れた Tips が、ここにたまる。</p>'));
  }

  /* ---------- 設定 ---------- */
  function settings() {
    var st = S().settings;
    var b = Y.sheet('<h3 class="sh-t">⚙ 設定</h3><div class="set">' +
      '<label><input type="checkbox" data-k="voice"' + (st.voice !== false ? ' checked' : '') + '> 🗣 詠唱の読み上げ</label>' +
      '<label><input type="checkbox" data-k="bgm"' + (st.bgm !== false ? ' checked' : '') + '> 🎵 BGM</label>' +
      '<label><input type="checkbox" data-k="sfx"' + (st.sfx !== false ? ' checked' : '') + '> 🔔 効果音</label>' +
      '<label class="rng">音量<input type="range" min="0" max="1" step="0.05" value="' + st.vol + '" data-r="vol"></label>' +
      '<label class="rng">詠唱の速さ<input type="range" min="0.7" max="1.3" step="0.05" value="' + st.rate + '" data-r="rate"></label>' +
      '<button class="btn sub" id="stTest">🗣 詠唱をためす</button>' +
      '<p class="note">' + (Y.Voice.available() ? '' : '⚠ この端末では日本語の読み上げが見つからない。文字と演出だけで進む。<br>') +
      '声は機種ごとにちがう。iPhone で音が出ないときは、音量と、横のスイッチ（マナーモード）を確かめてね。</p>' +
      '<button class="link danger" id="stReset">記録をリセット</button>' + (Y.SANDBOX ? '<p class="note">🧪 sandbox（お試し用の保存先）で動いている</p>' : '') + '</div>');
    b.onchange = function (e) {
      var k = e.target.getAttribute('data-k'), r = e.target.getAttribute('data-r');
      if (k) { st[k] = e.target.checked; Y.save(); if (k === 'bgm') { if (st.bgm) Y.Bgm.play('village', 3); else Y.Bgm.stop(); } if (k === 'voice' && !st.voice) Y.Voice.stop(); }
      if (r) { st[r] = +e.target.value; Y.save(); if (r === 'vol') Y.Bgm.setVol(); }
    };
    b.oninput = function (e) { if (e.target.getAttribute('data-r') === 'vol') { st.vol = +e.target.value; Y.Bgm.setVol(); } };
    $('#stTest').onclick = function () { Y.Voice.unlock(); Y.Voice.say('ねつよ、ひゃくななじゅうの、ほむらとなれ'); };
    $('#stReset').onclick = function () { if (confirm('記録（レッスン・呪文・Tips・魔力）をすべて消しますか？')) { Y.reset(); Y.closeSheet(); home(); } };
  }

  /* ---------- はじまり（PRESS START：音と読み上げを使えるようにする最初のタップ） ---------- */
  function boot() {
    $('#start').onclick = function () {
      Y.Voice.unlock();
      if (window.Sfx) Sfx.unlock();
      Y.se('levelUp');
      $('#start').classList.add('go');
      setTimeout(function () { $('#start').hidden = true; home(); }, Y.RM ? 0 : 500);
    };
    $('#hMap').addEventListener('click', function (e) { var b = e.target.closest('[data-go]'); if (b) go(b.getAttribute('data-go')); });
    $('#hBook').onclick = spellbook; $('#hTips').onclick = tipsNote; $('#hSet').onclick = settings;
    $('#tQuit').onclick = function () { if (confirm('レッスンをやめて地図へもどりますか？')) { Y.Talk.abort(); home(); } };
    $('#log').addEventListener('click', function (e) { if (!e.target.closest('button,[data-gl],details,summary,.bld,.b-host')) Y.Talk.tapSkip(); });
    $('#tray').addEventListener('click', function (e) { if (e.target.closest('.wait')) Y.Talk.tapSkip(); });
  }
  boot();
})();
