/* STAGE 1 三角比の定義・相互関係（プリント左上の枠）＋ 余白メモ「30°,45°,60° → 三角定規」
 * 書き分け：**覚えること** ／ __覚え方のヒント__ ／ ((この教材での呼び方・約束)) */

LE.defLesson('u1', {
  id: 'u1-1', title: 'sin・cos・tan の定義', goal: '図を見て sin・cos・tan を辺の比で言える',
  steps: [
    { t: 'say', text: 'はじめに、この教材の文字の見分け方。\n**マーカー**＝覚えること（公式・定義）\n__波線__＝覚え方のヒント\n((グレー＝この教材だけの呼び方や約束))',
      ask: { q: '覚えなくていいのはどれ？', o: ['📎 グレーの文字', 'マーカーの文字', '💡 波線の文字'], why: ['', 'マーカーは覚えること！', '波線は覚え方のヒント。覚えると思い出しやすい。'] },
      reveal: 'その通り。テストで使うのは**マーカー**。__波線__で思い出して、((グレーは説明のための呼び方))。' },
    { t: 'say', text: '三角比は、直角三角形の**辺の比**。角 θ から見て、それぞれの辺には呼び名がある。', viz: LE.figs.rt({ a: '', b: '', c: '' }),
      ask: { q: '直角の向かいにある、いちばん長い辺は？', o: ['斜辺', 'たての辺', 'よこの辺'], why: ['', 'たては、斜めの辺より短い。', 'よこは、斜めの辺より短い。'] },
      reveal: '**斜辺**＝直角の向かいの、いちばん長い辺。\n((この教材とプリントの図では、θ を左下・直角を右下に置き、斜辺を c、θ の向かいの辺（たて）を a、θ のとなりの辺（よこ）を b と書く))', rviz: LE.figs.rt() },
    { t: 'widget', w: 'sct', text: '__覚え方は「筆記体」__。θ の角のあたりから、辺に重ねて $s$・$c$・$t$ を書く。\nペンが__最初に通った辺が分母、次に通った辺が分子__。' },
    { t: 'fill', text: '3つの式を完成させよう。((文字はプリントの図のとおり))',
      viz: LE.figs.rt() + '<div class="fx-rows"><div>$\\S\\theta=$ {{0}}</div><div>$\\C\\theta=$ {{1}}</div><div>$\\T\\theta=$ {{2}}</div></div>',
      a: ['$\\dfrac{a}{c}$', '$\\dfrac{b}{c}$', '$\\dfrac{a}{b}$'], extra: ['$\\dfrac{c}{a}$', '$\\dfrac{b}{a}$'],
      hints: ['s のペンは、斜辺 c → たて a。', 'c のペンは、斜辺 c → よこ b。', 't のペンは、よこ b → たて a。'] },
    { t: 'recap', points: [
      { q: 'sin・cos・tan は、それぞれ どの辺 ÷ どの辺？', a: '**sin θ ＝ 向かいの辺 ÷ 斜辺**　**cos θ ＝ となりの辺 ÷ 斜辺**　**tan θ ＝ 向かいの辺 ÷ となりの辺**' },
      { q: '((プリントの図))（たて $a$・よこ $b$・斜辺 $c$）で書くと？', a: '$\\S\\theta=\\dfrac{a}{c}$　$\\C\\theta=\\dfrac{b}{c}$　$\\T\\theta=\\dfrac{a}{b}$' },
      '__筆記体のペンが、1番目に通る辺が分母__'
    ] }
  ]
});
LE.addTo('u1-1', 'def', [
  { q: '図の直角三角形で、$\\S\\theta$ はどれ？', fig: ['rt', {}], o: ['$\\dfrac{a}{c}$', '$\\dfrac{b}{c}$', '$\\dfrac{a}{b}$', '$\\dfrac{c}{a}$'], e: '向かいの辺 ÷ 斜辺。筆記体の s：斜辺 c → たて a。' },
  { q: '図の直角三角形で、$\\C\\theta$ はどれ？', fig: ['rt', {}], o: ['$\\dfrac{b}{c}$', '$\\dfrac{a}{c}$', '$\\dfrac{a}{b}$', '$\\dfrac{c}{b}$'], e: 'となりの辺 ÷ 斜辺。筆記体の c：斜辺 c → よこ b。' },
  { q: '図の直角三角形で、$\\T\\theta$ はどれ？', fig: ['rt', {}], o: ['$\\dfrac{a}{b}$', '$\\dfrac{b}{a}$', '$\\dfrac{a}{c}$', '$\\dfrac{b}{c}$'], e: '向かいの辺 ÷ となりの辺。筆記体の t：よこ b → たて a。' },
  { q: '3辺が $3,4,5$ の直角三角形。$\\S\\theta$ は？', fig: ['rt', { a: '3', b: '4', c: '5' }], o: ['$\\dfrac35$', '$\\dfrac45$', '$\\dfrac34$', '$\\dfrac53$'], e: '向かいの辺 3 ÷ 斜辺 5。' }
]);

