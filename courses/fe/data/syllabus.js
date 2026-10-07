/* =========================================================
 * 基本情報技術者試験（FE）出題範囲マップ
 * IPA 試験要綱・シラバスの大分類/中分類をベースに学習用に再編成
 *  科目A：60問/90分（テクノロジ系 約41問・マネジメント系 約7問・ストラテジ系 約12問）
 *  科目B：20問/100分（アルゴリズムとプログラミング 16問・情報セキュリティ 4問）
 *  合格基準：科目A・科目Bともに 600点以上／1000点（IRT方式）
 * ========================================================= */
window.FE = window.FE || {};

FE.cats = [
  { id: 'T', name: 'テクノロジ系', exam: 'A', weight: 41, color: '#38e8ff' },
  { id: 'M', name: 'マネジメント系', exam: 'A', weight: 7,  color: '#ffb347' },
  { id: 'S', name: 'ストラテジ系', exam: 'A', weight: 12, color: '#c779ff' },
  { id: 'B', name: '科目B', exam: 'B', weight: 20, color: '#5cff9d' }
];

/* weight = 科目内でのおおよその出題比重（予測スコア算出用） */
FE.fields = [
  { id: 'basic', cat: 'T', name: '基礎理論', icon: '∑', weight: 6,
    desc: '基数変換・論理演算・確率統計・情報理論・誤差' },
  { id: 'algo',  cat: 'T', name: 'アルゴリズムとデータ構造', icon: '⇅', weight: 5,
    desc: 'スタック/キュー・木・探索・整列・計算量' },
  { id: 'comp',  cat: 'T', name: 'コンピュータ構成要素', icon: '⚙', weight: 5,
    desc: 'CPU・メモリ・キャッシュ・入出力' },
  { id: 'sys',   cat: 'T', name: 'システム構成要素', icon: '▦', weight: 4,
    desc: '信頼性・稼働率・RAID・性能評価' },
  { id: 'sw',    cat: 'T', name: 'ソフトウェア', icon: '⌘', weight: 4,
    desc: 'OS・プロセス・仮想記憶・OSS' },
  { id: 'hw',    cat: 'T', name: 'ハードウェア・UI・メディア', icon: '◐', weight: 3,
    desc: '論理回路・UI設計・画像/音声' },
  { id: 'db',    cat: 'T', name: 'データベース', icon: '⛁', weight: 5,
    desc: '正規化・SQL・トランザクション' },
  { id: 'nw',    cat: 'T', name: 'ネットワーク', icon: '⌁', weight: 5,
    desc: 'OSI・TCP/IP・IPアドレス・プロトコル' },
  { id: 'sec',   cat: 'T', name: 'セキュリティ', icon: '⛨', weight: 7,
    desc: '暗号・認証・攻撃手法・対策' },
  { id: 'dev',   cat: 'T', name: '開発技術', icon: '⚒', weight: 4,
    desc: '設計・テスト・開発手法・UML' },
  { id: 'pm',    cat: 'M', name: 'プロジェクトマネジメント', icon: '⏱', weight: 3,
    desc: 'WBS・アローダイアグラム・EVM' },
  { id: 'sm',    cat: 'M', name: 'サービスマネジメント', icon: '☎', weight: 3,
    desc: 'ITIL・SLA・インシデント管理' },
  { id: 'audit', cat: 'M', name: 'システム監査', icon: '⚖', weight: 2,
    desc: '監査の独立性・内部統制' },
  { id: 'sysst', cat: 'S', name: 'システム戦略・企画', icon: '♟', weight: 3,
    desc: 'EA・BPR・要件定義・調達' },
  { id: 'biz',   cat: 'S', name: '経営戦略・技術戦略', icon: '◎', weight: 4,
    desc: 'SWOT・PPM・マーケティング・ビジネスシステム' },
  { id: 'corp',  cat: 'S', name: '企業活動・会計', icon: '¥', weight: 3,
    desc: '財務諸表・損益分岐点・OR/IE' },
  { id: 'law',   cat: 'S', name: '法務', icon: '§', weight: 3,
    desc: '知財・個人情報・労働法・契約' },
  { id: 'btrace',cat: 'B', name: '擬似言語トレース', icon: '{}', weight: 16,
    desc: '科目B アルゴリズムとプログラミング' },
  { id: 'bsec',  cat: 'B', name: '情報セキュリティ事例', icon: '⚑', weight: 4,
    desc: '科目B 情報セキュリティ' }
];

FE.questions = FE.questions || [];
FE.add = function (field, list) {
  list.forEach(function (q, i) {
    q.f = field;
    q.id = q.id || (field + '-' + String(i + 1).padStart(3, '0'));
    FE.questions.push(q);
  });
};
