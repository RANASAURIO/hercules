# Arquitectura de Hércules

Guía técnica del código. Para preparar tu equipo y enviar cambios, lee primero [CONTRIBUTING.md](../CONTRIBUTING.md).

## Qué es

Hércules es una app de registro de gym en español: planear rutinas, registrar entrenos (series, peso, repeticiones, descanso), ver progreso y récords, llevar el peso corporal, ver qué músculos trabaja cada rutina y aprender cada ejercicio con una animación.

- **Toda la interfaz está en español** (neutro, tuteando).
- Es una sola página web (HTML + CSS + JavaScript sin frameworks ni dependencias) que se distribuye de dos formas:
  1. `pwa/`: app web instalable sin conexión (manifest + service worker). Se publica en GitHub Pages.
  2. `build/Hercules-X.Y.apk`: app de Android. Es un WebView nativo que carga `assets/index.html`.
- No hay servidor ni cuentas: los datos viven solo en el dispositivo (`localStorage`). Las copias de seguridad son archivos `.json` que la persona guarda donde quiera, por ejemplo en Google Drive.

## Comandos

| Qué | Comando |
|---|---|
| Descargar herramientas del APK (una vez) | `python tools/get_tools.py` |
| Construir la web (pwa/ y apk/) | `python build.py` |
| Ver la app en el navegador | `python -m http.server 8765 --directory pwa` y abrir http://localhost:8765 (en las DevTools, modo móvil) |
| Pruebas automáticas | `cd tests && npm install && npx playwright install chromium && npm test` |
| Construir el APK firmado | `python tools/build_apk.py --version 1.3` (sube versionCode solo) |
| Instalar en el teléfono por USB | `python tools/build_apk.py --install` (necesita `adb`) |

En Windows, si `python` no existe, usa `py`. Requisitos: Python 3.10+ con Pillow (`pip install pillow`), Java JDK 17+ (solo para el APK) y Node.js 18+ (solo para las pruebas).

**Después de cada cambio:** `python build.py` y luego `cd tests && npm test`.

## Estructura

```
src/              código fuente (se concatena en un solo HTML)
  data.js         MUSCLES (grupos), EQUIP, BUILTIN_EXERCISES (146), TEMPLATES (plantillas de rutinas), discos
  core.js         utilidades, estado S, guardado local, revisión de copias importadas, estadísticas y récords
  ui.js           iconos, navegación, render(), hojas (modales), toasts, selector de ejercicios, botón atrás
  views.js        pantallas: Inicio, Rutinas, editor de rutina, Historial, detalle de entreno, Progreso, ejercicio, Peso
  body.js         mapa corporal: músculos de cada ejercicio (EX_MUSCLES), cargas, muñeco SVG por intensidad
  demo.js         motor de animación de ejercicios (figura articulada, cinemática inversa, equipos)
  demos_a.js      animaciones + pasos + consejo: pecho, espalda, hombros, brazos, antebrazos
  demos_b.js      animaciones + pasos + consejo: piernas, glúteos, abdomen, cardio
  workout.js      entreno en curso, edición de entrenos, series, descanso, calculadora de discos, terminar
  charts.js       gráficas SVG (línea y barras) con tooltip
  settings.js     Ajustes, tema, copia en Google Drive, exportar/importar copia (JSON) y CSV, borrar datos
  main.js         arranque, delegación de eventos, pantalla de carga
  style.css       todos los estilos; tokens en :root y [data-theme="dark"]
build.py          une todo: pwa/ (+ hercules-app.zip) y apk/ (index + íconos)
emblem.py         emblema (corona de laurel + H) para la pantalla de carga y los íconos
android/          proyecto Android para apktool (sin Gradle)
tools/            get_tools.py y build_apk.py
tests/            smoke.js (Playwright) y seed.js (10 semanas de datos de ejemplo)
docs/             esta guía
keystore/         llave de firma del APK (no está en el repositorio)
```

El orden de concatenación está en `JS_ORDER` dentro de `build.py`. Todo comparte el ámbito global: no hay módulos ni imports. Si creas un archivo nuevo en `src/`, agrégalo a `JS_ORDER` en el lugar correcto. Como el ámbito es global, revisa que los nombres nuevos no choquen con otros.

`build.py` inyecta tres constantes: `HIERRO_PWA` (true solo en `pwa/`), `HIERRO_APK` (true solo en `apk/`) y `HIERRO_VERSION` (el `versionName` de `android/apktool.yml`).

