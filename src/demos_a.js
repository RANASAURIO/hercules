// =====================================================================
// Demostraciones (1/2): pecho, espalda, hombros, brazos y antebrazos
// =====================================================================
const DEMOS = {};
const DX = (id, def, steps, tip) => { def.how = { s: steps, tip }; DEMOS[id] = def; };
const X0 = 112;
const STAND = (o = {}) => Object.assign({ hip: [X0 + (o.dx || 0), 120.5 + (o.dy || 0)], t: 180 - (o.lean || 0), an: [X0, GY] }, o.x || {});
const SEAT = (o = {}) => Object.assign({ hip: [92, 160], t: 180 - (o.lean || 0), an: [136, GY], kd: [1, -0.2] }, o.x || {});
const SUPB = (o = {}) => Object.assign({ hip: [80, 145], t: 90, sup: 1, an: [52, GY], kd: [0, -1] }, o.x || {});
const INCL = (o = {}) => Object.assign({ hip: [92, 152], t: 135, sup: 1, an: [50, GY], kd: [-0.3, -1] }, o.x || {});
const tAt = (hip, sh) => Math.round(angTo(hip, sh) * 10) / 10;
const BENCHF = { k: 'bench', x1: 56, x2: 150, y: 153 };
const PB = (r = 15, at = 'wr') => ({ k: 'plate', at, r });
const DB = (at = 'wr') => ({ k: 'db', at });
const SEATP = (x1 = 70, x2 = 112) => ({ k: 'seat', x1, x2, y: 167 });
const BACKP = (a = -2, b = 52) => ({ k: 'tpad', a, b, off: -11, leg: true });
// flexión de brazos: ángulo del cuerpo phi (grados) con los pies fijos
const PUSH = (phi, an = [50, 196], hand = [167, 200], sup = 0) => {
  const c = Math.cos(phi * D2R), s = Math.sin(phi * D2R);
  const hip = [an[0] + 78 * c, an[1] - 78 * s], sh = [an[0] + 124 * c, an[1] - 124 * s];
  const o = { hip, t: tAt(hip, sh), an, wr: hand, ed: [-1, -0.6] };
  if (sup) o.sup = 1;
  return o;
};

// ---------------- Pecho ----------------
DX('press-banca', { p: [BENCHF, PB(16)], k: [{ ...SUPB(), wrS: [0, -50], ed: [0, 1], uaL: 1 }, { wrS: [-4, -14], uaL: 0.45 }] },
  ['Acuéstate en el banco con los ojos bajo la barra y los pies firmes en el piso.', 'Toma la barra un poco más ancho que los hombros y bájala controlada hasta la parte baja del pecho.', 'Empuja hacia arriba hasta estirar los brazos sin despegar la espalda alta del banco.'],
  'Junta un poco los omóplatos y mantén los codos a unos 45° del cuerpo para cuidar los hombros.');
DX('press-cerrado', { p: [BENCHF, PB(16)], k: [{ ...SUPB(), wrS: [0, -50], ed: [0, 1], uaL: 1 }, { wrS: [-6, -14], uaL: 0.45 }] },
  ['Acuéstate en el banco y toma la barra con las manos a la anchura de los hombros.', 'Baja la barra hacia la parte baja del pecho con los codos pegados al cuerpo.', 'Empuja hasta estirar los brazos, sintiendo el trabajo en los tríceps.'],
  'No cierres demasiado el agarre: más estrecho que los hombros carga las muñecas.');
DX('press-smith', { p: [BENCHF, { k: 'rails', x: 126 }, PB(16)], k: [{ ...SUPB(), wrS: [0, -50], ed: [0, 1], uaL: 1 }, { wrS: [0, -14], uaL: 0.45 }] },
  ['Coloca el banco para que la barra baje sobre la parte baja del pecho.', 'Desbloquea la barra girando las muñecas y bájala controlada.', 'Empuja hasta arriba y vuelve a bloquearla al terminar la serie.'],
  'La guía hace el recorrido fijo: ajusta bien el banco antes de cargar peso.');
DX('press-banca-manc', { p: [BENCHF, DB()], k: [{ ...SUPB(), wrS: [0, -50], ed: [0, 1], uaL: 1 }, { wrS: [-2, -14], uaL: 0.45 }] },
  ['Acuéstate con una mancuerna en cada mano apoyadas sobre los muslos y súbelas al pecho al recostarte.', 'Baja las mancuernas a los lados del pecho con los codos a unos 45°.', 'Empuja hacia arriba juntándolas un poco sobre el pecho.'],
  'Baja hasta sentir el estiramiento del pecho, sin que los codos pasen muy por debajo del banco.');
DX('press-inclinado', { p: [SEATP(70, 104), { k: 'tpad', a: -4, b: 54, off: -11, leg: true }, PB(16)], k: [{ ...INCL(), wrS: [2, -50], ed: [0, 1], uaL: 1 }, { wrS: [-2, -14], uaL: 0.45 }] },
  ['Ajusta el banco a unos 30-45° y siéntate con la espalda bien apoyada.', 'Baja la barra hasta la parte alta del pecho, cerca de las clavículas.', 'Empuja en vertical hasta estirar los brazos.'],
  'Más inclinación pasa el trabajo a los hombros; 30° suele ser suficiente para el pecho alto.');
DX('press-incl-manc', { p: [SEATP(70, 104), { k: 'tpad', a: -4, b: 54, off: -11, leg: true }, DB()], k: [{ ...INCL(), wrS: [2, -50], ed: [0, 1], uaL: 1 }, { wrS: [-2, -14], uaL: 0.45 }] },
  ['Siéntate en el banco inclinado con una mancuerna en cada mano a la altura del pecho alto.', 'Empuja las mancuernas hacia arriba hasta estirar los brazos.', 'Bájalas despacio a los lados del pecho alto.'],
  'Mantén las muñecas rectas, encima de los codos.');
