import fileUpload from "express-fileupload";

declare global {
  namespace Express {
    export interface Request {
      files?: fileUpload.FileArray | null;
    }
  }
}
