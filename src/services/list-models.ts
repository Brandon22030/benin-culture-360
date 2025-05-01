export async function listModels() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
    );
    const data = await response.json();

    console.log("Modèles disponibles :");
    data.models.forEach((model: any) => {
      console.log(`Nom : ${model.name}`);
      console.log(`  Description : ${model.description}`);
      console.log(
        `  GenerationMethods : ${model.supportedGenerationMethods?.join(", ")}`,
      );
      console.log("---");
    });
  } catch (error) {
    console.error("Erreur lors de l’appel à ListModels :", error);
  }
}
