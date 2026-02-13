
import { GoogleGenAI, Type } from "@google/genai";
import { SuggestionResponse } from "../types.ts";

export const getAiSuggestions = async (prompt: string): Promise<SuggestionResponse> => {
  // Инициализация внутри функции гарантирует использование актуального ключа из окружения
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `Ты — эксперт по строительным сметам. 
Твоя задача: составить детальный список работ и материалов для указанного ремонта.
ПРАВИЛА:
1. Ответ должен быть СТРОГО в формате JSON.
2. Используй только следующие единицы измерения: 'м2', 'м/п', 'шт', 'упак', 'компл', 'кг', 'л', 'точка', 'ветка'.
3. Цены указывай в рублях, ориентируясь на средние рыночные показатели 2024-2025 гг.
4. Разделяй работы по логическим категориям (например: Демонтаж, Электрика, Отделка стен).
5. В поле 'advice' дай 3-4 важных профессиональных совета именно для этого типа работ.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Запрос пользователя: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 4000 }, // Даем модели время на обдумывание структуры
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Название работы или материала" },
                  category: { type: Type.STRING, description: "Категория работ" },
                  unit: { type: Type.STRING, description: "Единица измерения (только из списка)" },
                  quantity: { type: Type.NUMBER, description: "Необходимое количество" },
                  estimatedPrice: { type: Type.NUMBER, description: "Примерная цена за единицу" }
                },
                required: ["name", "category", "unit", "quantity", "estimatedPrice"]
              }
            },
            advice: { type: Type.STRING, description: "Советы по ремонту" }
          },
          required: ["items", "advice"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Модель вернула пустой ответ");
    }

    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
