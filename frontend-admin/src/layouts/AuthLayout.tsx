// src/layouts/AuthLayout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// AUTH LAYOUT
// Shared layout for Login, Forgot Password, Reset Password, and Accept Invite.
// Provides a clean, modern, centered card interface.
// ─────────────────────────────────────────────────────────────────────────────
import { Outlet } from "react-router-dom";
import { PackageSearch } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center">
          <div className="bg-indigo-600/10 dark:bg-indigo-500/20 p-3 rounded-xl mb-4">
            <PackageSearch className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Invenzo
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
            Enterprise Supply Chain Management
          </p>
        </div>

        {/* Page Content (Login, Reset, etc.) */}
        <Outlet />
        
      </div>
    </div>
  );
}
