"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { generateAboutStream } from "@/features/profile/services/profile-ai-service";

type UseGenerateAboutArgs = {
  onAboutChange: (value: string) => void;
  disabled?: boolean;
};

type UseGenerateAboutResult = {
  canGenerate: boolean;
  isGenerating: boolean;
  generate: () => void;
};

/**
 * Streams AI-generated practice about text into the onboarding form.
 * Does not persist — caller must save via PUT `/profile`.
 */
export function useGenerateAbout({
  onAboutChange,
  disabled = false,
}: UseGenerateAboutArgs): UseGenerateAboutResult {
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const accumulatedRef = useRef("");

  const canGenerate = !disabled && !isGenerating;

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const generate = () => {
    if (disabled || isGenerating) {
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    accumulatedRef.current = "";
    setIsGenerating(true);
    onAboutChange("");

    void generateAboutStream(
      {
        onDelta: (text) => {
          accumulatedRef.current += text;
          onAboutChange(accumulatedRef.current);
        },
        onDone: (finalText) => {
          onAboutChange(finalText);
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