DX('press-declinado', { p: [{ k: 'tpad', a: -20, b: 60, off: -11 }, { k: 'line', p1: [70, 160], p2: [70, FLOOR], w: 4 }, { k: 'roll', at: [56, 172], r: 6, l: 'b' }, PB(16)],
  k: [{ hip: [82, 138], t: 72, sup: 1, an: [58, 176], kd: [0, -1], wrS: [0, -50], ed: [0, 1], uaL: 1 }, { wrS: [-3, -14], uaL: 0.45 }] },
  ['Sujeta los pies bajo los rodillos y recuéstate con la cabeza más baja que la cadera.', 'Baja la barra hacia la parte baja del pecho.', 'Empuja hasta estirar los brazos.'],
  'Pide ayuda para sacar y dejar la barra: en declinado es más difícil.');
DX('aperturas', { v: 'f', p: [{ k: 'box', x: 100, y: 146, w: 40 }, { k: 'dbV', at: 'wr' }, { k: 'dbV', at: 'wrL' }],
  k: [{ pel: [120, 140], tl: 0.3, hl: 0.4, thl: 0.5, an: [150, GY], wr: [131, 84], ed: [0.7, 0.7] }, { wr: [194, 130] }] },
  ['Acuéstate en el banco con las mancuernas arriba del pecho y los codos un poco doblados.', 'Abre los brazos en arco hasta que las manos queden a la altura del pecho.', 'Cierra el arco hasta juntar las mancuernas arriba, como si abrazaras un árbol.'],
  'Mantén la misma flexión de codo todo el recorrido; si los doblas, se convierte en un press.');
DX('cruce-poleas', { v: 'f', p: [{ k: 'tower', x: 20 }, { k: 'tower', x: 220 }, { k: 'cable', from: [214, 42], at: 'wr' }, { k: 'cable', from: [26, 42], at: 'wrL' }],
  k: [{ pel: [120, 121], wr: [192, 72], ed: [1, 0.3] }, { wr: [128, 138] }] },
  ['Con las poleas altas, toma un agarre en cada mano y da un paso al frente.', 'Inclina un poco el torso y lleva las manos hacia abajo y al centro, delante de la cadera.', 'Regresa despacio hasta sentir el estiramiento del pecho.'],
  'Piensa en juntar los codos, no las manos, y aprieta el pecho al final.');
DX('aperturas-polea-baja', { v: 'f', p: [{ k: 'tower', x: 20 }, { k: 'tower', x: 220 }, { k: 'cable', from: [26, 192], at: 'wrL' }, { k: 'cable', from: [214, 192], at: 'wr' }],
  k: [{ pel: [120, 121], wr: [190, 150], ed: [1, 0.2] }, { wr: [130, 92] }] },
  ['Con las poleas abajo, toma un agarre en cada mano y párate en el centro.', 'Sube las manos en arco hacia el centro hasta la altura del pecho.', 'Baja despacio volviendo a abrir los brazos.'],
  'Esta variante enfoca el pecho alto: termina con las manos a la altura de la barbilla o un poco más abajo.');
DX('press-maquina', { p: [SEATP(68, 110), BACKP(), { k: 'lever', pivot: [64, 40], at: 'wr' }], k: [{ ...SEAT(), wrS: [16, 8], ed: [-0.4, 1] }, { wrS: [50, 6] }] },
  ['Ajusta el asiento para que los agarres queden a la altura de la mitad del pecho.', 'Empuja los agarres al frente hasta casi estirar los brazos.', 'Regresa despacio sin dejar que el peso toque el resto de la pila.'],
  'Mantén la espalda pegada al respaldo y los hombros abajo.');
DX('press-incl-maq', { p: [SEATP(68, 110), BACKP(), { k: 'lever', pivot: [64, 30], at: 'wr' }], k: [{ ...SEAT(), wrS: [14, 6], ed: [-0.4, 1] }, { wrS: [42, -28] }] },
  ['Ajusta el asiento para que los agarres queden a la altura del pecho alto.', 'Empuja hacia arriba y al frente hasta casi estirar los brazos.', 'Vuelve despacio hasta sentir el estiramiento del pecho.'],
  'No bloquees los codos arriba: mantén la tensión en el pecho.');
DX('pec-deck', { v: 'f', p: [{ k: 'pad', p1: [120, 92], p2: [120, 160], w: 34 }, { k: 'line', p1: [100, 166], p2: [140, 166], w: 8, c: 'dm-pad' }],
  k: [{ pel: [120, 150], thl: 0.3, an: [140, GY], wr: [166, 76], ed: [1, 0.7] }, { wr: [132, 76] }] },
  ['Siéntate con la espalda apoyada y los antebrazos o manos en los agarres, a la altura del pecho.', 'Junta los brazos al frente apretando el pecho.', 'Abre despacio hasta sentir el estiramiento, sin pasar la línea de los hombros.'],
  'Ajusta el asiento para que los codos queden un poco por debajo de los hombros.');
DX('fondos', { p: [{ k: 'bar', x1: 96, x2: 150, y: 124 }], k: [{ hip: [117.6, 117.5], t: 172, th: 10, sh: -60, wr: [124, 124], ed: [-1, 0] }, { hip: [100.3, 143.2], t: 160 }] },
  ['Sube a las paralelas con los brazos estirados y el cuerpo un poco inclinado al frente.', 'Baja doblando los codos hasta que los hombros queden a la altura de los codos.', 'Empuja hasta estirar los brazos.'],
  'Inclinarte al frente trabaja más el pecho; ir recto, más el tríceps. Si te duele el hombro, no bajes tanto.');
DX('flexiones', { p: [], k: [PUSH(22), PUSH(8)] },
  ['Apoya las manos un poco más abiertas que los hombros y estira el cuerpo en línea recta.', 'Baja el pecho hacia el piso doblando los codos a unos 45°.', 'Empuja hasta estirar los brazos sin que la cadera se hunda.'],
  'Aprieta el abdomen y los glúteos para mantener el cuerpo como una tabla. Si cuesta, apoya las rodillas.');
DX('flexiones-diamante', { p: [], k: [PUSH(22), PUSH(8)] },
  ['Junta las manos bajo el pecho formando un diamante con índices y pulgares.', 'Baja el pecho hacia las manos con los codos pegados al cuerpo.', 'Empuja hasta estirar los brazos.'],
  'Si molesta en las muñecas, separa un poco las manos.');
