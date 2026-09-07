import { TimbalChat, useWorkforces, type TimbalChatProps } from "@timbal-ai/timbal-react";
import type { ReactNode } from "react";
import { boardChatComponents } from "@/components/timbal/chat/chrome";
import { ChatFrame } from "@/components/timbal/chat/frame";
import { cx } from "@/utils/cx";

/**
 * EmbeddedChat — the chat PAGE for apps that live in a shell.
 *
 * Three chat surfaces, pick by product shape:
 * - Chat IS the app                → `src/pages/Home.tsx` (the ai-chat template layout).
 * - Data app, AI one tap away      → `AssistantPill` in the shell's `dock`.
 * - **App with a chat entry in the nav → `EmbeddedChat` as that route.**
 *
 * It renders the real streaming runtime (`TimbalChat`, BoardUI chrome via
 * `boardChatComponents`) inside `ChatFrame` — the BoardUI Pro ai-chat
 * container: a rounded `background/secondary` panel that sits in the shell's
 * page inset, level with the floating sidebar. No page title, no card around
 * the thread beyond the frame itself — the conversation IS the page.
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
 * Layout contract: the root is `flex min-h-0 flex-1 flex-col`; inside the
 * shells' viewport-owning frame the thread is the only scroller and the
 * composer stays pinned, its band painting the frame's surface.
 *
 * Workforce: explicit `workforceId` › first fetched workforce › `"default"`
 * when the list endpoint is unreachable (backendless dev — the surface still
 * renders; sends surface the error inline).
 */
export type EmbeddedChatProps = Omit<TimbalChatProps, "workforceId"> & {
  workforceId?: string;
  /** Optional `ChatFrameHeader` (breadcrumb + actions) on the frame's top edge. */
  header?: ReactNode;
};

export function EmbeddedChat({ workforceId, className, components, header, ...chatProps }: EmbeddedChatProps) {
  const { selectedId, isLoading, error } = useWorkforces({ enabled: workforceId === undefined });
  const resolved = workforceId ?? (selectedId || (error ? "default" : undefined));

  return (
    <ChatFrame header={header} className={cx(className)}>
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
          <span className="h-9 w-40 animate-pulse rounded-full bg-background-tertiary-default" />
        </div>
      ) : null}
    </ChatFrame>
  );
}
