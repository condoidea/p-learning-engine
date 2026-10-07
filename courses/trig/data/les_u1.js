/* STAGE 1 三角比のきほん */
LE.gloss({
  '斜辺': '直角三角形で、直角の向かいにあるいちばん長い辺。',
  '単位円': '原点を中心とする半径1の円。斜辺が1になるので、sin・cos がそのまま座標になる。',
  '有名角': '30°・45°・60° のように、三角比の値がきれいに出る角。三角定規の角。'
});

LE.defLesson('u1', {
  id: 'u1-1', title: '直角三角形の sin・cos・tan', goal: '図を見て sin・cos・tan を辺の比で言える',
  steps: [
    { t: 'say', text: '三角比は、直角三角形の**辺の比**。\n向きはいつもこれ：**θ は左下、直角は右下**。\n斜めの辺が $c$（[[斜辺]]）、たてが $a$、よこが $b$。',
      viz: LE.figs.rt() },
    { t: 'widget', w: 'sct', text: '覚え方は「**筆記体**」。$s$・$c$・$t$ を書く筆の動きで、どの辺をどの順に通るかが決まる。' },
    { t: 'fill', text: '覚えたてのうちに、3つの式を完成させよう。',
      viz: '<div class="fx-rows"><div>$\\S\\theta=$ {{0}}</div><div>$\\C\\theta=$ {{1}}</div><div>$\\T\\theta=$ {{2}}</div></div>',
      a: ['$\\dfrac{a}{c}$', '$\\dfrac{b}{c}$', '$\\dfrac{a}{b}$'], extra: ['$\\dfrac{c}{a}$', '$\\dfrac{b}{a}$'],
      hints: ['s の筆は、斜辺 c → たて a。1番目が分母。', 'c の筆は、斜辺 c → よこ b。', 't の筆は、よこ b → たて a。'],
      ok: 'sin＝斜辺分のたて、cos＝斜辺分のよこ、tan＝よこ分のたて。' },
    { t: 'widget', w: 'rtri', mode: 'angle', text: '角 θ を変えると、値はどう変わる？ ピンクの点をドラッグ！（30°・45°・60° の近くで離すと吸いつくよ）' },
    { t: 'widget', w: 'rtri', mode: 'size', th: 35, text: '今度は角度はそのままで、三角形の**大きさ**だけを変えてみよう。' },
    { t: 'quiz', q: '3辺が $3,4,5$ の直角三角形。$\\S\\theta$ は？', viz: LE.figs.rt({ a: '3', b: '4', c: '5' }),
      o: ['$\\dfrac35$', '$\\dfrac45$', '$\\dfrac34$', '$\\dfrac53$'],
      why: ['正解！ 斜辺 5 分の たて 3。', 'それは $\\cos\\theta$（斜辺分のよこ）。', 'それは $\\tan\\theta$（よこ分のたて）。', '分母と分子が逆。1番目に通る辺（斜辺）が分母。'] },
    { t: 'recap', points: [
      '向き：θ は左下、直角は右下。斜辺 $c$・たて $a$・よこ $b$',
      '$\\S\\theta=\\dfrac{a}{c}$　$\\C\\theta=\\dfrac{b}{c}$　$\\T\\theta=\\dfrac{a}{b}$（筆記体：1番目に通る辺が分母）',
      '三角比は**角度だけ**で決まる（三角形の大きさに関係ない）'
    ] }
  ]
});
LE.addTo('u1-1', 'def', [
  { q: '図の直角三角形で、$\\S\\theta$ はどれ？', fig: ['rt', {}], o: ['$\\dfrac{a}{c}$', '$\\dfrac{b}{c}$', '$\\dfrac{a}{b}$', '$\\dfrac{c}{a}$'], e: '筆記体の s：斜辺 c → たて a。$\\sin\\theta=\\dfrac{a}{c}$' },
  { q: '図の直角三角形で、$\\C\\theta$ はどれ？', fig: ['rt', {}], o: ['$\\dfrac{b}{c}$', '$\\dfrac{a}{c}$', '$\\dfrac{a}{b}$', '$\\dfrac{c}{b}$'], e: '筆記体の c：斜辺 c → よこ b。$\\cos\\theta=\\dfrac{b}{c}$' },
  { q: '図の直角三角形で、$\\T\\theta$ はどれ？', fig: ['rt', {}], o: ['$\\dfrac{a}{b}$', '$\\dfrac{b}{a}$', '$\\dfrac{a}{c}$', '$\\dfrac{b}{c}$'], e: '筆記体の t：よこ b → たて a。$\\tan\\theta=\\dfrac{a}{b}$' },
  { q: '3辺が $5,12,13$ の直角三角形。$\\C\\theta$ は？', fig: ['rt', { a: '5', b: '12', c: '13' }], o: ['$\\dfrac{12}{13}$', '$\\dfrac{5}{13}$', '$\\dfrac{5}{12}$', '$\\dfrac{13}{12}$'], e: '斜辺 13 分の よこ 12。' },
  { q: '3辺が $8,15,17$ の直角三角形。$\\T\\theta$ は？', fig: ['rt', { a: '8', b: '15', c: '17' }], o: ['$\\dfrac{8}{15}$', '$\\dfrac{15}{8}$', '$\\dfrac{8}{17}$', '$\\dfrac{15}{17}$'], e: 'よこ 15 分の たて 8。' },
  { q: '次のうち、**まちがっている**ものは？（図の三角形）', fig: ['rt', {}], o: ['$\\T\\theta=\\dfrac{b}{a}$', '$\\S\\theta=\\dfrac{a}{c}$', '$\\C\\theta=\\dfrac{b}{c}$', '$\\T\\theta=\\dfrac{\\S\\theta}{\\C\\theta}$'], e: '$\\tan\\theta=\\dfrac{a}{b}$。$\\dfrac{b}{a}$ は分母と分子が逆。' },
  { q: '同じ角 θ をもつ、大きさのちがう直角三角形が2つある。$\\S\\theta$ の値は？', o: ['どちらも同じ', '大きい三角形のほうが大きい', '小さい三角形のほうが大きい', '斜辺の長さしだい'], e: '三角形は相似なので、辺の比は同じ。三角比は角度だけで決まる。' }
]);

