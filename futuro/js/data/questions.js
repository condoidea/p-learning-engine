/* =========================================================
 * ¿QUÉ SERÁ? — 問題バンク（L1〜L12）
 *
 *  レッスン（lessons.js）の drill や、ボス戦、復習で出す問題。
 *  L1〜L11 は各14問、L12（総まとめ）は20問。各問は、そのレッスンまでに習った形だけで作ってある（L7 は完了・進行形なし、L9 は未来完了なし、など）。
 *
 *  共通の項目
 *    id   'l1-01' のように（レッスン番号-通し番号）
 *    L    レッスン番号（数値）
 *    k    問題の種類（下）
 *    why  解説。日本語で短く。スペイン語は `…` でかこむ
 *
 *  文中の印（pick・who・ja の s だけで使う）
 *    {…}  習っている動詞の形（金色）   […]  時の手がかりの語（水色）   ^…^  変わった所
 *
 *  kind（k）
 *    pick   空所に入る形を選ぶ     { s（___ を1つ）, o（3つ）, a（正解の番号）, ja }
 *    form   原形から形を作る       { v（原形）, p（'fut' 未来／'cond' 過去未来）, s（主語 'yo' 'tú' 'él' 'nosotros' 'vosotros' 'ellos'）, o（動詞の形3つ）, a }
 *           ※ p は後半で 'perf' 'plup' 'futp' 'prog' も使う。完了・進行形の { } は haber/estar と分詞をまとめて
 *    scene  場面に合う文を選ぶ     { sit（日本語の場面）, o（3つ）, a }
 *    who    いつの話か             { s, a（時間の地図のマスの id：'fut-s' 'cond-s' 'past-s' など）, ja }  ※ L5 から
 *    ja     意味を選ぶ             { s, o（日本語3つ）, a }
 *    bug    まちがい探し           { s（印なし）, a（まちがった1語）, ok（直した文）, ja }
 *    build  タイル並べ             { s（スペース区切りの語がタイル。6語以内・印なし）, d（ダミータイル）, ja }
 *
 *  選択肢のダミーは「よくあるまちがい」（過去の形・主語ちがいの語尾・芯を変えずに原形から作った形・
 *  言いにくい形（tenré）・未来と過去未来の取りちがえ）。
 *  「いま」の形は、未来の手がかり（mañana など）があると正しい文にもなってしまうので、ダミーに使わない。
 *  例文はこのアプリのためのオリジナル。
 * ========================================================= */
window.FQ = window.FQ || {};

