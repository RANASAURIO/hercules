# Hércules

Instrucciones para asistentes de código. La guía técnica completa (arquitectura, comandos, animaciones, seguridad y las reglas que no se rompen) está en docs/ARQUITECTURA.md, y la forma de contribuir en CONTRIBUTING.md:

@docs/ARQUITECTURA.md
@CONTRIBUTING.md

## Cómo trabajar en este repositorio

- Responde en español, con palabras sencillas.
- Antes de un cambio grande, explica en pocas líneas qué vas a hacer y espera el visto bueno.
- Respeta siempre las reglas que no se rompen de docs/ARQUITECTURA.md: las claves de datos, los ids de ejercicios, el paquete `com.hierro.gym` y la llave de firma.
- Después de cada cambio: `python build.py` y `cd tests && npm test`. Todo debe salir con ✔.
- Cuando pidan "el APK", genera una versión nueva con `python tools/build_apk.py --version <siguiente>` y di la ruta del archivo.
- Cada ejercicio nuevo necesita músculos, animación, 3 pasos y un consejo. Revisa la animación con una captura, no solo con las pruebas.
- Si tocas `android/smali`, pide que alguien pruebe el APK en un teléfono real antes de darlo por bueno.
- Si algo no se puede hacer bien con la estructura actual, dilo y propone la alternativa con sus pros y contras.
- Actualiza CHANGELOG.md con cada cambio visible.
