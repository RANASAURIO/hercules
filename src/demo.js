// =====================================================================
// Demostraciones animadas: figura articulada (de lado o de frente) con
// cinemática inversa sencilla, equipos y bucle de animación.
// Ángulos en grados: 0 = abajo, 90 = adelante (derecha), 180 = arriba, -90 = atrás.
// =====================================================================
const DL = { torso: 46, neck: 7, head: 8.5, thigh: 40, shin: 38, ua: 27, fa: 25, foot: 12 };
const GY = 198, FLOOR = 204;
const D2R = Math.PI / 180;
const dv = a => [Math.sin(a * D2R), Math.cos(a * D2R)];
const PT = (p, a, l) => { const d = dv(a); return [p[0] + d[0] * l, p[1] + d[1] * l]; };
const angTo = (a, b) => Math.atan2(b[0] - a[0], b[1] - a[1]) / D2R;
const r1 = n => Math.round(n * 10) / 10;

function ik2(root, tgt, l1, l2, pref) {
  const dx = tgt[0] - root[0], dy = tgt[1] - root[1];
  let d = Math.hypot(dx, dy) || 0.001;
  const ux = dx / d, uy = dy / d;
  if (d >= l1 + l2 - 0.05) return { j: [root[0] + ux * l1, root[1] + uy * l1], e: [root[0] + ux * (l1 + l2), root[1] + uy * (l1 + l2)] };
  d = Math.max(d, Math.abs(l1 - l2) + 0.05);
  const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const base = Math.atan2(dy, dx);
  const c1 = [root[0] + l1 * Math.cos(base + a), root[1] + l1 * Math.sin(base + a)];
  const c2 = [root[0] + l1 * Math.cos(base - a), root[1] + l1 * Math.sin(base - a)];
  const s = c => (c[0] - root[0]) * pref[0] + (c[1] - root[1]) * pref[1];
  return { j: s(c1) >= s(c2) ? c1 : c2, e: [root[0] + ux * d, root[1] + uy * d] };
}
function lerpV(a, b, t) {
  if (typeof a === 'number' && typeof b === 'number') return a + (b - a) * t;
  if (Array.isArray(a) && Array.isArray(b)) return a.map((x, i) => lerpV(x, b[i], t));
  return t < 0.5 ? a : b;
}
function lerpPose(a, b, t) {
  const o = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) o[k] = a[k] === undefined ? b[k] : b[k] === undefined ? a[k] : lerpV(a[k], b[k], t);
  return o;
}
const ease = t => 0.5 - 0.5 * Math.cos(Math.PI * t);

// ---------- esqueleto de lado ----------
const ARM_KEYS = ['ua', 'fa', 'wr', 'wrS', 'wrT', 'wrH', 'hd', 'ed', 'uaL'];
const LEG_KEYS = ['th', 'sh', 'an', 'anH', 'kd', 'toe', 'fd'];
function sideSkel(q) {
  const F = q.sup ? -1 : 1;
  const hip = q.hip, t = q.t;
  const sh = PT(hip, t, DL.torso);
  const head = PT(sh, t + (q.hn || 0), DL.neck + DL.head);
  const front = t - 90 * F;
  const U = dv(t), W = dv(front);
  const tf = v => [sh[0] + U[0] * v[0] + W[0] * v[1], sh[1] + U[1] * v[0] + W[1] * v[1]];
  const hf = v => [hip[0] + U[0] * v[0] + W[0] * v[1], hip[1] + U[1] * v[0] + W[1] * v[1]];
  const pick = (keys, sfx) => {
    const own = keys.some(k => q[k + sfx] !== undefined);
    const g = {};
    for (const k of keys) g[k] = own ? (q[k + sfx] !== undefined ? q[k + sfx] : (k === 'ed' || k === 'kd' ? q[k] : undefined)) : q[k];
    return g;
  };
  const arm = sfx => {
    const g = pick(ARM_KEYS, sfx);
    let el, wr;
    const lu = DL.ua * (g.uaL != null ? g.uaL : 1);
    if (g.ua != null) { el = PT(sh, g.ua, lu); wr = PT(el, g.fa != null ? g.fa : g.ua, DL.fa); }
    else {
      const tg = g.wr || (g.wrS && [sh[0] + g.wrS[0], sh[1] + g.wrS[1]]) || (g.wrT && tf(g.wrT)) || (g.wrH && [hip[0] + g.wrH[0], hip[1] + g.wrH[1]]) || [sh[0], sh[1] + 52];
      const r = ik2(sh, tg, lu, DL.fa, g.ed || [0, 1]); el = r.j; wr = r.e;
    }
    const hand = PT(wr, g.hd != null ? g.hd : angTo(el, wr), 6);
    return { el, wr, hand };
  };
  const leg = sfx => {
    const g = pick(LEG_KEYS, sfx);
    let kn, an;
    if (g.th != null) { kn = PT(hip, g.th, DL.thigh); an = PT(kn, g.sh != null ? g.sh : g.th, DL.shin); }
    else {
      const tg = g.an || (g.anH && [hip[0] + g.anH[0], hip[1] + g.anH[1]]) || [hip[0], hip[1] + 78];
      const r = ik2(hip, tg, DL.thigh, DL.shin, g.kd || [1, 0]); kn = r.j; an = r.e;
    }
    const toe = g.toe || PT(an, g.fd != null ? g.fd : angTo(kn, an) + 90 * F, DL.foot);
    return { kn, an, toe };
  };
  return { hip, sh, head, t, F, U, W, tf, hf, a: arm(''), a2: arm('2'), l: leg(''), l2: leg('2') };
}

