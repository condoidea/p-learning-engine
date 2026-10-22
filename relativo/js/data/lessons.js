/* =========================================================
 * ¡QUE FUSIÓN! — レッスン（台本）
 *
 *  ケボット（文を合体させるロボット）が話し、こちらは下のボタン・タップで進める。
 *
 *  日本語の文の書き方
 *    **…**   覚えること（マーカー）
 *    __…__   覚え方のヒント（💡波線）
 *    ((…))   この教材での呼び方・約束（グレー）
 *    `…`     スペイン語（中で下の色分けが使える）
 *    \n      改行（1つの吹き出しに1つのこと。手順は1行ずつ）
 *
 *  スペイン語の色分け（どの画面でも同じ色）
 *    [libro]   先行詞（水色）
 *    {que}     関係詞（ピンク）
 *    ^en^      前置詞（黄色）
 *    |…|       タップする所（fuse・morph）
 *
 *  ステップ
 *    say   { x, more }                       ケボットが話す。more があると「🤔 なんで？」で補足
 *    ex    { es, ja }                        例文カード（🔊つき）
 *    fuse  { a, b, bt, out, ja, hint }       2つの文を合体。b の |…| をタップ → bt に変身 → out
 *    morph { es, out, ja, hint }             1つの文の |…| をタップして形を変える
 *    ask   { q, es, o, a, pred, r, why }     問い。pred:true は予想（採点しない）。o の最初が正解とは限らない（a が正解の番号）
 *    tip   { id, ti, x, why }                TIP カード（Tipsノートに入る）
 *    q     { id }                            問題バンクの1問
 *    drill { n }                             このレッスンの問題から n 問
 *
 *  例文・説明はこのアプリのためのオリジナル。
 * ========================================================= */
window.RQ = window.RQ || {};

