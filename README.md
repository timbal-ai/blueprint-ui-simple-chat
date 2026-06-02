# Blueprint UI

Canonical React + Vite template for Timbal **chat** apps. The UI lives in [`@timbal-ai/timbal-react`](https://www.npmjs.com/package/@timbal-ai/timbal-react) (`^0.8.2`); this repo is a thin shell composers and teams clone.

**Codegen / Composer agents:** read [`AGENTS.md`](./AGENTS.md) before overriding chat message slots.

## Tech stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- `@timbal-ai/timbal-react` — chat shells, theme tokens, studio chrome, the `./app` app kit (dashboards, tables, settings, analytics), and the `./ui` primitives (`Button`, `Dialog`, `DropdownMenu`, `Popover`, `Select`, `Tooltip`, `Avatar`) — no shadcn install needed
- `next-themes` — light / dark via `.dark` on `<html>`

## Getting started

```bash
bun install
bun run dev
```

Dev server: **http://localhost:5173** (override with `VITE_APP_PORT`).

### Local library development

When developing against a sibling [`timbal-react`](../timbal-react) checkout:

```bash
# package.json: "@timbal-ai/timbal-react": "file:../timbal-react"
bun install
bun run dev:linked
```

## Configuration

Copy `.env.example` to `.env`.

| Variable | Purpose |
|----------|---------|
| `VITE_TIMBAL_PROJECT_ID` | Enables auth (`SessionProvider`, `AuthGuard`) |
| `VITE_WELCOME_HEADING` / `VITE_WELCOME_SUBHEADING` | Welcome screen copy |
| `VITE_STUDIO_SIDEBAR` | `true` → floating sidebar (`TimbalStudioShell`); default is top bar only |
| `VITE_APP_KIT_DEMO` | `true` → registers `/demo/app-kit` (dashboard + floating copilot sample) |
| `VITE_API_PROXY_TARGET` | Where `/api` proxies in dev (`vite.config.ts`) |

## Beyond chat — dashboards, settings, analytics (app kit)

The default route (`/`) is a full-page chat shell (`TimbalChatShell` or `TimbalStudioShell`). But this template is **not chat-only**: for any data/dashboard/settings/analytics/integrations/admin UI, build real pages with the **app kit** (`@timbal-ai/timbal-react/app`) — `AppShell`, `Page`, `Section`, `MetricRow`, `MetricChartCard`, `DataTable`, `SettingsSection`, `IntegrationCard`, `ResourceCard`, `LineAreaChart`, and a floating `AppChatPanel` copilot. These are first-class building blocks, not a demo.

Add app-kit pages as new routes in `App.tsx` (e.g. `src/pages/Dashboard.tsx`). To study a fully wired example, set `VITE_APP_KIT_DEMO=true` and open **http://localhost:5173/demo/app-kit** ([`src/examples/app-kit-demo/`](src/examples/app-kit-demo/)). The complete component menu + props live in `APP_KIT_AGENT_INSTRUCTIONS` and the [`timbal-react` `examples/app-kit`](https://github.com/timbal-ai/timbal-react/tree/main/examples/app-kit) recipes. See [`AGENTS.md`](./AGENTS.md) for the surface-selection rule.

**Every component is available from the root `@timbal-ai/timbal-react`** — chat shells, `StudioSidebar`/`ModeToggle`, and the full app kit (`AppShell`, `Page`, `DataTable`, `MetricRow`, `SettingsSection`, `IntegrationCard`, charts, …):

```tsx
import { AppShell, Page, DataTable, MetricRow, StudioSidebar, TimbalChatShell } from "@timbal-ai/timbal-react";
```

The `/chat`, `/studio`, `/app` subpaths are optional (tree-shaking clarity only) — you never need them to reach a component:

```tsx
import { threadMessageColumnClass } from "@timbal-ai/timbal-react/chat";
import { AppShell, Page } from "@timbal-ai/timbal-react/app";
import { StudioSidebar } from "@timbal-ai/timbal-react/studio";
```

## Theming (important for generated apps)

Do **not** duplicate color tokens in this repo. Import the library stylesheet and scan its dist:

```css
/* src/index.css */
@import "tailwindcss";
@import "@timbal-ai/timbal-react/styles.css";
@source "../node_modules/@timbal-ai/timbal-react/dist";
```

Toggle dark mode with `next-themes` (`attribute="class"`) or by toggling `.dark` on `<html>`.

## Custom message slots (Composer / generated apps)

Overriding `components.AssistantMessage` or `components.UserMessage` removes the built-in centered column. Import layout helpers so messages line up with the composer (re-exported from `@timbal-ai/timbal-react/chat`):

```tsx
import { assistantMessageRootClass } from "@/lib/thread-message-layout";
// or: import { assistantMessageRootClass } from "@timbal-ai/timbal-react/chat";
```

Defaults match `Thread` (`max-w-(--thread-max-width)`, usually **44rem**). Full rules and examples: [`AGENTS.md`](./AGENTS.md).

## Project structure

```
src/
├── components/
│   ├── studio-topbar-brand.tsx   # Blueprint-only: welcome mark + topbar “new chat”
│   └── ui/sonner.tsx
├── examples/
│   └── app-kit-demo/             # Optional expansion sample (env-gated route)
├── lib/
│   ├── studio-chat-chrome.tsx    # Welcome + composer slots
│   └── thread-message-layout.ts  # Column classes for custom User/Assistant messages
├── pages/Home.tsx                # TimbalChatShell / optional TimbalStudioShell
├── config.ts
├── App.tsx
├── main.tsx
└── index.css                     # Tailwind + library theme (no local palette)
```

## Scripts

```bash
bun run dev          # Development server (npm package)
bun run dev:linked   # Dev against sibling ../timbal-react (HMR on dist/)
bun run build        # Production build (tsc + vite)
bun run preview      # Preview production build
bun run lint         # ESLint
```

## Production checklist

- [ ] `@timbal-ai/timbal-react` pinned to a published version (e.g. `^0.8.2`); use `file:../timbal-react` + `dev:linked` only for local library dev
- [ ] `bun run build` and `bun run lint` pass
- [ ] Backend serves `/api/workforce`, `/api/files/upload`, and stream routes (`timbal start`)
- [ ] Set `VITE_TIMBAL_PROJECT_ID` when auth is required

## License

Apache-2.0
