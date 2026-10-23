/* =========================================================
 * ¡MANDA! — 問題バンク
 *
 *  レッスン（lessons.js）の drill や、ボス戦、復習で出す問題。
 *  各問は、そのレッスンまでに習った形だけで作ってある。
 *
 *  共通の項目
 *    id   'l1-01' のように（レッスン番号-通し番号）
 *    L    レッスン番号（数値）
 *    k    問題の種類（下）
 *    why  解説。日本語で短く。スペイン語は `…` でかこむ
 *
 *  文中の印（pick・who・ja の s だけで使う）
 *    {…}  命令の形（金色）    […]  呼びかける名前（水色）
 *
 *  kind（k）
 *    pick   空所に入る形を選ぶ     { s（___ を1つ）, o（3つ）, a（正解の番号）, ja }
 *    form   原形から命令を作る     { v（原形）, p（相手）, o（動詞の形3つ）, a }
 *                                  p は 'tú' 'usted' 'vosotros' 'ustedes' 'no-tú'（tú への「〜するな」。no は選択肢に含めない）'no-usted'
 *    scene  場面に合う命令を選ぶ   { sit（日本語の場面）, o（3つ）, a }
 *    who    だれへの命令か         { s, a（0 tú / 1 usted / 2 vosotros / 3 ustedes）, ja }
 *    ja     意味を選ぶ             { s, o（日本語3つ）, a }
 *    bug    まちがい探し           { s（印なし）, a（まちがった1語）, ok（直した文）, ja }
 *    build  タイル並べ             { s（スペース区切りの語がタイル。6語以内・印なし）, d（ダミータイル）, ja }
 *
 *  選択肢のダミーは「よくあるまちがい」（tú の現在形・彼は〜する・原形・tú と usted の取り違え・
 *  不規則なのに規則どおり作った形・存在しない形）にしてある。
 *  例文はこのアプリのためのオリジナル。
 * ========================================================= */
window.MQ = window.MQ || {};

