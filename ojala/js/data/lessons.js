/* =========================================================
 * ¡OJALÁ! — レッスン（台本）
 *
 *  戦後の港町。学ぶ人＝代書屋をついだ見習いの代書人。相棒は伝書バトのパロマ。
 *  物語の芯：代書人は、もと役所の清書係。事実（🔵 青）の書類はまちがえずに書けるが、
 *  人の心（🔴 赤＝願い・気持ち・まだ来ない日）を手紙にするのは、はじめて。
 *  依頼を重ねるうちに、赤い封蝋の意味（＝心）が分かっていく。依頼の終わりに短い独白（mono）。
 *  字を書けない・うまく言えない町の人の手紙を代わりに書き、封蝋で封をして届ける。
 *  que のあとが「本当のこと」なら 🔵 青い封蝋（直説法＝いつもの形）、
 *  「頭の中のこと（願い・気持ち・疑い・まだ）」なら 🔴 赤い封蝋（接続法）。
 *  色をまちがえると、届いた先で誤解された返事が来る（Dile que viene ／ venga）。
 *  レッスンの目次は表に出さない（ホームは港町の景色。次の「依頼」が自動で出てくる）。
 *
 *  教え方（docs/apps/ojala.md）
 *   見る → 根拠 → 結論 → 名前の順（docs/原則.md）。同じ「彼が来る」を、事実と願いで並べて見せ、ちがいを見つけてから名前（直説法・接続法）。
 *   変わるのは que のあとの動詞だけ、と言葉で言う。
 *   形の作り方は1つだけ：① yo の形 ② 最後の o をとる ③ 反対の母音（-ar は e、-er・-ir は a）④ 人ごとのいつもの語尾。1段ずつ見せる。
 *   ことば（願い・気持ち・疑い…）は、意味のまとまりごとに「なぜ赤か」を1行。となりに青（直説法）の文を置く。
 *   例外は -oy の4つ（vaya・sea・esté・dé）・haber（haya）・saber（sepa）・つづりの書きかえ（-car・-gar・-zar）だけ。
 *   作り方は1回だけ短く見せて、形は問題と 🖋 形の工房でくり返す。依頼の中心は「どちらの封蝋か」の使い分け。
 *
 *  日本語の文の書き方
 *    **…**   覚えること（マーカー）
 *    __…__   覚え方のヒント（💡波線）
 *    ((…))   この教材での呼び方・約束（グレー）
 *    `…`     スペイン語（中で下の色分けが使える）
 *    \n      改行
 *
 *  スペイン語の色分け（どの画面でも同じ色）
 *    {hable}   動詞の形（金色）
 *    [Marco]   呼びかけ・名前（水色）
 *    ^e^       変わった所（ピンク。語の中で使う：habl^e^）
 *
 *  ステップ
 *    say    { x, who }                          パロマ（who があればその人）が話す
 *    show   { tbl: [[左, 右], …], cap, es, ja }  ボード（表・例文）を出す。次のボードが出るまで残る
 *    ask    { q, es, o, a, pred, r, why }        問い。pred:true は予想（採点しない）。a が正解の番号
 *    forge  { w, cut, add, o, out, ja, hint }    形を作る：w の最後の cut をタップで消す → o から add を選ぶ → out が完成
 *    seal   { who, need, es, v, mood, o, a, out, ja, mis, why, fx }
 *           🔏 封蝋：who の依頼（need）→ 封蝋の色を選ぶ（mood:'sub' 赤／'ind' 青）→ es の ___ に入る形を o から選ぶ。
 *           色をまちがえると mis（届いた先での誤解の返事）が出る
 *    enter  { who }                              場面に人が来る
 *    tip    { id, ti, x, why }                   TIP カード（帳面の Tips に入る）
 *    map    { hi: ['wish'], x }                  封蝋の地図をボードに出す。hi の枝を光らせる。x はパロマの一言
 *    q      { id }                               問題バンクの1問
 *    drill  { n }                                このレッスンの問題から n 問
 *    letter { who, to, body: [[es, ja], …], sign, note, recv }
 *           書きあがった1通（宛名・本文・署名）を便せんに出し、封をして送る。body はその依頼で書いた文。
 *           recv:true は届いた手紙（読むだけ）
 *    mono   { x }                                代書人（わたし）の独白。1〜2行
 *    scene  { x }                                場面の地の文（いつ・なぜその人が来たか）。ボードに出す。2〜3行
 *
 *  例文・人物・町の名前は、このアプリのためのオリジナル。
 * ========================================================= */
window.OQ = window.OQ || {};

/* 町の人たち（場面に出る） */
OQ.people = {
  luz:     { e: '👩', n: 'ルス', d: '港の食堂で働く。船乗りのマルコの帰りを待っている' },
  nico:    { e: '👦', n: 'ニコ', d: '靴みがきの少年。いなかに母さんがいる' },
  anselmo: { e: '👴', n: 'アンセルモ', d: '時計職人のおじいさん。戦争で弟のフェリクスと離ればなれに' },
  ines:    { e: '👩‍🍳', n: 'イネス', d: 'パン屋のおかみさん。お客さんにも役所にも usted で書く' },
  teo:     { e: '📮', n: 'テオ', d: '郵便配達。町じゅうに手紙と返事を届ける' },
  marco:   { e: '🧑‍✈️', n: 'マルコ', d: 'ルスの恋人。船乗り' }
};

OQ.days = [
  { d: 1, ti: '代書屋の看板', x: '願いの que・-ar と -er・-ir の形 ＋ ボス' },
  { d: 2, ti: 'うれしい手紙・あやしい手紙', x: '気持ち・例外の形・疑いと必要 ＋ ボス' },
  { d: 3, ti: 'まだ見ぬ日', x: 'cuando・para que・さがしている人' },
  { d: 4, ti: '伝言のゆくえ', x: '伝える／頼む ＋ ラスボス ＋ 🎓 西検チャレンジ' }
];

/* 封蝋の地図（ボードに出す全体図）。starts＝出発点、nodes＝枝。from は出発点か別の枝の id、L はその枝を教えるレッスン番号（no）。
   kind:'ex' は例外の札。ex の {…} は動詞の形（金色）。
   出発点は3つ：形の作り方（yo の形から）・🔴 頭の中のこと（接続法）・🔵 本当のこと（いつもの形） */
