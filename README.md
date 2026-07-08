# Blueprint UI

Canonical React + Vite template for Timbal apps — chat, dashboards, and
operations UIs. **Fork-first:** this project owns its design system and its
component source; [`@timbal-ai/timbal-react`](https://www.npmjs.com/package/@timbal-ai/timbal-react)
(`^4.1.0`) provides only the runtime (chat streaming, artifacts, auth) and the
`timbal-dna` / `timbal-ui-lint` CLIs.

**Codegen / Composer agents:** read [`AGENTS.md`](./AGENTS.md) first — it is
the protocol. `src/design/DESIGN.md` is the project's durable design record.

## Tech stack

- React 19 + TypeScript, Vite 7, Tailwind CSS 4
- **Project-owned design system** — `src/design/dna.json` compiled to
  `src/design/tokens.css` by `timbal-dna` (complete light+dark token set,
  WCAG-checked, signature Timbal finish by default)
- **Project-owned components** — `src/components/{ui,app,chat}/`
  (shadcn-shaped source on Radix + TanStack Table; fork freely)
- `@timbal-ai/timbal-react` — chat runtime, shells, artifacts, auth
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
| `VITE_GALLERY` | `true` → registers `/gallery` (component states; used by the screenshot smoke CI) |
| `VITE_API_PROXY_TARGET` | Where `/api` proxies in dev (`vite.config.ts`) |

## The design system (read before styling anything)

Theming has **one source of truth**: `src/design/dna.json`. It records every
global visual decision — finish, brand, neutrals, surfaces, typography,
radius, elevation, density, motion — and compiles deterministically:

```bash
bun run dna:compile      # dna.json → src/design/tokens.css
bun run dna:check        # fails if tokens.css was hand-edited (CI runs this)
bun run dna:registries   # curated menus: font pairings, status sets, motion
```

`"finish": "timbal"` (the default) renders the signature Timbal chrome —
canvas gradient, gradient-filled controls with an inset highlight, graded
cards. Set `"finish": "flat"` only when matching a deliberately flat
reference; the components read the same tokens either way.

Never hand-edit `tokens.css`, never use raw palette colors
(`bg-blue-600`, hex, oklch) in components — `timbal-ui-lint` blocks them.

## Building screens — dashboards, settings, analytics

Compose from the **project-owned components**, not from the npm package:

```tsx
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Page, Section } from "@/components/app/page";
import { Stat, StatGrid } from "@/components/app/stat";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
```

These files are yours: restyle by editing them (structural personality) or by
editing `dna.json` (global look). To see every component in every state, set
`VITE_GALLERY=true` and open **http://localhost:5173/gallery** —
[`src/pages/Gallery.tsx`](src/pages/Gallery.tsx) doubles as the CI screenshot
smoke surface.

From `@timbal-ai/timbal-react` import only runtime concerns: chat shells
(`TimbalChatShell`, `TimbalStudioShell`), the chat runtime, artifacts, and
auth (`SessionProvider`, `AuthGuard`, `authFetch`).

## CSS wiring (do not reorder)

```css
/* src/index.css */
@import "tailwindcss";
@import "tw-animate-css";
@import "@timbal-ai/timbal-react/styles.css";  /* library chat polish */
@import "./design/tokens.css";                 /* DNA tokens override it */
@source "../node_modules/@timbal-ai/timbal-react/dist";
```

Toggle dark mode with `next-themes` (`attribute="class"`) or by toggling
`.dark` on `<html>`.

## Custom message slots (Composer / generated apps)

The chat welcome and user-message chrome are project-owned
(`src/components/chat/`) and registered through the `components` slot API in
`src/lib/studio-chat-chrome.tsx`. Overriding `components.AssistantMessage` or
`components.UserMessage` removes the built-in centered column — import layout
helpers so messages line up with the composer:

```tsx
import { assistantMessageRootClass } from "@/lib/thread-message-layout";
```

Defaults match `Thread` (`max-w-(--thread-max-width)`, usually **44rem**).
Full rules and examples: [`AGENTS.md`](./AGENTS.md).

## Project structure

```
src/
├── design/                       # dna.json (edit) · tokens.css (generated) · DESIGN.md (update)
├── components/
│   ├── ui/                       # project-owned primitives (button, card, data-table, sidebar, …)
│   ├── app/                      # page scaffolds (Page/Section, Stat/StatGrid)
│   ├── chat/                     # forkable chat chrome (welcome, user message)
│   └── studio-topbar-brand.tsx   # Blueprint-only: welcome mark + topbar "new chat"
├── lib/
│   ├── studio-chat-chrome.tsx    # Welcome + composer slots
│   └── thread-message-layout.ts  # Column classes for custom User/Assistant messages
├── pages/
│   ├── Home.tsx                  # TimbalChatShell / optional TimbalStudioShell
│   └── Gallery.tsx               # every component in its states (VITE_GALLERY)
├── config.ts
├── App.tsx
├── main.tsx
└── index.css                     # Tailwind + library styles + DNA tokens
```

## Scripts

```bash
bun run dev              # Development server (npm package)
bun run dev:linked       # Dev against sibling ../timbal-react (HMR on dist/)
bun run build            # Production build (tsc + vite)
bun run preview          # Preview production build
bun run lint             # ESLint
bun run dna:compile      # Recompile design tokens from dna.json
bun run dna:check        # Verify tokens.css matches dna.json
bun run registry:build   # Build the shadcn-compatible registry (public/r/)
bun run smoke:screenshots # Gallery screenshots at 1280/375 × light/dark
```

## Production checklist

- [ ] `@timbal-ai/timbal-react` pinned to a published version (`^4.1.0`); use `file:../timbal-react` + `dev:linked` only for local library dev
- [ ] `bun run dna:check`, `bun run build`, and `bun run lint` pass
- [ ] Backend serves `/api/workforce`, `/api/files/upload`, and stream routes (`timbal start`)
- [ ] Set `VITE_TIMBAL_PROJECT_ID` when auth is required
- [ ] `VITE_GALLERY` not enabled in production

## License

Apache-2.0
