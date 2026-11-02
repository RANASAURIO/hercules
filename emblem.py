"""Emblema de Hércules: corona de laurel con una H de capitales romanas.
Geometría en una caja de 200×200, usada para el SVG de la pantalla de carga y para los íconos PNG."""
import math

TERRACOTA = '#C9653A'
PERGAMINO = '#EADBC2'
FONDO = '#15110E'


def _leaf_poly(cx, cy, length, width, ang_deg, n=28):
    a = math.radians(ang_deg)
    ca, sa = math.cos(a), math.sin(a)
    pts = []
    for i in range(n):
        t = 2 * math.pi * i / n
        # hoja apuntada: elipse con la punta afinada
        x = math.cos(t) * length / 2
        y = math.sin(t) * width / 2 * (1 - 0.35 * (math.cos(t) > 0) * math.cos(t))
        pts.append((cx + x * ca - y * sa, cy + x * sa + y * ca))
    return pts


def wreath(cx=100, cy=106, r=72, n=8):
    """Devuelve (hojas, tallos). Hoja = dict(cx, cy, len, w, ang, order). Tallo = lista de puntos."""
    leaves, stems = [], []
    for side in (1, -1):
        t0, t1 = 80, -48  # grados; 90 = abajo. Rama derecha sube restando ángulo
        stem = []
        for k in range(41):
            t = math.radians(t0 + (t1 - t0) * k / 40)
            x, y = cx + r * math.cos(t), cy + r * math.sin(t)
            stem.append((x if side == 1 else 2 * cx - x, y))
        stems.append(stem)
        for i in range(n):
            f = i / (n - 1)
            t = math.radians(t0 + (t1 - t0) * (0.06 + 0.9 * f))
            px, py = cx + r * math.cos(t), cy + r * math.sin(t)
            dx, dy = math.sin(t), -math.cos(t)  # dirección de crecimiento (hacia arriba)
            base = math.degrees(math.atan2(dy, dx))
            L = 25 - 10 * f
            W = L * 0.40
            for k, off in enumerate((32, -32)):  # hoja exterior e interior
                ang = base + off
                lx = px + math.cos(math.radians(ang)) * L * 0.5
                ly = py + math.sin(math.radians(ang)) * L * 0.5
                if side == -1:
                    lx, ang = 2 * cx - lx, 180 - ang
                leaves.append(dict(cx=lx, cy=ly, len=L, w=W, ang=ang, order=i * 2 + k))
        # hoja final en la punta
        t = math.radians(t1)
        px, py = cx + r * math.cos(t), cy + r * math.sin(t)
        dx, dy = math.sin(t), -math.cos(t)
        ang = math.degrees(math.atan2(dy, dx))
        lx, ly = px + dx * 7, py + dy * 7
        if side == -1:
            lx, ang = 2 * cx - lx, 180 - ang
        leaves.append(dict(cx=lx, cy=ly, len=15, w=6, ang=ang, order=n * 2))
    return leaves, stems


def letter_h(cx=100, cy=101, h=66):
    """Polígonos de una H con remates romanos (dos astas + travesaño)."""
    top, bot = cy - h / 2, cy + h / 2
    sw, sf, st = 12, 25, 4.2  # ancho de asta, ancho del remate, grosor del remate
    polys = []
    for xc in (cx - 19.5, cx + 19.5):
        l, rr = xc - sw / 2, xc + sw / 2
        L, R = xc - sf / 2, xc + sf / 2
        polys.append([
            (L, top), (R, top), (R, top + st), (rr + 2.2, top + st + 1.2), (rr, top + st + 5),
            (rr, bot - st - 5), (rr + 2.2, bot - st - 1.2), (R, bot - st), (R, bot), (L, bot), (L, bot - st),
            (l - 2.2, bot - st - 1.2), (l, bot - st - 5), (l, top + st + 5), (l - 2.2, top + st + 1.2), (L, top + st)])
    polys.append([(cx - 19.5 + sw / 2, cy - 4.6), (cx + 19.5 - sw / 2, cy - 4.6), (cx + 19.5 - sw / 2, cy + 3.4), (cx - 19.5 + sw / 2, cy + 3.4)])
    return polys


def svg_emblem(animated=True):
    leaves, stems = wreath()
    out = []
    for st in stems:
        d = 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in st)
        out.append(f'<path class="sp-stem" d="{d}" pathLength="1"/>')
    for lf in leaves:
        out.append(f'<g transform="rotate({lf["ang"]:.1f} {lf["cx"]:.1f} {lf["cy"]:.1f})"><ellipse class="sp-leaf" style="--d:{lf["order"]}" '
                   f'cx="{lf["cx"]:.1f}" cy="{lf["cy"]:.1f}" rx="{lf["len"] / 2:.1f}" ry="{lf["w"] / 2:.1f}"/></g>')
    h = ''.join('<path d="M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in p) + 'Z"/>' for p in letter_h())
    out.append(f'<g class="sp-h">{h}</g>')
    return ''.join(out)


def meander(width=220, unit=11, h=11):
    """Greca griega como trazo continuo."""
    d, x = [], 0
    while x + unit <= width + 0.1:
        u = unit
        d.append(f'M{x:.1f} {h} H{x + u:.1f} M{x:.1f} {h} V0 H{x + u * 0.8:.1f} V{h * 0.62:.1f} H{x + u * 0.38:.1f} V{h * 0.3:.1f} H{x + u * 0.58:.1f}')
        x += u
    return ' '.join(d)


def draw_emblem(img, box, wreath_rgb, h_rgb):
    """Dibuja el emblema con PIL dentro de box=(x0, y0, size)."""
    from PIL import ImageDraw
    d = ImageDraw.Draw(img)
    x0, y0, size = box
    k = size / 200
    T = lambda p: (x0 + p[0] * k, y0 + p[1] * k)
    leaves, stems = wreath()
    for st in stems:
        d.line([T(p) for p in st], fill=wreath_rgb, width=max(1, int(2.4 * k)), joint='curve')
    for lf in leaves:
        d.polygon([T(p) for p in _leaf_poly(lf['cx'], lf['cy'], lf['len'], lf['w'], lf['ang'])], fill=wreath_rgb)
    for p in letter_h():
        d.polygon([T(q) for q in p], fill=h_rgb)
