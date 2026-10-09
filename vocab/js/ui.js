/* =========================================================
 * vocab/ui.js — 画面（ホーム・ブロック・図鑑・結果）
 *
 *  ブロック（どれも単独で始められる。途中でやめても答えた分は記録ずみ）
 *    face  👀 顔見知りチェック：5級の語を素早く捕獲。答えられなければ「出会い」へ
 *    meet  🌱 出会い：予想 → 説明 → 見分ける → 捕獲
 *    wild  ⚔ 野生戦：しおれた・野生に戻りかけのカードと戦う（レベルで問い方が変わる）
 *    rescue 図鑑から1枚だけ救出
 *  おまかせ（1分・5分・10分 × 🧠しっかり／😌ゆるく）は、その日の状態からブロックを組む。
 * ========================================================= */
(function () {
  'use strict';
  var D = V.D, S = V.S;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  var G = window.gsap || null;
  function tw(el, from, to) { if (!G || !el) return; G.fromTo(el, from, to); }
  var POS = { n: '名詞', v: '動詞', adj: '形容詞', adv: '副詞', phr: '表現' };

  /* =========================================================
   * 読み上げ（標準の音声合成。学ぶ言語の声を自動で選ぶ。声がなければ出さない）
   * ========================================================= */
  var Speech = (function () {
    var syn = window.speechSynthesis, voice = null;
    function find() {
      if (!syn) return null;
      var vs = syn.getVoices() || [], L = D.lang;
      voice = vs.filter(function (v) { return /^es[-_]ES/i.test(v.lang); })[0] ||
              vs.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(L) === 0; })[0] || null;
      return voice;
    }
    if (syn) { find(); if ('onvoiceschanged' in syn) syn.onvoiceschanged = function () { find(); refreshSpeak(); }; }
    return {
      ok: function () { return !!(syn && (voice || find())); },
      say: function (text, slow) {
        if (!S.settings.speak || !syn || !(voice || find())) return;
        try {
          syn.cancel();
          var u = new SpeechSynthesisUtterance(String(text).replace(/[{}]/g, ''));
          u.voice = voice; u.lang = voice.lang; u.rate = slow ? 0.7 : 0.9;
          syn.speak(u);
        } catch (e) { /* 読み上げできない */ }
      }
    };
  })();
  function refreshSpeak() { $$('.say').forEach(function (b) { b.hidden = !Speech.ok(); }); }
  function sayBtn(text, cls) { return '<button class="say ' + (cls || '') + '" data-say="' + esc(text) + '" aria-label="読み上げ"' + (Speech.ok() ? '' : ' hidden') + '>🔊</button>'; }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-say]');
    if (b) { e.stopPropagation(); Speech.say(b.getAttribute('data-say'), b.classList.contains('slow')); }
  }, true);

  /* =========================================================
   * 演出（パーティクル・叩きつけ文字・浮かぶ文字）
   * ========================================================= */
  var FX = (function () {
    var cv = $('#fx'), cx = cv.getContext('2d'), parts = [], raf = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    function size() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'; }
    addEventListener('resize', size); size();
    function cols() { var cs = getComputedStyle(document.documentElement); return ['--fx1', '--fx2', '--fx3', '--fx4'].map(function (v) { return cs.getPropertyValue(v).trim() || '#e4572e'; }); }
    function tick() {
      cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, innerWidth, innerHeight);
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.life -= p.decay; if (p.life <= 0) { parts.splice(i, 1); continue; }
        p.vx *= p.drag; p.vy = p.vy * p.drag + p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        cx.globalAlpha = Math.min(1, p.life); cx.fillStyle = p.c;
        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot);
        if (p.k === 'tile') { cx.fillRect(-p.s, -p.s, p.s * 2, p.s * 2); cx.fillStyle = 'rgba(255,255,255,.7)'; cx.fillRect(-p.s * 0.35, -p.s * 0.35, p.s * 0.7, p.s * 0.7); }
        else if (p.k === 'petal') { cx.scale(1, 0.55 + 0.45 * Math.cos(p.rot * 2)); cx.beginPath(); cx.ellipse(0, 0, p.s * 1.6, p.s * 0.8, 0, 0, 6.283); cx.fill(); }
        else { cx.beginPath(); cx.arc(0, 0, p.s * p.life, 0, 6.283); cx.fill(); }
        cx.restore();
      }
      cx.globalAlpha = 1;
      raf = parts.length ? requestAnimationFrame(tick) : 0;
    }
    function kick() { if (!raf) raf = requestAnimationFrame(tick); }
    function center(el) { if (!el) return [innerWidth / 2, innerHeight / 2]; var r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
    return {
      center: center,
      burst: function (el, kind, n) {
        var c = center(el), C = cols(); kind = kind || pick(['tile', 'petal', 'dot']);
        for (var i = 0; i < (n || 26); i++) {
          var a = Math.random() * 6.283, sp = 3 + Math.random() * 7;
          parts.push({ x: c[0], y: c[1], vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, g: kind === 'petal' ? 0.08 : 0.18, drag: kind === 'petal' ? 0.96 : 0.93,
            s: kind === 'dot' ? 3 + Math.random() * 3 : 4 + Math.random() * 4, c: C[i % C.length], life: 1.3, decay: 0.014 + Math.random() * 0.012,
            rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, k: kind });
        }
        kick();
      },
      rain: function (kind) {
        var C = cols(); kind = kind || pick(['tile', 'petal']);
        for (var i = 0; i < 70; i++) parts.push({ x: Math.random() * innerWidth, y: -20 - Math.random() * 200, vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3, g: 0.04, drag: 0.995,
          s: 4 + Math.random() * 4, c: C[i % C.length], life: 2.6, decay: 0.008, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.2, k: kind });
        kick();
      },
      slam: function (text, sub) {
        var box = $('#slam');
        box.innerHTML = '<div class="slam-t">' + esc(text) + '</div>' + (sub ? '<div class="slam-s">' + esc(sub) + '</div>' : '');
        box.hidden = false;
        if (!G) { setTimeout(function () { box.hidden = true; }, 1400); return; }
        G.timeline({ onComplete: function () { box.hidden = true; } })
          .fromTo(box.firstChild, { scale: 2.6, opacity: 0, rotate: -8 }, { scale: 1, opacity: 1, rotate: -4, duration: 0.45, ease: 'back.out(2.2)' })
          .fromTo(box.children[1] || {}, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, '-=0.15')
          .to(box, { opacity: 0, duration: 0.35, delay: 0.9 })
          .set(box, { opacity: 1 });
      },
      float: function (el, text, cls) {
        var c = center(el), d = document.createElement('div');
        d.className = 'floaty ' + (cls || ''); d.textContent = text;
        d.style.left = c[0] + 'px'; d.style.top = c[1] + 'px';
        document.body.appendChild(d);
        if (!G) { setTimeout(function () { d.remove(); }, 1000); return; }
        G.fromTo(d, { y: 0, opacity: 0, scale: 0.5 }, { y: -60, opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(3)' });
        G.to(d, { y: -100, opacity: 0, duration: 0.4, delay: 0.7, onComplete: function () { d.remove(); } });
      },
      shake: function (el) { if (G && el) G.fromTo(el, { x: -10 }, { x: 0, duration: 0.45, ease: 'elastic.out(1.2,0.3)' }); }
    };
  })();
  var PRAISE = ['¡Bien!', '¡Muy bien!', '¡Eso es!', '¡Perfecto!', '¡Olé!', '¡Genial!'];

  /* =========================================================
   * 画面の切りかえ
   * ========================================================= */
  function go(id) {
    $$('.screen').forEach(function (s) { s.hidden = s.id !== id; });
    window.scrollTo(0, 0);
    if (id === 'home') renderHome();
    if (id === 'dex') renderDex();
    if (id === 'conj') renderConjMenu();
  }

  /* ---- カード（見出し） ---- */
  function gcls(w) { return w.pos === 'n' ? ' g-' + (w.g || 'm') : ''; }
  function headHtml(w) {
    var a = V.art(w);
    return (a ? '<span class="art">' + a + '</span> ' : '') + '<span class="w">' + esc(w.w) + '</span>';
  }
  function exHtml(s) { return esc(s).replace(/\{([^}]+)\}/g, '<mark>$1</mark>'); }
  function rankCls(id) { var c = V.card(id); return c ? ' r-' + V.RANKS[c.lv].id : ''; }

  /* =========================================================
   * 距離感（自キャラ ← → 単語キャラ）
   *  近いほど関係が深い。ランクの目盛り：出会った／顔なじみ／仲間／相棒
   *  その日のうちに近づけるのは「出会った」まで。そこから先は日を空けて思い出すと近づく
   * ========================================================= */
  var REL_C = [0.25, 0.5, 0.75, 1];
  function tLeft(c) { return 19 + (1 - Math.max(0, Math.min(1, c))) * 69; }
  function trackHtml(w, c, mood) {
    var ticks = V.RANKS.map(function (R, i) { return '<i class="tick r-' + R.id + '" style="left:' + tLeft(REL_C[i]) + '%"><span>' + R.rel + '</span></i>'; }).join('');
    return '<div class="track"><div class="t-line"></div>' + ticks + '<span class="t-me">' + Chara.me() + '</span>' +
      '<span class="t-bud" style="left:' + tLeft(c) + '%">' + cs(w, { mood: mood || 'happy' }) + '<b class="t-say"></b></span></div>';
  }
  function moveTrack(s, w, c, mood, say) {
    var b = $('.t-bud', s); if (!b) return;
    b.style.left = tLeft(c) + '%';
    if (mood) b.firstChild.outerHTML = cs(w, { mood: mood });
    b.classList.remove('hop'); void b.offsetWidth; b.classList.add('hop');
    var t = $('.t-say', b);
    if (t) { t.textContent = say || ''; t.classList.toggle('on', !!say); }
  }
  function nowClose(id) { var c = V.card(id); return c ? Chara.closeness(c.lv, V.condition(id)) : 0.04; }

  /* ---- 広場：自キャラのまわりに、仲間の単語キャラが関係の深さの距離で立つ ----
   *  輪（リング）を5つ：相棒・仲間・顔なじみ・出会った・離れかけ。同じ輪の子は弧の上に等間隔で並ぶ */
  var RING = [0.3, 0.48, 0.66, 0.84, 1.0], RSIZE = [52, 46, 40, 34, 30];
  function ringOf(c) { return c >= 0.85 ? 0 : c >= 0.6 ? 1 : c >= 0.36 ? 2 : c >= 0.16 ? 3 : 4; }
  function renderPlaza() {
    var box = $('#plaza'), ids = Object.keys(S.cards).filter(function (id) { return V.word(id); });
    if (!ids.length) { box.innerHTML = '<span class="p-me">' + Chara.me() + '</span><p class="p-empty">まだ仲間がいない。👀 や 🌱 で単語と出会おう</p>'; return; }
    var rings = [[], [], [], [], []], CAP = [6, 8, 10, 12, 12], shown = 0;
    ids.map(function (id) { return { id: id, c: nowClose(id), st: V.state(id), h: Chara.hash(id) }; })
      .sort(function (a, b) { var fa = famOf(V.word(a.id)) || '~', fb = famOf(V.word(b.id)) || '~'; return fa < fb ? -1 : fa > fb ? 1 : a.h - b.h; })
      .forEach(function (x) { var k = ringOf(x.c); if (rings[k].length < CAP[k]) { rings[k].push(x); shown++; } });
    var html = '';
    rings.forEach(function (list, k) {
      list.forEach(function (x, i) {
        var n = list.length, t = n === 1 ? 0.5 : i / (n - 1);
        var ang = Math.PI * (1.1 + t * 0.8) + (k % 2 ? 0.05 : -0.05);   /* 自キャラの後ろ側の弧 */
        var r = RING[k] - (n > 7 && i % 2 ? 0.07 : 0);
        var left = 50 + Math.cos(ang) * r * 46, bottom = 6 + -Math.sin(ang) * r * 74;
        var w = V.word(x.id);
        html += '<button class="p-bud st-' + x.st + '" data-id="' + x.id + '" aria-label="' + esc(w.w) + '" style="left:' + left.toFixed(1) + '%;bottom:' + bottom.toFixed(1) + '%;width:' + RSIZE[k] + 'px;z-index:' + Math.round(100 - bottom) + '">' +
          cs(w, { mood: Chara.moodOf(x.st), holo: V.card(x.id).lv === 3 }) + (x.st !== 'fresh' ? '<span class="p-st">' + (x.st === 'wild' ? '🍂' : '🥀') + '</span>' : CU && wantOf(w) ? '<span class="p-st">💬</span>' : '') + '</button>';
      });
    });
    var more = ids.length - shown;
    box.innerHTML = html + '<span class="p-me">' + Chara.me() + '</span>' + (more > 0 ? '<span class="p-more">ほか ' + more + '体</span>' : '');
  }

  /* =========================================================
   * ホーム
   * ========================================================= */
  function renderHome() {
    var total = D.words.length, got = V.caughtCount(), wild = V.wildList().length, face = V.faceList().length, meet = V.meetList().length;
    $('#hBrand').textContent = D.brand;
    $('#hDeck').innerHTML = '📚 デッキ：<b>' + esc(deckName()) + '</b><small>切りかえ・読み込み ›</small>';
    $('#hSub').textContent = D.sub;
    $('#hDex').textContent = got + ' / ' + total;
    var rc = V.rankCounts();
    $('#hDexBar').innerHTML = rc.map(function (n, i) { return n ? '<i class="r-' + V.RANKS[i].id + '" style="width:' + (n / total * 100) + '%"></i>' : ''; }).join('');
    $('#hRel').innerHTML = '出会い <b>' + (rc[0] + rc[1]) + '</b>　定着 <b>' + (rc[2] + rc[3]) + '</b>';
    renderPlaza();
    $('#hExp').textContent = '+' + (S.day.date ? S.day.exp : 0);
    $('#hGrown').textContent = S.day.grown.length;
    $$('.mood button').forEach(function (b) { b.classList.toggle('on', b.dataset.mood === S.settings.mood); });
    var tiles = [
      { id: 'face', ico: '👀', name: '顔見知りチェック', sub: face ? '5級の語 残り ' + face + '語' : '', off: !face, hide: !face },
      { id: 'meet', ico: '🌱', name: '出会い', sub: meet ? '新しい単語を3つ' : 'ぜんぶ出会った！', off: !meet },
      { id: 'wild', ico: '⚔', name: '野生戦', sub: wild ? 'しおれた単語 ' + wild + '体' : untilWild(), off: !wild },
      { id: 'conj', ico: '🔁', name: '活用', sub: conjSub(), hide: !CU || !D.words.some(function (w) { return w.pos === 'v'; }) },
      { id: 'dex', ico: '📖', name: '図鑑', sub: wild ? 'しおれ ' + wild + '枚' : got + '枚' }
    ];
    $('#alacarte').innerHTML = tiles.filter(function (t) { return !t.hide; }).map(function (t) {
      return '<button class="tile' + (t.off ? ' off' : '') + '" data-block="' + t.id + '"' + (t.off ? ' disabled' : '') + '><span class="ti">' + t.ico + '</span><b>' + t.name + '</b><small>' + esc(t.sub) + '</small></button>';
    }).join('');
    var wl = CU ? wantsList() : [];
    $('#hWant').hidden = !wl.length;
    if (wl.length) $('#hWant').innerHTML = '<span class="wb">' + cs(wl[0].w, { mood: 'wow' }) + '</span><span>💬 <b>' + esc(wl[0].w.w) + '</b> が <b>' + TN[wl[0].t].name + '</b> を覚えたがっている！' +
      (wl.length > 1 ? '<small>ほかに ' + (wl.length - 1) + '体</small>' : '') + '</span>';
    $('#hRange').hidden = D.sections.length < 2;
    $('#hRange').innerHTML = '📗 範囲：<b>' + esc(rangeText()) + '</b><small>変える ›</small>';
    $('#hWild').hidden = !wild;
    $('#hWild').textContent = '🥀 しおれかけの単語が ' + wild + ' 枚。野生に戻る前に助けよう';
    $('#tgSound').checked = S.settings.sound;
    $('#tgSpeak').checked = S.settings.speak;
    $('#tgSpeakRow').hidden = !Speech.ok();
    if (G) G.fromTo('#home .anim', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'power3.out' });
  }

  function conjSub() {
    if (!CU) return '';
    var got = 0, total = 0; CU.units.forEach(function (u) { var d = unitDone(u); got += d.got; total += d.total; });
    return '動詞の形 ' + got + ' / ' + total + '　次：' + nextUnit().name;
  }
  function rangeText() {
    var r = S.settings.range;
    if (!r || !r.length) return 'すべて';
    var names = D.sections.filter(function (x) { return r.indexOf(x.id) >= 0; }).map(function (x) { return x.name; });
    return names.length <= 2 ? names.join('・') : names[0] + ' ほか' + (names.length - 1);
  }
  function openRange() {
    var r = (S.settings.range || []).slice(), box = $('#sheetBody');
    function draw() {
      box.innerHTML = '<p class="u-title">📗 範囲をえらぶ</p><p class="note">えらんだ範囲の単語だけで、出会い・野生戦・活用をする</p><div class="rng">' +
        D.sections.map(function (x) {
          var ws = D.words.filter(function (w) { return w.s === x.id; }), got = ws.filter(function (w) { return V.card(w.id); }).length;
          return '<button class="rchip' + (r.indexOf(x.id) >= 0 ? ' on' : '') + '" data-sec="' + esc(x.id) + '"><b>' + esc(x.name) + '</b><small>' + (x.ref ? esc(x.ref) + '　' : '') + got + ' / ' + ws.length + '</small></button>';
        }).join('') + '</div><div class="d-btns"><button class="next" id="rOk">この範囲にする</button><button class="ghost" id="rAll">すべてにする</button></div>';
      $$('.rchip', box).forEach(function (b) { b.addEventListener('click', function () { var i = r.indexOf(b.dataset.sec); if (i >= 0) r.splice(i, 1); else r.push(b.dataset.sec); draw(); }); });
      $('#rOk', box).addEventListener('click', function () { S.settings.range = r.length === D.sections.length ? [] : r; V.save(); closeSheet(); renderHome(); });
      $('#rAll', box).addEventListener('click', function () { S.settings.range = []; V.save(); closeSheet(); renderHome(); });
    }
    draw();
    $('#sheet').hidden = false;
    tw($('#sheet .sh'), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' });
  }
  /* 次の野生まで（再会は翌日から。出会った当日は「あと○時間」と見せる） */
  function untilWild() {
    var t = V.nextWild(); if (t === null) return 'まだカードがない';
    var h = (t - Date.now()) / 3600e3;
    return h < 1 ? 'もうすぐ野生が出る' : '次の野生まで あと ' + Math.round(h) + '時間';
  }

  /* おまかせ：その日の状態からブロックを組む */
  function makePlan(min) {
    var easy = S.settings.mood === 'easy';
    var wild = wildAll().length, face = V.faceList().length, meet = V.meetList().length, plan = [];
    function add(type, n, have) { if (have > 0) plan.push({ type: type, n: Math.min(n, have) }); }
    var wl = CU ? wantsList() : [], wantN = wl.length;
    function addLearn(k) { wl.slice(0, k).forEach(function (x) { plan.push({ type: 'learn', verb: x.w.id, tense: x.t }); }); }
    if (min === 1) {
      if (wild) add('wild', 3, wild); else if (face) add('face', 5, face); else if (!easy) add('meet', 1, meet);
    } else if (min === 5) {
      add('wild', easy ? 6 : 4, wild);
      add('face', easy ? (wild ? 6 : 10) : 5, face);
      if (!easy && wantN) addLearn(1);
      if (!easy) { if (meet) add('meet', 3, meet); else if (CU && !wantN) plan.push({ type: 'conj', unit: nextUnit().id, n: 3 }); }
      if (!plan.length) add('meet', 3, meet);
    } else {
      add('wild', easy ? 10 : 8, wild);
      add('face', easy ? 12 : 8, face);
      if (!easy) add('meet', 3, meet);
      if (!easy && wantN) addLearn(2); else if (!easy && CU) plan.push({ type: 'conj', unit: nextUnit().id, n: 3 });
      if (!plan.length) add('meet', 3, meet);
    }
    return plan;
  }

  /* =========================================================
   * セッション（ブロックを順に回す）
   * ========================================================= */
  var ses = null;
  var BNAME = { face: '👀 顔見知りチェック', meet: '🌱 出会い', wild: '⚔ 野生戦', rescue: '🚑 救出', conj: '🔁 活用', learn: '💬 新しいフォルム' };
  function start(plan, label) {
    if (!plan.length) { toast('いまは、やることがありません', '図鑑を眺めたり、別のメニューを選んだりしてみよう'); return; }
    if (window.Sfx) Sfx.unlock();
    var w0 = CU ? wantsList().map(function (x) { return x.w.id + ':' + x.t; }) : [];
    ses = { wants0: w0, plan: plan, bi: -1, label: label || '', caught: [], ups: [], exp: 0, ok: 0, ng: 0, combo: 0, backs: 0, backIds: [], met: [] };
    go('play');
    renderSteps();
    nextBlock();
  }
  function renderSteps() {
    $('#steps').innerHTML = ses.plan.map(function (b, i) { return '<i class="' + (i < ses.bi ? 'done' : i === ses.bi ? 'now' : '') + '"></i>'; }).join('');
    $('#phase').textContent = ses.bi >= 0 && ses.plan[ses.bi] ? BNAME[ses.plan[ses.bi].type] : '';
    $('#pDex').textContent = V.caughtCount();
  }
  function nextBlock() {
    ses.bi++;
    renderSteps();
    var b = ses.plan[ses.bi];
    if (!b) return finish();
    ({ face: blockFace, meet: blockMeet, wild: blockWild, rescue: blockRescue, conj: blockConj, learn: blockLearn })[b.type](b, nextBlock);
  }
  function stage(html) { var s = $('#stage'); s.innerHTML = html; tw(s.firstElementChild, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }); return s; }

  /* ---- 選択肢 ---- */
  function others(w, n, key) {
    var val = function (x) { return key === 'head' ? V.head(x) : key === 'form' ? formOf(x) : x.ja; };
    var mine = val(w), seen = {}; seen[mine] = 1;
    var same = shuffle(D.words.filter(function (x) { return x !== w && x.pos === w.pos; }));
    var rest = shuffle(D.words.filter(function (x) { return x !== w && x.pos !== w.pos; }));
    var out = [];
    same.concat(rest).forEach(function (x) { var v = val(x); if (out.length < n && !seen[v]) { seen[v] = 1; out.push(v); } });
    return out;
  }
  function formOf(w) { var m = /\{([^}]+)\}/.exec(w.ex[0]); return m ? m[1] : w.w; }
  function choiceHtml(list, cls) { return '<div class="choices ' + (cls || '') + '">' + list.map(function (c, i) { return '<button class="ch" data-i="' + i + '">' + c + '</button>'; }).join('') + '</div>'; }

  /* ---- 1問（いろいろな問い方）。done(ok) ---- */
  function ask(w, type, opt, done) {
    opt = opt || {};
    var right, list, body, prompt;
    var tag = opt.tag || '';
    if (type === 'spell') return askSpell(w, opt, done);
    if (type === 'form') return askForm(w, opt, done);
    if (type === 'es2ja') {
      prompt = '<div class="q-card' + gcls(w) + rankCls(w.id) + '">' + tag + '<div class="q-word">' + headHtml(w) + '</div>' + sayBtn(V.head(w)) + '</div><p class="q-ask">意味は？</p>';
      right = w.ja; list = shuffle([right].concat(others(w, 3, 'ja'))).map(esc);
    } else if (type === 'listen') {
      prompt = '<div class="q-card listen' + rankCls(w.id) + '">' + tag + '<button class="big-say" data-say="' + esc(V.head(w)) + '">🔊</button><button class="say slow" data-say="' + esc(V.head(w)) + '">🐢</button></div><p class="q-ask">聞こえた単語の意味は？</p>';
      right = w.ja; list = shuffle([right].concat(others(w, 3, 'ja'))).map(esc);
    } else if (type === 'ja2es') {
      prompt = '<div class="q-card ja' + rankCls(w.id) + '">' + tag + '<div class="q-ja">' + esc(w.ja) + '</div><small class="pos">' + POS[w.pos] + '</small></div><p class="q-ask">スペイン語では？</p>';
      right = V.head(w); list = shuffle([right].concat(others(w, 3, 'head'))).map(esc);
    } else if (type === 'cloze') {
      prompt = '<div class="q-card cloze' + rankCls(w.id) + '">' + tag + '<div class="q-ex">' + esc(w.ex[0]).replace(/\{[^}]+\}/, '<span class="blank">？</span>') + '</div><small class="q-exja">' + esc(w.ex[1]) + '</small></div><p class="q-ask">？に入るのは？</p>';
      /* 選択肢の大文字・小文字をそろえる（文頭の空欄だけ大文字、だと答えがばれる） */
      var top = /^[¿¡]?\{/.test(w.ex[0]);
      var cs = function (x) { return top ? x.charAt(0).toUpperCase() + x.slice(1) : x.charAt(0).toLowerCase() + x.slice(1); };
      right = formOf(w); list = shuffle([right].concat(others(w, 3, 'form').map(cs))).map(esc);
    }
    var s = stage('<div class="q">' + (opt.track || '') + prompt + choiceHtml(list, type === 'ja2es' || type === 'cloze' ? 'es' : '') + '<div class="after"></div></div>');
    if (type === 'es2ja' || type === 'listen') setTimeout(function () { Speech.say(V.head(w)); }, 250);
    var answered = false, ri = list.indexOf(esc(right));
    $$('.ch', s).forEach(function (b) {
      b.addEventListener('click', function () {
        if (answered) return; answered = true;
        var ok = +b.dataset.i === ri;
        $$('.ch', s).forEach(function (x) { x.disabled = true; if (+x.dataset.i === ri) x.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        var card = $('.q-card', s);
        if (type === 'listen') card.insertAdjacentHTML('beforeend', '<div class="q-word reveal' + gcls(w) + '">' + headHtml(w) + '</div>');
        if (type === 'cloze') { var bl = $('.blank', s); if (bl) { bl.textContent = right; bl.classList.add('filled'); } }
        if (type === 'ja2es' || type === 'cloze') Speech.say(type === 'cloze' ? w.ex[0] : V.head(w));
        feedback(ok, b, card);
        done(ok, s);
      });
    });
  }
  /* つづりを部品で組み立てる */
  function chunks(word) {
    var m = word.match(/[^aeiouáéíóúü]*[aeiouáéíóúü]+(?:[^aeiouáéíóúü](?![aeiouáéíóúü]))*/gi) || [word];
    var joined = m.join('');
    if (joined.length < word.length) m[m.length - 1] += word.slice(joined.length);
    return m;
  }
  function askSpell(w, opt, done) {
    var parts = chunks(w.w), other = pick(D.words.filter(function (x) { return x !== w; })).w;
    var decoy = pick(chunks(other));
    if (parts.length < 3) { parts = w.w.split(''); decoy = pick(other.split('')); }   // 短い語は1文字ずつ
    var tiles = shuffle(parts.concat(parts.indexOf(decoy) < 0 ? [decoy] : []));
    var a = V.art(w);
    var s = stage('<div class="q">' + (opt.track || '') + '<div class="q-card ja' + rankCls(w.id) + '">' + (opt.tag || '') + '<div class="q-ja">' + esc(w.ja) + '</div><small class="pos">' + POS[w.pos] + '</small></div>' +
      '<p class="q-ask">つづりを組み立てよう</p><div class="spell' + gcls(w) + '">' + (a ? '<span class="art">' + a + '</span>' : '') + '<span class="slot"></span></div>' +
      '<div class="tiles">' + tiles.map(function (t, i) { return '<button class="tl" data-i="' + i + '">' + esc(t) + '</button>'; }).join('') + '</div>' +
      '<div class="spell-ctl"><button class="undo">⌫ 1つ戻す</button></div><div class="after"></div></div>');
    var got = [], slot = $('.slot', s), fin = false;
    function draw() { slot.textContent = got.map(function (g) { return tiles[g]; }).join(''); $$('.tl', s).forEach(function (b) { b.disabled = fin || got.indexOf(+b.dataset.i) >= 0; }); }
    $$('.tl', s).forEach(function (b) {
      b.addEventListener('click', function () {
        if (fin) return;
        got.push(+b.dataset.i); if (window.Snd && Snd.tap) Snd.tap(); draw();
        var now = slot.textContent;
        if (now.length >= w.w.length) {
          fin = true; draw();
          var ok = now === w.w;
          if (!ok) slot.insertAdjacentHTML('afterend', '<span class="fix">→ ' + esc(w.w) + '</span>');
          Speech.say(V.head(w));
          feedback(ok, slot, $('.q-card', s));
          done(ok, s);
        }
      });
    });
    $('.undo', s).addEventListener('click', function () { if (!fin) { got.pop(); draw(); } });
  }

  function feedback(ok, el, card) {
    if (ok) {
      ses.ok++; ses.combo++;
      if (window.Snd) Snd.ok(ses.combo);
      FX.float(el, ses.combo >= 3 ? PRAISE[Math.min(PRAISE.length - 1, ses.combo - 2)] : '○', 'ok');
      FX.burst(el, null, 14);
    } else {
      ses.ng++; ses.combo = 0;
      if (window.Snd) Snd.ng();
      FX.shake(card);
    }
  }
  /* 答えのあとの「つぎへ」（まちがえたときは読む時間をとる） */
  function after(s, html, cb, auto) {
    var box = $('.after', s);
    box.innerHTML = (html || '') + '<button class="next">つぎへ ▶</button>';
    tw(box, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 });
    /* 説明が画面の下に隠れていたら見える所までスクロール */
    var r = box.getBoundingClientRect();
    if (r.bottom > innerHeight) window.scrollBy({ top: Math.min(r.top - 70, r.bottom - innerHeight + 16), behavior: 'smooth' });
    var gone = false;
    function nx() { if (gone) return; gone = true; cb(); }
    $('.next', box).addEventListener('click', nx);
    if (auto) setTimeout(nx, auto);
  }
  function refHtml(w) {
    if (!D.book) return '';
    var sec = V.SEC[w.s];
    return '<small class="ref">📗 ' + esc(sec ? sec.name : w.s) + (w.ref ? '・' + esc(w.ref) : '') + '</small>';
  }
  function memoHtml(w) {
    return '<div class="exp-box"><div class="ex">' + exHtml(w.ex[0]) + ' ' + sayBtn(w.ex[0]) + '</div><small>' + esc(w.ex[1]) + '</small>' +
      (w.memo ? '<p class="memo">💡 ' + esc(w.memo) + '</p>' : '') + verbHtml(w) + (CU ? famHtml(w) : '') + '</div>';
  }
  /* 動詞：活用のくせと、大事な3つの形（現在 yo・点過去 yo・過去分詞） */
  function verbHtml(w) {
    if (w.pos !== 'v' || !window.Conj) return '';
    return '<p class="memo">🔁 ' + esc(Conj.kind(w.w)) + '：' + esc(Conj.form(w.w, 'pres', 0)) + '（現在）・' + esc(Conj.form(w.w, 'pret', 0)) + '（点過去）・' + esc(Conj.form(w.w, 'perf', 0).replace(/^(me |)he /, '')) + '（過去分詞）</p>';
  }

  /* ---- 捕獲の演出：カードが図鑑（右上）へ飛ぶ ---- */
  function captureFx(w, from, known) {
    var r = V.capture(w.id, known);
    ses.caught.push(w.id); ses.exp += r.exp;
    if (window.Snd) Snd.capture();
    var src = from || $('#stage');
    var fly = document.createElement('div');
    fly.className = 'fly-card' + gcls(w) + ' r-bronze';
    fly.innerHTML = cs(w, { mood: 'happy' }) + headHtml(w);
    var a = src.getBoundingClientRect(), b = $('#pDexBox').getBoundingClientRect();
    fly.style.left = (a.left + a.width / 2) + 'px'; fly.style.top = (a.top + a.height / 2) + 'px';
    document.body.appendChild(fly);
    FX.burst(src, null, 22);
    FX.float(src, '¡Capturado!', 'cap');
    var end = function () { fly.remove(); $('#pDex').textContent = V.caughtCount(); tw($('#pDexBox'), { scale: 1.5 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }); };
    if (!G) return end();
    G.timeline({ onComplete: end })
      .fromTo(fly, { xPercent: -50, yPercent: -50, scale: 0.6, opacity: 0 }, { scale: 1.15, opacity: 1, duration: 0.3, ease: 'back.out(2)' })
      .to(fly, { left: b.left + b.width / 2, top: b.top + b.height / 2, scale: 0.2, rotate: 20, duration: 0.55, ease: 'power2.in', delay: 0.25 });
  }
  function levelFx(w, up) {
    ses.ups.push(w.id);
    setTimeout(function () {
      if (window.Snd) Snd.levelUp(up);
      FX.slam(pick(['¡EVOLUCIÓN!', '¡OLÉ!', '¡ARRIBA!']), w.w + ' と ' + V.RANKS[up].rel + 'に！（' + V.RANKS[up].name + '）');
      FX.rain(up >= 3 ? 'petal' : null);
    }, 350);
  }

  /* =========================================================
   * 👀 顔見知りチェック
   * ========================================================= */
  function blockFace(b, next) {
    var list = shuffle(V.faceList()).slice(0, b.n), i = 0;
    function one() {
      var w = list[i++]; if (!w) return next();
      var tag = '<span class="qtag">👀 ' + i + ' / ' + list.length + '</span>';
      var right = w.ja, opts = shuffle([right].concat(others(w, 3, 'ja')));
      var s = stage('<div class="q">' + trackHtml(w, 0.05, 'wow') + '<div class="q-card' + gcls(w) + '">' + tag + '<div class="q-word">' + headHtml(w) + '</div>' + sayBtn(V.head(w)) + '</div>' +
        '<p class="q-ask">知ってる？ 意味は？</p>' + choiceHtml(opts.map(esc)) + '<button class="dunno">🤔 わからない（出会いで覚える）</button><div class="after"></div></div>');
      setTimeout(function () { Speech.say(V.head(w)); }, 250);
      var answered = false, ri = opts.indexOf(right);
      function settle(ok, el) {
        if (answered) return; answered = true;
        $$('.ch, .dunno', s).forEach(function (x) { x.disabled = true; if (x.classList.contains('ch') && +x.dataset.i === ri) x.classList.add('right'); });
        if (ok) { feedback(true, el, $('.q-card', s)); moveTrack(s, w, REL_C[0], 'happy', '¡Hola!'); captureFx(w, $('.q-card', s), true); setTimeout(one, 1300); }
        else {
          if (el.classList.contains('ch')) { el.classList.add('wrong'); feedback(false, el, $('.q-card', s)); } else ses.combo = 0;
          V.toMeet(w.id); moveTrack(s, w, 0.02, 'meh');
          after(s, '<p class="note">「' + esc(w.ja) + '」。この単語は🌱出会いで、ゆっくり覚えよう。</p>', one);
        }
      }
      $$('.ch', s).forEach(function (x) { x.addEventListener('click', function () { settle(+x.dataset.i === ri, x); }); });
      $('.dunno', s).addEventListener('click', function (e) { settle(false, e.currentTarget); });
    }
    one();
  }

  /* =========================================================
   * 🌱 出会い：予想 → 説明 → 見分ける → 捕獲
   * ========================================================= */
  var CLUE = { cog: '🔗 英語と似ている', trap: '⚠️ 英語と似ているけど…', parts: '🧩 部品に分けると', ctx: '🎬 こんな場面' };
  function blockMeet(b, next) {
    var words = V.meetList().slice(0, b.n), k = 0;
    function meetOne() {
      var w = words[k++];
      if (!w) return discern();
      var c = w.clue || { t: 'ctx', text: '' };
      var opts = [w.ja];
      if (c.lure) opts.push(c.lure);
      opts = shuffle(opts.concat(others(w, 3 - opts.length, 'ja').filter(function (x) { return x !== c.lure; }).slice(0, 3 - opts.length)));
      var s = stage('<div class="q meet">' + trackHtml(w, 0.04, 'wow') + '<div class="q-card big' + gcls(w) + '"><span class="qtag">🌱 出会い ' + k + ' / ' + words.length + '</span>' +
        '<div class="q-word">' + headHtml(w) + '</div>' + sayBtn(V.head(w)) + '<small class="pos">' + POS[w.pos] + (w.pos === 'n' ? (w.g === 'f' ? '・女性' : '・男性') : '') + '</small>' + refHtml(w) + '</div>' +
        '<div class="clue"><b>' + CLUE[c.t] + '</b><p>' + esc(c.text) + '</p>' + (c.t === 'ctx' ? '<div class="ex">' + exHtml(w.ex[0]) + '</div>' : '') + '</div>' +
        '<p class="q-ask">🤔 どんな意味だと思う？<small>（予想なので、まちがえても大丈夫）</small></p>' + choiceHtml(opts.map(esc)) + '<div class="after"></div></div>');
      setTimeout(function () { Speech.say(V.head(w)); }, 300);
      var done = false, ri = opts.indexOf(w.ja);
      $$('.ch', s).forEach(function (x) {
        x.addEventListener('click', function () {
          if (done) return; done = true;
          var ok = +x.dataset.i === ri;
          $$('.ch', s).forEach(function (y) { y.disabled = true; if (+y.dataset.i === ri) y.classList.add('right'); });
          if (!ok) x.classList.add('miss');
          if (window.Snd) (ok ? Snd.ok(0) : Snd.flip());
          if (ok) FX.burst(x, 'petal', 16);
          moveTrack(s, w, 0.11, 'happy', ok ? '¡Sí!' : '');
          var head = ok ? '🎯 予想的中！' : c.t === 'trap' && opts[+x.dataset.i] === c.lure ? '😆 ひっかかった！ 英語とはちがう意味' : '💡 正解は…';
          after(s, '<p class="reveal-h">' + head + '</p><div class="meaning' + gcls(w) + '">' + headHtml(w) + ' ＝ <b>' + esc(w.ja) + '</b></div>' + memoHtml(w), meetOne);
          if (ses.met.indexOf(w.id) < 0) ses.met.push(w.id);
        });
      });
    }
    /* 見分ける：1語につき2問（意味を選ぶ・スペイン語を選ぶ）。まちがえたら後ろへ */
    function discern() {
      if (!words.length) return next();
      var need = {}, q = [];
      var close = {};
      words.forEach(function (w) { need[w.id] = 2; close[w.id] = 0.11; q.push([w, Speech.ok() && Math.random() < 0.5 ? 'listen' : 'es2ja']); });
      q = shuffle(q).concat(shuffle(words.map(function (w) { return [w, 'ja2es']; })));
      var total = q.length, n = 0;
      function one() {
        var it = q.shift(); if (!it) return next();
        n++;
        ask(it[0], it[1], { tag: '<span class="qtag">🌱 見分ける ' + Math.min(n, total) + ' / ' + total + '</span>', track: trackHtml(it[0], close[it[0].id], 'happy') }, function (ok, s) {
          var w = it[0];
          if (ok) {
            need[w.id]--;
            close[w.id] = need[w.id] <= 0 ? REL_C[0] : close[w.id] + 0.07;
            if (need[w.id] <= 0) { moveTrack(s, w, close[w.id], 'happy', '出会った！'); captureFx(w, $('.q-card', s), false); setTimeout(one, 1400); }
            else { moveTrack(s, w, close[w.id], 'happy'); setTimeout(one, 900); }
          } else { close[w.id] = Math.max(0.04, close[w.id] - 0.04); moveTrack(s, w, close[w.id], 'meh'); q.push(it); total++; after(s, '<div class="meaning' + gcls(w) + '">' + headHtml(w) + ' ＝ <b>' + esc(w.ja) + '</b></div>', one); }
        });
      }
      stage('<div class="interlude"><p class="big-t">🌱 ' + words.length + '語と出会った！</p><p>見分けられたら「出会った」の距離まで近づいて、図鑑に入るよ。<br>もっと近づく（顔なじみ・仲間）のは、日を空けて思い出せたとき</p><button class="next go">見分ける ▶</button></div>');
      $('#stage .go').addEventListener('click', one);
    }
    meetOne();
  }

  /* =========================================================
   * ⚔ 野生戦・🚑 救出
   * ========================================================= */
  function typesFor(w) {
    var c = V.card(w.id), lv = c ? c.lv : 0, easy = S.settings.mood === 'easy', t = ['es2ja'];
    if (Speech.ok()) t.push('listen');
    if (easy) return pick(t);
    if (lv >= 1) t.push('ja2es');
    if (lv >= 2) t.push('spell');
    if (lv >= 3) t.push('cloze');
    if (w.pos === 'v' && CU && learned(w).length && Math.random() < 0.45) return 'form';
    return Math.random() < 0.5 ? t[t.length - 1] : pick(t);   // 半分は、いまのレベルのいちばん難しい問い方
  }
  function fight(w, tagText, cb) {
    var wasWild = V.state(w.id) === 'wild';
    var tag = '<span class="qtag">' + tagText + '</span><span class="wild-badge">' + (wasWild ? '🍂 野生に戻りかけ' : '🥀 しおれかけ') + '</span>';
    var c0 = nowClose(w.id), m0 = Chara.moodOf(V.state(w.id));
    stage('<div class="appear"><p>' + (wasWild ? '野生に戻りかけの' : 'しおれかけの') + '</p><div class="ap-bud">' + cs(w, { mood: m0 }) + '</div><p>が 遠くに いる！</p></div>');
    if (window.Snd) Snd.appear();
    setTimeout(function () {
      ask(w, typesFor(w), { tag: tag, track: trackHtml(w, c0, m0) }, function (ok, s) {
        var r = V.answer(w.id, ok);
        if (ok) moveTrack(s, w, Chara.closeness(V.card(w.id).lv, 1), 'happy', r.back ? 'おかえり！' : r.up ? V.RANKS[r.up].rel + 'に！' : '¡Hola!');
        else moveTrack(s, w, Math.max(0.03, c0 - 0.12), 'sleep', '…');
        if (ok) {
          ses.exp += r.exp;
          FX.float($('.q-card', s), '+' + r.exp + ' EXP', 'exp');
          if (r.back) { ses.backs++; ses.backIds.push(w.id); setTimeout(function () { if (window.Snd) Snd.back(); FX.float($('.q-card', s), 'おかえり！', 'cap'); }, 500); }
          if (r.up) levelFx(w, r.up);
          after(s, gaugeHtml(w), cb, r.up ? 0 : 1400);
        } else {
          after(s, '<div class="meaning' + gcls(w) + '">' + headHtml(w) + ' ＝ <b>' + esc(w.ja) + '</b></div><p class="note">にげられた… また出てくるので、そのとき取り返そう</p>', cb);
        }
      });
    }, 900);
  }
  function gaugeHtml(w) {
    var c = V.card(w.id), nx = V.toNext(w.id);
    return '<div class="gauge"><span class="rk r-' + V.RANKS[c.lv].id + '">' + V.RANKS[c.lv].name + '・' + V.RANKS[c.lv].rel + '</span>' +
      (nx ? '<div class="gbar"><i style="width:' + Math.min(100, Math.round(nx.now / nx.need * 100)) + '%"></i></div><small>進化まで ' + Math.max(0, nx.need - nx.now) + ' EXP</small>' : '<small>最高ランク！</small>') + '</div>';
  }
  function blockWild(b, next) {
    var list = wildAll().slice(0, b.n), i = 0;
    (function one() {
      var id = list[i++]; if (!id) return next();
      var tg = '⚔ ' + i + ' / ' + list.length;
      if (V.isCj(id)) fightCj(id, tg, one); else fight(V.word(id), tg, one);
    })();
  }
  /* 単語と活用のしおれたカードを、コンディションの低い順に */
  function wildAll() {
    return V.wildList().map(function (w) { return w.id; }).concat(V.cjWildList())
      .sort(function (a, b) { return V.condition(a) - V.condition(b); });
  }
  function blockRescue(b, next) { if (V.isCj(b.id)) fightCj(b.id, '🚑 救出', next); else fight(V.word(b.id), '🚑 救出', next); }

  /* =========================================================
   * 🔁 活用（動詞の形）
   *  ユニット＝1つのくせ。はじめは「お手本の表 → 予想 → 説明」、それから練習
   *  練習の問い方：組み立てる（語幹＋語尾）／形をえらぶ／誰の形？／文の手がかりから時制をえらぶ
   *  動詞×時制ごとにカード（cj:動詞:時制）。2回正解で覚えた（ブロンズ）。成長・しおれは単語と同じ
   * ========================================================= */
  var CU = (!D.lang || D.lang === 'es') && window.Conj ? window.VOCAB_CONJ || null : null, TN = window.Conj ? Conj.TENSES : {};
  /* お手本・予想の動詞（デッキになければ、活用レッスンの辞書 lex から） */
  function mw(id) { return V.word(id) || { id: 'lex-' + id, w: id, ja: (CU && CU.lex && CU.lex[id]) || '', pos: 'v', i: 0 }; }
  var PRON_SHOW = ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'];
  function pronOf(p, t) { return t === 'imp' ? (p === 1 ? 'tú' : 'usted') : PRON_SHOW[p]; }
  function pjOf(p, t) { return t === 'imp' ? (p === 1 ? '君に' : 'あなたに') : Conj.PRON_JA[p]; }
  function personsOf(w, t) { return [0, 1, 2, 3, 4, 5].filter(function (p) { return Conj.form(w.w, t, p); }); }
  function tBadge(t) { var L = CU.look[t]; return '<span class="tbadge" style="--tc:' + L.color + '">' + L.ico + ' ' + TN[t].name + '</span>'; }
  function unitOf(id) { return CU.units.filter(function (u) { return u.id === id; })[0]; }
  function unitCards(u) {
    var out = [];
    D.words.forEach(function (w) {
      if (w.pos !== 'v' || !V.inRange(w)) return;
      (u.tenses || [u.tense]).forEach(function (t) { if (unitFor(w, t) === u.id && personsOf(w, t).length) out.push(V.cjId(w.id, t)); });
    });
    return out;
  }
  function unitDone(u) { var c = unitCards(u); return { got: c.filter(function (id) { return V.card(id); }).length, total: c.length }; }
  function nextUnit() { return CU.units.filter(function (u) { var d = unitDone(u); return d.got < d.total; })[0] || CU.units[0]; }

  /* 語幹｜語尾 に分ける（組み立て問題と、表の色分けに使う）。分けられない形は null */
  function endingsFor(v, t, p) {
    var E = Conj.END, c = v.cls;
    if (t === 'fut') return Conj.FUT;
    if (t === 'cond') return Conj.COND;
    if (t === 'imp') return p === 1 ? E.pres[c] : E.subj[c];
    if (t === 'pret' && v.x.pretS) return Conj.STRONG.concat(['eron']);
    return E[t] ? E[t][c] : [];
  }
  function splitForm(inf, t, p) {
    var f = Conj.form(inf, t, p); if (!f) return null;
    var v = Conj.parse(inf), pre = '';
    if (t === 'perf') { var a = f.split(' '); if (v.refl) pre = a.shift() + ' '; return { pre: pre, a: a[0], b: a[1], perf: true, full: f }; }
    if (t === 'imp' && v.refl) return null;
    if (v.refl) { pre = f.split(' ')[0] + ' '; f = f.slice(pre.length); }
    var x = v.x;
    if ((t === 'pres' && x.pres) || (t === 'pret' && x.pret) || (t === 'impf' && x.impf) || (t === 'subj' && x.subj)) return null;
    if (t === 'imp' && (p === 1 ? x.tu : x.subj)) return null;
    if (t === 'pres' && p === 0 && x.yo) return null;
    if (t === 'pret' && x.pretS === 'hic' && p === 2) return null;
    var best = '';
    endingsFor(v, t, p).forEach(function (e) { if (e.length > best.length && f.length > e.length && f.slice(-e.length) === e) best = e; });
    if (!best) return null;
    return { pre: pre, a: f.slice(0, -best.length), b: best, full: pre + f };
  }
  /* 活用表（その人称を強調。語幹と語尾を色分け） */
  function conjTable(inf, t, hi) {
    var ps = t === 'imp' ? [1, 2] : [0, 1, 2, 3, 4, 5];
    return '<table class="ctab">' + ps.map(function (p) {
      var f = Conj.form(inf, t, p); if (!f) return '';
      var sp = splitForm(inf, t, p), cell;
      if (sp && sp.perf) cell = esc(sp.pre) + '<span class="c-aux">' + esc(sp.a) + '</span> <span class="c-st">' + esc(sp.b) + '</span>';
      else if (sp) cell = (sp.pre ? '<span class="c-pre">' + esc(sp.pre) + '</span>' : '') + '<span class="c-st">' + stemDiff(sp.a, Conj.parse(inf), t) + '</span><span class="c-end">' + esc(sp.b) + '</span>';
      else cell = '<span class="c-irr">' + esc(f) + '</span>';
      return '<tr' + (p === hi ? ' class="hi"' : '') + '><th>' + pronOf(p, t) + '</th><td>' + cell + '</td><td class="c-say">' + sayBtn(f) + '</td></tr>';
    }).join('') + '</table>';
  }
  /* 語幹の、原形から変わった所に印（pens → pi<u>e</u>ns） */
  function stemDiff(stem, v, t) {
    var base = t === 'fut' || t === 'cond' ? v.base : v.stem;
    if (stem === base) return esc(stem);
    var i = 0; while (i < stem.length && i < base.length && stem[i] === base[i]) i++;
    var j = 0; while (j < stem.length - i && j < base.length - i && stem[stem.length - 1 - j] === base[base.length - 1 - j]) j++;
    return esc(stem.slice(0, i)) + '<u class="c-chg">' + esc(stem.slice(i, stem.length - j)) + '</u>' + esc(stem.slice(stem.length - j));
  }
  function cjCard(w, t, p, tag) {
    return '<div class="q-card cj">' + (tag || '') + '<div class="cj-top">' + tBadge(t) + '</div>' +
      '<div class="cj-verb"><b>' + esc(w.w) + '</b><small>' + esc(w.ja) + '</small></div>' +
      '<div class="pchip">' + pronOf(p, t) + '<small>' + pjOf(p, t) + '</small></div></div>';
  }
  function uniq(a) { var o = []; a.forEach(function (x) { if (x && o.indexOf(x) < 0) o.push(x); }); return o; }

  /* ---- 活用の1問。type: build | pick | which | cue。done(ok, s) ---- */
  function askConj(it, type, opt, done) {
    var w = it.w, t = it.t, p = it.p, right = Conj.form(w.w, t, p), tag = opt.tag || '';
    VUI.cur = { w: w.w, t: t, p: p, right: right };   /* 自動テスト用 */
    var sp = splitForm(w.w, t, p);
    if (type === 'build' && !sp) type = 'pick';
    if (type === 'which') {
      var same = personsOf(w, t).filter(function (q) { return Conj.form(w.w, t, q) === right; });
      if (same.length > 1 || personsOf(w, t).length < 3) type = 'pick';
    }
    var html, list, ri, isRight;
    if (type === 'build') return askBuild(it, sp, opt, done);
    if (type === 'pick') {
      var ds = [Conj.regularForm(w.w, t, p)].concat(shuffle(personsOf(w, t).map(function (q) { return Conj.form(w.w, t, q); })),
        shuffle(['pres', 'pret', 'subj', 'fut'].filter(function (x) { return x !== t; }).map(function (x) { return Conj.form(w.w, x, p); })));
      list = shuffle([right].concat(uniq(ds).filter(function (x) { return x !== right; }).slice(0, 3)));
      html = cjCard(w, t, p, tag) + '<p class="q-ask">この形は？</p>' + choiceHtml(list.map(esc), 'es');
      isRight = function (i) { return list[i] === right; };
    } else if (type === 'which') {
      var others2 = shuffle(personsOf(w, t).filter(function (q) { return q !== p && Conj.form(w.w, t, q) !== right; })).slice(0, 3);
      var ps = shuffle([p].concat(others2));
      list = ps.map(function (q) { return pronOf(q, t) + '<small>' + pjOf(q, t) + '</small>'; });
      html = '<div class="q-card cj"><div class="cj-top">' + tBadge(t) + '</div><div class="cj-form">' + esc(right) + '</div><small class="pos">' + esc(w.w) + '（' + esc(w.ja) + '）</small>' + sayBtn(right) + '</div><p class="q-ask">誰の形？</p>' + choiceHtml(list);
      isRight = function (i) { return ps[i] === p; };
    } else {
      var cue = pick(CU.cues[t]); if (t === 'subj' && p === 0) cue = ['Ojalá que', '〜だといいな'];
      var sent = t === 'imp' ? cue[0] + ' <span class="blank">？</span>!' : cue[0] + ' (' + pronOf(p, t) + ') <span class="blank">？</span>.';
      var ts = shuffle(['pres', 'pret', 'impf', 'fut', 'subj', 'perf', 'cond'].filter(function (x) { return x !== t; }));
      list = shuffle([right].concat(uniq(ts.map(function (x) { return Conj.form(w.w, x, p); })).filter(function (x) { return x !== right; }).slice(0, 3)));
      html = '<div class="q-card cj cue"><div class="q-ex">' + sent + '</div><small class="q-exja">' + esc(cue[0].replace(/[¡,]/g, '')) + '＝' + esc(cue[1]) + '　／　' + esc(w.w) + '（' + esc(w.ja) + '）' + (t === 'imp' ? '　／　' + pronOf(p, t) + 'に' : '') + '</small></div>' +
        '<p class="q-ask">？に入る形は？<small>（手がかりの言葉から時制を決める）</small></p>' + choiceHtml(list.map(esc), 'es');
      isRight = function (i) { return list[i] === right; };
    }
    var s = stage('<div class="q">' + (opt.track || '') + html + '<div class="after"></div></div>');
    var answered = false;
    $$('.ch', s).forEach(function (b) {
      b.addEventListener('click', function () {
        if (answered) return; answered = true;
        var i = +b.dataset.i, ok = isRight(i);
        $$('.ch', s).forEach(function (x) { x.disabled = true; if (isRight(+x.dataset.i)) x.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        var bl = $('.blank', s); if (bl) { bl.textContent = right; bl.classList.add('filled'); }
        Speech.say(right);
        feedback(ok, b, $('.q-card', s));
        done(ok, s);
      });
    });
  }
  /* 組み立て：① 語幹（または haber）→ ② 語尾（または過去分詞） */
  function askBuild(it, sp, opt, done) {
    var w = it.w, t = it.t, p = it.p, v = Conj.parse(w.w), A, B;
    if (sp.perf) {
      A = shuffle(Conj.HABER.slice());
      var reg = v.cls === 'ar' ? v.stem + 'ado' : v.stem + 'ido', wrong = v.stem + (v.cls === 'ar' ? 'ido' : 'ado');
      B = shuffle(uniq([sp.b, reg, wrong, Conj.form(w.w, 'pret', 2)]));
    } else {
      var stems = [];
      [t, 'pres'].forEach(function (tt) { [0, 1, 2, 3, 4, 5].forEach(function (q) { var x = splitForm(w.w, tt, q); if (x && !x.perf) stems.push(x.a); }); });
      stems.push(v.stem, t === 'fut' || t === 'cond' ? v.base : '');
      A = shuffle([sp.a].concat(shuffle(uniq(stems).filter(function (x) { return x !== sp.a; })).slice(0, 3)));
      var ends = endingsFor(v, t, p), conf = t === 'subj' ? Conj.END.pres[v.cls] : t === 'pres' ? Conj.END.subj[v.cls] : t === 'pret' ? Conj.END.pres[v.cls] : t === 'cond' ? Conj.FUT : t === 'fut' ? Conj.COND : Conj.END.pret[v.cls];
      B = shuffle([sp.b].concat(shuffle(uniq(ends.concat(conf)).filter(function (x) { return x !== sp.b; })).slice(0, 5)));
    }
    var oneA = A.length === 1;
    var s = stage('<div class="q">' + (opt.track || '') + cjCard(w, t, p, opt.tag) +
      '<p class="q-ask">組み立てよう</p><div class="spell build">' + (sp.pre ? '<span class="art">' + esc(sp.pre) + '</span>' : '') + '<span class="slot sa">' + (oneA ? esc(sp.a) : '') + '</span><span class="slot sb"></span></div>' +
      '<p class="b-lab">① ' + (sp.perf ? 'haber の形' : '語幹') + '</p><div class="tiles ta">' + A.map(function (x, i) { return '<button class="tl" data-i="' + i + '">' + esc(x) + '</button>'; }).join('') + '</div>' +
      '<p class="b-lab">② ' + (sp.perf ? '過去分詞' : '語尾') + '</p><div class="tiles tb">' + B.map(function (x, i) { return '<button class="tl" data-i="' + i + '">' + esc(x) + (sp.perf ? '' : '') + '</button>'; }).join('') + '</div><div class="after"></div></div>');
    var a = oneA ? sp.a : null, b = null, fin = false;
    if (oneA) $$('.ta .tl', s).forEach(function (x) { x.disabled = true; x.classList.add('sel'); });
    function check() {
      if (a === null || b === null) return;
      fin = true; $$('.tl', s).forEach(function (x) { x.disabled = true; });
      var got = sp.pre + a + (sp.perf ? ' ' : '') + b, ok = got === sp.full;
      if (!ok) $('.spell', s).insertAdjacentHTML('beforeend', '<span class="fix">→ ' + esc(sp.full) + '</span>');
      Speech.say(sp.full);
      feedback(ok, $('.spell', s), $('.q-card', s));
      done(ok, s);
    }
    $$('.ta .tl', s).forEach(function (x) { x.addEventListener('click', function () { if (fin) return; a = A[+x.dataset.i]; $('.sa', s).textContent = a; $$('.ta .tl', s).forEach(function (y) { y.classList.toggle('sel', y === x); }); if (window.Snd) Snd.tap(); check(); }); });
    $$('.tb .tl', s).forEach(function (x) { x.addEventListener('click', function () { if (fin) return; b = B[+x.dataset.i]; $('.sb', s).textContent = (sp.perf ? ' ' : '') + b; $$('.tb .tl', s).forEach(function (y) { y.classList.toggle('sel', y === x); }); if (window.Snd) Snd.tap(); check(); }); });
  }

  /* ---- ユニット：お手本 → 予想 → 説明 → 練習 ---- */
  function blockConj(b, next) {
    var U = unitOf(b.unit) || nextUnit(), tenses = U.tenses || [U.tense];
    S.cjSeen = S.cjSeen || {};
    if (!S.cjSeen[U.id] || b.intro) intro(); else practice();
    function intro() {
      var m = mw(U.model), t = U.tense;
      var s = stage('<div class="q unit-intro"><p class="u-eyebrow">🔁 活用のくせ</p><h2 class="u-title">' + esc(U.name) + '</h2>' + tBadge(t) +
        '<div class="u-model"><p class="u-cap">お手本：<b>' + esc(m.w) + '</b>（' + esc(m.ja) + '）<small>' + esc(Conj.kind(m.w)) + '</small></p>' + conjTable(m.w, t, -1) +
        (tenses.length > 1 ? '<p class="u-cap">' + TN[tenses[1]].name + '</p>' + conjTable(m.w, tenses[1], -1) : '') + '</div>' +
        '<div class="u-rule">💡 ' + esc(U.rule) + '</div><details class="u-why"><summary>🤔 なぜ？</summary><p>' + esc(U.why) + '</p></details>' +
        '<button class="next go">予想してみる ▶</button></div>');
      $('.go', s).addEventListener('click', predict);
    }
    function predict() {
      var w = mw(U.predict.verb), p = U.predict.p, t = U.tense, right = Conj.form(w.w, t, p);
      var ds = uniq([Conj.regularForm(w.w, t, p)].concat(personsOf(w, t).map(function (q) { return Conj.form(w.w, t, q); }), [Conj.form(w.w, 'pres', p), Conj.form(w.w, 'subj', p)]));
      var list = shuffle([right].concat(shuffle(ds.filter(function (x) { return x !== right; })).slice(0, 3)));
      var s = stage('<div class="q">' + trackHtml(w, 0.06, 'wow') + cjCard(w, t, p, '<span class="qtag">🤔 予想</span>') + '<p class="q-ask">いまの決まりを使うと？<small>（予想なので、まちがえても大丈夫）</small></p>' + choiceHtml(list.map(esc), 'es') + '<div class="after"></div></div>');
      var done2 = false;
      $$('.ch', s).forEach(function (x) {
        x.addEventListener('click', function () {
          if (done2) return; done2 = true;
          var ok = list[+x.dataset.i] === right;
          $$('.ch', s).forEach(function (y) { y.disabled = true; if (list[+y.dataset.i] === right) y.classList.add('right'); });
          if (!ok) x.classList.add('miss');
          if (window.Snd) (ok ? Snd.ok(0) : Snd.flip());
          Speech.say(right);
          moveTrack(s, w, 0.11, 'happy', ok ? '¡Sí!' : '');
          S.cjSeen[U.id] = 1; V.save();
          after(s, '<p class="reveal-h">' + (ok ? '🎯 予想的中！' : '💡 正解は ' + esc(right)) + '</p><div class="u-model"><p class="u-cap"><b>' + esc(w.w) + '</b>（' + esc(w.ja) + '）<small>' + esc(Conj.kind(w.w)) + '</small></p>' + conjTable(w.w, t, p) + '</div>', practice);
        });
      });
    }
    function practice() {
      /* 練習するカード：まだ覚えていない→しおれた→ほか の順に4枚。1枚につき2問（作る問題 → 見分ける問題） */
      var cards = unitCards(U);
      var fresh = shuffle(cards.filter(function (id) { return !V.card(id); }));
      var weak = cards.filter(function (id) { return V.card(id) && V.state(id) !== 'fresh'; });
      var rest = shuffle(cards.filter(function (id) { return V.card(id) && V.state(id) === 'fresh'; }));
      var pickC = fresh.concat(weak, rest).slice(0, b.n || 4), need = {}, close = {}, q = [];
      pickC.forEach(function (id) { need[id] = 2; close[id] = V.card(id) ? nowClose(id) : 0.11; });
      var firstT = shuffle(pickC.map(function (id) { return [id, pick(['build', 'build', 'pick'])]; }));
      var secondT = shuffle(pickC.map(function (id) { return [id, pick(['cue', 'which', 'cue'])]; }));
      q = firstT.concat(secondT);
      var total = q.length, n = 0;
      stage('<div class="interlude"><p class="big-t">🔁 ' + esc(U.name) + '</p><p>' + esc(U.rule) + '</p><button class="next go">練習 ▶</button><button class="ghost again">📖 お手本をもう一度</button></div>');
      $('#stage .go').addEventListener('click', one);
      $('#stage .again').addEventListener('click', intro);
      function one() {
        var x = q.shift(); if (!x) return next();
        n++;
        var c = V.cj(x[0]), w = c.verb, t = c.tense, p = pick(personsOf(w, t));
        askConj({ w: w, t: t, p: p }, x[1], { tag: '<span class="qtag">🔁 ' + Math.min(n, total) + ' / ' + total + '</span>', track: trackHtml(w, close[x[0]], 'happy') }, function (ok, s) {
          var id = x[0], had = !!V.card(id);
          if (ok) {
            need[id]--;
            if (had) { var r = V.answer(id, true); ses.exp += r.exp; if (r.up) levelFx({ id: id, w: w.w + '（' + TN[t].short + '）' }, r.up); }
            if (need[id] <= 0 && !had) { close[id] = REL_C[0]; moveTrack(s, w, close[id], 'happy', '覚えた！'); capCj(id, $('.q-card', s)); }
            else { close[id] = Math.min(REL_C[0], close[id] + 0.07); moveTrack(s, w, close[id], 'happy'); }
            after(s, conjTable(w.w, t, p), one, 1500);
          } else {
            if (had) V.answer(id, false);
            close[id] = Math.max(0.04, close[id] - 0.04); moveTrack(s, w, close[id], 'meh');
            q.push(x); total++;
            after(s, '<p class="note">' + esc(Conj.kind(w.w)) + '</p>' + conjTable(w.w, t, p), one);
          }
        });
      }
    }
  }
  function capCj(id, el) {
    var r = V.capture(id, false);
    ses.caught.push(id); ses.exp += r.exp;
    if (window.Snd) Snd.capture();
    FX.burst(el, null, 22);
    FX.float(el, '¡Lo tengo!', 'cap');
  }
  /* 野生戦：しおれた活用カード */
  function fightCj(id, tagText, cb) {
    var c = V.cj(id), w = c.verb, t = c.tense, p = pick(personsOf(w, t));
    var c0 = nowClose(id), m0 = Chara.moodOf(V.state(id));
    stage('<div class="appear"><p>' + tBadge(t) + '</p><div class="ap-bud">' + cs(w, { mood: m0 }) + '</div><p>' + esc(w.w) + ' の' + TN[t].short + 'が 遠くに いる！</p></div>');
    if (window.Snd) Snd.appear();
    setTimeout(function () {
      askConj({ w: w, t: t, p: p }, pick(['pick', 'cue', 'build', 'which']), { tag: '<span class="qtag">' + tagText + '</span>', track: trackHtml(w, c0, m0) }, function (ok, s) {
        var r = V.answer(id, ok);
        if (ok) {
          moveTrack(s, w, Chara.closeness(V.card(id).lv, 1), 'happy', r.back ? 'おかえり！' : '¡Hola!');
          ses.exp += r.exp;
          FX.float($('.q-card', s), '+' + r.exp + ' EXP', 'exp');
          if (r.back) { ses.backs++; ses.backIds.push(id); }
          if (r.up) levelFx({ id: id, w: w.w + '（' + TN[t].short + '）' }, r.up);
          after(s, conjTable(w.w, t, p) + gaugeHtml({ id: id }), cb, r.up ? 0 : 1800);
        } else {
          moveTrack(s, w, Math.max(0.03, c0 - 0.12), 'sleep', '…');
          after(s, '<p class="note">' + esc(Conj.kind(w.w)) + '</p>' + conjTable(w.w, t, p), cb);
        }
      });
    }, 900);
  }

  /* ---- 活用のメニュー（ユニット一覧） ---- */
  function renderConjMenu() {
    var nx = nextUnit();
    $('#cjList').innerHTML = CU.units.map(function (u) {
      var d = unitDone(u), cards = unitCards(u), rc = [0, 0, 0, 0];
      cards.forEach(function (id) { var c = V.card(id); if (c) rc[c.lv]++; });
      var wilt = cards.filter(function (id) { return V.card(id) && V.state(id) !== 'fresh'; }).length;
      if (!d.total) return '<div class="cunit off">' + tBadge(u.tenses ? u.tenses[0] : u.tense) + '<b>' + esc(u.name) + '</b><small>この範囲には、このくせの動詞がない</small></div>';
      return '<button class="cunit" data-unit="' + u.id + '">' + tBadge(u.tenses ? u.tenses[0] : u.tense) + (u === nx ? '<span class="u-rec">おすすめ</span>' : '') +
        '<b>' + esc(u.name) + '</b><span class="bar stack">' + rc.map(function (n, i) { return n ? '<i class="r-' + V.RANKS[i].id + '" style="width:' + (n / d.total * 100) + '%"></i>' : ''; }).join('') + '</span>' +
        '<small>' + d.got + ' / ' + d.total + ' 形' + (wilt ? '　🥀 ' + wilt : '') + (S.cjSeen && S.cjSeen[u.id] ? '' : '　🆕') + '</small></button>';
    }).join('');
  }
  /* ---- 図鑑：活用の表（動詞 × 時制） ---- */
  var CJ_T = ['pres', 'pret', 'impf', 'perf', 'fut', 'cond', 'subj', 'imp'];
  function cjMatrix() {
    var verbs = D.words.filter(function (w) { return w.pos === 'v'; }).map(function (w) { return w.id; });
    var inUnit = {}; verbs.forEach(function (vid) { TSTEPS.forEach(function (t) { if (hasForms(V.word(vid), t)) inUnit[V.cjId(vid, t)] = 1; }); });
    return '<table class="cjm"><tr><th></th>' + CJ_T.map(function (t) { return '<th title="' + TN[t].name + '">' + CU.look[t].ico + '<small>' + TN[t].short + '</small></th>'; }).join('') + '</tr>' +
      verbs.map(function (vid) {
        return '<tr><th>' + esc(V.word(vid).w) + '</th>' + CJ_T.map(function (t) {
          var id = V.cjId(vid, t), c = V.card(id);
          if (!inUnit[id]) return '<td></td>';
          if (!c) return '<td><button class="cjc none" data-cj="' + id + '"></button></td>';
          var st = V.state(id);
          return '<td><button class="cjc r-' + V.RANKS[c.lv].id + ' st-' + st + '" data-cj="' + id + '">' + V.RANKS[c.lv].mark + (st !== 'fresh' ? '<i>' + (st === 'wild' ? '🍂' : '🥀') + '</i>' : '') + '</button></td>';
        }).join('') + '</tr>';
      }).join('') + '</table>';
  }
  function cjMini(id) {
    var c = V.cj(id), k = V.card(id);
    return '<button class="mini cjmini r-' + V.RANKS[k.lv].id + '" data-id="' + id + '"><span class="no">' + CU.look[c.tense].ico + '</span>' + cs(c.verb, { mood: 'happy' }) +
      '<span class="mw">' + esc(c.verb.w) + '</span><span class="mj">' + TN[c.tense].name + '</span><span class="rb">' + V.RANKS[k.lv].rel + '</span></button>';
  }
  function openCjSheet(id) {
    var c = V.cj(id), w = c.verb, t = c.tense, k = V.card(id), box = $('#sheetBody');
    var st = k ? V.state(id) : 'none';
    box.innerHTML = '<div class="q-card cj"><div class="cj-top">' + tBadge(t) + '</div><div class="cj-verb"><b>' + esc(w.w) + '</b><small>' + esc(w.ja) + '</small></div><small class="pos">' + esc(Conj.kind(w.w)) + '</small></div>' +
      (k ? trackHtml(w, nowClose(id), Chara.moodOf(st)) : '<p class="note">まだ覚えていない形。🔁 活用の練習で出てくるよ</p>') + conjTable(w.w, t, -1) +
      (k ? gaugeHtml({ id: id }) : '') + (k && st !== 'fresh' ? '<button class="next rescue">🚑 救出する</button>' : '');
    var rb = $('.rescue', box);
    if (rb) rb.addEventListener('click', function () { closeSheet(); start([{ type: 'rescue', id: id }]); });
    $('#sheet').hidden = false;
    tw($('#sheet .sh'), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' });
  }

  /* =========================================================
   * 動詞の一生：出会い（意味）→ フォルム（時制の形）が増えていく
   *  A フォルム：覚えた時制の印（カード）としましまスカーフ（衣装）
   *  B 覚えたがる：前のフォルムが「顔なじみ」以上になると、次の時制を覚えたがる → くせの教室
   *  C 野生では活用した形で現れる（tuvimos → 元の動詞は？ 誰が・いつ？）
   *  D くせの族：同じくせの動詞のグループ（-go 族 など）
   * ========================================================= */
  var TSTEPS = ['pres', 'pret', 'impf', 'perf', 'fut', 'cond', 'subj', 'imp'];
  var NEED = { pres: null, pret: ['pres'], impf: ['pret'], perf: ['pret'], fut: ['impf', 'perf'], cond: ['impf', 'perf'], subj: ['fut', 'cond'], imp: ['subj'] };
  function hasForms(w, t) { return personsOf(w, t).length > 0; }
  function formCard(w, t) { return V.card(V.cjId(w.id, t)); }
  function learned(w) { return TSTEPS.filter(function (t) { return formCard(w, t); }); }
  function formColors(w) { return learned(w).map(function (t) { return CU.look[t].color; }); }
  /* 単語キャラ（動詞は衣装つき） */
  function cs(w, o) { o = o || {}; if (w.pos === 'v' && CU && window.Conj) o.forms = formColors(w); return Chara.svg(w, o); }
  /* 次に覚えたがっている時制（なければ null） */
  function wantOf(w) {
    if (w.pos !== 'v' || !V.card(w.id) || !CU) return null;
    for (var i = 0; i < TSTEPS.length; i++) {
      var t = TSTEPS[i];
      if (formCard(w, t) || !hasForms(w, t)) continue;
      var need = NEED[t];
      var ok = need === null ? V.card(w.id).lv >= 1 : need.some(function (n) { var c = formCard(w, n); return c && c.lv >= 1; });
      return ok ? t : null;
    }
    return null;
  }
  function wantsList() {
    return D.words.filter(function (w) { return V.inRange(w) && wantOf(w); }).sort(function (a, b) { return V.card(b.id).lv - V.card(a.id).lv || a.i - b.i; })
      .map(function (w) { return { w: w, t: wantOf(w) }; });
  }
  /* その動詞・時制のくせを教えるユニット */
  function unitFor(w, t) {
    var v = Conj.parse(w.w), x = v.x;
    if (t === 'pres') return v.refl ? 'refl' : x.pres ? 'pres-irr' : x.yo ? 'pres-yo' : x.stem ? 'pres-stem' : 'pres-reg';
    if (t === 'pret') return x.pretS || x.pret || x.ir ? 'pret-irr' : 'pret-reg';
    return { impf: 'impf', perf: 'perf', fut: 'fut', cond: 'fut', subj: 'subj', imp: 'imp' }[t];
  }
  /* くせの族 */
  var FAM = {
    go: { name: '-go 族', ico: '🎸', desc: 'yo が -go で終わる（tengo, pongo, salgo…）' },
    zco: { name: '-zco 族', ico: '🦓', desc: 'yo が -zco で終わる（conozco）' },
    ie: { name: 'ie 族', ico: '🌿', desc: '強く読む e が ie に（pienso, quiero）' },
    ue: { name: 'ue 族', ico: '🌊', desc: '強く読む o（u）が ue に（puedo, vuelvo, juego）' },
    i: { name: 'i 族', ico: '🕯', desc: '強く読む e が i に（pido）' },
    sp: { name: '特別な子', ico: '🎭', desc: '形ごと覚える（soy, voy, estoy, doy, veo, sé）' },
    ar: { name: '-ar 族', ico: '🍊', desc: '規則どおり（-o, -as, -a…）' },
    er: { name: '-er 族', ico: '🫒', desc: '規則どおり（-o, -es, -e…）' },
    ir: { name: '-ir 族', ico: '🌻', desc: '規則どおり（-o, -es, -e, -imos…）' }
  };
  function famOf(w) {
    if (w.pos !== 'v' || !window.Conj) return null;
    var v = Conj.parse(w.w), x = v.x;
    if (x.pres || (x.yo && !/(go|zco)$/.test(x.yo))) return 'sp';
    if (x.yo) return /zco$/.test(x.yo) ? 'zco' : 'go';
    if (x.stem) return x.stem;
    return v.cls;
  }
  function famHtml(w) {
    var f = famOf(w); if (!f) return '';
    var mates = D.words.filter(function (x) { return x !== w && famOf(x) === f; });
    return '<p class="fam"><span class="famb">' + FAM[f].ico + ' ' + FAM[f].name + '</span>' + esc(FAM[f].desc) +
      (mates.length ? '<span class="mates">仲間：' + mates.map(function (x) { return '<i class="' + (V.card(x.id) ? 'met' : '') + '">' + esc(x.w) + '</i>'; }).join(' ') + '</span>' : '') + '</p>';
  }
  /* フォルムの印（カード用の小さな点・シート用の札） */
  function pipsHtml(w) {
    if (w.pos !== 'v' || !CU) return '';
    return '<span class="fpips">' + TSTEPS.filter(function (t) { return hasForms(w, t); }).map(function (t) {
      var c = formCard(w, t); return '<i style="--tc:' + CU.look[t].color + '" class="' + (c ? 'on' : '') + '"></i>';
    }).join('') + '</span>';
  }
  function formsHtml(w) {
    if (w.pos !== 'v' || !CU) return '';
    var want = wantOf(w);
    return '<div class="forms"><p class="u-cap">🔁 フォルム（覚えた時制）</p><div class="fchips">' + TSTEPS.filter(function (t) { return hasForms(w, t); }).map(function (t) {
      var c = formCard(w, t), id = V.cjId(w.id, t);
      if (c) return '<button class="fchip on r-' + V.RANKS[c.lv].id + '" data-cj="' + id + '">' + CU.look[t].ico + ' ' + TN[t].short + '<b>' + V.RANKS[c.lv].mark + '</b></button>';
      if (t === want) return '<button class="fchip want" data-learn="' + w.id + ':' + t + '">💬 ' + TN[t].short + '</button>';
      return '<span class="fchip lock">' + CU.look[t].ico + ' ' + TN[t].short + '</span>';
    }).join('') + '</div>' + (want ? '' : V.card(w.id) && V.card(w.id).lv < 1 && !learned(w).length ? '<p class="note">顔なじみ（シルバー）になると、現在形を覚えたがるよ</p>' : '') + '</div>';
  }

  /* ---- B 覚えたがる → くせの教室 → この動詞のフォルムを練習 ---- */
  function blockLearn(b, next) {
    var w = V.word(b.verb), t = b.tense, U = unitOf(unitFor(w, t)), id = V.cjId(w.id, t), f = famOf(w);
    S.cjSeen = S.cjSeen || {};
    var seen = !!S.cjSeen[U.id];
    var s = stage('<div class="interlude want"><div class="ap-bud">' + cs(w, { mood: 'wow' }) + '</div><p class="big-t">💬 ' + esc(w.w) + ' が<br>' + TN[t].name + 'を覚えたがっている！</p>' +
      tBadge(t) + famHtml(w) + '<p>くせ：<b>' + esc(U.name) + '</b>' + (seen ? '（前に習った）' : '（はじめて）') + '</p><button class="next go">' + (seen ? 'やってみる ▶' : 'くせの教室へ ▶') + '</button></div>');
    if (window.Snd) Snd.appear();
    $('.go', s).addEventListener('click', seen ? predict : lesson);
    function lesson() {
      var m = mw(U.model), tt = U.tense;
      var s2 = stage('<div class="q unit-intro"><p class="u-eyebrow">🔁 くせの教室</p><h2 class="u-title">' + esc(U.name) + '</h2>' + tBadge(tt) +
        '<div class="u-model"><p class="u-cap">お手本：<b>' + esc(m.w) + '</b>（' + esc(m.ja) + '）<small>' + esc(Conj.kind(m.w)) + '</small></p>' + conjTable(m.w, tt, -1) + '</div>' +
        '<div class="u-rule">💡 ' + esc(U.rule) + '</div><details class="u-why"><summary>🤔 なぜ？</summary><p>' + esc(U.why) + '</p></details>' +
        '<button class="next go">' + esc(w.w) + ' で予想してみる ▶</button></div>');
      S.cjSeen[U.id] = 1; V.save();
      $('.go', s2).addEventListener('click', predict);
    }
    /* D：族の決まりを使って予想（現在形なら「この子は -go 族。yo は？」） */
    function predict() {
      var p = t === 'imp' ? 1 : t === 'pres' && (f === 'go' || f === 'zco' || f === 'sp') ? 0 : pick(personsOf(w, t).filter(function (q) { return q !== 4; }));
      var right = Conj.form(w.w, t, p);
      var ds = uniq([Conj.regularForm(w.w, t, p)].concat(personsOf(w, t).map(function (q) { return Conj.form(w.w, t, q); }), [Conj.form(w.w, 'pres', p), Conj.form(w.w, 'subj', p), Conj.form(w.w, 'pret', p)]));
      var list = shuffle([right].concat(shuffle(ds.filter(function (x) { return x !== right; })).slice(0, 3)));
      var hint = t === 'pres' && f ? FAM[f].ico + ' この子は ' + FAM[f].name + '。' + FAM[f].desc : '💡 ' + U.rule;
      var s3 = stage('<div class="q">' + trackHtml(w, nowClose(w.id), 'wow') + cjCard(w, t, p, '<span class="qtag">🤔 予想</span>') + '<div class="clue"><p>' + esc(hint) + '</p></div>' +
        '<p class="q-ask">' + esc(w.w) + ' だと？<small>（予想なので、まちがえても大丈夫）</small></p>' + choiceHtml(list.map(esc), 'es') + '<div class="after"></div></div>');
      var done2 = false;
      $$('.ch', s3).forEach(function (x) {
        x.addEventListener('click', function () {
          if (done2) return; done2 = true;
          var ok = list[+x.dataset.i] === right;
          $$('.ch', s3).forEach(function (y) { y.disabled = true; if (list[+y.dataset.i] === right) y.classList.add('right'); });
          if (!ok) x.classList.add('miss');
          if (window.Snd) (ok ? Snd.ok(0) : Snd.flip());
          Speech.say(right);
          moveTrack(s3, w, nowClose(w.id), 'happy', ok ? '¡Sí!' : '');
          after(s3, '<p class="reveal-h">' + (ok ? '🎯 予想的中！' : '💡 正解は ' + esc(right)) + '</p>' + conjTable(w.w, t, p), practice);
        });
      });
    }
    function practice() {
      var q = shuffle(['build', 'pick']).slice(0, 1).concat(shuffle(['cue', 'which']).slice(0, 1), ['build']), need = 2, got = false, n = 0, total = 3;
      (function one() {
        var ty = q.shift();
        if (!ty || got) return next();
        n++;
        var p = pick(personsOf(w, t));
        askConj({ w: w, t: t, p: p }, ty, { tag: '<span class="qtag">🔁 ' + esc(w.w) + ' ' + n + ' / ' + total + '</span>', track: trackHtml(w, nowClose(w.id), 'happy') }, function (ok, s4) {
          if (ok) {
            need--;
            if (need <= 0) {
              got = true; capCj(id, $('.q-card', s4));
              moveTrack(s4, w, nowClose(w.id), 'happy', '新しいフォルム！');
              var bud = $('.t-bud', s4); if (bud) bud.firstChild.outerHTML = cs(w, { mood: 'happy' });
              FX.slam('¡NUEVA FORMA!', w.w + ' が ' + TN[t].name + ' を覚えた');
            }
            after(s4, conjTable(w.w, t, p), one, got ? 0 : 1500);
          } else { q.push(ty); total++; after(s4, '<p class="note">' + esc(U.rule) + '</p>' + conjTable(w.w, t, p), one); }
        });
      })();
    }
  }

  /* ---- C 野生では活用した形で現れる：意味 → 誰が・いつ？ ---- */
  function askForm(w, opt, done) {
    var ts = learned(w), t = pick(ts), ps = personsOf(w, t), p = pick(ps), form = Conj.form(w.w, t, p);
    var list = shuffle([w.ja].concat(others(w, 3, 'ja')));
    var s = stage('<div class="q">' + (opt.track || '') + '<div class="q-card' + rankCls(w.id) + '">' + (opt.tag || '') + '<div class="q-word">' + esc(form) + '</div>' + sayBtn(form) + '<small class="pos">活用した形で現れた！</small></div>' +
      '<p class="q-ask">① 元の動詞の意味は？</p>' + choiceHtml(list.map(esc)) + '<div class="stage2"></div><div class="after"></div></div>');
    setTimeout(function () { Speech.say(form); }, 250);
    var answered = false, ri = list.indexOf(w.ja);
    $$('.choices .ch', s).forEach(function (b) {
      b.addEventListener('click', function () {
        if (answered) return; answered = true;
        var ok = +b.dataset.i === ri;
        $$('.choices .ch', s).forEach(function (x) { x.disabled = true; if (+x.dataset.i === ri) x.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        feedback(ok, b, $('.q-card', s));
        $('.q-card', s).insertAdjacentHTML('beforeend', '<small class="pos">← ' + esc(w.w) + '（' + esc(w.ja) + '）</small>');
        if (!ok) return done(false, s);
        /* ② 誰が・いつ？（覚えたフォルムの中から） */
        var combos = [];
        ts.forEach(function (tt) { personsOf(w, tt).forEach(function (q) { combos.push([tt, q]); }); });
        var sameForm = function (c) { return Conj.form(w.w, c[0], c[1]) === form; };
        var opts = shuffle([[t, p]].concat(shuffle(combos.filter(function (c) { return !sameForm(c); })).slice(0, 3)));
        $('.stage2', s).innerHTML = '<p class="q-ask">② 誰が・いつ？</p><div class="choices">' + opts.map(function (c, i) { return '<button class="ch c2" data-i="' + i + '">' + pronOf(c[1], c[0]) + '<small>' + TN[c[0]].short + '</small></button>'; }).join('') + '</div>';
        var a2 = false;
        $$('.c2', s).forEach(function (x) {
          x.addEventListener('click', function () {
            if (a2) return; a2 = true;
            var ok2 = sameForm(opts[+x.dataset.i]);
            $$('.c2', s).forEach(function (y) { y.disabled = true; if (sameForm(opts[+y.dataset.i])) y.classList.add('right'); });
            if (!ok2) x.classList.add('wrong');
            var r2 = V.answer(V.cjId(w.id, t), ok2);
            if (ok2) { ses.exp += r2.exp; if (window.Snd) Snd.ok(ses.combo); FX.float(x, '+' + r2.exp, 'exp'); } else { if (window.Snd) Snd.ng(); }
            $('.stage2', s).insertAdjacentHTML('beforeend', conjTable(w.w, t, p));
            done(true, s);
          });
        });
      });
    });
  }

  /* =========================================================
   * 📚 デッキの切りかえ・読み込み（参考書連動版など）
   *  読み込んだデッキは端末の中だけに保存（vocab/js/decks.js）。公開されない。
   *  同じ id のデッキがあれば「足す（課ごとに追加）」か「全部入れかえ」を選べる。
   *  進み具合は単語の id で記録しているので、どちらでも引き継がれる。
   * ========================================================= */
  var BUILTIN_ID = 'spanish';
  function deckName() { return D.brand + (D.book ? '（' + D.book + '）' : ''); }
  function openDecks(msg) {
    var box = $('#sheetBody'), list = window.VocabDecks ? VocabDecks.list() : [];
    var cur = D.id;
    var item = function (id, name, sub, href) {
      return '<a class="deck-item' + (id === cur ? ' cur' : '') + '" href="' + href + '"><b>' + esc(name) + '</b><small>' + esc(sub) + '</small>' + (id === cur ? '<span class="dcur">いま使っている</span>' : '') + '</a>';
    };
    box.innerHTML = '<p class="u-title">📚 デッキ</p>' +
      item(BUILTIN_ID, '¡VAMOS!', 'アプリに入っている単語（西検 5級 → 4級）', 'vocab.html') +
      list.map(function (d) { return item(d.id, d.brand + '　' + d.title, (d.book ? '📗 ' + d.book + '・' : '') + d.words + '語（この端末に読み込んだデッキ）', 'vocab.html?deck=' + encodeURIComponent(d.id)); }).join('') +
      '<div class="deck-imp"><p class="u-cap"><b>＋ 参考書のデッキを読み込む</b></p>' +
      '<p class="note">参考書に合わせて作った単語のファイル（.json）を、この端末に読み込みます。端末の中だけに保存され、公開されません。数百語でも大丈夫です。<br>同じデッキに、課ごとのファイルを足していくこともできます。</p>' +
      '<button class="next" id="dkFile">📂 ファイルをえらぶ</button>' +
      '<details><summary>テキストを貼りつける（少しのとき）</summary><textarea id="dkText" rows="5" placeholder="{ &quot;id&quot;: &quot;...&quot;, &quot;words&quot;: [ ... ] }"></textarea><button class="ghost" id="dkPaste">読み込む</button></details>' +
      '<div class="dk-msg" id="dkMsg">' + (msg || '') + '</div></div>';
    $('#dkFile', box).addEventListener('click', function () { $('#deckFile').click(); });
    $('#dkPaste', box).addEventListener('click', function () { importDeck($('#dkText', box).value); });
    $('#sheet').hidden = false;
    tw($('#sheet .sh'), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' });
  }
  function dkMsg(html) { var m = $('#dkMsg'); if (m) { m.innerHTML = html; m.scrollIntoView({ block: 'nearest' }); } }
  /* 課ごとのファイルを足す：区間は後ろに追加（同じ id は新しい名前に）、単語は同じ id なら新しい内容に */
  function mergeDeck(old, add) {
    var out = JSON.parse(JSON.stringify(old));
    ['title', 'brand', 'sub', 'book', 'lang', 'skin'].forEach(function (k) { if (add[k]) out[k] = add[k]; });
    var si = {}; out.sections.forEach(function (x, i) { si[x.id] = i; });
    (add.sections || []).forEach(function (x) { if (x.id in si) out.sections[si[x.id]] = x; else { si[x.id] = out.sections.length; out.sections.push(x); } });
    var wi = {}; out.words.forEach(function (x, i) { wi[x.id] = i; });
    (add.words || []).forEach(function (x) { if (x.id in wi) out.words[wi[x.id]] = x; else { wi[x.id] = out.words.length; out.words.push(x); } });
    return out;
  }
  function importDeck(text) {
    var N;
    try { N = JSON.parse(text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text); } catch (e) { return dkMsg('✖ JSON として読めません：' + esc(e.message)); }
    if (!N || !N.id) return dkMsg('✖ デッキの id がありません');
    var old = window.VocabDecks && VocabDecks.get(N.id);
    if (!old) return finishImport(N, '読み込みました');
    var addN = (N.words || []).filter(function (w) { return !old.words.some(function (o) { return o.id === w.id; }); }).length;
    dkMsg('<p>「' + esc(old.title) + '」（' + old.words.length + '語）はもう読み込まれています。</p>' +
      '<button class="next" id="dkAdd">足す（新しい単語 ' + addN + '語・同じ単語は新しい内容に）</button>' +
      '<button class="ghost" id="dkRep">全部入れかえる（' + (N.words || []).length + '語に）</button><button class="ghost" id="dkNo">やめる</button>' +
      '<p class="note">どちらでも、育てたカードはそのまま引き継ぎます</p>');
    $('#dkAdd').addEventListener('click', function () { finishImport(mergeDeck(old, N), addN + '語を足しました'); });
    $('#dkRep').addEventListener('click', function () { finishImport(N, '入れかえました'); });
    $('#dkNo').addEventListener('click', function () { dkMsg(''); });
  }
  function finishImport(N, done, force) {
    if (window.Conj && Array.isArray(N.words)) N.words.forEach(function (w) { if (w && w.pos === 'v' && w.cj && !Conj.checkIrr(w.cj).length) Conj.addIrr(w.w, w.cj); });
    var r = window.DeckCheck ? DeckCheck.check(N, window.Conj) : { errors: [], warnings: [] };
    if (r.errors.length) return dkMsg('<p>✖ 直してから読み込んでください（' + r.errors.length + '件）</p><ul class="dk-list">' + r.errors.slice(0, 8).map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>');
    if (r.warnings.length && !force) {
      dkMsg('<p>⚠ 注意が ' + r.warnings.length + ' 件あります（読み込みはできます）</p><ul class="dk-list">' + r.warnings.slice(0, 5).map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul><button class="next" id="dkGo">このまま読み込む</button>');
      $('#dkGo').addEventListener('click', function () { finishImport(N, done, true); });
      return;
    }
    try { VocabDecks.save(N); } catch (e) { return dkMsg('✖ 保存できませんでした（端末の保存領域がいっぱい、またはプライベートブラウズ）'); }
    dkMsg('✔ 「' + esc(N.title) + '」を' + esc(done) + '（' + N.words.length + '語）。開きます…');
    setTimeout(function () { location.href = 'vocab.html?deck=' + encodeURIComponent(N.id); }, 900);
  }

  /* =========================================================
   * 結果
   * ========================================================= */
  function finish() {
    var did = ses.caught.length + ses.ups.length + ses.ok + ses.ng + ses.met.length;
    if (!did) { go('home'); return; }
    if (window.Snd) Snd.finish();
    go('done');
    var grown = []; ses.caught.concat(ses.ups, ses.backIds).forEach(function (id) { if (grown.indexOf(id) < 0) grown.push(id); });
    $('#dTitle').textContent = ses.caught.length || ses.ups.length ? '¡Muy bien!' : '¡Buen trabajo!';
    var lines = [];
    var cWords = ses.caught.filter(function (id) { return !V.isCj(id); }).length, cCj = ses.caught.length - cWords;
    if (cWords) lines.push('📖 図鑑に <b>' + cWords + '枚</b> 追加');
    if (cCj) lines.push('🔁 活用を <b>' + cCj + '形</b> 覚えた');
    if (ses.ups.length) lines.push('✨ <b>' + ses.ups.length + '枚</b> が進化');
    if (ses.backs) lines.push('🤝 野生から <b>' + ses.backs + '枚</b> 取り返した');
    if (CU) wantsList().forEach(function (x) { if (ses.wants0.indexOf(x.w.id + ':' + x.t) < 0) lines.push('💬 <b>' + esc(x.w.w) + '</b> が ' + TN[x.t].name + ' を覚えたがっている（ホームから）'); });
    if (ses.met.length) lines.push('🌱 <b>' + ses.met.length + '語</b> と出会った');
    lines.push('⭐ <b>+' + ses.exp + ' EXP</b>（今日 +' + S.day.exp + '）');
    var rc = V.rankCounts();
    if (cWords || rc[0] + rc[1] + rc[2] + rc[3]) lines.push('🤝 単語は いま　出会い <b>' + (rc[0] + rc[1]) + '</b>・定着 <b>' + (rc[2] + rc[3]) + '</b>（仲間・相棒）');
    $('#dLines').innerHTML = lines.map(function (l) { return '<li>' + l + '</li>'; }).join('');
    $('#dCards').innerHTML = grown.map(function (id) { return V.isCj(id) ? cjMini(id) : miniCard(V.word(id)); }).join('');
    /* 次回予告 */
    var soon = Object.keys(S.cards).filter(function (id) { return V.state(id) === 'fresh' && V.condition(id, Date.now() + 24 * 3600e3) < 0.75; }).length;
    var wilt = V.wildList().length;
    var ntxt = wilt ? '🥀 しおれかけが <b>' + wilt + '枚</b>。⚔ 野生戦で助けられる' :
      soon ? '🔮 明日、<b>' + soon + '枚</b> がしおれ始めそう。そのときに思い出せると、大きく育つ' : '🔮 いまはみんな元気。明日また会おう';
    if (V.faceList().length) ntxt += '<br>👀 顔見知りチェックは あと ' + V.faceList().length + '語';
    $('#dNext').innerHTML = ntxt;
    if (G) G.fromTo('#done .anim, #dCards .mini', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(1.6)' });
    if (ses.caught.length + ses.ups.length >= 3) FX.rain();
  }

  /* =========================================================
   * 📖 図鑑
   * ========================================================= */
  function miniCard(w) {
    var c = V.card(w.id);
    if (!c) return '<button class="mini none" data-id="' + w.id + '"><span class="no">' + (w.i + 1) + '</span>' + cs(w, { mood: 'none' }) + '</button>';
    var st = V.state(w.id);
    return '<button class="mini' + gcls(w) + ' r-' + V.RANKS[c.lv].id + ' st-' + st + '" data-id="' + w.id + '" style="--cond:' + V.condition(w.id).toFixed(2) + '">' +
      '<span class="no">' + V.RANKS[c.lv].mark + ' ' + (w.i + 1) + '</span>' + (st !== 'fresh' ? '<span class="stb">' + (st === 'wild' ? '🍂' : '🥀') + '</span>' : '') +
      cs(w, { mood: Chara.moodOf(st), holo: c.lv === 3 }) + '<span class="mw">' + headHtml(w) + '</span><span class="mj">' + esc(w.ja) + '</span>' + pipsHtml(w) + '<span class="rb">' + V.RANKS[c.lv].rel + '</span></button>';
  }
  var dexTab = 'words';
  function renderDex() {
    $$('.x-tabs button').forEach(function (b) { b.classList.toggle('on', b.dataset.tab === dexTab); });
    $('#xLegend').hidden = dexTab !== 'words';
    if (dexTab === 'conj') { $('#xBody').innerHTML = '<p class="x-legend">色＝ランク（B・S・G・H）。点線＝まだ覚えていない形。タップで活用表</p>' + cjMatrix(); return; }
    var got = V.caughtCount();
    $('#xCount').textContent = got + ' / ' + D.words.length;
    /* 大きなデッキ（参考書連動版など）は課ごとにたたみ、開いた課だけカードを描く */
    var big = D.words.length > 120, r = S.settings.range || [], firstOpen = null;
    if (big && !r.length) D.sections.some(function (sec) { var ws = D.words.filter(function (w) { return w.s === sec.id; }); if (ws.some(function (w) { return !V.card(w.id); })) { firstOpen = sec.id; return true; } return false; });
    $('#xBody').innerHTML = D.sections.map(function (sec) {
      var ws = D.words.filter(function (w) { return w.s === sec.id; });
      var g = ws.filter(function (w) { return V.card(w.id); }).length;
      var open = !big || r.indexOf(sec.id) >= 0 || sec.id === firstOpen;
      return '<details class="xsec" data-sec="' + esc(sec.id) + '"' + (open ? ' open' : '') + '><summary><h3>' + esc(sec.name) + (sec.ref ? '<i>' + esc(sec.ref) + '</i>' : '') + '<small>' + g + ' / ' + ws.length + '</small></h3></summary>' +
        '<div class="grid">' + (open ? ws.map(miniCard).join('') : '') + '</div></details>';
    }).join('');
    $$('#xBody .xsec').forEach(function (d) {
      d.addEventListener('toggle', function () {
        var grid = $('.grid', d);
        if (d.open && !grid.firstChild) grid.innerHTML = D.words.filter(function (w) { return w.s === d.dataset.sec; }).map(miniCard).join('');
      });
    });
    if (G) G.fromTo($$('#xBody .mini').slice(0, 40), { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, stagger: 0.012, ease: 'back.out(2)' });
  }
  function openSheet(id) {
    if (V.isCj(id)) return openCjSheet(id);
    var w = V.word(id), c = V.card(id), box = $('#sheetBody');
    if (!c) {
      box.innerHTML = '<div class="sh-none"><div class="sh-sil">' + cs(w, { mood: 'none' }) + '</div><p>No.' + (w.i + 1) + '　まだ出会っていない単語</p><p class="note">' + (V.SEC[w.s].known ? '👀 顔見知りチェック' : '🌱 出会い') + 'で会えるよ</p></div>';
    } else {
      var st = V.state(id), cond = Math.round(V.condition(id) * 100);
      box.innerHTML = '<div class="q-card big' + gcls(w) + ' r-' + V.RANKS[c.lv].id + '"><span class="qtag">No.' + (w.i + 1) + '</span><div class="q-word">' + headHtml(w) + '</div>' + sayBtn(V.head(w)) +
        '<small class="pos">' + POS[w.pos] + '</small>' + refHtml(w) + '</div><div class="meaning">' + esc(w.ja) + '</div>' + trackHtml(w, nowClose(id), Chara.moodOf(st)) + formsHtml(w) + memoHtml(w) + gaugeHtml(w) +
        '<div class="cond"><span>コンディション</span><div class="gbar c"><i style="width:' + cond + '%"></i></div><b>' + (st === 'fresh' ? '元気' : st === 'wilt' ? '🥀 しおれかけ' : '🍂 野生に戻りかけ') + '</b></div>' +
        (st !== 'fresh' ? '<button class="next rescue" data-id="' + id + '">🚑 救出する</button>' : '');
      var rb = $('.rescue', box);
      if (rb) rb.addEventListener('click', function () { closeSheet(); start([{ type: 'rescue', id: id }]); });
      $$('.fchip[data-cj]', box).forEach(function (b) { b.addEventListener('click', function () { openCjSheet(b.dataset.cj); }); });
      $$('.fchip[data-learn]', box).forEach(function (b) { b.addEventListener('click', function () { var a = b.dataset.learn.split(':'); closeSheet(); start([{ type: 'learn', verb: a[0], tense: a[1] }]); }); });
    }
    $('#sheet').hidden = false;
    tw($('#sheet .sh'), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' });
  }
  function closeSheet() { $('#sheet').hidden = true; }

  function toast(t, sub) {
    var el = document.createElement('div'); el.className = 'toast'; el.innerHTML = '<b>' + esc(t) + '</b><small>' + esc(sub || '') + '</small>';
    document.body.appendChild(el);
    tw(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 });
    setTimeout(function () { el.remove(); }, 3000);
  }

  /* =========================================================
   * つなぎこみ
   * ========================================================= */
  function bind() {
    if (window.VOCAB_DECK_MISSING) {
      document.getElementById('app').innerHTML = '<div class="interlude"><p class="big-t">📗 デッキが見つからない</p><p>「' + esc(window.VOCAB_DECK_MISSING) + '」は、この端末にまだ読み込まれていません。<br>¡VAMOS! の「📚 デッキ」から読み込んでください。</p><a class="next" href="vocab.html">¡VAMOS! へ</a></div>';
      return;
    }
    document.title = D.brand + '｜' + D.title;
    document.documentElement.dataset.skin = D.skin || 'espana';
    $$('[data-min]').forEach(function (b) { b.addEventListener('click', function () { start(makePlan(+b.dataset.min), b.dataset.min + '分'); }); });
    $$('.mood button').forEach(function (b) { b.addEventListener('click', function () { S.settings.mood = b.dataset.mood; V.save(); renderHome(); if (window.Snd) Snd.tap(); }); });
    $('#alacarte').addEventListener('click', function (e) {
      var t = e.target.closest('.tile'); if (!t || t.disabled) return;
      var id = t.dataset.block;
      if (id === 'dex') return go('dex');
      if (id === 'conj') return go('conj');
      start([{ type: id, n: id === 'meet' ? 3 : id === 'face' ? 10 : 6 }]);
    });
    $('#quit').addEventListener('click', function () { if (window.speechSynthesis) speechSynthesis.cancel(); finish(); });
    $$('[data-go]').forEach(function (b) { b.addEventListener('click', function () { go(b.dataset.go); }); });
    $('#dMore').addEventListener('click', function () { start(makePlan(5), '5分'); });
    $('#hRange').addEventListener('click', openRange);
    $('#hDeck').addEventListener('click', function () { openDecks(); });
    $('#deckFile').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0]; if (!f) return;
      dkMsg('読み込み中…（' + Math.round(f.size / 1024) + 'KB）');
      var rd = new FileReader();
      rd.onload = function () { importDeck(String(rd.result)); };
      rd.onerror = function () { dkMsg('✖ ファイルを読めませんでした'); };
      rd.readAsText(f, 'utf-8');
      e.target.value = '';
    });
    $('#hWant').addEventListener('click', function () { var wl = wantsList(); if (wl.length) start([{ type: 'learn', verb: wl[0].w.id, tense: wl[0].t }]); });
    $('#plaza').addEventListener('click', function (e) { var m = e.target.closest('.p-bud'); if (m) openSheet(m.dataset.id); });
    $('#xBody').addEventListener('click', function (e) {
      var m = e.target.closest('.mini'); if (m) return openSheet(m.dataset.id);
      var c = e.target.closest('.cjc'); if (c) openCjSheet(c.dataset.cj);
    });
    $$('.x-tabs button').forEach(function (b) { b.addEventListener('click', function () { dexTab = b.dataset.tab; renderDex(); }); });
    $('#cjList').addEventListener('click', function (e) { var u = e.target.closest('.cunit'); if (u) start([{ type: 'conj', unit: u.dataset.unit, n: 4 }]); });
    $('#dCards').addEventListener('click', function (e) { var m = e.target.closest('.mini'); if (m) openSheet(m.dataset.id); });
    $('#sheet').addEventListener('click', function (e) { if (e.target.id === 'sheet' || e.target.closest('.sh-close')) closeSheet(); });
    $('#tgSound').addEventListener('change', function (e) { S.settings.sound = e.target.checked; V.save(); });
    $('#tgSpeak').addEventListener('change', function (e) { S.settings.speak = e.target.checked; V.save(); });
    $('#xReset').addEventListener('click', function () { if (confirm('このデッキの記録（図鑑・経験値）をすべて消します。よろしいですか？')) V.reset(); });
    go('home');
  }
  window.VUI = { go: go, start: start, makePlan: makePlan, chunks: chunks };
  bind();
})();
