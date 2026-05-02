// src/hooks/auth/useForgotPassword.ts
import { useState } from "react";
import { authApi } from "@/lib/api/auth.api";

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleForgot = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.forgotPassword({ email });
      setSent(true); // Always show success — backend doesn't reveal email existence
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleForgot, isLoading, sent, error };
}
