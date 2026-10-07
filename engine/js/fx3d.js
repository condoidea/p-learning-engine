/* fx3d.js — three.js の背景演出
 *  ・星空パーティクル / シンセウェーブ風グリッド / 回転するデータコア
 *  ・正解でコアが脈動＋衝撃波、不正解で赤く明滅、コンボで加速、FEVER で虹色
 */
(function () {
  'use strict';
  var api = { pulse: noop, miss: noop, setEnergy: noop, fever: noop, setMode: noop, setTheme: noop, burst: noop, setLite: noop };
  window.FX3D = api;
  function noop() {}
  if (!window.THREE) return;

  var canvas = document.getElementById('bg3d');
  var renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' }); }
  catch (e) { return; }
  var lite = false;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x05060f, 1);

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05060f, 0.045);
  var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
  camera.position.set(0, 0.6, 9);

  var accent = new THREE.Color('#38e8ff');
  var accent2 = new THREE.Color('#7a5cff');

  /* ---- 星空 ---- */
  var STARS = 2600;
  var sg = new THREE.BufferGeometry();
  var sp = new Float32Array(STARS * 3), sc = new Float32Array(STARS * 3);
  for (var i = 0; i < STARS; i++) {
    var r = 14 + Math.random() * 40, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    sp[i * 3] = r * Math.sin(ph) * Math.cos(th);
    sp[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.6;
    sp[i * 3 + 2] = r * Math.cos(ph);
    var k = Math.random();
    sc[i * 3] = 0.6 + k * 0.4; sc[i * 3 + 1] = 0.7 + k * 0.3; sc[i * 3 + 2] = 1;
  }
  sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  sg.setAttribute('color', new THREE.BufferAttribute(sc, 3));
  var stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 0.09, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(stars);

  /* ---- グリッド床（奥から流れてくる） ---- */
  var grid = new THREE.GridHelper(80, 60, 0xffffff, 0xffffff);
  grid.material.color = accent2.clone();
  grid.material.transparent = true; grid.material.opacity = 0.28;
  grid.position.y = -3.2;
  scene.add(grid);

  /* ---- データコア ---- */
  var core = new THREE.Group();
  scene.add(core);
  var ico = new THREE.IcosahedronGeometry(1.35, 1);
  var wire = new THREE.LineSegments(new THREE.EdgesGeometry(ico), new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.95 }));
  core.add(wire);
  var inner = new THREE.Mesh(new THREE.IcosahedronGeometry(0.85, 2), new THREE.MeshBasicMaterial({ color: accent2, transparent: true, opacity: 0.35, wireframe: true }));
  core.add(inner);
  var glow = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 24), new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.6 }));
  core.add(glow);
  var rings = [];
  for (var j = 0; j < 3; j++) {
    var ring = new THREE.Mesh(new THREE.TorusGeometry(2 + j * 0.42, 0.012, 8, 128), new THREE.MeshBasicMaterial({ color: j % 2 ? accent2 : accent, transparent: true, opacity: 0.55 }));
    ring.rotation.x = Math.PI / 2 + (j - 1) * 0.5;
    ring.rotation.y = j * 0.7;
    core.add(ring); rings.push(ring);
  }
  /* 周回する小さなビット */
  var BITS = 120, bitGeo = new THREE.BufferGeometry(), bitPos = new Float32Array(BITS * 3), bitSeed = [];
  for (var b = 0; b < BITS; b++) bitSeed.push({ r: 2.2 + Math.random() * 1.6, s: 0.2 + Math.random() * 0.8, o: Math.random() * 6.28, tilt: (Math.random() - 0.5) * 1.6 });
  bitGeo.setAttribute('position', new THREE.BufferAttribute(bitPos, 3));
  var bits = new THREE.Points(bitGeo, new THREE.PointsMaterial({ color: accent, size: 0.07, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
  core.add(bits);

  /* ---- 衝撃波リング（使い回し） ---- */
  var waves = [];
  for (var w = 0; w < 6; w++) {
    var wm = new THREE.Mesh(new THREE.RingGeometry(0.96, 1, 96), new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
    wm.visible = false; scene.add(wm); waves.push(wm);
  }
  var waveIdx = 0;

  /* ---- ブルーム（読み込めた場合のみ） ---- */
  var composer = null, bloom = null;
  function setupComposer() {
    if (!THREE.EffectComposer || !THREE.UnrealBloomPass || !THREE.RenderPass) return;
    try {
      composer = new THREE.EffectComposer(renderer);
      composer.addPass(new THREE.RenderPass(scene, camera));
      bloom = new THREE.UnrealBloomPass(new THREE.Vector2(256, 256), 1.1, 0.6, 0.12);
      composer.addPass(bloom);
    } catch (e) { composer = null; }
  }
  setupComposer();

  /* ---- 状態 ---- */
  var st = { energy: 0, feverOn: false, hue: 0, mode: 'home', speed: 1, shake: 0 };
  var tgt = { x: 0, y: 0.6, z: 9, cx: 2.6, cy: 0.4, scale: 1 };
  var mouse = { x: 0, y: 0 };

  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    if (composer) { composer.setSize(w, h); }
    applyMode(st.mode, true);
  }
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  function applyMode(mode, instant) {
    st.mode = mode;
    var narrow = window.innerWidth < 820;
    var p;
    if (mode === 'quiz') p = { cx: 0, cy: narrow ? 3.2 : 0, z: narrow ? 13 : 12, scale: narrow ? 0.7 : 1.25 };
    else if (mode === 'result') p = { cx: 0, cy: narrow ? 3.4 : 0.6, z: narrow ? 14 : 8.5, scale: narrow ? 0.7 : 1.1 };
    else if (mode === 'lesson') p = { cx: narrow ? 0 : 7.5, cy: narrow ? -5.5 : -1, z: 18, scale: 0.55 };
    else if (mode === 'page') p = { cx: narrow ? 0 : 5, cy: narrow ? 5 : 1.5, z: 18, scale: 0.6 };
    else p = { cx: narrow ? 0 : 3.4, cy: narrow ? 2.8 : 0.4, z: narrow ? 11 : 9, scale: narrow ? 0.85 : 1 };
    if (window.gsap && !instant) {
      gsap.to(tgt, { cx: p.cx, cy: p.cy, z: p.z, scale: p.scale, duration: 1.2, ease: 'expo.inOut' });
    } else { tgt.cx = p.cx; tgt.cy = p.cy; tgt.z = p.z; tgt.scale = p.scale; }
  }

  var clock = new THREE.Clock(), gridOffset = 0, running = true;
  document.addEventListener('visibilitychange', function () { running = !document.hidden; if (running) { clock.getDelta(); loop(); } });

  function loop() {
    if (!running) return;
    requestAnimationFrame(loop);
    var dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    var spd = 1 + st.energy * 2.5 + (st.feverOn ? 2 : 0);

    stars.rotation.y += dt * 0.012 * spd;
    stars.rotation.x = Math.sin(t * 0.05) * 0.05;
    gridOffset = (gridOffset + dt * 1.2 * spd) % (80 / 60);
    grid.position.z = gridOffset;

    core.position.x += (tgt.cx - core.position.x) * 0.08;
    core.position.y += (tgt.cy + Math.sin(t * 1.1) * 0.12 - core.position.y) * 0.08;
    var s = tgt.scale * (1 + Math.sin(t * 2.2) * 0.015);
    core.scale.setScalar(core.scale.x + (s - core.scale.x) * 0.1);
    wire.rotation.y += dt * 0.35 * spd; wire.rotation.x += dt * 0.12 * spd;
    inner.rotation.y -= dt * 0.6 * spd; inner.rotation.z += dt * 0.2;
    rings.forEach(function (r, i) { r.rotation.z += dt * (0.2 + i * 0.15) * spd * (i % 2 ? -1 : 1); });

    for (var k = 0; k < BITS; k++) {
      var sd = bitSeed[k], a = sd.o + t * sd.s * spd * 0.6;
      bitPos[k * 3] = Math.cos(a) * sd.r;
      bitPos[k * 3 + 1] = Math.sin(a * 1.3) * sd.tilt;
      bitPos[k * 3 + 2] = Math.sin(a) * sd.r;
    }
    bitGeo.attributes.position.needsUpdate = true;

    if (st.feverOn) {
      st.hue = (st.hue + dt * 0.35) % 1;
      wire.material.color.setHSL(st.hue, 1, 0.62);
      glow.material.color.setHSL((st.hue + 0.5) % 1, 1, 0.6);
      grid.material.color.setHSL((st.hue + 0.25) % 1, 1, 0.5);
    }

    camera.position.x += (tgt.x + mouse.x * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (tgt.y - mouse.y * 0.35 - camera.position.y) * 0.04;
    camera.position.z += (tgt.z - camera.position.z) * 0.06;
    if (st.shake > 0.001) {
      camera.position.x += (Math.random() - 0.5) * st.shake;
      camera.position.y += (Math.random() - 0.5) * st.shake;
      st.shake *= 0.86;
    }
    camera.lookAt(0, 0, 0);

    if (!window.innerWidth || !window.innerHeight) return; // 非表示（サイズ0）のときは描画しない
    if (composer && !lite) composer.render(); else renderer.render(scene, camera);
  }

  /* ---- 公開API ---- */
  api.pulse = function (strength) {
    strength = strength || 1;
    if (!window.gsap) return;
    gsap.fromTo(glow.scale, { x: 1, y: 1, z: 1 }, { x: 1 + 1.2 * strength, y: 1 + 1.2 * strength, z: 1 + 1.2 * strength, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' });
    gsap.fromTo(wire.scale, { x: 1.18, y: 1.18, z: 1.18 }, { x: 1, y: 1, z: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    if (bloom) gsap.fromTo(bloom, { strength: 1.1 + strength * 1.4 }, { strength: 1.1, duration: 0.8, ease: 'power2.out' });
    api.burst(strength);
  };
  api.burst = function (strength) {
    var m = waves[waveIdx++ % waves.length];
    m.visible = true;
    m.position.copy(core.position);
    m.lookAt(camera.position);
    m.material.color.copy(st.feverOn ? new THREE.Color().setHSL(st.hue, 1, 0.6) : accent);
    m.material.opacity = 0.9;
    m.scale.setScalar(0.5);
    var to = 4 + (strength || 1) * 3;
    gsap.to(m.scale, { x: to, y: to, z: to, duration: 0.9, ease: 'expo.out' });
    gsap.to(m.material, { opacity: 0, duration: 0.9, ease: 'power2.out', onComplete: function () { m.visible = false; } });
  };
  api.miss = function () {
    st.shake = 0.35;
    if (!window.gsap) return;
    var red = new THREE.Color('#ff4d6d');
    var c0 = wire.material.color.clone(), g0 = glow.material.color.clone();
    wire.material.color.copy(red); glow.material.color.copy(red);
    gsap.to({ k: 0 }, { k: 1, duration: 0.7, ease: 'power2.out', onUpdate: function () {
      var k = this.targets()[0].k;
      if (!st.feverOn) { wire.material.color.copy(red).lerp(c0, k); glow.material.color.copy(red).lerp(g0, k); }
    } });
    gsap.fromTo(core.rotation, { z: 0.25 }, { z: 0, duration: 0.6, ease: 'elastic.out(1,0.3)' });
  };
  api.setEnergy = function (e) { st.energy = Math.max(0, Math.min(1, e)); };
  api.fever = function (on) {
    if (st.feverOn === on) return;
    st.feverOn = on;
    if (!on) api.setTheme(null);
    if (bloom && window.gsap) gsap.to(bloom, { strength: on ? 1.8 : 1.1, duration: 0.8 });
  };
  api.setMode = function (m) { applyMode(m, false); };
  api.setTheme = function (theme) {
    if (theme) { accent.set(theme.a); accent2.set(theme.b); }
    wire.material.color.copy(accent); glow.material.color.copy(accent);
    inner.material.color.copy(accent2); bits.material.color.copy(accent);
    grid.material.color.copy(accent2);
    rings.forEach(function (r, i) { r.material.color.copy(i % 2 ? accent2 : accent); });
  };
  api.setLite = function (on) {
    lite = !!on;
    renderer.setPixelRatio(lite ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    stars.visible = true;
    bits.visible = !lite;
    resize();
  };
  api.shake = function (v) { st.shake = v; };

  resize();
  loop();
})();
