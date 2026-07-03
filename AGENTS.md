# Agent guide — blueprint-ui-simple-chat

This repo is the **canonical shell** for Timbal apps. **The `timbal-ui` skill is the authoritative guide for HOW to build UI here — load it first.** This file lists only **project-specific facts** the skill can't know (scaffold layout, env flags, verify steps). Where the skill and this file overlap, the skill wins.

## Non-negotiables (full detail + component menu live in the `timbal-ui` skill)

1. **Pick the surface first.** Chat → `TimbalChatShell` / `TimbalStudioShell`. Dashboard / table / analytics / settings / admin → **app kit** (`@timbal-ai/timbal-react/app`: `AppShell` + `Page` + the blocks `FilteredDataTable`/`StatGrid`/… or `DataTable`/`MetricRow`/…), plus a self-mounting `<AppCopilot>` floating copilot if it also needs an assistant. Don't force a data app into a chat box.
2. **Never hand-roll what the package ships.** No raw `<table>`, bare `<input>`/`<select>`, KPI `<div>` grids, custom `app-sidebar.tsx`, or `npx shadcn`. Use `DataTable`, `Field*`, `MetricRow`/`StatTile`, `StudioSidebar`, and the `/ui` primitives (`DropdownMenu`, `Popover`, `Select`, `Dialog`).
3. **Styling preflight.** `src/index.css` must keep `@import "@timbal-ai/timbal-react/styles.css"` and `@source "../node_modules/@timbal-ai/timbal-react/dist"`. Deleting either → completely unstyled UI. Never replace with a hand-written OKLCH palette.

## Dashboard reference — copy this, don't reinvent

`src/examples/app-kit-demo/AppKitDemo.tsx` is the **canonical dashboard wiring** (`AppShell` layout-only + `StudioSidebar` flush rail + `Page`/`Section` + the `FilteredDataTable`/`ResourceGallery` **blocks** + a self-mounting `<AppCopilot>`). Copy its structure for any dashboard / CRM / admin screen; compose for the user's domain (don't clone the "Operations" copy or its mock workforce list). The sidebar is **`StudioSidebar`** in `AppShell.sidebar` — pass `{ id, name, icon? }[]` nav items and route in `onSelect`; it is **not** a custom `NavLink` rail. **`StudioSidebar` defaults to `variant="flush"`** (full-height product rail); pass `variant="floating"` for the rounded studio card (`TimbalStudioShell` chat sidebar keeps floating).

- **Global chrome goes through shell slots, not hand-rolled rails.** `AppShell` supports an optional **`topbar={…}`** slot (brand + nav + search + account) — include `<AppShellSidebarTrigger />` inside it when a sidebar drawer also exists. Do **not** build a parallel `<nav>`/`<aside>` outside the shell's slots (`no-custom-shell-chrome` still flags that). Page-scoped actions belong in `Page.actions`.
- **An in-app assistant is `<AppCopilot>`, not a hand-rolled panel.** Drop a self-mounting `<AppCopilot workforceId="…" />` inside the shell — it portals its own floating pill + glass panel. Quick-action chips are the `suggestions` prop; page awareness is `context`; for a custom open button wrap the app in `CopilotProvider` + call `useCopilot()` with `hideTrigger`. **Do not** build a `Sheet` + `TimbalChat` + custom `Composer` "coach panel", and do not add a topbar button to open it. (`AppCopilot` replaced the `AppShell chat` prop removed in 2.0.)
- **Charts are `ChartPanel` + `ChartArtifact`** (or `LineAreaChart`/`PieChart`/…), never raw recharts. For two metrics / a correlation on one plot, use a multi-series `ChartArtifact` (`series: [{ dataKey }, { dataKey }]`); if the ranges differ wildly, normalize to a shared scale and show the real values in the tooltip — don't reach for a raw `ComposedChart` to fake dual axes.
- **Chart color tokens are OKLCH — reference them directly.** Colors come from `--chart-1..6` automatically (usually pass nothing). If you set one, use `var(--chart-3)` (or `bg-chart-3` / `bg-[var(--chart-3)]`) — **never** `hsl(var(--chart-3))`/`rgb(var(--…))`, which is invalid CSS that the build won't catch and renders a black/empty chart (lint: `chart-token-color-fn`).
- **Chart `dataKey`s must be safe identifiers** (no spaces or `%`). The chart layer maps each `dataKey` to a CSS var `--color-<dataKey>`, so `"Water %"` renders black. Use `{ dataKey: "waterPct", label: "Water %" }` (lint: `chart-data-key`).
- **Verify imports against the subpath.** App-kit surfaces (`StatusBadge`, `StatusDot`, `EmptyState`, `StatTile`, `MetricRow`, `DataTable`, `Page`, …) are `/app` (or the root) — **not** `/ui`. A wrong-subpath import is a runtime "no export named X" crash → blank page. When unsure import from the package root, or check `importFrom` in `APP_KIT_CATALOG`. `AppCopilotProvider`'s prop is `value` (not `context`), and it's redundant when `<AppCopilot>` is already mounted in the layout.
- **Never swallow fetch errors.** `.catch(() => {})` turns a failed request into a permanent empty skeleton with no diagnostic — log the error (and show an `EmptyState`/`Banner`). Run the preview and read its logs before calling a screen done; a clean `tsc` does not catch wrong-subpath exports, JSX root-element structure, SQL behavior, or visual rendering.

