/* STAGE 5 比の定理 */
LE.gloss({
  '重心': '三角形の3本の中線（頂点と向かいの辺の中点を結ぶ線）の交点。各中線を頂点側から 2:1 に分ける。',
  '中線': '三角形の頂点と、向かいの辺の中点を結ぶ線分。'
});

LE.defLesson('u5', {
  id: 'u5-1', title: '角の二等分線と比', goal: '角の二等分線が向かいの辺を分ける比を使える',
  steps: [
    { t: 'say', text: '角 A の二等分線が、向かいの辺 BC と交わる点を D とする。\nフック：**となりの2辺の比で、底辺が分かれる**。\n$BD:DC=AB:AC$（プリントの図の $a:b$）。',
      viz: LE.figs.bis({ c: 'AB', b: 'AC', x: 'BD', y: 'DC' }) },
    { t: 'widget', w: 'bisector', text: '頂点を動かして、2つの比を見比べよう。' },
    { t: 'build', viz: LE.figs.bis({ c: 'AB', b: 'AC', x: 'BD', y: 'DC' }), text: '比の式を組み立てよう。', ans: ['BD', ':', 'DC', '=', 'AB', ':', 'AC'], extra: ['BC', 'AD'],
      hint: 'B に近い BD には、B 側の辺 AB が対応する。' },
    { t: 'num', text: '$AB=6,\\ AC=4,\\ BC=5$ のとき、$BD$ は？', viz: LE.figs.bis({ c: '6', b: '4', x: '?', y: '' }), answer: 3, solve: '$BD:DC=6:4=3:2$。$BC=5$ を 3:2 に分けて $BD=3$' },
    { t: 'recap', points: ['角の二等分線は向かいの辺を **となりの2辺の比** に分ける', '$BD:DC=AB:AC$（B側どうし・C側どうしが対応）'] }
  ]
});
LE.addTo('u5-1', 'ratio', [
  { q: '∠A の二等分線と BC の交点を D とするとき、正しいのは？', fig: ['bis', { c: 'AB', b: 'AC', x: 'BD', y: 'DC' }], o: ['$BD:DC=AB:AC$', '$BD:DC=AC:AB$', '$BD:DC=1:1$', '$AB:AC=AD:BC$'], e: 'B側どうし、C側どうしが対応。' },
  { q: '$AB=8,\\ AC=6,\\ BC=7$。∠A の二等分線と BC の交点を D とすると、$BD$ は？', fig: ['bis', { c: '8', b: '6', x: '?', y: '' }], o: ['$4$', '$3$', '$\\dfrac{7}{2}$', '$\\dfrac{24}{7}$'], e: '$BD:DC=8:6=4:3$。7 を 4:3 に分けて BD＝4。' },
  { fig: ['bis', { c: '5', b: '10', x: '', y: '?' }], q: '$AB=5,\\ AC=10,\\ BC=9$。$DC$ は？', o: ['$6$', '$3$', '$4.5$', '$5$'], e: '$BD:DC=5:10=1:2$。9 を 1:2 に分けて DC＝6。' }
]);

LE.defLesson('u5', {
  id: 'u5-2', title: '重心と「三つの心」', goal: '重心の性質と、内心・外心・重心の定義を区別できる',
  steps: [
    { t: 'say', text: '頂点と向かいの辺の中点を結ぶ線が [[中線]]。3本の中線の交点が [[重心]] G。\nフック：**頂点側が 2、辺側が 1**（「頂点はえらいから2」）。',
      viz: LE.figs.cent({ ag: '2', gm: '1' }) },
    { t: 'widget', w: 'centroid', text: '頂点を動かしても、AG : GM は…？' },
    { t: 'num', text: '中線 $AM$ の長さが $9$ のとき、$AG$ は？', viz: LE.figs.cent({ ag: '?', gm: '' }), answer: 6, solve: '9 を 2:1 に分けて $AG=6$' },
    { t: 'match', text: '三つの「心」の定義をまとめよう（プリントの3つの吹き出し）。',
      pairs: [['内心', '内角の二等分線の交点（内接円の中心）'], ['外心', '辺の垂直二等分線の交点（外接円の中心）'], ['重心', '中線の交点（中線を 2:1 に分ける）']] },
    { t: 'fill', text: 'フックで仕上げ。',
      viz: '<div class="fx-rows"><div>内心 ＝ ナイ・{{0}}（内角の二等分線）</div><div>外心 ＝ 3つの{{1}}から同じ距離（垂直二等分線）</div><div>重心 ＝ 頂点側が {{2}}</div></div>',
      a: ['カク', '頂点', '2'], extra: ['辺', '1'] },
    { t: 'recap', points: ['**重心**＝中線の交点。中線を頂点側から **2:1**', '**内心**＝内角の二等分線、**外心**＝辺の垂直二等分線', '内心→内接円 r、外心→外接円 R'] }
  ]
});
LE.addTo('u5-2', 'ratio', [
  { q: '重心 G は中線 AM をどんな比に分ける？（A は頂点）', fig: ['cent', {}], o: ['$AG:GM=2:1$', '$AG:GM=1:2$', '$AG:GM=1:1$', '$AG:GM=3:1$'], e: '頂点側が 2。' },
  { fig: ['cent', { ag: '?', gm: '' }], q: '中線の長さが $12$。頂点から重心までの長さは？', o: ['$8$', '$4$', '$6$', '$9$'], e: '12 を 2:1 に分けて 8。' },
  { q: '重心の定義は？', o: ['3本の中線の交点', '3つの内角の二等分線の交点', '3辺の垂直二等分線の交点', '内接円の中心'], e: '中線＝頂点と向かいの辺の中点を結ぶ線。' },
  { q: '外接円の中心は？', o: ['外心', '内心', '重心', '垂心'], e: '外心＝辺の垂直二等分線の交点＝外接円の中心。' },
  { q: '内接円の中心（内心）は何の交点？', o: ['内角の二等分線', '辺の垂直二等分線', '中線', '垂線'], e: 'ナイ・カク → 内角の二等分線。' }
]);

