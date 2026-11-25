/* =========================================================
 * ¡OJALÁ! — 🖋 形の工房の動詞の表
 *
 *  { inf, ja, yo, L, ex, forms, el, nv }
 *    yo     yo の形（直説法の現在）。ふつうの動詞は、ここから接続法を作る
 *    L      この動詞が工房に出はじめる依頼（レッスン番号）
 *    ex     'oy'    yo の形が -oy の4つ（vaya・sea・esté・dé）。forms に6つの形を書く
 *           'own'   haber・saber（形をそのまま覚える）。forms に6つの形を書く
 *           'spell' -car・-gar・-zar（e の前のつづりの書きかえ）
 *    forms  6つの形（yo・tú・él・nosotros・vosotros・ellos）。書いていなければ OQ.subForms が作る
 *    el     例外の動詞の「él の形（直説法）」：まちがいの選択肢に使う
 *    nv     false なら nosotros・vosotros を出さない（ie・ue になる動詞：nosotros・vosotros だけ芯が原形にもどるので）
 *
 *  作り方は1つだけ：yo の形の o を反対の母音に（-ar は e、-er・-ir は a）＋ 人ごとのいつもの語尾。
 * ========================================================= */
window.OQ = window.OQ || {};

OQ.verbs = [
  /* L1：-ar の動詞（o → e） */
  { inf: 'hablar', ja: '話す', yo: 'hablo', L: 1 },
  { inf: 'trabajar', ja: '働く', yo: 'trabajo', L: 1 },
  { inf: 'descansar', ja: '休む', yo: 'descanso', L: 1 },
  { inf: 'regresar', ja: '帰る', yo: 'regreso', L: 1 },
  { inf: 'llamar', ja: '電話する・呼ぶ', yo: 'llamo', L: 1 },
  { inf: 'escuchar', ja: '聞く', yo: 'escucho', L: 1 },
  { inf: 'cantar', ja: '歌う', yo: 'canto', L: 1 },
  { inf: 'bailar', ja: '踊る', yo: 'bailo', L: 1 },
  { inf: 'ayudar', ja: '手伝う', yo: 'ayudo', L: 1 },
  /* L2：-er・-ir の動詞（o → a）。yo の形がクセものでも同じ */
  { inf: 'comer', ja: '食べる', yo: 'como', L: 2 },
  { inf: 'vivir', ja: '住む', yo: 'vivo', L: 2 },
  { inf: 'escribir', ja: '書く', yo: 'escribo', L: 2 },
  { inf: 'leer', ja: '読む', yo: 'leo', L: 2 },
  { inf: 'tener', ja: '持っている', yo: 'tengo', L: 2 },
  { inf: 'venir', ja: '来る', yo: 'vengo', L: 2 },
  { inf: 'hacer', ja: 'する・作る', yo: 'hago', L: 2 },
  { inf: 'decir', ja: '言う', yo: 'digo', L: 2 },
  { inf: 'salir', ja: '出る', yo: 'salgo', L: 2 },
  { inf: 'poner', ja: '置く', yo: 'pongo', L: 2 },
  { inf: 'conocer', ja: '知っている', yo: 'conozco', L: 2 },
  { inf: 'ver', ja: '見る', yo: 'veo', L: 2 },
  /* L3：例外の6つ・つづりの書きかえ・ie／ue になる動詞 */
  { inf: 'ir', ja: '行く', yo: 'voy', el: 'va', L: 3, ex: 'oy', forms: ['vaya', 'vayas', 'vaya', 'vayamos', 'vayáis', 'vayan'] },
  { inf: 'ser', ja: '〜である', yo: 'soy', el: 'es', L: 3, ex: 'oy', forms: ['sea', 'seas', 'sea', 'seamos', 'seáis', 'sean'] },
  { inf: 'estar', ja: '〜にいる・〜の状態だ', yo: 'estoy', el: 'está', L: 3, ex: 'oy', forms: ['esté', 'estés', 'esté', 'estemos', 'estéis', 'estén'] },
  { inf: 'dar', ja: 'あげる', yo: 'doy', el: 'da', L: 3, ex: 'oy', forms: ['dé', 'des', 'dé', 'demos', 'deis', 'den'] },
  { inf: 'haber', ja: '（hay で）〜がある', yo: 'he', el: 'hay', L: 3, ex: 'own', forms: ['haya', 'hayas', 'haya', 'hayamos', 'hayáis', 'hayan'] },
  { inf: 'saber', ja: '知っている・〜できる', yo: 'sé', el: 'sabe', L: 3, ex: 'own', forms: ['sepa', 'sepas', 'sepa', 'sepamos', 'sepáis', 'sepan'] },
  { inf: 'buscar', ja: 'さがす', yo: 'busco', L: 3, ex: 'spell', forms: ['busque', 'busques', 'busque', 'busquemos', 'busquéis', 'busquen'] },
  { inf: 'llegar', ja: '着く', yo: 'llego', L: 3, ex: 'spell', forms: ['llegue', 'llegues', 'llegue', 'lleguemos', 'lleguéis', 'lleguen'] },
  { inf: 'pagar', ja: '払う', yo: 'pago', L: 3, ex: 'spell', forms: ['pague', 'pagues', 'pague', 'paguemos', 'paguéis', 'paguen'] },
  { inf: 'empezar', ja: '始める', yo: 'empiezo', L: 3, ex: 'spell', nv: false, forms: ['empiece', 'empieces', 'empiece', 'empecemos', 'empecéis', 'empiecen'] },
  { inf: 'querer', ja: '愛する・ほしい', yo: 'quiero', L: 3, nv: false, forms: ['quiera', 'quieras', 'quiera', 'queramos', 'queráis', 'quieran'] },
  { inf: 'poder', ja: '〜できる', yo: 'puedo', L: 3, nv: false, forms: ['pueda', 'puedas', 'pueda', 'podamos', 'podáis', 'puedan'] },
  { inf: 'volver', ja: 'もどる', yo: 'vuelvo', L: 3, nv: false, forms: ['vuelva', 'vuelvas', 'vuelva', 'volvamos', 'volváis', 'vuelvan'] },
  /* L4〜：使い分けで出てくる動詞 */
  { inf: 'abrir', ja: '開ける', yo: 'abro', L: 4 },
  { inf: 'terminar', ja: '終える', yo: 'termino', L: 5 },
  { inf: 'necesitar', ja: '必要とする', yo: 'necesito', L: 6 },
  { inf: 'traer', ja: '持ってくる', yo: 'traigo', L: 7 }
];

/* 6つの形（yo・tú・él・nosotros・vosotros・ellos）。yo の形の o を反対の母音に ＋ 人ごとの語尾 */
OQ.subForms = function (v) {
  if (v.forms) return v.forms;
  var stem = v.yo.slice(0, -1), w = /ar$/.test(v.inf) ? 'e' : 'a', acc = w === 'e' ? 'é' : 'á';
  return [stem + w, stem + w + 's', stem + w, stem + w + 'mos', stem + acc + 'is', stem + w + 'n'];
};
