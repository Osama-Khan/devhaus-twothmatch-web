"use client";

import { useRef } from "react";
import type { ComponentProps } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserAdd01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type OnboardingUploadZoneProps = {
  icon: typeof UserAdd01Icon;
  title: string;
  description: string;
  accept?: string;
  onFilesSelected?: (files: FileList) => void;
  className?: string;
};

/** Muted upload dropzone for onboarding media fields */
export function OnboardingUploadZone({
  icon,
  title,
  description,
  accept = "image/jpeg,image/png",
  onFilesSelected,
  className,
}: OnboardingUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleChange: ComponentProps<"input">["onChange"] = (event) => {
    const files = event.target.files;
    if (files?.length) {
      onFilesSelected?.(files);
    }
    event.target.value = "";
  };

  return (
    <button
      type="button"
      onClick={openFilePicker}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-2 rounded-2xl bg-muted/50 px-4 py-8 text-center transition-colors hover:bg-muted/70",
        className
      )}
    >
      <HugeiconsIcon
        icon={icon}
        strokeWidth={2}
        className="size-8 text-primary"
      />
      <span className="text-sm font-semibold text-foreground">{title}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="sr-only"
        onChange={handleChange}
      />
    </button>
  );
}
