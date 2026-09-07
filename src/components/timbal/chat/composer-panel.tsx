import { RiAttachment2, RiSparklingLine, RiStopFill } from "@remixicon/react";
import { useComposer } from "@assistant-ui/react";
import { useEffect, useMemo, useRef, type ChangeEvent, type ClipboardEvent } from "react";
import {
  AuiIf,
  ComposerPrimitive,
  useComposerRuntime,
  useThread,
  useWorkforces,
  type ComposerProps,
} from "@timbal-ai/timbal-react";

import { AgentThinking } from "@/components/application/agent-thinking/agent-thinking";
import { ComposerPanel } from "@/components/application/composer-panel/composer-panel";
import type { ModelProvider } from "@/components/application/composer-panel/model-picker";
import { useTileAttachments } from "@/components/timbal/chat/attachment-tiles";
import { useBoardChatWorkforces } from "@/components/timbal/chat/context";
import { cx } from "@/utils/cx";

/**
 * BoardUI Pro `ComposerPanel` mounted as the `Composer` slot of `TimbalChat`.
 *
 * The vendored panel is used verbatim and driven through its props: the draft
 * is the composer runtime's text (`value`/`onValueChange` ↔ `setText`), Enter /
 * the send button call `composer.send()`, `disabled` follows the thread run
 * state, the tile strip mirrors the runtime's attachment list and the model
 * picker lists the real Timbal workforces (no fake model catalogue).
 *
 * Where the panel has no slot, the wrapper layers on top of it instead of
 * forking the file:
 * - The vendored add menu (mock "Goal / Plan mode / Plugins" rows), the
 *   permission menu and the voice-input toggle have no runtime meaning here.
 *   They are hidden with wrapper-scoped attribute selectors on their
 *   accessible names, and an attach button that opens the runtime's file
 *   picker (hidden `<input type="file">` → `composer.addAttachment`) sits in
 *   the add menu's spot.
 * - While a run is in flight a Stop button (`ComposerPrimitive.Cancel`) is
 *   positioned over the (disabled) send button.
 * - The status tab shows the workforce name + message count, and swaps to
 *   `AgentThinking` while the agent works. `ComposerLoader` was dropped: it
 *   paints its light under a transparent child, and the panel's card is an
 *   opaque surface, so the band would never show through.
 *
 * The panel does not own any layout: the runtime's Thread pins the composer
 * slot and the message list stays the only scroll container.
 */

/* Wrapper-scoped rules that retire the vendored controls without editing the
 * vendored file. They key off the buttons' accessible names ("Add attachment",
 * "Permission: …", "Voice input"); our own attach button is labelled
 * "Attach files" so the first rule leaves it alone. */
const HIDE_VENDORED_CONTROLS = cx(
  "[&_button[aria-label^=Add]]:hidden",
  "[&_button[aria-label^=Permission]]:hidden",
  "[&_button[aria-label^=Voice]]:hidden",
);

/* The vendored card is white with a 2% shadow — designed for the template's
 * grey container, where it reads as a card. Give it a hairline so it also
 * holds its edge when a page puts it on a white ground. */
const CARD_EDGE = "[&_.rounded-3xl]:border [&_.rounded-3xl]:border-border-button-default";

/* The panel's controls row sits inside the card's 10px padding, so a 36px
 * circle at `inset 10px` lands exactly on the add menu (left) and the send
 * button (right). */
const OVERLAY_BUTTON = cx(
  "absolute bottom-2.5 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full",
  "transition-colors duration-150 ease outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
);

const WORKFORCE_LOGO = "/timbal.png";

function workforceKey(item: { id?: string; uid?: string | null; name?: string }) {
  return item.id ?? item.uid ?? item.name ?? "";
}

