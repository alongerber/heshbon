import { GoogleGenAI } from "@google/genai";
import type { Chat } from "@google/genai";
import { TUTOR_SYSTEM_INSTRUCTION } from '../types';

let chatSession: Chat | null = null;
let ai: GoogleGenAI | null = null;

// FALLBACK KEY PROVIDED BY USER FOR VERCEL/GITHUB DEPLOYMENT
// Note: In a production enterprise app, this should be hidden. 
// For a personal parent-student app, this is acceptable.
const HARDCODED_KEY = "AIzaSyC-sbF53-HbK0vqQwJIyW56PQw7gWL8eso";

const getAIClient = () => {
  if (!ai) {
    // Priority: Environment Variable -> Hardcoded Key
    let apiKey = process.env.API_KEY;
    
    // Use hardcoded key if env var is missing or placeholder
    if (!apiKey || apiKey.includes("INSERT_YOUR_API_KEY")) {
        apiKey = HARDCODED_KEY;
    }
    
    // Final check
    if (!apiKey || apiKey.includes("INSERT_YOUR_API_KEY")) {
        console.error("CRITICAL: API_KEY is missing.");
        throw new Error("MISSING_API_KEY");
    }
    
    ai = new GoogleGenAI({ apiKey: apiKey });
  }
  return ai;
};

export const initializeChat = async (userName?: string, gender?: string): Promise<void> => {
  try {
    const client = getAIClient();
    
    // Inject personalized context if available
    let instruction = TUTOR_SYSTEM_INSTRUCTION;
    if (userName) {
        instruction += `\n\nCURRENT STUDENT NAME: ${userName}`;
    }
    if (gender) {
        instruction += `\nCURRENT STUDENT GENDER: ${gender} (Speak in Hebrew ${gender === 'בן' ? 'Male' : 'Female'} form)`;
    }

    chatSession = client.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
            systemInstruction: instruction,
            temperature: 0.7,
        },
        history: [],
    });
  } catch (error: any) {
      console.error("Failed to initialize chat:", error);
      if (error.message === "MISSING_API_KEY") {
          throw error;
      }
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    if (!chatSession) {
        // Attempt lazy init without personalization if session is lost
        await initializeChat();
    }

    if (!chatSession) {
        return "שגיאת אתחול: לא הצלחתי להתחבר למוח שלי. (שגיאה: Session is null)";
    }

    const result = await chatSession.sendMessage({
      message: message
    });
    
    return result.text || "לא התקבלה תשובה. נסה שוב.";

  } catch (error: any) {
    console.error("Gemini API Error details:", error);
    
    if (error.message === "MISSING_API_KEY" || error.toString().includes("API_KEY")) {
        return "⚠️ שגיאה: מפתח ה-API חסר.";
    }
    
    if (error.status === 503) {
        return "השרתים עמוסים כרגע. אנא נסה שוב בעוד דקה.";
    }

    return "אופס, יש בעיה בתקשורת. וודא שיש לך חיבור אינטרנט ונסה שוב.";
  }
};

export const resetChat = () => {
  chatSession = null;
};