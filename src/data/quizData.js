export const CHECKOUT_URL = 'https://pay.hotmart.com/V107941841D?off=cvw1mkzw';
export const DOWNSELL_CHECKOUT_URL = 'https://pay.hotmart.com/V107941841D?off=j4kwpqwa';

export const ASSETS = {
  logo: '/assets/LOGO3-WGBt60gj.webp',
  hero: '/assets/hero-Buj0dMyA.webp',
  appMockup: '/assets/app2-DvhivXE3.webp',
  landingPromo: '/assets/landingpage_nova-D9AExXHH.webp',
  socialProof: '/images/social-1783313372611-ChatGPT_Image_5_de_jul._de_2026,_20_52_06.webp',
  gifs: {
    sales1: '/assets/gif-salespage-1-MfxSMHU2.gif',
    fit1: '/assets/gif-sales-page-2-CeepqVlc.gif',
    homeFit: '/assets/landingpage_nova-D9AExXHH.webp',
  },
  coach: {
    main: '/assets/coachapresentation1-BQaYGSJw.webp',
    alt: '/assets/coachapresentation-HCeA4fhh.webp',
  },
  results: [
    '/assets/ba1-BznIB2qC.jpg',
    '/assets/ba2-TWGQctri.jpg',
    '/assets/ba3-qTxyqyYZ.jpg',
    '/assets/ba4-C9laZ4pf.webp',
    '/assets/ba5-ejwaX96j.webp',
    '/assets/ba6-P_KDi3uZ.jpg',
  ],
  ages: {
    '18-29': '/assets/18-29-CINL6ef1.png',
    '30-39': '/assets/30-39-DlwPfCB7.png',
    '40-49': '/assets/40-50-DhYvfFZS.png',
    '50plus': '/assets/50_-BjiVXxuV.png',
  },
  avatars: [
    '/images/avatar-w1.png',
    '/images/avatar-w2.png',
    '/images/avatar-w3.png',
  ],
  vsl: '/assets/vsl-video.mp4',
  vslCover: '/assets/capa-vsl.gif'
};

