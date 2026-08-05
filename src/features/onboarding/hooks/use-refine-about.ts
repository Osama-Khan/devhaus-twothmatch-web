"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  REFINE_ABOUT_MAX_CHARS,
  REFINE_ABOUT_MIN_CHARS,
} from "@/features/onboarding/constants";
import { refineAboutStream } from "@/features/profile/services/profile-ai-service";

type UseRefineAboutArgs = {
  about: string;
  onAboutChange: (value: string) => void;
  disabled?: boolean;
};

type UseRefineAboutResult = {
  canRefine: boolean;
  isRefining: boolean;
  refine: () => void;
};

/**
 * Streams AI-refined practice about text into the onboarding form.
 */
export function useRefineAbout({
  about,
  onAboutChange,
  disabled = false,
}: UseRefineAboutArgs): UseRefineAboutResult {
  const [isRefining, setIsRefining] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const accumulatedRef = useRef("");

  const length = about.length;
  const canRefine =
    !disabled &&
    !isRefining &&
    length >= REFINE_ABOUT_MIN_CHARS &&
    length <= REFINE_ABOUT_MAX_CHARS;

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const refine = () => {
    if (
      disabled ||
      isRefining ||
      length < REFINE_ABOUT_MIN_CHARS ||
      length > REFINE_ABOUT_MAX_CHARS
    ) {
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const original = about;
    accumulatedRef.current = "";
    setIsRefining(true);

    void refineAboutStream(
      about,
      {
        onDelta: (text) => {
          accumulatedRef.current += text;
          onAboutChange(accumulatedRef.current);
        },
        onDone: (finalText) => {
          onAboutChange(finalText);
          setIsRefining(false);
        },
        onError: (message) => {
          onAboutChange(original);
          setIsRefining(false);
          toast.error(message);
        },
      },
      { signal: controller.signal, kind: "practice" }
    ).finally(() => {
      if (abortRef.current === controller) {
        setIsRefining(false);
        abortRef.current = null;
      }
    });
  };

  return { canRefine, isRefining, refine };
}
