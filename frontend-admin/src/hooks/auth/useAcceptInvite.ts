// src/hooks/auth/useAcceptInvite.ts
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "@/lib/api/auth.api";
import { useAuth } from "@/providers/AuthProvider";

export function useAcceptInvite() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const token = searchParams.get("token") ?? "";

  const handleAccept = async (password: string) => {
    if (!token) {
      setError("Invalid invitation link. Please request a new one.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.acceptInvite({ token, password });
      if (res.success && res.data) {
        login(res.data.admin, res.data.access_token, res.data.refresh_token);
        setSuccess(true);
        setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
      } else {
        setError(res.error ?? "Failed to activate account.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleAccept, token, isLoading, error, success };
}
