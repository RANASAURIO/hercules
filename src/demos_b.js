// =====================================================================
// Demostraciones (2/2): piernas, glúteos, abdomen y cardio
// =====================================================================
// ---------------- Cuádriceps ----------------
const BACKSQ = (x0 = {}, x1 = {}, props = []) => ({ p: [{ k: 'plate', at: 'sh', offT: [-3, -9], r: 16 }, ...props], k: [{ ...STAND(), t: 176, an: [114, GY], kd: [1, -0.1], wrT: [-3, -10], ed: [-0.6, 0.8], ...x0 }, { hip: [90, 158], t: 132, ...x1 }] });
DX('sentadilla', BACKSQ(), ['Coloca la barra sobre la parte alta de la espalda y los pies a la anchura de los hombros.', 'Baja llevando la cadera atrás y abajo, con las rodillas en la dirección de los pies, hasta que los muslos queden paralelos al piso o más.', 'Sube empujando el piso con todo el pie.'], 'Mantén el pecho arriba y los talones apoyados. La profundidad depende de tu movilidad.');
DX('sentadilla-smith', BACKSQ({}, { hip: [92, 158], t: 140 }, [{ k: 'rails', x: 112 }]), ['Coloca la barra de la máquina Smith sobre la espalda y adelanta un poco los pies.', 'Desbloquea y baja doblando rodillas y cadera.', 'Sube empujando con todo el pie y bloquea al terminar.'], 'Al adelantar los pies puedes bajar más recto y cargar más los cuádriceps.');
DX('sentadilla-frontal', { p: [{ k: 'plate', at: 'sh', offT: [-2, 9], r: 16 }], k: [{ ...STAND(), an: [114, GY], kd: [1, -0.1], wrT: [-1, 10], ed: [1, -0.2] }, { hip: [96, 160], t: 158 }] },
  ['Apoya la barra delante de los hombros con los codos altos.', 'Baja con el torso lo más vertical posible.', 'Sube manteniendo los codos arriba.'], 'Si los codos caen, la barra se va al frente: piensa en llevarlos hacia el techo.');
DX('sentadilla-goblet', { p: [DB()], k: [{ ...STAND(), an: [114, GY], kd: [1, -0.1], wrT: [-14, 12], ed: [0.2, 1] }, { hip: [94, 160], t: 150 }] },
  ['Sostén una mancuerna o kettlebell pegada al pecho.', 'Baja entre las piernas con el torso erguido.', 'Sube empujando con los talones.'], 'Es la mejor sentadilla para aprender la técnica.');
DX('sentadilla-hack', { p: [{ k: 'tpad', a: -6, b: 54, off: -11 }, { k: 'line', p1: [60, FLOOR], p2: [102, 56], w: 5 }, { k: 'roll', at: 'sh', offT: [2, 4], r: 6 }, { k: 'plat', at: 'toe', off: [0, 3], a: 90, len: 18 }],
  k: [{ hip: [104, 118], t: 196, an: [128, GY], kd: [1, -0.1], wrT: [-6, 6], ed: [1, 0.3] }, { hip: [112.8, 148.8] }] },
  ['Apoya la espalda en el respaldo y los hombros bajo las almohadillas, con los pies en la plataforma.', 'Desbloquea y baja doblando las rodillas.', 'Sube empujando con todo el pie.'], 'Pies más abajo en la plataforma trabajan más los cuádriceps.');
DX('sissy', { p: [{ k: 'line', p1: [160, 80], p2: [160, FLOOR], w: 5 }], k: [{ ...STAND(), an: [110, 194], toe: [123, 202], kd: [1, 0.2], wr2: [158, 104] }, { hip: [118, 150], t: 202 }] },
  ['Sujétate de un soporte, sube a las puntas de los pies.', 'Lleva las rodillas al frente y el cuerpo atrás en línea recta, desde las rodillas hasta la cabeza.', 'Vuelve a subir apretando los cuádriceps.'], 'Empieza con poco recorrido; exige mucho a las rodillas.');
const LEGPRESS = (k0, k1, props = []) => ({ p: [{ k: 'tpad', a: -10, b: 50, off: -11 }, { k: 'line', p1: [80, FLOOR], p2: [206, 76], w: 5 }, { k: 'line', p1: [60, 176], p2: [60, FLOOR], w: 4 }, { k: 'plat', at: 'an', off: [2, -2], a: 222, len: 18 }, ...props],
  k: [{ hip: [70, 170], t: 228, kd: [-0.4, -1], wr: [84, 178], ed: [0, 1], ...k0 }, k1] });
