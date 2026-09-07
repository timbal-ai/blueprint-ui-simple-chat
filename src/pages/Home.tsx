import { useCallback, useEffect, useRef, useState } from "react";
import { RiMenuLine, RiSparklingLine } from "@remixicon/react";
import {
  Thread,
  TimbalMark,
  TimbalRuntimeProvider,
  useConversation,
  useOptionalSession,
  useTimbalRuntime,
  useWorkforces,
} from "@timbal-ai/timbal-react";
import { useNavigate, useParams } from "react-router-dom";

import { IconButton } from "@/components/base/buttons/icon-button";
import { boardChatComponents } from "@/components/timbal/chat/chrome";
import { BoardChatProvider } from "@/components/timbal/chat/context";
import { ChatFrame, ChatFrameHeader } from "@/components/timbal/chat/frame";
import { ChatHistoryRail } from "@/components/timbal/chat/history-rail";
import { Sheet } from "@/components/timbal/overlays/sheet";
import { SHELL_DESKTOP_QUERY, useMediaQuery, useShellUser } from "@/components/timbal/shells/shell-nav";

/**
 * Home — the chat product, laid out as the BoardUI Pro `ai-chat` template
 * (Figma "ai_chat": 12px frame, floating 260px sidebar, the chat container
 * flexing beside it) with the Timbal runtime doing the work:
 *
 * - `ChatHistoryRail` lists the workforce's past conversations
 *   (`useConversations`) as routes: `/chat` is a new thread, `/chat/:id` an
 *   old one. Below `md` the rail becomes a drawer opened from the frame header.
 * - `ChatFrame` is the template's container (secondary surface, breadcrumb
 *   header); `Thread` + `boardChatComponents` render the conversation with
 *   BoardUI Pro chrome; `TimbalRuntimeProvider` owns streaming, uploads and
 *   artifacts. The runtime is composed (provider + thread) rather than
 *   `TimbalChat` so `ConversationSync` can sit inside it.
 * - `ConversationSync` hydrates `/chat/:id` through `useConversation` →
 *   `loadMessages`, clears the thread on `/chat`, and once a fresh thread's
 *   first turn lands, rewrites the URL to its run id so the rail selects it.
 *
 * Workforce: `useWorkforces` picks the first one; the composer's picker can
 * switch (shared through `BoardChatProvider`), which starts a new thread.
 */
