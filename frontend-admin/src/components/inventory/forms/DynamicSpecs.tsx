// src/components/inventory/forms/DynamicSpecs.tsx
import { useState, useRef, useMemo } from "react";
import type { KeyboardEvent } from "react";
import { Plus, Trash2, ChevronDown, Check, Zap } from "lucide-react";
import { formatTitleCase } from "@/lib/utils";
import { useClickOutside } from "@/hooks/use-click-outside";
import { getSuggestionsByCategory } from "@/common/specs";
import type { SpecEntry } from "@/types/inventory";

interface DynamicSpecsProps {
  specs: SpecEntry[];
  onUpdate: (specs: SpecEntry[]) => void;
  category: string;
}

export const DynamicSpecs = ({
  specs,
  onUpdate,
  category,
}: DynamicSpecsProps) => {
  const [activeDropdown, setActiveDropdown] = useState<{
    index: number;
    type: "key" | "value";
  } | null>(null);
  const [committing, setCommitting] = useState<{
    index: number;
    type: "key" | "value";
  } | null>(null);
  const [localSearch, setLocalSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔄 Automatically switches to TABLET_KEYS / TABLET_SUGGESTIONS when category is "Tablet"
  const categoryData = useMemo(
    () => getSuggestionsByCategory(category),
    [category],
  );

  useClickOutside(dropdownRef, () => {
    setActiveDropdown(null);
    setLocalSearch("");
  });

  const handleUpdate = (index: number, field: "key" | "value", val: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = field === "key" ? formatTitleCase(val) : val;
    onUpdate(newSpecs);
    setLocalSearch(val);
  };

  const selectSuggestion = (
    index: number,
    field: "key" | "value",
    val: string,
  ) => {
    handleUpdate(index, field, val);
    setActiveDropdown(null);
    setLocalSearch("");
    if (field === "key") {
      setTimeout(
        () => document.getElementById(`value-input-${index}`)?.focus(),
        10,
      );
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent,
    index: number,
    field: "key" | "value",
  ) => {
    if (e.key === "Enter") {
      setActiveDropdown(null);
      setCommitting({ index, type: field });
      setTimeout(() => setCommitting(null), 600);
      if (field === "key") {
        document.getElementById(`value-input-${index}`)?.focus();
      }
    }
  };

  const suggestions = useMemo(() => {
    if (!activeDropdown) return [];
    const { index, type } = activeDropdown;
    const currentInput = localSearch.toLowerCase();

    if (type === "key") {
      return categoryData.keys.filter((k) =>
        k.toLowerCase().includes(currentInput),
      );
    } else {
      const selectedKey = specs[index].key;
      const possibleValues = categoryData.values[selectedKey] || [];
      return possibleValues.filter((v) =>
        v.toLowerCase().includes(currentInput),
      );
    }
  }, [activeDropdown, localSearch, specs, categoryData]);

  const inputBase =
    "w-full py-3 bg-transparent text-[13px] outline-none placeholder:font-normal placeholder:text-slate-400";

  return (
    <section className="p-6 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-amber-500 fill-amber-500/20" />
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            {category} Specifications
          </h2>
        </div>
        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md uppercase tracking-widest">
          {category} Mode
        </span>
      </div>

      <div
        className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-4"
        ref={dropdownRef}
      >
        {specs.map((spec, index) => (
          <div
            key={index}
            className="flex items-center gap-3 group animate-in fade-in slide-in-from-left-2 duration-300"
          >
            <div
              className={`flex-1 flex items-center bg-slate-50 dark:bg-slate-950 border rounded-xl relative transition-all duration-300
              ${committing?.index === index ? "border-emerald-500 ring-4 ring-emerald-500/10" : "border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500"}
            `}
            >
              {/* KEY FIELD */}
              <div className="relative w-[42%] border-r border-slate-200 dark:border-slate-800">
                <div className="flex items-center px-3">
                  <input
                    value={spec.key}
                    onFocus={() => {
                      setActiveDropdown({ index, type: "key" });
                      setLocalSearch(spec.key);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, index, "key")}
                    onChange={(e) => handleUpdate(index, "key", e.target.value)}
                    placeholder="Property"
                    className={`${inputBase} font-bold text-slate-700 dark:text-slate-300`}
                  />
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(
                        activeDropdown?.index === index &&
                          activeDropdown.type === "key"
                          ? null
                          : { index, type: "key" },
                      );
                    }}
                    className="cursor-pointer p-1 hover:text-indigo-500 transition-colors"
                  >
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 transition-transform ${activeDropdown?.index === index && activeDropdown.type === "key" ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>

                {activeDropdown?.index === index &&
                  activeDropdown.type === "key" &&
                  suggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-64 mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl p-1 animate-in zoom-in-95 duration-150">
                      <div className="max-h-52 overflow-y-auto custom-scrollbar">
                        {suggestions.map((k) => (
                          <button
                            key={k}
                            type="button"
                            onClick={() => selectSuggestion(index, "key", k)}
                            className="w-full text-left px-3 py-2 text-[12px] rounded-lg text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 flex justify-between items-center transition-colors"
                          >
                            {k}{" "}
                            {spec.key === k && (
                              <Check size={12} className="text-indigo-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* VALUE FIELD */}
              <div className="relative flex-1">
                <div className="flex items-center px-3">
                  <input
                    id={`value-input-${index}`}
                    value={spec.value}
                    onFocus={() => {
                      setActiveDropdown({ index, type: "value" });
                      setLocalSearch(spec.value);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, index, "value")}
                    onChange={(e) =>
                      handleUpdate(index, "value", e.target.value)
                    }
                    placeholder="Value..."
                    className={`${inputBase} text-slate-800 dark:text-slate-100`}
                  />
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(
                        activeDropdown?.index === index &&
                          activeDropdown.type === "value"
                          ? null
                          : { index, type: "value" },
                      );
                    }}
                    className="cursor-pointer p-1 hover:text-emerald-500 transition-colors"
                  >
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 transition-transform ${activeDropdown?.index === index && activeDropdown.type === "value" ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>

                {activeDropdown?.index === index &&
                  activeDropdown.type === "value" &&
                  suggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl p-1 animate-in zoom-in-95 duration-150">
                      <div className="max-h-52 overflow-y-auto custom-scrollbar">
                        {suggestions.map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => selectSuggestion(index, "value", v)}
                            className="w-full text-left px-3 py-2 text-[12px] rounded-lg text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 flex items-center justify-between transition-colors"
                          >
                            {v}{" "}
                            {spec.value === v && (
                              <Check size={12} className="text-emerald-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onUpdate(specs.filter((_, i) => i !== index))}
              className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all shrink-0"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onUpdate([...specs, { key: "", value: "" }])}
        className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-400 hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50/20 transition-all group"
      >
        <Plus
          size={16}
          className="group-hover:rotate-90 transition-transform"
        />
        Add {category} Specification
      </button>
    </section>
  );
};
