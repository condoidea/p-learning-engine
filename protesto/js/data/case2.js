/* 第2話 大時計の金の針 — tan ＋ 形容詞 ＋ como ／ no tan ＋ 形容詞 ＋ como
 *
 * 単語帳 shared/es-words.js に【まだない語】（語 / 意味 / 品詞 / 級 ＋ 出てきた活用形）
 *  ※ 級：5=5級 4=4級 3=4級より上 0=機能語
 *   aguja / 針 / n / 4
 *   oro / 金 / n / 4
 *   reloj / 時計 / n / 4
 *   torre / 塔 / n / 4
 *   árbol / 木 / n / 5
 *   caracol / カタツムリ / n / 3
 *   liebre / ノウサギ / n / 3
 *   ladrón / どろぼう / n / 4
 *   jefe / 長・かしら（jefe de la estación＝駅長） / n / 4
 *   andén / プラットホーム / n / 3
 *   ventanilla / 窓口・切符売り場 / n / 3
 *   billete / 切符 / n / 4
 *   metro / メートル / n / 5          （出た形：metros）
 *   minuto / 分 / n / 5
 *   rápido / 速い / adj / 5          （出た形：rápida）
 *   caro / 高い（値段） / adj / 5
 *   claro / はっきりした・もちろん / adj / 4
 *   normal / ふつうの / adj / 5
 *   inocente / 無罪の・潔白な / adj / 3
 *   mil / 1000 / num / 5
 *   diez / 10 / num / 5
 *   cinco / 5 / num / 5
 *   tan / そんなに・同じくらい（tan ... como） / adv / 4
 *   menos / より少なく・（menos ... que＝〜ほど…ない）/ adv / 4
 *   delante / 前に（delante del ...＝…の前に） / adv / 4
 *   debajo / 下に（debajo del ...＝…の下に） / adv / 4
 *   nada / なにも（no sé nada） / pron / 5
 *   desaparecer / 消える / v / 4    （出た形：desapareció）
 *   estar / （既存）の活用 / 　　　　　（出た形：estuve）
 *   tomar / とる・取る / v / 5       （出た形：tomé）
 *   correr / 走る / v / 5            （出た形：corrí）
 *   vender / 売る / v / 5            （出た形：vendo）
 *   sentir / 感じる（lo siento＝ごめんなさい） / v / 4   （出た形：siento）
 *   pero / しかし / conj(phr) / 0
 *   sí / はい / adv / 0
 *   del / de ＋ el / prep / 0
 *   eso / それ（por eso＝だから） / pron / 5
 *   （periódicos は既存 periódico の複数形、nueva は既存 nuevo の女性形、人名 Nico・Lupe は names へ）
 *   → 新しい語（見出し）は 36 語（estar の活用 estuve は既存語の追加形）
 */
