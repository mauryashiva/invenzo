// src/components/inventory/forms/VariantCard.tsx
import { useState, useRef, useMemo } from "react";
import { Trash2, Plus } from "lucide-react";
import { COLOR_MAP, getColorNameByHex } from "@/common/colors";
import { useCalculations } from "@/hooks/inventory/useCalculations";
import { useClickOutside } from "@/hooks/use-click-outside";
import { CATEGORY_VARIANT_CONFIG } from "@/common/configs/variant-mapping";
import { HybridDropdown } from "@/components/ui/HybridDropdown";
import type { Variant, CategoryType } from "@/types/inventory";

interface VariantCardProps {
  variant: Variant;
  index: number;
  category: CategoryType;
  onUpdate: (data: Partial<Variant>) => void;
  onRemove: () => void;
  purchaseGst: number;
  salesGst: number;
}

export const VariantCard = ({
  variant,
  index,
  category,
  onUpdate,
  onRemove,
  purchaseGst,
  salesGst,
}: VariantCardProps) => {
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [openAttrIndex, setOpenAttrIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const finance = useCalculations(
    variant.baseCost,
    variant.sellingPrice,
    purchaseGst,
    salesGst,
  );

  useClickOutside(dropdownRef, () => {
    setIsColorOpen(false);
    setOpenAttrIndex(null);
  });

  const config = useMemo(() => {
    const activeCat = (category?.toLowerCase() ||
      "smartphone") as keyof typeof CATEGORY_VARIANT_CONFIG;
    return (
      CATEGORY_VARIANT_CONFIG[activeCat] || CATEGORY_VARIANT_CONFIG.smartphone
    );
  }, [category]);

  const updateAttribute = (attrIndex: number, value: string) => {
    const newAttributes = [...(variant.attributes || [])];
    const defaultKey = config.attributes[attrIndex]?.key || "Attribute";

    newAttributes[attrIndex] = {
      key: variant.attributes?.[attrIndex]?.key || defaultKey,
      value,
    };
    onUpdate({ attributes: newAttributes });
  };

  const labelStyle =
    "text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 block tracking-wider";
  const inputStyle =
    "w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 transition-all font-medium";

  return (
    <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm animate-in fade-in duration-300">
      {/* Header: Identity & Status */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 shadow-sm"
            style={{ backgroundColor: variant.color }}
          />
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1 rounded text-xs font-bold uppercase tracking-tight">
            Variant {index + 1}: {variant.colorName || "Unnamed"} ·{" "}
            {variant.attributes
              ?.map((a) => a.value)
              .filter(Boolean)
              .join(" · ") || "No Specs"}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-black border ${variant.stock < (variant.reorderLevel || 5) ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"}`}
          >
            {variant.stock < (variant.reorderLevel || 5)
              ? "LOW STOCK"
              : "IN STOCK"}{" "}
            ({variant.stock})
          </span>
        </div>
        <button
          onClick={onRemove}
          className="text-rose-500 text-xs font-bold flex items-center gap-1 border border-rose-500/20 px-3 py-1 rounded-lg hover:bg-rose-500/10 transition-all"
        >
          <Trash2 size={14} /> Remove
        </button>
      </div>

      <div className="grid grid-cols-12 gap-4" ref={dropdownRef}>
        {/* Color Column */}
        <div className="col-span-1">
          <label className={labelStyle}>Hex</label>
          <input
            type="color"
            value={variant.color}
            onChange={(e) =>
              onUpdate({
                color: e.target.value,
                colorName: getColorNameByHex(e.target.value),
              })
            }
            className="w-full h-10 rounded-lg cursor-pointer bg-transparent border border-slate-200 dark:border-slate-700 p-1"
          />
        </div>

        {/* Color Dropdown using HybridDropdown */}
        <HybridDropdown
          label="Color Finish"
          value={variant.colorName || ""}
          options={Object.values(COLOR_MAP)}
          isOpen={isColorOpen}
          onToggle={() => setIsColorOpen(!isColorOpen)}
          onChange={(val) => {
            onUpdate({ colorName: val });
            // Sync hex if a known color name is selected
            const foundHex = Object.keys(COLOR_MAP).find(
              (key) => COLOR_MAP[key] === val,
            );
            if (foundHex) onUpdate({ color: foundHex, colorName: val });
          }}
          className="col-span-3"
          placeholder="Select Color"
        />

        {/* Dynamic Attributes using HybridDropdown */}
        {config.attributes.map((attrConfig, idx) => (
          <HybridDropdown
            key={idx}
            label={attrConfig.key}
            value={variant.attributes?.[idx]?.value || ""}
            options={attrConfig.options}
            isOpen={openAttrIndex === idx}
            onToggle={() =>
              setOpenAttrIndex(openAttrIndex === idx ? null : idx)
            }
            onChange={(val) => updateAttribute(idx, val)}
            className={
              attrConfig.key.toLowerCase().includes("processor")
                ? "col-span-5"
                : "col-span-3"
            }
            placeholder={`Select ${attrConfig.key}`}
          />
        ))}
      </div>

      {/* Row 2: Pricing & Stock */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className={labelStyle}>Cost (Excl GST) ₹</label>
          <input
            type="number"
            className={`${inputStyle} font-mono`}
            value={variant.baseCost}
            onChange={(e) => onUpdate({ baseCost: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className={labelStyle}>Sale (Excl GST) ₹</label>
          <input
            type="number"
            className={`${inputStyle} font-mono font-bold text-indigo-500 dark:text-indigo-400`}
            value={variant.sellingPrice}
            onChange={(e) => onUpdate({ sellingPrice: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className={labelStyle}>Current Stock</label>
          <input
            type="number"
            className={inputStyle}
            value={variant.stock}
            onChange={(e) => onUpdate({ stock: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className={labelStyle}>Reorder Level</label>
          <input
            type="number"
            className={inputStyle}
            value={variant.reorderLevel || 5}
            onChange={(e) => onUpdate({ reorderLevel: Number(e.target.value) })}
          />
        </div>
      </div>

      {/* Financial Breakdown Table */}
      <div className="bg-slate-50 dark:bg-black/40 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
          GST PRICE BREAKDOWN ({salesGst}%)
        </h3>
        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>Purchase Price (Cost + GST)</span>
          <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">
            ₹{finance.purchaseTotal.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>Selling Price Excl GST</span>
          <span className="font-mono text-slate-800 dark:text-slate-200">
            ₹{variant.sellingPrice.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 pb-2">
          <span>GST on Selling Price</span>
          <span className="font-mono text-slate-800 dark:text-slate-200">
            ₹{finance.sellingTaxAmount.toLocaleString()}
          </span>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center font-bold">
          <span className="text-slate-800 dark:text-slate-300 italic text-sm">
            Customer Pays (Incl GST)
          </span>
          <span className="text-slate-950 dark:text-white text-xl font-black tracking-tighter">
            ₹{finance.sellingTotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-slate-500 dark:text-slate-500 uppercase font-bold text-[9px] tracking-widest">
            MARGIN ON COST
          </span>
          <span
            className={`text-xs font-black ${finance.marginPercentage > 0 ? "text-emerald-500" : "text-rose-500"}`}
          >
            {finance.marginPercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Media Uploaders */}
      <div className="flex gap-4">
        <button
          type="button"
          className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-all bg-white dark:bg-transparent"
        >
          <Plus size={20} />
          <span className="text-[9px] font-bold mt-1 uppercase">Image</span>
        </button>
        <button
          type="button"
          className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-all bg-white dark:bg-transparent"
        >
          <Plus size={20} />
          <span className="text-[9px] font-bold mt-1 uppercase">Video</span>
        </button>
      </div>
    </div>
  );
};
