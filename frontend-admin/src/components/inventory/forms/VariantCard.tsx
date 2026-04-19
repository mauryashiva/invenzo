// src/components/inventory/forms/VariantCard.tsx
import { useState, useRef, useMemo } from "react";
import {
  Trash2,
  ChevronDown,
  Check,
  Search,
  Plus,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import {
  COLOR_MAP,
  getColorHexByName,
  getColorNameByHex,
} from "@/common/colors";
import { useCalculations } from "@/hooks/inventory/useCalculations";
import { useClickOutside } from "@/hooks/use-click-outside";
import type { Variant } from "@/types/inventory";

interface VariantCardProps {
  variant: Variant;
  index: number;
  onUpdate: (data: Partial<Variant>) => void;
  onRemove: () => void;
  purchaseGst: number;
  salesGst: number;
}

export const VariantCard = ({
  variant,
  index,
  onUpdate,
  onRemove,
  purchaseGst,
  salesGst,
}: VariantCardProps) => {
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [colorSearch, setColorSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const finance = useCalculations(
    variant.baseCost,
    variant.sellingPrice,
    purchaseGst,
    salesGst,
  );

  useClickOutside(dropdownRef, () => setIsColorOpen(false));

  // --- LOGIC ---
  const handleColorPicker = (hex: string) => {
    const name = getColorNameByHex(hex);
    onUpdate({ color: hex, colorName: name });
  };

  const filteredColors = useMemo(() => {
    return Object.entries(COLOR_MAP).filter(([_, name]) =>
      name.toLowerCase().includes(colorSearch.toLowerCase()),
    );
  }, [colorSearch]);

  const labelStyle =
    "text-[10px] font-bold text-slate-500 uppercase mb-1 block";
  const inputStyle =
    "w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 transition-all";

  return (
    <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
      {/* Header: Title & Remove */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 shadow-sm"
            style={{ backgroundColor: variant.color }}
          />
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded text-xs font-medium">
            Variant {index + 1}: {variant.colorName || "(unnamed)"} ·{" "}
            {variant.ram} · {variant.storage}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              variant.stock < (variant.reorderLevel || 5)
                ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            }`}
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

      {/* Row 1: Color, RAM, Storage */}
      <div className="grid grid-cols-12 gap-4" ref={dropdownRef}>
        <div className="col-span-1">
          <label className={labelStyle}>Color</label>
          <input
            type="color"
            value={variant.color}
            onChange={(e) => handleColorPicker(e.target.value)}
            className="w-full h-10 rounded-lg cursor-pointer bg-transparent border border-slate-200 dark:border-slate-700 p-1"
          />
        </div>

        {/* CUSTOM SEARCHABLE COLOR SELECTOR */}
        <div className="col-span-5 relative">
          <label className={labelStyle}>Color Name</label>
          <div
            onClick={() => setIsColorOpen(true)}
            className={`${inputStyle} flex justify-between items-center cursor-pointer`}
          >
            <span
              className={
                variant.colorName
                  ? "text-slate-800 dark:text-slate-200"
                  : "text-slate-400"
              }
            >
              {variant.colorName || "Select or Type Color"}
            </span>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform ${isColorOpen ? "rotate-180" : ""}`}
            />
          </div>

          {isColorOpen && (
            <div className="absolute top-full left-0 w-full mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl p-2 animate-in zoom-in-95 duration-150">
              <div className="relative mb-2">
                <Search
                  size={14}
                  className="absolute left-3 top-2.5 text-slate-400"
                />
                <input
                  autoFocus
                  placeholder="Search colors..."
                  value={colorSearch}
                  onChange={(e) => setColorSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                  // Allow user to type custom names
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onUpdate({ colorName: colorSearch });
                      setIsColorOpen(false);
                    }
                  }}
                />
              </div>
              <div className="max-h-52 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                {filteredColors.map(([hex, name]) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => {
                      onUpdate({ colorName: name, color: hex });
                      setIsColorOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-[13px] rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full border border-slate-200"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="text-slate-600 dark:text-slate-400 group-hover:text-indigo-600">
                        {name}
                      </span>
                    </div>
                    {variant.colorName === name && (
                      <Check size={14} className="text-indigo-500" />
                    )}
                  </button>
                ))}
                {filteredColors.length === 0 && (
                  <p className="text-[10px] text-center py-4 text-slate-500">
                    Press Enter to use "{colorSearch}"
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-3">
          <label className={labelStyle}>RAM</label>
          <select
            className={inputStyle}
            value={variant.ram}
            onChange={(e) => onUpdate({ ram: e.target.value })}
          >
            {["4GB", "6GB", "8GB", "12GB", "16GB", "24GB"].map((opt) => (
              <option key={opt} value={opt} className="dark:bg-slate-900">
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-3">
          <label className={labelStyle}>Storage</label>
          <select
            className={inputStyle}
            value={variant.storage}
            onChange={(e) => onUpdate({ storage: e.target.value })}
          >
            {["128GB", "256GB", "512GB", "1TB"].map((opt) => (
              <option key={opt} value={opt} className="dark:bg-slate-900">
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Pricing */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className={labelStyle}>Cost (Excl GST) ₹</label>
          <input
            type="number"
            className={inputStyle}
            value={variant.baseCost}
            onChange={(e) => onUpdate({ baseCost: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className={labelStyle}>Sale (Excl GST) ₹</label>
          <input
            type="number"
            className={inputStyle}
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

      {/* FINANCIAL BREAKDOWN TABLE */}
      <div className="bg-slate-50 dark:bg-black/40 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-2">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-2">
          GST PRICE BREAKDOWN ({salesGst}%)
        </h3>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Purchase Price (Cost + GST)</span>
          <span className="font-mono text-slate-700 dark:text-slate-200 font-bold">
            ₹{finance.purchaseTotal.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Selling Price Excl GST</span>
          <span className="font-mono text-slate-700 dark:text-slate-200">
            ₹{variant.sellingPrice.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>GST on Selling Price</span>
          <span className="font-mono text-slate-700 dark:text-slate-200">
            ₹{finance.sellingTaxAmount.toLocaleString()}
          </span>
        </div>

        <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-sm font-bold">
          <span className="text-slate-800 dark:text-slate-100 italic">
            Customer Pays (Incl GST)
          </span>
          <span className="text-slate-900 dark:text-white text-lg">
            ₹{finance.sellingTotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-[10px] font-bold pt-1">
          <span className="text-slate-500 uppercase tracking-tighter">
            MARGIN ON COST
          </span>
          <span
            className={
              finance.marginPercentage > 0
                ? "text-emerald-500"
                : "text-rose-500"
            }
          >
            {finance.marginPercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Media Uploaders */}
      <div className="space-y-3">
        <p className="text-[10px] font-medium text-slate-500">
          Product images & videos (first image = primary)
        </p>
        <div className="flex gap-4">
          <button className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all">
            <Plus size={20} />
            <span className="text-[10px] font-bold mt-1">+ img</span>
          </button>
          <button className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all">
            <Plus size={20} />
            <span className="text-[10px] font-bold mt-1">+ video</span>
          </button>
        </div>
      </div>
    </div>
  );
};