## Arquitectura

- **Render:** `render()` en ui.js pinta `VIEWS[ui.tab]()` o la vista de arriba de `ui.stack` (pantallas apiladas con `push({v:'ex', id})` y `back()`). Las vistas devuelven strings HTML. Escapa siempre el texto del usuario con `esc()`.
- **Eventos:** delegación global. `data-a="nombre"` en un elemento llama a `A.nombre(el, ev)`. `data-i="nombre"` en un input llama a `I.nombre(el)` en cada pulsación.
- **Estado:** el objeto `S` tiene `settings`, `ex` (ejercicios propios), `rt` (rutinas), `wo` (entrenos) y `bw` (peso). Para cambiar datos usa siempre `put(kind, rec)`, `remove(kind, id)` (deja una marca `del: 1`), `restore()` y `putSettings(patch)`. Así se actualizan la marca de tiempo `u` y el guardado local.
- **Modelos:**
  - Rutina: `{id, name, days:[0-6], items:[{ex, sets, reps:'8-12', rest}], ord}`
  - Entreno: `{id, name, rid, start, end, note, items:[{ex, note?, sets:[{w, r, warm?}]}]}`
  - Peso: `{id, date:'AAAA-MM-DD', w}`
  - Ajustes: `{unit, rest, bar, sound, vib, theme, goal, wake, bk?, bkLater?}` (`bk` = fecha de la última copia de seguridad).
  - Los pesos se guardan **siempre en kg**; `toDisp`/`fromDisp` convierten a lb.
  - Significado de una serie según el tipo de ejercicio (`t`): `w` = kg × reps; `bw` = lastre × reps; `t` = segundos en `r`; `c` = km en `w` y minutos en `r`.
- **Estadísticas:** `workouts()`, `exHistory()` (historial y récords) y otras funciones están memorizadas por `VER`, que sube con cada `put`.
- **Entreno en curso:** `ACTIVE` (se guarda en `localStorage['hierro.active']`), se muestra en la capa `#layer`. `EDIT` es una copia de un entreno pasado que se está editando.
- **Copias de seguridad:** `exportData()` arma el JSON (`app: 'hierro'`). La copia en Google Drive usa el diálogo "Guardar como" de Android (donde aparece Drive), el menú de compartir del navegador o una descarga. Inicio muestra un aviso si hay entrenos y la última copia tiene más de 14 días.
- **Importar:** todo archivo pasa por `cleanBackup()` (core.js) antes de tocar `S`. Esa función quita claves peligrosas (`__proto__`…), valida ids, números, fechas y valores de listas cerradas, y conserva los campos desconocidos si son datos simples. **Si añades un campo que se muestra en pantalla o se usa como clave, valídalo también en `CLEAN`.**
- **Android:** el WebView inyecta `window.HierroAndroid` (`IN_APK` es true) con `save(nombre, mime, texto)` para guardar archivos (solo acepta `application/json` y `text/csv`), `bars(oscuro)` para el color de las barras del sistema y `keepOn(encendida)` para mantener la pantalla encendida. El botón atrás nativo llama a `window.hierroBack()`, que devuelve true si la app lo manejó y false para salir. Android avisa el resultado de guardar con `window.hierroSaved(ok)`.

## Seguridad

- **Política de contenido (CSP):** `build.py` agrega una política que solo deja correr el script de la app, identificado por su huella SHA-256, y solo permite cargar las fuentes de Google Fonts. Por eso:
  - No uses `onclick="…"` ni otros atributos de eventos en el HTML: usa `data-a`.
  - No uses `eval`, `new Function` ni scripts externos.
  - Si necesitas otro recurso externo, añádelo a `csp()` en `build.py` y justifícalo en el PR.
- **Texto del usuario:** siempre con `esc()` al pintarlo. Los ids que vienen de datos importados ya están validados por `cleanBackup()`.
- **CSV:** `csvCell()` antepone `'` a las celdas que empiezan con `= + - @` para que Excel o Sheets no las ejecuten como fórmulas.
- **WebView (Android):** `Client.smali` solo deja navegar dentro de `file:///android_asset/`; los enlaces https se abren en el navegador. Sin acceso a archivos, sin ubicación y sin tráfico sin cifrar (`usesCleartextTraffic="false"`).
- **Firma:** la llave y su contraseña nunca van al repositorio (ver CONTRIBUTING.md).

## Reglas que no se rompen

Rompen datos o actualizaciones de quienes ya usan la app:

