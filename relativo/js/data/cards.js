/* =========================================================
 * ¡QUE FUSIÓN! — フレーズカード（図鑑・ガチャ）
 *
 *  レッスン L をクリアすると、そのレッスンのカードがガチャに入る。
 *  r：レア度 N < R < SR < SSR < UR（UR はボスを倒したときだけ）
 *  es の色分けはレッスンと同じ（[先行詞] {関係詞} ^前置詞^）
 * ========================================================= */
window.RQ = window.RQ || {};

RQ.cards = [
  /* L1 */
  { id: 'c1-1', L: 1, r: 'N', es: 'Este es el [libro] {que} compré ayer.', ja: 'これが、昨日買った本だ。', tag: 'que（〜を）' },
  { id: 'c1-2', L: 1, r: 'N', es: 'Hay un [tren] {que} sale a las tres.', ja: '3時に出る電車がある。', tag: 'que（〜が）' },
  { id: 'c1-3', L: 1, r: 'R', es: 'La [película] {que} vi ayer fue muy buena.', ja: '昨日見た映画は、とてもよかった。', tag: 'que（〜を）' },
  { id: 'c1-4', L: 1, r: 'R', es: 'Vivo en una [casa] {que} tiene jardín.', ja: '庭のある家に住んでいる。', tag: 'que（〜が）' },
  { id: 'c1-5', L: 1, r: 'SR', es: 'Me gusta la [canción] {que} canta Ana.', ja: 'アナが歌っている歌が好きだ。', tag: 'que（〜を）' },
  /* L2 */
  { id: 'c2-1', L: 2, r: 'N', es: 'Tengo un [amigo] {que} vive en Madrid.', ja: 'マドリードに住んでいる友だちがいる。', tag: '人にも que' },
  { id: 'c2-2', L: 2, r: 'N', es: 'El [chico] {que} canta es mi hermano.', ja: '歌っている男の子は、私の兄だ。', tag: '人にも que' },
  { id: 'c2-3', L: 2, r: 'R', es: 'La [chica] {que} ves allí es mi prima.', ja: 'あそこに見える女の子は、私のいとこだ。', tag: '割りこみ' },
  { id: 'c2-4', L: 2, r: 'SR', es: 'El [profesor] {que} tenemos este año es muy simpático.', ja: '今年の先生は、とても感じがいい。', tag: '割りこみ' },
  { id: 'c2-5', L: 2, r: 'SSR', es: 'Conozco a una [chica] {que} habla japonés.', ja: '日本語を話す女の子を知っている。', tag: '人にも que' },
  /* L3 */
  { id: 'c3-1', L: 3, r: 'N', es: 'Mi [abuela], {quien} tiene ochenta años, todavía trabaja.', ja: '祖母は、80歳だけど、まだ働いている。', tag: 'コンマ＋quien' },
  { id: 'c3-2', L: 3, r: 'R', es: 'Mis [amigos], {quienes} son de México, hablan español.', ja: '私の友だちは、メキシコ出身で、スペイン語を話す。', tag: 'quienes' },
  { id: 'c3-3', L: 3, r: 'R', es: 'Mi [hermana], {quien} vive en Japón, habla tres idiomas.', ja: '私の姉は、日本に住んでいて、3つの言語を話す。', tag: 'コンマ＋quien' },
  { id: 'c3-4', L: 3, r: 'SR', es: 'Mis [abuelos], {quienes} viven en el campo, tienen muchos animales.', ja: '私の祖父母は、いなかに住んでいて、動物をたくさん飼っている。', tag: 'quienes' },
  { id: 'c3-5', L: 3, r: 'SSR', es: '[Ana], {quien} estudia japonés, quiere visitar Kioto.', ja: 'アナは日本語を勉強していて、京都を訪れたいと思っている。', tag: 'コンマ＋quien' },
  /* L4 */
  { id: 'c4-1', L: 4, r: 'N', es: 'Esta es la [chica] ^con^ {quien} hablo todos los días.', ja: 'これが、私が毎日話している女の子だ。', tag: '前置詞は前へ' },
  { id: 'c4-2', L: 4, r: 'R', es: 'El [chico] ^de^ {quien} te hablé es este.', ja: '君に話した男の子は、この子だよ。', tag: 'hablar de' },
  { id: 'c4-3', L: 4, r: 'R', es: 'Este es el [pueblo] ^en^ {que} nací.', ja: 'これが、私の生まれた村だ。', tag: 'en que' },
  { id: 'c4-4', L: 4, r: 'SR', es: 'Este es el [amigo] ^con^ {quien} viajé a Perú.', ja: 'これが、いっしょにペルーへ旅行した友だちだ。', tag: '前置詞は前へ' },
  { id: 'c4-5', L: 4, r: 'SSR', es: 'El [año] ^en^ {que} nací fue 2010.', ja: '私が生まれた年は、2010年だ。', tag: 'en que（時）' },
  /* L5 */
  { id: 'c5-1', L: 5, r: 'N', es: 'Esta es la [casa] ^en^ {la que} vivo.', ja: 'これが、私の住んでいる家だ。', tag: '冠詞は残る' },
  { id: 'c5-2', L: 5, r: 'R', es: 'Me gusta el [restaurante] ^en^ {el que} comimos ayer.', ja: '昨日食べたレストランが気に入っている。', tag: '冠詞は残る' },
  { id: 'c5-3', L: 5, r: 'R', es: 'Son los [amigos] ^con^ {los que} viajé a México.', ja: 'いっしょにメキシコへ旅行した友だちだ。', tag: 'los que' },
  { id: 'c5-4', L: 5, r: 'SR', es: 'El [chico] ^al^ {que} llamé ayer es mi primo.', ja: '昨日電話した男の子は、私のいとこだ。', tag: 'a＋el → al' },
  { id: 'c5-5', L: 5, r: 'SSR', es: 'Es la [llave] ^con^ {la que} abro la puerta.', ja: 'ドアを開けるのに使う鍵だ。', tag: '道具の con' },
  /* L6 */
  { id: 'c6-1', L: 6, r: 'N', es: 'Esta es la [ciudad] {donde} nací.', ja: 'ここが、私の生まれた町だ。', tag: 'donde' },
  { id: 'c6-2', L: 6, r: 'R', es: 'Esta es la [tienda] {donde} compro pan.', ja: 'これが、私がパンを買う店だ。', tag: 'donde' },
  { id: 'c6-3', L: 6, r: 'R', es: 'Fuimos al [parque] {donde} jugábamos de niños.', ja: '子どものころ遊んだ公園に行った。', tag: 'donde' },
  { id: 'c6-4', L: 6, r: 'SR', es: 'Este es el [restaurante] {donde} conocí a mi novia.', ja: 'ここが、恋人と出会ったレストランだ。', tag: 'donde' },
  { id: 'c6-5', L: 6, r: 'SSR', es: 'Kioto es una [ciudad] {que} quiero visitar.', ja: '京都は、私が訪れたい町だ。', tag: '場所でも que' },
  /* L7 */
  { id: 'c7-1', L: 7, r: 'N', es: '{Lo que} quiero es dormir.', ja: '私がしたいのは、寝ることだ。', tag: 'lo que' },
  { id: 'c7-2', L: 7, r: 'R', es: 'No entiendo {lo que} dices.', ja: '君の言うことが分からない。', tag: 'lo que' },
  { id: 'c7-3', L: 7, r: 'R', es: 'Esto es {lo que} necesito.', ja: 'これが、私に必要なものだ。', tag: 'lo que' },
  { id: 'c7-4', L: 7, r: 'SR', es: 'Gracias por todo {lo que} haces por mí.', ja: '私のためにしてくれる、いろいろなことに感謝してる。', tag: 'todo lo que' },
  { id: 'c7-5', L: 7, r: 'SSR', es: 'Te voy a contar todo {lo que} pasó.', ja: '起きたことを、ぜんぶ話してあげるね。', tag: 'todo lo que' },
  /* L8 */
  { id: 'c8-1', L: 8, r: 'N', es: '{El que} llega tarde paga el café.', ja: '遅れて来た人が、コーヒー代を払う。', tag: 'el que（人）' },
  { id: 'c8-2', L: 8, r: 'R', es: 'Mis llaves son {las que} están en la mesa.', ja: '私の鍵は、テーブルの上にあるやつだ。', tag: 'las que' },
  { id: 'c8-3', L: 8, r: 'R', es: 'Estos zapatos son {los que} compré ayer.', ja: 'この靴が、昨日買ったやつだ。', tag: 'los que' },
  { id: 'c8-4', L: 8, r: 'SR', es: '{Los que} estudian mucho aprueban el examen.', ja: 'たくさん勉強する人たちは、試験に受かる。', tag: 'los que（人）' },
  { id: 'c8-5', L: 8, r: 'SSR', es: 'De todos los coches, {el que} más me gusta es el blanco.', ja: '車の中で、いちばん好きなのは白いのだ。', tag: 'el que' },
  /* L9 */
  { id: 'c9-1', L: 9, r: 'N', es: 'Creo que Ana tiene razón.', ja: 'アナの言うとおりだと思う。', tag: '接続詞の que' },
  { id: 'c9-2', L: 9, r: 'R', es: 'La [casa] {que} compramos es pequeña.', ja: '私たちが買った家は、小さい。', tag: '関係詞の que' },
  { id: 'c9-3', L: 9, r: 'R', es: '¿Qué quieres comer?', ja: '何を食べたい？', tag: '疑問詞 qué' },
  { id: 'c9-4', L: 9, r: 'SR', es: 'No sé qué hacer.', ja: '何をしたらいいか分からない。', tag: '疑問詞 qué' },
  { id: 'c9-5', L: 9, r: 'SSR', es: 'No sé dónde está mi llave.', ja: '鍵がどこにあるか分からない。', tag: '疑問詞 dónde' },
  /* L10 */
  { id: 'c10-1', L: 10, r: 'N', es: 'Tengo un [amigo] {cuyo} padre es piloto.', ja: 'お父さんがパイロットの友だちがいる。', tag: 'cuyo' },
  { id: 'c10-2', L: 10, r: 'R', es: 'Es un [escritor] {cuyas} novelas son famosas.', ja: '小説が有名な作家だ。', tag: 'cuyas' },
  { id: 'c10-3', L: 10, r: 'SR', es: 'Es una [chica] {cuyos} hermanos viven en París.', ja: 'お兄さんたちがパリに住んでいる女の子だ。', tag: 'cuyos' },
  { id: 'c10-4', L: 10, r: 'SR', es: 'Llegó tarde, {lo cual} me molestó.', ja: '彼は遅れて来た。そのことに、私はイライラした。', tag: 'lo cual' },
  { id: 'c10-5', L: 10, r: 'SSR', es: 'La [casa] {cuyas} ventanas son azules es mía.', ja: '窓が青い家は、私のだ。', tag: 'cuyas' },
  /* ボス撃破の証（UR） */
  { id: 'u-B1', boss: 'B1', r: 'UR', es: 'El [libro] {que} me diste es mi tesoro.', ja: '君がくれた本は、ぼくの宝物だ。', tag: 'ショウリャク・ゴースト撃破' },
  { id: 'u-B2', boss: 'B2', r: 'UR', es: 'Eres la [persona] ^con^ {quien} quiero hablar.', ja: '君こそ、ぼくが話したい人だ。', tag: 'プレポ・ゴーレム撃破' },
  { id: 'u-B3', boss: 'B3', r: 'UR', es: 'Esta es la [ciudad] ^en^ {la que} empezó todo.', ja: 'ここが、すべてが始まった町だ。', tag: 'カンシ・ツインズ撃破' },
  { id: 'u-B4', boss: 'B4', r: 'UR', es: '{Lo que} importa es {lo que} haces hoy.', ja: '大事なのは、今日きみがすることだ。', tag: 'ロケ・ファントム撃破' },
  { id: 'u-B5', boss: 'B5', r: 'UR', es: 'Gracias a todos {los que} me ayudaron.', ja: '助けてくれたみんなに、ありがとう。', tag: 'エル・ヘフェ・クーヨ撃破' }
];
