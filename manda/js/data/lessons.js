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
  viaje:  { e: '🧳', n: '旅の一行', d: '大陸から来たお客さんたち' }
};

MQ.days = [
  { d: 1, ti: 'はじまりの島', x: 'tú への命令（s を取る）' },
  { d: 2, ti: '村ができる', x: '不規則な8つ ＋ ボス' },
  { d: 3, ti: '女神さまが来た', x: 'usted へのていねいな命令' },
  { d: 4, ti: 'にぎわう港', x: 'みんなへの命令 ＋ ボス' },
  { d: 5, ti: '朝の島', x: '命令に「それを」をくっつける' },
  { d: 6, ti: '闇が近づく', x: '「〜するな」の命令' },
  { d: 7, ti: '創世の日', x: '復習 ＋ ラスボス' }
];

MQ.lessons = [
  /* ================= DAY 1 ================= */
  {
    id: 'L1', no: 1, day: 1, icon: '☀️', ti: '神の第一声', sub: 'tú への命令（ふつうの動詞）',
    ev: { who: 'pepe', line: '神さま…？ ここ、なんにもないよ…' },
    actors: ['pepe'],
    steps: [
      { t: 'say', x: 'やっと目を覚ましたね、神さま！\nボクはフクロウのブーホ。\n神さまのお世話係だよ🦉' },
      { t: 'say', who: 'pepe', x: '……神さま？ ぼく、ペペ。\nこの島、なんにもないんだ。\nなにをしたらいいの？' },
      { t: 'say', x: '神さまの仕事は、命令すること。\n命令の形は「だれに言うか」で変わる。\nまずは、ペペみたいな仲よしの相手。\nスペイン語で「君」は `tú` だね。',
        more: 'スペイン語の「あなた」は2つある。仲よしの相手に使う tú と、ていねいに話す相手に使う usted。usted は、島にお客さまが来たら使うよ（DAY 3）。' },
      { t: 'show', cap: 'おさらい：hablar（話す）の今の形', tbl: [['yo（私は）', 'hablo'], ['tú（君は）', 'hablas'], ['él・ella（彼・彼女は）', 'habla']] },
      { t: 'ask', pred: true, q: '表は、知っている今の形。\n「君は話す」は `hablas` だね。\nでは「（君が）話せ！」の命令は、どの形に近いと思う？', o: ['hablo', 'hablas', 'habla'], a: 2,
        r: '正解は `{habla}`！\n「君は話す」の `hablas` から、\n最後の **s を取る**と、命令になるんだ。' },
      { t: 'forge', w: 'hablas', cut: 's', out: '{habla}', ja: '話せ！', hint: '命令にするために、消す文字をタップ！' },
      { t: 'say', x: 'できた `{habla}` は、\n表の「彼は話す」の `habla` と同じつづり。\nだから「彼は〜する」の形と覚えてもいいよ。' },
      { t: 'say', x: '-er・-ir で終わる動詞も、同じやり方。\n`comer`（食べる）なら、\n「君は食べる」は `comes`。' },
      { t: 'forge', w: 'comes', cut: 's', out: '{come}', ja: '食べろ！', hint: '`comes` を命令に。消す文字をタップ！' },
      { t: 'cast', who: 'pepe', need: 'おなかがすいて、もう動けない…\n（足もとに魚がある）', o: ['¡Come!', '¡Comes!', '¡Como!'], a: 0,
        out: '¡[Pepe], {come}!', ja: 'ペペ、食べろ！', fx: { e: '🐟', mood: '😋' },
        why: '`comes` は「君は食べる」、`como` は「私は食べる」。命令は s を取った `{come}`。' },
      { t: 'say', x: '命令が届いた！ ペペが元気になったね。\n名前で呼びかけるときは、\n`[Pepe], {come}.` のように**コンマ**で区切る。\n前後の ¡ ! は「強く言う」印だよ。' },
      { t: 'say', x: 'つぎは、-ir の動詞。\n`abrir`（開ける）なら、\n「君は開ける」は `abres`。' },
      { t: 'forge', w: 'abres', cut: 's', out: '{abre}', ja: '開けろ！', hint: '`abres` を命令に。消す文字をタップ！' },
      { t: 'cast', who: 'pepe', need: 'まぶしくて、目をつぶったまま。\n空にはじめての太陽がのぼったのに…', o: ['Abre los ojos.', 'Abres los ojos.', 'Abro los ojos.'], a: 0,
        out: '[Pepe], {abre} los ojos.', ja: 'ペペ、目を開けなさい。', fx: { e: '☀️', mood: '🤩', world: 'sun' },
        why: '`abres` から s を取って `{abre}`。los ojos は「両目」。' },
      { t: 'tip', id: 't-tu-s', ti: 'tú への命令 ＝ tú の形から s を取る', x: '`hablas` → `{habla}`\n`comes` → `{come}`\n`abres` → `{abre}`\nできた形は「彼は〜する」と同じつづり。',
        why: 'スペイン語の命令は、もともと語の芯だけの短い形。それがたまたま「彼は〜する」と同じつづりになった。知っている tú の形から s を取れば、いちばん早くたどりつける。' },
      { t: 'ask', q: '`escuchar`（聞く）。「君は聞く」は `escuchas`。\n「聞いて！」の命令は？', o: ['¡Escucha!', '¡Escuchas!', '¡Escucho!'], a: 0,
        why: '`escuchas` から s を取って `{escucha}`。' },
      { t: 'drill', n: 4 }
    ]
  },
  {
    id: 'L2', no: 2, day: 1, icon: '🌙', ti: 'はじめての夜', sub: 'つづりが変わる動詞・por favor',
    ev: { who: 'lola', line: 'はじめまして、神さま！ もうすぐ夜が来るよ' },
    actors: ['pepe', 'lola'],
    steps: [
      { t: 'say', who: 'lola', x: 'はじめまして、神さま！\nわたしはロラ。ペペのお姉ちゃんだよ。' },
      { t: 'say', x: '島に、はじめての夜が来た。\n今日は、ちょっとクセのある動詞で\n命令してみよう。' },
      { t: 'show', cap: 'dormir（寝る）の今の形', tbl: [['yo', 'd^ue^rmo'], ['tú', 'd^ue^rmes'], ['él・ella', 'd^ue^rme'], ['nosotros（私たち）', 'dormimos']] },
      { t: 'say', x: '`dormir`（寝る）は、\no が ue に変わる動詞だったね。\n「君は寝る」は `duermes`。',
        more: '活用すると、語の前の部分（語幹）のつづりが変わる動詞がある。pensar → pienso（e が ie に）、dormir → duermo（o が ue に）、jugar → juego（u が ue に）。nosotros（私たち）のときは変わらない。' },
      { t: 'ask', pred: true, q: '「寝ろ」の命令は？\nさっきのルールを思い出してみて。', o: ['dorme', 'duerme', 'duermes'], a: 1,
        r: '`{duerme}`！\n`duermes` から s を取るだけ。\n変わった ue は、そのまま残るよ。' },
      { t: 'cast', who: 'pepe', need: 'ねむい…\nでも、まっくらでこわくて眠れない…', o: ['Duerme, Pepe.', 'Dorme, Pepe.', 'Duermes, Pepe.'], a: 0,
        out: '{Duerme}, [Pepe].', ja: '寝なさい、ペペ。', fx: { e: '😴', mood: '💤', world: 'moon' },
        why: '`duermes` から s を取って `{duerme}`。ue は残る。名前は命令のあとに置いてもいい（コンマで区切る）。' },
      { t: 'say', x: '名前は、命令の前にも後ろにも置ける。\nどちらもコンマで区切るよ。\n`[Pepe], {duerme}.`\n`{Duerme}, [Pepe].`' },
      { t: 'say', x: '命令のあとに「何を」をつけると、\nふつうの文と同じ順番になる。\n`cerrar`（閉める）は e が ie に。\n「君は閉める」は `cierras`。' },
      { t: 'forge', w: 'cierras', cut: 's', out: '{cierra} la puerta', ja: 'ドアを閉めろ', hint: '`cierras` を命令に。消す文字をタップ！' },
      { t: 'say', x: '命令がきつく聞こえるときは、\n`por favor`（お願い）をつけると、\nやわらかくなるよ。\n`{Cierra} la puerta, por favor.`' },
      { t: 'cast', who: 'lola', need: '外は風がつよい！\n小屋の中が寒いよ〜', o: ['Cierra la puerta, por favor.', 'Cierras la puerta, por favor.', 'Cerra la puerta, por favor.'], a: 0,
        out: '[Lola], {cierra} la puerta, por favor.', ja: 'ロラ、ドアを閉めて、お願い。', fx: { e: '🚪', mood: '😌' },
        why: '`cierras` から s を取って `{cierra}`。e が ie に変わったつづりは残す。' },
      { t: 'say', x: 'もう1つ。`jugar`（遊ぶ）は u が ue に。\n「君は遊ぶ」は `juegas`。' },
      { t: 'cast', who: 'lola', need: 'ペペがひとりで、さびしそう…\nいっしょに遊んであげたら？', o: ['Juega con Pepe.', 'Jugas con Pepe.', 'Juegas con Pepe.'], a: 0,
        out: '{Juega} con Pepe, [Lola].', ja: 'ペペと遊んであげて、ロラ。', fx: { e: '⚽', mood: '😆' },
        why: '`juegas` から s を取って `{juega}`。ue は残る。' },
      { t: 'tip', id: 't-stem', ti: 'つづりが変わる動詞も、s を取るだけ', x: '`duermes` → `{duerme}`\n`cierras` → `{cierra}`\n`juegas` → `{juega}`\n変わった ie・ue は残る。',
        why: '命令は tú の形から作る。tú の形のつづりがもう ie・ue に変わっているから、命令もそのまま。新しく覚えることはないんだ。' },
      { t: 'say', x: '今日のルールは1つだけ。\n**tú の形から s を取る。**\nクセのある動詞でも、これで OK！' },
      { t: 'drill', n: 5 }
    ]
  },
  /* ================= DAY 2 ================= */
  {
    id: 'L3', no: 3, day: 2, icon: '🔥', ti: '火をおこせ', sub: '不規則な命令 ven・ten・pon・sal',
    ev: { who: 'pepe', line: '神さま、寒いよ。あったかいものがほしい…' },
    actors: ['pepe', 'lola'],
    steps: [
      { t: 'say', x: 's を取るルールには、例外がある。\nよく使う動詞ほど、\n命令が短い形になるんだ。' },
      { t: 'show', cap: 'venir（来る）', tbl: [['tú（君は来る）', 'vienes'], ['s を取ると…', 'viene ？']] },
      { t: 'ask', pred: true, q: '`venir`（来る）。「君は来る」は `vienes`。\n「来い！」はどうなると思う？', o: ['viene', 'ven', 'vienes'], a: 1,
        r: '正解は `{ven}`！\n`viene` にはならない。\nもっと短い、特別な形なんだ。' },
      { t: 'say', x: 'でも、でたらめじゃない。\n原形の `venir` と、命令の `{ven}` を\nくらべてみて。' },
      { t: 'forge', w: 'venir', cut: 'ir', out: '{ven}', ja: '来い！', hint: '原形 `venir` から、命令で消える文字をタップ！' },
      { t: 'say', x: '原形の最後の `-ir` を取ると `{ven}`。\nこのつくりの仲間が、あと3つあるよ。' },
      { t: 'show', cap: '原形の最後の2文字を取る4つ', tbl: [['venir（来る）', '{ven}'], ['tener（持つ）', '{ten}'], ['poner（置く）', '{pon}'], ['salir（出る）', '{sal}']] },
      { t: 'say', x: '`tener`（持つ）→ `{ten}`\n`poner`（置く）→ `{pon}`\n`salir`（出る）→ `{sal}`\nどれも、原形の最後の2文字を取っただけ。' },
      { t: 'cast', who: 'pepe', need: '神さまのそばに行きたい。\nでも、行っていいのかな…', o: ['Ven aquí, Pepe.', 'Viene aquí, Pepe.', 'Vienes aquí, Pepe.'], a: 0,
        out: '{Ven} aquí, [Pepe].', ja: 'ここに来なさい、ペペ。', fx: { e: '🏃', mood: '😊' },
        why: '`venir` の命令は `{ven}`。`viene` は「彼は来る」、`vienes` は「君は来る」。' },
      { t: 'say', x: 'よし、神さまの火をさずけよう🔥\nでも、火はあぶない。\n`tener cuidado` で「気をつける」。\n（直訳すると「注意を持つ」）' },
      { t: 'cast', who: 'lola', need: 'わあ、火だ！\nさわってみたい！', o: ['Ten cuidado, Lola.', 'Tienes cuidado, Lola.', 'Tene cuidado, Lola.'], a: 0,
        out: '{Ten} cuidado, [Lola].', ja: '気をつけて、ロラ。', fx: { e: '🔥', mood: '😮', world: 'fire' },
        why: '`tener` の命令は、原形から -er を取って `{ten}`。`Ten cuidado.`（気をつけて）は、そのまま覚えておくと便利。' },
      { t: 'cast', who: 'pepe', need: '火で焼いたパン、どこに置こう？\n（そばにテーブルがある）', o: ['Pon el pan en la mesa.', 'Pone el pan en la mesa.', 'Poner el pan en la mesa.'], a: 0,
        out: '{Pon} el pan en la mesa.', ja: 'パンをテーブルに置きなさい。', fx: { e: '🍞', mood: '😋' },
        why: '`poner` から -er を取って `{pon}`。`poner` は原形のままで、命令ではない。' },
      { t: 'cast', who: 'lola', need: 'ゴホゴホ！\n小屋の中がけむりでいっぱい！', o: ['Sal de la casa.', 'Sale de la casa.', 'Sales de la casa.'], a: 0,
        out: '¡{Sal} de la casa!', ja: '家から出なさい！', fx: { e: '💨', mood: '😮‍💨' },
        why: '`salir` から -ir を取って `{sal}`。`sale` は「彼は出る」。' },
      { t: 'say', x: '気をつけて。s を取るルールで作ると、\n`viene`・`tiene`・`pone`・`sale` になる。\nこれは「彼は〜する」の形。\nこの4つでは、命令にならないよ。' },
      { t: 'tip', id: 't-4short', ti: '原形の最後の2文字を取る4つ', x: '`venir` → `{ven}`\n`tener` → `{ten}`\n`poner` → `{pon}`\n`salir` → `{sal}`\n__ベン・テン・ポン・サル__ と、リズムで覚えよう',
        why: '毎日のように使う言葉は、言いやすく短くなっていく。日本語の「いらっしゃい」が「らっしゃい」になるのと同じ。この4つは、原形の芯（ven・ten・pon・sal）だけが残った。' },
      { t: 'drill', n: 5 }
    ]
  },
  {
    id: 'L4', no: 4, day: 2, icon: '🏠', ti: '家を建てよ', sub: '覚える4つ haz・di・ve・sé',
    ev: { who: 'tomas', line: 'ふぉっふぉっ。わしも、この島に住んでよいかの？' },
    actors: ['pepe', 'lola', 'tomas'],
    steps: [
      { t: 'say', who: 'tomas', x: 'わしはトマスじい。\n物知りじゃが、家がなくての…' },
      { t: 'say', x: '不規則な命令は、あと4つ。\nこっちは原形から作れないから、\n覚えるしかない。\nでも、どれもすごく短いよ！' },
      { t: 'show', cap: '覚える4つ', tbl: [['hacer（する・作る）', '{haz}'], ['decir（言う）', '{di}'], ['ir（行く）', '{ve}'], ['ser（〜である）', '{sé}']] },
      { t: 'say', x: '`hacer`（する・作る）→ `{haz}`\n頭の ha は残って、最後が z になる。' },
      { t: 'cast', who: 'pepe', need: 'トマスじいの家を作りたい！\n神さま、命令して！', o: ['Haz una casa.', 'Hace una casa.', 'Haces una casa.'], a: 0,
        out: '[Pepe], {haz} una casa para Tomás.', ja: 'ペペ、トマスに家を作りなさい。', fx: { e: '🏠', mood: '💪', world: 'house' },
        why: '`hacer` の命令は `{haz}`。`hace` は「彼は作る」。para は「〜のために」。' },
      { t: 'say', x: '`decir`（言う）→ `{di}`\nいちばん短い命令かもね。' },
      { t: 'cast', who: 'pepe', need: 'あれ？ テーブルのパンがない。\nペペの口のまわりに、パンくずが…', o: ['Pepe, di la verdad.', 'Pepe, dice la verdad.', 'Pepe, dices la verdad.'], a: 0,
        out: '[Pepe], {di} la verdad.', ja: 'ペペ、本当のことを言いなさい。', fx: { e: '😅', mood: '🙇' },
        why: '`decir` の命令は `{di}`。la verdad は「本当のこと」。' },
      { t: 'say', x: '`ir`（行く）→ `{ve}`\n「行け！」は `{ve}`。' },
      { t: 'ask', pred: true, q: 'でも `ve` は、見たことがあるかも。\n`ver`（見る）の「彼は見る」も…？', o: ['同じ ve', 'ちがうつづり'], a: 0,
        r: 'そう、同じ `ve`！\n`ve` だけでは、「行け」か「彼は見る」か\n分からない。だから文の中で見分ける。\n`{Ve} a la playa.` なら「浜へ行け」。',
        more: '`a la playa`（浜へ）のように、行き先の a があれば「行け」。' },
      { t: 'cast', who: 'lola', need: '浜に、なにか流れついてる！\nだれか見てきて！', o: ['Ve a la playa, Lola.', 'Va a la playa, Lola.', 'Vas a la playa, Lola.'], a: 0,
        out: '{Ve} a la playa, [Lola].', ja: '浜へ行きなさい、ロラ。', fx: { e: '🐚', mood: '🤩', world: 'shell' },
        why: '`ir` の命令は `{ve}`。`va` は「彼は行く」、`vas` は「君は行く」。' },
      { t: 'say', x: '最後は `ser`（〜である）→ `{sé}`\nアクセント記号（´）がつくよ。\n`{Sé} bueno.` で「いい子でいなさい」。',
        more: 'saber（知っている）の「私は知っている」も sé で、同じつづり。これも文の中で見分ける。' },
      { t: 'cast', who: 'pepe', need: 'ペペが、ロラの貝がらを取ろうとしてる…', o: ['Sé bueno, Pepe.', 'Es bueno, Pepe.', 'Eres bueno, Pepe.'], a: 0,
        out: '{Sé} bueno, [Pepe].', ja: 'いい子でいなさい、ペペ。', fx: { e: '😇', mood: '🙏' },
        why: '`ser` の命令は `{sé}`。`eres` は「君は〜だ」、`es` は「彼は〜だ」。' },
      { t: 'tip', id: 't-8', ti: '不規則な命令8つ', x: '`{ven}`・`{ten}`・`{pon}`・`{sal}`（原形の2文字を取る）\n`{haz}`（hacer）・`{di}`（decir）・`{ve}`（ir）・`{sé}`（ser）\n__ベン・テン・ポン・サル・アス・ディ・ベ・セ__',
        why: 'スペイン語を習う人が、昔から呪文のように唱えてきた覚え方。8つまとめて唱えておくと、試験で思い出しやすい。この8つ以外は、最初に習った「s を取る」でできる。' },
      { t: 'ask', q: '「（君が）言え！」は？', o: ['¡Di!', '¡Dice!', '¡Decir!'], a: 0,
        why: '`decir` の命令は `{di}`。' },
      { t: 'drill', n: 6 }
    ]
  },
  /* ================= DAY 3 ================= */
  {
    id: 'L5', no: 5, day: 3, icon: '🧜‍♀️', ti: '海の女神', sub: 'usted へのていねいな命令',
    ev: { who: 'marina', line: 'ごきげんよう。あなたが、新しい神さま？' },
    actors: ['lola', 'marina'],
    steps: [
      { t: 'say', x: 'たいへん！ 船が来た！\n乗っているのは…\nとなりの海の女神、マリーナさまだ！' },
      { t: 'say', who: 'marina', x: 'はじめまして、若い神さま。\nこの島を見に来ましたの。' },
      { t: 'say', x: '目上の神さまや、はじめて会うお客さまには、\nていねいな「あなた」＝ `usted` を使う。\ntú で命令したら、失礼になっちゃう！',
        more: '神さまが島の人に tú を使うのは、家族みたいな仲間だから。スペイン語では、相手との近さで tú と usted を使い分ける。お店のお客さん・年上の知らない人・先生などには usted。' },
      { t: 'say', x: 'usted への命令は、\n「〜してください」くらいの、ていねいな形。\n作り方が、tú とちがうんだ。' },
      { t: 'show', cap: 'tú と usted の命令', tbl: [['hablar（話す）', '{habla} → {habl^e^}'], ['comer（食べる）', '{come} → {com^a^}'], ['abrir（開ける）', '{abre} → {abr^a^}']] },
      { t: 'ask', pred: true, q: '左が tú、右が usted への命令。\n`habla` → `hable`、`come` → `coma`。\n最後の文字は、どう変わった？', o: ['a と e が入れかわった', '最後に s がついた', '変わっていない'], a: 0,
        r: 'そのとおり！\n-ar の動詞は、a → **e**\n-er・-ir の動詞は、e → **a**\n__a と e を入れかえる__と、ていねいになる。' },
      { t: 'forge', w: 'habla', cut: 'a', add: 'e', o: ['e', 'a', 'o'], out: '{hable}', ja: '話してください', hint: 'tú の命令 `habla` を usted に。まず、入れかえる文字をタップ！' },
      { t: 'say', x: 'スペイン語では、usted への命令は\n**おもてなし**の言葉にもなる。\n「どうぞ入って」「どうぞ食べて」\nみたいにね。' },
      { t: 'say', x: '`pasar`（入る・通る）。\ntú への命令なら `{pasa}`。\nusted なら、a を e に…？' },
      { t: 'cast', who: 'marina', need: '（マリーナさまが、小屋の入り口で待っている）', o: ['Pase, por favor.', 'Pasa, por favor.', 'Pasas, por favor.'], a: 0,
        out: '{Pase}, por favor.', ja: 'どうぞ、お入りください。', fx: { e: '🛖', mood: '😊' },
        why: '`pasa` は tú（仲よし）への命令。女神さまには a を e にして `{pase}`。' },
      { t: 'forge', w: 'come', cut: 'e', add: 'a', o: ['a', 'e', 'o'], out: '{coma}', ja: '食べてください', hint: '`come` を usted に。入れかえる文字をタップ！' },
      { t: 'cast', who: 'marina', need: 'ロラが焼いたパンを出したよ。\nマリーナさまに、すすめよう', o: ['Coma, por favor.', 'Come, por favor.', 'Comes, por favor.'], a: 0,
        out: '{Coma}, por favor.', ja: 'どうぞ、召し上がってください。', fx: { e: '🍞', mood: '😋' },
        why: '`come` は tú への命令。usted には e を a にして `{coma}`。' },
      { t: 'tip', id: 't-usted', ti: 'usted への命令は、a と e を入れかえる', x: '-ar：`{habla}` → `{hable}`\n-er：`{come}` → `{coma}`\n-ir：`{abre}` → `{abra}`\n__a と e を入れかえる__',
        why: 'usted への命令は、もともと「〜してくださいますように」という願いの形（3級で習う接続法）。願いの形は、ふだんの活用と反対の母音を使う決まりがあるので、a と e が入れかわる。' },
      { t: 'say', who: 'marina', x: 'まあ、ていねいな神さまね。\n気に入りましたわ。' },
      { t: 'ask', q: 'マリーナさまに「聞いてください」。\n（tú への命令は `escucha`）', o: ['Escuche.', 'Escucha.', 'Escuchas.'], a: 0,
        why: '`escuchar` は -ar の動詞。a を e にして `{escuche}`。' },
      { t: 'drill', n: 5 }
    ]
  },
  {
    id: 'L6', no: 6, day: 3, icon: '🌺', ti: '島をご案内', sub: 'usted の命令は yo の形から',
    ev: { who: 'marina', line: 'この島の奥も、見てみたいわ' },
    actors: ['tomas', 'marina'],
    steps: [
      { t: 'say', x: 'マリーナさまを、島の奥へ案内しよう。\nでも、ここで困ったことが…' },
      { t: 'ask', pred: true, q: '`venir`（来る）を、usted への命令に。\ntú への命令は `ven`。\nでも `ven` の最後は n。\n入れかえる a・e が、最後にない…？', o: ['ven のまま', 'たぶん別の作り方がある'], a: 1,
        r: 'そう、別の作り方があるんだ。\nじつは usted への命令には、\n正式な作り方がある。\nスタートは **yo の形**。' },
      { t: 'show', cap: 'yo の形から作る', tbl: [['hablar：yo habl^o^', '{habl^e^}'], ['comer：yo com^o^', '{com^a^}'], ['venir：yo veng^o^', '{veng^a^}']] },
      { t: 'say', x: '作り方は2手。\n① yo の形の、最後の o を取る\n② -ar なら e、-er・-ir なら a をつける' },
      { t: 'say', x: 'ふつうの動詞なら、前回と同じ答えになる。\n`hablo` → `habl` → `{hable}`\nでも `venir` のように、\nyo の形が特別な動詞で、差が出るんだ。' },
      { t: 'forge', w: 'vengo', cut: 'o', add: 'a', o: ['a', 'e'], out: '{venga}', ja: '来てください', hint: 'yo の形 `vengo`（私は来る）から。① 取る文字をタップ！' },
      { t: 'say', x: 'yo の形の g が、そのまま残ったね。\n`venga` は「来てください」。' },
      { t: 'cast', who: 'marina', need: '島の奥を見たいわ。\n案内してくださる？', o: ['Venga conmigo.', 'Ven conmigo.', 'Viene conmigo.'], a: 0,
        out: '{Venga} conmigo.', ja: 'わたしといっしょに来てください。', fx: { e: '🌴', mood: '😊', world: 'palm' },
        why: '`ven` は tú への命令、`viene` は「彼女は来る」。usted には yo の形 vengo から `{venga}`。conmigo は「わたしといっしょに」。' },
      { t: 'show', cap: 'yo の形が -go で終わる動詞', tbl: [['tener：ten^go^', '{teng^a^}'], ['poner：pon^go^', '{pong^a^}'], ['salir：sal^go^', '{salg^a^}'], ['hacer：ha^go^', '{hag^a^}'], ['decir：di^go^', '{dig^a^}']] },
      { t: 'say', x: 'tú で不規則だった仲間（ten・pon・sal・haz・di）も、\nusted では yo の形から作れる！\nyo の形が -go なら、命令は -ga。' },
      { t: 'cast', who: 'marina', need: 'おみやげに、島の花をわたそう🌺', o: ['Tenga, es para usted.', 'Ten, es para usted.', 'Tiene, es para usted.'], a: 0,
        out: '{Tenga}, es para usted.', ja: 'どうぞ、あなたへのおくりものです。', fx: { e: '🌺', mood: '🥰', world: 'flower' },
        why: '`tengo` の o を取って a をつけ `{tenga}`。物をわたすときの「どうぞ」は、決まった言い方。' },
      { t: 'say', x: 'つづりが変わる動詞（ie・ue に変わる）も、\nyo の形から。\n`vuelvo`（私は帰る）→ `{vuelva}`\nyo の形の ue が、そのまま残る。' },
      { t: 'cast', who: 'marina', need: 'そろそろ帰りますわ。\nまた来てもいいかしら？', o: ['Vuelva pronto.', 'Vuelve pronto.', 'Volva pronto.'], a: 0,
        out: '{Vuelva} pronto.', ja: 'また近いうちに来てください。', fx: { e: '⛵', mood: '👋' },
        why: '`volver`（帰る・もどる）は yo の形が vuelvo。o を取って a で `{vuelva}`。`vuelve` は tú への命令。' },
      { t: 'tip', id: 't-yo', ti: 'usted の命令は yo の形から', x: '① yo の形の o を取る\n② -ar なら e、-er・-ir なら a\n`tengo` → `{tenga}`　`hago` → `{haga}`\n`vuelvo` → `{vuelva}`',
        why: 'usted への命令（願いの形）は、昔から yo の形を土台にして作られてきた。だから yo の形の g や ue が、そのまま引きつがれる。ふつうの動詞は yo の形も規則どおりなので、前回の「a と e を入れかえる」と同じ答えになる。' },
      { t: 'ask', q: '`hacer`（yo の形は `hago`）。\nusted に「〜してください」は？', o: ['Haga', 'Hace', 'Haz'], a: 0,
        why: '`hago` の o を取って a をつけ `{haga}`。`haz` は tú への命令。' },
      { t: 'drill', n: 5 }
    ]
  },
  /* ================= DAY 4 ================= */
  {
    id: 'L7', no: 7, day: 4, icon: '⚓', ti: '旅の一行', sub: 'yo の形から作れない4つ・ustedes',
    ev: { who: 'viaje', line: 'こんにちは！ 大陸から船で来ました！' },
    actors: ['tomas', 'viaje'],
    steps: [
      { t: 'say', x: '島に港ができて、\n大陸から旅の一行がやって来た！\nみんな、はじめて会うお客さまだよ。' },
      { t: 'say', x: 'その前に、usted の命令の残り。\nyo の形から作れない動詞が、4つだけある。' },
      { t: 'show', cap: 'yo の形が -oy で終わる4つ', tbl: [['ir：yo v^oy^', '{vaya}'], ['ser：yo s^oy^', '{sea}'], ['estar：yo est^oy^', '{esté}'], ['dar：yo d^oy^', '{dé}']] },
      { t: 'say', x: '表の yo の形を見て。\n`voy`・`soy`・`estoy`・`doy`。\nどれも -oy で終わっていて、\n「最後の o を取る」ができない。' },
      { t: 'say', x: 'だから、この4つは特別な形。\n`ir`（行く）→ `{vaya}`\n`ser`（〜である）→ `{sea}`\n`estar`（〜の状態でいる）→ `{esté}`\n`dar`（あげる）→ `{dé}`' },
      { t: 'cast', who: 'viaje', need: '旅の一行のひとりに\n「浜はどっちですか？」と聞かれた', o: ['Vaya por esta calle.', 'Ve por esta calle.', 'Va por esta calle.'], a: 0,
        out: '{Vaya} por esta calle.', ja: 'この道を行ってください。', fx: { e: '🛣️', mood: '👉' },
        why: '`ve` は tú への命令。お客さまには `{vaya}`。por esta calle は「この道を通って」。' },
      { t: 'say', x: 'つぎは、相手が**何人も**いるとき。\nusted が何人もいたら、`ustedes`（あなたたち）。' },
      { t: 'show', cap: 'usted → ustedes', tbl: [['hablar', '{hable} → {hable^n^}'], ['comer', '{coma} → {coma^n^}'], ['venir', '{venga} → {venga^n^}'], ['ir', '{vaya} → {vaya^n^}']] },
      { t: 'ask', pred: true, q: '左が usted、右が ustedes への命令。\nどう変わった？', o: ['最後に n がついた', '最後に s がついた', 'a と e が入れかわった'], a: 0,
        r: 'そう！ **usted の命令に n をつける**だけ。\n「彼らは話す」の hablan の n と同じで、\n「何人も」の印なんだ。' },
      { t: 'cast', who: 'viaje', need: '（旅の一行が、港で荷物を持って立っている）', o: ['Pasen, por favor.', 'Pase, por favor.', 'Pasan, por favor.'], a: 0,
        out: '{Pasen}, por favor.', ja: 'みなさん、どうぞお入りください。', fx: { e: '🏘️', mood: '😊', world: 'port' },
        why: '1人なら `pase`。何人もいるので n をつけて `{pasen}`。`pasan` は「彼らは通る」で、命令ではない。' },
      { t: 'cast', who: 'viaje', need: '長い船旅で、みんなおなかがぺこぺこ', o: ['Coman, por favor.', 'Comen, por favor.', 'Coma, por favor.'], a: 0,
        out: '{Coman}, por favor.', ja: 'みなさん、どうぞ召し上がってください。', fx: { e: '🍲', mood: '😋' },
        why: '`comer` は usted で `coma`、ustedes で `{coman}`。`comen` は「彼らは食べる」。' },
      { t: 'cast', who: 'viaje', need: '「島の神さまの家を見たい」と言っている', o: ['Vengan conmigo.', 'Vienen conmigo.', 'Venga conmigo.'], a: 0,
        out: '{Vengan} conmigo.', ja: 'みなさん、いっしょに来てください。', fx: { e: '⛩️', mood: '🤩' },
        why: 'usted の `venga` に n をつけて `{vengan}`。`vienen` は「彼らは来る」。' },
      { t: 'tip', id: 't-ustedes', ti: 'yo の形が -oy の4つ ／ ustedes は n をつける', x: '`{vaya}`（ir）・`{sea}`（ser）・`{esté}`（estar）・`{dé}`（dar）\nustedes：usted の命令 ＋ n\n`{hable}` → `{hablen}`　`{vaya}` → `{vayan}`',
        why: 'voy・soy・estoy・doy は、o のあとに y がついているので、o を取る作り方が使えない。ustedes の n は、動詞の「彼ら・あなたたち」の形（hablan・comen）にいつもつく n と同じ印。' },
      { t: 'ask', q: '旅の一行に「行ってください」。', o: ['Vayan', 'Vaya', 'Van'], a: 0,
        why: 'usted の `vaya` に n をつけて `{vayan}`。`van` は「彼らは行く」。' },
      { t: 'drill', n: 5 }
    ]
  },
  {
    id: 'L8', no: 8, day: 4, icon: '🎉', ti: '島の祭り', sub: 'vosotros への命令・だれに言う？',
    ev: { who: 'pueblo', line: '神さま！ 今夜はお祭りだ！' },
    actors: ['pepe', 'marina', 'pueblo', 'viaje'],
    steps: [
      { t: 'say', x: '今夜は、島ではじめてのお祭り！\n村のみんなも、マリーナさまも、\n旅の一行も来ているよ。' },
      { t: 'say', x: '村のみんなは、何人もいる仲間。\nスペインでは、仲よしの何人もの相手を\n`vosotros`（君たち）と呼ぶ。',
        more: 'vosotros を使うのはスペインだけ。中南米では、仲よしの何人もの相手にも ustedes を使う（命令も ustedes の形）。西検は両方出るので、どちらも分かるようにしておこう。' },
      { t: 'show', cap: 'vosotros への命令', tbl: [['hablar', '{habla^d^}'], ['comer', '{come^d^}'], ['abrir', '{abri^d^}'], ['venir', '{veni^d^}']] },
      { t: 'ask', pred: true, q: '左が原形、右が vosotros への命令。\nどう変わった？', o: ['最後の r が d になった', '最後に d がついた', 'a と e が入れかわった'], a: 0,
        r: 'そのとおり！\n**原形の最後の r を d にする**だけ。\nvosotros には、不規則な形がほとんどない。' },
      { t: 'forge', w: 'bailar', cut: 'r', add: 'd', o: ['d', 'n', 's'], out: '{bailad}', ja: '（君たち）踊れ！', hint: '原形 `bailar` を vosotros に。まず消す文字をタップ！' },
      { t: 'cast', who: 'pueblo', need: '音楽が始まった！\nみんなもじもじして、踊りださない', o: ['¡Bailad!', '¡Bailan!', '¡Baila!'], a: 0,
        out: '¡{Bailad}, amigos!', ja: 'みんな、踊れ！', fx: { e: '💃', mood: '🎶', world: 'party' },
        why: '何人もの仲間（vosotros）には、原形 bailar の r を d にして `{bailad}`。`baila` は1人の tú へ。' },
      { t: 'say', x: 'これで、命令の相手が4つそろった。\n「1人か、何人もか」と\n「仲よしか、ていねいか」で決まるよ。' },
      { t: 'show', cap: 'だれに言う？（hablar）', tbl: [['1人・仲よし（tú）', '{habla}'], ['1人・ていねい（usted）', '{hable}'], ['何人も・仲よし（vosotros）', '{hablad}'], ['何人も・ていねい（ustedes）', '{hablen}']] },
      { t: 'tapwho', es: '{Venga} a bailar, por favor.', ja: 'どうぞ、踊りに来てください。', a: 'marina',
        why: '`venga` は usted（1人・ていねい）への命令。だから目上のお客さま、マリーナさま。' },
      { t: 'tapwho', es: '¡{Comed} mucho!', ja: 'たくさん食べろ！', a: 'pueblo',
        why: '`comed` は、原形 comer の r を d にした vosotros（何人も・仲よし）への命令。だから村のみんな。' },
      { t: 'tapwho', es: '{Pasen} y {coman}, por favor.', ja: 'どうぞ入って、召し上がってください。', a: 'viaje',
        why: '`pasen`・`coman` は usted の命令に n をつけた ustedes（何人も・ていねい）への命令。だから旅の一行。' },
      { t: 'tapwho', es: '[Pepe], {canta} una canción.', ja: 'ペペ、歌を1曲歌って。', a: 'pepe',
        why: '`canta` は、cantas から s を取った tú（1人・仲よし）への命令。それに名前も呼んでいるね。' },
      { t: 'tip', id: 't-4people', ti: '命令の相手は4つ', x: '1人・仲よし `{habla}`（tú の形 − s）\n1人・ていねい `{hable}`（a と e を入れかえる）\n何人も・仲よし `{hablad}`（原形の r → d）\n何人も・ていねい `{hablen}`（usted ＋ n）',
        why: 'スペイン語の動詞は、いつも「だれが」を語尾で表す。命令も同じで、語尾を見れば、だれへの命令か分かる。だから主語を言わなくても通じるんだ。' },
      { t: 'drill', n: 6 }
    ]
  },
  /* ================= DAY 5 ================= */
  {
    id: 'L9', no: 9, day: 5, icon: '🌅', ti: '島の朝', sub: '命令に「それを」をくっつける',
    ev: { who: 'lola', line: 'ふわぁ…ペペがまだ起きないよ' },
    actors: ['pepe', 'lola', 'marina'],
    steps: [
      { t: 'say', x: 'お祭りの次の朝。\n今日は、命令に「それを」「私に」を\nくっつける言い方を覚えよう。' },
      { t: 'show', cap: '「それを・私に」の言葉', tbl: [['lo（それを・男性の物）', 'la（それを・女性の物）'], ['me（私に・私を）', 'te（君に・君を）']] },
      { t: 'say', x: 'ふつうの文では、こういう言葉は\n動詞の**前**に置くね。\n`Lo como.`（私はそれを食べる）' },
      { t: 'ask', pred: true, q: 'では命令では？\n「それを食べろ」はどっちだと思う？', o: ['Lo come.', 'Cómelo.'], a: 1,
        r: '正解は `{Cómelo}`！\n「〜しろ」の命令では、`lo` は動詞の**後ろ**に、\nくっつけて1語にするんだ。' },
      { t: 'say', x: '`Lo come.` は「彼はそれを食べる」。\nふつうの文になっちゃう。\nくっつけるから、命令だと分かるんだ。' },
      { t: 'say', x: 'もう1つ、大事なこと。\n`{come}` は「コメ」と、前の「コ」を強く読む。\n`lo` をつけても、強く読む所は同じ「コ」。\nそれを示すために、´ をつけて `{cómelo}`。',
        more: 'スペイン語は、後ろから2番目の音を強く読むのが基本（co-me-lo なら me）。でも命令では、もとの come の「コ」を強く読みたい。「基本とちがう所を強く読むよ」の印が ´（アクセント記号）。' },
      { t: 'cast', who: 'pepe', need: '朝ごはんのくだもの、\n食べていいのかな…？', o: ['Cómela.', 'La come.', 'Comela.'], a: 0,
        out: '{Cómela}, [Pepe].', ja: 'それを食べなさい、ペペ。', fx: { e: '🍎', mood: '😋' },
        why: 'くだもの（la fruta）は女性の物なので la。命令の後ろにくっつけて、強く読む「コ」に ´ をつけて `{cómela}`。' },
      { t: 'say', x: '`me`（私に）も同じ。\n`{di}` ＋ `me` → `{dime}`（私に言って）\n短い命令は、くっつけても ´ は要らない。\n「ディ」を強く読むのが、もともとの基本どおりだから。' },
      { t: 'cast', who: 'lola', need: 'ゆうべの祭りで、なにがいちばん楽しかった？\nロラに聞いてみよう', o: ['Dime, Lola.', 'Me di, Lola.', 'Díme, Lola.'], a: 0,
        out: '{Dime}, [Lola].', ja: '教えて、ロラ。', fx: { e: '💬', mood: '😆' },
        why: '`di` の後ろに `me` をくっつけて `{dime}`。di-me は、後ろから2番目の「ディ」を強く読む基本どおりなので、´ は要らない。' },
      { t: 'say', x: '「起きる」は、`levantarse`。\n最後の se は「自分を」という意味で、\n「自分を起こす」→「起きる」。',
        more: 'このような動詞を再帰動詞という。se の部分は、だれのことかで変わる（me levanto＝私は起きる、te levantas＝君は起きる）。' },
      { t: 'say', x: 'tú への命令なら、\n`{levanta}` に「君自身を」の `te` をくっつけて、\n`{levántate}`（起きなさい）。\n強く読む「バ」に ´ がつくよ。' },
      { t: 'cast', who: 'pepe', need: 'もう、お日さまが高いのに…\nペペがまだ寝てる', o: ['¡Levántate, Pepe!', '¡Te levanta, Pepe!', '¡Levantate, Pepe!'], a: 0,
        out: '¡{Levántate}, [Pepe]!', ja: '起きなさい、ペペ！', fx: { e: '⏰', mood: '😵‍💫', world: 'morning' },
        why: '`levanta` の後ろに `te` をくっつけて、強く読む所に ´ をつけて `{levántate}`。' },
      { t: 'say', x: 'usted への命令にも、同じようにくっつく。\nusted の「自分を」は `se`。\n`sentarse`（すわる）→ `{siéntese}`\n（どうぞ、おすわりください）' },
      { t: 'cast', who: 'marina', need: 'マリーナさまが、また遊びに来てくれた。\nいすをすすめよう', o: ['Siéntese, por favor.', 'Siéntate, por favor.', 'Se siente, por favor.'], a: 0,
        out: '{Siéntese}, por favor.', ja: 'どうぞ、おすわりください。', fx: { e: '🪑', mood: '😊' },
        why: 'usted への命令 siente（sentar の yo の形 siento から）に se をくっつけて `{siéntese}`。`siéntate` は tú への命令。' },
      { t: 'tip', id: 't-attach', ti: '命令には lo・la・me・te・se を後ろにくっつける', x: '`{come}` ＋ lo → `{cómelo}`\n`{di}` ＋ me → `{dime}`\n`{levanta}` ＋ te → `{levántate}`\nもとの命令で強く読んだ所に ´（短い命令ならなし）',
        why: 'くっつけると語が長くなり、強く読む位置が「基本の位置（後ろから2番目）」からずれる。もとの読み方を守るために ´ をつける。dime（ディ-メ）は基本どおりなので要らない。' },
      { t: 'drill', n: 5 }
    ]
  },
  /* ================= DAY 6 ================= */
  {
    id: 'L10', no: 10, day: 6, icon: '🛡️', ti: '闇が来る', sub: '「〜するな」の命令',
    ev: { who: 'tomas', line: 'た、たいへんじゃ！ 空のむこうが真っ黒じゃ！' },
    actors: ['pepe', 'lola', 'tomas'],
    steps: [
      { t: 'say', who: 'tomas', x: '神さま！ 海のむこうから、\nまっ黒な雲がせまっておる！\n闇の魔神カオスじゃ…！' },
      { t: 'say', x: 'みんなを守るために、\n「〜するな」の命令を覚えよう。\n作り方には、usted の命令を使うよ。' },
      { t: 'show', cap: 'usted の命令 → tú への「〜するな」', tbl: [['{hable}', 'no {hable^s^}'], ['{coma}', 'no {coma^s^}'], ['{salga}', 'no {salga^s^}']] },
      { t: 'ask', pred: true, q: '「（君は）話すな」は `no hables`。\nusted の命令 `hable` と、どうちがう？', o: ['no ＋ 最後に s', 'a と e が入れかわった', '原形の r が d になった'], a: 0,
        r: 'そのとおり！\ntú に「〜するな」は、\n**no ＋ usted の命令 ＋ s**。\ntú の印の s が、ここでつくんだ。' },
      { t: 'say', x: '`habla`（話せ）に no をつけて\n`no habla` …とは言わない。\n`no habla` は「彼は話さない」の文になる。\n禁止は、形ごと変わるんだ。' },
      { t: 'forge', w: 'salga', cut: '', add: 's', o: ['s', 'n', 'd'], out: 'No {salgas}.', ja: '（君は）出るな。', hint: 'usted の命令 `salga` から、tú の「〜するな」を作ろう。つける文字は？' },
      { t: 'cast', who: 'pepe', need: '外がどうなってるか、見に行ってくる！', o: ['¡No salgas, Pepe!', '¡No sal, Pepe!', '¡No sales, Pepe!'], a: 0,
        out: '¡No {salgas}, [Pepe]!', ja: '出ちゃだめだ、ペペ！', fx: { e: '🛑', mood: '😳' },
        why: '`sal` は「出ろ」。「出るな」は usted の命令 salga に s で `no {salgas}`。`no sales` は「君は出ない」。' },
      { t: 'say', x: '`tener miedo` は「こわがる」。\n（直訳すると「恐怖を持つ」）\n`tener` の usted の命令は `tenga` だったね。' },
      { t: 'cast', who: 'lola', need: 'こわいよ…\nロラが、ふるえている', o: ['No tengas miedo, Lola.', 'No ten miedo, Lola.', 'No tienes miedo, Lola.'], a: 0,
        out: 'No {tengas} miedo, [Lola].', ja: 'こわがらないで、ロラ。', fx: { e: '🫂', mood: '🥲', world: 'shield' },
        why: '`tenga` に s をつけて `no {tengas}`。`no tienes miedo` は「君はこわがっていない」という文。' },
      { t: 'say', x: 'usted に「〜しないでください」なら、\nもっとかんたん。\n**no ＋ usted の命令** だけ。\n`No {salga}.`（出ないでください）' },
      { t: 'say', x: '「それを」の lo などは、\n禁止の命令では、くっつけない。\nふつうの文と同じ、動詞の**前**に置く。\n`No lo {comas}.`（それを食べるな）' },
      { t: 'cast', who: 'pepe', need: '黒い雲から、あやしい黒いリンゴが降ってきた！\nペペが拾ってる…', o: ['¡No la comas!', '¡No cómela!', '¡No comas la!'], a: 0,
        out: '¡No la {comas}, [Pepe]!', ja: 'それを食べちゃだめだ、ペペ！', fx: { e: '🍏', mood: '😱' },
        why: '禁止の命令では、la は動詞の前。`no la {comas}`。くっつけるのは「〜しろ」の命令のときだけ。' },
      { t: 'tip', id: 't-neg', ti: '「〜するな」は usted の命令から', x: 'tú へ：no ＋ usted の命令 ＋ s\n`{hable}` → no `{hables}`　`{tenga}` → no `{tengas}`\nusted へ：no ＋ usted の命令（`no {hable}`）\nlo・me などは動詞の前（`no lo {comas}`）',
        why: '「〜するな」も、usted の命令と同じ願いの形を使う。願いの形の「君」の語尾が -s なので、tú への禁止は s がつく。vosotros への禁止（no habléis）は、3級で習うよ。' },
      { t: 'say', x: 'これで命令の形は、ぜんぶそろった！\n神さま、カオスとの決戦だ…！' },
      { t: 'drill', n: 6 }
    ]
  }
];

