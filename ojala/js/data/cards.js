/* =========================================================
 * ¡OJALÁ! — 切手（📮 切手の市で出る。お金はからまない。チケットは学習でもらえる）
 *
 *  手に入れると、港町の景色に絵で現れる。切手には、その依頼で習った文が付く
 *  （🎧 聞き取り・🧩 並べ替えの練習に使う）。
 *
 *  { id, L, r, icon, name, es, ja, tag }
 *    r     レアリティ N / R / SR / SSR / UR（各依頼 N×2・R×1・SR×1・SSR×1）
 *    es    その依頼までに習った形の文。動詞の形は {…}
 *    tag   '願い' '気持ち' '疑い' '必要' 'まだ' '目的' 'さがす' '頼み' '本当のこと' 'いつも'
 *  UR は、ボスに勝った記念切手（boss: 'B1' など。L は持たない）。
 * ========================================================= */
window.OQ = window.OQ || {};

OQ.cards = [
  /* ---- L1 願い ＋ -ar ---- */
  { id: 'c1-1', L: 1, r: 'N', icon: '🐚', name: '貝の切手', es: 'Espero que {descanses}.', ja: 'よく休めるといいね。', tag: '願い' },
  { id: 'c1-2', L: 1, r: 'N', icon: '⚓', name: 'いかりの切手', es: 'Quiero que {regreses} pronto.', ja: '早く帰ってきてほしい。', tag: '願い' },
  { id: 'c1-3', L: 1, r: 'R', icon: '🐬', name: 'いるかの切手', es: 'Quiero que {bailes} conmigo.', ja: '私と踊ってほしい。', tag: '願い' },
  { id: 'c1-4', L: 1, r: 'SR', icon: '🌅', name: '夕日の切手', es: 'Espero que me {llames}.', ja: '電話してくれるといいな。', tag: '願い' },
  { id: 'c1-5', L: 1, r: 'SSR', icon: '🗼', name: '灯台の切手', es: 'Sé que {trabajas} mucho.', ja: 'たくさん働いているのは知ってるよ。', tag: '本当のこと' },
  /* ---- L2 -er・-ir ＋ ojalá ---- */
  { id: 'c2-1', L: 2, r: 'N', icon: '☀️', name: 'お日さまの切手', es: 'Ojalá {haga} sol.', ja: '晴れるといいなあ。', tag: '願い' },
  { id: 'c2-2', L: 2, r: 'N', icon: '🐄', name: '牛の切手', es: 'Quiero que {comas} bien.', ja: 'ちゃんと食べてほしい。', tag: '願い' },
  { id: 'c2-3', L: 2, r: 'R', icon: '🏡', name: 'いなかの家の切手', es: 'Ojalá {venga} mi madre.', ja: '母さんが来てくれるといいなあ。', tag: '願い' },
  { id: 'c2-4', L: 2, r: 'SR', icon: '🌻', name: 'ひまわりの切手', es: 'Quiero que me {escribas}.', ja: '手紙を書いてほしい。', tag: '願い' },
  { id: 'c2-5', L: 2, r: 'SSR', icon: '🌈', name: 'にじの切手', es: 'Ojalá {tengas} suerte.', ja: 'うまくいくといいね。', tag: '願い' },
  /* ---- L3 気持ち ＋ 例外 ---- */
  { id: 'c3-1', L: 3, r: 'N', icon: '⏰', name: '目ざまし時計の切手', es: 'Me alegro de que {estés} bien.', ja: '元気でうれしい。', tag: '気持ち' },
  { id: 'c3-2', L: 3, r: 'N', icon: '🚂', name: '汽車の切手', es: 'Espero que {llegues} pronto.', ja: '早く着くといいな。', tag: '願い' },
  { id: 'c3-3', L: 3, r: 'R', icon: '🍊', name: 'オレンジの切手', es: 'Me alegro de que {seas} feliz.', ja: '幸せそうでうれしい。', tag: '気持ち' },
  { id: 'c3-4', L: 3, r: 'SR', icon: '🎻', name: 'バイオリンの切手', es: 'Siento que no {puedas} venir.', ja: '来られなくて残念。', tag: '気持ち' },
  { id: 'c3-5', L: 3, r: 'SSR', icon: '🏰', name: 'お城の切手', es: 'Ojalá no {haya} problemas.', ja: '問題がないといいなあ。', tag: '願い' },
  /* ---- L4 疑い・必要 ---- */
  { id: 'c4-1', L: 4, r: 'N', icon: '🥖', name: 'パンの切手', es: 'Es importante que {comas} pan.', ja: 'パンを食べることが大事。', tag: '必要' },
  { id: 'c4-2', L: 4, r: 'N', icon: '☁️', name: 'くもの切手', es: 'No creo que {llueva}.', ja: '雨は降らないと思う。', tag: '疑い' },
  { id: 'c4-3', L: 4, r: 'R', icon: '🏛️', name: '役所の切手', es: 'Es necesario que {abran} la tienda.', ja: '店を開けることが必要だ。', tag: '必要' },
  { id: 'c4-4', L: 4, r: 'SR', icon: '📜', name: '巻物の切手', es: 'Creo que {tienes} razón.', ja: '君の言うとおりだと思う。', tag: '本当のこと' },
  { id: 'c4-5', L: 4, r: 'SSR', icon: '🔔', name: '鐘の切手', es: 'Dudo que {sea} verdad.', ja: 'それが本当だとは思えない。', tag: '疑い' },
  /* ---- L5 まだ・目的 ---- */
  { id: 'c5-1', L: 5, r: 'N', icon: '⛵', name: 'ヨットの切手', es: 'Cuando {vuelvas}, vamos a bailar.', ja: '帰ってきたら、踊ろう。', tag: 'まだ' },
  { id: 'c5-2', L: 5, r: 'N', icon: '🐟', name: '魚の切手', es: 'Cuando {hace} frío, cierro la ventana.', ja: '寒いと（いつも）窓を閉める。', tag: 'いつも' },
  { id: 'c5-3', L: 5, r: 'R', icon: '☔', name: '雨がさの切手', es: 'Vamos antes de que {llueva}.', ja: '雨が降る前に行こう。', tag: 'まだ' },
  { id: 'c5-4', L: 5, r: 'SR', icon: '🌙', name: '月の切手', es: 'Te escribo para que no {estés} triste.', ja: '悲しくならないように、手紙を書く。', tag: '目的' },
  { id: 'c5-5', L: 5, r: 'SSR', icon: '🚢', name: '大きな船の切手', es: 'Cuando {sea} mayor, quiero ser médico.', ja: '大きくなったら、医者になりたい。', tag: 'まだ' },
  /* ---- L6 さがしている人 ---- */
  { id: 'c6-1', L: 6, r: 'N', icon: '📰', name: '新聞の切手', es: 'Busco una persona que {hable} inglés.', ja: '英語を話す人をさがしています。', tag: 'さがす' },
  { id: 'c6-2', L: 6, r: 'N', icon: '🎹', name: 'ピアノの切手', es: 'No hay nadie que {sepa} tocar el piano.', ja: 'ピアノがひける人はだれもいない。', tag: 'さがす' },
  { id: 'c6-3', L: 6, r: 'R', icon: '✏️', name: '鉛筆の切手', es: '¿Hay alguien que {tenga} un lápiz?', ja: '鉛筆を持っている人はいますか？', tag: 'さがす' },
  { id: 'c6-4', L: 6, r: 'SR', icon: '🏠', name: '海辺の家の切手', es: 'Queremos una casa que {esté} cerca del mar.', ja: '海の近くの家がほしい。', tag: 'さがす' },
  { id: 'c6-5', L: 6, r: 'SSR', icon: '👫', name: 'ともだちの切手', es: 'Tengo un amigo que {habla} japonés.', ja: '日本語を話す友だちがいる。', tag: '本当のこと' },
  /* ---- L7 伝える／頼む ---- */
  { id: 'c7-1', L: 7, r: 'N', icon: '📬', name: 'ポストの切手', es: 'Dile que {venga}.', ja: '来るように言って。', tag: '頼み' },
  { id: 'c7-2', L: 7, r: 'N', icon: '📨', name: '封筒の切手', es: 'Dile que {viene}.', ja: '（彼が）来ると伝えて。', tag: '本当のこと' },
  { id: 'c7-3', L: 7, r: 'R', icon: '🚪', name: 'とびらの切手', es: '{Pase} usted, por favor.', ja: 'どうぞ、お入りください。', tag: '頼み' },
  { id: 'c7-4', L: 7, r: 'SR', icon: '💐', name: '花束の切手', es: 'Esperamos que {vengáis} a la boda.', ja: 'みんなが結婚式に来てくれるといいな。', tag: '願い' },
  { id: 'c7-5', L: 7, r: 'SSR', icon: '💍', name: '指輪の切手', es: 'Quiero que {seáis} felices.', ja: '君たちに幸せになってほしい。', tag: '願い' },
  /* ---- UR：ボスに勝った記念切手 ---- */
  { id: 'u-B1', boss: 'B1', r: 'UR', icon: '🌄', name: '霧が晴れた朝', es: 'Espero que {salga} el sol.', ja: '日がのぼるといいな。', tag: '願い' },
  { id: 'u-B2', boss: 'B2', r: 'UR', icon: '🎩', name: 'セベロの帽子', es: 'No creo que {haya} problemas.', ja: '問題があるとは思わない。', tag: '疑い' },
  { id: 'u-B3', boss: 'B3', r: 'UR', icon: '💌', name: '届いた手紙', es: '¡Ojalá {seas} muy feliz!', ja: 'どうか、とても幸せに！', tag: '願い' }
];
