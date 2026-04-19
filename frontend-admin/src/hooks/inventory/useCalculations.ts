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
  return useMemo(
    () => calculateFinance(baseCost, sellingPrice, purchaseGst, salesGst),
    [baseCost, sellingPrice, purchaseGst, salesGst],
  );
}
