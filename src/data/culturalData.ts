// Types
export interface Region {
  id: string;
  name: string;
  description: string;
  coordinates: { lat: number; lng: number };
  image: string;
  culturalElements: CulturalElement[];
}

export interface CulturalElement {
  id: string;
  name: string;
  description: string;
  type: "monument" | "tradition" | "craft" | "festival" | "cuisine";
  images: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  regionId: string;
  date: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  description: string;
  audioUrl: string;
  imageUrl: string;
  duration: string;
  category: string;
  regionId: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

// Mock data for regions
export const regions: Region[] = [
  {
    id: "atlantique",
    name: "Atlantique",
    description:
      "Située au sud du Bénin, cette région côtière abrite Cotonou, la capitale économique, et est riche en traditions vaudou et en festivals colorés.",
    coordinates: { lat: 6.3676953, lng: 2.4252507 },
    image: "/images/regions/atlantique.jpg",
    culturalElements: [
      {
        id: "vodun-festival",
        name: "Festival Vodun",
        description:
          "Le Festival International des Arts et Culture Vodun est une célébration annuelle mettant en valeur les traditions vaudou béninoises, avec des cérémonies, danses et musiques traditionnelles.",
        type: "festival",
        images: [
          "/images/cultural/vodun-festival-1.jpg",
          "/images/cultural/vodun-festival-2.jpg",
        ],
      },
      {
        id: "ganvie-village",
        name: "Village de Ganvié",
        description:
          "Souvent appelé la 'Venise de l'Afrique', Ganvié est un village lacustre construit sur pilotis sur le lac Nokoué, où les habitants vivent principalement de la pêche.",
        type: "monument",
        images: [
          "/images/cultural/ganvie-1.jpg",
          "/images/cultural/ganvie-2.jpg",
        ],
      },
    ],
  },
  {
    id: "zou",
    name: "Zou",
    description:
      "La région de Zou est connue pour ses sites royaux d'Abomey, inscrit au patrimoine mondial de l'UNESCO, et ses traditions royales du royaume du Dahomey.",
    coordinates: { lat: 7.1865699, lng: 2.0529348 },
    image: "/images/regions/zou.jpg",
    culturalElements: [
      {
        id: "palais-abomey",
        name: "Palais Royaux d'Abomey",
        description:
          "Les Palais Royaux d'Abomey, classés au patrimoine mondial de l'UNESCO, sont un ensemble de palais où résidaient les rois du Dahomey. Ils abritent aujourd'hui un musée historique avec des objets royaux.",
        type: "monument",
        images: [
          "/images/cultural/abomey-1.jpg",
          "/images/cultural/abomey-2.jpg",
        ],
      },
      {
        id: "tapisserie-abomey",
        name: "Tapisseries d'Abomey",
        description:
          "Les tapisseries d'Abomey sont des œuvres textiles traditionnelles qui racontent l'histoire et les légendes du royaume du Dahomey à travers des appliqués colorés sur tissu.",
        type: "craft",
        images: [
          "/images/cultural/tapisserie-1.jpg",
          "/images/cultural/tapisserie-2.jpg",
        ],
      },
    ],
  },
  {
    id: "collines",
    name: "Collines",
    description:
      "Située au centre du Bénin, cette région est connue pour ses collines pittoresques, ses sites sacrés et ses danses traditionnelles représentant l'équilibre entre l'homme et la nature.",
    coordinates: { lat: 8.0500146, lng: 2.2913988 },
    image: "/images/regions/collines.jpg",
    culturalElements: [
      {
        id: "danse-guele",
        name: "Danse Guèlèdé",
        description:
          "La danse Guèlèdé, reconnue par l'UNESCO comme patrimoine culturel immatériel, est une expression culturelle mêlant masques sculptés, musique et danse, honorant les pouvoirs féminins.",
        type: "tradition",
        images: [
          "/images/cultural/guelede-1.jpg",
          "/images/cultural/guelede-2.jpg",
        ],
      },
      {
        id: "collines-dassa",
        name: "Collines sacrées de Dassa",
        description:
          "Les collines de Dassa-Zoumè sont considérées comme sacrées et abritent des sanctuaires et lieux de culte traditionnels, témoins des croyances ancestrales.",
        type: "monument",
        images: [
          "/images/cultural/dassa-1.jpg",
          "/images/cultural/dassa-2.jpg",
        ],
      },
    ],
  },
  {
    id: "borgou",
    name: "Borgou",
    description:
      "Le Borgou, région du nord-est, est riche en traditions des peuples Bariba et Fulani, avec une histoire marquée par les anciens royaumes et l'élevage traditionnel.",
    coordinates: { lat: 9.3095699, lng: 2.9408088 },
    image: "/images/regions/borgou.jpg",
    culturalElements: [
      {
        id: "gaani-festival",
        name: "Festival Gaani",
        description:
          "Le festival Gaani est une célébration annuelle du peuple Bariba qui marque le début de la nouvelle année selon leur calendrier traditionnel, avec des danses, de la musique et des cérémonies.",
        type: "festival",
        images: [
          "/images/cultural/gaani-1.jpg",
          "/images/cultural/gaani-2.jpg",
        ],
      },
      {
        id: "cuisine-borgou",
        name: "Cuisine du Borgou",
        description:
          "La cuisine du Borgou est caractérisée par des plats comme le 'tchiakpalo' (boulettes de mil) et le 'kilishi' (viande séchée épicée), reflétant les traditions culinaires des peuples de la région.",
        type: "cuisine",
        images: [
          "/images/cultural/cuisine-borgou-1.jpg",
          "/images/cultural/cuisine-borgou-2.jpg",
        ],
      },
    ],
  },
  {
    id: "atacora",
    name: "Atacora",
    description:
      "L'Atacora, région montagneuse du nord-ouest, est connue pour ses paysages spectaculaires, ses tatas somba (maisons forteresses) et sa diversité ethnique.",
    coordinates: { lat: 10.3009042, lng: 1.3792771 },
    image: "/images/regions/atacora.jpg",
    culturalElements: [
      {
        id: "tata-somba",
        name: "Tata Somba",
        description:
          "Les Tata Somba sont des habitations traditionnelles en forme de château-fort construites par le peuple Somba. Ces structures en terre sont parfaitement adaptées au climat local et reflètent l'organisation sociale.",
        type: "monument",
        images: [
          "/images/cultural/tata-somba-1.jpg",
          "/images/cultural/tata-somba-2.jpg",
        ],
      },
      {
        id: "artisanat-atacora",
        name: "Artisanat de l'Atacora",
        description:
          "L'artisanat de l'Atacora comprend la poterie, le travail du métal et la fabrication d'instruments de musique uniques comme les tambours parlants, transmis de génération en génération.",
        type: "craft",
        images: [
          "/images/cultural/artisanat-atacora-1.jpg",
          "/images/cultural/artisanat-atacora-2.jpg",
        ],
      },
    ],
  },
];

// Mock data for gallery
export const galleryItems: GalleryItem[] = [
  {
    id: "gallery-1",
    title: "Masque Guèlèdé",
    description:
      "Masque traditionnel Guèlèdé, inscrit au patrimoine immatériel de l'UNESCO, utilisé lors des cérémonies honorant le pouvoir féminin mystique.",
    imageUrl: "/images/gallery/masque-guelede.jpg",
    category: "Art",
    regionId: "collines",
    date: "2023-03-15",
  },
  {
    id: "gallery-2",
    title: "Palais Royal d'Abomey",
    description:
      "Vue du palais royal d'Abomey, ancienne capitale du royaume du Dahomey, classé au patrimoine mondial de l'UNESCO.",
    imageUrl: "/images/gallery/palais-abomey.jpg",
    category: "Architecture",
    regionId: "zou",
    date: "2023-02-10",
  },
  {
    id: "gallery-3",
    title: "Danse Zangbeto",
    description:
      "Performance de la danse Zangbeto, les gardiens de la nuit traditionnels, considérés comme manifestations de fantômes vaudou.",
    imageUrl: "/images/gallery/zangbeto.jpg",
    category: "Danse",
    regionId: "atlantique",
    date: "2023-04-22",
  },
  {
    id: "gallery-4",
    title: "Tata Somba",
    description:
      "Maison forteresse traditionnelle du peuple Somba, construite avec des matériaux locaux et adaptée au climat de la région.",
    imageUrl: "/images/gallery/tata-somba.jpg",
    category: "Architecture",
    regionId: "atacora",
    date: "2023-01-30",
  },
  {
    id: "gallery-5",
    title: "Festival Vodun",
    description:
      "Célébration colorée lors du Festival Vodun du 10 janvier, jour national consacré aux pratiques vaudou.",
    imageUrl: "/images/gallery/festival-vodun.jpg",
    category: "Festival",
    regionId: "atlantique",
    date: "2023-01-10",
  },
  {
    id: "gallery-6",
    title: "Tapisserie d'Abomey",
    description:
      "Appliqué d'Abomey représentant des scènes historiques du royaume du Dahomey, confectionné par des artisans suivant des techniques ancestrales.",
    imageUrl: "/images/gallery/applique-abomey.jpg",
    category: "Art",
    regionId: "zou",
    date: "2023-05-05",
  },
];

// Mock data for audio tracks
export const audioTracks: AudioTrack[] = [
  {
    id: "audio-1",
    title: "Rythmes du Tambour Parlant",
    artist: "Ensemble Traditionnel du Bénin",
    description:
      "Enregistrement de tambours parlants utilisés traditionnellement pour communiquer entre villages, transmettant des messages codés à travers les battements.",
    audioUrl: "/audio/tambours-parlants.mp3",
    imageUrl: "/images/audio/tambours.jpg",
    duration: "4:32",
    category: "Percussion",
    regionId: "atacora",
  },
  {
    id: "audio-2",
    title: "Chants Vodun",
    artist: "Chorale Vodun de Ouidah",
    description:
      "Chants cérémoniels vodun interprétés lors des rituels spirituels, invoquant les divinités et les esprits ancestraux.",
    audioUrl: "/audio/chants-vodun.mp3",
    imageUrl: "/images/audio/vodun.jpg",
    duration: "5:17",
    category: "Chant Traditionnel",
    regionId: "atlantique",
  },
  {
    id: "audio-3",
    title: "Musique de Cour Royale",
    artist: "Musiciens du Palais d'Abomey",
    description:
      "Reconstitution de musiques jouées à la cour des rois du Dahomey, mêlant instruments traditionnels et chants de louanges.",
    audioUrl: "/audio/cour-royale.mp3",
    imageUrl: "/images/audio/cour-royale.jpg",
    duration: "6:05",
    category: "Musique Royale",
    regionId: "zou",
  },
  {
    id: "audio-4",
    title: "Berceuses Peules",
    artist: "Femmes Peules du Borgou",
    description:
      "Collection de berceuses transmises oralement par les femmes peules pour endormir les enfants, racontant des histoires et légendes locales.",
    audioUrl: "/audio/berceuses-peules.mp3",
    imageUrl: "/images/audio/peul.jpg",
    duration: "3:48",
    category: "Berceuse",
    regionId: "borgou",
  },
  {
    id: "audio-5",
    title: "Téké - Rythmes de Célébration",
    artist: "Groupe Téké de Savalou",
    description:
      "Rythmes et chants du Téké, musique de fête jouée lors des célébrations et réjouissances populaires dans la région des Collines.",
    audioUrl: "/audio/teke.mp3",
    imageUrl: "/images/audio/teke.jpg",
    duration: "5:52",
    category: "Musique de Fête",
    regionId: "collines",
  },
];

// Mock data for quiz questions
export const quizQuestions: QuizQuestion[] = [
  // Questions faciles
  {
    id: "quiz-1",
    question: "Quelle ville béninoise est connue comme le berceau du Vodun?",
    options: ["Cotonou", "Abomey", "Ouidah", "Porto-Novo"],
    correctAnswer: 2,
    explanation:
      "Ouidah est considérée comme le berceau du Vodun au Bénin. La ville accueille chaque année le Festival International des Arts et Culture Vodun le 10 janvier.",
    category: "Histoire et Religion",
    difficulty: "easy",
  },
  {
    id: "quiz-2",
    question: "Quel royaume historique béninois avait pour capitale Abomey?",
    options: [
      "Royaume d'Allada",
      "Royaume du Dahomey",
      "Royaume de Porto-Novo",
      "Royaume de Nikki",
    ],
    correctAnswer: 1,
    explanation:
      "Le Royaume du Dahomey avait pour capitale Abomey. Ses palais royaux sont aujourd'hui classés au patrimoine mondial de l'UNESCO.",
    category: "Histoire et Religion",
    difficulty: "medium",
  },
  {
    id: "quiz-3",
    question:
      "Comment s'appelle l'habitation traditionnelle du peuple Somba dans l'Atacora?",
    options: ["Case ronde", "Tata Somba", "Maison lacustre", "Concession"],
    correctAnswer: 1,
    explanation:
      "Le Tata Somba est une habitation traditionnelle en forme de château-fort construite par le peuple Somba dans la région de l'Atacora.",
    category: "Architecture",
    difficulty: "medium",
  },
  {
    id: "quiz-4",
    question:
      "Quelle danse traditionnelle béninoise, inscrite au patrimoine immatériel de l'UNESCO, utilise des masques ornés de sculptures?",
    options: ["Zangbeto", "Egungun", "Guèlèdé", "Agbadja"],
    correctAnswer: 2,
    explanation:
      "La danse Guèlèdé, inscrite au patrimoine culturel immatériel de l'UNESCO, utilise des masques sculptés pour honorer le pouvoir mystique féminin.",
    category: "Arts et Traditions",
    difficulty: "hard",
  },
  {
    id: "quiz-5",
    question:
      "Quel plat traditionnel béninois est préparé à base de pâte de maïs fermenté?",
    options: ["Akassa", "Amiwo", "Sagbo", "Ablo"],
    correctAnswer: 0,
    explanation:
      "L'Akassa est un plat traditionnel béninois préparé à base de pâte de maïs fermenté. Il accompagne souvent des sauces épicées et du poisson.",
    category: "Cuisine",
    difficulty: "easy",
  },
  {
    id: "quiz-6",
    question: "Quelle est la capitale économique du Bénin ?",
    options: ["Porto-Novo", "Cotonou", "Abomey", "Parakou"],
    correctAnswer: 1,
    explanation:
      "Cotonou est la capitale économique du Bénin, bien que Porto-Novo soit la capitale politique.",
    category: "Géographie",
    difficulty: "easy",
  },
  {
    id: "quiz-7",
    question:
      "Dans quelle région du Bénin se trouve le village lacustre de Ganvié ?",
    options: ["Atlantique", "Zou", "Borgou", "Atacora"],
    correctAnswer: 0,
    explanation:
      "Le village de Ganvié, surnommé la \"Venise de l'Afrique\", est situé dans la région de l'Atlantique sur le lac Nokoué.",
    category: "Géographie",
    difficulty: "medium",
  },
  {
    id: "quiz-8",
    question:
      "Quelle technique artisanale est particulièrement célèbre à Abomey ?",
    options: ["La poterie", "Les appliqués", "La vannerie", "La forge"],
    correctAnswer: 1,
    explanation:
      "Les appliqués d'Abomey sont des tapisseries traditionnelles qui racontent l'histoire du royaume à travers des motifs colorés.",
    category: "Artisanat",
    difficulty: "medium",
  },
  {
    id: "quiz-9",
    question:
      "Quel est le nom de la fête traditionnelle du 10 janvier au Bénin ?",
    options: [
      "Fête de l'igname",
      "Fête du Vodun",
      "Fête de la moisson",
      "Fête des religions",
    ],
    correctAnswer: 1,
    explanation:
      "Le 10 janvier est la Fête Nationale du Vodun au Bénin, une journée dédiée aux pratiques et traditions vaudou.",
    category: "Culture",
    difficulty: "easy",
  },
  {
    id: "quiz-10",
    question: 'Quelle est la signification du mot "Dahomey" ?',
    options: [
      "Terre des rois",
      "Ventre du serpent",
      "Pays des palmiers",
      "Terre des braves",
    ],
    correctAnswer: 1,
    explanation:
      'Dahomey signifie "Dans le ventre de Dan (serpent)", faisant référence à la légende de la fondation du royaume.',
    category: "Histoire",
    difficulty: "hard",
  },
];
