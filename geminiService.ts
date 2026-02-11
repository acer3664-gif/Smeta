
import { GoogleGenAI, Type } from "@google/genai";
import { SuggestionResponse } from "../types.ts";

export const getAiSuggestions = async (prompt: string): Promise<SuggestionResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Пользователь планирует ремонт: "${prompt}". 
    Составь список необходимых работ и материалов. 
    Верни ответ строго в формате JSON. 
    Используй единицы измерения: м², п.м., шт, упак, компл, кг, л. 
    Цены указывай в рублях (примерные рыночные).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                unit: { type: Type.STRING },
                quantity: { type: Type.NUMBER },
                estimatedPrice: { type: Type.NUMBER }
              },
              required: ["name", "category", "unit", "quantity", "estimatedPrice"]
            }
          },
          advice: { type: Type.STRING, description: "Общие советы по этому виду ремонта" }
        },
        required: ["items", "advice"]
      }
    }
  });

  const jsonStr = response.text?.trim() || '{}';
  return JSON.parse(jsonStr);
};
