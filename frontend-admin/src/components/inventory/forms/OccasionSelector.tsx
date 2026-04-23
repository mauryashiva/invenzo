import { useState, useRef } from "react";
import { ChevronDown, Plus, Check, Search } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { formatTitleCase } from "@/lib/utils";

interface OccasionSelectorProps {
  value: string;
  onChange: (val: string) => void;
  options: string[]; // 🚀 Added to fix the TS error
}

export const OccasionSelector = ({
  value,
  onChange,
  options = [],
}: OccasionSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useClickOutside(dropdownRef, () => setIsOpen(false));

  /**
   * 🔍 Filter Logic
   * Combines standard options from schema with user search
   */
  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(query.toLowerCase()),
  );

  const handleInputChange = (val: string) => {
    setQuery(formatTitleCase(val));
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setQuery("");
    setIsOpen(false);
  };

  const handleAddCustom = () => {
    if (query.trim()) {
      handleSelect(query.trim());
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* --- Trigger Button --- */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex justify-between items-center cursor-pointer transition-all hover:border-indigo-500/50 group"
      >
        <span
          className={`text-sm font-medium ${
            value ? "text-slate-900 dark:text-slate-100" : "text-slate-400"
          }`}
        >
          {value || "Select Occasion"}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-indigo-500" : ""
          }`}
        />
      </div>

      {/* --- Dropdown Menu --- */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 z-100 bg-white dark:bg-[#16181d] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 animate-in zoom-in-95 duration-200">
          {/* Search & Add Input */}
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search
                size={12}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                autoFocus
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Search or add..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
              />
            </div>
            <button
              type="button"
              onClick={handleAddCustom}
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-all active:scale-90 shadow-lg shadow-indigo-500/20"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Options List */}
          <div className="max-h-52 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className="flex justify-between items-center px-3 py-2.5 hover:bg-indigo-600/10 dark:hover:bg-indigo-600/20 rounded-xl cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-400 transition-all group"
                >
                  <span className="group-hover:text-indigo-500 transition-colors capitalize">
                    {opt}
                  </span>
                  {value === opt && (
                    <Check size={14} className="text-indigo-500" />
                  )}
                </div>
              ))
            ) : (
              <div
                onClick={handleAddCustom}
                className="py-4 text-center cursor-pointer group"
              >
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest group-hover:text-indigo-500">
                  {query ? `Add "${query}"` : "No matches found"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
