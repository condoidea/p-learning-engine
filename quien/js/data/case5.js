/* 第5話 鏡の前の人生相談 — 再帰の se（自分を〜する）・相互の se（おたがいに）
 * 単語帳にない語：escribí=書いた(動詞・4級), escribimos/escriben/escribe=書く(動詞・4級), piso=アパート(名・4級), venden=売る(vender・4級), pisos=アパート(名), quieren/queremos=愛する・好き(querer・4級), camarero/camareros=店員(名・4級), llama/llamo=呼ぶ(llamar・4級), gritan/grita=どなる(gritar・4級), noches=夜(名・4級), odian/odia=きらう(odiar・4級以上), sordo=耳が聞こえない(形・4級以上), siete/seis=7/6(数・4級), levanto/levantas/levantamos/levantan=起きる(levantarse・4級), lava/lavo=洗う(lavar・4級), manos=手(名・4級), ellos=彼ら(代・4級), notas=メモ(名・4級), cartas=手紙(名・4級), vemos=見る(ver・4級), miran=見る(mirar・4級), espejo=鏡(名・4級), sonríen=ほほえむ(sonreír・4級以上), uno=ひとつ(数・4級), domingo=日曜(名・4級), tercer=3番目の(形・4級), porque=なぜなら(接・4級), odia, Hugo/Elena/Luis/Pedro=人名 */