RQ.lessons = [
  /* ================= DAY 1 ================= */
  {
    id: 'L1', no: 1, day: 1, icon: '🔗', ti: 'que で名詞に「しっぽ」', sub: '関係詞の基本の動き',
    steps: [
      { t: 'say', x: '¡Hola! ボクは**ケボット**。\n2つの文を合体させるロボットだよ⚡' },
      { t: 'say', x: '日本語だと「昨日買った本」。\n説明（昨日買った）は名詞の**前**につくよね。' },
      { t: 'ask', pred: true, q: 'スペイン語では、説明はどこにつくと思う？', o: ['名詞の前', '名詞の後ろ'], a: 1,
        r: '正解は**後ろ**！\n英語の the book that I bought と同じ順番だよ。' },
      { t: 'say', x: 'じゃあ、さっそく合体してみよう。\n2つの文に**同じ名詞**が出てくるのがポイント。' },
      { t: 'fuse', a: 'Este es el [libro].', b: 'Compré |el libro| ayer.', bt: '{que} compré ayer',
        out: 'Este es el [libro] {que} compré ayer.', ja: 'これが、昨日買った本だ。',
        hint: '下の文で、上の文と<b>かぶっている名詞</b>をタップ！' },
      { t: 'say', x: 'かぶった名詞が `{que}` に変身して、\n文の**頭**へジャンプしたね。\nこれが関係詞の基本の動き！' },
      { t: 'say', x: '説明される名詞（`[libro]`）を**先行詞**と呼ぶよ。\n((色の約束：先行詞は水色、関係詞はピンク))',
        more: '「先に行く詞（ことば）」。関係詞より先に出てくる名詞だから先行詞。que が「どの名詞の話か」を指す相手だよ。' },
      { t: 'ex', es: 'La [película] {que} vi ayer fue muy buena.', ja: '昨日見た映画は、とてもよかった。' },
      { t: 'q', id: 'l1-ante1' },
      { t: 'say', x: 'que のあとは「だれが・どうした」の形とは限らない。\nque そのものが**主語**になることもあるよ。' },
      { t: 'fuse', a: 'Hay un [tren].', b: '|El tren| sale a las tres.', bt: '{que} sale a las tres',
        out: 'Hay un [tren] {que} sale a las tres.', ja: '3時に出る電車がある。',
        hint: 'かぶっている名詞をタップ！' },
      { t: 'tip', id: 't-tail', ti: '名詞 ＋ que ＋ 説明', x: '説明は名詞の**後ろ**に、`{que}` から始めてつける。\n__名詞に que のしっぽが生える__イメージ。',
        why: 'スペイン語は「大事な名詞を先に言って、あとから説明を足す」語順のことば。形容詞も el coche rojo（赤い車）のように名詞の後ろにつくのと同じ発想だよ。' },
      { t: 'ask', q: '「私が読んでいる本」の正しい語順は？', o: ['el libro que leo', 'que leo el libro', 'el que libro leo'], a: 0,
        why: '名詞（el libro）→ que → 説明（leo）の順。' },
      { t: 'drill', n: 4 }
    ]
  },
  {
    id: 'L2', no: 2, day: 1, icon: '🧑‍🤝‍🧑', ti: 'que は人にも・省略しない', sub: '英語経験者のワナ',
    steps: [
      { t: 'say', x: 'L1 は「もの」だったけど、\nque は**人**にも使えるよ。' },
      { t: 'ask', pred: true, q: '「マドリードに住んでいる友だち」。英語なら who。スペイン語は？', es: 'Tengo un amigo ___ vive en Madrid.', o: ['quien', 'que'], a: 1,
        r: '`{que}` で OK！\n人でも、まずは que が基本。' },
      { t: 'fuse', a: 'Tengo un [amigo].', b: '|El amigo| vive en Madrid.', bt: '{que} vive en Madrid',
        out: 'Tengo un [amigo] {que} vive en Madrid.', ja: '私には、マドリードに住んでいる友だちがいる。',
        hint: 'かぶっている名詞をタップ！' },
      { t: 'say', x: '先行詞が文の真ん中にあるときは？\nque のカタマリが、先行詞のすぐ後ろに**割りこむ**よ。' },
      { t: 'fuse', a: 'La [chica] es mi prima.', b: 'Ves |a la chica| allí.', bt: '{que} ves allí',
        out: 'La [chica] {que} ves allí es mi prima.', ja: 'あそこに見える女の子は、私のいとこだ。',
        hint: 'かぶっている所（a la chica）をタップ！' },
      { t: 'say', x: '人の目的語につく `a` は、que に変わるときに消えたね。\n（a la chica → que）',
        more: '「人を〜する」の a（ves a la chica）は、名詞が人だと分かるようにつける印。que に変わると名詞そのものが消えるので、印も要らなくなる。前置詞の a を残す言い方（a la que / a quien）もあるけど、それは L4・L5 で。' },
      { t: 'say', x: 'ここで英語を習った人が落ちる**ワナ**⚠\n英語は the book I bought みたいに、\nthat を省略できるよね。' },
      { t: 'ask', q: '「私が買った本」。正しいのは？', o: ['el libro compré', 'el libro que compré'], a: 1,
        why: 'スペイン語の que は**省略できない**。' },
      { t: 'tip', id: 't-noomit', ti: 'que は省略できない', x: '`el libro {que} compré`\n英語みたいに que を抜くと、文がこわれる。',
        why: 'compré は「私は買った」という1語の文。que がないと el libro と compré が別々の文に見えてしまう。que は「ここから説明だよ」の合図なんだ。' },
      { t: 'ex', es: 'El [profesor] {que} tenemos este año es muy simpático.', ja: '今年の先生は、とても感じがいい。' },
      { t: 'q', id: 'l2-ante1' },
      { t: 'tip', id: 't-que-all', ti: '迷ったら、まず que', x: '先行詞が**人**でも**もの**でも、主語でも目的語でも `{que}` が使える。\n__que は万能コネクター__',
        why: '英語の who・which・that の仕事を、スペイン語はほぼ que 1つで引き受けている。ほかの関係詞（quien・donde…）は、que では足りない場面の専門家だと思えばいい。' },
      { t: 'drill', n: 5 }
    ]
  },
  /* ================= DAY 2 ================= */
  {
    id: 'L3', no: 3, day: 2, icon: '👤', ti: 'quien は人専用', sub: 'でも、いつでも使えるわけじゃない',
    steps: [
      { t: 'say', x: '人専用の関係詞が `{quien}`。\n複数なら `{quienes}`。' },
      { t: 'ask', pred: true, q: 'じゃあ、これは正しい？', es: 'El chico quien vive allí es Pablo.', o: ['正しい', 'まちがい'], a: 1,
        r: '実は**まちがい**！ ここは `{que}`。\nquien が使えるのは、決まった場面だけ。\nまず例文を見てみよう。' },
      { t: 'ex', es: 'Mi [hermana], {quien} vive en Japón, habla tres idiomas.', ja: '私の姉（日本に住んでいる）は、3つの言語を話す。' },
      { t: 'ask', pred: true, q: 'コンマではさまれた所（quien vive en Japón）を消しても、文は通じる？', o: ['通じる', '通じない'], a: 0,
        r: '通じる。「私の姉は3つの言語を話す」。\nコンマの中は、なくても困らない**おまけの説明**。\n日本語なら（かっこ）に入れる感じ：\n「私の姉（日本に住んでいる）は…」' },
      { t: 'ask', pred: true, q: 'このかっこの説明は、「どの姉か」を区別するため？', o: ['区別じゃない（姉はもう決まっている）', '区別のため'], a: 0,
        r: 'そう。mi hermana と言った時点で、だれかは決まってる。\nだから、かっこで説明を足しているだけ。\nこの**かっこの説明**の中なら quien が使える。\n（que でも OK）' },
      { t: 'tip', id: 't-quien2', ti: 'quien の出番は2つ', x: '① コンマではさんだ**かっこの説明**の中\n　`[hermana], {quien} vive en Japón,`\n② 前置詞のあと（`^con^ {quien}` など。L4 で）\nコンマなしで「どの人か」を区別する説明は **que**。\n__quien は「お呼ばれ」したときだけ出てくる__',
        why: 'コンマなしで「（何人かいる中の）どの人か」をしぼりこむ説明は、スペイン語では昔から que の担当。ここに quien を置くと、まちがいとされる。' },
      { t: 'ex', es: 'Mis [abuelos], {quienes} viven en el campo, tienen muchos animales.', ja: '私の祖父母（いなかに住んでいる）は、動物をたくさん飼っている。' },
      { t: 'ask', q: '先行詞が複数の人のときは？', es: 'Mis padres, ___ viven en Sevilla, vienen mañana.', o: ['quien', 'quienes', 'quienas'], a: 1,
        why: '先行詞（mis padres）が複数なので quienes。' },
      { t: 'tip', id: 't-quien-fem', ti: 'quien に女性形はない', x: '`{quien}` / `{quienes}` の2つだけ。\nquiena・quienas という形は**ない**。',
        why: 'quien は「だれ」から来た語で、男女の区別をしない（¿Quién es? も男女どちらにも使う）。変わるのは数（単数・複数）だけ。' },
      { t: 'q', id: 'l3-bug1' },
      { t: 'say', x: 'コンマのあるなしで、意味も変わるよ。' },
      { t: 'ask', q: 'コンマあり。どういう意味？', es: 'Mi hermano, que vive en Tokio, es médico.', o: ['兄は1人。その兄（東京に住んでいる）は医者だ', '兄が何人かいて、東京に住んでいる方の兄が医者だ'], a: 0,
        why: 'コンマあり＝かっこの説明。兄はもう決まっているので、兄は1人と読める。コンマがなければ「（何人かいる中の）東京に住んでいる兄」と区別する意味になる。' },
      { t: 'drill', n: 5 }
    ]
  },
  {
    id: 'L4', no: 4, day: 2, icon: '🚀', ti: '前置詞は前へ！', sub: 'con quien・de quien・en que',
    steps: [
      { t: 'say', x: '英語だと the girl I talk **with**、\nthe house I live **in**。\n前置詞が最後に残るよね。' },
      { t: 'ask', pred: true, q: 'スペイン語でも、前置詞を後ろに残せる？', es: 'la chica que hablo con', o: ['残せる', '残せない'], a: 1,
        r: '**残せない**！\n前置詞は関係詞と**セット**で前へ出る。' },
      { t: 'fuse', a: 'Esta es la [chica].', b: 'Hablo |con la chica| todos los días.', bt: '^con^ {quien} hablo todos los días',
        out: 'Esta es la [chica] ^con^ {quien} hablo todos los días.', ja: 'これが、私が毎日話している女の子だ。',
        hint: '前置詞ごと、かぶっている所（con la chica）をタップ！' },
      { t: 'say', x: '前置詞 `^con^` が、いっしょに前へ来た！\n((色の約束：前置詞は黄色))' },
      { t: 'tip', id: 't-prep-front', ti: '前置詞は置いていかない', x: '前置詞 ＋ 関係詞 は**くっついて**、カタマリの先頭へ。\n__前置詞は関係詞の「乗り物」__',
        why: 'スペイン語の前置詞は、かならず名詞（ここでは関係詞）の直前に置くきまり。文の最後に前置詞だけが残る形は、スペイン語には存在しない。' },
      { t: 'ex', es: 'El [chico] ^de^ {quien} te hablé es este.', ja: '君に話した（話題にした）男の子は、この子だよ。' },
      { t: 'ask', pred: true, q: '「〜について話す」は hablar ＿ 〜。関係詞の前に来た前置詞は？', o: ['de', 'con', 'en'], a: 0,
        r: '`^de^ {quien}`！ hablar de 〜 で「〜について話す」。\n動詞と前置詞のペアに注目しよう。' },
      { t: 'ask', q: 'vivir con 〜（〜といっしょに住む）を使うと？', es: 'La persona ___ vivo es mi tía.', o: ['con quien', 'quien', 'quien con'], a: 0,
        why: 'vivo con la persona → con quien vivo。前置詞は関係詞の前。' },
      { t: 'say', x: '「もの」のときは？\nquien は人専用だから使えない。\n前置詞 ＋ `{que}` にするよ。' },
      { t: 'ex', es: 'Este es el [pueblo] ^en^ {que} nací.', ja: 'これが、私の生まれた村だ。' },
      { t: 'ask', pred: true, q: 'これは正しい？（鉛筆で書く）', es: 'el lápiz con quien escribo', o: ['正しい', 'まちがい'], a: 1,
        r: '**まちがい**。lápiz（鉛筆）は人じゃないから quien はダメ。\n次のレッスンで、もっと安全な形を教えるね。' },
      { t: 'q', id: 'l4-join1' },
      { t: 'drill', n: 5 }
    ]
  },
  /* ================= DAY 3 ================= */
  {
    id: 'L5', no: 5, day: 3, icon: '👯', ti: '冠詞がはさまる', sub: '前置詞 ＋ el/la/los/las ＋ que',
    steps: [
      { t: 'say', x: '前置詞のあとで、いちばんよく使う形がこれ。\n前置詞 ＋ **el / la / los / las** ＋ que' },
      { t: 'fuse', a: 'Me gusta el [restaurante].', b: 'Comimos |en el restaurante| ayer.', bt: '^en^ {el que} comimos ayer',
        out: 'Me gusta el [restaurante] ^en^ {el que} comimos ayer.', ja: '昨日食べたレストランが気に入っている。',
        hint: '前置詞ごと、かぶっている所をタップ！' },
      { t: 'ask', pred: true, q: 'いま、何が起きた？', o: ['名詞だけが que に変わって、el は残った', '名詞も el も消えた'], a: 0,
        r: 'そう！ **名詞だけ** が que に変身して、\n冠詞の el は**残った**。' },
      { t: 'tip', id: 't-art-stay', ti: '冠詞は残る', x: '`^en^ el restaurante` → `^en^ {el que}`\n__名詞だけが que に変身、冠詞はそのまま__',
        why: 'だから冠詞は、先行詞（消えた名詞）と同じ性・数になる。la casa なら la que、los amigos なら los que。理由が分かれば、もう迷わない。' },
      { t: 'ex', es: 'Esta es la [casa] ^en^ {la que} vivo.', ja: 'これが、私の住んでいる家だ。' },
      { t: 'ask', q: '{la que} の la は、何に合わせている？', es: 'Esta es la casa en la que vivo.', o: ['casa（女性・単数）', 'vivo（私は住む）', 'esta（これ）'], a: 0,
        why: '冠詞は**先行詞**の性・数に合わせる。casa は女性名詞・単数 → la。' },
      { t: 'ex', es: 'Son los [amigos] ^con^ {los que} viajé a México.', ja: '（彼らは）私がいっしょにメキシコへ旅行した友だちだ。' },
      { t: 'say', x: '人のときは `^con^ {los que}` でも `^con^ {quienes}` でも OK。\n会話では el que の形がよく使われるよ。' },
      { t: 'ask', q: '冠詞はどれ？', es: 'Las chicas con ___ que trabajo son muy simpáticas.', o: ['el', 'la', 'los', 'las'], a: 3,
        why: '先行詞 las chicas（女性・複数）→ las。' },
      { t: 'say', x: 'もう1つ。a ＋ el は `al` にくっつくよね。\n関係詞でも同じで、**a ＋ el que → al que**。' },
      { t: 'ex', es: 'El [chico] ^al^ {que} llamé ayer es mi primo.', ja: '昨日電話した男の子は、私のいとこだ。' },
      { t: 'tip', id: 't-safe', ti: '迷ったら「前置詞＋冠詞＋que」', x: '人でも、ものでも使える**安全運転**の形。\n・`^con^ {quien}` は人だけ\n・`^en^ {que}`（冠詞なし）は、ものの話で短い前置詞のとき',
        why: '冠詞があると、que がどの名詞を指しているかがはっきりする。前置詞のあとに冠詞を入れてまちがいになることは、まずない。' },
      { t: 'drill', n: 5 }
    ]
  },
  {
    id: 'L6', no: 6, day: 3, icon: '📍', ti: 'donde で場所', sub: 'donde ＝ en el que',
    steps: [
      { t: 'say', x: '場所の話なら、もっとカンタンな `{donde}` が使える。' },
      { t: 'ex', es: 'Esta es la [ciudad] {donde} nací.', ja: 'ここが、私の生まれた町だ。' },
      { t: 'ask', pred: true, q: '{donde} を「前置詞＋冠詞＋que」で言いかえると？', es: 'la ciudad donde nací', o: ['en la que', 'con la que', 'la que'], a: 0,
        r: '`{donde}` ＝ `^en^ {la que}`\n「〜で」が、もう中に入っているんだ。' },
      { t: 'fuse', a: 'Fuimos al [parque].', b: 'Jugábamos |en el parque| de niños.', bt: '{donde} jugábamos de niños',
        out: 'Fuimos al [parque] {donde} jugábamos de niños.', ja: '子どものころ遊んだ公園に行った。',
        hint: '「〜で」ごと、かぶっている所をタップ！' },
      { t: 'tip', id: 't-donde', ti: 'donde ＝ en ＋ 冠詞 ＋ que', x: '先行詞が**場所**で「そこ**で**」の意味なら `{donde}` 1語で OK。\n__疑問詞 dónde（どこ）の、アクセントなし版__',
        why: 'donde には「〜で」が入っているので、前に en はふつう要らない。疑問詞の ¿Dónde?（どこで？）と同じ語なので、意味もつかみやすい。' },
      { t: 'ask', pred: true, q: '場所の名詞なら、いつでも donde？', es: 'Visité la ciudad ___ me recomendaste.', o: ['donde', 'que'], a: 1,
        r: 'ここは `{que}`！\nla ciudad は「勧めた」の**目的語**（町**を**）。\n「その町**で**」じゃないから donde は使えない。' },
      { t: 'tip', id: 't-donde-check', ti: '戻してチェック', x: '先行詞を元の文に戻してみる。\n・Nací ^en^ [la ciudad]（町**で**）→ `{donde}`\n・Me recomendaste [la ciudad]（町**を**）→ `{que}`\n__戻して「〜で」なら donde__' },
      { t: 'ask', q: 'どっち？', es: 'El hotel ___ nos quedamos era muy bonito.', o: ['donde', 'que', 'quien'], a: 0,
        why: 'nos quedamos en el hotel（ホテル**に**泊まった）→ donde。' },
      { t: 'ask', q: 'どっち？', es: 'El museo ___ visitamos ayer es famoso.', o: ['donde', 'que'], a: 1,
        why: 'visitamos el museo（博物館**を**訪れた）→ 目的語なので que。' },
      { t: 'drill', n: 5 }
    ]
  },
  /* ================= DAY 4 ================= */
  {
    id: 'L7', no: 7, day: 4, icon: '📦', ti: 'lo que ＝「〜こと」', sub: '先行詞がないとき',
    steps: [
      { t: 'say', x: '先行詞がない！？\nそんなときは `{lo que}`。\n意味は「〜すること」「〜するもの」。' },
      { t: 'ex', es: '{Lo que} quiero es dormir.', ja: '私がしたいのは、寝ることだ。' },
      { t: 'ask', pred: true, q: '「君の言うことがわからない」は？', es: 'No entiendo ___ dices.', o: ['que', 'lo que'], a: 1,
        r: '`{lo que}`！\n「言うこと」の「こと」には名詞がないから、lo が入れ物になる。' },
      { t: 'say', x: '`{lo que}` は英語の what（〜すること）に近い。\n前に名詞がないときに使うよ。' },
      { t: 'tip', id: 't-lo-que', ti: '名詞がなければ lo que', x: '前に名詞がある → `{que}`\n前に名詞がない → `{lo que}`\n__lo は「こと」の入れ物__',
        why: 'lo は「〜なこと」を作る中性の冠詞（lo bueno ＝よいこと）。前に名詞がない分、lo が先行詞の代わりをしている。' },
      { t: 'ask', q: 'どっち？', es: 'Compré el libro ___ me recomendaste.', o: ['que', 'lo que'], a: 0,
        why: '前に名詞（el libro）がある → que。' },
      { t: 'ex', es: 'Te voy a contar todo {lo que} pasó.', ja: '起きたことを、ぜんぶ話してあげるね。' },
      { t: 'tip', id: 't-todo', ti: 'todo lo que ＝「〜することぜんぶ」', x: '`todo {lo que}` ＋ 動詞\n`Gracias por todo {lo que} haces.`\n（いろいろしてくれてありがとう）' },
      { t: 'ask', q: '「これが君のさがしているもの？」', es: '¿Es esto ___ buscas?', o: ['lo que', 'que', 'quien'], a: 0,
        why: '「さがしているもの」の「もの」に当たる名詞がない → lo que。' },
      { t: 'say', x: '前の文の内容ぜんぶを `{lo que}` で受けることもある。\nコンマのあとに来て、「そのこと」の意味。' },
      { t: 'ex', es: 'Llegó tarde, {lo que} me molestó mucho.', ja: '彼は遅れて来た。そのことに、私はとてもイライラした。' },
      { t: 'drill', n: 5 }
    ]
  },
  {
    id: 'L8', no: 8, day: 4, icon: '👉', ti: 'el que ＝「〜するやつ・人」', sub: '名詞を省く',
    steps: [
      { t: 'say', x: '言わなくても分かる名詞は、省いて `{el que}` だけにできる。' },
      { t: 'morph', es: 'Este libro es el |libro| que compré.', out: 'Este libro es {el que} compré.', ja: 'この本が、私の買ったやつだ。',
        hint: 'くり返している名詞をタップして消そう！' },
      { t: 'say', x: 'el は、省いた名詞 libro に合わせた形。\n意味は「〜する**それ**・〜する**やつ**」。' },
      { t: 'ex', es: 'Mis llaves son {las que} están en la mesa.', ja: '私の鍵は、テーブルの上にあるやつだ。' },
      { t: 'ask', q: '「どのシャツが好き？」「アナが着てるやつ」', es: '¿Qué camisa te gusta? —___ lleva Ana.', o: ['La que', 'Lo que', 'Que'], a: 0,
        why: '省いたのは camisa（女性・単数）→ la que。' },
      { t: 'say', x: '人の話なら「〜する**人**」になるよ。' },
      { t: 'ex', es: '{El que} llega tarde paga el café.', ja: '遅れて来た人が、コーヒー代を払う。' },
      { t: 'ex', es: '{Los que} estudian mucho aprueban el examen.', ja: 'たくさん勉強する人たちは、試験に受かる。' },
      { t: 'ask', q: 'どっち？「シャツの中で、いちばん好きなのは青いのだ」', es: 'De todas las camisas, ___ más me gusta es la azul.', o: ['la que', 'lo que'], a: 0,
        why: '省いた名詞 camisa を戻せる → la que。' },
      { t: 'ask', q: 'どっち？「先生の言うことが分からない」', es: 'No entiendo ___ dice el profesor.', o: ['el que', 'lo que'], a: 1,
        why: '戻せる名詞がない「こと」→ lo que。' },
      { t: 'tip', id: 't-el-lo', ti: 'el que と lo que の見分け', x: '省いた名詞を**戻せる** → `{el / la / los / las que}`\n戻せる名詞がない「こと」 → `{lo que}`\n__名詞を戻してみる__',
        why: 'el・la・los・las は名詞の性・数を持っている。だから、戻せる名詞があるときだけ使える。lo は性も数もない「こと」の入れ物。' },
      { t: 'drill', n: 5 }
    ]
  },
  /* ================= DAY 5 ================= */
  {
    id: 'L9', no: 9, day: 5, icon: '🕵️', ti: 'que の正体を見破れ', sub: '関係詞？接続詞？疑問詞？',
    steps: [
      { t: 'say', x: 'テストでよく狙われるのが、que の**正体当て**。\n同じ「que」でも、仕事が3つあるんだ。' },
      { t: 'ex', es: 'El [libro] {que} leo es interesante.', ja: '私が読んでいる本は、おもしろい。' },
      { t: 'ask', pred: true, q: '後ろの leo（私は読む）。「何を」読むかは書いてある？', o: ['書いてない（穴がある）', '書いてある'], a: 0,
        r: '① **関係詞**の que。\n前に名詞があって、後ろの文は名詞が1つ**欠けて**いる。\nその穴に入るのが先行詞の libro。' },
      { t: 'ex', es: 'Creo que Ana tiene razón.', ja: 'アナの言うとおりだと思う。' },
      { t: 'ask', pred: true, q: '後ろの Ana tiene razón。それだけで文になってる？', o: ['なってる', '穴がある'], a: 0,
        r: '② **接続詞**「〜ということ」。\n前は動詞（creo）で、後ろは**そろった文**。' },
      { t: 'ex', es: '¿Qué quieres?', ja: '何がほしいの？' },
      { t: 'say', x: '③ **疑問詞**「何」。アクセント記号つきの **qué**。' },
      { t: 'tip', id: 't-que3', ti: 'que の正体チェック', x: '・**qué**（アクセントあり）→ 疑問詞「何」\n・前が名詞＋後ろに**穴** → 関係詞\n・前が動詞（creo, dice, sé…）＋後ろが**そろった文**\n　→ 接続詞「〜ということ」',
        why: '関係詞の que は名詞の代わりなので、後ろの文から名詞が1つ抜けている。接続詞の que は文と文をつなぐだけなので、後ろは完全な文になる。' },
      { t: 'q', id: 'l9-wh1' },
      { t: 'q', id: 'l9-wh2' },
      { t: 'ask', q: '「何をしたらいいか分からない」', es: 'No sé ___ hacer.', o: ['qué', 'que'], a: 0,
        why: '「何を」の意味なら、文の途中でもアクセントつきの qué。' },
      { t: 'say', x: 'donde も同じ。\n「どこ？」の疑問なら **dónde**、場所の関係詞なら **donde**。' },
      { t: 'ask', q: 'どっち？', es: '¿___ vives?', o: ['Dónde', 'Donde'], a: 0, why: '「どこに住んでいるの？」という質問 → アクセントつき。' },
      { t: 'drill', n: 5 }
    ]
  },
  {
    id: 'L10', no: 10, day: 5, icon: '👑', ti: 'cuyo ＝「その〜が」', sub: '読めれば合格・書き言葉の仲間',
    steps: [
      { t: 'say', x: 'ラスボス前、最後の新キャラ `{cuyo}`。\n意味は「その人の〜が」「それの〜が」。' },
      { t: 'ex', es: 'Tengo un [amigo] {cuyo} padre es piloto.', ja: 'お父さんがパイロットの友だちがいる。' },
      { t: 'say', x: 'un amigo ＋ su padre es piloto\n→ su（彼の）が `{cuyo}` に変身した、と考えるといい。' },
      { t: 'ask', pred: true, q: 'cuyo は何に合わせて形が変わる？', es: 'Tengo una amiga ___ hermanos viven en París.', o: ['cuyos（hermanos に合わせる）', 'cuya（amiga に合わせる）'], a: 0,
        r: '後ろの**持ち物**（hermanos）に合わせて `{cuyos}`。\n持ち主（amiga）じゃないよ。' },
      { t: 'tip', id: 't-cuyo', ti: 'cuyo は「持ち物」に合わせる', x: '`{cuyo} / {cuya} / {cuyos} / {cuyas}`\n直後の名詞（持ち物）の性・数に合わせる。\n__nuestra casa の nuestra と同じ発想__',
        why: 'nuestro（私たちの）も、nuestra casa のように持ち物の casa に合わせて形を変えるよね。cuyo も「〜の」という持ち主を表す語なので、同じきまりになる。' },
      { t: 'ask', q: 'どれ？', es: 'Es un chico ___ madre es médica.', o: ['cuyo', 'cuya', 'que su'], a: 1,
        why: '持ち物 madre（女性・単数）→ cuya。' },
      { t: 'say', x: '会話ではあまり使わないけど、文章ではよく見る。\n**見て意味が取れれば合格**だよ。' },
      { t: 'tip', id: 't-cual', ti: '書き言葉の仲間：el cual', x: '`{el cual}` `{la cual}` `{lo cual}` …\nel que・lo que の書き言葉版。見かけたら同じ意味で読めば OK。' },
      { t: 'ex', es: 'Llegó tarde, {lo cual} me molestó.', ja: '彼は遅れて来た。そのことに、私はイライラした。' },
      { t: 'drill', n: 5 }
    ]
  }
];

