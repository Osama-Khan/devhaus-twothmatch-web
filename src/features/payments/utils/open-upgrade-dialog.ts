type UpgradeDialogOpener = () => void;

let upgradeDialogOpener: UpgradeDialogOpener | null = null;

/** Registers the host that can open the upgrade dialog. */
export function registerUpgradeDialogOpener(
  opener: UpgradeDialogOpener | null
): void {
  upgradeDialogOpener = opener;
}

/** Opens the shared Upgrade dialog (account menu, paywall, etc.). */
export function openUpgradeDialog(): void {
  upgradeDialogOpener?.();
}
