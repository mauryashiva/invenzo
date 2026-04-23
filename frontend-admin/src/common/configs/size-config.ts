/**
 * 🏷️ SizeScaleType
 * Extended to support Footwear and specific regional standards.
 */
export type SizeScaleType =
  | "alpha"
  | "numeric"
  | "footwear"
  | "eu"
  | "uk"
  | "custom";

export interface SizeScale {
  id: SizeScaleType;
  label: string;
  values: string[];
  measurementFields: string[]; // Fields required for the Size Guide table
}

export const SIZE_SCALES: Record<SizeScaleType, SizeScale> = {
  alpha: {
    id: "alpha",
    label: "Alpha (XS-3XL)",
    values: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    measurementFields: ["Chest", "Waist", "Hip", "Length"],
  },
  numeric: {
    id: "numeric",
    label: "Numeric (28-42)",
    values: ["28", "30", "32", "34", "36", "38", "40", "42"],
    measurementFields: ["Waist", "Hip", "Inseam", "Length"],
  },
  footwear: {
    id: "footwear",
    label: "Footwear (UK 6-12)",
    values: ["6", "7", "8", "9", "10", "11", "12"],
    measurementFields: ["Foot Length", "UK Size", "EU Size"],
  },
  eu: {
    id: "eu",
    label: "EU (36-46)",
    values: ["36", "38", "40", "42", "44", "46"],
    measurementFields: ["Chest", "Waist", "Hip", "Length"],
  },
  uk: {
    id: "uk",
    label: "UK (6-18)",
    values: ["6", "8", "10", "12", "14", "16", "18"],
    measurementFields: ["Chest", "Waist", "Hip", "Length"],
  },
  custom: {
    id: "custom",
    label: "Custom",
    values: [], // Populated dynamically by user
    measurementFields: ["Chest", "Waist", "Hip", "Length"],
  },
};

/**
 * 💡 Helper to get measurement fields based on sub-category groups.
 * This ensures the SizeGuideTable renders the correct columns for the selected item.
 */
export const getMeasurementColumns = (subCategory: string): string[] => {
  if (!subCategory) return ["Chest", "Waist", "Hip", "Length"];

  const cat = subCategory.toLowerCase().trim();

  // 👖 Bottom Wear Group
  const bottomWear = [
    "jeans",
    "trousers",
    "shorts",
    "skirt",
    "track pants",
    "joggers",
    "leggings",
    "palazzo",
  ];

  // 👟 Footwear Group
  const footwear = [
    "heels",
    "heeled sandals",
    "flats",
    "sandals",
    "sneakers",
    "boots",
    "loafers",
    "sports shoes",
    "flip flops",
    "sliders",
    "ethnic footwear",
    "formal shoes",
    "casual shoes",
    "slippers",
    "school shoes",
  ];

  // 🕶️ Accessories Group (Usually return empty as they don't use standard size guides)
  const accessories = [
    "handbag",
    "clutch",
    "backpack",
    "jewelry",
    "sunglasses",
    "watch",
    "belt",
    "socks",
    "wallet",
    "tie",
    "cap",
  ];

  if (footwear.includes(cat)) {
    return ["Foot Length", "UK Size", "EU Size"];
  }

  if (bottomWear.includes(cat)) {
    return ["Waist", "Hip", "Inseam", "Length"];
  }

  if (accessories.includes(cat)) {
    return []; // Hides the table for accessories
  }

  // Default: Full Body / Tops
  return ["Chest", "Waist", "Hip", "Length"];
};
