// =====================================================================
// Entreno en curso / edición
// =====================================================================
let ACTIVE = null;   // entreno en curso (se guarda en el dispositivo)
let EDIT = null;     // copia de un entreno pasado mientras se edita
const W = { open: false };
const A_W = () => ACTIVE;
const cur = () => EDIT || ACTIVE;

function loadActive() { try { ACTIVE = JSON.parse(store.get(LS_ACTIVE) || 'null'); } catch (e) { ACTIVE = null; } }
let activeTimer;
function saveActive(immediate) {
  clearTimeout(activeTimer);
  const go = () => { if (ACTIVE) store.set(LS_ACTIVE, JSON.stringify(ACTIVE)); else store.del(LS_ACTIVE); };
  if (immediate) go(); else activeTimer = setTimeout(go, 250);
}
const persistW = () => { if (!EDIT) saveActive(); };
const restOf = it => it.rest === -1 ? 0 : (it.rest || S.settings.rest);

function parseTime(s) {
  s = String(s || '').trim();
  if (!s) return NaN;
  if (s.includes(':')) { const [m, x] = s.split(':'); return (parseInt(m, 10) || 0) * 60 + (parseInt(x, 10) || 0); }
  return parseNum(s);
}

function makeItem(exId, opts = {}) {
  const last = lastSession(exId);
  const prevWork = last ? last.sets.filter(s => !s.warm) : [];
  const n = opts.sets || prevWork.length || (exById(exId).t === 'c' ? 1 : 3);
  const repsT = parseInt(String(opts.reps || '').split(/[-–]/)[0], 10);
  const sets = [];
  for (let i = 0; i < n; i++) {
    const p = prevWork[i] || null, ph = p || prevWork[prevWork.length - 1] || null;
    sets.push({ w: '', r: '', done: false, warm: false, pw: ph ? ph.w : null, pr: ph ? ph.r : (isNaN(repsT) ? null : repsT), prev: p ? { w: p.w, r: p.r } : null });
  }
  return { ex: exId, rest: opts.rest || null, reps: opts.reps || '', note: '', sets };
}

function defaultName() {
  const h = new Date().getHours();
  return h < 12 ? 'Entreno de la mañana' : h < 19 ? 'Entreno de la tarde' : 'Entreno de la noche';
}

function startWorkout(rtId, fromWo) {
  if (ACTIVE) { toast('Ya tienes un entreno en curso'); openWorkout(); return; }
  const r = rtId ? S.rt[rtId] : null;
  let items = [];
  if (r) items = (r.items || []).map(it => makeItem(it.ex, { sets: it.sets, reps: it.reps, rest: it.rest }));
  else if (fromWo) items = (fromWo.items || []).map(it => makeItem(it.ex, { sets: it.sets.filter(s => !s.warm).length }));
  ACTIVE = { id: uid(), name: r ? r.name : fromWo ? fromWo.name : defaultName(), rid: r ? r.id : null, start: now(), items, note: '', rest: null };
  saveActive(true);
  openWorkout();
  if (!items.length) setTimeout(() => addExerciseToWorkout(), 250);
}

function openWorkout() {
  if (!cur()) return;
  W.open = true;
  if (STANDALONE) try { history.pushState({ w: 1 }, ''); } catch (e) {}
  renderWorkout();
  if (ACTIVE && !EDIT) keepAwake(true);
  renderLive();
}
function minimizeWorkout() {
  if (EDIT) { EDIT = null; }
  W.open = false;
  const l = $('#layer'); l.classList.add('hide'); l.innerHTML = '';
  keepAwake(false);
  renderRest();
  render();
}
A['wo-resume'] = () => openWorkout();
A['wo-min'] = () => minimizeWorkout();
document.addEventListener('click', e => { if (e.target.closest('#live')) openWorkout(); });

function prevLabel(ex, p) {
  if (!p) return '—';
  if (ex.t === 'w') return `${fmtW(p.w)}×${fmtN(p.r, 0)}`;
  if (ex.t === 'bw') return p.w ? `+${fmtW(p.w)}×${fmtN(p.r, 0)}` : `${fmtN(p.r, 0)}`;
  if (ex.t === 't') return clock(p.r || 0);
  if (ex.t === 'c') return `${fmtN(p.w || 0, 1)}/${fmtN(p.r || 0, 0)}′`;
  return '—';
}
const wInput = (ex, v) => v === '' || v == null ? '' : ex.t === 'c' ? fmtN(v, 2, false) : fmtN(roundDisp(toDisp(v)), 2, false);
const rInput = (ex, v) => v === '' || v == null ? '' : (ex.t === 't' && v >= 60 ? clock(v) : fmtN(v, 0, false));

