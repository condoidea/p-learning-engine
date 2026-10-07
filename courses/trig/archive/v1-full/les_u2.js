/* STAGE 2 還元公式 */
LE.defLesson('u2', {
  id: 'u2-1', title: '90°−θ：名前が入れかわる', goal: '$90^\\circ-\\theta$ の還元公式を使える',
  steps: [
    { t: 'widget', w: 'scribe', text: '直角三角形の、もうひとつの鋭角は **$90^\\circ-\\theta$**。\n三角定規の 60° のときと同じように、**裏返して**その角を左下に置いてみよう。',
      intro: '角 θ の直角三角形',
      stages: [
        { deg: 32, name: '\\theta', th: 'θ', lab: { a: 'a', b: 'b', c: 'c' }, tex: { a: 'a', b: 'b', c: 'c' }, ask: ['sin'],
          goal: 'まず θ の **sin** を書こう' },
        { tr: 'flip', deg: 58, name: '(90^\\circ-\\theta)', th: '90°−θ', lab: { a: 'b', b: 'a', c: 'c' }, tex: { a: 'b', b: 'a', c: 'c' }, ask: ['sin'], val: { sin: '\\C\\theta' },
          btn: '90°−θ を左下に', lead: '裏返して、90°−θ を左下に置こう →「次へ」',
          caption: '裏返すと、<b>たて b・よこ a</b> に入れかわった！',
          goal: '90°−θ の **sin** を書くと…？' }
      ], ok: '$\\sin(90^\\circ-\\theta)=\\dfrac{b}{c}=\\cos\\theta$。たてとよこが入れかわるから、sin と cos も入れかわる！' },
    { t: 'widget', w: 'mirror', mode: '90', text: '単位円でも確かめよう。P を**直線 y=x の鏡**に映すと P\' は $90^\\circ-\\theta$ の点。座標はどうなる？' },
    { t: 'say', text: 'いま、$\\S(90^\\circ-\\theta)=\\C\\theta$ になった。裏返すと、たてとよこが入れかわるから。',
      ask: { q: 'では $\\C(90^\\circ-\\theta)$ は？', o: ['$\\S\\theta$', '$\\C\\theta$', '$-\\S\\theta$'], why: ['', '裏返すと「よこ」が入れかわるよ。', 'マイナスはつかない（どちらも鋭角）。'] },
      reveal: 'フック：**90°−θ は「名前チェンジ」**。sin ↔ cos が入れかわり、tan は**ひっくり返る**（逆数）。\n$\\T(90^\\circ-\\theta)=\\dfrac{1}{\\T\\theta}$' },
    { t: 'fill', text: '3つの式を完成させよう。',
      viz: '<div class="fx-rows"><div>$\\S(90^\\circ-\\theta)=$ {{0}}</div><div>$\\C(90^\\circ-\\theta)=$ {{1}}</div><div>$\\T(90^\\circ-\\theta)=$ {{2}}</div></div>',
      a: ['$\\C\\theta$', '$\\S\\theta$', '$\\dfrac{1}{\\T\\theta}$'], extra: ['$-\\C\\theta$', '$\\T\\theta$'],
      hint: '名前チェンジ：sin↔cos、tan は逆数。' },
    { t: 'quiz', q: '$\\S70^\\circ$ と等しいのは？', o: ['$\\C20^\\circ$', '$\\C70^\\circ$', '$\\S20^\\circ$', '$-\\C20^\\circ$'],
      why: ['正解！ $70^\\circ=90^\\circ-20^\\circ$ なので、名前チェンジで cos 20°。', 'それは別の値。', '90°−θ では名前が変わる。', 'マイナスはつかない（どちらも鋭角）。'] },
    { t: 'show', frames: [
      { say: '応用：$\\sin^2 20^\\circ+\\sin^2 70^\\circ$ の値は？\n$70^\\circ=90^\\circ-20^\\circ$ に気づけるかがカギ。', viz: '<div class="fx-big">$$\\sin70^\\circ=\\sin(90^\\circ-20^\\circ)$$</div>',
        ask: { q: '$\\S70^\\circ$ を書きかえると？', o: ['$\\C20^\\circ$', '$\\C70^\\circ$', '$\\S20^\\circ$'], why: ['', '90°−θ の θ は 20°。', '名前チェンジを忘れずに。'] } },
      { say: 'すると…', viz: '<div class="fx-big">$$\\sin^2 20^\\circ+\\cos^2 20^\\circ$$</div>',
        ask: { q: 'この値は？', o: ['$1$', '$0$', '$2$'], why: ['', '相互関係を思い出そう。', '相互関係を思い出そう。'] }, reveal: '相互関係 $\\cos^2\\theta+\\sin^2\\theta=1$ の出番！' }
    ] },
    { t: 'recap', points: [
      '**90°−θ は名前チェンジ**：$\\S(90^\\circ-\\theta)=\\C\\theta$、$\\C(90^\\circ-\\theta)=\\S\\theta$',
      '$\\T(90^\\circ-\\theta)=\\dfrac{1}{\\T\\theta}$（tan は逆数）',
      '単位円では「y=x の鏡」→ x と y が入れかわる'
    ] }
  ]
});
LE.addTo('u2-1', 'reduce', [
  { q: '$\\S(90^\\circ-\\theta)$ に等しいのは？', o: ['$\\C\\theta$', '$\\S\\theta$', '$-\\C\\theta$', '$\\dfrac{1}{\\S\\theta}$'], e: '90°−θ は名前チェンジ。' },
  { q: '$\\C(90^\\circ-\\theta)$ に等しいのは？', o: ['$\\S\\theta$', '$\\C\\theta$', '$-\\S\\theta$', '$\\T\\theta$'], e: '90°−θ は名前チェンジ。' },
  { q: '$\\T(90^\\circ-\\theta)$ に等しいのは？', o: ['$\\dfrac{1}{\\T\\theta}$', '$\\T\\theta$', '$-\\T\\theta$', '$\\dfrac{1}{\\C\\theta}$'], e: 'tan はひっくり返る（逆数）。' },
  { q: '$\\C50^\\circ$ と等しいのは？', o: ['$\\S40^\\circ$', '$\\S50^\\circ$', '$\\C40^\\circ$', '$-\\S40^\\circ$'], e: '$50^\\circ=90^\\circ-40^\\circ$ → $\\sin40^\\circ$。' },
  { q: '$\\T10^\\circ\\times\\T80^\\circ$ の値は？', o: ['$1$', '$0$', '$\\T90^\\circ$', '$\\sqrt3$'], e: '$\\tan80^\\circ=\\dfrac{1}{\\tan10^\\circ}$ なので、かけると 1。' },
  { q: '$\\cos^2 35^\\circ+\\cos^2 55^\\circ$ の値は？', o: ['$1$', '$0$', '$2$', '$\\dfrac12$'], e: '$\\cos55^\\circ=\\sin35^\\circ$ → $\\cos^2 35^\\circ+\\sin^2 35^\\circ=1$。' }
]);