LE.defLesson('u1', {
  id: 'u1-2', title: '30°・45°・60° は三角定規で', goal: '有名角の sin・cos・tan を、三角定規から出せる',
  steps: [
    { t: 'say', text: 'プリントのすみのメモ：「**30°・45°・60° → 三角定規**」。\n表を丸暗記しなくていい。三角定規の2枚の**辺の比**だけ覚えておこう。',
      viz: LE.figs.rulers() },
    { t: 'fill', text: '辺の比をうめよう。',
      viz: '<div class="fx-rows"><div>30°・60° の定規：　1 : {{0}} : {{1}}　<small>（たて : 斜辺 : よこ）</small></div><div>45° の定規：　1 : 1 : {{2}}</div></div>',
      a: ['2', '$\\sqrt3$', '$\\sqrt2$'], extra: ['3', '$\\sqrt5$'],
      hint: '30°の定規は「いち・に・ルート3」、45°は「いち・いち・ルート2」。斜辺がいちばん長い。',
      ok: '「いち・に・ルート3」「いち・いち・ルート2」。これだけ覚えればOK。' },
    { t: 'widget', w: 'ruler', text: 'お題の角を三角定規から探してタップ。辺が光って、値が出るよ。' },
    { t: 'say', text: 'おまけのフック：sin は\n$\\S30^\\circ=\\dfrac{\\sqrt1}{2}$、$\\S45^\\circ=\\dfrac{\\sqrt2}{2}$、$\\S60^\\circ=\\dfrac{\\sqrt3}{2}$\nと、**ルートの中が 1・2・3** と増えていく。cos はその**逆順**。',
      viz: '<table class="vz-tbl"><tr><th>θ</th><th>30°</th><th>45°</th><th>60°</th></tr><tr><td>$\\S$</td><td>$\\frac{\\sqrt1}{2}$</td><td>$\\frac{\\sqrt2}{2}$</td><td>$\\frac{\\sqrt3}{2}$</td></tr><tr><td>$\\C$</td><td>$\\frac{\\sqrt3}{2}$</td><td>$\\frac{\\sqrt2}{2}$</td><td>$\\frac{\\sqrt1}{2}$</td></tr><tr><td>$\\T$</td><td>$\\frac{1}{\\sqrt3}$</td><td>$1$</td><td>$\\sqrt3$</td></tr></table>' },
    { t: 'match', text: '値を結ぼう。',
      pairs: [['$\\S30^\\circ$', '$\\dfrac12$'], ['$\\C30^\\circ$', '$\\dfrac{\\sqrt3}{2}$'], ['$\\T45^\\circ$', '$1$'], ['$\\T60^\\circ$', '$\\sqrt3$']] },
    { t: 'num', text: '$\\T60^\\circ=\\sqrt3$ を小数で言うと？（小数第2位まで）', answer: 1.73, tol: 0.011, hint: '$\\sqrt3=1.7320\\ldots$（ひとなみにおごれや）', solve: '$\\sqrt3\\fallingdotseq1.73$' },
    { t: 'recap', points: [
      '30°・60°：**1 : 2 : √3**（たて : 斜辺 : よこ）、45°：**1 : 1 : √2**',
      'sin は $\\dfrac{\\sqrt1}{2},\\dfrac{\\sqrt2}{2},\\dfrac{\\sqrt3}{2}$（30°→60°）、cos はその逆順',
      'tan：$\\dfrac1{\\sqrt3},\\ 1,\\ \\sqrt3$'
    ] }
  ]
});
LE.addTo('u1-2', 'def', [
  { q: '$\\S30^\\circ$ の値は？', fig: ['rulers'], o: ['$\\dfrac12$', '$\\dfrac{\\sqrt3}{2}$', '$\\dfrac{1}{\\sqrt3}$', '$\\dfrac{1}{\\sqrt2}$'], e: '30°の定規：斜辺 2 分の たて 1。' },
  { q: '$\\C30^\\circ$ の値は？', o: ['$\\dfrac{\\sqrt3}{2}$', '$\\dfrac12$', '$\\sqrt3$', '$\\dfrac{1}{\\sqrt2}$'], e: '斜辺 2 分の よこ √3。' },
  { q: '$\\T30^\\circ$ の値は？', o: ['$\\dfrac{1}{\\sqrt3}$', '$\\sqrt3$', '$\\dfrac{\\sqrt3}{2}$', '$1$'], e: 'よこ √3 分の たて 1。' },
  { q: '$\\S45^\\circ$ の値は？', o: ['$\\dfrac{1}{\\sqrt2}$', '$\\dfrac12$', '$1$', '$\\sqrt2$'], e: '斜辺 √2 分の たて 1（$=\\dfrac{\\sqrt2}{2}$）。' },
  { q: '$\\T45^\\circ$ の値は？', o: ['$1$', '$\\sqrt2$', '$\\dfrac{1}{\\sqrt2}$', '$0$'], e: 'たて も よこ も 1。' },
  { q: '$\\S60^\\circ$ の値は？', o: ['$\\dfrac{\\sqrt3}{2}$', '$\\dfrac12$', '$\\sqrt3$', '$\\dfrac{1}{\\sqrt3}$'], e: '60°の角から見ると、たては √3。斜辺 2 分の √3。' },
  { q: '$\\C60^\\circ$ の値は？', o: ['$\\dfrac12$', '$\\dfrac{\\sqrt3}{2}$', '$\\dfrac{1}{\\sqrt2}$', '$2$'], e: '60°の角から見ると、よこは 1。斜辺 2 分の 1。' },
  { q: '$\\T60^\\circ$ の値は？', o: ['$\\sqrt3$', '$\\dfrac{1}{\\sqrt3}$', '$\\dfrac{\\sqrt3}{2}$', '$1$'], e: 'よこ 1 分の たて √3。' },
  { q: '$0^\\circ<\\theta<90^\\circ$ で $\\S\\theta=\\dfrac{\\sqrt3}{2}$ となる θ は？', o: ['$60^\\circ$', '$30^\\circ$', '$45^\\circ$', '$90^\\circ$'], e: 'sin はルートの中 1,2,3 → 30°,45°,60°。√3 は 60°。' },
  { q: '30°・60° の三角定規で、長さ「2」にあたる辺は？', o: ['斜辺', '30°の向かいの辺', '60°の向かいの辺', 'どこにもない'], e: '1 : 2 : √3 の 2 はいちばん長い斜辺。' }
]);

