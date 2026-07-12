import { toast } from "sonner";

import { HrDashboardPage } from "@/components/pages/hr-dashboard-page";

/**
 * Gallery route: the reference dashboard — a REAL screen composed from
 * blocks (PageHeader → StatOverview → ChartCard → FilteredTable), not a
 * component zoo. This is the composition to copy for analytics/overview
 * pages; the primitive families have their own gallery sections.
 */
export default function GalleryBlocks() {
  return (
    <HrDashboardPage
      onEmployeeAction={(action, employee) =>
        toast(`${action}: ${employee.name}`)
      }
      onRecommendationAction={(action, rec) =>
        action === "approve"
          ? toast.success(`Approved: ${rec.title}`)
          : toast(`${action}: ${rec.title}`)
      }
    />
  );
}
