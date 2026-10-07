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
    id: 'habsburg', entry: 'habsburg.html', storageKey: 'le.habsburg.v1',
    title: 'ハプスブルク年代記', brand: 'CHRONICON HABSBURGICUM', icon: '🦅',
    desc: '鷹の城の伯爵家が皇帝の家になるまで。『ハプスブルク家の華麗なる受難』1〜3巻の範囲を時代順に。',
    color: '#d8b45a', color2: '#a3262b', lessons: 34
  },
  {
    id: 'trig', entry: 'trig.html', storageKey: 'le.trig.v1',
    title: '三角比・平面図形の公式', brand: 'TRIG RUSH', icon: '📐',
    desc: 'プリント1枚の公式マインドマップを、図を動かして覚える。sin・cos・tan から正弦定理・余弦定理・メネラウスまで。',
    color: '#ff5fa2', color2: '#38d9ff', lessons: 20
  }
];