DX('prensa', LEGPRESS({ an: [140, 114], fd: 222 }, { an: [112, 136] }), ['Siéntate con la espalda bien apoyada y los pies en la plataforma a la anchura de la cadera.', 'Quita los seguros y baja la plataforma doblando las rodillas hacia el pecho.', 'Empuja hasta casi estirar las piernas, sin bloquear las rodillas.'], 'No dejes que la cadera se despegue del asiento al bajar.');
DX('prensa-unilateral', LEGPRESS({ an: [140, 114], fd: 222, an2: [96, 194], kd2: [0.4, -1] }, { an: [112, 136] }), ['Siéntate en la prensa y apoya un solo pie en el centro de la plataforma.', 'Baja doblando la rodilla de forma controlada.', 'Empuja hasta casi estirar la pierna y cambia de lado.'], 'Usa bastante menos peso que con las dos piernas.');
DX('talones-prensa', { p: [{ k: 'tpad', a: -10, b: 50, off: -11 }, { k: 'line', p1: [80, FLOOR], p2: [206, 76], w: 5 }, { k: 'plat', at: 'toe', off: [2, -2], a: 222, len: 18 }],
  k: [{ hip: [70, 170], t: 228, an: [144, 112], kd: [-0.4, -1], fd: 215, wr: [84, 178] }, { an: [140, 116], fd: 160 }], dur: 0.9 },
  ['Siéntate en la prensa con las piernas casi estiradas y solo la punta de los pies en el borde de la plataforma.', 'Empuja con las puntas extendiendo los tobillos.', 'Baja despacio hasta estirar las pantorrillas.'], 'No dobles las rodillas: el movimiento es solo del tobillo.');
DX('zancadas', { p: [DB()], k: [{ ...STAND(), an: [112, GY], toe: [124, 202], an2: [112, GY], toe2: [124, 202], kd: [1, -0.2], kd2: [0.5, 1] }, { hip: [108, 156], t: 178, an: [148, GY], toe: [160, 202], an2: [76, 190], toe2: [88, 202] }] },
  ['De pie con una mancuerna en cada mano.', 'Da un paso largo al frente y baja hasta que la rodilla de atrás casi toque el piso.', 'Empuja con el pie de adelante para volver.'], 'Las dos rodillas quedan a unos 90°; el torso, recto.');
DX('zancada-caminando', { p: [DB()], k: [{ ...STAND(), an: [112, GY], toe: [124, 202], an2: [112, GY], toe2: [124, 202], kd: [1, -0.2], kd2: [0.5, 1] }, { hip: [108, 156], t: 178, an: [148, GY], toe: [160, 202], an2: [76, 190], toe2: [88, 202] }] },
  ['Da un paso largo al frente y baja hasta casi tocar el piso con la rodilla de atrás.', 'Sube y trae la otra pierna adelante en el siguiente paso.', 'Avanza alternando piernas.'], 'Necesitas espacio: unos 10 metros libres son ideales.');
DX('sentadilla-bulgara', { p: [{ k: 'bench', x1: 22, x2: 82, y: 150 }, DB()], k: [{ hip: [106, 124], t: 176, an: [140, GY], kd: [1, -0.2], an2: [66, 142], toe2: [60, 150], kd2: [0.2, 1] }, { hip: [102, 158] }] },
  ['Apoya el empeine del pie de atrás en un banco y adelanta el otro pie.', 'Baja recto doblando la rodilla de adelante.', 'Sube empujando con el pie de adelante.'], 'Más lejos del banco trabajas más glúteo; más cerca, más cuádriceps.');
DX('extension-cuad', { p: [SEATP(64, 130), BACKP(-2, 50), { k: 'lever', pivot: [136, 158], at: 'an', pad: true, r: 6 }], k: [{ hip: [96, 158], t: 182, th: 90, sh: 2, wr: [104, 168], ed: [0, 1] }, { sh: 86 }] },
  ['Siéntate con la rodilla alineada con el eje de la máquina y el rodillo sobre los tobillos.', 'Estira las piernas hasta quedar rectas.', 'Baja despacio.'], 'Aprieta un segundo arriba y no dejes caer el peso.');

// ---------------- Femorales ----------------
DX('curl-femoral', { p: [{ k: 'bench', x1: 36, x2: 172, y: 160 }, { k: 'lever', pivot: [56, 152], at: 'an', off: [0, -6], pad: true, r: 6 }], k: [{ hip: [96, 152], t: 90, th: -88, sh: -92, wr: [156, 168], ed: [0, 1] }, { sh: -168 }] },
  ['Acuéstate boca abajo con el rodillo justo encima de los talones.', 'Dobla las rodillas llevando los talones hacia los glúteos.', 'Baja despacio sin que el peso toque la pila.'], 'No levantes la cadera del banco al subir.');
DX('curl-femoral-sent', { p: [SEATP(64, 128), BACKP(-2, 50), { k: 'roll', at: 'kn', off: [-10, -9], r: 6 }, { k: 'lever', pivot: [134, 158], at: 'an', off: [0, 6], pad: true, r: 6 }], k: [{ hip: [94, 158], t: 176, th: 90, sh: 84, wr: [104, 168], ed: [0, 1] }, { sh: -12 }] },
  ['Siéntate con las rodillas en el eje de la máquina y el rodillo bajo los tobillos.', 'Dobla las rodillas llevando el rodillo hacia abajo y atrás.', 'Regresa despacio.'], 'Inclinarte un poco al frente estira más los femorales.');
