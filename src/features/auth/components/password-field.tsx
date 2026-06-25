"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

type PasswordFieldProps = {
  id: string;
  label: React.ReactNode;
  autoComplete?: "current-password" | "new-password";
  error?: string;
  registration: UseFormRegisterReturn;
};

/** Password input with visibility toggle — uses InputGroup per shadcn pattern. */
export function PasswordField({
  id,
  label,
  autoComplete = "current-password",
  error,
  registration,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          {...registration}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            size="icon-xs"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            <HugeiconsIcon
              icon={visible ? ViewOffIcon : ViewIcon}
              strokeWidth={2}
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FieldError>{error}</FieldError>
    </Field>
  );
}
