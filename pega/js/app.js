/* =========================================================
 * ¡PEGA! — 語尾タイルを貼って単語をふやす。西検4級（v2：設計からやり直し）
 *
 *  中心の操作：注文（意味）を見て、手札の「元の語」と、棚の「語尾タイル」を自分で選んで貼り合わせる。
 *    棚は 形容詞に貼る／動詞に貼る／名詞に貼る の3段＝全体の地図。場所と色はいつも同じ。
 *    採点する注文では、タイルの役割の字を隠す（思い出す）。💡 で開ける（その注文は「自力」に数えない）。
 *  1回の流れ：
 *    入荷（あたらしい4語）＝光るタイルを貼る → 「どういう意味になった？」を予想（採点しない）→ すぐ説明
 *      はじめての語尾は、2語のあとに「気づいた？」→ きまり → 棚にタイルが入る
 *    注文（採点する）＝つくる／意味／el・la／つづり／文に合う形。まちがえた注文はその回の最後にもう一度
 *    初見チャレンジ（採点しない）＝習っていない語から語尾タイルをはがして読む
 *  記録：語ごとに間隔をあけて戻す（1・3・7・14・30日）。まちがえた語は語尾ごとに残し、🩹 おさらいでリベンジ。
 *  保存：localStorage 'pega.v2'（?sandbox なら 'pega.sandbox'）。lessons[段階の最初の語尾].done＝その段階の8語に出会った
 * ========================================================= */
