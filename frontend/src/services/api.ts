import axios from 'axios';

export interface ProcessedExcelData {
  productionOrdersLM: any[];
  productionOrdersMS: any[];
  bomLM: any[];
  bomMS: any[];
  qcStock: any[];
  inventoryStock: any[];
  combinedStock: any[];
}

export const processExcelFile = async (file: File): Promise<ProcessedExcelData> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('/api/excel/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};