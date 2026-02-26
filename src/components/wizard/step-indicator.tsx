"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = [
  { number: 1, label: "Upload", labelZh: "上传" },
  { number: 2, label: "Customize", labelZh: "自定义" },
  { number: 3, label: "Generate", labelZh: "生成" },
] as const;

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isActive = currentStep === step.number;
        const isUpcoming = currentStep < step.number;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              {/* Circle */}
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  isCompleted && "bg-primary text-primary-foreground",
                  isActive && "ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary text-primary-foreground",
                  isUpcoming && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="size-4" /> : step.number}
              </div>
              {/* Label */}
              <div className="text-center">
                <p
                  className={cn(
                    "text-xs font-medium",
                    (isActive || isCompleted) ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.labelZh}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {step.label}
                </p>
              </div>
            </div>
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-3 mt-[-1.5rem] h-0.5 w-12 sm:w-20",
                  currentStep > step.number ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
