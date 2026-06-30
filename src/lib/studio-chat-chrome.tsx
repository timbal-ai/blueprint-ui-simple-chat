import type { ThreadComponents } from "@timbal-ai/timbal-react";
import { StudioWelcome } from "@timbal-ai/timbal-react";

/**
 * Blueprint chrome: the package `StudioWelcome` on the empty state. No custom
 * topbar / header brand — the shell owns its own chrome (see `AGENTS.md`).
 *
 * Custom `AssistantMessage` / `UserMessage` slots must use layout classes from
 * `@/lib/thread-message-layout` so content stays aligned with the composer column.
 */
export const studioChatComponents: ThreadComponents = {
  Welcome: StudioWelcome,
};
