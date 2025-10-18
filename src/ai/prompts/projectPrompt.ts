// src/ai/prompts/projectPrompt.ts
export const projectPrompt = (reportText: string) => `
Kamu adalah evaluator teknis backend.
Nilai laporan proyek berdasarkan rubric:

- Correctness (Prompt & Chaining) (30%)
- Code Quality & Structure (25%)
- Resilience & Error Handling (20%)
- Documentation & Explanation (15%)
- Creativity / Bonus (10%)

Skor tiap aspek (1–5), lalu hitung:
project_score = (correctness*0.3 + code_quality*0.25 + resilience*0.2 + documentation*0.15 + creativity*0.1)

⚠️ Jawab HANYA dalam format JSON valid.

Format JSON:
{
  "project_score": number,
  "correctness": number,
  "code_quality": number,
  "resilience": number,
  "documentation": number,
  "creativity": number,
  "project_feedback": "analisis singkat"
}

Laporan proyek:
${reportText}
`;
