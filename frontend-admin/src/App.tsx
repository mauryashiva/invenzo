// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Layouts
import Layout from "@/pages/layout";
import { AuthLayout } from "@/layouts/AuthLayout";

// Auth Pages
import LoginPage from "@/pages/auth/login";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import ResetPasswordPage from "@/pages/auth/reset-password";
import AcceptInvitePage from "@/pages/auth/accept-invite";

// App Pages
import InventoryPage from "@/pages/inventory/index";

// Simple placeholder for Dashboard
const Dashboard = () => (
  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
    Dashboard Overview Content
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── PUBLIC AUTH ROUTES ── */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/accept-invite" element={<AcceptInvitePage />} />
          </Route>

          {/* ── PROTECTED ADMIN ROUTES ── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<InventoryPage />} />
              {/* Catch-all redirect to dashboard for authenticated users */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
