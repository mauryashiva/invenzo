import { useProductForm } from "@/hooks/inventory/useProductForm";
import { ProductInfo } from "@/components/inventory/forms/ProductInfo";
import { DynamicSpecs } from "@/components/inventory/forms/DynamicSpecs";
import { VariantCard } from "@/components/inventory/forms/VariantCard";
import { ProfitDashboard } from "@/components/inventory/forms/ProfitDashboard";
import { StockManager } from "@/components/inventory/forms/StockManager";
import { PackagePlus, Save, LayoutGrid } from "lucide-react";
import type { Variant, SpecEntry, StockUnit } from "@/types/inventory";

export default function InventoryPage() {
  const { state, dispatch } = useProductForm();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      {/* 🚀 Top Header: Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            Add New Product
          </h1>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">
            Inventory Management System / Product Entry
          </p>
        </div>
        <button
          onClick={() => console.log("Final State to API:", state)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Save size={18} /> Save Product
        </button>
      </div>

      {/* 📂 Section 1: Department & Category Architecture */}
      <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <LayoutGrid size={12} /> Department & Category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
              Primary Department
            </label>
            <select
              className="w-full p-2.5 border rounded-xl bg-transparent text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition-all cursor-pointer"
              value={state.categoryId}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_BASE_INFO",
                  payload: { categoryId: e.target.value },
                })
              }
            >
              <option value="electronics" className="dark:bg-slate-900">
                Electronics
              </option>
              <option value="fashion" className="dark:bg-slate-900">
                Fashion
              </option>
              <option value="automotive" className="dark:bg-slate-900">
                Automotive
              </option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
              Sub-category View
            </label>
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full">
              {(["smartphone", "laptop", "tablet"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    // 🔄 Triggers the key migration in the reducer
                    dispatch({ type: "SET_CATEGORY", payload: cat });
                  }}
                  className={`flex-1 py-1.5 px-4 text-xs font-bold rounded-lg capitalize transition-all ${
                    state.category === cat
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 🏷️ Section 2: Product Identity */}
      <ProductInfo
        data={state}
        onUpdate={(data) =>
          dispatch({ type: "UPDATE_BASE_INFO", payload: data })
        }
      />

      {/* ⚙️ Section 3: Technical Specs */}
      <DynamicSpecs
        category={state.category}
        specs={state.specs}
        onUpdate={(newSpecs: SpecEntry[]) =>
          dispatch({ type: "SET_SPECS", payload: newSpecs })
        }
      />

      {/* 🌈 Section 4: Variants & Pricing */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">
            Active Variants
          </h2>
          <button
            onClick={() => dispatch({ type: "ADD_VARIANT" })}
            className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 px-3 py-1.5 rounded-lg transition-all"
          >
            <PackagePlus size={14} /> Add New Variant
          </button>
        </div>

        {state.variants.map((v: Variant, idx: number) => (
          <VariantCard
            key={`${state.category}-${idx}`} // Force fresh render when category changes
            index={idx}
            variant={v}
            category={state.category}
            purchaseGst={state.purchaseGst}
            salesGst={state.salesGst}
            onUpdate={(data: Partial<Variant>) =>
              dispatch({ type: "UPDATE_VARIANT", index: idx, data })
            }
            onRemove={() => dispatch({ type: "REMOVE_VARIANT", index: idx })}
          />
        ))}
      </div>

      {/* 📦 Section 5: Stock Units (Serial & IMEI Management) */}
      <StockManager
        category={state.category} // 🔄 FIXED: Passed dynamic category instead of hardcoded string
        variants={state.variants}
        units={state.stockUnits || []}
        onUpdateUnits={(units: StockUnit[]) =>
          dispatch({ type: "UPDATE_BASE_INFO", payload: { stockUnits: units } })
        }
        onUpdateVariantStock={(variantIdx: number, count: number) =>
          dispatch({
            type: "UPDATE_VARIANT",
            index: variantIdx,
            data: { stock: count },
          })
        }
      />

      {/* 📊 Section 6: Profit Health Dashboard */}
      <ProfitDashboard
        purchasePrice={state.variants[0]?.baseCost || 0}
        sellingPrice={state.variants[0]?.sellingPrice || 0}
        purchaseGst={state.purchaseGst}
        salesGst={state.salesGst}
      />
    </div>
  );
}
