# Design record

> **Read this before any UI work. Update it after any design decision.**
> This file + `dna.json` are the durable design memory of this project —
> every future session reads them first so page 12 looks like page 1.

## Intent

Enterprise-grade operations UI (dashboards, entity indexes, record detail,
settings) plus the Timbal chat surfaces. Calm white-on-gray product feel,
Inter tracking-tight, vibrant-but-controlled accents. The kit must scale to
different domains and 1:1 reference matching without AI slop.

## DNA summary

| Axis | Value | Why |
|---|---|---|
| Finish | `timbal` (canvas gradient, gradient + inset controls) | The house look — keep unless the user or a reference asks for flat |
| Surfaces | `panel` (gray canvas, elevated cards) | Safe SaaS default |
| Brand | `#18181b` (neutral zinc — zero chroma) | Near-black primary; color comes from status/selection/chart accents |
| Status | `vivid` | Badges/status chips must pop (user direction: vibrant, never washed out) |
| Selection | `#3B76FF` | House blue for checkbox/radio checked states (`--selection`) |
| Charts | explicit cool palette (blue → violet → teal → magenta → sky → indigo → aqua → cobalt, oklch) | "Cooler" gradient-friendly series colors, distinct in both modes |
| Typography | `geist` pairing, tracking tight, headings 500 | User direction (2026-07-10); titles are NEVER bold |
| Shape | radius 0.625rem, rounded controls | Middle of the road |
| Density | comfortable (tables py-2) | Reference tables are denser than stock |
| Motion | snappy (150ms base) | Product-feel default |

Change any of this in `dna.json`, then run `bun run dna:compile`.
**Never edit `tokens.css` by hand** — `dna:check` rejects drift.

## References

| Source | Ref | Borrowed |
|---|---|---|
| Linear-style invoices shot | user-provided | Index page grammar: big title, search + facets toolbar, dark primary action, soft badges, numbered pagination |
| HR Insights dashboard shot | user-provided | Dashboard rhythm (breadcrumb → title → 3-up KPI → composed chart → tracker table), two-layer KPI tiles, vibrant delta badges |
| Rounded table header shot | user-provided | Muted rounded header band, no header border line |
| "Total Employee / New Hires" cards | user-provided | Stat = gray outer tile + white inner value card with soft shadow |
| Timbal platform sidebar | timbal repo | TimbalMark chrome logo + medium-weight brand title, #F5F5F5 sidebar |
| Cyrel recommendation cards | user-provided | Now on dashboard; approve/dismiss card grammar |
| Stripe customer detail (Refero) | refero.design | Condensed record detail: eyebrow, MetadataGrid, tabbed payments |
| Cloudflare zone detail (Refero) | refero.design | Condensed infra detail: DNS table, security rows, analytics stats |
| Apple-Health-style metric cards | user-provided (2026-07-12) | Interactive chart kit: tracked capped bars with selection, segmented sleep-score ring + breakdown rows, activity rings, ring calendar, period pager pill |
| Creator earnings dashboard shots | user-provided (2026-07-12) | Earnings grammar: headline + vivid delta badge, Weekly/Monthly/Yearly range tabs, stat chips, contribution heatmap |
| "Recent hires / Revenue" cards shot | user-provided (2026-07-12) | RosterCard (gray tile, white person tiles, role chips, Previous/Next) + MetricTrendCard (headline + delta + range tabs over a gradient area line) |

## Layout decisions

- Shell: `AppShell variant="inset"` — gray canvas, white bordered content
  card, sidebar with collapse toggle; mobile gets an in-flow brand bar and
  the drawer auto-closes on nav.
- Chat: three surfaces, picked by product shape — full-viewport
  `TimbalChatShell` on its own route (`/chat`) for chat-first products; a
  chat page in the sidebar nav is `EmbeddedChat` (`blocks/embedded-chat`)
  mounted as its own route — full-bleed on the shell's white content card,
  NO PageHeader/title, NO card around the thread (`/gallery/chat` is the
  reference); in-page AI on data screens is `AssistantPill`. The chat
  surface + its composer band always share the card white
  (`--thread-canvas: var(--card)` — EmbeddedChat sets it).
- Page width: boxed; pages own their header via `PageHeader`.

## Component decisions

- **Controls:** inputs/selects/textareas are white (`bg-card`) and share the
  exact `SURFACE_SHADOW` with white buttons (`@/lib/control-surface`).
  Buttons compressed (h-8, rounded-lg) with gradient top sheen.
