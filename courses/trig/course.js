/* =========================================================
 * コース設定：三角比・平面図形 公式マインドマップ
 *  範囲：プリント「三角比・平面図形公式マインドマップ」1枚分（高校数学Ⅰ・A）
 *  ねらい：公式を「図と一緒に」覚える。説明は短く、フック（覚え方）と手を動かす体験を多めに。
 *  色のルール（全レッスン・背景・問題で共通）：sin＝ピンク、cos＝シアン、tan＝イエロー
 * ========================================================= */
window.COURSE = {
  id: 'trig',
  version: '25',
  title: 'サンカク・ラッシュ｜三角比・平面図形の公式',
  appName: 'サンカク・ラッシュ',
  brand: ['TRIG', 'RUSH'],
  storageKey: 'le.trig.v2',   // 2026-10-08 プリントに沿って15レッスンに再構成（旧 v1 の進捗は使わない）

  files: [
    'data/syllabus.js', 'data/curriculum.js', 'data/glossary.js', 'data/figs.js', 'data/widgets.js',
    'data/les_u1.js', 'data/les_u2.js', 'data/les_u3.js', 'data/les_u4.js', 'data/les_u5.js',
    'data/cards.js'
  ],
  css: ['theme.css'],
  fonts: 'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500;700;800&family=Dela+Gothic+One&display=swap',
  /* 数式は KaTeX で描く */
  math: true,
  recapTap: true,                      // まとめはキーワードをぼかして「思い出してからタップ」
  typewriter: true,                    // 吹き出しの文字を一文字ずつ。キーワードは跳ねてマーカー
  autoGloss: true,                     // 用語集の言葉に、自動でヘルプ（？）をつける
  libs: ['https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js'],
  extCss: ['https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css'],
  /* 色分けマクロ：\S \C \T で sin cos tan を色つきで書ける */
  katexMacros: {
    '\\S': '\\textcolor{#ff5fa2}{\\sin}',
    '\\C': '\\textcolor{#38d9ff}{\\cos}',
    '\\T': '\\textcolor{#ffd84d}{\\tan}'
  },

  /* 世界観：夜の方眼ノート × 蛍光ペン。背景で単位円がずっと回っている */
  scene: { preset: 'geo' },
  mascot: { ico: 'θ', name: 'シータ' },
  terms: {
    card: '公式カード', cardShort: '公式カード', dex: '公式ずかん', dexEn: 'FORMULA DEX', cardGet: '公式カードGET！',
    boss: 'ボス', bossEn: 'BOSS', fight: 'FIGHT', unit: 'STAGE', lesson: 'Lesson',
    learn: 'LEARN', review: 'REVIEW', roadmap: '公式マップ', passLine: '目標ライン'
  },

  exams: [{ id: 'T', name: '定着度', max: 100, pass: 80 }],
  predict: { title: '公式の定着度', note: '100点満点の目安（目標80点）。記憶の保持率と網羅率から推定しています。', guessRate: 0.25 },
  examDateLabel: 'テストの日',
  roadmap: {
    eyebrow: 'FORMULA MIND MAP',
    title: '三角比・平面図形 公式マップ',
    desc: 'プリント1枚の公式を、<b>図を動かして</b>覚える。Lesson で<b>形と意味</b>をつかみ、解放された問題で<b>いろんな角度から</b>思い出そう。'
  },
  focus: {
    cat: 'G', icon: '⭕', label: '図形の定理 特訓', desc: '円・比の定理だけを集中して',
    questLabel: '図形の定理の問題に{n}問正解する', achName: '図形マスター', achDesc: '図形の定理の問題に累計10問正解', achIco: '⭕'
  },
  mock: { exam: 'T', count: 15, label: 'ミニテスト', desc: '全範囲から15問・100点満点', slam: '全範囲から15問 ／ 100点満点', scoreLabel: 'ミニテストのスコア' },
  fieldRules: {},

  titles: [
    [1, '定規デビュー'], [3, '分度器使い'], [5, 'sin見習い'], [8, 'cosの友'], [11, 'tanの達人'],
    [14, '単位円ランナー'], [18, '円周角ハンター'], [22, '方べきマスター'], [26, '正弦の使い手'],
    [30, '余弦の賢者'], [36, 'チェバ＆メネラウス'], [42, '図形の女王'], [50, 'θの化身']
  ],
  themes: {
    neon:   { name: '蛍光ペン',     a: '#ff5fa2', b: '#38d9ff', lv: 1 },
    lemon:  { name: 'レモンtan',    a: '#ffd84d', b: '#ff5fa2', lv: 6 },
    mint:   { name: 'ミントノート', a: '#5cffb0', b: '#38d9ff', lv: 12 },
    violet: { name: 'すみれ定規',   a: '#b48cff', b: '#ff5fa2', lv: 20 },
    rainbow:{ name: '虹色の単位円', a: '#ff8a5c', b: '#7a5cff', lv: 0, legendary: true },
    gold:   { name: '金のθ',        a: '#ffd84d', b: '#ff8a5c', lv: 0, legendary: true }
  },

  welcome: 'ようこそ！ 案内役はシータ。プリント1枚の公式を、図を動かしながら覚えていこう。1日3問で連続記録がつながるよ。'
};
