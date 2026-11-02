// =====================================================================
// Mapa corporal: qué músculos trabaja cada ejercicio y figura SVG
// =====================================================================
const REGIONS = {
  pecho: 'Pecho', hombros: 'Hombros', biceps: 'Bíceps', triceps: 'Tríceps', antebrazos: 'Antebrazos',
  trapecio: 'Trapecio', dorsales: 'Dorsales', lumbar: 'Lumbar', abdomen: 'Abdomen', oblicuos: 'Oblicuos',
  gluteos: 'Glúteos', cuadriceps: 'Cuádriceps', femorales: 'Femorales', aductores: 'Aductores', pantorrillas: 'Pantorrillas'
};
// [principales, secundarios]
const EX_MUSCLES = {
  'press-banca': [['pecho'], ['hombros', 'triceps']], 'press-inclinado': [['pecho'], ['hombros', 'triceps']],
  'press-declinado': [['pecho'], ['triceps']], 'press-banca-manc': [['pecho'], ['hombros', 'triceps']],
  'press-incl-manc': [['pecho'], ['hombros', 'triceps']], 'aperturas': [['pecho'], ['hombros']],
  'cruce-poleas': [['pecho'], ['hombros']], 'press-maquina': [['pecho'], ['hombros', 'triceps']],
  'pec-deck': [['pecho'], []], 'fondos': [['pecho', 'triceps'], ['hombros']], 'flexiones': [['pecho'], ['triceps', 'hombros', 'abdomen']],
  'peso-muerto': [['femorales', 'gluteos', 'lumbar'], ['trapecio', 'dorsales', 'cuadriceps', 'antebrazos']],
  'dominadas': [['dorsales'], ['biceps', 'antebrazos', 'hombros']], 'dominadas-supinas': [['dorsales', 'biceps'], ['antebrazos']],
  'jalon-pecho': [['dorsales'], ['biceps']], 'jalon-cerrado': [['dorsales'], ['biceps']],
  'remo-barra': [['dorsales'], ['trapecio', 'biceps', 'lumbar', 'hombros']], 'remo-mancuerna': [['dorsales'], ['trapecio', 'biceps']],
  'remo-polea': [['dorsales'], ['trapecio', 'biceps']], 'remo-maquina': [['dorsales'], ['trapecio', 'biceps']],
  'remo-t': [['dorsales'], ['trapecio', 'biceps', 'lumbar']], 'pullover-polea': [['dorsales'], ['pecho', 'triceps']],
  'hiperextensiones': [['lumbar'], ['gluteos', 'femorales']], 'encogimientos': [['trapecio'], ['antebrazos']],
  'press-militar': [['hombros'], ['triceps', 'trapecio', 'abdomen']], 'press-hombro-manc': [['hombros'], ['triceps']],
  'press-arnold': [['hombros'], ['triceps']], 'press-hombro-maq': [['hombros'], ['triceps']],
  'elev-laterales': [['hombros'], ['trapecio']], 'elev-lat-polea': [['hombros'], []], 'elev-frontales': [['hombros'], ['pecho']],
  'face-pull': [['hombros'], ['trapecio']], 'pajaros': [['hombros'], ['trapecio']], 'remo-menton': [['hombros', 'trapecio'], ['biceps']],
  'curl-barra': [['biceps'], ['antebrazos']], 'curl-manc': [['biceps'], ['antebrazos']], 'curl-martillo': [['biceps', 'antebrazos'], []],
  'curl-predicador': [['biceps'], ['antebrazos']], 'curl-polea': [['biceps'], ['antebrazos']], 'curl-concentrado': [['biceps'], ['antebrazos']],
  'curl-inclinado': [['biceps'], ['antebrazos']],
  'press-frances': [['triceps'], []], 'ext-polea': [['triceps'], []], 'ext-cuerda': [['triceps'], []], 'ext-cabeza': [['triceps'], []],
  'press-cerrado': [['triceps'], ['pecho', 'hombros']], 'patada-triceps': [['triceps'], []], 'fondos-banco': [['triceps'], ['pecho', 'hombros']],
  'sentadilla': [['cuadriceps', 'gluteos'], ['aductores', 'femorales', 'lumbar']], 'sentadilla-frontal': [['cuadriceps'], ['gluteos', 'abdomen']],
  'sentadilla-hack': [['cuadriceps'], ['gluteos']], 'sentadilla-goblet': [['cuadriceps', 'gluteos'], ['abdomen']],
  'sentadilla-bulgara': [['cuadriceps', 'gluteos'], ['femorales', 'aductores']], 'prensa': [['cuadriceps'], ['gluteos', 'femorales']],
  'zancadas': [['cuadriceps', 'gluteos'], ['femorales', 'aductores']], 'extension-cuad': [['cuadriceps'], []],
  'curl-femoral': [['femorales'], ['pantorrillas']], 'curl-femoral-sent': [['femorales'], []],
  'peso-muerto-rumano': [['femorales', 'gluteos'], ['lumbar']], 'aductores': [['aductores'], []],
  'hip-thrust': [['gluteos'], ['femorales']], 'abductores': [['gluteos'], []], 'patada-gluteo': [['gluteos'], ['femorales']],
  'puente-gluteo': [['gluteos'], ['femorales']], 'talones-pie': [['pantorrillas'], []], 'talones-sentado': [['pantorrillas'], []],
  'plancha': [['abdomen'], ['oblicuos', 'hombros']], 'crunch': [['abdomen'], []], 'crunch-polea': [['abdomen'], []],
  'elev-piernas': [['abdomen'], ['oblicuos']], 'rueda': [['abdomen'], ['dorsales', 'hombros']], 'russian-twist': [['oblicuos'], ['abdomen']],
  'cinta': [[], ['cuadriceps', 'femorales', 'pantorrillas']], 'bicicleta': [[], ['cuadriceps']], 'eliptica': [[], ['cuadriceps', 'gluteos']],
  'remo-ergo': [[], ['dorsales', 'cuadriceps']], 'escaladora': [[], ['gluteos', 'cuadriceps']], 'cuerda': [[], ['pantorrillas']]
};
const GROUP_MUSCLES = {
  pecho: [['pecho'], ['triceps']], espalda: [['dorsales'], ['biceps']], hombros: [['hombros'], []], biceps: [['biceps'], ['antebrazos']],
  triceps: [['triceps'], []], piernas: [['cuadriceps'], ['femorales', 'gluteos']], gluteos: [['gluteos'], ['femorales']],
  pantorrillas: [['pantorrillas'], []], abdomen: [['abdomen'], ['oblicuos']], cardio: [[], ['cuadriceps']]
};

