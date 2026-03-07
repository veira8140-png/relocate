import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getVisaAdvice(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: `You are an expert immigration consultant specializing in helping Kenyans relocate to the USA. 
      Provide accurate, encouraging, and practical advice on visa interviews (F1, J1, H1B, B1/B2, DV Lottery), 
      document preparation, and settling in the US (housing, banking, culture). 
      Keep responses concise and formatted in Markdown.`,
    },
  });
  return response.text;
}
