/* =========================================================
 * yuki/voice.js — 詠唱の読み上げ（ブラウザの読み上げ機能 Web Speech API）
 *
 *  Y.Voice.say(yomi)  ひらがなの読みを声に出す。読み終わったら（または読めない環境では、文字数ぶん待って）resolve
 *  Y.Voice.unlock()   最初のタップの中で呼ぶ（iPhone はタップの中でないと声を出させない）
 *  Y.Voice.stop()
 *
 *  ・画面の文字（漢字）とは別に、台本の yomi（ひらがな）を読ませる。漢字のまま読ませると「焔」「器」などの読みが機種でぶれるため
 *  ・声は機種ごとにちがう（iPhone と Android で別の声）。少し遅く・少し低くして、詠唱らしくする
 *  ・日本語の声がない端末・読み上げを切っているときは、声なしで同じ時間だけ待つ（演出は止まらない）
 * ========================================================= */
(function () {
  'use strict';
  var Y = window.Y;
  var SS = window.speechSynthesis, voice = null, unlocked = false;

  function pickVoice() {
    if (!SS) return null;
    var vs = SS.getVoices().filter(function (v) { return /^ja/i.test(v.lang); });
    if (!vs.length) return null;
    /* 声の好み：男性寄り・落ちついた声を優先（ない機種では最初の日本語の声） */
    var pref = [/Otoya/i, /Hattori/i, /Ichiro/i, /Keita/i, /Google/i, /Kyoko/i, /O-?ren/i, /Haruka/i, /Nanami/i];
    for (var i = 0; i < pref.length; i++) for (var j = 0; j < vs.length; j++) if (pref[i].test(vs[j].name)) return vs[j];
    return vs[0];
  }
  if (SS) {
    voice = pickVoice();
    if ('onvoiceschanged' in SS) SS.onvoiceschanged = function () { voice = pickVoice(); };
  }
  function on() { return Y.S.settings.voice !== false && !!SS; }
  function quietWait(text) { return Y.sleep(Math.max(900, Math.min(3200, String(text).length * 140))); }

  var Voice = Y.Voice = {
    available: function () { return !!SS && !!(voice || pickVoice()); },
    unlock: function () {
      if (unlocked || !SS) return;
      unlocked = true;
      try { var u = new SpeechSynthesisUtterance(' '); u.volume = 0; u.lang = 'ja-JP'; SS.speak(u); } catch (e) { /* 非対応 */ }
    },
    say: function (yomi, opt) {
      opt = opt || {};
      if (!on()) return quietWait(yomi);
      if (!voice) voice = pickVoice();
      if (!voice) return quietWait(yomi);
      return new Promise(function (res) {
        var done = false;
        function fin() { if (done) return; done = true; clearTimeout(guard); if (Y.Bgm) Y.Bgm.duck(false); res(); }
        try {
          SS.cancel();
          var u = new SpeechSynthesisUtterance(yomi);
          u.voice = voice; u.lang = voice.lang || 'ja-JP';
          u.rate = (opt.rate || 0.92) * (Y.S.settings.rate || 1);
          u.pitch = opt.pitch || 0.82;
          u.volume = 1;
          u.onend = fin; u.onerror = fin;
          if (Y.Bgm) Y.Bgm.duck(true);
          SS.speak(u);
        } catch (e) { fin(); return; }
        /* 読み終わりの合図が来ない機種があるので、長さから見た上限で先へ進む */
        var guard = setTimeout(fin, 1500 + String(yomi).length * 260);
      });
    },
    stop: function () { try { if (SS) SS.cancel(); } catch (e) { /* 非対応 */ } if (Y.Bgm) Y.Bgm.duck(false); }
  };
})();
