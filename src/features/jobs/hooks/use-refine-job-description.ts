"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  REFINE_JD_MAX_CHARS,
  REFINE_JD_MIN_CHARS,
} from "@/features/jobs/constants";
import { refineJobDescriptionStream } from "@/features/jobs/services/jobs-ai-service";

type UseRefineJobDescriptionArgs = {
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  disabled?: boolean;
};

type UseRefineJobDescriptionResult = {
  /** Whether the draft length is within the API refine window */
  canRefine: boolean;
  isRefining: boolean;
  refine: () => void;
};

/**
 * Streams AI-refined job description text into the form field.
 * Replaces the draft with delta accumulation, then the final `done` text.
 */
export function useRefineJobDescription({
  jobDescription,
  onJobDescriptionChange,
  disabled = false,
}: UseRefineJobDescriptionArgs): UseRefineJobDescriptionResult {
  const [isRefining, setIsRefining] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const accumulatedRef = useRef("");

  const length = jobDescription.length;
  const canRefine =
    !disabled &&
    !isRefining &&
    length >= REFINE_JD_MIN_CHARS &&
    length <= REFINE_JD_MAX_CHARS;

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const refine = () => {
    if (
      disabled ||
      isRefining ||
      length < REFINE_JD_MIN_CHARS ||
      length > REFINE_JD_MAX_CHARS
    ) {
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const originalDescription = jobDescription;
    accumulatedRef.current = "";
    setIsRefining(true);

    void refineJobDescriptionStream(
      jobDescription,
      {
        onDelta: (text) => {
          accumulatedRef.current += text;
          onJobDescriptionChange(accumulatedRef.current);
        },
        onDone: (finalDescription) => {
          onJobDescriptionChange(finalDescription);
          setIsRefining(false);
        },
        onError: (message) => {
          onJobDescriptionChange(originalDescription);
          setIsRefining(false);
          toast.error(message);
        },
      },
      { signal: controller.signal }
    ).finally(() => {
      if (abortRef.current === controller) {
        setIsRefining(false);
        abortRef.current = null;
      }
    });
  };

  return { canRefine, isRefining, refine };
}