DX('pullover-manc', { p: [{ k: 'bench', x1: 118, x2: 172, y: 166 }, DB()], k: [{ hip: [92, 168], t: 100, sup: 1, an: [62, GY], kd: [0, -1], ua: 180, fa: 180 }, { ua: 88, fa: 88 }] },
  ['Apoya la parte alta de la espalda atravesada en el banco, con los pies en el piso.', 'Sostén una mancuerna con las dos manos sobre el pecho y bájala en arco por detrás de la cabeza.', 'Sube en el mismo arco hasta tenerla otra vez sobre el pecho.'],
  'Mantén los codos casi rectos y la cadera baja para estirar bien el pecho y los dorsales.');

// ---------------- Espalda ----------------
DX('dominadas', { v: 'f', p: [{ k: 'bar', x1: 60, x2: 180, y: 40 }], k: [{ pel: [120, 138], wr: [158, 42], ed: [1, 0.6] }, { pel: [120, 110] }] },
  ['Cuélgate de la barra con las palmas al frente, un poco más abierto que los hombros.', 'Tira llevando los codos hacia abajo hasta que la barbilla pase la barra.', 'Baja controlado hasta estirar casi del todo los brazos.'],
  'Empieza el movimiento bajando los hombros. Si aún no puedes, usa una banda o la máquina asistida.');
DX('dominadas-supinas', { v: 'f', p: [{ k: 'bar', x1: 60, x2: 180, y: 40 }], k: [{ pel: [120, 138], wr: [140, 42], ed: [1, 0.8] }, { pel: [120, 108] }] },
  ['Cuélgate con las palmas hacia ti y las manos a la anchura de los hombros.', 'Sube llevando el pecho hacia la barra.', 'Baja controlado hasta estirar los brazos.'],
  'Este agarre suma mucho bíceps; evita balancearte con las piernas.');
DX('dominadas-asist', { v: 'f', p: [{ k: 'bar', x1: 60, x2: 180, y: 40 }, { k: 'roll', at: 'kn', off: [0, 6], r: 7 }, { k: 'roll', at: 'knL', off: [0, 6], r: 7 }],
  k: [{ pel: [120, 132], wr: [158, 42], ed: [1, 0.6], anP: [3, 46], kd: [0.3, 1] }, { pel: [120, 106] }] },
  ['Elige el contrapeso y apoya las rodillas en la plataforma.', 'Tira llevando los codos hacia abajo hasta que la barbilla pase el agarre.', 'Baja despacio hasta estirar los brazos.'],
  'A más peso en la máquina, más ayuda. Quítale peso a medida que te haces más fuerte.');
DX('jalon-pecho', { v: 'f', p: [{ k: 'tower', x: 120, top: 14 }, { k: 'cableC', from: [120, 22] }, { k: 'hbar' }, { k: 'roll', at: 'kn', off: [0, -7], r: 6 }, { k: 'roll', at: 'knL', off: [0, -7], r: 6 }],
  k: [{ pel: [120, 152], thl: 0.3, an: [134, GY], wr: [166, 58], ed: [1, 0.5] }, { wr: [160, 104] }] },
  ['Siéntate con los muslos bajo los rodillos y toma la barra con agarre ancho.', 'Inclínate un poco atrás y baja la barra hasta la parte alta del pecho.', 'Sube despacio hasta estirar los brazos.'],
  'Lleva los codos hacia abajo y atrás; no jales la barra por detrás de la nuca.');
DX('jalon-cerrado', { p: [SEATP(74, 112), { k: 'cable', from: [124, 20], at: 'wr' }, { k: 'roll', at: 'kn', off: [0, -9], r: 6 }],
  k: [{ ...SEAT({ lean: 6 }), wrS: [10, -50], ed: [-0.3, 1] }, { t: 188, wrS: [12, 16] }] },
  ['Siéntate frente a la polea alta con el agarre en V y los muslos fijos.', 'Baja el agarre hacia el pecho llevando los codos pegados al cuerpo.', 'Sube despacio hasta estirar los brazos.'],
  'Saca el pecho al bajar y no te eches demasiado atrás.');
DX('jalon-unilateral', { v: 'f', p: [{ k: 'tower', x: 150, top: 14 }, { k: 'cable', from: [150, 22], at: 'wr' }],
  k: [{ pel: [120, 152], thl: 0.3, an: [134, GY], wr: [150, 50], wrL: [104, 150], ed: [1, 0.5] }, { wr: [150, 104] }] },
  ['Siéntate de lado a la polea alta y toma el agarre con una mano.', 'Baja el codo hacia la cadera hasta que la mano quede junto al pecho.', 'Sube despacio dejando que el dorsal se estire.'],
  'Trabaja un lado a la vez para corregir diferencias entre brazos.');
DX('pullover-polea', { p: [{ k: 'tower', x: 210 }, { k: 'cable', from: [202, 40], at: 'wr' }], k: [{ ...STAND({ lean: 24, dx: -6 }), ua: 150, fa: 150 }, { ua: 8, fa: 8 }] },
  ['Frente a la polea alta, toma la barra o cuerda con los brazos casi rectos y da un paso atrás.', 'Inclina el torso un poco y lleva la barra en arco hasta los muslos.', 'Sube despacio hasta la altura de la cabeza.'],
  'Los codos casi no se doblan: el movimiento sale del hombro.');
DX('remo-barra', { p: [PB(15)], k: [{ hip: [94, 122], t: 125, an: [112, GY], wrS: [0, 50], ed: [-0.6, -1] }, { wrS: [-21, 24] }] },
  ['Con la barra en las manos, inclina el torso al frente con la espalda recta y rodillas un poco dobladas.', 'Jala la barra hacia el ombligo llevando los codos hacia atrás.', 'Baja controlado hasta estirar los brazos.'],
  'Mantén la espalda neutra todo el tiempo; si se te redondea, baja el peso.');
DX('remo-pendlay', { p: [PB(18)], k: [{ hip: [86, 140], t: 100, an: [114, GY], wr: [128, 184], ed: [-0.4, -1] }, { wr: [118, 148] }] },
  ['Con la barra en el piso, inclina el torso casi paralelo al suelo y toma la barra.', 'Jálala explosivamente hasta la parte baja del pecho.', 'Devuélvela al piso en cada repetición.'],
  'Cada repetición empieza desde el piso: no uses el impulso de la cadera.');