function renderWorkout() {
  const w = cur();
  const layer = $('#layer');
  if (!w || !W.open) { layer.classList.add('hide'); return; }
  layer.classList.remove('hide');
  const edit = !!EDIT;
  const done = w.items.reduce((a, it) => a + it.sets.filter(s => s.done).length, 0);
  const tot = w.items.reduce((a, it) => a + it.sets.length, 0);
  const cards = w.items.map((it, ii) => {
    const ex = exById(it.ex);
    const cols = { w: [wUnit(), 'Reps'], bw: ['+' + wUnit(), 'Reps'], t: [null, 'Seg'], c: ['Km', 'Min'] }[ex.t] || [wUnit(), 'Reps'];
    let n = 0;
    const rows = it.sets.map((s, si) => {
      const lbl = s.warm ? 'C' : ++n;
      return `<tr class="set ${s.done ? 'done' : ''}">
        <td><button class="set-n ${s.warm ? 'warm' : ''}" data-a="set-warm" data-k="${ii}" data-s="${si}" aria-label="Serie ${lbl}. Toca para marcar como calentamiento">${lbl}</button></td>
        <td><button class="prev" data-a="set-prev" data-k="${ii}" data-s="${si}" aria-label="Copiar la vez anterior">${prevLabel(ex, s.prev)}</button></td>
        ${cols[0] ? `<td><input inputmode="decimal" enterkeyhint="next" autocomplete="off" data-i="set-w" data-k="${ii}" data-s="${si}" value="${esc(s.wt != null ? s.wt : wInput(ex, s.w))}" placeholder="${esc(s.pw != null ? wInput(ex, s.pw) : (ex.t === 'bw' ? '0' : ''))}" aria-label="${cols[0]} serie ${lbl}"></td>` : ''}
        <td><input inputmode="${ex.t === 't' ? 'text' : 'numeric'}" enterkeyhint="done" autocomplete="off" data-i="set-r" data-k="${ii}" data-s="${si}" value="${esc(s.rt != null ? s.rt : rInput(ex, s.r))}" placeholder="${esc(s.pr != null ? rInput(ex, s.pr) : '')}" aria-label="${cols[1]} serie ${lbl}"></td>
        <td><button class="ck" data-a="set-done" data-k="${ii}" data-s="${si}" aria-label="${s.done ? 'Desmarcar' : 'Marcar'} serie ${lbl}" aria-pressed="${s.done}">${IC('check')}</button></td></tr>`;
    }).join('');
    const sub = [it.reps ? `Objetivo ${it.sets.filter(s => !s.warm).length} × ${esc(it.reps)}` : '', !edit ? (restOf(it) ? `descanso ${clock(restOf(it))}` : 'sin descanso') : ''].filter(Boolean).join(', ');
    return `<section class="ex" aria-label="${esc(ex.n)}">
      <div class="ex-h"><div class="grow"><button class="t" data-a="wo-ex-menu" data-k="${ii}">${esc(ex.n)}</button>${sub ? `<div class="s">${sub[0].toUpperCase() + sub.slice(1)}</div>` : ''}</div>
      <button class="icon-btn" data-a="wo-ex-menu" data-k="${ii}" aria-label="Opciones de ${esc(ex.n)}">${IC('more')}</button></div>
      ${it.showNote || it.note ? `<div class="ex-note"><input data-i="ex-note" data-k="${ii}" value="${esc(it.note || '')}" placeholder="Nota: agarre, asiento, sensaciones…" aria-label="Nota del ejercicio"></div>` : ''}
      <table class="sets"><thead><tr><th>Serie</th><th>Anterior</th>${cols[0] ? `<th>${cols[0]}</th>` : ''}<th>${cols[1]}</th><th><span class="sr">Hecha</span></th></tr></thead><tbody>${rows}</tbody></table>
      <div class="ex-f"><button class="btn" data-a="set-add" data-k="${ii}">${IC('plus')}Añadir serie</button>${it.sets.length ? `<button class="btn" style="flex:0 0 auto" data-a="set-rm" data-k="${ii}" aria-label="Quitar la última serie">${IC('x')}</button>` : ''}</div>
    </section>`;
  }).join('');

  const top = edit
    ? `<button class="icon-btn" data-a="wo-edit-cancel" aria-label="Cancelar edición">${IC('x')}</button><div class="clock"><div class="n" style="font-size:20px">Editando</div><div class="s">${fmtDate(w.start, { long: true })}</div></div><button class="btn primary sm" data-a="wo-edit-save">Guardar</button>`
    : `<button class="icon-btn" data-a="wo-min" aria-label="Minimizar entreno">${IC('down')}</button><div class="clock"><div class="n js-clock">${clock((now() - w.start) / 1000)}</div><div class="s">${done} de ${tot} series hechas</div></div><button class="btn primary sm" data-a="wo-finish">Terminar</button>`;

  const keep = document.activeElement && layer.contains(document.activeElement) ? document.activeElement : null;
  const kSel = keep && keep.dataset.i ? `[data-i="${keep.dataset.i}"][data-k="${keep.dataset.k || ''}"][data-s="${keep.dataset.s || ''}"]` : null;
  layer.innerHTML = `<div class="layer-inner"><div class="wo-top">${top}</div>
    <div class="wo-head"><input class="wo-name" data-i="wo-name" value="${esc(w.name)}" aria-label="Nombre del entreno" autocomplete="off">
    <div class="muted" style="font-size:14px">${edit ? 'Las series sin ✓ no se guardan.' : `Empezaste ${relDay(w.start)} a las ${fmtTime(w.start)}`}</div></div>
    ${cards || '<div class="card empty" style="margin:12px"><h3>Entreno vacío</h3><p>Añade el primer ejercicio para empezar a registrar series.</p></div>'}
    <div class="wo-foot">
      <button class="btn primary block" data-a="wo-add-ex">${IC('plus')}Añadir ejercicio</button>
      <label class="field" style="margin:6px 0 0"><span>Notas del entreno</span><textarea class="input" data-i="wo-note" placeholder="Cómo te sentiste, sueño, energía…">${esc(w.note || '')}</textarea></label>
      ${edit ? '' : `<button class="btn ghost" style="color:var(--red)" data-a="wo-discard">Descartar entreno</button>`}
    </div></div>`;
  if (kSel) { const el = layer.querySelector(kSel.replace('[data-k=""]', '').replace('[data-s=""]', '')); if (el) el.focus({ preventScroll: true }); }
  renderRest();
}

