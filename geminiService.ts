import { GoogleGenerativeAI } from "@google/generative-ai";
import { TUTOR_SYSTEM_INSTRUCTION } from './types';

let chatSession: any = null;
let genAI: GoogleGenerativeAI | null = null;

const getAIClient = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
        throw new Error("MISSING_API_KEY");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

export const initializeChat = async (userName?: string, gender?: string): Promise<void> => {
  try {
    const client = getAIClient();
    
    let instruction = TUTOR_SYSTEM_INSTRUCTION;
    if (userName) instruction += `\nSTUDENT NAME: ${userName}`;
    if (gender) instruction += `\nGENDER: ${gender} (Use Hebrew ${gender === 'בן' ? 'Male' : 'Female'} grammar).`;

    // כאן הקסם: שימוש במודל ה-PRO החכם דרך הספרייה היציבה
    const model = client.getGenerativeModel({ 
        model: "gemini-1.5-pro", 
        systemInstruction: instruction 
    });

    chatSession = model.startChat({
        history: [],
        generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
        },
    });

  } catch (error) {
      console.error("Chat init error:", error);
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    if (!chatSession) await initializeChat();
    
    if (!chatSession) return "שגיאה: לא מצליח להתחבר.";

    // שליחה פשוטה שעובדת תמיד
    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("API Error:", error);
    return "אופס, הייתה לי בעיה קטנה. בוא ננסה שוב! 🔄";
  }
};

export const resetChat = () => {
  chatSession = null;
  genAI = null;
};
