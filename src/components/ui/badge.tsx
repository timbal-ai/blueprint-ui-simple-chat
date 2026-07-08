import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,background-color,border-color] [&>svg]:size-3 [&>svg]:pointer-events-none",
  {
    variants: {
      // Every tonal badge carries a visible outline one shade darker than its
      // fill (the subtle-foreground at low alpha) so chips read as crisp
      // objects on white, per the house reference.
      variant: {
        default:
          "border-primary/40 bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-foreground/15 bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        destructive:
          "border-destructive-subtle-foreground/30 bg-destructive-subtle text-destructive-subtle-foreground",
        "destructive-solid":
          "border-destructive/50 bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90",
        success:
          "border-success-subtle-foreground/30 bg-success-subtle text-success-subtle-foreground",
        warning:
          "border-warning-subtle-foreground/30 bg-warning-subtle text-warning-subtle-foreground",
        info: "border-info-subtle-foreground/30 bg-info-subtle text-info-subtle-foreground",
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