MQ.questions = [
  /* ================= L1 tú への命令（s を取る） ================= */
  { id: 'l1-01', L: 1, k: 'pick', s: '[Pepe], ___ el pan.', o: ['come', 'comes', 'como'], a: 0, ja: 'ペペ、パンを食べなさい。', why: '`comes`（君は食べる）から s を取って `{come}`。`como` は「私は食べる」。' },
  { id: 'l1-02', L: 1, k: 'form', v: 'hablar', p: 'tú', o: ['hablas', 'hablo', 'habla'], a: 2, why: '`hablas`（君は話す）から s を取って `{habla}`。`hablo` は「私は話す」。' },
  { id: 'l1-03', L: 1, k: 'scene', sit: '暗くてこわくて、ペペが目をぎゅっとつぶっている。「目を開けなさい」と言う', o: ['Abro los ojos.', 'Abre los ojos.', 'Abres los ojos.'], a: 1, why: '`abres`（君は開ける）から s を取って `{abre}`。`abro` は「私は開ける」。' },
  { id: 'l1-04', L: 1, k: 'ja', s: '{Escucha}, [Lola].', o: ['ロラは聞いている。', 'ロラ、聞いて。', 'ロラ、聞かないで。'], a: 1, why: '`escuchas`（君は聞く）の s を取った形 `{escucha}` は「聞いて」という命令。呼びかけの名前はコンマで区切る。' },
  { id: 'l1-05', L: 1, k: 'bug', s: 'Pepe, comes el pan.', a: 'comes', ok: 'Pepe, come el pan.', ja: 'ペペ、パンを食べなさい。', why: '`comes` は「君は食べる」で、命令ではない。s を取って `{come}` にする。' },
  { id: 'l1-06', L: 1, k: 'build', s: 'Abre la puerta, Lola.', d: ['Abres'], ja: 'ロラ、ドアを開けて。' },
  { id: 'l1-07', L: 1, k: 'pick', s: '[Pepe], ___ una canción.', o: ['canta', 'canto', 'cantas'], a: 0, ja: 'ペペ、歌を歌って。', why: '`cantas`（君は歌う）から s を取って `{canta}`。`canto` は「私は歌う」。' },
  { id: 'l1-08', L: 1, k: 'form', v: 'escuchar', p: 'tú', o: ['escuchas', 'escuchar', 'escucha'], a: 2, why: '`escuchas` から s を取って `{escucha}`。`escuchar` は原形で、命令ではない。' },
  { id: 'l1-09', L: 1, k: 'scene', sit: 'ロラが本をひらいたまま、ぼんやりしている。「読みなさい」と言う', o: ['Lees el libro.', 'Leo el libro.', 'Lee el libro.'], a: 2, why: '`lees`（君は読む）から s を取って `{lee}`。`leo` は「私は読む」。' },
  { id: 'l1-10', L: 1, k: 'ja', s: '{Come} mucho, [Pepe].', o: ['ペペ、たくさん食べなさい。', 'ペペはたくさん食べる。', 'ペペ、食べないで。'], a: 0, why: '`comes` の s を取った `{come}` は命令。「たくさん食べなさい」の意味になる。' },
  { id: 'l1-11', L: 1, k: 'bug', s: 'Lola, escuchas la música.', a: 'escuchas', ok: 'Lola, escucha la música.', ja: 'ロラ、音楽を聞いて。', why: '`escuchas` は「君は聞く」。命令にするには s を取って `{escucha}`。' },
  { id: 'l1-12', L: 1, k: 'build', s: 'Baila con Lola, Pepe.', d: ['Bailas'], ja: 'ペペ、ロラと踊って。' },

  /* ================= L2 つづりが変わる動詞・por favor ================= */
  { id: 'l2-01', L: 2, k: 'pick', s: '[Pepe], ___ ya, por favor.', o: ['duermes', 'duerme', 'dorme'], a: 1, ja: 'ペペ、もう寝て、お願い。', why: '`duermes`（君は寝る）から s を取って `{duerme}`。ue は残す。`dorme` という形はない。' },
  { id: 'l2-02', L: 2, k: 'form', v: 'jugar', p: 'tú', o: ['juega', 'juegas', 'jugas'], a: 0, why: '`juegas`（君は遊ぶ）から s を取って `{juega}`。u → ue のつづりはそのまま残る。' },
  { id: 'l2-03', L: 2, k: 'scene', sit: 'ロラが風の入る窓のそばで寒そうにしている。「窓を閉めて、お願い」と言う', o: ['Cierras la ventana, por favor.', 'Cerra la ventana, por favor.', 'Cierra la ventana, por favor.'], a: 2, why: '`cierras`（君は閉める）から s を取って `{cierra}`。`cerra` は ie に変わる前の存在しない形。' },
  { id: 'l2-04', L: 2, k: 'pick', s: '[Lola], ___ con Pepe.', o: ['juegas', 'juega', 'jugamos'], a: 1, ja: 'ロラ、ペペと遊んであげて。', why: '`juegas` から s を取って `{juega}`。`jugamos` は「私たちは遊ぶ」。' },
  { id: 'l2-05', L: 2, k: 'bug', s: 'Pepe, dorme aquí.', a: 'dorme', ok: 'Pepe, duerme aquí.', ja: 'ペペ、ここで寝なさい。', why: '`dormir` は o が ue に変わる動詞。`duermes` から s を取って `{duerme}`。`dorme` という形はない。' },
  { id: 'l2-06', L: 2, k: 'ja', s: '{Piensa}, [Pepe].', o: ['ペペは考える。', 'ペペ、考えて。', 'ペペ、考えないで。'], a: 1, why: '`pensar` は e が ie に変わる動詞。`piensas` の s を取った `{piensa}` が命令。' },
  { id: 'l2-07', L: 2, k: 'build', s: 'Cierra la puerta, por favor.', d: ['Cierras'], ja: 'ドアを閉めて、お願い。' },
  { id: 'l2-08', L: 2, k: 'form', v: 'empezar', p: 'tú', o: ['empieza', 'empiezas', 'empeza'], a: 0, why: '`empiezas`（君は始める）から s を取って `{empieza}`。e → ie のつづりは残す。' },
  { id: 'l2-09', L: 2, k: 'scene', sit: 'ペペがおもしろい話を知っているらしい。「話して聞かせて」と言う', o: ['Cuentas, Pepe.', 'Conta, Pepe.', 'Cuenta, Pepe.'], a: 2, why: '`contar` は o が ue に変わる動詞。`cuentas` から s を取って `{cuenta}`。' },
  { id: 'l2-10', L: 2, k: 'pick', s: '[Lola], ___ la tienda, por favor.', o: ['cerra', 'cierras', 'cierra'], a: 2, ja: 'ロラ、店を閉めて、お願い。', why: '`cierras` から s を取って `{cierra}`。`cierras` のままだと「君は閉める」になる。' },
  { id: 'l2-11', L: 2, k: 'bug', s: 'Lola, juegas con Pepe.', a: 'juegas', ok: 'Lola, juega con Pepe.', ja: 'ロラ、ペペと遊んで。', why: '`juegas` は「君は遊ぶ」。命令にするには s を取って `{juega}`。' },
  { id: 'l2-12', L: 2, k: 'ja', s: '{Duerme}, [Pepe].', o: ['ペペ、寝なさい。', 'ペペは寝る。', 'ペペ、寝ないで。'], a: 0, why: '`duermes` から s を取った `{duerme}` は「寝なさい」という命令。名前は後ろに置いてもよい。' },

  /* ================= L3 不規則な命令 ven・ten・pon・sal ================= */
  { id: 'l3-01', L: 3, k: 'pick', s: '[Pepe], ___ aquí.', o: ['viene', 'ven', 'vienes'], a: 1, ja: 'ペペ、ここに来て。', why: '`venir` の命令は原形から -ir を取った `{ven}`。`viene` は「彼は来る」、`vienes` は「君は来る」。' },
  { id: 'l3-02', L: 3, k: 'form', v: 'venir', p: 'tú', o: ['ven', 'viene', 'vienes'], a: 0, why: '`venir` は原形の最後の `-ir` を取って `{ven}`。s を取る作り方だと `viene` になり、命令にならない。' },
  { id: 'l3-03', L: 3, k: 'scene', sit: 'ロラが燃える火にさわろうとしている。「気をつけて」と言う', o: ['Tienes cuidado, Lola.', 'Tene cuidado, Lola.', 'Ten cuidado, Lola.'], a: 2, why: '`tener` の命令は原形から -er を取って `{ten}`。`tene` は規則どおりに作ってしまった存在しない形。' },
  { id: 'l3-04', L: 3, k: 'pick', s: '[Pepe], ___ el libro en la mesa.', o: ['pone', 'pon', 'poner'], a: 1, ja: 'ペペ、本をテーブルに置いて。', why: '`poner` の命令は原形から -er を取って `{pon}`。`pone` は「彼は置く」、`poner` は原形。' },
  { id: 'l3-05', L: 3, k: 'bug', s: 'Lola, tiene cuidado.', a: 'tiene', ok: 'Lola, ten cuidado.', ja: 'ロラ、気をつけて。', why: '`tiene` は「彼は持っている」。`tener` の命令は原形から -er を取った `{ten}`。' },
  { id: 'l3-06', L: 3, k: 'ja', s: '{Ten} cuidado.', o: ['注意を置いて。', '気をつけて。', '注意を持っている。'], a: 1, why: '`tener cuidado` は「気をつける」。命令の `{ten}` は原形から -er を取った形。' },
  { id: 'l3-07', L: 3, k: 'build', s: 'Ven aquí, Pepe.', d: ['Viene'], ja: 'ペペ、ここに来なさい。' },
  { id: 'l3-08', L: 3, k: 'form', v: 'tener', p: 'tú', o: ['ten', 'tiene', 'tienes'], a: 0, why: '`tener` の命令は原形の最後の `-er` を取って `{ten}`。`tiene` や `tienes` は命令ではない。' },
  { id: 'l3-09', L: 3, k: 'scene', sit: '小屋の中がけむりでいっぱい。ペペに「家から出なさい」と言う', o: ['Sale de la casa, Pepe.', 'Sales de la casa, Pepe.', 'Sal de la casa, Pepe.'], a: 2, why: '`salir` の命令は原形から -ir を取って `{sal}`。`sale` は「彼は出る」、`sales` は「君は出る」。' },
  { id: 'l3-10', L: 3, k: 'form', v: 'poner', p: 'tú', o: ['pone', 'pones', 'pon'], a: 2, why: '`poner` は原形の最後の `-er` を取って `{pon}`。' },
  { id: 'l3-11', L: 3, k: 'scene', sit: 'ロラが遠くでぼんやり立っている。そばに呼ぶ', o: ['Ven aquí, Lola.', 'Vienes aquí, Lola.', 'Viene aquí, Lola.'], a: 0, why: '`venir` の命令は `{ven}`。`vienes` は「君は来る」、`viene` は「彼女は来る」。' },
  { id: 'l3-12', L: 3, k: 'build', s: 'Sal de la casa, Lola.', d: ['Sale'], ja: 'ロラ、家から出なさい。' },

  /* ================= L4 覚える4つ haz・di・ve・sé ================= */
  { id: 'l4-01', L: 4, k: 'pick', s: '[Pepe], ___ una casa.', o: ['hace', 'haz', 'haces'], a: 1, ja: 'ペペ、家を作って。', why: '`hacer` の命令は覚える形 `{haz}`。`hace` は「彼は作る」、`haces` は「君は作る」。' },
  { id: 'l4-02', L: 4, k: 'form', v: 'decir', p: 'tú', o: ['di', 'dice', 'dices'], a: 0, why: '`decir` の命令は覚える形 `{di}`。`dice` は「彼は言う」、`dices` は「君は言う」。' },
  { id: 'l4-03', L: 4, k: 'scene', sit: 'ペペがロラの貝がらを取ろうとしている。「いい子でいなさい」と言う', o: ['Eres bueno, Pepe.', 'Es bueno, Pepe.', 'Sé bueno, Pepe.'], a: 2, why: '`ser` の命令は覚える形 `{sé}`。`eres` は「君は〜だ」、`es` は「彼は〜だ」。' },
  { id: 'l4-04', L: 4, k: 'pick', s: '[Lola], ___ a la playa.', o: ['va', 've', 'vas'], a: 1, ja: 'ロラ、浜へ行って。', why: '`ir` の命令は覚える形 `{ve}`。`va` は「彼は行く」、`vas` は「君は行く」。' },
  { id: 'l4-05', L: 4, k: 'bug', s: 'Pepe, dice la verdad.', a: 'dice', ok: 'Pepe, di la verdad.', ja: 'ペペ、本当のことを言いなさい。', why: '`dice` は「彼は言う」。`decir` の命令は覚える形 `{di}`。' },
  { id: 'l4-06', L: 4, k: 'ja', s: '{Ve} a la playa.', o: ['彼は浜を見る。', '浜へ行って。', '浜に来て。'], a: 1, why: '`ve` は `ir` の命令。行き先の `a la playa` があるので「行って」。「来て」は `{ven}`。' },
  { id: 'l4-07', L: 4, k: 'build', s: 'Haz una casa, Pepe.', d: ['Hace'], ja: 'ペペ、家を作りなさい。' },
  { id: 'l4-08', L: 4, k: 'form', v: 'ir', p: 'tú', o: ['ve', 'va', 'vas'], a: 0, why: '`ir` の命令は覚える形 `{ve}`。`va` は「彼は行く」、`vas` は「君は行く」。' },
  { id: 'l4-09', L: 4, k: 'scene', sit: 'ペペの口のまわりにパンくず。「本当のことを言って」と言う', o: ['Dices la verdad, Pepe.', 'Dice la verdad, Pepe.', 'Di la verdad, Pepe.'], a: 2, why: '`decir` の命令は `{di}`。`dice`・`dices` は「言う」の現在の形。' },
  { id: 'l4-10', L: 4, k: 'scene', sit: 'テーブルの上が空っぽ。ロラに「パンをテーブルに置いて」と言う', o: ['Pone el pan en la mesa, Lola.', 'Poner el pan en la mesa, Lola.', 'Pon el pan en la mesa, Lola.'], a: 2, why: '`poner` の命令は原形から -er を取った `{pon}`。`pone` は「彼は置く」、`poner` は原形。' },
  { id: 'l4-11', L: 4, k: 'pick', s: '[Lola], ___ de la casa.', o: ['sal', 'sales', 'sale'], a: 0, ja: 'ロラ、家から出て。', why: '`salir` の命令は原形から -ir を取った `{sal}`。`sale` は「彼は出る」。' },
  { id: 'l4-12', L: 4, k: 'build', s: 'Ve a la playa, Lola.', d: ['Va'], ja: 'ロラ、浜へ行きなさい。' },

  /* ================= L5 usted へのていねいな命令 ================= */
  { id: 'l5-01', L: 5, k: 'pick', s: '[Marina], ___ el pan, por favor.', o: ['come', 'coma', 'comes'], a: 1, ja: 'マリーナさま、パンを召し上がってください。', why: '女神さまには usted の命令。`come` の e を a にして `{coma}`。`come` は tú への命令。' },
  { id: 'l5-02', L: 5, k: 'form', v: 'hablar', p: 'usted', o: ['hable', 'habla', 'hables'], a: 0, why: '-ar の動詞は、tú の命令 `habla` の a を e にして `{hable}`。' },
  { id: 'l5-03', L: 5, k: 'scene', sit: 'マリーナさまが小屋の入り口で待っている。「どうぞ入ってください」と言う', o: ['Pasas, por favor.', 'Pasa, por favor.', 'Pase, por favor.'], a: 2, why: '`pasa` は仲よしへの命令。女神さまには a を e にして `{pase}`。`pasas` は「君は通る」。' },
  { id: 'l5-04', L: 5, k: 'scene', sit: 'マリーナさまに「聞いてください」とお願いする', o: ['Escucha, por favor.', 'Escuche, por favor.', 'Escuchas, por favor.'], a: 1, why: '`escuchar` は -ar の動詞。usted には a を e にして `{escuche}`。' },
  { id: 'l5-05', L: 5, k: 'who', s: '{Pase}, por favor.', a: 1, ja: 'どうぞ、お入りください。', why: '`pase` は a を e にした形で、usted（1人・ていねい）への命令。' },
  { id: 'l5-06', L: 5, k: 'who', s: '{Abre} la puerta, [Lola].', a: 0, ja: 'ロラ、ドアを開けて。', why: '`abre` は tú の形から s を取った命令。仲よしのロラへ。usted なら `{abra}`。' },
  { id: 'l5-07', L: 5, k: 'ja', s: '{Coma}, por favor.', o: ['彼は食べる。', 'どうぞ、召し上がってください。', '食べないでください。'], a: 1, why: '`{coma}` は `comer` の usted への命令。「どうぞ召し上がってください」とすすめる言い方。' },
  { id: 'l5-08', L: 5, k: 'bug', s: 'Marina, escucha la música, por favor.', a: 'escucha', ok: 'Marina, escuche la música, por favor.', ja: 'マリーナさま、音楽を聞いてください。', why: '女神さまは usted の相手。`escucha` は tú への命令なので、a を e にして `{escuche}`。' },
  { id: 'l5-09', L: 5, k: 'build', s: 'Pase, por favor.', d: ['Pasa'], ja: 'どうぞ、お入りください。' },
  { id: 'l5-10', L: 5, k: 'build', s: 'Coma el pan, por favor.', d: ['Come'], ja: 'パンを召し上がってください。' },
  { id: 'l5-11', L: 5, k: 'form', v: 'comer', p: 'usted', o: ['coma', 'come', 'comas'], a: 0, why: '-er の動詞は、tú の命令 `come` の e を a にして `{coma}`。' },
  { id: 'l5-12', L: 5, k: 'pick', s: '[Marina], ___ una canción, por favor.', o: ['canta', 'cantas', 'cante'], a: 2, ja: 'マリーナさま、歌を歌ってください。', why: '-ar の動詞は、tú の命令 `canta` の a を e にして `{cante}`。' },

  /* ================= L6 usted の命令は yo の形から ================= */
  { id: 'l6-01', L: 6, k: 'pick', s: '[Marina], ___ conmigo, por favor.', o: ['ven', 'viene', 'venga'], a: 2, ja: 'マリーナさま、わたしといっしょに来てください。', why: '`vengo`（私は来る）の o を取って a をつけ `{venga}`。`ven` は tú への命令。' },
  { id: 'l6-02', L: 6, k: 'form', v: 'tener', p: 'usted', o: ['tenga', 'ten', 'tiene'], a: 0, why: '`tengo` の o を取って a をつけ `{tenga}`。yo の形の g が残る。' },
  { id: 'l6-03', L: 6, k: 'scene', sit: '女神マリーナに、島の花を「どうぞ」とわたす', o: ['Ten, es para usted.', 'Tenga, es para usted.', 'Tiene, es para usted.'], a: 1, why: '`tengo` の o を取って a をつけ `{tenga}`。`ten` は tú への命令。' },
  { id: 'l6-04', L: 6, k: 'pick', s: '[Marina], ___ la ventana, por favor.', o: ['cierre', 'cierra', 'cerre'], a: 0, ja: 'マリーナさま、窓を閉めてください。', why: '`cierro` の o を取って e をつけ `{cierre}`。yo の形の ie が残る。`cierra` は tú への命令。' },
  { id: 'l6-05', L: 6, k: 'who', s: '{Salga} de la casa, por favor.', a: 1, ja: 'どうぞ、家から出てください。', why: '`salga` は yo の形 salgo から作った usted（1人・ていねい）への命令。' },
  { id: 'l6-06', L: 6, k: 'ja', s: '{Haga} una casa.', o: ['彼女は家を作る。', '家を作らないでください。', '家を作ってください。'], a: 2, why: '`hago` の o を取って a をつけた `{haga}` は、usted への命令。' },
  { id: 'l6-07', L: 6, k: 'bug', s: 'Marina, tiene cuidado, por favor.', a: 'tiene', ok: 'Marina, tenga cuidado, por favor.', ja: 'マリーナさま、気をつけてください。', why: '`tiene` は「彼女は持っている」。usted への命令は `tengo` から作った `{tenga}`。' },
  { id: 'l6-08', L: 6, k: 'build', s: 'Venga conmigo, por favor.', d: ['Ven'], ja: 'わたしといっしょに来てください。' },
  { id: 'l6-09', L: 6, k: 'form', v: 'volver', p: 'usted', o: ['volva', 'vuelva', 'vuelve'], a: 1, why: '`vuelvo` の o を取って a をつけ `{vuelva}`。ue が残る。`vuelve` は tú への命令。' },
  { id: 'l6-10', L: 6, k: 'scene', sit: 'マリーナさまに「本当のことを言ってください」とお願いする', o: ['Di la verdad, por favor.', 'Diga la verdad, por favor.', 'Dice la verdad, por favor.'], a: 1, why: '`digo` の o を取って a をつけ `{diga}`。`di` は tú への命令。' },
  { id: 'l6-11', L: 6, k: 'pick', s: '[Marina], ___ el libro en la mesa.', o: ['ponga', 'pon', 'pone'], a: 0, ja: 'マリーナさま、本をテーブルに置いてください。', why: '`pongo` の o を取って a をつけ `{ponga}`。`pon` は tú への命令。' },
  { id: 'l6-12', L: 6, k: 'who', s: '{Tenga} cuidado, por favor.', a: 1, ja: 'どうぞ、気をつけてください。', why: '`tenga` は yo の形 tengo から作った usted への命令。tú なら `{ten}`。' },

  /* ================= L7 yo の形から作れない4つ・ustedes ================= */
  { id: 'l7-01', L: 7, k: 'pick', s: '[Marina], ___ por esta calle.', o: ['va', 've', 'vaya'], a: 2, ja: 'マリーナさま、この道を行ってください。', why: '`voy` は -oy で終わり、o を取る作り方が使えない。usted の `ir` は特別な形 `{vaya}`。' },
  { id: 'l7-02', L: 7, k: 'form', v: 'ir', p: 'usted', o: ['vaye', 've', 'vaya'], a: 2, why: '`voy` から作れないので、覚える形 `{vaya}`。`ve` は tú への命令。' },
  { id: 'l7-03', L: 7, k: 'scene', sit: '旅の一行に「どうぞ入ってください」と言う', o: ['Pasen, por favor.', 'Pase, por favor.', 'Pasan, por favor.'], a: 0, why: '何人もいるので usted の命令 `pase` に n をつけて `{pasen}`。`pasan` は「彼らは通る」。' },
  { id: 'l7-04', L: 7, k: 'form', v: 'comer', p: 'ustedes', o: ['comen', 'coman', 'coma'], a: 1, why: 'usted の命令 `coma` に n をつけて `{coman}`。`comen` は「彼らは食べる」。' },
  { id: 'l7-05', L: 7, k: 'who', s: '{Pasen}, por favor.', a: 3, ja: 'みなさん、どうぞお入りください。', why: '`pasen` は usted の命令 `pase` に n をつけた形。ustedes（何人も・ていねい）への命令。' },
  { id: 'l7-06', L: 7, k: 'who', s: '{Vaya} por esta calle.', a: 1, ja: 'この道を行ってください。', why: '`vaya` は usted（1人・ていねい）への命令。n がつくと `{vayan}`（ustedes）。' },
  { id: 'l7-07', L: 7, k: 'ja', s: '{Sea} amable, por favor.', o: ['親切にしてください。', '彼女は親切だ。', '親切にしないでください。'], a: 0, why: '`ser` の usted への命令は特別な形 `{sea}`。`ser amable` は「親切にする」。' },
  { id: 'l7-08', L: 7, k: 'bug', s: 'Señores, van por esta calle.', a: 'van', ok: 'Señores, vayan por esta calle.', ja: 'みなさん、この道を行ってください。', why: '`van` は「彼らは行く」。ustedes への命令は `{vaya}` に n をつけた `{vayan}`。' },
  { id: 'l7-09', L: 7, k: 'pick', s: '[Marina], ___ aquí mañana, por favor.', o: ['está', 'estás', 'esté'], a: 2, ja: 'マリーナさま、明日ここにいてください。', why: '`estoy` は -oy で終わるので、usted の `estar` は特別な形 `{esté}`。' },
  { id: 'l7-10', L: 7, k: 'scene', sit: '旅の一行に「いっしょに来てください」と言う', o: ['Vienen conmigo.', 'Vengan conmigo.', 'Venga conmigo.'], a: 1, why: 'usted の `venga` に n をつけて `{vengan}`。`vienen` は「彼らは来る」、`venga` は1人への命令。' },
  { id: 'l7-11', L: 7, k: 'pick', s: '[Marina], ___ el pan a Pepe, por favor.', o: ['da', 'dé', 'dar'], a: 1, ja: 'マリーナさま、ペペにパンをあげてください。', why: '`doy` は -oy で終わるので、usted の `dar` は特別な形 `{dé}`。アクセント記号を忘れずに。' },
  { id: 'l7-12', L: 7, k: 'build', s: 'Vayan por esta calle.', d: ['Van'], ja: 'みなさん、この道を行ってください。' },

  /* ================= L8 vosotros への命令・だれに言う？ ================= */
  { id: 'l8-01', L: 8, k: 'pick', s: '[Pepe] y [Lola], ___ con la música.', o: ['bailad', 'bailan', 'bailar'], a: 0, ja: 'ペペとロラ、音楽に合わせて踊りなさい。', why: '仲よしの2人（vosotros）には、原形 `bailar` の r を d にして `{bailad}`。`bailan` は「彼らは踊る」。' },
  { id: 'l8-02', L: 8, k: 'form', v: 'comer', p: 'vosotros', o: ['coman', 'comer', 'comed'], a: 2, why: '原形 `comer` の最後の r を d にして `{comed}`。' },
  { id: 'l8-03', L: 8, k: 'form', v: 'hablar', p: 'vosotros', o: ['habláis', 'hablan', 'hablad'], a: 2, why: '原形 `hablar` の r を d にして `{hablad}`。`habláis` は「君たちは話す」。' },
  { id: 'l8-04', L: 8, k: 'scene', sit: '音楽が始まった。村のみんな（仲よし・何人も）に「歌え！」と言う', o: ['¡Cantad!', '¡Cantan!', '¡Canta!'], a: 0, why: '何人もの仲よしには、原形 `cantar` の r を d にして `{cantad}`。`canta` は1人の tú への命令。' },
  { id: 'l8-05', L: 8, k: 'who', s: '{Comed} mucho, amigos.', a: 2, ja: 'みんな、たくさん食べなさい。', why: '`comed` は原形 `comer` の r を d にした形で、vosotros（何人も・仲よし）への命令。' },
  { id: 'l8-06', L: 8, k: 'who', s: '{Vengan} conmigo, por favor.', a: 3, ja: 'どうぞ、わたしといっしょに来てください。', why: '`vengan` は usted の命令 `venga` に n をつけた形。ustedes（何人も・ていねい）への命令。' },
  { id: 'l8-07', L: 8, k: 'who', s: '{Escucha} la música, [Pepe].', a: 0, ja: 'ペペ、音楽を聞いて。', why: '`escucha` は tú の形から s を取った命令。1人の仲よし、ペペへ。' },
  { id: 'l8-08', L: 8, k: 'who', s: '{Venga} aquí, [Marina].', a: 1, ja: 'マリーナさま、ここに来てください。', why: '`venga` は usted（1人・ていねい）への命令。目上のマリーナさまへ。' },
  { id: 'l8-09', L: 8, k: 'ja', s: '{Bailad}, amigos.', o: ['みんなは踊っている。', 'みんな、踊れ。', 'みんな、踊らないで。'], a: 1, why: '`bailad` は原形 `bailar` の r を d にした、vosotros（何人もの仲よし）への命令。' },
  { id: 'l8-10', L: 8, k: 'bug', s: 'Chicos, escuchas la música.', a: 'escuchas', ok: 'Chicos, escuchad la música.', ja: 'みんな、音楽を聞いて。', why: '何人もの仲よしには、原形 `escuchar` の r を d にして `{escuchad}`。`escuchas` は1人の tú の形。' },
  { id: 'l8-11', L: 8, k: 'build', s: 'Cantad una canción, amigos.', d: ['Cantan'], ja: 'みんな、歌を歌え。' },
  { id: 'l8-12', L: 8, k: 'build', s: 'Abrid la puerta, amigos.', d: ['Abrir'], ja: 'みんな、ドアを開けなさい。' },

  /* ================= L9 命令に lo・la・me・te・se をくっつける ================= */
  { id: 'l9-01', L: 9, k: 'pick', s: 'Aquí está el pan, [Pepe]: ___.', o: ['cómelo', 'comelo', 'lo come'], a: 0, ja: 'ここにパンがあるよ、ペペ。それを食べなさい。', why: '命令では `lo` を後ろにくっつける。強く読む「コ」に ´ をつけて `{cómelo}`。`lo come` は「彼はそれを食べる」。' },
  { id: 'l9-02', L: 9, k: 'form', v: 'levantarse', p: 'tú', o: ['te levanta', 'levantate', 'levántate'], a: 2, why: '`levanta` に `te` をくっつけ、強く読む「バ」に ´ をつけて `{levántate}`。' },
  { id: 'l9-03', L: 9, k: 'scene', sit: '日が高いのに、ペペがまだ寝ている。「起きなさい」と言う', o: ['Levantate, Pepe.', 'Levántate, Pepe.', 'Te levanta, Pepe.'], a: 1, why: '`levanta` ＋ `te`。強く読む所に ´ をつけて `{levántate}`。´ のない `levantate` はまちがい。' },
  { id: 'l9-04', L: 9, k: 'scene', sit: '女神マリーナにいすをすすめる。「どうぞ、おすわりください」と言う', o: ['Siéntate, por favor.', 'Siéntese, por favor.', 'Se siente, por favor.'], a: 1, why: 'usted への命令 `siente` に `se` をくっつけて `{siéntese}`。`siéntate` は tú への命令。' },
  { id: 'l9-05', L: 9, k: 'pick', s: '[Lola], ___ con la puerta, por favor.', o: ['ayúdame', 'ayudame', 'me ayuda'], a: 0, ja: 'ロラ、ドアを手伝って、お願い。', why: '`ayuda` に `me` をくっつけ、強く読む「ユ」に ´ をつけて `{ayúdame}`。' },
  { id: 'l9-06', L: 9, k: 'ja', s: '{Dime}, [Lola].', o: ['ロラは私に言う。', '私に言わないで、ロラ。', '私に言って、ロラ。'], a: 2, why: '`di` に `me` をくっつけた `{dime}`。短い命令は ´ は要らない。' },
  { id: 'l9-07', L: 9, k: 'bug', s: 'Pepe, comelo.', a: 'comelo', ok: 'Pepe, cómelo.', ja: 'ペペ、それを食べなさい。', why: '`come` に `lo` をくっつけると、強く読む「コ」の位置がずれる。´ をつけて `{cómelo}`。' },
  { id: 'l9-08', L: 9, k: 'build', s: 'Dime la verdad, Lola.', d: ['Di'], ja: 'ロラ、私に本当のことを言って。' },
  { id: 'l9-09', L: 9, k: 'form', v: 'leer ＋ lo', p: 'tú', o: ['leelo', 'lo lee', 'léelo'], a: 2, why: '`lee` に `lo` をくっつけ、強く読む「レ」に ´ をつけて `{léelo}`。' },
  { id: 'l9-10', L: 9, k: 'scene', sit: 'ペペに手紙（la carta）が届いた。「それを読みなさい」と言う', o: ['Léela, Pepe.', 'La lee, Pepe.', 'Leela, Pepe.'], a: 0, why: '手紙（la carta）は女性なので `la`。`lee` ＋ `la` で `{léela}`。´ を忘れずに。' },
  { id: 'l9-11', L: 9, k: 'scene', sit: 'マリーナさまにパン（el pan）をすすめる。「それを召し上がってください」と言う', o: ['Cómelo, por favor.', 'Cómalo, por favor.', 'Come lo, por favor.'], a: 1, why: 'usted への命令 `coma` に `lo` をくっつけ、´ をつけて `{cómalo}`。`cómelo` は tú への命令。' },
  { id: 'l9-12', L: 9, k: 'who', s: '{Siéntate}, [Lola].', a: 0, ja: 'すわりなさい、ロラ。', why: '`sienta` ＋ `te` で `{siéntate}`。te は tú の「自分を」なので、仲よしのロラへの命令。usted なら `{siéntese}`。' },

  /* ================= L10 「〜するな」の命令 ================= */
  { id: 'l10-01', L: 10, k: 'pick', s: '[Pepe], no ___ de la casa.', o: ['salgas', 'sales', 'salga'], a: 0, ja: 'ペペ、家から出ないで。', why: 'tú に「〜するな」は no ＋ usted の命令 `salga` ＋ s で `no {salgas}`。`sales` は「君は出る」。' },
  { id: 'l10-02', L: 10, k: 'form', v: 'hablar', p: 'no-tú', o: ['hable', 'hablas', 'hables'], a: 2, why: 'usted の命令 `hable` に s をつけて `no {hables}`。`no habla` は「彼は話さない」になる。' },
  { id: 'l10-03', L: 10, k: 'form', v: 'tener', p: 'no-tú', o: ['tenes', 'tengas', 'tienes'], a: 1, why: 'usted の命令 `tenga` に s をつけて `no {tengas}`。`no tienes` は「君は持っていない」。' },
  { id: 'l10-04', L: 10, k: 'form', v: 'salir', p: 'no-usted', o: ['sal', 'salga', 'sale'], a: 1, why: 'usted への「〜しないでください」は no ＋ usted の命令だけ。`no {salga}`。' },
  { id: 'l10-05', L: 10, k: 'scene', sit: 'ロラがこわくてふるえている。「こわがらないで」と言う', o: ['No tengas miedo, Lola.', 'No tienes miedo, Lola.', 'No ten miedo, Lola.'], a: 0, why: 'usted の命令 `tenga` に s をつけて `no {tengas}`。`no ten` とは言わない。' },
  { id: 'l10-06', L: 10, k: 'scene', sit: 'ペペがあやしい黒いパンを食べようとしている。「それを食べるな」と言う', o: ['No cómelo.', 'No comes lo.', 'No lo comas.'], a: 2, why: '「〜するな」では `lo` を動詞の前に置く。`no lo {comas}`。くっつけるのは「〜しろ」の命令のとき。' },
  { id: 'l10-07', L: 10, k: 'scene', sit: '女神マリーナがあぶない場所に入ろうとしている。「入らないでください」と言う', o: ['No pasa.', 'No pases.', 'No pase.'], a: 2, why: 'usted には no ＋ usted の命令 `{pase}` で `no {pase}`。s がつく `no pases` は tú への禁止。' },
  { id: 'l10-08', L: 10, k: 'who', s: 'No {abras} la puerta, [Pepe].', a: 0, ja: 'ペペ、ドアを開けるな。', why: '`abras` は no ＋ usted の命令 `abra` ＋ s。tú（1人・仲よし）への禁止。' },
  { id: 'l10-09', L: 10, k: 'who', s: 'No {salgan} de la casa, por favor.', a: 3, ja: 'どうぞ、家から出ないでください。', why: 'usted の命令 `salga` に n をつけた `salgan` に no をつけた形。ustedes（何人も・ていねい）への禁止。' },
  { id: 'l10-10', L: 10, k: 'ja', s: 'No {hagas} esto, [Pepe].', o: ['ペペ、これをするな。', 'ペペはこれをしない。', 'ペペ、これをして。'], a: 0, why: 'usted の命令 `haga` に s をつけた `no {hagas}` は「〜するな」。`haz` の禁止形ではない。' },
  { id: 'l10-11', L: 10, k: 'bug', s: 'Pepe, no come el pan.', a: 'come', ok: 'Pepe, no comas el pan.', ja: 'ペペ、パンを食べるな。', why: '禁止は no ＋ usted の命令 ＋ s。`no come` は「彼は食べない」の文。`no {comas}`。' },
  { id: 'l10-12', L: 10, k: 'build', s: 'No lo comas, Pepe.', d: ['cómelo'], ja: 'ペペ、それを食べちゃだめだ。' }
];
