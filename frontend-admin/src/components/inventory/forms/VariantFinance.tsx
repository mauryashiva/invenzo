// src/components/inventory/variant-card/variant-finance.tsx
import { useCalculations } from "@/hooks/inventory/useCalculations";
import type { Variant } from "@/types/inventory";

interface VariantFinanceProps {
  variant: Variant;
  purchaseGst: number;
  salesGst: number;
  onUpdate: (data: Partial<Variant>) => void;
}

export const VariantFinance = ({
  variant,
  purchaseGst,
  salesGst,
  onUpdate,
}: VariantFinanceProps) => {
  const finance = useCalculations(
    variant.baseCost,
    variant.sellingPrice,
    purchaseGst,
    salesGst,
  );

  // Calculate Net Profit (Selling Net - Cost Net)
  const netProfit = variant.sellingPrice - variant.baseCost;

  const labelStyle =
    "text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 block tracking-wider";
  const inputStyle =
    "w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 transition-all font-medium";

  return (
    <div className="space-y-6">
      {/* Row: Business Inputs */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className={labelStyle}>Unit Cost (Excl. Tax)</label>
          <input
            type="number"
            className={`${inputStyle} font-mono`}
            // value={variant.baseCost || ""} allows typing from empty instead of stuck at 0
            value={variant.baseCost === 0 ? "" : variant.baseCost}
            onChange={(e) => onUpdate({ baseCost: Number(e.target.value) })}
            placeholder="0"
          />
        </div>
        <div>
          <label className={labelStyle}>Selling Price (Excl. Tax)</label>
          <input
            type="number"
            className={`${inputStyle} font-mono font-bold text-indigo-500 dark:text-indigo-400`}
            value={variant.sellingPrice === 0 ? "" : variant.sellingPrice}
            onChange={(e) => onUpdate({ sellingPrice: Number(e.target.value) })}
            placeholder="0"
          />
        </div>
        <div>
          <label className={labelStyle}>Current Inventory</label>
          <input
            type="number"
            className={inputStyle}
            value={variant.stock === 0 ? "" : variant.stock}
            onChange={(e) => onUpdate({ stock: Number(e.target.value) })}
            placeholder="0"
          />
        </div>
        <div>
          <label className={labelStyle}>Reorder Threshold</label>
          <input
            type="number"
            className={inputStyle}
            value={variant.reorderLevel === 0 ? "" : variant.reorderLevel}
            onChange={(e) => onUpdate({ reorderLevel: Number(e.target.value) })}
            placeholder="5"
          />
        </div>
      </div>

      {/* Professional Financial Ledger Card */}
      <div className="bg-slate-50 dark:bg-black/60 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-white/5 flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Taxation & Profit Ledger
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase">
                Net Profit:
              </span>
              <span
                className={`text-xs font-mono font-bold ${netProfit >= 0 ? "text-emerald-500" : "text-rose-500"}`}
              >
                ₹{netProfit.toLocaleString()}
              </span>
            </div>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase">
                Margin:
              </span>
              <span
                className={`text-xs font-black px-2 py-0.5 rounded ${finance.marginPercentage > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}
              >
                {finance.marginPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 grid grid-cols-2 gap-10">
          {/* Procurement Section */}
          <div className="space-y-3">
            <h4 className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest border-b border-indigo-500/10 pb-1">
              Procurement (Supply)
            </h4>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Net Purchase Price</span>
              <span className="text-slate-700 dark:text-slate-300 font-mono">
                ₹{variant.baseCost.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Input GST ({purchaseGst}%)</span>
              <span className="text-slate-700 dark:text-slate-300 font-mono">
                ₹{(finance.purchaseTotal - variant.baseCost).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-xs font-bold pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-slate-800 dark:text-slate-200 uppercase text-[10px]">
                Landed Cost
              </span>
              <span className="text-slate-900 dark:text-white font-mono">
                ₹{finance.purchaseTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Revenue Section */}
          <div className="space-y-3">
            <h4 className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest border-b border-emerald-500/10 pb-1">
              Revenue (Market)
            </h4>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Original Selling Price</span>
              <span className="text-slate-700 dark:text-slate-300 font-mono">
                ₹{variant.sellingPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Output GST ({salesGst}%)</span>
              <span className="text-slate-700 dark:text-slate-300 font-mono">
                ₹{finance.sellingTaxAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-slate-800 dark:text-slate-200 font-black uppercase text-[10px]">
                Customer MRP
              </span>
              <span className="text-xl font-black text-slate-950 dark:text-white tracking-tighter font-mono">
                ₹{finance.sellingTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
