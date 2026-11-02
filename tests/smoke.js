// Pruebas rápidas de Hércules con Playwright (Chromium sin ventana).
// Uso:  cd tests && npm install && npx playwright install chromium && npm test
// Antes: python build.py  (genera pwa/ y apk/)
const fs = require('fs');
const http = require('http');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');
const seed = require('./seed.js');

const ROOT = path.resolve(__dirname, '..');
let fails = 0;
const ok = (cond, msg) => { console.log(`${cond ? '✔' : '✘'} ${msg}`); if (!cond) fails++; };

// Servidor local para la app web (pwa/), como cuando se publica
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
function serve() {
  const dir = path.join(ROOT, 'pwa');
  const srv = http.createServer((req, res) => {
    const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '') || 'index.html';
    const file = path.join(dir, rel);
    if (!file.startsWith(dir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r(srv)));
}

async function open(browser, { url, data = null, init = null } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 412, height: 860 }, isMobile: true, hasTouch: true, locale: 'es-CO', timezoneId: 'America/Bogota', serviceWorkers: 'block' });
  // Anota cualquier cosa que bloquee la política de seguridad
  await ctx.addInitScript(() => { window.__csp = []; document.addEventListener('securitypolicyviolation', e => window.__csp.push(e.violatedDirective + ' ' + e.blockedURI)); });
  if (init) await ctx.addInitScript(init);
  if (data) await ctx.addInitScript(d => { if (!sessionStorage.getItem('s')) { localStorage.clear(); localStorage.setItem('hierro.v1', d); sessionStorage.setItem('s', '1'); } }, JSON.stringify(data));
  const page = await ctx.newPage();
  page.errs = [];
  page.on('pageerror', e => page.errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_|fonts/.test(m.text())) page.errs.push(m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await page.goto(url);
  await page.waitForTimeout(2200); // pantalla de carga
  return { ctx, page };
}

