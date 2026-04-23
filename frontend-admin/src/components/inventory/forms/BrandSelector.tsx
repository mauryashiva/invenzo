import { useState, useRef, useMemo } from "react";
import { ChevronDown, Plus, Check, Search } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { formatTitleCase } from "@/lib/utils";
import { BRANDS_BY_CONTEXT } from "@/common/configs/brand-options";

interface BrandSelectorProps {
  value: string;
  onChange: (val: string) => void;
  categoryId: string;
  category: string;
  gender?: string;
  fashionType?: string;
}

export const BrandSelector = ({
  value,
  onChange,
  categoryId,
  category,
  gender,
  fashionType,
}: BrandSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
    setSearchTerm("");
  });

  const contextualBrands = useMemo(() => {
    if (categoryId === "electronics") {
      return (
        BRANDS_BY_CONTEXT[category.toLowerCase()] ||
        BRANDS_BY_CONTEXT.smartphone
      ).sort();
    }

    if (categoryId === "fashion" && fashionType && gender) {
      const contextKey = `${fashionType.toLowerCase()}-${gender.toLowerCase()}`;
      return (
        BRANDS_BY_CONTEXT[contextKey] || BRANDS_BY_CONTEXT["apparel-men"]
      ).sort();
    }

    return (BRANDS_BY_CONTEXT[categoryId] || []).sort();
  }, [categoryId, category, gender, fashionType]);

  const filteredBrands = contextualBrands.filter((b) =>
    b.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const brandExists = contextualBrands.some(
    (b) => b.toLowerCase() === searchTerm.toLowerCase(),
  );

  const handleSelect = (brand: string) => {
    onChange(brand);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* --- Trigger --- */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-3 bg-white dark:bg-[#0f1117] border border-slate-200 dark:border-slate-800 rounded-2xl flex justify-between items-center cursor-pointer transition-all hover:border-indigo-500 hover:shadow-md"
      >
        <span
          className={`text-sm ${
            value
              ? "text-slate-900 dark:text-white font-semibold"
              : "text-slate-400"
          }`}
        >
          {value || "Select Brand"}
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180 text-indigo-500" : "text-slate-400"
          }`}
        />
      </div>

      {/* --- Dropdown --- */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 z-50 bg-white dark:bg-[#0f1117] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 animate-in fade-in zoom-in-95 duration-200">
          {/* Search */}
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(formatTitleCase(e.target.value))}
                placeholder="Search or add brand..."
                className="w-full bg-slate-50 dark:bg-[#1a1d24] border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {!brandExists && searchTerm.length > 0 && (
              <button
                type="button"
                onClick={() => handleSelect(searchTerm)}
                className="flex items-center justify-center bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-all active:scale-95 shadow-md"
              >
                <Plus size={16} />
              </button>
            )}
          </div>

          {/* Brand List */}
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand) => (
                <div
                  key={brand}
                  onClick={() => handleSelect(brand)}
                  className="flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer transition-all hover:bg-indigo-50 dark:hover:bg-indigo-500/10 group"
                >
                  <span
                    className={`text-sm ${
                      value === brand
                        ? "text-indigo-600 font-semibold"
                        : "text-slate-600 dark:text-slate-300 group-hover:text-indigo-500"
                    }`}
                  >
                    {brand}
                  </span>

                  {value === brand && (
                    <Check size={16} className="text-indigo-500" />
                  )}
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm font-medium text-slate-500">
                  No results found
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Press + to add "{searchTerm}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
