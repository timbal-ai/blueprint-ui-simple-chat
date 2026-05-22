import { ArrowUpIcon, PlusIcon, SquareIcon } from "lucide-react";
import {
  ComposerAttachments,
  ComposerPrimitive,
  useThread,
} from "@timbal-ai/timbal-react";

import { StudioTooltipIconButton } from "@/components/studio/studio-tooltip-icon-button";
import { cn } from "@/lib/utils";
import { studioComposeInputShellClass } from "@/lib/studio-chrome";

export function StudioComposer({ placeholder }: { placeholder?: string }) {
  return (
    <ComposerPrimitive.Root className="aui-composer-root relative flex w-full flex-col">
      <ComposerPrimitive.AttachmentDropzone
        className={cn(
          studioComposeInputShellClass,
          "data-[dragging=true]:border-2 data-[dragging=true]:border-dashed data-[dragging=true]:border-primary data-[dragging=true]:bg-accent/50",
        )}
      >
        <ComposerAttachments />
        <ComposerPrimitive.Input
          placeholder={placeholder ?? "Send a message..."}
          className="aui-composer-input max-h-32 min-h-14 w-full resize-none bg-transparent px-3 pt-3 pb-1 text-sm outline-none placeholder:text-neutral-400 focus-visible:ring-0 dark:placeholder:text-neutral-500"
          rows={1}
          autoFocus
          aria-label="Message input"
        />
        <StudioComposerToolbar />
      </ComposerPrimitive.AttachmentDropzone>
    </ComposerPrimitive.Root>
  );
}

function StudioComposerToolbar() {
  const isRunning = useThread((s) => s.isRunning);

  return (
    <div className="aui-composer-action-wrapper flex items-center justify-between px-2.5 pb-2.5">
      <ComposerPrimitive.AddAttachment asChild>
        <StudioTooltipIconButton
          tooltip="Add attachment"
          variant="secondary"
          className="aui-composer-add-attachment shrink-0 text-neutral-500 dark:text-muted-foreground"
          aria-label="Add attachment"
        >
          <PlusIcon className="size-4 stroke-[1.5]" />
        </StudioTooltipIconButton>
      </ComposerPrimitive.AddAttachment>

      {isRunning ? (
        <ComposerPrimitive.Cancel asChild>
          <StudioTooltipIconButton
            tooltip="Stop generating"
            variant="primary"
            className="aui-composer-cancel shrink-0"
            aria-label="Stop generating"
          >
            <SquareIcon className="size-3 fill-current" />
          </StudioTooltipIconButton>
        </ComposerPrimitive.Cancel>
      ) : (
        <ComposerPrimitive.Send asChild>
          <StudioTooltipIconButton
            tooltip="Send message"
            variant="primary"
            type="submit"
            className="aui-composer-send shrink-0 disabled:opacity-30"
            aria-label="Send message"
          >
            <ArrowUpIcon className="size-4" />
          </StudioTooltipIconButton>
        </ComposerPrimitive.Send>
      )}
    </div>
  );
}
