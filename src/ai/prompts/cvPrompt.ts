// src/ai/prompts/cvPrompt.ts
export const cvPrompt = (jobTitle: string, cvText: string) => `
Kamu adalah HR evaluator.
Nilai CV kandidat untuk posisi "${jobTitle}" berdasarkan rubric:

- Technical Skills Match (40%)
- Experience Level (25%)
- Relevant Achievements (20%)
- Cultural / Collaboration Fit (15%)

Skor tiap aspek (1–5), lalu hitung:
cv_match_rate = (Technical Skills Match*0.4 + Experience Level*0.25 + Relevant Achievements*0.2 + Cultural / Collaboration Fit*0.15) × 0.2

⚠️ Jawab HANYA dalam format JSON valid.

Format JSON:
{
  "cv_match_rate": number,
  "technical_skills_match": number,
  "experience_level": number,
  "relevant_achievements": number,
  "cultural_collaboration_fit": number,
  "cv_feedback": "analisis singkat"
}

Isi CV:
${cvText}
`;
