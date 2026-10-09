/* =========================================================
 * vocab/conj-es.js — スペイン語の動詞の活用を作る
 *
 *  時制（西検4級の範囲）
 *    pres 直説法現在／pret 点過去／impf 線過去／fut 未来／cond 過去未来／perf 現在完了
 *    subj 接続法現在／imp 命令（tú・usted の肯定）
 *  人称 0 yo, 1 tú, 2 él・ella・usted, 3 nosotros, 4 vosotros, 5 ellos・ellas・ustedes
 *
 *  作り方：規則（語尾）＋ 動詞ごとの「くせ」（IRR）。くせの種類
 *    stem   語幹の母音が変わる 'ie'（e→ie）'ue'（o→ue, u→ue）'i'（e→i）。強く読む所だけ（nosotros・vosotros は変わらない）
 *    ir     -ir 動詞の追加の変化 'i'（e→i）'u'（o→u）：点過去の3人称、接続法の nosotros・vosotros
 *    yo     直説法現在の yo だけ不規則（tengo）。接続法は、この yo の形から作る（tenga）
 *    pretS  点過去の強変化の語幹（tuv-）。語尾は e, iste, o, imos, isteis, ieron（j の後は eron）
 *    futS   未来・過去未来の語幹（tendr-）
 *    part   過去分詞（hecho）
 *    tu     命令 tú の不規則（ten）
 *    表ごと  pres / pret / impf / subj を6つの形で直接書く（ser, ir など）
 *  つづりの決まり：-car, -gar, -zar は e の前で qu, gu, c（llegué, pague, empiece）
 * ========================================================= */
