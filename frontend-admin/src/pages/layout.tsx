import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/layouts/Sidebar";
import { Topbar } from "@/layouts/Topbar";

export default function Layout() {
  // Initialize based on screen size for a better First Contentful Paint (FCP)
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      // Automatic behavior: keep open on desktop, hide on mobile/tablet
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 overflow-hidden font-sans">
      {/* SIDEBAR:
          Controlled via sidebarOpen state. 
          The onClose prop now toggles the state for desktop collapse 
          or closes the drawer on mobile.
      */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* MAIN CONTENT WRAPPER:
          Uses transition-all for that smooth "sliding" effect when the sidebar collapses.
          lg:pl-64 (256px) when sidebar is expanded.
          lg:pl-20 (80px) when sidebar is in 'mini' or collapsed mode.
      */}
      <div
        className={`
          flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300 ease-in-out
          ${sidebarOpen ? "lg:pl-64" : "lg:pl-20"}
          w-full
        `}
      >
        {/* Topbar: Toggle button triggers the sidebar state change */}
        <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* MAIN SCROLL AREA:
            Custom dark background to match your Slate 800/200 contrast strategy.
        */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            {/* This renders the Dashboard or Inventory pages. 
                All small text inside these should use text-slate-800 or text-slate-200.
            */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
