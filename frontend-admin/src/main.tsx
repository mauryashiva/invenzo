// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // This will now work because of 'export default'
import "@/index.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
