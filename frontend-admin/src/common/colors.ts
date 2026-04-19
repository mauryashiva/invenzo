// src/common/colors.ts

// src/common/colors.ts

export const COLOR_MAP: Record<string, string> = {
  // Basic Colors
  "#000000": "Black",
  "#FFFFFF": "White",
  "#808080": "Gray",
  "#C0C0C0": "Silver",

  // Premium Finishes
  "#2C3539": "Titanium Black",
  "#71706E": "Titanium Gray",
  "#E5E4E2": "Platinum",
  "#4B4F54": "Graphite",

  // Apple / Samsung Style
  "#F5F5DC": "Cream",
  "#FFFDD0": "Ivory",
  "#FAF9F6": "Starlight",
  "#EAE0C8": "Beige",

  // Blue Variants
  "#0000FF": "Blue",
  "#1F75FE": "Bright Blue",
  "#002FA7": "Sapphire Blue",
  "#0F52BA": "Cobalt Blue",
  "#1C39BB": "Royal Blue",

  // Green Variants
  "#00FF00": "Green",
  "#228B22": "Forest Green",
  "#50C878": "Emerald Green",
  "#4CBB17": "Lime Green",
  "#3EB489": "Mint Green",

  // Red Variants
  "#FF0000": "Red",
  "#8B0000": "Dark Red",
  "#DC143C": "Crimson",
  "#FF2400": "Scarlet",

  // Purple / Pink
  "#800080": "Purple",
  "#6A0DAD": "Deep Purple",
  "#DA70D6": "Orchid",
  "#FFC0CB": "Pink",
  "#FF69B4": "Hot Pink",

  // Gold / Premium
  "#FFD700": "Gold",
  "#D4AF37": "Metallic Gold",
  "#B9A16B": "Champagne Gold",
  "#E6BE8A": "Rose Gold",

  // Special Mobile Colors
  "#B0E0E6": "Ice Blue",
  "#D8BFD8": "Lavender",
  "#F4A460": "Sand",
  "#708090": "Slate Gray",
  "#36454F": "Charcoal",
};

// 1. Get Name from Hex
export const getColorNameByHex = (hex: string) => {
  return COLOR_MAP[hex.toUpperCase()] || "Custom Color";
};

// 2. Get Hex from Name
export const getColorHexByName = (name: string) => {
  const hex = Object.keys(COLOR_MAP).find(
    (key) => COLOR_MAP[key].toLowerCase() === name.toLowerCase(),
  );
  return hex || null; // Return null if not found so we don't accidentally overwrite with Black
};
