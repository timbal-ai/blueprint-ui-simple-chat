import { useEffect } from "react";
import { RiAddLine, RiCloseLine } from "@remixicon/react";
import { useConversations, type RunPreview } from "@timbal-ai/timbal-react";
import { Link } from "react-router-dom";

import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { Button } from "@/components/base/buttons/button";
import { ShellBrandMark, ShellUserMenu } from "@/components/timbal/shells/shell-chrome";
import type { ShellBrand, ShellUser } from "@/components/timbal/shells/shell-nav";
import { cx } from "@/utils/cx";

/**
 * ChatHistoryRail — the BoardUI Pro `ai-chat` sidebar grammar (260px floating
 * panel, "New chat" row, recent threads with relative-time chips, theme
 * toggle and account card pinned to the bottom) on real data: the workforce's
 * past conversations from `useConversations` (`GET /api/runs?roots=true`).
 *
 * Rows are router links — `/chat` for a new thread, `/chat/:id` for a past
 * one — so the URL is the selection and refresh/back work. The vendored
 * `AiChatSidebar` is not reused: it hardcodes the template's repos, actions
 * and plan card.
 */
export interface ChatHistoryRailProps {
  brand: ShellBrand;
  /** Scope the list to this workforce (recommended; the API lists everything otherwise). */
  workforceId?: string;
  /** The conversation currently open, if any. */
  activeId?: string;
  newChatPath?: string;
  conversationPath?: (id: string) => string;
  user?: ShellUser;
  /** Rendered inside the phone drawer: full width, close control. */
  mobile?: boolean;
  onClose?: () => void;
  /** Fired when a row is clicked (drawers close on it). */
  onNavigate?: () => void;
  /** Bump to re-list from the first page (e.g. after a new thread gets its id). */
  refreshKey?: number;
  className?: string;
}

