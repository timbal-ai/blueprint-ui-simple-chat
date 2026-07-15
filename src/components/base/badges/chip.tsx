import type { HTMLAttributes, Ref } from "react";
import { cx, sortCx } from "@/utils/cx";

/**
 * Figma source: Board UI → dashboard 1 "Chip" layers (status chips, delta
 * chips, price chips, role chips — e.g. nodes 3731:3273, 3731:3094, 3731:3280,
 * 3731:3055).
 *
 * Colored label chip. Three emphasis levels, all rounded radius/md (6px),
 * px 6:
 *
 *   bold    py 2, Body 1/Medium   (14/20/500) — status + percentage deltas
 *   subtle  py 4, Body 1/Medium   (14/20/500) — price chips
 *   caption py 4, Caption 1/Medium (12/16/500, tracking .15) — role tags
 *
 * Color pairs straight from Figma variables:
 *   lime    bg color/lime/200    text color/lime/800
 *   rose    bg color/rose/200    text color/rose/800
 *   yellow  bg color/yellow/200  text color/yellow/800
 *   cyan    bg color/cyan/200    text color/cyan/800
 *   blue    bg color/blue/200    text color/blue/800   (same 200/800 recipe;
 *           first needed by the medical template's "In treatment" status)
 *   purple  bg color/purple/100  text color/purple/600 (AI profile delta
 *           chips — node 4065:8286 uses purple/600, the tokens chart chip
 *           overrides to purple/700 via className)
 *   neutral bg color/neutral/200 text color/neutral/500
 *   gray    bg color/neutral/100 text color/neutral/800
 *   soft    bg background/secondary/default text text/secondary
 */

type ChipVariant = "bold" | "subtle" | "caption";
type ChipColor = "lime" | "rose" | "yellow" | "cyan" | "blue" | "purple" | "neutral" | "gray" | "soft";

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
  color?: ChipColor;
  ref?: Ref<HTMLSpanElement>;
}

const styles = sortCx({
  base: "inline-flex items-center justify-center rounded-md px-1.5 whitespace-nowrap transition-[padding,font-size] duration-200 ease",
  variant: {
    bold: "py-0.5 text-body-medium",
    subtle: "py-1 text-body-medium",
    caption: "py-1 text-caption-1-medium",
  },
  color: {
    lime: "bg-lime-200 text-lime-800",
    rose: "bg-rose-200 text-rose-800",
    yellow: "bg-yellow-200 text-yellow-800",
    cyan: "bg-cyan-200 text-cyan-800",
    blue: "bg-blue-200 text-blue-800",
    purple: "bg-purple-100 text-purple-600",
    neutral: "bg-background-tertiary-default text-text-secondary",
    gray: "bg-background-secondary-default text-text-primary",
    soft: "bg-background-secondary-default text-text-secondary",
  },
});

export function Chip({
  variant = "bold",
  color = "neutral",
  className,
  ref,
  ...props
}: ChipProps) {
  return (
    <span
      ref={ref}
      className={cx(styles.base, styles.variant[variant], styles.color[color], className)}
      {...props}
    />
  );
}