QF.cases.push({
  id: 'c5', no: 5, title: '鏡の前の人生相談', es: 'Se miran', icon: '🪞',
  grammar: '再帰の se・相互の se',
  cover: '新聞の人生相談欄に手紙が届いた。「となりの夫婦が、毎晩どなりあっています」。きらいあっているのか、愛しあっているのか。手紙を書いたのは、だれ？',
  cast: {
    ana:   { n: 'アナ', es: 'Ana', e: '👩', role: '手紙の夫婦の妻' },
    hugo:  { n: 'ウゴ', es: 'Hugo', e: '🧑‍🍳', role: 'カフェの店員' },
    elena: { n: 'エレナ', es: 'Elena', e: '👵', role: '同じ建物の住人' }
  },
  evidence: {
    carta: { e: '✉️', n: '人生相談の手紙', d: '「**Me levanto** a las seis y los oigo. **Se** gritan.」差出人は「3階の E.」。' },
    notas: { e: '💌', n: '食卓の小さなメモ', d: '「Te quiero, Luis.」「Yo también, Ana.」ふたりは毎日、メモをわたしあっている。' },
    cafe:  { e: '☕', n: 'ウゴの話', d: 'ルイスは耳が少し遠い。だからアナは大きな声で話す。日曜は、いつも手をつないで来る。' }
  },
  steps: [
    /* ---------- 編集部 ---------- */
    { t: 'scene', place: 'redaccion', cast: ['leo', 'pepa', 'ramon'] },
    { t: 'say', who: 'ramon', x: 'レオ、人生相談の手紙が来た。\nとなりの夫婦のことらしい。' },
    { t: 'say', who: 'ramon', es: 'Mis vecinos se gritan todas las noches.', x: '「うちのとなりは、毎晩どなりあっている」' },
    { t: 'say', who: 'leo', x: '夫婦は仲が悪いんですか？' },
    { t: 'say', who: 'ramon', es: 'Una vecina dice: «Se odian».', x: 'ある人は「きらいあっている」と言う。' },
    { t: 'say', who: 'ramon', es: 'El camarero dice: «Se quieren».', x: 'カフェの店員は「愛しあっている」と言う。' },
    { t: 'say', who: 'pepa', x: 'この se、第3話・第4話の se とは別物よ。\n見分けのコツは「主語は人か物か」。' },
    { t: 'ask', q: '下の文の主語（動詞が合わせている語）は、人？ 物？', es: 'Se venden pisos.', o: ['物（pisos）', '人'], a: 0,
      r: [{ t: 'say', who: 'pepa', x: '物が主語だから、受身の se ね（第3話）。' }] },
    { t: 'ask', q: 'この文に、主語はある？', es: 'Se dice que Luis es sordo.', o: ['ない（無人称の se）', 'ある（受身の se）'], a: 0,
      r: [{ t: 'say', who: 'pepa', x: '主語がなければ、無人称の se（第4話）。\nじゃあ「人が主語」の se は？' }] },
    { t: 'say', who: 'ramon', x: '夫婦の部屋へ行って、見てこい！' },

    /* ---------- アパート ---------- */
    { t: 'scene', place: 'piso', cast: ['leo', 'pepa', 'ana'] },
    { t: 'say', who: 'ana', es: 'Buenos días. Soy Ana. Vivo aquí con Luis.', x: 'おはよう。アナです。ここでルイスと住んでいます。' },
    { t: 'inspect', spots: [
      { e: '🪞', n: '洗面所の鏡', steps: [
        { t: 'say', who: 'ana', es: 'Luis se levanta a las siete.', x: 'ルイスは 7 時に起きます。' },
        { t: 'ask', q: 'levantar は「起こす」。se levanta で、ルイスはだれを起こす？', o: ['自分自身を', 'ほかのだれかを'], a: 0,
          r: [{ t: 'say', who: 'pepa', x: '自分を起こす＝起きる。\nこの se は「その人自身」よ。' }] },
        { t: 'say', who: 'ana', es: 'Yo me levanto a las seis.', x: 'わたしは 6 時に起きます。' },
        { t: 'ask', q: 'se が me に変わった。なぜ？', o: ['主語が yo（わたし）になったから', '時間が変わったから'], a: 0,
          ng: '主語はだれ？ se は「その人自身」だった。',
          r: [{ t: 'say', who: 'pepa', x: 'そう。自分を指すから、人に合わせて形が変わるの。' }] },
        { t: 'note', title: '再帰の se（自分を〜する）', rows: [
          ['Ana [se] lava.', 'アナは（自分を）洗う。'],
          ['Ana [se] lava las manos.', 'アナは（自分の）手を洗う。'],
          ['Pedro [se] levanta a las siete.', 'ペドロは 7 時に起きる。'],
          ['[Me] llamo Leo. [Se] llama Ana.', 'わたしはレオ。彼女はアナ。']],
          x: '**主語が人で、se はその人自身。**「自分を〜する」＝((再帰))。',
          why: 'se は、もともと「自分を・自分に」。\nlevantar（起こす）に se が付くと、\n「自分を起こす」＝「起きる」になるの。\nse lava las manos は「自分に、手を洗う」。\nだれの手かは se でわかるから、\nsus manos ではなく las manos よ。' },
        { t: 'note', title: '再帰の代名詞は、人で変わる', rows: [
          ['(yo) [me] levanto', 'わたしは起きる'],
          ['(tú) [te] levantas', 'きみは起きる'],
          ['(él・ella) [se] levanta', '彼・彼女は起きる'],
          ['(nosotros) [nos] levantamos', 'わたしたちは起きる'],
          ['(vosotros) [os] levantáis', 'きみたちは起きる'],
          ['(ellos) [se] levantan', '彼らは起きる']],
          x: '**se は、3人称（彼・彼女・彼ら）の「自分」。**\nme・te・nos・os・se と、主語に合わせる。' },
        { t: 'tap', q: '主語が yo だとわかる、再帰の語は？', es: 'Me lavo las manos.', ja: '手を洗う（わたしが）。', a: ['me'],
          ng: '動詞の前の、小さな語。' },
        { t: 'who', q: 'この文で、洗うのはだれを？', es: 'Ana se lava.', ja: 'アナは体を洗う。', o: ['mismo', 'alguien', 'gente', 'por'], a: 0,
          r: [{ t: 'say', who: 'pepa', x: 'アナ自身を。主語が人で、se は本人ね。' }] }
      ] },
      { e: '💌', n: '食卓のメモ', steps: [
        { t: 'say', who: 'ana', es: 'Luis y yo nos escribimos notas.', x: 'ルイスとわたしは、メモを書きあうの。' },
        { t: 'ask', q: 'アナがルイスに書く。ルイスは？', o: ['アナに書く（おたがいに）', '自分あてに書く'], a: 0 },
        { t: 'ask', q: '主語は複数（ふたり）。se を「自分たちに」と考えると？', o: ['ふたりのあいだで、おたがいに', 'ふたりとも、ひとりごとを'], a: 0,
          r: [{ t: 'say', who: 'pepa', x: 'ふたりが「自分たちに」する＝自分たちのあいだで。\nそれが「おたがいに」になるのよ。' }] },
        { t: 'note', title: '相互の se（おたがいに）', rows: [
          ['Ana y Luis [se] quieren.', 'アナとルイスは愛しあっている。'],
          ['[Se] escriben cartas.', '彼らは手紙を書きあう。'],
          ['[Nos] vemos mañana.', 'わたしたちは明日会う。']],
          x: '**主語が複数の人で、「おたがいに」**＝((相互))。\nme・te は使えない（ひとりでは、おたがいにはならない）。',
          why: '主語が複数だと、se は「自分たちを」。\n自分たちのあいだで → おたがいに、となるの。' },
        { t: 'note', title: '再帰か相互かは、文脈で決まる', rows: [
          ['Ana y Luis [se] miran en el espejo.', 'ふたりは（それぞれ）鏡で自分を見る。'],
          ['Ana y Luis [se] miran y sonríen.', 'ふたりは見つめあって笑う。'],
          ['Se miran [el uno al otro].', 'おたがいに見る。']],
          x: 'はっきりさせたいときは **el uno al otro**（おたがいに）。' },
        { t: 'tap', q: '「おたがいに」とはっきりわかる語は？', es: 'Ana y Luis se miran el uno al otro.', ja: 'アナとルイスは、おたがいを見ている。', a: ['uno', 'otro', 'el', 'al'],
          ng: 'se のほかに、おたがいを表す言い方が付いている。',
          r: [{ t: 'say', who: 'pepa', x: 'そう。el uno al otro。\n主語が複数の y も手がかりよ。' }] },
        { t: 'who', q: 'この文の se は？', es: 'Ana y Luis se quieren.', ja: 'アナとルイスは愛しあっている。', o: ['mutuo', 'mismo', 'gente', 'alguien'], a: 0,
          ng: '主語が複数の人。' },
        { t: 'say', who: 'ana', x: 'このメモ、毎日おたがいに置いているの。' },
        { t: 'get', ev: 'notas' }
      ] },
      { e: '📮', n: '郵便受け', steps: [
        { t: 'say', who: 'leo', x: '手紙の控えが入っています。' },
        { t: 'say', who: 'leo', es: 'Me levanto a las seis y los oigo. Se gritan.', x: '「6 時に起きると、彼らの声が聞こえる。どなりあっている」' },
        { t: 'get', ev: 'carta' },
        { t: 'ask', q: 'この文の me は、手紙を書いた人の「何」を表す？', es: 'Me levanto a las seis.', o: ['書いた人自身（わたし）', 'ルイス'], a: 0,
          r: [{ t: 'say', who: 'pepa', x: '再帰の me ね。書いた人は 6 時に起きる人。' }] },
        { t: 'ask', q: '主語が人？ 物？ どちらの se？', es: 'Ana se lava.', o: ['再帰（主語は人で、se は本人）', '受身（主語は物）'], a: 0 },
        { t: 'ask', q: 'これはどの se？', es: 'Se busca a los dos actores.', o: ['無人称（主語がない）', '再帰（主語は人）'], a: 0,
          ng: 'a los dos actores は目的語。主語は書いていない。' },
        { t: 'who', q: 'この文で、やった人は？', es: 'Se venden pisos.', o: ['alguien', 'mismo', 'mutuo', 'gente'], a: 0,
          ng: '主語は pisos（物）。',
          r: [{ t: 'say', who: 'pepa', x: '物が主語の受身だから、やった人は「だれか」ね。' }] }
      ] }
    ] },

    /* ---------- 編集部（原稿） ---------- */
    { t: 'scene', place: 'redaccion', cast: ['leo', 'pepa', 'tito'] },
    { t: 'flow', upto: 5 },
    { t: 'say', who: 'pepa', x: '見分けの手順が5段になったわ。\nまず「主語は人か物か」を見るのよ。' },
    { t: 'say', who: 'tito', x: '先輩！ 夫婦の記事を書きました！' },
    { t: 'redpen', q: 'ティトの原稿に、まちがいが1つ。', es: 'Ana y Luis nos quieren.', bad: 'nos', o: ['se', 'me', 'te'], a: 0, fix: 'Ana y Luis se quieren.',
      ng: '主語は Ana y Luis（3人称）。nos は「わたしたち」。',
      r: [{ t: 'say', who: 'pepa', x: '主語が3人称なら se。\n人称と再帰の語は合わせるのよ。' }] },
    { t: 'say', who: 'leo', x: '次は広場のカフェだ。\nウゴさんの話を聞こう。' },

    /* ---------- カフェ（対決） ---------- */
    { t: 'scene', place: 'cafe', cast: ['leo', 'pepa', 'hugo'] },
    { t: 'say', who: 'hugo', es: 'Ana y Luis vienen cada domingo.', x: 'アナとルイスは、毎週日曜に来るよ。' },
    { t: 'say', who: 'hugo', es: 'Luis no oye bien. Ana habla fuerte.', x: 'ルイスは耳が遠い。だからアナは大声なんだ。' },
    { t: 'get', ev: 'cafe' },
    { t: 'scene', place: 'cafe', cast: ['leo', 'pepa'], duel: true },
    { t: 'enter', who: 'elena' },
    { t: 'say', who: 'elena', es: 'Yo vivo en el tercer piso.', x: 'わたしは 3 階に住んでいるの。' },
    { t: 'testimony', who: 'elena', title: 'となりの夫婦', hint: '食卓のメモを見てみて。', lines: [
      { es: 'Ana y Luis se odian.', ja: 'アナとルイスは、きらいあっている。', ok: ['notas'],
        press: [{ t: 'say', who: 'elena', es: 'Sí. Se gritan todas las noches.', x: 'そうよ。毎晩どなりあっているもの。' }, { t: 'say', who: 'pepa', x: '「おたがいに」と言い切れるのかしら…' }] },
      { es: 'Nunca se hablan bien.', ja: 'ふたりは、ちゃんと話したことがない。' },
      { es: 'No sé nada de esa carta.', ja: 'あの手紙のことは何も知らない。' }
    ], after: [
      { t: 'say', who: 'leo', x: 'メモには「Te quiero」とあります。\nふたりは毎日、メモを書きあっている！' },
      { t: 'ask', q: '「ふたりは、メモを書きあっている」は？', o: ['Se escriben notas.', 'Se escribe notas.', 'Me escribo notas.'], a: 0,
        ng: '主語は複数の人。「おたがいに」。',
        r: [{ t: 'say', who: 'leo', es: '¡Se escriben notas cada día!', x: 'ふたりは毎日、メモを書きあっているんです！' }] },
      { t: 'say', who: 'elena', es: 'Bueno... pero se gritan.', x: 'で、でも、どなってはいるのよ。' }
    ] },
    { t: 'testimony', who: 'elena', title: 'あの手紙', hint: '手紙の me が手がかりよ。ウゴさんの話も。', lines: [
      { es: 'Ana grita porque odia a Luis.', ja: 'アナがどなるのは、ルイスをきらいだからよ。',
        press: [{ t: 'say', who: 'elena', x: 'そ、そうに決まっているわ。' }] },
      { es: 'Yo me levanto a las nueve.', ja: 'わたしは 9 時に起きるわ。', ok: ['carta'],
        press: [{ t: 'say', who: 'elena', es: 'No oigo nada por la mañana.', x: '朝は何も聞こえないわよ。' }, { t: 'say', who: 'pepa', x: '手紙の「Me levanto a las seis」…\n書いた人は、3階の E. だったわね。' }] },
      { es: 'Yo no escribí esa carta.', ja: 'わたしはあの手紙を書いていない。' }
    ], after: [
      { t: 'say', who: 'leo', x: '手紙には「6 時に起きる」「3階の E.」。\nエレナさん、書いたのはあなたですね！' },
      { t: 'say', who: 'elena', es: 'Sí... Escribí yo la carta. Lo siento.', x: 'ええ…わたしが書いたの。ごめんなさい。' },
      { t: 'say', who: 'hugo', es: 'Ana grita porque Luis no oye bien.', x: 'アナが大声なのは、ルイスが聞こえにくいからだよ。' }
    ] },
    { t: 'interp', es: 'Ana y Luis se miran el uno al otro.', ja: 'アナとルイスは、それぞれ自分を見ている。',
      o: ['アナとルイスは、それぞれ自分を見ている。', 'アナとルイスは、おたがいを見ている。', 'アナとルイスは、鏡を見ている。'], a: 1,
      ng: 'el uno al otro は「おたがいに」。',
      after: [{ t: 'say', who: 'tito', x: 'el uno al otro だから\n「おたがい」…でした。' }] },
    { t: 'who', q: '最後に、記事の文を確かめよう。この se は？', es: 'Ana y Luis se quieren.', ja: 'アナとルイスは愛しあっている。', o: ['mutuo', 'mismo', 'gente', 'alguien'], a: 0 },
    { t: 'build', q: 'とどめの一言を組み立てよう：「ふたりは愛しあっています！」', es: 'Ana y Luis se quieren.', x: ['nos', 'odian', 'quiere'],
      r: [{ t: 'slam', txt: '¡Se quieren!' }] },
    { t: 'say', who: 'ana', es: 'Gracias. Luis y yo nos queremos mucho.', x: 'ありがとう。ルイスとわたしは、とても愛しあっているの。' },
    { t: 'scoop', txt: 'どなり声の夫婦、じつは愛しあっていた', es: 'Ana y Luis se quieren mucho.' },
    { t: 'say', who: 'pepa', x: 'おみごと。\n主語が人なら、再帰か相互。もうばっちりね。' }
  ]
});
