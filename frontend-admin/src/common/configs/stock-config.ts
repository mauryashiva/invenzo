// src/common/configs/stock-config.ts
import { type CategoryType } from "@/types/inventory";

interface StockCategoryConfig {
  hasImei: boolean;
  primaryIdentifier: string;
  secondaryIdentifier?: string;
  bulkLayout: "single" | "double";
}

export const STOCK_CONFIG: Record<CategoryType, StockCategoryConfig> = {
  smartphone: {
    hasImei: true,
    primaryIdentifier: "Serial Number",
    secondaryIdentifier: "IMEI",
    bulkLayout: "double",
  },
  tablet: {
    hasImei: true,
    primaryIdentifier: "Serial Number",
    secondaryIdentifier: "IMEI",
    bulkLayout: "double",
  },
  laptop: {
    hasImei: false,
    primaryIdentifier: "Serial Number",
    bulkLayout: "single",
  },
};

/**
 * 💡 Helper to generate a clean display name: "Black (M4 / 16GB / 512GB)"
 * Handles any number of attributes (Laptop = 3, Phone = 2)
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
