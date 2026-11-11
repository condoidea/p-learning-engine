/* =========================================================
 * ¿QUÉ SERÁ? — レッスン（台本：L1〜L12、ボス3）
 *
 *  占い館の見習い予言者（学ぶ人）が、師匠の黒ネコ・ルナに教わりながら、お客の相談に水晶玉で予言する。
 *  日めくりをめくると答え合わせの日が来る。当たると館の評判（⭐）が上がり、館が育つ。
 *  ルナのセリフは who なしの say。お客は say の who で。
 *  DAY1 L1・L2 / DAY2 L3・L4（ボス1）/ DAY3 L5・L6 / DAY4 L7（ボス2）/ DAY5 L8・L9 / DAY6 L10・L11 / DAY7 L12（ラスボス）
 *  使った語は、ぜんぶ shared/es-words.js に登録する（tests/check-futuro.js --words で、ない語を調べる）。
 *
 *  日本語の文の書き方
 *    **…**   覚えること（マーカー）
 *    __…__   覚え方のヒント（💡波線）
 *    ((…))   この教材での呼び方・約束（グレー）
 *    `…`     スペイン語（中で下の色分けが使える）
 *    \n      改行（1つの吹き出しに1つのこと。1行は全角18字くらい、長くても22字）
 *
 *  スペイン語の色分け（どの画面でも同じ色）
 *    {hablaré}   習っている動詞の形（金色）
 *    [Mañana]    時の手がかりの語（水色：mañana・ayer・dijo que など）
 *    ^é^         変わった所（ピンク。語の中で）。L1・L2・L5 は新しくつく語尾、L3 以降は変わった芯（{^podr^é}）
 *
 *  ステップ（manda と同じもの）
 *    say    { x, more, who }                  ルナ（who があればお客）が話す。more があると「🤔 なんで？」で補足
 *    show   { tbl: [[左, 右], …], cap }        ボード（表・例文）を出す。次のボードが出るまで残る
 *    ask    { q, o, a, pred, r, why }          問い。pred:true は予想（採点しない）。a が正解の番号
 *    forge  { w, cut, add, o, out, ja, hint }  語の形を作る：w の最後の cut をタップで消す（cut:'' なら消さない）→ o から add を選ぶ → out
 *    tip    { id, ti, x, why }                  TIP カード（Tips ノートに入る。why を必ず）
 *    map    { hi: ['fut-s'], x }                時間の地図に hi のマスを光らせる。x はルナの一言（hi は FQ.map.cells の id）
 *    q      { id }                              問題バンクの1問
 *    drill  { n }                               このレッスンの問題から n 問
 *  新しいステップ
 *    flip    { a, ja_a, b, ja_b, day_a, day_b, o, ans, hint, why }   🗓 日めくり。o があれば、めくったあと b の {…} を選ばせる
 *    orb     { who, need, see:{e,x}, o, a, out, ja, fx, why }        🔮 水晶玉。お客の相談 → 玉に映るもの → 予言を選ぶ
 *    tapwhen { es, ja, a, why }                                      いつの話？ 文を見て、地図のマス（a は cell の id）をタップ
 *
 *  書き方の約束（ユーザーの指摘）
 *    ・形の作り方のルールは、1つの形に1つだけ。未来＝原形に語尾。過去未来＝未来と同じ芯に語尾 ía。
 *      不規則は「芯が変わる（語尾は同じ）」だけ。別の覚え方は本文に書かない（why に1回だけ：L1 の haber、L5 の線過去）
 *    ・見る → 根拠 → 結論 → 名前の順。名前（未来・芯・過去未来）は最後につける
 *    ・「いま」の形は、未来の手がかり（mañana など）があると正しい文になるので、選択肢のダミーに使わない
 *
 *  例文・説明はこのアプリのためのオリジナル。
 *
 * ========================================================= */
window.FQ = window.FQ || {};

/* 占い館の人たち（場面に出る） */
FQ.people = {
  luna:    { e: '🐈‍⬛', n: 'ルナ', d: '師匠の黒ネコ。占い館のあるじ' },
  rosa:    { e: '👩‍🌾', n: '花屋のロサ', d: '天気がいつも気になる' },
  beto:    { e: '👦', n: 'ベト', d: 'サッカーと試験のことで頭がいっぱいの少年' },
  carmen:  { e: '👵', n: 'カルメンおばあさん', d: '遠くに住む孫が気がかり' },
  hugo:    { e: '🧑‍🍳', n: 'パン職人ウーゴ', d: '店と恋の相談が多い' },
  capitan: { e: '🧔‍♂️', n: '船長', d: '港の船長。航海の前に必ず来る' },
  duda:    { e: '🕵️', n: 'うたぐり屋のドゥーダ', d: '予言を信じない評論家。ボスとして来る' }
};

FQ.days = [
  { d: 1, ti: 'はじめての予言', x: '未来（原形に語尾をつける）・「いつ」を表す語' },
  { d: 2, ti: '形が変わる芯', x: '芯が変わる動詞（e が落ちる・d が入る・短くなる）＋ ボス' },
  { d: 3, ti: '予言の帳簿', x: '過去未来（あの日から見た先）・やんわり言う' },
  { d: 4, ti: 'くもった水晶玉', x: '推量（現在の推量は未来、過去の推量は過去未来）＋ ボス' },
  { d: 5, ti: '済んだこと', x: '過去分詞・現在完了・過去完了' },
  { d: 6, ti: '先まわりと最中', x: '未来完了・進行形' },
  { d: 7, ti: '時間の地図', x: '総まとめ ＋ ラスボス' }
];

/* 時間の地図（ボードに出す全体図）。rows＝時のよこ軸（いま・あの日・これから・あの日から見た先。sh はしぼった地図で使う短い名前）、cols＝そのとき・済んだ・最中。
   cell の L はそのマスを教えるレッスン番号（no）。given:true は最初から開いている。op は作り方、ex の {…} は習っている形（金色）。
   notes は、いくつかのマスにまたがる「ひとこと」（芯・過去分詞・現在分詞）。at はそれが関わるマス */
FQ.map = {
  rows: [
    { id: 'now',  ti: 'いま', sh: 'いま' },
    { id: 'past', ti: 'あの日（過去）', sh: 'あの日' },
    { id: 'fut',  ti: 'これから', sh: 'これから' },
    { id: 'cond', ti: 'あの日から見た先', sh: 'あの日の先' }
  ],
  cols: [
    { id: 's', ti: 'そのとき' },
    { id: 'p', ti: 'それまでに済んだ', sub: 'haber ＋ 過去分詞' },
    { id: 'g', ti: 'その最中', sub: 'estar ＋ 現在分詞' }
  ],
  cells: [
    { id: 'now-s',  r: 'now',  c: 's', given: true, name: '現在', ex: 'hago' },
    { id: 'past-s', r: 'past', c: 's', given: true, name: '点過去・線過去', ex: 'hice・hacía' },
    { id: 'fut-s',  r: 'fut',  c: 's', L: 1, name: '未来', op: '原形 ＋ é・ás・á・emos・éis・án', ex: '{haré}' },
    { id: 'cond-s', r: 'cond', c: 's', L: 5, name: '過去未来', op: '未来と同じ芯 ＋ ía・ías・ía・íamos・íais・ían', ex: '{haría}' },
    { id: 'now-p',  r: 'now',  c: 'p', L: 8, name: '現在完了', op: 'he ＋ 過去分詞', ex: '{he hecho}' },
    { id: 'past-p', r: 'past', c: 'p', L: 9, name: '過去完了', op: 'había ＋ 過去分詞', ex: '{había hecho}' },
    { id: 'fut-p',  r: 'fut',  c: 'p', L: 10, name: '未来完了', op: 'habré ＋ 過去分詞', ex: '{habré hecho}' },
    { id: 'now-g',  r: 'now',  c: 'g', L: 11, name: '現在進行', op: 'estoy ＋ 現在分詞', ex: '{estoy haciendo}' },
    { id: 'past-g', r: 'past', c: 'g', L: 11, name: '過去進行', op: 'estaba ＋ 現在分詞', ex: '{estaba haciendo}' },
    { id: 'fut-g',  r: 'fut',  c: 'g', L: 11, name: '未来進行', op: 'estaré ＋ 現在分詞', ex: '{estaré haciendo}' }
  ],
  notes: [
    { id: 'stems', L: 3, at: ['fut-s', 'cond-s'], ti: '形が変わる芯', ex: 'podr-・sabr-・habr-・querr-／tendr-・pondr-・saldr-・vendr-／dir-・har-' },
    { id: 'pp',    L: 8, at: ['now-p', 'past-p', 'fut-p'], ti: '過去分詞', ex: '-ado・-ido／hecho・dicho・visto・escrito・puesto・vuelto・abierto' },
    { id: 'ger',   L: 11, at: ['now-g', 'past-g', 'fut-g'], ti: '現在分詞', ex: '-ando・-iendo' }
  ]
};

