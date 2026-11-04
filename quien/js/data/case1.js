/* 第1話 盗まれた絵 — ser ＋ 過去分詞 ＋ por（受身）・過去分詞の作り方・性数の一致 */
QF.cases.push({
  id: 'c1', no: 1, title: '盗まれた絵', es: 'El cuadro robado', icon: '🖼',
  grammar: 'ser ＋ 過去分詞 ＋ por',
  cover: '街の美術館から、一枚の絵が消えた。ライバル紙の記事は「絵が盗まれた」とだけ。だれが盗んだのかは、どこにも書いていない。',
  cast: {
    lucia: { n: 'ルシア', es: 'Lucía', e: '👩', role: '美術館のガイド' },
    gil: { n: 'ヒルさん', es: 'Señor Gil', e: '👮', role: '美術館の警備員' }
  },
  evidence: {
    placa:   { e: '🏷', n: '絵の札', d: '「この絵は 1920 年に、ローサ・ベラによって描かれた」。' },
    ventana: { e: '🪟', n: '割れた窓', d: 'ガラスの破片は、窓の**外**の道に落ちていた。' },
    llave:   { e: '🔑', n: '鍵の記録', d: '夜 11 時に入口のドアを開けたのは、警備員ヒルさんの鍵。館長の鍵は使われていない。' }
  },
  steps: [
    /* ---------- 編集部 ---------- */
    { t: 'scene', place: 'redaccion', cast: ['leo', 'pepa', 'ramon'] },
    { t: 'say', who: 'ramon', x: 'レオ、ライバル紙の朝刊だ。\n美術館の絵が消えたらしい。' },
    { t: 'say', who: 'ramon', es: 'El cuadro fue robado anoche.', x: '「絵は、ゆうべ盗まれた」…\nで、だれが盗んだんだ？' },
    { t: 'say', who: 'leo', x: '…書いてありませんね。' },
    { t: 'say', who: 'pepa', x: 'この記事は、やった人を文から消す\n言い方をしているの。\nまず、ふつうの文とくらべてみましょう。' },
    { t: 'note', title: 'ふつうの文と、受身の文', rows: [
      ['Un ladrón robó el cuadro.', 'どろぼうが、絵を盗んだ。'],
      ['El cuadro [fue robado por] un ladrón.', '絵は、どろぼうに盗まれた。']] },
    { t: 'ask', q: '2つの文で、盗まれた物は？', o: ['el cuadro（絵）', 'un ladrón（どろぼう）'], a: 0 },
    { t: 'ask', q: '下の文で、文の頭（主語）に来ているのは？', es: 'El cuadro fue robado por un ladrón.', o: ['el cuadro（絵）', 'un ladrón（どろぼう）'], a: 0,
      r: [{ t: 'say', who: 'pepa', x: 'そう。盗まれた絵が、文の頭に出た。\nどろぼうは、por のうしろに下がったわ。' }] },
    { t: 'ask', q: '盗んだ（robó）の部分は、どう変わった？', es: 'El cuadro fue robado por un ladrón.', o: ['fue robado', 'por un', 'el cuadro'], a: 0,
      r: [{ t: 'say', who: 'pepa', x: 'robó が「fue robado」になった。\nfue は ser（〜である）の過去の形よ。' }] },
    { t: 'note', title: '受身の文（〜される）', rows: [
      ['El cuadro [fue robado por] un ladrón.', '絵は、どろぼうに盗まれた。']],
      x: '**ser ＋ 過去分詞 ＋ por ＋ やった人**\nrobado は robar（盗む）の((過去分詞))。「盗まれた」の形。\nやった人は **por のあと**にいる。',
      why: 'ser は「〜である」。robado は「盗まれた（状態の）」。\nつなげると「盗まれた状態である」＝「盗まれた」。\nだから ser ＋ 過去分詞で「〜される」になるの。' },
    { t: 'who', q: 'この文で、盗んだのは？', es: 'El cuadro fue robado por un ladrón.', ja: '絵は、どろぼうに盗まれた。', o: ['por', 'alguien'], a: 0,
      r: [{ t: 'say', who: 'pepa', x: 'por un ladrón。por のあとに書いてある。' }] },
    { t: 'who', q: 'では、ライバル紙の文では？', es: 'El cuadro fue robado anoche.', ja: '絵は、ゆうべ盗まれた。', o: ['por', 'alguien'], a: 1,
      ng: 'por があるか、文をもう一度見て。',
      r: [{ t: 'say', who: 'pepa', x: 'por がないから、やった人は書いていない。\n「だれか」が盗んだ、ということね。' }] },
    { t: 'flow', upto: 1 },
    { t: 'say', who: 'pepa', x: 'これが、わたしの「見分けの手順」。\n事件ごとに1段ずつ増やしていくわ。' },
    { t: 'say', who: 'ramon', x: '「だれか」じゃ記事にならん。\nレオ、美術館へ行ってこい！' },

    /* ---------- 美術館 ---------- */
    { t: 'scene', place: 'museo', cast: ['leo', 'pepa', 'lucia'] },
    { t: 'say', who: 'lucia', es: 'Buenos días. Soy Lucía, la guía del museo.', x: 'おはようございます。美術館のガイドのルシアです。' },
    { t: 'inspect', spots: [
      { e: '🏷', n: '絵の札', steps: [
        { t: 'say', who: 'lucia', es: 'El cuadro fue pintado por Rosa Vela en 1920.', x: 'その絵は 1920 年に、\nローサ・ベラによって描かれました。' },
        { t: 'get', ev: 'placa' },
        { t: 'ask', q: 'pintado は pintar（描く）の過去分詞。-ar の動詞はどうなった？', o: ['-ar → -ado', '-ar → -ido'], a: 0 },
        { t: 'note', title: '過去分詞の作り方', rows: [
          ['pintar → pintado', '描く → 描かれた'],
          ['vender → vendido', '売る → 売られた'],
          ['comer → comido', '食べる → 食べられた']],
          x: '**-ar → -ado　-er・-ir → -ido**' },
        { t: 'ask', q: 'comprar（買う）の過去分詞は？', o: ['comprado', 'comprido', 'compraso'], a: 0,
          ng: 'comprar は -ar の動詞。' },
        { t: 'ask', q: 'conocer（知る）の過去分詞は？', o: ['conocado', 'conocido', 'conoceso'], a: 1,
          ng: 'conocer は -er の動詞。',
          r: [{ t: 'say', who: 'pepa', x: 'そう。-er と -ir は、どちらも -ido よ。' }] }
      ] },
      { e: '🪟', n: '割れた窓', steps: [
        { t: 'say', who: 'lucia', es: 'La ventana fue rota anoche.', x: 'この窓は、ゆうべ割られました。' },
        { t: 'ask', q: 'rota の元の動詞は、romper（割る・こわす）。-er なのに…？', o: ['-ido になっていない', '-ado になっている'], a: 0,
          r: [{ t: 'say', who: 'pepa', x: 'そう、rompido にはならない。\nこういう形の動詞が、少しだけあるの。' }] },
        { t: 'note', title: '形が変わる過去分詞', rows: [
          ['romper → roto', '割る → 割られた'],
          ['abrir → abierto', '開ける → 開けられた'],
          ['escribir → escrito', '書く → 書かれた'],
          ['hacer → hecho', 'する・作る → 作られた'],
          ['ver → visto', '見る → 見られた'],
          ['poner → puesto', '置く → 置かれた'],
          ['decir → dicho', '言う → 言われた'],
          ['volver → vuelto', 'もどる → （もどった）']],
          x: '**よく使う動詞ほど、形が変わる。**\n数は少ないから、この8つは覚えてしまおう。',
          why: 'スペイン語の元になったラテン語の、古い形が残ったもの。\nよく使う言葉ほど、昔の形のまま残りやすいの。' },
        { t: 'ask', q: 'escribir（書く）の過去分詞は？', o: ['escribido', 'escrito', 'escribado'], a: 1 },
        { t: 'say', who: 'leo', x: 'ガラスの破片が、窓の外の道に\n落ちていますね。' },
        { t: 'get', ev: 'ventana' }
      ] },
      { e: '🚪', n: '入口のドア', steps: [
        { t: 'say', who: 'lucia', es: 'La puerta fue abierta a las once.', x: '入口のドアは、11時に開けられました。' },
        { t: 'ask', q: '「割られた窓」は rota、「開けられたドア」は abierta。どちらも -a で終わるのは？', o: ['ventana も puerta も女性名詞だから', 'ゆうべの話だから'], a: 0 },
        { t: 'note', title: '過去分詞は、主語に合わせる', rows: [
          ['El cuadro [fue robado].', '絵は盗まれた。'],
          ['La puerta [fue abierta].', 'ドアは開けられた。'],
          ['Los cuadros [fueron robados].', '絵（複数）は盗まれた。'],
          ['Las puertas [fueron abiertas].', 'ドア（複数）は開けられた。']],
          x: '**過去分詞は、形容詞と同じように主語の性・数に合わせる。**\n主語が複数なら、ser も複数（fueron）。' },
        { t: 'tap', q: 'fueron が複数の形なのは、どの語に合わせたから？', es: 'Las ventanas fueron rotas por un ladrón.', ja: '窓（複数）は、どろぼうに割られた。', a: ['ventanas'],
          ng: 'ser と過去分詞は、文の頭の主語に合わせる。',
          r: [{ t: 'say', who: 'pepa', x: 'そう。主語の ventanas に合わせて、\nfueron も rotas も複数になるの。' }] },
        { t: 'ask', q: '___ に入るのは？', es: 'Las puertas fueron ___ por el guardia.', o: ['abierto', 'abiertas', 'abiertos'], a: 1,
          ng: 'las puertas は女性・複数。' },
        { t: 'say', who: 'lucia', es: 'La llave de la puerta es del señor Gil.', x: 'そのドアの鍵は、警備員のヒルさんが持っています。' },
        { t: 'get', ev: 'llave' }
      ] }
    ] },

    /* ---------- 編集部（原稿） ---------- */
    { t: 'scene', place: 'redaccion', cast: ['leo', 'pepa', 'tito'] },
    { t: 'say', who: 'tito', x: '先輩！ 窓のことを\n先に原稿にしておきました！' },
    { t: 'redpen', q: 'ティトの原稿に、まちがいが1つ。', es: 'La ventana fue roto por un ladrón.', bad: 'roto', o: ['rota', 'rotos', 'rompida'], a: 0, fix: 'La ventana fue rota por un ladrón.',
      ng: 'la ventana は女性名詞。過去分詞も合わせる。',
      r: [{ t: 'say', who: 'pepa', x: 'la ventana は女性だから rota。\n過去分詞も主語に合わせる、だったわね。' }] },
    { t: 'say', who: 'leo', x: 'でも、本当にどろぼうが\n外から割ったのかな…' },

    /* ---------- 美術館（対決） ---------- */
    { t: 'scene', place: 'museo', cast: ['leo', 'pepa'], duel: true },
    { t: 'enter', who: 'gil' },
    { t: 'say', who: 'gil', es: 'Soy el guardia del museo. ¿Qué quiere usted?', x: '警備員だ。なんの用だね？' },
    { t: 'say', who: 'pepa', x: 'ここからは対決よ。\n気になる発言は「¿De verdad?」でつっこんで、\nおかしな発言には「¡No cuadra!」で\nメモをつきつけて！' },
    { t: 'testimony', who: 'gil', title: 'ゆうべのこと', hint: 'ドアを開けた鍵の記録を見てみて。', lines: [
      { es: 'Anoche yo estaba en la entrada.', ja: 'ゆうべ、わたしは入口にいた。',
        press: [{ t: 'say', who: 'gil', es: 'Sí, toda la noche.', x: 'ああ、ひと晩じゅうな。' }] },
      { es: 'A las once, la puerta fue abierta por el director.', ja: '11時に、ドアは館長によって開けられた。', ok: ['llave'],
        press: [{ t: 'say', who: 'gil', es: 'Sí, el director vino a las once.', x: 'そう、館長が11時に来たんだ。' }, { t: 'say', who: 'pepa', x: 'por のあとが「館長」。\nほんとうに館長が開けたのかしら…' }] },
      { es: 'Yo no vi nada.', ja: 'わたしは何も見ていない。' }
    ], after: [
      { t: 'say', who: 'leo', x: '鍵の記録では、11時にドアを開けたのは\nあなたの鍵です。館長の鍵は使われていない！' },
      { t: 'ask', q: '記録どおりに言うと？', o: ['La puerta fue abierta por el director.', 'La puerta fue abierta por el señor Gil.', 'El señor Gil fue abierto por la puerta.'], a: 1,
        ng: 'ドアを開けたのはだれの鍵？ その人を por のあとに。',
        r: [{ t: 'say', who: 'leo', es: '¡La puerta fue abierta por usted!', x: 'ドアは、あなたが開けたんです！' }] },
      { t: 'say', who: 'gil', es: 'Bueno... sí. Pero el ladrón entró por la ventana.', x: 'ま、まあな。だが、どろぼうは窓から入ったんだ。' }
    ] },
    { t: 'testimony', who: 'gil', title: '割れた窓', hint: 'ガラスの破片は、どこに落ちていた？', lines: [
      { es: 'Yo abrí la puerta para mirar las salas.', ja: '部屋を見回るために、ドアを開けただけだ。' },
      { es: 'La ventana fue rota por un ladrón de fuera.', ja: '窓は、外から来たどろぼうに割られた。', ok: ['ventana'],
        press: [{ t: 'say', who: 'gil', es: 'Sí, de fuera. Seguro.', x: 'そう、外からだ。まちがいない。' }] },
      { es: 'Por eso, el cuadro fue robado por esa persona.', ja: 'だから、絵はその人物に盗まれたんだ。' }
    ], after: [
      { t: 'say', who: 'leo', x: '外から割ったなら、ガラスは中に落ちる。\nでも破片は、外の道に落ちていた！' },
      { t: 'ask', q: 'つまり窓は、どこから割られた？', o: ['外から（de fuera）', '中から（desde dentro）'], a: 1,
        r: [{ t: 'say', who: 'leo', es: 'La ventana fue rota desde dentro.', x: '窓は、中から割られたんです！' }] },
      { t: 'say', who: 'gil', es: '¡No, no! Yo no hice nada.', x: 'ち、ちがう！ わたしは何もしていない！' }
    ] },
    { t: 'interp', es: 'El cuadro fue robado por el guardia.', ja: '警備員は、絵を盗まれた。',
      o: ['警備員は、絵を盗まれた。', '絵は、警備員に盗まれた。', '警備員は、絵を盗もうとした。'], a: 1,
      ng: '主語は el cuadro。por のあとが、やった人。',
      after: [{ t: 'say', who: 'tito', x: 'す、すみません！ 主語は el cuadro、\n盗んだのは por のあとの警備員…でした。' }] },
    { t: 'who', q: '最後に、記事の文を確かめよう。盗んだのは？', es: 'El cuadro fue robado por el guardia.', ja: '絵は、警備員に盗まれた。', o: ['por', 'alguien'], a: 0 },
    { t: 'build', q: 'とどめの一言を組み立てよう：「絵は、あなたに盗まれた！」', es: 'El cuadro fue robado por usted.', x: ['robó', 'robada'],
      r: [{ t: 'slam', txt: '¡Por usted!' }] },
    { t: 'say', who: 'gil', es: 'Lo siento... El cuadro está en mi casa.', x: 'すまない…。絵は、わたしの家にある。' },
    { t: 'say', who: 'lucia', es: '¡Qué bien! El cuadro vuelve al museo.', x: 'よかった！ 絵が美術館にもどってくるのね。' },
    { t: 'scoop', txt: '消えた絵、警備員が持ち出す', es: 'El cuadro fue robado por el guardia del museo.' },
    { t: 'say', who: 'pepa', x: 'おみごと。\nser ＋ 過去分詞 ＋ por、もうばっちりね。' }
  ]
});
