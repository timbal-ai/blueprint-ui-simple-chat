import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * ChatScreen — the ONLY sanctioned layout for a custom chat surface.
 *
 * The invariant this block exists to protect: **the composer is pinned to
 * the bottom of the viewport and the MESSAGE LIST scrolls — never the
 * page.** The classic failure is putting messages + input in normal
 * document flow, so the input gets displaced below the fold as the
 * conversation grows. That must never happen.
 *
 * How the contract works (do not "simplify" any of these):
 * - root: `h-dvh flex flex-col` — the screen owns the viewport height
 *   (`fill` mode uses `h-full min-h-0` for mounting inside an existing
 *   height-constrained pane, e.g. a resizable split).
 * - messages: `flex-1 min-h-0 overflow-y-auto` — the ONE scroll container.
 *   `min-h-0` is load-bearing: without it flexbox lets content stretch
 *   the column and push the composer off-screen.
 * - composer: `shrink-0`, plain surface (NEVER a tinted band), safe-area
 *   padding. It cannot be displaced because it is a flex sibling of the
 *   scroller, not part of the scrolled content.
 * - auto-follow: sticks to the newest message while the reader is near
 *   the bottom; stops following when they scroll up to read history.
 *
 * Prefer the real product surfaces first: full-page chat →
 * `TimbalChatShell` on its own route; chat on an app screen →
 * `AssistantPill`. Reach for ChatScreen only when the design genuinely
 * needs a bespoke chat page (custom rail, branded header, split view).
 */
function ChatScreen({
  header,
  composer,
  fill = false,
  contentClassName,
  className,
  children,
}: {
  /** Optional slim header bar (brand, thread title, actions). */
  header?: React.ReactNode;
  /** The input area — rendered pinned below the scroller, never scrolled. */
  composer: React.ReactNode;
  /** `false` (default): own the viewport (h-dvh). `true`: fill a height-constrained parent. */
  fill?: boolean;
  /** Extra classes for the centered message column (default max-w-3xl). */
  contentClassName?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const followRef = React.useRef(true);

  // Auto-follow: keep pinned to the newest message unless the reader has
  // scrolled up. MutationObserver covers streaming tokens, not just new
  // message elements.
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      followRef.current =
        el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    };
    const observer = new MutationObserver(() => {
      if (followRef.current) el.scrollTop = el.scrollHeight;
    });
    el.addEventListener("scroll", onScroll, { passive: true });
    observer.observe(el, { childList: true, subtree: true, characterData: true });
    el.scrollTop = el.scrollHeight;
    return () => {
      el.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      data-slot="chat-screen"
      // bg-card, not bg-background: the house canvas is WHITE. --background
      // is the gray desktop chrome behind floating panes — using it here is
      // the "tinted chat surface" mistake.
      className={cn(
        "flex flex-col bg-card",
        fill ? "h-full min-h-0" : "h-dvh",
        className,
      )}
    >
      {header ? <div className="shrink-0">{header}</div> : null}
      <div
        ref={scrollerRef}
        data-slot="chat-screen-messages"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6",
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
      <div
        data-slot="chat-screen-composer"
        // Plain surface on purpose — a tinted band behind the input is a
        // named mistake. pb uses safe-area so the input clears iOS bars.
        className="shrink-0 px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <div className={cn("mx-auto w-full max-w-3xl", contentClassName)}>
          {composer}
        </div>
      </div>
    </div>
  );
}

export { ChatScreen };
