// src/types/auth.ts
// Centralized auth types — used by context, hooks, pages, and API layer.
export interface AdminInfo {
  id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
}

export interface AuthState {
  admin: AdminInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: AdminInfo }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };
