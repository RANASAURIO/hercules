// ---------- Biblioteca de ejercicios ----------
// t: 'w' = peso × reps, 'bw' = peso corporal (reps + lastre opcional),
//    't' = tiempo (segundos), 'c' = cardio (km + minutos)
// e: equipo. bar: true si se carga con discos en barra olímpica.
const MUSCLES = {
  pecho: 'Pecho', espalda: 'Espalda', hombros: 'Hombros', trapecio: 'Trapecio', biceps: 'Bíceps',
  triceps: 'Tríceps', antebrazos: 'Antebrazos', abdomen: 'Abdomen', oblicuos: 'Oblicuos', lumbar: 'Lumbar',
  cuadriceps: 'Cuádriceps', femorales: 'Femorales', gluteos: 'Glúteos', aductores: 'Aductores',
  pantorrillas: 'Pantorrillas', cardio: 'Cardio'
};
// grupos antiguos que pueden tener los ejercicios propios creados antes
const MUSCLES_LEGACY = { piernas: 'Piernas' };
const mLabel = m => MUSCLES[m] || MUSCLES_LEGACY[m] || 'Otro';
const EQUIP = {
  barra: 'Barra', mancuernas: 'Mancuernas', maquina: 'Máquina', polea: 'Polea',
  corporal: 'Peso corporal', kettlebell: 'Kettlebell', otro: 'Otro'
};

