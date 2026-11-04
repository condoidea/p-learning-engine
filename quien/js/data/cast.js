/* =========================================================
 * ¿QUIÉN FUE? 下町新聞の事件記者 — 登場人物と台本の書き方
 *
 *  window.QF = { cast, places, masks, flow, cases }。事件ごとのファイル（case1.js …）が QF.cases.push({...}) する。
 *  文は西検4級の問題に出るふつうの文にする（見出しのような短縮文にしない）。
 *
 *  ■ 事件（case）
 *   { id:'c1', no:1, title:'盗まれた絵', es:'El cuadro robado', icon:'🖼',
 *     grammar:'ser ＋ 過去分詞 ＋ por', cover:'表紙のひとこと',
 *     cast:{ guia:{ n:'ガイドのルス', es:'Luz', e:'👩', role:'美術館のガイド' }, ... },   // その事件だけの人（共通の人は下の QF.cast）
 *     evidence:{ cartel:{ e:'📋', n:'入口の案内', d:'説明（日本語）' }, ... },            // 取材メモ
 *     steps:[ ... ] }
 *
 *  ■ ステップ（t）。x＝日本語（**覚えること** __覚え方__ ((この教材での呼び方)) `スペイン語`）、
 *     es＝スペイン語（[ ] で囲んだ部分に下線。中の se＝朱、por＝藍、a＝黄土、me・te・le・nos・os・les＝緑）
 *   scene   { t, place:'redaccion'|…, cast:[…], duel? }   場面の切りかえ。duel:true で対決（インクが出て、まちがえると減る）
 *   enter   { t, who }                       場面に人を足す（対決では相手として前に出る）
 *   say     { t, who, x, es?, more? }        セリフ。es があればスペイン語を大きく、x が訳。more＝「🤔 なぜ？」で開く補足
 *   note    { t, title, rows:[[es, ja], …], x?, why? }  ペパさんの校閲ノート（文法の表）。ボードに残り、ノートにも入る
 *   tip     { t, title, x, why? }            覚え方・理屈の Tips（ボードに出て、ノートにも入る）
 *   flow    { t, upto }                      見分けの手順（QF.flow の 1〜upto 段目）をボードに出す。新しい段は光る
 *   ask     { t, q, es?, o:[…], a, r?, ng? } 問い。対決の中ならまちがえるとインク −1。r＝正解のあとのステップ、ng＝まちがいのヒント
 *            o がスペイン語の文なら「文（語をタップで意味）＋えらぶ」の行になる
 *   who     { t, q?, es, ja?, o:['por','alguien',…], a, r?, ng? }  現場ボード：文の「やった人」は？（o は QF.masks のキー）
 *   tap     { t, q, es, a:['venden'], r?, ng? }  決め手の語をタップ（a は正解の語。同じ語が2回あるなら 'venden#2'）
 *   redpen  { t, q, es, bad:'vende', o:[…], a, fix, r?, ng? }  赤ペン：まちがった語をタップ → 直した語を選ぶ。fix＝直した文
 *   get     { t, ev }                        取材メモ（証拠）を手に入れる
 *   inspect { t, spots:[{ e, n, steps:[…] }] }  調べる（3つ前後）。ぜんぶ調べると次へ
 *   testimony { t, who, title, lines:[{ es, ja, press?:[…], ok?:['ev'] }], after:[…], hint }
 *            取材・対決。◀▶ で発言を見て「¿De verdad?（つっこむ）」か「¡No cuadra!（メモをつきつける）」。
 *            ok のメモをその発言につきつけると成功 → after を実行
 *   present { t, q, ok:['ev'], after:[…], hint? }   メモをつきつけるだけ（1つの主張に対して）
 *   contra  { t, who, title, lines:[{ es, ja }], a:[i, j], after:[…], hint? }  つじつまの合わない2つの発言をタップ
 *   stop    { t, who, title, lines:[{ es, ja }], a, after:[…], hint? }  記者会見：発言が流れていく。ごまかしの行で「¡Un momento!」
 *   interp  { t, es, ja, o:[…], a, ng?, after? }  見習いティトの訳（ja）がまちがっている → 正しい訳を選ぶ
 *   build   { t, q, es, x?:['fue', …], r? }  タイルで文を組み立てる（es が正解。x はまぎらわしいタイル）
 *   slam    { t, txt }                       叩きつけ文字
 *   scoop   { t, txt, es }                   スクープ（事件の終わり。新聞の一面が刷り上がる）。txt＝見出し（日本語）、es＝スペイン語の文
 * ========================================================= */