DX('remo-mancuerna', { p: [{ k: 'bench', x1: 132, x2: 212, y: 152 }, DB()], k: [{ hip: [96, 126], t: 112, an: [104, GY], an2: [78, GY], wr2: [150, 150], wrS: [0, 50], ed: [-0.5, -1] }, { wrS: [-22, 20] }] },
  ['Apoya una mano en el banco con la espalda recta y la mancuerna colgando en la otra mano.', 'Jala la mancuerna hacia la cadera llevando el codo atrás.', 'Baja despacio hasta estirar el brazo.'],
  'Piensa en llevar el codo al bolsillo de atrás, no en subir la mano.');
DX('remo-polea', { p: [{ k: 'line', p1: [30, 188], p2: [200, 188], w: 5 }, { k: 'tower', x: 194, top: 120 }, { k: 'cable', from: [186, 168], at: 'wr' }, { k: 'line', p1: [160, 168], p2: [160, 196], w: 6, c: 'dm-pl' }],
  k: [{ hip: [80, 176], t: 150, an: [152, 182], kd: [0, -1], wr: [162, 150], ed: [-1, 0.2] }, { t: 184, wr: [110, 156] }] },
  ['Siéntate con los pies en la plataforma y las rodillas un poco dobladas.', 'Jala el agarre hacia el abdomen llevando los codos atrás y sacando el pecho.', 'Estira los brazos despacio inclinándote un poco al frente.'],
  'No te balancees: el torso solo acompaña un poco el movimiento.');
DX('remo-maquina', { p: [SEATP(66, 106), { k: 'pad', p1: [114, 116], p2: [114, 148], w: 8 }, { k: 'lever', pivot: [152, 40], at: 'wr' }], k: [{ ...SEAT({ x: { hip: [88, 160] } }), an: [132, GY], wr: [150, 118], ed: [-1, 0] }, { wr: [102, 120] }] },
  ['Ajusta el asiento y apoya el pecho en el respaldo delantero.', 'Jala los agarres llevando los codos atrás y juntando los omóplatos.', 'Regresa despacio hasta estirar los brazos.'],
  'Mantén el pecho pegado al apoyo durante toda la serie.');
DX('remo-t', { p: [{ k: 'landmine', pivot: [22, 200], at: 'wr' }], k: [{ hip: [92, 126], t: 135, an: [110, GY], wrS: [0, 48], ed: [-0.6, -1] }, { wrS: [-12, 26] }] },
  ['Párate sobre la barra con un pie a cada lado y toma el agarre.', 'Con la espalda recta, jala la barra hacia el pecho.', 'Baja controlado sin redondear la espalda.'],
  'Dobla un poco las rodillas y mantén la cadera atrás.');
DX('remo-pecho-apoyado', { p: [{ k: 'tpad', a: -4, b: 50, off: 11, leg: true }, DB()], k: [{ hip: [92, 140], t: 135, an: [70, GY], wrS: [0, 50], ed: [-0.6, -1] }, { wrS: [-20, 22] }] },
  ['Acuéstate boca abajo en un banco inclinado con una mancuerna en cada mano.', 'Jala las mancuernas hacia los costados llevando los codos atrás.', 'Baja despacio hasta estirar los brazos.'],
  'El apoyo del pecho evita que uses impulso: céntrate en juntar los omóplatos.');
DX('remo-invertido', { p: [{ k: 'bar', x1: 128, x2: 200, y: 96 }], k: [{ ...PUSH(24, [40, 196], [160, 96], 1), ed: [-0.5, 1] }, { ...PUSH(40, [40, 196], [160, 96], 1), ed: [-0.5, 1] }] },
  ['Acuéstate bajo una barra baja y tómala con los brazos estirados.', 'Con el cuerpo recto, jala el pecho hacia la barra.', 'Baja controlado hasta estirar los brazos.'],
  'Mientras más horizontal estés, más difícil. Dobla las rodillas para hacerlo más fácil.');
DX('colgarse', { v: 'f', p: [{ k: 'bar', x1: 60, x2: 180, y: 40 }], fn: p => ({ pel: [120 + 1.5 * Math.sin(p * 2 * Math.PI), 138], wr: [156, 42], ed: [1, 0.6] }), per: 3 },
  ['Agárrate de la barra con las manos a la anchura de los hombros.', 'Cuélgate con los brazos estirados y los pies sin tocar el piso.', 'Aguanta el tiempo marcado respirando con calma.'],
  'Aprieta fuerte la barra: es uno de los mejores ejercicios para el agarre.');
DX('encogimientos', { v: 'f', p: [{ k: 'dbF', at: 'wr' }, { k: 'dbF', at: 'wrL' }], k: [{ pel: [120, 121], wrS: [4, 52], shr: 0 }, { shr: 9 }] },
  ['De pie, con una mancuerna en cada mano a los costados.', 'Sube los hombros hacia las orejas lo más alto que puedas.', 'Aguanta un segundo y baja despacio.'],
  'No gires los hombros en círculo; el movimiento es arriba y abajo.');
DX('encogimientos-barra', { v: 'f', p: [{ k: 'barF', ext: 40 }], k: [{ pel: [120, 121], wrS: [-3, 52], shr: 0 }, { shr: 9 }] },
  ['Sostén la barra delante de los muslos con los brazos estirados.', 'Sube los hombros hacia las orejas sin doblar los codos.', 'Baja despacio hasta estirar el cuello.'],
  'Usa correas si el agarre se cansa antes que el trapecio.');
DX('encogimientos-maq', { v: 'f', p: [{ k: 'dbF', at: 'wr' }, { k: 'dbF', at: 'wrL' }, { k: 'roll', at: 'sh', off: [0, -6], r: 6 }, { k: 'roll', at: 'shL', off: [0, -6], r: 6 }], k: [{ pel: [120, 121], wrS: [4, 52], shr: 0 }, { shr: 9 }] },
  ['Colócate en la máquina con los agarres a los costados.', 'Sube los hombros hacia las orejas.', 'Baja despacio controlando el peso.'],
  'Mantén la cabeza neutra, mirando al frente.');
