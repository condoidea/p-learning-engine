/* 第4話 朝市のりんご消失事件 — tanto / tanta / tantos / tantas ＋ 名詞 ＋ como、動詞 ＋ tanto como
 *
 * ■ shared/es-words.js にまだない語（登録が必要）  形：語 / 意味 / 品詞 / 級（5=5級, 4=4級, 3=4級より上）＋ 出てきた形
 *   manzana / りんご / n / 5 … manzanas
 *   pera / ナシ / n / 5 … peras
 *   plátano / バナナ / n / 5 … plátanos
 *   dinero / お金 / n / 5
 *   agua / 水 / n / 5
 *   euro / ユーロ / n / 5 … euros
 *   mercado / 市場・朝市 / n / 5
 *   caja / 箱・レジ / n / 4
 *   cesta / かご / n / 4
 *   recibo / レシート / n / 3
 *   puesto / 売り場・店 / n / 3
 *   lado / 横・そば / n / 4 … al lado（そばに）
 *   tanto / 同じだけの・同じくらい / det / 4 … tanta, tantos, tantas（tanto ＋ 名詞 ＋ como）
 *   tan / 同じくらい（形容詞の前） / adv / 4
 *   como / 〜と同じ（比べる）・〜として / conj / 0
 *   mejor / よりよい / adj / 4 … mejores
 *   mayor / 年上の・より大きい / adj / 4 … mayores
 *   menor / 年下の / adj / 4
 *   menos / より少ない / adv / 0
 *   ahora / いま / adv / 5
 *   pero / しかし / conj / 0
 *   solo / だけ / adv / 5
 *   ella / 彼女 / pron / 0
 *   vender / 売る / v / 5 … vendo
 *   faltar / 足りない / v / 4 … faltan
 *   recordar / おぼえている / v / 4 … recuerdo
 *   olvidar / 忘れる / v / 4 … olvidé
 *   sentir / 残念に思う / v / 4 … siento（lo siento＝ごめん）
 *   tener hambre → hambre / 空腹 / n / 5
 *   rico / おいしい / adj / 5 … ricas
 *   malo / 悪い / adj / 5 … mal（副詞：まちがって）
 *   dos, cuatro, diez, ocho / 2,4,10,8 / num / 5
 *   活用形の追加：comprar … compraron, compró ／ pagar … pagó, pagué ／ tomar … tomó（tomar が未登録なら tomar / 取る / v / 5）／
 *                 estar … estuve ／ ver … vi ／ ir … （なし） ／ contar … cuenta は登録済み
 *   del（de＋el）, sí, perdón, ah, mmm（あいづち）, bosque, elegante, fiscal, inocente（第1話の共通語）
 *   人名：Lili, Tito, Mateo（names に追加）
 */
