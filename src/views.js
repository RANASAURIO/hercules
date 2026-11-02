// =====================================================================
// Vistas
// =====================================================================
const VIEWS = {};
const A = {}; // acciones de clic: data-a
const I = {}; // acciones de escritura: data-i

A.back = () => back();
A.tab = el => go(el.dataset.tab);
A['sheet-close'] = () => closeSheet();
A.settings = () => push({ v: 'settings' });
A['ex-open'] = el => push({ v: 'ex', id: el.dataset.id });
A['wo-open'] = el => push({ v: 'wo', id: el.dataset.id });

const byOrder = (a, b) => (a.ord ?? 0) - (b.ord ?? 0) || a.name.localeCompare(b.name, 'es');
const routines = () => live('rt').sort(byOrder);
function daysText(days) {
  if (!days || !days.length) return 'Sin día fijo';
  return WEEK_ORDER.filter(d => days.includes(d)).map(d => DOW[d]).join(', ');
}

function menuSheet(title, items) {
  const s = openSheet({
    title, cls: 'menu',
    body: `<div class="group">${items.map((it, i) => `<button class="row ${it.danger ? 'danger' : ''}" data-mi="${i}">${IC(it.icon)}<span class="grow">${esc(it.label)}</span></button>`).join('')}</div>`,
    onMount: el => el.addEventListener('click', e => {
      const b = e.target.closest('[data-mi]');
      if (!b) return;
      closeSheet(s);
      items[+b.dataset.mi].fn();
    })
  });
}

// ---------------------------------------------------------------- Inicio
VIEWS.home = () => {
  const t0 = startOfDay(now()), dow = new Date().getDay();
  const rts = routines(), ws = workouts();
  const wk = startOfWeek(now());
  const week = WEEK_ORDER.map((d, i) => {
    const t = new Date(wk); t.setDate(t.getDate() + i);
    const ts = t.getTime();
    const done = ws.some(w => startOfDay(w.start) === ts);
    const plan = rts.some(r => (r.days || []).includes(d));
    const lbl = `${DOW_L[d]} ${t.getDate()}${done ? ', entrenado' : ''}${plan ? ', rutina planeada' : ''}`;
    return `<div class="day ${ts === t0 ? 'today' : ''} ${done ? 'done' : ''} ${plan ? 'plan' : ''}" aria-label="${lbl}">${DOW[d]}<b>${t.getDate()}</b><div class="pip"></div></div>`;
  }).join('');

  let card = '';
  const todayDone = ws.filter(w => startOfDay(w.start) === t0);
  const todays = rts.filter(r => (r.days || []).includes(dow));
  if (ACTIVE) {
    card = `<div class="card today-card"><div class="label">Entreno en curso</div><div class="name">${esc(ACTIVE.name || 'Entreno')}</div>
      <div class="list">Llevas <span class="js-clock num">${clock((now() - ACTIVE.start) / 1000)}</span></div>
      <button class="btn primary block" data-a="wo-resume">${IC('play')}Continuar entreno</button></div>`;
  } else if (todayDone.length) {
    const w = todayDone[todayDone.length - 1], sm = woSummary(w);
    card = `<div class="card today-card"><div class="label">Hoy ya entrenaste</div><div class="name">${esc(w.name)}</div>
      <div class="list">${fmtDur(sm.dur)}, ${plural(sm.sets, 'serie', 'series')}${sm.vol ? `, ${fmtW(sm.vol, 0)} ${wUnit()} levantados` : ''}</div>
      <div class="btn-row"><button class="btn" data-a="wo-open" data-id="${w.id}">Ver resumen</button><button class="btn" data-a="choose-start">Entrenar más</button></div></div>`;
  } else if (todays.length) {
    const r = todays[0];
    const names = (r.items || []).map(it => exById(it.ex).n);
    card = `<div class="card today-card"><div class="label">Hoy toca</div><div class="name">${esc(r.name)}</div>
      <div class="list">${names.length ? esc(names.slice(0, 4).join(', ')) + (names.length > 4 ? ` y ${names.length - 4} más` : '') : 'Esta rutina no tiene ejercicios todavía.'}</div>
      <button class="btn primary block" data-a="start-rt" data-id="${r.id}">${IC('play')}Empezar entreno</button>
      ${todays.length > 1 ? `<div class="mt" style="font-size:15px">También hoy: ${todays.slice(1).map(x => `<button class="link" data-a="start-rt" data-id="${x.id}">${esc(x.name)}</button>`).join(', ')}</div>` : ''}</div>`;
  } else if (rts.length) {
    let next = null;
    for (let i = 1; i <= 7 && !next; i++) { const d = (dow + i) % 7; const r = rts.find(x => (x.days || []).includes(d)); if (r) next = { r, d, i }; }
    card = `<div class="card today-card"><div class="label">Hoy no tienes rutina planeada</div><div class="name">Descanso</div>
      <div class="list">${next ? `Lo próximo: ${esc(next.r.name)}, ${next.i === 1 ? 'mañana' : 'el ' + DOW_L[next.d]}.` : 'Asigna días a tus rutinas para verlas aquí.'}</div>
      <button class="btn block" data-a="choose-start">Entrenar de todas formas</button></div>`;
  } else {
    card = `<div class="card today-card"><div class="label">Para empezar</div><div class="name">Arma tu primera rutina</div>
      <div class="list">Usa una plantilla y ajústala, o registra un entreno libre ahora mismo.</div>
      <div class="btn-row"><button class="btn primary" data-a="tab" data-tab="routines">Ver plantillas</button><button class="btn" data-a="start-free">Entreno libre</button></div></div>`;
  }

  const thisWeek = ws.filter(w => w.start >= wk).length;
  const bws = live('bw').sort((a, b) => a.date.localeCompare(b.date));
  const lastBw = bws[bws.length - 1];
  const prevBw = bws[bws.length - 2];
  const dBw = lastBw && prevBw ? lastBw.w - prevBw.w : null;
  const stats = `<div class="stats">
    <div class="stat"><div class="v">${thisWeek}</div><div class="l">${thisWeek === 1 ? 'entreno' : 'entrenos'} esta semana</div></div>
    <div class="stat"><div class="v">${weekStreak()}</div><div class="l">${weekStreak() === 1 ? 'semana seguida' : 'semanas seguidas'}</div></div>
    <button class="stat" data-a="tab" data-tab="body" style="border:0;text-align:left"><div class="v">${lastBw ? fmtW(lastBw.w) + `<small>${wUnit()}</small>` : '—'}</div><div class="l">${lastBw ? (dBw != null && Math.abs(dBw) > 0.001 ? `${dBw > 0 ? '+' : '−'}${fmtW(Math.abs(dBw))} vs. anterior` : 'peso actual') : 'registra tu peso'}</div></button>
  </div>`;

  const prs = Object.values(exHistory().prs).flat().sort((a, b) => b.at - a.at).slice(0, 5);
  const prHtml = prs.length ? `<div class="section"><h2>Récords recientes</h2></div><div class="group">${prs.map(p => `
    <button class="row" data-a="ex-open" data-id="${esc(p.ex)}"><span class="grow"><span class="t">${esc(exById(p.ex).n)}</span><span class="s" style="display:block">${p.label}, ${relDay(p.at)}</span></span><span class="pr-badge">${prText(p)}</span></button>`).join('')}</div>` : '';

  let bodyHtml = '';
  if (rts.length || ws.length) {
    const mode = ui.bodyMode || (rts.length ? 'plan' : 'last7');
    const plan = mode === 'plan';
    const load = plan ? weekPlanLoad() : last7Load();
    const noDays = plan && rts.some(r => !(r.days && r.days.length));
    const seg = `<div class="seg" role="group" aria-label="Qué mostrar"><button data-a="body-mode" data-m="plan" aria-pressed="${plan}">Plan</button><button data-a="body-mode" data-m="last7" aria-pressed="${!plan}">7 días</button></div>`;
    const empty = !Object.values(load).some(v => v >= 0.5);
    bodyHtml = `<div class="section"><h2>Tus músculos</h2></div>` + bodyCard({
      title: plan ? 'Plan semanal de tus rutinas' : 'Lo que entrenaste en 7 días', load, scale: SCALE_WEEK, key: 'home', right: seg, showMissing: !empty,
      foot: empty ? `<div class="note" style="margin-top:10px">${plan ? 'Tus rutinas aún no tienen ejercicios. Añádelos para ver qué músculos trabajas.' : 'No registraste entrenos en los últimos 7 días.'}</div>`
        : (noDays ? '<div class="muted" style="font-size:12px;margin-top:8px">Las rutinas sin día fijo cuentan una vez por semana.</div>' : '')
    });
  }
  const last = ws[ws.length - 1];
  const lastHtml = last ? `<div class="section"><h2>Último entreno</h2><button class="link" data-a="tab" data-tab="history">Ver historial</button></div><div class="group">${woRow(last)}</div>` : '';

  const d = new Date();
  return `${topBar('Hércules', { cls: 'brand', right: `<button class="icon-btn" data-a="settings" aria-label="Ajustes">${IC('gear')}</button>` })}
    <div class="hello"><div class="date">${DOW_L[d.getDay()][0].toUpperCase() + DOW_L[d.getDay()].slice(1)} ${d.getDate()} de ${MON_L[d.getMonth()]}</div></div>
    <div class="week">${week}</div>
    <div class="muted" style="font-size:12px;margin:0 0 14px">Punto verde: entrenaste. Aro: tienes rutina ese día.</div>
    ${card}
    ${backupNudge()}
    <div class="section"><h2>Tu semana</h2></div>${stats}
    ${bodyHtml}${prHtml}${lastHtml}`;
};