DX('curl-femoral-pie', { p: [{ k: 'line', p1: [146, 70], p2: [146, FLOOR], w: 5 }, { k: 'roll', at: 'an', off: [-6, 0], r: 6 }], k: [{ ...STAND(), th: 4, sh: 2, an2: [112, GY], wr: [142, 108], ed: [0, 1] }, { sh: -112 }] },
  ['Apoya una pierna bajo el rodillo y sujétate de la máquina.', 'Dobla la rodilla llevando el talón al glúteo.', 'Baja despacio y cambia de pierna.'], 'Mantén la cadera quieta; solo se mueve la rodilla.');
DX('curl-nordico', { p: [{ k: 'roll', at: [100, 198], r: 6, l: 'b' }, { k: 'roll', at: 'an', off: [0, -7], r: 6 }], k: [{ hip: [100, 154], t: 180, an: [62, 196], kd: [0.3, 1], wrT: [-28, 16], ed: [0, 1] }, { hip: [132.8, 171.1], t: 125 }] },
  ['Arrodíllate con los tobillos sujetos por un compañero o un soporte.', 'Déjate caer al frente con el cuerpo recto, frenando con los femorales.', 'Apóyate con las manos al final y vuelve a subir.'], 'Es muy exigente: haz pocas repeticiones y controla la bajada.');
const HINGE = (props, x0, x1) => ({ p: props, k: [{ ...STAND(), an: [112, GY], kd: [1, -0.1], ...x0 }, x1] });
DX('peso-muerto', HINGE([PB(19)], { wr: [113, 128], ed: [0, 1] }, { hip: [90, 156], t: 130, wr: [124, 182] }), ['Párate con la barra sobre la mitad del pie y tómala justo por fuera de las piernas.', 'Con la espalda recta y el pecho arriba, empuja el piso y sube la barra pegada a las piernas.', 'Baja llevando la cadera atrás y luego doblando las rodillas.'], 'La barra viaja en línea recta, siempre pegada al cuerpo. Nunca redondees la espalda.');
DX('peso-muerto-sumo', HINGE([PB(20)], { wr: [113, 128], ed: [0, 1] }, { hip: [96, 160], t: 150, wr: [120, 182] }), ['Abre los pies bastante más que los hombros con las puntas hacia afuera.', 'Toma la barra por dentro de las piernas y súbela con el pecho arriba.', 'Baja controlado.'], 'Empuja las rodillas hacia afuera durante todo el movimiento.');
DX('peso-muerto-rumano', HINGE([PB(18)], { wr: [113, 128], ed: [0, 1] }, { hip: [86, 126], t: 115, wr: [114, 166] }), ['De pie con la barra en las manos, rodillas un poco dobladas.', 'Lleva la cadera atrás bajando la barra pegada a las piernas hasta media tibia.', 'Sube empujando la cadera al frente.'], 'Las rodillas casi no cambian de ángulo; sentirás el estiramiento de los femorales.');
DX('peso-muerto-rigido', HINGE([PB(18)], { wr: [113, 128], ed: [0, 1] }, { hip: [92, 123], t: 100, wr: [124, 176] }), ['De pie con la barra en las manos y las piernas casi rectas.', 'Inclínate al frente bajando la barra pegada a las piernas.', 'Sube con la espalda recta.'], 'Baja solo hasta donde mantengas la espalda neutra.');

// ---------------- Glúteos ----------------
const THRUST = (props, plate) => {
  const s = [80, 140];
  return { p: [{ k: 'bench', x1: 18, x2: 84, y: 146 }, ...props, ...(plate ? [{ k: 'plate', at: 'hip', off: [2, -12], r: 16 }] : [])],
    k: [{ hip: [112, 178], t: tAt([112, 178], s), an: [150, GY], kd: [0.3, -1], wrH: [6, -12], ed: [0, -1] }, { hip: [118, 146], t: tAt([118, 146], s) }] };
};
DX('hip-thrust', THRUST([], true), ['Apoya la parte alta de la espalda en un banco con la barra sobre la cadera.', 'Con los pies firmes, sube la cadera hasta que el cuerpo quede recto de rodillas a hombros.', 'Baja controlado.'], 'Aprieta los glúteos arriba y mira al frente, no al techo. Usa una almohadilla en la barra.');
DX('hip-thrust-maq', THRUST([{ k: 'roll', at: 'hip', off: [0, -10], r: 7 }, { k: 'lever', pivot: [186, 120], at: 'hip', off: [0, -10] }], false), ['Apoya la espalda en el respaldo y coloca el cojín sobre la cadera.', 'Sube la cadera hasta alinear el cuerpo.', 'Baja despacio.'], 'Empuja con los talones y aprieta arriba un segundo.');
DX('puente-gluteo', { p: [], k: [{ hip: [104, 194], t: tAt([104, 194], [58, 194]), an: [140, GY], kd: [0.3, -1], ua: 90, fa: 90 }, { hip: [110, 168], t: tAt([110, 168], [64, 192]) }] },
  ['Acuéstate boca arriba con las rodillas dobladas y los pies apoyados.', 'Sube la cadera apretando los glúteos.', 'Baja despacio.'], 'Puedes poner un peso sobre la cadera para hacerlo más difícil.');