/* ボス：前のレッスン2つ分（FINAL は全部）から出題。HP は問題数で決まる */
RQ.bosses = [
  { id: 'B1', after: 'L2', day: 1, from: ['L1', 'L2'], name: 'ショウリャク・ゴースト', en: 'GHOST OMITO', face: '👻', col: '#9fb4ff',
    line: 'que なんて…はぶいちゃえよ…英語みたいにさァ…', n: 8 },
  { id: 'B2', after: 'L4', day: 2, from: ['L3', 'L4'], name: 'プレポ・ゴーレム', en: 'PREPO GOLEM', face: '🗿', col: '#ffd23f',
    line: '前置詞ハ…後ロニ…置イテイケ……', n: 8 },
  { id: 'B3', after: 'L6', day: 3, from: ['L5', 'L6'], name: 'カンシ・ツインズ', en: 'EL & LA', face: '👯', col: '#7dffb0',
    line: 'エルかラか、ロスかラスか…当ててごらん♪', n: 8 },
  { id: 'B4', after: 'L8', day: 4, from: ['L7', 'L8'], name: 'ロケ・ファントム', en: 'LOQUE PHANTOM', face: '🎭', col: '#d58bff',
    line: '名詞は…どこへ消えたのかな……？', n: 8 },
  { id: 'B5', after: 'L10', day: 5, final: true, from: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10'], name: 'エル・ヘフェ・クーヨ', en: 'EL JEFE CUYO', face: '👑', col: '#ff5fa2',
    line: 'すべての関係詞を…わがものに……！', n: 14 }
];

