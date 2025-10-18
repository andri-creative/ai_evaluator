import { callGeminiWithRetry } from "../geminiClient";
import { summaryPrompt } from "../prompts/summaryPrompt";

export async function llmSummarize(cvEval: any, projectEval: any) {
  try {
    const rawText = await callGeminiWithRetry(
      summaryPrompt(cvEval, projectEval)
    );
    return rawText.trim();
  } catch (err) {
    console.error("Gagal buat ringkasan:", err);
    return "Error: Tidak bisa membuat ringkasan.";
  }
}
