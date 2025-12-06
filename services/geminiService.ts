import { GoogleGenAI } from "@google/genai";
import { HealthProfile, RecipeSuggestion, GroundingLink } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Step 1: Analyze the image to identify ingredients using gemini-3-pro-preview
 */
export const analyzeImageForIngredients = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this image and identify all visible vegetables, meats, and other primary ingredients. Return a simple comma-separated list of the identified items. Do not provide recipes yet, just the identification.",
          },
        ],
      },
    });

    return response.text || "No ingredients identified.";
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};

/**
 * Step 2: Suggest a recipe based on ingredients and profile using gemini-2.5-flash with Google Search
 */
export const suggestRecipe = async (ingredients: string, profile: HealthProfile): Promise<RecipeSuggestion> => {
  try {
    const prompt = `
      I have the following ingredients: ${ingredients}.
      
      User Profile:
      - Age: ${profile.age}
      - Sex: ${profile.sex}
      - Health Conditions: ${profile.conditions || 'None'}
      - Health Goal: ${profile.goal}
      
      Task:
      Suggest a delicious and healthy recipe using the identified ingredients that specifically aligns with the user's health profile and goals.
      Use Google Search to find a high-rated, real-world recipe or current nutritional advice that matches these criteria.
      
      Output Format:
      Provide the response in Markdown.
      1. Recipe Name
      2. Brief explanation of why it fits the health profile.
      3. Ingredients List (with approximate measurements).
      4. Step-by-step Instructions.
      5. Nutritional Highlights.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const content = response.text || "No recipe generated.";
    
    // Extract grounding chunks for citations
    const groundingLinks: GroundingLink[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          groundingLinks.push({
            title: chunk.web.title,
            url: chunk.web.uri
          });
        }
      });
    }

    return { content, groundingLinks };

  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error("Failed to generate recipe suggestions.");
  }
};
