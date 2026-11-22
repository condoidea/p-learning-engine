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
    id: 'lucia-diego', title: 'シーズン1　ルシアとディエゴ', sub: '西検4級 オリジナル会話（マドリード）', guide: 'guide.md',
    names: ['Lucía', 'Diego', 'Tomate', 'Michi', 'Rosa', 'Rosario', 'Felipe', 'Ramón', 'Pepito', 'Madrid', 'Valencia', 'Eiffel', 'Napoleón', 'Retiro'],   /* 人名・地名（意味を出さない） */
    dialogs: [
      { id: '20261118-164801-d974', no: 1, title: 'La paella desaparecida', titleJa: '消えたパエリア' },
      { id: '20261118-165132-88b2', no: 2, title: 'Madame Rosa lo sabe todo', titleJa: 'マダム・ロサはすべてお見通し' },
      { id: '20261118-170108-b559', no: 3, title: 'El piso equivocado', titleJa: '間違えた部屋' },
      { id: '20261118-170514-931d', no: 4, title: 'Pepito lo cuenta todo', titleJa: 'ペピートは何でもしゃべる' },
      { id: '20261119-170223-2b45', no: 5, title: 'La carta del instituto', titleJa: '高校時代の手紙' }
    ]
  },
  {
    /* シーズン2：dialog.json の題は「S2-01 Título」 */
    id: 'marta-javi', title: 'シーズン2　マルタとハビ', sub: '西検4級 オリジナル会話（サラマンカの古いカフェ）',
    names: ['Marta', 'Javi', 'Salamanca', 'Cádiz'],   /* 人名・地名（意味を出さない） */
    dialogs: [
      { id: '20261122-014424-0bcc', no: 1, title: 'La pista del reloj', titleJa: '時計の手がかり' }
    ]
  },
  {
    id: 'la-prorroga', title: 'ラ・プロロガ', sub: '西検4級 サッカー番組のインタビュー', guide: 'guide.md',
    names: ['Nuria', 'Campos', 'Dani', 'Robles', 'Ramiro', 'Salgado', 'Alberto', 'Gil', 'Carmen', 'Río', 'Verde', 'Prórroga'],   /* 人名・番組名・チーム名（意味を出さない。Onda Balón は balón＝ボールがあるので notes の言い回しで） */
    dialogs: [
      { id: '20261119-170640-b51a', no: 1, title: 'El goleador', titleJa: '得点者' },
      { id: '20261120-170411-b106', no: 2, title: 'El entrenador', titleJa: '監督' },
      { id: '20261120-171112-1713', no: 3, title: 'El árbitro', titleJa: '審判' }
    ]
  },
  {
    /* レッスン：課ごとの短い会話。dialog.json の題は「L11-01 Título」→ no は「11-1」（課-何番目） */
    id: 'lecciones', title: 'レッスン', sub: '課ごとの短い会話',
    names: ['Makoto', 'Elena', 'Yuki', 'Carlos', 'Tomás', 'Lucía', 'Pablo', 'Tokio', 'Kioto'],
    dialogs: [
      { id: '20261122-224922-2d98', no: '11-1', title: 'En una tienda de moda', titleJa: '洋服の店で' },
      { id: '20261122-225034-ccf7', no: '11-2', title: 'En una tienda de deportes', titleJa: 'スポーツ用品店で' },
      { id: '20261122-224642-4033', no: '12-1', title: 'Mañana empieza el curso', titleJa: 'あしたから授業' },
      { id: '20261122-224730-6344', no: '12-2', title: 'El tren bala', titleJa: '新幹線' }
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
