import { ProcessedExcelData, InventoryAnalysisReport } from "../types/types";
import * as XLSX from 'xlsx';

export const generateInventoryAnalysisReport = (data: ProcessedExcelData): InventoryAnalysisReport[] => {
  const report: InventoryAnalysisReport[] = [];
  
  const inventoryRequirements = new Map<string, {
    required: number;
    uom: string;
    description: string;
  }>();

  data.productionOrdersLM.forEach(order => {
    const productCode = order["Product No."];
    const quantity = order["Production Qty"] || 0;
    
    data.bomLM
      .filter(item => item["Product Code"] === productCode)
      .forEach(bomItem => {
        const itemCode = bomItem["Item Code"];
        const current = inventoryRequirements.get(itemCode) || {
          required: 0,
          uom: bomItem["UoM Name"],
          description: bomItem["Description"]
        };
        current.required += (bomItem["Quantity"] || 0) * quantity;
        inventoryRequirements.set(itemCode, current);
      });
  });

  data.productionOrdersMS.forEach(order => {
    const productCode = order["Product No."];
    const quantity = order["Production Qty"] || 0;
    
    data.bomMS
      .filter(item => item["Product Code"] === productCode)
      .forEach(bomItem => {
        const itemCode = bomItem["Item Code"];
        const current = inventoryRequirements.get(itemCode) || {
          required: 0,
          uom: bomItem["UoM Name"],
          description: bomItem["Description"]
        };
        current.required += (bomItem["Quantity"] || 0) * quantity;
        inventoryRequirements.set(itemCode, current);
      });
  });

  inventoryRequirements.forEach((value, itemCode) => {
    const inventoryStock = data.inventoryStock.find(item => item["Item Code"] === itemCode);
    const qcStock = data.qcStock.find(item => item["Item Code"] === itemCode);
    const jobWorkStock = data.jobWorkStock.find(item => item["Item Code"] === itemCode);
    const pendingPO = data.pendingPO.filter(item => item["Item No."] === itemCode)
      .reduce((sum, po) => sum + (po["Open PO Qty"] || 0), 0);

    const inventoryInStores = inventoryStock?.["Stock On"] || 0;
    const inventoryWithQuality = qcStock?.["Stock On"] || 0;
    const inventoryWithVendors = jobWorkStock?.["Stock On"] || 0;
    const netInventoryRequired = Math.max(0, value.required - inventoryInStores - inventoryWithQuality - inventoryWithVendors - pendingPO);

    report.push({
      "Sr No": report.length + 1,
      "Inventory Code": itemCode,
      "Inventory Name": value.description,
      "Inventory Location (optional)": "",
      "Requirement as per BOM based on Production Orders to be executed": value.required,
      "UOM (Unit of material)": value.uom,
      "Inventory in Stores": inventoryInStores,
      "Inventory with Quality": inventoryWithQuality,
      "Inventory with Vendors outside": inventoryWithVendors,
      "Net Inventory required": netInventoryRequired,
      "Purchase order in pipeline": pendingPO,
      "Purchase order to be raised": netInventoryRequired > 0 ? netInventoryRequired : 0,
      "Rate": 0, //need to do something abt this 
      "Amount": 0, // and this
      "Comments": netInventoryRequired > 0 ? "Shortage" : "Sufficient"
    });
  });

  return report;
};

export const downloadExcelReport = (reportData: InventoryAnalysisReport[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(reportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Analysis");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};