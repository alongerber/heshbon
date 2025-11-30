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

    // נסיון חיבור למודל 3, עם גיבוי למודל 1.5 אם 3 עדיין סגור לבטא
    chatSession = client.chats.create({
        model: 'gemini-1.5-pro', // חזרנו ל-1.5 PRO שהוא הכי חכם ופתוח לכולם בוודאות
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
    
    if (!chatSession) return "שגיאה: לא מצליח להתחבר למנוע הבינה.";

    // התיקון הקריטי: שימוש ב-sendMessage במקום send
    const result = await chatSession.sendMessage({
      parts: [{ text: message }]
    });

    return result.text || "לא התקבלה תשובה.";

  } catch (error: any) {
    console.error("API Error:", error);
    return "אופס, נתקלתי בבעיה. נסה שוב! 🔄";
  }
};

export const resetChat = () => {
  chatSession = null;
  aiClient = null;
};
