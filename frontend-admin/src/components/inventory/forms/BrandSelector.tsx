import { useState, useRef } from "react";
import { ChevronDown, Plus, Check } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { formatTitleCase } from "@/lib/utils";
import { BRANDS_BY_DEPT } from "@/common/configs/brand-options"; // 🚀 Import from your new common file

interface BrandSelectorProps {
  value: string;
  onChange: (val: string) => void;
  department: string;
}

export const BrandSelector = ({
  value,
  onChange,
  department,
}: BrandSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get brands for the specific department or default to an empty array
  const brands = BRANDS_BY_DEPT[department] || [];

  const filteredBrands = brands.filter((b) =>
    b.toLowerCase().includes(newBrand.toLowerCase()),
  );

  // Logic to show "Add New" button only if the brand doesn't exist
  const brandExists = brands.some(
    (b) => b.toLowerCase() === newBrand.toLowerCase(),
  );

  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
    setNewBrand("");
  });

  const handleInputChange = (val: string) => {
    setNewBrand(formatTitleCase(val));
  };

  const handleAddBrand = () => {
    if (newBrand.trim()) {
      onChange(newBrand.trim());
      setNewBrand("");
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex justify-between items-center cursor-pointer transition-all hover:border-slate-400 dark:hover:border-slate-600 shadow-sm"
      >
        <span
          className={`text-sm ${value ? "text-slate-800 dark:text-slate-200 font-medium" : "text-slate-500"}`}
        >
          {value || "Select a brand"}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 z-100 bg-white dark:bg-[#1a1c23] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 animate-in zoom-in-95 duration-200">
          <div className="flex gap-2 mb-3">
            <input
              autoFocus
              value={newBrand}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Search or add brand..."
              className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 transition-all"
            />
            {!brandExists && newBrand.length > 0 && (
              <button
                type="button"
                onClick={handleAddBrand}
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-all active:scale-90"
              >
                <Plus size={16} />
              </button>
            )}
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand) => (
                <div
                  key={brand}
                  onClick={() => {
                    onChange(brand);
                    setIsOpen(false);
                  }}
                  className="flex justify-between items-center px-3 py-2.5 hover:bg-indigo-600/10 dark:hover:bg-indigo-600/20 rounded-lg cursor-pointer text-sm text-slate-700 dark:text-slate-300 group"
                >
                  <span
                    className={
                      value === brand
                        ? "text-indigo-500 font-bold"
                        : "group-hover:text-indigo-500"
                    }
                  >
                    {brand}
                  </span>
                  {value === brand && (
                    <Check size={14} className="text-indigo-500" />
                  )}
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                No brands listed
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
