// =====================================================================
// Ajustes y copias de seguridad
// =====================================================================
VIEWS.settings = () => {
  const st = S.settings;
  const seg = (key, opts) => `<div class="seg" role="group">${opts.map(([v, l]) => `<button data-a="set" data-k="${key}" data-v="${v}" aria-pressed="${String(st[key]) === String(v)}">${l}</button>`).join('')}</div>`;
  const tog = (key, label, sub) => `<button class="row" data-a="tog" data-k="${key}" role="switch" aria-checked="${!!st[key]}"><span class="grow"><span class="t">${label}</span>${sub ? `<span class="s" style="display:block;white-space:normal">${sub}</span>` : ''}</span>
    <span style="width:46px;height:28px;border-radius:14px;flex:none;position:relative;background:${st[key] ? 'var(--green)' : 'var(--line)'}"><span style="position:absolute;top:3px;left:${st[key] ? 21 : 3}px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25)"></span></span></button>`;
  const counts = `${plural(workouts().length, 'entreno', 'entrenos')}, ${plural(routines().length, 'rutina', 'rutinas')}, ${plural(live('bw').length, 'registro', 'registros')} de peso`;
  const where = IN_APK ? 'Tus datos se guardan solo en este teléfono. Si desinstalas la app, se borran: haz una copia en Google Drive de vez en cuando.'
    : 'Tus datos se guardan solo en este dispositivo y navegador. Haz una copia en Google Drive de vez en cuando para no perderlos.';
  return `${topBar('Ajustes', { backBtn: true })}
    <div class="section"><h2>Entreno</h2></div>
    <div class="group">
      <div class="row"><span class="grow"><span class="t">Unidades</span></span>${seg('unit', [['kg', 'kg'], ['lb', 'lb']])}</div>
      <div class="row" style="flex-wrap:wrap;row-gap:8px"><span class="grow" style="flex-basis:100%"><span class="t">Descanso por defecto</span><span class="s" style="display:block">Cuando un ejercicio no tiene uno propio</span></span>${seg('rest', [[60, '1:00'], [90, '1:30'], [120, '2:00'], [180, '3:00']])}</div>
      <div class="row"><span class="grow"><span class="t">Peso de la barra</span><span class="s" style="display:block">Para la calculadora de discos</span></span><input class="input num" style="width:86px;text-align:center;min-height:42px" inputmode="decimal" data-i="set-bar" value="${fmtN(st.bar, 2, false)}" aria-label="Peso de la barra"><span class="muted">${wUnit()}</span></div>
      ${tog('sound', 'Sonido al terminar el descanso')}
      ${tog('vib', 'Vibración', 'Al marcar series y al terminar el descanso, si tu teléfono lo permite')}
      ${tog('wake', 'Pantalla encendida durante el entreno', 'Evita que el teléfono se bloquee entre series')}
      <button class="row" data-a="plates"><span class="grow"><span class="t">Calculadora de discos</span></span>${IC('right').replace('<svg', '<svg class="chev"')}</button>
    </div>
    <div class="section"><h2>Apariencia</h2></div>
    <div class="group"><div class="row"><span class="grow"><span class="t">Tema</span></span>${seg('theme', [['auto', 'Auto'], ['light', 'Claro'], ['dark', 'Oscuro']])}</div></div>
    <div class="section"><h2>Tus datos</h2></div>
    <div class="note mb">${where}<br><span class="muted">${counts}. ${lastBackupText()}</span></div>
    <div class="group">
      <button class="row" data-a="backup-drive">${IC('cloud')}<span class="grow"><span class="t">Copia en Google Drive</span><span class="s" style="display:block">Para recuperar todo en otro teléfono</span></span></button>
      <button class="row" data-a="export-json">${IC('download')}<span class="grow"><span class="t">Exportar copia de seguridad</span><span class="s" style="display:block">Archivo .json con todo, en la carpeta que elijas</span></span></button>
      <button class="row" data-a="import">${IC('upload')}<span class="grow"><span class="t">Importar copia</span><span class="s" style="display:block">Desde un .json del teléfono o de Drive</span></span></button>
      <button class="row" data-a="export-csv">${IC('download')}<span class="grow"><span class="t">Exportar series a CSV</span><span class="s" style="display:block">Para abrir en Excel o Google Sheets</span></span></button>
    </div>
    <div class="group mt"><button class="row" data-a="wipe" style="color:var(--red)">${IC('trash')}<span class="grow"><span class="t">Borrar todos mis datos</span></span></button></div>
    <p class="muted" style="font-size:13px;text-align:center;margin-top:24px">Hércules ${esc(HIERRO_VERSION)}. Software libre (GPL-3.0), sin anuncios y sin rastreo: tus datos son tuyos.</p>`;
};
A.set = el => {
  const k = el.dataset.k; let v = el.dataset.v;
  if (k === 'rest') v = +v;
  const patch = { [k]: v };
  if (k === 'unit' && v !== S.settings.unit) {
    const b = Number(S.settings.bar);
    patch.bar = v === 'lb' ? (b === 20 ? 45 : Math.round(b * LB)) : (b === 45 ? 20 : Math.round(b / LB * 2) / 2);
  }
  putSettings(patch);
};
A.tog = el => putSettings({ [el.dataset.k]: !S.settings[el.dataset.k] });
I['set-bar'] = el => { const v = parseNum(el.value); if (v >= 0) { Object.assign(S.settings, { bar: v, u: now() }); saveLocal(); } };