1. **No cambies** las claves `localStorage`: `hierro.v1` y `hierro.active`.
2. **No renombres ni borres ids de ejercicios** de `BUILTIN_EXERCISES`: el historial los referencia. Puedes cambiar el nombre visible, el grupo o el equipo.
3. **No cambies** el paquete Android `com.hierro.gym` ni la llave de firma oficial. Con otro paquete o con otra llave el APK nuevo no se instala encima del viejo, y desinstalar borra los datos.
4. `versionCode` siempre sube; `build_apk.py --version` lo hace solo.
5. No cambies el `app: 'hierro'` de las copias exportadas (la importación acepta `hierro` y `hercules`).
6. No cambies los nombres `HierroAndroid`, `hierroBack` ni `hierroSaved` sin cambiar también el smali.
7. Los cambios de datos deben ser retrocompatibles: lee con valores por defecto, nunca supongas que un campo nuevo existe.

## Cómo añadir un ejercicio

1. `src/data.js`: añade una entrada a `BUILTIN_EXERCISES`: `['id-unico', 'Nombre visible', grupo, equipo, tipo, esBarraConDiscos]`. El grupo es una clave de `MUSCLES`, el equipo una de `EQUIP` y el tipo uno de `'w' | 'bw' | 't' | 'c'`.
2. `src/body.js`: añade `'id-unico': [[principales], [secundarios]]` en `EX_MUSCLES`, usando claves de `REGIONS`.
3. `src/demos_a.js` o `demos_b.js`: añade `DX('id-unico', def, [3 pasos], 'consejo')` (ver la sección siguiente).
4. `python build.py`, luego `npm test`. La primera prueba falla si a algún ejercicio le falta demostración, sus 3 pasos, el consejo o los músculos.

## Cómo hacer o arreglar una animación

Lienzo de 240×214, piso en y=204, tobillo de pie en `GY = 198`, figura de pie centrada en x≈112. Los ángulos van en grados: **0 = abajo, 90 = adelante (derecha), 180 = arriba, −90 = atrás**. La figura mira a la derecha.

- `def = { v: 's' | 'f', p: [accesorios], k: [pose0, pose1, …], dur, hold }`. `v: 'f'` es vista de frente; si se omite, es de lado. Para movimientos cíclicos (cardio) usa `fn: p => pose` y `per` (duración del ciclo) en lugar de `k`.
- **Regla clave:** `k[1]` y los demás fotogramas se combinan sobre `k[0]`, así que **toda clave que aparezca en un fotograma posterior debe existir también en `k[0]`**; si no, la animación salta. No mezcles modos entre fotogramas: si `k0` usa `wrS`, `k1` también. La prueba "los fotogramas usan las mismas claves" lo revisa.
- **Pose de lado:**
  - Cuerpo: `hip: [x, y]`, `t` (ángulo del torso, 180 = de pie), `sup: 1` si está boca arriba con la cabeza a la derecha.
  - Brazos: por ángulos `ua`/`fa`, o por objetivo de la muñeca con cinemática inversa. El objetivo puede ser `wr` (absoluto), `wrS` (relativo al hombro), `wrT` (en ejes del torso: [a lo largo, al frente]) o `wrH` (relativo a la cadera). `ed: [dx, dy]` es la dirección preferida del codo, `uaL` acorta el brazo cuando va hacia la cámara y `hd` es el ángulo de la mano.
  - Piernas: por ángulos `th`/`sh`, o por el tobillo `an`/`anH`. `kd` es la dirección preferida de la rodilla; `toe`/`fd` definen el pie.
  - El lado lejano lleva sufijo `2` (`ua2`, `an2`…). Si no lo indicas, copia al cercano.
