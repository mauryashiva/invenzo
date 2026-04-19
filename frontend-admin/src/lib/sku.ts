// src/lib/sku.ts

/**
 * 💡 Generates a clean, URL-safe SKU slug
 * Example: "Apple" + "iPhone 15" + "Black" + "128GB" -> "APL-IP15-BLK-128"
 */
export const generateSKU = (
  brand: string,
  model: string,
  color: string,
  attributes: { value: string }[] = [],
): string => {
  // Helper to clean strings: Uppercase, remove spaces, remove special characters
  const slug = (str: string) =>
    str
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "") // Remove all spaces
      .replace(/[^A-Z0-9]/gi, ""); // Remove non-alphanumeric

  const brandPart = slug(brand).substring(0, 3);
  const modelPart = slug(model).substring(0, 6);
  const colorPart = slug(color).substring(0, 3);

  // Get values from attributes (RAM, Storage, etc.)
  const attrParts = attributes
    .map((attr) => slug(attr.value))
    .filter(Boolean)
    .join("-");

  // Format: BRAND-MODEL-COLOR-SPECS
  const baseSku = [brandPart, modelPart, colorPart, attrParts]
    .filter(Boolean)
    .join("-");

  return baseSku;
};
