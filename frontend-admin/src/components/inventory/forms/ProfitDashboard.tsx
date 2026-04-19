import { useCalculations } from "@/hooks/inventory/useCalculations";
import type { FinanceResult } from "@/types/finance"; // Updated to use the new isolated types file

interface ProfitDashboardProps {
  purchasePrice: number;
  sellingPrice: number;
  purchaseGst: number;
  salesGst: number;
}

export const ProfitDashboard = ({
  purchasePrice,
  sellingPrice,
  purchaseGst,
  salesGst,
}: ProfitDashboardProps) => {
  // Use the centralized calculation hook with isolated finance types
  const results: FinanceResult = useCalculations(
    purchasePrice,
    sellingPrice,
    purchaseGst,
    salesGst,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* 🟢 PURCHASE SIDE: Landed Cost (Retailer Outflow) */}
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
          Total Landed Cost
        </p>
        <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
          ₹{results.purchaseTotal.toLocaleString()}
        </p>
        <p className="text-[9px] text-slate-400 font-medium italic">
          (Base + ₹{results.purchaseTaxAmount.toLocaleString()} Purchase GST)
        </p>
      </div>

      {/* 🔵 PROFIT MARGIN: Efficiency Check */}
      <div className="space-y-1 border-y md:border-y-0 md:border-x border-slate-200 dark:border-slate-800 px-0 md:px-4 py-3 md:py-0">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
          Net Margin (%)
        </p>
        <p
          className={`text-lg font-bold transition-colors duration-300 ${
            results.marginPercentage >= 20
              ? "text-emerald-500"
              : "text-amber-500"
          }`}
        >
          {results.marginPercentage.toFixed(1)}%
        </p>
        <p className="text-[9px] text-slate-400 font-medium">
          Profit: ₹{results.netMargin.toLocaleString()} per unit
        </p>
      </div>

      {/* 🔴 TAX SIDE: Government Liability */}
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
          GST Payable to Gov
        </p>
        <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
          ₹{results.taxLiability.toLocaleString()}
        </p>
        <p className="text-[9px] text-slate-400 font-medium">
          Net Tax (Output - Input Credit)
        </p>
      </div>
    </div>
  );
};
