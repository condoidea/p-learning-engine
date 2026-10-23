/* 第5話 いちばん重い本 — 最上級（el / la / los / las ＋ más ＋ 形容詞 ＋ de、el mejor / el mayor … de）
 *
 *  ■ shared/es-words.js に「まだない語」  形: 語 / 意味 / 品詞 / 級(5=5級, 4=4級, 3=4級より上)  ＋ 出てきた活用形
 *    biblioteca / 図書館 / n / 4            （bibliotecaria＝司書）
 *    bosque / 森 / n / 5
 *    hormiga / アリ / n / 4                 （hormigas）
 *    ardilla / リス / n / 4
 *    azúcar / 砂糖 / n / 4
 *    grano / つぶ・粒 / n / 4               （granos）
 *    estante / 棚 / n / 4
 *    ladrón / どろぼう / n / 4
 *    lector / 読書家・読む人 / n / 4
 *    visitante / 来館者・訪問者 / n / 4      （visitantes）
 *    poema / 詩 / n / 3                     （poemas）
 *    cuento / 童話・短い物語 / n / 4
 *    atlas / 地図帳 / n / 3
 *    kilo / キロ / n / 5                    （kilos）
 *    fuerte / 強い / adj / 5
 *    pesado / 重い / adj / 4
 *    ligero / 軽い / adj / 4                （ligeros）
 *    alto / 高い / adj / 5                  （第1話と共通）
 *    ancho / はばが広い / adj / 4           （ancha）
 *    mayor / 年上の・いちばん年上の / adj / 4
 *    menor / 年下の・いちばん年下の / adj / 4
 *    mejor / よりよい・最もよい / adj / 5
 *    único / ただ1つの / adj / 4            （única）
 *    solo / ただ〜だけ / adv / 5
 *    anoche / ゆうべ / adv / 4
 *    claro / もちろん / adv / 5
 *    tan・tanto / 〜なほど・それほど / adv / 0  （tantos）
 *    menos / より少ない・〜ほど…ない / adv / 0
 *    entrar / 入る / v / 5                  （entró）
 *    pasar / 通る・過ぎる / v / 5            （pasó）
 *    cerrar / 閉める / v / 5                （cerré）
 *    tomar / とる・持っていく / v / 5        （tomé）
 *    pesar / 重さがある / v / 4              （pesa）
 *    amar / 大好きだ・愛する / v / 4         （amamos）
 *    devolver / 返す・もどす / v / 4         （devolvemos）
 *    cuatro・ocho・treinta・mil / 4・8・30・1000 / num / 5
 *    nosotras / 私たち（女性） / pron / 0
 *    ※ 活用形だけ足す：abrir（abierta）、ser（son, fue, somos）、estar（estaba, estuve）、ir（voy）、sentir（siento＝lo siento）、
 *      como・del・pero・hasta・eso・esa・sí は機能語として 0 級で
 *    ※ 登録ずみ：libro, ratón, mono, elefante, ventana, pequeño, grande, tortuga, llave, ayudar など
 *
 *  ■ 文法の流れ：グラフのいちばん高い棒 → el más … de → 範囲は de（del）→ 名詞を入れる → la / las（性数）→ el mayor / el mejor
 *  ■ 復習：más…que・menos…que（第1話）、tanto…como（第2〜4話の形）、mayor / mejor（第3話）
 */
