import { cx } from "@/utils/cx";

/**
 * THE secondary control chrome — the house finish applied to BoardUI's
 * secondary Button (subtle top-lit white gradient + inset highlight + soft
 * drop over the neutral-200 hairline; user direction 2026-07-14: "a bit of
 * bg shadow and a bit of gradient on the buttons").
 *
 * Every button-LIKE control shares this skin so a Select trigger, a
 * date-picker trigger, a Filters button, and a pager pill sitting in the
 * same toolbar are visually identical. Hover/active move the gradient
 * STOPS (a plain background-color would hide under the gradient image).
 *
 * Text inputs / search fields stay FLAT (`bg-background-primary-default` +
 * `shadow-xs`) — the gradient is a button affordance, not a field one.
 */

/** At-rest gradient fill — white fading to a 3% darker stop. */
export const SECONDARY_GRADIENT =
  "bg-linear-to-b from-background-primary-default to-[color-mix(in_srgb,var(--color-background-primary-default)_97%,black)]";

/** Neutral hairline. */
export const SECONDARY_BORDER = "border border-border-button-default";

/** Inset top highlight + single soft drop. */
export const SECONDARY_SHADOW =
  "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.65),0_1px_2px_0_rgb(0_0_0/0.07)]";

/** Hover moves the gradient stops one grade down + darkens the hairline. */
export const SECONDARY_HOVER =
  "hover:from-background-primary-hover hover:to-[color-mix(in_srgb,var(--color-background-primary-hover)_97%,black)] hover:border-border-button-hover";

/** Active flattens to the pressed tone. */
export const SECONDARY_ACTIVE =
  "active:from-background-primary-active active:to-background-primary-active active:border-border-button-active";

/** Static surface — non-interactive containers (pills, active pagination cell). */
export const SECONDARY_SURFACE = cx(
  SECONDARY_GRADIENT,
  SECONDARY_BORDER,
  SECONDARY_SHADOW,
);

/** Full interactive chrome — triggers and buttons. Add your own disabled styles. */
export const SECONDARY_CHROME = cx(
  SECONDARY_SURFACE,
  SECONDARY_HOVER,
  SECONDARY_ACTIVE,
);

/** Disabled reset shared by the secondary tiers — flat, quiet, no shadow. */
export const SECONDARY_DISABLED = [
  "disabled:bg-none disabled:bg-background-primary-disabled disabled:border-border-button-default disabled:shadow-none",
  "aria-disabled:bg-none aria-disabled:bg-background-primary-disabled aria-disabled:border-border-button-default aria-disabled:shadow-none",
].join(" ");
