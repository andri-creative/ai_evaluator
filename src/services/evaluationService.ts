import fs from "fs/promises";
import prisma from "../config/prisma";
import { llmEvaluateCV, llmEvaluateProject, llmSummarize } from "../ai";

export async function evaluateCandidate(
  jobTitle: string,
  cvId: string,
  projectReportId: string
) {
  const [cvDoc, projectDoc] = await Promise.all([
    prisma.document.findUnique({ where: { id: cvId } }),
    prisma.document.findUnique({ where: { id: projectReportId } }),
  ]);

  if (!cvDoc || !projectDoc) {
    throw new Error("Dokumen CV atau Project tidak ditemukan");
  }

  const cvText = await fs.readFile(cvDoc.file_path, "utf-8");
  const projectText = await fs.readFile(projectDoc.file_path, "utf-8");

  const cvEval = await llmEvaluateCV(jobTitle, cvText);
  const projectEval = await llmEvaluateProject(projectText);

  const summary = await llmSummarize(cvEval, projectEval);

  return {
    ...cvEval,
    ...projectEval,
    summary,
  };
}
