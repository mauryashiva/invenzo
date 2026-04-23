export interface SpecEntry {
  key: string;
  value: string;
}

/**
 * 🏷️ CategoryType
 * Core electronics are explicitly typed, while Fashion and other
 * sub-categories are supported via string expansion.
 */
export type CategoryType =
  | "smartphone"
  | "laptop"
  | "tablet"
  | "fashion"
  | string;

export interface VariantAttribute {
  key: string; // e.g., "RAM", "Processor", "Size", "Fit"
  value: string; // e.g., "12GB", "M4 Max", "XL", "Slim Fit"
}

export interface Variant {
  id?: string;
  sku: string;
  color: string;
  colorName: string;

  // 🔄 DYNAMIC ARRAY: Handles all specs (Electronics OR Fashion)
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
  serialNumber: string; // For Fashion, this acts as a unique Batch/Tag ID
  imei1?: string;
  imei2?: string;
  condition: "New" | "Open Box" | "Refurbished";
  status: "In stock" | "Sold" | "Defective";
}

export interface InventoryProduct {
  brandId: string;
  name: string;
  modelNumber: string; // For Electronics
  styleCode?: string; // 👗 Fashion specific primary identifier

  stockUnits: StockUnit[];
  categoryId: "electronics" | "fashion" | "automotive" | string;

  // 👗 NEW: FASHION HIERARCHY FIELDS (3-Tier Support)
  fashionType?: "apparel" | "footwear" | "accessories";
  gender?: "women" | "men" | "kids" | "unisex";

  category: CategoryType; // This stores the final sub-category (e.g., "Jeans")

  warranty: number;
  purchaseGst: number;
  salesGst: number;

  specs: SpecEntry[]; // Used for Electronics technical specs
  features: string[]; // Used for Key Features list
  description?: string; // Long product description

  variants: Variant[];

  // 📏 FASHION SIZE SYSTEM DATA
  selectedSizes?: string[]; // e.g., ["M", "L", "XL"] or ["32", "34"]
  sizeGuideData?: Record<string, Record<string, string | number>>; // Nested object for measurements

  // 🏷️ FASHION ATTRIBUTES
  occasion?: string;
  season?: string;
  fabric?: string;
  careInstructions?: string;
}
