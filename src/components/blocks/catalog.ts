/**
 * BLOCKS_CATALOG — machine-readable index of the block kit.
 *
 * Agents: read this file FIRST when building a screen. Every entry is
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
      "Canonical application frame: sidebar nav (groups, icons, badges, nested sub-items, footer) + content. Default variant='inset' is the signature look — gray canvas, content as a flat white bordered card. Applies PAGE_INSET (px-4 sm:px-6 lg:px-8 + top/bottom breathing room) on the content region by default — pages inside must NOT duplicate px-/py- on their root (use PageBody for gap only). Also has an optional sticky topbar and a dock slot for floating chrome. For multi-page apps prefer RoutedAppShell (blocks/routed-app-shell), which wires this to the router.",
    useWhen: [
      "A single-screen embed or a shell you wire to navigation yourself — multi-page apps use RoutedAppShell",
      "You need a sidebar, nested nav tree, topbar, or a docked AI pill",
    ],
    composes: ["ui/sidebar", "ui/separator", "ui/badge"],
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
  "filtered-table": {
    importFrom: "@/components/blocks/filtered-table",
    exports: ["FilteredTable", "IconCell", "AvatarChipCell", "AvatarChip"],
    purpose:
      "Search + faceted Select filters + DataTable wired together, with a wrapping toolbar, clear-filters affordance, and a toolbarEnd slot for the primary action. Columns are drag-to-reorder and edge-resizable by default (built into DataTable — never rebuild). Supports row selection (pair with selectionColumn from ui/data-table), numbered pagination with a 'Showing X to Y of Z' summary, and cell helpers: IconCell (muted icon + value), AvatarChipCell (colored initial tile + name), and AvatarChip (standalone identity tile, sm/lg).",
    useWhen: [
      "Any table that needs search or filters — do not hand-roll a toolbar",
      "Entity index pages (invoices, users, orders)",
    ],
    composes: ["ui/data-table", "ui/input", "ui/select", "ui/button", "ui/checkbox"],
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
  "settings-page": {
    importFrom: "@/components/blocks/settings-page",
    exports: ["SettingsStack", "SettingsSection", "SettingsRow", "DangerZone"],
    purpose:
      "Settings scaffolding: one card per topic, label-left/control-right rows that stack on mobile, and a quarantined danger zone.",
    useWhen: [
      "Preferences, account, workspace, or notification settings screens",
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
  "sidebar-user": {
    importFrom: "@/components/blocks/sidebar-user",
    exports: ["SidebarUser"],
    purpose:
      "The account row for AppShell's footer slot: real avatar (with initials fallback) + name/email. The dropdown opens with the identity card as a button (fires onSelect('account')); `menu` is EMPTY by default — account actions are app-specific, define them per app when building. Adapts to the collapsed icon rail and to mobile (menu opens upward).",
    useWhen: [
      "Every AppShell should end with this in `footer` — never hand-roll the user row",
      "You need account actions reachable from the sidebar in any state",
    ],
    composes: ["ui/avatar", "ui/dropdown-menu", "ui/sidebar"],
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
    composes: ["ui/badge", "ui/switch"],
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
      "ui/data-table",
      "ui/sheet",
      "ui/badge",
      "ui/dropdown-menu",
    ],
  },
  "hr-dashboard-page": {
    importFrom: "@/components/pages/hr-dashboard-page",
    exports: ["HrDashboardPage", "MemberDetailSheet", "DEMO_EMPLOYEES", "DEMO_RECOMMENDATIONS"],
    purpose:
      "The reference DASHBOARD template: PageHeader, a 3-up KPI band (vibrant delta badges, captions, header actions), an approve/dismiss recommendations band (RecommendationCard grid), a composed line+bar ChartCard with a range select, and a sortable/filterable team table with row actions. Row click opens MemberDetailSheet (xl sheet: identity header, completion progress, profile fields, activity) and selection surfaces a BulkActionBar. Fork for any analytics or overview screen.",
    useWhen: [
      "Building a dashboard/overview/analytics screen — start from this file",
      "You need the canonical stats → chart → table page rhythm",
    ],
    composes: [
      "blocks/page-header",
      "blocks/stat-overview",
      "blocks/chart-demos",
      "blocks/filtered-table",
      "blocks/bulk-action-bar",
      "blocks/detail-panel",
      "ui/sheet",
      "ui/progress",
      "ui/dropdown-menu",
      "ui/select",
    ],
  },
  "recommendation-card": {
    importFrom: "@/components/blocks/recommendation-card",
    exports: ["RecommendationCard"],
    purpose:
      "One approve/dismiss AI-suggestion card (the Command Center reference grammar): 17px medium title + rounded priority chip, muted summary, hairline-separated label/value detail rows (Projected impact, Related), and a pinned action row (outline edit icon, outline Dismiss, dark Approve). Lay several out in a `grid gap-4 md:grid-cols-2 2xl:grid-cols-3 items-stretch`; see the recommendations band in pages/hr-dashboard-page for the wired example.",
    useWhen: [
      "A triage feed of AI suggestions/alerts the user approves or dismisses",
      "Any card needing the title/summary/details/actions grammar",
    ],
    composes: ["ui/card", "ui/badge", "ui/button"],
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
};

export { BLOCKS_CATALOG };
export type { BlockEntry };
