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
  export interface JobWorkStockItem {
    Location: string;
    "Item Code": string;
    "Item Description": string;
    Group: string;
    UOM: string;
    "Stock On": number;
    Whs: string;
    WAP: number;
    Value: number;
  }
  
  export interface PendingPOItem {
    "#": string;
    Branch: string;
    Name: string;
    SeriesName: string;
    "PO No": string;
    "PO Status": string;
    "PO Date": string;
    "PO Create Date": string;
    "Vendor Name": string;
    "Vendor Ref No": string;
    "Item No.": string;
    "Item Description": string;
    "Warehouse Code": string;
    Quantity: number;
    "Short Close Qty": number;
    "Open PO Qty": number;
    UOM: string;
    Price: number;
    "Unit Price": number;
    "Line Total": number;
    "Discount%": number;
  }
  
  export interface ResourceAnalysisItem {
    productionNumber: string;
    productCode: string;
    requiredQuantity: number;
    totalAvailable: number;
    difference: number;
    status: 'Excess' | 'Shortage' | 'Adequate';
    components: {
      itemCode: string;
      description: string;
      requiredQty: number;
      availableStock: number;
      pendingPO: number;
      jobWorkStock: number;
      difference: number;
    }[];
  
  }
  
  export interface ProcessedExcelData {
    productionOrdersLM: ProductionOrder[];
    productionOrdersMS: ProductionOrder[];
    bomLM: BomItem[];
    bomMS: BomItem[];
    qcStock: StockItem[];
    inventoryStock: StockItem[];
    combinedStock: CombinedStockItem[];
    jobWorkStock: JobWorkStockItem[];
  pendingPO: PendingPOItem[];
  resourceAnalysis: ResourceAnalysisItem[];
  }

export interface InventoryAnalysisReport {
  "Sr No": number;
  "Inventory Code": string;
  "Inventory Name": string;
  "Inventory Location (optional)": string;
  "Requirement as per BOM based on Production Orders to be executed": number;
  "UOM (Unit of material)": string;
  "Inventory in Stores": number;
  "Inventory with Quality": number;
  "Inventory with Vendors outside": number;
  "Net Inventory required": number;
  "Purchase order in pipeline": number;
  "Purchase order to be raised": number;
  "Rate": number;
  "Amount": number;
  "Comments": string;
}