DX('patada-gluteo', { p: [{ k: 'tower', x: 198 }, { k: 'cable', from: [190, 196], at: 'an', handle: false }], k: [{ hip: [108, 121], t: 155, th: 4, sh: 4, an2: [112, GY], wr: [186, 110], ed: [0, 1] }, { th: -48, sh: -38 }] },
  ['Engancha la tobillera a la polea baja y sujétate de la máquina.', 'Lleva la pierna estirada hacia atrás apretando el glúteo.', 'Regresa despacio.'], 'No arquees la espalda baja al llevar la pierna atrás.');
DX('patada-maquina', { p: [{ k: 'pad', p1: [140, 152], p2: [180, 152], w: 8 }, { k: 'roll', at: 'kn2', off: [0, 6], r: 7 }, { k: 'roll', at: 'an', off: [-6, 0], r: 6 }], k: [{ hip: [96, 136], t: 95, wr: [170, 146], ed: [0, 1], th2: 2, sh2: -90, th: 40, sh: -60 }, { th: -82, sh: -100 }] },
  ['Apoya los antebrazos y una rodilla en la máquina, con el otro pie en la plataforma.', 'Empuja la plataforma hacia atrás y arriba estirando la pierna.', 'Regresa despacio.'], 'Mantén la espalda recta; el movimiento sale de la cadera.');
DX('step-up', { p: [{ k: 'box', x: 124, y: 166, w: 64 }, DB()], k: [{ hip: [104, 126], t: 176, an: [146, 162], toe: [158, 166], kd: [1, -0.2], an2: [100, GY], kd2: [1, 0] }, { hip: [140, 88], an2: [150, 140], kd2: [1, -0.5] }] },
  ['Párate frente a un cajón firme con un pie encima.', 'Sube empujando con el pie de arriba hasta quedar de pie sobre el cajón.', 'Baja despacio con la otra pierna.'], 'Empuja con la pierna de arriba, no te impulses con la de abajo.');
DX('abductores', { v: 'f', p: [{ k: 'pad', p1: [120, 96], p2: [120, 158], w: 30 }, { k: 'roll', at: 'kn', off: [7, 0], r: 6 }, { k: 'roll', at: 'knL', off: [-7, 0], r: 6 }], k: [{ pel: [120, 150], thl: 0.35, an: [128, GY], kd: [1, -0.3], wr: [152, 150] }, { an: [164, 194] }] },
  ['Siéntate con la parte externa de las rodillas contra los cojines.', 'Abre las piernas empujando hacia afuera.', 'Ciérralas despacio sin que el peso choque.'], 'Inclinarte un poco al frente trabaja más el glúteo medio.');
DX('abduccion-polea', { v: 'f', p: [{ k: 'tower', x: 22 }, { k: 'cable', from: [30, 196], at: 'an', handle: false }], k: [{ pel: [114, 121], an: [124, GY], anL: [106, GY], wrL: [40, 112], kd: [0.2, 0] }, { an: [162, 188] }] },
  ['Engancha la tobillera en la pierna más lejana a la polea baja y sujétate.', 'Lleva la pierna estirada hacia el lado.', 'Regresa despacio.'], 'Mantén el torso derecho; no te inclines para subir más.');

// ---------------- Aductores ----------------
DX('aductores', { v: 'f', p: [{ k: 'pad', p1: [120, 96], p2: [120, 158], w: 30 }, { k: 'roll', at: 'kn', off: [-6, 0], r: 6 }, { k: 'roll', at: 'knL', off: [6, 0], r: 6 }], k: [{ pel: [120, 150], thl: 0.35, an: [164, 194], kd: [1, -0.3], wr: [152, 150] }, { an: [128, GY] }] },
  ['Siéntate con la parte interna de las rodillas contra los cojines y las piernas abiertas.', 'Cierra las piernas apretando.', 'Ábrelas despacio.'], 'Abre solo hasta donde sientas un estiramiento cómodo.');
DX('aductor-polea', { v: 'f', p: [{ k: 'tower', x: 218 }, { k: 'cable', from: [210, 196], at: 'an', handle: false }], k: [{ pel: [114, 121], an: [160, 190], anL: [106, GY], wr: [206, 112], kd: [0.2, 0] }, { an: [112, 194] }] },
  ['Engancha la tobillera en la pierna más cercana a la polea baja.', 'Cruza la pierna por delante de la otra.', 'Regresa despacio.'], 'Movimiento lento y controlado; no uses impulso.');