LE.defLesson('u1', {
  id: 'u1-2', title: '【メモ】30°・45°・60° は三角定規', goal: '三角定規の辺の比から、30°・45°・60° の値を出せる',
  steps: [
    { t: 'show', frames: [
      { say: 'プリントのすみのメモ「30°・45°・60° → 三角定規」。\n1枚目：**正三角形**（3辺とも 2）を、真ん中で半分に切ると…', viz: LE.figs.eqCut(1) },
      { say: '残った辺は、三平方の定理で求められる。', viz: LE.figs.eqCut(2),
        ask: { q: '$?^2+1^2=2^2$ を解くと？', o: ['$\\sqrt3$', '$\\sqrt2$', '$1$'], why: ['', '$?^2=4-1=3$ だよ。', '$?^2=4-1=3$ だよ。'] },
        reveal: '30°・60°・90° の三角形は **1 : 2 : √3**。__合言葉は「いち・に・ルート3」__（2 が斜辺）。' },
      { say: '2枚目：**正方形**（1辺 1）を、対角線で半分に切ると…', viz: LE.figs.sqCut(1),
        ask: { q: '斜辺 $?$ は？（$1^2+1^2=?^2$）', o: ['$\\sqrt2$', '$2$', '$\\sqrt3$'], why: ['', '$?^2=2$ だよ。', '$?^2=1+1=2$ だよ。'] },
        reveal: '45°・45°・90° の三角形は **1 : 1 : √2**。__合言葉は「いち・いち・ルート2」__。' }
    ] },
    { t: 'widget', w: 'scribe', text: '値の出し方：__その角を左下に置いて、筆記体__。ボタンを押してペンを走らせよう。',
      intro: '30° の定規：向かいの辺 1・となりの辺 √3・斜辺 2',
      stages: [
        { deg: 30, name: '30^\\circ', th: '30°', lab: { a: '1', b: '√3', c: '2' }, tex: { a: '1', b: '\\sqrt3', c: '2' }, ask: ['sin'],
          goal: '30° の **sin** を書いてみよう' },
        { tr: 'flip', deg: 60, name: '60^\\circ', th: '60°', lab: { a: '√3', b: '1', c: '2' }, tex: { a: '\\sqrt3', b: '1', c: '2' }, ask: ['sin'],
          btn: '60° を左下に', lead: '定規を**裏返して** 60° を左下に置こう →「次へ」',
          caption: '裏返すと… 60° から見て<b>向かいの辺 √3・となりの辺 1</b> に入れかわった！', goal: '60° の **sin** は？' },
        { tr: 'morph', deg: 45, name: '45^\\circ', th: '45°', lab: { a: '1', b: '1', c: '√2' }, tex: { a: '1', b: '1', c: '\\sqrt2' }, ask: ['tan'], val: { tan: '1' },
          btn: '45° の定規へ', lead: '最後は 45° の定規 →「次へ」', caption: '45°：向かいの辺 も となりの辺 も 1、斜辺は √2', goal: '45° の **tan** は？' }
      ], ok: '表を丸暗記しなくても、定規を描いて「左下に置いて筆記体」で出せる！' },
    { t: 'recap', points: [
      { q: '30°・60° の直角三角形と、45° の直角三角形。辺の比は？', a: '30°・60° は **1 : 2 : √3**、45° は **1 : 1 : √2**' },
      '__値は「その角を左下に置いて」筆記体。60° は定規を裏返す__'
    ] }
  ]
});
LE.addTo('u1-2', 'def', [
  { q: '$\\S30^\\circ$ の値は？', fig: ['rulers'], o: ['$\\dfrac12$', '$\\dfrac{\\sqrt3}{2}$', '$\\dfrac{1}{\\sqrt3}$', '$\\dfrac{1}{\\sqrt2}$'], e: '30°の向かいの辺 1 ÷ 斜辺 2。' },
  { q: '$\\C60^\\circ$ の値は？', fig: ['rulers'], o: ['$\\dfrac12$', '$\\dfrac{\\sqrt3}{2}$', '$\\dfrac{1}{\\sqrt2}$', '$2$'], e: '60°のとなりの辺 1 ÷ 斜辺 2。' },
  { q: '$\\T60^\\circ$ の値は？', o: ['$\\sqrt3$', '$\\dfrac{1}{\\sqrt3}$', '$\\dfrac{\\sqrt3}{2}$', '$1$'], e: '向かいの辺 √3 ÷ となりの辺 1。' },
  { q: '$\\S45^\\circ$ の値は？', o: ['$\\dfrac{1}{\\sqrt2}$', '$\\dfrac12$', '$1$', '$\\sqrt2$'], e: '向かいの辺 1 ÷ 斜辺 √2。' }
]);

