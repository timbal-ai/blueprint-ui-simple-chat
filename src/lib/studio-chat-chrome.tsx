import type { ThreadComponents } from "@timbal-ai/timbal-react";
import { StudioWelcome } from "@timbal-ai/timbal-react";

import { ComposerWithTopbarBrand } from "@/components/studio-topbar-brand";

/**
 * Blueprint chrome: liquid-metal mark on welcome + in the top bar after chat starts.
 *
 * Custom `AssistantMessage` / `UserMessage` slots must use layout classes from
 * `@/lib/thread-message-layout` so content stays aligned with the composer column.
 * See `AGENTS.md`.
 */
export const studioChatComponents: ThreadComponents = {
  Welcome: StudioWelcome,
  Composer: ComposerWithTopbarBrand,
};
