/* =========================================================
 * vocab/ui.js — 画面（ホーム・ブロック・図鑑・結果）
 *
 *  ブロック（どれも単独で始められる。途中でやめても答えた分は記録ずみ）
 *    face  👀 顔見知りチェック：5級の語を素早く捕獲。答えられなければ「出会い」へ
 *    meet  🌱 出会い：予想 → 説明 → 見分ける → 捕獲
 *    wild  ⚔ 野生戦：しおれた・野生に戻りかけのカードと戦う（レベルで問い方が変わる）
 *    rescue 図鑑から1枚だけ救出
 *  おまかせ（1分・5分・10分 × 🧠しっかり／😌ゆるく）は、その日の状態からブロックを組む。
 * ========================================================= */
(function () {
  'use strict';
  var D = V.D, S = V.S;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  var G = window.gsap || null;
  function tw(el, from, to) { if (!G || !el) return; G.fromTo(el, from, to); }
  var POS = { n: '名詞', v: '動詞', adj: '形容詞', adv: '副詞' };

  /* =========================================================
   * 読み上げ（標準の音声合成。学ぶ言語の声を自動で選ぶ。声がなければ出さない）
   * ========================================================= */
  var Speech = (function () {
    var syn = window.speechSynthesis, voice = null;
    function find() {
      if (!syn) return null;
      var vs = syn.getVoices() || [], L = D.lang;
      voice = vs.filter(function (v) { return /^es[-_]ES/i.test(v.lang); })[0] ||
              vs.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(L) === 0; })[0] || null;
      return voice;
    }
    if (syn) { find(); if ('onvoiceschanged' in syn) syn.onvoiceschanged = function () { find(); refreshSpeak(); }; }
    return {
      ok: function () { return !!(syn && (voice || find())); },
      say: function (text, slow) {
        if (!S.settings.speak || !syn || !(voice || find())) return;
        try {
          syn.cancel();
          var u = new SpeechSynthesisUtterance(String(text).replace(/[{}]/g, ''));
          u.voice = voice; u.lang = voice.lang; u.rate = slow ? 0.7 : 0.9;
          syn.speak(u);
        } catch (e) { /* 読み上げできない */ }
      }
    };
  })();
  function refreshSpeak() { $$('.say').forEach(function (b) { b.hidden = !Speech.ok(); }); }
  function sayBtn(text, cls) { return '<button class="say ' + (cls || '') + '" data-say="' + esc(text) + '" aria-label="読み上げ"' + (Speech.ok() ? '' : ' hidden') + '>🔊</button>'; }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-say]');
    if (b) { e.stopPropagation(); Speech.say(b.getAttribute('data-say'), b.classList.contains('slow')); }
  }, true);

  /* =========================================================
   * 演出（パーティクル・叩きつけ文字・浮かぶ文字）
   * ========================================================= */
  var FX = (function () {
    var cv = $('#fx'), cx = cv.getContext('2d'), parts = [], raf = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    function size() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'; }
    addEventListener('resize', size); size();
    function cols() { var cs = getComputedStyle(document.documentElement); return ['--fx1', '--fx2', '--fx3', '--fx4'].map(function (v) { return cs.getPropertyValue(v).trim() || '#e4572e'; }); }
    function tick() {
      cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, innerWidth, innerHeight);
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.life -= p.decay; if (p.life <= 0) { parts.splice(i, 1); continue; }
        p.vx *= p.drag; p.vy = p.vy * p.drag + p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        cx.globalAlpha = Math.min(1, p.life); cx.fillStyle = p.c;
        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot);
        if (p.k === 'tile') { cx.fillRect(-p.s, -p.s, p.s * 2, p.s * 2); cx.fillStyle = 'rgba(255,255,255,.7)'; cx.fillRect(-p.s * 0.35, -p.s * 0.35, p.s * 0.7, p.s * 0.7); }
        else if (p.k === 'petal') { cx.scale(1, 0.55 + 0.45 * Math.cos(p.rot * 2)); cx.beginPath(); cx.ellipse(0, 0, p.s * 1.6, p.s * 0.8, 0, 0, 6.283); cx.fill(); }
        else { cx.beginPath(); cx.arc(0, 0, p.s * p.life, 0, 6.283); cx.fill(); }
        cx.restore();
      }
      cx.globalAlpha = 1;
      raf = parts.length ? requestAnimationFrame(tick) : 0;
    }
    function kick() { if (!raf) raf = requestAnimationFrame(tick); }
    function center(el) { if (!el) return [innerWidth / 2, innerHeight / 2]; var r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
    return {
      center: center,
      burst: function (el, kind, n) {
        var c = center(el), C = cols(); kind = kind || pick(['tile', 'petal', 'dot']);
        for (var i = 0; i < (n || 26); i++) {
          var a = Math.random() * 6.283, sp = 3 + Math.random() * 7;
          parts.push({ x: c[0], y: c[1], vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, g: kind === 'petal' ? 0.08 : 0.18, drag: kind === 'petal' ? 0.96 : 0.93,
            s: kind === 'dot' ? 3 + Math.random() * 3 : 4 + Math.random() * 4, c: C[i % C.length], life: 1.3, decay: 0.014 + Math.random() * 0.012,
            rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, k: kind });
        }
        kick();
      },
      rain: function (kind) {
        var C = cols(); kind = kind || pick(['tile', 'petal']);
        for (var i = 0; i < 70; i++) parts.push({ x: Math.random() * innerWidth, y: -20 - Math.random() * 200, vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3, g: 0.04, drag: 0.995,
          s: 4 + Math.random() * 4, c: C[i % C.length], life: 2.6, decay: 0.008, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.2, k: kind });
        kick();
      },
      slam: function (text, sub) {
        var box = $('#slam');
        box.innerHTML = '<div class="slam-t">' + esc(text) + '</div>' + (sub ? '<div class="slam-s">' + esc(sub) + '</div>' : '');
        box.hidden = false;
        if (!G) { setTimeout(function () { box.hidden = true; }, 1400); return; }
        G.timeline({ onComplete: function () { box.hidden = true; } })
          .fromTo(box.firstChild, { scale: 2.6, opacity: 0, rotate: -8 }, { scale: 1, opacity: 1, rotate: -4, duration: 0.45, ease: 'back.out(2.2)' })
          .fromTo(box.children[1] || {}, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, '-=0.15')
          .to(box, { opacity: 0, duration: 0.35, delay: 0.9 })
          .set(box, { opacity: 1 });
      },
      float: function (el, text, cls) {
        var c = center(el), d = document.createElement('div');
        d.className = 'floaty ' + (cls || ''); d.textContent = text;
        d.style.left = c[0] + 'px'; d.style.top = c[1] + 'px';
        document.body.appendChild(d);
        if (!G) { setTimeout(function () { d.remove(); }, 1000); return; }
        G.fromTo(d, { y: 0, opacity: 0, scale: 0.5 }, { y: -60, opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(3)' });
        G.to(d, { y: -100, opacity: 0, duration: 0.4, delay: 0.7, onComplete: function () { d.remove(); } });
      },
      shake: function (el) { if (G && el) G.fromTo(el, { x: -10 }, { x: 0, duration: 0.45, ease: 'elastic.out(1.2,0.3)' }); }
    };
  })();
  var PRAISE = ['¡Bien!', '¡Muy bien!', '¡Eso es!', '¡Perfecto!', '¡Olé!', '¡Genial!'];

  /* =========================================================
   * 画面の切りかえ
   * ========================================================= */
  function go(id) {
    $$('.screen').forEach(function (s) { s.hidden = s.id !== id; });
    window.scrollTo(0, 0);
    if (id === 'home') renderHome();
    if (id === 'dex') renderDex();
  }

  /* ---- カード（見出し） ---- */
  function gcls(w) { return w.pos === 'n' ? ' g-' + (w.g || 'm') : ''; }
  function headHtml(w) {
    var a = V.art(w);
    return (a ? '<span class="art">' + a + '</span> ' : '') + '<span class="w">' + esc(w.w) + '</span>';
  }
  function exHtml(s) { return esc(s).replace(/\{([^}]+)\}/g, '<mark>$1</mark>'); }
  function rankCls(id) { var c = V.card(id); return c ? ' r-' + V.RANKS[c.lv].id : ''; }

  /* =========================================================
   * ホーム
   * ========================================================= */
  function renderHome() {
    var total = D.words.length, got = V.caughtCount(), wild = V.wildList().length, face = V.faceList().length, meet = V.meetList().length;
    $('#hBrand').textContent = D.brand;
    $('#hSub').textContent = D.sub;
    $('#hDex').textContent = got + ' / ' + total;
    $('#hDexBar').style.width = Math.round(got / total * 100) + '%';
    $('#hExp').textContent = '+' + (S.day.date ? S.day.exp : 0);
    $('#hGrown').textContent = S.day.grown.length;
    $$('.mood button').forEach(function (b) { b.classList.toggle('on', b.dataset.mood === S.settings.mood); });
    var tiles = [
      { id: 'face', ico: '👀', name: '顔見知りチェック', sub: face ? '5級の語 残り ' + face + '語' : '', off: !face, hide: !face },
      { id: 'meet', ico: '🌱', name: '出会い', sub: meet ? '新しい単語を3つ' : 'ぜんぶ出会った！', off: !meet },
      { id: 'wild', ico: '⚔', name: '野生戦', sub: wild ? 'しおれた単語 ' + wild + '体' : 'いまはみんな元気', off: !wild },
      { id: 'dex', ico: '📖', name: '図鑑', sub: wild ? 'しおれ ' + wild + '枚' : got + '枚' }
    ];
    $('#alacarte').innerHTML = tiles.filter(function (t) { return !t.hide; }).map(function (t) {
      return '<button class="tile' + (t.off ? ' off' : '') + '" data-block="' + t.id + '"' + (t.off ? ' disabled' : '') + '><span class="ti">' + t.ico + '</span><b>' + t.name + '</b><small>' + esc(t.sub) + '</small></button>';
    }).join('');
    $('#hWild').hidden = !wild;
    $('#hWild').textContent = '🥀 しおれかけの単語が ' + wild + ' 枚。野生に戻る前に助けよう';
    $('#tgSound').checked = S.settings.sound;
    $('#tgSpeak').checked = S.settings.speak;
    $('#tgSpeakRow').hidden = !Speech.ok();
    if (G) G.fromTo('#home .anim', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'power3.out' });
  }

  /* おまかせ：その日の状態からブロックを組む */
  function makePlan(min) {
    var easy = S.settings.mood === 'easy';
    var wild = V.wildList().length, face = V.faceList().length, meet = V.meetList().length, plan = [];
    function add(type, n, have) { if (have > 0) plan.push({ type: type, n: Math.min(n, have) }); }
    if (min === 1) {
      if (wild) add('wild', 3, wild); else if (face) add('face', 5, face); else if (!easy) add('meet', 1, meet);
    } else if (min === 5) {
      add('wild', easy ? 6 : 4, wild);
      add('face', easy ? (wild ? 6 : 10) : 5, face);
      if (!easy) add('meet', 3, meet);
      if (!plan.length) add('meet', 3, meet);
    } else {
      add('wild', easy ? 10 : 8, wild);
      add('face', easy ? 12 : 8, face);
      if (!easy) add('meet', 3, meet);
      if (!plan.length) add('meet', 3, meet);
    }
    return plan;
  }

  /* =========================================================
   * セッション（ブロックを順に回す）
   * ========================================================= */
  var ses = null;
  var BNAME = { face: '👀 顔見知りチェック', meet: '🌱 出会い', wild: '⚔ 野生戦', rescue: '🚑 救出' };
  function start(plan, label) {
    if (!plan.length) { toast('いまは、やることがありません', '図鑑を眺めたり、別のメニューを選んだりしてみよう'); return; }
    if (window.Sfx) Sfx.unlock();
    ses = { plan: plan, bi: -1, label: label || '', caught: [], ups: [], exp: 0, ok: 0, ng: 0, combo: 0, backs: 0, backIds: [], met: [] };
    go('play');
    renderSteps();
    nextBlock();
  }
  function renderSteps() {
    $('#steps').innerHTML = ses.plan.map(function (b, i) { return '<i class="' + (i < ses.bi ? 'done' : i === ses.bi ? 'now' : '') + '"></i>'; }).join('');
    $('#phase').textContent = ses.bi >= 0 && ses.plan[ses.bi] ? BNAME[ses.plan[ses.bi].type] : '';
    $('#pDex').textContent = V.caughtCount();
  }
  function nextBlock() {
    ses.bi++;
    renderSteps();
    var b = ses.plan[ses.bi];
    if (!b) return finish();
    ({ face: blockFace, meet: blockMeet, wild: blockWild, rescue: blockRescue })[b.type](b, nextBlock);
  }
  function stage(html) { var s = $('#stage'); s.innerHTML = html; tw(s.firstElementChild, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }); return s; }

  /* ---- 選択肢 ---- */
  function others(w, n, key) {
    var val = function (x) { return key === 'head' ? V.head(x) : key === 'form' ? formOf(x) : x.ja; };
    var mine = val(w), seen = {}; seen[mine] = 1;
    var same = shuffle(D.words.filter(function (x) { return x !== w && x.pos === w.pos; }));
    var rest = shuffle(D.words.filter(function (x) { return x !== w && x.pos !== w.pos; }));
    var out = [];
    same.concat(rest).forEach(function (x) { var v = val(x); if (out.length < n && !seen[v]) { seen[v] = 1; out.push(v); } });
    return out;
  }
  function formOf(w) { var m = /\{([^}]+)\}/.exec(w.ex[0]); return m ? m[1] : w.w; }
  function choiceHtml(list, cls) { return '<div class="choices ' + (cls || '') + '">' + list.map(function (c, i) { return '<button class="ch" data-i="' + i + '">' + c + '</button>'; }).join('') + '</div>'; }

  /* ---- 1問（いろいろな問い方）。done(ok) ---- */
  function ask(w, type, opt, done) {
    opt = opt || {};
    var right, list, body, prompt;
    var tag = opt.tag || '';
    if (type === 'spell') return askSpell(w, opt, done);
    if (type === 'es2ja') {
      prompt = '<div class="q-card' + gcls(w) + rankCls(w.id) + '">' + tag + '<div class="q-word">' + headHtml(w) + '</div>' + sayBtn(V.head(w)) + '</div><p class="q-ask">意味は？</p>';
      right = w.ja; list = shuffle([right].concat(others(w, 3, 'ja'))).map(esc);
    } else if (type === 'listen') {
      prompt = '<div class="q-card listen' + rankCls(w.id) + '">' + tag + '<button class="big-say" data-say="' + esc(V.head(w)) + '">🔊</button><button class="say slow" data-say="' + esc(V.head(w)) + '">🐢</button></div><p class="q-ask">聞こえた単語の意味は？</p>';
      right = w.ja; list = shuffle([right].concat(others(w, 3, 'ja'))).map(esc);
    } else if (type === 'ja2es') {
      prompt = '<div class="q-card ja' + rankCls(w.id) + '">' + tag + '<div class="q-ja">' + esc(w.ja) + '</div><small class="pos">' + POS[w.pos] + '</small></div><p class="q-ask">スペイン語では？</p>';
      right = V.head(w); list = shuffle([right].concat(others(w, 3, 'head'))).map(esc);
    } else if (type === 'cloze') {
      prompt = '<div class="q-card cloze' + rankCls(w.id) + '">' + tag + '<div class="q-ex">' + esc(w.ex[0]).replace(/\{[^}]+\}/, '<span class="blank">？</span>') + '</div><small class="q-exja">' + esc(w.ex[1]) + '</small></div><p class="q-ask">？に入るのは？</p>';
      /* 選択肢の大文字・小文字をそろえる（文頭の空欄だけ大文字、だと答えがばれる） */
      var top = /^[¿¡]?\{/.test(w.ex[0]);
      var cs = function (x) { return top ? x.charAt(0).toUpperCase() + x.slice(1) : x.charAt(0).toLowerCase() + x.slice(1); };
      right = formOf(w); list = shuffle([right].concat(others(w, 3, 'form').map(cs))).map(esc);
    }
    var s = stage('<div class="q">' + prompt + choiceHtml(list, type === 'ja2es' || type === 'cloze' ? 'es' : '') + '<div class="after"></div></div>');
    if (type === 'es2ja' || type === 'listen') setTimeout(function () { Speech.say(V.head(w)); }, 250);
    var answered = false, ri = list.indexOf(esc(right));
    $$('.ch', s).forEach(function (b) {
      b.addEventListener('click', function () {
        if (answered) return; answered = true;
        var ok = +b.dataset.i === ri;
        $$('.ch', s).forEach(function (x) { x.disabled = true; if (+x.dataset.i === ri) x.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        var card = $('.q-card', s);
        if (type === 'listen') card.insertAdjacentHTML('beforeend', '<div class="q-word reveal' + gcls(w) + '">' + headHtml(w) + '</div>');
        if (type === 'cloze') { var bl = $('.blank', s); if (bl) { bl.textContent = right; bl.classList.add('filled'); } }
        if (type === 'ja2es' || type === 'cloze') Speech.say(type === 'cloze' ? w.ex[0] : V.head(w));
        feedback(ok, b, card);
        done(ok, s);
      });
    });
  }
  /* つづりを部品で組み立てる */
  function chunks(word) {
    var m = word.match(/[^aeiouáéíóúü]*[aeiouáéíóúü]+(?:[^aeiouáéíóúü](?![aeiouáéíóúü]))*/gi) || [word];
    var joined = m.join('');
    if (joined.length < word.length) m[m.length - 1] += word.slice(joined.length);
    return m;
  }
  function askSpell(w, opt, done) {
    var parts = chunks(w.w), other = pick(D.words.filter(function (x) { return x !== w; })).w;
    var decoy = pick(chunks(other));
    if (parts.length < 3) { parts = w.w.split(''); decoy = pick(other.split('')); }   // 短い語は1文字ずつ
    var tiles = shuffle(parts.concat(parts.indexOf(decoy) < 0 ? [decoy] : []));
    var a = V.art(w);
    var s = stage('<div class="q"><div class="q-card ja' + rankCls(w.id) + '">' + (opt.tag || '') + '<div class="q-ja">' + esc(w.ja) + '</div><small class="pos">' + POS[w.pos] + '</small></div>' +
      '<p class="q-ask">つづりを組み立てよう</p><div class="spell' + gcls(w) + '">' + (a ? '<span class="art">' + a + '</span>' : '') + '<span class="slot"></span></div>' +
      '<div class="tiles">' + tiles.map(function (t, i) { return '<button class="tl" data-i="' + i + '">' + esc(t) + '</button>'; }).join('') + '</div>' +
      '<div class="spell-ctl"><button class="undo">⌫ 1つ戻す</button></div><div class="after"></div></div>');
    var got = [], slot = $('.slot', s), fin = false;
    function draw() { slot.textContent = got.map(function (g) { return tiles[g]; }).join(''); $$('.tl', s).forEach(function (b) { b.disabled = fin || got.indexOf(+b.dataset.i) >= 0; }); }
    $$('.tl', s).forEach(function (b) {
      b.addEventListener('click', function () {
        if (fin) return;
        got.push(+b.dataset.i); if (window.Snd && Snd.tap) Snd.tap(); draw();
        var now = slot.textContent;
        if (now.length >= w.w.length) {
          fin = true; draw();
          var ok = now === w.w;
          if (!ok) slot.insertAdjacentHTML('afterend', '<span class="fix">→ ' + esc(w.w) + '</span>');
          Speech.say(V.head(w));
          feedback(ok, slot, $('.q-card', s));
          done(ok, s);
        }
      });
    });
    $('.undo', s).addEventListener('click', function () { if (!fin) { got.pop(); draw(); } });
  }

  function feedback(ok, el, card) {
    if (ok) {
      ses.ok++; ses.combo++;
      if (window.Snd) Snd.ok(ses.combo);
      FX.float(el, ses.combo >= 3 ? PRAISE[Math.min(PRAISE.length - 1, ses.combo - 2)] : '○', 'ok');
      FX.burst(el, null, 14);
    } else {
      ses.ng++; ses.combo = 0;
      if (window.Snd) Snd.ng();
      FX.shake(card);
    }
  }
  /* 答えのあとの「つぎへ」（まちがえたときは読む時間をとる） */
  function after(s, html, cb, auto) {
    var box = $('.after', s);
    box.innerHTML = (html || '') + '<button class="next">つぎへ ▶</button>';
    tw(box, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 });
    /* 説明が画面の下に隠れていたら見える所までスクロール */
    var r = box.getBoundingClientRect();
    if (r.bottom > innerHeight) window.scrollBy({ top: Math.min(r.top - 70, r.bottom - innerHeight + 16), behavior: 'smooth' });
    var gone = false;
    function nx() { if (gone) return; gone = true; cb(); }
    $('.next', box).addEventListener('click', nx);
    if (auto) setTimeout(nx, auto);
  }
  function memoHtml(w) {
    return '<div class="exp-box"><div class="ex">' + exHtml(w.ex[0]) + ' ' + sayBtn(w.ex[0]) + '</div><small>' + esc(w.ex[1]) + '</small>' +
      (w.memo ? '<p class="memo">💡 ' + esc(w.memo) + '</p>' : '') + '</div>';
  }

  /* ---- 捕獲の演出：カードが図鑑（右上）へ飛ぶ ---- */
  function captureFx(w, from, known) {
    var r = V.capture(w.id, known);
    ses.caught.push(w.id); ses.exp += r.exp;
    if (window.Snd) Snd.capture();
    var src = from || $('#stage');
    var fly = document.createElement('div');
    fly.className = 'fly-card' + gcls(w) + ' r-bronze';
    fly.innerHTML = headHtml(w);
    var a = src.getBoundingClientRect(), b = $('#pDexBox').getBoundingClientRect();
    fly.style.left = (a.left + a.width / 2) + 'px'; fly.style.top = (a.top + a.height / 2) + 'px';
    document.body.appendChild(fly);
    FX.burst(src, null, 22);
    FX.float(src, '¡Capturado!', 'cap');
    var end = function () { fly.remove(); $('#pDex').textContent = V.caughtCount(); tw($('#pDexBox'), { scale: 1.5 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }); };
    if (!G) return end();
    G.timeline({ onComplete: end })
      .fromTo(fly, { xPercent: -50, yPercent: -50, scale: 0.6, opacity: 0 }, { scale: 1.15, opacity: 1, duration: 0.3, ease: 'back.out(2)' })
      .to(fly, { left: b.left + b.width / 2, top: b.top + b.height / 2, scale: 0.2, rotate: 20, duration: 0.55, ease: 'power2.in', delay: 0.25 });
  }
  function levelFx(w, up) {
    ses.ups.push(w.id);
    setTimeout(function () {
      if (window.Snd) Snd.levelUp(up);
      FX.slam(pick(['¡EVOLUCIÓN!', '¡OLÉ!', '¡ARRIBA!']), w.w + ' が ' + V.RANKS[up].name + ' に進化！');
      FX.rain(up >= 3 ? 'petal' : null);
    }, 350);
  }

  /* =========================================================
   * 👀 顔見知りチェック
   * ========================================================= */
  function blockFace(b, next) {
    var list = shuffle(V.faceList()).slice(0, b.n), i = 0;
    function one() {
      var w = list[i++]; if (!w) return next();
      var tag = '<span class="qtag">👀 ' + i + ' / ' + list.length + '</span>';
      var right = w.ja, opts = shuffle([right].concat(others(w, 3, 'ja')));
      var s = stage('<div class="q"><div class="q-card' + gcls(w) + '">' + tag + '<div class="q-word">' + headHtml(w) + '</div>' + sayBtn(V.head(w)) + '</div>' +
        '<p class="q-ask">知ってる？ 意味は？</p>' + choiceHtml(opts.map(esc)) + '<button class="dunno">🤔 わからない（出会いで覚える）</button><div class="after"></div></div>');
      setTimeout(function () { Speech.say(V.head(w)); }, 250);
      var answered = false, ri = opts.indexOf(right);
      function settle(ok, el) {
        if (answered) return; answered = true;
        $$('.ch, .dunno', s).forEach(function (x) { x.disabled = true; if (x.classList.contains('ch') && +x.dataset.i === ri) x.classList.add('right'); });
        if (ok) { feedback(true, el, $('.q-card', s)); captureFx(w, $('.q-card', s), true); setTimeout(one, 1100); }
        else {
          if (el.classList.contains('ch')) { el.classList.add('wrong'); feedback(false, el, $('.q-card', s)); } else ses.combo = 0;
          V.toMeet(w.id);
          after(s, '<p class="note">「' + esc(w.ja) + '」。この単語は🌱出会いで、ゆっくり覚えよう。</p>', one);
        }
      }
      $$('.ch', s).forEach(function (x) { x.addEventListener('click', function () { settle(+x.dataset.i === ri, x); }); });
      $('.dunno', s).addEventListener('click', function (e) { settle(false, e.currentTarget); });
    }
    one();
  }

  /* =========================================================
   * 🌱 出会い：予想 → 説明 → 見分ける → 捕獲
   * ========================================================= */
  var CLUE = { cog: '🔗 英語と似ている', trap: '⚠️ 英語と似ているけど…', parts: '🧩 部品に分けると', ctx: '🎬 こんな場面' };
  function blockMeet(b, next) {
    var words = V.meetList().slice(0, b.n), k = 0;
    function meetOne() {
      var w = words[k++];
      if (!w) return discern();
      var c = w.clue || { t: 'ctx', text: '' };
      var opts = [w.ja];
      if (c.lure) opts.push(c.lure);
      opts = shuffle(opts.concat(others(w, 3 - opts.length, 'ja').filter(function (x) { return x !== c.lure; }).slice(0, 3 - opts.length)));
      var s = stage('<div class="q meet"><div class="q-card big' + gcls(w) + '"><span class="qtag">🌱 出会い ' + k + ' / ' + words.length + '</span>' +
        '<div class="q-word">' + headHtml(w) + '</div>' + sayBtn(V.head(w)) + '<small class="pos">' + POS[w.pos] + (w.pos === 'n' ? (w.g === 'f' ? '・女性' : '・男性') : '') + '</small></div>' +
        '<div class="clue"><b>' + CLUE[c.t] + '</b><p>' + esc(c.text) + '</p>' + (c.t === 'ctx' ? '<div class="ex">' + exHtml(w.ex[0]) + '</div>' : '') + '</div>' +
        '<p class="q-ask">🤔 どんな意味だと思う？<small>（予想なので、まちがえても大丈夫）</small></p>' + choiceHtml(opts.map(esc)) + '<div class="after"></div></div>');
      setTimeout(function () { Speech.say(V.head(w)); }, 300);
      var done = false, ri = opts.indexOf(w.ja);
      $$('.ch', s).forEach(function (x) {
        x.addEventListener('click', function () {
          if (done) return; done = true;
          var ok = +x.dataset.i === ri;
          $$('.ch', s).forEach(function (y) { y.disabled = true; if (+y.dataset.i === ri) y.classList.add('right'); });
          if (!ok) x.classList.add('miss');
          if (window.Snd) (ok ? Snd.ok(0) : Snd.flip());
          if (ok) FX.burst(x, 'petal', 16);
          var head = ok ? '🎯 予想的中！' : c.t === 'trap' && opts[+x.dataset.i] === c.lure ? '😆 ひっかかった！ 英語とはちがう意味' : '💡 正解は…';
          after(s, '<p class="reveal-h">' + head + '</p><div class="meaning' + gcls(w) + '">' + headHtml(w) + ' ＝ <b>' + esc(w.ja) + '</b></div>' + memoHtml(w), meetOne);
          if (ses.met.indexOf(w.id) < 0) ses.met.push(w.id);
        });
      });
    }
    /* 見分ける：1語につき2問（意味を選ぶ・スペイン語を選ぶ）。まちがえたら後ろへ */
    function discern() {
      if (!words.length) return next();
      var need = {}, q = [];
      words.forEach(function (w) { need[w.id] = 2; q.push([w, Speech.ok() && Math.random() < 0.5 ? 'listen' : 'es2ja']); });
      q = shuffle(q).concat(shuffle(words.map(function (w) { return [w, 'ja2es']; })));
      var total = q.length, n = 0;
      function one() {
        var it = q.shift(); if (!it) return next();
        n++;
        ask(it[0], it[1], { tag: '<span class="qtag">🌱 見分ける ' + Math.min(n, total) + ' / ' + total + '</span>' }, function (ok, s) {
          var w = it[0];
          if (ok) {
            need[w.id]--;
            if (need[w.id] <= 0) { captureFx(w, $('.q-card', s), false); setTimeout(one, 1200); }
            else setTimeout(one, 800);
          } else { q.push(it); total++; after(s, '<div class="meaning' + gcls(w) + '">' + headHtml(w) + ' ＝ <b>' + esc(w.ja) + '</b></div>', one); }
        });
      }
      stage('<div class="interlude"><p class="big-t">🌱 ' + words.length + '語と出会った！</p><p>見分けられたら、図鑑に入るよ</p><button class="next go">見分ける ▶</button></div>');
      $('#stage .go').addEventListener('click', one);
    }
    meetOne();
  }

  /* =========================================================
   * ⚔ 野生戦・🚑 救出
   * ========================================================= */
  function typesFor(w) {
    var c = V.card(w.id), lv = c ? c.lv : 0, easy = S.settings.mood === 'easy', t = ['es2ja'];
    if (Speech.ok()) t.push('listen');
    if (easy) return pick(t);
    if (lv >= 1) t.push('ja2es');
    if (lv >= 2) t.push('spell');
    if (lv >= 3) t.push('cloze');
    return Math.random() < 0.5 ? t[t.length - 1] : pick(t);   // 半分は、いまのレベルのいちばん難しい問い方
  }
  function fight(w, tagText, cb) {
    var wasWild = V.state(w.id) === 'wild';
    var tag = '<span class="qtag">' + tagText + '</span><span class="wild-badge">' + (wasWild ? '🍂 野生に戻りかけ' : '🥀 しおれかけ') + '</span>';
    stage('<div class="appear"><p>野生の</p><div class="q-card wild' + gcls(w) + rankCls(w.id) + '"><div class="q-word">？？？</div></div><p>が あらわれた！</p></div>');
    if (window.Snd) Snd.appear();
    setTimeout(function () {
      ask(w, typesFor(w), { tag: tag }, function (ok, s) {
        var r = V.answer(w.id, ok);
        if (ok) {
          ses.exp += r.exp;
          FX.float($('.q-card', s), '+' + r.exp + ' EXP', 'exp');
          if (r.back) { ses.backs++; ses.backIds.push(w.id); setTimeout(function () { if (window.Snd) Snd.back(); FX.float($('.q-card', s), 'おかえり！', 'cap'); }, 500); }
          if (r.up) levelFx(w, r.up);
          after(s, gaugeHtml(w), cb, r.up ? 0 : 1400);
        } else {
          after(s, '<div class="meaning' + gcls(w) + '">' + headHtml(w) + ' ＝ <b>' + esc(w.ja) + '</b></div><p class="note">にげられた… また出てくるので、そのとき取り返そう</p>', cb);
        }
      });
    }, 900);
  }
  function gaugeHtml(w) {
    var c = V.card(w.id), nx = V.toNext(w.id);
    return '<div class="gauge"><span class="rk r-' + V.RANKS[c.lv].id + '">' + V.RANKS[c.lv].name + '</span>' +
      (nx ? '<div class="gbar"><i style="width:' + Math.min(100, Math.round(nx.now / nx.need * 100)) + '%"></i></div><small>進化まで ' + Math.max(0, nx.need - nx.now) + ' EXP</small>' : '<small>最高ランク！</small>') + '</div>';
  }
  function blockWild(b, next) {
    var list = V.wildList().slice(0, b.n), i = 0;
    (function one() { var w = list[i++]; if (!w) return next(); fight(w, '⚔ ' + i + ' / ' + list.length, one); })();
  }
  function blockRescue(b, next) { fight(V.word(b.id), '🚑 救出', next); }

  /* =========================================================
   * 結果
   * ========================================================= */
  function finish() {
    var did = ses.caught.length + ses.ups.length + ses.ok + ses.ng + ses.met.length;
    if (!did) { go('home'); return; }
    if (window.Snd) Snd.finish();
    go('done');
    var grown = []; ses.caught.concat(ses.ups, ses.backIds).forEach(function (id) { if (grown.indexOf(id) < 0) grown.push(id); });
    $('#dTitle').textContent = ses.caught.length || ses.ups.length ? '¡Muy bien!' : '¡Buen trabajo!';
    var lines = [];
    if (ses.caught.length) lines.push('📖 図鑑に <b>' + ses.caught.length + '枚</b> 追加');
    if (ses.ups.length) lines.push('✨ <b>' + ses.ups.length + '枚</b> が進化');
    if (ses.backs) lines.push('🤝 野生から <b>' + ses.backs + '枚</b> 取り返した');
    if (ses.met.length) lines.push('🌱 <b>' + ses.met.length + '語</b> と出会った');
    lines.push('⭐ <b>+' + ses.exp + ' EXP</b>（今日 +' + S.day.exp + '）');
    $('#dLines').innerHTML = lines.map(function (l) { return '<li>' + l + '</li>'; }).join('');
    $('#dCards').innerHTML = grown.map(function (id) { return miniCard(V.word(id)); }).join('');
    /* 次回予告 */
    var soon = Object.keys(S.cards).filter(function (id) { return V.state(id) === 'fresh' && V.condition(id, Date.now() + 24 * 3600e3) < 0.75; }).length;
    var wilt = V.wildList().length;
    var ntxt = wilt ? '🥀 しおれかけが <b>' + wilt + '枚</b>。⚔ 野生戦で助けられる' :
      soon ? '🔮 明日、<b>' + soon + '枚</b> がしおれ始めそう。そのときに思い出せると、大きく育つ' : '🔮 いまはみんな元気。明日また会おう';
    if (V.faceList().length) ntxt += '<br>👀 顔見知りチェックは あと ' + V.faceList().length + '語';
    $('#dNext').innerHTML = ntxt;
    if (G) G.fromTo('#done .anim, #dCards .mini', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(1.6)' });
    if (ses.caught.length + ses.ups.length >= 3) FX.rain();
  }

  /* =========================================================
   * 📖 図鑑
   * ========================================================= */
  function miniCard(w) {
    var c = V.card(w.id);
    if (!c) return '<button class="mini none" data-id="' + w.id + '"><span class="no">' + (w.i + 1) + '</span><span class="q">？</span></button>';
    var st = V.state(w.id);
    return '<button class="mini' + gcls(w) + ' r-' + V.RANKS[c.lv].id + ' st-' + st + '" data-id="' + w.id + '" style="--cond:' + V.condition(w.id).toFixed(2) + '">' +
      '<span class="no">' + V.RANKS[c.lv].mark + ' ' + (w.i + 1) + '</span>' + (st !== 'fresh' ? '<span class="stb">' + (st === 'wild' ? '🍂' : '🥀') + '</span>' : '') +
      '<span class="mw">' + headHtml(w) + '</span><span class="mj">' + esc(w.ja) + '</span><span class="rb">' + V.RANKS[c.lv].name + '</span></button>';
  }
  function renderDex() {
    var got = V.caughtCount();
    $('#xCount').textContent = got + ' / ' + D.words.length;
    $('#xBody').innerHTML = D.sections.map(function (sec) {
      var ws = D.words.filter(function (w) { return w.s === sec.id; });
      var g = ws.filter(function (w) { return V.card(w.id); }).length;
      return '<h3>' + esc(sec.name) + '<small>' + g + ' / ' + ws.length + '</small></h3><div class="grid">' + ws.map(miniCard).join('') + '</div>';
    }).join('');
    if (G) G.fromTo('#xBody .mini', { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, stagger: 0.012, ease: 'back.out(2)' });
  }
  function openSheet(id) {
    var w = V.word(id), c = V.card(id), box = $('#sheetBody');
    if (!c) {
      box.innerHTML = '<div class="sh-none"><p class="big-t">？</p><p>No.' + (w.i + 1) + '　まだ出会っていない単語</p><p class="note">' + (V.SEC[w.s].known ? '👀 顔見知りチェック' : '🌱 出会い') + 'で会えるよ</p></div>';
    } else {
      var st = V.state(id), cond = Math.round(V.condition(id) * 100);
      box.innerHTML = '<div class="q-card big' + gcls(w) + ' r-' + V.RANKS[c.lv].id + '"><span class="qtag">No.' + (w.i + 1) + '</span><div class="q-word">' + headHtml(w) + '</div>' + sayBtn(V.head(w)) +
        '<small class="pos">' + POS[w.pos] + '</small></div><div class="meaning">' + esc(w.ja) + '</div>' + memoHtml(w) + gaugeHtml(w) +
        '<div class="cond"><span>コンディション</span><div class="gbar c"><i style="width:' + cond + '%"></i></div><b>' + (st === 'fresh' ? '元気' : st === 'wilt' ? '🥀 しおれかけ' : '🍂 野生に戻りかけ') + '</b></div>' +
        (st !== 'fresh' ? '<button class="next rescue" data-id="' + id + '">🚑 救出する</button>' : '');
      var rb = $('.rescue', box);
      if (rb) rb.addEventListener('click', function () { closeSheet(); start([{ type: 'rescue', id: id }]); });
    }
    $('#sheet').hidden = false;
    tw($('#sheet .sh'), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' });
  }
  function closeSheet() { $('#sheet').hidden = true; }

  function toast(t, sub) {
    var el = document.createElement('div'); el.className = 'toast'; el.innerHTML = '<b>' + esc(t) + '</b><small>' + esc(sub || '') + '</small>';
    document.body.appendChild(el);
    tw(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 });
    setTimeout(function () { el.remove(); }, 3000);
  }

  /* =========================================================
   * つなぎこみ
   * ========================================================= */
  function bind() {
    document.title = D.brand + '｜' + D.title;
    document.documentElement.dataset.skin = D.skin;
    $$('[data-min]').forEach(function (b) { b.addEventListener('click', function () { start(makePlan(+b.dataset.min), b.dataset.min + '分'); }); });
    $$('.mood button').forEach(function (b) { b.addEventListener('click', function () { S.settings.mood = b.dataset.mood; V.save(); renderHome(); if (window.Snd) Snd.tap(); }); });
    $('#alacarte').addEventListener('click', function (e) {
      var t = e.target.closest('.tile'); if (!t || t.disabled) return;
      var id = t.dataset.block;
      if (id === 'dex') return go('dex');
      start([{ type: id, n: id === 'meet' ? 3 : id === 'face' ? 10 : 6 }]);
    });
    $('#quit').addEventListener('click', function () { if (window.speechSynthesis) speechSynthesis.cancel(); finish(); });
    $$('[data-go]').forEach(function (b) { b.addEventListener('click', function () { go(b.dataset.go); }); });
    $('#dMore').addEventListener('click', function () { start(makePlan(5), '5分'); });
    $('#xBody').addEventListener('click', function (e) { var m = e.target.closest('.mini'); if (m) openSheet(m.dataset.id); });
    $('#dCards').addEventListener('click', function (e) { var m = e.target.closest('.mini'); if (m) openSheet(m.dataset.id); });
    $('#sheet').addEventListener('click', function (e) { if (e.target.id === 'sheet' || e.target.closest('.sh-close')) closeSheet(); });
    $('#tgSound').addEventListener('change', function (e) { S.settings.sound = e.target.checked; V.save(); });
    $('#tgSpeak').addEventListener('change', function (e) { S.settings.speak = e.target.checked; V.save(); });
    $('#xReset').addEventListener('click', function () { if (confirm('このデッキの記録（図鑑・経験値）をすべて消します。よろしいですか？')) V.reset(); });
    go('home');
  }
  window.VUI = { go: go, start: start, makePlan: makePlan, chunks: chunks };
  bind();
})();
