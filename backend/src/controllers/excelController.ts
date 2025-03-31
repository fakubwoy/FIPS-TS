import { Request, Response } from 'express';
import { processExcel } from '../services/excelService';
import { ProcessedExcelData } from '../types/types';

export const processExcelFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const processedData: ProcessedExcelData = await processExcel(req.file.path);
    res.json(processedData);
  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.status(500).json({ error: 'Error processing Excel file' });
  }
};