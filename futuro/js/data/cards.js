/* =========================================================
 * ¿QUÉ SERÁ? — カード（L1〜L12 ＋ ボスの UR）
 *
 *  星めぐり（ガチャ）で出る、占い館の道具・お客・景色。手に入れると、占い館に絵文字で現れる。
 *  カードには、その子の形を使った短い例文が付く（聞き取り・並べ替えの練習に使う）。
 *
 *  { id, L, r, icon, name, es, ja, tag }
 *    r     レアリティ N / R / SR / SSR / UR（各レッスン N×2・R×1・SR×1・SSR×1）
 *    es    そのレッスンまでに習った形の文。習っている形は {…}、時の手がかりは […]
 *    tag   そのカードが使っている形（未来・芯・過去未来・やんわり・推量・現在完了・過去完了・未来完了・進行形・総まとめ）
 *  UR は、ボスを倒した証（boss: 'B1' など。L は持たない。id は 'u-B1' 'u-B2' 'u-B3'）。
 *  B1＝L3・L4 のあと、B2＝L5〜L7 のあと、B3＝ラスボス（L12 のあと）。
 * ========================================================= */
window.FQ = window.FQ || {};

FQ.cards = (FQ.cards || []).concat([
  /* ---- L1 未来 ---- */
  { id: 'c1-1', L: 1, r: 'N', icon: '🌧', name: 'あまぐも', es: '[Mañana] {lloverá}.', ja: 'あした、雨がふるでしょう。', tag: '未来' },
  { id: 'c1-2', L: 1, r: 'N', icon: '🌷', name: 'チューリップ', es: '[Mañana] {abriré} la tienda.', ja: 'あした、私は店を開けるでしょう。', tag: '未来' },
  { id: 'c1-3', L: 1, r: 'R', icon: '🍞', name: 'やきたてパン', es: '[Mañana] {comeremos} pan.', ja: 'あした、私たちはパンを食べるでしょう。', tag: '未来' },
  { id: 'c1-4', L: 1, r: 'SR', icon: '🕯️', name: 'ろうそく', es: '[Mañana] {hablarás} con Rosa.', ja: 'あした、君はロサと話すでしょう。', tag: '未来' },
  { id: 'c1-5', L: 1, r: 'SSR', icon: '🔮', name: 'すいしょうだま', es: '[Mañana] {viviréis} en la ciudad.', ja: 'あした、君たちは町に住むでしょう。', tag: '未来' },

  /* ---- L2 主語いろいろ・「いつ」を表す語 ---- */
  { id: 'c2-1', L: 2, r: 'N', icon: '📅', name: 'ひめくり', es: '[Mañana] {viajaré} a Madrid.', ja: 'あした、私はマドリードへ旅行するでしょう。', tag: '未来' },
  { id: 'c2-2', L: 2, r: 'N', icon: '⚽', name: 'サッカーボール', es: '[Mañana] {ganarán} el partido.', ja: 'あした、みんなは試合に勝つでしょう。', tag: '未来' },
  { id: 'c2-3', L: 2, r: 'R', icon: '⏳', name: 'すなどけい', es: '[Dentro de] una hora {llegaremos}.', ja: '1時間後に、私たちは着くでしょう。', tag: '未来' },
  { id: 'c2-4', L: 2, r: 'SR', icon: '🌙', name: 'みかづき', es: '[Algún día] {viajaréis} a Japón.', ja: 'いつか、君たちは日本へ旅行するでしょう。', tag: '未来' },
  { id: 'c2-5', L: 2, r: 'SSR', icon: '🎆', name: 'はなび', es: '[El año que viene] {bailaremos} en la fiesta.', ja: '来年、私たちはパーティーで踊るでしょう。', tag: '未来' },

  /* ---- L3 芯が変わる①：e が落ちる ---- */
  { id: 'c3-1', L: 3, r: 'N', icon: '🦶', name: 'ほうたい', es: '[Mañana] {podré} jugar.', ja: 'あした、私は遊べるでしょう。', tag: '芯' },
  { id: 'c3-2', L: 3, r: 'N', icon: '📚', name: 'ぶあつい本', es: '{Sabrás} la verdad.', ja: '君は本当のことを知るでしょう。', tag: '芯' },
  { id: 'c3-3', L: 3, r: 'R', icon: '🎈', name: 'ふうせん', es: '[Mañana] {habrá} una fiesta.', ja: 'あした、パーティーがあるでしょう。', tag: '芯' },
  { id: 'c3-4', L: 3, r: 'SR', icon: '💌', name: 'まごからの手紙', es: 'Marta {querrá} hablar con usted.', ja: 'マルタは、あなたと話したがるでしょう。', tag: '芯' },
  { id: 'c3-5', L: 3, r: 'SSR', icon: '🏆', name: 'きんのトロフィー', es: '[Pasado mañana] {podremos} ganar el partido.', ja: 'あさって、私たちは試合に勝てるでしょう。', tag: '芯' },

  /* ---- L4 芯が変わる②：d が入る・短くなる ---- */
  { id: 'c4-1', L: 4, r: 'N', icon: '🥖', name: 'フランスパン', es: '[Mañana] {tendré} mucho pan.', ja: 'あした、私はパンがたくさんあるでしょう。', tag: '芯' },
  { id: 'c4-2', L: 4, r: 'N', icon: '🚪', name: 'とびら', es: '[Mañana] {saldremos} de casa.', ja: 'あした、私たちは家を出るでしょう。', tag: '芯' },
  { id: 'c4-3', L: 4, r: 'R', icon: '⛵', name: 'ヨット', es: '[Mañana] {hará} buen tiempo.', ja: 'あした、よい天気になるでしょう。', tag: '芯' },
  { id: 'c4-4', L: 4, r: 'SR', icon: '💐', name: 'はなたば', es: '[Mañana] ella {vendrá} a la tienda.', ja: 'あした、彼女は店に来るでしょう。', tag: '芯' },
  { id: 'c4-5', L: 4, r: 'SSR', icon: '💍', name: 'ゆびわ', es: '[Algún día] ella {dirá} que sí.', ja: 'いつか、彼女は「いいよ」と言うでしょう。', tag: '芯' },

  /* ---- L5 過去未来 ---- */
  { id: 'c5-1', L: 5, r: 'N', icon: '📒', name: 'ちょうぼ', es: '[Dijo que] {llovería}.', ja: '雨がふるだろう、と言った。', tag: '過去未来' },
  { id: 'c5-2', L: 5, r: 'N', icon: '🖋️', name: 'はねペン', es: '[Dijo que] {hablaría} con Rosa.', ja: 'ロサと話すだろう、と言った。', tag: '過去未来' },
  { id: 'c5-3', L: 5, r: 'R', icon: '📖', name: 'きろくの本', es: '[Dijo que] {vendríamos} a la fiesta.', ja: '私たちはパーティーに来るだろう、と言った。', tag: '過去未来' },
  { id: 'c5-4', L: 5, r: 'SR', icon: '🕰️', name: 'ふりこ時計', es: '[Dijo que] {tendrías} un examen.', ja: '君は試験があるだろう、と言った。', tag: '過去未来' },
  { id: 'c5-5', L: 5, r: 'SSR', icon: '🌈', name: 'にじ', es: '[Dijo que] {ganaríamos} el partido.', ja: '私たちは試合に勝つだろう、と言った。', tag: '過去未来' },

  /* ---- L6 芯が変わる動詞の過去未来・やんわり言う ---- */
  { id: 'c6-1', L: 6, r: 'N', icon: '🍵', name: 'おちゃ', es: '{Me gustaría} un té.', ja: 'お茶がほしいのですが。', tag: 'やんわり' },
  { id: 'c6-2', L: 6, r: 'N', icon: '🪟', name: 'まど', es: '¿{Podría} abrir la ventana?', ja: '窓を開けていただけますか。', tag: 'やんわり' },
  { id: 'c6-3', L: 6, r: 'R', icon: '🧭', name: 'らしんばん', es: '[Dije que] {haría} buen tiempo.', ja: 'よい天気になるだろう、と言った。', tag: '過去未来' },
  { id: 'c6-4', L: 6, r: 'SR', icon: '🎒', name: 'たびのにもつ', es: '[Dijo que] {saldrían} de casa.', ja: '彼らは家を出るだろう、と言った。', tag: '過去未来' },
  { id: 'c6-5', L: 6, r: 'SSR', icon: '📜', name: 'ひみつのまきもの', es: '[Dijo que] {sabríamos} la verdad.', ja: '私たちは本当のことを知るだろう、と言った。', tag: '過去未来' },

  /* ---- L7 くもった水晶玉（推量） ---- */
  { id: 'c7-1', L: 7, r: 'N', icon: '🌫', name: 'くもった玉', es: '{Serán} las tres.', ja: '3時だろう。', tag: '推量' },
  { id: 'c7-2', L: 7, r: 'N', icon: '🏠', name: 'あかりのついた窓', es: '{Estará} en casa.', ja: '家にいるだろう。', tag: '推量' },
  { id: 'c7-3', L: 7, r: 'R', icon: '📷', name: 'いろあせた写真', es: '{Tendría} unos diez años.', ja: '10歳くらいだっただろう。', tag: '推量' },
  { id: 'c7-4', L: 7, r: 'SR', icon: '🕯', name: 'ゆれるろうそく', es: 'Hugo {tendrá} mucho trabajo.', ja: 'ウーゴは、仕事が多いのだろう。', tag: '推量' },
  { id: 'c7-5', L: 7, r: 'SSR', icon: '🌘', name: 'うすぐもりの月', es: '{Serían} las diez cuando llegó.', ja: '着いたのは10時ごろだっただろう。', tag: '推量' },

  /* ---- L8 済んだことの帳簿（現在完了） ---- */
  { id: 'c8-1', L: 8, r: 'N', icon: '📓', name: 'きょうのちょうぼ', es: '[Hoy] {he trabajado} mucho.', ja: 'きょうは、よく働いた。', tag: '現在完了' },
  { id: 'c8-2', L: 8, r: 'N', icon: '✒️', name: 'インクのペン', es: '[Todavía no] {he escrito} la carta.', ja: 'まだ手紙を書いていない。', tag: '現在完了' },
  { id: 'c8-3', L: 8, r: 'R', icon: '🧾', name: 'レシート', es: '[Ya] {hemos comido}.', ja: 'もう食べた。', tag: '現在完了' },
  { id: 'c8-4', L: 8, r: 'SR', icon: '🗝', name: 'ひきだしの鍵', es: '[Esta semana] {han vuelto} tarde.', ja: '今週は、みんな帰りが遅い。', tag: '現在完了' },
  { id: 'c8-5', L: 8, r: 'SSR', icon: '📔', name: 'ぶあつい大帳簿', es: 'Hugo {ha abierto} la tienda [hoy].', ja: 'ウーゴは、きょう店を開けた。', tag: '現在完了' },

  /* ---- L9 そのとき、もう済んでいた（過去完了） ---- */
  { id: 'c9-1', L: 9, r: 'N', icon: '🚉', name: 'ホームのベンチ', es: 'El tren ya {había salido}.', ja: '電車は、もう出ていた。', tag: '過去完了' },
  { id: 'c9-2', L: 9, r: 'N', icon: '⏪', name: 'もどる針', es: 'Ya {habíamos comido}.', ja: 'もう食べていた。', tag: '過去完了' },
  { id: 'c9-3', L: 9, r: 'R', icon: '🕰', name: 'とまった時計', es: '[Cuando llegué], Beto ya {había vuelto}.', ja: '着いたとき、ベトはもう帰っていた。', tag: '過去完了' },
  { id: 'c9-4', L: 9, r: 'SR', icon: '🍂', name: 'おちば', es: '[Cuando llegamos], {habían cerrado} la tienda.', ja: '着いたとき、店はもう閉まっていた。', tag: '過去完了' },
  { id: 'c9-5', L: 9, r: 'SSR', icon: '🌠', name: 'ながれ星', es: '[Cuando llegué], ya {habías escrito} la carta.', ja: '着いたとき、君はもう手紙を書いていた。', tag: '過去完了' },

  /* ---- L10 その日までには（未来完了） ---- */
  { id: 'c10-1', L: 10, r: 'N', icon: '🗓', name: 'めくったカレンダー', es: 'Para el [viernes], {habré terminado}.', ja: '金曜日までには、終えているだろう。', tag: '未来完了' },
  { id: 'c10-2', L: 10, r: 'N', icon: '🥐', name: 'ならんだパン', es: 'Hugo {habrá hecho} cien panes.', ja: 'ウーゴは、パンを100こ焼き終えているだろう。', tag: '未来完了' },
  { id: 'c10-3', L: 10, r: 'R', icon: '✈️', name: 'ひこうき', es: 'Ya {habrá llegado}.', ja: 'もう着いただろう。', tag: '未来完了' },
  { id: 'c10-4', L: 10, r: 'SR', icon: '🎊', name: 'おまつりのかざり', es: 'Para el [domingo], {habremos abierto} la tienda.', ja: '日曜日までには、店を開けているだろう。', tag: '未来完了' },
  { id: 'c10-5', L: 10, r: 'SSR', icon: '🥇', name: 'かがやくトロフィー', es: '[Mañana a esta hora] ya {habré escrito} la carta.', ja: 'あしたの今ごろには、もう手紙を書いているだろう。', tag: '未来完了' },

  /* ---- L11 いま、その最中（進行形） ---- */
  { id: 'c11-1', L: 11, r: 'N', icon: '💧', name: 'あまだれ', es: '[Ahora mismo] {está lloviendo}.', ja: 'いま、雨が降っている。', tag: '進行形' },
  { id: 'c11-2', L: 11, r: 'N', icon: '☕', name: 'ゆげのカップ', es: 'Rosa {está leyendo} una carta.', ja: 'ロサは、手紙を読んでいる。', tag: '進行形' },
  { id: 'c11-3', L: 11, r: 'R', icon: '🎣', name: 'つりざお', es: 'El capitán {está durmiendo}.', ja: '船長は、いま寝ている。', tag: '進行形' },
  { id: 'c11-4', L: 11, r: 'SR', icon: '⚓', name: 'いかり', es: '[Ayer] a las tres, {estábamos trabajando}.', ja: 'きのうの3時、私たちは働いていた。', tag: '進行形' },
  { id: 'c11-5', L: 11, r: 'SSR', icon: '🌊', name: 'ゆれる波', es: '[Mañana a esta hora] {estaremos comiendo}.', ja: 'あしたの今ごろ、私たちは食べているだろう。', tag: '進行形' },

  /* ---- L12 時間の地図（総まとめ） ---- */
  { id: 'c12-1', L: 12, r: 'N', icon: '🛶', name: 'こうかいの羅針盤', es: '[Mañana] {lloverá}.', ja: 'あした、雨が降るだろう。', tag: '総まとめ' },
  { id: 'c12-2', L: 12, r: 'N', icon: '🗺', name: 'じかんの地図', es: 'Rosa [dijo que] {llovería}.', ja: 'ロサは、雨が降るだろうと言った。', tag: '総まとめ' },
  { id: 'c12-3', L: 12, r: 'R', icon: '🪙', name: 'ふるいコイン', es: '[Hoy] {ha llovido} mucho.', ja: 'きょうは、よく雨が降った。', tag: '総まとめ' },
  { id: 'c12-4', L: 12, r: 'SR', icon: '🎓', name: 'そつぎょうぼう', es: '[Cuando llegué], ya {había llovido}.', ja: '着いたとき、もう雨が降っていた。', tag: '総まとめ' },
  { id: 'c12-5', L: 12, r: 'SSR', icon: '🌟', name: 'ルナのひげ', es: 'Para el [lunes], ya {habrá llovido}.', ja: '月曜日までには、もう雨が降っているだろう。', tag: '総まとめ' },

  /* ---- UR：ボスを倒した証 ---- */
  { id: 'u-B1', boss: 'B1', r: 'UR', icon: '🎐', name: '虹のかけら', es: '[Mañana] {tendrás} que creer.', ja: 'あしたは、信じてもらいますよ。', tag: '未来' },
  { id: 'u-B2', boss: 'B2', r: 'UR', icon: '🔭', name: 'はれわたる水晶', es: 'Duda [dijo que] {vendría}.', ja: 'ドゥーダは、来ると言った。', tag: '過去未来' },
  { id: 'u-B3', boss: 'B3', r: 'UR', icon: '🌌', name: 'ほしぞらの羅針盤', es: 'Para el [viernes], ya {habré aprobado}.', ja: '金曜日までには、もう合格しているだろう。', tag: '総まとめ' }
]);
