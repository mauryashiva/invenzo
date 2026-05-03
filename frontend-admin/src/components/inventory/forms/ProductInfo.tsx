import { useState } from "react";
import { getSchemaByContext } from "@/common/configs/productinfo-config";
import { BrandSelector } from "./BrandSelector";
import { OccasionSelector } from "./OccasionSelector";
import { HybridDropdown } from "@/components/ui/HybridDropdown";
import { formatTitleCase, formatModelCode } from "@/lib/utils";
import { RefreshCw, ChevronRight } from "lucide-react";
import type { InventoryProduct } from "@/types/inventory";

interface ProductInfoProps {
  data: InventoryProduct;
  onUpdate: (data: Partial<InventoryProduct>) => void;
}

export const ProductInfo = ({ data, onUpdate }: ProductInfoProps) => {
  const [openField, setOpenField] = useState<string | null>(null);

  /**
   * 🎯 DYNAMIC SCHEMA RESOLUTION
   */
  const schema = getSchemaByContext(data.categoryId, data.fashionType);

  /**
   * 🛠️ Real-time Normalization
   */
  const handleInputChange = (name: string, value: string) => {
    let formattedValue = value;
    const titleCaseFields = [
      "name",
      "brandId",
      "occasion",
      "fabric",
      "material",
      "upperMaterial",
      "soleMaterial",
      "season",
    ];

    if (titleCaseFields.includes(name)) {
      formattedValue = formatTitleCase(value);
    } else if (["modelNumber", "styleCode"].includes(name)) {
      formattedValue = formatModelCode(value);
    }

    // 🏷️ Handle percentage strings from selects (e.g., "18%" -> 18)
    let finalValue: string | number = formattedValue;
    if (["purchaseGst", "salesGst"].includes(name) && typeof formattedValue === "string") {
      finalValue = Number(formattedValue.replace("%", "")) || 0;
    }

    onUpdate({ [name]: finalValue } as Partial<InventoryProduct>);
  };

  /**
   * 🏷️ DYNAMIC BREADCRUMB BADGES
   * Renders the current classification hierarchy
   */
  const renderBreadcrumbs = () => {
    const badgeBase =
      "px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border transition-all duration-500 animate-in slide-in-from-left-2";

    if (data.categoryId === "electronics") {
      return (
        <div className="flex items-center gap-1.5 ml-4">
          <span
            className={`${badgeBase} bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700`}
          >
            ELECTRONICS
          </span>
          <ChevronRight
            size={10}
            className="text-slate-300 dark:text-slate-700"
          />
          <span
            className={`${badgeBase} bg-indigo-500/10 text-indigo-500 border-indigo-500/20`}
          >
            {data.category || "---"}
          </span>
        </div>
      );
    }

    if (data.categoryId === "fashion") {
      return (
        <div className="flex items-center gap-1.5 ml-4">
          <span
            className={`${badgeBase} bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700`}
          >
            FASHION
          </span>
          <ChevronRight
            size={10}
            className="text-slate-300 dark:text-slate-700"
          />
          <span
            className={`${badgeBase} bg-amber-500/10 text-amber-600 border-amber-500/20`}
          >
            {data.fashionType || "---"}
          </span>
          <ChevronRight
            size={10}
            className="text-slate-300 dark:text-slate-700"
          />
          <span
            className={`${badgeBase} bg-indigo-500/10 text-indigo-500 border-indigo-500/20`}
          >
            {data.gender || "---"}
          </span>
        </div>
      );
    }
    return null;
  };

  const labelStyle =
    "text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase ml-1 mb-2 block tracking-[0.1em]";
  const inputStyle =
    "w-full p-3 bg-slate-100/50 dark:bg-slate-900/50 border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-500/50 rounded-2xl text-sm text-slate-900 dark:text-slate-100 outline-none transition-all font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600";

  return (
    <section className="p-8 bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] space-y-8 shadow-sm animate-in fade-in duration-500">
      {/* --- Section Header with Breadcrumbs --- */}
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-center">
          <div className="space-y-1">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Step 2: Product Identity
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Core attributes mapping
            </p>
          </div>
          {renderBreadcrumbs()}
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/5 px-4 py-2 rounded-xl border border-indigo-500/10 text-[10px] font-black text-indigo-600 dark:text-indigo-400">
          <RefreshCw size={12} className="animate-spin-slow" />
          AUTO-SYNC ENABLED
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
        {schema.map((field) => (
          <div
            key={field.name}
            className={field.type === "textarea" ? "md:col-span-3" : ""}
          >
            <div className="flex justify-between items-center mb-1">
              <label className={labelStyle}>{field.label}</label>
              {field.name === "brandId" && (
                <span className="text-[8px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-tighter">
                  Smart Filter Active
                </span>
              )}
            </div>

            {field.type === "brand-select" ? (
              <BrandSelector
                value={data.brandId}
                onChange={(val) => handleInputChange("brandId", val)}
                categoryId={data.categoryId}
                category={data.category}
                gender={data.gender}
                fashionType={data.fashionType}
              />
            ) : field.name === "occasion" ? (
              <OccasionSelector
                value={(data as any).occasion || ""}
                options={field.options || []}
                onChange={(val) => handleInputChange("occasion", val)}
              />
            ) : field.type === "hybrid-select" ? (
              <HybridDropdown
                value={(data as any)[field.name] || ""}
                options={field.options || []}
                onChange={(val) => handleInputChange(field.name, val)}
                placeholder={field.placeholder || `Select ${field.label}`}
                isOpen={openField === field.name}
                onToggle={() =>
                  setOpenField(openField === field.name ? null : field.name)
                }
                label={""}
              />
            ) : field.type === "textarea" ? (
              <textarea
                className={`${inputStyle} min-h-30 font-medium text-xs leading-relaxed resize-none`}
                placeholder={field.placeholder}
                value={(data as any)[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
              />
            ) : field.type === "select" ? (
              <div className="relative">
                <select
                  className={`${inputStyle} cursor-pointer appearance-none pr-10`}
                  value={
                    ["purchaseGst", "salesGst"].includes(field.name)
                      ? `${(data as any)[field.name]}%`
                      : (data as any)[field.name] || ""
                  }
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                >
                  <option value="" disabled>
                    Select {field.label}
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt} className="dark:bg-slate-900">
                      {opt}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                  <ChevronRight
                    size={14}
                    className="rotate-90 text-slate-400"
                  />
                </div>
              </div>
            ) : (
              <input
                type={field.type}
                className={`${inputStyle} ${field.readOnly ? "bg-slate-200/50 dark:bg-slate-800/30 text-slate-400 cursor-not-allowed border-dashed border-slate-300 dark:border-slate-700" : ""}`}
                placeholder={field.placeholder}
                value={(data as any)[field.name] || ""}
                onChange={(e) => !field.readOnly && handleInputChange(field.name, e.target.value)}
                readOnly={field.readOnly}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
