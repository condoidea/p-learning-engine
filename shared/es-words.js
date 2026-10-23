/* =========================================================
 * shared/es-words.js — スペイン語の共通単語帳（アプリ横断）
 *
 *  スペイン語のアプリ（いまは ¡QUE FUSIÓN!＝relativo）の例文・問題に出てくる語を、
 *  ぜんぶここに登録する。tests/check-relativo.js が「登録されていない語」をエラーにする。
 *    ・アプリは、4級・4級より上の語に点線をつけ、タップでバルーン（意味）を出す
 *    ・docs/スペイン語単語メモ.md（どのアプリで何回使ったか）は、ここから作る
 *      → 次のアプリで「復習として使う語」「被らないように新しく足す語」を決めるのに使う
 *
 *  1語の書き方：W(見出し語, 意味, 品詞, 級, '活用形・変化形をカンマ区切り')
 *    品詞 n 名詞 v 動詞 adj 形容詞 adv 副詞 pron 代名詞 art 冠詞 prep 前置詞 det 所有・指示など
 *         rel 関係詞 int 疑問詞 num 数 phr 表現 bad 存在しない形（ひっかけの選択肢用）
 *    級   5＝5級（基本・バルーンなし）  4＝4級（バルーン）  3＝4級より上（バルーン）  0＝機能語
 *  同じつづりの語（trabajo＝働く／仕事 など）は、見出しを1つにして意味に両方書く。
 * ========================================================= */