function woRow(w) {
  const sm = woSummary(w), d = new Date(w.start);
  const npr = (exHistory().prs[w.id] || []).length;
  return `<button class="row" data-a="wo-open" data-id="${w.id}">
    <span style="width:44px;text-align:center;flex:none"><span class="num" style="display:block;font-size:26px;font-weight:600;line-height:1">${d.getDate()}</span><span class="muted" style="font-size:12px">${DOW[d.getDay()]}</span></span>
    <span class="grow"><span class="t">${esc(w.name || 'Entreno')}</span><span class="s" style="display:block">${fmtDur(sm.dur)}, ${plural(sm.sets, 'serie', 'series')}${sm.vol ? `, ${fmtW(sm.vol, 0)} ${wUnit()}` : ''}</span></span>
    ${npr ? `<span class="pr-badge">${npr} ${npr === 1 ? 'récord' : 'récords'}</span>` : ''}</button>`;
}

A['choose-start'] = () => {
  const rts = routines();
  const s = openSheet({
    title: 'Elige qué entrenar', cls: 'menu',
    body: `<div class="group">${rts.map(r => `<button class="row" data-cs="${r.id}">${IC('routines')}<span class="grow"><span class="t">${esc(r.name)}</span><span class="s" style="display:block">${daysText(r.days)}, ${plural((r.items || []).length, 'ejercicio', 'ejercicios')}</span></span></button>`).join('')}
      <button class="row" data-cs="">${IC('plus')}<span class="grow"><span class="t">Entreno libre</span><span class="s" style="display:block">Empieza vacío y añade ejercicios</span></span></button></div>`,
    onMount: el => el.addEventListener('click', e => {
      const b = e.target.closest('[data-cs]');
      if (!b) return;
      closeSheet(s);
      b.dataset.cs ? startWorkout(b.dataset.cs) : startWorkout(null);
    })
  });
};

