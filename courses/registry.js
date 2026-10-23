/* =========================================================
 * コース一覧（タイトル画面 index.html が読む）
 *  新しいコースを作ったら、ここに1行足して入口HTML（<id>.html）を用意する。
 *  storageKey は courses/<id>/course.js と同じ値にする（進捗表示に使う）。
 * ========================================================= */
window.LE_COURSES = [
  {
    id: 'fe', entry: 'fe.html', storageKey: 'le.fe.v1',
    title: '基本情報技術者試験', brand: 'BIT RUSH', icon: '💾',
    desc: '0と1の話から科目Bのプログラム読解まで。55レッスン＋ユニットボス。',
    color: '#38e8ff', color2: '#7a5cff', lessons: 55
  },
  {
    id: 'fe-kaya', entry: 'fe-kaya.html', storageKey: 'le.fekaya.v1',
    title: '基本情報技術者試験（教科書の目次順）', brand: 'BIT RUSH 教科書順', icon: '📘',
    desc: '『かやのき先生の基本情報技術者教室』の章・節と同じ順番で復習。読み終えた節を開いて思い出す。全12章・91節。',
    color: '#5cff9d', color2: '#38e8ff', lessons: 91
  },
  {
    id: 'habsburg', entry: 'habsburg.html', storageKey: 'le.habsburg.v1',
    title: 'ハプスブルク年代記', brand: 'CHRONICON HABSBURGICUM', icon: '🦅',
    desc: '鷹の城の伯爵家が皇帝の家になるまで。『ハプスブルク家の華麗なる受難』1〜3巻の範囲を時代順に。',
    color: '#d8b45a', color2: '#a3262b', lessons: 34
  },
  {
    id: 'trig', entry: 'trig.html', storageKey: 'le.trig.v2',
    title: '三角比・平面図形の公式', brand: 'TRIG RUSH', icon: '📐',
    desc: '三角比・平面図形の公式を、図を動かして覚える。sin・cos・tan から正弦定理・余弦定理・メネラウスまで。',
    color: '#ff5fa2', color2: '#38d9ff', lessons: 15
  },
  /* モル教室（mole/）：エンジンを使わない独立アプリ。進み具合は lessons[id].done を数える（基本8＋追加2） */
  {
    id: 'mole', entry: 'mole.html', storageKey: 'mole.v1',
    title: '化学基礎 物質量（モル）', brand: 'MOLMO LAB', icon: '🧪',
    desc: 'モルモットのモルモ先生とトークしながら、mol の基本を。正解するたびに粒がふえて、1 mol（6.0×10²³個）を目指す。クリアごとに結晶が育つ。',
    color: '#5fd3b0', color2: '#9b5cff', lessons: 10
  },
  /* ¡QUE FUSIÓN!（relativo/）：エンジンを使わない独立アプリ。進み具合は lessons[id].done を数える（10レッスン。ボスは数えない） */
  {
    id: 'relativo', entry: 'relativo.html', storageKey: 'relativo.v1',
    title: 'スペイン語 関係詞', brand: '¡QUE FUSIÓN!', icon: '⚡',
    desc: '2つの文をタップで合体！ que・quien・前置詞＋冠詞＋que・donde・lo que・cuyo まで、西検4級の関係詞を1日30分×7日で。ボス戦・60秒ラッシュ・フレーズガチャつき。',
    color: '#ff4fa3', color2: '#38e8ff', lessons: 10
  },
  /* ¡MANDA!（manda/）：命令表現の独立アプリ。進み具合は lessons[id].done を数える（10の神託。ボスは数えない） */
  {
    id: 'manda', entry: 'manda.html', storageKey: 'manda.v1',
    title: 'スペイン語 命令表現', brand: '¡MANDA!', icon: '🦉',
    desc: 'ちび神さまになって、島の人たちに命令！ tú・usted・vosotros・ustedes の命令、不規則な8つ、代名詞のくっつけ方、「〜するな」まで。命令が届くと島が育つ。西検4級。',
    color: '#ffcf4a', color2: '#6a4cff', lessons: 10
  },
  /* ユーキ・クエスト（yuki/）：有機化学のRPG。独立アプリ。進み具合は lessons[id].done を数える（序章4＋1章4＋ボス2） */
  {
    id: 'yuki', entry: 'yuki.html', storageKey: 'yuki.v1',
    title: '有機化学', brand: 'ユーキ・クエスト', icon: '⬡',
    desc: '素材を集めて魔法陣を描き、呪文を詠唱して反応を発動！ 炭素の精霊テトラと、共通テストの有機化学を。属性ごとの BGM・詠唱の読み上げ・ボス戦つき。',
    color: '#ffb84d', color2: '#b98cff', lessons: 10
  },
  /* 単語アプリ（vocab/）：kind: 'vocab'。words＝デッキの語数（図鑑の進み具合の表示に使う） */
  {
    id: 'spanish', kind: 'vocab', entry: 'vocab.html', storageKey: 'vocab.spanish.v1',
    title: 'スペイン語 単語', brand: '¡VAMOS!', icon: '💃',
    desc: '西検5級→4級の単語と動詞の活用を、予想して出会い、捕まえて図鑑で育てる。1分・5分・10分、気分でも選べる。参考書に合わせた単語のデッキも、アプリの中から読み込める。',
    color: '#ff7a59', color2: '#f2a541', words: 78
  },
  {
    id: 'juku-1009', kind: 'vocab', entry: 'vocab.html?deck=juku-1009', storageKey: 'vocab.juku-1009.v1',
    title: '英単語　塾プリント10月9日', brand: 'WORD AVENUE', icon: '🗽',
    desc: '塾プリント Lesson 7 の英単語・熟語。英英の説明から意味を予想し、捕まえて図鑑で育てる。',
    color: '#8fb8de', color2: '#e0a83b', words: 47
  }
];
