// =====================================================================
// Gráficas SVG (una sola serie, con toque/hover para ver valores)
// =====================================================================
const CHARTS = new Map();
let chartSeq = 0;
function chartSlot(spec) {
  const id = 'c' + (++chartSeq);
  CHARTS.set(id, spec);
  return `<div class="chart" data-chart="${id}" style="min-height:${spec.h || 180}px"></div>`;
}
function niceTicks(min, max, n = 4, int = false) {
  if (min === max) { min -= 1; max += 1; }
  const span = max - min, step0 = span / n;
  const mag = Math.pow(10, Math.floor(Math.log10(step0)));
  let step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => span / s <= n) || 10 * mag;
  if (int) step = Math.max(1, Math.round(step));
  const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Math.round(v * 1e6) / 1e6);
  return { lo, hi, ticks };
}
function drawCharts(root) {
  root.querySelectorAll('[data-chart]').forEach(el => {
    const spec = CHARTS.get(el.dataset.chart);
    if (!spec) return;
    const W = Math.max(260, el.clientWidth || 320);
    if (spec.type === 'line') drawLine(el, spec, W); else drawBar(el, spec, W);
  });
  if (CHARTS.size > 40) { const keys = [...CHARTS.keys()]; keys.slice(0, keys.length - 20).forEach(k => CHARTS.delete(k)); }
}
function tipAt(el, x, y, html) {
  let t = el.querySelector('.tip');
  if (!t) { t = document.createElement('div'); t.className = 'tip'; el.appendChild(t); }
  t.innerHTML = html;
  const half = t.offsetWidth / 2, W = el.clientWidth;
  t.style.left = Math.max(half, Math.min(W - half, x)) + 'px';
  t.style.top = (y - 10) + 'px';
}
function drawLine(el, spec, W) {
  const H = spec.h || 190, P = { l: 40, r: 14, t: 26, b: 24 };
  const d = spec.data;
  const ys = d.map(p => p.y).concat(spec.goal != null ? [spec.goal] : []);
  let mn = Math.min(...ys), mx = Math.max(...ys);
  const pad = (mx - mn) * 0.12 || Math.max(1, mx * 0.05);
  const { lo, hi, ticks } = niceTicks(mn - pad, mx + pad, 4);
  const x0 = d[0].x, x1 = d[d.length - 1].x || x0 + 1;
  const X = x => P.l + (x1 === x0 ? (W - P.l - P.r) / 2 : (x - x0) / (x1 - x0) * (W - P.l - P.r));
  const Y = y => P.t + (1 - (y - lo) / (hi - lo)) * (H - P.t - P.b);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Gráfica con ${d.length} puntos; último valor ${esc(spec.fmt(d[d.length - 1].y, d[d.length - 1]))}">`;
  for (const t of ticks) s += `<line class="grid" x1="${P.l}" x2="${W - P.r}" y1="${Y(t)}" y2="${Y(t)}"/><text class="axis" x="${P.l - 6}" y="${Y(t) + 4}" text-anchor="end">${esc(spec.axis(t))}</text>`;
  // etiquetas de fecha: primera, mitad, última
  const idx = d.length > 2 ? [0, Math.floor((d.length - 1) / 2), d.length - 1] : [0, d.length - 1];
  [...new Set(idx)].forEach((i, k, arr) => {
    const anchor = k === 0 ? 'start' : k === arr.length - 1 ? 'end' : 'middle';
    s += `<text class="axis" x="${X(d[i].x)}" y="${H - 6}" text-anchor="${anchor}">${fmtShort(d[i].x)}</text>`;
  });
  if (spec.goal != null) s += `<line class="goal" x1="${P.l}" x2="${W - P.r}" y1="${Y(spec.goal)}" y2="${Y(spec.goal)}"/><text class="goal-l" x="${P.l + 4}" y="${Y(spec.goal) - 5}">Meta ${esc(spec.axis(spec.goal))}</text>`;
  const path = d.map((p, i) => `${i ? 'L' : 'M'}${X(p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join('');
  s += `<path class="area" d="${path}L${X(d[d.length - 1].x).toFixed(1)},${H - P.b}L${X(d[0].x).toFixed(1)},${H - P.b}Z"/>`;
  s += `<path class="ln" d="${path}"/>`;
  const showDots = d.length <= 36;
  if (showDots) d.forEach(p => { s += `<circle class="dot" cx="${X(p.x)}" cy="${Y(p.y)}" r="4"/>`; });
  const L = d[d.length - 1];
  if (!showDots) s += `<circle class="dot" cx="${X(L.x)}" cy="${Y(L.y)}" r="4.5"/>`;
  const tailX = X(L.x) - 90;
  const topY = Math.min(...d.filter(p => X(p.x) >= tailX).map(p => Y(p.y)));
  s += `<text class="endlbl" x="${Math.min(W - P.r, X(L.x))}" y="${Math.max(12, topY - 10)}" text-anchor="end">${esc(spec.fmt(L.y, L))}</text>`;
  s += `<line class="cross hide" x1="0" x2="0" y1="${P.t}" y2="${H - P.b}"/><circle class="dot hl hide" r="6"/>`;
  s += `<rect x="0" y="0" width="${W}" height="${H}" fill="transparent" class="hit"/></svg>`;
  el.innerHTML = s;
  const svg = el.querySelector('svg'), cross = svg.querySelector('.cross'), hl = svg.querySelector('.hl');
  const pts = d.map(p => ({ p, x: X(p.x), y: Y(p.y) }));
  const show = ev => {
    const r = svg.getBoundingClientRect();
    const mx = (ev.clientX - r.left) * (W / r.width);
    let best = pts[0];
    for (const q of pts) if (Math.abs(q.x - mx) < Math.abs(best.x - mx)) best = q;
    cross.setAttribute('x1', best.x); cross.setAttribute('x2', best.x); cross.classList.remove('hide');
    hl.setAttribute('cx', best.x); hl.setAttribute('cy', best.y); hl.classList.remove('hide');
    tipAt(el, best.x * r.width / W, best.y * r.height / H, `${esc(best.p.label || fmtShort(best.p.x))}<br><b>${esc(spec.fmt(best.p.y, best.p))}</b>`);
  };
  const hide = () => { cross.classList.add('hide'); hl.classList.add('hide'); const t = el.querySelector('.tip'); if (t) t.remove(); };
  svg.addEventListener('pointermove', show);
  svg.addEventListener('pointerdown', show);
  svg.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') hide(); });
}
function drawBar(el, spec, W) {
  const H = spec.h || 170, P = { l: 40, r: 6, t: 22, b: 24 };
  const d = spec.data, n = d.length;
  const mx = Math.max(...d.map(p => p.y), 0);
  const { hi, ticks } = niceTicks(0, mx || 1, 4, true);
  const band = (W - P.l - P.r) / n, bw = Math.min(24, band - 4);
  const Y = y => P.t + (1 - y / hi) * (H - P.t - P.b);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Barras por semana; semana actual ${esc(spec.fmt(d[n - 1].y, d[n - 1]))}">`;
  for (const t of ticks) s += `<line class="grid" x1="${P.l}" x2="${W - P.r}" y1="${Y(t)}" y2="${Y(t)}"/><text class="axis" x="${P.l - 6}" y="${Y(t) + 4}" text-anchor="end">${esc(spec.axis(t))}</text>`;
  d.forEach((p, i) => {
    const cx = P.l + band * i + band / 2, x = cx - bw / 2, y = Y(p.y), h = H - P.b - y;
    if (p.y > 0) {
      const r = Math.min(4, h, bw / 2);
      s += `<path class="bar ${p.cur ? 'dim' : ''}" data-i="${i}" d="M${x},${H - P.b}V${y + r}Q${x},${y} ${x + r},${y}H${x + bw - r}Q${x + bw},${y} ${x + bw},${y + r}V${H - P.b}Z"/>`;
    }
    if (i % 3 === (n - 1) % 3) s += `<text class="axis" x="${cx}" y="${H - 6}" text-anchor="middle">${esc(spec.tickX ? spec.tickX(p) : '')}</text>`;
  });
  const L = d[n - 1];
  const best = d.reduce((a, p) => p.y > a.y ? p : a, d[0]);
  if (best.y > 0) { const i = d.indexOf(best); s += `<text class="endlbl" x="${Math.min(W - P.r - 2, Math.max(P.l + 2, P.l + band * i + band / 2))}" y="${Y(best.y) - 7}" text-anchor="middle">${esc(spec.axis(best.y))}</text>`; }
  s += `<rect x="0" y="0" width="${W}" height="${H}" fill="transparent" class="hit"/></svg>`;
  el.innerHTML = s;
  const svg = el.querySelector('svg');
  const show = ev => {
    const r = svg.getBoundingClientRect();
    const mxp = (ev.clientX - r.left) * (W / r.width);
    const i = Math.max(0, Math.min(n - 1, Math.floor((mxp - P.l) / band)));
    const p = d[i];
    svg.querySelectorAll('.bar').forEach(b => b.style.opacity = +b.dataset.i === i ? 1 : 0.45);
    tipAt(el, (P.l + band * i + band / 2) * r.width / W, Math.min(Y(p.y), H - P.b - 4) * r.height / H, `${esc(p.label)}${p.cur ? ' (en curso)' : ''}<br><b>${esc(spec.fmt(p.y, p))}</b>`);
  };
  const hide = () => { svg.querySelectorAll('.bar').forEach(b => b.style.opacity = ''); const t = el.querySelector('.tip'); if (t) t.remove(); };
  svg.addEventListener('pointermove', show);
  svg.addEventListener('pointerdown', show);
  svg.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') hide(); });
}
