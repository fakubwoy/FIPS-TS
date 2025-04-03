// services/api.ts
import * as XLSX from 'xlsx';

// ... keep your existing imports and code ...

// Add this to your existing file
export const downloadExcelReport = (reportData: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(reportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Analysis");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};