/* =========================================================
 * カリキュラム（ロードマップ）定義ヘルパー
 *  FE.units      … ユニット（前提順に並ぶ）
 *  FE.lessonDefs … レッスン本体
 *
 * レッスンのステップ種別（t）
 *  say   : ピコの説明（text, viz=図解HTML）
 *  term  : 用語カード（word, yomi, short=ひとことで, ex=たとえ）→ 用語集にも自動登録
 *  quiz  : 確認問題（q, o[], a=正解番号(省略時0), why[]=選択肢ごとの解説, hint）
 *  bits  : ビットを押して数を作る（n, target, hex）
 *  gate  : 論理回路のスイッチ体験（op）
 *  order : 正しい順に並べる（items=正解順）
 *  match : 用語と意味をつなぐ（pairs）
 *  num   : 数値を入力（answer, unit, hint, solve=解き方）
 *  steps : 例題を1手ずつ表示（q, steps[]）
 *  trace : プログラムを1行ずつ実行（code, rows[{l,v,say}]）
 *  stack : スタック/キューの操作体験（mode, goal）
 *  recap : まとめ（points[]）
 * 本文中の [[用語]] はタップで意味を表示、**太字**、`等幅` が使える
 * ========================================================= */
window.FE = window.FE || {};
FE.units = FE.units || [];
FE.lessonDefs = FE.lessonDefs || {};
FE.glossary = FE.glossary || {};
FE.unit = function (u) { u.lessons = []; FE.units.push(u); };
FE.defLesson = function (unitId, L) {
  var u = FE.units.find(function (x) { return x.id === unitId; });
  L.unit = unitId;
  L.q = L.q || [];
  L.cards = L.cards || [];
  u.lessons.push(L.id);
  FE.lessonDefs[L.id] = L;
  L.steps.forEach(function (s) { if (s.t === 'term' && !FE.glossary[s.word]) FE.glossary[s.word] = s.short; });
};
FE.gloss = function (map) { Object.keys(map).forEach(function (k) { FE.glossary[k] = map[k]; }); };

/* ---- ロードマップ（前提順） ---- */
FE.unit({ id: 'u1',  name: 'コンピュータの言葉',   icon: '01', color: '#38e8ff', desc: '0と1で数や論理を表すしくみ。すべての土台。' });
FE.unit({ id: 'u2',  name: 'コンピュータの中身',   icon: '⚙', color: '#7ab8ff', desc: 'CPU・メモリ・入出力。部品の役割と速さの計算。' });
FE.unit({ id: 'u3',  name: 'データの並べ方と探し方', icon: '⇅', color: '#5cff9d', desc: 'スタック・木・探索・整列。科目Bの基礎にもなる。' });
FE.unit({ id: 'u4',  name: 'OSとシステムの信頼性', icon: '▦', color: '#9d8cff', desc: 'OSの仕事、止まらないシステムの作り方。' });
FE.unit({ id: 'u5',  name: 'データベース',         icon: '⛁', color: '#ffb347', desc: '表でデータを管理する。正規化とSQL。' });
FE.unit({ id: 'u6',  name: 'ネットワーク',         icon: '⌁', color: '#38e8ff', desc: 'データが届くしくみ。IPアドレスの計算まで。' });
FE.unit({ id: 'u7',  name: 'セキュリティ',         icon: '⛨', color: '#ff4d6d', desc: '暗号・署名・攻撃と対策。科目Bでも4問出る。' });
FE.unit({ id: 'u8',  name: 'システム開発',         icon: '⚒', color: '#5cff9d', desc: '作り方の流れ、テスト、設計の考え方。' });
FE.unit({ id: 'u9',  name: 'マネジメント',         icon: '⏱', color: '#ffb347', desc: 'プロジェクト管理・サービス管理・監査。' });
FE.unit({ id: 'u10', name: 'ストラテジ',           icon: '♟', color: '#c779ff', desc: '経営戦略・会計・法律。暗記を「理由」で覚える。' });
FE.unit({ id: 'u11', name: '科目B：プログラムを読む', icon: '{}', color: '#ffd84d', desc: '擬似言語を1行ずつ追う力をつける。' });

/* ---- ユニットボス（ユニットの全レッスンをクリアすると出現。全範囲から混ぜて出題） ---- */
FE.bosses = {
  u1:  { name: 'バイナリ・ゴーレム',   ico: '🗿' },
  u2:  { name: 'クロック・タイタン',   ico: '🤖' },
  u3:  { name: 'ソート・ヒドラ',       ico: '🐉' },
  u4:  { name: 'デッドロック・ワーム', ico: '🐛' },
  u5:  { name: 'テーブル・キメラ',     ico: '🦁' },
  u6:  { name: 'パケット・クラーケン', ico: '🐙' },
  u7:  { name: 'ランサム・リッチ',     ico: '💀' },
  u8:  { name: 'バグ・ベヒモス',       ico: '🪲' },
  u9:  { name: 'デッドライン・デーモン', ico: '👹' },
  u10: { name: 'マーケット・ドラゴン', ico: '🐲' },
  u11: { name: 'トレース・ファントム', ico: '👻' }
};