(function () {
  'use strict';
  var PRON = ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'];
  var PRON_JA = ['私は', '君は', '彼・彼女・あなたは', '私たちは', '君たちは', '彼ら・あなたたちは'];
  var REFL = ['me', 'te', 'se', 'nos', 'os', 'se'];
  var TENSES = {
    pres: { name: '直説法現在', short: '現在', mood: '直説法' },
    pret: { name: '点過去', short: '点過去', mood: '直説法' },
    impf: { name: '線過去', short: '線過去', mood: '直説法' },
    perf: { name: '現在完了', short: '現在完了', mood: '直説法' },
    fut: { name: '未来', short: '未来', mood: '直説法' },
    cond: { name: '過去未来', short: '過去未来', mood: '直説法' },
    subj: { name: '接続法現在', short: '接続法', mood: '接続法' },
    imp: { name: '命令', short: '命令', mood: '命令法' }
  };

  var END = {
    pres: { ar: ['o', 'as', 'a', 'amos', 'áis', 'an'], er: ['o', 'es', 'e', 'emos', 'éis', 'en'], ir: ['o', 'es', 'e', 'imos', 'ís', 'en'] },
    pret: { ar: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'], er: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'], ir: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'] },
    impf: { ar: ['aba', 'abas', 'aba', 'ábamos', 'abais', 'aban'], er: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'], ir: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'] },
    subj: { ar: ['e', 'es', 'e', 'emos', 'éis', 'en'], er: ['a', 'as', 'a', 'amos', 'áis', 'an'], ir: ['a', 'as', 'a', 'amos', 'áis', 'an'] }
  };
  var FUT = ['é', 'ás', 'á', 'emos', 'éis', 'án'], COND = ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'];
  var STRONG = ['e', 'iste', 'o', 'imos', 'isteis', 'ieron'];
  var HABER = ['he', 'has', 'ha', 'hemos', 'habéis', 'han'];

  var IRR = {
    ser: { pres: ['soy', 'eres', 'es', 'somos', 'sois', 'son'], pret: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
      impf: ['era', 'eras', 'era', 'éramos', 'erais', 'eran'], subj: ['sea', 'seas', 'sea', 'seamos', 'seáis', 'sean'], tu: 'sé' },
    estar: { pres: ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'], pretS: 'estuv', subj: ['esté', 'estés', 'esté', 'estemos', 'estéis', 'estén'] },
    ir: { pres: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'], pret: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
      impf: ['iba', 'ibas', 'iba', 'íbamos', 'ibais', 'iban'], subj: ['vaya', 'vayas', 'vaya', 'vayamos', 'vayáis', 'vayan'], tu: 've' },
    haber: { pres: HABER, pretS: 'hub', futS: 'habr', subj: ['haya', 'hayas', 'haya', 'hayamos', 'hayáis', 'hayan'], noImp: true },
    tener: { yo: 'tengo', stem: 'ie', pretS: 'tuv', futS: 'tendr', tu: 'ten' },
    venir: { yo: 'vengo', stem: 'ie', pretS: 'vin', futS: 'vendr', tu: 'ven' },
    hacer: { yo: 'hago', pretS: 'hic', futS: 'har', part: 'hecho', tu: 'haz' },
    poner: { yo: 'pongo', pretS: 'pus', futS: 'pondr', part: 'puesto', tu: 'pon' },
    salir: { yo: 'salgo', futS: 'saldr', tu: 'sal' },
    decir: { yo: 'digo', stem: 'i', pretS: 'dij', futS: 'dir', part: 'dicho', tu: 'di' },
    poder: { stem: 'ue', pretS: 'pud', futS: 'podr', noImp: true },
    querer: { stem: 'ie', pretS: 'quis', futS: 'querr', noImp: true },
    saber: { yo: 'sé', pretS: 'sup', futS: 'sabr', noImp: true, subj: ['sepa', 'sepas', 'sepa', 'sepamos', 'sepáis', 'sepan'] },
    dar: { pres: ['doy', 'das', 'da', 'damos', 'dais', 'dan'], pret: ['di', 'diste', 'dio', 'dimos', 'disteis', 'dieron'], subj: ['dé', 'des', 'dé', 'demos', 'deis', 'den'] },
    ver: { pres: ['veo', 'ves', 've', 'vemos', 'veis', 'ven'], pret: ['vi', 'viste', 'vio', 'vimos', 'visteis', 'vieron'],
      impf: ['veía', 'veías', 'veía', 'veíamos', 'veíais', 'veían'], subj: ['vea', 'veas', 'vea', 'veamos', 'veáis', 'vean'], part: 'visto' },
    conocer: { yo: 'conozco' },
    empezar: { stem: 'ie' }, pensar: { stem: 'ie' }, despertar: { stem: 'ie' }, cerrar: { stem: 'ie' },
    volver: { stem: 'ue', part: 'vuelto' }, recordar: { stem: 'ue' }, acostar: { stem: 'ue' }, jugar: { stem: 'ue' },
    dormir: { stem: 'ue', ir: 'u' }, pedir: { stem: 'i', ir: 'i' }, sentir: { stem: 'ie', ir: 'i' },
    escribir: { part: 'escrito' }, abrir: { part: 'abierto' }
  };

  function parse(inf) {
    var refl = /se$/.test(inf) && inf.length > 4, base = refl ? inf.slice(0, -2) : inf;
    return { inf: inf, base: base, refl: refl, cls: base.slice(-2), stem: base.slice(0, -2), x: IRR[base] || {} };
  }
  /* 語幹の最後の母音を変える */
  function change(stem, kind) {
    if (kind === 'ie') return stem.replace(/e([^aeiou]*)$/, 'ie$1');
    if (kind === 'i') return stem.replace(/e([^aeiou]*)$/, 'i$1');
    if (kind === 'ue') return stem.replace(/[ou]([^aeiou]*)$/, 'ue$1');
    if (kind === 'u') return stem.replace(/o([^aeiou]*)$/, 'u$1');
    return stem;
  }
  /* e の前のつづり（-ar 動詞）：c→qu, g→gu, z→c */
  function spell(stem, end) {
    if (!/^[eé]/.test(end)) return stem + end;
    return stem.replace(/c$/, 'qu').replace(/g$/, 'gu').replace(/z$/, 'c') + end;
  }
  var STRONG_P = [0, 1, 2, 5];   // 語幹が変わる人称（強く読む所）

  function presForm(v, p) {
    if (v.x.pres) return v.x.pres[p];
    if (p === 0 && v.x.yo) return v.x.yo;
    var st = v.x.stem && STRONG_P.indexOf(p) >= 0 ? change(v.stem, v.x.stem) : v.stem;
    return st + END.pres[v.cls][p];
  }
  function pretForm(v, p) {
    if (v.x.pret) return v.x.pret[p];
    if (v.x.pretS) {
      if (v.x.pretS === 'hic' && p === 2) return 'hizo';
      var e = STRONG[p]; if (p === 5 && /j$/.test(v.x.pretS)) e = 'eron';
      return v.x.pretS + e;
    }
    var st = v.stem;
    if (v.cls === 'ir' && v.x.ir && (p === 2 || p === 5)) st = change(st, v.x.ir);
    return v.cls === 'ar' && p === 0 ? spell(st, END.pret.ar[0]) : st + END.pret[v.cls][p];
  }
  function impfForm(v, p) { return v.x.impf ? v.x.impf[p] : v.stem + END.impf[v.cls][p]; }
  function futForm(v, p, cond) { return (v.x.futS || v.base) + (cond ? COND : FUT)[p]; }
  function part(v) {
    if (v.x.part) return v.x.part;
    return v.cls === 'ar' ? v.stem + 'ado' : v.stem + (/[aeo]$/.test(v.stem) ? 'ído' : 'ido');
  }
  /* 接続法現在：直説法現在の yo の形から作る（-ar は e、-er・-ir は a の語尾に入れかわる） */
  function subjForm(v, p) {
    if (v.x.subj) return v.x.subj[p];
    var yoStem = presForm(v, 0).replace(/o$/, '');
    var st;
    if (v.x.yo || STRONG_P.indexOf(p) >= 0) st = yoStem;
    else st = v.cls === 'ir' && v.x.ir ? change(v.stem, v.x.ir) : v.stem;
    return v.cls === 'ar' ? spell(st, END.subj.ar[p]) : st + END.subj[v.cls][p];
  }
  /* アクセント記号：語の後ろに代名詞がつく（levanta＋te）と、元の強く読む所に記号が要る */
  function stressMark(word) {
    if (/[áéíóú]/.test(word)) return word;
    var groups = [], re = /[aeiouü]+/g, m;
    while ((m = re.exec(word))) groups.push({ i: m.index, s: m[0] });
    if (groups.length < 2) return word;
    var g = /[nsaeiou]$/.test(word) ? groups[groups.length - 2] : groups[groups.length - 1];
    var k = g.s.search(/[aeo]/); if (k < 0) k = g.s.length - 1;
    var at = g.i + k, ACC = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };
    return word.slice(0, at) + ACC[word.charAt(at)] + word.slice(at + 1);
  }

  /* 1つの形（再帰動詞は代名詞つき）。imp は p=1（tú）と p=2（usted）だけ */
  function form(inf, tense, p) {
    var v = parse(inf), f;
    if (tense === 'pres') f = presForm(v, p);
    else if (tense === 'pret') f = pretForm(v, p);
    else if (tense === 'impf') f = impfForm(v, p);
    else if (tense === 'fut') f = futForm(v, p, false);
    else if (tense === 'cond') f = futForm(v, p, true);
    else if (tense === 'subj') f = subjForm(v, p);
    else if (tense === 'perf') return (v.refl ? REFL[p] + ' ' : '') + HABER[p] + ' ' + part(v);
    else if (tense === 'imp') {
      if ((p !== 1 && p !== 2) || v.x.noImp) return null;   /* 命令は tú と usted だけ（haber・poder などは練習しない） */
      f = p === 1 ? (v.x.tu || presForm(v, 2)) : subjForm(v, 2);
      return v.refl ? stressMark(f) + (p === 1 ? 'te' : 'se') : f;
    }
    return v.refl ? REFL[p] + ' ' + f : f;
  }
  function table(inf, tense) { return [0, 1, 2, 3, 4, 5].map(function (p) { return form(inf, tense, p); }); }
  /* 不規則かどうか（規則どおりの形と比べる） */
  function regularForm(inf, tense, p) {
    var v = parse(inf); v.x = {}; var save = IRR[v.base]; delete IRR[v.base];
    var f = form(inf, tense, p); if (save) IRR[v.base] = save; return f;
  }
  function kind(inf) {
    var v = parse(inf), x = v.x;
    if (x.pres) return '不規則';
    if (x.yo && x.stem) return 'yo が不規則＋語幹が変わる';
    if (x.yo) return 'yo が不規則';
    if (x.stem) return '語幹が変わる（' + (x.stem === 'ie' ? 'e→ie' : x.stem === 'i' ? 'e→i' : v.base === 'jugar' ? 'u→ue' : 'o→ue') + '）';
    return '規則（-' + v.cls + '）';
  }
  window.Conj = { form: form, table: table, parse: parse, kind: kind, regularForm: regularForm, part: function (inf) { return part(parse(inf)); },
    PRON: PRON, PRON_JA: PRON_JA, TENSES: TENSES, END: END, FUT: FUT, COND: COND, STRONG: STRONG, HABER: HABER, IRR: IRR };
})();
