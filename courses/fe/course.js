/* =========================================================
 * コース設定：基本情報技術者試験（BIT RUSH）
 *  エンジンはこの COURSE を読んで、名前・試験形式・特別ルールなどを切り替える。
 *  ここに無い項目はエンジンの既定値が使われる。
 * ========================================================= */
window.COURSE = {
  id: 'fe',
  version: '17',                       // ファイル更新時に上げる（ブラウザのキャッシュ対策）
  title: 'BIT RUSH｜基本情報技術者試験 合格ブースター',
  appName: 'BIT RUSH',
  brand: ['BIT', 'RUSH'],              // ロゴ（前半＝白、後半＝アクセント色）
  storageKey: 'le.fe.v1',              // 学習データの保存名
  typewriter: true,                    // 吹き出しの文字を一文字ずつ。キーワードは跳ねてマーカー
  autoGloss: true,                     // 用語集の言葉に、自動でヘルプ（？）をつける
  legacyKeys: ['bitrush.fe.v1'],       // 旧版（基本情報技術者試験/）のデータがあれば自動で引き継ぐ

  /* コースのデータファイル（読み込み順） */
  files: [
    'data/syllabus.js', 'data/curriculum.js',
    'data/q_tech1.js', 'data/q_tech2.js', 'data/q_ms.js', 'data/q_b.js',
    'data/les_u01.js', 'data/les_u02.js', 'data/les_u03.js', 'data/les_u04.js', 'data/les_u05.js', 'data/les_u06.js',
    'data/les_u07.js', 'data/les_u08_09.js', 'data/les_u10.js', 'data/les_u11.js',
    'data/q_extra.js', 'data/cards.js'
  ],
  css: ['theme.css'],                  // コース専用の見た目（任意）

  /* 試験の形式（予測スコア・節目のお祝い・模試に使う）。pass が null なら合格ラインなし */
  exams: [
    { id: 'A', name: '科目A', max: 1000, pass: 600 },
    { id: 'B', name: '科目B', max: 1000, pass: 600 }
  ],
  predict: {
    title: '合格予測',
    note: '1000点満点換算の目安。合格ラインは各600点。記憶の保持率と網羅率から推定しています。',
    guessRate: 0.25                    // 4択の当てずっぽうで取れる割合（予測の下限）
  },
  examDateLabel: '試験日',

  roadmap: {
    eyebrow: 'ROADMAP TO PASS',
    title: '合格ロードマップ',
    desc: 'ゼロから順番に積み上げるコース。レッスンで<b>理解</b>してから、解放された問題で<b>定着</b>させよう。'
  },

  /* ホームの「特訓モード」：特定の区分だけを集中して解く */
  focus: {
    cat: 'B', icon: '{ }', label: '科目B特訓', desc: '擬似言語トレース＋セキュリティ',
    questLabel: '科目B問題に{n}問正解する',
    achName: 'トレーサー', achDesc: '科目B問題に累計10問正解', achIco: '{}'
  },
  /* ミニ模試 */
  mock: {
    exam: 'A', count: 20, label: 'ミニ模試', desc: '科目A 20問・1000点換算',
    slam: '科目A 20問 ／ 1000点換算', scoreLabel: '科目A 換算スコア'
  },

  /* 分野ごとの特別ルール（時間のかかる問題は制限時間・速答判定・XPを調整） */
  fieldRules: {
    btrace: { limitSec: 180, fast: 40000, ok: 120000, xpBonus: 8 }
  },

  /* レベルごとの称号 */
  titles: [
    [1, '見習いビット'], [3, 'バイト戦士'], [5, 'キロバイト級'], [8, 'パケット職人'], [11, 'メガバイト級'],
    [14, 'アルゴリズム剣士'], [17, 'ギガバイト級'], [20, 'スタック魔導士'], [25, 'テラバイト級'],
    [30, '合格圏の住人'], [36, 'ペタバイト級'], [42, 'IPAの申し子'], [50, '情報処理の覇者']
  ],

  welcome: 'ようこそ BIT RUSH へ。1日3問でストリーク継続。まずは最初のレッスンから。',

  /* 問題文中のコード（擬似言語）の色分け。esc はHTMLエスケープ関数 */
  highlight: function (src, esc) {
    var s = esc(src);
    s = s.replace(/(【[a-z]】)/g, '<span class="hl-blank">$1</span>');
    s = s.replace(/^(\s*)(○)/gm, '$1<span class="hl-fn">$2</span>');
    s = s.replace(/\b(if|elseif|else|endif|while|endwhile|for|endfor|do|return|and|or|not|mod|true|false)\b/g, '<span class="hl-kw">$1</span>');
    s = s.replace(/(整数型の二次元配列|整数型の配列|整数型|論理型|文字列型|実数型|大域)/g, '<span class="hl-ty">$1</span>');
    s = s.replace(/(を|から|まで|ずつ増やす|ずつ減らす|の要素数|の商)/g, '<span class="hl-jp">$1</span>');
    s = s.replace(/(\/\/.*)$/gm, '<span class="hl-cm">$1</span>');
    return s;
  }
};
