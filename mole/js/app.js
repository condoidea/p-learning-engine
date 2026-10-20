/* =========================================================
 * mole/app.js — ホーム（ラボ）・結晶・粒メーター・結果・研究ノート
 *
 *  ごほうび（XP・バッジのかわりに）
 *   ・あつめた粒：正解するたびに ×1.4 倍…とふえる。1 mol（6.0×10^23 個）がゴール。
 *     途中で「世界の人口」「水1滴の分子」などを超えると、スケール図鑑に登録される
 *   ・結晶：レッスンをクリアすると1つできる。時間がたつとくもる → 「みがく」（復習）で輝きが増す
 *  追加レッスン（溶液の濃度）は、基本の7レッスンをぜんぶクリアすると現れる
 * ========================================================= */
(function () {
  'use strict';
  var $ = M.$, $$ = M.$$, fmt = M.fmt, esc = M.esc, S = M.S, FX = M.FX;
  var DAY = 864e5;
  var INT = [1, 2, 4, 7, 14, 30];          // みがいて lv が上がったあと、次にくもるまでの日数
  var BASIC = M.LESSONS, EXTRA = M.EXTRA || [];
  BASIC.forEach(function (L, i) { L.no = String(i + 1); L.idx = i; });
  EXTRA.forEach(function (L, i) { L.no = '発展' + (i + 1); L.idx = BASIC.length + i; L.extra = true; });
  var ALL = BASIC.concat(EXTRA);
  function byId(id) { return ALL.filter(function (L) { return L.id === id; })[0]; }
  function done(L) { return !!(S.lessons[L.id] && S.lessons[L.id].done); }
  function basicAll() { return BASIC.every(done); }
  function visible() { return basicAll() ? ALL : BASIC; }
  function unlocked(L) { var list = L.extra ? EXTRA : BASIC, i = list.indexOf(L); return (L.extra ? basicAll() : true) && (i === 0 || done(list[i - 1])); }
  function nextLesson() { return visible().filter(function (L) { return !done(L) && unlocked(L); })[0] || null; }
  function cry(L) { return S.crystals[L.id] || null; }
  function isDue(L) { var c = cry(L); return !!(c && Date.now() >= c.due); }
  function dueList() { return visible().filter(function (L) { return done(L) && isDue(L); }).sort(function (a, b) { return cry(a).due - cry(b).due; }); }

  /* =========================================================
   * 結晶の絵
   * ========================================================= */
  var gid = 0;
  M.crystalSvg = function (L, opt) {
    opt = opt || {};
    var c = L.crystal, id = 'cg' + (++gid), lv = opt.lv || 0;
    var defs = '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c.c1 + '"/><stop offset="1" stop-color="' + c.c2 + '"/></linearGradient></defs>';
    var F = 'url(#' + id + ')', st = ' stroke="#fff" stroke-opacity=".7" stroke-width="1.5" stroke-linejoin="round"';
    function poly(pts, op) { return '<polygon points="' + pts + '" fill="' + F + '"' + st + '/>' + (op ? '<polygon points="' + pts + '" fill="#fff" opacity="' + op + '"/>' : ''); }
    var body;
    switch (c.shape) {
      case 'cube': body = poly('50,22 82,38 50,54 18,38', 0.45) + poly('18,38 50,54 50,88 18,72', 0.1) + poly('82,38 50,54 50,88 82,72', 0); break;
      case 'octa': body = poly('50,10 80,50 50,58', 0.35) + poly('50,10 20,50 50,58', 0.15) + poly('20,50 50,58 50,90', 0) + poly('80,50 50,58 50,90', 0.25); break;
      case 'gem': body = poly('30,30 70,30 84,44 16,44', 0.45) + poly('16,44 84,44 50,90', 0.05) + poly('16,44 38,44 50,90', 0.3) + poly('62,44 84,44 50,90', 0.15); break;
      case 'prism': body = poly('34,16 74,26 66,40 26,30', 0.45) + poly('26,30 66,40 62,86 22,76', 0.1) + poly('66,40 74,26 70,72 62,86', 0); break;
      case 'hex': body = poly('50,8 66,26 34,26', 0.5) + poly('34,26 50,8 50,30', 0.25) + poly('34,26 50,30 50,90 34,84', 0.12) + poly('50,30 66,26 66,84 50,90', 0); break;
      default: /* cluster */
        body = poly('30,30 40,44 40,86 22,86 22,44', 0.15) + poly('30,30 40,44 22,44', 0.5) +
          poly('66,22 78,38 78,88 56,88 56,38', 0.05) + poly('66,22 78,38 56,38', 0.45) +
          poly('48,6 60,24 60,90 38,90 38,24', 0.2) + poly('48,6 60,24 38,24', 0.55);
    }
    var sc = 0.72 + Math.min(5, lv) * 0.056;
    var spark = '';
    if (lv >= 1 && !opt.cloudy) {
      var sp = [[78, 18], [20, 26], [84, 70], [14, 80], [60, 8]].slice(0, Math.min(5, lv + 1));
      sp.forEach(function (p, i) { spark += '<path class="spk" style="animation-delay:' + (i * 0.37) + 's" d="M' + p[0] + ' ' + (p[1] - 6) + ' L' + (p[0] + 1.6) + ' ' + (p[1] - 1.6) + ' L' + (p[0] + 6) + ' ' + p[1] + ' L' + (p[0] + 1.6) + ' ' + (p[1] + 1.6) + ' L' + p[0] + ' ' + (p[1] + 6) + ' L' + (p[0] - 1.6) + ' ' + (p[1] + 1.6) + ' L' + (p[0] - 6) + ' ' + p[1] + ' L' + (p[0] - 1.6) + ' ' + (p[1] - 1.6) + 'z" fill="#fff"/>'; });
    }
    var glow = lv >= 4 && !opt.cloudy ? '<ellipse cx="50" cy="56" rx="40" ry="36" fill="' + c.c2 + '" opacity=".25" class="glow"/>' : '';
    var fog = opt.cloudy ? '<g class="fog"><ellipse cx="38" cy="50" rx="30" ry="16" fill="#e6ecef" opacity=".85"/><ellipse cx="62" cy="64" rx="28" ry="14" fill="#dfe6ea" opacity=".8"/><ellipse cx="50" cy="38" rx="22" ry="10" fill="#eef2f4" opacity=".7"/></g>' : '';
    return '<svg class="crys' + (opt.cloudy ? ' cloudy' : '') + (opt.locked ? ' locked' : '') + '" viewBox="0 0 100 100" aria-hidden="true">' + defs + glow +
      '<ellipse cx="50" cy="92" rx="30" ry="5" fill="#000" opacity=".08"/>' +
      '<g transform="translate(50 92) scale(' + sc.toFixed(3) + ') translate(-50 -92)">' + body + '</g>' + fog + spark + '</svg>';
  };

  /* =========================================================
   * 画面の切りかえ
   * ========================================================= */
  function show(id) {
    $$('.screen').forEach(function (s) { s.hidden = s.id !== id; });
    document.body.setAttribute('data-screen', id);
    window.scrollTo(0, 0);
    M.closePop();
  }
  function sheet(html) {
    $('#sheetBody').innerHTML = html; $('#sheet').hidden = false;
    $('#sheet .sh').scrollTop = 0;
    if (M.G && !M.E2E) M.G.fromTo('#sheet .sh', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.6)' });
  }
  $('#sheet').addEventListener('click', function (e) {
    if (e.target.id === 'sheet' || e.target.closest('.sh-close')) { $('#sheet').hidden = true; M.closePop(); }
  });

  /* =========================================================
   * ホーム
   * ========================================================= */
  function nextMile() { return M.MILES.filter(function (m) { return Math.log10(m.n) > S.L; })[0] || null; }
  function countBig(L) {
    if (L == null) L = S.L;
    if (L >= M.GOAL_L) { var mol = Math.pow(10, L) / 6.0e23; return '<span class="mol">' + (mol < 10 ? mol.toFixed(1) : Math.round(mol)) + ' mol</span>'; }
    return M.countHTML(L) + '<span class="unit">個</span>';
  }
  function home() {
    show('home');
    $('#hAv').innerHTML = M.face(dueList().length ? 'think' : 'happy');
    var nx = nextLesson(), due = dueList(), g;
    if (!Object.keys(S.lessons).length) g = 'はじめまして！ モルモ先生だよ。まずは Lesson 1 から。1回 3〜4分で終わるよ。';
    else if (due.length) g = '結晶が ' + due.length + ' 個くもってるよ。みがくと、また輝くよ！';
    else if (nx) g = 'つぎは Lesson ' + nx.no + '「' + nx.title.replace(/\^(\d+)/g, function (m, d) { return M.sup(d); }) + '」。いっしょにやろう！';
    else g = 'ぜんぶの結晶がピカピカ！ くもったころに、またのぞいてね。';
    $('#hGreet').textContent = g;

    /* 前に見たときより粒がふえていたら、数字がくるくる回ってふえる */
    var from = M._shownL == null ? S.L : M._shownL, bar = $('#hBar');
    M._shownL = S.L;
    function setL(L) { $('#hCount').innerHTML = countBig(L); bar.style.width = Math.min(100, L / M.GOAL_L * 100) + '%'; }
    if (M.G && !M.E2E && S.L - from > 0.001) {
      var o = { v: from }; setL(from);
      M.G.to(o, { v: S.L, duration: 1.6, delay: 0.5, ease: 'power2.out', onUpdate: function () { setL(o.v); if (Math.random() < 0.3) M.snd.tick(); },
        onComplete: function () { var p = FX.at($('#hCount')); FX.burst(p[0], p[1], 30); if (window.Sfx) Sfx.coin(); M.G.fromTo('#hCount', { scale: 1.25 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }); } });
    } else setL(S.L);
    var nm = nextMile();
    $('#hNext').innerHTML = nm ? 'つぎの目標：<b>' + esc(nm.t) + '</b>（' + fmt(M.numText(nm.n)) + '）' : '1 mol 達成！ 免許皆伝の助手！';

    var cta = '';
    if (due.length) cta += '<button class="big polish" data-polish="' + due[0].id + '"><span>✨ くもった結晶をみがく</span><small>' + esc(due[0].crystal.name) + ' ほか ' + due.length + ' 個 ・ 1回 5問</small></button>';
    if (nx) cta += '<button class="big go" data-go="' + nx.id + '"><span>▶ Lesson ' + nx.no + ' をはじめる</span><small>' + fmt(nx.title + '　' + nx.sub) + '</small></button>';
    $('#hCta').innerHTML = cta;

    function slot(L) {
      var c = cry(L), d = done(L), un = unlocked(L);
      var st = d ? (isDue(L) ? '<span class="chip fog">くもり</span>' : '<span class="chip">' + '✦'.repeat(Math.min(5, c.lv) + 1) + '</span>') : un ? '<span class="chip new">NEW</span>' : '<span class="chip lock">🔒</span>';
      return '<button class="slot' + (d ? '' : un ? ' next' : ' locked') + '" data-slot="' + L.id + '">' +
        M.crystalSvg(L, { lv: c ? c.lv : 0, cloudy: d && isDue(L), locked: !d }) +
        '<b>' + (d ? esc(L.crystal.name) : 'Lesson ' + L.no) + '</b><small>' + fmt(L.title) + '</small>' + st + '</button>';
    }
    var html = '<div class="shelf-row">' + BASIC.map(slot).join('') + '</div>';
    if (basicAll()) html += '<h3 class="shelf-sub">🔓 追加レッスン：溶液の濃度</h3><div class="shelf-row">' + EXTRA.map(slot).join('') + '</div>';
    else html += '<p class="shelf-hint">🔒 基本の ' + BASIC.length + ' つの結晶をそろえると、追加レッスンが開くよ</p>';
    $('#hShelf').innerHTML = html;
    $('#tgSound').checked = S.settings.sound !== false;
    if (M.G && !M.E2E) {
      M.G.from('.greet, .meter, .cta > *', { y: 18, opacity: 0, duration: 0.45, stagger: 0.07, ease: 'back.out(1.6)' });
      M.G.from('.slot', { y: 24, opacity: 0, scale: 0.9, duration: 0.4, stagger: 0.04, delay: 0.15, ease: 'back.out(2)' });
    }
  }

  $('#home').addEventListener('click', function (e) {
    var b;
    if ((b = e.target.closest('[data-go]'))) { startLesson(byId(b.getAttribute('data-go'))); return; }
    if ((b = e.target.closest('[data-polish]'))) { startPolish(byId(b.getAttribute('data-polish'))); return; }
    if ((b = e.target.closest('[data-slot]'))) {
      var L = byId(b.getAttribute('data-slot'));
      if (done(L)) noteSheet(L);
      else if (unlocked(L)) startLesson(L);
      else { FX.shake(b); M.snd.tick(); }
      return;
    }
    if (e.target.closest('#hMeter')) { milesSheet(); return; }
    if (e.target.closest('#hReset')) {
      if (confirm('結晶・粒・進み具合をぜんぶ消して、最初からにしますか？')) { localStorage.removeItem(M.KEY); location.reload(); }
    }
  });
  $('#tgSound').addEventListener('change', function () { S.settings.sound = this.checked; M.save(); if (this.checked && window.Sfx) { Sfx.unlock(); M.snd.pop(); } });

  /* =========================================================
   * 研究ノート（結晶をタップ）
   * ========================================================= */
  function noteSheet(L) {
    var c = cry(L), due = isDue(L);
    var boards = L.talk.filter(function (s) { return s && s.board && s.note !== false; });
    var days = Math.max(0, Math.ceil((c.due - Date.now()) / DAY));
    var html = '<div class="nt-head">' + M.crystalSvg(L, { lv: c.lv, cloudy: due }) +
      '<div><small>Lesson ' + L.no + ' の結晶</small><h3>' + esc(L.crystal.name) + '</h3><p class="nt-f">' + fmt(L.crystal.formula) + '</p>' +
      '<p class="nt-lv">輝き ' + '✦'.repeat(Math.min(5, c.lv) + 1) + '<span>' + '✧'.repeat(5 - Math.min(5, c.lv)) + '</span></p>' +
      '<p class="nt-due">' + (due ? '☁ くもってきた。みがきどき！' : 'あと ' + days + ' 日ほどピカピカ') + '</p></div></div>' +
      '<div class="nt-btns"><button class="big polish" data-np="' + L.id + '"><span>✨ ' + (due ? 'みがく' : '練習する') + '</span><small>5問</small></button><button class="ghost-s" data-nl="' + L.id + '">トークをもう一度</button></div>' +
      '<h4 class="nt-sec">📋 板書</h4>' + boards.map(function (b) { return '<div class="card board"><h4>' + fmt(b.board) + '</h4><ul>' + b.lines.map(function (l) { return '<li>' + fmt(l) + '</li>'; }).join('') + '</ul>' + (b.foot ? '<p class="foot">' + fmt(b.foot) + '</p>' : '') + '</div>'; }).join('') +
      '<h4 class="nt-sec">⚠ ひっかけ注意</h4>' + L.note.tips.map(function (t) { return '<div class="nt-tip"><b>' + fmt(t.t) + '</b>' + (t.why ? '<details><summary>🤔 なぜ？</summary><p>' + fmt(t.why) + '</p></details>' : '') + '</div>'; }).join('') +
      '<h4 class="nt-sec">🐹 モルモ先生のこぼれ話</h4>' + L.note.trivia.map(function (t) { return '<div class="nt-triv"><b>' + fmt(t.t) + '</b><p>' + fmt(t.b) + '</p></div>'; }).join('');
    sheet(html);
    M.glossify($('#sheetBody'), {});
  }
  $('#sheetBody').addEventListener('click', function (e) {
    var b;
    if ((b = e.target.closest('[data-np]'))) { $('#sheet').hidden = true; startPolish(byId(b.getAttribute('data-np'))); }
    else if ((b = e.target.closest('[data-nl]'))) { $('#sheet').hidden = true; startLesson(byId(b.getAttribute('data-nl'))); }
  });

  /* スケール図鑑 */
  function milesSheet() {
    var html = '<h3 class="ml-h">📏 スケール図鑑</h3><p class="ml-sub">あつめた粒の数を、身近なものと比べよう。いま ' + M.countHTML(S.L) + ' 個</p><ol class="ml">' +
      M.MILES.map(function (m) {
        var got = S.miles.indexOf(m.id) >= 0 || S.L >= Math.log10(m.n);
        return '<li class="' + (got ? 'got' : '') + '"><span class="ml-n">' + fmt(M.numText(m.n)) + '</span><div><b>' + (got ? esc(m.t) : '？？？') + '</b><p>' + (got ? fmt(m.b) : 'ここまで粒を集めると わかる') + '</p></div></li>';
      }).join('') + '</ol>';
    sheet(html);
  }

  /* =========================================================
   * レッスン
   * ========================================================= */
  function popQuestion(L) {
    var prev = BASIC.concat(EXTRA).filter(function (x) { return x !== L && done(x); });
    if (!prev.length) return null;
    /* いちばん輝きの弱い結晶（同じなら、いちばん最近のレッスン）から1問 */
    prev.sort(function (a, b) { return (cry(a).lv - cry(b).lv) || (b.idx - a.idx); });
    return M.pickQuiz(prev[0].quiz, 1)[0];
  }
  function startLesson(L) {
    if (!L) return;
    if (window.Sfx) Sfx.unlock();
    var replay = done(L);
    show('talk');
    M.Talk.lesson(L, {
      factor: replay ? 0.3 : 1,
      pop: L.idx > 0 && !replay ? popQuestion(L) : null,
      onEnd: function (res) { lessonDone(L, res, replay); }
    });
  }
  function lessonDone(L, res, replay) {
    var wasBasic = basicAll();
    S.lessons[L.id] = { done: true, at: Date.now(), best: Math.max(res.ok, (S.lessons[L.id] && S.lessons[L.id].best) || 0) };
    var fresh = !cry(L);
    if (fresh) S.crystals[L.id] = { lv: 0, due: Date.now() + DAY, last: Date.now() };
    M.save();
    var unlockedExtra = !wasBasic && basicAll() && EXTRA.length;
    show('done');
    var c = cry(L);
    $('#done').innerHTML =
      '<div class="dn-stage">' + '<div class="dn-rays"></div>' + M.crystalSvg(L, { lv: c.lv }) + '</div>' +
      '<h1 class="dn-t">Lesson ' + L.no + ' クリア！</h1>' +
      '<p class="dn-c">' + (fresh ? esc(L.crystal.name) + '（' + fmt(L.crystal.formula) + '）の結晶ができた！' : esc(L.crystal.name) + 'の結晶、ふたたび！') + '</p>' +
      '<ul class="dn-l"><li><span>正解</span><b>' + res.ok + ' / ' + res.total + '</b></li>' +
      '<li><span>粒のふえ方</span><b class="dn-x"></b></li>' +
      '<li><span>あつめた粒</span><b class="dn-n"></b></li></ul>' +
      '<div class="dn-btns"></div>';
    var nx = nextLesson();
    $('.dn-btns').innerHTML = (nx ? '<button class="big go" data-dgo="' + nx.id + '"><span>▶ つぎ：Lesson ' + nx.no + '</span><small>' + fmt(nx.title) + '</small></button>' : '') +
      '<button class="ghost-s" data-dnote="' + L.id + '">📒 研究ノートを見る</button><button class="ghost-s" data-dhome>🏠 ラボにもどる</button>';
    var stage = $('.dn-stage svg');
    M.snd.grow();
    if (M.G && !M.E2E) {
      M.G.fromTo(stage, { scale: 0.05, rotate: -30, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 1.1, ease: 'elastic.out(1,0.45)', delay: 0.2 });
      M.G.fromTo('.dn-rays', { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, delay: 0.3 });
      M.G.from('.dn-t, .dn-c, .dn-l li, .dn-btns > *', { y: 20, opacity: 0, duration: 0.4, stagger: 0.08, delay: 0.6 });
    }
    setTimeout(function () { var p = FX.at(stage); FX.burst(p[0], p[1], 60, 1.4); FX.bubbles(p[0], p[1] + 40, 16); }, M.E2E ? 0 : 700);
    /* クリアのボーナス */
    var bonus = M.GAIN.clear * (replay ? 0.3 : 1);
    var miles = M.Talk.add(bonus, stage);
    var total = res.gained + bonus, x = Math.pow(10, total);
    $('.dn-x').innerHTML = '×' + (x < 1000 ? x.toFixed(x < 10 ? 1 : 0) : M.countHTML(Math.log10(x))) + ' 倍';
    $('.dn-n').innerHTML = M.countHTML(S.L) + ' 個';
    var p = M.wait(1600);
    miles.forEach(function (m) { p = p.then(function () { M.snd.exp(); FX.rain(90); return FX.slam('<small>あつめた粒が</small><b class="mile">' + esc(m.t) + '</b><small>を こえた！</small>', 'mile'); }); });
    if (unlockedExtra) p = p.then(function () { M.snd.exp(); FX.rain(120); return FX.slam('<small>' + BASIC.length + ' つの結晶がそろった！</small><b class="mile">追加レッスン 解放</b><small>溶液の濃度</small>', 'mile'); });
    if (M.E2E) p.then(function () { M.e2eNext && M.e2eNext(); });
  }
  $('#done').addEventListener('click', function (e) {
    var b;
    if ((b = e.target.closest('[data-dgo]'))) startLesson(byId(b.getAttribute('data-dgo')));
    else if ((b = e.target.closest('[data-dnote]'))) { home(); noteSheet(byId(b.getAttribute('data-dnote'))); }
    else if (e.target.closest('[data-dhome]')) home();
  });

  /* =========================================================
   * みがく（復習）
   * ========================================================= */
  function startPolish(L) {
    if (!L || !done(L)) return;
    if (window.Sfx) Sfx.unlock();
    var due = isDue(L);
    var others = visible().filter(function (x) { return x !== L && done(x); });
    var extra = others.length ? M.pickQuiz(M.pick(others).quiz, 1)[0] : null;
    show('talk');
    M.Talk.polish(L, { due: due, extra: extra, factor: due ? 0.6 : 0.25, onEnd: function (res) { polishDone(L, res, due); } });
  }
  function polishDone(L, res, due) {
    var c = cry(L), up = false, down = false;
    if (due) {
      if (res.ok >= res.total - 1) { c.lv = Math.min(5, c.lv + 1); c.due = Date.now() + INT[c.lv] * DAY; up = true; }
      else if (res.ok <= res.total - 3) { c.lv = Math.max(0, c.lv - 1); c.due = Date.now() + DAY / 2; down = true; }
      else c.due = Date.now() + DAY;
      c.last = Date.now();
      M.save();
    }
    show('done');
    $('#done').innerHTML = '<div class="dn-stage"><div class="dn-rays"></div>' + M.crystalSvg(L, { lv: c.lv, cloudy: due && !up }) + '</div>' +
      '<h1 class="dn-t">' + (up ? '✨ ピカピカ！' : due ? 'もう少し！' : '練習おわり！') + '</h1>' +
      '<p class="dn-c">' + (up ? esc(L.crystal.name) + 'の輝きが ✦' + (c.lv + 1) + ' になった！ 次にくもるのは約 ' + INT[c.lv] + ' 日後。' :
        due ? (down ? 'まちがいが多かったので、輝きが少し落ちちゃった。研究ノートを読んでから、もう一度みがこう。' : 'あと少しでピカピカ。明日もう一度みがこう。') : '結晶の輝きは、くもったときにみがくと上がるよ。') + '</p>' +
      '<ul class="dn-l"><li><span>正解</span><b>' + res.ok + ' / ' + res.total + '</b></li><li><span>あつめた粒</span><b>' + M.countHTML(S.L) + ' 個</b></li></ul>' +
      '<div class="dn-btns">' + (dueList().length ? '<button class="big polish" data-dpol="' + dueList()[0].id + '"><span>✨ つぎの結晶をみがく</span><small>' + esc(dueList()[0].crystal.name) + '</small></button>' : '') +
      '<button class="ghost-s" data-dnote="' + L.id + '">📒 研究ノートを見る</button><button class="ghost-s" data-dhome>🏠 ラボにもどる</button></div>';
    if (up) {
      M.snd.grow();
      var sv = $('.dn-stage svg');
      if (M.G && !M.E2E) M.G.fromTo(sv, { scale: 0.8, filter: 'grayscale(1) blur(2px)' }, { scale: 1, filter: 'grayscale(0) blur(0px)', duration: 1.2, ease: 'elastic.out(1,0.5)' });
      setTimeout(function () { var p = FX.at(sv); FX.burst(p[0], p[1], 50, 1.2); }, M.E2E ? 0 : 500);
    } else M.snd.pop();
    if (M.E2E && M.e2eNext) setTimeout(M.e2eNext);
  }
  $('#done').addEventListener('click', function (e) { var b = e.target.closest('[data-dpol]'); if (b) startPolish(byId(b.getAttribute('data-dpol'))); });

  /* やめる */
  $('#tQuit').addEventListener('click', function () {
    if (!M.E2E && !confirm('トークをやめる？（ここまでに集めた粒は残るよ）')) return;
    M.Talk.stop(); home();
  });

  /* =========================================================
   * 通しテスト（mole.html?e2e）：全レッスンを正解で通し、みがくも1回
   * ========================================================= */
  if (M.E2E) {
    var errs = [];
    M.e2eFail = function (e) { errs.push(String(e && e.stack || e)); document.title = 'E2E FAIL'; };
    window.addEventListener('error', function (e) { M.e2eFail(e.error || e.message); });
    localStorage.removeItem(M.KEY);
    var fresh = M.load(); Object.keys(S).forEach(function (k) { delete S[k]; }); for (var k in fresh) S[k] = fresh[k];
    var queue = ALL.slice(), polished = false;
    M.e2eNext = function () {
      var L = queue.shift();
      if (L) { setTimeout(function () { startLesson(L); }, 0); return; }
      if (!polished) { polished = true; S.crystals.L1.due = 0; setTimeout(function () { startPolish(byId('L1')); }, 0); return; }
      M.e2eNext = null;
      home();
      document.title = errs.length ? 'E2E FAIL' : 'E2E OK';
      window.E2E_RESULT = { ok: !errs.length, errs: errs, L: S.L, miles: S.miles.slice(), crystals: S.crystals };
    };
    M.e2eNext();
  } else home();
})();
