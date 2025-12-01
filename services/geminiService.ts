import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL, PROMPTS } from "../constants";

// Helper to convert File to Base64
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeImageWithGemini = async (file: File, apiKey: string): Promise<string> => {
  try {
    if (!apiKey) {
      throw new Error("API Key is missing.");
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    // Prepare image data
    const imagePart = await fileToGenerativePart(file);
    
    // Prepare prompt
    const prompt = PROMPTS.ANALYZE_IMAGE;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [imagePart, { text: prompt }]
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No description generated.");
    }

    return text;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to analyze image.");
  }
};