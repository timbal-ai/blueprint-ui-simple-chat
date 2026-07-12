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
    purpose: "Eight Recharts recipes wired to ChartCard.",
    importFrom: "@/components/blocks/chart-demos",
  },
];

export { GALLERY_CATALOG };
export type { GalleryEntry };
