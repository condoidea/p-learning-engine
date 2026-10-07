/* STAGE 1 三角比の定義・相互関係（プリント左上の枠）＋ 余白メモ「30°,45°,60° → 三角定規」 */
LE.defLesson('u1', {
  id: 'u1-1', title: 'sin・cos・tan の定義', goal: '図を見て sin・cos・tan を辺の比で言える',
  steps: [
    { t: 'say', text: '三角比は、直角三角形の**辺の比**。\n向きはいつもこれ：**θ は左下、直角は右下**。', viz: LE.figs.rt({ a: '', b: '', c: '' }),
      ask: { q: 'いちばん長い辺はどれ？', o: ['斜めの辺', 'たての辺', 'よこの辺'], why: ['', 'たては、斜めの辺より短い。', 'よこは、斜めの辺より短い。'] },
      reveal: 'そう、直角の向かいの斜めの辺＝[[斜辺]] $c$。たてを $a$、よこを $b$ と呼ぶよ。', rviz: LE.figs.rt() },
    { t: 'widget', w: 'sct', text: '覚え方は「**筆記体**」。\nθ の角のあたりから、辺に重ねて $s$・$c$・$t$ を書く。\nペンが**最初に通った辺が分母**、**次に通った辺が分子**。' },
    { t: 'fill', text: '3つの式を完成させよう。',
      viz: LE.figs.rt() + '<div class="fx-rows"><div>$\\S\\theta=$ {{0}}</div><div>$\\C\\theta=$ {{1}}</div><div>$\\T\\theta=$ {{2}}</div></div>',
      a: ['$\\dfrac{a}{c}$', '$\\dfrac{b}{c}$', '$\\dfrac{a}{b}$'], extra: ['$\\dfrac{c}{a}$', '$\\dfrac{b}{a}$'],
      hints: ['s のペンは、斜辺 c → たて a。', 'c のペンは、斜辺 c → よこ b。', 't のペンは、よこ b → たて a。'] },
    { t: 'recap', points: [
      '$\\S\\theta=\\dfrac{a}{c}$　$\\C\\theta=\\dfrac{b}{c}$　$\\T\\theta=\\dfrac{a}{b}$',
      '筆記体のペンが **1番目に通る辺が分母**、2番目が分子'
    ] }
  ]
});
LE.addTo('u1-1', 'def', [
  { q: '図の直角三角形で、$\\S\\theta$ はどれ？', fig: ['rt', {}], o: ['$\\dfrac{a}{c}$', '$\\dfrac{b}{c}$', '$\\dfrac{a}{b}$', '$\\dfrac{c}{a}$'], e: '筆記体の s：斜辺 c → たて a。' },
  { q: '図の直角三角形で、$\\C\\theta$ はどれ？', fig: ['rt', {}], o: ['$\\dfrac{b}{c}$', '$\\dfrac{a}{c}$', '$\\dfrac{a}{b}$', '$\\dfrac{c}{b}$'], e: '筆記体の c：斜辺 c → よこ b。' },
  { q: '図の直角三角形で、$\\T\\theta$ はどれ？', fig: ['rt', {}], o: ['$\\dfrac{a}{b}$', '$\\dfrac{b}{a}$', '$\\dfrac{a}{c}$', '$\\dfrac{b}{c}$'], e: '筆記体の t：よこ b → たて a。' },
  { q: '3辺が $3,4,5$ の直角三角形。$\\S\\theta$ は？', fig: ['rt', { a: '3', b: '4', c: '5' }], o: ['$\\dfrac35$', '$\\dfrac45$', '$\\dfrac34$', '$\\dfrac53$'], e: '斜辺 5 分の たて 3。' }
]);