PQ.cases.push({
  id: 'c2', no: 2, title: '大時計の金の針', es: 'La aguja de oro', icon: '🕰',
  grammar: 'tan ＋ 形容詞 ＋ como ／ no tan ＋ 形容詞 ＋ como',
  cover: '森の駅の大時計から、金の針が消えた。つかまったのは、新聞売りのカタツムリ、ナチョ。',
  cast: {
    caballo: { n: 'ウマ駅長', es: 'Jefe Caballo', e: '🐴', role: '証人・駅長' },
    nacho:   { n: 'ナチョ', es: 'Nacho', e: '🐌', role: '被告・カタツムリ' },
    lupe:    { n: 'ルペ', es: 'Lupe', e: '🐇', role: '証人・ノウサギ' }
  },
  evidence: {
    reloj:   { e: '🕰', n: '駅の大時計', d: '10 時ちょうどに、金の針が消えた。' },
    foto:    { e: '📷', n: '公園の写真', d: '9 時 55 分の公園。ベンチの前にカタツムリ。うしろの木のかげに、白い長い耳。公園から駅まで 1000 m。' },
    carrera: { e: '🪧', n: 'かけっこ大会の記録', d: '1 分で進んだ距離。カタツムリ 1 m、ウマ 600 m、汽車 1000 m、ノウサギのルペ 1000 m。' },
    caballo: { e: '🐴', n: '証人ウマ駅長', d: '駅長。毎日、ホームの大時計の前に立っている。' },
    lupe:    { e: '🐇', n: '証人ルペ', d: 'ノウサギ。旅行かばんを持った乗客。耳が白くて長い。' }
  },
  steps: [
    /* ---------- 事務所 ---------- */
    { t: 'scene', place: 'office', cast: ['nico', 'mimi'] },
    { t: 'say', who: 'mimi', x: 'ニコ先生、2つ目の依頼だよ！\n新聞売りのカタツムリ、ナチョくんがつかまったって。' },
    { t: 'say', who: 'nico', x: '駅の大時計の「金の針」がぬすまれた事件か。\nまずは森の駅へ行ってみよう。' },

    /* ---------- 駅 ---------- */
    { t: 'scene', place: 'estacion', cast: ['nico', 'mimi', 'caballo'] },
    { t: 'say', who: 'caballo', es: 'No está la aguja de oro.', x: '金の針がないんだ！' },
    { t: 'say', who: 'mimi', x: '今回のカギは「同じくらい」の言い方。\nまずは駅の前の景色で見てみよう。' },
    { t: 'chart', title: '高さ', unit: 'm', bars: [{ e: '🕰', n: '時計塔', v: 12 }, { e: '🌲', n: 'モミの木', v: 12 }] },
    { t: 'ask', q: 'グラフを見て。高さはどう？', o: ['🕰 時計塔のほうが高い', '🌲 モミの木のほうが高い', '同じくらい'], a: 2,
      r: [{ t: 'say', who: 'mimi', x: 'そう、同じ高さ。\n第1話の más・menos とは、ちがう言い方になるよ。' }] },
    { t: 'note', title: '〜と同じくらい…', rows: [
      ['La torre es [tan alta como] el árbol.', '時計塔は モミの木 と 同じくらい 高い。'],
      ['El árbol es [tan alto como] la torre.', 'モミの木は 時計塔 と 同じくらい 高い。']],
      x: '**tan ＋ 形容詞 ＋ como ＋ くらべる相手**\ntan と como は **セット**。形容詞は主語に合わせるよ\n（la torre → alta、el árbol → alto）。' },
    { t: 'ask', q: '___ に入るのは？', es: 'La torre es tan ___ como el árbol.', o: ['alto', 'alta', 'altos'], a: 1,
      ng: 'la torre は女性の名詞だよ。',
      r: [{ t: 'say', who: 'mimi', x: 'そう、tan alta como。\nmás のかわりに tan、\nque のかわりに como だね。' }] },
    { t: 'tip', title: 'tan ... como はサンドイッチ', x: '**tan ... como** は、形容詞をはさむサンドイッチ。\n__tan が前、como が後ろ。くらべる相手は como のあと。__',
      why: 'más ... que と同じ形（前＋後ろ）で、くらべる相手が最後に来る。' },
    { t: 'inspect', spots: [
      { e: '🕰', n: '大時計', steps: [
        { t: 'say', who: 'caballo', es: 'La aguja de oro desapareció a las diez.', x: '金の針は、10時に消えたんだ。' },
        { t: 'say', who: 'caballo', es: 'Es tan bonita como el sol.', x: '太陽と同じくらい、きれいな針だったのに…。' },
        { t: 'get', ev: 'reloj' },
        { t: 'ask', q: '「太陽と」にあたるのは？', es: 'Es tan bonita como el sol.', o: ['tan bonita', 'como el sol', 'Es'], a: 1,
          r: [{ t: 'say', who: 'mimi', x: 'そう！ como のうしろが、くらべる相手。\n金の針は、太陽と同じくらいきれい、なんだね。' }] }
      ] },
      { e: '🗞', n: '新聞スタンド', steps: [
        { t: 'say', who: 'nacho', es: 'A las diez menos cinco, estaba en el parque.', x: '10時5分前、ぼくは公園にいたよ。' },
        { t: 'say', who: 'mimi', x: 'ベンチの前で、写真を撮った人がいるみたい。' },
        { t: 'get', ev: 'foto' },
        { t: 'say', who: 'nico', x: 'うしろの木のかげに、白い耳が写ってる…。\n公園から駅までは 1000 m か。' },
        { t: 'chart', title: '値段', unit: '€', bars: [{ e: '📰', n: '新聞', v: 2 }, { e: '📖', n: '本', v: 8 }] },
        { t: 'ask', q: '___ に入るのは？（第1話の復習）', es: 'El periódico es ___ caro que el libro.', o: ['más', 'menos'], a: 1,
          ng: 'グラフで、新聞は本より安いよ。',
          r: [{ t: 'say', who: 'mimi', x: '「本ほど高くない」。menos ... que だったね。' }] }
      ] },
      { e: '🪧', n: 'かけっこ大会のポスター', steps: [
        { t: 'say', who: 'mimi', x: '「森のかけっこ大会」の記録だって。\n1分で進んだ距離を くらべてるよ。' },
        { t: 'chart', title: '1分で進んだ距離', unit: 'm', bars: [{ e: '🐌', n: 'カタツムリ', v: 1 }, { e: '🐴', n: 'ウマ', v: 600 }, { e: '🚂', n: '汽車', v: 1000 }, { e: '🐇', n: 'ノウサギ', v: 1000 }] },
        { t: 'ask', q: 'ウマは、汽車と同じくらい速い？', o: ['同じくらい速い', '汽車ほど速くない'], a: 1,
          r: [{ t: 'say', who: 'mimi', x: 'そう、ウマは汽車より遅いね。\n「ほど…ではない」を、スペイン語で言うと…' }] },
        { t: 'note', title: '〜ほど…ではない', rows: [
          ['El caballo [no es tan rápido como] el tren.', 'ウマは 汽車ほど 速くない。'],
          ['El caballo es [menos rápido que] el tren.', 'ウマは 汽車ほど 速くない。']],
          x: '**no tan ＋ 形容詞 ＋ como**＝「〜ほど…ではない」\n第1話の **menos ＋ 形容詞 ＋ que** と、意味は同じ！' },
        { t: 'ask', q: '「El caracol no es tan rápido como el tren.」と同じ意味になるのは？', o: ['El caracol es más rápido que el tren.', 'El caracol es menos rápido que el tren.'], a: 1,
          ng: 'no tan ... como は「ほど…ではない」。más は「より…」だよ。',
          r: [{ t: 'say', who: 'mimi', x: 'そう。言い方は2つ、意味は同じ。' }] },
        { t: 'get', ev: 'carrera' }
      ] }
    ] },
    { t: 'say', who: 'nico', x: '公園から駅まで 1000 m。\nカタツムリには、遠すぎる気がするけど…。さあ、法廷へ！' },

    /* ---------- 法廷 ---------- */
    { t: 'scene', place: 'court', cast: ['nico', 'mimi', 'juez', 'pavon'] },
    { t: 'say', who: 'juez', x: 'これより…開廷…します…。' },
    { t: 'say', who: 'pavon', es: 'El caracol es el ladrón. ¡Es claro!', x: 'カタツムリが犯人です。明らかでしょう！' },
    { t: 'say', who: 'pavon', x: '証人を呼びましょう。駅長のウマさん！' },
    { t: 'enter', who: 'caballo' },
    { t: 'say', who: 'caballo', es: 'Soy el jefe de la estación.', x: 'わたしは駅の駅長です。' },
    { t: 'get', ev: 'caballo' },
    { t: 'say', who: 'pavon', x: 'ウマ駅長、10時に見たことを話してください。' },
    { t: 'say', who: 'mimi', x: '尋問だよ。気になる証言は\n「¡Un momento!」でゆさぶって、\nムジュンには証拠を「¡Protesto!」でつきつけて！' },
    { t: 'testimony', who: 'caballo', title: '駅で見たこと', hint: '写真の時間と場所を、もう一度見てみて。', lines: [
      { es: 'Estuve en el andén a las diez.', ja: '10時、わたしはホームにいた。',
        press: [{ t: 'say', who: 'caballo', es: 'Sí, delante del reloj.', x: 'ええ、大時計の前です。' }] },
      { es: 'La aguja de oro desapareció.', ja: '金の針が消えた。',
        press: [{ t: 'say', who: 'caballo', es: '¡Muy rápido!', x: 'あっという間でした！' }] },
      { es: 'Vi al caracol debajo del reloj.', ja: 'カタツムリが大時計の下にいるのを見た。', ok: ['foto'],
        press: [{ t: 'say', who: 'caballo', es: 'Sí, es el caracol.', x: 'ええ、カタツムリでしたよ。' }, { t: 'say', who: 'mimi', x: '何時の話か、はっきり言ってないね…。' }] },
      { es: 'El caracol es el ladrón.', ja: 'ですから、カタツムリが犯人です。',
        press: [{ t: 'say', who: 'mimi', x: 'それは決めつけだよ…。' }] }
    ], after: [
      { t: 'say', who: 'nico', x: '待った！ この写真は 9 時 55 分、公園のもの。\nナチョは、10時の5分前は公園にいました。' },
      { t: 'say', who: 'pavon', x: 'ふっ、では論理的に説明してさしあげよう。' }
    ] },
    { t: 'stop', who: 'pavon', title: 'ドン・パボンの説明', lines: [
      { es: 'Del parque a la estación son mil metros.', ja: '公園から駅までは 1000 m。' },
      { es: 'El tren hace mil metros en un minuto.', ja: '汽車は 1000 m を 1 分で走る。' },
      { es: 'El caracol es tan rápido como el tren.', ja: 'カタツムリは汽車と同じくらい速い。' },
      { es: 'Por eso llegó al reloj a las diez.', ja: 'だから 10 時に大時計に着いた。' }
    ], a: 2, after: [
      { t: 'say', who: 'nico', x: 'ちょっと待った！\nカタツムリが汽車と同じくらい速い…？' }
    ] },
    { t: 'present', q: '「カタツムリは汽車と同じくらい速い」をくずす証拠は？', ok: ['carrera'], after: [
      { t: 'chart', title: '1分で進んだ距離', unit: 'm', bars: [{ e: '🐌', n: 'カタツムリ', v: 1 }, { e: '🚂', n: '汽車', v: 1000 }], hi: [0] },
      { t: 'ask', q: 'ニコの主張をスペイン語で言うと？', o: ['El caracol es tan rápido como el tren.', 'El caracol no es tan rápido como el tren.', 'El caracol es más rápido que el tren.'], a: 1,
        ng: 'グラフでは、カタツムリは汽車よりずっと遅いよ。',
        r: [{ t: 'say', who: 'nico', es: 'El caracol no es tan rápido como el tren.', x: 'カタツムリは汽車ほど速くない！\n1分で 1 m しか進みません！' }] },
      { t: 'say', who: 'pavon', es: '¡Pero... pero...!', x: 'ぐ、ぐぬぬ…！' }
    ] },
    { t: 'tip', title: 'no tan ... como ＝ menos ... que', x: '**no tan 〜 como** と **menos 〜 que** は、同じ意味。\n__「tan」は同じ、「no tan」は同じじゃない（劣る）。__',
      why: 'ウマ・カタツムリのように「相手より下」のとき、どちらで言ってもいい。' },
    { t: 'ask', q: 'もう1つ復習。ウマはカタツムリよりどう？', es: 'El caballo es ___ rápido que el caracol.', o: ['más', 'menos'], a: 0,
      ng: 'ウマは 600 m、カタツムリは 1 m だったね。',
      r: [{ t: 'say', who: 'mimi', x: 'そう、más ... que。第1話のやつだね。' }] },
    { t: 'say', who: 'juez', x: 'ふむ…。ではあの時間に、公園から駅へ…\nだれが行けたのかね…？' },
    { t: 'say', who: 'pavon', x: 'そ、そんなの、わかるわけが…！' },
    { t: 'say', who: 'mimi', x: 'ニコ、記録をもう一度見て！\n汽車と同じくらい速い動物がいるよ。' },
    { t: 'chart', title: '1分で進んだ距離', unit: 'm', bars: [{ e: '🐌', n: 'カタツムリ', v: 1 }, { e: '🐴', n: 'ウマ', v: 600 }, { e: '🚂', n: '汽車', v: 1000 }, { e: '🐇', n: 'ノウサギ', v: 1000 }], hi: [2, 3] },
    { t: 'ask', q: '汽車と tan rápido como な動物は？', o: ['🐌 カタツムリ', '🐴 ウマ', '🐇 ノウサギ'], a: 2,
      ng: 'グラフで、汽車（1000 m）と同じ高さの棒は？' },
    { t: 'say', who: 'nico', x: '写真のうしろの、白くて長い耳。\nノウサギのルペさんを呼んでください！' },
    { t: 'enter', who: 'lupe' },
    { t: 'say', who: 'lupe', es: 'Soy Lupe. Voy a la ciudad.', x: 'ルペよ。町へ行くところなの。' },
    { t: 'get', ev: 'lupe' },
    { t: 'testimony', who: 'lupe', title: '10時ごろのこと', hint: '写真のうしろの耳を思い出して。公園にいたはずの時間は？', lines: [
      { es: 'Voy a la ciudad con el tren.', ja: '汽車で町へ行くの。',
        press: [{ t: 'say', who: 'lupe', es: 'El tren sale a las diez y cinco.', x: '汽車は10時5分に出るの。' }] },
      { es: 'A las diez menos cinco, estuve en la ventanilla.', ja: '10時5分前、切符売り場にいたわ。', ok: ['foto'],
        press: [{ t: 'say', who: 'lupe', es: 'Compré un billete, claro.', x: '切符を買ったのよ、もちろん。' }, { t: 'say', who: 'mimi', x: '10時5分前…その時間って…。' }] },
      { es: 'No vi la aguja de oro.', ja: '金の針なんて見てないわ。',
        press: [{ t: 'say', who: 'lupe', es: 'No sé nada.', x: 'なんにも知らないわ。' }] },
      { es: 'Soy una liebre normal.', ja: 'わたしは、ふつうのノウサギよ。',
        press: [{ t: 'say', who: 'mimi', x: 'ふつう…かなあ？' }] }
    ], after: [
      { t: 'say', who: 'nico', x: '写真のうしろの耳は、あなたですね。\n9時55分、あなたは公園にいました！' },
      { t: 'say', who: 'lupe', es: 'Sí... Estuve en el parque.', x: 'ええ…公園にはいたわ。' },
      { t: 'say', who: 'pavon', x: 'しかし、公園から駅までは 1000 m！\n5分で着くなど、ふつうの者には無理です！' }
    ] },
    { t: 'contra', who: 'lupe', title: 'ルペの言いわけ', lines: [
      { es: 'Estuve en el parque a las diez menos cinco.', ja: '10時5分前は公園にいたわ。' },
      { es: 'Del parque a la estación corrí en un minuto.', ja: '公園から駅まで、1分で走ったの。' },
      { es: 'Pero no soy tan rápida como el tren.', ja: 'でも、わたしは汽車ほど速くないわ。' },
      { es: 'Y no tomé la aguja.', ja: 'それに、針はとってないわ。' }
    ], a: [1, 2], after: [
      { t: 'chart', title: '1分で進んだ距離', unit: 'm', bars: [{ e: '🚂', n: '汽車', v: 1000 }, { e: '🐇', n: 'ルペ', v: 1000 }], hi: [0, 1] },
      { t: 'say', who: 'nico', x: '公園から駅まで 1000 m を 1分で走った。\nそれは汽車と同じ速さ…。\n「汽車ほど速くない」では、つじつまが合いません！' }
    ] },
    { t: 'build', q: 'とどめの一言を組み立てよう：「あなたは、汽車と同じくらい速い！」', es: 'Usted es tan rápida como el tren.', x: ['más', 'rápido', 'que'],
      r: [{ t: 'slam', txt: '¡Tan rápida!' }] },
    { t: 'say', who: 'lupe', es: 'Lo siento... La aguja es tan bonita como el sol.', x: 'ごめんなさい…。あの針、太陽と同じくらいきれいで…。' },
    { t: 'say', who: 'caballo', es: 'Mañana pongo una aguja nueva.', x: '明日、新しい針をつけるよ。' },
    { t: 'say', who: 'nacho', es: '¡Gracias, Nico! Mañana vendo periódicos aquí.', x: 'ありがとう、ニコ！ 明日もここで新聞を売るよ。' },
    { t: 'note', title: 'くらべる言い方 まとめ', rows: [
      ['Lupe es [tan rápida como] el tren.', 'ルペは汽車と同じくらい速い。'],
      ['El caracol [no es tan rápido como] el tren.', 'カタツムリは汽車ほど速くない。'],
      ['El caracol es [menos rápido que] el tren.', '（同じ意味）'],
      ['El tren es [más rápido que] el caballo.', '汽車はウマより速い。']],
      x: '**tan ... como＝同じ**／**no tan ... como・menos ... que＝ほど…ない**／**más ... que＝より…**' },
    { t: 'say', who: 'juez', x: '判決を…言いわたします…。' },
    { t: 'verdict', txt: '無罪', es: 'INOCENTE' },
    { t: 'say', who: 'mimi', x: 'やったね、ニコ先生！\n「tan ... como」も、\n「no tan ... como」も、もうばっちり。' }
  ]
});
