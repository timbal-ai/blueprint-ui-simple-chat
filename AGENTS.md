# Agent guide — blueprint-ui-simple-chat

This repo is the **canonical shell** for Timbal apps. **The `timbal-ui` skill is the authoritative guide for HOW to build UI here — load it first.** This file lists only **project-specific facts** the skill can't know (scaffold layout, env flags, verify steps). Where the skill and this file overlap, the skill wins.

## You own the design

The package provides the **substrate** — tokens, primitives, blocks, shells. Everything above the substrate is **your design decision**: layout, chrome, density, grid shape, whether there's a sidebar or a topbar or neither, visual personality, and bespoke components when nothing shipped fits. Two apps built from this blueprint for two different domains **should not look alike**. Do not treat the demo screen or any single archetype as "the Timbal look".

Levers you're expected to use, not avoid:

- **Layout archetypes** — sidebar dashboard, focused/no-chrome single tool, bento overview (asymmetric grid), split master–detail, full-page chat/canvas, section-switcher (`SubNav`/`PillSegmentedTabs`). Pick or mix per the domain; vary columns, density, and header placement.
- **Global chrome** — `AppShell` supports a **`topbar={…}`** slot (brand + nav + search + account; include `<AppShellSidebarTrigger />` when a sidebar drawer also exists), a `sidebar`, both, or neither. Page-scoped actions go in `Page.actions`.
- **Theming as differentiation** — `createTimbalTheme` intent (`brand`, `accent`, `neutrals`, `radius`, `shadow`, `surfaces: "panel" | "console"`, `defaultMode`, `chartPalette`, `typography` incl. `display`, token-referential `overrides`) generates a full personality. A cream editorial app, a dark ops console, and a warm consumer app are all one intent object away — use it.
- **The invention lane** — when no catalog block fits, build a bespoke component from `/ui` primitives + semantic tokens (no color literals, same lint). Bespoke is legitimate; extract to a shared spot on second use.

## Non-negotiables (correctness only — these break builds or theming, not taste)

