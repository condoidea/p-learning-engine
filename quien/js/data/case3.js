/* 第3話 「売ります」の張り紙 — 受身の se（se ＋ 3人称の動詞。動詞の数は物に合わせる）
 * 単語帳にない語：piso＝部屋・マンション(名詞・4級), pisos, inmobiliaria＝不動産屋(名詞), vende/venden/vendes/vendió/vendieron/vendida/vendido＝売る(vender・4級),
 *   alquila/alquilan＝貸す・借りる(alquilar・4級以上), habitaciones＝部屋(habitación・4級), casas, frutas＝果物(fruta・4級), cartel/carteles＝張り紙(名詞),
 *   semana＝週(4級), agencia＝代理店(名詞), naranjas＝オレンジ(4級), tomates＝トマト(4級), baratos＝安い(barato・4級), frutero＝果物屋(名詞),
 *   escribí/escribió/escribieron＝書く(escribir・4級), recibí＝受け取る(recibir・4級), necesitaba＝必要だ(necesitar・4級), quieren＝ほしい(querer・4級),
 *   hice＝した(hacer・4級), nadie＝だれも(4級), mucha＝たくさんの(4級), gente＝人々(4級), mar＝海(名詞・4級), luna＝月(名詞・4級),
 *   人名：Marta, Beni, Ruiz, Luna/Sol/Mar（通りの名） */
