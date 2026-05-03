// src/types/tax.ts

export interface CalculateTaxRequest {
  department: string;
  type?: string;
  category: string;
  sub_category?: string;
  selling_price: number;
}

export interface TaxResponse {
  sales_gst: number;
  hsn: string;
}
