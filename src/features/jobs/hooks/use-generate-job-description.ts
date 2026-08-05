"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { generateJobDescriptionStream } from "@/features/jobs/services/jobs-ai-service";

type UseGenerateJobDescriptionArgs = {
  /** Draft job id from the first step save — required for generate-jd */
  jobId: string | null | undefined;
  onJobDescriptionChange: (value: string) => void;
  disabled?: boolean;
};

type UseGenerateJobDescriptionResult = {
  canGenerate: boolean;
  isGenerating: boolean;
  generate: () => void;
};

/**
 * Streams AI-generated job description into the form field.
 * Sends only `{ id }` — the server reads the saved draft.
 */
export function useGenerateJobDescription({
  jobId,
  onJobDescriptionChange,
  disabled = false,
}: UseGenerateJobDescriptionArgs): UseGenerateJobDescriptionResult {
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const accumulatedRef = useRef("");

  const canGenerate = !disabled && !isGenerating && Boolean(jobId);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const generate = () => {
    if (disabled || isGenerating || !jobId) {
      if (!jobId) {
        toast.error("Save the draft before generating a description");
      }
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    accumulatedRef.current = "";
    setIsGenerating(true);
    onJobDescriptionChange("");

    void generateJobDescriptionStream(
      { id: jobId },
      {
        onDelta: (text) => {
          accumulatedRef.current += text;
          onJobDescriptionChange(accumulatedRef.current);
        },
        onDone: (finalDescription) => {
          onJobDescriptionChange(finalDescription);
          setIsGenerating(false);
        },
        onError: (message) => {
          setIsGenerating(false);
          toast.error(message);
        },
      },
      { signal: controller.signal }
    ).finally(() => {
      if (abortRef.current === controller) {
        setIsGenerating(false);
        abortRef.current = null;
      }
    });
  };

  return { canGenerate, isGenerating, generate };
}
