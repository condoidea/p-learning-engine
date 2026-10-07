/* STAGE 2 還元公式 */
LE.defLesson('u2', {
  id: 'u2-1', title: '90°−θ：名前が入れかわる', goal: '$90^\\circ-\\theta$ の還元公式を使える',
  steps: [
    { t: 'say', text: '直角三角形の、もうひとつの鋭角は **$90^\\circ-\\theta$**。\nそっちの角から見ると、**「たて」と「よこ」が入れかわる**。\nだから $\\S(90^\\circ-\\theta)=\\dfrac{b}{c}=\\C\\theta$！',
      viz: LE.figs.rt({ th: 'θ' }) + '<div class="note">右上の角が 90°−θ。そこから見た「たて」は b、「よこ」は a</div>' },
    { t: 'widget', w: 'mirror', mode: '90', text: '単位円でも確かめよう。P を**直線 y=x の鏡**に映すと P\' は $90^\\circ-\\theta$ の点。座標はどうなる？' },
    { t: 'say', text: 'フック：**90°−θ は「名前チェンジ」**。\nsin ↔ cos が入れかわり、tan は**ひっくり返る**（逆数）。\n$\\T(90^\\circ-\\theta)=\\dfrac{1}{\\T\\theta}$' },
    { t: 'fill', text: '3つの式を完成させよう。',
      viz: '<div class="fx-rows"><div>$\\S(90^\\circ-\\theta)=$ {{0}}</div><div>$\\C(90^\\circ-\\theta)=$ {{1}}</div><div>$\\T(90^\\circ-\\theta)=$ {{2}}</div></div>',
      a: ['$\\C\\theta$', '$\\S\\theta$', '$\\dfrac{1}{\\T\\theta}$'], extra: ['$-\\C\\theta$', '$\\T\\theta$'],
      hint: '名前チェンジ：sin↔cos、tan は逆数。' },
    { t: 'quiz', q: '$\\S70^\\circ$ と等しいのは？', o: ['$\\C20^\\circ$', '$\\C70^\\circ$', '$\\S20^\\circ$', '$-\\C20^\\circ$'],
      why: ['正解！ $70^\\circ=90^\\circ-20^\\circ$ なので、名前チェンジで cos 20°。', 'それは別の値。', '90°−θ では名前が変わる。', 'マイナスはつかない（どちらも鋭角）。'] },
    { t: 'steps', q: '$\\sin^2 20^\\circ+\\sin^2 70^\\circ$ の値は？', steps: [
      '$\\sin70^\\circ=\\sin(90^\\circ-20^\\circ)=\\cos20^\\circ$',
      'なので $\\sin^2 20^\\circ+\\cos^2 20^\\circ$',
      '相互関係より $=1$'] },
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
    { t: 'widget', w: 'mirror', mode: '180', text: '今度は P を**y軸の鏡**に映す。P\' は $180^\\circ-\\theta$ の点。何が変わる？' },
    { t: 'say', text: 'y軸で左右に映すと、**高さ（y）はそのまま、x だけ符号が反対**。\nだから\n$\\S(180^\\circ-\\theta)=\\S\\theta$\n$\\C(180^\\circ-\\theta)=-\\C\\theta$\n$\\T(180^\\circ-\\theta)=-\\T\\theta$' },
    { t: 'say', text: 'フック：**180°−θ は「名前はそのまま、sin だけ生き残る（ほかはマイナス）」**。\n90°−θ（名前チェンジ）とセットで覚えよう。',
      viz: '<div class="vz-row"><div class="bx c1">90°−θ<small>名前チェンジ（tan は逆数）</small></div><div class="bx c2">180°−θ<small>名前そのまま・sin以外マイナス</small></div></div>' },
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
    { t: 'say', text: '鈍角の値は「**180° から引いて、鋭角に直す**」のが基本。\n例：$150^\\circ=180^\\circ-30^\\circ$ → $\\C150^\\circ=-\\C30^\\circ=-\\dfrac{\\sqrt3}{2}$' },
    { t: 'steps', q: '$\\T135^\\circ$ の値は？', steps: ['$135^\\circ=180^\\circ-45^\\circ$', '名前そのまま、tan はマイナス：$\\tan135^\\circ=-\\tan45^\\circ$', '$=-1$'] },
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