OQ.map = {
  starts: [
    { id: 's-yo',   ti: '形の作り方', ex: 'hablo → hable', sub: 'yo の形から' },
    { id: 's-red',  ti: '🔴 頭の中のこと', ex: '接続法', sub: '願い・気持ち・疑い・まだ' },
    { id: 's-blue', ti: '🔵 本当のこと', ex: 'いつもの形', sub: '直説法' }
  ],
  nodes: [
    { id: 'sub-ar',  from: 's-yo',   L: 1, who: '-ar の動詞',      op: 'yo の形の o → e', ex: '{hable}・{trabaje}' },
    { id: 'sub-er',  from: 's-yo',   L: 2, who: '-er・-ir の動詞', op: 'yo の形の o → a', ex: '{coma}・{tenga}' },
    { id: 'ex6',     from: 's-yo',   L: 3, kind: 'ex', ti: '例外：形を覚える6つ', ex: '{vaya}・{sea}・{esté}・{dé}・{haya}・{sepa}' },
    { id: 'spell',   from: 's-yo',   L: 3, kind: 'ex', ti: 'e の前のつづりの書きかえ', ex: '{busque}・{llegue}・{empiece}' },
    { id: 'wish',    from: 's-red',  L: 1, who: '願い', op: 'quiero que・espero que', ex: 'Quiero que {hables}.' },
    { id: 'ojala',   from: 's-red',  L: 2, who: '願い（ひとこと）', op: 'ojalá', ex: 'Ojalá {venga}.' },
    { id: 'feel',    from: 's-red',  L: 3, who: '気持ち', op: 'me alegro de que・siento que', ex: 'Me alegro de que {estés} bien.' },
    { id: 'doubt',   from: 's-red',  L: 4, who: '疑い・かもしれない', op: 'no creo que・dudo que・es posible que・quizá・tal vez', ex: 'No creo que {llegue}.' },
    { id: 'need',    from: 's-red',  L: 4, who: '必要・大事', op: 'es necesario que・es importante que', ex: 'Es importante que {comas}.' },
    { id: 'yet',     from: 's-red',  L: 5, who: 'まだ起きていないこと', op: 'cuando（これから）・antes de que', ex: 'Cuando {vuelvas}…' },
    { id: 'purpose', from: 's-red',  L: 5, who: '目的', op: 'para que', ex: 'para que {leas}' },
    { id: 'unknown', from: 's-red',  L: 6, who: 'まだ見つからない人', op: 'busco…que・no hay nadie que', ex: 'Busco una persona que {sepa}…' },
    { id: 'order',   from: 's-red',  L: 7, who: '頼みを伝える', op: 'dile que・pedir que', ex: 'Dile que {venga}.' },
    { id: 'know',    from: 's-blue', L: 1, who: '知っている', op: 'sé que', ex: 'Sé que {trabajas}.' },
    { id: 'think',   from: 's-blue', L: 4, who: '本当だと思う', op: 'creo que・es verdad que', ex: 'Creo que {llega}.' },
    { id: 'habit',   from: 's-blue', L: 5, who: 'いつものこと', op: 'cuando（いつも）', ex: 'Cuando {termino}…' },
    { id: 'exist',   from: 's-blue', L: 6, who: 'もういる人', op: 'tengo…que', ex: 'Tengo un amigo que {habla}…' },
    { id: 'tell',    from: 's-blue', L: 7, who: '事実を伝える', op: 'dile que', ex: 'Dile que {viene}.' }
  ]
};

