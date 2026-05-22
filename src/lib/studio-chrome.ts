import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import {
  TIMBAL_V2_PILL_SURFACE,
  TIMBAL_V2_SECONDARY_CHROME,
} from "@/lib/timbal-v2-button-tokens";

/** Floating studio chrome — mirrors timbal-platform `studioChrome.js`. */
export const STUDIO_CHROME_TOPBAR_GAP = "0.5rem";
export const STUDIO_CHROME_TOPBAR_HEIGHT = "3rem";
export const STUDIO_CHROME_PILL_HEIGHT = "2.5rem";
export const STUDIO_CHROME_SIDEBAR_GAP = "0.5rem";
export const STUDIO_CHROME_SIDEBAR_WIDTH = "3rem";
export const STUDIO_CHROME_INSET_LEFT = `calc(${STUDIO_CHROME_SIDEBAR_GAP} + ${STUDIO_CHROME_SIDEBAR_WIDTH})`;

/** Portal target for the compact Timbal mark once the thread has messages. */
export const STUDIO_TOPBAR_BRAND_ANCHOR_ID = "studio-topbar-brand-anchor";

export const studioChromeShellStyle = {
  "--studio-topbar-gap": STUDIO_CHROME_TOPBAR_GAP,
  "--studio-topbar-height": STUDIO_CHROME_TOPBAR_HEIGHT,
  "--studio-chrome-pill-height": STUDIO_CHROME_PILL_HEIGHT,
  "--studio-inset-top": `calc(${STUDIO_CHROME_TOPBAR_GAP} + ${STUDIO_CHROME_TOPBAR_HEIGHT})`,
  "--studio-sidebar-gap": STUDIO_CHROME_SIDEBAR_GAP,
  "--studio-sidebar-width": STUDIO_CHROME_SIDEBAR_WIDTH,
  "--studio-inset-left": STUDIO_CHROME_INSET_LEFT,
} as CSSProperties;

/** Resting pill surface — sidebar stack, static shells. */
export const studioPillSurfaceClass = TIMBAL_V2_PILL_SURFACE;

/** Interactive secondary chrome — select triggers, search shells. */
export const studioSecondaryChromeClass = TIMBAL_V2_SECONDARY_CHROME;

export const studioTopbarPillHeightClass =
  "h-[var(--studio-chrome-pill-height)] min-h-[var(--studio-chrome-pill-height)]";

export const studioTopbarIconPillClass =
  "shrink-0 flex-none size-[var(--studio-chrome-pill-height)] min-h-[var(--studio-chrome-pill-height)] min-w-[var(--studio-chrome-pill-height)]";

export const studioPlaygroundGradientClass =
  "bg-gradient-to-b from-neutral-200/60 via-neutral-100/30 to-background dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-950";

export const studioComposeInputShellClass =
  "flex w-full flex-col rounded-2xl border border-neutral-200/60 bg-background shadow-lg shadow-black/5 outline-none transition-[box-shadow,border-color] focus-within:border-neutral-400/80 focus-within:ring-2 focus-within:ring-foreground/5 focus-within:shadow-xl focus-within:shadow-black/10 dark:border-white/12 dark:bg-zinc-900 dark:shadow-black/20 dark:focus-within:border-white/22 dark:focus-within:ring-0";

/**
 * Studio integration card chrome — mirrors platform `glassStyles`
 * `STUDIO_INTEGRATION_SURFACE_SOLID` + `STUDIO_INTEGRATION_BORDER` / `orgStudioCardClass`.
 */
export const STUDIO_INTEGRATION_SURFACE_SOLID =
  "bg-white bg-gradient-to-b from-white to-neutral-50/70 shadow-[0_1px_2px_-0.5px_rgba(0,0,0,0.05)] dark:bg-zinc-900 dark:from-white/[0.05] dark:to-white/[0.025] dark:shadow-[0_1px_3px_rgba(0,0,0,0.22)]";

