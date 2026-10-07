/* =========================================================
 * 挿絵（写本の余白に描かれたような線画）。ステップに art: '名前' で表示
 *  線はペンで描くように、塗り（g=金 / r=朱 / w=羊皮紙）はあとからにじむように現れる
 * ========================================================= */
(function () {
  function svg(body) { return '<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">' + body + '</svg>'; }
  LE.art = {
    /* 鷹の城（ハプスブルク城） */
    castle: svg(
      '<path d="M8 92 Q40 74 80 74 Q120 74 152 92"/>' +
      '<path class="w" d="M50 74 V54 h4 v-4 h4 v4 h4 v-4 h4 v4 h4 V30 h4 v-5 h4 v5 h4 v-5 h4 v5 h4 V54 h4 v-4 h4 v4 h4 v-4 h2 V74 Z"/>' +
      '<path class="w" d="M104 74 V44 h12 V74"/><path class="r" d="M102 44 L110 28 L118 44 Z"/>' +
      '<path d="M76 74 v-9 a4 4 0 0 1 8 0 v9"/><path d="M80 36 v8 M110 52 v6"/>' +
      '<path d="M80 25 V12"/><path class="r" d="M80 12 l11 3 l-11 3 Z"/>' +
      '<path d="M22 30 q5 -5 10 0 q5 -5 10 0 M40 18 q4 -4 8 0 q4 -4 8 0"/>'),
    /* 帝冠 */
    crown: svg(
      '<path class="g" d="M48 80 H112 V70 H48 Z"/>' +
      '<path class="w" d="M50 70 V44 L58 36 L66 44 V70 M66 44 L80 34 L94 44 V70 M94 44 L102 36 L110 44 V70"/>' +
      '<path d="M58 36 Q80 8 102 36"/><path d="M80 22 V6 M74 11 H86"/>' +
      '<circle class="r" cx="80" cy="56" r="5"/><circle class="g" cx="58" cy="56" r="3.5"/><circle class="g" cx="102" cy="56" r="3.5"/>' +
      '<circle cx="54" cy="75" r="1.5"/><circle cx="64" cy="75" r="1.5"/><circle cx="74" cy="75" r="1.5"/><circle cx="86" cy="75" r="1.5"/><circle cx="96" cy="75" r="1.5"/><circle cx="106" cy="75" r="1.5"/>' +
      '<path d="M34 24 l4 4 M38 24 l-4 4 M122 20 l4 4 M126 20 l-4 4 M30 60 h6 M124 62 h6"/>'),
    /* 帝国の鷲 */
    eagle: svg(
      '<path class="w" d="M78 42 C60 30 40 22 20 30 L30 36 L18 42 L32 46 L22 54 L38 54 L32 62 L50 58 Q64 56 74 54"/>' +
      '<path class="w" d="M84 42 C100 30 120 22 140 30 L130 36 L142 42 L128 46 L138 54 L122 54 L128 62 L110 58 Q96 56 86 54"/>' +
      '<path class="g" d="M73 42 Q80 34 87 42 L89 62 Q80 70 71 62 Z"/>' +
      '<path class="g" d="M76 38 Q74 24 82 22 Q90 22 89 29 L96 31 L89 34 Q86 37 84 40"/><circle cx="84" cy="27" r="1.2"/>' +
      '<path class="r" d="M74 66 L68 84 L76 78 L80 88 L84 78 L92 84 L86 66"/>' +
      '<path d="M74 62 L64 72 h-5 M64 72 v5 M86 62 L96 72 h5 M96 72 v5"/>' +
      '<path class="g" d="M76 20 L77 13 L80 17 L83 12 L85 19"/>'),
    /* 教皇（三重冠と鍵） */
    papal: svg(
      '<path d="M44 86 L106 30"/><circle cx="40" cy="90" r="7"/><path d="M106 30 l6 6 l4 -4 M100 36 l5 5"/>' +
      '<path d="M116 86 L54 30"/><circle cx="120" cy="90" r="7"/><path d="M54 30 l-6 6 l-4 -4 M60 36 l-5 5"/>' +
      '<path class="w" d="M68 40 Q66 12 80 6 Q94 12 92 40 Z"/>' +
      '<path class="g" d="M68 34 H92 M69 25 H91 M72 16 H88"/><path d="M80 6 V0 M77 2 H83"/>' +
      '<path class="r" d="M70 40 l-4 14 l6 -3 M90 40 l4 14 l-6 -3"/>'),
    /* 交差する剣（戦い） */
    swords: svg(
      '<path class="w" d="M118 14 L125 11 L122 18 L52 78 L46 72 Z"/><path d="M38 64 L60 84"/><path d="M47 79 L36 90"/><circle cx="34" cy="92" r="3"/>' +
      '<path class="w" d="M42 14 L35 11 L38 18 L108 78 L114 72 Z"/><path d="M122 64 L100 84"/><path d="M113 79 L124 90"/><circle cx="126" cy="92" r="3"/>' +
      '<path class="r" d="M80 36 l-2 -10 l4 0 Z M90 42 l7 -7 l2 3 Z M70 42 l-7 -7 l-2 3 Z"/>'),
    /* 結婚の指輪 */
    rings: svg(
      '<circle cx="68" cy="58" r="20"/><circle cx="68" cy="58" r="16"/><circle cx="92" cy="58" r="20"/><circle cx="92" cy="58" r="16"/>' +
      '<path class="r" d="M62 40 l6 -9 l6 9 l-6 4 Z"/>' +
      '<path d="M112 24 l5 5 M117 24 l-5 5 M40 28 l4 4 M44 28 l-4 4 M120 80 h8 M124 76 v8 M30 82 h6"/>' +
      '<path class="g" d="M54 92 Q80 84 106 92 Q80 98 54 92 Z"/>'),
    /* 特許状・勅書（巻物と封蝋） */
    charter: svg(
      '<path class="w" d="M44 26 H116 V76 H44 Z"/>' +
      '<path class="g" d="M40 20 H120 a4 4 0 0 1 0 8 H40 a4 4 0 0 1 0 -8 Z"/><path class="g" d="M40 72 H120 a4 4 0 0 1 0 8 H40 a4 4 0 0 1 0 -8 Z"/>' +
      '<path d="M54 36 H106 M54 44 H100 M54 52 H104 M54 60 H86"/><path class="r" d="M54 36 v-2"/>' +
      '<path d="M80 80 L74 88 M80 80 L86 88"/><circle class="r" cx="80" cy="91" r="7"/><path d="M77 91 h6 M80 88 v6"/>'),
    /* 短剣（暗殺） */
    dagger: svg(
      '<path class="w" d="M80 8 L87 60 L73 60 Z"/><path d="M80 14 V56"/>' +
      '<path class="g" d="M62 60 H98 v5 H62 Z"/><path d="M80 65 V84"/><circle class="g" cx="80" cy="88" r="4.5"/>' +
      '<path class="r" d="M96 30 q4 7 0 10 q-4 -3 0 -10 Z M104 46 q3 5 0 7 q-3 -2 0 -7 Z"/>' +
      '<path d="M30 90 Q60 82 80 92 Q100 82 130 90"/>'),
    /* 船 */
    ship: svg(
      '<path class="g" d="M28 64 Q80 84 132 64 L124 56 H36 Z"/><path d="M80 56 V12"/>' +
      '<path class="w" d="M58 18 Q80 24 102 18 V50 Q80 56 58 50 Z"/><path class="r" d="M80 25 V47 M69 36 H91"/>' +
      '<path d="M80 12 l11 3 l-11 3"/><path d="M36 56 L28 46 M124 56 L134 44"/>' +
      '<path d="M10 80 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 M20 90 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0"/>'),
    /* 鷹狩り */
    falcon: svg(
      '<path class="w" d="M26 90 L70 70 L80 77 L38 96 Z"/><path d="M70 70 Q66 64 72 62"/>' +
      '<path class="g" d="M76 70 Q68 56 75 43 Q80 35 88 37 Q95 39 93 45 L100 47 L93 50 Q97 62 88 72 Z"/>' +
      '<path d="M80 46 Q85 58 82 70"/><circle cx="89" cy="41" r="1.2"/><path d="M84 72 L88 88 L80 86"/><path class="r" d="M84 72 Q80 82 72 80"/>' +
      '<path d="M112 22 q5 -5 10 0 q5 -5 10 0"/>'),
    /* 大聖堂 */
    cathedral: svg(
      '<path d="M18 90 H146"/>' +
      '<path class="w" d="M30 90 V58 L48 40 H106 L116 58 V90 Z"/>' +
      '<path class="g" d="M52 46 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6"/>' +
      '<path class="w" d="M118 90 V46 L127 2 L136 46 V90 Z"/><path d="M127 20 V40 M122 32 H132"/>' +
      '<path d="M124 60 v10 a3 3 0 0 0 6 0 v-10 a3 3 0 0 0 -6 0 M44 66 v12 a4 4 0 0 0 8 0 v-12 a4 4 0 0 0 -8 0 M64 66 v12 a4 4 0 0 0 8 0 v-12 a4 4 0 0 0 -8 0 M84 66 v12 a4 4 0 0 0 8 0 v-12 a4 4 0 0 0 -8 0"/>' +
      '<circle class="r" cx="102" cy="72" r="6"/>'),
    /* 本と羽根ペン（大学） */
    book: svg(
      '<path class="w" d="M26 70 Q53 58 80 68 Q107 58 134 70 V86 Q107 74 80 84 Q53 74 26 86 Z"/><path d="M80 68 V84"/>' +
      '<path d="M36 72 Q52 66 70 71 M36 77 Q52 71 70 76 M90 71 Q108 66 124 72 M90 76 Q108 71 124 77"/>' +
      '<path class="w" d="M100 58 Q118 30 142 10 Q134 40 104 58 Z"/><path d="M142 10 L96 64"/>' +
      '<path class="r" d="M40 40 h22 v14 h-22 Z"/><path d="M44 44 h14 M44 49 h10"/>'),
    /* 長槍の歩兵（スイス） */
    pikes: svg(
      '<path d="M20 92 H140"/>' +
      '<path d="M40 92 L66 10 M58 92 L74 8 M102 92 L86 8 M120 92 L94 10"/>' +
      '<path class="w" d="M66 10 l-1 -7 l4 5 Z M74 8 l1 -7 l2 6 Z M86 8 l-2 -7 l-1 6 Z M94 10 l3 -6 l0 6 Z"/>' +
      '<path d="M80 92 V16"/><path class="w" d="M80 24 Q98 24 100 38 Q90 34 80 38 Z"/><path d="M80 28 L68 24 L80 33"/><path d="M80 16 l-2 -8 l2 -4 l2 4 Z"/>' +
      '<path class="r" d="M70 58 H90 V72 Q80 80 70 72 Z"/><path d="M80 60 V74 M74 66 H86"/>'),
    /* 大砲 */
    cannon: svg(
      '<path class="g" d="M38 62 L116 48 L119 60 L42 74 Z"/><path d="M116 46 L120 62"/>' +
      '<circle class="w" cx="62" cy="78" r="13"/><circle cx="62" cy="78" r="3"/><path d="M62 65 V91 M49 78 H75 M53 69 L71 87 M71 69 L53 87"/>' +
      '<path d="M26 88 L78 70"/>' +
      '<circle class="w" cx="132" cy="50" r="6"/><circle class="w" cx="143" cy="42" r="8"/><circle class="w" cx="150" cy="56" r="5"/>' +
      '<path class="r" d="M122 54 l8 -2 l-8 4 Z"/>'),
    /* ゆりかごと冠（たくさんの称号を受け継ぐ赤ちゃん） */
    cradle: svg(
      '<path class="w" d="M42 60 Q80 98 118 60 Z"/><path d="M34 86 Q80 102 126 86"/><path d="M50 84 L54 76 M110 84 L106 76"/>' +
      '<circle class="w" cx="66" cy="58" r="7"/><path d="M58 64 Q80 70 104 62"/>' +
      '<path class="g" d="M66 36 L66 22 L73 29 L80 18 L87 29 L94 22 L94 36 Z"/>' +
      '<path d="M80 12 V6 M64 16 l-5 -5 M96 16 l5 -5 M56 28 h-7 M104 28 h7"/>' +
      '<path class="r" d="M30 22 h10 v8 q-5 5 -10 0 Z M120 22 h10 v8 q-5 5 -10 0 Z M22 46 h10 v8 q-5 5 -10 0 Z M128 46 h10 v8 q-5 5 -10 0 Z"/>'),
    /* 金羊毛 */
    fleece: svg(
      '<path class="r" d="M66 6 L80 24 L94 6 L88 6 L80 16 L72 6 Z"/><circle cx="80" cy="28" r="4"/><path d="M80 32 V38"/>' +
      '<path class="g" d="M56 42 Q80 34 104 42 Q110 52 102 60 Q80 66 58 60 Q50 52 56 42 Z"/>' +
      '<path class="g" d="M56 46 q-9 0 -11 9 q5 6 11 2"/><circle cx="49" cy="52" r="1"/>' +
      '<path d="M64 60 l-2 14 M73 62 l0 14 M87 62 l0 14 M96 60 l2 14"/>' +
      '<path d="M64 46 q3 3 6 0 q3 3 6 0 q3 3 6 0 q3 3 6 0 q3 3 6 0 M62 53 q3 3 6 0 q3 3 6 0 q3 3 6 0 q3 3 6 0 q3 3 6 0 q3 3 6 0"/>'),
    /* ドームと三日月（オスマン帝国） */
    crescent: svg(
      '<path d="M18 92 H142 M18 92 V80 h6 v4 h6 v-4 h6 v4 h6 v-4 M142 92 V80 h-6 v4 h-6 v-4 h-6 v4 h-6 v-4"/>' +
      '<path class="w" d="M50 86 V62 Q80 22 110 62 V86 Z"/><path d="M80 34 V26"/>' +
      '<path class="g" d="M84 12 a8 8 0 1 0 0 14 a6 6 0 1 1 0 -14 Z"/>' +
      '<path class="w" d="M34 86 V32 L37 22 L40 32 V86 M120 86 V32 L123 22 L126 32 V86"/>' +
      '<path d="M70 86 v-12 a10 10 0 0 1 20 0 v12"/>'),
    /* てんびん（法と秩序） */
    scales: svg(
      '<path d="M80 90 V20"/><circle class="g" cx="80" cy="17" r="3.5"/><path d="M42 30 H118"/>' +
      '<path d="M42 30 L32 56 M42 30 L52 56 M118 30 L108 56 M118 30 L128 56"/>' +
      '<path class="g" d="M28 56 Q42 68 56 56 Z"/><path class="g" d="M104 56 Q118 68 132 56 Z"/>' +
      '<path class="w" d="M62 90 H98 L92 82 H68 Z"/>'),
    /* 砂時計（待つ者が勝つ） */
    hourglass: svg(
      '<path class="g" d="M54 12 H106 V18 H54 Z M54 82 H106 V88 H54 Z"/><path d="M58 18 V82 M102 18 V82"/>' +
      '<path class="w" d="M64 18 C64 40 77 44 77 50 C77 56 64 60 64 82 H96 C96 60 83 56 83 50 C83 44 96 40 96 18 Z"/>' +
      '<path class="g" d="M70 32 Q80 42 90 32 Z"/><path class="g" d="M68 82 Q80 66 92 82 Z"/><path d="M80 50 V74"/>' +
      '<path d="M30 30 q-6 20 0 40 M130 30 q6 20 0 40"/>'),
    /* 蜘蛛の巣（ルイ11世） */
    web: svg(
      '<path d="M80 50 L80 4 M80 50 L120 14 M80 50 L148 50 M80 50 L122 88 M80 50 L80 98 M80 50 L38 88 M80 50 L12 50 M80 50 L40 12"/>' +
      '<path d="M80 38 L89 41 L92 50 L89 59 L80 62 L71 59 L68 50 L71 41 Z M80 24 L98 32 L106 50 L98 68 L80 76 L62 68 L54 50 L62 32 Z M80 10 L108 22 L120 50 L108 78 L80 90 L52 78 L40 50 L52 22 Z"/>' +
      '<path d="M120 14 V30"/><circle class="r" cx="120" cy="36" r="5"/><circle class="r" cx="120" cy="44" r="3.5"/>' +
      '<path d="M116 34 l-7 -4 M116 38 l-8 1 M124 34 l7 -4 M124 38 l8 1 M117 46 l-5 5 M123 46 l5 5"/>'),
    /* 赤白赤の盾（オーストリア・大公） */
    shield: svg(
      '<path class="r" d="M52 22 H108 V54 Q108 80 80 92 Q52 80 52 54 Z"/><path class="w" d="M52 42 H108 V60 H52 Z"/>' +
      '<path class="g" d="M62 18 Q80 2 98 18 Z"/><path d="M80 6 V0 M77 2 H83"/><path class="g" d="M58 18 H102 V22 H58 Z"/>' +
      '<path d="M30 40 q-10 20 6 40 M130 40 q10 20 -6 40"/>'),
    /* 持参金（袋と金貨） */
    money: svg(
      '<path class="g" d="M60 40 Q48 52 50 70 Q54 90 80 90 Q106 90 110 70 Q112 52 100 40 Z"/><path d="M62 40 H98"/>' +
      '<path d="M66 40 L60 26 L72 32 L80 22 L88 32 L100 26 L94 40"/>' +
      '<path class="r" d="M72 58 h16 M80 52 v20"/>' +
      '<circle class="g" cx="124" cy="84" r="8"/><circle class="g" cx="134" cy="76" r="8"/><circle class="g" cx="28" cy="84" r="7"/>' +
      '<path d="M124 80 v8 M134 72 v8"/>'),
    /* 画架（ルネサンス） */
    easel: svg(
      '<path d="M60 94 L74 18 M100 94 L86 18 M80 18 V96 M62 82 H98"/>' +
      '<path class="w" d="M54 28 H106 V66 H54 Z"/><path d="M62 60 Q70 40 80 46 Q90 36 98 60"/><circle class="g" cx="92" cy="38" r="4"/>' +
      '<path class="g" d="M118 74 q14 -12 22 0 q-6 10 -22 0 Z"/><circle class="r" cx="126" cy="72" r="2"/><path d="M128 64 L146 40"/>'),
    /* 髑髏と砂時計（黒死病・死の舞踏） */
    skull: svg(
      '<path class="w" d="M58 52 Q56 20 80 18 Q104 20 102 52 Q102 62 94 66 V76 H66 V66 Q58 62 58 52 Z"/>' +
      '<path class="r" d="M66 42 q6 -6 12 0 q-6 8 -12 0 Z M82 42 q6 -6 12 0 q-6 8 -12 0 Z"/><path d="M80 50 l-3 8 h6 Z"/>' +
      '<path d="M70 76 v-8 M76 76 v-8 M82 76 v-8 M88 76 v-8"/>' +
      '<path d="M30 86 L130 86 M36 92 L124 92"/><path d="M40 30 q-12 10 -6 26 M120 30 q12 10 6 26"/>'),
    /* 印刷機 */
    press: svg(
      '<path d="M40 92 V18 M120 92 V18 M34 18 H126 M34 92 H126"/>' +
      '<path class="g" d="M74 18 V36 M86 18 V36"/><path d="M80 24 V44"/><path d="M60 30 H100"/>' +
      '<path class="w" d="M56 44 H104 V54 H56 Z"/>' +
      '<path class="w" d="M48 66 H112 V74 H48 Z"/><path d="M56 62 H104"/>' +
      '<path class="r" d="M60 58 h6 v4 h-6 Z M70 58 h6 v4 h-6 Z M80 58 h6 v4 h-6 Z M90 58 h6 v4 h-6 Z"/>' +
      '<path d="M134 40 l10 -6 M134 50 h12 M134 60 l10 6"/>'),
    /* 地球儀と冠（受け継ぐ広大な領土） */
    globe: svg(
      '<circle class="w" cx="80" cy="56" r="30"/><ellipse cx="80" cy="56" rx="13" ry="30"/><path d="M50 56 H110 M54 40 H106 M54 72 H106 M80 26 V86"/>' +
      '<path class="g" d="M66 22 L66 10 L73 16 L80 6 L87 16 L94 10 L94 22 Z"/>' +
      '<path d="M64 92 H96 M80 86 V92"/><path d="M40 30 l-6 -4 M120 30 l6 -4 M38 82 l-6 4 M122 82 l6 4"/>')
  };
})();
