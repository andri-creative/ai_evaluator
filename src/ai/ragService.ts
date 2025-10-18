// src/ai/ragService.ts
import { vectorDB } from "./vectorDB/chromaClient";

export class RAGService {
  async initialize() {
    await vectorDB.initialize();
  }

  async getCVContext(jobTitle: string, cvText: string) {
    const query = `${jobTitle} ${cvText.substring(0, 100)}`;

    const [jobDescription, scoringRubric] = await Promise.all([
      vectorDB.searchSimilar(query, "job_description", 2),
      vectorDB.searchSimilar(
        "technical skills experience",
        "scoring_rubric",
        2
      ),
    ]);

    return {
      jobDescription:
        jobDescription.join("\n\n") || "Default job description context",
      scoringRubric: scoringRubric.join("\n\n") || "Default scoring rubric",
    };
  }

  async getProjectContext(projectText: string) {
    const query = `project ${projectText.substring(0, 100)}`;

    const [caseStudyBrief, scoringRubric] = await Promise.all([
      vectorDB.searchSimilar(query, "case_study_brief", 2),
      vectorDB.searchSimilar("code quality correctness", "scoring_rubric", 2),
    ]);

    return {
      caseStudyBrief:
        caseStudyBrief.join("\n\n") || "Default case study context",
      scoringRubric: scoringRubric.join("\n\n") || "Default project rubric",
    };
  }
}

export const ragService = new RAGService();
