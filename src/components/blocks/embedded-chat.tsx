import {
  TimbalChat,
  useWorkforces,
  type TimbalChatProps,
} from "@timbal-ai/timbal-react";

import { PAGE_INSET_NEGATE_CLASS } from "@/lib/page-inset";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { studioChatComponents } from "@/lib/studio-chat-chrome";

/**
 * EmbeddedChat — the chat page for apps that live in `RoutedAppShell`.
 *
 * This is the third chat surface, between the full-viewport shell and the
 * floating pill:
 *
 * - Chat-first product, chat IS the app  → `TimbalChatShell` on its own route.
 * - Data app, AI one tap away            → `AssistantPill` in the shell dock.
 * - **App with a chat PAGE in the nav    → `EmbeddedChat` as that route.**
 *
 * It renders the real streaming runtime (`TimbalChat`) directly on the
 * shell's white content card — full-bleed, edge to edge. NO `PageHeader`, NO
 * title/subtitle, NO bordered card around the thread: a chat page framed
 * like a widget ("Copilot financiero" + description + chat-in-a-box) is the
 * named mistake this block exists to kill. The conversation should feel
 * native to the app, like the sidebar simply has a chat room in it.
 *
 * Mount it as a ROUTE inside `RoutedAppShell` — nothing else on the page:
 *
 * ```tsx
 * <Route element={<RoutedAppShell brand={…} nav={NAV} />}>
 *   <Route index element={<DashboardPage />} />
 *   <Route path="/copilot" element={<EmbeddedChat welcome={…} suggestions={…} />} />
 * </Route>
 * ```
 *
 * Layout contract (why this never breaks):
 * - The root negates the shell's page inset (`PAGE_INSET_NEGATE_CLASS`) so
 *   the thread owns the content card edge-to-edge; the thread supplies its
 *   own breathing room and centered column.
 * - `flex-1 min-h-0` + the runtime thread's internal viewport keep the
 *   MESSAGE LIST as the only scroller and the composer pinned — the page
 *   itself never scrolls.
 * - `bg-card` + `--thread-canvas: var(--card)`: the whole surface, including
 *   the sticky band behind the composer, is the same white as the content
 *   card. This is the fix for the classic seam (gray canvas showing through
 *   behind the messages while the composer band paints white).
 *
 * Workforce resolution matches `AssistantPill`: explicit `workforceId` >
 * first fetched workforce > "default" when the list endpoint is unreachable
 * (backendless dev/CI — the surface still renders; sends surface the error).
 */
function EmbeddedChat({
  workforceId,
  className,
  components,
  ...chatProps
}: Omit<TimbalChatProps, "workforceId"> & { workforceId?: string }) {
  const { selectedId, isLoading, error } = useWorkforces({
    enabled: workforceId === undefined,
  });
  const resolved =
    workforceId ?? (selectedId || (error ? "default" : undefined));

  return (
    <div
      data-slot="embedded-chat"
      className={cn(
        "flex min-h-0 flex-1 flex-col bg-card",
        PAGE_INSET_NEGATE_CLASS,
        className,
      )}
      style={{ ["--thread-canvas" as string]: "var(--card)" }}
    >
      {resolved ? (
        <TimbalChat
          key={resolved}
          workforceId={resolved}
          components={components ?? studioChatComponents}
          className="min-h-0 flex-1"
          {...chatProps}
        />
      ) : isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="text-muted-foreground" />
        </div>
      ) : null}
    </div>
  );
}

export { EmbeddedChat };
