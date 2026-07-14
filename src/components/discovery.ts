/**
 * KIT_DISCOVERY — mandatory FIRST read before writing any UI code.
 *
 * Agents skip this and rebuild shells, tables, and forms from primitives
 * every session. Don't. Match the user's intent → fork a page template OR
 * import a block → primitives only for gaps.
 *
 * Discovery order (hard):
 *   1. This file — match INTENT_INDEX / DO_NOT_BUILD
 *   2. PAGES_CATALOG — fork the closest full-page template
 *   3. BLOCKS_CATALOG — import blocks for anything the page doesn't cover
 *   4. src/components/ui/* — primitives for gaps only
 *   5. Raw HTML — last resort
 *
 * Live gallery (VITE_GALLERY): GALLERY_CATALOG in src/pages/gallery/catalog.ts
 */

import { BLOCKS_CATALOG } from "@/components/blocks/catalog";
import { PAGES_CATALOG } from "@/components/pages/catalog";

type KitKind = "page" | "block";

interface IntentMatch {
  /** Grep these when the user describes a screen or feature */
  triggers: string[];
  kind: KitKind;
  /** Key in PAGES_CATALOG or BLOCKS_CATALOG */
  target: string;
  importFrom: string;
  exports: string[];
  /** What agents wrongly build from scratch instead */
  insteadOf: string;
}

/** Ordered workflow — paste into agent prompts. */
const DISCOVERY_ORDER = [
  "Read src/components/discovery.ts and match INTENT_INDEX to the user request",
  "Fork the closest PAGES_CATALOG template (never compose a full screen from primitives)",
  "Import missing pieces from BLOCKS_CATALOG / @/components/blocks",
  "Drop to ui/* primitives only for gaps between blocks",
  "Fork a block file when it is ~80% right — never rebuild the pattern",
] as const;

/**
 * Intent → kit mapping. Sorted roughly page-first (fork templates beat
 * assembling blocks). Add triggers liberally — agents grep, not semantic-search.
 */
