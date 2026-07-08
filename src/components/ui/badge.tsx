import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,background-color,border-color] [&>svg]:size-3 [&>svg]:pointer-events-none",
  {
    variants: {
      // Tonal badges are VIBRANT: text/icon take the solid status tone (not
      // the muted subtle-foreground), the fill is that same tone at low
      // alpha, and the outline is the tone one shade darker — chips read as
      // saturated, crisp objects on white, per the house reference.
      variant: {
        default:
          "border-primary/40 bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-foreground/15 bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        destructive:
          "border-destructive/45 bg-destructive/12 text-destructive",
        "destructive-solid":
          "border-destructive/50 bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90",
        success: "border-success/50 bg-success/15 text-success",
        warning: "border-warning/55 bg-warning/20 text-warning-subtle-foreground",
        info: "border-info/50 bg-info/15 text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