const BUILTIN_EXERCISES = [
  // Pecho
  ['press-banca', 'Press de banca', 'pecho', 'barra', 'w', 1],
  ['press-inclinado', 'Press inclinado con barra', 'pecho', 'barra', 'w', 1],
  ['press-declinado', 'Press declinado con barra', 'pecho', 'barra', 'w', 1],
  ['press-banca-manc', 'Press de banca con mancuernas', 'pecho', 'mancuernas', 'w'],
  ['press-incl-manc', 'Press inclinado con mancuernas', 'pecho', 'mancuernas', 'w'],
  ['aperturas', 'Aperturas con mancuernas', 'pecho', 'mancuernas', 'w'],
  ['cruce-poleas', 'Cruce de poleas', 'pecho', 'polea', 'w'],
  ['press-maquina', 'Press de pecho en máquina', 'pecho', 'maquina', 'w'],
  ['pec-deck', 'Pec deck (contractora)', 'pecho', 'maquina', 'w'],
  ['fondos', 'Fondos en paralelas', 'pecho', 'corporal', 'bw'],
  ['flexiones', 'Flexiones de pecho', 'pecho', 'corporal', 'bw'],
  // Espalda
  ['peso-muerto', 'Peso muerto', 'espalda', 'barra', 'w', 1],
  ['dominadas', 'Dominadas', 'espalda', 'corporal', 'bw'],
  ['dominadas-supinas', 'Dominadas supinas (chin-ups)', 'espalda', 'corporal', 'bw'],
  ['jalon-pecho', 'Jalón al pecho', 'espalda', 'polea', 'w'],
  ['jalon-cerrado', 'Jalón agarre cerrado', 'espalda', 'polea', 'w'],
  ['remo-barra', 'Remo con barra', 'espalda', 'barra', 'w', 1],
  ['remo-mancuerna', 'Remo con mancuerna', 'espalda', 'mancuernas', 'w'],
  ['remo-polea', 'Remo en polea baja', 'espalda', 'polea', 'w'],
  ['remo-maquina', 'Remo en máquina', 'espalda', 'maquina', 'w'],
  ['remo-t', 'Remo en T', 'espalda', 'barra', 'w', 1],
  ['pullover-polea', 'Pullover en polea', 'espalda', 'polea', 'w'],
  ['hiperextensiones', 'Hiperextensiones', 'lumbar', 'corporal', 'bw'],
  ['encogimientos', 'Encogimientos con mancuernas', 'trapecio', 'mancuernas', 'w'],
  // Hombros
  ['press-militar', 'Press militar', 'hombros', 'barra', 'w', 1],
  ['press-hombro-manc', 'Press de hombros con mancuernas', 'hombros', 'mancuernas', 'w'],
  ['press-arnold', 'Press Arnold', 'hombros', 'mancuernas', 'w'],
  ['press-hombro-maq', 'Press de hombros en máquina', 'hombros', 'maquina', 'w'],
  ['elev-laterales', 'Elevaciones laterales', 'hombros', 'mancuernas', 'w'],
  ['elev-lat-polea', 'Elevaciones laterales en polea', 'hombros', 'polea', 'w'],
  ['elev-frontales', 'Elevaciones frontales', 'hombros', 'mancuernas', 'w'],
  ['face-pull', 'Face pull', 'hombros', 'polea', 'w'],
  ['pajaros', 'Pájaros (deltoides posterior)', 'hombros', 'mancuernas', 'w'],
  ['remo-menton', 'Remo al mentón', 'hombros', 'barra', 'w', 1],
  // Bíceps
  ['curl-barra', 'Curl con barra', 'biceps', 'barra', 'w'],
  ['curl-manc', 'Curl con mancuernas', 'biceps', 'mancuernas', 'w'],
  ['curl-martillo', 'Curl martillo', 'biceps', 'mancuernas', 'w'],
  ['curl-predicador', 'Curl predicador', 'biceps', 'maquina', 'w'],
  ['curl-polea', 'Curl en polea', 'biceps', 'polea', 'w'],
  ['curl-concentrado', 'Curl concentrado', 'biceps', 'mancuernas', 'w'],
  ['curl-inclinado', 'Curl inclinado con mancuernas', 'biceps', 'mancuernas', 'w'],
  // Tríceps
  ['press-frances', 'Press francés', 'triceps', 'barra', 'w'],
  ['ext-polea', 'Extensión de tríceps en polea', 'triceps', 'polea', 'w'],
  ['ext-cuerda', 'Extensión con cuerda', 'triceps', 'polea', 'w'],
  ['ext-cabeza', 'Extensión sobre la cabeza', 'triceps', 'mancuernas', 'w'],
  ['press-cerrado', 'Press de banca agarre cerrado', 'triceps', 'barra', 'w', 1],
  ['patada-triceps', 'Patada de tríceps', 'triceps', 'mancuernas', 'w'],
  ['fondos-banco', 'Fondos en banco', 'triceps', 'corporal', 'bw'],
  // Piernas
  ['sentadilla', 'Sentadilla', 'cuadriceps', 'barra', 'w', 1],
  ['sentadilla-frontal', 'Sentadilla frontal', 'cuadriceps', 'barra', 'w', 1],
  ['sentadilla-hack', 'Sentadilla hack', 'cuadriceps', 'maquina', 'w'],
  ['sentadilla-goblet', 'Sentadilla goblet', 'cuadriceps', 'mancuernas', 'w'],
  ['sentadilla-bulgara', 'Sentadilla búlgara', 'cuadriceps', 'mancuernas', 'w'],
  ['prensa', 'Prensa de piernas', 'cuadriceps', 'maquina', 'w'],
  ['zancadas', 'Zancadas', 'cuadriceps', 'mancuernas', 'w'],
  ['extension-cuad', 'Extensión de cuádriceps', 'cuadriceps', 'maquina', 'w'],
  ['curl-femoral', 'Curl femoral tumbado', 'femorales', 'maquina', 'w'],
  ['curl-femoral-sent', 'Curl femoral sentado', 'femorales', 'maquina', 'w'],
  ['peso-muerto-rumano', 'Peso muerto rumano', 'femorales', 'barra', 'w', 1],
  ['aductores', 'Aductores en máquina', 'aductores', 'maquina', 'w'],
  // Glúteos
  ['hip-thrust', 'Hip thrust', 'gluteos', 'barra', 'w', 1],
  ['abductores', 'Abductores en máquina', 'gluteos', 'maquina', 'w'],
  ['patada-gluteo', 'Patada de glúteo en polea', 'gluteos', 'polea', 'w'],
  ['puente-gluteo', 'Puente de glúteo', 'gluteos', 'corporal', 'bw'],
  // Pantorrillas
  ['talones-pie', 'Elevación de talones de pie', 'pantorrillas', 'maquina', 'w'],
  ['talones-sentado', 'Elevación de talones sentado', 'pantorrillas', 'maquina', 'w'],
  // Abdomen
  ['plancha', 'Plancha', 'abdomen', 'corporal', 't'],
  ['crunch', 'Crunch abdominal', 'abdomen', 'corporal', 'bw'],
  ['crunch-polea', 'Crunch en polea', 'abdomen', 'polea', 'w'],
  ['elev-piernas', 'Elevación de piernas colgado', 'abdomen', 'corporal', 'bw'],
  ['rueda', 'Rueda abdominal', 'abdomen', 'corporal', 'bw'],
  ['russian-twist', 'Russian twist', 'oblicuos', 'corporal', 'bw'],
  // Cardio
  ['cinta', 'Caminadora / cinta', 'cardio', 'maquina', 'c'],
  ['bicicleta', 'Bicicleta estática', 'cardio', 'maquina', 'c'],
  ['eliptica', 'Elíptica', 'cardio', 'maquina', 'c'],
  ['remo-ergo', 'Remo (ergómetro)', 'cardio', 'maquina', 'c'],
  ['escaladora', 'Escaladora', 'cardio', 'maquina', 'c'],
  ['cuerda', 'Saltar la cuerda', 'cardio', 'otro', 't'],
  // ---- Específicos por músculo ----
  // Antebrazos
  ['curl-muneca', 'Curl de muñeca con barra', 'antebrazos', 'barra', 'w'],
  ['curl-muneca-inv', 'Curl de muñeca inverso', 'antebrazos', 'barra', 'w'],
  ['curl-muneca-manc', 'Curl de muñeca con mancuerna', 'antebrazos', 'mancuernas', 'w'],
  ['curl-inverso', 'Curl inverso con barra', 'antebrazos', 'barra', 'w'],
  ['rodillo-muneca', 'Rodillo de muñeca', 'antebrazos', 'otro', 'w'],
  ['handgrip', 'Hand grip (pinza de mano)', 'antebrazos', 'otro', 'bw'],
  ['pinza-discos', 'Pinza de discos (agarre)', 'antebrazos', 'otro', 't'],
  ['colgarse', 'Colgarse de la barra', 'antebrazos', 'corporal', 't'],
  ['curl-muneca-polea', 'Curl de muñeca en polea', 'antebrazos', 'polea', 'w'],
  ['curl-muneca-inv-polea', 'Curl de muñeca inverso en polea', 'antebrazos', 'polea', 'w'],
  ['curl-inverso-polea', 'Curl inverso en polea', 'antebrazos', 'polea', 'w'],
  ['curl-muneca-espalda-polea', 'Curl de muñeca por detrás en polea', 'antebrazos', 'polea', 'w'],
  // Trapecio
  ['encogimientos-barra', 'Encogimientos con barra', 'trapecio', 'barra', 'w', 1],
  ['encogimientos-maq', 'Encogimientos en máquina', 'trapecio', 'maquina', 'w'],
  ['elevacion-y', 'Elevación en Y', 'trapecio', 'mancuernas', 'w'],
  // Lumbar
  ['buenos-dias', 'Buenos días con barra', 'lumbar', 'barra', 'w', 1],
  ['hiperext-peso', 'Hiperextensión con peso', 'lumbar', 'otro', 'w'],
  ['superman', 'Superman', 'lumbar', 'corporal', 'bw'],
  // Oblicuos
  ['plancha-lateral', 'Plancha lateral', 'oblicuos', 'corporal', 't'],
  ['lenador', 'Leñador en polea', 'oblicuos', 'polea', 'w'],
  ['incl-lateral', 'Inclinación lateral con mancuerna', 'oblicuos', 'mancuernas', 'w'],
  ['pallof', 'Press Pallof', 'oblicuos', 'polea', 'w'],
  ['crunch-bici', 'Crunch bicicleta', 'oblicuos', 'corporal', 'bw'],
  // Abdomen
  ['crunch-inverso', 'Crunch inverso', 'abdomen', 'corporal', 'bw'],
  ['elev-piernas-suelo', 'Elevación de piernas tumbado', 'abdomen', 'corporal', 'bw'],
  ['abd-maquina', 'Abdominales en máquina', 'abdomen', 'maquina', 'w'],
  ['dead-bug', 'Dead bug', 'abdomen', 'corporal', 'bw'],
  ['hollow', 'Hollow hold', 'abdomen', 'corporal', 't'],
  ['v-ups', 'V-ups', 'abdomen', 'corporal', 'bw'],
  // Aductores
  ['sentadilla-sumo', 'Sentadilla sumo', 'aductores', 'mancuernas', 'w'],
  ['aductor-polea', 'Aducción en polea', 'aductores', 'polea', 'w'],
  ['copenhague', 'Plancha Copenhague', 'aductores', 'corporal', 't'],
  // Pantorrillas
  ['talones-prensa', 'Elevación de talones en prensa', 'pantorrillas', 'maquina', 'w'],
  ['talones-una', 'Elevación de talones a una pierna', 'pantorrillas', 'mancuernas', 'w'],
  ['tibial', 'Elevación de tibiales', 'pantorrillas', 'corporal', 'bw'],
  // Glúteos
  ['step-up', 'Subida al cajón (step-up)', 'gluteos', 'mancuernas', 'w'],
  ['peso-muerto-sumo', 'Peso muerto sumo', 'gluteos', 'barra', 'w', 1],
  ['abduccion-polea', 'Abducción en polea', 'gluteos', 'polea', 'w'],
  ['patada-maquina', 'Patada de glúteo en máquina', 'gluteos', 'maquina', 'w'],
  ['hip-thrust-maq', 'Hip thrust en máquina', 'gluteos', 'maquina', 'w'],
  // Femorales
  ['curl-nordico', 'Curl nórdico', 'femorales', 'corporal', 'bw'],
  ['curl-femoral-pie', 'Curl femoral de pie', 'femorales', 'maquina', 'w'],
  ['peso-muerto-rigido', 'Peso muerto piernas rígidas', 'femorales', 'barra', 'w', 1],
  // Cuádriceps
  ['sentadilla-smith', 'Sentadilla en Smith', 'cuadriceps', 'maquina', 'w'],
  ['sissy', 'Sentadilla sissy', 'cuadriceps', 'corporal', 'bw'],
  ['prensa-unilateral', 'Prensa a una pierna', 'cuadriceps', 'maquina', 'w'],
  ['zancada-caminando', 'Zancadas caminando', 'cuadriceps', 'mancuernas', 'w'],
  // Pecho
  ['aperturas-polea-baja', 'Aperturas en polea baja', 'pecho', 'polea', 'w'],
  ['press-incl-maq', 'Press inclinado en máquina', 'pecho', 'maquina', 'w'],
  ['press-smith', 'Press de banca en Smith', 'pecho', 'maquina', 'w'],
  ['pullover-manc', 'Pullover con mancuerna', 'pecho', 'mancuernas', 'w'],
  // Espalda
  ['dominadas-asist', 'Dominadas asistidas en máquina', 'espalda', 'maquina', 'w'],
  ['remo-invertido', 'Remo invertido', 'espalda', 'corporal', 'bw'],
  ['remo-pendlay', 'Remo Pendlay', 'espalda', 'barra', 'w', 1],
  ['remo-pecho-apoyado', 'Remo con pecho apoyado', 'espalda', 'mancuernas', 'w'],
  ['jalon-unilateral', 'Jalón a un brazo en polea', 'espalda', 'polea', 'w'],
  // Hombros
  ['elev-lat-maq', 'Elevaciones laterales en máquina', 'hombros', 'maquina', 'w'],
  ['pajaros-maq', 'Pájaros en máquina', 'hombros', 'maquina', 'w'],
  ['press-landmine', 'Press landmine', 'hombros', 'barra', 'w'],
  // Bíceps
  ['curl-z', 'Curl con barra Z', 'biceps', 'barra', 'w'],
  ['curl-spider', 'Curl spider', 'biceps', 'mancuernas', 'w'],
  ['curl-bayesiano', 'Curl bayesiano en polea', 'biceps', 'polea', 'w'],
  ['curl-martillo-cuerda', 'Curl martillo con cuerda', 'biceps', 'polea', 'w'],
  // Tríceps
  ['fondos-maquina', 'Fondos en máquina', 'triceps', 'maquina', 'w'],
  ['ext-unilateral', 'Extensión a un brazo en polea', 'triceps', 'polea', 'w'],
  ['rompecraneos-manc', 'Rompecráneos con mancuernas', 'triceps', 'mancuernas', 'w'],
  ['flexiones-diamante', 'Flexiones diamante', 'triceps', 'corporal', 'bw'],
  // Cardio
  ['escaleras', 'Escaleras / stepper', 'cardio', 'maquina', 'c']
].map(([id, n, m, e, t, bar]) => ({ id, n, m, e, t, bar: !!bar, builtin: true }));