DX('sentadilla-sumo', { p: [{ k: 'kb', at: 'wr' }], k: [{ ...STAND(), an: [114, GY], kd: [1, -0.1], wrS: [2, 46], ed: [0, 1] }, { hip: [100, 160], t: 162 }] },
  ['Abre los pies bastante más que los hombros con las puntas hacia afuera.', 'Sostén una mancuerna o kettlebell entre las piernas y baja con el torso erguido.', 'Sube apretando glúteos y aductores.'], 'Empuja las rodillas hacia afuera, en la dirección de los pies.');
const SIDEP = (feet, extra = {}) => {
  const top = [84, 166];
  return { v: 'f', p: feet.props, k: [{ pel: [128, 186], t: tAt([128, 186], top), wrL: [102, 200], edL: [0, 1], wr: [126, 168], ed: [0, -1], ...feet.legs, ...extra }, { pel: [128, 166], t: tAt([128, 166], top) }] };
};
DX('copenhague', SIDEP({ props: [{ k: 'bench', x1: 182, x2: 234, y: 152 }], legs: { an: [206, 150], anL: [200, 190], kd: [0, -1], kdL: [0, 1] } }),
  ['Recuéstate de lado apoyando el antebrazo en el piso y la pierna de arriba sobre un banco.', 'Levanta la cadera hasta alinear el cuerpo; la pierna de abajo queda libre.', 'Aguanta el tiempo marcado o sube y baja la cadera.'], 'Apoya la rodilla en el banco en lugar del tobillo para hacerlo más fácil.');

// ---------------- Pantorrillas ----------------
DX('talones-pie', { p: [DB()], k: [{ ...STAND(), an: [112, GY], toe: [125, 202] }, { hip: [112, 111.5], an: [112, 189] }], dur: 0.8 },
  ['De pie, con la punta de los pies en un escalón o en el piso.', 'Sube los talones lo más alto que puedas.', 'Baja despacio hasta estirar las pantorrillas.'], 'Aguanta un segundo arriba y otro abajo; nada de rebotes.');
DX('talones-sentado', { p: [SEATP(64, 110), { k: 'roll', at: 'kn', off: [0, -8], r: 7 }, { k: 'lever', pivot: [176, 150], at: 'kn', off: [0, -8] }], k: [{ ...SEAT(), an: [134, 196], toe: [146, 202], kd: [1, -1], wr: [128, 150] }, { an: [134, 187] }], dur: 0.8 },
  ['Siéntate con las rodillas bajo el cojín y la punta de los pies en la plataforma.', 'Sube los talones lo más alto posible.', 'Baja despacio hasta estirar.'], 'Esta versión trabaja más el sóleo, el músculo bajo el gemelo.');
DX('talones-una', { p: [{ k: 'box', x: 100, y: 186, w: 40 }, { k: 'line', p1: [156, 80], p2: [156, FLOOR], w: 5 }, DB()], k: [{ hip: [112, 111], t: 180, an: [112, 189], toe: [124, 184], th2: 0, sh2: -80, wr2: [152, 98] }, { hip: [112, 100], an: [112, 178] }], dur: 0.8 },
  ['Párate en un escalón con un solo pie y sujétate de algo.', 'Baja el talón por debajo del escalón y luego súbelo lo más alto posible.', 'Haz todas las repeticiones y cambia de pie.'], 'Una pierna a la vez duplica la carga sin necesitar mucho peso.');
DX('tibial', { p: [{ k: 'line', p1: [80, 30], p2: [80, FLOOR], w: 6 }], k: [{ hip: [98, 124], t: 190, an: [124, GY], kd: [1, -0.1], toe: [136, 202] }, { toe: [133, 188] }], dur: 0.7 },
  ['Apoya la espalda en una pared con los pies un paso adelante.', 'Levanta las puntas de los pies manteniendo los talones en el piso.', 'Bájalas despacio.'], 'Fortalece la parte de adelante de la pierna y ayuda a prevenir molestias en las espinillas.');

// ---------------- Abdomen y oblicuos ----------------
DX('plancha', { p: [], k: [{ ...PUSH(9, [44, 194], [166, 204]), ua: 0, fa: 90 }, { ...PUSH(10.5, [44, 194], [166, 204]), ua: 0, fa: 90 }], dur: 1.6 },
  ['Apoya los antebrazos en el piso con los codos bajo los hombros.', 'Estira las piernas y forma una línea recta de cabeza a talones.', 'Aguanta el tiempo marcado respirando normal.'], 'Aprieta glúteos y abdomen; ni la cadera arriba ni hundida.');
DX('plancha-lateral', SIDEP({ props: [], legs: { an: [206, 196], anL: [204, 200], kd: [0, -1], kdL: [0, 1] } }),
  ['Acuéstate de lado apoyado en un antebrazo, con el codo bajo el hombro.', 'Levanta la cadera hasta formar una línea recta.', 'Aguanta el tiempo marcado y cambia de lado.'], 'Apoya la rodilla de abajo para hacerlo más fácil.');