(async () => {
  const srv = await serve();
  const WEB = `http://127.0.0.1:${srv.address().port}/`;
  const APK = pathToFileURL(path.join(ROOT, 'apk', 'index.html')).href;
  const browser = await chromium.launch();

  // 1) Datos: ejercicios, músculos y demostraciones
  {
    const { ctx, page } = await open(browser, { url: WEB });
    const r = await page.evaluate(() => {
      const ids = BUILTIN_EXERCISES.map(e => e.id);
      const sinDemo = ids.filter(id => !DEMOS[id]);
      const sinTexto = ids.filter(id => DEMOS[id] && !(DEMOS[id].how && DEMOS[id].how.s && DEMOS[id].how.s.length === 3 && DEMOS[id].how.tip));
      const sinMusculos = ids.filter(id => !EX_MUSCLES[id]);
      const conNaN = [];
      for (const id of ids) if (DEMOS[id]) for (const t of [0, 0.4, 0.9, 1.5, 2.2, 3.1]) if (/NaN/.test(demoSvg(id, t))) { conNaN.push(id); break; }
      const mezcla = Object.entries(DEMOS).filter(([, d]) => d.k && d.k.length > 1 && d.k.slice(1).some(k => Object.keys(k).some(x => !(x in d.k[0])))).map(([id]) => id);
      const repetidos = ids.length - new Set(ids).size;
      const poleaAntebrazo = BUILTIN_EXERCISES.filter(e => e.m === 'antebrazos' && e.e === 'polea').length;
      return { n: ids.length, sinDemo, sinTexto, sinMusculos, conNaN, mezcla, repetidos, poleaAntebrazo };
    });
    ok(r.repetidos === 0, `${r.n} ejercicios, sin ids repetidos`);
    ok(!r.sinDemo.length, `todos tienen demostración ${r.sinDemo.join(', ')}`);
    ok(!r.sinTexto.length, `todos tienen 3 pasos y un consejo ${r.sinTexto.join(', ')}`);
    ok(!r.sinMusculos.length, `todos tienen músculos ${r.sinMusculos.join(', ')}`);
    ok(!r.conNaN.length, `las animaciones calculan bien ${r.conNaN.join(', ')}`);
    ok(!r.mezcla.length, `los fotogramas usan las mismas claves ${r.mezcla.join(', ')}`);
    ok(r.poleaAntebrazo >= 4, `hay ${r.poleaAntebrazo} ejercicios de antebrazo en polea`);
    await ctx.close();
  }

  // 2) Navegación por todas las pantallas
  {
    const { ctx, page } = await open(browser, { url: WEB, data: seed() });
    for (const tab of ['home', 'routines', 'history', 'progress', 'body']) {
      await page.click(`.tab[data-tab="${tab}"]`); await page.waitForTimeout(150);
    }
    await page.click('.tab[data-tab="progress"]');
    await page.click('[data-a="ex-open"][data-id="press-banca"]'); await page.waitForTimeout(500);
    ok(await page.$('.howto .demo-svg') !== null, 'el detalle muestra "Cómo se hace"');
    await page.click('.tab[data-tab="home"]'); await page.click('.top [data-a="settings"]');
    ok((await page.textContent('.top h1')) === 'Ajustes', 'abre Ajustes');
    ok(!page.errs.length, `sin errores al navegar ${page.errs.join(' | ')}`);
    ok(!(await page.evaluate(() => window.__csp)).length, `la política de seguridad no bloquea nada de la app ${(await page.evaluate(() => window.__csp)).join(' | ')}`);
    await ctx.close();
  }

  // 3) Entreno completo
  {
    const { ctx, page } = await open(browser, { url: WEB, data: seed() });
    const before = await page.evaluate(() => workouts().length);
    await page.click('.tab[data-tab="routines"]');
    await page.click('[data-a="start-rt"] >> nth=0'); await page.waitForTimeout(300);
    await page.locator('#layer [data-a="set-done"]').nth(0).click();
    await page.click('[data-a="rest-skip"]');
    await page.locator('#layer [data-a="set-done"]').nth(1).click();
    await page.click('[data-a="rest-skip"]');
    await page.click('#layer [data-a="wo-finish"]'); await page.click('.scrim [data-r="1"]'); await page.waitForTimeout(300);
    const after = await page.evaluate(() => workouts().length);
    ok(after === before + 1, 'terminar un entreno lo guarda en el historial');
    ok(!page.errs.length, `sin errores en el entreno ${page.errs.join(' | ')}`);
    await ctx.close();
  }

  // 4) Seguridad: copias importadas, CSV y código inyectado
  {
    const { ctx, page } = await open(browser, { url: WEB, data: seed() });
    const r = await page.evaluate(() => {
      // Una copia propia no pierde nada al pasar por la revisión
      const mine = cleanBackup(JSON.parse(JSON.stringify(exportData())));
      const intacta = KINDS.every(k => mine[k].length === live(k).length) && mine.skipped === 0;
      // Una copia maliciosa
      const bad = cleanBackup(JSON.parse(`{"app":"hierro","settings":{"unit":"<img src=x>","theme":"dark"},
        "wo":[{"id":"__proto__","start":1},{"id":"ok1","start":1,"end":2,"name":"a","items":[{"ex":"x\\"><b>","sets":[]},{"ex":"press-banca","sets":[{"w":"<b>","r":5}]}]}],
        "rt":[{"id":"x\\" onmouseover=\\"alert(1)","name":"a"}],
        "ex":[{"id":"c-1","n":"<b>x</b>","m":"<script>","e":"?","t":"zz","__proto__":{"polluted":1}}],
        "bw":[{"id":"b1","date":"2026-01-01","w":"80"}]}`));
      importData(bad, false);
      return {
        intacta,
        sinProto: !Object.prototype.hasOwnProperty.call(S.wo, '__proto__') && ({}).polluted === undefined,
        wo: bad.wo.length, woItems: bad.wo[0].items.length, peso: bad.wo[0].items[0].sets[0].w,
        rt: bad.rt.length, exM: bad.ex[0].m, exT: bad.ex[0].t, bw: bad.bw.length,
        unidad: bad.settings.unit, tema: bad.settings.theme, saltados: bad.skipped,
        noCopia: cleanBackup({ hola: 1 }) === null && cleanBackup([1, 2]) === null,
        csv: csvCell('=HYPERLINK("x")').startsWith(`"'=`) && csvCell('-5') === '"-5"' && csvCell('Pierna') === '"Pierna"'
      };
    });
    ok(r.intacta, 'una copia propia pasa la revisión sin perder nada');
    ok(r.sinProto && r.wo === 1 && r.woItems === 1 && r.peso === 0 && r.rt === 0 && r.bw === 0 && r.saltados === 3, 'la importación descarta registros dañados o peligrosos');
    ok(r.exM === 'otro' && r.exT === 'w' && r.unidad === undefined && r.tema === 'dark', 'la importación solo acepta valores conocidos');
    ok(r.noCopia, 'rechaza archivos que no son copias');
    ok(r.csv, 'el CSV no deja pasar fórmulas');
    const inj = await page.evaluate(() => {
      const s = document.createElement('script'); s.textContent = 'window.__pwned = 1'; document.body.appendChild(s);
      const d = document.createElement('div'); d.innerHTML = '<img src="x" onerror="window.__pwned = 2">'; document.body.appendChild(d);
      return new Promise(res => setTimeout(() => res(window.__pwned), 300));
    });
    ok(inj === undefined, 'la política de seguridad bloquea código inyectado');
    await ctx.close();
  }

  // 5) Aviso de copia de seguridad en Inicio
  {
    const { ctx, page } = await open(browser, { url: WEB, data: seed() });
    ok(await page.$('#view [data-a="backup-drive"]') !== null, 'Inicio recuerda hacer una copia');
    await page.click('#view [data-a="backup-later"]'); await page.waitForTimeout(200);
    ok(await page.$('#view [data-a="backup-drive"]') === null, '"Más tarde" oculta el aviso');
    ok(!page.errs.length, `sin errores en el aviso ${page.errs.join(' | ')}`);
    await ctx.close();
  }

  // 6) Puente con Android (simulado)
  {
    const init = () => { window.__calls = []; window.HierroAndroid = { save: (n, m) => window.__calls.push('save:' + n + ':' + m), bars: d => window.__calls.push('bars:' + d), keepOn: o => window.__calls.push('keep:' + o) }; };
    const { ctx, page } = await open(browser, { url: APK, data: seed(), init });
    ok(await page.evaluate(() => window.hierroBack()) === false, 'atrás en Inicio sale de la app');
    await page.click('.tab[data-tab="progress"]');
    ok(await page.evaluate(() => window.hierroBack()) === true, 'atrás en otra pestaña vuelve a Inicio');
    await page.click('[data-a="settings"]'); await page.click('[data-a="export-json"]');
    let calls = await page.evaluate(() => window.__calls);
    ok(calls.some(c => c.startsWith('save:hercules-copia')), 'exportar usa el guardado de Android');
    ok(calls.includes('bars:false'), 'ajusta el color de las barras del sistema');
    await page.click('[data-a="backup-drive"]'); await page.click('.bk-go');
    calls = await page.evaluate(() => window.__calls);
    ok(calls.filter(c => c.startsWith('save:hercules-copia') && c.endsWith(':application/json')).length === 2, 'la copia en Drive abre el guardado de Android');
    const bk = await page.evaluate(() => { window.hierroSaved(true); return S.settings.bk; });
    ok(bk > Date.now() - 60000, 'guardar la copia anota la fecha de la última copia');
    ok(!page.errs.length, `sin errores en modo APK ${page.errs.join(' | ')}`);
    ok(!(await page.evaluate(() => window.__csp)).length, 'la política de seguridad no bloquea nada en el APK');
    await ctx.close();
  }

  await browser.close();
  srv.close();
  console.log(fails ? `\n${fails} prueba(s) fallaron` : '\nTodo bien');
  process.exit(fails ? 1 : 0);
})();