LE.defLesson('u1', {
  id: 'u1-3', title: '単位円：P(cos θ, sin θ)', goal: 'sin＝y座標、cos＝x座標、tan＝OPの傾き と言える',
  steps: [
    { t: 'widget', w: 'scribe', text: 'おさらい：__筆記体の s・c・t__。\n今度は **斜辺が 1** の直角三角形。たての長さを $y$、よこを $x$ とすると…？',
      intro: '斜辺 1 の直角三角形（点線は半径 1 の円）',
      stages: [
        { deg: 50, u: 160, circle: true, name: '\\theta', th: 'θ', lab: { a: 'y', b: 'x', c: '1' }, tex: { a: 'y', b: 'x', c: '1' }, ask: ['sin', 'cos'], val: { sin: 'y', cos: 'x' },
          goal: '**sin** と **cos** を書いてみよう。分母が 1 だと…？' }
      ], ok: '斜辺が 1 なら $\\sin\\theta=y$、$\\cos\\theta=x$。座標そのもの！' },
    { t: 'say', text: 'この三角形を半径 1 の円＝[[単位円]] に置いて、点 P を回す。90° をこえても、P の座標で sin・cos が決まる。', viz: LE.figs.unit(50),
      ask: { q: 'P の座標を三角比で書くと？', o: ['$(\\C\\theta,\\ \\S\\theta)$', '$(\\S\\theta,\\ \\C\\theta)$', '$(\\T\\theta,\\ 1)$'], why: ['', 'さっき $\\sin\\theta=y$ だったよね。', 'x は cos、y は sin。'] },
      reveal: 'P$(\\C\\theta,\\ \\S\\theta)$：**cos θ は P の x座標、sin θ は y座標**。__(x, y) と同じアルファベット順（c が先、s があと）__。\n**tan θ ＝ OP の傾き**（$\\dfrac{y}{x}$）。' },
    { t: 'widget', w: 'unit', tasks: ['neg', 't90'], text: '点 P を動かしてみよう。' },
    { t: 'say', text: 'もうひとつ大事な関係。tan θ は「たて ÷ よこ」＝ $\\dfrac{y}{x}$ だった。\nそして単位円では $y=\\S\\theta$、$x=\\C\\theta$。', viz: LE.figs.unit(50),
      ask: { q: '$\\T\\theta=\\dfrac{y}{x}$ の $y$ と $x$ を、sin・cos に置きかえると？', o: ['$\\T\\theta=\\dfrac{\\S\\theta}{\\C\\theta}$', '$\\T\\theta=\\dfrac{\\C\\theta}{\\S\\theta}$', '$\\T\\theta=\\S\\theta\\times\\C\\theta$'], why: ['', '分子は y（たて）＝ sin だよ。', 'tan は「たて ÷ よこ」の割り算。'] },
      reveal: '$\\T\\theta=\\dfrac{\\S\\theta}{\\C\\theta}$　**tan は sin ÷ cos**。次のレッスンで使うよ。',
      more: { label: 'なぜ $\\dfrac{y}{x}$ が tan なの？', text: 'tan θ は「向かいの辺 ÷ となりの辺」＝「たて ÷ よこ」。\n単位円の三角形では、たて＝P の y座標、よこ＝P の x座標。\nだから $\\T\\theta=\\dfrac{y}{x}$。ここに $y=\\S\\theta$、$x=\\C\\theta$ を入れると $\\T\\theta=\\dfrac{\\S\\theta}{\\C\\theta}$。' } },
    { t: 'recap', points: [
      { q: '単位円の点 P の座標を、cos と sin で書くと？', a: 'P$(\\C\\theta,\\ \\S\\theta)$：**cos θ＝x座標、sin θ＝y座標**' },
      { q: 'tan θ を sin と cos で書くと？', a: '$\\T\\theta=\\dfrac{\\S\\theta}{\\C\\theta}$（**tan は sin ÷ cos**）' },
      { q: '単位円で、tan θ は何を表す？', a: '**tan θ ＝ OP の傾き**（90° では存在しない）' },
      '__(x, y) と同じアルファベット順__'
    ] }
  ]
});
LE.addTo('u1-3', 'unitc', [
  { q: '単位円上の点 P の座標は？', fig: ['unit', 50], o: ['$(\\C\\theta,\\ \\S\\theta)$', '$(\\S\\theta,\\ \\C\\theta)$', '$(\\C\\theta,\\ \\T\\theta)$', '$(\\T\\theta,\\ \\S\\theta)$'], e: 'x＝cos、y＝sin。' },
  { q: '単位円で $\\T\\theta$ が表すものは？', fig: ['unit', 50], o: ['OP の傾き', 'P の x座標', 'P の y座標', 'OP の長さ'], e: '$\\tan\\theta=\\dfrac{y}{x}$＝OP の傾き。' },
  { q: '$\\C180^\\circ$ の値は？', fig: ['unit', 180], o: ['$-1$', '$0$', '$1$', '存在しない'], e: '180° の点は (−1, 0)。' },
  { q: '$\\theta=120^\\circ$ のとき、マイナスになるのは？', fig: ['unit', 120], o: ['$\\C\\theta$ と $\\T\\theta$', '$\\S\\theta$ だけ', '全部', 'どれもならない'], e: 'P は左側（x<0）。sin（高さ）はプラス。' }
]);