LE.defLesson('u5', {
  id: 'u5-3', title: 'チェバの定理', goal: 'チェバの定理の式を、頂点から一周する順で書ける',
  steps: [
    { t: 'say', text: '三角形の中の点 O を通る3本の線が、各辺と R・P・Q で交わる。\nフック：**頂点から出発して、ぐるっと一周**。\nA→R→B→P→C→Q→A と通った順に「分子・分母・分子・分母…」。',
      viz: LE.figs.ceva() },
    { t: 'widget', w: 'ceva', text: '点 O を動かして、比の積を見よう。最後に一周の動きもチェック！' },
    { t: 'say', text: '一周を式にすると、\n$$\\dfrac{AR}{RB}\\cdot\\dfrac{BP}{PC}\\cdot\\dfrac{CQ}{QA}=1$$\nA→R（分子）、R→B（分母）、B→P（分子）…と、通った順に上・下・上・下。', viz: LE.figs.ceva() },
    { t: 'build', viz: LE.figs.ceva(), text: 'チェバの定理を組み立てよう（A から出発）。', ans: ['\\dfrac{AR}{RB}', '\\cdot', '\\dfrac{BP}{PC}', '\\cdot', '\\dfrac{CQ}{QA}', '=', '1'], extra: ['\\dfrac{RB}{AR}', '\\dfrac{BC}{CP}'],
      hint: 'A→R→B→P→C→Q→A。通った順に2つずつ区切って分数に。' },
    { t: 'num', viz: LE.figs.ceva(), text: '$\\dfrac{AR}{RB}=\\dfrac12,\\ \\dfrac{BP}{PC}=3$ のとき、$\\dfrac{CQ}{QA}$ は？（分数は 0.67 のように小数第2位まで）', answer: 0.67, tol: 0.011, solve: '$\\dfrac12\\times3\\times x=1$ → $x=\\dfrac23$' },
    { t: 'recap', points: ['$\\dfrac{AR}{RB}\\cdot\\dfrac{BP}{PC}\\cdot\\dfrac{CQ}{QA}=1$', '**頂点 → 分点 → 頂点 …** と三角形を一周（A→R→B→P→C→Q→A）'] }
  ]
});
LE.addTo('u5-3', 'ratio', [
  { q: 'チェバの定理（図）として正しいのは？', fig: ['ceva'], o: ['$\\dfrac{AR}{RB}\\cdot\\dfrac{BP}{PC}\\cdot\\dfrac{CQ}{QA}=1$', '$\\dfrac{AR}{RB}+\\dfrac{BP}{PC}+\\dfrac{CQ}{QA}=1$', '$\\dfrac{RB}{AR}\\cdot\\dfrac{BP}{PC}\\cdot\\dfrac{CQ}{QA}=1$', '$\\dfrac{AR}{RB}\\cdot\\dfrac{BP}{PC}\\cdot\\dfrac{CQ}{QA}=2$'], e: 'かけ算で、答えは 1。A→R→B→P→C→Q→A。' },
  { q: '$AR:RB=2:3,\\ BP:PC=1:2$ のとき、$CQ:QA$ は？', fig: ['ceva'], o: ['$3:1$', '$1:3$', '$2:1$', '$3:4$'], e: '$\\dfrac23\\cdot\\dfrac12\\cdot x=1$ → $x=3$ → 3:1。' },
  { q: 'チェバの定理を書くときの「なぞる順」は？', o: ['頂点→分点→頂点→分点…と三角形を一周', '分点だけを順に回る', '頂点だけを順に回る', '中心 O から各頂点へ'], e: '頂点と分点を交互に通って、元の頂点にもどる。' }
]);

