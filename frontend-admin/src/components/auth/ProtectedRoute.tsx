// src/components/auth/ProtectedRoute.tsx
// ─────────────────────────────────────────────────────────────────────────────
// PROTECTED ROUTE WRAPPER
// Ensures only authenticated users can access the wrapped routes.
// ─────────────────────────────────────────────────────────────────────────────
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Loader2 } from "lucide-react";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, saving the attempted URL so we can return them after login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Render child routes
  return <Outlet />;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUPER ADMIN ONLY ROUTE
// For pages like "Manage Admins"
// ─────────────────────────────────────────────────────────────────────────────
export function SuperAdminRoute() {
  const { isAuthenticated, isLoading, isSuperAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
