# docs の索引（何をするとき → どれを読む）

必要なところだけ読む。**[原則.md](原則.md) は学習アプリを作る・直すとき毎回**。大きさは目安。

## 何をするとき → どれを読む
| やること | 読むもの |
|---|---|
| 新しい独立アプリを作る | 原則.md ＋ 語学なら 語学アプリの型.md ＋ 作業の手順.md |
| 新しいエンジンのコースを作る・直す | 原則.md ＋ engine/コースの作り方.md ＋ engine/学習設計.md ＋ engine/部品と落とし穴.md |
| 画面が崩れる・iPhone だけ重い・はみ出す | engine/部品と落とし穴.md の「画面づくりの落とし穴」（独立アプリにも効く） |
| ¡MANDA!・¡PROTESTO!・¿QUIÉN FUE?・¿QUÉ SERÁ?・¡QUE FUSIÓN! を直す | 原則.md ＋ 語学アプリの型.md ＋ apps/manda.md・protesto.md・quien.md・futuro.md・relativo.md |
| モル教室・ユーキ・クエストを直す | 原則.md ＋ apps/mole.md・yuki.md |
| 単語アプリ（vocab.html）を直す | vocab/設計.md（履歴は必要な v だけ） |
| 単語デッキを作る | vocab/単語データの作り方.md |
| 次のスペイン語アプリで使う語を選ぶ | vocab/スペイン語単語メモ.md |
| お知らせ（news）を足す | お知らせ.md |
| チェック・テスト・動作確認・公開 | 作業の手順.md |
| クラウド保存（Supabase） | クラウド保存.md・cloud-setup.sql |

## ファイル一覧（KB は目安）
| ファイル | KB | 中身 |
|---|---|---|
| 原則.md | 5 | 24の原則の短い版（毎回読む）と点検のしかた |
| 原則-くわしく.md | 12 | 各原則のきっかけ・例つきの全文 |
| 語学アプリの型.md | 7 | スペイン語アプリ5本に共通の教訓（次の語学アプリ用） |
| 作業の手順.md | 3 | 教材チェック・通しテスト・動作確認・公開の共通手順 |
| お知らせ.md | 1 | news/news.js の仕組み（全アプリ共通） |
| クラウド保存.md | 5 | Supabase の準備としくみ（cloud-setup.sql つき） |
| engine/学習設計.md | 9 | エンジンの学習理論との対応 |
| engine/コースの作り方.md | 12 | コースを作る手順・教材の書き方 |
| engine/部品と落とし穴.md | 7 | エンジンの部品・ウィジェット・外した案・内容づくり・画面の落とし穴 |
| apps/mole.md | 6 | モル教室の経緯 |
| apps/relativo.md | 8 | ¡QUE FUSIÓN!（関係詞）の経緯 |
| apps/yuki.md | 9 | ユーキ・クエスト（有機化学）の経緯 |
| apps/manda.md | 12 | ¡MANDA!（命令）の経緯 |
| apps/protesto.md | 10 | ¡PROTESTO!（比較）の経緯 |
| apps/quien.md | 5 | ¿QUIÉN FUE?（受身と se）の経緯 |
| apps/futuro.md | 5 | ¿QUÉ SERÁ?（時制）の経緯 |
| vocab/設計.md | 16 | 単語アプリのいまの仕様（頭に早見） |
| vocab/履歴.md | 28 | 単語アプリの v1〜v11 の経緯（頭に目次） |
| vocab/単語データの作り方.md | 16 | 参考書連動版デッキの作り方 |
| vocab/スペイン語単語メモ.md | 33 | 単語の一覧（`node tests/check-relativo.js --memo` で自動生成・手で直さない） |

アプリごとの `apps/` は、そのアプリを直すときだけ読む。
