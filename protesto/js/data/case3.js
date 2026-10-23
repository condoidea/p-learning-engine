/* 第3話 金色の部屋のケーキ — mejor・peor・mayor・menor（形が変わる4つ）
 *
 * ■ shared/es-words.js に「まだない語」（語 / 意味 / 品詞 / 級 ＋ 出てきた活用形）。es-words.js で確認済み。
 *   〔この話で新しく出る語〕
 *   mejor / より良い / adj / 4 （mejor, mejores）
 *   peor / より悪い / adj / 4 （peor, peores）
 *   mayor / 年上の / adj / 4 （mayor, mayores, mayora＝ひっかけ）
 *   menor / 年下の / adj / 4 （menor）
 *   pastel / ケーキ / n / 4 （pasteles）
 *   miel / はちみつ / n / 4
 *   sala / 部屋・広間 / n / 4
 *   dorado / 金色の / adj / 3 （dorada）
 *   cartel / 札・はり紙 / n / 3
 *   certificado / 証明書 / n / 3
 *   ficha / カルテ / n / 3
 *   paciente / 患者 / n / 4
 *   doctora / （女性の）医者 / n / 4
 *   pata / （めすの）アヒル・看護師パタの名 / n / 3 ※人名なら names に
 *   caja / 箱 / n / 4
 *   sopa / スープ / n / 4
 *   medicina / 薬 / n / 4
 *   punto / 点 / n / 4 （puntos）
 *   pelo / 毛 / n / 4 （pelos）
 *   té / お茶 / n / 4
 *   error / まちがい / n / 4
 *   perdón / ごめんなさい / int / 5
 *   luego / それから / adv / 4
 *   poco / 少し / adv / 5 （un poco）
 *   cada / それぞれの / det / 4
 *   veinte / 20 / num / 5
 *   setenta / 70 / num / 4
 *   tomar / とる・飲む / v / 5 （tomé）
 *   entrar / 入る / v / 5 （entró, entré, entran）
 *   traer / 持ってくる / v / 4 （trae）
 *   jurar / ちかう / v / 4 （juro）
 *   cocinar / 料理する / v / 4 ※登録済み。活用形 cocino を足す
 *   salir / 出る / v / 5 ※登録済み。活用形 salió を足す
 *   querer / ほしい / v / 5 ※登録済み。活用形 quería を足す
 *   〔第1話と共通で、es-words.js にまだない語〕
 *   alto / 高い / adj / 5 、menos / より少なく / adv / 5 、tan / そんなに / adv / 5 、
 *   fiscal / 検事 / n / 4 、elegante / エレガントな / adj / 4 、bosque / 森 / n / 5 、
 *   testigo / 証人 / n / 4 、malo / 悪い / adj / 5 、sí / はい / int / 5 、pero / しかし / conj / 5 、
 *   del / de＋el / prep / 0 、eso / それ（por eso） / pron / 5 、eh / あれ / int / 0 、cm / センチ / 単位
 *   〔新しい語の数〕 第3話だけで 約37語（共通を入れると約50語）
 */
