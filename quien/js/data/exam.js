/* =========================================================
 * 🎓 西検チャレンジの問題（西検4級と同じ形：空所・正しい形・意味・使い分け・まちがい探し）
 *
 *  QF.exam.secs：分野 { id: { n:分野の名前, c:おさらいする事件 } }
 *  QF.exam.items：{ s:分野, q:問い（日本語）, es?:文（空所は ___）, o:[…], a, why }
 *    20問を、分野ごとにほぼ同じ数ずつ出す。答え合わせは最後。合格ライン 70%
 *  ここに出る語は、すべて shared/es-words.js にあること（tests/check-quien.js が確かめる）
 * ========================================================= */
/* 単語帳にない語（チェックが指摘したもの。見出し語＝意味（品詞・級）：活用形）
 * 過去分詞：abrir→abierto/a/s/os＝開いた（4級）, cerrar→cerrado/a/s＝閉じた（4級）, romper→roto/a/s/os＝壊れた（4級）, escribir→escrito/a/s＝書かれた（4級）, hacer→hecho/hechos/hechas＝作られた（4級）, ver→visto/vista＝見られた（4級）, decir→dicho＝言われた（4級）, poner→puesta＝置かれた（4級）, robar→robado＝盗まれた（4級）, pintar→pintado/pintados/pintadas＝描かれた（4級）, comprar→comprado/comprados＝買われた（4級）, vender→vendida/vendidas＝売られた（4級）, preparar→preparada/preparado＝用意された（4級）, construir→construido/a/as＝建てられた（4級）, sentar→sentados/sentadas＝すわった（4級）, colgar→colgado＝かかった（それ以上）, apagar→apagadas＝消された（4級）, lavar→lavados＝洗われた（4級）, servir→servido＝出された（4級）, enviar→enviadas＝送られた（4級）, leer→leídos＝読まれた（4級）, visitar→visitado＝訪れられた（4級）, resolver→resuelto＝解決された（4級）, usar→usados＝使われた（4級）, cansada＝疲れた（形・4級）
 * 動詞：ser→fueron＝〜だった（4級）, estar→estamos＝いる（4級）, vender→vende/venden/vendes/vendemos＝売る（4級）, alquilar→alquila/alquilan/alquilas/alquilo＝貸す（4級）, abrir→abren/abrió＝開ける（4級）, comprar→compran/compras＝買う（4級）, construir→construye/construyen/construyo＝建てる（それ以上）, servir→sirve/sirven/sirvo/servimos＝出す（4級）, buscar→buscan＝捜す（4級）, decir→dicen/decimos/dije/dijeron/dio→dar/dieron＝言う・あげる（4級）, esperar→espera/esperan/espero＝待つ（4級）, recibir→recibe/reciben＝迎える（4級）, llegar→llegan＝着く（4級）, llover→lloverá/llueve＝雨が降る（4級）, querer→quieren＝愛する（4級）, saludar→saludan＝あいさつする（4級）, vestir→viste/visten＝服を着る（4級）, levantar→levanto/levantas＝起きる（4級）, lavar→lava/lavo/lavamos＝洗う（4級）, ducharse→ducho/ducha＝シャワーを浴びる（4級）, acostar→acuestas/acuesto＝寝かせる（4級）, peinar→peina＝とかす（4級）, ver→vemos＝見る（4級）, mirar→miran＝見る（4級）, escribir→escribimos＝書く（4級）, romper→rompió/rompieron/rompí＝壊す（4級）, caer→cayó/cayeron/caí/caímos＝落ちる（4級）, olvidar→olvidó/olvidaron/olvidaste＝忘れる（4級）, acabar→acabó＝終わる（4級）, apagar→apagó＝消す（4級）, comer→comieron＝食べる（4級）, dormir→durmió＝眠る（4級）, enviar→enviamos/envié＝送る（4級）, devolver→devolví＝返す（4級）, regalar→regalaron＝贈る（4級）, perder→perdieron＝失う（4級）, hacer→haciendo＝している（4級）
 * 名詞・形容詞・その他：puerta→puertas, casa→casas, piso→pisos, habitación→habitaciones, ventana, cena, billete→billetes, entrada→entradas, cliente→clientes, alumno→alumnos/alumnas, tienda→tiendas, plato→platos, cafés, luz→luces, mano→manos, carta→cartas, gafas, vaso, taza, paraguas, plato, sofá, pared, centro, zona, plaza, taquilla, bar, balón, sonrisa, viento, calor, domingo→domingos, lunes, siete, once（名・形・4級）；guardia（警備員）, portero（管理人）, cocinero（料理人）, camarero（ウェイター）, autor（作家）, escritora（女性作家）, pintora（女性画家）, periodista（記者）, artista（芸術家）, gente（人々）, problema（問題）, tele（テレビ）, rosa（バラ）, ellos（彼ら）, joven（若い）, nuevas（新しい）, baratos/baratas（安い）, mucha（たくさんの）, varios（いろいろな）, típicos（典型的な）, solos/sola（ひとりで）, tranquilo（静かな）, temprano（早く）, antes（前に）, desde（〜から）, porque（なぜなら）, cómo（どう）, repente（de repente＝急に）, pasado（過去の）, les（彼らに）, Luis/Pedro/Carmen/España/Italia（名前）
 * 試験のまちがい選択肢（実在しない形・使わせない）：escribida, escribido, rompida, rompido, hacidos, vido, cayeras
 */
