import { cn } from "@/lib/utils";

/**
 * Canonical page inset — lateral + vertical breathing room inside the shell
 * content card. AppShell applies this by default; PageBody can opt in when a
 * page renders outside a shell (centered forms, standalone routes).
 */
const PAGE_INSET_X = "px-4 sm:px-6 lg:px-8";
const PAGE_INSET_Y = "pt-5 pb-8 sm:pt-6 sm:pb-10";

export const PAGE_INSET_CLASS = cn(PAGE_INSET_X, PAGE_INSET_Y);

/**
 * Exact negation of PAGE_INSET_CLASS. For the rare page that must bleed to
 * the shell content-card edges (EmbeddedChat) while sibling routes keep the
 * standard inset. MUST mirror the values above — change them together.
 */
const PAGE_INSET_NEGATE_X = "-mx-4 sm:-mx-6 lg:-mx-8";
const PAGE_INSET_NEGATE_Y = "-mt-5 -mb-8 sm:-mt-6 sm:-mb-10";

export const PAGE_INSET_NEGATE_CLASS = cn(
  PAGE_INSET_NEGATE_X,
  PAGE_INSET_NEGATE_Y,
);
