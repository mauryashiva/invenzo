// Definitions for the Dynamic Specs component
export interface SpecEntry {
  key: string;
  value: string;
}

export type CategoryType = "smartphone" | "laptop" | "tablet";

export interface Variant {
  id?: string;
  sku: string;
  color: string;
  colorName: string; // Added: The display name (e.g. Titanium Black)
  ram: string;
  storage: string;
  baseCost: number; // Purchase Price (Retailer Buy)
  sellingPrice: number; // Selling Price (Customer Sell)
  reorderLevel: number; // Added: Minimum stock alert level
  stock: number;
  images?: string[];
}

export interface InventoryProduct {
  brandId: string;
  name: string;
  modelNumber: string;
  stockUnits: StockUnit[];

  // Using IDs for DB normalization instead of hardcoded strings
  categoryId: string;
  subcategoryId?: string;

  // UI helper to keep track of the active view
  category: CategoryType;

  warranty: number;
  purchaseGst: number;
  salesGst: number;

  // Changed to SpecEntry[] to support the DynamicSpecs UI logic
  specs: SpecEntry[];

  features: string[]; // For the multi-line textarea
  variants: Variant[];
}

export interface StockUnit {
  id: string;
  variantId: string; // Links to a specific RAM/Storage/Color combo
  serialNumber: string;
  imei1?: string;
  imei2?: string;
  condition: "New" | "Open Box" | "Refurbished";
  status: "In stock" | "Sold" | "Defective";
}