function applyTheme() {
  const t = S.settings.theme;
  const dark = t === 'dark' || (t === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  const m = $('meta[name="theme-color"]'); if (m) m.content = dark ? '#151C27' : '#E8EBEE';
  if (IN_APK && !SPLASH_ON) try { window.HierroAndroid.bars(dark); } catch (e) {}
}
try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { applyTheme(); render(); }); } catch (e) {}

// ---------- exportar ----------
function exportData() {
  const out = { app: 'hierro', v: 1, exported: new Date().toISOString(), settings: S.settings };
  for (const k of KINDS) out[k] = live(k);
  return out;
}
// En Android el guardado termina después, cuando la app nativa llama a hierroSaved
let SAVING = null;
window.hierroSaved = ok => {
  if (ok && SAVING === 'backup') markBackup();
  SAVING = null;
  toast(ok ? 'Archivo guardado' : 'No se guardó el archivo');
};
function saveFile(filename, text, mime, kind = null) {
  if (IN_APK) {
    try { SAVING = kind; window.HierroAndroid.save(filename, mime, text); return; } catch (e) { SAVING = null; }
  }
  try {
    const url = URL.createObjectURL(new Blob([text], { type: mime }));
    const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    if (kind === 'backup') markBackup();
    toast('Archivo descargado');
  } catch (e) { copySheet(filename, text); }
}
// Menú de compartir del sistema (en el navegador del teléfono). true: compartido, null: cancelado, false: no disponible
async function shareFile(filename, text, mime) {
  let file;
  try { file = new File([text], filename, { type: mime }); } catch (e) { return false; }
  if (!navigator.canShare || !navigator.canShare({ files: [file] })) return false;
  try { await navigator.share({ files: [file], title: filename }); return true; }
  catch (e) { return e && e.name === 'AbortError' ? null : false; }
}
function copySheet(filename, text) {
  const s = openSheet({
    title: 'Copia el contenido',
    body: `<p class="sub" style="margin-top:0">Aquí no se puede descargar el archivo. Copia el texto y guárdalo en una nota o en un archivo llamado <b>${esc(filename)}</b>.</p>
      <textarea class="input" readonly style="min-height:180px;font-family:monospace;font-size:12px">${esc(text.slice(0, 200000))}</textarea>
      <button class="btn primary block mt cp">${IC('copy')}Copiar</button>`,
    onMount: el => el.querySelector('.cp').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(text); toast('Copiado'); closeSheet(s); }
      catch (e) { const ta = el.querySelector('textarea'); ta.focus(); ta.select(); toast('Selecciona el texto y cópialo'); }
    })
  });
}

