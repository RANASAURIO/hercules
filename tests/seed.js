// genera ~10 semanas de historial PPL con progreso
module.exports = function seed() {
  const DAY = 864e5, now = Date.now();
  const uid = () => Math.random().toString(36).slice(2, 10);
  const rt = {}, wo = {}, bw = {};
  const R = [
    { id: 'r1', name: 'Empuje', days: [1, 4], items: [['press-banca', 4, '6-8', 150], ['press-incl-manc', 3, '8-10', 120], ['press-militar', 3, '6-8', 150], ['elev-laterales', 3, '12-15', 60], ['ext-cuerda', 3, '10-12', 60]] },
    { id: 'r2', name: 'Tirón', days: [2, 5], items: [['peso-muerto', 3, '5', 180], ['dominadas', 3, '6-10', 120], ['remo-barra', 3, '8-10', 120], ['curl-barra', 3, '8-12', 60]] },
    { id: 'r3', name: 'Pierna', days: [3, 6], items: [['sentadilla', 4, '6-8', 180], ['peso-muerto-rumano', 3, '8-10', 150], ['prensa', 3, '10-12', 120], ['plancha', 3, '45', 60]] }
  ];
  R.forEach((r, i) => rt[r.id] = { id: r.id, name: r.name, days: r.days, ord: i + 1, u: now - 80 * DAY, items: r.items.map(([ex, sets, reps, rest]) => ({ ex, sets, reps, rest })) });
  const base = { 'press-banca': 60, 'press-incl-manc': 20, 'press-militar': 37.5, 'elev-laterales': 8, 'ext-cuerda': 20, 'peso-muerto': 100, 'dominadas': 0, 'remo-barra': 50, 'curl-barra': 25, 'sentadilla': 80, 'peso-muerto-rumano': 70, 'prensa': 140 };
  let k = 0;
  for (let d = 75; d >= 1; d--) {
    const t = new Date(now - d * DAY); const dow = t.getDay();
    const r = R.find(x => x.days.includes(dow));
    if (!r || (d % 9 === 0)) continue;
    k++;
    t.setHours(18, 10, 0, 0);
    const prog = (75 - d) / 75;
    const items = r.items.map(([ex, sets, reps]) => {
      const out = [];
      if (ex === 'plancha') { for (let i = 0; i < sets; i++) out.push({ r: 40 + Math.round(prog * 25) }); return { ex, sets: out }; }
      if (ex === 'dominadas') { for (let i = 0; i < sets; i++) out.push({ w: 0, r: 6 + Math.round(prog * 4) - (i > 1 ? 1 : 0) }); return { ex, sets: out }; }
      const w0 = base[ex] * (1 + prog * 0.18);
      const w = Math.round(w0 / 2.5) * 2.5;
      if (ex === 'press-banca' || ex === 'sentadilla') out.push({ w: Math.round(w * 0.5 / 2.5) * 2.5, r: 10, warm: 1 });
      const rlo = parseInt(reps);
      for (let i = 0; i < sets; i++) out.push({ w, r: rlo + (i === 0 ? 2 : 1) - (i > 2 ? 1 : 0) });
      return { ex, sets: out };
    });
    const id = uid();
    wo[id] = { id, name: r.name, rid: r.id, start: t.getTime(), end: t.getTime() + (55 + (k % 4) * 6) * 60000, note: '', items, u: t.getTime() };
  }
  for (let d = 70; d >= 0; d -= 3) {
    const t = new Date(now - d * DAY); const key = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
    const id = uid(); bw[id] = { id, date: key, w: 78.4 - (70 - d) * 0.045 + Math.sin(d) * 0.35, u: now };
  }
  return { settings: { unit: 'kg', rest: 90, bar: 20, sound: true, vib: true, theme: 'auto', goal: 74, wake: true, u: 1 }, ex: {}, rt, wo, bw };
};
