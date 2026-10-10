/* =========================================================
 * template.js — アプリ画面の骨組み（全コース共通）
 *  {{名前}} は boot.js がコース設定（COURSE）の値で置き換える。
 * ========================================================= */
window.LE_TEMPLATE = `
<canvas id="bg3d"></canvas>
<div id="scanlines"></div>
<div id="flash"></div>
<canvas id="fxcanvas"></canvas>

<div id="app">
  <header id="topbar">
    <button class="brand" data-go="home" aria-label="ホームへ">
      <span class="brand-mark">{{brand0}}</span><span class="brand-rush">{{brand1}}</span>
    </button>
    <div class="tb-stats">
      <div class="tb-streak" id="tbStreak" title="連続学習日数（全コース共通）">
        <span class="flame">🔥</span><b id="tbStreakNum">0</b>
      </div>
      <div class="tb-level" title="レベル（全コース共通）">
        <div class="lv-badge"><small>LV</small><b id="tbLevel">1</b></div>
        <div class="xpbar"><i id="tbXpFill"></i><span id="tbXpText">0 / 100</span></div>
      </div>
    </div>
  </header>

  <main id="screens">
    <section class="screen active" id="scr-home">
      <div class="home-grid">
        <div class="hero glass">
          <div class="hero-head">
            <p class="eyebrow" id="heroTitle"></p>
            <h1 class="hero-greet" id="heroGreet"></h1>
          </div>
          <div class="hero-main">
            <div class="ring-wrap">
              <svg viewBox="0 0 120 120" class="goal-ring">
                <defs>
                  <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="var(--accent)"/>
                    <stop offset="1" stop-color="var(--accent2)"/>
                  </linearGradient>
                </defs>
                <circle cx="60" cy="60" r="52" class="ring-bg"/>
                <circle cx="60" cy="60" r="52" class="ring-fg" id="goalRing"/>
              </svg>
              <div class="ring-center">
                <b id="goalNum">0</b><small id="goalDen">/ 20</small>
                <span>今日の学習量</span>
              </div>
            </div>
            <div class="hero-cta">
              <button class="btn-mega" id="btnLearn">
                <span class="mega-label">{{t:learn}}</span>
                <span class="mega-sub" id="learnSub">次のレッスン</span>
              </button>
              <button class="btn-mega alt" id="btnStart">
                <span class="mega-label">{{t:review}}</span>
                <span class="mega-sub" id="startSub">学んだ範囲の復習・演習</span>
              </button>
              <button class="btn-mega boss-call" id="btnBoss" hidden>
                <span class="mega-label"><span id="bossIco">👾</span> {{t:bossEn}}</span>
                <span class="mega-sub" id="bossSub">ボスが出現！</span>
              </button>
              <div class="chips">
                <span class="chip"><i class="dot due"></i>復習 <b id="dueCount">0</b></span>
                <span class="chip"><i class="dot new"></i>新規 <b id="newCount">0</b></span>
                <span class="chip chip-card" data-go="learn" title="まだ開いていない{{t:card}}">📇 NEW{{t:cardShort}} <b id="unreadCount">0</b></span>
                <span class="chip" id="freezeChip" title="ストリークフリーズ：1日休んでも連続記録が守られる">🧊 <b id="freezeCount">0</b></span>
              </div>
              <button class="btn-ghost" id="btnQuick">⚡ やる気ゼロの日用：3問だけ</button>
            </div>
          </div>
        </div>

        <div class="card glass quests">
          <div class="card-head"><h2>DAILY QUEST</h2><span class="sub" id="questReset">0時にリセット</span></div>
          <ul id="questList"></ul>
        </div>

        <div class="card glass predict">
          <div class="card-head"><h2>{{predictTitle}}</h2><span class="sub" id="examCountdown"></span></div>
          <div id="meters"></div>
          <p class="note">{{predictNote}}</p>
        </div>

        <div class="card glass curve">
          <div class="card-head"><h2>忘却曲線モニター</h2><span class="sub">このまま放置した場合の記憶保持率</span></div>
          <svg id="curveSvg" viewBox="0 0 400 170" preserveAspectRatio="none"></svg>
          <div class="curve-legend">
            <span><i class="lg you"></i>あなたの記憶（予測）</span>
            <span><i class="lg ebb"></i>エビングハウス（復習なし）</span>
          </div>
        </div>

        <div class="card glass modes">
          <div class="card-head"><h2>MODE</h2></div>
          <div class="mode-grid">
            <button class="mode" data-mode="weak"><span class="m-ico">🎯</span><b>弱点狙い撃ち</b><small>間違えた問題を集中攻撃</small></button>
            <button class="mode" data-mode="focus" id="modeFocus"><span class="m-ico">{{focusIcon}}</span><b>{{focusLabel}}</b><small>{{focusDesc}}</small></button>
            <button class="mode" data-mode="mock" id="modeMock"><span class="m-ico">📝</span><b>{{mockLabel}}</b><small>{{mockDesc}}</small></button>
            <button class="mode" data-go="learn"><span class="m-ico">🗺</span><b>{{t:roadmap}}</b><small>レッスンで理解 → {{t:cardShort}}を集めて進化</small></button>
          </div>
        </div>
      </div>
    </section>

    <section class="screen" id="scr-quiz">
      <div class="quiz-top">
        <button class="icon-btn" id="btnQuit" aria-label="中断">✕</button>
        <div class="pips" id="pips"></div>
        <div class="combo" id="combo"><b id="comboNum">0</b><span>COMBO</span></div>
      </div>
      <div class="boss" id="bossPanel" hidden>
        <span class="boss-ico" id="bossIco">👾</span>
        <div class="boss-info"><div class="boss-top"><b id="bossName"></b><span id="bossNum"></span></div><div class="boss-hp"><i id="bossHp"></i></div><span class="boss-taunt" id="bossTaunt"></span></div>
      </div>
      <div class="qcard glass" id="qcard">
        <div class="q-meta">
          <span class="tag" id="qField">分野</span>
          <button class="tag lesson-tag" id="qLesson" title="この問題を学んだレッスンの{{t:card}}を開く"></button>
          <span class="tag badge" id="qBadge">NEW</span>
          <span class="q-timer"><i id="qTimer"></i></span>
        </div>
        <p class="q-text" id="qText"></p>
        <pre class="q-code" id="qCode"></pre>
        <div class="choices" id="choices"></div>
        <div class="feedback" id="feedback">
          <div class="fb-head">
            <span class="fb-verdict" id="fbVerdict">正解！</span>
            <span class="fb-next" id="fbNext"></span>
          </div>
          <div class="mem" id="fbMem"></div>
          <p class="fb-exp" id="fbExp"></p>
          <div class="fb-btns">
            <button class="btn-next" id="btnNext">次へ <kbd>Enter</kbd></button>
            <button class="btn-ghost" id="btnCard">📇 {{t:card}}を見る <kbd>C</kbd></button>
          </div>
        </div>
      </div>
      <p class="hint-keys">キーボード：<kbd>1</kbd>〜<kbd>4</kbd> で回答 ／ <kbd>Enter</kbd> で次へ</p>
    </section>

    <section class="screen" id="scr-result">
      <div class="result-wrap">
        <p class="eyebrow" id="resMode">SET CLEAR</p>
        <h1 class="res-title" id="resTitle">SET CLEAR!</h1>
        <div class="res-stats">
          <div class="rs"><small>正答</small><b id="resCorrect">0</b><span id="resTotal">/10</span></div>
          <div class="rs"><small>獲得XP</small><b id="resXp">0</b></div>
          <div class="rs"><small>最大コンボ</small><b id="resCombo">0</b></div>
        </div>
        <div class="mock-score" id="mockScore"></div>
        <div class="evo-area" id="evoArea"></div>
        <div class="chest-area" id="chestArea">
          <div class="chest-rays"></div>
          <button class="chest" id="chest" aria-label="宝箱を開ける">
            <span class="chest-lid"></span><span class="chest-body"></span><span class="chest-lock">?</span>
          </button>
          <p class="chest-hint" id="chestHint">TAP TO OPEN</p>
          <div class="loot" id="loot"></div>
        </div>
        <p class="res-msg" id="resMsg"></p>
        <div class="res-actions">
          <button class="btn-primary" id="btnAgain">もう1セット</button>
          <button class="btn-ghost" data-go="home">ホームへ</button>
        </div>
      </div>
    </section>

    <section class="screen" id="scr-learn">
      <div class="seg" id="learnTabs"><button class="on" data-tab="road">🗺 {{t:roadmap}}</button><button data-tab="dex">📇 {{t:dex}}</button></div>
      <div id="tab-road">
        <div class="rm-head glass">
          <div class="dex-rate">
            <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="ring-bg"/><circle cx="60" cy="60" r="52" class="ring-fg" id="rmRing"/></svg>
            <div class="ring-center"><b id="rmDone">0</b><small>/ <span id="rmTotal">0</span> レッスン</small></div>
          </div>
          <div class="dex-info">
            <p class="eyebrow">{{rmEyebrow}}</p>
            <h1>{{rmTitle}}</h1>
            <p class="dex-desc">{{rmDesc}}</p>
            <div class="dex-tiers"><span class="dt">次：<b id="rmNext"></b></span><span class="dt">解放済みの問題 <b id="rmLearned">0</b>問</span></div>
          </div>
        </div>
        <div id="roadmap"></div>
      </div>
      <div id="tab-dex" hidden>
        <div class="dex-head glass">
          <div class="dex-rate">
            <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="ring-bg"/><circle cx="60" cy="60" r="52" class="ring-fg" id="dexRing"/></svg>
            <div class="ring-center"><b id="dexPct">0</b><small>% 収集</small></div>
          </div>
          <div class="dex-info">
            <p class="eyebrow">{{t:dexEn}}</p>
            <h1>{{t:dex}}</h1>
            <p class="dex-desc">レッスンを1つクリアするごとに1枚入手。表にレッスンのまとめ、裏に＋α補足とひっかけ。その範囲の問題をマスターするほど <span class="t-bronze">ブロンズ</span> → <span class="t-silver">シルバー</span> → <span class="t-gold">ゴールド</span> → <span class="t-holo">ホロ</span> に進化する。</p>
            <div class="dex-tiers" id="dexTiers"></div>
          </div>
        </div>
        <div id="deckList"></div>
      </div>
    </section>

    <section class="screen" id="scr-lesson">
      <div class="ls-top">
        <button class="icon-btn" id="lsClose" aria-label="レッスンを中断">✕</button>
        <div class="ls-prog"><i id="lsBar"></i></div>
        <span class="ls-count" id="lsCount"></span>
        <div class="ls-xp">+<b id="lsXp">0</b><small>XP</small></div>
      </div>
      <div class="ls-combo" id="lsCombo"></div>
      <div class="ls-stage" id="lsStage"></div>
      <div class="ls-foot">
        <div class="ls-fb" id="lsFb"></div>
        <button class="ls-go" id="lsGo" disabled>つづける</button>
      </div>
    </section>

    <section class="screen" id="scr-fields">
      <div class="page-head"><h1>分野マップ</h1><p>マスター度＝覚えている問題の割合（記憶保持率を加味）。タップでその分野を特訓。</p></div>
      <div id="fieldList"></div>
    </section>

    <section class="screen" id="scr-ach">
      <div class="page-head"><h1>実績・コレクション</h1><p id="achSummary"></p></div>
      <h2 class="sec-title">テーマカラー</h2>
      <div class="theme-grid" id="themeGrid"></div>
      <h2 class="sec-title">称号</h2>
      <div class="title-list" id="titleList"></div>
      <h2 class="sec-title">実績</h2>
      <div class="ach-grid" id="achGrid"></div>
      <h2 class="sec-title">学習ヒートマップ</h2>
      <div class="heat" id="heat"></div>
    </section>

    <section class="screen" id="scr-settings">
      <div class="page-head"><h1>設定</h1></div>
      <div class="card glass settings">
        <label class="set-row"><span>{{examDateLabel}}<small>カウントダウンと復習間隔の上限に使います</small></span><input type="date" id="setExam"></label>
        <label class="set-row"><span>1日のノルマ<small>ホームのリングの目標値（問題1問・レッスン1ステップ＝1）</small></span><input type="number" id="setGoal" min="5" max="200" step="5"></label>
        <label class="set-row"><span>1日の新規問題数<small>多すぎると後日の復習が溜まります（推奨10〜20）</small></span><input type="number" id="setNew" min="0" max="100" step="1"></label>
        <label class="set-row"><span>1セットの問題数</span><input type="number" id="setSize" min="3" max="30" step="1"></label>
        <label class="set-row"><span>サウンド・振動</span><input type="checkbox" id="setSound" class="toggle"></label>
        <label class="set-row"><span>未学習の範囲も出題する<small>オフ推奨。オンにするとレッスン前の問題も復習・演習に混ざります（経験者向け）</small></span><input type="checkbox" id="setAllQ" class="toggle"></label>
        <label class="set-row"><span>軽量モード<small>3D演出・ブルームを抑えます（低スペック端末向け）</small></span><input type="checkbox" id="setLite" class="toggle"></label>
        <div class="set-row"><span>データのバックアップ<small>ブラウザのデータを消すと進捗も消えます</small></span>
          <div class="set-btns"><button class="btn-ghost sm" id="btnExport">書き出し</button><button class="btn-ghost sm" id="btnImport">読み込み</button><input type="file" id="importFile" accept="application/json" hidden></div>
        </div>
        <div class="set-row"><span>このコースの進捗をリセット<small>レベル・ストリーク（全コース共通）は残ります</small></span><button class="btn-danger sm" id="btnReset">リセット</button></div>
        <div class="set-row"><span>コース選択へ<small>他の科目に切り替える</small></span><a class="btn-ghost sm" href="index.html">コース一覧</a></div>
      </div>
      <div class="card glass about">
        <h2>このアプリの学習理論</h2>
        <ul>
          <li><b>わかるまで教える</b>：たとえ話と図 → 用語 → 体験 → 確認問題 → 例題 → 自力で解く、の順で1画面1アイデアずつ。</li>
          <li><b>学んだ範囲だけ出題</b>：レッスンを終えた範囲の問題だけが復習・演習に出ます（習熟学習）。</li>
          <li><b>間隔反復（忘却曲線）</b>：忘れかけたタイミングで出題。正解するほど次の間隔が伸びます。</li>
          <li><b>想起練習（テスト効果）</b>：読むより「思い出す」ほうが記憶に残ります。</li>
          <li><b>インターリービング</b>：分野を混ぜて出題し（{{t:boss}}戦など）、問題の見分け方まで鍛えます。</li>
          <li><b>小さな習慣</b>：1日3問でもストリーク継続。ノルマ達成後は「休むのも戦略」。</li>
        </ul>
      </div>
    </section>
  </main>

  <nav id="tabbar">
    <button data-go="home" class="on"><span>⌂</span>ホーム</button>
    <button data-go="learn"><span>📖</span>講義</button>
    <button data-go="fields"><span>◈</span>分野</button>
    <button data-go="ach"><span>★</span>実績</button>
    <button data-go="settings"><span>⚙</span>設定</button>
  </nav>
</div>

<div id="overlay-levelup" class="overlay">
  <div class="lu-rays"></div>
  <div class="lu-inner">
    <p class="lu-small">LEVEL UP</p>
    <div class="lu-num"><span id="luFrom">1</span><i>→</i><b id="luTo">2</b></div>
    <p class="lu-title" id="luTitle"></p>
    <p class="lu-unlock" id="luUnlock"></p>
    <button class="btn-primary" id="luClose">OK!</button>
  </div>
</div>
<div id="overlay-login" class="overlay">
  <div class="lu-inner">
    <p class="lu-small">LOGIN BONUS</p>
    <div class="login-flame">🔥</div>
    <div class="lu-num"><b id="loginStreak">1</b><i>日連続</i></div>
    <p class="lu-title" id="loginMsg"></p>
    <button class="btn-primary" id="loginClose">今日もやる</button>
  </div>
</div>
<div id="overlay-deck" class="overlay">
  <div class="deck-top">
    <div class="deck-title" id="deckTitle"></div>
    <button class="icon-btn" id="deckClose" aria-label="閉じる">✕</button>
  </div>
  <div class="deck-stage" id="deckStage"><div class="kcard" id="kcard"></div></div>
  <div class="deck-nav" id="deckNav">
    <button class="icon-btn" id="deckPrev" aria-label="前のカード">◀</button>
    <button class="icon-btn" id="deckNext" aria-label="次のカード">▶</button>
  </div>
  <div class="deck-actions" id="deckActions"></div>
</div>
<div id="overlay-lclear" class="overlay">
  <div class="lu-rays"></div>
  <div class="lu-inner lc-inner">
    <p class="lu-small">LESSON CLEAR</p>
    <h2 class="lc-title" id="lcTitle"></h2>
    <div class="lc-stars" id="lcStars"></div>
    <div class="lc-stats"><div><small>獲得XP</small><b id="lcXp">0</b></div><div><small>一発正解</small><b id="lcAcc">0</b></div></div>
    <div id="lcUnlock"></div>
    <div class="lc-acts" id="lcActs"></div>
  </div>
</div>
<div id="lessonPreview" class="overlay pv"></div>
<div id="glossTip"></div>
<div id="slam"></div>
<div id="toasts"></div>
`;
