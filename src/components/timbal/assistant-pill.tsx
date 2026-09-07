"use client";

import { useState } from "react";
import { RiSparkling2Fill } from "@remixicon/react";
import { useWorkforces } from "@timbal-ai/timbal-react";
import { AppCopilot, type AppCopilotProps } from "@timbal-ai/timbal-react/app";
import { boardChatComponents } from "@/components/timbal/chat/chrome";
import { cx } from "@/utils/cx";

/**
 * AssistantPill — the floating in-page AI for operational screens.
 *
 * Drop `<AssistantPill />` once (a shell's `dock` slot): a BoardUI pill docked
 * bottom-right opens the Timbal copilot panel (`AppCopilot` — glass panel,
 * streaming, attachments, artifacts; portaled to `document.body`). The
 * runtime's own SiriWave trigger is hidden in favour of the house pill; the
 * thread chrome is `boardChatComponents`.
 *
 * Workforce: explicit `workforceId` › first fetched › `"default"` when the
 * list endpoint is unreachable (the pill still renders backendless).
 *
 * ```tsx
 * <SidebarShell … dock={<AssistantPill label="Ask Acme" context={{ page: "invoices" }} />} />
 * ```
 * Control it yourself with `open` / `onOpenChange` (e.g. from a topbar button).
 */
export interface AssistantPillProps extends Omit<AppCopilotProps, "workforceId" | "hideTrigger" | "triggerLabel"> {
  workforceId?: string;
  /** Pill text + panel label. Default "Assistant". */
  label?: string;
  /** Extra classes on the pill (e.g. lift it above a bottom bar). */
  className?: string;
}

export function AssistantPill({
  workforceId,
  label = "Assistant",
  className,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  components,
  ...copilotProps
}: AssistantPillProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const { selectedId, error } = useWorkforces({ enabled: workforceId === undefined });
  const resolved = workforceId ?? (selectedId || (error ? "default" : undefined));
  // Still resolving (list request in flight): nothing to dock yet.
  if (!resolved) return null;

  return (
    <>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className={cx(
          "fixed z-40 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full pr-4 pl-3",
          "right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(1rem+env(safe-area-inset-bottom))]",
          "border border-border-button-default bg-background-primary-default text-text-primary shadow-lg",
          "transition-[background-color,border-color,opacity,transform,translate,scale,filter] duration-200 ease-out motion-reduce:transition-none",
          "hover:bg-background-primary-hover hover:border-border-button-hover active:bg-background-primary-active",
          "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus-ring",
          open ? "pointer-events-none scale-90 opacity-0 blur-[2px]" : "scale-100 opacity-100 blur-0",
          className,
        )}
      >
        <RiSparkling2Fill className="size-5 shrink-0 text-accent-500" aria-hidden />
        <span className="text-body-medium whitespace-nowrap">{label}</span>
      </button>
      <AppCopilot
        {...copilotProps}
        workforceId={resolved}
        components={components ?? boardChatComponents}
        triggerLabel={label}
        hideTrigger
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
