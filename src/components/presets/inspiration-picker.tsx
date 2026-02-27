"use client";

import { useCallback, useState } from "react";
import { useCreationStore } from "@/stores/creation-store";
import { useUpload } from "@/hooks/use-upload";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Lightbulb, Upload, X, Loader2 } from "lucide-react";

export function InspirationPicker() {
  const inspirationImage = useCreationStore((s) => s.inspirationImage);
  const setInspirationImage = useCreationStore((s) => s.setInspirationImage);
  const { uploadFile, isUploading } = useUpload();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleUpload = useCallback(
    async (file: File) => {
      const result = await uploadFile(file, "inspiration");
      if (result) {
        setInspirationImage(result);
      }
    },
    [uploadFile, setInspirationImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleUpload(file);
      }
    },
    [handleUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="size-4 text-amber-500" />
        <p className="text-sm text-muted-foreground">
          上传一张你喜欢的照片，AI会"抄作业" — 复刻同款风格、构图、氛围
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {inspirationImage && (
          <div className="group relative size-24 overflow-hidden rounded-lg border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={inspirationImage.previewUrl}
              alt="Inspiration"
              className="size-full object-cover"
            />
            <Button
              variant="destructive"
              size="icon-xs"
              className="absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setInspirationImage(null)}
            >
              <X className="size-3" />
            </Button>
          </div>
        )}

        {!inspirationImage && (
          <label
            className={cn(
              "flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors",
              isDragOver
                ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20"
                : "border-amber-400/30 hover:border-amber-500/60",
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {isUploading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="size-5 text-muted-foreground" />
            )}
            <span className="text-[10px] text-muted-foreground">
              {isUploading ? "上传中..." : "拖拽或点击"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>

      {inspirationImage && (
        <p className="text-xs text-muted-foreground">
          AI 将参考灵感图的构图、色调、光线和氛围，风格/场景等设置可跳过或用于微调
        </p>
      )}
    </div>
  );
}
