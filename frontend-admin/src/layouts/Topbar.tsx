// src/layouts/Topbar.tsx
import { Menu, Bell, Settings, Search, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useInventorySocket } from "@/hooks/socket/useInventorySocket";

interface TopbarProps {
  onMenuClick: () => void;
}

export const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { theme, setTheme } = useTheme();

  // Connect to our centralized socket hook for real-time status
  const { isConnected } = useInventorySocket();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
      {/* LEFT SECTION: Mobile Menu & Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 lg:hidden text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          aria-label="Open Menu"
        >
          <Menu size={20} />
        </button>

        {/* Search Bar - Hidden on extra small mobile, scales on md */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus-within:border-blue-500 rounded-xl transition-all w-48 md:w-64">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search inventory..."
            className="bg-transparent text-xs outline-none w-full text-slate-800 dark:text-slate-200 placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* RIGHT SECTION: Status, Theme, & Notifications */}
      <div className="flex items-center gap-3">
        {/* Real-time Socket Status Badge */}
        <div
          className={`flex items-center gap-2 px-2.5 py-1 rounded-full border transition-all
          ${
            isConnected
              ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20"
              : "bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20"
          }
        `}
        >
          <span className="relative flex h-2 w-2">
            {isConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? "bg-emerald-500" : "bg-rose-500"}`}
            ></span>
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${isConnected ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}
          >
            {isConnected ? "Live" : "Offline"}
          </span>
        </div>

        {/* 3-Way Theme Toggle: Segmented Control */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setTheme("light")}
            className={`p-1.5 rounded-lg transition-all ${theme === "light" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
            title="Light Mode"
          >
            <Sun size={14} />
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`p-1.5 rounded-lg transition-all ${theme === "dark" ? "bg-slate-800 text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
            title="Dark Mode"
          >
            <Moon size={14} />
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`p-1.5 rounded-lg transition-all ${theme === "system" ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
            title="System Theme"
          >
            <Monitor size={14} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block" />

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button className="relative p-2 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white dark:border-slate-950 rounded-full" />
          </button>

          <button className="p-2 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group">
            <Settings
              size={20}
              className="group-hover:rotate-90 transition-transform duration-500"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
