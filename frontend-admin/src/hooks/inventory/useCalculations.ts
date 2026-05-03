// src/hooks/inventory/useCalculations.ts
import { useMemo } from "react";
import { calculateFinance } from "@/lib/finance-utils";
import type { FinanceResult } from "@/types/finance";

export function useCalculations(
  baseCost: number,
  sellingPrice: number,
  purchaseGst: number,
  salesGst: number,
): FinanceResult {
  const pGst = Number(purchaseGst) || 0;
  const sGst = Number(salesGst) || 0;

  return useMemo(
    () => calculateFinance(baseCost, sellingPrice, pGst, sGst),
    [baseCost, sellingPrice, pGst, sGst],
  );
}