DX('crunch', { p: [], k: [{ hip: [92, 190], t: 90, sup: 1, an: [58, GY], kd: [0, -1], wrT: [-12, 9], ed: [0, -1] }, { t: 122 }] },
  ['Acuéstate boca arriba con las rodillas dobladas y las manos en el pecho.', 'Despega los hombros del piso encogiendo el abdomen.', 'Baja despacio sin apoyar del todo la cabeza.'], 'Exhala al subir; el recorrido es corto.');
DX('crunch-polea', { p: [{ k: 'tower', x: 160, top: 18 }, { k: 'cable', from: [152, 26], at: 'wr' }], k: [{ hip: [120, 156], t: 172, an: [84, 198], kd: [0.6, 1], wrT: [4, 10], ed: [1, -0.3] }, { t: 92 }] },
  ['Arrodíllate frente a la polea alta y sostén la cuerda junto a la cabeza.', 'Encoge el abdomen llevando los codos hacia los muslos.', 'Sube despacio.'], 'La cadera no se mueve: es el abdomen el que se dobla.');
DX('elev-piernas', { p: [{ k: 'bar', x1: 76, x2: 162, y: 46 }], k: [{ hip: [118, 146], t: 180, wr: [118, 48], th: 2, sh: 2 }, { th: 94, sh: 88 }] },
  ['Cuélgate de la barra con los brazos estirados.', 'Sube las piernas al frente hasta la altura de la cadera o más.', 'Bájalas despacio sin balancearte.'], 'Dobla las rodillas si todavía no puedes con las piernas rectas.');
DX('elev-piernas-suelo', { p: [], k: [{ hip: [118, 194], t: 90, sup: 1, ua: -90, fa: -90, th: -91, sh: -91 }, { th: -176, sh: -176 }] },
  ['Acuéstate boca arriba con las piernas estiradas y las manos a los lados.', 'Sube las piernas juntas hasta la vertical.', 'Bájalas despacio sin que la espalda baja se despegue del piso.'], 'Si la espalda se arquea, no bajes tanto las piernas.');
DX('rueda', { p: [{ k: 'wheel', at: 'wr', off: [0, 4] }], k: [{ hip: [96, 158], t: 122, an: [54, 198], kd: [0.4, 1], wr: [128, 188], ed: [0, 1] }, { hip: [118, 174], t: 97, wr: [206, 188] }], dur: 1.6 },
  ['De rodillas, toma la rueda con las manos bajo los hombros.', 'Rueda al frente estirando el cuerpo lo que puedas sin hundir la espalda.', 'Vuelve encogiendo el abdomen.'], 'Empieza con recorridos cortos; aumenta poco a poco.');
DX('russian-twist', { v: 'f', p: [{ k: 'plate', at: 'wr', off: [-4, 0], r: 8 }], k: [
  { pel: [120, 172], tl: 0.85, thl: 0.6, an: [140, 186], anL: [100, 186], kd: [0.5, -1], wr: [124, 150], wrL: [116, 150], ed: [1, 0.6], t: 180 },
  { wr: [158, 160], wrL: [150, 158], t: 172 }, { wr: [124, 150], wrL: [116, 150], t: 180 }, { wr: [90, 158], wrL: [82, 160], t: 188 }], dur: 0.6, hold: 0.1 },
  ['Siéntate con las rodillas dobladas y el torso inclinado atrás, con un peso en las manos.', 'Gira el torso llevando el peso a un lado.', 'Gira al otro lado de forma controlada.'], 'Gira desde el torso, no solo moviendo los brazos. Levanta los pies para hacerlo más difícil.');
DX('crunch-inverso', { p: [], k: [{ hip: [104, 192], t: 90, sup: 1, ua: -90, fa: -90, th: -150, sh: -90 }, { hip: [100, 186], t: 84, th: -205, sh: -120 }] },
  ['Acuéstate boca arriba con las rodillas dobladas y los pies en el aire.', 'Lleva las rodillas al pecho despegando la cadera del piso.', 'Baja despacio.'], 'Usa el abdomen, no el impulso de las piernas.');
DX('dead-bug', { p: [], k: [
  { hip: [110, 194], t: 90, sup: 1, ua: 180, fa: 180, ua2: 180, fa2: 180, th: -180, sh: -90, th2: -180, sh2: -90 },
  { ua: 96, fa: 96, th2: -96, sh2: -96 }, { ua: 180, fa: 180, th2: -180, sh2: -90 }, { ua2: 96, fa2: 96, th: -96, sh: -96 }], dur: 1, hold: 0.3 },
  ['Acuéstate boca arriba con los brazos hacia el techo y las rodillas dobladas a 90°.', 'Estira a la vez un brazo atrás y la pierna contraria al frente.', 'Vuelve al centro y cambia de lado.'], 'Mantén la espalda baja pegada al piso todo el tiempo.');