Object.assign(EX_MUSCLES, {
  'curl-muneca': [['antebrazos'], []], 'curl-muneca-inv': [['antebrazos'], []], 'curl-muneca-manc': [['antebrazos'], []],
  'curl-inverso': [['antebrazos', 'biceps'], []], 'rodillo-muneca': [['antebrazos'], ['hombros']], 'handgrip': [['antebrazos'], []],
  'pinza-discos': [['antebrazos'], []], 'colgarse': [['antebrazos'], ['dorsales', 'hombros']],
  'curl-muneca-polea': [['antebrazos'], []], 'curl-muneca-inv-polea': [['antebrazos'], []],
  'curl-inverso-polea': [['antebrazos', 'biceps'], []], 'curl-muneca-espalda-polea': [['antebrazos'], []],
  'encogimientos-barra': [['trapecio'], ['antebrazos']], 'encogimientos-maq': [['trapecio'], []], 'elevacion-y': [['trapecio', 'hombros'], []],
  'buenos-dias': [['lumbar', 'femorales'], ['gluteos']], 'hiperext-peso': [['lumbar'], ['gluteos', 'femorales']], 'superman': [['lumbar'], ['gluteos']],
  'plancha-lateral': [['oblicuos'], ['abdomen', 'hombros']], 'lenador': [['oblicuos'], ['abdomen', 'hombros']], 'incl-lateral': [['oblicuos'], []],
  'pallof': [['oblicuos', 'abdomen'], []], 'crunch-bici': [['oblicuos', 'abdomen'], []],
  'crunch-inverso': [['abdomen'], ['oblicuos']], 'elev-piernas-suelo': [['abdomen'], []], 'abd-maquina': [['abdomen'], []],
  'dead-bug': [['abdomen'], ['oblicuos']], 'hollow': [['abdomen'], []], 'v-ups': [['abdomen'], ['oblicuos']],
  'sentadilla-sumo': [['aductores', 'gluteos'], ['cuadriceps']], 'aductor-polea': [['aductores'], []], 'copenhague': [['aductores'], ['oblicuos']],
  'talones-prensa': [['pantorrillas'], []], 'talones-una': [['pantorrillas'], []], 'tibial': [['pantorrillas'], []],
  'step-up': [['gluteos', 'cuadriceps'], ['femorales']], 'peso-muerto-sumo': [['gluteos', 'aductores', 'femorales'], ['cuadriceps', 'lumbar', 'trapecio', 'antebrazos']],
  'abduccion-polea': [['gluteos'], []], 'patada-maquina': [['gluteos'], ['femorales']], 'hip-thrust-maq': [['gluteos'], ['femorales']],
  'curl-nordico': [['femorales'], []], 'curl-femoral-pie': [['femorales'], []], 'peso-muerto-rigido': [['femorales'], ['gluteos', 'lumbar']],
  'sentadilla-smith': [['cuadriceps'], ['gluteos']], 'sissy': [['cuadriceps'], []], 'prensa-unilateral': [['cuadriceps'], ['gluteos']],
  'zancada-caminando': [['cuadriceps', 'gluteos'], ['femorales']],
  'aperturas-polea-baja': [['pecho'], ['hombros']], 'press-incl-maq': [['pecho'], ['hombros', 'triceps']],
  'press-smith': [['pecho'], ['hombros', 'triceps']], 'pullover-manc': [['pecho', 'dorsales'], ['triceps']],
  'dominadas-asist': [['dorsales'], ['biceps']], 'remo-invertido': [['dorsales'], ['biceps', 'trapecio']],
  'remo-pendlay': [['dorsales'], ['trapecio', 'lumbar', 'biceps']], 'remo-pecho-apoyado': [['dorsales'], ['trapecio', 'biceps']],
  'jalon-unilateral': [['dorsales'], ['biceps']],
  'elev-lat-maq': [['hombros'], []], 'pajaros-maq': [['hombros'], ['trapecio']], 'press-landmine': [['hombros'], ['pecho', 'triceps']],
  'curl-z': [['biceps'], ['antebrazos']], 'curl-spider': [['biceps'], []], 'curl-bayesiano': [['biceps'], []],
  'curl-martillo-cuerda': [['biceps', 'antebrazos'], []],
  'fondos-maquina': [['triceps'], ['pecho']], 'ext-unilateral': [['triceps'], []], 'rompecraneos-manc': [['triceps'], []],
  'flexiones-diamante': [['triceps'], ['pecho', 'hombros']], 'escaleras': [[], ['gluteos', 'cuadriceps', 'pantorrillas']]
});
Object.assign(GROUP_MUSCLES, {
  trapecio: [['trapecio'], []], antebrazos: [['antebrazos'], []], oblicuos: [['oblicuos'], ['abdomen']], lumbar: [['lumbar'], ['gluteos']],
  cuadriceps: [['cuadriceps'], ['gluteos']], femorales: [['femorales'], ['gluteos']], aductores: [['aductores'], []]
});
// grupo del selector <-> zona del muñeco
const groupToRegion = g => g === 'espalda' ? 'dorsales' : g;
const regionToGroup = r => r === 'dorsales' ? 'espalda' : r;
function exHits(e, group) {
  if (group === 'all') return true;
  if (e.m === group) return true;
  const reg = groupToRegion(group);
  return !!REGIONS[reg] && musclesOf(e.id)[0].includes(reg);
}

