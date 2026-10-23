/* 第1話 消えた大きなパン — más / menos ＋ 形容詞 ＋ que */
PQ.cases.push({
  id: 'c1', no: 1, title: '消えた大きなパン', es: 'El pan desaparecido', icon: '🥖',
  grammar: 'más / menos ＋ 形容詞 ＋ que',
  cover: 'クマのパン屋から、いちばん上の棚の大きなパンが消えた。つかまったのは、パンが大好きなウサギのココ。',
  cast: {
    oso:    { n: 'クマ親方', es: 'Señor Oso', e: '🐻', role: 'パン屋' },
    coco:   { n: 'ココ', es: 'Coco', e: '🐰', role: '被告・ウサギ' },
    jirafa: { n: 'ジラファさん', es: 'Señora Jirafa', e: '🦒', role: '証人・郵便配達' }
  },
  evidence: {
    estante: { e: '🗄', n: 'パン屋の棚', d: 'いちばん上の段は高さ 200 cm。大きなパンはそこにあった。' },
    coco:    { e: '🐰', n: 'ココの身長', d: '耳まで入れて 60 cm。' },
    precio:  { e: '🏷', n: 'パンの値札', d: '大きなパン 5 ユーロ、小さなパン 2 ユーロ。' },
    huellas: { e: '👣', n: '床の足あと', d: '丸くて大きい足あと。1つが 20 cm。ココの足は 8 cm。' },
    jirafa:  { e: '🦒', n: '証人ジラファ', d: '郵便配達。首までいれて 500 cm。毎日パン屋の前を通る。' }
  },
  steps: [
    /* ---------- 事務所 ---------- */
    { t: 'scene', place: 'office', cast: ['nico', 'mimi'] },
    { t: 'say', who: 'mimi', x: 'ニコ先生、はじめての依頼だよ！\nウサギのココくんが、つかまったって。' },
    { t: 'say', who: 'nico', x: 'パンどろぼうの疑い、か。\nよし、まずは現場のパン屋へ行こう。' },

    /* ---------- パン屋 ---------- */
    { t: 'scene', place: 'panaderia', cast: ['nico', 'mimi', 'oso'] },
    { t: 'say', who: 'oso', es: '¡Mi pan grande no está!', x: 'わしの大きなパンがないんだ！' },
    { t: 'say', who: 'mimi', x: '法廷の言葉はスペイン語。\nこの事件は「くらべる言い方」がカギになりそう。\nお店の中を調べてみよう！' },
    { t: 'inspect', spots: [
      { e: '🗄', n: '棚', steps: [
        { t: 'say', who: 'oso', es: 'El pan grande estaba arriba.', x: '大きなパンは、いちばん上にあったんだ。' },
        { t: 'get', ev: 'estante' },
        { t: 'chart', title: '高さ', unit: 'cm', bars: [{ e: '🗄', n: '棚', v: 200 }, { e: '🐰', n: 'ココ', v: 60 }] },
        { t: 'ask', q: 'グラフを見て。高いのはどっち？', o: ['🗄 棚', '🐰 ココ'], a: 0,
          r: [{ t: 'say', who: 'mimi', x: 'そう、棚のほうが高いね。\nこれをスペイン語で言うと…' }] },
        { t: 'note', title: '〜より高い', rows: [['El estante es [más alto que] Coco.', '棚は ココ より 高い。']],
          x: '**más ＋ 形容詞 ＋ que ＋ くらべる相手**\nmás alto＝もっと高い、que Coco＝ココより' },
        { t: 'ask', q: '「ココより」にあたるのは？', es: 'El estante es más alto que Coco.', o: ['más alto', 'que Coco', 'El estante'], a: 1,
          r: [{ t: 'say', who: 'mimi', x: '正解！ que のうしろが、くらべる相手。\n日本語の「〜より」と同じ役目だよ。' }] },
        { t: 'get', ev: 'coco' }
      ] },
      { e: '🏷', n: '値札', steps: [
        { t: 'chart', title: 'パンの値段', unit: '€', bars: [{ e: '🥖', n: '大きなパン', v: 5 }, { e: '🥐', n: '小さなパン', v: 2 }] },
        { t: 'ask', q: '安いのはどっち？', o: ['🥖 大きなパン', '🥐 小さなパン'], a: 1 },
        { t: 'note', title: '〜より安い・〜ほど高くない', rows: [
          ['El pan pequeño es [más barato que] el pan grande.', '小さなパンは、大きなパンより安い。'],
          ['El pan pequeño es [menos caro que] el pan grande.', '小さなパンは、大きなパンほど高くない。']],
          x: '**menos ＋ 形容詞 ＋ que**＝「〜ほど…ではない」\nmenos は「より少なく」。más の反対だよ。' },
        { t: 'ask', q: '「menos caro」と同じ意味になるのは？', o: ['más caro', 'más barato'], a: 1,
          r: [{ t: 'say', who: 'mimi', x: '「高さが少ない」＝「安い」。\nmás barato と menos caro は、\n同じことを言っているね。' }] },
        { t: 'get', ev: 'precio' }
      ] },
      { e: '👣', n: '床', steps: [
        { t: 'say', who: 'mimi', x: '粉の上に、丸くて大きな足あと。\n1つ 20 cm もあるよ。' },
        { t: 'chart', title: '足の大きさ', unit: 'cm', bars: [{ e: '👣', n: '足あと', v: 20 }, { e: '🐰', n: 'ココの足', v: 8 }] },
        { t: 'note', title: '形容詞は主語に合わせる', rows: [
          ['Las huellas son [más grandes que] los pies de Coco.', '足あとは、ココの足より大きい。'],
          ['La jirafa es [más alta que] el oso.', 'キリンはクマより背が高い。']],
          x: '主語が複数なら grandes、女性なら alta。\n**más・menos・que は変わらない。変わるのは形容詞だけ。**' },
        { t: 'ask', q: '___ に入るのは？', es: 'La jirafa es más ___ que el oso.', o: ['alto', 'alta', 'altos'], a: 1,
          ng: 'la jirafa は女性の名詞だよ。',
          r: [{ t: 'say', who: 'mimi', x: 'そう、la jirafa は女性だから alta。' }] },
        { t: 'get', ev: 'huellas' }
      ] }
    ] },
    { t: 'say', who: 'nico', x: 'ココの足あとは細長いはず。\nこの丸い足あとは、だれのだろう…' },

    /* ---------- 法廷 ---------- */
    { t: 'scene', place: 'court', cast: ['nico', 'mimi', 'juez', 'pavon'] },
    { t: 'say', who: 'juez', x: 'これより…開廷…します…。' },
    { t: 'say', who: 'pavon', es: 'Soy el fiscal más elegante del bosque.', x: 'わたしは森でいちばんエレガントな検事。\n（ドン・パボンの口ぐせ）' },
    { t: 'say', who: 'pavon', x: '被告ココは大のパン好き。\n証人を呼びましょう。郵便配達のジラファさん！' },
    { t: 'enter', who: 'jirafa' },
    { t: 'say', who: 'jirafa', es: 'Soy cartera. Todos los días paso por la panadería.', x: 'わたしは郵便配達。毎日パン屋の前を通るの。' },
    { t: 'get', ev: 'jirafa' },
    { t: 'say', who: 'mimi', x: 'ここからは尋問だよ。\n気になる証言は「¡Un momento!（待った）」で\nゆさぶって、ムジュンには\n「¡Protesto!（異議あり）」で証拠をつきつけて！' },
    { t: 'testimony', who: 'jirafa', title: 'パン屋で見たこと', hint: '棚の高さと、ココの背の高さをくらべてみて。', lines: [
      { es: 'Ayer pasé por la panadería.', ja: 'きのう、パン屋の前を通ったの。',
        press: [{ t: 'say', who: 'jirafa', es: 'Sí, a las nueve.', x: 'ええ、9時よ。' }] },
      { es: 'Vi a Coco delante de la puerta.', ja: 'ドアの前に、ココがいたわ。',
        press: [{ t: 'say', who: 'coco', es: 'Sí, yo estaba allí. Pero no tomé el pan.', x: 'うん、いたよ。でもパンはとってない。' }] },
      { es: 'Coco es más pequeño que yo, claro.', ja: 'もちろん、ココはわたしより小さいわ。',
        press: [{ t: 'say', who: 'mimi', x: 'これは本当。ジラファさんは 500 cm もあるもん。' }] },
      { es: 'Coco tomó el pan grande del estante.', ja: 'ココが棚から大きなパンをとったの。', ok: ['estante', 'coco'],
        press: [{ t: 'say', who: 'jirafa', es: 'Sí. Lo vi.', x: 'ええ、見たわ。' }, { t: 'say', who: 'mimi', x: '大きなパンは、いちばん上の段にあったよね…' }] }
    ], after: [
      { t: 'chart', title: '高さ', unit: 'cm', bars: [{ e: '🗄', n: '棚', v: 200 }, { e: '🐰', n: 'ココ', v: 60 }], hi: [0] },
      { t: 'say', who: 'nico', x: 'パンは棚のいちばん上。高さ 200 cm です。\nココは耳まで入れても 60 cm。' },
      { t: 'ask', q: 'ニコの主張をスペイン語で言うと？', o: ['Coco es más alto que el estante.', 'Coco es menos alto que el estante.', 'El estante es menos alto que Coco.'], a: 1,
        ng: 'グラフで低いのはココ。「ココは棚ほど高くない」だね。',
        r: [{ t: 'say', who: 'nico', es: 'Coco es menos alto que el estante.', x: 'ココは棚ほど背が高くない！\nとどくはずがありません！' }] },
      { t: 'say', who: 'pavon', es: '¡Pero los conejos saltan mucho!', x: 'しかしウサギはよく跳ぶのですよ！' },
      { t: 'say', who: 'juez', x: 'ふむ…。証人、どろぼうの姿を…もう少しくわしく。' }
    ] },
    { t: 'testimony', who: 'jirafa', title: 'どろぼうの足', hint: '床に残っていた足あとを思い出して。', lines: [
      { es: 'Bueno... no vi bien al ladrón.', ja: 'そうね…どろぼうはよく見えなかったわ。' },
      { es: 'Pero el ladrón es más bajo que yo.', ja: 'でも、どろぼうはわたしより背が低い。',
        press: [{ t: 'say', who: 'mimi', x: 'ジラファさんより低いのは…\n森のほとんど全員だよ。' }] },
      { es: 'Y sus pies son más pequeños que los pies de Coco.', ja: 'それに、足はココの足より小さかった。', ok: ['huellas'],
        press: [{ t: 'say', who: 'jirafa', es: 'Sí, pies muy pequeños.', x: 'ええ、とっても小さい足。' }] },
      { es: 'Por eso, el ladrón es Coco.', ja: 'だから、どろぼうはココよ。' }
    ], after: [
      { t: 'chart', title: '足の大きさ', unit: 'cm', bars: [{ e: '👣', n: '足あと', v: 20 }, { e: '🐰', n: 'ココの足', v: 8 }], hi: [0] },
      { t: 'ask', q: '床の足あとから言えることは？', o: ['Las huellas son más pequeñas que los pies de Coco.', 'Las huellas son más grandes que los pies de Coco.'], a: 1,
        r: [{ t: 'say', who: 'nico', es: '¡Las huellas son más grandes que los pies de Coco!', x: '足あとは、ココの足より大きい！\nどろぼうは、大きな足の持ち主です！' }] },
      { t: 'say', who: 'juez', x: '背が棚より高くて…足が大きい。\nそんな者が…いるのかね…？' }
    ] },
    { t: 'chart', title: '高さ', unit: 'cm', bars: [{ e: '🐰', n: 'ココ', v: 60 }, { e: '🐻', n: 'クマ親方', v: 180 }, { e: '🗄', n: '棚', v: 200 }, { e: '🦒', n: 'ジラファ', v: 500 }] },
    { t: 'ask', q: 'El ladrón es más alto que el estante.\nあてはまるのは？', o: ['🐰 ココ', '🐻 クマ親方', '🦒 ジラファさん'], a: 2,
      ng: '棚（200 cm）より高いのは、グラフでだれ？' },
    { t: 'say', who: 'jirafa', es: '¡Yo no! Soy menos alta que el oso.', x: '（スペイン語で反論している…）' },
    { t: 'interp', who: 'loro', es: 'Soy menos alta que el oso.', ja: 'わたしは、クマさんより背が高いの。',
      o: ['わたしは、クマさんより背が高いの。', 'わたしは、クマさんほど背が高くないの。', 'わたしは、クマさんと同じくらいの背なの。'], a: 1,
      after: [{ t: 'say', who: 'loro', x: 'シ、失礼！ menos は「ほど…ない」。\n訳しなおすと「クマさんほど背が高くない」です。' }] },
    { t: 'present', q: 'ジラファさんの「クマ親方ほど背が高くない」。これをくずす証拠は？', ok: ['jirafa'], after: [
      { t: 'chart', title: '高さ', unit: 'cm', bars: [{ e: '🐻', n: 'クマ親方', v: 180 }, { e: '🦒', n: 'ジラファ', v: 500 }], hi: [1] },
      { t: 'say', who: 'nico', x: '証人は首まで入れて 500 cm。\nクマ親方は 180 cm。ウソは通りません！' }
    ] },
    { t: 'build', q: 'とどめの一言を組み立てよう：「あなたは、棚より背が高い！」', es: 'Usted es más alta que el estante.', x: ['menos', 'alto'],
      r: [{ t: 'slam', txt: '¡Más alta!' }] },
    { t: 'say', who: 'jirafa', es: 'Lo siento... El pan del oso es muy rico.', x: 'ごめんなさい…クマさんのパン、とってもおいしくて…。' },
    { t: 'say', who: 'oso', es: 'Bueno... Mañana hago un pan más grande para todos.', x: 'まあいい…。明日、みんなのためにもっと大きなパンを焼くさ。' },
    { t: 'say', who: 'juez', x: '判決を…言いわたします…。' },
    { t: 'verdict', txt: '無罪', es: 'INOCENTE' },
    { t: 'say', who: 'mimi', x: 'やったね、ニコ先生！\n「más ＋ 形容詞 ＋ que」は、もうばっちり。' }
  ]
});
