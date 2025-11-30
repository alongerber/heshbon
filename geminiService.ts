import Anthropic from "@anthropic-ai/sdk";
import { TUTOR_SYSTEM_INSTRUCTION } from "./types";

let client: Anthropic | null = null;
let conversationHistory: { role: "user" | "assistant"; content: string }[] = [];
let systemPrompt: string = TUTOR_SYSTEM_INSTRUCTION;

const getClient = () => {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("MISSING_API_KEY");
    }
    client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  }
  return client;
};

export const initializeChat = async (
  userName?: string,
  gender?: string
): Promise<void> => {
  conversationHistory = [];
  systemPrompt = TUTOR_SYSTEM_INSTRUCTION;
  if (userName) systemPrompt += `\nSTUDENT NAME: ${userName}`;
  if (gender)
    systemPrompt += `\nGENDER: ${gender} (Use Hebrew ${gender === "בן" ? "Male" : "Female"} grammar).`;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const anthropic = getClient();

    conversationHistory.push({ role: "user", content: message });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: conversationHistory,
    });

    const assistantMessage =
      response.content[0].type === "text" ? response.content[0].text : "";

    conversationHistory.push({ role: "assistant", content: assistantMessage });

    return assistantMessage;
  } catch (error: any) {
    console.error("API Error:", error);
    return "אופס, הייתה לי בעיה קטנה. בוא ננסה שוב! 🔄";
  }
};

export const resetChat = () => {
  conversationHistory = [];
  client = null;
};
