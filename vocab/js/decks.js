/* =========================================================
 * vocab/decks.js — 端末に読み込んだ単語デッキ（参考書連動版など）
 *  デッキのデータは公開リポジトリに入れず、端末の保存領域（localStorage）にだけ置く。
 *    vocab.decks.v1      読み込んだデッキの一覧（id・タイトル・語数など）
 *    vocab.deck.<id>     デッキのデータ（JSON）
 *    vocab.<id>.v1       進み具合（core.js が使う。デッキを入れ直しても消えない）
 *  vocab.html?deck=<id> で開くと、そのデッキを使う（アプリに入っているデッキ、または端末に読み込んだデッキ）。
 * ========================================================= */
(function () {
  'use strict';
  var IDX = 'vocab.decks.v1';
  function read(k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  function write(k, v) { localStorage.setItem(k, JSON.stringify(v)); }   // 失敗（容量不足など）は呼び出し側で受ける
  var Decks = {
    list: function () { return read(IDX) || []; },
    get: function (id) { return read('vocab.deck.' + id); },
    /* 保存（同じ id なら入れかえ。進み具合は単語の id で記録しているので引き継がれる） */
    save: function (D) {
      write('vocab.deck.' + D.id, D);
      var l = Decks.list().filter(function (x) { return x.id !== D.id; });
      l.push({ id: D.id, title: D.title, brand: D.brand, sub: D.sub || '', book: D.book || '', lang: D.lang || 'es', words: D.words.length, saved: Date.now() });
      write(IDX, l);
    },
    remove: function (id, withProgress) {
      try {
        localStorage.removeItem('vocab.deck.' + id);
        if (withProgress) localStorage.removeItem('vocab.' + id + '.v1');
        write(IDX, Decks.list().filter(function (x) { return x.id !== id; }));
      } catch (e) { /* 保存領域が使えない */ }
    },
    progressKey: function (id) { return 'vocab.' + id + '.v1'; }
  };
  /* アプリに入っているデッキ（app＝アプリの言語。📚 デッキの一覧は同じ app のものだけ並べる） */
  Decks.builtin = [
    { id: 'spanish', app: 'es', brand: '¡VAMOS!', title: 'スペイン語 単語', sub: '西検 5級 → 4級', words: 78, src: 'vocab/decks/spanish/deck.js' },
    { id: 'juku-1009', app: 'en', brand: 'WORD AVENUE', title: '塾プリント10月9日', sub: 'Lesson 7', words: 47, src: 'vocab/decks/english/juku-1009.js' }
  ];
  window.VocabDecks = Decks;

  /* vocab.html だけ：?deck=<id> のデッキを読み込む（<script src="vocab/js/decks.js" data-load="1">）
   *  アプリに入っているデッキ → そのファイルを読み込む／端末に読み込んだデッキ → 保存領域から／ない → スペイン語 */
  var me = document.currentScript;
  if (!me || me.getAttribute('data-load') !== '1') return;
  var m = /[?&]deck=([a-z0-9-]+)/.exec(location.search), id = m ? m[1] : 'spanish';
  var b = Decks.builtin.filter(function (x) { return x.id === id; })[0];
  if (!b) {
    var d = Decks.get(id);
    if (d && d.words) { window.VOCAB_DECK = d; return; }
    window.VOCAB_DECK_MISSING = id;
    b = Decks.builtin[0];
  }
  var v = (me.src.match(/\?v=[^&]+/) || [''])[0];
  document.write('<script src="' + b.src + v + '"><\/script>');
})();
