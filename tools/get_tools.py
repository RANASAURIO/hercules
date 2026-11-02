#!/usr/bin/env python3
"""Descarga las dos herramientas que se usan para armar el APK (solo hace falta una vez).

  - apktool: convierte el proyecto android/ en un APK (incluye aapt2 para Windows, macOS y Linux).
  - uber-apk-signer: alinea y firma el APK (incluye zipalign y apksigner).

Uso:  python tools/get_tools.py
"""
import os
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BIN = os.path.join(ROOT, 'tools', 'bin')
TOOLS = {
    'apktool.jar': 'https://github.com/iBotPeaches/Apktool/releases/download/v2.10.0/apktool_2.10.0.jar',
    'uber-apk-signer.jar': 'https://github.com/patrickfav/uber-apk-signer/releases/download/v1.3.0/uber-apk-signer-1.3.0.jar',
}


def main():
    os.makedirs(BIN, exist_ok=True)
    for name, url in TOOLS.items():
        dest = os.path.join(BIN, name)
        if os.path.exists(dest) and os.path.getsize(dest) > 1_000_000:
            print(f'Ya está: {name}')
            continue
        print(f'Descargando {name}…')
        try:
            urllib.request.urlretrieve(url, dest)
        except Exception as e:  # noqa: BLE001
            print(f'No se pudo descargar {name}: {e}\nDescárgalo a mano desde {url} y guárdalo como {dest}')
            sys.exit(1)
        print(f'  listo ({os.path.getsize(dest) // 1024} KB)')
    print('Herramientas listas en tools/bin/')


if __name__ == '__main__':
    main()
