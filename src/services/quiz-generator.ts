import { GoogleGenerativeAI } from "@google/generative-ai";
import { QuizQuestion } from "@/data/culturalData";
import { quizQuestions } from "@/data/culturalData";

const geminiKey =
  import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

export const generateQuizQuestions = async (
  numberOfQuestions: number = 5,
  difficulty: "easy" | "medium" | "hard" = "medium",
  useAI: boolean = true,
): Promise<QuizQuestion[]> => {
  if (!useAI || !geminiKey) {
    return fallbackQuestions(numberOfQuestions, difficulty);
  }

  try {
    return await generateGeminiQuiz(numberOfQuestions, difficulty);
  } catch (error) {
    console.error("Erreur lors de la génération de quiz avec Gemini :", error);
    return fallbackQuestions(numberOfQuestions, difficulty);
  }
};

const generateGeminiQuiz = async (
  numberOfQuestions: number,
  difficulty: "easy" | "medium" | "hard",
): Promise<QuizQuestion[]> => {
  console.log(
    `🔍 Génération de ${numberOfQuestions} questions (Difficulté: ${difficulty})`,
  );

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Génère un quiz de ${numberOfQuestions} questions UNIQUES et ORIGINALES sur la culture béninoise (difficulté : ${difficulty}).

  IMPORTANT :
  - NE PAS réutiliser des questions existantes ou communes
  - Couvrir des aspects variés et spécifiques de la culture béninoise
  - Inclure des détails précis et vérifiables
  - Adapter la difficulté au niveau demandé (${difficulty})

  Thèmes à explorer :
  - Histoire précoloniale et royaumes anciens
  - Traditions et cérémonies locales
  - Art et artisanat traditionnel
  - Cuisine et pratiques culinaires
  - Langues et groupes ethniques
  - Architecture traditionnelle
  - Festivals et célébrations
  - Géographie et sites historiques

  Format JSON strict :
  {
    "theme": "Thème du quiz",
    "questions": [
      {
        "id": "quiz-X",
        "question": "Question précise et détaillée",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": 1,
        "explanation": "Explication détaillée avec contexte historique ou culturel",
        "category": "Catégorie spécifique",
        "difficulty": "${difficulty}"
      }
    ]
  }`;

  try {
    console.log("📡 Envoi de la requête à Gemini...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("📄 Réponse brute Gemini :", text);

    // Extraction du JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("❌ Pas de JSON valide trouvé");
      throw new Error("Pas de JSON valide");
    }

    console.log("🔍 JSON extrait :", jsonMatch[0]);

    const parsedQuizData = JSON.parse(jsonMatch[0]);
    const generatedQuestions = parsedQuizData.questions;

    console.log(`✨ Questions générées : ${generatedQuestions.length}`);

    // Validation des questions
    generatedQuestions.forEach((question, index) => {
      console.log(`🧐 Validation question ${index + 1}:`);
      console.log("   Question :", question.question);
      console.log("   Options :", question.options);
      console.log("   Réponse correcte :", question.correctAnswer);

      if (
        !question.id ||
        !question.question ||
        !question.options ||
        question.options.length !== 4
      ) {
        console.error(`❌ Question ${index + 1} invalide`);
        throw new Error(`Question ${index + 1} invalide`);
      }
    });

    console.log("✅ Toutes les questions sont valides");
    return generatedQuestions.slice(0, numberOfQuestions);
  } catch (error) {
    console.error("❌ Erreur Gemini :", error);
    throw error;
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
