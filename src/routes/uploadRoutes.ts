import { Router } from "express";
import fileUpload from "express-fileupload";
import { uploadDocuments } from "../controllers/uploadController";

const router = Router();

// Middleware untuk parsing form-data
// router.use(
//   fileUpload({
//     createParentPath: true,
//     limits: { fileSize: 10 * 1024 * 1024 },
//   })
// );

router.post("/", uploadDocuments);

export default router;
