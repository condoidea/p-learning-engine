/* =========================================================
 * ¡PEGA! — 語尾のジェムを武器にはめて戦う。西検4級（v5：作り直し）
 *
 *  武器＝元の語（剣＝形容詞／杖＝動詞／斧＝名詞）。ジェム＝語尾。敵＝空所のある文。
 *  敵の弱点＝空所に入る語の種類。「武器 × 弱点 → はめるジェム（または、そのまま）」を選んで斬る。
 *
 *  章（ジェム1つずつ）の流れ：
 *    宝箱（あたらしいジェム）→ 知っている武器3本にはめて、意味を予想（採点しない）→ ジェムの力（きまり・敵の見分け方）
 *    → 戦い（弱点が見える）→ ボス（弱点は隠れる。💡 で見られるが、自力に数えない）→ 戦利品の鑑定 → 結果
 *  見回り：日をあけて戻ってきた敵と戦う（弱点は隠れる）。まちがえた敵はその回の最後にもう一度。
 *  記録：形ごとに 1・3・7・14・30日。まちがえた形はジェムごとに残し、🩹 おさらい（ジェムの力を見てからリベンジ）。
 *  ジェムの進化（原石→研磨→輝き→伝説）＝そのジェムの形の覚え具合。結果画面でまとめて見せる。
 *  保存：localStorage 'pega.v5'（?sandbox なら 'pega.sandbox5'）。lessons[ジェム].done＝その章をクリア
 * ========================================================= */