/* 用語ヘルプ（日本語の説明文に出たら点線。タップでバルーン） */
RQ.gloss = {
  '関係詞': '2つの文をつなぐ語。名詞の後ろに説明をつける（que・quien・donde など）。',
  '先行詞': '関係詞が説明している名詞。関係詞より「先に」出てくるので先行詞。',
  '前置詞': 'a・de・en・con など、名詞の前に置いて「〜に」「〜の」「〜で」「〜と」を表す語。',
  '冠詞': 'el・la・los・las（その）や un・una（ある）。名詞の性・数に合わせて形が変わる。',
  '性・数': '名詞の性（男性・女性）と数（単数・複数）。冠詞や形容詞はこれに合わせて形が変わる。',
  '接続詞': '文と文をつなぐ語。que は「〜ということ」の意味の接続詞にもなる（Creo que…）。',
  '疑問詞': '質問に使う語。qué（何）・dónde（どこ）・quién（だれ）。アクセント記号がつく。',
  '主語': '文の「〜が・〜は」に当たる語。',
  '目的語': '文の「〜を」「〜に」に当たる語。',
  '中性': '男性でも女性でもない形。lo は「〜なこと」を作る中性の冠詞。'
};

/* 7日間のめやす（1日30分） */
RQ.days = [
  { d: 1, ti: 'que の基本', x: 'L1・L2 → ボス1' },
  { d: 2, ti: 'quien と前置詞', x: 'L3・L4 → ボス2・復習' },
  { d: 3, ti: '冠詞と donde', x: 'L5・L6 → ボス3・復習' },
  { d: 4, ti: 'lo que・el que', x: 'L7・L8 → ボス4・復習' },
  { d: 5, ti: '見分けと cuyo', x: 'L9・L10 → ラスボス' },
  { d: 6, ti: '総復習', x: '復習・ラッシュ・苦手つぶし' },
  { d: 7, ti: '仕上げ', x: 'ラスボスに S ランクで勝つ' }
];
