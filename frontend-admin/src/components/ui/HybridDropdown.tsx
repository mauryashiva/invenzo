// src/components/ui/HybridDropdown.tsx
import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

interface HybridDropdownProps {
  label: string;
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  showSearch?: boolean;
}

export const HybridDropdown = ({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onChange,
  placeholder,
  className = "",
}: HybridDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className={`${className} relative`}>
      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 block tracking-wider">
        {label}
      </label>

      <div className="relative group">
        <input
          className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 transition-all font-medium pr-10 placeholder:text-slate-400"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setSearchTerm(e.target.value);
          }}
          onFocus={() => !isOpen && onToggle()}
        />

        {/* The Arrow Button: Works independently */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="absolute right-0 top-0 h-full w-10 flex items-center justify-center cursor-pointer group-hover:text-indigo-500 transition-colors"
        >
          <ChevronDown
            size={16}
            className={`text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
          />
        </div>
      </div>

      {/* The Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl p-1 animate-in zoom-in-95 duration-150">
          <div className="max-h-56 overflow-y-auto custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    onToggle();
                    setSearchTerm("");
                  }}
                  className="w-full text-left px-3 py-2.5 text-xs rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 flex items-center justify-between transition-colors group"
                >
                  <span className="text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-medium">
                    {opt}
                  </span>
                  {value === opt && (
                    <Check size={12} className="text-emerald-500" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-[10px] text-slate-500 uppercase font-bold">
                Press Enter to use "{value}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
