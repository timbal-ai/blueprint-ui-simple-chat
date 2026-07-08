import { useWorkforces } from "@timbal-ai/timbal-react";
import { AppCopilot, type AppCopilotProps } from "@timbal-ai/timbal-react/app";

/**
 * AssistantPill — the Timbal floating AI pill, pre-wired for this app.
 *
 * Drop `<AssistantPill />` once anywhere inside a screen (it portals its own
 * draggable SiriWave trigger + glass chat panel to `document.body`). The
 * conversation runtime, streaming, attachments, and artifact rendering are
 * the same stack as the full chat shell (`/chat`, `src/pages/Home.tsx`) and
 * read the standard `VITE_TIMBAL_*` env config — nothing else to set up.
 * Like the chat shell, it auto-selects the first available workforce when
 * `workforceId` is omitted.
 *
 * Pass `context={...}` to expose the current page's data to agent tooling,
 * or control `open`/`onOpenChange` to trigger it from your own button.
 */
function AssistantPill({
  workforceId,
  ...props
}: Omit<AppCopilotProps, "workforceId"> & { workforceId?: string }) {
  const { selectedId, isLoading, error } = useWorkforces({
    enabled: workforceId === undefined,
  });
  // Explicit id > first fetched workforce > "default" when the list endpoint
  // is unreachable (backendless dev/CI) — the pill still renders so the shell
  // looks complete; sends will surface the connection error in the panel.
  const resolved = workforceId ?? (selectedId || (error ? "default" : undefined));
  if (workforceId === undefined && isLoading) return null;
  if (!resolved) return null;
  return <AppCopilot triggerLabel="Assistant" workforceId={resolved} {...props} />;
}

export { AssistantPill };
export type { AppCopilotProps as AssistantPillProps };
