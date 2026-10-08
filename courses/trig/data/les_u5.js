/* STAGE 5 比の定理（プリント中段右：チェバ・メネラウス＋重心、角の二等分線と比）
 * 書き分け：**覚えること** ／ __覚え方のヒント__ ／ ((この教材での呼び方・約束))　※数式は ** で囲まない */
LE.defLesson('u5', {
  id: 'u5-1', title: 'チェバの定理と重心', goal: 'チェバの定理を書ける／重心の性質を言える',
  steps: [
    { t: 'say', text: '三角形の中の点 O を通る3本の線が、各辺と R・P・Q で交わる。((点の名前は図のとおり))\n__頂点から出発して、ぐるっと一周__。A → R → …', viz: LE.figs.ceva(),
      ask: { q: 'A → R の次に通るのは？', o: ['B（次の頂点）', 'P', 'C'], why: ['', '辺 AB の上を進むと…', '辺 AB の上を進むと…'] },
      reveal: 'A→R→B→P→C→Q→A。通った順に2つずつ区切って分数にすると：\n$$\\dfrac{AR}{RB}\\cdot\\dfrac{BP}{PC}\\cdot\\dfrac{CQ}{QA}=1$$' },
    { t: 'widget', w: 'ceva', text: '点 O を動かして、比の積を見よう。' },
    { t: 'say', text: 'とくに、O が[[中線]]の交点のときは**重心** G。', viz: LE.figs.cent({ ag: '?', gm: '?' }),
      ask: { q: '重心は各中線を 2:1 に分ける。「2」になるのは？', o: ['頂点側', '辺側'], why: ['', '重心は辺のほうに寄っている。'] },
      reveal: '**重心＝各中線の交点。各中線を頂点側から 2:1 に内分する**。', rviz: LE.figs.cent({ ag: '2', gm: '1' }) },
    { t: 'recap', points: [
      { q: 'チェバの定理（A → R → B → P → C → Q と一周）の式は？', a: '$\\dfrac{AR}{RB}\\cdot\\dfrac{BP}{PC}\\cdot\\dfrac{CQ}{QA}=1$' },
      { q: '重心とは？ 中線をどんな比に分ける？', a: '**各中線の交点。中線を頂点側から 2:1 に内分**' },
      '__頂点→分点→…と一周__'
    ] }
  ]
});
LE.addTo('u5-1', 'ratio', [
  { q: 'チェバの定理（図）として正しいのは？', fig: ['ceva'], o: ['$\\dfrac{AR}{RB}\\cdot\\dfrac{BP}{PC}\\cdot\\dfrac{CQ}{QA}=1$', '$\\dfrac{AR}{RB}+\\dfrac{BP}{PC}+\\dfrac{CQ}{QA}=1$', '$\\dfrac{RB}{AR}\\cdot\\dfrac{BP}{PC}\\cdot\\dfrac{CQ}{QA}=1$', '$\\dfrac{AR}{RB}\\cdot\\dfrac{BP}{PC}\\cdot\\dfrac{CQ}{QA}=2$'], e: 'かけ算で 1。一周する順に。' },
  { q: '$AR:RB=2:3,\\ BP:PC=1:2$ のとき、$CQ:QA$ は？', fig: ['ceva'], o: ['$3:1$', '$1:3$', '$2:1$', '$3:4$'], e: '$\\dfrac23\\cdot\\dfrac12\\cdot x=1$ → $x=3$。' },
  { q: '重心 G は中線 AM（A は頂点）をどんな比に分ける？', fig: ['cent', {}], o: ['$AG:GM=2:1$', '$AG:GM=1:2$', '$AG:GM=1:1$', '$AG:GM=3:1$'], e: '頂点側が 2。' }
]);

