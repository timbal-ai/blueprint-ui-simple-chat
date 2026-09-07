import { useSyncExternalStore, type ReactNode } from "react";

/**
 * Toast store — a module-level list read through `useSyncExternalStore`, so
 * `toast.*()` works from event handlers, effects, fetch callbacks, anywhere.
 * `<Toaster />` (./toast.tsx) renders it. No dependencies.
 *
 * ```ts
 * toast.success("Saved", { description: "Your profile is up to date." });
 * toast.error("Upload failed", { action: { label: "Retry", onClick: retry } });
 * const id = toast.info("Syncing…", { duration: null }); // sticky
 * toast.dismiss(id);
 * ```
 */

export type ToastKind = "success" | "error" | "info" | "warning";

export interface ToastAction {
  label: ReactNode;
  onClick?: () => void;
}

export interface ToastOptions {
  description?: ReactNode;
  action?: ToastAction;
  /** Auto-dismiss delay in ms. `null` = stays until dismissed. Default 5000. */
  duration?: number | null;
  /** Stable id — re-toasting the same id replaces the existing toast. */
  id?: string;
}

export interface ToastItem {
  id: string;
  kind: ToastKind;
  title: ReactNode;
  description?: ReactNode;
  action?: ToastAction;
  duration: number | null;
}

const DEFAULT_DURATION = 5000;
const EMPTY: ToastItem[] = [];

let items: ToastItem[] = EMPTY;
let seq = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function push(kind: ToastKind, title: ReactNode, options: ToastOptions = {}): string {
  const id = options.id ?? `toast-${++seq}`;
  const next: ToastItem = {
    id,
    kind,
    title,
    description: options.description,
    action: options.action,
    duration: options.duration === undefined ? DEFAULT_DURATION : options.duration,
  };
  items = [...items.filter((item) => item.id !== id), next];
  emit();
  return id;
}

export const toast = {
  success: (title: ReactNode, options?: ToastOptions) => push("success", title, options),
  error: (title: ReactNode, options?: ToastOptions) => push("error", title, options),
  info: (title: ReactNode, options?: ToastOptions) => push("info", title, options),
  warning: (title: ReactNode, options?: ToastOptions) => push("warning", title, options),
  /** Remove one toast, or every toast when called without an id. */
  dismiss(id?: string) {
    items = id === undefined ? EMPTY : items.filter((item) => item.id !== id);
    emit();
  },
};

/** Live list of open toasts (`<Toaster />` reads it; use it for a custom region). */
export function useToasts(): ToastItem[] {
  return useSyncExternalStore(
    subscribe,
    () => items,
    () => EMPTY,
  );
}
