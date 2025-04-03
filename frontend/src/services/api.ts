import axios from 'axios';
import * as XLSX from 'xlsx';

import { ProcessedExcelData } from '../types/types';

export const processExcelFile = async (file: File): Promise<ProcessedExcelData> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post<ProcessedExcelData>('/api/excel/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};
export const downloadExcelReport = (reportData: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(reportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Analysis");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};