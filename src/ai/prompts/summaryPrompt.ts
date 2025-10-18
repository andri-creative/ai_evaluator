// src/ai/prompts/summaryPrompt.ts
export const summaryPrompt = (cvEval: any, projectEval: any) => `
Buat ringkasan evaluasi kandidat dari hasil berikut:

CV Evaluation:
${JSON.stringify(cvEval, null, 2)}

Project Evaluation:
${JSON.stringify(projectEval, null, 2)}

Buat dalam 3–5 kalimat yang menjelaskan:
- Kekuatan utama kandidat
- Kekurangan / area pengembangan
- Rekomendasi untuk keputusan rekrutmen

Output teks biasa, bukan JSON.
`;