FQ.questions = (FQ.questions || []).concat([
  /* ================= L1 未来（原形に語尾をつける） ================= */
  { id: 'l1-01', L: 1, k: 'pick', s: '[Mañana] yo ___ con Rosa.', o: ['hablaré', 'hablé', 'hablaba'], a: 0, ja: 'あした、私はロサと話すでしょう。', why: '`mañana`（あした）は先の話。原形 `hablar` に yo の語尾 é をつけて `{hablaré}`。`hablé` は過去の形。' },
  { id: 'l1-02', L: 1, k: 'form', v: 'comer', p: 'fut', s: 'yo', o: ['comeré', 'comí', 'comía'], a: 0, why: '原形 `comer` に yo の語尾 é をつけて `{comeré}`。`comí`・`comía` は過去の形。' },
  { id: 'l1-03', L: 1, k: 'scene', sit: 'ロサに「あした、雨がふるでしょう」と予言する', o: ['Mañana lloverá.', 'Ayer llovió.', 'Ahora llueve.'], a: 0, why: 'あしたの話なので、原形 `llover` に「それは」の語尾 á で `{lloverá}`。`llovió` は過去、`llueve` はいまの形。' },
  { id: 'l1-04', L: 1, k: 'ja', s: '[Mañana] {viviremos} aquí.', o: ['あした、私たちはここに住むでしょう。', 'きのう、私たちはここに住んだ。', 'あした、私はここに住むでしょう。'], a: 0, why: '`viviremos` の語尾 emos は nosotros（私たち）。yo なら `{viviré}`。' },
  { id: 'l1-05', L: 1, k: 'bug', s: 'Mañana yo comerás el pan.', a: 'comerás', ok: 'Mañana yo comeré el pan.', ja: 'あした、私はパンを食べるでしょう。', why: '`yo`（私は）の語尾は é。`comerás` の ás は tú（君は）の語尾。' },
  { id: 'l1-06', L: 1, k: 'build', s: 'Mañana hablaré con Rosa.', d: ['hablé'], ja: 'あした、ロサと話すでしょう。' },
  { id: 'l1-07', L: 1, k: 'pick', s: '[Mañana] tú ___ la puerta.', o: ['abrirás', 'abrirá', 'abriste'], a: 0, ja: 'あした、君はドアを開けるでしょう。', why: '`tú` の語尾は ás。原形 `abrir` のうしろにつけて `{abrirás}`。`abrirá` は「彼は」、`abriste` は過去の形。' },
  { id: 'l1-08', L: 1, k: 'form', v: 'vivir', p: 'fut', s: 'nosotros', o: ['viviremos', 'vivimos', 'vivíamos'], a: 0, why: '原形 `vivir` に nosotros の語尾 emos をつけて `{viviremos}`。`vivíamos` は過去の形。' },
  { id: 'l1-09', L: 1, k: 'scene', sit: 'ベトに「あした、君はたくさん勉強するだろう」と言う', o: ['Mañana estudiarás mucho.', 'Mañana estudiaré mucho.', 'Ayer estudiaste mucho.'], a: 0, why: 'ベトに話しかけるので tú の語尾 ás で `{estudiarás}`。`estudiaré` は yo、`estudiaste` は過去の形。' },
  { id: 'l1-10', L: 1, k: 'ja', s: '[Mañana] {trabajarán} en la tienda.', o: ['あした、彼らは店で働くでしょう。', 'あした、彼は店で働くでしょう。', 'きのう、彼らは店で働いた。'], a: 0, why: '`trabajarán` の語尾 án は ellos（彼ら）。「彼は」なら `{trabajará}`。' },
  { id: 'l1-11', L: 1, k: 'pick', s: '[Mañana] ellos ___ en casa.', o: ['comerán', 'comerá', 'comieron'], a: 0, ja: 'あした、彼らは家で食べるでしょう。', why: '`ellos`（彼ら）の語尾は án。`comerá` は1人（él）、`comieron` は過去の形。' },
  { id: 'l1-12', L: 1, k: 'form', v: 'hablar', p: 'fut', s: 'vosotros', o: ['hablaréis', 'hablasteis', 'hablabais'], a: 0, why: '原形 `hablar` に vosotros の語尾 éis をつけて `{hablaréis}`。`hablasteis`・`hablabais` は過去の形。' },
  { id: 'l1-13', L: 1, k: 'bug', s: 'Mañana tú hablará con Rosa.', a: 'hablará', ok: 'Mañana tú hablarás con Rosa.', ja: 'あした、君はロサと話すでしょう。', why: '`tú`（君は）の語尾は ás。`hablará` の á は「彼は」の語尾。' },
  { id: 'l1-14', L: 1, k: 'build', s: 'Mañana llegarán los chicos.', d: ['llegaron'], ja: 'あした、男の子たちが着くでしょう。' },

  /* ================= L2 主語いろいろ・「いつ」を表す語 ================= */
  { id: 'l2-01', L: 2, k: 'pick', s: '[Pasado mañana] yo ___ a Madrid.', o: ['viajaré', 'viajé', 'viajaba'], a: 0, ja: 'あさって、私はマドリードへ旅行するでしょう。', why: '`pasado mañana`（あさって）は先の話。原形 `viajar` に yo の語尾 é で `{viajaré}`。`viajé`・`viajaba` は過去の形。' },
  { id: 'l2-02', L: 2, k: 'ja', s: '[La semana que viene] {llegará} mi hermana.', o: ['来週、姉が着くでしょう。', '先週、姉が着いた。', '来年、姉が着くでしょう。'], a: 0, why: '`la semana que viene` は「来週」。`llegará` は「彼女は着くだろう」。「来年」は `el año que viene`。' },
  { id: 'l2-03', L: 2, k: 'pick', s: '[El año que viene] nosotros ___ en Sevilla.', o: ['viviremos', 'vivíamos', 'vivieron'], a: 0, ja: '来年、私たちはセビリアに住むでしょう。', why: '`el año que viene`（来年）は先の話。nosotros の語尾 emos で `{viviremos}`。`vivíamos`・`vivieron` は過去の形。' },
  { id: 'l2-04', L: 2, k: 'form', v: 'estudiar', p: 'fut', s: 'tú', o: ['estudiarás', 'estudiaste', 'estudiabas'], a: 0, why: '原形 `estudiar` に tú の語尾 ás で `{estudiarás}`。`estudiaste`・`estudiabas` は過去の形。' },
  { id: 'l2-05', L: 2, k: 'scene', sit: 'カルメンおばあさんに「2日後に、孫のマルタが着くでしょう」と予言する', o: ['Marta llegará dentro de dos días.', 'Marta llegó dentro de dos días.', 'Marta llegaba dentro de dos días.'], a: 0, why: '`dentro de dos días`（2日後）は先の話。「彼女は」の語尾 á で `{llegará}`。`llegó`・`llegaba` は過去の形。' },
  { id: 'l2-06', L: 2, k: 'ja', s: '[Dentro de] una hora {comeremos}.', o: ['1時間後に、私たちは食べるでしょう。', '1時間前に、私たちは食べた。', '1時間後に、私は食べるでしょう。'], a: 0, why: '`dentro de` は「〜後に」。`comeremos` の語尾 emos は nosotros（私たち）。' },
  { id: 'l2-07', L: 2, k: 'pick', s: '[Algún día] tú ___ una casa grande.', o: ['comprarás', 'compraste', 'comprabas'], a: 0, ja: 'いつか、君は大きな家を買うでしょう。', why: '`algún día`（いつか）は先の話。tú の語尾 ás で `{comprarás}`。`compraste`・`comprabas` は過去の形。' },
  { id: 'l2-08', L: 2, k: 'form', v: 'dormir', p: 'fut', s: 'yo', o: ['dormiré', 'duermiré', 'dormí'], a: 0, why: '未来の形は原形から作るので、いまの形 `duermo` の ue は出てこない。`{dormiré}`。`dormí` は過去の形。' },
  { id: 'l2-09', L: 2, k: 'bug', s: 'Mañana ellos hablaremos con Rosa.', a: 'hablaremos', ok: 'Mañana ellos hablarán con Rosa.', ja: 'あした、彼らはロサと話すでしょう。', why: '`ellos`（彼ら）の語尾は án。`hablaremos` の emos は nosotros（私たち）の語尾。' },
  { id: 'l2-10', L: 2, k: 'build', s: 'Dentro de dos días llegará Marta.', d: ['llegó'], ja: '2日後に、マルタが着くでしょう。' },
  { id: 'l2-11', L: 2, k: 'pick', s: '[La semana que viene] vosotros ___ un libro.', o: ['escribiréis', 'escribisteis', 'escribíais'], a: 0, ja: '来週、君たちは本を書くでしょう。', why: '`la semana que viene`（来週）は先の話。vosotros の語尾 éis で `{escribiréis}`。`escribisteis`・`escribíais` は過去の形。' },
  { id: 'l2-12', L: 2, k: 'scene', sit: 'ベトに「あさって、君は試験でうまく書けるでしょう」と言う', o: ['Pasado mañana escribirás bien.', 'Pasado mañana escribirá bien.', 'Ayer escribiste bien.'], a: 0, why: 'ベトに話しかけるので tú の語尾 ás で `{escribirás}`。`escribirá` は「彼は」、`escribiste` は過去の形。' },
  { id: 'l2-13', L: 2, k: 'ja', s: '[Algún día] {viajarán} a Japón.', o: ['いつか、彼らは日本へ旅行するでしょう。', 'きのう、彼らは日本へ旅行した。', 'いつか、私は日本へ旅行するでしょう。'], a: 0, why: '`algún día` は「いつか」。`viajarán` の語尾 án は ellos（彼ら）。' },
  { id: 'l2-14', L: 2, k: 'form', v: 'ganar', p: 'fut', s: 'ellos', o: ['ganarán', 'ganaron', 'ganaban'], a: 0, why: '原形 `ganar` に ellos の語尾 án で `{ganarán}`。`ganaron`・`ganaban` は過去の形。' },

  /* ================= L3 芯が変わる①：e が落ちる ================= */
  { id: 'l3-01', L: 3, k: 'pick', s: '[Mañana] yo ___ jugar.', o: ['podré', 'poderé', 'pude'], a: 0, ja: 'あした、私は遊べるでしょう。', why: '`poder` の芯は `podr-`（e が落ちる）。yo の語尾 é で `{podré}`。`poderé` は原形のままで作った形で、ない。`pude` は過去の形。' },
  { id: 'l3-02', L: 3, k: 'form', v: 'saber', p: 'fut', s: 'tú', o: ['sabrás', 'saberás', 'sabías'], a: 0, why: '`saber` の芯は `sabr-`。tú の語尾 ás で `{sabrás}`。`saberás` は原形のままで作った形、`sabías` は過去の形。' },
  { id: 'l3-03', L: 3, k: 'scene', sit: 'ベトに「あさって、君は試合に出られるでしょう」と予言する', o: ['Pasado mañana podrás jugar.', 'Pasado mañana poderás jugar.', 'Ayer pudiste jugar.'], a: 0, why: '芯は `podr-`、tú の語尾 ás で `{podrás}`。`poderás` は原形のままで作った形、`pudiste` は過去の形。' },
  { id: 'l3-04', L: 3, k: 'pick', s: '[Algún día] ellos ___ la verdad.', o: ['sabrán', 'saberán', 'supieron'], a: 0, ja: 'いつか、彼らは本当のことを知るでしょう。', why: '`saber` の芯は `sabr-`。ellos の語尾 án で `{sabrán}`。`saberán` は原形のままで作った形、`supieron` は過去の形。' },
  { id: 'l3-05', L: 3, k: 'ja', s: '[Mañana] {habrá} mucha gente.', o: ['あした、たくさんの人がいるでしょう。', 'あした、たくさんの人が来た。', 'きのう、たくさんの人がいた。'], a: 0, why: '`haber` の芯は `habr-`。`{habrá}` は「あるだろう・いるだろう」。' },
  { id: 'l3-06', L: 3, k: 'form', v: 'querer', p: 'fut', s: 'nosotros', o: ['querremos', 'quereremos', 'quisimos'], a: 0, why: '`querer` の芯は `querr-`（r が2つ）。nosotros の語尾 emos で `{querremos}`。`quereremos` は原形のままで作った形、`quisimos` は過去の形。' },
  { id: 'l3-07', L: 3, k: 'bug', s: 'Mañana yo poderé ir.', a: 'poderé', ok: 'Mañana yo podré ir.', ja: 'あした、私は行けるでしょう。', why: '`poder` の芯は `podr-`。原形のまま `poderé` とは作らない。' },
  { id: 'l3-08', L: 3, k: 'build', s: 'Mañana habrá una fiesta.', d: ['haberá'], ja: 'あした、パーティーがあるでしょう。' },
  { id: 'l3-09', L: 3, k: 'pick', s: '[El año que viene] vosotros ___ viajar.', o: ['podréis', 'poderéis', 'pudisteis'], a: 0, ja: '来年、君たちは旅行できるでしょう。', why: '芯は `podr-`、vosotros の語尾 éis で `{podréis}`。`poderéis` は原形のままで作った形、`pudisteis` は過去の形。' },
  { id: 'l3-10', L: 3, k: 'scene', sit: 'カルメンおばあさんに「孫のマルタは、あなたと話したがるでしょう」と予言する', o: ['Marta querrá hablar con usted.', 'Marta quererá hablar con usted.', 'Marta quiso hablar con usted.'], a: 0, why: '`querer` の芯は `querr-`、「彼女は」の語尾 á で `{querrá}`。`quererá` は原形のままで作った形、`quiso` は過去の形。' },
  { id: 'l3-11', L: 3, k: 'form', v: 'haber', p: 'fut', s: 'él', o: ['habrá', 'haberá', 'habrán'], a: 0, why: '「あるだろう」は `{habrá}` の1つだけ。たくさんあっても habrá のまま。`haberá` は原形のままで作った形。' },
  { id: 'l3-12', L: 3, k: 'ja', s: '[Pasado mañana] {sabré} la verdad.', o: ['あさって、私は本当のことを知るでしょう。', 'あさって、君は本当のことを知るでしょう。', 'きのう、私は本当のことを知った。'], a: 0, why: '`sabré` は yo の語尾 é。tú なら `{sabrás}`。' },
  { id: 'l3-13', L: 3, k: 'pick', s: '[La semana que viene] ellos ___ ir a Madrid.', o: ['podrán', 'poderán', 'pudieron'], a: 0, ja: '来週、彼らはマドリードへ行けるでしょう。', why: '芯は `podr-`、ellos の語尾 án で `{podrán}`。`poderán` は原形のままで作った形、`pudieron` は過去の形。' },
  { id: 'l3-14', L: 3, k: 'bug', s: 'Mañana habrán muchos chicos.', a: 'habrán', ok: 'Mañana habrá muchos chicos.', ja: 'あした、たくさんの男の子がいるでしょう。', why: '「あるだろう・いるだろう」は、たくさんあっても `{habrá}` のまま。' },

  /* ================= L4 芯が変わる②：d が入る・短くなる ================= */
  { id: 'l4-01', L: 4, k: 'pick', s: '[Mañana] yo ___ mucho trabajo.', o: ['tendré', 'tenré', 'teneré'], a: 0, ja: 'あした、私は仕事がたくさんあるでしょう。', why: '`tener` の芯は `tendr-`（d が入る）。yo の語尾 é で `{tendré}`。`tenré` は d を入れ忘れた形、`teneré` は原形のままで作った形。' },
  { id: 'l4-02', L: 4, k: 'form', v: 'venir', p: 'fut', s: 'tú', o: ['vendrás', 'venirás', 'venrás'], a: 0, why: '`venir` の芯は `vendr-`。tú の語尾 ás で `{vendrás}`。`venirás` は原形のままで作った形、`venrás` は d を入れ忘れた形。' },
  { id: 'l4-03', L: 4, k: 'scene', sit: 'ウーゴに「あした、あの人は店に来るでしょう」と予言する', o: ['Mañana ella vendrá a la tienda.', 'Mañana ella venirá a la tienda.', 'Ayer ella vino a la tienda.'], a: 0, why: '芯は `vendr-`、「彼女は」の語尾 á で `{vendrá}`。`venirá` は原形のままで作った形、`vino` は過去の形。' },
  { id: 'l4-04', L: 4, k: 'pick', s: '[Pasado mañana] nosotros ___ de casa a las ocho.', o: ['saldremos', 'saliremos', 'salremos'], a: 0, ja: 'あさって、私たちは8時に家を出るでしょう。', why: '`salir` の芯は `saldr-`（i のかわりに d）。nosotros の語尾 emos で `{saldremos}`。`saliremos` は原形のまま、`salremos` は d を入れ忘れた形。' },
  { id: 'l4-05', L: 4, k: 'form', v: 'poner', p: 'fut', s: 'ellos', o: ['pondrán', 'ponerán', 'ponrán'], a: 0, why: '`poner` の芯は `pondr-`。ellos の語尾 án で `{pondrán}`。`ponerán` は原形のまま、`ponrán` は d を入れ忘れた形。' },
  { id: 'l4-06', L: 4, k: 'ja', s: '[Mañana] {hará} buen tiempo.', o: ['あした、よい天気になるでしょう。', 'きのう、よい天気だった。', 'あした、悪い天気になるでしょう。'], a: 0, why: '`hacer` の芯は `har-`。`{hará} buen tiempo` は「よい天気になるだろう」。`mal tiempo` なら悪い天気。' },
  { id: 'l4-07', L: 4, k: 'pick', s: '[Algún día] ella me ___ la verdad.', o: ['dirá', 'decirá', 'dijo'], a: 0, ja: 'いつか、彼女は私に本当のことを言うでしょう。', why: '`decir` の芯は `dir-`。「彼女は」の語尾 á で `{dirá}`。`decirá` は原形のままで作った形、`dijo` は過去の形。' },
  { id: 'l4-08', L: 4, k: 'form', v: 'decir', p: 'fut', s: 'yo', o: ['diré', 'deciré', 'dicé'], a: 0, why: '`decir` の芯は `dir-`。yo の語尾 é で `{diré}`。`deciré` は原形のままで作った形、`dicé` はない形。' },
  { id: 'l4-09', L: 4, k: 'bug', s: 'Mañana ellos tenerán mucho trabajo.', a: 'tenerán', ok: 'Mañana ellos tendrán mucho trabajo.', ja: 'あした、彼らは仕事がたくさんあるでしょう。', why: '`tener` の芯は `tendr-`。原形のまま `tenerán` とは作らない。' },
  { id: 'l4-10', L: 4, k: 'build', s: 'Mañana Hugo hará pan.', d: ['hacerá'], ja: 'あした、ウーゴはパンを作るでしょう。' },
  { id: 'l4-11', L: 4, k: 'pick', s: '[La semana que viene] vosotros ___ aquí.', o: ['vendréis', 'veniréis', 'vinisteis'], a: 0, ja: '来週、君たちはここに来るでしょう。', why: '芯は `vendr-`、vosotros の語尾 éis で `{vendréis}`。`veniréis` は原形のままで作った形、`vinisteis` は過去の形。' },
  { id: 'l4-12', L: 4, k: 'scene', sit: '船長に「あした、あなたは港を出るでしょう」と予言する', o: ['Mañana saldrá del puerto.', 'Mañana salirá del puerto.', 'Ayer salió del puerto.'], a: 0, why: '芯は `saldr-`、usted の語尾 á で `{saldrá}`。`salirá` は原形のままで作った形、`salió` は過去の形。' },
  { id: 'l4-13', L: 4, k: 'form', v: 'hacer', p: 'fut', s: 'nosotros', o: ['haremos', 'hacemos', 'haceremos'], a: 0, why: '`hacer` の芯は `har-`。nosotros の語尾 emos で `{haremos}`。`hacemos` はいまの形、`haceremos` は原形のままで作った形。' },
  { id: 'l4-14', L: 4, k: 'ja', s: '[El año que viene] {vendremos} aquí.', o: ['来年、私たちはここに来るでしょう。', '来年、私たちはここに来た。', 'きのう、私たちはここに住んでいた。'], a: 0, why: '`vendremos` は venir の芯 `vendr-` に nosotros の語尾 emos。`el año que viene` は「来年」。' },

  /* ================= L5 過去未来（あの日から見た先） ================= */
  { id: 'l5-01', L: 5, k: 'pick', s: '[Dijo que] yo ___ con Rosa.', o: ['hablaría', 'hablaré', 'hablé'], a: 0, ja: '私はロサと話すだろう、と言った。', why: '`Dijo que` は過去。過去の時点から見た先なので、過去未来にそろえる。原形 `hablar` に ía をつけて `{hablaría}`。`hablaré` はいまから見た先、`hablé` は過去の形。' },
  { id: 'l5-02', L: 5, k: 'form', v: 'comer', p: 'cond', s: 'nosotros', o: ['comeríamos', 'comeremos', 'comimos'], a: 0, why: '原形 `comer` に nosotros の語尾 íamos で `{comeríamos}`。`comeremos` はいまから見た先、`comimos` は過去の形。' },
  { id: 'l5-03', L: 5, k: 'who', s: '[Dijo que] {vendría}.', a: 'cond-s', ja: '来るだろう、と言った。', why: '`Dijo que` のあとの `ía` は、あの日から見た先。「過去未来」のマス。' },
  { id: 'l5-04', L: 5, k: 'who', s: '[Mañana] {vendrá}.', a: 'fut-s', ja: 'あした、来るでしょう。', why: '`mañana` は先の話。いまから見た先なので、「未来」のマス。' },
  { id: 'l5-05', L: 5, k: 'who', s: '[Ayer] {vino}.', a: 'past-s', ja: 'きのう、来た。', why: '`ayer` は済んだ話。点過去だから、「あの日（過去）」の「そのとき」のマス。' },
  { id: 'l5-06', L: 5, k: 'form', v: 'tener', p: 'cond', s: 'tú', o: ['tendrías', 'tenerías', 'tendrás'], a: 0, why: '未来の芯 `tendr-` のまま、tú の語尾 ías で `{tendrías}`。`tenerías` は原形のままで作った形、`tendrás` はいまから見た先。' },
  { id: 'l5-07', L: 5, k: 'pick', s: '[Dijo que] ellos ___ en Madrid.', o: ['vivirían', 'vivirán', 'vivieron'], a: 0, ja: '彼らはマドリードに住むだろう、と言った。', why: '`Dijo que` は過去。過去の時点から見た先なので、過去未来にそろえる。ellos の語尾 ían で `{vivirían}`。`vivirán` はいまから見た先、`vivieron` は過去の形。' },
  { id: 'l5-08', L: 5, k: 'ja', s: '[Dijo que] {podríamos} jugar.', o: ['私たちは遊べるだろう、と言った。', '私たちは遊べるでしょう。', '私たちは遊べた、と言った。'], a: 0, why: '`podr-`（未来と同じ芯）＋ nosotros の語尾 íamos。`Dijo que` のあとなので「〜だろう、と言った」。' },
  { id: 'l5-09', L: 5, k: 'bug', s: 'Dijo que yo hablarías con Rosa.', a: 'hablarías', ok: 'Dijo que yo hablaría con Rosa.', ja: '私はロサと話すだろう、と言った。', why: '`yo`（私は）の語尾は ía。`hablarías` の ías は tú（君は）の語尾。' },
  { id: 'l5-10', L: 5, k: 'build', s: 'Dijo que ganaríamos el partido.', d: ['ganaríais'], ja: '私たちは試合に勝つだろう、と言った。' },
  { id: 'l5-11', L: 5, k: 'scene', sit: 'ロサの先週の予言を、帳簿に書く。「雨がふるだろう、と言った」', o: ['Dijo que llovería.', 'Dijo que llovió.', 'Dijo que llovía.'], a: 0, why: '「ふるだろう」は、あの日から見た先。原形 `llover` に ía で `{llovería}`。`llovió`・`llovía` は「ふった」「ふっていた」という過去の形。' },
  { id: 'l5-12', L: 5, k: 'who', s: '[Dijo que] {tendría} un examen.', a: 'cond-s', ja: '試験があるだろう、と言った。', why: '`tendr-` ＋ ía。`Dijo que` のあとなので、あの日から見た先。「過去未来」のマス。' },
  { id: 'l5-13', L: 5, k: 'form', v: 'hablar', p: 'cond', s: 'ellos', o: ['hablarían', 'hablarán', 'hablaban'], a: 0, why: '原形 `hablar` に ellos の語尾 ían で `{hablarían}`。`hablarán` はいまから見た先、`hablaban` は過去の形。' },
  { id: 'l5-14', L: 5, k: 'pick', s: '[Dijo que] nosotros ___ la verdad.', o: ['sabríamos', 'sabremos', 'sabíamos'], a: 0, ja: '私たちは本当のことを知るだろう、と言った。', why: '`Dijo que` は過去。過去の時点から見た先なので、過去未来にそろえる。`saber` の芯 `sabr-` ＋ nosotros の語尾 íamos で `{sabríamos}`。`sabremos` はいまから見た先、`sabíamos` は「知っていた」。' },

  /* ================= L6 芯が変わる動詞の過去未来・やんわり言う ================= */
  { id: 'l6-01', L: 6, k: 'pick', s: '[Dijo que] ___ buen tiempo.', o: ['haría', 'hacería', 'hizo'], a: 0, ja: 'よい天気になるだろう、と言った。', why: '`hacer` の芯は未来と同じ `har-`。それに ía で `{haría}`。`hacería` は原形のままで作った形、`hizo` は過去の形。' },
  { id: 'l6-02', L: 6, k: 'form', v: 'poder', p: 'cond', s: 'tú', o: ['podrías', 'poderías', 'podrás'], a: 0, why: '未来の芯 `podr-` に tú の語尾 ías で `{podrías}`。`poderías` は原形のままで作った形、`podrás` はいまから見た先。' },
  { id: 'l6-03', L: 6, k: 'form', v: 'venir', p: 'cond', s: 'nosotros', o: ['vendríamos', 'venríamos', 'veníamos'], a: 0, why: '未来の芯 `vendr-` に nosotros の語尾 íamos で `{vendríamos}`。`venríamos` は d を入れ忘れた形、`veníamos` は「来ていた」。' },
  { id: 'l6-04', L: 6, k: 'scene', sit: '店で、お茶をやんわりと頼む。「お茶がほしいのですが」', o: ['Me gustaría un té.', 'Me gusta un té.', 'Me gustó un té.'], a: 0, why: '「〜がほしいのですが」と、やわらかく言うときは `{Me gustaría}`。`Me gusta` は「〜が好き」、`Me gustó` は「気に入った」。' },
  { id: 'l6-05', L: 6, k: 'pick', s: '¿___ abrir la ventana, por favor?', o: ['Podría', 'Pudo', 'Podré'], a: 0, ja: '窓を開けていただけますか。', why: '「〜していただけますか」は `¿{Podría} …?`。`Pudo` は過去の形、`Podré` は未来の形（私は〜できるだろう）。' },
  { id: 'l6-06', L: 6, k: 'ja', s: '{Me gustaría} viajar a España.', o: ['スペインへ旅行したいのですが。', 'スペインへ旅行するのが好きです。', 'スペインへ旅行した。'], a: 0, why: '`Me gustaría` ＋ 原形は「〜したいのですが」。`gustar` の原形に ía をつけた形。' },
  { id: 'l6-07', L: 6, k: 'who', s: '[Dijo que] {sabría} la verdad.', a: 'cond-s', ja: '本当のことを知るだろう、と言った。', why: '`sabr-` ＋ ía。`Dijo que` のあとなので、あの日から見た先。「過去未来」のマス。' },
  { id: 'l6-08', L: 6, k: 'who', s: '[Mañana] {sabré} la verdad.', a: 'fut-s', ja: 'あした、私は本当のことを知るでしょう。', why: '`mañana` は先の話。いまから見た先なので、「未来」のマス。' },
  { id: 'l6-09', L: 6, k: 'bug', s: 'Dijo que tú tenerías mucho trabajo.', a: 'tenerías', ok: 'Dijo que tú tendrías mucho trabajo.', ja: '君は仕事がたくさんあるだろう、と言った。', why: '`tener` の芯は `tendr-`。過去未来も、原形のまま `tenerías` とは作らない。' },
  { id: 'l6-10', L: 6, k: 'form', v: 'decir', p: 'cond', s: 'yo', o: ['diría', 'decería', 'dije'], a: 0, why: '`decir` の芯は `dir-`。それに ía で `{diría}`。`decería` は原形のままで作った形、`dije` は過去の形。' },
  { id: 'l6-11', L: 6, k: 'build', s: '¿Podría abrir la ventana?', d: ['Podré'], ja: '窓を開けていただけますか。' },
  { id: 'l6-12', L: 6, k: 'pick', s: '[Dijo que] ellos ___ de casa.', o: ['saldrían', 'salirían', 'salieron'], a: 0, ja: '彼らは家を出るだろう、と言った。', why: '`salir` の芯 `saldr-` ＋ ellos の語尾 ían で `{saldrían}`。`salirían` は原形のままで作った形、`salieron` は過去の形。' },
  { id: 'l6-13', L: 6, k: 'scene', sit: '船長に「ここに来ていただけますか」と、やんわりお願いする', o: ['¿Podría venir aquí, por favor?', '¿Poderá venir aquí, por favor?', '¿Pudo venir aquí, por favor?'], a: 0, why: '`poder` の芯は `podr-`。それに ía で `¿{Podría} …?`。`Poderá` は原形のままで作った形で、ない。`Pudo` は過去の形。' },
  { id: 'l6-14', L: 6, k: 'pick', s: 'Me ___ hablar con usted.', o: ['gustaría', 'gustó', 'gustará'], a: 0, ja: 'あなたとお話ししたいのですが。', why: '「〜したいのですが」は `Me {gustaría} …`。`gustó` は「気に入った」（過去）、`gustará` は「気に入るだろう」。' },

  /* ================= L7 くもった水晶玉（推量） ================= */
  { id: 'l7-01', L: 7, k: 'pick', s: 'No veo bien el reloj. ___ las tres.', o: ['Serán', 'Son', 'Serían'], a: 0, ja: '時計がよく見えない。3時だろう。', why: '時計がよく見えない（くもり）、しかも「いま」の話。だから未来の形 `{serán}`。`son` は言い切る形。' },
  { id: 'l7-02', L: 7, k: 'pick', s: 'Beto no llama. ___ cansado.', o: ['Estará', 'Está', 'Estaría'], a: 0, ja: 'ベトから電話がない。疲れているのだろう。', why: '確かめられないので「だろう」。いまの推量なので未来の形 `{estará}`。' },
  { id: 'l7-03', L: 7, k: 'form', v: 'tener', p: 'fut', s: 'él', o: ['tendrá', 'tenía', 'tendría'], a: 0, why: '`tener` の未来形の芯は `tendr-`。él は `{tendrá}`。`tendría` は過去未来形。' },
  { id: 'l7-04', L: 7, k: 'form', v: 'ser', p: 'cond', s: 'ellos', o: ['serán', 'serían', 'eran'], a: 1, why: '過去未来形は、原形に `ía` の仲間をつける。ellos は `{serían}`。`serán` は未来形、`eran` は線過去。' },
  { id: 'l7-05', L: 7, k: 'scene', sit: '玉がくもって、写真の子の年が分からない。「10歳くらいだったろう」と言う', o: ['Tiene unos diez años.', 'Tendría unos diez años.', 'Tendrá unos diez años.'], a: 1, why: '写真は過去のこと。くもっているので過去未来形 `{tendría}`。`tiene`・`tendrá` は、いまの話の形。' },
  { id: 'l7-06', L: 7, k: 'scene', sit: '玉にはっきり「雨」と見える。「雨が降っている」と言う', o: ['Lloverá.', 'Llueve.', 'Llovería.'], a: 1, why: 'はっきり見えているので言い切る現在形 `{llueve}`。`{lloverá}` は、くもっているときの形。' },
  { id: 'l7-07', L: 7, k: 'ja', s: '{Estará} en casa.', o: ['家にいる。', '家にいるだろう。', '家にいた。'], a: 1, why: '未来の形 `{estará}` は、くもっているときの「〜だろう」にもなる。時の手がかりがなければ、いまの推量。' },
  { id: 'l7-08', L: 7, k: 'ja', s: '{Serían} las diez cuando llegó.', o: ['10時になるだろう。', '着いたのは10時ごろだっただろう。', '着いたとき10時だった。'], a: 1, why: '`{serían}` は、過去のことで、くもっているときの形。`cuando llegó`（過去）がその手がかり。' },
  { id: 'l7-09', L: 7, k: 'bug', s: 'No veo bien el reloj. Son las tres.', a: 'Son', ok: 'No veo bien el reloj. Serán las tres.', ja: '時計がよく見えない。3時だろう。', why: 'よく見えない（くもり）のに言い切る `son` はおかしい。「だろう」の未来形 `{serán}` にする。' },
  { id: 'l7-10', L: 7, k: 'bug', s: 'Serán las diez cuando llegó Beto.', a: 'Serán', ok: 'Serían las diez cuando llegó Beto.', ja: 'ベトが着いたのは10時ごろだっただろう。', why: '`llegó`（過去）の話。過去のくもりは過去未来形 `{serían}`。`serán` はいまの推量の形。' },
  { id: 'l7-11', L: 7, k: 'build', s: 'Estará en casa ahora.', d: ['Está'], ja: 'いまは家にいるだろう。' },
  { id: 'l7-12', L: 7, k: 'pick', s: 'Hugo no abre la tienda. ___ mucho trabajo.', o: ['Tendrá', 'Tiene', 'Tendría'], a: 0, ja: 'ウーゴは店を開けない。仕事が多いのだろう。', why: 'はっきりは分からないので「だろう」。いまの推量なので `{tendrá}`。' },
  { id: 'l7-13', L: 7, k: 'pick', s: 'Cuando llegó el tren, ___ las nueve.', o: ['serían', 'serán', 'son'], a: 0, ja: '電車が着いたとき、9時ごろだっただろう。', why: '`llegó` は過去。過去のことで「だろう」は過去未来形 `{serían}`。' },
  { id: 'l7-14', L: 7, k: 'scene', sit: '玉がくもっている。きのうの夜、あの人が来たのは「9時ごろだっただろう」と言う', o: ['Llegaría a las nueve.', 'Llegó a las nueve.', 'Llegará a las nueve.'], a: 0, why: '過去のことで、くもっているので過去未来形 `{llegaría}`。`llegó` は言い切る形、`llegará` は未来。' },

  /* ================= L8 済んだことの帳簿（過去分詞・現在完了） ================= */
  { id: 'l8-01', L: 8, k: 'form', v: 'comer', p: 'perf', s: 'yo', o: ['he comido', 'soy comido', 'he comida'], a: 0, why: 'haber の「いま」の形 ＋ 過去分詞。yo は `{he comido}`。過去分詞は女性形にしない。' },
  { id: 'l8-02', L: 8, k: 'form', v: 'hacer', p: 'perf', s: 'tú', o: ['has hecho', 'has hacido', 'has hecha'], a: 0, why: '`hacer` の過去分詞は `hecho`（規則どおりの hacido ではない）。tú は `{has hecho}`。' },
  { id: 'l8-03', L: 8, k: 'form', v: 'escribir', p: 'perf', s: 'nosotros', o: ['hemos escribido', 'hemos escrito', 'hemos escritos'], a: 1, why: '`escribir` の過去分詞は `escrito`。過去分詞は -o のままなので `{hemos escrito}`。' },
  { id: 'l8-04', L: 8, k: 'form', v: 'ver', p: 'perf', s: 'ellos', o: ['han visto', 'han veído', 'han vistos'], a: 0, why: '`ver` の過去分詞は `visto`。ellos は `{han visto}`。変わるのは haber だけ。' },
  { id: 'l8-05', L: 8, k: 'pick', s: '[Esta semana] Rosa ___ mucho.', o: ['ha trabajado', 'trabajó', 'han trabajado'], a: 0, ja: '今週、ロサはよく働いた。', why: '`esta semana` は、いまにつながっている。主語は Rosa（1人）なので `{ha trabajado}`。' },
  { id: 'l8-06', L: 8, k: 'pick', s: '[Todavía no] ___ la carta.', o: ['he escrito', 'he escribido', 'escrito he'], a: 0, ja: 'まだ手紙を書いていない。', why: '`escribir` の過去分詞は `escrito`。haber の形は主語 yo に合わせて `{he escrito}`。' },
  { id: 'l8-07', L: 8, k: 'pick', s: '¿[Ya] ___ el libro, Beto?', o: ['has leído', 'has leido', 'has leída'], a: 0, ja: 'ベト、もう本を読んだ？', why: '呼びかけが Beto（tú）なので `has`。`leer` の過去分詞は `leído`（í にアクセント記号）。' },
  { id: 'l8-08', L: 8, k: 'scene', sit: 'ロサに「今週、花をたくさん売った？」とたずねる', o: ['¿Has vendido muchas flores esta semana?', '¿Vendiste muchas flores esta semana?', '¿Has vendida muchas flores esta semana?'], a: 0, why: '`esta semana` はいまにつながるので現在完了 `{has vendido}`。過去分詞は女性形にしない。' },
  { id: 'l8-09', L: 8, k: 'scene', sit: '「きのうは、よく働いた」と言う', o: ['Ayer he trabajado mucho.', 'Ayer trabajé mucho.', 'Ayer trabajado mucho.'], a: 1, why: '`ayer` は切り離された済んだ日。点過去 `{trabajé}`。過去分詞だけでは文にならない。' },
  { id: 'l8-10', L: 8, k: 'ja', s: '[Ya] {he terminado}.', o: ['もう終えた。', 'まだ終えていない。', 'もう終えるだろう。'], a: 0, why: '`ya` は「もう」。`{he terminado}` は、いまにつながる済んだこと。' },
  { id: 'l8-11', L: 8, k: 'ja', s: '[Todavía no] {han llegado}.', o: ['もう着いた。', 'まだ着いていない。', '着かないだろう。'], a: 1, why: '`todavía no` は「まだ〜ない」。`no` と `todavía` は haber の前に置く。' },
  { id: 'l8-12', L: 8, k: 'bug', s: 'Ellas han trabajadas mucho.', a: 'trabajadas', ok: 'Ellas han trabajado mucho.', ja: '彼女たちはたくさん働いた。', why: '過去分詞は主語に合わせて変えない。`{han trabajado}`。変わるのは haber だけ。' },
  { id: 'l8-13', L: 8, k: 'bug', s: 'He ya comido.', a: 'ya', ok: 'Ya he comido.', ja: 'もう食べた。', why: 'haber と過去分詞のあいだには、何も入れない。`ya` は haber の前に置いて `{he comido}`。' },
  { id: 'l8-14', L: 8, k: 'build', s: 'Hoy he escrito una carta.', d: ['escribido'], ja: 'きょう、手紙を1通書いた。' },

  /* ================= L9 そのとき、もう済んでいた（過去完了） ================= */
  { id: 'l9-01', L: 9, k: 'form', v: 'salir', p: 'plup', s: 'yo', o: ['había salido', 'había salida', 'he salido'], a: 0, why: 'haber をあの日の形（線過去）にして ＋ 過去分詞。yo は `{había salido}`。' },
  { id: 'l9-02', L: 9, k: 'form', v: 'comer', p: 'plup', s: 'ellos', o: ['habían comido', 'había comido', 'habían comidos'], a: 0, why: 'haber が主語 ellos に合わせて `habían`。過去分詞は変わらず `{habían comido}`。' },
  { id: 'l9-03', L: 9, k: 'form', v: 'volver', p: 'plup', s: 'nosotros', o: ['habíamos vuelto', 'habíamos volvido', 'hemos vuelto'], a: 0, why: '`volver` の過去分詞は `vuelto`。nosotros は `{habíamos vuelto}`。' },
  { id: 'l9-04', L: 9, k: 'form', v: 'escribir', p: 'plup', s: 'tú', o: ['habías escrito', 'habías escribido', 'has escrito'], a: 0, why: '`escribir` の過去分詞は `escrito`。tú は `{habías escrito}`。`has escrito` は、いまにつながる形。' },
  { id: 'l9-05', L: 9, k: 'pick', s: '[Cuando llegué], el tren ya ___.', o: ['había salido', 'ha salido', 'salió'], a: 0, ja: '着いたとき、電車はもう出ていた。', why: '`cuando llegué` がその日の時点、`ya` がもう。それまでに済んでいたので `{había salido}`。' },
  { id: 'l9-06', L: 9, k: 'pick', s: '[Cuando llegué], Hugo ya ___ la tienda.', o: ['había cerrado', 'ha cerrado', 'cerró'], a: 0, ja: '着いたとき、ウーゴはもう店を閉めていた。', why: '着く前にもう閉めていたので `{había cerrado}`。`cerró` なら「着いたころに閉めた」。' },
  { id: 'l9-07', L: 9, k: 'pick', s: '[Hoy] el tren ya ___.', o: ['ha salido', 'había salido', 'salió'], a: 0, ja: 'きょう、電車はもう出た。', why: '`hoy` は、いまにつながっている。あの日の時点がないので `{ha salido}`。' },
  { id: 'l9-08', L: 9, k: 'who', s: '[Cuando llegué], ya {había salido}.', a: 'past-p', ja: '着いたとき、もう出ていた。', why: '`cuando llegué` はあの日の時点、`ya` は「もう」。あの日までに済んでいた。あの日 × 済んだ。' },
  { id: 'l9-09', L: 9, k: 'who', s: '[Ayer] Beto {llegó} tarde.', a: 'past-s', ja: 'きのう、ベトは遅れて着いた。', why: '`ayer` の出来事をそのまま言っている。あの日 × そのとき。' },
  { id: 'l9-10', L: 9, k: 'who', s: '[Hoy] ya {he comido}.', a: 'now-p', ja: 'きょう、もう食べた。', why: '`hoy`・`ya` は、いまにつながる済んだこと。いま × 済んだ。' },
  { id: 'l9-11', L: 9, k: 'ja', s: 'Cuando llegué, Beto ya {había vuelto}.', o: ['着いたとき、ベトはもう帰っていた。', '着いたとき、ベトが帰ってきた。', 'ベトはもう帰ってきたところだ。'], a: 0, why: '`{había vuelto}` は、着いたときより前に済んでいたこと。' },
  { id: 'l9-12', L: 9, k: 'scene', sit: '「ぼくが着いたとき、みんなはもう食べ終わっていた」と言う', o: ['Cuando llegué, todos habían comido.', 'Cuando llegué, todos han comido.', 'Cuando llegué, todos habían comidos.'], a: 0, why: '着いたとき（あの日）より前に済んでいたので `{habían comido}`。過去分詞は変わらない。' },
  { id: 'l9-13', L: 9, k: 'bug', s: 'Cuando llegué, los trenes ya habían salidos.', a: 'salidos', ok: 'Cuando llegué, los trenes ya habían salido.', ja: '着いたとき、電車はもう出ていた。', why: '過去分詞は主語（trenes・複数）に合わせて変えない。`{habían salido}`。' },
  { id: 'l9-14', L: 9, k: 'build', s: 'Ya había salido el tren.', d: ['han'], ja: '電車はもう出ていた。' },

  /* ================= L10 その日までには（未来完了） ================= */
  { id: 'l10-01', L: 10, k: 'form', v: 'terminar', p: 'futp', s: 'yo', o: ['habré terminado', 'he terminado', 'terminaré'], a: 0, why: 'haber をこれからの形にして ＋ 過去分詞。yo は `{habré terminado}`。芯は `habr-`。' },
  { id: 'l10-02', L: 10, k: 'form', v: 'hacer', p: 'futp', s: 'nosotros', o: ['habremos hecho', 'habremos hacido', 'habíamos hecho'], a: 0, why: '`hacer` の過去分詞は `hecho`。nosotros は `{habremos hecho}`。' },
  { id: 'l10-03', L: 10, k: 'form', v: 'escribir', p: 'futp', s: 'ellos', o: ['habrán escrito', 'habrán escribido', 'han escrito'], a: 0, why: '`escribir` の過去分詞は `escrito`。ellos は `{habrán escrito}`。' },
  { id: 'l10-04', L: 10, k: 'form', v: 'ver', p: 'futp', s: 'tú', o: ['habrás visto', 'habías visto', 'habrás vistos'], a: 0, why: '`ver` の過去分詞は `visto`。tú は `{habrás visto}`。`habías` はあの日の形。' },
  { id: 'l10-05', L: 10, k: 'pick', s: '[Para el viernes], yo ya ___ el trabajo.', o: ['habré terminado', 'he terminado', 'había terminado'], a: 0, ja: '金曜日までには、もう仕事を終えているだろう。', why: '`para el viernes` は、これから先の期限。haber をこれからの形にして `{habré terminado}`。' },
  { id: 'l10-06', L: 10, k: 'pick', s: '[Mañana a esta hora], Beto ya ___ a casa.', o: ['habrá llegado', 'ha llegado', 'había llegado'], a: 0, ja: 'あしたの今ごろには、ベトはもう家に着いているだろう。', why: '`mañana a esta hora` は、これから先の時点。そこまでに済んでいるので `{habrá llegado}`。' },
  { id: 'l10-07', L: 10, k: 'pick', s: 'Son las diez. Beto ya ___ de casa.', o: ['habrá salido', 'ha salido', 'saldrá'], a: 0, ja: '10時だ。ベトはもう家を出ただろう。', why: '済んだことの推量（くもった玉）は、haber をこれからの形に。`{habrá salido}`。' },
  { id: 'l10-08', L: 10, k: 'who', s: 'Para el [lunes], ya {habré terminado}.', a: 'fut-p', ja: '月曜日までには、もう終えているだろう。', why: '`para el lunes` は、これから先の期限。そこまでに済んでいる。これから × 済んだ。' },
  { id: 'l10-09', L: 10, k: 'who', s: '[Mañana] {llegaré} a casa.', a: 'fut-s', ja: 'あした、家に着くよ。', why: '`mañana` に着く、というこれから先の出来事。済んだ話ではない。これから × そのとき。' },
  { id: 'l10-10', L: 10, k: 'who', s: '[Cuando llegué], ya {habían comido}.', a: 'past-p', ja: '着いたとき、もう食べていた。', why: '`cuando llegué` はあの日の時点。あの日までに済んでいた。あの日 × 済んだ。' },
  { id: 'l10-11', L: 10, k: 'ja', s: 'Ya {habrá llegado}.', o: ['もう着くだろう。', 'もう着いただろう。', 'もう着いた。'], a: 1, why: '`{habrá llegado}` は「もう済んでいるだろう」。済んだことの推量（くもった玉）。' },
  { id: 'l10-12', L: 10, k: 'scene', sit: '玉がくもっている。「ベトは、もう帰っただろう」と言う', o: ['Ya habrá vuelto.', 'Ya ha vuelto.', 'Ya volverá.'], a: 0, why: '済んだことの推量なので `{habrá vuelto}`。`ha vuelto` は言い切る形、`volverá` はこれから帰る。' },
  { id: 'l10-13', L: 10, k: 'bug', s: 'Para el viernes habré terminada el trabajo.', a: 'terminada', ok: 'Para el viernes habré terminado el trabajo.', ja: '金曜日までに、仕事を終えているだろう。', why: '過去分詞は -o のまま。性や数に合わせない。`{habré terminado}`。' },
  { id: 'l10-14', L: 10, k: 'build', s: 'Ya habrá llegado Beto.', d: ['ha'], ja: 'ベトはもう着いただろう。' },

  /* ================= L11 いま、その最中（進行形） ================= */
  { id: 'l11-01', L: 11, k: 'form', v: 'comer', p: 'prog', s: 'nosotros', o: ['estamos comiendo', 'estamos comido', 'somos comiendo'], a: 0, why: 'estar をいまの形にして ＋ 現在分詞。nosotros は `{estamos comiendo}`。' },
  { id: 'l11-02', L: 11, k: 'form', v: 'leer', p: 'prog', s: 'yo', o: ['estoy leyendo', 'estoy leiendo', 'estoy leído'], a: 0, why: '`leer` はつづりが変わる4つの1つ。`{estoy leyendo}`（y）。' },
  { id: 'l11-03', L: 11, k: 'form', v: 'dormir', p: 'prog', s: 'él', o: ['está durmiendo', 'está dormiendo', 'es durmiendo'], a: 0, why: '`dormir` は o が u に変わる。`{está durmiendo}`。進行形の助けは estar（ser ではない）。' },
  { id: 'l11-04', L: 11, k: 'form', v: 'pedir', p: 'prog', s: 'ellos', o: ['están pidiendo', 'están pediendo', 'están pedido'], a: 0, why: '`pedir` は e が i に変わる。`{están pidiendo}`。' },
  { id: 'l11-05', L: 11, k: 'pick', s: '[Ahora mismo] Rosa ___ una carta.', o: ['está escribiendo', 'escribió', 'estaba escribiendo'], a: 0, ja: 'いま、まさに、ロサは手紙を書いている。', why: '`ahora mismo` は、いま、まさに最中。`{está escribiendo}`。' },
  { id: 'l11-06', L: 11, k: 'pick', s: '[Ayer] a las tres, ___ mucho.', o: ['estaba lloviendo', 'está lloviendo', 'estará lloviendo'], a: 0, ja: 'きのうの3時には、強く降っていた。', why: '`ayer a las tres` はあの日の時点。estar を線過去にして `{estaba lloviendo}`。' },
  { id: 'l11-07', L: 11, k: 'pick', s: '[Mañana] a las nueve, Beto ___ el examen.', o: ['estará haciendo', 'está haciendo', 'estaba haciendo'], a: 0, ja: 'あしたの9時には、ベトは試験を受けている最中だろう。', why: '`mañana` はこれから先。estar をこれからの形にして `{estará haciendo}`。' },
  { id: 'l11-08', L: 11, k: 'who', s: '[Ahora mismo] {está lloviendo}.', a: 'now-g', ja: 'いま、まさに雨が降っている。', why: '`ahora mismo`（いま、まさに）が手がかり。いま × 最中。' },
  { id: 'l11-09', L: 11, k: 'who', s: '[Ayer] a las tres, {estaba lloviendo}.', a: 'past-g', ja: 'きのうの3時には、降っていた。', why: '`ayer a las tres` はあの日の時点。あの日 × 最中。' },
  { id: 'l11-10', L: 11, k: 'who', s: '[Mañana] a esta hora, {estará lloviendo}.', a: 'fut-g', ja: 'あしたの今ごろは、降っているだろう。', why: '`mañana a esta hora` は、これから先の時点。これから × 最中。' },
  { id: 'l11-11', L: 11, k: 'ja', s: 'Beto {está estudiando} ahora mismo.', o: ['ベトはいま、勉強している最中だ。', 'ベトは毎日、勉強している。', 'ベトは勉強するだろう。'], a: 0, why: '`ahora mismo` と `{está estudiando}` で、いま、まさに最中。毎日のことなら現在形。' },
  { id: 'l11-12', L: 11, k: 'scene', sit: 'ふだんから犬を飼っている。「犬を飼っている」と言う', o: ['Tengo un perro.', 'Estoy teniendo un perro.', 'Estaba teniendo un perro.'], a: 0, why: '持っている・住んでいる、のような状態は、最中ではないので現在形 `tengo` のまま。' },
  { id: 'l11-13', L: 11, k: 'bug', s: 'Ahora mismo Rosa es leyendo una carta.', a: 'es', ok: 'Ahora mismo Rosa está leyendo una carta.', ja: 'いま、まさに、ロサは手紙を読んでいる。', why: '進行形の助けは estar。ser の `es` では作れない。`{está leyendo}`。' },
  { id: 'l11-14', L: 11, k: 'build', s: 'Está lloviendo mucho ahora.', d: ['Estaba'], ja: 'いま、雨がたくさん降っている。' },

  /* ================= L12 時間の地図（総まとめ） ================= */
  { id: 'l12-01', L: 12, k: 'who', s: '[Mañana] {saldré} temprano.', a: 'fut-s', ja: 'あしたは、早く出かけます。', why: '`mañana` が手がかり。これから先のことなので未来形。これから × そのとき。' },
  { id: 'l12-02', L: 12, k: 'who', s: 'Beto [dijo que] {vendría}.', a: 'cond-s', ja: 'ベトは、来ると言った。', why: '`dijo que` は過去。あの日から見た先なので過去未来形。' },
  { id: 'l12-03', L: 12, k: 'who', s: '[Esta mañana] {he escrito} una carta.', a: 'now-p', ja: 'けさ、手紙を書いた。', why: '`esta mañana` は、いまにつながる時。haber の「いま」の形 ＋ 過去分詞。いま × 済んだ。' },
  { id: 'l12-04', L: 12, k: 'who', s: '[Cuando llegamos], ya {habían cerrado} la tienda.', a: 'past-p', ja: '着いたとき、店はもう閉まっていた。', why: '`cuando llegamos` はあの日の時点。そこまでに済んでいた。あの日 × 済んだ。' },
  { id: 'l12-05', L: 12, k: 'who', s: 'Para el [viernes], {habré hecho} el trabajo.', a: 'fut-p', ja: '金曜日までには、仕事を終えているだろう。', why: '`para el viernes` は、これから先の期限。そこまでに済んでいる。これから × 済んだ。' },
  { id: 'l12-06', L: 12, k: 'who', s: '[Ahora mismo] Beto {está durmiendo}.', a: 'now-g', ja: 'いま、まさに、ベトは寝ている。', why: '`ahora mismo` は、いま、まさに。いま × 最中。' },
  { id: 'l12-07', L: 12, k: 'who', s: '[Ayer] por la noche, Rosa {estaba leyendo}.', a: 'past-g', ja: 'きのうの夜、ロサは読んでいる最中だった。', why: '`ayer por la noche` はあの日の時点。estar を線過去にして、あの日 × 最中。' },
  { id: 'l12-08', L: 12, k: 'who', s: '[Mañana] a las nueve, {estaremos trabajando}.', a: 'fut-g', ja: 'あしたの9時には、私たちは働いているだろう。', why: '`mañana a las nueve` は、これから先の時点。estar をこれからの形にして、これから × 最中。' },
  { id: 'l12-09', L: 12, k: 'who', s: '[Ayer] Hugo {trabajó} mucho.', a: 'past-s', ja: 'きのう、ウーゴはよく働いた。', why: '`ayer` の出来事を、そのまま言っている。あの日 × そのとき。' },
  { id: 'l12-10', L: 12, k: 'form', v: 'poder', p: 'cond', s: 'yo', o: ['podría', 'podré', 'podía'], a: 0, why: '`poder` の芯は `podr-`。過去未来形は `{podría}`。`podré` は未来形、`podía` は線過去。' },
  { id: 'l12-11', L: 12, k: 'form', v: 'salir', p: 'plup', s: 'ellos', o: ['habían salido', 'habrán salido', 'han salido'], a: 0, why: 'haber をあの日の形にして ＋ 過去分詞。ellos は `{habían salido}`。`habrán` はこれからの形。' },
  { id: 'l12-12', L: 12, k: 'pick', s: '[Mañana] a esta hora, ya ___ a casa.', o: ['habré llegado', 'he llegado', 'había llegado'], a: 0, ja: 'あしたの今ごろには、もう家に着いているだろう。', why: '`mañana a esta hora` は、これから先の時点。そこまでに済んでいるので `{habré llegado}`。' },
  { id: 'l12-13', L: 12, k: 'pick', s: '[Hoy] Rosa ___ mucho.', o: ['ha trabajado', 'trabajó', 'trabajaría'], a: 0, ja: 'きょう、ロサはよく働いた。', why: '`hoy` は、いまにつながっている。`{ha trabajado}`。`ayer` なら点過去 `trabajó`。' },
  { id: 'l12-14', L: 12, k: 'pick', s: 'Beto [dijo que] ___ tarde.', o: ['llegaría', 'llegará', 'ha llegado'], a: 0, ja: 'ベトは、遅れて着くと言った。', why: '`dijo que` は過去。過去の時点から見た先なので、過去未来にそろえて `{llegaría}`。未来形 `llegará` は、いまから見た先。' },
  { id: 'l12-15', L: 12, k: 'pick', s: '[Ahora mismo] nosotros ___ el pan.', o: ['estamos comiendo', 'estábamos comiendo', 'estaremos comiendo'], a: 0, ja: 'いま、まさに、私たちはパンを食べている。', why: '`ahora mismo` は、いま、まさに。estar をいまの形にして `{estamos comiendo}`。' },
  { id: 'l12-16', L: 12, k: 'form', v: 'decir', p: 'prog', s: 'tú', o: ['estás diciendo', 'estás deciendo', 'estás dicho'], a: 0, why: '`decir` は e が i に変わる4つの1つ。`{estás diciendo}`。' },
  { id: 'l12-17', L: 12, k: 'ja', s: 'Rosa [dijo que] {llovería} esa tarde.', o: ['ロサは、その日の午後は雨だろうと言った。', 'ロサは、雨が降っていたと言った。', 'ロサは、あした雨が降ると言う。'], a: 0, why: '`dijo que` は過去。そこから見た先なので過去未来形 `{llovería}`。' },
  { id: 'l12-18', L: 12, k: 'bug', s: 'Para el viernes ya he terminado el trabajo.', a: 'he', ok: 'Para el viernes ya habré terminado el trabajo.', ja: '金曜日までには、もう仕事を終えているだろう。', why: '`para el viernes` は、これから先の期限。haber をこれからの形にして `{habré terminado}`。' },
  { id: 'l12-19', L: 12, k: 'scene', sit: 'あしたの今ごろには、もう着いているだろう、と言う', o: ['Mañana a esta hora ya habré llegado.', 'Mañana a esta hora ya he llegado.', 'Mañana a esta hora ya había llegado.'], a: 0, why: '`mañana a esta hora` は、これから先の時点。そこまでに済んでいるので `{habré llegado}`。' },
  { id: 'l12-20', L: 12, k: 'build', s: 'Cuando llegué, ya había salido.', d: ['ha'], ja: '着いたとき、もう出ていた。' }
]);