**Reach for blocks before primitives, and read the catalog before inventing an export.** The kit is self-describing — `APP_KIT_CATALOG` (machine-readable: every `importFrom` resolves, blocks carry `composedOf` + a `source` to fork), `APP_KIT_CORE_INSTRUCTIONS` (compact always-injected tier), and `APP_KIT_AGENT_INSTRUCTIONS` (full menu + anti-slop rules) are exported from `@timbal-ai/timbal-react/app`. Readable prompt files also ship at `@timbal-ai/timbal-react/prompts/*`. New blocks/layouts added to the package surface there automatically, so the catalog — not memory — is the source of truth.

## Scaffold layout

```
src/
├── pages/Home.tsx             # renders the shell (TimbalChatShell / TimbalStudioShell)
├── pages/NotFound.tsx
├── components/ui/sonner.tsx   # Toaster
├── lib/studio-chat-chrome.tsx # `components={...}` slot overrides for the chat
├── lib/thread-message-layout.ts
├── examples/app-kit-demo/     # dashboard reference (gated by VITE_APP_KIT_DEMO)
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

- **Import from the root `@timbal-ai/timbal-react`** unless you want tree-shaking clarity (`/chat`, `/studio`, `/app`, `/ui`). Don't run `npx shadcn` or author primitives in `src/components/ui/` — primitives ship from `/ui` wired to the tokens.
- Pin `@timbal-ai/timbal-react` to a **published** version (e.g. `^3.2.0`); use `file:../timbal-react` + `bun run dev:linked` only for local library dev. Add `motion` if you import `motion/react`.
- Theming / rebranding (3.1+): generate a full personality (color + surfaces + roundness + shadows + fonts + charts) with `createTimbalTheme({ brand, accent?, radius?, shadow?, surfaces?, defaultMode?, chartPalette?, typography?, overrides? })` and apply it at **runtime** via `applyTimbalTheme` / `<TimbalThemeStyle>`, or apply a preset (`VITE_THEME_PRESET`, `applyThemePreset`). Do **not** paste `themeToCss` output into app CSS (the literals fail the lint gate), and note `ThemePresetGallery` is **not exported** (dev-internal). **Never hand-author OKLCH** or paired `:root`/`.dark` blocks; one-off tokens go through the intent's `overrides` (token-referential: `var()`/`color-mix()`). Full recipe in the `timbal-ui` skill.
- Before finishing: `bun run build` and `bun run lint` (use the project's `tsc`, not `bunx tsc`).
