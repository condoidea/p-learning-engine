/* =========================================================
 * news.js — アプリのお知らせ（中央管理）
 *
 *  すべてのアプリの入口 HTML の </body> の前に、この1行を入れておく（一度入れたら、もう触らない）
 *    <script src="news/news.js?v=2"></script>
 *  お知らせを足す・やめるときは、下の ITEMS を書きかえるだけ。各アプリのファイルは触らない。
 *  見た目のスタイルはこのファイルの中だけ（le-news- で始まる名前）なので、各アプリの CSS・JS には影響しない。
 *
 *  1件のお知らせを出す条件（ぜんぶ満たすとき）
 *   ・そのアプリでは、まだ出していない（アプリごとに1回だけ。単語アプリはデッキごと）
 *   ・お知らせ先のアプリ（url）を、まだ一度も開いていない
 *     （updated があるお知らせ＝「アップデートしたよ」は逆に、前に開いたことがあって、updated のあとにはまだ開いていない人だけ）
 *   ・exclude に入っていないアプリ（お知らせ先のアプリ自身でも出さない）
 *   ・until（あれば）の日付をすぎていない
 *   ・after（あれば）のお知らせを、この端末のどこかのアプリで、もう出している
 *   ・app（あれば）＝お知らせ先のアプリそのもの（単語アプリはデッキつき）では出さない
 *  同時に出せるのは1件だけ（ITEMS の上にあるものから）。閉じるのは「閉じる」ボタンだけ。
 *
 *  「開いたか」の記録：このファイルを読み込んだアプリは、開いたときに le.news.visited.<ファイル名> を残す
 * ========================================================= */
