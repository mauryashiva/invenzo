import { useState, useRef } from "react";
import { ChevronDown, Plus, Check } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { formatTitleCase } from "@/lib/utils";
import { OCCASION_OPTIONS } from "@/common/fashion/occasionoption";

interface OccasionSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

export const OccasionSelector = ({
  value,
  onChange,
}: OccasionSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newOccasion, setNewOccasion] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter based on typing
  const filteredOptions = OCCASION_OPTIONS.filter((opt) =>
    opt.toLowerCase().includes(newOccasion.toLowerCase()),
  );

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleInputChange = (val: string) => {
    const formatted = formatTitleCase(val);
    setNewOccasion(formatted);
  };

  const handleAddCustom = () => {
    if (newOccasion.trim()) {
      onChange(newOccasion.trim());
      setNewOccasion("");
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button - Matches Brand Selector Style */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex justify-between items-center cursor-pointer transition-all hover:border-slate-400 dark:hover:border-slate-600"
      >
        <span
          className={
            value ? "text-slate-800 dark:text-slate-200" : "text-slate-500"
          }
        >
          {value || "Select an occasion"}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 z-[100] bg-white dark:bg-[#1a1c23] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 animate-in zoom-in-95 duration-200">
          {/* Search / Add Custom Section */}
          <div className="flex gap-2 mb-3">
            <input
              autoFocus
              value={newOccasion}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Search or add custom..."
              className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 transition-all"
            />
            <button
              type="button"
              onClick={handleAddCustom}
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-all active:scale-90 shadow-lg shadow-indigo-500/20"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setNewOccasion("");
                    setIsOpen(false);
                  }}
                  className="flex justify-between items-center px-3 py-2.5 hover:bg-indigo-600/10 dark:hover:bg-indigo-600/20 rounded-lg cursor-pointer text-sm text-slate-700 dark:text-slate-300 transition-colors group"
                >
                  <span className="group-hover:text-indigo-500 transition-colors">
                    {opt}
                  </span>
                  {value === opt && (
                    <Check size={14} className="text-indigo-500" />
                  )}
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                No matches found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
