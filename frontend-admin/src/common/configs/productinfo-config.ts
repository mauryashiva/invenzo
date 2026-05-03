import { OCCASION_OPTIONS, SEASON_OPTIONS } from "../fashion/occasionoption";

export interface FieldConfig {
  name: string;
  label: string;
  type:
    | "text"
    | "select"
    | "hybrid-select"
    | "textarea"
    | "number"
    | "brand-select";
  placeholder?: string;
  options?: string[];
  readOnly?: boolean;
}

const FINANCE_FIELDS: FieldConfig[] = [
  {
    name: "purchaseGst",
    label: "Purchase GST (%)",
    type: "number",
    placeholder: "18",
  },
  {
    name: "salesGst",
    label: "Sales GST (%)",
    type: "number",
    readOnly: true,
  },
  {
    name: "hsn",
    label: "HSN Code",
    type: "text",
    readOnly: true,
  },
];

export const PRODUCT_INFO_SCHEMA: Record<string, FieldConfig[]> = {
  // ================= ELECTRONICS =================
  electronics: [
    { name: "brandId", label: "Brand", type: "brand-select" },
    {
      name: "name",
      label: "Product Name",
      type: "text",
      placeholder: "e.g. Samsung Galaxy S25 Ultra",
    },
    {
      name: "modelNumber",
      label: "Model Number",
      type: "text",
      placeholder: "e.g. SM-S938B",
    },
    {
      name: "warranty",
      label: "Warranty (Months)",
      type: "number",
      placeholder: "12",
    },
    ...FINANCE_FIELDS,
    {
      name: "features",
      label: "Key Features (One per line)",
      type: "textarea",
      placeholder: "200MP Camera\nSnapdragon 8 Elite",
    },
  ],

  // ================= 👗 FASHION: APPAREL =================
  fashion_apparel: [
    { name: "brandId", label: "Brand", type: "brand-select" },
    {
      name: "name",
      label: "Product Name",
      type: "text",
      placeholder: "e.g. Slim Fit Denim",
    },
    {
      name: "styleCode",
      label: "Style Code",
      type: "text",
      placeholder: "e.g. DNM-001",
    },
    {
      name: "fabric",
      label: "Fabric / Material",
      type: "text",
      placeholder: "e.g. 100% Cotton, Linen, Denim",
    },
    {
      name: "occasion",
      label: "Occasion",
      type: "hybrid-select",
      options: OCCASION_OPTIONS.filter((opt) =>
        [
          "Casual",
          "Formal",
          "Workwear",
          "Party",
          "Ethnic",
          "Wedding",
          "Festive",
          "Lounge",
          "Nightwear",
          "Innerwear",
        ].includes(opt),
      ),
    },
    {
      name: "season",
      label: "Season",
      type: "select",
      options: SEASON_OPTIONS,
    },
    ...FINANCE_FIELDS,
    {
      name: "features",
      label: "Description",
      type: "textarea",
      placeholder: "Product details, fit information, and style tips...",
    },
  ],

  // ================= 👟 FASHION: FOOTWEAR =================
  fashion_footwear: [
    { name: "brandId", label: "Brand", type: "brand-select" },
    {
      name: "name",
      label: "Product Name",
      type: "text",
      placeholder: "e.g. Air Max Sneakers",
    },
    {
      name: "styleCode",
      label: "Style Code",
      type: "text",
      placeholder: "e.g. NK-SNE-99",
    },
    {
      name: "upperMaterial",
      label: "Upper Material",
      type: "text",
      placeholder: "e.g. Synthetic Leather / Mesh / Suede",
    },
    {
      name: "soleMaterial",
      label: "Sole Material",
      type: "text",
      placeholder: "e.g. Rubber / EVA / TPU",
    },
    {
      name: "occasion",
      label: "Occasion",
      type: "hybrid-select",
      options: OCCASION_OPTIONS.filter((opt) =>
        [
          "Sports",
          "Running",
          "Training",
          "Trekking",
          "Casual",
          "Formal",
          "Outdoor",
        ].includes(opt),
      ),
    },
    ...FINANCE_FIELDS,
    {
      name: "features",
      label: "Description",
      type: "textarea",
      placeholder: "Comfort, cushioning, and grip technology details...",
    },
  ],

  // ================= 👜 FASHION: ACCESSORIES =================
  fashion_accessories: [
    { name: "brandId", label: "Brand", type: "brand-select" },
    {
      name: "name",
      label: "Product Name",
      type: "text",
      placeholder: "e.g. Aviator Sunglasses",
    },
    {
      name: "styleCode",
      label: "Style Code",
      type: "text",
      placeholder: "e.g. ACC-SUN-01",
    },
    {
      name: "material",
      label: "Material",
      type: "text",
      placeholder: "e.g. Stainless Steel / Acetate / Leather",
    },
    {
      name: "occasion",
      label: "Occasion",
      type: "hybrid-select",
      options: OCCASION_OPTIONS.filter((opt) =>
        [
          "Daily Wear",
          "Travel",
          "Party",
          "Beachwear",
          "Special Occasion",
          "Formal",
        ].includes(opt),
      ),
    },
    ...FINANCE_FIELDS,
    {
      name: "features",
      label: "Description",
      type: "textarea",
      placeholder: "Dimensions, weight, and lens/hardware specifications...",
    },
  ],
};

/**
 * 💡 Helper to get the correct schema based on department and fashion type.
 */
export const getSchemaByContext = (
  categoryId: string,
  fashionType?: string,
): FieldConfig[] => {
  if (categoryId === "electronics") {
    return PRODUCT_INFO_SCHEMA.electronics;
  }

  if (categoryId === "fashion") {
    // Standardize key to lowercase to match schema keys
    const type = (fashionType || "apparel").toLowerCase();
    const typeKey = `fashion_${type}`;

    return PRODUCT_INFO_SCHEMA[typeKey] || PRODUCT_INFO_SCHEMA.fashion_apparel;
  }

  // Default fallback
  return PRODUCT_INFO_SCHEMA.electronics;
};