// ---------------------------------------------------------------- Rutinas
VIEWS.routines = () => {
  const rts = routines();
  const list = rts.length ? `<div class="group">${rts.map(r => {
    const load = routineLoad(r);
    const top = Object.keys(REGIONS).filter(m => (load[m] || 0) >= 0.5).sort((a, b) => load[b] - load[a]).slice(0, 3).map(m => REGIONS[m]);
    return `<div class="rt-row" data-a="rt-open" data-id="${r.id}" role="button" tabindex="0">
      ${bodySvg(load, SCALE_SESSION, { mini: true })}
      <span class="grow"><span class="t" style="display:block">${esc(r.name)}</span><span class="s" style="display:block">${daysText(r.days)}, ${plural((r.items || []).length, 'ejercicio', 'ejercicios')}</span>${top.length ? `<span class="m" style="display:block">${top.join(', ')}</span>` : ''}</span>
      <button class="btn primary sm" data-a="start-rt" data-id="${r.id}" aria-label="Empezar ${esc(r.name)}">${IC('play')}Empezar</button>
    </div>`;
  }).join('')}</div>`
    : `<div class="card empty"><h3>Aún no tienes rutinas</h3><p>Crea una desde cero o empieza con una de las plantillas de abajo.</p><button class="btn primary" data-a="rt-new">${IC('plus')}Crear rutina</button></div>`;
  return `${topBar('Rutinas', { right: `<button class="icon-btn" data-a="rt-new" aria-label="Nueva rutina">${IC('plus')}</button>` })}
    ${list}
    <button class="btn block mt" data-a="start-free">${IC('plus')}Empezar entreno libre</button>
    <div class="section"><h2>Plantillas</h2></div>
    <div class="group">${TEMPLATES.map(t => `<button class="row" data-a="tpl" data-id="${t.id}"><span class="grow"><span class="t">${esc(t.name)}</span><span class="s" style="display:block;white-space:normal">${esc(t.desc)}</span></span>${IC('right').replace('<svg', '<svg class="chev"')}</button>`).join('')}</div>
    <div class="section"><h2>Ejercicios propios</h2></div>
    ${customExList()}`;
};
function customExList() {
  const xs = live('ex').sort((a, b) => a.n.localeCompare(b.n, 'es'));
  return `<div class="group">${xs.map(e => `<button class="row" data-a="ex-open" data-id="${esc(e.id)}"><span class="grow"><span class="t">${esc(e.n)}</span><span class="s" style="display:block">${mLabel(e.m)}</span></span>${IC('right').replace('<svg', '<svg class="chev"')}</button>`).join('')}
    <button class="row" data-a="ex-new" style="color:var(--blue);font-weight:600">${IC('plus')}<span class="grow">Crear ejercicio</span></button></div>`;
}
A['ex-new'] = () => createExercise('', null, () => render());

A['rt-new'] = () => {
  const ord = Math.max(0, ...live('rt').map(r => r.ord || 0)) + 1;
  const r = put('rt', { id: uid(), name: 'Rutina nueva', days: [], items: [], ord });
  push({ v: 'routine', id: r.id, fresh: true });
};
A['rt-open'] = el => push({ v: 'routine', id: el.dataset.id });
A['start-rt'] = el => startWorkout(el.dataset.id);
A['start-free'] = () => startWorkout(null);

A.tpl = el => {
  const t = TEMPLATES.find(x => x.id === el.dataset.id);
  const s = openSheet({
    title: t.name,
    body: `<p class="sub" style="margin-top:0">${esc(t.desc)}</p>${t.routines.map(r => `
      <div class="mb" style="display:flex;gap:12px;align-items:flex-start">${bodySvg(routineLoad({ items: r.items.map(([ex, sets]) => ({ ex, sets })) }), SCALE_SESSION, { mini: true })}<div><div style="font-weight:700">${esc(r.name)} <span class="muted" style="font-weight:400">${daysText(r.days)}</span></div>
      <div class="sub" style="font-size:15px">${r.items.map(i => `${esc(exById(i[0]).n)} <span class="muted num">${i[1]}×${i[2]}</span>`).join('<br>')}</div></div></div>`).join('')}
      <p class="muted" style="font-size:14px">Se añaden como rutinas normales: puedes cambiar ejercicios, series y días cuando quieras.</p>
      <button class="btn primary block" data-tpl-ok>Añadir ${t.routines.length} rutinas</button>`,
    onMount: e => e.querySelector('[data-tpl-ok]').addEventListener('click', () => {
      let ord = Math.max(0, ...live('rt').map(r => r.ord || 0));
      for (const r of t.routines) put('rt', { id: uid(), name: r.name, days: [...r.days], ord: ++ord, items: r.items.map(([ex, sets, reps, rest]) => ({ ex, sets, reps, rest })) });
      closeSheet(s);
      toast(`Añadiste la plantilla ${t.name}`);
    })
  });
};