// ---------- escritura ----------
function setAt(el) { const w = cur(); const it = w.items[+el.dataset.k]; return { w, it, s: it && it.sets[+el.dataset.s], ex: it && exById(it.ex) }; }
I['set-w'] = el => {
  const { s, ex } = setAt(el); if (!s) return;
  s.wt = el.value;
  const v = parseNum(el.value);
  s.w = isNaN(v) ? '' : (ex.t === 'c' ? v : fromDisp(v));
  persistW();
};
I['set-r'] = el => {
  const { s, ex } = setAt(el); if (!s) return;
  s.rt = el.value;
  const v = ex.t === 't' ? parseTime(el.value) : parseNum(el.value);
  s.r = isNaN(v) ? '' : Math.round(v);
  persistW();
};
I['wo-name'] = el => { cur().name = el.value; persistW(); };
I['wo-note'] = el => { cur().note = el.value; persistW(); };
I['ex-note'] = el => { cur().items[+el.dataset.k].note = el.value; persistW(); };

// ---------- series ----------
A['set-done'] = el => {
  primeAudio();
  const { it, s, ex } = setAt(el); if (!s) return;
  const ii = +el.dataset.k, si = +el.dataset.s;
  if (s.done) { s.done = false; persistW(); renderWorkout(); renderLive(); return; }
  if (s.r === '' || s.r == null) {
    if (s.pr != null) { s.r = s.pr; s.rt = null; }
    else { toast(ex.t === 't' ? 'Escribe los segundos' : ex.t === 'c' ? 'Escribe los minutos' : 'Escribe las repeticiones'); const inp = el.closest('tr').querySelector('[data-i="set-r"]'); inp && inp.focus(); return; }
  }
  if (s.w === '' || s.w == null) { s.w = s.pw != null ? s.pw : 0; s.wt = null; }
  s.done = true;
  // las siguientes series sin historial toman estos valores como sugerencia
  for (let j = si + 1; j < it.sets.length; j++) {
    const n = it.sets[j];
    if (n.done || n.prev) continue;
    if (n.w === '' && s.w) n.pw = s.w;
    if (n.r === '') n.pr = s.r;
  }
  persistW();
  buzz(25);
  if (!EDIT) startRest(ii, si);
  renderWorkout(); renderLive();
};
A['set-warm'] = el => { const { s } = setAt(el); if (!s) return; s.warm = !s.warm; persistW(); renderWorkout(); };
A['set-prev'] = el => {
  const { s } = setAt(el); if (!s || !s.prev || s.done) return;
  s.w = s.prev.w; s.r = s.prev.r; s.wt = null; s.rt = null; persistW(); renderWorkout();
};
A['set-add'] = el => {
  const it = cur().items[+el.dataset.k];
  const last = it.sets[it.sets.length - 1];
  const ls = lastSession(it.ex, EDIT ? EDIT.start : Infinity);
  const work = ls ? ls.sets.filter(x => !x.warm) : [];
  const idx = it.sets.filter(x => !x.warm).length;
  const p = work[idx] || null;
  it.sets.push({
    w: '', r: '', done: false, warm: false, prev: p ? { w: p.w, r: p.r } : null,
    pw: last ? (last.w !== '' ? last.w : last.pw) : (p ? p.w : null),
    pr: last ? (last.r !== '' ? last.r : last.pr) : (p ? p.r : null)
  });
  persistW(); renderWorkout();
};
A['set-rm'] = el => {
  const it = cur().items[+el.dataset.k];
  const gone = it.sets.pop();
  persistW(); renderWorkout();
  if (gone && (gone.done || gone.w !== '' || gone.r !== '')) toast('Serie quitada', 'Deshacer', () => { it.sets.push(gone); persistW(); renderWorkout(); });
};

