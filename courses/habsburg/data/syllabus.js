/* =========================================================
 * ハプスブルク年代記：分野
 *  D＝ハプスブルク家の人々（一族の当主と出来事）
 *  E＝ヨーロッパの舞台（一族を取り巻く世界史。高校世界史の重要語句が中心）
 * ========================================================= */
LE.cats = [
  { id: 'D', name: 'ハプスブルク家の人々', exam: 'H', weight: 60, color: '#d8b45a' },
  { id: 'E', name: 'ヨーロッパの舞台と文化', exam: 'H', weight: 45, color: '#c4504a' }
];

LE.fields = [
  { id: 'origin', cat: 'D', name: '起こりとルドルフ1世',   icon: '🦅', weight: 15, desc: '鷹の城・1273年の選出・オーストリア獲得' },
  { id: 'cent14', cat: 'D', name: '受難の14世紀',          icon: '⚔', weight: 13, desc: 'アルブレヒト1世・ルドルフ4世・アルブレヒト2世' },
  { id: 'fried',  cat: 'D', name: 'フリードリヒ3世',       icon: '♛', weight: 12, desc: '最後のローマ戴冠・AEIOU・待つ者が勝つ' },
  { id: 'maxi',   cat: 'D', name: 'マクシミリアン1世',     icon: '🛡', weight: 20, desc: 'マリーとの結婚・ブルゴーニュ・帝冠' },
  { id: 'hre',    cat: 'E', name: '神聖ローマ帝国のしくみ', icon: '✠', weight: 12, desc: '皇帝・ローマ王・選帝侯・金印勅書' },
  { id: 'neighbors', cat: 'E', name: '周辺の国々',         icon: '🏰', weight: 10, desc: 'ボヘミア・スイス・ハンガリー・オスマン帝国' },
  { id: 'west',   cat: 'E', name: 'ブルゴーニュとフランス', icon: '⚜', weight: 10, desc: 'ブルゴーニュ公国・ルイ11世・シャルル8世' },
  { id: 'italy',  cat: 'E', name: 'イタリアとルネサンス',   icon: '🏛', weight: 8,  desc: 'ミラノ・ルネサンス・イタリア戦争' },
  { id: 'culture', cat: 'E', name: '中世の社会と文化',     icon: '🎨', weight: 10, desc: '封建社会・教会・ゴシック・黒死病・印刷術・大航海時代' }
];
