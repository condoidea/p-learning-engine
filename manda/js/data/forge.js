/* =========================================================
 * ¡MANDA! — 🔨 鍛冶場（命令の形を自分の手で作る練習）の動詞
 *
 *  MQ.forge.verbs の1つ：
 *    inf    原形            ja     意味
 *    tu     tú の現在形     yo     yo の現在形
 *    tuCmd  tú への命令（例外の8つだけ：ven ten pon sal haz di ve sé）。無ければ tu の最後の s を取る
 *    usted  usted への命令（例外・書きかえだけ）。無ければ yo の最後の o を取り、-ar は e、-er・-ir は a
 *    L      この動詞を練習に出してよい最初のレッスン番号（どの枝に出すかは app.js が MQ.map の開き具合で決める）
 *    ex     'oy'＝yo の形が -oy の4つ（usted の枝 oy4 が開くまで usted の仲間に出さない）
 *           'spell'＝e の前でつづりが変わる（枝 spell が開くまで出さない）
 *    irr    true＝nosotros・vosotros「〜するな」の形が不規則（語幹がまた変わる）→ nos・no-vos には出さない
 *    only   'usted'＝usted の枝だけに出す（アクセント記号つきで、足し算の形が変わる）
 *    noNos  true＝nosotros「〜しよう」に出さない（ir は vamos が特別）
 *    el     '-oy' の4つだけ：「彼は〜する」の形（まちがいの選択肢に使う）
 *
 *  形は app.js が規則で計算する。使う語形はすべて shared/es-words.js にあること（tests/check-manda.js が確かめる）。
 * ========================================================= */
