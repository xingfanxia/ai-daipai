"use client";
import { useState, useCallback } from "react";
import type { UploadSlot, UploadedImage } from "@/types/upload";
import { useCreationStore } from "@/stores/creation-store";
import { compressImage } from "@/lib/images/compress-client";

export function useUpload() {
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const addReferenceImage = useCreationStore((s) => s.addReferenceImage);

  const uploadFile = useCallback(
    async (file: File, slot: UploadSlot): Promise<UploadedImage | null> => {
      setUploadingSlot(slot);
      setError(null);

      try {
        if (!file.type.startsWith("image/")) {
          throw new Error("Only image files are allowed");
        }

        // Compress on client before uploading (Vercel 4.5MB body limit)
        const compressed = await compressImage(file);

        const formData = new FormData();
        formData.append("file", compressed);
        formData.append("slot", slot);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Upload failed");
        }

        const data = await response.json();
        const image = data.image as UploadedImage;

        if (slot !== "scene") {
          addReferenceImage(slot, image);
        }

        return image;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setError(msg);
        return null;
      } finally {
        setUploadingSlot(null);
      }
    },
    [addReferenceImage],
  );

  return { uploadFile, uploadingSlot, isUploading: uploadingSlot !== null, error, clearError: () => setError(null) };
}
