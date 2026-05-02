// src/common/colors.ts

// ─── Electronics Color Palette ────────────────────────────────────────────────
// Focused on premium device finishes: titanium, graphite, metallic, glass tones
export const ELECTRONICS_COLOR_MAP: Record<string, string> = {
  "#000000": "Black",
  "#FFFFFF": "White",
  "#808080": "Gray",
  "#C0C0C0": "Silver",
  // Premium Finishes
  "#2C3539": "Titanium Black",
  "#71706E": "Titanium Gray",
  "#E5E4E2": "Platinum",
  "#4B4F54": "Graphite",
  "#36454F": "Charcoal",
  "#708090": "Slate Gray",
  // Apple / Samsung Style
  "#FAF9F6": "Starlight",
  "#EAE0C8": "Beige",
  "#F5F5DC": "Cream",
  "#FFFDD0": "Ivory",
  "#B0E0E6": "Ice Blue",
  "#D8BFD8": "Lavender",
  "#F4A460": "Sand",
  // Blue Variants
  "#1F75FE": "Bright Blue",
  "#002FA7": "Sapphire Blue",
  "#0F52BA": "Cobalt Blue",
  "#1C39BB": "Royal Blue",
  // Green Variants
  "#50C878": "Emerald Green",
  "#3EB489": "Mint Green",
  // Red / Purple
  "#DC143C": "Crimson",
  "#8B0000": "Dark Red",
  "#6A0DAD": "Deep Purple",
  // Gold / Premium
  "#FFD700": "Gold",
  "#D4AF37": "Metallic Gold",
  "#B9A16B": "Champagne Gold",
  "#E6BE8A": "Rose Gold",
};

// ─── Fashion Color Palette ────────────────────────────────────────────────────
// Rich apparel-centric tones: earth tones, pastels, fashion-forward hues
export const FASHION_COLOR_MAP: Record<string, string> = {
  "#000000": "Black",
  "#FFFFFF": "White",
  "#808080": "Gray",
  "#C0C0C0": "Silver",
  // Earth Tones
  "#A0522D": "Sienna",
  "#8B4513": "Saddle Brown",
  "#6B3F2A": "Chocolate",
  "#D2691E": "Rust",
  "#C19A6B": "Camel",
  "#EAE0C8": "Beige",
  "#F5F5DC": "Cream",
  "#FFFDD0": "Ivory",
  "#F4A460": "Sand",
  // Neutrals & Fashion Basics
  "#36454F": "Charcoal",
  "#556B2F": "Olive",
  "#2F4F4F": "Dark Teal",
  "#4F7942": "Fern Green",
  // Fashion Hues
  "#800020": "Burgundy",
  "#DC143C": "Crimson",
  "#FF2400": "Scarlet",
  "#FF6347": "Tomato Red",
  "#FFC0CB": "Pink",
  "#FF69B4": "Hot Pink",
  "#FFB6C1": "Light Pink",
  "#DB7093": "Blush",
  // Blues & Teals
  "#003153": "Prussian Blue",
  "#0F52BA": "Cobalt Blue",
  "#1C39BB": "Royal Blue",
  "#4169E1": "Denim Blue",
  "#008080": "Teal",
  "#20B2AA": "Light Sea Green",
  // Greens
  "#228B22": "Forest Green",
  "#3EB489": "Mint Green",
  "#50C878": "Emerald Green",
  // Purples & Pinks
  "#800080": "Purple",
  "#6A0DAD": "Deep Purple",
  "#DA70D6": "Orchid",
  "#D8BFD8": "Lavender",
  "#9370DB": "Medium Purple",
  // Yellows & Mustards
  "#FFD700": "Gold",
  "#E1AD01": "Mustard",
  "#F0E68C": "Khaki",
  "#FFFF00": "Yellow",
  // Whites / Off-Whites
  "#FAF9F6": "Off White",
  "#FAEBD7": "Antique White",
};

// ─── Unified map (backward compat) ───────────────────────────────────────────
export const COLOR_MAP: Record<string, string> = {
  ...ELECTRONICS_COLOR_MAP,
  ...FASHION_COLOR_MAP,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the display name for a hex value, searching the full map. */
export const getColorNameByHex = (hex: string): string => {
  return COLOR_MAP[hex.toUpperCase()] || "Custom Color";
};

/** Returns the hex for a color name, or null if not found. */
export const getColorHexByName = (name: string): string | null => {
  const hex = Object.keys(COLOR_MAP).find(
    (key) => COLOR_MAP[key].toLowerCase() === name.toLowerCase(),
  );
  return hex || null;
};

/**
 * Returns the department-specific color map for use in dropdowns.
 * @param categoryId  - "electronics" | "fashion" | other
 */
export const getColorMapByDepartment = (
  categoryId?: string,
): Record<string, string> => {
  if (categoryId === "fashion") return FASHION_COLOR_MAP;
  if (categoryId === "electronics") return ELECTRONICS_COLOR_MAP;
  return COLOR_MAP; // fallback: show everything
};
