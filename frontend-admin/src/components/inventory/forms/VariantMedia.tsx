// src/components/inventory/forms/VariantMedia.tsx
import { useRef, useState } from "react";
import { Plus, X, Loader2, Film } from "lucide-react";
import { mediaApi } from "@/lib/api/media.api";
import type { UploadMediaRequest } from "@/types/media";

interface VariantMediaProps {
  mediaIds: string[];
  images: string[];
  onAddMedia: (media: { id: string; url: string }) => void;
  onRemoveMedia: (media: { id: string; url: string }) => void;
  uploadMetadata: Omit<UploadMediaRequest, "file">;
}

interface LocalPreview {
  id: string;
  url: string;
  isUploading: boolean;
  isVideo: boolean;
}

export const VariantMedia = ({
  mediaIds,
  images,
  onAddMedia,
  onRemoveMedia,
  uploadMetadata,
}: VariantMediaProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localPreviews, setLocalPreviews] = useState<LocalPreview[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newLocalPreviews = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      isUploading: true,
      isVideo: file.type.startsWith("video/"),
    }));

    setLocalPreviews((prev) => [...prev, ...newLocalPreviews]);

    files.forEach(async (file, index) => {
      const currentLocalId = newLocalPreviews[index].id;
      try {
        const res = await mediaApi.upload({
          ...uploadMetadata,
          file,
        });

        if (res.success && res.data) {
          onAddMedia({
            id: res.data.id,
            url: res.data.url,
          });
        }
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
      } finally {
        // Note: We don't revoke here because the real image might still be loading
        // A better place is a cleanup effect or after a timeout
        setLocalPreviews((prev) => prev.filter((p) => p.id !== currentLocalId));
      }
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = async (index: number) => {
    const id = mediaIds[index];
    const url = images[index];
    try {
      await mediaApi.delete(id);
      onRemoveMedia({ id, url });
    } catch (error) {
      console.error("Failed to delete media:", error);
    }
  };

  const isVideo = (url: string) => 
    url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes("video/upload");

  return (
    <div className="flex flex-wrap gap-4 pt-2">
      {/* 🖼️ REAL PREVIEWS (After successful upload) */}
      {images.map((url, idx) => (
        <div 
          key={`${url}-${idx}`} 
          className="relative group w-24 h-24 rounded-2xl border-2 border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-900 shadow-sm transition-all hover:border-indigo-500/50"
        >
          {isVideo(url) ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
              <Film size={24} className="text-slate-500 z-10" />
              <video 
                src={url} 
                className="absolute inset-0 w-full h-full object-cover opacity-60"
                muted
                onMouseOver={(e) => (e.currentTarget as HTMLVideoElement).play()}
                onMouseOut={(e) => (e.currentTarget as HTMLVideoElement).pause()}
              />
            </div>
          ) : (
            <img 
              src={url} 
              alt="Product variant" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          )}

          <button
            type="button"
            onClick={() => handleRemove(idx)}
            className="absolute top-1.5 right-1.5 p-1.5 bg-rose-500 text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20"
          >
            <X size={12} />
          </button>
        </div>
      ))}

      {/* 🔄 LOCAL LOADING PREVIEWS (Instant feedback) */}
      {localPreviews.map((preview) => (
        <div key={preview.id} className="relative w-24 h-24 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/50 overflow-hidden bg-slate-50 dark:bg-slate-900 shadow-inner">
           {preview.isVideo ? (
             <div className="w-full h-full flex items-center justify-center">
               <Film size={20} className="text-indigo-300 animate-pulse" />
             </div>
           ) : (
             <img src={preview.url} className="w-full h-full object-cover blur-[2px] opacity-40" />
           )}
           <div className="absolute inset-0 flex items-center justify-center bg-indigo-500/5">
              <Loader2 size={24} className="animate-spin text-indigo-600" />
           </div>
        </div>
      ))}

      {/* ➕ ADD MEDIA BUTTON */}
      <div className="relative">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept="image/*,video/*"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50/10 transition-all group active:scale-95"
        >
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
            <Plus size={20} />
          </div>
          <span className="text-[9px] font-black mt-2 uppercase tracking-widest">Add Media</span>
        </button>
      </div>
    </div>
  );
};