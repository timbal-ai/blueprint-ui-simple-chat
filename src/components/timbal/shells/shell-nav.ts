import { useCallback, useSyncExternalStore, type ReactNode } from "react";
import type { RemixiconComponentType } from "@remixicon/react";
import { useOptionalSession } from "@timbal-ai/timbal-react";
import { matchPath, useLocation } from "react-router-dom";

/**
 * Shared shell vocabulary — the nav/brand/user contracts both shells accept,
 * the URL → active-item resolution, and the content inset every page sits in.
 */

export type RemixIcon = RemixiconComponentType;

/** A navigation entry. `path` IS the route: clicking navigates client-side. */
export interface ShellNavItem {
  /** Absolute route path (`"/"`, `"/invoices"`, `"/settings/billing"`). */
  path: string;
  label: string;
  icon: RemixIcon;
  /** Counter / tag rendered at the row's end. */
  badge?: string | number;
  /** Only an exact URL match activates this item (for index/home rows). */
  end?: boolean;
  /**
   * The route owns its chrome: the shell renders neither the default header
   * nor the `dock` over it. For `EmbeddedChat` (the conversation IS the page,
   * no in-page title, nothing floating over the composer) and canvases.
   */
  bare?: boolean;
}

/** Team / product identity shown in the brand block and breadcrumb. */
export interface ShellBrand {
  name: string;
  /** Mark (≈32px). Falls back to an initials avatar. */
  logo?: ReactNode;
  /** Second line under the name (workspace, plan, tagline). */
  subtitle?: string;
}

/** The signed-in user for the account menu. Sign out is the only action. */
export interface ShellUser {
  name: string;
  email?: string;
  avatarUrl?: string;
  onSignOut?: () => void;
}

/**
 * The breathing room every page gets inside a shell's content column.
 * `bare` routes (EmbeddedChat, canvases) get the tighter frame inset instead:
 * 12px all round, the ai-chat template's measurement, so a `ChatFrame` sits
 * level with the floating sidebar's top and bottom edges.
 */
export const SHELL_INSET_CLASS = "px-3 pt-3 pb-3 sm:px-6 sm:pt-6 sm:pb-6";
export const SHELL_FRAME_INSET_CLASS = "p-3 md:pl-4";

/** Longest nav path matching the pathname (exact only when `end`). */
export function resolveActiveNavItem(items: ShellNavItem[], pathname: string): ShellNavItem | undefined {
  let best: ShellNavItem | undefined;
  for (const item of items) {
    const match = matchPath({ path: item.path, end: item.end ?? false }, pathname);
    if (match && (!best || item.path.length > best.path.length)) best = item;
  }
  return best;
}

/** The nav item the current URL lights up (main + secondary groups). */
export function useActiveNavItem(...groups: (ShellNavItem[] | undefined)[]): ShellNavItem | undefined {
  const { pathname } = useLocation();
  return resolveActiveNavItem(groups.flatMap((group) => group ?? []), pathname);
}

/**
 * The user to show: an explicit `user` prop wins; otherwise the runtime
 * session (`SessionProvider`) when someone is signed in; otherwise nothing.
 */
export function useShellUser(user?: ShellUser): ShellUser | undefined {
  const session = useOptionalSession();
  if (user) return user;
  const sessionUser = session?.user;
  if (!sessionUser) return undefined;
  return {
    name: sessionUser.user_name,
    email: sessionUser.user_email,
    avatarUrl: sessionUser.user_photo_url ?? undefined,
    onSignOut: session.logout,
  };
}

/** Subscribe to a CSS media query (false during SSR / first hydration). */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** The shells switch from in-flow sidebar / inline nav to a drawer below `md`. */
export const SHELL_DESKTOP_QUERY = "(min-width: 768px)";

/** "Ada Lovelace" → "AL"; single word → first letter. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
