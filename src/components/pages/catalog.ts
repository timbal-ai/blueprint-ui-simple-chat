/**
 * PAGES_CATALOG — machine-readable index of full page templates.
 *
 * Agents: read this AFTER blocks/catalog.ts when building a screen.
 * Every entry is project-owned source under `src/components/pages/` —
 * fork the closest template rather than composing from scratch.
 *
 * Gallery routes (when VITE_GALLERY=true) are listed in
 * `src/pages/gallery/catalog.ts`.
 */

interface PageEntry {
  importFrom: string;
  exports: string[];
  /** What grammar this page demonstrates. */
  grammar: "index" | "dashboard" | "detail" | "settings" | "chat";
  purpose: string;
  useWhen: string[];
  /** Primary blocks this template composes. */
  composes: string[];
  /** Gallery route path when showcased (omit if not in gallery). */
  galleryRoute?: string;
}

const PAGES_CATALOG: Record<string, PageEntry> = {
  "invoices-page": {
    importFrom: "@/components/pages/invoices-page",
    exports: ["InvoicesPage", "InvoiceDetailSheet", "StatusBadge", "DEMO_INVOICES"],
    grammar: "index",
    purpose:
      "Entity index: title, FilteredTable with search/facets, dark primary export action, selectable rows, row click → InvoiceDetailSheet, selection → BulkActionBar.",
    useWhen: [
      "Any billing/orders/users index — fork and swap columns + demo data",
      "You need the canonical toolbar + table + sheet record flow",
    ],
    composes: [
      "blocks/filtered-table",
      "blocks/bulk-action-bar",
      "blocks/detail-panel",
      "ui/sheet",
    ],
    galleryRoute: "/gallery",
  },
  "hr-dashboard-page": {
    importFrom: "@/components/pages/hr-dashboard-page",
    exports: ["HrDashboardPage", "MemberDetailSheet", "DEMO_EMPLOYEES", "DEMO_RECOMMENDATIONS"],
    grammar: "dashboard",
    purpose:
      "Dashboard: PageHeader, StatOverview KPI band, RecommendationCard grid, ChartCard, FilteredTable with row click → MemberDetailSheet.",
    useWhen: [
      "Analytics/overview screens — stats → cards/chart → table rhythm",
      "AI recommendation triage band above charts",
    ],
    composes: [
      "blocks/page-header",
      "blocks/stat-overview",
      "blocks/recommendation-card",
      "blocks/chart-demos",
      "blocks/filtered-table",
    ],
    galleryRoute: "/gallery/blocks",
  },
  "customer-detail-page": {
    importFrom: "@/components/pages/customer-detail-page",
    exports: ["CustomerDetailPage", "DEMO_CUSTOMER", "DEMO_PAYMENTS"],
    grammar: "detail",
    purpose:
      "Condensed full-page record detail (Stripe grammar): breadcrumb eyebrow (parent / record — never app name), RecordDetailHeader, MetadataGrid, tabbed Payments/Subscriptions/Events sections with compact tables.",
    useWhen: [
      "Billing/customer/tenant record routes — /customers/:id",
      "Finance SaaS detail pages with metadata + tabbed related data",
    ],
    composes: [
      "blocks/page-header",
      "blocks/detail-panel",
      "blocks/page-body",
      "ui/tabs",
      "ui/table",
    ],
    galleryRoute: "/gallery/pages/customer",
  },
  "workspace-detail-page": {
    importFrom: "@/components/pages/workspace-detail-page",
    exports: ["WorkspaceDetailPage", "DEMO_WORKSPACE", "DEMO_DNS"],
    grammar: "detail",
    purpose:
      "Condensed infra record detail (Cloudflare grammar): breadcrumb eyebrow, globe-tile RecordDetailHeader, MetadataGrid, tabbed DNS / SSL / Security / Analytics with compact tables and status rows.",
    useWhen: [
      "Domain/zone/workspace/project record routes — /zones/:id",
      "Infrastructure or developer-console detail pages",
    ],
    composes: [
      "blocks/page-header",
      "blocks/detail-panel",
      "blocks/page-body",
      "ui/tabs",
      "ui/table",
    ],
    galleryRoute: "/gallery/pages/workspace",
  },
};

export { PAGES_CATALOG };
export type { PageEntry };