FQ.lessons = (FQ.lessons || []).concat([
  /* ================= DAY 1 ================= */
  {
    id: 'L1', no: 1, day: 1, icon: '🔮', ti: 'はじめての予言', sub: '未来（原形に語尾をつける）',
    ev: { who: 'rosa', line: '見習いさん、あしたのお天気、わかる？' },
    actors: ['rosa'],
    steps: [
      { t: 'say', x: 'ようこそ、占い館へ。にゃ。\nワタシは師匠のルナ。\nきみは今日から見習い予言者だよ🔮\n今日は、原形から「予言の形」を作ろう。' },
      { t: 'say', who: 'rosa', x: 'こんにちは、花屋のロサよ。\nあしたの天気が気になって…\n水晶玉で見てくださる？' },
      { t: 'show', cap: '水晶玉に映った「あした、（私は）〜するだろう」', tbl: [['hablar（話す）', '{hablar^é^}'], ['comer（食べる）', '{comer^é^}'], ['vivir（住む）', '{vivir^é^}']] },
      { t: 'ask', pred: true, q: '3つとも、原形はどうなっている？', o: ['r が é に変わった', 'うしろに é がついた', 'ar・er・ir で形がちがう'], a: 1,
        r: 'そのとおり！\n原形はそのまま。\n**うしろに é をつける**だけ。\n-ar・-er・-ir のどれでも同じだよ。' },
      { t: 'forge', w: 'hablar', cut: '', add: 'é', o: ['é', 'o', 'aba'], out: '{hablar^é^}', ja: '（私は）話すだろう', hint: '原形のうしろに、つける文字を選んで！' },
      { t: 'forge', w: 'comer', cut: '', add: 'é', o: ['é', 'í', 'o'], out: '{comer^é^}', ja: '（私は）食べるだろう', hint: '`comer` も、うしろにつける文字を選んで！' },
      { t: 'say', x: '主語が変わると、語尾も変わる。\n`hablar` を、6人ぶん見てみよう。' },
      { t: 'show', cap: 'hablar の「〜するだろう」', tbl: [['yo（私は）', 'hablar^é^'], ['tú（君は）', 'hablar^ás^'], ['él・ella・usted', 'hablar^á^'], ['nosotros（私たち）', 'hablar^emos^'], ['vosotros（君たち）', 'hablar^éis^'], ['ellos・ellas・ustedes', 'hablar^án^']] },
      { t: 'ask', pred: true, q: '6つの語尾のうち、\n強く読む印（´）がつかないのは？', o: ['é', 'emos', 'án'], a: 1,
        r: '`emos` だけ、´ がつかない。\nほかの5つには、´ がつくよ。' },
      { t: 'forge', w: 'hablar', cut: '', add: 'ás', o: ['ás', 'as', 'és'], out: '{hablar^ás^}', ja: '（君は）話すだろう', hint: '「君は」の語尾を選んで！' },
      { t: 'map', hi: ['fut-s'], x: 'いま見つけたきまりを、地図に書きこもう。\n出発は原形。この形の名前は「未来」だよ。' },
      { t: 'say', x: '`llover`（雨がふる）は、\nいつも「それは」の語尾 `á` で使うよ。\nさあ、あしたの空を見てみよう。' },
      { t: 'orb', who: 'rosa', need: 'あしたの天気、どうかしら？\n洗たく物が気になって…', see: { e: '🌧', x: 'あしたの空に、雨雲が見える' },
        o: ['Mañana lloverá.', 'Ahora llueve.', 'Ayer llovió.'], a: 0, out: '[Mañana] {llover^á^}.', ja: 'あした、雨がふるでしょう。', fx: { e: '☔', mood: '😮' },
        why: 'あしたの話。`llover` の原形のうしろに、「それは」の語尾 `á` をつけて `{lloverá}`。`llueve` はいまの形、`llovió` は過去の形。' },
      { t: 'say', x: 'さあ、日めくりをめくってみよう。\n予言は当たったかな？' },
      { t: 'flip', a: '[Mañana] {lloverá}.', ja_a: 'あした、雨がふるでしょう。', b: '[Ayer] {llovió}.', ja_b: 'きのう、雨がふった。', day_a: 'きょう', day_b: 'つぎの日' },
      { t: 'say', who: 'rosa', x: '当たったわ！ 洗たく物を\n取りこんでおいて、よかった。\nありがとう！' },
      { t: 'tip', id: 't-fut', ti: '未来 ＝ 原形 ＋ é・ás・á・emos・éis・án', x: '`hablar` → `{hablaré}`\n`comer` → `{comeré}`\n`vivir` → `{viviré}`\n__´ がつかないのは emos だけ__',
        why: '原形に語尾をつけるだけなので、-ar・-er・-ir の区別がいらない。ちなみに、この語尾はもともと、原形のうしろに haber（持つ）の「今」の形（he・has・ha・hemos・habéis・han）がくっついてできたもの。だから語尾の形が、それに似ている。' },
      { t: 'ask', q: '「来年、私たちはここに住むだろう」の\n`vivir` の形は？', o: ['viviremos', 'vivimos', 'viviréis'], a: 0,
        why: '`vivir` の原形に、nosotros（私たち）の語尾 `emos` で `{viviremos}`。`viviréis` は vosotros。' },
      { t: 'drill', n: 4 }
    ]
  },
  {
    id: 'L2', no: 2, day: 1, icon: '📅', ti: '予言を広げる', sub: '主語いろいろ・「いつ」を表す語',
    ev: { who: 'beto', line: 'ぼく、あしたも、あさっても、大事な日なんだ！' },
    actors: ['beto', 'carmen'],
    steps: [
      { t: 'map', hi: ['fut-s'], x: 'きのうの続き。出発は原形。\n今日は、主語をかえて、\n「いつ」を言う語も足すよ。' },
      { t: 'say', who: 'beto', x: 'ぼく、ベト！ あしたはサッカーの試合。\nあさっては国語の試験なんだ。\nどっちも心配で…' },
      { t: 'show', cap: 'これから先の「いつ」を言う語', tbl: [['[mañana]', 'あした'], ['[la semana que viene]', '来週'], ['[el año que viene]', '来年']] },
      { t: 'orb', who: 'beto', need: 'あしたの試合、\nぼくのチームのみんなは\n勝てるかな？', see: { e: '⚽', x: 'チームの全員が、ゴールを見つめている' },
        o: ['Mañana ganarán el partido.', 'Mañana ganará el partido.', 'Ayer ganaron el partido.'], a: 0, out: '[Mañana] {ganar^án^} el partido.', ja: 'あした、みんなは試合に勝つでしょう。', fx: { e: '🏆', mood: '😆' },
        why: 'あしたの話。選手みんな（ellos）なので、語尾は `án`。`ganará` は1人（él）の語尾、`ganaron` は過去の形。' },
      { t: 'ask', pred: true, q: 'ベトの試験は「あさって」。\nスペイン語では、どう言うと思う？', o: ['antes de mañana', 'mañana por la tarde', 'pasado mañana'], a: 2,
        r: '`[pasado mañana]`！\npasado は「過ぎた」。\n「あしたを過ぎた日」が、あさってだよ。' },
      { t: 'orb', who: 'beto', need: 'あさっての国語の試験。\nぼく、ちゃんと書けるかな…', see: { e: '✏️', x: 'ベトが、えんぴつをにぎりしめている' },
        o: ['Pasado mañana escribirás bien.', 'Pasado mañana escribirá bien.', 'Ayer escribiste bien.'], a: 0, out: '[Pasado mañana] {escribir^ás^} bien.', ja: 'あさって、君はうまく書けるでしょう。', fx: { e: '💯', mood: '😊' },
        why: 'ベトに話しかけるので、tú の語尾 `ás`。`escribirá` は「彼は」、`escribiste` は過去の形。' },
      { t: 'ask', pred: true, q: '試験の前の夜、ベトは早く寝る？\n「君は寝るだろう」。\n`dormir` のいまの形は `duermes`。\n予言の形は？', o: ['duermirás', 'duermás', 'dormirás'], a: 2,
        r: '`{dormirás}`！\n原形から作るから、\nue は出てこないよ。' },
      { t: 'say', who: 'carmen', x: 'わたしはカルメン。\n遠くに住む孫のマルタが、\nいつ来るのか気がかりでねえ…' },
      { t: 'show', cap: '「いつ」を言う、もう2つ', tbl: [['[dentro de] dos días', '2日後に'], ['[algún día]', 'いつか']] },
      { t: 'orb', who: 'carmen', need: 'マルタは、いつ着くのかねえ？', see: { e: '🚆', x: '列車が、駅へ近づいてくる' },
        o: ['Marta llegará dentro de dos días.', 'Marta llegó dentro de dos días.', 'Marta llegaba dentro de dos días.'], a: 0, out: 'Marta {llegar^á^} [dentro de] dos días.', ja: 'マルタは、2日後に着くでしょう。', fx: { e: '🚆', mood: '🥰' },
        why: '`dentro de dos días` は先の話。`llegar` の原形に、「彼女は」の語尾 `á`。`llegó`・`llegaba` は過去の形。' },
      { t: 'orb', who: 'carmen', need: 'マルタは、いつかこの町に\n住んでくれるかねえ…', see: { e: '🏡', x: '玉の中に、小さな家が見える' },
        o: ['Algún día Marta vivirá aquí.', 'Algún día Marta vivirás aquí.', 'Algún día Marta viviré aquí.'], a: 0, out: '[Algún día] Marta {vivir^á^} aquí.', ja: 'いつか、マルタはここに住むでしょう。', fx: { e: '🏡', mood: '😊' },
        why: 'マルタは3人称（ella）なので `á`。`vivirás` は tú、`viviré` は yo の語尾。' },
      { t: 'say', x: 'さあ、日めくり！\nベトの試合は、どうなったかな？' },
      { t: 'flip', a: '[Mañana] {ganarán} el partido.', ja_a: 'あした、みんなは試合に勝つでしょう。', b: '[Ayer] {ganaron} el partido.', ja_b: 'きのう、みんなは試合に勝った。', day_a: 'きょう', day_b: 'つぎの日' },
      { t: 'tip', id: 't-when', ti: '予言の文は「いつ」の語といっしょに', x: '`[mañana]` あした\n`[pasado mañana]` あさって\n`[la semana que viene]` 来週\n`[el año que viene]` 来年\n`[dentro de]` 〜後に\n`[algún día]` いつか',
        why: '「いつ」がはっきりすると、これから先の話だと一目でわかる。未来の形の文は、こうした語といっしょに出ることが多い。' },
      { t: 'ask', q: '「来年、私たちは踊るだろう」の\n`bailar` の形は？', o: ['bailaremos', 'bailamos', 'bailaréis'], a: 0,
        why: '`bailar` の原形に、nosotros の語尾 `emos` で `{bailaremos}`。`bailaréis` は vosotros。' },
      { t: 'drill', n: 5 }
    ]
  },
  /* ================= DAY 2 ================= */
  {
    id: 'L3', no: 3, day: 2, icon: '✂️', ti: '形が変わる芯①', sub: 'e が落ちる（poder・saber・haber・querer）',
    ev: { who: 'beto', line: 'ルナ先生ー！ ぼく、足をけがしちゃった…' },
    actors: ['beto', 'carmen'],
    steps: [
      { t: 'map', hi: ['fut-s'], x: '今日も、出発は原形。\nでも、土台が変わる動詞がある。\n今日は、原形から土台を作るよ。' },
      { t: 'say', who: 'beto', x: 'ルナ先生ー！ ぼく、足をけがしちゃった。\nあさっての決勝、出られるかな…' },
      { t: 'show', cap: '「（私は）〜だろう」', tbl: [['poder（できる）', '{^podr^é}'], ['saber（知っている）', '{^sabr^é}'], ['querer（ほしい・したい）', '{^querr^é}']] },
      { t: 'ask', pred: true, q: '原形とくらべて。\nどこが変わった？', o: ['-er が -ir に変わった', '-er の e が消えた', '語尾に s がついた'], a: 1,
        r: '**-er の e が落ちて**、r がつまる。\n語尾の é は、ふつうの未来と同じだね。' },
      { t: 'say', x: '語尾をつける土台を、((芯))と呼ぶよ。\nふつうは原形のまま。\nこの3つは、芯が `podr-` のように変わる。',
        more: '`poderé` より `podré` のほうが言いやすいから。よく使う動詞は、言いやすい短い形になっていったんだ。saber・querer も同じ。' },
      { t: 'forge', w: 'poder', cut: 'er', add: 'ré', o: ['ré', 'é', 'rá'], out: '{^podr^é}', ja: '（私は）できるだろう', hint: '`poder` から、消える文字をタップ！ そのあと足す文字を選ぶよ' },
      { t: 'orb', who: 'beto', need: 'あさっての決勝、\n足が痛いけど…出られるかな？', see: { e: '🦶', x: '足のほうたいが、ほどけかけている' },
        o: ['Pasado mañana podrás jugar.', 'Pasado mañana poderás jugar.', 'Ayer pudiste jugar.'], a: 0, out: '[Pasado mañana] {^podr^ás} jugar.', ja: 'あさって、君は出られるでしょう。', fx: { e: '⚽', mood: '😆' },
        why: 'ベトに話しかけるので、語尾は `ás`。芯は `podr-`。`poderás` は原形のままで作った形で、ない。`pudiste` は過去の形。' },
      { t: 'ask', q: '`saber`（知っている）。\n「（私は）知るだろう」は？', o: ['sabré', 'saberé', 'sabé'], a: 0,
        why: '芯は `sabr-`（e が落ちる）。語尾 `é` をつけて `{sabré}`。`saberé` は原形のままで作った形。' },
      { t: 'say', who: 'carmen', x: 'ルナさん、孫のマルタのことでねえ。\nわたしに会いたがっているかのう…' },
      { t: 'orb', who: 'carmen', need: 'マルタは、わたしと\n話したがっているかねえ？', see: { e: '💌', x: '玉の中で、マルタが手紙を書いている' },
        o: ['Marta querrá hablar con usted.', 'Marta quererá hablar con usted.', 'Marta quiso hablar con usted.'], a: 0, out: 'Marta {^querr^á} hablar con usted.', ja: 'マルタは、あなたと話したがるでしょう。', fx: { e: '💌', mood: '🥰' },
        why: '`querer` の芯は `querr-`（e が落ちて r が2つ）。「彼女は」の語尾 `á`。`quererá` は原形のままで作った形で、ない。' },
      { t: 'ask', pred: true, q: '`hay`（〜がある）は `haber` の形。\nhaber も -er の動詞。\n「〜があるだろう」は？', o: ['haberá', 'habrán', 'habrá'], a: 2,
        r: '`{habrá}`！\n「あるだろう」は、これ1つだけ。\nたくさんあっても、habrá のままだよ。' },
      { t: 'orb', who: 'beto', need: 'あした、学校で\nなにかあるかな？', see: { e: '🎈', x: '学校の庭に、風船が見える' },
        o: ['Mañana habrá una fiesta en la escuela.', 'Mañana haberá una fiesta en la escuela.', 'Mañana había una fiesta en la escuela.'], a: 0, out: '[Mañana] {^habr^á} una fiesta en la escuela.', ja: 'あした、学校でパーティーがあるでしょう。', fx: { e: '🎉', mood: '🤩' },
        why: '「あるだろう」は `{habrá}`。`haberá` は原形のままで作った形で、ない。`había` は過去の形。' },
      { t: 'map', hi: ['fut-s'], x: 'いま見つけたきまりを、地図に書きこもう。\n芯が変わる動詞の、1つめだよ。' },
      { t: 'tip', id: 't-stem-e', ti: '芯が変わる①：e が落ちる4つ', x: '`poder` → `{podré}`（podr-）\n`saber` → `{sabré}`（sabr-）\n`haber` → `{habrá}`（habr-）\n`querer` → `{querré}`（querr-）\n語尾は、ふつうの未来と同じ。',
        why: 'どれも毎日のように使う動詞。使うたびに、言いにくい形は言いやすい形にけずられていった。`poderé` より `podré` のほうが言いやすいね。' },
      { t: 'ask', q: '「（私たちは）できるだろう」の\n`poder` の形は？', o: ['podremos', 'poderemos', 'podemos'], a: 0,
        why: '芯は `podr-`。nosotros の語尾 `emos` をつけて `{podremos}`。`poderemos` は原形のままで作った形。' },
      { t: 'drill', n: 5 }
    ]
  },
  {
    id: 'L4', no: 4, day: 2, icon: '🧩', ti: '形が変わる芯②', sub: 'd が入る（tener・poner・salir・venir）／短くなる（decir・hacer）',
    ev: { who: 'hugo', line: 'ルナさん、店のことも、恋のことも…！' },
    actors: ['hugo', 'capitan'],
    steps: [
      { t: 'map', hi: ['fut-s'], x: '前の日の続き。今日も、原形から芯を作る。\n別の動詞たちを見てみよう。' },
      { t: 'say', who: 'hugo', x: 'こんにちは、パン職人のウーゴです。\n店のことも、恋のことも、\n占ってほしくて…' },
      { t: 'show', cap: '「（私は）〜だろう」', tbl: [['tener（持つ）', '{^tendr^é}'], ['poner（置く）', '{^pondr^é}'], ['salir（出る）', '{^saldr^é}'], ['venir（来る）', '{^vendr^é}']] },
      { t: 'ask', pred: true, q: '原形とくらべて。\n芯のどこが変わった？', o: ['e・i が落ちただけ', '最後に s がついた', 'e・i のかわりに d が入った'], a: 2,
        r: '芯に **d が入る**んだ。\n（-er・-ir の e・i のかわりに d）\n語尾の é は、ふつうの未来と同じ。' },
      { t: 'say', x: 'この4つは、芯が `tendr-` のように変わる。\nどれも、語尾はふつうの未来のまま。',
        more: 'e・i が落ちると `tenr-` のように n と r が続いて、言いにくい。そこに d が入って `tendr-` になったんだ。salir の `saldr-` も同じだよ。' },
      { t: 'forge', w: 'tener', cut: 'er', add: 'dré', o: ['dré', 'ré', 'é'], out: '{^tendr^é}', ja: '（私は）持つだろう', hint: '`tener` から、消える文字をタップ！ そのあと足す文字を選ぶよ' },
      { t: 'orb', who: 'hugo', need: 'あしたの店、\n忙しくなるかな？', see: { e: '🥖', x: '店の前に、長い行列が見える' },
        o: ['Mañana tendrás mucho trabajo.', 'Mañana tenerás mucho trabajo.', 'Mañana tendré mucho trabajo.'], a: 0, out: '[Mañana] {^tendr^ás} mucho trabajo.', ja: 'あした、君は仕事がたくさんあるでしょう。', fx: { e: '🥖', mood: '😅' },
        why: 'ウーゴに話しかけるので、tú の語尾 `ás`。芯は `tendr-`。`tenerás` は原形のままで作った形。`tendré` は yo の語尾で、自分のことになる。' },
      { t: 'ask', q: '`salir`（出る）。\n「（私は）出るだろう」は？', o: ['saldré', 'salré', 'saliré'], a: 0,
        why: '芯は `saldr-`（i のかわりに d）。語尾 `é` をつけて `{saldré}`。`salré` は e が落ちるだけのつもりで作った形。' },
      { t: 'say', who: 'hugo', x: 'じつは、毎朝パンを買いに来る人が\n気になっていて…\nあしたも来てくれるかな？' },
      { t: 'orb', who: 'hugo', need: 'あの人は、あした\n店に来てくれるかな？', see: { e: '💐', x: '玉の中で、花たばを持った人が歩いている' },
        o: ['Mañana ella vendrá a la tienda.', 'Mañana ella venirá a la tienda.', 'Ayer ella vino a la tienda.'], a: 0, out: '[Mañana] ella {^vendr^á} a la tienda.', ja: 'あした、彼女は店に来るでしょう。', fx: { e: '💐', mood: '🥰' },
        why: '`venir` の芯は `vendr-`。「彼女は」の語尾 `á`。`venirá` は原形のままで作った形で、ない。`vino` は過去の形。' },
      { t: 'show', cap: 'もう2つ。「（私は）〜だろう」', tbl: [['decir（言う）', '{^dir^é}'], ['hacer（する・作る）', '{^har^é}']] },
      { t: 'ask', pred: true, q: '原形とくらべて。\nどこが落ちた？', o: ['最後の r が落ちた', '真ん中がごっそり落ちた', 'd が入った'], a: 1,
        r: 'そう！\n**decir は dir-**\n**hacer は har-**\nこの2つは d も入らず、短くなる。\n毎日使うので、短い形で覚えよう。' },
      { t: 'forge', w: 'hacer', cut: 'cer', add: 'ré', o: ['ré', 'dré', 'cé'], out: '{^har^é}', ja: '（私は）するだろう', hint: '`hacer` から、消える文字をタップ！ そのあと足す文字を選ぶよ' },
      { t: 'say', who: 'capitan', x: 'わしは船長だ。\n航海の前には、必ずここへ来る。\nあしたは出航だ。天気を頼む！' },
      { t: 'orb', who: 'capitan', need: 'あしたの出航。\n天気はどうなる？', see: { e: '⛵', x: '玉の中で、青い海がきらきら光っている' },
        o: ['Mañana hará buen tiempo.', 'Mañana hacerá buen tiempo.', 'Ayer hizo buen tiempo.'], a: 0, out: '[Mañana] {^har^á} buen tiempo.', ja: 'あした、よい天気になるでしょう。', fx: { e: '☀️', mood: '😄' },
        why: '`hacer` の芯は `har-`。「それは」の語尾 `á`。`hacerá` は原形のままで作った形で、ない。`hizo` は過去の形。' },
      { t: 'orb', who: 'hugo', need: 'あの人は、いつか\nぼくに「いいよ」と\n言ってくれるかな…', see: { e: '💍', x: '玉の中で、小さな指輪が光っている' },
        o: ['Algún día ella dirá que sí.', 'Algún día ella decirá que sí.', 'Algún día ella dijo que sí.'], a: 0, out: '[Algún día] ella {^dir^á} que sí.', ja: 'いつか、彼女は「いいよ」と言うでしょう。', fx: { e: '💍', mood: '😍' },
        why: '`decir` の芯は `dir-`。「彼女は」の語尾 `á`。`decirá` は原形のままで作った形で、ない。' },
      { t: 'map', hi: ['fut-s'], x: 'いま見つけたきまりを、地図に書きこもう。\n芯が変わる動詞の、2つめと3つめ。' },
      { t: 'tip', id: 't-stem-all', ti: '芯が変わる10こ', x: '**e が落ちる**：`podr-`・`sabr-`・`habr-`・`querr-`\n**d が入る**：`tendr-`・`pondr-`・`saldr-`・`vendr-`\n**短くなる**：`dir-`・`har-`\n語尾は、ふつうの未来と同じ。',
        why: '毎日のように使う動詞は、言いやすいように形がけずられていく。`tenré` のように言いにくい所には d が入って、`tendré`。なので、この10こ以外は、ぜんぶ原形のままでいい。' },
      { t: 'ask', q: '「（私たちは）持つだろう」の\n`tener` の形は？', o: ['tendremos', 'teneremos', 'tenremos'], a: 0,
        why: '芯は `tendr-`。nosotros の語尾 `emos` で `{tendremos}`。`teneremos` は原形のまま、`tenremos` は d を入れ忘れた形。' },
      { t: 'drill', n: 6 }
    ]
  },
  /* ================= DAY 3 ================= */
  {
    id: 'L5', no: 5, day: 3, icon: '📒', ti: '予言の帳簿', sub: '過去未来（あの日から見た先）',
    ev: { who: 'rosa', line: '先週の予言のこと、帳簿を見せてくださる？' },
    actors: ['rosa', 'beto'],
    steps: [
      { t: 'say', x: 'DAY 3。予言の帳簿をつける日だよ。\n今日は、未来の形から、\n「ふり返りの形」を作る。' },
      { t: 'say', who: 'rosa', x: 'ルナさん、先週の予言のこと、\n帳簿にどう書いてあるか、\n見せてくださる？' },
      { t: 'flip', a: '[Mañana] {lloverá}.', ja_a: 'あした、雨がふるでしょう。', b: '[Dijo que] {llover^ía^}.', ja_b: '雨がふるだろう、と言った。', day_a: 'きょう', day_b: 'つぎの日' },
      { t: 'ask', pred: true, q: '`lloverá` が `llovería` になった。\n`hablaré` なら、\n`[Dijo que] ___ con Rosa.` は？', o: ['hablará', 'hablaría', 'hablé'], a: 1,
        r: '`{hablaría}`！\n過去の時点から見た先なので、\n過去未来にそろえる。\n芯はそのまま、語尾が **ía** に変わるんだ。' },
      { t: 'forge', w: 'hablar', cut: '', add: 'ía', o: ['ía', 'é', 'aba'], out: '{hablar^ía^}', ja: '（私は）話すだろう、と言った', hint: '原形のうしろに、つける語尾を選んで！' },
      { t: 'show', cap: 'hablar の「〜するだろう、と言った」', tbl: [['yo（私は）', 'hablar^ía^'], ['tú（君は）', 'hablar^ías^'], ['él・ella・usted', 'hablar^ía^'], ['nosotros（私たち）', 'hablar^íamos^'], ['vosotros（君たち）', 'hablar^íais^'], ['ellos・ellas・ustedes', 'hablar^ían^']] },
      { t: 'ask', pred: true, q: '6つとも、´ がつくのは同じ所。\nどこ？', o: ['原形の a', '語尾の最後の文字', '語尾の í'], a: 2,
        r: 'そう！ **どの人も ía の í に ´**。\n語尾は ía・ías・ía・íamos・íais・ían。' },
      { t: 'map', hi: ['cond-s'], x: 'いま見つけたきまりを、地図に書きこもう。\n出発は未来と同じ芯。語尾は ía。' },
      { t: 'show', cap: '2つの「先」', tbl: [['いまから見た先', '[Mañana] {lloverá}.'], ['あの日から見た先', '[Dijo que] {llover^ía^}.']] },
      { t: 'say', x: '予言の日を、過去の日から見ると、\n「そのあとの先」の形になる。\nこの形を、((過去未来))と呼ぶよ。' },
      { t: 'flip', a: '[Mañana] {ganaremos} el partido.', ja_a: 'あした、私たちは試合に勝つでしょう。', b: '[Dijo que] {ganar^íamos^} el partido.', ja_b: '私たちは試合に勝つだろう、と言った。', day_a: 'きょう', day_b: 'つぎの日',
        o: ['ganaríamos', 'ganaremos', 'ganaríais'], ans: 0,
        why: '`Dijo que` は過去。過去の時点から見た先なので、過去未来にそろえる。芯 `ganar-` に、nosotros の語尾 `íamos`。`ganaremos` はいまから見た先、`ganaríais` は vosotros。' },
      { t: 'tapwhen', es: '[Mañana] {hablaré} con Rosa.', ja: 'あした、私はロサと話すでしょう。', a: 'fut-s', why: '`mañana` は先の話。いまから見た先なので、「未来」のマス。' },
      { t: 'tapwhen', es: '[Dijo que] {hablaría} con Rosa.', ja: '私はロサと話すだろう、と言った。', a: 'cond-s', why: '`Dijo que` のあとの `ía` は、あの日から見た先。「過去未来」のマス。' },
      { t: 'tapwhen', es: '[Ayer] {hablé} con Rosa.', ja: 'きのう、私はロサと話した。', a: 'past-s', why: '`ayer` は済んだ話。点過去だから、「あの日（過去）」の「そのとき」のマス。' },
      { t: 'flip', a: '[Mañana] {tendrás} un examen.', ja_a: 'あした、君は試験があるでしょう。', b: '[Dijo que] {tendr^ías^} un examen.', ja_b: '君は試験があるだろう、と言った。', day_a: 'きょう', day_b: 'つぎの日',
        o: ['tendrías', 'tenerías', 'tendrás'], ans: 0,
        why: '`Dijo que` は過去。過去の時点から見た先なので、過去未来にそろえる。未来の芯 `tendr-` のまま、語尾だけ `ías`。原形 `tener` からは作らない。`tendrás` はいまから見た先。' },
      { t: 'tip', id: 't-cond', ti: '過去未来 ＝ 未来と同じ芯 ＋ ía・ías・ía・íamos・íais・ían', x: '`hablaré` → `{hablaría}`\n`comeré` → `{comería}`\n`tendré` → `{tendría}`\n`podré` → `{podría}`\n__´ は ía の í__',
        why: '予言の日をふり返ると、その日は過去になる。見る場所が過去の日に移ったので、「そのあとの先」を言う形（過去未来）に変わる。ちなみに、語尾の ía は線過去の comía などと同じ形。' },
      { t: 'orb', who: 'beto', need: 'ルナ先生、先週ぼくに\n「決勝に出られる」って\n言ってくれたよね？', see: { e: '📒', x: '帳簿に「ベト、決勝に出られる」とある' },
        o: ['Dijo que podría jugar.', 'Dijo que podrá jugar.', 'Dijo que pudo jugar.'], a: 0, out: '[Dijo que] {podr^ía^} jugar.', ja: '出られるだろう、と言った。', fx: { e: '🏆', mood: '😆' },
        why: '`Dijo que` は過去。過去の時点から見た先なので、過去未来にそろえる。芯は未来と同じ `podr-`、語尾 `ía`。`podrá` はいまから見た先、`pudo` は過去。' },
      { t: 'drill', n: 5 }
    ]
  },
  {
    id: 'L6', no: 6, day: 3, icon: '🖋️', ti: '帳簿をつける', sub: '芯が変わる動詞の過去未来・やんわり言う',
    ev: { who: 'capitan', line: '出航の日の予言を、帳簿にたのむ！' },
    actors: ['capitan', 'hugo'],
    steps: [
      { t: 'map', hi: ['fut-s', 'cond-s'], x: 'きのうの続き。出発は未来と同じ芯。\n今日は、芯が変わる動詞も\n日めくりでめくるよ。' },
      { t: 'ask', pred: true, q: '`tendré` の芯は `tendr-`。\n`[Dijo que] ___ un examen.`\n入るのは？', o: ['tenería', 'tendría', 'tendrá'], a: 1,
        r: '`{tendría}`！\n未来の芯 `tendr-` に ía をつけた形。\n過去の時点から見た先なので、\n過去未来にそろえるんだ。' },
      { t: 'show', cap: '未来 → 過去未来（芯はそのまま）', tbl: [['{podrá}', '{podr^ía^}'], ['{tendrá}', '{tendr^ía^}'], ['{hará}', '{har^ía^}']] },
      { t: 'forge', w: 'decir', cut: 'ecir', add: 'iría', o: ['iría', 'iré', 'ería'], out: '{^dir^ía}', ja: '（私は）言うだろう、と言った', hint: '`decir` から、消える文字をタップ！ そのあと足す語尾を選ぶよ' },
      { t: 'say', who: 'capitan', x: 'また来たぞ、船長だ。\n出航の日の予言が、\n帳簿のとおりか、たしかめたい。' },
      { t: 'orb', who: 'capitan', need: '先週の帳簿を読み返そう。\n「出航の日は晴れる」と\n言ったね。', see: { e: '📒', x: '帳簿に「あした、よい天気」と書いてある' },
        o: ['Dije que haría buen tiempo.', 'Dije que hacería buen tiempo.', 'Dije que hizo buen tiempo.'], a: 0, out: '[Dije que] {^har^ía} buen tiempo.', ja: 'よい天気になるだろう、と言った。', fx: { e: '⛵', mood: '😄' },
        why: '芯は未来と同じ `har-`、語尾 `ía`。`hacería` は原形のままで作った形で、ない。`hizo` は過去の形。' },
      { t: 'orb', who: 'hugo', need: 'ウーゴさんに言ったことを\n読み返そう。「あの人は\n店に来る」と言ったね。', see: { e: '📒', x: '帳簿に「あの人は店に来る」と書いてある' },
        o: ['Dije que vendría a la tienda.', 'Dije que venirá a la tienda.', 'Dije que vino a la tienda.'], a: 0, out: '[Dije que] {^vendr^ía} a la tienda.', ja: '店に来るだろう、と言った。', fx: { e: '💐', mood: '🥰' },
        why: '芯は未来と同じ `vendr-`、語尾 `ía`。`venirá` は原形のままで作った形で、ない。`vino` は過去の形。' },
      { t: 'tapwhen', es: '[Dije que] {podría} venir.', ja: '来られるだろう、と言った。', a: 'cond-s', why: '`Dije que` のあとの `ía` は、あの日から見た先。「過去未来」のマス。' },
      { t: 'tapwhen', es: '[Mañana] {podré} venir.', ja: 'あした、私は来られるでしょう。', a: 'fut-s', why: '`mañana` は先の話。いまから見た先だから、「未来」のマス。' },
      { t: 'ask', pred: true, q: 'お客さんが、お茶をほしいとき。\nどちらが、やわらかく聞こえる？', o: ['Quiero un té.', 'Me gustaría un té.'], a: 1,
        r: 'そう！ `Me gustaría` は\n「〜がほしいのですが」という感じ。\n過去未来の形は、**やんわり言う**ときにも使うよ。' },
      { t: 'say', x: '`Me gustaría …` は「〜したいのですが」。\n`gustar` の原形に ía をつけた形だよ。',
        more: 'いまの形で「ほしい」（`quiero`）と言い切るより、「できれば…」と、はっきり言い切らない形。だから、ていねいに聞こえるんだ。' },
      { t: 'ask', q: 'ウーゴさんが、やんわりと言う。\n「ぼくの未来を、知りたいのですが」', o: ['Me gustaría saber mi futuro.', 'Me gusta saber mi futuro.', 'Me gustó saber mi futuro.'], a: 0,
        why: '「〜したいのですが」は `{Me gustaría} …`。`Me gusta` は「〜が好き」、`Me gustó` は「〜が気に入った」（過去）。' },
      { t: 'say', x: '`¿Podría …?` は、\n「〜していただけますか」。\n芯は `podr-`、それに ía だね。' },
      { t: 'ask', q: '船長さんに、やんわりお願い。\n「窓を開けていただけますか」', o: ['¿Podría abrir la ventana?', '¿Poderá abrir la ventana?', '¿Pudo abrir la ventana?'], a: 0,
        why: '`poder` の芯は `podr-`、それに ía で `{podría}`。`poderá` は原形のままで作った形で、ない。`pudo` は過去の形。' },
      { t: 'tip', id: 't-cond-irr', ti: '芯が変わる動詞も、過去未来は「未来と同じ芯 ＋ ía」', x: '`podré` → `{podría}`\n`sabré` → `{sabría}`\n`tendré` → `{tendría}`\n`saldré` → `{saldría}`\n`haré` → `{haría}`\n`diré` → `{diría}`',
        why: '芯が変わるのは、言いやすくするため。その言いやすい芯は、過去の日から見た先を言うときも変わらない。だから、新しく覚える芯はひとつもない。' },
      { t: 'tip', id: 't-soft', ti: '過去未来で、やんわり言う', x: '`{Me gustaría} …` 〜したいのですが\n`¿{Podría} …?` 〜していただけますか\n__いまの形（quiero・puedo）より、ていねい__',
        why: '過去未来は、はっきり決まっていない先の形。言い切らない分、ていねいに聞こえる。お店や、はじめて会う人に使うと自然。' },
      { t: 'ask', q: '「（君は）言うだろう、と言った」\n`[Dijo que] tú ___ la verdad.`', o: ['dirías', 'decirías', 'dirás'], a: 0,
        why: '`decir` の芯は `dir-`。tú の語尾 `ías` で `{dirías}`。`decirías` は原形のままで作った形。`dirás` はいまから見た先。' },
      { t: 'drill', n: 6 }
    ]
  },

  /* ================= DAY 4 ================= */
  {
    id: 'L7', no: 7, day: 4, icon: '🌫', ti: 'くもった水晶玉', sub: 'はっきり見えないときの「〜だろう」',
    ev: { who: 'beto', line: '師匠、時計がこわれちゃった。いま何時？' },
    actors: ['beto', 'rosa', 'carmen'],
    steps: [
      { t: 'say', x: '今日の水晶玉は、ちょっとくもっている。\n新しい形は作らないよ。\n未来の形と過去未来の形に、\n使い道をひとつ足すだけ。' },
      { t: 'map', hi: ['fut-s', 'cond-s'], x: '地図で見ると、この2つはもう知っている形。今日は枠が増えないよ。' },
      { t: 'enter', who: 'beto' },
      { t: 'say', who: 'beto', x: '師匠、時計がこわれちゃった。\nいま何時か、玉で見てよ！' },
      { t: 'show', cap: '¿Qué hora es?（いま何時？）', tbl: [['玉にはっきり「3時」', 'Son las tres.'], ['玉がくもって、3時ごろ？', '{Serán} las tres.']] },
      { t: 'ask', pred: true, q: '右の `{serán}` は、L1 で作った形。\n何の形だっけ？', o: ['未来形', '現在形', '点過去'], a: 0,
        r: 'そう、未来形 `{serán}`。\nでも、これから先の話じゃない。\nいま何時か、という話だよ。' },
      { t: 'say', x: 'はっきり見える → 現在形。\n**くもっている → 未来の形（〜だろう）**' },
      { t: 'orb', who: 'rosa', need: '外は雨かしら？\n（店の窓から見えないの）', see: { e: '🌧', x: '玉にはっきり、雨が降っているのが見える。' },
        o: ['Llueve.', 'Lloverá.', 'Llovió.'], a: 0, out: '{Llueve}.', ja: '雨が降っています。', fx: { e: '🌧', mood: '😮' },
        why: 'はっきり見えているので、言い切る現在形 `{llueve}`。`{lloverá}` は、くもっているときの形。' },
      { t: 'orb', who: 'carmen', need: '遠くに住む孫は、\nいま何をしているかしら。', see: { e: '🌫', x: '玉がくもって、はっきり見えない。家のあかりは…ついているような。' }, fog: true,
        o: ['Está en casa.', 'Estará en casa.', 'Estuvo en casa.'], a: 1, out: '{Estará} en casa.', ja: '家にいるでしょう。', fx: { e: '🏠', mood: '😌' },
        why: 'くもっていて自信がないので「いるだろう」の `{estará}`。`está` と言い切るのは、はっきり見えるとき。' },
      { t: 'say', x: '次は、むかしのことでくもったとき。\n玉に、色あせた写真が映ったよ。' },
      { t: 'show', cap: 'きのうの話。着いたのは何時？', tbl: [['はっきり「10時だった」', 'Eran las diez cuando llegó.'], ['くもって「10時ごろだったろう」', '{Serían} las diez cuando llegó.']] },
      { t: 'ask', pred: true, q: '右の `{serían}` は、L5 で作った形。\n何の形だっけ？', o: ['過去未来形', '線過去', '未来形'], a: 0,
        r: 'そう、過去未来形 `{serían}`。\n過去のことでも、くもっていれば\nこの形になるんだ。' },
      { t: 'say', x: '過去のことで、くもっていたら？\n**過去のくもり → 過去未来の形（〜だろう）**',
        more: '未来の形は「まだ確かめられていないこと」を言う形。いまのことでも、確かめられていなければ、この形で言う。過去のくもりには、過去から見た先の形（過去未来）を使う。' },
      { t: 'orb', who: 'carmen', need: 'この写真の男の子、\n何歳くらいだったのかしら。', see: { e: '🌫', x: '色あせた写真。男の子の顔が、ぼんやり…10歳くらい？' }, fog: true,
        o: ['Tiene unos diez años.', 'Tendría unos diez años.', 'Tendrá unos diez años.'], a: 1, out: '{Tendría} unos diez años.', ja: '10歳くらいだったでしょう。', fx: { e: '📷', mood: '🤔' },
        why: '写真は過去のこと。くもっているので過去未来形 `{tendría}`。`tiene`・`tendrá` は、いまの話の形。' },
      { t: 'ask', q: 'ベト「きのう、あの電車は何時に着いた？」\n玉に、はっきり「9時」と見える。', es: '___ a las nueve.', o: ['Llegó', 'Llegaría', 'Llegará'], a: 0,
        why: 'はっきり見えているので、ふつうの点過去 `{llegó}`。`{llegaría}` は、くもっているとき。' },
      { t: 'ask', q: '同じ質問。でも今度は、玉がくもっている。\n「9時ごろだったかな…」', es: '___ a las nueve.', o: ['Llegó', 'Llegaría', 'Llegará'], a: 1,
        why: 'くもっていて、しかも過去の話。だから過去未来形 `{llegaría}`。' },
      { t: 'ask', q: '手がかりの語に気をつけて。\n「いま」の推量は、どれ？', o: ['Mañana lloverá.', 'Serán las tres.', 'El lunes vendré.'], a: 1,
        why: '`mañana`・`el lunes` は、本物の未来を表す時の手がかり。`las tres`（時刻）は、いまの時刻の話。' },
      { t: 'tip', id: 't-fog', ti: 'くもった玉 ＝ 推量（〜だろう）', x: 'いま：`Son` las tres. → `{Serán}` las tres.\n過去：`Eran` las diez. → `{Serían}` las diez.\n__はっきり → いつもの形、くもり → 先の形__',
        why: '未来の形は、まだ確かめていないことを言う形。だから、いまのことでも確かめられなければ未来の形で「〜だろう」と言える。過去のことは、過去から見た先の形（過去未来形）が同じ役をする。' },
      { t: 'q', id: 'l7-09' },
      { t: 'drill', n: 5 }
    ]
  },
  /* ================= DAY 5 ================= */
  {
    id: 'L8', no: 8, day: 5, icon: '📒', ti: '済んだことの帳簿', sub: '過去分詞と現在完了',
    ev: { who: 'hugo', line: '今日の帳簿、いっしょにつけてくれるかい？' },
    actors: ['hugo', 'beto'],
    steps: [
      { t: 'say', x: '今日は、済んだことの帳簿をつける。\n出発は原形。\n原形から「済んだ印」の形を作って、\nhaber の形とくっつけるよ。' },
      { t: 'show', cap: '原形 → 済んだ印の形', tbl: [['hablar（話す）', 'habl^ado^'], ['trabajar（働く）', 'trabaj^ado^'], ['comer（食べる）', 'com^ido^']] },
      { t: 'ask', pred: true, q: '`vivir`（住む）の「済んだ印」の形は？', o: ['vivado', 'vivido', 'vivía'], a: 1,
        r: '`{vivido}`！\n-ar は -ado、\n-er・-ir は -ido だね。\nこの形を **過去分詞** という。' },
      { t: 'forge', w: 'salir', cut: 'ir', add: 'ido', o: ['ido', 'ado', 'ió'], out: '{salido}', ja: '出た（済んだ印の形）', hint: '`salir` から、取る文字をタップ！' },
      { t: 'show', cap: '規則どおりに作れない7つ', tbl: [['hacer（する）', '{hecho}'], ['decir（言う）', '{dicho}'], ['ver（見る）', '{visto}'], ['escribir（書く）', '{escrito}'], ['poner（置く）', '{puesto}'], ['volver（帰る）', '{vuelto}'], ['abrir（開ける）', '{abierto}']] },
      { t: 'ask', q: '`escribir`（書く）の過去分詞は？\n規則どおりには作らないよ。', o: ['escribido', 'escrito', 'escribado'], a: 1,
        why: '7つの1つ。`{escrito}`。`escribido` は規則どおりに作ってしまった形で、存在しない。' },
      { t: 'show', cap: 'ウーゴの帳簿。きょうのページ', tbl: [['Hoy yo {he trabajado}.', 'きょう、私は働いた'], ['Hoy tú {has comido}.', 'きょう、君は食べた'], ['Hoy Hugo {ha salido}.', 'きょう、ウーゴは出かけた']] },
      { t: 'ask', pred: true, q: '`he`・`has`・`ha`。\nこれは、どの動詞の形だろう？', o: ['haber', 'hacer', 'hablar'], a: 0,
        r: '`haber` だよ。`hay` の仲間。\n主語に合わせて6つに変わるのは\nhaber のほうだ。' },
      { t: 'show', cap: 'haber の「いま」の形', tbl: [['yo', '{he}'], ['tú', '{has}'], ['él・ella・usted', '{ha}'], ['nosotros', '{hemos}'], ['vosotros', '{habéis}'], ['ellos・ustedes', '{han}']] },
      { t: 'ask', pred: true, q: 'ロサとカルメンは、きょうよく働いた。\n過去分詞も、主語に合わせて変わる？', es: '[Hoy] ellas ___ mucho.', o: ['han trabajado', 'han trabajadas', 'han trabajados'], a: 0,
        r: '変わらない！ `{han trabajado}`。\n**過去分詞は、いつも -o のまま**。\n主語に合わせて変わるのは haber だけ。' },
      { t: 'ask', q: 'ベト「ぼくは、もう食べたよ」', es: 'Beto ___.', o: ['ya ha comido', 'ha ya comido', 'ya has comido'], a: 0,
        why: '**haber と過去分詞のあいだには、何も入れない**。`ya` は haber の前。主語が Beto なので `ha`（`has` は tú の形）。' },
      { t: 'flip', a: '[Hoy] {he trabajado} mucho.', ja_a: 'きょうのページ：きょうは、よく働いた。', b: '[Ayer] {trabajé} mucho.', ja_b: 'きのうのページ：きのうは、よく働いた。', day_a: 'きょう', day_b: 'きのう', o: ['trabajé', 'he trabajado', 'trabajo'], ans: 0,
        hint: 'きのうは、もうすっかり済んだ日。', why: '`ayer` は、きょうとは切り離された済んだ日。点過去 `{trabajé}`。きょう・今週・もう・まだは、いまにつながっているので `{he trabajado}`。' },
      { t: 'say', x: 'いまにつながるページの手がかり。\n`[hoy]`・`[esta semana]`\n`[ya]`・`[todavía no]`\nこれがあれば、haber の「いま」の形。' },
      { t: 'map', hi: ['now-p'], x: 'いま見つけたきまりを、地図に書きこもう。「いま × 済んだ」のマスだよ。' },
      { t: 'ask', q: 'ウーゴ「今週、パンを100こ焼いたよ」', es: '[Esta semana] Hugo ___ cien panes.', o: ['ha hecho', 'ha hacido', 'ha hecha'], a: 0,
        why: '`hacer` は規則どおりでない7つの1つ。`{ha hecho}`。過去分詞は -o のまま。' },
      { t: 'tip', id: 't-perf', ti: 'haber の「いま」の形 ＋ 過去分詞', x: '`yo {he comido}`　`ellas {han comido}`\n① haber と過去分詞のあいだには、何も入れない\n② 過去分詞は、いつも -o のまま\n__きょう・今週・もう・まだ ＝ いまのページ__',
        why: 'haber は「持つ」から生まれた動詞。「済ませたことを、いま手もとに持っている」という感じが、いまとつながる意味のもと。haber が主語に合わせて変わり、過去分詞は「済んだ印」の形なので変わらない。' },
      { t: 'q', id: 'l8-05' },
      { t: 'drill', n: 5 }
    ]
  },
  {
    id: 'L9', no: 9, day: 5, icon: '⏪', ti: 'そのとき、もう済んでいた', sub: '過去完了',
    ev: { who: 'beto', line: '電車に乗り遅れた…。どうしてだろう？' },
    actors: ['beto', 'carmen'],
    steps: [
      { t: 'say', x: '今日は、日めくりを前へ戻す。\n出発は、L8 で作った形。\nhaber の形を、あの日に合わせるよ。' },
      { t: 'enter', who: 'beto' },
      { t: 'say', who: 'beto', x: '駅に着いたら、電車はもういなかった…\nスペイン語で、どう言うの？' },
      { t: 'show', cap: 'ベトの一日', es: '[Cuando llegó] Beto, el tren ya {había salido}.', ja: 'ベトが着いたとき、電車はもう出ていた。' },
      { t: 'ask', pred: true, q: '時間の線の上で考えよう。\n「着いた」と「出た」。\n先に起きたのは、どっち？', o: ['着いた（llegó）', '出た（había salido）'], a: 1,
        r: '出たのが先だね。\n着いたときには、もう済んでいた。\n手がかりは `ya`（もう）。' },
      { t: 'say', x: 'ここで新しい形は、`había` だけ。\n過去分詞は L8 と同じ。\n`salido` のまま。' },
      { t: 'forge', w: 'haber', cut: 'er', add: 'ía', o: ['ía', 'ré', 'é'], out: '{había}', ja: 'haber の、あの日の形', hint: '`haber` から、取る文字をタップ！' },
      { t: 'show', cap: 'haber の、あの日の形', tbl: [['yo', '{había}'], ['tú', '{habías}'], ['él・ella・usted', '{había}'], ['nosotros', '{habíamos}'], ['vosotros', '{habíais}'], ['ellos・ustedes', '{habían}']] },
      { t: 'flip', a: '[Cuando llegó] Beto, el tren ya {había salido}.', ja_a: '着いたとき、電車はもう出ていた。', b: 'Una hora [antes], el tren {salió}.', ja_b: 'その1時間前に、電車は出た。', day_a: '着いたとき', day_b: 'その1時間前', o: ['salió', 'había salido', 'salía'], ans: 0,
        hint: 'めくった先では、出たのは「そのときの出来事」。', why: '日めくりを戻した先（1時間前）では、電車が出たのは、そのときの出来事。だから点過去 `{salió}`。「着いたとき」から見るから、`{había salido}`（もう済んでいた）になる。' },
      { t: 'show', cap: 'どちらも「ベトが着いたとき」', tbl: [['[Cuando llegó] Beto, {salió} el tren.', '着いたとき、電車が出た'], ['[Cuando llegó] Beto, el tren ya {había salido}.', '着いたとき、電車はもう出ていた']] },
      { t: 'ask', q: 'ベトが電車に乗り遅れたのは、\nどちらの文？', o: ['上の文（salió）', '下の文（había salido）'], a: 1,
        why: '下の文は、着く前にもう出ていた。上の文は、着いたころに出た。点過去を2つ並べると、起きた順を表す。' },
      { t: 'map', hi: ['past-p'], x: 'いま見つけたきまりを、地図に書きこもう。「あの日 × 済んだ」のマスだよ。' },
      { t: 'tapwhen', es: '[Cuando llegué], ya {había salido}.', ja: '着いたとき、もう出ていた。', a: 'past-p',
        why: '`cuando llegué` はあの日の時点、`ya` は「もう」。あの日までに済んでいたので、あの日 × 済んだ。' },
      { t: 'tapwhen', es: '[Ayer] {llegó} Beto a casa.', ja: 'きのう、ベトは家に着いた。', a: 'past-s',
        why: '`ayer` のできごとを、そのまま言っている。済んでいた、ではない。あの日 × そのとき。' },
      { t: 'ask', q: '家に着いたら、両親はもう食事を終えていた。', es: '[Cuando llegué] a casa, mis padres ya ___.', o: ['habían comido', 'han comido', 'comieron'], a: 0,
        why: '着いたとき（あの日）より前に済んでいたので `{habían comido}`。`han comido` は、いまにつながる形。' },
      { t: 'ask', q: '「着いたとき、ベトはもう帰っていた」\n（volver の過去分詞は vuelto）', es: '[Cuando llegué], Beto ya ___.', o: ['había vuelto', 'había volvido', 'habían vuelto'], a: 0,
        why: '`volver` は、規則どおりでない7つの1つ。`{había vuelto}`。主語は Beto（1人）なので `había`。' },
      { t: 'tip', id: 't-plup', ti: 'haber の「あの日の形」＋ 過去分詞', x: '`{había salido}`　`{habían comido}`\n新しく覚えるのは `había` の6つだけ。\n過去分詞は L8 と同じ。\n__あの日までに、もう済んでいた__',
        why: 'haber を、あの日を表す線過去にしただけ。点過去2つは「起きた順」を並べる言い方、`había` ＋ 過去分詞は「その前にもう済んでいた」と、順番を形で言い切る言い方。' },
      { t: 'q', id: 'l9-05' },
      { t: 'drill', n: 5 }
    ]
  },
  /* ================= DAY 6 ================= */
  {
    id: 'L10', no: 10, day: 6, icon: '📅', ti: 'その日までには', sub: '期限つきの予言・済んだことの推量',
    ev: { who: 'hugo', line: '金曜のお祭りまでに、間に合うかな…' },
    actors: ['hugo', 'carmen'],
    steps: [
      { t: 'say', x: '今日は、期限つきの予言。\n出発は L3 で習った芯 `habr-`。\nそこに過去分詞をつなぐよ。' },
      { t: 'enter', who: 'hugo' },
      { t: 'say', who: 'hugo', x: '金曜日は、お祭りだ。\nそれまでに、仕事を終えたいんだ。' },
      { t: 'show', cap: 'ウーゴの予言', es: 'Para el [viernes], {habré terminado} el trabajo.', ja: '金曜日までには、仕事を終えているだろう。' },
      { t: 'ask', pred: true, q: '`habré` は、どの動詞の何の形？\nL3 の芯を思い出して。', o: ['haber の未来形', 'haber の現在形', 'hacer の未来形'], a: 0,
        r: '`haber` の未来形。芯は `habr-`。\n`podr-`・`sabr-` と同じ仲間だよ。' },
      { t: 'forge', w: 'haber', cut: 'er', add: 'ré', o: ['ré', 'rá', 'ría'], out: '{habré}', ja: 'haber の、これからの形', hint: '`haber` から、取る文字をタップ！' },
      { t: 'show', cap: 'haber の、これからの形', tbl: [['yo', '{habré}'], ['tú', '{habrás}'], ['él・ella・usted', '{habrá}'], ['nosotros', '{habremos}'], ['vosotros', '{habréis}'], ['ellos・ustedes', '{habrán}']] },
      { t: 'flip', a: '[Hoy] todavía no {he terminado}.', ja_a: 'きょうは、まだ終わっていない。', b: 'Para el [viernes], {habré terminado}.', ja_b: '金曜日までには、終えているだろう。', day_a: 'きょう', day_b: '金曜日', o: ['habré terminado', 'he terminado', 'había terminado'], ans: 0,
        hint: '金曜日は、これから先。', why: '金曜日はこれから先。その日までに済んでいる、という予言なので、haber をこれからの形にして `{habré terminado}`。`había terminado` は、過去のある時までに済んでいたとき。' },
      { t: 'map', hi: ['fut-p'], x: 'いま見つけたきまりを、地図に書きこもう。「これから × 済んだ」のマスだよ。' },
      { t: 'tapwhen', es: '[Mañana a esta hora] ya {habrá llegado}.', ja: 'あしたの今ごろには、もう着いているだろう。', a: 'fut-p',
        why: '`mañana a esta hora` は、これから先の期限。そこまでに済んでいる。これから × 済んだ。' },
      { t: 'say', x: 'もうひとつの使い道。\nL7 のくもった玉は、\n済んだことにも使えるんだ。' },
      { t: 'show', cap: 'くもった玉で、済んだことを言う', es: 'Ya {habrá llegado}.', ja: 'もう着いただろう。' },
      { t: 'orb', who: 'carmen', need: '孫は、もう家に着いたかしら。\n（飛行機は、さっき出たところ）', see: { e: '🌫', x: '玉がくもって、はっきり見えない。もう着いたような…' }, fog: true,
        o: ['Ya ha llegado.', 'Ya habrá llegado.', 'Ya llegará.'], a: 1, out: 'Ya {habrá llegado}.', ja: 'もう着いたでしょう。', fx: { e: '✈️', mood: '😌' },
        why: 'くもっていて「だろう」なので、haber をこれからの形に。済んだことの推量は `{habrá llegado}`。`ha llegado` と言い切るのは、はっきり見えるとき。' },
      { t: 'orb', who: 'hugo', need: '金曜のお祭りまでに、\nパンを100こ焼き終えられるかな。', see: { e: '🍞', x: '金曜の朝。棚はパンでいっぱい。もう焼き終わっている。' },
        o: ['Habré hecho cien panes.', 'Habré hacido cien panes.', 'Habré hecha cien panes.'], a: 0, out: 'Para el [viernes], {habré hecho} cien panes.', ja: '金曜日までに、パンを100こ焼き終えているでしょう。', fx: { e: '🥖', mood: '😆' },
        why: '`hacer` の過去分詞は `hecho`（規則どおりの hacido ではない）。-o のままなので `{habré hecho}`。' },
      { t: 'ask', q: 'ロサ「金曜日までに、花は売れているわ」', es: 'Para el [viernes], Rosa ya ___ las flores.', o: ['habrá vendido', 'ha vendido', 'había vendido'], a: 0,
        why: '`para el viernes` は、これから先の期限。haber をこれからの形にして `{habrá vendido}`。' },
      { t: 'tip', id: 't-futp', ti: 'haber のこれからの形 ＋ 過去分詞', x: '`Para el viernes {habré terminado}.`\n`Ya {habrá llegado}.`\n① その日までに済んでいる予言\n② 済んだことの推量（くもった玉）',
        why: 'haber をこれからの形にしただけ。①は、先の期限から見て「もう済んでいる」という予言。②は、L7 と同じで、確かめられないから未来の形で「〜だろう」と言う。使い道は2つ、形は1つ。' },
      { t: 'say', x: '最後に、読めれば合格の形。\nhaber を、あの日から見た\n先の形にすると？' },
      { t: 'tip', id: 't-condp', ti: '読めれば合格：haber を過去未来にすると', x: '`Dijo que {habría terminado} para el viernes.`\n「金曜日までには終えているだろう、と言った」\nhaber を過去未来にしただけ。',
        why: '言った日（過去）から見た先の期限を言うときは、haber を過去未来の形（habría）にする。作る練習は要らない。出会ったら「haber ＋ 過去分詞」と見て、読めればいい。' },
      { t: 'q', id: 'l10-05' },
      { t: 'drill', n: 5 }
    ]
  },
  {
    id: 'L11', no: 11, day: 6, icon: '🔮', ti: 'いま、その最中', sub: '進行形',
    ev: { who: 'rosa', line: '外のようす、玉に映るかい？' },
    actors: ['rosa', 'capitan'],
    steps: [
      { t: 'say', x: '今日は、水晶玉に映る「いまの最中」。\n出発は原形。\n「最中の形」を作って、\n`estar` と組み合わせるよ。' },
      { t: 'show', cap: '原形 → 最中の形', tbl: [['hablar（話す）', 'habl^ando^'], ['trabajar（働く）', 'trabaj^ando^'], ['comer（食べる）', 'com^iendo^']] },
      { t: 'ask', pred: true, q: '`vivir`（住む）の「最中の形」は？', o: ['vivando', 'viviendo', 'vivido'], a: 1,
        r: '`{viviendo}`！\n-ar は -ando、\n-er・-ir は -iendo。\nこの形を **現在分詞** という。' },
      { t: 'forge', w: 'comer', cut: 'er', add: 'iendo', o: ['iendo', 'ando', 'ido'], out: '{comiendo}', ja: '食べている最中', hint: '`comer` から、取る文字をタップ！' },
      { t: 'show', cap: 'つづりが変わる4つ（これだけ覚える）', tbl: [['leer（読む）', 'le^y^endo'], ['dormir（寝る）', 'd^u^rmiendo'], ['decir（言う）', 'd^i^ciendo'], ['pedir（頼む）', 'p^i^diendo']] },
      { t: 'ask', q: '`decir`（言う）の最中の形は？', o: ['diciendo', 'deciendo', 'dicendo'], a: 0,
        why: '4つの1つ。e が i に変わって `{diciendo}`。`deciendo` は規則どおりに作ってしまった形。' },
      { t: 'enter', who: 'rosa' },
      { t: 'show', cap: '玉に映ったロサ', es: '[Ahora mismo], Rosa {está leyendo} una carta.', ja: 'いま、まさに、ロサは手紙を読んでいる。' },
      { t: 'ask', pred: true, q: 'この文の `est^á^` を、\nあの日の形にすると？\n（ロサは、あの日も読んでいた）', o: ['estaba', 'está', 'estará'], a: 0,
        r: '`{estaba}` だよ。\n`estar` を動かすだけ。\n`{estaba leyendo}`＝\nあの日、読んでいる最中だった。' },
      { t: 'orb', who: 'rosa', need: '外は、いまどんな天気？\n（窓がくもって見えないの）', see: { e: '🌧', x: '玉に、雨がぽつぽつ。いま、降っている最中。' },
        o: ['Está lloviendo.', 'Estaba lloviendo.', 'Es lloviendo.'], a: 0, out: '{Está lloviendo}.', ja: 'いま、降っている。', fx: { e: '🌧', mood: '☔' },
        why: '「いま、まさにその最中」なので `{está lloviendo}`。`estaba` はあの日の形。`es` は ser で、ここでは使えない。' },
      { t: 'flip', a: '[Ahora] {está lloviendo}.', ja_a: 'いま、雨が降っている。', b: '[Ayer] a las tres, {estaba lloviendo}.', ja_b: 'きのうの3時には、降っていた。', day_a: 'いま', day_b: 'きのう', o: ['estaba lloviendo', 'está lloviendo', 'estará lloviendo'], ans: 0,
        hint: 'きのうは、済んだ日。', why: '`ayer` は済んだ日。`estar` を線過去 `estaba` にすれば、あの日の最中。' },
      { t: 'flip', a: '[Ahora] Beto {está estudiando}.', ja_a: 'いま、ベトは勉強している。', b: '[Mañana] a esta hora, Beto {estará estudiando}.', ja_b: 'あしたの今ごろも、勉強しているだろう。', day_a: 'いま', day_b: 'あした', o: ['estará estudiando', 'está estudiando', 'estaba estudiando'], ans: 0,
        hint: 'あしたは、これから先。', why: '`mañana` はこれから先。`estar` をこれからの形 `estará` にすれば、先の最中。' },
      { t: 'map', hi: ['now-g', 'past-g', 'fut-g'], x: 'estar を動かすだけ。地図の「最中」の列に、3つ書きこもう。' },
      { t: 'say', x: 'ただし、使いすぎないこと。\n日本語の「〜している」が、\n全部これではないよ。' },
      { t: 'ask', pred: true, q: '「ロサは店で働いている」\n（毎日の仕事のこと）どっち？', o: ['Rosa trabaja en una tienda.', 'Rosa está trabajando en una tienda.'], a: 0,
        r: 'ふだんのことは現在形。\n住んでいる（`Vivo en Madrid.`）\n飼っている（`Tengo un perro.`）\nも、現在形。\n**いま、まさに最中のときだけ**\nestar ＋ 現在分詞。' },
      { t: 'tip', id: 't-prog', ti: 'estar ＋ 現在分詞 ＝ いま、まさに最中', x: '`{Está lloviendo}.`　`{Estaba lloviendo}.`　`{Estará lloviendo}.`\nつづりが変わるのは4つだけ：\n`leyendo`・`durmiendo`・`diciendo`・`pidiendo`',
        why: '現在分詞は「最中」の印の形で、変わらない。時（いま・あの日・これから）は estar が運ぶ。ふだんのこと・住む・持つ、のような状態は、最中ではないので現在形のまま。' },
      { t: 'q', id: 'l11-08' },
      { t: 'drill', n: 5 }
    ]
  },
  /* ================= DAY 7 ================= */
  {
    id: 'L12', no: 12, day: 7, icon: '🗺', ti: '時間の地図', sub: '総まとめ：手がかりから形を選ぶ',
    ev: { who: 'carmen', line: '見習いさん、地図はできあがったかい？' },
    actors: ['rosa', 'beto', 'carmen', 'hugo', 'capitan'],
    steps: [
      { t: 'say', x: '最後の日だよ。\n新しい形は、もうない。\n地図を見て、形を選ぶ練習をしよう。' },
      { t: 'map', hi: ['now-s', 'past-s', 'fut-s', 'cond-s', 'now-p', 'past-p', 'fut-p', 'now-g', 'past-g', 'fut-g'], x: 'これが、いままで作った地図。行は「いつ」、列は「そのとき・済んだ・最中」。' },
      { t: 'say', x: '形を選ぶ決め手は、手がかりの語。\n手がかり（原因）があるから、\n形（結果）が決まるんだ。' },
      { t: 'show', cap: 'llover（雨が降る）で見る：手がかり → 形', tbl: [['[mañana]　これから先', '{lloverá}'], ['[dijo que]　あの日から見た先', '{llovería}'], ['[hoy]・[ya]　いまにつながる済んだこと', '{ha llovido}'], ['[cuando llegué], ya　あの日までに済んだこと', '{había llovido}'], ['[para el lunes]　これから先の期限', '{habrá llovido}'], ['[ahora mismo]　いま、その最中', '{está lloviendo}']] },
      { t: 'tapwhen', es: '[Mañana] {lloverá}.', ja: 'あした、雨が降るだろう。', a: 'fut-s', why: '`mañana` が手がかり。これから先のことなので、未来形。これから × そのとき。' },
      { t: 'tapwhen', es: 'Rosa [dijo que] {llovería}.', ja: 'ロサは、雨が降るだろうと言った。', a: 'cond-s', why: '`dijo que` は過去。あの日から見た先なので、過去未来形。' },
      { t: 'tapwhen', es: '[Esta semana] {ha llovido} mucho.', ja: '今週は、よく雨が降った。', a: 'now-p', why: '`esta semana` は、いまにつながっている。haber の「いま」の形 ＋ 過去分詞。いま × 済んだ。' },
      { t: 'ask', q: 'ロサは先週、「雨になる」と言った。\nその日から見た先の話。', es: 'Rosa [dijo que] ___ esa tarde.', o: ['lloverá', 'llovería', 'ha llovido'], a: 1,
        why: '`dijo que` は過去。過去から見た先なので過去未来形 `{llovería}`。`{lloverá}` は、いまから見た先。' },
      { t: 'tapwhen', es: '[Cuando llegué], ya {había salido}.', ja: '着いたとき、もう出ていた。', a: 'past-p', why: '`cuando llegué` がその日の時点、`ya` がもう。あの日までに済んでいた。' },
      { t: 'tapwhen', es: 'Para el [lunes], ya {habré terminado}.', ja: '月曜日までには、もう終えているだろう。', a: 'fut-p', why: '`para el lunes` は、これから先の期限。そこまでに済んでいる。' },
      { t: 'ask', q: 'どちらも「ベトはもう着いた」。\n手がかりを見て選ぼう。', es: '[Mañana] [para las diez], Beto ya ___.', o: ['habrá llegado', 'había llegado', 'ha llegado'], a: 0,
        why: '`mañana` ＋ `para las diez` は、これから先の期限。`{habrá llegado}`。`{había llegado}` は、`cuando llegué` のように、あの日の時点があるとき。' },
      { t: 'flip', a: '[Hoy] {ha llovido} mucho.', ja_a: 'きょうは、よく雨が降った。', b: '[Ayer] {llovió} mucho.', ja_b: 'きのうは、よく雨が降った。', day_a: 'きょう', day_b: 'きのう', o: ['llovió', 'ha llovido', 'llovería'], ans: 0,
        hint: 'きのうは、もう切り離された日。', why: '`hoy` はいまにつながっているので `{ha llovido}`。`ayer` はもう切り離された日なので点過去 `{llovió}`。' },
      { t: 'tapwhen', es: '[Ahora mismo] {está lloviendo}.', ja: 'いま、まさに雨が降っている。', a: 'now-g', why: '`ahora mismo`（いま、まさに）が手がかり。いま × 最中。' },
      { t: 'tapwhen', es: '[Ayer] a las tres, {estaba lloviendo}.', ja: 'きのうの3時には、降っていた。', a: 'past-g', why: '`ayer a las tres` はあの日の時点。estar を線過去にして、あの日 × 最中。' },
      { t: 'say', x: '`estaba lloviendo` と\n`llovía` は、どちらも\n「あの日、降っていた」。\nちがいには深入りしなくていいよ。' },
      { t: 'tapwhen', es: '[Mañana a esta hora] {estará lloviendo}.', ja: 'あしたの今ごろは、降っているだろう。', a: 'fut-g', why: '`mañana a esta hora` は、これから先の時点。estar をこれからの形にして、これから × 最中。' },
      { t: 'ask', q: '玉がくもっている。\n「いまごろ、もう着いただろう」は？', es: 'Ya ___.', o: ['habrá llegado', 'había llegado', 'llegaría'], a: 0,
        why: 'くもっているので「だろう」。済んだことの推量は、haber をこれからの形に。`{habrá llegado}`。' },
      { t: 'tip', id: 't-map', ti: '手がかり → 時 → 形', x: '手がかりの語（`mañana`・`dijo que`・`ya`・`cuando llegué`・`para el lunes`・`ahora mismo`）\n→ 地図のどのマスか\n→ そのマスの形',
        why: '形は、手がかりの語から決まる。まず手がかりを探し、「いつの、どの状態か」を地図で決める。形から先に決めようとすると迷う。' },
      { t: 'q', id: 'l12-12' },
      { t: 'say', x: '地図は、もう君の頭の中にあるね。\n形に迷ったら、手がかりを探すこと。\n卒業おめでとう、見習い予言者！' },
      { t: 'drill', n: 6 }
    ]
  }
]);

