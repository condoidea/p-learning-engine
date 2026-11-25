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
 *    acc    強く読む i・u にアクセント記号（envío, actúo）
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
    escribir: { part: 'escrito' }, abrir: { part: 'abierto' },
    /* よく出る不規則動詞。デッキに cj がなくても正しく活用できるように（CHARLA から送った語は cj がないことがある） */
    perder: { stem: 'ie' }, entender: { stem: 'ie' }, encender: { stem: 'ie' }, defender: { stem: 'ie' },
    comenzar: { stem: 'ie' }, sentar: { stem: 'ie' }, recomendar: { stem: 'ie' }, nevar: { stem: 'ie' },
    preferir: { stem: 'ie', ir: 'i' }, mentir: { stem: 'ie', ir: 'i' }, divertir: { stem: 'ie', ir: 'i' }, arrepentir: { stem: 'ie', ir: 'i' },
    corregir: { stem: 'i', ir: 'i' }, elegir: { stem: 'i', ir: 'i' }, medir: { stem: 'i', ir: 'i' },
    servir: { stem: 'i', ir: 'i' }, repetir: { stem: 'i', ir: 'i' }, vestir: { stem: 'i', ir: 'i' },
    seguir: { stem: 'i', ir: 'i' },
    contar: { stem: 'ue' }, encontrar: { stem: 'ue' }, mostrar: { stem: 'ue' }, costar: { stem: 'ue' }, acordar: { stem: 'ue' },
    probar: { stem: 'ue' }, almorzar: { stem: 'ue' }, mover: { stem: 'ue' }, doler: { stem: 'ue' }, llover: { stem: 'ue' }, soler: { stem: 'ue' },
    devolver: { stem: 'ue', part: 'devuelto' }, morir: { stem: 'ue', ir: 'u', part: 'muerto' },
    oler: { pres: ['huelo', 'hueles', 'huele', 'olemos', 'oléis', 'huelen'], subj: ['huela', 'huelas', 'huela', 'olamos', 'oláis', 'huelan'] },
    proponer: { yo: 'propongo', pretS: 'propus', futS: 'propondr', part: 'propuesto', tu: 'propón' },
    traer: { yo: 'traigo', pretS: 'traj' }, andar: { pretS: 'anduv' },
    caer: { yo: 'caigo', pret: ['caí', 'caíste', 'cayó', 'caímos', 'caísteis', 'cayeron'] },
    leer: { pret: ['leí', 'leíste', 'leyó', 'leímos', 'leísteis', 'leyeron'] },
    construir: { pres: ['construyo', 'construyes', 'construye', 'construimos', 'construís', 'construyen'],
      pret: ['construí', 'construiste', 'construyó', 'construimos', 'construisteis', 'construyeron'],
      subj: ['construya', 'construyas', 'construya', 'construyamos', 'construyáis', 'construyan'] },
    'reír': { pres: ['río', 'ríes', 'ríe', 'reímos', 'reís', 'ríen'], pret: ['reí', 'reíste', 'rio', 'reímos', 'reísteis', 'rieron'],
      subj: ['ría', 'rías', 'ría', 'riamos', 'riais', 'rían'], futS: 'reir' },
    romper: { part: 'roto' }, cubrir: { part: 'cubierto' }, descubrir: { part: 'descubierto' }, imprimir: { part: 'impreso' },
    confesar: { stem: 'ie' }, atender: { stem: 'ie' }, extender: { stem: 'ie' }, negar: { stem: 'ie' }, fregar: { stem: 'ie' }, calentar: { stem: 'ie' },
    atravesar: { stem: 'ie' }, gobernar: { stem: 'ie' }, apretar: { stem: 'ie' }, tropezar: { stem: 'ie' }, merendar: { stem: 'ie' },
    apostar: { stem: 'ue' }, sonar: { stem: 'ue' }, soñar: { stem: 'ue' }, volar: { stem: 'ue' }, colgar: { stem: 'ue' }, rogar: { stem: 'ue' },
    morder: { stem: 'ue' }, resolver: { stem: 'ue', part: 'resuelto' }, renovar: { stem: 'ue' },
    valer: { yo: 'valgo', futS: 'valdr' },
    caber: { yo: 'quepo', pretS: 'cup', futS: 'cabr' },
    'oír': { pres: ['oigo', 'oyes', 'oye', 'oímos', 'oís', 'oyen'], pret: ['oí', 'oíste', 'oyó', 'oímos', 'oísteis', 'oyeron'],
      subj: ['oiga', 'oigas', 'oiga', 'oigamos', 'oigáis', 'oigan'], futS: 'oir' },
    'sonreír': { pres: ['sonrío', 'sonríes', 'sonríe', 'sonreímos', 'sonreís', 'sonríen'], pret: ['sonreí', 'sonreíste', 'sonrió', 'sonreímos', 'sonreísteis', 'sonrieron'],
      subj: ['sonría', 'sonrías', 'sonría', 'sonriamos', 'sonriais', 'sonrían'], futS: 'sonreir' }
  };

  function parse(inf) {
    var refl = /[aeií]rse$/.test(inf), base = refl ? inf.slice(0, -2) : inf;
    /* oír・reír のように -ír と書く動詞も -ir 動詞として扱う */
    return { inf: inf, base: base, refl: refl, cls: base.slice(-2).replace('í', 'i'), stem: base.slice(0, -2), x: IRR[base] || autoX(base) };
  }
  /* 表（IRR）にない動詞の くせ を、つづりから決める（デッキに cj がなくても正しく活用できるように）
   *  ・複合動詞（detener, componer, aprobar, conseguir…）は元の動詞と同じくせ
   *  ・母音＋-cer・-cir は yo が -zco（conocer, parecer, ofrecer）。-ducir は点過去も -duj-（traduje）
   *  ・-uir は y が入る（construyo, construyó）
   *  ・母音＋-er・-ir（leer, creer）は点過去が leí, leíste, leyó…
   *  ・ACC の動詞は 強く読む i・u にアクセント記号（envío, actúo, prohíbo） */
  var COMP = ['tener', 'poner', 'venir', 'hacer', 'traer', 'volver', 'escribir', 'cubrir', 'abrir', 'contar', 'probar', 'sentir', 'seguir', 'pedir',
    'mostrar', 'cerrar', 'mover', 'conocer', 'caer', 'vestir', 'pensar', 'salir'];
  var ACC = ['enviar', 'confiar', 'fiar', 'guiar', 'variar', 'ampliar', 'enfriar', 'desviar', 'criar', 'vaciar', 'esquiar', 'resfriar',
    'actuar', 'continuar', 'graduar', 'situar', 'evaluar', 'efectuar', 'acentuar', 'prohibir', 'reunir'];
  var AUTO = {}, NOAUTO = false;   /* NOAUTO：規則どおりの形を作るとき（regularForm）は つづりからのくせも使わない */
  function autoX(base) {
    if (NOAUTO) return {};
    if (AUTO[base]) return AUTO[base];
    var x = {}, cls = base.slice(-2).replace('í', 'i'), st = base.slice(0, -2), i;
    for (i = 0; i < COMP.length; i++) {
      var B = COMP[i];
      if (base.length > B.length && base.slice(-B.length) === B && IRR[B]) { x = prefixX(base.slice(0, -B.length), IRR[B]); break; }
    }
    if (!Object.keys(x).length) {
      if (ACC.indexOf(base) >= 0) x = { acc: true };
      else if (/[aeiou]c(er|ir)$/.test(base) && !/(hacer|decir|cocer|mecer)$/.test(base)) {
        x = { yo: st.slice(0, -1) + 'zco' };
        if (/ducir$/.test(base)) x.pretS = st.slice(0, -1) + 'j';
      } else if (/[^gq]uir$/.test(base)) {
        x = { pres: ['yo', 'yes', 'ye', 'imos', 'ís', 'yen'].map(function (e) { return st + e; }),
          pret: ['í', 'iste', 'yó', 'imos', 'isteis', 'yeron'].map(function (e) { return st + e; }),
          subj: ['ya', 'yas', 'ya', 'yamos', 'yáis', 'yan'].map(function (e) { return st + e; }) };
      } else if (cls !== 'ar' && /[aeo]$/.test(st)) {
        x = { pret: ['í', 'íste', 'yó', 'ímos', 'ísteis', 'yeron'].map(function (e) { return st + e; }) };
      }
    }
    return (AUTO[base] = x);
  }
  /* 複合動詞：元の動詞のくせの形に頭をつける（tener → detener：detengo, detuve, detendré, detén） */
  function prefixX(pre, X) {
    var x = {};
    Object.keys(X).forEach(function (k) {
      var val = X[k];
      if (Array.isArray(val)) x[k] = val.map(function (f) { return pre + f; });
      else if (typeof val === 'string' && ['yo', 'pretS', 'futS', 'part', 'tu'].indexOf(k) >= 0) {
        /* 1音節の命令（ten, pon, ven, sal）は頭がつくと記号がいる（detén, propón）。haz は deshaz のまま */
        if (k === 'tu' && /^[^aeiou]*[aeiou][ns]$/.test(val)) val = val.replace(/[aeiou]/, function (c) { return 'áéíóú'.charAt('aeiou'.indexOf(c)); });
        x[k] = pre + val;
      } else x[k] = val;
    });
    return x;
  }
  /* 語幹の最後の母音を変える */
  function change(stem, kind) {
    if (/[gq]u$/.test(stem)) return change(stem.slice(0, -1), kind) + 'u';   /* seguir：segu → sigu */
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
  /* a・o の前のつづり（-er・-ir 動詞）：g→j（protejo）、gu→g（sigo）、子音のあとの c→z（venzo） */
  function spellAO(stem, end) {
    if (!/^[aoáó]/.test(end)) return stem + end;
    if (/gu$/.test(stem)) return stem.slice(0, -1) + end;
    return stem.replace(/g$/, 'j').replace(/([^aeiou])c$/, '$1z') + end;
  }
  /* 強く読む i・u にアクセント記号（envi → enví, actu → actú, prohib → prohíb, reun → reún） */
  function accent(stem) { return stem.replace(/([iu])([^aeiou]*)$/, function (m, c, r) { return (c === 'i' ? 'í' : 'ú') + r; }); }
  var STRONG_P = [0, 1, 2, 5];   // 語幹が変わる人称（強く読む所）

  function presForm(v, p) {
    if (v.x.pres) return v.x.pres[p];
    if (p === 0 && v.x.yo) return v.x.yo;
    var strong = STRONG_P.indexOf(p) >= 0, st = v.x.stem && strong ? change(v.stem, v.x.stem) : v.stem;
    if (v.x.acc && strong) st = accent(st);
    return v.cls === 'ar' ? st + END.pres.ar[p] : spellAO(st, END.pres[v.cls][p]);
  }
  function pretForm(v, p) {
    if (v.x.pret) return v.x.pret[p];
    if (v.x.pretS) {
      if (/hic$/.test(v.x.pretS) && p === 2) return v.x.pretS.slice(0, -1) + 'zo';   /* hizo, deshizo */
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
    if (v.cls === 'ar') return spell(st, END.subj.ar[p]);
    return v.x.yo || STRONG_P.indexOf(p) >= 0 ? st + END.subj[v.cls][p] : spellAO(st, END.subj[v.cls][p]);
  }
  /* アクセント記号：語の後ろに代名詞がつく（levanta＋te）と、元の強く読む所に記号が要る */
  /* 音節の母音のまとまり：a・e・o（と記号つきの母音）は1つずつ別の音節（ca-e, tu-te-a, rí-e）。i・u は隣とくっつく（sie, ue） */
  var SYL = /[iuü]*[aeoáéíóú][iuü]*|[iuü]+/g;
  function stressMark(word) {
    if (/[áéíóú]/.test(word)) return word;
    var groups = [], re = new RegExp(SYL.source, 'g'), m;
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
      /* 1音節（dé, ve）は記号なしでつなぐ（dese, vete） */
      if (v.refl && (f.match(SYL) || []).length < 2) return f.replace(/[áéíóú]/, function (c) { return 'aeiou'.charAt('áéíóú'.indexOf(c)); }) + (p === 1 ? 'te' : 'se');
      return v.refl ? stressMark(f) + (p === 1 ? 'te' : 'se') : f;
    }
    return v.refl ? REFL[p] + ' ' + f : f;
  }
  function table(inf, tense) { return [0, 1, 2, 3, 4, 5].map(function (p) { return form(inf, tense, p); }); }
  /* 不規則かどうか（規則どおりの形と比べる） */
  function regularForm(inf, tense, p) {
    var v = parse(inf), save = IRR[v.base]; delete IRR[v.base]; NOAUTO = true;
    var f; try { f = form(inf, tense, p); } finally { NOAUTO = false; if (save) IRR[v.base] = save; }
    return f;
  }
  function kind(inf) {
    var v = parse(inf), x = v.x;
    if (x.pres) return '不規則';
    if (x.yo && x.stem) return 'yo が不規則＋語幹が変わる';
    if (x.yo) return 'yo が不規則';
    if (x.acc) return 'アクセント記号がつく（' + presForm(v, 0) + '）';
    if (x.stem) return '語幹が変わる（' + (x.stem === 'ie' ? 'e→ie' : x.stem === 'i' ? 'e→i' : v.base === 'jugar' ? 'u→ue' : 'o→ue') + '）';
    return '規則（-' + v.cls + '）';
  }
  /* デッキに書かれた動詞のくせ（単語の cj）を足す。アプリが知っているくせより、デッキの指定を優先 */
  /* デッキの指定は、アプリが知っているくせに上書きで足す（stem だけの cj で、querer の quis- や volver の vuelto が消えないように） */
  function addIrr(inf, x) {
    var v = parse(inf), m = {}, k, old = IRR[v.base] || autoX(v.base);
    for (k in old) m[k] = old[k];
    for (k in x) m[k] = x[k];
    IRR[v.base] = m;
  }
  /* くせの書き方が正しいか（チェック用） */
  var KEYS = { acc: 'b', stem: ['ie', 'ue', 'i'], ir: ['i', 'u'], yo: 's', pretS: 's', futS: 's', part: 's', tu: 's', noImp: 'b', pres: 6, pret: 6, impf: 6, subj: 6 };
  function checkIrr(x) {
    var bad = [];
    Object.keys(x).forEach(function (k) {
      var r = KEYS[k];
      if (!r) bad.push('知らない項目 ' + k);
      else if (Array.isArray(r)) { if (r.indexOf(x[k]) < 0) bad.push(k + ' は ' + r.join('/') + ' のどれか'); }
      else if (r === 6) { if (!Array.isArray(x[k]) || x[k].length !== 6) bad.push(k + ' は6つの形の配列'); }
      else if (r === 's') { if (typeof x[k] !== 'string' || !x[k]) bad.push(k + ' は文字列'); }
      else if (r === 'b') { if (typeof x[k] !== 'boolean') bad.push(k + ' は true/false'); }
    });
    return bad;
  }
  window.Conj = { form: form, addIrr: addIrr, checkIrr: checkIrr, known: function (inf) { var b = parse(inf).base; return !!IRR[b] || Object.keys(autoX(b)).length > 0; }, table: table, parse: parse, kind: kind, regularForm: regularForm, part: function (inf) { return part(parse(inf)); },
    PRON: PRON, PRON_JA: PRON_JA, TENSES: TENSES, END: END, FUT: FUT, COND: COND, STRONG: STRONG, HABER: HABER, IRR: IRR };
})();
