// src/lib/api/auth.api.ts
// ─────────────────────────────────────────────────────────────────────────────
// AUTH API SERVICE LAYER
// All auth HTTP calls live here. Components/hooks never call fetch directly.
// ─────────────────────────────────────────────────────────────────────────────
import { apiClient } from "./client";
import type { AdminInfo } from "@/types/auth";

const AUTH_BASE = "/api/v1/admin/auth";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  access_token: string;
  refresh_token: string;
  admin: AdminInfo;
}

export interface InviteAdminPayload {
  name: string;
  email: string;
  role: "admin" | "super_admin";
}

export interface AcceptInvitePayload {
  token: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export const authApi = {
  /** POST /admin/auth/login */
  login: (payload: LoginPayload) =>
    apiClient.publicPost<AuthTokenResponse>(`${AUTH_BASE}/login`, payload),

  /** POST /admin/auth/accept-invite — public, token is the auth */
  acceptInvite: (payload: AcceptInvitePayload) =>
    apiClient.publicPost<AuthTokenResponse>(`${AUTH_BASE}/accept-invite`, payload),

  /** POST /admin/auth/forgot-password */
  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiClient.publicPost<null>(`${AUTH_BASE}/forgot-password`, payload),

  /** POST /admin/auth/reset-password */
  resetPassword: (payload: ResetPasswordPayload) =>
    apiClient.publicPost<null>(`${AUTH_BASE}/reset-password`, payload),

  /** POST /admin/auth/invite — requires super_admin JWT */
  inviteAdmin: (payload: InviteAdminPayload) =>
    apiClient.post<null>(`${AUTH_BASE}/invite`, payload),

  /** POST /admin/auth/refresh */
  refresh: (refreshToken: string) =>
    apiClient.publicPost<AuthTokenResponse>(`${AUTH_BASE}/refresh`, {
      refresh_token: refreshToken,
    }),
};
