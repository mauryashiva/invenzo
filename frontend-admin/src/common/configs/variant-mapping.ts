import { LAPTOP_SUGGESTIONS } from "../specs/laptop";

export interface VariantAttrConfig {
  key: string;
  options: string[];
}

export interface CategoryMapping {
  attr1: any;
  attr2: any;
  attributes: VariantAttrConfig[];
}

export const CATEGORY_VARIANT_CONFIG: Record<string, CategoryMapping> = {
  smartphone: {
    attributes: [
      {
        key: "RAM",
        options: ["4GB", "6GB", "8GB", "12GB", "16GB", "24GB"],
      },
      {
        key: "Storage",
        options: ["128GB", "256GB", "512GB", "1TB"],
      },
    ],
    attr1: undefined,
    attr2: undefined,
  },
  laptop: {
    attributes: [
      {
        key: "Processor",
        options: LAPTOP_SUGGESTIONS["Processor"] || [],
      },
      {
        key: "RAM",
        options: LAPTOP_SUGGESTIONS["RAM Size"] || [],
      },
      {
        key: "SSD",
        options: ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD", "4TB SSD"],
      },
    ],
    attr1: undefined,
    attr2: undefined,
  },
  tablet: {
    attributes: [
      {
        key: "Connectivity",
        options: ["Wi-Fi Only", "Wi-Fi + Cellular (5G)", "Wi-Fi + 4G"],
      },
      {
        key: "Storage",
        options: ["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"],
      },
    ],
    attr1: undefined,
    attr2: undefined,
  },
};