OQ.lessons = [
  /* ================= DAY 1 ================= */
  {
    id: 'L1', no: 1, day: 1, icon: '⚓', ti: 'はじめての依頼', sub: '願いの que ＋ -ar の動詞（hablo → hable）',
    ev: { who: 'luz', line: '海の上の人に、手紙を書いてほしいの。' },
    actors: [],   // 人は、はじめて話すとき（say・seal）に場面に来る
    steps: [
      { t: 'scene', x: '海辺の小さな港町。\n戦争が終わって、まだ三年。\nこの町には、字を書けない人が多い。' },
      { t: 'scene', x: 'わたしは、役所で清書の係をしていた。\n書類の字なら、まちがえずに書ける。' },
      { t: 'scene', x: '坂の上の代書屋のおばあさんが、\n目を悪くして、店をしめることになった。\n町の人が困らないよう、わたしが店をついだ。' },
      { t: 'say', x: 'いらっしゃい、代書人さん。\nわたしはパロマ。この店の伝書バト。\nおばあさんの代から、手紙を運んでるの。' },
      { t: 'say', x: 'この店には、決まりがあるの。\n事実を知らせる手紙は {{blue}}青い封蝋。\n願いや気持ちの手紙は {{red}}赤い封蝋。' },
      { t: 'mono', x: '色で、中身が分かるのか。\n役所の書類は、いつも同じ色の封だった。' },
      { t: 'say', x: 'あなたの字、きれいね。\nでも、手紙は書類とは少しちがうの。\nそのうち、分かると思う。' },
      { t: 'scene', x: '日が暮れて、港の食堂のあかりが消えるころ。\nエプロンのままの人が、店の戸をたたいた。' },
      { t: 'say', who: 'luz', x: 'こんばんは。港の食堂のルスです。\n仕事が終わって、走ってきたの。' },
      { t: 'say', who: 'luz', x: 'マルコの船から、三か月便りがないの。\n字に自信がなくて……\n手紙を、書いてもらえますか。' },
      { t: 'show', cap: 'ルスの手紙・2つの書き出し', tbl: [['Sé que {regresas} el lunes.', '（あなたが）月曜に帰ると、知ってる'], ['Espero que {regreses} el lunes.', '（あなたが）月曜に帰るといいな']] },
      { t: 'ask', pred: true, q: 'どちらも「マルコが帰る」の文。\nque のあとの動詞を見て。\nどこがちがう？', o: ['regresas と regreses で、語尾がちがう', 'どちらも同じ形', 'que の場所がちがう'], a: 0, r: '`{regresas}` と `{regreses}`。語尾がちがう。\n前の `Sé`・`Espero` は、いつもの形のまま。\n**変わるのは、que のあとの動詞だけ。**' },
      { t: 'ask', q: 'マルコが月曜に帰るのが\n**本当のこと**として書いてあるのは、どっち？', o: ['Sé que regresas（知ってる）', 'Espero que regreses（帰るといいな）'], a: 0, why: '`Sé que` は「知っている」。本当のことを書いている。`Espero que` は、まだ起きていないこと。ルスの頭の中の願い。' },
      { t: 'say', x: 'que のあとが**本当のこと**なら、いつもの形。\n**頭の中のこと**（願い）なら、形が変わる。' },
      { t: 'say', who: 'luz', x: 'それで、封蝋の色も2つなのね。' },
      { t: 'say', x: 'そう。いつもの形を**直説法**、\n形が変わるほうを**接続法**と呼ぶの。\n直説法は {{blue}}青、接続法は {{red}}赤で封をする。' },
      { t: 'ask', q: '`Espero que {regreses}` の `{regreses}` は？', o: ['接続法（{{red}}赤い封蝋）', '直説法（{{blue}}青い封蝋）'], a: 0, why: '`espero que`（〜だといいな）のあとは、頭の中の願い。だから接続法。' },
      { t: 'show', cap: '接続法の作り方（hablar 話す）', tbl: [['① yo（私）の形にする', 'habl^o^']] },
      { t: 'say', x: '接続法の作り方を、1段ずつ。\n① まず、yo（私）の形にする。\nhablar なら `{hablo}`。' },
      { t: 'show', cap: '接続法の作り方（hablar 話す）', tbl: [['① yo（私）の形にする', 'habl^o^'], ['② 最後の o をとる', 'habl-']] },
      { t: 'ask', q: '② `hablo` の最後の o をとると？', o: ['habl-', 'hablo', 'habla'], a: 0, why: '最後の1文字 o だけをとって `habl-`。' },
      { t: 'show', cap: '接続法の作り方（hablar 話す）', tbl: [['① yo（私）の形にする', 'habl^o^'], ['② 最後の o をとる', 'habl-'], ['③ 反対の母音をつける', 'habl^e^']] },
      { t: 'say', x: '③ -ar の動詞には **e** をつける。\n（-er・-ir の動詞なら **a**）\n((a と e を入れかえるので「反対の母音」))' },
      { t: 'forge', w: 'hablo', cut: 'o', add: 'e', o: ['a', 'e', 'i'], out: '{hable}', ja: '（私が）話すように', hint: '② **o** をタップして消す → ③ 母音をえらぶ' },
      { t: 'say', x: '④ 最後に、人ごとの語尾。\nいつもの形と同じ -s・-mos・-is・-n。' },
      { t: 'show', cap: 'hablar の接続法（人ごと）', tbl: [['yo', '{hable}'], ['tú', '{hables}'], ['él・ella・usted', '{hable}'], ['nosotros', '{hablemos}'], ['vosotros', '{habléis}'], ['ellos・ustedes', '{hablen}']] },
      { t: 'say', x: 'yo と él は、同じ `{hable}`。\ntú は s をつけて `{hables}`。' },
      { t: 'forge', w: 'llamo', cut: 'o', add: 'es', o: ['e', 'es', 'en'], out: '{llames}', ja: '（君が）電話するように', hint: 'tú の接続法を作ろう。まず **o** を消す' },
      { t: 'say', x: 'まとめると、作り方は1つだけ。\n**yo の形の o を、反対の母音に。**\nそれから、人ごとの語尾。' },
      { t: 'seal', who: 'luz', need: 'マルコに「早く帰ってきてほしい」と書いて。', es: 'Quiero que ___ pronto.', v: 'regresar', mood: 'sub', o: ['regresas', 'regreses', 'regrese'], a: 1, out: 'Quiero que {regreses} pronto.', ja: '早く帰ってきてほしい。',
        mis: 'マルコの返事：「早く帰る？ もう帰ることに決まってるの？ 船長はまだ何も言ってないよ……」', why: 'マルコは tú。`regreso` の o → e で `regrese`、tú の語尾 s で `{regreses}`。' },
      { t: 'seal', who: 'luz', need: '「船の上でも、ちゃんと休んでね」と書いて。', es: 'Espero que ___ bien.', v: 'descansar', mood: 'sub', o: ['descansas', 'descanses', 'descansen'], a: 1, out: 'Espero que {descanses} bien.', ja: 'よく休めるといいな。',
        mis: 'マルコの返事：「よく休んでる？ いや、毎晩見張りで、ぜんぜん休めてないけど……」', why: '`espero que` は願い。`descanso` → `{descanses}`（tú）。`descansen` は ellos・ustedes の形。' },
      { t: 'say', who: 'luz', x: 'それと……\n毎日がんばっているのは、\nちゃんと知ってるって。' },
      { t: 'seal', who: 'luz', need: '「あなたがたくさん働いているのは知ってる」と書いて。', es: 'Sé que ___ mucho.', v: 'trabajar', mood: 'ind', o: ['trabajas', 'trabajes', 'trabaje'], a: 0, out: 'Sé que {trabajas} mucho.', ja: 'あなたがたくさん働いていること、知ってる。',
        mis: 'マルコの返事：「もっと働いてほしいって？ これ以上は無理だよ……」', why: '`sé que`（知っている）のあとは本当のこと。いつもの形 `{trabajas}`。' },
      { t: 'tip', id: 't-l1', ti: '赤い封蝋＝接続法', x: '変わるのは que のあとの動詞だけ\nque のあとが **本当のこと** → いつもの形（直説法）\n`Sé que {hablas}.`\nque のあとが **頭の中のこと**（願い）→ 接続法\n`Quiero que {hables}.`\n作り方：① yo の形 ② o をとる ③ -ar は e ④ 人ごとの語尾' },
      { t: 'map', hi: ['sub-ar', 'wish'], x: '封蝋の地図に書きこんだわ。\n赤の枝には「願い」。\n形の枝には「-ar は o → e」。' },
      { t: 'drill', n: 8 },
      { t: 'letter', who: 'luz', to: 'Querido [Marco]:', body: [['Quiero que {regreses} pronto.', '早く帰ってきてほしい。'], ['Espero que {descanses} bien.', 'よく休めているといいな。'], ['Sé que {trabajas} mucho.', 'あなたがたくさん働いていること、知ってる。']], sign: 'Tu [Luz]' },
      { t: 'mono', x: '「帰ってくる」ではなく「帰ってきてほしい」。\n書類には、なかった書き方だ。' }
    ]
  },
  {
    id: 'L2', no: 2, day: 1, icon: '✉️', ti: 'いなかの母さんへ', sub: '-er・-ir の動詞（como → coma）・ojalá',
    ev: { who: 'nico', line: '母さんに手紙を出したいんだ。でも、字が書けなくて……' },
    actors: [],   // 人は、はじめて話すとき（say・seal）に場面に来る
    steps: [
      { t: 'scene', x: 'ルスの手紙は、朝の船で海へ出た。\n店を開けると、戸口に男の子がしゃがんでいた。' },
      { t: 'say', who: 'nico', x: '靴みがきのニコ。\nルスさんに聞いたんだ。\nここなら、手紙を書いてくれるって。' },
      { t: 'say', who: 'nico', x: 'いなかの母さんに、手紙を出したいんだ。\nぼく……字が書けなくて。' },
      { t: 'say', x: 'だいじょうぶ。\n言いたいことを、ゆっくり話して。\n字は、こちらで書くから。' },
      { t: 'show', cap: 'comer（食べる）の作り方', tbl: [['yo の形', 'com^o^'], ['接続法', '？？？']] },
      { t: 'ask', pred: true, q: '-ar の hablo は hable だった。\n-er の como は、何になると思う？', o: ['coma', 'come', 'comi'], a: 0, r: '`{coma}`。\n**-er・-ir は o → a**。\n-ar は e、-er・-ir は a。反対の母音ね。' },
      { t: 'forge', w: 'vivo', cut: 'o', add: 'a', o: ['a', 'e', 'i'], out: '{viva}', ja: '（私が）住むように', hint: 'yo の形の **o** をタップ' },
      { t: 'show', cap: 'comer の接続法（人ごと）', tbl: [['yo', '{coma}'], ['tú', '{comas}'], ['él・ella・usted', '{coma}'], ['nosotros', '{comamos}'], ['vosotros', '{comáis}'], ['ellos・ustedes', '{coman}']] },
      { t: 'say', who: 'nico', x: 'tener は？\nyo の形は tengo で、\nちょっと変な形だよ。' },
      { t: 'forge', w: 'tengo', cut: 'o', add: 'a', o: ['a', 'e'], out: '{tenga}', ja: '（私が）持っているように', hint: 'やることは同じ。**o** をタップ' },
      { t: 'say', x: 'yo の形がクセものでも、やることは同じ。\n原形でなく yo の形から作るのは、このため。\n`tengo` → `{tenga}`。g も、そのまま残る。' },
      { t: 'show', cap: 'yo の形がクセものの動詞', tbl: [['tengo（tener）', '{tenga}'], ['vengo（venir）', '{venga}'], ['hago（hacer）', '{haga}'], ['digo（decir）', '{diga}'], ['salgo（salir）', '{salga}'], ['conozco（conocer）', '{conozca}']] },
      { t: 'seal', who: 'nico', need: '母さんに「すぐに返事を書いてほしい」と書いて。', es: 'Quiero que me ___ pronto.', v: 'escribir', mood: 'sub', o: ['escribes', 'escribas', 'escriba'], a: 1, out: 'Quiero que me {escribas} pronto.', ja: 'すぐに手紙を書いてほしい。',
        mis: '母さんの返事：「わたしがすぐ書いてるって？ まだ1通も書いてないのに、だれから聞いたの？」', why: '母さんには tú。`escribo` → `escriba`、tú の語尾 s で `{escribas}`。' },
      { t: 'say', x: 'もうひとつ、願いのことば。\n`Ojalá` ＝「〜だといいなあ」。\nojalá のあとも 🔴 赤。' },
      { t: 'seal', who: 'nico', need: '母さんに「町に来られたらいいなあ」と書いて。', es: 'Ojalá ___ a la ciudad.', v: 'venir', mood: 'sub', o: ['vienes', 'vengas', 'venga'], a: 1, out: 'Ojalá {vengas} a la ciudad.', ja: '母さんが町に来られたらいいなあ。',
        mis: '母さんの返事：「わたしが町に行くことになってるの？ そんな話、聞いてないよ」', why: '`ojalá` のあとは願い。`vengo` → `venga`、母さんには tú なので `{vengas}`。' },
      { t: 'seal', who: 'nico', need: '「母さんがぼくを大事に思ってくれてるのは知ってる」と書いて。', es: 'Mamá, sé que me ___ mucho.', v: 'querer', mood: 'ind', o: ['quieres', 'quieras', 'quiera'], a: 0, out: '[Mamá], sé que me {quieres} mucho.', ja: '母さん、ぼくのことをとても大事に思ってくれてるの、知ってるよ。',
        mis: '母さんの返事：「大事に思ってほしいって？ そんなの、あたりまえでしょう……」', why: '`sé que` のあとは本当のこと。いつもの形 `{quieres}`。' },
      { t: 'say', x: '願う人と、する人が同じなら\n（自分が行きたい）、que はいらない。\n`Quiero ir.` 動詞は原形のまま。' },
      { t: 'say', who: 'nico', x: 'じゃあ、que と接続法になるのは？' },
      { t: 'say', x: '**別の人に**してほしいとき。\n`Quiero que {vengas}.`（君に来てほしい）' },
      { t: 'ask', q: '「（ぼくは）町で働きたい」は、どれ？', o: ['Quiero trabajar en la ciudad.', 'Quiero que trabaje en la ciudad.', 'Quiero que trabajo en la ciudad.'], a: 0, why: '自分がしたいことは、原形のまま `Quiero trabajar`。`Quiero que {trabaje}` だと「（だれかに）働いてほしい」になる。' },
      { t: 'tip', id: 't-l2', ti: '-er・-ir は o → a', x: 'yo の形の o → **-er・-ir は a**\n`como` → `{coma}`　`tengo` → `{tenga}`\n`Ojalá` のあとも接続法\n自分がする：`Quiero ir.`（que なし・原形）\n別の人にしてほしい：`Quiero que {vengas}.`' },
      { t: 'map', hi: ['sub-er', 'ojala'], x: '形の枝に「-er・-ir は o → a」。\n赤の枝に ojalá が増えたわ。' },
      { t: 'drill', n: 8 },
      { t: 'letter', who: 'nico', to: 'Querida mamá:', body: [['Sé que me {quieres} mucho.', 'ぼくのことを大事に思ってくれてるの、知ってるよ。'], ['Quiero que me {escribas} pronto.', 'すぐに手紙を書いてほしい。'], ['Ojalá {vengas} a la ciudad.', '町に来られたらいいなあ。']], sign: 'Tu hijo,\n[Nico]', note: '署名だけは、ニコが自分で書いた。大きくて、少しかたむいた字。' },
      { t: 'mono', x: 'ニコは字を知らない。\nでも、何を書きたいかは、だれよりも知っていた。' }
    ]
  },
  /* ================= DAY 2 ================= */
  {
    id: 'L3', no: 3, day: 2, icon: '🕰️', ti: '弟への手紙', sub: '気持ちの que ＋ 例外の6つ・つづりの書きかえ',
    ev: { who: 'anselmo', line: '戦争で別れた弟が、見つかったんじゃ……' },
    actors: [],   // 人は、はじめて話すとき（say・seal）に場面に来る
    steps: [
      { t: 'scene', x: 'いなかの母さんから、ニコに返事が来た。\n「その字は、だれが書いたの？」\n代書屋のうわさが、町に広がりはじめた。' },
      { t: 'say', who: 'anselmo', x: 'わしはアンセルモ。時計屋じゃ。\nパン屋で、ここのうわさを聞いてな。' },
      { t: 'say', who: 'anselmo', x: '戦争で別れた弟のフェリクスの名が、\n役所の名簿にのっておった。\nセビリアで、生きておる。' },
      { t: 'show', cap: 'アンセルモの気持ち', tbl: [['Sé que {vives} en Sevilla.', '君がセビリアに住んでいるのは、知っている'], ['Me alegro de que {vivas} en Sevilla.', '君がセビリアに住んでいて、うれしい'], ['Siento que {vivas} lejos.', '君が遠くに住んでいて、残念だ']] },
      { t: 'ask', pred: true, q: 'セビリアに住んでいるのは、本当のこと。\n`Sé que` は青。`Me alegro de que` は赤。\nなぜ？', o: ['「うれしい」「残念」という気持ちの文だから', 'うそを書いているから', 'これから先のことだから'], a: 0, r: '文のまん中は「うれしい」「残念」という**気持ち**。\n**気持ちの que も {{red}}赤**。' },
      { t: 'say', x: 'ここは、ふしぎに思うところ。\n事実でも、心で受けとめて言うときは赤。\n「知ってる」は青、「うれしい」は赤。' },
      { t: 'seal', who: 'anselmo', need: 'フェリクスに「おまえに仕事があって、うれしい」と書いてくれ。', es: 'Me alegro de que ___ trabajo.', v: 'tener', mood: 'sub', o: ['tienes', 'tengas', 'tenga'], a: 1, out: 'Me alegro de que {tengas} trabajo.', ja: 'おまえに仕事があって、うれしい。',
        mis: 'フェリクスの返事：「仕事があるのは知ってるよ。……で、兄さんはうれしくないの？」', why: '気持ち（`me alegro de que`）のあとは接続法。`tengo` → `{tengas}`（tú）。' },
      { t: 'say', x: 'ここからは、作り方が使えない動詞。\nyo の形が o で終わらないと、\no をとって母音をつけられないの。' },
      { t: 'show', cap: 'yo の形が -oy の4つ', tbl: [['voy（ir）', '{vaya}'], ['soy（ser）', '{sea}'], ['estoy（estar）', '{esté}'], ['doy（dar）', '{dé}'], ['´ は dé だけ', '{des}・{demos}・{den}']] },
      { t: 'say', x: 'この4つは、形をそのまま覚える。\nあと2つ。yo の形が `he`・`sé` の\n`haber` → `{haya}`　`saber` → `{sepa}`' },
      { t: 'show', cap: 'estar の接続法（人ごと）', tbl: [['yo', '{esté}'], ['tú', '{estés}'], ['él・ella・usted', '{esté}'], ['nosotros', '{estemos}'], ['vosotros', '{estéis}'], ['ellos・ustedes', '{estén}']] },
      { t: 'ask', q: '`ir`（行く）の、tú の接続法は？', o: ['vayas', 'vas', 'vaya'], a: 0, why: '`{vaya}` に tú の語尾 s をつけて `{vayas}`。`vas` は「君は行く」（いつもの形）。' },
      { t: 'seal', who: 'anselmo', need: '「おまえが元気で、うれしい」と書いてくれ。', es: 'Me alegro de que ___ bien.', v: 'estar', mood: 'sub', o: ['estás', 'estés', 'esté'], a: 1, out: 'Me alegro de que {estés} bien.', ja: 'おまえが元気で、うれしい。',
        mis: 'フェリクスの返事：「元気だよ。……それだけ？ 兄さん、なんだか冷たいな」', why: '気持ちの que → 接続法。estar は例外で `{esté}`、tú は `{estés}`。' },
      { t: 'say', x: 'もうひとつ、つづりの書きかえ。\n-car・-gar・-zar の動詞は、\ne の前で書きかえる。' },
      { t: 'show', cap: 'e の前のつづり', tbl: [['busco（buscar）', '{busque}'], ['llego（llegar）', '{llegue}'], ['empiezo（empezar）', '{empiece}']] },
      { t: 'say', x: '音を守るため。\nc のまま e をつけると「セ」の音。\nだから qu・gu・c に書きかえる。' },
      { t: 'seal', who: 'anselmo', need: '「おまえが早く着くといいな」と書いてくれ。', es: 'Espero que ___ pronto.', v: 'llegar', mood: 'sub', o: ['llegas', 'llegues', 'llegue'], a: 1, out: 'Espero que {llegues} pronto.', ja: 'おまえが早く着くといいな。',
        mis: 'フェリクスの返事：「もう着いてるって？ まだ汽車の切符も買ってないよ」', why: '願い → 接続法。`llego` → `{llegue}`（g のあとに u）、tú は `{llegues}`。' },
      { t: 'show', cap: 'yo の形で ie・ue になる動詞', tbl: [['quiero（querer）', '{quiera}'], ['puedo（poder）', '{pueda}'], ['vuelvo（volver）', '{vuelva}'], ['pienso（pensar）', '{piense}'], ['nosotros は原形の形にもどる', '{queramos}・{podamos}・{volvamos}']] },
      { t: 'say', x: '作り方は同じ。yo の形から。\nただ nosotros・vosotros だけは、\n原形の pod- にもどる：`{podamos}`。' },
      { t: 'ask', q: '`poder`（できる）の、nosotros の接続法は？', o: ['podamos', 'puedamos', 'podemos'], a: 0, why: 'nosotros・vosotros だけは原形の pod- にもどって `{podamos}`。`podemos` は「私たちはできる」（いつもの形）。' },
      { t: 'say', who: 'anselmo', x: 'これで、弟に届く。\n長いこと、言えなかった言葉じゃ。\n……返事は、来るかのう。' },
      { t: 'tip', id: 't-l3', ti: '例外は6つ＋つづり', x: '`{vaya}`・`{sea}`・`{esté}`・`{dé}`（-oy の4つ）\n`{haya}`（haber）・`{sepa}`（saber）\n-car・-gar・-zar：`{busque}`・`{llegue}`・`{empiece}`\nie・ue も yo の形から：`{quiera}`・`{pueda}`・`{vuelva}`（nosotros は `{podamos}`）\n気持ち（me alegro de que・siento que）→ 接続法（事実でも）\n知っている（sé que）→ いつもの形',
        why: 'nosotros・vosotros の形は、-ar・-er の動詞なら原形にもどる（`{podamos}`・`{pensemos}`）。-ir の動詞は e → i、o → u になる（`{pidamos}`・`{durmamos}`）。4級では読めれば OK。' },
      { t: 'map', hi: ['ex6', 'feel'], x: '形の枝に「例外の6つ」。\n赤の枝に「気持ち」。' },
      { t: 'drill', n: 8 },
      { t: 'letter', who: 'anselmo', to: 'Querido [Félix]:', body: [['Me alegro de que {estés} bien.', 'おまえが元気で、うれしい。'], ['Me alegro de que {tengas} trabajo.', 'おまえに仕事があって、うれしい。'], ['Espero que {llegues} pronto.', 'おまえが早く着くといいな。']], sign: 'Tu hermano,\n[Anselmo]' },
      { t: 'mono', x: '弟が生きているのは、本当のことだ。\nそれでも封蝋は赤。うれしい、が文のまん中にあるから。' }
    ]
  },
  {
    id: 'L4', no: 4, day: 2, icon: '🥖', ti: 'パン屋と役所', sub: '疑い・必要（no creo que・es necesario que）と本当のこと',
    ev: { who: 'ines', line: '役所に手紙を出したいの。小麦が届かなくて……' },
    actors: [],   // 人は、はじめて話すとき（say・seal）に場面に来る
    steps: [
      { t: 'scene', x: 'アンセルモの手紙を送って、二日。\n返事は、まだ来ない。\n朝いちばんに、粉だらけのエプロンの人が来た。' },
      { t: 'say', who: 'ines', x: 'パン屋のイネスです。\n小麦が、もうひと月も届かないの。\n役所に、手紙を出したくて。' },
      { t: 'say', who: 'ines', x: '役所の書き方なんて、分からない。\nアンセルモさんが、ここならって。' },
      { t: 'show', cap: 'イネスの手紙・2つの書き出し', tbl: [['Creo que la harina {llega} mañana.', '小麦粉は明日届くと思う'], ['No creo que la harina {llegue} mañana.', '明日届くとは思わない']] },
      { t: 'ask', pred: true, q: '`creo que` は青、`no creo que` は赤。\nどうしてだと思う？', o: ['「本当かどうか分からない」と思っているから', '「no」がある文は、いつも接続法だから', '明日のことだから'], a: 0, r: '`creo que` は「本当だ」と思っている。\n`no creo que` は「本当じゃないかも」。\n**疑い**の que は 🔴 赤。' },
      { t: 'show', cap: '本当？ 疑い？', tbl: [['🔵 本当だと思う', 'creo que・sé que・es verdad que'], ['🔴 本当かどうか分からない', 'no creo que・dudo que・es posible que'], ['Es posible que la harina {llegue} tarde.', '小麦粉は遅れて届くかもしれない']] },
      { t: 'show', cap: '文の頭の「たぶん」', tbl: [['Quizá {llueva} mañana.', '明日は雨かもしれない'], ['Tal vez {venga} el barco.', 'たぶん船が来る']] },
      { t: 'say', x: '`quizá`・`tal vez` も、本当か分からないこと。\n🔴 赤。ojalá と同じ、文の頭に置く。\n((わりと確かだと思うときは青も使う。試験では赤を選べばいい))' },
      { t: 'seal', who: 'ines', need: '役所に「明日届くとは思えません」と書いて。', es: 'No creo que la harina ___ mañana.', v: 'llegar', mood: 'sub', o: ['llega', 'llegue', 'llegues'], a: 1, out: 'No creo que la harina {llegue} mañana.', ja: '明日小麦粉が届くとは思えません。',
        mis: '役所の返事：「届くのは分かっていて、思わないだけ？ どういう意味ですか？」', why: '`no creo que` は疑い → 接続法。`llego` → `{llegue}`（él の形。主語は la harina）。' },
      { t: 'seal', who: 'ines', need: '「みなさんが忙しいのは、分かっています」と書いて。', es: 'Sé que ustedes ___ mucho trabajo.', v: 'tener', mood: 'ind', o: ['tienen', 'tengan', 'tenga'], a: 0, out: 'Sé que ustedes {tienen} mucho trabajo.', ja: 'みなさんにお仕事がたくさんあるのは分かっています。',
        mis: '役所の返事：「仕事がたくさんあってほしい、とは？ もう山ほどありますよ……」', why: '`sé que` のあとは本当のこと。ustedes のいつもの形 `{tienen}`。' },
      { t: 'say', x: '「〜が必要だ」「〜が大事だ」も、\nまだ起きていない、頭の中のこと。\n🔴 赤。' },
      { t: 'show', cap: '必要・大事', tbl: [['Es verdad que {abren} la tienda.', '店を開けるのは本当だ（事実）'], ['Es necesario que {abran} la tienda.', '店を開けることが必要だ（まだ）'], ['Es importante que la gente {coma} pan.', 'みんながパンを食べることが大事だ']] },
      { t: 'seal', who: 'ines', need: '「子どもたちがパンを食べられることが、大事なんです」と書いて。', es: 'Es importante que los niños ___ pan.', v: 'comer', mood: 'sub', o: ['comen', 'coman', 'coma'], a: 1, out: 'Es importante que los niños {coman} pan.', ja: '子どもたちがパンを食べることが大事です。',
        mis: '役所の返事：「子どもたちはもう食べているのですね。では、問題ありませんね」', why: '`es importante que` → 接続法。主語は los niños（ellos）なので `{coman}`。' },
      { t: 'say', x: 'ただし `es verdad que` は、\n本当のこと。🔵 青のまま。' },
      { t: 'ask', q: '「小麦粉が来るのは本当だ」は、どれ？', o: ['Es verdad que viene la harina.', 'Es verdad que venga la harina.', 'No creo que viene la harina.'], a: 0, why: '`es verdad que` は本当のこと → いつもの形 `{viene}`。`no creo que` なら接続法 `venga` になる。' },
      { t: 'seal', who: 'ines', need: '役所の人に「あなたが助けてくださるといいのですが」と書いて。', es: 'Espero que usted me ___.', v: 'ayudar', mood: 'sub', o: ['ayuda', 'ayude', 'ayudes'], a: 1, out: 'Espero que usted me {ayude}.', ja: 'あなたが助けてくださるといいのですが。',
        mis: '役所の返事：「わたしがもう助けている？ いえ、まだ何もしておりませんが……」', why: '願い → 接続法。usted は él と同じ形 `{ayude}`。`ayudes` は tú の形。' },
      { t: 'say', who: 'ines', x: 'これで、小麦が届くといいけど。\n……届かなかったら、また書いてね。' },
      { t: 'tip', id: 't-l4', ti: '疑いと必要は赤', x: '🔵 `sé que`・`creo que`・`es verdad que`\n🔴 `no creo que`・`dudo que`・`es posible que`（疑い・〜かもしれない）\n🔴 `quizá`・`tal vez`（文の頭の「たぶん」）\n🔴 `es necesario que`・`es importante que`（必要）' },
      { t: 'map', hi: ['doubt', 'need'], x: '赤の枝に「疑い」と「必要」。\ncreo que は、青の枝に書いたわ。' },
      { t: 'drill', n: 8 },
      { t: 'letter', who: 'ines', to: 'Estimado señor alcalde:', body: [['Sé que ustedes {tienen} mucho trabajo.', 'みなさんにお仕事がたくさんあるのは分かっています。'], ['No creo que la harina {llegue} mañana.', '明日小麦粉が届くとは思えません。'], ['Es importante que los niños {coman} pan.', '子どもたちがパンを食べることが大事です。'], ['Espero que usted me {ayude}.', 'あなたが助けてくださるといいのですが。']], sign: 'Atentamente,\n[Inés]' },
      { t: 'mono', x: '役所あての手紙なら、前のわたしにも書けた。\nでも「子どもたちに」の行で、ペンが少し重かった。' }
    ]
  },
  /* ================= DAY 3 ================= */
  {
    id: 'L5', no: 5, day: 3, icon: '⛵', ti: '帰ってきたら', sub: 'cuando（これから）・antes de que・para que',
    ev: { who: 'luz', line: 'マルコから返事が来たの。港に着いたら、会いに来るって。' },
    actors: [],   // 人は、はじめて話すとき（say・seal）に場面に来る
    steps: [
      { t: 'scene', x: 'イネスのパン屋に、小麦が半分だけ届いた。\n役所の返事は、ていねいで、短かった。\nその夕方、ルスが息を切らして来た。' },
      { t: 'say', who: 'luz', x: 'マルコから、返事が来たの。\n港に着いたら、会いに来るって。\n……もう一通、書いてくれる？' },
      { t: 'show', cap: '2つの cuando', tbl: [['Cuando {llego} al puerto, te llamo.', '港に着くと（いつも）電話する'], ['Cuando {llegue} al puerto, te llamo.', '港に着いたら、電話するよ']] },
      { t: 'ask', pred: true, q: '同じ cuando。\n形は、何で分かれる？', o: ['いつものことか、まだ起きていないことか', 'だれが着くか', '文の長さ'], a: 0, r: 'いつものこと（本当にあること）→ 🔵 青。\n**まだ起きていない、これからのこと** → 🔴 赤。' },
      { t: 'seal', who: 'luz', need: '「あなたが帰ってきたら、いっしょに踊ろう」と書いて。', es: 'Cuando ___, vamos a bailar.', v: 'volver', mood: 'sub', o: ['vuelves', 'vuelvas', 'vuelva'], a: 1, out: 'Cuando {vuelvas}, vamos a bailar.', ja: 'あなたが帰ってきたら、いっしょに踊ろう。',
        mis: 'マルコの返事：「ぼくが帰ると、いつも踊ってたっけ？ まだ一度も帰ってないのに！」', why: 'まだ帰っていない → 接続法。`vuelvo` → `{vuelvas}`（tú）。' },
      { t: 'seal', who: 'luz', need: '「わたし、仕事が終わると、いつも海を見るの」と書いて。', es: 'Cuando ___ de trabajar, miro el mar.', v: 'terminar', mood: 'ind', o: ['termino', 'termine', 'terminas'], a: 0, out: 'Cuando {termino} de trabajar, miro el mar.', ja: '仕事が終わると（いつも）、海を見るの。',
        mis: 'マルコの返事：「仕事が終わったら？ まだ終わってないの？ 大丈夫？」', why: 'いつものこと → いつもの形 `{termino}`（yo）。' },
      { t: 'say', x: '`antes de que`（〜する前に）と\n`para que`（〜するように）は、いつも 🔴 赤。\nque のあとは、まだ起きていないことだから。' },
      { t: 'show', cap: 'いつも赤', tbl: [['antes de que {salga} el barco', '船が出る前に'], ['para que no {estés} triste', '君が悲しくならないように']] },
      { t: 'forge', w: 'salgo', cut: 'o', add: 'a', o: ['a', 'e'], out: '{salga}', ja: '（船が）出る（前に）', hint: 'salir の yo の形。**o** をタップ' },
      { t: 'seal', who: 'luz', need: '「船が出る前に、わたしの手紙を受け取ってね」と書いて。', es: 'Recibe mi carta antes de que ___ el barco.', v: 'salir', mood: 'sub', o: ['sale', 'salga', 'salgas'], a: 1, out: 'Recibe mi carta antes de que {salga} el barco.', ja: '船が出る前に、わたしの手紙を受け取ってね。',
        mis: 'マルコの返事：「船はもう出たの？ じゃあ手紙はどこに……？」', why: '`antes de que` → いつも接続法。主語は el barco なので `{salga}`。' },
      { t: 'seal', who: 'luz', need: '「あなたがよく読めるように、大きな字で書くね」と書いて。', es: 'Escribo con letras grandes para que ___ bien.', v: 'leer', mood: 'sub', o: ['lees', 'leas', 'lea'], a: 1, out: 'Escribo con letras grandes para que {leas} bien.', ja: 'あなたがよく読めるように、大きな字で書くね。',
        mis: 'マルコの返事：「よく読めてるよ？ ……なんで急に大きな字に？」', why: '`para que` → いつも接続法。`leo` → `{leas}`（tú）。' },
      { t: 'say', who: 'luz', x: 'もうすぐ、会える。\n……手紙じゃなくて、\nちゃんと顔を見て言えるかな。' },
      { t: 'tip', id: 't-l5', ti: 'まだのこと・目的', x: 'cuando ＋ これから → 接続法　`Cuando {vuelvas}…`\ncuando ＋ いつものこと → いつもの形　`Cuando {termino}…`\n`antes de que`・`para que` → いつも接続法' },
      { t: 'map', hi: ['yet', 'purpose'], x: '赤に「まだ」と「目的」。\nいつもの cuando は、青の枝に。' },
      { t: 'drill', n: 8 },
      { t: 'letter', who: 'luz', to: 'Querido [Marco]:', body: [['Cuando {termino} de trabajar, miro el mar.', '仕事が終わると、いつも海を見るの。'], ['Escribo con letras grandes para que {leas} bien.', 'よく読めるように、大きな字で書くね。'], ['Recibe mi carta antes de que {salga} el barco.', '船が出る前に、この手紙を受け取ってね。'], ['Cuando {vuelvas}, vamos a bailar.', '帰ってきたら、いっしょに踊ろう。']], sign: 'Tu [Luz]' },
      { t: 'mono', x: 'まだ来ない日のことを書くと、文は赤くなる。\n待つ人の手紙は、赤い封蝋ばかりだ。' }
    ]
  },
  {
    id: 'L6', no: 6, day: 3, icon: '📰', ti: 'さがしています', sub: 'busco … que ＋ 接続法・no hay nadie que',
    ev: { who: 'nico', line: '「字が読める子を求む」って、貼り紙があったんだ。' },
    actors: [],   // 人は、はじめて話すとき（say・seal）に場面に来る
    steps: [
      { t: 'scene', x: 'パン屋に小麦がもどって、店はいそがしい。\nニコは、毎朝パン屋の前で靴をみがいている。' },
      { t: 'say', who: 'nico', x: '代書人さん、聞いて。\nパン屋のイネスさんが、\n人をさがしてるんだって。' },
      { t: 'say', who: 'ines', x: '店を手伝ってくれる人がほしいの。\n貼り紙を書いてくれる？' },
      { t: 'show', cap: '2つの「〜する人」', tbl: [['Tengo un amigo que {habla} inglés.', '英語を話す友だちがいる'], ['Busco un amigo que {hable} inglés.', '英語を話す友だちをさがしている']] },
      { t: 'ask', pred: true, q: 'どちらも「英語を話す友だち」。\nなぜ形がちがう？', o: ['もういる人か、まだ見つかっていない人か', '友だちの数がちがうから', '英語の話だから'], a: 0, r: '**もういる人**なら 🔵 青。\n**さがしている・いるか分からない人**なら 🔴 赤。\nque のあとが、頭の中の人だから。' },
      { t: 'seal', who: 'ines', need: '貼り紙に「料理ができる人をさがしています」と書いて。', es: 'Buscamos una persona que ___ cocinar.', v: 'saber', mood: 'sub', o: ['sabe', 'sepa', 'sabes'], a: 1, out: 'Buscamos una persona que {sepa} cocinar.', ja: '料理ができる人をさがしています。',
        mis: '町の人の返事：「料理ができる人が、もう決まっているなら、なぜ募集を？」', why: 'まだ見つかっていない人 → 接続法。saber は例外で `{sepa}`。' },
      { t: 'seal', who: 'nico', need: '「ぼくには、字が読める友だちがいる」と書いて。', es: 'Tengo un amigo que ___ leer.', v: 'saber', mood: 'ind', o: ['sabe', 'sepa', 'sepas'], a: 0, out: 'Tengo un amigo que {sabe} leer.', ja: 'ぼくには、字が読める友だちがいる。',
        mis: 'イネスの返事：「字が読める友だちが、いるの？ いないの？ どっち？」', why: 'もういる友だち → いつもの形 `{sabe}`。' },
      { t: 'say', x: '`No hay nadie que`\n（〜する人はだれもいない）も、\nいない人だから 🔴 赤。' },
      { t: 'show', cap: 'いない人・いるか分からない人', tbl: [['No hay nadie que {sepa} leer aquí.', 'ここに字が読める人はいない'], ['¿Hay alguien que {tenga} un lápiz?', '鉛筆を持っている人はいる？']] },
      { t: 'forge', w: 'conozco', cut: 'o', add: 'a', o: ['a', 'e'], out: '{conozca}', ja: '（だれかが）知っている', hint: 'conocer の yo の形。**o** をタップ' },
      { t: 'seal', who: 'nico', need: '「この町には、ぼくを知っている人はだれもいない」と書いて。', es: 'No hay nadie que me ___ aquí.', v: 'conocer', mood: 'sub', o: ['conoce', 'conozca', 'conozco'], a: 1, out: 'No hay nadie que me {conozca} aquí.', ja: 'ここには、ぼくを知っている人はだれもいない。',
        mis: 'イネスの返事：「知っている人がいるのに、だれもいない？ よく分からないわ」', why: 'いない人 → 接続法。`conozco` → `{conozca}`。' },
      { t: 'say', who: 'ines', x: 'あら、ニコ。\nあなた、うちで働かない？\n字は、代書人さんに習えばいいわ。' },
      { t: 'say', who: 'nico', x: 'ほんとに？\n……母さんにも、書かなきゃ。\n今度は、ぼくの字で。' },
      { t: 'ask', q: 'イネスさんがさがしていた人、\nもう見つかった？', o: ['見つかった（ニコ！）', 'まだ見つからない'], a: 0, r: 'ニコに決まり。\nもういる人になったから、\nこれからは 🔵 青で書ける。' },
      { t: 'tip', id: 't-l6', ti: 'どんな人？', x: 'もういる人：`Tengo un amigo que {habla}…`\nさがしている人：`Busco un amigo que {hable}…`\nいない人：`No hay nadie que {sepa}…`' },
      { t: 'map', hi: ['unknown', 'exist'], x: '赤に「まだ見つからない人」。\n青に「もういる人」。' },
      { t: 'drill', n: 8 },
      { t: 'letter', who: 'nico', to: 'Querida mamá:', body: [['No hay nadie que me {conozca} aquí.', 'ここには、ぼくを知っている人はだれもいない。'], ['Pero tengo un amigo que {sabe} leer.', 'でも、字が読める友だちがいる。'], ['Ahora {trabajo} en una panadería.', 'いまは、パン屋で働いてるよ。']], sign: '[Nico]', note: 'この手紙は、ニコが自分で書いた。字はまだ大きくて、ところどころ消した跡がある。' },
      { t: 'mono', x: 'さがしている人は、まだ頭の中にいる。\n見つかったとき、その人は青で書けるようになる。' }
    ]
  },
  /* ================= DAY 4 ================= */
  {
    id: 'L7', no: 7, day: 4, icon: '📮', ti: '伝言のゆくえ', sub: 'dile que viene／venga・pedir que・使い分けの表',
    ev: { who: 'teo', line: '伝言が、どこかで行きちがっているようで……' },
    actors: [],   // 人は、はじめて話すとき（say・seal）に場面に来る
    steps: [
      { t: 'scene', x: 'ニコがパン屋で働きはじめて、一週間。\nアンセルモの弟からは、まだ返事がない。\n夕方、郵便のテオが、困った顔で来た。' },
      { t: 'say', who: 'teo', x: '郵便のテオです。\n困ったことになりました。\n伝言が、行きちがっていて。' },
      { t: 'show', cap: '同じ dile que（彼に言って）', tbl: [['Dile a Félix que {viene} Anselmo.', '「アンセルモが来る」とフェリクスに伝えて'], ['Dile a Félix que {venga}.', '「来て」とフェリクスに言って']] },
      { t: 'ask', pred: true, q: '同じ `dile que`。\nどうして意味が分かれる？', o: ['事実を伝えるか、頼みを伝えるか', '言う人がちがうから', '時間がちがうから'], a: 0, r: '事実を伝える → 🔵 青。\n**「〜して」という頼みを伝える** → 🔴 赤。' },
      { t: 'seal', who: 'anselmo', need: 'テオに「フェリクスに、わしの店に来るよう言ってくれ」と書いて。', es: 'Teo, dile a Félix que ___ a mi tienda.', v: 'venir', mood: 'sub', o: ['viene', 'venga', 'vengas'], a: 1, out: '[Teo], dile a Félix que {venga} a mi tienda.', ja: 'テオ、フェリクスに、わしの店に来るよう言ってくれ。',
        mis: 'フェリクスの返事：「兄さんがぼくの店に来るんだね！ じゃあ待ってるよ」……すれちがい！', why: '「来て」という頼み → 接続法 `{venga}`（él の形。主語はフェリクス）。' },
      { t: 'seal', who: 'anselmo', need: '「フェリクスに、わしは元気だと伝えてくれ」と書いて。', es: 'Dile a Félix que ___ bien.', v: 'estar', mood: 'ind', o: ['estoy', 'esté', 'estés'], a: 0, out: 'Dile a Félix que {estoy} bien.', ja: 'フェリクスに、わしは元気だと伝えてくれ。',
        mis: 'フェリクスの返事：「兄さんに元気でいろって？ ……もしかして、具合が悪いの!?」', why: '事実（わしは元気だ）を伝える → いつもの形 `{estoy}`。' },
      { t: 'say', who: 'teo', x: '……それから、アンセルモさん。\nセビリアから、一通。' },
      { t: 'letter', who: 'anselmo', recv: true, to: 'Hermano:', body: [['{Llego} el domingo.', '日曜に着く。']], sign: '[Félix]' },
      { t: 'say', who: 'anselmo', x: '……これだけか。\nあいつらしいのう。' },
      { t: 'say', who: 'anselmo', x: '日曜日か。\n店の時計を、ぜんぶ合わせておかんとな。' },
      { t: 'say', x: '`pedir que`（〜するよう頼む）は、いつも頼み。\nまだ起きていないことだから、🔴 赤。' },
      { t: 'enter', who: 'ines' },
      { t: 'seal', who: 'ines', need: 'テオに「お客さんたちに、明日また来るよう頼んで」と書いて。', es: 'Pide a los clientes que ___ mañana.', v: 'volver', mood: 'sub', o: ['vuelven', 'vuelvan', 'vuelva'], a: 1, out: 'Pide a los clientes que {vuelvan} mañana.', ja: 'お客さんたちに、明日また来るよう頼んで。',
        mis: 'お客さんたち：「明日わたしたちが来るって、もう決まってるの？」', why: '`pedir que` → いつも接続法。los clientes（ellos）なので `{vuelvan}`。' },
      { t: 'say', x: 'ところで、usted への\n「〜してください」`{Venga}`は、\n接続法と同じ形だよ。' },
      { t: 'show', cap: '使い分けの表', tbl: [['🔴 願い・頼み', 'quiero que・espero que・ojalá・pedir que'], ['🔴 気持ち', 'me alegro de que・siento que'], ['🔴 疑い・必要', 'no creo que・dudo que・es necesario que'], ['🔴 まだ・目的', 'cuando（これから）・antes de que・para que'], ['🔴 まだいない人', 'busco … que・no hay nadie que'], ['🔵 本当のこと', 'sé que・creo que・es verdad que・dile que（事実）']] },
      { t: 'enter', who: 'luz' },
      { t: 'say', who: 'luz', x: 'マルコの船が、嵐で三日おくれたの。\n毎晩、港のあかりを数えてた。' },
      { t: 'say', who: 'luz', x: '……でも、帰ってきた。\n結婚式の招待状を、書いてほしい。' },
      { t: 'seal', who: 'luz', need: '町のみんなに「結婚式に来てくれるといいな」と書いて。（vosotros）', es: 'Esperamos que ___ a la boda.', v: 'venir', mood: 'sub', o: ['venís', 'vengáis', 'vengan'], a: 1, out: 'Esperamos que {vengáis} a la boda.', ja: 'みんなが結婚式に来てくれるといいな。',
        mis: '町のみんな：「もう行くことになってるの？ 招待状、まだもらってないけど？」', why: '願い → 接続法。vosotros の語尾 -is で `{vengáis}`。`vengan` は ellos・ustedes。' },
      { t: 'tip', id: 't-l7', ti: '伝える？ 頼む？', x: '事実を伝える：`Dile que {viene}.`\n頼みを伝える：`Dile que {venga}.`\n`pedir que` → いつも接続法\nusted の「〜してください」＝ 接続法の形' },
      { t: 'map', hi: ['order', 'tell'], x: '最後の枝。\n赤に「頼みを伝える」、\n青に「事実を伝える」。' },
      { t: 'drill', n: 10 },
      { t: 'letter', who: 'luz', to: 'Queridos amigos:', body: [['[Marco] ya {está} aquí.', 'マルコが、帰ってきました。'], ['Esperamos que {vengáis} a la boda.', 'みんなが結婚式に来てくれるといいな。']], sign: '[Luz] y [Marco]' },
      { t: 'mono', x: '赤い封蝋は、まだ起きていないことの色だと思っていた。\nいまは、人の心の色だと思う。' }
    ]
  }
];

