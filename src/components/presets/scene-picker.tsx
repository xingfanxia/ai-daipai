"use client";

import { useState, useCallback } from "react";
import { useCreationStore } from "@/stores/creation-store";
import { useUpload } from "@/hooks/use-upload";
import { SCENE_PRESETS, SCENE_CATEGORIES } from "@/lib/presets/scenes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Camera, Check, Upload, X } from "lucide-react";
import type { UploadedImage } from "@/types/upload";

export function ScenePicker() {
  const scene = useCreationStore((s) => s.scene);
  const setScene = useCreationStore((s) => s.setScene);
  const { uploadFile, isUploading } = useUpload();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [customMode, setCustomMode] = useState(
    scene?.type === "custom"
  );
  const [customImages, setCustomImages] = useState<UploadedImage[]>(
    scene?.type === "custom" ? scene.images : []
  );
  const [customDescription, setCustomDescription] = useState(
    scene?.type === "custom" ? scene.description ?? "" : ""
  );

  const filteredScenes =
    activeCategory === "all"
      ? SCENE_PRESETS
      : SCENE_PRESETS.filter((s) => s.category === activeCategory);

  const handlePresetSelect = useCallback(
    (presetId: string) => {
      setCustomMode(false);
      setScene({ type: "preset", presetId });
    },
    [setScene]
  );

  const handleCustomModeToggle = useCallback(() => {
    setCustomMode(true);
    if (customImages.length > 0) {
      setScene({
        type: "custom",
        images: customImages,
        description: customDescription || undefined,
      });
    }
  }, [customImages, customDescription, setScene]);

  const handleCustomUpload = useCallback(
    async (file: File) => {
      const result = await uploadFile(file, "scene");
      if (result) {
        const updated = [...customImages, result];
        setCustomImages(updated);
        setScene({
          type: "custom",
          images: updated,
          description: customDescription || undefined,
        });
      }
    },
    [uploadFile, customImages, customDescription, setScene]
  );

  const handleRemoveCustomImage = useCallback(
    (index: number) => {
      const updated = customImages.filter((_, i) => i !== index);
      setCustomImages(updated);
      if (updated.length > 0) {
        setScene({
          type: "custom",
          images: updated,
          description: customDescription || undefined,
        });
      }
    },
    [customImages, customDescription, setScene]
  );

  const handleDescriptionChange = useCallback(
    (value: string) => {
      setCustomDescription(value);
      if (customImages.length > 0) {
        setScene({
          type: "custom",
          images: customImages,
          description: value || undefined,
        });
      }
    },
    [customImages, setScene]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={activeCategory === "all" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setActiveCategory("all")}
        >
          全部
        </Badge>
        {SCENE_CATEGORIES.map((cat) => (
          <Badge
            key={cat.id}
            variant={activeCategory === cat.id ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.labelZh}
          </Badge>
        ))}
      </div>

      {/* Scene grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {/* Custom upload card — always first */}
        <Card
          role="button"
          tabIndex={0}
          onClick={handleCustomModeToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleCustomModeToggle();
          }}
          className={cn(
            "cursor-pointer py-4 transition-all hover:shadow-md",
            customMode && "ring-2 ring-primary"
          )}
        >
          <CardContent className="flex flex-col items-center justify-center gap-2 px-3 py-2">
            <Camera className="size-8 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">上传场景</p>
              <p className="text-[10px] text-muted-foreground">自定义场景</p>
            </div>
          </CardContent>
        </Card>

        {/* Preset cards */}
        {filteredScenes.map((preset) => {
          const selected =
            !customMode &&
            scene?.type === "preset" &&
            scene.presetId === preset.id;
          return (
            <Card
              key={preset.id}
              role="button"
              tabIndex={0}
              onClick={() => handlePresetSelect(preset.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  handlePresetSelect(preset.id);
              }}
              className={cn(
                "cursor-pointer py-4 transition-all hover:shadow-md",
                selected && "ring-2 ring-primary"
              )}
            >
              <CardContent className="flex flex-col gap-1.5 px-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium leading-tight">
                      {preset.labelZh}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {preset.label}
                    </p>
                  </div>
                  {selected && (
                    <Check className="size-4 shrink-0 text-primary" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Custom upload expanded area */}
      {customMode && (
        <div className="rounded-xl border bg-muted/30 p-4">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium">
              上传自定义场景照片（最多 2 张）
            </p>

            <div className="flex gap-3">
              {customImages.map((img, i) => (
                <div
                  key={img.id}
                  className="group relative size-24 overflow-hidden rounded-lg border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.previewUrl}
                    alt={`场景 ${i + 1}`}
                    className="size-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon-xs"
                    className="absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => handleRemoveCustomImage(i)}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              ))}

              {customImages.length < 2 && (
                <label className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-primary/50">
                  <Upload className="size-5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    {isUploading ? "上传中..." : "添加照片"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCustomUpload(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>

            <div>
              <label
                htmlFor="scene-description"
                className="mb-1.5 block text-sm text-muted-foreground"
              >
                场景描述（可选）
              </label>
              <input
                id="scene-description"
                type="text"
                value={customDescription}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="例如：阳光明媚的海滩、棕榈树..."
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
