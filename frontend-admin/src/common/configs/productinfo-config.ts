export interface FieldConfig {
  name: string;
  label: string;
  // 🆕 Added 'hybrid-select' for fields like Occasion where users can add custom values
  type:
    | "text"
    | "select"
    | "hybrid-select"
    | "textarea"
    | "number"
    | "brand-select";
  placeholder?: string;
  options?: string[];
}

export const PRODUCT_INFO_SCHEMA: Record<string, FieldConfig[]> = {
  electronics: [
    {
      name: "brandId",
      label: "Brand",
      type: "brand-select",
    },
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
    {
      name: "features",
      label: "Key Features (One per line)",
      type: "textarea",
      placeholder: "200MP Camera\n6000mAh battery\nSnapdragon 8 Elite",
    },
  ],
  fashion: [
    {
      name: "brandId",
      label: "Brand",
      type: "brand-select",
    },
    {
      name: "name",
      label: "Product Name",
      type: "text",
      placeholder: "e.g. Floral Wrap Midi Dress",
    },
    {
      name: "styleCode",
      label: "SKU / Style Code",
      type: "text",
      placeholder: "e.g. WD-FL-001",
    },
    {
      name: "occasion",
      label: "Occasion",
      type: "hybrid-select", // 🔄 Changed to hybrid-select for custom additions
      options: ["Casual", "Formal", "Party", "Ethnic", "Sportswear", "Wedding"],
    },
    {
      name: "season",
      label: "Season",
      type: "select",
      options: ["Summer", "Winter", "Spring/Autumn", "All Season"],
    },
    {
      name: "fabric",
      label: "Fabric / Material",
      type: "text",
      placeholder: "e.g. 100% Cotton, Polyester blend",
    },
    {
      name: "features",
      label: "Product Description",
      type: "textarea",
      placeholder: "Short description shown on product page...",
    },
  ],
};