function musclesOf(exId) {
  if (EX_MUSCLES[exId]) return EX_MUSCLES[exId];
  const e = exById(exId);
  return GROUP_MUSCLES[e.m] || [[], []];
}
function addLoad(acc, exId, sets) {
  const [p, s] = musclesOf(exId);
  for (const m of p) acc[m] = (acc[m] || 0) + sets;
  for (const m of s) acc[m] = (acc[m] || 0) + sets * 0.5;
  return acc;
}
// Series efectivas por músculo en una sesión de la rutina
function routineLoad(r) {
  const acc = {};
  for (const it of r.items || []) addLoad(acc, it.ex, Number(it.sets) || 0);
  return acc;
}
// Plan semanal: cada rutina cuenta tantas veces como días tenga (o una vez si no tiene día fijo)
function weekPlanLoad() {
  const acc = {};
  for (const r of routines()) {
    const times = (r.days && r.days.length) || 1;
    for (const it of r.items || []) addLoad(acc, it.ex, (Number(it.sets) || 0) * times);
  }
  return acc;
}
function last7Load() {
  const acc = {}, from = startOfDay(now()) - 6 * DAY;
  for (const w of workouts()) {
    if (w.start < from) continue;
    for (const it of w.items || []) addLoad(acc, it.ex, (it.sets || []).filter(s => !s.warm).length);
  }
  return acc;
}

