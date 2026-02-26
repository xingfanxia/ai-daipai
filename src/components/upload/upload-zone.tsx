"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UploadedImage } from "@/types/upload";

interface UploadZoneProps {
  label: string;
  sublabel: string;
  required?: boolean;
  image: UploadedImage | undefined;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export function UploadZone({
  label,
  sublabel,
  required,
  image,
  isUploading,
  onUpload,
  onRemove,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onUpload(file);
      }
    },
    [onUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onUpload(file);
      }
      // Reset input so same file can be re-selected
      e.target.value = "";
    },
    [onUpload]
  );

  if (image) {
    return (
      <div className="group relative aspect-[3/4] overflow-hidden rounded-xl border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.previewUrl}
          alt={label}
          className="size-full object-cover"
        />
        <Button
          variant="destructive"
          size="icon-xs"
          className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={onRemove}
        >
          <X className="size-3" />
        </Button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <p className="text-xs font-medium text-white">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "flex aspect-[3/4] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors",
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
      )}
    >
      {isUploading ? (
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      ) : (
        <>
          <Upload className="size-8 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">
              {label}
              {required && (
                <span className="ml-1 text-destructive">*</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">{sublabel}</p>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Drag & drop or click
          </p>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
