/**
 * Layout classes for custom `Thread` message slots.
 *
 * `@timbal-ai/timbal-react` centers the composer and messages on the same column
 * via `--thread-max-width` (default `44rem` from `Thread` / `TimbalChatShell`).
 * Replacing `components.AssistantMessage` or `components.UserMessage` removes that
 * chrome — always put these classes on `MessagePrimitive.Root` (or an outer wrapper).
 *
 * @see AGENTS.md — rules for Composer / codegen agents working in this repo
 */

/** Default `maxWidth` on `TimbalChatShell` / `Thread`. Keep in sync if you change it in `Home.tsx`. */
export const THREAD_MAX_WIDTH = "44rem";

/** Shared column — aligns custom messages with the composer footer. */
export const threadMessageColumnClass =
  "mx-auto w-full max-w-(--thread-max-width)";

/** Matches built-in `AssistantMessage` root (minus motion utilities). */
export const assistantMessageRootClass = [
  "aui-assistant-message-root relative",
  threadMessageColumnClass,
  "py-3 duration-150",
].join(" ");

/** Inner content padding for assistant text / artifacts. */
export const assistantMessageContentClass =
  "wrap-break-word px-2 text-foreground leading-relaxed";

/** Matches built-in `UserMessage` root. */
export const userMessageRootClass = [
  "aui-user-message-root flex flex-col items-end gap-2",
  threadMessageColumnClass,
  "px-2 py-3",
].join(" ");
