/* =========================================================
 * ¡QUE FUSIÓN! — 問題バンク
 *
 *  L が「そのレッスンをクリアしたら出る」範囲。復習・ラッシュ・ボスはここから出す。
 *  o（選択肢）は画面でシャッフルする。a は正解の番号（0 から）。
 *
 *  k（問題の形）
 *    pick   ___ に入る語を選ぶ                     { s, o, a }
 *    ante   関係詞が指す名詞（先行詞）をタップ     { s, a: 'その語' }
 *    bug    まちがっている語をタップ               { s, a: 'その語', ok: '正しい文' }
 *    which  que の正体（0 関係詞／1 接続詞／2 疑問詞） { s, w: 'その語', a }
 *    ja     日本語の意味を選ぶ                     { s, o, a }
 *    build  タイルを並べて文を作る                 { s, d: [まぎらわしいタイル] }
 *    join   2つの文の合体として正しいものを選ぶ     { p: [文1, 文2], o, a }
 *    ng     ___ に入らないもの（NG）を選ぶ         { s, o, a: NG の番号 }。テストの「適切でないものを選べ」
 *  共通：ja（日本語訳）・why（答えたあとに出す説明）
 *
 *  例文はこのアプリのためのオリジナル。
 * ========================================================= */
window.RQ = window.RQ || {};