export const STUDIO_INTEGRATION_BORDER =
  "border border-neutral-200/80 dark:border-white/[0.08]";

export const studioIntegrationCardClass = cn(
  "rounded-xl",
  STUDIO_INTEGRATION_SURFACE_SOLID,
  STUDIO_INTEGRATION_BORDER,
);

/** Icon plate inside list rows — `orgStudioIconTileClass` / `roleListIconTileClass`. */
export const studioIntegrationIconTileClass = cn(
  "flex size-9 shrink-0 items-center justify-center rounded-lg",
  STUDIO_INTEGRATION_SURFACE_SOLID,
  STUDIO_INTEGRATION_BORDER,
);

/**
 * Full-width selectable row — settings role cards, suggestion chips.
 * Mirrors `roleListRowSurfaceClass` in timbal-platform `rolesListChrome.js`.
 */
export const studioListRowButtonClass = cn(
  "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left",
  studioIntegrationCardClass,
  "transition-[background-color,box-shadow,border-color] duration-200 ease-in-out",
  "hover:border-neutral-300 dark:hover:border-white/15",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/15 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-white/20",
);

/**
 * Compose tool drawer / trace payload well — opaque studio surface so JSON reads
 * on the playground gradient (`COMPOSER_NODE_IO_WELL` + integration solid).
 */
export const studioComposerIoWellClass = cn(
  "rounded-lg",
  STUDIO_INTEGRATION_SURFACE_SOLID,
  STUDIO_INTEGRATION_BORDER,
);

/** Collapsible tool-call card shell — `PastRunStepCard` / compose trace chrome. */
export const studioToolCardShellClass = cn(
  studioIntegrationCardClass,
  "my-2 min-h-0 overflow-hidden",
);

/** Flat compose timeline row — `ComposerTimelineToggleRow` / “Thought 512 ms”. */
export const studioTimelineRowButtonClass =
  "group flex w-full min-w-0 cursor-pointer items-center justify-start rounded-md border-0 bg-transparent py-1 text-left shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/15 focus-visible:ring-offset-2";

export const studioTimelineTextClass = "text-xs font-normal leading-snug";

export const studioTimelineActionClass = cn(
  studioTimelineTextClass,
  "shrink-0 text-foreground/70 transition-colors duration-150 group-hover:text-foreground/80",
);

/** Shimmer action word — no text color (Shimmer uses text-transparent + bg-clip-text). */
export const studioTimelineShimmerActionClass = cn(
  studioTimelineTextClass,
  "shrink-0",
);

export const studioTimelineDetailClass = cn(
  studioTimelineTextClass,
  "min-w-0 truncate text-muted-foreground transition-colors duration-150",
);

export function studioTimelineChevronClass(expanded: boolean) {
  return cn(
    "ml-0.5 size-3 min-h-3 min-w-3 shrink-0 transition-all duration-150",
    expanded
      ? "rotate-90 text-foreground opacity-60"
      : "text-muted-foreground opacity-0 group-hover:opacity-70",
  );
}

/** Expanded payload under a timeline toggle — `COMPOSER_THINKING_BODY_PAD`. */
export const studioTimelineBodyPadClass = "flex flex-col gap-2 pt-0.5 pb-0.5";

/** In-thread artifact shell — question cards, charts, etc. */
export const studioArtifactShellClass = cn(
  studioIntegrationCardClass,
  "my-2 w-full min-w-0 overflow-hidden",
);

/** Question option row — flat hover inside artifact card (not full gradient pill). */
export const studioQuestionOptionClass =
  "flex w-full items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 text-left text-sm transition-[background-color,border-color,box-shadow] duration-200 hover:bg-neutral-100/80 dark:hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/15 focus-visible:ring-offset-2";

export const studioQuestionOptionSelectedClass = cn(
  studioQuestionOptionClass,
  "border-neutral-200/80 bg-neutral-50/90 ring-1 ring-foreground/10 dark:border-white/[0.12] dark:bg-white/[0.06] dark:ring-white/10",
);
