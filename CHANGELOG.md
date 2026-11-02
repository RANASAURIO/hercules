# Registro de cambios

Los cambios importantes de cada versión. El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [1.3] - sin publicar

### Añadido
- Cuatro ejercicios de antebrazo en polea, con animación, músculos, pasos y consejo: curl de muñeca, curl de muñeca inverso, curl inverso y curl de muñeca por detrás.
- Copia en Google Drive desde Ajustes, con instrucciones paso a paso.
- Aviso en Inicio cuando la última copia de seguridad tiene más de 14 días.
- Ajustes muestra la fecha de la última copia y la versión de la app.

### Seguridad
- Política de contenido (CSP): la página solo ejecuta su propio script y solo se conecta a Google Fonts.
- La importación de copias revisa cada registro: descarta claves peligrosas, ids inválidos y valores fuera de rango, y limita el archivo a 20 MB.
- El CSV exportado ya no deja que Excel o Sheets ejecuten fórmulas escondidas.
- Android: el WebView solo navega dentro de la app, sin acceso a archivos ni ubicación y sin tráfico sin cifrar; el puente solo guarda archivos `.json` y `.csv`.
- La contraseña de la llave de firma salió del código.

## [1.2]

- Versión anterior a la publicación como proyecto abierto: rutinas, entreno en curso, 142 ejercicios animados, progreso y récords, mapa muscular, peso corporal, copias JSON y CSV.
