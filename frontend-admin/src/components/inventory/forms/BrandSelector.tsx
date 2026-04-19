import { useState, useRef } from "react";
import { Plus, Check, ChevronDown } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { formatTitleCase } from "@/lib/utils"; // Using centralized utils

export const BrandSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [brands, setBrands] = useState(["Samsung", "Apple", "Sony", "Google"]);
  const [newBrand, setNewBrand] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleAddBrand = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent closing dropdown
    if (newBrand.trim()) {
      const formatted = formatTitleCase(newBrand.trim());
      if (!brands.includes(formatted)) {
        setBrands((prev) => [formatted, ...prev]);
        setSelectedBrand(formatted);
      }
      setNewBrand("");
    }
  };

  const handleSelect = (brand: string) => {
    setSelectedBrand(brand);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">
        Brand
      </label>

      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 p-2.5 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer flex justify-between items-center hover:border-indigo-500 transition-all shadow-sm"
      >
        <span
          className={
            selectedBrand ? "text-sm font-medium" : "text-sm text-slate-400"
          }
        >
          {selectedBrand || "Select a brand"}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Add New Brand Input Section */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex gap-2">
              <input
                value={newBrand}
                onChange={(e) => setNewBrand(formatTitleCase(e.target.value))}
                placeholder="New Brand Name..."
                className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs p-2 rounded-lg outline-none focus:ring-1 ring-indigo-500 text-slate-800 dark:text-slate-200"
                onKeyDown={(e) => e.key === "Enter" && handleAddBrand(e as any)}
              />
              <button
                onClick={handleAddBrand}
                disabled={!newBrand.trim()}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-md"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Brands List */}
          <div className="max-h-60 overflow-y-auto p-1.5 custom-scrollbar">
            {brands.map((b) => (
              <div
                key={b}
                onClick={() => handleSelect(b)}
                className={`flex items-center justify-between p-2.5 text-sm rounded-xl cursor-pointer transition-colors
                  ${
                    selectedBrand === b
                      ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }
                `}
              >
                <span>{b}</span>
                {selectedBrand === b && (
                  <Check
                    size={14}
                    className="animate-in zoom-in duration-300"
                  />
                )}
              </div>
            ))}

            {brands.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-500 uppercase tracking-tighter">
                No brands found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
