import { Router } from 'express';
import { processExcelFile } from '../controllers/excelController';
import { upload } from '../middlewares/uploadMiddleware';

const excelRouter = Router();

excelRouter.post(
  '/upload', 
  upload.single('file'), 
  (req, res, next) => {
    processExcelFile(req, res).catch(next);
  }
);

export { excelRouter };