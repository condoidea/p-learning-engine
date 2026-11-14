/* =========================================================
 * ¡PEGA! — 語尾タイルを貼って単語をふやす。教材データ（v3）
 *
 *  SUF    語尾タイル 8枚。grp＝何に貼るか（adj 形容詞／verb 動詞／noun 名詞）＝棚の段。kind＝何を言う語か（KINDS）。並び・色は変えない
 *    role   タイルの下の一言（採点する注文では隠す）／en 英語で同じ仕事の語尾
 *    short  まちがえたときに出す1行
 *    gnote  el / la の問題の説明（なければ el / la の問題は出さない）
 *  STAGES 習う順。1段階＝くらべる語尾2枚と、そのきまり（rule）
 *  入荷する語の並び＝出会う順。同じ元の語から2枚の語尾でできる組を先に置く（くらべて見せる）
 *
 *  WORDS  W(語尾, 元の語, 元の語の意味, 'できる語（語幹|語尾）', 意味, 性, おまけ)
 *    性  f＝la  m＝el  mf＝el・la  ''＝名詞ではない
 *    おまけ  x:1＝入荷では出さず「初見チャレンジ」で読む語／sfs＝語尾が2枚の語（内側から順に）／root・rja＝いちばん元の語
 *            bad＝つづりのひっかけ（実在しない形）／memo＝ひとこと
 *  CLOZE  文に合う形。C(答えの語の id, 文（___ が空所）, [正解, はずれ…], 訳, なぜ)
 *         はずれに「入れても正しくなる形」を置かない（形容詞を副詞のように使える所は避ける）
 *
 *  語の級は目安（西検は公式の単語リストを公開していない）。
 * ========================================================= */
