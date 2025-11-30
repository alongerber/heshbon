import { GoogleGenAI } from "@google/genai";
import type { Chat } from "@google/genai";
import { TUTOR_SYSTEM_INSTRUCTION } from './types';

let chatSession: Chat | null = null;
let ai: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
        throw new Error("MISSING_API_KEY");
    }
    ai = new GoogleGenAI({ apiKey: apiKey });
  }
  return ai;
};

export const initializeChat = async (userName?: string, gender?: string): Promise<void> => {
  try {
    const client = getAIClient();
    
    let instruction = TUTOR_SYSTEM_INSTRUCTION;
    if (userName) instruction += `\nSTUDENT NAME: ${userName}`;
    if (gender) instruction += `\nGENDER: ${gender} (Use Hebrew ${gender === 'בן' ? 'Male' : 'Female'} grammar).`;

    chatSession = client.chats.create({
        model: 'gemini-1.5-flash', // הכי יציב ומהיר
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
    
    if (!chatSession) return "שגיאה: לא מצליח להתחבר.";

    const result = await chatSession.sendMessage({ message });
    return result.text || "לא הבנתי, נסה שוב.";

  } catch (error: any) {
    console.error("API Error:", error);
    return "אופס, הייתה לי בעיה בתקשורת. בוא ננסה שוב! 🔄";
  }
};

export const resetChat = () => {
  chatSession = null;
};
