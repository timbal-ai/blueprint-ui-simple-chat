import type { HTMLAttributes, Ref } from "react";
import { cx } from "@/utils/cx";

/**
 * Figma source: Board UI → dashboard 1 quick-search shortcut (node 3731:2955).
 *
 * Keyboard shortcut hint: 12/16 semibold on a fully-rounded neutral pill.
 *   - bg color/neutral/300, text/secondary
 *   - px 4, py 2, radius full
 */

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>;
}

export function Kbd({ className, ref, ...props }: KbdProps) {
  return (
    <kbd
      ref={ref}
      className={cx(
        "inline-flex items-center justify-center rounded-full bg-neutral-300 px-1 py-0.5 font-sans text-caption-1-semibold tracking-normal whitespace-nowrap text-text-secondary",
        className,
      )}
      {...props}
    />
  );
}
