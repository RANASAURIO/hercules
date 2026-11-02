# Seguridad

## Versiones con soporte

Solo la última versión publicada en *Releases* (APK) y la app web publicada reciben correcciones de seguridad.

## Cómo reportar una falla

**No abras un *issue* público.** Usa el reporte privado de GitHub: pestaña **Security** → **Report a vulnerability** (Avisos de seguridad privados). Así solo quienes mantienen el proyecto ven el reporte hasta que esté corregido.

Incluye:

- Qué versión usas (Ajustes muestra el número) y si es el APK o la app web.
- Los pasos para reproducir la falla y qué consigue quien la aprovecha.
- Si la conoces, una idea de cómo corregirla.

Hércules es un proyecto personal y voluntario: intentaremos responder en unos días, pero no hay un plazo garantizado. Agradeceremos tu ayuda en el registro de cambios, si quieres.

## Cómo está protegida la app

- **Sin servidores ni cuentas:** los datos viven solo en el dispositivo. No hay base de datos remota que atacar ni contraseñas que filtrar.
- **Política de contenido (CSP):** la página solo ejecuta su propio script, identificado por su huella SHA-256, y solo se conecta a Google Fonts. Un texto con código inyectado no se ejecuta.
- **Importación revisada:** las copias `.json` pasan por `cleanBackup()`, que descarta claves peligrosas (`__proto__`…), ids inválidos, números fuera de rango y valores desconocidos, y limita el tamaño del archivo a 20 MB.
- **Texto escapado:** todo lo que escribe la persona se escapa antes de mostrarse.
- **CSV seguro:** las celdas que Excel o Sheets ejecutarían como fórmulas (`= + - @`) se exportan como texto.
- **WebView de Android:** solo navega dentro de la app; los enlaces externos se abren en el navegador. Sin acceso a archivos del teléfono, sin ubicación y sin tráfico sin cifrar. El puente con JavaScript solo guarda archivos `.json` y `.csv` a través del diálogo "Guardar como" del sistema.
- **Firma del APK:** la llave privada y su contraseña no están en el repositorio.