// ---------------------------------------------------------------- Editor de rutina
VIEWS.routine = ({ id }) => {
  const r = S.rt[id];
  if (!r || r.del) { ui.stack.pop(); return VIEWS[ui.tab](); }
  const items = r.items || [];
  return `${topBar(r.name || 'Rutina', { backBtn: true, right: `<button class="icon-btn" data-a="rt-menu" data-id="${id}" aria-label="Más opciones">${IC('more')}</button>` })}
    <label class="field"><span>Nombre</span><input class="input" data-i="rt-name" data-id="${id}" data-keep="rtname" value="${esc(r.name)}" autocomplete="off"></label>
    <div class="field"><span>Días de la semana</span><div class="daypick">${WEEK_ORDER.map(d => `<button data-a="rt-day" data-id="${id}" data-d="${d}" aria-pressed="${(r.days || []).includes(d)}" aria-label="${DOW_L[d]}">${DOW_1[d]}</button>`).join('')}</div></div>
    ${items.length ? bodyCard({ title: 'Músculos que trabaja', load: routineLoad(r), scale: SCALE_SESSION, key: 'rt', rid: id }) : ''}
    <div class="section"><h2>Ejercicios</h2><span class="muted" style="font-size:14px">${items.length}</span></div>
    ${items.length ? `<div class="group">${items.map((it, i) => `
      <div class="rt-item"><div class="rt-row1"><div class="t">${DEMOS[it.ex] ? `<button class="link" style="padding:0;font-size:16px;text-align:left;color:var(--ink)" data-a="howto" data-id="${esc(it.ex)}">${esc(exById(it.ex).n)} <span style="color:var(--blue);font-size:13px;font-weight:600;white-space:nowrap">Cómo se hace</span></button>` : esc(exById(it.ex).n)}</div>
        <button class="icon-btn sm" data-a="rt-mv" data-id="${id}" data-k="${i}" data-dir="-1" aria-label="Subir" ${i === 0 ? 'disabled' : ''}>${IC('up')}</button>
        <button class="icon-btn sm" data-a="rt-mv" data-id="${id}" data-k="${i}" data-dir="1" aria-label="Bajar" ${i === items.length - 1 ? 'disabled' : ''}>${IC('down')}</button>
        <button class="icon-btn sm" data-a="rt-rm" data-id="${id}" data-k="${i}" aria-label="Quitar">${IC('x')}</button></div>
        <div class="rt-grid">
          <label><span>Series</span><input inputmode="numeric" data-i="rt-f" data-f="sets" data-id="${id}" data-k="${i}" value="${esc(it.sets)}"></label>
          <label><span>${exById(it.ex).t === 't' ? 'Segundos' : exById(it.ex).t === 'c' ? 'Minutos' : 'Reps objetivo'}</span><input data-i="rt-f" data-f="reps" data-id="${id}" data-k="${i}" value="${esc(it.reps)}"></label>
          <label><span>Descanso (s)</span><input inputmode="numeric" data-i="rt-f" data-f="rest" data-id="${id}" data-k="${i}" value="${esc(it.rest ?? '')}" placeholder="${S.settings.rest}"></label>
        </div>
      </div>`).join('')}</div>` : `<div class="note">Añade los ejercicios de esta rutina. En cada uno eliges series, repeticiones objetivo y descanso.</div>`}
    <button class="btn block mt" data-a="rt-add" data-id="${id}">${IC('plus')}Añadir ejercicios</button>
    <button class="btn primary block mt" data-a="start-rt" data-id="${id}" ${items.length ? '' : 'disabled'}>${IC('play')}Empezar esta rutina</button>`;
};
I['rt-name'] = el => {
  const r = S.rt[el.dataset.id];
  r.name = el.value;
  put('rt', r, { quiet: true });
  const h = $('.top h1'); if (h) h.textContent = el.value || 'Rutina';
};
I['rt-f'] = el => {
  const r = S.rt[el.dataset.id], it = r.items[+el.dataset.k], f = el.dataset.f;
  if (f === 'reps') it.reps = el.value.trim();
  else { const n = parseInt(el.value, 10); it[f] = isNaN(n) ? (f === 'sets' ? 1 : null) : Math.max(f === 'sets' ? 1 : 0, Math.min(f === 'sets' ? 20 : 900, n)); }
  put('rt', r, { quiet: true });
};
A['rt-day'] = el => {
  const r = S.rt[el.dataset.id], d = +el.dataset.d;
  r.days = (r.days || []).includes(d) ? r.days.filter(x => x !== d) : [...(r.days || []), d];
  put('rt', r);
};
A['rt-mv'] = el => {
  const r = S.rt[el.dataset.id], k = +el.dataset.k, j = k + +el.dataset.dir;
  if (j < 0 || j >= r.items.length) return;
  [r.items[k], r.items[j]] = [r.items[j], r.items[k]];
  put('rt', r);
};
A['rt-rm'] = el => {
  const r = S.rt[el.dataset.id], k = +el.dataset.k;
  const [gone] = r.items.splice(k, 1);
  put('rt', r);
  toast(`Quitaste ${exById(gone.ex).n}`, 'Deshacer', () => { r.items.splice(k, 0, gone); put('rt', r); });
};
A['rt-add'] = el => {
  const r = S.rt[el.dataset.id];
  pickExercises({
    onPick: ids => {
      for (const ex of ids) {
        const e = exById(ex);
        r.items.push({ ex, sets: 3, reps: e.t === 't' ? '45' : e.t === 'c' ? '20' : '8-12', rest: null });
      }
      put('rt', r);
    }
  });
};
A['rt-menu'] = el => {
  const r = S.rt[el.dataset.id];
  menuSheet(r.name, [
    { icon: 'copy', label: 'Duplicar rutina', fn: () => {
      const c = put('rt', { ...JSON.parse(JSON.stringify(r)), id: uid(), name: r.name + ' (copia)', ord: (r.ord || 0) + 0.5 });
      ui.stack.pop(); push({ v: 'routine', id: c.id }); toast('Rutina duplicada');
    } },
    { icon: 'trash', label: 'Eliminar rutina', danger: true, fn: () => {
      const copy = remove('rt', r.id);
      ui.stack.pop(); render();
      toast(`Eliminaste ${r.name}`, 'Deshacer', () => restore('rt', copy));
    } }
  ]);
};

// ---------------------------------------------------------------- Historial
VIEWS.history = () => {
  const ws = workouts().slice().reverse();
  if (!ws.length) return `${topBar('Historial')}<div class="card empty"><h3>Todavía no hay entrenos</h3><p>Cuando termines tu primer entreno aparecerá aquí con su duración, series y récords.</p><button class="btn primary" data-a="choose-start">${IC('play')}Empezar un entreno</button></div>`;
  const n = ui.histN || 40;
  let html = '', curM = '';
  let open = false;
  for (const w of ws.slice(0, n)) {
    const d = new Date(w.start), m = `${MON_L[d.getMonth()]} ${d.getFullYear()}`;
    if (m !== curM) {
      if (open) html += '</div>';
      const cnt = ws.filter(x => { const y = new Date(x.start); return y.getMonth() === d.getMonth() && y.getFullYear() === d.getFullYear(); }).length;
      html += `<div class="section"><h2>${m[0].toUpperCase() + m.slice(1)}</h2><span class="muted" style="font-size:14px">${plural(cnt, 'entreno', 'entrenos')}</span></div><div class="group">`;
      open = true; curM = m;
    }
    html += woRow(w);
  }
  if (open) html += '</div>';
  if (ws.length > n) html += `<button class="btn block mt" data-a="hist-more">Mostrar más</button>`;
  return `${topBar('Historial')}${html}`;
};
A['hist-more'] = () => { ui.histN = (ui.histN || 40) + 60; render(); };

