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
    label: "正面照",
    sublabel: "五官清晰的正面照片",
    required: true,
  },
  {
    slot: "headshot2",
    label: "侧面照",
    sublabel: "不同角度（推荐）",
    required: false,
  },
  {
    slot: "headshot3",
    label: "其他角度",
    sublabel: "角度越多效果越好",
    required: false,
  },
];

const bodySlots: SlotDef[] = [
  {
    slot: "halfbody",
    label: "半身照",
    sublabel: "腰部以上照片（推荐）",
    required: false,
  },
  {
    slot: "fullbody",
    label: "全身照",
    sublabel: "全身照片（可选）",
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
          上传你的照片，AI 会根据这些照片生成写真
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium mb-2">面部参考</p>
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
          <p className="text-sm font-medium mb-2">身材参考</p>
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
        <p className="font-medium text-amber-700 dark:text-amber-400 mb-1">小贴士</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>多角度照片能帮 AI 更准确地还原你的五官和气质</li>
          <li>建议用近期、自然的照片 — 过度 P 图或滤镜太重可能影响生成效果</li>
          <li>请确保所有照片都是同一个人，外貌前后一致</li>
        </ul>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        <span className="text-destructive">*</span> 正面照为必填，参考照片越多效果越好
      </p>
    </div>
  );
}