(function () {
  'use strict';
  window.QF = {
    cases: [],
    /* どの事件にも出る人 */
    cast: {
      leo:   { n: 'レオ', es: 'Leo', e: '🧑', role: '新米の記者（あなた）' },
      pepa:  { n: 'ペパさん', es: 'Doña Pepa', e: '👵', role: '校閲デスク。赤ペンで文法を直す' },
      ramon: { n: 'ラモン編集長', es: 'Don Ramón', e: '🧔', role: 'エル・エコ紙の編集長' },
      tito:  { n: 'ティト', es: 'Tito', e: '👦', role: '見習い。訳とつづりがあやしい' }
    },
    /* 場面（背景と、上に出す名前） */
    places: {
      redaccion:    { n: 'エル・エコ編集部', es: 'La redacción', e: '📰' },
      museo:        { n: '街の美術館', es: 'El museo', e: '🖼' },
      biblioteca:   { n: '市立図書館', es: 'La biblioteca', e: '📚' },
      mercado:      { n: '下町の市場', es: 'El mercado', e: '🍅' },
      inmobiliaria: { n: '不動産屋', es: 'La inmobiliaria', e: '🏠' },
      cafe:         { n: '広場のカフェ', es: 'El café de la plaza', e: '☕' },
      teatro:       { n: '劇場', es: 'El teatro', e: '🎭' },
      piso:         { n: 'アパートの一室', es: 'El piso', e: '🛋' },
      estadio:      { n: 'サッカー場', es: 'El estadio', e: '⚽' },
      estacion:     { n: '駅', es: 'La estación', e: '🚉' },
      ayuntamiento: { n: '市役所', es: 'El ayuntamiento', e: '🏛' },
      prensa:       { n: '記者会見室', es: 'La sala de prensa', e: '🎤' }
    },
    /* 現場ボードの「やった人」。文法の形と1対1 */
    masks: {
      por:     { e: '🧾', n: 'por のあとの人', d: 'ser ＋ 過去分詞 ＋ por 〜' },
      alguien: { e: '🕵️', n: 'だれか（文に書いていない）', d: 'ser ＋ 過去分詞／受身の se' },
      estado:  { e: '🖼', n: '問わない（いまの様子だけ）', d: 'estar ＋ 過去分詞' },
      gente:   { e: '👥', n: '人はだれでも（一般の人）', d: '無人称の se／3人称複数' },
      mismo:   { e: '🪞', n: '本人が自分に', d: '再帰の se' },
      mutuo:   { e: '🤝', n: 'おたがいに', d: '相互の se' },
      nadie:   { e: '🌀', n: 'だれも（ひとりでに・うっかり）', d: '「勝手に」の se' },
      le:      { e: '🎁', n: 'ふつうにやった人（se は「彼に」）', d: 'le が se に変わっただけ' }
    },
    /* 見分けの手順（ペパさんの校閲ノート）。c の事件をクリアするまで、その段は出ない */
    flow: [
      { c: 'c1', q: '**ser ＋ 過去分詞** がある？', a: '受身「〜される」。やった人は **por のあと**。por がなければ「だれか」', ex: 'El cuadro [fue robado por] un hombre.' },
      { c: 'c2', q: '**estar ＋ 過去分詞** がある？', a: '**いまの様子**。だれがしたかは問わない', ex: 'La puerta [está cerrada].' },
      { c: 'c3', q: '**se ＋ 動詞** で、主語が**物**？ 動詞の数は物に合っている？', a: '**受身の se**「〜される」。やった人は書かない', ex: '[Se venden] pisos.' },
      { c: 'c4', q: '**se ＋ 動詞** で、主語がない？（動詞は**いつも単数**）', a: '**無人称の se**「人は〜する」。人が目的語なら **a** が付く', ex: '[Se busca a] los dos actores.' },
      { c: 'c5', q: '主語が**人**で、se が**その人自身**？', a: '**再帰**「自分を〜する」。主語が複数なら**相互**「おたがいに」もある', ex: 'Ana y Luis [se] quieren.' },
      { c: 'c6', q: '物が**ひとりでに**そうなった？ me・te・le がある？', a: '**「勝手に」の se**。me・le は**困った人**', ex: '[Se me] rompió el vaso.' },
      { c: 'c7', q: 'se のすぐあとに **lo・la・los・las**？', a: '**le が se に変わっただけ**「彼に・彼女に」', ex: '[Se lo] di a Pedro.' }
    ]
  };
})();
