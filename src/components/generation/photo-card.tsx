"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, AlertCircle } from "lucide-react";
import type { GenerationResult } from "@/types/generation";

interface PhotoCardProps {
  result?: GenerationResult;
  index: number;
}

export function PhotoCard({ result, index }: PhotoCardProps) {
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
          Photo {index + 1} failed
        </p>
        <p className="text-center text-[10px] text-muted-foreground">
          {result.error}
        </p>
      </div>
    );
  }

  // Success state
  return (
    <div className="group overflow-hidden rounded-xl border">
      <div className="relative aspect-[3/4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={result.previewUrl}
          alt={`Generated photo ${index + 1}`}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/40 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="secondary"
            size="icon-xs"
            asChild
          >
            <a
              href={`/api/images/${result.imageId}?download=true`}
              download
            >
              <Download className="size-3" />
            </a>
          </Button>
        </div>
      </div>
      <div className="p-2">
        <p className="text-xs text-muted-foreground">Photo {index + 1}</p>
      </div>
    </div>
  );
}
