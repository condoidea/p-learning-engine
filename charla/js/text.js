/* =========================================================
 * charla/js/text.js — 文の切り分け・語の意味・単語アプリへの変換
 *  画面に関係しない部分。ブラウザと node（tests/check-charla.js）の両方で使う。
 * ========================================================= */
(function (root) {
  'use strict';
  var WORD = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g;

  function lower(s) { return String(s).toLowerCase(); }
  /* アクセント記号・ñ の波を外した形 */
  function bare(s) { return lower(s).normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  /* 単語アプリの id（アクセントと ñ を外す・空白は _） */
  function slug(s) { return bare(s).replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, ''); }

  /* 文を語と、語でない所（空白・記号）に分ける */
  function split(text) {
    var out = [], last = 0, m;
    WORD.lastIndex = 0;
    while ((m = WORD.exec(text))) {
      if (m.index > last) out.push({ t: 'x', s: text.slice(last, m.index) });
      out.push({ t: 'w', s: m[0], k: lower(m[0]) });
      last = m.index + m[0].length;
    }
    if (last < text.length) out.push({ t: 'x', s: text.slice(last) });
    return out;
  }

  /* 語の意味を引く辞書を作る：notes.json の words・phrases → 共通単語帳（shared/es-words.js） */
  function Dict(notes, esWords) {
    this.n = notes || {};
    this.words = this.n.words || {};
    this.names = {};
    var self = this;
    (this.n.names || []).concat(esWords && esWords.names || []).forEach(function (x) { self.names[lower(x)] = 1; });
    this.phr = (this.n.phrases || []).map(function (p) { return { p: p, ws: lower(p.t).split(/\s+/) }; })
      .sort(function (a, b) { return b.ws.length - a.ws.length; });
    this.es = {};
    (esWords && esWords.words || []).forEach(function (e) {
      if (e.pos === 'bad' || /（/.test(e.w)) return;
      [e.w].concat(e.f || []).forEach(function (f) { var k = lower(f); if (!self.es[k]) self.es[k] = e; });
    });
  }
  /* 1語の意味：{ w 見出し語, pos, g, ja, form, note, key, clue, cj, src } か null
   *  ln（セリフの番号。1から）があれば、notes の「語#番号」（そのセリフだけの意味）を先に見る。
   *  同じつづりでもセリフによって意味がちがう語のため（例 puesto：屋台／poner の過去分詞）。
   *  共通単語帳はつづりだけで引くので、文の中で合っているかは notes で確かめて上書きする */
  Dict.prototype.word = function (k, ln, occ) {
    /* 同じセリフに同じ語が2回以上あれば「語#番号.何回目」（例 había#12.2）でさらに分けられる */
    var byLine = ln && (occ && this.words[k + '#' + ln + '.' + occ] || this.words[k + '#' + ln]), g = byLine || this.words[k];
    /* そのセリフだけの意味（語#番号）は、共通単語帳の級（lv）を引き継ぐ（5級・機能語の直しで点線をふやさない） */
    if (g) return { w: g.w, pos: g.pos, g: g.g, ja: g.ja, form: g.form, note: g.note, key: !!g.key, clue: g.clue, cj: g.cj, reg: g.reg, src: 'notes', byLine: !!byLine, lv: byLine && this.es[k] ? this.es[k].lv : undefined };
    if (this.names[k]) return { name: true };
    var e = this.es[k];
    if (e) return { w: e.w, pos: e.pos, ja: e.ja, form: lower(e.w) !== k ? e.w + ' の変化した形' : '', key: false, src: 'es-words', lv: e.lv };
    return null;
  };
  /* 1つのセリフを、語・言い回し（phrases）・記号の並びにする
   *  言い回しは語の並びが一致したとき（間は空白だけ）。長いものから先に取る */
  Dict.prototype.line = function (text, ln) {
    var toks = split(text), out = [], i = 0, self = this, seen = {};
    toks.forEach(function (t) { if (t.t === 'w') { seen[t.k] = (seen[t.k] || 0) + 1; t.occ = seen[t.k]; } });
    while (i < toks.length) {
      var t = toks[i];
      if (t.t !== 'w') { out.push(t); i++; continue; }
      var hit = null;
      for (var p = 0; p < self.phr.length && !hit; p++) {
        var ws = self.phr[p].ws, j = i, n = 0, ok = true;
        while (n < ws.length) {
          if (j >= toks.length || toks[j].t !== 'w' || toks[j].k !== ws[n]) { ok = false; break; }
          n++; j++;
          if (n < ws.length) { if (j < toks.length && toks[j].t === 'x' && /^\s+$/.test(toks[j].s)) j++; else { ok = false; break; } }
        }
        if (ok) hit = { ph: self.phr[p].p, end: j };
      }
      if (hit) {
        var inner = toks.slice(i, hit.end).map(function (x) { return x.t === 'w' ? { t: 'w', s: x.s, k: x.k, occ: x.occ, g: self.word(x.k, ln, x.occ) } : x; });
        out.push({ t: 'ph', ph: hit.ph, s: toks.slice(i, hit.end).map(function (x) { return x.s; }).join(''), toks: inner });
        i = hit.end;
      } else {
        out.push({ t: 'w', s: t.s, k: t.k, occ: t.occ, g: self.word(t.k, ln, t.occ) });
        i++;
      }
    }
    return out;
  };

  /* ---------- 単語アプリ（¡VAMOS!）のデッキの1語にする ----------
   *  rec：調べた記録 { kind:'w'|'p', w, pos, g, ja, surf, line, note, form, clue, cj }
   *  dlg：dialog.json、notes：notes.json。返り値 { word } または { why：送れない理由 } */
  var POS_OK = { n: 'n', v: 'v', adj: 'adj', adv: 'adv', phr: 'phr' };
  function toVocab(rec, dlg, notes) {
    var line = dlg.lines[rec.line], lineJa = line && line.ja || notes.lines && notes.lines[rec.line] && notes.lines[rec.line].ja;
    if (!line) return { why: 'セリフが見つからない' };
    var pos = rec.kind === 'p' ? 'phr' : (POS_OK[rec.pos] || 'phr');
    if (pos === 'n' && !rec.g) return { why: '名詞の性が分からない' };
    var at = line.text.toLowerCase().indexOf(String(rec.surf).toLowerCase());
    if (at < 0) return { why: '例文の中に見つからない' };
    var ex = line.text.slice(0, at) + '{' + line.text.slice(at, at + rec.surf.length) + '}' + line.text.slice(at + rec.surf.length);
    var w = { id: slug(rec.w), s: dlg.id, ref: 'セリフ' + (rec.line + 1), w: rec.w, pos: pos, ja: rec.ja,
      ex: [ex, lineJa || ''], clue: rec.clue || { t: 'ctx', text: notes.sceneJa || '💬 会話の一場面' } };
    if (pos === 'n') w.g = rec.g;
    if (pos === 'v' && rec.cj) w.cj = rec.cj;
    if (pos === 'v' && !rec.cj && rec.reg) w.reg = true;   /* 規則動詞と確かめた印（notes.json の reg） */
    var memo = [rec.note, rec.kind === 'w' && rec.form && rec.surf.toLowerCase() !== rec.w.toLowerCase() ? '会話では ' + rec.surf + '（' + rec.form + '）' : '',
      rec.kind === 'p' && rec.surf.toLowerCase() !== rec.w.toLowerCase() ? '会話では ' + rec.surf : ''].filter(Boolean).join('。');
    if (memo) w.memo = memo;
    if (!w.ex[1]) return { why: 'セリフの訳がない' };
    return { word: w };
  }

  /* ---------- 学習用の解説（guide.md）を読む ----------
   *  「## 第N話 …」ごとに分け、その中を「### 見出し」ごとに分ける。
   *  ### 本文 の表（| # | 話者 | Español | 日本語 |）はセリフの行に：# が空の行は「（少し間）」などのト書き。
   *  Español の頭の ★ は「くり返し練習したいセリフ」。
   *  返り値 { intro：最初の「## 第」より前（シリーズの説明）, eps：{ N：{ head, title, top：### より前, secs：[{ h, md }], rows } }, extra：[{ h, md }]（付録など） } */
  function parseGuide(md) {
    md = String(md).replace(/\r\n?/g, '\n');
    var parts = md.split(/\n(?=## )/), G = { intro: '', eps: {}, extra: [] };
    parts.forEach(function (p, k) {
      /* 「## 第N話」（シリーズ）か「## 会話N」（レッスンの解説） */
      var m = /^## +(?:第(\d+)話|会話(\d+))[ 　]*(.*)/.exec(p);
      if (m) m = [m[0], m[1] || m[2], m[3]];
      if (!m) {
        /* 最初の「第N話」より前はシリーズの説明（intro）、あとは付録など（extra） */
        if (!Object.keys(G.eps).length) G.intro += (G.intro ? '\n' : '') + p.replace(/\n---\s*$/, '');
        else G.extra.push({ h: p.split('\n')[0].replace(/^## +/, ''), md: p.split('\n').slice(1).join('\n').replace(/\n---\s*$/, '') });
        return;
      }
      var body = p.split('\n').slice(1).join('\n').replace(/\n---\s*$/, '');
      var subs = body.split(/\n(?=### )/), ep = { head: m[2], top: '', secs: [], rows: [] };
      subs.forEach(function (s, j) {
        if (j === 0 && !/^### /.test(s)) { ep.top = s; return; }
        var h = s.split('\n')[0].replace(/^### +/, ''), b = s.split('\n').slice(1).join('\n').replace(/\n---\s*$/, '');
        if (/^本文/.test(h)) { ep.rows = tableRows(b); return; }
        ep.secs.push({ h: h, md: b });
      });
      G.eps[+m[1]] = ep;
    });
    return G;
  }
  /* 本文の表の行 → { no（1から。ト書きは null）, sp, es, ja, star } */
  function tableRows(b) {
    var out = [];
    b.split('\n').forEach(function (ln) {
      if (!/^\s*\|/.test(ln) || /^\s*\|\s*-/.test(ln)) return;
      var c = ln.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(function (x) { return x.trim(); });
      if (c[0] === '#') return;
      /* # の欄に「1 ★」「4 ＋★」のような記号がつくこともある（レッスンの解説。★＝くり返したい、＋＝元のテキストにない追加） */
      var es = c[2] || '', n = /^(\d+)/.exec(c[0] || ''), star = /^★/.test(es) || /★/.test(c[0] || '');
      out.push({ no: n ? +n[1] : null, sp: c[1] || '', es: es.replace(/^★\s*/, ''), ja: c[3] || '', star: star });
    });
    return out;
  }

  /* ---------- 小さな Markdown（解説の表示用）：見出し・表・箇条書き・太字・コード・区切り線・段落 ---------- */
  function escH(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function inline(s) {
    return escH(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/★/g, '<span class="star">★</span>');
  }
  function mdToHtml(md) {
    var L = String(md || '').replace(/\r\n?/g, '\n').split('\n'), out = [], i = 0;
    while (i < L.length) {
      var ln = L[i];
      if (!ln.trim()) { i++; continue; }
      var h = /^(#{1,6}) +(.*)/.exec(ln);
      if (h) { var lv = Math.min(6, h[1].length + 1); out.push('<h' + lv + '>' + inline(h[2]) + '</h' + lv + '>'); i++; continue; }
      if (/^---+\s*$/.test(ln)) { out.push('<hr>'); i++; continue; }
      if (/^\s*\|/.test(ln)) {
        var rows = [];
        while (i < L.length && /^\s*\|/.test(L[i])) { rows.push(L[i]); i++; }
        var cells = rows.filter(function (r) { return !/^\s*\|[\s:|-]+\|?\s*$/.test(r); }).map(function (r) { return r.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(function (x) { return x.trim(); }); });
        var head = rows.length > 1 && /^\s*\|[\s:|-]+\|?\s*$/.test(rows[1]) ? cells.shift() : null;
        out.push('<div class="tbl"><table>' + (head ? '<thead><tr>' + head.map(function (c) { return '<th>' + inline(c) + '</th>'; }).join('') + '</tr></thead>' : '') +
          '<tbody>' + cells.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + inline(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>');
        continue;
      }
      if (/^\s*([-*]|\d+\.) +/.test(ln)) {
        var ol = /^\s*\d+\./.test(ln), items = [];
        while (i < L.length && /^\s*([-*]|\d+\.) +/.test(L[i])) { items.push(L[i].replace(/^\s*([-*]|\d+\.) +/, '')); i++; }
        out.push((ol ? '<ol>' : '<ul>') + items.map(function (t) { return '<li>' + inline(t) + '</li>'; }).join('') + (ol ? '</ol>' : '</ul>'));
        continue;
      }
      var para = [];
      while (i < L.length && L[i].trim() && !/^(#{1,6} |---+\s*$|\s*\||\s*([-*]|\d+\.) +)/.test(L[i])) { para.push(L[i]); i++; }
      out.push('<p>' + para.map(inline).join('<br>') + '</p>');
    }
    return out.join('\n');
  }

  /* ---------- 文法ノートを項目に分け、本文のセリフと結びつける ----------
   *  文法ノートは「**見出し**」の行ごとに1項目（その下の表・文が中身）。
   *  表の「本文の例」などの列（説明の列は除く）と、文中の **太字** のスペイン語を手がかりに、
   *  そのスペイン語を含むセリフを探す。返り値の topics[k].rows は表の行（項目の中で上から 0,1,2…）ごとの手がかり */
  var LAT = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]*[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g;
  var EXPL = /分解|ポイント|働き|意味|推量の対象|種類|時制|説明/;
  function norm(s) { return ' ' + lower(s).replace(/[^a-záéíóúüñ]+/g, ' ').trim() + ' '; }
  function fragsOf(cell) {
    var out = [], c = String(cell).replace(/（[^）]*）|\([^)]*\)/g, ' ');
    (c.replace(/\*\*/g, '').split(/[\/／|…«»]/)).forEach(function (seg) { (seg.match(LAT) || []).forEach(function (x) { out.push(x); }); });
    (c.match(/\*\*([^*]+)\*\*/g) || []).forEach(function (b) { (b.replace(/\*\*/g, '').match(LAT) || []).forEach(function (x) { out.push(x); }); });
    return out.map(norm).filter(function (x, i, a) { return x.trim().length >= 4 && a.indexOf(x) === i; });
  }
  function grammarTopics(ep) {
    var topics = [];
    (ep && ep.secs || []).forEach(function (sec) {
      if (!/^文法/.test(sec.h)) return;
      var cur = null, head = null;
      sec.md.split('\n').forEach(function (ln) {
        var m = /^\*\*([^*]+)\*\*\s*(?:[：:]\s*(.*))?$/.exec(ln.trim());
        if (m) { cur = { h: m[1], md: m[2] ? m[2] + '\n' : '', rows: [], para: [] }; topics.push(cur); head = null; if (m[2]) cur.para = cur.para.concat(boldFrags(m[2])); return; }
        if (!cur) return;
        cur.md += ln + '\n';
        if (/^\s*\|/.test(ln)) {
          if (/^\s*\|[\s:|-]+\|?\s*$/.test(ln)) return;
          var cells = ln.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|');
          if (!head) { head = cells.map(function (x) { return EXPL.test(x); }); return; }
          var f = [];
          cells.forEach(function (x, j) { if (!head[j]) f = f.concat(fragsOf(x)); });
          cur.rows.push(f);
        } else { head = null; cur.para = cur.para.concat(boldFrags(ln)); }
      });
    });
    return topics;
  }
  function boldFrags(s) { var out = []; (String(s).match(/\*\*([^*]+)\*\*/g) || []).forEach(function (b) { out = out.concat(fragsOf(b)); }); return out; }
  /* セリフ i → [{ t：項目の番号, rows：当たった表の行 }] */
  function linkGrammar(topics, lines) {
    var map = {};
    lines.forEach(function (l, i) {
      var t = norm(l.text), hits = [];
      topics.forEach(function (tp, k) {
        var rows = [];
        tp.rows.forEach(function (f, r) { if (f.some(function (x) { return t.indexOf(x) >= 0; })) rows.push(r); });
        var para = tp.para.some(function (x) { return t.indexOf(x) >= 0; });
        if (rows.length || para) hits.push({ t: k, rows: rows });
      });
      if (hits.length) map[i] = hits;
    });
    return map;
  }

  var api = { split: split, Dict: Dict, bare: bare, slug: slug, toVocab: toVocab, parseGuide: parseGuide, mdToHtml: mdToHtml, grammarTopics: grammarTopics, linkGrammar: linkGrammar };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.CharlaText = api;
})(typeof window !== 'undefined' ? window : this);
