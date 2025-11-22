import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// We use the standard process.env.API_KEY as mandated.
const apiKey = process.env.API_KEY;

// We create the client lazily or check for key presence before calls to avoid immediate crashes if key is missing (though prompt assumes it's there)
const createClient = () => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing from process.env.API_KEY");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getElementInsights = async (elementName: string, question: string): Promise<string> => {
  const ai = createClient();
  if (!ai) {
    return "API Key not configured. Please set process.env.API_KEY.";
  }

  try {
    // Using gemini-2.5-flash for speed and efficiency as per guidelines for text tasks
    const model = "gemini-2.5-flash";
    
    const prompt = `
      You are an expert chemistry professor assistant. 
      User is asking about the element "${elementName}".
      
      Question: ${question}
      
      Provide a concise, interesting, and scientifically accurate answer suitable for a chemistry student or enthusiast.
      Keep it under 150 words if possible. Format with markdown.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't retrieve the information at this moment.";
  }
};