DX('hollow', { p: [], k: [{ hip: [112, 190], t: 98, sup: 1, ua: 100, fa: 100, th: -100, sh: -100 }, { t: 101, ua: 103, fa: 103, th: -103, sh: -103 }], dur: 1.4 },
  ['Acuéstate boca arriba con brazos y piernas estirados.', 'Despega del piso hombros y piernas formando una curva suave.', 'Aguanta con la espalda baja pegada al piso.'], 'Si cuesta, dobla las rodillas o acerca los brazos al cuerpo.');
DX('v-ups', { p: [], k: [{ hip: [112, 192], t: 90, sup: 1, ua: 90, fa: 90, th: -90, sh: -90 }, { t: 135, ua: 220, fa: 220, th: -135, sh: -135 }] },
  ['Acuéstate boca arriba con brazos y piernas estirados.', 'Sube a la vez torso y piernas intentando tocar los pies con las manos.', 'Baja despacio.'], 'Exige mucho; empieza con pocas repeticiones bien hechas.');
DX('abd-maquina', { p: [SEATP(66, 110), BACKP(-2, 40), { k: 'lever', pivot: [96, 30], at: 'sh', offT: [-4, 10], pad: true, r: 6 }], k: [{ ...SEAT(), t: 178, wrT: [-6, 9], ed: [1, 0.2] }, { t: 132 }] },
  ['Siéntate con el pecho contra los cojines y sujeta los agarres.', 'Encoge el abdomen llevando el torso hacia los muslos.', 'Vuelve despacio.'], 'Exhala al bajar el torso; no jales con los brazos.');
DX('lenador', { v: 'f', p: [{ k: 'tower', x: 218 }, { k: 'cable', from: [212, 44], at: 'wr' }], k: [{ pel: [120, 121], t: 172, an: [138, GY], anL: [102, GY], kd: [0.6, -0.2], wr: [188, 62], wrL: [182, 68] }, { pel: [116, 130], t: 190, wr: [88, 150], wrL: [82, 146] }] },
  ['De lado a la polea alta, toma el agarre con las dos manos por encima del hombro.', 'Gira el torso llevando las manos en diagonal hacia la rodilla contraria.', 'Regresa despacio.'], 'Gira con el torso y la cadera a la vez; los brazos solo guían.');
DX('pallof', { p: [{ k: 'tower', x: 30 }, { k: 'cable', from: [38, 98], at: 'wr' }], k: [{ ...STAND(), wrS: [12, 24], ed: [0, 1] }, { wrS: [50, 22] }] },
  ['De lado a la polea a la altura del pecho, sostén el agarre pegado al pecho.', 'Estira los brazos al frente sin dejar que la polea te gire.', 'Vuelve al pecho y repite.'], 'Es un ejercicio de anti-rotación: el torso no debe moverse.');
DX('incl-lateral', { v: 'f', p: [{ k: 'dbF', at: 'wr' }], k: [{ pel: [120, 121], t: 186, wrS: [4, 52], wrL: [98, 110], edL: [-1, 0] }, { t: 166 }] },
  ['De pie, con una mancuerna en una mano y la otra en la cadera.', 'Inclina el torso hacia el lado de la mancuerna.', 'Sube usando el costado contrario y cambia de lado al terminar.'], 'Inclínate solo hacia los lados, sin ir al frente ni atrás.');
DX('crunch-bici', { p: [], k: [{ hip: [104, 190], t: 108, sup: 1, wrT: [4, 6], ed: [1, -0.3], th: 160, sh: -110, th2: -100, sh2: -100 }, { t: 112, th: -100, sh: -100, th2: 160, sh2: -110 }], dur: 0.8, hold: 0.15 },
  ['Acuéstate boca arriba con las manos junto a la cabeza y los hombros despegados.', 'Lleva un codo hacia la rodilla contraria mientras estiras la otra pierna.', 'Alterna de lado como si pedalearas.'], 'No jales el cuello con las manos.');

// ---------------- Cardio ----------------
const WALK = p => {
  const a = 2 * Math.PI * p, b = a + Math.PI;
  const leg = x => ({ th: 24 * Math.sin(x), sh: 24 * Math.sin(x) - 34 * Math.max(0, -Math.cos(x)) });
  const l1 = leg(a), l2 = leg(b);
  return { hip: [108, 121 + 1.5 * Math.cos(2 * a)], t: 178, th: l1.th, sh: l1.sh, th2: l2.th, sh2: l2.sh, ua: -22 * Math.sin(a), fa: -22 * Math.sin(a) + 40, ua2: 22 * Math.sin(a), fa2: 22 * Math.sin(a) + 40 };
};
DX('cinta', { p: [{ k: 'treadmill' }], fn: WALK, per: 1.1 },
  ['Sube a la caminadora y empieza a baja velocidad.', 'Aumenta la velocidad o la inclinación poco a poco.', 'Al terminar, baja la velocidad unos minutos antes de bajarte.'], 'Camina con inclinación si quieres más intensidad sin correr.');