(function () {
  'use strict';
  var words = [];
  function W(w, ja, pos, lv, f) { words.push({ w: w, ja: ja, pos: pos, lv: lv, f: f ? f.split(/\s*,\s*/) : [] }); }

  /* ---------- 機能語（冠詞・前置詞・代名詞・関係詞・疑問詞） ---------- */
  W('el', '（男性・単数の）その', 'art', 0);
  W('la', '（女性・単数の）その／彼女を・それを', 'art', 0);
  W('los', '（男性・複数の）その', 'art', 0);
  W('las', '（女性・複数の）その', 'art', 0);
  W('lo', '〜なこと（中性）／それを', 'art', 0);
  W('un', 'ある・1つの', 'art', 0, 'una');
  W('a', '〜に・〜へ・（人）を', 'prep', 0);
  W('al', 'a ＋ el', 'prep', 0);
  W('con', '〜と（いっしょに）・〜で（道具）', 'prep', 0);
  W('de', '〜の・〜から・〜について', 'prep', 0);
  W('en', '〜で・〜に', 'prep', 0);
  W('por', '〜のために・〜によって', 'prep', 0);
  W('que', '（関係詞）〜する… ／（接続詞）〜ということ', 'rel', 0);
  W('qué', '何（疑問詞）', 'int', 0);
  W('quien', '（関係詞）〜する人', 'rel', 0, 'quienes');
  W('quiena', '（この形はない）', 'bad', 0, 'quienas');
  W('donde', '（関係詞）〜する場所', 'rel', 0);
  W('dónde', 'どこ（疑問詞）', 'int', 0);
  W('cuyo', '（関係詞）その〜が。持ち物の性・数に合わせる', 'rel', 3, 'cuya, cuyos, cuyas');
  W('cual', '（el cual・lo cual で）el que・lo que の書き言葉版', 'rel', 3);
  W('mi', '私の', 'det', 0, 'mis');
  W('tu', '君の', 'det', 0);
  W('su', '彼の・彼女の・あなたの', 'det', 0);
  W('nuestro', '私たちの', 'det', 0, 'nuestros');
  W('este', 'この・これ', 'det', 0, 'esta, esto, estos');
  W('me', '私に・私を', 'pron', 0);
  W('te', '君に・君を', 'pron', 0);
  W('nos', '私たちに・私たちを', 'pron', 0);
  W('mí', '私（前置詞のあと）', 'pron', 0);
  W('él', '彼', 'pron', 0);
  W('no', '〜ない・いいえ', 'adv', 0);
  W('muy', 'とても', 'adv', 0);
  W('más', 'もっと・いちばん', 'adv', 0);
  W('mucho', 'たくさんの・とても', 'det', 0, 'muchos, muchas');
  W('todo', 'すべての・ぜんぶ', 'det', 0, 'todos, todas');
  W('tres', '3', 'num', 0);
  W('ochenta', '80', 'num', 4);
  W('tuyo', '君のもの', 'pron', 4, 'tuya');
  W('mío', '私のもの', 'pron', 4, 'mía');

  /* ---------- 名詞 ---------- */
  W('libro', '本', 'n', 5);
  W('casa', '家', 'n', 5);
  W('amigo', '友だち', 'n', 5, 'amiga, amigos');
  W('chico', '男の子', 'n', 5, 'chica, chicas');
  W('hombre', '男の人', 'n', 5);
  W('mujer', '女の人', 'n', 5);
  W('padre', '父（padres＝両親）', 'n', 5, 'padres');
  W('madre', '母', 'n', 5);
  W('hermano', '兄・弟（hermana＝姉・妹）', 'n', 5, 'hermana, hermanos');
  W('niño', '子ども', 'n', 5, 'niños');
  W('profesor', '先生', 'n', 5, 'profesora');
  W('estudiante', '学生', 'n', 5, 'estudiantes');
  W('día', '日（todos los días＝毎日）', 'n', 5, 'días');
  W('año', '年・〜歳', 'n', 5, 'años');
  W('hora', '時間・〜時', 'n', 5);
  W('ciudad', '町・都市', 'n', 5);
  W('tren', '電車', 'n', 5);
  W('coche', '車', 'n', 5, 'coches');
  W('café', 'コーヒー・カフェ', 'n', 5);
  W('pan', 'パン', 'n', 5);
  W('perro', '犬', 'n', 5, 'perros');
  W('mesa', 'テーブル・机', 'n', 5);
  W('puerta', 'ドア', 'n', 5);
  W('escuela', '学校', 'n', 5);
  W('hotel', 'ホテル', 'n', 5);
  W('restaurante', 'レストラン', 'n', 5);
  W('parque', '公園', 'n', 5);
  W('playa', '海辺・ビーチ', 'n', 5);
  W('tienda', '店', 'n', 5);
  W('museo', '博物館・美術館', 'n', 5);
  W('música', '音楽', 'n', 5);
  W('película', '映画', 'n', 5);
  W('carta', '手紙', 'n', 5);
  W('fiesta', 'パーティー・祭り', 'n', 5);
  W('verano', '夏', 'n', 5);
  W('foto', '写真', 'n', 5, 'fotos');
  W('idioma', '言語', 'n', 5, 'idiomas');
  W('japonés', '日本語・日本の', 'n', 5);
  W('español', 'スペイン語・スペインの', 'n', 5);
  W('abuelo', '祖父（abuela＝祖母、abuelos＝祖父母）', 'n', 4, 'abuela, abuelos');
  W('tío', 'おじ（tía＝おば、tíos＝おじ夫婦）', 'n', 4, 'tía, tíos');
  W('primo', 'いとこ', 'n', 4, 'prima, primos, primas');
  W('hijo', '息子（hijos＝子どもたち）', 'n', 4, 'hijos');
  W('vecino', 'となりの人・近所の人', 'n', 4, 'vecina, vecinos');
  W('novia', '恋人（女性）', 'n', 4);
  W('persona', '人', 'n', 4, 'personas');
  W('señor', '男の人・〜さん（señora＝女の人）', 'n', 4, 'señora');
  W('médico', '医者', 'n', 4, 'médica');
  W('piloto', 'パイロット', 'n', 4);
  W('pintor', '画家', 'n', 4);
  W('escritor', '作家', 'n', 4);
  W('turista', '観光客', 'n', 4, 'turistas');
  W('canción', '歌', 'n', 4);
  W('cuadro', '絵', 'n', 4, 'cuadros');
  W('bicicleta', '自転車', 'n', 4);
  W('jardín', '庭', 'n', 4);
  W('periódico', '新聞', 'n', 4);
  W('piscina', 'プール', 'n', 4);
  W('camisa', 'シャツ', 'n', 4, 'camisas');
  W('chaqueta', 'ジャケット', 'n', 4);
  W('zapato', '靴', 'n', 4, 'zapatos');
  W('llave', '鍵', 'n', 4, 'llaves');
  W('silla', 'いす', 'n', 4);
  W('lápiz', '鉛筆', 'n', 4);
  W('cuchillo', 'ナイフ・包丁', 'n', 3);
  W('ventana', '窓', 'n', 4, 'ventanas');
  W('calle', '通り・道', 'n', 4, 'calles');
  W('barrio', '地区・町内', 'n', 4);
  W('pueblo', '村・小さな町', 'n', 4);
  W('campo', 'いなか・畑', 'n', 4);
  W('oficina', '事務所・オフィス', 'n', 4);
  W('empresa', '会社', 'n', 4);
  W('universidad', '大学', 'n', 4);
  W('estación', '駅', 'n', 4);
  W('viaje', '旅行', 'n', 4);
  W('animal', '動物', 'n', 4, 'animales');
  W('fútbol', 'サッカー', 'n', 4);
  W('regalo', 'プレゼント', 'n', 4);
  W('flor', '花', 'n', 4, 'flores');
  W('examen', '試験', 'n', 4);
  W('razón', '理由（tener razón＝言うとおりだ）', 'n', 4);
  W('verdad', '本当のこと', 'n', 4);
  W('cosa', 'もの・こと', 'n', 4, 'cosas');
  W('novela', '小説', 'n', 4, 'novelas');
  W('tesoro', '宝物', 'n', 3);
  W('catalán', 'カタルーニャ語', 'n', 3);

  /* ---------- 形容詞 ---------- */
  W('bonito', 'きれいな・すてきな', 'adj', 5, 'bonita, bonitas');
  W('bueno', 'よい・おいしい', 'adj', 5, 'buena');
  W('grande', '大きい', 'adj', 5);
  W('pequeño', '小さい', 'adj', 5, 'pequeña');
  W('nuevo', '新しい', 'adj', 5, 'nuevos');
  W('viejo', '古い・年をとった', 'adj', 5, 'vieja');
  W('rojo', '赤い', 'adj', 5, 'roja');
  W('azul', '青い', 'adj', 5, 'azules');
  W('blanco', '白い', 'adj', 5);
  W('negro', '黒い', 'adj', 5, 'negra');
  W('interesante', 'おもしろい・興味深い', 'adj', 5);
  W('simpático', '感じがいい', 'adj', 4, 'simpáticos, simpáticas');
  W('amable', '親切な', 'adj', 4, 'amables');
  W('delicioso', 'とてもおいしい', 'adj', 4);
  W('precioso', 'すばらしい・とてもきれいな', 'adj', 4, 'preciosa, preciosas');
  W('famoso', '有名な', 'adj', 4, 'famosas');
  W('enorme', 'とても大きい', 'adj', 4);
  W('contento', 'うれしい・満足した', 'adj', 4, 'contentas');
  W('cansado', '疲れた', 'adj', 4);
  W('sentado', 'すわっている', 'adj', 4);
  W('estrecho', 'せまい', 'adj', 3, 'estrechas');
  W('primero', '最初に・1番目の', 'adj', 4);

  /* ---------- 副詞・表現 ---------- */
  W('aquí', 'ここ', 'adv', 5);
  W('allí', 'あそこ', 'adv', 5);
  W('ahí', 'そこ', 'adv', 4);
  W('arriba', '上に・上の階に', 'adv', 4);
  W('ayer', '昨日', 'adv', 5);
  W('hoy', '今日', 'adv', 5);
  W('mañana', '明日・朝', 'adv', 5);
  W('tarde', '遅く・午後', 'adv', 5);
  W('todavía', 'まだ', 'adv', 4);
  W('cerca', '近くに（cerca de＝〜の近くに）', 'adv', 5);
  W('gracias', 'ありがとう', 'phr', 5);

  /* ---------- 動詞（活用形も書く） ---------- */
  W('ser', '〜である', 'v', 5, 'es, son, fue, era, eres');
  W('estar', '（〜に）いる・ある・〜の状態だ', 'v', 5, 'está, están, estás, estaba');
  W('tener', '持っている（tener ... años＝…歳だ）', 'v', 5, 'tengo, tiene, tienen, tenemos, tienes');
  W('haber', '（hay で）〜がある・いる', 'v', 5, 'hay');
  W('ir', '行く（ir a ＋ 原形＝〜するつもり）', 'v', 5, 'va, voy, fuimos');
  W('venir', '来る', 'v', 5, 'vienen');
  W('vivir', '住む', 'v', 5, 'vivo, vive, viven, vives');
  W('hablar', '話す', 'v', 5, 'habla, hablan, hablo, hablé, hablaste');
  W('comprar', '買う', 'v', 5, 'compré, compra, compramos, compro');
  W('ver', '見る', 'v', 5, 'vi, ves, vimos');
  W('leer', '読む', 'v', 5, 'leo');
  W('escribir', '書く', 'v', 5, 'escribo, escribiste');
  W('querer', 'ほしい・〜したい（querer decir＝意味する）', 'v', 5, 'quiero, quiere, quieres');
  W('gustar', '好きだ（me gusta ＝私は〜が好き）', 'v', 5, 'gusta');
  W('salir', '出る・出発する', 'v', 5, 'sale');
  W('llegar', '着く・来る', 'v', 5, 'llega, llegó');
  W('comer', '食べる', 'v', 5, 'comemos, comimos');
  W('dormir', '寝る', 'v', 5);
  W('hacer', 'する・作る', 'v', 5, 'haces');
  W('decir', '言う', 'v', 5, 'dice, dices, dijo');
  W('dar', 'あげる・くれる', 'v', 5, 'diste');
  W('saber', '知っている', 'v', 5, 'sé');
  W('estudiar', '勉強する', 'v', 5, 'estudia, estudian, estudio');
  W('trabajar', '働く（trabajo＝私は働く／仕事）', 'v', 5, 'trabaja, trabajo');
  W('jugar', '遊ぶ・（スポーツを）する', 'v', 5, 'juegan, juego, jugamos, jugábamos');
  W('bailar', '踊る', 'v', 5, 'baila, bailan');
  W('cantar', '歌う', 'v', 5, 'canta');
  W('escuchar', '聞く', 'v', 5, 'escuchas');
  W('abrir', '開ける', 'v', 5, 'abro');
  W('pagar', '払う', 'v', 5, 'paga');
  W('pensar', '思う・考える', 'v', 5, 'pienso');
  W('conocer', '知っている・知り合う', 'v', 4, 'conozco, conocí');
  W('llamar', '電話する・呼ぶ', 'v', 4, 'llamé');
  W('ayudar', '手伝う・助ける', 'v', 4, 'ayudó, ayudamos, ayudaron');
  W('visitar', '訪れる', 'v', 4, 'visitamos, visitan, visité');
  W('viajar', '旅行する', 'v', 4, 'viajé');
  W('nacer', '生まれる', 'v', 4, 'nací');
  W('entender', '分かる・理解する', 'v', 4, 'entiendo');
  W('creer', '思う・信じる', 'v', 4, 'creo');
  W('necesitar', '必要とする', 'v', 4, 'necesito');
  W('buscar', 'さがす', 'v', 4, 'buscas');
  W('llevar', '身につけている・持っていく', 'v', 4, 'lleva, llevas');
  W('pasar', '起こる・（時を）すごす', 'v', 4, 'pasó, pasamos');
  W('contar', '話して聞かせる・数える', 'v', 4);
  W('preparar', '用意する・（飲み物を）いれる', 'v', 4, 'preparas');
  W('cocinar', '料理する（cocina＝料理する／台所）', 'v', 4, 'cocina');
  W('reservar', '予約する', 'v', 4, 'reservamos');
  W('sacar', '取り出す・（写真を）撮る', 'v', 4, 'sacaste');
  W('cortar', '切る', 'v', 4, 'corto');
  W('empezar', '始まる・始める', 'v', 4, 'empezó');
  W('ganar', '勝つ・かせぐ', 'v', 4, 'gana');
  W('llover', '雨が降る', 'v', 4);
  W('recomendar', '勧める', 'v', 3, 'recomendaste');
  W('quedarse', '泊まる・残る（nos quedamos＝私たちは泊まった）', 'v', 3, 'quedamos');
  W('aprobar', '（試験に）受かる', 'v', 3, 'aprueban');
  W('molestar', 'イライラさせる・迷惑をかける', 'v', 3, 'molestó');
  W('importar', '大事である', 'v', 3, 'importa');

  /* ---------- ¡MANDA!（命令表現 manda/）で足した語・形 ----------
   *  命令の形も活用形として見出し語の下に入れる（F で既存の見出し語に形を足す） */
  function F(w, f) { var e = words.filter(function (x) { return x.w === w; })[0]; if (!e) throw new Error('F: ' + w); e.f = e.f.concat(f.split(/\s*,\s*/)); }
  W('yo', '私は', 'pron', 0);
  W('tú', '君は（仲よしの相手）', 'pron', 0);
  W('usted', 'あなた（ていねいに話す相手）', 'pron', 0);
  W('nosotros', '私たち', 'pron', 0);
  W('vosotros', '君たち（仲よしの何人もの相手・スペイン）', 'pron', 0);
  W('ustedes', 'あなたたち（ていねい・中南米では仲よしにも）', 'pron', 0);
  W('se', '自分を・自分に（再帰）', 'pron', 0);
  W('conmigo', '私といっしょに', 'pron', 0);
  W('y', 'そして・〜と', 'conj', 0);
  W('para', '〜のために・〜あての', 'prep', 0);
  W('ya', 'もう', 'adv', 5);
  W('favor', '（por favor で）お願い', 'phr', 5);
  W('pronto', 'すぐに・近いうちに', 'adv', 4);
  W('ojo', '目', 'n', 5, 'ojos');
  W('noche', '夜', 'n', 5);
  W('sol', '太陽', 'n', 5);
  W('gato', 'ねこ', 'n', 5);
  W('cuidado', '注意（tener cuidado＝気をつける）', 'n', 4);
  W('miedo', '恐怖（tener miedo＝こわがる）', 'n', 4);
  W('castillo', '城', 'n', 4);
  W('volcán', '火山', 'n', 4);
  W('arcoíris', '虹', 'n', 4);
  W('pájaro', '鳥', 'n', 4, 'pájaros');
  W('pez', '魚（生きている魚）', 'n', 4);
  W('conejo', 'うさぎ', 'n', 4);
  W('oso', 'くま', 'n', 4);
  W('caballo', '馬', 'n', 4);
  W('vaca', '牛', 'n', 4);
  W('elefante', 'ぞう', 'n', 4);
  W('león', 'ライオン', 'n', 4);
  W('mono', 'さる', 'n', 4);
  W('mariposa', 'ちょう', 'n', 4);
  W('cerdo', 'ぶた', 'n', 4);
  W('ratón', 'ねずみ', 'n', 4);
  W('real', '王の・本物の（pavo real＝くじゃく）', 'adj', 4);
  W('gallo', 'おんどり', 'n', 3);
  W('loro', 'オウム', 'n', 3);
  W('unicornio', 'ユニコーン', 'n', 3);
  W('oveja', 'ひつじ', 'n', 3);
  W('tortuga', 'かめ', 'n', 3);
  W('zorro', 'きつね', 'n', 3);
  W('hada', '妖精', 'n', 3);
  W('abeja', 'みつばち', 'n', 3);
  W('cangrejo', 'かに', 'n', 3);
  W('águila', 'わし', 'n', 3);
  W('dragón', 'ドラゴン', 'n', 3);
  W('pulpo', 'タコ', 'n', 3);
  W('delfín', 'イルカ', 'n', 3);
  W('ballena', 'くじら', 'n', 3);
  W('tiburón', 'サメ', 'n', 3);
  W('ciervo', 'しか', 'n', 3);
  W('pavo', '七面鳥（pavo real＝くじゃく）', 'n', 3);
  W('pingüino', 'ペンギン', 'n', 3, 'pingüinos');
  W('camello', 'らくだ', 'n', 3, 'camellos');
  W('flamenco', 'フラミンゴ', 'n', 3, 'flamencos');
  W('cisne', 'はくちょう', 'n', 3, 'cisnes');
  W('genio', '精霊・ランプの魔人', 'n', 3, 'genios');
  W('ardilla', 'りす', 'n', 3, 'ardillas');
  W('rana', 'かえる', 'n', 3, 'ranas');
  W('lobo', 'おおかみ', 'n', 3, 'lobos');
  W('pollito', 'ひよこ', 'n', 3);
  W('panda', 'パンダ', 'n', 3);
  W('mariquita', 'てんとうむし', 'n', 3);
  W('erizo', 'はりねずみ', 'n', 3);
  W('búho', 'ふくろう', 'n', 3);
  W('poner', '置く（poner la mesa＝食卓の用意をする）', 'v', 5, 'pon, pone, pones, pongo, ponga');
  W('cerrar', '閉める', 'v', 4, 'cierras, cierra, cierre, cierro');
  W('volver', 'もどる・帰る', 'v', 4, 'vuelvo, vuelva, vuelve');
  W('levantarse', '起きる（levantar＝起こす ＋ se＝自分を）', 'v', 4, 'levanta, levántate');
  W('sentarse', 'すわる（sentar＝すわらせる ＋ se＝自分を）', 'v', 4, 'siéntese, siéntate, siente, sienta');
  F('hablar', 'hablas, hable, hablen, hablad, hables, habláis');
  F('comer', 'comes, come, como, coma, coman, comed, comas, comen, cómelo, cómela, cómalo');
  F('abrir', 'abres, abre, abra, abras, abrid, ábrela');
  F('escuchar', 'escucha, escucho, escuche, escuchad');
  F('dormir', 'duermo, duermes, duerme, dormimos');
  F('jugar', 'juegas, juega');
  F('venir', 'vienes, viene, ven, vengo, venga, vengan, venid');
  F('tener', 'ten, tenga, tengas');
  F('salir', 'sal, sales, salgo, salga, salgas, salgan');
  F('hacer', 'haz, hace, hago, haga, hagas');
  F('decir', 'di, digo, diga, dime');
  F('ir', 've, vas, vaya, vayan, van');
  F('ser', 'soy, sea, sean');
  F('estar', 'estoy, esté, estén');
  F('dar', 'doy, dé, da, den');
  F('pasar', 'pasa, pase, pasas, pasen, pasan, pases');
  F('bailar', 'bailad, bailas');
  F('cantar', 'canto, cantas, cante, cantad, cantan');
  F('leer', 'lees, lee, léelo, léela');
  F('pensar', 'piensa, piensas');
  F('empezar', 'empieza, empiezas');
  F('contar', 'cuentas, cuenta');
  F('ayudar', 'ayuda, ayúdame');
  F('señor', 'señores');
  F('chico', 'chicos');
  /* 命令をまちがえて作った形（ひっかけの選択肢・まちがい探し用） */
  W('dorme', '（この形はない。duerme が正しい）', 'bad', 0, 'jugas, cerra, cerre, tene, tenes, volva, vaye, empeza, conta, comela, comelo, levantate, díme, leelo, leela, ayudame, habl, er');

  window.ES_WORDS = {
    words: words,
    /* 人名・地名（単語として数えない・バルーンなし） */
    names: ['Ana', 'Pablo', 'Carlos', 'Madrid', 'Sevilla', 'Barcelona', 'Japón', 'Tokio', 'Kioto', 'Osaka', 'Perú', 'Chile', 'México', 'París', 'Corea', 'Pepe', 'Lola', 'Tomás', 'Marina']
  };
})();
