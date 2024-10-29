import { Router } from "express";
import {
  getProcessedFiles,
  getFile,
  uploadCsv,
  updateCsvName
} from "../controllers/fileController.js";
import multer from "multer";

const router = Router();
const upload = multer();

router.get("/get-processed-files", getProcessedFiles);
router.get("/files", getFile);
router.post("/upload-csv", upload.array("files") , uploadCsv);
router.put("/update-csv-name" , updateCsvName);

export default router;
