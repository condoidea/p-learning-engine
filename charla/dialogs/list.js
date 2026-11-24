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
    id: 'marta-javi', title: 'シーズン2　マルタとハビ', sub: '西検4級 オリジナル会話（サラマンカの古いカフェ）', guide: 'guide.md',
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
    /* レッスン：課ごとの短い会話。dialog.json の題は「L11-01 Título」→ no は「11-1」（課-何番目）。
     *  解説は課ごとに1ファイル（guide-11.md。「## 会話1」「## 会話2」）→ 話ごとに guide と gno（その中の会話の番号） */
    id: 'lecciones', title: 'レッスン', sub: '課ごとの短い会話',
    names: ['Makoto', 'Elena', 'Yuki', 'Carlos', 'Tomás', 'Lucía', 'Pablo', 'Tokio', 'Kioto', 'Carmen', 'Laura', 'Riku', 'García', 'Tanaka', 'Ana', 'Kenji', 'Sofía', 'Daniel', 'Irene', 'Monterrey', 'Sevilla', 'Barcelona', 'Clara', 'Óscar', 'Pedro', 'Lola', 'Marta', 'Hiro', 'Andrés', 'Dani'],
    dialogs: [
      { id: '20261123-134134-663e', no: '10-1', guide: 'guide-10.md', gno: 1, title: 'El regalo de cumpleaños', titleJa: '誕生日のプレゼント' },
      { id: '20261123-134218-5ae2', no: '10-2', guide: 'guide-10.md', gno: 2, title: 'La temporada de lluvias', titleJa: '梅雨' },
      { id: '20261122-224922-2d98', no: '11-1', guide: 'guide-11.md', gno: 1, title: 'En una tienda de moda', titleJa: '洋服の店で' },
      { id: '20261122-225034-ccf7', no: '11-2', guide: 'guide-11.md', gno: 2, title: 'En una tienda de deportes', titleJa: 'スポーツ用品店で' },
      { id: '20261122-224642-4033', no: '12-1', guide: 'guide-12.md', gno: 1, title: 'Mañana empieza el curso', titleJa: 'あしたから授業' },
      { id: '20261122-224730-6344', no: '12-2', guide: 'guide-12.md', gno: 2, title: 'El tren bala', titleJa: '新幹線' },
      { id: '20261123-172501-dc25', no: '13-1', guide: 'guide-13.md', gno: 1, title: 'El viaje a Monterrey', titleJa: 'モンテレイ出張' },
      { id: '20261123-172550-a644', no: '13-2', guide: 'guide-13.md', gno: 2, title: 'La boda en Sevilla', titleJa: 'セビーリャの結婚式' },
      { id: '20261123-172658-1cf9', no: '14-1', guide: 'guide-14.md', gno: 1, title: 'Las vacaciones en Barcelona', titleJa: 'バルセロナの休暇' },
      { id: '20261123-172804-b915', no: '14-2', guide: 'guide-14.md', gno: 2, title: 'La nevera vacía', titleJa: '空っぽの冷蔵庫' },
      { id: '20261123-203325-f2bd', no: '15-1', guide: 'guide-15.md', gno: 1, title: 'El pueblo de Carmen', titleJa: 'カルメンの村' },
      { id: '20261123-203445-a41c', no: '15-2', guide: 'guide-15.md', gno: 2, title: 'El niño del puente', titleJa: '橋の上の男の子' },
      { id: '20261124-175354-c62f', no: '16-1', guide: 'guide-16.md', gno: 1, title: 'El Guernica', titleJa: 'ゲルニカ' },
      { id: '20261124-175426-edc4', no: '16-2', guide: 'guide-16.md', gno: 2, title: 'La maleta rota', titleJa: '壊れたスーツケース' },
      { id: '20261124-175555-88d5', no: '16-3', guide: 'guide-16.md', gno: 3, title: 'El ladrón del museo', titleJa: '美術館の泥棒' },
      { id: '20261124-175723-5ea0', no: '17-1', guide: 'guide-17.md', gno: 1, title: 'El español del señor Tanaka', titleJa: '田中さんのスペイン語' },
      { id: '20261124-175823-92e3', no: '17-2', guide: 'guide-17.md', gno: 2, title: 'La Alhambra desde fuera', titleJa: '外から見たアルハンブラ' },
      { id: '20261124-175935-bd29', no: '18-1', guide: 'guide-18.md', gno: 1, title: 'Una visita para el señor Tanaka', titleJa: '田中さんへの来客' },
      { id: '20261124-180023-d99c', no: '18-2', guide: 'guide-18.md', gno: 2, title: 'La nueva estrategia', titleJa: '新しい戦略' },
      { id: '20261124-180144-5e81', no: '18-3', guide: 'guide-18.md', gno: 3, title: 'La caja de la azotea', titleJa: '屋上の箱' }
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
