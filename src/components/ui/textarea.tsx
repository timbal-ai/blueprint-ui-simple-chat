import * as React from "react";

import { SURFACE_BORDER, SURFACE_GRADE, SURFACE_SHADOW } from "@/lib/control-surface";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        SURFACE_BORDER,
        SURFACE_GRADE,
        SURFACE_SHADOW,
        "flex field-sizing-content min-h-16 w-full rounded-lg bg-card px-3 py-2 text-base transition-[color,border-color] outline-none placeholder:text-icon-muted disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