export function BoardComposerPanel({
  placeholder = "Ask me anything",
  showAttachments,
  noAutoFocus,
  className,
}: ComposerProps) {
  const composer = useComposerRuntime();
  const text = useComposer((s) => s.text);
  const isEmpty = useComposer((s) => s.isEmpty);
  const attachments = useComposer((s) => s.attachments);
  const accept = useComposer((s) => s.attachmentAccept);
  const isRunning = useThread((s) => s.isRunning);
  const messageCount = useThread((s) => s.messages.length);
  const attachUi = showAttachments !== false;

  // Workforce picker: the page shares its selection through context; without
  // it we read (but cannot switch) the default selection ourselves.
  const shared = useBoardChatWorkforces();
  const own = useWorkforces({ enabled: shared === null });
  const workforces = shared ?? own;
  const selectedName = workforces.selected?.name ?? "Workforce";
  const providers = useMemo<ModelProvider[]>(() => {
    const items = shared && workforces.workforces.length > 0 ? workforces.workforces : [];
    const models =
      items.length > 0
        ? items.map((item) => ({ id: workforceKey(item), name: item.name ?? workforceKey(item) }))
        : [{ id: workforces.selectedId || "workforce", name: selectedName }];
    return [{ id: "timbal", name: "Workforces", logo: WORKFORCE_LOGO, logoSize: 18, models }];
  }, [shared, workforces.workforces, workforces.selectedId, selectedName]);
  const selectedModel = workforces.selectedId || providers[0].models[0].id;

  const tiles = useTileAttachments(attachments);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (!noAutoFocus) inputRef.current?.focus();
  }, [noAutoFocus]);

  const addFiles = (files: Iterable<File>) => {
    for (const file of files) {
      composer.addAttachment(file).catch((error: unknown) => {
        console.error("[chat] attachment rejected", error);
      });
    }
  };
  const onFilesPicked = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };
  const onPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    if (!attachUi) return;
    const files = Array.from(event.clipboardData?.files ?? []);
    if (files.length === 0) return;
    event.preventDefault();
    addFiles(files);
  };

  const panel = (
    <div className={cx("relative", HIDE_VENDORED_CONTROLS, CARD_EDGE)} onPasteCapture={onPaste}>
      <ComposerPanel
        value={text}
        onValueChange={(next) => composer.setText(next)}
        onSubmit={() => {
          if (!isRunning && !isEmpty) composer.send();
        }}
        disabled={isRunning || isEmpty}
        placeholder={placeholder}
        attachments={attachUi ? tiles : undefined}
        onRemoveAttachment={(id) => {
          const index = attachments.findIndex((attachment) => attachment.id === id);
          if (index === -1) return;
          composer
            .getAttachmentByIndex(index)
            .remove()
            .catch((error: unknown) => {
              console.error("[chat] could not remove attachment", error);
            });
        }}
        providers={providers}
        model={selectedModel}
        onModelChange={(id) => {
          if (shared && id !== workforces.selectedId) workforces.setSelectedId(id);
        }}
        status={
          <BoardStatusTab
            workforceName={selectedName}
            messageCount={messageCount}
            isRunning={isRunning}
          />
        }
        inputRef={inputRef}
      />

      {attachUi ? (
        <>
          <button
            type="button"
            aria-label="Attach files"
            title="Attach files"
            onClick={() => fileRef.current?.click()}
            className={cx(
              OVERLAY_BUTTON,
              "left-2.5 bg-composer-panel-add-background text-foreground-icon-primary hover:bg-composer-panel-add-hover-background",
            )}
          >
            <RiAttachment2 className="size-5" aria-hidden />
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept={accept || undefined}
            tabIndex={-1}
            aria-hidden
            data-testid="composer-file-input"
            className="hidden"
            onChange={onFilesPicked}
          />
        </>
      ) : null}

      <AuiIf condition={(s) => s.thread.isRunning}>
        <ComposerPrimitive.Cancel asChild>
          <button
            type="button"
            aria-label="Stop generating"
            title="Stop generating"
            className={cx(
              OVERLAY_BUTTON,
              "right-2.5 bg-background-secondary-default text-foreground-icon-secondary hover:bg-background-secondary-hover",
            )}
          >
            <RiStopFill className="size-5" aria-hidden />
          </button>
        </ComposerPrimitive.Cancel>
      </AuiIf>
    </div>
  );

  return (
    <div className={cx("relative flex w-full flex-col", className)}>
      {attachUi ? (
        <ComposerPrimitive.AttachmentDropzone className="rounded-3xl data-[dragging=true]:outline-2 data-[dragging=true]:outline-dashed data-[dragging=true]:outline-accent-400">
          {panel}
        </ComposerPrimitive.AttachmentDropzone>
      ) : (
        panel
      )}
    </div>
  );
}

/**
 * The grey tab on the card's top edge (same geometry as BoardUI's
 * `ComposerStatusTab`): the workforce you are talking to on the left, the
 * thread length on the right, and the BoardUI thinking indicator while a run
 * is in flight.
 */
function BoardStatusTab({
  workforceName,
  messageCount,
  isRunning,
}: {
  workforceName: string;
  messageCount: number;
  isRunning: boolean;
}) {
  return (
    <div className="mx-7 flex h-[34px] items-center justify-between gap-3 rounded-t-2xl bg-composer-panel-tab-background px-2 py-1">
      {isRunning ? (
        <AgentThinking variant="stars" label="Thinking" className="min-w-0 px-1" />
      ) : (
        <span className="flex min-w-0 items-center gap-1">
          <RiSparklingLine
            className="size-4 shrink-0 text-foreground-icon-secondary"
            aria-hidden
          />
          <span className="truncate text-body-2-medium text-text-secondary">{workforceName}</span>
        </span>
      )}
      <span className="shrink-0 text-body-2-medium whitespace-nowrap text-text-secondary tabular-nums">
        {messageCount === 0 ? "New chat" : `${messageCount} messages`}
      </span>
    </div>
  );
}
