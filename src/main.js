// =====================================================================
// Arranque y eventos globales
// =====================================================================
function shell() {
  $('#app').innerHTML = `<main id="view"></main>
    <button id="live" class="live hide" aria-label="Volver al entreno en curso"></button>
    <nav class="tabs" aria-label="Secciones"><div class="tabs-inner">${TABS.map(([k, l, ic]) => `<button class="tab" data-a="tab" data-tab="${k}"><span class="tab-ic">${IC(ic)}</span>${l}</button>`).join('')}</div></nav>`;
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]');
  if (!el || el.disabled) return;
  const fn = A[el.dataset.a];
  if (fn) { e.preventDefault(); fn(el, e); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && sheets.length) closeSheet();
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"][data-a]')) { e.preventDefault(); e.target.click(); }
  if (e.key === 'Enter' && e.target.matches('.sets input')) {
    e.preventDefault();
    const all = $$('#layer .sets input');
    const i = all.indexOf(e.target);
    if (all[i + 1]) all[i + 1].focus(); else e.target.blur();
  }
});
document.addEventListener('input', e => {
  const el = e.target.closest('[data-i]');
  if (!el) return;
  const fn = I[el.dataset.i];
  if (fn) fn(el, e);
});
document.addEventListener('focusin', e => {
  if (e.target.matches('.sets input')) { try { e.target.select(); } catch (x) {} }
});
let resizeT;
window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(() => drawCharts($('#view')), 150); });

function splash() {
  const sp = document.getElementById('splash');
  if (!sp) { SPLASH_ON = false; return; }
  let reduce = false;
  try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  const end = () => {
    if (!SPLASH_ON) return;
    SPLASH_ON = false;
    sp.classList.add('out');
    applyTheme();
    setTimeout(() => sp.remove(), 500);
  };
  sp.addEventListener('click', end);
  setTimeout(end, reduce ? 700 : 1900);
}

function boot() {
  loadLocal();
  loadActive();
  applyTheme();
  shell();
  render();
  splash();
  setInterval(tick, 500);
  if (ACTIVE && ACTIVE.rest && ACTIVE.rest.end < now()) { ACTIVE.rest = null; saveActive(); }
  if (STANDALONE && 'serviceWorker' in navigator && /^https:|^http:\/\/localhost/.test(location.href)) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  if (STANDALONE && navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
}
boot();