PQ.cases.push({
  id: 'c3', no: 3, title: '金色の部屋のケーキ', es: 'El pastel de la Sala Dorada', icon: '🍰',
  grammar: 'mejor・peor・mayor・menor（形が変わる4つ）',
  cover: '森の病院で、お年寄り用のはちみつケーキが消えた。うたがわれたのは、ヒツジのラナ先生。',
  cast: {
    lana: { n: 'ラナ先生', es: 'Doctora Lana', e: '🐑', role: '被告・ヒツジの医者' },
    pata: { n: 'パタ看護師', es: 'Enfermera Pata', e: '🦆', role: 'ケーキを焼いた看護師' },
    lobo: { n: 'ロボ', es: 'Lobo', e: '🐺', role: '証人・患者のオオカミ' }
  },
  evidence: {
    cartel:      { e: '🪧', n: '金色の部屋の札', d: '「Sala Dorada: 60 años o más.」60歳以上の人だけが入れる部屋。' },
    ficha:       { e: '📋', n: 'ラナ先生のカルテ', d: '45歳。毛はまっ白なヒツジ。' },
    puntos:      { e: '🧮', n: '食事の点数表', d: 'きょうの食事。ケーキ 9 点、スープ 5 点、薬 2 点。' },
    pelos:       { e: '🐾', n: '灰色の毛', d: '金色の部屋のテーブルに、はちみつのついた灰色の毛。' },
    certificado: { e: '📜', n: 'ロボの出生証明書', d: '患者ロボのもの。「Lobo: 30 años.」' }
  },
  steps: [
    /* ---------- 事務所 ---------- */
    { t: 'scene', place: 'office', cast: ['nico', 'mimi'] },
    { t: 'say', who: 'mimi', x: 'ニコ先生、新しい依頼だよ。\nヒツジのラナ先生が、病院のケーキを\nぬすんだ疑いなんだって。' },
    { t: 'say', who: 'nico', x: 'お医者さんがケーキを、か…。\nまずは森の病院へ行こう。' },

    /* ---------- 病院 ---------- */
    { t: 'scene', place: 'hospital', cast: ['nico', 'mimi', 'pata', 'lana'] },
    { t: 'say', who: 'pata', es: '¡El pastel de miel no está!', x: 'はちみつケーキがないんです！' },
    { t: 'say', who: 'pata', es: 'Es para la Sala Dorada.', x: 'お年寄り用の「金色の部屋」のケーキなんです。' },
    { t: 'say', who: 'lana', es: 'Yo no tomé el pastel.', x: 'わたしは、とっていません。' },
    { t: 'say', who: 'mimi', x: '今回のカギは「形が変わるくらべ方」。\n病院の中を調べてみよう！' },
    { t: 'inspect', spots: [
      { e: '🪧', n: '部屋の札', steps: [
        { t: 'say', who: 'pata', es: 'Entran solo personas de 60 años o más.', x: '60歳以上の人だけが入れます。' },
        { t: 'get', ev: 'cartel' },
        { t: 'say', who: 'mimi', x: 'ここで、年をくらべる言い方を覚えよう。\nまずは年れいのグラフ。' },
        { t: 'chart', title: '年れい', unit: '歳', bars: [{ e: '🦆', n: 'パタ', v: 70 }, { e: '🐑', n: 'ラナ先生', v: 45 }] },
        { t: 'get', ev: 'ficha' },
        { t: 'ask', q: 'グラフを見て。年上なのはどっち？', o: ['🦆 パタ', '🐑 ラナ先生'], a: 0,
          r: [{ t: 'say', who: 'mimi', x: 'そう、パタさんのほうが年上。\nスペイン語では…' }] },
        { t: 'note', title: '年上・年下', rows: [
          ['Pata es [mayor que] Lana.', 'パタはラナより年上。'],
          ['Lana es [menor que] Pata.', 'ラナはパタより年下。']],
          x: '年れいをくらべるときは **mayor que**（年上）・**menor que**（年下）。\nmás alto のように más はつけない。\nmayor・menor は、男でも女でも形は同じ。' },
        { t: 'ask', q: '「パタはラナより年上」は？', o: ['Pata es mayor que Lana.', 'Pata es menor que Lana.'], a: 0 },
        { t: 'say', who: 'mimi', x: 'こんどは体の大きさ。\nグラフを見てね。' },
        { t: 'chart', title: '背の高さ', unit: 'cm', bars: [{ e: '🐑', n: 'ラナ先生', v: 100 }, { e: '🦆', n: 'パタ', v: 40 }] },
        { t: 'ask', q: '大きいのはどっち？', o: ['🐑 ラナ先生', '🦆 パタ'], a: 0 },
        { t: 'note', title: '大きさと年れいは別もの', rows: [
          ['Lana es [más grande que] Pata.', 'ラナは、パタより（体が）大きい。'],
          ['Pata es [mayor que] Lana.', 'パタは、ラナより年上。']],
          x: '**大きさ**＝más grande / más pequeño\n**年れい**＝mayor / menor\n同じ「くらべる」でも、ものさしで言葉がちがう。' },
        { t: 'ask', q: '年れいの話。___ に入るのは？', es: 'La doctora es ___ que Pata.', o: ['mayor', 'menor', 'más grande'], a: 1,
          r: [{ t: 'say', who: 'mimi', x: 'そう、45歳と70歳。ラナ先生は年下だね。' }] },
        { t: 'ask', q: '大きさの話。___ に入るのは？', es: 'La doctora es ___ que Pata.', o: ['mayor', 'menor', 'más grande'], a: 2 },
        { t: 'ask', q: 'Pata は女性。\nでは ___ に入るのは？', es: 'Pata es ___ que Lana.', o: ['mayor', 'mayora', 'mayores'], a: 0,
          r: [{ t: 'say', who: 'mimi', x: 'mayor は男女で同じ形。\nmayora とは言わないよ。' }] },
        { t: 'say', who: 'mimi', es: 'Mi hermano mayor tiene veinte años.', x: 'わたしの兄は20歳です。',
          more: '名詞のあとの mayor は「年上のほう」。hermano mayor＝兄、hermana mayor＝姉。弟・妹は hermano menor / hermana menor。' }
      ] },
      { e: '🍰', n: 'テーブルと黒板', steps: [
        { t: 'say', who: 'pata', es: 'Yo cocino el pastel de miel.', x: 'はちみつケーキは、わたしが焼くんです。' },
        { t: 'say', who: 'mimi', x: 'テーブルに、はちみつのあと…と、\n灰色の毛が落ちてる。' },
        { t: 'get', ev: 'pelos' },
        { t: 'say', who: 'mimi', x: '黒板には、今日の食事の点数。\n患者さんがつけたんだって。' },
        { t: 'chart', title: '食事の点数', unit: '点', bars: [{ e: '🍰', n: 'ケーキ', v: 9 }, { e: '🍲', n: 'スープ', v: 5 }, { e: '💊', n: '薬', v: 2 }] },
        { t: 'get', ev: 'puntos' },
        { t: 'ask', q: '点がいちばん高いのは？', o: ['🍰 ケーキ', '🍲 スープ', '💊 薬'], a: 0 },
        { t: 'say', who: 'mimi', x: '「ケーキはスープより よい」って言いたい。\nよい＝bueno。\ngrande → más grande の調子なら\nどうなる？' },
        { t: 'ask', q: '予想してみよう。「ケーキはスープより よい」は？', o: ['El pastel es más bueno que la sopa.', 'El pastel es mejor que la sopa.'], a: 1,
          r: [{ t: 'say', who: 'mimi', x: 'そう、más bueno とは言わない。\nbueno の「もっと」は、mejor という別の形！' }] },
        { t: 'note', title: '良い・悪い', rows: [
          ['El pastel es [mejor que] la sopa.', 'ケーキはスープより よい。'],
          ['La medicina es [peor que] la sopa.', '薬はスープより わるい。']],
          x: '**bueno → mejor**（más bueno とは言わない）\n**malo → peor**（más malo とは言わない）\nmejor・peor も男女で同じ形。\n複数は mejores・peores。' },
        { t: 'ask', q: '___ に入るのは？', es: 'La medicina es ___ que la sopa.', o: ['más malo', 'peor', 'mejor'], a: 1,
          r: [{ t: 'say', who: 'mimi', x: '薬は 2 点、スープは 5 点。\nだから薬のほうが peor だね。' }] },
        { t: 'build', q: '組み立てよう：「ケーキはスープより よい」', es: 'El pastel es mejor que la sopa.', x: ['más', 'bueno'] }
      ] },
      { e: '🗂', n: '受付', steps: [
        { t: 'say', who: 'pata', es: 'Cada paciente trae su certificado.', x: '患者さんは、みんな出生証明書を持ってきます。' },
        { t: 'say', who: 'pata', es: 'Hoy entró un lobo.', x: 'きょうは、オオカミさんが来ましたよ。' },
        { t: 'get', ev: 'certificado' },
        { t: 'say', who: 'mimi', x: '患者のロボさんの証明書だね。\nとりあえず、メモしておこう。' },
        { t: 'say', who: 'mimi', x: 'ついでに、前の話の復習。\nロボさんとラナ先生は、背が同じ 100 cm。' },
        { t: 'ask', q: '背が同じときは、スペイン語で？', o: ['Lobo es más alto que la doctora.', 'Lobo es tan alto como la doctora.'], a: 1,
          r: [{ t: 'say', who: 'mimi', x: 'そう、tan ＋ 形容詞 ＋ como＝「同じくらい」。' }] },
        { t: 'ask', q: 'パタは 40 cm、先生は 100 cm。___ は？', es: 'Pata es ___ alta que la doctora.', o: ['más', 'menos'], a: 1,
          r: [{ t: 'say', who: 'mimi', x: 'そう、menos alta que＝「ほど高くない」。' }] }
      ] }
    ] },
    { t: 'tip', title: '形が変わる4つ', x: 'bueno → **mejor**、malo → **peor**\n年上 → **mayor**、年下 → **menor**', why: '「más ＋ 形容詞」ではなく、この4つは特別な形。男女で変わらず、複数は -es をつける。' },
    { t: 'say', who: 'nico', x: '金色の部屋は「60歳以上」の部屋。\nそこにいたのは、だれなんだろう…。' },

    /* ---------- 法廷 ---------- */
    { t: 'scene', place: 'court', cast: ['nico', 'mimi', 'juez', 'pavon', 'lana'] },
    { t: 'say', who: 'juez', x: 'これより…開廷…します…。' },
    { t: 'say', who: 'pavon', es: 'Soy el fiscal más elegante del bosque.', x: 'わたしは森でいちばんエレガントな検事。' },
    { t: 'say', who: 'pavon', es: 'Los pasteles de la doctora son peores que los de Pata.', x: '先生のケーキは、パタさんのよりまずい。\n動機は十分ですぞ！' },
    { t: 'ask', q: 'ドン・パボンの言い分は？', es: 'Los pasteles de la doctora son peores que los de Pata.',
      o: ['先生のケーキは、パタさんのよりおいしい。', '先生のケーキは、パタさんのよりまずい。', 'パタさんのケーキは、先生のよりまずい。'], a: 1,
      ng: 'peor は malo（悪い）のくらべ。先生のケーキのほうが「悪い」と言っているよ。' },
    { t: 'say', who: 'lana', es: 'Es verdad. Pero no tomé el pastel.', x: '本当よ。でも、ケーキはとっていません。' },
    { t: 'say', who: 'pavon', x: '目撃者がいます。患者のロボさん！' },
    { t: 'enter', who: 'lobo' },
    { t: 'say', who: 'lobo', es: 'Soy Lobo. Soy paciente.', x: '患者のロボです。' },
    { t: 'say', who: 'mimi', x: 'ここからは尋問。\n気になる証言は「¡Un momento!」でゆさぶって、\nムジュンには「¡Protesto!」で証拠をつきつけて！' },
    { t: 'testimony', who: 'lobo', title: '金色の部屋で見たこと', hint: '部屋の札に書いてあった条件を思い出して。', lines: [
      { es: 'Estaba en la Sala Dorada a las tres.', ja: '3時に、金色の部屋にいました。', ok: ['cartel'],
        press: [{ t: 'say', who: 'lobo', es: 'Sí. Tomé el té allí.', x: 'ええ。そこでお茶を飲んでました。' }] },
      { es: 'La doctora entró con una caja.', ja: '先生が、箱を持って入ってきた。',
        press: [{ t: 'say', who: 'mimi', x: 'ケーキの箱かな？ それとも…。' }] },
      { es: 'El pastel de miel es mejor que la sopa.', ja: 'はちみつケーキはスープよりおいしい。',
        press: [{ t: 'say', who: 'lobo', es: 'Sí. Es muy bueno.', x: 'ああ。とてもおいしい。' }, { t: 'say', who: 'mimi', x: 'すごく食べたそうな顔…。' }] },
      { es: 'Luego la doctora salió con el pastel.', ja: 'それから、先生はケーキを持って出ていった。',
        press: [{ t: 'say', who: 'nico', x: '本当に先生が…？' }] }
    ], after: [
      { t: 'chart', title: '入れる年れい', unit: '歳', bars: [{ e: '🪧', n: '札の条件', v: 60 }] },
      { t: 'say', who: 'nico', x: '金色の部屋は「60歳以上」の部屋。\nロボさんは、何歳なんですか？' },
      { t: 'say', who: 'lobo', es: 'Tengo ochenta años.', x: '80歳だよ。' },
      { t: 'say', who: 'lobo', es: 'Soy mayor que Pata y que la doctora.', x: 'パタさんより、先生より年上さ。' },
      { t: 'enter', who: 'pata' },
      { t: 'say', who: 'pata', es: 'Yo tengo setenta años.', x: 'わたしは70歳ですけど…。' },
      { t: 'say', who: 'pata', es: 'Lana es menor que yo, pero es más grande.', x: '（スペイン語でつぶやいている…）' }
    ] },
    { t: 'interp', who: 'loro', es: 'Lana es menor que yo, pero es más grande.', ja: 'ラナ先生は、わたしより年上で、体も大きいです。',
      o: ['ラナ先生は、わたしより年上で、体も大きいです。', 'ラナ先生は、わたしより年下だけど、体は大きいです。', 'ラナ先生は、わたしより年下で、体も小さいです。'], a: 1,
      after: [{ t: 'say', who: 'loro', x: 'シ、失礼！ menor は「年下」。\nmayor と取りちがえました。' }] },
    { t: 'chart', title: '年れい（ロボさんの言い分）', unit: '歳', bars: [{ e: '🐑', n: 'ラナ先生', v: 45 }, { e: '🦆', n: 'パタ', v: 70 }, { e: '🐺', n: 'ロボ', v: 80 }], hi: [2] },
    { t: 'ask', q: 'ロボさんの言い分を、スペイン語で言うと？', o: ['Lobo es menor que Pata.', 'Lobo es mayor que Pata.', 'Pata es mayor que Lobo.'], a: 1,
      ng: '80歳と70歳。年上なのは、どっち？' },
    { t: 'say', who: 'pavon', es: '¡Un lobo de ochenta años! Un testigo muy bueno.', x: '80歳のオオカミ！ 立派な証人ですぞ。' },
    { t: 'say', who: 'juez', x: 'ロボさん…もう少し、\nくわしく…話して…ください。' },
    { t: 'contra', who: 'lobo', title: '金色の部屋に入ったわけ', lines: [
      { es: 'Tengo ochenta años.', ja: '80歳だよ。' },
      { es: 'Por eso entré en la Sala Dorada.', ja: 'だから、金色の部屋に入ったんだ。' },
      { es: 'Pata es mayor que yo.', ja: 'パタさんは、ぼくより年上だ。' },
      { es: 'La doctora es menor que yo.', ja: '先生は、ぼくより年下だ。' }
    ], a: [0, 2], after: [
      { t: 'say', who: 'nico', x: '80歳なら、70歳のパタさんより年上のはず！\n自分で言ったことが、ムジュンしています！' },
      { t: 'say', who: 'lobo', es: 'Eh... ¡Fue un error!', x: 'あ、あれ…言いまちがいだ！' },
      { t: 'say', who: 'pavon', es: '¡Es un error pequeño!', x: 'ちょっとした言いまちがいでしょう！' }
    ] },
    { t: 'testimony', who: 'lobo', title: 'ロボの年れい', hint: '受付で手に入れた書類を思い出して。', lines: [
      { es: 'Hoy estoy un poco cansado.', ja: '今日は、少しつかれていてね。',
        press: [{ t: 'say', who: 'mimi', x: 'つかれていても、年れいはかわらないよ。' }] },
      { es: 'Tengo ochenta años, de verdad.', ja: '本当に、80歳なんだ。', ok: ['certificado'],
        press: [{ t: 'say', who: 'lobo', es: '¡Sí, sí! De verdad.', x: 'ほんとう、ほんとう！' }] },
      { es: 'Soy mayor que la doctora.', ja: '先生より年上だよ。',
        press: [{ t: 'say', who: 'mimi', x: '先生は45歳。80歳なら、たしかに年上だけど…。' }] },
      { es: 'Yo no tomé el pastel. Lo juro.', ja: 'ケーキはとっていない。ちかうよ。',
        press: [{ t: 'say', who: 'lobo', es: '¡Lo juro!', x: 'ちかう！' }] }
    ], after: [
      { t: 'say', who: 'nico', x: 'ロボさんの出生証明書には、\n「30歳」と書いてあります！' },
      { t: 'say', who: 'lobo', es: '¡Ay!', x: 'うっ！' }
    ] },
    { t: 'order', q: '3人を、年上の順に並べよう。（いちばん年上から）', items: [{ id: 'lana', e: '🐑', n: 'ラナ先生（45歳）' }, { id: 'lobo', e: '🐺', n: 'ロボ（30歳）' }, { id: 'pata', e: '🦆', n: 'パタ（70歳）' }], a: ['pata', 'lana', 'lobo'],
      r: [{ t: 'say', who: 'mimi', x: 'パタ → ラナ → ロボ。\nロボさんは、いちばん年下だ！' }] },
    { t: 'present', q: 'ロボさんが、金色の部屋でケーキを食べた証拠は？', ok: ['pelos'], after: [
      { t: 'say', who: 'nico', x: 'テーブルに、はちみつのついた灰色の毛。\nラナ先生は、まっ白なヒツジです。' },
      { t: 'say', who: 'juez', x: '灰色の毛…。ふむ…。' }
    ] },
    { t: 'build', q: 'とどめの一言を組み立てよう：「あなたは、先生より年下だ！」', es: 'Usted es menor que la doctora.', x: ['mayor', 'más'],
      r: [{ t: 'slam', txt: '¡Menor!' }] },
    { t: 'say', who: 'lobo', es: 'Perdón. Quería el pastel de miel.', x: 'ごめんなさい。はちみつケーキが食べたくて…。' },
    { t: 'say', who: 'pata', es: 'Mañana hago un pastel mejor para todos.', x: '明日、みんなのために\nもっとおいしいケーキを焼きますよ。' },
    { t: 'say', who: 'juez', x: '判決を…言いわたします…。' },
    { t: 'verdict', txt: '無罪', es: 'INOCENTE' },
    { t: 'say', who: 'mimi', x: 'やったね、ニコ先生！\nmejor・peor・mayor・menor、もうばっちり。' }
  ]
});