LE.defLesson('u1', {
  id: 'u1-2', title: '【メモ】30°・45°・60° は三角定規', goal: '三角定規の辺の比から、30°・45°・60° の値を出せる',
  steps: [
    { t: 'show', frames: [
      { say: 'プリントのすみのメモ「**30°・45°・60° → 三角定規**」。\n1枚目：**正三角形**（3辺とも 2）を、真ん中で半分に切ると…', viz: LE.figs.eqCut(1) },
      { say: '残った「たて」は、三平方の定理で求められる。', viz: LE.figs.eqCut(2),
        ask: { q: '$?^2+1^2=2^2$ を解くと？', o: ['$\\sqrt3$', '$\\sqrt2$', '$1$'], why: ['', '$?^2=4-1=3$ だよ。', '$?^2=4-1=3$ だよ。'] },
        reveal: '合言葉は「**いち・に・ルート3**」。' },
      { say: '2枚目：**正方形**（1辺 1）を、対角線で半分に切ると…', viz: LE.figs.sqCut(1),
        ask: { q: '斜辺 $?$ は？（$1^2+1^2=?^2$）', o: ['$\\sqrt2$', '$2$', '$\\sqrt3$'], why: ['', '$?^2=2$ だよ。', '$?^2=1+1=2$ だよ。'] },
        reveal: '合言葉は「**いち・いち・ルート2**」。' }
    ] },
    { t: 'widget', w: 'scribe', text: '値は、**その角を左下に置いて、筆記体**。ボタンを押してペンを走らせよう。',
      intro: '30° の定規：たて 1・よこ √3・斜辺 2',
      stages: [
        { deg: 30, name: '30^\\circ', th: '30°', lab: { a: '1', b: '√3', c: '2' }, tex: { a: '1', b: '\\sqrt3', c: '2' }, ask: ['sin'],
          goal: '30° の **sin** を書いてみよう' },
        { tr: 'flip', deg: 60, name: '60^\\circ', th: '60°', lab: { a: '√3', b: '1', c: '2' }, tex: { a: '\\sqrt3', b: '1', c: '2' }, ask: ['sin'],
          btn: '60° を左下に', lead: '定規を**裏返して** 60° を左下に置こう →「次へ」',
          caption: '裏返すと… <b>たて √3・よこ 1</b> に入れかわった！', goal: '60° の **sin** は？' },
        { tr: 'morph', deg: 45, name: '45^\\circ', th: '45°', lab: { a: '1', b: '1', c: '√2' }, tex: { a: '1', b: '1', c: '\\sqrt2' }, ask: ['tan'], val: { tan: '1' },
          btn: '45° の定規へ', lead: '最後は 45° の定規 →「次へ」', caption: '45°：たて も よこ も 1、斜辺は √2', goal: '45° の **tan** は？' }
      ], ok: '表を丸暗記しなくても、定規を描いて「左下に置いて筆記体」で出せる！' },
    { t: 'recap', points: [
      '30°・60° の定規は **1 : 2 : √3**、45° の定規は **1 : 1 : √2**',
      '値は「その角を左下に置いて」筆記体。60° は定規を裏返す'
    ] }
  ]
});
LE.addTo('u1-2', 'def', [
  { q: '$\\S30^\\circ$ の値は？', fig: ['rulers'], o: ['$\\dfrac12$', '$\\dfrac{\\sqrt3}{2}$', '$\\dfrac{1}{\\sqrt3}$', '$\\dfrac{1}{\\sqrt2}$'], e: '30°の定規：斜辺 2 分の たて 1。' },
  { q: '$\\C60^\\circ$ の値は？', fig: ['rulers'], o: ['$\\dfrac12$', '$\\dfrac{\\sqrt3}{2}$', '$\\dfrac{1}{\\sqrt2}$', '$2$'], e: '60°を左下に置くと、よこ 1。斜辺 2 分の 1。' },
  { q: '$\\T60^\\circ$ の値は？', o: ['$\\sqrt3$', '$\\dfrac{1}{\\sqrt3}$', '$\\dfrac{\\sqrt3}{2}$', '$1$'], e: 'よこ 1 分の たて √3。' },
  { q: '$\\S45^\\circ$ の値は？', o: ['$\\dfrac{1}{\\sqrt2}$', '$\\dfrac12$', '$1$', '$\\sqrt2$'], e: '斜辺 √2 分の たて 1。' }
]);

