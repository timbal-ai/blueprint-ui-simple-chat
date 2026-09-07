import type { ThreadComponents } from "@timbal-ai/timbal-react";

import { BoardComposer } from "@/components/timbal/chat/composer";
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
 */
export const boardChatComponents: ThreadComponents = {
  Composer: BoardComposer,
  UserMessage: BoardUserMessage,
  AssistantMessage: BoardAssistantMessage,
  Welcome: BoardWelcome,
  Suggestions: BoardSuggestions,
};