export const QUIZ_STEPS = [
  {
    id: 1,
    slug: 'inicio-evaluacion',
    type: 'question',
    headerBadge: "🔥 Brazilian Booty",
    eyebrow: "Paso 1 de 14",
    title: "¿Quieres levantar, redondear y aumentar tus glúteos en 28 Días entrenando en casa?",
    subtitle: "Descubre la estimulación neuromuscular profunda (8-10 min/día) calibrada para tu tipo de cuerpo. Sin gimnasio, sin pesas pesadas y sin cirugías. 🚀",
    options: [
      { emoji: "😩", label: "No, me siento frustrada y quiero aumentar (+4 a +7 cm)", value: "frustrada" },
      { emoji: "💧", label: "Quiero eliminar la flacidez, la celulitis y reafirmar todo", value: "tonificar" },
      { emoji: "🍑", label: "Quiero esculpir el efecto 'Push-Up' redondo y firme", value: "esculpir" }
    ]
  },
  {
    id: 2,
    slug: 'edad',
    type: 'age',
    headerBadge: "Protocolo Glúteos Brasileños",
    eyebrow: "Paso 2 de 14",
    title: "Selecciona tu rango de edad",
    subtitle: "Esto ayuda a calcular tu tasa de respuesta muscular e intensidad metabólica.",
    options: [
      { label: "18 - 29 años", value: "18-29", image: ASSETS.ages["18-29"] },
      { label: "30 - 39 años", value: "30-39", image: ASSETS.ages["30-39"] },
      { label: "40 - 49 años", value: "40-49", image: ASSETS.ages["40-49"] },
      { label: "50+ años", value: "50plus", image: ASSETS.ages["50plus"] }
    ]
  },
  {
    id: 3,
    slug: 'medidas-corporales',
    type: 'body-metrics',
    headerBadge: "Protocolo Glúteos Brasileños",
    eyebrow: "Paso 3 de 14",
    title: "Ingresa tu Estatura y Peso Actual",
    subtitle: "Calcula tu Índice de Masa Corporal (IMC) y el nivel de resistencia neuromuscular para tus glúteos.",
    options: []
  },
  {
    id: 4,
    slug: 'molestia',
    type: 'question',
    headerBadge: "Protocolo Glúteos Brasileños",
    eyebrow: "Paso 4 de 14",
    title: "¿Qué es lo que más te molesta cuando te miras al espejo?",
    subtitle: "Identificar tu principal punto de insatisfacción permite activar el estímulo neuromuscular correcto.",
    options: [
      { emoji: "😩", label: "Mis glúteos pequeños o sin volumen", value: "pequeno" },
      { emoji: "💧", label: "Flacidez o falta de firmeza", value: "flacidez" },
      { emoji: "🍊", label: "Celulitis o piel irregular", value: "celulitis" },
      { emoji: "🍑", label: "Falta de elevación en la parte superior", value: "elevacion" }
    ]
  },
  {
    id: 5,
    slug: 'gluteo-timido',
    type: 'awareness',
    headerBadge: "Protocolo Glúteos Brasileños",
    eyebrow: "Paso 5 de 14",
    title: "¿Por qué entrenas duro y tus glúteos no reaccionan?",
    subtitle: "Descubre el fenómeno biomecánico de la amnesia glútea.",
    image: ASSETS.coach.alt,
    options: [
      { label: "✅ Ya lo sabía", value: "ya_lo_sabia" },
      { label: "❌ ¡No lo sabía!", value: "no_lo_sabia" }
    ]
  },
  {
    id: 6,
    slug: 'inseguridad',
    type: 'question',
    headerBadge: "Protocolo Glúteos Brasileños",
    eyebrow: "Paso 6 de 14",
    title: "¿Has dejado de usar ropa ajustada o trajes de baño por no sentirte confiada?",
    subtitle: "Nuestra meta es devolverte el 100% de tu autoestima y seguridad con tu cuerpo.",
    options: [
      { emoji: "👗", label: "Sí, con frecuencia me privo de usar ropa ajustada", value: "frecuencia" },
      { emoji: "😳", label: "A veces me siento un poco insegura", value: "a_veces" },
      { emoji: "✨", label: "No, pero me gustaría estar aún más tonificada y atractiva", value: "impactante" }
    ]
  },
  {
    id: 7,
    slug: 'creencia',
    type: 'question',
    headerBadge: "Protocolo Glúteos Brasileños",
    eyebrow: "Paso 7 de 14",
    title: "¿Crees que es posible transformar tus glúteos con entrenamientos rápidos y enfocados en casa?",
    subtitle: "La clave es el estímulo profundo de las fibras musculares, no horas agotadoras en el gimnasio.",
    options: [
      { emoji: "🔥", label: "¡Sí, estoy lista para empezar!", value: "lista" },
      { emoji: "❓", label: "Tengo dudas, pero me encantaría probar un método guiado", value: "dudas" },
      { emoji: "🏋️", label: "Pensaba que solo funcionaba con cargas pesadas", value: "pesas" }
    ]
  },
  {
    id: 8,
    slug: 'disposicion',
    type: 'question',
    headerBadge: "Protocolo Glúteos Brasileños",
    eyebrow: "Paso 8 de 14",
    title: "Si existiera un método comprobado que combine entrenamientos cortos y un plan de alimentación sencillo, ¿lo probarías?",
    subtitle: "Sin dietas extremas ni horas cansadas de cardio.",
    options: [
      { emoji: "✅", label: "Sí, 100% dispuesta a seguir el plan", value: "dispuesta_100" },
      { emoji: "😏", label: "Muéstrame resultados de alumnas primero", value: "ver_resultados" },
      { emoji: "🤨", label: "Dependería de los resultados prometidos", value: "dependeria" }
    ]
  },
  {
    id: 9,
    slug: 'tiempo',
    type: 'question',
    headerBadge: "Protocolo Glúteos Brasileños",
    eyebrow: "Paso 9 de 14",
    title: "¿Cuánto tiempo tienes disponible al día para hacer tus rutinas?",
    subtitle: "Ajustamos los ejercicios de forma ultraeficiente para adaptarse a tu rutina.",
    options: [
      { emoji: "⏱️", label: "8 a 10 minutos al día", value: "8_10min" },
      { emoji: "⏰", label: "10 a 20 minutos al día", value: "10_20min" },
      { emoji: "⏳", label: "Más de 20 minutos al día", value: "mas_20min" }
    ]
  },
  {
    id: 10,
    slug: 'dias-entrenamiento',
    type: 'question',
    headerBadge: "Protocolo Glúteos Brasileños",
    eyebrow: "Paso 10 de 14",
    title: "¿Cuántos días a la semana prefieres entrenar?",
    subtitle: "El descanso estratégico es fundamental para que el músculo crezca rápido.",
    options: [
      { emoji: "📅", label: "3 días a la semana", value: "3_dias" },
      { emoji: "📆", label: "4 a 5 días a la semana", value: "4_5_dias" },
      { emoji: "⚡", label: "Todos los días (rutinas exprés de 8 min)", value: "todos_dias" }
    ]
  },
  {
    id: 11,
    slug: 'comidas',
    type: 'question',
    headerBadge: "Protocolo Glúteos Brasileños",
    eyebrow: "Paso 11 de 14",
    title: "¿Cuántas comidas haces al día normalmente?",
    subtitle: "💡 ¡Esta es la clave de tu metabolismo! El Coach Luca descubrió que el 90% de las personas fallan aquí y por eso no logran definir ni levantar los glúteos.",
    options: [
      { emoji: "😴", label: "1 a 2 comidas al día", value: "1_2_comidas" },
      { emoji: "🍽️", label: "3 comidas básicas al día", value: "3_comidas" },
      { emoji: "✅", label: "4 a 5 comidas (incluyendo snacks)", value: "4_5_comidas" }
    ]
  },
  {
    id: 12,
    slug: 'coach-luca',
    type: 'coach',
    headerBadge: "Protocolo Glúteos Brasileños",
    eyebrow: "Paso 12 de 14",
    title: "Conoce al Coach Luca",
    subtitle: "Especialista internacional en biomecánica y moldeado de glúteos femeninos.",
    coachInfo: {
      experienceYears: "12+ Años",
      successCases: "12.000+",
      bio: "El Coach Luca desarrolló el Método Brazilian Booty, un sistema revolucionario de estimulación profunda que levanta, esculpe y aumenta los glúteos en casa sin dolor en las articulaciones.",
      mainImage: ASSETS.coach.main,
      altImage: ASSETS.coach.alt,
      results: ASSETS.results.slice(0, 3)
    },
    options: [
      { label: "Continuar al Diagnóstico Final", value: "continuar" }
    ]
  },
  {
    id: 13,
    slug: 'compromiso',
    type: 'question',
    headerBadge: "Protocolo Glúteos Brasileños",
    eyebrow: "Paso 13 de 14",
    title: "¿Cuál es tu nivel de compromiso para transformar tu cuerpo?",
    subtitle: "Buscamos mujeres totalmente dispuestas a ver resultados visibles en pocas semanas.",
    options: [
      { emoji: "🔥", label: "100% Comprometida - Daré lo mejor de mí", value: "compromiso_100" },
      { emoji: "👍", label: "Moderado - Iré a mi propio ritmo", value: "compromiso_moderado" },
      { emoji: "👀", label: "Curiosa - Quiero conocer la propuesta primero", value: "curiosa" }
    ]
  },
  {
    id: 14,
    slug: 'objetivo-final',
    type: 'goal',
    headerBadge: "Protocolo Glúteos Brasileños",
    eyebrow: "Paso 14 de 14",
    title: "¿Cuál es tu objetivo de glúteos ideal?",
    subtitle: "Selecciona la forma y silueta que deseas alcanzar.",
    options: [
      { emoji: "🍑", label: "Levantados y Firmes (Efecto Push-Up)", value: "elevado" },
      { emoji: "✨", label: "Esculpidos y Definidos (Sin Flacidez)", value: "esculpido" },
      { emoji: "💪", label: "Tonificados y Atléticos", value: "tonificado" },
      { emoji: "🔴", label: "Redondos y con Más Volumen", value: "redondo" }
    ]
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Carolina M.",
    age: "34 años",
    location: "Madrid, España",
    avatar: ASSETS.avatars[0],
    rating: 5,
    text: "En solo 3 semanas mis glúteos se ven visiblemente levantados y firmes. Las rutinas de 8 minutos son superprácticas en mi día a día.",
    resultBadge: "+5.5 cm en 28 Días"
  },
  {
    id: 2,
    name: "Valeria G.",
    age: "29 años",
    location: "Ciudad de México, México",
    avatar: ASSETS.avatars[1],
    rating: 5,
    text: "No creía que sin gimnasio diera este resultado. La celulitis desapareció casi por completo. ¡100% recomendado!",
    resultBadge: "Sin Flacidez • Firmeza Total"
  },
  {
    id: 3,
    name: "Mariana R.",
    age: "41 años",
    location: "Bogotá, Colombia",
    avatar: ASSETS.avatars[2],
    rating: 5,
    text: "Tengo dos hijos y poco tiempo libre. Este programa me devolvió la confianza para usar traje de baño sin pena. ¡Muchas gracias al Coach Luca!",
    resultBadge: "Efecto Push-Up Real"
  }
];

export const BEFORE_AFTER_CASES = [
  {
    id: 1,
    title: "Caso 1: Firmeza Exprés",
    name: "Carolina M.",
    detail: "Resultados en 14 Días",
    result: "+5.2 cm Elevación",
    image: ASSETS.results[0],
    tag: "98.4% Elevación"
  },
  {
    id: 2,
    title: "Caso 2: Aumento de Volumen",
    name: "Valeria G.",
    detail: "Resultados en 21 Días",
    result: "+6.0 cm Volumen",
    image: ASSETS.results[1],
    tag: "+6.0 cm Volumen"
  },
  {
    id: 3,
    title: "Caso 3: Adiós Celulitis",
    name: "Mariana R.",
    detail: "Resultados en 28 Días",
    result: "Piel 100% Lisa",
    image: ASSETS.results[2],
    tag: "Piel Lisa"
  },
  {
    id: 4,
    title: "Caso 4: Efecto Push-Up",
    name: "Lucía P.",
    detail: "Resultados en 28 Días",
    result: "Definición Máxima",
    image: ASSETS.results[3],
    tag: "Definición Máxima"
  }
];

