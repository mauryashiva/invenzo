import { Plus } from "lucide-react";

export const VariantMedia = () => {
  return (
    <div className="flex gap-4 pt-2">
      <button
        type="button"
        className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-all bg-white dark:bg-transparent"
      >
        <Plus size={20} />
        <span className="text-[9px] font-bold mt-1 uppercase">Image</span>
      </button>
      <button
        type="button"
        className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-all bg-white dark:bg-transparent"
      >
        <Plus size={20} />
        <span className="text-[9px] font-bold mt-1 uppercase">Video</span>
      </button>
    </div>
  );
};
