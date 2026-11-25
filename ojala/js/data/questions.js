/* =========================================================
 * ¡OJALÁ! — 問題バンク
 *
 *  レッスン（lessons.js）の drill や、ボス戦、読み返し、ラッシュ、西検チャレンジで出す問題。
 *  各問は、そのレッスンまでに習った形・使い分けだけで作ってある。
 *
 *  共通の項目
 *    id   'l1-01' のように（レッスン番号-通し番号）
 *    L    レッスン番号（数値）
 *    k    問題の種類（下）
 *    why  解説。日本語で短く。スペイン語は `…` でかこむ
 *
 *  文中の印：{…} 動詞の形（金色）
 *
 *  kind（k）
 *    pick   空所に入る形を選ぶ（試験の問1の形。3〜4択） { s（___ を1つ）, o, a（正解の番号）, ja }
 *    form   原形から接続法の形を作る                 { v（原形）, p（'yo' 'tú' 'él' 'nosotros' 'vosotros' 'ellos'）, o（3つ）, a }
 *    mood   どちらの封蝋か（青＝いつもの形／赤＝接続法） { s（___ を1つ）, v（入る動詞の原形）, full（入れた文）, a（0 青／1 赤）, ja }
 *    ng     入らないものを選ぶ（試験の問3の形）       { s（___ を1つ）, o（3つ）, a（入らない1つ）, fit（入る1つの番号）, ja }
 *    ja     意味を選ぶ                               { s, o（日本語3つ）, a }
 *    bug    まちがい探し                             { s（印なし）, a（まちがった1語）, ok（直した文）, ja }
 *    build  タイル並べ                               { s（スペース区切りの語がタイル。6語以内・印なし）, d（ダミータイル）, ja }
 *
 *  選択肢のダミーは「よくあるまちがい」（いつもの形〔直説法〕・人ちがい・-ar と -er の母音の取りちがえ・
 *  つづりの書きかえ忘れ・原形・未来や過去未来の形）。いつもの形が正しくなってしまう文は、まちがいにしない。
 *  例文はこのアプリのためのオリジナル。
 * ========================================================= */
window.OQ = window.OQ || {};

