/* 第6話（最終話） 森の銀行の大事件 — -ísimo ／ más de・menos de ＋ 数 ／ 第1〜5話の総まとめ
 *
 * ■ shared/es-words.js に「まだない語」（形：語 / 意味 / 品詞 / 級(5=5級,4=4級,3=4級より上)  ＋ 出てきた活用形）
 *   ■名詞
 *   banco / 銀行 / n / 4（banco）
 *   moneda / 硬貨・コイン / n / 4（monedas）
 *   oro / 金 / n / 4
 *   caja fuerte / 金庫 / n / 3（caja＝箱 は 4。fuerte＝強い・頑丈な）
 *   cajero / 窓口係・レジ係 / n / 4
 *   abogado / 弁護士 / n / 4
 *   fiscal / 検事 / n / 3
 *   ladrón / どろぼう / n / 4（ladrona）
 *   testigo / 証人 / n / 3
 *   urraca / カササギ / n / 3
 *   castor / ビーバー / n / 3
 *   nido / 巣 / n / 4
 *   pluma / 羽根 / n / 4
 *   cola / しっぽ / n / 4
 *   sombra / 影 / n / 4
 *   luz / 光 / n / 4
 *   árbol / 木 / n / 5
 *   bosque / 森 / n / 4
 *   pastel / ケーキ / n / 4（pasteles）
 *   caso / 事件 / n / 4
 *   señorita / お嬢さん（未婚の女性の呼びかけ）/ n / 4
 *   don / 〜さま（男性の名前につける敬称）/ n / 4（Don Pavón）
 *   ■動詞
 *   brillar / 光る / v / 4（brilla）
 *   caber / 入る（収まる）/ v / 3（cabe）
 *   llevar の点過去 llevó（既存 llevar に追加する形）
 *   cerrar の点過去 cerré（既存 cerrar に追加）／ entrar / 入る / v / 5（entró）
 *   ir の点過去 fui（既存 ir に追加）／ pasar の点過去 pasé（既存 pasar に追加）
 *   volar / 飛ぶ / v / 4（vuela）
 *   salir の salgo（既存 salir に追加）／ mirar / 見る・見つめる / v / 5（mira）
 *   sentir / 残念に思う（lo siento＝ごめんなさい）/ v / 4（siento）
 *   equivocarse / まちがえる / v / 3（me equivoqué）
 *   estar の estoy・haber の había（既存に追加）／ ser の soy（既存に追加）
 *   ■形容詞
 *   alto / 高い / adj / 5（alta, altísimo, altísima）
 *   ancho / はばが広い / adj / 4（ancha）
 *   caro / 値段が高い / adj / 5（carísimo）
 *   rico / おいしい・金持ちの / adj / 5（riquísimo, riquísima, riquísimos）
 *   estrecho は既存（3）→ estrechísima を追加
 *   bonito は既存 → bonitísima を追加 ／ pequeño は既存 → pequeñísimo
 *   dorado / 金色の / adj / 4（dorada）
 *   vacío / からっぽの / adj / 4（vacía）
 *   inocente / 無実の / adj / 4
 *   elegante / エレガントな / adj / 4
 *   mejor / より良い / adj / 4 ／ peor / より悪い / adj / 4（peores）
 *   mayor / 年上の・より大きい / adj / 4 ／ menor / 年下の・より小さい / adj / 4
 *   otro / 他の / adj / 5（otra）／ negro は既存 → negros ／ blanco は既存 → blancos
 *   segundo / 2番目の / adj / 5 ／ pocos / 少しの / adj / 5（pocas）／ gran / 大きな・偉大な / adj / 4
 *   ■数・副詞・そのほか
 *   cien / 100 / num / 5 ／ ciento / 100（ciento veinte のとき）/ num / 5 ／ diez / 10 / num / 5
 *   veinte / 20 / num / 5 ／ ocho / 8 / num / 5
 *   menos / より少なく・〜ほど…ない / adv / 5 ／ tan / 同じくらい・そんなに / adv / 5
 *   tanto / 同じだけ・そんなに（tantas）/ adv・det / 5 ／ como / 〜のように・〜と同じ / conj / 5
 *   peor・mejor は上に ／ siempre / いつも / adv / 5 ／ nunca / けっして〜ない / adv / 5
 *   anoche / ゆうべ / adv / 5 ／ ahora / いま / adv / 5 ／ solo / ただ〜だけ / adv / 5
 *   delante / 前に（delante de＝〜の前に）/ adv / 4 ／ nada / なにも〜ない / pron / 5
 *   pero / しかし / conj / 5 ／ hola / こんにちは / int / 5 ／ sí / はい / adv / 5
 *   eso / それ（por eso＝だから）/ pron / 5 ／ del（de＋el）/ art / 0
 *   ay / あっ・ひえっ / int / 5
 *   ■その他、既存 es-words に見出しがあっても「活用形」が足りないもの：
 *   estar estoy／ir fui／pasar pasé／cerrar cerré／llevar llevó／ver 点過去 vi は既存／haber había／entrar entró
 *
 *  数えると、新しい見出しの語は約 60。
 */
