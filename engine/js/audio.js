/* audio.js — WebAudio でその場合成する効果音（音声ファイル不要） */
(function () {
  'use strict';
  var ROYAL = !!(window.COURSE && window.COURSE.sound === 'royal');   // COURSE.sound = 'royal'：古楽器風の音色
  var ctx = null, master = null;
  var SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31]; // ペンタトニック：コンボで音階が上がる

  function on() { return window.Core && Core.S.settings.sound; }
  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return ctx; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = ROYAL ? 0.42 : 0.32;
    var comp = ctx.createDynamicsCompressor();
    if (ROYAL) { /* 古楽器っぽく：高音を丸めて温かい響きに */
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200; lp.Q.value = 0.4;
      master.connect(lp); lp.connect(comp);
    } else master.connect(comp);
    comp.connect(ctx.destination);
    return ctx;
  }
  function hz(semi) { return 440 * Math.pow(2, (semi - 9) / 12) * 2; } // C5 基準
  function tone(f, t0, dur, type, vol, slideTo) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    if (ROYAL && (type === 'square' || type === 'sawtooth')) { type = 'triangle'; dur *= 1.6; } // ハープ・リュート風のはじく音
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.3, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function noise(t0, dur, vol, from, to) {
    var len = Math.floor(ctx.sampleRate * dur);
    var buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    var src = ctx.createBufferSource(); src.buffer = buf;
    var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.2;
    f.frequency.setValueAtTime(from, t0); f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    var g = ctx.createGain();
    g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0);
  }
  function play(fn) { if (!on() || !ensure()) return; fn(ctx.currentTime); }
  function buzz(p) { try { if (on() && navigator.vibrate) navigator.vibrate(p); } catch (e) { /* 非対応端末 */ } }

  window.Sfx = {
    unlock: function () { if (on()) ensure(); },
    tap: function () { play(function (t) { tone(1400, t, 0.05, 'triangle', 0.12); }); },
    hover: function () { play(function (t) { tone(2200, t, 0.03, 'sine', 0.04); }); },
    correct: function (combo) {
      buzz(combo >= 10 ? [12, 30, 12] : 12);
      play(function (t) {
        var i = Math.min(SCALE.length - 3, combo || 0);
        tone(hz(SCALE[i]), t, 0.12, 'square', 0.12);
        tone(hz(SCALE[i + 2]), t + 0.07, 0.22, 'square', 0.12);
        tone(hz(SCALE[i + 2] + 12), t + 0.07, 0.3, 'sine', 0.1);
      });
    },
    wrong: function () {
      buzz([30, 40, 30]);
      if (ROYAL) { play(function (t) { tone(110, t, 0.35, 'sine', 0.35, 55); tone(82, t + 0.02, 0.4, 'sine', 0.2, 45); noise(t, 0.12, 0.08, 400, 150); }); return; } // 太鼓のような低い音
      play(function (t) {
        tone(220, t, 0.28, 'sawtooth', 0.14, 90);
        tone(160, t + 0.02, 0.3, 'square', 0.08, 70);
      });
    },
    crit: function () {
      play(function (t) {
        [0, 4, 7, 12, 16].forEach(function (s, k) { tone(hz(s + 12), t + k * 0.04, 0.35, 'triangle', 0.12); });
        noise(t, 0.4, 0.15, 3000, 9000);
      });
    },
    combo: function (n) {
      play(function (t) {
        noise(t, 0.5, 0.2, 400, 6000);
        tone(hz(n >= 10 ? 12 : 7), t + 0.05, 0.5, 'sawtooth', 0.1, hz(n >= 10 ? 24 : 19));
      });
    },
    coin: function () { play(function (t) { tone(1975, t, 0.06, 'square', 0.06); tone(2637, t + 0.05, 0.12, 'square', 0.06); }); },
    levelUp: function () {
      buzz([20, 40, 20, 40, 80]);
      play(function (t) {
        var seq = [0, 4, 7, 12, 7, 12, 16, 19, 24];
        seq.forEach(function (s, k) { tone(hz(s), t + k * 0.075, 0.25, 'square', 0.1); tone(hz(s - 12), t + k * 0.075, 0.25, 'triangle', 0.08); });
        noise(t + 0.6, 0.9, 0.18, 800, 12000);
      });
    },
    chestShake: function () { play(function (t) { tone(90 + Math.random() * 30, t, 0.08, 'square', 0.1); }); },
    chestOpen: function (tier) {
      play(function (t) {
        noise(t, 0.7, 0.25, 300, 10000);
        var base = { common: 0, rare: 2, epic: 5, legendary: 7 }[tier] || 0;
        [0, 4, 7, 11, 14, 19].forEach(function (s, k) { tone(hz(s + base), t + 0.25 + k * 0.06, 0.6, 'triangle', 0.1); });
        if (tier === 'legendary') [0, 7, 12, 19, 24].forEach(function (s, k) { tone(hz(s + 12), t + 0.7 + k * 0.08, 0.8, 'sine', 0.1); });
      });
    },
    whoosh: function () { play(function (t) { noise(t, 0.25, 0.12, 6000, 500); }); }
  };
})();
