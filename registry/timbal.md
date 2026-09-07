# The Timbal seam

Everything AI-shaped in this app runs on `@timbal-ai/timbal-react`. BoardUI
provides the look; the runtime provides streaming, uploads, markdown, tool calls,
artifacts, sessions. The glue lives in `src/components/timbal/` and is the only
project-authored component code. Do not re-implement any of it.

## Pick the chat surface

| The product needs… | Use | Where |
|---|---|---|
| A chat product (the conversation IS the app) | `src/pages/Home.tsx` — the BoardUI Pro **ai-chat template** layout: `ChatHistoryRail` (past conversations, `/chat` + `/chat/:id` routes) beside `ChatFrame` (the template's container + breadcrumb header) with the runtime inside (`TimbalRuntimeProvider` + `Thread` + `boardChatComponents`). Reuse it; change the brand, welcome copy and suggestions | routes `/chat`, `/chat/:conversationId` (move to `/` only when chat is the whole product) |
| A chat page inside an app with a sidebar/topbar | `EmbeddedChat` as its own route under the shell — it already sits in a `ChatFrame` flush with the shell's inset; no title, no extra card | `components/timbal/embedded-chat.tsx` |
| An assistant one tap away on data screens | `AssistantPill` docked once per shell (`dock` prop) | `components/timbal/assistant-pill.tsx` |
| A bespoke chat layout (split view, side panel) | Compose `ChatFrame` + `TimbalChat` (or provider + `Thread`) yourself: the thread must be the only scroll container (`min-h-0 flex-1`) inside a viewport-high flex column; never put messages + input in document flow | `components/timbal/chat/frame.tsx`, `history-rail.tsx` |

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
Conversation history: `useConversations` (`GET /api/runs?roots=true`) lists a
workforce's threads; `useConversation` (`GET /api/runs?group_id=…` + `/api/runs/:id`)
returns `messages` ready for `runtime.loadMessages`. `Home.tsx`'s `ConversationSync`
is the reference: hydrate on `/chat/:id`, `clear()` on `/chat`, and once a fresh
thread's first assistant turn carries a `runId`, `navigate(\`/chat/${runId}\`,
{ replace: true })` so refresh and the rail keep working.

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
