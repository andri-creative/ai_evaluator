-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationJob" (
    "id" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "project_report_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluationJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationResult" (
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "cv_match_rate" DOUBLE PRECISION NOT NULL,
    "cv_feedback" TEXT NOT NULL,
    "project_score" DOUBLE PRECISION NOT NULL,
    "project_feedback" TEXT NOT NULL,
    "overall_summary" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvaluationResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationLog" (
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "retry_count" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvaluationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationResult_job_id_key" ON "EvaluationResult"("job_id");

-- AddForeignKey
ALTER TABLE "EvaluationJob" ADD CONSTRAINT "EvaluationJob_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationJob" ADD CONSTRAINT "EvaluationJob_project_report_id_fkey" FOREIGN KEY ("project_report_id") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationResult" ADD CONSTRAINT "EvaluationResult_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "EvaluationJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationLog" ADD CONSTRAINT "EvaluationLog_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "EvaluationJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