(function () {
  'use strict';
  var D = window.PEGA, POS = D.POS, ATT = D.ATT, GEMS = D.GEMS, WP = D.WEAPONS, FORMS = D.FORMS, FOES = D.FOES, CH = D.CH, FX = window.FX;
  var GB = {}, FB = {}, FOE = {}, CHOF = {}, DICT = {};
  GEMS.forEach(function (g) { GB[g.id] = g; });
  FORMS.forEach(function (f) { FB[f.id] = f; f.sfs = f.sfs || (f.gem ? [f.gem] : []); });
  FOES.forEach(function (e) { (FOE[e.form] = FOE[e.form] || []).push(e); });
  CH.forEach(function (c, i) { c.intro.concat(c.fight).forEach(function (id) { CHOF[id] = i; }); c.asis.forEach(function (id) { if (CHOF[id] == null) CHOF[id] = i; }); });
  if (window.ES_WORDS) ES_WORDS.words.forEach(function (e) {
    if (e.pos === 'bad') return;
    [e.w].concat(e.f).forEach(function (f) { if (!DICT[f.toLowerCase()]) DICT[f.toLowerCase()] = e; });
  });
  var DAYS = [1, 3, 7, 14, 30];
  var TITLES = ['見習い剣士', 'ジェム使い', '一人前の剣士', '腕ききの剣士', 'ジェムの騎士', '語尾の勇者', '伝説の勇者', 'マエストロ'];
  var POLISH = [{ n: '原石', s: '' }, { n: '研磨', s: '★' }, { n: '輝き', s: '★★' }, { n: '伝説', s: '★★★' }];
  var FOE_EMO = ['👾', '🦇', '🐍', '🦂', '🕷️', '🐺', '👻', '🧟', '🦖', '🐗', '🦑', '🐸'], BOSS_EMO = ['🐉', '👹', '🦁', '🐲', '🗿', '🦅', '🐙', '👑'];
  var XP = { hit: 10, boss: 14, guess: 4, loot: 20 };

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function each(root, sel, fn) { Array.prototype.forEach.call(root.querySelectorAll(sel), fn); }
  function ymd(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function day(n) { var d = new Date(); d.setDate(d.getDate() + (n || 0)); return ymd(d); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ---------- 保存 ---------- */
  var SANDBOX = /[?&]sandbox\b/.test(location.search);
  var KEY = SANDBOX ? 'pega.sandbox5' : 'pega.v5';
  function fresh() { return { v: 5, xp: 0, ch: 0, gems: {}, items: {}, weak: {}, looted: {}, lessons: {}, polish: {}, runs: 0, best: 0, settings: { sound: true, speak: true } }; }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 5) { var f = fresh(); for (var k in s) f[k] = s[k]; return f; } } catch (e) { /* 保存領域が使えない */ }
    return fresh();
  }
  var S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* 保存できない環境 */ } }
  window.SfxOn = function () { return S.settings.sound; };

  /* ---------- 音 ---------- */
  function sfx(name, a) { try { if (window.Sfx && Sfx[name]) Sfx[name](a); } catch (e) { /* 音が出せない */ } }
  function raw(fn) { try { if (window.Sfx && Sfx.raw) Sfx.raw.play(function (t) { fn(Sfx.raw, t); }); } catch (e) { /* なし */ } }
  function buzz(p) { try { if (window.Sfx && Sfx.raw) Sfx.raw.buzz(p); } catch (e) { /* なし */ } }
  /* ジェムが武器にはまる「カチッ」 */
  function sfxGem() { raw(function (R, t) { R.tone(1320, t, 0.04, 'square', 0.06); R.tone(1980, t + 0.035, 0.12, 'triangle', 0.08); R.noise(t, 0.03, 0.08, 6000, 3000); }); }
  /* 斬る「シャッ」＋ 当たる「ドン」＋ コンボで上がる和音 */
  function sfxSlash(n) {
    raw(function (R, t) {
      R.noise(t, 0.16, 0.26, 9000, 700);
      R.tone(140, t + 0.09, 0.2, 'sine', 0.32, 50);
      R.noise(t + 0.09, 0.08, 0.2, 1200, 300);
      var up = Math.min(n || 0, 9);
      [0, 4, 7, 12].forEach(function (s, k) { R.tone(R.hz(s + up), t + 0.14 + k * 0.04, 0.3, 'triangle', 0.08); });
    });
    buzz(n >= 3 ? [16, 30, 16] : 16);
  }
  /* はじかれる「カキン」 */
  function sfxClink() { raw(function (R, t) { R.tone(2400, t, 0.06, 'square', 0.05); R.tone(1700, t + 0.02, 0.22, 'triangle', 0.08, 1500); R.noise(t, 0.05, 0.12, 7000, 4000); }); buzz([10, 30, 10]); }
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

  /* ---------- 見せ方 ---------- */
  function plain(w) { return w.replace(/\|/g, ''); }
  function artOf(g) { return g === 'f' ? 'la' : g === 'm' ? 'el' : g === 'mf' ? 'el・la' : ''; }
  /* ジェムの色で語尾を見せた語。n＝色をつけるジェムの数（後ろから。省くと全部） */
  function wHTML(f, n) {
    var p = f.w.split('|'), k = p.length - 1, h = '';
    if (n == null) n = k;
    p.forEach(function (seg, i) {
      if (i === 0) { h += esc(seg); return; }
      h += (i > k - n) ? '<b class="tl" style="--c:' + GB[f.sfs[i - 1]].color + '">' + esc(seg) + '</b>' : esc(seg);
    });
    return '<span class="wd">' + h + '</span>';
  }
  Object.keys(POS).forEach(function (k) { POS[k].icon = ART.icon(k); });
  /* ジェムのボタン（絵＋語尾）。そのまま＝空のソケット */
  function gemBtn(g, cls, id) {
    if (!g) return '<button class="gem none' + (cls ? ' ' + cls : '') + '" data-g=""><span class="gi"><svg viewBox="-13 -13 26 26" width="30" height="30" aria-hidden="true">' + ART.socket(0, 0, null) + '</svg></span><b>そのまま</b></button>';
    return '<button class="gem' + (cls ? ' ' + cls : '') + '"' + (id ? ' id="' + id + '"' : '') + ' data-g="' + g.id + '" style="--c:' + g.color + '"><span class="gi">' + ART.gem(g.color, 30) + '</span><b>' + esc(g.label) + '</b></button>';
  }
  /* ジェムの棚（RPG のメニューのウィンドウ） */
  function shelf(title, btns) { return '<div class="win slotwin"><p class="swt">' + title + '</p><div class="gems">' + btns + '</div></div>'; }
  function bigGem(g) { return '<span class="biggem" style="--c:' + g.color + '">' + ART.gem(g.color, 112, { sparkle: true }) + '<b>' + esc(g.label) + '</b></span>'; }
  function gemHTML(g) { return '<b class="chip" style="--c:' + g.color + '">' + esc(g.label) + '</b>'; }
  function attHTML(a) { var t = ATT[a]; return '<span class="att">' + t.icon + ' ' + esc(t.name) + '<small>（' + esc(t.sub) + '）</small></span>'; }
  function attShort(a) { return ATT[a].icon + ' ' + ATT[a].name; }
  function wpHTML(pos) { return POS[pos].icon + ' ' + POS[pos].wp + '（' + POS[pos].name + '）'; }
  function attOf(f) { return f.gem ? GB[f.gem].att : POS[WP[f.base].pos].asis; }
  /* 文の語をタップで調べられるように（4級以上は点線） */
  function sentHTML(s, fill) {
    var start = s.indexOf('___') === 0;
    return s.split(/(___|[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)/).map(function (p, i) {
      if (p === '___') return fill ? '<b class="filled">' + esc(start ? cap(fill) : fill) + '</b>' : '<span class="blank">＿＿</span>';
      if (i % 2 === 0) return esc(p);
      var e = DICT[p.toLowerCase()];
      if (!e || ((window.ES_WORDS && ES_WORDS.names) || []).indexOf(p) >= 0) return esc(p);
      return '<span class="gw' + (e.lv >= 3 ? ' dot' : '') + '" role="button" data-w="' + esc(p.toLowerCase()) + '">' + esc(p) + '</span>';
    }).join('');
  }
  function jaHTML(e, f) { return f ? esc(e.ja).replace('（　）', '<b>' + esc(e.fill || f.ja) + '</b>') : esc(e.ja).replace('（　）', '<span class="jb">（　）</span>'); }
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
  function owned(id) { return !!S.gems[id]; }
  function known(id) { return !!S.items[id]; }
  function knownAll() { return Object.keys(S.items).filter(function (id) { return FB[id]; }); }
  function dueList() { var t = day(0); return knownAll().filter(function (id) { return S.items[id].due <= t; }); }
  function byDue(a, b) { var x = S.items[a].due, y = S.items[b].due; return x < y ? -1 : x > y ? 1 : 0; }
  function weakList() {
    var out = [];
    GEMS.map(function (g) { return g.id; }).concat(['asis']).forEach(function (k) { var m = S.weak[k]; if (m && Object.keys(m).length) out.push({ k: k, ids: Object.keys(m) }); });
    return out;
  }
  /* ジェムの進化：そのジェムの戦う形の覚え具合（箱の平均） */
  function polishOf(gid) {
    var ids = FORMS.filter(function (f) { return f.gem === gid && !f.x; }).map(function (f) { return f.id; });
    var sum = 0; ids.forEach(function (id) { sum += S.items[id] ? Math.min(S.items[id].box, 3) : 0; });
    var avg = sum / ids.length;
    return avg >= 2.6 ? 3 : avg >= 1.6 ? 2 : avg >= 0.8 ? 1 : 0;
  }
  function lvOf(xp) { var l = 1; while (xp >= need(l)) l++; return l; }
  function need(l) { return 50 * l * (l + 1); }
  function title(l) { return TITLES[Math.min(l, TITLES.length) - 1]; }

  /* ---------- 画面の切りかえ ---------- */
  var SCREENS = ['home', 'play', 'done'];
  function show(id) { SCREENS.forEach(function (s) { $(s).hidden = s !== id; }); window.scrollTo(0, 0); $('pop').hidden = true; }

  /* =========================================================
   * ホーム
   * ========================================================= */
  function home() {
    cur = null; clearTimeout(timer);
    var lv = lvOf(S.xp), lo = lv > 1 ? need(lv - 1) : 0, due = dueList(), weak = weakList(), nx = S.ch < CH.length ? CH[S.ch] : null, n = knownAll().length;
    var h = '<header class="top"><a class="back" href="index.html" aria-label="コース一覧へ">←</a>' +
      '<div class="lv"><b>Lv ' + lv + '</b><span>' + title(lv) + '</span><span class="lvbar"><i style="width:' + Math.round((S.xp - lo) / (need(lv) - lo) * 100) + '%"></i></span></div></header>' +
      '<h1 class="logo">¡PEGA!<small>語尾のジェムを武器にはめて戦う ・ 西検4級</small></h1>';
    h += '<div class="win belt"><p class="blab">ジェム<small>（タップで力と図鑑）</small></p><div class="bgems">' + GEMS.map(function (g) {
      if (!owned(g.id)) return '<span class="bg lock"><svg viewBox="-13 -13 26 26" width="34" height="34" aria-hidden="true">' + ART.socket(0, 0, null) + '</svg><small>？</small></span>';
      var p = polishOf(g.id);
      return '<button class="bg p' + p + '" data-g="' + g.id + '" style="--c:' + g.color + '">' + ART.gem(g.color, 34, { dull: p === 0, sparkle: p >= 2 }) + '<b>' + esc(g.label) + '</b><small>' + POLISH[p].n + ' ' + POLISH[p].s + '</small></button>';
    }).join('') + '</div><p class="made">⚔ 使える形 <b>' + n + '</b>・章 <b>' + S.ch + '</b> / ' + CH.length + '</p></div>';
    var reviewFirst = n && (due.length >= 8 || !nx);
    var bCh = nx ? '▶ 第' + (S.ch + 1) + '章：宝箱をあける<small>あたらしいジェム ' + esc(GB[nx.gem].label) + '・ボスつき</small>' : '';
    var bRev = n ? '▶ 見回り<small>' + (due.length ? 'もどってきた敵 ' + Math.min(due.length, 8) + ' 体' : 'きょうの分は済み（練習はできる）') + '</small>' : '';
    if (weak.length) h += '<button class="rem" id="hRem">🩹 おさらい：' + esc(weak[0].k === 'asis' ? 'そのまま' : GB[weak[0].k].label) + '<small>まちがえた ' + weak[0].ids.length + ' 体にリベンジ</small></button>';
    if (reviewFirst) { h += '<button class="cta" id="hRev">' + bRev + '</button>'; if (nx) h += '<button class="sub" id="hCh">' + bCh + '</button>'; }
    else { if (nx) h += '<button class="cta" id="hCh">' + bCh + '</button>'; if (n) h += '<button class="sub" id="hRev">' + bRev + '</button>'; }
    var line = !n ? 'わたしはルス、ジェムの目ききだよ。敵は空所のある文。武器に語尾のジェムをはめて、空所に合う形にして斬るんだ。1章は5分ほど'
      : weak.length ? 'はじかれた敵が待ってるよ。おさらいでリベンジしよう'
      : due.length ? 'もどってきた敵が ' + Math.min(due.length, 8) + ' 体いるよ。見回りに行こう'
      : nx ? 'つぎの宝箱が待ってるよ'
      : 'ジェムは8つぜんぶそろったね。見回りで、日をあけて戦い直してジェムを育てよう';
    h = h.replace('<div class="win belt">', '<p class="talk">' + talkHTML(line) + '</p><div class="win belt">');
    h += '<div class="settings">' +
      '<label><input type="checkbox" id="tgSound"' + (S.settings.sound ? ' checked' : '') + '> 🔈 効果音</label>' +
      '<label><input type="checkbox" id="tgSpeak"' + (S.settings.speak ? ' checked' : '') + '> 🗣 単語を読み上げる</label>' +
      '<button class="link" id="hReset">記録をリセット</button></div>';
    $('home').innerHTML = h;
    show('home');
    if ($('hCh')) $('hCh').onclick = function () { sfx('tap'); startChapter(S.ch); };
    if ($('hRev')) $('hRev').onclick = function () { sfx('tap'); startPatrol(); };
    if ($('hRem')) $('hRem').onclick = function () { sfx('tap'); startRemedy(weak[0].k); };
    $('tgSound').onchange = function () { S.settings.sound = this.checked; save(); };
    $('tgSpeak').onchange = function () { S.settings.speak = this.checked; save(); };
    $('hReset').onclick = function () { if (confirm('記録をぜんぶ消して、最初からにしますか？')) { S = fresh(); save(); home(); } };
    each($('home'), '.bg[data-g]', function (b) { b.onclick = function () { sfx('tap'); book(b.getAttribute('data-g')); }; });
  }

  /* ジェムの力。同じ武器にはまる持っているジェムを、同じ元の語でならべて見せる（そのまま／＋ジェム → 弱点）。
   * 見る順：武器 → 語の変わり方 → 弱点 → ひとこと注意。抽象のきまりより、1語の変わり方で見せる */
  function sameFit(g) { return GEMS.filter(function (x) { return x.fit === g.fit && (x.id === g.id || owned(x.id)); }); }
  function pickBase(g, prefer) {
    var rows = sameFit(g), sc = {}, best = null, bs = -1;
    FORMS.forEach(function (f) { if (f.gem === g.id && !f.x && !f.sfs[1]) sc[f.base] = (prefer || []).indexOf(f.id) >= 0 ? 0.5 : 0; });
    Object.keys(sc).forEach(function (b) {
      var v = sc[b] + rows.filter(function (x) { return formOf(b, x.id); }).length;
      if (v > bs) { bs = v; best = b; }
    });
    return best;
  }
  function powerHTML(g, prefer) {
    var fit = POS[g.fit], b = pickBase(g, prefer), rows = sameFit(g);
    function row(gem, f, a, isNew) {
      return '<div class="trow' + (isNew ? ' new' : '') + '"><span class="tk">' + (gem ? gemHTML(gem) : 'そのまま') + '</span>' +
        '<span class="tw">' + (f ? (f.base !== b ? '<small class="from">' + esc(f.base) + ' →</small>' : '') + wHTML(f) + '<small>' + esc(f.ja) + '</small>' : '') + '</span>' +
        '<span class="ta">' + ATT[a].icon + ' ' + esc(ATT[a].name) + '<small>' + esc(ATT[a].sub) + '</small></span></div>';
    }
    var h = '<div class="power"><p class="ptitle">' + fit.icon + ' <b>' + fit.wp + '（' + fit.name + '）</b>に はめると</p>' +
      row(null, formOf(b, '') || { w: b, ja: WP[b].ja }, fit.asis, false);
    rows.forEach(function (x) {
      var f = formOf(b, x.id);
      if (!f) { var alt = FORMS.filter(function (y) { return y.gem === x.id && !y.x && !y.sfs[1]; }); f = alt.filter(function (y) { return known(y.id); })[0] || alt[0]; }
      h += row(x, f, x.att, x.id === g.id && rows.length > 1);
    });
    return h + '<p class="pnote">💡 ' + g.note + (g.en && g.en.charAt(0) === '-' ? '<small class="en">英語の ' + esc(g.en) + ' に近い</small>' : '') + '</p></div>';
  }
  /* 弱点の見分け方。きまりの文ではなく、その章の敵の文を1つ見せて、手がかりを指す */
  function spotHTML(atts, ids) {
    return '<div class="spot"><p class="slab">🔎 弱点の見分け方<small>空所に入る語の種類</small></p>' + atts.map(function (a) {
      var e = null;
      (ids || []).some(function (id) { var f = FB[id]; if (f && !f.x && attOf(f) === a && FOE[id]) { e = FOE[id][FOE[id].length - 1]; return true; } return false; });
      return '<div class="sp"><p class="sph">' + ATT[a].icon + ' <b>' + esc(ATT[a].name) + '</b><small>' + esc(ATT[a].sub) + '</small></p>' +
        (e ? '<p class="spe">' + sentHTML(e.s) + '</p><p class="spc">↑ ' + esc(e.clue) + '</p>' : '<p class="spc">' + ATT[a].spot + '</p>') + '</div>';
    }).join('') + '</div>';
  }
  function book(gid) {
    var g = GB[gid], p = polishOf(gid);
    var h = '<h2>' + gemHTML(g) + ' <small class="pl">' + POLISH[p].n + ' ' + POLISH[p].s + '</small></h2>' + powerHTML(g) + '<ul class="blist">';
    FORMS.filter(function (f) { return f.gem === gid; }).forEach(function (f) {
      if (!known(f.id) && !S.looted[f.id]) { if (!f.x) h += '<li class="yet">？？？</li>'; return; }
      h += liHTML(f);
    });
    $('mbody').innerHTML = h + '</ul>';
    $('modal').hidden = false;
    each($('mbody'), 'li[data-say]', function (li) { li.onclick = function () { Speech.say(li.getAttribute('data-say')); }; });
  }
  function liHTML(f, cls) {
    var a = artOf(f.g);
    return '<li data-say="' + esc(plain(f.w)) + '"' + (cls ? ' class="' + cls + '"' : '') + '><span class="bb">' + esc(f.root || f.base) + '<small>' + esc(f.rja || WP[f.base].ja) + '</small></span><span class="br">' +
      (a && f.gem ? '<span class="art">' + a + '</span> ' : '') + wHTML(f) + '<small>' + esc(f.ja) + '</small>' + (f.memo ? '<em>' + esc(f.memo) + '</em>' : '') + '</span></li>';
  }

  /* =========================================================
   * 1回の流れ
   * ========================================================= */
  var cur = null, timer = 0;
  function newCur(kind, o) {
    cur = { kind: kind, q: [], i: 0, combo: 0, maxCombo: 0, xp0: S.xp, lv0: lvOf(S.xp), miss: {}, hint: {}, seen: {}, kills: 0, pol0: {} };
    GEMS.forEach(function (g) { cur.pol0[g.id] = owned(g.id) ? polishOf(g.id) : -1; });
    for (var k in o) cur[k] = o[k];
    $('pXp').textContent = S.xp;
    FX.combo(0);
    $('play').classList.remove('fever');
    show('play');
  }
  function Q(id, o) { var q = { id: id, f: FB[id], e: pick(FOE[id]) }; for (var k in o) q[k] = o[k]; return q; }
  function oldIds(n, not) {
    var all = knownAll().filter(function (id) { return not.indexOf(id) < 0; });
    var due = shuffle(all.filter(function (id) { return S.items[id].due <= day(0); })).sort(byDue);
    var rest = shuffle(all.filter(function (id) { return due.indexOf(id) < 0; }));
    return due.concat(rest).slice(0, n);
  }
  function startChapter(i) {
    var c = CH[i];
    newCur('chapter', { ci: i, c: c });
    var a = shuffle(c.intro).map(function (id) { return Q(id, { show: true }); }).concat(shuffle(c.asis).slice(0, 2).map(function (id) { return Q(id, { show: true }); }));
    a = shuffle(a);
    var boss = c.fight.slice(), old = oldIds(2, c.intro.concat(c.fight, c.asis));
    if (old.length < 2) boss = boss.concat(shuffle(c.asis.filter(function (id) { return !a.some(function (q) { return q.id === id; }); })).slice(0, 2 - old.length));
    cur.wave = a; cur.bossQ = shuffle(boss.concat(old)).map(function (id) { return Q(id, { boss: true }); });
    chest();
  }
  function startPatrol() {
    var ids = oldIds(8, []);
    if (!ids.length) { home(); return; }
    newCur('patrol', {});
    cur.wave = shuffle(ids).map(function (id) { return Q(id, {}); });
    cur.bossQ = [];
    battles();
  }
  function startRemedy(k) {
    var ids = Object.keys(S.weak[k] || {});
    if (!ids.length) { home(); return; }
    newCur('remedy', { rk: k });
    cur.wave = shuffle(ids).map(function (id) { return Q(id, {}); });
    cur.bossQ = [];
    remedyIntro(k);
  }

  /* 導き役のルス（フクロウ。ジェムの目きき）。案内の文は、すべてルスのせりふとして出す。ルス自身は動かさない（目線は問題に） */
  function talkHTML(html) { return '<span class="mentor" aria-hidden="true">🦉</span><span class="bubble">' + html + '</span>'; }
  function lead(html, chg) {
    var el = $('lead'); el.innerHTML = talkHTML(html);
    var b = el.querySelector('.bubble');
    if (chg && b.animate) b.animate([{ opacity: 0.25 }, { opacity: 1 }], { duration: 240, easing: 'ease-out' });
  }
  function clearBoard() { clearTimeout(timer); $('tray').classList.remove('done'); $('fb').innerHTML = ''; $('tray').innerHTML = ''; $('pop').hidden = true; }
  function setProg(r) { $('pProg').style.width = Math.round(Math.max(0, Math.min(1, r)) * 100) + '%'; }
  function addXp(n, el) {
    if (cur.fever) n *= 2;
    S.xp += n; $('pXp').textContent = S.xp; FX.pop($('pXp').parentNode, 1.2);
    if (el) { var p = FX.at(el); FX.floatText(p.x, p.y - 30, '+' + n + ' XP', cur.fever ? '#ffd84d' : '#5fdc94'); }
  }
  function nextBtn(label, fn) {
    var b = document.createElement('button');
    b.className = 'nextb'; b.innerHTML = label || 'つぎへ ▶';
    b.onclick = function () { sfx('tap'); clearTimeout(timer); fn(); };
    $('tray').appendChild(b);
    $('fb').scrollTop = 0;
    return b;
  }
  function optsHTML(list) { return '<div class="opts">' + list.map(function (t) { return '<button class="opt" data-v="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>'; }
  function mark(sel, isRight, chosen) {
    each($('tray'), sel, function (o) {
      o.disabled = true;
      if (isRight(o)) o.classList.add('ok'); else if (o === chosen) o.classList.add('ng'); else o.classList.add('dim');
    });
  }
  /* 武器のカード。f＝いまの形（ジェムなしなら元の語）。gem＝はめたジェム（ないなら空のソケット） */
  function weaponHTML(base, shown, gem) {
    var w = WP[base], p = POS[w.pos];
    return '<div class="win weapon" id="wpn"><div class="wart" id="wart">' + ART.weapon(w.pos, gem ? gem.color : null, 'sock') + '</div>' +
      '<div class="wbody"><b class="wname" id="wname">' + shown + '</b><small>' + p.wp + '（' + p.name + '）・' + esc(w.ja) + '</small></div></div>';
  }
  function formOf(base, gid) { return FORMS.filter(function (f) { return f.base === base && f.gem === gid && !f.sfs[1]; })[0]; }
  /* ジェムが棚から武器のソケットへ飛ぶ */
  function fly(from, to, done) {
    sfxGem();
    if (FX.RM || !from.animate) { done(); return; }
    from = from.querySelector('.gsvg') || from;
    var a = from.getBoundingClientRect(), b = to.getBoundingClientRect(), c = from.cloneNode(true);
    c.style.cssText += ';position:fixed;left:' + a.left + 'px;top:' + a.top + 'px;width:' + a.width + 'px;height:' + a.height + 'px;margin:0;z-index:60;pointer-events:none';
    document.body.appendChild(c);
    var an = c.animate([{ transform: 'translate(0,0) scale(1)' }, { transform: 'translate(' + (b.left + b.width / 2 - a.left - a.width / 2) + 'px,' + (b.top + b.height / 2 - a.top - a.height / 2) + 'px) scale(.7)' }], { duration: 170, easing: 'cubic-bezier(.3,.7,.3,1)' });
    an.onfinish = function () { c.remove(); done(); };
  }

  /* ---------- 宝箱 → 知っている武器にはめてみる → ジェムの力 ---------- */
  function chest() {
    var g = GB[cur.c.gem], taps = 0;
    clearBoard(); setProg(0);
    lead((cur.ci === 0 && !S.runs ? 'わたしはルス。ジェムの目ききだよ。<br>' : '') + '宝箱を見つけたね。3回たたいて、あけてごらん<small>第' + (cur.ci + 1) + '章</small>');
    $('bench').innerHTML = '<button class="chest" id="chest" aria-label="宝箱をあける">🎁</button>';
    $('chest').onclick = function () {
      taps++;
      sfx('chestShake'); FX.shake($('chest'));
      if (taps < 3) return;
      $('chest').onclick = null;
      S.gems[g.id] = 1; save();
      sfx('chestOpen', 'epic'); FX.confetti(40);
      joinIn(g, function () { cur.k = 0; tryOn(); });
    };
  }
  /* ジェム参戦のカットイン（帯が走る → シルエット → 光って色がつく → 「参戦！」）。名前だけ見せ、力（きまり）はまだ見せない */
  function joinIn(g, done) {
    var d = document.createElement('div');
    d.id = 'joinin'; d.style.setProperty('--c', g.color);
    d.innerHTML = '<div class="jn-lines"></div><div class="jn-band"></div><div class="jn-sub">第' + (cur.ci + 1) + '章<small>あたらしいジェム</small></div>' +
      '<div class="jn-gem">' + bigGem(g) + '</div><div class="jn-tag"><b>参戦！</b></div><div class="jn-flash"></div><div class="jn-tap">タップでつづける</div>';
    document.body.appendChild(d);
    var ready = false, ts = [];
    function at(ms, fn) { ts.push(setTimeout(fn, ms)); }
    at(20, function () { d.classList.add('on'); });
    at(120, function () { d.classList.add('s1'); sfx('whoosh'); });
    at(520, function () { d.classList.add('s2'); raw(function (R, t) { R.tone(70, t, 0.5, 'sine', 0.35, 40); R.noise(t, 0.3, 0.15, 400, 120); }); });
    at(1100, function () {
      d.classList.add('s3'); d.classList.add('shake');
      raw(function (R, t) { R.noise(t, 0.2, 0.2, 9000, 2000); [0, 7, 12, 16, 19].forEach(function (s, k) { R.tone(R.hz(s), t + k * 0.03, 0.7, 'triangle', 0.08); }); R.tone(R.hz(24), t + 0.15, 0.9, 'sine', 0.06); });
      buzz([20, 40, 20]);
      var p = FX.at(d.querySelector('.biggem')); FX.burst(p.x, p.y, { n: 30, ring: true }); FX.rays(p.x, p.y, g.color);
    });
    at(1500, function () {
      d.classList.add('s4');
      raw(function (R, t) { R.tone(110, t, 0.25, 'square', 0.12, 60); R.noise(t, 0.12, 0.25, 1500, 300); });
      Speech.say(g.label.slice(1));
      ready = true;
    });
    d.onclick = function () {
      if (!ready) return;
      ts.forEach(clearTimeout);
      d.classList.remove('on');
      setTimeout(function () { d.remove(); done(); }, 200);
    };
  }
  function tryOn() {
    var c = cur.c, g = GB[c.gem], f = FB[c.intro[cur.k]], w = WP[f.base];
    clearBoard(); setProg(cur.k / 6);
    lead('このジェムを、知っている' + POS[w.pos].wp + 'にはめてごらん<small>' + (cur.k + 1) + ' / 3</small>');
    $('bench').innerHTML = weaponHTML(f.base, esc(f.base), null) + '<div class="res" id="res"></div>';
    $('tray').innerHTML = shelf('ジェム', gemBtn(g, 'glow sel', 'g1'));
    $('g1').onclick = function () {
      $('g1').onclick = null; $('g1').classList.remove('glow');
      fly($('g1'), $('sock'), function () {
        $('bench').innerHTML = weaponHTML(f.base, wHTML(f), g) + '<div class="res" id="res"></div>';
        FX.pop($('wpn')); var p = FX.at($('wpn')); FX.burst(p.x, p.y, { n: 14 });
        Speech.say(plain(f.w));
        $('tray').innerHTML = '';
        lead('<b class="es">' + esc(plain(f.w)) + '</b> は、どういう意味になったと思う？<small>予想でいいよ。採点はしない</small>', true);
        var opts = [f.ja, w.ja];
        FORMS.forEach(function (x) { if (x.base === f.base && x.gem && x.gem !== f.gem && owned(x.gem) && opts.indexOf(x.ja) < 0 && !x.x) opts.push(x.ja); });
        $('tray').innerHTML = optsHTML(shuffle(opts));
        each($('tray'), '.opt', function (o) {
          o.onclick = function () {
            var ok = o.getAttribute('data-v') === f.ja;
            mark('.opt', function (x) { return x.getAttribute('data-v') === f.ja; }, o);
            if (ok) { sfx('correct', 1); addXp(XP.guess, $('wpn')); } else sfx('tap');
            $('fb').innerHTML = (ok ? '' : '<p class="you">あなたの予想：' + esc(o.getAttribute('data-v')) + '</p>') +
              '<p class="why">' + esc(f.base) + '（' + esc(w.ja) + '）＋ ' + gemHTML(g) + ' → <b>' + esc(plain(f.w)) + '</b>（' + esc(f.ja) + '）</p>' + (f.memo ? '<p class="memo">💡 ' + esc(f.memo) + '</p>' : '');
            $('tray').innerHTML = '';
            lead(ok ? 'そのとおり！ いい読みだね' : 'おしい。こうなるんだ');
            nextBtn('', function () { cur.k++; if (cur.k < 3) tryOn(); else power(); });
          };
        });
      });
    };
  }
  function newAtts(ci) {
    var seen = {};
    for (var j = 0; j < ci; j++) { var gj = GB[CH[j].gem]; seen[gj.att] = 1; seen[POS[gj.fit].asis] = 1; }
    var g = GB[CH[ci].gem];
    return [POS[g.fit].asis, g.att].filter(function (a) { return !seen[a]; });
  }
  function power() {
    var g = GB[cur.c.gem], atts = newAtts(cur.ci);
    clearBoard(); setProg(0.5);
    var wp = POS[g.fit].wp, c = cur.c;
    lead('これが ' + gemHTML(g) + ' の力。' + (sameFit(g).length > 1 ? '同じ' + wp + 'でも、はめるジェムで弱点が変わる' : wp + 'にはめると、斬れる弱点が変わる'));
    $('bench').innerHTML = powerHTML(g, c.intro) + spotHTML(atts.length ? atts : [g.att], c.intro.concat(c.asis, c.fight));
    nextBtn('⚔ 戦いへ', function () { battles(); });
  }

  /* ---------- おさらい：ジェムの力を見てからリベンジ ---------- */
  function remedyIntro(k) {
    clearBoard(); setProg(0);
    if (k === 'asis') {
      lead('🩹 そのまま使うときの弱点を、もう一度見ておこう');
      $('bench').innerHTML = '<div class="power">' + ['adj', 'verb', 'noun'].map(function (p) { return '<p class="pw2"><span>' + POS[p].icon + ' ' + POS[p].wp + 'のまま</span> ＝ ' + attHTML(POS[p].asis) + '</p>'; }).join('') + '</div>' +
        spotHTML(['desc', 'act', 'thing'], Object.keys(S.weak.asis || {}).concat(FORMS.filter(function (f) { return !f.gem; }).map(function (f) { return f.id; })));
    } else {
      var g = GB[k], ex = FORMS.filter(function (f) { return f.gem === k && known(f.id) && !S.weak[k][f.id]; }).slice(0, 2).map(function (f) { return f.id; });
      lead('🩹 ' + gemHTML(g) + ' の力を、もう一度見ておこう');
      $('bench').innerHTML = powerHTML(g, ex) + spotHTML([g.att], Object.keys(S.weak[k]).concat(ex));
    }
    nextBtn('⚔ リベンジ ' + cur.wave.length + ' 体', battles);
  }

  /* =========================================================
   * 戦い
   * ========================================================= */
  function battles() {
    cur.phase = 'wave'; cur.q = cur.wave; cur.i = 0; cur.total = cur.q.length + cur.bossQ.length;
    ask();
  }
  function startBoss() {
    cur.phase = 'boss'; cur.q = cur.bossQ; cur.i = 0;
    cur.hp = cur.q.length; cur.hp0 = cur.q.length;
    cur.bossEmo = BOSS_EMO[cur.ci % BOSS_EMO.length];
    clearBoard();
    lead('ボスだ！ ここからは<b>弱点が隠れる</b>。文を読んで見ぬくんだ');
    $('bench').innerHTML = '<div class="bossin"><span class="femo boss pop">' + cur.bossEmo + '</span><p>HP ' + cur.hp + '</p>' + (cur.ci > 0 ? '<p class="chint">前の章のジェムの敵も、まざっている</p>' : '') + '<p class="chint">わからなければ 💡 で弱点を見られる（自力には数えない）</p></div>';
    sfx('combo', 3); FX.flash('rgba(255,80,80,.25)'); FX.shake($('bench'), true);
    nextBtn('⚔ 戦う', ask);
  }
  function ask() {
    if (cur.i >= cur.q.length) {
      if (cur.phase === 'wave' && cur.bossQ.length) { startBoss(); return; }
      afterBattles(); return;
    }
    var q = cur.q[cur.i], f = q.f, e = q.e, w = WP[f.base], boss = cur.phase === 'boss', reveal = q.show || q.hinted;
    q.sel = null; q.done = false;
    cur.seen[q.id] = 1;
    clearBoard();
    setProg(cur.kind === 'chapter' ? 0.5 + 0.5 * (cur.kills / cur.total) : cur.kills / cur.total);
    if (!q.emo) q.emo = boss ? cur.bossEmo : pick(FOE_EMO);
    var cnt = q.again ? '<small>さっきの敵に、もう一度</small>' : '';   /* 何体目かは上の進み具合のバーで見せる */
    var firstCh = cur.kind === 'chapter' && !boss && cur.i === 0 && !q.again;
    lead((boss ? '👑 文の意味から、弱点を見ぬいて'
      : firstCh ? '敵は空所のある文。空所に入るのはどんな語？ それに合う形にして斬るんだ'
      : !reveal ? '弱点は隠れてる。文を読んで、合う形にして斬ろう'
      : '空所に合う形にして、斬ろう') + cnt);
    var hp = boss ? '<span class="hp">' + Array.apply(null, Array(cur.hp0)).map(function (_, k) { return '<i' + (k < cur.hp ? ' class="on"' : '') + '></i>'; }).join('') + '</span>' : '';
    $('bench').innerHTML = '<div class="foe' + (boss ? ' isboss' : '') + '" id="foe"><span class="femo" id="femo">' + q.emo + '</span>' + hp +
      '<span class="weak" id="weak">' + weakHTML(q, reveal) + '</span></div>' +
      '<p class="sent" id="sent">' + sentHTML(e.s) + '</p><p class="sja" id="sja">' + jaHTML(e) + '</p>' +
      weaponHTML(f.base, esc(f.base), null) + '<p class="wmsg" id="wmsg"></p>';
    if ($('hint')) $('hint').onclick = function () {
      q.hinted = true; sfx('tap');
      $('weak').innerHTML = weakHTML(q, true);
      $('weak').classList.add('chg');
    };
    var gems = GEMS.filter(function (g) { return owned(g.id); });
    $('tray').innerHTML = shelf('ジェムをセット', gemBtn(null) + gems.map(function (g) { return gemBtn(g); }).join('')) +
      '<button class="cut" id="cut" disabled>⚔ 斬る</button>';
    each($('tray'), '.gem', function (b) { b.onclick = function () { chooseGem(q, b); }; });
    $('cut').onclick = function () { strike(q); };
  }
  function weakHTML(q, reveal) {
    var a = attOf(q.f);
    if (reveal) return '弱点 <b>' + ATT[a].icon + ' ' + esc(ATT[a].name) + '</b>';
    return '弱点 <b>？</b><button class="hintb" id="hint" aria-label="ヒント：弱点を見る">💡</button>';
  }
  function chooseGem(q, b) {
    if (q.done) return;
    var gid = b.getAttribute('data-g'), f = q.f, w = WP[f.base];
    $('wmsg').innerHTML = '';
    if (gid) {
      var g = GB[gid];
      if (g.fit !== w.pos) {
        q.slip = true;
        FX.shake(b); sfxClink();
        $('wmsg').innerHTML = gemHTML(g) + ' は ' + wpHTML(g.fit) + 'にはまる。この武器は ' + wpHTML(w.pos);
        return;
      }
    }
    q.sel = gid;
    each($('tray'), '.gem', function (x) { x.classList.toggle('sel', x === b); });
    $('cut').disabled = false;
    var g2 = gid ? GB[gid] : null;
    function draw() {
      var made = gid ? formOf(f.base, gid) : null;
      var shown = !gid ? esc(f.base) : made ? wHTML(made) : esc(f.base) + '<b class="tl" style="--c:' + g2.color + '">' + esc(g2.label.slice(1)) + '</b>？';
      $('wpn').outerHTML = weaponHTML(f.base, shown, g2);
      if (gid && !made) $('wmsg').innerHTML = 'この' + POS[w.pos].wp + 'に ' + gemHTML(g2) + ' の語はない';
      if (made) Speech.say(plain(made.w));
    }
    if (gid) fly(b, $('sock'), draw); else { sfx('tap'); draw(); }
  }
  /* 斬る：選んだ形と、弱点の形をくらべる */
  function strike(q) {
    if (q.done || q.sel == null) return;
    q.done = true;
    var f = q.f, e = q.e, w = WP[f.base], ok = q.sel === f.gem, boss = cur.phase === 'boss';
    each($('tray'), 'button', function (b) { b.disabled = true; });
    $('tray').classList.add('done');   /* 斬ったら棚はたたむ（文と理由に場所をゆずる） */
    $('weak').innerHTML = weakHTML(q, true);
    var a = attOf(f), gA = f.gem ? GB[f.gem] : null;
    var right = '<p class="why">🔎 ' + esc(e.clue) + ' → 弱点 <b>' + attShort(a) + '</b></p>' +
      '<p class="why">' + POS[w.pos].icon + ' ' + esc(f.base) + (gA ? ' ＋ ' + gemHTML(gA) + ' → <b>' + esc(plain(f.w)) + '</b>' : '（そのまま）') + '（' + esc(f.ja) + '）</p>' +
      (f.memo ? '<p class="memo">💡 ' + esc(f.memo) + '</p>' : '');
    $('sent').innerHTML = sentHTML(e.s, plain(f.w));
    $('sja').innerHTML = jaHTML(e, f);
    lunge(ok);
    if (ok) {
      var clean = !q.hinted && !q.slip;
      if (clean) { cur.combo++; cur.maxCombo = Math.max(cur.maxCombo, cur.combo); if (cur.combo > S.best) S.best = cur.combo; }
      else cur.hint[q.id] = 1;
      var fever = cur.combo >= 5;
      if (fever && !cur.fever) { sfx('combo', cur.combo); $('play').classList.add('fever'); }
      cur.fever = fever;
      FX.combo(cur.combo, fever);
      sfxSlash(cur.combo);
      Speech.say(plain(f.w));
      cur.kills++;
      var crit = clean && cur.combo >= 3;
      setTimeout(function () {
        var p = FX.at($('femo'));
        FX.burst(p.x, p.y, { n: crit ? 30 : 18, ring: true });
        FX.floatText(p.x + 30, p.y - 20, crit ? 'CRITICAL!' : 'HIT!', crit ? '#ffd84d' : '#fff');
        if (crit) FX.flash('rgba(255,216,77,.25)');
        if (boss) {
          cur.hp--;
          var pips = $('foe').querySelectorAll('.hp i'); if (pips[cur.hp]) pips[cur.hp].classList.remove('on');
          FX.shake($('femo'), true);
          if (cur.hp <= 0) { $('femo').classList.add('down'); FX.confetti(120); FX.slam('BOSS DOWN', 'gold', '第' + (cur.ci + 1) + '章クリア'); sfx('levelUp'); }
        } else $('femo').classList.add('down');
        addXp(clean ? (boss ? XP.boss : XP.hit) : Math.ceil(XP.hit / 2), $('femo'));
      }, 120);
      $('fb').innerHTML = right;
      lead(pick(clean ? ['見事！', 'いい読みだ！', 'そのとおり！'] : ['通ったね。']) + ' 理由も見ておこう');
      if (boss && cur.hp <= 1) { lead('ボスをたおした！ とどめの理由も見ておこう'); bossDown(); return; }
      timer = setTimeout(next, 2600);
      nextBtn('', next);
    } else {
      cur.combo = 0; cur.fever = false; FX.combo(0); $('play').classList.remove('fever');
      cur.miss[q.id] = 1;
      sfxClink();
      setTimeout(function () { var p = FX.at($('femo')); FX.floatText(p.x + 30, p.y - 20, 'はじかれた', '#ff7a6b'); FX.shake($('femo')); }, 120);
      var you;
      if (!q.sel) you = esc(f.base) + '（そのまま）＝ ' + attShort(POS[w.pos].asis);
      else {
        var g = GB[q.sel], made = formOf(f.base, q.sel);
        you = gemHTML(g) + ' ＝ ' + attShort(g.att);
        if (made) you = esc(plain(made.w)) + '（' + esc(made.ja) + '）＝ ' + attShort(g.att);
        else if (g.att === a && gA) you = esc(f.base) + ' に ' + gemHTML(g) + ' の語はない。' + esc(gA.who || '');
      }
      cur.q.push({ id: q.id, f: q.f, e: q.e, emo: q.emo, again: true, show: q.show });   /* この回のうちに、もう一度 */
      $('fb').innerHTML = '<p class="you">✕ ' + you + '</p>' + right;
      lead('はじかれた。どこがちがったか見てみよう');
      nextBtn('', next);
    }
  }
  /* 武器が前に出て斬る（当たる）／はじかれて戻る */
  function lunge(ok) {
    var el = $('wart');
    if (!el || FX.RM || !el.animate) return;
    el.animate(ok ? [{ transform: 'none' }, { transform: 'translate(10px,-40px) rotate(-28deg) scale(1.1)' }, { transform: 'translate(4px,-10px) rotate(14deg)' }, { transform: 'none' }] : [{ transform: 'none' }, { transform: 'translate(6px,-28px) rotate(-18deg)' }, { transform: 'translate(-6px,6px) rotate(10deg)' }, { transform: 'none' }], { duration: ok ? 320 : 420, easing: 'ease-out' });
    var foe = $('foe');
    if (ok && foe) { var s = document.createElement('i'); s.className = 'slash'; foe.appendChild(s); setTimeout(function () { s.remove(); }, 420); }
  }
  function next() { clearTimeout(timer); cur.i++; ask(); }
  /* ボスをたおした：理由を読んだら、ボスのいた所に落とし物（なぞの語）が落ちる → 拾って鑑定へ。自動では進めない */
  function bossDown() {
    var drop = cur.kind === 'chapter' ? lootPick() : null;
    nextBtn('つぎへ ▶', function () {
      clearBoard();
      if (!drop) { finish(); return; }
      cur.drop = drop;
      FX.combo(0); $('play').classList.remove('fever');
      lead('おや、ボスが何か落としていったよ');
      $('bench').innerHTML = '<div class="dropin"><span class="scroll" id="scroll">📜</span><p class="chint">まだ習っていない語が書いてある</p></div>';
      sfx('chestShake');
      setTimeout(function () { if ($('scroll')) { var p = FX.at($('scroll')); FX.burst(p.x, p.y, { n: 12 }); } }, 520);
      nextBtn('📜 拾って読む', function () { loot(drop); });
    });
  }

  /* ---------- 戦利品の鑑定：知らない語からジェムを外して読む ---------- */
  function lootPick() {
    var cand = FORMS.filter(function (f) { return f.x && !S.looted[f.id] && f.sfs.every(owned); });
    if (!cand.length) return null;
    var mine = cur.c ? cand.filter(function (f) { return f.sfs.indexOf(cur.c.gem) >= 0; }) : [];
    return pick(mine.length ? mine : cand);
  }
  function afterBattles() {
    if (cur.kind === 'remedy') { finish(); return; }
    var f = lootPick();
    if (!f) { finish(); return; }
    loot(f);
  }
  function loot(f) {
    var todo = f.sfs.slice().reverse(), n = 0;
    cur.phase = 'loot';
    clearBoard(); setProg(1);
    lead(cur.drop ? '習っていない語でも、おしりのジェムを外すと、知っている語が出てくるよ' : '落とし物だ！ 知らない語でも、おしりのジェムを外せば読めるよ');
    function draw() { $('bench').innerHTML = '<div class="res tall" id="res"><span class="plaque">' + wHTML(f, n === 0 ? null : f.sfs.length - n) + '</span></div><div id="bits" class="bits"></div>'; }
    function drawPeeled() {
      var p = f.w.split('|'), keep = p.slice(0, p.length - n), h = esc(keep[0]);
      keep.slice(1).forEach(function (seg, i) { h += '<b class="tl" style="--c:' + GB[f.sfs[i]].color + '">' + esc(seg) + '</b>'; });
      $('bench').innerHTML = '<div class="res tall" id="res"><span class="plaque"><span class="wd">' + h + '</span></span></div><div id="bits" class="bits"></div>';
    }
    draw();
    Speech.say(plain(f.w));
    var gems = GEMS.filter(function (g) { return owned(g.id); });
    var one = gems.length === 1;
    $('tray').innerHTML = shelf(one ? 'ジェムをタップして、語から外そう' : '語のおしりに、どのジェムがはまっている？', gems.map(function (g) { return gemBtn(g, one ? 'glow' : ''); }).join(''));
    each($('tray'), '.gem', function (b) {
      b.onclick = function () {
        var gid = b.getAttribute('data-g');
        if (gid !== todo[n]) { FX.shake(b); sfx('tap'); lead('語の<b>いちばん後ろ</b>を見てごらん', true); return; }
        n++; sfxPeel(); b.classList.add('ok'); b.disabled = true;
        drawPeeled(); FX.pop($('res'));
        if (n < todo.length) { lead('もう1つ、はまってる。その前のジェムは？', true); return; }
        var root = f.root || f.base, rja = f.rja || WP[f.base].ja;
        $('res').innerHTML = '<span class="plaque">' + esc(root) + '<small>' + esc(rja) + '</small></span>';
        $('bits').innerHTML = f.sfs.map(function (id) { return '<span class="bit">＋ ' + gemHTML(GB[id]) + '<small>' + attShort(GB[id].att) + '（' + esc(ATT[GB[id].att].sub) + '）</small></span>'; }).join('');
        lead('知っている語が出てきた。ジェムの意味とあわせると、<b class="es">' + esc(plain(f.w)) + '</b> は？', true);
        var opts = [f.ja];
        function add(t) { if (t && opts.length < 4 && opts.indexOf(t) < 0) opts.push(t); }
        add(rja);
        shuffle(FORMS.filter(function (x) { return x.id !== f.id && (x.base === f.base || x.base === root || x.root === root); })).forEach(function (x) { add(x.ja); });
        shuffle(FORMS.filter(function (x) { return x.id !== f.id && x.gem === f.sfs[f.sfs.length - 1] && !x.x; })).forEach(function (x) { add(x.ja); });
        shuffle(FORMS.filter(function (x) { return x.id !== f.id && x.gem && !x.x; })).forEach(function (x) { add(x.ja); });
        opts = shuffle(opts);
        $('tray').innerHTML = optsHTML(opts);
        each($('tray'), '.opt', function (o) {
          o.onclick = function () {
            var ok = o.getAttribute('data-v') === f.ja;
            mark('.opt', function (x) { return x.getAttribute('data-v') === f.ja; }, o);
            S.looted[f.id] = 1;
            $('res').innerHTML = '<span class="plaque">' + wHTML(f) + '<small>' + esc(f.ja) + '</small></span>';
            Speech.say(plain(f.w));
            if (ok) { FX.slam('¡LEÍDO!', 'gold', '知らない語を、ジェムから読めた'); FX.confetti(70); sfx('crit'); addXp(XP.loot, $('res')); $('fb').innerHTML = (f.memo ? '<p class="memo">💡 ' + esc(f.memo) + '</p>' : ''); }
            else { sfx('tap'); $('fb').innerHTML = '<p class="you">あなたの予想：' + esc(o.getAttribute('data-v')) + '</p><p class="right">こたえ：<b>' + esc(f.ja) + '</b></p>' + (f.memo ? '<p class="memo">💡 ' + esc(f.memo) + '</p>' : ''); }
            lead(ok ? '見事！ 習っていない語を読めたね' : 'おしい。ジェムの意味から、もう一度たしかめよう');
            cur.loot = f;
            $('tray').innerHTML = '';
            nextBtn('', finish);
          };
        });
      };
    });
  }

  /* =========================================================
   * おわり：戻す日を決める・おさらいの記録・ジェムの進化
   * ========================================================= */
  function finish() {
    clearTimeout(timer);
    var ids = Object.keys(cur.seen), missN = Object.keys(cur.miss).length;
    ids.forEach(function (id) {
      var st = S.items[id], miss = !!cur.miss[id], f = FB[id], wk = f.gem || 'asis';
      if (!st) S.items[id] = { box: 0, due: day(1) };
      else if (miss) { st.box = 0; st.due = day(1); }
      else if (cur.hint[id]) { st.due = day(1); }
      else {
        st.box = Math.min(st.box + 1, DAYS.length - 1); st.due = day(DAYS[st.box]);
        if (S.weak[wk]) delete S.weak[wk][id];          /* あとの回で自力で正解できたら、おさらいの記録から消す */
      }
      if (miss) (S.weak[wk] = S.weak[wk] || {})[id] = 1;
    });
    var cleared = cur.kind === 'chapter';
    if (cleared) { S.ch = Math.max(S.ch, cur.ci + 1); S.lessons[cur.c.gem] = { done: true }; }
    S.runs++; save();

    var gained = S.xp - cur.xp0, lv = lvOf(S.xp), up = lv > cur.lv0, lo = lv > 1 ? need(lv - 1) : 0;
    var tomorrow = knownAll().filter(function (id) { return S.items[id].due === day(1); }).length;
    var evo = GEMS.filter(function (g) { return owned(g.id) && cur.pol0[g.id] >= 0 && polishOf(g.id) > cur.pol0[g.id]; });
    var h = '<div class="dn"><div class="dtitle">' + (cleared ? '¡Victoria!' : cur.kind === 'remedy' ? '¡Revancha!' : '¡Muy bien!') + '</div>' +
      '<p class="dsum">' + cur.kills + ' 体たおした' + (missN ? '・はじかれた ' + missN : '・ノーミス') + (cur.maxCombo >= 3 ? '・最大 ' + cur.maxCombo + ' コンボ' : '') + '</p>' +
      '<div class="dxp"><b>+' + gained + ' XP</b><div class="lv"><b>Lv ' + lv + '</b><span>' + title(lv) + '</span><span class="lvbar"><i id="dBar" style="width:0"></i></span></div></div>';
    if (cleared) h += '<p class="dlab">💎 手に入れたジェム</p><div class="dgem">' + bigGem(GB[cur.c.gem]) + '</div>';
    evo.forEach(function (g) { var p = polishOf(g.id); h += '<p class="evo" style="--c:' + g.color + '">✨ ' + esc(g.label) + ' が <b>' + POLISH[p].n + ' ' + POLISH[p].s + '</b> に進化</p>'; });
    var list = ids.map(function (id) { return FB[id]; }).filter(function (f) { return f.gem; }).concat(cur.loot ? [cur.loot] : []);
    if (list.length) h += '<p class="dlab">⚔ この回の形</p><ul class="blist">' + list.map(function (f) { return liHTML(f, cur.miss[f.id] ? 'missed' : ''); }).join('') + '</ul>';
    if (missN) h += '<p class="dnote">はじかれた敵は、🩹 おさらいと あしたの見回りに出る。</p>';
    if (tomorrow) h += '<p class="dnote">📬 あしたもどってくる敵：' + tomorrow + ' 体</p>';
    var nx = S.ch < CH.length;
    h += '<button class="cta" id="dHome">ホームへ</button>' + (cleared && nx ? '<button class="sub" id="dMore">▶ 第' + (S.ch + 1) + '章へ</button>' : '') + '</div>';
    $('done').innerHTML = h;
    FX.combo(0); $('play').classList.remove('fever');
    show('done');
    setTimeout(function () { if ($('dBar')) $('dBar').style.width = Math.round((S.xp - lo) / (need(lv) - lo) * 100) + '%'; }, 60);
    if (up) { sfx('levelUp'); FX.confetti(120); FX.slam('LEVEL UP', 'gold', 'Lv ' + lv + '　' + title(lv)); }
    else if (evo.length) { sfx('chestOpen', 'rare'); FX.confetti(80); }
    else { sfx('chestOpen', missN ? 'common' : 'rare'); if (!missN) FX.confetti(50); }
    $('dHome').onclick = function () { sfx('tap'); home(); };
    if ($('dMore')) $('dMore').onclick = function () { sfx('tap'); startChapter(S.ch); };
    each($('done'), 'li[data-say]', function (li) { li.onclick = function () { Speech.say(li.getAttribute('data-say')); }; });
  }

  /* ---------- 共通の操作 ---------- */
  $('pQuit').onclick = function () { if (!cur || confirm('この回をやめますか？（この回の記録は残りません）')) home(); };
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
    window.__pega = { S: function () { return S; }, save: save, home: home, cur: function () { return cur; },
      reset: function () { S = fresh(); save(); home(); },
      chapter: function (i) { startChapter(i); }, loot: function (id) { newCur('patrol', {}); loot(FB[id]); },
      clearTo: function (n) { for (var i = 0; i < n; i++) { var c = CH[i]; S.gems[c.gem] = 1; S.lessons[c.gem] = { done: true }; c.intro.concat(c.fight, c.asis).forEach(function (id) { S.items[id] = S.items[id] || { box: 1, due: day(0) }; }); } S.ch = Math.max(S.ch, n); save(); home(); } };
  }
  home();
})();
