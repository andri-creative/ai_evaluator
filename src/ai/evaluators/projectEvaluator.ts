import { callGeminiWithRetry } from "../geminiClient";
import { projectPrompt } from "../prompts/projectPrompt";

export async function llmEvaluateProject(reportText: string) {
  if (!reportText?.trim()) {
    return {
      project_score: 0,
      correctness: 0,
      code_quality: 0,
      resilience: 0,
      documentation: 0,
      creativity: 0,
      project_feedback: "Laporan kosong, tidak bisa dievaluasi.",
    };
  }

  try {
    const rawText = await callGeminiWithRetry(projectPrompt(reportText));
    const jsonMatch = rawText.match(/{[\s\S]*}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
  } catch (err) {
    console.error("Gagal evaluasi proyek:", err);
    return {
      project_score: 0,
      correctness: 0,
      code_quality: 0,
      resilience: 0,
      documentation: 0,
      creativity: 0,
      project_feedback: "Error evaluasi proyek",
    };
  }
}
