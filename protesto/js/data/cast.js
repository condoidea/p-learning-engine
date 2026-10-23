/* =========================================================
 * ¡PROTESTO! 森のどうぶつ裁判 — 登場人物と台本の書き方
 *
 *  window.PQ = { cast, places, cases }。事件ごとのファイル（case1.js …）が PQ.cases.push({...}) する。
 *
 *  ■ 事件（case）
 *   { id:'c1', no:1, title:'消えた大きなパン', es:'El pan desaparecido', icon:'🥖',
 *     grammar:'más / menos ＋ 形容詞 ＋ que', cover:'表紙のひとこと',
 *     cast:{ coco:{ n:'ココ', es:'Coco', e:'🐰', role:'被告・ウサギ' }, ... },   // その事件だけの人（共通の人は下の PQ.cast）
 *     evidence:{ estante:{ e:'🗄', n:'パン屋の棚', d:'いちばん上の段は高さ 2 m（200 cm）。' }, ... },
 *     steps:[ ... ] }
 *
 *  ■ ステップ（t）。x＝日本語（**覚えること** __覚え方__ ((この教材での呼び方))）、es＝スペイン語（[ ] で比べる部分に色）
 *   scene   { t, place:'panaderia'|'court'|…, cast:['oso','coco'] }  場面の切りかえ。court で「どんぐり」（ミスの残り）が出る
 *   enter   { t, who }                       場面に人を足す（法廷では証言台に立つ）
 *   say     { t, who, x, es?, more? }        セリフ。es があればスペイン語を大きく、x が訳。more＝「🤔 なぜ？」で開く補足
 *   note    { t, title, rows:[[es, ja], …], x? }  ミミのノート（文法の表）。ボードに残る。法廷記録の「ノート」にも入る
 *   tip     { t, title, x, why? }            覚え方の Tips（ボードに出て、法廷記録にも入る）
 *   chart   { t, title, unit, bars:[{ e, n, v }], hi? }  ボードの棒グラフ（高さ・値段など）。hi＝光らせる棒の番号の配列
 *   ask     { t, q, es?, o:[…], a, r?, ng? } 問い。法廷の中ならまちがえると どんぐり −1。r＝正解のあとのセリフ（say の配列）、ng＝まちがいのヒント
 *   get     { t, ev }                        証拠品を手に入れる
 *   inspect { t, spots:[{ e, n, steps:[…] }] }  調べる（3つ前後）。ぜんぶ調べると次へ
 *   testimony { t, who, title, lines:[{ es, ja, press?:[…], ok?:['ev'] }], after:[…], hint }
 *            尋問。◀▶ で証言を見て「¡Un momento!（ゆさぶる）」か「¡Protesto!（証拠をつきつける）」。
 *            ok の証拠をその証言につきつけると成功 → after を実行
 *   present { t, q, ok:['ev'], after:[…] }   証拠をつきつけるだけ（1つの主張に対して）
 *   contra  { t, who, title, lines:[{ es, ja }], a:[i, j], after:[…] }  ムジュンする2つの証言をタップ
 *   stop    { t, who, title, lines:[{ es, ja }], a, after:[…] }  主張が流れていく。ムジュンの行で「¡Un momento!」
 *   interp  { t, who, es, ja, o:[…], a, after? }  通訳ロロの訳（ja）がまちがっている → 正しい訳を選ぶ
 *   order   { t, q, items:[{ id, e, n }], a:[id, …], r? }  順に並べる（タップした順）
 *   build   { t, q, es, x?:['menos', …], r? }  タイルで文を組み立てる（es が正解。x はまぎらわしいタイル）
 *   slam    { t, txt }                       叩きつけ文字（¡PROTESTO! など）
 *   verdict { t, txt, es }                   判決（事件の終わり）
 * ========================================================= */
(function () {
  'use strict';
  window.PQ = {
    cases: [],
    /* どの事件にも出る人 */
    cast: {
      nico:  { n: 'ニコ', es: 'Nico', e: '🦊', role: '新米の弁護士（あなた）' },
      mimi:  { n: 'ミミ', es: 'Mimí', e: '🐭', role: '書記・ニコの相棒' },
      pavon: { n: 'ドン・パボン', es: 'Don Pavón', e: '🦚', role: '検事' },
      juez:  { n: 'カメ裁判長', es: 'Su Señoría', e: '🐢', role: '裁判長' },
      loro:  { n: 'ロロ', es: 'Loro', e: '🦜', role: '法廷通訳' }
    },
    /* 場面（背景の絵と、上に出す名前） */
    places: {
      court:      { n: '森の裁判所', es: 'El tribunal del bosque', e: '⚖️' },
      office:     { n: 'ニコの事務所', es: 'La oficina de Nico', e: '🕯' },
      panaderia:  { n: 'クマのパン屋', es: 'La panadería', e: '🥖' },
      estacion:   { n: '森の駅', es: 'La estación', e: '🚂' },
      hospital:   { n: '森の病院', es: 'El hospital', e: '🏥' },
      mercado:    { n: '朝市', es: 'El mercado', e: '🍎' },
      biblioteca: { n: '図書館', es: 'La biblioteca', e: '📚' },
      banco:      { n: '森の銀行', es: 'El banco', e: '🏦' }
    }
  };
})();