// ---------- copia de seguridad (Google Drive) ----------
function markBackup() { putSettings({ bk: now() }); }
function lastBackupText() {
  const bk = S.settings.bk;
  if (!bk) return 'Todavía no has hecho una copia.';
  const d = Math.floor((startOfDay(now()) - startOfDay(bk)) / DAY);
  return d < 1 ? 'Última copia: hoy.' : `Última copia: hace ${plural(d, 'día', 'días')}.`;
}
// Aviso en Inicio si hay entrenos y la última copia tiene más de 14 días
function backupNudge() {
  const st = S.settings, t = now();
  if (!workouts().length || t - (st.bk || 0) < 14 * DAY || t < (st.bkLater || 0)) return '';
  return `<div class="note mb" role="status"><b>Haz una copia de seguridad</b><br>${lastBackupText()} Guárdala en Google Drive para no perder tus entrenos si cambias de teléfono.
    <div class="btn-row mt"><button class="btn" data-a="backup-later">Más tarde</button><button class="btn primary" data-a="backup-drive">Copiar a Drive</button></div></div>`;
}
A['backup-later'] = () => { putSettings({ bkLater: now() + 7 * DAY }); toast('Te lo recordamos en una semana'); };
const canShareFiles = () => { try { return !IN_APK && !!navigator.canShare && navigator.canShare({ files: [new File(['{}'], 'a.json', { type: 'application/json' })] }); } catch (e) { return false; } };
A['backup-drive'] = () => {
  const steps = IN_APK
    ? ['Toca <b>Continuar</b>: se abre la ventana de Android para guardar.', 'Toca el menú <b>☰</b> (arriba a la izquierda) y elige <b>Drive</b>.', 'Elige una carpeta, por ejemplo «Hércules», y toca <b>Guardar</b>.']
    : canShareFiles()
      ? ['Toca <b>Continuar</b>: se abre el menú de compartir.', 'Elige <b>Drive</b>.', 'Elige una carpeta y toca <b>Subir</b>.']
      : ['Toca <b>Continuar</b>: se descarga el archivo de la copia.', 'Abre <b>drive.google.com</b> con tu cuenta de Google.', 'Arrastra el archivo a una carpeta de tu Drive.'];
  const s = openSheet({
    title: 'Copia en Google Drive',
    body: `<ol style="margin:0 0 12px;padding-left:22px;line-height:1.5">${steps.map(x => `<li style="margin-bottom:6px">${x}</li>`).join('')}</ol>
      <p class="muted" style="font-size:14px;margin:0">Para recuperarla en otro teléfono: Ajustes → Importar copia → elige el archivo desde Drive.</p>
      <button class="btn primary block mt bk-go">Continuar</button>`,
    onMount: el => el.querySelector('.bk-go').addEventListener('click', () => { closeSheet(s); backupNow(true); })
  });
};
async function backupNow(drive) {
  const name = `hercules-copia-${dkey()}.json`, text = JSON.stringify(exportData(), null, 1), mime = 'application/json';
  if (drive && !IN_APK) {
    const r = await shareFile(name, text, mime);
    if (r) { markBackup(); toast('Copia guardada'); return; }
    if (r === null) return;
  }
  saveFile(name, text, mime, 'backup');
}
A['export-json'] = () => backupNow(false);

