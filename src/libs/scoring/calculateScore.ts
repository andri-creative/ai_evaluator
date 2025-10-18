// src/libs/scoring/calculateScore.ts
export function calculateScore(cvEval: any, reportEval: any) {
  const cv_match_rate = cvEval.cv_match_rate ?? 0;
  const project_score = reportEval.project_score ?? 0;

  return { cv_match_rate, project_score };
}
