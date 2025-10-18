// src/ai/geminiClient.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

export async function callGeminiWithRetry(prompt: string, maxRetries = 3): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      if (!text) throw new Error("Empty response from Gemini");
      return text;
    } catch (err: any) {
      console.error(`Attempt ${attempt} failed:`, err.message);
      if (attempt === maxRetries) throw err;
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Retrying in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  throw new Error("All retry attempts failed");
}