(function () {
  'use strict';

  /* =========================================================
   * お知らせの一覧（ここだけ書きかえる）
   *  id       お知らせの名前（記録に使う。あとから変えない）
   *  url      お知らせ先のアプリ（入口のファイル名）
   *  opened   url のほかに「開いたことがある」とみなす記録（昔の記録など）
   *  exclude  このお知らせを出さないアプリ（ファイル名）
   *  until    この日まで出す（'2026-12-31' の形。なければずっと）
 *  updated  アップデートのお知らせにする（'2026-11-04T16:00' の形）。一度も開いていない人には出さない（新しいアプリのお知らせのほうを出す）
   *  feature  アプリの中の新しいもののお知らせにする。前に開いたことがあるかどうかは見ない（url はファイル名だけ。開く先は href）
   *  href     「▶」のリンク先（なければ url）。単語アプリのデッキは 'vocab.html?deck=…'
   *  app      お知らせ先のアプリの見分け（'vocab.html#juku-1009' の形）。そのアプリでは出さない
   *  after    このお知らせ（id）を出したあとでだけ出す
   *  face     先生の絵（'molmo' ＝ モルモ先生、'push' ＝ わすれんぼう。なければ絵なし）
   *  tag / title / sub / body / go   表示する文（body は HTML）
   * ========================================================= */
  var ITEMS = [
    {
      id: 'mole',
      url: 'mole.html',
      opened: ['le.news.mole.opened', 'mole.v1'],
      exclude: ['relativo.html'],
      face: 'molmo',
      tag: 'NEW!',
      title: '新しいアプリが<br>できたよ！',
      sub: '🧪 化学基礎・物質量（モル）',
      body: 'はじめまして、モルモ先生だよ！<br>わたしとおしゃべりしながら、<b>mol（モル）</b>の基本を覚えよう。1回 3〜4分、クリアするたびに結晶が育つよ。',
      go: '▶ モル教室をのぞいてみる'
    },
    {
      id: 'mole-review',
      url: 'mole.html',
      opened: ['le.news.mole.opened', 'mole.v1'],
      updated: '2026-11-04T16:00',
      exclude: ['relativo.html', 'manda.html', 'protesto.html', 'quien.html'],
      face: 'molmo',
      tag: 'UPDATE!',
      title: 'モル教室が<br>さらに詳しくなったよ！',
      sub: '🧪 化学基礎・物質量（モル）',
      body: '「みがく」でまちがえた問題は、その場で<b>📖 要点</b>を見られるようになったよ。<br>あとで<b>🩹 おさらい</b>すると、大事なところだけ回り直して、まちがえた問題にリベンジできるの！',
      go: '▶ モル教室をひらく'
    },
    {
      id: 'vocab-push',
      url: 'vocab.html',
      href: 'vocab.html?deck=juku-1009',
      app: 'vocab.html#juku-1009',
      feature: true,
      after: 'mole-review',
      exclude: ['relativo.html', 'manda.html', 'protesto.html', 'quien.html'],
      face: 'push',
      tag: 'NEW GAME!',
      title: '英単語アプリに<br>新しいゲームができたよ！',
      sub: '🔤 WORD AVENUE・🎈 あそび場',
      body: '<b>🛡 おしかえせ！</b><br>上から「わすれんぼう」がプラカードを持っておりてくるよ。合う単語の子をタップして、体当たりでおし返そう。<br>集めた単語が 7つ になったら遊べるよ。',
      go: '▶ 英単語アプリであそぶ'
    }
  ];

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 保存できない環境 */ } }

  /* このアプリの見分け：ファイル名（単語アプリはデッキごと） */
  var file = location.pathname.split('/').pop() || 'index.html';
  var deck = /[?&]deck=([a-z0-9-]+)/.exec(location.search);
  var appKey = file + (deck ? '#' + deck[1] : '');
  var test = /[?&](e2e|sandbox)\b/.test(location.search);

  /* 開いた記録（テストのときは残さない） */
  if (!test) set('le.news.visited.' + file, String(Date.now()));
  if (test) return;

  function openedTarget(it) {
    if (get('le.news.visited.' + it.url)) return true;
    return (it.opened || []).some(function (k) { return !!get(k); });
  }
  function due(it) {
    if (it.url === file || (it.exclude || []).indexOf(file) >= 0) return false;
    if (it.until && new Date() > new Date(it.until + 'T23:59:59')) return false;
    if (it.app && it.app === appKey) return false;
    if (it.after && !seenAnywhere(it.after)) return false;
    if (get('le.news.' + it.id + '.seen.' + appKey)) return false;
    if (it.updated) return openedTarget(it) && (+get('le.news.visited.' + it.url) || 0) < new Date(it.updated).getTime();
    if (it.feature) return true;
    return !openedTarget(it);
  }
  function seenAnywhere(id) {
    var pre = 'le.news.' + id + '.seen.';
    try { for (var i = 0; i < localStorage.length; i++) if ((localStorage.key(i) || '').indexOf(pre) === 0) return true; } catch (e) { /* 読めない環境 */ }
    return false;
  }
  var item = ITEMS.filter(due)[0];
  if (!item) return;

  var CSS = [
    '.le-news-bg{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(20,30,40,.55);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);opacity:0;transition:opacity .3s}',
    '.le-news-bg.on{opacity:1}',
    '.le-news{position:relative;width:100%;max-width:360px;max-height:calc(100vh - 32px);overflow-y:auto;padding:22px 20px 18px;border-radius:26px;background:linear-gradient(170deg,#f6fffb,#eafaf4 60%,#f3edff);color:#33414d;text-align:center;',
    'font-family:"M PLUS Rounded 1c","Hiragino Maru Gothic ProN","Hiragino Sans","Yu Gothic UI","Meiryo",system-ui,sans-serif;font-size:15px;line-height:1.7;-webkit-text-size-adjust:100%;box-shadow:0 24px 60px -20px rgba(75,47,122,.6);transform:translateY(30px) scale(.9);transition:transform .45s cubic-bezier(.2,1.6,.4,1)}',
    '.le-news-bg.on .le-news{transform:none}',
    '.le-news *{box-sizing:border-box}',
    '.le-news-tag{display:inline-block;padding:2px 12px;border-radius:999px;background:#ff5fa2;color:#fff;font-size:12px;font-weight:800;letter-spacing:.08em}',
    '.le-news-face{display:block;width:96px;height:96px;margin:6px auto 0;animation:le-news-bob 2.4s ease-in-out infinite}',
    '@keyframes le-news-bob{50%{transform:translateY(-6px) rotate(-3deg)}}',
    '.le-news h2{margin:4px 0 2px;font-size:22px;font-weight:800;line-height:1.35;color:#2c3a45}',
    '.le-news-sub{margin:0 0 10px;font-size:13px;font-weight:700;color:#2fae8a}',
    '.le-news-bub{position:relative;margin:0 0 14px;padding:10px 14px;border-radius:16px;background:#fff;text-align:left;font-size:14.5px;box-shadow:0 4px 14px -8px rgba(47,174,138,.6)}',
    '.le-news-bub b{color:#e09200;white-space:nowrap}',
    '.le-news-go{display:block;width:100%;padding:13px 16px;border-radius:18px;background:linear-gradient(120deg,#2fae8a,#5fd3b0);color:#fff !important;font-weight:800;font-size:17px;text-decoration:none;box-shadow:0 5px 0 #1f8c6d}',
    '.le-news-go:active{transform:translateY(4px);box-shadow:0 1px 0 #1f8c6d}',
    '.le-news-close{display:block;margin:12px auto 0;padding:8px 22px;border:2px solid #d6e8e1;border-radius:999px;background:#fff;color:#7a8a96;font:inherit;font-weight:700;font-size:14px;cursor:pointer}',
    '.le-news-dots{position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:26px}',
    '.le-news-dots i{position:absolute;bottom:-20px;width:12px;height:12px;border-radius:50%;opacity:.55;animation:le-news-up 5s linear infinite}',
    '@keyframes le-news-up{to{transform:translateY(-560px)}}',
    '@media (prefers-reduced-motion:reduce){.le-news-face,.le-news-dots i{animation:none}}'
  ].join('');

  /* 先生の絵 */
  var FACES = {
    molmo: '<svg class="le-news-face" viewBox="0 0 100 100" aria-hidden="true">' +
      '<path d="M14 100 q2 -18 22 -20 h28 q20 2 22 20z" fill="#fff" stroke="#cfe3dc" stroke-width="2"/><path d="M36 80 l14 14 14 -14" fill="#5fd3b0" stroke="#cfe3dc" stroke-width="2"/>' +
      '<ellipse cx="20" cy="30" rx="11" ry="9" fill="#c9783f" transform="rotate(-30 20 30)"/><ellipse cx="80" cy="30" rx="11" ry="9" fill="#c9783f" transform="rotate(30 80 30)"/>' +
      '<ellipse cx="50" cy="55" rx="38" ry="31" fill="#e9a15b"/><path d="M50 26 q-9 14 -12 28 q-4 18 12 25 q16 -7 12 -25 q-3 -14 -12 -28z" fill="#fff7ec"/>' +
      '<path d="M16 37 q34 -16 68 0" stroke="#3a8dff" stroke-width="3" fill="none"/><circle cx="38" cy="31" r="7.5" fill="#bfe6ff" stroke="#3a8dff" stroke-width="2.6"/><circle cx="62" cy="31" r="7.5" fill="#bfe6ff" stroke="#3a8dff" stroke-width="2.6"/>' +
      '<path d="M30 53 q6 -8 12 0 M58 53 q6 -8 12 0" stroke="#2b1d16" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="26" cy="62" rx="6" ry="3.6" fill="#ff8fa3" opacity=".55"/><ellipse cx="74" cy="62" rx="6" ry="3.6" fill="#ff8fa3" opacity=".55"/>' +
      '<path d="M46.5 60 h7 q-3.5 5 -3.5 5 q0 0 -3.5 -5z" fill="#ff8fa3"/><path d="M43 67 q7 10 14 0 z" fill="#c2455a"/>' +
      '<path d="M84 22 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" fill="#ffd23f"/><path d="M12 30 l1.4 4 4 1.4 -4 1.4 -1.4 4 -1.4 -4 -4 -1.4 4 -1.4z" fill="#ffd23f"/></svg>',
    /* 単語アプリ「おしかえせ！」のわすれんぼう（vocab/js/ui.js の pshFoeSvg と同じ絵） */
    push: '<svg class="le-news-face" viewBox="0 0 100 80" aria-hidden="true">' +
      '<path d="M18 62 C4 62 4 42 18 40 C14 24 34 16 44 26 C50 10 74 12 76 28 C92 26 98 46 84 54 C90 66 74 70 66 64 C58 72 40 72 34 64 C28 68 20 68 18 62Z" fill="#8b7fa3" stroke="#4f4566" stroke-width="3" stroke-linejoin="round"/>' +
      '<circle cx="40" cy="44" r="5" fill="#2b2438"/><circle cx="62" cy="44" r="5" fill="#2b2438"/>' +
      '<circle cx="41.5" cy="42.5" r="1.6" fill="#fff"/><circle cx="63.5" cy="42.5" r="1.6" fill="#fff"/>' +
      '<path d="M44 55 Q51 51 58 55" fill="none" stroke="#2b2438" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M30 68 l-4 9 M46 70 l0 9 M58 70 l2 9 M72 66 l5 8" stroke="#4f4566" stroke-width="4" stroke-linecap="round"/></svg>'
  };

  function show() {
    if (document.querySelector('.le-news-bg')) return;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var dots = '', cols = ['#ff5fa2', '#ffb020', '#2bb673', '#3a8dff', '#9b5cff'];
    for (var i = 0; i < 10; i++) dots += '<i style="left:' + (5 + i * 9.5) + '%;background:' + cols[i % 5] + ';animation-delay:' + (i * 0.5) + 's;width:' + (8 + (i % 3) * 4) + 'px;height:' + (8 + (i % 3) * 4) + 'px"></i>';
    var bg = document.createElement('div');
    bg.className = 'le-news-bg';
    bg.setAttribute('role', 'dialog'); bg.setAttribute('aria-modal', 'true'); bg.setAttribute('aria-labelledby', 'le-news-title');
    bg.innerHTML = '<div class="le-news"><div class="le-news-dots">' + dots + '</div>' +
      (item.tag ? '<span class="le-news-tag">' + item.tag + '</span>' : '') + (FACES[item.face] || '') +
      '<h2 id="le-news-title">' + item.title + '</h2>' +
      (item.sub ? '<p class="le-news-sub">' + item.sub + '</p>' : '') +
      (item.body ? '<p class="le-news-bub">' + item.body + '</p>' : '') +
      '<a class="le-news-go" href="' + (item.href || item.url) + '">' + (item.go || '▶ ひらいてみる') + '</a>' +
      '<button type="button" class="le-news-close">閉じる</button></div>';
    document.body.appendChild(bg);
    /* 出した時点で、このアプリでは「出した」ことにする（アプリごとに1回だけ） */
    set('le.news.' + item.id + '.seen.' + appKey, String(Date.now()));
    requestAnimationFrame(function () { requestAnimationFrame(function () { bg.classList.add('on'); }); });
    /* 閉じるのは「閉じる」ボタンだけ */
    bg.querySelector('.le-news-close').addEventListener('click', function () {
      bg.classList.remove('on');
      setTimeout(function () { bg.remove(); st.remove(); }, 320);
    });
    /* 背景のタップは、下の画面に通さない（閉じもしない） */
    bg.addEventListener('click', function (e) { if (e.target === bg) e.stopPropagation(); });
  }
  /* アプリの画面ができてから、少し間をおいて出す */
  function later() { setTimeout(show, 900); }
  if (document.readyState === 'complete') later(); else window.addEventListener('load', later);
})();
