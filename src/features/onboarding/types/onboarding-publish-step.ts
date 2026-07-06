import {
  Album01Icon,
  CheckmarkCircleIcon,
  File02Icon,
  Image01Icon,
} from "@hugeicons/core-free-icons";

/** Progress steps shown while publishing onboarding data */
export type OnboardingPublishStep =
  | "clinic-images"
  | "logo"
  | "saving"
  | "done";

export const ONBOARDING_PUBLISH_STEPS: readonly {
  id: OnboardingPublishStep;
  label: string;
  icon:
    | typeof Album01Icon
    | typeof Image01Icon
    | typeof File02Icon
    | typeof CheckmarkCircleIcon;
}[] = [
  { id: "clinic-images", label: "Uploading clinic images", icon: Album01Icon },
  { id: "logo", label: "Uploading logo", icon: Image01Icon },
  { id: "saving", label: "Saving data", icon: File02Icon },
  { id: "done", label: "Done", icon: CheckmarkCircleIcon },
];
