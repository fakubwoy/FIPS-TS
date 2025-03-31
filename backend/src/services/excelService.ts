import * as XLSX from 'xlsx';
import path from 'path';
import { ProcessedExcelData, StockItem, BomItem, ProductionOrder } from '../types/types';

export const processExcel = async (filePath: string): Promise<ProcessedExcelData> => {
    // Resolve to absolute path
    const absolutePath = path.resolve(filePath);
    
    const workbook = XLSX.readFile(absolutePath);
  
    const getSheetData = <T>(sheetName: string): T[] => {
      const sheet = workbook.Sheets[sheetName];
      return sheet ? XLSX.utils.sheet_to_json<T>(sheet) : [];
    };

  const prodOrdersLM = getSheetData<ProductionOrder>('Prod. Ord Pdt LM');
  const prodOrdersMS = getSheetData<ProductionOrder>('Prod. Ord Pdt MS');
  const bomLM = getSheetData<BomItem>('LM BOM');
  const bomMS = getSheetData<BomItem>('MS BOM');
  const qcStock = getSheetData<StockItem>('QC Stock');
  const inventoryStock = getSheetData<StockItem>('Inventory in Stock');

  const combinedStock = combineStockData(qcStock, inventoryStock);

  return {
    productionOrdersLM: prodOrdersLM,
    productionOrdersMS: prodOrdersMS,
    bomLM,
    bomMS,
    qcStock,
    inventoryStock,
    combinedStock
  };
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