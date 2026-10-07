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
  }
];
