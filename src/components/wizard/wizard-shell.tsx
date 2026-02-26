"use client";

import { useCreationStore } from "@/stores/creation-store";
import { StepIndicator } from "./step-indicator";
import { UploadStep } from "@/components/upload/upload-step";
import { CustomizeStep } from "@/components/presets/customize-step";
import { GenerateStep } from "@/components/generation/generate-step";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export function WizardShell() {
  const currentStep = useCreationStore((s) => s.currentStep);
  const setStep = useCreationStore((s) => s.setStep);
  const referenceImages = useCreationStore((s) => s.referenceImages);
  const scene = useCreationStore((s) => s.scene);
  const generationStatus = useCreationStore((s) => s.generationStatus);
  const setGenerationStatus = useCreationStore((s) => s.setGenerationStatus);

  const hasHeadshot = !!referenceImages.headshot;
  const hasScene = !!scene;

  const canProceed =
    (currentStep === 1 && hasHeadshot) ||
    (currentStep === 2 && hasScene);

  const handleBack = () => {
    if (currentStep > 1) {
      // Reset generation state so returning to step 3 starts fresh
      if (currentStep === 3) {
        setGenerationStatus("idle");
      }
      setStep((currentStep - 1) as 1 | 2 | 3);
    }
  };

  const handleNext = () => {
    if (currentStep < 3 && canProceed) {
      // Reset generation state when entering step 3 with new settings
      if (currentStep === 2) {
        setGenerationStatus("idle");
      }
      setStep((currentStep + 1) as 1 | 2 | 3);
    }
  };

  return (
    <div className="flex flex-col gap-8 py-6 sm:py-10">
      <StepIndicator currentStep={currentStep} />

      <div className="min-h-[400px]">
        {currentStep === 1 && <UploadStep />}
        {currentStep === 2 && <CustomizeStep />}
        {currentStep === 3 && <GenerateStep />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t pt-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1 || generationStatus === "generating"}
        >
          <ChevronLeft className="size-4" />
          Back
        </Button>

        {currentStep < 3 ? (
          <Button onClick={handleNext} disabled={!canProceed}>
            {currentStep === 2 ? (
              <>
                Generate
                <Sparkles className="size-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="size-4" />
              </>
            )}
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
