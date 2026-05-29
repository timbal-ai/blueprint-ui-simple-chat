# Agent guide — blueprint-ui-simple-chat

This repo is the **canonical shell** for Timbal chat apps. UI generators (Composer, Cursor, etc.) should follow these rules when adding or changing chat UI.

## Thread layout (do not skip)

`TimbalChatShell` / `Thread` set `--thread-max-width` (default **44rem**). The **composer** and **default messages** are centered with:

`mx-auto w-full max-w-(--thread-max-width)`

If you override `components.AssistantMessage` or `components.UserMessage`, you **replace** that layout. Content will stick to the left edge unless you add the column classes yourself.

### Always use the blueprint helpers

Import from `@/lib/thread-message-layout`:

```tsx
import { MessagePrimitive } from "@timbal-ai/timbal-react";
import {
  assistantMessageContentClass,
  assistantMessageRootClass,
  threadMessageColumnClass,
} from "@/lib/thread-message-layout";

export function CustomAssistantMessage() {
  return (
    <MessagePrimitive.Root
      className={assistantMessageRootClass}
      data-role="assistant"
    >
      <div className={assistantMessageContentClass}>
        <MessagePrimitive.Parts />
      </div>
      {/* optional CTA — hide while streaming, see below */}
    </MessagePrimitive.Root>
  );
}
```

Minimum fix if you only need a wrapper:

```tsx
<div className={threadMessageColumnClass}>…</div>
```

Do **not** hardcode `max-w-[44rem]` unless `THREAD_MAX_WIDTH` / `maxWidth` on the shell is also changed to match.

### Register the slot

Add the component to `studioChatComponents` in `src/lib/studio-chat-chrome.tsx` (or pass `components` from `Home.tsx`).

## Custom actions during streaming

Buttons such as “Guardar plan” should not appear while the assistant is still generating. Use assistant-ui thread state, e.g.:

```tsx
import { useThread } from "@assistant-ui/react";

const isRunning = useThread((s) => s.isRunning);
// render CTA only when !isRunning (and optionally when content is complete)
```

## Theming

- Import `@timbal-ai/timbal-react/styles.css` and `@source` the library `dist/` from `src/index.css` (already wired).
- Do **not** duplicate palette tokens in this repo; override CSS variables if branding changes.

## Dependencies

- Pin `@timbal-ai/timbal-react` to a **published** version (e.g. `^0.5.5`). Use `file:../timbal-react` only for local library dev.
- Add `motion` if you import `motion/react` (see `studio-topbar-brand.tsx`).

## Verify before finishing

```bash
bun run build
bun run lint
```

Use the project’s `tsc` / `bun run build`, not `bunx tsc` (avoids lockfile noise and wrong TypeScript version).