// Escalas de intensidad: límites inferiores de cada nivel
const SCALE_SESSION = { cuts: [0.5, 3, 6, 9], labels: ['1–2', '3–5', '6–8', '9 o más'], unit: 'series en la sesión' };
const SCALE_WEEK = { cuts: [0.5, 6, 12, 21], labels: ['1–5', '6–11', '12–20', '21 o más'], unit: 'series por semana' };
const LEVEL_NAMES = ['Baja', 'Media', 'Alta', 'Muy alta'];
function levelOf(v, scale) {
  let l = 0;
  scale.cuts.forEach((c, i) => { if (v >= c) l = i + 1; });
  return l; // 0 = sin trabajar, 1..4
}

// ---------- Figura (mitad izquierda; la derecha es su reflejo) ----------
const FIG_FRONT = [
  ['trapecio', 'M44.6 25.5C42.5 29.5 38.5 32 33 33.6L45.4 34.2Z'],
  ['hombros', 'M33.4 35.2C26.2 35 21.8 40.2 21.8 48.6C21.8 52.6 22.8 55.8 24.4 58C27.2 52 31.2 47.4 36.4 44.6C36.4 40.6 35.4 37.4 33.4 35.2Z'],
  ['pecho', 'M48.6 36L37.6 36.6C37.6 41.4 36 45.6 32.6 49C34.2 55.6 38.8 59.6 44.2 59.8C46 59.8 47.6 59.2 48.6 58.2Z'],
  ['biceps', 'M24.2 60.4C21.8 66.4 21.2 72.4 21.6 78C23.6 79.8 26.6 79.8 28.2 78C29.8 71.4 31 64.4 31.2 56.2C28.4 56.8 25.8 58.4 24.2 60.4Z'],
  ['antebrazos', 'M21.2 82.2C18.4 90 16.6 100 16.2 109.6L20.6 110.6C23.2 102 26.8 92.2 28.2 82.2C25.8 83.6 23.2 83.6 21.2 82.2Z'],
  ['abdomen', 'M48.6 62.4L41.2 62.4C40.6 72.4 40.6 86 42 97.4C44 100.6 46.4 101.8 48.6 102Z'],
  ['oblicuos', 'M39.2 62.2C35.6 62 33.4 60.2 32.2 57.6C31.6 66.4 33 78 35 88C36.8 92.8 38.6 96.4 40.4 98.6C38.8 86 38.8 72.4 39.2 62.2Z'],
  ['cuadriceps', 'M35.6 104.4C33 115.4 32.6 128.2 34 141.8C35 149.8 37 155 40 158L46.6 158C47.6 148 48 138 47.6 126.4C45 118 41 110.4 35.6 104.4Z'],
  ['aductores', 'M48.6 106.6C44.4 107.8 41.8 109.8 40.8 112C44.2 117.4 47.2 124.4 48.6 134Z'],
  ['pantorrillas', 'M37.6 166.4C35.6 176.4 36 188 38.6 198.6L44 198.6C46 188 47 176.4 46.6 166.4C43.6 167.8 40.6 167.8 37.6 166.4Z']
];
const FIG_BACK = [
  ['trapecio', 'M48.6 23.8C46.2 28.2 41.8 31.2 33.4 34.2C38.6 38 44.2 46.4 48.6 60.4Z'],
  ['hombros', FIG_FRONT[1][1]],
  ['triceps', FIG_FRONT[3][1]],
  ['antebrazos', FIG_FRONT[4][1]],
  ['dorsales', 'M32.8 38.4C38.2 42 44 50 48.6 63.2L48.6 86C45 86 41.6 84.6 38.6 81.2C34 72 32 60 31.6 50.4C31.6 45.2 32 41.2 32.8 38.4Z'],
  ['lumbar', 'M48.6 88.6C45 88.6 41.6 87.2 38.8 84.2C38.8 90.2 39.6 95.8 41.2 100L48.6 100Z'],
  ['gluteos', 'M48.6 102L40.2 102C35.6 104 33.6 110.4 34 117C35 124 41 127.2 48.6 125.4Z'],
  ['femorales', 'M34.4 121.4C33 132.4 33.4 145.4 36.4 157L47 157C48 147 48.4 137 48.4 128C44 129.2 38 127.4 34.4 121.4Z'],
  ['pantorrillas', 'M37 163.2C34.4 170 34.4 179 37 186C38.4 190 39.4 194.4 40 198.6L44.6 198.6C45 194.4 46 190 47 185.4C48.6 178.4 48 170 46.6 163.2C43.6 164.6 40 164.6 37 163.2Z']
];
// partes sin músculo (cabeza, cuello, manos, rodillas, pies, cadera)
const FIG_BASE_HALF = [
  'M44.4 22.6L48.6 23.4L48.6 34L45.4 34Z',
  'M17.8 112.2C15.4 113.4 13.8 116.6 14.4 120.4C15 123.4 17.4 124.8 19.4 123.6C21.2 122.2 21.6 118 20.8 113.2Z',
  'M38.4 159.6C37 161 37 163.6 38 165C41 166.2 43.8 166.2 46.2 165C47 163.4 47 161 46 159.6Z',
  'M38.4 200.6L44.4 200.6C45 204.4 44.2 207.8 41.2 208C37.6 208.2 36.2 206 38.4 200.6Z',
  'M35.2 100.4C38.6 102.4 43.4 103.6 48.6 104.2L48.6 105.4C43.6 106.2 39.6 106.4 36.4 104.6Z'
];
const MIRROR = 'matrix(-1 0 0 1 100 0)';