1. **Styling preflight.** `src/index.css` must keep `@import "@timbal-ai/timbal-react/styles.css"` and `@source "../node_modules/@timbal-ai/timbal-react/dist"`. Deleting either → completely unstyled UI. Never replace with a hand-written OKLCH palette; one-off tokens go through the theme intent's `overrides` (`var()`/`color-mix()`).
2. **Verify new imports.** A guessed export is a runtime "no export named X" crash → blank page. App-kit surfaces (`StatusBadge`, `StatTile`, `DataTable`, `Page`, …) are `/app` or the root — not `/ui`. When unsure, import from the root or check `importFrom` in `APP_KIT_CATALOG`.
3. **Chart token contract.** Reference chart colors directly — `var(--chart-3)` / `bg-chart-3` — **never** `hsl(var(--chart-3))` (invalid CSS, renders black, build won't catch it). Chart `dataKey`s must be safe identifiers: `{ dataKey: "waterPct", label: "Water %" }`, never `"Water %"` as the key.
4. **Never swallow fetch errors.** `.catch(() => {})` turns a failed request into a permanent empty skeleton. Log the error and show an `EmptyState`/`Banner`. Run the preview and read its logs before calling a screen done — `tsc` doesn't catch wrong-subpath exports or visual breakage.

## Strong defaults (prefer these; deviate deliberately, not accidentally)

- **Pick the surface first.** Chat → `TimbalChatShell` / `TimbalStudioShell`. Data/settings/admin screens → app kit (`AppShell` + `Page` + blocks/primitives), with a self-mounting `<AppCopilot>` when it also needs an assistant. Don't force a data app into a chat box — and don't force a simple assistant into a dashboard.
- **Reach for shipped components before hand-rolling.** `DataTable` over raw `<table>`, `Field*`/`Select` over bare `<input>`/`<select>`, `MetricRow`/`StatTile` over KPI `<div>` grids, `StudioSidebar` over a custom rail, blocks (`FilteredDataTable`, `StatGrid`, …) over re-assembling primitives. The shipped pieces are token-wired, responsive, and accessible for free — hand-rolled substitutes usually aren't. If you *are* deliberately building something the kit lacks, that's the invention lane (tokens + primitives), not a reason to drop to raw HTML.
- **An in-app assistant is `<AppCopilot>`** (self-mounting floating pill + panel; `suggestions` for quick actions, `context` for page awareness, `CopilotProvider` + `useCopilot()` + `hideTrigger` for a custom trigger) rather than a hand-rolled `Sheet` + `TimbalChat` panel.
- **Charts are `ChartPanel` + `ChartArtifact`** (or `LineAreaChart`/`PieChart`/…) rather than raw recharts, so theming/tooltips/flush layout keep working. Multi-series: `series: [{ dataKey }, { dataKey }]`; wildly different ranges → normalize and show real values in the tooltip.
- **Read the catalog before inventing an export.** The kit is self-describing: `APP_KIT_CATALOG` (machine-readable, every `importFrom` resolves, blocks carry `composedOf` + a forkable `source`), `APP_KIT_CORE_INSTRUCTIONS` (compact tier), `APP_KIT_AGENT_INSTRUCTIONS` (full menu). Readable prompt files ship at `@timbal-ai/timbal-react/prompts/*`.

## Dashboard wiring reference — plumbing, not a layout template

`src/examples/app-kit-demo/AppKitDemo.tsx` shows **correct wiring**: `AppShell` layout-only, `StudioSidebar` in `AppShell.sidebar` (nav items `{ id, name, icon? }[]`, route in `onSelect`; defaults to `variant="flush"`, pass `variant="floating"` for the rounded card), `Page`/`Section` composition, blocks, and a self-mounting `<AppCopilot>`.

**What's canonical about it: the plumbing.** Shell slots, import paths, block props, copilot mounting. **What's NOT canonical: the layout.** Its shape (sidebar + metric row + full-width table) is *one* archetype. Don't reproduce its structure, section order, or "Operations" domain for your app — compose the archetype that fits the user's domain and make it look like *their* product.

## Scaffold layout

```
src/
├── pages/Home.tsx             # renders the shell (TimbalChatShell / TimbalStudioShell)
├── pages/NotFound.tsx
├── components/ui/sonner.tsx   # Toaster
├── lib/studio-chat-chrome.tsx # `components={...}` slot overrides for the chat
├── lib/thread-message-layout.ts
├── examples/app-kit-demo/     # dashboard wiring reference (gated by VITE_APP_KIT_DEMO)
├── App.tsx                    # ThemeProvider (defaultTheme="light", enableSystem={false}) + SessionProvider + AuthGuard + Router + Toaster
├── config.ts                  # isAuthEnabled / isStudioSidebarEnabled / isAppKitDemoEnabled
├── main.tsx                   # entry + CSS imports
└── index.css                  # token import (see preflight above)
```

`ls src/` before assuming a file exists — the scaffold evolves.

## Env flags (`config.ts`)

| Flag | Effect |
|---|---|
| `VITE_TIMBAL_PROJECT_ID` | enables auth (`SessionProvider` / `AuthGuard`) |
| `VITE_STUDIO_SIDEBAR` | `Home.tsx` uses `TimbalStudioShell` (sidebar) instead of `TimbalChatShell` |
| `VITE_APP_KIT_DEMO` | mounts the dashboard reference at `/demo/app-kit` |
| `VITE_THEME_PRESET` | brand personality applied at root via `TimbalThemeStyle` — `indigo`/`violet`/`forest`/`warm`/`slate`/`folio`/`carbon` (empty = neutral) |
| `VITE_APP_TITLE` | document title |

## Thread layout gotcha (blueprint-specific)

`TimbalChatShell` / `Thread` center the composer and messages with `mx-auto w-full max-w-(--thread-max-width)` (default 44rem). If you override `components.AssistantMessage` / `UserMessage`, you **replace** that layout — re-apply the column classes from `@/lib/thread-message-layout` (`assistantMessageRootClass`, `assistantMessageContentClass`, `threadMessageColumnClass`) or content sticks to the left edge. Register overrides in `src/lib/studio-chat-chrome.tsx`. Hide CTAs while streaming with `useThread((s) => s.isRunning)`.

## Imports, deps, verify

- **Import from the root `@timbal-ai/timbal-react`** unless you want tree-shaking clarity (`/chat`, `/studio`, `/app`, `/ui`). Don't run `npx shadcn` or author primitives in `src/components/ui/` — primitives ship from `/ui` wired to the tokens (raw shadcn references undefined token names and renders unstyled).
- Pin `@timbal-ai/timbal-react` to a **published** version (e.g. `^3.2.0`); use `file:../timbal-react` + `bun run dev:linked` only for local library dev. Add `motion` if you import `motion/react`.
- Theming / rebranding (3.1+): generate a full personality with `createTimbalTheme({ brand, accent?, neutrals?, radius?, shadow?, surfaces?, defaultMode?, chartPalette?, typography?, overrides? })` and apply it at **runtime** via `applyTimbalTheme` / `<TimbalThemeStyle>`, or apply a preset (`VITE_THEME_PRESET`, `applyThemePreset`). Do **not** paste `themeToCss` output into app CSS (the literals fail the lint gate); `ThemePresetGallery` is **not exported** (dev-internal). Full recipe in the `timbal-ui` skill.
- Before finishing: `bun run build` and `bun run lint` (use the project's `tsc`, not `bunx tsc`).
