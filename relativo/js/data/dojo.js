/* =========================================================
 * ¡QUE FUSIÓN! — 使い分け道場（○✕ジャッジ）
 *
 *  que・quien・前置詞＋冠詞＋que の「使える場所・使えない場所」を、くり返し判断する問題。
 *  1文につき、空所に入りそうな形を3〜4つ出し、全部に ○（入る）／✕（入らない）をつける。
 *  ○✕ と理由は、L5 の OK・NG 表のきまりから自動で作る（手で書かない）。
 *
 *  J(id, 文, 訳, 前置詞, コンマ, 先行詞, 性, 数, 人か, まぎらわしい形)
 *    前置詞   null（なし）／'con' 'de' 'en' 'a'
 *    コンマ   true＝コンマではさんだ「かっこの説明」
 *    性・数   'm'/'f'・'s'/'p'（冠詞と quien の形を決める）
 *    まぎらわしい形（前置詞があるときに1つ足す NG）
 *      'gender'   冠詞の性ちがい（con el que …）。もののときはいつもこれ
 *      'contract' a el que・de el que（al・del にくっつく）
 *      'number'   quien の数ちがい
 *      'artquien' quien に冠詞（con la quien）
 *    note       補足（表だけでは分かりにくいときに、結果に出す）
 *
 *  できた問題は RQ.questions に k: 'judge'・L: 5 で入る（L5 をクリアすると、道場・復習・ボスに出る）
 * ========================================================= */