function bodySvg(load, scale, opts = {}) {
  const fill = m => `lv${levelOf(load[m] || 0, scale)}`;
  const view = (regions, ox, label) => {
    let g = `<g transform="translate(${ox} 0)" aria-label="${label}">`;
    g += `<ellipse class="bz" cx="50" cy="12.6" rx="8" ry="10"/>`;
    for (const d of FIG_BASE_HALF) g += `<path class="bz" d="${d}"/><path class="bz" d="${d}" transform="${MIRROR}"/>`;
    for (const [m, d] of regions) {
      const a = opts.interactive ? ` data-a="mus" data-m="${m}" data-k="${opts.key || ''}"` : '';
      g += `<path class="mz ${fill(m)}" d="${d}"${a}/><path class="mz ${fill(m)}" d="${d}" transform="${MIRROR}"${a}/>`;
    }
    if (regions === FIG_FRONT && !opts.mini) for (const y of [71, 80, 89]) g += `<path class="bline" d="M41 ${y}H59"/>`;
    return g + '</g>';
  };
  const lbl = opts.mini ? '' : `<text class="blab" x="50" y="220" text-anchor="middle">Frente</text><text class="blab" x="150" y="220" text-anchor="middle">Espalda</text>`;
  const h = opts.mini ? 210 : 224;
  const worked = Object.keys(REGIONS).filter(m => (load[m] || 0) >= scale.cuts[0]).map(m => REGIONS[m]);
  const aria = worked.length ? `Músculos trabajados: ${worked.join(', ')}` : 'Ningún músculo trabajado';
  return `<svg class="body ${opts.mini ? 'mini' : ''}" viewBox="0 0 200 ${h}" role="img" aria-label="${esc(aria)}">${view(FIG_FRONT, 0, 'Frente')}${view(FIG_BACK, 100, 'Espalda')}${lbl}</svg>`;
}

