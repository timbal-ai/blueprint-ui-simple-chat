import * as React from "react";

import { TimbalV2Button, type TimbalV2ButtonProps } from "@/components/studio/timbal-v2-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TimbalV2Variant } from "@/lib/timbal-v2-button-tokens";

export interface StudioTooltipIconButtonProps
  extends Omit<TimbalV2ButtonProps, "isIconOnly" | "children"> {
  tooltip: string;
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  variant?: TimbalV2Variant;
}

/**
 * Icon-only Timbal v2 button with tooltip — compose toolbar, chrome controls.
 */
const StudioTooltipIconButton = React.forwardRef<
  HTMLButtonElement,
  StudioTooltipIconButtonProps
>(function StudioTooltipIconButton(
  { tooltip, side = "bottom", children, variant = "secondary", ...props },
  ref,
) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TimbalV2Button
          ref={ref}
          variant={variant}
          size="sm"
          isIconOnly
          {...props}
        >
          {children}
          <span className="sr-only">{tooltip}</span>
        </TimbalV2Button>
      </TooltipTrigger>
      <TooltipContent side={side}>{tooltip}</TooltipContent>
    </Tooltip>
  );
});

export { StudioTooltipIconButton };
