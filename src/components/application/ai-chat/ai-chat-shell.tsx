"use client";

import { useCallback, useRef, useState } from "react";
import { AiChatCodePanel } from "./ai-chat-code-panel";
import { AiChatContainer } from "./ai-chat-container";
import { AiChatSidebar } from "./ai-chat-sidebar";
import { cx } from "@/utils/cx";

/**
 * Figma source: Board UI → "ai_chat" (node 4030:5897, 1440×900).
 *
 * Full AI chat template screen on the primary background with a 12px frame
 * inset: fixed 260px sidebar, the chat container flexing to fill whatever
 * width remains, and the resizable code panel on the right (16px gap to
 * the chat, 12px to the sidebar). Hovering the chat's right edge reveals a
 * drag handle (Figma node 4040:5413) — holding and dragging it trades width
 * between the chat and the code panel. Below xl the code panel hides; below
 * lg the sidebar hides too, leaving the chat full-width.
 */

const PANEL_DEFAULT_WIDTH = 410;
const PANEL_MIN_WIDTH = 320;
const PANEL_MAX_WIDTH = 560;

/**
 * Resize grip straddling the chat container's right edge: a 15×25 white pill
 * with three grip lines, revealed on hover and while dragging. The pill
 * follows the cursor vertically along the edge; dragging calls `onResize`
 * with the horizontal delta from the drag start.
 */
function DragHandle({
  onResizeStart,
  onResize,
  isDragging,
}: {
  onResizeStart: () => void;
  onResize: (dx: number) => void;
  isDragging: boolean;
}) {
  const startX = useRef(0);
  const [gripY, setGripY] = useState<number | null>(null);

  const trackGrip = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Keep the 25px pill fully inside the edge strip
    const y = Math.min(rect.height - 13, Math.max(13, e.clientY - rect.top));
    setGripY(y);
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize panels"
      onPointerDown={(e) => {
        e.preventDefault();
        startX.current = e.clientX;
        onResizeStart();
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        trackGrip(e);
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          onResize(e.clientX - startX.current);
        }
      }}
      className="group/drag absolute inset-y-0 -right-2.5 z-10 hidden w-5 cursor-col-resize touch-none justify-center xl:flex"
    >
      <span
        style={gripY !== null ? { top: gripY } : undefined}
        className={cx(
          "absolute flex h-[25px] w-[15px] -translate-y-1/2 items-center justify-center gap-0.5 rounded-sm border border-border-button-default bg-background-primary-default shadow-xs",
          gripY === null && "top-1/2",
          "transition-opacity duration-150 ease",
          isDragging ? "opacity-100" : "opacity-0 group-hover/drag:opacity-100",
        )}
      >
        <span className="h-[13px] w-px bg-foreground-icon-quaternary" />
        <span className="h-[13px] w-px bg-foreground-icon-quaternary" />
        <span className="h-[13px] w-px bg-foreground-icon-quaternary" />
      </span>
    </div>
  );
}

export function AiChatShell({ className }: { className?: string } = {}) {
  const [panelWidth, setPanelWidth] = useState(PANEL_DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const widthAtDragStart = useRef(PANEL_DEFAULT_WIDTH);

  const handleResizeStart = useCallback(() => {
    widthAtDragStart.current = panelWidth;
    setIsDragging(true);
  }, [panelWidth]);

  const handleResize = useCallback((dx: number) => {
    // Dragging right widens the chat, so the panel gives up that width
    setPanelWidth(
      Math.min(PANEL_MAX_WIDTH, Math.max(PANEL_MIN_WIDTH, widthAtDragStart.current - dx)),
    );
  }, []);

  return (
    <div
      className={cx(
        "flex h-screen w-full gap-4 bg-background-primary-default p-3",
        isDragging && "cursor-col-resize select-none",
        className,
      )}
      onPointerUp={() => setIsDragging(false)}
      onPointerCancel={() => setIsDragging(false)}
    >
      <AiChatSidebar className="hidden lg:flex" />
      <div className="flex min-w-0 flex-1 gap-3">
        <div className="relative flex min-w-0 flex-1">
          <AiChatContainer />
          <DragHandle
            onResizeStart={handleResizeStart}
            onResize={handleResize}
            isDragging={isDragging}
          />
        </div>
        <AiChatCodePanel width={panelWidth} className="hidden xl:flex" />
      </div>
    </div>
  );
}
