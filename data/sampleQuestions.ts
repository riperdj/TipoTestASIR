import { Question } from '../types';

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: "sq-1",
    question: "¿Cuál es la forma política del Estado español según el artículo 1.3 de la Constitución de 1978?",
    options: [
      "República parlamentaria",
      "Monarquía parlamentaria",
      "Monarquía constitucional federal",
      "Estado social democrático"
    ],
    correctAnswerIndex: 1,
    explanation: "El artículo 1.3 de la Constitución Española establece expresamente: 'La forma política del Estado español es la Monarquía parlamentaria'."
  },
  {
    id: "sq-2",
    question: "¿En qué año se aprobó la Constitución Española actual en referéndum por el pueblo español?",
    options: [
      "1975",
      "1977",
      "1978",
      "1982"
    ],
    correctAnswerIndex: 2,
    explanation: "La Constitución Española fue ratificada en referéndum el 6 de diciembre de 1978."
  },
  {
    id: "sq-3",
    question: "¿Cuál es el órgano de gobierno de los jueces en España?",
    options: [
      "El Tribunal Constitucional",
      "El Consejo General del Poder Judicial (CGPJ)",
      "El Ministerio de Justicia",
      "La Sala de Gobierno del Tribunal Supremo"
    ],
    correctAnswerIndex: 1,
    explanation: "El Consejo General del Poder Judicial (CGPJ) es el órgano de gobierno del Poder Judicial, según el artículo 122.2 de la CE."
  },
  {
    id: "sq-4",
    question: "¿Cuántos miembros componen el Tribunal Constitucional?",
    options: [
      "10 miembros",
      "12 miembros",
      "15 miembros",
      "20 miembros"
    ],
    correctAnswerIndex: 1,
    explanation: "El Tribunal Constitucional se compone de 12 miembros nombrados por el Rey a propuesta del Congreso, Senado, Gobierno y CGPJ."
  },
  {
    id: "sq-5",
    question: "¿Quién ostenta el mando supremo de las Fuerzas Armadas en España?",
    options: [
      "El Presidente del Gobierno",
      "El Ministro de Defensa",
      "El Jefe del Estado Mayor de la Defensa (JEMAD)",
      "El Rey"
    ],
    correctAnswerIndex: 3,
    explanation: "Según el artículo 62.h de la Constitución, corresponde al Rey el mando supremo de las Fuerzas Armadas."
  },
  {
    id: "sq-6",
    question: "¿Cuál es el plazo máximo de la detención preventiva sin puesta a disposición judicial ordinaria?",
    options: [
      "24 horas",
      "48 horas",
      "72 horas",
      "96 horas"
    ],
    correctAnswerIndex: 2,
    explanation: "El artículo 17.2 de la CE establece un plazo máximo de 72 horas para que el detenido sea puesto en libertad o a disposición judicial."
  },
  {
    id: "sq-7",
    question: "¿Qué mayoría se exige en el Congreso para la investidura del Presidente del Gobierno en primera votación?",
    options: [
      "Mayoría simple",
      "Mayoría absoluta",
      "Mayoría de tres quintos",
      "Mayoría de dos tercios"
    ],
    correctAnswerIndex: 1,
    explanation: "En primera votación se requiere la mayoría absoluta de los miembros del Congreso de los Diputados (art. 99.3 CE)."
  },
  {
    id: "sq-8",
    question: "¿Cuál es el planeta más grande del sistema solar?",
    options: [
      "Saturno",
      "Júpiter",
      "Neptuno",
      "Urano"
    ],
    correctAnswerIndex: 1,
    explanation: "Júpiter es el planeta más grande del sistema solar, con una masa más de dos veces superior a la de todos los demás planetas juntos."
  },
  {
    id: "sq-9",
    question: "¿Cuál es la velocidad aproximada de la luz en el vacío?",
    options: [
      "150.000 km/s",
      "300.000 km/s",
      "500.000 km/s",
      "1.000.000 km/s"
    ],
    correctAnswerIndex: 1,
    explanation: "La velocidad de la luz en el vacío es de aproximadamente 299.792 km/s (redondeado a 300.000 km/s)."
  },
  {
    id: "sq-10",
    question: "¿Qué orgánulo celular es conocido como la central energética de la célula?",
    options: [
      "El núcleo",
      "El retículo endoplasmático",
      "La mitocondria",
      "El aparato de Golgi"
    ],
    correctAnswerIndex: 2,
    explanation: "Las mitocondrias son los orgánulos encargados de generar la mayor parte de la energía química celular mediante ATP."
  },
  {
    id: "sq-11",
    question: "¿Quién escribió la obra cumbre 'Don Quijote de la Mancha'?",
    options: [
      "Lope de Vega",
      "Miguel de Cervantes",
      "Francisco de Quevedo",
      "Pedro Calderón de la Barca"
    ],
    correctAnswerIndex: 1,
    explanation: "Miguel de Cervantes Saavedra publicó la primera parte de 'El ingenioso hidalgo don Quijote de la Mancha' en 1605."
  },
  {
    id: "sq-12",
    question: "¿Cuál es el río más largo de la península ibérica?",
    options: [
      "Río Ebro",
      "Río Tajo",
      "Río Duero",
      "Río Guadalquivir"
    ],
    correctAnswerIndex: 1,
    explanation: "El río Tajo es el más largo de la península ibérica con una longitud aproximada de 1.007 km."
  },
  {
    id: "sq-13",
    question: "¿Cuál es la capital de Australia?",
    options: [
      "Sídney",
      "Melbourne",
      "Canberra",
      "Brisbane"
    ],
    correctAnswerIndex: 2,
    explanation: "Canberra es la capital federal de Australia, seleccionada en 1908 como un compromiso entre Sídney y Melbourne."
  },
  {
    id: "sq-14",
    question: "¿Qué elemento químico tiene el símbolo atómico 'Fe'?",
    options: [
      "Flúor",
      "Fósforo",
      "Hierro",
      "Francio"
    ],
    correctAnswerIndex: 2,
    explanation: "El símbolo 'Fe' proviene del latín 'ferrum' y corresponde al hierro."
  },
  {
    id: "sq-15",
    question: "¿Cuál es el gas más abundante en la atmósfera terrestre?",
    options: [
      "Oxígeno",
      "Dióxido de carbono",
      "Nitrógeno",
      "Argón"
    ],
    correctAnswerIndex: 2,
    explanation: "El nitrógeno compone aproximadamente el 78% de la atmósfera terrestre."
  },
  {
    id: "sq-16",
    question: "¿En qué año llegó el hombre a la Luna por primera vez con la misión Apolo 11?",
    options: [
      "1965",
      "1969",
      "1971",
      "1973"
    ],
    correctAnswerIndex: 1,
    explanation: "Neil Armstrong y Buzz Aldrin alunizaron el 20 de julio de 1969 a bordo del módulo lunar de la misión Apolo 11."
  },
  {
    id: "sq-17",
    question: "¿Cuál es el océano más grande y profundo de la Tierra?",
    options: [
      "Océano Atlántico",
      "Océano Índico",
      "Océano Ártico",
      "Océano Pacífico"
    ],
    correctAnswerIndex: 3,
    explanation: "El Océano Pacífico abarca más de un tercio de la superficie terrestre y contiene la fosa de las Marianas."
  },
  {
    id: "sq-18",
    question: "¿Quién formuló la teoría de la relatividad general en 1915?",
    options: [
      "Isaac Newton",
      "Albert Einstein",
      "Niels Bohr",
      "Max Planck"
    ],
    correctAnswerIndex: 1,
    explanation: "Albert Einstein publicó la teoría de la relatividad general en 1915, reformulando el concepto de la gravedad."
  },
  {
    id: "sq-19",
    question: "¿Cuál es el hueso más largo del cuerpo humano?",
    options: [
      "Tibia",
      "Fémur",
      "Húmero",
      "Radio"
    ],
    correctAnswerIndex: 1,
    explanation: "El fémur, ubicado en el muslo, es el hueso más largo, fuerte y voluminoso del cuerpo humano."
  },
  {
    id: "sq-20",
    question: "¿Qué país tiene la mayor extensión territorial del mundo?",
    options: [
      "Canadá",
      "China",
      "Estados Unidos",
      "Rusia"
    ],
    correctAnswerIndex: 3,
    explanation: "Rusia es el país más grande del mundo con más de 17 millones de kilómetros cuadrados."
  }
];
