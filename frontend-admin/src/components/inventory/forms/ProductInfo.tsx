import { useState } from "react";
import { PRODUCT_INFO_SCHEMA } from "@/common/configs/productinfo-config";
import { BrandSelector } from "./BrandSelector";
import { OccasionSelector } from "./OccasionSelector";
import { HybridDropdown } from "@/components/ui/HybridDropdown";
import { formatTitleCase, formatModelCode } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import type { InventoryProduct } from "@/types/inventory";

interface ProductInfoProps {
  data: InventoryProduct;
  onUpdate: (data: Partial<InventoryProduct>) => void;
}

export const ProductInfo = ({ data, onUpdate }: ProductInfoProps) => {
  const [openField, setOpenField] = useState<string | null>(null);

  const schema =
    PRODUCT_INFO_SCHEMA[data.categoryId] || PRODUCT_INFO_SCHEMA.electronics;

  /**
   * 🛠️ Real-time Normalization
   */
  const handleInputChange = (name: string, value: string) => {
    let formattedValue = value;

    if (["name", "brandId", "occasion", "fabric"].includes(name)) {
      formattedValue = formatTitleCase(value);
    } else if (["modelNumber", "styleCode"].includes(name)) {
      formattedValue = formatModelCode(value);
    }

    onUpdate({ [name]: formattedValue });
  };

  const labelStyle =
    "text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1.5 block tracking-wider";

  // 🎨 ENHANCED: Explicit colors for dark mode select visibility
  const inputStyle =
    "w-full p-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500";

  return (
    <section className="p-6 bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-6 shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Product Specifications
        </h2>
        <button className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <RefreshCw size={12} /> GST SYNC ON
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {schema.map((field) => (
          <div
            key={field.name}
            className={field.type === "textarea" ? "md:col-span-3" : ""}
          >
            <label className={labelStyle}>{field.label}</label>

            {field.type === "brand-select" ? (
              <BrandSelector
                value={data.brandId}
                onChange={(val) => handleInputChange("brandId", val)}
                department={data.categoryId}
              />
            ) : field.name === "occasion" ? (
              <OccasionSelector
                value={(data as any).occasion || ""}
                onChange={(val) => handleInputChange("occasion", val)}
              />
            ) : field.type === "hybrid-select" ? (
              <HybridDropdown
                value={(data as any)[field.name] || ""}
                options={field.options || []}
                onChange={(val) => handleInputChange(field.name, val)}
                placeholder={`Select or type ${field.label}`}
                isOpen={openField === field.name}
                onToggle={() =>
                  setOpenField(openField === field.name ? null : field.name)
                }
                label={""}
              />
            ) : field.type === "textarea" ? (
              <textarea
                className={`${inputStyle} min-h-30 font-mono text-xs leading-relaxed`}
                placeholder={field.placeholder}
                value={(data as any)[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
              />
            ) : field.type === "select" ? (
              /* 🛠️ FIXED: Added dark:bg-slate-900 to the select itself to fix visibility */
              <select
                className={`${inputStyle} cursor-pointer dark:bg-slate-900`}
                value={(data as any)[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
              >
                <option
                  value=""
                  disabled
                  className="text-slate-400 dark:text-slate-500"
                >
                  Select {field.label}
                </option>
                {field.options?.map((opt) => (
                  <option
                    key={opt}
                    value={opt}
                    /* Forced background and text for dark mode options list */
                    className="bg-white dark:bg-[#1a1c23] text-slate-900 dark:text-slate-200"
                  >
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                className={inputStyle}
                placeholder={field.placeholder}
                value={(data as any)[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