function bodyLegend(scale) {
  return `<div class="blegend" aria-hidden="false">${scale.labels.map((l, i) => `<span><i class="sw lv${i + 1}"></i><b>${LEVEL_NAMES[i]}</b> ${l}</span>`).join('')}</div>
    <div class="muted" style="font-size:12px;margin-top:4px">Intensidad en ${scale.unit}. Un músculo secundario cuenta media serie.</div>`;
}
function musclesList(load, scale, { showMissing = false } = {}) {
  const xs = Object.keys(REGIONS).map(m => [m, load[m] || 0]).filter(([, v]) => v >= scale.cuts[0]).sort((a, b) => b[1] - a[1]);
  if (!xs.length) return '';
  let html = `<div class="mlist">${xs.map(([m, v]) => `<button class="mchip" data-a="mus" data-m="${m}" data-k=""><i class="sw lv${levelOf(v, scale)}"></i>${REGIONS[m]} <span class="num">${fmtN(Math.round(v * 2) / 2, 1)}</span></button>`).join('')}</div>`;
  if (showMissing) {
    const miss = Object.keys(REGIONS).filter(m => !(load[m] >= scale.cuts[0])).map(m => REGIONS[m]);
    if (miss.length && miss.length < Object.keys(REGIONS).length) html += `<div class="note" style="margin-top:10px"><b>Sin trabajar:</b> ${miss.join(', ')}.</div>`;
  }
  return html;
}
// Tarjeta completa con figura, leyenda, lista y texto al tocar un músculo
function bodyCard({ title, load, scale, key, right = '', showMissing = false, foot = '', rid = null }) {
  BODY_CTX[key] = { load, scale, rid };
  return `<div class="card body-card" data-body="${key}"><div class="chart-h"><h3>${esc(title)}</h3>${right}</div>
    ${bodySvg(load, scale, { interactive: true, key })}
    <div class="bcap muted" style="font-size:14px;min-height:21px;text-align:center;margin-top:6px">Toca un músculo para ver sus series.</div>
    ${bodyLegend(scale)}${musclesList(load, scale, { showMissing })}${foot}</div>`;
}
const BODY_CTX = {};
A.mus = el => {
  const card = el.closest('[data-body]');
  if (!card) return;
  const ctx = BODY_CTX[card.dataset.body];
  if (!ctx) return;
  const m = el.dataset.m, v = ctx.load[m] || 0, lv = levelOf(v, ctx.scale);
  card.querySelectorAll('.mz.sel').forEach(p => p.classList.remove('sel'));
  card.querySelectorAll(`.mz[data-m="${m}"]`).forEach(p => p.classList.add('sel'));
  const n = Math.round(v * 2) / 2;
  card.querySelector('.bcap').innerHTML = lv
    ? `<b style="color:var(--ink)">${REGIONS[m]}</b>: ${fmtN(n, 1)} ${ctx.scale.unit}, intensidad ${LEVEL_NAMES[lv - 1].toLowerCase()}`
    : `<b style="color:var(--ink)">${REGIONS[m]}</b>: sin trabajar`;
  if (ctx.rid) card.querySelector('.bcap').innerHTML += `<br><button class="link" style="font-size:14px" data-a="rt-add-m" data-id="${ctx.rid}" data-m="${m}">Añadir ejercicios de ${REGIONS[m].toLowerCase()}</button>`;
  else card.querySelector('.bcap').innerHTML += `<br><button class="link" style="font-size:14px" data-a="mus-browse" data-m="${m}">Ver ejercicios de ${REGIONS[m].toLowerCase()}</button>`;
};

// Texto corto con los músculos principales de un ejercicio
function exMuscleText(e) {
  const [p] = musclesOf(e.id);
  if (!p.length) return mLabel(e.m);
  const ls = p.map(r => (REGIONS[r] || r).toLowerCase());
  const t = ls.length > 1 ? ls.slice(0, -1).join(', ') + ' y ' + ls[ls.length - 1] : ls[0];
  return t[0].toUpperCase() + t.slice(1);
}
// Muñeco con los músculos de un ejercicio: principales en tono fuerte, secundarios en tono suave
function exBodyCard(exId) {
  const [p, s] = musclesOf(exId);
  if (!p.length && !s.length) return '';
  const load = {};
  for (const m of s) load[m] = 1;
  for (const m of p) load[m] = 6;
  const scale = { cuts: [0.5, 3, 6, 9] };
  const names = xs => xs.map(r => REGIONS[r]).join(', ');
  return `<div class="card ex-body"><div class="ex-body-in">${bodySvg(load, scale, { mini: true })}<div>
    ${p.length ? `<div class="kv2"><i class="sw lv3"></i><span><b>Principal:</b> ${names(p)}</span></div>` : ''}
    ${s.length ? `<div class="kv2"><i class="sw lv1"></i><span><b>Secundario:</b> ${names(s)}</span></div>` : ''}</div></div></div>`;
}
// Desde el muñeco del editor de rutina: añadir ejercicios de ese músculo
A['rt-add-m'] = el => {
  const r = S.rt[el.dataset.id];
  if (!r) return;
  pickExercises({
    title: `Ejercicios de ${REGIONS[el.dataset.m] ? REGIONS[el.dataset.m].toLowerCase() : 'ese músculo'}`,
    m: regionToGroup(el.dataset.m),
    onPick: ids => {
      for (const ex of ids) { const e = exById(ex); r.items.push({ ex, sets: 3, reps: e.t === 't' ? '45' : e.t === 'c' ? '20' : '8-12', rest: null }); }
      put('rt', r);
    }
  });
};

// Ver ejercicios de un músculo (solo consulta): elegir uno abre su progreso
A['mus-browse'] = el => pickExercises({ title: `Ejercicios de ${REGIONS[el.dataset.m].toLowerCase()}`, multi: false, m: regionToGroup(el.dataset.m), onPick: ([id]) => push({ v: 'ex', id }) });