// ---------------------------------------------------------------- Detalle de entreno
VIEWS.wo = ({ id }) => {
  const w = S.wo[id];
  if (!w || w.del) { ui.stack.pop(); return VIEWS[ui.tab](); }
  const sm = woSummary(w);
  const prs = exHistory().prs[w.id] || [];
  const exHtml = (w.items || []).map(it => {
    const ex = exById(it.ex);
    const myPr = prs.filter(p => p.ex === it.ex);
    let n = 0;
    return `<div class="card mt"><div style="display:flex;gap:8px;align-items:baseline"><button class="link" style="font-size:17px;text-align:left;flex:1;padding:0" data-a="ex-open" data-id="${esc(it.ex)}">${esc(ex.n)}</button>${myPr.map(p => `<span class="pr-badge">${p.label} ${prText(p)}</span>`).join(' ')}</div>
      ${it.note ? `<div class="sub" style="font-size:14px;margin-top:4px">${esc(it.note)}</div>` : ''}
      <div class="hist-sets" style="margin-top:10px">${(it.sets || []).map(s => `<span class="sc ${s.warm ? 'w' : ''}"><i>${s.warm ? 'C' : ++n}</i>${setLabel(ex, s)}</span>`).join('')}</div></div>`;
  }).join('');
  return `${topBar(w.name || 'Entreno', { backBtn: true, right: `<button class="icon-btn" data-a="wo-menu" data-id="${id}" aria-label="Más opciones">${IC('more')}</button>` })}
    <div class="sub" style="margin:-4px 0 14px">${fmtDate(w.start, { long: true })}, ${fmtTime(w.start)}</div>
    <div class="stats"><div class="stat"><div class="v">${fmtDur(sm.dur).replace(' min', '<small>min</small>').replace(' h ', '<small>h</small> ')}</div><div class="l">duración</div></div>
    <div class="stat"><div class="v">${sm.sets}</div><div class="l">series</div></div>
    <div class="stat"><div class="v">${fmtCompact(toDisp(sm.vol))}<small>${wUnit()}</small></div><div class="l">volumen</div></div></div>
    ${w.note ? `<div class="note mt">${esc(w.note)}</div>` : ''}
    ${exHtml}
    <p class="muted" style="font-size:13px;margin-top:14px">Las series marcadas con C son de calentamiento: no cuentan para récords ni volumen.</p>`;
};
A['wo-menu'] = el => {
  const w = S.wo[el.dataset.id];
  menuSheet(w.name || 'Entreno', [
    { icon: 'edit', label: 'Editar entreno', fn: () => editWorkout(w.id) },
    { icon: 'play', label: 'Repetir este entreno', fn: () => startWorkout(null, w) },
    { icon: 'trash', label: 'Eliminar entreno', danger: true, fn: async () => {
      if (!await confirmSheet({ title: '¿Eliminar este entreno?', text: `Se borrará ${esc(w.name || 'el entreno')} del ${fmtDate(w.start)} con todas sus series.`, ok: 'Eliminar', danger: true })) return;
      const copy = remove('wo', w.id);
      ui.stack.pop(); render();
      toast('Entreno eliminado', 'Deshacer', () => restore('wo', copy));
    } }
  ]);
};

// ---------------------------------------------------------------- Progreso
VIEWS.progress = () => {
  const ws = workouts();
  const mStart = new Date(); mStart.setDate(1); mStart.setHours(0, 0, 0, 0);
  const hours = ws.reduce((a, w) => a + (w.end - w.start), 0) / 36e5;
  const stats = `<div class="stats"><div class="stat"><div class="v">${ws.length}</div><div class="l">entrenos en total</div></div>
    <div class="stat"><div class="v">${ws.filter(w => w.start >= mStart.getTime()).length}</div><div class="l">este mes</div></div>
    <div class="stat"><div class="v">${fmtN(hours, hours < 10 ? 1 : 0)}<small>h</small></div><div class="l">entrenando</div></div></div>`;

  // Calendario: 18 semanas
  const W_N = 18, days = new Set(ws.map(w => dkey(new Date(w.start))));
  const first = startOfWeek(now()) - (W_N - 1) * 7 * DAY;
  let cells = '', months = '';
  const t0 = startOfDay(now());
  let lastM = -1;
  for (let c = 0; c < W_N; c++) {
    const colStart = new Date(first); colStart.setDate(colStart.getDate() + c * 7);
    const m = colStart.getMonth();
    const nextChange = (() => { for (let j = 1; j < 3; j++) { const x = new Date(colStart); x.setDate(x.getDate() + j * 7); if (x.getMonth() !== m) return true; } return false; })();
    const showM = m !== lastM && !(c === 0 && nextChange);
    months += `<span style="font-size:10px;color:var(--ink-3);white-space:nowrap;overflow:visible;width:0">${showM ? MON[m] : ''}</span>`;
    lastM = m;
    for (let r = 0; r < 7; r++) {
      const d = new Date(colStart); d.setDate(d.getDate() + r);
      const ts = d.getTime(), k = dkey(d);
      cells += `<i class="${ts > t0 ? 'fut' : days.has(k) ? 'on' : ''} ${ts === t0 ? 'today' : ''}" data-a="cal" data-k="${k}" title="${fmtDate(ts)}"></i>`;
    }
  }
  const sel = ui.calSel;
  const selW = sel ? ws.filter(w => dkey(new Date(w.start)) === sel) : [];
  const cal = `<div class="card mt"><div class="chart-h"><h3>Días entrenados</h3><span class="muted" style="font-size:13px">últimas ${W_N} semanas</span></div>
    <div class="cal-wrap"><div></div><div style="display:grid;grid-template-columns:repeat(${W_N},1fr);gap:3px;margin-bottom:3px">${months}</div>
    <div class="cal-days">${['L', '', 'X', '', 'V', '', 'D'].map(x => `<span>${x}</span>`).join('')}</div><div class="cal" style="grid-template-columns:repeat(${W_N},1fr)">${cells}</div></div>
    <div class="muted" style="font-size:13px;margin-top:8px;min-height:20px">${sel ? `${fmtDate(parseD(sel).getTime())}: ${selW.length ? selW.map(w => `<button class="link" style="padding:0;font-size:13px" data-a="wo-open" data-id="${w.id}">${esc(w.name)}</button>`).join(', ') : 'sin entreno'}` : 'Toca un día para ver qué entrenaste.'}</div></div>`;

  // Volumen semanal
  const NW = 12, wk0 = startOfWeek(now()) - (NW - 1) * 7 * DAY;
  const bars = [];
  for (let i = 0; i < NW; i++) {
    const s = new Date(wk0); s.setDate(s.getDate() + i * 7);
    const e = new Date(s); e.setDate(e.getDate() + 7);
    const inW = ws.filter(w => w.start >= s.getTime() && w.start < e.getTime());
    const v = inW.reduce((a, w) => { const m = woSummary(w); return a + (ui.volMode === 'vol' ? toDisp(m.vol) : m.sets); }, 0);
    bars.push({ x: s.getTime(), y: v, label: `Semana del ${fmtShort(s.getTime())}`, cur: i === NW - 1 });
  }
  const volCard = `<div class="card mt"><div class="chart-h"><h3>${ui.volMode === 'vol' ? `Volumen semanal (${wUnit()})` : 'Series por semana'}</h3>
    <div class="seg" role="group" aria-label="Métrica"><button data-a="vol-mode" data-m="vol" aria-pressed="${ui.volMode === 'vol'}">Volumen</button><button data-a="vol-mode" data-m="sets" aria-pressed="${ui.volMode === 'sets'}">Series</button></div></div>
    ${!bars.some(b => b.y > 0) ? '<div class="note">Aquí verás cuánto entrenas cada semana cuando registres tus primeros entrenos.</div>' : chartSlot({ type: 'bar', data: bars, fmt: v => ui.volMode === 'vol' ? `${fmtN(v, 0)} ${wUnit()}` : plural(v, 'serie', 'series'), axis: v => ui.volMode === 'vol' ? fmtCompact(v) : fmtN(v, 0), h: 170, tickX: d => fmtShort(d.x) })}
    <div class="muted" style="font-size:12px;margin-top:6px">Volumen = peso × repeticiones de las series efectivas. La última barra, más tenue, es la semana en curso.</div></div>`;

  // Ejercicios
  const H = exHistory();
  const q = norm(ui.q || '');
  let xs = allExercises().filter(e => ui.showAllEx || H.map[e.id]);
  for (const id in H.map) if (!xs.some(e => e.id === id)) xs.push(exById(id));
  if (q) xs = xs.filter(e => norm(e.n).includes(q));
  xs.sort((a, b) => {
    const la = H.map[a.id], lb = H.map[b.id];
    if (la && lb) return lb[lb.length - 1].wo.start - la[la.length - 1].wo.start;
    if (la) return -1; if (lb) return 1;
    return a.n.localeCompare(b.n, 'es');
  });
  const exRows = xs.slice(0, 80).map(e => {
    const h = H.map[e.id];
    const b = H.best[e.id] || {};
    let end = '';
    if (h) {
      if (e.t === 'w' && b.e1rm) end = `<span class="num" style="font-size:20px;font-weight:600">${fmtW(b.e1rm, 0)}</span><span class="muted" style="font-size:12px;display:block">1RM est.</span>`;
      else if (e.t === 'bw') end = `<span class="num" style="font-size:20px;font-weight:600">${b.maxR || 0}</span><span class="muted" style="font-size:12px;display:block">reps máx.</span>`;
      else if (e.t === 't') end = `<span class="num" style="font-size:20px;font-weight:600">${clock(b.maxT || 0)}</span><span class="muted" style="font-size:12px;display:block">mejor</span>`;
      else if (e.t === 'c') end = `<span class="num" style="font-size:20px;font-weight:600">${fmtN(b.km || 0, 1)}</span><span class="muted" style="font-size:12px;display:block">km máx.</span>`;
    }
    return `<button class="row" data-a="ex-open" data-id="${esc(e.id)}"><span class="grow"><span class="t">${esc(e.n)}</span><span class="s" style="display:block">${h ? `${plural(h.length, 'sesión', 'sesiones')}, la última ${relDay(h[h.length - 1].wo.start)}` : mLabel(e.m)}</span></span><span class="end">${end}</span></button>`;
  }).join('');

  return `${topBar('Progreso')}${stats}${cal}${volCard}
    <div class="section"><h2>Ejercicios</h2><button class="link" data-a="ex-all">${ui.showAllEx ? 'Solo los que hice' : 'Ver todos'}</button></div>
    <div class="search mb">${IC('search')}<input type="search" placeholder="Buscar ejercicio" aria-label="Buscar ejercicio" data-i="prog-q" data-keep="progq" value="${esc(ui.q || '')}" autocomplete="off"></div>
    ${exRows ? `<div class="group">${exRows}</div>` : `<div class="note">${q ? 'No hay ejercicios con ese nombre.' : 'Cuando registres ejercicios verás aquí su progreso y tus récords.'}</div>`}`;
};
A.cal = el => { ui.calSel = ui.calSel === el.dataset.k ? null : el.dataset.k; render(); };
A['vol-mode'] = el => { ui.volMode = el.dataset.m; render(); };
A['ex-all'] = () => { ui.showAllEx = !ui.showAllEx; render(); };
I['prog-q'] = el => { ui.q = el.value; render(); };

