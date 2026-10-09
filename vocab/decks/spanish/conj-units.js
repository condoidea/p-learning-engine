/* =========================================================
 * スペイン語の活用レッスン（西検4級の範囲）
 *
 *  1つのユニット＝1つの「くせ」。教えてから問う：
 *    model   お手本の動詞（表で 語幹｜語尾 を色分けして見せる）
 *    rule    覚えること（短く）／ why 「なぜ？」（開いたときだけ）
 *    predict お手本とは別の動詞で予想 { verb, p }（その時制の形を4択で）
 *    tense   このユニットの時制（tenses があれば複数）
 *  練習する動詞は、デッキの動詞からくせで自動で振り分ける（どのデッキでも使える）
 *  お手本・予想の動詞がデッキになくても表示できるよう、lex に意味を持たせる
 *  活用の形は vocab/js/conj-es.js が作る（ここには書かない）
 * ========================================================= */
window.VOCAB_CONJ = {
  /* 時制の手がかり（文の中で、どの時制を使うかを決める言葉） */
  cues: {
    pres: [['Todos los días,', '毎日'], ['Normalmente,', 'ふだん']],
    pret: [['Ayer,', '昨日'], ['El año pasado,', '去年']],
    impf: [['De niño,', '子どものころ（よく）'], ['Antes, siempre', '以前はいつも']],
    perf: [['Hoy ya', '今日はもう'], ['Esta semana', '今週']],
    fut: [['Mañana', '明日'], ['El año que viene', '来年']],
    cond: [['Con más tiempo,', 'もっと時間があれば'], ['En tu lugar,', '君の立場なら']],
    subj: [['Quiero que', '〜してほしい'], ['Ojalá que', '〜だといいな']],
    imp: [['¡Por favor,', 'お願い、'], ['¡Venga,', 'さあ、']]
  },
  /* 時制の見た目（単語キャラの衣装）。色は意味で固定 */
  look: {
    pres: { ico: '▶', color: '#2e8b57' }, pret: { ico: '⏮', color: '#9a5b2e' }, impf: { ico: '🎞', color: '#a0794b' },
    perf: { ico: '✅', color: '#3b7dd8' }, fut: { ico: '⏭', color: '#7a4fd0' }, cond: { ico: '💭', color: '#c06cb0' },
    subj: { ico: '🌈', color: '#d0614a' }, imp: { ico: '📣', color: '#e0a100' }
  },
  lex: { hablar: '話す', comer: '食べる', vivir: '住む・生きる', pensar: '考える・思う', volver: '戻る・帰る', hacer: 'する・作る', poner: '置く',
    ser: '〜である', ir: '行く', levantarse: '起きる', acostarse: '寝る', tener: '持っている', estar: '〜にいる・〜の状態だ' },
  units: [
    { id: 'pres-reg', tense: 'pres', name: '現在・規則', model: 'hablar',
      rule: '語尾をとった形（語幹）に、人ごとの語尾をつける。-ar は a、-er・-ir は e が目印。',
      why: '主語（yo, tú…）を言わなくても、語尾で「誰が」がわかる。だからスペイン語ではよく主語を省く。nosotros と vosotros 以外は、-er と -ir の語尾は同じ。',
      predict: { verb: 'comer', p: 1 } },
    { id: 'pres-stem', tense: 'pres', name: '現在・語幹が変わる', model: 'pensar',
      rule: '強く読む所の母音が変わる：e→ie（pienso）、o→ue（puedo）、e→i（pido）。nosotros・vosotros は変わらない。',
      why: 'nosotros・vosotros は語尾（-amos, -áis）のほうを強く読むので、語幹の母音はそのまま。強く読まれる母音だけが「のびる」と考えるとよい。',
      predict: { verb: 'volver', p: 0 } },
    { id: 'pres-yo', tense: 'pres', name: '現在・yo だけ不規則', model: 'hacer',
      rule: 'yo の形だけが特別（hago, tengo, salgo, conozco, sé）。ほかは規則どおり（tener・venir・decir は語幹も変わる）。',
      why: '-go で終わる yo（tengo, pongo, salgo, hago, digo, vengo）はひとまとめに覚えると楽。この yo の形が、あとで接続法を作るときの元になる。',
      predict: { verb: 'poner', p: 0 } },
    { id: 'pres-irr', tense: 'pres', name: '現在・完全な不規則', model: 'ser',
      rule: 'ser・estar・ir・dar・ver は形ごと覚える。よく使う動詞ほど不規則。',
      why: '毎日たくさん使う語は、言いやすく短く削れていった。だから一番よく使う動詞が一番不規則になる（英語の be も同じ）。',
      predict: { verb: 'ir', p: 3 } },
    { id: 'refl', tense: 'pres', name: '再帰動詞（me levanto）', model: 'levantarse',
      rule: '-se で終わる動詞は、me・te・se・nos・os・se を前につけて活用する。',
      why: 'levantar は「起こす」。levantarse は「自分を起こす」＝起きる。me（私を）が、動詞が自分に向かうことを表している。',
      predict: { verb: 'acostarse', p: 0 } },
    { id: 'pret-reg', tense: 'pret', name: '点過去・規則', model: 'hablar',
      rule: '「〜した」（終わった1回のできごと）。-ar：é, aste, ó…／-er・-ir：í, iste, ió…',
      why: 'yo の é と él の ó は、アクセント記号で強く読む所が語尾に来る（hablé, habló）。記号がないと hable（接続法）や hablo（現在）と区別できない。-car・-gar・-zar は yo で qué・gué・cé にする（音を保つため）。',
      predict: { verb: 'vivir', p: 2 } },
    { id: 'pret-irr', tense: 'pret', name: '点過去・不規則', model: 'tener',
      rule: '特別な語幹（tuv-, estuv-, pud-, pus-, sup-, quis-, vin-, hic-, dij-）＋ e, iste, o, imos, isteis, ieron。ser と ir は同じ fui。',
      why: 'この語尾には、アクセント記号がつかない（tuve, tuvo）。-ir の語幹が変わる動詞は、3人称だけ e→i・o→u（pidió, durmió）。dar と ver は、-er 動詞の語尾で記号なし（di, vio）。',
      predict: { verb: 'estar', p: 0 } },
    { id: 'impf', tense: 'impf', name: '線過去', model: 'hablar',
      rule: '「〜していた・よく〜したものだ」（くり返し・背景）。-ar：aba…／-er・-ir：ía…。不規則は ser（era）・ir（iba）・ver（veía）だけ。',
      why: '点過去は「点」（1回で終わった）、線過去は「線」（続いていた・くり返していた）。Ayer comí paella.（昨日パエリアを食べた）／De niño comía paella.（子どものころよくパエリアを食べていた）',
      predict: { verb: 'vivir', p: 0 } },
    { id: 'perf', tense: 'perf', name: '現在完了', model: 'comer',
      rule: 'haber（he, has, ha, hemos, habéis, han）＋ 過去分詞（-ado・-ido）。「もう〜した・〜したことがある」。',
      why: '過去分詞の不規則は形で覚える：hecho（hacer）、dicho（decir）、visto（ver）、puesto（poner）、vuelto（volver）、escrito（escribir）。hoy・esta semana・ya など「いまにつながる時間」と一緒に使う。',
      predict: { verb: 'hacer', p: 0 } },
    { id: 'fut', tense: 'fut', name: '未来・過去未来', model: 'hablar',
      rule: '原形（hablar）のうしろに語尾。未来：é, ás, á, emos, éis, án／過去未来：ía, ías, ía…。-ar・-er・-ir で同じ語尾。',
      why: '不規則は語幹だけ：tendr-, pondr-, saldr-, vendr-（d が入る）、podr-, sabr-, querr-（e が消える）、har-, dir-（短くなる）。この語幹は未来と過去未来で共通なので、1回覚えれば2つの時制に使える。',
      predict: { verb: 'comer', p: 2 },
      tenses: ['fut', 'cond'] },
    { id: 'subj', tense: 'subj', name: '接続法現在', model: 'tener',
      rule: '直説法現在の yo の形から o をとって、語尾の母音を入れかえる：-ar は e、-er・-ir は a（tengo → tenga, hablo → hable）。',
      why: '「願い・要求・まだ起きていないこと」を言う形。Quiero que vengas.（君に来てほしい）。yo の形から作るので、tengo→tenga、hago→haga、conozco→conozca、pienso→piense と、yo のくせがそのまま残る。例外は形ごと：ser（sea）、ir（vaya）、estar（esté）、dar（dé）、saber（sepa）、haber（haya）。',
      predict: { verb: 'hacer', p: 0 } },
    { id: 'imp', tense: 'imp', name: '命令（tú・usted）', model: 'hablar',
      rule: 'tú は直説法現在の él の形（habla）。usted は接続法（hable）。不規則な tú：ten, ven, pon, sal, haz, di, ve, sé。',
      why: 'tú への命令は、いちばん短い形を使う。usted へのていねいな命令は「〜してくださるように」という接続法の形を借りている。再帰動詞は後ろに te・se をつけて、強く読む所に記号：levántate, levántese。',
      predict: { verb: 'comer', p: 1 } }
  ]
};