PQ.cases.push({
  id: 'c4', no: 4, title: '朝市のりんごが消えた', es: 'Las manzanas del mercado', icon: '🍎',
  grammar: 'tanto / tanta / tantos / tantas ＋ 名詞 ＋ como',
  cover: '朝市の果物屋から、りんごが2個消えた。つかまったのは、りんごが大好きなリスのリリ。',
  cast: {
    cerdo: { n: 'ブタ店主', es: 'Señor Cerdo', e: '🐷', role: '果物屋' },
    lili:  { n: 'リリ', es: 'Lili', e: '🐿', role: '被告・リス' },
    tito:  { n: 'ティト', es: 'Tito', e: '🐭', role: '証人・お客のネズミ' },
    mono:  { n: 'マテオ', es: 'Mateo', e: '🐵', role: '証人・バナナ屋のサル' }
  },
  evidence: {
    caja:   { e: '📦', n: 'りんご箱', d: '朝は10個、いまは4個。' },
    recibo: { e: '🧾', n: 'レシート帳', d: 'りんごを買ったのはリリとティトだけ。2匹とも2個ずつ。' },
    cestas: { e: '🧺', n: 'ふたりのかご', d: 'リリのかごにりんご2個。ティトのかごにも2個。' },
    dinero: { e: '💶', n: 'レジのお金', d: 'いま4ユーロ。りんごは1個1ユーロ。リリが2、ティトが2。' }
  },
  steps: [
    /* ---------- 事務所 ---------- */
    { t: 'scene', place: 'office', cast: ['nico', 'mimi'] },
    { t: 'say', who: 'mimi', x: 'ニコ先生、第4話だよ！\n朝市の果物屋で、りんごが消えたって。' },
    { t: 'say', who: 'nico', x: 'つかまったのは、リスのリリさん。\nりんご好きだからって、犯人とは限らないよ。' },

    /* ---------- 朝市 ---------- */
    { t: 'scene', place: 'mercado', cast: ['nico', 'mimi', 'cerdo'] },
    { t: 'say', who: 'cerdo', es: '¡Mis manzanas no están!', x: 'わしのりんごがないんだ！' },
    { t: 'say', who: 'mimi', x: 'この事件のカギは「同じだけ」の言い方。\nまずは、お店の中を調べよう！' },
    { t: 'inspect', spots: [
      { e: '📦', n: 'りんご箱', steps: [
        { t: 'say', who: 'cerdo', es: 'Por la mañana, diez manzanas. Ahora, cuatro.', x: '朝は10個。いまは4個だ。' },
        { t: 'chart', title: 'りんごの数', unit: '個', bars: [{ e: '🌅', n: '朝', v: 10 }, { e: '🕙', n: 'いま', v: 4 }] },
        { t: 'get', ev: 'caja' },
        { t: 'say', who: 'mimi', x: 'ところで、ここのりんごはおいしいって評判。\nナシとくらべた点数も出ているよ。' },
        { t: 'chart', title: 'おいしさ（10点まん点）', unit: '点', bars: [{ e: '🍎', n: 'りんご', v: 9 }, { e: '🍐', n: 'ナシ', v: 7 }] },
        { t: 'ask', q: '___ に入るのは？（第1話・第3話の復習）', es: 'Las manzanas son ___ que las peras.', o: ['mejores', 'mayores', 'más buenas'], a: 0,
          ng: 'bueno（よい）の「より…」は、特別な形があったね。',
          r: [{ t: 'say', who: 'mimi', x: 'そう！ buenas の比べる形は mejores。\nmás buenas とは言わないよ。' }] }
      ] },
      { e: '🧾', n: 'レシート', steps: [
        { t: 'say', who: 'cerdo', es: 'Solo Lili y Tito compraron manzanas.', x: 'りんごを買ったのは、リリとティトだけだ。' },
        { t: 'chart', title: 'レシートのりんごの数', unit: '個', bars: [{ e: '🐿', n: 'リリ', v: 2 }, { e: '🐭', n: 'ティト', v: 2 }] },
        { t: 'ask', q: 'グラフを見て。ふたりのりんごの数は？', o: ['リリのほうが多い', 'ティトのほうが多い', '同じ'], a: 2,
          ng: '2つの棒の高さをくらべてみて。',
          r: [{ t: 'say', who: 'mimi', x: '同じ数だね。\n「同じだけ」の言い方を、お金のグラフで見てみよう。' }] },
        { t: 'chart', title: 'はらったお金', unit: '€', bars: [{ e: '🐿', n: 'リリ', v: 2 }, { e: '🐭', n: 'ティト', v: 2 }] },
        { t: 'note', title: '〜と同じだけのお金', rows: [['Lili pagó [tanto dinero como] Tito.', 'リリは ティトと 同じだけの お金を はらった。']],
          x: '**tanto ＋ 名詞 ＋ como ＋ 相手**＝「〜と同じだけの○○」\n__dinero（お金）は男性・単数__だから tanto。' },
        { t: 'ask', q: 'りんごの数も同じだったね。manzanas（女性・複数）なら、tanto はどうなる？', es: 'Lili compró ___ manzanas como Tito.', o: ['tanto', 'tanta', 'tantos', 'tantas'], a: 3,
          ng: 'manzanas は女性で、複数だよ。',
          r: [{ t: 'say', who: 'mimi', x: '正解！ tantas manzanas como Tito＝\n「ティトと同じ数のりんご」。名詞の数が同じなんだね。' }] },
        { t: 'note', title: 'tanto は名詞に合わせて4つの形', rows: [
          ['Lili pagó [tanto dinero] como Tito.', '男性・単数'],
          ['Tengo [tanta agua] como Tito.', '女性・単数'],
          ['Tito tiene [tantos libros] como Lili.', '男性・複数'],
          ['Lili compró [tantas manzanas] como Tito.', '女性・複数']],
          x: 'tanto は **名詞の性・数に合わせて** tanto / tanta / tantos / tantas。\n**como は変わらない。**' },
        { t: 'ask', q: '___ に入るのは？', es: 'Tengo ___ agua como Tito.', o: ['tanto', 'tanta', 'tantas'], a: 1,
          ng: 'agua は女性・単数の名詞だよ。',
          r: [{ t: 'say', who: 'mimi', x: 'そう、agua は女性・単数だから tanta。' }] },
        { t: 'get', ev: 'recibo' },
        { t: 'get', ev: 'dinero' }
      ] },
      { e: '🧺', n: 'かご', steps: [
        { t: 'say', who: 'mimi', x: 'リリさんとティトくんのかごを見せてもらったよ。' },
        { t: 'chart', title: 'かごの中のりんご', unit: '個', bars: [{ e: '🐿', n: 'リリ', v: 2 }, { e: '🐭', n: 'ティト', v: 2 }] },
        { t: 'get', ev: 'cestas' },
        { t: 'say', who: 'mimi', x: 'ここで「名詞」と「形容詞」の使い分けを見よう。\nりんごとナシは、大きさも同じなんだ。' },
        { t: 'chart', title: '大きさ', unit: 'cm', bars: [{ e: '🍎', n: 'りんご', v: 8 }, { e: '🍐', n: 'ナシ', v: 8 }] },
        { t: 'note', title: '形容詞なら tan（第2話）', rows: [['La pera es [tan grande como] la manzana.', 'ナシは りんごと 同じくらい 大きい。']],
          x: '**tan ＋ 形容詞 ＋ como**（第2話）\ngrande は形容詞だから tan。形は変わらない。' },
        { t: 'ask', q: '名詞の manzanas の前なら、tan と tanto のどっち？', es: 'Lili tiene ___ manzanas como Tito.', o: ['tan', 'tantas'], a: 1,
          ng: 'manzanas は名詞。名詞の前は tanto の仲間だよ。',
          r: [{ t: 'say', who: 'mimi', x: '形容詞のまえは tan、名詞のまえは tanto の仲間。' }] },
        { t: 'chart', title: '1日に食べるりんご', unit: '個', bars: [{ e: '🐿', n: 'リリ', v: 3 }, { e: '🐭', n: 'ティト', v: 3 }] },
        { t: 'note', title: '動詞のあとの tanto como', rows: [['Lili come [tanto como] Tito.', 'リリは ティトと 同じくらい 食べる。']],
          x: '**動詞 ＋ tanto como ＋ 相手**＝「〜と同じくらい…する」\n名詞がないので、tanto の形は変わらない。' },
        { t: 'ask', q: '___ に入るのは？', es: 'Tito come ___ como yo.', o: ['tanto', 'tanta', 'tan'], a: 0,
          ng: '「come（食べる）」は動詞。動詞のあとだよ。',
          r: [{ t: 'say', who: 'mimi', x: 'そう！ come のあとだから tanto como。' }] },
        { t: 'tip', title: 'tan か tanto か', x: '**あとに来るもので決める**\n形容詞 → tan / 名詞 → tanto（性・数に合わせる）/ 動詞のあと → tanto como',
          why: '日本語はどれも「同じくらい」だけど、スペイン語は、あとの言葉で形が変わるんだね。' },
        { t: 'ask', q: '___ に入るのは？', es: 'Tengo ___ plátanos como manzanas.', o: ['tan', 'tanto', 'tantos'], a: 2,
          ng: 'plátanos は名詞で、男性・複数だよ。',
          r: [{ t: 'say', who: 'mimi', x: 'plátanos は男性・複数だから tantos。' }] }
      ] }
    ] },
    { t: 'say', who: 'nico', x: 'ふたりとも、買った数もかごの数も同じ。\nでも、りんごは2個足りない…。' },

    /* ---------- 法廷 ---------- */
    { t: 'scene', place: 'court', cast: ['nico', 'mimi', 'juez', 'pavon'] },
    { t: 'say', who: 'juez', x: 'これより…開廷…します…。' },
    { t: 'say', who: 'pavon', es: 'Soy el fiscal más elegante del bosque.', x: 'わたしは森でいちばんエレガントな検事。\n（ドン・パボンの口ぐせ）' },
    { t: 'say', who: 'pavon', x: '被告のリスは、りんごを多くとったはず。\n証人は、お客のティトさん！' },
    { t: 'enter', who: 'tito' },
    { t: 'say', who: 'tito', es: 'Soy Tito. Esta mañana compré manzanas.', x: 'ティトです。今朝、りんごを買いました。' },
    { t: 'testimony', who: 'tito', title: 'リリのかご', hint: 'ふたりのかごのりんごの数をくらべてみて。', lines: [
      { es: 'Esta mañana estuve en el mercado.', ja: '今朝、朝市にいたの。',
        press: [{ t: 'say', who: 'tito', es: 'Sí, a las ocho.', x: 'ええ、8時に。' }] },
      { es: 'Compré dos manzanas.', ja: 'わたしは、りんごを2個買ったわ。',
        press: [{ t: 'say', who: 'mimi', x: 'レシートにも、ティトくんは2個とあるよ。' }] },
      { es: 'Lili compró tantas manzanas como yo.', ja: 'リリは、わたしと同じ数のりんごを買ったわ。',
        press: [{ t: 'say', who: 'lili', es: 'Sí, compré dos.', x: 'うん、2個買ったよ。' }] },
      { es: 'Pero Lili tiene más manzanas que yo.', ja: 'でも、リリのほうがわたしよりりんごを持っているわ。', ok: ['cestas'],
        press: [{ t: 'say', who: 'tito', es: 'Sí, en su cesta.', x: 'ええ、かごの中によ。' }, { t: 'say', who: 'mimi', x: 'かごの中のりんごの数、確かめたよね…' }] },
      { es: 'Lili tomó dos manzanas más.', ja: 'リリは、りんごを2個よぶんにとったのよ。',
        press: [{ t: 'say', who: 'lili', es: '¡Yo no!', x: 'わたしじゃないよ！' }] }
    ], after: [
      { t: 'chart', title: 'かごの中のりんご', unit: '個', bars: [{ e: '🐿', n: 'リリ', v: 2 }, { e: '🐭', n: 'ティト', v: 2 }], hi: [0, 1] },
      { t: 'say', who: 'nico', x: 'リリさんのかごにあるりんごは2個。\nティトさんのかごも、2個です。' },
      { t: 'ask', q: 'ニコの主張をスペイン語で言うと？', o: ['Lili tiene más manzanas que Tito.', 'Lili tiene tantas manzanas como Tito.', 'Lili tiene menos manzanas que Tito.'], a: 1,
        ng: 'グラフの棒は同じ高さ。「同じ数」だね。',
        r: [{ t: 'say', who: 'nico', es: 'Lili tiene tantas manzanas como Tito.', x: 'リリさんは、ティトさんと同じ数のりんごを持っている！\nよぶんには、とっていません！' }] },
      { t: 'say', who: 'pavon', es: '¡Pero faltan dos manzanas!', x: 'しかし、りんごが2個足りないのですよ！' },
      { t: 'say', who: 'juez', x: 'ふむ…。ほかの証人も…聞こう…。' }
    ] },

    /* ---------- 第2の証人 ---------- */
    { t: 'enter', who: 'mono' },
    { t: 'say', who: 'mono', es: 'Soy Mateo. Vendo plátanos cerca de la caja.', x: 'マテオだよ。レジの近くでバナナを売ってる。' },
    { t: 'chart', title: '年れい', unit: '歳', bars: [{ e: '🐵', n: 'マテオ', v: 12 }, { e: '🐿', n: 'リリ', v: 3 }] },
    { t: 'ask', q: '___ に入るのは？（年上・年下は mayor / menor）', es: 'Mateo es ___ que Lili.', o: ['mayor', 'menor', 'mejor'], a: 0,
      ng: '12歳と3歳。年上はどっち？',
      r: [{ t: 'say', who: 'mimi', x: 'そう、年上は mayor。\nマテオさんは、リリさんより年上だね。' }] },
    { t: 'testimony', who: 'mono', title: 'わたしは買ったよ', hint: 'レシート帳に、マテオさんの名前はあるかな？', lines: [
      { es: 'Mi puesto está cerca de la caja.', ja: 'わたしの店は、レジの近くだよ。',
        press: [{ t: 'say', who: 'mono', es: 'Sí, al lado.', x: 'うん、すぐ横さ。' }] },
      { es: 'Vi a Lili con las manzanas.', ja: 'リリがりんごを持っているのを見たよ。',
        press: [{ t: 'say', who: 'lili', es: 'Las compré. Son dos.', x: '買ったんだよ。2個だけ。' }] },
      { es: 'Yo compré dos manzanas, tantas como ella.', ja: 'わたしも2個買ったよ。リリと同じだけ。', ok: ['recibo'],
        press: [{ t: 'say', who: 'mono', es: 'Sí, esta mañana.', x: 'ほんとだよ、今朝ね。' }, { t: 'say', who: 'mimi', x: 'レシート帳には、買った人が書いてあるはず…' }] },
      { es: 'Pagué dos euros a Cerdo.', ja: 'ブタさんに2ユーロはらったよ。',
        press: [{ t: 'say', who: 'cerdo', es: 'Mmm... no recuerdo.', x: 'うーむ…おぼえてないな。' }] }
    ], after: [
      { t: 'chart', title: 'レシート帳のりんご', unit: '個', bars: [{ e: '🐿', n: 'リリ', v: 2 }, { e: '🐭', n: 'ティト', v: 2 }, { e: '🐵', n: 'マテオ', v: 0 }], hi: [2] },
      { t: 'ask', q: 'レシート帳から言えることは？', o: ['Mateo compró tantas manzanas como Lili.', 'Mateo no compró manzanas.'], a: 1,
        ng: 'グラフでマテオの棒は？',
        r: [{ t: 'say', who: 'nico', es: 'Mateo no compró manzanas.', x: 'マテオさんは、りんごを買っていません！' }] },
      { t: 'say', who: 'mono', es: '¡Ah, perdón! Olvidé el recibo.', x: 'あっ、ごめん！ レシートをもらい忘れたんだ。' },
      { t: 'say', who: 'pavon', x: 'ふむ、それはよくあること。\nさあ、ほかにおかしな点はありますかな？' }
    ] },
    { t: 'say', who: 'nico', x: 'マテオさんは、かごを持っていますね。\nかごの中を見せてください！' },
    { t: 'contra', who: 'mono', title: 'かごのなか', lines: [
      { es: 'No tengo manzanas en mi cesta.', ja: 'わたしのかごに、りんごはないよ。' },
      { es: 'Soy un mono muy bueno.', ja: 'わたしはとてもいいサルだよ。' },
      { es: 'Tengo tantas manzanas como Lili.', ja: 'わたしはリリと同じ数のりんごを持ってるよ。' },
      { es: 'Solo vendo plátanos.', ja: 'わたしは、バナナを売っているだけさ。' }
    ], a: [0, 2], after: [
      { t: 'say', who: 'nico', x: 'りんごがない、と言いながら、\nリリさんと同じ数だけ持っている…！' },
      { t: 'say', who: 'mimi', x: '2つのセリフがムジュンしてるね。\nかごの中は…りんごが2個！' }
    ] },
    { t: 'say', who: 'cerdo', es: '¡Son mis manzanas!', x: 'それはわしのりんごじゃ！' },
    { t: 'order', q: 'けさの出来事を、時間の順にならべよう', items: [
      { id: 'count', e: '🔢', n: '10時：ブタ店主が数える（4個）' },
      { id: 'take', e: '🐵', n: '9時半：だれかがこっそり2個とる' },
      { id: 'open', e: '🌅', n: '8時：店をあける（りんご10個）' },
      { id: 'buy', e: '🛒', n: '9時：リリとティトが買う（4個うれる）' }
    ], a: ['open', 'buy', 'take', 'count'],
      r: [{ t: 'say', who: 'mimi', x: '10個 − 買った4個 − とられた2個 ＝ 4個。\n数はぴったり合うね！' }] },
    { t: 'stop', who: 'mono', title: '言いわけ', lines: [
      { es: '¿Faltan manzanas? ¡No!', ja: 'りんごが消えた？ そんなことないよ！' },
      { es: 'Hay tantas manzanas como por la mañana.', ja: '朝と同じ数のりんごがあるじゃないか。' },
      { es: 'Cerdo cuenta mal.', ja: 'ブタさんの数えまちがいだよ。' }
    ], a: 1, after: [
      { t: 'chart', title: 'りんご箱', unit: '個', bars: [{ e: '🌅', n: '朝', v: 10 }, { e: '🕙', n: 'いま', v: 4 }], hi: [0, 1] },
      { t: 'ask', q: 'ニコの言い返しは？', o: ['Ahora hay tantas manzanas como por la mañana.', 'Ahora no hay tantas manzanas como por la mañana.'], a: 1,
        ng: '朝は10個、いまは4個。同じ数じゃないよ。',
        r: [{ t: 'say', who: 'nico', es: 'Ahora no hay tantas manzanas como por la mañana.', x: 'いまは、朝と同じ数のりんごはありません！\n数えまちがいではないですよ！' }] }
    ] },
    { t: 'say', who: 'mono', es: '¡Tengo hambre! Como tanto como Cerdo.', x: '（スペイン語でさけんでいる…）' },
    { t: 'interp', who: 'loro', es: 'Como tanto como Cerdo.', ja: 'わたしは、ブタさんよりたくさん食べるよ。',
      o: ['わたしは、ブタさんよりたくさん食べるよ。', 'わたしは、ブタさんと同じくらい食べるよ。', 'わたしは、ブタさんほど食べないよ。'], a: 1,
      after: [{ t: 'say', who: 'loro', x: 'シ、失礼！ tanto como は「同じくらい」。\n「ブタさんと同じくらい食べる」です。' }] },
    { t: 'present', q: 'マテオさんの「2ユーロはらった」。これをくずす証拠は？', ok: ['dinero'], after: [
      { t: 'chart', title: 'レジのお金', unit: '€', bars: [{ e: '💶', n: 'マテオがはらったなら', v: 6 }, { e: '💶', n: 'いまのレジ', v: 4 }], hi: [1] },
      { t: 'say', who: 'nico', x: 'マテオさんがはらったなら、レジは6ユーロ。\nでも、レジには4ユーロしかありません！' }
    ] },
    { t: 'build', q: 'とどめの一言を組み立てよう：「あなたは、リリと同じ数のりんごを持っている！」', es: 'Usted tiene tantas manzanas como Lili.', x: ['tantos', 'tanta', 'tan'],
      r: [{ t: 'slam', txt: '¡Tantas manzanas!' }] },
    { t: 'say', who: 'mono', es: 'Lo siento... Las manzanas son muy ricas.', x: 'ごめん…。りんごがおいしそうでつい…。' },
    { t: 'say', who: 'cerdo', es: 'Bueno... Mañana tengo más manzanas para todos.', x: 'まあいい…。明日は、みんなの分もりんごを用意するよ。' },
    { t: 'say', who: 'juez', x: '判決を…言いわたします…。' },
    { t: 'verdict', txt: '無罪', es: 'INOCENTE' },
    { t: 'say', who: 'mimi', x: 'やったね、ニコ先生！\n「tanto ＋ 名詞 ＋ como」も、ばっちりだよ。' }
  ]
});