- **Pose de frente:** `pel` (pelvis), `t`, `tl` (acortar el torso al inclinarse), `hl`, `shr` (encoger los hombros), `thl` (muslo acortado al estar sentado), `wr`/`wrL`/`wrS`, `ed`/`edL`, `an`/`anL`/`anP`, `kd`/`kdL`. Si no indicas el lado izquierdo, es el espejo del derecho.
- **Accesorios** (`demo.js → drawProp`): `plate`, `db`, `kb`, `tower` + `cable` (polea), `bench`, `seat`, `tpad` (respaldo que sigue al torso), `pad`, `roll`, `lever`, `bar`, `box`, `rails` (Smith), `landmine`, `plat`, `rope`, `wheel`, `grip`, `pinch`, `treadmill`, `bike`, `rower`, `barF`/`dbF`/`dbV`/`hbar`/`cableC` (vista de frente), `jrope`. Se anclan a una articulación con `at: 'wr' | 'hand' | 'an' | 'sh' | 'hip' | …`, más `off` (desplazamiento normal) u `offT` (en ejes del torso).
- **Ayudas** en `demos_a.js`: `STAND()`, `SEAT()`, `SUPB()` (boca arriba en banco), `INCL()`, `PUSH(ángulo)`, `tAt(cadera, hombro)`, `BENCHF`, `PB(r)` (disco), `DB()`, `SEATP()`, `BACKP()`, `CURL()`, `WRIST()` y `WRISTC()` (curl de muñeca en polea).
- Las partes del cuerpo del músculo principal se pintan solas en naranja (`hlOf` usa `EX_MUSCLES`).
- Revisa la animación en el navegador: Progreso → Ver todos → el ejercicio. Tocar la animación la pausa.

## Diseño y textos

- Paleta "tiza y acero": fondo `#E8EBEE`, tinta `#17202B`, azul de acción `#1E4FD8`. Los colores de los discos siguen el código de competencia. La intensidad muscular usa la rampa naranja `--lv1..--lv4`. El tema oscuro tiene sus propios valores en `[data-theme="dark"]`.
- Fuentes: Barlow (texto), Barlow Condensed (números y títulos) y Cinzel (solo el logotipo HÉRCULES). Se cargan de Google Fonts; sin conexión se usan las del sistema.
- La pantalla de carga e íconos son de estilo griego: fondo `#15110E`, laurel terracota `#C9653A` y H pergamino `#EADBC2`.
- Textos: frases cortas, en mayúscula inicial (nunca etiquetas en mayúsculas sostenidas), verbos claros ("Guardar peso", "Empezar entreno") y tuteo. Los mensajes de error dicen qué pasó y cómo arreglarlo.
- Accesibilidad: botones de al menos 44 px, `aria-label` en botones de solo ícono y respeto de `prefers-reduced-motion`.
- Es una app para el móvil: prueba siempre en un viewport de unos 412×860.

## Android (carpeta android/)

No hay Gradle ni Android Studio: apktool compila el código nativo, escrito en **smali** (`android/smali/com/hierro/gym/`).

- `MainActivity.smali`: crea el WebView (JavaScript y DOM storage activos; sin acceso a archivos ni ubicación), carga `file:///android_asset/index.html`, maneja el botón atrás (llama a `hierroBack`), recibe los resultados de guardar archivo (código 42) y de elegir archivo (código 43).
- `Client.smali`: `WebViewClient` que bloquea la navegación fuera de la app y abre los enlaces https en el navegador.
- `Bridge.smali`: la interfaz `HierroAndroid` (`@JavascriptInterface`) con `save`, `bars` y `keepOn`. Cada método crea un `Op` y lo ejecuta en el hilo de la interfaz.
- `Op.smali`: abre "Guardar como" (`ACTION_CREATE_DOCUMENT`), cambia los colores de las barras y activa o quita `FLAG_KEEP_SCREEN_ON`.
- `Chrome.smali`: `onShowFileChooser` para que funcione `<input type="file">` (importar copias, también desde Drive).
- `BackCb.smali`: si `hierroBack()` devuelve false, manda la app al fondo.
- `res/`: nombre de la app ("Hércules"), colores, tema con la pantalla de carga nativa (`values-v31`) e ícono adaptativo.
- `minSdk` 24, `targetSdk` 34, permisos `INTERNET` y `VIBRATE`.

Si tocas smali: respeta `.locals`, usa firmas exactas de la API de Android y vuelve a compilar con `build_apk.py`. Un cambio nativo no está terminado hasta que alguien lo prueba en un teléfono real. Si algún día hacen falta funciones nativas grandes (notificaciones con la app cerrada, widgets, iniciar sesión con Google), lo indicado es migrar a un proyecto Gradle o Capacitor, sin cambiar el paquete ni la llave.

## Limitaciones conocidas

- El aviso de fin de descanso suena solo con la app abierta (la pantalla queda encendida durante el entreno).
- Los datos están solo en el dispositivo; desinstalar la app los borra. Por eso existen la copia en Google Drive y el aviso en Inicio.
- La copia en Google Drive no es automática: Google no permite iniciar sesión dentro de un WebView, y una conexión directa con la API de Drive exigiría migrar el proyecto Android a Gradle.
