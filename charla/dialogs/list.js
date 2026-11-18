/* =========================================================
 * charla/dialogs/list.js — CHARLA に入っているシリーズとダイアログ（並べる順）
 *  1シリーズ＝1フォルダ charla/dialogs/<シリーズ>/
 *    guide.md         学習用の解説（あらすじ・聞き取りポイント・本文と訳・★・文法ノート…）。形は docs/apps/charla.md
 *    <ダイアログの id>/ TTS ツールの書き出し（dialog.json・audio.mp3。形は docs/ダイアログ音声の書き出し仕様.md）
 *                      と、こちらで作る notes.json（語の意味）
 *  no＝guide.md の「## 第N話」の N。足したら、ここに1行足す（静的なサイトはフォルダの中身を一覧できないため）。
 * ========================================================= */
window.CHARLA_SERIES = [
  {
    id: 'lucia-diego', title: 'ルシアとディエゴ', sub: '西検4級 リスニング・ダイアログ集', guide: 'guide.md',
    names: ['Lucía', 'Diego', 'Tomate', 'Michi', 'Rosa', 'Rosario', 'Felipe', 'Ramón', 'Pepito', 'Madrid'],   /* 人名・地名（意味を出さない） */
    dialogs: [
      { id: '20261118-164801-d974', no: 1, title: 'La paella desaparecida', titleJa: '消えたパエリア' },
      { id: '20261118-165132-88b2', no: 2, title: 'Madame Rosa lo sabe todo', titleJa: 'マダム・ロサはすべてお見通し' },
      { id: '20261118-170108-b559', no: 3, title: 'El piso equivocado', titleJa: '間違えた部屋' }
    ]
  }
];
/* ダイアログを id で引けるように（シリーズの id と、ファイルの場所をつける） */
window.CHARLA_DIALOGS = [];
window.CHARLA_SERIES.forEach(function (s) {
  s.dialogs.forEach(function (d) {
    d.series = s.id;
    d.base = 'charla/dialogs/' + s.id + '/' + d.id + '/';
    window.CHARLA_DIALOGS.push(d);
  });
});