window.MQ = window.MQ || {};
MQ.forge = {
  verbs: [
    { inf: 'hablar',  ja: '話す',     tu: 'hablas',  yo: 'hablo',   L: 1 },
    { inf: 'comer',   ja: '食べる',   tu: 'comes',   yo: 'como',    L: 1 },
    { inf: 'abrir',   ja: '開ける',   tu: 'abres',   yo: 'abro',    L: 1 },
    { inf: 'dormir',  ja: '眠る',     tu: 'duermes', yo: 'duermo',  L: 2, irr: true },
    { inf: 'cerrar',  ja: '閉める',   tu: 'cierras', yo: 'cierro',  L: 2, irr: true },
    { inf: 'volver',  ja: '戻る',     tu: 'vuelves', yo: 'vuelvo',  L: 2, irr: true },
    { inf: 'jugar',   ja: '遊ぶ',     tu: 'juegas',  yo: 'juego',   usted: 'juegue', L: 12, ex: 'spell', irr: true },
    { inf: 'venir',   ja: '来る',     tu: 'vienes',  yo: 'vengo',   tuCmd: 'ven', L: 3 },
    { inf: 'tener',   ja: '持つ',     tu: 'tienes',  yo: 'tengo',   tuCmd: 'ten', L: 3 },
    { inf: 'poner',   ja: '置く',     tu: 'pones',   yo: 'pongo',   tuCmd: 'pon', L: 3 },
    { inf: 'salir',   ja: '出る',     tu: 'sales',   yo: 'salgo',   tuCmd: 'sal', L: 3 },
    { inf: 'hacer',   ja: 'する・作る', tu: 'haces',  yo: 'hago',    tuCmd: 'haz', L: 4 },
    { inf: 'decir',   ja: '言う',     tu: 'dices',   yo: 'digo',    tuCmd: 'di',  L: 4 },
    { inf: 'ir',      ja: '行く',     tu: 'vas',     yo: 'voy',     tuCmd: 've', usted: 'vaya', el: 'va', L: 4, ex: 'oy', noNos: true },
    { inf: 'ser',     ja: '〜である', tu: 'eres',    yo: 'soy',     tuCmd: 'sé', usted: 'sea', el: 'es', L: 4, ex: 'oy' },
    { inf: 'estar',   ja: '〜にいる', tu: 'estás',   yo: 'estoy',   usted: 'esté', el: 'está', L: 7, ex: 'oy', only: 'usted' },
    { inf: 'dar',     ja: '与える',   tu: 'das',     yo: 'doy',     usted: 'dé', el: 'da', L: 7, ex: 'oy', only: 'usted' },
    { inf: 'traer',   ja: '持ってくる', tu: 'traes',  yo: 'traigo',  L: 11 },
    { inf: 'oír',     ja: '聞こえる', tu: 'oyes',    yo: 'oigo',    L: 11 },
    { inf: 'conocer', ja: '知り合う', tu: 'conoces', yo: 'conozco', L: 11 },
    { inf: 'ver',     ja: '見る',     tu: 'ves',     yo: 'veo',     L: 11 },
    { inf: 'pedir',   ja: '頼む',     tu: 'pides',   yo: 'pido',    L: 11, irr: true },
    { inf: 'repetir', ja: 'くり返す', tu: 'repites', yo: 'repito',  L: 11, irr: true },
    { inf: 'llegar',  ja: '着く',     tu: 'llegas',  yo: 'llego',   usted: 'llegue', L: 12, ex: 'spell' },
    { inf: 'tocar',   ja: 'さわる',   tu: 'tocas',   yo: 'toco',    usted: 'toque', L: 12, ex: 'spell' },
    { inf: 'empezar', ja: '始める',   tu: 'empiezas', yo: 'empiezo', usted: 'empiece', L: 12, ex: 'spell', irr: true }
  ],

  /* ---------- 形の計算（app.js・tests/check-manda.js で共通）---------- */
  /* 形のある枝（MQ.map の枝 id と同じ） */
  WHO: ['tu', 'usted', 'ustedes', 'no-tu', 'no-usted', 'nos', 'no-vos', 'vos'],
  /* usted の命令から足し算で作る枝 */
  DERIVED: ['ustedes', 'no-tu', 'no-usted', 'nos', 'no-vos'],
  /* usted の命令：例外・書きかえは usted、無ければ yo の最後の o を取り、-ar は e、-er・-ir は a */
  usted: function (v) { return v.usted || v.yo.slice(0, -1) + (/ar$/.test(v.inf) ? 'e' : 'a'); },
  /* 枝ごとの正解の形 */
  form: function (v, who) {
    var u = MQ.forge.usted(v);
    switch (who) {
      case 'tu': return v.tuCmd || v.tu.slice(0, -1);
      case 'usted': return u;
      case 'ustedes': return u + 'n';
      case 'no-usted': return 'no ' + u;
      case 'no-tu': return 'no ' + u + 's';
      case 'nos': return u + 'mos';
      case 'no-vos': return 'no ' + u.replace(/e$/, 'éis').replace(/a$/, 'áis');
      case 'vos': return v.inf.slice(0, -1) + 'd';
    }
    return '';
  },
  /* この動詞をこの枝の問題に出してよいか（形が規則で作れるか） */
  can: function (v, who) {
    if (v.only && who !== v.only) return false;
    if ((who === 'nos' || who === 'no-vos') && v.irr) return false;
    if (who === 'nos' && v.noNos) return false;
    return true;
  },
  /* その動詞をその枝に出すのに、開いていないといけない例外の枝（MQ.map の枝 id） */
  needs: function (v, who) {
    var n = [];
    if (who === 'tu') { if (v.tuCmd) n.push(/^(ven|ten|pon|sal)$/.test(v.tuCmd) ? 'tu4a' : 'tu4b'); }
    else if (who !== 'vos') { if (v.ex === 'oy') n.push('oy4'); if (v.ex === 'spell') n.push('spell'); }
    return n;
  },
  /* 出発点の手で「例外（覚えた形）」が正解になるか */
  isExc: function (v, who) {
    if (who === 'tu') return !!v.tuCmd;
    return MQ.forge.DERIVED.concat('usted').indexOf(who) >= 0 && v.ex === 'oy';
  }
};
