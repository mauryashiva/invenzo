// src/types/finance.ts

export interface FinanceResult {
  purchaseTaxAmount: number;
  purchaseTotal: number;
  sellingTaxAmount: number;
  sellingTotal: number;
  netMargin: number;
  marginPercentage: number;
  taxLiability: number;
}

export interface GstRate {
  id: string;
  label: string; // e.g. "Electronics"
  value: number; // e.g. 18
}
