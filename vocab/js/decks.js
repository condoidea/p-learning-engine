/* =========================================================
 * vocab/decks.js — 端末に読み込んだ単語デッキ（参考書連動版など）
 *  デッキのデータは公開リポジトリに入れず、端末の保存領域（localStorage）にだけ置く。
 *    vocab.decks.v1      読み込んだデッキの一覧（id・タイトル・語数など）
 *    vocab.deck.<id>     デッキのデータ（JSON）
 *    vocab.<id>.v1       進み具合（core.js が使う。デッキを入れ直しても消えない）
 *  vocab.html?deck=<id> で開くと、そのデッキを使う（なければアプリに入っているデッキ）。
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
      l.push({ id: D.id, title: D.title, brand: D.brand, sub: D.sub || '', book: D.book || '', words: D.words.length, saved: Date.now() });
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
  window.VocabDecks = Decks;

  /* ?deck=<id> なら、端末のデッキに差しかえる */
  var m = /[?&]deck=([a-z0-9-]+)/.exec(location.search);
  if (m) {
    var d = Decks.get(m[1]);
    if (d && d.words) window.VOCAB_DECK = d;
    else window.VOCAB_DECK_MISSING = m[1];
  }
})();
