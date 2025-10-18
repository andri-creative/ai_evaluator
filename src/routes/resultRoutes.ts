// src/routes/resultRoutes.ts
import { Router } from "express";
import { getEvaluationResult } from "../controllers/resultController";
const router = Router();
router.get("/:id", getEvaluationResult);
export default router;