LE.defLesson('u5', {
  id: 'u5-2', title: 'メネラウスの定理（きつね）', goal: 'メネラウスの定理を一筆書きで書ける',
  steps: [
    { t: 'say', text: '今度は三角形を**横切る直線**。辺 AB・AC と R・Q で交わる。', viz: LE.figs.mene(),
      ask: { q: '直線と辺 BC の交点 P は、どこにある？', o: ['辺 BC の延長上', '辺 BC の上', '三角形の中'], why: ['', '図をよく見て。', '図をよく見て。'] },
      reveal: 'P は辺 BC の**延長上**。式の形は**チェバと同じ**：\n$$\\dfrac{AR}{RB}\\cdot\\dfrac{BP}{PC}\\cdot\\dfrac{CQ}{QA}=1$$\n__頂点→分点→頂点…と一筆書きすると、はみ出した P のところが「きつね」の顔に見える（((メネラウスきつね))🦊）__' },
    { t: 'widget', w: 'menelaus', text: '直線を動かして積を確かめたら、きつねの一筆書きを見よう！' },
    { t: 'recap', points: [
      { q: 'メネラウスの定理の式は？', a: '$\\dfrac{AR}{RB}\\cdot\\dfrac{BP}{PC}\\cdot\\dfrac{CQ}{QA}=1$' },
      { q: 'チェバとのちがいは？', a: '**図は「三角形を横切る直線」、式の形はチェバと同じ**' },
      '__きつねの一筆書き__'
    ] }
  ]
});
LE.addTo('u5-2', 'ratio', [
  { q: '図（直線が三角形を横切る）で正しい式は？', fig: ['mene'], o: ['$\\dfrac{AR}{RB}\\cdot\\dfrac{BP}{PC}\\cdot\\dfrac{CQ}{QA}=1$', '$\\dfrac{AR}{RB}\\cdot\\dfrac{BC}{CP}\\cdot\\dfrac{CQ}{QA}=1$', '$\\dfrac{AR}{RB}+\\dfrac{BP}{PC}+\\dfrac{CQ}{QA}=1$', '$\\dfrac{RB}{AR}\\cdot\\dfrac{PC}{BP}\\cdot\\dfrac{CQ}{QA}=1$'], e: '頂点→分点→頂点…と一周。' },
  { q: 'メネラウスの定理の図の特徴は？', o: ['三角形を1本の直線が横切る', '三角形の中の1点から3本の線が出る', '三角形に円が内接する', '中線が交わる'], e: '中の1点から3本はチェバ。' },
  { q: '図で $AR:RB=1:1,\\ BP:PC=3:1$ のとき、$CQ:QA$ は？', fig: ['mene'], o: ['$1:3$', '$3:1$', '$1:1$', '$2:3$'], e: '$1\\cdot3\\cdot x=1$ → $x=\\dfrac13$。' }
]);

LE.defLesson('u5', {
  id: 'u5-3', title: '角の二等分線と比', goal: '角の二等分線が向かいの辺を分ける比を言える',
  steps: [
    { t: 'say', text: '角 A の二等分線が、向かいの辺 BC と交わる点を D とする。', viz: LE.figs.bis({ c: '6', b: '3', x: '?', y: '?' }),
      ask: { q: '$AB=6,\\ AC=3$ なら、$BD:DC$ は？（予想でOK）', o: ['$2:1$', '$1:2$', '$1:1$'], why: ['', 'B 側の辺が長いほど、B 側も長くなる。', '辺の長さがちがうので、半分ずつにはならない。'] },
      reveal: '$BD:DC=AB:AC$　**角の二等分線は、向かいの辺を、となりの2辺の比に分ける**（$AB=a,\\ AC=b$ なら $BD:DC=a:b$）。' },
    { t: 'widget', w: 'bisector', text: '頂点を動かして、2つの比を見比べよう。' },
    { t: 'recap', points: [
      { q: '∠A の二等分線が BC と交わる点 D。$BD:DC$ は？', a: '$BD:DC=AB:AC$' },
      { q: 'ことばで言うと？', a: '**角の二等分線は、向かいの辺を、となりの2辺の比に分ける**' }
    ] }
  ]
});
LE.addTo('u5-3', 'ratio', [
  { q: '∠A の二等分線と BC の交点を D とするとき、正しいのは？', fig: ['bis', { c: 'AB', b: 'AC', x: 'BD', y: 'DC' }], o: ['$BD:DC=AB:AC$', '$BD:DC=AC:AB$', '$BD:DC=1:1$', '$AB:AC=AD:BC$'], e: 'B側どうし、C側どうし。' },
  { q: '$AB=8,\\ AC=6,\\ BC=7$。$BD$ は？', fig: ['bis', { c: '8', b: '6', x: '?', y: '' }], o: ['$4$', '$3$', '$\\dfrac{7}{2}$', '$\\dfrac{24}{7}$'], e: '$BD:DC=4:3$。7 を 4:3 に分けて 4。' }
]);
