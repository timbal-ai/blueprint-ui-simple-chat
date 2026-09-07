import type { ThreadComponents } from "@timbal-ai/timbal-react";

import { BoardComposer } from "@/components/timbal/chat/composer";
import { BoardComposerPanel } from "@/components/timbal/chat/composer-panel";
import { BoardAssistantMessage, BoardUserMessage } from "@/components/timbal/chat/messages";
import { BoardSuggestions, BoardWelcome } from "@/components/timbal/chat/welcome";

/**
 * BoardUI chat chrome as the `components` slot map for `TimbalChat`,
 * `TimbalChatShell`, `TimbalStudioShell` and `EmbeddedChat`. One import
 * restyles the whole thread to the BoardUI language while the runtime keeps
 * owning streaming, uploads, markdown and artifacts:
 *
 * ```tsx
 * <TimbalChat workforceId="…" attachments components={boardChatComponents} />
 * ```
 *
 * `boardChatComponents` is the Pro set: the two-row `ComposerPanel` (tile
 * strip, workforce picker, status tab) and tool calls rendered as BoardUI
 * agent logs. Wrap the page in `BoardChatProvider` (see `context.tsx`) so the
 * picker can switch workforces; without it the picker just names the current
 * one.
 */
export const boardChatComponents: ThreadComponents = {
  Composer: BoardComposerPanel,
  UserMessage: BoardUserMessage,
  AssistantMessage: BoardAssistantMessage,
  Welcome: BoardWelcome,
  Suggestions: BoardSuggestions,
};

/**
 * The free-tier set: the single-line 52px pill composer. Same messages,
 * welcome and tool rendering — pick this for narrow or embedded surfaces
 * (`EmbeddedChat` in a sidebar route, `AssistantPill`) where the two-row
 * panel would crowd the column.
 */
export const boardChatComponentsLite: ThreadComponents = {
  ...boardChatComponents,
  Composer: BoardComposer,
};
