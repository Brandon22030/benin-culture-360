import { GoogleGenerativeAI } from "@google/generative-ai";
import { QuizQuestion } from "@/data/culturalData";
import { quizQuestions } from "@/data/culturalData";

// Fonction de validation des questions
const validateQuizQuestion = (question: Partial<QuizQuestion>): boolean => {
  // Logs de débogage pour comprendre les problèmes de validation
  const validationLogs: string[] = [];

  // Vérification de l'ID
  if (!question.id?.trim()) {
    validationLogs.push("ID manquant ou vide");
  }

  // Vérification de la question
  if (!question.question?.trim()) {
    validationLogs.push("Question manquante ou vide");
  } else if ((question.question?.trim().length || 0) < 10) {
    validationLogs.push("Question trop courte");
  }

  // Vérification des options
  if (!question.options) {
    validationLogs.push("Options manquantes");
  } else {
    if (question.options.length < 3 || question.options.length > 4) {
      validationLogs.push("Nombre d'options invalide");
    }

    const uniqueOptions = new Set(question.options);
    if (uniqueOptions.size !== question.options.length) {
      validationLogs.push("Options non uniques");
    }

    if (question.options.some((opt: string) => !opt || opt.trim().length < 1)) {
      validationLogs.push("Options vides ou trop courtes");
    }
  }

  // Vérification de la réponse correcte
  if (typeof question.correctAnswer !== "number") {
    validationLogs.push("Type de réponse correcte invalide");
  } else if (
    question.correctAnswer < 0 ||
    question.correctAnswer >= (question.options?.length || 0)
  ) {
    console.warn(
      `Correction de l'index de réponse: ${question.correctAnswer} pour ${question.options?.length} options`,
    );
    // Correction automatique de l'index de réponse
    question.correctAnswer = Math.min(
      question.correctAnswer,
      (question.options?.length || 1) - 1,
    );
  }

  // Vérification de l'explication
  if (!question.explanation?.trim()) {
    validationLogs.push("Explication manquante ou vide");
  } else if ((question.explanation?.trim().length || 0) < 20) {
    validationLogs.push("Explication trop courte");
  }

  // Vérification de la catégorie
  if (!question.category?.trim()) {
    validationLogs.push("Catégorie manquante ou vide");
  }

  // Vérification de la difficulté
  if (!question.difficulty?.trim()) {
    validationLogs.push("Difficulté manquante ou vide");
  }

  // Log des problèmes de validation si présents
  if (validationLogs.length > 0) {
    console.warn("Problèmes de validation pour la question:", question);
    console.warn("Détails:", validationLogs);
    return false;
  }

  // Vérifier que l'explication contient un indice de la réponse correcte
  const correctOption = question.options?.[question.correctAnswer || 0];
  if (
    correctOption &&
    !question.explanation?.toLowerCase().includes(correctOption.toLowerCase())
  ) {
    console.warn("Attention : Explication potentiellement incohérente");
    return false;
  }

  return true;
};

const geminiKey =
  import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

export const generateQuizQuestions = async (
  numberOfQuestions: number = 10,
  difficulty: "easy" | "medium" | "hard" = "medium",
  useAI: boolean = true,
): Promise<QuizQuestion[]> => {
  // Stocker l'état global de génération
  const generationState = {
    inProgress: true,
    currentAttempt: 1,
    maxAttempts: 3,
  };
  if (!useAI || !geminiKey) {
    generationState.inProgress = false;
    return fallbackQuestions(numberOfQuestions, difficulty);
  }

  try {
    const result = await generateGeminiQuiz(
      numberOfQuestions,
      difficulty,
      0,
      generationState,
    );
    generationState.inProgress = false;
    return result;
  } catch (error) {
    // console.error("Erreur lors de la génération de quiz avec Gemini :", error);
    generationState.inProgress = false;
    return fallbackQuestions(numberOfQuestions, difficulty);
  }
};