- **Tables:** transparent (no card wrap), rounded muted header band (cells
  carry `bg-muted`, first/last rounded), sort buttons hover as rounded
  pills, toolbar facet triggers read at full `text-foreground` strength.
- **Badges:** vivid tonal chips — solid-tone text, tinted fill (12–20%),
  darker same-tone outline.
- **Selection controls:** checked state is the DNA selection blue with a
  deliberately small tick.
- **KPI tiles (`app/stat`):** two-layer reference card — gray outer tile
  (label + action) + white inner value card with a soft drop shadow.
- **Charts:** no legends (tooltips only), NO Y-axis numbers (they collide
  with edge-less plots — magnitudes live in the tooltip), zero side margins
  (edge-less inside `ChartCard`), gradient fills via `<defs>`, cool DNA
  palette.
- **Hero metric (`blocks/hero-metric`):** one gradient banner max per
  screen for the headline number — chart-token gradient (indigo→violet),
  white comparison lines (solid current / dotted previous), translucent
  footer strip with `ProportionBar` + `ProportionLegend` (Networth
  reference).
- **Table hovers:** row tint lives on the cells with rounded end caps
  (`TableRow`), column-sort hovers are rounded pills — never square
  full-bleed highlights.
- **Sheets:** float (inset, rounded-2xl), `size` presets sm→full; record
  detail sheets follow `MemberDetailSheet` / `InvoiceDetailSheet` grammar
  (identity header, fields, activity, footer actions).
- **Bulk selection:** `BulkActionBar` floating bottom-center bubble — never
  toolbar buttons.
- **Icons:** Nucleo outline 18 via `@/components/icons` only.
- **Sidebar user menu (`blocks/sidebar-user`):** the dropdown's identity
  card is a BUTTON (fires `onSelect("account")`); there is NO default menu —
  account actions are app-specific, define `menu` per app when building.
- **Condensed record detail (`pages/customer-detail-page`,
  `pages/workspace-detail-page`): full-page routes with breadcrumb eyebrow
  (parent / record — never app name), `RecordDetailHeader`, `MetadataGrid`,
  and tabbed sections — fork for Stripe-style billing records or
  Cloudflare-style infra zones.
- **Recommendation cards (`blocks/recommendation-card`):** approve/dismiss
  triage cards — 17px medium title with a rounded-full priority Badge
  (success/warning/outline), muted summary, border-t label/value detail rows
  ("Projected impact", "Related" — value `font-medium`), and a border-t
  action row: outline edit icon button + flex-1 outline Dismiss + flex-1
  dark Approve. Wired example: the "Recommended actions" band on
  `pages/hr-dashboard-page` (gallery Dashboard).
