import { BrandSelector } from "./BrandSelector";
import { Plus, RefreshCcw } from "lucide-react";
import { formatTitleCase, formatModelCode } from "@/lib/utils";
import type { InventoryProduct } from "@/types/inventory";
import { useState } from "react";

interface ProductInfoProps {
  data: InventoryProduct;
  onUpdate: (data: Partial<InventoryProduct>) => void;
}

export const ProductInfo = ({ data, onUpdate }: ProductInfoProps) => {
  // We keep syncGst as local UI state since it's a toggle helper
  const [syncGst, setSyncGst] = useState(true);

  // Shared class for all selects to fix visibility and keep UI consistent
  const selectClasses = `
    w-full p-2.5 border rounded-xl bg-transparent 
    text-slate-800 dark:text-slate-200 
    border-slate-200 dark:border-slate-800 
    outline-none focus:border-indigo-500 transition-all
    appearance-none cursor-pointer text-sm
  `;

  // Shared class for options to fix Dark Mode visibility
  const optionClasses =
    "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200";

  const handlePurchaseGstChange = (val: string) => {
    const rate = parseInt(val);
    if (syncGst) {
      onUpdate({ purchaseGst: rate, salesGst: rate });
    } else {
      onUpdate({ purchaseGst: rate });
    }
  };

  return (
    <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Product Specifications
        </h2>
        <button
          type="button"
          onClick={() => setSyncGst(!syncGst)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
            syncGst
              ? "bg-indigo-100 text-indigo-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          <RefreshCcw
            size={10}
            className={syncGst ? "animate-spin-slow" : ""}
          />
          {syncGst ? "GST SYNC ON" : "MANUAL GST"}
        </button>
      </div>

      {/* Brand, Name, Model Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BrandSelector />

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
            Product Name
          </label>
          <input
            value={data.name}
            onChange={(e) =>
              onUpdate({ name: formatTitleCase(e.target.value) })
            }
            className="w-full p-2.5 border rounded-xl bg-transparent text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition-all text-sm"
            placeholder="e.g. Samsung Galaxy S25 Ultra"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
            Model Number
          </label>
          <input
            value={data.modelNumber}
            onChange={(e) =>
              onUpdate({ modelNumber: formatModelCode(e.target.value) })
            }
            className="w-full p-2.5 border rounded-xl bg-transparent text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition-all text-sm"
            placeholder="e.g. SM-S938B"
          />
        </div>
      </div>

      {/* Warranty and Dual GST Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
            Warranty (Months)
          </label>
          <select
            className={selectClasses}
            value={data.warranty}
            onChange={(e) => onUpdate({ warranty: parseInt(e.target.value) })}
          >
            <option className={optionClasses} value={12}>
              12 Months
            </option>
            <option className={optionClasses} value={24}>
              24 Months
            </option>
            <option className={optionClasses} value={36}>
              36 Months
            </option>
          </select>
        </div>

        {/* Purchase GST - For Retailer Buying */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
            Purchase GST (Retailer Buy)
          </label>
          <div className="flex gap-2">
            <select
              className={selectClasses}
              value={data.purchaseGst}
              onChange={(e) => handlePurchaseGstChange(e.target.value)}
            >
              <option className={optionClasses} value={18}>
                18% (Electronics)
              </option>
              <option className={optionClasses} value={12}>
                12% (Accessories)
              </option>
              <option className={optionClasses} value={5}>
                5% (Fashion)
              </option>
            </select>
            <button
              type="button"
              className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors shrink-0"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Sales GST - For Customer Selling */}
        <div
          className={`space-y-1 transition-opacity duration-300 ${syncGst ? "opacity-50 pointer-events-none" : "opacity-100"}`}
        >
          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
            Sales GST (Customer Pay)
          </label>
          <select
            className={selectClasses}
            disabled={syncGst}
            value={syncGst ? data.purchaseGst : data.salesGst}
            onChange={(e) => onUpdate({ salesGst: parseInt(e.target.value) })}
          >
            <option className={optionClasses} value={18}>
              18% (Electronics)
            </option>
            <option className={optionClasses} value={12}>
              12% (Accessories)
            </option>
            <option className={optionClasses} value={5}>
              5% (Fashion)
            </option>
          </select>
        </div>
      </div>

      {/* Features Textarea */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
          Key Features (one per line)
        </label>
        <textarea
          rows={4}
          value={data.features.join("\n")}
          onChange={(e) => onUpdate({ features: e.target.value.split("\n") })}
          className="w-full p-3 border rounded-xl bg-transparent text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 font-mono text-sm leading-relaxed"
          placeholder={"200MP Camera\n6000mAh battery\nSnapdragon 8 Elite"}
        />
      </div>
    </section>
  );
};
