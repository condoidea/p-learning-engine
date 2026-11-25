/* =========================================================
 * ¡MANDA! — レッスン（台本）
 *
 *  生まれたての神さま（学ぶ人）が、フクロウのブーホに教わりながら、
 *  島の人たちに命令して世界を育てていく。命令が届くと、島の場面でその人が動く。
 *  レッスンの目次は表に出さない（ホームは島の景色。次の「神託」が自動で出てくる）。
 *
 *  日本語の文の書き方
 *    **…**   覚えること（マーカー）
 *    __…__   覚え方のヒント（💡波線）
 *    ((…))   この教材での呼び方・約束（グレー）
 *    `…`     スペイン語（中で下の色分けが使える）
 *    \n      改行（1つの吹き出しに1つのこと。手順は1行ずつ）
 *
 *  スペイン語の色分け（どの画面でも同じ色）
 *    {habla}   命令の形（金色）
 *    [Pepe]    呼びかける相手（水色）
 *    ^e^       変わった所（ピンク。語の中で使う：habl^e^）
 *
 *  ステップ
 *    say    { x, more, who }                  ブーホ（who があればその人）が話す。more があると「🤔 なんで？」で補足
 *    show   { tbl: [[左, 右], …], cap, es, ja } ボード（表・例文）を出す。次のボードが出るまで残る
 *    ask    { q, es, o, a, pred, r, why }      問い。pred:true は予想（採点しない）。a が正解の番号
 *    forge  { w, cut, add, o, out, ja, hint }  語の形を変える：w の最後の cut の文字を1つずつタップして消す
 *                                              → add があれば o（選択肢）から付ける文字を選ぶ → out の命令が完成
 *    cast   { who, need, o, a, out, ja, fx, why }  場面の命令：who の困りごと（need）を見て、正しい命令を選ぶ → 島で人が動く
 *    tapwho { es, ja, a, why }                  この命令はだれに言っている？ → 場面の人をタップ
 *    enter  { who }                             場面に人が来る
 *    tip    { id, ti, x, why }                  TIP カード（Tips ノートに入る）
 *    map    { hi: ['usted'], x }                命令の地図をボードに出す。hi の枝を光らせる。x はブーホの一言
 *    q      { id }                              問題バンクの1問
 *    drill  { n }                               このレッスンの問題から n 問
 *
 *  例文・説明はこのアプリのためのオリジナル。
 * ========================================================= */
window.MQ = window.MQ || {};

/* 島の人たち（場面に出る） */
MQ.people = {
  pepe:   { e: '👦', n: 'ペペ', d: '島でさいしょの子。くいしんぼう' },
  lola:   { e: '👧', n: 'ロラ', d: 'ペペのお姉ちゃん。しっかり者' },
  tomas:  { e: '👴', n: 'トマスじい', d: '物知りのおじいさん' },
  marina: { e: '🧜‍♀️', n: '女神マリーナ', d: 'となりの海の女神さま。目上のお客さま' },
  pueblo: { e: '👨‍👩‍👧‍👦', n: '村のみんな', d: '島の村人たち（仲間）' },
  viaje:  { e: '🧳', n: '旅の一行', d: '大陸から来たお客さんたち' },
  paco:   { e: '🧔', n: '商人パコ', d: 'マリーナさまの船で来た商人。はじめて会う人なので usted で話す' }
};

MQ.days = [
  { d: 1, ti: 'はじまりの島', x: 'tú に「〜しろ」・不規則な8つ ＋ ボス' },
  { d: 2, ti: '女神と港', x: 'usted・ustedes・vosotros（接続法の形）＋ ボス' },
  { d: 3, ti: '決戦の前夜', x: '「〜するな」・代名詞・〜しよう' },
  { d: 4, ti: '創世の日', x: 'ラスボス ＋ 🎓 西検チャレンジ' }
]

/* 命令の地図（ボードに出す全体図）。starts＝出発点、nodes＝枝。from は出発点か別の枝の id、L はその枝を教えるレッスン番号（no）。
   kind:'ex' は例外の枝。ex の {…} は命令の形（金色）。
   覚える形は2つだけ：命令の形（tú・vosotros の「〜しろ」）と、接続法の形（それ以外ぜんぶ）。
   接続法の形の下の枝は「どの相手の形を使うか」（使い分け）で、足し算の手順ではない。 */
MQ.map = {
  starts: [
    { id: 's-tu',  ti: 'tú の形', ex: 'hablas', sub: '君は〜する' },
    { id: 's-yo',  ti: 'yo の形', ex: 'hablo',  sub: '私は〜する' },
    { id: 's-inf', ti: '原形',    ex: 'hablar', sub: '辞書の形' }
  ],
  nodes: [
    { id: 'tu',       from: 's-tu',  L: 1,  who: 'tú に「〜しろ」',            op: 's を取る', ex: '{habla}', ja: '話せ' },
    { id: 'tu4a',     from: 'tu',    L: 2,  kind: 'ex', ti: '例外：原形の最後の2文字を取る4つ', ex: '{ven}・{ten}・{pon}・{sal}' },
    { id: 'tu4b',     from: 'tu',    L: 2,  kind: 'ex', ti: '例外：覚える4つ', ex: '{haz}・{di}・{ve}・{sé}' },
    { id: 'sub',      from: 's-yo',  L: 3,  who: '接続法の形',                op: 'o を反対の母音に（-ar は e／-er・-ir は a）', ex: '{hable}・{coma}' },
    { id: 'usted',    from: 'sub',   L: 3,  who: 'usted に「〜してください」', op: 'usted の形', ex: '{hable}', ja: '話してください' },
    { id: 'oy4',      from: 'sub',   L: 4,  kind: 'ex', ti: '例外：yo の形が -oy の4つ', ex: '{vaya}・{sea}・{esté}・{dé}' },
    { id: 'ustedes',  from: 'sub',   L: 4,  who: 'ustedes に「〜してください」', op: 'ustedes の形', ex: '{hablen}' },
    { id: 'no-tu',    from: 'sub',   L: 5, who: 'tú に「〜するな」',          op: 'no ＋ tú の形', ex: 'no {hables}' },
    { id: 'no-usted', from: 'sub',   L: 5, who: 'usted に「〜しないで」',      op: 'no ＋ usted の形', ex: 'no {hable}' },
    { id: 'spell',    from: 'sub',   L: 5, kind: 'ex', ti: 'e の前のつづりの書きかえ', ex: '{busque}・{llegue}・{empiece}' },
    { id: 'nos',      from: 'sub',   L: 7, who: 'nosotros「〜しよう」',        op: 'nosotros の形', ex: '{hablemos}' },
    { id: 'no-vos',   from: 'sub',   L: 7, who: 'vosotros に「〜するな」',     op: 'no ＋ vosotros の形', ex: 'no {habléis}' },
    { id: 'vos',      from: 's-inf', L: 4,  who: 'vosotros に「〜しろ」',       op: 'r を d に', ex: '{hablad}' }
  ]
};

