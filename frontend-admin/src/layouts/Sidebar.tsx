// src/layouts/Sidebar.tsx
import { LayoutDashboard, Package, ChevronLeft, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Inventory", href: "/inventory", icon: Package },
  ];

  return (
    <>
      {/* Mobile Overlay - Only shows when sidebar is forced open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
          <div
            className={`flex items-center gap-3 overflow-hidden transition-all ${isOpen ? "opacity-100 ml-2" : "opacity-0 w-0"}`}
          >
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200 whitespace-nowrap">
              SCM ADMIN
            </span>
          </div>

          {/* Toggle/Close Button (Desktop & Mobile) */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`
                  group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                  }
                `}
              >
                <item.icon
                  size={20}
                  className={`shrink-0 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "group-hover:scale-110 transition-transform"}`}
                />

                <span
                  className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 lg:hidden"}`}
                >
                  {item.name}
                </span>

                {/* Tooltip for collapsed state */}
                {!isOpen && (
                  <div className="absolute left-14 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-xs py-1 px-2 rounded md:block hidden whitespace-nowrap z-[60]">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Optional: User Profile Section at Bottom */}
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
            <div
              className={`transition-opacity ${isOpen ? "opacity-100" : "opacity-0 lg:hidden"}`}
            >
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                John Doe
              </p>
              <p className="text-[10px] text-slate-500">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