/* ボス（そのレッスンのあとに出る） */
MQ.bosses = [
  { id: 'B1', after: 'L4', day: 2, name: '嵐の巨人テンペスタ', en: 'GIGANTE TEMPESTAD', face: '🌪️', col: '#5fb8ff', from: ['L1', 'L2', 'L3', 'L4'], n: 7,
    line: 'ちびっこ神さま、島ごと吹きとばしてやる！', win: '嵐が晴れて、空に虹がかかった！' },
  { id: 'B2', after: 'L8', day: 4, name: '火山の竜ボルカン', en: 'DRAGÓN VOLCÁN', face: '🐉', col: '#ff6a3d', from: ['L5', 'L6', 'L7', 'L8'], n: 8,
    line: 'ていねいに頼めるか？ それとも灰になるか！', win: '火山がしずまって、あたたかい温泉がわいた！' },
  { id: 'B3', after: 'L10', day: 7, name: '闇の魔神カオス', en: 'DIOS DEL CAOS', face: '👁️', col: '#b04dff', from: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10'], n: 12, final: true,
    line: '言葉なき世界こそ、我がのぞみ……', win: '闇が晴れた。島に、はじめての朝が来た——創世の完成だ！' }
];

/* 日本語の用語（本文に出たら点線。タップで説明） */
MQ.gloss = {
  '原形': '動詞の、辞書にのっている形。-ar・-er・-ir で終わる（hablar・comer・vivir）',
  '語幹': '動詞の前の部分。hablar なら habl-。活用でつづりが変わる動詞もある',
  'アクセント記号': '母音の上の ´。その音を強く読む印（sé・cómelo）',
  '再帰動詞': 'se がつく動詞。「自分を〜する」（levantarse＝自分を起こす→起きる）',
  '接続法': '「〜しますように」と願う・頼む気持ちの動詞の形。3級で習う。命令の usted の形と同じつづり',
  '母音': 'a・e・i・o・u の音',
  '目上': '年上・立場が上の人。スペイン語では usted で話す'
};
