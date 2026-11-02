'use strict';
// =====================================================================
// Utilidades
// =====================================================================
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const now = () => Date.now();
const pad = n => String(n).padStart(2, '0');
const dkey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseD = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DOW_L = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DOW_1 = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];
const MON = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MON_L = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DAY = 864e5;

const nf = {};
function fmtN(n, dec = 1, group = true) {
  if (n == null || n === '' || isNaN(n)) return '';
  const k = dec + '|' + group;
  nf[k] = nf[k] || new Intl.NumberFormat('es-CO', { maximumFractionDigits: dec, useGrouping: group });
  return nf[k].format(n);
}
function fmtCompact(n) {
  if (Math.abs(n) >= 1e6) return fmtN(n / 1e6, 1) + ' M';
  if (Math.abs(n) >= 1e4) return fmtN(n / 1e3, 0) + 'k';
  return fmtN(n, 0);
}
function parseNum(s) {
  if (s == null) return NaN;
  const t = String(s).trim().replace(/\s/g, '').replace(',', '.');
  if (t === '') return NaN;
  return Number(t);
}
function startOfDay(t) { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); }
function startOfWeek(t) { const d = new Date(startOfDay(t)); const dow = (d.getDay() + 6) % 7; d.setDate(d.getDate() - dow); return d.getTime(); }
function fmtDate(t, opts = {}) {
  const d = new Date(t), y = new Date().getFullYear();
  let s = `${opts.long ? DOW_L[d.getDay()] : DOW[d.getDay()].toLowerCase()} ${d.getDate()} ${opts.long ? 'de ' + MON_L[d.getMonth()] : MON[d.getMonth()]}`;
  if (d.getFullYear() !== y || opts.year) s += ` ${opts.long ? 'de ' : ''}${d.getFullYear()}`;
  return s;
}
function fmtShort(t) { const d = new Date(t); return `${d.getDate()} ${MON[d.getMonth()]}`; }
function fmtTime(t) { const d = new Date(t); return `${d.getHours() % 12 || 12}:${pad(d.getMinutes())} ${d.getHours() < 12 ? 'a. m.' : 'p. m.'}`; }
function fmtDur(ms) {
  const m = Math.max(0, Math.round(ms / 60000));
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${pad(m % 60)} min`;
}
function clock(sec) {
  sec = Math.max(0, Math.floor(sec));
  const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}
function relDay(t) {
  const d = Math.round((startOfDay(now()) - startOfDay(t)) / DAY);
  if (d === 0) return 'hoy';
  if (d === 1) return 'ayer';
  if (d < 7) return `hace ${d} días`;
  return fmtShort(t);
}
function plural(n, one, many) { return `${fmtN(n, 0)} ${n === 1 ? one : many}`; }

// =====================================================================
// Estado y almacenamiento local
// =====================================================================
// No cambies estas claves: ahí viven los datos de quienes ya usan la app.
const LS_KEY = 'hierro.v1', LS_ACTIVE = 'hierro.active';
const DEFAULT_SETTINGS = { unit: 'kg', rest: 90, bar: 20, sound: true, vib: true, theme: 'auto', goal: null, wake: true, u: 0 };
const S = { settings: { ...DEFAULT_SETTINGS }, ex: {}, rt: {}, wo: {}, bw: {} };
const KINDS = ['ex', 'rt', 'wo', 'bw'];
let VER = 0; // sube con cada cambio; invalida cálculos en caché

const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};

function loadLocal() {
  try {
    const j = JSON.parse(store.get(LS_KEY) || 'null');
    if (j) {
      S.settings = { ...DEFAULT_SETTINGS, ...(j.settings || {}) };
      for (const k of KINDS) S[k] = j[k] || {};
    }
  } catch (e) {}
  VER++;
}
let saveTimer = null;
function saveLocal(immediate) {
  clearTimeout(saveTimer);
  const go = () => store.set(LS_KEY, JSON.stringify(S));
  if (immediate) go(); else saveTimer = setTimeout(go, 120);
}

function put(kind, rec, opts = {}) {
  rec.u = now();
  S[kind][rec.id] = rec;
  VER++;
  saveLocal();
  if (!opts.quiet) scheduleRender();
  return rec;
}
function remove(kind, id) {
  const r = S[kind][id];
  if (!r) return null;
  const copy = JSON.parse(JSON.stringify(r));
  put(kind, { ...r, del: 1 });
  return copy;
}
function restore(kind, rec) { const r = { ...rec }; delete r.del; put(kind, r); }
function putSettings(patch) {
  Object.assign(S.settings, patch, { u: now() });
  VER++;
  saveLocal();
  applyTheme();
  scheduleRender();
}
const live = kind => Object.values(S[kind]).filter(r => !r.del);

// =====================================================================
// Revisión de copias importadas
// Una copia puede venir de cualquier parte: se limpia antes de tocar S.
// Los campos desconocidos se conservan (si son datos simples) para no
// perder nada que haya escrito una versión más nueva de la app.
// =====================================================================
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;
const BAD_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const MAX_IMPORT = 20 * 1024 * 1024;
const idOk = v => typeof v === 'string' && ID_RE.test(v) && !BAD_KEYS.has(v);
const numOk = (v, lo, hi) => typeof v === 'number' && isFinite(v) && v >= lo && v <= hi;
const capStr = (v, max) => typeof v === 'string' ? v.slice(0, max) : '';
const asList = v => Array.isArray(v) ? v : [];

// Copia profunda solo con datos JSON simples y sin claves peligrosas
function plain(v, depth = 0) {
  if (v === null || typeof v === 'boolean') return v;
  if (typeof v === 'number') return isFinite(v) ? v : undefined;
  if (typeof v === 'string') return v.slice(0, 4000);
  if (depth > 8 || typeof v !== 'object') return undefined;
  if (Array.isArray(v)) return v.slice(0, 50000).map(x => plain(x, depth + 1)).filter(x => x !== undefined);
  const o = {};
  for (const k of Object.keys(v).slice(0, 50000)) {
    if (BAD_KEYS.has(k)) continue;
    const x = plain(v[k], depth + 1);
    if (x !== undefined) o[k] = x;
  }
  return o;
}

const CLEAN = {
  ex(r) {
    const n = capStr(r.n, 120).trim();
    if (!idOk(r.id) || !n) return null;
    return { ...r, n, m: MUSCLES[r.m] || MUSCLES_LEGACY[r.m] ? r.m : 'otro', e: EQUIP[r.e] ? r.e : 'otro', t: ['w', 'bw', 't', 'c'].includes(r.t) ? r.t : 'w', bar: !!r.bar };
  },
  rt(r) {
    if (!idOk(r.id)) return null;
    const days = [...new Set(asList(r.days).filter(d => Number.isInteger(d) && d >= 0 && d <= 6))];
    const items = asList(r.items).filter(it => it && idOk(it.ex)).map(it => ({
      ...it, sets: numOk(it.sets, 1, 99) ? Math.round(it.sets) : 3, reps: capStr(String(it.reps ?? ''), 20),
      rest: numOk(it.rest, 0, 3600) ? it.rest : undefined
    }));
    return { ...r, name: capStr(r.name, 120), days, items, ord: numOk(r.ord, -1e9, 1e9) ? r.ord : 0 };
  },
  wo(r) {
    if (!idOk(r.id) || !numOk(r.start, 0, 1e14)) return null;
    const items = asList(r.items).filter(it => it && idOk(it.ex)).map(it => ({
      ...it, note: it.note == null ? undefined : capStr(it.note, 2000),
      sets: asList(it.sets).filter(s => s && typeof s === 'object' && !Array.isArray(s)).map(s => ({ ...s, w: numOk(s.w, 0, 1e5) ? s.w : 0, r: numOk(s.r, 0, 1e6) ? s.r : 0 }))
    }));
    return {
      ...r, name: capStr(r.name, 120), note: capStr(r.note, 4000), items,
      rid: idOk(r.rid) ? r.rid : undefined,
      end: numOk(r.end, r.start, 1e14) ? r.end : undefined
    };
  },
  bw(r) {
    if (!idOk(r.id) || !/^\d{4}-\d{2}-\d{2}$/.test(r.date) || !numOk(r.w, 1, 1000)) return null;
    return { ...r };
  }
};
function cleanSettings(s) {
  if (!s || typeof s !== 'object') return null;
  const o = {};
  if (s.unit === 'kg' || s.unit === 'lb') o.unit = s.unit;
  if (numOk(s.rest, 0, 3600)) o.rest = s.rest;
  if (numOk(s.bar, 0, 1000)) o.bar = s.bar;
  for (const k of ['sound', 'vib', 'wake']) if (typeof s[k] === 'boolean') o[k] = s[k];
  if (['auto', 'light', 'dark'].includes(s.theme)) o.theme = s.theme;
  if (s.goal === null || numOk(s.goal, 1, 1000)) o.goal = s.goal;
  return o;
}
// Devuelve la copia limpia, o null si no es una copia de la app
function cleanBackup(raw) {
  const j = plain(raw);
  if (!j || typeof j !== 'object' || Array.isArray(j) || (j.app !== 'hierro' && j.app !== 'hercules' && !j.wo)) return null;
  const t = typeof j.exported === 'string' ? Date.parse(j.exported) : NaN;
  const out = { exported: isFinite(t) ? t : null, settings: cleanSettings(j.settings), skipped: 0 };
  for (const k of KINDS) {
    const list = Array.isArray(j[k]) ? j[k] : (j[k] && typeof j[k] === 'object' ? Object.values(j[k]) : []);
    out[k] = [];
    for (const r of list) {
      const c = r && typeof r === 'object' && !Array.isArray(r) ? CLEAN[k](r) : null;
      if (c) { delete c.del; out[k].push(c); } else out.skipped++;
    }
  }
  return out;
}

// =====================================================================
// Ejercicios
// =====================================================================
const BUILTIN = Object.fromEntries(BUILTIN_EXERCISES.map(e => [e.id, e]));
function exById(id) {
  const c = S.ex[id];
  if (c && !c.del) return c;
  if (BUILTIN[id]) return BUILTIN[id];
  if (c) return c; // eliminado, pero tiene historial
  return { id, n: 'Ejercicio desconocido', m: 'otro', e: 'otro', t: 'w' };
}
function allExercises() {
  return [...BUILTIN_EXERCISES, ...live('ex')].sort((a, b) => a.n.localeCompare(b.n, 'es'));
}
function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

// =====================================================================
// Unidades
// =====================================================================
const LB = 2.2046226218;
const unit = () => S.settings.unit;
const toDisp = kg => unit() === 'lb' ? kg * LB : kg;
const fromDisp = v => unit() === 'lb' ? v / LB : v;
function fmtW(kg, dec = 1) { return fmtN(roundDisp(toDisp(kg)), dec); }
function roundDisp(v) { return Math.round(v * 100) / 100; }
function wUnit() { return unit(); }

// =====================================================================
// Estadísticas (memorizadas por versión)
// =====================================================================
function memo(fn) { let v = -1, val; return () => { if (v !== VER) { val = fn(); v = VER; } return val; }; }
const e1rm = (w, r) => (!w || !r || r > 15) ? 0 : (r === 1 ? w : w * (1 + r / 30));
const workSets = it => (it.sets || []).filter(s => !s.warm);

const workouts = memo(() => live('wo').filter(w => w.end).sort((a, b) => a.start - b.start));

function sessionMetrics(type, sets) {
  const ws = sets.filter(s => !s.warm);
  const m = { sets: ws.length };
  if (type === 'w') {
    m.e1rm = Math.max(0, ...ws.map(s => e1rm(s.w, s.r)));
    m.maxW = Math.max(0, ...ws.map(s => s.w || 0));
    m.bestSet = ws.reduce((b, s) => (s.w * s.r > (b ? b.w * b.r : -1) ? s : b), null);
    m.vol = ws.reduce((a, s) => a + (s.w || 0) * (s.r || 0), 0);
    m.maxR = Math.max(0, ...ws.map(s => s.r || 0));
  } else if (type === 'bw') {
    m.maxR = Math.max(0, ...ws.map(s => s.r || 0));
    m.maxW = Math.max(0, ...ws.map(s => s.w || 0));
    m.totR = ws.reduce((a, s) => a + (s.r || 0), 0);
    m.vol = ws.reduce((a, s) => a + (s.w || 0) * (s.r || 0), 0);
  } else if (type === 't') {
    m.maxT = Math.max(0, ...ws.map(s => s.r || 0));
    m.totT = ws.reduce((a, s) => a + (s.r || 0), 0);
  } else if (type === 'c') {
    m.km = ws.reduce((a, s) => a + (s.w || 0), 0);
    m.min = ws.reduce((a, s) => a + (s.r || 0), 0);
  }
  return m;
}

// Historial por ejercicio + récords personales detectados
const exHistory = memo(() => {
  const map = {};
  const prs = {}; // woId -> [{ex, label, value}]
  const best = {};
  for (const w of workouts()) {
    for (const it of w.items || []) {
      const ex = exById(it.ex);
      const m = sessionMetrics(ex.t, it.sets || []);
      if (!m.sets) continue;
      (map[it.ex] = map[it.ex] || []).push({ wo: w, sets: it.sets, m });
      const b = best[it.ex];
      const events = [];
      if (b) {
        if (ex.t === 'w') {
          if (m.e1rm > b.e1rm + 0.01) events.push({ k: 'e1rm', label: '1RM est.', v: m.e1rm, w: true });
          if (m.maxW > b.maxW + 0.01) events.push({ k: 'maxW', label: 'Peso máx.', v: m.maxW, w: true });
          if (m.vol > b.vol + 0.01 && !events.length) events.push({ k: 'vol', label: 'Volumen', v: m.vol, w: true });
        } else if (ex.t === 'bw') {
          if (m.maxR > b.maxR) events.push({ k: 'maxR', label: 'Reps', v: m.maxR });
          if (m.maxW > b.maxW + 0.01) events.push({ k: 'maxW', label: 'Lastre', v: m.maxW, w: true });
        } else if (ex.t === 't') {
          if (m.maxT > b.maxT) events.push({ k: 'maxT', label: 'Tiempo', v: m.maxT, t: true });
        } else if (ex.t === 'c') {
          if (m.km > b.km + 0.001) events.push({ k: 'km', label: 'Distancia', v: m.km, km: true });
        }
      }
      if (events.length) (prs[w.id] = prs[w.id] || []).push(...events.map(e => ({ ...e, ex: it.ex, at: w.start })));
      const nb = { ...(b || {}) };
      for (const k of ['e1rm', 'maxW', 'vol', 'maxR', 'maxT', 'km']) if (m[k] != null) nb[k] = Math.max(nb[k] || 0, m[k]);
      best[it.ex] = nb;
    }
  }
  return { map, prs, best };
});

function woSummary(w) {
  let sets = 0, vol = 0;
  for (const it of w.items || []) {
    const ex = exById(it.ex);
    for (const s of it.sets || []) {
      if (s.warm) continue;
      sets++;
      if (ex.t === 'w' || ex.t === 'bw') vol += (s.w || 0) * (s.r || 0);
    }
  }
  return { sets, vol, dur: (w.end || now()) - w.start };
}

function lastSession(exId, beforeTs = Infinity) {
  const h = exHistory().map[exId];
  if (!h) return null;
  for (let i = h.length - 1; i >= 0; i--) if (h[i].wo.start < beforeTs) return h[i];
  return null;
}

function weekStreak() {
  const ws = workouts();
  if (!ws.length) return 0;
  const weeks = new Set(ws.map(w => startOfWeek(w.start)));
  let cur = startOfWeek(now());
  let n = 0;
  if (!weeks.has(cur)) cur -= 7 * DAY; // la semana en curso todavía no rompe la racha
  while (weeks.has(cur)) { n++; cur = startOfWeek(cur - 3 * DAY); }
  return n;
}

function setLabel(ex, s) {
  if (ex.t === 'w') return `${fmtW(s.w)} × ${fmtN(s.r, 0)}`;
  if (ex.t === 'bw') return s.w ? `+${fmtW(s.w)} × ${fmtN(s.r, 0)}` : `${fmtN(s.r, 0)} reps`;
  if (ex.t === 't') return clock(s.r || 0);
  if (ex.t === 'c') return `${fmtN(s.w || 0, 2)} km, ${fmtN(s.r || 0, 0)} min`;
  return '';
}
function prText(p) {
  if (p.w) return `${fmtW(p.v)} ${wUnit()}`;
  if (p.t) return clock(p.v);
  if (p.km) return `${fmtN(p.v, 2)} km`;
  return fmtN(p.v, 0);
}