const generateGeminiQuiz = async (
  numberOfQuestions: number,
  difficulty: "easy" | "medium" | "hard",
  attempts = 0,
  generationState?: { currentAttempt: number; maxAttempts: number },
): Promise<QuizQuestion[]> => {
  // Stocker l'état de progression
  const generationProgress = {
    currentAttempt: attempts + 1,
    maxAttempts: 3,
  };
  // Limiter le nombre de tentatives à 3
  if (
    attempts >= 3 ||
    (generationState &&
      generationState.currentAttempt >= generationState.maxAttempts)
  ) {
    if (import.meta.env.DEV) {
      console.warn(
        `Nombre maximum de tentatives atteint. Utilisation des questions prédéfinies.`,
      );
    }
    return fallbackQuestions(numberOfQuestions, difficulty);
  }

  // Mettre à jour l'état de génération si disponible
  if (generationState) {
    generationState.currentAttempt = attempts + 1;
  }

  // if (import.meta.env.DEV) {
  //   console.log(
  //     `🔍 Génération de ${numberOfQuestions} questions (Difficulté: ${difficulty}, Tentative: ${attempts + 1})`,
  //   );
  // }

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Génère un quiz de ${numberOfQuestions} questions UNIQUES et ORIGINALES sur la culture béninoise (difficulté : ${difficulty}).

  RÈGLES CRUCIALES :
  - Questions 100% originales et spécifiques
  - Chaque question DOIT avoir :
    * Une formulation claire et précise
    * 4 options de réponse distinctes
    * Une explication DÉTAILLÉE qui inclut explicitement la réponse correcte
    * Un lien direct avec la culture béninoise

  INSTRUCTIONS TECHNIQUES :
  - L'explication DOIT contenir mot-à-mot l'option correcte
  - Difficulté adaptée : ${difficulty}
  - Éviter les questions trop générales

  Thèmes à approfondir :
  - Histoire précoloniale
  - Traditions locales
  - Art et patrimoine
  - Géographie culturelle
  - Langues et ethnies
  - Pratiques traditionnelles

  Format JSON STRICT :
  {
    "theme": "Thème culturel précis",
    "questions": [
      {
        "id": "quiz-unique-id",
        "question": "Question spécifique et originale",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": 1,
        "explanation": "Explication INCLUANT l'option correcte mot-à-mot",
        "category": "Catégorie culturelle précise",
        "difficulty": "${difficulty}"
      }
    ]
  }`;

  try {
    // if (import.meta.env.DEV) {
    //   console.log("📡 Envoi de la requête à Gemini...");
    // }
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // if (import.meta.env.DEV) {
    //   console.log("📄 Réponse brute Gemini :", text);
    // }

    // Extraction du JSON avec une regex plus robuste
    const jsonMatch = text.match(/\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}/);
    if (!jsonMatch) {
      // if (import.meta.env.DEV) {
      //   console.error("❌ Pas de JSON valide trouvé");
      // }
      // Réessayer avec une nouvelle tentative
      return generateGeminiQuiz(numberOfQuestions, difficulty, attempts + 1);
    }

    // if (import.meta.env.DEV) {
    //   console.log("🔍 JSON extrait :", jsonMatch[0]);
    // }

    let parsedQuizData;
    try {
      // Nettoyer le JSON avant de parser
      const cleanedJson = jsonMatch[0]
        .replace(/,\s*]/g, "]") // Supprimer les virgules traînantes
        .replace(/,\s*}/g, "}") // Supprimer les virgules traînantes
        .replace(/,\s*,/g, ","); // Supprimer les virgules doubles

      parsedQuizData = JSON.parse(cleanedJson);
    } catch (parseError) {
      // if (import.meta.env.DEV) {
      //   console.error(
      //     "❌ Erreur de parsing JSON :",
      //     parseError,
      //     "JSON brut :",
      //     jsonMatch[0],
      //   );
      // }
      // Réessayer avec une nouvelle tentative
      return generateGeminiQuiz(numberOfQuestions, difficulty, attempts + 1);
    }

    const generatedQuestions = parsedQuizData.questions || [];

    // Filtrer et valider les questions
    const validQuestions =
      parsedQuizData.questions.filter(validateQuizQuestion);

    // Compléter avec des questions prédéfinies si moins de 10 questions valides
    if (validQuestions.length < numberOfQuestions) {
      console.warn(
        `Seulement ${validQuestions.length} questions valides générées. Complétion avec des questions de secours.`,
      );
      const predefinedQuestions = fallbackQuestions(
        numberOfQuestions - validQuestions.length,
        difficulty,
      );
      return [...validQuestions, ...predefinedQuestions].slice(
        0,
        numberOfQuestions,
      );
    }

    return validQuestions.slice(0, numberOfQuestions);
  } catch (error) {
    // if (import.meta.env.DEV) {
    //   console.error("❌ Erreur lors de la génération :", error);
    // }
    // Réessayer avec une nouvelle tentative
    return generateGeminiQuiz(numberOfQuestions, difficulty, attempts + 1);
  }
};

const fallbackQuestions = (
  numberOfQuestions: number,
  difficulty: "easy" | "medium" | "hard",
): QuizQuestion[] => {
  console.warn(
    "Utilisation des questions prédéfinies comme solution de secours",
  );
  return quizQuestions
    .filter((q) => q.difficulty === difficulty)
    .sort(() => 0.5 - Math.random())
    .slice(0, numberOfQuestions);
};

export const generateQuizQuestionsFromAI = generateQuizQuestions;

export default {
  generateQuizQuestions,
  generateQuizQuestionsFromAI,
};
