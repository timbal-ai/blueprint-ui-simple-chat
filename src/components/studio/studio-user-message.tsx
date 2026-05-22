import { MessagePartPrimitive } from "@assistant-ui/react";
import {
  MessagePrimitive,
  UserMessageAttachments,
} from "@timbal-ai/timbal-react";
import { motion } from "motion/react";

/** Inline text — default Parts uses a block `<p>` which stretches in narrow grids. */
function UserMessageText() {
  return (
    <span className="whitespace-pre-wrap">
      <MessagePartPrimitive.Text smooth={false} />
    </span>
  );
}

/**
 * User bubble — timbal-platform layout: flex column, items-end, inline-block bubble.
 */
export function StudioUserMessage() {
  return (
    <MessagePrimitive.Root
      className="aui-user-message-root mx-auto flex w-full max-w-(--thread-max-width) flex-col items-end gap-2 px-2 py-3"
      data-role="user"
    >
      <UserMessageAttachments />
      <motion.div
        className="aui-user-message-content inline-block max-w-[80%] rounded-2xl bg-neutral-200 px-4 py-2.5 text-foreground dark:bg-neutral-700"
        initial={{ opacity: 0, y: 8, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <MessagePrimitive.Parts components={{ Text: UserMessageText }} />
      </motion.div>
    </MessagePrimitive.Root>
  );
}
