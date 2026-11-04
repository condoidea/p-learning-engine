/* 第2話 閉まっていたドア — estar ＋ 過去分詞（いまの様子）と ser ＋ 過去分詞（出来事）のちがい
 * 単語帳にない語：cerrado/cerrada/cerradas＝閉まった（過去分詞・4級）, pasillo＝廊下（名詞・4級）, tinta＝インク（名詞・4級以上）, verde＝緑の（形容詞・4級）,
 *   escrita＝書かれた（escribir の過去分詞・女性・4級）, escribí＝書いた（点過去）, hecha＝作られた（hacer の過去分詞・女性）, madera＝木（名詞・4級）,
 *   preparada＝準備された（過去分詞・女性）, terminado＝終わった（過去分詞）, conserje＝管理人（名詞・4級以上）, desea＝望む（desear・4級）,
 *   estaban＝いた（estar 線過去・複数）, nadie＝だれも（代名詞・4級）, llegué＝着いた（点過去）, pudo＝できた（poder 点過去）, mapa＝地図（名詞・4級）,
 *   Inés・Paz＝人名, sentado＝すわった（sentar の過去分詞）, abrido/escribar＝誤答の選択肢（登録不要） */
QF.cases.push({
  id: 'c2', no: 2, title: '閉まっていたドア', es: 'La puerta cerrada', icon: '🚪',
  grammar: 'estar ＋ 過去分詞（状態）と ser のちがい',
  cover: '市立図書館から、古い地図が消えた。館員は「ドアは閉まっていた」と言う。でも、それは「何時」の話なのか。',
  cast: {
    ines: { n: 'イネス', es: 'Inés', e: '👩‍💼', role: '図書館の司書' },
    paz:  { n: 'パスさん', es: 'Señor Paz', e: '🧓', role: '図書館の管理人' }
  },
  evidence: {
    registro: { e: '📒', n: '管理の記録', d: '「入口のドアは、夜 10 時に、管理人パスさんが閉めた」。' },
    ventana:  { e: '🪟', n: '開いた窓', d: '地図の部屋の窓は、夜 9 時には**もう開いていた**。窓のふちに、内側からこすった跡がある。' },
    carta:    { e: '✉️', n: '机の上の手紙', d: '「地図は地下室にあります」。**緑のインク**で書いてある。パスさんのペンは緑色。' }
  },
  steps: [
    /* ---------- 編集部 ---------- */
    { t: 'scene', place: 'redaccion', cast: ['leo', 'pepa', 'ramon'] },
    { t: 'say', who: 'ramon', x: 'レオ、今度は図書館だ。\n古い地図が夜のあいだに消えた。' },
    { t: 'say', who: 'ramon', es: 'La puerta estaba cerrada.', x: '管理人は「ドアは閉まっていた」と言っている。\nだれも入れないはずだ、と。' },
    { t: 'say', who: 'leo', x: '「閉められた」じゃなくて、\n「閉まっていた」…？' },
    { t: 'say', who: 'pepa', x: 'いいところに気づいたわね。\n第1話の形と、ならべてみましょう。' },
    { t: 'note', title: '2つの文をくらべる', rows: [
      ['La puerta [fue cerrada] a las ocho.', 'ドアは 8 時に閉められた。'],
      ['La puerta [estaba cerrada].', 'ドアは閉まっていた。']] },
    { t: 'ask', q: '「8時に」という出来事を言っているのは？', o: ['fue cerrada', 'estaba cerrada'], a: 0,
      r: [{ t: 'say', who: 'pepa', x: 'そう。閉める動きが起きた、という話ね。\nもう1つは、閉まった「あとの様子」。' }] },
    { t: 'say', who: 'ramon', x: '図書館で、その差をたしかめてこい！' },

    /* ---------- 図書館 ---------- */
    { t: 'scene', place: 'biblioteca', cast: ['leo', 'pepa', 'ines'] },
    { t: 'say', who: 'ines', es: 'Buenos días. Soy Inés, la bibliotecaria.', x: 'おはようございます。司書のイネスです。' },
    { t: 'inspect', spots: [
      { e: '🚪', n: '入口のドア', steps: [
        { t: 'say', who: 'ines', es: 'Ahora la puerta está cerrada.', x: 'いま、ドアは閉まっています。' },
        { t: 'ask', q: 'この文は、閉める「動き」を言っている？ いまの「様子」？', es: 'Ahora la puerta está cerrada.', o: ['動き（だれかが閉めた）', 'いまの様子'], a: 1,
          r: [{ t: 'say', who: 'pepa', x: 'そう。「閉まっている」という様子だけ。\nだれが閉めたかは、問題にしていないの。' }] },
        { t: 'note', title: 'estar ＋ 過去分詞（いまの様子）', rows: [
          ['La puerta [está cerrada].', 'ドアは閉まっている。'],
          ['La puerta [estaba cerrada].', 'ドアは閉まっていた。']],
          x: '**estar ＋ 過去分詞＝そのときの様子（〜してある）**\nだれがしたかは言わない。por も付けない。',
          why: 'estar は「いる・ある」の動詞。\ncerrada は「閉まった（状態の）」。\nつなげると「閉まった状態に、ある」。\n閉めたあとの「結果」が続いている、ということ。' },
        { t: 'ask', q: '第1話の ser ＋ 過去分詞は、何を言う形だった？', o: ['出来事（いつ・だれが）', 'いまの様子'], a: 0,
          r: [{ t: 'say', who: 'pepa', x: 'ser は「起きた出来事」。estar は「つづく様子」。\nこのちがいが、今回の中心よ。' }] },
        { t: 'tap', q: 'cerrada の -a は、どの語に合わせたから？', es: 'La puerta estaba cerrada.', ja: 'ドアは閉まっていた。', a: ['puerta'],
          ng: '過去分詞は、主語の性・数に合わせる。',
          r: [{ t: 'say', who: 'pepa', x: 'puerta は女性・単数。だから cerrada よ。' }] },
        { t: 'ask', q: '___ に入るのは？', es: 'La puerta ___ cerrada.', o: ['está', 'es'], a: 0,
          ng: '「閉まっている」という様子だよ。',
          r: [{ t: 'say', who: 'pepa', x: 'es cerrada とは言わないの。様子は estar。' }] },
        { t: 'who', q: 'この文で、閉めたのは？', es: 'La puerta está cerrada.', ja: 'ドアは閉まっている。', o: ['por', 'alguien', 'estado'], a: 2,
          ng: 'この文は、閉めた人を問題にしていない。',
          r: [{ t: 'say', who: 'pepa', x: '様子だけの文。やった人は問わないわ。' }] },
        { t: 'ask', q: 'もし「管理人が閉めた」と言いたいなら？', o: ['La puerta fue cerrada por el conserje.', 'La puerta está cerrada por el conserje.'], a: 0,
          ng: 'だれがしたかを言うのは、出来事の方。',
          r: [{ t: 'say', who: 'pepa', x: 'por を付けて「だれが」を言うなら ser よ。' }] },
        { t: 'get', ev: 'registro' }
      ] },
      { e: '🪟', n: '地図の部屋の窓', steps: [
        { t: 'say', who: 'ines', es: 'La ventana de esta sala está abierta.', x: 'この部屋の窓は、開いています。' },
        { t: 'ask', q: 'abierta の元の動詞 abrir（開ける）。第1話で習った形だね。', o: ['abierto と形が変わる', 'abrido になる'], a: 0 },
        { t: 'say', who: 'ines', es: 'Las ventanas del pasillo están cerradas.', x: '廊下の窓は、閉まっています。' },
        { t: 'tap', q: 'están が複数なのは、どの語に合わせたから？', es: 'Las ventanas están abiertas.', ja: '窓（複数）は開いている。', a: ['ventanas'],
          ng: 'estar も過去分詞も、文の頭の主語に合わせる。',
          r: [{ t: 'say', who: 'pepa', x: 'ventanas が女性・複数。\nだから están も abiertas も複数よ。' }] },
        { t: 'note', title: 'estar ＋ 過去分詞も、主語に合わせる', rows: [
          ['El libro [está roto].', '本は破れている。'],
          ['La ventana [está abierta].', '窓は開いている。'],
          ['Los libros [están rotos].', '本（複数）は破れている。'],
          ['Las ventanas [están abiertas].', '窓（複数）は開いている。']],
          x: '**過去分詞は estar でも、主語の性・数に合わせる。**' },
        { t: 'ask', q: '___ に入るのは？', es: 'Las ventanas están ___.', o: ['abierto', 'abiertas', 'abiertos'], a: 1,
          ng: 'las ventanas は女性・複数。' },
        { t: 'ask', q: '___ に入るのは？', es: 'El libro ___ roto.', o: ['es', 'está'], a: 1,
          ng: '破れている、という様子だよ。' },
        { t: 'say', who: 'leo', x: 'この部屋の窓、夜 9 時にはもう\n開いていたそうですね。' },
        { t: 'get', ev: 'ventana' }
      ] },
      { e: '✉️', n: '机の上の手紙', steps: [
        { t: 'say', who: 'ines', es: 'La carta está escrita con tinta verde.', x: 'この手紙は、緑のインクで書いてあります。' },
        { t: 'ask', q: 'escrita の元の動詞は？', o: ['escribir（書く）', 'escribar（書く）'], a: 0 },
        { t: 'note', title: 'estar ＋ 過去分詞（くり返し）', rows: [
          ['La carta [está escrita] en verde.', '手紙は緑で書いてある。'],
          ['La mesa [está hecha] de madera.', '机は木でできている。'],
          ['La sala [está preparada].', '部屋は準備してある。'],
          ['El trabajo [está terminado].', '仕事は終わっている。'],
          ['Paz [está sentado] en la silla.', 'パスさんは椅子にすわっている。']],
          x: '**escrito・hecho・preparado・terminado・sentado**\n不規則な形は、第1話で習ったものだね。',
          why: '「書いてある」「できている」「すわっている」…。\n日本語の「〜てある・〜ている」が、\nestar ＋ 過去分詞だと考えると覚えやすい。' },
        { t: 'ask', q: '「パスさんがすわっている」は？', o: ['Paz está sentado.', 'Paz es sentado.'], a: 0,
          ng: 'すわっている「様子」だよ。' },
        { t: 'say', who: 'leo', x: '手紙には「地図は地下室に」と\n書いてありますね。' },
        { t: 'get', ev: 'carta' }
      ] }
    ] },
    { t: 'flow', upto: 2 },
    { t: 'say', who: 'pepa', x: '手順の2段目よ。\nser は出来事、estar は様子。' },

    /* ---------- 編集部（原稿） ---------- */
    { t: 'scene', place: 'redaccion', cast: ['leo', 'pepa', 'tito'] },
    { t: 'say', who: 'tito', x: '先輩！ 窓のことを\n先に原稿にしておきました！' },
    { t: 'redpen', q: 'ティトの原稿に、まちがいが1つ。', es: 'La ventana es abierta.', bad: 'es', o: ['está', 'fue', 'están'], a: 0, fix: 'La ventana está abierta.',
      ng: '「開いている」という様子には、estar を使う。',
      r: [{ t: 'say', who: 'pepa', x: '様子だから estar。\nabierta は、ventana に合っているわね。' }] },
    { t: 'who', q: 'では、この文の「やった人」は？', es: 'La ventana fue abierta anoche.', ja: '窓は、ゆうべ開けられた。', o: ['por', 'alguien', 'estado'], a: 1,
      ng: 'ser ＋ 過去分詞。por はあるかな。',
      r: [{ t: 'say', who: 'pepa', x: 'ser の出来事で、por がない。\nだから「だれか」ね。' }] },
    { t: 'say', who: 'leo', x: '管理人さんの言う時刻を、\nたしかめてみます。' },

    /* ---------- 図書館（対決） ---------- */
    { t: 'scene', place: 'biblioteca', cast: ['leo', 'pepa'], duel: true },
    { t: 'enter', who: 'paz' },
    { t: 'say', who: 'paz', es: 'Soy el conserje. ¿Qué desea?', x: '管理人のパスだ。なにか用かね？' },
    { t: 'testimony', who: 'paz', title: 'ゆうべの窓', hint: '地図の部屋の窓の様子を見てみて。', lines: [
      { es: 'Yo estaba en mi sala toda la noche.', ja: 'わたしは、ひと晩じゅう自分の部屋にいた。' },
      { es: 'Todas las ventanas estaban cerradas.', ja: '窓は、ぜんぶ閉まっていた。', ok: ['ventana'],
        press: [{ t: 'say', who: 'paz', es: 'Sí, todas.', x: 'ああ、ぜんぶだ。' }, { t: 'say', who: 'pepa', x: '「ぜんぶ閉まっていた」…\nほんとうかしら。' }] },
      { es: 'Nadie entró en la biblioteca.', ja: 'だれも図書館に入っていない。' }
    ], after: [
      { t: 'say', who: 'leo', x: '地図の部屋の窓は、夜 9 時には\nもう開いていました！' },
      { t: 'ask', q: '記録どおりに言うと？', o: ['La ventana estaba abierta.', 'La ventana estaba cerrada.', 'La ventana fue abierta.'], a: 0,
        ng: '9 時の「様子」を言う文だよ。',
        r: [{ t: 'say', who: 'leo', es: '¡La ventana estaba abierta!', x: '窓は、開いていたんです！' }] },
      { t: 'say', who: 'paz', es: 'Bueno... pero la puerta estaba cerrada.', x: 'ま、まあな。だが、ドアは閉まっていた。' }
    ] },
    { t: 'contra', who: 'paz', title: 'ドアの時刻', hint: '「10 時に閉めた」と「9 時には閉まっていた」。', lines: [
      { es: 'Yo llegué a la biblioteca a las ocho.', ja: 'わたしは 8 時に図書館に着いた。' },
      { es: 'La puerta fue cerrada a las diez por mí.', ja: 'ドアは 10 時に、わたしが閉めた。' },
      { es: 'A las nueve, la puerta ya estaba cerrada.', ja: '9 時には、ドアはもう閉まっていた。' },
      { es: 'Nadie pudo entrar.', ja: 'だれも入れなかった。' }
    ], a: [1, 2], after: [
      { t: 'say', who: 'leo', x: 'fue cerrada は、10 時の出来事。\nなら 9 時には、まだ閉まっていない！' },
      { t: 'ask', q: '9 時のドアの様子は？', o: ['まだ閉まっていなかった', 'もう閉まっていた'], a: 0,
        r: [{ t: 'say', who: 'pepa', x: 'そう。9 時〜 10 時のあいだ、ドアは開いていた。\nそのあいだに出入りできたのよ。' }] },
      { t: 'say', who: 'paz', es: '¿Y qué? Yo no sé nada.', x: 'それがどうした？ わたしは何も知らん。' }
    ] },
    { t: 'present', q: 'パスさんは「手紙のことは知らない」と言う。', ok: ['carta'], hint: '手紙のインクの色と、パスさんのペン。', after: [
      { t: 'say', who: 'leo', x: '手紙は緑のインクで書いてあります。\nあなたのペンも緑ですね。' },
      { t: 'ask', q: '手紙の様子を言う文は？', o: ['La carta está escrita con tinta verde.', 'La carta es escrita con tinta verde.'], a: 0,
        ng: '書いてある「様子」だよ。' },
      { t: 'say', who: 'paz', es: '¡No, no! Yo no la escribí.', x: 'ち、ちがう！ わたしが書いたんじゃない！' }
    ] },
    { t: 'interp', es: 'La puerta estaba cerrada.', ja: 'ドアは閉められた。',
      o: ['ドアは閉められた。', 'ドアは閉まっていた。', 'ドアを閉めた。'], a: 1,
      ng: 'estaba ＋ 過去分詞は、そのときの様子。',
      after: [{ t: 'say', who: 'tito', x: 'す、すみません！ estar なので\n「閉まっていた」という様子…でした。' }] },
    { t: 'who', q: '最後に、パスさんの言い方を確かめよう。この文は？', es: 'A las nueve, la puerta ya estaba cerrada.', ja: '9 時には、ドアはもう閉まっていた。', o: ['por', 'alguien', 'estado'], a: 2 },
    { t: 'build', q: 'とどめの一言を組み立てよう：「ドアを閉めたのは、あなたです！」', es: 'La puerta fue cerrada por usted.', x: ['estaba', 'cerrado'],
      r: [{ t: 'slam', txt: '¡Fue cerrada!' }] },
    { t: 'say', who: 'paz', es: 'Lo siento... El mapa está en mi casa.', x: 'すまない…。地図は、わたしの家にある。' },
    { t: 'say', who: 'ines', es: '¡Qué bien! El mapa vuelve a la biblioteca.', x: 'よかった！ 地図が図書館にもどるのね。' },
    { t: 'scoop', txt: '消えた古地図、管理人が持ち出す', es: 'El mapa fue robado por el conserje de la biblioteca.' },
    { t: 'say', who: 'pepa', x: 'おみごと。\nser は出来事、estar は様子。もう区別できるわね。' }
  ]
});