/* ボス（うたぐり屋のドゥーダが、姿を変えて来る） */
FQ.bosses = [
  { id: 'B1', after: 'L4', day: 2, name: 'うたぐり屋ドゥーダ【新聞記者】', en: 'DUDA, EL PERIODISTA', face: '📰', col: '#5fb8ff', from: ['L1', 'L2', 'L3', 'L4'], n: 7,
    line: 'ふん、見習いの予言なんて当たるものか！ 記事にしてやる！', win: 'ドゥーダ「む…ぜんぶ当たっている。記事を書き直しだ」館の評判が上がった！' },
  { id: 'B2', after: 'L7', day: 4, name: 'うたぐり屋ドゥーダ【探偵】', en: 'DUDA, EL DETECTIVE', face: '🔍', col: '#ff9a3d', from: ['L5', 'L6', 'L7'], n: 8,
    line: '予言の帳簿に、ごまかしはないか？ この目でたしかめる！', win: 'ドゥーダ「帳簿は完ぺきだ…。みとめよう」館がまたひとつ育った！' },
  { id: 'B3', after: 'L12', day: 7, name: 'うたぐり屋ドゥーダ【大予言者】', en: 'DUDA, EL GRAN PROFETA', face: '🧙', col: '#b04dff', from: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12'], n: 12, final: true,
    line: 'わたしこそ本物の大予言者！ 時間の地図など、わたしが書きかえてやる！', win: 'ドゥーダ「負けた…。きみこそ、本物の予言者だ」占い館は、立派な館になった！' }
];