DX('elevacion-y', { v: 'f', p: [{ k: 'dbF', at: 'wr' }, { k: 'dbF', at: 'wrL' }], k: [{ pel: [120, 121], wr: [143, 125] }, { wr: [170, 30] }] },
  ['Con mancuernas ligeras, inclínate un poco al frente o apóyate en un banco inclinado.', 'Sube los brazos estirados formando una Y, con los pulgares hacia arriba.', 'Baja despacio.'],
  'Usa poco peso: trabaja la parte baja del trapecio, que es un músculo pequeño.');
DX('hiperextensiones', { p: [{ k: 'line', p1: [56, 200], p2: [126, 150], w: 5 }, { k: 'roll', at: 'hip', off: [8, 8], r: 7, l: 'b' }, { k: 'roll', at: [50, 196], r: 6, l: 'b' }],
  k: [{ hip: [112, 142], t: 28, an: [56, 192], kd: [0.3, 1], wrT: [-16, 8] }, { t: 128 }] },
  ['Ajusta el apoyo justo debajo de la cadera y fija los pies.', 'Baja el torso doblándote por la cadera con la espalda recta.', 'Sube hasta que el cuerpo quede en línea recta, sin arquear de más.'],
  'Aprieta los glúteos al subir y no te pases de la línea recta.');
DX('hiperext-peso', { p: [{ k: 'line', p1: [56, 200], p2: [126, 150], w: 5 }, { k: 'roll', at: 'hip', off: [8, 8], r: 7, l: 'b' }, { k: 'roll', at: [50, 196], r: 6, l: 'b' }, PB(10)],
  k: [{ hip: [112, 142], t: 28, an: [56, 192], kd: [0.3, 1], wrT: [-14, 10] }, { t: 128 }] },
  ['Colócate en el banco de hiperextensiones abrazando un disco contra el pecho.', 'Baja el torso doblándote por la cadera.', 'Sube hasta quedar en línea recta con las piernas.'],
  'Empieza con un disco liviano; la técnica importa más que el peso.');
DX('superman', { p: [], k: [{ hip: [100, 194], t: 90, ua: 90, fa: 90, th: -90, sh: -90 }, { t: 99, ua: 102, fa: 102, th: -99, sh: -99 }] },
  ['Acuéstate boca abajo con los brazos estirados al frente.', 'Levanta a la vez brazos, pecho y piernas unos centímetros del piso.', 'Aguanta dos segundos y baja despacio.'],
  'Mira al piso para no forzar el cuello.');
DX('buenos-dias', { p: [{ k: 'plate', at: 'sh', offT: [-3, -9], r: 16 }], k: [{ ...STAND(), wrT: [-4, -10], ed: [-0.6, 0.8] }, { hip: [94, 123], t: 102 }] },
  ['Coloca la barra sobre la parte alta de la espalda, como en la sentadilla.', 'Lleva la cadera atrás e inclina el torso con la espalda recta y rodillas un poco dobladas.', 'Vuelve a subir empujando la cadera al frente.'],
  'Baja solo hasta donde mantengas la espalda recta; empieza con poco peso.');

// ---------------- Hombros ----------------
DX('press-militar', { p: [PB(15)], k: [{ ...STAND(), wrS: [10, -4], ed: [0.3, 1] }, { wrS: [3, -51] }] },
  ['De pie, toma la barra a la anchura de los hombros y apóyala delante de los hombros.', 'Empújala en vertical por encima de la cabeza hasta estirar los brazos.', 'Bájala controlada hasta la parte alta del pecho.'],
  'Aprieta glúteos y abdomen para no arquear la espalda baja. Mete la cabeza al pasar la barra.');
DX('press-hombro-manc', { p: [SEATP(72, 112), BACKP(0, 52), DB()], k: [{ ...SEAT(), wrS: [4, -4], ed: [0, 1] }, { wrS: [2, -51] }] },
  ['Siéntate con la espalda apoyada y las mancuernas a la altura de los hombros.', 'Empújalas hacia arriba hasta casi juntarlas sobre la cabeza.', 'Baja despacio hasta la altura de las orejas.'],
  'Los codos van un poco al frente, no totalmente abiertos a los lados.');
DX('press-arnold', { p: [SEATP(72, 112), BACKP(0, 52), DB()], k: [{ ...SEAT(), wrS: [12, -14], ed: [1, 0.4] }, { wrS: [2, -51] }] },
  ['Siéntate con las mancuernas frente a la cara y las palmas hacia ti.', 'Empuja hacia arriba girando las palmas hasta que miren al frente.', 'Baja deshaciendo el giro.'],
  'El giro debe ser fluido; usa menos peso que en el press normal.');
DX('press-hombro-maq', { p: [SEATP(72, 112), BACKP(0, 52), { k: 'lever', pivot: [60, 70], at: 'wr' }], k: [{ ...SEAT(), wrS: [6, -4], ed: [0, 1] }, { wrS: [2, -50] }] },
  ['Ajusta el asiento para que los agarres queden a la altura de los hombros.', 'Empuja hacia arriba hasta casi estirar los brazos.', 'Baja controlado.'],
  'Mantén la espalda pegada al respaldo.');
DX('press-landmine', { p: [{ k: 'landmine', pivot: [234, 202], at: 'wr' }], k: [{ ...STAND({ lean: 8 }), an: [120, GY], an2: [94, GY], wrS: [12, 0], ed: [0, 1] }, { wrS: [38, -36] }] },
  ['Sostén el extremo de la barra a la altura del hombro con un pie adelantado.', 'Empuja la barra hacia arriba y al frente hasta estirar el brazo.', 'Bájala despacio al hombro.'],
  'Es amable con los hombros; ideal si el press por encima de la cabeza te molesta.');
DX('elev-laterales', { v: 'f', p: [{ k: 'dbF', at: 'wr' }, { k: 'dbF', at: 'wrL' }], k: [{ pel: [120, 121], wr: [143, 126], ed: [0.2, 1] }, { wr: [186, 82] }] },
  ['De pie, con una mancuerna en cada mano a los costados.', 'Sube los brazos hacia los lados con los codos un poco doblados hasta la altura de los hombros.', 'Baja despacio.'],
  'Sube con los codos, no con las manos, y no pases de la altura del hombro.');
