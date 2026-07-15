import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import {
  SECONDARY_CHROME,
  SECONDARY_DISABLED,
} from "@/components/base/buttons/secondary-chrome";
import { cn } from "@/lib/utils";

/**
 * LEGACY shadcn-shaped Button — kept only for the remaining shadcn-shaped
 * consumers (`ui/alert-dialog`, `ui/carousel`). Its chrome is mapped 1:1 to
 * the BoardUI `base/buttons/button` tiers so both button systems render
 * identically; for new work import `@/components/base/buttons/button`.
 */

/** Soft two-layer drop shared by the filled tiers (matches base Button). */
const FILLED_SHADOW =
  "shadow-[0_1px_2px_0_rgb(0_0_0/0.14),0_2px_4px_-2px_rgb(0_0_0/0.10)]";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-2lg text-body-medium transition-[color,background-color,border-color,box-shadow] duration-150 ease outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus-ring disabled:pointer-events-none aria-disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: cn(
          "bg-button-primary text-foreground-full",
          FILLED_SHADOW,
          "disabled:text-foreground-disabled disabled:shadow-none aria-disabled:text-foreground-disabled aria-disabled:shadow-none",
        ),
        secondary: cn(
          "text-text-primary",
          SECONDARY_CHROME,
          SECONDARY_DISABLED,
          "disabled:text-text-tertiary aria-disabled:text-text-tertiary",
        ),
        outline: cn(
          "text-text-primary",
          SECONDARY_CHROME,
          SECONDARY_DISABLED,
          "disabled:text-text-tertiary aria-disabled:text-text-tertiary",
        ),
        ghost: cn(
          "bg-transparent text-text-secondary",
          "hover:bg-background-primary-hover hover:text-text-primary",
          "active:bg-background-primary-active",
          "disabled:text-text-disabled aria-disabled:text-text-disabled",
        ),
        destructive: cn(
          "bg-button-danger text-foreground-full",
          FILLED_SHADOW,
          "disabled:text-foreground-disabled-danger disabled:shadow-none aria-disabled:text-foreground-disabled-danger aria-disabled:shadow-none",
        ),
        link: "text-text-primary underline-offset-4 hover:underline disabled:text-text-disabled aria-disabled:text-text-disabled",
      },
      size: {
        default: "h-9 px-3",
        sm: "h-8 rounded-lg px-2.5",
        lg: "h-10 px-4",
        icon: "size-9",
        "icon-sm": "size-8 rounded-lg",
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
