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
    purpose: "Reference dashboard (HrDashboardPage) with KPIs, recommendation cards, chart, table.",
    importFrom: "@/components/pages/hr-dashboard-page",
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
    path: "/gallery/pages/health",
    label: "Health",
    kind: "page",
    purpose:
      "Consumer-metrics dashboard (HealthDashboardPage) — interactive tracked bars, score ring, activity rings, ring calendar, alerts feed.",
    importFrom: "@/components/pages/health-dashboard-page",
  },
  {
    path: "/gallery/pages/earnings",
    label: "Earnings",
    kind: "page",
    purpose:
      "Earnings analytics (EarningsPage) — range-toggled tracked bars, stat chips, contribution heatmap.",
    importFrom: "@/components/pages/earnings-page",
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
      "Recharts recipes (blocks/chart-demos) plus the interactive kit (blocks/interactive-charts): tracked bars, rings, score ring, heatmap, ring calendar.",
    importFrom: "@/components/blocks/chart-demos",
  },
];

export { GALLERY_CATALOG };
export type { GalleryEntry };