DX('elev-lat-polea', { v: 'f', p: [{ k: 'tower', x: 22 }, { k: 'cable', from: [30, 194], at: 'wr' }], k: [{ pel: [124, 121], wr: [130, 126], wrL: [40, 112], ed: [0.3, 1] }, { wr: [188, 80] }] },
  ['Párate de lado a la polea baja y toma el agarre con la mano más alejada.', 'Sube el brazo hacia el lado hasta la altura del hombro.', 'Baja despacio cruzando por delante del cuerpo.'],
  'La polea mantiene la tensión abajo, donde la mancuerna no la da.');
DX('elev-lat-maq', { v: 'f', p: [{ k: 'roll', at: 'el', r: 6 }, { k: 'roll', at: 'elL', r: 6 }, { k: 'pad', p1: [120, 96], p2: [120, 158], w: 30 }], k: [{ pel: [120, 150], thl: 0.3, an: [136, GY], wr: [149, 150], ed: [0.3, 1] }, { wr: [186, 110] }] },
  ['Siéntate con los codos o antebrazos contra las almohadillas.', 'Sube los brazos hacia los lados hasta la altura de los hombros.', 'Baja despacio.'],
  'Alinea el eje de la máquina con tus hombros antes de empezar.');
DX('elev-frontales', { p: [DB()], k: [{ ...STAND(), ua: 6, fa: 6 }, { ua: 92, fa: 92 }] },
  ['De pie, con las mancuernas delante de los muslos.', 'Sube los brazos al frente casi rectos hasta la altura de los hombros.', 'Baja despacio.'],
  'No balancees el torso; puedes alternar brazos.');
DX('face-pull', { p: [{ k: 'tower', x: 214 }, { k: 'cable', from: [206, 60], at: 'wr' }], k: [{ ...STAND(), wr: [168, 66], ed: [-0.4, -1] }, { wr: [122, 58] }] },
  ['Con la polea a la altura de la cara, toma la cuerda con las palmas hacia abajo.', 'Jala la cuerda hacia la cara separando las manos y llevando los codos altos y atrás.', 'Regresa despacio.'],
  'Termina con las manos a los lados de las orejas, como haciendo "doble bíceps".');
DX('pajaros', { v: 'f', p: [{ k: 'dbF', at: 'wr' }, { k: 'dbF', at: 'wrL' }], k: [{ pel: [120, 124], tl: 0.45, hl: 0.6, an: [124, GY], kd: [0.1, 0], wr: [143, 153] }, { wr: [188, 104] }] },
  ['Inclina el torso casi paralelo al piso con una mancuerna en cada mano.', 'Abre los brazos hacia los lados con los codos un poco doblados.', 'Baja despacio.'],
  'Usa poco peso y aprieta la parte de atrás del hombro al subir.');
DX('pajaros-maq', { v: 'f', p: [{ k: 'line', p1: [100, 166], p2: [140, 166], w: 8, c: 'dm-pad' }], k: [{ pel: [120, 150], thl: 0.3, an: [136, GY], wr: [140, 98], ed: [0.2, 1] }, { wr: [192, 100] }] },
  ['Siéntate mirando hacia la máquina con el pecho en el respaldo.', 'Abre los brazos hacia atrás en arco a la altura de los hombros.', 'Regresa despacio al frente.'],
  'Mantén los brazos casi rectos y no encojas los hombros.');
DX('remo-menton', { v: 'f', p: [{ k: 'barF', ext: 40 }], k: [{ pel: [120, 121], wrS: [-10, 52], ed: [1, -1] }, { wrS: [-14, 10] }] },
  ['Sostén la barra delante de los muslos con las manos a la anchura de los hombros.', 'Súbela pegada al cuerpo llevando los codos hacia arriba y afuera.', 'Bájala despacio.'],
  'Sube solo hasta la altura del pecho; más arriba suele molestar al hombro.');

// ---------------- Bíceps ----------------
const CURL = (props, x = {}) => ({ p: props, k: [{ ...STAND(), ua: 3, fa: 4, ...x }, { fa: 148 }] });
DX('curl-barra', CURL([PB(13)]), ['De pie, toma la barra con las palmas hacia arriba a la anchura de los hombros.', 'Sube la barra doblando los codos sin moverlos de los costados.', 'Baja despacio hasta estirar los brazos.'], 'No balancees el cuerpo; si lo necesitas, baja el peso.');
DX('curl-z', CURL([PB(13)]), ['Toma la barra Z por las partes inclinadas, con las palmas hacia arriba.', 'Sube la barra doblando los codos, pegados al cuerpo.', 'Baja despacio hasta estirar los brazos.'], 'El agarre inclinado es más cómodo para las muñecas que la barra recta.');
DX('curl-manc', CURL([DB()]), ['De pie, con una mancuerna en cada mano y las palmas al frente.', 'Sube las mancuernas doblando los codos; puedes alternar brazos.', 'Baja despacio.'], 'Gira un poco la muñeca hacia afuera al subir para apretar más el bíceps.');
DX('curl-martillo', CURL([DB()]), ['De pie, con las mancuernas a los costados y las palmas mirándose.', 'Sube sin girar las muñecas, como si sostuvieras un martillo.', 'Baja despacio.'], 'Trabaja bíceps y antebrazo a la vez.');
DX('curl-inverso', CURL([PB(13)]), ['Toma la barra con las palmas hacia abajo, a la anchura de los hombros.', 'Sube doblando los codos y manteniendo las muñecas rectas.', 'Baja despacio.'], 'Usa menos peso que en el curl normal: el antebrazo se cansa antes.');
DX('curl-polea', CURL([{ k: 'tower', x: 196 }, { k: 'cable', from: [188, 194], at: 'wr' }]), ['Párate frente a la polea baja con la barra en las manos, palmas hacia arriba.', 'Sube doblando los codos sin moverlos.', 'Baja despacio sintiendo la tensión.'], 'La polea mantiene la tensión en todo el recorrido.');
DX('curl-martillo-cuerda', CURL([{ k: 'tower', x: 196 }, { k: 'cable', from: [188, 194], at: 'wr' }]), ['Engancha la cuerda en la polea baja y tómala con las palmas mirándose.', 'Sube doblando los codos sin girar las muñecas.', 'Baja despacio.'], 'Separa un poco los extremos de la cuerda arriba.');
DX('curl-bayesiano', { p: [{ k: 'tower', x: 26 }, { k: 'cable', from: [34, 120], at: 'wr' }], k: [{ ...STAND({ lean: 4, dx: 4 }), an: [124, GY], an2: [100, GY], ua: -26, fa: -22, ua2: 0, fa2: 0 }, { fa: 118 }] },
  ['De espaldas a la polea, toma el agarre con una mano y da un paso al frente.', 'Con el brazo un poco por detrás del cuerpo, sube doblando el codo.', 'Baja despacio hasta sentir el estiramiento del bíceps.'],
  'Al empezar con el brazo atrás, el bíceps trabaja estirado; usa un peso moderado.');
