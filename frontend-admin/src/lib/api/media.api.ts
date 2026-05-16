// src/lib/api/media.api.ts
import { apiClient } from "./client";
import type { UploadMediaRequest, MediaResponse } from "@/types/media";

export const mediaApi = {
  /**
   * 📤 UPLOAD MEDIA
   * Uses FormData for multipart/form-data upload
   */
  upload: async (payload: UploadMediaRequest) => {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("department", payload.department);
    formData.append("type", payload.type);
    formData.append("category", payload.category);
    formData.append("product_name", payload.product_name);
    
    if (payload.gender) formData.append("gender", payload.gender);
    if (payload.context) formData.append("context", payload.context);

    return apiClient.post<MediaResponse>("/admin/media/upload", formData);
  },

  /**
   * 🗑️ DELETE MEDIA
   */
  delete: (id: string) => 
    apiClient.delete(`/admin/media/${id}`),
};
