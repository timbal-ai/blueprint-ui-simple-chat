/**
 * Timbal v2 button design tokens — ported from timbal-platform `TimbalV2Button.js`.
 * Uses Tailwind neutral scale instead of HeroUI `default-*` semantic tokens.
 */

export type TimbalV2Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "informative"
  | "destructive"
  | "link";

export type TimbalV2Size = "xs" | "sm" | "md" | "lg";

export const TIMBAL_V2_SIZE_HEIGHT: Record<TimbalV2Size, string> = {
  xs: "min-h-8 h-8",
  sm: "min-h-9 h-9",
  md: "min-h-10 h-10",
  lg: "min-h-11 h-11",
};

export const TIMBAL_V2_SIZE_ICON: Record<TimbalV2Size, string> = {
  xs: "min-h-8 min-w-8 size-8",
  sm: "min-h-8 min-w-8 size-8",
  md: "min-h-10 min-w-10 size-10",
  lg: "min-h-11 min-w-11 size-11",
};

export const TIMBAL_V2_SIZE_LABEL_PX: Record<TimbalV2Size, string> = {
  xs: "px-3",
  sm: "px-4",
  md: "px-5",
  lg: "px-6",
};

/** Absolute gradient fill layer — scoped to `group/tbv2`. */
export const TIMBAL_V2_FILL: Record<TimbalV2Variant, string> = {
  primary:
    "bg-gradient-to-b from-neutral-800 to-black group-hover/tbv2:from-neutral-700 group-hover/tbv2:to-neutral-900 group-active/tbv2:from-black group-active/tbv2:to-black dark:from-white dark:to-neutral-200 dark:group-hover/tbv2:from-white dark:group-hover/tbv2:to-neutral-100 dark:group-active/tbv2:from-neutral-200 dark:group-active/tbv2:to-neutral-400",
  informative:
    "bg-blue-600 group-active/tbv2:[background-image:linear-gradient(to_top,rgba(0,0,0,0.08),transparent_55%)]",
  destructive:
    "bg-gradient-to-b from-white to-neutral-50/75 group-hover/tbv2:from-red-50/90 group-hover/tbv2:to-red-100/70 group-active/tbv2:from-red-100/90 group-active/tbv2:to-red-200/65 dark:from-white/[0.05] dark:to-white/[0.025] dark:group-hover/tbv2:from-red-500/12 dark:group-hover/tbv2:to-red-500/8 dark:group-active/tbv2:from-red-500/20 dark:group-active/tbv2:to-red-500/12",
  secondary:
    "bg-gradient-to-b from-white to-neutral-50/70 group-hover/tbv2:from-neutral-50/50 group-hover/tbv2:to-neutral-100/65 group-active/tbv2:from-neutral-100/70 group-active/tbv2:to-neutral-200/65 dark:from-white/[0.05] dark:to-white/[0.025] dark:group-hover/tbv2:from-white/[0.07] dark:group-hover/tbv2:to-white/[0.045] dark:group-active/tbv2:from-white/[0.10] dark:group-active/tbv2:to-white/[0.07]",
  ghost:
    "bg-transparent group-hover/tbv2:bg-neutral-100/70 group-active/tbv2:bg-neutral-200/70 dark:group-hover/tbv2:bg-white/10 dark:group-active/tbv2:bg-white/15",
  link: "bg-transparent",
};

export const TIMBAL_V2_LABEL: Record<TimbalV2Variant, string> = {
  primary: "text-white dark:text-neutral-900",
  informative: "text-white",
  destructive: "text-destructive dark:text-red-400",
  secondary: "text-foreground",
  ghost: "text-foreground",
  link: "text-foreground underline decoration-black/25 underline-offset-2 group-hover/tbv2:decoration-black/45 dark:decoration-white/25 dark:group-hover/tbv2:decoration-white/45",
};

export const TIMBAL_V2_BORDER: Record<TimbalV2Variant, string> = {
  primary: "",
  informative: "border border-white/15 dark:border-white/10",
  destructive: "border border-destructive/45 dark:border-red-500/55",
  secondary: "border border-neutral-200/80 dark:border-white/[0.08]",
  ghost: "",
  link: "",
};

export const TIMBAL_V2_SHADOW: Record<TimbalV2Variant, string> = {
  primary: "shadow-sm shadow-black/15 dark:shadow-black/40",
  informative: "shadow-sm shadow-blue-900/20 dark:shadow-black/40",
  destructive:
    "shadow-[0_1px_2px_-0.5px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.22)]",
  secondary:
    "shadow-[0_1px_2px_-0.5px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.22)]",
  ghost: "",
  link: "",
};

/** Non-button shells (sidebar stack, select triggers). */
export const TIMBAL_V2_PILL_SURFACE =
  "bg-gradient-to-b from-white to-neutral-50/70 border border-neutral-200/80 shadow-[0_1px_2px_-0.5px_rgba(0,0,0,0.05)] dark:from-white/[0.05] dark:to-white/[0.025] dark:border-white/[0.08] dark:shadow-[0_1px_3px_rgba(0,0,0,0.22)]";

/** Interactive secondary chrome for native controls beside v2 buttons. */
export const TIMBAL_V2_SECONDARY_CHROME =
  "bg-gradient-to-b from-white to-neutral-50/70 border border-neutral-200/80 shadow-[0_1px_2px_-0.5px_rgba(0,0,0,0.05)] transition-[background-color,box-shadow,border-color] duration-200 ease-in-out hover:from-neutral-50/40 hover:to-neutral-100/60 active:from-neutral-100/65 active:to-neutral-200/65 dark:from-white/[0.05] dark:to-white/[0.025] dark:border-white/[0.08] dark:shadow-[0_1px_3px_rgba(0,0,0,0.22)] dark:hover:from-white/[0.07] dark:hover:to-white/[0.045] dark:active:from-white/[0.10] dark:active:to-white/[0.07]";
