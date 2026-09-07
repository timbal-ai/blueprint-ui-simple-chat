import { RiCheckLine, RiFileCopyLine, RiRefreshLine } from "@remixicon/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import {
  ActionBarPrimitive,
  AuiIf,
  MarkdownText,
  MessagePrimitive,
  UserMessageAttachments,
} from "@timbal-ai/timbal-react";
import {
  assistantMessageRootClass,
  userMessageRootClass,
} from "@timbal-ai/timbal-react/chat";

import { TimbalToolPart } from "@/components/timbal/chat/tools";
import { cx } from "@/utils/cx";

/**
 * BoardUI Pro message chrome for the Timbal thread (`UserMessage` /
 * `AssistantMessage` slots).
 *
 * Styling follows the Pro `ai-chat` container: user turns are a right-aligned
 * white radius-2xl card with the card contact shadow (plus a hairline so the
 * card keeps its edge on a white ground); assistant turns are flat
 * 14/20 prose with a hover-revealed action row of 28px feedback buttons on the
 * tertiary surface. The Pro `AssistantMessage` / `UserMessage` wrappers in
 * `ai-chat-container.tsx` are not reused: they carry the template's mock
 * feedback row (a copy glyph that copies nothing, thumbs that only toast) and a
 * staggered reveal keyed to hand-authored `Line`s — so this file keeps the same
 * tokens on its own markup and wires the actions to the runtime instead.
 *
 * Content rendering stays in the runtime: `MessagePrimitive.Parts` with the
 * runtime's `MarkdownText` for text and `TimbalToolPart` (BoardUI agent logs,
 * runtime artifacts) for tool calls.
 */
export function BoardUserMessage() {
  return (
    <MessagePrimitive.Root className={cx(userMessageRootClass)}>
      <UserMessageAttachments />
      <div className="ml-auto w-fit max-w-[80%] rounded-2xl border border-border-button-default bg-background-primary-default px-3 py-[11px] text-left text-body-regular break-words whitespace-pre-wrap text-text-primary shadow-card sm:max-w-[75%]">
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
            tools: { Override: TimbalToolPart },
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
      className="mt-1.5 flex items-center gap-1.5 px-1 opacity-0 transition-opacity duration-150 group-hover/message:opacity-100 focus-within:opacity-100"
    >
      <ActionBarPrimitive.Copy asChild>
        <FeedbackButton label="Copy response">
          <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
            <AuiIf condition={(s) => !s.message.isCopied}>
              <RiFileCopyLine className={FEEDBACK_GLYPH} aria-hidden />
            </AuiIf>
            <AuiIf condition={(s) => s.message.isCopied}>
              <RiCheckLine className={FEEDBACK_GLYPH} aria-hidden />
            </AuiIf>
          </span>
        </FeedbackButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <FeedbackButton label="Regenerate response">
          <RiRefreshLine className={FEEDBACK_GLYPH} aria-hidden />
        </FeedbackButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
}

const FEEDBACK_GLYPH = cx(
  "size-4 text-foreground-icon-secondary transition-colors duration-150 ease",
  "group-hover/feedback:text-foreground-icon-primary",
);

/** 28px square action (p 6 + 16px glyph) on the tertiary surface — the Pro
 *  template's feedback button, bound to a runtime action via `asChild`. */
function FeedbackButton({
  label,
  children,
  className,
  ...rest
}: { label: string; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx(
        "group/feedback flex cursor-pointer items-center rounded-lg bg-background-tertiary-default p-1.5",
        "transition-colors duration-150 ease outline-none hover:bg-background-secondary-hover",
        "focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