/* 教え方（docs/apps/manda.md「動詞の形の教え方」）
 *  覚える形は2つ：① 命令の形（tú・vosotros の「〜しろ」だけ）② 接続法の形（それ以外ぜんぶ）。
 *  作り方は1回だけ短く見せて、あとは問題でくり返す。「なぜ」の長い話はしない。
 *  レッスンの中心は「この相手・この場面なら、どの形か」の使い分け。 */
MQ.lessons = [
  /* ================= DAY 1 ================= */
  {
    id: 'L1', no: 1, day: 1, icon: '☀️', ti: '神の第一声', sub: 'tú に「〜しろ」（s を取る）',
    ev: { who: 'pepe', line: '神さま…？ ここ、なんにもないよ…' },
    actors: ['pepe'],
    steps: [
      { t: 'say', x: 'やっと目を覚ましたね、神さま！\nボクはフクロウのブーホ。\n神さまのお世話係だよ🦉' },
      { t: 'say', who: 'pepe', x: '……神さま？ ぼく、ペペ。\nこの島、なんにもないんだ。\nなにをしたらいいの？' },
      { t: 'say', x: '神さまの仕事は、命令すること。\nまずは、仲よしの相手 `tú`（君）への命令。', more: 'スペイン語の「あなた」は2つある。仲よしの相手に使う tú と、ていねいに話す相手に使う usted。usted は、島にお客さまが来たら使うよ。' },
      { t: 'show', cap: 'hablar（話す）の今の形', tbl: [['yo（私は）', 'hablo'], ['tú（君は）', 'hablas'], ['él・ella（彼・彼女は）', 'habla']] },
      { t: 'ask', pred: true, q: '「君は話す」は `hablas`。\n「（君が）話せ！」の命令は、どれだと思う？', o: ['hablo', 'hablas', 'habla'], a: 2, r: '正解は `{habla}`！\n`hablas` から **s を取る**と、命令になる。' },
      { t: 'forge', w: 'hablas', cut: 's', out: '{habla}', ja: '話せ！', hint: '命令にするために、消す文字をタップ！' },
      { t: 'cast', who: 'pepe', need: 'おなかがすいて、もう動けない…\n（足もとに魚がある）', o: ['¡Come!', '¡Comes!', '¡Como!'], a: 0, out: '¡[Pepe], {come}!', ja: 'ペペ、食べろ！', fx: { e: '🐟', mood: '😋' }, why: '`comes`（君は食べる）から s を取って `{come}`。-er・-ir の動詞も同じ。' },
      { t: 'say', x: '名前で呼ぶときは、**コンマ**で区切る。\n`[Pepe], {come}.`\n¡ ! は「強く言う」印だよ。' },
      { t: 'cast', who: 'pepe', need: 'まぶしくて、目をつぶったまま。\n空にはじめての太陽がのぼったのに…', o: ['Abre los ojos.', 'Abres los ojos.', 'Abro los ojos.'], a: 0, out: '[Pepe], {abre} los ojos.', ja: 'ペペ、目を開けなさい。', fx: { e: '☀️', mood: '🤩', world: 'sun' }, why: '`abres`（君は開ける）から s を取って `{abre}`。los ojos は「両目」。' },
      { t: 'map', hi: ['tu'], x: '地図に書きこもう。出発は tú の形。' },
      { t: 'tip', id: 't-tu-s', ti: 'tú に「〜しろ」＝ tú の形から s を取る', x: '`hablas` → `{habla}`\n`comes` → `{come}`\n`abres` → `{abre}`' },
      { t: 'enter', who: 'lola' },
      { t: 'say', who: 'lola', x: 'はじめまして、神さま！\nわたしはロラ。ペペのお姉ちゃんだよ。' },
      { t: 'show', cap: 'dormir（寝る）の今の形', tbl: [['yo', 'd^ue^rmo'], ['tú', 'd^ue^rmes'], ['nosotros（私たち）', 'dormimos']] },
      { t: 'ask', pred: true, q: '「君は寝る」は `duermes`。\n「寝ろ」の命令は？', o: ['dorme', 'duerme', 'duermes'], a: 1, r: '`{duerme}`！\n`duermes` から s を取るだけ。\nue は、そのまま残るよ。' },
      { t: 'cast', who: 'pepe', need: 'ねむい…\nでも、まっくらでこわくて眠れない…', o: ['Duerme, Pepe.', 'Dorme, Pepe.', 'Duermes, Pepe.'], a: 0, out: '{Duerme}, [Pepe].', ja: '寝なさい、ペペ。', fx: { e: '😴', mood: '💤', world: 'moon' }, why: '`duermes` から s を取って `{duerme}`。名前は命令のあとに置いてもいい（コンマで区切る）。' },
      { t: 'say', x: '命令がきつく聞こえるときは、\n`por favor`（お願い）をつけよう。' },
      { t: 'cast', who: 'lola', need: '外は風がつよい！\n小屋の中が寒いよ〜', o: ['Cierra la puerta, por favor.', 'Cierras la puerta, por favor.', 'Cerra la puerta, por favor.'], a: 0, out: '[Lola], {cierra} la puerta, por favor.', ja: 'ロラ、ドアを閉めて、お願い。', fx: { e: '🚪', mood: '😌' }, why: '`cierras`（君は閉める）から s を取って `{cierra}`。ie は残す。' },
      { t: 'cast', who: 'lola', need: 'ペペがひとりで、さびしそう…\nいっしょに遊んであげたら？', o: ['Juega con Pepe.', 'Jugas con Pepe.', 'Juegas con Pepe.'], a: 0, out: '{Juega} con Pepe, [Lola].', ja: 'ペペと遊んであげて、ロラ。', fx: { e: '⚽', mood: '😆' }, why: '`juegas`（君は遊ぶ）から s を取って `{juega}`。ue は残る。' },
      { t: 'tip', id: 't-stem', ti: 'つづりが変わる動詞も、s を取るだけ', x: '`duermes` → `{duerme}`\n`cierras` → `{cierra}`\n`juegas` → `{juega}`\nie・ue は残る' },
      { t: 'drill', n: 10 }
    ]
  },
  {
    id: 'L2', no: 2, day: 1, icon: '🔥', ti: '火と家', sub: '不規則な8つ（ven・ten・pon・sal・haz・di・ve・sé）',
    ev: { who: 'pepe', line: '神さま、寒いよ。あったかいものがほしい…' },
    actors: ['pepe', 'lola'],
    steps: [
      { t: 'ask', pred: true, q: '`venir`（来る）。「君は来る」は `vienes`。\n「来い！」はどうなると思う？', o: ['viene', 'ven', 'vienes'], a: 1, r: '正解は `{ven}`！\ns を取る形にはならない。\nこういう動詞が、全部で8つある。' },
      { t: 'show', cap: 'まず4つ（原形の最後の2文字を取った形）', tbl: [['venir（来る）', '{ven}'], ['tener（持つ）', '{ten}'], ['poner（置く）', '{pon}'], ['salir（出る）', '{sal}']] },
      { t: 'map', hi: ['tu4a'], x: '地図に書きこもう。tú の枝の例外。' },
      { t: 'cast', who: 'pepe', need: '神さまのそばに行きたい。\nでも、行っていいのかな…', o: ['Ven aquí, Pepe.', 'Viene aquí, Pepe.', 'Vienes aquí, Pepe.'], a: 0, out: '{Ven} aquí, [Pepe].', ja: 'ここに来なさい、ペペ。', fx: { e: '🏃', mood: '😊' }, why: '`venir` の命令は `{ven}`。`viene` は「彼は来る」。' },
      { t: 'cast', who: 'lola', need: 'わあ、神さまの火だ！\nさわってみたい！', o: ['Ten cuidado, Lola.', 'Tienes cuidado, Lola.', 'Tene cuidado, Lola.'], a: 0, out: '{Ten} cuidado, [Lola].', ja: '気をつけて、ロラ。', fx: { e: '🔥', mood: '😮', world: 'fire' }, why: '`tener` の命令は `{ten}`。`Ten cuidado.`（気をつけて）は、まるごと覚えておくと便利。' },
      { t: 'cast', who: 'pepe', need: '火で焼いたパン、どこに置こう？\n（そばにテーブルがある）', o: ['Pon el pan en la mesa.', 'Pone el pan en la mesa.', 'Poner el pan en la mesa.'], a: 0, out: '{Pon} el pan en la mesa.', ja: 'パンをテーブルに置きなさい。', fx: { e: '🍞', mood: '😋' }, why: '`poner` の命令は `{pon}`。`pone` は「彼は置く」。' },
      { t: 'cast', who: 'lola', need: 'ゴホゴホ！\n小屋の中がけむりでいっぱい！', o: ['Sal de la casa.', 'Sale de la casa.', 'Sales de la casa.'], a: 0, out: '¡{Sal} de la casa!', ja: '家から出なさい！', fx: { e: '💨', mood: '😮‍💨' }, why: '`salir` の命令は `{sal}`。`sale` は「彼は出る」。' },
      { t: 'tip', id: 't-4short', ti: '原形の最後の2文字を取る4つ', x: '`venir` → `{ven}`\n`tener` → `{ten}`\n`poner` → `{pon}`\n`salir` → `{sal}`\n__ベン・テン・ポン・サル__ と、リズムで覚えよう' },
      { t: 'enter', who: 'tomas' },
      { t: 'say', who: 'tomas', x: 'わしはトマスじい。\n物知りじゃが、家がなくての…' },
      { t: 'show', cap: '残りの4つ（そのまま覚える）', tbl: [['hacer（する・作る）', '{haz}'], ['decir（言う）', '{di}'], ['ir（行く）', '{ve}'], ['ser（〜である）', '{sé}']] },
      { t: 'cast', who: 'pepe', need: 'トマスじいの家を作りたい！\n神さま、命令して！', o: ['Haz una casa.', 'Hace una casa.', 'Haces una casa.'], a: 0, out: '[Pepe], {haz} una casa para Tomás.', ja: 'ペペ、トマスに家を作りなさい。', fx: { e: '🏠', mood: '💪', world: 'house' }, why: '`hacer` の命令は `{haz}`。`hace` は「彼は作る」。para は「〜のために」。' },
      { t: 'cast', who: 'pepe', need: 'あれ？ テーブルのパンがない。\nペペの口のまわりに、パンくずが…', o: ['Pepe, di la verdad.', 'Pepe, dice la verdad.', 'Pepe, dices la verdad.'], a: 0, out: '[Pepe], {di} la verdad.', ja: 'ペペ、本当のことを言いなさい。', fx: { e: '😅', mood: '🙇' }, why: '`decir` の命令は `{di}`。la verdad は「本当のこと」。' },
      { t: 'cast', who: 'lola', need: '浜に、なにか流れついてる！\nだれか見てきて！', o: ['Ve a la playa, Lola.', 'Va a la playa, Lola.', 'Vas a la playa, Lola.'], a: 0, out: '{Ve} a la playa, [Lola].', ja: '浜へ行きなさい、ロラ。', fx: { e: '🐚', mood: '🤩', world: 'shell' }, why: '`ir` の命令は `{ve}`。`va` は「彼は行く」。ver（見る）の ve と同じつづりなので、行き先の a などで見分ける。' },
      { t: 'cast', who: 'pepe', need: 'ペペが、ロラの貝がらを取ろうとしてる…', o: ['Sé bueno, Pepe.', 'Es bueno, Pepe.', 'Eres bueno, Pepe.'], a: 0, out: '{Sé} bueno, [Pepe].', ja: 'いい子でいなさい、ペペ。', fx: { e: '😇', mood: '🙏' }, why: '`ser` の命令は `{sé}`（´ がつく）。`eres` は「君は〜だ」。' },
      { t: 'map', hi: ['tu4b'], x: '地図に書きこもう。これで tú の例外はぜんぶ。' },
      { t: 'tip', id: 't-8', ti: '不規則な命令8つ', x: '`{ven}`・`{ten}`・`{pon}`・`{sal}`\n`{haz}`（hacer）・`{di}`（decir）・`{ve}`（ir）・`{sé}`（ser）\n__ベン・テン・ポン・サル・アス・ディ・ベ・セ__\nほかは「s を取る」でできる' },
      { t: 'drill', n: 12 }
    ]
  },
  /* ================= DAY 2 ================= */
  {
    id: 'L3', no: 3, day: 2, icon: '🧜‍♀️', ti: '海の女神', sub: 'usted に「〜してください」（接続法の形）',
    ev: { who: 'marina', line: 'ごきげんよう。あなたが、新しい神さま？' },
    actors: ['lola', 'marina'],
    steps: [
      { t: 'say', who: 'marina', x: 'はじめまして、若い神さま。\nとなりの海から、この島を見に来ましたの。' },
      { t: 'say', x: '目上のお客さまには、ていねいな「あなた」\n＝ `usted` で話す。\nusted への命令は、形がちがうよ。' },
      { t: 'show', cap: '左は yo の形、右は usted への命令', tbl: [['hablar：yo habl^o^', '{habl^e^}'], ['comer：yo com^o^', '{com^a^}'], ['abrir：yo abr^o^', '{abr^a^}']] },
      { t: 'say', x: 'yo の形の最後の o が、\n-ar なら e、-er・-ir なら a になった。\n__いつもと反対の母音__ だね。\nこれを **接続法の形** という。' },
      { t: 'forge', w: 'hablo', cut: 'o', add: 'e', o: ['e', 'a', 'o'], out: '{hable}', ja: '話してください', hint: 'yo の形 `hablo` から。まず、取る文字をタップ！' },
      { t: 'cast', who: 'marina', need: '（マリーナさまが、小屋の入り口で待っている）', o: ['Pase, por favor.', 'Pasa, por favor.', 'Pasas, por favor.'], a: 0, out: '{Pase}, por favor.', ja: 'どうぞ、お入りください。', fx: { e: '🛖', mood: '😊' }, why: '`pasa` は tú への命令。女神さまには接続法の `{pase}`（paso の o → e）。' },
      { t: 'cast', who: 'marina', need: 'ロラが焼いたパンを出したよ。\nマリーナさまに、すすめよう', o: ['Coma, por favor.', 'Come, por favor.', 'Comes, por favor.'], a: 0, out: '{Coma}, por favor.', ja: 'どうぞ、召し上がってください。', fx: { e: '🍞', mood: '😋' }, why: '`come` は tú への命令。usted には接続法の `{coma}`（como の o → a）。' },
      { t: 'map', hi: ['sub', 'usted'], x: '地図に書きこもう。出発は yo の形。' },
      { t: 'tip', id: 't-usted', ti: 'usted に「〜してください」＝ 接続法の形', x: 'yo の形の o を、反対の母音に\n-ar → e：`hablo` → `{hable}`\n-er・-ir → a：`como` → `{coma}`　`abro` → `{abra}`', why: '接続法は西検4級の範囲。このあと出てくる「〜するな」「〜しよう」も、同じ接続法の形を使う。' },
      { t: 'ask', pred: true, q: '`venir` の yo の形は `vengo`（私は来る）。\nusted への命令は？', o: ['venga', 'vienga', 'ven'], a: 0, r: '`{venga}`！\n`vengo` の o を a にするだけ。\nyo の形の g は、そのまま残る。' },
      { t: 'show', cap: 'yo の形が -go の動詞', tbl: [['tener：ten^go^', '{teng^a^}'], ['poner：pon^go^', '{pong^a^}'], ['salir：sal^go^', '{salg^a^}'], ['hacer：ha^go^', '{hag^a^}'], ['decir：di^go^', '{dig^a^}']] },
      { t: 'cast', who: 'marina', need: '島の奥を見たいわ。\n案内してくださる？', o: ['Venga conmigo.', 'Ven conmigo.', 'Viene conmigo.'], a: 0, out: '{Venga} conmigo.', ja: 'わたしといっしょに来てください。', fx: { e: '🌴', mood: '😊', world: 'palm' }, why: '`ven` は tú への命令。usted には `{venga}`。conmigo は「わたしといっしょに」。' },
      { t: 'cast', who: 'marina', need: 'おみやげに、島の花をわたそう🌺', o: ['Tenga, es para usted.', 'Ten, es para usted.', 'Tiene, es para usted.'], a: 0, out: '{Tenga}, es para usted.', ja: 'どうぞ、あなたへのおくりものです。', fx: { e: '🌺', mood: '🥰', world: 'flower' }, why: '`tengo` → `{tenga}`。物をわたすときの「どうぞ」は、決まった言い方。' },
      { t: 'cast', who: 'marina', need: 'そろそろ帰りますわ。\nまた来てもいいかしら？', o: ['Vuelva pronto.', 'Vuelve pronto.', 'Volva pronto.'], a: 0, out: '{Vuelva} pronto.', ja: 'また近いうちに来てください。', fx: { e: '⛵', mood: '👋' }, why: '`volver`（帰る）の yo の形は vuelvo → `{vuelva}`。ue も残る。`vuelve` は tú への命令。' },
      { t: 'tip', id: 't-yo', ti: 'yo の形が特別でも、作り方は同じ', x: '`tengo` → `{tenga}`　`hago` → `{haga}`\n`vuelvo` → `{vuelva}`\nyo の形の g・ue は残る' },
      { t: 'enter', who: 'paco' },
      { t: 'say', who: 'paco', x: 'いらっしゃい！ 商人のパコだよ。\n島に足りないものは、何でもそろえるよ。' },
      { t: 'say', x: 'はじめて会う人だから、`usted` で話そう。\nyo の形にクセがあっても、作り方は同じ。' },
      { t: 'show', cap: 'yo の形にクセがある動詞', tbl: [['oír（聞く）：yo oi^go^', '{oig^a^}'], ['traer（持ってくる）：yo trai^go^', '{traig^a^}'], ['conocer（知る）：yo cono^zc^o', '{conozc^a^}'], ['pedir（頼む）：yo p^i^do', '{pid^a^}']] },
      { t: 'cast', who: 'paco', need: '市場がにぎやかで、\nパコさんがこっちに気づいてくれない。\n呼びかけよう', o: ['¡Oiga, por favor!', '¡Oye, por favor!', '¡Oigo, por favor!'], a: 0, out: '¡{Oiga}, por favor!', ja: 'すみません！（聞いてください）', fx: { e: '👂', mood: '😮' }, why: '`oye` は tú への呼びかけ。はじめて会う人には `{oiga}`。「すみません！」の決まった言い方。' },
      { t: 'cast', who: 'paco', need: '島では、お米がとれない。\nパコさんに持ってきてもらおう', o: ['Traiga arroz, por favor.', 'Trae arroz, por favor.', 'Traya arroz, por favor.'], a: 0, out: '{Traiga} arroz, por favor.', ja: 'お米を持ってきてください。', fx: { e: '🍚', mood: '👍', world: 'market' }, why: '`traigo` → `{traiga}`。`trae` は tú への命令。' },
      { t: 'ask', q: 'パコさんの話が速くて、聞き取れなかった。\n「もう一度言ってください」は？\n（repetir の yo の形は `repito`）', o: ['Repita, por favor.', 'Repite, por favor.', 'Repeta, por favor.'], a: 0, why: '`repito` → `{repita}`。i は残る。教室でもよく使う決まった言い方。' },
      { t: 'cast', who: 'paco', need: 'パコさんは、島のことをまだよく知らない。\n「島を知ってください（見て回ってください）」と言おう', o: ['Conozca la isla.', 'Conoce la isla.', 'Conoza la isla.'], a: 0, out: '{Conozca} la isla, por favor.', ja: 'どうぞ島を見て回ってください。', fx: { e: '🏝️', mood: '🤩' }, why: '`conozco` → `{conozca}`。zc が残る。' },
      { t: 'tip', id: 't-yo2', ti: 'yo の形がクセものでも、ルールは同じ', x: '`oigo` → `{oiga}`　`traigo` → `{traiga}`\n`conozco` → `{conozca}`　`veo` → `{vea}`\n`pido` → `{pida}`　`repito` → `{repita}`' },
      { t: 'drill', n: 12 }
    ]
  },
  {
    id: 'L4', no: 4, day: 2, icon: '⚓', ti: '港の祭り', sub: '-oy の4つ・ustedes・vosotros・だれに言う？',
    ev: { who: 'viaje', line: 'こんにちは！ 大陸から船で来ました！' },
    actors: ['viaje', 'marina'],
    steps: [
      { t: 'say', x: '港に、大陸から旅の一行が来た！\nみんな、はじめて会うお客さまだよ。' },
      { t: 'show', cap: 'yo の形が -oy の4つ（そのまま覚える）', tbl: [['ir（行く）：yo v^oy^', '{vaya}'], ['ser（〜である）：yo s^oy^', '{sea}'], ['estar（いる）：yo est^oy^', '{esté}'], ['dar（あげる）：yo d^oy^', '{dé}']] },
      { t: 'cast', who: 'viaje', need: '旅の一行のひとりに\n「浜はどっちですか？」と聞かれた', o: ['Vaya por esta calle.', 'Ve por esta calle.', 'Va por esta calle.'], a: 0, out: '{Vaya} por esta calle.', ja: 'この道を行ってください。', fx: { e: '🛣️', mood: '👉' }, why: '`ve` は tú への命令。お客さまには `{vaya}`。' },
      { t: 'map', hi: ['oy4'], x: '地図に書きこもう。接続法の例外。' },
      { t: 'show', cap: '1人なら usted、何人もなら ustedes', tbl: [['hablar', '{hable} ／ {hable^n^}'], ['comer', '{coma} ／ {coma^n^}'], ['ir', '{vaya} ／ {vaya^n^}']] },
      { t: 'say', x: '何人ものお客さま（`ustedes`）には、\n接続法の **ustedes の形**。\nいつもの「彼ら」と同じ n がつく。' },
      { t: 'map', hi: ['ustedes'], x: '地図に書きこもう。' },
      { t: 'cast', who: 'viaje', need: '（旅の一行が、港で荷物を持って立っている）', o: ['Pasen, por favor.', 'Pase, por favor.', 'Pasan, por favor.'], a: 0, out: '{Pasen}, por favor.', ja: 'みなさん、どうぞお入りください。', fx: { e: '🏘️', mood: '😊', world: 'port' }, why: '何人もいるので `{pasen}`。`pasan` は「彼らは通る」で、命令ではない。' },
      { t: 'cast', who: 'viaje', need: '長い船旅で、みんなおなかがぺこぺこ', o: ['Coman, por favor.', 'Comen, por favor.', 'Coma, por favor.'], a: 0, out: '{Coman}, por favor.', ja: 'みなさん、どうぞ召し上がってください。', fx: { e: '🍲', mood: '😋' }, why: '何人もなので `{coman}`。`comen` は「彼らは食べる」。' },
      { t: 'cast', who: 'viaje', need: '「島の神さまの家を見たい」と言っている', o: ['Vengan conmigo.', 'Vienen conmigo.', 'Venga conmigo.'], a: 0, out: '{Vengan} conmigo.', ja: 'みなさん、いっしょに来てください。', fx: { e: '⛩️', mood: '🤩' }, why: '何人もなので `{vengan}`。`vienen` は「彼らは来る」。' },
      { t: 'tip', id: 't-ustedes', ti: '-oy の4つ ／ ustedes の形', x: '`{vaya}`（ir）・`{sea}`（ser）・`{esté}`（estar）・`{dé}`（dar）\nustedes：`{hablen}`・`{coman}`・`{vayan}`' },
      { t: 'enter', who: 'pueblo' },
      { t: 'enter', who: 'pepe' },
      { t: 'say', x: '今夜は島のお祭り！\n仲よしの何人もの相手（村のみんな）は\n`vosotros`（君たち）。', more: 'vosotros を使うのはスペインだけ。中南米では、仲よしの何人もの相手にも ustedes を使う。西検は両方出るので、どちらも分かるようにしておこう。' },
      { t: 'show', cap: 'vosotros に「〜しろ」', tbl: [['hablar', '{habla^d^}'], ['comer', '{come^d^}'], ['abrir', '{abri^d^}']] },
      { t: 'ask', pred: true, q: '左が原形、右が vosotros への命令。\nどう変わった？', o: ['最後の r が d になった', '最後に d がついた', '最後に n がついた'], a: 0, r: 'そのとおり！\n**原形の r を d に**するだけ。' },
      { t: 'map', hi: ['vos'], x: '地図に書きこもう。出発は原形。' },
      { t: 'cast', who: 'pueblo', need: '音楽が始まった！\nみんなもじもじして、踊りださない', o: ['¡Bailad!', '¡Bailan!', '¡Baila!'], a: 0, out: '¡{Bailad}, amigos!', ja: 'みんな、踊れ！', fx: { e: '💃', mood: '🎶', world: 'party' }, why: '何人もの仲間（vosotros）には `{bailad}`。`baila` は1人の tú へ。' },
      { t: 'show', cap: 'だれに言う？（hablar）', tbl: [['1人・仲よし（tú）', '{habla}'], ['1人・ていねい（usted）', '{hable}'], ['何人も・仲よし（vosotros）', '{hablad}'], ['何人も・ていねい（ustedes）', '{hablen}']] },
      { t: 'tapwho', es: '{Venga} a bailar, por favor.', ja: 'どうぞ、踊りに来てください。', a: 'marina', why: '`venga` は usted（1人・ていねい）への命令。だからマリーナさま。' },
      { t: 'tapwho', es: '¡{Comed} mucho!', ja: 'たくさん食べろ！', a: 'pueblo', why: '`comed` は vosotros（何人も・仲よし）への命令。だから村のみんな。' },
      { t: 'tapwho', es: '{Pasen} y {coman}, por favor.', ja: 'どうぞ入って、召し上がってください。', a: 'viaje', why: '`pasen`・`coman` は ustedes（何人も・ていねい）への命令。だから旅の一行。' },
      { t: 'tapwho', es: '[Pepe], {canta} una canción.', ja: 'ペペ、歌を1曲歌って。', a: 'pepe', why: '`canta` は tú（1人・仲よし）への命令。名前も呼んでいるね。' },
      { t: 'tip', id: 't-4people', ti: '命令の相手は4つ', x: '1人・仲よし `{habla}`（tú の形 − s）\n1人・ていねい `{hable}`（接続法）\n何人も・仲よし `{hablad}`（原形の r → d）\n何人も・ていねい `{hablen}`（接続法）' },
      { t: 'drill', n: 12 }
    ]
  },
  /* ================= DAY 3 ================= */
  {
    id: 'L5', no: 5, day: 3, icon: '🛡️', ti: '闇が来る', sub: '「〜するな」＝ no ＋ 接続法（つづりの書きかえも）',
    ev: { who: 'tomas', line: 'た、たいへんじゃ！ 空のむこうが真っ黒じゃ！' },
    actors: ['pepe', 'lola', 'tomas'],
    steps: [
      { t: 'say', who: 'tomas', x: '神さま！ 海のむこうから、\nまっ黒な雲がせまっておる！\n闇の魔神カオスじゃ…！' },
      { t: 'show', cap: '「〜するな」（hablar）', tbl: [['tú に', 'no {hables}'], ['usted に', 'no {hable}'], ['ustedes に', 'no {hablen}']] },
      { t: 'say', x: '右はぜんぶ、接続法の形。\n**「〜するな」は no ＋ 接続法**。\ntú には、tú の形 `hables`（いつもの s）。' },
      { t: 'cast', who: 'pepe', need: '外がどうなってるか、見に行ってくる！', o: ['¡No salgas, Pepe!', '¡No sal, Pepe!', '¡No sales, Pepe!'], a: 0, out: '¡No {salgas}, [Pepe]!', ja: '出ちゃだめだ、ペペ！', fx: { e: '🛑', mood: '😳' }, why: '`sal` は「出ろ」。「出るな」は接続法の tú の形で `no {salgas}`。`no sales` は「君は出ない」という文。' },
      { t: 'cast', who: 'lola', need: 'こわいよ…\nロラが、ふるえている', o: ['No tengas miedo, Lola.', 'No ten miedo, Lola.', 'No tienes miedo, Lola.'], a: 0, out: 'No {tengas} miedo, [Lola].', ja: 'こわがらないで、ロラ。', fx: { e: '🫂', mood: '🥲', world: 'shield' }, why: '`tener miedo` は「こわがる」。「〜するな」は `no {tengas}`。`no tienes miedo` は「君はこわがっていない」という文。' },
      { t: 'say', x: '「それを」の lo などは、\n「〜するな」では動詞の**前**に置く。\n`No lo {comas}.`（それを食べるな）' },
      { t: 'cast', who: 'pepe', need: '黒い雲から、あやしい黒いリンゴが降ってきた！\nペペが拾ってる…', o: ['¡No la comas!', '¡No cómela!', '¡No comas la!'], a: 0, out: '¡No la {comas}, [Pepe]!', ja: 'それを食べちゃだめだ、ペペ！', fx: { e: '🍏', mood: '😱' }, why: '「〜するな」では、la は動詞の前。くっつけるのは「〜しろ」のときだけ。' },
      { t: 'map', hi: ['no-tu', 'no-usted'], x: '地図に書きこもう。「〜するな」は接続法から。' },
      { t: 'tip', id: 't-neg', ti: '「〜するな」＝ no ＋ 接続法', x: 'tú へ：no `{hables}`・no `{tengas}`\nusted へ：no `{hable}`・no `{tenga}`\nlo・me などは動詞の前（no lo `{comas}`）' },
      { t: 'enter', who: 'marina' },
      { t: 'show', cap: 'スペイン語の読み方のきまり', tbl: [['ca・co・cu', 'カ・コ・ク'], ['ce・ci', 'セ・シ（「ケ・キ」は que・qui）'], ['ga・go・gu', 'ガ・ゴ・グ'], ['ge・gi', 'ヘ・ヒ（「ゲ・ギ」は gue・gui）']] },
      { t: 'ask', pred: true, q: '`llegar`（着く）の yo の形は `llego`。\no を e にすると `llege` で「リェヘ」と読める。\n「リェゲ」の音のまま書くには？', o: ['llegue', 'llege', 'llega'], a: 0, r: '`{llegue}`！\n音を守るために u を入れる。\n書き方を合わせるだけだよ。' },
      { t: 'cast', who: 'pepe', need: '「晩ごはんまでに帰ればいいよね」とペペ。\nでも、闇の夜は危ない…', o: ['No llegues tarde, Pepe.', 'No llegas tarde, Pepe.', 'No lleges tarde, Pepe.'], a: 0, out: 'No {llegues} tarde, [Pepe].', ja: '遅くならないでね、ペペ。', fx: { e: '⏰', mood: '🙆' }, why: '「〜するな」は接続法の tú の形 `no {llegues}`。`no llegas tarde` は「君は遅れない」という文。' },
      { t: 'cast', who: 'lola', need: '闇の雲から落ちてきた、黒い石。\nロラがさわろうとしている！', o: ['¡No lo toques, Lola!', '¡No lo tocas, Lola!', '¡No lo toces, Lola!'], a: 0, out: '¡No lo {toques}, [Lola]!', ja: 'それにさわらないで、ロラ！', fx: { e: '🪨', mood: '😳' }, why: 'tocar は c を qu に書きかえて `no {toques}`。lo は「〜するな」なので動詞の前。' },
      { t: 'cast', who: 'marina', need: 'マリーナさまに、作戦会議を\n始めてもらいたい', o: ['Empiece, por favor.', 'Empieza, por favor.', 'Empieze, por favor.'], a: 0, out: '{Empiece}, por favor.', ja: 'どうぞ、始めてください。', fx: { e: '🗺️', mood: '😊' }, why: 'empezar は、e の前の z を c に書きかえて `{empiece}`（ze とは書かないきまり）。`empieza` は tú への命令。' },
      { t: 'map', hi: ['spell'], x: '地図に書きこもう。接続法のつづりの書きかえ。' },
      { t: 'tip', id: 't-spell', ti: 'e の前で、つづりを書きかえる3つ', x: '-car：c → qu（`{busque}`・no `{toques}`）\n-gar：g → gu（`{llegue}`・no `{llegues}`・`{pague}`）\n-zar：z → c（`{empiece}`）\n音は変えずに、書き方だけ合わせる' },
      { t: 'drill', n: 12 }
    ]
  },
  {
    id: 'L6', no: 6, day: 3, icon: '🍷', ti: '神々の宴', sub: '代名詞（「〜しろ」は後ろ・「〜するな」は前・2つのとき）',
    ev: { who: 'marina', line: 'わたしたちも、いっしょに戦いますわ' },
    actors: ['pepe', 'lola', 'marina'],
    steps: [
      { t: 'show', cap: '「それを・私に」の言葉', tbl: [['lo（それを・男性の物）', 'la（それを・女性の物）'], ['me（私に・私を）', 'te（君に・君を）']] },
      { t: 'say', x: 'ふつうの文では、動詞の**前**に置く。\n`Lo como.`（私はそれを食べる）' },
      { t: 'ask', pred: true, q: 'では命令では？\n「それを食べろ」はどっちだと思う？', o: ['Lo come.', 'Cómelo.'], a: 1, r: '正解は `{Cómelo}`！\n「〜しろ」では、動詞の**後ろ**に\nくっつけて1語にする。\n強く読む「コ」に ´ がつくよ。', more: '`Lo come.` は「彼はそれを食べる」の文になる。´ は、くっつけて長くなっても、もとの命令と同じ所を強く読むための印。' },
      { t: 'cast', who: 'pepe', need: '朝ごはんのくだもの、\n食べていいのかな…？', o: ['Cómela.', 'La come.', 'Comela.'], a: 0, out: '{Cómela}, [Pepe].', ja: 'それを食べなさい、ペペ。', fx: { e: '🍎', mood: '😋' }, why: 'くだもの（la fruta）は女性の物なので la。後ろにくっつけて `{cómela}`。' },
      { t: 'cast', who: 'lola', need: '宴のごちそうで、なにがいちばんおいしかった？\nロラに聞いてみよう', o: ['Dime, Lola.', 'Me di, Lola.', 'Díme, Lola.'], a: 0, out: '{Dime}, [Lola].', ja: '教えて、ロラ。', fx: { e: '💬', mood: '😆' }, why: '`di` ＋ me で `{dime}`。短い命令は、くっつけても ´ は要らない。' },
      { t: 'say', x: '「起きる」は `levantarse`（自分を起こす）。\ntú への命令なら、\n`te`（君自身を）をくっつけて `{levántate}`。' },
      { t: 'cast', who: 'pepe', need: 'もう、お日さまが高いのに…\nペペがまだ寝てる', o: ['¡Levántate, Pepe!', '¡Te levanta, Pepe!', '¡Levantate, Pepe!'], a: 0, out: '¡{Levántate}, [Pepe]!', ja: '起きなさい、ペペ！', fx: { e: '⏰', mood: '😵‍💫', world: 'morning' }, why: '`levanta` ＋ te で `{levántate}`。強く読む所に ´。' },
      { t: 'cast', who: 'marina', need: 'マリーナさまが、また遊びに来てくれた。\nいすをすすめよう', o: ['Siéntese, por favor.', 'Siéntate, por favor.', 'Se siente, por favor.'], a: 0, out: '{Siéntese}, por favor.', ja: 'どうぞ、おすわりください。', fx: { e: '🪑', mood: '😊' }, why: 'usted の「自分を」は se。usted の命令 siente（siento から）＋ se で `{siéntese}`。`siéntate` は tú への命令。' },
      { t: 'tip', id: 't-attach', ti: '「〜しろ」には lo・la・me・te・se を後ろにくっつける', x: '`{come}` ＋ lo → `{cómelo}`\n`{di}` ＋ me → `{dime}`\n`{levanta}` ＋ te → `{levántate}`\nもとの命令で強く読んだ所に ´（短い命令ならなし）' },
      { t: 'show', cap: '「だれに」と「何を」', tbl: [['「だれに」', 'me（私に）・te（君に）・le（彼・彼女・あなたに）'], ['「何を」', 'lo（それを・男性の物）・la（それを・女性の物）']] },
      { t: 'say', x: '2つ使うときは、\n**「だれに」→「何を」の順**。\n`Me lo das.`（君は私にそれをくれる）' },
      { t: 'ask', pred: true, q: '「（君が）私にそれをくれ」の命令は？\n（dar の tú の命令は `da`）', o: ['Dámelo.', 'Dalome.', 'Me lo da.'], a: 0, r: '`{Dámelo}`！\n命令の後ろに、同じ順でくっつける。' },
      { t: 'cast', who: 'pepe', need: 'ペペが、宴のくだもの（la fruta）を持っている。\n神さまにわたしてもらおう', o: ['Dámela, Pepe.', 'Dálame, Pepe.', 'Dámelo, Pepe.'], a: 0, out: '{Dámela}, [Pepe].', ja: 'それをわたしてくれ、ペペ。', fx: { e: '🍇', mood: '😋' }, why: 'la fruta は女性の物なので la。me → la の順で `{dámela}`。' },
      { t: 'say', x: '`le` は lo・la の前で `se` に変わる。\n`le` ＋ `la` → `se la`' },
      { t: 'cast', who: 'pepe', need: 'ペペが、マリーナさまへの花（la flor）を\n持ったまま、もじもじしている', o: ['Dásela a Marina.', 'Dálela a Marina.', 'Dámela a Marina.'], a: 0, out: '{Dásela} a Marina, [Pepe].', ja: 'それをマリーナさまにあげなさい、ペペ。', fx: { e: '💐', mood: '😳' }, why: 'le ＋ la → se la で `{dásela}`。`dámela` だと「私にそれをくれ」。' },
      { t: 'say', x: '「〜するな」なら、2つとも動詞の前。\n`No me lo {digas}.`（それを私に言うな）\n`No te {preocupes}.`（心配しないで）' },
      { t: 'cast', who: 'lola', need: '明日は決戦。\nロラが「みんな、だいじょうぶかな…」と\n心配している', o: ['No te preocupes, Lola.', 'No preocúpate, Lola.', 'No te preocupas, Lola.'], a: 0, out: 'No te {preocupes}, [Lola].', ja: '心配しないで、ロラ。', fx: { e: '🫂', mood: '🥹' }, why: '「〜するな」は no ＋ 接続法。te は前に出て `no te {preocupes}`。`no te preocupas` は「君は心配していない」という文。' },
      { t: 'cast', who: 'marina', need: 'マリーナさまも、少し不安そう。\n目上の女神さまを、はげまそう', o: ['No se preocupe, Marina.', 'No te preocupes, Marina.', 'No se preocupa, Marina.'], a: 0, out: 'No se {preocupe}, [Marina].', ja: 'ご心配なく、マリーナさま。', fx: { e: '✨', mood: '😌', world: 'shield' }, why: 'usted の「自分を」は se。usted の形で `no se {preocupe}`。' },
      { t: 'tip', id: 't-2pron', ti: '代名詞2つ：「だれに」→「何を」、le は se に', x: '`{da}` ＋ me ＋ lo → `{dámelo}`\n`{da}` ＋ le ＋ la → `{dásela}`（le → se）\n「〜するな」は前に：no me lo `{digas}`\nno te `{preocupes}`／no se `{preocupe}`' },
      { t: 'drill', n: 12 }
    ]
  },
  {
    id: 'L7', no: 7, day: 3, icon: '🤝', ti: 'みんなで行こう', sub: '〜しよう・vosotros に「〜するな」・使い分けの表',
    ev: { who: 'pueblo', line: '神さま、わしらも いっしょに戦うぞ！' },
    actors: ['pepe', 'lola', 'pueblo'],
    steps: [
      { t: 'say', x: '決戦の朝。村のみんなが集まってきた。\n今日は神さまも、みんなの仲間の1人だ。' },
      { t: 'show', cap: '「（私たちで）〜しよう」', tbl: [['hablar', '{hablemos}'], ['comer', '{comamos}'], ['salir', '{salgamos}']] },
      { t: 'say', x: 'これも接続法。**nosotros の形**。\n`hablamos`（私たちは話す）とは別の形だよ。\nただし「行こう」だけは `{vamos}`。' },
      { t: 'map', hi: ['nos'], x: '地図に書きこもう。' },
      { t: 'cast', who: 'pueblo', need: 'カオスが来る前に、海岸にとりでを作りたい。\nみんなで力を合わせよう', o: ['Trabajemos juntos.', 'Trabajamos juntos.', 'Trabajad juntos.'], a: 0, out: '{Trabajemos} juntos.', ja: 'いっしょに働こう。', fx: { e: '🧱', mood: '💪', world: 'shield' }, why: '自分も入れてさそうので `{trabajemos}`。`trabajamos` は「私たちは働く」。`trabajad` は「君たち、働け」で、自分は入らない。' },
      { t: 'cast', who: 'pepe', need: 'とりでができた！\nペペが「さあ、どこへ行く？」と聞いている', o: ['¡Vamos a la playa!', '¡Vemos a la playa!', '¡Van a la playa!'], a: 0, out: '¡{Vamos} a la playa!', ja: '海岸へ行こう！', fx: { e: '🏖️', mood: '😆' }, why: '「行こう」は `{vamos}`。`vemos` は「私たちは見る」。', more: 'ルールどおりの vayamos も正しい形だけど、「行こう」は、ふつう vamos を使う。' },
      { t: 'show', cap: 'vosotros に「〜するな」', tbl: [['hablar', 'no {habléis}'], ['comer', 'no {comáis}'], ['salir', 'no {salgáis}']] },
      { t: 'say', x: '「〜するな」は、いつも **no ＋ 接続法**。\nvosotros には **vosotros の形**。\n`hablad` に no はつけないよ。' },
      { t: 'map', hi: ['no-vos'], x: '地図に書きこもう。これで命令はぜんぶ。' },
      { t: 'cast', who: 'pueblo', need: '黒い霧が来た！\nみんなが、家から飛び出そうとしている', o: ['¡No salgáis, amigos!', '¡No salid, amigos!', '¡No salís, amigos!'], a: 0, out: '¡No {salgáis}, [amigos]!', ja: 'みんな、外に出るな！', fx: { e: '🌫️', mood: '😳' }, why: '`no {salgáis}`。`salid` は「出ろ」なので、no をつけても禁止にならない。`no salís` は「君たちは出ない」。' },
      { t: 'cast', who: 'lola', need: 'ロラと村のみんなが、\n「勝てるかな…」と不安そうにしている', o: ['No os preocupéis, amigos.', 'No te preocupes, amigos.', 'No os preocupáis, amigos.'], a: 0, out: 'No os {preocupéis}, [amigos].', ja: 'みんな、心配しないで。', fx: { e: '🫂', mood: '🥹', world: 'shield' }, why: '何人もの仲間には vosotros。os は前に出て `no os {preocupéis}`。`te preocupes` は1人の tú へ。' },
      { t: 'show', cap: '使い分けの表（hablar）', tbl: [['tú', '{habla} ／ no {hables}'], ['usted', '{hable} ／ no {hable}'], ['vosotros', '{hablad} ／ no {habléis}'], ['ustedes', '{hablen} ／ no {hablen}'], ['nosotros', '{hablemos}（〜しよう）']] },
      { t: 'tip', id: 't-nos', ti: '使い分け：接続法でないのは2つだけ', x: 'tú・vosotros の「〜しろ」だけ命令の形\n（`{habla}`・`{hablad}`）\nほかはぜんぶ接続法\n（`{hable}`・`{hablen}`・`{hablemos}`・no `{hables}`・no `{habléis}`）' },
      { t: 'drill', n: 10 }
    ]
  }
];

