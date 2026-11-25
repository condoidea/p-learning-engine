# ¡OJALÁ!（ojala.html・スペイン語の接続法現在）で試したこと（2026-11-25）

> ¡OJALÁ!（接続法現在・西検4級）。独立アプリ。`ojala.html` ＋ `ojala/`（データは `window.OQ`）。私用（news.js の ITEMS には足さない）
> チェック：`node tests/check-ojala.js`（`--words` で単語帳にない語だけ）。通しテスト：`tests/e2e-ojala.js`（`ojalaE2E`・`ojalaBoss`・`ojalaRemedy`・`ojalaWork`）。動作確認：`ojala.html?sandbox`
> 共通の教訓は [語学アプリの型.md](../語学アプリの型.md)。作りは ¡MANDA!（[manda.md](manda.md)）を元にした。

依頼「スペイン語検定シリーズの最後。戦後の港町の手紙の代書屋（空気感だけ。名前・用語・キャラ・見た目はオリジナル）。que のあとが本当のこと（直説法＝🔵青）か頭の中のこと（接続法＝🔴赤）かを毎回問い、封蝋の色で押す。まちがえると誤解された返事。形のルールは1つ。形の練習を厚く。長い『なぜ』を書かない」。

| 決めたこと | 中身 |
|---|---|
| 物語 | 学ぶ人＝港町の代書屋の新米。手紙を運ぶ鳩のパロマが教える。依頼人（ルス・ニコ・アンセルモ・イネス・テオ）の手紙を書いて、町がにぎわう（`OQ.world`）。7つの依頼・4日・ボス3体（霧の配達人ニエブラ／石頭の検閲官セベロ／行きちがいの嵐） |
| 中心の操作 | **🔏 seal（封蝋）**：手紙の文 → まず封蝋の色（🔵 本当のこと／🔴 頭の中のこと）→ 次に形。**色をまちがえると、届いた先の誤解の返事**（`mis`）がボードに出る。返事が見える位置までボードを送り、パロマの吹き出しでは隠さない（目線の誘導：見せたいのは返事） |
| 形のルール | 1つだけ：**yo の形の o を反対の母音に（-ar → e、-er・-ir → a）＋人ごとの語尾**。tengo → tenga も同じ。例外は **-oy の4つ（vaya・sea・esté・dé）・haya・sepa**、つづりの書きかえ（-car・-gar・-zar）だけ。語幹母音変化（quiera・pueda・vuelva）は表で形を見せるだけで、新しい作り方は足さない（why に1回） |
| 形の練習 | **🖋 形の工房**（`ojala/js/data/verbs.js`・38語）：「この動詞を、この人の接続法に」→ 手1「o を何に？」（例外は形を選ぶ）→（つづり）→ 手2「人の形」。まちがえたら同じ動詞の別の人でもう1問。ホーム・地図・帳面から入れる |
| 使い分け | 依頼ごとに条件を1つ：願い（quiero que・espero que）→ ojalá → 気持ち（me alegro de que）→ 疑い・必要（no creo que・es necesario que）→ まだ・目的（cuando ＋ これから・para que）→ さがしている人（busco … que・no hay nadie que）→ 伝える／頼む（dile que viene／venga）。それぞれ青の対（sé que・creo que・cuando ＋ いつも・tengo un amigo que…）と並べる |
| 地図 | **封蝋の地図**：出発点3つ（yo の形・🔴 赤・🔵 青）→ 枝。1レッスンで光らせる札は2枚まで（3枚だと 375×550 で3枚目が吹き出しの下に隠れた） |
| 試験の形 | 問題 144 問（pick・form・mood・ng・ja・bug・build）。**mood**＝この文はどちらの色？。🎓 西検チャレンジは 20 問・分野6つ（`TOPICS`）。公式のサンプル（casa-esp.com）は複製・転載禁止なので、形式だけ合わせて文は自作 |

- 単語は共通の単語帳（shared/es-words.js）に「¡OJALÁ! で足した語と形」として足した（descansar・regresar・ojalá・harina・boda など。接続法の形は F で）。ひっかけの形（busces・llege・esten・empieze・volvas・comi）は pos 'bad'
- 解説の中の短いスペイン語（`sé que` など）と用語（接続法）は2行に割らない（`white-space: nowrap`）。割れると読みにくく、重なりチェックにも引っかかる
- ホームのボタンは7つ（読み返し・工房・ラッシュ・西検・切手・地図・帳面）を1段に（375px で1列 46px・文字 10.5px）
