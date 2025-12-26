import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import uploadRoutes from "./routes/uploadRoutes";
import evaluateRoutes from "./routes/evaluateRoutes";
import resultRoutes from "./routes/resultRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 },
  })
);

app.use("/api/upload", uploadRoutes);
app.use("/api/evaluate", evaluateRoutes);

app.use("/api/result", resultRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CV Ai Evaluator! 🚀",
    data: {
      app: "Express + TypeScript + Prisma + PostgreSQL",
      version: "2.0.0",
    },
  });
});

export default app;
