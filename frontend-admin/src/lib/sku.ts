/**
 * 💡 Generates a clean, URL-safe SKU slug
 * Handles Electronics (Model based) and Fashion (Style/Art based)
 */
export const generateSKU = (
  brand: string,
  modelOrStyle: string, // Can be Name, Model, or Style Code
  color: string,
  attributes: { value: string }[] = [],
): string => {
  const slug = (str: string) =>
    str
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "")
      .replace(/[^A-Z0-9]/gi, "");

  const brandPart = slug(brand).substring(0, 3);

  // For Fashion, we use the Style Code (usually shorter/unique)
  // For Electronics, we use the Model Number
  const identifierPart = slug(modelOrStyle).substring(0, 8);

  const colorPart = slug(color).substring(0, 3);

  // For Fashion, attributes usually include "Size" (XL, M, 42)
  const attrParts = attributes
    .map((attr) => slug(attr.value))
    .filter(Boolean)
    .join("-");

  // Format: BRAND-ID-COLOR-SPECS
  return [brandPart, identifierPart, colorPart, attrParts]
    .filter(Boolean)
    .join("-");
};
