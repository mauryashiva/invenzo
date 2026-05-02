// src/components/inventory/forms/StockManager.tsx
import { useState, useMemo, useEffect } from "react";
import {
  Table,
  ClipboardList,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  getStockConfig,
  getVariantDisplayName,
} from "@/common/configs/stock-config";
import type { Variant, StockUnit, CategoryType } from "@/types/inventory";

interface StockManagerProps {
  category: CategoryType;
  categoryId?: string;   // "electronics" | "fashion" — drives field labels
  fashionType?: string;  // "apparel" | "footwear" | "accessories"
  variants: Variant[];
  units: StockUnit[];
  onUpdateUnits: (units: StockUnit[]) => void;
  onUpdateVariantStock: (variantIdx: number, count: number) => void;
}

export const StockManager = ({
  category,
  categoryId,
  fashionType,
  variants,
  units,
  onUpdateUnits,
  onUpdateVariantStock,
}: StockManagerProps) => {
  const [view, setView] = useState<"table" | "bulk">("table");
  const [selectedVarIdx, setSelectedVarIdx] = useState(0);
  const [bulkSerials, setBulkSerials] = useState("");
  const [bulkIMEIs, setBulkIMEIs] = useState("");

  const activeVariant = variants[selectedVarIdx];
  // 🎯 Use smart resolver — same fallback chain as getVariantConfig
  const config = getStockConfig(category, categoryId, fashionType);

  const currentVariantUnits = useMemo(() => {
    return units.filter((u) => u.variantId === activeVariant?.sku);
  }, [units, activeVariant?.sku]);

  const isLowStock =
    currentVariantUnits.length <= (activeVariant?.reorderLevel || 0);

  useEffect(() => {
    if (activeVariant) {
      onUpdateVariantStock(selectedVarIdx, currentVariantUnits.length);
    }
  }, [
    currentVariantUnits.length,
    selectedVarIdx,
    activeVariant,
    onUpdateVariantStock,
  ]);

  const updateUnitField = (
    id: string,
    field: keyof StockUnit,
    value: string,
  ) => {
    onUpdateUnits(
      units.map((u) => (u.id === id ? { ...u, [field]: value } : u)),
    );
  };

  const addSingleUnit = () => {
    if (!activeVariant) return;
    onUpdateUnits([
      ...units,
      {
        id: `unit-${Date.now()}`,
        variantId: activeVariant.sku,
        serialNumber: "",
        imei1: "",
        imei2: "",
        condition: "New",
        status: "In stock",
      },
    ]);
  };

  const handleParse = () => {
    if (!activeVariant) return;
    const serials = bulkSerials
      .split(/\n|,|;/)
      .map((s) => s.trim())
      .filter(Boolean);
    const imeis = bulkIMEIs
      .split(/\n|,|;/)
      .map((i) => i.trim())
      .filter(Boolean);

    const newUnits: StockUnit[] = serials.map((s, idx) => ({
      id: `unit-${Date.now()}-${idx}`,
      variantId: activeVariant.sku,
      serialNumber: s,
      imei1: config.hasImei ? imeis[idx] || "" : "",
      imei2: "",
      condition: "New",
      status: "In stock",
    }));

    onUpdateUnits([...units, ...newUnits]);
    setView("table");
    setBulkSerials("");
    setBulkIMEIs("");
  };

  const removeUnit = (id: string) => {
    onUpdateUnits(units.filter((u) => u.id !== id));
  };

  return (
    <section className="p-6 bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">
            Stock units — {config.primaryIdentifier}{" "}
            {config.hasSecondaryId && `& ${config.secondaryIdentifier}`}
          </h2>
          <div
            className={`px-2 py-1 rounded-md flex items-center gap-1.5 border ${isLowStock ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"}`}
          >
            {isLowStock ? (
              <AlertCircle size={10} className="animate-pulse" />
            ) : (
              <CheckCircle2 size={10} />
            )}
            <span className="text-[10px] font-black uppercase">
              {isLowStock ? "Low Stock" : "In Stock"} (
              {currentVariantUnits.length})
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none ring-1 ring-indigo-500/30"
            value={selectedVarIdx}
            onChange={(e) => setSelectedVarIdx(Number(e.target.value))}
          >
            {variants.map((v, i) => (
              <option key={i} value={i}>
                {getVariantDisplayName(v)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={addSingleUnit}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Plus size={14} /> Add unit
          </button>

          <button
            type="button"
            onClick={() => setView(view === "table" ? "bulk" : "table")}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-700 transition-all border border-slate-700 flex items-center gap-2"
          >
            {view === "table" ? (
              <ClipboardList size={14} />
            ) : (
              <Table size={14} />
            )}
            {view === "table" ? "Bulk paste" : "View Table"}
          </button>
        </div>
      </div>

      {view === "bulk" ? (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 space-y-4 animate-in zoom-in-95 duration-200">
          <div
            className={`grid grid-cols-1 ${config.bulkLayout === "double" ? "md:grid-cols-2" : "md:grid-cols-1"} gap-4`}
          >
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {config.primaryIdentifier}s (One per line)
              </label>
              <textarea
                value={bulkSerials}
                onChange={(e) => setBulkSerials(e.target.value)}
                rows={5}
                className="w-full bg-white dark:bg-black p-3 rounded-lg border border-slate-200 dark:border-slate-800 outline-none text-xs font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:border-indigo-500 transition-all"
                placeholder={`Paste ${config.primaryIdentifier}s here...`}
              />
            </div>
            {config.hasSecondaryId && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {config.secondaryIdentifier}s (Same order)
                </label>
                <textarea
                  value={bulkIMEIs}
                  onChange={(e) => setBulkIMEIs(e.target.value)}
                  rows={5}
                  className="w-full bg-white dark:bg-black p-3 rounded-lg border border-slate-200 dark:border-slate-800 outline-none text-xs font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:border-indigo-500 transition-all"
                  placeholder={`Paste ${config.secondaryIdentifier}s here...`}
                />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleParse}
            className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all"
          >
            Process Bulk Units
          </button>
        </div>
      ) : (
        <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-4 pl-4 w-12">#</th>
                <th className="py-4 px-3">Variant Specs</th>
                <th className="py-4 px-3">{config.primaryIdentifier}</th>
                {config.hasSecondaryId && (
                  <th className="py-4 px-3">
                    {config.secondaryIdentifier}{config.hasImei ? " 1 / 2" : ""}
                  </th>
                )}
                <th className="py-4 px-3">Condition</th>
                <th className="py-4 text-right pr-4"></th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {currentVariantUnits.map((unit, i) => (
                <tr
                  key={unit.id}
                  className="border-b border-slate-100 dark:border-slate-800/50 group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                >
                  <td className="py-4 pl-4 text-slate-400 dark:text-slate-500 font-mono">
                    {i + 1}
                  </td>
                  <td className="py-4 px-3 font-bold text-slate-800 dark:text-slate-300 uppercase min-w-35">
                    {getVariantDisplayName(activeVariant)}
                  </td>
                  <td className="py-4 px-3 min-w-50">
                    <input
                      className="bg-slate-100 dark:bg-slate-800 px-3 py-2.5 rounded-lg w-full outline-none border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-1 focus:ring-indigo-500 transition-all"
                      value={unit.serialNumber}
                      onChange={(e) =>
                        updateUnitField(unit.id, "serialNumber", e.target.value)
                      }
                      placeholder={`Enter ${config.primaryIdentifier}`}
                    />
                  </td>
                  {config.hasSecondaryId && (
                    <td className="py-4 px-6">
                      <div className="flex gap-3">
                        <input
                          className="w-36 bg-slate-100 dark:bg-slate-800 px-3 py-2.5 rounded-lg outline-none border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-1 focus:ring-indigo-500 transition-all"
                          placeholder={config.secondaryIdentifier}
                          value={unit.imei1}
                          onChange={(e) =>
                            updateUnitField(unit.id, "imei1", e.target.value)
                          }
                        />
                        {/* IMEI devices only: show a second IMEI input */}
                        {config.hasImei && (
                          <input
                            className="w-36 bg-slate-100 dark:bg-slate-800 px-3 py-2.5 rounded-lg outline-none border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-1 focus:ring-indigo-500 transition-all"
                            placeholder="IMEI 2"
                            value={unit.imei2 || ""}
                            onChange={(e) =>
                              updateUnitField(unit.id, "imei2", e.target.value)
                            }
                          />
                        )}
                      </div>
                    </td>
                  )}
                  <td className="py-4 px-3">
                    <select
                      className="bg-slate-100 dark:bg-slate-800 px-3 py-2.5 rounded-lg outline-none border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer focus:ring-1 focus:ring-indigo-500"
                      value={unit.condition}
                      onChange={(e) =>
                        updateUnitField(unit.id, "condition", e.target.value)
                      }
                    >
                      <option value="New">New</option>
                      <option value="Open box">Open box</option>
                      <option value="Refurbished">Refurbished</option>
                    </select>
                  </td>
                  <td className="py-4 text-right pr-4">
                    <button
                      type="button"
                      onClick={() => removeUnit(unit.id)}
                      className="text-slate-400 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 p-2"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {currentVariantUnits.length === 0 && view === "table" && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
              <ClipboardList size={32} className="mb-2 opacity-20" />
              <p className="text-xs font-medium">
                No stock units for this variant.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
