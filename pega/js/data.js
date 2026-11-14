/* =========================================================
 * ¡PEGA! — 語尾のジェムを武器にはめて戦う。教材データ（v5：ジェムの戦い）
 *
 *  武器＝元の語（知っている語）。武器の種類＝品詞：🗡 剣＝形容詞／🪄 杖＝動詞／🪓 斧＝名詞
 *  ジェム＝語尾。はまる武器が決まっている（-mente・-dad は剣、-ción・-dor は杖、ほかは斧）
 *  敵＝空所のある文。弱点＝空所に入る語の種類（ATT）。
 *    武器そのまま（ジェムなし）の弱点は POS[..].asis（剣＝説明、杖＝動作、斧＝もの）
 *    「武器の種類 × 弱点 → ジェム」が1つに決まる（-ista と -ero だけは、どちらも斧の「人」。語ごとに覚える）
 *
 *  F(元の語, ジェム（'' はそのまま）, '形（語幹|語尾）', 意味, 性, おまけ)
 *    性  f＝la  m＝el  mf＝el・la  ''＝名詞ではない
 *    おまけ  x:1＝戦わずに「鑑定」で読む語／sfs＝ジェムが2つの語（内側から）／root・rja＝いちばん元の語／memo＝ひとこと
 *  E(答えの形, 文（___ が空所）, 訳（（　）が空所）, 手がかり, 訳の（　）に入れる語)
 *    手がかり＝「弱点が分かる所」。画面では「🔎 手がかり → 弱点」と出す。はずれのジェムで正しくなる文は置かない
 *  CH  章（ジェム1つずつ）。intro＝宝箱のあと、知っている武器にはめてみる3語／fight＝ボスで初めて戦う語（あてはめ）／asis＝そのままで戦う武器
 *
 *  語の級は目安（西検は公式の単語リストを公開していない）。
 * ========================================================= */
