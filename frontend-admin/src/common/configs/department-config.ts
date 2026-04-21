import { FASHION_SUB_CATEGORIES } from "../fashion/sub-categories"; // 👈 Add this import!
export const DEPARTMENT_VIEWS = {
  electronics: {
    type: "fixed",
    subCategories: ["smartphone", "laptop", "tablet"],
  },
  fashion: {
    type: "gender_filtered",
    genders: ["women", "men", "kids", "unisex"],
    mapping: FASHION_SUB_CATEGORIES,
  },
};