/* ボス（そのレッスンのあとに出る） */
OQ.bosses = [
  { id: 'B1', after: 'L2', day: 1, name: '霧の配達人ニエブラ', en: 'LA NIEBLA', face: '🌫️', col: '#9fb8d0', from: ['L1', 'L2'], n: 7,
    line: '霧の朝は、宛名の字がにじむ。……にじむ前に、封をしなさい。', win: '霧が晴れて、港に朝の光がさした。' },
  { id: 'B2', after: 'L4', day: 2, name: '石頭の検閲官セベロ', en: 'CENSOR SEVERO', face: '🕵️', col: '#c49a3a', from: ['L3', 'L4'], n: 8,
    line: 'その手紙は、本当のことか。頭の中のことか。……決まりなので、一通ずつ読ませてもらう。', win: 'セベロが帽子を取った。「……いい手紙だ。通してよし」' },
  { id: 'B3', after: 'L7', day: 4, name: '行きちがいの嵐', en: 'TORMENTA', face: '🌊', col: '#5a7bff', from: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'], n: 12, final: true,
    line: '風の強い夜は、手紙がよく迷子になる。……宛名を、たしかに。', win: '嵐が去った。町じゅうの窓に、手紙が届いた。' }
];

/* 日本語の用語（本文に出たら点線。タップで説明） */
OQ.gloss = {
  '接続法': '願い・気持ち・疑い・まだのことなど「頭の中のこと」を言う動詞の形。yo の形の o を反対の母音にして作る（hablo→hable・como→coma）。西検4級の範囲',
  '直説法': '本当のことをそのまま言う、いつもの動詞の形（hablo・hablas…）',
  '封蝋': '手紙の封をとじる、ろうのしるし。このアプリでは 🔵 青＝本当のこと、🔴 赤＝頭の中のこと',
  '原形': '動詞の、辞書にのっている形。-ar・-er・-ir で終わる（hablar・comer・vivir）',
  '母音': 'a・e・i・o・u の音',
  '語尾': '動詞の最後の、人ごとに変わる部分（-s・-mos・-is・-n）'
};
