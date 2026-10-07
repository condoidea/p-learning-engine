/* 基本情報技術者試験：ロードマップ（ユニット）とユニットボス
 * レッスンの書式は docs/教材の書き方.md を参照 */

/* ---- ロードマップ（前提順） ---- */
LE.unit({ id: 'u1',  name: 'コンピュータの言葉',   icon: '01', color: '#38e8ff', desc: '0と1で数や論理を表すしくみ。すべての土台。' });
LE.unit({ id: 'u2',  name: 'コンピュータの中身',   icon: '⚙', color: '#7ab8ff', desc: 'CPU・メモリ・入出力。部品の役割と速さの計算。' });
LE.unit({ id: 'u3',  name: 'データの並べ方と探し方', icon: '⇅', color: '#5cff9d', desc: 'スタック・木・探索・整列。科目Bの基礎にもなる。' });
LE.unit({ id: 'u4',  name: 'OSとシステムの信頼性', icon: '▦', color: '#9d8cff', desc: 'OSの仕事、止まらないシステムの作り方。' });
LE.unit({ id: 'u5',  name: 'データベース',         icon: '⛁', color: '#ffb347', desc: '表でデータを管理する。正規化とSQL。' });
LE.unit({ id: 'u6',  name: 'ネットワーク',         icon: '⌁', color: '#38e8ff', desc: 'データが届くしくみ。IPアドレスの計算まで。' });
LE.unit({ id: 'u7',  name: 'セキュリティ',         icon: '⛨', color: '#ff4d6d', desc: '暗号・署名・攻撃と対策。科目Bでも4問出る。' });
LE.unit({ id: 'u8',  name: 'システム開発',         icon: '⚒', color: '#5cff9d', desc: '作り方の流れ、テスト、設計の考え方。' });
LE.unit({ id: 'u9',  name: 'マネジメント',         icon: '⏱', color: '#ffb347', desc: 'プロジェクト管理・サービス管理・監査。' });
LE.unit({ id: 'u10', name: 'ストラテジ',           icon: '♟', color: '#c779ff', desc: '経営戦略・会計・法律。暗記を「理由」で覚える。' });
LE.unit({ id: 'u11', name: '科目B：プログラムを読む', icon: '{}', color: '#ffd84d', desc: '擬似言語を1行ずつ追う力をつける。' });

/* ---- ユニットボス（ユニットの全レッスンをクリアすると出現。全範囲から混ぜて出題） ---- */
LE.bosses = {
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