QF.cases.push({
  id: 'c3', no: 3, title: '「売ります」の張り紙', es: 'Se vende piso', icon: '🏠',
  grammar: '受身の se（se ＋ 3人称の動詞）',
  cover: '街じゅうに「売ります」「貸します」の張り紙。前金を払った人が、お金をだまし取られた。張り紙には、貼った人の名前がない。',
  cast: {
    marta: { n: 'マルタ', es: 'Marta', e: '👩‍💼', role: '不動産屋の店員' },
    beni:  { n: 'ベニ', es: 'Beni', e: '🧑‍🌾', role: '市場の果物屋' }
  },
  evidence: {
    cartel: { e: '📄', n: 'にせの張り紙', d: '手書きで「Se vende pisos. Calle Luna, 5.」。不動産屋の張り紙ではない。' },
    libro:  { e: '📒', n: '不動産屋の帳簿', d: '「Esta semana se vendieron dos pisos (calle Sol y calle Mar).」ルナ通りの部屋は、帳簿にない。' },
    puesto: { e: '🪧', n: '果物屋の看板', d: 'ベニの店の看板に「Se vende naranjas y tomates」。にせの張り紙と、同じ書きまちがい。' }
  },
  steps: [
    /* ---------- 編集部 ---------- */
    { t: 'scene', place: 'redaccion', cast: ['leo', 'pepa', 'ramon'] },
    { t: 'say', who: 'ramon', x: '街じゅうに、こんな張り紙が\n貼ってある。前金をだまし取られた\n人が出たぞ。' },
    { t: 'say', who: 'ramon', es: 'Se vende piso.', x: '「部屋、売ります」…\n貼ったやつの名前は、どこにもない。' },
    { t: 'ask', q: 'この文に、「売る人」は出てくる？', es: 'Se vende piso.', o: ['出てこない', '出てくる'], a: 0,
      r: [{ t: 'say', who: 'pepa', x: 'そう。第1話の受身と同じで、\nやった人が文から消えているの。' }] },
    { t: 'say', who: 'pepa', x: 'でも、ser も過去分詞もないわ。\nこれは別の形。現場で見ましょう。' },
    { t: 'say', who: 'ramon', x: 'レオ、不動産屋と市場へ行ってこい！' },

    /* ---------- 不動産屋・市場 ---------- */
    { t: 'scene', place: 'inmobiliaria', cast: ['leo', 'pepa', 'marta'] },
    { t: 'say', who: 'marta', es: 'Buenos días. Soy Marta, de la inmobiliaria.', x: 'おはようございます。不動産屋のマルタです。' },
    { t: 'inspect', spots: [
      { e: '🏠', n: '店の張り紙', steps: [
        { t: 'say', who: 'marta', es: 'Se vende un piso. Se alquilan dos habitaciones.', x: '部屋を1つ売ります。\n2部屋を貸します。' },
        { t: 'ask', q: 'vende と alquilan。動詞の形がちがうのは、なぜ？', es: 'Se vende un piso. Se alquilan dos habitaciones.', o: ['piso は1つ、habitaciones は2つ', '動詞がちがうだけ'], a: 0,
          ng: 'vende と alquilan のうしろの、名詞の数を見て。',
          r: [{ t: 'say', who: 'pepa', x: '動詞の形は、うしろの名詞に\n合っているのよ。' }] },
        { t: 'note', title: '受身の se（〜される）', rows: [
          ['[Se vende] una casa.', '家が売られる（売ります）。'],
          ['[Se venden] casas.', '家（複数）が売られる。'],
          ['[Se alquila] un piso.', '部屋が貸される（貸します）。'],
          ['[Se habla] español.', 'スペイン語が話される。'],
          ['En este mercado [se venden] frutas.', 'この市場では、果物が売られる。']],
          x: '**se ＋ 3人称の動詞**で、「〜される」。\n**動詞の数は、物（主語）に合わせる。**\n物が1つなら vende、複数なら venden。\n主語は、動詞の**うしろ**に来ることが多い。\nやった人は書かない（**por は付けない**）。',
          why: 'もとは「物が自分を売る」という形（se＝自分を）。\n物は自分を売れないから、「売られる」に\n意味が広がったの。\n主語は物。だから動詞は物に合うのよ。' },
        { t: 'tap', q: 'venden が複数の形なのは、どの語に合わせたから？', es: 'Se venden casas en esta calle.', ja: 'この通りでは、家が売られる。', a: ['casas'],
          ng: '動詞は、物の名詞に合わせる。',
          r: [{ t: 'say', who: 'pepa', x: '主語は casas。複数だから venden ね。' }] },
        { t: 'ask', q: '___ に入るのは？', es: 'Se ___ habitaciones.', o: ['alquila', 'alquilan'], a: 1,
          ng: 'habitaciones は複数。' },
        { t: 'who', q: 'この文で、貸すのは？', es: 'Se alquila un piso.', ja: '部屋が貸される（貸します）。', o: ['por', 'alguien', 'estado'], a: 1,
          r: [{ t: 'say', who: 'pepa', x: 'por も、ser もない。\nやった人は書いていない、「だれか」よ。' }] },
        { t: 'say', who: 'marta', es: 'Ese cartel de la puerta no es nuestro.', x: '入口に貼ってある張り紙は、\nうちのじゃありません。' },
        { t: 'get', ev: 'cartel' }
      ] },
      { e: '📒', n: '帳簿', steps: [
        { t: 'say', who: 'marta', es: 'Esta semana se vendieron dos pisos.', x: '今週は、部屋が2つ売れました。' },
        { t: 'tap', q: 'vendieron（過去の形）が複数なのは、どの語に合わせたから？', es: 'Se vendieron dos pisos.', ja: '部屋が2つ売られた。', a: ['pisos'],
          ng: '過去でも、動詞は物に合わせる。',
          r: [{ t: 'say', who: 'pepa', x: '過去でも同じ。pisos が複数だから\nvendieron ね。' }] },
        { t: 'say', who: 'pepa', x: '第1話の受身と、くらべてみましょう。' },
        { t: 'note', title: 'ser ＋ 過去分詞 と、se', rows: [
          ['La casa [fue vendida por] el señor Ruiz.', '家は、ルイスさんに売られた。'],
          ['[Se vendió] la casa.', '家が売られた。'],
          ['[Se vendieron] dos pisos.', '部屋が2つ売られた。']],
          x: '意味はどちらも「〜される」。\n**やった人を言うなら ser ＋ 過去分詞 ＋ por。**\n**言わないなら se**。\nふだんの会話や張り紙では、se のほうがずっと多い。' },
        { t: 'ask', q: 'ルイスさんが売った、と言いたい。正しいのは？', o: ['La casa fue vendida por el señor Ruiz.', 'Se vendió la casa por el señor Ruiz.'], a: 0,
          ng: 'se の文には、por を付けない。',
          r: [{ t: 'say', who: 'pepa', x: 'se の文は、やった人を言わない形。\nだから por は付かないの。' }] },
        { t: 'who', q: 'この文で、売ったのは？', es: 'Se vendió la casa.', ja: '家が売られた。', o: ['por', 'alguien', 'estado'], a: 1 },
        { t: 'say', who: 'marta', es: 'Los pisos de la agencia están en la calle Sol y la calle Mar.', x: 'うちの部屋は、ソル通りと\nマル通りにあります。' },
        { t: 'get', ev: 'libro' }
      ] },
      { e: '🍅', n: '市場の看板', steps: [
        { t: 'scene', place: 'mercado', cast: ['leo', 'pepa', 'beni'] },
        { t: 'say', who: 'beni', es: 'En este mercado se venden frutas.', x: 'この市場では、果物を売っているよ。' },
        { t: 'say', who: 'beni', es: 'Aquí se habla español.', x: 'ここでは、スペイン語が話されている。' },
        { t: 'ask', q: 'habla は単数。主語の español は、いくつ？', es: 'Aquí se habla español.', o: ['1つ（単数）', '2つ以上（複数）'], a: 0,
          r: [{ t: 'say', who: 'pepa', x: '物が1つ。だから habla ね。' }] },
        { t: 'ask', q: '___ に入るのは？', es: 'En este mercado se ___ naranjas.', o: ['vende', 'venden'], a: 1,
          ng: 'naranjas は複数。' },
        { t: 'say', who: 'leo', x: 'あの店先の看板は…？\n動詞と名詞が、合っていない気が。' },
        { t: 'get', ev: 'puesto' }
      ] }
    ] },

    /* ---------- 編集部（原稿） ---------- */
    { t: 'scene', place: 'redaccion', cast: ['leo', 'pepa', 'tito'] },
    { t: 'say', who: 'pepa', x: 'ここで、見分けの手順に1段足すわね。' },
    { t: 'flow', upto: 3 },
    { t: 'say', who: 'pepa', x: 'se を見たら、まず「主語は物？」。\nこれから se の形を増やしていくわ。' },
    { t: 'say', who: 'tito', x: '先輩！ 張り紙の記事を\n書いておきました！' },
    { t: 'redpen', q: 'ティトの原稿に、まちがいが1つ。', es: 'Se vende pisos baratos en la calle Luna.', bad: 'vende', o: ['venden', 'vendes', 'vendido'], a: 0, fix: 'Se venden pisos baratos en la calle Luna.',
      ng: 'pisos は複数。動詞を合わせる。',
      r: [{ t: 'say', who: 'pepa', x: 'pisos が複数だから venden。\n試験によく出るまちがいよ。' }] },
    { t: 'say', who: 'leo', x: 'あれ…にせの張り紙も、\n同じまちがいをしていました。' },
    { t: 'say', who: 'pepa', x: 'つづりのくせは、書いた人の指紋ね。\n市場へ行きましょう。' },

    /* ---------- 市場（対決） ---------- */
    { t: 'scene', place: 'mercado', cast: ['leo', 'pepa'], duel: true },
    { t: 'enter', who: 'beni' },
    { t: 'say', who: 'beni', es: '¿Qué quieren? ¿Naranjas o tomates?', x: '何だい？ オレンジかい、トマトかい？' },
    { t: 'testimony', who: 'beni', title: 'わたしの店', hint: 'ベニの店の看板を見てみて。', lines: [
      { es: 'Yo vendo frutas, no vendo pisos.', ja: 'わたしは果物を売る。部屋は売らない。',
        press: [{ t: 'say', who: 'beni', es: 'Claro, soy frutero.', x: 'もちろん、果物屋だからな。' }] },
      { es: 'Yo no escribí esos carteles.', ja: 'あの張り紙は、書いていない。', ok: ['puesto'],
        press: [{ t: 'say', who: 'beni', es: 'No, nunca.', x: 'ああ、書いたことなんてない。' }, { t: 'say', who: 'pepa', x: '「書いていない」…\nほんとうかしら。' }] },
      { es: 'Mis tomates son muy buenos.', ja: 'わたしのトマトは、とてもおいしい。' }
    ], after: [
      { t: 'say', who: 'leo', x: 'あなたの看板は「Se vende naranjas」。\nにせの張り紙と、同じまちがいです！' },
      { t: 'ask', q: '看板の文を正しくすると？', o: ['Se venden naranjas y tomates.', 'Se vende naranjas y tomates.', 'Se vendes naranjas y tomates.'], a: 0,
        ng: 'naranjas y tomates は複数。',
        r: [{ t: 'say', who: 'pepa', x: 'venden ね。同じ人のくせだわ。' }] },
      { t: 'say', who: 'beni', es: 'Bueno... eso no es nada.', x: 'ま、まあ…それだけじゃ、何でもないだろ。' }
    ] },
    { t: 'testimony', who: 'beni', title: 'お金のこと', hint: '不動産屋の帳簿に、ルナ通りはある？', lines: [
      { es: 'Yo no recibí dinero de nadie.', ja: 'わたしは、だれからもお金を受け取っていない。',
        press: [{ t: 'say', who: 'beni', es: 'Nada de nada.', x: '1円ももらってない。' }] },
      { es: 'En la calle Luna se vende un piso muy bueno.', ja: 'ルナ通りでは、とてもいい部屋が売られている。', ok: ['libro'],
        press: [{ t: 'say', who: 'beni', es: 'Sí, en la calle Luna.', x: 'ああ、ルナ通りでな。' }, { t: 'say', who: 'pepa', x: 'se vende…。売り手は書いていないわね。' }] },
      { es: 'Mucha gente quiere ese piso.', ja: 'たくさんの人が、その部屋をほしがっている。' }
    ], after: [
      { t: 'say', who: 'leo', x: '帳簿では、ルナ通りの部屋は\nひとつもありません！' },
      { t: 'ask', q: '帳簿どおりに言うと？', o: ['En la calle Luna no hay pisos.', 'En la calle Luna hay muchos pisos.', 'En la calle Sol no hay pisos.'], a: 0,
        ng: '帳簿にあるのは、ソル通りとマル通り。',
        r: [{ t: 'say', who: 'leo', x: 'ない部屋を「売る」張り紙を\n貼ったんですね！' }] },
      { t: 'say', who: 'beni', es: '¡No, no! Yo no hice nada.', x: 'ち、ちがう！ わたしは何もしていない！' }
    ] },
    { t: 'interp', es: 'Se alquilan dos habitaciones.', ja: '2つの部屋は、自分で貸している。',
      o: ['2つの部屋は、自分で貸している。', '2つの部屋が貸される（貸します）。', '2つの部屋を借ります。'], a: 1,
      ng: 'se ＋ 動詞は、「〜される」。主語は habitaciones。',
      after: [{ t: 'say', who: 'tito', x: 'すみません！ 物が「自分で」ではなく、\n「〜される」でした。' }] },
    { t: 'who', q: '最後に、張り紙の文を確かめよう。貼ったのは？', es: 'Se vende un piso en la calle Luna.', ja: 'ルナ通りで、部屋が売られる。', o: ['por', 'alguien', 'estado'], a: 1,
      r: [{ t: 'say', who: 'pepa', x: '文には書いていない。\nだから、ほかの手がかりで見ぬくの。' }] },
    { t: 'build', q: 'とどめの一言を組み立てよう：「あの張り紙は、あなたの店で書かれた！」', es: 'Esos carteles se escribieron en tu puesto.', x: ['escribió', 'este'],
      r: [{ t: 'slam', txt: '¡En tu puesto!' }] },
    { t: 'say', who: 'beni', es: 'Lo siento... Necesitaba dinero.', x: 'すまない…。金が必要だったんだ。' },
    { t: 'say', who: 'marta', es: 'Ahora hay que devolver el dinero.', x: 'お金を返さないとね。' },
    { t: 'scoop', txt: 'にせ張り紙、市場の果物屋が書いていた', es: 'Esos carteles se escribieron en un puesto del mercado.' },
    { t: 'say', who: 'pepa', x: 'おみごと。\nse ＋ 動詞は、物に合わせる。もうばっちりね。' }
  ]
});
