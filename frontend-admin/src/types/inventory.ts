export interface SpecEntry {
  key: string;
  value: string;
}

export type CategoryType =
  | "smartphone"
  | "laptop"
  | "tablet"
  | "fashion"
  | string;

export interface VariantAttribute {
  key: string; // e.g., "RAM", "Processor", "Size"
  value: string; // e.g., "12GB", "M4 Max", "XL"
}

export interface Variant {
  id?: string;
  sku: string;
  color: string;
  colorName: string;

  // 🔄 DYNAMIC ARRAY: This replaces hardcoded ram/storage
  attributes: VariantAttribute[];

  baseCost: number;
  sellingPrice: number;
  reorderLevel: number;
  stock: number;
  images?: string[];
}

export interface StockUnit {
  id: string;
  variantId: string;
  serialNumber: string;
  imei1?: string;
  imei2?: string;
  condition: "New" | "Open Box" | "Refurbished";
  status: "In stock" | "Sold" | "Defective";
}

export interface InventoryProduct {
  brandId: string;
  name: string;
  modelNumber: string;
  stockUnits: StockUnit[];
  categoryId: string;
  subcategoryId?: string;
  category: CategoryType;
  warranty: number;
  purchaseGst: number;
  salesGst: number;
  specs: SpecEntry[];
  features: string[];
  variants: Variant[];
}
