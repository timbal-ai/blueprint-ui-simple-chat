import {
  MessagePrimitive,
  UserMessageAttachments,
} from "@timbal-ai/timbal-react";
import { userMessageRootClass } from "@timbal-ai/timbal-react/chat";

import { cn } from "@/lib/utils";

/**
 * Project-owned user message bubble. Registered via the `components` slot in
 * `src/lib/studio-chat-chrome.tsx` — edit THIS file to restyle how the user's
 * own messages read: bubble vs flat, width, colors (through tokens), radius.
 *
 * `userMessageRootClass` carries the thread column alignment — keep it (or
 * re-apply the classes from `@/lib/thread-message-layout`) or the bubble
 * detaches from the composer column.
 */
export function ChatUserMessage() {
  return (
    <MessagePrimitive.Root className={cn(userMessageRootClass)}>
      <UserMessageAttachments />
      <div className="max-w-[75%] break-words rounded-2xl rounded-br-md bg-bubble-user px-4 py-2.5 text-base text-bubble-user-foreground">
        <MessagePrimitive.Parts />
      </div>
    </MessagePrimitive.Root>
  );
}
