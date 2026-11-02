#!/usr/bin/env python3
"""Une los archivos de src/ en un solo index.html: la app web instalable (pwa/) y la del APK (apk/)."""
import base64, hashlib, json, os, re, shutil, zipfile
from PIL import Image, ImageDraw
import emblem

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')
read = lambda f: open(os.path.join(SRC, f), encoding='utf-8').read()
write = lambda p, s: open(p, 'w', encoding='utf-8', newline='\n').write(s)
# La versión visible sale del proyecto Android (build_apk.py --version la cambia)
VERSION = re.search(r'versionName:\s*([^\s]+)', open(os.path.join(ROOT, 'android', 'apktool.yml'), encoding='utf-8').read()).group(1)

JS_ORDER = ['data.js', 'core.js', 'ui.js', 'views.js', 'body.js', 'demo.js', 'demos_a.js', 'demos_b.js', 'workout.js', 'charts.js', 'settings.js', 'main.js']
css = read('style.css')
js_body = '\n'.join(read(f) for f in JS_ORDER)

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700'
         '&family=Barlow+Condensed:wght@500;600;700&family=Cinzel:wght@600;700&display=swap" rel="stylesheet">')

def csp(script: str) -> str:
    """Política de seguridad: solo corre el script de la app (por su huella) y solo se conecta a Google Fonts."""
    h = base64.b64encode(hashlib.sha256(script.encode('utf-8')).digest()).decode()
    return ("default-src 'none'; "
            f"script-src 'sha256-{h}'; "
            "style-src 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src https://fonts.gstatic.com; "
            "img-src 'self' data: blob:; "
            "connect-src 'self'; manifest-src 'self'; worker-src 'self'; "
            "base-uri 'none'; form-action 'none'; object-src 'none'")

def page(pwa: bool, apk: bool = False) -> str:
    extra = ('<link rel="manifest" href="manifest.webmanifest">'
             '<link rel="icon" type="image/png" href="icon-192.png">'
             '<link rel="apple-touch-icon" href="icon-192.png">'
             '<meta name="mobile-web-app-capable" content="yes">') if pwa else ''
    script = (f"\nconst HIERRO_PWA = {'true' if pwa else 'false'};\nconst HIERRO_APK = {'true' if apk else 'false'};\n"
              f"const HIERRO_VERSION = {json.dumps(VERSION)};\n{js_body}\n")
    return f'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="{csp(script)}">
<meta name="referrer" content="no-referrer">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#E8EBEE">
<meta name="description" content="Registro de entrenos de gym: rutinas, series, récords y peso corporal.">
<title>Hércules: tu registro de gym</title>
{extra}{FONTS}
<style>
{css}
</style>
</head>
<body>
<div id="splash" aria-hidden="true">
<svg class="sp-emb" viewBox="0 0 200 200">{emblem.svg_emblem()}</svg>
<div class="sp-name">Hércules</div>
<svg class="sp-key" viewBox="-1 -1 222 13"><path pathLength="1" d="{emblem.meander()}"/></svg>
<div class="sp-sub">Registro de entrenamiento</div>
</div>
<div id="app"></div>
<div id="layer" class="layer hide" aria-label="Entreno"></div>
<div id="rest" class="rest hide" role="timer" aria-label="Descanso"></div>
<script>{script}</script>
</body>
</html>
'''

SW = '''const C = 'hercules-v2';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    if (e.request.mode === 'navigate') {
      e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put('./index.html', cp)); return r; })
        .catch(() => caches.match('./index.html')));
      return;
    }
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  } else if (/fonts\\.(googleapis|gstatic)\\.com$/.test(url.host)) {
    e.respondWith(caches.open(C).then(c => c.match(e.request).then(r => r || fetch(e.request).then(res => { c.put(e.request, res.clone()); return res; }))));
  }
});
'''

MANIFEST = {
    "name": "Hércules: registro de gym", "short_name": "Hércules", "lang": "es",
    "description": "Rutinas, series, récords y peso corporal.",
    "start_url": "./", "scope": "./", "display": "standalone", "orientation": "portrait",
    "background_color": "#15110E", "theme_color": "#15110E",
    "icons": [
        {"src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
        {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
        {"src": "icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}
    ]
}

def icon(size: int, maskable: bool) -> Image.Image:
    S = 1024
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    bg = (21, 17, 14, 255)
    if maskable:
        d.rectangle([0, 0, S, S], fill=bg); k = 0.70
    else:
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=230, fill=bg); k = 0.98
    side = S * k
    emblem.draw_emblem(im, ((S - side) / 2, (S - side) / 2 - S * 0.01, side), (201, 101, 58), (234, 219, 194))
    return im.resize((size, size), Image.LANCZOS)

def adaptive_fg(size: int) -> Image.Image:
    # lienzo de 108dp; el emblema cabe en el círculo seguro central de 66dp
    S = 1080
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    side = S * 0.66
    emblem.draw_emblem(im, ((S - side) / 2, (S - side) / 2 - S * 0.008, side), (201, 101, 58), (234, 219, 194))
    return im.resize((size, size), Image.LANCZOS)

def main():
    pwa = os.path.join(ROOT, 'pwa')
    shutil.rmtree(os.path.join(ROOT, 'dist'), ignore_errors=True)  # carpeta de versiones anteriores, ya no se genera
    shutil.rmtree(pwa, ignore_errors=True); os.makedirs(pwa)
    write(os.path.join(pwa, 'index.html'), page(True))
    os.makedirs(os.path.join(ROOT, 'apk'), exist_ok=True)
    write(os.path.join(ROOT, 'apk', 'index.html'), page(False, True))
    for d, px in [('mdpi', 48), ('hdpi', 72), ('xhdpi', 96), ('xxhdpi', 144), ('xxxhdpi', 192)]:
        os.makedirs(os.path.join(ROOT, 'apk', 'mipmap-' + d), exist_ok=True)
        icon(px, False).save(os.path.join(ROOT, 'apk', 'mipmap-' + d, 'ic_launcher.png'))
        fg = adaptive_fg(px * 9 // 4)
        fg.save(os.path.join(ROOT, 'apk', 'mipmap-' + d, 'ic_launcher_fg.png'))
    write(os.path.join(pwa, 'sw.js'), SW)
    json.dump(MANIFEST, open(os.path.join(pwa, 'manifest.webmanifest'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    icon(192, False).save(os.path.join(pwa, 'icon-192.png'))
    icon(512, False).save(os.path.join(pwa, 'icon-512.png'))
    icon(512, True).save(os.path.join(pwa, 'icon-maskable-512.png'))
    zp = os.path.join(ROOT, 'hercules-app.zip')
    with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
        for f in sorted(os.listdir(pwa)):
            z.write(os.path.join(pwa, f), f)
    print('ok', VERSION, os.path.getsize(os.path.join(pwa, 'index.html')), 'bytes')

if __name__ == '__main__':
    main()
