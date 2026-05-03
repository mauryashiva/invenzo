// src/lib/api/tax.api.ts
import { apiClient } from "./client";
import type { CalculateTaxRequest, TaxResponse } from "@/types/tax";

export const taxApi = {
  calculate: (payload: CalculateTaxRequest) =>
    apiClient.post<TaxResponse>("/admin/tax/calculate", payload),
};