/* 日本語の用語（本文に出たら点線。タップで説明） */
FQ.gloss = {
  '原形': '動詞の、辞書にのっている形。-ar・-er・-ir で終わる（hablar・comer・vivir）',
  '語尾': '動詞のうしろにつく部分。主語で変わる（hablar + é・ás・á…）',
  '芯': 'この教材での呼び方。動詞の、語尾をつける土台の部分。ふつうは原形そのまま（hablar）。形が変わる動詞もある（poder → podr-）',
  '時制': '動詞が表す「時」の形。いま・過去・未来など。この教材では、時間の地図に並べている',
  '未来': '「これから先」を言う形。原形に語尾をつける（hablaré）',
  '過去未来': '「あの日から見た先」を言う形。未来と同じ芯に ía などの語尾（hablaría）。やんわり言うときにも使う',
  '過去分詞': '「済んだこと」を表す形。-ado・-ido など（hablado・comido）。haber と組み合わせて使う',
  '現在分詞': '「〜している最中」を表す形。-ando・-iendo など（hablando・comiendo）。estar と組み合わせて使う',
  '推量': '「〜だろう」と、確かではないことを想像して言うこと。未来や過去未来の形が、そのために使われることもある',
  'アクセント記号': '母音の上の ´。強く読む印（hablaré・hablaría）'
};
