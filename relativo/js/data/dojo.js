/* =========================================================
 * ¡QUE FUSIÓN! — 使い分け（○✕ジャッジ）
 *
 *  que・quien・前置詞＋冠詞＋que・donde の「使える／使えない」を、
 *  「手がかり（原因）→ なので → この形は ○／✕（結果）」でくり返す問題。
 *
 *  解き方（画面）
 *   ① 手がかり1：先行詞は 人？もの？場所？
 *   ② 手がかり2：＿ の前に前置詞は要る？（動詞とのペアで決まる：hablar con 〜 など）
 *   ③ 入りそうな形の1つずつに ○（使える）／✕（使えない）
 *  どの行にも「原因 → 結果」を出す。表は見せない（その場で見えない表は参照しない）。
 *
 *  J({ … }) の書き方
 *    id, s（___ が空所）, ja
 *    w      先行詞（文の中の語そのまま）
 *    g, n   性 'm'/'f'・数 's'/'p'（冠詞と quien の形を決める）
 *    who    'hum' 人／'thing' もの／'place' 場所（場所で「〜で」なら donde が使える）
 *    prep   null（前置詞は要らない）／'con' 'de' 'en'
 *    comma  true＝コンマではさんだ説明
 *    vf, vi, vm  動詞の形・動詞と前置詞のペア・意味（例 'hablo', 'hablar con 〜', '〜と話す'）
 *    wrong  まぎらわしい ✕ を足す：'gender' 冠詞の性ちがい／'contract' de el que／'number' quien の数ちがい
 *           'artquien' quien に冠詞／'noprep' 前置詞を落とした que／'donde' 人に donde
 *
 *  できた問題は RQ.questions に k: 'judge'・L: 11（使い分けマスター）で入る。
 *  きまりのまとめ（RQ.rules）は「📋 きまり」とレッスンで使う。
 * ========================================================= */