LE.defLesson('u2', {
  id: 'u2-2', title: '180°−θ：sin だけ生き残る', goal: '$180^\\circ-\\theta$ の還元公式を使える',
  steps: [
    { t: 'say', text: '今度の鏡は **y軸**。\n単位円の点 P（角 θ）を左右に映すと、映った点 P\' の角は $180^\\circ-\\theta$。', viz: LE.figs.unit(30),
      ask: { q: '左右に映すと、P の座標はどう変わると思う？（予想でOK）', o: ['x の符号だけ反対になる', 'y の符号だけ反対になる', 'x と y が入れかわる'], why: ['', '左右に映すとき、高さは変わらないよ。', 'それは y=x の鏡（90°−θ）。'] },
      reveal: '予想どおりか、動かして確かめよう。' },
    { t: 'widget', w: 'mirror', mode: '180', text: '今度は P を**y軸の鏡**に映す。P\' は $180^\\circ-\\theta$ の点。何が変わる？' },
    { t: 'say', text: 'y軸で左右に映すと、**高さ（y）はそのまま、x だけ符号が反対**。\nだから $\\S(180^\\circ-\\theta)=\\S\\theta$。',
      ask: { q: 'では $\\C(180^\\circ-\\theta)$ は？', o: ['$-\\C\\theta$', '$\\C\\theta$', '$\\S\\theta$'], why: ['', 'x（cos）は符号が反対になる。', '180°−θ では名前は変わらない。'] },
      reveal: '$\\C(180^\\circ-\\theta)=-\\C\\theta$。tan は $\\dfrac{y}{x}$ なので、これもマイナス：$\\T(180^\\circ-\\theta)=-\\T\\theta$' },
    { t: 'say', text: '2つの還元公式をくらべてみよう。', viz: '<div class="vz-row"><div class="bx c1">90°−θ<small>名前チェンジ（tan は逆数）</small></div><div class="bx c2">180°−θ<small>名前そのまま・？？？</small></div></div>',
      ask: { q: '180°−θ で、マイナスが**つかない**のは？', o: ['sin だけ', 'cos だけ', '全部つく'], why: ['', 'cos（x）は符号が反対になる。', 'sin（高さ）は変わらない。'] },
      reveal: 'フック：**180°−θ は「名前そのまま、sin だけ生き残る」**。90°−θ（名前チェンジ）とセットで覚えよう。' },
    { t: 'build', text: 'cos の 180°−θ を組み立てよう。', pre: '\\C(180^\\circ-\\theta)', ans: ['=', '-', '\\C\\theta'], extra: ['+', '\\S\\theta'],
      hint: '名前はそのまま（cos）、そしてマイナス。' },
    { t: 'match', text: '90°−θ と 180°−θ をまぜて結ぼう。',
      pairs: [['$\\S(180^\\circ-\\theta)$', '$\\S\\theta$'], ['$\\C(180^\\circ-\\theta)$', '$-\\C\\theta$'], ['$\\S(90^\\circ-\\theta)$', '$\\C\\theta$'], ['$\\T(180^\\circ-\\theta)$', '$-\\T\\theta$']] },
    { t: 'recap', points: [
      '**180°−θ は名前そのまま、sin だけプラス**',
      '$\\S(180^\\circ-\\theta)=\\S\\theta$、$\\C(180^\\circ-\\theta)=-\\C\\theta$、$\\T(180^\\circ-\\theta)=-\\T\\theta$',
      '単位円では「y軸の鏡」→ x の符号だけ反対'
    ] }
  ]
});
LE.addTo('u2-2', 'reduce', [
  { q: '$\\S(180^\\circ-\\theta)$ に等しいのは？', o: ['$\\S\\theta$', '$-\\S\\theta$', '$\\C\\theta$', '$-\\C\\theta$'], e: '180°−θ は名前そのまま、sin だけプラス。' },
  { q: '$\\C(180^\\circ-\\theta)$ に等しいのは？', o: ['$-\\C\\theta$', '$\\C\\theta$', '$\\S\\theta$', '$-\\S\\theta$'], e: '名前そのまま、cos はマイナス。' },
  { q: '$\\T(180^\\circ-\\theta)$ に等しいのは？', o: ['$-\\T\\theta$', '$\\T\\theta$', '$\\dfrac{1}{\\T\\theta}$', '$-\\dfrac{1}{\\T\\theta}$'], e: '名前そのまま、tan はマイナス。' },
  { q: '$\\C160^\\circ$ と等しいのは？', o: ['$-\\C20^\\circ$', '$\\C20^\\circ$', '$-\\S20^\\circ$', '$\\S70^\\circ$'], e: '$160^\\circ=180^\\circ-20^\\circ$。名前そのまま、cos はマイナス。' },
  { q: '$\\S130^\\circ$ と等しいのは？', o: ['$\\S50^\\circ$', '$-\\S50^\\circ$', '$\\C50^\\circ$', '$-\\C40^\\circ$'], e: '$130^\\circ=180^\\circ-50^\\circ$。sin はそのまま。' },
  { q: '次のうち**まちがっている**のは？', o: ['$\\S(180^\\circ-\\theta)=-\\S\\theta$', '$\\C(180^\\circ-\\theta)=-\\C\\theta$', '$\\S(90^\\circ-\\theta)=\\C\\theta$', '$\\T(180^\\circ-\\theta)=-\\T\\theta$'], e: '180°−θ で sin は生き残る（プラスのまま）。' },
  { q: '単位円で、$180^\\circ-\\theta$ の点は θ の点をどう動かしたもの？', o: ['y軸について対称に映した', 'x軸について対称に映した', '直線 y=x について映した', '原点について対称に映した'], e: '左右反転＝y軸の鏡。だから y（sin）は同じ。' }
]);

