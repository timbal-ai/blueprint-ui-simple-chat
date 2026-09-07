import type { ReactNode } from "react";
import type { RemixiconComponentType } from "@remixicon/react";

import { Breadcrumb, BreadcrumbItem } from "@/components/base/breadcrumb/breadcrumb";
import { cx } from "@/utils/cx";

/**
 * ChatFrame — the BoardUI Pro `ai-chat` container grammar (Figma "ai_chat" →
 * Chat_container) as the surface every Timbal chat sits on.
 *
 * A radius-3xl `background/secondary` panel with an optional breadcrumb header
 * row; the thread fills the rest and its pinned composer band paints the same
 * surface (`--thread-canvas`). White cards — the composer, user bubbles — then
 * read as cards, the way they do in the template, instead of dissolving into
 * a white page. Inside a shell the frame sits in the page inset, so it lines
 * up with the floating sidebar instead of running edge to edge under it.
 *
 * ```tsx
 * <ChatFrame header={<ChatFrameHeader crumbs={[{ label: "Support agent" }, { label: "New chat", current: true }]} />}>
 *   <TimbalChat … className="min-h-0 flex-1" />
 * </ChatFrame>
 * ```
 */
export function ChatFrame({
  header,
  children,
  className,
}: {
  header?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      data-slot="chat-frame"
      className={cx(
        "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-3xl bg-background-secondary-default",
        className,
      )}
      style={{ ["--thread-canvas" as string]: "var(--color-background-secondary-default)" }}
    >
      {header}
      {children}
    </section>
  );
}

export interface ChatFrameCrumb {
  label: string;
  icon?: RemixiconComponentType;
  href?: string;
  current?: boolean;
}

/**
 * The container's header row: `project › chat` breadcrumb on the left,
 * icon actions on the right (px-4 pt-4, the template's measurements).
 */
export function ChatFrameHeader({
  crumbs,
  actions,
  className,
}: {
  crumbs: ChatFrameCrumb[];
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cx("flex w-full shrink-0 items-center justify-between gap-2 px-4 pt-4", className)}>
      <Breadcrumb aria-label="Chat location" className="min-w-0 flex-1">
        {crumbs.map((crumb) => (
          <BreadcrumbItem key={crumb.label} icon={crumb.icon} href={crumb.href} current={crumb.current}>
            {crumb.label}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}
