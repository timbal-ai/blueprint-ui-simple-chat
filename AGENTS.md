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
   - `blocks/` — **the block kit: screen-level patterns. Compose from these
     FIRST.** `catalog.ts` (`BLOCKS_CATALOG`) is the machine-readable index —
     read it before building any screen; `blocks/index.ts` barrels the whole
     kit (`import { AppShell, BulkActionBar } from "@/components/blocks"`).
     `AppShell` (default `variant="inset"` — gray canvas, white bordered
     content card, built-in sidebar collapse toggle + a mobile brand bar with
     an in-flow opener; on mobile, tapping a nav entry auto-closes the
     drawer), `SidebarUser` (avatar + account dropdown for the sidebar
     footer — always ends with a destructive Sign out entry; wire
     `onSignOut` to the real teardown), `PageHeader`, `ListDetailLayout`,
     `FilteredTable`
     (+ `IconCell`/`AvatarChipCell`/`AvatarChip`, checkbox-facet
     `moreFilters` popover), `BulkActionBar` (floating selection bubble —
     pair with row selection), detail-panel sections, `FormSheet`/`FormField`
     (sheet `size` presets up to `full`), settings scaffolding,
     `StatOverview`/`ChartCard` (edge-less charts), `ResourceGrid`,
     `AssistantPill` (the floating AI pill, streaming pre-wired),
     `EmbeddedChat` (the chat PAGE for apps in RoutedAppShell — full-bleed
     on the content card, no title, streaming pre-wired),
     `chart-demos` (eight Recharts recipes incl. composed line+bar, stacked,
     donut-with-total, radar — no legends, gradient fills),
     `interactive-charts` (the consumer-metrics kit — `TrackedBarChart`
     gradient capped bars in tone-tinted ghost tracks, per-datum `track`
     for value-vs-total, `MetricLegendList` (chart legend rows: gradient
     tone pill, big number + caption, View action), `ActivityRings`,
     `SegmentedScoreRing` + `ScoreBreakdownList`, `ContributionHeatmap`,
     `RingCalendar`, plus `ChartPeriodPager`/`ChartRangeTabs` chrome;
     tones via `--chart-1..8`; everything animates by default — mount
     sweeps, hover lifts/pops),
     `MetricTrendCard` (headline number + delta badge + range tabs over a
     morphing gradient area chart), `RosterCard` (gray people tile —
     count headline, paginated 2-up person grid with role chips),
     `PdfViewer` (toolbar + native PDF embed, zero deps — mount in a page
     section or a wide Sheet/Drawer), `ImageCard`/`MediaGrid` (image-first
     cards for galleries and asset libraries, overlay or below-image
     captions).
   - `icons.tsx` — **the house icon pack (Nucleo UI outline 18px). Import
     every icon from `@/components/icons`, never from an icon library
     directly.** Need a new glyph? Add one re-export line there.
   - `pages/` — full page templates. `catalog.ts` (`PAGES_CATALOG`) indexes
     every forkable page; `invoices-page.tsx` is the reference entity-index
     grammar; `hr-dashboard-page.tsx` is the reference dashboard grammar
     (stats → cards → chart → table); `customer-detail-page.tsx` and
     `workspace-detail-page.tsx` are condensed full-page record details
     (Stripe / Cloudflare grammar); `health-dashboard-page.tsx` is the
     consumer-metrics grammar (interactive tracked bars driving a headline,
     score ring, activity rings, ring calendar, alerts feed);
     `earnings-page.tsx` is the earnings/usage-analytics grammar (range
     tabs swap the dataset, MetricTrendCard + RosterCard band, stat
     chips, contribution heatmap);
     `media-library-page.tsx` is the asset-library grammar (ImageCard grid
     + document list → photo Sheet preview / PdfViewer in a wide right
     Drawer). Fork them, don't restart. Index pages ship row click →
     detail Sheet; detail pages are their own routes with breadcrumb
     eyebrow + MetadataGrid + tabs.
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
 `TimbalStudioShell` (`Home.tsx`, mounted at `/chat`). Screens with content
 (data, settings, admin, catalog) → `RoutedAppShell` (from `blocks/`) +
 `PageHeader` + blocks, and drop `<AssistantPill />` (from
 `blocks/assistant`) on operational screens so the AI is one tap away.
 App with a chat/copilot entry in the sidebar nav → `EmbeddedChat`
 (`blocks/embedded-chat`) as that route. Don't force a data app into a
 chat box.
