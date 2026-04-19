import { SMARTPHONE_KEYS, SMARTPHONE_SUGGESTIONS } from "./smartphone";
import { LAPTOP_KEYS, LAPTOP_SUGGESTIONS } from "./laptop";
import { TABLET_KEYS, TABLET_SUGGESTIONS } from "./tablet"; // New Import

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
      // 🚀 Now uses dedicated Tablet specs instead of sharing with Laptops
      return {
        keys: TABLET_KEYS,
        values: TABLET_SUGGESTIONS,
      };

    case "smartphone":
    default:
      return {
        keys: SMARTPHONE_KEYS,
        values: SMARTPHONE_SUGGESTIONS,
      };
  }
};
