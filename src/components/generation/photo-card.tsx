"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, AlertCircle, X } from "lucide-react";
import type { GenerationResult } from "@/types/generation";

interface PhotoCardProps {
  result?: GenerationResult;
  index: number;
}

export function PhotoCard({ result, index }: PhotoCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Skeleton / generating state
  if (!result) {
    return (
      <div className="overflow-hidden rounded-xl border">
        <Skeleton className="aspect-[3/4] w-full animate-pulse" />
        <div className="p-2">
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    );
  }

  // Failed state
  if (result.status === "failed") {
    return (
      <div className="flex aspect-[3/4] flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border bg-destructive/5 p-4">
        <AlertCircle className="size-8 text-destructive" />
        <p className="text-center text-xs text-destructive">
          第 {index + 1} 张生成失败
        </p>
        <p className="text-center text-[10px] text-muted-foreground">
          {result.error}
        </p>
      </div>
    );
  }

  // Success state
  return (
    <>
      <div className="group overflow-hidden rounded-xl border">
        <div
          className="relative aspect-[3/4] cursor-pointer"
          onClick={() => setLightboxOpen(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.previewUrl}
            alt={`写真 ${index + 1}`}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/40 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="text-[10px] text-white/80">点击查看大图</span>
            <Button
              variant="secondary"
              size="sm"
              className="size-7"
              onClick={(e) => {
                e.stopPropagation();
              }}
              asChild
            >
              <a href={result.previewUrl} download={`ai-daipai-${index + 1}.png`}>
                <Download className="size-3" />
              </a>
            </Button>
          </div>
        </div>
        <div className="p-2">
          <p className="text-xs text-muted-foreground">写真 {index + 1}</p>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4 text-white hover:bg-white/20"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="size-5" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-6 right-6"
            onClick={(e) => e.stopPropagation()}
            asChild
          >
            <a href={result.previewUrl} download={`ai-daipai-${index + 1}.png`}>
              <Download className="size-4 mr-1" />
              下载
            </a>
          </Button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.previewUrl}
            alt={`写真 ${index + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
