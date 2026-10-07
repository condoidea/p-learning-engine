/* =========================================================
 * 三角比・平面図形：分野
 *  R＝三角比（定義・単位円・相互関係・還元公式）
 *  F＝三角形の公式（面積・正弦定理・余弦定理）
 *  G＝図形の定理（円・方べき・比）
 * ========================================================= */
LE.cats = [
  { id: 'R', name: '三角比',       exam: 'T', weight: 40, color: '#ff5fa2' },
  { id: 'F', name: '三角形の公式', exam: 'T', weight: 30, color: '#38d9ff' },
  { id: 'G', name: '図形の定理',   exam: 'T', weight: 30, color: '#ffd84d' }
];

LE.fields = [
  { id: 'def',    cat: 'R', name: '三角比の定義・有名角', icon: '📐', weight: 12, desc: 'sin・cos・tan の定義、30°・45°・60°' },
  { id: 'unitc',  cat: 'R', name: '単位円と相互関係',     icon: '⭕', weight: 14, desc: '0°〜180°、cos²+sin²=1、1+tan²' },
  { id: 'reduce', cat: 'R', name: '還元公式',             icon: '🪞', weight: 14, desc: '90°−θ、180°−θ' },
  { id: 'area',   cat: 'F', name: '面積と内接円',         icon: '🔺', weight: 8,  desc: 'S=½bc sinA、S=r/2(a+b+c)、内心' },
  { id: 'sine',   cat: 'F', name: '正弦定理',             icon: '🌀', weight: 11, desc: 'a/sinA=2R、外心' },
  { id: 'cosine', cat: 'F', name: '余弦定理',             icon: '📏', weight: 11, desc: 'a²=b²+c²−2bc cosA、cosA の形' },
  { id: 'circle', cat: 'G', name: '円の角の定理',         icon: '🎯', weight: 12, desc: '円周角・内接四角形・接弦定理' },
  { id: 'power',  cat: 'G', name: '方べきの定理',         icon: '✖', weight: 8,  desc: '交わる弦・2本の割線・接線' },
  { id: 'ratio',  cat: 'G', name: '比の定理',             icon: '🦊', weight: 10, desc: '角の二等分線・重心・チェバ・メネラウス' }
];