const INTENT_INDEX: IntentMatch[] = [
  // ── Full pages (fork first) ──────────────────────────────────────────
  {
    triggers: [
      "invoice list",
      "invoices table",
      "billing index",
      "orders list",
      "users table",
      "entity index",
      "CRUD list",
      "search and filter table",
      "selectable rows",
      "export CSV",
    ],
    kind: "page",
    target: "invoices-page",
    importFrom: "@/components/pages/invoices-page",
    exports: ["InvoicesPage", "InvoiceDetailSheet", "StatusBadge"],
    insteadOf: "PageHeader + hand-rolled search Input + Select filters + DataTable + Sheet",
  },
  {
    triggers: [
      "dashboard",
      "overview",
      "analytics",
      "command center",
      "KPIs",
      "stats and charts",
      "AI recommendations",
      "approve dismiss cards",
      "operations dashboard",
      "sales dashboard",
      "not HR only",
    ],
    kind: "page",
    target: "insights-dashboard-page",
    importFrom: "@/components/pages/insights-dashboard-page",
    exports: ["InsightsDashboardPage"],
    insteadOf: "StatGrid divs + bare Recharts + recommendation divs + FilteredTable wired by hand",
  },
  {
    triggers: [
      "invoice review",
      "document review",
      "OCR validation",
      "PDF review",
      "50/50 split",
      "extracted fields",
      "approve reject document",
      "receipt review",
    ],
    kind: "page",
    target: "invoice-review-page",
    importFrom: "@/components/pages/invoice-review-page",
    exports: ["InvoiceReviewPage", "DocumentReviewLayout", "ReviewActionBar"],
    insteadOf: "Two-column grid + iframe + hand-rolled field rows + pinned footer",
  },
  {
    triggers: [
      "customer detail",
      "billing record",
      "Stripe detail",
      "metadata grid",
      "tabbed payments",
      "subscription detail",
    ],
    kind: "page",
    target: "customer-detail-page",
    importFrom: "@/components/pages/customer-detail-page",
    exports: ["CustomerDetailPage"],
    insteadOf: "PageHeader + custom metadata dl + Tabs + bare Table",
  },
  {
    triggers: [
      "workspace detail",
      "zone detail",
      "DNS records",
      "infra record",
      "Cloudflare detail",
    ],
    kind: "page",
    target: "workspace-detail-page",
    importFrom: "@/components/pages/workspace-detail-page",
    exports: ["WorkspaceDetailPage"],
    insteadOf: "Custom record header + metadata rows + tabbed tables",
  },
  {
    triggers: [
      "health dashboard",
      "fitness",
      "activity rings",
      "steps chart",
      "wellness metrics",
      "consumer metrics",
    ],
    kind: "page",
    target: "health-dashboard-page",
    importFrom: "@/components/pages/health-dashboard-page",
    exports: ["HealthDashboardPage"],
    insteadOf: "Hand-rolled SVG rings + bar chart + calendar grid",
  },
  {
    triggers: [
      "earnings",
      "revenue analytics",
      "payouts",
      "creator dashboard",
      "usage over time",
      "contribution heatmap",
    ],
    kind: "page",
    target: "earnings-page",
    importFrom: "@/components/pages/earnings-page",
    exports: ["EarningsPage"],
    insteadOf: "Trend div + heatmap div + range tabs wired manually",
  },
  {
    triggers: [
      "media library",
      "asset gallery",
      "image grid",
      "document library",
      "file preview",
      "photo gallery",
    ],
    kind: "page",
    target: "media-library-page",
    importFrom: "@/components/pages/media-library-page",
    exports: ["MediaLibraryPage"],
    insteadOf: "Image grid + document list + preview modal built from Card + img",
  },
  {
    triggers: [
      "settings",
      "preferences",
      "toggle list",
      "danger zone",
      "account settings",
    ],
    kind: "page",
    target: "settings-page",
    importFrom: "@/components/blocks/settings-page",
    exports: ["SettingsStack", "SettingsSection", "SettingsRow", "DangerZone"],
    insteadOf: "Stack of Card + flex rows + Switch for every settings screen",
  },

  // ── Blocks (when no page fits, or inside a forked page) ──────────────
  {
    triggers: [
      "multi-page app",
      "sidebar nav",
      "app shell",
      "layout route",
      "outlet",
      "react-router shell",
    ],
    kind: "block",
    target: "routed-app-shell",
    importFrom: "@/components/blocks/routed-app-shell",
    exports: ["RoutedAppShell"],
    insteadOf: "AppShell + useState page switcher OR hand-rolled sidebar layout",
  },
  {
    triggers: [
      "table with filters",
      "search bar table",
      "faceted filters",
      "sortable table",
      "row selection",
      "pagination table",
      "data grid toolbar",
    ],
    kind: "block",
    target: "filtered-table",
    importFrom: "@/components/blocks/filtered-table",
    exports: ["FilteredTable", "AvatarChip", "IconCell"],
    insteadOf: "Toolbar div + Input + Select + DataTable composed manually",
  },
  {
    triggers: [
      "bulk actions",
      "selected rows",
      "floating action bar",
      "delete selected",
      "export selected",
    ],
    kind: "block",
    target: "bulk-action-bar",
    importFrom: "@/components/blocks/bulk-action-bar",
    exports: ["BulkActionBar"],
    insteadOf: "Disabled toolbar buttons or a fixed bottom bar in the page",
  },
  {
    triggers: [
      "detail sheet",
      "row click detail",
      "record preview",
      "slide over panel",
      "master detail",
      "inbox split",
    ],
    kind: "block",
    target: "list-detail",
    importFrom: "@/components/blocks/list-detail",
    exports: ["ListDetailLayout"],
    insteadOf: "useState + Sheet + custom split pane",
  },
  {
    triggers: [
      "create form sheet",
      "edit form drawer",
      "side form",
      "add record form",
      "form in sheet",
    ],
    kind: "block",
    target: "entity-form",
    importFrom: "@/components/blocks/entity-form",
    exports: ["FormSheet", "FormField", "FormGrid"],
    insteadOf: "Sheet + raw form + Label + Input grid",
  },
  {
    triggers: [
      "page title",
      "page header",
      "breadcrumb",
      "header actions",
      "export button header",
    ],
    kind: "block",
    target: "page-header",
    importFrom: "@/components/blocks/page-header",
    exports: ["PageHeader"],
    insteadOf: "h1 + p + div flex for actions",
  },
  {
    triggers: [
      "KPI cards",
      "stat tiles",
      "metric overview",
      "dashboard stats",
      "three up stats",
    ],
    kind: "block",
    target: "stat-overview",
    importFrom: "@/components/blocks/stat-overview",
    exports: ["StatOverview", "ChartCard"],
    insteadOf: "Grid of Card + big number divs",
  },
  {
    triggers: [
      "trend chart card",
      "revenue card",
      "metric with sparkline",
      "area chart KPI",
    ],
    kind: "block",
    target: "metric-trend-card",
    importFrom: "@/components/blocks/metric-trend-card",
    exports: ["MetricTrendCard"],
    insteadOf: "Card + Recharts AreaChart wired by hand",
  },
  {
    triggers: [
      "people grid",
      "team roster",
      "recent hires",
      "avatar grid",
      "assignee list",
    ],
    kind: "block",
    target: "roster-card",
    importFrom: "@/components/blocks/roster-card",
    exports: ["RosterCard"],
    insteadOf: "Grid of avatar + name divs",
  },
  {
    triggers: [
      "AI suggestion card",
      "approve dismiss",
      "recommendation triage",
      "alert card actions",
    ],
    kind: "block",
    target: "recommendation-card",
    importFrom: "@/components/blocks/recommendation-card",
    exports: ["RecommendationCard"],
    insteadOf: "Custom Card with three buttons",
  },
  {
    triggers: [
      "bar chart",
      "area chart",
      "donut chart",
      "line chart dashboard",
      "recharts",
    ],
    kind: "block",
    target: "chart-demos",
    importFrom: "@/components/blocks/chart-demos",
    exports: ["DemoAreaChart", "DemoBarChart", "DemoComposedChart", "DemoDonutChart"],
    insteadOf: "Raw Recharts without ChartContainer / house tooltip grammar",
  },
  {
    triggers: [
      "activity rings",
      "score ring",
      "heatmap calendar",
      "tracked bar chart",
      "interactive metrics",
      "ring calendar",
    ],
    kind: "block",
    target: "interactive-charts",
    importFrom: "@/components/blocks/interactive-charts",
    exports: ["TrackedBarChart", "ActivityRings", "SegmentedScoreRing", "ContributionHeatmap"],
    insteadOf: "Hand-rolled SVG arcs or custom heatmap divs",
  },
  {
    triggers: ["PDF viewer", "embed PDF", "document viewer", "invoice PDF"],
    kind: "block",
    target: "pdf-viewer",
    importFrom: "@/components/blocks/pdf-viewer",
    exports: ["PdfViewer"],
    insteadOf: "iframe + custom toolbar",
  },
  {
    triggers: [
      "document split",
      "review pane",
      "source document left",
      "extraction panel",
    ],
    kind: "block",
    target: "document-review-layout",
    importFrom: "@/components/blocks/document-review-layout",
    exports: ["DocumentReviewLayout", "ReviewActionBar"],
    insteadOf: "ResizablePanelGroup + two Cards wired manually",
  },
  {
    triggers: [
      "extracted fields",
      "OCR fields",
      "confidence chip",
      "line item editor review",
    ],
    kind: "block",
    target: "review-extraction",
    importFrom: "@/components/blocks/review-extraction",
    exports: ["ExtractedFieldRow", "ReviewLineItemEditor", "ReviewQueueHeader"],
    insteadOf: "Label/value rows + custom confidence badges",
  },
  {
    triggers: [
      "chat page in app",
      "copilot page",
      "assistant route",
      "embedded chat",
      "sidebar chat entry",
    ],
    kind: "block",
    target: "embedded-chat",
    importFrom: "@/components/blocks/embedded-chat",
    exports: ["EmbeddedChat"],
    insteadOf: "TimbalChatShell inside AppShell or chat in a Card with PageHeader",
  },
  {
    triggers: [
      "floating AI",
      "assistant pill",
      "copilot button",
      "in-page AI",
    ],
    kind: "block",
    target: "assistant",
    importFrom: "@/components/blocks/assistant",
    exports: ["AssistantPill"],
    insteadOf: "Custom fixed button + modal chat",
  },
  {
    triggers: ["full screen chat", "chat product", "conversation app"],
    kind: "block",
    target: "chat-shell",
    importFrom: "@timbal-ai/timbal-react",
    exports: ["TimbalChatShell", "TimbalStudioShell"],
    insteadOf: "ChatScreen + manual message list for a full chat product",
  },
  {
    triggers: ["metadata fields", "detail section", "activity feed", "field list"],
    kind: "block",
    target: "detail-panel",
    importFrom: "@/components/blocks/detail-panel",
    exports: ["MetadataGrid", "ActivityFeed", "DetailSection", "FieldList"],
    insteadOf: "dl/dt/dd or labeled div stacks",
  },
  {
    triggers: ["integration cards", "enable toggle grid", "resource catalog"],
    kind: "block",
    target: "resource-grid",
    importFrom: "@/components/blocks/resource-grid",
    exports: ["ResourceGrid"],
    insteadOf: "Grid of Card + Switch",
  },
  {
    triggers: ["image card", "media grid", "thumbnail gallery"],
    kind: "block",
    target: "media-card",
    importFrom: "@/components/blocks/media-card",
    exports: ["ImageCard", "MediaGrid"],
    insteadOf: "img in rounded border divs",
  },
  {
    triggers: ["semicircle gauge", "score gauge", "health score arc"],
    kind: "block",
    target: "score-gauge",
    importFrom: "@/components/app/score-gauge",
    exports: ["ScoreGauge"],
    insteadOf: "Hand-rolled SVG arc",
  },
  {
    triggers: ["sidebar user", "account menu", "sign out footer"],
    kind: "block",
    target: "sidebar-user",
    importFrom: "@/components/blocks/sidebar-user",
    exports: ["SidebarUser"],
    insteadOf: "Avatar + DropdownMenu in sidebar footer",
  },
];

