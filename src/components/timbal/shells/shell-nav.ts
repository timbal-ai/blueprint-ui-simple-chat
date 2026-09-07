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
  /**
   * Only an exact URL match activates this item. Defaults to true for `"/"`
   * (so Home doesn't light up on every nested route) and false otherwise
   * (so `/invoices` stays selected on `/invoices/42`).
   */
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

/** `contacts` → `/contacts`; trailing slashes dropped except for `/`. */
export function normalizeNavPath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed || trimmed === "/") return "/";
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withSlash.length > 1 && withSlash.endsWith("/") ? withSlash.slice(0, -1) : withSlash;
}

function itemPath(item: ShellNavItem): string {
  return normalizeNavPath(item.path);
}

/** Exact-only match for the app home; prefix match for everything else. */
function itemEnd(item: ShellNavItem): boolean {
  return item.end ?? itemPath(item) === "/";
}

/** The real home row — `end: true`, else `"/"`, else the shortest path. Never "whatever is first in the array". */
export function resolveHomeNavItem(items: ShellNavItem[]): ShellNavItem | undefined {
  if (items.length === 0) return undefined;
  return (
    items.find((item) => item.end === true) ??
    items.find((item) => itemPath(item) === "/") ??
    items.reduce((best, item) => (itemPath(item).length < itemPath(best).length ? item : best))
  );
}

/** Longest nav path matching the pathname (exact only when `end`). */
export function resolveActiveNavItem(items: ShellNavItem[], pathname: string): ShellNavItem | undefined {
  const here = normalizeNavPath(pathname);
  let best: ShellNavItem | undefined;
  for (const item of items) {
    const path = itemPath(item);
    const match = matchPath({ path, end: itemEnd(item) }, here);
    if (match && (!best || path.length > itemPath(best).length)) best = item;
  }
  return best;
}

/**
 * Breadcrumb trail from root to leaf: nav items whose path is a real prefix
 * of the URL (`/invoices` → `/invoices/42`), shortest first. `"/"` is only
 * included when you are actually on home — sibling pages are not children of
 * Overview just because `matchPath("/", …)` is greedy.
 */
export function resolveNavTrail(items: ShellNavItem[], pathname: string): ShellNavItem[] {
  const here = normalizeNavPath(pathname);
  const seen = new Map<string, ShellNavItem>();
  for (const item of items) {
    const path = itemPath(item);
    const matches = path === "/" ? here === "/" : here === path || here.startsWith(`${path}/`);
    if (matches) seen.set(path, item);
  }
  return [...seen.entries()]
    .sort(([a], [b]) => a.length - b.length)
    .map(([, item]) => item);
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
