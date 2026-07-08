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
  "app-shell": {
    importFrom: "@/components/blocks/app-shell",
    exports: ["AppShell"],
    purpose:
      "Canonical application frame: sidebar nav (groups, icons, badges, nested sub-items, footer) + content. Default variant='inset' is the signature look — gray canvas, content as a flat white bordered card. Also has an optional sticky topbar and a dock slot for floating chrome.",
    useWhen: [
      "Any multi-page app screen — this is the outermost layout",
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
      "Search + faceted Select filters + DataTable wired together, with a wrapping toolbar, clear-filters affordance, and a toolbarEnd slot for the primary action. Supports row selection (pair with selectionColumn from ui/data-table), numbered pagination with a 'Showing X to Y of Z' summary, and cell helpers: IconCell (muted icon + value), AvatarChipCell (colored initial tile + name), and AvatarChip (standalone identity tile, sm/lg).",
    useWhen: [
      "Any table that needs search or filters — do not hand-roll a toolbar",
      "Entity index pages (invoices, users, orders)",
    ],
    composes: ["ui/data-table", "ui/input", "ui/select", "ui/button", "ui/checkbox"],
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
    exports: ["DetailSection", "FieldList", "Field", "ActivityFeed", "DetailDivider"],
    purpose:
      "Structured record-detail content: aligned label/value description lists, sectioned headings with inline actions, and a compact activity timeline.",
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
      "DemoStackedBarChart",
    ],
    purpose:
      "The canonical Recharts recipes wired to ChartContainer and DNA chart tokens: area, bar, line, pie, composed line+bar (the dashboard reference), stacked bar, donut-with-center-total, radar, and comparison (solid vs dotted white lines, for HeroMetricCard) — fork one and swap data/config rather than writing Recharts from scratch. House chart grammar: NO legends (tooltips only), NO Y-axis numbers (they collide with edge-less plots — magnitudes live in the tooltip), zero side margins (edge-less inside ChartCard), gradient fills via <defs> linearGradient.",
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
      "The account row for AppShell's footer slot: real avatar (with initials fallback) + name/email and a proper options dropdown (profile, settings, help, sign out — or custom items). Adapts to the collapsed icon rail (avatar only, menu opens to the side) and to mobile (menu opens upward).",
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
    exports: ["HrDashboardPage", "MemberDetailSheet", "DEMO_EMPLOYEES"],
    purpose:
      "The reference DASHBOARD template: breadcrumb eyebrow + PageHeader, a 3-up KPI band (vibrant delta badges, captions, header actions), a composed line+bar ChartCard with a range select, and a sortable/filterable team table with row actions. Row click opens MemberDetailSheet (xl sheet: identity header, completion progress, profile fields, activity) and selection surfaces a BulkActionBar. Fork for any analytics or overview screen.",
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
  "chat-shell": {
    importFrom: "@timbal-ai/timbal-react",
    exports: ["TimbalChatShell", "TimbalStudioShell"],
    purpose:
      "The full-page AI chat surface (see src/pages/Home.tsx for the wired example: welcome copy, attachments: true, artifact events, theme toggle). MOUNT CONVENTION: the chat shell owns the whole viewport — give it its own route and render it as the route's only child. NEVER nest it inside AppShell, a Card, a Sheet, or any padded/height-constrained wrapper; it manages its own layout, scrolling, and composer and will not scale inside another shell. For in-page AI on app screens use blocks/assistant (AssistantPill) instead.",
    useWhen: [
      "A dedicated /chat (or /) conversation route — full-screen chat product",
      "NOT for embedding chat into a dashboard — use AssistantPill for that",
    ],
    composes: ["@timbal-ai/timbal-react TimbalChatShell"],
  },
};

export { BLOCKS_CATALOG };
export type { BlockEntry };