// ---------------------------------------------------------------- Detalle de ejercicio
VIEWS.ex = ({ id }) => {
  const ex = exById(id);
  const h = exHistory().map[id] || [];
  const b = exHistory().best[id] || {};
  const custom = !!S.ex[id];
  const head = `${topBar(ex.n, { backBtn: true, right: custom ? `<button class="icon-btn" data-a="exc-menu" data-id="${esc(id)}" aria-label="Más opciones">${IC('more')}</button>` : '' })}
    <div class="sub" style="margin:-4px 0 14px">${mLabel(ex.m)}, ${(EQUIP[ex.e] || 'otro').toLowerCase()}${custom ? ', ejercicio propio' : ''}</div>
    ${howtoHtml(id)}${exBodyCard(id)}`;
  if (!h.length) return head + `<div class="card empty"><h3>Sin registros todavía</h3><p>Cuando hagas este ejercicio en un entreno verás aquí tus récords y la gráfica de progreso.</p></div>`;

  const bestOf = k => { let best = null; for (const x of h) if (x.m[k] != null && (!best || x.m[k] > best.m[k])) best = x; return best; };
  const tile = (label, v, small, x) => `<div class="pr"><div class="l">${label}</div><div class="v">${v}${small ? `<small> ${small}</small>` : ''}</div><div class="d">${x ? fmtDate(x.wo.start) : ''}</div></div>`;
  let tiles = '', metrics = [];
  if (ex.t === 'w') {
    const bs = h.reduce((acc, x) => { for (const s of workSets(x)) if (!acc || s.w * s.r > acc.s.w * acc.s.r) acc = { s, x }; return acc; }, null);
    tiles = tile('1RM estimado', fmtW(b.e1rm || 0), wUnit(), bestOf('e1rm')) + tile('Peso máximo', fmtW(b.maxW || 0), wUnit(), bestOf('maxW'))
      + tile('Mejor serie', bs ? `${fmtW(bs.s.w)}×${bs.s.r}` : '—', '', bs && bs.x) + tile('Volumen en una sesión', fmtCompact(toDisp(b.vol || 0)), wUnit(), bestOf('vol'));
    metrics = [['e1rm', '1RM est.', v => `${fmtW(v)} ${wUnit()}`, true], ['maxW', 'Peso máx.', v => `${fmtW(v)} ${wUnit()}`, true], ['vol', 'Volumen', v => `${fmtW(v, 0)} ${wUnit()}`, true]];
  } else if (ex.t === 'bw') {
    tiles = tile('Más repeticiones', b.maxR || 0, 'reps', bestOf('maxR')) + tile('Total en una sesión', Math.max(0, ...h.map(x => x.m.totR)), 'reps', bestOf('totR'))
      + (b.maxW ? tile('Lastre máximo', fmtW(b.maxW), wUnit(), bestOf('maxW')) : '') + tile('Sesiones', h.length, '', null);
    metrics = [['maxR', 'Reps máx.', v => `${fmtN(v, 0)} reps`], ['totR', 'Reps totales', v => `${fmtN(v, 0)} reps`]];
  } else if (ex.t === 't') {
    tiles = tile('Mejor tiempo', clock(b.maxT || 0), '', bestOf('maxT')) + tile('Sesiones', h.length, '', null);
    metrics = [['maxT', 'Tiempo máx.', v => clock(v)], ['totT', 'Tiempo total', v => clock(v)]];
  } else {
    tiles = tile('Mayor distancia', fmtN(b.km || 0, 2), 'km', bestOf('km')) + tile('Sesiones', h.length, '', null);
    metrics = [['km', 'Distancia', v => `${fmtN(v, 2)} km`], ['min', 'Minutos', v => `${fmtN(v, 0)} min`]];
  }
  const mk = ui.exMetric[ex.t] && metrics.find(m => m[0] === ui.exMetric[ex.t]) ? ui.exMetric[ex.t] : metrics[0][0];
  const M = metrics.find(m => m[0] === mk);
  const pts = h.filter(x => x.m[mk] > 0).map(x => ({ x: x.wo.start, y: M[3] ? toDisp(x.m[mk]) : x.m[mk], raw: x.m[mk], label: fmtDate(x.wo.start) }));
  const chart = `<div class="card mt"><div class="chart-h"><h3>${M[1]}</h3><div class="seg" role="group" aria-label="Métrica">${metrics.map(m => `<button data-a="ex-metric" data-t="${ex.t}" data-m="${m[0]}" aria-pressed="${m[0] === mk}">${m[1]}</button>`).join('')}</div></div>
    ${pts.length >= 2 ? chartSlot({ type: 'line', data: pts, fmt: (v, d) => M[2](d.raw), axis: v => ex.t === 't' && mk !== 'totR' ? clock(v) : fmtCompact(v), h: 190 }) : `<div class="note">Con dos sesiones o más verás aquí la línea de progreso.</div>`}
    ${ex.t === 'w' && mk === 'e1rm' ? '<div class="muted" style="font-size:12px;margin-top:6px">1RM estimado con la fórmula de Epley, a partir de tu mejor serie de 15 reps o menos.</div>' : ''}</div>`;

  const hist = h.slice().reverse().slice(0, 50).map(x => {
    let n = 0;
    return `<button class="row" data-a="wo-open" data-id="${x.wo.id}" style="align-items:flex-start"><span class="grow"><span class="t" style="font-size:15px">${fmtDate(x.wo.start)} <span class="muted" style="font-weight:400">${esc(x.wo.name || '')}</span></span>
      <span class="hist-sets" style="margin-top:6px">${x.sets.map(s => `<span class="sc ${s.warm ? 'w' : ''}"><i>${s.warm ? 'C' : ++n}</i>${setLabel(ex, s)}</span>`).join('')}</span></span></button>`;
  }).join('');
  return `${head}<div class="prs">${tiles}</div>${chart}<div class="section"><h2>Historial</h2><span class="muted" style="font-size:14px">${plural(h.length, 'sesión', 'sesiones')}</span></div><div class="group">${hist}</div>`;
};
A['ex-metric'] = el => { ui.exMetric[el.dataset.t] = el.dataset.m; render(); };
A['exc-menu'] = el => {
  const e = S.ex[el.dataset.id];
  menuSheet(e.n, [
    { icon: 'edit', label: 'Cambiar nombre', fn: () => {
      const s = openSheet({
        title: 'Cambiar nombre',
        body: `<label class="field"><span>Nombre</span><input class="input rn" value="${esc(e.n)}"></label><button class="btn primary block rn-ok">Guardar</button>`,
        onMount: el2 => el2.querySelector('.rn-ok').addEventListener('click', () => {
          const v = el2.querySelector('.rn').value.trim(); if (!v) return;
          put('ex', { ...e, n: v }); closeSheet(s);
        })
      });
    } },
    { icon: 'trash', label: 'Eliminar ejercicio', danger: true, fn: async () => {
      const used = (exHistory().map[e.id] || []).length;
      if (!await confirmSheet({ title: '¿Eliminar este ejercicio?', text: used ? `Ya no aparecerá al elegir ejercicios. Tus ${used} sesiones registradas se conservan en el historial.` : 'Ya no aparecerá al elegir ejercicios.', ok: 'Eliminar', danger: true })) return;
      remove('ex', e.id); ui.stack.pop(); render();
    } }
  ]);
};

