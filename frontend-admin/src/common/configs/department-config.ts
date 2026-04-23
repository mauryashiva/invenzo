import { FASHION_CATEGORIES } from "../fashion/sub-categories";

/**
 * 🛠️ DEPARTMENT CONFIGURATION
 * Defines how the UI handles category selection for different departments.
 */
export const DEPARTMENT_VIEWS = {
  electronics: {
    type: "fixed",
    subCategories: ["smartphone", "laptop", "tablet"],
  },

  fashion: {
    type: "triple_tier",
    // 🚀 The primary layers for Fashion
    types: ["apparel", "footwear", "accessories"] as const,
    genders: ["women", "men", "kids", "unisex"] as const,

    /**
     * Helper to get sub-categories based on selected Type and Gender
     * Usage in UI: getFashionSubs("apparel", "men")
     */
    getSubs: (type: keyof typeof FASHION_CATEGORIES, gender: string) => {
      return (
        FASHION_CATEGORIES[type]?.[
          gender as keyof (typeof FASHION_CATEGORIES)["apparel"]
        ] || []
      );
    },
  },

  automotive: {
    type: "fixed",
    subCategories: ["parts", "accessories", "tools"],
  },
};

// Useful for TS type checking in components
export type DepartmentType = keyof typeof DEPARTMENT_VIEWS;
