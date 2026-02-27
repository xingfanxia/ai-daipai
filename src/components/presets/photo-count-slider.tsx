"use client";

import { useCreationStore } from "@/stores/creation-store";
import { Slider } from "@/components/ui/slider";

export function PhotoCountSlider() {
  const photoCount = useCreationStore((s) => s.photoCount);
  const setPhotoCount = useCreationStore((s) => s.setPhotoCount);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          生成数量: {photoCount} 张
        </span>
        <span className="text-xs text-muted-foreground">1-8</span>
      </div>
      <Slider
        value={[photoCount]}
        onValueChange={([value]) => setPhotoCount(value)}
        min={1}
        max={8}
        step={1}
      />
    </div>
  );
}
