/* =========================================================
 * コース設定：基本情報技術者試験・書籍の目次順（かやのき先生の教室に沿った復習版）
 *  中身（説明・問題・カード）は基本情報コース courses/fe を借りて、
 *  『令和08年 イメージ＆クレバー方式でよくわかる かやのき先生の基本情報技術者教室』の
 *  章・節の順に組み直したもの（data/kit.js）。本の文章は使っていない（目次の並びだけを参考）
 *  エンジンはこの COURSE を読んで、名前・試験形式・特別ルールなどを切り替える。
 *  ここに無い項目はエンジンの既定値が使われる。
 * ========================================================= */
window.COURSE = {
  id: 'fe-kaya',
  version: '2',                       // ファイル更新時に上げる（ブラウザのキャッシュ対策）
  title: 'BIT RUSH 教科書順｜基本情報技術者試験（かやのき先生の教室に沿った復習）',
  appName: 'BIT RUSH',
  brand: ['BIT', 'RUSH 教科書順'],              // ロゴ（前半＝白、後半＝アクセント色）
  storageKey: 'le.fekaya.v1',          // 学習データの保存名（元の基本情報コースとは別）
  openAll: true,                       // 本の進み具合に合わせて、どの節からでも復習できる
  terms: { unit: 'CHAPTER', lesson: 'SECTION' },  // 本の「章」「節」
  typewriter: true,                    // 吹き出しの文字を一文字ずつ。キーワードは跳ねてマーカー
  autoGloss: true,                     // 用語集の言葉に、自動でヘルプ（？）をつける

  /* コースのデータファイル（読み込み順） */
  files: [
    '../fe/data/syllabus.js', '../fe/data/curriculum.js',
    '../fe/data/q_tech1.js', '../fe/data/q_tech2.js', '../fe/data/q_ms.js', '../fe/data/q_b.js',
    '../fe/data/les_u01.js', '../fe/data/les_u02.js', '../fe/data/les_u03.js', '../fe/data/les_u04.js', '../fe/data/les_u05.js', '../fe/data/les_u06.js',
    '../fe/data/les_u07.js', '../fe/data/les_u08_09.js', '../fe/data/les_u10.js', '../fe/data/les_u11.js',
    '../fe/data/q_extra.js', '../fe/data/cards.js',
    'data/kit.js',                     // ここで基本情報コースのユニット・レッスンを片付けて、章・節に組み直す
    'data/ch01.js', 'data/ch02.js', 'data/ch03.js', 'data/ch04.js', 'data/ch05.js', 'data/ch06.js',
    'data/ch07.js', 'data/ch08.js', 'data/ch09.js', 'data/ch10.js', 'data/ch11.js', 'data/ch12.js',
    'data/finish.js'
  ],
  css: ['../fe/theme.css'],                  // コース専用の見た目（任意）

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
    eyebrow: 'TEXTBOOK ORDER',
    title: '教科書の目次順',
    desc: '本の<b>章・節と同じ順番</b>。読み終えた節を開いて、レッスンで<b>思い出し</b>、解放された問題で<b>定着</b>させよう。どの節からでも始められる。'
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

  welcome: '本で読んだ節を、ここで復習しよう。節番号は本の目次と同じ。',

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
