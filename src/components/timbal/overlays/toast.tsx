"use client";

import { RiAlertFill } from "@remixicon/react";
import { MotionConfig } from "motion/react";
import {
  Notification,
  NotificationViewport,
  type NotificationPosition,
  type NotificationStatus,
} from "@/components/base/notification/notification";
import { cx } from "@/utils/cx";
import { toast, useToasts, type ToastKind } from "./toast-store";

/**
 * Toaster — the toast region. Mount it ONCE (app root or shell); fire toasts
 * with `toast.success|error|info|warning(title, options)` from ./toast-store.
 *
 * Renders BoardUI's `Notification` inside its `NotificationViewport`
 * (portaled, fixed, stacked with a spring re-layout). Each toast auto-dismisses
 * after its `duration` with Notification's countdown bar. `warning` uses the
 * neutral disc with an alert glyph — Notification has no warning status.
 * Sits above modals (`z-[120]`); `MotionConfig reducedMotion="user"` honours
 * `prefers-reduced-motion`.
 */

const STATUS: Record<ToastKind, NotificationStatus> = {
  success: "success",
  error: "error",
  info: "information",
  warning: "neutral",
};

export interface ToasterProps {
  /** Corner the stack hangs from. Default `top-right`. */
  position?: NotificationPosition;
  /** Most toasts shown at once; older ones are dropped from view. Default 4. */
  max?: number;
  /** Extra classes on the viewport (e.g. to clear a bottom bar). */
  className?: string;
}

export function Toaster({ position = "top-right", max = 4, className }: ToasterProps) {
  const all = useToasts();
  const shown = all.slice(-max);
  // Newest nearest the edge it hangs from: first for top-*, last for bottom-*.
  const ordered = position.startsWith("top") ? [...shown].reverse() : shown;

  return (
    <MotionConfig reducedMotion="user">
      <NotificationViewport position={position} className={cx("z-[120]", className)}>
        {ordered.map((item) => (
          <Notification
            key={item.id}
            title={item.title}
            description={item.description}
            status={STATUS[item.kind]}
            icon={item.kind === "warning" ? RiAlertFill : undefined}
            introDelay={0}
            autoDismissDuration={item.duration ?? undefined}
            onDismiss={() => toast.dismiss(item.id)}
            actions={
              item.action
                ? [
                    {
                      label: item.action.label,
                      onClick: () => {
                        item.action?.onClick?.();
                        toast.dismiss(item.id);
                      },
                    },
                  ]
                : undefined
            }
          />
        ))}
      </NotificationViewport>
    </MotionConfig>
  );
}
