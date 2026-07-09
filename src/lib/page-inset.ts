import { cn } from "@/lib/utils";

/**
 * Canonical page inset — lateral + vertical breathing room inside the shell
 * content card. AppShell applies this by default; PageBody can opt in when a
 * page renders outside a shell (centered forms, standalone routes).
 */
const PAGE_INSET_X = "px-4 sm:px-6 lg:px-8";
const PAGE_INSET_Y = "pt-5 pb-8 sm:pt-6 sm:pb-10";

export const PAGE_INSET_CLASS = cn(PAGE_INSET_X, PAGE_INSET_Y);
