/* ui.js — 画面描画・クイズ進行・演出の振り付け */
(function () {
  'use strict';
  var S = Core.load();
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var KANA = ['ア', 'イ', 'ウ', 'エ'];
  var current = 'home';
  var session = null;

  /* =========================================================
   * 共通
   * ========================================================= */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function applyTheme() {
    var th = Core.THEMES[S.settings.theme] || Core.THEMES[Core.firstTheme()];
    document.documentElement.style.setProperty('--accent', th.a);
    document.documentElement.style.setProperty('--accent2', th.b);
    FX3D.setTheme(th);
  }
  function currentTitle() {
    var lv = Core.levelInfo(S.totalXp).level;
    return S.title && unlockedTitles(lv).indexOf(S.title) >= 0 ? S.title : Core.titleFor(lv);
  }
  function unlockedTitles(lv) {
    return Core.TITLES.filter(function (t) { return lv >= t[0]; }).map(function (t) { return t[1]; });
  }

  function go(name) {
    if (name === current) return;
    if (current === 'quiz' && session && !session.done && name !== 'result') {
      if (!confirm('セットを中断しますか？（ここまでの回答は記録されています）')) return;
      endFever();
      session = null;
    }
    var from = $('#scr-' + current), to = $('#scr-' + name);
    current = name;
    $$('#tabbar button').forEach(function (b) { b.classList.toggle('on', b.dataset.go === name); });
    document.body.dataset.screen = name;
    Sfx.whoosh();
    gsap.to(from, { opacity: 0, y: -16, duration: 0.22, ease: 'power2.in', onComplete: function () {
      from.classList.remove('active');
      gsap.set(from, { clearProps: 'all' });
      to.classList.add('active');
      window.scrollTo(0, 0);
      if (name === 'home') renderHome();
      if (name === 'fields') renderFields();
      if (name === 'learn') renderLearnTab();
      if (name === 'ach') renderAch();
      if (name === 'settings') renderSettings();
      gsap.fromTo(to, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
      var items = $$('.glass, .field-row, .ach, .mode', to);
      if (items.length && name !== 'quiz') gsap.from(items, { opacity: 0, y: 26, duration: 0.5, stagger: 0.04, ease: 'power3.out', clearProps: 'opacity,transform' });
    } });
    FX3D.setMode(name === 'quiz' ? 'quiz' : name === 'result' ? 'result' : name === 'home' ? 'home' : name === 'lesson' ? 'lesson' : 'page');
  }

  /* =========================================================
   * トップバー
   * ========================================================= */
  var shownXp = null;
  function renderTop(animate) {
    var li = Core.levelInfo(S.totalXp);
    $('#tbLevel').textContent = li.level;
    $('#tbXpText').textContent = li.cur + ' / ' + li.need;
    var pct = (li.cur / li.need * 100).toFixed(1) + '%';
    if (animate) gsap.to('#tbXpFill', { width: pct, duration: 0.6, ease: 'power3.out' });
    else $('#tbXpFill').style.width = pct;
    $('#tbStreakNum').textContent = S.streak.count;
    $('#tbStreak').classList.toggle('lit', S.streak.lastDay === Core.dayKey());
    shownXp = S.totalXp;
  }
  function bumpTop() {
    gsap.fromTo('.tb-level', { scale: 1.12 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1,0.4)' });
  }

  /* =========================================================
   * ホーム
   * ========================================================= */
  function todayAmount() { var t = Core.today(); return t.answered + (t.steps || 0); }
  function greet() {
    var h = new Date().getHours(), t = Core.today();
    var due = Core.dueList().length;
    var doneLessons = Object.keys(S.lessons).length;
    if (!doneLessons) return 'ようこそ！まずは最初のレッスンから。';
    if (todayAmount() >= S.settings.dailyGoal) return 'ノルマ達成済み。休むのも戦略。';
    if (due >= 15) return '忘れかけの記憶が ' + due + ' 個。救出に行こう。';
    if (h < 10) return 'おはよう。朝の脳は覚えやすい。';
    if (h >= 22) return '寝る前の復習は記憶に残りやすい。';
    if (todayAmount() > 0) return 'いい調子。あと ' + (S.settings.dailyGoal - todayAmount()) + ' でノルマ達成。';
    return '今日もレッスン1本＋復習1セット。';
  }
  function renderHome() {
    renderTop();
    var t = Core.today();
    $('#heroTitle').textContent = '称号：' + currentTitle();
    $('#heroGreet').textContent = greet();
    var goal = S.settings.dailyGoal;
    var ratio = Math.min(1, todayAmount() / goal);
    var C = 2 * Math.PI * 52;
    var ring = $('#goalRing');
    ring.style.strokeDasharray = C;
    gsap.fromTo(ring, { strokeDashoffset: C }, { strokeDashoffset: C * (1 - ratio), duration: 1.2, ease: 'power3.out' });
    $('#goalNum').textContent = 0;
    FX.countUp($('#goalNum'), todayAmount(), 1);
    $('#goalDen').textContent = '/ ' + goal;
    $('.ring-wrap').classList.toggle('done', ratio >= 1);

    var due = Core.dueList().length;
    var newLeft = Math.max(0, S.settings.newPerDay - t.newCount);
    var unseen = Core.newList().length;
    $('#dueCount').textContent = due;
    $('#newCount').textContent = Math.min(newLeft, unseen);
    $('#freezeCount').textContent = S.streak.freezes;
    $('#unreadCount').textContent = Core.ALL_CARDS.filter(function (c) { return Core.owned(c) && !S.cardSeen[c.id]; }).length;
    var learned = Core.learnedCount();
    $('#startSub').textContent = !learned ? 'レッスンをクリアすると解放' : S.items.boost > 0 ? '⚡ XPブースト×2 を使って開始' : due ? '忘れかけの復習 ' + due + '問を含むセット' : '学んだ範囲 ' + learned + '問から出題';
    $('#btnStart').classList.toggle('locked', !learned);
    var nx = Lesson.next();
    Lesson.stage(nx);
    $('#learnSub').textContent = nx ? LE_T('lesson') + ' ' + Lesson.label(nx) + '：' + nx.title : '全レッスン制覇！' + LE_T('boss') + '戦と復習へ';

    renderQuests();
    renderPredict();
    renderCurve();
  }
  function renderQuests() {
    var ul = $('#questList');
    ul.innerHTML = '';
    S.quests.list.forEach(function (q) {
      var li = document.createElement('li');
      li.className = q.done ? 'done' : '';
      li.innerHTML = '<span class="q-check">' + (q.done ? '✔' : '') + '</span><div class="q-body"><p>' + esc(q.label) + '</p>' +
        '<div class="q-bar"><i style="width:' + (q.prog / q.target * 100) + '%"></i></div></div><span class="q-rew">+' + q.xp + '<small>XP</small></span>';
      ul.appendChild(li);
    });
  }
  var C = Core.COURSE;
  var MILE_RATES = [0.4, 0.5, 0.6, 0.7, 0.8];          // 満点に対する割合で節目を作る（1000点満点なら 400〜800）
  function examList() { return C.exams && C.exams.length ? C.exams : [{ id: 'all', name: '予測', max: 1000, pass: null }]; }
  function checkMilestones(scores) {
    var got = [];
    examList().forEach(function (ex) {
      MILE_RATES.forEach(function (r) {
        var t = Math.round(ex.max * r), k = ex.id + t;
        if (scores[ex.id] >= t && !S.milestones[k]) { S.milestones[k] = Date.now(); got.push({ ex: ex, t: t }); }
      });
    });
    if (!got.length) return;
    Core.save();
    var top = got.reduce(function (x, y) { return y.t / y.ex.max > x.t / x.ex.max ? y : x; });
    var ex = top.ex, pass = ex.pass;
    setTimeout(function () {
      if (pass ? top.t >= pass : top.t >= ex.max * 0.8) {
        FX.slam(ex.name + ' ' + top.t + '点', pass && top.t === pass ? LE_T('passLine') + '突破！この調子で定着させよう' : pass ? '合格圏をさらに固めた！' : '目標圏に到達！', '#5cff9d');
        FX.confetti(240); Sfx.levelUp();
      } else {
        FX.toast('📈', ex.name + ' 予測 ' + top.t + '点 突破！', pass ? LE_T('passLine') + pass + '点まであと ' + (pass - top.t) + '点' : 'この調子で積み上げよう', 'quest');
        Sfx.crit();
      }
    }, 1500);
  }
  function buildMeters() {
    var box = $('#meters'); if (!box || box.childElementCount) return;
    box.innerHTML = examList().map(function (ex) {
      return '<div class="meter" data-exam="' + esc(ex.id) + '"><div class="meter-label"><span>' + esc(ex.name) + '</span><b>0</b></div>' +
        '<div class="meter-bar"><i></i>' + (ex.pass ? '<em class="pass-line" style="left:' + (ex.pass / ex.max * 100) + '%" data-v="' + ex.pass + '"></em>' : '') + '</div></div>';
    }).join('');
  }
  function renderPredict() {
    buildMeters();
    var scores = {};
    examList().forEach(function (ex) { scores[ex.id] = Core.predict(ex.id); });
    checkMilestones(scores);
    examList().forEach(function (ex) {
      var el = $('.meter[data-exam="' + ex.id + '"]');
      var v = scores[ex.id];
      var bar = $('.meter-bar i', el);
      el.classList.toggle('pass', !!ex.pass && v >= ex.pass);
      gsap.fromTo(bar, { width: '0%' }, { width: (v / ex.max * 100) + '%', duration: 1.3, ease: 'power3.out', delay: 0.2 });
      var b2 = $('.meter-label b', el); b2.textContent = 0;
      FX.countUp(b2, v, 1.3);
    });
    var ex = S.settings.examDate;
    var cd = $('#examCountdown');
    if (ex) {
      var left = Core.dayDiff(Core.dayKey(), ex);
      var dl = C.examDateLabel || '目標日';
      cd.textContent = left > 0 ? dl + 'まであと ' + left + ' 日' : left === 0 ? '今日が' + dl + '！' : dl + 'を更新しよう';
    } else cd.textContent = '設定で' + (C.examDateLabel || '目標日') + 'を入れよう';
  }
  /* エビングハウスの節約率データ（20分58%, 1時間44%, 9時間36%, 1日34%, 2日28%, 6日25%, 31日21%）を補間 */
  var EBB = [[0, 1], [0.014, 0.58], [0.042, 0.44], [0.375, 0.36], [1, 0.34], [2, 0.28], [6, 0.25], [31, 0.21]];
  function ebb(d) {
    for (var i = 1; i < EBB.length; i++) {
      if (d <= EBB[i][0]) { var a = EBB[i - 1], b = EBB[i]; return a[1] + (b[1] - a[1]) * (d - a[0]) / (b[0] - a[0]); }
    }
    return 0.21;
  }
  function renderCurve() {
    var svg = $('#curveSvg');
    var W = 400, H = 170, P = { l: 30, r: 8, t: 10, b: 22 };
    var DAYS = 14, N = 56;
    var pts = Core.curve(DAYS, N);
    var X = function (i) { return P.l + (W - P.l - P.r) * i / N; };
    var Y = function (v) { return P.t + (H - P.t - P.b) * (1 - v); };
    var html = '';
    [0, 0.25, 0.5, 0.75, 1].forEach(function (v) {
      html += '<line class="gl" x1="' + P.l + '" x2="' + (W - P.r) + '" y1="' + Y(v) + '" y2="' + Y(v) + '"/>' +
        '<text class="ax" x="' + (P.l - 4) + '" y="' + (Y(v) + 3) + '" text-anchor="end">' + (v * 100) + '</text>';
    });
    [0, 3, 7, 14].forEach(function (d) {
      var x = X(d / DAYS * N);
      html += '<text class="ax" x="' + x + '" y="' + (H - 6) + '" text-anchor="middle">' + (d === 0 ? '今' : d + '日後') + '</text>';
    });
    var e = '';
    for (var i = 0; i <= N; i++) e += (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(ebb(i / N * DAYS)).toFixed(1);
    html += '<path class="ebb" d="' + e + '"/>';
    if (pts[0] != null) {
      var d = '', area = '';
      pts.forEach(function (v, k) { d += (k ? 'L' : 'M') + X(k).toFixed(1) + ' ' + Y(v).toFixed(1); });
      area = d + 'L' + X(N) + ' ' + Y(0) + 'L' + X(0) + ' ' + Y(0) + 'Z';
      html += '<defs><linearGradient id="cvg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".35"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>';
      html += '<path class="area" d="' + area + '"/><path class="you" d="' + d + '"/>';
      var r7 = pts[Math.round(7 / DAYS * N)];
      html += '<circle class="pt" cx="' + X(Math.round(7 / DAYS * N)) + '" cy="' + Y(r7) + '" r="4"/>' +
        '<text class="pt-label" x="' + (X(Math.round(7 / DAYS * N)) + 8) + '" y="' + (Y(r7) - 8) + '">1週間後 ' + Math.round(r7 * 100) + '%</text>';
    } else {
      html += '<text class="ax empty" x="' + (W / 2) + '" y="' + (H / 2) + '" text-anchor="middle">問題を解くと、あなたの記憶の曲線が現れます</text>';
    }
    svg.innerHTML = html;
    var you = $('path.you', svg), eb = $('path.ebb', svg);
    [you, eb].forEach(function (p, k) {
      if (!p) return;
      var L = p.getTotalLength();
      gsap.fromTo(p, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.6, delay: k * 0.2, ease: 'power2.inOut', onComplete: function () { if (k === 1) p.style.strokeDasharray = '4 4'; } });
    });
    var ar = $('path.area', svg); if (ar) gsap.fromTo(ar, { opacity: 0 }, { opacity: 1, duration: 1.2, delay: 0.8 });
  }

  /* =========================================================
   * 分野マップ
   * ========================================================= */
  function renderFields() {
    var box = $('#fieldList');
    box.innerHTML = '';
    LE.cats.forEach(function (cat) {
      var g = document.createElement('div');
      g.className = 'field-group';
      g.innerHTML = '<h2 class="sec-title" style="--c:' + cat.color + '">' + esc(cat.name) + '<small>' + (Core.examDef(cat.exam).name + ' 約' + cat.weight + '問') + '</small></h2>';
      LE.fields.filter(function (f) { return f.cat === cat.id; }).forEach(function (f) {
        var st = Core.fieldStats(f.id);
        var pct = Math.round(st.mastery * 100);
        var row = document.createElement('button');
        row.className = 'field-row glass';
        row.style.setProperty('--c', cat.color);
        row.innerHTML = '<span class="f-ico">' + esc(f.icon) + '</span>' +
          '<div class="f-body"><div class="f-name"><b>' + esc(f.name) + '</b>' + (st.due ? '<span class="f-due">復習 ' + st.due + '</span>' : '') + '</div>' +
          '<small>' + esc(f.desc) + '</small>' +
          '<div class="f-bar"><i data-w="' + pct + '"></i></div></div>' +
          '<div class="f-num"><b>' + pct + '<small>%</small></b><span>' + st.seen + '/' + st.total + '問</span></div>';
        row.addEventListener('click', function () { startSet('field', f.id); });
        g.appendChild(row);
      });
      box.appendChild(g);
    });
    $$('.f-bar i', box).forEach(function (i, k) {
      gsap.fromTo(i, { width: 0 }, { width: i.dataset.w + '%', duration: 1, delay: 0.2 + k * 0.03, ease: 'power3.out' });
    });
  }

  /* =========================================================
   * 実績
   * ========================================================= */
  function renderAch() {
    var lv = Core.levelInfo(S.totalXp).level;
    var got = Object.keys(S.ach).length;
    $('#achSummary').textContent = '実績 ' + got + ' / ' + Core.ACH.length + '　｜　最高ストリーク ' + S.streak.best + '日　｜　累計 ' + S.stats.answered + '問（正答率 ' + (S.stats.answered ? Math.round(S.stats.correct / S.stats.answered * 100) : 0) + '%）';

    var tg = $('#themeGrid'); tg.innerHTML = '';
    Object.keys(Core.THEMES).forEach(function (k) {
      var th = Core.THEMES[k];
      var unlocked = S.themes.indexOf(k) >= 0 || (!th.legendary && lv >= th.lv);
      if (unlocked && S.themes.indexOf(k) < 0) S.themes.push(k);
      var b = document.createElement('button');
      b.className = 'theme' + (S.settings.theme === k ? ' on' : '') + (unlocked ? '' : ' locked');
      b.style.setProperty('--a', th.a); b.style.setProperty('--b', th.b);
      b.innerHTML = '<i></i><span>' + esc(th.name) + '</span><small>' + (unlocked ? (S.settings.theme === k ? '使用中' : 'タップで適用') : th.legendary ? 'LEGENDARY宝箱' : 'Lv.' + th.lv + 'で解放') + '</small>';
      if (unlocked) b.addEventListener('click', function () { S.settings.theme = k; Core.save(); applyTheme(); renderAch(); Sfx.coin(); FX.flash(th.a, 0.25); });
      tg.appendChild(b);
    });

    var tl = $('#titleList'); tl.innerHTML = '';
    var cur = currentTitle();
    Core.TITLES.forEach(function (t) {
      var ok = lv >= t[0];
      var b = document.createElement('button');
      b.className = 'title-chip' + (ok ? '' : ' locked') + (cur === t[1] ? ' on' : '');
      b.textContent = ok ? t[1] : 'Lv.' + t[0] + ' ？？？';
      if (ok) b.addEventListener('click', function () { S.title = t[1]; Core.save(); renderAch(); Sfx.tap(); });
      tl.appendChild(b);
    });

    var ag = $('#achGrid'); ag.innerHTML = '';
    Core.ACH.forEach(function (a) {
      var has = !!S.ach[a.id];
      var d = document.createElement('div');
      d.className = 'ach' + (has ? ' got' : '');
      d.innerHTML = '<span class="a-ico">' + (has ? esc(a.ico) : '🔒') + '</span><b>' + esc(a.name) + '</b><small>' + esc(a.desc) + '</small>';
      ag.appendChild(d);
    });
    renderHeat();
  }
  function renderHeat() {
    var box = $('#heat'); box.innerHTML = '';
    var WEEKS = 16;
    var now = new Date(); now.setHours(0, 0, 0, 0);
    var start = new Date(now); start.setDate(start.getDate() - (WEEKS * 7 - 1) - now.getDay());
    var max = 1;
    Object.keys(S.days).forEach(function (k) { max = Math.max(max, S.days[k].answered); });
    for (var d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
      var k = Core.dayKey(d.getTime());
      var n = S.days[k] ? S.days[k].answered : 0;
      var c = document.createElement('i');
      var lvl = n === 0 ? 0 : n < S.settings.dailyGoal * 0.5 ? 1 : n < S.settings.dailyGoal ? 2 : n < S.settings.dailyGoal * 2 ? 3 : 4;
      c.className = 'h' + lvl;
      c.title = k + '：' + n + '問';
      box.appendChild(c);
    }
  }

  /* =========================================================
   * 設定
   * ========================================================= */
  function renderSettings() {
    $('#setExam').value = S.settings.examDate || '';
    $('#setGoal').value = S.settings.dailyGoal;
    $('#setNew').value = S.settings.newPerDay;
    $('#setSize').value = S.settings.setSize;
    $('#setSound').checked = S.settings.sound;
    $('#setLite').checked = S.settings.lite;
    $('#setAllQ').checked = S.settings.allQ;
  }
  function bindSettings() {
    function num(el, key, min, max) {
      el.addEventListener('change', function () {
        var v = Math.max(min, Math.min(max, parseInt(el.value, 10) || min));
        el.value = v; S.settings[key] = v; Core.save();
      });
    }
    $('#setExam').addEventListener('change', function () { S.settings.examDate = this.value; Core.save(); });
    num($('#setGoal'), 'dailyGoal', 5, 200);
    num($('#setNew'), 'newPerDay', 0, 100);
    num($('#setSize'), 'setSize', 3, 30);
    $('#setSound').addEventListener('change', function () { S.settings.sound = this.checked; Core.save(); Sfx.unlock(); Sfx.coin(); });
    $('#setLite').addEventListener('change', function () { S.settings.lite = this.checked; Core.save(); applyLite(); });
    $('#setAllQ').addEventListener('change', function () { S.settings.allQ = this.checked; Core.save(); });
    $('#btnExport').addEventListener('click', function () {
      var blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = (C.id || 'course') + '-backup-' + Core.dayKey() + '.json';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    });
    $('#btnImport').addEventListener('click', function () { $('#importFile').click(); });
    $('#importFile').addEventListener('change', function () {
      var f = this.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var obj = JSON.parse(r.result);
          if (!obj || typeof obj !== 'object' || !obj.cards) throw new Error('形式が違います');
          S = Core.replace(obj);
          applyTheme(); applyLite(); renderSettings(); renderTop();
          FX.toast('📥', '読み込み完了', 'バックアップを復元しました');
        } catch (e) { alert('読み込みに失敗しました：' + e.message); }
      };
      r.readAsText(f);
      this.value = '';
    });
    $('#btnReset').addEventListener('click', function () {
      if (!confirm('すべての進捗（XP・ストリーク・記憶データ）を消去します。よろしいですか？')) return;
      if (!confirm('本当に消去しますか？元に戻せません。')) return;
      S = Core.reset(); Core.ensureQuests(); applyTheme(); renderSettings(); renderTop();
      FX.toast('🧹', 'リセットしました', '');
    });
  }
  function applyLite() {
    var lite = S.settings.lite;
    document.body.classList.toggle('lite', lite);
    FX3D.setLite(lite);
  }

  /* =========================================================
   * クイズ
   * ========================================================= */
  function startSet(mode, arg) {
    Sfx.unlock();
    var q = Core.buildQueue(mode, arg);
    if (!q.length) {
      FX.toast('📖', 'まだ解ける問題がありません', 'レッスンをクリアすると、その範囲の問題が解放されます');
      if (current !== 'learn') go('learn');
      return;
    }
    var boosted = false;
    if (S.items.boost > 0 && !S.boostArmed && mode !== 'quick') { S.items.boost--; S.boostArmed = true; boosted = true; }
    session = { mode: mode, arg: arg, queue: q, idx: 0, combo: 0, maxCombo: 0, xp: 0, ok: 0, ng: 0, first: {}, res: {}, re: {}, shown: {}, tier0: {}, answered: false, done: false };
    if (mode === 'boss') {
      var hp = Math.max(3, Math.ceil(q.length * 0.7));
      session.boss = { unit: arg, hp: hp, max: hp, info: LE.bosses[arg] || { name: LE_T('bossEn'), ico: '👾' } };
    }
    Core.save();
    go('quiz');
    renderPips();
    renderBoss(true);
    setTimeout(function () {
      showQuestion();
      if (session.boss) { FX.slam(LE_T('bossEn') + ' BATTLE', session.boss.info.name + '　' + session.boss.max + '回正解で撃破！', '#ff4d6d'); Sfx.combo(10); FX3D.pulse(3); }
      else if (boosted) FX.slam('BOOST ×2', 'このセットの獲得XPが2倍', '#ffd84d');
      else if (mode === 'mock') FX.slam('MOCK EXAM', (C.mock && C.mock.slam) || '');
    }, 450);
  }
  /* ---- ユニットボス ---- */
  function renderBoss(intro) {
    var p = $('#bossPanel');
    if (!session.boss) { p.hidden = true; return; }
    var b = session.boss;
    p.hidden = false;
    $('#bossIco').textContent = b.info.ico;
    gsap.set('#bossIco', { scale: 1, rotate: 0, opacity: 1 });
    $('#bossName').textContent = b.info.name;
    $('#bossNum').textContent = 'HP ' + b.hp + ' / ' + b.max;
    gsap.to('#bossHp', { width: (b.hp / b.max * 100) + '%', duration: intro ? 0 : 0.5, ease: 'power3.out' });
    if (intro) gsap.fromTo(p, { y: -40, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)', delay: 0.3 });
  }
  function bossHit(crit) {
    var b = session.boss, dmg = crit ? 2 : 1;
    b.hp = Math.max(0, b.hp - dmg);
    var ico = $('#bossIco');
    var r = ico.getBoundingClientRect();
    FX.floatText(r.left + r.width / 2, r.top, (crit ? 'CRITICAL ' : '') + '−' + dmg, crit ? 'crit' : '');
    FX.burst(r.left + r.width / 2, r.top + r.height / 2, { n: 30, speed: 7, colors: ['#ff4d6d', '#ffd84d', '#ffffff'] });
    gsap.fromTo(ico, { filter: 'brightness(3)' }, { filter: 'brightness(1)', duration: 0.5, ease: 'none', onUpdate: function () { gsap.set(ico, { x: (Math.random() - 0.5) * 16 * (1 - this.progress()) }); }, onComplete: function () { gsap.set(ico, { x: 0 }); } });
    renderBoss(false);
    if (b.hp <= 0) {
      session.bossWin = true;
      setTimeout(function () {
        gsap.to(ico, { scale: 1.6, rotate: 30, opacity: 0, duration: 0.6, ease: 'power2.in' });
        FX.slam(LE_T('bossEn') + ' DEFEATED!!', b.info.name + ' を倒した！', '#ffd84d');
        FX.confetti(220); FX.flash('#ffffff', 0.5); FX3D.pulse(4); Sfx.levelUp();
      }, 500);
    }
  }
  function bossAttack() {
    var ico = $('#bossIco');
    gsap.fromTo(ico, { scale: 1 }, { scale: 1.35, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' });
    var t = $('#bossTaunt');
    t.textContent = pickOne(['フフフ…まだまだだな', 'その程度か？', '解説を読んで出直してこい！', 'ノーダメージだ！']);
    gsap.fromTo(t, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3 });
    gsap.to(t, { opacity: 0, delay: 2, duration: 0.4 });
  }
  function pickOne(a) { return a[Math.floor(Math.random() * a.length)]; }
  function renderPips() {
    var box = $('#pips'); box.innerHTML = '';
    session.queue.forEach(function (q, i) {
      var p = document.createElement('i');
      if (i < session.idx || (i === session.idx && session.res[i] !== undefined)) p.className = session.res[i] ? 'ok' : 'ng';
      else if (i === session.idx) p.className = 'cur';
      if (session.re[q.id] && session.re[q.id] === i) p.classList.add('re');
      box.appendChild(p);
    });
  }
  var timerTween = null;
  function showQuestion() {
    var q = session.queue[session.idx];
    session.answered = false;
    var c = S.cards[q.id];
    var f = Core.FMAP[q.f], cat = Core.CMAP[f.cat];
    $('#qField').textContent = f.icon + ' ' + f.name;
    $('#qField').style.setProperty('--c', cat.color);
    var lc = Core.Q2CARD[q.id];
    var lb = $('#qLesson');
    if (lc) { lb.style.display = ''; lb.textContent = '📍 ' + LE_T('lesson') + ' ' + Lesson.label(lc.L); lb.style.setProperty('--c', lc.unit.color); lb.dataset.id = lc.id; }
    else lb.style.display = 'none';
    var badge = $('#qBadge');
    var isRe = session.re[q.id] === session.idx;
    if (isRe) { badge.textContent = '再挑戦'; badge.className = 'tag badge re'; }
    else if (!c || !c.seen) { badge.textContent = 'NEW'; badge.className = 'tag badge new'; }
    else { badge.textContent = '復習 · 記憶 ' + Math.round(Core.retr(c) * 100) + '%'; badge.className = 'tag badge rev'; }
    $('#qText').textContent = q.q;
    var code = $('#qCode');
    if (q.code) { code.innerHTML = C.highlight ? C.highlight(q.code, esc) : esc(q.code); code.style.display = ''; } else { code.style.display = 'none'; }

    var order = [0, 1, 2, 3].slice(0, q.o.length);
    if (!q.ns) Core.shuffle(order);
    var correct = q.a != null ? q.a : 0;
    session.order = order;
    session.correctPos = order.indexOf(correct);
    var box = $('#choices'); box.innerHTML = '';
    order.forEach(function (oi, k) {
      var b = document.createElement('button');
      b.className = 'choice';
      b.innerHTML = '<span class="ck">' + KANA[k] + '</span><span class="ct">' + esc(q.o[oi]) + '</span><span class="cn">' + (k + 1) + '</span>';
      b.addEventListener('click', function (ev) { answer(k, ev); });
      b.addEventListener('mouseenter', function () { if (!session.answered) Sfx.hover(); });
      box.appendChild(b);
    });
    var fb = $('#feedback');
    fb.classList.remove('show', 'ok', 'ng');
    gsap.set(fb, { height: 0, opacity: 0 });

    var card = $('#qcard');
    gsap.fromTo(card, { opacity: 0, y: 40, rotateX: -12, scale: 0.96 }, { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.55, ease: 'expo.out' });
    gsap.from($$('.choice', box), { opacity: 0, x: -30, duration: 0.4, stagger: 0.06, delay: 0.15, ease: 'power3.out', clearProps: 'transform,opacity' });

    var limit = Core.rule(q).limitSec || C.limitSec || 60;
    if (timerTween) timerTween.kill();
    timerTween = gsap.fromTo('#qTimer', { width: '0%' }, { width: '100%', duration: limit, ease: 'none' });
    session.t0 = performance.now();
  }
  /* 擬似言語のかんたんなシンタックスハイライト */
  function answer(k, ev) {
    if (!session || session.answered) return;
    session.answered = true;
    if (timerTween) timerTween.pause();
    var ms = performance.now() - session.t0;
    var q = session.queue[session.idx];
    var ok = k === session.correctPos;
    var evoCard = Core.Q2CARD[q.id];
    if (evoCard && session.tier0[evoCard.id] === undefined) session.tier0[evoCard.id] = Core.cardTier(evoCard);
    var info = Core.review(q, ok, ms);
    var t = Core.today();
    var cat = Core.FMAP[q.f].cat;
    S.stats.answered++; t.answered++;
    if (info.wasNew) t.newCount++;
    session.res[session.idx] = ok;
    if (session.first[q.id] === undefined) session.first[q.id] = ok;

    var btns = $$('.choice');
    gsap.killTweensOf(btns); gsap.set(btns, { clearProps: 'transform,opacity' });
    var picked = btns[k], right = btns[session.correctPos];
    btns.forEach(function (b, i) { b.disabled = true; if (i !== k && i !== session.correctPos) b.classList.add('dim'); });
    var rect = picked.getBoundingClientRect();
    var px = ev && ev.clientX ? ev.clientX : rect.left + rect.width / 2;
    var py = ev && ev.clientY ? ev.clientY : rect.top + rect.height / 2;

    var quests = [];
    quests = quests.concat(Core.questEvent('answer', 1));
    if (info.wasNew) quests = quests.concat(Core.questEvent('newq', 1));

    if (ok) {
      session.combo++; session.ok++;
      session.maxCombo = Math.max(session.maxCombo, session.combo);
      S.stats.correct++; t.correct++;
      S.stats.bestCombo = Math.max(S.stats.bestCombo, session.combo);
      if (info.wasDue) S.stats.rescues++;
      var isFocus = C.focus && cat === C.focus.cat;
      if (isFocus) S.stats.focusCorrect = (S.stats.focusCorrect || 0) + 1;
      quests = quests.concat(Core.questEvent('correct', 1));
      quests = quests.concat(Core.questEvent('combo', session.combo, true));
      if (info.wasDue) quests = quests.concat(Core.questEvent('rescue', 1));
      if (isFocus) quests = quests.concat(Core.questEvent('focus', 1));

      var xr = Core.calcXp(true, info, session.combo - 1, ms, q);
      session.xp += xr.xp;
      picked.classList.add('right');
      gsap.fromTo(picked, { scale: 0.96 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1.2,0.4)' });
      FX.burst(px, py, { n: 36 + Math.min(session.combo, 20) * 3, speed: 7 + Math.min(session.combo, 15) * 0.4 });
      FX.floatText(px, py - 20, '+' + xr.xp + ' XP', xr.tags.indexOf('JACKPOT') >= 0 ? 'jackpot' : xr.tags.indexOf('CRITICAL') >= 0 ? 'crit' : '');
      xr.tags.forEach(function (tg, i) {
        if (tg === 'RESCUE') setTimeout(function () { FX.floatText(px + 60, py + 10, '記憶救出!', 'rescue'); }, 150 + i * 120);
        if (tg === 'SPEED') setTimeout(function () { FX.floatText(px - 70, py + 10, 'SPEEDY!', 'speed'); }, 150 + i * 120);
      });
      Sfx.correct(session.combo);
      FX3D.pulse(1 + Math.min(session.combo, 20) / 10);
      FX3D.setEnergy(session.combo / 15);
      if (xr.tags.indexOf('JACKPOT') >= 0) { S.stats.crits++; Sfx.crit(); FX.slam('JACKPOT!!', 'XP ×5', '#ffd84d'); FX.confetti(140); FX.flash('#ffd84d', 0.4); }
      else if (xr.tags.indexOf('CRITICAL') >= 0) { S.stats.crits++; Sfx.crit(); FX.flash('#ffffff', 0.25); FX.shake(8); critBanner(); }
      comboFx();
      if (session.boss) bossHit(xr.tags.indexOf('CRITICAL') >= 0 || xr.tags.indexOf('JACKPOT') >= 0);
      var lu = Core.addXp(xr.xp);
      if (lu) setTimeout(function () { levelUp(lu); }, 900);
    } else {
      if (session.combo >= 5) FX.toast('💔', session.combo + 'コンボで途切れた…', '次で取り返そう');
      session.combo = 0; session.ng++;
      FX3D.setEnergy(0); endFever();
      picked.classList.add('wrong');
      right.classList.add('right', 'reveal');
      gsap.fromTo(picked, { x: -10 }, { x: 0, duration: 0.5, ease: 'elastic.out(1.5,0.2)' });
      Sfx.wrong();
      FX3D.miss();
      FX.shake(6);
      FX.flash('#ff4d6d', 0.18);
      session.xp += 2;
      var lu2 = Core.addXp(2);
      if (lu2) setTimeout(function () { levelUp(lu2); }, 900);
      /* セット内で再出題（短期の再学習ステップ） */
      if (session.boss) bossAttack();
      if (session.mode !== 'mock' && !session.boss && session.re[q.id] === undefined) {
        var pos = Math.min(session.queue.length, session.idx + 4);
        session.queue.splice(pos, 0, q);
        session.re[q.id] = pos;
      }
    }
    updateCombo();

    /* フィードバック */
    var fb = $('#feedback');
    fb.classList.add('show', ok ? 'ok' : 'ng');
    $('#fbVerdict').textContent = ok ? (session.combo >= 10 ? 'FEVER!! 正解' : '正解！') : '不正解…';
    var nextTxt = '次の復習：' + Core.fmtIvl(info.ivl);
    if (!info.wasNew) nextTxt = '記憶 ' + Math.round(info.rBefore * 100) + '% → ' + (ok ? '100% ／ ' : '再学習 ／ ') + nextTxt;
    if (!ok && session.mode !== 'mock') nextTxt += '（このセット内でもう一度出ます）';
    $('#fbNext').textContent = nextTxt;
    var mem = $('#fbMem');
    if (!info.wasNew) {
      var r0 = Math.round(info.rBefore * 100);
      var rescue = ok && info.wasDue;
      mem.style.display = '';
      mem.className = 'mem' + (ok ? ' ok' : ' ng') + (rescue ? ' rescue' : '');
      mem.innerHTML = '<span class="mem-l">記憶の保持率</span><div class="mem-bar"><i></i><em style="left:' + r0 + '%"></em></div><b class="mem-v">' + r0 + '%</b>' +
        (rescue ? '<span class="mem-stamp">RESCUED!</span>' : !ok ? '<span class="mem-stamp ng">再学習</span>' : '');
      var bar = $('.mem-bar i', mem), val = $('.mem-v', mem);
      gsap.set(bar, { width: r0 + '%' });
      var o = { v: r0 };
      gsap.to(o, { v: ok ? 100 : 0, duration: 1.1, delay: 0.5, ease: 'power3.out', onUpdate: function () { bar.style.width = o.v + '%'; val.textContent = Math.round(o.v) + '%'; } });
      if (rescue) gsap.fromTo($('.mem-stamp', mem), { scale: 3, opacity: 0, rotate: -25 }, { scale: 1, opacity: 1, rotate: -8, duration: 0.45, delay: 1.2, ease: 'back.out(3)', onStart: function () { Sfx.coin(); } });
    } else mem.style.display = 'none';
    $('#fbExp').textContent = q.e || '';
    gsap.to(fb, { height: 'auto', opacity: 1, duration: 0.45, ease: 'power3.out', delay: ok ? 0.1 : 0.25 });
    setTimeout(function () {
      var r = fb.getBoundingClientRect();
      if (r.bottom > window.innerHeight) window.scrollBy({ top: r.bottom - window.innerHeight + 90, behavior: 'smooth' });
    }, 500);

    var streakUp = Core.touchStreak();
    if (streakUp) setTimeout(function () { FX.toast('🔥', 'ストリーク ' + S.streak.count + '日！', S.streak.count % 7 === 0 ? 'ボーナス：ストリークフリーズ +1' : '今日の記録を確保した'); bumpStreak(); }, 600);
    handleQuests(quests);
    handleAch();
    renderTop(true); bumpTop();
    renderPips();
    Core.save();
  }
  function critBanner() {
    var el = document.createElement('div');
    el.className = 'crit-banner'; el.textContent = 'CRITICAL ×2';
    $('#qcard').appendChild(el);
    gsap.fromTo(el, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.35, ease: 'expo.out' });
    gsap.to(el, { opacity: 0, y: -20, delay: 0.9, duration: 0.4, onComplete: function () { el.remove(); } });
  }
  function updateCombo() {
    var el = $('#combo'), n = session.combo;
    $('#comboNum').textContent = n;
    el.classList.toggle('on', n >= 2);
    el.classList.toggle('hot', n >= 5);
    el.classList.toggle('fever', n >= 10);
    if (n >= 2) gsap.fromTo(el, { scale: 1.6, rotate: -8 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'elastic.out(1,0.35)' });
  }
  function comboFx() {
    var n = session.combo;
    if (n === 10) { FX.slam('FEVER!!', '10 COMBO ／ XP ×1.5', null); Sfx.combo(n); FX.confetti(120); FX3D.fever(true); document.body.classList.add('fever'); }
    else if ([5, 15, 20, 30, 40, 50, 75, 100].indexOf(n) >= 0) { FX.slam(n + ' COMBO', n >= 20 ? 'UNSTOPPABLE' : 'その調子！'); Sfx.combo(n); if (n >= 15) FX.confetti(80); }
  }
  function endFever() { FX3D.fever(false); document.body.classList.remove('fever'); }
  function bumpStreak() {
    $('#tbStreakNum').textContent = S.streak.count;
    $('#tbStreak').classList.add('lit');
    gsap.fromTo('#tbStreak', { scale: 1.8 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1,0.3)' });
  }
  function handleQuests(done) {
    done.forEach(function (q, i) {
      setTimeout(function () {
        FX.toast('🎯', 'クエスト達成：' + q.label, '+' + q.xp + ' XP', 'quest');
        Sfx.coin();
        var lu = Core.addXp(q.xp);
        if (session) session.xp += q.xp;
        renderTop(true);
        if (lu) levelUp(lu);
        Core.save();
      }, 700 + i * 500);
    });
  }
  function handleAch() {
    Core.checkAch().forEach(function (a, i) {
      setTimeout(function () { FX.toast(a.ico, '実績解除：' + a.name, a.desc, 'ach'); Sfx.crit(); }, 1200 + i * 600);
    });
  }

  function next() {
    if (!session || !session.answered) return;
    Sfx.tap();
    var card = $('#qcard');
    gsap.to(card, { opacity: 0, x: -60, rotateY: 8, duration: 0.25, ease: 'power2.in', onComplete: function () {
      gsap.set(card, { x: 0, rotateY: 0 });
      session.idx++;
      if (session.idx >= session.queue.length || session.bossWin) finish();
      else { renderPips(); showQuestion(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    } });
  }

  /* =========================================================
   * リザルト
   * ========================================================= */
  function finish() {
    session.done = true;
    if (timerTween) timerTween.kill();
    var t = Core.today();
    var firstTotal = Object.keys(session.first).length;
    var firstOk = Object.keys(session.first).filter(function (k) { return session.first[k]; }).length;
    var perfect = firstTotal > 0 && firstOk === firstTotal;
    S.stats.sets++; t.sets++;
    if (perfect) S.stats.perfectSets++;
    var quests = Core.questEvent('sets', 1);
    var mockScore = null;
    if (session.mode === 'mock') {
      var mex = Core.examDef(C.mock && C.mock.exam);
      mockScore = Math.round(firstOk / firstTotal * mex.max);
      S.stats.mockBest = Math.max(S.stats.mockBest, mockScore);
    }
    var wasBoost = S.boostArmed;
    S.boostArmed = false;
    /* カード進化（セット中に上がったものをリザルトでまとめて演出） */
    var evos = Object.keys(session.tier0).map(function (id) {
      return { id: id, from: session.tier0[id], to: Core.cardTier(Core.LMAP[id]) };
    }).filter(function (e) { return e.from !== 'locked' && Core.TIERS.indexOf(e.to) > Core.TIERS.indexOf(e.from); });
    var boss = session.boss, bossWin = !!session.bossWin;
    if (boss && bossWin) {
      var firstWin = !S.bosses[boss.unit];
      S.bosses[boss.unit] = S.bosses[boss.unit] || Date.now();
      S.stats.bossWins++;
      var bxp = firstWin ? 200 : 60;
      session.xp += bxp;
      var blu = Core.addXp(bxp);
      if (blu) setTimeout(function () { levelUp(blu); }, 3200);
    }
    session.minChest = boss && bossWin ? (S.stats.bossWins === 1 ? 'legendary' : 'epic') : null;
    Core.save();
    endFever(); FX3D.setEnergy(0);

    go('result');
    var acc = firstOk / Math.max(1, firstTotal);
    var title = boss ? (bossWin ? LE_T('bossEn') + ' DEFEATED!!' : 'もう一息！') : perfect ? 'PERFECT!!' : acc >= 0.8 ? 'GREAT!' : acc >= 0.6 ? 'NICE!' : 'GOOD TRY';
    $('#resMode').textContent = { daily: 'DAILY SET', quick: 'QUICK 3', weak: 'WEAK POINT', focus: (C.focus && C.focus.label) || 'FOCUS', mock: 'MINI MOCK', field: Core.FMAP[session.arg] ? Core.FMAP[session.arg].name : 'FIELD', lesson: 'LESSON CHECK', boss: 'UNIT BOSS' }[session.mode] + (wasBoost ? ' ／ BOOST×2' : '');
    var rt = $('#resTitle'); rt.textContent = title;
    rt.className = 'res-title' + (perfect ? ' perfect' : '');
    $('#resCorrect').textContent = 0;
    $('#resTotal').textContent = '/' + firstTotal;
    $('#resXp').textContent = 0;
    $('#resCombo').textContent = session.maxCombo;
    var ms = $('#mockScore');
    if (mockScore != null) {
      ms.style.display = '';
      var mp = Core.examDef(C.mock && C.mock.exam).pass;
      ms.innerHTML = '<small>' + esc((C.mock && C.mock.scoreLabel) || '換算スコア') + '</small><b>' + mockScore + '</b>' +
        (mp ? '<span class="' + (mockScore >= mp ? 'pass' : 'fail') + '">' + (mockScore >= mp ? LE_T('passLine') + '突破！' : LE_T('passLine') + 'まであと ' + (mp - mockScore) + '点') + '</span>' : '');
    } else ms.style.display = 'none';

    var goal = S.settings.dailyGoal;
    var msg;
    if (t.answered >= goal) msg = '🎉 今日のノルマ達成！ 間隔をあけて復習するほど記憶は強くなります。今日はここで切り上げても大丈夫。続けるなら新しい分野にどうぞ。';
    else msg = 'あと ' + (goal - t.answered) + ' 問で今日のノルマ達成。' + (Core.dueList().length ? '忘れかけの復習が ' + Core.dueList().length + ' 問待っています。' : '');
    if (boss) msg = bossWin ? '👑 ' + boss.info.name + ' を撃破！ 範囲を混ぜて解けた＝本番に近い力がついている証拠。' + LE_T('roadmap') + 'に王冠が付いたよ。' : 'あと ' + boss.hp + ' 回の正解で撃破だった！ 間違えた問題は' + LE_T('card') + 'で確認して、もう一度挑もう。';
    $('#resMsg').textContent = msg;
    $('#evoArea').innerHTML = '';

    /* 宝箱リセット */
    var area = $('#chestArea'), chest = $('#chest');
    area.className = 'chest-area';
    $('#loot').innerHTML = '';
    $('#chestHint').textContent = 'TAP TO OPEN';
    chest.disabled = false;
    $('.res-actions').style.visibility = 'hidden';

    setTimeout(function () {
      var tl = gsap.timeline();
      tl.fromTo(rt, { scale: 3, opacity: 0, letterSpacing: '0.6em' }, { scale: 1, opacity: 1, letterSpacing: '0.04em', duration: 0.7, ease: 'expo.out' })
        .add(function () { FX.shake(10); Sfx.crit(); if (perfect) { FX.confetti(220); FX3D.pulse(3); } else FX3D.pulse(1.5); })
        .from('.rs', { y: 30, opacity: 0, stagger: 0.12, duration: 0.5, ease: 'back.out(2)' }, '-=0.1')
        .add(function () {
          FX.countUp($('#resCorrect'), firstOk, 0.8);
          FX.countUp($('#resXp'), session.xp, 1.2, function () { });
        })
        .add(function () { if (evos.length) { tl.pause(); playEvolutions(evos, $('#evoArea'), function () { tl.resume(); }); } }, '+=0.4')
        .from('#chestArea', { y: 60, opacity: 0, scale: 0.6, duration: 0.7, ease: 'back.out(1.8)' }, '+=0.3')
        .add(function () { gsap.to('#chest', { y: -8, repeat: -1, yoyo: true, duration: 0.6, ease: 'sine.inOut' }); });
    }, 300);

    handleQuests(quests);
    handleAch();
    session.perfect = perfect;
  }
  function openChest() {
    var chest = $('#chest');
    if (chest.disabled) return;
    chest.disabled = true;
    gsap.killTweensOf(chest);
    var loot = Core.rollChest(session && session.perfect, session && session.minChest);
    var area = $('#chestArea');
    $('#chestHint').textContent = '';
    var tl = gsap.timeline();
    var shakes = loot.tier === 'legendary' ? 5 : loot.tier === 'epic' ? 4 : 3;
    for (var i = 0; i < shakes; i++) {
      tl.to(chest, { rotate: 10, scale: 1 + i * 0.06, duration: 0.07, onStart: Sfx.chestShake })
        .to(chest, { rotate: -10, duration: 0.1 })
        .to(chest, { rotate: 0, duration: 0.07 })
        .to({}, { duration: 0.18 });
    }
    tl.add(function () {
      area.classList.add('open', 'tier-' + loot.tier);
      Sfx.chestOpen(loot.tier);
      var r = chest.getBoundingClientRect();
      var colors = { common: ['#ffffff', '#38e8ff'], rare: ['#38e8ff', '#7a5cff', '#fff'], epic: ['#c779ff', '#ff3fa4', '#fff'], legendary: ['#ffd84d', '#ff6a3d', '#fff', '#5cff9d'] }[loot.tier];
      FX.burst(r.left + r.width / 2, r.top + r.height / 2, { n: loot.tier === 'legendary' ? 160 : 70, speed: 12, colors: colors });
      FX.flash(colors[0], loot.tier === 'legendary' ? 0.7 : 0.35);
      FX3D.pulse(loot.tier === 'legendary' ? 4 : 2);
      if (loot.tier === 'legendary' || loot.tier === 'epic') FX.confetti(loot.tier === 'legendary' ? 260 : 120);
      if (loot.tier === 'legendary') FX.slam('LEGENDARY', loot.label, '#ffd84d');
      var box = $('#loot');
      box.innerHTML = '<span class="tier">' + loot.tier.toUpperCase() + '</span><b>' + esc(loot.label || 'XP') + '</b>' +
        (loot.xp ? '<em>+' + loot.xp + ' XP</em>' : '') + (loot.sub ? '<small>' + esc(loot.sub) + '</small>' : '');
      gsap.fromTo(box.children, { y: 30, opacity: 0, scale: 0.5 }, { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.6, ease: 'back.out(2.5)' });
      if (loot.xp) {
        var lu = Core.addXp(loot.xp);
        session.xp += loot.xp;
        FX.countUp($('#resXp'), session.xp, 0.8);
        if (lu) setTimeout(function () { levelUp(lu); }, 1300);
      }
      renderTop(true);
      Core.save();
      handleAch();
      $('.res-actions').style.visibility = 'visible';
      gsap.from('.res-actions > *', { y: 20, opacity: 0, stagger: 0.1, duration: 0.4, delay: 0.5 });
    });
  }

  /* =========================================================
   * レベルアップ演出
   * ========================================================= */
  var luOpen = false;
  function levelUp(lu) {
    if (luOpen) return;
    luOpen = true;
    var ov = $('#overlay-levelup');
    $('#luFrom').textContent = lu.from;
    $('#luTo').textContent = lu.to;
    var newTitle = Core.titleFor(lu.to), oldTitle = Core.titleFor(lu.from);
    $('#luTitle').textContent = newTitle !== oldTitle ? '新称号「' + newTitle + '」獲得！' : '称号：' + newTitle;
    var unlocks = [];
    Object.keys(Core.THEMES).forEach(function (k) { var th = Core.THEMES[k]; if (!th.legendary && th.lv > lu.from && th.lv <= lu.to) { unlocks.push('テーマ「' + th.name + '」'); if (S.themes.indexOf(k) < 0) S.themes.push(k); } });
    $('#luUnlock').textContent = unlocks.length ? '解放：' + unlocks.join('・') : '';
    ov.classList.add('show');
    Sfx.levelUp();
    FX3D.pulse(4);
    var tl = gsap.timeline();
    tl.fromTo(ov, { opacity: 0 }, { opacity: 1, duration: 0.25 })
      .fromTo('.lu-rays', { scale: 0, rotate: 0 }, { scale: 1, rotate: 90, duration: 1.2, ease: 'expo.out' }, 0)
      .fromTo('#overlay-levelup .lu-small', { y: -40, opacity: 0, letterSpacing: '1em' }, { y: 0, opacity: 1, letterSpacing: '0.4em', duration: 0.6, ease: 'expo.out' }, 0.1)
      .fromTo('#luFrom', { opacity: 0, x: -30 }, { opacity: 0.5, x: 0, duration: 0.4 }, 0.3)
      .fromTo('#overlay-levelup .lu-num i', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.45)
      .fromTo('#luTo', { scale: 4, opacity: 0, rotate: -20 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: 'elastic.out(1,0.45)' }, 0.55)
      .add(function () { FX.confetti(200); FX.flash('#ffffff', 0.5); FX.shake(14); }, 0.6)
      .fromTo(['#luTitle', '#luUnlock', '#luClose'], { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.4 }, 0.9);
    gsap.to('.lu-rays', { rotate: '+=360', duration: 20, repeat: -1, ease: 'none', delay: 1.2 });
  }
  function closeLevelUp() {
    var ov = $('#overlay-levelup');
    gsap.to(ov, { opacity: 0, duration: 0.25, onComplete: function () { ov.classList.remove('show'); gsap.killTweensOf('.lu-rays'); luOpen = false; } });
    renderTop(true);
    Core.save();
  }

  /* =========================================================
   * 起動時：ストリーク判定・ログインボーナス
   * ========================================================= */
  function loginBonus() {
    var k = Core.dayKey();
    var res = Core.checkStreak();
    Core.ensureQuests();
    if (S.loginDay === k) return;
    var firstTime = !S.loginDay;
    S.loginDay = k;
    var bonus = 10 + Math.min(S.streak.count, 10) * 2;
    Core.addXp(bonus);
    Core.save();
    var ov = $('#overlay-login');
    $('#loginStreak').textContent = S.streak.count;
    var msg;
    if (firstTime) msg = (C.welcome || 'ようこそ。1日3問でストリーク継続。まずは最初のレッスンから。') + '（+' + bonus + 'XP）';
    else if (res.usedFreeze) msg = '🧊 ストリークフリーズが発動！ 休んだ ' + res.usedFreeze + ' 日分の記録を守った。（+' + bonus + 'XP）';
    else if (res.broken) msg = '連続記録（' + res.lost + '日）は途切れたけど、記憶はちゃんと残ってる。今日からまた積もう。（+' + bonus + 'XP）';
    else msg = '今日も来てくれた。3問解けばストリーク継続！（+' + bonus + 'XP）';
    $('#loginMsg').textContent = msg;
    ov.classList.add('show');
    var tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(ov, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      .fromTo('.login-flame', { scale: 0, rotate: -30 }, { scale: 1, rotate: 0, duration: 0.8, ease: 'elastic.out(1,0.4)' })
      .fromTo('#overlay-login .lu-num', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.4')
      .fromTo(['#loginMsg', '#loginClose'], { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.4 });
    gsap.to('.login-flame', { scale: 1.08, repeat: -1, yoyo: true, duration: 0.5, ease: 'sine.inOut', delay: 1.2 });
  }
  function closeLogin() {
    Sfx.unlock(); Sfx.coin();
    var ov = $('#overlay-login');
    gsap.to(ov, { opacity: 0, duration: 0.3, onComplete: function () { ov.classList.remove('show'); gsap.killTweensOf('.login-flame'); } });
    renderTop(true);
    renderHome();
  }

  /* =========================================================
   * 復習カード（1レッスン＝1枚）
   *  表：思い出そう／要点（レッスンのまとめと同文）／公式・手順
   *  裏：＋α補足／ひっかけ注意／マスター度（進化）
   * ========================================================= */
  var TIER_NAME = { locked: '未入手', bronze: 'BRONZE', silver: 'SILVER', gold: 'GOLD', holo: 'HOLO' };
  var TIER_JA = { bronze: 'ブロンズ', silver: 'シルバー', gold: 'ゴールド', holo: 'ホロ' };
  var TIER_NEXT = { bronze: 'silver', silver: 'gold', gold: 'holo' };
  var TIER_AT = { bronze: 0.25, silver: 0.55, gold: 0.8 };
  function fmtC(t) { return Lesson.fmt(t); }
  function totalCards() { return Core.ALL_CARDS.length; }
  function readCount() { return Core.ALL_CARDS.filter(Core.owned).length; }

  function miniCard(c, extraCls) {
    var t = Core.cardTier(c);
    var isNew = t !== 'locked' && !S.cardSeen[c.id];
    return '<button class="mcard t-' + t + (extraCls ? ' ' + extraCls : '') + '" data-id="' + c.id + '" style="--c:' + c.unit.color + '">' +
      '<span class="mc-lbl">' + Lesson.label(c.L) + '</span>' + (c.L.year ? '<span class="mc-year">' + esc(c.L.year) + '</span>' : '') +
      (t === 'locked' ? '<span class="mc-lock">🔒</span><b>' + esc(c.t) + '</b><small>レッスンをクリアで入手</small>'
        : '<b>' + esc(c.t) + '</b><span class="mc-tier">' + TIER_NAME[t] + '</span>') +
      (isNew ? '<i class="mc-new">NEW</i>' : '') + '</button>';
  }

  /* ---- 図鑑（講義タブ） ---- */
  function renderLearn() {
    var total = totalCards(), got = readCount();
    var pct = Math.round(got / total * 100);
    var C = 2 * Math.PI * 52, ring = $('#dexRing');
    ring.style.strokeDasharray = C;
    gsap.fromTo(ring, { strokeDashoffset: C }, { strokeDashoffset: C * (1 - got / total), duration: 1.2, ease: 'power3.out' });
    $('#dexPct').textContent = 0; FX.countUp($('#dexPct'), pct, 1.2);
    var tiers = { bronze: 0, silver: 0, gold: 0, holo: 0 };
    Core.ALL_CARDS.forEach(function (c) { var t = Core.cardTier(c); if (tiers[t] != null) tiers[t]++; });
    $('#dexTiers').innerHTML = ['holo', 'gold', 'silver', 'bronze'].map(function (t) {
      return '<span class="dt t-' + t + '"><i></i>' + TIER_NAME[t] + ' <b>' + tiers[t] + '</b></span>';
    }).join('') + '<span class="dt">入手 <b>' + got + ' / ' + total + '</b></span>';

    var box = $('#deckList'); box.innerHTML = '';
    LE.units.forEach(function (u, ui) {
      var us = Core.unitStats(u.id);
      var sec = document.createElement('section');
      sec.className = 'dex-unit';
      sec.style.setProperty('--c', u.color);
      sec.innerHTML = '<h2 class="sec-title" style="--c:' + u.color + '">' + LE_T('unit') + ' ' + LE_UNO(ui + 1) + '　' + esc(u.name) + '<small>' + us.got + ' / ' + us.total + ' 枚' + (S.bosses[u.id] ? '　👑 ' + LE_T('boss') + '撃破' : '') + '</small></h2>' +
        '<div class="mcard-grid">' + Core.ALL_CARDS.filter(function (c) { return c.unit.id === u.id; }).map(function (c) { return miniCard(c); }).join('') + '</div>';
      box.appendChild(sec);
    });
    $$('.mcard', box).forEach(function (b) {
      b.addEventListener('click', function () {
        var c = Core.LMAP[b.dataset.id];
        if (!Core.owned(c)) {
          FX.toast('🔒', LE_T('lesson') + ' ' + Lesson.label(c.L) + ' をクリアすると手に入る', c.t);
          gsap.fromTo(b, { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1.5,0.3)' });
          return;
        }
        openCard(c.id);
      });
    });
    gsap.from($$('.mcard', box), { y: 20, opacity: 0, duration: 0.4, stagger: 0.012, ease: 'back.out(2)', clearProps: 'transform,opacity' });
  }

  /* ---- カードビューア ---- */
  var cv = null;
  function openCard(id, opts) {
    opts = opts || {};
    Sfx.unlock();
    var list = Core.ALL_CARDS.filter(Core.owned).map(function (c) { return c.id; });
    if (list.indexOf(id) < 0) list = [id];
    cv = { list: list, i: list.indexOf(id), ctx: opts.ctx || '', back: false };
    var ov = $('#overlay-deck');
    ov.classList.add('show');
    gsap.fromTo(ov, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    Sfx.whoosh();
    drawCard(0);
    var qs = Core.questEvent('read', 1);
    handleQuests(qs);
  }
  function closeCard() {
    if (!cv) return;
    var ov = $('#overlay-deck');
    gsap.to(ov, { opacity: 0, duration: 0.22, onComplete: function () { ov.classList.remove('show'); } });
    cv = null;
    Core.save();
    if (current === 'learn') renderLearnTab();
    if (current === 'home') renderHome();
  }
  function cardHTML(c) {
    var d = c.def, L = c.L, t = Core.cardTier(c);
    var recap = L.steps[L.steps.length - 1];
    var vizStep = d.vizFind ? L.steps.find(function (s) { return s.viz && s.viz.indexOf(d.vizFind) >= 0; }) : null;
    var head = function (side) {
      return '<div class="kc-head"><span class="kc-lesson">📍 ' + LE_T('lesson') + ' ' + Lesson.label(L) + '</span><span class="kc-unit">' + esc(c.unit.name) + '</span>' +
        '<span class="kc-tier">' + TIER_NAME[t === 'locked' ? 'bronze' : t] + '</span></div>' + (L.year ? '<span class="kc-year">' + esc(L.year) + '</span>' : '') + '<h2 class="kc-title">' + esc(c.t) + '</h2>' +
        '<div class="kc-side">' + side + '</div>';
    };
    var front = '<div class="kc-face kc-front"><div class="kc-shine"></div>' + head('表：要点') + '<div class="kc-scroll">' +
      '<section class="kc-sec ana"><h4>💭 思い出そう</h4><p>' + fmtC(d.ana || L.goal) + '</p>' + (vizStep ? '<div class="vz">' + vizStep.viz + '</div>' : '') + '</section>' +
      '<section class="kc-sec pts"><h4>✅ 要点 <small>レッスンのまとめ</small></h4><ul>' + (recap.points || []).map(function (p) { return '<li>' + fmtC(p) + '</li>'; }).join('') + '</ul></section>' +
      (d.how && d.how.length ? '<section class="kc-sec how"><h4>🧮 公式・手順</h4><ol>' + d.how.map(function (h) { return '<li>' + fmtC(h) + '</li>'; }).join('') + '</ol></section>' : '') +
      '</div><div class="kc-flip-hint">↻ タップで裏面へ（補足・ひっかけ・マスター度）</div><div class="kc-new" id="kcNew">NEW!</div></div>';
    var qs = Core.CARD2Q[c.id] || [];
    var prog = Core.cardProgress(c);
    var nt = TIER_NEXT[t];
    var ladder = ['bronze', 'silver', 'gold', 'holo'].map(function (x) { return '<span class="ld t-' + x + (x === t ? ' on' : '') + '">' + TIER_JA[x] + '</span>'; }).join('<i>›</i>');
    var mast = '<div class="ladder">' + ladder + '</div>' + (nt ? '<div class="evo-bar"><i style="width:' + Math.min(100, Math.round(prog / TIER_AT[t] * 100)) + '%"></i></div>' +
      '<p class="mast-note">この範囲の問題 <b>' + qs.length + '問</b> を解いて記憶に定着させると <b>' + TIER_JA[nt] + '</b> に進化。忘れかけると下がることもあるよ。</p>'
      : '<p class="mast-note">最終進化！ この範囲は完全にあなたのもの。忘れないよう時々復習しよう。</p>');
    var back = '<div class="kc-face kc-back"><div class="kc-shine"></div>' + head('裏：補足・ひっかけ') + '<div class="kc-scroll">' +
      (d.extra && d.extra.length ? '<section class="kc-sec extra"><h4>＋α 補足 <small>レッスン外だけど試験に出る</small></h4>' + d.extra.map(function (x) { return '<div class="ex-item"><b>' + esc(x.t) + '</b><p>' + fmtC(x.b) + '</p></div>'; }).join('') + '</section>' : '') +
      (d.traps && d.traps.length ? '<section class="kc-sec trap"><h4>⚠ ひっかけ注意</h4><ul>' + d.traps.map(function (x) { return '<li>' + fmtC(x) + '</li>'; }).join('') + '</ul></section>' : '') +
      '<section class="kc-sec mast"><h4>📈 マスター度</h4>' + mast + '</section>' +
      '</div><div class="kc-flip-hint">↻ タップで表面へ</div></div>';
    return front + back;
  }
  function drawCard(dir) {
    var c = Core.LMAP[cv.list[cv.i]];
    var k = $('#kcard');
    var t = Core.cardTier(c);
    var ov = $('#overlay-deck');
    ov.style.setProperty('--c', c.unit.color);
    $('#deckTitle').innerHTML = '<span>' + esc(c.unit.icon) + '</span> ' + LE_T('unit') + ' ' + LE_UNO(LE.units.indexOf(c.unit) + 1) + '　' + esc(c.unit.name) + '<small>' + (cv.i + 1) + ' / ' + cv.list.length + '</small>';
    var tl = gsap.timeline();
    if (dir) tl.to(k, { x: -dir * 120, opacity: 0, rotateY: (cv.back ? 180 : 0) - dir * 60, duration: 0.2, ease: 'power2.in' });
    tl.add(function () {
      cv.back = false;
      k.className = 'kcard t-' + (t === 'locked' ? 'bronze' : t);
      k.innerHTML = cardHTML(c);
      gsap.set(k, { rotateY: 0 });
      var acts = $('#deckActions'); acts.innerHTML = '';
      var add = function (html, cls, fn) { var b = document.createElement('button'); b.className = cls; b.innerHTML = html; b.addEventListener('click', fn); acts.appendChild(b); };
      add('↻ 裏返す', 'btn-ghost', flipCard);
      if (cv.ctx !== 'quiz') {
        add('📖 レッスンをもう一度', 'btn-ghost', function () { var id = c.id; closeCard(); setTimeout(function () { Lesson.start(id); }, 250); });
        if ((c.L.q || []).length) add('⚔ この範囲の問題（' + c.L.q.length + '問）', 'btn-primary', function () { var id = c.id; closeCard(); setTimeout(function () { startSet('lesson', id); }, 250); });
      } else add('問題にもどる', 'btn-primary', closeCard);
      $('#deckPrev').disabled = cv.i <= 0; $('#deckNext').disabled = cv.i >= cv.list.length - 1;
      $('#deckNav').style.display = cv.list.length > 1 ? '' : 'none';
    });
    if (dir) tl.fromTo(k, { x: dir * 120, opacity: 0, rotateY: dir * 60 }, { x: 0, opacity: 1, rotateY: 0, duration: 0.4, ease: 'power3.out' });
    else tl.fromTo(k, { scale: 0.6, opacity: 0, rotateY: -100, y: 40 }, { scale: 1, opacity: 1, rotateY: 0, y: 0, duration: 0.65, ease: 'back.out(1.5)' });
    tl.add(function () {
      gsap.from($$('.kc-front .kc-sec', k), { opacity: 0, y: 12, stagger: 0.08, duration: 0.35, clearProps: 'all' });
      gsap.from($$('.kc-front .vz > *', k), { opacity: 0, scale: 0.85, stagger: 0.08, duration: 0.35, delay: 0.15, ease: 'back.out(2)', clearProps: 'all' });
      if (Core.markRead(c.id)) {
        var nw = $('#kcNew', k);
        nw.style.display = 'block';
        gsap.fromTo(nw, { scale: 3, opacity: 0, rotate: -30 }, { scale: 1, opacity: 1, rotate: -12, duration: 0.45, ease: 'back.out(3)' });
        gsap.to(nw, { opacity: 0, scale: 0.8, duration: 0.4, delay: 1.5 });
        Sfx.coin();
        var r = k.getBoundingClientRect();
        FX.burst(r.left + r.width / 2, r.top + 60, { n: 40, speed: 8 });
        handleAch();
        Core.save();
      }
    });
  }
  function flipCard() {
    if (!cv) return;
    cv.back = !cv.back;
    var k = $('#kcard');
    Sfx.whoosh();
    gsap.to(k, { rotateY: cv.back ? 180 : 0, duration: 0.6, ease: 'back.out(1.2)' });
    if (cv.back) {
      gsap.from($$('.kc-back .kc-sec', k), { opacity: 0, x: 20, stagger: 0.1, duration: 0.35, delay: 0.25, clearProps: 'opacity,transform' });
      var bar = $('.kc-back .evo-bar i', k);
      if (bar) gsap.from(bar, { width: 0, duration: 1, delay: 0.5, ease: 'power3.out' });
    }
  }
  function cardStep(d) {
    if (!cv) return;
    var ni = cv.i + d;
    if (ni < 0 || ni >= cv.list.length) { gsap.fromTo('#kcard', { x: d * 14 }, { x: 0, duration: 0.4, ease: 'elastic.out(1,0.3)' }); return; }
    cv.i = ni; Sfx.whoosh(); drawCard(d);
  }
  function bindCard() {
    $('#deckClose').addEventListener('click', closeCard);
    $('#deckPrev').addEventListener('click', function () { cardStep(-1); });
    $('#deckNext').addEventListener('click', function () { cardStep(1); });
    var stage = $('#deckStage'), sx = null, moved = false;
    stage.addEventListener('pointermove', function (e) {
      if (S.settings.lite) return;
      var r = stage.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      gsap.to(stage, { rotateY: (px - 0.5) * 10, rotateX: -(py - 0.5) * 8, duration: 0.4, ease: 'power2.out' });
      $('#kcard').style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      $('#kcard').style.setProperty('--my', (py * 100).toFixed(1) + '%');
    });
    stage.addEventListener('pointerleave', function () { gsap.to(stage, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1,0.4)' }); });
    stage.addEventListener('pointerdown', function (e) { sx = e.clientX; moved = false; });
    stage.addEventListener('pointerup', function (e) {
      if (sx == null) return;
      var dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 60) { moved = true; cardStep(dx < 0 ? 1 : -1); }
    });
    stage.addEventListener('click', function (e) {
      if (moved) return;
      if (e.target.closest('.gl, button, a')) return;
      flipCard();
    });
  }
  function cardKey(e) {
    if (!cv) return false;
    if (e.key === 'Escape') { closeCard(); return true; }
    if (e.key === 'ArrowRight') { cardStep(1); return true; }
    if (e.key === 'ArrowLeft') { cardStep(-1); return true; }
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'f') { e.preventDefault(); flipCard(); return true; }
    return true;
  }

  /* ---- カード進化の演出（リザルト画面で、学習の邪魔をしないタイミングでまとめて） ---- */
  function playEvolutions(list, box, done) {
    if (!list.length) { if (done) done(); return; }
    box.innerHTML = '<p class="evo-head">CARD EVOLUTION</p><div class="evo-row"></div>';
    var row = $('.evo-row', box);
    var tl = gsap.timeline({ onComplete: done });
    list.forEach(function (ev, i) {
      var c = Core.LMAP[ev.id];
      var wrap = document.createElement('div');
      wrap.className = 'evo-item';
      wrap.innerHTML = miniCard(c) + '<span class="evo-label">' + TIER_JA[ev.from] + ' → <b>' + TIER_JA[ev.to] + '</b></span>';
      row.appendChild(wrap);
      var mc = $('.mcard', wrap);
      mc.className = 'mcard t-' + ev.from;
      $('.mc-tier', mc) && ($('.mc-tier', mc).textContent = TIER_NAME[ev.from]);
      mc.addEventListener('click', function () { openCard(ev.id); });
      tl.fromTo(wrap, { opacity: 0, y: 30, scale: 0.7 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(2)' }, i * 0.9)
        .to(mc, { rotateY: 90, duration: 0.25, ease: 'power2.in', onComplete: function () {
          mc.className = 'mcard t-' + ev.to;
          if ($('.mc-tier', mc)) $('.mc-tier', mc).textContent = TIER_NAME[ev.to];
          var r = mc.getBoundingClientRect();
          FX.burst(r.left + r.width / 2, r.top + r.height / 2, { n: ev.to === 'holo' ? 90 : 50, speed: 9, colors: ev.to === 'holo' ? ['#ff3fa4', '#ffd84d', '#5cff9d', '#38e8ff'] : ev.to === 'gold' ? ['#ffd84d', '#fff'] : ['#e9eef7', '#8c9bb3'] });
          Sfx.chestOpen(ev.to === 'holo' ? 'legendary' : ev.to === 'gold' ? 'epic' : 'rare');
          if (ev.to === 'holo') FX.slam('HOLO EVOLUTION', c.t, '#c779ff');
        } }, i * 0.9 + 0.45)
        .to(mc, { rotateY: 0, duration: 0.45, ease: 'back.out(2)' }, i * 0.9 + 0.7)
        .fromTo($('.evo-label', wrap), { opacity: 0 }, { opacity: 1, duration: 0.3 }, i * 0.9 + 0.8);
    });
  }

  /* =========================================================
   * イベント
   * ========================================================= */
  function magnet(el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.18, y: (e.clientY - r.top - r.height / 2) * 0.25, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('pointerleave', function () { gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' }); });
  }
  function bind() {
    $$('[data-go]').forEach(function (b) { b.addEventListener('click', function () { Sfx.unlock(); go(b.dataset.go); }); });
    $('#btnStart').addEventListener('click', function (e) {
      if (!Core.learnedCount()) { FX.toast('📖', 'まずはレッスンから！', '学んだ範囲だけが出題されるしくみです'); gsap.fromTo('#btnLearn', { scale: 1.1 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1,0.3)' }); return; }
      FX.burst(e.clientX, e.clientY, { n: 50, speed: 10 });
      startSet('daily');
    });
    $('#btnLearn').addEventListener('click', function (e) {
      FX.burst(e.clientX, e.clientY, { n: 50, speed: 10 });
      var nx = Lesson.next();
      if (nx) Lesson.start(nx.id); else go('learn');
    });
    magnet($('#btnLearn'));
    $$('#learnTabs button').forEach(function (b) {
      b.addEventListener('click', function () { learnTab = b.dataset.tab; renderLearnTab(); Sfx.tap(); });
    });
    Lesson.bind();
    $('#btnQuick').addEventListener('click', function () { startSet('quick'); });
    if (!C.focus) $('#modeFocus').remove();
    if (!C.mock) $('#modeMock').remove();
    $$('.mode[data-mode]').forEach(function (b) { b.addEventListener('click', function () { startSet(b.dataset.mode); }); });
    $('#btnQuit').addEventListener('click', function () { go('home'); });
    $('#btnNext').addEventListener('click', next);
    $('#btnCard').addEventListener('click', function () { var q = session && session.queue[session.idx]; if (q && Core.Q2CARD[q.id]) openCard(Core.Q2CARD[q.id].id, { ctx: 'quiz' }); });
    $('#qLesson').addEventListener('click', function () { if (this.dataset.id) openCard(this.dataset.id, { ctx: 'quiz' }); });
    bindCard();
    $('#chest').addEventListener('click', openChest);
    $('#btnAgain').addEventListener('click', function () {
      var m = session ? session.mode : 'daily';
      startSet(m === 'quick' ? 'daily' : m, session && session.arg);
    });
    $('#luClose').addEventListener('click', closeLevelUp);
    $('#loginClose').addEventListener('click', closeLogin);
    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT') return;
      if ($('#overlay-levelup').classList.contains('show')) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeLevelUp(); } return; }
      if (cv && cardKey(e)) return;
      if ($('#overlay-levelup').classList.contains('show')) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeLevelUp(); } return; }
      if ($('#overlay-login').classList.contains('show')) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeLogin(); } return; }
      if (current === 'quiz' && session) {
        if (!session.answered && /^[1-4]$/.test(e.key)) { var b = $$('.choice')[+e.key - 1]; if (b) { var r = b.getBoundingClientRect(); answer(+e.key - 1, { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }); } }
        else if (session.answered && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); next(); }
        else if (session.answered && (e.key === 'c' || e.key === 'C')) { $('#btnCard').click(); }
      } else if (current === 'result' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        if (!$('#chest').disabled) openChest();
      }
    });
    bindSettings();
  }

  var learnTab = 'road';
  function renderLearnTab() {
    $$('#learnTabs button').forEach(function (b) { b.classList.toggle('on', b.dataset.tab === learnTab); });
    $('#tab-road').hidden = learnTab !== 'road';
    $('#tab-dex').hidden = learnTab !== 'dex';
    if (learnTab === 'road') Lesson.renderMap(); else renderLearn();
  }
  window.UI = {
    go: go, startSet: startSet, renderTop: renderTop, levelUp: levelUp, handleQuests: handleQuests, handleAch: handleAch,
    openCard: openCard, miniCard: miniCard, playEvolutions: playEvolutions, renderHome: function () { renderHome(); },
    current: function () { return current; }
  };

  /* 起動 */
  applyTheme();
  applyLite();
  bind();
  document.body.dataset.screen = 'home';
  Core.ensureQuests();
  renderHome();
  gsap.from('#topbar', { y: -60, opacity: 0, duration: 0.8, ease: 'expo.out' });
  gsap.from('#scr-home .glass', { y: 40, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'expo.out', delay: 0.2, clearProps: 'opacity,transform' });
  gsap.from('#tabbar', { y: 80, opacity: 0, duration: 0.8, ease: 'expo.out', delay: 0.4, clearProps: 'transform,opacity' });
  setTimeout(loginBonus, 600);
  if (Core.migratedFrom()) setTimeout(function () { FX.toast('📦', '旧版の学習データを引き継ぎました', '進捗・XP・ストリークをそのまま続けられます', 'quest'); }, 2500);
  setInterval(function () { if (Core.dayKey() !== S.quests.day && current === 'home') { Core.ensureQuests(); renderHome(); } }, 60000);
})();