/* ボス（そのレッスンのあとに出る） */
MQ.bosses = [
  { id: 'B1', after: 'L2', day: 1, name: '嵐の巨人テンペスタ', en: 'GIGANTE TEMPESTAD', face: '🌪️', col: '#5fb8ff', from: ['L1', 'L2'], n: 7,
    line: 'ちびっこ神さま、島ごと吹きとばしてやる！', win: '嵐が晴れて、空に虹がかかった！' },
  { id: 'B2', after: 'L4', day: 2, name: '火山の竜ボルカン', en: 'DRAGÓN VOLCÁN', face: '🐉', col: '#ff6a3d', from: ['L3', 'L4'], n: 8,
    line: 'ていねいに頼めるか？ それとも灰になるか！', win: '火山がしずまって、あたたかい温泉がわいた！' },
  { id: 'B3', after: 'L7', day: 4, name: '闇の魔神カオス', en: 'DIOS DEL CAOS', face: '👁️', col: '#b04dff', from: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'], n: 12, final: true,
    line: '言葉なき世界こそ、我がのぞみ……', win: '闇が晴れた。島に、はじめての朝が来た——創世の完成だ！' }
];

/* 日本語の用語（本文に出たら点線。タップで説明） */
MQ.gloss = {
  '原形': '動詞の、辞書にのっている形。-ar・-er・-ir で終わる（hablar・comer・vivir）',
  '語幹': '動詞の前の部分。hablar なら habl-。活用でつづりが変わる動詞もある',
  'アクセント記号': '母音の上の ´。その音を強く読む印（sé・cómelo）',
  '再帰動詞': 'se がつく動詞。「自分を〜する」（levantarse＝自分を起こす→起きる）',
  '接続法': '「〜しますように」の気持ちを表す動詞の形。yo の形の o を反対の母音にして作る（hablo→hable・como→coma）。西検4級の範囲。tú・vosotros の「〜しろ」以外の命令は、ぜんぶこの形',
  '母音': 'a・e・i・o・u の音',
  '目上': '年上・立場が上の人。スペイン語では usted で話す'
};
