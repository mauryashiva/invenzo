// src/types/media.ts

export interface Media {
  id: string;
  url: string;
  public_id: string;
  file_type: string;
  associated_id?: string;
  created_at: string;
}

export interface UploadMediaRequest {
  file: File;
  department: string;
  type: string;
  category: string;
  product_name: string;
  gender?: string;
  context?: string; // e.g. color name or variant info
}

export interface MediaResponse {
  id: string;
  url: string;
  public_id: string;
  file_type: string;
}