PQ.cases.push({
  id: 'c6', no: 6, title: '森の銀行の大事件', es: 'El gran caso del banco', icon: '🏦',
  grammar: '-ísimo ／ más de・menos de ＋ 数 ／ 総まとめ',
  cover: '森の銀行の金庫から、100枚をこえる金貨が消えた。つかまったのは、なんと検事のドン・パボン。最後の事件、ライバルを弁護する！',
  cast: {
    castor: { n: 'カストル', es: 'Señor Castor', e: '🦫', role: '証人・銀行の窓口係' },
    buho:   { n: 'フクロウ検事', es: 'Fiscal Búho', e: '🦉', role: '代わりの検事' },
    urraca: { n: 'ウラカ', es: 'Señorita Urraca', e: '🐦', role: '証人・銀行の前の木に住む鳥' }
  },
  evidence: {
    caja:    { e: '🔐', n: '金庫の記録', d: 'きのうの夜は金貨 120 枚。朝は 0 枚。ドアの鍵はそのまま（開けるとベルが鳴る）。' },
    ventana: { e: '🪟', n: '金庫の窓', d: '床から 400 cm の高さ。はばは 20 cm しかない。ドアのほかの出入り口はここだけ。' },
    pavon:   { e: '🦚', n: 'パボンの体', d: 'はばは 60 cm。羽根を広げると 150 cm。' },
    pluma:   { e: '🪶', n: '窓のふちの羽根', d: '白と黒の小さな羽根が1枚。長さ 6 cm。' },
    urraca:  { e: '🐦', n: '証人ウラカ', d: '白と黒の鳥。はば 15 cm。光る物が大すき。銀行の前の木に住んでいる。' },
    nido:    { e: '🪺', n: '木の上の巣の写真', d: '窓の前の木に、キラキラの巣。中に金貨が 120 枚。' }
  },
  steps: [
    /* ---------- 事務所 ---------- */
    { t: 'scene', place: 'office', cast: ['nico', 'mimi'] },
    { t: 'say', who: 'mimi', x: 'ニコ先生、最終回の依頼だよ！\n森の銀行の金庫から、金貨が消えたの。' },
    { t: 'say', who: 'nico', x: 'それで、つかまったのは？' },
    { t: 'enter', who: 'pavon' },
    { t: 'say', who: 'pavon', es: 'Soy inocente, Nico.', x: 'わたしは無実だ、ニコくん。' },
    { t: 'say', who: 'nico', x: 'パ、パボン検事！？\nいつも ぼくをやっつけてる あなたが、被告…！' },
    { t: 'say', who: 'pavon', es: 'Necesito un abogado.', x: 'わたしには弁護士が必要なのだ。\n（できれば、森でいちばん優秀な…）' },
    { t: 'say', who: 'mimi', x: '最終話だから、今までの形ぜんぶ使うことになるよ。\nそれに、新しい形が2つ！' },
    { t: 'say', who: 'nico', x: '…わかりました。\nライバルでも、無実の人は守ります！' },

    /* ---------- 銀行 ---------- */
    { t: 'scene', place: 'banco', cast: ['nico', 'mimi', 'castor'] },
    { t: 'say', who: 'castor', es: '¡Las monedas de oro no están!', x: 'き、金貨が！\n金庫から消えちゃったんです！' },
    { t: 'say', who: 'castor', es: 'Soy cajero. Estoy muy cansado.', x: 'ぼくは窓口係です。\nもう、くたくた…。' },
    { t: 'say', who: 'mimi', x: '金庫のまわりを調べよう！\n「数」のことと「とても…」の言い方がカギだよ。' },
    { t: 'inspect', spots: [
      { e: '🔐', n: '金庫', steps: [
        { t: 'say', who: 'castor', es: 'Anoche había ciento veinte monedas de oro.', x: 'ゆうべは、金貨が120枚ありました。' },
        { t: 'say', who: 'castor', es: 'Ahora la caja fuerte está vacía.', x: 'いまは、からっぽです。' },
        { t: 'get', ev: 'caja' },
        { t: 'chart', title: '金貨の数', unit: '枚', bars: [{ e: '🪙', n: '金庫の金貨', v: 120 }, { e: '💯', n: '100枚のライン', v: 100 }], hi: [0] },
        { t: 'ask', q: 'グラフを見て。金貨は、100枚より多い？　少ない？', o: ['多い', '少ない'], a: 0 },
        { t: 'say', who: 'mimi', x: 'これまでは「〜より」を que で言ってきたね。\n「100枚より多い」は、どう言うと思う？' },
        { t: 'ask', q: '予想してみよう。', o: ['más que cien', 'más de cien'], a: 1,
          r: [{ t: 'say', who: 'mimi', x: '正解！ 相手が「数」のときは、que ではなく **de**。' }] },
        { t: 'note', title: '数のときは de', rows: [
          ['Había [más de] cien monedas.', '100枚をこえる金貨があった。'],
          ['Hay [menos de] diez monedas.', '10枚に満たない金貨しかない。']],
          x: '**más de ＋ 数**＝「〜をこえる」\n**menos de ＋ 数**＝「〜に満たない」\n人やものとくらべるときは que、数とくらべるときは de。' },
        { t: 'ask', q: '___ に入るのは？', es: 'Tengo menos ___ diez monedas.', o: ['que', 'de'], a: 1,
          r: [{ t: 'say', who: 'mimi', x: 'そう、diez は数だから de。' }] },
        { t: 'ask', q: 'こっちは？ ___ に入るのは？', es: 'El oso es más grande ___ el pan.', o: ['que', 'de'], a: 0,
          r: [{ t: 'say', who: 'mimi', x: 'パンは「もの」だから que。\n「数」なら de、「もの・人」なら que だよ。' }] }
      ] },
      { e: '🪟', n: '窓', steps: [
        { t: 'chart', title: '床からの高さ', unit: 'cm', bars: [{ e: '🪟', n: '窓', v: 400 }, { e: '🦚', n: 'パボン', v: 120 }, { e: '🦊', n: 'ニコ', v: 100 }], hi: [0] },
        { t: 'ask', q: 'いちばん高いところにあるのは？', o: ['🪟 窓', '🦚 パボン', '🦊 ニコ'], a: 0 },
        { t: 'say', who: 'castor', es: 'La ventana es altísima.', x: '窓は、ものすごく高いところにあるんです。' },
        { t: 'ask', q: 'altísima は、alta よりどんな感じ？', o: ['もっと強い（ものすごく高い）', '弱い（少し高い）'], a: 0 },
        { t: 'note', title: 'とても…（-ísimo）', rows: [
          ['alto → alt[ísimo]', 'とても高い（最後の o をとって -ísimo）'],
          ['La ventana es alt[ísima].', '窓は、ものすごく高い。']],
          x: '**形容詞の最後の母音をとって、-ísimo をつける。**\n「とても…」「ものすごく…」の気持ちが強い言い方。' },
        { t: 'ask', q: '同じ作り方で、caro（値段が高い）を「ものすごく高い」にすると？', o: ['carísimo', 'caroísimo', 'carosísimo'], a: 0,
          r: [{ t: 'say', who: 'mimi', x: '最後の母音 o をとって、ísimo！\ncaro → carísimo。' }] },
        { t: 'ask', q: '___ に入るのは？', es: 'La ventana es alt___.', o: ['ísimo', 'ísima', 'ísimos'], a: 1,
          ng: 'la ventana は女性・単数の名詞だよ。',
          r: [{ t: 'say', who: 'mimi', x: 'そう、窓は女性だから altísima。' }] },
        { t: 'tip', title: '-ísimo も形容詞', x: '**altísimo／altísima／altísimos／altísimas**\n-ísimo も、ふつうの形容詞と同じで 性・数 に合わせる。',
          why: 'muy alto と同じ「とても」の意味。でも、気持ちがずっと強くなる。' },
        { t: 'say', who: 'castor', es: 'Y es estrechísima.', x: 'しかも、ものすごくせまいんです。' },
        { t: 'chart', title: 'はば', unit: 'cm', bars: [{ e: '🪟', n: '窓', v: 20 }, { e: '🦚', n: 'パボン', v: 60 }], hi: [0] },
        { t: 'ask', q: 'パボンは、この窓を通れる？', o: ['通れる', '通れない'], a: 1,
          r: [{ t: 'say', who: 'mimi', x: '窓のはばは 20 cm。パボンは 60 cm もあるもんね。' }] },
        { t: 'get', ev: 'ventana' },
        { t: 'get', ev: 'pavon' },
        { t: 'say', who: 'mimi', x: 'あれ？ 窓のふちに、小さな羽根が1枚。\n白と黒だ…。' },
        { t: 'get', ev: 'pluma' }
      ] },
      { e: '🍰', n: '窓口', steps: [
        { t: 'say', who: 'castor', es: '¿Un pastel? Es riquísimo.', x: 'ケーキはいかが？\nとってもおいしいですよ。' },
        { t: 'say', who: 'mimi', x: 'riquísimo…。\nrico の c が qu に変わってるね。\nなぜだと思う？' },
        { t: 'ask', q: 'ci と書くと「シ」の音になっちゃう。\n「キ」の音を残して「とてもおいしい」にするには？', o: ['ricísimo', 'riquísimo', 'ricoísimo'], a: 1,
          r: [{ t: 'say', who: 'mimi', x: 'そう！ 「キ」の音を残すために、c を qu にするんだ。' }] },
        { t: 'chart', title: '値段', unit: '€', bars: [{ e: '🍰', n: 'ケーキ', v: 12 }, { e: '🥖', n: 'パン', v: 2 }], hi: [0] },
        { t: 'ask', q: '___ に入るのは？', es: 'El pastel es car___.', o: ['ísimo', 'ísima', 'ísimos'], a: 0 },
        { t: 'ask', q: '___ に入るのは？', es: 'Los pasteles son riqu___.', o: ['ísimas', 'ísimos', 'ísimo'], a: 1,
          ng: 'los pasteles は男性・複数だよ。',
          r: [{ t: 'say', who: 'mimi', x: '男性・複数だから riquísimos。' }] },
        { t: 'note', title: '-ísimo の作り方まとめ', rows: [
          ['alto → [altísimo]', '最後の母音をとって -ísimo'],
          ['caro → [carísimo]', '同じ'],
          ['rico → [riquísimo]', 'c は qu に（音を残す）'],
          ['alta → [altísima]', '性・数は形容詞に合わせる']],
          x: 'muy ＋ 形容詞 と同じ「とても」。\nただし -ísimo は más といっしょには使わないよ。' }
      ] }
    ] },
    { t: 'say', who: 'nico', x: '窓は高くて、せまい。\nパボンが入れるとは思えない…。' },

    /* ---------- 法廷 ---------- */
    { t: 'scene', place: 'court', cast: ['nico', 'mimi', 'juez', 'buho', 'pavon'] },
    { t: 'say', who: 'juez', x: 'これより…開廷…します…。\n今日の検事は…ふだんの検事が被告なので…代理です…。' },
    { t: 'say', who: 'buho', es: 'Soy el fiscal Búho.', x: 'わしが代理検事のフクロウじゃ。' },
    { t: 'say', who: 'buho', x: '被告パボンは大金持ち。\nだが金貨がほしくなった、とわしは見る。' },
    { t: 'say', who: 'pavon', es: '¡Soy riquísimo! No necesito más.', x: 'わたしは大金持ちだ！\nこれ以上はいらん！' },
    { t: 'say', who: 'juez', x: '証人を…呼びなさい…。窓口係のカストルさん。' },
    { t: 'enter', who: 'castor' },
    { t: 'say', who: 'mimi', x: '1回目の尋問だよ。\nさっき調べた窓のことを思い出して！' },
    { t: 'testimony', who: 'castor', title: 'ゆうべの金庫', hint: '窓のはばと、パボンのはばをくらべてみて。', lines: [
      { es: 'Ayer cerré la caja fuerte a las ocho.', ja: 'きのう、8時に金庫を閉めました。',
        press: [{ t: 'say', who: 'castor', es: 'Sí, con llave.', x: 'はい、鍵をかけて。' }] },
      { es: 'A las diez vi una luz dorada.', ja: '10時に、金色の光が見えました。',
        press: [{ t: 'say', who: 'castor', es: 'Una luz muy bonita.', x: 'とってもきれいな光でした。' }] },
      { es: 'Una sombra grande entró por la ventana.', ja: '大きな影が、窓から入りました。', ok: ['ventana', 'pavon'],
        press: [{ t: 'say', who: 'castor', es: 'Era enorme. ¡Enorme!', x: '大きかったです。とても！' }, { t: 'say', who: 'mimi', x: '窓のはばは 20 cm…。大きな影って、入れるのかな。' }] },
      { es: 'Don Pavón es enorme. Fue él.', ja: 'パボンさまは大きい。あの方です。' }
    ], after: [
      { t: 'chart', title: 'はば', unit: 'cm', bars: [{ e: '🪟', n: '窓', v: 20 }, { e: '🦚', n: 'パボン', v: 60 }], hi: [0, 1] },
      { t: 'ask', q: 'ニコの主張をスペイン語で言うと？', o: ['Don Pavón es más ancho que la ventana.', 'Don Pavón es menos ancho que la ventana.', 'Don Pavón es tan ancho como la ventana.'], a: 0,
        ng: 'グラフでは、パボンのほうが 60 cm で大きいよ。',
        r: [{ t: 'say', who: 'nico', es: 'Don Pavón es más ancho que la ventana.', x: 'パボンは窓より はばが広い！\n通れるはずがありません！' }] },
      { t: 'say', who: 'buho', x: 'む、むむ…。\nだが、被告は大金持ちじゃ。動機はある！' }
    ] },
    { t: 'contra', who: 'buho', title: 'フクロウ検事の主張', lines: [
      { es: 'Don Pavón es riquísimo.', ja: 'パボンは大金持ちじゃ。' },
      { es: 'Pero quiere más oro.', ja: 'だが、もっと金がほしいのじゃ。' },
      { es: 'El ladrón llevó más de cien monedas.', ja: 'どろぼうは、100枚をこえる金貨をもっていった。' },
      { es: 'El ladrón llevó menos de diez monedas.', ja: 'どろぼうは、10枚に満たない金貨をもっていった。' }
    ], a: [2, 3], after: [
      { t: 'say', who: 'mimi', x: '「100枚をこえる」と「10枚に満たない」。\n両方は本当にならないよ！' },
      { t: 'say', who: 'buho', es: '¡Ay, me equivoqué!', x: 'おっと、まちがえたわい！' },
      { t: 'slam', txt: '¡Protesto!' }
    ] },
    { t: 'say', who: 'buho', es: 'Don Pavón tiene más de cien monedas en casa.', x: '（スペイン語で、新しい主張をしている…）' },
    { t: 'interp', who: 'loro', es: 'Don Pavón tiene más de cien monedas en casa.', ja: 'パボンは、家に金貨を100枚足らずしか持っていない。',
      o: ['パボンは、家に金貨を100枚足らずしか持っていない。', 'パボンは、家に金貨を100枚をこえて持っている。', 'パボンは、家にちょうど100枚の金貨を持っている。'], a: 1,
      after: [
        { t: 'say', who: 'loro', x: 'シ、失礼！ más de は「〜をこえる」。\n訳しなおすと「100枚をこえて持っている」です。' },
        { t: 'say', who: 'nico', x: 'そんなに持っている人が、わざわざ盗むでしょうか？' }
      ] },
    { t: 'say', who: 'mimi', x: '窓を通れるのはだれか、整理しよう。\nはばの せまい順にならべてみて！' },
    { t: 'order', q: 'はばが せまい順（細い→太い）にならべよう', items: [
      { id: 'cola', e: '🦚✨', n: '羽根を広げたパボン 150 cm' },
      { id: 'pavon', e: '🦚', n: 'パボン 60 cm' },
      { id: 'ventana', e: '🪟', n: '窓 20 cm' },
      { id: 'castor', e: '🦫', n: 'カストル 40 cm' }
    ], a: ['ventana', 'castor', 'pavon', 'cola'],
      r: [{ t: 'say', who: 'mimi', x: '窓は 20 cm。\nそれより細い者でないと、通れないね。' }] },
    { t: 'say', who: 'buho', es: 'Tengo otra testigo.', x: 'もう1人、証人がおる。\n銀行の前の木に住む、ウラカくんじゃ。' },
    { t: 'enter', who: 'urraca' },
    { t: 'say', who: 'urraca', es: 'Hola, soy Urraca.', x: 'こんにちは、ウラカよ。' },
    { t: 'get', ev: 'urraca' },
    { t: 'say', who: 'mimi', x: '白と黒の鳥…。\n窓の羽根と、同じ色だ。' },
    { t: 'testimony', who: 'urraca', title: 'ゆうべ見たもの', hint: '窓のふちの羽根と、ウラカさんのすがたをくらべてみて。', lines: [
      { es: 'Vivo en el árbol delante del banco.', ja: 'わたし、銀行の前の木に住んでるの。',
        press: [{ t: 'say', who: 'urraca', es: 'Sí, tengo un nido.', x: 'ええ、巣があるのよ。' }] },
      { es: 'Anoche vi a Don Pavón cerca del banco.', ja: 'ゆうべ、パボンさまが銀行の近くにいたの。',
        press: [{ t: 'say', who: 'pavon', es: 'Sí, pasé por allí. Solo pasé.', x: '通っただけだ！' }] },
      { es: 'Su cola es bonitísima y brilla mucho.', ja: 'しっぽがとってもきれいで、よく光ってたわ。',
        press: [{ t: 'say', who: 'pavon', es: '¡Gracias!', x: 'おお、わかっているじゃないか！' }, { t: 'say', who: 'mimi', x: '（ほめてる場合じゃないよ…）' }] },
      { es: 'Yo no fui a la ventana del banco.', ja: 'わたしは、銀行の窓には行ってないわ。', ok: ['pluma', 'urraca'],
        press: [{ t: 'say', who: 'urraca', es: '¡De verdad!', x: '本当よ！' }] }
    ], after: [
      { t: 'say', who: 'nico', x: '窓のふちの羽根は、白と黒。\nそして、あなたも白と黒の鳥です。' },
      { t: 'chart', title: 'はば', unit: 'cm', bars: [{ e: '🐦', n: 'ウラカ', v: 15 }, { e: '🪟', n: '窓', v: 20 }, { e: '🦚', n: 'パボン', v: 60 }], hi: [0] },
      { t: 'ask', q: '___ に入るのは？', es: 'La urraca es ___ ancha que la ventana.', o: ['más', 'menos'], a: 1,
        ng: 'ウラカ（15 cm）と窓（20 cm）、はばが小さいのは？',
        r: [{ t: 'say', who: 'nico', es: 'La urraca es menos ancha que la ventana.', x: 'ウラカさんは、窓ほど はばが広くない！\nつまり、通れます！' }] },
      { t: 'say', who: 'urraca', es: '¡Hay muchos pájaros blancos y negros!', x: '白黒の鳥なんて、たくさんいるわ！' },
      { t: 'say', who: 'buho', x: 'そうじゃ！ それだけでは決め手にならんぞ！' }
    ] },

    /* ---------- 総まとめ ---------- */
    { t: 'say', who: 'mimi', x: 'ここで、第1話からの形ぜんぶ使って、\nニコ先生がウラカさんを追いつめるよ！' },
    { t: 'note', title: 'これまでの形（おさらい）', rows: [
      ['más / menos … [que]', '第1話：〜より… ／ 〜ほど…ない'],
      ['tan … [como]', '第2話：〜と同じくらい…'],
      ['mejor / peor　mayor / menor', '第3話：〜より良い・悪い ／ 年上・年下'],
      ['tanto … [como]', '第4話：〜と同じだけ（数・量）'],
      ['el más … [de]', '第5話：〜の中でいちばん…']] },
    { t: 'chart', title: '高さ', unit: 'cm', bars: [{ e: '🪺', n: 'ウラカの巣', v: 400 }, { e: '🪟', n: '窓', v: 400 }] },
    { t: 'ask', q: 'ウラカさんの巣は、窓と同じ高さ。ニコの指摘は？', es: 'Su nido es tan alto ___ la ventana.', o: ['como', 'que', 'de'], a: 0,
      ng: '「同じくらい」は tan … como だよ。',
      r: [{ t: 'say', who: 'nico', x: '巣は窓と同じ高さ。\n窓にとても近いんです！' }] },
    { t: 'ask', q: 'パボンは年をとって、あまり飛べない。', es: 'Don Pavón vuela ___ que la urraca.', o: ['mejor', 'peor', 'mayor'], a: 1,
      ng: '「飛ぶのが下手」＝「より悪い」だよ。',
      r: [{ t: 'say', who: 'nico', x: 'パボンは飛ぶのがヘタ。\nあの高い窓まで行けません！' }] },
    { t: 'ask', q: '年齢をくらべると？', es: 'Don Pavón es ___ que la urraca.', o: ['mayor', 'menor', 'más pequeño'], a: 0,
      ng: 'パボンは12歳、ウラカさんは3歳。年上は？',
      r: [{ t: 'say', who: 'buho', x: 'う、うむ…。たしかに…。' }] },
    { t: 'ask', q: 'この近所で、窓を通れるのは？', es: 'La urraca es la más pequeña ___ barrio.', o: ['del', 'que', 'como'], a: 0,
      ng: '「〜の中でいちばん」は de。de ＋ el は del になるよ。',
      r: [{ t: 'say', who: 'nico', es: 'La urraca es la más pequeña del barrio.', x: 'この近所で いちばん小さい鳥。\n窓を通れるのは、あなただけです！' }] },
    { t: 'say', who: 'urraca', es: 'Mi nido es pequeñísimo...', x: 'わ、わたしの巣は、ものすごく小さいの…。' },
    { t: 'say', who: 'mimi', x: 'ニコ先生、巣の写真が撮れたよ！\nさっき木に登って、とってきたの！' },
    { t: 'get', ev: 'nido' },
    { t: 'say', who: 'nico', x: '窓の前の木にある、ウラカさんの巣です。\nよく見てください。' },
    { t: 'say', who: 'juez', x: 'ふむ…。キラキラ…しておるな…。' },
    { t: 'testimony', who: 'urraca', title: 'わたしの巣', hint: '巣の写真に、金貨が何枚うつっている？', lines: [
      { es: 'Mi nido es pequeñísimo.', ja: 'わたしの巣は、ものすごく小さいの。',
        press: [{ t: 'say', who: 'urraca', es: 'Sí, de verdad.', x: 'ええ、本当に。' }] },
      { es: 'No cabe nada en mi nido.', ja: 'なんにも入らないわ。',
        press: [{ t: 'say', who: 'mimi', x: 'ふーん…？ 写真にはキラキラがいっぱいだけど。' }] },
      { es: 'Tengo menos de diez monedas.', ja: 'わたしの金貨は、10枚に満たないわ。', ok: ['nido'],
        press: [{ t: 'say', who: 'urraca', es: 'Sí, pocas.', x: 'ええ、ほんの少しよ。' }] },
      { es: 'Por eso, no soy la ladrona.', ja: 'だから、わたしはどろぼうじゃないわ。' }
    ], after: [
      { t: 'chart', title: '巣の金貨', unit: '枚', bars: [{ e: '🪺', n: '写真の巣', v: 120 }, { e: '🐦', n: 'ウラカの話', v: 10 }], hi: [0] },
      { t: 'ask', q: '写真の巣について、ニコの主張は？', es: 'En su nido hay ...', o: ['más de cien monedas', 'más que cien monedas', 'menos de diez monedas'], a: 0,
        ng: '写真には 120 枚。数とくらべるときは？',
        r: [{ t: 'say', who: 'nico', es: 'En su nido hay más de cien monedas.', x: 'あなたの巣には、100枚をこえる金貨がある！' }] },
      { t: 'ask', q: '巣の金貨は、金庫にあった数と同じ。', es: 'El nido tiene ___ monedas como la caja fuerte.', o: ['tan', 'tantas', 'tanto'], a: 1,
        ng: 'monedas は女性・複数。「同じだけの」は tanto を合わせる。',
        r: [{ t: 'say', who: 'nico', x: '巣の金貨は、金庫の金貨と同じ数。\n120枚、ぴったりです！' }] },
      { t: 'say', who: 'juez', x: 'ふむ…。証人、もう一度…主張を…。' }
    ] },
    { t: 'stop', who: 'urraca', title: 'ウラカのいいわけ', lines: [
      { es: 'Son las monedas de mi abuela.', ja: 'おばあちゃんの金貨なの。' },
      { es: 'Mi abuela era riquísima.', ja: 'おばあちゃんは大金持ちだったの。' },
      { es: 'Yo nunca salgo de noche.', ja: 'わたしは夜には出かけないわ。' },
      { es: 'Mi nido es mi tesoro.', ja: '巣はわたしの宝物よ。' }
    ], a: 2, after: [
      { t: 'say', who: 'nico', x: 'さっきの証言で、あなたは言いました。\n「ゆうべ、パボンを見た」と。' },
      { t: 'say', who: 'nico', x: '夜に出かけないなら、見られるはずがない！' },
      { t: 'slam', txt: '¡Protesto!' }
    ] },
    { t: 'say', who: 'urraca', es: '¡Ay, ay, ay!', x: 'ひ、ひえええ！' },
    { t: 'build', q: 'とどめの一言：「あなたの巣には、100枚をこえる金貨がある」', es: 'Su nido tiene más de cien monedas.', x: ['que', 'menos'],
      r: [{ t: 'slam', txt: '¡Más de cien!' }] },
    { t: 'say', who: 'urraca', es: 'Lo siento... Son tan bonitas...', x: 'ごめんなさい…。\nだって、あんまりキラキラで…。' },
    { t: 'say', who: 'castor', es: 'Siempre mira las monedas.', x: 'いつも金貨をじっと見てたもんなぁ。' },
    { t: 'say', who: 'juez', x: '判決を…言いわたします…。' },
    { t: 'verdict', txt: '無罪', es: 'INOCENTE' },
    { t: 'say', who: 'pavon', es: 'Usted es el mejor abogado del bosque.', x: 'きみは、森でいちばんの弁護士だ。' },
    { t: 'say', who: 'pavon', es: 'Y yo soy el segundo fiscal más elegante.', x: 'そして わたしは…\n二番目にエレガントな検事だ。' },
    { t: 'say', who: 'nico', x: '…ありがとうございます、パボン検事。\nでも、ぼくだけの力じゃありません。' },
    { t: 'say', who: 'mimi', x: 'やったね、ニコ先生！\n6つの事件、ぜんぶ解決だよ！' },
    { t: 'tip', title: '第6話のまとめ', x: '**-ísimo**：最後の母音をとって つける（altísimo／carísimo／riquísimo）\n**más de・menos de ＋ 数**：数とくらべるときは que ではなく de',
      why: '「ものや人」とくらべるなら que、「数」なら de。' }
  ]
});