(function () {
  'use strict';
  var SUF = [
    { id: 'mente', label: '-mente', grp: 'adj', kind: 'adv', role: 'どんなふうに', color: '#5fdc94', en: '-ly（really）', short: '形容詞に貼る →「どんなふうに（〜に・〜く）」（副詞）' },
    { id: 'dad', label: '-dad', grp: 'adj', kind: 'thing', role: 'もの・こと', color: '#6cb4ff', en: '-ty（reality）', short: '形容詞に貼る →「〜さ・〜であること」（名詞・la）', gnote: '-dad・-tad は、かならず女性名詞（la）' },
    { id: 'cion', label: '-ción', grp: 'verb', kind: 'thing', role: 'もの・こと', color: '#ff7a6b', en: '-tion（organization）', short: '動詞に貼る →「〜すること・〜したもの」（名詞・la）', gnote: '-ción・-sión は、かならず女性名詞（la）' },
    { id: 'dor', label: '-dor', grp: 'verb', kind: 'person', role: 'する人・道具', color: '#ffae52', en: '-er・-or（organizer）', short: '動詞に貼る →「〜する人」か「〜する道具」' },
    { id: 'oso', label: '-oso', grp: 'noun', kind: 'adj', role: 'どんな〜', color: '#ffd84d', en: '-ous（famous）', short: '名詞に貼る →「〜のある・〜がいっぱいの」（形容詞）' },
    { id: 'ista', label: '-ista', grp: 'noun', kind: 'person', role: 'それをする人', color: '#c9a0ff', en: '-ist（artist）', short: '名詞に貼る →「それをする人・専門の人」（スポーツ・芸術・楽器など。el・la 同じ形）', gnote: '-ista は男女で同じ形。冠詞だけ変える（el・la どちらも）' },
    { id: 'ero', label: '-ero', grp: 'noun', kind: 'person', role: '作る・売る人', color: '#ff8fc7', en: '（英語にはない）', short: '名詞に貼る →「それを作る・扱う・売る人」（パン・靴・手紙など）' },
    { id: 'eria', label: '-ería', grp: 'noun', kind: 'shop', role: '店', color: '#ffc4e3', en: '（英語にはない）', short: '名詞に貼る →「それを売る店」（la）', gnote: '店の -ería は、かならず女性名詞（la）' }
  ];
  /* 何を言う語か（注文の1手目）。同じ「もの・こと」でも、元の語が形容詞なら -dad、動詞なら -ción */
  var KINDS = { adv: 'どんなふうに（〜に・〜く）', thing: 'もの・こと（〜さ・〜すること）', person: '人（〜する人・道具）', adj: 'どんな〜（〜のある）', shop: '店' };
  /* 習う順。1段階で語尾を2枚ずつ、くらべながら入れる（1枚だけだと「選ぶ」が成り立たない） */
  var STAGES = [
    { ids: ['mente', 'dad'], q: '「本当に」はどっち？',
      rule: '形容詞に貼るタイルは2枚。<b>どんなふうに（〜に・〜く）</b>を言うなら <b>-mente</b>（副詞。英語の -ly：really）。<b>もの・こと（〜さ）</b>を言うなら <b>-dad</b>（名詞。英語の -ty：reality）。<b>-dad の語はかならず la</b>。-o で終わる形容詞は、-mente の前で <b>-a に変える</b>（tranquilo → tranquilamente）。' },
    { ids: ['cion', 'dor'],
      rule: '動詞に貼るタイルは2枚。<b>すること・したもの</b>（名詞）なら <b>-ción</b>（英語の -tion：organization）。<b>する人・する道具</b>なら <b>-dor</b>（英語の -er・-or：organizer）。<b>-ción の語はかならず la</b>。-dor の人は el（女性は -dora）。<br>同じ「もの・こと」でも、<b>元の語が形容詞なら -dad、動詞なら -ción</b>。' },
    { ids: ['oso', 'ista'], nopair: true,   /* 同じ名詞から -oso と -ista の両方ができる 4級の語はない。ちがう名詞どうしでくらべる */
      rule: '名詞に貼るタイル。<b>どんな〜（〜のある・〜がいっぱいの）</b>と説明する形容詞なら <b>-oso</b>（英語の -ous：famous）。女性には -osa。<b>それをする人・専門の人</b>なら <b>-ista</b>（英語の -ist：artist）。<b>-ista は男女で同じ形</b>（el・la artista）。<br>同じ「人」でも、<b>元の語が動詞なら -dor、名詞なら -ista</b>。' },
    { ids: ['ero', 'eria'],
      rule: '名詞に貼るタイル、さらに2枚。<b>それを作る・扱う・売る人</b>なら <b>-ero</b>（女性は -era）。<b>それを売る店</b>なら <b>-ería</b>（<b>かならず la</b>）。<br>-ista は「それをする人（スポーツ・芸術・楽器）」、-ero は「物を作る・売る人（パン・靴・手紙）」。' }
  ];
  var GRP = { adj: '形容詞', verb: '動詞', noun: '名詞' };

  var WORDS = [];
  function W(sf, base, bja, w, ja, g, x) {
    var o = { id: w.replace(/\|/g, ''), sf: sf, base: base, bja: bja, w: w, ja: ja, g: g || '' };
    if (x) for (var k in x) o[k] = x[k];
    WORDS.push(o);
  }
  var X = { x: 1 };
  function xx(o) { o.x = 1; return o; }

  /* ---- -mente：形容詞 → 副詞 ---- */
  W('mente', 'normal', 'ふつうの', 'normal|mente', 'ふつうは');
  W('mente', 'rápido', '速い', 'rápida|mente', '速く', '', { bad: ['rápidomente'] });
  W('mente', 'fácil', 'かんたんな', 'fácil|mente', 'かんたんに');
  W('mente', 'real', '本当の・現実の', 'real|mente', '本当に');
  W('mente', 'tranquilo', '落ち着いた', 'tranquila|mente', '落ち着いて', '', { bad: ['tranquilomente'] });
  W('mente', 'posible', '可能な', 'posible|mente', 'もしかすると');
  W('mente', 'seguro', '確かな・安全な', 'segura|mente', 'きっと・おそらく', '', { bad: ['seguromente'], memo: '「確かに」より弱く、「おそらく」くらいで使うことが多い' });
  W('mente', 'final', '最後の', 'final|mente', 'ついに・最後に');
  W('mente', 'feliz', '幸せな', 'feliz|mente', '幸いにも', '', X);
  W('mente', 'libre', '自由な', 'libre|mente', '自由に', '', X);

  /* ---- -dad：形容詞 → 名詞（la） ---- */
  W('dad', 'real', '本当の・現実の', 'reali|dad', '現実', 'f');
  W('dad', 'tranquilo', '落ち着いた', 'tranquili|dad', '落ち着き・静けさ', 'f');
  W('dad', 'posible', '可能な', 'posibili|dad', '可能性', 'f');
  W('dad', 'seguro', '確かな・安全な', 'seguri|dad', '安全', 'f');
  W('dad', 'feliz', '幸せな', 'felici|dad', '幸福', 'f', { bad: ['felizdad'], memo: '形が少し変わる（z → c）' });
  W('dad', 'libre', '自由な', 'liber|tad', '自由', 'f', { bad: ['libredad'], memo: '-tad の形' });
  W('dad', 'difícil', 'むずかしい', 'dificul|tad', '困難', 'f', { bad: ['dificildad'], memo: '-tad の形' });
  W('dad', 'enfermo', '病気の', 'enferme|dad', '病気', 'f');
  W('dad', 'fácil', 'かんたんな', 'facili|dad', 'かんたんさ', 'f', X);
  W('dad', 'normal', 'ふつうの', 'normali|dad', 'ふだんどおりの状態', 'f', X);

  /* ---- -ción：動詞 → 名詞（la） ---- */
  W('cion', 'informar', '知らせる', 'informa|ción', '情報', 'f');
  W('cion', 'invitar', '招待する', 'invita|ción', '招待', 'f');
  W('cion', 'preparar', '準備する', 'prepara|ción', '準備', 'f');
  W('cion', 'explicar', '説明する', 'explica|ción', '説明', 'f');
  W('cion', 'educar', '教育する', 'educa|ción', '教育', 'f');
  W('cion', 'organizar', '企画する・組織する', 'organiza|ción', '組織・企画', 'f');
  W('cion', 'decorar', 'かざる', 'decora|ción', 'かざりつけ', 'f');
  W('cion', 'decidir', '決める', 'deci|sión', '決定', 'f', { bad: ['decidición'], memo: '-sión の形' });
  W('cion', 'habitar', '住む', 'habita|ción', '部屋', 'f', xx({ memo: '「住む所」から、部屋' }));
  W('cion', 'cantar', '歌う', 'can|ción', '歌', 'f', xx({ memo: '形が少し縮まる（cantar → canción）' }));
  W('cion', 'comunicar', '伝える', 'comunica|ción', '伝達・通信', 'f', X);

  /* ---- -dor：動詞 → 人・道具 ---- */
  W('dor', 'trabajar', '働く', 'trabaja|dor', '働き者・労働者', 'm');
  W('dor', 'jugar', '（試合・ゲームを）する', 'juga|dor', '（試合の）選手', 'm');
  W('dor', 'vender', '売る', 'vende|dor', '販売員', 'm');
  W('dor', 'ganar', '勝つ', 'gana|dor', '勝者', 'm');
  W('dor', 'organizar', '企画する・組織する', 'organiza|dor', '主催者', 'm');
  W('dor', 'educar', '教育する', 'educa|dor', '教育者', 'm');
  W('dor', 'decorar', 'かざる', 'decora|dor', 'かざりつけをする人', 'm');
  W('dor', 'despertar', '目を覚まさせる', 'desperta|dor', '目覚まし時計', 'm', { memo: '道具の -dor' });
  W('dor', 'comprar', '買う', 'compra|dor', '買い手', 'm', X);
  W('dor', 'ordenar', '整理する', 'ordena|dor', 'コンピュータ', 'm', xx({ memo: 'スペインでの言い方。道具の -dor' }));
  W('dor', 'secar', 'かわかす', 'seca|dor', 'ドライヤー', 'm', X);
  W('dor', 'lavar', '洗う', 'lava|dora', '洗濯機', 'f', xx({ memo: '機械は -dora になる語もある' }));

  /* ---- -oso：名詞 → 形容詞 ---- */
  W('oso', 'fama', '名声', 'fam|oso', '有名な');
  W('oso', 'peligro', '危険', 'peligr|oso', '危険な');
  W('oso', 'nervio', '神経', 'nervi|oso', '緊張した');
  W('oso', 'maravilla', 'すばらしいもの', 'maravill|oso', 'すばらしい');
  W('oso', 'lluvia', '雨', 'lluvi|oso', '雨の多い');
  W('oso', 'ruido', '騒音', 'ruid|oso', 'うるさい');
  W('oso', 'cariño', '愛情', 'cariñ|oso', '愛情深い');
  W('oso', 'misterio', 'なぞ', 'misteri|oso', 'ふしぎな');
  /* 語尾が2枚：名詞 → -oso → -mente */
  W('mente', 'peligroso', '危険な', 'peligr|osa|mente', '危なっかしく', '', xx({ sfs: ['oso', 'mente'], root: 'peligro', rja: '危険' }));
  W('mente', 'maravilloso', 'すばらしい', 'maravill|osa|mente', 'すばらしく', '', xx({ sfs: ['oso', 'mente'], root: 'maravilla', rja: 'すばらしいもの' }));
  W('mente', 'cariñoso', '愛情深い', 'cariñ|osa|mente', '愛情をこめて', '', xx({ sfs: ['oso', 'mente'], root: 'cariño', rja: '愛情' }));
  W('mente', 'nervioso', '緊張した', 'nervi|osa|mente', 'そわそわと', '', xx({ sfs: ['oso', 'mente'], root: 'nervio', rja: '神経' }));

  /* ---- -ista：名詞 → 人（el・la） ---- */
  W('ista', 'arte', '芸術', 'art|ista', '芸術家', 'mf');
  W('ista', 'periódico', '新聞', 'period|ista', '記者', 'mf');
  W('ista', 'diente', '歯', 'dent|ista', '歯医者', 'mf');
  W('ista', 'piano', 'ピアノ', 'pian|ista', 'ピアニスト', 'mf');
  W('ista', 'taxi', 'タクシー', 'tax|ista', 'タクシー運転手', 'mf');
  W('ista', 'fútbol', 'サッカー', 'futbol|ista', 'サッカー選手', 'mf');
  W('ista', 'deporte', 'スポーツ', 'deport|ista', 'スポーツをする人', 'mf');
  W('ista', 'guitarra', 'ギター', 'guitarr|ista', 'ギタリスト', 'mf');
  W('ista', 'real', '本当の・現実の', 'real|ista', '現実的な（人）', 'mf', xx({ memo: '形容詞に貼ることもある' }));
  W('ista', 'final', '最後の', 'final|ista', '決勝に進んだ人', 'mf', xx({ memo: 'la final（決勝）から' }));
  W('ista', 'recepción', '受付', 'recepcion|ista', '受付係', 'mf', X);
  W('ista', 'flor', '花', 'flor|ista', '花屋さん（人）', 'mf', X);

  /* ---- -ero・-ería：名詞 → 人・店 ---- */
  W('ero', 'pan', 'パン', 'panad|ero', 'パン職人', 'm');
  W('eria', 'pan', 'パン', 'panad|ería', 'パン屋（店）', 'f');
  W('eria', 'zapato', '靴', 'zapat|ería', '靴屋（店）', 'f');
  W('eria', 'fruta', '果物', 'frut|ería', '果物屋（店）', 'f');
  W('eria', 'pelo', '髪', 'peluqu|ería', '美容院', 'f', { memo: '形が少し変わる（pelo → peluqu-）' });
  W('ero', 'cocina', '料理・台所', 'cocin|ero', '料理人', 'm');
  W('ero', 'carta', '手紙', 'cart|ero', '郵便配達員', 'm');
  W('eria', 'libro', '本', 'libr|ería', '本屋（店）', 'f', { memo: '英語の library（図書館＝biblioteca）ではない' });
  W('ero', 'zapato', '靴', 'zapat|ero', '靴職人', 'm');
  W('ero', 'pelo', '髪', 'peluqu|ero', '美容師', 'm');
  W('ero', 'enfermo', '病人', 'enferm|ero', '看護師', 'm', X);
  W('eria', 'helado', 'アイスクリーム', 'helad|ería', 'アイスクリーム屋', 'f', X);
  W('eria', 'pastel', 'ケーキ', 'pastel|ería', 'ケーキ屋', 'f', X);
  W('eria', 'reloj', '時計', 'reloj|ería', '時計屋', 'f', X);
  W('eria', 'café', 'コーヒー', 'cafet|ería', '喫茶店', 'f', X);

  /* ---- 文に合う形 ---- */
  var CLOZE = [];
  function C(w, s, opts, ja, why) { CLOZE.push({ id: 'c' + (CLOZE.length + 1), w: w, s: s, opts: opts, ja: ja, why: why }); }
  C('normalmente', '___ voy al trabajo en tren.', ['Normalmente', 'Normalidad', 'Normal'], 'ふつうは、電車で仕事に行く。', '文ぜんたいのようすを言う語が入る → 副詞 → -mente');
  C('realmente', 'Es ___ imposible.', ['realmente', 'realidad', 'realista'], '本当に不可能だ。', '形容詞 imposible を強める語が入る → 副詞 → -mente');
  C('finalmente', '___ llegamos a Madrid a las diez.', ['Finalmente', 'Final', 'Finalista'], 'ついに、10時にマドリードに着いた。', '文ぜんたいのようすを言う語が入る → 副詞 → -mente');
  C('libertad', 'La ___ es muy importante para mí.', ['libertad', 'libre', 'libremente'], '自由は私にとってとても大切だ。', 'la のあとで、文の主語になる → 名詞 → -tad（-dad の仲間）');
  C('posibilidad', 'Hay una ___ de lluvia.', ['posibilidad', 'posible', 'posiblemente'], '雨の可能性がある。', 'una のあと → 名詞 → -dad');
  C('felicidad', 'El dinero no da la ___.', ['felicidad', 'feliz', 'felizmente'], 'お金は幸福をくれない。', 'la のあと → 名詞 → -dad');
  C('seguridad', 'La ___ es lo primero.', ['seguridad', 'seguro', 'seguramente'], '安全が第一だ。', 'la のあとで、文の主語になる → 名詞 → -dad');
  C('organización', 'Trabajo en una ___ internacional.', ['organización', 'organizar', 'organizador'], '国際的な組織で働いている。', 'una のあと → 女性名詞 → -ción（organizador は男性なので una に合わない）');
  C('decoración', 'La ___ de la fiesta es muy bonita.', ['decoración', 'decorar', 'decorador'], 'パーティーのかざりつけはとてもきれいだ。', 'la のあと → 女性名詞 → -ción');
  C('información', 'Necesito más ___ sobre el hotel.', ['información', 'informar'], 'ホテルについて、もっと情報が必要だ。', 'más ＋ 名詞（もっと多くの〜）→ -ción');
  C('organizador', 'El ___ de la fiesta es mi tío.', ['organizador', 'organización', 'organizar'], 'パーティーの主催者は私のおじだ。', 'el のあとで「人」→ -dor（organización は女性なので el に合わない）');
  C('ganador', 'El ___ del partido recibe un premio.', ['ganador', 'ganar'], '試合の勝者は賞をもらう。', 'el のあとで、賞をもらう「人」→ -dor');
  C('despertador', 'Pongo el ___ a las seis.', ['despertador', 'despertar'], '目覚まし時計を6時にセットする。', 'el のあとで、セットする「道具」→ -dor');
  C('peligroso', 'Es una ciudad muy ___.', ['peligrosa', 'peligro', 'peligrosamente'], 'とても危険な町だ。', 'muy のあとで ciudad（女性）を説明する → 形容詞の女性形 → -osa');
  C('ruidoso', 'Las calles son muy ___ por la noche.', ['ruidosas', 'ruidoso', 'ruido'], '通りは夜、とてもうるさい。', 'las calles（女性・複数）を説明する → 形容詞を女性・複数に → -osas');
  C('cariñoso', 'Mi abuela es muy ___ con los niños.', ['cariñosa', 'cariñoso', 'cariño'], '祖母は子どもたちにとても愛情深い。', 'abuela（女性）を説明する → 形容詞の女性形 → -osa');
  C('lluvioso', 'Hoy es un día ___.', ['lluvioso', 'lluviosa', 'lluvia'], '今日は雨の多い日だ。', 'día（男性）を説明する → 形容詞の男性形 → -oso');
  C('periodista', 'Mi hermano es ___ en un periódico.', ['periodista', 'periodisto', 'periódico'], '兄は新聞社で記者をしている。', '人を言う → -ista。男性でも -ista（-isto という形はない）');
  C('taxista', 'El ___ lleva a los turistas al hotel.', ['taxista', 'taxisto', 'taxi'], 'タクシー運転手が観光客をホテルへ連れていく。', '連れていく「人」→ -ista。男性でも -ista');
  C('panadería', 'Compro el pan en la ___.', ['panadería', 'panadero', 'pan'], 'パンはパン屋で買う。', 'en la のあとで、買う「場所」→ 店 → -ería（la）');
  C('librería', 'Voy a la ___ para comprar un libro.', ['librería', 'librero', 'libro'], '本を買いに本屋へ行く。', 'a la のあとで、行く「場所」→ 店 → -ería（la）');
  C('cartero', 'El ___ trae las cartas por la mañana.', ['cartero', 'carta'], '郵便配達員は朝、手紙を持ってくる。', '持ってくる「人」→ -ero（carta は女性なので el に合わない）');
  C('cocinero', 'El ___ de este restaurante es muy bueno.', ['cocinero', 'cocina'], 'このレストランの料理人はとても腕がいい。', 'el のあとで「人」→ -ero（cocina は女性なので el に合わない）');

  var PEGA = { SUF: SUF, KINDS: KINDS, STAGES: STAGES, GRP: GRP, WORDS: WORDS, CLOZE: CLOZE };
  if (typeof module !== 'undefined' && module.exports) module.exports = PEGA;
  if (typeof window !== 'undefined') window.PEGA = PEGA;
})();