LE.defLesson('u1', {
  id: 'u1-3', title: '単位円で 0°〜180° へ', goal: 'sin＝y座標、cos＝x座標、tan＝傾き として鈍角まで扱える',
  steps: [
    { t: 'say', text: '直角三角形だと 90° までしか使えない。\nそこで、半径 1 の円＝[[単位円]] の上の点 P で考える。\n斜辺が 1 だから、$\\S\\theta=\\dfrac{y}{1}=y$、$\\C\\theta=x$。',
      viz: LE.figs.unit(50) },
    { t: 'say', text: 'フック：**P(cos θ, sin θ) は (x, y) と同じ“アルファベット順”**。\n$c$ が先で $s$ があと、$x$ が先で $y$ があと。\nそして $\\T\\theta=\\dfrac{\\S\\theta}{\\C\\theta}=\\dfrac{y}{x}$ ＝ **OP の傾き**。' },
    { t: 'widget', w: 'unit', tasks: ['neg', 'eq', 't90'], text: '点 P を動かしてみよう。背景でずっと回っているのも、この単位円だよ。' },
    { t: 'quiz', q: '$90^\\circ<\\theta<180^\\circ$（鈍角）のとき、**マイナス**になるのは？',
      o: ['$\\C\\theta$ と $\\T\\theta$', '$\\S\\theta$ だけ', '$\\S\\theta$ と $\\C\\theta$', '全部プラス'],
      why: ['正解！ P は左側（x<0）なので cos はマイナス、tan＝傾きもマイナス。sin（高さ）はプラスのまま。', 'sin は高さ。上半分の円なのでプラス。', 'sin は高さなのでプラス。', 'P が y軸より左にあるとき、x座標はマイナス。'] },
    { t: 'fill', text: '端っこの角の値をうめよう（単位円の上の点の座標を思い浮かべて）。',
      viz: '<table class="vz-tbl"><tr><th>θ</th><th>0°</th><th>90°</th><th>180°</th></tr><tr><td>P</td><td>(1, 0)</td><td>(0, 1)</td><td>(−1, 0)</td></tr><tr><td>$\\C$</td><td>{{0}}</td><td>{{1}}</td><td>{{2}}</td></tr><tr><td>$\\S$</td><td>0</td><td>{{3}}</td><td>0</td></tr></table>',
      a: ['1', '0', '−1', '1'], extra: ['2', '½'],
      hint: 'cos は P の x座標、sin は y座標。',
      ok: 'tan 90° だけは「存在しない」（OP がたてになって傾きが決まらない）。' },
    { t: 'widget', w: 'unit', tasks: ['s150', 'c120'], text: '鈍角の値も、単位円ならすぐ分かる。Pを動かして探そう。' },
    { t: 'recap', points: [
      '単位円の点 P(cos θ, sin θ)：**cos＝x、sin＝y**（アルファベット順）',
      '$\\T\\theta=\\dfrac{\\S\\theta}{\\C\\theta}$＝OP の傾き。**tan 90° は存在しない**',
      '鈍角では **cos と tan がマイナス**、sin はプラス'
    ] }
  ]
});
LE.addTo('u1-3', 'unitc', [
  { q: '単位円上の点 P の座標は？', fig: ['unit', 50], o: ['$(\\C\\theta,\\ \\S\\theta)$', '$(\\S\\theta,\\ \\C\\theta)$', '$(\\C\\theta,\\ \\T\\theta)$', '$(\\T\\theta,\\ \\S\\theta)$'], e: 'x＝cos、y＝sin。アルファベット順（c→s、x→y）。' },
  { q: '単位円で $\\T\\theta$ が表すものは？', fig: ['unit', 50], o: ['OP の傾き', 'P の x座標', 'P の y座標', '弧の長さ'], e: '$\\tan\\theta=\\dfrac{y}{x}$ は OP の傾き。' },
  { q: '$\\C180^\\circ$ の値は？', fig: ['unit', 180], o: ['$-1$', '$0$', '$1$', '存在しない'], e: '180° の点は (−1, 0)。x座標は −1。' },
  { q: '$\\S90^\\circ$ の値は？', o: ['$1$', '$0$', '$-1$', '存在しない'], e: '90° の点は (0, 1)。y座標は 1。' },
  { q: '$\\T90^\\circ$ の値は？', o: ['存在しない', '$0$', '$1$', '$\\infty$（無限大）と書く'], e: 'OP がたてになり、傾きが決められない。高校では「存在しない」と答える。' },
  { q: '$0^\\circ\\leqq\\theta\\leqq180^\\circ$ のとき、$\\S\\theta$ のとりうる値の範囲は？', o: ['$0\\leqq\\S\\theta\\leqq1$', '$-1\\leqq\\S\\theta\\leqq1$', '$-1\\leqq\\S\\theta\\leqq0$', 'すべての実数'], e: '上半分の円の高さなので 0 以上 1 以下。' },
  { q: '$0^\\circ\\leqq\\theta\\leqq180^\\circ$ のとき、$\\C\\theta$ のとりうる値の範囲は？', o: ['$-1\\leqq\\C\\theta\\leqq1$', '$0\\leqq\\C\\theta\\leqq1$', '$-1\\leqq\\C\\theta\\leqq0$', '$\\C\\theta\\geqq0$'], e: 'x座標は −1 から 1 まで動く。' },
  { q: '$\\theta=120^\\circ$ のときの符号の組み合わせ（sin, cos, tan）は？', fig: ['unit', 120], o: ['（＋, −, −）', '（＋, ＋, ＋）', '（−, −, ＋）', '（＋, −, ＋）'], e: '鈍角：sin（高さ）だけプラス、cos と tan はマイナス。' }
]);

