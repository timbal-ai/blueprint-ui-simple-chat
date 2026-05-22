import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";
import {
  TIMBAL_V2_BORDER,
  TIMBAL_V2_FILL,
  TIMBAL_V2_LABEL,
  TIMBAL_V2_SHADOW,
  TIMBAL_V2_SIZE_HEIGHT,
  TIMBAL_V2_SIZE_ICON,
  TIMBAL_V2_SIZE_LABEL_PX,
  type TimbalV2Size,
  type TimbalV2Variant,
} from "@/lib/timbal-v2-button-tokens";

export interface TimbalV2ButtonProps extends React.ComponentProps<"button"> {
  variant?: TimbalV2Variant;
  size?: TimbalV2Size;
  isIconOnly?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
}

/**
 * Layered gradient pill button — mirrors timbal-platform `TimbalV2Button`.
 * Absolute fill span + relative label row (`group/tbv2`).
 */
const TimbalV2Button = React.forwardRef<HTMLButtonElement, TimbalV2ButtonProps>(
  function TimbalV2Button(
    {
      variant = "secondary",
      size = "sm",
      isIconOnly = false,
      isLoading = false,
      fullWidth = false,
      asChild = false,
      className,
      disabled,
      type = "button",
      children,
      ...props
    },
    ref,
  ) {
    const isDisabled = disabled || isLoading;
    const Comp = asChild ? Slot.Root : "button";

    const sizeClass = isIconOnly
      ? TIMBAL_V2_SIZE_ICON[size]
      : TIMBAL_V2_SIZE_HEIGHT[size];

    const radiusClass =
      variant === "link" || variant === "ghost" ? "rounded-md" : "rounded-full";

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        disabled={asChild ? undefined : isDisabled}
        aria-disabled={asChild && isDisabled ? true : undefined}
        data-slot="timbal-v2-button"
        data-variant={variant}
        className={cn(
          "group/tbv2 relative box-border inline-flex flex-col items-stretch overflow-hidden border-0 bg-transparent p-0 text-sm font-normal shadow-none transition duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          sizeClass,
          radiusClass,
          TIMBAL_V2_BORDER[variant],
          TIMBAL_V2_SHADOW[variant],
          fullWidth && "w-full",
          isDisabled && "pointer-events-none opacity-50",
          className,
        )}
        {...props}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 transition duration-200 ease-in-out",
            TIMBAL_V2_FILL[variant],
          )}
        />
        <span
          className={cn(
            "relative z-10 flex min-h-0 flex-1 items-center justify-center gap-1 leading-tight",
            !isIconOnly && (TIMBAL_V2_SIZE_LABEL_PX[size] ?? TIMBAL_V2_SIZE_LABEL_PX.sm),
            TIMBAL_V2_LABEL[variant],
          )}
        >
          {isLoading ? (
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            children
          )}
        </span>
      </Comp>
    );
  },
);

export { TimbalV2Button };
