import * as XLSX from 'xlsx';
import path from 'path';
import { 
  ProcessedExcelData, 
  StockItem, 
  BomItem, 
  ProductionOrder,
  JobWorkStockItem,
  PendingPOItem,
  ResourceAnalysisItem
} from '../types/types';

export const processExcel = async (filePath: string): Promise<ProcessedExcelData> => {
  const workbook = XLSX.readFile(filePath);

  const prodOrdersLM = XLSX.utils.sheet_to_json<ProductionOrder>(workbook.Sheets["Prod. Ord Pdt LM"]);
  const prodOrdersMS = XLSX.utils.sheet_to_json<ProductionOrder>(workbook.Sheets["Prod. Ord Pdt MS"]);
  const bomLM = XLSX.utils.sheet_to_json<BomItem>(workbook.Sheets["LM BOM"]);
  const bomMS = XLSX.utils.sheet_to_json<BomItem>(workbook.Sheets["MS BOM"]);
  const qcStock = XLSX.utils.sheet_to_json<StockItem>(workbook.Sheets["QC Stock"]);
  const inventoryStock = XLSX.utils.sheet_to_json<StockItem>(workbook.Sheets["Inventory in Stock"]);
  const jobWorkStock = XLSX.utils.sheet_to_json<JobWorkStockItem>(workbook.Sheets["Job Work Stock"]);
  const pendingPO = XLSX.utils.sheet_to_json<PendingPOItem>(workbook.Sheets["Pending PO"]);

  const resourceAnalysis = analyzeResources(
    prodOrdersLM,
    prodOrdersMS,
    bomLM,
    bomMS,
    qcStock,
    inventoryStock,
    jobWorkStock,
    pendingPO
  );

  const combinedStock = combineStockData(qcStock, inventoryStock);

  return {
    productionOrdersLM: prodOrdersLM,
    productionOrdersMS: prodOrdersMS,
    bomLM,
    bomMS,
    qcStock,
    inventoryStock,
    combinedStock,
    jobWorkStock,
    pendingPO,
    resourceAnalysis
  };
};