// Una celda que empieza con = + - @ se ejecuta como fórmula en Excel o Sheets: se le antepone ' para que sea texto
const csvCell = v => {
  let s = String(v ?? '');
  if (/^[=+\-@\t\r]/.test(s) && !/^-?\d+([.,]\d+)?$/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
};
A['export-csv'] = () => {
  const rows = [['Fecha', 'Hora', 'Entreno', 'Ejercicio', 'Serie', 'Tipo', `Peso (${unit()})`, 'Reps', 'Segundos', 'Km', 'Minutos', 'Nota'].map(csvCell).join(',')];
  for (const w of workouts()) {
    const d = new Date(w.start);
    for (const it of w.items || []) {
      const ex = exById(it.ex); let n = 0;
      for (const s of it.sets || []) {
        const kind = s.warm ? 'Calentamiento' : 'Efectiva';
        const num = s.warm ? '' : ++n;
        const wv = ex.t === 'w' || ex.t === 'bw' ? fmtN(roundDisp(toDisp(s.w || 0)), 2, false).replace(',', '.') : '';
        rows.push([dkey(d), `${pad(d.getHours())}:${pad(d.getMinutes())}`, w.name, ex.n, num, kind, wv,
          ex.t === 'w' || ex.t === 'bw' ? s.r : '', ex.t === 't' ? s.r : '', ex.t === 'c' ? s.w : '', ex.t === 'c' ? s.r : '', it.note || ''].map(csvCell).join(','));
      }
    }
  }
  saveFile(`hercules-series-${dkey()}.csv`, '﻿' + rows.join('\n'), 'text/csv');
};

// ---------- importar ----------
A.import = () => {
  let parsed = null;
  const s = openSheet({
    title: 'Importar copia',
    body: `<p class="sub" style="margin-top:0">Elige el archivo .json que exportaste (puede estar en Google Drive), o pega su contenido.</p>
      <input type="file" ${IN_APK ? '' : 'accept=".json,application/json"'} class="im-file input" style="padding:10px">
      <textarea class="input mt im-txt" placeholder="…o pega aquí el contenido de la copia" style="font-family:monospace;font-size:12px"></textarea>
      <div class="im-sum mt"></div>
      <div class="im-act mt hide"><div class="btn-row"><button class="btn im-rep">Reemplazar todo</button><button class="btn primary im-merge">Combinar</button></div>
      <p class="muted" style="font-size:13px">Combinar añade lo de la copia sin borrar lo que ya tienes. Reemplazar deja solo lo que hay en la copia.</p></div>`,
    onMount: el => {
      const sum = el.querySelector('.im-sum'), act = el.querySelector('.im-act');
      const fail = msg => { parsed = null; sum.innerHTML = msg ? `<div class="note" style="color:var(--red)">${esc(msg)}</div>` : ''; act.classList.add('hide'); };
      const show = txt => {
        if (!txt.trim()) return fail('');
        if (txt.length > MAX_IMPORT) return fail('El archivo es demasiado grande para ser una copia de la app (más de 20 MB).');
        let j = null;
        try { j = cleanBackup(JSON.parse(txt)); } catch (e) {}
        if (!j) return fail('Este archivo no es una copia de la app. Elige el .json que exportaste desde Ajustes.');
        parsed = j;
        sum.innerHTML = `<div class="note">La copia tiene ${plural(j.wo.length, 'entreno', 'entrenos')}, ${plural(j.rt.length, 'rutina', 'rutinas')}, ${plural(j.bw.length, 'registro', 'registros')} de peso y ${plural(j.ex.length, 'ejercicio propio', 'ejercicios propios')}${j.exported ? `, exportada el ${fmtDate(j.exported, { year: true })}` : ''}.${j.skipped ? ` Se omitirán ${plural(j.skipped, 'elemento dañado', 'elementos dañados')}.` : ''}</div>`;
        act.classList.remove('hide');
      };
      el.querySelector('.im-file').addEventListener('change', e => {
        const f = e.target.files && e.target.files[0]; if (!f) return;
        if (f.size > MAX_IMPORT) { fail('El archivo es demasiado grande para ser una copia de la app (más de 20 MB).'); return; }
        const r = new FileReader(); r.onload = () => { el.querySelector('.im-txt').value = ''; show(String(r.result)); }; r.readAsText(f);
      });
      el.querySelector('.im-txt').addEventListener('input', e => show(e.target.value));
      el.querySelector('.im-merge').addEventListener('click', () => { if (parsed) { importData(parsed, false); closeSheet(s); } });
      el.querySelector('.im-rep').addEventListener('click', async () => {
        if (!parsed) return;
        if (!await confirmSheet({ title: '¿Reemplazar todos tus datos?', text: 'Lo que tienes ahora se borrará y quedará solo lo que trae la copia.', ok: 'Reemplazar', danger: true })) return;
        importData(parsed, true); closeSheet(s);
      });
    }
  });
};
// j viene de cleanBackup: ids y campos ya revisados
function importData(j, replace) {
  const t = now();
  if (replace) for (const k of KINDS) for (const r of Object.values(S[k])) if (!r.del) S[k][r.id] = { ...r, del: 1, u: t };
  let n = 0;
  for (const k of KINDS) {
    for (const r of j[k]) {
      const l = Object.prototype.hasOwnProperty.call(S[k], r.id) ? S[k][r.id] : null;
      if (!replace && l && !l.del && (l.u || 0) >= (r.u || 0)) continue;
      S[k][r.id] = { ...r, u: t + 1 }; n++;
    }
  }
  if (j.settings && replace) { S.settings = { ...DEFAULT_SETTINGS, ...j.settings, bk: S.settings.bk, u: t + 1 }; applyTheme(); }
  VER++; saveLocal(true); render();
  toast(`Importaste ${plural(n, 'elemento', 'elementos')}`);
}
A.wipe = async () => {
  if (!await confirmSheet({ title: '¿Borrar todos tus datos?', text: 'Se eliminan de este dispositivo los entrenos, rutinas, ejercicios propios y registros de peso. Haz una copia antes si quieres conservarlos.', ok: 'Borrar todo', danger: true })) return;
  const t = now();
  for (const k of KINDS) for (const r of Object.values(S[k])) if (!r.del) S[k][r.id] = { ...r, del: 1, u: t };
  VER++; saveLocal(true); ui.stack = []; ui.tab = 'home'; render();
  toast('Datos borrados');
};
