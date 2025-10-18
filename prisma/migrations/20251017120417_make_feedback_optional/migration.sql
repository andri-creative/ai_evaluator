-- AlterTable
ALTER TABLE "EvaluationResult" ALTER COLUMN "cv_feedback" DROP NOT NULL,
ALTER COLUMN "project_feedback" DROP NOT NULL,
ALTER COLUMN "overall_summary" DROP NOT NULL;
