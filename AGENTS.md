# Agent guide — blueprint-ui-simple-chat

This repo is the **canonical shell** for Timbal chat apps. UI generators (Composer, Cursor, etc.) should follow these rules when adding or changing chat UI.

## Package surface (`@timbal-ai/timbal-react` 0.7+)

| Subpath | Use in this repo |
|---------|------------------|
| `@timbal-ai/timbal-react` | Chat shells, auth, artifacts (`Home.tsx`); re-exports everything below |
| `@timbal-ai/timbal-react/chat` | Layout helpers (`thread-message-layout.ts`) |
| `@timbal-ai/timbal-react/studio` | `StudioSidebar`, `ModeToggle`, `TimbalMark` — first-class for any app with a sidebar |
| `@timbal-ai/timbal-react/app` | **App kit** — `AppShell`, `Page`, `DataTable`, `MetricRow`, settings/integrations/surfaces/charts. First-class for any data/dashboard/settings UI, not demo-only |

**Everything imports from the root `@timbal-ai/timbal-react`** — chat shells, studio chrome (`StudioSidebar`, `ModeToggle`), AND the full app kit (`AppShell`, `Page`, `DataTable`, `MetricRow`, `SettingsSection`, `IntegrationCard`, charts, …). The `/chat`, `/studio`, `/app` subpaths are optional and only useful for tree-shaking clarity — you never need them to access a component. When in doubt, import from the root.

Chat chrome improvements (playground gradient, composer opacity) ship in the package — no local CSS forks.

## Pick the surface before you build (read this first)

This repo's default route is a chat shell, but **chat is not the only thing you build here.** Choose by what the user is making:

| User wants | Build with |
|---|---|
| Plain assistant / Q&A | `TimbalChatShell` (default `Home.tsx`) |
| Chat + persistent workforce sidebar | `TimbalStudioShell` (`VITE_STUDIO_SIDEBAR=true`) |
| **Dashboard, data table, analytics, settings, integrations, billing, admin/ops screen** | **App kit** (`@timbal-ai/timbal-react/app`): `AppShell` + `Page`/`Section` + the component menu |
| Data app that also needs an assistant | App kit + floating `AppChatPanel` copilot |

When the app is fundamentally a data/admin UI, **add real app-kit pages and routes** (or replace `Home.tsx`) — do not force it into a chat box. The full component menu, props, and recipes are in `APP_KIT_AGENT_INSTRUCTIONS` (`@timbal-ai/timbal-react/app`) and `examples/app-kit/recipes/` in the package. The `timbal-ui` skill carries the same menu.

## Thread layout (do not skip)

`TimbalChatShell` / `Thread` set `--thread-max-width` (default **44rem**). The **composer** and **default messages** are centered with:

`mx-auto w-full max-w-(--thread-max-width)`

If you override `components.AssistantMessage` or `components.UserMessage`, you **replace** that layout. Content will stick to the left edge unless you add the column classes yourself.

### Always use the official layout helpers

Import from `@/lib/thread-message-layout` (re-exports `@timbal-ai/timbal-react/chat`) or directly:

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

## Dashboards / data UIs — build them with the app kit

The default `/` route stays a chat shell, but when the user wants a **dashboard, data table, analytics, settings, integrations, billing, or admin/ops UI, build it with the app kit** (`@timbal-ai/timbal-react/app`) — `AppShell` + `Page`/`Section` + `MetricRow`/`DataTable`/`SettingsSection`/`IntegrationCard`/charts, with a floating `AppChatPanel` copilot when an assistant is needed. Do **not** cram a data/admin app into a chat box, and do **not** hand-roll cards/tables/KPIs with raw `div`s when a native component exists.

How to wire it in:

- Add a new route + page component (e.g. `src/pages/Dashboard.tsx`) and register it in `App.tsx`, or replace `Home.tsx` when the app is fundamentally a dashboard rather than a chat.
- Learn the exact props from `APP_KIT_AGENT_INSTRUCTIONS` (`@timbal-ai/timbal-react/app`) and the package's `examples/app-kit/recipes/` (one pattern per file). The `timbal-ui` skill carries the same component menu.
- `src/examples/app-kit-demo/AppKitDemo.tsx` (env `VITE_APP_KIT_DEMO=true` → `/demo/app-kit`) is a **wired reference** to study — not a boundary that confines app-kit to a demo route.

Compose creatively for the user's domain; don't clone the demo's "Operations" layout or its mock workforce list.

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

- Pin `@timbal-ai/timbal-react` to a **published** version (e.g. `^0.7.0`). Use `file:../timbal-react` + `bun run dev:linked` only for local library dev.
- Add `motion` if you import `motion/react` (see `studio-topbar-brand.tsx`).

## Verify before finishing

```bash
bun run build
bun run lint
```

Use the project’s `tsc` / `bun run build`, not `bunx tsc` (avoids lockfile noise and wrong TypeScript version).