LE.defLesson('u1', {
  id: 'u1-4', title: '相互関係：三平方の定理から', goal: '$\\cos^2\\theta+\\sin^2\\theta=1$ と $1+\\tan^2\\theta=\\dfrac{1}{\\cos^2\\theta}$ を使える',
  steps: [
    { t: 'say', text: '単位円の中の直角三角形は、**斜辺 1、よこ cos θ、たて sin θ**。\nここで**三平方の定理** $a^2+b^2=c^2$ を使うと…',
      viz: LE.figs.unit(40) },
    { t: 'widget', w: 'pyth', text: 'シアン（cos²）とピンク（sin²）の正方形。P を動かしても、面積の和は…？' },
    { t: 'build', text: '1つめの公式を組み立てよう。', ans: ['\\cos^2\\theta', '+', '\\sin^2\\theta', '=', '1'], extra: ['\\tan^2\\theta', '2'],
      ok: '「単位円の三平方」。この式がすべての出発点。' },
    { t: 'order', text: '2つめの公式の作り方（プリントの「÷cos²θ」の矢印）。正しい順に並べよう。',
      items: ['$\\cos^2\\theta+\\sin^2\\theta=1$ から出発', '両辺を $\\cos^2\\theta$ で割る', '$1+\\dfrac{\\sin^2\\theta}{\\cos^2\\theta}=\\dfrac{1}{\\cos^2\\theta}$', '$\\dfrac{\\sin\\theta}{\\cos\\theta}=\\tan\\theta$ なので $1+\\tan^2\\theta=\\dfrac{1}{\\cos^2\\theta}$'] },
    { t: 'build', text: '2つめの公式を組み立てよう。', ans: ['1', '+', '\\tan^2\\theta', '=', '\\dfrac{1}{\\cos^2\\theta}'], extra: ['\\dfrac{1}{\\sin^2\\theta}', '\\cos^2\\theta'],
      hint: '「÷cos²θ」で作ったから、右辺の分母は cos²θ。' },
    { t: 'steps', q: '$\\theta$ は鋭角で $\\S\\theta=\\dfrac35$ のとき、$\\C\\theta$ と $\\T\\theta$ は？', steps: [
      '$\\cos^2\\theta=1-\\sin^2\\theta=1-\\dfrac{9}{25}=\\dfrac{16}{25}$',
      '鋭角なので $\\cos\\theta>0$ → $\\cos\\theta=\\dfrac45$',
      '$\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}=\\dfrac{3/5}{4/5}=\\dfrac34$',
      '（3・4・5 の直角三角形を描いても一発！）'] },
    { t: 'quiz', q: '$\\theta$ が**鈍角**で $\\C\\theta=-\\dfrac35$ のとき、$\\S\\theta$ は？',
      o: ['$\\dfrac45$', '$-\\dfrac45$', '$\\dfrac35$', '$\\pm\\dfrac45$'],
      why: ['正解！ sin² = 1 − 9/25 = 16/25。0°〜180° では sin ≧ 0 なのでプラス。', '鈍角でも sin（高さ）はプラス。', 'cos と sin を取りちがえないように。', '0°〜180° では sin はマイナスにならないので、1つに決まる。'] },
    { t: 'recap', points: [
      '$\\cos^2\\theta+\\sin^2\\theta=1$（単位円の三平方）',
      '$\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}$　／　$1+\\tan^2\\theta=\\dfrac{1}{\\cos^2\\theta}$（両辺を cos²θ で割る）',
      '0°〜180° では **sin はいつもプラス**。cos の符号は鋭角か鈍角かで決まる'
    ] }
  ]
});
LE.addTo('u1-4', 'unitc', [
  { q: '空欄に入るのは？　$\\cos^2\\theta+\\sin^2\\theta=\\ \\square$', o: ['$1$', '$0$', '$\\tan^2\\theta$', '$2$'], e: '単位円の三平方の定理。' },
  { q: '$1+\\tan^2\\theta$ に等しいのは？', o: ['$\\dfrac{1}{\\cos^2\\theta}$', '$\\dfrac{1}{\\sin^2\\theta}$', '$\\cos^2\\theta$', '$1$'], e: '$\\cos^2\\theta+\\sin^2\\theta=1$ を cos²θ で割ってできる。' },
  { q: '$1+\\tan^2\\theta=\\dfrac{1}{\\cos^2\\theta}$ は、$\\cos^2\\theta+\\sin^2\\theta=1$ の両辺を何で割ってできる？', o: ['$\\cos^2\\theta$', '$\\sin^2\\theta$', '$\\tan^2\\theta$', '$2$'], e: 'cos²θ で割ると、sin²θ/cos²θ が tan²θ になる。' },
  { q: '$\\theta$ は鋭角で $\\S\\theta=\\dfrac45$。$\\C\\theta$ は？', o: ['$\\dfrac35$', '$-\\dfrac35$', '$\\dfrac45$', '$\\dfrac{1}{5}$'], e: '$\\cos^2\\theta=1-\\dfrac{16}{25}=\\dfrac{9}{25}$。鋭角なのでプラス。' },
  { q: '$\\theta$ は鈍角で $\\S\\theta=\\dfrac{12}{13}$。$\\C\\theta$ は？', o: ['$-\\dfrac{5}{13}$', '$\\dfrac{5}{13}$', '$-\\dfrac{12}{13}$', '$\\dfrac{13}{5}$'], e: '$\\cos^2\\theta=\\dfrac{25}{169}$。鈍角なので cos はマイナス。' },
  { q: '$\\theta$ は鋭角で $\\T\\theta=2$。$\\cos^2\\theta$ は？', o: ['$\\dfrac15$', '$\\dfrac14$', '$\\dfrac45$', '$5$'], e: '$1+4=\\dfrac{1}{\\cos^2\\theta}$ → $\\cos^2\\theta=\\dfrac15$。' },
  { q: '次のうち、**正しくない**式は？', o: ['$\\sin^2\\theta-\\cos^2\\theta=1$', '$\\cos^2\\theta+\\sin^2\\theta=1$', '$\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}$', '$1+\\tan^2\\theta=\\dfrac{1}{\\cos^2\\theta}$'], e: 'たし算！ 引き算ではない。' }
]);