(function () {
  'use strict';
  QF.exam = {
    secs: {
      ser:    { n: 'ser ＋ 過去分詞（受身）', c: 'c1' },
      estar:  { n: 'estar ＋ 過去分詞（状態）', c: 'c2' },
      pasiva: { n: '受身の se', c: 'c3' },
      imp:    { n: '無人称の se・3人称複数', c: 'c4' },
      refl:   { n: '再帰・相互の se', c: 'c5' },
      acc:    { n: '「勝手に」の se・強めの se', c: 'c6' },
      mix:    { n: 'se の使い分け（le → se をふくむ）', c: 'c7' }
    },
    items: [
      { s: 'ser', q: '___ に入るものを選びなさい。', es: 'Esta novela fue ___ por una escritora joven.', o: ['escrita', 'escribida', 'escrito', 'escrita por'], a: 0, why: 'la novela は女性名詞 → escrita。escribir の過去分詞は escrito（形が変わる）。' },
      { s: 'ser', q: '正しい文を選びなさい。', o: ['Las cartas fue escrita por Ana.', 'Las cartas fueron escrito por Ana.', 'Las cartas fueron escritas por Ana.', 'Las cartas fueron escritas de Ana.'], a: 2, why: 'ser も過去分詞も主語（las cartas＝女性・複数）に合わせる。やった人は por のあと。' },
      { s: 'ser', q: '___ に入るものを選びなさい。', es: 'Estos zapatos fueron ___ en Italia.', o: ['hechos', 'hecho', 'hechas', 'haciendo'], a: 0, why: 'hacer の過去分詞は hecho。zapatos は男性・複数 → hechos。' },
      { s: 'ser', q: 'まちがっている文を選びなさい。', o: ['El cuadro fue pintado por un artista.', 'Los libros fueron leídos por los alumnos.', 'Las cartas fueron enviadas ayer.', 'La puerta fue abierto por el guardia.'], a: 3, why: 'la puerta は女性・単数 → abierta。過去分詞は主語に合わせる。' },
      { s: 'ser', q: '次の文の意味として正しいものを選びなさい。', es: 'El museo fue visitado por muchos turistas.', o: ['博物館は多くの観光客を訪ねた。', '博物館は多くの観光客に訪れられた。', '博物館は観光客が建てた。', '博物館は観光客に閉められた。'], a: 1, why: 'ser ＋ 過去分詞 ＋ por 〜 ＝ 「〜によって…される」。por のあとの観光客が訪れた人。' },
      { s: 'ser', q: '___ に入るものを選びなさい。', es: 'La novela fue escrita ___ una periodista.', o: ['por', 'de', 'para', 'con'], a: 0, why: '受身でやった人を示すのは por。' },
      { s: 'ser', q: '___ に入るものを選びなさい。', es: 'El problema ___ resuelto por los vecinos ayer.', o: ['fueron', 'es', 'fue', 'fui'], a: 2, why: '主語 el problema（3人称単数）、ayer（過去）→ fue。' },
      { s: 'ser', q: '___ に入るものを選びなさい。', es: 'La ventana fue ___ por el viento.', o: ['rompida', 'rota', 'roto', 'rotas'], a: 1, why: 'romper の過去分詞は不規則で roto。la ventana は女性・単数 → rota。' },

      { s: 'estar', q: '___ に入るものを選びなさい。', es: 'La tienda ___ cerrada a esta hora.', o: ['es', 'fue', 'son', 'está'], a: 3, why: 'いまの様子（閉まっている）→ estar ＋ 過去分詞。' },
      { s: 'estar', q: '___ に入るものを選びなさい。', es: 'Las ventanas ___ abiertas porque hace calor.', o: ['son', 'fueron', 'están', 'estás'], a: 2, why: '開いている様子 → estar。主語が複数なので están。' },
      { s: 'estar', q: '正しい文を選びなさい。', o: ['La cena está preparada.', 'La cena es preparada.', 'La cena están preparada.', 'La cena está preparado.'], a: 0, why: 'できあがった様子は estar ＋ 過去分詞。過去分詞は la cena に合わせて preparada。' },
      { s: 'estar', q: 'まちがっている文を選びなさい。', o: ['Mi madre está cansada.', 'Los platos están lavados.', 'El café está servido.', 'La puerta está cerrado.'], a: 3, why: 'la puerta は女性 → cerrada。estar ＋ 過去分詞も性数を合わせる。' },
      { s: 'estar', q: '次の文の意味として正しいものを選びなさい。', es: 'La mesa está puesta.', o: ['テーブルは用意される予定だ。', 'テーブルは用意ができている。', 'テーブルはだれかに壊された。', 'テーブルは用意されなかった。'], a: 1, why: 'estar ＋ 過去分詞は「〜してある」という、いまの様子。' },
      { s: 'estar', q: '___ に入るものを選びなさい。', es: 'La puerta ___ cerrada por el portero ayer a las diez.', o: ['fue', 'está', 'estar', 'son'], a: 0, why: 'ayer の出来事で por がある → ser の受身（fue）。' },
      { s: 'estar', q: '___ に入るものを選びなさい。', es: 'Los niños están ___ en el sofá.', o: ['sentado', 'sentadas', 'sentados', 'sentando'], a: 2, why: '過去分詞は主語（los niños＝男性・複数）に合わせる。' },
      { s: 'estar', q: '___ に入るものを選びなさい。', es: 'Mi coche está ___ desde ayer.', o: ['rota', 'roto', 'rompido', 'rotos'], a: 1, why: 'el coche は男性・単数。romper → roto（不規則）。' },

      { s: 'pasiva', q: '___ に入るものを選びなさい。', es: 'Se ___ pisos en el centro.', o: ['vende', 'vendo', 'vendemos', 'venden'], a: 3, why: '受身の se では動詞を物（pisos＝複数）に合わせる。' },
      { s: 'pasiva', q: '___ に入るものを選びなさい。', es: 'Se ___ una casa cerca de la estación.', o: ['alquilan', 'alquilas', 'alquila', 'alquilo'], a: 2, why: 'una casa は単数 → alquila。' },
      { s: 'pasiva', q: '正しい文を選びなさい。', o: ['Se venden flores en el mercado.', 'Se vende flores en el mercado.', 'Se venden flor en el mercado.', 'Se vendes flores en el mercado.'], a: 0, why: 'flores は複数 → venden。' },
      { s: 'pasiva', q: 'まちがっている文を選びなさい。', o: ['Se vende una bicicleta.', 'Se hablan varios idiomas aquí.', 'Se abre las tiendas a las diez.', 'Se compran billetes aquí.'], a: 2, why: 'las tiendas は複数 → se abren。動詞を物に合わせる。' },
      { s: 'pasiva', q: '次の文の意味として正しいものを選びなさい。', es: 'Se alquilan habitaciones.', o: ['私は部屋を借りたい。', '部屋が貸し出されている（貸し部屋あり）。', '部屋が壊れた。', '部屋は広い。'], a: 1, why: '受身の se ＝ 「〜される」。貸す人は書かない。' },
      { s: 'pasiva', q: '文中の se と同じ使い方の se をふくむ文を選びなさい。', es: 'Se venden manzanas en esta tienda.', o: ['Ana se lava las manos.', 'Se me olvidó el libro.', 'Se dice que va a llover.', 'Se alquila un piso.'], a: 3, why: '元の文は受身の se（動詞が物 manzanas に合う）。Se alquila un piso も物が主語の受身。' },
      { s: 'pasiva', q: '___ に入るものを選びなさい。', es: 'En este restaurante se ___ platos típicos.', o: ['sirve', 'sirvo', 'sirven', 'servimos'], a: 2, why: 'platos は複数 → sirven。' },

      { s: 'imp', q: '___ に入るものを選びなさい。', es: 'Aquí se ___ muy bien.', o: ['vive', 'viven', 'vivo', 'vivimos'], a: 0, why: '主語がない無人称の se → 動詞はいつも単数。' },
      { s: 'imp', q: '___ に入るものを選びなさい。', es: 'Se busca ___ los niños.', o: ['de', 'por', 'en', 'a'], a: 3, why: '人が目的語のときは a が付く。動詞は単数のまま。' },
      { s: 'imp', q: '___ に入るものを選びなさい。', es: 'Se ___ que mañana hace sol.', o: ['dicen', 'dice', 'digo', 'dicho'], a: 1, why: 'Se dice que… ＝ 「〜と言われている」。動詞は単数。' },
      { s: 'imp', q: '正しい文を選びなさい。', o: ['Se busca a los alumnos.', 'Se buscan a los alumnos.', 'Se busca los alumnos.', 'Se buscas a los alumnos.'], a: 0, why: 'a ＋ 人が目的語 → 無人称。動詞は単数、a は必要。' },
      { s: 'imp', q: '次の文の意味として正しいものを選びなさい。', es: 'Dicen que el tren llega tarde.', o: ['電車が遅れたと私は言った。', '電車は遅れないと言われている。', '電車は遅れて着くと言われている。', '電車は遅れて出発した。'], a: 2, why: '主語のない3人称複数 ＝ 世間の人が言っている。' },
      { s: 'imp', q: '文中の se と同じ使い方の se をふくむ文を選びなさい。', es: 'En este barrio se vive muy bien.', o: ['Se venden casas baratas.', 'Se dice que hay un examen.', 'Luis se lava las manos.', 'Se me rompió el vaso.'], a: 1, why: '元の文は無人称の se（主語なし・動詞は単数）。Se dice que… も同じ。' },
      { s: 'imp', q: 'まちがっている文を選びなさい。', o: ['Se come bien en España.', 'Se dice que es muy caro.', 'Se busca a una médica.', 'Se viven bien aquí.'], a: 3, why: '無人称の se の動詞はいつも単数 → Se vive bien aquí。' },
      { s: 'imp', q: '___ に入るものを選びなさい。', es: 'En la tele ___ que mañana llueve.', o: ['digo', 'decimos', 'dicen', 'dices'], a: 2, why: '「〜だそうだ」は3人称複数の Dicen que…。' },

      { s: 'refl', q: '___ に入るものを選びなさい。', es: 'Ana ___ levanta a las siete.', o: ['se', 'me', 'te', 'nos'], a: 0, why: '主語 Ana（3人称）→ 再帰代名詞は se。' },
      { s: 'refl', q: '___ に入るものを選びなさい。', es: 'Yo ___ lavo las manos antes de comer.', o: ['se', 'te', 'le', 'me'], a: 3, why: '主語 yo → me。' },
      { s: 'refl', q: '「おたがいに」の意味になるように、___ に入るものを選びなさい。', es: 'Ana y Luis ___ quieren mucho.', o: ['me', 'se', 'lo', 'te'], a: 1, why: '主語が複数の人 ＋ se ＝ 相互の se「おたがいに」。' },
      { s: 'refl', q: '正しい文を選びなさい。', o: ['Nosotros nos vemos los lunes.', 'Nosotros se vemos los lunes.', 'Nosotros me vemos los lunes.', 'Nosotros nos ven los lunes.'], a: 0, why: '主語 nosotros ＝ nos ＋ vemos。' },
      { s: 'refl', q: 'まちがっている文を選びなさい。', o: ['Me acuesto a las once.', 'Los niños se visten solos.', 'Ana se levantas pronto.', 'Nos escribimos cartas.'], a: 2, why: '主語 Ana なので動詞は levanta。se levantas は人称が合わない。' },
      { s: 'refl', q: '次の文の意味として正しいものを選びなさい。', es: 'Ana y Luis se miran.', o: ['アナとルイスはおたがいを見ている。', 'アナとルイスは彼を見ている。', 'アナとルイスは見られた。', 'アナとルイスは鏡を見ない。'], a: 0, why: '主語が複数で se ＝ 相互「おたがいに」。' },
      { s: 'refl', q: '文中の se と同じ使い方の se をふくむ文を選びなさい。', es: 'Ana se peina antes de salir.', o: ['Se venden coches.', 'Se dice que es famoso.', 'Se me cayó la taza.', 'Mi hermano se ducha por la mañana.'], a: 3, why: '元の文は再帰の se（自分の髪）。Mi hermano se ducha も自分にする。' },
      { s: 'refl', q: '___ に入るものを選びなさい。', es: 'Tú ___ acuestas muy tarde.', o: ['se', 'te', 'me', 'nos'], a: 1, why: '主語 tú ＋ acuestas → te。' },

      { s: 'acc', q: '___ に入るものを選びなさい。', es: 'El vaso ___ rompió.', o: ['se', 'me', 'lo', 'le'], a: 0, why: 'コップがひとりでに割れた「勝手に」の se。' },
      { s: 'acc', q: '___ に入るものを選びなさい。', es: 'Se me ___ las gafas.', o: ['cayó', 'caí', 'cayeron', 'caímos'], a: 2, why: '動詞は物（las gafas＝複数）に合わせる。' },
      { s: 'acc', q: '___ に入るものを選びなさい。', es: 'Se me ___ el paraguas en el tren.', o: ['olvidaron', 'olvidó', 'olvidé', 'olvidaste'], a: 1, why: 'el paraguas は単数 → olvidó。me は困った人。' },
      { s: 'acc', q: '正しい文を選びなさい。', o: ['Se me rompieron el plato.', 'Se me rompí el plato.', 'Me se rompió el plato.', 'Se me rompió el plato.'], a: 3, why: 'se me ＋ 動詞。動詞は物（el plato＝単数）に合わせる。語順は se が先。' },
      { s: 'acc', q: 'まちがっている文を選びなさい。', o: ['La puerta se abrió sola.', 'Se nos acabó el pan.', 'Se me perdieron la llave.', 'Mi padre se fue temprano.'], a: 2, why: 'la llave は単数 → Se me perdió la llave。' },
      { s: 'acc', q: '次の文の意味として正しいものを選びなさい。', es: 'Se me olvidó la llave.', o: ['私は鍵を（うっかり）忘れてしまった。', '私は鍵を人にあげた。', '私は鍵を買った。', '私は鍵を探している。'], a: 0, why: 'se me ＋ olvidó ＝ うっかり忘れた。' },
      { s: 'acc', q: '文中の se と同じ使い方の se をふくむ文を選びなさい。', es: 'Se me cayó el vaso.', o: ['Ana se lava las manos.', 'Se venden pisos.', 'Se dice que llueve.', 'La luz se apagó de repente.'], a: 3, why: '元の文は「勝手に」の se（se me）。La luz se apagó も勝手にそうなった。' },
      { s: 'acc', q: '___ に入るものを選びなさい。', es: 'Los niños ___ comieron todo el pan.', o: ['les', 'se', 'los', 'lo'], a: 1, why: 'comerse ＝ ぺろりと食べる（強めの se）。主語に合わせて se。' },
      { s: 'acc', q: '___ に入るものを選びなさい。', es: 'Mi hermano ___ fue a las ocho.', o: ['se', 'me', 'lo', 'te'], a: 0, why: 'irse（行ってしまう）の強めの se。主語が3人称 → se。' },

      { s: 'mix', q: '___ に入るものを選びなさい。', es: 'A Pedro ___ lo di ayer.', o: ['le', 'les', 'se', 'te'], a: 2, why: 'le ＋ lo は言えず、se lo になる。' },
      { s: 'mix', q: '___ に入るものを選びなさい。', es: 'Compré las flores y ___ las di a Rosa.', o: ['le', 'se', 'les', 'lo'], a: 1, why: 'le ＋ las → se las。' },
      { s: 'mix', q: '正しい文を選びなさい。', o: ['Le lo di a mi madre.', 'Lo se di a mi madre.', 'Les lo di a mi madre.', 'Se lo di a mi madre.'], a: 3, why: 'le ＋ lo は se lo。順番は se が先。' },
      { s: 'mix', q: '文中の se と同じ使い方の se をふくむ文を選びなさい。', es: 'Se lo envié a mi tío.', o: ['Ana se lava la cara.', 'Se venden casas.', 'Se la dieron a Carmen.', 'Se dice que es caro.'], a: 2, why: '元の文の se は le が変わったもの（lo の前）。Se la dieron も se ＋ la。' },
      { s: 'mix', q: '次の文の意味として正しいものを選びなさい。', es: 'Se lo compré a mi madre.', o: ['私はそれを母に買ってあげた。', '母がそれを私に買った。', '私はそれを自分で買った。', '母は自分でそれを買った。'], a: 0, why: 'se lo ＝ le lo。a mi madre が「母に」にあたる。' },
      { s: 'mix', q: '___ に入るものを選びなさい。', es: 'Mis amigos ___ lo regalaron a Ana.', o: ['le', 'les', 'nos', 'se'], a: 3, why: '「アナに」のあとに lo が続くので se lo。' },
      { s: 'mix', q: 'まちがっている文を選びなさい。', o: ['Se las di a los niños.', 'Les los envié a ellos.', 'Se lo dije a mi jefe.', 'Se los compré a Pedro.'], a: 1, why: 'les ＋ los は se los になる。' },
      { s: 'mix', q: '___ に入るものを選びなさい。', es: 'Se dice que Ana ___ lo dio a su hermano.', o: ['le', 'les', 'te', 'se'], a: 3, why: 'le ＋ lo → se lo。Se dice que… の se とは別物。' }
    ]
  };
})();