RQ.questions = [
  /* ---------- L1：que（もの）・語順 ---------- */
  { id: 'l1-ante1', L: 1, k: 'ante', s: 'La canción que canta Ana es muy bonita.', a: 'canción', ja: 'アナが歌っている歌は、とてもきれいだ。', why: 'que のすぐ前の名詞が先行詞。canción（歌）を「アナが歌っている」が説明している。' },
  { id: 'l1-01', L: 1, k: 'pick', s: 'Este es el libro ___ compré ayer.', o: ['que', 'qué', 'de'], a: 0, ja: 'これが、昨日買った本だ。', why: '名詞（el libro）のあとに説明をつなぐ → que。アクセントつきの qué は「何？」の疑問詞。' },
  { id: 'l1-02', L: 1, k: 'pick', s: 'Hay un tren ___ sale a las tres.', o: ['que', 'qué', 'es'], a: 0, ja: '3時に出る電車がある。', why: 'que が「電車が」の主語になっている。' },
  { id: 'l1-03', L: 1, k: 'join', p: ['Tengo una bicicleta.', 'La bicicleta es roja.'], o: ['Tengo una bicicleta que es roja.', 'Tengo que una bicicleta es roja.', 'Tengo una bicicleta es roja que.'], a: 0, ja: '赤い自転車を持っている。', why: '名詞（una bicicleta）のすぐ後ろに que ＋ 説明。' },
  { id: 'l1-04', L: 1, k: 'build', s: 'Me gusta la canción que canta Ana.', d: ['qué'], ja: 'アナが歌っている歌が好きだ。' },
  { id: 'l1-05', L: 1, k: 'ja', s: 'El pan que compro aquí es muy bueno.', o: ['ここで買うパンは、とてもおいしい。', 'ここでパンを買うのは、とてもいいことだ。', 'ここのパンを買いたい。'], a: 0, why: 'el pan（パン）← que compro aquí（ここで買う）。主語は「パン」。' },
  { id: 'l1-06', L: 1, k: 'ante', s: 'El café que preparas es delicioso.', a: 'café', ja: '君がいれるコーヒーは、おいしい。' },
  { id: 'l1-07', L: 1, k: 'pick', s: 'La carta ___ escribiste es muy bonita.', o: ['que', 'qué', 'la'], a: 0, ja: '君が書いた手紙は、とてもすてきだ。' },
  { id: 'l1-08', L: 1, k: 'build', s: 'Vivo en una casa que tiene jardín.', d: ['qué'], ja: '庭のある家に住んでいる。' },
  { id: 'l1-09', L: 1, k: 'ja', s: 'Leo el periódico que compra mi padre.', o: ['父が買う新聞を読む。', '父は、私が読む新聞を買う。', '父は新聞を読んでから買う。'], a: 0, why: 'el periódico（新聞）← que compra mi padre（父が買う）。読むのは「私」（leo）。' },
  { id: 'l1-10', L: 1, k: 'join', p: ['Es un museo.', 'El museo tiene muchos cuadros.'], o: ['Es un museo que tiene muchos cuadros.', 'Es un museo que el museo tiene muchos cuadros.', 'Es que un museo tiene muchos cuadros.'], a: 0, ja: 'たくさんの絵がある美術館だ。', why: 'かぶった名詞（el museo）は que に変身して消える。両方残すとまちがい。' },
  { id: 'l1-11', L: 1, k: 'pick', s: 'Las fotos ___ sacaste en la playa son preciosas.', o: ['que', 'qué', 'las'], a: 0, ja: '君が海で撮った写真は、すばらしい。' },
  { id: 'l1-12', L: 1, k: 'ante', s: 'Los zapatos que llevas son nuevos.', a: 'zapatos', ja: '君がはいている靴は、新しい。' },

  /* ---------- L2：que（人）・省略しない・割りこみ ---------- */
  { id: 'l2-ante1', L: 2, k: 'ante', s: 'La chica que baila con Pablo es mi hermana.', a: 'chica', ja: 'パブロと踊っている女の子は、私の妹だ。', why: 'que の前の名詞 chica が先行詞。Pablo は説明の中の人。' },
  { id: 'l2-01', L: 2, k: 'pick', s: 'El hombre ___ trabaja en la tienda es muy simpático.', o: ['que', 'qué', 'él'], a: 0, ja: '店で働いている男の人は、とても感じがいい。', why: '人でも que。él（彼）を入れると、文が2つに割れてしまう。' },
  { id: 'l2-02', L: 2, k: 'pick', s: 'Este es el libro ___ compré ayer.', o: ['que', '（何も入れない）', 'qué'], a: 0, ja: 'これが、昨日買った本だ。', why: 'que は省略できない。英語の the book I bought とはちがう。' },
  { id: 'l2-03', L: 2, k: 'join', p: ['La mujer es médica.', 'Ves a la mujer allí.'], o: ['La mujer que ves allí es médica.', 'La mujer ves allí es médica.', 'La mujer es médica que ves allí.'], a: 0, ja: 'あそこに見える女の人は、医者だ。', why: 'que のカタマリは先行詞（la mujer）のすぐ後ろに割りこむ。' },
  { id: 'l2-04', L: 2, k: 'build', s: 'El chico que canta es mi hermano.', d: ['quien'], ja: '歌っている男の子は、私の兄だ。' },
  { id: 'l2-05', L: 2, k: 'ja', s: 'La profesora que tenemos es de Perú.', o: ['私たちの先生は、ペルー出身だ。', '私たちは、ペルー出身の先生がほしい。', '先生は、私たちがペルー出身だと知っている。'], a: 0, why: 'la profesora ← que tenemos（私たちが持っている＝私たちの担当の）。' },
  { id: 'l2-06', L: 2, k: 'pick', s: 'Los niños ___ juegan en el parque son mis primos.', o: ['que', 'qué', 'los'], a: 0, ja: '公園で遊んでいる子どもたちは、私のいとこだ。' },
  { id: 'l2-07', L: 2, k: 'ante', s: 'Conozco a una chica que habla japonés.', a: 'chica', ja: '日本語を話す女の子を知っている。' },
  { id: 'l2-08', L: 2, k: 'pick', s: 'El médico ___ me ayudó es muy amable.', o: ['que', '（何も入れない）', 'qué'], a: 0, ja: '私を助けてくれた医者は、とても親切だ。', why: 'que は省略できない。' },
  { id: 'l2-09', L: 2, k: 'join', p: ['Tengo una vecina.', 'La vecina tiene tres perros.'], o: ['Tengo una vecina que tiene tres perros.', 'Tengo una vecina tiene tres perros.', 'Tengo una vecina que la vecina tiene tres perros.'], a: 0, ja: '犬を3匹飼っている、となりの人がいる。', why: 'que を入れる（省略しない）・かぶった名詞は消す、の2つ。' },
  { id: 'l2-10', L: 2, k: 'build', s: 'Tengo un amigo que vive en Madrid.', d: ['qué'], ja: '私には、マドリードに住んでいる友だちがいる。' },
  { id: 'l2-11', L: 2, k: 'ja', s: 'El hombre que ves allí es mi tío.', o: ['あそこに見える男の人は、私のおじだ。', 'あそこで見ている男の人は、私のおじだ。', '私のおじは、あそこにいる男の人を見ている。'], a: 0, why: 'ves は「君が見る」。男の人は「見られる」側。que が目的語のときは、後ろの動詞の主語に注意。' },
  { id: 'l2-12', L: 2, k: 'pick', s: 'Los estudiantes ___ conocí en el viaje son de Chile.', o: ['que', '（何も入れない）', 'qué'], a: 0, ja: '旅行で知り合った学生たちは、チリ出身だ。' },

  /* ---------- L3：quien（コンマ・複数・限定では que） ---------- */
  { id: 'l3-bug1', L: 3, k: 'bug', s: 'El chico quien vive allí es Pablo.', a: 'quien', ok: 'El chico que vive allí es Pablo.', ja: 'あそこに住んでいる男の子は、パブロだ。', why: 'コンマも前置詞もない → que の指定席。' },
  { id: 'l3-01', L: 3, k: 'pick', s: 'Mi abuela, ___ tiene ochenta años, todavía trabaja.', o: ['quien', 'quienes', 'quiena'], a: 0, ja: '祖母は、80歳だけど、まだ働いている。', why: 'コンマのあと・先行詞が1人 → quien（que でも OK）。quiena という形はない。' },
  { id: 'l3-02', L: 3, k: 'bug', s: 'La mujer quien trabaja aquí es muy amable.', a: 'quien', ok: 'La mujer que trabaja aquí es muy amable.', ja: 'ここで働いている女の人は、とても親切だ。', why: 'コンマなし・前置詞なし → que。' },
  { id: 'l3-03', L: 3, k: 'pick', s: 'Mis amigos, ___ son de México, hablan español.', o: ['quienes', 'quien', 'quienas'], a: 0, ja: '私の友だちは、メキシコ出身で、スペイン語を話す。', why: '先行詞が複数 → quienes。' },
  { id: 'l3-04', L: 3, k: 'bug', s: 'Mis tíos, quien viven en Osaka, tienen un restaurante.', a: 'quien', ok: 'Mis tíos, quienes viven en Osaka, tienen un restaurante.', ja: 'おじ夫婦は、大阪に住んでいて、レストランをやっている。', why: '先行詞（mis tíos）が複数 → quienes。' },
  { id: 'l3-05', L: 3, k: 'ja', s: 'Ana, quien estudia japonés, quiere visitar Kioto.', o: ['アナは日本語を勉強していて、京都を訪れたいと思っている。', '日本語を勉強しているアナは、京都に住みたい。', 'アナは、京都で日本語を勉強したい。'], a: 0, why: 'コンマにはさまれた所は（かっこ）のおまけの説明。本体は Ana quiere visitar Kioto。' },
  { id: 'l3-06', L: 3, k: 'pick', s: 'El chico ___ canta en la fiesta es Carlos.', o: ['que', 'quien', 'quienes'], a: 0, ja: 'パーティーで歌っている男の子は、カルロスだ。', why: 'コンマなし・前置詞なし → que。quien はここには入れない。' },
  { id: 'l3-07', L: 3, k: 'bug', s: 'Las chicas quienes bailan son mis primas.', a: 'quienes', ok: 'Las chicas que bailan son mis primas.', ja: '踊っている女の子たちは、私のいとこだ。', why: 'コンマなし → 人でも que。' },
  { id: 'l3-08', L: 3, k: 'pick', s: 'Mi profesora, ___ es de Barcelona, habla catalán.', o: ['quien', 'quienes', 'quiena'], a: 0, ja: '私の先生は、バルセロナ出身で、カタルーニャ語を話す。', why: '先行詞が1人 → quien。quien に女性形はない。' },
  { id: 'l3-09', L: 3, k: 'ja', s: 'El señor que vive arriba es pintor.', o: ['上の階に住んでいる男の人は、画家だ。', '画家の男の人は、上の階に住みたがっている。', 'その男の人は、上で絵をかいている。'], a: 0 },
  { id: 'l3-10', L: 3, k: 'pick', s: 'Los turistas ___ visitan el museo son de Corea.', o: ['que', 'quienes', 'quien'], a: 0, ja: '博物館を訪れている観光客は、韓国から来ている。', why: 'コンマなし → que。複数でも quienes にはしない。' },
  { id: 'l3-11', L: 3, k: 'ante', s: 'Mi hermana, quien vive en Japón, habla tres idiomas.', a: 'hermana', ja: '私の姉は、日本に住んでいて、3つの言語を話す。' },
  { id: 'l3-12', L: 3, k: 'pick', s: 'Nuestros vecinos, ___ son muy amables, nos ayudaron.', o: ['quienes', 'quien', 'quienas'], a: 0, ja: 'となりの人たちは、とても親切で、私たちを手伝ってくれた。' },

  { id: 'ng-l3-1', L: 3, k: 'ng', s: 'Mis amigos, ___ son de México, hablan español.', o: ['quienes', 'que', 'quien'], a: 2, ja: '私の友だちは、メキシコ出身で、スペイン語を話す。', why: '先行詞が複数なので quien は NG（quienes）。コンマのあとは que も OK。' },

  /* ---------- L4：前置詞は前へ（con quien・de quien・en que） ---------- */
  { id: 'l4-join1', L: 4, k: 'join', p: ['Este es el amigo.', 'Viajé a Perú con el amigo.'], o: ['Este es el amigo con quien viajé a Perú.', 'Este es el amigo quien viajé a Perú con.', 'Este es el amigo que viajé a Perú con.'], a: 0, ja: 'これが、いっしょにペルーへ旅行した友だちだ。', why: '前置詞 con は関係詞とセットで前へ。後ろには残せない。' },
  { id: 'l4-01', L: 4, k: 'pick', s: 'La chica ___ hablo todos los días es de Chile.', o: ['con quien', 'quien', 'que con'], a: 0, ja: '私が毎日話している女の子は、チリ出身だ。', why: 'hablo con la chica → con quien hablo。' },
  { id: 'l4-02', L: 4, k: 'pick', s: 'El chico ___ te hablé es este.', o: ['de quien', 'quien', 'que de'], a: 0, ja: '君に話した男の子は、この子だよ。', why: 'hablar de 〜（〜について話す）→ de quien。' },
  { id: 'l4-03', L: 4, k: 'build', s: 'Es la amiga con quien estudio.', d: ['que'], ja: '（彼女は）いっしょに勉強している友だちだ。' },
  { id: 'l4-04', L: 4, k: 'bug', s: 'El lápiz con quien escribo es azul.', a: 'quien', ok: 'El lápiz con que escribo es azul.', ja: '私が書くのに使う鉛筆は、青い。', why: 'quien は人専用。ものなら con que（L5 の con el que なら、もっと安全）。' },
  { id: 'l4-05', L: 4, k: 'ja', s: 'El hombre con quien hablaste es mi padre.', o: ['君が話していた男の人は、私の父だ。', '私の父は、君と話したがっている。', '君は、男の人と私の父について話した。'], a: 0 },
  { id: 'l4-06', L: 4, k: 'pick', s: 'Esta es la empresa ___ trabajo.', o: ['en que', 'que', 'quien'], a: 0, ja: 'これが、私の働いている会社だ。', why: 'trabajo en la empresa（会社で働く）→ en que。' },
  { id: 'l4-07', L: 4, k: 'bug', s: 'Esta es la chica que hablo con.', a: 'con', ok: 'Esta es la chica con quien hablo.', ja: 'これが、私が話している女の子だ。', why: '前置詞を文の最後に残すのは英語の形。スペイン語では関係詞の前へ。' },
  { id: 'l4-08', L: 4, k: 'pick', s: 'Los amigos ___ juego al fútbol son simpáticos.', o: ['con quienes', 'con quien', 'quienes'], a: 0, ja: 'いっしょにサッカーをする友だちは、感じがいい。', why: '前置詞 con ＋ 先行詞が複数 → con quienes。' },
  { id: 'l4-09', L: 4, k: 'join', p: ['Es la casa.', 'Nací en la casa.'], o: ['Es la casa en que nací.', 'Es la casa que nací en.', 'Es la casa que nací.'], a: 0, ja: '（ここは）私の生まれた家だ。', why: 'nací en la casa の en も、que といっしょに前へ。' },
  { id: 'l4-10', L: 4, k: 'ante', s: 'La señora de quien te hablé vive aquí.', a: 'señora', ja: '君に話した女の人は、ここに住んでいる。' },
  { id: 'l4-11', L: 4, k: 'pick', s: 'El año ___ nací fue 2010.', o: ['en que', 'que en', 'quien'], a: 0, ja: '私が生まれた年は、2010年だ。', why: 'nací en el año 〜 → en que。' },
  { id: 'l4-12', L: 4, k: 'build', s: 'Este es el pueblo en que nací.', d: ['quien'], ja: 'これが、私の生まれた村だ。' },

  { id: 'ng-l4-1', L: 4, k: 'ng', s: 'Esta es la casa ___ nací.', o: ['en que', 'en quien', 'donde'], a: 1, ja: 'これが、私の生まれた家だ。', why: 'quien は人専用。ものなら en que・donde（L5 の en la que も OK）。' },

  /* ---------- L5：前置詞＋冠詞＋que・al que ---------- */
  { id: 'l5-01', L: 5, k: 'pick', s: 'Esta es la casa en ___ que vivo.', o: ['la', 'el', 'las'], a: 0, ja: 'これが、私の住んでいる家だ。', why: '先行詞 la casa（女性・単数）→ la。' },
  { id: 'l5-02', L: 5, k: 'pick', s: 'El cuchillo con ___ que corto el pan es nuevo.', o: ['el', 'la', 'los', 'las'], a: 0, ja: 'パンを切るナイフは、新しい。', why: '先行詞 el cuchillo（男性・単数）→ el。' },
  { id: 'l5-03', L: 5, k: 'pick', s: 'Los amigos con ___ que viajé son de México.', o: ['los', 'las', 'el'], a: 0, ja: 'いっしょに旅行した友だちは、メキシコ出身だ。' },
  { id: 'l5-04', L: 5, k: 'pick', s: 'La mesa en ___ que comemos es muy vieja.', o: ['la', 'el', 'lo'], a: 0, ja: '私たちが食事するテーブルは、とても古い。' },
  { id: 'l5-05', L: 5, k: 'build', s: 'Esta es la casa en la que vivo.', d: ['el'], ja: 'これが、私の住んでいる家だ。' },
  { id: 'l5-06', L: 5, k: 'bug', s: 'Las chicas con los que trabajo son simpáticas.', a: 'los', ok: 'Las chicas con las que trabajo son simpáticas.', ja: 'いっしょに働いている女の子たちは、感じがいい。', why: 'las chicas（女性・複数）→ las。' },
  { id: 'l5-07', L: 5, k: 'join', p: ['Es la universidad.', 'Estudio en la universidad.'], o: ['Es la universidad en la que estudio.', 'Es la universidad la que estudio en.', 'Es la universidad en el que estudio.'], a: 0, ja: '（ここが）私の勉強している大学だ。', why: 'en la universidad → en la que。名詞だけが que に変わり、la は残る。' },
  { id: 'l5-08', L: 5, k: 'pick', s: 'El chico ___ llamé ayer es mi primo.', o: ['al que', 'a el que', 'el que'], a: 0, ja: '昨日電話した男の子は、私のいとこだ。', why: 'a ＋ el は al にくっつく。' },
  { id: 'l5-09', L: 5, k: 'ja', s: 'Es la llave con la que abro la puerta.', o: ['ドアを開けるのに使う鍵だ。', 'ドアを開けたのは、その鍵だった。', 'ドアのそばにある鍵だ。'], a: 0, why: 'con la que abro（それで開ける）＝道具の con。' },
  { id: 'l5-10', L: 5, k: 'bug', s: 'El parque en la que jugamos es grande.', a: 'la', ok: 'El parque en el que jugamos es grande.', ja: '私たちが遊ぶ公園は、大きい。', why: 'parque は男性名詞 → el。' },
  { id: 'l5-11', L: 5, k: 'pick', s: 'Las personas a ___ que ayudamos están muy contentas.', o: ['las', 'los', 'la'], a: 0, ja: '私たちが手伝った人たちは、とても喜んでいる。' },
  { id: 'l5-12', L: 5, k: 'ante', s: 'La silla en la que estás sentado es de mi abuelo.', a: 'silla', ja: '君がすわっているいすは、祖父のものだ。' },
  { id: 'l5-13', L: 5, k: 'build', s: 'Son los amigos con los que viajé.', d: ['las'], ja: '（彼らは）いっしょに旅行した友だちだ。' },

  { id: 'ng-l5-1', L: 5, k: 'ng', s: 'La chica ___ hablo es mi prima.', o: ['con la que', 'con quien', 'con que'], a: 2, ja: '私が話している女の子は、いとこだ。', why: '人を指すとき、前置詞のあとに冠詞なしの que は NG。con quien か con la que。' },
  { id: 'ng-l5-2', L: 5, k: 'ng', s: 'El restaurante ___ comimos ayer es muy bueno.', o: ['en el que', 'en que', 'en la que', 'donde'], a: 2, ja: '昨日食べたレストランは、とてもいい。', why: 'restaurante は男性名詞なので en la que は NG（en el que）。ものなので en que・donde も OK。' },
  { id: 'ng-l5-3', L: 5, k: 'ng', s: 'El chico ___ llamé ayer es mi primo.', o: ['al que', 'a quien', 'que', 'a el que'], a: 3, ja: '昨日電話した男の子は、私のいとこだ。', why: 'a ＋ el は al にくっつくので a el que は NG。「〜を」に当たる人なら、前置詞なしの que も OK。' },
  { id: 'ng-l5-4', L: 5, k: 'ng', s: 'El chico ___ te hablé es este.', o: ['del que', 'de quien', 'de que'], a: 2, ja: '君に話した男の子は、この子だよ。', why: '人を指すとき、前置詞のあとの冠詞なし que は NG。de ＋ el que は del que。' },

  /* ---------- L6：donde と que の見分け ---------- */
  { id: 'l6-01', L: 6, k: 'pick', s: 'Esta es la ciudad ___ nací.', o: ['donde', 'que', 'quien'], a: 0, ja: 'ここが、私の生まれた町だ。', why: 'nací en la ciudad（町で生まれた）→ donde。' },
  { id: 'l6-02', L: 6, k: 'pick', s: 'Me gusta el barrio ___ vives.', o: ['donde', 'que', 'quien'], a: 0, ja: '君の住んでいる地区が好きだ。', why: 'vives en el barrio → donde。' },
  { id: 'l6-03', L: 6, k: 'pick', s: 'El parque ___ vimos ayer es enorme.', o: ['que', 'donde'], a: 0, ja: '昨日見た公園は、とても大きい。', why: 'vimos el parque（公園を見た）→ 目的語なので que。' },
  { id: 'l6-04', L: 6, k: 'pick', s: 'La playa ___ pasamos el verano es preciosa.', o: ['donde', 'que'], a: 0, ja: '私たちが夏をすごした海辺は、すばらしい。', why: 'pasamos el verano en la playa（海辺で）→ donde。' },
  { id: 'l6-05', L: 6, k: 'join', p: ['Esta es la tienda.', 'Compro pan en la tienda.'], o: ['Esta es la tienda donde compro pan.', 'Esta es la tienda que compro pan.', 'Esta es la tienda donde compro pan en.'], a: 0, ja: 'これが、私がパンを買う店だ。', why: 'en la tienda（店で）→ donde。donde の中に en が入っている。' },
  { id: 'l6-06', L: 6, k: 'bug', s: 'Barcelona es la ciudad que vive mi tía.', a: 'que', ok: 'Barcelona es la ciudad donde vive mi tía.', ja: 'バルセロナは、おばが住んでいる町だ。', why: 'vive en la ciudad（町に住む）→ donde（en la que でも OK）。' },
  { id: 'l6-07', L: 6, k: 'bug', s: 'Kioto es una ciudad donde quiero visitar.', a: 'donde', ok: 'Kioto es una ciudad que quiero visitar.', ja: '京都は、私が訪れたい町だ。', why: 'visitar la ciudad（町を訪れる）→ 目的語なので que。' },
  { id: 'l6-08', L: 6, k: 'ja', s: 'Este es el restaurante donde conocí a mi novia.', o: ['ここが、恋人と出会ったレストランだ。', 'ここが、恋人と行きたいレストランだ。', '恋人が知っているレストランは、ここだ。'], a: 0, why: 'conocer a 〜 は過去形で「〜と知り合った」。' },
  { id: 'l6-09', L: 6, k: 'pick', s: 'La escuela ___ estudio está cerca de la estación.', o: ['donde', 'que', 'quien'], a: 0, ja: '私が勉強している学校は、駅の近くにある。' },
  { id: 'l6-10', L: 6, k: 'build', s: 'Esta es la ciudad donde nací.', d: ['que'], ja: 'ここが、私の生まれた町だ。' },
  { id: 'l6-11', L: 6, k: 'pick', s: 'El hotel ___ reservamos tiene piscina.', o: ['que', 'donde'], a: 0, ja: '私たちが予約したホテルには、プールがある。', why: 'reservamos el hotel（ホテルを予約した）→ que。' },
  { id: 'l6-12', L: 6, k: 'pick', s: 'Es la oficina ___ trabaja mi madre.', o: ['donde', 'que'], a: 0, ja: '母が働いている事務所だ。', why: 'trabaja en la oficina → donde。' },

  { id: 'ng-l6-1', L: 6, k: 'ng', s: 'Esta es la ciudad ___ nací.', o: ['donde', 'en la que', 'en que', 'que'], a: 3, ja: 'ここが、私の生まれた町だ。', why: 'nací en la ciudad（町で）なので、en が必要。前置詞なしの que は NG。' },

  /* ---------- L7：lo que ---------- */
  { id: 'l7-01', L: 7, k: 'pick', s: 'No entiendo ___ dices.', o: ['lo que', 'que', 'el que'], a: 0, ja: '君の言うことが分からない。', why: '「言うこと」に当たる名詞がない → lo que。' },
  { id: 'l7-02', L: 7, k: 'pick', s: '___ quiero es dormir.', o: ['Lo que', 'Que', 'Qué'], a: 0, ja: '私がしたいのは、寝ることだ。' },
  { id: 'l7-03', L: 7, k: 'pick', s: 'Gracias por todo ___ haces por mí.', o: ['lo que', 'que', 'quien'], a: 0, ja: '私のためにしてくれる、いろいろなことに感謝してる。', why: 'todo lo que ＝「〜することぜんぶ」。' },
  { id: 'l7-04', L: 7, k: 'pick', s: 'El regalo ___ me diste es precioso.', o: ['que', 'lo que'], a: 0, ja: '君がくれたプレゼントは、すてきだ。', why: '前に名詞（el regalo）がある → que。' },
  { id: 'l7-05', L: 7, k: 'ja', s: 'No sé lo que pasó.', o: ['何が起きたのか、分からない。', '起きたことを知らない人だ。', 'それが起きるとは知らなかった。'], a: 0 },
  { id: 'l7-06', L: 7, k: 'build', s: 'Lo que quiero es dormir.', d: ['el'], ja: '私がしたいのは、寝ることだ。' },
  { id: 'l7-07', L: 7, k: 'bug', s: 'No entiendo que dices.', a: 'que', ok: 'No entiendo lo que dices.', ja: '君の言うことが分からない。', why: '「言うこと」に名詞がない → lo que（「何を言っているのか」の qué dices でも OK）。' },
  { id: 'l7-08', L: 7, k: 'ja', s: 'Llegó tarde, lo que me molestó mucho.', o: ['彼は遅れて来た。そのことに、私はとてもイライラした。', '遅れて来た人に、私はとてもイライラした。', '彼が遅れたのは、私がイライラさせたからだ。'], a: 0, why: 'コンマのあとの lo que は、前の文の内容ぜんぶ（遅れて来たこと）を受ける。' },
  { id: 'l7-09', L: 7, k: 'pick', s: 'Esto es ___ necesito.', o: ['lo que', 'que', 'quien'], a: 0, ja: 'これが、私に必要なものだ。' },
  { id: 'l7-10', L: 7, k: 'pick', s: 'Hay muchas cosas ___ quiero hacer.', o: ['que', 'lo que'], a: 0, ja: 'したいことが、たくさんある。', why: '前に名詞（cosas）がある → que。' },
  { id: 'l7-11', L: 7, k: 'pick', s: 'Me gusta mucho ___ cocina tu madre.', o: ['lo que', 'que', 'quien'], a: 0, ja: '君のお母さんが作る料理が、とても好きだ。' },
  { id: 'l7-12', L: 7, k: 'ja', s: 'Todo lo que dijo era verdad.', o: ['彼が言ったことは、ぜんぶ本当だった。', '彼が言ったことは、ほとんど本当だった。', '本当のことを言った人は、みんないた。'], a: 0 },

  /* ---------- L8：el que / la que（名詞を省く） ---------- */
  { id: 'l8-01', L: 8, k: 'pick', s: 'Estos zapatos son ___ compré ayer.', o: ['los que', 'lo que', 'las que'], a: 0, ja: 'この靴が、昨日買ったやつだ。', why: '省いた名詞 zapatos（男性・複数）→ los que。' },
  { id: 'l8-02', L: 8, k: 'pick', s: '___ llega tarde paga el café.', o: ['El que', 'Lo que', 'Que'], a: 0, ja: '遅れて来た人が、コーヒー代を払う。', why: '「〜する人」→ el que。' },
  { id: 'l8-03', L: 8, k: 'pick', s: 'Mi casa es ___ tiene la puerta roja.', o: ['la que', 'lo que', 'el que'], a: 0, ja: '私の家は、赤いドアのやつだ。', why: '省いた名詞 casa（女性・単数）→ la que。' },
  { id: 'l8-04', L: 8, k: 'pick', s: 'De todos los coches, ___ más me gusta es el blanco.', o: ['el que', 'lo que', 'la que'], a: 0, ja: '車の中で、いちばん好きなのは白いのだ。' },
  { id: 'l8-05', L: 8, k: 'bug', s: 'Mis llaves son los que están en la mesa.', a: 'los', ok: 'Mis llaves son las que están en la mesa.', ja: '私の鍵は、テーブルの上にあるやつだ。', why: 'llaves（女性・複数）→ las que。' },
  { id: 'l8-06', L: 8, k: 'ja', s: 'Los que estudian mucho aprueban el examen.', o: ['たくさん勉強する人たちは、試験に受かる。', 'たくさん勉強したので、試験に受かった。', '試験に受かる人は、勉強が好きだ。'], a: 0 },
  { id: 'l8-07', L: 8, k: 'pick', s: 'Esta película es ___ quiero ver.', o: ['la que', 'lo que', 'el que'], a: 0, ja: 'この映画が、私の見たいやつだ。' },
  { id: 'l8-08', L: 8, k: 'pick', s: 'No sé ___ quieres decir.', o: ['lo que', 'el que', 'la que'], a: 0, ja: '君が何を言いたいのか分からない。', why: '戻せる名詞がない「こと」→ lo que。' },
  { id: 'l8-09', L: 8, k: 'build', s: 'El que llega tarde paga el café.', d: ['lo'], ja: '遅れて来た人が、コーヒー代を払う。' },
  { id: 'l8-10', L: 8, k: 'ja', s: 'Mi coche es el que está ahí.', o: ['私の車は、そこにあるやつだ。', '私の車は、そこにあるの？', 'そこにあるのは、私の車じゃない。'], a: 0 },
  { id: 'l8-11', L: 8, k: 'pick', s: '¿Qué chaqueta es tuya? —___ es negra.', o: ['La que', 'Lo que', 'El que'], a: 0, ja: 'どのジャケットが君の？ー黒いやつ。', why: '省いた名詞 chaqueta（女性）→ la que。' },
  { id: 'l8-12', L: 8, k: 'bug', s: 'Lo que llega primero gana.', a: 'Lo', ok: 'El que llega primero gana.', ja: '最初に着いた人が勝ち。', why: '「〜する人」→ el que。lo que は「こと」で、人には使わない。' },

  { id: 'l8-13', L: 8, k: 'pick', s: 'Este es el libro ___ compré ayer.', o: ['que', 'el que', 'quien'], a: 0, ja: 'これが、昨日買った本だ。', why: '名詞のすぐ後ろ（前置詞なし）は que だけ。el que・quien は NG。' },

  /* ---------- L9：que の正体・アクセント ---------- */
  { id: 'l9-wh1', L: 9, k: 'which', s: 'Sé que vives aquí.', w: 'que', a: 1, ja: '君がここに住んでいることは知っている。', why: '前が動詞（sé）、後ろはそろった文（vives aquí）→ 接続詞「〜ということ」。' },
  { id: 'l9-wh2', L: 9, k: 'which', s: 'La casa que compramos es pequeña.', w: 'que', a: 0, ja: '私たちが買った家は、小さい。', why: '前が名詞（la casa）、後ろの compramos は「〜を」が欠けている → 関係詞。' },
  { id: 'l9-01', L: 9, k: 'which', s: 'Dice que el tren llega tarde.', w: 'que', a: 1, ja: '電車が遅れて着くと言っている。', why: '前が動詞（dice）、後ろはそろった文 → 接続詞。' },
  { id: 'l9-02', L: 9, k: 'which', s: '¿Qué hora es?', w: 'Qué', a: 2, ja: '何時ですか？', why: 'アクセントつきの qué → 疑問詞。' },
  { id: 'l9-03', L: 9, k: 'which', s: 'El chico que canta es mi hermano.', w: 'que', a: 0, ja: '歌っている男の子は、私の兄だ。', why: '前が名詞（el chico）、後ろの canta には主語がない → 関係詞。' },
  { id: 'l9-04', L: 9, k: 'which', s: 'Creo que mañana va a llover.', w: 'que', a: 1, ja: '明日は雨が降ると思う。', why: '前が動詞（creo）、後ろはそろった文 → 接続詞。' },
  { id: 'l9-05', L: 9, k: 'which', s: 'No sé qué hacer.', w: 'qué', a: 2, ja: '何をしたらいいか分からない。', why: 'アクセントつき → 疑問詞「何」（文の途中でも）。' },
  { id: 'l9-06', L: 9, k: 'which', s: 'Me gusta la música que escuchas.', w: 'que', a: 0, ja: '君が聞いている音楽が好きだ。', why: '前が名詞（la música）、後ろの escuchas は「〜を」が欠けている → 関係詞。' },
  { id: 'l9-07', L: 9, k: 'pick', s: 'Esta es la casa ___ vivo.', o: ['donde', 'dónde'], a: 0, ja: 'これが、私の住んでいる家だ。', why: '場所の関係詞 → アクセントなし。' },
  { id: 'l9-08', L: 9, k: 'pick', s: '¿___ quieres comer?', o: ['Qué', 'Que'], a: 0, ja: '何を食べたい？', why: '「何？」の質問 → アクセントつき。' },
  { id: 'l9-09', L: 9, k: 'which', s: 'Pienso que tienes razón.', w: 'que', a: 1, ja: '君の言うとおりだと思う。' },
  { id: 'l9-10', L: 9, k: 'which', s: 'Las flores que me diste son muy bonitas.', w: 'que', a: 0, ja: '君がくれた花は、とてもきれいだ。' },
  { id: 'l9-11', L: 9, k: 'pick', s: 'Me dijo ___ estaba cansado.', o: ['que', 'qué', 'lo que'], a: 0, ja: '疲れている、と彼は私に言った。', why: '前が動詞（dijo）、後ろはそろった文 → 接続詞の que。' },
  { id: 'l9-12', L: 9, k: 'bug', s: 'No sé donde está mi llave.', a: 'donde', ok: 'No sé dónde está mi llave.', ja: '鍵がどこにあるか分からない。', why: '「どこにあるか」という質問の意味 → アクセントつきの dónde。' },

  /* ---------- L10：cuyo・el cual ---------- */
  { id: 'l10-01', L: 10, k: 'pick', s: 'Tengo un amigo ___ padre es piloto.', o: ['cuyo', 'cuya', 'quien'], a: 0, ja: 'お父さんがパイロットの友だちがいる。', why: '持ち物 padre（男性・単数）→ cuyo。' },
  { id: 'l10-02', L: 10, k: 'pick', s: 'Es una chica ___ hermanos viven en París.', o: ['cuyos', 'cuya', 'cuyas'], a: 0, ja: '（彼女は）お兄さんたちがパリに住んでいる女の子だ。', why: '持ち主（chica）ではなく、持ち物 hermanos（男性・複数）→ cuyos。' },
  { id: 'l10-03', L: 10, k: 'pick', s: 'Es un escritor ___ novelas son famosas.', o: ['cuyas', 'cuyo', 'cuyos'], a: 0, ja: '小説が有名な作家だ。', why: '持ち物 novelas（女性・複数）→ cuyas。' },
  { id: 'l10-04', L: 10, k: 'ja', s: 'Tengo una vecina cuyo perro es enorme.', o: ['犬がとても大きい、となりの人がいる。', 'となりの人は、とても大きい犬をほしがっている。', 'となりの人は、犬がとても好きだ。'], a: 0 },
  { id: 'l10-05', L: 10, k: 'bug', s: 'Es el chico cuya padre es médico.', a: 'cuya', ok: 'Es el chico cuyo padre es médico.', ja: '（彼は）お父さんが医者の男の子だ。', why: '持ち物 padre（男性）→ cuyo。' },
  { id: 'l10-06', L: 10, k: 'bug', s: 'Es una señora cuyo hijos viven en Japón.', a: 'cuyo', ok: 'Es una señora cuyos hijos viven en Japón.', ja: '子どもたちが日本に住んでいる女の人だ。', why: '持ち物 hijos（男性・複数）→ cuyos。' },
  { id: 'l10-07', L: 10, k: 'ja', s: 'Llegó tarde, lo cual me molestó.', o: ['彼は遅れて来た。そのことに、私はイライラした。', '遅れて来た人が、私をイライラさせた。', '私がイライラしたので、彼は遅れた。'], a: 0, why: 'lo cual は lo que の書き言葉版。前の文の内容を受ける。' },
  { id: 'l10-08', L: 10, k: 'pick', s: 'La casa ___ ventanas son azules es mía.', o: ['cuyas', 'cuya', 'cuyos'], a: 0, ja: '窓が青い家は、私のだ。' },
  { id: 'l10-09', L: 10, k: 'ante', s: 'Tengo un amigo cuyo padre es piloto.', a: 'amigo', ja: 'お父さんがパイロットの友だちがいる。', why: 'cuyo の持ち主（先行詞）は amigo。padre は持ち物。' },
  { id: 'l10-10', L: 10, k: 'pick', s: 'Es una ciudad ___ calles son muy estrechas.', o: ['cuyas', 'cuya', 'donde'], a: 0, ja: '道がとてもせまい町だ。' },
  { id: 'ng-l10-1', L: 10, k: 'ng', s: 'Mi abuela, ___ tiene ochenta años, todavía trabaja.', o: ['quien', 'que', 'la cual', 'quienes'], a: 3, ja: '祖母は、80歳だけど、まだ働いている。', why: '先行詞が1人なので quienes は NG。コンマのあとなら quien・que・la cual は OK。' },
  { id: 'ng-l10-2', L: 10, k: 'ng', s: 'Es la universidad ___ estudio.', o: ['en la que', 'en la cual', 'donde', 'en quien'], a: 3, ja: '（ここが）私の勉強している大学だ。', why: 'quien は人専用。前置詞のあとの la cual は OK。' },
  { id: 'ng-l10-3', L: 10, k: 'ng', s: 'Las chicas ___ trabajo son simpáticas.', o: ['con las que', 'con quienes', 'con las cuales', 'con que'], a: 3, ja: 'いっしょに働いている女の子たちは、感じがいい。', why: '人を指すとき、前置詞のあとの冠詞なし que は NG。' },
  { id: 'l10-11', L: 10, k: 'join', p: ['Tengo un amigo.', 'Su madre es profesora.'], o: ['Tengo un amigo cuya madre es profesora.', 'Tengo un amigo cuyo madre es profesora.', 'Tengo un amigo que madre es profesora.'], a: 0, ja: 'お母さんが先生の友だちがいる。', why: 'su（彼の）が cuyo に変身。形は持ち物 madre に合わせて cuya。' }
];