LE.defLesson('u1', {
  id: 'u1-4', title: '相互関係（三平方の定理より）', goal: '$\\cos^2\\theta+\\sin^2\\theta=1$ と $1+\\tan^2\\theta=\\dfrac{1}{\\cos^2\\theta}$ を言える',
  steps: [
    { t: 'say', text: 'はじめに書き方の約束。$\\cos^2\\theta$ は **$(\\cos\\theta)^2$ のこと**（cos θ を2回かける）。\nθ を2乗するのではないよ。', viz: '<div class="fx-big">$$\\cos^2\\theta=(\\cos\\theta)^2=\\cos\\theta\\times\\cos\\theta$$</div>',
      ask: { q: '$\\sin^2\\theta$ の意味は？', o: ['$\\S\\theta\\times\\S\\theta$', '$\\sin(\\theta\\times\\theta)$', '$2\\times\\S\\theta$'], why: ['', 'θ を2乗するのではないよ。', '2倍ではなく、2回かける。'] },
      reveal: '$\\sin^2\\theta=\\S\\theta\\times\\S\\theta$。__「2」は sin のすぐ右に書くのが約束__（$\\sin\\theta^2$ と書くと θ の2乗とまぎらわしいから）。' },
    { t: 'say', text: '単位円の中の直角三角形は、**斜辺 1、よこ cos θ、たて sin θ**。', viz: LE.figs.unit(40),
      ask: { q: '[[三平方の定理]]（よこ² ＋ たて² ＝ 斜辺²）に当てはめると？', o: ['$\\cos^2\\theta+\\sin^2\\theta=1$', '$\\cos\\theta+\\sin\\theta=1$', '$\\cos^2\\theta-\\sin^2\\theta=1$'], why: ['', '三平方は2乗どうし。', 'たし算だよ。'] },
      reveal: '$\\cos^2\\theta+\\sin^2\\theta=1$　これが1つめの公式。',
      more: { label: '三平方の定理をおさらい', text: '直角三角形では、**よこ² ＋ たて² ＝ 斜辺²**（斜辺は直角の向かいの辺）。\n例：3・4・5 の三角形なら $3^2+4^2=9+16=25=5^2$。\n単位円の三角形に当てはめると、よこ＝$\\C\\theta$、たて＝$\\S\\theta$、斜辺＝1 なので\n$(\\C\\theta)^2+(\\S\\theta)^2=1^2$ → $\\cos^2\\theta+\\sin^2\\theta=1$。' } },
    { t: 'say', text: '「2乗」は図にすると**正方形の面積**。1辺が cos θ の正方形の面積は $\\cos\\theta\\times\\cos\\theta=\\cos^2\\theta$。', viz: '<div class="vz-row"><div class="bx c1">1辺 cos θ の正方形<small>面積 cos²θ</small></div><div class="bx c5">1辺 sin θ の正方形<small>面積 sin²θ</small></div><div class="bx">1辺 1 の正方形<small>面積 1</small></div></div>',
      ask: { q: '1辺が sin θ の正方形の面積は？', o: ['$\\sin^2\\theta$', '$2\\S\\theta$', '$\\S\\theta$'], why: ['', '正方形の面積は「1辺 × 1辺」。', '面積は1辺を2回かける。'] },
      reveal: '$\\sin^2\\theta$。だから $\\cos^2\\theta+\\sin^2\\theta=1$ は「**よこの正方形 ＋ たての正方形 ＝ 斜辺の正方形（面積1）**」という意味。' },
    { t: 'widget', w: 'pyth', text: 'シアンは1辺 cos θ の正方形（面積 cos²θ）、ピンクは1辺 sin θ の正方形（面積 sin²θ）。点線は斜辺 1 の正方形。P を動かしても、2つの面積の和は…？',
      more: { label: 'どうして正方形が出てくるの？', text: '三平方の定理は「直角をはさむ2辺の上に作った正方形の面積の和が、斜辺の上の正方形の面積に等しい」という定理。\nこの図では、よこ（cos θ）の上にシアン、たて（sin θ）の上にピンク、斜辺（1）の上に点線の正方形がある。' } },
    { t: 'show', frames: [
      { say: '2つめの公式は、1つめの式の**両辺を $\\cos^2\\theta$ で割る**（プリントの「÷cos²θ」の矢印）。\nたし算の式を割るときは、**1つ1つの項をぜんぶ割る**。', viz: '<div class="fx-big">$$\\dfrac{\\cos^2\\theta}{\\cos^2\\theta}+\\dfrac{\\sin^2\\theta}{\\cos^2\\theta}=\\dfrac{1}{\\cos^2\\theta}$$</div>',
        ask: { q: 'まず左の $\\dfrac{\\cos^2\\theta}{\\cos^2\\theta}$ は？', o: ['$1$', '$0$', '$\\cos\\theta$'], why: ['', '同じものどうしの割り算は 1。', '同じものどうしの割り算は 1。'] },
        reveal: '同じものを同じもので割ると **1**。' },
      { say: '次は $\\dfrac{\\sin^2\\theta}{\\cos^2\\theta}$。前のレッスンの **tan は sin ÷ cos** を思い出そう。', viz: '<div class="fx-big">$$1+\\dfrac{\\sin^2\\theta}{\\cos^2\\theta}=\\dfrac{1}{\\cos^2\\theta}$$</div>',
        ask: { q: '$\\dfrac{\\sin^2\\theta}{\\cos^2\\theta}$ をまとめると？', o: ['$\\tan^2\\theta$', '$1$', '$\\sin^2\\theta$'], why: ['', '$\\dfrac{\\sin\\theta}{\\cos\\theta}=\\tan\\theta$ だよ。', '$\\dfrac{\\sin\\theta}{\\cos\\theta}=\\tan\\theta$ だよ。'] },
        reveal: '$1+\\tan^2\\theta=\\dfrac{1}{\\cos^2\\theta}$　__忘れても「÷cos²θ」で作り直せる__',
        more: { label: 'なぜ $\\tan^2\\theta$ になるの？', text: '2乗は「2回かける」だから、分子も分母も2つに分けられる。\n$\\dfrac{\\sin^2\\theta}{\\cos^2\\theta}=\\dfrac{\\S\\theta\\times\\S\\theta}{\\C\\theta\\times\\C\\theta}=\\dfrac{\\S\\theta}{\\C\\theta}\\times\\dfrac{\\S\\theta}{\\C\\theta}$\nそして $\\dfrac{\\S\\theta}{\\C\\theta}=\\T\\theta$ だから、$\\T\\theta\\times\\T\\theta=\\tan^2\\theta$。' } }
    ] },
    { t: 'build', text: '2つめの公式を組み立てよう。', ans: ['1', '+', '\\tan^2\\theta', '=', '\\dfrac{1}{\\cos^2\\theta}'], extra: ['\\dfrac{1}{\\sin^2\\theta}', '\\cos^2\\theta'],
      hint: '「÷cos²θ」で作ったから、右辺の分母は cos²θ。' },
    { t: 'steps', text: '公式の使い道：sin がわかれば cos が出せる。', q: 'θ は鋭角、$\\S\\theta=\\dfrac45$ のとき $\\C\\theta$ は？',
      steps: ['$\\cos^2\\theta+\\sin^2\\theta=1$ に $\\S\\theta=\\dfrac45$ を入れる', '$\\cos^2\\theta=1-\\dfrac{16}{25}=\\dfrac{9}{25}$', '2乗して $\\dfrac{9}{25}$ になる数は $\\dfrac35$ と $-\\dfrac35$ の **2つ**', 'θ は鋭角 → P は単位円の右側（x がプラス）→ $\\C\\theta=\\dfrac35$'] },
    { t: 'say', text: '**± は角の大きさで決める**。単位円で、鋭角なら P は右側（cos ＞ 0）、鈍角なら左側（cos ＜ 0）。\nsin（高さ）は 0°〜180° ならいつもプラス。', viz: LE.figs.unit(130),
      ask: { q: 'θ が鈍角で $\\cos^2\\theta=\\dfrac{9}{25}$ なら、$\\C\\theta$ は？', o: ['$-\\dfrac35$', '$\\dfrac35$', '$\\pm\\dfrac35$'], why: ['', '鈍角の P は単位円の左側。x座標は？', '角が決まれば、符号も1つに決まる。'] },
      reveal: '鈍角なので $\\C\\theta=-\\dfrac35$。__鋭角は全部プラス、鈍角は cos と tan がマイナス__',
      more: { label: 'なぜ答えが2つ（±）出るの？', text: '$x^2=\\dfrac{9}{25}$ になる $x$ は、$\\dfrac35$ と $-\\dfrac35$ の2つ（$\\left(-\\dfrac35\\right)^2$ も $\\dfrac{9}{25}$）。\n2乗すると符号（＋か−か）の情報が消えてしまう。だから元に戻すときは、「どっちの符号か」を別の情報＝**角の大きさ**で決める。' } },
    { t: 'recap', points: [
      { q: '単位円の三平方から出る式は？', a: '$\\cos^2\\theta+\\sin^2\\theta=1$' },
      { q: 'その式を $\\cos^2\\theta$ で割ると？', a: '$1+\\tan^2\\theta=\\dfrac{1}{\\cos^2\\theta}$' },
      { q: '$\\cos^2\\theta$ を出したあと、cos の符号はどう決める？', a: '**鋭角ならプラス、鈍角ならマイナス**（sin は 0°〜180° でいつもプラス）' },
      '__単位円の三平方／1つめを ÷cos²θ__'
    ] }
  ]
});
LE.addTo('u1-4', 'unitc', [
  { q: '空欄に入るのは？　$\\cos^2\\theta+\\sin^2\\theta=\\ \\square$', o: ['$1$', '$0$', '$\\tan^2\\theta$', '$2$'], e: '単位円の三平方の定理。' },
  { q: '$1+\\tan^2\\theta$ に等しいのは？', o: ['$\\dfrac{1}{\\cos^2\\theta}$', '$\\dfrac{1}{\\sin^2\\theta}$', '$\\cos^2\\theta$', '$1$'], e: '1つめの式を cos²θ で割ってできる。' },
  { q: '$\\theta$ は鋭角で $\\S\\theta=\\dfrac45$。$\\C\\theta$ は？', o: ['$\\dfrac35$', '$-\\dfrac35$', '$\\dfrac45$', '$\\dfrac{1}{5}$'], e: '$\\cos^2\\theta=1-\\dfrac{16}{25}=\\dfrac{9}{25}$。鋭角なのでプラス。' },
  { q: '次のうち、**正しくない**式は？', o: ['$\\sin^2\\theta-\\cos^2\\theta=1$', '$\\cos^2\\theta+\\sin^2\\theta=1$', '$\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}$', '$1+\\tan^2\\theta=\\dfrac{1}{\\cos^2\\theta}$'], e: 'たし算！' }
]);
