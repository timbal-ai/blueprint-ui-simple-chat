import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-control text-sm font-medium transition-[color,background-color,border-color,box-shadow,opacity] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      // Fills and shadows come from the DNA finish tokens: under
      // finish "timbal" they render the signature gradient + inset-highlight
      // chrome; under finish "flat" the stops are degenerate (from == to)
      // and this same source renders plain flat controls.
      variant: {
        default:
          "bg-linear-to-b from-primary-fill-from to-primary-fill-to text-primary-foreground shadow-control hover:from-primary-fill-hover-from hover:to-primary-fill-hover-to active:from-primary-fill-active-from active:to-primary-fill-active-to",
        secondary:
          "bg-secondary text-secondary-foreground shadow-control-bordered hover:bg-linear-to-b hover:from-secondary-fill-hover-from hover:to-secondary-fill-hover-to active:from-secondary-fill-active-from active:to-secondary-fill-active-to",
        outline:
          "border border-border bg-background shadow-control-bordered hover:bg-ghost-fill-hover hover:text-accent-foreground active:bg-ghost-fill-active",
        ghost:
          "hover:bg-ghost-fill-hover hover:text-accent-foreground active:bg-ghost-fill-active",
        destructive:
          "bg-destructive text-destructive-foreground shadow-control hover:bg-destructive/90 active:bg-destructive/95 focus-visible:ring-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-control px-4 py-2 has-[>svg]:px-3",
        sm: "h-control-sm rounded-control px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-control-lg rounded-control px-6 has-[>svg]:px-4",
        icon: "size-control",
        "icon-sm": "size-control-sm",
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
