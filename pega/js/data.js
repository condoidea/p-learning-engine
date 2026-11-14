/* =========================================================
 * ¡PEGA! — 接尾辞（語尾）で単語をふやす。教材データ
 *
 *  SUF   接尾辞 7つ（並び＝習う順・ボタンの並び。変えない）
 *    id / label（ボタンの字）/ role（ボタンの下の一言）/ color
 *    short  まちがえたときに出す1行（何から何をつくるか）
 *    q・opts・a  見本を見たあとの予想の問い（opts[a] が正解）
 *    rule   きまり（見本と予想のあとに出す）
 *    gnote  el / la の問題の説明（なければ el / la の問題は出さない）
 *
 *  WORDS  1つの接尾辞に10語。W(接尾辞, 元の語, 元の語の意味, できる語, 意味, 性, おまけ)
 *    できる語は「語幹|語尾」と書く（語尾に色をつける）
 *    性  f＝la  m＝el  mf＝el・la  ''＝名詞ではない
 *    おまけ  w2・ja2＝同じ元の語からできる店（-ería）／bad＝-mente のまちがった形／memo＝ひとこと
 *
 *  語の級は目安（西検は公式の単語リストを公開していない）。
 * ========================================================= */
(function () {
  'use strict';
  var SUF = [
    { id: 'cion', label: '-ción', role: '〜すること', color: '#ff7a6b',
      short: '動詞 →「〜すること」（名詞・la）',
      q: '-ción がつくと、動詞は何になった？',
      opts: ['「〜すること・〜したもの」という名詞', '「〜な」という形容詞', '「〜に」という副詞'], a: 0,
      rule: '<b>動詞 ＋ -ción ＝「〜すること」（名詞）</b>。英語の -tion（information）にあたる。<b>かならず女性名詞（la）</b>。decisión のように -sión になる語もある。',
      gnote: '-ción・-sión は、かならず女性名詞（la）' },
    { id: 'dad', label: '-dad', role: '〜さ', color: '#6cb4ff',
      short: '形容詞 →「〜さ・〜であること」（名詞・la）',
      q: '-dad がつくと、形容詞は何になった？',
      opts: ['「〜さ・〜であること」という名詞', '「〜に」という副詞', '「〜する人」'], a: 0,
      rule: '<b>形容詞 ＋ -dad ＝「〜さ・〜であること」（名詞）</b>。英語の -ty（possibility）にあたる。<b>かならず女性名詞（la）</b>。libertad のように -tad になる語もある。',
      gnote: '-dad・-tad は、かならず女性名詞（la）' },
    { id: 'mente', label: '-mente', role: '〜に', color: '#5fdc94',
      short: '形容詞 →「〜に・〜く」（副詞）',
      q: '-mente がつくと、形容詞は何になった？',
      opts: ['「〜に・〜く」と、動きのようすを言う語（副詞）', '「〜さ」という名詞', '「〜する人」'], a: 0,
      rule: '<b>形容詞 ＋ -mente ＝「〜に・〜く」（副詞）</b>。英語の -ly（normally）にあたる。-o で終わる形容詞は、<b>-a に変えてから</b>つける（rápido → rápida → rápidamente）。' },
    { id: 'oso', label: '-oso', role: '〜の多い', color: '#ffd24d',
      short: '名詞 →「〜がいっぱいの・〜のある」（形容詞）',
      q: '-oso がつくと、名詞は何になった？',
      opts: ['「〜がいっぱいの・〜のある」という形容詞', '「〜すること」という名詞', '「〜に」という副詞'], a: 0,
      rule: '<b>名詞 ＋ -oso ＝「〜がいっぱいの・〜のある」（形容詞）</b>。英語の -ous（famous）にあたる。形容詞なので、<b>女性には -osa</b>、複数には -osos・-osas。' },
    { id: 'ista', label: '-ista', role: '〜の人', color: '#c99bff',
      short: '名詞 →「それをする人・専門の人」（el・la 同じ形）',
      q: '-ista がつくと、何になった？',
      opts: ['「それをする人・専門の人」', '「それを売る店」', '「〜な」という形容詞'], a: 0,
      rule: '<b>名詞 ＋ -ista ＝「それをする人・専門の人」</b>。英語の -ist（artist）にあたる。<b>男性でも女性でも -ista</b>。冠詞だけ変える（el artista／la artista）。',
      gnote: '-ista は男女で同じ形。冠詞だけ変える（el・la どちらも）' },
    { id: 'ero', label: '-ero・-ería', role: '職人・店', color: '#ffa052', wide: true,
      short: '名詞 → -ero「それを扱う人」／-ería「その店」',
      q: '-ero と -ería、どうちがった？',
      opts: ['-ero は人、-ería は店', '-ero は店、-ería は人', 'どちらも人'], a: 0,
      rule: '<b>名詞 ＋ -ero ＝「それを扱う人」、名詞 ＋ -ería ＝「それを売る店」</b>。人は、女性なら -era（la panadera）。<b>店の -ería は、かならず女性名詞（la）</b>。',
      gnote: '店の -ería は、かならず女性名詞（la）' },
    { id: 'dor', label: '-dor', role: '人・道具', color: '#45dcd4',
      short: '動詞 →「〜する人」か「〜する道具」',
      q: '-dor がつくと、動詞は何になった？',
      opts: ['「〜する人」や「〜する道具」', '「〜すること」という名詞', '「〜に」という副詞'], a: 0,
      rule: '<b>動詞 ＋ -dor ＝「〜する人」か「〜する道具」</b>。英語の -er・-or（player）にあたる。女性は -dora。機械にも -dora の語がある（la lavadora）。ふつう、<b>-ista・-ero は名詞に、-dor は動詞に</b>つく。' }
  ];

  var WORDS = [];
  function W(sf, base, baseJa, w, ja, g, x) {
    var o = { id: w.replace('|', ''), sf: sf, base: base, baseJa: baseJa, w: w, ja: ja, g: g || '' };
    if (x) for (var k in x) o[k] = x[k];
    WORDS.push(o);
  }

  /* -ción：動詞 → 名詞 */
  W('cion', 'informar', '知らせる', 'informa|ción', '情報', 'f');
  W('cion', 'invitar', '招待する', 'invita|ción', '招待', 'f');
  W('cion', 'preparar', '準備する', 'prepara|ción', '準備', 'f');
  W('cion', 'explicar', '説明する', 'explica|ción', '説明', 'f');
  W('cion', 'habitar', '住む', 'habita|ción', '部屋', 'f', { memo: '「住む所」から、部屋' });
  W('cion', 'comunicar', '伝える', 'comunica|ción', '伝達・通信', 'f');
  W('cion', 'educar', '教育する', 'educa|ción', '教育', 'f');
  W('cion', 'cantar', '歌う', 'can|ción', '歌', 'f', { memo: '形が少し縮まる（cantar → canción）' });
  W('cion', 'decidir', '決める', 'deci|sión', '決定', 'f', { memo: '-sión の形' });
  W('cion', 'traducir', '翻訳する', 'traduc|ción', '翻訳', 'f');

  /* -dad：形容詞 → 名詞 */
  W('dad', 'feliz', '幸せな', 'felici|dad', '幸福', 'f');
  W('dad', 'posible', '可能な', 'posibili|dad', '可能性', 'f');
  W('dad', 'real', '現実の・本当の', 'reali|dad', '現実', 'f');
  W('dad', 'necesario', '必要な', 'necesi|dad', '必要', 'f');
  W('dad', 'enfermo', '病気の', 'enferme|dad', '病気', 'f');
  W('dad', 'difícil', 'むずかしい', 'dificul|tad', '困難', 'f', { memo: '-tad の形' });
  W('dad', 'libre', '自由な', 'liber|tad', '自由', 'f', { memo: '-tad の形' });
  W('dad', 'seguro', '安全な', 'seguri|dad', '安全', 'f');
  W('dad', 'activo', '活発な', 'activi|dad', '活動', 'f');
  W('dad', 'tranquilo', '落ち着いた', 'tranquili|dad', '落ち着き・静けさ', 'f');

  /* -mente：形容詞 → 副詞 */
  W('mente', 'normal', 'ふつうの', 'normal|mente', 'ふつうは', '');
  W('mente', 'rápido', '速い', 'rápida|mente', '速く', '', { bad: 'rápidomente' });
  W('mente', 'fácil', 'かんたんな', 'fácil|mente', 'かんたんに', '');
  W('mente', 'lento', 'おそい', 'lenta|mente', 'ゆっくりと', '', { bad: 'lentomente' });
  W('mente', 'general', '一般の', 'general|mente', '一般に・たいてい', '');
  W('mente', 'solo', 'ただ1つの', 'sola|mente', '〜だけ', '', { bad: 'solomente' });
  W('mente', 'final', '最後の', 'final|mente', 'ついに・最後に', '');
  W('mente', 'real', '現実の・本当の', 'real|mente', '本当に', '');
  W('mente', 'probable', 'ありそうな', 'probable|mente', 'たぶん', '');
  W('mente', 'actual', '現在の', 'actual|mente', '現在は', '', { memo: '英語の actually（実は）とは意味がちがう' });

  /* -oso：名詞 → 形容詞 */
  W('oso', 'fama', '名声', 'fam|oso', '有名な', '');
  W('oso', 'peligro', '危険', 'peligr|oso', '危険な', '');
  W('oso', 'nervio', '神経', 'nervi|oso', '緊張した', '');
  W('oso', 'maravilla', 'すばらしいもの', 'maravill|oso', 'すばらしい', '');
  W('oso', 'delicia', 'おいしいもの', 'delici|oso', 'とてもおいしい', '');
  W('oso', 'lluvia', '雨', 'lluvi|oso', '雨の多い', '');
  W('oso', 'cariño', '愛情', 'cariñ|oso', '愛情深い', '');
  W('oso', 'ruido', '騒音', 'ruid|oso', 'うるさい', '');
  W('oso', 'misterio', 'なぞ', 'misteri|oso', 'ふしぎな', '');
  W('oso', 'calor', '暑さ', 'calur|oso', '暑い（日・気候が）', '', { memo: '形が少し変わる（calor → caluroso）' });

  /* -ista：名詞 → 人 */
  W('ista', 'arte', '芸術', 'art|ista', '芸術家', 'mf');
  W('ista', 'periódico', '新聞', 'period|ista', '記者', 'mf');
  W('ista', 'turismo', '観光', 'tur|ista', '観光客', 'mf');
  W('ista', 'diente', '歯', 'dent|ista', '歯医者', 'mf');
  W('ista', 'taxi', 'タクシー', 'tax|ista', 'タクシー運転手', 'mf');
  W('ista', 'piano', 'ピアノ', 'pian|ista', 'ピアニスト', 'mf');
  W('ista', 'fútbol', 'サッカー', 'futbol|ista', 'サッカー選手', 'mf');
  W('ista', 'deporte', 'スポーツ', 'deport|ista', 'スポーツをする人', 'mf');
  W('ista', 'guitarra', 'ギター', 'guitarr|ista', 'ギタリスト', 'mf');
  W('ista', 'recepción', '受付', 'recepcion|ista', '受付係', 'mf');

  /* -ero・-ería：名詞 → 人・店 */
  W('ero', 'pan', 'パン', 'panad|ero', 'パン職人', 'm', { w2: 'panad|ería', ja2: 'パン屋（店）' });
  W('ero', 'libro', '本', 'libr|ero', '本屋の店員', 'm', { w2: 'libr|ería', ja2: '本屋（店）', memo: 'librería は英語の library（図書館＝biblioteca）ではない' });
  W('ero', 'zapato', '靴', 'zapat|ero', '靴職人', 'm', { w2: 'zapat|ería', ja2: '靴屋（店）' });
  W('ero', 'carne', '肉', 'carnic|ero', '肉屋の店員', 'm', { w2: 'carnic|ería', ja2: '肉屋（店）' });
  W('ero', 'fruta', '果物', 'frut|ero', '果物屋の店員', 'm', { w2: 'frut|ería', ja2: '果物屋（店）' });
  W('ero', 'pelo', '髪', 'peluqu|ero', '美容師', 'm', { w2: 'peluqu|ería', ja2: '美容院', memo: '形が少し変わる（pelo → peluquero）' });
  W('ero', 'cocina', '料理・台所', 'cocin|ero', '料理人', 'm');
  W('ero', 'carta', '手紙', 'cart|ero', '郵便配達員', 'm');
  W('ero', 'enfermo', '病人', 'enferm|ero', '看護師', 'm');
  W('ero', 'café', 'コーヒー', 'cafet|ería', '喫茶店', 'f');

  /* -dor：動詞 → 人・道具 */
  W('dor', 'trabajar', '働く', 'trabaja|dor', '働く人・労働者', 'm');
  W('dor', 'jugar', '（試合・ゲームを）する', 'juga|dor', '（試合の）選手', 'm');
  W('dor', 'vender', '売る', 'vende|dor', '販売員', 'm');
  W('dor', 'ordenar', '整理する', 'ordena|dor', 'コンピュータ', 'm', { memo: 'スペインでの言い方。道具の -dor' });
  W('dor', 'despertar', '目を覚まさせる', 'desperta|dor', '目覚まし時計', 'm');
  W('dor', 'ganar', '勝つ', 'gana|dor', '勝者', 'm');
  W('dor', 'entrenar', 'きたえる', 'entrena|dor', 'コーチ・監督', 'm');
  W('dor', 'secar', 'かわかす', 'seca|dor', 'ドライヤー', 'm');
  W('dor', 'lavar', '洗う', 'lava|dora', '洗濯機', 'f', { memo: '機械は -dora になる語もある' });
  W('dor', 'comer', '食べる', 'come|dor', '食堂', 'm', { memo: '「食べる所」。-dor は場所になることもある' });

  var PEGA = { SUF: SUF, WORDS: WORDS };
  if (typeof module !== 'undefined' && module.exports) module.exports = PEGA;
  if (typeof window !== 'undefined') window.PEGA = PEGA;
})();
