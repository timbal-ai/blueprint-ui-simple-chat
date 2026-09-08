import {
  RiArrowUpLine,
  RiAttachment2,
  RiSparklingLine,
  RiStopFill,
} from "@remixicon/react";
import type { KeyboardEvent } from "react";
import {
  AuiIf,
  ComposerAttachments,
  ComposerPrimitive,
  useComposerRuntime,
  useThread,
  type ComposerProps,
} from "@timbal-ai/timbal-react";

import { AgentThinking } from "@/components/application/agent-thinking/agent-thinking";
import { ComposerLoader } from "@/components/application/composer-loader/composer-loader";
import { cx } from "@/utils/cx";

/**
 * BoardUI composer pill mounted as the `Composer` slot of `TimbalChat`.
 *
 * Chrome = BoardUI's free `agent-composer` (52px pill, 36px circular controls,
 * `ComposerLoader` light while the agent works, `AgentThinking` above it).
 * Engine = the Timbal runtime through assistant-ui primitives — the input,
 * send/cancel, attachments and dropzone all bind to the thread runtime, so
 * streaming, uploads (`/api/files/upload` adapter) and artifacts keep working
 * exactly as with the stock composer. Nothing in here talks to the network.
 */
export function BoardComposer({
  placeholder = "Ask me anything",
  showAttachments,
  toolbar,
  noAutoFocus,
  className,
}: ComposerProps) {
  const isRunning = useThread((s) => s.isRunning);
  const messageCount = useThread((s) => s.messages.length);
  const attachUi = showAttachments !== false;

  const pill = (
    <div className="flex w-full flex-col gap-2.5">
      {isRunning ? (
        <AgentThinking variant="stars" label="Thinking" className="px-3" />
      ) : null}

      {attachUi ? <ComposerAttachments /> : null}

      <ComposerLoader active={isRunning}>
        <div
          className={cx(
            "flex min-h-[52px] w-full items-end gap-2.5 rounded-full border p-2",
            isRunning
              ? "border-transparent bg-transparent"
              : "border-border-button-default bg-background-primary-default shadow-xs",
          )}
        >
          {attachUi ? (
            <ComposerPrimitive.AddAttachment asChild>
              <button
                type="button"
                aria-label="Add attachment"
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ai-chat-composer-add-background text-foreground-icon-primary transition-colors duration-150 hover:bg-ai-chat-composer-add-hover-background disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RiAttachment2 className="size-5" aria-hidden />
              </button>
            </ComposerPrimitive.AddAttachment>
          ) : null}

          <BoardComposerInput placeholder={placeholder} autoFocus={!noAutoFocus} />

          <div className="flex shrink-0 items-center gap-2 pl-1.5">
            {toolbar}
            <AuiIf condition={(s) => s.thread.isRunning}>
              <ComposerPrimitive.Cancel asChild>
                <button
                  type="button"
                  aria-label="Stop generating"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-background-secondary-default text-foreground-icon-secondary transition-colors hover:bg-background-secondary-hover"
                >
                  <RiStopFill className="size-5" aria-hidden />
                </button>
              </ComposerPrimitive.Cancel>
            </AuiIf>
            <AuiIf condition={(s) => !s.thread.isRunning}>
              <ComposerPrimitive.Send asChild>
                <button
                  type="submit"
                  aria-label="Send message"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-button-primary text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RiArrowUpLine className="size-5" aria-hidden />
                </button>
              </ComposerPrimitive.Send>
            </AuiIf>
          </div>
        </div>
      </ComposerLoader>

      <div className="flex h-[26px] w-full items-center justify-end">
        <span className="flex items-center gap-1">
          <RiSparklingLine
            className="size-4 shrink-0 text-foreground-icon-secondary"
            aria-hidden
          />
          <span className="whitespace-nowrap text-body-2-medium text-text-secondary">
            {messageCount === 0 ? "New chat" : `${messageCount} messages`}
          </span>
        </span>
      </div>
    </div>
  );

  return (
    <ComposerPrimitive.Root
      className={cx("relative flex w-full flex-col", className)}
    >
      {attachUi ? (
        <ComposerPrimitive.AttachmentDropzone className="rounded-[34px] data-[dragging=true]:outline-2 data-[dragging=true]:outline-dashed data-[dragging=true]:outline-accent-400">
          {pill}
        </ComposerPrimitive.AttachmentDropzone>
      ) : (
        pill
      )}
    </ComposerPrimitive.Root>
  );
}

function BoardComposerInput({
  placeholder,
  autoFocus,
}: {
  placeholder: string;
  autoFocus: boolean;
}) {
  const composer = useComposerRuntime();
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      composer.send();
    }
  };
  return (
    <ComposerPrimitive.Input
      asChild
      placeholder={placeholder}
      rows={1}
      autoFocus={autoFocus}
      aria-label="Message input"
      onKeyDown={onKeyDown}
    >
      <textarea className="my-2 max-h-40 min-h-5 min-w-0 flex-1 resize-none self-center bg-transparent text-body-regular text-text-primary caret-text-primary outline-none field-sizing-content placeholder:text-text-secondary" />
    </ComposerPrimitive.Input>
  );
}
