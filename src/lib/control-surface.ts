/**
 * The single control-surface contract.
 *
 * Every input, select / dropdown trigger, and search field in the package reads
 * its skin from here, so a `SearchInput` and a `Select` trigger placed side by
 * side are visually identical — regardless of whether one was hand-written and
 * the other vendored from shadcn. The provenance of a control stops mattering
 * because the skin is defined exactly once.
 *
 * Two axes only, both enumerated (never ad-hoc):
 *   - **skin** — border, surface gradient, shadow, focus ring, transition.
 *     Canonical = studio secondary chrome (`TIMBAL_V2_SECONDARY_CHROME`).
 *   - **shape** — `field` (rounded-lg, the default for form/data controls) or
 *     `pill` (rounded-full, for topbar/filter chrome rows).
 *
 * Floating panels share `overlaySurfaceClass` + `overlayListPanelClass` (menus)
 * or padded popover chrome + `overlayItemClass` for rows so menus and
 * listboxes match too.
 *
 * Composable public API — exported from `./ui` and the package root so apps can
 * build custom controls that match the kit. Do **not** hand-roll a control
 * surface (`rounded-* border-input bg-…`) in a component; compose these.
 */

import { cn } from "@/lib/utils";

export type ControlSize = "sm" | "default";
export type ControlShape = "field" | "pill";

/** Height + horizontal padding per control size — shared by every control. */
export const CONTROL_SIZE: Record<ControlSize, string> = {
  sm: "h-7 px-2.5",
  default: "h-8 px-3",
};

const CONTROL_SHAPE: Record<ControlShape, string> = {
  field: "rounded-lg",
  pill: "rounded-full",
};

/**
 * THE one surface shadow — the reference button recipe (2026-07-13):
 * a single soft drop, X:0 Y:1 blur 2 at 8% black. No inset sheen — the
 * texture comes from `SURFACE_GRADE`. Shared verbatim by white buttons
 * (secondary/outline) AND every input / select / search field so controls
 * sitting side by side cast identical shadows. Never give a control
 * `shadow-xs`/`shadow-sm` directly; use this.
 */
export const SURFACE_SHADOW =
  "shadow-[0_1px_2px_0_color-mix(in_srgb,black_8%,transparent)]";

/**
 * The control hairline — the recipe's "remove the stroke, add a 1px #ECECEC
 * ring" step, expressed as a real border painted lighter than `--border`
 * (border mixed 60% toward card ≈ #ECECEC in light; stays subtle in dark).
 * Pair with SURFACE_SHADOW everywhere a control needs an edge.
 */
export const SURFACE_BORDER =
  "border border-[color-mix(in_srgb,var(--border)_60%,var(--card))]";

/**
 * The at-rest surface grade for white controls — an almost-imperceptible
 * top-lit vertical gradient (card → card mixed 3% toward black) that makes
 * buttons and fields read as physical, not flat. Token-referential only;
 * still reads WHITE (never swap controls to gray).
 */
export const SURFACE_GRADE =
  "bg-linear-to-b from-card to-[color-mix(in_srgb,var(--card)_97%,black)]";

/**
 * The control skin — surface, border, shadow, focus ring, disabled, transition.
 * No height / width / padding / radius / layout, so it composes onto an
 * `<input>`, a `<button>` trigger, or a `<label>` wrapper alike. Add size +
 * shape via `controlClass(...)`, or compose directly for bespoke layouts.
 *
 * Controls sit on WHITE (`bg-card`) — search bars, selects, and dropdown
 * triggers read as crisp fields against the gray canvas, per the house
 * reference. Never swap this to a gray/elevated surface.
 */
export const controlSurfaceClass = cn(
  "bg-card",
  SURFACE_BORDER,
  SURFACE_GRADE,
  SURFACE_SHADOW,
  "transition-[background-color,border-color] duration-200 ease-in-out",
  "hover:border-border",
  "text-sm text-foreground outline-none",
  // Chrome grays (Beacon reference): placeholder text + non-colored icons
  // inside a control read in the DNA --icon-muted role (#BABABA in light).
  "placeholder:text-icon-muted",
  "focus-visible:ring-2 focus-visible:ring-foreground/10",
  "focus-within:ring-2 focus-within:ring-foreground/10",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "data-[placeholder]:text-icon-muted",
  "[&_svg:not([class*='text-'])]:text-icon-muted",
);

export interface ControlClassOptions {
  /** Height + padding. Default `"default"` (h-10). */
  size?: ControlSize;
  /** Corner shape. Default `"field"` (rounded-lg). Use `"pill"` for chrome rows. */
  shape?: ControlShape;
}

/**
 * Build a complete control class: skin + size + shape. The one entry point for
 * inputs, triggers, and search fields.
 *
 * @example
 * ```tsx
 * <input className={controlClass({}, "w-full")} />               // field, h-10
 * <SelectTrigger className={controlClass({ size: "sm" })} />      // field, h-9
 * <label className={controlClass({ shape: "pill" })} />           // pill chrome
 * ```
 */
export function controlClass(
  options: ControlClassOptions = {},
  className?: string,
): string {
  const { size = "default", shape = "field" } = options;
  return cn(controlSurfaceClass, CONTROL_SIZE[size], CONTROL_SHAPE[shape], className);
}

/**
 * Shared entrance / exit animation for floating panels (popover, menu,
 * listbox). Identical across all overlays so they open the same way.
 *
 * Motion craft: strong ease-out (weak built-ins read sluggish), asymmetric
 * timing — enter 150ms, exit snaps in 100ms. Consumers keep the trigger-
 * anchored `origin-(--radix-*-transform-origin)` so panels scale from the
 * trigger, never from center.
 */
export const overlayAnimationClass =
  "ease-out-strong data-[state=open]:animate-in data-[state=open]:duration-150 data-[state=closed]:animate-out data-[state=closed]:duration-100 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-97 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2";

/**
 * Shared floating-panel surface — popover, dropdown menu, select listbox,
 * command. Colors + border + shadow + z-index + animation. Each consumer adds
 * its own radius / padding / min-width / transform origin.
 */
export const overlaySurfaceClass = cn(
  "z-[80] border border-border bg-popover text-popover-foreground shadow-card",
  overlayAnimationClass,
);

/**
 * Listbox / menu / command panel chrome — `Select`, `DropdownMenu`, `Command`,
 * `Combobox`. Same radius and zero padding; rows use `overlayItemClass`.
 * Rich popovers (help text, forms) use `PopoverContent` default padding instead.
 */
export const overlayListPanelClass = cn(
  overlaySurfaceClass,
  "overflow-hidden rounded-lg p-0 outline-hidden",
);

/**
 * Shared selectable row inside an overlay (menu item, list option). Consumers
 * override padding (e.g. `pl-8` for a leading indicator) on top of this.
 */
export const overlayItemClass =
  "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground";
