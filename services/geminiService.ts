
import { GoogleGenAI, Type } from "@google/genai";
import { DailyInspiration } from '../types';
import { FALLBACK_INSPIRATION } from "../constants";

export async function getDailyInspiration(): Promise<DailyInspiration> {
  try {
    if (!process.env.API_KEY) {
        console.warn("API_KEY environment variable not set. Using fallback data.");
        return FALLBACK_INSPIRATION;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const schema = {
      type: Type.OBJECT,
      properties: {
        verse: {
          type: Type.OBJECT,
          properties: {
            arabic: { type: Type.STRING, description: "The verse in original Arabic script." },
            english: { type: Type.STRING, description: "The English translation of the verse." },
            bengali: { type: Type.STRING, description: "The Bengali translation of the verse." },
            reference: { type: Type.STRING, description: "The reference (e.g., Qur'an 2:183)." },
          },
          required: ["arabic", "english", "bengali", "reference"],
        },
        dua: {
          type: Type.OBJECT,
          properties: {
            arabic: { type: Type.STRING, description: "The dua in original Arabic script." },
            english: { type: Type.STRING, description: "The English translation of the dua." },
            bengali: { type: Type.STRING, description: "The Bengali translation of the dua." },
          },
          required: ["arabic", "english", "bengali"],
        },
      },
      required: ["verse", "dua"],
    };
    
    const prompt = "Provide a random, inspiring Qur'anic verse and a random, common daily dua. Include Arabic text, and both English and Bengali translations for each. Also provide the reference for the Qur'anic verse.";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    
    const jsonString = response.text.trim();
    const data: DailyInspiration = JSON.parse(jsonString);

    if (data.verse && data.dua) {
      return data;
    } else {
      console.error("Gemini API returned unexpected data structure.");
      return FALLBACK_INSPIRATION;
    }

  } catch (error) {
    console.error("Error fetching daily inspiration from Gemini API:", error);
    return FALLBACK_INSPIRATION;
  }
}