// ---------------------------------------------------------------- Peso corporal
VIEWS.body = () => {
  const bws = live('bw').sort((a, b) => a.date.localeCompare(b.date));
  const last = bws[bws.length - 1];
  const goal = S.settings.goal;
  const today = dkey();
  const exToday = bws.find(b => b.date === today);
  const form = `<div class="card"><div style="display:flex;gap:10px;align-items:flex-end">
      <label class="field" style="flex:1.3;margin:0"><span>Peso (${wUnit()})</span><input class="input num" style="font-size:24px;font-weight:600" inputmode="decimal" id="bw-in" placeholder="${last ? fmtW(last.w) : (unit() === 'kg' ? '70' : '155')}" value="${exToday ? fmtN(roundDisp(toDisp(exToday.w)), 2, false) : ''}" autocomplete="off"></label>
      <label class="field" style="flex:1;margin:0"><span>Fecha</span><input class="input" type="date" id="bw-date" value="${today}" max="${today}" style="font-size:15px"></label></div>
      <button class="btn primary block mt" data-a="bw-save">${exToday ? 'Actualizar peso de hoy' : 'Guardar peso'}</button></div>`;

  let stats = '', chart = '', list = '';
  if (bws.length) {
    const ago = bws.filter(b => parseD(b.date).getTime() <= now() - 30 * DAY);
    const ref = ago.length ? ago[ago.length - 1] : bws[0];
    const d30 = last.w - ref.w;
    const toGoal = goal ? last.w - goal : null;
    stats = `<div class="stats mt"><div class="stat"><div class="v">${fmtW(last.w)}<small>${wUnit()}</small></div><div class="l">actual, ${relDay(parseD(last.date).getTime())}</div></div>
      <div class="stat"><div class="v">${Math.abs(d30) < 0.05 ? '0' : (d30 > 0 ? '+' : '−') + fmtW(Math.abs(d30))}<small>${wUnit()}</small></div><div class="l">cambio en ${ago.length ? '30 días' : 'total'}</div></div>
      <button class="stat" data-a="bw-goal" style="border:0;text-align:left"><div class="v">${goal ? fmtW(goal) + `<small>${wUnit()}</small>` : '—'}</div><div class="l">${goal ? (Math.abs(toGoal) < 0.05 ? '¡meta alcanzada!' : `te faltan ${fmtW(Math.abs(toGoal))} ${wUnit()}`) : 'toca para fijar meta'}</div></button></div>`;
    const ranges = [['1m', '1M', 30], ['3m', '3M', 91], ['6m', '6M', 182], ['1a', '1A', 365], ['all', 'Todo', 1e5]];
    const rg = ranges.find(r => r[0] === ui.bwRange) || ranges[1];
    const from = now() - rg[2] * DAY;
    const pts = bws.filter(b => parseD(b.date).getTime() >= from).map(b => ({ x: parseD(b.date).getTime(), y: toDisp(b.w), label: fmtDate(parseD(b.date).getTime()) }));
    chart = `<div class="card mt"><div class="chart-h"><h3>Peso (${wUnit()})</h3><div class="seg" role="group" aria-label="Rango">${ranges.map(r => `<button data-a="bw-range" data-r="${r[0]}" aria-pressed="${r[0] === rg[0]}">${r[1]}</button>`).join('')}</div></div>
      ${pts.length >= 2 ? chartSlot({ type: 'line', data: pts, goal: goal ? toDisp(goal) : null, fmt: v => `${fmtN(v, 1)} ${wUnit()}`, axis: v => fmtN(v, 1), h: 200 }) : `<div class="note">Registra tu peso dos días o más en este rango para ver la gráfica.</div>`}</div>`;
    const rev = bws.slice().reverse();
    list = `<div class="section"><h2>Registros</h2><span class="muted" style="font-size:14px">${bws.length}</span></div><div class="group">${rev.slice(0, ui.bwN || 30).map((b, i) => {
      const prev = rev[i + 1];
      const d = prev ? b.w - prev.w : null;
      return `<button class="row" data-a="bw-edit" data-id="${b.id}"><span class="grow"><span class="t">${fmtDate(parseD(b.date).getTime())}</span></span><span class="muted num" style="font-size:16px;min-width:56px;text-align:right">${d == null || Math.abs(d) < 0.05 ? '' : (d > 0 ? '+' : '−') + fmtW(Math.abs(d))}</span><span class="num" style="font-size:21px;font-weight:600;min-width:70px;text-align:right">${fmtW(b.w)}</span></button>`;
    }).join('')}</div>${bws.length > (ui.bwN || 30) ? `<button class="btn block mt" data-a="bw-more">Mostrar más</button>` : ''}`;
  } else {
    stats = `<div class="note mt">Pésate a la misma hora, idealmente en la mañana, para comparar mejor. La gráfica aparece desde el segundo registro.</div>`;
  }
  return `${topBar('Peso corporal')}${form}${stats}${chart}${list}`;
};
A['bw-range'] = el => { ui.bwRange = el.dataset.r; render(); };
A['bw-more'] = () => { ui.bwN = (ui.bwN || 30) + 60; render(); };
A['bw-save'] = () => {
  const inp = $('#bw-in'), date = $('#bw-date').value || dkey();
  const v = parseNum(inp.value);
  if (!(v > 0) || v > 700) { inp.focus(); toast('Escribe tu peso, por ejemplo 72,5'); return; }
  const ex = live('bw').find(b => b.date === date);
  put('bw', { id: ex ? ex.id : uid(), date, w: fromDisp(v) });
  toast(ex ? 'Peso actualizado' : 'Peso guardado');
};
A['bw-edit'] = el => {
  const b = S.bw[el.dataset.id];
  const s = openSheet({
    title: fmtDate(parseD(b.date).getTime(), { long: true }),
    body: `<label class="field"><span>Peso (${wUnit()})</span><input class="input num be" inputmode="decimal" style="font-size:24px;font-weight:600" value="${fmtN(roundDisp(toDisp(b.w)), 2, false)}"></label>
      <div class="btn-row"><button class="btn danger bd">${IC('trash')}Eliminar</button><button class="btn primary bs">Guardar</button></div>`,
    onMount: el2 => {
      el2.querySelector('.bs').addEventListener('click', () => {
        const v = parseNum(el2.querySelector('.be').value);
        if (!(v > 0)) return;
        put('bw', { ...b, w: fromDisp(v) }); closeSheet(s);
      });
      el2.querySelector('.bd').addEventListener('click', () => {
        const copy = remove('bw', b.id); closeSheet(s);
        toast('Registro eliminado', 'Deshacer', () => restore('bw', copy));
      });
    }
  });
};
A['bw-goal'] = () => {
  const g = S.settings.goal;
  const s = openSheet({
    title: 'Meta de peso',
    body: `<label class="field"><span>Meta (${wUnit()})</span><input class="input num gi" inputmode="decimal" style="font-size:24px;font-weight:600" value="${g ? fmtN(roundDisp(toDisp(g)), 1, false) : ''}" placeholder="Ej.: 75"></label>
      <div class="btn-row">${g ? '<button class="btn gd">Quitar meta</button>' : ''}<button class="btn primary gs">Guardar meta</button></div>`,
    onMount: el => {
      setTimeout(() => el.querySelector('.gi').focus(), 50);
      el.querySelector('.gs').addEventListener('click', () => {
        const v = parseNum(el.querySelector('.gi').value);
        if (!(v > 0)) return;
        putSettings({ goal: fromDisp(v) }); closeSheet(s);
      });
      const gd = el.querySelector('.gd'); if (gd) gd.addEventListener('click', () => { putSettings({ goal: null }); closeSheet(s); });
    }
  });
};

A['body-mode'] = el => { ui.bodyMode = el.dataset.m; render(); };
