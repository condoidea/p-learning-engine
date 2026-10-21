/* =========================================================
 * yuki/core.js — ユーキ・クエストの土台（小物・保存・文字の書式・用語バルーン）
 *
 *  名前空間は window.Y。ほかのファイルはすべて Y に部品を足していく。
 *  保存先：localStorage 'yuki.v1'（?sandbox なら 'yuki.sandbox.v1'。本物の記録に触れずに試せる）
 * ========================================================= */
(function () {
  'use strict';
  var Y = window.Y = window.Y || {};
  var Q = new URLSearchParams(location.search);
  Y.SANDBOX = Q.has('sandbox');
  Y.KEY = Y.SANDBOX ? 'yuki.sandbox.v1' : 'yuki.v1';

  Y.$ = function (s, r) { return (r || document).querySelector(s); };
  Y.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  Y.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  Y.shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  Y.pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  Y.sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  Y.RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* =========================================================
   * 保存
   *  lessons[id] = { done, stars, best }       レッスン・ボスの記録
   *  spells[id]  = { n, stage, last }          呪文（反応）。stage 0〜3 ＝ 詠唱の短さ（3 ＝ 無詠唱）
   *  tips[id]    = 手に入れた時刻               Tips ノート
   *  settings    = { voice, bgm, sfx, vol, rate }
   * ========================================================= */
  function blank() {
    return { v: 1, lessons: {}, spells: {}, tips: {}, exp: 0,
      settings: { voice: true, bgm: true, sfx: true, vol: 0.6, rate: 1 } };
  }
  Y.load = function () {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(Y.KEY) || 'null'); } catch (e) { s = null; }
    var b = blank();
    if (!s || s.v !== 1) return b;
    for (var k in b) if (!(k in s)) s[k] = b[k];
    for (var j in b.settings) if (!(j in s.settings)) s.settings[j] = b.settings[j];
    if (s.mp != null) { s.exp = (s.exp || 0) + s.mp; delete s.mp; }   /* 昔の「魔力 MP」は経験値にうつす */
    return s;
  };
  Y.S = Y.load();
  /* =========================================================
   * 経験値とレベル（Lv n → n+1 に必要な経験値は 60＋30n）。レベルで称号が変わる
   * ========================================================= */
  var TITLES = [[1, '見習い錬成士'], [3, '錬成士'], [5, '上級錬成士'], [7, '炭素の継承者'], [10, '大錬成士']];
  Y.level = function (exp) {
    var lv = 1, rest = exp || 0;
    while (rest >= 60 + lv * 30) { rest -= 60 + lv * 30; lv++; }
    var t = TITLES[0][1]; TITLES.forEach(function (x) { if (lv >= x[0]) t = x[1]; });
    return { lv: lv, cur: rest, need: 60 + lv * 30, title: t };
  };
  /* 経験値を足す。レベルが上がったら、新しいレベルを返す */
  Y.addExp = function (n) {
    var before = Y.level(Y.S.exp).lv;
    Y.S.exp = (Y.S.exp || 0) + n; Y.save();
    var after = Y.level(Y.S.exp);
    return after.lv > before ? after : null;
  };
  Y.levelUp = function (L) {
    if (!L) return;
    Y.se('levelUp');
    if (window.FX) { FX.slam('LEVEL UP!', 'clear', 'Lv ' + L.lv + '　' + L.title); FX.confetti(60, 'gold'); }
  };

  Y.save = function () { try { localStorage.setItem(Y.KEY, JSON.stringify(Y.S)); } catch (e) { /* 保存できない環境 */ } };
  Y.reset = function () { Y.S = blank(); Y.save(); };
  /* 音の出口（engine/js/audio.js）は、BGM か効果音のどちらかがオンなら開く。効果音を鳴らすかどうかは Y.se が決める */
  window.SfxOn = function () { return Y.S.settings.sfx !== false || Y.S.settings.bgm !== false; };
  Y.se = function (name, a) { if (Y.S.settings.sfx !== false && window.Sfx && Sfx[name]) Sfx[name](a); };

  /* =========================================================
   * 文字の書式（台本の約束）
   *   **…**  覚えること（マーカー）
   *   __…__  覚え方のヒント（💡波線）
   *   ((…))  この教材での呼び方（📎グレー）
   *   {f|…}  炎  {w|…} 風  {s|…} 砂  {t|…} 雷  … 属性の色
   *   _{…}   下つき（化学式は ₂ などの文字をそのまま使ってもよい）
   * ========================================================= */
  Y.fmt = function (s) {
    var h = Y.esc(s == null ? '' : s);
    h = h.replace(/\{([fwstlv])\|([^}]*)\}/g, '<span class="c-$1">$2</span>');
    h = h.replace(/\*\*([\s\S]+?)\*\*/g, '<mark class="k">$1</mark>');
    h = h.replace(/__([\s\S]+?)__/g, '<span class="tip">$1</span>');
    h = h.replace(/\(\(([\s\S]+?)\)\)/g, '<span class="nick">$1</span>');
    h = h.replace(/_\{([^}]*)\}/g, '<sub>$1</sub>');
    h = h.replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>');
    h = h.replace(/\n/g, '<br>');
    return h;
  };
  /* 吹き出しの表示時間の目安に使う「文字の数」 */
  Y.plain = function (s) { return String(s).replace(/\*\*|__|\(\(|\)\)|\{[a-z]\||\}|_\{|\^\{|\s/g, ''); };

  /* =========================================================
   * 用語ヘルプ（点線のバルーン）
   *  Y.gloss({ 語: '説明' }) で登録。吹き出しに出たら、レッスンの中で最初の1回だけ点線になる
   * ========================================================= */
  Y.GL = {};
  Y.gloss = function (o) { for (var k in o) Y.GL[k] = o[k]; Y._gre = null; };
  function glossRe() {
    if (Y._gre !== undefined && Y._gre !== null) return Y._gre;
    var keys = Object.keys(Y.GL).sort(function (a, b) { return b.length - a.length; });
    Y._gre = keys.length ? new RegExp(keys.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|'), 'g') : null;
    return Y._gre;
  }
  Y.glossify = function (el, used) {
    var re = glossRe(); if (!re) return;
    used = used || {};
    var here = {};
    Y.$$('mark', el).forEach(function (mk) { here[mk.textContent] = true; });
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function (t) {
      if (t.parentNode.closest && t.parentNode.closest('mark,.gl,button,.no-gl,sup,sub,svg')) return;
      var s = t.nodeValue, out = [], last = 0, m, hit = false;
      re.lastIndex = 0;
      while ((m = re.exec(s))) {
        if (used[m[0]] || here[m[0]]) continue;
        used[m[0]] = true; hit = true;
        out.push(document.createTextNode(s.slice(last, m.index)));
        var sp = document.createElement('span');
        sp.className = 'gl'; sp.setAttribute('role', 'button'); sp.setAttribute('tabindex', '0');
        sp.setAttribute('data-gl', m[0]); sp.textContent = m[0];
        out.push(sp);
        last = m.index + m[0].length;
      }
      if (!hit) return;
      out.push(document.createTextNode(s.slice(last)));
      var f = document.createDocumentFragment(); out.forEach(function (x) { f.appendChild(x); });
      t.parentNode.replaceChild(f, t);
    });
  };
  var pop = null, popFor = null;
  function closePop() { if (pop) { pop.hidden = true; popFor = null; } }
  Y.closePop = closePop;
  document.addEventListener('click', function (e) {
    var g = e.target.closest && e.target.closest('[data-gl]');
    pop = pop || Y.$('#tipPop');
    if (!g) { if (pop && !(e.target.closest && e.target.closest('#tipPop'))) closePop(); return; }
    e.preventDefault(); e.stopPropagation();
    if (popFor === g) { closePop(); return; }
    var w = g.getAttribute('data-gl');
    pop.innerHTML = '<b>' + Y.esc(w) + '</b><span>' + Y.fmt(Y.GL[w] || '') + '</span>';
    pop.hidden = false; popFor = g;
    var r = g.getBoundingClientRect(), pw = Math.min(300, innerWidth - 24);
    pop.style.width = pw + 'px';
    var x = Math.max(12, Math.min(innerWidth - pw - 12, r.left + r.width / 2 - pw / 2));
    var below = r.bottom + 10, ph = pop.offsetHeight;
    var y = (below + ph > innerHeight - 8) ? r.top - ph - 10 : below;
    pop.style.left = x + 'px'; pop.style.top = Math.max(8, y) + 'px';
    pop.style.setProperty('--ax', (r.left + r.width / 2 - x) + 'px');
    pop.classList.toggle('up', y < r.top);
    if (window.Sfx) Sfx.tap();
  }, true);
  addEventListener('scroll', closePop, { passive: true });

  /* =========================================================
   * 下からせり上がるシート（呪文書・Tips・設定）
   * ========================================================= */
  Y.sheet = function (html, cls) {
    var sh = Y.$('#sheet'), body = Y.$('#sheetBody');
    body.innerHTML = html; sh.className = cls || ''; sh.hidden = false;
    body.scrollTop = 0;
    Y.glossify(body, {});
    if (window.Sfx) Sfx.whoosh();
    return body;
  };
  Y.closeSheet = function () { Y.$('#sheet').hidden = true; };
  document.addEventListener('click', function (e) {
    var sh = Y.$('#sheet'); if (!sh || sh.hidden) return;
    if (e.target === sh || (e.target.closest && e.target.closest('.sh-close'))) Y.closeSheet();
  });
})();
