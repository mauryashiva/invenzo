// src/lib/api/inventory.api.ts
import { apiClient } from "./client";
import type { InventoryProduct } from "@/types/inventory";

export const inventoryApi = {
  /**
   * 🏗️ CREATE PRODUCT
   * Handles transactional creation with variants and media
   */
  create: async (payload: InventoryProduct) => {
    // Transform camelCase to snake_case for backend compatibility
    const body = {
      brand_id: payload.brandId,
      name: payload.name,
      model_number: payload.modelNumber,
      style_code: payload.styleCode,
      category_id: payload.categoryId,
      fashion_type: payload.fashionType,
      gender: payload.gender,
      category: payload.category,
      purchase_gst: payload.purchaseGst,
      sales_gst: payload.salesGst,
      warranty: payload.warranty,
      specs: payload.specs,
      features: payload.features,
      selected_sizes: payload.selectedSizes,
      size_guide_data: payload.sizeGuideData,
      occasion: payload.occasion,
      season: payload.season,
      fabric: payload.fabric,
      care_instructions: payload.careInstructions,
      description: payload.description,
      media_ids: payload.media_ids,
      variants: payload.variants.map(v => ({
        sku: v.sku,
        color: v.color,
        color_name: v.colorName,
        attributes: v.attributes,
        base_cost: v.baseCost,
        selling_price: v.sellingPrice,
        reorder_level: v.reorderLevel,
        media_ids: v.media_ids,
        images: v.images
      }))
    };

    return apiClient.post<{ id: string }>("/admin/products", body);
  },

  /**
   * 🔍 GET PRODUCT BY ID
   */
  getById: (id: string) => 
    apiClient.get<InventoryProduct>(`/admin/products/${id}`),

  /**
   * 📜 LIST PRODUCTS
   */
  list: (params?: any) => 
    apiClient.get<InventoryProduct[]>("/admin/products", { params }),

  /**
   * 🗑️ DELETE PRODUCT
   */
  delete: (id: string) => 
    apiClient.delete(`/admin/products/${id}`),
};
