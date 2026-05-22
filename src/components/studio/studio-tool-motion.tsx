import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Matches welcome / user bubble — soft deceleration, premium feel. */
export const studioLuxuryEase = [0.16, 1, 0.3, 1] as const;

const TOOL_ENTER_MS = 0.78;
const TOOL_EXIT_MS = 0.28;

export function studioToolPresenceTransition(reduced: boolean) {
  return {
    enter: {
      duration: reduced ? 0.35 : TOOL_ENTER_MS,
      ease: studioLuxuryEase,
    },
    exit: {
      duration: reduced ? 0.2 : TOOL_EXIT_MS,
      ease: [0.4, 0, 1, 1] as const,
    },
  };
}

export type StudioToolMotionVariant = "executing" | "settled";

function toolMotionState(
  reduced: boolean,
  entering: boolean,
  variant: StudioToolMotionVariant,
) {
  if (reduced) {
    return entering
      ? { opacity: 0, y: variant === "executing" ? 8 : 10 }
      : { opacity: 1, y: 0 };
  }
  // Executing: no blur on the row — blur hid the shimmer text at runtime.
  if (variant === "executing") {
    return entering ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 };
  }
  return entering
    ? { opacity: 0, y: 14, filter: "blur(10px)" }
    : { opacity: 1, y: 0, filter: "blur(0px)" };
}

type StudioToolMotionProps = {
  children: ReactNode;
  className?: string;
  /** Stable key for AnimatePresence swaps (e.g. running → complete). */
  motionKey: string;
};

/** Tool timeline row — rise from below + blur in. */
export function StudioToolMotion({
  children,
  className,
  motionKey,
}: StudioToolMotionProps) {
  const reduced = useReducedMotion() ?? false;
  const { enter, exit } = studioToolPresenceTransition(reduced);

  return (
    <motion.div
      key={motionKey}
      className={cn("aui-studio-tool-motion w-full min-w-0", className)}
      initial={toolMotionState(reduced, true, "settled")}
      animate={toolMotionState(reduced, false, "settled")}
      exit={
        reduced
          ? { opacity: 0, y: 6, transition: exit }
          : { opacity: 0, y: 8, filter: "blur(6px)", transition: exit }
      }
      transition={enter}
      style={{ willChange: "opacity, transform, filter" }}
    >
      {children}
    </motion.div>
  );
}

type StudioToolPresenceProps = {
  presenceKey: string;
  children: ReactNode;
  className?: string;
  /** Executing rows skip blur so shimmer stays readable. */
  variant?: StudioToolMotionVariant;
};

/** Wraps running ↔ complete (or other) tool states with a short crossfade. */
export function StudioToolPresence({
  presenceKey,
  children,
  className,
  variant = "settled",
}: StudioToolPresenceProps) {
  const reduced = useReducedMotion() ?? false;
  const { enter, exit } = studioToolPresenceTransition(reduced);
  const enterTransition =
    variant === "executing"
      ? { duration: reduced ? 0.3 : 0.52, ease: studioLuxuryEase }
      : enter;

  return (
    <AnimatePresence mode="wait" initial>
      <motion.div
        key={presenceKey}
        className={cn("aui-studio-tool-presence w-full min-w-0", className)}
        initial={toolMotionState(reduced, true, variant)}
        animate={toolMotionState(reduced, false, variant)}
        exit={
          reduced
            ? { opacity: 0, y: 6, transition: exit }
            : { opacity: 0, y: 8, filter: "blur(6px)", transition: exit }
        }
        transition={enterTransition}
        style={{
          willChange:
            variant === "executing" ? "opacity, transform" : "opacity, transform, filter",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

type StudioToolBodyPresenceProps = {
  open: boolean;
  children: ReactNode;
  className?: string;
};

/**
 * Expanded tool trace — CSS grid row collapse (smooth contract) + opacity.
 * Avoids AnimatePresence exit lag on close.
 */
export function StudioToolBodyPresence({
  open,
  children,
  className,
}: StudioToolBodyPresenceProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <div
      className={cn(
        "aui-studio-tool-body grid min-h-0 transition-[grid-template-rows]",
        open
          ? reduced
            ? "duration-200 ease-out"
            : "duration-[340ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          : reduced
            ? "duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]"
            : "duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
      )}
      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
    >
      <div className="min-h-0 overflow-hidden">
        <div
          className={cn(
            className,
            "transition-opacity",
            open
              ? reduced
                ? "opacity-100 duration-200 ease-out"
                : "opacity-100 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75"
              : reduced
                ? "opacity-0 duration-100 ease-in"
                : "opacity-0 duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
