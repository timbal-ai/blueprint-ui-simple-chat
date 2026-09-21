import { createContext, useContext, type ReactNode } from "react";
import type { UseWorkforcesResult } from "@timbal-ai/timbal-react";

/**
 * Workforce selection shared with the BoardUI chat chrome.
 *
 * `ThreadComponents` slots take no custom props, so the page that already owns
 * `useWorkforces()` (Home) hands its selection down through this context and
 * the composer's model picker (off unless `SHOW_MODEL_PICKER` is flipped)
 * would list the real workforces instead of a fake model catalogue. Without a
 * provider the chrome falls back to its own `useWorkforces()` call, so
 * `boardChatComponents` still works inside `TimbalChatShell` / `EmbeddedChat`.
 * The status tab still names the selection.
 */
export type BoardChatWorkforces = Pick<
  UseWorkforcesResult,
  "workforces" | "selectedId" | "setSelectedId" | "selected"
>;

const BoardChatContext = createContext<BoardChatWorkforces | null>(null);

export function BoardChatProvider({
  value,
  children,
}: {
  value: BoardChatWorkforces;
  children: ReactNode;
}) {
  return <BoardChatContext.Provider value={value}>{children}</BoardChatContext.Provider>;
}

/** The page-level workforce selection, or `null` when no provider is mounted. */
export function useBoardChatWorkforces() {
  return useContext(BoardChatContext);
}
