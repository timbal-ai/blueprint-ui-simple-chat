import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { SURFACE_SHADOW } from "@/lib/control-surface";
import { cn } from "@/lib/utils";

/**
 * Skeuomorphic chrome for filled controls: a bright top sheen that fades a
 * third of the way down + a soft two-layer drop shadow. All stops are
 * keyword/`color-mix` based (never raw literals) so the token system stays
 * the single color source.
 */
const FILLED_CHROME =
  "shadow-[inset_0_1px_0_0_color-mix(in_srgb,white_30%,transparent),inset_0_10px_10px_-8px_color-mix(in_srgb,white_16%,transparent),0_1px_2px_0_color-mix(in_srgb,black_28%,transparent),0_2px_5px_-2px_color-mix(in_srgb,black_22%,transparent)]";

/** White controls cast the SAME shadow as inputs — one shared source. */
const SURFACE_CHROME = SURFACE_SHADOW;

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-sm font-medium transition-[color,background-color,border-color,box-shadow,opacity] duration-200 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      // Fills come from the DNA finish tokens: under finish "timbal" they
      // render the signature gradient; under finish "flat" the stops are
      // degenerate (from == to) and this same source renders flat controls.
      variant: {
        default: cn(
          "bg-linear-to-b from-primary-fill-from to-primary-fill-to text-primary-foreground hover:from-primary-fill-hover-from hover:to-primary-fill-hover-to active:from-primary-fill-active-from active:to-primary-fill-active-to",
          FILLED_CHROME,
        ),
        secondary: cn(
          "border border-border bg-card text-secondary-foreground hover:bg-linear-to-b hover:from-secondary-fill-hover-from hover:to-secondary-fill-hover-to active:from-secondary-fill-active-from active:to-secondary-fill-active-to",
          SURFACE_CHROME,
        ),
        outline: cn(
          "border border-border bg-card hover:bg-ghost-fill-hover hover:text-accent-foreground active:bg-ghost-fill-active",
          SURFACE_CHROME,
        ),
        ghost:
          "hover:bg-ghost-fill-hover hover:text-accent-foreground active:bg-ghost-fill-active",
        destructive: cn(
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95 focus-visible:ring-destructive/20",
          FILLED_CHROME,
        ),
        link: "text-primary underline-offset-4 hover:underline",
      },
      // Compressed: fixed heights with minimal vertical padding — the label
      // sits tight inside the pill like the dashboard reference.
      size: {
        default: "h-8 px-3.5 py-0 has-[>svg]:px-3",
        sm: "h-7 rounded-md px-3 py-0 text-xs has-[>svg]:px-2.5",
        lg: "h-9 px-5 py-0 has-[>svg]:px-4",
        icon: "size-8",
        "icon-sm": "size-7 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
