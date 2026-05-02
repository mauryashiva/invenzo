// src/providers/AuthProvider.tsx
// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL AUTH STATE — wraps the entire app.
// Uses useReducer for predictable state transitions.
// ─────────────────────────────────────────────────────────────────────────────
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthState, AuthAction, AdminInfo } from "@/types/auth";

// ── Reducer ───────────────────────────────────────────────────────────────────
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, admin: action.payload, isAuthenticated: true, isLoading: false };
    case "LOGOUT":
      return { admin: null, isAuthenticated: false, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

const initialState: AuthState = {
  admin: null,
  isAuthenticated: false,
  isLoading: true, // true on boot — we check localStorage before rendering
};

// ── Context ───────────────────────────────────────────────────────────────────
interface AuthContextValue extends AuthState {
  login: (admin: AdminInfo, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Hydrate from localStorage on boot
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const raw = localStorage.getItem("admin_info");

    if (token && raw) {
      try {
        const admin: AdminInfo = JSON.parse(raw);
        dispatch({ type: "LOGIN_SUCCESS", payload: admin });
      } catch {
        dispatch({ type: "LOGOUT" });
      }
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const login = useCallback(
    (admin: AdminInfo, accessToken: string, refreshToken: string) => {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("admin_info", JSON.stringify(admin));
      dispatch({ type: "LOGIN_SUCCESS", payload: admin });
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("admin_info");
    dispatch({ type: "LOGOUT" });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        isSuperAdmin: state.admin?.role === "super_admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook — use this everywhere instead of useContext(AuthContext) directly ─────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
