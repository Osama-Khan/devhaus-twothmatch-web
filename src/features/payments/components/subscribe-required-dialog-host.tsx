"use client";

import { useEffect, useState } from "react";
import { registerPaymentRequiredHandler } from "@/lib/services/api-fetcher";
import { SubscribeRequiredDialog } from "@/features/payments/components/subscribe-required-dialog";

/**
 * Registers the global 402 handler and renders the subscribe paywall dialog.
 */
export function SubscribeRequiredDialogHost() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    registerPaymentRequiredHandler(({ message: _nextMessage }) => {
      setOpen(true);
    });

    return () => {
      registerPaymentRequiredHandler(null);
    };
  }, []);

  return (
    <SubscribeRequiredDialog
      open={open}
      onOpenChange={setOpen}
    />
  );
}
