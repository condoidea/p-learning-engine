/* =========================================================
 * data/bosses.js — ボスと、ボス戦の問題
 *  問題 { q, opts, a, why, attr, mols }。attr は攻撃の名前（⚡ 雷撃・🌪 疾風刃・🏜 砂塵波・⬡ 錬成撃）
 *  「詠唱封じ」は、詠唱の穴埋め（レッスンで唱えた呪文から）
 * ========================================================= */
(function () {
  'use strict';
  var Y = window.Y, A = Y.ANS;

  Y.QS = {
    q01: { attr: 'forge', q: 'C の手は何本？', opts: ['2本', '3本', '4本', '6本'], a: 2 },
    q02: { attr: 'forge', q: 'O の手は何本？', opts: ['1本', '2本', '3本', '4本'], a: 1 },
    q03: { attr: 'forge', q: 'C₂H₆O の異性体は何種類？', opts: ['1種類', '2種類', '3種類'], a: 1, why: 'エタノール CH₃CH₂OH と、ジメチルエーテル CH₃OCH₃。' },
    q04: { attr: 'forge', q: 'C₄H₁₀ の異性体は？', opts: ['ブタンだけ', 'ブタンと 2-メチルプロパン', 'ブタンとプロパン'], a: 1 },
    q05: { attr: 'forge', q: 'アルカンの一般式は？', opts: ['CₙH₂ₙ', 'CₙH₂ₙ₊₂', 'CₙH₂ₙ₋₂'], a: 1, why: '鎖の C に H が 2 つずつ（2n）、両はしに 1 つずつ（＋2）。' },
    q06: { attr: 'forge', q: 'C₈H₁₈ の名前は？', opts: ['ヘキサン', 'オクタン', 'デカン'], a: 1, why: 'オクタ＝8（オクトパスの足）。' },
    q07: { attr: 'forge', q: 'プロパンの分子式は？', opts: ['C₃H₆', 'C₃H₈', 'C₄H₁₀'], a: 1, why: '2×3＋2＝8。' },
    q08: { attr: 'thunder', q: 'メタン ＋ 塩素 の反応に必要な条件は？', opts: ['光', '触媒', '冷やす'], a: 0 },
    q09: { attr: 'thunder', q: 'メタン ＋ 塩素 で、CH₃Cl といっしょにできるのは？', opts: ['HCl（塩化水素）', 'H₂', 'H₂O'], a: 0, why: '追い出された H が、もう 1 つの Cl とくっつく。' },
    q10: { attr: 'thunder', q: 'H が Cl と入れかわる反応は？', opts: ['付加反応', '置換反応', '脱水'], a: 1 },
    q11: { attr: 'thunder', q: 'CHCl₃ の名前は？', opts: ['クロロホルム', 'クロロメタン', 'ジクロロメタン'], a: 0, why: 'CH₃Cl（クロロメタン）→ CH₂Cl₂ → CHCl₃（クロロホルム）→ CCl₄。' },
    q12: { attr: 'wind', q: 'アルケンの一般式は？', opts: ['CₙH₂ₙ', 'CₙH₂ₙ₊₂'], a: 0, why: '二重結合の分、アルカンより H が 2 つ少ない。' },
    q13: { attr: 'wind', q: '臭素水の色が消えるのは？', opts: ['ethylene', 'methane', 'ethane'], a: 0, mols: true, why: '二重結合があるエチレンだけが、Br₂ を付加する。' },
    q14: { attr: 'wind', q: 'エチレン ＋ Br₂ でできるのは？', opts: ['1,2-ジブロモエタン', 'ブロモメタン', 'エタン'], a: 0, why: '両側の C に Br が 1 つずつ。だから「1,2-ジブロモ」。' },
    q15: { attr: 'wind', q: 'エチレン ＋ H₂ に必要なのは？', opts: ['光', 'Ni などの触媒', '冷やす'], a: 1 },
    q16: { attr: 'wind', q: '付加反応で「出ていく」ものは？', opts: ['HCl（塩化水素）', 'H₂O', '何も出ていかない'], a: 2, why: '付加は、くっつくだけ。何かが出ていくのは置換や脱水。' },
    q17: { attr: 'sand', q: 'エタノール ＋ 濃硫酸、160〜170℃ でできるのは？', opts: ['エチレン', 'ジエチルエーテル', 'エタン'], a: 0, why: '高温は「ひとりで」：1 分子から水が抜ける。' },
    q18: { attr: 'sand', q: 'エタノール ＋ 濃硫酸、130〜140℃ でできるのは？', opts: ['エチレン', 'ジエチルエーテル', 'エタン'], a: 1, why: '低温は「ふたりで」：2 分子から水が抜けて O でつながる。' },
    q19: { attr: 'sand', q: '脱水で、濃硫酸の役目は？', opts: ['水を奪う', '水を足す', '色をつける'], a: 0 },
    q20: { attr: 'sand', q: '水が抜けて、2 つの分子がつながる反応は？', opts: ['縮合', '置換', '付加'], a: 0 },
    q21: { attr: 'sand', q: '詠唱封じ！ エチレンを作る詠唱\n「熱よ、百[　]の焔となれ」', opts: ['七十', '三十'], a: 0, why: '160〜170℃ でエチレン。130〜140℃ ならジエチルエーテル。' },
    q22: { attr: 'wind', q: '詠唱封じ！ 付加の詠唱\n「二重の絆よ、[　]をほどけ」', opts: ['一本', '二本'], a: 0, why: '二重結合のうち 1 本だけがほどける。残りの 1 本で C どうしはつながったまま。' },
    q23: { attr: 'thunder', q: '詠唱封じ！ 置換の詠唱\n「水素ひとつを追い払い、その座を[　]」', opts: ['奪え', 'ゆずれ'], a: 0, why: 'H の席を Cl が奪う＝入れかわる（置換）。' },
    q24: { attr: 'forge', q: 'つながり方が同じで、曲げて描いただけの 2 つは？', opts: ['同じ物質', '異性体'], a: 0 }
  };

  Y.BOSSES = {
    /* 序章のボス：同じ形を別の形に見せる幻影 */
    mirage: { id: 'mirage', ch: 0, kind: 'build', name: 'ミラージュ', title: '幻影の門番', hp: 90, lim: 150000,
      intro: 'ふふふ…わたしは 3 体に分かれている。それぞれ、別の形の魔法陣でしか倒せないわよ', split: true,
      taunt: ['ふふふ、それはもう見た形よ', '惑わされたわね'],
      rule: 'ミラージュは **3 体の分身**。それぞれの弱点は、C₅H₁₂ の **ちがう形**（異性体）の魔法陣。\nC 5 つで骨組みを作り（CH₃ パーツ・水素の筆も使える）、魔法陣を完成させると魔法が飛ぶ。3 体とも倒せば勝ち。\n同じ形を 2 回作ると反撃（ライフ −1）。制限時間 150 秒（💡 ヒントは 1 回 15 秒と引きかえ）。',
      mission: 'C₅H₁₂ の異性体を 3 種類、錬成せよ',
      build: { mat: { C: 5, H: 12 }, hFill: true, parts: ['CH3'], appraise: 'name', answers: [A.pentane, A.mbutane, A.neopentane], hints: ['いちばん長い鎖が、5・4・3 の 3 通り。\n鎖が短いほど、残りの C は枝になる。', '鎖 4 なら、2 番目の C から枝を 1 本。\n鎖 3 なら、真ん中の C から上下に枝を 2 本。'] },
      finYomi: 'ペンタン、に、メチルブタン、に、に、ジメチルプロパン。さんじゅう、れんせい！', finText: '三重錬成！',
      reward: '🗝 幻影の門が開いた。1章「炭化水素の草原」へ！',
      art: '<svg viewBox="0 0 200 200" class="boss-art mirage"><g class="ghost g3"><path d="M100 24c-36 0-58 30-58 64v84l14-12 14 14 15-14 15 14 15-14 14 14 14-12V88c0-34-22-64-57-64z" fill="#6c4bd8" opacity=".25"/></g>' +
        '<g class="ghost g2"><path d="M100 24c-36 0-58 30-58 64v84l14-12 14 14 15-14 15 14 15-14 14 14 14-12V88c0-34-22-64-57-64z" fill="#8f6bff" opacity=".35"/></g>' +
        '<g class="body"><path d="M100 24c-36 0-58 30-58 64v84l14-12 14 14 15-14 15 14 15-14 14 14 14-12V88c0-34-22-64-57-64z" fill="#b39bff"/>' +
        '<path d="M64 76q36-26 72 0v26q-36 18-72 0z" fill="#2a1760"/><ellipse cx="82" cy="88" rx="9" ry="6" fill="#7dffcf"/><ellipse cx="118" cy="88" rx="9" ry="6" fill="#7dffcf"/>' +
        '<path d="M86 128q14 10 28 0" stroke="#2a1760" stroke-width="5" fill="none" stroke-linecap="round"/><text x="100" y="160" text-anchor="middle" font-size="16" fill="#2a1760" font-weight="800">C₅H₁₂</text></g></svg>'
    },
    /* 1章のボス：臭素のかたまり。付加でとどめを刺すと色が消える */
    bromos: { id: 'bromos', ch: 1, kind: 'quiz', name: 'ブロモス', title: '赤褐の魔獣', hp: 160, dmg: 12,
      intro: 'グオオ…この草原は、我が赤き霧に染まるのだ',
      taunt: ['ぬるい！', 'その程度か', 'グハハ、まちがえたな'],
      rule: '問題に正解すると攻撃。**5 秒以内**ならクリティカル（2倍）、**3 連続**正解で FEVER。\nまちがえると反撃（ライフ −1）。HP を削りきったら、とどめの詠唱！',
      qs: Object.keys(Y.QS), finisher: 'bromination',
      reward: '🏆 1章クリア！ 草原に色がもどった。\n（2章「酸素の森」は準備中）',
      art: '<svg viewBox="0 0 200 200" class="boss-art bromos"><g class="body">' +
        '<path d="M58 70l-14-34 30 22M142 70l14-34-30 22" fill="#7a2a12"/>' +
        '<path d="M100 44c-48 0-74 40-74 84 0 30 22 48 74 48s74-18 74-48c0-44-26-84-74-84z" fill="#b5482a"/>' +
        '<path d="M100 44c-48 0-74 40-74 84 0 30 22 48 74 48s74-18 74-48c0-44-26-84-74-84z" fill="url(#bg1)"/>' +
        '<defs><radialGradient id="bg1" cx=".4" cy=".3"><stop offset="0" stop-color="#ff9a6b" stop-opacity=".7"/><stop offset="1" stop-color="#5a1a08" stop-opacity=".3"/></radialGradient></defs>' +
        '<path d="M62 100l26 10M138 100l-26 10" stroke="#2b0d05" stroke-width="7" stroke-linecap="round"/><circle cx="78" cy="118" r="9" fill="#ffd23f"/><circle cx="122" cy="118" r="9" fill="#ffd23f"/>' +
        '<path d="M70 146q30 18 60 0l-8 10-8-8-8 10-8-10-8 10-8-10z" fill="#2b0d05"/><text x="100" y="92" text-anchor="middle" font-size="18" fill="#ffe0c8" font-weight="800">Br₂</text></g></svg>'
    }
  };

  /* 地図の順番（レッスンとボス） */
  Y.ROUTE = ['p1', 'p2', 'p3', 'mirage', 'c1', 'c2', 'c3', 'bromos'];
})();
