import { useMemo } from "react";
import { getSpecsByCategory } from "@/common/fashion/size-specs";

interface SizeGuideTableProps {
  category: string;
  selectedSizes: string[];
  measurements: Record<string, any>;
  onUpdate: (size: string, key: string, value: string) => void;
}

export const SizeGuideTable = ({
  category,
  selectedSizes,
  measurements,
  onUpdate,
}: SizeGuideTableProps) => {
  // 🎯 Auto-fetch columns based on sub-category (Apparel, Footwear, etc.)
  // This pulls dynamic specs like "Inseam" for Jeans or "UK Size" for Sneakers.
  const specs = useMemo(() => getSpecsByCategory(category), [category]);

  // Guard: Do not render if no sizes are selected or if the category has no measurable specs (e.g. Accessories)
  if (selectedSizes.length === 0 || specs.length === 0) return null;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-[#0f1115] shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          {/* min-w ensures the table doesn't get squashed on smaller containers */}
          <table className="w-full text-left border-collapse min-w-150">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest w-32">
                  Size Label
                </th>
                {specs.map((spec) => (
                  <th key={spec.key} className="py-5 px-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        {spec.label}
                      </span>
                      <span className="text-[9px] font-bold text-indigo-500 uppercase mt-0.5 opacity-80">
                        Unit: {spec.unit}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {selectedSizes.map((size) => (
                <tr
                  key={size}
                  className="group hover:bg-slate-50/50 dark:hover:bg-indigo-500/5 transition-colors"
                >
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center justify-center min-w-10 h-10 px-2 rounded-xl bg-white dark:bg-indigo-500/10 text-slate-900 dark:text-indigo-400 font-black text-sm border border-slate-200 dark:border-indigo-500/20 shadow-sm transition-transform group-hover:scale-105">
                      {size}
                    </span>
                  </td>
                  {specs.map((spec) => (
                    <td key={spec.key} className="py-3 px-3">
                      <div className="relative group/input">
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="--"
                          value={measurements[size]?.[spec.key] || ""}
                          onChange={(e) =>
                            onUpdate(size, spec.key, e.target.value)
                          }
                          className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/5 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none transition-all font-mono text-center group-hover/input:border-slate-300 dark:group-hover/input:border-slate-700"
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-2 px-2">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          Measurements sync with product-page size chart
        </p>
      </div>
    </div>
  );
};
