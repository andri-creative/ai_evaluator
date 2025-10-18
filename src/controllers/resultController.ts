import { Request, Response } from "express";
import prisma from "../config/prisma";

export async function getEvaluationResult(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const job = await prisma.evaluationJob.findUnique({
      where: { id },
      include: {
        result: true,
        cvDocument: {
          select: {
            filename: true,
            uploaded_at: true,
          },
        },
        reportDocument: {
          select: {
            filename: true,
            uploaded_at: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Evaluation job not found",
      });
    }

    //  status queued
    if (job.status === "queued" || job.status === "processing") {
      return res.json({
        id: job.id,
        status: job.status,
        job_title: job.job_title,
        created_at: job.created_at,
      });
    }

    //  status completed
    if (job.status === "completed" && job.result) {
      return res.json({
        id: job.id,
        status: job.status,
        job_title: job.job_title,
        created_at: job.created_at,
        completed_at: job.result.completed_at,
        result: {
          cv_match_rate: job.result.cv_match_rate,
          cv_feedback: job.result.cv_feedback,
          project_score: job.result.project_score,
          project_feedback: job.result.project_feedback,
          overall_summary: job.result.overall_summary,
          final_score: job.result.final_score,
        },
      });
    }

    //  status failed
    if (job.status === "failed") {
      const logs = await prisma.evaluationLog.findMany({
        where: { job_id: id },
        orderBy: { timestamp: "desc" },
        take: 1,
      });

      return res.json({
        id: job.id,
        status: job.status,
        job_title: job.job_title,
        error: logs[0]?.message || "Evaluation failed",
        created_at: job.created_at,
        updated_at: job.updated_at,
      });
    }

    // Default
    return res.json({
      id: job.id,
      status: job.status,
      job_title: job.job_title,
      created_at: job.created_at,
    });
  } catch (error: any) {
    console.error("Get result error:", error);
    return res.status(500).json({
      message: "Failed to get evaluation result",
      error: error.message,
    });
  }
}
