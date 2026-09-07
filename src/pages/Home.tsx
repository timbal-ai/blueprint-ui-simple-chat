import {
  TimbalChat,
  TimbalMark,
  useOptionalSession,
  useWorkforces,
} from "@timbal-ai/timbal-react";

import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { boardChatComponents } from "@/components/timbal/chat/chrome";
import { BoardChatProvider } from "@/components/timbal/chat/context";

/**
 * Home — the chat page: BoardUI Pro chrome on the Timbal runtime.
 *
 * - The page owns its frame (ground, header row) with BoardUI tokens.
 * - `TimbalChat` is the engine: SSE streaming to `/api/workforce/{id}/stream`,
 *   attachments through the `/api/files/upload` adapter, markdown, tool calls
 *   and artifacts. Auth comes from `SessionProvider`/`AuthGuard` in App.tsx.
 * - `boardChatComponents` swaps the thread chrome (Pro composer panel,
 *   messages, agent-log tool calls, welcome, suggestions) for BoardUI's — no
 *   runtime forks. `BoardChatProvider` hands the workforce selection to the
 *   composer's picker, so choosing another workforce there re-keys the chat.
 *
 * Layout contract: viewport-high flex column; the thread is the ONLY scroll
 * container (`min-h-0 flex-1`); the composer band is pinned by the runtime and
 * paints `--thread-canvas` (set in styles/timbal-bridge.css) to match the ground.
 *
 * For a chat with a sidebar of past conversations, see registry/timbal.md
 * ("Chat with history"). For a chat page inside an app shell use
 * `components/timbal/embedded-chat.tsx`.
 */
export default function Home() {
  const session = useOptionalSession();
  const workforces = useWorkforces();
  const { selectedId, isLoading, error } = workforces;
  const workforceId = selectedId || (error ? "default" : undefined);

  return (
    <div className="flex h-dvh flex-col bg-background-full text-text-primary">
      <header className="flex h-14 shrink-0 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <TimbalMark size={22} />
          <span className="text-body-medium text-text-primary">
            {import.meta.env.VITE_APP_TITLE || "Assistant"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {session?.user ? (
            <span className="hidden text-body-2-medium text-text-secondary sm:inline">
              {session.user.user_email}
            </span>
          ) : null}
          <ThemeToggle />
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
        {workforceId ? (
          <BoardChatProvider value={workforces}>
            <TimbalChat
              key={workforceId}
              workforceId={workforceId}
              attachments
              debug={import.meta.env.DEV}
              welcome={{
                heading: import.meta.env.VITE_WELCOME_HEADING || "What can I help with?",
                subheading:
                  import.meta.env.VITE_WELCOME_SUBHEADING ||
                  "Ask anything — files and images are welcome.",
              }}
              suggestions={[
                { title: "Summarize this week" },
                { title: "Draft a product update" },
                { title: "Explain what you can do" },
              ]}
              components={boardChatComponents}
              className="min-h-0 flex-1"
            />
          </BoardChatProvider>
        ) : isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="h-9 w-40 animate-pulse rounded-full bg-background-primary-default" />
          </div>
        ) : null}
      </main>
    </div>
  );
}
