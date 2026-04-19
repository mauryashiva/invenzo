import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-md transition-all ${theme === "light" ? "bg-white text-orange-500 shadow-sm" : "text-slate-500"}`}
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-md transition-all ${theme === "dark" ? "bg-slate-700 text-yellow-400 shadow-sm" : "text-slate-500"}`}
      >
        <Moon size={16} />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-md transition-all ${theme === "system" ? "bg-white dark:bg-slate-700 text-blue-500 shadow-sm" : "text-slate-500"}`}
      >
        <Monitor size={16} />
      </button>
    </div>
  );
}
