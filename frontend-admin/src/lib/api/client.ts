// src/lib/api/client.ts
// ─────────────────────────────────────────────────────────────────────────────
// CENTRALIZED API CLIENT
// Change VITE_API_BASE_URL in .env → ALL API calls update automatically.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(
  method: RequestMethod,
  path: string,
  body?: unknown,
  requiresAuth = true,
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (requiresAuth) {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle 401 — try to silently refresh token
  if (res.status === 401 && requiresAuth) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      // Retry original request with new token
      return request<T>(method, path, body, requiresAuth);
    } else {
      // Refresh failed → force logout
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/auth/login";
      return { success: false, error: "Session expired" } as ApiResponse<T>;
    }
  }

  const data: ApiResponse<T> = await res.json();
  return data;
}

// ── Silent token refresh ──────────────────────────────────────────────────────
async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/api/v1/admin/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    const data: ApiResponse<{ access_token: string; refresh_token: string }> =
      await res.json();

    if (data.success && data.data) {
      localStorage.setItem("access_token", data.data.access_token);
      localStorage.setItem("refresh_token", data.data.refresh_token);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ── Public HTTP methods (exported for use in service files) ───────────────────
export const apiClient = {
  get:    <T>(path: string) => request<T>("GET", path),
  post:   <T>(path: string, body: unknown) => request<T>("POST", path, body),
  put:    <T>(path: string, body: unknown) => request<T>("PUT", path, body),
  patch:  <T>(path: string, body: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
  // Public (no auth token)
  publicPost: <T>(path: string, body: unknown) =>
    request<T>("POST", path, body, false),
};