// ---------- esqueleto de frente ----------
function frontSkel(q) {
  const pel = q.pel, t = q.t != null ? q.t : 180, tl = q.tl || 1;
  const top = PT(pel, t, DL.torso * tl);
  const pr = dv(t - 90); // hacia la derecha de la imagen
  const up = dv(t);
  const shr = q.shr || 0;
  const shR = [top[0] + pr[0] * 17 + up[0] * shr, top[1] + pr[1] * 17 + up[1] * shr];
  const shL = [top[0] - pr[0] * 17 + up[0] * shr, top[1] - pr[1] * 17 + up[1] * shr];
  const hpR = [pel[0] + pr[0] * 9, pel[1] + pr[1] * 9], hpL = [pel[0] - pr[0] * 9, pel[1] - pr[1] * 9];
  const head = PT(top, t + (q.hn || 0), (DL.neck + DL.head) * (q.hl || 1));
  const mx = p => [2 * pel[0] - p[0], p[1]];
  const arm = (s, side) => {
    let tg;
    if (side > 0) tg = q.wr || (q.wrS && [s[0] + q.wrS[0], s[1] + q.wrS[1]]) || [s[0] + 2, s[1] + 52];
    else tg = q.wrL || (q.wrS && [s[0] - q.wrS[0], s[1] + q.wrS[1]]) || (q.wr && mx(q.wr)) || [s[0] - 2, s[1] + 52];
    const e = q.ed || [1, 0.4];
    const pref = side > 0 ? e : (q.edL || [-e[0], e[1]]);
    const r = ik2(s, tg, DL.ua, DL.fa, pref);
    return { el: r.j, wr: r.e };
  };
  const leg = (h, side) => {
    let tg;
    if (side > 0) tg = q.an || (q.anP && [h[0] + q.anP[0], h[1] + q.anP[1]]) || [h[0] + 3, h[1] + 78];
    else tg = q.anL || (q.anP && [h[0] - q.anP[0], h[1] + q.anP[1]]) || (q.an && mx(q.an)) || [h[0] - 3, h[1] + 78];
    const k = q.kd || [0.4, -0.2];
    const pref = side > 0 ? k : (q.kdL || [-k[0], k[1]]);
    const r = ik2(h, tg, DL.thigh * (q.thl || 1), DL.shin, pref);
    return { kn: r.j, an: r.e };
  };
  return { pel, top, head, shR, shL, hpR, hpL, aR: arm(shR, 1), aL: arm(shL, -1), lR: leg(hpR, 1), lL: leg(hpL, -1), t, up, pr };
}

