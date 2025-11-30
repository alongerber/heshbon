import { GoogleGenAI } from "@google/genai";
import { TUTOR_SYSTEM_INSTRUCTION } from './types';

let chatSession: any = null;
let aiClient: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
        throw new Error("MISSING_API_KEY");
    }
    // שימוש ב-SDK החדש ביותר
    aiClient = new GoogleGenAI({ apiKey: apiKey });
  }
  return aiClient;
};

export const initializeChat = async (userName?: string, gender?: string): Promise<void> => {
  try {
    const client = getAIClient();
    
    let instruction = TUTOR_SYSTEM_INSTRUCTION;
    if (userName) instruction += `\nSTUDENT NAME: ${userName}`;
    if (gender) instruction += `\nGENDER: ${gender} (Use Hebrew ${gender === 'בן' ? 'Male' : 'Female'} grammar).`;

    // חיבור למודל הכי חזק - Gemini 3 Pro
    chatSession = client.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
            systemInstruction: instruction,
            temperature: 0.7,
        },
        history: [],
    });
  } catch (error) {
      console.error("Chat init error:", error);
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    if (!chatSession) await initializeChat();
    
    if (!chatSession) return "שגיאה: לא מצליח להתחבר למנוע Gemini 3.";

    // שליחת הודעה בפורמט החדש
    const result = await chatSession.send({
      role: 'user',
      parts: [{ text: message }]
    });

    return result.text || "לא התקבלה תשובה.";

  } catch (error: any) {
    console.error("Gemini 3 API Error:", error);
    
    // Fallback בסיסי למקרה שהמודל החדש עמוס או לא זמין
    if (error.status === 404 || error.status === 503) {
        return "המודל החדש (Gemini 3) עמוס כרגע. נסה שוב בעוד רגע.";
    }
    
    return "אופס, יש בעיה בתקשורת עם המוח החדש. 🔄";
  }
};

export const resetChat = () => {
  chatSession = null;
  aiClient = null;
};
