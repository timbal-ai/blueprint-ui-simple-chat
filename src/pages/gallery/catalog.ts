/**
 * GALLERY_CATALOG — machine-readable index of the /gallery showcase routes.
 *
 * Agents: when VITE_GALLERY=true, every entry here is a live, forkable
 * reference mounted inside RoutedAppShell. Nav ids in shell.tsx MUST match
 * these paths.
 */

interface GalleryEntry {
  path: string;
  label: string;
  /** Page template or showcase type. */
  kind: "page" | "blocks" | "primitives" | "charts" | "chat";
  purpose: string;
  /** Source module agents should fork. */
  importFrom?: string;
}

const GALLERY_CATALOG: GalleryEntry[] = [
  {
    path: "/gallery",
    label: "Invoices",
    kind: "page",
    purpose: "Reference entity index (InvoicesPage).",
    importFrom: "@/components/pages/invoices-page",
  },
  {
    path: "/gallery/blocks",
    label: "Dashboard",
    kind: "page",
    purpose:
      "Reference insights dashboard (InsightsDashboardPage) — the domain-agnostic dashboard grammar with KPIs, AI recommendation cards, charts, and table. Demo data is HR-flavored; fork for any vertical.",
    importFrom: "@/components/pages/insights-dashboard-page",
  },
  {
    path: "/gallery/pages/customer",
    label: "Customer detail",
    kind: "page",
    purpose: "Condensed Stripe-style customer record (CustomerDetailPage).",
    importFrom: "@/components/pages/customer-detail-page",
  },
  {
    path: "/gallery/pages/workspace",
    label: "Workspace detail",
    kind: "page",
    purpose: "Condensed Cloudflare-style zone record (WorkspaceDetailPage).",
    importFrom: "@/components/pages/workspace-detail-page",
  },
  {
    path: "/gallery/pages/media",
    label: "Media",
    kind: "page",
    purpose:
      "Asset library (MediaLibraryPage) — ImageCard grid, document list, photo Sheet preview, PdfViewer in a wide right Drawer.",
    importFrom: "@/components/pages/media-library-page",
  },
  {
    path: "/gallery/pages/invoice-review",
    label: "Invoice review",
    kind: "page",
    purpose:
      "Document review split (InvoiceReviewPage) — 50/50 PdfViewer + extracted entries, confidence badges, approve/reject actions.",
    importFrom: "@/components/pages/invoice-review-page",
  },
  {
    path: "/gallery/pages/home",
    label: "Home",
    kind: "page",
    purpose:
      "BoardUI Pro home dashboard (HomeDashboardPage) — recent hires, earnings bars, revenue trend, contributions heatmap, KPI stats, customers table.",
    importFrom: "@/components/pages/home-dashboard-page",
  },
  {
    path: "/gallery/pages/medical",
    label: "Medical",
    kind: "page",
    purpose:
      "BoardUI Pro medical report (MedicalProfilePage) — six-card health grid (steps, sleep ring, most-active-days calendar, activity rings, alerts) + patients table.",
    importFrom: "@/components/pages/medical-profile-page",
  },
  {
    path: "/gallery/pages/ai-profile",
    label: "AI profile",
    kind: "page",
    purpose:
      "BoardUI Pro AI profile (AiProfilePage) — centered cover card with contributions heat grid, agents bar chart, tokens trend.",
    importFrom: "@/components/pages/ai-profile-page",
  },
  {
    path: "/gallery/pages/calendar",
    label: "Calendar",
    kind: "page",
    purpose:
      "BoardUI Pro month calendar (CalendarPage) — event chips, anchored event-details popover, in-place month switcher, inbox feed.",
    importFrom: "@/components/pages/calendar-page",
  },
  {
    path: "/gallery/templates/ai-chat",
    label: "AI chat (mock)",
    kind: "chat",
    purpose:
      "BoardUI Pro AI chat template (AiChatShell) — full-viewport VISUAL REFERENCE (mounts outside the gallery shell). Borrow chrome only; real chat = TimbalChatShell / EmbeddedChat.",
    importFrom: "@/components/application/ai-chat/ai-chat-shell",
  },
  {
    path: "/gallery/chat",
    label: "Assistant",
    kind: "chat",
    purpose:
      "EmbeddedChat inside RoutedAppShell — full-bleed on the content card, no title, --thread-canvas fix. NOT TimbalChatShell.",
    importFrom: "@/components/blocks/embedded-chat",
  },
  {
    path: "/gallery/primitives/forms",
    label: "Forms & inputs",
    kind: "primitives",
    purpose: "Primitive family showcase.",
  },
  {
    path: "/gallery/primitives/overlays",
    label: "Overlays",
    kind: "primitives",
    purpose: "Primitive family showcase.",
  },
  {
    path: "/gallery/primitives/data",
    label: "Data display",
    kind: "primitives",
    purpose: "Primitive family showcase.",
  },
  {
    path: "/gallery/primitives/feedback",
    label: "Feedback",
    kind: "primitives",
    purpose: "Primitive family showcase.",
  },
  {
    path: "/gallery/primitives/navigation",
    label: "Navigation",
    kind: "primitives",
    purpose: "Primitive family showcase.",
  },
  {
    path: "/gallery/primitives/pickers",
    label: "Date & time",
    kind: "primitives",
    purpose: "Primitive family showcase.",
  },
  {
    path: "/gallery/charts",
    label: "Charts",
    kind: "charts",
    purpose:
      "Recharts recipes (blocks/chart-demos), ScoreGauge, HeroMetricCard, MetricLegendList. Interactive metric CARDS (bars, rings, heatmap, trend) are the BoardUI Pro components — see the Home / Medical / AI profile template pages.",
    importFrom: "@/components/blocks/chart-demos",
  },
];

export { GALLERY_CATALOG };
export type { GalleryEntry };
