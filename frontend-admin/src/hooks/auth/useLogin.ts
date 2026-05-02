// src/hooks/auth/useLogin.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/lib/api/auth.api";
import { useAuth } from "@/providers/AuthProvider";

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        login(res.data.admin, res.data.access_token, res.data.refresh_token);
        navigate("/dashboard", { replace: true });
      } else {
        setError(res.error ?? "Login failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, error };
}
