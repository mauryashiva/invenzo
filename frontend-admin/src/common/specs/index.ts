// src/common/specs/index.ts
import { SMARTPHONE_KEYS, SMARTPHONE_SUGGESTIONS } from "./smartphone";
import { LAPTOP_KEYS, LAPTOP_SUGGESTIONS } from "./laptop";

/**
 * Strategy: Returns the correct key-value suggestions based on category.
 * This makes the DynamicSpecs component "Category-Agnostic".
 */
export const getSuggestionsByCategory = (category: string) => {
  const cat = category.toLowerCase();

  switch (cat) {
    case "laptop":
      return {
        keys: LAPTOP_KEYS,
        values: LAPTOP_SUGGESTIONS,
      };
    case "tablet":
      // Tablets usually share many laptop-style specs (M-series chips, etc.)
      return {
        keys: LAPTOP_KEYS,
        values: LAPTOP_SUGGESTIONS,
      };
    case "smartphone":
    default:
      return {
        keys: SMARTPHONE_KEYS,
        values: SMARTPHONE_SUGGESTIONS,
      };
  }
};
