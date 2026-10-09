/* =========================================================
 * コース一覧（タイトル画面 index.html が読む）
 *  新しいコースを作ったら、ここに1行足して入口HTML（<id>.html）を用意する。
 *  storageKey は courses/<id>/course.js と同じ値にする（進捗表示に使う）。
 * ========================================================= */
window.LE_COURSES = [
  {
    id: 'fe', entry: 'fe.html', storageKey: 'le.fe.v1',
    title: '基本情報技術者試験', brand: 'BIT RUSH', icon: '💾',
    desc: '0と1の話から科目Bのプログラム読解まで。55レッスン＋ユニットボス。',
    color: '#38e8ff', color2: '#7a5cff', lessons: 55
  },
  {
    id: 'fe-kaya', entry: 'fe-kaya.html', storageKey: 'le.fekaya.v1',
    title: '基本情報技術者試験（教科書の目次順）', brand: 'BIT RUSH 教科書順', icon: '📘',
    desc: '『かやのき先生の基本情報技術者教室』の章・節と同じ順番で復習。読み終えた節を開いて思い出す。全12章・91節。',
    color: '#5cff9d', color2: '#38e8ff', lessons: 91
  },
  {
    id: 'habsburg', entry: 'habsburg.html', storageKey: 'le.habsburg.v1',
    title: 'ハプスブルク年代記', brand: 'CHRONICON HABSBURGICUM', icon: '🦅',
    desc: '鷹の城の伯爵家が皇帝の家になるまで。『ハプスブルク家の華麗なる受難』1〜3巻の範囲を時代順に。',
    color: '#d8b45a', color2: '#a3262b', lessons: 34
  },
  {
    id: 'trig', entry: 'trig.html', storageKey: 'le.trig.v2',
    title: '三角比・平面図形の公式', brand: 'TRIG RUSH', icon: '📐',
    desc: '三角比・平面図形の公式を、図を動かして覚える。sin・cos・tan から正弦定理・余弦定理・メネラウスまで。',
    color: '#ff5fa2', color2: '#38d9ff', lessons: 15
  },
  /* 単語アプリ（vocab/）：kind: 'vocab'。words＝デッキの語数（図鑑の進み具合の表示に使う） */
  {
    id: 'spanish', kind: 'vocab', entry: 'vocab.html', storageKey: 'vocab.spanish.v1',
    title: 'スペイン語 単語', brand: '¡VAMOS!', icon: '💃',
    desc: '西検5級→4級の単語と動詞の活用を、予想して出会い、捕まえて図鑑で育てる。1分・5分・10分、気分でも選べる。参考書に合わせた単語のデッキも、アプリの中から読み込める。',
    color: '#ff7a59', color2: '#f2a541', words: 78
  }
];