// ---------- ejercicios del entreno ----------
function addExerciseToWorkout() {
  pickExercises({
    onPick: ids => {
      const w = cur(); if (!w) return;
      for (const id of ids) {
        const item = makeItem(id);
        if (EDIT) item.sets.forEach(s => { s.prev = null; });
        w.items.push(item);
      }
      persistW(); renderWorkout();
      setTimeout(() => { const l = $('#layer'); const secs = l.querySelectorAll('.ex'); const last = secs[secs.length - ids.length]; if (last) last.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
    }
  });
}
A['wo-add-ex'] = () => addExerciseToWorkout();
A['wo-ex-menu'] = el => {
  const w = cur(), k = +el.dataset.k, it = w.items[k], ex = exById(it.ex);
  const items = [
    ...(DEMOS[it.ex] ? [{ icon: 'play', label: 'Cómo se hace', fn: () => howtoSheet(it.ex) }] : []),
    { icon: 'progress', label: 'Ver progreso e historial', fn: () => { minimizeWorkout(); push({ v: 'ex', id: it.ex }); } },
    { icon: 'note', label: it.note || it.showNote ? 'Editar nota' : 'Añadir nota', fn: () => { it.showNote = true; renderWorkout(); setTimeout(() => { const i = $(`#layer [data-i="ex-note"][data-k="${k}"]`); i && i.focus(); }, 30); } }
  ];
  if (!EDIT) items.push({ icon: 'timer', label: restOf(it) ? `Descanso: ${clock(restOf(it))}` : 'Descanso: sin temporizador', fn: () => restPicker(it) });
  if (ex.bar && ex.t === 'w') items.push({ icon: 'plate', label: 'Calcular discos', fn: () => plateSheet(it.sets.find(s => !s.done) || it.sets[it.sets.length - 1]) });
  if (k > 0) items.push({ icon: 'up', label: 'Subir', fn: () => { [w.items[k - 1], w.items[k]] = [w.items[k], w.items[k - 1]]; persistW(); renderWorkout(); } });
  if (k < w.items.length - 1) items.push({ icon: 'down', label: 'Bajar', fn: () => { [w.items[k + 1], w.items[k]] = [w.items[k], w.items[k + 1]]; persistW(); renderWorkout(); } });
  items.push({ icon: 'swap', label: 'Cambiar por otro ejercicio', fn: () => pickExercises({ title: 'Cambiar ejercicio', multi: false, onPick: ([id]) => {
    const n = makeItem(id, { sets: it.sets.length || 3, reps: it.reps, rest: it.rest });
    n.note = it.note;
    w.items[k] = n; persistW(); renderWorkout();
  } }) });
  items.push({ icon: 'trash', label: 'Quitar ejercicio', danger: true, fn: () => {
    const [gone] = w.items.splice(k, 1); persistW(); renderWorkout();
    toast(`Quitaste ${ex.n}`, 'Deshacer', () => { w.items.splice(k, 0, gone); persistW(); renderWorkout(); });
  } });
  menuSheet(ex.n, items);
};
function restPicker(it) {
  const opts = [0, 30, 45, 60, 90, 120, 150, 180, 240, 300];
  const curV = restOf(it);
  const s = openSheet({
    title: 'Descanso entre series',
    body: `<div class="chips" style="flex-wrap:wrap">${opts.map(o => `<button class="chip" data-rs="${o}" aria-pressed="${o === curV}">${o ? clock(o) : 'Sin temporizador'}</button>`).join('')}</div>
      <p class="muted" style="font-size:14px">Solo para este ejercicio en este entreno. El descanso por defecto se cambia en Ajustes y el de cada rutina en su editor.</p>`,
    onMount: el => el.addEventListener('click', e => {
      const b = e.target.closest('[data-rs]'); if (!b) return;
      it.rest = +b.dataset.rs || -1; persistW(); closeSheet(s); renderWorkout();
    })
  });
}

// ---------- descanso ----------
function startRest(ii, si) {
  const it = ACTIVE.items[ii];
  const sec = restOf(it);
  if (!sec) { ACTIVE.rest = null; renderRest(); return; }
  ACTIVE.rest = { end: now() + sec * 1000, total: sec, ii, si, fired: false };
  saveActive();
  renderRest();
}
function nextSet() {
  const w = ACTIVE; if (!w || !w.rest) return null;
  const { ii, si } = w.rest;
  const order = [];
  for (let a = 0; a < w.items.length; a++) {
    const i = (ii + a) % w.items.length;
    const start = a === 0 ? si + 1 : 0;
    for (let j = start; j < w.items[i].sets.length; j++) order.push([i, j]);
  }
  for (const [i, j] of order) if (!w.items[i].sets[j].done) return { it: w.items[i], s: w.items[i].sets[j], i, j };
  return null;
}
function renderRest() {
  const el = $('#rest');
  const r = ACTIVE && ACTIVE.rest;
  if (!r || EDIT || !W.open) { el.classList.add('hide'); el.innerHTML = ''; return; }
  el.classList.remove('hide');
  const nx = nextSet();
  let next = '<div class="rest-next"><span>No quedan series pendientes. ¡Buen trabajo!</span></div>';
  let plates = '';
  if (nx) {
    const ex = exById(nx.it.ex);
    const wv = nx.s.w !== '' ? nx.s.w : nx.s.pw, rv = nx.s.r !== '' ? nx.s.r : nx.s.pr;
    const workIdx = nx.it.sets.slice(0, nx.j + 1).filter(x => !x.warm).length;
    const what = nx.s.warm ? 'calentamiento' : `serie ${workIdx}`;
    let val = '';
    if (ex.t === 'w' && wv != null && wv !== '') val = `${fmtW(wv)} ${wUnit()}${rv ? ` × ${rv}` : ''}`;
    else if (ex.t === 'bw' && rv) val = `${rv} reps`;
    else if (ex.t === 't' && rv) val = clock(rv);
    next = `<div class="rest-next"><span>Sigue: <b>${esc(ex.n)}</b>, ${what}</span><b class="num" style="font-size:17px;white-space:nowrap">${val}</b></div>`;
    if (ex.bar && ex.t === 'w' && wv) plates = platesHtml(toDisp(wv));
  }
  el.innerHTML = `<div class="rest-main"><div><div class="rest-lbl">Descanso</div><div class="rest-time" id="rest-time" aria-live="off">${clock(Math.ceil((r.end - now()) / 1000))}</div></div><div class="grow"></div>
    <button class="rest-btn" data-a="rest-adj" data-d="-15" aria-label="Restar 15 segundos">−15</button><button class="rest-btn" data-a="rest-adj" data-d="15" aria-label="Sumar 15 segundos">+15</button><button class="rest-btn skip" data-a="rest-skip">${r.fired ? 'Cerrar' : 'Saltar'}</button></div>
    <div class="rest-bar"><i id="rest-bar" style="width:${Math.max(0, Math.min(100, (r.end - now()) / (r.total * 10)))}%"></i></div>${next}${plates}`;
  el.classList.toggle('done-flash', !!r.fired);
}
A['rest-adj'] = el => {
  const r = ACTIVE && ACTIVE.rest; if (!r) return;
  const d = +el.dataset.d;
  if (r.fired) { r.fired = false; r.end = now(); }
  r.end = Math.max(now() + 1000, r.end + d * 1000);
  r.total = Math.max(r.total + d, Math.ceil((r.end - now()) / 1000));
  saveActive(); renderRest();
};
A['rest-skip'] = () => { if (ACTIVE) { ACTIVE.rest = null; saveActive(); } renderRest(); };

// ---------- discos ----------
function plateCalc(total) {
  const plates = unit() === 'lb' ? PLATES_LB : PLATES_KG;
  const bar = Number(S.settings.bar) || 0;
  let side = (total - bar) / 2;
  if (side < -0.001) return { under: true, bar };
  const out = [];
  for (const p of plates) while (side >= p.w - 1e-6) { out.push(p); side -= p.w; }
  return { plates: out, rest: side * 2, bar };
}
function platesHtml(total, big) {
  const c = plateCalc(total);
  if (c.under) return `<div class="plates-txt">Es menos que la barra sola (${fmtN(c.bar)} ${wUnit()}).</div>`;
  if (!c.plates.length) return `<div class="plates-txt">Solo la barra (${fmtN(c.bar)} ${wUnit()}).</div>`;
  const H = big ? 120 : 60;
  const width = p => { const r = unit() === 'lb' ? [45, 35, 25, 10, 5] : [20, 15, 10, 5, 2.5]; return p.w >= r[0] ? 18 : p.w >= r[1] ? 16 : p.w >= r[2] ? 14 : p.w >= r[3] ? 11 : p.w >= r[4] ? 9 : 7; };
  const mult = big ? 1.6 : 1;
  const pl = c.plates.map(p => `<span class="plate ${p.c === '#F4F4F2' || p.c === '#F2B200' || p.c === '#B9C0C8' ? 'light' : ''}" style="height:${Math.round(p.h * H)}px;width:${Math.round(width(p) * mult)}px;background:${p.c};${p.c === '#F4F4F2' ? 'box-shadow:inset 0 0 0 1px #C9CED4;' : ''}font-size:${big ? 14 : 11}px">${width(p) >= 14 ? fmtN(p.w) : ''}</span>`).join('');
  const txt = c.plates.map(p => fmtN(p.w)).join(' + ');
  return `<div class="plates" style="height:${H + 4}px" aria-hidden="true"><span class="shaft"></span><span class="collar" style="height:${big ? 36 : 22}px"></span>${pl}<span class="sleeve"></span></div>
    <div class="plates-txt">Por lado: ${txt}${c.rest > 0.01 ? `. Faltan ${fmtN(c.rest, 2)} ${wUnit()} para el peso exacto.` : ''}</div>`;
}
function plateSheet(set) {
  const st = { v: set && (set.w !== '' ? set.w : set.pw) ? roundDisp(toDisp(set.w !== '' ? set.w : set.pw)) : (unit() === 'kg' ? 60 : 135) };
  const s = openSheet({
    title: 'Calculadora de discos',
    body: `<div style="display:flex;gap:10px;align-items:flex-end"><label class="field" style="flex:1;margin:0"><span>Peso total (${wUnit()})</span><input class="input num pc-in" inputmode="decimal" style="font-size:26px;font-weight:600" value="${fmtN(st.v, 2, false)}"></label>
      <label class="field" style="width:120px;margin:0"><span>Barra (${wUnit()})</span><input class="input num pc-bar" inputmode="decimal" style="font-size:20px" value="${fmtN(S.settings.bar, 2, false)}"></label></div>
      <div class="pc-out mt" style="color:var(--ink)"></div>
      <p class="muted" style="font-size:13px">Colores según el código de competencia: rojo 25, azul 20, amarillo 15, verde 10, blanco 5.</p>`,
    onMount: el => {
      const paint = () => { const v = parseNum(el.querySelector('.pc-in').value); el.querySelector('.pc-out').innerHTML = v > 0 ? platesHtml(v, true) : '<div class="plates-txt">Escribe un peso.</div>'; };
      el.querySelector('.pc-in').addEventListener('input', paint);
      el.querySelector('.pc-bar').addEventListener('input', e => { const v = parseNum(e.target.value); if (v >= 0) { S.settings.bar = v; putSettings({ bar: v }); } paint(); });
      paint();
    }
  });
}
A['plates'] = () => plateSheet(null);

// ---------- terminar / descartar ----------
function cleanItems(w) {
  return w.items.map(it => {
    const ex = exById(it.ex);
    const sets = it.sets.filter(s => s.done).map(s => {
      const o = { w: Number(s.w) || 0, r: Number(s.r) || 0 };
      if (s.warm) o.warm = 1;
      if (ex.t === 't') delete o.w;
      return o;
    });
    const o = { ex: it.ex, sets };
    if (it.note && it.note.trim()) o.note = it.note.trim();
    return o;
  }).filter(it => it.sets.length);
}
A['wo-finish'] = async () => {
  const w = ACTIVE; if (!w) return;
  const done = w.items.reduce((a, it) => a + it.sets.filter(s => s.done).length, 0);
  if (!done) {
    const ok = await confirmSheet({ title: 'No has marcado ninguna serie', text: 'Marca cada serie con ✓ cuando la termines. Si no hiciste nada, puedes descartar este entreno.', ok: 'Descartar entreno', danger: true, cancel: 'Seguir entrenando' });
    if (ok) discardWorkout();
    return;
  }
  const pending = w.items.reduce((a, it) => a + it.sets.filter(s => !s.done && (s.w !== '' || s.r !== '')).length, 0);
  const ok = await confirmSheet({ title: '¿Terminar el entreno?', text: pending ? `Tienes ${plural(pending, 'serie', 'series')} con datos sin marcar; no se guardarán.` : `Se guardarán ${plural(done, 'serie', 'series')} en tu historial.`, ok: 'Terminar y guardar', cancel: 'Seguir' });
  if (!ok) return;
  const rec = { id: w.id, name: (w.name || '').trim() || 'Entreno', rid: w.rid || null, start: w.start, end: now(), note: (w.note || '').trim(), items: cleanItems(w) };
  ACTIVE = null; saveActive(true);
  W.open = false; keepAwake(false);
  $('#layer').classList.add('hide'); $('#layer').innerHTML = '';
  renderRest();
  put('wo', rec);
  render();
  showSummary(rec);
};
function showSummary(rec) {
  const sm = woSummary(rec);
  const prs = exHistory().prs[rec.id] || [];
  openSheet({
    title: '¡Entreno guardado!',
    body: `<div class="today-card" style="padding:0"><div class="name" style="font-size:34px">${esc(rec.name)}</div></div>
      <div class="stats mt"><div class="stat" style="box-shadow:none;background:var(--sunk)"><div class="v">${fmtDur(sm.dur).replace(' min', '<small>min</small>').replace(' h ', '<small>h</small> ')}</div><div class="l">duración</div></div>
      <div class="stat" style="box-shadow:none;background:var(--sunk)"><div class="v">${sm.sets}</div><div class="l">series</div></div>
      <div class="stat" style="box-shadow:none;background:var(--sunk)"><div class="v">${fmtCompact(toDisp(sm.vol))}<small>${wUnit()}</small></div><div class="l">volumen</div></div></div>
      ${prs.length ? `<div class="section"><h2>${prs.length === 1 ? 'Nuevo récord' : `${prs.length} récords nuevos`}</h2></div><div class="group">${prs.map(p => `<div class="row"><span class="grow"><span class="t">${esc(exById(p.ex).n)}</span><span class="s" style="display:block">${p.label}</span></span><span class="pr-badge">${prText(p)}</span></div>`).join('')}</div>`
        : '<p class="sub mt">Sin récords esta vez. La constancia es lo que suma.</p>'}
      <button class="btn primary block mt2" data-a="sheet-close">Listo</button>`
  });
}
function discardWorkout() {
  const copy = ACTIVE;
  ACTIVE = null; saveActive(true);
  W.open = false; keepAwake(false);
  $('#layer').classList.add('hide'); $('#layer').innerHTML = '';
  renderRest(); render();
  toast('Entreno descartado', 'Deshacer', () => { ACTIVE = copy; saveActive(true); openWorkout(); });
}
A['wo-discard'] = async () => {
  if (await confirmSheet({ title: '¿Descartar este entreno?', text: 'No se guardará nada de lo que registraste en esta sesión.', ok: 'Descartar', danger: true })) discardWorkout();
};

// ---------- editar entreno pasado ----------
function editWorkout(id) {
  const w = S.wo[id]; if (!w) return;
  EDIT = {
    id: w.id, name: w.name, start: w.start, note: w.note || '',
    items: (w.items || []).map(it => ({ ex: it.ex, note: it.note || '', rest: null, reps: '', sets: (it.sets || []).map(s => ({ w: s.w ?? '', r: s.r ?? '', done: true, warm: !!s.warm, pw: null, pr: null, prev: null })) }))
  };
  openWorkout();
}
A['wo-edit-cancel'] = () => { EDIT = null; W.open = false; $('#layer').classList.add('hide'); $('#layer').innerHTML = ''; render(); };
A['wo-edit-save'] = () => {
  const e = EDIT; if (!e) return;
  const orig = S.wo[e.id];
  EDIT = null; W.open = false; $('#layer').classList.add('hide'); $('#layer').innerHTML = '';
  put('wo', { ...orig, name: (e.name || '').trim() || 'Entreno', note: (e.note || '').trim(), items: cleanItems(e) });
  toast('Cambios guardados');
  render();
};

// ---------- sonido, vibración, pantalla ----------
let actx = null;
function primeAudio() {
  if (!S.settings.sound) return;
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) {}
}
function beep() {
  if (!S.settings.sound || !actx) return;
  try {
    const t = actx.currentTime;
    [0, 0.2, 0.4].forEach((d, i) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = 'sine'; o.frequency.value = i === 2 ? 1320 : 880;
      g.gain.setValueAtTime(0.0001, t + d);
      g.gain.exponentialRampToValueAtTime(0.4, t + d + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.16);
      o.connect(g); g.connect(actx.destination); o.start(t + d); o.stop(t + d + 0.18);
    });
  } catch (e) {}
}
function buzz(p) { if (!S.settings.vib) return; try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} }
let wakeLock = null;
async function keepAwake(on) {
  if (IN_APK) { try { window.HierroAndroid.keepOn(!!on && !!S.settings.wake); } catch (e) {} return; }
  try {
    if (on && S.settings.wake && 'wakeLock' in navigator && !wakeLock) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch (e) { wakeLock = null; }
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && W.open && ACTIVE) keepAwake(true);
  if (document.visibilityState === 'hidden') { saveLocal(true); if (ACTIVE) saveActive(true); }
});