LE.defLesson('u1', {
  id: 'u1-3', title: '単位円：P(cos θ, sin θ)', goal: 'sin＝y座標、cos＝x座標、tan＝OPの傾き と言える',
  steps: [
    { t: 'widget', w: 'scribe', text: 'おさらい：筆記体の s・c・t。\n今度は **斜辺が 1** の直角三角形。たてを $y$、よこを $x$ とすると…？',
      intro: '斜辺 1 の直角三角形（点線は半径 1 の円）',
      stages: [
        { deg: 50, u: 160, circle: true, name: '\\theta', th: 'θ', lab: { a: 'y', b: 'x', c: '1' }, tex: { a: 'y', b: 'x', c: '1' }, ask: ['sin', 'cos'], val: { sin: 'y', cos: 'x' },
          goal: '**sin** と **cos** を書いてみよう。分母が 1 だと…？' }
      ], ok: '斜辺が 1 なら $\\sin\\theta=y$、$\\cos\\theta=x$。座標そのもの！' },
    { t: 'say', text: 'この三角形を半径 1 の円＝[[単位円]] に置いて、点 P を回す。90° をこえても、P の座標で sin・cos が決まる。', viz: LE.figs.unit(50),
      ask: { q: 'P の座標を三角比で書くと？', o: ['$(\\C\\theta,\\ \\S\\theta)$', '$(\\S\\theta,\\ \\C\\theta)$', '$(\\T\\theta,\\ 1)$'], why: ['', 'さっき $\\sin\\theta=y$ だったよね。', 'x は cos、y は sin。'] },
      reveal: 'P$(\\C\\theta,\\ \\S\\theta)$。**(x, y) と同じアルファベット順**。\nそして $\\T\\theta=\\dfrac{\\S\\theta}{\\C\\theta}=\\dfrac{y}{x}$ ＝ **OP の傾き**。' },
    { t: 'widget', w: 'unit', tasks: ['neg', 't90'], text: '点 P を動かしてみよう。' },
    { t: 'recap', points: [
      '単位円の P$(\\C\\theta,\\ \\S\\theta)$：**cos＝x、sin＝y**',
      '$\\T\\theta=\\dfrac{\\S\\theta}{\\C\\theta}$＝**OP の傾き**（90° では存在しない）'
    ] }
  ]
});
LE.addTo('u1-3', 'unitc', [
  { q: '単位円上の点 P の座標は？', fig: ['unit', 50], o: ['$(\\C\\theta,\\ \\S\\theta)$', '$(\\S\\theta,\\ \\C\\theta)$', '$(\\C\\theta,\\ \\T\\theta)$', '$(\\T\\theta,\\ \\S\\theta)$'], e: 'x＝cos、y＝sin（アルファベット順）。' },
  { q: '単位円で $\\T\\theta$ が表すものは？', fig: ['unit', 50], o: ['OP の傾き', 'P の x座標', 'P の y座標', 'OP の長さ'], e: '$\\tan\\theta=\\dfrac{y}{x}$＝OP の傾き。' },
  { q: '$\\C180^\\circ$ の値は？', fig: ['unit', 180], o: ['$-1$', '$0$', '$1$', '存在しない'], e: '180° の点は (−1, 0)。' },
  { q: '$\\theta=120^\\circ$ のとき、マイナスになるのは？', fig: ['unit', 120], o: ['$\\C\\theta$ と $\\T\\theta$', '$\\S\\theta$ だけ', '全部', 'どれもならない'], e: 'P は左側（x<0）。sin（高さ）はプラス。' }
]);

