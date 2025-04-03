import * as XLSX from "xlsx";

export const generateExcelReport = (inventoryReport: any[]) => {
  if (!inventoryReport.length) return;

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(inventoryReport);
  XLSX.utils.book_append_sheet(wb, ws, "Inventory Report");
  XLSX.writeFile(wb, "Inventory_Report.xlsx");
};