export function ChatHistoryRail({
  brand,
  workforceId,
  activeId,
  newChatPath = "/chat",
  conversationPath = (id) => `/chat/${encodeURIComponent(id)}`,
  user,
  mobile = false,
  onClose,
  onNavigate,
  refreshKey = 0,
  className,
}: ChatHistoryRailProps) {
  const { conversations, isLoading, isLoadingMore, error, hasMore, loadMore, refresh } = useConversations({
    workforceId: workforceId ?? null,
    enabled: Boolean(workforceId),
  });
  useEffect(() => {
    if (refreshKey > 0) refresh().catch((err: unknown) => console.error("[chat] history refresh failed", err));
    // `refresh` is recreated by the hook; the key is the intent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return (
    <aside
      data-slot="chat-history-rail"
      className={cx(
        "flex h-full shrink-0 flex-col justify-between overflow-hidden",
        mobile
          ? "w-full p-3"
          : "w-[260px] rounded-3xl border border-border-button-white bg-background-secondary-default p-3 shadow-sidebar",
        className,
      )}
    >
      <div className="flex min-h-0 w-full flex-col gap-3">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <ShellBrandMark brand={brand} />
            <span className="flex min-w-0 flex-col items-start justify-center">
              <span className="max-w-full truncate text-body-medium text-text-primary">{brand.name}</span>
              {brand.subtitle ? (
                <span className="max-w-full truncate text-body-regular text-text-secondary">{brand.subtitle}</span>
              ) : null}
            </span>
          </div>
          {mobile ? (
            <button
              type="button"
              aria-label="Close navigation"
              onClick={onClose}
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-2lg text-foreground-icon-secondary outline-none transition-colors duration-150 ease hover:bg-background-secondary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              <RiCloseLine className="size-5" aria-hidden />
            </button>
          ) : null}
        </div>

        <nav aria-label="Chat" className="flex w-full flex-col gap-1">
          <Link
            to={newChatPath}
            onClick={onNavigate}
            aria-current={activeId ? undefined : "page"}
            className={cx(
              "flex w-full items-center gap-2 rounded-2lg p-2 outline-none transition-colors duration-150 ease",
              "focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              activeId
                ? "hover:bg-background-secondary-hover"
                : "bg-linear-to-b from-accent-500 to-accent-600 shadow-nav-selected",
            )}
          >
            <RiAddLine
              className={cx("size-5 shrink-0", activeId ? "text-foreground-icon-secondary" : "text-text-white")}
              aria-hidden
            />
            <span className={cx("text-body-medium whitespace-nowrap", activeId ? "text-text-secondary" : "text-text-white")}>
              New chat
            </span>
          </Link>
        </nav>

        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto [scrollbar-width:none]">
          <span className="px-2 text-body-medium text-text-secondary">Recent</span>
          {error ? (
            <p className="px-2 text-body-regular text-text-error-primary">Couldn't load conversations.</p>
          ) : isLoading ? (
            <ul aria-busy className="flex flex-col gap-0.5">
              {Array.from({ length: 4 }, (_, i) => (
                <li key={i} className="flex h-[30px] items-center gap-2.5 px-2">
                  <span className="h-3 flex-1 animate-pulse rounded-full bg-background-tertiary-default" />
                  <span className="h-3 w-6 animate-pulse rounded-full bg-background-tertiary-default" />
                </li>
              ))}
            </ul>
          ) : conversations.length === 0 ? (
            <p className="px-2 text-body-regular text-text-tertiary">
              {workforceId ? "No conversations yet." : "Pick a workforce to see its history."}
            </p>
          ) : (
            <nav aria-label="Recent conversations" className="flex w-full flex-col gap-0.5">
              {conversations.map((run) => {
                const id = String(run.id);
                const selected = id === activeId;
                return (
                  <Link
                    key={id}
                    to={conversationPath(id)}
                    onClick={onNavigate}
                    aria-current={selected ? "page" : undefined}
                    title={conversationLabel(run)}
                    className={cx(
                      "flex w-full items-center gap-2.5 rounded-2lg py-[5px] pr-2 pl-2 outline-none transition-colors duration-150 ease",
                      "focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                      selected ? "bg-background-secondary-hover" : "hover:bg-background-secondary-hover",
                    )}
                  >
                    <span
                      className={cx(
                        "min-w-0 flex-1 truncate text-body-medium",
                        selected ? "text-text-primary" : "text-text-secondary",
                      )}
                    >
                      {conversationLabel(run)}
                    </span>
                    <span className="inline-flex shrink-0 items-center justify-center rounded-sm bg-background-tertiary-default px-1 py-px text-caption-1-medium whitespace-nowrap text-text-secondary">
                      {relativeTime(run.created_at)}
                    </span>
                  </Link>
                );
              })}
              {hasMore ? (
                <Button
                  variant="secondary"
                  size="small"
                  disabled={isLoadingMore}
                  onClick={() => {
                    loadMore().catch((err: unknown) => console.error("[chat] load more failed", err));
                  }}
                  className="mt-1 self-start"
                >
                  {isLoadingMore ? "Loading…" : "Load more"}
                </Button>
              ) : null}
            </nav>
          )}
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-3 pt-3">
        <ThemeToggle appearance="sidebar-segmented" />
        {user ? <ShellUserMenu user={user} variant="sidebar" placement={mobile ? "top start" : "right bottom"} /> : null}
      </div>
    </aside>
  );
}

/**
 * A title for a root run. The platform's list rows carry no thread aggregate,
 * so this reads whatever the row does expose (`title`, `input.prompt`, a
 * string `input`) and otherwise falls back to the date.
 */
export function conversationLabel(run: RunPreview): string {
  const title = run.title;
  if (typeof title === "string" && title.trim()) return title.trim();
  const input = run.input;
  if (typeof input === "string" && input.trim()) return firstLine(input);
  if (input && typeof input === "object") {
    const prompt = (input as Record<string, unknown>).prompt ?? (input as Record<string, unknown>).text;
    if (typeof prompt === "string" && prompt.trim()) return firstLine(prompt);
  }
  return run.created_at
    ? `Chat · ${new Date(run.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
    : "Conversation";
}

function firstLine(text: string): string {
  const line = text.trim().split("\n")[0];
  return line.length > 60 ? `${line.slice(0, 57)}…` : line;
}

/** "now" · "34m" · "2h" · "3d" · "2w" — the template's chip vocabulary. */
export function relativeTime(iso?: string): string {
  if (!iso) return "";
  const diff = Math.max(0, Date.now() - Date.parse(iso));
  const m = Math.round(diff / 60_000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d`;
  return `${Math.round(d / 7)}w`;
}
