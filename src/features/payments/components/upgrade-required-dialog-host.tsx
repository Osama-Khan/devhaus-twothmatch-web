"use client";

import { useEffect, useState } from "react";
import { registerPaymentRequiredHandler } from "@/lib/services/api-fetcher";
import { UpgradeRequiredDialog } from "@/features/payments/components/upgrade-required-dialog";
import { registerUpgradeDialogOpener } from "@/features/payments/utils/open-upgrade-dialog";

/**
 * Hosts the shared Upgrade dialog — opened on 402 or via `openUpgradeDialog()`.
 */
export function UpgradeRequiredDialogHost() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openDialog = () => {
      setOpen(true);
    };

    registerUpgradeDialogOpener(openDialog);
    registerPaymentRequiredHandler(() => {
      openDialog();
    });

    return () => {
      registerUpgradeDialogOpener(null);
      registerPaymentRequiredHandler(null);
    };
  }, []);

  return (
    <UpgradeRequiredDialog open={open} onOpenChange={setOpen} />
  );
}