- **Interactive charts (`blocks/interactive-charts`):** the consumer-metrics
  kit — NOT Recharts. `TrackedBarChart` = rounded-full bars inside
  full-height gray tracks; selection outlines the track (ring-offset) and
  deepens the fill, and should drive a headline readout ("Friday — 7,100
  steps"). Rings (`ActivityRings`, `SegmentedScoreRing`) use rounded caps
  over `--muted` tracks; `ContributionHeatmap` mixes the tone into
  `--muted` for intensity (works in dark mode). All colors via the
  `ChartTone` scale (`--chart-1..8` + status tones) — never hex. Chrome:
  `ChartPeriodPager` (white pill, SURFACE_SHADOW) and `ChartRangeTabs`
  (active option floats on a white pill). House chart bans still apply:
  no legends, no Y-axis numbers — tooltips carry magnitudes.
  **Animation is built in (2026-07):** bars sweep up on mount with a 45ms
  per-bar cascade (capped 350ms) and the same delay ripples range-swap
  data changes; rings/segments draw in clockwise (staggered 100–120ms);
  hover lifts the bar track 1.04 with a faint ring + deepens the fill via
  a `bg-foreground/10` overlay; heatmap cells pop (scale-125 + ring,
  `hover:z-10`); ring clusters scale 1.05. All transition-based
  (`ease-out-strong`), GPU-only transforms, no JS animation loops.
- **Metric trend card (`blocks/metric-trend-card`):** the "Revenue
  $18,240 +9.4%" grammar — muted title, big tabular number + vivid delta
  Badge, `ChartRangeTabs` right, gradient-filled monotone area below
  (Recharts). Range switch swaps the dataset so the line MORPHS (Recharts
  animation) while headline + delta update. No Y axis, tooltip-only.
- **Roster card (`blocks/roster-card`):** the "Recent hires" grammar — a
  Stat-style gray outer tile (`bg-muted/70 rounded-2xl p-2`) with muted
  label + big count and an `action` slot; white person tiles (avatar 10,
  name medium, muted meta, full-width `bg-muted` role chip) in a 2-up
  grid; Previous/Next as paired secondary buttons. Page turns re-mount
  the grid with `stagger-children`.
- **Sign out (SidebarUser):** the account dropdown always ends with a
  destructive Sign out item (LogOutIcon). Apps wire `onSignOut` (falls
  back to `onSelect("sign-out")`) — the entry ships by default so the
  affordance is never forgotten.
- **PDF viewing (`blocks/pdf-viewer`):** always `PdfViewer` — toolbar
  (title, zoom presets, open, download) over the native browser embed in a
  bordered muted well; no pdf.js. Click-to-preview flows mount it in a wide
  right `DrawerContent size="xl"` (see `pages/media-library-page`) or a
  `Sheet size="xl"|"full"`. No src → EmptyState, never a blank well.
- **Image cards (`blocks/media-card`):** galleries/asset pickers use
  `ImageCard` in a `MediaGrid` — caption below the image by default,
  `overlay` gradient caption for photo-first walls; broken images degrade
  to a muted placeholder tile. Captions stay on `bg-card` (never tinted).
- **Drawer sizes (`ui/drawer`):** `DrawerContent size` presets sm→full —
  width for left/right drawers (mirrors Sheet's scale), height for
  top/bottom. Wide (`xl`) side drawers are the home for previews.
- **Breadcrumbs (PageHeader `eyebrow`):** same text style as the description
  (`text-sm text-muted-foreground`). NEVER include the app/product name as
  the first crumb, and only use a breadcrumb trail for nested paths — more
  than 2 levels deep. At 1–2 levels the page title alone carries the
  location (no eyebrow).

## Motion standards (Emil Kowalski / animations.dev craft bar)

Adopted 2026-07 from emilkowalski/skills (`emil-design-eng`, `apple-design`,
`review-animations`). The DNA motion preset stays `snappy` (150ms base);
these rules layer craft on top. The curves live in `src/index.css` `@theme`:

| Token | Curve | Use |
|---|---|---|
| `--ease-out-strong` | `cubic-bezier(0.23, 1, 0.32, 1)` | entrances/exits — the default |
| `--ease-in-out-strong` | `cubic-bezier(0.77, 0, 0.175, 1)` | on-screen movement (sidebar collapse) |
| `--ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | sheets/drawers (iOS curve) |

Rules encoded in the components — keep them when forking:

- **Frequency governs motion.** Command palette (⌘K, keyboard-initiated)
  opens with NO content animation. Tab switches are a bare 150ms fade
  (no slide). Chart tooltips are a 100ms fade only. Occasional overlays
  (menus, dialogs, sheets) get the standard treatment.
- **Asymmetric enter/exit everywhere:** menus 150/100ms, dialogs 200/150ms,
  sheets 300/200ms. Exits always snap faster than enters.
- **Never `ease-in`, never `transition: all`, never `scale(0)`.** Entrances
  start at scale 0.95–0.97 + fade; exits leave at 0.97.
- **Press feedback:** every Button/Toggle scales to 0.97 on `:active`
  (150ms, strong ease-out). `link` variant exempt.
- **Origin-aware overlays:** popover/menu/tooltip/select keep the Radix
  `origin-(--radix-*-transform-origin)`; modals stay center-origin.
- **Tooltips:** 125ms in / 100ms out, and `data-[state=instant-open]`
  renders with duration-0 so sweeping a toolbar feels instant.
- **Stagger:** `stagger-children` utility (40ms steps, capped 200ms,
  4px rise) — `PageBody` applies it so header → stats → table cascade on
  route entry. Decorative; never blocks interaction.
- **Reduced motion = gentler, not zero:** a global layer in `index.css`
  neutralizes tw-animate translate/scale/rotate vars, so every enter/exit
  degrades to a pure opacity fade; stagger rise distance goes to 0.
- **GPU only:** animate `transform`/`opacity`; transition lists name exact
  properties (no `transition-all`).

## Open questions / known gaps

- The floating AssistantPill (z-71, library-owned) can overlap a sheet's
  footer corner; it is draggable and its position persists — acceptable for
  now, revisit if users complain.