DX('curl-predicador', { p: [SEATP(78, 112), { k: 'pad', p1: [100, 120], p2: [132, 146], w: 8 }, { k: 'line', p1: [118, 136], p2: [118, FLOOR], w: 4 }, PB(12)], k: [{ ...SEAT({ x: { hip: [96, 160] } }), t: 168, ua: 48, fa: 52 }, { fa: 168 }] },
  ['Siéntate en el banco predicador con la parte de atrás de los brazos sobre el cojín.', 'Sube la barra doblando los codos.', 'Baja despacio hasta casi estirar los brazos.'],
  'No estires los codos de golpe abajo: es donde más se carga la articulación.');
DX('curl-concentrado', { p: [SEATP(58, 104), DB()], k: [{ hip: [92, 160], t: 140, an: [138, GY], kd: [1, -0.2], ua: 6, fa: 6, wr2: [138, 152] }, { fa: 150 }] },
  ['Siéntate en un banco, inclínate al frente y apoya el codo en la cara interna del muslo.', 'Sube la mancuerna hacia el hombro.', 'Baja despacio hasta estirar el brazo.'],
  'El codo no se mueve del muslo; el brazo trabaja solo.');
DX('curl-inclinado', { p: [SEATP(72, 112), { k: 'tpad', a: -4, b: 52, off: -11, leg: true }, DB()], k: [{ hip: [100, 160], t: 205, an: [142, GY], kd: [1, -0.2], ua: -8, fa: -8 }, { fa: 122 }] },
  ['Siéntate en un banco inclinado a unos 45-60° con los brazos colgando.', 'Sube las mancuernas sin adelantar los codos.', 'Baja despacio hasta estirar los brazos.'],
  'El brazo empieza por detrás del cuerpo, lo que estira más el bíceps.');
DX('curl-spider', { p: [{ k: 'tpad', a: -4, b: 50, off: 11, leg: true }, DB()], k: [{ hip: [92, 136], t: 140, an: [72, GY], ua: 2, fa: 2 }, { fa: 150 }] },
  ['Apóyate boca abajo en un banco inclinado con los brazos colgando.', 'Sube las mancuernas doblando los codos.', 'Baja despacio.'],
  'Sin balanceo posible: el bíceps hace todo el trabajo arriba.');

// ---------------- Tríceps ----------------
const PUSHDOWN = { p: [{ k: 'tower', x: 200 }, { k: 'cable', from: [192, 40], at: 'wr' }], k: [{ ...STAND({ lean: 8 }), ua: 6, fa: 105 }, { fa: 6 }] };
DX('ext-polea', JSON.parse(JSON.stringify(PUSHDOWN)), ['Frente a la polea alta, toma la barra con los codos pegados al cuerpo.', 'Empuja hacia abajo hasta estirar los brazos.', 'Sube despacio hasta que los antebrazos queden paralelos al piso.'], 'Los codos no se mueven: solo trabaja el antebrazo como una bisagra.');
DX('ext-cuerda', JSON.parse(JSON.stringify(PUSHDOWN)), ['Engancha la cuerda en la polea alta y tómala con las palmas mirándose.', 'Empuja hacia abajo y separa los extremos de la cuerda al final.', 'Sube despacio.'], 'Abrir la cuerda al final aprieta más el tríceps.');
DX('ext-unilateral', { p: PUSHDOWN.p, k: [{ ...STAND({ lean: 8 }), ua: 6, fa: 105, ua2: 0, fa2: 0 }, { fa: 6 }] }, ['Toma el agarre de la polea alta con una mano.', 'Estira el brazo hacia abajo con el codo pegado al cuerpo.', 'Sube despacio.'], 'Trabajar un brazo a la vez ayuda a igualar fuerzas.');
DX('ext-cabeza', { p: [DB()], k: [{ ...STAND(), ua: 172, fa: -20 }, { fa: -188 }] },
  ['De pie o sentado, sostén una mancuerna con las dos manos por encima de la cabeza.', 'Bájala por detrás de la cabeza doblando los codos.', 'Sube hasta estirar los brazos.'],
  'Mantén los codos apuntando al frente, sin abrirlos mucho.');
DX('press-frances', { p: [BENCHF, PB(12)], k: [{ ...SUPB(), ua: 168, fa: 168 }, { fa: 70 }] },
  ['Acuéstate en el banco con la barra Z sobre el pecho y los brazos estirados.', 'Dobla los codos y baja la barra hacia la frente.', 'Estira los brazos de nuevo.'],
  'Los codos apuntan al techo y no se abren.');
DX('rompecraneos-manc', { p: [BENCHF, DB()], k: [{ ...SUPB(), ua: 168, fa: 168 }, { fa: 70 }] },
  ['Acuéstate con una mancuerna en cada mano y los brazos estirados sobre el pecho.', 'Baja las mancuernas a los lados de la cabeza doblando los codos.', 'Estira los brazos de nuevo.'],
  'Con mancuernas cada brazo trabaja por su cuenta y las muñecas quedan más libres.');