const PEDAL = p => {
  const a = 2 * Math.PI * p, c = [124, 172], r = 15;
  const p1 = [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)], p2 = [c[0] - r * Math.cos(a), c[1] - r * Math.sin(a)];
  return { hip: [96, 128], t: 150, an: p1, an2: p2, kd: [1, -0.3], wr: [150, 116], ed: [0, 1], fd: 90, cr: [p1, p2] };
};
DX('bicicleta', { p: [{ k: 'bike', c: [124, 172] }], fn: PEDAL, per: 1.1 },
  ['Ajusta el sillín para que la rodilla quede casi estirada abajo.', 'Pedalea a un ritmo que puedas mantener.', 'Sube o baja la resistencia según el plan.'], 'Mantén la espalda recta y los hombros relajados.');
const ELLIP = p => {
  const a = 2 * Math.PI * p, c = [114, 186];
  return { hip: [110, 118 + 2 * Math.sin(2 * a)], t: 176, an: [c[0] + 20 * Math.cos(a), c[1] + 7 * Math.sin(a)], an2: [c[0] - 20 * Math.cos(a), c[1] - 7 * Math.sin(a)], kd: [1, -0.1], wr: [150 + 10 * Math.cos(a), 98], wr2: [150 - 10 * Math.cos(a), 98], ed: [0, 1] };
};
DX('eliptica', { p: [{ k: 'line', p1: [60, 200], p2: [180, 200], w: 6 }, { k: 'lever', pivot: [146, 196], at: 'wr' }, { k: 'lever', pivot: [146, 196], at: 'wr2' }], fn: ELLIP, per: 1.3 },
  ['Sube a la elíptica y toma los agarres móviles.', 'Empuja y jala con brazos y piernas a la vez, en un movimiento continuo.', 'Ajusta la resistencia para mantener el ritmo.'], 'Mantén todo el pie apoyado en el pedal.');
DX('remo-ergo', { p: [{ k: 'rower' }, { k: 'cable', from: [200, 172], at: 'wr' }], k: [{ hip: [104, 166], t: 150, an: [150, 172], toe: [158, 162], kd: [0.3, -1], wr: [170, 160], ed: [-1, 0.3] }, { hip: [64, 166], t: 200, wr: [98, 140] }], dur: 0.9, hold: 0.15 },
  ['Siéntate con los pies sujetos y toma el agarre con los brazos estirados.', 'Empuja primero con las piernas, luego inclínate un poco atrás y jala hacia el abdomen.', 'Regresa en orden inverso: brazos, torso y piernas.'], 'La fuerza sale sobre todo de las piernas, no de los brazos.');
const STEP = p => {
  const a = 2 * Math.PI * p;
  return { hip: [110, 118 + 2 * Math.sin(2 * a)], t: 172, an: [114, 186 + 9 * Math.sin(a)], an2: [118, 186 - 9 * Math.sin(a)], kd: [1, -0.2], wr: [136, 102], ed: [0, 1] };
};
const STEPP = [{ k: 'lever', pivot: [60, 200], at: 'an' }, { k: 'lever', pivot: [60, 200], at: 'an2' }, { k: 'line', p1: [150, 70], p2: [150, FLOOR], w: 5 }, { k: 'line', p1: [150, 102], p2: [132, 102], w: 4 }];
DX('escaladora', { p: STEPP, fn: STEP, per: 1.1 }, ['Sube a la escaladora y sujétate de los agarres sin apoyar el peso en ellos.', 'Da pasos completos, empujando con todo el pie.', 'Mantén un ritmo constante.'], 'Si te apoyas mucho en los brazos, baja la velocidad.');
DX('escaleras', { p: STEPP, fn: STEP, per: 1.1 }, ['Sube a la máquina de escaleras o al stepper.', 'Da pasos completos con el torso erguido.', 'Mantén el ritmo que te permita hablar con algo de esfuerzo.'], 'Sujétate solo para equilibrarte.');
DX('cuerda', { v: 'f', p: [{ k: 'jrope' }], fn: p => {
  const a = 2 * Math.PI * p, h = 6 * Math.max(0, Math.sin(a));
  return { pel: [120, 121 - h], an: [126, GY - h], anL: [114, GY - h], wr: [148, 130 - h], wrL: [92, 130 - h], ed: [1, 0.3], ropeY: 120 - 100 * Math.cos(a) - h };
}, per: 0.55 },
  ['Toma la cuerda con los codos cerca del cuerpo.', 'Gírala con las muñecas y salta solo lo suficiente para que pase.', 'Aterriza suave sobre la punta de los pies.'], 'Saltos bajos y rápidos; los brazos casi no se mueven.');
