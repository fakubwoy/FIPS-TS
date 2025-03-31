export interface StockItem {
    "Item Code": string;
    "Item Description": string;
    "Stock On": number;
    [key: string]: any;
  }
  
  export interface BomItem {
    "Type": string;
    "Item Code": string;
    "Description": string;
    "Quantity": number;
    "UoM Name": string;
    "Warehouse": string;
    "Issue Method": string;
    "Product Code": string;
    [key: string]: any;
  }
  
  export interface ProductionOrder {
    [key: string]: any;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
  }
  
  export interface CombinedStockItem {
    itemCode: string;
    description: string;
    qcStockOn: number;
    inventoryStockOn: number;
    totalStockOn: number;
    errors: string[];
  }
  
  export interface ProcessedExcelData {
    productionOrdersLM: ProductionOrder[];
    productionOrdersMS: ProductionOrder[];
    bomLM: BomItem[];
    bomMS: BomItem[];
    qcStock: StockItem[];
    inventoryStock: StockItem[];
    combinedStock: CombinedStockItem[];
  }