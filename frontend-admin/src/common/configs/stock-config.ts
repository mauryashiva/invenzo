// src/common/configs/stock-config.ts
import { type CategoryType } from "@/types/inventory";

export interface StockCategoryConfig {
  hasImei: boolean;              // True → show IMEI / secondary ID column
  hasSecondaryId: boolean;       // True → show any secondary identifier column
  primaryIdentifier: string;     // Column header label for the main ID
  secondaryIdentifier?: string;  // Column header label for the secondary ID
  bulkLayout: "single" | "double";
}

// ─── Electronics ─────────────────────────────────────────────────────────────
const ELECTRONICS_STOCK: Record<string, StockCategoryConfig> = {
  smartphone: {
    hasImei: true,
    hasSecondaryId: true,
    primaryIdentifier: "Serial Number",
    secondaryIdentifier: "IMEI",
    bulkLayout: "double",
  },
  tablet: {
    hasImei: true,
    hasSecondaryId: true,
    primaryIdentifier: "Serial Number",
    secondaryIdentifier: "IMEI",
    bulkLayout: "double",
  },
  laptop: {
    hasImei: false,
    hasSecondaryId: false,
    primaryIdentifier: "Serial Number",
    bulkLayout: "single",
  },
};

// ─── Fashion: Apparel ─────────────────────────────────────────────────────────
// Each garment unit gets a Barcode + a Style Code (colour-way / cut reference)
const APPAREL_STOCK: StockCategoryConfig = {
  hasImei: false,
  hasSecondaryId: true,
  primaryIdentifier: "Barcode",
  secondaryIdentifier: "Style Code",
  bulkLayout: "double",
};

// ─── Fashion: Footwear ────────────────────────────────────────────────────────
const FOOTWEAR_STOCK: StockCategoryConfig = {
  hasImei: false,
  hasSecondaryId: true,
  primaryIdentifier: "Barcode",
  secondaryIdentifier: "Style Code",
  bulkLayout: "double",
};

// ─── Fashion: Accessories ─────────────────────────────────────────────────────
// Accessories generally have a single barcode only
const ACCESSORIES_STOCK: StockCategoryConfig = {
  hasImei: false,
  hasSecondaryId: false,
  primaryIdentifier: "Barcode",
  bulkLayout: "single",
};

// ─── Unified map (kept for legacy) ───────────────────────────────────────────
export const STOCK_CONFIG: Record<CategoryType, StockCategoryConfig> = {
  ...ELECTRONICS_STOCK,
} as any;

/**
 * 💡 Smart config resolver — mirrors the getVariantConfig fallback chain.
 *   1. Check specific sub-category (jeans, laptop, …)
 *   2. Fall back to fashionType default (apparel / footwear / accessories)
 *   3. Fall back to electronics category
 *   4. Absolute fallback → smartphone
 */
export const getStockConfig = (
  category: CategoryType,
  categoryId?: string,
  fashionType?: string,
): StockCategoryConfig => {
  const cat = category?.toLowerCase();

  // 1. Specific electronics sub-category
  if (ELECTRONICS_STOCK[cat]) return ELECTRONICS_STOCK[cat];

  // 2. Fashion department — use fashionType defaults
  if (categoryId === "fashion") {
    if (fashionType === "footwear") return FOOTWEAR_STOCK;
    if (fashionType === "accessories") return ACCESSORIES_STOCK;
    return APPAREL_STOCK; // default for apparel (and any unrecognised fashion type)
  }

  // 3. Absolute fallback
  return ELECTRONICS_STOCK.smartphone;
};

/**
 * 💡 Helper to generate a clean display name: "Black (M4 / 16GB / 512GB)"
 * Handles any number of attributes (Laptop = 3, Phone = 2, Fashion = Size / Fit)
 */
export const getVariantDisplayName = (variant: any) => {
  if (!variant?.attributes || !Array.isArray(variant.attributes)) {
    return variant?.colorName || "Unnamed Variant";
  }

  const specs = variant.attributes
    .map((attr: any) => attr.value)
    .filter((v: string) => v && v.trim() !== "")
    .join(" / ");

  return `${variant.colorName || "Default"} (${specs || "No Specs"})`;
};
