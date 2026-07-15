# Design record

> **Read this before any UI work. Update it after any design decision.**
> This file + `dna.json` are the durable design memory of this project —
> every future session reads them first so page 12 looks like page 1.

## Intent

Enterprise-grade operations UI (dashboards, entity indexes, record detail,
settings) plus the Timbal chat surfaces. **As of 2026-07-14 the design
system is BoardUI (boardui.com)** — user direction: "we use boardui.com for
the primitives and blocks, tables and so on." Typography runs on GEIST
(user direction 2026-07-14: "Use geist not inter in the whole blueprint" —
BoardUI's Inter ramp, Geist faces) at zero tracking,
blue-500/600 gradient primaries, pure-gray neutrals, soft 6%/10% shadows,
cool categorical chart ramp. The kit must scale to different domains and
1:1 reference matching without AI slop.

## BoardUI adoption (2026-07-14)

- BoardUI source lives in `src/components/base/*` (primitives),
  `src/components/application/*` (data-table, dashboard sidebar, stat
  cards), `src/components/foundations/*` — copied in via
  `npx boardui add`, project-owned, React Aria + `@remixicon/react`.
- Tokens: `src/styles/theme.css` (BoardUI primitives + semantic tokens +
  button gradient utilities) and `src/styles/typography.css` (composite
  `text-{family}-{weight}` ramp) import from `src/styles/globals.css`,
  which loads in `index.css` AFTER the timbal-react styles and BEFORE
  `design/tokens.css` (DNA still wins shared names).
- The DNA layer stays (the chat shells consume its tokens) but is retuned
  to render the BoardUI look — see the summary below.
- Class merging: `cn` (lib/utils) and `cx` (utils/cx) share one
  `extendTailwindMerge` config aware of the BoardUI text styles.
- New screens compose BoardUI `base/` + `application/` components first;
  legacy `ui/` primitives remain only where BoardUI has no equivalent
  (dialog, sheet, drawer, popover, command, card, form, charts …).

## BoardUI Pro adoption (2026-07-15)

- The purchased BoardUI Pro kit is merged in, project-owned:
  `application/dashboard/*` (RecentHiresCard, EarningsChartCard,
  RevenueTrendCard, ContributionsCard, StatCards, CustomersTable),
  `application/medical/*` (PatientInfoCard, StepsCard, SleepScoreCard,
  MostActiveDaysCard, ActivityRingsCard, PatientsTable + medical-data),
  `application/calendar/*` (month grid, event chips → anchored
  EventDetailsModal, in-place month switcher, inbox feed),
  `application/ai-profile/*` (cover card + contributions grid + charts),
  `application/ai-chat/*` (visual chat template — chrome reference only).
- Rehosting rule: the Pro templates shipped their own sidebar/header
  shells (`DashboardShell` etc.); those are NOT used. Template content is
  rehosted as house pages (`pages/home-dashboard-page`,
  `medical-profile-page`, `ai-profile-page`, `calendar-page`) inside
  `RoutedAppShell` + `PageHeader` + `PageBody`. The AI chat template is
  the one exception — full-viewport visual reference at
  `/gallery/templates/ai-chat`, never a substitute for the Timbal shells.
- Upstream fix adopted (creator's CLI update, `npx boardui add select
  dropdown date-range-picker`): `useTriggerToggle` in
  `utils/use-dismiss-on-outside-press.ts` replaces the hand-rolled
  armed-close guards in Select/Dropdown and is now also wired into both
  date pickers — pressing an open trigger closes its popover. One
  divergence from upstream, verified in-browser: RAC **Select** opens via
  `useMenuTrigger`'s `onPressStart` (`state.open()`, never a toggle), so
  its trigger must NOT be whitelisted in `useDismissOnOutsidePress` —
  only the popover ref is. The trigger press then counts as an outside
  press (dismiss) and `useTriggerToggle` swallows the same-press reopen.
  Dropdown/date pickers (DialogTrigger-based, which does toggle) keep
  both refs whitelisted.
- Dark-mode token sweep over the Pro sources: `text-black` /
  `text-neutral-*` / `text-slate-950` → `text-text-primary|secondary`,
  chip + kbd fills → `bg-background-tertiary-default`, heatmap/bar ghost
  cells → `bg-chart-track` / `bg-chart-cursor` (identical computed values
  in light; readable in dark). `text-white` on solid colored fills stays.
- Asset adaptations (Vite has no next/image): demo avatars use pravatar
  URLs; `Avatar` now degrades to initials on image error; the Meet PNG is
  an inline SVG mark; ai-chat plugin SVGs became remixicons; the Pro
  `Logo` renders the Timbal mark.
- House chrome kept where Pro files overlapped existing ones
  (week-range-pill, date-picker/shared, dashboard-user-menu keep
  SECONDARY_CHROME etc. — Pro copies were the plain upstream versions).
- **The Pro cards are canonical (user direction 2026-07-15, "the Pro ones
  stay").** The house components that replicated these patterns before the
  purchase were DELETED: `blocks/metric-trend-card`, `blocks/roster-card`,
  and everything in `blocks/interactive-charts` except `MetricLegendList`,
  plus the replica pages `health-dashboard-page` and `earnings-page`. To
  keep the Pro cards reusable beyond their demos, four were lightly
  generalized with props that DEFAULT to the Figma demo data:
  `RevenueTrendCard` (`title`/`periods`/`formatValue`), `RecentHiresCard`
  (`title`/`count`/`people`/`action` + working 4-up paging),
  `SleepScoreCard` (`title`/`headline`/`rangeLabel`/`metrics`, per-metric
  `display` override), `ContributionsGrid` (`data` counts + `max`).
  `insights-dashboard-page` is the wired custom-data example for all four.

## DNA summary

| Axis | Value | Why |
|---|---|---|
| Finish | `timbal` (canvas gradient, gradient + inset controls) | BoardUI buttons are also gradient-filled (light→dark stop) — same recipe |
| Surfaces | `panel` (gray canvas, elevated cards) | Matches BoardUI's neutral-100 canvas / white card grammar |
| Brand | `#2563eb` (BoardUI blue-600; gradient runs 500→600) | BoardUI primary button gradient blue-500→600 |
| Status | `vivid` | Badges/status chips must pop (user direction: vibrant, never washed out) |
| Selection | `#3b82f6` (blue-500) | BoardUI checkbox/radio check in the primary blue |
| Charts | BoardUI categorical ramp — teal-400, lime-400, pink-400, sky-400, purple-400, #3392ff (BoardUI blue-400), emerald-400, yellow-400 | Mirrors BoardUI `--color-chart-1..8` so both token systems agree |
| Typography | `geist` pairing, tracking normal (BoardUI ramp is 0 tracking), headings 500, `baseSize: 16` / `scale: 1.15` | User keeps Geist over BoardUI's Inter (2026-07-14); titles are NEVER bold; 16px base keeps chat composer readable + stops iOS zoom |
| Shape | radius 0.625rem, rounded controls | BoardUI `radius-2lg` (10px) button feel |
| Density | comfortable (tables py-2) | Reference tables are denser than stock |
| Motion | snappy (150ms base) | BoardUI transitions run 150ms |

Change any of this in `dna.json`, then run `bun run dna:compile`.
**Never edit `tokens.css` by hand** — `dna:check` rejects drift.

## References

| Source | Ref | Borrowed |
|---|---|---|
| Linear-style invoices shot | user-provided | Index page grammar: big title, search + facets toolbar, dark primary action, soft badges, numbered pagination |
| Insights dashboard shot (HR demo data) | user-provided | Dashboard rhythm (breadcrumb → title → 3-up KPI → composed chart → tracker table), two-layer KPI tiles, vibrant delta badges |
| Rounded table header shot | user-provided | Muted rounded header band, no header border line |
| "Total Employee / New Hires" cards | user-provided | Stat = gray outer tile + white inner value card with soft shadow |
| Timbal platform sidebar | timbal repo | TimbalMark chrome logo + medium-weight brand title, #F5F5F5 sidebar |
| Cyrel recommendation cards | user-provided | Now on dashboard; approve/dismiss card grammar |
| Stripe customer detail (Refero) | refero.design | Condensed record detail: eyebrow, MetadataGrid, tabbed payments |
| Cloudflare zone detail (Refero) | refero.design | Condensed infra detail: DNS table, security rows, analytics stats |
| Apple-Health-style metric cards | user-provided (2026-07-12) | Consumer-metrics grammar (superseded 2026-07-15 by the purchased BoardUI Pro medical cards) |
| Creator earnings dashboard shots | user-provided (2026-07-12) | Earnings grammar (superseded 2026-07-15 by the purchased BoardUI Pro dashboard cards) |
| "Recent hires / Revenue" cards shot | user-provided (2026-07-12) | RosterCard (gray tile, white person tiles, role chips, Previous/Next) + MetricTrendCard (headline + delta + range tabs over a gradient area line) |
| Beacon "Reporting: Objectives" shot | user-provided (2026-07-13) | Textured control surfaces (buttons/inputs/selects), plain rounded-2xl cards with soft shadow, tactile switch, gradient capped bars in tone-tinted ghost tracks, MetricLegendList (big numbers + View under the chart) |
| AP invoice review split | user-provided (2026-07-14) | 50/50 document + entries grammar: PdfViewer left, metadata grid + confidence-badged line items + approve/reject footer right, queue prev/next header |

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
- Document review (2026-07-14): `DocumentReviewLayout` — 50/50 resizable
  split with PdfViewer left, extracted entries + `ReviewActionBar` right.
  Dedicated route (`/invoices/:id/review`), not a sheet over the index.
  Mobile (same day, after a stacked-split attempt read as a mess): the
  review card owns the page in natural flow; the source document opens
  from a file-row trigger into a full-height bottom Drawer, and the
  totals + approve/reject actions pin in a FIXED bottom bar (primary
  full-width on top, thumb-first) — never a squeezed 42dvh document
  above a squeezed review pane.
- Chat readability (2026-07-13): the composer textarea and welcome
  subtitle/suggestions render at `--text-base` (16px) — the library
  hardcodes `text-sm` on them, overridden in `index.css` (`.aui-composer-input`
  etc.). 16px on the input also prevents iOS Safari focus zoom. The user
  bubble (`chat/user-message`) is `text-base` too.

## Component decisions

- **Controls (BoardUI, 2026-07-14):** buttons/inputs/selects come from
  `src/components/base/*`. Buttons: primary/danger are gradient fills
  (`bg-button-primary` / `bg-button-danger`, light→dark stop) with a soft
  two-layer drop; secondary (and IconButton) carries a SUBTLE top-lit
  white gradient + inset highlight + soft drop over the neutral-200
  hairline (user direction 2026-07-14: "a bit of bg shadow and a bit of
  gradient on the buttons" — hover/active move the gradient STOPS, never
  a flat bg swap); sizes medium h-9 / small h-8 / xs h-6; `ghost` and
  `link` are project extensions in the same token language; icons pass as
  `leadingIcon`/`trailingIcon` component refs. Retained ui/* controls read
  their skin from `@/lib/control-surface`, retuned to match: flat white
  (`SURFACE_GRADE` is now `bg-background-primary-default`),
  `border-border-button-default` hairline, `shadow-xs`-equivalent drop,
  and BoardUI's blue focus ring (`ring-border-focus-ring`).
- **One secondary chrome for every button-like control (user direction
  2026-07-14, "mix of buttons" screenshot):** the secondary house finish
  is extracted to `base/buttons/secondary-chrome.ts`
  (`SECONDARY_CHROME`/`SECONDARY_SURFACE` + granular pieces) and shared by
  the secondary `Button`, `IconButton`, the `Select` trigger, date-picker
  triggers, `ButtonGroup`, the Pagination active cell, `WeekRangePill`,
  hand-rolled `DropdownTrigger`s, and the legacy `ui/button`
  (secondary/outline) — a
  facet Select and the Filters button in the same toolbar must be
  indistinguishable. Text inputs / search fields stay FLAT
  (`bg-background-primary-default` + `shadow-xs`); the gradient is a
  button affordance, not a field one.
- **Cards (Beacon reference 2026-07-13):** plain neutral `bg-card` fill —
  NO gradient — `rounded-2xl` (global radius bumped 0.625 → 0.75rem via
  dna.json) with a quiet two-layer shadow. Texture lives on controls;
  cards stay calm slabs.
- **Switch (Beacon reference 2026-07-13):** recessed track (inset shadow,
  h-5 w-9) with a top-lit primary grade when checked; raised white domed
  thumb with its own soft drop.
- **Tables (BoardUI Data Table card, 2026-07-14):** `FilteredTable` renders
  the NATIVE BoardUI Data Table block grammar — one `rounded-2xl` bordered
  card owning the whole unit: a "Total Results / N {items}" count header
  top-left, the filter cluster right-aligned (facet Selects → Filters
  popover → rounded-full GRAY search pill → toolbarEnd actions), the
  full-bleed `.bui-table` (flat muted header band, no rounded corners, no
  vertical dividers, `ChevronSortDown` sort glyph), and the numbered
  Pagination footer inside the card (Previous left / 32px number cells
  center / Next right). No "Showing X to Y" caption — the count header
  carries the total. Column drag-reorder/resize from the old DataTable
  were retired with it.
- **Badges (BoardUI, 2026-07-14):** status labels are `Chip`
  (`base/badges/chip`) — the 200/800 tonal recipe (lime/rose/yellow/cyan/
  blue/purple/neutral/gray/soft); status mapping success→lime,
  warning→yellow, destructive→rose, info→blue. Numeric counters are
  `Badge` (`base/badges/badge`, primary blue or neutral).
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
- **Settings modal (`blocks/settings-dialog`, 2026-07-15, Cursor-style
  reference shot):** two-pane dialog — gray left rail
  (`bg-background-secondary-default`) with grouped nav (selected row =
  tertiary gray pill, NOT brand blue), white content pane with the section
  title + BoardUI `CloseButton` and its own scroll. Rows are gray rounded
  slabs (`SettingsDialogRow`: title/description left, one `base/*` control
  right), clustered under muted group labels (`SettingsDialogGroup`);
  `SettingsPlanCard` is the current-plan banner with a decorative artwork
  slot. On mobile the rail flattens to a horizontal pill row — no nested
  drawer. Settings as a ROUTE keep using `settings-page` scaffolding.
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
  `pages/insights-dashboard-page` (gallery Dashboard).
- **Interactive metric cards = the BoardUI Pro components (2026-07-15).**
  The house replicas that predated the purchased kit (`TrackedBarChart`,
  `ActivityRings`, `SegmentedScoreRing` + `ScoreBreakdownList`,
  `ContributionHeatmap`, `RingCalendar`, `ChartPeriodPager`,
  `ChartRangeTabs`, `MetricTrendCard`, `RosterCard`) were DELETED — the
  Pro cards in `src/components/application/{dashboard,medical}` are the
  only implementations: `RevenueTrendCard` (gradient area/line, count-up
  headline, pulsing active dot; generic via `title`/`periods`/
  `formatValue` — period key order becomes the SegmentedControl tabs),
  `RecentHiresCard` (gray tile, 2×2 white person tiles, built-in 4-up
  paging; generic via `title`/`count`/`people`/`action`),
  `EarningsChartCard` (period-switched bars + hover outline),
  `ContributionsCard`/`ContributionsGrid` (GitHub-style heat grid;
  the grid takes real `data` counts + `accent` family), `StepsCard`
  (weekly bars + week pager), `SleepScoreCard` (segmented score ring +
  breakdown rows; generic via `metrics` — see the engagement band on
  insights-dashboard-page), `MostActiveDaysCard` (month of mini rings,
  reports day clicks), `ActivityRingsCard`, `WeekRangePill` (the ‹ label ›
  pager with a rolling-counter label). All props default to the Figma demo
  data. The only survivor of the old kit is `MetricLegendList`
  (`blocks/interactive-charts`) — the Beacon legend rows (gradient tone
  pill, big number + caption, View action) with no Pro equivalent, kept
  and showcased on /gallery/charts.
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

`pages/insights-dashboard-page` is the full reference — enriched because
forked dashboards kept coming out plain (header + bare stat cards and nothing
else). Domain-agnostic: demo copy uses HR sample data; fork for any vertical.
The canonical rhythm is now: PageHeader **with actions** (outline
Export + dark primary that opens a create FormSheet) → StatOverview →
RevenueTrendCard + RecentHiresCard band (the BoardUI Pro cards fed page
data via props) → RecommendationCard band → charts band (composed ChartCard
+ donut ChartCard, `lg:grid-cols-[3fr_2fr]`) → engagement band
(SleepScoreCard as a generic score ring / ContributionsGrid heatmap,
`lg:grid-cols-2`) → FilteredTable + BulkActionBar + detail Sheet. When
forking, CUT bands that don't apply — never flatten a kept band into
hand-rolled divs, and never ship a dashboard that is only stats + table.

**Deduplication (2026-07-15):** the old `pages/health-dashboard-page` and
`pages/earnings-page` — our pre-purchase replicas of the BoardUI metrics
grammars — were deleted. Their intents route to the real Pro templates now:
health/wellbeing/consumer metrics → `pages/medical-profile-page`; earnings/
revenue/creator analytics → `pages/home-dashboard-page`. The unmatched house
pieces survive: `ScoreGauge` (semicircle), `MetricLegendList`,
`HeroMetricCard`/`ProportionBar` — all showcased on /gallery/charts.

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
