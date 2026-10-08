/* =========================================================
 * コース設定：ハプスブルク年代記
 *  範囲：マンガ『ハプスブルク家の華麗なる受難』（原作 あずま零・漫画 稲谷・監修 菊池良生）1〜3巻
 *        ＝ 一族の起こり（11世紀）〜 ルドルフ1世の選出（1273）〜 マクシミリアン1世とイタリア戦争の始まり（1494〜95）
 *  レベル：高校世界史。ただしハプスブルク家に関わる人物・出来事はやや詳しく
 *  ※ 文章・問題はすべてオリジナル。マンガの台詞や絵は使っていない
 * ========================================================= */
window.COURSE = {
  id: 'habsburg',
  version: '3.0',
  title: 'ハプスブルク年代記｜鷹の城から帝冠へ',
  appName: 'ハプスブルク年代記',
  brand: ['HABSBURG', 'CHRONICLE'],
  storageKey: 'le.habsburg.v1',

  files: [
    'data/syllabus.js', 'data/curriculum.js', 'data/map.js', 'data/art.js',
    'data/les_u1.js', 'data/les_u2.js', 'data/les_u3.js', 'data/les_u4.js', 'data/les_u5.js', 'data/les_u6.js', 'data/les_u7.js',
    'data/cards.js'
  ],
  css: ['theme.css'],
  /* 書体：Cinzel（ローマ碑文の大文字）、しっぽり明朝 B1（見出し）、Zen Old Mincho（本文）、UnifrakturMaguntia（ブラックレター） */
  fonts: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Cinzel+Decorative:wght@700;900&family=Shippori+Mincho+B1:wght@600;800&family=Zen+Old+Mincho:wght@400;700&family=UnifrakturMaguntia&display=swap',

  /* 世界観 */
  typewriter: true,                    // 吹き出しの文字を一文字ずつ。キーワードは跳ねてマーカー
  autoGloss: true,                     // 用語集の言葉に、自動でヘルプ（？）をつける
  scene: { preset: 'map' },            // ろうそくの灯りで見る古地図。物語の舞台へ地図が動く
  sound: 'royal',                      // 古楽器風の音色
  mascot: { ico: '🦅', name: '鷹のハビ' },   // ハプスブルク ≒「鷹の城（ハビヒツブルク）」
  unitNumeral: 'roman',                // LIBER Ⅰ, Ⅱ … ／ §Ⅱ-1
  terms: {
    card: '古文書', cardShort: '古文書', dex: '古文書館', dexEn: 'ARCHIVUM', cardGet: '古文書を入手！',
    boss: '宿敵', bossEn: 'RIVAL', fight: 'DUEL', unit: 'LIBER', lesson: '§',
    learn: 'LECTIO', review: 'MEMORIA', roadmap: '年代記', passLine: '目標ライン'
  },

  exams: [{ id: 'H', name: '理解度', max: 100, pass: 70 }],
  predict: { title: '年代記の理解度', note: '100点満点の目安（目標ライン70点）。記憶の保持率と網羅率から推定しています。', guessRate: 0.25 },
  examDateLabel: '目標日',
  roadmap: {
    eyebrow: 'CHRONICON HABSBURGICUM',
    title: 'ハプスブルク年代記',
    desc: 'スイスの片田舎の伯爵家が、皇帝の家になるまで。<b>時代の順に</b>たどろう。章（§）で<b>理解</b>し、解放された問題で<b>定着</b>させる。'
  },
  focus: {
    cat: 'E', icon: '🌍', label: 'ヨーロッパ史つなぎ特訓', desc: 'ハプスブルク家を取り巻く世界史の流れ',
    questLabel: 'ヨーロッパ史の問題に{n}問正解する', achName: '世界史の目', achDesc: 'ヨーロッパ史の問題に累計10問正解', achIco: '🌍'
  },
  mock: { exam: 'H', count: 15, label: '御前試問', desc: '全範囲から15問・100点満点', slam: '全範囲から15問 ／ 100点満点', scoreLabel: '御前試問のスコア' },

  /* 位階（レベルの称号）：従者から皇帝へ。18〜21は「自称大公」ルドルフ4世にちなむ */
  titles: [
    [1, '見習い従者'], [3, '従騎士'], [5, '騎士'], [8, '伯爵'], [11, '方伯'], [14, '公爵'],
    [18, '大公（自称）'], [22, '大公'], [26, '選帝侯'], [30, 'ローマ王'], [36, '神聖ローマ皇帝'],
    [42, '金羊毛騎士団長'], [50, 'A.E.I.O.U.']
  ],
  /* テーマカラー：紋章の色（金・赤・青・緑・紫）から */
  themes: {
    gold:    { name: '帝国の黄金',     a: '#d8b45a', b: '#a3262b', lv: 1 },
    crimson: { name: '深紅のマント',   a: '#e0645f', b: '#d8b45a', lv: 6 },
    lapis:   { name: 'ラピスラズリ',   a: '#7fa6e6', b: '#d8b45a', lv: 12 },
    emerald: { name: 'エメラルドの間', a: '#5fc493', b: '#d8b45a', lv: 20 },
    purple:  { name: '帝王紫',         a: '#c08ae0', b: '#d8b45a', lv: 0, legendary: true },
    sable:   { name: '黒と金（帝国旗）', a: '#f0d27a', b: '#3a3a3a', lv: 0, legendary: true }
  },

  welcome: 'ようこそ、年代記の旅へ。案内役は鷹のハビ。1日3問で連続記録がつながるよ。まずは「§Ⅰ-1」から。'
};
