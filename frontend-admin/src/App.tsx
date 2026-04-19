// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/pages/layout";
// Import your real Inventory Page
import InventoryPage from "@/pages/inventory/index";

// Simple placeholder for Dashboard (we can build this later)
const Dashboard = () => (
  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
    Dashboard Overview Content
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<Dashboard />} />

          {/* USE THE REAL COMPONENT HERE */}
          <Route path="/inventory" element={<InventoryPage />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
