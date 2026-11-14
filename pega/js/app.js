/* =========================================================
 * ¡PEGA! — 接尾辞（語尾）をくっつけて単語をふやす。西検4級
 *
 *  物語なし。1回＝あたらしい5語（見る → 予想 → きまり）＋ すぐ思い出す問題。
 *   ・くっつける（build）：元の語と作りたい意味を見て、7つの語尾ボタンからえらぶ。ボタンの場所と色はいつも同じ
 *   ・意味（read）：できた語の意味を4択
 *   ・el / la（gender）：-ción・-dad・-ista・-ería
 *   ・形（form）：-mente の「-a に変えてから」
 *  まちがえた問題は、その回の最後にもう一度（正解するまで）。語ごとに間隔をあけて復習（1・3・7・14・30日）。
 *  保存：localStorage 'pega.v1'（?sandbox なら 'pega.sandbox'）。lessons[接尾辞].done＝その10語に全部出会った
 * ========================================================= */
(function () {
  'use strict';
  var SUF = window.PEGA.SUF, WORDS = window.PEGA.WORDS;
  var SUFBY = {}, BYSUF = {}, WBY = {};
  SUF.forEach(function (s) { SUFBY[s.id] = s; BYSUF[s.id] = []; });
  WORDS.forEach(function (w) { BYSUF[w.sf].push(w); WBY[w.id] = w; });
  var NEW_N = 5, DAYS = [1, 3, 7, 14, 30];

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function ymd(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function day(n) { var d = new Date(); d.setDate(d.getDate() + (n || 0)); return ymd(d); }

  /* ---------- 保存 ---------- */
  var SANDBOX = /[?&]sandbox\b/.test(location.search);
  var KEY = SANDBOX ? 'pega.sandbox' : 'pega.v1';
  function fresh() { return { v: 1, words: {}, lessons: {}, runs: 0, best: 0, settings: { sound: true, speak: true } }; }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) { var f = fresh(); for (var k in s) f[k] = s[k]; return f; } } catch (e) { /* 保存領域が使えない */ }
    return fresh();
  }
  var S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* 保存できない環境 */ } }
  window.SfxOn = function () { return S.settings.sound; };
  function sfx(name, a) { try { if (window.Sfx && Sfx[name]) Sfx[name](a); } catch (e) { /* 音が出せない */ } }

  /* ---------- 読み上げ（単語だけ。スペイン語の声がある端末だけ） ---------- */
  var Speech = (function () {
    var syn = window.speechSynthesis, voice = null;
    function find() {
      if (!syn) return null;
      var vs = syn.getVoices() || [];
      voice = vs.filter(function (v) { return /^es[-_]ES/i.test(v.lang); })[0] || vs.filter(function (v) { return /^es/i.test(v.lang); })[0] || null;
      return voice;
    }
    if (syn && syn.addEventListener) syn.addEventListener('voiceschanged', find);
    return {
      say: function (text) {
        if (!S.settings.speak || !syn || !(voice || find())) return;
        try { syn.cancel(); var u = new SpeechSynthesisUtterance(text); u.voice = voice; u.lang = voice.lang; u.rate = 0.9; syn.speak(u); } catch (e) { /* 読み上げできない */ }
      }
    };
  })();

  /* ---------- 語の見せ方 ---------- */
  function plain(w) { return w.replace('|', ''); }
  function artOf(g) { return g === 'f' ? 'la' : g === 'm' ? 'el' : g === 'mf' ? 'el・la' : ''; }
  /* 語尾に色をつけた語（冠詞つき） */
  function wHTML(str, sf, g) {
    var p = str.split('|'), a = artOf(g);
    return (a ? '<span class="art">' + a + '</span> ' : '') + esc(p[0]) + '<b class="sf" style="color:' + SUFBY[sf].color + '">' + esc(p[1]) + '</b>';
  }
  /* 問題で使う形（-ería のあるものは alt で店のほう） */
  function form(w, alt) {
    if (alt && w.w2) return { w: w.w2, ja: w.ja2, g: 'f' };
    return { w: w.w, ja: w.ja, g: w.g };
  }
  /* el / la の問題の答え（出さないものは ''） */
  function genderOf(w, f) {
    if (w.sf === 'cion' || w.sf === 'dad') return 'la';
    if (w.sf === 'ista') return 'both';
    if (w.sf === 'ero' && /ería$/.test(plain(f.w))) return 'la';
    return '';
  }

  /* ---------- 進み具合 ---------- */
  function seen(w) { return !!S.words[w.id]; }
  function seenN(sf) { return BYSUF[sf].filter(seen).length; }
  function seenAll() { return WORDS.filter(seen); }
  function unlocked(sf) { return !!(S.lessons[sf] && S.lessons[sf].intro); }
  function nextNew() {
    for (var i = 0; i < SUF.length; i++) {
      var rest = BYSUF[SUF[i].id].filter(function (w) { return !seen(w); });
      if (rest.length) return { sf: SUF[i].id, words: rest.slice(0, NEW_N) };
    }
    return null;
  }
  function byDue(a, b) { var x = S.words[a.id].due, y = S.words[b.id].due; return x < y ? -1 : x > y ? 1 : 0; }
  function dueWords() { var t = day(0); return seenAll().filter(function (w) { return S.words[w.id].due <= t; }); }

  /* ---------- 画面の切りかえ ---------- */
  var SCREENS = ['home', 'meet', 'play', 'done'];
  function show(id) {
    SCREENS.forEach(function (s) { $(s).hidden = s !== id; });
    window.scrollTo(0, 0);
  }

  /* =========================================================
   * ホーム
   * ========================================================= */
  function home() {
    cur = null; clearTimeout(timer);
    var n = seenAll().length, nw = nextNew(), due = dueWords();
    var h = '<header class="top"><a class="back" href="index.html" aria-label="コース一覧へ">←</a>' +
      '<span class="chip">🧩 出会った語 <b>' + n + '</b> / ' + WORDS.length + '</span></header>' +
      '<h1 class="logo">¡PEGA!<small>語尾をくっつけて単語をふやす ・ 西検4級</small></h1>' +
      '<div class="shelf">';
    var nextSf = nw ? nw.sf : '';
    SUF.forEach(function (s) {
      var open = unlocked(s.id), k = seenN(s.id);
      h += '<button class="tile' + (s.wide ? ' wide' : '') + (open ? '' : ' lock') + (s.id === nextSf && !open ? ' next' : '') + '" data-sf="' + s.id + '" style="--c:' + s.color + '"' + (open ? '' : ' disabled') + '>' +
        '<b>' + (open ? esc(s.label) : '？') + '</b><small>' + (open ? esc(s.role) : (s.id === nextSf ? 'つぎ' : '')) + '</small>' +
        '<span class="bar"><i style="width:' + (k * 10) + '%"></i></span></button>';
    });
    h += '</div>';
    var reviewFirst = (due.length >= 8) || (!nw && n > 0);
    var bNew = nw ? '▶ あたらしい ' + nw.words.length + ' 語 <b style="color:' + SUFBY[nw.sf].color + '">' + (unlocked(nw.sf) ? esc(SUFBY[nw.sf].label) : 'あたらしい語尾') + '</b>' : '';
    var bRev = n ? '🔁 復習 10問' + (due.length ? '<small>きょうの分 ' + due.length + ' 語</small>' : '<small>きょうの分は済み</small>') : '';
    if (reviewFirst) {
      h += '<button class="cta" id="hRev">' + bRev + '</button>';
      if (nw) h += '<button class="sub" id="hNew">' + bNew + '</button>';
    } else {
      h += '<button class="cta" id="hNew">' + bNew + '</button>';
      if (n) h += '<button class="sub" id="hRev">' + bRev + '</button>';
    }
    if (!nw) h += '<p class="note">7つの語尾、ぜんぶ出会えた。あとは復習で、日をあけて思い出す。</p>';
    else if (!n) h += '<p class="note">1回はだいたい1〜2分。5つの語を見てから、すぐ問題。</p>';
    h += '<div class="settings">' +
      '<label><input type="checkbox" id="tgSound"' + (S.settings.sound ? ' checked' : '') + '> 🔈 効果音</label>' +
      '<label><input type="checkbox" id="tgSpeak"' + (S.settings.speak ? ' checked' : '') + '> 🗣 単語を読み上げる</label>' +
      '<button class="link" id="hReset">記録をリセット</button></div>';
    $('home').innerHTML = h;
    show('home');
    if ($('hNew')) $('hNew').onclick = function () { sfx('tap'); startNew(); };
    if ($('hRev')) $('hRev').onclick = function () { sfx('tap'); startReview(); };
    $('tgSound').onchange = function () { S.settings.sound = this.checked; save(); };
    $('tgSpeak').onchange = function () { S.settings.speak = this.checked; save(); };
    $('hReset').onclick = function () { if (confirm('記録をぜんぶ消して、最初からにしますか？')) { S = fresh(); save(); home(); } };
    Array.prototype.forEach.call($('home').querySelectorAll('.tile:not(.lock)'), function (b) {
      b.onclick = function () { sfx('tap'); book(b.getAttribute('data-sf')); };
    });
  }

  /* 語尾ごとの一覧（きまり＋出会った語） */
  function book(sfid) {
    var s = SUFBY[sfid];
    var h = '<h2 style="color:' + s.color + '">' + esc(s.label) + '</h2><p class="rule">' + s.rule + '</p><ul class="blist">';
    BYSUF[sfid].forEach(function (w) {
      if (!seen(w)) { h += '<li class="yet">？？？</li>'; return; }
      h += '<li data-say="' + esc(plain(w.w)) + '"><span class="bb">' + esc(w.base) + '<small>' + esc(w.baseJa) + '</small></span><span class="br">' +
        wHTML(w.w, w.sf, w.g) + '<small>' + esc(w.ja) + '</small>' +
        (w.w2 ? '<br>' + wHTML(w.w2, w.sf, 'f') + '<small>' + esc(w.ja2) + '</small>' : '') +
        (w.memo ? '<em>' + esc(w.memo) + '</em>' : '') + '</span></li>';
    });
    h += '</ul>';
    $('mbody').innerHTML = h;
    $('modal').hidden = false;
    Array.prototype.forEach.call($('mbody').querySelectorAll('li[data-say]'), function (li) {
      li.onclick = function () { Speech.say(li.getAttribute('data-say')); };
    });
  }
  function closeModal() { $('modal').hidden = true; }

  /* =========================================================
   * あたらしい語：見る → 予想 → きまり
   * ========================================================= */
  var cur = null, timer = 0;

  function startNew() {
    var n = nextNew();
    if (!n) { startReview(); return; }
    cur = { kind: 'new', sf: n.sf, news: n.words, words: {}, miss: {}, q: [], i: 0, done: 0, total: 0, combo: 0 };
    meet();
  }

  function meet() {
    var s = SUFBY[cur.sf], first = !unlocked(cur.sf), left = cur.news.length;
    var h = '<header class="pbar"><button class="x" id="mQuit" aria-label="やめる">✕</button><div class="pmid"><b>あたらしい ' + cur.news.length + ' 語</b></div></header>' +
      '<p class="lead">カードをタップして、<b style="color:' + s.color + '">' + esc(s.label) + '</b> をくっつけよう</p><div class="mlist">';
    cur.news.forEach(function (w, i) {
      h += '<button class="mrow' + (i === 0 ? ' glow' : '') + '" data-i="' + i + '" style="--c:' + s.color + '">' +
        '<span class="mb">' + esc(w.base) + '<small>' + esc(w.baseJa) + '</small></span>' +
        '<span class="mplus">＋</span><span class="mr"><i class="q">？</i></span></button>';
    });
    h += '</div><div id="mAfter"></div>';
    $('meet').innerHTML = h;
    show('meet');
    $('mQuit').onclick = home;
    var rows = $('meet').querySelectorAll('.mrow');
    Array.prototype.forEach.call(rows, function (r) {
      r.onclick = function () {
        var w = cur.news[+r.getAttribute('data-i')];
        Speech.say(plain(w.w));
        if (r.classList.contains('on')) return;
        r.classList.add('on'); r.classList.remove('glow');
        r.querySelector('.mr').innerHTML = '<span class="pop">' + wHTML(w.w, w.sf, w.g) + '<small>' + esc(w.ja) + '</small>' +
          (w.w2 ? '<br>' + wHTML(w.w2, w.sf, 'f') + '<small>' + esc(w.ja2) + '</small>' : '') + '</span>';
        sfx('coin');
        left--;
        var nx = $('meet').querySelector('.mrow:not(.on)');
        if (nx) nx.classList.add('glow');
        if (!left) after();
      };
    });
    function after() {
      var box = $('mAfter');
      if (!first) { go(box, ''); return; }
      /* はじめての語尾：予想の問い（採点しない）→ きまり */
      var order = shuffle(s.opts.map(function (t, i) { return i; }));
      box.innerHTML = '<div class="iq"><p class="iqq">' + esc(s.q) + '</p>' +
        order.map(function (i) { return '<button class="opt" data-i="' + i + '">' + esc(s.opts[i]) + '</button>'; }).join('') + '</div>';
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      Array.prototype.forEach.call(box.querySelectorAll('.opt'), function (b) {
        b.onclick = function () {
          var ok = +b.getAttribute('data-i') === s.a;
          sfx(ok ? 'correct' : 'tap');
          Array.prototype.forEach.call(box.querySelectorAll('.opt'), function (o) {
            o.disabled = true;
            if (+o.getAttribute('data-i') === s.a) o.classList.add('ok'); else if (o === b) o.classList.add('ng');
          });
          S.lessons[s.id] = S.lessons[s.id] || {}; S.lessons[s.id].intro = true; save();
          go(box, '<p class="rule">' + s.rule + '</p>');
        };
      });
    }
    function go(box, ruleHTML) {
      buildNewQueue();
      var d = document.createElement('div');
      d.innerHTML = ruleHTML + '<button class="cta" id="mGo">▶ 問題へ（' + cur.q.length + '問）</button>';
      box.appendChild(d);
      d.scrollIntoView({ behavior: 'smooth', block: 'end' });
      $('mGo').onclick = function () { sfx('tap'); show('play'); ask(); };
    }
  }

  /* ---------- 問題の列 ---------- */
  function Q(type, w, alt) { cur.words[w.id] = 1; return { type: type, w: w, alt: !!alt }; }
  function extraQ(w) {
    /* el / la か、-mente の形。なければ null */
    if (w.sf === 'mente') return w.bad ? Q('form', w) : null;
    var alt = !!w.w2;
    return genderOf(w, form(w, alt)) ? Q('gender', w, alt) : null;
  }
  function buildNewQueue() {
    cur.q = []; cur.words = {};
    var news = cur.news;
    /* 前半：くっつける。前に習った語尾の語を2つ混ぜる（ボタンを見分ける） */
    var olds = shuffle(seenAll().filter(function (w) { return w.sf !== cur.sf; }))
      .sort(byDue).slice(0, 2);
    var a = shuffle(news.concat(olds).map(function (w) { return Q('build', w, w.w2 && Math.random() < 0.5); }));
    /* 後半：意味。el / la・形を2つまで */
    var b = news.map(function (w) { return Q('read', w, w.w2 && Math.random() < 0.5); });
    var ex = shuffle(news).map(extraQ).filter(Boolean).slice(0, 2);
    cur.q = a.concat(shuffle(b.concat(ex)));
    cur.total = cur.q.length; cur.i = 0; cur.done = 0;
  }
  function startReview() {
    var all = seenAll();
    if (!all.length) { startNew(); return; }
    cur = { kind: 'review', words: {}, miss: {}, q: [], i: 0, done: 0, total: 0, combo: 0 };
    /* 同じ日の語は混ぜる（並び順のままだと、1つの語尾だけになる） */
    var due = shuffle(dueWords()).sort(byDue);
    var rest = shuffle(all.filter(function (w) { return due.indexOf(w) < 0; }))
      .sort(function (a, b) { return S.words[a.id].box - S.words[b.id].box; });
    var pick = due.concat(rest).slice(0, 10);
    cur.q = shuffle(pick).map(function (w) {
      var r = Math.random(), e = r < 0.25 ? extraQ(w) : null;
      if (e) return e;
      return Q(r < 0.6 ? 'build' : 'read', w, w.w2 && Math.random() < 0.5);
    });
    cur.total = cur.q.length;
    show('play'); ask();
  }

  /* =========================================================
   * 問題
   * ========================================================= */
  var waiting = null;   /* 正解のあとの自動送り。タップですぐ進める */

  function ask() {
    clearTimeout(timer); waiting = null;
    if (cur.i >= cur.q.length) { finish(); return; }
    var q = cur.q[cur.i], w = q.w, f = form(w, q.alt), s = SUFBY[w.sf];
    $('pProg').style.width = Math.round(cur.done / cur.total * 100) + '%';
    $('pCombo').innerHTML = cur.combo >= 2 ? '🔥 <b>' + cur.combo + '</b>' : '';
    var card = $('card'), tray = $('tray');
    tray.className = 'tray t-' + q.type;

    if (q.type === 'build') {
      card.innerHTML = '<div class="qlab">くっつけて、つくろう</div>' +
        '<div class="base">' + esc(w.base) + '<small>' + esc(w.baseJa) + '</small></div>' +
        '<div class="target">↓<br>「<b>' + esc(f.ja) + '</b>」</div><div class="res" id="res"></div><div id="fb"></div>';
      tray.innerHTML = SUF.map(function (x) {
        var open = unlocked(x.id);
        return '<button class="sfb' + (x.wide ? ' wide' : '') + '" data-sf="' + x.id + '" style="--c:' + x.color + '"' + (open ? '' : ' disabled') + '>' +
          '<b>' + (open ? esc(x.label) : '？') + '</b><small>' + (open ? esc(x.role) : '') + '</small></button>';
      }).join('');
      each(tray, '.sfb', function (b) {
        b.onclick = function () {
          var pick = b.getAttribute('data-sf'), ok = pick === w.sf;
          mark(tray, '.sfb', function (o) { return o.getAttribute('data-sf') === w.sf; }, b);
          $('res').innerHTML = '<span class="pop big">' + wHTML(f.w, w.sf, f.g) + '</span>';
          Speech.say(plain(f.w));
          var fb = ok ? memoHTML(w) :
            '<p class="you">✕ <b style="color:' + SUFBY[pick].color + '">' + esc(SUFBY[pick].label) + '</b>：' + esc(SUFBY[pick].short) + '</p>' +
            '<p class="right">○ <b style="color:' + s.color + '">' + esc(s.label) + '</b>：' + esc(s.short) + '</p>' + memoHTML(w);
          answered(ok, fb);
        };
      });
    } else if (q.type === 'read') {
      card.innerHTML = '<div class="qlab">どういう意味？</div><div class="bigw">' + wHTML(f.w, w.sf, f.g) + '</div><div id="fb"></div>';
      var pool = [];
      WORDS.forEach(function (x) { if (x.id !== w.id) { pool.push({ ja: x.ja, sf: x.sf }); if (x.ja2) pool.push({ ja: x.ja2, sf: x.sf }); } });
      pool = shuffle(pool.filter(function (p) { return p.ja !== f.ja; }));
      var same = pool.filter(function (p) { return p.sf === w.sf; }).slice(0, 1);
      var other = pool.filter(function (p) { return p.sf !== w.sf; }).slice(0, 3 - same.length);
      var opts = shuffle([f.ja].concat(same.concat(other).map(function (p) { return p.ja; })));
      tray.innerHTML = opts.map(function (t) { return '<button class="opt" data-v="' + esc(t) + '">' + esc(t) + '</button>'; }).join('');
      each(tray, '.opt', function (b) {
        b.onclick = function () {
          var ok = b.getAttribute('data-v') === f.ja;
          mark(tray, '.opt', function (o) { return o.getAttribute('data-v') === f.ja; }, b);
          Speech.say(plain(f.w));
          var from = '<p class="from">' + esc(w.base) + '（' + esc(w.baseJa) + '）＋ <b style="color:' + s.color + '">' + esc(s.label) + '</b></p>';
          answered(ok, (ok ? '' : '<p class="you">✕ あなた：' + esc(b.getAttribute('data-v')) + '</p><p class="right">○ 正解：<b>' + esc(f.ja) + '</b></p>') + from + memoHTML(w));
        };
      });
    } else if (q.type === 'gender') {
      var g = genderOf(w, f);
      card.innerHTML = '<div class="qlab">el ？　la ？</div><div class="bigw"><span class="blank" id="blank">＿＿</span> ' + wHTML(f.w, w.sf, '') + '</div>' +
        '<div class="sub2">' + esc(f.ja) + '</div><div id="fb"></div>';
      tray.innerHTML = [['el', 'el'], ['la', 'la'], ['both', 'どちらも（el・la）']].map(function (o) {
        return '<button class="opt" data-v="' + o[0] + '">' + o[1] + '</button>';
      }).join('');
      each(tray, '.opt', function (b) {
        b.onclick = function () {
          var ok = b.getAttribute('data-v') === g;
          mark(tray, '.opt', function (o) { return o.getAttribute('data-v') === g; }, b);
          $('blank').textContent = g === 'both' ? 'el・la' : g; $('blank').classList.add('fill');
          answered(ok, '<p class="' + (ok ? 'from' : 'right') + '">' + esc(s.gnote) + '</p>');
        };
      });
    } else {   /* form：-mente の形 */
      card.innerHTML = '<div class="qlab">どっちの形が正しい？</div>' +
        '<div class="base">' + esc(w.base) + '<small>' + esc(w.baseJa) + '</small></div>' +
        '<div class="target">↓<br>「<b>' + esc(w.ja) + '</b>」</div><div id="fb"></div>';
      var good = plain(w.w);
      tray.innerHTML = shuffle([good, w.bad]).map(function (t) { return '<button class="opt es" data-v="' + esc(t) + '">' + esc(t) + '</button>'; }).join('');
      each(tray, '.opt', function (b) {
        b.onclick = function () {
          var ok = b.getAttribute('data-v') === good;
          mark(tray, '.opt', function (o) { return o.getAttribute('data-v') === good; }, b);
          Speech.say(good);
          answered(ok, '<p class="' + (ok ? 'from' : 'right') + '">-o で終わる形容詞は、-a に変えてから -mente（' + esc(w.base) + ' → ' + esc(good.replace(/mente$/, '')) + ' → ' + esc(good) + '）</p>');
        };
      });
    }
  }
  function each(root, sel, fn) { Array.prototype.forEach.call(root.querySelectorAll(sel), fn); }
  function mark(root, sel, isRight, chosen) {
    each(root, sel, function (o) {
      o.disabled = true;
      if (isRight(o)) o.classList.add('ok'); else if (o === chosen) o.classList.add('ng'); else o.classList.add('dim');
    });
  }
  function memoHTML(w) { return w.memo ? '<p class="memo">💡 ' + esc(w.memo) + '</p>' : ''; }

  function answered(ok, fbHTML) {
    var q = cur.q[cur.i], fb = $('fb');
    if (ok) {
      cur.combo++; cur.done++;
      if (cur.combo > S.best) S.best = cur.combo;
      sfx('correct', cur.combo);
      fb.innerHTML = fbHTML;
      $('pProg').style.width = Math.round(cur.done / cur.total * 100) + '%';
      $('pCombo').innerHTML = cur.combo >= 2 ? '🔥 <b>' + cur.combo + '</b>' : '';
      var t0 = Date.now();
      waiting = function () { if (Date.now() - t0 < 200) return; next(); };
      timer = setTimeout(next, fbHTML ? 2200 : 1100);
    } else {
      cur.combo = 0; cur.miss[q.w.id] = 1;
      cur.q.push({ type: q.type, w: q.w, alt: q.alt });   /* この回のうちに、もう一度 */
      sfx('wrong');
      $('pCombo').innerHTML = '';
      fb.innerHTML = fbHTML + '<button class="nextb" id="fbNext">つぎへ ▶</button>';
      $('fbNext').onclick = next;
    }
  }
  function next() { clearTimeout(timer); waiting = null; cur.i++; ask(); }

  /* =========================================================
   * おわり：間隔をあけて戻す日を決める
   * ========================================================= */
  function finish() {
    var ids = Object.keys(cur.words), missN = Object.keys(cur.miss).length;
    ids.forEach(function (id) {
      var st = S.words[id], miss = !!cur.miss[id];
      if (!st) { S.words[id] = { box: 0, due: day(miss ? 0 : 1) }; return; }   /* あたらしい語：あした（まちがえたら きょうの復習に） */
      if (miss) { st.box = 0; st.due = day(1); }
      else { st.box = Math.min(st.box + 1, DAYS.length - 1); st.due = day(DAYS[st.box]); }
    });
    SUF.forEach(function (s) {
      if (seenN(s.id) === BYSUF[s.id].length) { S.lessons[s.id] = S.lessons[s.id] || {}; S.lessons[s.id].done = true; }
    });
    S.runs++; save();
    sfx('levelUp');
    var isNew = cur.kind === 'new', nw = nextNew();
    var h = '<div class="dn"><div class="dtitle">¡Muy bien!</div>' +
      '<p class="dsum">' + cur.total + ' 問クリア' + (missN ? '（まちがえた語 ' + missN + '。' + (isNew ? 'きょうの復習に出る' : 'あしたまた出る') + '）' : '（ノーミス）') + '</p><ul class="blist">';
    ids.forEach(function (id) {
      var w = WBY[id];
      h += '<li data-say="' + esc(plain(w.w)) + '"' + (cur.miss[id] ? ' class="missed"' : '') + '><span class="bb">' + esc(w.base) + '<small>' + esc(w.baseJa) + '</small></span><span class="br">' +
        wHTML(w.w, w.sf, w.g) + '<small>' + esc(w.ja) + '</small>' + (w.w2 ? '<br>' + wHTML(w.w2, w.sf, 'f') + '<small>' + esc(w.ja2) + '</small>' : '') + '</span></li>';
    });
    h += '</ul><button class="cta" id="dHome">ホームへ</button>' +
      (nw ? '<button class="sub" id="dMore">▶ つづけて、あたらしい ' + nw.words.length + ' 語</button>' : '') + '</div>';
    $('done').innerHTML = h;
    show('done');
    $('dHome').onclick = function () { sfx('tap'); home(); };
    if ($('dMore')) $('dMore').onclick = function () { sfx('tap'); startNew(); };
    each($('done'), 'li[data-say]', function (li) { li.onclick = function () { Speech.say(li.getAttribute('data-say')); }; });
  }

  /* ---------- 共通の操作 ---------- */
  $('pQuit').onclick = function () { if (!cur || cur.done === 0 || confirm('この回をやめますか？（この回の記録は残りません）')) home(); };
  $('modal').addEventListener('click', function (e) { if (e.target === $('modal') || e.target.classList.contains('mclose')) closeModal(); });
  /* 正解のあとの待ちは、画面のどこをタップしても飛ばせる */
  $('play').addEventListener('click', function () { if (waiting) waiting(); });
  document.addEventListener('pointerdown', function () { sfx('unlock'); }, { once: true });
  if (SANDBOX) {
    document.body.classList.add('sandbox');
    /* 動作確認用 */
    window.__pega = { S: function () { return S; }, save: save, home: home, cur: function () { return cur; },
      reset: function () { S = fresh(); save(); home(); },
      seeAll: function () { WORDS.forEach(function (w) { S.words[w.id] = { box: 0, due: day(0) }; }); SUF.forEach(function (s) { S.lessons[s.id] = { intro: true, done: true }; }); save(); home(); } };
  }
  home();
})();