window.RQ = window.RQ || {};
(function () {
  'use strict';
  var A = { m: { s: 'el', p: 'los' }, f: { s: 'la', p: 'las' } };
  var GN = { m: '男性', f: '女性' }, NN = { s: '単数', p: '複数' };
  function artQue(prep, a) {
    if (prep === 'a' && a === 'el') return 'al que';
    if (prep === 'de' && a === 'el') return 'del que';
    return (prep ? prep + ' ' : '') + a + ' que';
  }
  /* 表の何行目か（L5 の OK・NG 表と同じ順） */
  function row(prep, comma, hum) { return !prep ? (comma ? 2 : 1) : (hum ? 4 : 3); }
  var list = [];
  function J(id, s, ja, prep, comma, w, g, n, hum, wrong, note) {
    var a = A[g][n], qn = n === 'p' ? 'quienes' : 'quien', qx = n === 'p' ? 'quien' : 'quienes', P = prep ? prep + ' ' : '';
    var tag = w + '（' + GN[g] + '・' + NN[n] + '）';
    var numWhy = w + ' は' + (n === 'p' ? '複数 → quienes' : '1人 → quien');
    var it = [];
    if (!prep && !comma) {
      it.push({ t: 'que', ok: true, why: '前置詞もコンマもない → que' });
      it.push({ t: a + ' que', ok: false, why: '名詞のすぐ後ろ（前置詞なし）に 冠詞＋que は ✕' });
      it.push({ t: qn, ok: false, why: hum ? 'コンマも前置詞もない所に quien は ✕（人でも que）' : 'quien は人専用' });
    } else if (!prep) {
      it.push({ t: 'que', ok: true, why: 'コンマのあと → que ○' });
      if (hum) {
        it.push({ t: qn, ok: true, why: 'コンマのあと・人 → ' + qn + ' ○' });
        it.push({ t: qx, ok: false, why: numWhy });
      } else it.push({ t: 'quien', ok: false, why: 'quien は人専用' });
    } else {
      it.push({ t: artQue(prep, a), ok: true, why: '前置詞のあと → 冠詞＋que ○（' + tag + ' → ' + a + '）' });
      if (hum) {
        it.push({ t: P + qn, ok: true, why: '前置詞のあと・人 → ' + qn + ' ○' });
        it.push({ t: P + 'que', ok: false, why: '前置詞のあと・人 → 冠詞なしの que は ✕' });
      } else {
        it.push({ t: P + 'que', ok: true, why: 'もの・' + prep + ' のあと → 冠詞なしの que も ○' });
        it.push({ t: P + qn, ok: false, why: 'quien は人専用' });
      }
      var wr = wrong || 'gender';
      if (wr === 'gender') { var b = A[g === 'm' ? 'f' : 'm'][n]; it.push({ t: artQue(prep, b), ok: false, why: tag + ' → ' + a + '（' + b + ' は ✕）' }); }
      if (wr === 'contract') it.push({ t: P + 'el que', ok: false, why: prep + ' ＋ el は ' + (prep === 'a' ? 'al' : 'del') + ' にくっつく' });
      if (wr === 'number') it.push({ t: P + qx, ok: false, why: numWhy });
      if (wr === 'artquien') it.push({ t: P + a + ' quien', ok: false, why: 'quien に冠詞はつかない' });
    }
    list.push({ id: 'dj-' + id, L: 5, k: 'judge', s: s, ja: ja, items: it,
      path: { prep: prep, comma: comma, hum: hum, w: w, tag: tag, row: row(prep, comma, hum), note: note } });
  }

  /* ---- 前置詞なし・コンマなし（表の1行目）：que だけ ---- */
  J('n1', 'El chico ___ canta en la fiesta es Carlos.', 'パーティーで歌っている男の子は、カルロスだ。', null, false, 'chico', 'm', 's', true);
  J('n2', 'La chica ___ baila con Pablo es mi hermana.', 'パブロと踊っている女の子は、私の妹だ。', null, false, 'chica', 'f', 's', true);
  J('n3', 'Los estudiantes ___ conocí en el viaje son de Chile.', '旅行で知り合った学生たちは、チリ出身だ。', null, false, 'estudiantes', 'm', 'p', true);
  J('n4', 'Las chicas ___ trabajan aquí son muy amables.', 'ここで働いている女の子たちは、とても親切だ。', null, false, 'chicas', 'f', 'p', true);
  J('n5', 'El libro ___ compré ayer es muy interesante.', '昨日買った本は、とてもおもしろい。', null, false, 'libro', 'm', 's', false);
  J('n6', 'La película ___ vimos ayer fue muy buena.', '昨日見た映画は、とてもよかった。', null, false, 'película', 'f', 's', false);
  J('n7', 'Los zapatos ___ llevas son nuevos.', '君がはいている靴は、新しい。', null, false, 'zapatos', 'm', 'p', false);
  J('n8', 'Las fotos ___ sacaste en la playa son preciosas.', '君が海で撮った写真は、すばらしい。', null, false, 'fotos', 'f', 'p', false);

  /* ---- 前置詞なし・コンマあり（2行目）：que・quien（人） ---- */
  J('c1', 'Mi hermana, ___ vive en Japón, habla tres idiomas.', '私の姉（日本に住んでいる）は、3つの言語を話す。', null, true, 'hermana', 'f', 's', true);
  J('c2', 'Mis abuelos, ___ viven en el campo, tienen muchos animales.', '私の祖父母（いなかに住んでいる）は、動物をたくさん飼っている。', null, true, 'abuelos', 'm', 'p', true);
  J('c3', 'Mi profesor, ___ es de Perú, habla muy bien japonés.', '私の先生（ペルー出身）は、日本語がとても上手だ。', null, true, 'profesor', 'm', 's', true);
  J('c4', 'Mis primas, ___ viven en Sevilla, vienen mañana.', '私のいとこたち（セビリアに住んでいる）が、明日来る。', null, true, 'primas', 'f', 'p', true);
  J('c5', 'Mi casa, ___ es muy vieja, tiene un jardín grande.', '私の家（とても古い）には、大きな庭がある。', null, true, 'casa', 'f', 's', false);

  /* ---- 前置詞あり・人（4行目）：冠詞＋que・quien（冠詞なし que は ✕） ---- */
  J('p1', 'La chica ___ hablo todos los días es de Chile.', '私が毎日話している女の子は、チリ出身だ。', 'con', false, 'chica', 'f', 's', true, 'gender');
  J('p2', 'El chico ___ te hablé es este.', '君に話した男の子は、この子だよ。', 'de', false, 'chico', 'm', 's', true, 'contract');
  J('p3', 'Los amigos ___ viajé a México son simpáticos.', 'いっしょにメキシコへ旅行した友だちは、感じがいい。', 'con', false, 'amigos', 'm', 'p', true, 'number');
  J('p4', 'Las chicas ___ trabajo son muy amables.', 'いっしょに働いている女の子たちは、とても親切だ。', 'con', false, 'chicas', 'f', 'p', true, 'artquien');
  J('p5', 'El chico ___ llamé ayer es mi primo.', '昨日電話した男の子は、私のいとこだ。', 'a', false, 'chico', 'm', 's', true, 'contract', '「〜を」に当たる人なので、a を使わず que だけ（El chico que llamé）も OK');
  J('p6', 'La señora ___ ayudamos vive aquí.', '私たちが手伝った女の人は、ここに住んでいる。', 'a', false, 'señora', 'f', 's', true, 'gender', '「〜を」に当たる人なので、a を使わず que だけ（La señora que ayudamos）も OK');
  J('p7', 'La persona ___ vivo es mi tía.', 'いっしょに住んでいる人は、私のおばだ。', 'con', false, 'persona', 'f', 's', true, 'artquien');
  J('p8', 'Mi amigo, ___ estudio, es de México.', '私の友だち（いっしょに勉強している）は、メキシコ出身だ。', 'con', true, 'amigo', 'm', 's', true, 'gender');
  J('p9', 'Los profesores ___ hablamos son de México.', '私たちが話題にした先生たちは、メキシコ出身だ。', 'de', false, 'profesores', 'm', 'p', true, 'number');
  J('p10', 'La vecina ___ te hablé tiene tres perros.', '君に話したとなりの人は、犬を3匹飼っている。', 'de', false, 'vecina', 'f', 's', true, 'gender');

  /* ---- 前置詞あり・もの（3行目）：冠詞＋que・que（en・de・con）。quien は ✕ ---- */
  J('t1', 'Esta es la casa ___ vivo.', 'これが、私の住んでいる家だ。', 'en', false, 'casa', 'f', 's', false);
  J('t2', 'El restaurante ___ comimos ayer es muy bueno.', '昨日食べたレストランは、とてもいい。', 'en', false, 'restaurante', 'm', 's', false);
  J('t3', 'El cuchillo ___ corto el pan es nuevo.', 'パンを切るナイフは、新しい。', 'con', false, 'cuchillo', 'm', 's', false);
  J('t4', 'Es la llave ___ abro la puerta.', 'ドアを開けるのに使う鍵だ。', 'con', false, 'llave', 'f', 's', false);
  J('t5', 'Es el libro ___ te hablé.', '君に話した本だよ。', 'de', false, 'libro', 'm', 's', false, 'contract');
  J('t6', 'Las ciudades ___ viví son muy bonitas.', '私が住んだ町は、どれもとてもきれいだ。', 'en', false, 'ciudades', 'f', 'p', false);
  J('t7', 'La universidad ___ estudio es grande.', '私が勉強している大学は、大きい。', 'en', false, 'universidad', 'f', 's', false);
  J('t8', 'Los parques ___ jugábamos de niños son enormes.', '子どものころ遊んだ公園は、とても大きい。', 'en', false, 'parques', 'm', 'p', false);
  J('t9', 'La mesa ___ comemos es muy vieja.', '私たちが食事するテーブルは、とても古い。', 'en', false, 'mesa', 'f', 's', false);
  J('t10', 'Es la película ___ te hablé.', '君に話した映画だよ。', 'de', false, 'película', 'f', 's', false);

  RQ.questions = (RQ.questions || []).concat(list);
})();