(function () {
  'use strict';
  var D = window.PEGA, SUF = D.SUF, STG = D.STAGES, KINDS = D.KINDS, GRP = D.GRP, WORDS = D.WORDS, CLOZE = D.CLOZE, FX = window.FX;
  var STAGES = STG.map(function (s) { return s.ids; });
  var SUFBY = {}, WBY = {}, STOF = {}, CORE = [], CLZ = {}, DICT = {};
  SUF.forEach(function (s) { SUFBY[s.id] = s; });
  STAGES.forEach(function (ids, i) { ids.forEach(function (id) { STOF[id] = i; }); CORE.push([]); });
  WORDS.forEach(function (w) {
    WBY[w.id] = w; w.sfs = w.sfs || [w.sf];
    w.st = Math.max.apply(null, w.sfs.map(function (s) { return STOF[s]; }));
    if (!w.x) CORE[w.st].push(w);
  });
  CLOZE.forEach(function (c) { (CLZ[c.w] = CLZ[c.w] || []).push(c); });
  if (window.ES_WORDS) ES_WORDS.words.forEach(function (e) {
    if (e.pos === 'bad') return;
    [e.w].concat(e.f).forEach(function (f) { if (!DICT[f.toLowerCase()]) DICT[f.toLowerCase()] = e; });
  });
  var NEW_N = 4, DAYS = [1, 3, 7, 14, 30];
  var TITLES = ['見習い', 'タイル貼り', '若手の職人', '腕ききの職人', '工房の親方', '名匠', 'マエストロ', '伝説のマエストロ'];
  var XP = { pred: 5, craft: 12, read: 8, art: 6, seam: 8, cloze: 12, peel: 20 };

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function each(root, sel, fn) { Array.prototype.forEach.call(root.querySelectorAll(sel), fn); }
  function ymd(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function day(n) { var d = new Date(); d.setDate(d.getDate() + (n || 0)); return ymd(d); }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }

  /* ---------- 保存 ---------- */
  var SANDBOX = /[?&]sandbox\b/.test(location.search);
  var KEY = SANDBOX ? 'pega.sandbox' : 'pega.v2';
  function fresh() { return { v: 2, xp: 0, words: {}, tiles: {}, lessons: {}, weak: {}, runs: 0, best: 0, settings: { sound: true, speak: true } }; }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 2) { var f = fresh(); for (var k in s) f[k] = s[k]; return f; } } catch (e) { /* 保存領域が使えない */ }
    return fresh();
  }
  var S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* 保存できない環境 */ } }
  window.SfxOn = function () { return S.settings.sound; };

  /* ---------- 音 ---------- */
  function sfx(name, a) { try { if (window.Sfx && Sfx[name]) Sfx[name](a); } catch (e) { /* 音が出せない */ } }
  function raw(fn) { try { if (window.Sfx && Sfx.raw) Sfx.raw.play(function (t) { fn(Sfx.raw, t); }); } catch (e) { /* なし */ } }
  /* タイルを置く「コトッ」／貼り合わさる「ペタッ＋きらっ」／はがす */
  function sfxPlace() { raw(function (R, t) { R.noise(t, 0.04, 0.16, 2500, 700); R.tone(330, t, 0.06, 'triangle', 0.14, 220); }); }
  function sfxStick(n) {
    raw(function (R, t) {
      R.noise(t, 0.07, 0.22, 900, 3500);
      R.tone(196, t, 0.12, 'triangle', 0.2, 130);
      var up = Math.min(n || 0, 8);
      [0, 4, 7, 12].forEach(function (s, k) { R.tone(R.hz(s + up), t + 0.06 + k * 0.045, 0.32, 'triangle', 0.09); });
      R.tone(R.hz(24 + up), t + 0.24, 0.5, 'sine', 0.06);
    });
    try { if (window.Sfx && Sfx.raw) Sfx.raw.buzz(14); } catch (e) { /* なし */ }
  }
  function sfxPeel() { raw(function (R, t) { R.noise(t, 0.12, 0.14, 5000, 1200); R.tone(660, t + 0.02, 0.14, 'triangle', 0.1, 990); }); }

  /* ---------- 読み上げ（単語だけ） ---------- */
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
  function plain(w) { return w.replace(/\|/g, ''); }
  function artOf(g) { return g === 'f' ? 'la' : g === 'm' ? 'el' : g === 'mf' ? 'el・la' : ''; }
  /* 語尾をタイルの色で見せた語。n＝色をつける語尾の数（後ろから。省くと全部）。noArt で冠詞なし */
  function wHTML(w, o) {
    o = o || {};
    var p = w.w.split('|'), k = p.length - 1, n = o.n == null ? k : o.n, a = o.noArt ? '' : artOf(w.g), h = '';
    p.forEach(function (seg, i) {
      if (i === 0) { h += esc(seg); return; }
      var s = SUFBY[w.sfs[i - 1]];
      h += (i > k - n) ? '<b class="tl" style="--c:' + s.color + '">' + esc(seg) + '</b>' : esc(seg);
    });
    return (a ? '<span class="art">' + a + '</span> ' : '') + '<span class="wd">' + h + '</span>';
  }
  function tileHTML(s) { return '<b class="chip" style="--c:' + s.color + '">' + esc(s.label) + '</b>'; }
  function artKey(w) {
    if (w.g === 'mf' && w.sf === 'ista') return 'both';
    if (w.g === 'f' && (w.sf === 'dad' || w.sf === 'cion' || w.sf === 'eria')) return 'la';
    return '';
  }
  /* 文の語をタップで調べられるように（4級以上は点線） */
  function sentHTML(s, fill) {
    return s.split(/(___|[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)/).map(function (p, i) {
      if (p === '___') return fill ? '<b class="filled">' + esc(fill) + '</b>' : '<span class="blank">？</span>';
      if (i % 2 === 0) return esc(p);
      var e = DICT[p.toLowerCase()];
      if (!e || ((window.ES_WORDS && ES_WORDS.names) || []).indexOf(p) >= 0) return esc(p);
      return '<span class="gw' + (e.lv >= 3 ? ' dot' : '') + '" role="button" data-w="' + esc(p.toLowerCase()) + '">' + esc(p) + '</span>';
    }).join('');
  }
  function showPop(el) {
    var e = DICT[el.getAttribute('data-w')], pop = $('pop');
    if (!e) return;
    pop.innerHTML = '<b>' + esc(e.w) + '</b><span>' + esc(e.ja) + '</span>';
    pop.hidden = false;
    var r = el.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
    pop.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + 'px';
    pop.style.top = (r.top - h - 8 < 8 ? r.bottom + 8 : r.top - h - 8) + 'px';
    Speech.say(e.w);
  }

  /* ---------- 進み具合 ---------- */
  function met(w) { return !!S.words[w.id]; }
  function metAll() { return WORDS.filter(met); }
  function unlocked(sf) { return !!S.tiles[sf]; }
  function stageDone(i) { return CORE[i].every(met); }
  function nextNew() {
    for (var i = 0; i < CORE.length; i++) {
      var rest = CORE[i].filter(function (w) { return !met(w); });
      if (rest.length) {
        var pairs = makePairs(i, rest).slice(0, 2), words = [];
        pairs.forEach(function (p) { p.forEach(function (w) { if (!met(w) && words.indexOf(w) < 0) words.push(w); }); });
        return { st: i, pairs: pairs, words: words, first: !STAGES[i].every(unlocked) };
      }
    }
    return null;
  }
  /* 入荷は2語ずつ、ちがう語尾の組でくらべる。同じ元の語の組（real → realmente／realidad）を先に */
  function makePairs(i, rest) {
    var left = rest.slice(), pairs = [];
    rest.forEach(function (a) {
      if (left.indexOf(a) < 0) return;
      var b = left.filter(function (x) { return x !== a && x.base === a.base && x.sf !== a.sf; })[0];
      if (b) { pairs.push([a, b]); left.splice(left.indexOf(a), 1); left.splice(left.indexOf(b), 1); }
    });
    while (left.length) {
      var a = left.shift(), b = left.filter(function (x) { return x.sf !== a.sf; })[0];
      if (b) left.splice(left.indexOf(b), 1);
      else b = CORE[i].filter(function (x) { return x.sf !== a.sf; })[0];   /* 相手がいなければ、出会った語をくらべ役に */
      pairs.push(b ? [a, b] : [a]);
    }
    return pairs;
  }
  function byDue(a, b) { var x = S.words[a.id].due, y = S.words[b.id].due; return x < y ? -1 : x > y ? 1 : 0; }
  function dueWords() { var t = day(0); return metAll().filter(function (w) { return S.words[w.id].due <= t; }); }
  /* 初見チャレンジに出せる語：語尾は全部棚にあり、その段階の8語は出会いずみ */
  function peelable() {
    return WORDS.filter(function (w) { return w.x && !met(w) && w.sfs.every(unlocked) && stageDone(w.st); });
  }
  function weakList() {
    var out = [];
    SUF.forEach(function (s) { var m = S.weak[s.id]; if (m && Object.keys(m).length) out.push({ sf: s.id, ids: Object.keys(m) }); });
    return out;
  }
  function lvOf(xp) { var l = 1; while (xp >= need(l)) l++; return l; }
  function need(l) { return 40 * l * (l + 1); }   /* レベル l を終えるのに要る通算 XP */
  function title(l) { return TITLES[Math.min(l, TITLES.length) - 1]; }

  /* ---------- 画面の切りかえ ---------- */
  var SCREENS = ['home', 'play', 'done'];
  function show(id) { SCREENS.forEach(function (s) { $(s).hidden = s !== id; }); window.scrollTo(0, 0); $('pop').hidden = true; }

  /* 棚（＝地図）。o.roles 役割の字を出す／o.on(sf) 押せるか／o.glow 光らせるタイル／o.count 数を出す／o.fresh 新しく入ったタイル */
  function rackHTML(o) {
    o = o || {};
    var h = '<div class="rack' + (o.roles ? ' roles' : '') + '">';
    ['adj', 'verb', 'noun'].forEach(function (g) {
      var tiles = SUF.filter(function (s) { return s.grp === g; });
      var open = tiles.some(function (s) { return unlocked(s.id) || (o.show && o.show.indexOf(s.id) >= 0); });
      h += '<div class="rrow"><span class="rlab' + (open ? '' : ' off') + '">' + (open ? GRP[g] + '<i>に貼る</i>' : '？') + '</span><div class="rtiles n' + tiles.length + '">';
      tiles.forEach(function (s) {
        var vis = unlocked(s.id) || (o.show && o.show.indexOf(s.id) >= 0), can = vis && (!o.on || o.on(s.id));
        var cnt = o.count ? WORDS.filter(function (w) { return w.sf === s.id && met(w); }).length : 0;
        h += '<button class="tile' + (vis ? '' : ' lock') + (o.glow === s.id ? ' glow' : '') + (o.fresh && o.fresh.indexOf(s.id) >= 0 ? ' fresh' : '') + '" data-sf="' + s.id + '" style="--c:' + s.color + '"' + (can ? '' : ' disabled') + '>' +
          '<b>' + (vis ? esc(s.label) : '？') + '</b>' + (vis ? '<small>' + esc(s.role) + '</small>' : '') + (o.count && vis ? '<i class="cnt">' + cnt + '</i>' : '') + '</button>';
      });
      h += '</div></div>';
    });
    return h + '</div>';
  }

  /* =========================================================
   * ホーム
   * ========================================================= */
  function home() {
    cur = null; clearTimeout(timer);
    var n = metAll().length, nw = nextNew(), due = dueWords(), lv = lvOf(S.xp), lo = lv > 1 ? need(lv - 1) : 0, weak = weakList();
    var h = '<header class="top"><a class="back" href="index.html" aria-label="コース一覧へ">←</a>' +
      '<div class="lv"><b>Lv ' + lv + '</b><span>' + title(lv) + '</span><span class="lvbar"><i style="width:' + Math.round((S.xp - lo) / (need(lv) - lo) * 100) + '%"></i></span></div></header>' +
      '<h1 class="logo">¡PEGA!<small>語尾タイルを貼って、単語をふやす ・ 西検4級</small></h1>';
    h += '<div class="shelf">' + rackHTML({ roles: true, count: true }) + '<p class="made">🧱 つくれる語 <b>' + n + '</b></p></div>';
    var reviewFirst = (due.length >= 8) || (!nw && n > 0);
    var newLabel = nw ? (nw.first ? 'あたらしいタイルが届いた' : STAGES[nw.st].map(function (id) { return SUFBY[id].label; }).join('・') + ' の語、あと ' + CORE[nw.st].filter(function (w) { return !met(w); }).length) : '';
    var bNew = nw ? '▶ 入荷：あたらしい ' + nw.words.length + ' 語<small>' + newLabel + '</small>' : '';
    var bRev = n ? '▶ きょうの注文<small>' + (due.length ? '届いている注文 ' + Math.min(due.length, 10) + ' 件' : 'きょうの分は済み（練習はできる）') + '</small>' : '';
    if (weak.length) h += '<button class="rem" id="hRem">🩹 おさらい：' + esc(SUFBY[weak[0].sf].label) + '<small>まちがえた ' + weak[0].ids.length + ' 語にリベンジ</small></button>';
    if (reviewFirst) { h += '<button class="cta" id="hRev">' + bRev + '</button>'; if (nw) h += '<button class="sub" id="hNew">' + bNew + '</button>'; }
    else { h += '<button class="cta" id="hNew">' + bNew + '</button>'; if (n) h += '<button class="sub" id="hRev">' + bRev + '</button>'; }
    if (!n) h += '<p class="note">1回は2分ほど。4つの語を貼って読んでから、注文にこたえる。</p>';
    else if (!nw) h += '<p class="note">タイルは8枚ぜんぶそろった。あとは注文で、日をあけて思い出す。</p>';
    h += '<div class="settings">' +
      '<label><input type="checkbox" id="tgSound"' + (S.settings.sound ? ' checked' : '') + '> 🔈 効果音</label>' +
      '<label><input type="checkbox" id="tgSpeak"' + (S.settings.speak ? ' checked' : '') + '> 🗣 単語を読み上げる</label>' +
      '<button class="link" id="hReset">記録をリセット</button></div>';
    $('home').innerHTML = h;
    show('home');
    if ($('hNew')) $('hNew').onclick = function () { sfx('tap'); startNew(); };
    if ($('hRev')) $('hRev').onclick = function () { sfx('tap'); startReview(); };
    if ($('hRem')) $('hRem').onclick = function () { sfx('tap'); startRemedy(weak[0].sf); };
    $('tgSound').onchange = function () { S.settings.sound = this.checked; save(); };
    $('tgSpeak').onchange = function () { S.settings.speak = this.checked; save(); };
    $('hReset').onclick = function () { if (confirm('記録をぜんぶ消して、最初からにしますか？')) { S = fresh(); save(); home(); } };
    each($('home'), '.tile:not(.lock)', function (b) { b.disabled = false; b.onclick = function () { sfx('tap'); book(b.getAttribute('data-sf')); }; });
  }

  /* 語尾ごとの一覧（きまり＋つくれる語） */
  function ruleOf(sf) { return STG[STOF[sf]].rule; }
  function book(sf) {
    var s = SUFBY[sf];
    var h = '<h2>' + tileHTML(s) + '</h2><p class="rule">' + ruleOf(sf) + '</p><ul class="blist">';
    WORDS.filter(function (w) { return w.sf === sf; }).forEach(function (w) {
      if (!met(w)) { if (!w.x) h += '<li class="yet">？？？</li>'; return; }
      h += liHTML(w);
    });
    $('mbody').innerHTML = h + '</ul>';
    $('modal').hidden = false;
    each($('mbody'), 'li[data-say]', function (li) { li.onclick = function () { Speech.say(li.getAttribute('data-say')); }; });
  }
  function liHTML(w, cls) {
    return '<li data-say="' + esc(plain(w.w)) + '"' + (cls ? ' class="' + cls + '"' : '') + '><span class="bb">' + esc(w.base) + '<small>' + esc(w.bja) + '</small></span><span class="br">' +
      wHTML(w) + '<small>' + esc(w.ja) + '</small>' + (w.memo ? '<em>' + esc(w.memo) + '</em>' : '') + '</span></li>';
  }

  /* =========================================================
   * 1回の流れ
   * ========================================================= */
  var cur = null, timer = 0;
  function newCur(kind, o) {
    cur = { kind: kind, q: [], i: 0, done: 0, total: 0, combo: 0, maxCombo: 0, xp0: S.xp, lv0: lvOf(S.xp), miss: {}, hint: {}, words: {}, gotNew: [], steps: 0, step: 0 };
    for (var k in o) cur[k] = o[k];
    $('pXp').textContent = S.xp;
    FX.combo(0);
    $('play').classList.remove('fever');
    show('play');
  }
  function startNew() {
    var n = nextNew();
    if (!n) { startReview(); return; }
    newCur('new', { st: n.st, news: n.words, pairs: n.pairs, first: n.first });
    cur.k = 0;
    meet();
  }
  function startReview() {
    var all = metAll();
    if (!all.length) { startNew(); return; }
    newCur('review', {});
    var due = shuffle(dueWords()).sort(byDue);
    var rest = shuffle(all.filter(function (w) { return due.indexOf(w) < 0; })).sort(function (a, b) { return S.words[a.id].box - S.words[b.id].box; });
    cur.q = shuffle(due.concat(rest).slice(0, 10)).map(function (w) { return Q(pickType(w), w); });
    orders();
  }
  function startRemedy(sf) {
    var ids = Object.keys(S.weak[sf] || {});
    if (!ids.length) { home(); return; }
    newCur('remedy', { sf: sf });
    cur.q = shuffle(ids).map(function (id) { return Q(S.weak[sf][id], WBY[id]); });
    remedyIntro(sf);
  }

  function Q(type, w, cz) { cur.words[w.id] = 1; return { type: type, w: w, cz: cz || (type === 'cloze' ? shuffle(CLZ[w.id])[0] : null) }; }
  /* 出会ったあとの語に出す注文の形（その語で出せるものから） */
  function pickType(w) {
    var box = S.words[w.id] ? S.words[w.id].box : 0, bag = ['craft', 'craft', 'craft', 'read', 'read'];
    if (artKey(w)) bag.push('art');
    if (w.bad) bag.push('seam');
    if (CLZ[w.id] && box >= 1) bag.push('cloze', 'cloze', 'cloze');
    else if (CLZ[w.id]) bag.push('cloze');
    return bag[Math.floor(Math.random() * bag.length)];
  }
  function setProg() {
    var all = cur.steps || 1;
    $('pProg').style.width = Math.round(cur.step / all * 100) + '%';
  }
  function lead(html, chg) {
    var el = $('lead'); el.innerHTML = html;
    if (chg && el.animate) el.animate([{ transform: 'translateY(6px)', opacity: 0.2 }, { transform: 'none', opacity: 1 }], { duration: 260, easing: 'ease-out' });
  }
  function clearBoard() { clearTimeout(timer); $('fb').innerHTML = ''; $('hand').innerHTML = ''; $('hand').hidden = true; $('tray').innerHTML = ''; $('pop').hidden = true; }
  function addXp(n, el) {
    if (cur.fever) n *= 2;
    S.xp += n; $('pXp').textContent = S.xp; FX.pop($('pXp').parentNode, 1.2);
    if (el) { var p = FX.at(el); FX.floatText(p.x, p.y - 30, '+' + n + ' XP', cur.fever ? '#ffd84d' : '#5fdc94'); }
  }
  function nextBtn(label, fn) {
    var b = document.createElement('button');
    b.className = 'nextb'; b.innerHTML = label || 'つぎへ ▶';
    b.onclick = function () { sfx('tap'); fn(); };
    $('tray').appendChild(b);   /* つぎへ は下の決まった場所に。説明（#fb）は頭から読めるように上へ戻す */
    $('fb').scrollTop = 0;
  }
  function mark(sel, isRight, chosen) {
    each($('tray'), sel, function (o) {
      o.disabled = true;
      if (isRight(o)) o.classList.add('ok'); else if (o === chosen) o.classList.add('ng'); else o.classList.add('dim');
    });
  }
  function meanOpts(w) {
    /* 意味の4択：同じ元の語の別の語尾 → 同じ語尾 → そのほか、の順にはずれを選ぶ */
    var root = w.root || w.base, pool = WORDS.filter(function (x) { return x.id !== w.id && x.ja !== w.ja; });
    var sib = shuffle(pool.filter(function (x) { return x.base === w.base || x.base === root || (x.root || '') === root; }));
    var same = shuffle(pool.filter(function (x) { return x.sf === w.sf && sib.indexOf(x) < 0; }));
    var other = shuffle(pool.filter(function (x) { return x.sf !== w.sf && sib.indexOf(x) < 0; }));
    var picks = sib.slice(0, 1).concat(same.slice(0, 1), other).slice(0, 3);
    return shuffle([w.ja].concat(picks.map(function (x) { return x.ja; })));
  }
  function optsHTML(list, es) { return '<div class="opts">' + list.map(function (t) { return '<button class="opt' + (es ? ' es' : '') + '" data-v="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>'; }
  function memoHTML(w) { return w.memo ? '<p class="memo">💡 ' + esc(w.memo) + '</p>' : ''; }
  function fromHTML(w) { return '<p class="from">' + esc(w.base) + '（' + esc(w.bja) + '）＋ ' + tileHTML(SUFBY[w.sf]) + '</p>'; }

  /* ---------- 入荷：2語をくらべる → どっちか考える → なぜそうなるか ---------- */
  /* 元の語〔品詞〕＋ タイル → できた語。open で意味と冠詞も見せる */
  function rowHTML(w, open) {
    var s = SUFBY[w.sf];
    return '<div class="mrow"><div class="mtop"><span class="bcard">' + esc(w.base) + '<small>' + esc(w.bja) + '〔' + GRP[s.grp] + '〕</small></span>' +
      '<span class="plus">＋</span>' + tileHTML(s) + '<span class="plus">→</span></div>' +
      '<span class="plaque sm">' + wHTML(w, open ? {} : { noArt: true }) + '<small>' + (open ? esc(w.ja) : '？') + '</small></span></div>';
  }
  function whyHTML(w) {
    var s = SUFBY[w.sf];
    return '<p class="why">' + esc(w.base) + ' は' + GRP[s.grp] + '。' + tileHTML(s) + ' は「' + esc(KINDS[s.kind]) + '」を言うタイル → <b>' + esc(plain(w.w)) + '</b>＝' + esc(w.ja) + '</p>';
  }
  function meet() {
    var pr = cur.pairs[cur.k], first = cur.first && cur.k === 0, ids = STAGES[cur.st];
    var ask = pr[Math.floor(Math.random() * pr.length)], two = pr.length === 2;
    cur.steps = cur.pairs.length; cur.step = cur.k; setProg();
    clearBoard();
    lead('入荷 ' + (cur.k + 1) + ' / ' + cur.pairs.length + '：' + (two ? '2つの語をくらべよう' : 'この語を読もう') +
      (first ? '<small>はじめてのタイル。予想でいい（採点しない）</small>' : '<small>タイルの仕事を思い出して</small>'));
    $('bench').innerHTML = pr.map(function (w) { return rowHTML(w, false); }).join('') +
      '<p class="iqq">' + (two ? '「' + esc(ask.ja) + '」はどっち？' : 'どういう意味？') + '</p>';
    var right = two ? plain(ask.w) : ask.ja;
    $('tray').innerHTML = two ? optsHTML(shuffle(pr.map(function (w) { return plain(w.w); })), true) : optsHTML(meanOpts(ask));
    each($('tray'), '.opt', function (o) {
      o.onclick = function () {
        var v = o.getAttribute('data-v'), ok = v === right;
        mark('.opt', function (x) { return x.getAttribute('data-v') === right; }, o);
        if (first) { ids.forEach(function (id) { S.tiles[id] = 1; }); save(); }
        $('bench').innerHTML = pr.map(function (w) { return rowHTML(w, true); }).join('');
        Speech.say(plain(ask.w));
        if (ok) { sfxStick(1); addXp(XP.pred, $('bench')); var p = FX.at($('bench')); FX.burst(p.x, p.y, { n: 16 }); }
        else sfx('tap');
        var h = ok ? '<p class="right">✨ そのとおり</p>' : '<p class="you">あなた：' + esc(v) + '</p>';
        h += pr.map(whyHTML).join('');
        if (first) h += '<p class="rule">' + STG[cur.st].rule + '</p>';
        h += pr.map(memoHTML).join('');
        $('fb').innerHTML = h;
        lead(first ? '棚に ' + ids.map(function (id) { return tileHTML(SUFBY[id]); }).join(' ') + ' が入った' : (ok ? 'タイルの仕事で選べた' : 'タイルの仕事を確かめよう'), true);
        $('tray').innerHTML = '';
        nextBtn('', function () {
          cur.k++;
          if (cur.k < cur.pairs.length) meet();
          else { buildNewQueue(); orders(); }
        });
      };
    });
  }
  /* タイルが棚から台へ飛ぶ */
  function fly(from, to, done) {
    sfxPlace();
    if (FX.RM || !from.animate) { done(); return; }
    var a = from.getBoundingClientRect(), b = to.getBoundingClientRect(), c = from.cloneNode(true);
    c.className = 'tile flyer'; c.style.cssText += ';position:fixed;left:' + a.left + 'px;top:' + a.top + 'px;width:' + a.width + 'px;height:' + a.height + 'px;margin:0;z-index:60;pointer-events:none';
    document.body.appendChild(c);
    var an = c.animate([{ transform: 'translate(0,0) scale(1)' }, { transform: 'translate(' + (b.left + b.width / 2 - a.left - a.width / 2) + 'px,' + (b.top + b.height / 2 - a.top - a.height / 2) + 'px) scale(.8)' }], { duration: 190, easing: 'cubic-bezier(.3,.7,.3,1)' });
    an.onfinish = function () { c.remove(); done(); };
  }
  /* 貼り合わさって1語になる（台の2枚が消えて、語のプレートが出る） */
  function fuse(w, o) {
    var j = $('join');
    if (j) j.classList.add('gone');
    $('res').innerHTML = '<span class="plaque pop">' + wHTML(w, o) + '</span>';
    var p = FX.at($('res'));
    FX.burst(p.x, p.y, { n: 18, ring: true });
    sfxStick(cur.combo);
  }
  function buildNewQueue() {
    var news = cur.news;
    cur.gotNew = news.slice();
    var olds = shuffle(metAll().filter(function (w) { return news.indexOf(w) < 0; })).sort(byDue).slice(0, 3);
    var a = shuffle(news.map(function (w) { return Q('craft', w); }).concat(olds.slice(0, 2).map(function (w) { return Q('craft', w); })));
    var b = news.map(function (w) { return Q('read', w); });
    var ex = shuffle(news).map(function (w) { return w.bad ? Q('seam', w) : artKey(w) ? Q('art', w) : null; }).filter(Boolean).slice(0, 2);
    var cz = olds.filter(function (w) { return CLZ[w.id]; }).slice(0, 1).map(function (w) { return Q('cloze', w); });
    cur.q = a.concat(shuffle(b.concat(ex, cz)));
  }

  /* ---------- おさらい：きまりを見てから、まちがえた語にリベンジ ---------- */
  function remedyIntro(sf) {
    var s = SUFBY[sf], ex = WORDS.filter(function (w) { return w.sf === sf && met(w) && !S.weak[sf][w.id]; }).slice(0, 2);
    if (ex.length < 2) ex = WORDS.filter(function (w) { return w.sf === sf && met(w); }).slice(0, 2);
    clearBoard(); cur.steps = 1; cur.step = 0; setProg();
    lead('🩹 おさらい：' + esc(s.label) + ' のきまり');
    $('bench').innerHTML = '<ul class="blist ex">' + ex.map(function (w) { return liHTML(w); }).join('') + '</ul><p class="rule">' + ruleOf(sf) + '</p>';
    $('tray').innerHTML = rackHTML({ roles: true, on: function () { return false; }, glow: sf });
    nextBtn('▶ リベンジ ' + cur.q.length + ' 問', orders);
  }

  /* =========================================================
   * 注文（採点する）
   * ========================================================= */
  function orders() {
    cur.phase = 'orders'; cur.i = 0; cur.done = 0; cur.total = cur.q.length;
    cur.steps = cur.total; cur.step = 0;
    ask();
  }
  function ask() {
    if (cur.i >= cur.q.length) { afterOrders(); return; }
    var q = cur.q[cur.i];
    clearBoard(); setProg();
    ({ craft: askCraft, read: askRead, art: askArt, seam: askSeam, cloze: askCloze })[q.type](q, q.w, SUFBY[q.w.sf]);
  }
  function answered(ok, fbHTML, el, slow) {
    var q = cur.q[cur.i], hinted = !!q.hinted;
    if (ok) {
      cur.done++; cur.step = cur.done; setProg();
      if (hinted) { cur.hint[q.w.id] = 1; }
      else { cur.combo++; cur.maxCombo = Math.max(cur.maxCombo, cur.combo); if (cur.combo > S.best) S.best = cur.combo; }
      var fever = cur.combo >= 5;
      if (fever && !cur.fever) { sfx('combo', cur.combo); $('play').classList.add('fever'); }
      cur.fever = fever;
      FX.combo(cur.combo, fever);
      sfx('correct', cur.combo);
      addXp(hinted ? Math.ceil(XP[q.type] / 2) : XP[q.type], el);
      $('fb').innerHTML = fbHTML || '';
      timer = setTimeout(next, slow ? 1900 : fbHTML ? 1500 : 900);
    } else {
      cur.combo = 0; cur.fever = false; FX.combo(0); $('play').classList.remove('fever');
      cur.miss[q.w.id] = q.type;
      cur.q.push({ type: q.type, w: q.w, cz: q.cz, again: true });   /* この回のうちに、もう一度 */
      sfx('wrong'); FX.shake($('bench'));
      $('fb').innerHTML = fbHTML;
      nextBtn('', next);
    }
  }
  function next() { clearTimeout(timer); cur.i++; ask(); }

  /* つくる：注文（意味）を見て、手1「何を言う語か」→ 手2「どのタイルを貼るか」。
   *  理由（何を言う語か × 元の語の品詞）から自分でタイルを決める。タイルの役割の字は隠す（💡 で開く） */
  function askCraft(q, w, s) {
    var locked = false, bg = s.grp;
    if (w.sfs.length > 1) bg = 'adj';   /* peligroso → peligrosamente：元の語（形容詞）に -mente */
    lead('注文：この意味の語をつくろう' + (q.again ? '<small>（もう一度）</small>' : ''));
    $('bench').innerHTML = '<div class="order">「<b>' + esc(w.ja) + '</b>」<button class="hintb" id="hint" aria-label="ヒント">💡</button></div>' +
      '<div class="join" id="join"><span class="bcard big">' + esc(w.base) + '<small>' + esc(w.bja) + '〔' + GRP[bg] + '〕</small></span><span class="plus">＋</span><div class="slot" id="slot2">？</div></div>' +
      '<p class="step" id="step">手1：「' + esc(w.ja) + '」は、何を言う語？</p><div class="res" id="res"></div>';
    /* 手1：棚にあるタイルの「何を言う語か」から */
    var kinds = uniq(SUF.filter(function (x) { return unlocked(x.id); }).map(function (x) { return x.kind; }));
    if (kinds.indexOf(s.kind) < 0) kinds.push(s.kind);
    $('tray').innerHTML = '<div class="opts">' + shuffle(kinds).map(function (k) { return '<button class="opt" data-v="' + k + '">' + esc(KINDS[k]) + '</button>'; }).join('') + '</div>';
    $('hint').onclick = function () {
      if (q.hinted) return;
      q.hinted = true; sfx('tap'); $('hint').classList.add('used');
      var r = $('tray').querySelector('.rack');
      if (r) r.classList.add('roles');
      else $('step').innerHTML += '<small>💡 ' + esc(w.base) + ' は' + GRP[bg] + '。棚の' + GRP[bg] + 'の段のタイルのどれか</small>';
    };
    each($('tray'), '.opt', function (o) {
      o.onclick = function () {
        var k = o.getAttribute('data-v');
        mark('.opt', function (x) { return x.getAttribute('data-v') === s.kind; }, o);
        if (k !== s.kind) {
          $('res').innerHTML = '<span class="plaque">' + wHTML(w) + '<small>' + esc(w.ja) + '</small></span>';
          answered(false, '<p class="you">✕ あなた：' + esc(KINDS[k]) + '</p>' + reason(w, s, bg) + memoHTML(w));
          return;
        }
        sfxPlace();
        $('step').innerHTML = '<span class="kindok">✓ ' + esc(KINDS[k]) + '</span>手2：' + esc(w.base) + '〔' + GRP[bg] + '〕に貼るタイルは？';
        FX.pop($('step'));
        $('tray').innerHTML = rackHTML(q.hinted ? { roles: true } : {});
        each($('tray'), '.tile', function (b) {
          b.onclick = function () {
            if (locked) return;
            locked = true;
            var t = b.getAttribute('data-sf'), ok = t === w.sf;
            each($('tray'), '.tile', function (x) { x.disabled = true; if (x.getAttribute('data-sf') === w.sf) x.classList.add('ok'); else if (x === b) x.classList.add('ng'); });
            fly(b, $('slot2'), function () {
              if (ok) { fuse(w); Speech.say(plain(w.w)); answered(true, memoHTML(w), $('res'), !!w.memo); return; }
              var ps = SUFBY[t], made = WORDS.filter(function (x) { return x.base === w.base && x.sf === t; })[0];
              $('tray').querySelector('.rack').classList.add('roles');
              $('res').innerHTML = '<span class="plaque">' + wHTML(w) + '<small>' + esc(w.ja) + '</small></span>';
              var you = made ? esc(plain(made.w)) + '（' + esc(made.ja) + '）になる' :
                ps.grp !== bg ? ps.label + ' は' + GRP[ps.grp] + 'に貼るタイル（' + esc(w.base) + ' は' + GRP[bg] + '）' : ps.label + ' は「' + esc(KINDS[ps.kind]) + '」';
              answered(false, '<p class="you">✕ あなた：' + tileHTML(ps) + ' → ' + esc(you) + '</p>' + reason(w, s, bg) + memoHTML(w));
            });
          };
        });
      };
    });
  }
  /* 正解までの理由（見る順：何を言う語か → 元の語の品詞 → タイル） */
  function reason(w, s, bg) {
    var extra = s.kind === 'person' && bg === 'noun' ? '<p class="from">' + esc(s.short) + '</p>' : '';
    return '<p class="right">○「' + esc(w.ja) + '」は' + esc(KINDS[s.kind]) + '。' + esc(w.base) + ' は' + GRP[bg] + ' → ' + tileHTML(s) + '</p>' + extra;
  }
  /* 意味 */
  function askRead(q, w) {
    lead('どういう意味？' + (q.again ? '<small>（もう一度）</small>' : ''));
    $('bench').innerHTML = '<div class="res tall" id="res"><span class="plaque">' + wHTML(w) + '</span></div>';
    $('tray').innerHTML = optsHTML(meanOpts(w));
    Speech.say(plain(w.w));
    each($('tray'), '.opt', function (o) {
      o.onclick = function () {
        var v = o.getAttribute('data-v'), ok = v === w.ja;
        mark('.opt', function (x) { return x.getAttribute('data-v') === w.ja; }, o);
        answered(ok, (ok ? '' : '<p class="you">✕ あなた：' + esc(v) + '</p><p class="right">○ 正解：<b>' + esc(w.ja) + '</b></p>') + fromHTML(w) + (ok ? '' : memoHTML(w)), $('res'));
      };
    });
  }
  /* el / la */
  function askArt(q, w, s) {
    var g = artKey(w);
    lead('el ？　la ？' + (q.again ? '<small>（もう一度）</small>' : ''));
    $('bench').innerHTML = '<div class="res tall" id="res"><span class="plaque"><span class="blank" id="blank">＿＿</span> ' + wHTML(w, { noArt: true }) + '<small>' + esc(w.ja) + '</small></span></div>';
    $('tray').innerHTML = '<div class="opts">' + [['el', 'el'], ['la', 'la'], ['both', 'どちらも（el・la）']].map(function (o) { return '<button class="opt" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>';
    each($('tray'), '.opt', function (o) {
      o.onclick = function () {
        var ok = o.getAttribute('data-v') === g;
        mark('.opt', function (x) { return x.getAttribute('data-v') === g; }, o);
        $('blank').textContent = g === 'both' ? 'el・la' : g; $('blank').classList.add('fill');
        answered(ok, '<p class="' + (ok ? 'from' : 'right') + '">' + esc(s.gnote) + '</p>', $('res'));
      };
    });
  }
  /* つづり */
  function askSeam(q, w, s) {
    var good = plain(w.w);
    lead('貼ったあとの、正しいつづりは？' + (q.again ? '<small>（もう一度）</small>' : ''));
    $('bench').innerHTML = '<div class="order">「<b>' + esc(w.ja) + '</b>」</div><div class="join"><div class="bcard big">' + esc(w.base) + '<small>' + esc(w.bja) + '</small></div><span class="plus">＋</span>' + tileHTML(s) + '</div><div class="res" id="res"></div>';
    $('tray').innerHTML = optsHTML(shuffle([good].concat(w.bad)), true);
    each($('tray'), '.opt', function (o) {
      o.onclick = function () {
        var ok = o.getAttribute('data-v') === good;
        mark('.opt', function (x) { return x.getAttribute('data-v') === good; }, o);
        $('res').innerHTML = '<span class="plaque pop">' + wHTML(w) + '</span>';
        Speech.say(good);
        var why = w.sf === 'mente' ? '-o で終わる形容詞は、-a に変えてから -mente（' + esc(w.base) + ' → ' + esc(w.w.split('|')[0]) + ' → ' + esc(good) + '）' : (w.memo || '');
        answered(ok, '<p class="' + (ok ? 'from' : 'right') + '">' + why + '</p>', $('res'), true);
      };
    });
  }
  /* 文に合う形 */
  function askCloze(q, w) {
    var c = q.cz, right = c.opts[0];
    lead('文に合う形は？<small>（語はタップで調べられる）</small>');
    $('bench').innerHTML = '<p class="sent" id="sent">' + sentHTML(c.s) + '</p><p class="sja" id="sja"></p>';
    $('tray').innerHTML = optsHTML(shuffle(c.opts), true);
    each($('tray'), '.opt', function (o) {
      o.onclick = function () {
        var v = o.getAttribute('data-v'), ok = v === right;
        mark('.opt', function (x) { return x.getAttribute('data-v') === right; }, o);
        $('sent').innerHTML = sentHTML(c.s, right);
        $('sja').textContent = c.ja;
        answered(ok, (ok ? '' : '<p class="you">✕ あなた：' + esc(v) + '</p>') + '<p class="' + (ok ? 'from' : 'right') + '">' + esc(c.why) + '</p>', $('sent'), true);
      };
    });
  }

  /* ---------- 初見チャレンジ：語尾タイルをはがして読む（採点しない） ---------- */
  function afterOrders() {
    var cand = cur.kind === 'remedy' ? [] : peelable();
    if (!cand.length) { finish(); return; }
    /* いま習っている段階の語を先に */
    var st = cur.kind === 'new' ? cur.st : -1;
    cand = shuffle(cand).sort(function (a, b) { return (b.st === st) - (a.st === st); });
    peel(cand[0]);
  }
  function peel(w) {
    var todo = w.sfs.slice().reverse(), n = 0;
    cur.phase = 'peel';
    clearBoard();
    lead('🔍 初見チャレンジ：はじめての語。語尾タイルをはがそう<small>（採点しない）</small>');
    function draw() { $('bench').innerHTML = '<div class="res tall" id="res"><span class="plaque">' + wHTML(w, { n: n, noArt: true }) + '</span></div><div id="bits" class="bits"></div>'; }
    draw();
    $('tray').innerHTML = rackHTML({});
    Speech.say(plain(w.w));
    each($('tray'), '.tile', function (b) {
      b.onclick = function () {
        var sf = b.getAttribute('data-sf');
        if (sf !== todo[n]) {
          FX.shake(b); sfx('tap');
          lead(n ? 'もう1枚、貼ってある。残りのいちばん後ろを見よう' : '語のいちばん後ろを見よう。どのタイルが貼ってある？', true);
          return;
        }
        n++; sfxPeel(); b.classList.add('ok'); b.disabled = true;
        draw(); FX.pop($('res'));
        if (n < todo.length) { lead('もう1枚、貼ってある。その前の語尾は？', true); return; }
        /* はがし終えた：元の語と、貼ってあったタイルの仕事を見せる → 意味を予想 */
        var root = w.root || w.base, rja = w.rja || w.bja;
        $('bits').innerHTML = '<span class="bcard">' + esc(root) + '<small>' + esc(rja) + '</small></span>' +
          w.sfs.map(function (id) { return '<span class="plus">＋</span><span class="bit">' + tileHTML(SUFBY[id]) + '<small>' + esc(SUFBY[id].role) + '</small></span>'; }).join('');
        lead('どういう意味？', true);
        $('tray').innerHTML = optsHTML(meanOpts(w));
        each($('tray'), '.opt', function (o) {
          o.onclick = function () {
            var v = o.getAttribute('data-v'), ok = v === w.ja;
            mark('.opt', function (x) { return x.getAttribute('data-v') === w.ja; }, o);
            $('res').innerHTML = '<span class="plaque">' + wHTML(w) + '<small>' + esc(w.ja) + '</small></span>';
            cur.peeled = { w: w, ok: ok };
            if (ok) {
              FX.slam('¡LEÍDO!', 'gold', '語尾で読めた'); FX.confetti(70); sfx('crit'); addXp(XP.peel, $('res'));
              $('fb').innerHTML = '<p class="right">✨ 習っていない語を、語尾から読めた</p>' + memoHTML(w);
            } else {
              sfx('tap');
              $('fb').innerHTML = '<p class="you">あなたの予想：' + esc(v) + '</p><p class="right">こたえ：<b>' + esc(w.ja) + '</b></p>' + memoHTML(w);
            }
            nextBtn('', finish);
          };
        });
      };
    });
  }

  /* =========================================================
   * おわり：戻す日を決める・おさらいの記録・結果
   * ========================================================= */
  function finish() {
    clearTimeout(timer);
    var ids = Object.keys(cur.words), missN = Object.keys(cur.miss).length, isNew = cur.kind === 'new';
    ids.forEach(function (id) {
      var st = S.words[id], miss = !!cur.miss[id], w = WBY[id];
      if (!st) S.words[id] = { box: 0, due: day(miss ? 0 : 1) };   /* あたらしい語：あした（まちがえたら きょうの注文に） */
      else if (miss) { st.box = 0; st.due = day(1); }
      else if (cur.hint[id]) { st.due = day(1); }                 /* 💡 を使った：強さは伸ばさず、あした */
      else {
        st.box = Math.min(st.box + 1, DAYS.length - 1); st.due = day(DAYS[st.box]);
        if (S.weak[w.sf]) delete S.weak[w.sf][id];                /* あとの回で自力で正解できたら、おさらいの記録から消す */
      }
      if (miss) { (S.weak[w.sf] = S.weak[w.sf] || {})[id] = cur.miss[id]; }   /* まちがえたら、語尾ごとに残す */
    });
    if (cur.peeled) { var pw = cur.peeled.w; S.words[pw.id] = { box: 0, due: day(cur.peeled.ok ? 1 : 0) }; }
    STAGES.forEach(function (st, i) { if (stageDone(i)) { S.lessons[st[0]] = { done: true }; } });
    S.runs++; save();

    var gained = S.xp - cur.xp0, lv = lvOf(S.xp), up = lv > cur.lv0, lo = lv > 1 ? need(lv - 1) : 0;
    var tomorrow = metAll().filter(function (w) { return S.words[w.id].due === day(1); }).length;
    var list = (cur.gotNew || []).concat(cur.peeled ? [cur.peeled.w] : []), nw = nextNew();
    var h = '<div class="dn"><div class="dtitle">' + (cur.kind === 'remedy' ? '¡Revancha!' : '¡Muy bien!') + '</div>' +
      '<p class="dsum">' + cur.total + ' 件の注文' + (missN ? '・まちがえた語 ' + missN : '・ノーミス') + (cur.maxCombo >= 3 ? '・最大 ' + cur.maxCombo + ' コンボ' : '') + '</p>' +
      '<div class="dxp"><b>+' + gained + ' XP</b><div class="lv"><b>Lv ' + lv + '</b><span>' + title(lv) + '</span><span class="lvbar"><i id="dBar" style="width:0"></i></span></div></div>';
    if (list.length) h += '<p class="dlab">🧱 あたらしく つくれるようになった語</p><ul class="blist">' + list.map(function (w) { return liHTML(w, cur.miss[w.id] ? 'missed' : ''); }).join('') + '</ul>';
    if (missN) h += '<p class="dnote">まちがえた語は、' + (isNew ? 'きょうの注文と 🩹 おさらいに出る。' : '🩹 おさらいに出る。') + '</p>';
    if (tomorrow) h += '<p class="dnote">📬 あした届く注文：' + tomorrow + ' 語</p>';
    h += '<button class="cta" id="dHome">ホームへ</button>' + (nw && isNew ? '<button class="sub" id="dMore">▶ つづけて入荷：あたらしい ' + nw.words.length + ' 語</button>' : '') + '</div>';
    $('done').innerHTML = h;
    FX.combo(0); $('play').classList.remove('fever');
    show('done');
    setTimeout(function () { if ($('dBar')) $('dBar').style.width = Math.round((S.xp - lo) / (need(lv) - lo) * 100) + '%'; }, 60);
    if (up) { sfx('levelUp'); FX.confetti(120); FX.slam('LEVEL UP', 'gold', 'Lv ' + lv + '　' + title(lv)); }
    else { sfx('chestOpen', missN ? 'common' : 'rare'); if (!missN) FX.confetti(50); }
    $('dHome').onclick = function () { sfx('tap'); home(); };
    if ($('dMore')) $('dMore').onclick = function () { sfx('tap'); startNew(); };
    each($('done'), 'li[data-say]', function (li) { li.onclick = function () { Speech.say(li.getAttribute('data-say')); }; });
  }

  /* ---------- 共通の操作 ---------- */
  $('pQuit').onclick = function () { if (!cur || (cur.phase !== 'orders' && cur.phase !== 'peel' && !cur.k) || confirm('この回をやめますか？（この回の記録は残りません）')) home(); };
  $('modal').addEventListener('click', function (e) { if (e.target === $('modal') || e.target.classList.contains('mclose')) $('modal').hidden = true; });
  document.addEventListener('click', function (e) {
    var g = e.target.closest ? e.target.closest('.gw') : null;
    if (g) { showPop(g); return; }
    $('pop').hidden = true;
  });
  document.addEventListener('pointerdown', function () { sfx('unlock'); }, { once: true });
  if (SANDBOX) {
    document.body.classList.add('sandbox');
    /* 動作確認用 */
    window.__pega = { S: function () { return S; }, save: save, home: home, cur: function () { return cur; }, peel: function (id) { newCur('review', {}); peel(WBY[id]); },
      reset: function () { S = fresh(); save(); home(); },
      seeAll: function (x) { WORDS.forEach(function (w) { if (!w.x || x) S.words[w.id] = { box: 1, due: day(0) }; }); SUF.forEach(function (s) { S.tiles[s.id] = 1; }); STAGES.forEach(function (st) { S.lessons[st[0]] = { done: true }; }); save(); home(); } };
  }
  home();
})();