OQ.questions = [
  /* ================= L1 願いの que ＋ -ar（o → e） ================= */
  { id: 'l1-01', L: 1, k: 'pick', s: 'Quiero que ___ con Marco.', o: ['hablas', 'hables', 'hablar'], a: 1, ja: 'あなたにマルコと話してほしい。', why: '`quiero que`（願い）のあとは接続法。`hablo` → `hable`、tú の語尾 s で `{hables}`。' },
  { id: 'l1-02', L: 1, k: 'pick', s: 'Espero que Luz ___ bien.', o: ['descansa', 'descanse', 'descanses'], a: 1, ja: 'ルスがよく休めるといいな。', why: '`espero que`（願い）→ 接続法。ルスは él・ella の形 `{descanse}`。`descanses` は tú の形。' },
  { id: 'l1-03', L: 1, k: 'pick', s: 'Sé que tú ___ mucho.', o: ['trabajas', 'trabajes', 'trabaje'], a: 0, ja: '君がたくさん働いているのは知っている。', why: '`sé que`（知っている）のあとは本当のこと → いつもの形 `{trabajas}`。' },
  { id: 'l1-04', L: 1, k: 'form', v: 'hablar', p: 'tú', o: ['hablas', 'hables', 'hable'], a: 1, why: '`hablo` の o → e で `hable`、tú の語尾 s で `{hables}`。`hablas` はいつもの形。' },
  { id: 'l1-05', L: 1, k: 'form', v: 'trabajar', p: 'nosotros', o: ['trabajamos', 'trabajemos', 'trabajen'], a: 1, why: '`trabajo` → `trabaje`、nosotros の語尾 mos で `{trabajemos}`。`trabajamos` はいつもの形。' },
  { id: 'l1-06', L: 1, k: 'form', v: 'escuchar', p: 'ellos', o: ['escuchan', 'escuchen', 'escuche'], a: 1, why: '`escucho` → `escuche`、ellos の語尾 n で `{escuchen}`。' },
  { id: 'l1-07', L: 1, k: 'form', v: 'cantar', p: 'vosotros', o: ['cantáis', 'cantéis', 'cantes'], a: 1, why: '`canto` → `cante`、vosotros の語尾 is で `{cantéis}`（´ は e の上）。`cantáis` はいつもの形。' },
  { id: 'l1-08', L: 1, k: 'form', v: 'llamar', p: 'yo', o: ['llamo', 'llame', 'llama'], a: 1, why: '`llamo` の o → e で `{llame}`。yo と él は同じ形。' },
  { id: 'l1-09', L: 1, k: 'mood', s: 'Quiero que Marco ___ pronto.', v: 'regresar', full: 'Quiero que Marco {regrese} pronto.', a: 1, ja: 'マルコに早く帰ってきてほしい。', why: '`quiero que` は願い → 🔴 赤。`{regrese}`。' },
  { id: 'l1-10', L: 1, k: 'mood', s: 'Sé que Marco ___ en el barco.', v: 'trabajar', full: 'Sé que Marco {trabaja} en el barco.', a: 0, ja: 'マルコが船で働いているのは知っている。', why: '`sé que` のあとは本当のこと → 🔵 青。いつもの形 `{trabaja}`。' },
  { id: 'l1-11', L: 1, k: 'mood', s: 'Espero que me ___ pronto.', v: 'llamar', full: 'Espero que me {llames} pronto.', a: 1, ja: 'すぐに電話してくれるといいな。', why: '`espero que` は願い → 🔴 赤。`{llames}`（tú）。' },
  { id: 'l1-12', L: 1, k: 'ja', s: 'Espero que {descanses} bien.', o: ['よく休めるといいな。', 'よく休んでいるのを知っている。', 'よく休みなさい。'], a: 0, why: '`espero que` ＋ 接続法で「〜だといいな」。' },
  { id: 'l1-13', L: 1, k: 'ja', s: 'Sé que {trabajas} mucho.', o: ['君がたくさん働いているのを知っている。', '君にたくさん働いてほしい。', '君がたくさん働けるといいな。'], a: 0, why: '`sé que` ＋ いつもの形は、知っている本当のこと。' },
  { id: 'l1-14', L: 1, k: 'bug', s: 'Quiero que hablas con Luz.', a: 'hablas', ok: 'Quiero que hables con Luz.', ja: 'ルスと話してほしい。', why: '`quiero que` のあとは接続法。`hablas` → `{hables}`。' },
  { id: 'l1-15', L: 1, k: 'bug', s: 'Sé que Marco regrese el lunes.', a: 'regrese', ok: 'Sé que Marco regresa el lunes.', ja: 'マルコが月曜に帰るのは知っている。', why: '`sé que` のあとは本当のこと → いつもの形 `{regresa}`。' },
  { id: 'l1-16', L: 1, k: 'build', s: 'Quiero que bailes conmigo.', d: ['bailas'], ja: '私と踊ってほしい。' },
  { id: 'l1-17', L: 1, k: 'build', s: 'Espero que regreses pronto.', d: ['regresas'], ja: '早く帰ってくるといいな。' },
  { id: 'l1-18', L: 1, k: 'ng', s: '___ que me llames.', o: ['Quiero', 'Espero', 'Sé'], a: 2, fit: 0, ja: '電話してほしい。／電話してくれるといいな。', why: '`sé que` のあとは本当のこと（いつもの形）。接続法の `llames` とは合わない。' },
  { id: 'l1-19', L: 1, k: 'pick', s: 'Mis padres quieren que yo ___ en el puerto.', o: ['trabajo', 'trabaje', 'trabajar'], a: 1, ja: '両親は、私に港で働いてほしいと思っている。', why: '`quieren que`（願い）→ 接続法。yo の形 `trabajo` の o → e で `{trabaje}`。' },
  { id: 'l1-20', L: 1, k: 'pick', s: 'Espero que ustedes ___ la música.', o: ['escuchan', 'escuchen', 'escuche'], a: 1, ja: 'みなさんが音楽を聞いてくれるといいのですが。', why: '願い → 接続法。ustedes は ellos と同じ形 `{escuchen}`。' },

  /* ================= L2 -er・-ir（o → a）・ojalá・自分のことは原形 ================= */
  { id: 'l2-01', L: 2, k: 'pick', s: 'Quiero que ___ la carta.', o: ['lees', 'leas', 'lea'], a: 1, ja: '（君に）手紙を読んでほしい。', why: '願い → 接続法。`leo` の o → a で `lea`、tú は `{leas}`。' },
  { id: 'l2-02', L: 2, k: 'pick', s: 'Ojalá ___ buen tiempo mañana.', o: ['hace', 'haga', 'hago'], a: 1, ja: '明日、いい天気だといいなあ。', why: '`ojalá` のあとは接続法。`hago` → `{haga}`（天気の hace と同じ él の形）。' },
  { id: 'l2-03', L: 2, k: 'pick', s: 'Espero que mi madre ___ a la ciudad.', o: ['viene', 'venga', 'vengo'], a: 1, ja: '母が町に来てくれるといいな。', why: '願い → 接続法。`vengo` の o → a で `{venga}`。' },
  { id: 'l2-04', L: 2, k: 'pick', s: 'Quiero ___ a mi madre.', o: ['ver', 'vea', 'veo'], a: 0, ja: '（私は）母に会いたい。', why: '自分のことなら que はいらない。原形のまま `Quiero {ver}`。' },
  { id: 'l2-05', L: 2, k: 'form', v: 'comer', p: 'tú', o: ['comes', 'comas', 'coma'], a: 1, why: '`como` の o → a で `coma`、tú は `{comas}`。`comes` はいつもの形。' },
  { id: 'l2-06', L: 2, k: 'form', v: 'vivir', p: 'nosotros', o: ['vivimos', 'vivamos', 'viváis'], a: 1, why: '`vivo` → `viva`、nosotros は `{vivamos}`。`viváis` は vosotros。' },
  { id: 'l2-07', L: 2, k: 'form', v: 'tener', p: 'ellos', o: ['tienen', 'tengan', 'tengáis'], a: 1, why: '`tengo` → `tenga`、ellos は `{tengan}`。' },
  { id: 'l2-08', L: 2, k: 'form', v: 'decir', p: 'tú', o: ['dices', 'digas', 'diga'], a: 1, why: '`digo` → `diga`、tú は `{digas}`。' },
  { id: 'l2-09', L: 2, k: 'form', v: 'hacer', p: 'yo', o: ['hago', 'haga', 'hace'], a: 1, why: '`hago` の o → a で `{haga}`。' },
  { id: 'l2-10', L: 2, k: 'form', v: 'salir', p: 'vosotros', o: ['salís', 'salgáis', 'salgan'], a: 1, why: '`salgo` → `salga`、vosotros は `{salgáis}`。`salís` はいつもの形。' },
  { id: 'l2-11', L: 2, k: 'form', v: 'conocer', p: 'él', o: ['conoce', 'conozca', 'conozco'], a: 1, why: '`conozco` の o → a で `{conozca}`。' },
  { id: 'l2-12', L: 2, k: 'mood', s: 'Ojalá ___ mi carta.', v: 'leer', full: 'Ojalá {lea} mi carta.', a: 1, ja: '（母が）私の手紙を読んでくれるといいなあ。', why: '`ojalá` は願い → 🔴 赤。`{lea}`。' },
  { id: 'l2-13', L: 2, k: 'mood', s: 'Sé que ___ en el campo.', v: 'vivir', full: 'Sé que {vives} en el campo.', a: 0, ja: '君がいなかに住んでいるのは知っている。', why: '`sé que` は本当のこと → 🔵 青。`{vives}`。' },
  { id: 'l2-14', L: 2, k: 'ja', s: 'Ojalá {venga} mi madre.', o: ['母が来てくれるといいなあ。', '母が来る。', '母が来たのを知っている。'], a: 0, why: '`ojalá` ＋ 接続法で「〜だといいなあ」。' },
  { id: 'l2-15', L: 2, k: 'ja', s: 'Quiero que me {escribas}.', o: ['（君に）手紙を書いてほしい。', '（私は）手紙を書きたい。', '君が手紙を書いているのを知っている。'], a: 0, why: '`quiero que` ＋ 接続法は「（人に）〜してほしい」。自分なら `Quiero escribir`。' },
  { id: 'l2-16', L: 2, k: 'bug', s: 'Ojalá vienes pronto.', a: 'vienes', ok: 'Ojalá vengas pronto.', ja: '早く来てくれるといいなあ。', why: '`ojalá` のあとは接続法。`vengo` → `{vengas}`。' },
  { id: 'l2-17', L: 2, k: 'bug', s: 'Espero que mi hermano tiene trabajo.', a: 'tiene', ok: 'Espero que mi hermano tenga trabajo.', ja: '兄に仕事があるといいな。', why: '願い → 接続法。`tengo` → `{tenga}`。' },
  { id: 'l2-18', L: 2, k: 'build', s: 'Ojalá haga sol mañana.', d: ['hace'], ja: '明日、晴れるといいなあ。' },
  { id: 'l2-19', L: 2, k: 'build', s: 'Quiero que comas más.', d: ['comes'], ja: 'もっと食べてほしい。' },
  { id: 'l2-20', L: 2, k: 'ng', s: '___ que me escribas.', o: ['Quiero', 'Sé', 'Espero'], a: 1, fit: 0, ja: '手紙を書いてほしい。／書いてくれるといいな。', why: '`sé que` のあとは本当のこと。接続法の `escribas` とは合わない。' },
  { id: 'l2-21', L: 2, k: 'pick', s: 'Quiero que tú ___ la verdad.', o: ['dices', 'digas', 'diga', 'decir'], a: 1, ja: '君に本当のことを言ってほしい。', why: '願い → 接続法。`digo` → `diga`、tú は `{digas}`。' },
  { id: 'l2-22', L: 2, k: 'pick', s: 'Quiero ___ en Sevilla.', o: ['vivir', 'viva', 'vivo'], a: 0, ja: '（私は）セビリアに住みたい。', why: '自分がしたいことは que なしで原形 `{vivir}`。' },

  /* ================= L3 気持ちの que・例外の6つ・つづりの書きかえ ================= */
  { id: 'l3-01', L: 3, k: 'pick', s: 'Me alegro de que ___ bien.', o: ['estás', 'estés', 'estar'], a: 1, ja: '君が元気でうれしい。', why: '気持ち（`me alegro de que`）→ 接続法。estar は例外 `esté`、tú は `{estés}`。' },
  { id: 'l3-02', L: 3, k: 'pick', s: 'Siento que tu hermano ___ enfermo.', o: ['está', 'esté', 'estés'], a: 1, ja: 'お兄さんが病気で、お気の毒です。', why: '気持ち（`siento que`）→ 接続法。tu hermano は él の形 `{esté}`。' },
  { id: 'l3-03', L: 3, k: 'pick', s: 'Espero que ___ feliz.', o: ['eres', 'seas', 'sea'], a: 1, ja: '君が幸せだといいな。', why: '願い → 接続法。ser は例外 `sea`、tú は `{seas}`。' },
  { id: 'l3-04', L: 3, k: 'pick', s: 'Ojalá no ___ problemas.', o: ['hay', 'haya', 'hayan'], a: 1, ja: '問題がないといいなあ。', why: '`hay`（haber）の接続法は `{haya}`。hay と同じく、数に関係なく haya。' },
  { id: 'l3-05', L: 3, k: 'pick', s: 'Quiero que ___ a la tienda conmigo.', o: ['vas', 'vayas', 'vaya'], a: 1, ja: '私といっしょに店に行ってほしい。', why: '願い → 接続法。ir は例外 `vaya`、tú は `{vayas}`。' },
  { id: 'l3-06', L: 3, k: 'pick', s: 'Me alegro de que ___ mi dirección.', o: ['sabes', 'sepas', 'sepa'], a: 1, ja: '君が私の住所を知っていてうれしい。', why: '気持ち → 接続法。saber は例外 `sepa`、tú は `{sepas}`。' },
  { id: 'l3-07', L: 3, k: 'form', v: 'ir', p: 'nosotros', o: ['vamos', 'vayamos', 'vayan'], a: 1, why: 'ir は例外 `vaya`。nosotros は `{vayamos}`。`vamos` はいつもの形。' },
  { id: 'l3-08', L: 3, k: 'form', v: 'dar', p: 'yo', o: ['doy', 'dé', 'de'], a: 1, why: 'dar は例外 `{dé}`。´ は前置詞の `de`（〜の）と区別する印。' },
  { id: 'l3-09', L: 3, k: 'form', v: 'saber', p: 'ellos', o: ['saben', 'sepan', 'sepa'], a: 1, why: 'saber は例外 `sepa`、ellos は `{sepan}`。' },
  { id: 'l3-10', L: 3, k: 'form', v: 'buscar', p: 'tú', o: ['buscas', 'busques', 'busces'], a: 1, why: '`busco` → c のまま e をつけると「セ」の音。qu に書きかえて `busque`、tú は `{busques}`。' },
  { id: 'l3-11', L: 3, k: 'form', v: 'llegar', p: 'él', o: ['llega', 'llegue', 'llege'], a: 1, why: '`llego` → g のあとに u を入れて `{llegue}`（「グ」の音を残す）。' },
  { id: 'l3-12', L: 3, k: 'form', v: 'estar', p: 'ellos', o: ['están', 'estén', 'esten'], a: 1, why: 'estar は例外 `esté`、ellos は `{estén}`（´ を忘れない）。' },
  { id: 'l3-13', L: 3, k: 'mood', s: 'Me alegro de que ___ aquí.', v: 'estar', full: 'Me alegro de que {estés} aquí.', a: 1, ja: '君がここにいてうれしい。', why: '気持ち（`me alegro de que`）→ 🔴 赤。`{estés}`。' },
  { id: 'l3-14', L: 3, k: 'mood', s: 'Sé que mi hermano ___ en Sevilla.', v: 'estar', full: 'Sé que mi hermano {está} en Sevilla.', a: 0, ja: '弟がセビリアにいるのは知っている。', why: '`sé que` は本当のこと → 🔵 青。`{está}`。' },
  { id: 'l3-15', L: 3, k: 'ja', s: 'Siento que no {puedas} venir.', o: ['君が来られなくて残念だ。', '君が来られないのは知っている。', '君が来られるといいな。'], a: 0, why: '`siento que` ＋ 接続法で「〜で残念だ」。`puedo` → `{puedas}`。' },
  { id: 'l3-16', L: 3, k: 'bug', s: 'Me alegro de que eres feliz.', a: 'eres', ok: 'Me alegro de que seas feliz.', ja: '君が幸せでうれしい。', why: '気持ち → 接続法。ser は `sea`、tú は `{seas}`。' },
  { id: 'l3-17', L: 3, k: 'bug', s: 'Espero que llegas pronto.', a: 'llegas', ok: 'Espero que llegues pronto.', ja: '早く着くといいな。', why: '願い → 接続法。`llego` → `{llegues}`（u を入れる）。' },
  { id: 'l3-18', L: 3, k: 'build', s: 'Me alegro de que estés bien.', d: ['estás'], ja: '君が元気でうれしい。' },
  { id: 'l3-19', L: 3, k: 'ng', s: '___ que tengas trabajo.', o: ['Me alegro de', 'Espero', 'Sé'], a: 2, fit: 0, ja: '仕事があってうれしい。／仕事があるといいな。', why: '`sé que` のあとは本当のこと（`tienes`）。接続法の `tengas` とは合わない。' },
  { id: 'l3-20', L: 3, k: 'pick', s: 'Ojalá ___ una carta de Félix.', o: ['llega', 'llegue', 'llege', 'llegará'], a: 1, ja: 'フェリクスから手紙が届くといいなあ。', why: '`ojalá` → 接続法。`llego` → `{llegue}`（u を入れる）。' },
  { id: 'l3-21', L: 3, k: 'pick', s: 'Quiero que el concierto ___ a las ocho.', o: ['empieza', 'empiece', 'empieze'], a: 1, ja: 'コンサートを8時に始めてほしい。', why: '願い → 接続法。`empiezo` → z は e の前で c に書きかえて `{empiece}`。' },
  { id: 'l3-22', L: 3, k: 'form', v: 'poder', p: 'nosotros', o: ['podamos', 'puedamos', 'podemos'], a: 0, why: 'ie・ue になる動詞も yo の形から（`pueda`）。ただ nosotros・vosotros だけは原形の芯 pod- にもどって `{podamos}`。`podemos` はいつもの形。' },
  { id: 'l3-23', L: 3, k: 'form', v: 'dar', p: 'tú', o: ['des', 'dés', 'das'], a: 0, why: 'dar の接続法で ´ がつくのは `{dé}` だけ。tú は `{des}`（´ なし）。`das` はいつもの形。' },

  /* ================= L4 疑い・必要（赤）と本当だと思う（青） ================= */
  { id: 'l4-01', L: 4, k: 'pick', s: 'No creo que Inés ___ hijos.', o: ['tiene', 'tenga', 'tendría', 'tengo'], a: 1, ja: 'イネスに子どもがいるとは思わない。', why: '`no creo que`（疑い）→ 接続法 `{tenga}`。' },
  { id: 'l4-02', L: 4, k: 'pick', s: 'Creo que la harina ___ mañana.', o: ['llega', 'llegue', 'lleguen'], a: 0, ja: '小麦粉は明日届くと思う。', why: '`creo que`（本当だと思う）→ いつもの形 `{llega}`。' },
  { id: 'l4-03', L: 4, k: 'pick', s: 'Es necesario que ustedes ___ la tienda.', o: ['abren', 'abran', 'abra'], a: 1, ja: 'みなさんが店を開けることが必要です。', why: '`es necesario que` → 接続法。`abro` → `abra`、ustedes は `{abran}`。' },
  { id: 'l4-04', L: 4, k: 'pick', s: 'Dudo que Teo ___ hoy.', o: ['viene', 'venga', 'vendría', 'vengo'], a: 1, ja: 'テオが今日来るとは思えない。', why: '`dudo que`（疑う）→ 接続法 `{venga}`。' },
  { id: 'l4-05', L: 4, k: 'pick', s: 'Es verdad que Inés ___ muy bien.', o: ['cocina', 'cocine', 'cocinen'], a: 0, ja: 'イネスが料理がとても上手なのは本当だ。', why: '`es verdad que`（本当だ）→ いつもの形 `{cocina}`。' },
  { id: 'l4-06', L: 4, k: 'pick', s: 'Es importante que los niños ___ bien.', o: ['duermen', 'duerman', 'duerma'], a: 1, ja: '子どもたちがよく眠ることが大事だ。', why: '`es importante que` → 接続法。`duermo` → `duerma`、ellos は `{duerman}`。' },
  { id: 'l4-07', L: 4, k: 'mood', s: 'No creo que ___ la verdad.', v: 'decir', full: 'No creo que {digas} la verdad.', a: 1, ja: '君が本当のことを言っているとは思わない。', why: '`no creo que`（疑い）→ 🔴 赤。`{digas}`。' },
  { id: 'l4-08', L: 4, k: 'mood', s: 'Creo que Luz ___ razón.', v: 'tener', full: 'Creo que Luz {tiene} razón.', a: 0, ja: 'ルスの言うとおりだと思う。', why: '`creo que`（本当だと思う）→ 🔵 青。`{tiene}`。' },
  { id: 'l4-09', L: 4, k: 'mood', s: 'Es necesario que ___ más.', v: 'estudiar', full: 'Es necesario que {estudies} más.', a: 1, ja: '君はもっと勉強することが必要だ。', why: '`es necesario que`（必要）→ 🔴 赤。`{estudies}`。' },
  { id: 'l4-10', L: 4, k: 'mood', s: 'Es verdad que Marco ___ en el barco.', v: 'estar', full: 'Es verdad que Marco {está} en el barco.', a: 0, ja: 'マルコが船にいるのは本当だ。', why: '`es verdad que` → 🔵 青。`{está}`。' },
  { id: 'l4-11', L: 4, k: 'ng', s: '___ que venga Félix.', o: ['Dudo', 'No creo', 'Creo'], a: 2, fit: 0, ja: 'フェリクスが来るとは思えない。', why: '`creo que` のあとは本当だと思うこと（`viene`）。接続法の `venga` とは合わない。' },
  { id: 'l4-12', L: 4, k: 'ng', s: '___ que Marco está bien.', o: ['Sé', 'Creo', 'Es importante'], a: 2, fit: 0, ja: 'マルコが元気なのは知っている／元気だと思う。', why: '`es importante que` のあとは接続法（`esté`）。いつもの形の `está` とは合わない。' },
  { id: 'l4-13', L: 4, k: 'ja', s: 'No creo que {llueva} mañana.', o: ['明日雨が降るとは思わない。', '明日は雨が降ると思う。', '明日雨が降るといいな。'], a: 0, why: '`no creo que` ＋ 接続法で「〜とは思わない」。' },
  { id: 'l4-14', L: 4, k: 'ja', s: 'Es necesario que {abras} la ventana.', o: ['君が窓を開けることが必要だ。', '窓が開いているのは本当だ。', '（私は）窓を開けたい。'], a: 0, why: '`es necesario que` ＋ 接続法で「〜することが必要だ」。' },
  { id: 'l4-15', L: 4, k: 'bug', s: 'No creo que Teo tiene razón.', a: 'tiene', ok: 'No creo que Teo tenga razón.', ja: 'テオの言うとおりだとは思わない。', why: '`no creo que` → 接続法 `{tenga}`。' },
  { id: 'l4-16', L: 4, k: 'bug', s: 'Creo que la harina llegue hoy.', a: 'llegue', ok: 'Creo que la harina llega hoy.', ja: '小麦粉は今日届くと思う。', why: '`creo que` → いつもの形 `{llega}`。' },
  { id: 'l4-17', L: 4, k: 'build', s: 'Es necesario que comas bien.', d: ['comes'], ja: '君はちゃんと食べることが必要だ。' },
  { id: 'l4-18', L: 4, k: 'build', s: 'No creo que venga hoy.', d: ['viene'], ja: '（彼が）今日来るとは思わない。' },
  { id: 'l4-19', L: 4, k: 'form', v: 'abrir', p: 'ellos', o: ['abren', 'abran', 'abráis'], a: 1, why: '`abro` → `abra`、ellos は `{abran}`。' },
  { id: 'l4-20', L: 4, k: 'pick', s: 'Es importante que usted ___ a tiempo.', o: ['llega', 'llegue', 'llegues'], a: 1, ja: 'あなたが時間どおりに着くことが大事です。', why: '`es importante que` → 接続法。usted は él と同じ `{llegue}`。' },
  { id: 'l4-21', L: 4, k: 'pick', s: 'Es posible que la harina ___ tarde.', o: ['llega', 'llegue', 'llegues'], a: 1, ja: '小麦粉は遅れて届くかもしれない。', why: '`es posible que`（〜かもしれない）は、本当かどうか分からない → 接続法。主語は la harina なので `{llegue}`。' },

  /* ================= L5 cuando（これから／いつも）・antes de que・para que ================= */
  { id: 'l5-01', L: 5, k: 'pick', s: 'Mañana, cuando ___ a casa, te llamo.', o: ['llego', 'llegue', 'llegaré'], a: 1, ja: '明日、家に着いたら電話するね。', why: 'これからのこと（明日）の cuando → 接続法 `{llegue}`。cuando のあとに未来の形は使わない。' },
  { id: 'l5-02', L: 5, k: 'pick', s: 'Siempre, cuando ___ de trabajar, miro el mar.', o: ['termino', 'termine', 'terminar'], a: 0, ja: 'いつも、仕事が終わると海を見る。', why: 'いつものことの cuando → いつもの形 `{termino}`。' },
  { id: 'l5-03', L: 5, k: 'pick', s: 'Te escribo para que no ___ triste.', o: ['estás', 'estés', 'estar'], a: 1, ja: '君が悲しくならないように、手紙を書く。', why: '`para que` → いつも接続法 `{estés}`。' },
  { id: 'l5-04', L: 5, k: 'pick', s: 'Vamos a casa antes de que ___ a llover.', o: ['empieza', 'empiece', 'empezar'], a: 1, ja: '雨が降りだす前に家に帰ろう。', why: '`antes de que` → いつも接続法。`empiezo` → `{empiece}`。' },
  { id: 'l5-05', L: 5, k: 'pick', s: 'Cuando ___ mayor, quiero ser médico.', o: ['soy', 'sea', 'seré'], a: 1, ja: '大きくなったら、医者になりたい。', why: 'まだ大きくなっていない、これからのこと → 接続法 `{sea}`。' },
  { id: 'l5-06', L: 5, k: 'pick', s: 'Ayer, cuando ___ al puerto, vi a Marco.', o: ['llegué', 'llegue', 'llego'], a: 0, ja: '昨日港に着いたとき、マルコに会った。', why: '昨日、本当にあったこと → いつもの形（過去）`{llegué}`。' },
  { id: 'l5-07', L: 5, k: 'mood', s: 'Cuando ___ dinero, voy a comprar un barco.', v: 'tener', full: 'Cuando {tenga} dinero, voy a comprar un barco.', a: 1, ja: 'お金ができたら、船を買うつもりだ。', why: 'まだお金がない、これからのこと → 🔴 赤。`{tenga}`。' },
  { id: 'l5-08', L: 5, k: 'mood', s: 'Cuando ___ frío, cierro la ventana.', v: 'hacer', full: 'Cuando {hace} frío, cierro la ventana.', a: 0, ja: '寒いと（いつも）窓を閉める。', why: 'いつものこと → 🔵 青。`{hace}`。' },
  { id: 'l5-09', L: 5, k: 'mood', s: 'Hablo alto para que todos me ___.', v: 'oír', full: 'Hablo alto para que todos me {oigan}.', a: 1, ja: 'みんなに聞こえるように、大きな声で話す。', why: '`para que` → いつも 🔴 赤。`oigo` → `{oigan}`（ellos）。' },
  { id: 'l5-10', L: 5, k: 'ng', s: 'Te llamo ___ llegues.', o: ['cuando', 'antes de que', 'porque'], a: 2, fit: 0, ja: '君が着いたら／着く前に、電話する。', why: '`porque`（なぜなら）のあとは本当のこと（いつもの形）。接続法の `llegues` とは合わない。' },
  { id: 'l5-11', L: 5, k: 'ja', s: 'Cuando {vuelvas}, vamos a bailar.', o: ['君が帰ってきたら、踊ろう。', '君が帰ってくると、いつも踊る。', '君が帰ってきたとき、踊った。'], a: 0, why: 'cuando ＋ 接続法は「（これから）〜したら」。' },
  { id: 'l5-12', L: 5, k: 'ja', s: 'Te escribo para que me {recuerdes}.', o: ['私を覚えていてくれるように、手紙を書く。', '私を覚えているから、手紙を書く。', '私を覚えていたら、手紙を書いて。'], a: 0, why: '`para que` ＋ 接続法は「〜するように（目的）」。' },
  { id: 'l5-13', L: 5, k: 'bug', s: 'Mañana, cuando vuelves, vamos a la playa.', a: 'vuelves', ok: 'Mañana, cuando vuelvas, vamos a la playa.', ja: '明日、君が帰ってきたら、海に行こう。', why: '明日のこと → 接続法。`vuelvo` → `{vuelvas}`。' },
  { id: 'l5-14', L: 5, k: 'bug', s: 'Te escribo para que no estás triste.', a: 'estás', ok: 'Te escribo para que no estés triste.', ja: '悲しくならないように、手紙を書くね。', why: '`para que` → いつも接続法 `{estés}`。' },
  { id: 'l5-15', L: 5, k: 'build', s: 'Te llamo cuando llegues.', d: ['llegas'], ja: '君が着いたら電話するね。' },
  { id: 'l5-16', L: 5, k: 'build', s: 'Hablo para que me escuches.', d: ['escuchas'], ja: '君が聞いてくれるように話す。' },
  { id: 'l5-17', L: 5, k: 'form', v: 'volver', p: 'tú', o: ['vuelves', 'vuelvas', 'volvas'], a: 1, why: 'yo の形 `vuelvo` から → `vuelva`、tú は `{vuelvas}`。原形の volv- からは作らない。' },
  { id: 'l5-18', L: 5, k: 'pick', s: 'Vamos a comer antes de que ___ los niños.', o: ['salen', 'salgan', 'salgamos'], a: 1, ja: '子どもたちが出かける前に、食べよう。', why: '`antes de que` → いつも接続法。los niños は ellos の形 `{salgan}`。' },
  { id: 'l5-19', L: 5, k: 'pick', s: 'Cuando Marco ___, vamos a hacer una fiesta.', o: ['vuelve', 'vuelva', 'vuelvas', 'volverá'], a: 1, ja: 'マルコが帰ってきたら、パーティーをしよう。', why: 'これからのこと → 接続法。Marco は él の形 `{vuelva}`。' },
  { id: 'l5-20', L: 5, k: 'mood', s: 'Antes de que ___ el sol, salimos.', v: 'salir', full: 'Antes de que {salga} el sol, salimos.', a: 1, ja: '日がのぼる前に、出発する。', why: '`antes de que` → いつも 🔴 赤。`{salga}`。' },

  /* ================= L6 さがしている人（赤）・もういる人（青） ================= */
  { id: 'l6-01', L: 6, k: 'pick', s: 'Busco una persona que ___ inglés.', o: ['habla', 'hable', 'hablo'], a: 1, ja: '英語を話す人をさがしている。', why: 'まだ見つかっていない人 → 接続法 `{hable}`。' },
  { id: 'l6-02', L: 6, k: 'pick', s: 'Tengo una amiga que ___ en Madrid.', o: ['vive', 'viva', 'vivas'], a: 0, ja: 'マドリードに住んでいる友だちがいる。', why: 'もういる友だち → いつもの形 `{vive}`。' },
  { id: 'l6-03', L: 6, k: 'pick', s: 'No hay nadie que ___ tocar el piano.', o: ['sabe', 'sepa', 'sé'], a: 1, ja: 'ピアノがひける人はだれもいない。', why: 'いない人 → 接続法。saber は例外 `{sepa}`。' },
  { id: 'l6-04', L: 6, k: 'pick', s: '¿Hay alguien que ___ un lápiz?', o: ['tiene', 'tenga', 'tengo'], a: 1, ja: '鉛筆を持っている人はいますか？', why: 'いるかどうか分からない人をたずねる → 接続法 `{tenga}`。' },
  { id: 'l6-05', L: 6, k: 'pick', s: 'Queremos una casa que ___ cerca del mar.', o: ['está', 'esté', 'estés'], a: 1, ja: '海の近くにある家がほしい。', why: 'まだ見つかっていない家 → 接続法 `{esté}`。' },
  { id: 'l6-06', L: 6, k: 'pick', s: 'Vivo en una casa que ___ cerca del mar.', o: ['está', 'esté', 'estén'], a: 0, ja: '海の近くにある家に住んでいる。', why: 'もう住んでいる家 → いつもの形 `{está}`。' },
  { id: 'l6-07', L: 6, k: 'mood', s: 'Necesito un libro que ___ fácil.', v: 'ser', full: 'Necesito un libro que {sea} fácil.', a: 1, ja: 'やさしい本が必要だ。', why: 'まだ手もとにない本 → 🔴 赤。`{sea}`。' },
  { id: 'l6-08', L: 6, k: 'mood', s: 'Conozco a un chico que ___ cocinar.', v: 'saber', full: 'Conozco a un chico que {sabe} cocinar.', a: 0, ja: '料理ができる男の子を知っている。', why: '知っている（もういる）人 → 🔵 青。`{sabe}`。' },
  { id: 'l6-09', L: 6, k: 'mood', s: 'No hay nadie que ___ la verdad.', v: 'saber', full: 'No hay nadie que {sepa} la verdad.', a: 1, ja: '本当のことを知っている人はだれもいない。', why: 'いない人 → 🔴 赤。`{sepa}`。' },
  { id: 'l6-10', L: 6, k: 'ng', s: 'Tengo un amigo que ___ japonés.', o: ['habla', 'hablaba', 'hable'], a: 2, fit: 0, ja: '日本語を話す友だちがいる。', why: 'もういる友だち → いつもの形（`hablaba` は昔の話）。接続法の `hable` は入らない。' },
  { id: 'l6-11', L: 6, k: 'ng', s: '___ una persona que sepa cocinar.', o: ['Buscamos', 'Necesitamos', 'Tenemos'], a: 2, fit: 0, ja: '料理ができる人をさがしている／必要だ。', why: '`tenemos`（もういる）なら `sabe`。接続法の `sepa` とは合わない。' },
  { id: 'l6-12', L: 6, k: 'ja', s: 'Busco un trabajo que {sea} interesante.', o: ['おもしろい仕事をさがしている。', 'おもしろい仕事をしている。', 'その仕事はおもしろい。'], a: 0, why: 'さがしている物 ＋ 接続法。' },
  { id: 'l6-13', L: 6, k: 'ja', s: 'No hay nadie que me {ayude}.', o: ['手伝ってくれる人はだれもいない。', 'だれかが手伝ってくれる。', '手伝ってくれる人がいる。'], a: 0, why: '`no hay nadie que` ＋ 接続法で「〜する人はだれもいない」。' },
  { id: 'l6-14', L: 6, k: 'bug', s: 'Busco un amigo que sabe cocinar.', a: 'sabe', ok: 'Busco un amigo que sepa cocinar.', ja: '料理ができる友だちをさがしている。', why: 'さがしている人 → 接続法 `{sepa}`。' },
  { id: 'l6-15', L: 6, k: 'bug', s: 'Tengo un amigo que hable inglés.', a: 'hable', ok: 'Tengo un amigo que habla inglés.', ja: '英語を話す友だちがいる。', why: 'もういる友だち → いつもの形 `{habla}`。' },
  { id: 'l6-16', L: 6, k: 'build', s: 'No hay nadie que cante.', d: ['canta'], ja: '歌う人はだれもいない。' },
  { id: 'l6-17', L: 6, k: 'build', s: 'Busco una casa que sea grande.', d: ['es'], ja: '大きい家をさがしている。' },
  { id: 'l6-18', L: 6, k: 'form', v: 'necesitar', p: 'nosotros', o: ['necesitamos', 'necesitemos', 'necesiten'], a: 1, why: '`necesito` → `necesite`、nosotros は `{necesitemos}`。' },
  { id: 'l6-19', L: 6, k: 'pick', s: 'No conozco a nadie que ___ en el puerto.', o: ['trabaja', 'trabaje', 'trabajes'], a: 1, ja: '港で働いている人を、だれも知らない。', why: 'いない人 → 接続法 `{trabaje}`。' },
  { id: 'l6-20', L: 6, k: 'pick', s: 'Aquí hay un chico que ___ leer.', o: ['sabe', 'sepa', 'sepas'], a: 0, ja: 'ここに字が読める男の子がいる。', why: 'もういる子 → いつもの形 `{sabe}`。' },

  /* ================= L7 伝える（青）／頼む（赤）・pedir que・usted の「〜してください」 ================= */
  { id: 'l7-01', L: 7, k: 'pick', s: 'Dile a Luz que ___ mañana.', o: ['viene', 'venga', 'vengo'], a: 1, ja: 'ルスに「明日来て」と言って。', why: '「来て」という頼みを伝える → 接続法 `{venga}`。' },
  { id: 'l7-02', L: 7, k: 'pick', s: 'Dile a Luz que Marco ___ mañana.', o: ['viene', 'venga', 'vengas'], a: 0, ja: 'マルコが明日来ると、ルスに伝えて。', why: '事実を伝える → いつもの形 `{viene}`。' },
  { id: 'l7-03', L: 7, k: 'pick', s: 'Te pido que me ___.', o: ['ayudas', 'ayudes', 'ayude'], a: 1, ja: '（君に）手伝ってほしいとお願いする。', why: '`pedir que` → いつも接続法。tú は `{ayudes}`。' },
  { id: 'l7-04', L: 7, k: 'pick', s: 'Mi madre me dice que ___ temprano.', o: ['vuelvo', 'vuelva', 'vuelvas'], a: 1, ja: '母は私に、早く帰るように言う。', why: '頼み（帰りなさい）を伝える → 接続法。帰るのは私（yo）なので `{vuelva}`。' },
  { id: 'l7-05', L: 7, k: 'pick', s: 'Mi madre me dice que ___ bien.', o: ['está', 'esté', 'estés'], a: 0, ja: '母は、元気だと私に言う。', why: '事実（母は元気だ）を伝える → いつもの形 `{está}`。' },
  { id: 'l7-06', L: 7, k: 'pick', s: 'Les pido que ___ la puerta.', o: ['cierran', 'cierren', 'cierre'], a: 1, ja: 'みなさんにドアを閉めるようお願いします。', why: '`pedir que` → 接続法。`cierro` → `cierre`、ustedes は `{cierren}`。' },
  { id: 'l7-07', L: 7, k: 'mood', s: 'Dile a Teo que ___ la carta mañana.', v: 'traer', full: 'Dile a Teo que {traiga} la carta mañana.', a: 1, ja: 'テオに、明日手紙を持ってくるよう言って。', why: '頼みを伝える → 🔴 赤。`traigo` → `{traiga}`。' },
  { id: 'l7-08', L: 7, k: 'mood', s: 'Dile a Teo que la carta ___ en la mesa.', v: 'estar', full: 'Dile a Teo que la carta {está} en la mesa.', a: 0, ja: 'テオに、手紙はテーブルの上にあると伝えて。', why: '事実を伝える → 🔵 青。`{está}`。' },
  { id: 'l7-09', L: 7, k: 'mood', s: 'Inés nos pide que ___ a las siete.', v: 'venir', full: 'Inés nos pide que {vengamos} a las siete.', a: 1, ja: 'イネスは私たちに、7時に来るよう頼む。', why: '`pedir que` → 🔴 赤。nosotros は `{vengamos}`。' },
  { id: 'l7-10', L: 7, k: 'ng', s: '___ que vengas.', o: ['Te pido', 'Te digo', 'Sé'], a: 2, fit: 0, ja: '来てほしいとお願いする。／来てと言う。', why: '`te digo que vengas` は「来て」と頼む言い方。`sé que` のあとは本当のこと（`vienes`）なので合わない。' },
  { id: 'l7-11', L: 7, k: 'ja', s: 'Dile que {venga}.', o: ['来るように（彼に）言って。', '（彼が）来ると伝えて。', '（彼は）来ると言った。'], a: 0, why: 'dile que ＋ 接続法は、頼みを伝える。' },
  { id: 'l7-12', L: 7, k: 'ja', s: 'Dile que {viene}.', o: ['（彼が）来ると伝えて。', '来るように（彼に）言って。', '来ないでと伝えて。'], a: 0, why: 'dile que ＋ いつもの形は、事実を伝える。' },
  { id: 'l7-13', L: 7, k: 'bug', s: 'Te pido que me escribes.', a: 'escribes', ok: 'Te pido que me escribas.', ja: '手紙を書いてほしいとお願いする。', why: '`pedir que` → 接続法 `{escribas}`。' },
  { id: 'l7-14', L: 7, k: 'bug', s: 'Esperamos que venís a la boda.', a: 'venís', ok: 'Esperamos que vengáis a la boda.', ja: 'みんなが結婚式に来てくれるといいな。', why: '願い → 接続法。vosotros は `{vengáis}`。' },
  { id: 'l7-15', L: 7, k: 'build', s: 'Dile que venga mañana.', d: ['viene'], ja: '明日来るように言って。' },
  { id: 'l7-16', L: 7, k: 'form', v: 'traer', p: 'él', o: ['trae', 'traiga', 'traigo'], a: 1, why: '`traigo` の o → a で `{traiga}`。usted も同じ形。' },
  { id: 'l7-17', L: 7, k: 'form', v: 'venir', p: 'vosotros', o: ['venís', 'vengáis', 'vengan'], a: 1, why: '`vengo` → `venga`、vosotros は `{vengáis}`。' },
  { id: 'l7-18', L: 7, k: 'pick', s: 'Quiero que vosotros ___ felices.', o: ['sois', 'seáis', 'sean'], a: 1, ja: '君たちに幸せになってほしい。', why: '願い → 接続法。ser は `sea`、vosotros は `{seáis}`。' },
  { id: 'l7-19', L: 7, k: 'pick', s: 'Señora, ___ usted, por favor.', o: ['pasa', 'pase', 'pasas'], a: 1, ja: 'どうぞ、お入りください。', why: 'usted への「〜してください」は接続法の形。`paso` → `{pase}`。' },
  { id: 'l7-20', L: 7, k: 'mood', s: 'Teo dice que Marco ___ en el puerto.', v: 'estar', full: 'Teo dice que Marco {está} en el puerto.', a: 0, ja: 'テオは、マルコが港にいると言っている。', why: '事実を伝える → 🔵 青。`{está}`。' },
  { id: 'l7-21', L: 7, k: 'mood', s: 'Me alegro de que ___ a la boda.', v: 'venir', full: 'Me alegro de que {vengáis} a la boda.', a: 1, ja: '（君たちが）結婚式に来てくれてうれしい。', why: '気持ち → 🔴 赤。vosotros は `{vengáis}`。' }
];
