/* =========================================================
 * api.js — 教材（コース）を書くための関数群
 *  コースのデータファイルは、ここで定義した関数を呼んで中身を登録する。
 *  読み込み順：course.js → api.js → コースのデータ → エンジン本体
 *
 *  LE.cats / LE.fields … 分野（試験の出題範囲）。fields[].weight は予測スコアの重み
 *  LE.add(分野ID, 問題[])         … 本番形式の4択問題を登録（o[0] が正解。a で変更可）
 *  LE.unit({id,name,icon,color,desc}) … ロードマップのユニットを登録（登録順＝表示順）
 *  LE.defLesson(ユニットID, レッスン) … レッスンを登録（steps の書式は docs/教材の書き方.md）
 *  LE.addTo(レッスンID, 分野ID, 問題[]) … 問題を登録し、そのレッスンの解放対象に加える
 *  LE.gloss({用語: 説明})        … 用語集（本文の [[用語]] をタップすると表示）
 *  LE.bosses[ユニットID] = {name, ico} … ユニットボス
 *  LE.cardDefs[レッスンID] = {...}      … 復習カード
 * ========================================================= */
window.LE = window.LE || {};
LE.cats = LE.cats || [];
LE.fields = LE.fields || [];
LE.questions = LE.questions || [];
LE.units = LE.units || [];
LE.lessonDefs = LE.lessonDefs || {};
LE.glossary = LE.glossary || {};
LE.bosses = LE.bosses || {};
LE.cardDefs = LE.cardDefs || {};

LE.add = function (field, list) {
  list.forEach(function (q, i) {
    q.f = field;
    q.id = q.id || (field + '-' + String(i + 1).padStart(3, '0'));
    LE.questions.push(q);
  });
};
LE.unit = function (u) { u.lessons = []; LE.units.push(u); };
LE.defLesson = function (unitId, L) {
  var u = LE.units.find(function (x) { return x.id === unitId; });
  if (!u) throw new Error('LE.defLesson: ユニット ' + unitId + ' が未登録です');
  L.unit = unitId;
  L.q = L.q || [];
  u.lessons.push(L.id);
  LE.lessonDefs[L.id] = L;
  L.steps.forEach(function (s) { if (s.t === 'term' && !LE.glossary[s.word]) LE.glossary[s.word] = s.short; });
};
LE.addTo = function (lessonId, field, list) {
  var L = LE.lessonDefs[lessonId];
  if (!L) throw new Error('LE.addTo: レッスン ' + lessonId + ' が未登録です');
  list.forEach(function (q, i) {
    q.id = 'x-' + lessonId + '-' + (i + 1);
    q.f = field;
    LE.questions.push(q);
    L.q.push(q.id);
  });
};
LE.gloss = function (map) { Object.keys(map).forEach(function (k) { LE.glossary[k] = map[k]; }); };