- **Pages are ROUTES (hard rule).** Every page/screen gets its own
  react-router route — never a `useState`-switched view inside one giant
  component (deep links, back/forward, and refresh must work). Mount
  `RoutedAppShell` (`blocks/routed-app-shell`) once as a layout route: nav
  item ids ARE route paths, the active row derives from the URL, and pages
  render through the router's `<Outlet />`. Register one `<Route>` per page
  in `App.tsx` (the `/gallery` tree is the living reference).
- **Page inset (hard rule).** AppShell/RoutedAppShell apply lateral +
  top/bottom breathing room automatically — page templates use `PageBody`
  (gap/scroll only, no extra px-/py- on the root). Standalone pages outside
  a shell use `PageBody inset`. Never run `PageHeader`, stats, or tables flush
  to the card/viewport edge; never put `p-0` on a `Card` that holds forms
  or headings. (Lint-enforced: `page-missing-inset`, `card-flush-content`.)
- **Chat shell mount convention (hard rule).** The chat shell owns the whole
 viewport: give it its own route and render it as that route's ONLY child.
 NEVER nest `TimbalChatShell`/`TimbalStudioShell` inside `AppShell`, a
 `Card`, a `Sheet`, a grid cell, or any padded/height-constrained wrapper —
 it manages its own layout, scrolling, and composer, and does not scale
 inside another shell. A chat/copilot/assistant PAGE inside an app's
 sidebar nav is `EmbeddedChat` (`blocks/embedded-chat`) mounted as its own
 route with nothing else on the page: it renders the streaming thread
 native to the shell's white content card — full-bleed, NO `PageHeader`,
 NO title/subtitle above it, NO card or border around the thread (a chat
 framed like a widget inside the page is the named mistake). In-page AI on
 an app screen is `AssistantPill`, never an embedded chat shell. If the
 design truly needs a bespoke chat layout beyond that (custom rail, split
 view), build it on `ChatScreen` (`blocks/chat-screen`) — never hand-roll
 the message/composer scroll layout.
- **House visual rules** (already encoded in the components — keep them):
  titles are never bold (`font-medium` max, tight tracking; `PageHeader`
  owns the spacing rhythm — eyebrow, 1.6rem title, relaxed description);
  search bars, selects, and inputs are white (`bg-card`), never gray;
  inputs and white buttons cast the SAME shadow (`SURFACE_SHADOW` from
  `@/lib/control-surface` — never `shadow-xs` on a control); tables render
  directly on the surface (`DataTable` `bordered` stays off — never wrap a
  table in a card) and the header row is a ROUNDED muted band (cells carry
  `bg-muted`, first/last corners rounded, NO vertical dividers between
  header cells, sort buttons hover as rounded pills; `DataTable` columns
  are drag-to-reorder and edge-resizable by default — don't rebuild
  either); toolbar filter triggers read at full label strength
  (`text-foreground`, same as the Filters button); badges are vibrant
  (solid-tone text, tinted fill, darker outline of the same tone; DNA
  `color.status: "vivid"`); checkboxes/radios check in the DNA selection
  blue (`bg-selection` from `dna.json` `color.selection`), with a
  deliberately small tick; sheets float (inset + fully rounded, `size` up
  to `full`); KPI tiles are the two-layer reference card (gray outer tile,
  white inner value card with soft shadow — `app/stat`); charts are
  edge-less, legend-free (tooltips only), gradient-filled, on the cool
  DNA palette (`--chart-1..8`); buttons are compressed (h-8) with the
  gradient top sheen; state changes animate (tabs, overlays, page mounts,
  the bulk bubble); brand rows use `TimbalMark` (chrome liquid-metal, from
  `@timbal-ai/timbal-react/studio`) + a `text-base font-medium` name that
  matches page-title weight.
