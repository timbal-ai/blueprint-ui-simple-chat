import type { ThreadComponents } from "@timbal-ai/timbal-react";

import { ChatUserMessage } from "@/components/chat/user-message";
import { ChatWelcome } from "@/components/chat/welcome";

/**
 * Chat chrome registration — the `components` slot map passed to the chat
 * shells (see `pages/Home.tsx`). The visual chrome is project-owned source in
 * `src/components/chat/`; the streaming runtime, markdown/artifact rendering,
 * and thread machinery stay in `@timbal-ai/timbal-react`.
 *
 * To restyle: edit `src/components/chat/*.tsx`. To take over more surface,
 * add slots here (`AssistantMessage`, `Composer`, `Suggestions`, …) — custom
 * `AssistantMessage`/`UserMessage` slots must re-apply the layout classes
 * from `@/lib/thread-message-layout` so content stays aligned with the
 * composer column.
 */
export const studioChatComponents: ThreadComponents = {
  Welcome: ChatWelcome,
  UserMessage: ChatUserMessage,
};