/** Hard bans — if you catch yourself doing the left column, use the right. */
const DO_NOT_BUILD: { wrong: string; use: string; importFrom: string }[] = [
  {
    wrong: "useState-switched pages in one component",
    use: "RoutedAppShell + one Route per page",
    importFrom: "@/components/blocks/routed-app-shell",
  },
  {
    wrong: "Hand-rolled app layout (sidebar div + main div)",
    use: "RoutedAppShell or AppShell",
    importFrom: "@/components/blocks/routed-app-shell",
  },
  {
    wrong: "Search + filter toolbar + table",
    use: "FilteredTable",
    importFrom: "@/components/blocks/filtered-table",
  },
  {
    wrong: "Selection actions in the table toolbar",
    use: "BulkActionBar (floating)",
    importFrom: "@/components/blocks/bulk-action-bar",
  },
  {
    wrong: "Full dashboard from Stat + Chart primitives",
    use: "Fork insights-dashboard-page",
    importFrom: "@/components/pages/insights-dashboard-page",
  },
  {
    wrong: "Chat thread inside a Card with a page title",
    use: "EmbeddedChat route (full-bleed) or TimbalChatShell",
    importFrom: "@/components/blocks/embedded-chat",
  },
  {
    wrong: "Custom Recharts tooltip div",
    use: "ChartTooltipContent via chart-demos recipes",
    importFrom: "@/components/blocks/chart-demos",
  },
  {
    wrong: "Hand-rolled SVG gauge / ring score",
    use: "ScoreGauge or SegmentedScoreRing",
    importFrom: "@/components/app/score-gauge",
  },
];

/** Match user text against INTENT_INDEX triggers (case-insensitive). */
function matchIntents(query: string): IntentMatch[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const qTokens = q.split(/\s+/).filter(Boolean);

  return INTENT_INDEX.filter((entry) =>
    entry.triggers.some((trigger) => {
      const t = trigger.toLowerCase();
      if (q.includes(t) || t.includes(q)) return true;
      // Token overlap — "invoice table" matches "invoices table"
      return qTokens.every(
        (qt) =>
          t.includes(qt) ||
          t.split(/\s+/).some((tt) => tt.includes(qt) || qt.includes(tt)),
      );
    }),
  );
}

export {
  BLOCKS_CATALOG,
  DISCOVERY_ORDER,
  DO_NOT_BUILD,
  INTENT_INDEX,
  matchIntents,
  PAGES_CATALOG,
};
export type { IntentMatch, KitKind };