window.RQ = window.RQ || {};
(function () {
  'use strict';
  var A = { m: { s: 'el', p: 'los' }, f: { s: 'la', p: 'las' } };
  var GN = { m: '男性', f: '女性' }, NN = { s: '単数', p: '複数' }, WHO = { hum: '人', thing: 'もの', place: '場所' };
  function contract(prep, a) { return prep === 'a' && a === 'el' ? 'al' : prep === 'de' && a === 'el' ? 'del' : ''; }
  function artQue(prep, a) { var c = contract(prep, a); return c ? c + ' que' : (prep ? prep + ' ' : '') + a + ' que'; }
  var list = [];
  function J(o) {
    var a = A[o.g][o.n], qn = o.n === 'p' ? 'quienes' : 'quien', qx = o.n === 'p' ? 'quien' : 'quienes';
    var P = o.prep ? o.prep + ' ' : '', kind = WHO[o.who], hum = o.who === 'hum';
    var gn = GN[o.g] + '・' + NN[o.n], pair = o.vi;
    var it = [];
    function add(t, ok, c, r) { it.push({ t: t, ok: ok, c: c, r: r }); }
    var numC = o.w + ' は' + (o.n === 'p' ? '複数' : '1人'), numR = o.n === 'p' ? 'quien ではなく quienes' : 'quienes ではなく quien';
    if (!o.prep && !o.comma) {
      add('que', true, '前置詞が要らない（' + pair + '）・コンマもない', 'que が使える');
      if (o.who === 'place') add('donde', false, pair + ' は「〜を」で、「〜で」ではない', 'donde は使えない');
      add(a + ' que', false, '前置詞がない（名詞のすぐ後ろ）', '冠詞＋que は使えない');
      if (o.who !== 'place') add(qn, false, hum ? 'コンマも前置詞もない' : '先行詞 ' + o.w + ' は' + kind, hum ? 'quien は使えない（人でも que）' : 'quien（人専用）は使えない');
    } else if (!o.prep) {
      add('que', true, 'コンマではさんだ説明', 'que が使える');
      if (hum) { add(qn, true, 'コンマではさんだ説明 ＋ 人', qn + ' が使える'); add(qx, false, numC, numR); }
      else add('quien', false, '先行詞 ' + o.w + ' は' + kind, 'quien（人専用）は使えない');
    } else {
      var c = contract(o.prep, a);
      add(artQue(o.prep, a), true, '前置詞 ' + o.prep + ' のあと（' + pair + '）', '冠詞＋que が使える（' + o.w + '＝' + gn + ' → ' + a + (c ? '、' + o.prep + '＋el → ' + c : '') + '）');
      if (hum) {
        add(P + qn, true, '前置詞 ' + o.prep + ' のあと ＋ 人', qn + ' が使える');
        add(P + 'que', false, '前置詞 ' + o.prep + ' のあと ＋ 人', '冠詞のない que は使えない');
      } else if (o.who === 'place' && o.prep === 'en') {
        add('donde', true, '場所 ＋「〜で」（' + pair + '）', 'donde が使える（donde ＝ en＋冠詞＋que）');
        add(P + qn, false, '先行詞 ' + o.w + ' は場所', 'quien（人専用）は使えない');
      } else {
        add(P + 'que', true, '前置詞 ' + o.prep + ' のあと ＋ もの', '冠詞のない que も使える（en・de・con のとき）');
        add(P + qn, false, '先行詞 ' + o.w + ' は' + kind, 'quien（人専用）は使えない');
      }
      (o.wrong || []).forEach(function (wr) {
        if (wr === 'gender') { var b = A[o.g === 'm' ? 'f' : 'm'][o.n]; add(artQue(o.prep, b), false, o.w + ' は' + gn, b + ' ではなく ' + a); }
        if (wr === 'contract') add(P + 'el que', false, o.prep + ' ＋ el', '必ず ' + contract(o.prep, 'el') + ' にくっつく');
        if (wr === 'number') add(P + qx, false, numC, numR);
        if (wr === 'artquien') add(P + a + ' quien', false, 'quien', '冠詞はつかない');
        if (wr === 'noprep') add('que', false, pair + '：前置詞 ' + o.prep + ' が要る', o.prep + ' のない que は使えない');
        if (wr === 'donde') add('donde', false, '先行詞 ' + o.w + ' は人', 'donde（場所専用）は使えない');
      });
    }
    list.push({ id: 'dj-' + o.id, L: 11, k: 'judge', s: o.s, ja: o.ja, items: it,
      clue: { w: o.w, who: o.who, gn: gn, prep: o.prep, comma: !!o.comma, vf: o.vf, vi: o.vi, vm: o.vm } });
  }

  /* ---- 前置詞が要らない・コンマなし：que だけ ---- */
  J({ id: 'n1', s: 'El chico ___ canta en la fiesta es Carlos.', ja: 'パーティーで歌っている男の子は、カルロスだ。', w: 'chico', g: 'm', n: 's', who: 'hum', vf: 'canta', vi: 'cantar', vm: '歌う' });
  J({ id: 'n2', s: 'La chica ___ baila allí es mi hermana.', ja: 'あそこで踊っている女の子は、私の妹だ。', w: 'chica', g: 'f', n: 's', who: 'hum', vf: 'baila', vi: 'bailar', vm: '踊る' });
  J({ id: 'n3', s: 'Los estudiantes ___ viven aquí son de Chile.', ja: 'ここに住んでいる学生たちは、チリ出身だ。', w: 'estudiantes', g: 'm', n: 'p', who: 'hum', vf: 'viven', vi: 'vivir', vm: '住む' });
  J({ id: 'n4', s: 'Las chicas ___ trabajan aquí son muy amables.', ja: 'ここで働いている女の子たちは、とても親切だ。', w: 'chicas', g: 'f', n: 'p', who: 'hum', vf: 'trabajan', vi: 'trabajar', vm: '働く' });
  J({ id: 'n5', s: 'El libro ___ compré ayer es muy interesante.', ja: '昨日買った本は、とてもおもしろい。', w: 'libro', g: 'm', n: 's', who: 'thing', vf: 'compré', vi: 'comprar 〜', vm: '〜を買う' });
  J({ id: 'n6', s: 'La película ___ vimos ayer fue muy buena.', ja: '昨日見た映画は、とてもよかった。', w: 'película', g: 'f', n: 's', who: 'thing', vf: 'vimos', vi: 'ver 〜', vm: '〜を見る' });
  J({ id: 'n7', s: 'Los zapatos ___ llevas son nuevos.', ja: '君がはいている靴は、新しい。', w: 'zapatos', g: 'm', n: 'p', who: 'thing', vf: 'llevas', vi: 'llevar 〜', vm: '〜を身につけている' });
  J({ id: 'n8', s: 'Las fotos ___ sacaste en la playa son preciosas.', ja: '君が海で撮った写真は、すばらしい。', w: 'fotos', g: 'f', n: 'p', who: 'thing', vf: 'sacaste', vi: 'sacar 〜', vm: '〜を撮る' });

  /* ---- 場所でも「〜を」なら donde は使えない ---- */
  J({ id: 'o1', s: 'Visité la ciudad ___ me recomendaste.', ja: '君が勧めてくれた町を訪れた。', w: 'ciudad', g: 'f', n: 's', who: 'place', vf: 'recomendaste', vi: 'recomendar 〜', vm: '〜を勧める' });
  J({ id: 'o2', s: 'El museo ___ visitamos ayer es famoso.', ja: '昨日訪れた博物館は、有名だ。', w: 'museo', g: 'm', n: 's', who: 'place', vf: 'visitamos', vi: 'visitar 〜', vm: '〜を訪れる' });
  J({ id: 'o3', s: 'Kioto es una ciudad ___ quiero visitar.', ja: '京都は、私が訪れたい町だ。', w: 'ciudad', g: 'f', n: 's', who: 'place', vf: 'visitar', vi: 'visitar 〜', vm: '〜を訪れる' });
  J({ id: 'o4', s: 'El hotel ___ reservamos tiene piscina.', ja: '私たちが予約したホテルには、プールがある。', w: 'hotel', g: 'm', n: 's', who: 'place', vf: 'reservamos', vi: 'reservar 〜', vm: '〜を予約する' });

  /* ---- コンマではさんだ説明：que・quien（人） ---- */
  J({ id: 'c1', s: 'Mi hermana, ___ vive en Japón, habla tres idiomas.', ja: '私の姉（日本に住んでいる）は、3つの言語を話す。', w: 'hermana', g: 'f', n: 's', who: 'hum', comma: true, vf: 'vive', vi: 'vivir', vm: '住む' });
  J({ id: 'c2', s: 'Mis abuelos, ___ viven en el campo, tienen muchos animales.', ja: '私の祖父母（いなかに住んでいる）は、動物をたくさん飼っている。', w: 'abuelos', g: 'm', n: 'p', who: 'hum', comma: true, vf: 'viven', vi: 'vivir', vm: '住む' });
  J({ id: 'c3', s: 'Mi profesor, ___ es de Perú, habla muy bien japonés.', ja: '私の先生（ペルー出身）は、日本語がとても上手だ。', w: 'profesor', g: 'm', n: 's', who: 'hum', comma: true, vf: 'es', vi: 'ser', vm: '〜である' });
  J({ id: 'c4', s: 'Mis primas, ___ viven en Sevilla, vienen mañana.', ja: '私のいとこたち（セビリアに住んでいる）が、明日来る。', w: 'primas', g: 'f', n: 'p', who: 'hum', comma: true, vf: 'viven', vi: 'vivir', vm: '住む' });
  J({ id: 'c5', s: 'Mi casa, ___ es muy vieja, tiene un jardín grande.', ja: '私の家（とても古い）には、大きな庭がある。', w: 'casa', g: 'f', n: 's', who: 'place', comma: true, vf: 'es', vi: 'ser', vm: '〜である' });

  /* ---- 前置詞が要る・人：冠詞＋que・quien（冠詞のない que は使えない） ---- */
  J({ id: 'p1', s: 'La chica ___ hablo todos los días es de Chile.', ja: '私が毎日話している女の子は、チリ出身だ。', w: 'chica', g: 'f', n: 's', who: 'hum', prep: 'con', vf: 'hablo', vi: 'hablar con 〜', vm: '〜と話す', wrong: ['noprep'] });
  J({ id: 'p2', s: 'El chico ___ te hablé es este.', ja: '君に話した男の子は、この子だよ。', w: 'chico', g: 'm', n: 's', who: 'hum', prep: 'de', vf: 'hablé', vi: 'hablar de 〜', vm: '〜について話す', wrong: ['contract'] });
  J({ id: 'p3', s: 'Los amigos ___ viajé a México son simpáticos.', ja: 'いっしょにメキシコへ旅行した友だちは、感じがいい。', w: 'amigos', g: 'm', n: 'p', who: 'hum', prep: 'con', vf: 'viajé', vi: 'viajar con 〜', vm: '〜と旅行する', wrong: ['number'] });
  J({ id: 'p4', s: 'Las chicas ___ trabajo son muy amables.', ja: 'いっしょに働いている女の子たちは、とても親切だ。', w: 'chicas', g: 'f', n: 'p', who: 'hum', prep: 'con', vf: 'trabajo', vi: 'trabajar con 〜', vm: '〜といっしょに働く', wrong: ['artquien'] });
  J({ id: 'p5', s: 'La persona ___ confío es mi madre.', ja: '私が信頼している人は、母だ。', w: 'persona', g: 'f', n: 's', who: 'hum', prep: 'en', vf: 'confío', vi: 'confiar en 〜', vm: '〜を信頼する', wrong: ['donde'] });
  J({ id: 'p6', s: 'La persona ___ vivo es mi tía.', ja: 'いっしょに住んでいる人は、私のおばだ。', w: 'persona', g: 'f', n: 's', who: 'hum', prep: 'con', vf: 'vivo', vi: 'vivir con 〜', vm: '〜といっしょに住む', wrong: ['artquien'] });
  J({ id: 'p7', s: 'Mi amigo, ___ estudio, es de México.', ja: '私の友だち（いっしょに勉強している）は、メキシコ出身だ。', w: 'amigo', g: 'm', n: 's', who: 'hum', prep: 'con', comma: true, vf: 'estudio', vi: 'estudiar con 〜', vm: '〜といっしょに勉強する', wrong: ['gender'] });
  J({ id: 'p8', s: 'Los profesores ___ hablamos son de México.', ja: '私たちが話題にした先生たちは、メキシコ出身だ。', w: 'profesores', g: 'm', n: 'p', who: 'hum', prep: 'de', vf: 'hablamos', vi: 'hablar de 〜', vm: '〜について話す', wrong: ['number'] });
  J({ id: 'p9', s: 'La vecina ___ te hablé tiene tres perros.', ja: '君に話したとなりの人は、犬を3匹飼っている。', w: 'vecina', g: 'f', n: 's', who: 'hum', prep: 'de', vf: 'hablé', vi: 'hablar de 〜', vm: '〜について話す', wrong: ['gender'] });

  /* ---- 前置詞が要る・もの：冠詞＋que・que（en・de・con）。quien は使えない ---- */
  J({ id: 't1', s: 'El cuchillo ___ corto el pan es nuevo.', ja: 'パンを切るナイフは、新しい。', w: 'cuchillo', g: 'm', n: 's', who: 'thing', prep: 'con', vf: 'corto', vi: 'cortar con 〜', vm: '〜で切る', wrong: ['noprep'] });
  J({ id: 't2', s: 'Es la llave ___ abro la puerta.', ja: 'ドアを開けるのに使う鍵だ。', w: 'llave', g: 'f', n: 's', who: 'thing', prep: 'con', vf: 'abro', vi: 'abrir con 〜', vm: '〜で開ける', wrong: ['gender'] });
  J({ id: 't3', s: 'Es el libro ___ te hablé.', ja: '君に話した本だよ。', w: 'libro', g: 'm', n: 's', who: 'thing', prep: 'de', vf: 'hablé', vi: 'hablar de 〜', vm: '〜について話す', wrong: ['contract'] });
  J({ id: 't4', s: 'Es la película ___ te hablé.', ja: '君に話した映画だよ。', w: 'película', g: 'f', n: 's', who: 'thing', prep: 'de', vf: 'hablé', vi: 'hablar de 〜', vm: '〜について話す', wrong: ['gender'] });

  /* ---- 前置詞 en が要る・場所：冠詞＋que・donde ---- */
  J({ id: 'e1', s: 'Esta es la casa ___ vivo.', ja: 'これが、私の住んでいる家だ。', w: 'casa', g: 'f', n: 's', who: 'place', prep: 'en', vf: 'vivo', vi: 'vivir en 〜', vm: '〜に住む', wrong: ['gender'] });
  J({ id: 'e2', s: 'El restaurante ___ comimos ayer es muy bueno.', ja: '昨日食べたレストランは、とてもいい。', w: 'restaurante', g: 'm', n: 's', who: 'place', prep: 'en', vf: 'comimos', vi: 'comer en 〜', vm: '〜で食べる', wrong: ['noprep'] });
  J({ id: 'e3', s: 'Las ciudades ___ viví son muy bonitas.', ja: '私が住んだ町は、どれもとてもきれいだ。', w: 'ciudades', g: 'f', n: 'p', who: 'place', prep: 'en', vf: 'viví', vi: 'vivir en 〜', vm: '〜に住む', wrong: ['gender'] });
  J({ id: 'e4', s: 'La universidad ___ estudio es grande.', ja: '私が勉強している大学は、大きい。', w: 'universidad', g: 'f', n: 's', who: 'place', prep: 'en', vf: 'estudio', vi: 'estudiar en 〜', vm: '〜で勉強する', wrong: ['noprep'] });
  J({ id: 'e5', s: 'Los parques ___ jugábamos de niños son enormes.', ja: '子どものころ遊んだ公園は、とても大きい。', w: 'parques', g: 'm', n: 'p', who: 'place', prep: 'en', vf: 'jugábamos', vi: 'jugar en 〜', vm: '〜で遊ぶ', wrong: ['gender'] });
  J({ id: 'e6', s: 'Barcelona es la ciudad ___ vive mi tía.', ja: 'バルセロナは、おばが住んでいる町だ。', w: 'ciudad', g: 'f', n: 's', who: 'place', prep: 'en', vf: 'vive', vi: 'vivir en 〜', vm: '〜に住む', wrong: ['noprep'] });
  J({ id: 'e7', s: 'Esta es la tienda ___ compro pan.', ja: 'これが、私がパンを買う店だ。', w: 'tienda', g: 'f', n: 's', who: 'place', prep: 'en', vf: 'compro', vi: 'comprar en 〜', vm: '〜で買う', wrong: ['noprep'] });
  J({ id: 'e8', s: 'Es la escuela ___ estudia mi hermano.', ja: '弟が勉強している学校だ。', w: 'escuela', g: 'f', n: 's', who: 'place', prep: 'en', vf: 'estudia', vi: 'estudiar en 〜', vm: '〜で勉強する', wrong: ['gender'] });

  RQ.questions = (RQ.questions || []).concat(list);

  /* きまりのまとめ（原因 → 結果）。「📋 きまり」とレッスンで同じものを見せる */
  RQ.rules = [
    { c: '前置詞が要らない・コンマもない', r: '**que** だけ。冠詞＋que・quien は使えない' },
    { c: 'コンマではさんだ説明', r: '**que** が使える。人なら **quien** も使える' },
    { c: '前置詞が要る ＋ 人', r: '**冠詞＋que**・**quien** が使える。冠詞のない que は使えない' },
    { c: '前置詞が要る ＋ もの', r: '**冠詞＋que** が使える。en・de・con なら冠詞のない **que** も使える。quien は使えない' },
    { c: '場所 ＋「〜で」（en が要る）', r: '**donde** も使える（donde ＝ en＋冠詞＋que）。「〜を」なら donde は使えない' },
    { c: '形を合わせる', r: '冠詞は先行詞の性・数に。quien は数だけ（冠詞はつかない）。de＋el → **del**、a＋el → **al**' }
  ];
})();