// ---------- Plantillas de rutinas ----------
// [ejercicio, series, reps objetivo, descanso en segundos]
const TEMPLATES = [
  {
    id: 'ppl', name: 'Empuje / Tirón / Pierna', desc: '3 rutinas, ideal para 3 o 6 días a la semana.',
    routines: [
      { name: 'Empuje', days: [1, 4], items: [
        ['press-banca', 4, '6-8', 150], ['press-incl-manc', 3, '8-10', 120], ['press-militar', 3, '6-8', 150],
        ['elev-laterales', 3, '12-15', 60], ['ext-cuerda', 3, '10-12', 60], ['ext-cabeza', 2, '12', 60]] },
      { name: 'Tirón', days: [2, 5], items: [
        ['peso-muerto', 3, '5', 180], ['dominadas', 3, '6-10', 120], ['remo-barra', 3, '8-10', 120],
        ['face-pull', 3, '15', 60], ['curl-barra', 3, '8-12', 60], ['curl-martillo', 2, '12', 60]] },
      { name: 'Pierna', days: [3, 6], items: [
        ['sentadilla', 4, '6-8', 180], ['peso-muerto-rumano', 3, '8-10', 150], ['prensa', 3, '10-12', 120],
        ['curl-femoral', 3, '10-12', 90], ['talones-pie', 4, '12-15', 60], ['plancha', 3, '45', 60]] }
    ]
  },
  {
    id: 'ul', name: 'Torso / Pierna', desc: '2 rutinas que se repiten, para 4 días a la semana.',
    routines: [
      { name: 'Torso', days: [1, 4], items: [
        ['press-banca', 4, '6-8', 150], ['remo-barra', 4, '6-8', 150], ['press-hombro-manc', 3, '8-10', 90],
        ['jalon-pecho', 3, '10-12', 90], ['curl-manc', 2, '10-12', 60], ['ext-polea', 2, '10-12', 60]] },
      { name: 'Pierna', days: [2, 5], items: [
        ['sentadilla', 4, '6-8', 180], ['peso-muerto-rumano', 3, '8-10', 150], ['sentadilla-bulgara', 3, '10', 90],
        ['curl-femoral-sent', 3, '10-12', 90], ['talones-sentado', 3, '15', 60], ['elev-piernas', 3, '12', 60]] }
    ]
  },
  {
    id: 'fb', name: 'Cuerpo completo', desc: '2 rutinas alternadas, para 3 días a la semana.',
    routines: [
      { name: 'Cuerpo completo A', days: [1, 5], items: [
        ['sentadilla', 3, '5', 180], ['press-banca', 3, '5', 180], ['remo-barra', 3, '5', 150],
        ['elev-laterales', 2, '12-15', 60], ['plancha', 3, '45', 60]] },
      { name: 'Cuerpo completo B', days: [3], items: [
        ['peso-muerto', 1, '5', 180], ['press-militar', 3, '5', 180], ['dominadas', 3, '6-10', 120],
        ['zancadas', 2, '10', 90], ['curl-manc', 2, '10-12', 60]] }
    ]
  }
];

// Colores de discos según el código de competencia
const PLATES_KG = [
  { w: 25, c: '#D3263A', h: 1.0 }, { w: 20, c: '#1E4FD8', h: 1.0 }, { w: 15, c: '#F2B200', h: 0.92 },
  { w: 10, c: '#1F9D57', h: 0.84 }, { w: 5, c: '#F4F4F2', h: 0.62 }, { w: 2.5, c: '#D3263A', h: 0.5 },
  { w: 1.25, c: '#B9C0C8', h: 0.42 }, { w: 0.5, c: '#B9C0C8', h: 0.34 }
];
const PLATES_LB = [
  { w: 45, c: '#1E4FD8', h: 1.0 }, { w: 35, c: '#F2B200', h: 0.92 }, { w: 25, c: '#1F9D57', h: 0.84 },
  { w: 10, c: '#F4F4F2', h: 0.62 }, { w: 5, c: '#D3263A', h: 0.5 }, { w: 2.5, c: '#B9C0C8', h: 0.42 }
];
