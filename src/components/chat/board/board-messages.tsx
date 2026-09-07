import {
  RiCheckLine,
  RiFileCopyLine,
  RiRefreshLine,
} from "@remixicon/react";
import type { ReactNode } from "react";
import {
  ActionBarPrimitive,
  AuiIf,
  MarkdownText,
  MessagePrimitive,
  ToolArtifactFallback,
  UserMessageAttachments,
} from "@timbal-ai/timbal-react";
import {
  assistantMessageRootClass,
  userMessageRootClass,
} from "@timbal-ai/timbal-react/chat";

import { cx } from "@/utils/cx";

/**
 * BoardUI message chrome for the Timbal thread (`UserMessage` /
 * `AssistantMessage` slots). Styling follows BoardUI's free `agent-chat`
 * message: user turns are a right-aligned pill on the primary surface,
 * assistant turns are flat text with an always-mounted, hover-revealed action
 * row. Content rendering (markdown, tool calls, artifacts) stays in the
 * runtime — `MessagePrimitive.Parts` with the runtime's `MarkdownText` and
 * `ToolArtifactFallback`, identical to the stock assistant message.
 */
export function BoardUserMessage() {
  return (
    <MessagePrimitive.Root className={cx(userMessageRootClass)}>
      <UserMessageAttachments />
      <div className="ml-auto w-fit max-w-[75%] rounded-2xl bg-background-primary-default px-3 py-[11px] text-left text-body-regular break-words whitespace-pre-wrap text-text-primary shadow-card">
        <MessagePrimitive.Parts />
      </div>
    </MessagePrimitive.Root>
  );
}

export function BoardAssistantMessage() {
  return (
    <MessagePrimitive.Root
      className={cx(assistantMessageRootClass, "group/message")}
      data-role="assistant"
    >
      <div className="wrap-break-word px-1 text-body-regular leading-relaxed text-text-primary">
        <MessagePrimitive.Parts
          components={{
            Text: MarkdownText,
            tools: { Override: ToolArtifactFallback },
          }}
        />
      </div>
      <BoardMessageActions />
    </MessagePrimitive.Root>
  );
}

function BoardMessageActions() {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="never"
      className="mt-1 flex items-center gap-1 px-1 opacity-0 transition-opacity duration-150 group-hover/message:opacity-100 focus-within:opacity-100"
    >
      <ActionBarPrimitive.Copy asChild>
        <ActionButton label="Copy message">
          <AuiIf condition={(s) => s.message.isCopied}>
            <RiCheckLine className="size-4" aria-hidden />
          </AuiIf>
          <AuiIf condition={(s) => !s.message.isCopied}>
            <RiFileCopyLine className="size-4" aria-hidden />
          </AuiIf>
        </ActionButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <ActionButton label="Regenerate">
          <RiRefreshLine className="size-4" aria-hidden />
        </ActionButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
}

function ActionButton({
  label,
  children,
  ...rest
}: {
  label: string;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="flex size-7 cursor-pointer items-center justify-center rounded-md text-foreground-icon-tertiary transition-colors hover:bg-background-primary-default hover:text-foreground-icon-secondary focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:outline-none"
      {...rest}
    >
      {children}
    </button>
  );
}
