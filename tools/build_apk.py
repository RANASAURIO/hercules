#!/usr/bin/env python3
"""Construye el APK firmado de Hércules.

Uso:
  python tools/build_apk.py                 # compila con la versión actual
  python tools/build_apk.py --version 1.3   # sube versionCode en 1 y pone versionName 1.3
  python tools/build_apk.py --install       # además lo instala en el teléfono conectado por USB (adb)

Pasos: build.py (web) → copia la app y los íconos a android/ → apktool → firma (misma llave siempre)
Resultado: build/Hercules-<versión>.apk

La llave de firma (keystore/hierro-release.jks) y su contraseña nunca van al repositorio.
La contraseña se lee de la variable de entorno HERCULES_KEYSTORE_PASS o del archivo keystore/clave.txt.
Variables opcionales: HERCULES_KEYSTORE (ruta de la llave) y HERCULES_KEY_ALIAS.
"""
import argparse
import glob
import os
import re
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BIN = os.path.join(ROOT, 'tools', 'bin')
AND = os.path.join(ROOT, 'android')
OUT = os.path.join(ROOT, 'build')
KEYSTORE = os.environ.get('HERCULES_KEYSTORE') or os.path.join(ROOT, 'keystore', 'hierro-release.jks')
ALIAS = os.environ.get('HERCULES_KEY_ALIAS') or 'hierro'
PASS_FILE = os.path.join(ROOT, 'keystore', 'clave.txt')
DENSITIES = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi']


def keystore_password():
    pw = os.environ.get('HERCULES_KEYSTORE_PASS')
    if not pw and os.path.exists(PASS_FILE):
        pw = open(PASS_FILE, encoding='utf-8').read().strip()
    if not pw:
        sys.exit('Falta la contraseña de la llave. Escríbela en keystore/clave.txt o en la variable HERCULES_KEYSTORE_PASS.')
    return pw


def run(cmd, secret=None):
    shown = ['***' if secret and c == secret else c for c in cmd]
    print('>', ' '.join(shown))
    subprocess.run(cmd, check=True)


def read_version():
    yml = open(os.path.join(AND, 'apktool.yml'), encoding='utf-8').read()
    code = int(re.search(r'versionCode:\s*(\d+)', yml).group(1))
    name = re.search(r'versionName:\s*([^\s]+)', yml).group(1)
    return code, name


def bump(version_name):
    code, _ = read_version()
    code += 1
    p = os.path.join(AND, 'apktool.yml')
    yml = open(p, encoding='utf-8').read()
    yml = re.sub(r'versionCode:\s*\d+', f'versionCode: {code}', yml)
    yml = re.sub(r'versionName:\s*[^\s]+', f'versionName: {version_name}', yml)
    open(p, 'w', encoding='utf-8').write(yml)
    m = os.path.join(AND, 'AndroidManifest.xml')
    xml = open(m, encoding='utf-8').read()
    xml = re.sub(r'android:versionCode="\d+"', f'android:versionCode="{code}"', xml)
    xml = re.sub(r'android:versionName="[^"]*"', f'android:versionName="{version_name}"', xml)
    open(m, 'w', encoding='utf-8').write(xml)
    print(f'Versión: {version_name} (versionCode {code})')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--version', help='nuevo versionName, por ejemplo 1.3 (sube versionCode)')
    ap.add_argument('--install', action='store_true', help='instalar con adb en el teléfono conectado')
    args = ap.parse_args()

    apktool = os.path.join(BIN, 'apktool.jar')
    signer = os.path.join(BIN, 'uber-apk-signer.jar')
    if not (os.path.exists(apktool) and os.path.exists(signer)):
        sys.exit('Faltan las herramientas. Ejecuta primero:  python tools/get_tools.py')
    if not shutil.which('java'):
        sys.exit('No se encontró Java. Instala un JDK 17 o más nuevo y vuelve a abrir la terminal.')
    if not os.path.exists(KEYSTORE):
        sys.exit(f'No está la llave de firma ({KEYSTORE}). Sin esa llave el APK no podrá instalarse encima del anterior.\n'
                 'Si es la primera vez que construyes tu propia versión, lee CONTRIBUTING.md, sección "Tu propia llave de firma".')
    password = keystore_password()

    if args.version:
        bump(args.version)

    # 1) app web
    run([sys.executable, os.path.join(ROOT, 'build.py')])
    # 2) copiar la app y los íconos al proyecto Android
    os.makedirs(os.path.join(AND, 'assets'), exist_ok=True)
    shutil.copy(os.path.join(ROOT, 'apk', 'index.html'), os.path.join(AND, 'assets', 'index.html'))
    for d in DENSITIES:
        for f in ('ic_launcher.png', 'ic_launcher_fg.png'):
            shutil.copy(os.path.join(ROOT, 'apk', 'mipmap-' + d, f), os.path.join(AND, 'res', 'mipmap-' + d, f))
    # 3) apktool
    os.makedirs(OUT, exist_ok=True)
    unsigned = os.path.join(OUT, 'hercules-unsigned.apk')
    run(['java', '-jar', apktool, 'b', AND, '-o', unsigned])
    # 4) alinear y firmar (v2 + v3) con la llave de siempre
    signed_dir = os.path.join(OUT, 'signed')
    shutil.rmtree(signed_dir, ignore_errors=True)
    run(['java', '-jar', signer, '-a', unsigned, '-o', signed_dir, '--ks', KEYSTORE,
         '--ksAlias', ALIAS, '--ksPass', password, '--ksKeyPass', password], secret=password)
    signed = [f for f in glob.glob(os.path.join(signed_dir, '*.apk'))][0]
    _, name = read_version()
    final = os.path.join(OUT, f'Hercules-{name}.apk')
    shutil.copy(signed, final)
    print(f'\nAPK listo: {final}')
    # 5) instalar en el teléfono (opcional)
    if args.install:
        adb = shutil.which('adb')
        if not adb:
            sys.exit('No se encontró adb. Instala "Android SDK Platform-Tools" o copia el APK al teléfono a mano.')
        run([adb, 'install', '-r', final])


if __name__ == '__main__':
    main()
