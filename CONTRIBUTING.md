# Cómo contribuir a Hércules

¡Gracias por querer ayudar! Hércules es un proyecto personal, libre y sin fines de lucro. Toda ayuda suma: reportar un error, proponer una idea, corregir un texto, añadir un ejercicio o mejorar el código.

Antes de empezar, lee el [código de conducta](CODE_OF_CONDUCT.md).

## Formas de ayudar

- **Reportar un error:** abre un *issue* con la plantilla "Reportar un error". Di qué hiciste, qué esperabas y qué pasó.
- **Proponer una idea:** abre un *issue* con la plantilla "Proponer una idea" antes de escribir código, para hablarla primero.
- **Añadir ejercicios o corregir animaciones:** ver [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md#cómo-añadir-un-ejercicio).
- **Fallas de seguridad:** no abras un *issue* público; sigue [SECURITY.md](SECURITY.md).

## Prepara tu equipo

| Programa | Para qué |
|---|---|
| [Python 3.10+](https://www.python.org/downloads) con Pillow (`pip install pillow`) | Construir la app |
| [Node.js 18+](https://nodejs.org) | Pruebas automáticas |
| [Java JDK 17+](https://adoptium.net) | Solo si vas a construir el APK |
| [Git](https://git-scm.com) | Control de versiones |

En Windows, si `python` no responde, usa `py`.

```
git clone <url-de-tu-fork>
cd hercules
pip install pillow
python build.py
python -m http.server 8765 --directory pwa
```

Abre http://localhost:8765 y, en las herramientas de desarrollo del navegador (`F12`), activa el modo móvil (unos 412×860).

## Antes de enviar un cambio

1. Lee [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md): explica el código y las **reglas que no se rompen** (claves de datos, ids de ejercicios, paquete de Android). Romperlas hace que la gente pierda sus datos.
2. Construye y prueba:
   ```
   python build.py
   cd tests
   npm install
   npx playwright install chromium
   npm test
   ```
   Todas las pruebas deben salir con ✔.
3. Si cambias algo visible, revisa la app en el navegador en tamaño de teléfono y en tema claro y oscuro.
4. Si tocas el código de Android (`android/smali`), prueba el APK en un teléfono real y dilo en el *pull request*.

## Pull requests

- Un cambio por *pull request*, con un título claro en español ("Añade curl de muñeca en polea", "Corrige el récord de peso en libras").
- Explica qué cambia y por qué. Si cambia algo visible, añade una captura.
- No subas archivos generados (`pwa/`, `apk/`, `build/`): `build.py` los crea.
- Al contribuir aceptas que tu código se publique bajo la licencia [GPL-3.0](LICENSE).

## Estilo

- JavaScript sin frameworks ni dependencias. Todo comparte el ámbito global: usa nombres claros que no choquen.
- Textos de la interfaz en español neutro, tuteando, con frases cortas. Los errores dicen qué pasó y cómo arreglarlo.
- Escapa siempre el texto del usuario con `esc()`. No uses `onclick="…"` ni `eval`: la política de seguridad de la página los bloquea.

## Tu propia llave de firma (APK)

El APK oficial se firma con una llave privada que **no** está en el repositorio. Para construir tu propio APK:

1. Descarga las herramientas: `python tools/get_tools.py`
2. Crea tu llave (pide una contraseña; guárdala bien):
   ```
   keytool -genkeypair -v -keystore keystore/hierro-release.jks -alias hierro -keyalg RSA -keysize 4096 -validity 10000
   ```
3. Escribe la contraseña en `keystore/clave.txt` (una sola línea) o en la variable de entorno `HERCULES_KEYSTORE_PASS`.
4. Construye: `python tools/build_apk.py`

La carpeta `keystore/` está en `.gitignore`: **nunca subas la llave ni la contraseña**. Un APK firmado con otra llave no se puede instalar encima del oficial; si publicas tu propia versión para otras personas, cambia también el nombre del paquete para que no choque con la app oficial.
