// src/services/llmService.ts - UPDATE dengan RAG
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ragService } from "../ai/ragService";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function llmEvaluateCV(jobTitle: string, cvText: string) {
  const context = await ragService.getCVContext(jobTitle, cvText);

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
**EVALUASI CV DENGAN RAG SYSTEM**

**JOB DESCRIPTION (dari Vector DB):**
${context.jobDescription}

**SCORING RUBRIC (dari Vector DB):**
${context.scoringRubric}

**CV KANDIDAT:**
${cvText}

**INSTRUKSI:**
Bandingkan CV kandidat dengan Job Description di atas.
Gunakan Scoring Rubric sebagai panduan penilaian.

**PERHITUNGAN:**
cv_match_rate = (technical_skills_match × 0.4 + experience_level × 0.25 + relevant_achievements × 0.2 + cultural_fit × 0.15) × 0.2

**FORMAT RESPONSE (JSON ONLY):**
{
  "cv_match_rate": 0.75,
  "technical_skills_match": 4,
  "experience_level": 3, 
  "relevant_achievements": 4,
  "cultural_fit": 3,
  "cv_feedback": "Analisis berdasarkan perbandingan dengan job description..."
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/{[\s\S]*}/);
    const evaluation = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : getDefaultCVEvaluation();

    console.log("✅ CV Evaluation with RAG completed");
    return evaluation;
  } catch (error) {
    console.error("❌ CV evaluation failed:", error);
    return getDefaultCVEvaluation();
  }
}

function getDefaultCVEvaluation() {
  return {
    cv_match_rate: 0,
    technical_skills_match: 0,
    experience_level: 0,
    relevant_achievements: 0,
    cultural_fit: 0,
    cv_feedback: "Evaluation failed - using default values",
  };
}
