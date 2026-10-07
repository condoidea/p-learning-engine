/* STAGE 2 還元公式（プリント上段中央の枠） */
LE.defLesson('u2', {
  id: 'u2-1', title: '90°−θ：名前が入れかわる', goal: '$90^\\circ-\\theta$ の3つの式を言える',
  steps: [
    { t: 'widget', w: 'scribe', text: '直角三角形の、もうひとつの鋭角は **$90^\\circ-\\theta$**。\n三角定規の 60° のときと同じように、**裏返して**その角を左下に置いてみよう。',
      intro: '角 θ の直角三角形',
      stages: [
        { deg: 32, name: '\\theta', th: 'θ', lab: { a: 'a', b: 'b', c: 'c' }, tex: { a: 'a', b: 'b', c: 'c' }, ask: ['sin'], goal: 'まず θ の **sin** を書こう' },
        { tr: 'flip', deg: 58, name: '(90^\\circ-\\theta)', th: '90°−θ', lab: { a: 'b', b: 'a', c: 'c' }, tex: { a: 'b', b: 'a', c: 'c' }, ask: ['sin'], val: { sin: '\\C\\theta' },
          btn: '90°−θ を左下に', lead: '裏返して、90°−θ を左下に置こう →「次へ」', caption: '裏返すと、<b>たて b・よこ a</b> に入れかわった！', goal: '90°−θ の **sin** を書くと…？' }
      ], ok: '$\\sin(90^\\circ-\\theta)=\\dfrac{b}{c}=\\cos\\theta$。たてとよこが入れかわるから、sin と cos も入れかわる！' },
    { t: 'say', text: '$\\S(90^\\circ-\\theta)=\\C\\theta$。たてとよこが入れかわるから。',
      ask: { q: 'では $\\C(90^\\circ-\\theta)$ は？', o: ['$\\S\\theta$', '$\\C\\theta$', '$-\\S\\theta$'], why: ['', 'よこも入れかわるよ。', 'マイナスはつかない。'] },
      reveal: 'フック：**90°−θ は「名前チェンジ」**。tan は**ひっくり返る**：$\\T(90^\\circ-\\theta)=\\dfrac{1}{\\T\\theta}$' },
    { t: 'fill', text: 'プリントの3つの式を完成させよう。',
      viz: '<div class="fx-rows"><div>$\\S(90^\\circ-\\theta)=$ {{0}}</div><div>$\\C(90^\\circ-\\theta)=$ {{1}}</div><div>$\\T(90^\\circ-\\theta)=$ {{2}}</div></div>',
      a: ['$\\C\\theta$', '$\\S\\theta$', '$\\dfrac{1}{\\T\\theta}$'], extra: ['$-\\C\\theta$', '$\\T\\theta$'], hint: '名前チェンジ：sin↔cos、tan は逆数。' },
    { t: 'recap', points: ['**90°−θ は名前チェンジ**：sin↔cos、tan は**逆数**'] }
  ]
});
LE.addTo('u2-1', 'reduce', [
  { q: '$\\S(90^\\circ-\\theta)$ に等しいのは？', o: ['$\\C\\theta$', '$\\S\\theta$', '$-\\C\\theta$', '$\\dfrac{1}{\\S\\theta}$'], e: '名前チェンジ。' },
  { q: '$\\T(90^\\circ-\\theta)$ に等しいのは？', o: ['$\\dfrac{1}{\\T\\theta}$', '$\\T\\theta$', '$-\\T\\theta$', '$\\dfrac{1}{\\C\\theta}$'], e: 'tan はひっくり返る（逆数）。' },
  { q: '$\\C50^\\circ$ と等しいのは？', o: ['$\\S40^\\circ$', '$\\S50^\\circ$', '$\\C40^\\circ$', '$-\\S40^\\circ$'], e: '$50^\\circ=90^\\circ-40^\\circ$ → $\\sin40^\\circ$。' }
]);

LE.defLesson('u2', {
  id: 'u2-2', title: '180°−θ：sin だけ生き残る', goal: '$180^\\circ-\\theta$ の3つの式を言える',
  steps: [
    { t: 'say', text: '単位円の点 P（角 θ）を **y軸の鏡**で左右に映すと、映った点 P\' の角は $180^\\circ-\\theta$。', viz: LE.figs.unit(30),
      ask: { q: '左右に映すと、座標はどう変わると思う？', o: ['x の符号だけ反対', 'y の符号だけ反対', 'x と y が入れかわる'], why: ['', '左右に映しても、高さは変わらないよ。', 'それは 90°−θ（裏返し）。'] },
      reveal: '動かして確かめよう。' },
    { t: 'widget', w: 'mirror', mode: '180', text: 'P を動かして、P\' の座標と見くらべよう。' },
    { t: 'say', text: '高さ（y＝sin）はそのまま、x（cos）だけ符号が反対。だから $\\S(180^\\circ-\\theta)=\\S\\theta$、$\\C(180^\\circ-\\theta)=-\\C\\theta$。',
      ask: { q: '$\\T(180^\\circ-\\theta)$（＝$\\dfrac{y}{x}$）は？', o: ['$-\\T\\theta$', '$\\T\\theta$', '$\\dfrac{1}{\\T\\theta}$'], why: ['', 'x の符号が反対になると…？', 'それは 90°−θ。'] },
      reveal: 'フック：**180°−θ は「名前そのまま、sin だけ生き残る」**（ほかはマイナス）。' },
    { t: 'fill', text: 'プリントの3つの式を完成させよう。',
      viz: '<div class="fx-rows"><div>$\\S(180^\\circ-\\theta)=$ {{0}}</div><div>$\\C(180^\\circ-\\theta)=$ {{1}}</div><div>$\\T(180^\\circ-\\theta)=$ {{2}}</div></div>',
      a: ['$\\S\\theta$', '$-\\C\\theta$', '$-\\T\\theta$'], extra: ['$-\\S\\theta$', '$\\C\\theta$'], hint: '名前そのまま、sin だけプラス。' },
    { t: 'recap', points: ['**180°−θ は名前そのまま、sin だけ生き残る**（cos・tan はマイナス）', '90°−θ（名前チェンジ）とセットで'] }
  ]
});
LE.addTo('u2-2', 'reduce', [
  { q: '$\\S(180^\\circ-\\theta)$ に等しいのは？', o: ['$\\S\\theta$', '$-\\S\\theta$', '$\\C\\theta$', '$-\\C\\theta$'], e: 'sin だけ生き残る。' },
  { q: '$\\C(180^\\circ-\\theta)$ に等しいのは？', o: ['$-\\C\\theta$', '$\\C\\theta$', '$\\S\\theta$', '$-\\S\\theta$'], e: '名前そのまま、cos はマイナス。' },
  { q: '$\\C150^\\circ$ の値は？', o: ['$-\\dfrac{\\sqrt3}{2}$', '$\\dfrac{\\sqrt3}{2}$', '$-\\dfrac12$', '$\\dfrac12$'], e: '$\\cos(180^\\circ-30^\\circ)=-\\cos30^\\circ$。' },
  { q: '次のうち**まちがっている**のは？', o: ['$\\S(180^\\circ-\\theta)=-\\S\\theta$', '$\\C(180^\\circ-\\theta)=-\\C\\theta$', '$\\S(90^\\circ-\\theta)=\\C\\theta$', '$\\T(180^\\circ-\\theta)=-\\T\\theta$'], e: '180°−θ で sin は生き残る。' }
]);
