/**
 * BLOCKS_CATALOG — machine-readable index of the block kit.
 *
 * Agents: read `src/components/discovery.ts` FIRST (intent → block/page map).
 * Then this file for full detail on every block. Every entry is project-owned
 * project-owned source under `src/components/blocks/` — import it, pass
 * props, and only fork the file when a requirement genuinely doesn't fit.
 * Compose screens from blocks; drop to `src/components/ui/*` primitives only
 * for the gaps between blocks.
 */

interface BlockEntry {
  /** Import specifier for this block's module. */
  importFrom: string;
  /** Named exports available from the module. */
  exports: string[];
  /** What the block is for, in one sentence. */
  purpose: string;
  /** Concrete situations where this block is the right answer. */
  useWhen: string[];
  /** Primitives/blocks this composes, for forking reference. */
  composes: string[];
}

const BLOCKS_CATALOG: Record<string, BlockEntry> = {
  "page-body": {
    importFrom: "@/components/blocks/page-body",
    exports: ["PageBody"],
    purpose:
      "Vertical rhythm wrapper for a routed page column (gap-5 + mount fade). Inside AppShell/RoutedAppShell the shell already owns lateral/top/bottom inset — use PageBody with default inset=false. Standalone pages (no shell — centered forms, auth) MUST pass inset so content never runs flush to the edge.",
    useWhen: [
      "Every page template's root wrapper — PageBody → PageHeader → sections",
      "Standalone pages outside AppShell — PageBody inset",
    ],
    composes: ["lib/page-inset"],
  },
  "routed-app-shell": {
    importFrom: "@/components/blocks/routed-app-shell",
    exports: ["RoutedAppShell"],
    purpose:
      "THE default frame for multi-page apps: AppShell pre-wired to react-router. Nav item ids ARE route paths ('/', '/invoices', '/settings/billing'); clicking navigates, the active row derives from the URL (longest match), and pages render through the router's Outlet. Applies canonical page inset (lateral + top/bottom breathing room) automatically — pages must NOT re-add px-/py- on their root. Mount it once as a layout route and register one <Route> per page — every page is a ROUTE, never a useState-switched view (deep links, back/forward, and refresh must work).",
    useWhen: [
      "Any app with more than one page/screen — start here, not with raw AppShell",
      "The sidebar nav should reflect and drive the URL",
    ],
    composes: ["blocks/app-shell", "react-router-dom"],
  },
  "app-shell": {
    importFrom: "@/components/blocks/app-shell",
    exports: ["AppShell"],
    purpose:
      "Canonical application frame on the BoardUI sidebar grammar: a floating rounded sidebar panel (white hairline border, sidebar-elevation shadow, 260px ↔ 60px morphing collapse, primary-gradient selected row, Badge counters) beside a white rounded content card on the gray canvas. Sidebar nav supports groups, icons, badges, nested sub-items, and a footer slot; mobile gets an in-flow brand bar + sheet drawer (nav taps auto-close) and a plain white content surface. Applies PAGE_INSET (px-4 sm:px-6 lg:px-8 + top/bottom breathing room) on the content region by default — pages inside must NOT duplicate px-/py- on their root (use PageBody for gap only). Also has an optional sticky topbar and a dock slot for floating chrome. For multi-page apps prefer RoutedAppShell (blocks/routed-app-shell), which wires this to the router.",
    useWhen: [
      "A single-screen embed or a shell you wire to navigation yourself — multi-page apps use RoutedAppShell",
      "You need a sidebar, nested nav tree, topbar, or a docked AI pill",
    ],
    composes: ["base/badges/badge", "ui/sheet", "hooks/use-mobile"],
  },
  "list-detail": {
    importFrom: "@/components/blocks/list-detail",
    exports: ["ListDetailLayout"],
    purpose:
      "Master list + detail panel with overlay discipline: side-by-side split on desktop (detail ≥ 24rem), single Sheet on mobile, one detail surface at a time.",
    useWhen: [
      "Clicking a table/list row should show a record's details",
      "Inbox-, CRM-, or ticket-style screens",
    ],
    composes: ["ui/sheet", "ui/scroll-area", "hooks/use-mobile"],
  },
  "document-review-layout": {
    importFrom: "@/components/blocks/document-review-layout",
    exports: ["DocumentReviewLayout", "ReviewActionBar"],
    purpose:
      "The canonical 50/50 document review split: source file (PdfViewer) left, review card right. CLEAN grammar — both panes are floating cards; the review pane has NO rule lines (header/body/footer separate through whitespace; the pinned footer gets a soft scroll fade, not a border). Resizable on desktop. Mobile: NEVER a squeezed split — review card owns the page, the document opens from a file-row trigger into a full-height bottom Drawer, and the footer actions pin in a fixed bottom bar.",
    useWhen: [
      "Invoice/receipt/contract review — human validates OCR against the original",
      "Any screen where the document is half the canvas and entries + actions are the other half",
    ],
    composes: [
      "ui/resizable",
      "ui/drawer",
      "blocks/pdf-viewer",
      "hooks/use-mobile",
    ],
  },
  "review-extraction": {
    importFrom: "@/components/blocks/review-extraction",
    exports: [
      "ExtractedFieldRow",
      "ReviewLineItemEditor",
      "ExtractionSummaryBand",
      "VendorMatchCard",
      "ReviewQueueHeader",
      "ReviewTotalsStrip",
      "ConfidenceChip",
    ],
    purpose:
      "Extraction-review kit for document-review panes, divider-free by design: hover field rows with quiet dot confidence chips (never loud per-row badges), editable line items on soft muted tiles with GL Select, an inline 3-stat summary band, a tinted vendor-match row, a queue progress header (position, prev/next, arrow-key hints), and a borderless totals block.",
    useWhen: [
      "AP automation / OCR validation flows paired with DocumentReviewLayout",
      "Any review pane that needs field-level confidence + editable entries",
    ],
    composes: ["base/input", "base/select", "ui/progress", "base/buttons/button"],
  },
  "filtered-table": {
    importFrom: "@/components/blocks/filtered-table",
    exports: [
      "FilteredTable",
      "DataTable",
      "DataTableColumnHeader",
      "selectionColumn",
      "IconCell",
      "AvatarChipCell",
      "AvatarChip",
    ],
    purpose:
      "Search + faceted filters + data table wired together on the BoardUI table grammar: TanStack drives sorting/filtering/pagination/selection, rendered through the React Aria Table primitive (.bui-table — neutral header band, bordered rows), BoardUI Selects as facet triggers, the rounded-full secondary search field, and the BoardUI numbered Pagination footer with a 'Showing X to Y of Z' summary. Supports row selection (pair with selectionColumn, exported here) and cell helpers: IconCell (muted icon + value), AvatarChipCell (colored initial tile + name), and AvatarChip (standalone identity tile, sm/lg).",
    useWhen: [
      "Any table that needs search or filters — do not hand-roll a toolbar",
      "Entity index pages (invoices, users, orders)",
    ],
    composes: [
      "base/table",
      "base/select",
      "base/input",
      "base/buttons/button",
      "base/checkbox",
      "base/pagination",
      "ui/popover",
    ],
  },
  "score-gauge": {
    importFrom: "@/components/app/score-gauge",
    exports: ["ScoreGauge"],
    purpose:
      "The house semicircle gauge for a single 0–max score (AI heat score, health, completion): token-toned arc with rounded caps, centered value, caption below. Tone is auto (destructive <40 ≤ warning <70 ≤ success) or explicit (success/warning/destructive/info/selection). NEVER hand-roll an SVG arc or use a raw-color ring — the geometry and tokens are already solved here.",
    useWhen: [
      "A record card/sheet shows one scored metric (lead score, health, %)",
      "Any semicircle/ring 'gauge' visual — do not draw arcs by hand",
    ],
    composes: [],
  },
  "hero-metric": {
    importFrom: "@/components/blocks/hero-metric",
    exports: ["HeroMetricCard", "ProportionBar", "ProportionLegend"],
    purpose:
      "Gradient banner card for THE headline metric (the 'Networth 2025 vs 2026' reference): title + muted context, big value + caption, an edge-to-edge chart slot (pair with DemoComparisonChart — solid vs dotted white lines), and a translucent footer strip. ProportionBar/ProportionLegend render a segmented distribution (rounded pills sized by share, DNA chart tones) — usable standalone on white cards too. OPT-IN resource: not part of the default dashboard grammar — add only when the design/reference calls for a dominant hero number, max one per screen.",
    useWhen: [
      "The reference shows one dominant headline number with trend context",
      "Showing a distribution/breakdown as a segmented bar instead of a pie",
    ],
    composes: ["blocks/chart-demos DemoComparisonChart", "ui/chart"],
  },
  "bulk-action-bar": {
    importFrom: "@/components/blocks/bulk-action-bar",
    exports: ["BulkActionBar"],
    purpose:
      "Floating selection bubble: when table rows (or grid cards) are selected, a pill floats bottom-center with the count and the bulk actions (edit, export, remove…). Standalone — handles its own visibility (hides at count 0), positioning, and enter animation. Render as a sibling of the table.",
    useWhen: [
      "Any selectable table/grid — pair with rowSelection + selectionColumn",
      "Bulk edit/export/delete affordances — never put these in the toolbar",
    ],
    composes: ["ui/button", "ui/separator"],
  },
  "detail-panel": {
    importFrom: "@/components/blocks/detail-panel",
    exports: [
      "DetailSection",
      "FieldList",
      "Field",
      "ActivityFeed",
      "DetailDivider",
      "RecordDetailHeader",
      "MetadataGrid",
    ],
    purpose:
      "Structured record-detail content: aligned label/value description lists, sectioned headings with inline actions, compact activity timeline, plus RecordDetailHeader (condensed identity row for full-page detail routes) and MetadataGrid (dense 2–3-up label/value pairs — Stripe/Cloudflare grammar).",
    useWhen: [
      "Filling the detail side of ListDetailLayout or a record page",
      "Showing metadata fields or an event history",
    ],
    composes: ["ui/separator"],
  },
  "entity-form": {
    importFrom: "@/components/blocks/entity-form",
    exports: ["FormSheet", "FormGrid", "FormField"],
    purpose:
      "Create/edit scaffolding: a floating right Sheet with scrollable body and pinned actions, single-column field grid, and label/help/error wiring per field. FormSheet takes size='sm'|'default'|'lg'|'xl'|'full' (SheetContent width presets) — bump up for dense enterprise forms.",
    useWhen: [
      "Creating or editing a record — FormSheet is the standard surface",
      "Any form: wrap every control in FormField, lay out with FormGrid",
    ],
    composes: ["ui/sheet", "ui/label", "ui/button", "ui/scroll-area"],
  },
  "settings-dialog": {
    importFrom: "@/components/blocks/settings-dialog",
    exports: ["SettingsDialog", "SettingsDialogGroup", "SettingsDialogRow", "SettingsPlanCard"],
    purpose:
      "Two-pane settings MODAL (Cursor/Linear style): grouped section nav on a gray left rail, white content pane that swaps per section. Panes compose from SettingsDialogGroup (labelled cluster), SettingsDialogRow (gray row — title/description left, ONE base/* control right), SettingsPlanCard (current-plan banner with artwork slot). Rail collapses to a horizontal pill row on mobile. Data-driven: pass nav `groups` with per-section `content`.",
    useWhen: [
      "Settings/preferences that open OVER the app (shortcut, avatar menu) instead of navigating away",
      "Multi-section preference panels — general, profile, appearance, billing, notifications",
    ],
    composes: ["ui/dialog", "base/buttons/close-button", "base/switch", "base/select"],
  },
  "settings-page": {
    importFrom: "@/components/blocks/settings-page",
    exports: ["SettingsStack", "SettingsSection", "SettingsRow", "DangerZone"],
    purpose:
      "Settings scaffolding for a full PAGE (own route): one card per topic, label-left/control-right rows that stack on mobile, and a quarantined danger zone. For settings that open over the app as a modal, use settings-dialog instead.",
    useWhen: [
      "Preferences, account, workspace, or notification settings screens with their own route",
      "Any list of toggles/selects paired with descriptions",
    ],
    composes: ["ui/card"],
  },
  "stat-overview": {
    importFrom: "@/components/blocks/stat-overview",
    exports: ["StatOverview", "ChartCard"],
    purpose:
      "Top-of-dashboard band: responsive KPI row (Stat tiles = gray outer tile + white inner value card with a soft shadow, per the reference) plus bounded, titled chart containers with fixed heights (no layout shift). ChartCard renders charts EDGE-LESS by default (plot bleeds to the card's sides).",
    useWhen: [
      "Dashboard headers with metrics at a glance",
      "Any chart — always render inside ChartCard, never bare",
    ],
    composes: ["app/stat", "ui/card"],
  },
  "chart-demos": {
    importFrom: "@/components/blocks/chart-demos",
    exports: [
      "DemoAreaChart",
      "DemoBarChart",
      "DemoComparisonChart",
      "DemoComposedChart",
      "DemoDonutChart",
      "DemoLineChart",
      "DemoPieChart",
      "DemoRadarChart",
      "DemoScatterChart",
      "DemoStackedBarChart",
    ],
    purpose:
      "The canonical Recharts recipes wired to ChartContainer and DNA chart tokens: area, bar, line, pie, composed line+bar (the dashboard reference), stacked bar, donut-with-center-total, radar, scatter, and comparison (solid vs dotted white lines, for HeroMetricCard) — fork one and swap data/config rather than writing Recharts from scratch. House chart grammar: NO legends (tooltips only), NO Y-axis numbers (they collide with edge-less plots — magnitudes live in the tooltip), zero side margins (edge-less inside ChartCard), gradient fills via <defs> linearGradient, and tooltips are ALWAYS ChartTooltipContent — never a hand-rolled div.",
    useWhen: [
      "Adding any chart — copy the closest recipe, keep ChartContainer",
      "Referencing correct tooltip/gradient/color wiring",
    ],
    composes: ["ui/chart"],
  },
  "interactive-charts": {
    importFrom: "@/components/blocks/interactive-charts",
    exports: ["MetricLegendList"],
    purpose:
      "MetricLegendList — the Beacon-style legend under a chart: hairline-separated status rows with a gradient tone pill, label + count, a BIG number with muted caption, and a trailing action (View), under two muted column headers. This is the ONLY surviving piece of the old house interactive kit — tracked bars, rings, score rings, ring calendar, heatmap, trend card, roster card, and the period pager were all retired in favor of the BoardUI Pro cards (see the pro-dashboard-cards / pro-medical-cards entries below).",
    useWhen: [
      "A labeled per-status breakdown under any chart",
      "NOT for bars/rings/heatmaps — those are the BoardUI Pro cards in src/components/application",
    ],
    composes: ["lib/chart-tone"],
  },
  "pdf-viewer": {
    importFrom: "@/components/blocks/pdf-viewer",
    exports: ["PdfViewer"],
    purpose:
      "Inline document viewer: toolbar (file title, zoom presets, open-in-tab, download) over the browser's native PDF renderer in a bordered muted well — zero dependencies. No src renders an EmptyState. height='100%' fills a constrained pane.",
    useWhen: [
      "Document-centric screens (contracts, reports, invoices as files)",
      "Click-to-preview flows — mount inside Sheet size='xl'|'full' or a side DrawerContent size='xl'",
    ],
    composes: ["base/buttons/button", "ui/empty-state", "ui/separator"],
  },
  "media-card": {
    importFrom: "@/components/blocks/media-card",
    exports: ["ImageCard", "MediaGrid"],
    purpose:
      "Image-first cards for galleries, template pickers, and asset libraries: ImageCard (image + title/subtitle caption below, or `overlay` caption over a bottom gradient; badge slot, meta footer, hover lift + subtle image zoom, broken images degrade to a muted placeholder) and MediaGrid (responsive 2–4 column wrapper).",
    useWhen: [
      "Photo/asset galleries, template or theme pickers, content catalogs with cover art",
      "Any card whose primary content is an image — never hand-roll <img> in a Card",
    ],
    composes: ["base/badges chip"],
  },
  "sidebar-user": {
    importFrom: "@/components/blocks/sidebar-user",
    exports: ["SidebarUser"],
    purpose:
      "The account row for AppShell's footer slot: real avatar (with initials fallback) + name/email. The dropdown opens with the identity card as a button (fires onSelect('account')) and ALWAYS ends with a destructive 'Sign out' entry — wire `onSignOut` (falls back to onSelect('sign-out')) to the real session teardown. Other `menu` entries are EMPTY by default — account actions are app-specific, define them per app when building. Adapts to the collapsed icon rail and to mobile (menu opens upward).",
    useWhen: [
      "Every AppShell should end with this in `footer` — never hand-roll the user row",
      "You need account actions reachable from the sidebar in any state",
    ],
    composes: ["base/avatar", "base/dropdown", "blocks/app-shell"],
  },
  "page-header": {
    importFrom: "@/components/blocks/page-header",
    exports: ["PageHeader"],
    purpose:
      "Standard top-of-page band: eyebrow/breadcrumb slot, medium-weight title (titles are never bold), description, right-aligned actions, optional tabs slot flush underneath.",
    useWhen: [
      "The top of every screen — never hand-roll an h1 row",
      "Pages with header actions (export, create) or section tabs",
    ],
    composes: [],
  },
  "resource-grid": {
    importFrom: "@/components/blocks/resource-grid",
    exports: ["ResourceGrid"],
    purpose:
      "Responsive card grid for integrations, templates, or catalog items: icon tile + name + description, optional status badge, and an enable Switch or custom trailing action. Cards lift on hover and are fully clickable.",
    useWhen: [
      "Integration/marketplace/catalog screens",
      "Any collection of enableable resources shown as cards",
    ],
    composes: ["base/badges chip", "base/switch"],
  },
  assistant: {
    importFrom: "@/components/blocks/assistant",
    exports: ["AssistantPill"],
    purpose:
      "The Timbal floating AI pill (AppCopilot), pre-wired: portals its own draggable trigger + glass chat panel, streams via the standard VITE_TIMBAL_* runtime. Drop once per screen; pass context={...} to expose page data to agent tooling.",
    useWhen: [
      "Every operational screen should offer the assistant — add this by default",
      "You need an in-page AI entry point without building chat UI",
    ],
    composes: ["@timbal-ai/timbal-react/app AppCopilot"],
  },
  "invoices-page": {
    importFrom: "@/components/pages/invoices-page",
    exports: ["InvoicesPage", "InvoiceDetailSheet", "StatusBadge", "DEMO_INVOICES"],
    purpose:
      "The reference page template: a full entity-index screen (big title, search + facet toolbar with dark primary action, selectable rows with IconCell/AvatarChipCell, soft status badges, numbered pagination) built on FilteredTable — plus the full record flow: row click opens InvoiceDetailSheet (billing fields, line items, activity, footer actions) and selection surfaces a BulkActionBar. Fork for any index page.",
    useWhen: [
      "Building an entity index (invoices, orders, users) — start from this file",
      "You need the canonical page grammar inside AppShell variant='inset'",
    ],
    composes: [
      "blocks/filtered-table",
      "blocks/bulk-action-bar",
      "blocks/detail-panel",
      "ui/sheet",
      "base/badges chip",
      "base/dropdown",
    ],
  },
  "insights-dashboard-page": {
    importFrom: "@/components/pages/insights-dashboard-page",
    exports: [
      "InsightsDashboardPage",
      "MemberDetailSheet",
      "AddEmployeeSheet",
      "DEMO_EMPLOYEES",
      "DEMO_RECOMMENDATIONS",
    ],
    purpose:
      "THE reference DASHBOARD template — domain-agnostic; fork for sales, ops, finance, product, support, inventory, or any command-center screen (demo data is HR-flavored only to exercise people blocks). Full composition: PageHeader with actions (outline Export + dark primary → create FormSheet), 3-up KPI band, RevenueTrendCard + RecentHiresCard band (the BoardUI Pro cards, fed page data via props), RecommendationCard triage grid, charts band (composed ChartCard + donut), engagement band (SleepScoreCard as a generic score ring + ContributionsGrid heatmap), FilteredTable + detail Sheet + BulkActionBar. Cut bands you don't need — never flatten into plain divs.",
    useWhen: [
      "Building ANY dashboard/overview/analytics screen — start from this file (NOT HR-only)",
      "You need the canonical stats → trend/roster → recommendations → charts → table rhythm",
      "A wired example of feeding the BoardUI Pro cards custom data (trend periods, roster people, score metrics, heatmap counts)",
    ],
    composes: [
      "blocks/page-header",
      "blocks/stat-overview",
      "application/dashboard revenue-trend-card + recent-hires-card + contributions-card",
      "application/medical sleep-score-card",
      "blocks/chart-demos",
      "blocks/recommendation-card",
      "blocks/entity-form",
      "blocks/filtered-table",
      "blocks/bulk-action-bar",
      "blocks/detail-panel",
      "ui/sheet",
      "ui/progress",
      "base/dropdown",
      "base/select",
      "base/date-picker",
      "base/input",
    ],
  },
  "recommendation-card": {
    importFrom: "@/components/blocks/recommendation-card",
    exports: ["RecommendationCard"],
    purpose:
      "One approve/dismiss AI-suggestion card (the Command Center reference grammar): 17px medium title + rounded priority chip, muted summary, hairline-separated label/value detail rows (Projected impact, Related), and a pinned action row (outline edit icon, outline Dismiss, dark Approve). Lay several out in a `grid gap-4 md:grid-cols-2 2xl:grid-cols-3 items-stretch`; see the recommendations band in pages/insights-dashboard-page for the wired example.",
    useWhen: [
      "A triage feed of AI suggestions/alerts the user approves or dismisses",
      "Any card needing the title/summary/details/actions grammar",
    ],
    composes: ["ui/card", "base/badges chip", "base/buttons/button"],
  },
  "embedded-chat": {
    importFrom: "@/components/blocks/embedded-chat",
    exports: ["EmbeddedChat"],
    purpose:
      "The chat PAGE for apps living in RoutedAppShell: the full streaming runtime (TimbalChat) rendered natively on the shell's white content card — full-bleed, edge to edge, NO PageHeader, NO title/subtitle, NO card/border around the thread. Mount it as a route (nothing else on the page); it negates the shell's page inset, keeps the message list as the only scroller with the composer pinned, and paints --thread-canvas: var(--card) so the composer band never seams against the surface. Auto-resolves the workforce like AssistantPill; welcome copy/suggestions/components pass straight through to the thread.",
    useWhen: [
      "The sidebar nav has a chat/copilot/assistant entry — this IS that route",
      "Chat must feel native inside an app shell — NEVER TimbalChatShell nested in AppShell, NEVER a chat-in-a-card with a title above it",
    ],
    composes: [
      "@timbal-ai/timbal-react TimbalChat",
      "@timbal-ai/timbal-react useWorkforces",
      "lib/studio-chat-chrome",
      "lib/page-inset",
    ],
  },
  "chat-screen": {
    importFrom: "@/components/blocks/chat-screen",
    exports: ["ChatScreen"],
    purpose:
      "The ONLY sanctioned layout for a bespoke chat surface: viewport-owning flex column (h-dvh) where the MESSAGE LIST is the one scroll container (flex-1 min-h-0 overflow-y-auto) and the composer is a pinned flex sibling below it — it can NEVER be displaced off-screen as the conversation grows. Auto-follows streaming output until the reader scrolls up. Composer band stays on the plain surface (no tint). `fill` mode for mounting inside a height-constrained pane (split view).",
    useWhen: [
      "A custom chat page the product surfaces don't cover (branded rail, split view) — prefer TimbalChatShell / AssistantPill first",
      "ANY hand-built chat layout — never place messages + input in normal page flow",
    ],
    composes: [],
  },
  "chat-shell": {
    importFrom: "@timbal-ai/timbal-react",
    exports: ["TimbalChatShell", "TimbalStudioShell"],
    purpose:
      "The full-page AI chat surface (see src/pages/Home.tsx for the wired example: welcome copy, attachments: true, artifact events, theme toggle). MOUNT CONVENTION: the chat shell owns the whole viewport — give it its own route and render it as the route's only child. NEVER nest it inside AppShell, a Card, a Sheet, or any padded/height-constrained wrapper; it manages its own layout, scrolling, and composer and will not scale inside another shell. For a chat page in an app's sidebar nav use blocks/embedded-chat (EmbeddedChat); for in-page AI on app screens use blocks/assistant (AssistantPill).",
    useWhen: [
      "A dedicated /chat (or /) conversation route — full-screen chat product",
      "NOT inside AppShell — a chat nav entry is EmbeddedChat; in-page AI is AssistantPill",
    ],
    composes: ["@timbal-ai/timbal-react TimbalChatShell"],
  },

  // ── BoardUI Pro cards (application/*) — purchased kit, project-owned ──
  // Native BoardUI screen-level cards. Self-contained (demo data inside the
  // file — fork and swap). Wired examples: pages/home-dashboard-page,
  // pages/medical-profile-page, pages/ai-profile-page, pages/calendar-page.
  "pro-dashboard-cards": {
    importFrom: "@/components/application/dashboard/…(one file per card)",
    exports: [
      "RecentHiresCard",
      "EarningsChartCard",
      "RevenueTrendCard",
      "ContributionsCard",
      "ContributionsGrid",
      "StatCards",
      "CustomersTable",
    ],
    purpose:
      "The BoardUI Pro dashboard card kit — THE canonical metric cards (the old house replicas MetricTrendCard/RosterCard/ContributionHeatmap were deleted in their favor): RecentHiresCard (2×2 people grid on the gray tile; props `title`/`count`/`people`/`action`, pages 4-up), EarningsChartCard (Recharts bars + count-up headline + period SegmentedControl + hover outline), RevenueTrendCard (gradient area/line + count-up + animated active dot; props `title`/`periods`/`formatValue` — key order becomes the tabs), ContributionsCard + ContributionsGrid (GitHub-style heat grid; grid accepts real `data` counts + `accent` family, tooltips per cell), StatCards (4-up KPI tiles with vivid delta Chips), CustomersTable (the native BoardUI data-table card: count header, facet Selects, search pill, selectable rows, numbered pagination). All props default to the Figma demo data — pass your own to wire real content (see insights-dashboard-page for a fully custom-data example).",
    useWhen: [
      "ANY trend/roster/heatmap/KPI band on a dashboard — these are the only implementations",
      "Fork pages/home-dashboard-page for the full BoardUI-native overview",
    ],
    composes: ["base/badges/chip", "base/segmented-control", "hooks/use-count-up", "recharts"],
  },
  "pro-medical-cards": {
    importFrom: "@/components/application/medical/…(one file per card)",
    exports: [
      "PatientInfoCard",
      "StepsCard",
      "SleepScoreCard",
      "MostActiveDaysCard",
      "ActivityRingsCard",
      "ImportantAlertsCard",
      "PatientsTable",
      "WeekRangePill",
    ],
    purpose:
      "The BoardUI Pro health/metrics card kit (330px cards) — THE canonical consumer-metrics visuals (the old house interactive-charts replicas were deleted in their favor): StepsCard (weekly bars + week switcher + count-up), SleepScoreCard (segmented score ring with hover-focused sub-scores + breakdown rows; props `title`/`headline`/`rangeLabel`/`metrics` make it a GENERIC score-ring card — see the engagement band on insights-dashboard-page), MostActiveDaysCard (continuous vertical month calendar with per-day mini rings — reports day clicks), ActivityRingsCard (Apple-Watch concentric rings + stat tiles — accepts the selected day), ImportantAlertsCard, PatientInfoCard, PatientsTable, WeekRangePill (the ‹ label › period pager). Shared demo dataset in medical/medical-data.ts. Wire MostActiveDaysCard.onSelectDay → ActivityRingsCard.selectedDay for the linked interaction.",
    useWhen: [
      "Health/wellbeing/habit verticals — fork pages/medical-profile-page first",
      "ANY score ring, activity rings, ring calendar, or tracked-bar card — these are the only implementations",
    ],
    composes: ["base/date-picker/shared", "application/medical/week-range-pill", "recharts"],
  },
  "pro-calendar": {
    importFrom: "@/components/application/calendar/…(one file per piece)",
    exports: [
      "CalendarHeader",
      "CalendarMonthGrid",
      "CalendarMonthSwitcher",
      "CalendarInboxMenu",
      "EventDetailsModal",
    ],
    purpose:
      "The BoardUI Pro month calendar: CalendarMonthGrid (event chips per day; chip click opens the anchored EventDetailsModal popover — Meet row, time range, participants, reminders), CalendarHeader (month title, notifications, CalendarInboxMenu feed, in-place CalendarMonthSwitcher, New event action). Event shapes + demo month in calendar/calendar-data.ts. Wired example: pages/calendar-page (fork it — it owns the month/highlight state).",
    useWhen: [
      "Scheduling, bookings, editorial/content calendars — fork pages/calendar-page",
      "NEVER hand-roll a month grid or event popover",
    ],
    composes: ["base/date-picker/shared MonthPanel", "@internationalized/date", "motion"],
  },
  "pro-ai-profile-cards": {
    importFrom: "@/components/application/ai-profile/…(one file per card)",
    exports: ["AiProfileCard", "AgentsChartCard", "TokensChartCard"],
    purpose:
      "The BoardUI Pro AI-profile kit: AiProfileCard (cover photo, avatar, follower stats, ContributionsGrid heat map), AgentsChartCard (30-day agents bar chart), TokensChartCard (tokens trend line). Demo data in ai-profile/ai-profile-data.ts; cover art at public/templates/ai-profile-cover.png. Wired example: pages/ai-profile-page (centered 680px column).",
    useWhen: [
      "Profile + activity-charts surfaces (member profile, agent detail, contributor page)",
    ],
    composes: ["application/dashboard/contributions-card", "hooks/use-count-up", "recharts"],
  },
  "pro-ai-chat-template": {
    importFrom: "@/components/application/ai-chat/ai-chat-shell",
    exports: ["AiChatShell"],
    purpose:
      "VISUAL REFERENCE ONLY — the BoardUI Pro AI chat template (sidebar, mock thread, composer with AddMenu/ModelMenu/effort slider, resizable prism-highlighted code panel). It owns the whole viewport (mounts at /gallery/templates/ai-chat, OUTSIDE the gallery shell). HARD RULE unchanged: real chat products stream through Timbal machinery (TimbalChatShell / EmbeddedChat / ChatScreen). Borrow CHROME from this template (composer controls, code panel, sidebar grammar) — never its mock message list.",
    useWhen: [
      "Borrowing composer/model-menu/code-panel chrome for a Timbal-powered chat surface",
      "NOT for building a chat product — that is TimbalChatShell / EmbeddedChat",
    ],
    composes: ["application/ai-chat/*", "prism-react-renderer", "motion", "base/kbd"],
  },
};

export { BLOCKS_CATALOG };
export type { BlockEntry };
