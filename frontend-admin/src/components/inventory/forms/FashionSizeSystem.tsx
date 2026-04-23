import { useState, useMemo } from "react";
import { Ruler, Plus, Info, Check } from "lucide-react";
import {
  SIZE_SCALES,
  getMeasurementColumns,
} from "@/common/configs/size-config";
import type { SizeScaleType } from "@/common/configs/size-config";

interface FashionSizeSystemProps {
  subCategory: string;
  onUpdateSizes: (sizes: string[]) => void;
  onUpdateMeasurements: (data: any) => void;
}

export const FashionSizeSystem = ({
  subCategory,
  onUpdateSizes,
  onUpdateMeasurements,
}: FashionSizeSystemProps) => {
  const [activeScale, setActiveScale] = useState<SizeScaleType>("alpha");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [measurements, setMeasurements] = useState<Record<string, any>>({});
  const [customInput, setCustomInput] = useState("");

  // 🎯 Columns dynamically switch (e.g., Chest for Tops, Inseam for Jeans, UK Size for Shoes)
  const columns = useMemo(
    () => getMeasurementColumns(subCategory),
    [subCategory],
  );

  // Toggle Size Chip
  const toggleSize = (size: string) => {
    const isSelected = selectedSizes.includes(size);
    const newSizes = isSelected
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];

    setSelectedSizes(newSizes);
    onUpdateSizes(newSizes);

    // Initialize measurement row if adding a new size and it doesn't exist
    if (!isSelected && !measurements[size]) {
      const newRow = columns.reduce((acc, col) => ({ ...acc, [col]: "" }), {});
      const updatedMeasurements = { ...measurements, [size]: newRow };
      setMeasurements(updatedMeasurements);
      onUpdateMeasurements(updatedMeasurements);
    }
  };

  const updateVal = (size: string, col: string, val: string) => {
    const updated = {
      ...measurements,
      [size]: { ...measurements[size], [col]: val },
    };
    setMeasurements(updated);
    onUpdateMeasurements(updated);
  };

  const labelStyle =
    "text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] mb-4 block";

  // If subCategory results in no columns (Accessories), we hide the measurement table section
  const hasMeasurementTable = columns.length > 0;

  return (
    <section className="p-8 bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] space-y-10 shadow-xl shadow-slate-200/20 dark:shadow-none animate-in fade-in zoom-in-95 duration-500">
      {/* 📏 Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <Ruler size={18} className="text-indigo-500" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
              Sizing Architecture
            </h2>
            <p className="text-[10px] text-slate-500 font-medium lowercase first-letter:uppercase">
              Configuring dimensions for{" "}
              <span className="text-indigo-500 font-bold">
                {subCategory || "General Item"}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 1. Size Type Selection */}
        <div className="lg:col-span-4 space-y-4">
          <label className={labelStyle}>1. Select Size System</label>
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 rounded-2xl">
            {(Object.keys(SIZE_SCALES) as SizeScaleType[]).map((scale) => (
              <button
                key={scale}
                onClick={() => setActiveScale(scale)}
                className={`py-3 px-4 text-[11px] font-black rounded-xl uppercase transition-all duration-300 ${
                  activeScale === scale
                    ? "bg-white dark:bg-slate-800 shadow-md text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20"
                    : "text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/40"
                }`}
              >
                {SIZE_SCALES[scale].label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Chip Selection */}
        <div className="lg:col-span-8 space-y-4">
          <label className={labelStyle}>2. Choose Available Sizes</label>
          <div className="flex flex-wrap gap-2.5">
            {SIZE_SCALES[activeScale].values.map((size) => {
              const active = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`relative min-w-12 h-12 px-4 rounded-xl text-[11px] font-black border-2 transition-all duration-300 group ${
                    active
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30 -translate-y-1"
                      : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-500 hover:border-indigo-500/50 dark:hover:border-indigo-400/50"
                  }`}
                >
                  {size}
                  {active && (
                    <div className="absolute -top-1.5 -right-1.5 bg-white dark:bg-slate-900 text-indigo-600 rounded-full p-0.5 shadow-md border border-indigo-100 dark:border-indigo-800">
                      <Check size={8} strokeWidth={4} />
                    </div>
                  )}
                </button>
              );
            })}

            {activeScale === "custom" && (
              <div className="flex gap-2 group">
                <input
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value.toUpperCase())}
                  placeholder="ADD..."
                  className="bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl px-4 text-[11px] font-black w-24 outline-none focus:border-indigo-500 transition-all uppercase"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customInput) {
                      toggleSize(customInput);
                      setCustomInput("");
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (customInput) {
                      toggleSize(customInput);
                      setCustomInput("");
                    }
                  }}
                  className="bg-slate-800 dark:bg-indigo-600 p-3 rounded-xl text-white hover:scale-105 transition-transform"
                >
                  <Plus size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 📊 Measurement Section (Hidden for Accessories) */}
      {selectedSizes.length > 0 && hasMeasurementTable && (
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6 animate-in slide-in-from-bottom-4">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <label className={labelStyle}>3. Configure Measurements</label>
              <p className="text-[10px] font-bold text-indigo-500/80 uppercase tracking-tight">
                Standardized sizing for storefront display
              </p>
            </div>
          </div>

          <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm bg-slate-50/30 dark:bg-slate-900/20">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100/50 dark:bg-slate-900/80 backdrop-blur-sm">
                <tr>
                  <th className="py-5 px-6 w-24 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Size
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="py-5 px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {selectedSizes.map((size) => (
                  <tr
                    key={size}
                    className="hover:bg-indigo-500/2 transition-colors"
                  >
                    <td className="py-5 px-6">
                      <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs border border-slate-200 dark:border-slate-700 shadow-sm">
                        {size}
                      </span>
                    </td>
                    {columns.map((col) => (
                      <td key={col} className="py-3 px-3">
                        <input
                          type="number"
                          value={measurements[size]?.[col] || ""}
                          onChange={(e) => updateVal(size, col, e.target.value)}
                          placeholder="--"
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 outline-none transition-all font-mono text-center placeholder:text-slate-300 dark:placeholder:text-slate-700"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-3 bg-slate-100/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="p-1.5 bg-indigo-500/10 rounded-lg">
              <Info size={14} className="text-indigo-500" />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed uppercase tracking-tight">
              Values entered here are used to generate the size guide chart for
              customers, improving fit satisfaction.
            </p>
          </div>
        </div>
      )}

      {/* 🕶️ Accessory Notice */}
      {selectedSizes.length > 0 && !hasMeasurementTable && (
        <div className="flex items-center gap-3 bg-amber-500/5 p-5 rounded-2xl border border-amber-500/10 animate-in fade-in">
          <Info size={16} className="text-amber-500" />
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wide">
            Measurements are not required for {subCategory} accessories.
            Standard sizing will be applied based on selected units.
          </p>
        </div>
      )}
    </section>
  );
};
