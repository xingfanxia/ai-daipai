"use client";

import { useCreationStore } from "@/stores/creation-store";
import { PRESET_PACKAGES } from "@/lib/presets/packages";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PackageCheck } from "lucide-react";

export function PackageGrid() {
  const applyPackage = useCreationStore((s) => s.applyPackage);
  const scene = useCreationStore((s) => s.scene);
  const style = useCreationStore((s) => s.style);
  const outfit = useCreationStore((s) => s.outfit);
  const mood = useCreationStore((s) => s.mood);

  const isSelected = (pkg: (typeof PRESET_PACKAGES)[number]) =>
    scene?.type === "preset" &&
    scene.presetId === pkg.sceneId &&
    style === pkg.styleId &&
    outfit === pkg.outfitId &&
    mood === pkg.moodId;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {PRESET_PACKAGES.map((pkg) => {
        const selected = isSelected(pkg);
        return (
          <Card
            key={pkg.id}
            role="button"
            tabIndex={0}
            onClick={() =>
              applyPackage(pkg.sceneId, pkg.styleId, pkg.outfitId, pkg.moodId)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                applyPackage(pkg.sceneId, pkg.styleId, pkg.outfitId, pkg.moodId);
            }}
            className={cn(
              "cursor-pointer py-4 transition-all hover:shadow-md",
              selected && "ring-2 ring-primary"
            )}
          >
            <CardContent className="flex flex-col gap-1.5 px-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold leading-tight">{pkg.labelZh}</p>
                  <p className="text-xs text-muted-foreground">{pkg.label}</p>
                </div>
                {selected && (
                  <PackageCheck className="size-4 shrink-0 text-primary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{pkg.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
