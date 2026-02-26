"use client";

import { useUpload } from "@/hooks/use-upload";
import { useCreationStore } from "@/stores/creation-store";
import { UploadZone } from "./upload-zone";
import type { UploadSlot } from "@/types/upload";

const slots: {
  slot: UploadSlot;
  label: string;
  sublabel: string;
  required: boolean;
}[] = [
  {
    slot: "headshot",
    label: "正面照 Headshot",
    sublabel: "Clear front-facing photo",
    required: true,
  },
  {
    slot: "halfbody",
    label: "半身照 Half-body",
    sublabel: "Waist-up photo (recommended)",
    required: false,
  },
  {
    slot: "fullbody",
    label: "全身照 Full-body",
    sublabel: "Full body photo (optional)",
    required: false,
  },
];

export function UploadStep() {
  const { uploadFile, isUploading } = useUpload();
  const referenceImages = useCreationStore((s) => s.referenceImages);
  const removeReferenceImage = useCreationStore((s) => s.removeReferenceImage);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">上传参考照片</h2>
        <p className="text-sm text-muted-foreground">
          Upload your reference photos for AI generation
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {slots.map(({ slot, label, sublabel, required }) => (
          <UploadZone
            key={slot}
            label={label}
            sublabel={sublabel}
            required={required}
            image={referenceImages[slot]}
            isUploading={isUploading}
            onUpload={(file) => uploadFile(file, slot)}
            onRemove={() => removeReferenceImage(slot)}
          />
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        <span className="text-destructive">*</span> Headshot is required. More
        reference photos improve quality.
      </p>
    </div>
  );
}
