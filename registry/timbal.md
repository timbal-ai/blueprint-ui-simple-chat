# The Timbal seam

Everything AI-shaped in this app runs on `@timbal-ai/timbal-react`. BoardUI
provides the look; the runtime provides streaming, uploads, markdown, tool calls,
artifacts, sessions. The glue lives in `src/components/timbal/` and is the only
project-authored component code. Do not re-implement any of it.

## Pick the chat surface

| The product needs… | Use | Where |
|---|---|---|
| A chat product (the conversation IS the app) | `src/pages/Home.tsx` pattern: page owns the frame, `TimbalChat` is the engine, `boardChatComponents` is the chrome | own route (`/chat`; move it to `/` only when chat is the whole product) |
| A chat page inside an app with a sidebar/topbar | `EmbeddedChat` as its own route under the shell — full-bleed, no title, no card around it | `components/timbal/embedded-chat.tsx` |
| An assistant one tap away on data screens | `AssistantPill` docked once per shell (`dock` prop) | `components/timbal/assistant-pill.tsx` |
| A bespoke chat layout (rail, split view) | Compose `TimbalChat` yourself: it must be the only scroll container (`min-h-0 flex-1`) inside a viewport-high flex column; never put messages + input in document flow | — |

Never: a chat inside a `Modal`, a chat framed as a card with a page title, a
composer that can scroll off screen, a second message list built by hand.

## Slots (how BoardUI chrome gets onto the runtime)

```tsx
import { TimbalChat } from "@timbal-ai/timbal-react";
import { boardChatComponents } from "@/components/timbal/chat/chrome";

<TimbalChat workforceId={id} attachments components={boardChatComponents} className="min-h-0 flex-1" />
```

`ThreadComponents` slots: `Composer`, `UserMessage`, `AssistantMessage`, `Welcome`,
`Suggestions`, `EditComposer`, `ScrollToBottom`. Ours live in
`components/timbal/chat/` (composer on BoardUI `ComposerPanel`, messages, welcome,
tool renderer on `TaskList` / `WebSearch` / `AgentProgress`). To change the chat
look, edit those files — they are plain React on assistant-ui primitives
(`ComposerPrimitive`, `MessagePrimitive`, `ActionBarPrimitive`, `useThread`,
`useComposerRuntime`, all re-exported by the runtime).

Runtime pieces you reuse inside slots, never rebuild: `MarkdownText`,
`ToolArtifactFallback` (charts/tables/ui/html/json artifacts), `ComposerAttachments`,
`UserMessageAttachments`, `useResolvedSuggestions`.

## Workforce resolution

```tsx
const { selectedId, isLoading, error } = useWorkforces();   // GET /api/workforce
const workforceId = selectedId || (error ? "default" : undefined);
```

Streaming: `POST /api/workforce/{id}/stream` (SSE) — done by the runtime.
Uploads: `attachments` prop → the runtime's adapter → `/api/files/upload`.
Conversation history: `useConversations` / `useConversation` +
`conversationRunsToMessages` → `loadMessages` (see `TimbalStreamApi`).

## Auth

```tsx
<SessionProvider enabled={isAuthEnabled}>           // GET /api/config → providers, auth.required
  <AuthGuard requireAuth enabled={isAuthEnabled} renderLogin={<Login />}>…</AuthGuard>
</SessionProvider>
```

`Login` (`components/timbal/login.tsx`) is BoardUI's auth-card grammar,
passwordless: OAuth buttons → `GET /api/auth/{google|microsoft|github}`, email →
`POST /api/auth/magic-link {email}`. Providers come from the session
(`useOptionalSession().authProviders`), so only enabled methods render. User
info: `session.user.{user_name,user_email,user_photo_url}`; `session.logout()`.

## Calling your own API

Route everything through `/api` (Vite proxies it in dev; the platform mounts it
in prod). Use `authFetch` from the runtime so the bearer token rides along:

```ts
import { authFetch } from "@timbal-ai/timbal-react";
const res = await authFetch("/api/orders?status=open");
if (!res.ok) throw new Error(`orders ${res.status}`);
```

Never swallow errors — render an empty/error state; log the failure.

## Theming the runtime

`src/styles/timbal-bridge.css` maps the runtime's tokens (`--background`, `--card`,
`--primary`, `--composer-bg`, `--thread-canvas`, `--bubble-user`, `--chart-*`…) onto
BoardUI's. Change BoardUI (brand.css / theme.css semantics) and the chat follows.
If a chat sits on a non-default surface, set `--thread-canvas` on an ancestor
instead of wrapping the composer.
