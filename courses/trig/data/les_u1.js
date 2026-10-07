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
      '**sin θ ＝ 向かいの辺 ÷ 斜辺**　**cos θ ＝ となりの辺 ÷ 斜辺**　**tan θ ＝ 向かいの辺 ÷ となりの辺**',
      '((プリントの図では))　$\\S\\theta=\\dfrac{a}{c}$　$\\C\\theta=\\dfrac{b}{c}$　$\\T\\theta=\\dfrac{a}{b}$',
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
      '30°・60° の直角三角形は **1 : 2 : √3**、45° は **1 : 1 : √2**',
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
    { t: 'recap', points: [
      '単位円の P$(\\C\\theta,\\ \\S\\theta)$：**cos θ＝x座標、sin θ＝y座標**',
      '**tan θ ＝ OP の傾き**（90° では存在しない）',
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
    { t: 'say', text: '単位円の中の直角三角形は、斜辺 1、よこ cos θ、たて sin θ。', viz: LE.figs.unit(40),
      ask: { q: '[[三平方の定理]]を使うと？', o: ['$\\cos^2\\theta+\\sin^2\\theta=1$', '$\\cos\\theta+\\sin\\theta=1$', '$\\cos^2\\theta-\\sin^2\\theta=1$'], why: ['', '三平方は2乗どうし。', 'たし算だよ。'] },
      reveal: '$\\cos^2\\theta+\\sin^2\\theta=1$　これが1つめの公式。' },
    { t: 'widget', w: 'pyth', text: 'シアン（cos²）とピンク（sin²）の正方形。P を動かしても、面積の和は…？' },
    { t: 'show', frames: [
      { say: '2つめの公式は、1つめの両辺を $\\cos^2\\theta$ で割るだけ（プリントの「÷cos²θ」の矢印）。', viz: '<div class="fx-big">$$\\dfrac{\\cos^2\\theta}{\\cos^2\\theta}+\\dfrac{\\sin^2\\theta}{\\cos^2\\theta}=\\dfrac{1}{\\cos^2\\theta}$$</div>',
        ask: { q: '$\\dfrac{\\sin^2\\theta}{\\cos^2\\theta}$ をまとめると？', o: ['$\\tan^2\\theta$', '$1$', '$\\sin^2\\theta$'], why: ['', '$\\dfrac{\\sin\\theta}{\\cos\\theta}=\\tan\\theta$ だよ。', '$\\dfrac{\\sin\\theta}{\\cos\\theta}=\\tan\\theta$ だよ。'] },
        reveal: '$1+\\tan^2\\theta=\\dfrac{1}{\\cos^2\\theta}$　__忘れても「÷cos²θ」で作り直せる__' }
    ] },
    { t: 'build', text: '2つめの公式を組み立てよう。', ans: ['1', '+', '\\tan^2\\theta', '=', '\\dfrac{1}{\\cos^2\\theta}'], extra: ['\\dfrac{1}{\\sin^2\\theta}', '\\cos^2\\theta'],
      hint: '「÷cos²θ」で作ったから、右辺の分母は cos²θ。' },
    { t: 'recap', points: [
      '$\\cos^2\\theta+\\sin^2\\theta=1$　__単位円の三平方__',
      '$1+\\tan^2\\theta=\\dfrac{1}{\\cos^2\\theta}$　__1つめを ÷cos²θ__'
    ] }
  ]
});
LE.addTo('u1-4', 'unitc', [
  { q: '空欄に入るのは？　$\\cos^2\\theta+\\sin^2\\theta=\\ \\square$', o: ['$1$', '$0$', '$\\tan^2\\theta$', '$2$'], e: '単位円の三平方の定理。' },
  { q: '$1+\\tan^2\\theta$ に等しいのは？', o: ['$\\dfrac{1}{\\cos^2\\theta}$', '$\\dfrac{1}{\\sin^2\\theta}$', '$\\cos^2\\theta$', '$1$'], e: '1つめの式を cos²θ で割ってできる。' },
  { q: '$\\theta$ は鋭角で $\\S\\theta=\\dfrac45$。$\\C\\theta$ は？', o: ['$\\dfrac35$', '$-\\dfrac35$', '$\\dfrac45$', '$\\dfrac{1}{5}$'], e: '$\\cos^2\\theta=1-\\dfrac{16}{25}=\\dfrac{9}{25}$。鋭角なのでプラス。' },
  { q: '次のうち、**正しくない**式は？', o: ['$\\sin^2\\theta-\\cos^2\\theta=1$', '$\\cos^2\\theta+\\sin^2\\theta=1$', '$\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}$', '$1+\\tan^2\\theta=\\dfrac{1}{\\cos^2\\theta}$'], e: 'たし算！' }
]);