LE.defLesson('u2', {
  id: 'u2-3', title: '鈍角の値を出してみよう', goal: '120°・135°・150° の三角比を、還元公式か単位円で出せる',
  steps: [
    { t: 'say', text: '鈍角の値は「**180° から引いて、鋭角に直す**」のが基本。\n例：$150^\\circ=180^\\circ-30^\\circ$',
      ask: { q: '$\\C150^\\circ$ は？', o: ['$-\\dfrac{\\sqrt3}{2}$', '$\\dfrac{\\sqrt3}{2}$', '$-\\dfrac12$'], why: ['', '180°−θ で cos はマイナスになる。', 'それは cos 120°。150° は 30° に直す。'] },
      reveal: '$\\C150^\\circ=-\\C30^\\circ=-\\dfrac{\\sqrt3}{2}$。名前そのまま、cos はマイナス。' },
    { t: 'show', frames: [
      { say: 'もう1問。$\\T135^\\circ$ の値は？', viz: '<div class="fx-big">$$135^\\circ=180^\\circ-\\ ?$$</div>',
        ask: { q: '何度を引いた形？', o: ['$45^\\circ$', '$35^\\circ$', '$90^\\circ$'], why: ['', '$180-135=45$。', '$180-135=45$。'] } },
      { say: '名前そのまま、tan はマイナス。', viz: '<div class="fx-big">$$\\tan135^\\circ=-\\tan45^\\circ$$</div>',
        ask: { q: '$\\T135^\\circ$ は？', o: ['$-1$', '$1$', '$-\\sqrt3$'], why: ['', 'マイナスを忘れずに。', 'tan 45° は 1。'] } }
    ] },
    { t: 'fill', text: '120°・135°・150° の sin を完成させよう（sin は生き残る！）。',
      viz: '<table class="vz-tbl"><tr><th>θ</th><th>120°</th><th>135°</th><th>150°</th></tr><tr><td>＝180°−</td><td>60°</td><td>45°</td><td>30°</td></tr><tr><td>$\\S$</td><td>{{0}}</td><td>{{1}}</td><td>{{2}}</td></tr></table>',
      a: ['$\\dfrac{\\sqrt3}{2}$', '$\\dfrac{1}{\\sqrt2}$', '$\\dfrac12$'], extra: ['$-\\dfrac12$', '$-\\dfrac{\\sqrt3}{2}$'] },
    { t: 'fill', text: '今度は cos（マイナスがつく！）。',
      viz: '<table class="vz-tbl"><tr><th>θ</th><th>120°</th><th>135°</th><th>150°</th></tr><tr><td>$\\C$</td><td>{{0}}</td><td>{{1}}</td><td>{{2}}</td></tr></table>',
      a: ['$-\\dfrac12$', '$-\\dfrac{1}{\\sqrt2}$', '$-\\dfrac{\\sqrt3}{2}$'], extra: ['$\\dfrac12$', '$\\dfrac{\\sqrt3}{2}$'] },
    { t: 'widget', w: 'unit', tasks: ['s150', 'c120'], text: '単位円でも確かめよう。' },
    { t: 'quiz', q: '$0^\\circ\\leqq\\theta\\leqq180^\\circ$ で $\\S\\theta=\\dfrac12$ を満たす θ は？',
      o: ['$30^\\circ$ と $150^\\circ$', '$30^\\circ$ だけ', '$60^\\circ$ と $120^\\circ$', '$150^\\circ$ だけ'],
      why: ['正解！ 高さ 1/2 の点は、左右に2つある。', '鈍角にも、もうひとつある（sin は生き残るから）。', 'それは sin＝√3/2 のとき。', '鋭角の 30° も忘れずに。'] },
    { t: 'recap', points: [
      '鈍角は「180° から引いて鋭角に」→ 名前そのまま、sin以外マイナス',
      '$\\S\\theta=k$（$0<k<1$）の答えは **2つ**（θ と 180°−θ）',
      '120°・135°・150° の sin は 60°・45°・30° と同じ'
    ] }
  ]
});
LE.addTo('u2-3', 'reduce', [
  { q: '$\\S120^\\circ$ の値は？', fig: ['unit', 120], o: ['$\\dfrac{\\sqrt3}{2}$', '$-\\dfrac{\\sqrt3}{2}$', '$\\dfrac12$', '$-\\dfrac12$'], e: '$\\sin120^\\circ=\\sin60^\\circ$。' },
  { q: '$\\C120^\\circ$ の値は？', fig: ['unit', 120], o: ['$-\\dfrac12$', '$\\dfrac12$', '$-\\dfrac{\\sqrt3}{2}$', '$\\dfrac{\\sqrt3}{2}$'], e: '$\\cos120^\\circ=-\\cos60^\\circ$。' },
  { q: '$\\C135^\\circ$ の値は？', o: ['$-\\dfrac{1}{\\sqrt2}$', '$\\dfrac{1}{\\sqrt2}$', '$-1$', '$-\\dfrac{\\sqrt3}{2}$'], e: '$\\cos135^\\circ=-\\cos45^\\circ$。' },
  { q: '$\\T150^\\circ$ の値は？', o: ['$-\\dfrac{1}{\\sqrt3}$', '$\\dfrac{1}{\\sqrt3}$', '$-\\sqrt3$', '$\\sqrt3$'], e: '$\\tan150^\\circ=-\\tan30^\\circ$。' },
  { q: '$\\T120^\\circ$ の値は？', o: ['$-\\sqrt3$', '$\\sqrt3$', '$-\\dfrac{1}{\\sqrt3}$', '$-1$'], e: '$\\tan120^\\circ=-\\tan60^\\circ$。' },
  { q: '$\\S150^\\circ$ の値は？', fig: ['unit', 150], o: ['$\\dfrac12$', '$-\\dfrac12$', '$\\dfrac{\\sqrt3}{2}$', '$-\\dfrac{\\sqrt3}{2}$'], e: 'sin は生き残る：$\\sin150^\\circ=\\sin30^\\circ$。' },
  { q: '$0^\\circ\\leqq\\theta\\leqq180^\\circ$ で $\\C\\theta=-\\dfrac{1}{\\sqrt2}$ を満たす θ は？', o: ['$135^\\circ$', '$45^\\circ$', '$45^\\circ$ と $135^\\circ$', '$150^\\circ$'], e: 'cos は x座標。x＝−1/√2 の点は1つだけ（135°）。' }
]);
