// src/lib/finance-utils.ts
import type { FinanceResult } from "@/types/finance";

export const calculateFinance = (
  baseCost: number,
  sellingPrice: number,
  purchaseGst: number,
  salesGst: number,
): FinanceResult => {
  const purchaseTaxAmount = (baseCost * purchaseGst) / 100;
  const purchaseTotal = baseCost + purchaseTaxAmount;

  const sellingTaxAmount = (sellingPrice * salesGst) / 100;
  const sellingTotal = sellingPrice + sellingTaxAmount;

  const netMargin = sellingPrice - baseCost;
  const marginPercentage = baseCost > 0 ? (netMargin / baseCost) * 100 : 0;

  // Tax Liability: (Tax collected from customer) - (Tax already paid to supplier)
  const taxLiability = sellingTaxAmount - purchaseTaxAmount;

  return {
    purchaseTaxAmount,
    purchaseTotal,
    sellingTaxAmount,
    sellingTotal,
    netMargin,
    marginPercentage,
    taxLiability,
  };
};
