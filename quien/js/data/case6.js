/* 第6話 割れた優勝カップ — 「勝手に」の se・se me（うっかり）・強めの se */
QF.cases.push({
  id: 'c6', no: 6, title: '割れた優勝カップ', es: 'Se me rompió', icon: '🏆',
  grammar: '「勝手に」の se・se me（うっかり）・強めの se',
  cover: '下町サッカークラブの優勝カップが、粉々に割れていた。みんな「Se rompió.」「Se me cayó.」と言う。ひとりでに割れたのか、それとも…。',
  cast: {
    sara: { n: 'サラ', es: 'Sara', e: '👩', role: 'クラブの会長' },
    nico: { n: 'ニコ', es: 'Nico', e: '👨', role: 'チームのキャプテン' },
    lola: { n: 'ロラ', es: 'Lola', e: '💁', role: '駅の係員' }
  },
  evidence: {
    vitrina:  { e: '🗄', n: 'ガラスの棚', d: '棚は高さ 2 メートル。ガラスの戸には鍵がかかっていて、ひとりでには開かない。' },
    registro: { e: '📒', n: '受付ノート', d: '夜 8 時に棚の鍵を借りたのは、キャプテンのニコ。' },
    trozos:   { e: '🧩', n: 'カップのかけら', d: 'かけらは、棚から 3 メートルはなれた壁ぎわまで飛んでいた。落ちただけなら、足もとに集まるはず。' }
  },
  steps: [
    /* ---------- 編集部 ---------- */
    { t: 'scene', place: 'redaccion', cast: ['leo', 'pepa', 'ramon'] },
    { t: 'say', who: 'ramon', x: 'レオ、下町クラブの優勝カップが\n割れたそうだ。クラブの宝物だぞ。' },
    { t: 'say', who: 'ramon', es: 'Se rompió la copa.', x: '「カップが割れた」…\nクラブの人は、みんなこう言うんだ。' },
    { t: 'say', who: 'leo', x: '「se」…また、やった人を書かない\n受身の se ですか？' },
    { t: 'say', who: 'pepa', x: 'いい勘ね。でも今回は、ちがう se\nかもしれないの。くらべてみましょう。' },
    { t: 'note', title: 'ふつうの文と、se の文', rows: [
      ['Juan abrió la puerta.', 'ファンがドアを開けた。'],
      ['La puerta [se] abrió.', 'ドアが開いた。']] },
    { t: 'ask', q: '下の文の主語（文の頭）は？', es: 'La puerta se abrió.', o: ['la puerta（ドア）', 'Juan（ファン）'], a: 0 },
    { t: 'ask', q: '「La puerta se abrió.」ドアは、どうなった？', o: ['ひとりでに開いた', 'だれかに開けられた'], a: 0,
      r: [{ t: 'say', who: 'pepa', x: 'se は「自分を」の意味。\nドアが「自分を開ける」＝「開く」。' }] },
    { t: 'note', title: '「勝手に」の se', rows: [
      ['Juan abrió la puerta.', 'ファンがドアを開けた。'],
      ['La puerta [se] abrió.', 'ドアが開いた。（ひとりでに）']],
      x: '**他動詞 ＋ se ＝「〜になる」（ひとりでに）**\nやった人は、いない。物のほうが主役。',
      why: 'se は「自分を」。\nドアが「自分を開ける」と考えると、\n人の手を借りず、ドアが勝手に開く。\nだから「開く」になるの。' },
    { t: 'say', who: 'pepa', x: 'ひとりでに起きたことの仮面は、\n**nadie**（だれも）にしましょう。' },
    { t: 'who', q: 'この文で、ドアを開けた人は？', es: 'La puerta se abrió.', ja: 'ドアが開いた。', o: ['nadie', 'alguien', 'por'], a: 0,
      ng: '「自分を開ける」＝ドアが勝手に開いた。',
      r: [{ t: 'say', who: 'pepa', x: 'やった人はいない、ということね。' }] },
    { t: 'say', who: 'ramon', x: 'ひとりでに割れたのか、だれかが\n割ったのか。レオ、スタジアムへ！' },

    /* ---------- サッカー場（取材） ---------- */
    { t: 'scene', place: 'estadio', cast: ['leo', 'pepa', 'sara', 'nico'] },
    { t: 'say', who: 'sara', es: 'Buenas tardes. Soy Sara, la presidenta.', x: 'こんにちは。会長のサラです。' },
    { t: 'inspect', spots: [
      { e: '🗄', n: 'ガラスの棚', steps: [
        { t: 'say', who: 'sara', es: 'La copa estaba en esta vitrina.', x: 'カップは、この棚に入っていました。' },
        { t: 'say', who: 'sara', es: 'La vitrina está cerrada con llave.', x: '棚は、鍵がかかっています。' },
        { t: 'get', ev: 'vitrina' },
        { t: 'say', who: 'leo', x: '鍵がかかっているのに、\nどうして割れたんでしょう。' },
        { t: 'say', who: 'sara', es: 'Anoche, Nico pidió la llave a las ocho.', x: 'ゆうべ 8 時に、ニコが鍵を借りに\n来ました。' },
        { t: 'get', ev: 'registro' },
        { t: 'ask', q: '「La puerta se cerró.」ドアはどうなった？', o: ['閉まった', '閉めた'], a: 0 },
        { t: 'note', title: '「勝手に」の se の仲間', rows: [
          ['abrir → abrirse', '開ける → 開く'],
          ['cerrar → cerrarse', '閉める → 閉まる'],
          ['perder → perderse', 'なくす → なくなる'],
          ['romper → romperse', '割る → 割れる'],
          ['caer → caerse', '落ちる → 落ちてしまう']],
          x: '**他動詞に se を付けると、自動詞（〜になる）。**',
          why: 'caer は元から「落ちる」。se が付くと、\n「落ちてしまった」と勢いが出るの。' },
        { t: 'ask', q: '___ に入るのは？', es: 'Las puertas se ___ solas.', o: ['abrió', 'abrieron'], a: 1,
          ng: 'las puertas は複数。動詞も物に合わせる。' }
      ] },
      { e: '🧑', n: 'ニコ', steps: [
        { t: 'say', who: 'nico', es: 'Lo siento mucho. Se me cayó la copa.', x: 'ごめんなさい…。\nカップが、わたしのせいで落ちて。' },
        { t: 'ask', q: '「Se cayó la copa.」に me が足された。この me は、だれのこと？', es: 'Se me cayó la copa.', o: ['話している本人（ニコ）', 'カップ'], a: 0,
          r: [{ t: 'say', who: 'pepa', x: 'そう。me は「わたしにとって」。\nカップが落ちて、困ったのはわたし、ね。' }] },
        { t: 'note', title: 'se me・se te・se le', rows: [
          ['Se cayó la copa.', 'カップが落ちた。'],
          ['Se [me] cayó la copa.', 'わたしは、うっかりカップを落とした。'],
          ['Se [te] cayó la copa.', 'きみは、うっかりカップを落とした。'],
          ['Se [le] cayó la copa.', '彼は、うっかりカップを落とした。']],
          x: '**se ＋ me・te・le ＋ 動詞**\nme・te・le は「困った人」。わざとではない言い方。',
          why: 'se は「自分を」。物が勝手に落ちる。\nme はスペイン語でよく使う「〜にとって」の人。\n「わたしにとって、カップが落ちた」\n＝うっかり落ちちゃった。' },
        { t: 'tip', title: 'Se me 〜 は、言い訳の文法', x: '**わざとじゃない。勝手にそうなった。**\nそう言いたいときに使う形。\n言い訳に、よく出てくる。' },
        { t: 'note', title: '動詞は、物に合わせる', rows: [
          ['Se me rompió [el vaso].', 'うっかりコップを割った。'],
          ['Se me rompieron [las gafas].', 'うっかり眼鏡をこわした。'],
          ['Se me olvidó [la llave].', '鍵を忘れてしまった。']],
          x: '**動詞は、me ではなく物に合わせる。**',
          why: '本当の主語は、割れた物のほう。\nme は「困った人」を足しただけ。\nだから gafas が複数なら、rompieron。' },
        { t: 'tap', q: 'rompieron は、どの語に合わせた形？', es: 'Se me rompieron las gafas.', ja: 'うっかり眼鏡をこわした。', a: ['gafas'],
          ng: '動詞は、割れた物に合わせる。' },
        { t: 'tap', q: '「困った人」を表す語は？', es: 'Se le perdió el billete.', ja: '彼は、うっかり切符をなくした。', a: ['le'],
          r: [{ t: 'say', who: 'pepa', x: 'そう、le が困った人。\nme・le は「勝手に」の文の目印よ。' }] }
      ] },
      { e: '🧩', n: '床のかけら', steps: [
        { t: 'say', who: 'leo', x: 'かけらが、棚から遠くまで\n飛んでいますね。' },
        { t: 'get', ev: 'trozos' },
        { t: 'say', who: 'pepa', x: 'ここで大事な話。第3話の受身の se と\n見かけが同じ文があるの。' },
        { t: 'note', title: '受身の se と「勝手に」の se', rows: [
          ['Se vendieron las entradas.', '入場券が売られた。（だれかが売った）'],
          ['Se rompió la ventana.', '窓が割れた。（ひとりでに）']],
          x: '**同じ「se ＋ 動詞 ＋ 物」でも、意味がちがうことがある。**\n決め手は、**動詞の意味と文脈**。',
          why: '券を売るのは、人にしかできない。\n窓は、風でも割れる。\n人がやる動詞は受身、物に起きる動詞は\n「勝手に」になりやすいの。' },
        { t: 'ask', q: '「ドアが風で閉まった」。この se は？', es: 'Se cerró la puerta con el viento.', o: ['「勝手に」の se', '受身の se'], a: 0,
          r: [{ t: 'say', who: 'pepa', x: '風で閉まったなら、だれのしわざでも\nないわね。' }] },
        { t: 'ask', q: '「入場券が売られた」。この se は？', es: 'Se vendieron las entradas.', o: ['「勝手に」の se', '受身の se'], a: 1,
          ng: '券は、ひとりでには売れない。' },
        { t: 'say', who: 'leo', x: 'では「Se rompió la copa」は、\nどちらなんでしょう。' }
      ] }
    ] },

    /* ---------- 駅（強めの se） ---------- */
    { t: 'scene', place: 'estacion', cast: ['leo', 'pepa', 'lola'] },
    { t: 'say', who: 'pepa', x: 'ニコが帰りに使う駅で、もうひとつ\nse の使い方を覚えましょう。' },
    { t: 'inspect', spots: [
      { e: '🚪', n: '改札', steps: [
        { t: 'say', who: 'lola', es: 'Me voy a casa. Hasta mañana.', x: 'もう帰りますね。また明日。' },
        { t: 'ask', q: '「Voy a casa.」に me が付いた。どんな感じになる？', es: 'Me voy a casa.', o: ['ここを離れて帰る', '家へ行く（ふつう）'], a: 0 },
        { t: 'note', title: '強めの se：irse', rows: [
          ['Voy a casa.', '家へ行く。'],
          ['[Me] voy a casa.', '家へ帰る（立ち去る）。'],
          ['[Se] fue a las ocho.', '8 時に立ち去った。']],
          x: '**ir → irse**「行く」→「立ち去る」',
          why: 'se は「自分を」。自分をその場から\n向こうへ行かせる。\nだから「立ち去る」感じになるの。' },
        { t: 'ask', q: '___ に入るのは？', es: '___ voy a casa.', o: ['Me', 'Te', 'Se'], a: 0,
          ng: 'voy は「わたし」の形。' }
      ] },
      { e: '🪑', n: 'ベンチ', steps: [
        { t: 'say', who: 'lola', es: 'Un niño se durmió en el tren.', x: 'ある子が、電車で寝入っちゃってね。' },
        { t: 'note', title: '強めの se：dormirse', rows: [
          ['dormir → dormirse', '眠る → 寝入る'],
          ['Se durmió en el tren.', '電車で寝入ってしまった。']],
          x: '**dormir → dormirse**「眠る」→「寝入る」',
          why: 'se が付くと、眠りに「落ちる」瞬間を表す。\n自分で眠りに入っていく感じなの。' },
        { t: 'ask', q: '___ に入るのは？', es: 'El niño ___ durmió en el tren.', o: ['se', 'me', 'te'], a: 0,
          ng: 'el niño は「彼」。3人称の se。' }
      ] },
      { e: '🥐', n: '売店', steps: [
        { t: 'say', who: 'lola', es: 'El niño se comió todo el pastel.', x: 'その子、ケーキを全部たいらげたの。' },
        { t: 'ask', q: 'comer（食べる）に se が付くと？', o: ['ぜんぶ食べきる', '少しだけ食べる'], a: 0 },
        { t: 'note', title: '強めの se：comerse', rows: [
          ['Comí un pastel.', 'ケーキを食べた。'],
          ['Me comí todo el pastel.', 'ケーキを全部たいらげた。']],
          x: '**comer → comerse**「食べる」→「たいらげる」',
          why: 'se が付くと、自分の中にぜんぶ入れる感じ。\nだから「ぜんぶ食べきる」になるの。' }
      ] }
    ] },
    { t: 'say', who: 'pepa', x: 'この se は強めの se。意味は少し変わる\nけれど、「自分を」の気持ちは同じよ。' },
    { t: 'flow', upto: 6 },
    { t: 'say', who: 'pepa', x: '見分けの手順に、6段目が増えたわ。\n物がひとりでにそうなったか、見てね。' },

    /* ---------- 編集部（原稿） ---------- */
    { t: 'scene', place: 'redaccion', cast: ['leo', 'pepa', 'tito'] },
    { t: 'say', who: 'tito', x: '先輩！ ニコさんの言い訳を\n先に原稿にしました！' },
    { t: 'redpen', q: 'ティトの原稿に、まちがいが1つ。', es: 'Se me rompió las gafas.', bad: 'rompió', o: ['rompieron', 'rompiste', 'rompí'], a: 0, fix: 'Se me rompieron las gafas.',
      ng: '動詞は me ではなく、割れた物（gafas）に合わせる。',
      r: [{ t: 'say', who: 'pepa', x: 'gafas は複数だから rompieron。\n動詞は物に合わせる、だったわね。' }] },
    { t: 'say', who: 'leo', x: 'でも、ニコの「Se me cayó」は\n本当かな…。もう一度、話を聞こう。' },

    /* ---------- サッカー場（対決） ---------- */
    { t: 'scene', place: 'estadio', cast: ['leo', 'pepa'], duel: true },
    { t: 'enter', who: 'nico' },
    { t: 'say', who: 'nico', es: 'Soy Nico, el capitán del equipo.', x: 'キャプテンのニコだ。\n悪いけど、うっかりなんだ。' },
    { t: 'testimony', who: 'nico', title: 'ゆうべのこと', hint: '棚は、ひとりでに開くかな？ 棚のメモを見てみて。', lines: [
      { es: 'Anoche yo estaba en el vestuario.', ja: 'ゆうべは、ロッカー室にいた。',
        press: [{ t: 'say', who: 'nico', es: 'Sí, un rato.', x: 'ああ、少しの間だけな。' }] },
      { es: 'La vitrina se abrió sola.', ja: '棚は、ひとりでに開いたんだ。', ok: ['vitrina'],
        press: [{ t: 'say', who: 'nico', es: 'Sí, sola. Yo no hice nada.', x: 'そうだ、ひとりでに。\nわたしは何もしていない。' }] },
      { es: 'Entonces se me cayó la copa.', ja: 'それで、うっかりカップを落とした。' }
    ], after: [
      { t: 'say', who: 'leo', x: '棚は鍵がかかっていた。\nひとりでには開きません！' },
      { t: 'say', who: 'nico', es: 'Bueno... yo pedí la llave.', x: 'ま、まあ…鍵は借りたけどな。' }
    ] },
    { t: 'present', q: '棚を開けたのは、だれ？ メモをつきつけて！', ok: ['registro'],
      after: [{ t: 'say', who: 'leo', x: '受付ノートに、8 時に鍵を借りた\nと書いてあります。あなたですね。' }] },
    { t: 'testimony', who: 'nico', title: 'カップのかけら', hint: 'かけらは、どこまで飛んでいた？', lines: [
      { es: 'Se me cayó la copa al suelo.', ja: 'カップが、床に落ちたんだ。' },
      { es: 'Los trozos están cerca de la vitrina.', ja: 'かけらは、棚のそばに散らばっている。', ok: ['trozos'],
        press: [{ t: 'say', who: 'nico', es: 'Sí, muy cerca.', x: 'ああ、すぐそばだ。' }] },
      { es: 'No fue mi culpa.', ja: 'わたしのせいじゃない。' }
    ], after: [
      { t: 'say', who: 'leo', x: 'かけらは、壁ぎわの 3 メートル先まで\n飛んでいました。' },
      { t: 'ask', q: 'カップが落ちただけなら、かけらは？', o: ['足もとに集まる', '壁まで飛ぶ'], a: 0 },
      { t: 'ask', q: 'つまり、カップは？', o: ['うっかり落ちたのではなく、勢いよく割られた', 'ひとりでに割れた'], a: 0,
        r: [{ t: 'say', who: 'leo', x: '「Se me cayó」は言い訳です。\nだれかが、割ったんだ！' }] }
    ] },
    { t: 'interp', es: 'Se me cayó la copa.', ja: 'わたしは、カップを投げ落とした。',
      o: ['わたしは、カップを投げ落とした。', 'うっかり、カップが落ちてしまった。', 'わたしのカップが、落ちた。'], a: 1,
      ng: 'me は「やった人」ではなく「困った人」。',
      after: [{ t: 'say', who: 'tito', x: 'す、すみません！ me は\n「困った人」で、うっかりでした。' }] },
    { t: 'who', q: 'ニコの言い訳の文では、だれがやったことになっている？', es: 'Se me cayó la copa.', ja: 'うっかりカップを落とした。', o: ['nadie', 'alguien', 'gente', 'mismo', 'por'], a: 0,
      ng: '「勝手にそうなった」と言っている。',
      r: [{ t: 'say', who: 'pepa', x: 'だれのせいでもない、という言い方ね。\nでも、証拠はそうなっていないわ。' }] },
    { t: 'build', q: 'とどめの一言を組み立てよう：「あなたが、カップを割った！」', es: 'Usted rompió la copa.', x: ['se', 'me', 'cayó'],
      r: [{ t: 'slam', txt: '¡Usted rompió!' }] },
    { t: 'say', who: 'nico', es: 'Sí... yo rompí la copa. Estaba muy triste.', x: 'そう…割ったのは、わたしだ。\n試合に出られず、くやしくて。' },
    { t: 'say', who: 'sara', es: 'Vamos a ganar otra copa.', x: 'また、別のカップを取りに行きましょう。' },
    { t: 'scoop', txt: '優勝カップ、割ったのはキャプテン', es: 'El capitán rompió la copa del club.' },
    { t: 'say', who: 'pepa', x: 'おみごと。Se me 〜 は言い訳の文法。\n文脈を見て、見ぬいたわね。' }
  ]
});
