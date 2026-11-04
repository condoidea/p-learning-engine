/* =========================================================
 * デスクの即答ドリルの問題
 *
 *  QF.drill.items：{ c, es, ja, k, why }      … やった人（QF.masks のキー）を選ぶ
 *                  { c, es, ja, o:[…], a, why } … ___ に入る語を選ぶ（西検の空所と同じ形）
 *    c＝その形を習う事件（クリアした事件の問題だけ出る）。why＝まちがえたときに出す「見分けの手順のどこで分かるか」
 *  QF.drill.maskCase：仮面ごとに、習う事件（選択肢に出してよくなる事件）
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
  QF.drill = {
    maskCase: { por: 'c1', alguien: 'c1', estado: 'c2', gente: 'c4', mismo: 'c5', mutuo: 'c5', nadie: 'c6', le: 'c7' },
    items: [
      /* ---- c1 ser ＋ 過去分詞 ＋ por ---- */
      { c: 'c1', es: 'El cuadro fue robado por un ladrón.', ja: '絵は、どろぼうに盗まれた。', k: 'por', why: 'ser ＋ 過去分詞 ＋ **por**。やった人は por のあと。' },
      { c: 'c1', es: 'La carta fue escrita ayer.', ja: '手紙はきのう書かれた。', k: 'alguien', why: 'ser ＋ 過去分詞で受身。**por がない**から、やった人は書いていない。' },
      { c: 'c1', es: 'La ventana fue rota por el niño.', ja: '窓は子どもに割られた。', k: 'por', why: 'fue rota ＝ ser ＋ 過去分詞。**por el niño** がやった人。' },
      { c: 'c1', es: 'Las casas fueron vendidas el año pasado.', ja: '家々は去年売られた。', k: 'alguien', why: 'fueron vendidas ＝ 受身。**por 〜 がない**から、だれかは書いていない。' },
      { c: 'c1', es: 'El pan fue comprado por mi madre.', ja: 'パンは母が買った。', k: 'por', why: 'fue comprado の後ろの **por mi madre** がやった人。' },
      { c: 'c1', es: 'Los billetes fueron comprados en la estación.', ja: '切符は駅で買われた。', k: 'alguien', why: '受身だが、**por がない**。買った人は書いていない。' },
      { c: 'c1', es: 'La cena fue preparada por el cocinero.', ja: '夕食は料理人が作った。', k: 'por', why: 'ser ＋ 過去分詞のあとに **por el cocinero**。' },
      { c: 'c1', es: 'Las puertas fueron ___ por el guardia.', ja: 'ドアは警備員に開けられた。', o: ['abiertas', 'abiertos', 'abierto'], a: 0, why: '過去分詞は主語（las puertas＝女性・複数）に合わせる。abrir → abierto は形が変わる。' },
      { c: 'c1', es: 'Esta casa fue ___ por mi abuelo.', ja: 'この家は祖父が建てた。', o: ['construido', 'construida', 'construidas'], a: 1, why: '主語 esta casa は女性・単数 → **construida**。過去分詞は主語に合わせる。' },
      { c: 'c1', es: 'El libro fue ___ por un autor famoso.', ja: 'その本は有名な作家が書いた。', o: ['escrito', 'escribido', 'escrita'], a: 0, why: 'escribir の過去分詞は不規則で **escrito**。el libro は男性・単数。' },
      { c: 'c1', es: 'Los cuadros fueron ___ por una pintora.', ja: '絵は女性画家が描いた。', o: ['pintado', 'pintadas', 'pintados'], a: 2, why: 'los cuadros ＝ 男性・複数 → **pintados**。por のあとの人の性は関係ない。' },
      { c: 'c1', es: 'La película fue ___ por mucha gente.', ja: 'その映画は多くの人に見られた。', o: ['visto', 'vista', 'vido'], a: 1, why: 'ver の過去分詞は不規則で **visto**。la película は女性 → vista。' },
      { c: 'c1', es: 'El vaso fue ___ por el camarero.', ja: 'コップはウェイターに割られた。', o: ['roto', 'rompido', 'rota'], a: 0, why: 'romper の過去分詞は不規則で **roto**。el vaso は男性・単数。' },
      { c: 'c1', es: 'Los pasteles fueron ___ por mi tía.', ja: 'ケーキはおばが作った。', o: ['hecho', 'hacidos', 'hechos'], a: 2, why: 'hacer の過去分詞は **hecho**。los pasteles は男性・複数 → hechos。' },

      /* ---- c2 estar ＋ 過去分詞 ---- */
      { c: 'c2', es: 'La puerta está cerrada.', ja: 'ドアは閉まっている。', k: 'estado', why: '**estar** ＋ 過去分詞は、いまの様子。だれが閉めたかは問わない。' },
      { c: 'c2', es: 'La tienda está abierta todo el día.', ja: '店は一日じゅう開いている。', k: 'estado', why: '**está abierta** ＝ いまの様子。だれが開けたかは関係ない。' },
      { c: 'c2', es: 'La puerta fue cerrada por el portero.', ja: 'ドアは管理人が閉めた。', k: 'por', why: '**fue** ＋ 過去分詞 ＋ **por**。出来事で、やった人は por のあと。' },
      { c: 'c2', es: 'Las ventanas están rotas.', ja: '窓が割れている。', k: 'estado', why: 'estar ＋ 過去分詞。**割れている状態**だけで、やった人は問わない。' },
      { c: 'c2', es: 'La cena fue preparada anoche.', ja: '夕食はゆうべ作られた。', k: 'alguien', why: '**fue** ＋ 過去分詞（出来事）で、**por がない** → だれか。' },
      { c: 'c2', es: 'La mesa está puesta para cuatro personas.', ja: 'テーブルは4人分用意されている。', k: 'estado', why: '**está puesta** ＝ 用意ができているという様子。' },
      { c: 'c2', es: 'El restaurante fue abierto en 1990.', ja: 'そのレストランは1990年に開かれた。', k: 'alguien', why: '**fue** abierto ＝ 出来事の受身。por がないから、だれかは書いていない。' },
      { c: 'c2', es: 'Ahora la tienda ___ cerrada.', ja: 'いま、店は閉まっている。', o: ['está', 'es', 'fue'], a: 0, why: '**ahora**（いま）の様子 → estar。ser は出来事（fue ＋ por）に使う。' },
      { c: 'c2', es: 'La ventana ___ rota por un balón ayer.', ja: '窓はきのうボールで割られた。', o: ['está', 'es', 'fue'], a: 2, why: '**ayer** ＋ **por** ＝ 出来事の受身 → ser（fue）。' },
      { c: 'c2', es: 'El cuadro ___ colgado en la pared.', ja: '絵は壁にかかっている。', o: ['es', 'está', 'fue'], a: 1, why: 'かかっている**様子**だから estar。' },
      { c: 'c2', es: 'Mi coche ___ roto desde ayer.', ja: '私の車はきのうから壊れている。', o: ['está', 'es', 'fue'], a: 0, why: '**desde ayer**（きのうからずっと）の状態 → estar。' },
      { c: 'c2', es: 'Los niños ___ sentados en el sofá.', ja: '子どもたちはソファーにすわっている。', o: ['son', 'fueron', 'están'], a: 2, why: 'すわっている**様子** → estar。sentados は主語に合わせて男性・複数。' },
      { c: 'c2', es: 'La cena ya ___ preparada.', ja: '夕食はもうできている。', o: ['es', 'está', 'fue'], a: 1, why: '**ya**（もう）できあがった状態 → estar ＋ 過去分詞。' },
      { c: 'c2', es: 'Las luces ___ apagadas por la noche.', ja: '夜は明かりが消されている。', o: ['están', 'estás', 'estamos'], a: 0, why: '主語 las luces（3人称複数）→ **están**。apagadas は女性・複数。' },

      /* ---- c3 受身の se ---- */
      { c: 'c3', es: 'Se vende una casa en este barrio.', ja: 'この街に家が売られている。', k: 'alguien', why: '**se ＋ 動詞**の主語は物（una casa）。受身の se で、売る人は書かない。' },
      { c: 'c3', es: 'Se venden pisos baratos aquí.', ja: 'ここで安いマンションが売られている。', k: 'alguien', why: '動詞 venden が物（pisos）に合っている → 受身の se。やった人は書かない。' },
      { c: 'c3', es: 'Se alquilan habitaciones para estudiantes.', ja: '学生向けの部屋が貸し出されている。', k: 'alguien', why: 'alquilan ＝ habitaciones に合わせた複数 → 受身の se。' },
      { c: 'c3', es: 'Se hablan varios idiomas en esta ciudad.', ja: 'この都市では何か国語も話されている。', k: 'alguien', why: '動詞が idiomas（物・複数）に合っている → 受身の se。' },
      { c: 'c3', es: 'Se abren las puertas a las nueve.', ja: '9時にドアが開けられる。', k: 'alguien', why: 'abren が las puertas に合っている → 受身の se。開ける人は書かない。' },
      { c: 'c3', es: 'Se compran billetes en la estación.', ja: '切符は駅で買われる。', k: 'alguien', why: 'compran ＝ billetes に合わせた複数。受身の se。' },
      { c: 'c3', es: 'Se ___ coches usados.', ja: '中古車が売られている。', o: ['vende', 'venden', 'vendo'], a: 1, why: '動詞は se のあとの**物**（coches＝複数）に合わせる。' },
      { c: 'c3', es: 'Se ___ una habitación en el centro.', ja: '街の中心に部屋が貸し出されている。', o: ['alquila', 'alquilan', 'alquilo'], a: 0, why: 'una habitación は単数 → **alquila**。' },
      { c: 'c3', es: 'En este bar se ___ cafés muy buenos.', ja: 'このバルでは、とてもおいしいコーヒーが出される。', o: ['sirve', 'sirvo', 'sirven'], a: 2, why: 'cafés は複数 → **sirven**。' },
      { c: 'c3', es: '¿Dónde se ___ los billetes?', ja: '切符はどこで買われますか。', o: ['compra', 'compran', 'compras'], a: 1, why: 'los billetes は複数 → **compran**。' },
      { c: 'c3', es: 'Aquí se ___ varios idiomas.', ja: 'ここでは何か国語も話されている。', o: ['hablan', 'habla', 'hablas'], a: 0, why: 'varios idiomas（複数）に動詞を合わせる → **hablan**。' },
      { c: 'c3', es: 'Se ___ la tienda a las diez.', ja: '店は10時に開けられる。', o: ['abren', 'abres', 'abre'], a: 2, why: 'la tienda は単数 → **abre**。' },
      { c: 'c3', es: 'En esta zona se ___ muchas casas nuevas.', ja: 'この地区では新しい家がたくさん建てられている。', o: ['construye', 'construyen', 'construyo'], a: 1, why: 'muchas casas は複数 → **construyen**。' },
      { c: 'c3', es: 'Se ___ las entradas en la taquilla.', ja: 'チケットは窓口で売られている。', o: ['vende', 'vendes', 'venden'], a: 2, why: 'las entradas は複数 → **venden**。' },

      /* ---- c4 無人称の se・3人称複数 ---- */
      { c: 'c4', es: 'Se dice que mañana lloverá.', ja: 'あすは雨が降ると言われている。', k: 'gente', why: '**se ＋ 動詞（単数）** で主語がない → 無人称の se。人はだれでも。' },
      { c: 'c4', es: 'Aquí se vive muy bien.', ja: 'ここは暮らしやすい。', k: 'gente', why: '**vive** はいつも単数で、主語がない → 無人称。一般の人。' },
      { c: 'c4', es: 'Dicen que el museo abre pronto.', ja: '博物館はもうすぐ開くそうだ。', k: 'gente', why: '主語のない **3人称複数** ＝ 世間の人たちが言っている。' },
      { c: 'c4', es: 'En España se come tarde.', ja: 'スペインでは遅くに食事をする。', k: 'gente', why: 'se come ＝ 目的語もない無人称の se。人はだれでも。' },
      { c: 'c4', es: 'Se busca a los niños en el parque.', ja: '公園で子どもたちが捜されている。', k: 'gente', why: '**a ＋ 人** が目的語 → 無人称の se。動詞は単数のまま。' },
      { c: 'c4', es: 'Se trabaja mucho en esta oficina.', ja: 'この事務所はよく働く。', k: 'gente', why: '動詞 trabaja は目的語なしの単数 → 無人称の se。' },
      { c: 'c4', es: 'Dicen que hay mucha gente en la plaza.', ja: '広場にはたくさん人がいるそうだ。', k: 'gente', why: '3人称複数の **Dicen que…** ＝ 世間の人が言っている。' },
      { c: 'c4', es: 'Se ___ a los niños en el parque.', ja: '公園で子どもたちが捜されている。', o: ['buscan', 'busca', 'busco'], a: 1, why: '**a los niños**（a ＋ 人）なので、動詞は単数のまま **busca**。' },
      { c: 'c4', es: 'Aquí se ___ muy bien.', ja: 'ここでは食事がおいしい。', o: ['come', 'comen', 'como'], a: 0, why: '主語がない無人称の se → 動詞は**いつも単数**。' },
      { c: 'c4', es: 'Se ___ que el tren llega tarde.', ja: '電車は遅れて着くと言われている。', o: ['dicen', 'dices', 'dice'], a: 2, why: 'Se dice que… の dice は単数。que 以下は主語ではない。' },
      { c: 'c4', es: 'Se ___ a los clientes con una sonrisa.', ja: 'お客さんは笑顔で迎えられる。', o: ['reciben', 'recibe', 'recibo'], a: 1, why: 'a los clientes は **a ＋ 人** → 動詞は単数 recibe。' },
      { c: 'c4', es: 'Se ___ bien en este pueblo.', ja: 'この町は暮らしやすい。', o: ['vive', 'viven', 'vivo'], a: 0, why: '主語がない無人称の se。動詞は単数 **vive**。' },
      { c: 'c4', es: '¿Cómo se ___ a la estación?', ja: '駅へはどう行きますか。', o: ['llegan', 'llego', 'llega'], a: 2, why: '「人は〜する」の無人称。動詞は単数 **llega**。' },
      { c: 'c4', es: 'Se ___ a las alumnas en la puerta.', ja: '生徒たちは門で待たれている。', o: ['espera', 'esperan', 'espero'], a: 0, why: '**a las alumnas**（a ＋ 人）→ 単数のまま **espera**。' },

      /* ---- c5 再帰・相互の se ---- */
      { c: 'c5', es: 'Ana se lava las manos.', ja: 'アナは手を洗う。', k: 'mismo', why: '主語（Ana）が**自分の手**を洗う → 再帰の se。' },
      { c: 'c5', es: 'Me levanto a las siete.', ja: '私は7時に起きる。', k: 'mismo', why: '主語 yo が**自分を**起こす → 再帰（me）。' },
      { c: 'c5', es: 'Ana y Luis se quieren mucho.', ja: 'アナとルイスは愛し合っている。', k: 'mutuo', why: '主語が複数で「**おたがいに**」の意味 → 相互の se。' },
      { c: 'c5', es: 'Los vecinos se saludan cada mañana.', ja: '隣人たちは毎朝あいさつし合う。', k: 'mutuo', why: '複数の人が**たがいに**挨拶する → 相互。' },
      { c: 'c5', es: 'El niño se viste solo.', ja: 'その子は一人で服を着る。', k: 'mismo', why: '主語の子が**自分に**服を着せる → 再帰。' },
      { c: 'c5', es: 'Pedro y yo nos vemos los domingos.', ja: 'ペドロと私は日曜日に会う。', k: 'mutuo', why: '「**おたがいに**会う」。nos ＝ 相互。' },
      { c: 'c5', es: 'Mi hermana se peina antes de salir.', ja: '姉は出かける前に髪をとかす。', k: 'mismo', why: '主語が自分の髪をとかす → 再帰。' },
      { c: 'c5', es: 'Ana ___ levanta a las siete.', ja: 'アナは7時に起きる。', o: ['me', 'te', 'se'], a: 2, why: '主語 Ana（3人称）→ 再帰代名詞も **se**。' },
      { c: 'c5', es: 'Yo ___ ducho por la mañana.', ja: '私は朝シャワーを浴びる。', o: ['se', 'me', 'te'], a: 1, why: '主語 yo → **me**。主語と再帰代名詞は同じ人。' },
      { c: 'c5', es: '¿A qué hora ___ acuestas?', ja: '君は何時に寝る？', o: ['te', 'se', 'me'], a: 0, why: '動詞 acuestas（tú）→ **te**。' },
      { c: 'c5', es: 'Nosotros ___ lavamos las manos.', ja: '私たちは手を洗う。', o: ['se', 'me', 'nos'], a: 2, why: '主語 nosotros → **nos**。' },
      { c: 'c5', es: 'Pedro y yo ___ vemos mucho.', ja: 'ペドロと私はよく会う。', o: ['se', 'nos', 'me'], a: 1, why: '動詞 vemos（nosotros）→ **nos**。おたがいに会う。' },
      { c: 'c5', es: 'Mis hijos ___ visten solos.', ja: '子どもたちは自分で服を着る。', o: ['se', 'me', 'nos'], a: 0, why: '主語 mis hijos（3人称複数）→ **se**。' },
      { c: 'c5', es: 'Tú ___ levantas muy temprano.', ja: '君はとても早く起きる。', o: ['se', 'te', 'me'], a: 1, why: '主語 tú → **te**。' },

      /* ---- c6 「勝手に」の se・se me ---- */
      { c: 'c6', es: 'El vaso se rompió.', ja: 'コップが割れた。', k: 'nadie', why: '主語 el vaso が**ひとりでに**割れた。やった人を問わない「勝手に」の se。' },
      { c: 'c6', es: 'Se me rompieron las gafas.', ja: '私は眼鏡を壊してしまった。', k: 'nadie', why: '**se me** ＝ うっかり。わざとやった人はいない。' },
      { c: 'c6', es: 'Se me olvidó el paraguas.', ja: '傘を忘れてしまった。', k: 'nadie', why: '**se me** ＋ 動詞。うっかり忘れた。' },
      { c: 'c6', es: 'La puerta se abrió sola.', ja: 'ドアがひとりでに開いた。', k: 'nadie', why: '**sola**（ひとりでに）と言っている。勝手にそうなった。' },
      { c: 'c6', es: 'Se nos acabó el pan.', ja: 'パンがなくなってしまった。', k: 'nadie', why: '**se nos** ＝ 私たちが困った。パンが勝手になくなった。' },
      { c: 'c6', es: 'Se me cayó el plato.', ja: '私は皿を落としてしまった。', k: 'nadie', why: '**se me** ＋ cayó。うっかり落とした。' },
      { c: 'c6', es: 'La luz se apagó de repente.', ja: '明かりが急に消えた。', k: 'nadie', why: '主語 la luz が勝手に消えた。' },
      { c: 'c6', es: 'Se ___ rompió el vaso.', ja: '私はコップを割ってしまった。', o: ['me', 'lo', 'mi'], a: 0, why: '「私は困った」→ **se me**。' },
      { c: 'c6', es: 'Se me ___ las gafas.', ja: '眼鏡を落としてしまった。', o: ['cayó', 'caí', 'cayeron'], a: 2, why: '動詞は**物**（las gafas＝複数）に合わせる → cayeron。' },
      { c: 'c6', es: 'Se me ___ el libro en casa.', ja: '本を家に忘れてしまった。', o: ['olvidaron', 'olvidó', 'olvidé'], a: 1, why: 'el libro は単数 → **olvidó**。' },
      { c: 'c6', es: 'El vaso ___ rompió.', ja: 'コップが割れた。', o: ['se', 'me', 'lo'], a: 0, why: 'ひとりでに割れた → **se**。' },
      { c: 'c6', es: 'Ana ___ durmió en el tren.', ja: 'アナは電車で眠り込んだ。', o: ['le', 'lo', 'se'], a: 2, why: 'dormirse（眠り込む）の強めの se。主語 Ana → **se**。' },
      { c: 'c6', es: 'Los niños ___ comieron todo el pastel.', ja: '子どもたちはケーキをぜんぶ食べてしまった。', o: ['les', 'se', 'los'], a: 1, why: 'comerse（ぺろりと食べる）の強めの se。主語に合わせて **se**。' },
      { c: 'c6', es: 'A Luis se le ___ las llaves.', ja: 'ルイスは鍵を落としてしまった。', o: ['cayó', 'cayeras', 'cayeron'], a: 2, why: '動詞は物 **las llaves**（複数）に合わせる。le は困った人。' },

      /* ---- c7 le → se・総まとめ ---- */
      { c: 'c7', es: 'Se lo di a Pedro.', ja: 'それをペドロにあげた。', k: 'le', why: 'se の**すぐあとに lo**。le が se に変わっただけ。' },
      { c: 'c7', es: 'Se la compré a mi madre.', ja: 'それを母に買ってあげた。', k: 'le', why: 'se ＋ **la**。le lo の言いかえで、a mi madre ＝ 「彼女に」。' },
      { c: 'c7', es: 'Se los enviamos a los clientes.', ja: 'それをお客さんに送った。', k: 'le', why: 'se ＋ **los**。le（les）が se に変わった。' },
      { c: 'c7', es: 'Ana se lo dijo a su hermano.', ja: 'アナはそれを弟に言った。', k: 'le', why: 'se のすぐあとに **lo**。アナがふつうに言った。' },
      { c: 'c7', es: 'Se las dieron a los niños.', ja: 'それを子どもたちにあげた。', k: 'le', why: 'se ＋ **las**。le が se に変わっただけ。' },
      { c: 'c7', es: 'La casa fue vendida por mi tío.', ja: '家はおじが売った。', k: 'por', why: 'ser ＋ 過去分詞 ＋ **por**。まとめの確認。' },
      { c: 'c7', es: 'Aquí se vive muy tranquilo.', ja: 'ここは静かに暮らせる。', k: 'gente', why: 'se ＋ 単数の動詞で主語なし → 無人称。lo・la は付いていない。' },
      { c: 'c7', es: 'A Pedro ___ lo di ayer.', ja: 'それをペドロにきのうあげた。', o: ['le', 'se', 'les'], a: 1, why: '**le lo** は言えない。le ＋ lo → **se lo**。' },
      { c: 'c7', es: 'Se ___ compré a mi madre.', ja: 'それ（la camisa）を母に買った。', o: ['la', 'lo', 'le'], a: 0, why: 'se のあとは物。la camisa（女性）→ **la**。' },
      { c: 'c7', es: 'Mis amigos ___ lo dijeron a Ana.', ja: '友だちはそれをアナに言った。', o: ['le', 'les', 'se'], a: 2, why: 'le ＋ lo → **se lo**。' },
      { c: 'c7', es: 'Compré flores y ___ las di a Rosa.', ja: '花を買って、ロサにあげた。', o: ['le', 'se', 'les'], a: 1, why: '**le las** は言えない → se las。' },
      { c: 'c7', es: '¿El dinero? ___ lo dio a su hijo.', ja: 'お金？ 息子にあげたよ。', o: ['Se', 'Le', 'Les'], a: 0, why: '「彼に・それを」→ le ＋ lo が **Se lo**。' },
      { c: 'c7', es: 'Se ___ envié a los clientes.', ja: '（las cartas を）お客さんに送った。', o: ['los', 'las', 'les'], a: 1, why: 'se のあとの物は la・las など。las cartas（女性・複数）→ **las**。' },
      { c: 'c7', es: '¿Las llaves? ___ las devolví a Ana.', ja: '鍵？ アナに返したよ。', o: ['Se', 'Le', 'Te'], a: 0, why: 'le ＋ las → **Se las**。' }
    ]
  };
})();