// ---------- dibujo ----------
const LN = (a, b, w, c, extra = '') => `<line x1="${r1(a[0])}" y1="${r1(a[1])}" x2="${r1(b[0])}" y2="${r1(b[1])}" stroke-width="${w}" class="${c}"${extra}/>`;
const CI = (p, r, c, extra = '') => `<circle cx="${r1(p[0])}" cy="${r1(p[1])}" r="${r}" class="${c}"${extra}/>`;
const RC = (x, y, w, h, c, rx = 2) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${rx}" class="${c}"/>`;
const PL = (pts, w, c) => `<polyline points="${pts.map(p => r1(p[0]) + ',' + r1(p[1])).join(' ')}" stroke-width="${w}" class="${c}" fill="none"/>`;

function hlOf(exId) {
  const [p] = musclesOf(exId);
  const s = new Set(p);
  return {
    torso: ['pecho', 'dorsales', 'abdomen', 'oblicuos', 'lumbar', 'trapecio'].some(m => s.has(m)),
    ua: s.has('biceps') || s.has('triceps'), fa: s.has('antebrazos'), sh: s.has('hombros'),
    th: s.has('cuadriceps') || s.has('femorales') || s.has('aductores'), gl: s.has('gluteos'), shin: s.has('pantorrillas')
  };
}

// Resuelve un punto de anclaje: nombre de articulación o coordenada
function jointOf(J, name, view) {
  if (Array.isArray(name)) return name;
  if (view === 'f') {
    const m = { wr: J.aR.wr, wrL: J.aL.wr, el: J.aR.el, elL: J.aL.el, an: J.lR.an, anL: J.lL.an, kn: J.lR.kn, knL: J.lL.kn, sh: J.shR, shL: J.shL, pel: J.pel, top: J.top, head: J.head };
    return m[name] || J.pel;
  }
  const m = { wr: J.a.wr, wr2: J.a2.wr, el: J.a.el, el2: J.a2.el, hand: J.a.hand, hand2: J.a2.hand, an: J.l.an, an2: J.l2.an, kn: J.l.kn, kn2: J.l2.kn, toe: J.l.toe, sh: J.sh, hip: J.hip, head: J.head };
  return m[name] || J.hip;
}
function offAt(J, pr, view) {
  let p = jointOf(J, pr.at || 'wr', view);
  if (pr.off) p = [p[0] + pr.off[0], p[1] + pr.off[1]];
  if (pr.offT && view !== 'f') { const u = J.U, w = J.W; p = [p[0] + u[0] * pr.offT[0] + w[0] * pr.offT[1], p[1] + u[1] * pr.offT[0] + w[1] * pr.offT[1]]; }
  return p;
}

