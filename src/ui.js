// =====================================================================
// Iconos
// =====================================================================
const IC = (() => {
  const p = {
    home: '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/>',
    routines: '<rect x="2.5" y="9" width="3" height="6" rx="1"/><rect x="18.5" y="9" width="3" height="6" rx="1"/><rect x="5.5" y="6.5" width="3" height="11" rx="1"/><rect x="15.5" y="6.5" width="3" height="11" rx="1"/><path d="M8.5 12h7"/>',
    history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3.5 4.5v4h4"/><path d="M12 7.5V12l3 2"/>',
    progress: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="m7.5 15 4-4.5 3 2.5 5-6"/>',
    body: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M8 9.5a5 5 0 0 1 8 0"/><path d="m12 10 1.5-2"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    right: '<path d="m9 6 6 6-6 6"/>',
    back: '<path d="m15 6-6 6 6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    more: '<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    up: '<path d="m6 15 6-6 6 6"/>',
    trash: '<path d="M4 7h16"/><path d="M9 7V4.5h6V7"/><path d="M6.5 7 7.5 20h9l1-13"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    play: '<path d="M7 4.5v15l12.5-7.5z" fill="currentColor" stroke="none"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    download: '<path d="M12 4v11"/><path d="m7 10.5 5 5 5-5"/><path d="M4.5 19.5h15"/>',
    upload: '<path d="M12 15.5V4.5"/><path d="m7 9 5-5 5 5"/><path d="M4.5 19.5h15"/>',
    note: '<path d="M5 4h14v11l-5 5H5z"/><path d="M14 20v-5h5"/>',
    timer: '<circle cx="12" cy="13.5" r="7"/><path d="M12 10v3.5l2 1.5"/><path d="M9.5 3h5"/>',
    swap: '<path d="M7 4 3.5 7.5 7 11"/><path d="M3.5 7.5H17"/><path d="m17 13 3.5 3.5L17 20"/><path d="M20.5 16.5H7"/>',
    plate: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.2"/>',
    cloud: '<path d="M7 18.5h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.6 9.1 4.75 4.75 0 0 0 7 18.5z"/><path d="M12 16v-5"/><path d="m9.5 13.5 2.5-2.5 2.5 2.5"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'
  };
  const f = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p[name] || ''}</svg>`;
  return f;
})();

// =====================================================================
// Navegación
// =====================================================================
const TABS = [
  ['home', 'Inicio', 'home'], ['routines', 'Rutinas', 'routines'], ['history', 'Historial', 'history'],
  ['progress', 'Progreso', 'progress'], ['body', 'Peso', 'body']
];
const ui = { tab: 'home', stack: [], q: '', muscle: 'all', bwRange: '3m', volMode: 'vol', exMetric: {}, showAllEx: false, calSel: null };
const IN_APK = !!window.HierroAndroid;
let SPLASH_ON = !!document.getElementById('splash');
const STANDALONE = typeof HIERRO_PWA !== 'undefined' && HIERRO_PWA && /^https?:/.test(location.protocol);

function go(tab) {
  ui.tab = tab; ui.stack = [];
  render(); window.scrollTo(0, 0);
}
function push(v) {
  ui.stack.push(v);
  if (STANDALONE) try { history.pushState({ h: 1 }, ''); } catch (e) {}
  render(); window.scrollTo(0, 0);
}
function back() {
  if (sheets.length) { closeSheet(); return; }
  if (ui.stack.length) { ui.stack.pop(); render(); window.scrollTo(0, 0); }
}
if (STANDALONE) window.addEventListener('popstate', () => {
  if (sheets.length) closeSheet();
  else if (W && W.open) minimizeWorkout();
  else if (ui.stack.length) { ui.stack.pop(); render(); }
});

let renderQueued = false;
function scheduleRender() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => { renderQueued = false; render(); });
}

function render() {
  const top = ui.stack[ui.stack.length - 1];
  let html = '';
  try {
    if (top) html = VIEWS[top.v](top);
    else html = VIEWS[ui.tab]();
  } catch (e) {
    console.error(e);
    html = `<div class="top"><h1>Algo falló</h1></div><div class="note">No se pudo mostrar esta pantalla. Vuelve a Inicio e inténtalo otra vez.</div>`;
  }
  const keep = document.activeElement && document.activeElement.dataset && document.activeElement.dataset.keep;
  const sel = keep ? [document.activeElement.selectionStart, document.activeElement.selectionEnd] : null;
  $('#view').innerHTML = html;
  if (keep) { const el = $(`[data-keep="${keep}"]`); if (el) { el.focus(); try { el.setSelectionRange(sel[0], sel[1]); } catch (e) {} } }
  $$('.tab').forEach(b => b.setAttribute('aria-current', b.dataset.tab === ui.tab ? 'page' : 'false'));
  drawCharts($('#view'));
  if (typeof startDemos === 'function') startDemos();
  renderLive();
}

function topBar(title, { backBtn = false, right = '', cls = '' } = {}) {
  return `<header class="top">${backBtn ? `<button class="icon-btn" data-a="back" aria-label="Volver">${IC('back')}</button>` : ''}<h1 class="${String(title).length > 16 ? 'long' : ''} ${cls}">${esc(title)}</h1>${right}</header>`;
}

// =====================================================================
// Hojas, toasts
// =====================================================================
const sheets = [];
function openSheet({ title = '', body = '', foot = '', cls = '', onMount = null, onClose = null }) {
  const scrim = document.createElement('div');
  scrim.className = 'scrim';
  scrim.innerHTML = `<div class="sheet ${cls}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="grab"></div>
    <div class="sheet-h"><h3>${esc(title)}</h3><button class="icon-btn" data-a="sheet-close" aria-label="Cerrar">${IC('x')}</button></div>
    <div class="sheet-b">${body}</div>${foot ? `<div style="padding:10px 20px 16px;border-top:1px solid var(--line-2)">${foot}</div>` : ''}</div>`;
  scrim.addEventListener('click', e => { if (e.target === scrim) closeSheet(); });
  document.body.appendChild(scrim);
  const entry = { el: scrim, onClose };
  sheets.push(entry);
  if (STANDALONE) try { history.pushState({ s: 1 }, ''); } catch (e) {}
  if (onMount) onMount(scrim.querySelector('.sheet'));
  return entry;
}
function closeSheet(entry) {
  const e = entry || sheets[sheets.length - 1];
  if (!e) return;
  const i = sheets.indexOf(e);
  if (i >= 0) sheets.splice(i, 1);
  e.el.remove();
  if (e.onClose) e.onClose();
}
function sheetBody(entry, html) { entry.el.querySelector('.sheet-b').innerHTML = html; }

function confirmSheet({ title, text = '', ok = 'Aceptar', danger = false, cancel = 'Cancelar' }) {
  return new Promise(res => {
    let done = false;
    const s = openSheet({
      title,
      body: `${text ? `<p class="sub" style="margin:0 0 18px">${text}</p>` : ''}<div class="btn-row"><button class="btn" data-r="0">${esc(cancel)}</button><button class="btn ${danger ? 'danger' : 'primary'}" data-r="1">${esc(ok)}</button></div>`,
      onClose: () => { if (!done) res(false); },
      onMount: el => el.addEventListener('click', e => {
        const b = e.target.closest('[data-r]');
        if (!b) return;
        done = true; closeSheet(s); res(b.dataset.r === '1');
      })
    });
  });
}

let toastTimer;
function toast(msg, action, fn) {
  const old = $('.toast'); if (old) old.remove();
  const t = document.createElement('div');
  t.className = 'toast'; t.setAttribute('role', 'status');
  t.innerHTML = `<span>${esc(msg)}</span>${action ? `<button>${esc(action)}</button>` : ''}`;
  if (action) t.querySelector('button').onclick = () => { t.remove(); fn && fn(); };
  if (W && W.open) t.style.bottom = 'calc(24px + var(--safe-b))';
  document.body.appendChild(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), action ? 5000 : 3000);
}

function renderLive() {
  const el = $('#live');
  if (!el) return;
  if (!A_W() || (W && W.open)) { el.classList.add('hide'); return; }
  el.classList.remove('hide');
  const w = A_W();
  const done = w.items.reduce((a, it) => a + it.sets.filter(s => s.done).length, 0);
  const tot = w.items.reduce((a, it) => a + it.sets.length, 0);
  const r = w.rest, resting = r && !r.fired && r.end > now();
  el.innerHTML = `<span class="live-dot"></span><span class="grow"><span class="t">${esc(w.name || 'Entreno')}</span><span class="s" style="display:block">${done} de ${tot} series</span></span><span style="text-align:right"><span class="n" id="live-n">${resting ? clock(Math.ceil((r.end - now()) / 1000)) : clock((now() - w.start) / 1000)}</span><span class="s" id="live-l" style="display:block;line-height:1">${resting ? 'descanso' : ''}</span></span>`;
}

// =====================================================================
// Selector de ejercicios (multi)
// =====================================================================
function pickExercises({ title = 'Añadir ejercicios', multi = true, onPick, m = 'all' }) {
  const st = { q: '', m: MUSCLES[m] ? m : 'all', sel: [] };
  const counts = {};
  for (const w of workouts()) for (const it of w.items || []) counts[it.ex] = (counts[it.ex] || 0) + 1;
  let entry;
  const list = () => {
    const q = norm(st.q.trim());
    let xs = allExercises().filter(e => exHits(e, st.m) && (!q || norm(e.n).includes(q)));
    if (st.m !== 'all') xs.sort((a, b) => (a.m === st.m ? 0 : 1) - (b.m === st.m ? 0 : 1) || a.n.localeCompare(b.n, 'es'));
    if (st.m === 'all' && !q) {
      const used = xs.filter(e => counts[e.id]).sort((a, b) => counts[b.id] - counts[a.id]).slice(0, 6);
      const usedIds = new Set(used.map(e => e.id));
      let html = '';
      if (used.length) html += `<div class="sub" style="font-size:14px;margin:6px 0">Los que más usas</div><div class="group mb">${used.map(rowEx).join('')}</div>`;
      for (const m of [...Object.keys(MUSCLES), ...Object.keys(MUSCLES_LEGACY)]) {
        const g = xs.filter(e => e.m === m && !usedIds.has(e.id));
        if (g.length) html += `<div class="sub" style="font-size:14px;margin:14px 0 6px">${mLabel(m)}</div><div class="group">${g.map(rowEx).join('')}</div>`;
      }
      return html;
    }
    const create = st.q.trim() ? `<button class="row" data-pk-create style="color:var(--blue);font-weight:600">${IC('plus')}<span class="grow">Crear «${esc(st.q.trim())}»</span></button>` : `<button class="row" data-pk-create style="color:var(--blue);font-weight:600">${IC('plus')}<span class="grow">Crear ejercicio</span></button>`;
    return `<div class="group">${create}${xs.map(rowEx).join('')}</div>${!xs.length ? '<p class="muted" style="text-align:center">No hay ejercicios con ese nombre.</p>' : ''}`;
  };
  const rowEx = e => {
    const on = st.sel.includes(e.id);
    return `<div class="row" data-pk="${esc(e.id)}" role="button" tabindex="0" aria-pressed="${on}" style="cursor:pointer">${DEMOS[e.id] ? `<button class="icon-btn sm pk-info" data-pk-info="${esc(e.id)}" aria-label="Cómo se hace ${esc(e.n)}" style="margin-left:-8px">${IC('play')}</button>` : ''}<span class="grow"><span class="t">${esc(e.n)}</span><span class="s" style="display:block">${exMuscleText(e)}, ${(EQUIP[e.e] || 'otro').toLowerCase()}${e.builtin ? '' : ', propio'}</span></span>${multi ? `<span class="ck" style="${on ? 'background:var(--blue);border-color:var(--blue);color:#fff' : ''}">${IC('check')}</span>` : IC('right').replace('<svg', '<svg class="chev"')}</div>`;
  };
  const chips = () => `<div class="chips">${[['all', 'Todos'], ...Object.entries(MUSCLES)].map(([k, l]) => `<button class="chip" data-pm="${k}" aria-pressed="${st.m === k}">${l}</button>`).join('')}</div>`;
  const foot = () => multi ? `<button class="btn primary block" data-pk-ok ${st.sel.length ? '' : 'disabled'}>${st.sel.length ? `Añadir ${plural(st.sel.length, 'ejercicio', 'ejercicios')}` : 'Elige ejercicios'}</button>` : '';
  const paint = () => {
    entry.el.querySelector('.pk-list').innerHTML = list();
    entry.el.querySelector('.pk-chips').innerHTML = chips();
    const f = entry.el.querySelector('.pk-foot'); if (f) f.innerHTML = foot();
    const on = entry.el.querySelector('.pk-chips [aria-pressed="true"]');
    if (on && st.m !== 'all') try { on.scrollIntoView({ block: 'nearest', inline: 'center' }); } catch (e) {}
  };
  entry = openSheet({
    title, cls: 'picker',
    body: `<div class="pk-head"><div class="search">${IC('search')}<input type="search" placeholder="Buscar ejercicio" aria-label="Buscar ejercicio" class="pk-q" autocomplete="off"></div><div class="pk-chips" style="margin-top:10px"></div></div><div class="pk-list"></div>`,
    foot: multi ? '<div class="pk-foot"></div>' : '',
    onMount: el => {
      el.style.height = '92vh';
      el.querySelector('.pk-q').addEventListener('input', e => { st.q = e.target.value; paint(); });
      el.addEventListener('click', e => {
        const inf = e.target.closest('[data-pk-info]');
        if (inf) { e.stopPropagation(); howtoSheet(inf.dataset.pkInfo); return; }
        const c = e.target.closest('[data-pm]');
        if (c) { st.m = c.dataset.pm; paint(); return; }
        if (e.target.closest('[data-pk-create]')) {
          createExercise(st.q.trim(), st.m !== 'all' ? st.m : null, ex => {
            if (multi) { st.sel.push(ex.id); st.q = ''; el.querySelector('.pk-q').value = ''; paint(); }
            else { closeSheet(entry); onPick([ex.id]); }
          });
          return;
        }
        const p = e.target.closest('[data-pk]');
        if (p) {
          const id = p.dataset.pk;
          if (!multi) { closeSheet(entry); onPick([id]); return; }
          st.sel = st.sel.includes(id) ? st.sel.filter(x => x !== id) : [...st.sel, id];
          paint(); return;
        }
        if (e.target.closest('[data-pk-ok]') && st.sel.length) { closeSheet(entry); onPick(st.sel); }
      });
    }
  });
  paint();
}

function createExercise(name, muscle, done) {
  const st = { n: name || '', m: muscle || 'pecho', e: 'mancuernas', t: 'w' };
  const body = () => `
    <label class="field"><span>Nombre</span><input class="input ce-n" value="${esc(st.n)}" placeholder="Ej.: Press en máquina Smith" autocomplete="off"></label>
    <label class="field"><span>Grupo muscular</span><select class="input ce-m">${Object.entries(MUSCLES).map(([k, l]) => `<option value="${k}" ${st.m === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    <label class="field"><span>Equipo</span><select class="input ce-e">${Object.entries(EQUIP).map(([k, l]) => `<option value="${k}" ${st.e === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    <label class="field"><span>Qué registras</span><select class="input ce-t">
      <option value="w" ${st.t === 'w' ? 'selected' : ''}>Peso y repeticiones</option>
      <option value="bw" ${st.t === 'bw' ? 'selected' : ''}>Repeticiones (lastre opcional)</option>
      <option value="t" ${st.t === 't' ? 'selected' : ''}>Tiempo</option>
      <option value="c" ${st.t === 'c' ? 'selected' : ''}>Distancia y minutos (cardio)</option></select></label>
    <button class="btn primary block ce-ok">Crear ejercicio</button>`;
  const s = openSheet({
    title: 'Nuevo ejercicio', body: body(),
    onMount: el => {
      const n = el.querySelector('.ce-n');
      setTimeout(() => n.focus(), 50);
      el.querySelector('.ce-ok').addEventListener('click', () => {
        const name = n.value.trim();
        if (!name) { n.focus(); toast('Escribe un nombre para el ejercicio'); return; }
        const e = el.querySelector('.ce-e').value;
        const ex = put('ex', { id: 'c-' + uid(), n: name, m: el.querySelector('.ce-m').value, e, t: el.querySelector('.ce-t').value, bar: e === 'barra' });
        closeSheet(s);
        toast('Ejercicio creado');
        done && done(ex);
      });
    }
  });
}

// Botón atrás de Android (lo llama la app nativa). Devuelve true si la app lo manejó.
window.hierroBack = () => {
  try {
    if (sheets.length) { closeSheet(); return true; }
    if (W && W.open) { if (EDIT) A['wo-edit-cancel'](); else minimizeWorkout(); return true; }
    if (ui.stack.length) { back(); return true; }
    if (ui.tab !== 'home') { go('home'); return true; }
  } catch (e) {}
  return false;
};