LE.defLesson('u1', {
  id: 'u1-4', title: '相互関係（三平方の定理より）', goal: '$\\cos^2\\theta+\\sin^2\\theta=1$ と $1+\\tan^2\\theta=\\dfrac{1}{\\cos^2\\theta}$ を言える',
  steps: [
    { t: 'say', text: '単位円の中の直角三角形は、**斜辺 1、よこ cos θ、たて sin θ**。', viz: LE.figs.unit(40),
      ask: { q: '**三平方の定理**（$a^2+b^2=c^2$）を使うと？', o: ['$\\cos^2\\theta+\\sin^2\\theta=1$', '$\\cos\\theta+\\sin\\theta=1$', '$\\cos^2\\theta-\\sin^2\\theta=1$'], why: ['', '三平方は2乗どうし。', 'たし算だよ。'] },
      reveal: 'これが1つめの公式。' },
    { t: 'widget', w: 'pyth', text: 'シアン（cos²）とピンク（sin²）の正方形。P を動かしても、面積の和は…？' },
    { t: 'show', frames: [
      { say: '2つめの公式は、1つめの**両辺を $\\cos^2\\theta$ で割る**だけ（プリントの「÷cos²θ」の矢印）。', viz: '<div class="fx-big">$$\\dfrac{\\cos^2\\theta}{\\cos^2\\theta}+\\dfrac{\\sin^2\\theta}{\\cos^2\\theta}=\\dfrac{1}{\\cos^2\\theta}$$</div>',
        ask: { q: '$\\dfrac{\\sin^2\\theta}{\\cos^2\\theta}$ をまとめると？', o: ['$\\tan^2\\theta$', '$1$', '$\\sin^2\\theta$'], why: ['', '$\\dfrac{\\sin\\theta}{\\cos\\theta}=\\tan\\theta$ だよ。', '$\\dfrac{\\sin\\theta}{\\cos\\theta}=\\tan\\theta$ だよ。'] },
        reveal: '$$1+\\tan^2\\theta=\\dfrac{1}{\\cos^2\\theta}$$' }
    ] },
    { t: 'build', text: '2つめの公式を組み立てよう。', ans: ['1', '+', '\\tan^2\\theta', '=', '\\dfrac{1}{\\cos^2\\theta}'], extra: ['\\dfrac{1}{\\sin^2\\theta}', '\\cos^2\\theta'],
      hint: '「÷cos²θ」で作ったから、右辺の分母は cos²θ。' },
    { t: 'recap', points: [
      '$\\cos^2\\theta+\\sin^2\\theta=1$（単位円の**三平方**）',
      '$1+\\tan^2\\theta=\\dfrac{1}{\\cos^2\\theta}$（**÷cos²θ**）'
    ] }
  ]
});
LE.addTo('u1-4', 'unitc', [
  { q: '空欄に入るのは？　$\\cos^2\\theta+\\sin^2\\theta=\\ \\square$', o: ['$1$', '$0$', '$\\tan^2\\theta$', '$2$'], e: '単位円の三平方の定理。' },
  { q: '$1+\\tan^2\\theta$ に等しいのは？', o: ['$\\dfrac{1}{\\cos^2\\theta}$', '$\\dfrac{1}{\\sin^2\\theta}$', '$\\cos^2\\theta$', '$1$'], e: '1つめの式を cos²θ で割ってできる。' },
  { q: '$\\theta$ は鋭角で $\\S\\theta=\\dfrac45$。$\\C\\theta$ は？', o: ['$\\dfrac35$', '$-\\dfrac35$', '$\\dfrac45$', '$\\dfrac{1}{5}$'], e: '$\\cos^2\\theta=1-\\dfrac{16}{25}=\\dfrac{9}{25}$。鋭角なのでプラス。' },
  { q: '次のうち、**正しくない**式は？', o: ['$\\sin^2\\theta-\\cos^2\\theta=1$', '$\\cos^2\\theta+\\sin^2\\theta=1$', '$\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}$', '$1+\\tan^2\\theta=\\dfrac{1}{\\cos^2\\theta}$'], e: 'たし算！' }
]);
