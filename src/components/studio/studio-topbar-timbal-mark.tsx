import { useCallback, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useThread, useTimbalRuntime } from "@timbal-ai/timbal-react";
import { AnimatePresence } from "motion/react";

import { TimbalLiquidMetalIcon } from "@/components/studio/timbal-liquid-metal-icon";
import { StudioToolMotion } from "@/components/studio/studio-tool-motion";
import { STUDIO_TOPBAR_BRAND_ANCHOR_ID } from "@/lib/studio-chrome";
import { cn } from "@/lib/utils";

/** Compact header mark — slightly larger than chrome pill buttons (40px). */
const TOPBAR_TIMBAL_MARK_SIZE = 48;

/** Renders inside the thread runtime; portals the mark into the studio header. */
export function StudioTopbarTimbalPortal() {
  const hasMessages = useThread((s) => s.messages.length > 0);
  const { clear } = useTimbalRuntime();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const startNewChat = useCallback(() => {
    clear();
  }, [clear]);

  useLayoutEffect(() => {
    setAnchor(document.getElementById(STUDIO_TOPBAR_BRAND_ANCHOR_ID));
  }, []);

  if (!anchor) return null;

  return createPortal(
    <AnimatePresence mode="wait" initial>
      {hasMessages ? (
        <StudioToolMotion
          key="studio-topbar-timbal"
          motionKey="studio-topbar-timbal"
          className="flex shrink-0 items-center justify-center"
        >
          <button
            type="button"
            onClick={startNewChat}
            className={cn(
              "flex cursor-pointer items-center justify-center rounded-xl border-0 bg-transparent p-0",
              "transition-opacity duration-200 hover:opacity-85 active:opacity-70",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/15 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
            aria-label="New chat"
            title="New chat"
          >
            <TimbalLiquidMetalIcon size={TOPBAR_TIMBAL_MARK_SIZE} />
          </button>
        </StudioToolMotion>
      ) : null}
    </AnimatePresence>,
    anchor,
  );
}
