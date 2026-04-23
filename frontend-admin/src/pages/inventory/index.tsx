import { useState, useEffect } from "react";
import { useProductForm } from "@/hooks/inventory/useProductForm";
import { ProductInfo } from "@/components/inventory/forms/ProductInfo";
import { DynamicSpecs } from "@/components/inventory/forms/DynamicSpecs";
import { FashionSizeSystem } from "@/components/inventory/forms/FashionSizeSystem";
import { VariantCard } from "@/components/inventory/forms/VariantCard";
import { ProfitDashboard } from "@/components/inventory/forms/ProfitDashboard";
import { StockManager } from "@/components/inventory/forms/StockManager";
import {
  PackagePlus,
  Save,
  LayoutGrid,
  Shirt,
  Footprints,
  Watch,
} from "lucide-react";
import {
  FASHION_CATEGORIES,
  type GenderType,
  type FashionType,
} from "@/common/fashion/sub-categories";
import { DEPARTMENT_VIEWS } from "@/common/configs/department-config";
import type { SpecEntry } from "@/types/inventory";

export default function InventoryPage() {
  const { state, dispatch } = useProductForm();

  // Local UI states for the 3-Tier Fashion Selection
  const [activeType, setActiveType] = useState<FashionType>(
    (state.fashionType as FashionType) || "apparel",
  );
  const [activeGender, setActiveGender] = useState<GenderType>(
    (state.gender as GenderType) || "women",
  );

  /**
   * 🔄 AUTO-SYNC LOGIC
   * Ensures that when switching to Fashion, the global state
   * is immediately aware of the default local selections.
   */
  useEffect(() => {
    if (state.categoryId === "fashion") {
      dispatch({
        type: "UPDATE_BASE_INFO",
        payload: {
          fashionType: activeType,
          gender: activeGender,
        } as any,
      });
    }
  }, [state.categoryId]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      {/* 🚀 Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">
            Add New Product
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {state.categoryId} / {state.fashionType || ""} /{" "}
            {state.category || "New Entry"}
          </p>
        </div>
        <button
          onClick={() => console.log("Final State to API:", state)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Save size={18} /> Save Product
        </button>
      </div>

      {/* 📂 Section 1: Department & 3-Tier Category Architecture */}
      <section className="p-8 bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm space-y-8">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <LayoutGrid size={12} /> Classification Logic
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Main Department Dropdown */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase ml-1 tracking-widest">
              Primary Department
            </label>
            <select
              className="w-full p-4 border-2 rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 border-slate-100 dark:border-slate-800 outline-none focus:border-indigo-500 transition-all cursor-pointer font-bold appearance-none"
              value={state.categoryId}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_BASE_INFO",
                  payload: { categoryId: e.target.value },
                })
              }
            >
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion & Apparel</option>
              <option value="automotive">Automotive</option>
            </select>
          </div>

          <div className="space-y-4">
            {/* --- ELECTRONICS VIEW --- */}
            {state.categoryId === "electronics" && (
              <div className="space-y-3 animate-in slide-in-from-right-4">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">
                  Device Category
                </label>
                <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full">
                  {DEPARTMENT_VIEWS.electronics.subCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() =>
                        dispatch({
                          type: "SET_CATEGORY",
                          payload: cat.toLowerCase(),
                        })
                      }
                      className={`flex-1 py-2 px-4 text-[11px] font-black rounded-xl capitalize transition-all ${
                        state.category === cat.toLowerCase()
                          ? "bg-white dark:bg-slate-700 text-indigo-500 shadow-md"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* --- FASHION TIER 1: TYPE --- */}
            {state.categoryId === "fashion" && (
              <div className="space-y-3 animate-in slide-in-from-right-4">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">
                  Fashion Type
                </label>
                <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full">
                  {DEPARTMENT_VIEWS.fashion.types.map((type) => {
                    const isApparel = type === "apparel";
                    const isFootwear = type === "footwear";
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          setActiveType(type as FashionType);
                          dispatch({
                            type: "UPDATE_BASE_INFO",
                            payload: { fashionType: type } as any,
                          });
                        }}
                        className={`flex-1 py-2 px-4 text-[11px] font-black rounded-xl capitalize transition-all flex items-center justify-center gap-2 ${
                          activeType === type
                            ? "bg-white dark:bg-slate-700 text-indigo-500 shadow-md"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {isApparel && <Shirt size={12} />}
                        {isFootwear && <Footprints size={12} />}
                        {!isApparel && !isFootwear && <Watch size={12} />}
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- FASHION TIER 2 & 3: Gender & Sub-Category --- */}
        {state.categoryId === "fashion" && (
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-8 animate-in fade-in duration-700">
            {/* Gender Selection */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">
                Target Audience
              </label>
              <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
                {DEPARTMENT_VIEWS.fashion.genders.map((gender) => (
                  <button
                    key={gender}
                    onClick={() => {
                      setActiveGender(gender as GenderType);
                      dispatch({
                        type: "UPDATE_BASE_INFO",
                        payload: { gender: gender } as any,
                      });
                    }}
                    className={`px-8 py-2 text-[11px] font-black rounded-xl capitalize transition-all ${
                      activeGender === gender
                        ? "bg-white dark:bg-slate-700 text-indigo-500 shadow-md"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Category Grid */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">
                Select {activeGender}'s {activeType} Item
              </label>
              <div className="flex flex-wrap gap-2">
                {FASHION_CATEGORIES[activeType][activeGender].map((sub) => (
                  <button
                    key={sub}
                    onClick={() =>
                      dispatch({
                        type: "SET_CATEGORY",
                        payload: sub.toLowerCase(),
                      })
                    }
                    className={`px-5 py-2.5 text-xs font-bold rounded-xl border-2 transition-all ${
                      state.category === sub.toLowerCase()
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30 -translate-y-0.5"
                        : "bg-transparent border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-500/50"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 🏷️ Section 2: Product Identity */}
      <ProductInfo
        data={state}
        onUpdate={(data: any) =>
          dispatch({ type: "UPDATE_BASE_INFO", payload: data })
        }
      />

      {/* ⚙️ Section 3: Dynamic Slot */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
        {state.categoryId === "electronics" ? (
          <DynamicSpecs
            category={state.category}
            specs={state.specs}
            onUpdate={(newSpecs: SpecEntry[]) =>
              dispatch({ type: "SET_SPECS", payload: newSpecs })
            }
          />
        ) : state.categoryId === "fashion" ? (
          <FashionSizeSystem
            subCategory={state.category}
            onUpdateSizes={(sizes) =>
              dispatch({
                type: "UPDATE_BASE_INFO",
                payload: { selectedSizes: sizes } as any,
              })
            }
            onUpdateMeasurements={(measurements) =>
              dispatch({
                type: "UPDATE_BASE_INFO",
                payload: { sizeGuideData: measurements } as any,
              })
            }
          />
        ) : null}
      </div>

      {/* 🌈 Section 4: Variants & Pricing */}
      <div className="space-y-4 px-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
            Stock Variants
          </h2>
          <button
            onClick={() => dispatch({ type: "ADD_VARIANT" })}
            className="text-[10px] font-black text-indigo-600 flex items-center gap-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 px-4 py-2 rounded-xl transition-all border border-transparent hover:border-indigo-100"
          >
            <PackagePlus size={14} /> ADD VARIANT
          </button>
        </div>

        {state.variants.map((v, idx) => (
          <VariantCard
            key={`${state.category}-${idx}`}
            index={idx}
            variant={v}
            category={state.category}
            purchaseGst={state.purchaseGst}
            salesGst={state.salesGst}
            onUpdate={(data) =>
              dispatch({ type: "UPDATE_VARIANT", index: idx, data })
            }
            onRemove={() => dispatch({ type: "REMOVE_VARIANT", index: idx })}
            brandName={state.brandId}
            modelNumber={state.name}
          />
        ))}
      </div>

      {/* 📦 Section 5: Stock Units */}
      <StockManager
        category={state.category}
        variants={state.variants}
        units={state.stockUnits || []}
        onUpdateUnits={(units) =>
          dispatch({ type: "UPDATE_BASE_INFO", payload: { stockUnits: units } })
        }
        onUpdateVariantStock={(variantIdx, count) =>
          dispatch({
            type: "UPDATE_VARIANT",
            index: variantIdx,
            data: { stock: count },
          })
        }
      />

      {/* 📊 Section 6: Profit Dashboard */}
      <ProfitDashboard
        purchasePrice={state.variants[0]?.baseCost || 0}
        sellingPrice={state.variants[0]?.sellingPrice || 0}
        purchaseGst={state.purchaseGst}
        salesGst={state.salesGst}
      />
    </div>
  );
}
