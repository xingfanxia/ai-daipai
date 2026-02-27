"use client";

import { useUpload } from "@/hooks/use-upload";
import { useCreationStore } from "@/stores/creation-store";
import { UploadZone } from "./upload-zone";
import type { UploadSlot } from "@/types/upload";

type SlotDef = {
  slot: UploadSlot;
  label: string;
  sublabel: string;
  required: boolean;
};

const faceSlots: SlotDef[] = [
  {
    slot: "headshot",
    label: "正面照 Headshot",
    sublabel: "Clear front-facing photo",
    required: true,
  },
  {
    slot: "headshot2",
    label: "侧面照 Side angle",
    sublabel: "Different angle (recommended)",
    required: false,
  },
  {
    slot: "headshot3",
    label: "其他角度 Another angle",
    sublabel: "More angles = better results",
    required: false,
  },
];

const bodySlots: SlotDef[] = [
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

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium mb-2">Face references 面部参考</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {faceSlots.map(({ slot, label, sublabel, required }) => (
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
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Body references 身材参考</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {bodySlots.map(({ slot, label, sublabel, required }) => (
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
        </div>
      </div>

      <div className="rounded-lg border border-amber-200/50 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20 p-3 text-xs text-muted-foreground">
        <p className="font-medium text-amber-700 dark:text-amber-400 mb-1">Tips for best results</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Multiple angles of the same person help AI preserve your features more accurately</li>
          <li>Use recent, natural photos — heavily filtered or edited photos may lead to unexpected results</li>
          <li>Make sure all photos are of the same person with consistent appearance</li>
        </ul>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        <span className="text-destructive">*</span> Headshot is required. More
        reference photos improve quality.
      </p>
    </div>
  );
}
