/**
 * PAGES_CATALOG — machine-readable index of full page templates.
 *
 * Agents: read `src/components/discovery.ts` FIRST, then this file. Fork the
 * closest template rather than composing from scratch.
 *
 * Dashboard grammar lives in `insights-dashboard-page` (NOT HR-specific —
 * demo data is HR-flavored; fork for sales, ops, finance, product, support…).
 *
 * Gallery routes (when VITE_GALLERY=true) are listed in
 * `src/pages/gallery/catalog.ts`.
 */

interface PageEntry {
  importFrom: string;
  exports: string[];
  /** What grammar this page demonstrates. */
  grammar:
    | "index"
    | "dashboard"
    | "detail"
    | "settings"
    | "chat"
    | "metrics"
    | "library"
    | "calendar"
    | "profile";
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
  "insights-dashboard-page": {
    importFrom: "@/components/pages/insights-dashboard-page",
    exports: [
      "InsightsDashboardPage",
      "MemberDetailSheet",
      "AddEmployeeSheet",
      "DEMO_EMPLOYEES",
      "DEMO_RECOMMENDATIONS",
    ],
    grammar: "dashboard",
    purpose:
      "THE reference dashboard template — domain-agnostic composition to fork for any analytics/overview/command-center screen (sales, ops, finance, product, support, inventory…). Demo copy uses HR sample data only to exercise people-centric blocks. Full rhythm: PageHeader with actions (Export + create FormSheet), StatOverview KPI band, RevenueTrendCard + RecentHiresCard band (the BoardUI Pro cards fed page data via props), RecommendationCard triage grid, composed + donut ChartCards, SleepScoreCard (as a generic score ring) + ContributionsGrid band, FilteredTable with row detail Sheet + BulkActionBar. Cut bands you don't need — never flatten into plain divs.",
    useWhen: [
      "ANY dashboard, overview, analytics, or command-center screen — start here, not from scratch",
      "You need stats → trend/roster → AI recommendations → charts → tracked table rhythm",
      "A wired example of the BoardUI Pro cards with CUSTOM data (trend periods, roster people, score metrics, heatmap counts)",
      "NOT only for HR — the filename used to say hr-dashboard; ignore the demo employee data",
    ],
    composes: [
      "blocks/page-header",
      "blocks/stat-overview",
      "application/dashboard revenue-trend-card + recent-hires-card + contributions-card",
      "application/medical sleep-score-card",
      "blocks/recommendation-card",
      "blocks/chart-demos",
      "blocks/entity-form",
      "blocks/filtered-table",
      "blocks/bulk-action-bar",
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
      "base/tabs",
      "base/table",
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
      "base/tabs",
      "base/table",
    ],
    galleryRoute: "/gallery/pages/workspace",
  },
  "invoice-review-page": {
    importFrom: "@/components/pages/invoice-review-page",
    exports: [
      "InvoiceReviewPage",
      "DEMO_REVIEW_INVOICES",
      "buildReviewRecords",
    ],
    grammar: "detail",
    purpose:
      "Document review split (Mercury grammar, divider-free): ReviewQueueHeader with progress + arrow-key nav, DocumentReviewLayout with PdfViewer left (50%), review card right — tabbed Fields / Line items / Activity, hover field rows with dot confidence chips, editable GL-coded line items, vendor match row, ReviewActionBar footer.",
    useWhen: [
      "Invoice/receipt/contract review where a human validates OCR against the source file",
      "Any 50/50 document + entries + actions screen — fork and swap the review body",
    ],
    composes: [
      "blocks/document-review-layout",
      "blocks/review-extraction",
      "blocks/pdf-viewer",
      "blocks/page-body",
      "base/segmented-control",
      "base/badges",
    ],
    galleryRoute: "/gallery/pages/invoice-review",
  },
  "home-dashboard-page": {
    importFrom: "@/components/pages/home-dashboard-page",
    exports: ["HomeDashboardPage"],
    grammar: "dashboard",
    purpose:
      "The BoardUI Pro 'Home Dashboard' template rehosted on the house shell grammar: PageHeader with Filters + primary action, RecentHiresCard + EarningsChartCard band, RevenueTrendCard + ContributionsCard band, StatCards KPI row, CustomersTable (native BoardUI data-table card). Count-up headlines and hover-outline charts throughout.",
    useWhen: [
      "A BoardUI-native overview screen (people + revenue + customers) — fork and swap card data",
      "You want the Pro chart cards (count-up, period switchers) over blocks/chart-demos",
      "For the richer block-kit dashboard (AI recommendations, FormSheet create) fork insights-dashboard-page instead",
    ],
    composes: [
      "application/dashboard/recent-hires-card",
      "application/dashboard/earnings-chart-card",
      "application/dashboard/revenue-trend-card",
      "application/dashboard/contributions-card",
      "application/dashboard/stat-cards",
      "application/dashboard/customers-table",
      "blocks/page-header",
      "blocks/page-body",
    ],
    galleryRoute: "/gallery/pages/home",
  },
  "medical-profile-page": {
    importFrom: "@/components/pages/medical-profile-page",
    exports: ["MedicalProfilePage"],
    grammar: "metrics",
    purpose:
      "The BoardUI Pro 'Medical Report' template rehosted on the house shell grammar: PageHeader with Filters + File a report, a 3-up grid of six 330px cards (patient info, weekly steps with week switcher, sleep-score segmented ring, most-active-days month calendar, activity rings, important alerts), then PatientsTable. Clicking a day in Most active days swaps the Activity rings card to that day.",
    useWhen: [
      "Patient/member/wellbeing/habit report screens — THE consumer-metrics grammar",
      "Any 6-card metrics grid + records table page",
    ],
    composes: [
      "application/medical/patient-info-card",
      "application/medical/steps-card",
      "application/medical/sleep-score-card",
      "application/medical/most-active-days-card",
      "application/medical/activity-rings-card",
      "application/medical/important-alerts-card",
      "application/medical/patients-table",
      "blocks/page-header",
      "blocks/page-body",
    ],
    galleryRoute: "/gallery/pages/medical",
  },
  "ai-profile-page": {
    importFrom: "@/components/pages/ai-profile-page",
    exports: ["AiProfilePage"],
    grammar: "profile",
    purpose:
      "The BoardUI Pro 'AI Profile' template rehosted on the house shell grammar: a centered 680px column — profile cover card (avatar, stats, contributions heat grid), 30-day agents bar chart, tokens trend chart. Intentionally NO PageHeader: the profile card IS the page header (social-profile pattern).",
    useWhen: [
      "Public-profile + activity-charts surfaces: member profile, agent detail, contributor page",
      "Any centered single-column record page led by a cover card",
    ],
    composes: [
      "application/ai-profile/ai-profile-card",
      "application/ai-profile/agents-chart-card",
      "application/ai-profile/tokens-chart-card",
      "blocks/page-body",
    ],
    galleryRoute: "/gallery/pages/ai-profile",
  },
  "calendar-page": {
    importFrom: "@/components/pages/calendar-page",
    exports: ["CalendarPage"],
    grammar: "calendar",
    purpose:
      "The BoardUI Pro 'Calendar' template rehosted on the house shell grammar: CalendarHeader (month title, notifications, inbox feed menu, in-place month switcher, New event action) over the month grid card — event chips open an anchored EventDetailsModal popover (Meet row, time range, participants, reminders); picking a date in the switcher pulses that day.",
    useWhen: [
      "Scheduling, bookings, or content-calendar screens — NEVER hand-roll a month grid",
      "Feed real events through application/calendar/calendar-data.ts shapes",
    ],
    composes: [
      "application/calendar/calendar-header",
      "application/calendar/calendar-month-grid",
      "application/calendar/calendar-month-switcher",
      "application/calendar/calendar-inbox-menu",
      "application/calendar/event-details-modal",
      "blocks/page-body",
    ],
    galleryRoute: "/gallery/pages/calendar",
  },
  "media-library-page": {
    importFrom: "@/components/pages/media-library-page",
    exports: ["MediaLibraryPage", "DEMO_ASSETS"],
    grammar: "library",
    purpose:
      "Asset library: search + type facet over an ImageCard MediaGrid (photos) and a document row list. Photo click → large preview Sheet with MetadataGrid; document click → wide right Drawer (size='xl') with the PdfViewer — the canonical click-to-preview file flow.",
    useWhen: [
      "Galleries, brand-asset, template-picker, or document screens",
      "Anywhere PdfViewer / ImageCard / big drawers need a wired example",
    ],
    composes: [
      "blocks/page-header",
      "blocks/media-card",
      "blocks/pdf-viewer",
      "blocks/detail-panel",
      "ui/drawer",
      "ui/sheet",
      "base/select",
    ],
    galleryRoute: "/gallery/pages/media",
  },
};

export { PAGES_CATALOG };
export type { PageEntry };