function drawProp(pr, J, q, view) {
  const k = pr.k;
  switch (k) {
    case 'plate': { const p = offAt(J, pr, view); const r = pr.r || 15; return CI(p, r, 'dm-pl') + CI(p, Math.max(2, r * 0.22), 'dm-eq'); }
    case 'db': { const p = offAt(J, pr, view); const r = pr.r || 6.5; return CI(p, r, 'dm-pl') + CI(p, 2, 'dm-eq'); }
    case 'kb': { const p = offAt(J, pr, view); return CI([p[0], p[1] + 9], 8, 'dm-pl') + `<path d="M${r1(p[0] - 5)} ${r1(p[1] + 4)}Q${r1(p[0])} ${r1(p[1] - 6)} ${r1(p[0] + 5)} ${r1(p[1] + 4)}" class="dm-st" stroke-width="2.5" fill="none"/>`; }
    case 'tower': { const x = pr.x, top = pr.top || 34; return RC(x - 8, top, 16, FLOOR - top, 'dm-eq2', 3) + RC(x - 5, FLOOR - 52 - (q.stack || 0), 10, 44, 'dm-pl', 1); }
    case 'cable': { const a = pr.from, b = offAt(J, pr, view); return CI(a, 4.5, 'dm-eq') + LN(a, b, 1.6, 'dm-cb') + (pr.handle === false ? '' : CI(b, 3, 'dm-pl')); }
    case 'bench': { const y = pr.y, x1 = pr.x1, x2 = pr.x2; return LN([x1 + 8, y + 4], [x1 + 8, FLOOR], 4, 'dm-st') + LN([x2 - 8, y + 4], [x2 - 8, FLOOR], 4, 'dm-st') + RC(x1, y, x2 - x1, 8, 'dm-pad', 3); }
    case 'seat': { const y = pr.y, x1 = pr.x1, x2 = pr.x2, mx = (x1 + x2) / 2; return LN([mx, y + 4], [mx, FLOOR], 5, 'dm-st') + LN([mx - 16, FLOOR - 1], [mx + 16, FLOOR - 1], 4, 'dm-st') + RC(x1, y, x2 - x1, 8, 'dm-pad', 3); }
    case 'line': return LN(pr.p1, pr.p2, pr.w || 4, pr.c || 'dm-st');
    case 'pad': { const a = pr.p1, b = pr.p2; return LN(a, b, pr.w || 9, 'dm-pad'); }
    case 'tpad': { // almohadilla que sigue al torso (respaldo)
      const u = J.U, w = J.W, h = J.hip, o = pr.off || -10;
      const p1 = [h[0] + u[0] * pr.a + w[0] * o, h[1] + u[1] * pr.a + w[1] * o], p2 = [h[0] + u[0] * pr.b + w[0] * o, h[1] + u[1] * pr.b + w[1] * o];
      return LN(p1, p2, pr.w || 9, 'dm-pad') + (pr.leg ? LN([(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2], [(p1[0] + p2[0]) / 2, FLOOR], 4, 'dm-st') : '');
    }
    case 'roll': { const p = offAt(J, pr, view); return CI(p, pr.r || 6, 'dm-pad'); }
    case 'lever': { const a = pr.pivot, b = offAt(J, pr, view); return LN(a, b, pr.w || 5, 'dm-st') + CI(a, 4, 'dm-eq2') + (pr.pad ? CI(b, pr.r || 6, 'dm-pad') : CI(b, 3.5, 'dm-pl')); }
    case 'bar': return LN([pr.x1, pr.y], [pr.x2, pr.y], 4, 'dm-st') + (pr.posts === false ? '' : LN([pr.x1 + 2, pr.y], [pr.x1 + 2, FLOOR], 4, 'dm-eq2') + LN([pr.x2 - 2, pr.y], [pr.x2 - 2, FLOOR], 4, 'dm-eq2'));
    case 'box': return RC(pr.x, pr.y, pr.w, FLOOR - pr.y, 'dm-box', 3);
    case 'rails': return LN([pr.x - 6, 30], [pr.x - 6, FLOOR], 3, 'dm-eq2') + LN([pr.x + 6, 30], [pr.x + 6, FLOOR], 3, 'dm-eq2');
    case 'landmine': { const a = pr.pivot, b = offAt(J, pr, view); const d = Math.hypot(b[0] - a[0], b[1] - a[1]); const e = [b[0] + (b[0] - a[0]) / d * 10, b[1] + (b[1] - a[1]) / d * 10]; return LN(a, e, 4, 'dm-st') + CI(a, 4, 'dm-eq2') + CI([b[0] + (b[0] - a[0]) / d * 4, b[1] + (b[1] - a[1]) / d * 4], 11, 'dm-pl'); }
    case 'rope': { const p = offAt(J, pr, view); const y = q.ry || p[1] + 60; return LN(p, [p[0], y], 1.4, 'dm-cb') + CI([p[0], y + 8], 9, 'dm-pl'); }
    case 'wheel': { const p = offAt(J, pr, view); return CI(p, 8, 'dm-pl') + CI(p, 2.5, 'dm-eq'); }
    case 'grip': { const p = offAt(J, pr, view); const g = q.g == null ? 1 : q.g; return `<path d="M${r1(p[0])} ${r1(p[1])}l${r1(10 * g + 3)} 14M${r1(p[0])} ${r1(p[1])}l-3 14" class="dm-st" stroke-width="3" fill="none"/>`; }
    case 'pinch': { const p = offAt(J, pr, view); return RC(p[0] - 2, p[1] - 4, 4, 30, 'dm-pl', 1); }
    case 'treadmill': return RC(30, 196, 170, 6, 'dm-pl', 3) + LN([196, 196], [206, 110], 4, 'dm-st') + LN([206, 110], [178, 104], 4, 'dm-st');
    case 'bike': { const c = pr.c; return LN(c, [96, 136], 5, 'dm-st') + LN([84, 134], [108, 134], 6, 'dm-pad') + LN(c, [150, 118], 5, 'dm-st') + LN([146, 116], [160, 116], 5, 'dm-st') + LN([c[0] - 30, FLOOR - 2], [c[0] + 40, FLOOR - 2], 5, 'dm-st') + LN(c, [c[0], FLOOR - 2], 5, 'dm-st') + CI(c, 9, 'dm-eq2') + (q.cr ? LN(q.cr[0], q.cr[1], 3, 'dm-pl') : ''); }
    case 'rower': return LN([20, 196], [230, 196], 5, 'dm-st') + CI([214, 178], 18, 'dm-eq2') + RC(J.hip[0] - 12, 170, 26, 7, 'dm-pad', 3) + LN([168, 186], [176, 196], 5, 'dm-st');
    case 'stairs': { const s = q.st || 0; return [0, 1, 2, 3].map(i => RC(120 + i * 0 - 50, 140 + i * 22 - s % 22, 80, 6, 'dm-pad', 2)).join('') + LN([150, 60], [150, FLOOR], 5, 'dm-eq2') + LN([150, 98], [128, 98], 4, 'dm-st'); }
    case 'jrope': { const a = J.aR.wr, b = J.aL.wr; const y = q.ropeY; return `<path d="M${r1(a[0])} ${r1(a[1])}C${r1(a[0] + 18)} ${r1(y)} ${r1(b[0] - 18)} ${r1(y)} ${r1(b[0])} ${r1(b[1])}" class="dm-cb" stroke-width="1.6" fill="none"/>`; }
    case 'barF': { // barra vista de frente: de mano a mano, con discos a los lados
      const a = J.aR.wr, b = J.aL.wr, y = (a[1] + b[1]) / 2, ext = pr.ext || 46;
      const xr = Math.max(a[0], b[0]) + ext, xl = Math.min(a[0], b[0]) - ext;
      return LN([xl - 6, y], [xr + 6, y], 4, 'dm-st') + RC(xr - 8, y - (pr.h || 20), 7, (pr.h || 20) * 2, 'dm-pl', 2) + RC(xl + 1, y - (pr.h || 20), 7, (pr.h || 20) * 2, 'dm-pl', 2);
    }
    case 'dbF': { const p = jointOf(J, pr.at || 'wr', 'f'); return LN([p[0] - 9, p[1]], [p[0] + 9, p[1]], 3, 'dm-st') + RC(p[0] - 11, p[1] - 6, 5, 12, 'dm-pl', 1.5) + RC(p[0] + 6, p[1] - 6, 5, 12, 'dm-pl', 1.5); }
    case 'dbV': { const p = jointOf(J, pr.at || 'wr', 'f'); return LN([p[0], p[1] - 9], [p[0], p[1] + 9], 3, 'dm-st') + RC(p[0] - 6, p[1] - 11, 12, 5, 'dm-pl', 1.5) + RC(p[0] - 6, p[1] + 6, 12, 5, 'dm-pl', 1.5); }
    case 'cableC': { const a = J.aR.wr, b = J.aL.wr, m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; return CI(pr.from, 4.5, 'dm-eq') + LN(pr.from, m, 1.6, 'dm-cb'); }
    case 'plat': { const p = offAt(J, pr, view), d = dv(pr.a), L = pr.len || 16; return LN([p[0] - d[0] * L, p[1] - d[1] * L], [p[0] + d[0] * L, p[1] + d[1] * L], 6, 'dm-pl'); }
    case 'hbar': { const a = J.aR.wr, b = J.aL.wr; return LN([Math.min(a[0], b[0]) - 4, (a[1] + b[1]) / 2], [Math.max(a[0], b[0]) + 4, (a[1] + b[1]) / 2], 4, 'dm-st'); }
    default: return '';
  }
}

function drawSide(def, q, hl) {
  const J = sideSkel(q);
  const props = def.p || [];
  const layer = l => props.filter(p => (p.l || (['tower', 'bench', 'seat', 'pad', 'tpad', 'bar', 'box', 'rails', 'treadmill', 'bike', 'rower', 'stairs', 'line'].includes(p.k) ? 'b' : p.k === 'plate' || p.k === 'landmine' ? 'm' : 'f')) === l).map(p => drawProp(p, J, q, 's')).join('');
  const c = (on, far) => on ? (far ? 'dm-h2' : 'dm-h') : (far ? 'dm-f2' : 'dm-f');
  let s = `<line x1="6" y1="${FLOOR + 3}" x2="234" y2="${FLOOR + 3}" class="dm-fl"/>` + layer('b');
  const limbArm = (a, far) => LN(J.sh, a.el, 9, c(hl.ua, far)) + LN(a.el, a.wr, 7.5, c(hl.fa, far)) + LN(a.wr, a.hand, 6, far ? 'dm-f2' : 'dm-f');
  const limbLeg = (l, far) => LN(J.hip, l.kn, 12, c(hl.th, far)) + LN(l.kn, l.an, 9.5, c(hl.shin, far)) + LN(l.an, l.toe, 6, far ? 'dm-f2' : 'dm-f');
  s += limbArm(J.a2, true) + limbLeg(J.l2, true) + layer('m');
  s += LN(J.hip, J.sh, 16, c(hl.torso, false)) + LN(J.sh, PT(J.sh, J.t + (q.hn || 0), 9), 7, 'dm-f') + CI(J.head, DL.head, 'dm-head');
  if (hl.gl) s += CI(J.hip, 8.5, 'dm-hc');
  s += limbLeg(J.l, false);
  if (hl.sh) s += CI(J.sh, 7, 'dm-hc');
  s += limbArm(J.a, false) + layer('f');
  return s;
}
function drawFront(def, q, hl) {
  const J = frontSkel(q);
  const props = def.p || [];
  const layer = l => props.filter(p => (p.l || (['tower', 'bench', 'seat', 'pad', 'bar', 'box', 'line'].includes(p.k) ? 'b' : 'f')) === l).map(p => drawProp(p, J, q, 'f')).join('');
  const c = on => on ? 'dm-h' : 'dm-f';
  let s = `<line x1="6" y1="${FLOOR + 3}" x2="234" y2="${FLOOR + 3}" class="dm-fl"/>` + layer('b');
  const leg = (h, l, side) => LN(h, l.kn, 12, c(hl.th)) + LN(l.kn, l.an, 9.5, c(hl.shin)) + LN(l.an, [l.an[0] + side * 7, l.an[1] + 2], 6, 'dm-f');
  s += leg(J.hpR, J.lR, 1) + leg(J.hpL, J.lL, -1);
  // torso como trapecio
  s += `<path d="M${r1(J.shL[0])} ${r1(J.shL[1])}L${r1(J.shR[0])} ${r1(J.shR[1])}L${r1(J.hpR[0])} ${r1(J.hpR[1])}L${r1(J.hpL[0])} ${r1(J.hpL[1])}Z" class="${hl.torso ? 'dm-hfill' : 'dm-ffill'}" stroke-width="8" stroke-linejoin="round"/>`;
  if (hl.gl) s += CI(J.hpR, 6.5, 'dm-hc') + CI(J.hpL, 6.5, 'dm-hc');
  s += LN(J.top, PT(J.top, J.t, 9), 7, 'dm-f') + CI(J.head, DL.head, 'dm-head');
  const arm = (sh, a) => LN(sh, a.el, 9, c(hl.ua)) + LN(a.el, a.wr, 7.5, c(hl.fa)) + CI(a.wr, 3.6, 'dm-hand');
  if (hl.sh) s += CI(J.shR, 6.5, 'dm-hc') + CI(J.shL, 6.5, 'dm-hc');
  s += arm(J.shR, J.aR) + arm(J.shL, J.aL) + layer('f');
  return s;
}

function poseAt(def, time) {
  if (def.fn) return def.fn(((time / (def.per || 1.6)) % 1 + 1) % 1);
  const K = def.k.map((k, i) => i === 0 ? k : { ...def.k[0], ...k });
  if (K.length === 1) return K[0];
  const mv = def.dur || 1.25, hold = def.hold != null ? def.hold : 0.35;
  if (K.length === 2) {
    const cyc = 2 * (mv + hold), u = time % cyc;
    if (u < hold) return K[0];
    if (u < hold + mv) return lerpPose(K[0], K[1], ease((u - hold) / mv));
    if (u < 2 * hold + mv) return K[1];
    return lerpPose(K[1], K[0], ease((u - 2 * hold - mv) / mv));
  }
  // varios fotogramas en ciclo
  const n = K.length, seg = mv + hold, u = time % (n * seg), i = Math.floor(u / seg), f = u - i * seg;
  const a = K[i], b = K[(i + 1) % n];
  return f < hold ? a : lerpPose(a, b, ease((f - hold) / mv));
}
function demoSvg(exId, time, cls = '') {
  const def = DEMOS[exId];
  if (!def) return '';
  const q = poseAt(def, time);
  const hl = hlOf(exId);
  const inner = def.v === 'f' ? drawFront(def, q, hl) : drawSide(def, q, hl);
  return `<svg class="demo-svg ${cls}" viewBox="0 0 240 214" role="img" aria-label="Demostración animada de ${esc(exById(exId).n)}">${inner}</svg>`;
}

// ---------- bucle de animación ----------
let demoRAF = null, demoT0 = performance.now();
const demoReduce = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
function demoTick(now) {
  demoRAF = null;
  const els = document.querySelectorAll('.demo[data-ex]');
  if (!els.length) return;
  for (const el of els) {
    if (el.dataset.paused === '1') continue;
    const last = +(el.dataset.last || 0);
    if (now - last < 33) continue; // ~30 fps
    el.dataset.last = now;
    const t = (now - demoT0) / 1000 + (+el.dataset.off || 0);
    el.querySelector('.demo-stage').innerHTML = demoSvg(el.dataset.ex, demoReduce ? 0 : t);
  }
  if (!demoReduce && document.visibilityState === 'visible') demoRAF = requestAnimationFrame(demoTick);
}
function startDemos() { if (!demoRAF) demoRAF = requestAnimationFrame(demoTick); }
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') startDemos(); });
A.demo = el => {
  const d = el.closest('.demo');
  if (!d) return;
  if (demoReduce) { // sin animación: alterna entre posición inicial y final
    const def = DEMOS[d.dataset.ex]; const end = d.dataset.end === '1' ? 0 : 1; d.dataset.end = end;
    const t = def.fn ? end * (def.per || 1.6) / 2 : end ? (def.hold || 0.35) + (def.dur || 1.25) + 0.01 : 0;
    d.querySelector('.demo-stage').innerHTML = demoSvg(d.dataset.ex, t);
    return;
  }
  d.dataset.paused = d.dataset.paused === '1' ? '0' : '1';
  d.querySelector('.demo-state').textContent = d.dataset.paused === '1' ? 'En pausa. Toca para seguir.' : 'Toca para pausar.';
  startDemos();
};
const EQUIP_ICON_TXT = { barra: 'Barra', mancuernas: 'Mancuernas', maquina: 'Máquina', polea: 'Polea', corporal: 'Peso corporal', kettlebell: 'Kettlebell', otro: 'Otro equipo' };
function howtoHtml(exId, { compact = false } = {}) {
  const def = DEMOS[exId], ex = exById(exId);
  if (!def) return '';
  const h = def.how || {};
  return `<div class="card howto">
    <div class="chart-h"><h3>Cómo se hace</h3><span class="eqchip">${esc(EQUIP_ICON_TXT[ex.e] || 'Equipo')}</span></div>
    <button class="demo" data-a="demo" data-ex="${esc(exId)}" aria-label="Pausar o seguir la animación"><div class="demo-stage">${demoSvg(exId, 0)}</div>
      <span class="demo-state muted">${demoReduce ? 'Toca para ver la posición final.' : 'Toca para pausar.'}</span></button>
    ${h.s ? `<ol class="steps">${h.s.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : ''}
    ${h.tip ? `<div class="tip-line"><b>Consejo:</b> ${esc(h.tip)}</div>` : ''}
  </div>`;
}
function howtoSheet(exId) {
  const ex = exById(exId);
  openSheet({ title: ex.n, body: howtoHtml(exId) || '<p class="sub">Este ejercicio no tiene demostración.</p>', onMount: () => startDemos() });
}
A['howto'] = el => howtoSheet(el.dataset.id);
