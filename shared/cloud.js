/* =========================================================
 * shared/cloud.js — クラウド保存（Supabase）
 *  端末の保存（localStorage）はそのまま使い、ログインした端末だけ、その中身をクラウドにも置く。
 *    ・アプリは今までどおり localStorage を読み書きするだけ（アプリ側の変更なし）
 *    ・このファイルが localStorage の変化を見つけてクラウドへ上げ、他の端末の変化を取りこむ
 *    ・ログインしていない／設定がないときは何もしない（今までどおり端末だけ）
 *  全アプリの入口の <head> の最初で読み込む（アプリが記録を読む前に）。
 *  設定・ログイン・履歴からの復元は cloud.html。Supabase の準備は docs/クラウド保存.md。
 *
 *  クラウドの単位は localStorage のキー1つ（値は文字列のまま）。
 *    cloud.auth   ログイン情報（この端末だけ）
 *    cloud.meta   キーごとに「最後にクラウドとそろえたときの中身（ハッシュ）と、クラウド側の更新時刻」
 *  両方で変わっていたら、あとで変えたほうを残し、負けたほうはクラウドの履歴（kv_history）に置く。
 * ========================================================= */
(function () {
  'use strict';
  /* Supabase のプロジェクト（Project Settings → API）。anon key は公開してよい鍵（中身は行単位の権限で守る） */
  var SB_URL = 'https://iuhgjbvlklznuhmnwsbo.supabase.co';
  var SB_ANON = 'sb_publishable_ZvJywJ40bY7E-G8ZY7300Q_Ijx4OJlj';

  var AUTH_KEY = 'cloud.auth', META_KEY = 'cloud.meta';
  var PAGE_START = Date.now();
  var LS = null;
  try { LS = window.localStorage; } catch (e) { /* 保存領域が使えない環境 */ }
  var getRaw = LS ? Storage.prototype.getItem : null;
  function lsGet(k) { try { return getRaw.call(LS, k); } catch (e) { return null; } }
  function lsSet(k, v) { if (v == null) LS.removeItem(k); else LS.setItem(k, v); }
  function readJSON(k) { try { return JSON.parse(lsGet(k)) || null; } catch (e) { return null; } }
  function writeJSON(k, v) { try { LS.setItem(k, JSON.stringify(v)); } catch (e) { /* 容量不足 */ } }

  /* 同期するキー：テスト用・お試し用・このファイル自身・お知らせの既読は端末ごと */
  function tracked(k) { return !/^cloud\.|^le\.news\.|e2e|sandbox/.test(k); }
  function localKeys() {
    var a = [];
    try { for (var i = 0; i < LS.length; i++) { var k = LS.key(i); if (k && tracked(k)) a.push(k); } } catch (e) { /* */ }
    return a;
  }
  /* 中身の指紋（FNV-1a 32bit＋長さ）。null は「キーがない」 */
  function hv(s) {
    if (s == null) return null;
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
    return (h >>> 0).toString(36) + '.' + s.length;
  }

  /* 上の値を書きかえずに試すとき：localStorage 'cloud.conf' = {"url":"…","anon":"…"} */
  var conf = readJSON('cloud.conf');
  if (conf && conf.url) { SB_URL = conf.url; SB_ANON = conf.anon; }
  var auth = readJSON(AUTH_KEY);
  var meta = readJSON(META_KEY);
  function saveMeta() { writeJSON(META_KEY, meta); }
  var configured = !!(SB_URL && SB_ANON && LS);
  var testPage = /[?&](e2e|sandbox)\b/.test(location.search);
  function active() { return configured && !testPage && !!auth && !!meta && meta.user === auth.user && !!meta.linked; }

  /* ---------- 通信 ---------- */
  function req(path, opt) {
    opt = opt || {};
    var h = { apikey: SB_ANON, 'Content-Type': 'application/json' };
    if (opt.token) h.Authorization = 'Bearer ' + opt.token;
    if (opt.prefer) h.Prefer = opt.prefer;
    var body = opt.body === undefined ? undefined : JSON.stringify(opt.body);
    return fetch(SB_URL + path, { method: opt.method || 'GET', headers: h, body: body, keepalive: !!opt.keepalive && body && body.length < 60000 })
      .then(function (r) {
        if (!r.ok) return r.text().then(function (t) { var e = new Error(r.status + ' ' + t); e.status = r.status; throw e; });
        return r.status === 204 ? null : r.text().then(function (t) { return t ? JSON.parse(t) : null; });
      });
  }
  function setAuth(d) {
    auth = { user: d.user.id, email: d.user.email, access: d.access_token, refresh: d.refresh_token, exp: d.expires_at || (Date.now() / 1000 + d.expires_in) };
    writeJSON(AUTH_KEY, auth);
  }
  var refreshing = null;
  function token() {
    if (!auth) return Promise.reject(new Error('ログインしていません'));
    if (auth.exp * 1000 - Date.now() > 60000) return Promise.resolve(auth.access);
    if (!refreshing) {
      /* 他のタブが先に更新していればそれを使う */
      var a = readJSON(AUTH_KEY);
      if (a && a.user === auth.user && a.exp * 1000 - Date.now() > 60000) { auth = a; return Promise.resolve(auth.access); }
      refreshing = req('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: auth.refresh } })
        .then(function (d) { setAuth(d); return auth.access; })
        .catch(function (e) { if (e.status === 400 || e.status === 401) { setStatus('ログインし直してください'); auth.broken = true; writeJSON(AUTH_KEY, auth); } throw e; })
        .then(function (t) { refreshing = null; return t; }, function (e) { refreshing = null; throw e; });
    }
    return refreshing;
  }
  function api(path, opt) { return token().then(function (t) { opt = opt || {}; opt.token = t; return req(path, opt); }); }
  function put(k, v, expected, keepalive) {
    return api('/rest/v1/rpc/kv_put', { method: 'POST', body: { p_key: k, p_value: v, p_expected: expected || null }, keepalive: keepalive });
  }
  function backup(list) {
    list = list.filter(function (b) { return b.value != null; });
    if (!list.length) return Promise.resolve();
    return api('/rest/v1/kv_history', { method: 'POST', body: list, prefer: 'return=minimal' });
  }
  function rowsSince(since) {
    var q = '/rest/v1/kv?select=key,value,updated_at&order=updated_at.asc';
    if (since) q += '&updated_at=gt.' + encodeURIComponent(new Date(Date.parse(since) - 60000).toISOString());
    return api(q);
  }
  function setStatus(err) {
    if (!meta) return;
    if (err) meta.err = String(err).slice(0, 200); else { delete meta.err; meta.ok = Date.now(); }
    saveMeta();
  }

  /* ---------- 同期 ---------- */
  /* 前回そろえたときから変わったキーに、変わった時刻（最初に気づいた時刻）を付ける */
  function scan() {
    var now = Date.now(), seen = {}, changed = false;
    localKeys().concat(Object.keys(meta.keys)).forEach(function (k) {
      if (seen[k]) return; seen[k] = 1;
      var m = meta.keys[k], h = hv(lsGet(k));
      if (!m) { meta.keys[k] = m = { h: null, t: null }; changed = true; }
      if (m.h !== h) { if (!m.d) { m.d = now; changed = true; } }
      else if (m.d) { delete m.d; changed = true; }
    });
    if (changed) saveMeta();
    return Object.keys(meta.keys).filter(function (k) { return meta.keys[k].d; });
  }
  var firstPulled = false;
  /* クラウドの変化を取りこむ。取りこんだキーの一覧を返す */
  function pull() {
    scan();
    return rowsSince(meta.lastPull).then(function (rows) {
      var applied = [], losers = [];
      rows.forEach(function (r) {
        if (!meta.lastPull || Date.parse(r.updated_at) > Date.parse(meta.lastPull)) meta.lastPull = r.updated_at;
        if (!tracked(r.key)) return;
        var m = meta.keys[r.key] || (meta.keys[r.key] = { h: null, t: null });
        if (m.t === r.updated_at) return;
        var v = lsGet(r.key), h = hv(v), rh = hv(r.value);
        if (h === rh) { meta.keys[r.key] = { h: rh, t: r.updated_at }; return; }
        var localDirty = h !== m.h;
        /* ページを開いた直後にアプリが書いた分は「古い記録を読んだうえでの変化」なので、クラウドを優先 */
        var fresh = m.d && m.d >= PAGE_START && !firstPulled;
        if (localDirty && m.d && !fresh && m.d > Date.parse(r.updated_at)) {
          losers.push({ key: r.key, value: r.value, reason: 'conflict-cloud' });
          m.t = r.updated_at;            // 次の push でこの端末の中身を上書きで置く
        } else {
          if (localDirty) losers.push({ key: r.key, value: v, reason: 'conflict-device' });
          try { lsSet(r.key, r.value); } catch (e) { return; }
          meta.keys[r.key] = { h: rh, t: r.updated_at };
          applied.push(r.key);
        }
      });
      firstPulled = true;
      saveMeta();
      return backup(losers).then(function () { return applied; });
    });
  }
  /* 変わったキーをクラウドへ。クラウド側が先に変わっていたら、取りこんでからもう一度 */
  function push(keepalive, retried) {
    var dirty = scan();
    var conflict = false;
    return dirty.reduce(function (p, k) {
      return p.then(function () {
        var v = lsGet(k), h = hv(v), m = meta.keys[k];
        return put(k, v, m.t, keepalive).then(function (t) {
          if (t == null) { conflict = true; return; }
          meta.keys[k] = hv(lsGet(k)) === h ? { h: h, t: t } : { h: h, t: t, d: m.d };
          saveMeta();
        });
      });
    }, Promise.resolve()).then(function () {
      if (conflict && !retried) return pull().then(function (applied) { return push(keepalive, true).then(function () { return applied; }); });
      return [];
    });
  }

  var chain = Promise.resolve(), lastPush = 0;
  function queue(fn) {
    chain = chain.then(fn).then(function (r) { setStatus(null); return r; }, function (e) { setStatus(e.message || e); return []; });
    return chain;
  }
  /* アプリがすでに読んだキーが他の端末の記録で入れかわったら、読み直す（画面の中の記録と食い違わないように） */
  var readKeys = {};
  function reloadIfNeeded(applied) {
    if (!applied || !applied.some(function (k) { return readKeys[k]; })) return;
    var last = 0;
    try { last = +sessionStorage.getItem('cloud.reloadAt') || 0; sessionStorage.setItem('cloud.reloadAt', Date.now()); } catch (e) { /* */ }
    if (Date.now() - last > 15000) location.reload();
  }
  function syncNow() {
    return queue(function () { return pull().then(function (a) { lastPush = Date.now(); return push(false).then(function (b) { return a.concat(b); }); }); });
  }

  function start() {
    /* アプリが読んだキーを覚える */
    var orig = Storage.prototype.getItem;
    Storage.prototype.getItem = function (k) { if (this === LS) readKeys[k] = 1; return orig.apply(this, arguments); };
    syncNow().then(reloadIfNeeded);
    setInterval(function () {
      if (document.hidden || Date.now() - lastPush < 15000) return;
      if (scan().length) { lastPush = Date.now(); queue(function () { return push(false); }).then(reloadIfNeeded); }
    }, 5000);
    var hiddenAt = 0;
    function leave() { hiddenAt = Date.now(); if (scan().length) { lastPush = Date.now(); queue(function () { return push(true); }); } }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) leave();
      else if (Date.now() - hiddenAt > 20000) syncNow().then(reloadIfNeeded);
    });
    window.addEventListener('pagehide', leave);
  }

  /* ---------- 設定画面（cloud.html）から使う ---------- */
  window.LECloud = {
    configured: configured,
    active: active,
    state: function () { return { configured: configured, email: auth && auth.email, broken: !!(auth && auth.broken), linked: active(), ok: meta && meta.ok, err: meta && meta.err }; },
    login: function (email, password) {
      return req('/auth/v1/token?grant_type=password', { method: 'POST', body: { email: email, password: password } }).then(function (d) {
        var same = auth && auth.user === d.user.id;
        setAuth(d);
        if (!same || !meta || meta.user !== d.user.id) { meta = { user: d.user.id, keys: {}, lastPull: null, linked: false }; saveMeta(); }
      });
    },
    logout: function () {
      var t = auth && auth.access;
      if (t) req('/auth/v1/logout', { method: 'POST', token: t }).catch(function () { /* */ });
      auth = null; meta = null;
      try { LS.removeItem(AUTH_KEY); LS.removeItem(META_KEY); } catch (e) { /* */ }
    },
    /* はじめてつなぐ前に、両方にあって中身がちがうキーを調べる */
    preview: function () {
      return rowsSince(null).then(function (rows) {
        var remote = {}, both = [];
        rows.forEach(function (r) { if (tracked(r.key)) remote[r.key] = r; });
        localKeys().forEach(function (k) { var r = remote[k]; if (r && r.value != null && hv(r.value) !== hv(lsGet(k))) both.push(k); });
        return { rows: rows, cloud: Object.keys(remote).filter(function (k) { return remote[k].value != null; }).length, device: localKeys().length, differ: both };
      });
    },
    /* はじめてつなぐ。prefer：両方にあって中身がちがうとき 'cloud' か 'device' を残す（負けたほうはクラウドの履歴へ） */
    link: function (prefer) {
      return LECloud.preview().then(function (p) {
        var losers = [], now = Date.now(), remote = {};
        meta.keys = {}; meta.lastPull = null;
        p.rows.forEach(function (r) {
          if (!meta.lastPull || Date.parse(r.updated_at) > Date.parse(meta.lastPull)) meta.lastPull = r.updated_at;
          if (!tracked(r.key)) return;
          remote[r.key] = 1;
          var v = lsGet(r.key), rh = hv(r.value);
          if (hv(v) === rh) meta.keys[r.key] = { h: rh, t: r.updated_at };
          else if (v == null || r.value != null && prefer === 'cloud') {
            if (v != null) losers.push({ key: r.key, value: v, reason: 'link-device' });
            lsSet(r.key, r.value);
            meta.keys[r.key] = { h: rh, t: r.updated_at };
          } else {
            losers.push({ key: r.key, value: r.value, reason: 'link-cloud' });
            meta.keys[r.key] = { h: rh, t: r.updated_at, d: now };
          }
        });
        localKeys().forEach(function (k) { if (!remote[k]) meta.keys[k] = { h: null, t: null, d: now }; });
        meta.linked = true; firstPulled = true;
        saveMeta();
        return backup(losers).then(function () { return push(false); }).then(function () { setStatus(null); });
      });
    },
    sync: function () { return syncNow().then(function () { if (meta && meta.err) throw new Error(meta.err); }); },
    tracked: tracked,
    keys: function () { return localKeys(); },
    /* 履歴（自動で1時間ごとに残る前の版と、同期でぶつかって負けた版） */
    history: function (k) {
      return api('/rest/v1/kv_history?select=id,key,reason,saved_at&order=saved_at.desc&limit=60&key=eq.' + encodeURIComponent(k));
    },
    /* 履歴の版をこの端末に戻し、クラウドにも置く（今の中身は履歴に残す） */
    restore: function (id) {
      return api('/rest/v1/kv_history?select=key,value&id=eq.' + encodeURIComponent(id)).then(function (rows) {
        var r = rows[0]; if (!r) throw new Error('履歴が見つかりません');
        var cur = lsGet(r.key);
        return backup([{ key: r.key, value: cur, reason: 'before-restore' }]).then(function () {
          lsSet(r.key, r.value);
          return queue(function () { return push(false); });
        }).then(function () { if (meta && meta.err) throw new Error(meta.err); return r.key; });
      });
    }
  };

  if (active() && !auth.broken) start();
})();