// ---------- reloj ----------
function tick() {
  if (ACTIVE) {
    const t = clock((now() - ACTIVE.start) / 1000);
    $$('.js-clock').forEach(e => { if (e.textContent !== t) e.textContent = t; });
    const r = ACTIVE.rest;
    const ln = $('#live-n'), ll = $('#live-l');
    if (ln) {
      const resting = r && !r.fired && r.end > now();
      const v = resting ? clock(Math.ceil((r.end - now()) / 1000)) : t;
      if (ln.textContent !== v) ln.textContent = v;
      const lab = resting ? 'descanso' : '';
      if (ll && ll.textContent !== lab) ll.textContent = lab;
    }
    if (r && W.open && !EDIT) {
      const left = (r.end - now()) / 1000;
      const te = $('#rest-time'), be = $('#rest-bar');
      if (left <= 0 && !r.fired) {
        r.fired = true; saveActive();
        beep(); buzz([220, 90, 220, 90, 320]);
        renderRest();
        const el = $('#rest-time'); if (el) el.textContent = '¡Ya!';
        setTimeout(() => { if (ACTIVE && ACTIVE.rest === r) { ACTIVE.rest = null; saveActive(); renderRest(); } }, 12000);
      } else if (te && !r.fired) {
        te.textContent = clock(Math.ceil(left));
        if (be) be.style.width = Math.max(0, Math.min(100, left / r.total * 100)) + '%';
      } else if (te && r.fired) te.textContent = '¡Ya!';
    } else if (r && !r.fired && r.end < now()) {
      r.fired = true; beep(); buzz([220, 90, 220]); ACTIVE.rest = null; saveActive();
    }
  }
}
