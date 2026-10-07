/* =========================================================
 * terms.js — 画面の用語とユニット番号の表記
 *  コース設定 COURSE.terms で用語を、COURSE.unitNumeral で番号表記を差し替える。
 *  （boot.js が最初に読み込む。Node のテストからも読み込む）
 * ========================================================= */
(function () {
  'use strict';
  var C = window.COURSE || {};
  /* ---- 用語：コースごとに画面の言葉を差し替えられる（COURSE.terms） ---- */
  var TERMS = {
    card: '復習カード', cardShort: 'カード', dex: '復習カード図鑑', dexEn: 'REVIEW CARD DEX', cardGet: 'CARD GET!',
    boss: 'ボス', bossEn: 'BOSS', fight: 'FIGHT', unit: 'UNIT', lesson: 'Lesson',
    learn: 'LEARN', review: 'REVIEW', roadmap: 'ロードマップ', passLine: '合格ライン'
  };
  window.LE_T = function (k) { var t = C.terms || {}; return t[k] != null ? t[k] : (TERMS[k] != null ? TERMS[k] : k); };
  /* ユニット番号の表記（COURSE.unitNumeral = 'roman' ならローマ数字） */
  var ROMAN = ['', 'Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ'];
  window.LE_UNO = function (n) { return C.unitNumeral === 'roman' && ROMAN[n] ? ROMAN[n] : String(n); };
})();
