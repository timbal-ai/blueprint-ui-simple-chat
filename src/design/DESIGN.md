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
| Typography | `geist` pairing, tracking tight, headings 500, `baseSize: 16` / `scale: 1.15` | User direction (2026-07-10); titles are NEVER bold. Sizes bumped 2026-07-13 (user: body/labels read minuscule) — base 15→16px, sm 12.5→13.9px, xs 11→12.1px; scale narrowed 1.2→1.15 so headings don't blow up with the bigger base |
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
| Beacon "Reporting: Objectives" shot | user-provided (2026-07-13) | Textured control surfaces (buttons/inputs/selects), plain rounded-2xl cards with soft shadow, tactile switch, gradient capped bars in tone-tinted ghost tracks, MetricLegendList (big numbers + View under the chart) |

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
- Chat readability (2026-07-13): the composer textarea and welcome
  subtitle/suggestions render at `--text-base` (16px) — the library
  hardcodes `text-sm` on them, overridden in `index.css` (`.aui-composer-input`
  etc.). 16px on the input also prevents iOS Safari focus zoom. The user
  bubble (`chat/user-message`) is `text-base` too.

## Component decisions

- **Controls (reference button recipe, 2026-07-13):** the white control
  surface follows the 4-step recipe exactly, token-mapped:
  30px control height (`h-7.5` buttons), 10px corners (`rounded-md` =
  --radius − 2px), text 14/medium, vertical grade white → #F7F7F7
  (`SURFACE_GRADE`: card → 3%-black mix), NO stroke — instead
  `SURFACE_BORDER` (border mixed 60% toward card ≈ #ECECEC hairline) +
  `SURFACE_SHADOW`, a single soft drop (X:0 Y:1 blur 2, 8% black). All in
  `@/lib/control-surface`; inputs/selects/textareas share the same three
  primitives so fields and white buttons match side by side. Primary/
  destructive keep the DNA gradient fill + top sheen (`FILLED_CHROME`)
  with the same single-drop discipline (18% black). Outline/secondary
  hover moves the gradient STOPS (`hover:from-secondary-fill-hover-*`),
  never a flat bg swap.
- **Cards (Beacon reference 2026-07-13):** plain neutral `bg-card` fill —
  NO gradient — `rounded-2xl` (global radius bumped 0.625 → 0.75rem via
  dna.json) with a quiet two-layer shadow. Texture lives on controls;
  cards stay calm slabs.
- **Switch (Beacon reference 2026-07-13):** recessed track (inset shadow,
  h-5 w-9) with a top-lit primary grade when checked; raised white domed
  thumb with its own soft drop.
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
- **Icons:** Nucleo outline 18 via `@/components/icons` only (a fill-pack
  experiment was reverted 2026-07-13 — keep outline). Chrome icons — inside
  inputs, white buttons (secondary/outline/ghost), selects, and the sidebar
  nav — plus placeholder text render in the DNA `--icon-muted` role
  (#BABABA-equivalent light gray; darker counterpart in dark mode). The
  role lives in `dna.json` `overrides` and maps to the `text-icon-muted`
  utility via `index.css`. Icons with an explicit `text-*` class and dark
  primary/destructive button icons are unaffected.
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
  kit — NOT Recharts. `TrackedBarChart` (restyled 2026-07-13 to the Beacon
  reference) = rounded-xl bars filled with a vertical tone gradient
  (62%-white top → tone) plus an inset white top sheen, rising inside
  tone-tinted ghost tracks (`tone` mixed 13% into `--card`; set
  `trackTint="muted"` for gray). Per-datum `track` sizes the ghost to a
  second value (total/target) — the value-vs-total grammar. Selection
  outlines the track (ring-offset) and deepens the fill, and should drive
  a headline readout. The `height` prop is a MINIMUM: the chart fills its
  parent (h-full + flex-1), so in an equal-height grid row give the card's
  content column `flex-1` (or use `ChartCard`) and the bars stretch with
  the card — never a dead band under the plot. `MetricLegendList` is the companion legend below
  the plot: gradient tone pill (same paint as the bars), label + muted
  count, a BIG number (1.45rem medium, tabular) with muted caption, and
  a trailing outline View button; muted "Status / Metrics as of today"
  column headers above. Rings (`ActivityRings`, `SegmentedScoreRing`)
  use rounded caps over `--muted` tracks; `ContributionHeatmap` mixes
  the tone into `--muted` for intensity (works in dark mode). All colors
  via the `ChartTone` scale (`--chart-1..8` + status tones) — never hex.
  Chrome: `ChartPeriodPager` (white pill, SURFACE_SHADOW) and
  `ChartRangeTabs` (active option floats on a white pill). House chart
  bans still apply: no legends-with-swatches-only, no Y-axis numbers —
  tooltips carry magnitudes, MetricLegendList carries the breakdown.
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

## Dashboard grammar (2026-07-13)

`pages/hr-dashboard-page` is the full block-kit reference — enriched because
forked dashboards kept coming out plain (header + bare stat cards and nothing
else). The canonical rhythm is now: PageHeader **with actions** (outline
Export + dark primary that opens a create FormSheet) → StatOverview →
MetricTrendCard + RosterCard band → RecommendationCard band → charts band
(composed ChartCard + donut ChartCard, `lg:grid-cols-[3fr_2fr]`) → engagement
band (SegmentedScoreRing + ScoreBreakdownList / ContributionHeatmap,
`lg:grid-cols-2`) → FilteredTable + BulkActionBar + detail Sheet. When
forking, CUT bands that don't apply — never flatten a kept band into
hand-rolled divs, and never ship a dashboard that is only stats + table.

Same pass applied to the other templates (2026-07-13):
`pages/health-dashboard-page` adds a resting-heart-rate MetricTrendCard and
a recovery card (house ScoreGauge over a MetricLegendList of vitals) — the
wired reference for both blocks. `pages/earnings-page` ends in a
payout-history FilteredTable (search, status facet, selection →
BulkActionBar) so analytics pages show the table grammar too.

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
