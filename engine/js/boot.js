/* =========================================================
 * boot.js — コースの入口HTMLから呼ばれる起動処理
 *
 *  入口HTML（例：fe.html）の書き方：
 *    <head> … <script src="courses/fe/course.js"></script><script src="engine/js/boot.js"></script></head>
 *    <body><script>LEBoot.body()</script></body>
 *
 *  ローカルファイル（file://）でも動くよう、fetch は使わず document.write で
 *  スタイル・画面の骨組み・スクリプトを順番どおりに読み込む。
 *  URL に ?e2e を付けると自動テスト（tests/e2e.js）も読み込む。
 * ========================================================= */
(function () {
  'use strict';
  var C = window.COURSE;
  if (!C) { document.write('<p style="color:#fff">COURSE が定義されていません（course.js の読み込みを確認）</p>'); return; }
  var V = '?v=' + encodeURIComponent(C.version || '1');

  var E2E = /[?&]e2e\b/.test(location.search);
  window.LE_E2E = E2E;
  /* 自動テストは毎回まっさらな状態から（テスト用の保存先「.e2e」だけを消す） */
  if (E2E) { try { Object.keys(localStorage).forEach(function (k) { if (/\.e2e$/.test(k)) localStorage.removeItem(k); }); } catch (e) { /* 保存領域が使えない環境 */ } }

  var FONTS = 'https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Orbitron:wght@500;700;900&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=JetBrains+Mono:wght@400;600&display=swap';
  var ENGINE_CSS = ['style', 'learn', 'lesson', 'cards', 'ext'];
  var LIBS = [
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/CopyShader.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/LuminosityHighPassShader.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/RenderPass.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/ShaderPass.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js'
  ];
  var ENGINE_JS = ['core', 'audio', 'fx3d', 'fx2d', 'lesson', 'ui'];
  var courseDir = 'courses/' + C.id + '/';

  function css(href) { document.write('<link rel="stylesheet" href="' + href + '">'); }
  function js(src) { document.write('<script src="' + src + '"><\/script>'); }

  /* ---- <head> の中で実行される部分 ---- */
  if (C.title) document.title = C.title;
  document.write('<meta name="theme-color" content="#05060f">');
  document.write('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
  css(FONTS);
  if (C.fonts) css(C.fonts);                         // コース専用の書体（Google Fonts の URL）
  ENGINE_CSS.forEach(function (n) { css('engine/css/' + n + '.css' + V); });
  (C.css || []).forEach(function (f) { css(courseDir + f + V); });
  js('engine/js/terms.js' + V);
  js('engine/js/template.js' + V);

  /* ---- <body> の中で呼ばれる部分 ---- */
  function fill(tpl) {
    var f = C.focus || {}, m = C.mock || {}, r = C.roadmap || {}, p = C.predict || {}, b = C.brand || [C.appName || 'LEARN', ''];
    var map = {
      brand0: b[0], brand1: b[1] || '',
      predictTitle: p.title || '予測スコア', predictNote: p.note || '記憶の保持率と網羅率から推定した目安です。',
      focusIcon: f.icon || '🔥', focusLabel: f.label || '', focusDesc: f.desc || '',
      mockLabel: m.label || 'ミニ模試', mockDesc: m.desc || '',
      rmEyebrow: r.eyebrow || 'ROADMAP', rmTitle: r.title || 'ロードマップ', rmDesc: r.desc || '',
      examDateLabel: C.examDateLabel || '目標日'
    };
    tpl = tpl.replace(/\{\{t:(\w+)\}\}/g, function (all, k) { return window.LE_T(k); });
    return tpl.replace(/\{\{(\w+)\}\}/g, function (all, k) { return k in map ? map[k] : all; });
  }
  window.LEBoot = {
    body: function () {
      document.write(fill(window.LE_TEMPLATE || ''));
      LIBS.forEach(js);
      js('engine/js/api.js' + V);
      (C.files || []).forEach(function (f) { js(courseDir + f + V); });
      ENGINE_JS.forEach(function (n) { js('engine/js/' + n + '.js' + V); });
      if (E2E) js('tests/e2e.js' + V);
    }
  };
})();
