import { LAPTOP_SUGGESTIONS } from "../specs/laptop";

export interface VariantAttrConfig {
  key: string;
  options: string[];
  isDynamic?: boolean; // 🚀 True if options come from 'selectedSizes'
}

export interface CategoryMapping {
  attributes: VariantAttrConfig[];
  // Legacy support for older components if needed, though we use 'attributes' array now
  attr1?: any; 
  attr2?: any;
}

export const CATEGORY_VARIANT_CONFIG: Record<string, CategoryMapping> = {
  // ================= ELECTRONICS =================
  smartphone: {
    attributes: [
      { key: "RAM", options: ["4GB", "6GB", "8GB", "12GB", "16GB", "24GB"] },
      { key: "Storage", options: ["128GB", "256GB", "512GB", "1TB"] },
    ],
  },
  laptop: {
    attributes: [
      { key: "Processor", options: LAPTOP_SUGGESTIONS["Processor"] || [] },
      { key: "RAM", options: LAPTOP_SUGGESTIONS["RAM Size"] || [] },
      { key: "SSD", options: ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"] },
    ],
  },
  tablet: {
    attributes: [
      { key: "Connectivity", options: ["Wi-Fi Only", "Wi-Fi + Cellular", "Wi-Fi + 4G"] },
      { key: "RAM", options: ["4GB", "8GB", "12GB", "16GB"] },
      { key: "Storage", options: ["64GB", "128GB", "256GB", "512GB", "1TB"] },
    ],
  },

  // ================= FASHION: APPAREL =================
  // Default fallback for any clothing item
  apparel_default: {
    attributes: [
      { key: "Size", options: [], isDynamic: true }, // Pulls from selectedSizes
      { key: "Fit", options: ["Slim Fit", "Regular Fit", "Relaxed Fit", "Oversized", "Skinny Fit"] },
    ],
  },
  jeans: {
    attributes: [
      { key: "Size", options: [], isDynamic: true },
      { key: "Fit", options: ["Slim Fit", "Straight Fit", "Tapered Fit", "Bootcut", "Loose Fit"] },
      { key: "Inseam", options: ["30L", "32L", "34L"] },
    ],
  },

  // ================= FASHION: FOOTWEAR =================
  footwear_default: {
    attributes: [
      { key: "Size", options: [], isDynamic: true },
      { key: "Width", options: ["Narrow", "Standard (D)", "Wide (EE)", "Extra Wide"] },
    ],
  },

  // ================= FASHION: ACCESSORIES =================
  accessories_default: {
    attributes: [
      { key: "Material", options: ["Leather", "Stainless Steel", "Canvas", "Silicon", "Gold Plated"] },
    ],
  },
};

/**
 * 💡 Helper to get the variant configuration based on sub-category
 * If a specific sub-category (like 'jeans') isn't found, it falls back to a type default.
 */
export const getVariantConfig = (category: string, fashionType?: string): CategoryMapping => {
  const cat = category?.toLowerCase();
  
  // 1. Check for specific sub-category config
  if (CATEGORY_VARIANT_CONFIG[cat]) return CATEGORY_VARIANT_CONFIG[cat];

  // 2. Fallback to Fashion Type defaults
  if (fashionType === "apparel") return CATEGORY_VARIANT_CONFIG.apparel_default;
  if (fashionType === "footwear") return CATEGORY_VARIANT_CONFIG.footwear_default;
  if (fashionType === "accessories") return CATEGORY_VARIANT_CONFIG.accessories_default;

  // 3. Absolute Fallback to avoid crashes
  return CATEGORY_VARIANT_CONFIG.smartphone;
};