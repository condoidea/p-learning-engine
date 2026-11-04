/* 第4話 劇場が閉まるといううわさ — 無人称の se・3人称複数（Dicen que…）
 * 単語帳にない語：rumor＝うわさ（男性名詞・4級以上）, gente＝人々（女性名詞・4級）, camarero・camareros＝ウエイター（名詞・4級）, actor・actores＝俳優（名詞・4級）,
 *   dicen＝decir の3人称複数（動詞・4級）, llaman＝llamar の3人称複数（動詞・4級）, llama＝llamar の3人称単数（動詞・4級）, busca・buscan＝buscar の活用（動詞・4級）,
 *   vive・viven＝vivir の活用（動詞・4級）, come・comen＝comer の活用（動詞・4級）, trabaja・trabajan＝trabajar の活用（動詞・4級）,
 *   cerrar・cierra＝閉まる（動詞・4級）, función＝上演（女性名詞・4級以上）, diciembre＝12月（男性名詞・4級）, ayuntamiento＝市役所（男性名詞・4級以上）,
 *   teatro＝劇場（男性名詞・4級）, entradas＝チケット（女性名詞・4級）, venden＝vender の3人称複数（動詞・4級）, director＝支配人（名詞・4級）, desea＝desear の3人称単数（動詞・4級以上）,
 *   cómo＝どのように（疑問詞・4級）, llamo＝llamar の1人称単数（動詞・4級）, lunes＝月曜日（男性名詞・4級）, habló＝hablar の点過去（動詞・4級）,
 *   empecé＝empezar の点過去1人称（動詞・4級以上）, problema＝問題（男性名詞・4級）, si＝もし（接続詞・4級）, pierdo＝perder の1人称（動詞・4級）,
 *   gano＝ganar の1人称（動詞・4級）, arte＝芸術（男性名詞・4級以上）, dije＝decir の点過去1人称（動詞・4級以上）, plaza＝広場（女性名詞・4級）, salvar＝守る（動詞・4級以上）,
 *   dinero＝お金（男性名詞・4級）, empezado＝empezar の過去分詞（4級）, primero＝最初に（副詞・4級） */
