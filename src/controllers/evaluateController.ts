// src/controllers/evaluationController.ts
import { Request, Response } from "express";
import prisma from "../config/prisma";
import { evaluateCandidate } from "../services/evaluationService";

export async function evaluateDocuments(req: Request, res: Response) {
  try {
    const { job_title, cv_id, project_report_id } = req.body;

    if (!job_title || !cv_id || !project_report_id) {
      return res.status(400).json({
        message: "job_title, cv_id, and project_report_id are required",
      });
    }

    // Buat record job
    const job = await prisma.evaluationJob.create({
      data: {
        job_title,
        cv_id,
        project_report_id,
        status: "queued",
      },
    });

    // Tambah log awal
    await prisma.evaluationLog.create({
      data: {
        job_id: job.id,
        stage: "queued",
        message: "Evaluation job created and queued",
      },
    });

    // Jalankan async
    processEvaluationJob(job.id).catch(console.error);

    return res.status(202).json({
      id: job.id,
      status: "queued",
    });
  } catch (error: any) {
    console.error("Evaluate error:", error);
    return res.status(500).json({
      message: "Failed to start evaluation",
      error: error.message,
    });
  }
}

async function processEvaluationJob(jobId: string) {
  try {
    await prisma.evaluationJob.update({
      where: { id: jobId },
      data: { status: "processing" },
    });

    await prisma.evaluationLog.create({
      data: {
        job_id: jobId,
        stage: "processing",
        message: "Starting evaluation process",
      },
    });

    // Ambil job & dokumen
    const job = await prisma.evaluationJob.findUnique({
      where: { id: jobId },
      include: {
        cvDocument: true,
        reportDocument: true,
      },
    });

    if (!job) throw new Error("Job not found");

    // Proses AI evaluation
    const result = await evaluateCandidate(
      job.job_title,
      job.cv_id,
      job.project_report_id
    );

    await prisma.evaluationResult.create({
      data: {
        job_id: jobId,
        cv_match_rate: result.cv_match_rate,
        project_score: result.project_score,
        cv_feedback: result.cv_feedback,
        project_feedback: result.project_feedback,
        overall_summary: result.summary,
        final_score:
          (result.cv_match_rate * 100 + result.project_score * 20) / 2,
      },
    });

    await prisma.evaluationJob.update({
      where: { id: jobId },
      data: { status: "completed" },
    });

    await prisma.evaluationLog.create({
      data: {
        job_id: jobId,
        stage: "completed",
        message: "Evaluation completed successfully",
      },
    });

    console.log(`✅ Evaluation job ${jobId} completed successfully`);
  } catch (error) {
    console.error(`❌ Evaluation job ${jobId} failed:`, error);

    await prisma.evaluationJob.update({
      where: { id: jobId },
      data: { status: "failed" },
    });

    await prisma.evaluationLog.create({
      data: {
        job_id: jobId,
        stage: "failed",
        message: `Error: ${error instanceof Error ? error.message : "Unknown"}`,
      },
    });
  }
}
