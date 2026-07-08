# Agent guide — blueprint-ui-simple-chat (v2, fork-first)

This repo is the **canonical scaffold** for Timbal app UIs. **The `timbal-ui` skill is the authoritative guide for HOW to design and build here — load it first.** This file carries only project facts the skill can't know. Where they overlap, the skill wins.

## The design system is project-owned. You are expected to edit it.

Three layers, all in this repo:

1. **`src/design/dna.json`** — the design DNA: every global visual decision
   (finish, brand, neutrals, surface strategy, type pairing + scale, radius,
   elevation, density, motion) as one validated file. `"finish": "timbal"`
   (the default) compiles the signature Timbal chrome — soft canvas gradient,
   gradient-filled controls with an inset highlight; set `"finish": "flat"`
   only when the user or a visual reference calls for flat surfaces. Compile it with `bun run dna:compile`
   → regenerates `src/design/tokens.css` (complete light+dark token set,
   WCAG-checked). **Never hand-edit `tokens.css`** — `bun run dna:check` fails
   the gate on drift. List curated menus with `bun run dna:registries`.
2. **`src/design/DESIGN.md`** — the durable design record: intent, references
   used, layout + component decisions. **Read it before UI work; update it
   after design decisions.** This is how session 12 stays consistent with
   session 1.
3. **`src/components/`** — the component source, owned by this project:
   - `ui/` — primitives (button, input, select, dialog, dropdown, table,
     data-table, sidebar, tabs, sheet, tooltip, …). shadcn-shaped, wired to
     DNA tokens (`bg-primary`, `h-control`, `rounded-control`, `shadow-xs`,
     bare `transition-*` inherits DNA motion).
   - `app/` — compositions (`Page`, `Section`, `Stat`, `StatGrid`).
   - `chat/` — chat chrome (`ChatWelcome`, `ChatUserMessage`) registered as
     `components` slots in `src/lib/studio-chat-chrome.tsx`; the streaming
     runtime stays in the package.

**Restyling = editing these files.** Global changes (color, radius, font,
density, shadows, motion) go through `dna.json` — one edit restyles every
component. Structural personality (pill buttons, dense tables, different nav
treatment) is a targeted edit to the component file. Matching a reference
screenshot 1:1 is legitimate and expected — that's why the source is here.

**What still comes from `@timbal-ai/timbal-react` (do not rebuild):** the
runtime and chat machinery — `TimbalChatShell` / `TimbalStudioShell` /
`TimbalChat`, `TimbalRuntimeProvider` + `useTimbalStream` (SSE streaming),
artifacts rendering, `SessionProvider` / `AuthGuard` / `authFetch`,
`AppCopilot`. Its styles.css also ships the chat polish + the `dark` variant.
Restyle chat via shell props + the `components` slot API (see the skill's
chat reference), not by reimplementing the thread.

## Non-negotiables (build/theming correctness)

1. **`src/index.css` import order matters:** `tailwindcss` → library
   `styles.css` → `./design/tokens.css` (DNA wins the cascade) → `@source`
   the library dist. Deleting any of these = unstyled UI or dead chat polish.
2. **Colors only through tokens.** Raw hex/oklch/palette classes
   (`bg-blue-600`) punch through the DNA and break dark mode + re-theming.
   New color roles belong in `dna.json` (`overrides` accepts only
   token-referential values).
3. **Chart token contract:** pass `var(--chart-3)` directly — never
   `hsl(var(--chart-3))` (invalid CSS, silently renders black). Chart
   `dataKey`s must be safe identifiers (`waterPct`, not `"Water %"`).
4. **Verify imports exist.** Library surfaces move between subpaths; when
   unsure import from the root `@timbal-ai/timbal-react` or grep the installed
   `dist/*.d.ts`. Local components import from `@/components/...`.
5. **Never swallow fetch errors** — show an `EmptyState`/`Alert` and log;
   `.catch(() => {})` turns failures into permanent skeletons.

## Strong defaults

- **Pick the surface first.** Chat product → `TimbalChatShell` /
  `TimbalStudioShell` in `Home.tsx`. Screens with content (data, settings,
  admin, catalog) → `SidebarProvider`+`Sidebar` (or a topbar, or neither) +
  `Page`/`Section` + local components, with `<AppCopilot>` when it also needs
  an assistant. Don't force a data app into a chat box.
- **Compose from `src/components/ui` before hand-rolling raw HTML** —
  `DataTable` over `<table>`, `Select`/`Input`+`Label` over bare controls,
  `Stat`/`StatGrid` over KPI div grids, `Sidebar` over a custom rail. They're
  token-wired, responsive, and accessible. When nothing fits, build a new
  component in the same style — that's the point of owning the source.
- **Empty/loading/error states are part of every screen** — `EmptyState`,
  `Skeleton`, `Alert`, `Spinner` exist for this.
- **Responsive by default:** 375 px must work. The sidebar collapses to a
  sheet, `DataTable` scrolls in its container, `StatGrid` stacks.

## Scaffold layout

```
src/
├── design/            # dna.json (edit) · tokens.css (generated) · DESIGN.md (update)
├── components/
│   ├── ui/            # project-owned primitives (fork freely)
│   ├── app/           # page scaffold, sections, stats
│   └── chat/          # chat chrome slots (welcome, user bubble)
├── pages/             # Home (chat shell) · Placeholder (replace!) · Gallery (dev/CI) · NotFound
├── lib/               # cn(), studio-chat-chrome (chat slot registration), thread layout classes
├── hooks/             # use-mobile, use-title
├── App.tsx            # providers + router
├── config.ts          # env flags
└── index.css          # import order — see non-negotiables
scripts/               # screenshot-smoke.mjs (gallery CI) · build-registry.mjs (shadcn registry)
```

`ls src/` before assuming a file exists — the scaffold evolves.

## Env flags (`config.ts`)

| Flag | Effect |
|---|---|
| `VITE_TIMBAL_PROJECT_ID` | enables auth (`SessionProvider` / `AuthGuard`) |
| `VITE_STUDIO_SIDEBAR` | `Home.tsx` uses `TimbalStudioShell` instead of `TimbalChatShell` |
| `VITE_GALLERY` | mounts `/gallery` (component states, used by the screenshot smoke CI) |
| `VITE_APP_TITLE` | document title |

There is **no theme preset flag** — theming has exactly one source of truth:
`src/design/dna.json` → `bun run dna:compile`. Do not reintroduce
`TimbalThemeStyle`/`VITE_THEME_PRESET`; a runtime preset silently overrides
the DNA tokens.

## Thread layout gotcha

If you override `components.AssistantMessage` / `UserMessage` on a chat shell,
you replace the column layout — re-apply the classes from
`@/lib/thread-message-layout` or content sticks to the left edge. Register
overrides in `src/lib/studio-chat-chrome.tsx`. Hide CTAs while streaming with
`useThread((s) => s.isRunning)`.

## Verify before finishing

```
bun run dna:check     # tokens.css matches dna.json
bun run build         # tsc -b + vite build
bun run lint
```

Then look at it: screenshot the preview at 1280 and 375 (the pipeline's
`browser_screenshot` tool when available) and self-review against the skill's
critique rubric before calling it done.
