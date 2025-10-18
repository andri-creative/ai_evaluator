// src/routes/evaluateRoutes.ts
import { Router } from "express";
import { evaluateDocuments } from "../controllers/evaluateController";

const router = Router();

router.post("/", evaluateDocuments);

export default router;