QF.cases.push({
  id: 'c4', no: 4, title: '劇場が閉まるといううわさ', es: 'Se dice que…', icon: '🎭',
  grammar: '無人称の se・3人称複数（Dicen que…）',
  cover: '「劇場が閉まるらしい」。ゴシップ欄のひとことが街に広がり、カフェにも劇場にも客が来なくなった。「らしい」と言ったのは、いったいだれ？',
  cast: {
    rocio: { n: 'ロシオ', es: 'Rocío', e: '👩‍🍳', role: '広場のカフェの店主' },
    costa: { n: 'コスタさん', es: 'Señor Costa', e: '🎩', role: '劇場の支配人' }
  },
  evidence: {
    lista:  { e: '📒', n: 'ロシオの帳簿', d: '月曜の朝、劇場の支配人コスタさんがカフェに来て、お客みんなと話していった。' },
    cartel: { e: '📋', n: '劇場のポスター', d: '「12月まで、毎日上演します。チケット発売中」。閉める気配はない。' },
    carta:  { e: '✉️', n: '市役所の手紙', d: '「閉まりそうな劇場には、市役所がお金を出します」。宛先は、コスタさん。' }
  },
  steps: [
    /* ---------- 編集部 ---------- */
    { t: 'scene', place: 'redaccion', cast: ['leo', 'pepa', 'ramon'] },
    { t: 'say', who: 'ramon', x: 'レオ、ゴシップ欄の見出しを見ろ。\n街じゅうが、この話でもちきりだ。' },
    { t: 'say', who: 'ramon', es: 'Se dice que el teatro va a cerrar.', x: '「劇場が閉まるといううわさだ」。\nおかげで客が来なくなった。' },
    { t: 'say', who: 'leo', x: '「言われている」…\nだれが言ったんでしょう？' },
    { t: 'say', who: 'pepa', x: 'この se は、第3話の se とくらべてみて。\nまず受身の se の文から。' },
    { t: 'note', title: '2つの se の文', rows: [
      ['[Se venden] entradas.', 'チケットが売られている。'],
      ['[Se dice] que el teatro va a cerrar.', '劇場が閉まると言われている。']] },
    { t: 'ask', q: 'Se venden entradas. で、venden が複数なのは？', o: ['entradas（物）に合わせたから', 'se に合わせたから'], a: 0,
      r: [{ t: 'say', who: 'pepa', x: '受身の se は、物が主語。\n動詞はその物に合わせるわね。' }] },
    { t: 'ask', q: 'Se dice que… の dice は単数。合わせる物は？', o: ['ない（主語がない）', 'el teatro'], a: 0,
      ng: 'el teatro は que のあとの別の文の中。dice が合わせる相手ではないわ。',
      r: [{ t: 'say', who: 'pepa', x: '合わせる物がない。主語がないの。\nこれは受身の se とは別物よ。\n現場で名前を教えるわ。' }] },
    { t: 'say', who: 'ramon', x: '出どころはカフェの噂話だ。\nまず広場のカフェに行ってこい！' },

    /* ---------- カフェ ---------- */
    { t: 'scene', place: 'cafe', cast: ['leo', 'pepa', 'rocio'] },
    { t: 'say', who: 'rocio', es: 'Hoy viene poca gente al café.', x: '今日は、お客さんが少ないの。' },
    { t: 'inspect', spots: [
      { e: '☕', n: '店主ロシオ', steps: [
        { t: 'say', who: 'rocio', es: 'En este café se come muy bien.', x: 'このカフェは、食事がおいしいのよ。' },
        { t: 'ask', q: '「食べる」のはだれ？', o: ['人はだれでも（一般の人）', '特定の一人'], a: 0 },
        { t: 'say', who: 'rocio', es: 'Aquí se vive bien.', x: 'ここは、暮らしやすい街よ。' },
        { t: 'ask', q: 'se vive の「暮らす」人は、文に書いてある？', o: ['書いていない', '書いてある'], a: 0,
          r: [{ t: 'say', who: 'pepa', x: '書いていないし、物の主語もない。\n「人は〜する」という言い方よ。' }] },
        { t: 'note', title: '無人称の se（人は〜する）', rows: [
          ['Aquí [se vive] bien.', 'ここは暮らしやすい。'],
          ['En este café [se come] muy bien.', 'このカフェは食事がおいしい。'],
          ['[Se trabaja] mucho en esta ciudad.', 'この街は、よく働く。'],
          ['¿Cómo [se dice] "gracias" en japonés?', '「gracias」は日本語でどう言う？']],
          x: '**se ＋ 動詞（いつも3人称単数）**\n主語がなく、「人は（一般に）〜する」。((無人称の se)) と呼ぼう。',
          why: 'se ＋ 動詞は「だれでもない人が〜する」。\n動詞が合わせる主語がないから、いつも単数のまま。\n受身の se との見分けは「動詞が合わせる物があるか」よ。' },
        { t: 'ask', q: '___ に入るのは？', es: 'Se ___ mucho en esta ciudad.', o: ['trabaja', 'trabajan', 'trabajo'], a: 0,
          ng: '主語がないから、動詞は単数のまま。' },
        { t: 'who', q: 'この文で、暮らしているのは？', es: 'Aquí se vive bien.', ja: 'ここは暮らしやすい。', o: ['por', 'alguien', 'estado', 'gente'], a: 3,
          ng: '特定の人でも、物の主語でもない。一般の人よ。',
          r: [{ t: 'tip', title: 'gente（人々）', x: 'ここの「やった人」は **gente**＝人はだれでも（一般の人）。\n__特定の人でも、書かれていない「だれか」でもない。__' }] }
      ] },
      { e: '🪧', n: '貼り紙', steps: [
        { t: 'say', who: 'rocio', es: 'Se buscan camareros.', x: 'ウエイター募集の貼り紙ね。' },
        { t: 'ask', q: 'buscan が複数なのは、どの語に合わせたから？', o: ['camareros', 'se'], a: 0,
          r: [{ t: 'say', who: 'pepa', x: 'camareros は「だれでもいいウエイター」。\nだれと決まっていない人は、物と同じあつかい。\nだから受身の se（第3話）になるの。' }] },
        { t: 'say', who: 'rocio', es: 'Se busca a los dos actores del teatro.', x: 'こっちは、劇場の2人の俳優をさがしてる貼り紙。' },
        { t: 'ask', q: '___ に入るのは？（予想してみて）', es: 'Se ___ a los dos actores.', o: ['busca', 'buscan'], a: 0,
          ng: 'a が付いているわ。a ＋ 人は何の目印かしら。',
          r: [{ t: 'say', who: 'pepa', x: '人が複数なのに、単数の busca。\nなぜか、見ていくわよ。' }] },
        { t: 'note', title: '人が目的語のときは a', rows: [
          ['Se [busca a] los dos actores.', '2人の俳優をさがしている。'],
          ['Se [buscan] camareros.', 'ウエイターが募集されている。']],
          x: '**人が目的語なら a が付き、動詞は単数のまま。**\na なし＋物あつかい → 受身の se（動詞は複数）。',
          why: 'a が付くのは、だれと決まった人（この2人の俳優）。\nだれでもいいウエイターには、a は付かない。\na ＋ 人は「〜を」の目印。主語ではないの。\n主語がないから、動詞が合わせる相手もない。\nだから busca は単数のままなのよ。' },
        { t: 'tap', q: 'busca が単数のままなのは、どの語があるから？', es: 'Se busca a los dos actores.', ja: '2人の俳優をさがしている。', a: ['a'],
          ng: '「〜を」の目印になる、小さな語よ。',
          r: [{ t: 'say', who: 'pepa', x: 'そう、a。a ＋ 人は目的語。\n主語ではないから、動詞は合わせないの。' }] },
        { t: 'who', q: 'この文で、さがしているのは？', es: 'Se busca a los dos actores.', ja: '2人の俳優をさがしている。', o: ['por', 'alguien', 'estado', 'gente'], a: 3 },
        { t: 'who', q: 'では、この文は？', es: 'Se buscan camareros.', ja: 'ウエイターが募集されている。', o: ['por', 'alguien', 'estado', 'gente'], a: 1,
          ng: '受身の se は「書いていないだれか」だったわね。' }
      ] },
      { e: '👂', n: 'お客の声', steps: [
        { t: 'say', who: 'rocio', es: 'Dicen que el teatro va a cerrar.', x: 'みんな「劇場が閉まるそうだ」って言うのよ。' },
        { t: 'ask', q: 'Dicen（動詞は複数）の「言っている人」に、話しているロシオ自身は入る？', o: ['入らない（ほかの人たち）', '入る'], a: 0 },
        { t: 'note', title: '3人称複数の無人称', rows: [
          ['[Dicen] que el teatro va a cerrar.', '劇場が閉まるそうだ。'],
          ['[Llaman] a la puerta.', 'だれかがドアをノックしている。']],
          x: '**動詞を3人称複数にする**と、「だれかが・人々が〜する」。\n言っている自分たちは**ふくまない**。',
          why: '主語を言わずに、動詞だけ複数にするの。\nse を使わないぶん、「ほかの人たちが」という感じが強いわ。' },
        { t: 'ask', q: '___ に入るのは？（だれかがドアをノックしている）', es: '___ a la puerta.', o: ['Llaman', 'Llama', 'Llamo'], a: 0 },
        { t: 'who', q: 'この文で、言っているのは？', es: 'Dicen que el teatro va a cerrar.', ja: '劇場が閉まるそうだ。', o: ['por', 'alguien', 'estado', 'gente'], a: 3,
          r: [{ t: 'say', who: 'pepa', x: '一般の人たち。gente ね。' }] },
        { t: 'say', who: 'rocio', es: 'El lunes el señor Costa habló con todos aquí.', x: '月曜に、支配人のコスタさんがここで\nみんなと話していったわ。' },
        { t: 'get', ev: 'lista' }
      ] }
    ] },

    /* ---------- 編集部（原稿） ---------- */
    { t: 'scene', place: 'redaccion', cast: ['leo', 'pepa', 'tito'] },
    { t: 'say', who: 'pepa', x: 'ここまでを、見分けの手順にまとめるわ。' },
    { t: 'flow', upto: 4 },
    { t: 'say', who: 'pepa', x: '迷ったら「動詞が合わせる物があるか」。\nない？ ならいつも単数よ。' },
    { t: 'ask', q: 'Aquí se vive bien. の se は？', o: ['受身の se（物が主語）', '無人称の se（主語がない）'], a: 1,
      ng: 'vive が合わせる物は、文の中にあるかしら。' },
    { t: 'say', who: 'tito', x: '先輩！ 貼り紙の記事を\n先に原稿にしておきました！' },
    { t: 'redpen', q: 'ティトの原稿に、まちがいが1つ。', es: 'Se buscan a los dos actores.', bad: 'buscan', o: ['busca', 'buscas', 'busco'], a: 0, fix: 'Se busca a los dos actores.',
      ng: 'a ＋ 人は目的語。主語ではないわ。',
      r: [{ t: 'say', who: 'pepa', x: 'a ＋ 人なら動詞は単数。\nbuscan は物が主語のときだけよ。' }] },
    { t: 'say', who: 'leo', x: 'コスタさんに、直接聞いてみます！' },

    /* ---------- 劇場（対決） ---------- */
    { t: 'scene', place: 'teatro', cast: ['leo', 'pepa'], duel: true },
    { t: 'enter', who: 'costa' },
    { t: 'say', who: 'costa', es: 'Soy el director del teatro. ¿Qué desea?', x: '劇場の支配人だ。なんの用かね？' },
    { t: 'say', who: 'leo', x: '入口のポスターに、チケット発売中と\n書いてあります。メモしておこう。' },
    { t: 'get', ev: 'cartel' },
    { t: 'testimony', who: 'costa', title: '閉まる話', hint: '入口のポスターを見てみて。', lines: [
      { es: 'Yo no sé nada del rumor.', ja: 'うわさのことは、何も知らない。',
        press: [{ t: 'say', who: 'costa', es: 'Nada. Solo se dice, se dice...', x: '何も。ただ、言われてるだけだ。' }] },
      { es: 'Es verdad: el teatro va a cerrar pronto.', ja: '本当だよ。劇場はもうすぐ閉まる。', ok: ['cartel'],
        press: [{ t: 'say', who: 'costa', es: 'Sí, muy pronto. No hay dinero.', x: 'ああ、もうすぐだ。お金がない。' }] },
      { es: 'Dicen que yo lo inventé. ¡No es verdad!', ja: '私が言い出したと言われるが、うそだ！' }
    ], after: [
      { t: 'say', who: 'leo', x: 'ポスターには、12月まで毎日上演、\nチケット発売中とあります！' },
      { t: 'ask', q: '「Se venden entradas hasta diciembre.」で、venden が複数の理由は？', o: ['entradas に合わせたから', '主語がないから'], a: 0,
        r: [{ t: 'say', who: 'leo', es: 'El teatro no va a cerrar.', x: '劇場は、閉まりません！' }] },
      { t: 'say', who: 'costa', es: 'Bueno... el dinero sí es un problema.', x: 'う…。だが、お金の問題はあるんだ。' }
    ] },
    { t: 'say', who: 'leo', x: '支配人の机の上に、市役所の手紙が\nありました。これもメモしよう。' },
    { t: 'get', ev: 'carta' },
    { t: 'testimony', who: 'costa', title: 'お金のこと', hint: '市役所からの手紙の中身は？', lines: [
      { es: 'Si el teatro cierra, yo pierdo mi trabajo.', ja: '劇場が閉まったら、私は仕事を失う。' },
      { es: 'Yo no gano nada con el rumor.', ja: 'うわさで得することなど、何もない。', ok: ['carta'],
        press: [{ t: 'say', who: 'costa', es: 'Nada, nada de nada.', x: '何も。何ひとつな。' }] },
      { es: 'Aquí se trabaja mucho por el arte.', ja: 'ここは、芸術のためによく働く場所だ。' }
    ], after: [
      { t: 'say', who: 'leo', x: '市役所は、閉まりそうな劇場に\nお金を出すと手紙に書いています！' },
      { t: 'ask', q: 'つまり、劇場が「閉まりそう」だと、得をするのは？', o: ['支配人のコスタさん', 'カフェのお客'], a: 0,
        r: [{ t: 'say', who: 'leo', x: 'うわさを広めれば、お金がもらえる。\nだから流したんですね。' }] },
      { t: 'say', who: 'costa', es: '¡No, no! Yo no dije nada.', x: 'ち、ちがう！ 私は何も言っていない！' }
    ] },
    { t: 'contra', who: 'costa', title: 'カフェのこと', hint: '帳簿には、月曜の朝のことが書いてあるわ。', lines: [
      { es: 'Yo nunca voy al café de la plaza.', ja: '私は広場のカフェには行かない。' },
      { es: 'En el teatro se trabaja todos los días.', ja: '劇場は、毎日働く場所だ。' },
      { es: 'El lunes hablé con todos en el café.', ja: '月曜に、カフェでみんなと話した。' }
    ], a: [0, 2], after: [
      { t: 'say', who: 'leo', x: 'カフェには行かないのに、\n月曜にみんなと話した…？' },
      { t: 'say', who: 'pepa', x: '「Dicen que…（〜と言われている）」の\n言い出した人は、あなた自身だったのね。' },
      { t: 'say', who: 'costa', es: 'Está bien. Yo lo dije primero.', x: '…わかった。最初に言ったのは私だ。' }
    ] },
    { t: 'interp', es: 'Dicen que el teatro va a cerrar.', ja: '私たちは、劇場が閉まると言っている。',
      o: ['私たちは、劇場が閉まると言っている。', '劇場が閉まるそうだ。', '劇場が、閉まると言っている。'], a: 1,
      ng: 'Dicen の「言っている人」に、話している私たちは入らない。',
      after: [{ t: 'say', who: 'tito', x: 'す、すみません！ 「私たちが言う」ではなくて\n「ほかの人たちが言う」でした。' }] },
    { t: 'who', q: '最後に、うわさの文を確かめよう。言っているのは？', es: 'Se dice que el teatro va a cerrar.', ja: '劇場が閉まるといううわさだ。', o: ['por', 'alguien', 'estado', 'gente'], a: 3 },
    { t: 'build', q: 'とどめの一言を組み立てよう：「劇場が閉まると言ったのは、あなたです！」', es: 'Usted dijo que el teatro va a cerrar.', x: ['dicen', 'se'],
      r: [{ t: 'slam', txt: '¡Usted lo dijo!' }] },
    { t: 'say', who: 'costa', es: 'Lo siento... Quiero salvar el teatro.', x: 'すまない…。劇場を守りたかったんだ。' },
    { t: 'say', who: 'rocio', es: '¡Qué bien! Ahora viene más gente al café.', x: 'よかった！ カフェにも人がもどるわ。' },
    { t: 'scoop', txt: 'うわさの出どころは、劇場の支配人', es: 'El rumor fue inventado por el director del teatro.' },
    { t: 'say', who: 'pepa', x: 'おみごと。\n「Dicen que…」の「だれ」も、\nちゃんと見つけたわね。' }
  ]
});
