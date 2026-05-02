// src/hooks/auth/useResetPassword.ts
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "@/lib/api/auth.api";

export function useResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const token = searchParams.get("token") ?? "";

  const handleReset = async (password: string) => {
    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.resetPassword({ token, password });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate("/auth/login", { replace: true }), 2000);
      } else {
        setError(res.error ?? "Reset failed. The link may have expired.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleReset, token, isLoading, error, success };
}
