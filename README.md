# Hércules

**Registro de entrenamiento de gym, libre y sin anuncios.** Planea tus rutinas, registra cada serie, mira tu progreso y aprende cada ejercicio con una animación. Todo en español y sin crear cuentas: tus datos son tuyos.

Funciona como app de Android y como app web instalable, también sin conexión.

## Qué puedes hacer

- **Rutinas:** arma las tuyas o parte de una plantilla, asígnales días de la semana y define series, repeticiones y descanso.
- **Entreno en curso:** marca series con peso y repeticiones, usa el cronómetro de descanso con sonido y vibración, y la calculadora de discos.
- **146 ejercicios** con animación, los músculos que trabajan, 3 pasos y un consejo. También puedes crear los tuyos.
- **Progreso:** récords personales, 1RM estimado, volumen y gráficas por ejercicio.
- **Mapa muscular:** qué músculos trabaja tu plan semanal y qué entrenaste en los últimos 7 días.
- **Peso corporal:** registro con gráfica y meta.
- **Copias de seguridad:** guarda una copia en Google Drive y recupérala en otro teléfono. Exporta tus series a CSV para Excel o Google Sheets.
- Tema claro y oscuro, kilos o libras.

## Privacidad

Hércules no tiene servidores, no pide cuentas, no muestra anuncios y no rastrea nada. Tus entrenos se guardan solo en tu teléfono o navegador. La única conexión a internet es para descargar las fuentes tipográficas; sin conexión, la app usa las del sistema.

Como los datos están solo en tu dispositivo, haz una copia en Google Drive de vez en cuando (Ajustes → Copia en Google Drive). La app te lo recuerda.

## Instalar

- **Android:** descarga el último `Hercules-X.Y.apk` de la sección [*Releases*](../../releases) y ábrelo en tu teléfono. Android te pedirá permitir la instalación desde esa fuente. Las versiones nuevas se instalan encima sin perder tus datos.
- **Web (Android, iPhone o computador):** abre **https://ranasaurio.github.io/hercules/** y elige "Instalar app" o "Añadir a pantalla de inicio".

## Construir desde el código

Necesitas Python 3.10+ con Pillow. Para el APK, también Java JDK 17+.

```
pip install pillow
python build.py                                    # genera la app web en pwa/
python -m http.server 8765 --directory pwa         # ábrela en http://localhost:8765
```

El APK, las pruebas y tu propia llave de firma están explicados en [CONTRIBUTING.md](CONTRIBUTING.md). Cómo está hecho el código, en [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md).

## Contribuir

Hércules es un proyecto personal de [RANASAURIO](https://github.com/RANASAURIO), libre y sin fines de lucro, abierto a quien quiera usarlo o mejorarlo. Reporta errores, propón ideas o envía cambios: lee [CONTRIBUTING.md](CONTRIBUTING.md) y el [código de conducta](CODE_OF_CONDUCT.md). Para fallas de seguridad, sigue [SECURITY.md](SECURITY.md).

## Licencia

Copyright © 2026 RANASAURIO.

Hércules es software libre: puedes usarlo, estudiarlo, modificarlo y compartirlo bajo los términos de la [Licencia Pública General de GNU, versión 3](LICENSE) (GPL-3.0). Si distribuyes una versión modificada, debes publicar también su código bajo la misma licencia.

Las fuentes Barlow, Barlow Condensed y Cinzel se cargan de Google Fonts y tienen su propia licencia (SIL Open Font License).