PQ.cases.push({
  id: 'c5', no: 5, title: 'いちばん重い本', es: 'El libro más pesado', icon: '📚',
  grammar: 'el / la más ＋ 形容詞 ＋ de',
  cover: '図書館の「いちばん重い本」が消えた。つかまったのは、森でいちばん力もちのゾウのパンチョ。',
  cast: {
    ardilla:  { n: 'リスの司書さん', es: 'Señora Ardilla', e: '🐿', role: '司書・リス' },
    elefante: { n: 'パンチョ', es: 'Pancho', e: '🐘', role: '被告・ゾウ' },
    mono:     { n: 'モノさん', es: 'Señor Mono', e: '🐒', role: '証人・本好き' },
    hormiga:  { n: 'ヒルダ', es: 'Hilda', e: '🐜', role: 'アリたちのリーダー' }
  },
  evidence: {
    libro:   { e: '📘', n: 'いちばん重い本', d: 'El libro del azúcar（砂糖の本）。重さ 30 kg。いちばん上の棚にあった。' },
    ventana: { e: '🪟', n: 'ひとつだけ開いた窓', d: '夜はドアに鍵。開いていたのは、図書館でいちばん小さな窓だけ。はば 5 cm。' },
    azucar:  { e: '🍬', n: '窓のさんの砂糖', d: '窓のさんに、1 mm の小さな足あとと砂糖のつぶ。つぶは 100 こ。棚の下にも 100 こ。' },
    medidas: { e: '📏', n: '入口の体の幅の表', d: 'きのうの来館者の体の幅。ゾウ 200 cm、サル 40 cm、ネズミ 8 cm、アリ 1 cm。' },
    mono:    { e: '🐒', n: '証人モノ', d: '本好きのサル。きのうは夜の8時まで図書館で本を読んでいた。' }
  },
  steps: [
    /* ---------- 事務所 ---------- */
    { t: 'scene', place: 'office', cast: ['nico', 'mimi'] },
    { t: 'say', who: 'mimi', x: 'ニコ先生、第5話の依頼だよ！\nゾウのパンチョくんが、つかまったって。' },
    { t: 'say', who: 'nico', x: '図書館の本が消えたんだね。\nよし、まずは現場へ行こう。' },

    /* ---------- 図書館 ---------- */
    { t: 'scene', place: 'biblioteca', cast: ['nico', 'mimi', 'ardilla', 'elefante'] },
    { t: 'say', who: 'ardilla', es: '¡El libro grande no está!', x: '大きな本がないのよ！' },
    { t: 'say', who: 'elefante', es: '¡Yo no tomé el libro!', x: 'ぼくは本をとってないよ！' },
    { t: 'say', who: 'mimi', x: '消えたのは、図書館の「いちばん重い本」。\n今日は「いちばん」の言い方がカギだよ。\nまず調べてみよう！' },
    { t: 'inspect', spots: [
      { e: '📚', n: '本棚', steps: [
        { t: 'say', who: 'ardilla', es: 'El libro estaba arriba.', x: 'あの本は、いちばん上の棚にあったの。' },
        { t: 'chart', title: '本の重さ', unit: 'kg', bars: [
          { e: '📘', n: '砂糖の本', v: 30 }, { e: '🗺', n: '地図帳', v: 12 }, { e: '📖', n: '童話集', v: 3 }, { e: '📜', n: '詩集', v: 1 }] },
        { t: 'ask', q: 'グラフを見て。いちばん高い棒はどれ？', o: ['📘 砂糖の本', '🗺 地図帳', '📖 童話集', '📜 詩集'], a: 0 },
        { t: 'say', who: 'mimi', x: '前の話の「más ＋ 形容詞 ＋ que」は、\n2つをくらべる言い方だったね。\n3つ以上の「いちばん」は、どうなると思う？' },
        { t: 'ask', q: 'más pesado の前に足すと「いちばん」になるのは？', o: ['el（冠詞）', 'tan', 'menos'], a: 0,
          ng: '日本語の「その〜」のように、1つに決めるときに使う語だよ。',
          r: [{ t: 'say', who: 'mimi', es: 'El libro del azúcar es el más pesado.', x: '砂糖の本は、いちばん重い。' }] },
        { t: 'note', title: 'いちばん〜', rows: [
          ['El libro del azúcar es [el más pesado].', '砂糖の本は、いちばん重い。'],
          ['Los poemas son [los más ligeros].', '詩集は、いちばん軽い。']],
          x: '**el / la / los / las ＋ más ＋ 形容詞**＝いちばん〜\nmás … que から que をとって、前に冠詞を置いた形。' },
        { t: 'ask', q: '___ に入るのは？', es: 'Los poemas son ___ más ligeros.', o: ['el', 'la', 'los'], a: 2,
          ng: 'poemas は男性の複数だよ。冠詞も合わせる。',
          r: [{ t: 'say', who: 'mimi', x: 'そう、主語が複数なら los。\nligeros も複数になっているね。' }] },
        { t: 'say', who: 'mimi', x: 'つぎは「何の中で」いちばんか。\n「図書館の中で」と言いたいとき、\n英語では in だったよね…。' },
        { t: 'ask', q: '予想してみよう。どっちが入ると思う？', es: 'el más pesado ___ la biblioteca', o: ['en', 'de'], a: 1,
          ng: '英語の in につられないで。スペイン語は「〜の（中で）」と考える。',
          r: [{ t: 'say', who: 'mimi', es: 'Es el más pesado de la biblioteca.', x: '図書館でいちばん重い。' }] },
        { t: 'tip', title: '範囲は de', x: '「〜の中でいちばん」は **de ＋ 範囲**。\nen は使わない。\nde los cuatro（4つの中で）もよく使うよ。',
          why: '最上級は「その仲間の中から いちばんを取り出す」言い方。「〜の（仲間の）」にあたる de を使うんだよ。英語の in につられやすいので注意。' },
        { t: 'ask', q: '「いちばん重い本」と言いたい。名詞 libro はどこに入る？', o: ['el libro más pesado', 'el más libro pesado', 'más el libro pesado'], a: 0,
          ng: '冠詞のすぐあとに名詞が来るよ。',
          r: [{ t: 'say', who: 'mimi', x: '名詞は冠詞のすぐあと。\n「冠詞 ＋ 名詞 ＋ más ＋ 形容詞」だね。' }] },
        { t: 'note', title: '名詞を入れる', rows: [
          ['Es [el libro más pesado] de la biblioteca.', '図書館でいちばん重い本だ。'],
          ['Es [el libro más ligero] de los cuatro.', '4冊でいちばん軽い本だ。']],
          x: '**el ＋ 名詞 ＋ más ＋ 形容詞 ＋ de ＋ 範囲**\n名詞があっても、ならびは同じ。' },
        { t: 'get', ev: 'libro' }
      ] },
      { e: '🪟', n: '窓', steps: [
        { t: 'say', who: 'mimi', x: 'ドアには夜、鍵がかかっていた。\n開いていた窓は、1つだけだって。' },
        { t: 'chart', title: '図書館の窓のはば', unit: 'cm', bars: [
          { e: '🪟', n: '大窓', v: 120 }, { e: '🪟', n: '東の窓', v: 60 }, { e: '🪟', n: '小窓', v: 5 }], hi: [2] },
        { t: 'ask', q: 'いちばんはばがせまい窓は？', o: ['🪟 大窓', '🪟 東の窓', '🪟 小窓'], a: 2 },
        { t: 'say', who: 'mimi', x: 'ventana は女性の名詞。\n「いちばん小さい窓」は…？' },
        { t: 'ask', q: '___ に入るのは？', es: '___ ventana más pequeña de la biblioteca', o: ['El', 'La', 'Las'], a: 1,
          ng: 'ventana は女性で、1つだけだよ。',
          r: [{ t: 'say', who: 'mimi', es: 'La ventana más pequeña de la biblioteca.', x: '図書館でいちばん小さい窓。' }] },
        { t: 'note', title: '冠詞と形容詞は名詞に合わせる', rows: [
          ['[La] ventana más [pequeña] de la biblioteca', '図書館でいちばん小さい窓'],
          ['[Las] ventanas más [grandes] de la biblioteca', '図書館でいちばん大きい窓たち'],
          ['La ventana es [la más pequeña] de las tres.', '窓は、3つでいちばん小さい。']],
          x: '冠詞も形容詞も、くらべられる名詞（性・数）に合わせる。\n**más と de は変わらない。**' },
        { t: 'say', who: 'mimi', es: 'El elefante es el más grande del bosque.', x: '森でいちばん大きいのはゾウ。\nde ＋ el が くっついて **del** になるよ。' },
        { t: 'ask', q: '___ に入るのは？', es: 'La ventana es la más pequeña ___ la biblioteca.', o: ['del', 'de'], a: 1,
          ng: 'la biblioteca の la は女性。del は de ＋ el のときだけ。',
          r: [{ t: 'say', who: 'mimi', x: 'そう、la のときは de のまま。\nel のときだけ del になる。' }] },
        { t: 'get', ev: 'ventana' },
        { t: 'say', who: 'mimi', x: '窓のさんに、砂糖のつぶと、\nとっても小さな足あとがあるよ。' },
        { t: 'ask', q: '復習！ネズミは 8 cm、小窓は 5 cm。___ に入るのは？', es: 'La ventana pequeña es ___ ancha que el ratón.', o: ['más', 'menos'], a: 1,
          ng: '5 cm は 8 cm より小さいよ。「ほど広くない」。',
          r: [{ t: 'say', who: 'mimi', x: '前の話の menos…que だね。\nネズミより、はばがせまい。' }] },
        { t: 'ask', q: '復習！砂糖のつぶは、窓のさんにも棚の下にも 100 こ。', es: 'Hay ___ granos en la ventana como en el estante.', o: ['tantos', 'tanto', 'tan'], a: 0,
          ng: 'granos は男性の複数。tanto…como の tanto を合わせる。',
          r: [{ t: 'say', who: 'mimi', x: '同じ数だから tantos…como。\n棚の下にも落ちているなんて…。' }] },
        { t: 'get', ev: 'azucar' }
      ] },
      { e: '📏', n: '入口の表', steps: [
        { t: 'say', who: 'ardilla', x: '入口で、来た子の体の幅をはかってるの。\nこれはきのうの分よ。' },
        { t: 'chart', title: '体の幅', unit: 'cm', bars: [
          { e: '🐘', n: 'ゾウ', v: 200 }, { e: '🐒', n: 'サル', v: 40 }, { e: '🐭', n: 'ネズミ', v: 8 }, { e: '🐜', n: 'アリ', v: 1 }], hi: [0] },
        { t: 'say', who: 'mimi', es: 'El elefante es el más ancho de los cuatro.', x: 'ゾウは、4ひきでいちばんはばが広い。' },
        { t: 'get', ev: 'medidas' },
        { t: 'say', who: 'mimi', x: '「大きい」「小さい」のほかに、\n特別な形の「いちばん」もあるんだ。\n第3話の mejor・mayor を思い出してね。' },
        { t: 'chart', title: '年れい', unit: 'さい', bars: [
          { e: '🐘', n: 'ゾウ', v: 40 }, { e: '🐒', n: 'サル', v: 12 }, { e: '🐭', n: 'ネズミ', v: 2 }] },
        { t: 'ask', q: 'いちばん年上は？', o: ['🐘 ゾウ', '🐒 サル', '🐭 ネズミ'], a: 0 },
        { t: 'ask', q: '予想！mayor には「より年上」がもう入っている。いちばん年上は？', es: 'El elefante es ___ de los tres.', o: ['el más mayor', 'el mayor'], a: 1,
          ng: 'mejor・mayor・menor・peor には、más をつけないよ。',
          r: [{ t: 'say', who: 'mimi', es: 'El elefante es el mayor de los tres.', x: 'ゾウは、3ひきでいちばん年上。' }] },
        { t: 'note', title: 'mejor・mayor … のいちばん', rows: [
          ['El elefante es [el mayor] de los tres.', 'ゾウは、3ひきで最年長。'],
          ['El ratón es [el menor] de los tres.', 'ネズミは、3ひきで最年少。'],
          ['El mono es [el mejor] lector de la biblioteca.', 'サルは、図書館で最高の読書家。']],
          x: '**mejor / peor / mayor / menor は más をつけない。**\nel mejor de …、el mayor de … と、前に冠詞と de を足すだけ。' }
      ] }
    ] },
    { t: 'say', who: 'nico', x: 'ゾウは、図書館でいちばん大きい。\nでも、開いた窓は、いちばん小さい…。' },

    /* ---------- 法廷 ---------- */
    { t: 'scene', place: 'court', cast: ['nico', 'mimi', 'juez', 'pavon'] },
    { t: 'say', who: 'juez', x: 'これより…開廷…します…。' },
    { t: 'say', who: 'pavon', es: 'Pancho es el animal más fuerte del bosque.', x: '森でいちばん力の強い動物、パンチョ！\nいちばん重い本を運べるのは彼だけ！' },
    { t: 'say', who: 'pavon', x: '証人を呼びましょう。\n本好きのモノさん！' },
    { t: 'enter', who: 'mono' },
    { t: 'say', who: 'mono', es: 'Soy lector. Voy a la biblioteca todos los días.', x: 'ぼくは読書家。毎日図書館に行くんだ。' },
    { t: 'get', ev: 'mono' },
    { t: 'say', who: 'mimi', x: '尋問だよ。気になる証言は「¡Un momento!」、\nムジュンには「¡Protesto!」で証拠をつきつけて！' },
    { t: 'testimony', who: 'mono', title: 'ゆうべの図書館', hint: '犯人が通った窓のはばと、ゾウの体の幅をくらべてみて。', lines: [
      { es: 'Anoche estuve en la biblioteca.', ja: 'ゆうべ、図書館にいたよ。',
        press: [{ t: 'say', who: 'mono', es: 'Sí, hasta las ocho.', x: 'うん、8時まではね。' }] },
      { es: 'El libro del azúcar es el más pesado de la biblioteca.', ja: '砂糖の本は、図書館でいちばん重い。',
        press: [{ t: 'say', who: 'mimi', x: 'これは本当。30 kg だったね。' }] },
      { es: 'Solo el animal más fuerte lo lleva.', ja: 'いちばん力の強い動物だけが運べる。',
        press: [{ t: 'say', who: 'mono', es: 'Claro. Pesa treinta kilos.', x: 'もちろん。30キロもあるんだ。' }] },
      { es: 'El elefante es el más fuerte del bosque.', ja: 'ゾウは、森でいちばん力が強い。',
        press: [{ t: 'say', who: 'mimi', x: 'ゾウが力もちなのは、たしかだね。' }] },
      { es: 'El ladrón entró por la ventana.', ja: 'どろぼうは、窓から入ったんだ。', ok: ['ventana', 'medidas'],
        press: [{ t: 'say', who: 'mono', es: 'Sí, es la única abierta.', x: 'うん、開いてたのはそれだけ。' }, { t: 'say', who: 'mimi', x: 'その窓、たしか…すごく小さかったよね。' }] },
      { es: 'Por eso, el ladrón es Pancho.', ja: 'だから、どろぼうはパンチョだ。' }
    ], after: [
      { t: 'chart', title: 'はば', unit: 'cm', bars: [{ e: '🪟', n: '小窓', v: 5 }, { e: '🐘', n: 'ゾウ', v: 200 }], hi: [0, 1] },
      { t: 'ask', q: 'ニコの主張をスペイン語で言うと？', o: ['El elefante es más ancho que la ventana.', 'El elefante es menos ancho que la ventana.', 'La ventana es más ancha que el elefante.'], a: 0,
        ng: 'グラフで広いのはゾウ。窓より「はばが広い」だね。',
        r: [{ t: 'say', who: 'nico', es: 'El elefante es más ancho que la ventana.', x: 'ゾウは窓よりはばが広い！\n通れるはずがありません！' }] },
      { t: 'say', who: 'pavon', es: '¡Pero Pancho es el más fuerte!', x: 'しかし、パンチョは力が最強です！' }
    ] },
    { t: 'ask', q: '復習！ゾウは3ひきの中で最年長（40さい）。', es: 'El elefante es ___ de los tres.', o: ['el más mayor', 'el mayor', 'el mejor'], a: 1,
      ng: 'mayor に más はつけないよ。「いちばん年上」は el mayor。',
      r: [{ t: 'say', who: 'mimi', x: '年上でも、窓は通れない。\n力の話と、通り道の話は別だよ。' }] },
    { t: 'stop', who: 'pavon', title: 'パボン検事の主張', lines: [
      { es: 'Pancho es el más fuerte del bosque.', ja: 'パンチョは、森でいちばん力が強い。' },
      { es: 'El libro es el más pesado de la biblioteca.', ja: '本は、図書館でいちばん重い。' },
      { es: 'La ventana abierta es la más grande de la biblioteca.', ja: '開いた窓は、図書館でいちばん大きい。' },
      { es: 'Pancho entró por esa ventana.', ja: 'パンチョはその窓から入った。' }
    ], a: 2, after: [
      { t: 'chart', title: '図書館の窓のはば', unit: 'cm', bars: [{ e: '🪟', n: '大窓', v: 120 }, { e: '🪟', n: '東の窓', v: 60 }, { e: '🪟', n: '小窓', v: 5 }], hi: [2] },
      { t: 'say', who: 'nico', x: '開いていたのは小窓、はば 5 cm！\nいちばん「大きい」ではなく、\nいちばん「小さい」窓です！' },
      { t: 'ask', q: 'ニコの言い直し。___ に入るのは？', es: 'La ventana abierta es la más pequeña ___ la biblioteca.', o: ['en', 'de', 'del'], a: 1,
        ng: '範囲は de。la biblioteca の la は女性だから del にはならない。',
        r: [{ t: 'say', who: 'nico', es: 'La ventana abierta es la más pequeña de la biblioteca.', x: '開いた窓は、図書館でいちばん小さい！' }] }
    ] },
    { t: 'say', who: 'pavon', x: 'ぐ…ぬぬ。ならば、図書館をよく知る\n司書さんに聞きましょう！' },
    { t: 'enter', who: 'ardilla' },
    { t: 'say', who: 'ardilla', es: 'Soy la bibliotecaria.', x: 'わたしは司書です。' },
    { t: 'testimony', who: 'ardilla', title: 'ゆうべの鍵と窓', hint: '来館者の体の幅の表と、窓のはばをくらべてみて。', lines: [
      { es: 'Cerré la puerta con llave a las ocho.', ja: '8時に、ドアに鍵をかけたわ。',
        press: [{ t: 'say', who: 'ardilla', es: 'Sí, es mi trabajo.', x: 'ええ、それがわたしの仕事よ。' }] },
      { es: 'Solo una ventana estaba abierta.', ja: '開いていた窓は、1つだけ。',
        press: [{ t: 'say', who: 'mimi', x: 'それは、さっきの小窓だね。' }] },
      { es: 'Por esa ventana pasó un animal pequeño.', ja: 'その窓を通ったのは、小さな動物よ。',
        press: [{ t: 'say', who: 'nico', x: 'ゾウじゃない、ということだね。' }] },
      { es: 'Fue el ratón. Es el más pequeño de los visitantes.', ja: 'ネズミよ。来館者でいちばん小さいもの。', ok: ['medidas', 'ventana'],
        press: [{ t: 'say', who: 'ardilla', es: 'Sí, el más pequeño.', x: 'ええ、いちばん小さいわ。' }, { t: 'say', who: 'mimi', x: '入口の表を、もう一度見たいな。' }] },
      { es: 'Por eso, el ladrón es el ratón.', ja: 'だから、どろぼうはネズミよ。' }
    ], after: [
      { t: 'chart', title: 'はば', unit: 'cm', bars: [{ e: '🐜', n: 'アリ', v: 1 }, { e: '🪟', n: '小窓', v: 5 }, { e: '🐭', n: 'ネズミ', v: 8 }], hi: [0] },
      { t: 'ask', q: 'ネズミ（8 cm）は小窓（5 cm）を通れる？ニコの主張は？', o: ['El ratón es más ancho que la ventana.', 'El ratón es menos ancho que la ventana.'], a: 0,
        ng: '8 cm は 5 cm より大きいよ。',
        r: [{ t: 'say', who: 'nico', es: 'El ratón es más ancho que la ventana.', x: 'ネズミも、窓よりはばが広い！\n通れません！' }] },
      { t: 'ask', q: '来館者の中でいちばん小さいのは？', o: ['🐘 ゾウ', '🐒 サル', '🐭 ネズミ', '🐜 アリ'], a: 3,
        ng: '入口の表で、いちばん低い棒はだれ？',
        r: [{ t: 'say', who: 'nico', es: 'La hormiga es la más pequeña de los cuatro.', x: 'アリは、4ひきでいちばん小さい！' }] }
    ] },
    { t: 'order', q: 'ゆうべの来館者4ひき。はばの広い順にタップしよう。', items: [
      { id: 'ele', e: '🐘', n: 'ゾウ' }, { id: 'mon', e: '🐒', n: 'サル' }, { id: 'rat', e: '🐭', n: 'ネズミ' }, { id: 'hor', e: '🐜', n: 'アリ' }
    ], a: ['ele', 'mon', 'rat', 'hor'],
      r: [{ t: 'say', who: 'mimi', x: '小窓（5 cm）を通れるのは、\nいちばん下のアリだけだね。' }] },
    { t: 'present', q: 'パボン検事「通れる小さな動物が、ほかにいますか？」\n窓のさんに残っていたものを出して！', ok: ['azucar'], after: [
      { t: 'say', who: 'nico', x: '窓のさんに、1 mm の足あとと砂糖のつぶ。\nこの足あとの主は…！' },
      { t: 'say', who: 'pavon', es: '¡Una hormiga no lleva treinta kilos!', x: '1ぴきのアリが30キロ運べますか！' },
      { t: 'say', who: 'nico', x: 'アリは、自分の体重の何十倍も運べる。\nそれに、1ぴきとは限りません！' }
    ] },
    { t: 'enter', who: 'hormiga' },
    { t: 'say', who: 'hormiga', es: 'Somos mil hormigas.', x: 'わたしたち、アリは1000びきよ。' },
    { t: 'say', who: 'hormiga', es: 'Somos las más pequeñas del bosque.', x: 'わたしたち、森でいちばん小さいの。' },
    { t: 'interp', who: 'loro', es: 'Somos las más pequeñas del bosque.', ja: 'わたしたちは、森でいちばん大きいの。',
      o: ['わたしたちは、森でいちばん大きいの。', 'わたしたちは、森でいちばん小さいの。', 'わたしたちは、森の小さな家族なの。'], a: 1,
      after: [{ t: 'say', who: 'loro', x: 'シ、失礼！ pequeñas は「小さい」。\n「del bosque」は「森の中で」でした。' }] },
    { t: 'say', who: 'hormiga', es: '¡Amamos el azúcar!', x: 'だって、砂糖が大好きなんだもの！' },
    { t: 'build', q: 'とどめの一言：「アリは、来館者でいちばん小さい！」', es: 'Las hormigas son las más pequeñas de los visitantes.', x: ['en', 'menos'],
      r: [{ t: 'slam', txt: '¡Las más pequeñas!' }] },
    { t: 'say', who: 'ardilla', es: 'Hilda... ¡Mi libro del azúcar!', x: 'ヒルダさん…わたしの砂糖の本を！' },
    { t: 'say', who: 'hormiga', es: 'Lo siento. Lo devolvemos mañana.', x: 'ごめんなさい。明日、もどしにいくわ。' },
    { t: 'say', who: 'elefante', es: 'Yo llevo el libro a su estante. Soy el más fuerte.', x: 'ぼくが棚にもどすよ。いちばん力もちだし！' },
    { t: 'say', who: 'hormiga', es: 'Y nosotras ayudamos. Somos mil.', x: 'わたしたちも手伝うわ。1000びきだもの。' },
    { t: 'say', who: 'juez', x: '判決を…言いわたします…。' },
    { t: 'verdict', txt: '無罪', es: 'INOCENTE' },
    { t: 'say', who: 'mimi', x: 'やったね、ニコ先生！\n「el más ～ de」は、もうばっちり。' }
  ]
});
