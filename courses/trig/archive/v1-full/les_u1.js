/* STAGE 1 三角比のきほん */
LE.gloss({
  '斜辺': '直角三角形で、直角の向かいにあるいちばん長い辺。',
  '単位円': '原点を中心とする半径1の円。斜辺が1になるので、sin・cos がそのまま座標になる。',
  '有名角': '30°・45°・60° のように、三角比の値がきれいに出る角。三角定規の角。'
});

LE.defLesson('u1', {
  id: 'u1-1', title: '直角三角形の sin・cos・tan', goal: '図を見て sin・cos・tan を辺の比で言える',
  steps: [
    { t: 'say', text: '三角比は、直角三角形の**辺の比**。\n向きはいつもこれ：**θ は左下、直角は右下**。', viz: LE.figs.rt({ a: '', b: '', c: '' }),
      ask: { q: 'この三角形で、いちばん長い辺はどれ？', o: ['斜めの辺', 'たての辺', 'よこの辺'], why: ['', 'たては、斜めの辺より短い。', 'よこは、斜めの辺より短い。'] },
      reveal: 'そう、直角の向かいの**斜めの辺がいちばん長い**＝[[斜辺]] $c$。\nたてを $a$、よこを $b$ と呼ぶよ。', rviz: LE.figs.rt() },
    { t: 'widget', w: 'sct', text: '覚え方は「**筆記体**」。\n① θ の角（左下）のあたりから、三角形の辺に重ねて $s$・$c$・$t$ を筆記体で書く\n② ペンが**最初に通った辺が分母**、**次に通った辺が分子**\nボタンを押して、ペンの動きを見てみよう。' },
    { t: 'fill', text: '覚えたてのうちに、3つの式を完成させよう。',
      viz: LE.figs.rt() + '<div class="fx-rows"><div>$\\S\\theta=$ {{0}}</div><div>$\\C\\theta=$ {{1}}</div><div>$\\T\\theta=$ {{2}}</div></div>',
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
  id: 'u1-2', title: '30°・45°・60° は三角定規で', goal: '三角定規の辺の比から、有名角の sin・cos・tan を出せる',
  steps: [
    { t: 'show', frames: [
      { say: 'テストによく出る **30°・45°・60°**。\nじつは、筆箱の**三角定規の2枚**から全部出せる。\n…でも、辺の長さって知ってる？', viz: LE.figs.rulers({ blank: true }) },
      { say: '1枚目のひみつ。\n**正三角形**（3辺とも2、角はぜんぶ60°）を用意して…', viz: LE.figs.eqCut(0) },
      { say: '真ん中で**半分に切る**！\n底辺の 2 が **1 と 1** に分かれる。斜辺は 2 のまま。角は 30° と 60° と 90°。', viz: LE.figs.eqCut(1) },
      { say: '残った「たて」の長さは？', viz: LE.figs.eqCut(2), ask: { q: '三平方の定理 $?^2+1^2=2^2$ を解くと？', o: ['$\\sqrt3$', '$\\sqrt2$', '$1$'], why: ['', '$?^2=4-1=3$ だよ。', '$?^2=4-1=3$ だよ。'] } },
      { say: '**三平方の定理**で $?^2+1^2=2^2$ → $?=\\sqrt3$。\n合言葉は「**いち・に・ルート3**」（2 はいちばん長い斜辺）。', viz: LE.figs.eqCut(3) },
      { say: '2枚目のひみつ。\n**正方形**（1辺が1）を、**対角線で半分に切る**と…', viz: LE.figs.sqCut(0) },
      { say: '45° の定規のできあがり。2辺は 1 と 1。斜辺は？', viz: LE.figs.sqCut(1), ask: { q: '$1^2+1^2=?^2$ を解くと？', o: ['$\\sqrt2$', '$2$', '$\\sqrt3$'], why: ['', '$?^2=2$ だから、$?$ は 2 そのものではない。', '$?^2=1+1=2$ だよ。'] } },
      { say: '$1^2+1^2=?^2$ → $?=\\sqrt2$。\n合言葉は「**いち・いち・ルート2**」。', viz: LE.figs.sqCut(2) }
    ] },
    { t: 'fill', text: 'さっそく思い出そう。2枚の定規の辺の比は？',
      viz: LE.figs.rulers({ blank: true }) + '<div class="fx-rows"><div>30°・60° の定規：　1 : {{0}} : {{1}}　<small>（短い辺 : 斜辺 : 残りの辺）</small></div><div>45° の定規：　1 : 1 : {{2}}</div></div>',
      a: ['2', '$\\sqrt3$', '$\\sqrt2$'], extra: ['3', '$\\sqrt5$'],
      hint: '正三角形を半分 →「いち・に・ルート3」、正方形を半分 →「いち・いち・ルート2」。',
      ok: '忘れたら、正三角形と正方形を半分に切った絵を思い出せばOK。' },
    { t: 'widget', w: 'scribe', text: '値の出し方は Lesson 1-1 と同じ。**その角を左下に置いて、筆記体の s・c・t**。\nボタンを押して、ペンを走らせよう（1番目に通った辺が分母、2番目が分子）。',
      intro: '30° の定規：たて 1・よこ √3・斜辺 2',
      stages: [
        { deg: 30, name: '30^\\circ', th: '30°', lab: { a: '1', b: '√3', c: '2' }, tex: { a: '1', b: '\\sqrt3', c: '2' }, ask: ['sin', 'tan'],
          goal: '30° の定規。**sin** と **tan** のボタンを押して、筆記体を書こう' },
        { tr: 'flip', deg: 60, name: '60^\\circ', th: '60°', lab: { a: '√3', b: '1', c: '2' }, tex: { a: '\\sqrt3', b: '1', c: '2' }, ask: ['sin', 'cos'],
          btn: '60° を左下に', lead: '次は 60°。定規を<b>裏返して</b> 60° を左下に置こう →「次へ」',
          caption: '定規を裏返すと… <b>たて √3・よこ 1</b> に入れかわった！（斜辺は 2 のまま）',
          goal: '60° でも **sin** と **cos** を書いてみよう' },
        { tr: 'morph', deg: 45, name: '45^\\circ', th: '45°', lab: { a: '1', b: '1', c: '√2' }, tex: { a: '1', b: '1', c: '\\sqrt2' }, ask: ['sin', 'tan'], val: { tan: '1' },
          btn: '45° の定規へ', lead: '最後は 45° の定規 →「次へ」',
          caption: '45° の定規：たて も よこ も 1、斜辺は √2',
          goal: '45° の **sin** と **tan** は？' }
      ], ok: 'どの角でも「左下に置いて、筆記体」。これで表を丸暗記しなくていい！' },
    { t: 'widget', w: 'ruler', text: '自分でやってみよう。お題の角を左下に置いた定規が出てくるよ。**分母の辺 → 分子の辺** の順にタップ！' },
    { t: 'say', text: '表で見たときのフック。\nsin は $\\dfrac{\\sqrt1}{2},\\ \\dfrac{\\sqrt2}{2},\\ \\dfrac{\\sqrt3}{2}$（30°→60°）と、**ルートの中が 1・2・3** と増えていく。\ncos はその**逆順**。',
      ask: { q: 'では、$\\C30^\\circ$ は？（sin の逆順）', o: ['$\\dfrac{\\sqrt3}{2}$', '$\\dfrac{\\sqrt1}{2}$', '$\\dfrac{\\sqrt2}{2}$'], why: ['', 'それは cos 60°。cos は 30° が「ルート3」から始まる。', 'それは 45°。'] },
      reveal: '正解！ 表にするとこう。', rviz: '<table class="vz-tbl"><tr><th>θ</th><th>30°</th><th>45°</th><th>60°</th></tr><tr><td>$\\S$</td><td>$\\frac{\\sqrt1}{2}$</td><td>$\\frac{\\sqrt2}{2}$</td><td>$\\frac{\\sqrt3}{2}$</td></tr><tr><td>$\\C$</td><td>$\\frac{\\sqrt3}{2}$</td><td>$\\frac{\\sqrt2}{2}$</td><td>$\\frac{\\sqrt1}{2}$</td></tr><tr><td>$\\T$</td><td>$\\frac{1}{\\sqrt3}$</td><td>$1$</td><td>$\\sqrt3$</td></tr></table>' },
    { t: 'match', text: '値を結ぼう。迷ったら定規を思い浮かべて。',
      pairs: [['$\\S30^\\circ$', '$\\dfrac12$'], ['$\\C30^\\circ$', '$\\dfrac{\\sqrt3}{2}$'], ['$\\T45^\\circ$', '$1$'], ['$\\T60^\\circ$', '$\\sqrt3$']] },
    { t: 'num', viz: LE.figs.rulers(), text: '$\\T60^\\circ=\\sqrt3$ を小数で言うと？（小数第2位まで）', answer: 1.73, tol: 0.011, hint: '$\\sqrt3=1.7320\\ldots$（ひとなみにおごれや）', solve: '$\\sqrt3\\fallingdotseq1.73$' },
    { t: 'recap', points: [
      '正三角形を半分 → **1 : 2 : √3**（30°・60°）、正方形を半分 → **1 : 1 : √2**（45°）',
      '値は「その角を左下に置いて」s・c・t。60° は定規が裏返る（たて √3・よこ 1）',
      'sin は $\\dfrac{\\sqrt1}{2},\\dfrac{\\sqrt2}{2},\\dfrac{\\sqrt3}{2}$（30°→60°）、cos はその逆順'
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
    { t: 'widget', w: 'scribe', text: 'おさらい：筆記体の s・c・t。\n今度は **斜辺が 1** の直角三角形。たてを $y$、よこを $x$ とすると…？',
      intro: '斜辺 1 の直角三角形（点線は半径 1 の円）',
      stages: [
        { deg: 50, u: 160, circle: true, name: '\\theta', th: 'θ', lab: { a: 'y', b: 'x', c: '1' }, tex: { a: 'y', b: 'x', c: '1' }, ask: ['sin', 'cos'], val: { sin: 'y', cos: 'x' },
          goal: '**sin** と **cos** を書いてみよう。分母が 1 だと…？' }
      ], ok: '斜辺が 1 なら、$\\sin\\theta=y$、$\\cos\\theta=x$。座標そのもの！これが単位円のアイデア。' },
    { t: 'say', text: 'でも直角三角形だと、90° より大きい角は作れない。\nそこで、さっきの「斜辺 1」の三角形を、半径 1 の円＝[[単位円]] の中に置いて、点 P を回していく。', viz: LE.figs.unit(50),
      ask: { q: '円の上の点 P の座標 $(x,\\ y)$ を、三角比で書くと？', o: ['$(\\C\\theta,\\ \\S\\theta)$', '$(\\S\\theta,\\ \\C\\theta)$', '$(\\T\\theta,\\ 1)$'], why: ['', 'さっき $\\sin\\theta=y$ だったよね。y は2番目。', 'x は cos、y は sin だったね。'] },
      reveal: 'P$(\\C\\theta,\\ \\S\\theta)$。フック：**(x, y) と同じアルファベット順**（c が先、s があと）。\nこれなら θ が 90° をこえても、P の座標で sin・cos が決まる！' },
    { t: 'say', text: 'tan はどうなる？\n$\\T\\theta=\\dfrac{\\S\\theta}{\\C\\theta}=\\dfrac{y}{x}$', viz: LE.figs.unit(50),
      ask: { q: '$\\dfrac{y}{x}$（たて÷よこ）は、図の何を表している？', o: ['OP の傾き', 'OP の長さ', 'P の高さ'], why: ['', '長さは 1（半径）。', '高さは y＝sin θ。'] },
      reveal: '$\\T\\theta$ ＝ **OP の傾き**。だから OP がたてになる 90° では、tan は存在しない。' },
    { t: 'widget', w: 'unit', tasks: ['neg', 'eq', 't90'], text: '点 P を動かしてみよう。背景でずっと回っているのも、この単位円だよ。' },
    { t: 'quiz', viz: LE.figs.unit(130), q: '$90^\\circ<\\theta<180^\\circ$（鈍角）のとき、**マイナス**になるのは？',
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
    { t: 'say', text: '単位円の中の直角三角形は、**斜辺 1、よこ cos θ、たて sin θ**。', viz: LE.figs.unit(40),
      ask: { q: 'この三角形で**三平方の定理**（よこ²＋たて²＝斜辺²）を使うと？', o: ['$\\cos^2\\theta+\\sin^2\\theta=1$', '$\\cos\\theta+\\sin\\theta=1$', '$\\cos^2\\theta-\\sin^2\\theta=1$'], why: ['', '三平方は2乗どうしのたし算。', '引き算ではなく、たし算。'] },
      reveal: 'それが1つめの公式！ 次の図で、本当にいつも 1 になるか確かめよう。' },
    { t: 'widget', w: 'pyth', text: 'シアン（cos²）とピンク（sin²）の正方形。P を動かしても、面積の和は…？' },
    { t: 'build', viz: LE.figs.unit(40), text: '1つめの公式を組み立てよう。', ans: ['\\cos^2\\theta', '+', '\\sin^2\\theta', '=', '1'], extra: ['\\tan^2\\theta', '2'],
      ok: '「単位円の三平方」。この式がすべての出発点。' },
    { t: 'show', frames: [
      { say: '2つめの公式は、1つめから**作れる**。\n$\\cos^2\\theta+\\sin^2\\theta=1$ の両辺を、$\\cos^2\\theta$ で割ってみよう。', viz: '<div class="fx-big">$$\\cos^2\\theta+\\sin^2\\theta=1$$</div>' },
      { say: '全部を $\\cos^2\\theta$ で割ると…', viz: '<div class="fx-big">$$\\dfrac{\\cos^2\\theta}{\\cos^2\\theta}+\\dfrac{\\sin^2\\theta}{\\cos^2\\theta}=\\dfrac{1}{\\cos^2\\theta}$$</div>' },
      { say: '左の1つめは 1。2つめは $\\left(\\dfrac{\\sin\\theta}{\\cos\\theta}\\right)^2=\\tan^2\\theta$！', viz: '<div class="fx-big">$$1+\\tan^2\\theta=\\dfrac{1}{\\cos^2\\theta}$$</div>', ask: { q: '左の2つめ $\\dfrac{\\sin^2\\theta}{\\cos^2\\theta}$ をまとめると？', o: ['$\\tan^2\\theta$', '$1$', '$\\sin^2\\theta$'], why: ['', '$\\dfrac{\\sin\\theta}{\\cos\\theta}=\\tan\\theta$ を思い出そう。', '$\\dfrac{\\sin\\theta}{\\cos\\theta}=\\tan\\theta$ を思い出そう。'] } },
      { say: 'プリントの「÷cos²θ」の矢印は、このこと。\n忘れても、1つめの式から30秒で作り直せる。', viz: '<div class="fx-big">$$1+\\tan^2\\theta=\\dfrac{1}{\\cos^2\\theta}$$</div>' }
    ] },
    { t: 'build', text: '2つめの公式を組み立てよう。', ans: ['1', '+', '\\tan^2\\theta', '=', '\\dfrac{1}{\\cos^2\\theta}'], extra: ['\\dfrac{1}{\\sin^2\\theta}', '\\cos^2\\theta'],
      hint: '「÷cos²θ」で作ったから、右辺の分母は cos²θ。' },
    { t: 'show', frames: [
      { say: '例題：$\\theta$ は鋭角で $\\S\\theta=\\dfrac35$。$\\C\\theta$ と $\\T\\theta$ は？\nまず $\\cos^2\\theta=1-\\sin^2\\theta$。', viz: '<div class="fx-big">$$\\cos^2\\theta=1-\\dfrac{9}{25}=\\ ?$$</div>',
        ask: { q: '$\\cos^2\\theta$ は？', o: ['$\\dfrac{16}{25}$', '$\\dfrac{4}{5}$', '$\\dfrac{9}{25}$'], why: ['', 'まだ2乗のまま。$1-\\dfrac{9}{25}$ を計算しよう。', 'それは $\\sin^2\\theta$。'] } },
      { say: '鋭角なので、$\\cos\\theta$ はプラス。', viz: '<div class="fx-big">$$\\cos^2\\theta=\\dfrac{16}{25}$$</div>',
        ask: { q: '$\\C\\theta$ は？', o: ['$\\dfrac45$', '$-\\dfrac45$', '$\\pm\\dfrac45$'], why: ['', '鋭角なら cos はプラス。', '鋭角と決まっているので、1つに決まる。'] } },
      { say: '最後に $\\T\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}$。', viz: '<div class="fx-big">$$\\tan\\theta=\\dfrac{3/5}{4/5}=\\ ?$$</div>',
        ask: { q: '$\\T\\theta$ は？', o: ['$\\dfrac34$', '$\\dfrac43$', '$\\dfrac35$'], why: ['', '分母と分子が逆。', 'それは sin。'] },
        reveal: '3・4・5 の直角三角形を描いても一発！' }
    ] },
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