LE.defLesson('u5', {
  id: 'u5-4', title: 'メネラウスの定理（きつね）', goal: 'メネラウスの定理を、きつねの一筆書きで書ける',
  steps: [
    { t: 'say', text: '今度は三角形を**横切る直線**。辺 AB・AC と R・Q で交わり、辺 BC の**延長**と P で交わる。\nフック：プリントのすみの「**メネラウスきつね**」🦊。\n頂点→分点→頂点…となぞると、外にはみ出した P のところが**きつねの顔**の形になる。',
      viz: LE.figs.mene() },
    { t: 'widget', w: 'menelaus', text: '直線を動かして比の積を確かめたら、きつねの一筆書きを見よう！' },
    { t: 'say', text: 'きつねの一筆書きも、式にすると\n$$\\dfrac{AR}{RB}\\cdot\\dfrac{BP}{PC}\\cdot\\dfrac{CQ}{QA}=1$$\nP は辺 BC の**延長上**だけど、「B→P→C」の順で通るのは同じ。', viz: LE.figs.mene() },
    { t: 'build', viz: LE.figs.mene(), text: 'メネラウスの定理を組み立てよう（A から出発）。', ans: ['\\dfrac{AR}{RB}', '\\cdot', '\\dfrac{BP}{PC}', '\\cdot', '\\dfrac{CQ}{QA}', '=', '1'], extra: ['\\dfrac{BC}{CP}', '\\dfrac{QA}{CQ}'],
      ok: 'じつは**式の形はチェバと同じ**！ ちがうのは図（P が辺の延長上にある）。' },
    { t: 'say', text: 'プリントの式 $\\dfrac{BC}{CP}\\cdot\\dfrac{PS}{SA}\\cdot\\dfrac{AR}{RB}=1$ は、**文字の付け方と出発点がちがうだけ**。\nどんな図でも「頂点→分点→頂点…」と一筆書きでぐるっと戻ってくれば、正しい式が書ける。' },
    { t: 'num', viz: LE.figs.mene(), text: '$\\dfrac{AR}{RB}=2,\\ \\dfrac{CQ}{QA}=\\dfrac14$ のとき、$\\dfrac{BP}{PC}$ は？', answer: 2, solve: '$2\\times x\\times\\dfrac14=1$ → $x=2$' },
    { t: 'match', text: 'チェバとメネラウスを見分けよう。',
      pairs: [['チェバ', '三角形の中の1点を通る3本の線'], ['メネラウス', '三角形を横切る1本の直線'], ['どちらも', '頂点→分点→…と一周、積は1']] },
    { t: 'recap', points: ['$\\dfrac{AR}{RB}\\cdot\\dfrac{BP}{PC}\\cdot\\dfrac{CQ}{QA}=1$（式の形はチェバと同じ）', '図は「三角形を横切る直線」。P は辺の**延長上**', '**きつね**の一筆書き：頂点→分点→頂点…で一周'] }
  ]
});
LE.addTo('u5-4', 'ratio', [
  { q: '図のように直線が三角形を横切るとき（メネラウス）、正しい式は？', fig: ['mene'], o: ['$\\dfrac{AR}{RB}\\cdot\\dfrac{BP}{PC}\\cdot\\dfrac{CQ}{QA}=1$', '$\\dfrac{AR}{RB}\\cdot\\dfrac{BC}{CP}\\cdot\\dfrac{CQ}{QA}=1$', '$\\dfrac{AR}{RB}+\\dfrac{BP}{PC}+\\dfrac{CQ}{QA}=1$', '$\\dfrac{RB}{AR}\\cdot\\dfrac{PC}{BP}\\cdot\\dfrac{CQ}{QA}=1$'], e: '頂点→分点→頂点…と一周。P は延長上でも「B→P→C」の順で通る。' },
  { q: 'メネラウスの定理の図の特徴は？', o: ['三角形を1本の直線が横切る', '三角形の中の1点から3本の線が出る', '三角形に円が内接する', '三角形の中線が交わる'], e: '中の1点から3本の線が出るのはチェバ。' },
  { q: '図で $AR:RB=1:1,\\ BP:PC=3:1$ のとき、$CQ:QA$ は？', fig: ['mene'], o: ['$1:3$', '$3:1$', '$1:1$', '$2:3$'], e: '$1\\cdot3\\cdot x=1$ → $x=\\dfrac13$ → 1:3。' },
  { q: 'チェバとメネラウスで**共通**なのは？', o: ['頂点→分点→頂点…と一周した比の積が 1', '図の形', '中の1点を通ること', '円を使うこと'], e: '式の形は同じ。図がちがう。' }
]);
