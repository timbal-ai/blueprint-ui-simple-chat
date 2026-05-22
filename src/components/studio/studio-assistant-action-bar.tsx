import { ActionBarMorePrimitive, AuiIf } from "@assistant-ui/react";
import { ActionBarPrimitive } from "@timbal-ai/timbal-react";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  MoreHorizontalIcon,
  RefreshCwIcon,
} from "lucide-react";

import { StudioTooltipIconButton } from "@/components/studio/studio-tooltip-icon-button";
import { cn } from "@/lib/utils";

const actionBarMenuContentClass =
  "aui-action-bar-more-content z-50 min-w-36 overflow-hidden rounded-lg border border-neutral-200 bg-white p-1 text-foreground shadow-md dark:border-white/10 dark:bg-zinc-900";

const actionBarMenuItemClass =
  "aui-action-bar-more-item flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground outline-none hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800";

const actionBarIconButtonClass =
  "size-6 min-h-6 min-w-6 text-muted-foreground/45 hover:text-muted-foreground/80 [&>span:first-child]:bg-transparent [&>span:first-child]:group-hover/tbv2:bg-neutral-100/50 dark:[&>span:first-child]:group-hover/tbv2:bg-white/8";

/** Copy, regenerate, and export — same slots as timbal-react `AssistantActionBar`. */
export function StudioAssistantActionBar() {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="aui-assistant-action-bar-root flex items-center gap-0 bg-transparent px-0 py-0.5 text-muted-foreground/60 data-floating:absolute data-floating:z-10"
    >
      <ActionBarPrimitive.Copy asChild>
        <StudioTooltipIconButton
          tooltip="Copy"
          variant="ghost"
          size="xs"
          className={actionBarIconButtonClass}
        >
          <AuiIf condition={(s) => s.message.isCopied}>
            <CheckIcon className="size-3" />
          </AuiIf>
          <AuiIf condition={(s) => !s.message.isCopied}>
            <CopyIcon className="size-3" />
          </AuiIf>
        </StudioTooltipIconButton>
      </ActionBarPrimitive.Copy>

      <ActionBarPrimitive.Reload asChild>
        <StudioTooltipIconButton
          tooltip="Regenerate"
          variant="ghost"
          size="xs"
          className={actionBarIconButtonClass}
        >
          <RefreshCwIcon className="size-3" />
        </StudioTooltipIconButton>
      </ActionBarPrimitive.Reload>

      <ActionBarMorePrimitive.Root>
        <ActionBarMorePrimitive.Trigger asChild>
          <StudioTooltipIconButton
            tooltip="More"
            variant="ghost"
            size="xs"
            className={cn(
              actionBarIconButtonClass,
              "data-[state=open]:text-muted-foreground/80",
            )}
          >
            <MoreHorizontalIcon className="size-3" />
          </StudioTooltipIconButton>
        </ActionBarMorePrimitive.Trigger>
        <ActionBarMorePrimitive.Content
          side="bottom"
          align="start"
          className={actionBarMenuContentClass}
        >
          <ActionBarPrimitive.ExportMarkdown asChild>
            <ActionBarMorePrimitive.Item className={actionBarMenuItemClass}>
              <DownloadIcon className="size-4 shrink-0" />
              Export as Markdown
            </ActionBarMorePrimitive.Item>
          </ActionBarPrimitive.ExportMarkdown>
        </ActionBarMorePrimitive.Content>
      </ActionBarMorePrimitive.Root>
    </ActionBarPrimitive.Root>
  );
}