const analyzeResources = (
  prodOrdersLM: ProductionOrder[],
  prodOrdersMS: ProductionOrder[],
  bomLM: BomItem[],
  bomMS: BomItem[],
  qcStock: StockItem[],
  inventoryStock: StockItem[],
  jobWorkStock: JobWorkStockItem[],
  pendingPO: PendingPOItem[]
): ResourceAnalysisItem[] => {
  const analysis: ResourceAnalysisItem[] = [];

  const combinedStock = new Map<string, number>();
  
  qcStock.forEach(item => {
    const key = item["Item Code"];
    if (key) {
      combinedStock.set(key, (combinedStock.get(key) || 0) + (item["Stock On"] || 0));
    }
  });

  inventoryStock.forEach(item => {
    const key = item["Item Code"];
    if (key) {
      combinedStock.set(key, (combinedStock.get(key) || 0) + (item["Stock On"] || 0));
    }
  });

  jobWorkStock.forEach(item => {
    const key = item["Item Code"];
    if (key) {
      combinedStock.set(key, (combinedStock.get(key) || 0) + (item["Stock On"] || 0));
    }
  });

  const pendingPOMap = new Map<string, number>();
  pendingPO.forEach(item => {
    const key = item["Item No."];
    if (key) {
      pendingPOMap.set(key, (pendingPOMap.get(key) || 0) + (item["Open PO Qty"] || 0));
    }
  });

  prodOrdersLM.forEach(order => {
    const prodNo = order["Prod No"];
    const productCode = order["Product No."];
    const quantity = order["Production Qty"] || 0;
    
    if (prodNo && productCode) {
      const components = bomLM
        .filter(item => item["Product Code"] === productCode)
        .map(bomItem => {
          const itemCode = bomItem["Item Code"];
          const requiredQty = (bomItem["Quantity"] || 0) * quantity;
          const availableStock = combinedStock.get(itemCode) || 0;
          const pendingPOQty = pendingPOMap.get(itemCode) || 0;
          const totalAvailable = availableStock + pendingPOQty;
          
          return {
            itemCode,
            description: bomItem["Description"],
            requiredQty,
            availableStock,
            pendingPO: pendingPOQty,
            jobWorkStock: jobWorkStock.find(j => j["Item Code"] === itemCode)?.["Stock On"] || 0,
            difference: totalAvailable - requiredQty
          };
        });

      const totalRequired = components.reduce((sum, c) => sum + c.requiredQty, 0);
      const totalAvailable = components.reduce((sum, c) => sum + c.availableStock + c.pendingPO, 0);
      const difference = totalAvailable - totalRequired;
      
      analysis.push({
        productionNumber: prodNo,
        productCode,
        requiredQuantity: totalRequired,
        totalAvailable,
        difference,
        status: difference >= 0 ? 'Excess' : 'Shortage',
        components
      });
    }
  });

  prodOrdersMS.forEach(order => {
    const prodNo = order["Prod No"];
    const productCode = order["Product No."];
    const quantity = order["Production Qty"] || 0;
    
    if (prodNo && productCode) {
      const components = bomMS
        .filter(item => item["Product Code"] === productCode)
        .map(bomItem => {
          const itemCode = bomItem["Item Code"];
          const requiredQty = (bomItem["Quantity"] || 0) * quantity;
          const availableStock = combinedStock.get(itemCode) || 0;
          const pendingPOQty = pendingPOMap.get(itemCode) || 0;
          const totalAvailable = availableStock + pendingPOQty;
          
          return {
            itemCode,
            description: bomItem["Description"],
            requiredQty,
            availableStock,
            pendingPO: pendingPOQty,
            jobWorkStock: jobWorkStock.find(j => j["Item Code"] === itemCode)?.["Stock On"] || 0,
            difference: totalAvailable - requiredQty
          };
        });

      const totalRequired = components.reduce((sum, c) => sum + c.requiredQty, 0);
      const totalAvailable = components.reduce((sum, c) => sum + c.availableStock + c.pendingPO, 0);
      const difference = totalAvailable - totalRequired;
      
      analysis.push({
        productionNumber: prodNo,
        productCode,
        requiredQuantity: totalRequired,
        totalAvailable,
        difference,
        status: difference >= 0 ? 'Excess' : 'Shortage',
        components
      });
    }
  });

  return analysis;
};

const combineStockData = (qcStock: StockItem[], inventoryStock: StockItem[]) => {
  const combinedItems = new Map<string, any>();

  qcStock.forEach(item => {
    const itemCode = item["Item Code"];
    if (itemCode) {
      combinedItems.set(itemCode, {
        itemCode,
        description: item["Item Description"] || "",
        qcStockOn: item["Stock On"] || 0,
        inventoryStockOn: 0,
        totalStockOn: item["Stock On"] || 0,
        errors: validateStockItem(item)
      });
    }
  });

  inventoryStock.forEach(item => {
    const itemCode = item["Item Code"];
    if (itemCode) {
      if (combinedItems.has(itemCode)) {
        const existingItem = combinedItems.get(itemCode);
        existingItem.inventoryStockOn = item["Stock On"] || 0;
        existingItem.totalStockOn = (existingItem.qcStockOn || 0) + (item["Stock On"] || 0);
        combinedItems.set(itemCode, existingItem);
      } else {
        combinedItems.set(itemCode, {
          itemCode,
          description: item["Item Description"] || "",
          qcStockOn: 0,
          inventoryStockOn: item["Stock On"] || 0,
          totalStockOn: item["Stock On"] || 0,
          errors: validateStockItem(item)
        });
      }
    }
  });

  return Array.from(combinedItems.values());
};

const validateStockItem = (item: StockItem): string[] => {
  const errors: string[] = [];
  
  if (item["Stock On"] === 0) errors.push("Stock On is zero");
  if (item["Stock On"] < 0) errors.push("Stock On is negative");
  if (!item["Item Code"] || item["Item Code"] === "ITM999") errors.push("Invalid Item Code");
  
  return errors.length > 0 ? errors : [];
};