(function () {
  'use strict';
  var POS = {
    adj: { wp: '剣', icon: '🗡️', name: '形容詞', asis: 'desc' },
    verb: { wp: '杖', icon: '🪄', name: '動詞', asis: 'act' },
    noun: { wp: '斧', icon: '🪓', name: '名詞', asis: 'thing' }
  };
  /* 弱点（空所に入る語の種類）。spot＝敵の見分け方（章のはじめに見せる） */
  var ATT = {
    desc: { icon: '🎨', name: '説明', sub: '〜な・どんな', spot: '<b>muy ___</b>・<b>es ___</b>・名詞のすぐあと ＝「どんな」か' },
    adv: { icon: '🌀', name: 'ようす', sub: '〜に・〜く', spot: '動詞の「<b>どんなふうに</b>」が空いている' },
    thing: { icon: '📦', name: 'もの・こと', sub: '〜さ・〜すること', spot: '<b>la・el・una ___</b> ＝ ものごとの名前' },
    act: { icon: '⚡', name: '動作', sub: '〜する', spot: '<b>quiero ___</b>・<b>voy a ___</b> ＝「〜する」' },
    person: { icon: '👤', name: '人・道具', sub: '〜する人', spot: '<b>el・la ___</b> が「<b>だれ</b>」か' },
    shop: { icon: '🏠', name: '店', sub: '〜屋', spot: '<b>en la ___</b>・<b>a la ___</b> が「<b>どの店</b>」か' }
  };
  var GEMS = [
    { id: 'mente', label: '-mente', fit: 'adj', att: 'adv', color: '#5fdc94', en: '-ly', nu: '〜に・〜く', nu2: 'どんなふうにするか', note: '-o は <b>-a</b> にしてからつける（rápid<b>a</b>mente）' },
    { id: 'dad', label: '-dad', fit: 'adj', att: 'thing', color: '#6cb4ff', en: '-ty', nu: '〜さ', nu2: '性質そのものに名前をつける', note: 'いつも <b>la</b>（la realidad）' },
    { id: 'cion', label: '-ción', fit: 'verb', att: 'thing', color: '#ff7a6b', en: '-tion', nu: '〜すること', nu2: '動きに名前をつける。したあとの「もの」にも', note: 'いつも <b>la</b>（la organización）' },
    { id: 'dor', label: '-dor', fit: 'verb', att: 'person', color: '#ffae52', en: '-er', nu: '〜する人', nu2: 'それをする人。それをする道具にも', note: '道具にもなる（despertador 目覚まし時計）' },
    { id: 'oso', label: '-oso', fit: 'noun', att: 'desc', color: '#ffd84d', en: '-ous', nu: '〜だらけ', nu2: 'その物でいっぱいの（peligro 危険 → 危険だらけ＝危ない）', note: '女性の名詞には <b>-osa</b>（una ciudad peligros<b>a</b>）' },
    { id: 'ista', label: '-ista', fit: 'noun', att: 'person', color: '#c9a0ff', en: '-ist', nu: 'その道の人', nu2: 'スポーツ・芸術・楽器など、その道の専門の人', note: '男女で同じ形（el / la artista）', who: 'スポーツ・芸術・楽器など、その道の人は -ista' },
    { id: 'ero', label: '-ero', fit: 'noun', att: 'person', color: '#ff8fc7', en: '', nu: '物をあつかう人', nu2: 'パン・手紙・靴など、身近な物を作る人・売る人', note: '女性は <b>-era</b>（la panader<b>a</b>）', who: 'パン・手紙・靴など、身近な物を作る人・売る人は -ero' },
    { id: 'eria', label: '-ería', fit: 'noun', att: 'shop', color: '#ffc4e3', en: '', nu: '〜の店', nu2: 'その物の店（-ero の人がいる店）', note: 'いつも <b>la</b>（la panadería）' }
  ];

  var WEAPONS = {}, FORMS = [], FOES = [];
  function B(id, ja, pos) { WEAPONS[id] = { id: id, ja: ja, pos: pos }; }
  function F(base, gem, w, ja, g, x) {
    var o = { id: w.replace(/\|/g, ''), base: base, gem: gem, w: w, ja: ja, g: g || '' };
    if (x) for (var k in x) o[k] = x[k];
    FORMS.push(o);
  }
  function E(form, s, ja, clue, fill) { FOES.push({ id: 'e' + (FOES.length + 1), form: form, s: s, ja: ja, clue: clue, fill: fill || '' }); }
  var X = { x: 1 };

  /* ---------- 剣（形容詞） ---------- */
  B('rápido', '速い', 'adj'); B('fácil', 'かんたんな', 'adj'); B('tranquilo', '落ち着いた・静かな', 'adj'); B('real', '本当の・現実の', 'adj');
  B('normal', 'ふつうの', 'adj'); B('posible', '可能な', 'adj'); B('seguro', '安全な・確かな', 'adj'); B('feliz', '幸せな', 'adj'); B('libre', '自由な・ひまな', 'adj');
  /* ---------- 杖（動詞） ---------- */
  B('invitar', '招待する', 'verb'); B('preparar', '準備する', 'verb'); B('explicar', '説明する', 'verb'); B('informar', '知らせる', 'verb');
  B('organizar', '企画する・組織する', 'verb'); B('educar', '教育する', 'verb'); B('decidir', '決める', 'verb');
  B('trabajar', '働く', 'verb'); B('jugar', '（試合・遊びを）する', 'verb'); B('ganar', '勝つ', 'verb'); B('vender', '売る', 'verb'); B('despertar', '目を覚まさせる', 'verb');
  B('comunicar', '伝える', 'verb'); B('comprar', '買う', 'verb'); B('secar', 'かわかす', 'verb'); B('cantar', '歌う', 'verb');
  /* ---------- 斧（名詞） ---------- */
  B('fama', '名声', 'noun'); B('peligro', '危険', 'noun'); B('ruido', '騒音', 'noun'); B('maravilla', 'すばらしいもの', 'noun'); B('lluvia', '雨', 'noun');
  B('nervio', '神経', 'noun'); B('cariño', '愛情', 'noun'); B('arte', '芸術', 'noun'); B('piano', 'ピアノ', 'noun'); B('taxi', 'タクシー', 'noun');
  B('periódico', '新聞', 'noun'); B('diente', '歯', 'noun'); B('fútbol', 'サッカー', 'noun'); B('guitarra', 'ギター', 'noun');
  B('pan', 'パン', 'noun'); B('carta', '手紙', 'noun'); B('cocina', '台所・料理', 'noun'); B('zapato', '靴', 'noun'); B('pelo', '髪', 'noun');
  B('fruta', '果物', 'noun'); B('libro', '本', 'noun'); B('flor', '花', 'noun'); B('helado', 'アイスクリーム', 'noun'); B('pastel', 'ケーキ', 'noun');
  B('enfermo', '病人', 'noun'); B('peligroso', '危険な', 'adj'); B('cariñoso', '愛情深い', 'adj');

  /* =====  1章 -mente  ===== */
  F('rápido', 'mente', 'rápida|mente', '速く');
  F('fácil', 'mente', 'fácil|mente', 'かんたんに');
  F('tranquilo', 'mente', 'tranquila|mente', '落ち着いて・静かに');
  F('normal', 'mente', 'normal|mente', 'ふつうは');
  F('real', 'mente', 'real|mente', '本当に');
  F('rápido', '', 'rápido', '速い');
  F('fácil', '', 'fácil', 'かんたんな');
  F('tranquilo', '', 'tranquilo', '落ち着いた・静かな');
  F('real', '', 'real', '本当の・現実の');
  F('normal', '', 'normal', 'ふつうの');
  E('rápidamente', 'Mi hermano come ___.', '兄は（　）食べる。', 'come（食べる）の「どんなふうに」');
  E('tranquilamente', 'Los niños duermen ___.', '子どもたちは（　）眠っている。', 'duermen（眠る）の「どんなふうに」', '静かに');
  E('fácilmente', 'Mi hija aprende las palabras ___.', '娘は単語を（　）覚える。', 'aprende（覚える）の「どんなふうに」');
  E('normalmente', '___ me levanto a las siete.', '（　）私は7時に起きる。', '文の頭。「起きる」の「ふだんどんなふうに」');
  E('realmente', 'Este libro es ___ interesante.', 'この本は（　）おもしろい。', 'interesante（おもしろい）が「どのくらい」か＝ようす');
  E('tranquilo', 'Mi abuelo es muy ___.', '祖父はとても（　）。', 'muy（とても）のあと。祖父が「どんな」人か', '落ち着いている');
  E('rápido', 'Este tren es muy ___.', 'この電車はとても（　）。', 'muy（とても）のあと。電車が「どんな」か', '速い');
  E('fácil', 'El examen de hoy es ___.', '今日の試験は（　）。', 'es のあと。試験が「どんな」か', 'かんたんだ');
  E('real', 'Es una historia ___.', 'それは（　）話だ。', 'historia（話）のすぐあと。「どんな」話か', '本当の');
  E('normal', 'Hoy es un día ___.', '今日は（　）日だ。', 'día（日）のすぐあと。「どんな」日か', 'ふつうの');

  /* =====  2章 -dad  ===== */
  F('real', 'dad', 'reali|dad', '現実', 'f');
  F('tranquilo', 'dad', 'tranquili|dad', '静けさ・落ち着き', 'f');
  F('posible', 'dad', 'posibili|dad', '可能性', 'f');
  F('seguro', 'dad', 'seguri|dad', '安全', 'f');
  F('feliz', 'dad', 'felici|dad', '幸福', 'f', { memo: '形が少し変わる（z → c）' });
  F('libre', 'dad', 'liber|tad', '自由', 'f', { memo: '-tad の形' });
  F('seguro', '', 'seguro', '安全な・確かな');
  F('posible', '', 'posible', '可能な');
  F('feliz', '', 'feliz', '幸せな');
  F('libre', '', 'libre', '自由な・ひまな');
  E('realidad', 'Mi sueño ahora es una ___.', '私の夢は今では（　）だ。', 'una のあと。ものごとの名前');
  E('tranquilidad', 'Me gusta la ___ del pueblo.', '村の（　）が好きだ。', 'la のあと。ものごとの名前', '静けさ');
  E('posibilidad', 'Hay una ___ de lluvia.', '雨の（　）がある。', 'una のあと。ものごとの名前');
  E('seguridad', 'La ___ es lo primero.', '（　）が第一だ。', 'La のあと。ものごとの名前');
  E('felicidad', 'El dinero no da la ___.', 'お金は（　）をくれない。', 'la のあと。ものごとの名前');
  E('libertad', 'La ___ es muy importante para mí.', '（　）は私にとってとても大切だ。', 'La のあと。ものごとの名前');
  E('seguro', 'Este barrio es muy ___.', 'この地区はとても（　）。', 'muy（とても）のあと。地区が「どんな」か', '安全だ');
  E('posible', '¿Es ___ llegar a las ocho?', '8時に着くのは（　）？', 'Es のあと。「どんな」ことか', '可能');
  E('feliz', 'Mi madre está muy ___ hoy.', '母は今日とても（　）。', 'muy（とても）のあと。母が「どんな」ようすか', '幸せだ');
  E('libre', 'Mañana estoy ___.', '明日、私は（　）。', 'estoy のあと。私が「どんな」状態か', 'ひまだ');

  /* =====  3章 -ción  ===== */
  F('invitar', 'cion', 'invita|ción', '招待', 'f');
  F('preparar', 'cion', 'prepara|ción', '準備', 'f');
  F('explicar', 'cion', 'explica|ción', '説明', 'f');
  F('informar', 'cion', 'informa|ción', '情報', 'f');
  F('organizar', 'cion', 'organiza|ción', '組織・企画', 'f');
  F('educar', 'cion', 'educa|ción', '教育', 'f');
  F('decidir', 'cion', 'deci|sión', '決定', 'f', { memo: '-sión の形' });
  F('invitar', '', 'invitar', '招待する');
  F('preparar', '', 'preparar', '準備する');
  F('explicar', '', 'explicar', '説明する');
  F('organizar', '', 'organizar', '企画する・組織する');
  F('decidir', '', 'decidir', '決める');
  E('invitación', 'Gracias por la ___.', '（　）をありがとう。', 'la のあと。ものごとの名前');
  E('preparación', 'La ___ de la cena dura una hora.', '夕食の（　）には1時間かかる。', 'La のあと。ものごとの名前');
  E('explicación', 'No entiendo la ___ del profesor.', '先生の（　）が分からない。', 'la のあと。ものごとの名前');
  E('información', 'Necesito más ___ sobre el hotel.', 'ホテルについて、もっと（　）が必要だ。', 'más（もっと）のあと。ものごとの名前');
  E('organización', 'Trabajo en una ___ internacional.', '私は国際的な（　）で働いている。', 'una のあと。ものごとの名前', '組織');
  E('educación', 'La ___ de los niños es importante.', '子どもの（　）は大切だ。', 'La のあと。ものごとの名前');
  E('decisión', 'Es una ___ difícil.', 'むずかしい（　）だ。', 'una のあと。ものごとの名前');
  E('invitar', 'Quiero ___ a mis amigos.', '友だちを（　）たい。', 'Quiero（〜したい）のあと。「〜する」', '招待し');
  E('preparar', 'Voy a ___ la cena.', '夕食を（　）つもりだ。', 'Voy a（〜するつもり）のあと。「〜する」', '準備する');
  E('explicar', '¿Puedes ___ esta palabra?', 'この語を（　）くれる？', 'Puedes（〜できる？）のあと。「〜する」', '説明して');
  E('organizar', 'Vamos a ___ una fiesta.', 'パーティーを（　）しよう。', 'Vamos a（〜しよう）のあと。「〜する」', '企画');
  E('decidir', 'Tienes que ___ hoy.', '今日（　）なければならない。', 'Tienes que（〜しなければ）のあと。「〜する」', '決め');

  /* =====  4章 -dor  ===== */
  F('trabajar', 'dor', 'trabaja|dor', '働き手', 'm');
  F('jugar', 'dor', 'juga|dor', '選手', 'm');
  F('organizar', 'dor', 'organiza|dor', '主催者', 'm');
  F('ganar', 'dor', 'gana|dor', '勝者', 'm');
  F('vender', 'dor', 'vende|dor', '販売員', 'm');
  F('despertar', 'dor', 'desperta|dor', '目覚まし時計', 'm', { memo: '道具の -dor' });
  F('trabajar', '', 'trabajar', '働く');
  F('jugar', '', 'jugar', '（試合・遊びを）する');
  F('ganar', '', 'ganar', '勝つ');
  F('vender', '', 'vender', '売る');
  E('trabajador', 'Juan es un buen ___.', 'フアンはよい（　）だ。', 'un buen（よい）のあと。フアンが「だれ」か');
  E('jugador', 'El ___ corre muy rápido.', 'その（　）はとても速く走る。', 'El のあと。走る「だれ」か');
  E('organizador', 'El ___ de la fiesta es mi tío.', 'パーティーの（　）は私のおじだ。', 'El のあと。おじは「だれ」か');
  E('ganador', 'El ___ del partido recibe un premio.', '試合の（　）は賞をもらう。', 'El のあと。賞をもらう「だれ」か');
  E('vendedor', 'El ___ de la tienda es muy amable.', '店の（　）はとても親切だ。', 'El のあと。親切な「だれ」か');
  E('despertador', 'Pongo el ___ a las seis.', '（　）を6時にセットする。', 'el のあと。セットする「道具」');
  E('trabajar', 'Tengo que ___ mañana.', '明日（　）なければならない。', 'Tengo que（〜しなければ）のあと。「〜する」', '働か');
  E('jugar', 'Los niños quieren ___ en el parque.', '子どもたちは公園で（　）たい。', 'quieren（〜したい）のあと。「〜する」', '遊び');
  E('ganar', 'Queremos ___ el partido.', '私たちは試合に（　）たい。', 'Queremos（〜したい）のあと。「〜する」', '勝ち');
  E('vender', 'Voy a ___ mi coche.', '車を（　）つもりだ。', 'Voy a（〜するつもり）のあと。「〜する」', '売る');

  /* =====  5章 -oso  ===== */
  F('fama', 'oso', 'fam|oso', '有名な');
  F('peligro', 'oso', 'peligr|oso', '危険な');
  F('ruido', 'oso', 'ruid|oso', 'うるさい');
  F('maravilla', 'oso', 'maravill|oso', 'すばらしい');
  F('lluvia', 'oso', 'lluvi|oso', '雨の多い');
  F('nervio', 'oso', 'nervi|oso', '緊張した');
  F('cariño', 'oso', 'cariñ|oso', '愛情深い');
  F('peligro', '', 'peligro', '危険', 'm');
  F('ruido', '', 'ruido', '騒音', 'm');
  F('lluvia', '', 'lluvia', '雨', 'f');
  E('famoso', 'Es un cantante muy ___.', 'とても（　）歌手だ。', 'muy（とても）のあと。「どんな」歌手か');
  E('peligroso', 'Este camino es muy ___.', 'この道はとても（　）。', 'muy（とても）のあと。道が「どんな」か', '危険だ');
  E('ruidoso', 'Mi barrio es muy ___.', 'うちの地区はとても（　）。', 'muy（とても）のあと。地区が「どんな」か');
  E('maravilloso', 'Fue un día ___.', '（　）一日だった。', 'día（日）のすぐあと。「どんな」日か');
  E('lluvioso', 'Abril es un mes ___.', '4月は（　）月だ。', 'mes（月）のすぐあと。「どんな」月か');
  E('nervioso', 'Antes del examen, estoy muy ___.', '試験の前、私はとても（　）。', 'muy（とても）のあと。私が「どんな」ようすか', '緊張している');
  E('cariñoso', 'Mi perro es muy ___.', 'うちの犬はとても（　）。', 'muy（とても）のあと。犬が「どんな」か', '人なつっこい');
  E('peligro', '¡Cuidado! Hay ___.', '気をつけて！（　）がある。', 'Hay（〜がある）のあと。ものごとの名前');
  E('ruido', 'Hay mucho ___ en la calle.', '通りに（　）がたくさんある。', 'mucho（たくさんの）のあと。ものごとの名前');
  E('lluvia', 'Me gusta la ___.', '私は（　）が好きだ。', 'la のあと。ものごとの名前');

  /* =====  6章 -ista  ===== */
  F('arte', 'ista', 'art|ista', '芸術家', 'mf');
  F('piano', 'ista', 'pian|ista', 'ピアニスト', 'mf');
  F('taxi', 'ista', 'tax|ista', 'タクシー運転手', 'mf');
  F('periódico', 'ista', 'period|ista', '記者', 'mf');
  F('diente', 'ista', 'dent|ista', '歯医者', 'mf');
  F('fútbol', 'ista', 'futbol|ista', 'サッカー選手', 'mf');
  F('guitarra', 'ista', 'guitarr|ista', 'ギタリスト', 'mf');
  F('piano', '', 'piano', 'ピアノ', 'm');
  F('arte', '', 'arte', '芸術', 'm');
  F('taxi', '', 'taxi', 'タクシー', 'm');
  F('fútbol', '', 'fútbol', 'サッカー', 'm');
  F('periódico', '', 'periódico', '新聞', 'm');
  E('artista', 'Mi tía es ___ y pinta cuadros.', 'おばは（　）で、絵を描く。', 'es のあと。絵を描くおばは「だれ」か');
  E('pianista', 'La ___ toca muy bien.', 'その（　）はとても上手に弾く。', 'La のあと。弾く「だれ」か');
  E('taxista', 'El ___ lleva a los turistas al hotel.', '（　）が観光客をホテルへ連れていく。', 'El のあと。連れていく「だれ」か');
  E('periodista', 'La ___ escribe sobre el partido.', '（　）が試合について書く。', 'La のあと。書く「だれ」か');
  E('dentista', 'Me duelen los dientes. Voy al ___.', '歯が痛い。（　）に行く。', 'al（〜のところへ）のあと。「だれ」のところか');
  E('futbolista', 'Mi hijo quiere ser ___.', '息子は（　）になりたい。', 'ser（〜になる）のあと。「だれ」になりたいか');
  E('guitarrista', 'El ___ del grupo canta también.', 'グループの（　）は歌も歌う。', 'El のあと。歌う「だれ」か');
  E('piano', 'Toco el ___ todos los días.', '毎日（　）を弾く。', 'el のあと。弾く「もの」');
  E('arte', 'Me gusta el ___ moderno.', '私は現代の（　）が好きだ。', 'el のあと。好きな「もの・こと」');
  E('taxi', 'Vamos en ___.', '（　）で行こう。', 'en（〜で）のあと。乗る「もの」');
  E('fútbol', 'Juego al ___ los domingos.', '日曜日に（　）をする。', 'al のあと。する「もの・こと」');
  E('periódico', 'Leo el ___ por la mañana.', '朝、（　）を読む。', 'el のあと。読む「もの」');

  /* =====  7章 -ero  ===== */
  F('pan', 'ero', 'panad|ero', 'パン職人', 'm', { memo: 'pan → panad- と、d が入る' });
  F('carta', 'ero', 'cart|ero', '郵便配達員', 'm');
  F('cocina', 'ero', 'cocin|ero', '料理人', 'm');
  F('zapato', 'ero', 'zapat|ero', '靴職人', 'm');
  F('pelo', 'ero', 'peluqu|ero', '美容師', 'm', { memo: '形が少し変わる（pelo → peluqu-）' });
  F('carta', '', 'carta', '手紙', 'f');
  F('cocina', '', 'cocina', '台所・料理', 'f');
  F('pan', '', 'pan', 'パン', 'm');
  F('pelo', '', 'pelo', '髪', 'm');
  E('panadero', 'El ___ trabaja desde las cuatro de la mañana.', '（　）は朝4時から働く。', 'El のあと。働く「だれ」か');
  E('cartero', 'El ___ trae las cartas por la mañana.', '（　）が朝、手紙を持ってくる。', 'El のあと。持ってくる「だれ」か');
  E('cocinero', 'El ___ de este restaurante es muy bueno.', 'このレストランの（　）はとても腕がいい。', 'El のあと。腕がいい「だれ」か');
  E('zapatero', 'El ___ arregla mis zapatos.', '（　）が私の靴を直してくれる。', 'El のあと。直す「だれ」か');
  E('peluquero', 'Mi ___ me corta el pelo.', '私の（　）が髪を切ってくれる。', 'Mi（私の）のあと。髪を切る「だれ」か');
  E('carta', 'Escribo una ___ a mi abuela.', '祖母に（　）を書く。', 'una のあと。書く「もの」');
  E('cocina', 'La ___ de mi casa es pequeña.', 'うちの（　）は小さい。', 'La のあと。小さい「もの」');
  E('pan', 'Como ___ por la mañana.', '朝は（　）を食べる。', 'Como（食べる）のあと。食べる「もの」');
  E('pelo', 'Tengo el ___ largo.', '私は（　）が長い。', 'el のあと。長い「もの」');

  /* =====  8章 -ería  ===== */
  F('pan', 'eria', 'panad|ería', 'パン屋（店）', 'f');
  F('zapato', 'eria', 'zapat|ería', '靴屋（店）', 'f');
  F('fruta', 'eria', 'frut|ería', '果物屋（店）', 'f');
  F('libro', 'eria', 'libr|ería', '本屋（店）', 'f', { memo: '英語の library（図書館＝biblioteca）ではない' });
  F('pelo', 'eria', 'peluqu|ería', '美容院', 'f', { memo: '形が少し変わる（pelo → peluqu-）' });
  F('fruta', '', 'fruta', '果物', 'f');
  F('libro', '', 'libro', '本', 'm');
  E('panadería', 'Compro el pan en la ___.', 'パンは（　）で買う。', 'en la（〜で）のあと。買う「店」');
  E('zapatería', 'Mi tío tiene una ___ en el centro.', 'おじは町の中心で（　）をやっている。', 'una のあと（女性の名詞）。おじがやっている「店」');
  E('frutería', 'Venden manzanas en la ___.', '（　）でリンゴを売っている。', 'en la（〜で）のあと。売っている「店」');
  E('librería', 'Voy a la ___ para comprar un libro.', '本を買いに（　）へ行く。', 'a la（〜へ）のあと。行く「店」');
  E('peluquería', 'Mi hermana trabaja en una ___.', '姉は（　）で働いている。', 'en una（〜で）のあと。働く「店」');
  E('fruta', 'Como mucha ___.', '私は（　）をたくさん食べる。', 'mucha（たくさんの）のあと。食べる「もの」');
  E('libro', 'Leo un ___ cada semana.', '毎週（　）を1冊読む。', 'un のあと。読む「もの」');

  /* =====  鑑定（戦わずに、ジェムを外して読む語）  ===== */
  F('feliz', 'mente', 'feliz|mente', '幸いにも', '', X);
  F('libre', 'mente', 'libre|mente', '自由に', '', X);
  F('fácil', 'dad', 'facili|dad', 'かんたんさ', 'f', X);
  F('comunicar', 'cion', 'comunica|ción', '伝達・通信', 'f', X);
  F('cantar', 'cion', 'can|ción', '歌', 'f', { x: 1, memo: '形が少し縮まる（cantar → canción）' });
  F('comprar', 'dor', 'compra|dor', '買い手', 'm', X);
  F('secar', 'dor', 'seca|dor', 'ドライヤー', 'm', { x: 1, memo: '道具の -dor' });
  F('peligroso', 'mente', 'peligr|osa|mente', '危なっかしく', '', { x: 1, sfs: ['oso', 'mente'], root: 'peligro', rja: '危険' });
  F('cariñoso', 'mente', 'cariñ|osa|mente', '愛情をこめて', '', { x: 1, sfs: ['oso', 'mente'], root: 'cariño', rja: '愛情' });
  F('flor', 'ista', 'flor|ista', '花屋さん（人）', 'mf', X);
  F('enfermo', 'ero', 'enferm|ero', '看護師', 'm', X);
  F('helado', 'eria', 'helad|ería', 'アイスクリーム屋', 'f', X);
  F('pastel', 'eria', 'pastel|ería', 'ケーキ屋', 'f', X);

  /* 章：ジェム1つずつ。ジェムが増えるたびに、同じ武器で選べる形が増える（real → real／realmente／realidad） */
  var CH = [
    { gem: 'mente', intro: ['rápidamente', 'fácilmente', 'tranquilamente'], fight: ['normalmente', 'realmente'], asis: ['rápido', 'tranquilo', 'fácil', 'real', 'normal'] },
    { gem: 'dad', intro: ['realidad', 'tranquilidad', 'posibilidad'], fight: ['seguridad', 'felicidad', 'libertad'], asis: ['seguro', 'posible', 'feliz', 'libre'] },
    { gem: 'cion', intro: ['invitación', 'preparación', 'explicación'], fight: ['información', 'organización', 'educación', 'decisión'], asis: ['invitar', 'preparar', 'explicar', 'organizar', 'decidir'] },
    { gem: 'dor', intro: ['trabajador', 'jugador', 'organizador'], fight: ['ganador', 'vendedor', 'despertador'], asis: ['trabajar', 'jugar', 'ganar', 'vender'] },
    { gem: 'oso', intro: ['famoso', 'peligroso', 'ruidoso'], fight: ['maravilloso', 'lluvioso', 'nervioso', 'cariñoso'], asis: ['peligro', 'ruido', 'lluvia'] },
    { gem: 'ista', intro: ['artista', 'pianista', 'taxista'], fight: ['periodista', 'dentista', 'futbolista', 'guitarrista'], asis: ['piano', 'arte', 'taxi', 'fútbol', 'periódico'] },
    { gem: 'ero', intro: ['panadero', 'cartero', 'cocinero'], fight: ['zapatero', 'peluquero'], asis: ['carta', 'cocina', 'pan', 'pelo'] },
    { gem: 'eria', intro: ['panadería', 'zapatería', 'frutería'], fight: ['librería', 'peluquería'], asis: ['fruta', 'libro'] }
  ];

  var PEGA = { POS: POS, ATT: ATT, GEMS: GEMS, WEAPONS: WEAPONS, FORMS: FORMS, FOES: FOES, CH: CH };
  if (typeof module !== 'undefined' && module.exports) module.exports = PEGA;
  if (typeof window !== 'undefined') window.PEGA = PEGA;
})();