- **Overlay discipline:** one overlay at a time — never nest a Select (or a
  second popover) inside a Popover; use checkbox rows like `FilteredTable`'s
  `moreFilters`.
- **Mistakes we keep seeing — NEVER do these:**
  - **Unnecessary topbars.** Inset pages own their header (`PageHeader`).
    Do not add a topbar that only holds a brand chip and one button — the
    brand lives in the sidebar, the primary action lives in `PageHeader`
    `actions` (or the table's `toolbarEnd`). Use `AppShell`'s `topbar` slot
    only when the product genuinely needs persistent global chrome
    (workspace switcher, global search).
  - **Single-route apps.** All "pages" crammed into one component behind a
    `useState` switcher. Every page is a route (see "Pages are ROUTES"
    above) — use `RoutedAppShell` as the layout route and one `<Route>` per
    page. State-switched views break deep links, back/forward, and refresh.
  - **Flush page content** (titles/tables/forms hugging the shell or card
    edge — no lateral/top/bottom breathing room). AppShell applies inset;
    page templates wrap in `PageBody` (no duplicate px-/py- on the root).
    Standalone pages use `PageBody inset`. Never `Card className="p-0"` for
    forms/headings — use CardHeader/CardContent.
  - **Custom-painted buttons.** Never put a `bg-*` fill on a `Button`
    (`bg-success`, `bg-primary`, gradients, arbitrary values) — the label
    color is no longer contrast-gated and you get the classic unreadable
    green button. Buttons come from the variant system ONLY: `default`
    (dark), `secondary` (white), `outline`, `ghost`, `destructive`, `link`.
    Status color belongs in a Badge or icon, not the button fill.
    (Lint-enforced: `button-custom-fill` in `timbal-ui-lint` ≥ 4.2.1;
    state-scoped tints like `hover:bg-destructive/10` stay allowed.)
  - **Chat page framed as a widget.** A chat route inside an app shell
 rendered as `PageHeader` (title + subtitle) + a bordered/rounded card
 with the thread inside — it reads as an embedded third-party system,
 not a native page. The chat page is `EmbeddedChat` and nothing else:
 the conversation IS the page, full-bleed on the content card. The
 sidebar nav entry already names the page; no in-page title needed.
 - **Tinted chat composer.** The chat input and the band around it stay
    on the plain surface — never give the composer row a colored/tinted
    background. The chat shells already style the composer; don't wrap them.
    Since timbal-react 4.2.1 the runtime composer band paints
    `var(--thread-canvas, var(--card))` — white by default. If a chat sits
    on a non-white canvas, set `--thread-canvas` on an ancestor instead of
    wrapping the composer.
  - **Displaced chat composer.** The chat input must NEVER be pushed below
    the fold as the conversation grows — the page never scrolls to reach
    it. The layout is a viewport-owning flex column where the MESSAGE
    LIST is the only scroll container (`flex-1 min-h-0 overflow-y-auto`)
    and the composer is a pinned flex sibling below it. Never put
    messages + input in normal document flow. If you are hand-building a
    chat surface, use `ChatScreen` (`blocks/chat-screen`) — it encodes
    this contract (including the load-bearing `min-h-0`) and auto-follows
    streaming output. Since timbal-react 4.2.1 the runtime thread also
    self-caps at `max-h-dvh` as a guard rail, but that does not excuse a
    broken host layout — mount shells per the convention above.
  - **Chart clutter.** No legends, no Y-axis numbers (they collide with
    edge-less plots), no bordered chart wrappers inside cards — tooltip
    carries the detail.
  - **Bulk actions in the toolbar.** Selection actions live in the floating
    `BulkActionBar`, not as disabled toolbar buttons.
  - **Squared hovers.** Row and column hovers are rounded (built into
    `TableRow`/`DataTableColumnHeader`) — don't override with square
    full-bleed highlights.
  - **Hand-rolled gauges.** Any semicircle/ring score visual is
    `ScoreGauge` (`@/components/app/score-gauge`) — never draw SVG arcs by
    hand (broken geometry, raw colors, misaligned caps every time).
  - **Native browser pickers.** `<input type="date">` (and time/month/
    color) and native `<select>` are lint-banned — use `ui/date-picker`
    (DatePicker + DatePickerButton + DatePickerCalendar) and `ui/select`.
  - **Hand-rolled chart tooltips.** Chart tooltips are ALWAYS
    `ChartTooltipContent` — a custom tooltip div is how you get an
    illegible colored box with duplicated rows.
  - **Tinted info cards.** Summary/value cards inside sheets and pages
    stay `bg-card` (white) — never wash them with a blue/colored tint.
    Color belongs to badges, gauges, and charts, not card backgrounds.
  - **Unreadable labels on solid fills.** A solid status fill without its
    foreground pair (`bg-success` with default text) renders near-black
    text on saturated green — invisible. Lint-enforced
    (`status-fill-foreground`): solid chips use the Badge `*-solid`
    variants (`success-solid`, `warning-solid`, `destructive-solid`,
    `info-solid` — fills paired with compiler contrast-gated
    foregrounds), tinted chips use `bg-<tone>/15 text-<tone>`.
  - **Gray mobile canvas.** On mobile the content surface is plain WHITE
    (`SidebarInset` handles it) — the gray canvas / gradient backdrop is
    desktop-only chrome. Never give a mobile page a gray or tinted
    background unless the user explicitly asks for one.
  - **Blue-washed surfaces.** Canvases, dropdown/menu hovers, sidebar
    active items, and mobile sheets are neutral white/gray/dark — never
    brand-tinted. The DNA compiler (v1.3.0+) enforces this: neutrals
    default to pure gray (`chroma: 0`) and `color.accent` never tints
    hover surfaces. Do not "fix" it back with overrides or utility
    classes; tinted neutrals require an explicit
    `color.neutrals.chroma` opt-in.
- **Blocks first, primitives second, raw HTML last.** Read
  `src/components/blocks/catalog.ts` and compose the screen from blocks:
  `AppShell` over a hand-rolled rail/topbar, `FilteredTable` over a
  hand-rolled toolbar+table, `ListDetailLayout` over ad-hoc split panes,
  `FormSheet`/`FormField` over bare forms, `SettingsSection`/`SettingsRow`
  over toggle lists, `StatOverview`/`ChartCard` over KPI div grids. Drop to
  `src/components/ui` primitives for the gaps between blocks; hand-roll only
  when neither fits, in the same style. The `/gallery` showcase
  (VITE_GALLERY) shows the intended composition — `/gallery` itself renders
  the forkable `invoices-page` template inside the inset `AppShell`.
- **Fork, don't fight.** If a block is 80% right, fork the file and adjust —
  don't rebuild the pattern from primitives.
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
│   ├── blocks/        # block kit + catalog.ts — compose screens from these first
│   ├── pages/         # page templates (invoices-page — fork for index screens)
│   ├── app/           # page scaffold, sections, stats
│   └── chat/          # chat chrome slots (welcome, user bubble)
├── pages/             # Home (chat shell) · Placeholder (replace!) · gallery/ showcase (dev/CI) · NotFound
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
| `VITE_GALLERY` | mounts the `/gallery` showcase — invoices reference page (index), `/gallery/blocks`, `/gallery/pages/{customer,workspace,health,earnings,media}`, `/gallery/chat` (EmbeddedChat), `/gallery/primitives/{forms,overlays,data,feedback,navigation,pickers}`, `/gallery/charts` (Recharts recipes + the interactive kit); see `src/pages/gallery/catalog.ts` (`GALLERY_CATALOG`); key routes are shot by the screenshot smoke CI |
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
