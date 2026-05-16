import { useState, useRef, useMemo, useEffect } from "react";
import { Trash2, Fingerprint, Box } from "lucide-react";
import { getColorNameByHex, getColorMapByDepartment } from "@/common/colors";
import { useClickOutside } from "@/hooks/use-click-outside";
import { getVariantConfig } from "@/common/configs/variant-mapping"; 
import { HybridDropdown } from "@/components/ui/HybridDropdown";
import { generateSKU } from "@/lib/sku";
import { VariantFinance } from "./VariantFinance";
import { VariantMedia } from "./VariantMedia";
import type { Variant, CategoryType } from "@/types/inventory";

interface VariantCardProps {
  variant: Variant;
  index: number;
  category: CategoryType;
  categoryId?: string;       // 🏷️ "electronics" | "fashion"
  fashionType?: string;      // 👗 apparel, footwear, etc.
  selectedSizes?: string[];  // 📏 From Step 1 Size System
  brandName: string;
  modelNumber: string;
  productName: string;
  gender?: string;
  onUpdate: (index: number, data: Partial<Variant>) => void; // Updated to include index
  onRemove: () => void;
  purchaseGst: number;
  salesGst: number;
}

export const VariantCard = ({
  variant,
  index,
  category,
  categoryId,
  fashionType,
  selectedSizes = [],
  brandName,
  modelNumber,
  productName,
  gender,
  onUpdate,
  onRemove,
  purchaseGst,
  salesGst,
}: VariantCardProps) => {
  // 🎨 Department-specific color palette
  const activeColorMap = getColorMapByDepartment(categoryId);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [openAttrIndex, setOpenAttrIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    setIsColorOpen(false);
    setOpenAttrIndex(null);
  });

  /**
   * 🎯 DYNAMIC CONFIGURATION (RAM/Storage vs Size/Fit)
   */
  const config = useMemo(() => {
    return getVariantConfig(category, fashionType);
  }, [category, fashionType]);

  /**
   * ⚡ REAL-TIME SKU GENERATION
   */
  useEffect(() => {
    const newSku = generateSKU(
      brandName,
      modelNumber,
      variant.colorName,
      variant.attributes || []
    );
    if (newSku !== variant.sku) {
      onUpdate(index, { sku: newSku });
    }
  }, [brandName, modelNumber, variant.colorName, variant.attributes, variant.sku, index]);

  /**
   * 🛠️ ATTRIBUTE HANDLERS
   */
  const updateAttribute = (attrIndex: number, value: string) => {
    const newAttributes = [...(variant.attributes || [])];
    const defaultKey = config.attributes[attrIndex]?.key || "Attribute";
    
    newAttributes[attrIndex] = {
      key: variant.attributes?.[attrIndex]?.key || defaultKey,
      value,
    };
    onUpdate(index, { attributes: newAttributes });
  };

  /**
   * 🖼️ MEDIA HANDLERS
   * Critical for ensuring previews update in the UI
   */
  const handleAddMedia = (newMedia: { id: string; url: string }) => {
    onUpdate(index, {
      media_ids: [...(variant.media_ids || []), newMedia.id],
      images: [...(variant.images || []), newMedia.url],
    });
  };

  const handleRemoveMedia = (removed: { id: string; url: string }) => {
    onUpdate(index, {
      media_ids: (variant.media_ids || []).filter((id) => id !== removed.id),
      images: (variant.images || []).filter((url) => url !== removed.url),
    });
  };

  const labelStyle =
    "text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 block tracking-wider";

  return (
    <div className="bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm animate-in fade-in duration-300">
      {/* Header: Title, SKU & Stock Status */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 shadow-sm transition-transform duration-500 hover:scale-110"
            style={{ backgroundColor: variant.color || "#cbd5e1" }}
          />
          <div className="flex flex-col">
            <span className="text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-tight">
              Variant {index + 1}: {variant.colorName || "Unnamed"} ·{" "}
              {variant.attributes
                ?.map((a) => a.value)
                .filter(Boolean)
                .join(" · ") || "Pending Specs"}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Fingerprint size={10} className="text-indigo-500" />
              <span className="text-[10px] font-mono font-black text-indigo-500 tracking-tighter uppercase">
                SKU: {variant.sku || "GENERATING..."}
              </span>
            </div>
          </div>
          <span
            className={`ml-2 px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 ${
              (variant.stock || 0) < (variant.reorderLevel || 5) 
                ? "bg-rose-500/10 text-rose-500 border-rose-500/20" 
                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            }`}
          >
            <Box size={10} />
            {(variant.stock || 0) < (variant.reorderLevel || 5) ? "LOW STOCK" : "IN STOCK"} ({variant.stock || 0})
          </span>
        </div>
        <button
          onClick={onRemove}
          className="text-rose-500 text-xs font-bold flex items-center gap-1 border border-rose-500/20 px-3 py-1 rounded-lg hover:bg-rose-500/10 transition-all active:scale-95"
        >
          <Trash2 size={14} /> Remove
        </button>
      </div>

      {/* Attributes Selection: Color & Specs */}
      <div className="grid grid-cols-12 gap-4" ref={dropdownRef}>
        <div className="col-span-1">
          <label className={labelStyle}>Hex</label>
          <input
            type="color"
            value={variant.color || "#ffffff"}
            onChange={(e) =>
              onUpdate(index, {
                color: e.target.value,
                colorName: getColorNameByHex(e.target.value),
              })
            }
            className="w-full h-10 rounded-lg cursor-pointer bg-transparent border border-slate-200 dark:border-slate-700 p-1"
          />
        </div>

        <HybridDropdown
          label="Color Finish"
          value={variant.colorName || ""}
          options={Object.values(activeColorMap)}
          isOpen={isColorOpen}
          onToggle={() => setIsColorOpen(!isColorOpen)}
          onChange={(val) => {
            const foundHex = Object.keys(activeColorMap).find(
              (key) => activeColorMap[key] === val,
            );
            onUpdate(index, { 
                color: foundHex || variant.color, 
                colorName: val 
            });
          }}
          className="col-span-3"
          placeholder="Select Color"
        />

        {config.attributes.map((attrConfig, idx) => {
          const options = attrConfig.isDynamic ? selectedSizes : attrConfig.options;
          return (
            <HybridDropdown
              key={idx}
              label={attrConfig.key}
              value={variant.attributes?.[idx]?.value || ""}
              options={options}
              isOpen={openAttrIndex === idx}
              onToggle={() =>
                setOpenAttrIndex(openAttrIndex === idx ? null : idx)
              }
              onChange={(val) => updateAttribute(idx, val)}
              className="col-span-4"
              placeholder={`Select ${attrConfig.key}`}
            />
          );
        })}
      </div>

      {/* 💰 Section: Finance (Pricing, Cost, Profit) */}
      <VariantFinance
        variant={variant}
        purchaseGst={purchaseGst}
        salesGst={salesGst}
        onUpdate={(data) => onUpdate(index, data)}
      />

      {/* 🖼️ Section: Media (Hierarchical Uploads) */}
      <div className="space-y-3">
        <label className={labelStyle}>Media Assets</label>
        <VariantMedia
          mediaIds={variant.media_ids || []}
          images={variant.images || []}
          onAddMedia={handleAddMedia}
          onRemoveMedia={handleRemoveMedia}
          uploadMetadata={{
            department: categoryId || "general",
            type: fashionType || "electronics",
            category: category,
            product_name: productName || "unnamed-product",
            gender: gender || "unisex",
            context: variant.colorName || "default",
          }}
        />
      </div>
    </div>
  );
};