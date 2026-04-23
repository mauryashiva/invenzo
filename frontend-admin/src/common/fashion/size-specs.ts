export interface MeasurementConfig {
  key: string;
  label: string;
  unit: "cm" | "in" | "UK" | "EU" | "US";
  description: string;
}

export const FASHION_MEASUREMENT_CONFIG: Record<string, MeasurementConfig[]> = {
  tops: [
    {
      key: "chest",
      label: "Chest",
      unit: "cm",
      description: "Measure around the fullest part of the chest",
    },
    {
      key: "waist",
      label: "Waist",
      unit: "cm",
      description: "Measure around the natural waistline",
    },
    {
      key: "length",
      label: "Length",
      unit: "cm",
      description: "Measure from the top of the shoulder to the hem",
    },
  ],

  bottoms: [
    {
      key: "waist",
      label: "Waist",
      unit: "cm",
      description: "Measure where the person usually wears their belt",
    },
    {
      key: "hip",
      label: "Hip",
      unit: "cm",
      description: "Measure around the fullest part of the hips",
    },
    {
      key: "inseam",
      label: "Inseam",
      unit: "cm",
      description: "Measure from the crotch to the ankle bone",
    },
    {
      key: "length",
      label: "Length",
      unit: "cm",
      description: "Measure from the waist to the bottom hem",
    },
  ],

  fullbody: [
    {
      key: "chest",
      label: "Chest",
      unit: "cm",
      description: "Fullest part of the chest",
    },
    {
      key: "waist",
      label: "Waist",
      unit: "cm",
      description: "Natural waistline",
    },
    {
      key: "hip",
      label: "Hip",
      unit: "cm",
      description: "Fullest part of the hips",
    },
    {
      key: "length",
      label: "Length",
      unit: "cm",
      description: "Measure from the shoulder to the bottom hem",
    },
  ],

  footwear: [
    {
      key: "foot_length",
      label: "Foot Length",
      unit: "cm",
      description: "Heel to toe length",
    },
    {
      key: "uk_size",
      label: "UK Size",
      unit: "UK",
      description: "Standard United Kingdom sizing",
    },
    {
      key: "eu_size",
      label: "EU Size",
      unit: "EU",
      description: "Standard European sizing",
    },
  ],
};

/**
 * 🛠️ Helper to map Sub-Categories to measurement groups
 * This drives the SizeGuideTable columns dynamically.
 */
export const getSpecsByCategory = (category: string): MeasurementConfig[] => {
  if (!category) return [];
  const cat = category.toLowerCase().trim();

  // 👖 Bottom wear (Focus: Waist/Hip/Inseam)
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

  // 👕 Top wear (Focus: Chest/Length)
  const topWear = [
    "shirt",
    "t-shirt",
    "kurti",
    "top",
    "jacket",
    "hoodie",
    "sweatshirt",
    "blouse",
    "shrug",
    "sweater",
    "blazer",
    "waistcoat",
  ];

  // 👗 Full body (Focus: Chest/Waist/Hip/Length)
  const fullBodyWear = [
    "dress",
    "saree",
    "lehenga",
    "suit set",
    "ethnic set",
    "kurta",
    "frock",
    "onesie",
    "nightwear",
    "sportswear",
    "school uniform",
    "suit",
    "jumpsuit",
    "playsuit",
    "co-ord set",
    "sherwani",
    "track suit",
    "dupatta",
  ];

  // 👟 Footwear (Focus: Foot length/Conversions)
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

  // 🕶️ Accessories (No Table Needed)
  const accessories = [
    "handbag",
    "clutch",
    "backpack",
    "jewelry",
    "sunglasses",
    "watch",
    "belt",
    "scarf",
    "hair accessories",
    "socks",
    "stockings",
    "wallet",
    "tie",
    "cap",
    "cufflinks",
    "school bag",
    "gloves",
  ];

  if (bottomWear.includes(cat)) return FASHION_MEASUREMENT_CONFIG.bottoms;
  if (topWear.includes(cat)) return FASHION_MEASUREMENT_CONFIG.tops;
  if (footwear.includes(cat)) return FASHION_MEASUREMENT_CONFIG.footwear;
  if (fullBodyWear.includes(cat)) return FASHION_MEASUREMENT_CONFIG.fullbody;

  // Return empty array for accessories or unknown items to hide the table
  if (accessories.includes(cat)) return [];

  // Default fallback (returns empty to prevent UI clutter on unknown items)
  return [];
};
