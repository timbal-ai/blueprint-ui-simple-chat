import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Tactile track (Beacon reference): recessed inner shadow so the
        // groove reads carved-in; checked fill gets a subtle top-lit grade.
        "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent transition-[background-color,border-color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        "shadow-[inset_0_1px_2px_0_color-mix(in_srgb,black_16%,transparent),inset_0_0_0_1px_color-mix(in_srgb,black_4%,transparent)]",
        "data-[state=checked]:bg-linear-to-b data-[state=checked]:from-primary-fill-from data-[state=checked]:to-primary-fill-to",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Raised thumb: white dome with its own soft drop — pops off the
          // recessed track.
          "pointer-events-none block size-4 rounded-full bg-card ring-0 transition-transform ease-out-strong data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5",
          "shadow-[inset_0_1px_0_0_color-mix(in_srgb,white_80%,transparent),0_1px_2px_0_color-mix(in_srgb,black_22%,transparent),0_2px_4px_-1px_color-mix(in_srgb,black_15%,transparent)]",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
