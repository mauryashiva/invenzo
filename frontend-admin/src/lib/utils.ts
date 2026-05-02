// src/lib/utils.ts

/**
 * Transforms string to Title Case (First letter of each word)
 * e.g. "samsung galaxy s25" -> "Samsung Galaxy S25"
 */
export const formatTitleCase = (str: string): string => {
  return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
};

/**
 * Transforms string to Uppercase for IDs/Models
 * e.g. "sm-s938b" -> "SM-S938B"
 */
export const formatModelCode = (str: string): string => {
  return str.toUpperCase().trim();
};

