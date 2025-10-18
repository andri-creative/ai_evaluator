import { callGeminiWithRetry } from "../geminiClient";
import { cvPrompt } from "../prompts/cvPrompt";

export async function llmEvaluateCV(jobTitle: string, cvText: string) {
  if (!cvText?.trim()) {
    return {
      cv_match_rate: 0,
      technical_skills_match: 0,
      experience_level: 0,
      relevant_achievements: 0,
      cultural_collaboration_fit: 0,
      cv_feedback: "CV kosong, tidak bisa dievaluasi.",
    };
  }

  try {
    const rawText = await callGeminiWithRetry(cvPrompt(jobTitle, cvText));
    const jsonMatch = rawText.match(/{[\s\S]*}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
  } catch (err) {
    console.error("Gagal evaluasi CV:", err);
    return {
      cv_match_rate: 0,
      technical_skills_match: 0,
      experience_level: 0,
      relevant_achievements: 0,
      cultural_collaboration_fit: 0,
      cv_feedback: "Error evaluasi CV",
    };
  }
}
