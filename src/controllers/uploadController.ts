import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import prisma from "../config/prisma";

// Folder tempat menyimpan file
const UPLOAD_DIR = path.join(__dirname, "../../uploads");

// Pastikan folder uploads ada
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const uploadDocuments = async (req: Request, res: Response) => {
  try {
    const cvFile = req.files?.cv as any;
    const reportFile = req.files?.project_report as any;

    if (!cvFile || !reportFile) {
      return res.status(400).json({
        message: "Both CV and Project Report files are required",
      });
    }

    // Buat record di database dulu untuk mendapatkan ID
    const documents = await prisma.document.createMany({
      data: [
        {
          type: "cv",
          filename: cvFile.name,
          file_path: "pending", // temporary value
        },
        {
          type: "project_report",
          filename: reportFile.name,
          file_path: "pending", // temporary value
        },
      ],
    });

    // Ambil record yang baru dibuat
    const createdDocs = await prisma.document.findMany({
      where: {
        file_path: "pending",
      },
      orderBy: {
        id: "desc",
      },
      take: 2,
    });

    const cvDoc = createdDocs.find((doc) => doc.type === "cv");
    const reportDoc = createdDocs.find((doc) => doc.type === "project_report");

    if (!cvDoc || !reportDoc) {
      throw new Error("Failed to retrieve created documents");
    }

    // Generate nama file berdasarkan ID
    const cvFileName = `${cvDoc.id}.pdf`;
    const reportFileName = `${reportDoc.id}.pdf`;

    const cvPath = path.join(UPLOAD_DIR, cvFileName);
    const reportPath = path.join(UPLOAD_DIR, reportFileName);

    // Simpan file
    await cvFile.mv(cvPath);
    await reportFile.mv(reportPath);

    // Update path di database
    await Promise.all([
      prisma.document.update({
        where: { id: cvDoc.id },
        data: { file_path: cvPath },
      }),
      prisma.document.update({
        where: { id: reportDoc.id },
        data: { file_path: reportPath },
      }),
    ]);

    return res.status(201).json({
      message: "Documents uploaded successfully",
      cv_id: cvDoc.id,
      project_report_id: reportDoc.id,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return res.status(500).json({
      message: "Failed to upload documents",
      error: error.message,
    });
  }
};
