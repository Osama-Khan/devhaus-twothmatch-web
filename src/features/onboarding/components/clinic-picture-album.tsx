"use client";

import { useEffect, useRef, useState } from "react";
import {
  Add01Icon,
  Cancel01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { OnboardingUploadZone } from "@/features/onboarding/components/onboarding-upload-zone";
import { cn } from "@/lib/utils";

const CLINIC_PICTURE_TILE_CLASS = "size-20 shrink-0 rounded-xl";

type ClinicPictureAlbumProps = {
  files: File[];
  onFilesSelected: (files: FileList) => void;
  onRemove: (index: number) => void;
  className?: string;
};

/** Clinic photo picker — full dropzone when empty, compact album row when photos exist */
export function ClinicPictureAlbum({
  files,
  onFilesSelected,
  onRemove,
  className,
}: ClinicPictureAlbumProps) {
  const addInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleAddMoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files;
    if (selected?.length) {
      onFilesSelected(selected);
    }
    event.target.value = "";
  };

  if (files.length === 0) {
    return (
      <OnboardingUploadZone
        className={className}
        icon={UserAdd01Icon}
        title="Add Pictures of Clinic"
        description="Max file size 10MB (.jpeg or .png only)"
        onFilesSelected={onFilesSelected}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto overflow-y-visible py-2 -mx-6",
        className
      )}
    >
      <div className="w-4 shrink-0"></div>
      {files.map((file, index) => (
        <div
          key={`${file.name}-${file.lastModified}-${index}`}
          className="relative shrink-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- blob preview URLs */}
          <img
            src={previewUrls[index]}
            alt={file.name}
            className={cn(
              CLINIC_PICTURE_TILE_CLASS,
              "border border-border object-cover"
            )}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon-xs"
            aria-label={`Remove ${file.name}`}
            className="absolute -top-1.5 -right-1.5 shadow-sm"
            onClick={() => onRemove(index)}
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
          </Button>
        </div>
      ))}

      <input
        ref={addInputRef}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        className="sr-only"
        onChange={handleAddMoreChange}
      />
      <button
        type="button"
        aria-label="Add more clinic pictures"
        onClick={() => addInputRef.current?.click()}
        className={cn(
          CLINIC_PICTURE_TILE_CLASS,
          "flex items-center justify-center bg-muted/50 transition-colors hover:bg-muted/70"
        )}
      >
        <HugeiconsIcon
          icon={Add01Icon}
          strokeWidth={2}
          className="size-6 text-primary"
        />
      </button>
      <div className="w-4 shrink-0"></div>
    </div>
  );
}