DX('patada-triceps', { p: [{ k: 'bench', x1: 134, x2: 210, y: 152 }, DB()], k: [{ hip: [100, 122], t: 112, an: [110, GY], an2: [86, GY], wr2: [150, 150], ua: -88, fa: 2 }, { fa: -88 }] },
  ['Apoya una mano en el banco con el torso casi paralelo al piso.', 'Con el brazo pegado al cuerpo, estira el codo hacia atrás.', 'Vuelve despacio hasta 90°.'],
  'El brazo de arriba no se mueve; solo el antebrazo.');
DX('fondos-banco', { p: [{ k: 'bench', x1: 30, x2: 94, y: 150 }], k: [{ hip: [90, 146], t: 180, an: [140, GY], kd: [0, -1], wr: [86, 148], ed: [-1, 0.2] }, { hip: [88, 172], t: 178 }] },
  ['Apoya las manos en el borde del banco detrás de ti y estira las piernas al frente.', 'Baja la cadera doblando los codos hacia atrás.', 'Empuja hasta estirar los brazos.'],
  'Mantén la espalda cerca del banco. Para hacerlo más fácil, dobla las rodillas.');
DX('fondos-maquina', { p: [SEATP(68, 110), BACKP(), { k: 'lever', pivot: [64, 120], at: 'wr' }], k: [{ ...SEAT(), wrS: [8, 18], ed: [-1, 0.3] }, { wrS: [4, 50] }] },
  ['Siéntate en la máquina con los agarres a los lados del pecho.', 'Empuja hacia abajo hasta estirar los brazos.', 'Sube despacio.'],
  'Mantén los hombros abajo y la espalda apoyada.');

// ---------------- Antebrazos ----------------
const WRIST = (prop, a, b) => ({ p: [SEATP(68, 110), prop], k: [{ ...SEAT({ lean: 30 }), wr: [140, 152], ed: [0, 1], hd: a }, { hd: b }], dur: 0.9 });
DX('curl-muneca', WRIST({ k: 'plate', at: 'hand', r: 11 }, 25, 150), ['Siéntate y apoya los antebrazos sobre los muslos con las palmas hacia arriba.', 'Deja que la barra baje doblando las muñecas.', 'Sube la barra solo con las muñecas.'], 'Los antebrazos no se mueven; recorrido corto y controlado.');
DX('curl-muneca-inv', WRIST({ k: 'plate', at: 'hand', r: 11 }, 30, 125), ['Siéntate con los antebrazos sobre los muslos y las palmas hacia abajo.', 'Sube la barra extendiendo las muñecas.', 'Baja despacio.'], 'Usa menos peso que en el curl de muñeca normal.');
DX('curl-muneca-manc', WRIST({ k: 'db', at: 'hand' }, 25, 150), ['Apoya un antebrazo sobre el muslo o el banco, con la mano por fuera.', 'Sube la mancuerna doblando la muñeca.', 'Baja despacio y repite con el otro brazo.'], 'Trabajar un brazo a la vez te deja concentrarte en la muñeca.');
DX('rodillo-muneca', { p: [{ k: 'rope', at: 'hand' }], k: [{ ...STAND(), ua: 88, fa: 88, hd: 60, ry: 182 }, { hd: 120, ry: 140 }], dur: 2 },
  ['De pie, sostén el rodillo con los brazos estirados al frente.', 'Gira las muñecas para enrollar la cuerda hasta subir el peso.', 'Desenrolla despacio para bajarlo.'],
  'Haz el recorrido en los dos sentidos para trabajar flexores y extensores.');
// En polea: el cable sale de la polea baja y se engancha a la mano
const WRISTC = (a, b) => { const d = WRIST({ k: 'tower', x: 206 }, a, b); d.p.push({ k: 'cable', from: [198, 194], at: 'hand' }); return d; };
DX('curl-muneca-polea', WRISTC(25, 150), ['Pon la barra corta en la polea baja y siéntate frente a ella con los antebrazos sobre los muslos, palmas hacia arriba.', 'Deja que la polea baje la barra doblando las muñecas.', 'Sube la barra solo con las muñecas.'], 'La polea mantiene la tensión abajo, donde la barra libre casi no pesa.');
DX('curl-muneca-inv-polea', WRISTC(30, 125), ['Siéntate frente a la polea baja con los antebrazos sobre los muslos y las palmas hacia abajo.', 'Sube la barra extendiendo las muñecas.', 'Baja despacio sin soltar la tensión.'], 'Usa poco peso: los extensores de la muñeca son pequeños.');
DX('curl-inverso-polea', CURL([{ k: 'tower', x: 196 }, { k: 'cable', from: [188, 194], at: 'wr' }]), ['Párate frente a la polea baja y toma la barra con las palmas hacia abajo.', 'Sube doblando los codos, pegados al cuerpo, con las muñecas rectas.', 'Baja despacio hasta estirar los brazos.'], 'Si las muñecas se doblan hacia abajo, baja el peso.');
DX('curl-muneca-espalda-polea', { p: [{ k: 'tower', x: 22 }, { k: 'cable', from: [30, 194], at: 'hand' }], k: [{ ...STAND(), ua: -8, fa: -8, hd: -4 }, { hd: -78 }], dur: 0.9 },
  ['De espaldas a la polea baja, toma la barra detrás de los muslos con las palmas mirando hacia atrás.', 'Con los brazos estirados, sube la barra doblando solo las muñecas.', 'Baja despacio dejando que la barra ruede hacia los dedos.'],
  'Los brazos no se mueven; todo el trabajo está en la muñeca.');
DX('handgrip', { p: [{ k: 'grip', at: 'wr' }], k: [{ ...STAND(), wrS: [24, 24], ed: [0, 1], g: 1 }, { g: 0 }], dur: 0.6, hold: 0.25 },
  ['Toma la pinza con una mano.', 'Apriétala hasta cerrarla por completo.', 'Abre despacio y repite.'],
  'Puedes hacer series largas o aguantar cerrada unos segundos.');
DX('pinza-discos', { p: [{ k: 'pinch', at: 'wr' }], k: [{ ...STAND() }, { hip: [112, 121.5] }], dur: 1.5 },
  ['Junta dos discos lisos y tómalos con los dedos por un lado y el pulgar por el otro.', 'Levántalos y aguanta con los brazos a los costados.', 'Mantén el tiempo marcado y descansa.'],
  'Entrena la fuerza de pinza; empieza con discos de 5 kg.');
