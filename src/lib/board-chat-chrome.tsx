import type { ThreadComponents } from "@timbal-ai/timbal-react";

import { BoardComposer } from "@/components/chat/board/board-composer";
import {
  BoardAssistantMessage,
  BoardUserMessage,
} from "@/components/chat/board/board-messages";
import { BoardSuggestions, BoardWelcome } from "@/components/chat/board/board-welcome";

/**
 * BoardUI chat chrome as a `components` slot map for `TimbalChat` /
 * `TimbalChatShell` / `EmbeddedChat`. One import restyles the whole thread to
 * the BoardUI language while the runtime keeps owning streaming, uploads,
 * markdown and artifacts:
 *
 * ```tsx
 * <TimbalChat workforceId="…" attachments components={boardChatComponents} />
 * ```
 */
export const boardChatComponents: ThreadComponents = {
  Composer: BoardComposer,
  UserMessage: BoardUserMessage,
  AssistantMessage: BoardAssistantMessage,
  Welcome: BoardWelcome,
  Suggestions: BoardSuggestions,
};
