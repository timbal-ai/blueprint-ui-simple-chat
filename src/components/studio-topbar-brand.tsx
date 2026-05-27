import { useCallback, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Composer,
  TimbalMark,
  useTimbalRuntime,
  type ComposerProps,
} from "@timbal-ai/timbal-react";
import { useThread } from "@assistant-ui/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/** Must match `DOM_IDS.topbarBrandAnchor` in `@timbal-ai/timbal-react`. */
export const STUDIO_TOPBAR_BRAND_ANCHOR_ID =
  "timbal-studio-topbar-brand-anchor";

/** Compact header mark — slightly larger than chrome pill buttons (40px). */
const TOPBAR_TIMBAL_MARK_SIZE = 48;

const luxuryEase = [0.16, 1, 0.3, 1] as const;

/** Anchor element for the topbar brand portal (pass as `brand` / `headerStart`). */
export function StudioTopbarBrandAnchor() {
  return (
    <div
      id={STUDIO_TOPBAR_BRAND_ANCHOR_ID}
      className="flex shrink-0 items-center"
    />
  );
}

/** Composer slot wrapper — mounts the topbar brand portal above the default composer. */
export function ComposerWithTopbarBrand(props: ComposerProps) {
  return (
    <>
      <StudioTopbarTimbalPortal />
      <Composer {...props} />
    </>
  );
}

/**
 * Renders inside the thread runtime; portals the liquid-metal mark into the
 * studio header once the user has sent a message (acts as "New chat").
 */
export function StudioTopbarTimbalPortal() {
  const hasMessages = useThread((s) => s.messages.length > 0);
  const { clear } = useTimbalRuntime();
  const reduced = useReducedMotion() ?? false;
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
        <motion.div
          key="studio-topbar-timbal"
          className="flex shrink-0 items-center justify-center"
          initial={reduced ? { opacity: 0, y: 8 } : { opacity: 0, y: 14, filter: "blur(10px)" }}
          animate={reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={
            reduced
              ? { opacity: 0, y: 6, transition: { duration: 0.2 } }
              : {
                  opacity: 0,
                  y: 8,
                  filter: "blur(6px)",
                  transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
                }
          }
          transition={{ duration: reduced ? 0.35 : 0.78, ease: luxuryEase }}
          style={{ willChange: "opacity, transform, filter" }}
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
            <TimbalMark size={TOPBAR_TIMBAL_MARK_SIZE} />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    anchor,
  );
}