export default function Home() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const session = useOptionalSession();
  const user = useShellUser();
  const workforces = useWorkforces();
  const { selectedId, selected, isLoading, error } = workforces;
  const workforceId = selectedId || (error ? "default" : undefined);
  const isDesktop = useMediaQuery(SHELL_DESKTOP_QUERY);
  const [railOpen, setRailOpen] = useState(false);
  // Reported by ConversationSync from inside the runtime: the open thread's
  // title (its first user message) and a counter that bumps when a fresh
  // thread gets its id, so the rail re-lists.
  const [title, setTitle] = useState<string | null>(null);
  const [historyVersion, setHistoryVersion] = useState(0);
  const bumpHistory = useCallback(() => setHistoryVersion((v) => v + 1), []);

  // Switching workforce (picker) leaves the old conversation behind. The
  // first resolution (undefined → id) must keep a deep-linked /chat/:id.
  const previousWorkforce = useRef<string | undefined>(undefined);
  useEffect(() => {
    const previous = previousWorkforce.current;
    previousWorkforce.current = workforceId;
    if (previous && workforceId && previous !== workforceId && conversationId) {
      navigate("/chat", { replace: true });
    }
    // Only when the workforce changes — not on every conversation change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workforceId]);

  const brand = {
    name: import.meta.env.VITE_APP_TITLE || "Assistant",
    subtitle: session?.user ? undefined : "Timbal",
    logo: <TimbalMark size={32} />,
  };
  const railProps = { brand, workforceId, activeId: conversationId, user, refreshKey: historyVersion };

  return (
    <div className="flex h-dvh w-full gap-4 bg-background-full p-3 text-text-primary">
      <ChatHistoryRail {...railProps} className="hidden md:flex" />

      <ChatFrame
        header={
          <ChatFrameHeader
            crumbs={[
              { label: selected?.name ?? "Workforce", icon: RiSparklingLine },
              { label: conversationId ? (title ?? "Conversation") : "New chat", current: true },
            ]}
            actions={
              <IconButton
                icon={RiMenuLine}
                size="small"
                aria-label="Open conversations"
                onClick={() => setRailOpen(true)}
                className="md:hidden"
              />
            }
          />
        }
      >
        {workforceId ? (
          <BoardChatProvider value={workforces}>
            <TimbalRuntimeProvider key={workforceId} workforceId={workforceId} attachments debug={import.meta.env.DEV}>
              <ConversationSync
                conversationId={conversationId}
                workforceId={workforceId}
                onTitle={setTitle}
                onAdopted={bumpHistory}
              />
              <Thread
                welcome={{
                  heading: import.meta.env.VITE_WELCOME_HEADING || "What can I help with?",
                  subheading:
                    import.meta.env.VITE_WELCOME_SUBHEADING || "Ask anything — files and images are welcome.",
                }}
                suggestions={[
                  { title: "Summarize this week" },
                  { title: "Draft a product update" },
                  { title: "Explain what you can do" },
                ]}
                components={boardChatComponents}
                className="min-h-0 flex-1"
              />
            </TimbalRuntimeProvider>
          </BoardChatProvider>
        ) : isLoading ? (
          <div className="flex flex-1 items-center justify-center" aria-busy>
            <span className="h-9 w-40 animate-pulse rounded-full bg-background-tertiary-default" />
          </div>
        ) : null}
      </ChatFrame>

      <Sheet
        isOpen={railOpen && !isDesktop}
        onOpenChange={setRailOpen}
        side="left"
        size="sm"
        aria-label="Conversations"
        backdropClassName="bg-black/10"
        className="border-border-button-white bg-background-secondary-default shadow-sidebar"
      >
        <ChatHistoryRail {...railProps} mobile onClose={() => setRailOpen(false)} onNavigate={() => setRailOpen(false)} />
      </Sheet>
    </div>
  );
}

/**
 * Keeps the runtime's thread in step with the URL. Renders nothing.
 * - `/chat/:id` → fetch the conversation's turns and `loadMessages` them (once per id).
 * - `/chat`     → `clear()` whatever was loaded.
 * - A new thread's first assistant turn carries the root run id → replace the
 *   URL with `/chat/:runId` without remounting, so history and refresh work.
 */
function ConversationSync({
  conversationId,
  workforceId,
  onTitle,
  onAdopted,
}: {
  conversationId?: string;
  workforceId: string;
  /** The thread's title (first user message), or null while empty. */
  onTitle: (title: string | null) => void;
  /** A fresh thread just received its run id (the rail should re-list). */
  onAdopted: () => void;
}) {
  const runtime = useTimbalRuntime();
  const navigate = useNavigate();

  const firstUser = runtime.messages.find((m) => m.role === "user");
  const firstText = firstUser?.content.find((part) => part.type === "text");
  const title = firstText && "text" in firstText ? firstLine(firstText.text) : null;
  useEffect(() => {
    onTitle(title);
  }, [title, onTitle]);
  // The conversation whose turns the thread currently holds: hydrated from
  // history, or a fresh thread that just got its run id. Kept in a ref (the
  // source of truth, written synchronously so a navigate() landing before or
  // after the state update can't reopen a fetch) mirrored into state to render.
  const heldRef = useRef<string | null>(null);
  const [held, setHeld] = useState<string | null>(null);
  const hold = (id: string | null) => {
    heldRef.current = id;
    setHeld(id);
  };

  const needsLoad = Boolean(conversationId) && conversationId !== held && conversationId !== heldRef.current;
  const { messages, isLoading, error } = useConversation({
    conversationId: needsLoad ? conversationId : null,
    workforceId,
    enabled: needsLoad,
  });

  // The hook starts with isLoading=false and empty messages, so "not loading"
  // alone is not "loaded": wait until a fetch for this id has started and ended.
  const fetchStarted = useRef(false);
  useEffect(() => {
    if (isLoading) fetchStarted.current = true;
  }, [isLoading]);
  useEffect(() => {
    if (!needsLoad || !conversationId || isLoading || !fetchStarted.current) return;
    fetchStarted.current = false;
    if (error) {
      console.error("[chat] could not load conversation", conversationId, error);
      runtime.clear();
    } else {
      runtime.loadMessages(messages);
    }
    hold(conversationId);
    // `runtime` is a stable provider value; `messages` changes when the fetch lands.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsLoad, isLoading, error, messages, conversationId]);

  // `/chat` while holding something → new thread.
  useEffect(() => {
    if (conversationId || heldRef.current === null) return;
    runtime.clear();
    hold(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // A fresh thread (nothing held, no id in the URL) gets its id from the first
  // assistant turn. Hydrated turns carry run ids too, hence the `held` guard.
  const firstRunId = runtime.messages.find((m) => m.role === "assistant" && m.runId)?.runId;
  const freshRunId = !conversationId && held === null ? firstRunId : undefined;
  useEffect(() => {
    if (!freshRunId) return;
    hold(freshRunId);
    navigate(`/chat/${encodeURIComponent(freshRunId)}`, { replace: true });
    onAdopted();
  }, [freshRunId, navigate, onAdopted]);

  return null;
}

function firstLine(text: string): string {
  const line = text.trim().split("\n")[0];
  return line.length > 60 ? `${line.slice(0, 57)}…` : line;
}
