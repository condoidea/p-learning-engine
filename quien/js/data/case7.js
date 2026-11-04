/* 第7話（最終話）号外！ Señor Se の正体 — se の使い分け総まとめ・le → se（se lo）
 * 単語帳にない語：abrió・abrí＝開けた（動詞 abrir の点過去・4級）, alcalde＝市長（名詞・4級）, ayuntamiento＝市役所（名詞・4級以上）, cerrada＝閉まった（過去分詞・4級）, cometieron＝犯した（cometer の点過去・4級以上）, dio＝あげた（dar の点過去・4級）, enviado＝送られた（enviar の過去分詞・4級）, errores＝誤り（error の複数・4級）, guardé＝しまった（guardar の点過去・4級）, lava＝洗う（lavar・4級）, les＝彼らに（人称代名詞・4級）, levantó＝起きた（levantarse の点過去・4級）, lunes＝月曜日（名詞・4級）, nadie＝だれも〜ない（代名詞・4級）, necesita＝必要だ（necesitar・4級）, perdió＝なくした（perder の点過去・4級）, sábado＝土曜日（名詞・4級）, tardes＝午後（tarde の複数・4級）, temprano＝早く（副詞・4級）, 人名：Nuria・Pedro・Luis・Sebastián・Serrano */
QF.cases.push({
  id: 'c7', no: 7, title: '号外！ Señor Se の正体', es: 'Se cometieron errores', icon: '🎤',
  grammar: 'se の使い分け・le → se（se lo）',
  cover: '市のお祭りのお金が消えた。広報官は記者会見で「誤りがありました」「お金がなくなりました」。だれが、とはひとことも言わない。',
  cast: {
    seba:  { n: 'セバスティアン・セラーノ', es: 'Sebastián Serrano', e: '🎙', role: '市の広報官。あだ名は Señor Se' },
    nuria: { n: 'ヌリア', es: 'Nuria', e: '👩‍💼', role: '市役所の職員' }
  },
  evidence: {
    llave:  { e: '🔑', n: '金庫の鍵', d: '金庫を開ける鍵は**1つだけ**。持っているのは広報官のセラーノさんだけ。' },
    recibo: { e: '🧾', n: '銀行の控え', d: 'お金は広報官セラーノさん本人によって、**弟のゴンサロさん**に送られた。市長には渡っていない。' }
  },
  steps: [
    /* ---------- 編集部 ---------- */
    { t: 'scene', place: 'redaccion', cast: ['leo', 'pepa', 'ramon'] },
    { t: 'say', who: 'ramon', x: 'レオ、市のお祭りのお金が消えた。\n今日、広報官が記者会見を開く。' },
    { t: 'say', who: 'ramon', es: 'Se cometieron errores. Se perdió el dinero.', x: '「誤りがありました。\nお金がなくなりました。」' },
    { t: 'say', who: 'leo', x: '…だれが、とは言っていませんね。' },
    { t: 'say', who: 'pepa', x: '広報官のセバスティアン・セラーノ。\nあだ名は「Señor Se」。\n文に、自分の名前をけっして出さない人よ。' },
    { t: 'tap', q: 'cometieron が複数なのは、どの語に合わせたから？', es: 'Se cometieron errores.', ja: '誤りがありました。', a: ['errores'],
      ng: '動詞は、物の主語に合わせて数が変わる。',
      r: [{ t: 'say', who: 'pepa', x: 'そう、errores（複数）に合わせた受身の se。\n第3話ね。' }] },
    { t: 'say', who: 'pepa', x: '今日は se の総まとめ。\nそれと、最後の1つ。\n「偽物の se」を教えるわ。' },
    { t: 'say', who: 'ramon', x: '市役所へ行ってこい！\nお金の行方をつかむんだ。' },

    /* ---------- 市役所 ---------- */
    { t: 'scene', place: 'ayuntamiento', cast: ['leo', 'pepa', 'nuria'] },
    { t: 'say', who: 'nuria', es: 'Buenos días. Soy Nuria, del ayuntamiento.', x: 'おはようございます。\n市役所のヌリアです。' },
    { t: 'inspect', spots: [
      { e: '📝', n: '机のメモ', steps: [
        { t: 'say', who: 'nuria', es: 'Le di el dinero a Pedro.', x: 'セラーノさんの机のメモです。\n「ペドロにお金をあげた」' },
        { t: 'ask', q: 'この文の le は、だれのこと？', es: 'Le di el dinero a Pedro.', o: ['Pedro（ペドロ）', 'el dinero（お金）'], a: 0,
          r: [{ t: 'say', who: 'pepa', x: 'a Pedro のことね。le は「彼に」。\n第6話でも出てきたわ。' }] },
        { t: 'say', who: 'nuria', es: 'Se lo di a Pedro.', x: '次の行は、こう書いてあります。' },
        { t: 'ask', q: '2つの文は同じ意味。le にあたるのは、2つ目の文のどれ？', es: 'Se lo di a Pedro.', o: ['se', 'lo'], a: 0,
          ng: 'lo は el dinero（お金を）のほう。',
          r: [{ t: 'say', who: 'pepa', x: 'そう。le が se に変わったの。\nlo は el dinero（お金を）よ。' }] },
        { t: 'note', title: 'le が se に変わるだけ', rows: [
          ['[Le] di el dinero a Pedro.', 'ペドロにお金をあげた。'],
          ['[Se lo] di a Pedro.', 'それをペドロにあげた。'],
          ['Les di las llaves a Ana y Luis.', 'アナとルイスに鍵をあげた。'],
          ['[Se las] di a Ana y Luis.', 'それらを、2人にあげた。']],
          x: '**le・les のあとに lo・la・los・las が続くと、\nle・les は se に変わる**\nこの se は「自分」ではなく **「彼に・彼女に・あなたに」**。\n((偽物の se))と覚えよう。\n__見分け：se のすぐあとに lo・la・los・las__',
          why: 'le lo は、言いにくい音。\n昔は ge lo のような音だったのが se に変わって、\nそのまま残ったの。\nだから se に見えても、中身は le よ。' },
        { t: 'tap', q: 'この se が「彼に」だとわかるのは、どの語？', es: 'Se lo di a Pedro.', ja: 'それをペドロにあげた。', a: ['lo'],
          ng: 'se のすぐあとにある語を見て。',
          r: [{ t: 'say', who: 'pepa', x: 'se の次に lo が来たら、まず le の変身を疑う。\n再帰の se（自分に）とは別ものよ。' }] },
        { t: 'ask', q: 'Pedro se lava. の se と、Se lo di. の se。「自分」の意味なのは？', es: 'Pedro se lava.', o: ['Pedro se lava. のほう', 'Se lo di. のほう'], a: 0,
          ng: 'lava（洗う）のあとに lo・la はない。',
          r: [{ t: 'say', who: 'pepa', x: 'Pedro se lava は、ペドロが自分を洗う。\nSe lo di の se は「彼に」。ぜんぜんちがうの。' }] }
      ] },
      { e: '🔐', n: '金庫', steps: [
        { t: 'say', who: 'nuria', es: 'La caja estaba cerrada con llave.', x: '金庫には、鍵がかかっていました。' },
        { t: 'ask', q: 'estaba cerrada は、何を言っている？', es: 'La caja estaba cerrada.', o: ['いまの様子だけ', 'だれかが閉めている最中'], a: 0,
          r: [{ t: 'say', who: 'pepa', x: 'estar ＋ 過去分詞。だれが閉めたかは問わない。\n第2話ね。' }] },
        { t: 'say', who: 'nuria', es: 'La caja se abre con una llave.', x: '金庫は、鍵1つで開きます。\nその鍵を持っているのは…セラーノさんだけ。' },
        { t: 'ask', q: 'se abre の se は、どの se？', es: 'La caja se abre con una llave.', o: ['受身の se（開けられる）', '偽物の se（le の変身）'], a: 0,
          ng: 'se のすぐあとに lo・la はある？',
          r: [{ t: 'say', who: 'pepa', x: 'abre のあとは con。lo・la はない。\n主語は la caja（物）で、受身の se よ。' }] },
        { t: 'get', ev: 'llave' }
      ] },
      { e: '🧾', n: '銀行の控え', steps: [
        { t: 'say', who: 'nuria', es: 'El dinero fue enviado por el señor Serrano.', x: '銀行の控えです。\n「お金は、セラーノさんによって送られた」' },
        { t: 'ask', q: 'この文で、お金を送ったのは？', es: 'El dinero fue enviado por el señor Serrano.', o: ['el señor Serrano', 'el alcalde（市長）'], a: 0,
          r: [{ t: 'say', who: 'pepa', x: 'por のあとの人。\nser ＋ 過去分詞 ＋ por ね。第1話よ。' }] },
        { t: 'say', who: 'nuria', es: 'El dinero fue enviado a su hermano.', x: '送り先は、弟さんのゴンサロさんです。' },
        { t: 'get', ev: 'recibo' },
        { t: 'say', who: 'leo', x: '弟…？ 市長じゃなかったのか。' }
      ] }
    ] },

    /* ---------- 編集部（原稿） ---------- */
    { t: 'scene', place: 'redaccion', cast: ['leo', 'pepa', 'tito'] },
    { t: 'say', who: 'pepa', x: '手順の最後の1段が、これよ。' },
    { t: 'flow', upto: 7 },
    { t: 'say', who: 'pepa', x: 'これで7段。会見の発言は、\n上から順に当てはめれば見分けられるわ。' },
    { t: 'say', who: 'tito', x: '先輩！ 市長にお金をあげた、\nという原稿を書きました！' },
    { t: 'redpen', q: 'ティトの原稿に、まちがいが1つ。', es: 'Le lo di al alcalde.', bad: 'Le', o: ['Se', 'Les', 'Me'], a: 0, fix: 'Se lo di al alcalde.',
      ng: 'le の次に lo が来るとき、le は別の語に変わる。',
      r: [{ t: 'say', who: 'pepa', x: 'Le lo とは言わないの。\nle lo は、se lo に変わるのよ。' }] },
    { t: 'say', who: 'leo', x: 'よし。会見の録音で、\nse を1つずつ見分けてみます！' },

    /* ---------- 記者会見室（見分け） ---------- */
    { t: 'scene', place: 'prensa', cast: ['leo', 'pepa'] },
    { t: 'enter', who: 'seba' },
    { t: 'say', who: 'seba', es: 'Buenas tardes. Soy Sebastián Serrano.', x: 'こんにちは。広報官のセラーノです。' },
    { t: 'say', who: 'pepa', x: '会見の発言を、ひとつずつ見分けましょう。\n手順の上の段から当てはめてね。' },
    { t: 'who', q: '1つ目。この文の、やった人は？', es: 'Se cometieron errores.', ja: '誤りがありました。', o: ['alguien', 'gente', 'nadie', 'mismo'], a: 0,
      ng: 'cometieron は複数。主語は物か人か。',
      r: [{ t: 'say', who: 'pepa', x: '主語は errores（物）。受身の se。\nやった人は書いていないから「だれか」ね。' }] },
    { t: 'who', q: '2つ目。この文は？', es: 'Se dice que la fiesta es el sábado.', ja: 'お祭りは土曜日だと言われている。', o: ['gente', 'alguien', 'por', 'mutuo'], a: 0,
      ng: 'dice は単数。主語になる物はある？',
      r: [{ t: 'say', who: 'pepa', x: 'dice はいつも単数で、主語がない。\n無人称の se。「人は言う」よ。' }] },
    { t: 'who', q: '3つ目。この文は？', es: 'Se me perdió la llave.', ja: '（うっかり）鍵をなくした。', o: ['nadie', 'alguien', 'mismo', 'le'], a: 0,
      ng: 'se のあとに me がある。',
      r: [{ t: 'say', who: 'pepa', x: 'me があるから「勝手に」の se。\nなくした本人は「困った人」ね。' }] },
    { t: 'who', q: '4つ目。この文は？', es: 'Se lo di al alcalde.', ja: 'それを市長にあげた。', o: ['le', 'mismo', 'gente', 'alguien'], a: 0,
      ng: 'se のすぐあとに何がある？',
      r: [{ t: 'say', who: 'pepa', x: 'se の次が lo。偽物の se ね。\nあげたのは、ふつうに言った本人よ。' }] },
    { t: 'who', q: '5つ目。この文は？', es: 'El dinero fue enviado por el banco.', ja: 'お金は、銀行によって送られた。', o: ['por', 'alguien', 'estado', 'le'], a: 0,
      r: [{ t: 'say', who: 'pepa', x: 'ser ＋ 過去分詞 ＋ por。\npor のあとが、やった人。' }] },
    { t: 'who', q: '6つ目。この文は？', es: 'La caja estaba cerrada.', ja: '金庫は閉まっていた。', o: ['estado', 'alguien', 'por', 'nadie'], a: 0,
      r: [{ t: 'say', who: 'pepa', x: 'estar ＋ 過去分詞。\nいまの様子だけで、だれがしたかは問わない。' }] },
    { t: 'who', q: '7つ目。この文は？', es: 'Nos vimos en el café.', ja: '私たちは、カフェで会った。', o: ['mutuo', 'mismo', 'gente', 'le'], a: 0,
      ng: '主語は「私たち」。何人いる？',
      r: [{ t: 'say', who: 'pepa', x: '主語が複数（nosotros）で、nos。\n「おたがいに」の相互の se の仲間ね。' }] },
    { t: 'who', q: '最後。この文は？', es: 'El señor Serrano se levantó temprano.', ja: 'セラーノさんは、早く起きた。', o: ['mismo', 'mutuo', 'alguien', 'nadie'], a: 0,
      ng: '主語は1人の人。',
      r: [{ t: 'say', who: 'pepa', x: '主語は1人で、se は本人自身。\n再帰の se よ。' }] },
    { t: 'say', who: 'leo', x: '8つとも、見分けられた。\nじゃあ、この会見の「Se」の正体は…！' },

    /* ---------- 記者会見室（対決） ---------- */
    { t: 'scene', place: 'prensa', cast: ['leo', 'pepa'], duel: true },
    { t: 'enter', who: 'seba' },
    { t: 'say', who: 'pepa', x: '最後の対決よ。\nごまかしの行を見つけたら、\n「¡Un momento!」で止めて。' },
    { t: 'stop', who: 'seba', title: '記者会見', hint: 'お金を「だれがなくしたか」を、se で消している行は？', lines: [
      { es: 'Se cometieron errores.', ja: '誤りがありました。' },
      { es: 'Se dice que el dinero está en el banco.', ja: 'お金は銀行にある、と言われています。' },
      { es: 'Se perdió el dinero de la fiesta.', ja: 'お祭りのお金がなくなりました。' },
      { es: 'La fiesta es el sábado.', ja: 'お祭りは土曜日です。' }
    ], a: 2, after: [
      { t: 'say', who: 'leo', x: 'お金は、ひとりでに消えたりしない。\n「なくなった」と言って、だれかを消している！' },
      { t: 'ask', q: 'se を使わずに、能動の文で言うと？', o: ['Usted perdió el dinero.', 'El dinero perdió a usted.', 'Se perdió usted el dinero.'], a: 0,
        ng: '主語（やった人）が先頭に来る文。',
        r: [{ t: 'say', who: 'leo', es: '¡Usted perdió el dinero!', x: 'あなたが、お金をなくしたんです！' }] },
      { t: 'say', who: 'seba', es: 'No, no. Se lo di al alcalde.', x: 'ち、ちがう！ 市長に渡したんだ。' }
    ] },
    { t: 'testimony', who: 'seba', title: 'お金の行方', hint: '銀行の控えを見てみて。送り先はどこだった？', lines: [
      { es: 'Yo guardé el dinero en la caja.', ja: '私は、お金を金庫に入れた。',
        press: [{ t: 'say', who: 'seba', es: 'Sí, el lunes por la mañana.', x: 'ああ、月曜の朝にな。' }] },
      { es: 'Se lo di al alcalde el lunes.', ja: '月曜に、それを市長にあげた。', ok: ['recibo'],
        press: [{ t: 'say', who: 'seba', es: 'Sí, al alcalde. Es verdad.', x: 'そう、市長にだ。ほんとうだ。' }, { t: 'say', who: 'pepa', x: 'se lo の se は「彼に」。\nその「彼」は、ほんとうに市長かしら。' }] },
      { es: 'Yo no tengo el dinero.', ja: '私は、お金を持っていない。' }
    ], after: [
      { t: 'say', who: 'leo', x: '銀行の控えでは、お金を送ったのは\nあなた自身。送り先は、弟さんです！' },
      { t: 'ask', q: '控えのとおりに言うと？', o: ['Se lo di a mi hermano.', 'Se lo di al alcalde.', 'Mi hermano se lo dio.'], a: 0,
        ng: '送り先はだれ？ その人を a のあとに。',
        r: [{ t: 'say', who: 'leo', es: '¡Se lo dio a su hermano!', x: '弟さんにあげたんです！' }] },
      { t: 'say', who: 'seba', es: 'Bueno... mi hermano necesita dinero.', x: 'う…弟は、お金に困っていて。' }
    ] },
    { t: 'testimony', who: 'seba', title: '金庫', hint: 'あの金庫の鍵は、いくつあった？', lines: [
      { es: 'Yo nunca abrí la caja.', ja: '私は、金庫を開けたことはない。' },
      { es: 'La caja estaba cerrada y nadie la abrió.', ja: '金庫は閉まっていて、だれも開けなかった。', ok: ['llave'],
        press: [{ t: 'say', who: 'seba', es: 'Nadie, nadie. Lo juro.', x: 'だれもだ。ちかってもいい。' }] },
      { es: 'El dinero se perdió solo.', ja: 'お金は、ひとりでになくなった。' }
    ], after: [
      { t: 'say', who: 'leo', x: '鍵は1つだけ。持っているのは\nあなただけです！' },
      { t: 'ask', q: 'つまり金庫を開けたのは？', o: ['usted（セラーノさん）', 'nadie（だれも）'], a: 0,
        r: [{ t: 'say', who: 'leo', es: 'La caja fue abierta por usted.', x: '金庫は、あなたに開けられたんです！' }] },
      { t: 'say', who: 'seba', es: '¡Ay, no!', x: 'あっ…！' }
    ] },
    { t: 'interp', es: 'Se lo di al alcalde.', ja: '私は、自分にそれをあげた。',
      o: ['私は、自分にそれをあげた。', '私は、それを市長にあげた。', 'それは市長にあげられた。'], a: 1,
      ng: 'se のあとに lo が続いている。',
      after: [{ t: 'say', who: 'tito', x: 'す、すみません！ se lo の se は\n「自分に」じゃなくて「市長に」でした…' }] },
    { t: 'who', q: '最後に、記事の文を確かめよう。この文の、やった人は？', es: 'Se lo di a mi hermano.', ja: 'それを弟にあげた。', o: ['le', 'alguien', 'mismo', 'gente'], a: 0,
      r: [{ t: 'say', who: 'pepa', x: 'あげたのは、言った本人。\nse は「弟に」の偽物の se ね。' }] },
    { t: 'build', q: 'とどめの一言を組み立てよう：「あなたは、それを弟にあげた！」', es: 'Usted se lo dio a su hermano.', x: ['le', 'di'],
      r: [{ t: 'slam', txt: '¡Usted se lo dio!' }] },
    { t: 'say', who: 'seba', es: 'Lo siento... Todo es verdad.', x: 'すまない…。ぜんぶ、ほんとうだ。' },
    { t: 'say', who: 'nuria', es: 'El dinero vuelve a la fiesta.', x: 'お金は、お祭りにもどるのね。' },
    { t: 'scoop', txt: '号外！ 祭りのお金、広報官が弟に渡す', es: 'El señor Serrano se lo dio a su hermano.' },
    { t: 'say', who: 'pepa', x: '全7話、おつかれさま。\nどんな se も、手順を上から使えば見分けられるわ。' },
    { t: 'say', who: 'pepa', x: 'デスクの「即答ドリル」と、\n「西検チャレンジ」で、腕をためしてね。' }
  ]
});
