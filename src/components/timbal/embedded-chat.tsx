import { TimbalChat, useWorkforces, type TimbalChatProps } from "@timbal-ai/timbal-react";
import { boardChatComponents } from "@/components/timbal/chat/chrome";
import { SHELL_INSET_NEGATE_CLASS } from "@/components/timbal/shells/shell-nav";
import { cx } from "@/utils/cx";

/**
 * EmbeddedChat — the chat PAGE for apps that live in a shell.
 *
 * Three chat surfaces, pick by product shape:
 * - Chat IS the app                → `src/pages/Home.tsx` (TimbalChat on its own route).
 * - Data app, AI one tap away      → `AssistantPill` in the shell's `dock`.
 * - **App with a chat entry in the nav → `EmbeddedChat` as that route.**
 *
 * It renders the real streaming runtime (`TimbalChat`, BoardUI chrome via
 * `boardChatComponents`) directly on the shell's content surface, full-bleed:
 * no title, no card, no border — the conversation IS the page.
 *
 * ```tsx
 * const NAV = [{ path: "/", … }, { path: "/chat", label: "Chat", icon: RiChatAiLine, bare: true }];
 * <Route element={<SidebarShell brand={…} nav={NAV} />}>
 *   <Route path="/chat" element={<EmbeddedChat welcome={{ heading: "Ask the team assistant" }} />} />
 * </Route>
 * ```
 * Mark the nav item `bare` so the shell renders no header and no dock over
 * the composer — the sidebar entry already names the page.
 *
 * Layout contract: the root is `flex min-h-0 flex-1 flex-col` and negates
 * the shell's lateral + bottom inset (`SHELL_INSET_NEGATE_CLASS`), so inside
 * the shells' viewport-owning frame the thread is the only scroller and the
 * composer stays pinned. `--thread-canvas` is pinned to the surface it sits
 * on (`bg-background-full`) so the composer band never shows a seam.
 *
 * Workforce: explicit `workforceId` › first fetched workforce › `"default"`
 * when the list endpoint is unreachable (backendless dev — the surface still
 * renders; sends surface the error inline).
 */
export type EmbeddedChatProps = Omit<TimbalChatProps, "workforceId"> & { workforceId?: string };

export function EmbeddedChat({ workforceId, className, components, ...chatProps }: EmbeddedChatProps) {
  const { selectedId, isLoading, error } = useWorkforces({ enabled: workforceId === undefined });
  const resolved = workforceId ?? (selectedId || (error ? "default" : undefined));

  return (
    <div
      data-slot="embedded-chat"
      className={cx("flex min-h-0 flex-1 flex-col bg-background-full", SHELL_INSET_NEGATE_CLASS, className)}
      style={{ ["--thread-canvas" as string]: "var(--color-background-full)" }}
    >
      {resolved ? (
        <TimbalChat
          key={resolved}
          workforceId={resolved}
          components={components ?? boardChatComponents}
          className="min-h-0 flex-1"
          {...chatProps}
        />
      ) : isLoading ? (
        <div className="flex flex-1 items-center justify-center" aria-busy>
          <span className="h-9 w-40 animate-pulse rounded-full bg-background-secondary-default" />
        </div>
      ) : null}
    </div>
  );
}
