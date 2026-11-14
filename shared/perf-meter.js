/* =========================================================
 * shared/perf-meter.js — 「もったり」を実機で測る（?perf を付けたときだけ動く）
 *
 *  PC では再現しない遅れ（iPhone の音・読み上げ・描画）を、使っている端末で数字にする。
 *  タップのたびに1行ずつ記録し、「コピー」で文にまとめて貼れる。ふだんは何もしない。
 *
 *  1行の読み方：
 *   処理 … タップの処理（JavaScript）が終わるまで。大きいと「押しても反応が遅い」
 *   描画 … タップから、次の画面が描かれるまで。大きいと「画面の切りかえが遅い」
 *   コマ落ち … 前のタップからのあいだで、いちばん長く画面が止まった時間（34ms 以上の回数）
 *   音 … 効果音を鳴らそうとしたときの音の出口の状態。running 以外だと、鳴るのが遅れる・鳴らない
 *        （「→ 120ms」は、鳴らせる状態に戻るまでの時間）
 *   読上 … タップしたとき、読み上げの最中だったか
 * ========================================================= */
(function () {
  'use strict';
  if (!/[?&]perf\b/.test(location.search)) return;

  var rows = [], cur = null, box = null, list = null;
  var gapMax = 0, gapN = 0, lastF = 0;

  /* コマ落ち：ずっと数える */
  (function frame(t) {
    if (lastF) { var g = t - lastF; if (g > gapMax) gapMax = g; if (g > 34) gapN++; }
    lastF = t; requestAnimationFrame(frame);
  })(0);

  function ctx() { try { return window.Sfx && Sfx.raw && Sfx.raw.ctx(); } catch (e) { return null; } }
  function speaking() { try { return !!(window.speechSynthesis && (speechSynthesis.speaking || speechSynthesis.pending)); } catch (e) { return false; } }
  function r(n) { return Math.round(n); }

  function ui() {
    if (box) return;
    box = document.createElement('div');
    box.setAttribute('data-overlay-ok', '');
    box.style.cssText = 'position:fixed;left:4px;right:4px;bottom:4px;z-index:99999;font:11px/1.35 ui-monospace,Menlo,monospace;color:#fff;background:rgba(0,0,0,.78);border-radius:8px;padding:4px 6px;pointer-events:none;max-height:38vh;overflow:hidden';
    var b = document.createElement('button');
    b.textContent = 'コピー';
    b.style.cssText = 'pointer-events:auto;float:right;font:inherit;color:#000;background:#ffd36b;border:0;border-radius:6px;padding:3px 8px;margin-left:6px';
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      var text = report();
      var done = function () { b.textContent = 'コピーした'; setTimeout(function () { b.textContent = 'コピー'; }, 1500); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { prompt('コピーしてください', text); });
      else prompt('コピーしてください', text);
    }, true);
    b.setAttribute('data-perf', '');
    list = document.createElement('div');
    box.appendChild(b); box.appendChild(list);
    document.body.appendChild(box);
  }
  function line(o) {
    return '処理' + o.work + ' 描画' + o.paint + ' コマ落ち' + o.gap + '(' + o.gapN + '回) 音:' + (o.snd || 'なし') + ' 読上:' + (o.sp ? '中' : '—') + ' ｜' + o.what;
  }
  function draw() {
    ui();
    list.textContent = rows.slice(-6).map(line).join('\n');
    list.style.whiteSpace = 'pre-wrap';
  }
  function report() {
    var c = ctx();
    return ['[perf] ' + navigator.userAgent,
      '画面 ' + innerWidth + 'x' + innerHeight + ' dpr' + (window.devicePixelRatio || 1) +
      ' / 音の出口 ' + (c ? c.state + ' ' + c.sampleRate + 'Hz 遅れ' + r((c.baseLatency || 0) * 1000) + '+' + r((c.outputLatency || 0) * 1000) + 'ms' : 'なし') +
      ' / audioSession ' + ((navigator.audioSession && navigator.audioSession.type) || 'なし'),
      '（数字は ms。処理＝タップの処理、描画＝次の画面が描かれるまで）']
      .concat(rows.map(function (o, i) { return (i + 1) + '. ' + line(o); })).join('\n');
  }

  /* 効果音を鳴らそうとした瞬間の、音の出口の状態 */
  function hookSound() {
    var R = window.Sfx && Sfx.raw;
    if (!R || R.__perf) return;
    R.__perf = true;
    var play0 = R.play;
    R.play = function (fn) {
      var c0 = ctx(), st = c0 ? c0.state : '未作成', t0 = performance.now(), row = cur;
      var out = play0.apply(this, arguments);
      var c = ctx();
      if (row && !row.snd) {
        row.snd = st;
        if (c && st !== 'running') {
          var on = function () {
            if (c.state !== 'running') return;
            c.removeEventListener('statechange', on);
            row.snd = st + '→' + r(performance.now() - t0); draw();
          };
          c.addEventListener('statechange', on); on();
        }
      }
      return out;
    };
  }

  function label(el) {
    if (!el || !el.closest) return '?';
    var b = el.closest('button, [data-block], .tile, .ch, .next') || el;
    var cls = (b.className && b.className.baseVal === undefined ? String(b.className) : '').split(' ')[0];
    return (cls || b.tagName.toLowerCase()) + ':' + String(b.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 10);
  }

  document.addEventListener('click', function (e) {
    if (e.target && e.target.closest && e.target.closest('[data-perf]')) return;
    hookSound();
    var t0 = performance.now();
    var row = cur = { what: label(e.target), work: '?', paint: '?', gap: r(gapMax), gapN: gapN, snd: '', sp: speaking() };
    gapMax = 0; gapN = 0;
    rows.push(row); if (rows.length > 60) rows.shift();
    /* このあとに並ぶ処理（アプリのタップの処理）が終わった時刻 */
    var ch = new MessageChannel();
    ch.port1.onmessage = function () { row.work = r(performance.now() - t0); draw(); };
    ch.port2.postMessage(0);
    requestAnimationFrame(function () { requestAnimationFrame(function () { row.paint = r(performance.now() - t0); draw(); }); });
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { ui(); hookSound(); });
  else { ui(); hookSound(); }
})();
